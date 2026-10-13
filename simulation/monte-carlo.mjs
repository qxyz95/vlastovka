// Monte Carlo simulace progrese hráče (kampaň fresh() → 500 m), pravidla 0.6.
// Spuštění: node simulation/monte-carlo.mjs [běhů na kombinaci=250] [běhů na scénář=1000] [násobky cen pro sken, např. 2,3,4]
// Zapisuje jen simulation/monte-carlo.json, tabulky tiskne jako Markdown na stdout.
// Logiku hry bere ze src/ beze změn; ceny a odměnu přepisuje jen lokálně v procesu workeru.
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {availableParallelism} from 'node:os';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {fresh,buy,createFlight,step,settle,activeEvent,eventInput} from '../src/core.js';
import {throwSettings} from '../src/throw.js';
import {eventStats} from '../src/events.js';
import {PRICES,VERSION} from '../src/config.js';

const BASE_PRICES=[...PRICES];
const CAP=300, UI_SECONDS=8, UNLOCK=100;
// Profily dovednosti: síla ~ N(mu,sigma) oříznutá na [0,1]; úhel ± N(0,angle) stupňů;
// QTE = šum časování v sekundách (osobní bias ~ N(0,qte/2) + šum každé akce N(0,qte)), reakce na holuba.
export const SKILLS={
 slabý:{mu:.5,sigma:.12,angle:5,qte:.22,react:.45},
 průměrný:{mu:.7,sigma:.10,angle:3.5,qte:.14,react:.35},
 dobrý:{mu:.85,sigma:.07,angle:2.5,qte:.09,react:.3},
 expert:{mu:.95,sigma:.04,angle:1.5,qte:.05,react:.25},
};
export const BUYS=['síla','rovnoměrně','nejlevnější','náhodně','papír','přehyby'], ANGLES=['15°','učící'], MODELS=['šipka','kluzák','lepší'];
const COMBOS=BUYS.flatMap(b=>ANGLES.flatMap(a=>MODELS.map(m=>({buy:b,angle:a,model:m}))));
// Realistický mix pro ceny: původní 4 nákupní strategie × učící úhel × 3 modely.
const MIX=COMBOS.filter(c=>c.angle==='učící'&&['síla','rovnoměrně','nejlevnější','náhodně'].includes(c.buy));
const BR=['power','paper','fold'];

// --- vlastní RNG hráče: FNV-1a → splitmix32 → xoshiro128**; nezávislý na random(seed) hry ---
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rngFrom(key){
 let x=hash(key);const sm=()=>{x=x+0x9E3779B9|0;let z=x;z=Math.imul(z^z>>>16,0x85EBCA6B);z=Math.imul(z^z>>>13,0xC2B2AE35);return (z^z>>>16)>>>0;};
 let a=sm(),b=sm(),c=sm(),d=sm();
 return ()=>{const m=Math.imul(b,5),r=Math.imul((m<<7)|(m>>>25),9)>>>0,t=b<<9;c^=a;d^=b;b^=c;a^=d;c^=t;d=(d<<11)|(d>>>21);return r/4294967296;};
}
const gauss=r=>{let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());};
const clip=(v,a,b)=>Math.max(a,Math.min(b,v));

function shop(p,strategy,r){
 const L=p.levels;let n=0;
 for(let guard=0;guard<20;guard++){
  const open=BR.filter(b=>L[b]<5);if(!open.length)break;let target;
  const first=strategy==='síla'?'power':strategy==='papír'?'paper':strategy==='přehyby'?'fold':null;
  if(first)target=L[first]<5?first:open.sort((a,b)=>L[a]-L[b])[0];
  else if(strategy==='rovnoměrně')target=open.sort((a,b)=>L[a]-L[b])[0];
  else if(strategy==='nejlevnější')target=open.reverse().sort((a,b)=>PRICES[L[a]]-PRICES[L[b]])[0]; // shoda: přehyby, papír, síla
  else {const afford=open.filter(b=>p.coins>=PRICES[L[b]]);if(!afford.length)break;target=afford[Math.floor(r()*afford.length)];}
  if(!buy(p,target,L[target]+1))break;n++;
 }
 return n;
}

