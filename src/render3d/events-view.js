// Pohled na každý typ události (čisté). Vlastní R2, ve fázi e převezme E. Neznámý typ nespadne: dostane obecný kruh.
// ring = tvar časovacího kruhu (r poloměr v logických px, marker bodu průběhu 'square'|'diamond'|'dot'), verb = ovládání ('tap'|'hold'),
// caption = popisek štítku (anglicky, hra přechází na angličtinu), title = název události. Hra dnes zná jen gust a bird (events.js).
export const WARNING_CAPTION='! GET READY';
const V=(title,verb,caption,ring={})=>({title,verb,caption,ring:{r:30,marker:'square',...ring}});
export const EVENT_VIEWS={
 gust:V('Vent gust','tap','↓ TAP'),
 bird:V('Cyber pigeon courier','hold','↕ HOLD / RELEASE'),
 steam:V('Steam vent','tap','↓ TAP',{r:32,marker:'dot'}),
 thermal:V('Thermal','hold','↑ HOLD / RELEASE',{r:34,marker:'dot'}),
 drone:V('Delivery drone','tap','↓ TAP',{marker:'diamond'}),
 star:V('Falling star','tap','★ TAP',{r:28,marker:'diamond'})
};
export const GENERIC=V('Event','tap','↓ TAP');
// eventView('gust') → pohled typu; eventView(e,t) s událostí z events.js přidá phase, result, age (t − e.at) a label (prázdný ve fázi effect).
export function eventView(e,t=0){
 const type=typeof e==='string'?e:e?.type,base=Object.hasOwn(EVENT_VIEWS,type??'')?EVENT_VIEWS[type]:GENERIC,v={...base,type:type??'unknown'};
 if(!e||typeof e!=='object')return v;
 const phase=e.phase??null;
 return {...v,phase,result:e.result??null,age:Math.max(0,t-(Number.isFinite(e.at)?e.at:t)),label:phase==='effect'||e.result?'':phase==='warning'?WARNING_CAPTION:base.caption};
}
