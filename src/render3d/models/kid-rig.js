// Dítě C (H1, dávka H2) a praporek větru H5 ve hře (čisté): jedna dynamická geometrie = 1 draw call (11 kap. 4.2), dva LOD v jednom bufferu
// v pořadí [LOD H][praporek][LOD 1]; drawRange vybere „LOD H + praporek“ nebo „praporek + LOD 1“ (03-art kap. 1.5).
// Pózu skládá CPU do předem alokovaných polí (žádná alokace za snímek): tuhé díly z models/kid.js na kostře (kap. 1.4), úhly z tab. 1.7,
// ruka T míří na vlaštovku v ruce (pevná délka, dítě neklouže: chodidla se hýbou jen o `back`), praporek vlaje „on twos“ (reduced motion stojí, S-7).
// kidRig() → {count, positions, normals, colors, base, ranges, draw, lod, last, palms}; poseKid(rig, kid, hand, {t, reduced, lod}) zapíše polohy
// a normály aktivního LOD (svět, m). Fáze kid.phase: idle (úvod), aim, charge, throw, wave, rest = desk (panel Dílny), sit.
import { launchFlag } from './index.js';
import {
  KID,
  KID_MESH,
  KID_POSES,
  JOINTS,
  JOINT,
  RIG,
  kidJoints,
  kidVertices,
  armToward,
} from './kid.js';
import { DIORAMA } from './launch-site.js';
import { cardVertices } from '../paper-cards.js';
import { onTwos } from '../life.js';

// Chodidla dítěte ve světě (launch-site DIORAMA): dlaň ruky T v póze míření leží přesně v LAUNCH.hand (12 m).
export const KID_AT = DIORAMA.find(o => o.id === 'kid').at;
// pose.kidPose počítá couvnutí v m staré Dílny s dítětem 47 px × 0,25 m = 11,75 m; dítě H1 má 1,2 m.
export const KID_SCALE = KID.h / 11.75;
// LOD podle výšky dítěte na obrazovce (CSS px, kap. 1.3): pod 44 px LOD 1, zpět LOD H nad 52 px (hystereze proti přeblikávání při jízdě úvod → míření).
export const KID_LOD = Object.freeze({ down: 44, up: 52 });
export const kidLod = (px, prev = 0) =>
  !Number.isFinite(px) ? prev : prev ? (px > KID_LOD.up ? 0 : 1) : px < KID_LOD.down ? 1 : 0;
// Dýchání ±1 cm (tab. 1.7), mávání ruky F 2,75 ± 0,35 rad, obojí „on twos“; praporek: rozkmit a rychlost.
export const BREATH = Object.freeze({ amp: 0.01, speed: 2.5 }),
  WAVE = Object.freeze({ amp: 0.35, speed: 9 });
export const FLAG = Object.freeze({ amp: 0.07, speed: 7, wave: 2.2 });
const ease = u => u * u * (3 - 2 * u),
  lerp = (a, b, u) => a + (b - a) * u;
const angles = () => ({
  yaw: 0,
  lean: 0,
  back: 0,
  drop: 0,
  bob: 0,
  head: [0, 0],
  armT: [0, 0],
  armF: [0, 0],
  legR: 0,
  legL: 0,
});
const copy = (A, p) => {
  A.yaw = p.yaw;
  A.lean = p.lean;
  A.back = p.back;
  A.drop = p.drop;
  A.bob = 0;
  A.head[0] = p.head[0];
  A.head[1] = p.head[1];
  A.armT[0] = p.armT[0];
  A.armT[1] = p.armT[1];
  A.armF[0] = p.armF[0];
  A.armF[1] = p.armF[1];
  A.legR = p.legR;
  A.legL = p.legL;
  return A;
};
// A = mix(A, p, u) po složkách (lineárně, tab. 1.7 „přechody“).
const blend = (A, p, u) => {
  A.yaw = lerp(A.yaw, p.yaw, u);
  A.lean = lerp(A.lean, p.lean, u);
  A.head[0] = lerp(A.head[0], p.head[0], u);
  A.head[1] = lerp(A.head[1], p.head[1], u);
  A.armT[0] = lerp(A.armT[0], p.armT[0], u);
  A.armT[1] = lerp(A.armT[1], p.armT[1], u);
  A.armF[0] = lerp(A.armF[0], p.armF[0], u);
  A.armF[1] = lerp(A.armF[1], p.armF[1], u);
  A.legR = lerp(A.legR, p.legR, u);
  A.legL = lerp(A.legL, p.legL, u);
  return A;
};