// Učící hráč: pro každý model si pamatuje poslední dolet na každém úhlu (krok 5°), hraje nejlepší, občas zkusí soused.
function chooseAngle(st,s,r){
 if(s==='15°')return 15;
 const tried=Object.keys(st.dist).map(Number);
 if(!tried.length)return 20;
 const best=tried.reduce((a,b)=>st.dist[b]>st.dist[a]?b:a);
 const eps=st.n<5?.35:.15;
 return r()<eps?clip(best+(r()<.5?-5:5),5,40):best;
}
// Model: šipka celou hru / kluzák hned po odemčení / „lepší“ = porovnává poslední dolety obou modelů, 15 % zkouší druhý.
function chooseModel(p,s,ms,r){
 if(p.best<UNLOCK||s==='šipka')return 'dart';
 if(s==='kluzák')return 'glider';
 if(ms.glider==null)return 'glider';
 const best=ms.glider>ms.dart?'glider':'dart';
 return r()<.15?(best==='dart'?'glider':'dart'):best;
}

// Jeden hod se skutečnou fyzikou a QTE ovládanými šumem časování (stisk ve varování hra ignoruje → hráč klepne znovu za 0,25 s).
function flyOnce(p,sk,player,angleDeg,r,opt){
 const charge=clip(sk.mu+sk.sigma*gauss(r),0,1);
 const launch=throwSettings(angleDeg+sk.angle*gauss(r),charge);
 const f=createFlight(p.model,p.levels,p.attempts+1,{x:0,y:0},launch);
 while(!f.landed&&f.t<240){
  const e=activeEvent(f);
  if(e&&!e.result&&!opt.noQte){
   if(!e.plan)e.plan=e.type==='gust'
    ?{press:e.at+1.4+player.bias+sk.qte*gauss(r)}
    :{press:e.at+.8+Math.max(-.5,sk.react+sk.qte*1.2*gauss(r)),hold:.75+player.bias+sk.qte*gauss(r)};
   const pl=e.plan;
   if(e.heldAt===null&&!pl.done&&f.t>=pl.press){if(eventInput(f,'down','key')===null&&!e.result)pl.press+=.25;else pl.done=true;}
   else if(e.type==='bird'&&e.heldAt!==null&&!e.result&&f.t>=e.heldAt+pl.hold)eventInput(f,'up','key');
  }
  step(f);
 }
 return {f,charge};
}

export function campaign(skillName,combo,key,opt={}){
 const sk=SKILLS[skillName],r=rngFrom(key),p=fresh(),rewardMul=opt.rewardMul??1;
 const player={bias:sk.qte/2*gauss(r)},ang={dart:{dist:{},n:0},glider:{dist:{},n:0}},last={dart:null,glider:null};
 let time=0,to100=null,t100=null,to500=null,t500=null,qDone=0,qHit=0,qPerf=0,buys=0,earned=0,firstBuy=null,glider=0,flight=0;
 while(!p.completed&&p.attempts<CAP){
  p.model=chooseModel(p,combo.model,last,r);
  const st=ang[p.model],a=chooseAngle(st,combo.angle,r);
  const {f}=flyOnce(p,sk,player,a,r,opt);
  const before=p.coins;settle(p,f);const gain=Math.floor((p.coins-before)*rewardMul);p.coins=before+gain;earned+=gain;
  const d=f.x-f.startX;st.dist[a]=d;st.n++;last[p.model]=d;if(p.model==='glider')glider++;
  time+=f.t+UI_SECONDS;flight+=f.t;
  const s=eventStats(f);qDone+=s.completed;qHit+=s.hits;qPerf+=s.perfect;
  if(to100===null&&p.best>=UNLOCK){to100=p.attempts;t100=time;}
  if(p.completed){to500=p.attempts;t500=time;break;}
  const n=shop(p,combo.buy,r);buys+=n;if(n&&firstBuy===null)firstBuy=p.attempts;
 }
 return {skill:skillName,...combo,throws:p.attempts,done:p.completed,to100,t100,to500,t500,time,flight,best:Math.round(p.best),coins:p.coins,earned,buys,firstBuy,
  levels:{...p.levels},gliderShare:glider/p.attempts,finalModel:p.model,qDone,qHit,qPerf};
}

