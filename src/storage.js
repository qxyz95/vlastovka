import {fresh} from './core.js';
import {routeAt,ROUTE} from './scenes.js';
// ID lists, caps and rules come from the Atlas modules (no own copies). No import cycle: atlas.js imports only
// atlas-content.js and atlas-numbers.js (→ scenes.js), none of which import storage.js or core.js.
import {BONUSES,SPECIALS,NODES,DISTRICTS} from './atlas-content.js';
import {NUMBERS} from './atlas-numbers.js';
import {isNoveltyKey,maxLevelOf} from './atlas.js';
export const KEY='just-throw-it-v1';
export const ATLAS_BONUSES=Object.keys(BONUSES),ATLAS_SPECIALS=Object.keys(SPECIALS),ATLAS_NODES=Object.keys(NODES);
export const ATLAS_ACTIVE=ATLAS_SPECIALS.filter(id=>SPECIALS[id].active),ATLAS_EXCLUSIVE=NUMBERS.pockets.exclusive;
export const ATLAS_CHARACTERS=DISTRICTS.map(d=>d.character.id),MAX_POCKETS=NUMBERS.pockets.prices.length;
const maxExtra=id=>ATLAS_BONUSES.includes(id)?maxLevelOf(id)-1:0;
const KNOWN=[...ATLAS_BONUSES,...ATLAS_SPECIALS,...ATLAS_NODES];
const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v),count=(v,max)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
// p.atlas.pending items (novelty keys of atlas.js, one shown per throw): any string isNoveltyKey accepts
// ('chain', 'district:moon', 'paper:kraft', 'line:bolts:2', 'finale') and {kind:'pastFlights',places:N}
// from the v3 → v4 migration only ("Your past flights found N places", 2 ≤ N ≤ 16).
const PAST='pastFlights',PENDING_MAX=64;
// parseNovelty uses `in`/plain lookups, so 'constructor' or 'paper:toString' would pass; reject inherited names.
const novelty=x=>typeof x==='string'&&!x.split(':').some(k=>k in Object.prototype)&&isNoveltyKey(x);
const lineCount=id=>DISTRICTS.find(d=>d.character.id===id)?.character.lines.length??0;
export function placesFound(best){return Math.min(ROUTE.length,routeAt(best).screen+1);}
// Returns a clean atlas. lossy = something was dropped or clipped (unknown IDs, rule breaks),
// broken = a field had the wrong type or the whole atlas is not an object (reset to defaults).
export function sanitizeAtlas(a){
  const out=fresh().atlas,r={atlas:out,lossy:false,broken:false},drop=()=>{r.lossy=true;},bad=()=>{r.broken=true;};
  if(!obj(a)){bad();return r;}
  if(obj(a.levels))for(const [id,l] of Object.entries(a.levels)){
    const max=maxExtra(id);if(!max||!Number.isSafeInteger(l)||l<0){drop();continue;}
    if(l>max)drop();if(l>0)out.levels[id]=Math.min(l,max);}
  else if(a.levels!==undefined)bad();
  const ids=(list,ok)=>{if(!Array.isArray(list)){if(list!==undefined)bad();return [];}const seen=new Set();
    return list.filter(x=>{const k=typeof x==='string'?x:JSON.stringify(x);if(!ok(x)||seen.has(k)){drop();return false;}seen.add(k);return true;});};
  out.seen=ids(a.seen,x=>KNOWN.includes(x));
  out.pending=ids(a.pending,x=>novelty(x)||obj(x)&&x.kind===PAST&&Number.isSafeInteger(x.places)&&x.places>=2&&x.places<=ROUTE.length&&Object.keys(x).length===2);
  if(out.pending.length>PENDING_MAX){out.pending.length=PENDING_MAX;drop();}
  if(obj(a.lines))for(const [id,n] of Object.entries(a.lines)){const max=lineCount(id);if(!max||!Number.isSafeInteger(n)||n<0){drop();continue;}if(n>max)drop();out.lines[id]=Math.min(n,max);}
  else if(a.lines!==undefined)bad();
  const pk=a.pockets;
  if(obj(pk)){
    if(Number.isSafeInteger(pk.owned)&&pk.owned>=0){if(pk.owned>MAX_POCKETS)drop();out.pockets.owned=Math.min(pk.owned,MAX_POCKETS);}else if(pk.owned!==undefined)bad();
    if(Array.isArray(pk.slots)){
      if(pk.slots.length>MAX_POCKETS&&pk.slots.slice(MAX_POCKETS).some(x=>x!==null))drop();
      const kept=[];
      for(let i=0;i<MAX_POCKETS;i++){const id=pk.slots[i]??null;if(id===null)continue;
        const ok=ATLAS_SPECIALS.includes(id)&&i<out.pockets.owned&&!kept.includes(id)&&!(ATLAS_ACTIVE.includes(id)&&kept.some(k=>ATLAS_ACTIVE.includes(k)))&&!ATLAS_EXCLUSIVE.some(pair=>pair.includes(id)&&kept.some(k=>k!==id&&pair.includes(k)));
        if(ok){out.pockets.slots[i]=id;kept.push(id);}else drop();}
    }else if(pk.slots!==undefined)bad();
  }else if(pk!==undefined)bad();
  if(obj(a.nodes))for(const [id,v] of Object.entries(a.nodes)){if(ATLAS_NODES.includes(id)&&typeof v==='boolean')out.nodes[id]=v;else drop();}
  else if(a.nodes!==undefined)bad();
  if(typeof a.finished==='boolean')out.finished=a.finished;else if(a.finished!==undefined)bad();
  if(count(a.hintOpens,Number.MAX_SAFE_INTEGER))out.hintOpens=a.hintOpens;else if(a.hintOpens!==undefined)bad();
  const u=a.undo;
  if(obj(u)&&maxExtra(u.id)&&count(u.level,maxLevelOf(u.id))&&count(u.price,Number.MAX_SAFE_INTEGER))out.undo={id:u.id,level:u.level,price:u.price};
  else if(u!==null&&u!==undefined)drop();
  return r;
}
// Like decode(), but also reports whether the atlas lost data (load() then backs up the raw save).
export function decodeSave(raw) {
  if(raw===null) return {data:fresh(),lossy:false,broken:false};
  const p=JSON.parse(raw);
  if(!p||![1,2,3,4].includes(p.version)||!Number.isSafeInteger(p.coins)||p.coins<0||!Number.isFinite(p.best)||p.best<0||!Number.isSafeInteger(p.attempts)||p.attempts<0||typeof p.completed!=='boolean'||!['dart','glider'].includes(p.model)||!p.levels) throw Error('Invalid save');
  const branches=['power','paper','fold'],valid=l=>l&&branches.every(b=>Number.isInteger(l[b])&&l[b]>=0&&l[b]<=5);
  // v2 had separate trees per model; shared tree keeps the better level of each branch.
  if(p.version===2){if(!valid(p.levels.dart)||!valid(p.levels.glider)) throw Error('Invalid levels');p.levels=Object.fromEntries(branches.map(b=>[b,Math.max(p.levels.dart[b],p.levels.glider[b])]));}
  if(!valid(p.levels)) throw Error('Invalid levels');
  p.levels=Object.fromEntries(branches.map(b=>[b,p.levels[b]]));
  let lossy=false,broken=false;
  // v3 → v4: empty atlas; discoveries are derived from p.best, so past flights get one summary notice instead of N.
  if(p.version<4){p.atlas=fresh().atlas;const n=placesFound(p.best);if(n>=2)p.atlas.pending=[{kind:PAST,places:n}];}
  else ({atlas:p.atlas,lossy,broken}=sanitizeAtlas(p.atlas));
  p.version=4;
  if(p.model==='glider'&&p.best<100) p.model='dart';
  p.completed=p.best>=500; return {data:p,lossy,broken};
}
export function decode(raw) {return decodeSave(raw).data;}
// A corrupt save is copied aside before the next save() overwrites it, so it can be recovered.
// The same backup is made when only the atlas had to be repaired; the rest of the progress stays.
export function load() {
  let raw=null;
  try{
    raw=localStorage.getItem(KEY);const {data,lossy,broken}=decodeSave(raw);let backup=false;
    if(lossy||broken)try{localStorage.setItem(KEY+'-corrupt',raw);backup=true;}catch{}
    return {data,warning:broken?(backup?'Atlas data was damaged and has been reset. The original save is backed up.':'Atlas data was damaged and has been reset.'):''};
  }
  catch{
    let backup=false;
    if(raw!==null)try{localStorage.setItem(KEY+'-corrupt',raw);backup=true;}catch{}
    return {data:fresh(),warning:backup?'Uložení je poškozené. Hraješ od začátku, původní data jsou zálohovaná.':'Uložení není dostupné nebo je poškozené. Hraješ od začátku.'};
  }
}
export function save(p) {try{localStorage.setItem(KEY,JSON.stringify(p));return '';}catch{return 'Postup nelze uložit. Zůstane jen do zavření stránky.';}}
