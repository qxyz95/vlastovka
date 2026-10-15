// Padající hvězda (událost `star`, research/atlas/05-art-udalosti.md kap. 4.1): čtyřcípá hvězda vystřižená z kartonu (pěticípá je rajčatová
// role perfektu), cípy 1,6 m, vnitřní poloměr 0,4, tloušťka 0,15 m se světlým řezem na boku; ohon = 3 zužující se pásky 9 / 7 / 5 m
// (šířka 0,6 → 0, 6 segmentů) proti směru letu (vpravo nahoru, dráha 30° pod vodorovnou). Ve dne D1.window, ve čtvrti 4 krém, nesvítí.
// Souřadnice: střed hvězdy v (0, 0, 0). Ve hře ji kreslí companion3d.js stejnými funkcemi (starTriangles, tailStrip).
import { palette, mix } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { meshCard } from './sky-lantern.js';
import { STAR_FX } from '../event-fx.js';

// Obrys čtyřcípé hvězdy: 8 bodů od horního cípu proti směru hodin, sudé = cíp r, liché = vnitřní roh.
export const starOutline = (r = STAR_FX.r, inner = STAR_FX.inner) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 2 + (k * Math.PI) / 4,
      q = k % 2 ? inner : r;
    return [Math.cos(a) * q, Math.sin(a) * q];
  });
// Hvězda jako trojúhelníky: {front, back, side} = {p, n}; líce vějíř ze středu (8 △ každé), bok 8 obdélníků (16 △). back:false = jen líc.
export function starTriangles({
  r = STAR_FX.r,
  inner = STAR_FX.inner,
  d = STAR_FX.depth,
  back = true,
} = {}) {
  const O = starOutline(r, inner),
    z1 = d / 2,
    z0 = -d / 2,
    face = (z, s) => {
      const p = [],
        n = [];
      for (let k = 0; k < 8; k++) {
        const a = O[k],
          b = O[(k + 1) % 8];
        if (s > 0) p.push(0, 0, z, a[0], a[1], z, b[0], b[1], z);
        else p.push(0, 0, z, b[0], b[1], z, a[0], a[1], z);
        for (let i = 0; i < 3; i++) n.push(0, 0, s);
      }
      return { p, n };
    };
  const side = { p: [], n: [] };
  if (back)
    for (let k = 0; k < 8; k++) {
      const a = O[k],
        b = O[(k + 1) % 8],
        dx = b[0] - a[0],
        dy = b[1] - a[1],
        l = Math.hypot(dx, dy),
        nn = [dy / l, -dx / l, 0];
      side.p.push(a[0], a[1], z1, b[0], b[1], z0, b[0], b[1], z1);
      side.p.push(a[0], a[1], z1, a[0], a[1], z0, b[0], b[1], z0);
      for (let i = 0; i < 6; i++) side.n.push(...nn);
    }
  return { front: face(z1, 1), back: back ? face(z0, -1) : null, side };
}
// Páska ohonu k (0–2): stanice [xl, yl, xr, yr, u] od hvězdy (u = 0) po konec (u = 1), proti směru letu (cos 30°, sin 30°).
export function tailStrip(k, segs = STAR_FX.segs) {
  const S = STAR_FX,
    len = S.tail[k],
    dx = Math.cos(S.angle),
    dy = Math.sin(S.angle),
    off = (k - 1) * 0.5;
  return Array.from({ length: segs + 1 }, (_, j) => {
    const u = j / segs,
      w = (S.tailW / 2) * (1 - u),
      cx = dx * len * u - dy * off,
      cy = dy * len * u + dx * off;
    return [cx - dy * w, cy + dx * w, cx + dy * w, cy - dx * w, u];
  });
}
export function tailMesh(k, segs = STAR_FX.segs, z = -0.1) {
  const s = tailStrip(k, segs),
    p = [],
    n = [];
  for (let j = 0; j + 1 < s.length; j++) {
    const [ax, ay, bx, by] = s[j],
      [cx, cy, dx, dy] = s[j + 1];
    p.push(ax, ay, z, bx, by, z, dx, dy, z, ax, ay, z, dx, dy, z, cx, cy, z);
    for (let i = 0; i < 6; i++) n.push(0, 0, 1);
  }
  return { p, n };
}
export const starColors = (variant = 'day') => {
  const K = palette('papir').companion.star,
    body = variant === 'night' ? K.night : K.day;
  return { body, cut: mix(body, K.cut, 0.55) };
};
// LOD 0: líce 2 × 8 + bok 16 + ohon 3 × 12 = 68 △; LOD 1: jen líc 8 + ohon 3 × 6 (3 segmenty) = 26 △.
function build(p, lod) {
  const C = starColors(p.variant),
    T = starTriangles({ back: !lod }),
    out = [meshCard(T.front, C.body, 'star')];
  if (!lod) out.push(meshCard(T.back, C.body, 'star'), meshCard(T.side, C.cut, 'cut'));
  for (let k = 0; k < 3; k++)
    out.push(meshCard(tailMesh(k, lod ? STAR_FX.segs / 2 : STAR_FX.segs), C.body, 'tail'));
  return out;
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
const S = STAR_FX;
export default Object.freeze({
  id: 'shooting-star',
  name: 'Padající hvězda',
  district: 0,
  layers: LOD_LAYER,
  prototype: 'Čtyřcípá hvězda vystřižená z kartonu s papírovými pásky ohonu (vánoční ozdoba).',
  purpose:
    'Událost star: kousek noční oblohy přeletí přes vlaštovku přesně ve středu okna; zásah ji rozpadne na hvězdičky výtrysku.',
  params: Object.freeze({ variant: P(['day', 'night'], 'day') }),
  size: Object.freeze({
    w: S.r + Math.cos(S.angle) * S.tail[0] + Math.sin(S.angle) * 0.5,
    h: S.r + Math.sin(S.angle) * S.tail[0] - Math.cos(S.angle) * 0.5,
    d: S.depth,
  }),
  tris: Object.freeze([68, 26, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
});