// Marginální vliv větví: průměrný hráč (s QTE, úhel = ideál modelu + 5°… přesněji nejlepší z mřížky), průměr 200 seedů.
function branchTable(){
 const sk=SKILLS.průměrný,rows=[];
 const dist=(model,lv)=>{let best=0;for(const a of [15,20,25,30,35,40]){let s=0;for(let i=0;i<200;i++){const r=rngFrom(`br|${model}|${i}`),p={...fresh(),model,levels:lv,attempts:i+1};s+=flyOnce(p,sk,{bias:0},a,r,{}).f.x;}best=Math.max(best,s/200);}return best;};
 for(const model of ['dart','glider']){
  for(const b of BR)rows.push({model,branch:b,dist:[0,1,2,3,4,5].map(L=>dist(model,{power:0,paper:0,fold:0,[b]:L}))});
  rows.push({model,branch:'vše',dist:[0,1,2,3,4,5].map(L=>dist(model,{power:L,paper:L,fold:L}))});
 }
 return rows;
}

// --- worker ---
if(!isMainThread){
 const out=[];
 for(const t of workerData.tasks){
  if(t.branches){out.push({branches:branchTable()});continue;}
  PRICES.splice(0,PRICES.length,...(t.prices??BASE_PRICES));
  for(let i=t.from;i<t.to;i++){
   const pick=rngFrom(`${t.skill}|mix|${i}`);
   const combo=t.combo??MIX[Math.floor(pick()*MIX.length)];
   const key=t.combo?`${t.skill}|${combo.buy}|${combo.angle}|${combo.model}|${i}`:`${t.skill}|mixplayer|${i}`; // stejní hráči napříč scénáři (common random numbers)
   const res=campaign(t.skill,combo,key,t.opt??{});res.scenario=t.scenario;out.push(res);
  }
 }
 parentPort.postMessage(out);
}

// --- hlavní vlákno ---
const q=(v,p)=>{if(!v.length)return null;const a=[...v].sort((x,y)=>x-y);const i=(a.length-1)*p,lo=Math.floor(i);return a[lo]+(a[Math.min(lo+1,a.length-1)]-a[lo])*(i-lo);};
const mean=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
const f1=v=>v==null?'–':(Math.round(v*10)/10).toLocaleString('cs-CZ');
const f0=v=>v==null?'–':Math.round(v).toLocaleString('cs-CZ');
const pct=v=>v==null?'–':(Math.round(v*1000)/10).toLocaleString('cs-CZ')+' %';
function stats(rows){
 const n=rows.length,done=rows.filter(r=>r.done);
 // Nedokončené běhy se do kvantilů počítají jako cap (cenzurováno) → kvantily jsou dolní odhad.
 const th=rows.map(r=>r.done?r.to500:CAP),tm=rows.map(r=>(r.done?r.t500:r.time)/60);
 const h100=rows.filter(r=>r.to100!=null);
 return {n,softlock:(n-done.length)/n,
  throws500:{p10:q(th,.1),p50:q(th,.5),p90:q(th,.9)},min500:{p10:q(tm,.1),p50:q(tm,.5),p90:q(tm,.9)},
  throws100:{p10:q(h100.map(r=>r.to100),.1),p50:q(h100.map(r=>r.to100),.5),p90:q(h100.map(r=>r.to100),.9)},
  min100:{p50:q(h100.map(r=>r.t100/60),.5)},
  secPerThrow:mean(rows.map(r=>r.time/r.throws)),
  coinsEnd:mean(rows.map(r=>r.coins)),earned:mean(rows.map(r=>r.earned)),buys:mean(rows.map(r=>r.buys)),
  levels:Object.fromEntries(BR.map(b=>[b,mean(rows.map(r=>r.levels[b]))])),
  gliderShare:mean(rows.map(r=>r.gliderShare)),finalGlider:mean(rows.map(r=>r.finalModel==='glider'?1:0)),
  qteHit:rows.reduce((a,r)=>a+r.qHit,0)/Math.max(1,rows.reduce((a,r)=>a+r.qDone,0)),
  qtePerfect:rows.reduce((a,r)=>a+r.qPerf,0)/Math.max(1,rows.reduce((a,r)=>a+r.qDone,0)),
  qtePerThrow:rows.reduce((a,r)=>a+r.qDone,0)/rows.reduce((a,r)=>a+r.throws,0),
  bestUnfinished:q(rows.filter(r=>!r.done).map(r=>r.best),.5)};
}

// Kandidáti doporučení: [název, ceny, volby]
export const RECOMMEND=[
 ['A: 25/75/140/215/300 (×2,5)',[25,75,140,215,300],{}],
 ['D: 20/70/150/250/400',[20,70,150,250,400],{}],
];
// Faktoriál strategií běží pro aktuální ceny a pro doporučení.
const FACTORIAL=[['aktuální',null],['návrh A',[25,75,140,215,300]]];

