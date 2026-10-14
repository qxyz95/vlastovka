// Člověk (karta 7 v research/design/11-katalog-ctvrt1.md): papírová postavička (Tearaway): hlava kotouč, trup lichoběžník, ruce a nohy jako proužky.
// Jen čela (instancovaný mesh pro celou čtvrť, 1 draw call); reakce (pose.js turn, wave, point, jump, cheer) otáčí ruce kolem ramene PERSON.shoulder.
// Postoje: stojí, jde (nohy rozkročené, kreslí se „on twos“), sedí (lavička, nástupiště; stehna jako lišta ke kameře, sedák ve výšce PERSON.seat).
// Souřadnice: x na střed postavy, y = 0 chodidla, čelo v z = 0. Dítě = stejný model × 0,7 (1,2 m).
import { palette, PAPER_TOKENS as T } from '../palette.js';
import { SCALE, LOD_LAYER } from './scale.js';
import { lista, tones } from './parts.js';

// Míry karty (1,7 m): hlava ⌀ 0,45, trup 0,75 (lichoběžník 0,55 → 0,4), nohy 0,8, ruce 0,65. Hlava překrývá ramena (papírová postavička).
export const PERSON = Object.freeze({
  h: SCALE.person,
  head: 0.225,
  trunk: 0.75,
  shoulders: 0.55,
  waist: 0.4,
  leg: 0.8,
  arm: 0.65,
  limb: 0.13,
  hip: 0.72,
  seat: 0.45,
  child: 0.7,
  shoulder: Object.freeze({ x: 0.235, y: 1.42 }),
});
const L = () => palette('papir').life,
  D = () => palette('papir').city.districts[0];
const HAIR = () => [T.pencil, D().trunk, T.kraft];
const POSES = Object.freeze(['stand', 'walk', 'sit']),
  EXTRAS = Object.freeze(['none', 'bag', 'umbrella', 'hat', 'backpack']);
