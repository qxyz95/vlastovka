// Čisté funkce prototypu (bez DOM). Zrcadlí rozhraní z návrhu §6.3, aby šly přenést do src/atlas.js a src/atlas-text.js.
import {PLACES,BONUSES,SPECIALS,NODES,DISTRICTS,PAPERS,getLang,setLang,tx} from './content.js';
import {placeStart,FINISH} from './numbers.js';
export {getLang,setLang};

// ---- formát (atlas-text.js; ve hře num/unit/pct ze src/i18n.js) ----
// en 1,240 m · cs 1 240 m; mezi číslem a jednotkou nedělitelná mezera; od 1 000 000 kompaktně (1.2M · 1,2 mil.)
const TAG={en:'en-US',cs:'cs-CZ'},NB=' ',fmts={},plurals={};
const nfmt=(d=0,compact=false)=>{const k=getLang()+d+compact;return fmts[k]??=new Intl.NumberFormat(TAG[getLang()]??TAG.en,compact?{notation:'compact',maximumFractionDigits:1}:{maximumFractionDigits:d});};
export const fmtNum=n=>Math.abs(n)>=1e6?nfmt(0,true).format(n):nfmt().format(Math.round(n));
const fmtDec=v=>nfmt(1).format(v);
export const fmtCoins=n=>`${fmtNum(n)}${NB}◈`;
export const fmtMeters=m=>`${fmtNum(m)}${NB}m`;
const pct=v=>{const x=v*100;return fmtDec(Math.abs(x)<10&&x%1?Math.round(x*10)/10:Math.round(x))+NB+'%';};
export const fmtPct=(v,sign=true)=>(sign?'+':'')+pct(v);
export const fmtList=a=>new Intl.ListFormat(TAG[getLang()]??TAG.en,{type:'conjunction'}).format(a);
const UNITS={'+%':v=>fmtPct(v),'%':v=>fmtPct(v,false),x:v=>`×${fmtDec(v)}`,m:v=>`${fmtDec(v)}${NB}m`,s:v=>`${fmtDec(v)}${NB}s`,
 times:v=>t('unit.times',{count:v}),count:v=>v===1?t('unit.once'):v===2?t('unit.twice'):t('unit.times',{count:v})};
// t(key, params): text v aktuálním jazyce (chybí → EN → klíč), plurál podle params.count, čísla podle jazyka
const rule=()=>plurals[getLang()]??=new Intl.PluralRules(TAG[getLang()]??TAG.en);
const fmtVal=v=>typeof v==='number'?(Number.isInteger(v)?fmtNum(v):fmtDec(v)):String(v);
export function t(id,vars={}){let v=tx(id);if(v==null)return id;
 if(typeof v!=='string'){const n=Number(vars.count);v=v[rule().select(Number.isFinite(n)?n:0)]??v.other;}
 return v.replace(/\{(\w+)\}/g,(m,k)=>vars[k]==null?m:fmtVal(vars[k]));}
// šablona účinku → pole vět; každá věta je pole úseků {text, num}
export function effectLine(id,values){
 const b=BONUSES[id];if(!b?.effect||!values)return [];
 return b.effect.map((s,k)=>({s,k})).filter(({s})=>!s.if||values[s.if]).map(({k})=>{const src=tx(`bonus.${id}.effect.${k}`)??'',parts=[];let last=0;
  src.replace(/\{(\w+)\}/g,(m,k,i)=>{parts.push({text:src.slice(last,i)});const f=UNITS[b.units?.[k]]??String;parts.push({num:values[k]==null?'?':f(values[k])});last=i+m.length;return m;});
  parts.push({text:src.slice(last)});return parts.filter(p=>p.text!==''||p.num!=null);});
}
export const effectText=(id,values)=>effectLine(id,values).map(s=>s.map(p=>p.text??p.num).join('')).join(' ');