async function main(){
 const perCombo=Number(process.argv[2]??250),perScenario=Number(process.argv[3]??1000);
 const sweep=(process.argv[4]??'').split(',').filter(Boolean).map(Number);
 const t0=performance.now(),tasks=[{branches:true}];
 const scen=(scenario,opt={},prices=null,count=perScenario)=>{for(const skill of Object.keys(SKILLS))for(let i=0;i<count;i+=50)tasks.push({scenario,skill,from:i,to:Math.min(count,i+50),opt,prices});};
 if(perCombo>0)for(const [set,prices] of FACTORIAL)for(const skill of Object.keys(SKILLS))for(const combo of COMBOS)for(let i=0;i<perCombo;i+=50)tasks.push({scenario:'základ|'+set,skill,combo,from:i,to:Math.min(perCombo,i+50),prices});
 const P=m=>BASE_PRICES.map(x=>Math.round(x*m/5)*5);
 scen('aktuální (×1)',{});
 scen('ceny ×2',{},P(2));
 scen('ceny ×3',{},P(3));
 scen('odměna ÷2',{rewardMul:.5});
 scen('aktuální, bez QTE',{noQte:true});
 for(const m of sweep)scen(`ceny ×${m}`,{},P(m));
 for(const [name,prices,opt] of RECOMMEND)scen(name,opt,prices);
 // rozdělení úloh do workerů (prokládaně kvůli vyvážení)
 const W=Math.max(1,availableParallelism()-1),chunks=Array.from({length:W},()=>[]);
 tasks.forEach((t,i)=>chunks[i%W].push(t));
 const raw=(await Promise.all(chunks.map(c=>new Promise((res,rej)=>{const w=new Worker(fileURLToPath(import.meta.url),{workerData:{tasks:c}});w.on('message',res);w.on('error',rej);})))).flat();
 const branches=raw.find(r=>r.branches).branches,results=raw.filter(r=>!r.branches);
 const seconds=(performance.now()-t0)/1000;
 const by=(rows,f)=>{const m=new Map();for(const r of rows){const k=f(r);if(!m.has(k))m.set(k,[]);m.get(k).push(r);}return m;};
 const base=results.filter(r=>r.scenario.startsWith('základ|')),set=r=>r.scenario.slice(7);
 const out={version:VERSION,generated:new Date().toISOString(),seconds,campaigns:results.length,cap:CAP,uiSeconds:UI_SECONDS,skills:SKILLS,basePrices:BASE_PRICES,recommend:RECOMMEND,
  bySkill:{},byFactor:{},byCombo:{},scenarios:{},branches};
 for(const [s,rows] of by(base,r=>set(r)+'|'+r.skill))out.bySkill[s]=stats(rows);
 for(const fac of ['buy','angle','model'])for(const [k,rows] of by(base,r=>set(r)+'|'+r.skill+'|'+r[fac]))out.byFactor[fac+'|'+k]=stats(rows);
 for(const [k,rows] of by(base,r=>[set(r),r.skill,r.buy,r.angle,r.model].join('|')))out.byCombo[k]=stats(rows);
 for(const [k,rows] of by(results.filter(r=>!r.scenario.startsWith('základ|')),r=>r.scenario+'|'+r.skill))out.scenarios[k]=stats(rows);
 for(const [k,rows] of by(results.filter(r=>!r.scenario.startsWith('základ|')),r=>r.scenario+'|'+r.skill+'|'+r.model))out.scenarios[k]=stats(rows);
 await writeFile(new URL('./monte-carlo.json',import.meta.url),JSON.stringify(out,null,1));
 console.log(markdown(out));
 console.log(`\nKampaní: ${results.length}, workerů: ${W}, čas: ${seconds.toFixed(1)} s`);
}