// Poly karta jen čelem (obal z bodů); z = hloubka čela (vrstvy postavy: nohy 0, trup .01, ruce .02, hlava .03).
const poly = (pts, z, color, part) => {
  const xs = pts.map(p => p[0]),
    ys = pts.map(p => p[1]),
    x = Math.min(...xs),
    y = Math.min(...ys);
  return {
    shape: 'poly',
    x,
    w: Math.max(...xs) - x,
    y,
    h: Math.max(...ys) - y,
    z: z - 0.01,
    d: 0.02,
    pts,
    color,
    part,
  };
};
// Proužek (ruka, noha) od bodu a v úhlu ang (0 = dolů, kladný = doprava) délky len a šířky w: obdélník CCW.
export function limb([x, y], ang, len, w, z, color, part) {
  const dx = Math.sin(ang),
    dy = -Math.cos(ang),
    nx = (-dy * w) / 2,
    ny = (dx * w) / 2,
    e = [x + dx * len, y + dy * len];
  const pts = [
    [x - nx, y - ny],
    [e[0] - nx, e[1] - ny],
    [e[0] + nx, e[1] + ny],
    [x + nx, y + ny],
  ];
  const area = pts.reduce((s, [a, b], i) => {
    const [c, d] = pts[(i + 1) % 4];
    return s + a * d - c * b;
  }, 0);
  return poly(area > 0 ? pts : pts.reverse(), z, color, part);
}
// Rozvržení postoje (čisté, bez barev): kyčel, úhly nohou, odklon rukou od těla (rad). Sedící: trup na stehnech 0,1 m nad sedákem.
function frame(pose) {
  const P = PERSON,
    sit = pose === 'sit',
    drop = sit ? P.hip - P.seat - 0.1 : 0,
    hip = P.hip - drop,
    top = hip + P.trunk,
    legs = pose === 'walk' ? [-0.32, 0.32] : [0, 0];
  return {
    sit,
    drop,
    hip,
    top,
    legs,
    arms: pose === 'walk' ? [0.28, 0.06] : sit ? [0.18, 0.18] : [0.1, 0.1],
    headY: P.h - drop - P.head,
  };
}
function build(p, lod) {
  const P = PERSON,
    F = frame(p.pose),
    life = L().people,
    cloth = life.cloth[p.cloth % life.cloth.length],
    skin = life.skin[p.skin % life.skin.length],
    hairC = HAIR()[p.hair % 3];
  const pants = tones(cloth).shade,
    { hip, top, headY } = F,
    out = [],
    k = p.child ? P.child : 1;
  // nohy: LOD 1 jeden díl; sedící = holeně svisle (sedák) + stehna (lišta ke kameře v LOD 0)
  if (lod)
    out.push(
      F.sit
        ? poly(
            [
              [-0.2, 0],
              [0.2, 0],
              [0.2, P.seat],
              [-0.2, P.seat],
            ],
            0,
            pants,
            'legs',
          )
        : poly(
            [
              [-0.2, 0],
              [0.2, 0],
              [0.12, hip + 0.05],
              [-0.12, hip + 0.05],
            ],
            0,
            pants,
            'legs',
          ),
    );
  else if (F.sit)
    out.push(
      lista({
        x: -0.21,
        w: 0.42,
        y: 0,
        h: P.seat + 0.14,
        front: 0.42,
        d: 0.42,
        color: pants,
        part: 'legs',
      }),
    );
  // čelo = holeně, horní řez = stehna
  else
    for (const [i, a] of F.legs.entries()) {
      const x = i ? 0.1 : -0.1,
        y = hip + 0.05,
        f = x + Math.tan(a) * y,
        w = (P.limb + 0.03) / 2;
      out.push(
        poly(
          [
            [f - w, 0],
            [f + w, 0],
            [x + w, y],
            [x - w, y],
          ],
          0,
          pants,
          'leg',
        ),
      );
    } // chodidla na zemi
  out.push(
    poly(
      [
        [-P.waist / 2, hip],
        [P.waist / 2, hip],
        [P.shoulders / 2, top],
        [-P.shoulders / 2, top],
      ],
      0.01,
      cloth,
      'trunk',
    ),
  );
  if (!lod)
    for (const [i, a] of F.arms.entries()) {
      const s = i ? 1 : -1;
      out.push(limb([s * P.shoulder.x, top - 0.05], s * a, P.arm, P.limb, 0.02, cloth, 'arm'));
    }
  out.push({
    shape: 'disc',
    x: 0,
    y: headY,
    r: P.head,
    n: lod ? 6 : 8,
    z: 0.03,
    d: 0.02,
    color: skin,
    part: 'head',
  });
  // vlasy / čepice: nízký lichoběžník přes temeno, horní hrana = výška postavy
  const hy = headY + P.head,
    hat = p.extra === 'hat' && !lod;
  out.push(
    poly(
      [
        [-P.head - 0.02, hy - 0.13],
        [P.head + 0.02, hy - 0.13],
        [P.head * 0.6, hy],
        [-P.head * 0.6, hy],
      ],
      0.04,
      hat ? D().roof[2] : hairC,
      hat ? 'hat' : 'hair',
    ),
  );
  if (!lod && p.extra !== 'none') {
    const ax = P.shoulders / 2 + 0.06,
      hand = top - 0.05 - P.arm;
    if (p.extra === 'bag')
      out.push(
        poly(
          [
            [ax - 0.02, hand - 0.32],
            [ax + 0.3, hand - 0.32],
            [ax + 0.3, hand + 0.02],
            [ax - 0.02, hand + 0.02],
          ],
          0.025,
          D().trunk,
          'bag',
        ),
      );
    if (p.extra === 'umbrella')
      out.push(
        limb([-ax, hand + 0.05], -0.1, (hand + 0.05) * 0.97, 0.07, 0.025, T.pencil700, 'umbrella'),
      );
    if (p.extra === 'hat')
      out.push(
        poly(
          [
            [-P.head - 0.12, hy - 0.16],
            [P.head + 0.12, hy - 0.16],
            [P.head + 0.12, hy - 0.1],
            [-P.head - 0.12, hy - 0.1],
          ],
          0.05,
          D().roof[2],
          'hat',
        ),
      );
    if (p.extra === 'backpack')
      out.push(
        poly(
          [
            [-P.shoulders / 2 - 0.06, hip + 0.15],
            [P.shoulders / 2 + 0.06, hip + 0.15],
            [P.shoulders / 2 + 0.06, top - 0.12],
            [-P.shoulders / 2 - 0.06, top - 0.12],
          ],
          0,
          T.kraft,
          'backpack',
        ),
      );
  }
  return k === 1 ? out : out.map(c => scale(c, k));
}
// Měřítko dítěte kolem chodidel (x = 0, y = 0).
const scale = (c, k) => ({
  ...c,
  x: c.x * k,
  y: c.y * k,
  ...(c.w != null ? { w: c.w * k, h: c.h * k } : {}),
  ...(c.r ? { r: c.r * k } : {}),
  ...(c.pts ? { pts: c.pts.map(([x, y]) => [x * k, y * k]) } : {}),
});
// Stínový proxy: kolečko na lichoběžníku jako jeden obrys (5 bodů, 3 △).
function shadow(p) {
  const P = PERSON,
    F = frame(p.pose),
    k = p.child ? P.child : 1,
    w = P.shoulders / 2,
    pts = [
      [-0.2, 0],
      [0.2, 0],
      [w, F.top],
      [0, P.h - F.drop],
      [-w, F.top],
    ].map(([x, y]) => [x * k, y * k]);
  return [poly(pts, -0.01, L().people.cloth[0], 'shadow')];
}
const Pp = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
export default Object.freeze({
  id: 'person',
  name: 'Člověk',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    'Papírová postavička (Tearaway): hlava kotouč, trup lichoběžník, ruce a nohy jako vystřižené proužky; 1,7 m, dítě 1,2 m.',
  purpose:
    'Lidé v ulicích a na střechách všech míst čtvrti 1 (dav na trhu), reagují na vlaštovku (pose.js); hlavní „odměna pohledem“.',
  params: Object.freeze({
    pose: Pp(POSES, 'stand'),
    cloth: Pp([0, 1, 2, 3, 4, 5], 0),
    skin: Pp([0, 1, 2, 3], 0),
    hair: Pp([0, 1, 2], 0),
    extra: Pp(EXTRAS, 'none'),
    child: Pp([0, 1], 0),
  }),
  // Výchozí varianta (stojí, dospělý): šířka mezi konci rukou, výška 1,7 m, hloubka vrstev čel.
  size: Object.freeze({ w: 0.75, h: SCALE.person, d: 0.06 }),
  tris: Object.freeze([20, 10, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
  shadow,
});
