// Vzdálené město (karta 3 v research/design/11-katalog-ctvrt1.md): panorama starého města za ranním oparem (Alto's Odyssey, bible P3).
// Jeden blok dálky = 2–4 budovy různé výšky (sousední ≥ 3 m rozdíl), na plochých střechách 1–3 prvky siluety: komín, věžička s jehlanem,
// nádrž se stříškou, kopule. Jen v dálce (LOD 2), bez oken; detail nese jen tvar (kontrast proti nebi < 1,5 : 1), barvy D1.far tónově.
import { palette, mix } from '../palette.js';
import { CARD_DEPTH, LOD_LAYER } from './scale.js';
import { hash, lista, gableRoof, roofAt, outline } from './parts.js';

const C = () => palette('papir').city.districts[0],
  D_FAR = CARD_DEPTH.far,
  MIN_STEP = 3,
  MIN_H = 5;
const ELEMENTS = Object.freeze(['chimney', 'tower', 'tank', 'dome']);

// Rozvrh bloku (čistý, bez barev): budovy {x,w,h,roof}, prvky {kind,i}. Šířky z hashe (min ~3 m), výšky sousedů se liší aspoň o 3 m,
// sedlová střecha u ~60 % budov (nejvýš n − 1), 1–3 prvky, nejvýš jeden na budovu: na sedlové střeše jen komín, na ploché i věžička,
// nádrž nebo kopule. Nejbohatší blok (4 budovy, 3 prvky) drží strop 50 △.
export function skylineLayout({ w, h, seed }) {
  const n = 2 + Math.floor(hash(seed, 1) * 3),
    wt = Array.from({ length: n }, (_, i) => 0.6 + hash(seed, 10 + i)),
    sum = wt.reduce((a, b) => a + b, 0);
  let x = -w / 2;
  const B = wt.map((v, i) => {
    const b = {
      x,
      w: (w * v) / sum,
      h: Math.max(MIN_H, h * (0.55 + 0.45 * hash(seed, 20 + i))),
      roof: false,
    };
    x += b.w;
    return b;
  });
  for (let i = 1; i < n; i++) {
    const a = B[i - 1].h,
      b = B[i];
    if (Math.abs(b.h - a) < MIN_STEP)
      b.h = b.h >= a || a - MIN_STEP < MIN_H ? a + MIN_STEP : a - MIN_STEP;
  }
  B.map((b, i) => [hash(seed, 30 + i), i])
    .filter(([v]) => v < 0.6)
    .slice(0, n - 1)
    .forEach(([, i]) => (B[i].roof = true));
  const m = 1 + Math.floor(hash(seed, 2) * 3),
    E = [];
  for (let j = 0; j < m * 3 && E.length < m; j++) {
    const i = Math.floor(hash(seed, 40 + j) * n) % n;
    if (E.some(e => e.i === i)) continue;
    E.push({
      kind: B[i].roof
        ? 'chimney'
        : ELEMENTS[Math.floor(hash(seed, 50 + j) * ELEMENTS.length) % ELEMENTS.length],
      i,
    });
  }
  return { buildings: B, elements: E };
}
// Prvek siluety na střeše budovy b (čelo 2 m za čelem bloku, tónová barva); komín na sedlové střeše vyčnívá 1,5–3 m nad sklon.
function element(e, b, wall, cap, seed, roof) {
  const cx = b.x + b.w * (0.3 + 0.4 * hash(seed, 60 + e.i)),
    y = roof ? roofAt(roof, cx) - 0.5 : b.h,
    f = -2;
  if (e.kind === 'chimney') {
    const ch = (roof ? 2 : 2.5) + 1.5 * hash(seed, 70 + e.i);
    return [
      lista({ x: cx - 0.6, w: 1.2, y, h: ch, front: f, d: 1.2, color: wall, part: 'chimney' }),
    ];
  }
  if (e.kind === 'tower') {
    const tw = Math.min(3, b.w * 0.4),
      th = 4 + 3 * hash(seed, 70 + e.i);
    return [
      lista({ x: cx - tw / 2, w: tw, y, h: th, front: f, d: tw, color: wall, part: 'tower' }),
      {
        shape: 'pyr',
        x: cx - tw / 2 - 0.3,
        w: tw + 0.6,
        y: y + th,
        h: 3,
        z: f - tw / 2,
        d: tw + 0.6,
        color: cap,
        part: 'tower',
      },
    ];
  }
  if (e.kind === 'tank') {
    const tw = Math.min(3.5, b.w * 0.5);
    return [
      lista({
        x: cx - tw / 2,
        w: tw,
        y: y + 0.8,
        h: 2.6,
        front: f,
        d: tw,
        color: wall,
        part: 'tank',
      }),
      {
        shape: 'pyr',
        x: cx - tw / 2,
        w: tw,
        y: y + 3.4,
        h: 1.2,
        z: f - tw / 2,
        d: tw,
        color: cap,
        part: 'tank',
      },
    ];
  }
  const r = Math.min(4, b.w * 0.35);
  return [{ shape: 'disc', x: cx, y, r, n: 8, z: f - 1, d: 0.1, color: cap, part: 'dome' }];
}
function build(p) {
  const D = C(),
    { buildings, elements } = skylineLayout(p),
    out = [];
  buildings.forEach((b, i) => {
    const wall = D.far[(p.color + i) % D.far.length],
      cap = mix(wall, D.roof[0], 0.25);
    const roof = b.roof
      ? gableRoof({
          x: b.x,
          w: b.w,
          y: b.h,
          d: D_FAR,
          wall,
          roof: cap,
          ov: 0.4,
          h: Math.min(14, b.w * 0.42),
          eaves: false,
        })
      : null;
    out.push(
      lista({ x: b.x, w: b.w, h: b.h, d: D_FAR, color: wall, part: 'wall' }),
      ...(roof ? [roof] : []),
    );
    for (const e of elements) if (e.i === i) out.push(...element(e, b, wall, cap, p.seed, roof));
  });
  return out;
}
// Stínový proxy: horní obrys bloku jako jeden poly (stupně budov, bez prvků) pro 2 budovy; víc budov = obdélník do průměrné výšky (≤ 5 △).
function shadow(p) {
  const { buildings: B } = skylineLayout(p),
    x0 = -p.w / 2,
    x1 = p.w / 2,
    wall = C().far[p.color % 3];
  if (B.length > 2) {
    const h = B.reduce((s, b) => s + b.h * b.w, 0) / p.w;
    return [
      outline(
        [
          [x0, 0],
          [x1, 0],
          [x1, h],
          [x0, h],
        ],
        { z: -D_FAR / 2, color: wall },
      ),
    ];
  }
  return [
    outline(
      [
        [0, 0],
        [x1, 0],
        [x1, B[1].h],
        [B[1].x, B[1].h],
        [B[1].x, B[0].h],
        [x0, B[0].h],
        [x0, 0],
      ],
      { z: -D_FAR / 2, color: wall },
    ),
  ];
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
const none = () => [];
export default Object.freeze({
  id: 'far-skyline',
  name: 'Vzdálené město',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    "Panorama starého města za ranním oparem (Alto's Odyssey): štíty, komíny, věžičky s jehlanem, nádrže a kopule nad střechami.",
  purpose:
    'Dálka všech míst čtvrti 1: dává hloubku a říká „město pokračuje“; jen silueta, bez oken.',
  params: Object.freeze({
    w: P([12, 20, 28, 34], 20),
    h: P([8, 14, 20, 26], 14),
    color: P([0, 1, 2], 0),
    seed: P([1, 2, 3, 4, 5, 6, 7, 8], 1),
  }),
  // Výchozí varianta (w 20, h 14, seed 1); výška podle rozvrhu (budovy a prvky), hloubka karty dálky + přesah střechy.
  size: Object.freeze({ w: 20.4, h: 18.7, d: D_FAR + 0.4 }),
  // Jen dálka: LOD 0 a 1 se nekreslí (strop 0, 11 kap. 4.3).
  tris: Object.freeze([0, 0, 50]),
  lod: Object.freeze([none, none, build]),
  shadow,
});
