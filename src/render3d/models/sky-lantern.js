// Sky Lantern (událost `drone`, rozhodnutí 06 15. 10.; research/atlas/05-art-udalosti.md kap. 3.1): kongming lampion, komolý „soustružený“
// hranol (parts.lathe), nahoře ⌀ 3,6 m a zavřený pólem, dole ⌀ 2,8 m a otevřený, výška 4,4 m, dole drátěný kruh 0,15 m. Žebro = tmavší pás
// pláště (ve dne D1.window na cihlové, ve čtvrti 4 střecha čtvrti 3 na lampionové). Herní velikost jako holub (výjimka M-1).
// Souřadnice: osa lampionu v x = 0, z = 0, spodní okraj v y = 0. Ve hře ho kreslí companion3d.js (jeden kus, ve čtvrti 4 svítí).
import { palette } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { lathe } from './parts.js';

export const LANTERN = Object.freeze({
  h: 4.4,
  top: 1.8,
  bottom: 1.4,
  dome: 0.3,
  wire: 0.15,
  wireOut: 0.05,
  rib: Object.freeze([2.0, 2.4]),
  sides: Object.freeze([8, 6]),
});
const rAt = y => LANTERN.bottom + ((LANTERN.top - LANTERN.bottom) * y) / LANTERN.h;
// Hotové trojúhelníky (parts.lathe) jako karta 'mesh' s obalem.
export function meshCard({ p, n }, color, part) {
  const ax = [0, 1, 2].map(k => {
    let lo = Infinity,
      hi = -Infinity;
    for (let i = k; i < p.length; i += 3) {
      lo = Math.min(lo, p[i]);
      hi = Math.max(hi, p[i]);
    }
    return [lo, hi];
  });
  return {
    shape: 'mesh',
    p,
    n,
    x: ax[0][0],
    w: Math.max(1e-3, ax[0][1] - ax[0][0]),
    y: ax[1][0],
    h: Math.max(1e-3, ax[1][1] - ax[1][0]),
    z: (ax[2][0] + ax[2][1]) / 2,
    d: Math.max(1e-3, ax[2][1] - ax[2][0]),
    color,
    part,
  };
}
export const lanternColors = (variant = 'day') => {
  const K = palette('papir').companion.lantern;
  return variant === 'night'
    ? { shell: K.night, rib: K.nightRib, wire: K.wire }
    : { shell: K.day, rib: K.dayRib, wire: K.wire };
};
// LOD 0: 8 stěn, plášť 3 pásy (spodní, žebro, horní) 48 △ + pól 8 + drát 16 = 72 △. LOD 1: 6 stěn, 2 pásy + pól, bez drátu = 30 △.
function build(p, lod) {
  const L = LANTERN,
    C = lanternColors(p.variant),
    n = L.sides[lod],
    ring = y => [y, rAt(y), rAt(y)],
    pole = [L.h + L.dome, 0, 0];
  if (lod)
    return [
      meshCard(lathe([ring(0), ring(L.rib[1])], n), C.shell, 'shell'),
      meshCard(lathe([ring(L.rib[1]), ring(L.h)], n), C.shell, 'shell'),
      meshCard(lathe([ring(L.h), pole], n), C.rib, 'pole'),
    ];
  const wr = y => [y, rAt(y) + L.wireOut, rAt(y) + L.wireOut];
  return [
    meshCard(lathe([ring(L.wire), ring(L.rib[0])], n), C.shell, 'shell'),
    meshCard(lathe([ring(L.rib[0]), ring(L.rib[1])], n), C.rib, 'rib'),
    meshCard(lathe([ring(L.rib[1]), ring(L.h)], n), C.shell, 'shell'),
    meshCard(lathe([ring(L.h), pole], n), C.rib, 'pole'),
    meshCard(lathe([wr(0), wr(L.wire)], n), C.wire, 'wire'),
  ];
}
const P = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
const W = 2 * LANTERN.top * Math.cos(Math.PI / 8);
export default Object.freeze({
  id: 'sky-lantern',
  name: 'Sky Lantern (lampion)',
  district: 3,
  layers: LOD_LAYER,
  prototype:
    'Kongming lampion z papíru na drátěném kruhu, jak se pouští na slavnostech (Sky Lantern, rozhodnutí 06 15. 10.).',
  purpose:
    'Událost drone: lampion letí vlaštovce do cesty, ťuk před kontaktem = odraz. Ve dne cihlový a nesvítí, ve čtvrti 4 lampionový a svítí.',
  params: Object.freeze({ variant: P(['day', 'night'], 'day') }),
  size: Object.freeze({ w: W, h: LANTERN.h + LANTERN.dome, d: W }),
  tris: Object.freeze([72, 30, 0]),
  lod: Object.freeze([p => build(p, 0), p => build(p, 1), () => []]),
});
