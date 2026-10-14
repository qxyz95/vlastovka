// Pohled na každý typ události (čisté). Vlastní R2, ve fázi e převezme E. Neznámý typ nespadne: dostane obecný kruh.
// ring = tvar časovacího kruhu (r poloměr v logických px, marker bodu průběhu 'square'|'diamond'|'dot'), verb = ovládání ('tap'|'hold'),
// caption = popisek štítku, title = název události; obojí v aktuálním jazyce (gettery nad klíči src/locales, event.<typ>). Hra dnes zná jen gust a bird (events.js).
import {t as tr} from '../i18n.js';
const V=(title,verb,caption,ring={})=>({get title(){return tr(title);},verb,get caption(){return tr(caption);},ring:{r:30,marker:'square',...ring}});
export const EVENT_VIEWS={
 gust:V('event.gust','tap','event.tap'),
 bird:V('event.bird','hold','event.holdRelease'),
 steam:V('event.steam','tap','event.tap',{r:32,marker:'dot'}),
 thermal:V('event.thermal','hold','event.riseRelease',{r:34,marker:'dot'}),
 drone:V('event.drone','tap','event.tap',{marker:'diamond'}),
 star:V('event.star','tap','event.starTap',{r:28,marker:'diamond'})
};
export const GENERIC=V('event.generic','tap','event.tap');
// eventView('gust') → pohled typu; eventView(e,t) s událostí z events.js přidá phase, result, age (t − e.at) a label (prázdný ve fázi effect).
export function eventView(e,t=0){
 const type=typeof e==='string'?e:e?.type,base=Object.hasOwn(EVENT_VIEWS,type??'')?EVENT_VIEWS[type]:GENERIC,v={...base,type:type??'unknown'};
 if(!e||typeof e!=='object')return v;
 const phase=e.phase??null;
 return {...v,phase,result:e.result??null,age:Math.max(0,t-(Number.isFinite(e.at)?e.at:t)),label:phase==='effect'||e.result?'':phase==='warning'?tr('event.warning'):base.caption};
}
