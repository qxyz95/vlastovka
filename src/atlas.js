// Atlas logic, pure functions without DOM (research/atlas/01-navrh-atlasu.md §6.3). State lives in p.atlas (§6.2, save v4 by A3).
// Discovery is derived from p.best and never stored. Every function takes optional content c and numbers n (default PROVISIONAL).
import * as CONTENT from './atlas-content.js';
import {NUMBERS} from './atlas-numbers.js';
const EPS=1e-9,HINT_OPENS=3,LINE_AT_PLACE=3; // character line 2 sounds on the 3rd place of its district (08 §7.1)
export const emptyAtlas=(n=NUMBERS)=>({levels:{},seen:[],pending:[],lines:{},pockets:{owned:0,slots:n.pockets.prices.map(()=>null)},nodes:{},finished:false,hintOpens:0,undo:null});
const A=p=>p.atlas??emptyAtlas();
const own=p=>p.atlas??=emptyAtlas();
const per=n=>n.route.perDistrict, districtOf=(i,n)=>Math.floor(i/per(n));

export const placeStart=(i,n=NUMBERS)=>i===0?n.gliderAt:i*n.route.place;
export const isFound=(best,i,n=NUMBERS)=>(+best||0)>=placeStart(i,n)-EPS;
export const foundCount=(best,n=NUMBERS)=>{let k=0;while(k<n.route.places&&isFound(best,k,n))k++;return k;};
export const reachedDistrict=(best,n=NUMBERS)=>{let d=0;while((d+1)*per(n)<n.route.places&&isFound(best,(d+1)*per(n),n))d++;return d;};
export const isDelivered=(best,n=NUMBERS)=>(+best||0)>=n.route.finish-EPS;
export const isFinished=(p,n=NUMBERS)=>!!A(p).finished||isDelivered(p.best,n);
const placeOfBonus=(id,c)=>c.PLACES.findIndex(x=>x.bonus===id);
// Paper kind opened by a place: the openAtPlace-th place of district k opens kind k+1.
export function opensPaper(i,n=NUMBERS){const d=districtOf(i,n);return i%per(n)+1===n.paper.openAtPlace?n.paper.kinds[d+1]??null:null;}

// --- levels and prices ---
export const maxLevelOf=(id,n=NUMBERS)=>n.atlas.maxLevel[id]??1;
export function levelOf(p,id,c=CONTENT,n=NUMBERS){
 const i=placeOfBonus(id,c);if(i<0||!isFound(p.best,i,n))return 0;
 const bought=Math.max(0,Math.floor(+A(p).levels[id]||0));return Math.min(maxLevelOf(id,n),1+bought);
}
// Cost of going from level to level+1; null = maximum or not tuned yet.
export function nextCost(id,level,n=NUMBERS){return level<1||level>=maxLevelOf(id,n)?null:n.atlas.prices[id]?.[level]??null;}
export function upgradeStatus(p,id,c=CONTENT,n=NUMBERS){
 const level=levelOf(p,id,c,n),max=maxLevelOf(id,n);
 if(!level)return {ok:false,reason:'unknown',level,max,price:null};
 if(max<=1)return {ok:false,reason:'unlevelled',level,max,price:null};
 if(level>=max)return {ok:false,reason:'max',level,max,price:null};
 const price=nextCost(id,level,n);if(price==null)return {ok:false,reason:'soon',level,max,price};
 const missing=Math.max(0,price-(p.coins||0));return {ok:!missing,reason:missing?'coins':null,level,max,price,missing};
}
export const canUpgrade=(p,id,c=CONTENT,n=NUMBERS)=>upgradeStatus(p,id,c,n).ok;
export function upgrade(p,id,c=CONTENT,n=NUMBERS){
 const s=upgradeStatus(p,id,c,n);if(!s.ok)return false;const a=own(p);
 p.coins-=s.price;a.levels[id]=s.level;a.undo={id,level:s.level+1,price:s.price};return true;
}
export function undoLast(p,c=CONTENT,n=NUMBERS){
 const a=own(p),u=a.undo;if(!u)return false;a.undo=null;
 if(levelOf(p,u.id,c,n)!==u.level)return false;
 p.coins+=u.price;if(u.level-2>0)a.levels[u.id]=u.level-2;else delete a.levels[u.id];return true;
}
export function clearUndo(p){if(p.atlas)p.atlas.undo=null;}

