// Termika (událost `thermal`, research/atlas/05-art-udalosti.md kap. 2.1): sloup teplého vzduchu z papírových stužek. Okraje = dvě svislé
// zvlněné stužky 0,5 m (12 segmentů, vlna ±0,8 m s periodou 14 m), tělo = průsvitný obdélník (ve hře alfa 0,22, tady plná karta),
// jádro = 10 útržků 0,8 × 0,5 m. Šířka sloupu ve hře 2·col·vx (při 60 m/s 78 m), jádro 2·s·vx (30 m).
// Souřadnice: osa sloupu v x = 0, země y = 0, čelo z = 0. Ve hře ho kreslí companion3d.js stejnými funkcemi (ribbon, scrapCard).
import { palette } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { cutout } from './parts.js';
import { THERMAL_FX, ribbonWave } from '../event-fx.js';

export const COLUMN = Object.freeze({ width: 78, core: 30, height: 45 });
// Body stužky k (0 levá, 1 pravá) na hraně x: [[xl, xr, y]…] po segs segmentech od země do výšky top.
export function ribbon(k, x, top, segs = THERMAL_FX.segs, t = 0, reduced = true) {
  const w = THERMAL_FX.ribbon / 2;
  return Array.from({ length: segs + 1 }, (_, j) => {
    const y = (top * j) / segs,
      dx = ribbonWave(k, y, t, reduced);
    return [x + dx - w, x + dx + w, y];
  });
}
// Stužka jako trojúhelníky čelem ke kameře (+z): 2 △ na segment.
export function ribbonMesh(pts, z = 0) {
  const p = [],
    n = [];
  for (let j = 0; j + 1 < pts.length; j++) {
    const [a0, a1, y0] = pts[j],
      [b0, b1, y1] = pts[j + 1];
    p.push(a0, y0, z, a1, y0, z, b1, y1, z, a0, y0, z, b1, y1, z, b0, y1, z);
    for (let i = 0; i < 6; i++) n.push(0, 0, 1);
  }
  return { p, n };
}
const card = ({ p, n }, color, part) => {
  const xs = p.filter((_, i) => i % 3 === 0),
    ys = p.filter((_, i) => i % 3 === 1),
    x = Math.min(...xs),
    y = Math.min(...ys);
  return {
    shape: 'mesh',
    p,
    n,
    x,
    w: Math.max(...xs) - x,
    y,
    h: Math.max(...ys) - y,
    z: 0,
    d: 0.02,
    color,
    part,
  };
};
// Útržek: natočený obdélník 0,8 × 0,5 m (poly, 2 △) se středem (x, y).
export function scrapCard(x, y, rot, color, z = 0.05) {
  const [w, h] = THERMAL_FX.scrap,
    c = Math.cos(rot),
    s = Math.sin(rot);
  return cutout(
    [
      [-w / 2, -h / 2],
      [w / 2, -h / 2],
      [w / 2, h / 2],
      [-w / 2, h / 2],
    ].map(([a, b]) => [x + a * c - b * s, y + a * s + b * c]),
    { front: z + 0.025, color, part: 'scrap' },
  );
}
// LOD 0: stužky 2 × 24 + tělo 2 + 10 útržků 20 = 70 △; LOD 1: stužky 2 × 12 (6 segmentů) + tělo 2 + 5 útržků 10 = 36 △.
function build(p, lod) {
  const K = palette('papir').companion.thermal,
    { width, core, height } = COLUMN,
    segs = lod ? THERMAL_FX.segs / 2 : THERMAL_FX.segs,
    n = lod ? THERMAL_FX.scraps / 2 : THERMAL_FX.scraps,
    body = p.variant === 'night' ? K.night : K.body;
  const out = [
    cutout(
      [
        [-width / 2, 0],
        [width / 2, 0],
        [width / 2, height],
        [-width / 2, height],
      ],
      { front: -0.05, color: body, part: 'body' },
    ),
  ];
  for (const [k, x] of [
    [0, -width / 2],
    [1, width / 2],
  ])
    out.push(card(ribbonMesh(ribbon(k, x, height, segs)), K.edge, 'ribbon'));
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    out.push(
      scrapCard(
        (((i * 7) % n) / n - 0.5) * core * 0.8,
        height * 0.15 + u * height * 0.6,
        i * 0.9,
        K.scraps[i % 2],
      ),
    );
  }
  return out;
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
export default Object.freeze({
  id: 'thermal',
  name: 'Termika (sloup stužek)',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    'Papírová spirálová ozdoba a stužky ve stoupajícím teplém vzduchu (sloup nad rozpálenou střechou).',
  purpose:
    'Událost thermal: šířka sloupu = časové okno, jádro s útržky = úspěch. Kreslí se v záběru letu, ne v ulici.',
  params: Object.freeze({ variant: P(['day', 'night'], 'day') }),
  size: Object.freeze({ w: COLUMN.width + THERMAL_FX.ribbon, h: COLUMN.height, d: 0.1 }),
  tris: Object.freeze([70, 36, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
});