function markdown(o){
 const L=[],sk=Object.keys(SKILLS),has=Object.keys(o.bySkill).length;
 const cell=s=>`${f0(s.throws500.p50)} (${f0(s.throws500.p10)}–${f0(s.throws500.p90)}) / ${f1(s.min500.p50)} (${f1(s.min500.p10)}–${f1(s.min500.p90)}) / ${pct(s.softlock)}`;
 if(has)for(const [fs] of FACTORIAL){
  L.push('',`## Faktoriál: ceny ${fs}`,'','### Profily (všech 36 strategií)','| Profil | Softlock | Hody do 100 m | Hody do 500 m P50 (P10–P90) | Minuty do 500 m | s/hod |','|---|---:|---:|---:|---:|---:|');
  for(const s of sk){const x=o.bySkill[fs+'|'+s];L.push(`| ${s} | ${pct(x.softlock)} | ${f0(x.throws100.p50)} | ${f0(x.throws500.p50)} (${f0(x.throws500.p10)}–${f0(x.throws500.p90)}) | ${f1(x.min500.p50)} (${f1(x.min500.p10)}–${f1(x.min500.p90)}) | ${f0(x.secPerThrow)} |`);}
  L.push('','### Ekonomika a QTE podle profilu','| Profil | Mince na konci | Vyděláno | Nákupů | Síla/papír/přehyby (Ø) | Podíl hodů kluzákem | QTE úspěch | QTE perfekt | QTE na hod | Nejlepší dolet nedohraných |','|---|---:|---:|---:|---|---:|---:|---:|---:|---:|');
  for(const s of sk){const x=o.bySkill[fs+'|'+s];L.push(`| ${s} | ${f0(x.coinsEnd)} | ${f0(x.earned)} | ${f1(x.buys)} | ${BR.map(b=>f1(x.levels[b])).join(' / ')} | ${pct(x.gliderShare)} | ${pct(x.qteHit)} | ${pct(x.qtePerfect)} | ${f1(x.qtePerThrow)} | ${f0(x.bestUnfinished)} |`);}
  for(const [fac,vals,title] of [['buy',BUYS,'Strategie nákupu'],['angle',ANGLES,'Strategie úhlu'],['model',MODELS,'Model']]){
   L.push('',`### ${title}: hody / minuty do 500 m P50 (softlock)`,`| ${title} | ${sk.join(' | ')} |`,`|---|${sk.map(()=>'---:').join('|')}|`);
   for(const v of vals)L.push(`| ${v} | ${sk.map(s=>{const x=o.byFactor[`${fac}|${fs}|${s}|${v}`];return `${f0(x.throws500.p50)} / ${f1(x.min500.p50)} min (${pct(x.softlock)})`;}).join(' | ')} |`);
  }
  L.push('','### Učící úhel: model × nákup, hody / minuty do 500 m P50 (softlock), průměrný hráč','| Nákup | '+MODELS.join(' | ')+' |','|---|'+MODELS.map(()=>'---:').join('|')+'|');
  for(const b of BUYS)L.push(`| ${b} | ${MODELS.map(m=>{const x=o.byCombo[`${fs}|průměrný|${b}|učící|${m}`];return `${f0(x.throws500.p50)} / ${f1(x.min500.p50)} min (${pct(x.softlock)})`;}).join(' | ')} |`);
 }
 const names=[...new Set(Object.keys(o.scenarios).filter(k=>k.split('|').length===2).map(k=>k.split('|')[0]))];
 L.push('','### Scénáře (mix: 4 nákupní strategie × učící úhel × 3 modely; stejní hráči napříč scénáři)','Buňka: hody P50 (P10–P90) / minuty P50 (P10–P90) / softlock','','| Scénář | '+sk.join(' | ')+' |','|---|'+sk.map(()=>'---').join('|')+'|');
 for(const n of names)L.push(`| ${n} | ${sk.map(s=>cell(o.scenarios[`${n}|${s}`])).join(' | ')} |`);
 L.push('','### Scénáře podle modelu (průměrný a slabý hráč): hody P50 / minuty P50 / softlock','| Scénář | '+['průměrný','slabý'].flatMap(s=>MODELS.map(m=>`${s} ${m}`)).join(' | ')+' |','|---|'+Array(6).fill('---').join('|')+'|');
 for(const n of names)L.push(`| ${n} | ${['průměrný','slabý'].flatMap(s=>MODELS.map(m=>{const x=o.scenarios[`${n}|${s}|${m}`];return x?`${f0(x.throws500.p50)} / ${f1(x.min500.p50)} / ${pct(x.softlock)}`:'–';})).join(' | ')} |`);
 L.push('','### Marginální vliv větví (průměrný hráč s QTE, nejlepší úhel z mřížky 15–40°, průměr 200 hodů), dolet v m na úrovni 0–5','| Model | Větev | 0 | 1 | 2 | 3 | 4 | 5 |','|---|---|---:|---:|---:|---:|---:|---:|');
 for(const b of o.branches)L.push(`| ${b.model==='dart'?'šipka':'kluzák'} | ${b.branch} | ${b.dist.map(f0).join(' | ')} |`);
 return L.join('\n');
}

if(isMainThread&&process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
