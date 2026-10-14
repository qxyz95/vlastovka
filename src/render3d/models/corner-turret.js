// Nárožní dům s věžičkou (karta 6 v research/design/11-katalog-ctvrt1.md), dominanta místa 1 „Dílna a první střechy“: první výrazná silueta po vzletu.
// Předobraz: secesní nárožní domy s věžičkou a praporkem (Vinohrady, Budapešť). Přízemí + 4 patra (15 m) se střechou okapem ke kameře, na rohu
// arkýř přes 3 patra (vystouplá karta na konzole) a nad ním složený šestiboký hranol věžičky (3 viditelné stěny) s jehlanem a praporkem.
// Přízemí: vchod v krajní ose, nárožní obchod s výlohou; 1. patro (piano nobile) s nadpražími a 2 balkony s květinami. Jedinečný, jen zrcadlení.
import { palette, PAPER_TOKENS as T } from '../palette.js';
import { SCALE, CARD_DEPTH, LOD_LAYER } from './scale.js';
import {
  tones,
  block,
  lista,
  panel,
  eaveRoof,
  cornice,
  windowCut,
  door,
  balcony,
  chimney,
  downpipe,
  shopfront,
  outline,
  EAVE_H,
} from './parts.js';

const F = SCALE.floor,
  FLOORS = 5,
  BAYS = 5,
  BAY = 2.4,
  W = 14,
  H = FLOORS * F,
  X0 = -W / 2,
  MARGIN = (W - BAYS * BAY) / 2,
  bayX = i => X0 + MARGIN + BAY * (i + 0.5);
// Věžička nad nárožní osou: arkýř 4 m (patra 2–4, vystupuje 1 m), buben ⌀ 4 m o 6 m nad římsou (karta: 16 + 5), jehlan 4 m, praporek 1 × 0,7 m.
export const TURRET = Object.freeze({
  cx: bayX(BAYS - 1),
  w: 4,
  out: 1,
  from: 2 * F,
  drum: 6,
  helm: 4,
  ov: 0.25,
  pole: 1.4,
  flag: Object.freeze({ w: 1, h: 0.7 }),
});
const C = () => palette('papir').city.districts[0];
const DRUM_D = TURRET.w * Math.sin(Math.PI / 3),
  DRUM_Z = TURRET.out - DRUM_D / 2,
  TOP = H + TURRET.drum;
// Zrcadlo kolem x = 0 (věžička vlevo); poly obrátí pořadí bodů (zůstane CCW), první bod (střed vějíře) zůstane první.
const mirror = list =>
  list.map(c =>
    c.shape === 'disc'
      ? { ...c, x: -c.x }
      : {
          ...c,
          x: -(c.x + c.w),
          ...(c.pts
            ? { pts: (m => [m[0], ...m.slice(1).reverse()])(c.pts.map(([x, y]) => [-x, y])) }
            : {}),
        },
  );
