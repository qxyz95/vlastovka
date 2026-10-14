// Holub-kurýr a pára z ventilace kolem vlaštovky (three.js), vidět v každé čtvrti. Vlastní integrátor (fáze a4).
// createCompanion({ramp,hull,palette}) → {group,update({t,X,Y,vx,ev,comp,carry,reduced}),dispose()}.
//   comp = life.companion(activeEvent(f),f.t) (offset v m od vlaštovky), ev = {at,phase} aktivní události, carry = f.carry (holub nese vlaštovku).
// Pára: ventilace stojí na zemi tam, kde bude vlaštovka ve středu okna poryvu (X + vx·(at + gustCenter − t)), sloup páry stoupá k ní,
// po trefě se rozfoukne nahoru, po minutí se rozplyne. Holub: přilétá, drží se u vlaštovky, po trefě ji nese (drápy nad hřbetem).
import * as THREE from 'three';
import { mergeBlocks } from './geometry.js';
import { TIMING } from '../events.js';
import { onTwos, wrap } from './life.js';
const C = h => new THREE.Color(h),
  m4 = new THREE.Matrix4(),
  q = new THREE.Quaternion(),
  eu = new THREE.Euler(),
  P = new THREE.Vector3(),
  S = new THREE.Vector3();
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
const boxes = list => bufferOf(mergeBlocks(list, b => C(b.color).toArray()));
// Holub v poměru k vlaštovce jako ve 2D (20 px : 31 px, vlaštovka 7,75 m); při nesení drápy na hřbetu vlaštovky.
export const PUFFS = 16,
  STEAM = { life: 1.1, z: -1.2, top: 4 },
  PIGEON = { scale: 1.8, carryY: 3.3 };