export function kidRig() {
  const flag = cardVertices(launchFlag()),
    nH = KID_MESH[0].count,
    n1 = KID_MESH[1].count,
    nf = flag.p.length / 3,
    count = nH + nf + n1;
  const positions = new Float32Array(count * 3),
    normals = new Float32Array(count * 3),
    base = new Float32Array(count * 3),
    f0 = nH * 3;
  base.set(flag.p, f0);
  positions.set(flag.p, f0);
  normals.set(flag.n, f0);
  const colors = [...KID_MESH[0].color, ...flag.c, ...KID_MESH[1].color];
  // kořen praporku (konec trámu) a jeho délka po větru: nejlevější a nejpravější bod
  let fx0 = Infinity,
    fx1 = -Infinity;
  for (let i = 0; i < nf; i++) {
    const x = flag.p[i * 3];
    fx0 = Math.min(fx0, x);
    fx1 = Math.max(fx1, x);
  }
  const rig = {
    count,
    positions,
    normals,
    colors,
    base,
    at: KID_AT,
    root: [KID_AT.x, KID_AT.y, KID_AT.z],
    ranges: { h: [0, nH], flag: [nH, nH + nf], l1: [nH + nf, count] },
    draw: [
      [0, nH + nf],
      [nH, nf + n1],
    ],
    flag: { x0: fx0, len: fx1 - fx0 },
    lod: 0,
    J: new Float64Array(JOINTS.length * 12),
    A: angles(),
    track: Float64Array.of(KID_POSES.aim.armT[0], KID_POSES.aim.armT[1]),
    last: new Float64Array(6),
    palms: new Float64Array(6),
    aimArm: KID_POSES.aim.armF[0],
  };
  poseKid(rig, { phase: 'aim' }, null, { lod: 1 });
  poseKid(rig, { phase: 'aim' }, null, { lod: 0 });
  return rig;
}
// Úhly pózy pro fázi (bez alokace, do rig.A). k = plan.kid (pose.kidPose: phase, swing, lean, back, charge, aim = úhel mířidel ve °).
function poseAngles(rig, k, t, reduced) {
  const A = rig.A,
    ph = k.phase === 'rest' ? 'desk' : KID_POSES[k.phase] ? k.phase : 'aim',
    breath = reduced ? 0 : BREATH.amp * Math.sin(onTwos(t) * BREATH.speed);
  if (ph === 'aim' || ph === 'charge') {
    // míření: ruka F ukazuje úhel mířidel (je to informace, i s reduced motion); nabíjení: mix k nabíjení podle charge, záklon a couvnutí z kidPose
    copy(A, KID_POSES.aim);
    if (Number.isFinite(k.aim)) A.armF[0] = Math.PI / 2 + (k.aim * Math.PI) / 180;
    if (ph === 'charge') blend(A, KID_POSES.charge, Math.max(0, Math.min(1, k.charge ?? 0)));
    A.yaw = KID_POSES.aim.yaw;
    A.lean = k.lean ?? 0;
    A.back = (k.back ?? 0) * KID_SCALE;
    A.bob = breath;
    return A;
  }
  if (ph === 'throw') {
    // švih z naposledy sledovaného úhlu ruky T do výhozu, trup se stočí za hodem; reduced motion: švih zůstane, bez výpadu
    copy(A, KID_POSES.aim);
    A.armT[0] = rig.track[0];
    A.armT[1] = rig.track[1];
    A.armF[0] = rig.aimArm;
    const u = ease(Math.max(0, Math.min(1, k.swing ?? 0))),
      lr = A.legR,
      ll = A.legL;
    blend(A, KID_POSES.throw, u);
    if (reduced) {
      A.legR = lr;
      A.legL = ll;
    }
    return A;
  }
  copy(A, KID_POSES[ph]);
  if (ph === 'wave' && !reduced) A.armF[0] += WAVE.amp * Math.sin(onTwos(t) * WAVE.speed);
  if (ph === 'idle' || ph === 'desk') A.bob = breath;
  return A;
}
const T3 = new Float64Array(3);
// hand = poloha vlaštovky v ruce ve světě {x,y,z?} (míření, nabíjení): ruka T se v rameni natočí na ni (kid.armToward), délka pevná.
// Vrací rig.last = [rameno T x, y, dlaň T x, y, rameno z, dlaň z] (svět); rig.palms = [dlaň T x,y,z, dlaň F x,y,z].
export function poseKid(
  rig,
  k,
  hand = null,
  { t = 0, reduced = false, lod = rig.lod } = {},
  out = rig.positions,
) {
  const A = poseAngles(rig, k ?? { phase: 'aim' }, t, reduced),
    J = rig.J,
    track = !!hand && (!k?.phase || k.phase === 'aim' || k.phase === 'charge');
  kidJoints(A, J, rig.root);
  if (track) {
    const o = JOINT.coat * 12,
      sx = J[o + 9] + J[o + 1] * RIG.shoulder[1] - J[o + 2] * RIG.shoulder[2],
      sy = J[o + 10] + J[o + 4] * RIG.shoulder[1] - J[o + 5] * RIG.shoulder[2],
      sz = J[o + 11] + J[o + 7] * RIG.shoulder[1] - J[o + 8] * RIG.shoulder[2];
    const dx = hand.x - sx,
      dy = hand.y - sy,
      dz = (hand.z ?? 0) - sz;
    // do souřadnic trupu: R^T · d
    T3[0] = J[o] * dx + J[o + 3] * dy + J[o + 6] * dz;
    T3[1] = J[o + 1] * dx + J[o + 4] * dy + J[o + 7] * dz;
    T3[2] = J[o + 2] * dx + J[o + 5] * dy + J[o + 8] * dz;
    armToward(T3[0], T3[1], T3[2], A.armT[1], -1, A.armT);
    rig.track[0] = A.armT[0];
    rig.track[1] = A.armT[1];
    rig.aimArm = A.armF[0];
    kidJoints(A, J, rig.root);
  }
  rig.lod = lod;
  kidVertices(lod, J, out, rig.normals, lod ? rig.ranges.l1[0] : 0);
  // praporek: svislý rozkmit roste ke konci pásky (u kořene 0), vlna běží po větru; reduced motion = natočený, bez vlání
  const [f0, f1] = rig.ranges.flag,
    B = rig.base,
    T2 = reduced ? 0 : onTwos(t);
  for (let i = f0; i < f1; i++) {
    const x = B[i * 3],
      u = (x - rig.flag.x0) / (rig.flag.len || 1);
    out[i * 3] = x;
    out[i * 3 + 1] =
      B[i * 3 + 1] + (reduced ? 0 : FLAG.amp * u * Math.sin(T2 * FLAG.speed - u * FLAG.wave));
    out[i * 3 + 2] = B[i * 3 + 2];
  }
  const L = rig.last,
    P = rig.palms,
    a = JOINT.armT * 12,
    h = JOINT.handT * 12,
    f = JOINT.handF * 12;
  L[0] = J[a + 9];
  L[1] = J[a + 10];
  L[2] = J[h + 9];
  L[3] = J[h + 10];
  L[4] = J[a + 11];
  L[5] = J[h + 11];
  P[0] = J[h + 9];
  P[1] = J[h + 10];
  P[2] = J[h + 11];
  P[3] = J[f + 9];
  P[4] = J[f + 10];
  P[5] = J[f + 11];
  return L;
}
// Rozsah vrcholů pro geometry.setDrawRange (vrcholy, ne indexy): [start, count].
export const kidDrawRange = (rig, lod = rig.lod) => rig.draw[lod ? 1 : 0];
