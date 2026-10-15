// Objekty událostí kolem vlaštovky (three.js), vidět v každé čtvrti. Vlastní integrátor (fáze a4), C2a nové události (research/atlas/05-art-udalosti.md).
// createCompanion({ramp,hull,palette,paper}) → {group,update({t,X,Y,vx,comp,carry,reduced,evs,burst,district,pxPerM}),stats(),dispose()}.
//   comp = life.companion(activeEvent(f),f.t) (holub), carry = f.carry (holub nese vlaštovku), evs = event-fx.eventScene (pára, termika, lampion,
//   hvězda), burst = event-fx.burstOf (hvězdičky výtrysku hvězdy), district = čtvrť 0–3 (ve čtvrti 4 lampion svítí, hvězda krémová), pxPerM = CSS px na m.
// Poloha a čas jsou z čistých funkcí event-fx.js; tady jen kotva události (X, Y, vx a t při prvním snímku) a zápis do bufferů bez alokace.
// Poryv nemá 3D objekt (rozhodnutí 06 15. 10.: ventilace jen u Steam Hop). Rozpočet: aktivní je jedna událost, nejvýš +4 DC a +400 △.
import * as THREE from 'three';
import { mergeBlocks } from './geometry.js';
import { cardGeometry, ID } from './paper.js';
import { buildModel } from './models/index.js';
import { starTriangles, tailStrip, starColors } from './models/shooting-star.js';
import {
  STEAM_FX,
  steamHead,
  grateAlpha,
  anchorX,
  THERMAL_FX,
  columnSpan,
  ribbonWave,
  thermalScrap,
  columnLook,
  LANTERN_FX,
  lanternPose,
  lanternBase,
  lanternLod,
  STAR_FX,
  starPose,
  stardust,
} from './event-fx.js';
import { onTwos } from './life.js';
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
// Dynamický buffer n trojúhelníků (pozice, volitelně barva RGBA); nevyužité trojúhelníky zůstávají degenerované v nule.
function dynamic(tris, rgba = false) {
  const g = new THREE.BufferGeometry(),
    pos = new THREE.BufferAttribute(new Float32Array(tris * 9), 3);
  pos.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('position', pos);
  if (rgba) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(tris * 12), 4));
  return g;
}
const setRGBA = (arr, i, col, a) => {
  arr[i * 4] = col.r;
  arr[i * 4 + 1] = col.g;
  arr[i * 4 + 2] = col.b;
  arr[i * 4 + 3] = a;
};
// Holub v poměru k vlaštovce jako ve 2D (20 px : 31 px, vlaštovka 7,75 m); při nesení drápy na hřbetu vlaštovky.
export const PIGEON = { scale: 1.8, carryY: 3.3 };
// Rozpočet △ jednotlivých objektů (testy a perf-check): pára = skříň 8 + mřížka 12 + 2 pruhy 4 + 6 obláčků 48; termika = stužky 48 + tělo 2 + útržky 20;
// lampion LOD 0 72 + záře 8; hvězda 32 + ohon 36 + hvězdičky 6 × 8.
export const EVENT_TRIS = Object.freeze({ steam: 72, thermal: 70, drone: 80, star: 116 });
const OCT = 8,
  STEAM_TRIS = 2 * 2 + 2 * 3 * OCT,
  RIB_TRIS = 2 * THERMAL_FX.segs * 2,
  THERM_TRIS = RIB_TRIS + 2,
  TAIL_TRIS = 3 * STAR_FX.segs * 2;