export function createCompanion({ ramp, hull, palette }) {
  const K = palette.companion,
    group = new THREE.Group(),
    own = [],
    mk = o => (own.push(o), o);
  const toon = mk(new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: ramp }));
  const solid = (list, parent) => {
    const g = mk(boxes(list)),
      m = new THREE.Mesh(g, toon),
      h = new THREE.Mesh(g, hull);
    m.castShadow = true;
    parent.add(m, h);
    return m;
  };
  // Holub (měřítko jako v life3d.js), křídla s kloubem u těla, bageta pod zobákem, drápy (vidět při nesení).
  const pigeon = new THREE.Group(),
    wingL = new THREE.Group(),
    wingR = new THREE.Group(),
    feet = new THREE.Group();
  solid(
    [
      { x: -1.1, w: 2.2, z: 0, d: 1.1, h: 1.1, y: -0.55, color: K.body },
      { x: 0.8, w: 0.8, z: 0, d: 0.8, h: 0.8, y: 0.2, color: K.head },
      { x: 1.6, w: 0.4, z: 0, d: 0.25, h: 0.22, y: 0.45, color: K.beak },
      { x: -1.6, w: 0.7, z: 0, d: 0.6, h: 0.25, y: -0.2, color: K.tail },
      { x: 0.2, w: 2.6, z: 0.75, d: 0.35, h: 0.35, y: -0.75, color: K.bread },
    ],
    pigeon,
  );
  const eye = new THREE.Mesh(
    mk(new THREE.BoxGeometry(0.16, 0.16, 0.05)),
    mk(new THREE.MeshBasicMaterial({ color: K.eye, toneMapped: false })),
  );
  eye.position.set(1.35, 0.75, 0.42);
  pigeon.add(eye);
  for (const [w, s] of [
    [wingL, 1],
    [wingR, -1],
  ]) {
    w.position.set(-0.2, 0.4, s * 0.5);
    solid([{ x: -0.8, w: 1.4, z: s * 0.9, d: 1.8, h: 0.12, y: 0, color: K.wing }], w);
    pigeon.add(w);
  }
  solid(
    [-0.35, 0.35].map(z => ({ x: -0.1, w: 0.18, z, d: 0.18, h: 0.9, y: -1.45, color: K.beak })),
    feet,
  );
  pigeon.add(feet);
  pigeon.scale.setScalar(PIGEON.scale);
  pigeon.visible = false;
  group.add(pigeon);
  // Ventilace: skříň s mřížkou, která svítí podle síly páry.
  const vent = new THREE.Group();
  solid([{ x: -2.2, w: 4.4, z: 0, d: 3, h: 1.6, y: 0, color: K.vent }], vent);
  const grate = new THREE.Mesh(
    mk(new THREE.BoxGeometry(3.6, 0.08, 2.2)),
    mk(new THREE.MeshBasicMaterial({ color: K.grate, toneMapped: false, transparent: true })),
  );
  grate.position.y = 1.62;
  vent.add(grate);
  vent.visible = false;
  group.add(vent);
  // Obláčky páry: jedna instancovaná síť, toon, průhledná.
  const steamMat = mk(
      new THREE.MeshToonMaterial({
        color: K.steam,
        gradientMap: ramp,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    ),
    puffs = new THREE.InstancedMesh(mk(new THREE.IcosahedronGeometry(1, 0)), steamMat, PUFFS);
  puffs.frustumCulled = false;
  puffs.renderOrder = 4;
  group.add(puffs);
  let ventX = null,
    ventEv = null;
  const hideAll = () => {
    for (let i = 0; i < PUFFS; i++) {
      m4.makeScale(0, 0, 0);
      puffs.setMatrixAt(i, m4);
    }
    puffs.instanceMatrix.needsUpdate = true;
  };
  hideAll();
  function update({
    t = 0,
    X = 0,
    Y = 0,
    vx = 0,
    ev = null,
    comp = null,
    carry = 0,
    reduced = false,
  } = {}) {
    const T = reduced ? 0 : onTwos(t),
      bird = !!comp && comp.steam == null,
      steam = !!comp && comp.steam != null;
    pigeon.visible = bird;
    if (bird) {
      const carrying = carry > 0 || (comp.hit && comp.dy < 3);
      pigeon.position.set(
        X + comp.dx,
        carrying ? Y + PIGEON.carryY : Y + comp.dy,
        carrying ? 0.3 : 1.2,
      );
      pigeon.rotation.z = carrying ? -0.08 : comp.dy > 4 ? 0.3 : Math.sin(T * 3) * 0.06;
      const fl = (Math.floor(T * (carrying ? 14 : 8)) % 2 ? 0.75 : -0.55) * (reduced ? 0.3 : 1);
      wingL.rotation.x = -fl;
      wingR.rotation.x = fl;
      feet.visible = carrying;
    }
    // Ventilace se usadí, když poryv začne, a drží místo až do konce události.
    if (steam && ventEv !== ev?.at) {
      ventEv = ev?.at;
      ventX = X + Math.max(6, vx * Math.max(0, (ev?.at ?? t) + TIMING.gustCenter - t));
    }
    if (!steam) {
      ventEv = null;
      vent.visible = false;
      if (puffs.visible) {
        puffs.visible = false;
      }
      return;
    }
    const st = comp.steam,
      hit = !!comp.hit,
      done = ev?.phase === 'effect';
    vent.visible = true;
    puffs.visible = true;
    vent.position.set(ventX, 0, STEAM.z);
    grate.material.opacity = 0.35 + 0.65 * st;
    const top = Math.max(6, hit ? Y + 8 : Y + STEAM.top),
      rise = done && hit ? 1.8 : 1;
    for (let i = 0; i < PUFFS; i++) {
      const fr = wrap(((reduced ? 0.5 : t) * rise) / STEAM.life + i / PUFFS, 0, 1),
        y = 1.6 + fr * top,
        s = st * (0.9 + fr * (hit && done ? 3 : 1.6)) * (1 - 0.5 * fr),
        dx = Math.sin(i * 2.3 + t) * (0.6 + fr * 1.5);
      eu.set(i, i * 0.7, 0);
      q.setFromEuler(eu);
      m4.compose(
        P.set(ventX + dx, y, STEAM.z + Math.cos(i * 1.7) * 0.8),
        q,
        S.setScalar(Math.max(0, s)),
      );
      puffs.setMatrixAt(i, m4);
    }
    puffs.instanceMatrix.needsUpdate = true;
    steamMat.opacity = 0.85 * Math.min(1, st * 1.5);
  }
  return {
    group,
    update,
    pigeon,
    vent,
    dispose() {
      for (const o of own) o.dispose?.();
      group.removeFromParent();
    },
  };
}