// --- place states (§3.2). Hidden places carry no id, name or bonus (guard 08 N2). ---
export function placeStates(p,c=CONTENT,n=NUMBERS){
 const best=p.best,reached=reachedDistrict(best,n),k=foundCount(best,n),a=A(p);
 return c.PLACES.slice(0,n.route.places).map((pl,index)=>{
  const district=districtOf(index,n),b=c.BONUSES[pl.bonus];
  if(index<k){
   const level=levelOf(p,pl.bonus,c,n),maxLevel=maxLevelOf(pl.bonus,n);
   const state=maxLevel<=1?'found':level>=maxLevel?'max':level>1?'level':'found';
   return {index,district,state,id:pl.id,name:pl.name,bonus:pl.bonus,bonusName:b.name,level,maxLevel,isNew:!a.seen.includes(pl.bonus),paper:opensPaper(index,n)};
  }
  if(index===k)return {index,district,state:'teaser',id:pl.id,name:pl.name,teaser:pl.teaser,bonus:pl.bonus,bonusName:b.name,bonusLine:b.line,metersToGo:placeStart(index,n)-(+best||0)};
  return {index,district,state:district<=reached?'unknown':'frame'};
 });
}
export function nextGoal(p,c=CONTENT,n=NUMBERS){
 if(isDelivered(p.best,n))return {delivered:true};
 const k=foundCount(p.best,n);return {placeId:c.PLACES[k].id,index:k,metersToGo:placeStart(k,n)-(+p.best||0)};
}
// Counts only for reached districts (P6, 08 N7).
export function districtSummary(p,c=CONTENT,n=NUMBERS){
 const reached=reachedDistrict(p.best,n),k=foundCount(p.best,n);
 return c.DISTRICTS.slice(0,reached+1).map((d,index)=>({index,id:d.id,found:Math.max(0,Math.min(per(n),k-index*per(n))),total:per(n)}));
}
export function heardLines(p,district,c=CONTENT){const ch=c.DISTRICTS[district]?.character;return ch?ch.lines.slice(0,Math.max(0,+A(p).lines[ch.id]||0)):[];}

// --- pockets (§3.5) ---
export function pocketStatus(p,n=NUMBERS){
 const a=A(p),owned=a.pockets?.owned||0,prices=n.pockets.prices,reached=reachedDistrict(p.best,n);
 if(owned>=prices.length)return {owned,next:null};
 const fromDistrict=owned?n.pockets.secondFromDistrict:0,price=prices[owned],missing=Math.max(0,price-(p.coins||0));
 const reason=reached<fromDistrict?'later':missing?'coins':null;
 return {owned,next:{n:owned+1,price,fromDistrict,visible:reached>=fromDistrict,ok:!reason,reason,missing}};
}
export function buyPocket(p,n=NUMBERS){
 const s=pocketStatus(p,n);if(!s.next?.ok)return false;const a=own(p);
 p.coins-=s.next.price;a.pockets.owned=s.owned+1;while(a.pockets.slots.length<a.pockets.owned)a.pockets.slots.push(null);return true;
}
export const specialUnlocked=(p,id,n=NUMBERS)=>id in n.pockets.unlock&&n.pockets.unlock[id]<=reachedDistrict(p.best,n);
const isActive=(id,n)=>n.pockets.active.includes(id);
export function canEquip(p,slot,id,c=CONTENT,n=NUMBERS){
 const a=A(p),owned=a.pockets?.owned||0;
 if(!Number.isInteger(slot)||slot<0||slot>=owned)return {ok:false,reason:'slot'};
 if(id==null)return {ok:true};
 if(!c.SPECIALS[id]||!(id in n.pockets.unlock))return {ok:false,reason:'unknown'};
 if(!specialUnlocked(p,id,n))return {ok:false,reason:'later'};
 const others=(a.pockets.slots||[]).filter((x,i)=>i!==slot&&x&&x!==id);
 const act=n.pockets.oneActive&&isActive(id,n)&&others.find(x=>isActive(x,n));
 if(act)return {ok:false,reason:'active',other:act};
 for(const pair of n.pockets.exclusive)if(pair.includes(id)){const o=others.find(x=>x!==id&&pair.includes(x));if(o)return {ok:false,reason:'exclusive',other:o};}
 return {ok:true};
}
// Free swap: an id already in another pocket moves to the target one.
export function equip(p,slot,id,c=CONTENT,n=NUMBERS){
 if(!canEquip(p,slot,id,c,n).ok)return false;const s=own(p).pockets.slots;
 while(s.length<=slot)s.push(null);if(id!=null)s.forEach((x,i)=>{if(x===id)s[i]=null;});s[slot]=id??null;return true;
}
// Picker for one pocket: only unlocked specials, grouped; specials of later districts only as "More in <district>".
export function specialsView(p,slot,c=CONTENT,n=NUMBERS){
 const ids=Object.keys(c.SPECIALS).filter(id=>specialUnlocked(p,id,n)),row=id=>({id,...canEquip(p,slot,id,c,n)});
 const later=Object.values(n.pockets.unlock).filter(d=>d>reachedDistrict(p.best,n));
 return {active:ids.filter(id=>isActive(id,n)).map(row),passive:ids.filter(id=>!isActive(id,n)).map(row),moreIn:later.length?Math.min(...later):null};
}