export function createCompanion({ ramp, hull, palette, paper = null }) {
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
  const flat = (o = {}) =>
    mk(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, depthWrite: false, ...o }));
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

  // ── Pára (kap. 1.1): ventilace (papírová skříň + mřížka, která dýchá) a dva výtrysky: pruh 1,2 → 0,6 m a hlava ze 3 osmiúhelníků, 1 DC.
  const vent = new THREE.Group(),
    ventCards = [{ shape: 'box', x: -2.2, w: 4.4, y: 0, h: 1.6, z: 0, d: 3, color: K.vent }];
  vent.add(
    new THREE.Mesh(
      mk(paper ? cardGeometry(ventCards) : boxes(ventCards)),
      paper ? paper.material(ID.near) : toon,
    ),
  );
  const grate = new THREE.Mesh(
    mk(new THREE.BoxGeometry(3.6, 0.08, 2.2)),
    mk(new THREE.MeshBasicMaterial({ color: K.grate, toneMapped: false, transparent: true })),
  );
  grate.position.y = 1.62;
  vent.add(grate);
  vent.visible = false;
  group.add(vent);
  const steamGeo = mk(dynamic(STEAM_TRIS)),
    steam = new THREE.Mesh(
      steamGeo,
      flat({ color: K.steam, transparent: true, opacity: K.steamAlpha }),
    );
  steam.frustumCulled = false;
  steam.renderOrder = 4;
  steam.visible = false;
  group.add(steam);
  const octRot = [0.3, 1.1, 2.0, 0.7, 1.6, 2.6];
  // ── Termika (kap. 2.1): stužky + tělo v jednom bufferu s alfou ve vrcholech (1 DC), útržky instancované (1 DC).
  const thermGeo = mk(dynamic(THERM_TRIS, true)),
    thermal = new THREE.Mesh(
      thermGeo,
      flat({ vertexColors: true, transparent: true, toneMapped: true }),
    );
  thermal.frustumCulled = false;
  thermal.renderOrder = 2;
  thermal.visible = false;
  group.add(thermal);
  const scraps = new THREE.InstancedMesh(
    mk(new THREE.PlaneGeometry(...THERMAL_FX.scrap)),
    flat({ depthWrite: true }),
    THERMAL_FX.scraps,
  );
  for (let i = 0; i < THERMAL_FX.scraps; i++)
    scraps.setColorAt(i, C(K.thermal.scraps[i % K.thermal.scraps.length]));
  scraps.frustumCulled = false;
  scraps.visible = false;
  group.add(scraps);
  const edgeC = C(K.thermal.edge),
    bodyDay = C(K.thermal.body),
    bodyNight = C(K.thermal.night);
  // ── Sky Lantern (kap. 3.1): model sky-lantern (LOD 0/1, den / noc), ve dne papírový materiál a nesvítí, ve čtvrti 4 svítí (bez stínování,
  // toneMapped false) s měkkým kotoučem záře za sebou (normální míchání, alfa 0,22). 1–2 DC.
  const lanGeo = new Map(),
    lanternGeo = (lod, night) => {
      const k = lod + (night ? 'n' : 'd');
      if (!lanGeo.has(k))
        lanGeo.set(
          k,
          mk(cardGeometry(buildModel('sky-lantern', lod, { variant: night ? 'night' : 'day' }))),
        );
      return lanGeo.get(k);
    };
  const lanDay = paper
      ? paper.material(ID.balloon)
      : mk(new THREE.MeshBasicMaterial({ vertexColors: true })),
    lanNight = mk(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })),
    lanternPivot = new THREE.Group(),
    lantern = new THREE.Mesh(lanternGeo(0, false), lanDay),
    glow = new THREE.Mesh(
      mk(new THREE.CircleGeometry(1, 8)),
      flat({
        color: K.lantern.night,
        transparent: true,
        opacity: K.lantern.glowAlpha,
        toneMapped: false,
      }),
    );
  lantern.position.y = -2.35;
  lanternPivot.add(lantern);
  lanternPivot.visible = false;
  glow.visible = false;
  glow.renderOrder = 1;
  group.add(lanternPivot, glow);
  let lanLod = 0;
  // ── Padající hvězda (kap. 4.1): hvězda + ohon v jednom bufferu s alfou (1 DC), hvězdičky výtrysku instancované (1 DC).
  const ST = starTriangles(),
    starLocal = [ST.front.p, ST.back.p, ST.side.p],
    starN = (ST.front.p.length + ST.back.p.length + ST.side.p.length) / 3,
    starGeo = mk(dynamic(starN / 3 + TAIL_TRIS, true)),
    star = new THREE.Mesh(starGeo, flat({ vertexColors: true, transparent: true })),
    dustGeo = new THREE.BufferGeometry(),
    small = starTriangles({ r: STAR_FX.dustR, inner: STAR_FX.dustR / 4, back: false }).front;
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(small.p, 3));
  mk(dustGeo);
  const dustMat = flat({ depthWrite: true }),
    dust = new THREE.InstancedMesh(dustGeo, dustMat, STAR_FX.dust);
  star.frustumCulled = dust.frustumCulled = false;
  star.renderOrder = 5;
  star.visible = dust.visible = false;
  group.add(star, dust);
  const tails = [0, 1, 2].map(k => tailStrip(k));
  let starNight = null;
  const paintStar = night => {
    if (starNight === night) return;
    starNight = night;
    const col = starColors(night ? 'night' : 'day'),
      body = C(col.body),
      cut = C(col.cut),
      a = starGeo.attributes.color.array;
    let v = 0;
    for (let i = 0; i < ST.front.p.length / 3 + ST.back.p.length / 3; i++) setRGBA(a, v++, body, 1);
    for (let i = 0; i < ST.side.p.length / 3; i++) setRGBA(a, v++, cut, 1);
    for (const s of tails)
      for (let j = 0; j + 1 < s.length; j++)
        for (const u of [s[j][4], s[j][4], s[j + 1][4], s[j][4], s[j + 1][4], s[j + 1][4]])
          setRGBA(a, v++, body, K.star.tailAlpha * (1 - u));
    starGeo.attributes.color.needsUpdate = true;
    dustMat.color.copy(body);
  };
  let anchor = null;
  const hideAll = () => {
    vent.visible = steam.visible = thermal.visible = scraps.visible = false;
    lanternPivot.visible = glow.visible = star.visible = false;
  };

  function writeSteam(ev, a, t, Y, reduced) {
    const w = ev.w,
      pos = steamGeo.attributes.position.array,
      x0 = anchorX(a.X, a.vx, w.c[0], a.t0);
    pos.fill(0);
    let o = 0;
    const v = (x, y) => {
      pos[o++] = x;
      pos[o++] = y;
      pos[o++] = 0;
    };
    vent.position.set(x0, 0, STEAM_FX.z);
    grate.material.opacity = reduced ? 1 : grateAlpha(w, t);
    steam.position.set(0, 0, STEAM_FX.z);
    for (let i = 0; i < 2; i++) {
      const h = steamHead(w, i, t, Y, ev.puffs?.[i] ?? null, reduced),
        hx = x0 + a.vx * (w.c[i] - w.c[0]);
      if (!h || !(h.size > 0)) {
        o += 9 * (2 + 3 * OCT);
        continue;
      }
      const [wb, wt] = STEAM_FX.jet;
      v(x0 - wb / 2, h.from);
      v(x0 + wb / 2, h.from);
      v(hx + wt / 2, h.y);
      v(x0 - wb / 2, h.from);
      v(hx + wt / 2, h.y);
      v(hx - wt / 2, h.y);
      for (let k = 0; k < 3; k++) {
        const r = STEAM_FX.puffs[k] * h.size,
          cx = hx + [-0.9, 0.8, 0][k] * h.size,
          cy = h.y + [0, 0.4, 1][k] * h.size,
          rot = octRot[i * 3 + k];
        for (let j = 0; j < OCT; j++) {
          const a0 = rot + (j / OCT) * Math.PI * 2,
            a1 = rot + ((j + 1) / OCT) * Math.PI * 2;
          v(cx, cy);
          v(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r);
          v(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        }
      }
    }
    steamGeo.attributes.position.needsUpdate = true;
  }
  function writeThermal(ev, a, t, X, Y, reduced, night) {
    const w = ev.w,
      cx = anchorX(a.X, a.vx, w.c, a.t0),
      span = columnSpan(w, a.vx),
      age = ev.resolvedAt != null ? t - ev.resolvedAt : null,
      look = columnLook(Y, ev.result, age ?? 0, reduced),
      T = reduced ? 0 : onTwos(t),
      pos = thermGeo.attributes.position.array,
      col = thermGeo.attributes.color.array,
      n = THERMAL_FX.segs,
      hw = THERMAL_FX.ribbon / 2,
      body = night ? bodyNight : bodyDay,
      bodyA = (night ? K.thermal.nightAlpha : K.thermal.bodyAlpha) * look.body;
    let o = 0,
      vi = 0;
    const v = (x, y, c, al) => {
      pos[o++] = x;
      pos[o++] = y;
      pos[o++] = 0;
      setRGBA(col, vi++, c, al);
    };
    const xl = cx - span.width / 2,
      xr = cx + span.width / 2;
    v(xl, 0, body, bodyA);
    v(xr, 0, body, bodyA);
    v(xr, look.top, body, bodyA);
    v(xl, 0, body, bodyA);
    v(xr, look.top, body, bodyA);
    v(xl, look.top, body, bodyA);
    for (const [k, x] of [
      [0, xl],
      [1, xr],
    ])
      for (let j = 0; j < n; j++) {
        const y0 = (look.top * j) / n,
          y1 = (look.top * (j + 1)) / n,
          d0 = x + ribbonWave(k, y0, T, reduced),
          d1 = x + ribbonWave(k, y1, T, reduced);
        v(d0 - hw, y0, edgeC, 1);
        v(d0 + hw, y0, edgeC, 1);
        v(d1 + hw, y1, edgeC, 1);
        v(d0 - hw, y0, edgeC, 1);
        v(d1 + hw, y1, edgeC, 1);
        v(d1 - hw, y1, edgeC, 1);
      }
    thermGeo.attributes.position.needsUpdate = true;
    thermGeo.attributes.color.needsUpdate = true;
    thermal.position.set(0, 0, THERMAL_FX.z);
    const o2 = { x: cx, core: span.core, X, Y, grade: ev.result, age: age ?? Infinity, reduced };
    for (let i = 0; i < THERMAL_FX.scraps; i++) {
      const s = thermalScrap(i, t, o2);
      eu.set(0, 0, s?.rot ?? 0);
      q.setFromEuler(eu);
      m4.compose(P.set(s?.x ?? 0, s?.y ?? 0, THERMAL_FX.z + 0.5), q, S.setScalar(s ? s.s : 0));
      scraps.setMatrixAt(i, m4);
    }
    scraps.instanceMatrix.needsUpdate = true;
  }
  function writeStar(pose) {
    const pos = starGeo.attributes.position.array,
      c = Math.cos(pose.spin),
      s = Math.sin(pose.spin);
    let o = 0;
    for (const L of starLocal)
      for (let i = 0; i < L.length; i += 3) {
        pos[o++] = pose.x + L[i] * c - L[i + 1] * s;
        pos[o++] = pose.y + L[i] * s + L[i + 1] * c;
        pos[o++] = L[i + 2];
      }
    for (const st of tails)
      for (let j = 0; j + 1 < st.length; j++) {
        const [ax, ay, bx, by] = st[j],
          [cx, cy, dx, dy] = st[j + 1];
        for (const [x, y] of [
          [ax, ay],
          [bx, by],
          [dx, dy],
          [ax, ay],
          [dx, dy],
          [cx, cy],
        ]) {
          pos[o++] = pose.x + x;
          pos[o++] = pose.y + y;
          pos[o++] = -0.1;
        }
      }
    starGeo.attributes.position.needsUpdate = true;
    star.position.set(0, 0, STAR_FX.z);
    star.material.opacity = pose.alpha;
  }

  function update({
    t = 0,
    X = 0,
    Y = 0,
    vx = 0,
    vy = 0,
    comp = null,
    carry = 0,
    reduced = false,
    evs = null,
    burst = null,
    district = 0,
    pxPerM = 5,
  } = {}) {
    const T = reduced ? 0 : onTwos(t),
      bird = !!comp;
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
    const night = district === 3;
    // Kotva: kde je vlaštovka při prvním snímku události; objekt pak stojí tam, kde bude vlaštovka ve středu okna.
    if (!evs) anchor = null;
    else if (anchor?.key !== evs.key) anchor = { key: evs.key, X, Y, vx, t0: t };
    hideAll();
    const type = evs?.type;
    if (type === 'steam') {
      vent.visible = steam.visible = true;
      writeSteam(evs, anchor, t, Y, reduced);
    } else if (type === 'thermal') {
      thermal.visible = scraps.visible = true;
      writeThermal(evs, anchor, t, X, Y, reduced, night);
    } else if (type === 'drone') {
      if (!anchor.base || (!evs.result && t <= evs.w.close))
        anchor.base = lanternBase(X, Y, vx, vy, evs.w.close, t);
      const pose = lanternPose(anchor.base, evs, t, reduced);
      if (pose) {
        lanLod = lanternLod(pxPerM, lanLod);
        const g = lanternGeo(lanLod, night),
          s = pose.scale * Math.max(0.05, pose.alpha);
        if (lantern.geometry !== g) lantern.geometry = g;
        lantern.material = night ? lanNight : lanDay;
        lanternPivot.visible = true;
        lanternPivot.position.set(pose.x, pose.y, pose.z);
        lanternPivot.rotation.set(0, pose.yaw, pose.roll);
        lanternPivot.scale.setScalar(s);
        // záře jen ve čtvrti 4, nepulzuje (rozhodnutí 06 14. 10.)
        glow.visible = night;
        glow.position.set(pose.x, pose.y, pose.z - 1);
        glow.scale.setScalar(1.5 * 4.4 * s);
      }
    } else if (type === 'star') {
      const pose = starPose(evs.w, t, X, Y, evs.result, evs.resolvedAt, reduced);
      if (pose) {
        paintStar(night);
        star.visible = true;
        writeStar(pose);
      }
    }
    // Hvězdičky výtrysku hvězdy (kap. 4.1): drží se za vlaštovkou po dobu výtrysku a mizí s ním (mohou doběhnout souběžně s další událostí).
    dust.visible = burst?.tag === 'star';
    if (dust.visible) {
      paintStar(night);
      for (let i = 0; i < STAR_FX.dust; i++) {
        const d = stardust(i, burst.age, burst.k, X, Y, reduced);
        eu.set(0, 0, d?.spin ?? 0);
        q.setFromEuler(eu);
        m4.compose(P.set(d?.x ?? 0, d?.y ?? 0, STAR_FX.z), q, S.setScalar(d ? d.s : 0));
        dust.setMatrixAt(i, m4);
      }
      dust.instanceMatrix.needsUpdate = true;
    }
  }
  // Počet viditelných síťových objektů událostí (kontrola rozpočtu DC v testech a perf-check).
  const stats = () => {
    let calls = 0;
    group.traverseVisible(o => {
      if (o.isMesh && o !== group) calls++;
    });
    return { calls, lanternLod: lanLod };
  };
  return {
    group,
    update,
    stats,
    pigeon,
    vent,
    steam,
    thermal,
    scraps,
    lantern: lanternPivot,
    glow,
    star,
    dust,
    dispose() {
      for (const o of own) o.dispose?.();
      group.removeFromParent();
    },
  };
}
