// Televizní anténa (karta 12 v research/design/11-katalog-ctvrt1.md): anténa Yagi na střeše, stožár, ráhno a prvky (reflektor nejdelší, direktory
// kratší) jako svislé proužky na ráhnu, kotevní lanko ke střeše. Hustota antén říká „hustě obydlený střed s trhem“ (23 v místě 2).
// Tužková šedá life.mast, ne grafit (P1); ráhno i prvky kratší než 1/3 vlaštovky, aby nevznikla „druhá čára“ u pásu letu.
// Souřadnice: x = osa stožáru, y = 0 pata na střeše, čelo z = 0. Výšku střechy dává generátor (dům).
import { palette } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { panel, strip } from './parts.js';

// Míry karty: stožár 0,1 m kreslený 0,25 m (D-1), ráhno 2,4 m, 4 prvky 1,6 → 1,0 m, lanko 0,06 m (jedna linka).
export const ANTENNA = Object.freeze({
  mast: 0.25,
  boom: Object.freeze({ w: 2.4, h: 0.15, below: 0.3 }),
  elements: Object.freeze([1.6, 1.4, 1.2, 1]),
  el: 0.1,
  guy: 0.06,
  guyAt: 0.6,
  guyOut: 1.6,
});
// Stožár ve výšce h (karta: 4–9 m ulice, 8–16 m střed).
function build(p, lod) {
  const c = palette('papir').life.mast,
    { mast, boom: B, elements: E, el } = ANTENNA,
    by = p.h - B.below,
    out = [
      panel({ x: -mast / 2, w: mast, h: p.h, front: 0, color: c, part: 'mast' }),
      panel({ x: -B.w / 2, w: B.w, y: by, h: B.h, front: 0.02, color: c, part: 'boom' }),
    ];
  // prvky: reflektor u zadního konce ráhna (−x), direktory směrem k +x; LOD 1 jen reflektor
  const n = lod ? 1 : E.length,
    ex = i => -B.w / 2 + 0.1 + (i * (B.w - 0.2 - el)) / (E.length - 1);
  for (let i = 0; i < n; i++)
    out.push(
      panel({
        x: ex(i),
        w: el,
        y: by + B.h / 2 - E[i] / 2,
        h: E[i],
        front: 0.04,
        color: c,
        part: 'element',
      }),
    );
  if (!lod)
    out.push(
      strip([0, p.h * ANTENNA.guyAt], [ANTENNA.guyOut, 0], ANTENNA.guy, {
        front: -0.02,
        color: c,
        part: 'guy',
      }),
    );
  return out;
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
export default Object.freeze({
  id: 'antenna',
  name: 'Televizní anténa',
  district: 0,
  layers: LOD_LAYER,
  prototype:
    'Anténa Yagi na střeše činžáku (stožár, ráhno s reflektorem a direktory, kotevní lanko), papírový výřez tužkou.',
  purpose:
    'Hustota antén v místě 2 (23 kusů) říká „hustě obydlený střed s trhem“; ulice 4–9 m, střed 8–16 m nad střechou.',
  params: Object.freeze({ h: P([4, 6, 9, 12, 16], 6) }),
  // Výchozí varianta (6 m): šířka ráhno až kotva lanka, výška stožár + přesah reflektoru nad ráhnem.
  size: Object.freeze({
    w: ANTENNA.boom.w / 2 + ANTENNA.guyOut + ANTENNA.guy,
    h: 6 - ANTENNA.boom.below + ANTENNA.boom.h / 2 + ANTENNA.elements[0] / 2,
    d: 0.1,
  }),
  // Strop 11 kap. 4.3 [14, 6, 0]; stín se nekreslí (linka pod 1 px).
  tris: Object.freeze([14, 6, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
  shadow: () => [],
});
