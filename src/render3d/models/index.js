// Registr katalogu modelů (čisté, bez three.js a DOM). Postup: research/design/10-katalog-modelu.md (K1).
// Rozhraní objektu (jeden soubor na objekt, export default):
//  {id, name, district, layers, prototype:'skutečný předobraz', purpose, params:{klíč:{values,default}}, size:{w,h,d} výchozí varianty v m,
//   tris:[max0,max1,max2] strop trojúhelníků na LOD pro nejbohatší variantu (0 = v té vrstvě se nekreslí, lod vrací []),
//   trisScope? {param: max} rozsah variant, pro který strop platí, ground? výška přízemí v m (výchozí SCALE.floor; okna pater po 3 m nad ním),
//   lod:[fn0,fn1,fn2], shadow?(params) stínový proxy ≤ 7 △ (11 kap. 1.3)}
//  lod[i](params) → karty ve formátu paper-cards (cardVertices, cardTriangles); LOD 0 ulice, 1 střed, 2 dálka (scale.js LOD_LAYER).
// Generátor místa (K5) vezme karty přes buildModel a posune je parts.place do místa a vrstvy.
import houseRow from './house-row.js';
import houseGable from './house-gable.js';
import farSkyline from './far-skyline.js';
import chimney from './chimney.js';
import cornerTurret from './corner-turret.js';
import person from './person.js';
import streetLamp from './street-lamp.js';
import kid from './kid.js';
import workshopAttic from './workshop-attic.js';
import workshopInterior from './workshop-interior.js';
import loftBalcony from './loft-balcony.js';
import hoistBeam from './hoist-beam.js';
import retainingWall from './retaining-wall.js';
import stall from './stall.js';
import bunting from './bunting.js';
import marketHall from './market-hall.js';
import antenna from './antenna.js';
import laundry from './laundry.js';
import skyLantern from './sky-lantern.js';
import thermal from './thermal.js';
import shootingStar from './shooting-star.js';
import { cardTriangles } from '../paper-cards.js';

export { SCALE, LOD_LAYER, CARD_DEPTH } from './scale.js';
export { place, bounds } from './parts.js';
export { LAUNCH, DIORAMA, AIM_SHOT, MENU_SHOT, INTRO_SHOT } from './launch-site.js';
import { place } from './parts.js';
import { DIORAMA } from './launch-site.js';
// G1 hmota města (K3), G2 start hodu (K4), G2b místo odhodu (H1–H6, 11 kap. 3.7; K4 workshop nahradily v S4), G3 trh (karty 9–13),
// C2a objekty událostí (research/atlas/05-art-udalosti.md: lampion, termika, hvězda; ve hře je kreslí companion3d.js, ne ulice). Model s replacedBy je nahrazený, hero = LOD 0 je LOD H.
export const MODELS = Object.freeze([
  houseRow,
  houseGable,
  farSkyline,
  chimney,
  cornerTurret,
  person,
  streetLamp,
  kid,
  workshopAttic,
  workshopInterior,
  loftBalcony,
  hoistBeam,
  retainingWall,
  stall,
  bunting,
  marketHall,
  antenna,
  laundry,
  skyLantern,
  thermal,
  shootingStar,
]);
export const EVENT_MODELS = Object.freeze(['sky-lantern', 'thermal', 'shooting-star']);
export const ACTIVE_MODELS = Object.freeze(MODELS.filter(m => !m.replacedBy));
export const modelById = id => MODELS.find(m => m.id === id) ?? null;
export const defaults = m =>
  Object.fromEntries(Object.entries(m.params).map(([k, v]) => [k, v.default]));
// Karty modelu v daném LOD; neznámé parametry se ignorují, chybějící doplní výchozí.
export function buildModel(m, lod = 0, params = {}) {
  if (typeof m === 'string') m = modelById(m);
  if (!m) throw new Error('unknown model');
  const p = { ...defaults(m) };
  for (const k of Object.keys(m.params)) if (params[k] !== undefined) p[k] = params[k];
  return m.lod[Math.max(0, Math.min(m.lod.length - 1, lod | 0))](p);
}
export const modelTriangles = (m, lod = 0, params = {}) =>
  cardTriangles(buildModel(m, lod, params));
// LOD, které model kreslí (strop > 0); nejbližší kreslený k požadovanému (katalog ukáže dálkový model i při volbě LOD 0).
export const drawnLods = m => [0, 1, 2].filter(l => m.tris[l] > 0);
export const nearestLod = (m, lod) =>
  drawnLods(m).reduce((a, l) => (Math.abs(l - lod) < Math.abs(a - lod) ? l : a), drawnLods(m)[0]);
// Stínový proxy modelu (bez shadow = LOD 2).
export function buildShadow(m, params = {}) {
  if (typeof m === 'string') m = modelById(m);
  if (!m) throw new Error('unknown model');
  const p = { ...defaults(m) };
  for (const k of Object.keys(m.params)) if (params[k] !== undefined) p[k] = params[k];
  return m.shadow ? m.shadow(p) : m.lod[2](p);
}
// Dioráma místa odhodu (G2b): karty H1–H6 posunuté do souřadnic místa 1 (launch-site.js DIORAMA). params {id: {…}} přepíše varianty modelů.
export function diorama(lod = 0, params = {}, { only = null } = {}) {
  return DIORAMA.filter(o => !only || only.includes(o.id)).flatMap(o =>
    place(
      buildModel(o.id, lod, params[o.id] ?? {}).map(c => ({ ...c, model: o.id })),
      o.at,
    ),
  );
}
export const dioramaShadow = (params = {}) =>
  DIORAMA.flatMap(o => place(buildShadow(o.id, params[o.id] ?? {}), o.at));
// Hra (S4, 11 kap. 4.2 varianta A): statické H2–H6 jdou do sloučené ulice místa 1 (vrstva near, city.js), dítě a praporek větru kreslí
// workshop.js (pohyb); stín celého místa = proxy H2 + H6 + stojící dítě v masce stínů místa 1 (dioramaShadow).
export const LAUNCH_STATIC = Object.freeze(DIORAMA.map(o => o.id).filter(id => id !== 'kid'));
export const launchStatic = (params = {}) =>
  diorama(0, params, { only: LAUNCH_STATIC })
    .filter(c => c.part !== 'flag')
    .map(c => ({ ...c, layer: 'near' }));
export const launchFlag = (params = {}) =>
  diorama(0, params, { only: ['hoist-beam'] }).filter(c => c.part === 'flag');
export const launchShadow = (params = {}) =>
  dioramaShadow(params).map(c => ({ ...c, layer: 'near' }));
