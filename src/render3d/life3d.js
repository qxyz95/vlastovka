// Živá čtvrť Violet Suburbs v three.js: vše jako InstancedMesh (jeden draw call na druh + obrys), statické doplňky v jednom bufferu.
// Data a časování z life.js (čisté funkce). update() jen skládá matice a barvy instancí. Papírové město (H0, 03-art kap. 3): bez kouře, mraků,
// dronů, robota, reklamy a holuba (holuba kreslí companion3d.js); pás výhledu S-1 a auta schovaná v místě odhodu. Zbytek převede H4 na papírové modely.
import * as THREE from 'three';
import { mergeBlocks } from './geometry.js';
import { OLD_LIFE, PAPER_TOKENS } from './palette.js';
import { sway } from '../motion.js';
import {
  suburbLife,
  behindLaunch,
  carX,
  trainCars,
  birdAt,
  balloonAt,
  passTime,
  wake,
  windowLight,
  noticeAge,
  pose,
  crowdPose,
  onTwos,
  wrap,
  TRACK,
} from './life.js';

const C = h => new THREE.Color(h),
  m4 = new THREE.Matrix4(),
  q = new THREE.Quaternion(),
  eu = new THREE.Euler(0, 0, 0, 'YXZ'),
  P = new THREE.Vector3(),
  S = new THREE.Vector3(),
  tmp = new THREE.Color();
function bufferOf(m) {
  const g = new THREE.BufferGeometry();
  for (const [k, n] of [
    ['position', 3],
    ['normal', 3],
    ['uv', 2],
    ['color', 3],
    ['outline', 3],
  ])
    g.setAttribute(k, new THREE.BufferAttribute(m[k], n));
  g.computeBoundingSphere();
  return g;
}
const boxes = list => bufferOf(mergeBlocks(list, b => C(b.color ?? PAPER_TOKENS.paper).toArray()));
// Obrys pro obecnou geometrii: směr od středu (u kvádrů a koulí stačí).
function outlined(g) {
  g.computeBoundingBox();
  const c = g.boundingBox.getCenter(new THREE.Vector3()),
    p = g.attributes.position,
    o = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    P.fromBufferAttribute(p, i).sub(c).normalize();
    o.set([P.x, P.y, P.z], i * 3);
  }
  g.setAttribute('outline', new THREE.BufferAttribute(o, 3));
  return g;
}
// put: pozice, rotace (yaw y, pak x, pak z) a měřítko instance i.
function put(m, i, x, y, z, ry = 0, rx = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  eu.set(rx, ry, rz);
  q.setFromEuler(eu);
  m4.compose(P.set(x, y, z), q, S.set(sx, sy, sz));
  m.setMatrixAt(i, m4);
}
const hide = (m, i) => {
  m4.makeScale(0, 0, 0);
  m.setMatrixAt(i, m4);
};

