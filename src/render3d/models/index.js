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
import workshop from './workshop.js';
import cornerTurret from './corner-turret.js';
import person from './person.js';
import streetLamp from './street-lamp.js';
import {cardTriangles} from '../paper-cards.js';

export {SCALE,LOD_LAYER,CARD_DEPTH} from './scale.js';
export {place,bounds} from './parts.js';
// G1 hmota města (K3), G2 start hodu (K4).
export const MODELS=Object.freeze([houseRow,houseGable,farSkyline,chimney,workshop,cornerTurret,person,streetLamp]);
export const modelById=id=>MODELS.find(m=>m.id===id)??null;
export const defaults=m=>Object.fromEntries(Object.entries(m.params).map(([k,v])=>[k,v.default]));
// Karty modelu v daném LOD; neznámé parametry se ignorují, chybějící doplní výchozí.
export function buildModel(m,lod=0,params={}){
 if(typeof m==='string')m=modelById(m);if(!m)throw new Error('unknown model');
 const p={...defaults(m)};for(const k of Object.keys(m.params))if(params[k]!==undefined)p[k]=params[k];
 return m.lod[Math.max(0,Math.min(m.lod.length-1,lod|0))](p);
}
export const modelTriangles=(m,lod=0,params={})=>cardTriangles(buildModel(m,lod,params));
// LOD, které model kreslí (strop > 0); nejbližší kreslený k požadovanému (katalog ukáže dálkový model i při volbě LOD 0).
export const drawnLods=m=>[0,1,2].filter(l=>m.tris[l]>0);
export const nearestLod=(m,lod)=>drawnLods(m).reduce((a,l)=>Math.abs(l-lod)<Math.abs(a-lod)?l:a,drawnLods(m)[0]);
// Stínový proxy modelu (bez shadow = LOD 2).
export function buildShadow(m,params={}){
 if(typeof m==='string')m=modelById(m);if(!m)throw new Error('unknown model');
 const p={...defaults(m)};for(const k of Object.keys(m.params))if(params[k]!==undefined)p[k]=params[k];
 return m.shadow?m.shadow(p):m.lod[2](p);
}