// --- nodes not bound to a place (Night Route, Autopilot) ---
const nodeOpen=(p,req,c,n)=>req==null?true:req==='finished'?isFinished(p,n):req.found?isFound(p.best,c.PLACES.findIndex(x=>x.id===req.found),n):false;
export function nodeStates(p,c=CONTENT,n=NUMBERS){
 return Object.entries(c.NODES).filter(([,x])=>nodeOpen(p,x.requires,c,n)).map(([id,x])=>{
  const price=n.nodes[id]?.price??null,owned=!!A(p).nodes?.[id];
  return {id,placeId:x.placeId??null,price,state:owned?'owned':price==null?'soon':'available',ok:!owned&&price!=null&&(p.coins||0)>=price};
 });
}
export function buyNode(p,id,c=CONTENT,n=NUMBERS){
 const s=nodeStates(p,c,n).find(x=>x.id===id);if(!s?.ok)return false;p.coins-=s.price;own(p).nodes[id]=true;return true;
}

// --- novelties (§3.4): p.atlas.pending keys: bonus id | 'district:<id>' | 'paper:<id>' | 'line:<character>:<n>' | 'finale' | {kind:'pastFlights',places}. ---
export const PRIORITY=['finale','past','district','bonus','paper','line'];
export function noveltyKey(x){return x.type==='bonus'?x.id:x.type==='finale'?'finale':x.type==='past'?{kind:'pastFlights',places:x.count}:x.type==='line'?`line:${x.character}:${x.n}`:`${x.type}:${x.id}`;}
export function parseNovelty(key,c=CONTENT,n=NUMBERS){
 if(key&&key.kind==='pastFlights'){const count=+key.places;return Number.isInteger(count)&&count>0?{type:'past',count}:null;} // v3→v4 migration (storage.js)
 if(typeof key!=='string')return null;if(key==='finale')return {type:'finale'};
 const [t,a,b]=key.split(':');
 if(t==='district'){const d=c.DISTRICTS.findIndex(x=>x.id===a);if(d<1)return null;
  const specials=Object.keys(c.SPECIALS).filter(s=>n.pockets.unlock[s]===d);
  return {type:'district',id:a,district:d,specials,pocket:d===n.pockets.secondFromDistrict?2:null,line:1,character:c.DISTRICTS[d].character.id};}
 if(t==='paper')return Object.hasOwn(c.PAPERS,a)?{type:'paper',id:a}:null;
 if(t==='line'){const d=c.DISTRICTS.findIndex(x=>x.character.id===a),k=+b;return d>=0&&Number.isInteger(k)&&k>=1&&k<=c.DISTRICTS[d].character.lines.length?{type:'line',character:a,district:d,n:k}:null;}
 if(b===undefined&&Object.hasOwn(c.BONUSES,t)){const i=placeOfBonus(t,c);return {type:'bonus',id:t,placeId:c.PLACES[i]?.id,index:i,paper:i>=0?opensPaper(i,n):null};}
 return null;
}
export const isNoveltyKey=(key,c=CONTENT,n=NUMBERS)=>!!parseNovelty(key,c,n);
// Everything a throw from prevBest to best found, ordered by priority (not yet queued).
export function discoveries(prevBest,best,p,c=CONTENT,n=NUMBERS){
 const out=[],k0=foundCount(prevBest,n),k1=foundCount(best,n),P=per(n),last=c.DISTRICTS.length-1;
 for(let i=k0;i<k1;i++){
  const d=districtOf(i,n),local=i%P;
  if(local===0&&d>0){out.push({type:'district',id:c.DISTRICTS[d].id});const prev=c.DISTRICTS[d-1].character;out.push({type:'line',character:prev.id,n:3});}
  if(i===0)out.push({type:'line',character:c.DISTRICTS[0].character.id,n:1});
  out.push({type:'bonus',id:c.PLACES[i].bonus});
  if(local+1===LINE_AT_PLACE)out.push({type:'line',character:c.DISTRICTS[d].character.id,n:2});
 }
 if(isDelivered(best,n)&&!isDelivered(prevBest,n))out.push({type:'finale'},{type:'line',character:c.DISTRICTS[last].character.id,n:3});
 return out.map(x=>parseNovelty(noveltyKey(x),c,n)).filter(Boolean).sort((x,y)=>PRIORITY.indexOf(x.type)-PRIORITY.indexOf(y.type));
}
export function queueNovelties(p,list,c=CONTENT){
 const a=own(p);for(const x of list){
  if(x.type==='line'&&(+a.lines[x.character]||0)>=x.n)continue;
  const key=noveltyKey(x),j=JSON.stringify(key);if(!a.pending.some(y=>JSON.stringify(y)===j))a.pending.push(key);
 }return a.pending.length;
}
// One novelty per throw for the result screen: highest priority first, the rest waits.
export function takeNovelty(p,c=CONTENT,n=NUMBERS){
 const a=own(p);let best=-1,rank=Infinity;
 a.pending.forEach((key,i)=>{const x=parseNovelty(key,c,n),r=x?PRIORITY.indexOf(x.type):Infinity;if(r<rank){rank=r;best=i;}});
 if(best<0){a.pending=[];return null;}
 const x=parseNovelty(a.pending.splice(best,1)[0],c,n);
 const hear=(id,k)=>{a.lines[id]=Math.max(+a.lines[id]||0,k);};
 if(x.type==='district')hear(x.character,1);
 if(x.type==='line')hear(x.character,x.n);
 if(x.type==='finale'){a.finished=true;for(const d of c.DISTRICTS)hear(d.character.id,d.character.lines.length);}
 return x;
}

// --- seen, notice dot, hint ---
export function markSeen(p,id){const a=own(p);if(!a.seen.includes(id))a.seen.push(id);}
// Dot on the Atlas button: only unseen new things, never "you can afford something" (§2.3, question 4).
export function atlasNotice(p,c=CONTENT,n=NUMBERS){
 const a=A(p),k=foundCount(p.best,n);
 if(c.PLACES.slice(0,k).some(x=>!a.seen.includes(x.bonus)))return true;
 if((a.pockets?.owned||0)>0&&Object.keys(c.SPECIALS).some(id=>specialUnlocked(p,id,n)&&!a.seen.includes(id)))return true;
 return nodeStates(p,c,n).some(x=>x.state==='available'&&!a.seen.includes(x.id));
}
export function openAtlas(p){own(p).hintOpens=(+p.atlas.hintOpens||0)+1;}
export const showHint=p=>(+A(p).hintOpens||0)<HINT_OPENS;