export function createLife({ ramp, hull, thinHull }) {
  const L = suburbLife({ view: true }),
    K = OLD_LIFE,
    group = new THREE.Group(),
    meshes = [];
  const toonV = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp });
  const glow = new THREE.MeshBasicMaterial({ toneMapped: false }),
    glowV = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  // Instancovaná síť (+ volitelný obrys sdílející instanceMatrix). Dynamické, proto bez frustum cullingu.
  function inst(geo, mat, n, { outline = null, shadow = false, colors = null } = {}) {
    const m = new THREE.InstancedMesh(geo, mat, n);
    m.frustumCulled = false;
    m.castShadow = shadow;
    if (colors) colors.forEach((c, i) => m.setColorAt(i, tmp.set(c)));
    group.add(m);
    meshes.push(m);
    if (outline) {
      const h = new THREE.InstancedMesh(geo, outline, n);
      h.instanceMatrix = m.instanceMatrix;
      h.frustumCulled = false;
      group.add(h);
      m.userData.hull = h;
    }
    return m;
  }
  // Statické doplňky: komíny, nádrže, antény, stánky, koleje, tunel, nástupiště.
  const decorGeo = boxes(L.static),
    decor = new THREE.Mesh(decorGeo, toonV);
  decor.castShadow = decor.receiveShadow = true;
  group.add(decor, new THREE.Mesh(decorGeo, hull));
  // Auta: karoserie (barva instance), kabina, kola; světla zvlášť jako záře.
  const carGeo = boxes([
    { x: -2.1, w: 4.2, z: 0, d: 1.8, h: 0.85, y: 0.38, color: K.car.body },
    { x: -1.2, w: 2.3, z: 0, d: 1.6, h: 0.7, y: 1.23, color: K.car.cabin },
    ...[-1.4, 1.3].flatMap(x =>
      [-0.8, 0.8].map(z => ({ x, w: 0.75, z, d: 0.3, h: 0.62, y: 0, color: K.car.wheel })),
    ),
  ]);
  const cars = inst(carGeo, toonV, L.cars.length, {
    outline: thinHull,
    colors: L.cars.map(c => c.color),
  });
  const lightGeo = boxes([
    ...[-0.55, 0.55].map(z => ({ x: 2.08, w: 0.1, z, d: 0.4, h: 0.28, y: 0.8, color: K.car.head })),
    ...[-0.6, 0.6].map(z => ({
      x: -2.16,
      w: 0.1,
      z,
      d: 0.35,
      h: 0.25,
      y: 0.85,
      color: K.car.tail,
    })),
  ]);
  const carLights = inst(lightGeo, glowV, L.cars.length);
  // Vlak k řece: lokomotiva a vozy, okna svítí teple.
  const wagonGeo = boxes([
    { x: 0, w: TRACK.len, z: 0, d: 3, h: 3.4, y: 0.55, color: K.train.body },
    { x: 0.4, w: TRACK.len - 0.8, z: 0, d: 2.6, h: 0.45, y: 3.95, color: K.train.roof },
    ...[1.5, TRACK.len - 3].map(x => ({
      x,
      w: 1.6,
      z: 0,
      d: 2.8,
      h: 0.55,
      y: 0,
      color: K.train.wheel,
    })),
  ]);
  const train = inst(wagonGeo, toonV, TRACK.cars, {
    outline: hull,
    shadow: true,
    colors: K.train.cars,
  });
  const twGeo = boxes(
    Array.from({ length: 5 }, (_, i) => ({
      x: 1 + i * 2.2,
      w: 1.4,
      z: 1.52,
      d: 0.05,
      h: 1.1,
      y: 2.2,
      color: K.train.window,
    })),
  );
  const trainWin = inst(twGeo, glowV, TRACK.cars);
  // Lidé: tělo (barva oblečení), hlava (pleť), pravá ruka s kloubem v rameni. Měřítko 1,3 (komiksově větší).
  const N = L.people.length,
    PS = 1.3;
  const bodies = inst(
    boxes([
      { x: -0.31, w: 0.62, z: 0, d: 0.42, h: 1.05, y: 0 },
      { x: -0.49, w: 0.18, z: 0, d: 0.18, h: 0.7, y: 0.3 },
    ]),
    toonV,
    N,
    { outline: thinHull, shadow: true, colors: L.people.map(p => p.cloth) },
  );
  const heads = inst(boxes([{ x: -0.23, w: 0.46, z: 0, d: 0.46, h: 0.46, y: 1.1 }]), toonV, N, {
    outline: thinHull,
    colors: L.people.map(p => p.skin),
  });
  const arms = inst(boxes([{ x: -0.09, w: 0.18, z: 0, d: 0.18, h: 0.7, y: -0.7 }]), toonV, N, {
    colors: L.people.map(p => p.cloth),
  });
  // Okna, která se rozsvítí za vlaštovkou.
  const W = L.windows.length,
    WARM = K.windows,
    windows = inst(new THREE.PlaneGeometry(1, 1), glow, W, {
      colors: L.windows.map(w => WARM[Math.floor(w.h0 * 4)]),
    });
  // Prádlo a vlaječky: čtverec / trojúhelník zavěšený za horní hranu.
  const clothes = L.laundry.flatMap(l => l.items),
    flags = L.bunting.flatMap(b => b.items);
  const clothGeo = new THREE.PlaneGeometry(1, 1).translate(0, -0.5, 0),
    flagGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.6, 0, 0),
      new THREE.Vector3(0.6, 0, 0),
      new THREE.Vector3(0, -1.1, 0),
    ]);
  flagGeo.computeVertexNormals();
  const clothMat = new THREE.MeshToonMaterial({ gradientMap: ramp, side: THREE.DoubleSide });
  const cloth = inst(clothGeo, clothMat, clothes.length, { colors: clothes.map(c => c.color) }),
    flag = inst(flagGeo, clothMat, flags.length, { colors: flags.map(c => c.color) });
  // Větrníky (A03 Pinwheel): 4 lopatky.
  const pinGeo = new THREE.BufferGeometry().setFromPoints(
    [0, 1, 2, 3].flatMap(k => {
      const a = (k * Math.PI) / 2,
        r = (x, y) =>
          new THREE.Vector3(
            x * Math.cos(a) - y * Math.sin(a),
            x * Math.sin(a) + y * Math.cos(a),
            0,
          );
      return [r(0, 0), r(1, 0), r(0.15, 0.85)];
    }),
  );
  pinGeo.computeVertexNormals();
  const pins = inst(
    pinGeo,
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }),
    L.pinwheels.length,
    { colors: L.pinwheels.map(p => p.color) },
  );
  // Žárovky nad stánky a červená světla antén (barva instance se mění podle času).
  const B = L.bulbs.length,
    A = L.antennas.length,
    lights = inst(new THREE.BoxGeometry(0.3, 0.3, 0.3), glow, B + A, {
      colors: Array(B + A).fill(K.bulb.on),
    });
  L.bulbs.forEach((b, i) => put(lights, i, b.x, b.y, b.z));
  L.antennas.forEach((a, i) => put(lights, B + i, a.x, a.y + a.h + 0.15, a.z, 0, 0, 0, 1.6));
  // Ptáci (silueta ve tvaru V) a balóny.
  const birdN = L.flocks.reduce((s, f) => s + f.n, 0),
    birdGeo = new THREE.BufferGeometry().setFromPoints(
      [[-1], [1]].flatMap(([s]) => [
        new THREE.Vector3(-0.35, 0, 0),
        new THREE.Vector3(0.4, 0, 0),
        new THREE.Vector3(-0.1, 0.55, s * 1.3),
      ]),
    );
  const birds = inst(
    birdGeo,
    new THREE.MeshBasicMaterial({ color: K.bird, side: THREE.DoubleSide }),
    birdN,
  );
  const balloons = inst(
    outlined(new THREE.IcosahedronGeometry(1, 1)),
    new THREE.MeshToonMaterial({ gradientMap: ramp }),
    L.balloons.length,
    { outline: hull, colors: L.balloons.map(b => b.color) },
  );
  const baskets = inst(
    boxes([
      { x: -0.8, w: 1.6, z: 0, d: 1.6, h: 1.3, y: 0, color: K.basket },
      { x: -0.05, w: 0.1, z: 0, d: 0.1, h: 2.4, y: 1.3, color: K.rope },
    ]),
    toonV,
    L.balloons.length,
  );
  const instances = meshes.reduce((s, m) => s + m.count, 0);
  // Snímek: t = hodiny scény, X/Y vlaštovka (m), trail = stopa letu, cheerAge = s od trefy.
  function update({ t, X, trail, cheerAge }) {
    const T = onTwos(t);
    L.cars.forEach((c, i) => {
      const x = carX(c, t),
        r = c.dir > 0 ? 0 : Math.PI;
      if (behindLaunch(x)) {
        hide(cars, i);
        hide(carLights, i);
        return;
      }
      put(cars, i, x, 0, c.z, r);
      put(carLights, i, x, 0, c.z, r);
    });
    trainCars(t).forEach((x, i) => {
      if (x == null) {
        hide(train, i);
        hide(trainWin, i);
      } else {
        put(train, i, x, 0, TRACK.z);
        put(trainWin, i, x, 0, TRACK.z);
      }
    });
    // Okna: rozsvítí se za vlaštovkou.
    L.windows.forEach((w, i) => {
      const p = passTime(trail, w.x),
        l = p ? windowLight(t - p.t, p.y - w.y, w.h0) : 0;
      if (l <= 0) hide(windows, i);
      else put(windows, i, w.x, w.y, w.z, 0, 0, 0, w.w * l, w.h * l, 1);
    });
    // Lidé: otočí se, mávnou, ukážou, vyskočí; dav na tržnici jásá po trefě.
    L.people.forEach((p, i) => {
      const dx = X - p.x,
        age = noticeAge(trail, p, t),
        o = p.crowd ? crowdPose(p, age, dx, cheerAge) : pose(p.kind, age, dx, p.seed);
      const idle = p.crowd ? Math.abs(Math.sin(T * 2.5 + p.seed * 6)) * 0.05 : 0,
        y = p.y + o.hop + idle,
        c = Math.cos(o.yaw),
        s = Math.sin(o.yaw),
        ox = 0.4 * PS;
      put(bodies, i, p.x, y, p.z, o.yaw, 0, 0, PS);
      put(
        heads,
        i,
        p.x,
        y,
        p.z,
        o.yaw + (age == null ? Math.sin(T * 0.7 + p.seed * 9) * 0.25 : 0),
        0,
        0,
        PS,
      );
      put(arms, i, p.x + c * ox, y + 1.02 * PS, p.z - s * ox, o.yaw, 0, o.arm, PS);
    });
    // Prádlo a vlaječky ve větru, vír za vlaštovkou je rozhoupe.
    const flutter = (m, list, amp) =>
      list.forEach((it, i) => {
        const p = passTime(trail, it.x),
          age = p ? t - p.t : null,
          wk = p ? wake(age, p.y - it.y) : 0;
        put(
          m,
          i,
          it.x,
          it.y,
          it.z,
          0,
          0.1 * sway(t, it.x) + wk * amp * Math.sin(age * 14),
          0.05 * Math.sin(t * 2 + it.x),
          it.w ?? 1,
          it.h ?? 1,
          1,
        );
      });
    flutter(cloth, clothes, 1.15);
    flutter(flag, flags, 1.3);
    L.pinwheels.forEach((p, i) => {
      const ps = passTime(trail, p.x),
        boost = ps
          ? p.dir * 9 * (1 - Math.exp(-(t - ps.t) / 1.1)) * Math.exp(-Math.abs(ps.y - p.y) / 14)
          : 0;
      put(pins, i, p.x, p.y, p.z + 0.12, 0, 0, p.dir * t * 1.6 + boost, 0.9);
    });
    // Žárovky: běžící světla on twos, po trefě všechny bliknou.
    const party = cheerAge != null && cheerAge >= 0 && cheerAge < 1.6,
      step = Math.floor(T * 6);
    L.bulbs.forEach((b, i) =>
      lights.setColorAt(
        i,
        tmp.set(
          party ? K.bulb.party[(step + i) % 2 ? 0 : 1] : (b.i + step) % 3 ? K.bulb.on : K.bulb.off,
        ),
      ),
    );
    L.antennas.forEach((a, i) =>
      lights.setColorAt(
        B + i,
        tmp.set(wrap(t * 0.7 + a.x * 0.013, 0, 1) < 0.5 ? K.antenna.on : K.antenna.off),
      ),
    );
    lights.instanceColor.needsUpdate = true;
    let b = 0;
    L.flocks.forEach(fl => {
      for (let i = 0; i < fl.n; i++, b++) {
        const p = birdAt(fl, i, t);
        put(birds, b, p.x, p.y, p.z, p.dir > 0 ? 0 : Math.PI, 0, 0, 1.5, 1.5 * p.flap, 1.5);
      }
    });
    L.balloons.forEach((bl, i) => {
      const p = balloonAt(bl, t);
      put(balloons, i, p.x, p.y, p.z, t * 0.05, 0, 0, bl.r, bl.r * 1.18, bl.r);
      put(baskets, i, p.x, p.y - bl.r * 1.18 - 2.6, p.z);
    });
    for (const m of meshes) m.instanceMatrix.needsUpdate = true;
  }
  // Uvolní vlastní geometrie a materiály (obrysy hull a thinHull jsou sdílené ze scene.js).
  function dispose() {
    const seen = new Set();
    group.traverse(o => {
      if (o.geometry && !seen.has(o.geometry)) {
        seen.add(o.geometry);
        o.geometry.dispose();
      }
      if (o.material && o.material !== hull && o.material !== thinHull && !seen.has(o.material)) {
        seen.add(o.material);
        o.material.dispose();
      }
    });
    group.removeFromParent();
  }
  return { group, update, dispose, instances, meshes: meshes.length };
}