// ---- stav (atlas.js) ----
export const districtReached=(best,d)=>best>=placeStart(d*4)||d===0;
export const isFound=(best,i)=>best>=placeStart(i);
export const levelOf=(p,i)=>isFound(p.best,i)?1+(p.atlas.levels[PLACES[i].bonus]??0):0;
// stavy: frame / unknown / teaser / found / level / max (+ model, encore jako příznak)
export function placeStates(p,N){
 let teaser=PLACES.findIndex((_,i)=>!isFound(p.best,i));
 return PLACES.map((pl,i)=>{
  const d=pl.district,reached=districtReached(p.best,d),found=isFound(p.best,i),b=BONUSES[pl.bonus];
  if(found){const lv=levelOf(p,i),max=N.maxLevel(pl.bonus);
   const state=b.levelled===false?'found':lv>=max?'max':lv>1?'level':'found';
   return {i,id:pl.id,state,level:lv,max,unlevelled:b.levelled===false,isNew:!p.atlas.seen.includes(pl.id)};}
  if(i===teaser)return {i,id:pl.id,state:'teaser',metersToGo:placeStart(i)-p.best};
  return {i,id:pl.id,state:reached?'unknown':'frame'};
 });
}
export function nextGoal(p){if(p.atlas.finished||p.best>=FINISH)return {delivered:true};
 const i=PLACES.findIndex((_,k)=>!isFound(p.best,k));if(i<0)return {placeId:'harbor',finish:true,metersToGo:FINISH-p.best};
 return {placeId:PLACES[i].id,i,metersToGo:placeStart(i)-p.best};}
// řádek cíle jako dvě části (štítek tučně + zbytek), aby šel zvýraznit v obou jazycích bez regexu
export function goalParts(g){if(g.delivered)return {label:'',text:t('goal.delivered')};
 const m=fmtMeters(g.metersToGo);
 return {label:t('goal.label'),text:g.finish?t('goal.finish',{m}):t('goal.next',{place:PLACES[g.i].short??PLACES[g.i].name,m})};}
export const goalText=g=>{const {label,text}=goalParts(g);return label?`${label} ${text}`:text;};
export const nextCost=(p,N,i)=>N.price(PLACES[i].bonus,PLACES[i].district,levelOf(p,i));
export const canUpgrade=(p,N,i)=>{const c=nextCost(p,N,i);return c!=null&&p.coins>=c;};
export function upgrade(p,N,i){const id=PLACES[i].bonus,c=nextCost(p,N,i);if(c==null||p.coins<c)return false;
 p.coins-=c;p.atlas.levels[id]=(p.atlas.levels[id]??0)+1;p.atlas.undo={kind:'level',id,i,price:c};return true;}
export function undoLast(p){const u=p.atlas.undo;if(!u)return null;p.coins+=u.price;
 if(u.kind==='level')p.atlas.levels[u.id]--;else if(u.kind==='pocket'){p.atlas.pockets.owned--;p.atlas.pockets.slots[p.atlas.pockets.owned]=null;}else if(u.kind==='node')p.atlas.nodes[u.id]=false;
 p.atlas.undo=null;return u;}
export const clearUndo=p=>{p.atlas.undo=null;};
export const reachedDistrict=best=>DISTRICTS.reduce((a,_,d)=>districtReached(best,d)?d:a,0);
export const pocketVisible=(p,N,k)=>k===0||reachedDistrict(p.best)>=N.pockets.secondFromDistrict;
export function buyPocket(p,N){const k=p.atlas.pockets.owned,c=N.pocketPrice(k);if(!pocketVisible(p,N,k)||p.coins<c)return false;
 p.coins-=c;p.atlas.pockets.owned++;p.atlas.undo={kind:'pocket',price:c};return true;}
