// Šňůra s prádlem (karta 13 v research/design/11-katalog-ctvrt1.md): prádlo mezi dvěma okny stejného patra (Neapol, Lisabon, žižkovské dvory).
// Šňůra ve výšce parapetu (rozpor R6: dnes 45–65 % výšky domu, mimo patra) na dvou konzolách odsazená od fasády, kusy prádla jako panely:
// tričko ze dvou panelů (tělo + ramena), ručník, prostěradlo, ponožky jen v LOD 0. Kusy se houpou ve vertex shaderu (karty se `sway`), reduced motion: stojí.
// Souřadnice: x na střed šňůry, y = 0 podlaha patra (generátor: patro · 3 m), čelo fasády z = 0, šňůra vystupuje do +z.
import { palette } from '../palette.js';
import { SCALE, LOD_LAYER } from './scale.js';
import { hash, lista, panel, bounds } from './parts.js';

// Konzola 0,12 × 0,08 m vystupuje 0,5 m, šňůra 0,06 m (jedna linka D-1) v 0,45 m před fasádou, mezery mezi kusy 0,15 m.
export const LAUNDRY = Object.freeze({
  y: SCALE.sill,
  line: 0.06,
  out: 0.45,
  bracket: Object.freeze({ w: 0.12, h: 0.08, d: 0.5 }),
  gap: 0.15,
  edge: 0.3,
  budget: 30,
  lod1: 6,
});
// Druhy kusů: šířka a výška (m), cena v △ na LOD 0. Výška ≤ 0,85 m, aby prádlo viselo nad oknem patra pod ním.
const KINDS = Object.freeze({
  shirt: { w: [0.6, 0.75], h: [0.65, 0.75], tris: 4 },
  towel: { w: [0.5, 0.7], h: [0.7, 0.85], tris: 2 },
  sheet: { w: [0.95, 1.1], h: [0.7, 0.8], tris: 2 },
  socks: { w: [0.4, 0.4], h: [0.3, 0.3], tris: 4 },
});
const ORDER = Object.freeze(['shirt', 'towel', 'sheet', 'shirt', 'socks', 'towel']);
// Kusy na šňůře délky span (deterministicky podle seedu): sousední kusy mají jinou barvu, LOD 0 nejvýš `budget` △ za prádlo.
export function laundryItems(span, seed) {
  const cloth = palette('papir').life.people.cloth,
    out = [],
    end = span / 2 - LAUNDRY.edge;
  let x = -span / 2 + LAUNDRY.edge,
    tris = 0,
    ci = Math.floor(hash(seed, 0) * cloth.length),
    i = 0;
  while (true) {
    const kind = ORDER[Math.floor(hash(seed, 10 + i) * ORDER.length)],
      K = KINDS[kind],
      w = K.w[0] + (K.w[1] - K.w[0]) * hash(seed, 20 + i),
      h = K.h[0] + (K.h[1] - K.h[0]) * hash(seed, 30 + i);
    if (x + w > end || tris + K.tris > LAUNDRY.budget) break;
    ci = (ci + 1 + Math.floor(hash(seed, 40 + i) * (cloth.length - 1))) % cloth.length;
    out.push({ kind, x, w, h, color: cloth[ci] });
    tris += K.tris;
    x += w + LAUNDRY.gap;
    i++;
  }
  return out;
}
function build(p, lod) {
  const { y, line, out: o, bracket: B } = LAUNDRY,
    res = [
      panel({
        x: -p.span / 2,
        w: p.span,
        y: y - line / 2,
        h: line,
        front: o + 0.02,
        color: palette('papir').life.line,
        part: 'line',
      }),
    ];
  if (!lod)
    for (const s of [-1, 1])
      res.push(
        lista({
          x: (s * p.span) / 2 - B.w / 2,
          w: B.w,
          y: y - B.h / 2 - 0.05,
          h: B.h,
          front: B.d,
          d: B.d,
          color: palette('papir').life.line,
          part: 'bracket',
        }),
      );
  // LOD 1: největší kusy jedním panelem, bez ponožek (pod 1 px)
  let items = laundryItems(p.span, p.seed);
  if (lod)
    items = items
      .filter(it => it.kind !== 'socks')
      .sort((a, b) => b.w * b.h - a.w * a.h)
      .slice(0, LAUNDRY.lod1)
      .sort((a, b) => a.x - b.x);
  for (const it of items) {
    const card = o => ({
        ...panel({ ...o, front: LAUNDRY.out, color: it.color, part: 'cloth' }),
        sway: 1,
      }),
      top = y - line / 2;
    if (lod || it.kind === 'towel' || it.kind === 'sheet') {
      res.push(card({ x: it.x, w: it.w, y: top - it.h, h: it.h }));
      continue;
    }
    if (it.kind === 'shirt') {
      const bw = it.w * 0.62;
      res.push(
        card({ x: it.x + (it.w - bw) / 2, w: bw, y: top - it.h, h: it.h }),
        card({ x: it.x, w: it.w, y: top - 0.28, h: 0.28 }),
      );
      continue;
    }
    for (const k of [0, 1])
      res.push(card({ x: it.x + k * 0.24, w: 0.16, y: top - it.h + k * 0.04, h: it.h - k * 0.04 }));
  }
  return res;
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
const DEF = { span: 7.2, seed: 1 },
  box = bounds(build(DEF, 0));
export default Object.freeze({
  id: 'laundry',
  name: 'Šňůra s prádlem',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    'Prádlo na šňůře mezi okny (Neapol, Lisabon, pražský Žižkov): trička, ručníky, prostěradlo a ponožky na šňůře mezi dvěma konzolami.',
  purpose:
    'Ráno, lidé jsou doma, život: 5 v místě 1 a 4 v místě 2 na domech ≥ 8 m, ve výšce parapetu mezi okny stejného patra.',
  // span = délka šňůry (vzdálenost os oken 1–3 osy po 2,4 m), seed = sestava a barvy kusů.
  params: Object.freeze({ span: P([2.4, 4.8, 7.2], DEF.span), seed: P([1, 2, 3, 4, 5], DEF.seed) }),
  size: Object.freeze({ w: box.w, h: box.h, d: box.d }),
  // Strop 11 kap. 4.3 [40, 15, 0]: šňůra 2 + konzoly 8 + prádlo ≤ 30; LOD 1 šňůra + ≤ 6 kusů. Stín se nekreslí (na fasádě, ne na zemi).
  tris: Object.freeze([40, 15, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
  shadow: () => [],
});
