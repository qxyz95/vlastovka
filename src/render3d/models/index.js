// Registr katalogu modelů (čisté, bez three.js a DOM). Postup: research/design/10-katalog-modelu.md (K1).
// Rozhraní objektu (jeden soubor na objekt, export default):
//  {id, name, district, layers, prototype:'skutečný předobraz', purpose, params:{klíč:{values,default}}, size:{w,h,d} výchozí varianty v m,
//   tris:[max0,max1,max2] strop trojúhelníků na LOD pro nejbohatší variantu, lod:[fn0,fn1,fn2]}
//  lod[i](params) → karty ve formátu paper-cards (cardVertices, cardTriangles); LOD 0 ulice, 1 střed, 2 dálka (scale.js LOD_LAYER).
// Generátor místa (K5) vezme karty přes buildModel a posune je parts.place do místa a vrstvy.
import houseRow from './house-row.js';
import {cardTriangles} from '../paper-cards.js';

export {SCALE,LOD_LAYER,CARD_DEPTH} from './scale.js';
export {place,bounds} from './parts.js';
export const MODELS=Object.freeze([houseRow]);
export const modelById=id=>MODELS.find(m=>m.id===id)??null;
export const defaults=m=>Object.fromEntries(Object.entries(m.params).map(([k,v])=>[k,v.default]));
// Karty modelu v daném LOD; neznámé parametry se ignorují, chybějící doplní výchozí.
export function buildModel(m,lod=0,params={}){
 if(typeof m==='string')m=modelById(m);if(!m)throw new Error('unknown model');
 const p={...defaults(m)};for(const k of Object.keys(m.params))if(params[k]!==undefined)p[k]=params[k];
 return m.lod[Math.max(0,Math.min(m.lod.length-1,lod|0))](p);
}
export const modelTriangles=(m,lod=0,params={})=>cardTriangles(buildModel(m,lod,params));