export const specialUnlocked=(p,id)=>reachedDistrict(p.best)>=SPECIALS[id].district;
// vzájemně vylučující se pasivní speciály
export const EXCLUSIVE=[['sharp','calm']];
// může speciál id do slotu s? → {ok, reason}
export function canEquip(p,slot,id){const s=p.atlas.pockets.slots,sp=SPECIALS[id];
 if(!specialUnlocked(p,id))return {ok:false,reason:'locked'};
 if(s[slot]===id)return {ok:false,reason:t('reason.equipped')};
 const o=s.findIndex((x,k)=>k!==slot&&x===id);if(o>=0)return {ok:false,reason:t('reason.inOther',{n:o+1})};
 if(sp.active){const a=s.findIndex((x,k)=>k!==slot&&x&&SPECIALS[x].active);if(a>=0)return {ok:false,reason:t('reason.oneActive',{special:SPECIALS[s[a]].name,n:a+1})};}
 const ex=EXCLUSIVE.find(g=>g.includes(id));
 if(ex){const a=s.findIndex((x,k)=>k!==slot&&ex.includes(x)&&x!==id);if(a>=0)return {ok:false,reason:t('reason.exclusive',{special:SPECIALS[s[a]].name,n:a+1})};}
 return {ok:true};}
export function equip(p,slot,id){if(id&&!canEquip(p,slot,id).ok)return false;p.atlas.pockets.slots[slot]=id;return true;}
// uzly: viditelné, když je splněna podmínka; autopilot jen při volbě autopilotPlace==='atlas'
export function visibleNodes(p,opts){return Object.entries(NODES).filter(([id,n])=>{
 if(n.kind==='autopilot'&&opts.autopilot!=='atlas')return false;
 if(n.requires==='finished')return p.atlas.finished;
 const i=PLACES.findIndex(x=>x.id===n.requires);return isFound(p.best,i);}).map(([id,n])=>({id,...n,owned:!!p.atlas.nodes[id],on:p.atlas.auto?.[id]!==false}));}
// novinky po hodu: priorita finále > čtvrť > nový bonus > papír > hláška (papír jde s bonusem v jedné řádce)
export function discoveries(prev,best){const out=[];
 if(prev<FINISH&&best>=FINISH)out.push({kind:'finale',prio:0});
 for(let d=1;d<4;d++)if(!districtReached(prev,d)&&districtReached(best,d))out.push({kind:'district',d,prio:1});
 PLACES.forEach((pl,i)=>{if(!isFound(prev,i)&&isFound(best,i))out.push({kind:'place',i,prio:2});});
 return out.sort((a,b)=>a.prio-b.prio);}
export function noveltyLine(n){
 if(n.kind==='finale')return t('delivered.title');
 if(n.kind==='district')return t('result.district',{district:DISTRICTS[n.d].name});
 if(n.kind==='place'){const pl=PLACES[n.i],b=BONUSES[pl.bonus];
  return pl.opensPaper?t('result.foundPaper',{place:pl.name,bonus:b.name,paper:PAPERS[pl.opensPaper]}):t('result.found',{place:pl.name,bonus:b.name});}
 if(n.kind==='line')return t('result.line',{name:n.name,line:n.line});
 if(n.kind==='migration')return t('result.migration',{count:n.n});return '';}
// tečka na tlačítku Atlas: jen neviděné novinky (nikdy dostupnost koupě), variantu 'affordable' má prototyp jen pro srovnání
export function atlasNotice(p,N,mode='novelty'){
 const unseen=PLACES.some((pl,i)=>isFound(p.best,i)&&!p.atlas.seen.includes(pl.id));
 if(mode==='affordable')return unseen||PLACES.some((_,i)=>isFound(p.best,i)&&canUpgrade(p,N,i));
 return unseen;}
// hlášky postav: kolik jich zaznělo (08 §7.1: 1 = přílet do čtvrti, 2 = 3. místo, 3 = přelet do další čtvrti / finále)
export function linesHeard(best,d){if(!districtReached(best,d))return 0;let n=1;if(isFound(best,d*4+2))n=2;if(d<3?districtReached(best,d+1):best>=FINISH)n=3;return n;}