const tri = (pts, z, color, part) => {
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
    z: z - 0.025,
    d: 0.05,
    pts,
    color,
    part,
  };
};
const prism = o => ({ shape: 'prism', n: 6, part: 'turret', ...o });
// Věžička: buben v barvě stěny (odliší se od střechy a jehlanu, 14. 10.) (LOD 2 sahá až k patě arkýře, tvoří jednu siluetu), jehlan s přesahem, stožár (0,08 m, jedna linka D-1) a praporek.
function turret(roof, lod, wall) {
  const { cx, w, helm, ov, pole, flag } = TURRET,
    out = [
      prism({
        x: cx - w / 2,
        w,
        y: lod === 2 ? TURRET.from : H,
        h: lod === 2 ? TOP - TURRET.from : TURRET.drum,
        z: DRUM_Z,
        d: DRUM_D,
        top: false,
        color: wall,
      }),
      prism({
        x: cx - w / 2 - ov,
        w: w + 2 * ov,
        y: TOP,
        h: helm,
        z: DRUM_Z,
        d: DRUM_D + 2 * ov * Math.sin(Math.PI / 3),
        apex: true,
        color: roof,
        part: 'helm',
      }),
    ];
  if (lod < 2)
    out.push(...windowCut({ cx, y: H + SCALE.sill, front: TURRET.out, t: tones(wall), lod }));
  out.push(
    panel({
      x: cx - 0.04,
      w: 0.08,
      y: TOP + helm - 0.2,
      h: pole + 0.2,
      front: DRUM_Z + 0.06,
      color: roof,
      part: 'pole',
    }),
  );
  const fy = TOP + helm + pole - flag.h - 0.05;
  out.push(
    tri(
      [
        [cx + 0.04, fy],
        [cx + 0.04 + flag.w, fy + flag.h / 2],
        [cx + 0.04, fy + flag.h],
      ],
      DRUM_Z + 0.08,
      T.tomato,
      'flag',
    ),
  );
  return out;
}
function build(p, lod) {
  const D = C(),
    wall = D.near[6],
    roofC = D.roof[0],
    t = tones(wall),
    bay = tones(t.trim),
    d = CARD_DEPTH.near,
    { cx, w, out: o } = TURRET;
  const roof = eaveRoof({ x: X0, w: W, y: H, d, wall, roof: roofC, back: lod === 0 });
  const out = [
    block({ x: X0, w: W, h: H, d, color: wall, shape: lod === 2 ? 'lista' : 'box' }),
    roof,
  ];
  if (lod === 2) return side(p, [...out, ...turret(roofC, 2, wall)]);
  out.push(
    ...chimney({
      r: roof,
      cx: X0 + W * 0.25,
      color: palette('papir').life.chimney,
      cap: tones(palette('papir').life.chimney).trim,
      lod,
      above: 1,
    }),
    cornice({ x: X0 - 0.15, w: W + 0.3, y: H - 0.32, h: 0.32, out: 0.3, color: t.trim }),
    ...turret(roofC, lod, wall),
  );
  // Arkýř: vystouplá karta v barvě mix(stěna, řez, .3) od 2. patra po římsu, pod ní konzola (obrácený lichoběžník).
  out.push(
    block({
      x: cx - w / 2,
      w,
      y: TURRET.from,
      h: H - TURRET.from,
      front: o,
      d: o,
      color: t.trim,
      part: 'oriel',
    }),
  );
  if (lod === 0)
    out.push(
      tri(
        [
          [cx - w / 2 + 0.5, TURRET.from - 0.9],
          [cx + w / 2 - 0.5, TURRET.from - 0.9],
          [cx + w / 2, TURRET.from],
          [cx - w / 2, TURRET.from],
        ],
        o,
        t.trim,
        'oriel',
      ),
    );
  // Přízemí: vchod v ose 0, nárožní výloha přes osy 1–4.
  out.push(
    ...door({ cx: bayX(0), t, lod, canopy: lod ? null : roofC }),
    ...shopfront({
      x0: bayX(1) - BAY / 2 + 0.25,
      x1: bayX(BAYS - 1) + BAY / 2 - 0.25,
      t,
      glass: D.glass,
      awning: D.near[2],
      lod,
    }),
  );
  const balc = new Set([1, 3]),
    flowers = [D.trees[0], palette('papir').life.balloons[0], palette('papir').life.balloons[3]];
  for (let k = 1; k < FLOORS; k++)
    for (let i = 0; i < BAYS; i++) {
      const oriel = i === BAYS - 1 && k * F >= TURRET.from,
        front = oriel ? o : 0,
        y = k * F + SCALE.sill,
        lintel = k === 1;
      if (k === 1 && balc.has(i)) {
        out.push(
          ...windowCut({
            cx: bayX(i),
            y: F,
            h: SCALE.door.h,
            t,
            lod,
            lintel: !lod,
            part: 'balconyDoor',
          }),
        );
        if (!lod) {
          const bw = BAY - 0.3,
            bx = bayX(i) - bw / 2;
          out.push(
            ...balcony({ cx: bayX(i), w: bw, y: F, color: t.trim, rail: T.pencil700 }),
            lista({
              x: bx,
              w: bw,
              y: F + 0.95,
              h: 0.25,
              front: 0.92,
              d: 0.25,
              color: D.trunk,
              part: 'flowerbox',
            }),
            ...flowers.map((c, j) => ({
              shape: 'flag',
              x: bx + 0.15 + (j * (bw - 0.3)) / 3,
              w: (bw - 0.3) / 3,
              y: F + 0.6,
              h: 0.4,
              z: 0.96,
              d: 0.04,
              color: c,
              part: 'flower',
            })),
          );
        }
        continue;
      }
      out.push(
        ...windowCut({ cx: bayX(i), y, front, t: oriel ? bay : t, lod, lintel: lintel && !lod }),
      );
    }
  if (lod === 0) {
    out.push(
      lista({
        x: X0 - 0.05,
        w: W + 0.1,
        h: 0.6,
        front: 0.06,
        d: 0.06,
        color: t.plinth,
        part: 'plinth',
      }),
      downpipe({ x: X0 + 0.15, y: H - 0.32, color: t.shade }),
    );
    for (let k = 1; k < FLOORS; k++)
      out.push(
        cornice({
          x: X0,
          w: W,
          y: k * F - 0.18,
          h: 0.18,
          out: 0.12,
          color: t.trim,
          part: 'stringcourse',
        }),
      );
  }
  return side(p, out);
}
const side = (p, list) => (p.side === 'left' ? mirror(list) : list);
// Stínový proxy: obrys domu do hřebene, věžička s jehlanem (8 bodů, 6 △), vějíř z paty věžičky.
function shadow(p) {
  const { cx, w, helm } = TURRET,
    r = H + EAVE_H,
    z = -CARD_DEPTH.near / 2,
    wall = C().near[6];
  const pts = [
    [cx, 0],
    [cx + w / 2, 0],
    [cx + w / 2, TOP],
    [cx, TOP + helm],
    [cx - w / 2, TOP],
    [cx - w / 2, r],
    [X0, r],
    [X0, 0],
  ];
  return side(p, [outline(pts, { z, color: wall })]);
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
export default Object.freeze({
  id: 'corner-turret',
  name: 'Nárožní dům s věžičkou',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    'Secesní nárožní dům s arkýřem, věžičkou s jehlanem a praporkem (pražské Vinohrady, Budapešť); nárožní obchod v přízemí.',
  purpose:
    'Dominanta místa 1 (1× v ulici za Dílnou, x ~120–150 m, místo jednoho řadového domu): první výrazná silueta po vzletu a obrázek pro teaser v Atlasu.',
  params: Object.freeze({ side: P(['right', 'left'], 'right') }),
  // Výchozí varianta: šířka se střechou okapem (boční přesah 0,2 m), výška po špici stožáru, hloubka od střechy po parapet arkýře.
  size: Object.freeze({ w: W + 0.4, h: TOP + TURRET.helm + TURRET.pole, d: 5.5 }),
  // Strop 11 kap. 4.3 [350, 100, 20]; LOD 2 bez komína (silueta nese věžička).
  tris: Object.freeze([350, 100, 20]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), p => build(p, 2)]),
  shadow,
});
