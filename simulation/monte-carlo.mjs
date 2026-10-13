// Monte Carlo simulace progrese hráče (kampaň fresh() → 500 m).
// Spuštění: node simulation/monte-carlo.mjs [běhů na kombinaci=250] [běhů na scénář citlivosti=1000]
// Zapisuje jen simulation/monte-carlo.json, tabulky tiskne jako Markdown na stdout.
// Logiku hry bere ze src/ beze změn; ceny a odměnu přepisuje jen lokálně v procesu workeru.
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {availableParallelism} from 'node:os';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {fresh,buy,createFlight,step,settle,reward,activeEvent,eventInput} from '../src/core.js';
import {throwSettings} from '../src/throw.js';
import {eventStats} from '../src/events.js';
import {PRICES,VERSION} from '../src/config.js';

const BASE_PRICES=[...PRICES];
const CAP=300, UI_SECONDS=8, GOAL=500, UNLOCK=100;
// Profily dovednosti: síla ~ N(mu,sigma) oříznutá na [0,1]; úhel ± N(0,angle) stupňů;
// QTE = šum časování v sekundách (osobní bias ~ N(0,qte/2) + šum každé akce N(0,qte)), reakce na ptáka.
export const SKILLS={
 slabý:{mu:.5,sigma:.12,angle:5,qte:.22,react:.45},
 průměrný:{mu:.7,sigma:.10,angle:3.5,qte:.14,react:.35},
 dobrý:{mu:.85,sigma:.07,angle:2.5,qte:.09,react:.3},
 expert:{mu:.95,sigma:.04,angle:1.5,qte:.05,react:.25},
};
export const BUYS=['síla','rovnoměrně','nejlevnější','náhodně'], ANGLES=['15°','25°','učící'], MODELS=['šipka','kluzák'];
const COMBOS=BUYS.flatMap(b=>ANGLES.flatMap(a=>MODELS.map(m=>({buy:b,angle:a,model:m}))));

// --- vlastní RNG hráče: FNV-1a → splitmix32 → xoshiro128**; nezávislý na random(seed) hry ---
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rngFrom(key){
 let x=hash(key);const sm=()=>{x=x+0x9E3779B9|0;let z=x;z=Math.imul(z^z>>>16,0x85EBCA6B);z=Math.imul(z^z>>>13,0xC2B2AE35);return (z^z>>>16)>>>0;};
 let a=sm(),b=sm(),c=sm(),d=sm();
 return ()=>{const r=Math.imul(((Math.imul(b,5)<<7)|(Math.imul(b,5)>>>25)),9)>>>0,t=b<<9;c^=a;d^=b;b^=c;a^=d;c^=t;d=(d<<11)|(d>>>21);return r/4294967296;};
}
const gauss=r=>{let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());};
const clip=(v,a,b)=>Math.max(a,Math.min(b,v));
const BR=['power','paper','fold'];

function shop(p,strategy,r){
 const L=()=>p.levels[p.model];let n=0;
 for(let guard=0;guard<20;guard++){
  const open=BR.filter(b=>L()[b]<5);if(!open.length)break;let target;
  if(strategy==='síla')target=L().power<5?'power':open.sort((a,b)=>L()[a]-L()[b])[0];
  else if(strategy==='rovnoměrně')target=open.sort((a,b)=>L()[a]-L()[b])[0];
  else if(strategy==='nejlevnější')target=open.reverse().sort((a,b)=>PRICES[L()[a]]-PRICES[L()[b]])[0]; // shoda: přehyby, papír, síla
  else {const afford=open.filter(b=>p.coins>=PRICES[L()[b]]);if(!afford.length)break;target=afford[Math.floor(r()*afford.length)];}
  if(!buy(p,target,L()[target]+1))break;n++;
 }
 return n;
}

function chooseAngle(st,s,r){
 if(s==='15°')return 15;if(s==='25°')return 25;
 const tried=Object.keys(st.dist).map(Number);
 if(!tried.length)return 20;
 const best=tried.reduce((a,b)=>st.dist[b]>st.dist[a]?b:a);
 const eps=st.n<5?.35:.15;
 return r()<eps?clip(best+(r()<.5?-5:5),5,40):best;
}

// Jeden hod se skutečnou fyzikou a QTE ovládanými šumem časování.
function flyOnce(p,sk,player,angleDeg,r,opt){
 const charge=clip(sk.mu+sk.sigma*gauss(r),0,1);
 const launch=throwSettings(angleDeg+sk.angle*gauss(r),charge);
 if(opt.launchFloor!=null)launch.multiplier=opt.launchFloor+(1.1-opt.launchFloor)*launch.power;
 const f=createFlight(p.model,p.levels[p.model],p.attempts+1,{x:0,y:0},launch);
 while(!f.landed&&f.t<180){
  const e=activeEvent(f);
  if(e&&!e.result&&!opt.noQte){
   if(!e.plan)e.plan=e.type==='gust'
    ?{press:e.at+1.4+player.bias+sk.qte*gauss(r)}
    :{down:e.at+.8+Math.max(-.5,sk.react+sk.qte*1.2*gauss(r)),hold:.75+player.bias+sk.qte*gauss(r)};
   const pl=e.plan;
   if(e.type==='gust'&&!pl.done&&f.t>=pl.press){pl.done=true;eventInput(f,'down','key');}
   if(e.type==='bird'){
    if(e.heldAt===null&&!pl.done&&f.t>=pl.down){pl.done=true;eventInput(f,'down','key');}
    else if(e.heldAt!==null&&!e.result&&f.t>=e.heldAt+pl.hold)eventInput(f,'up','key');
   }
  }
  step(f);
 }
 return {f,charge};
}

export function campaign(skillName,combo,key,opt={}){
 const sk=SKILLS[skillName],r=rngFrom(key),p=fresh(),rewardMul=opt.rewardMul??1;
 const player={bias:sk.qte/2*gauss(r)},ang={dist:{},n:0};
 let time=0,to100=null,t100=null,to500=null,t500=null,qDone=0,qHit=0,qPerf=0,buys=0,earned=0,chargeSum=0,firstBuy=null;
 while(!p.completed&&p.attempts<CAP){
  if(combo.model==='kluzák'&&p.best>=UNLOCK)p.model='glider';
  const a=chooseAngle(ang,combo.angle,r);
  const {f,charge}=flyOnce(p,sk,player,a,r,opt);
  const before=p.coins;settle(p,f);const gain=Math.floor((p.coins-before)*rewardMul);p.coins=before+gain;earned+=gain;
  chargeSum+=charge;
  const d=f.x-f.startX;ang.dist[a]=d;ang.n++;
  time+=f.t+UI_SECONDS;
  const s=eventStats(f);qDone+=s.completed;qHit+=s.hits;qPerf+=s.perfect;
  if(to100===null&&p.best>=UNLOCK){to100=p.attempts;t100=time;}
  if(p.completed){to500=p.attempts;t500=time;break;}
  const n=shop(p,combo.buy,r);buys+=n;if(n&&firstBuy===null)firstBuy=p.attempts;
 }
 return {skill:skillName,...combo,throws:p.attempts,done:p.completed,to100,t100,to500,t500,time,best:Math.round(p.best),coins:p.coins,earned,buys,firstBuy,
  dart:{...p.levels.dart},glider:{...p.levels.glider},qDone,qHit,qPerf,charge:chargeSum/p.attempts};
}

// --- worker ---
if(!isMainThread){
 const out=[];
 for(const t of workerData){
  PRICES.splice(0,PRICES.length,...(t.prices??BASE_PRICES));
  for(let i=t.from;i<t.to;i++){
   const pick=rngFrom(`${t.skill}|mix|${i}`);
   const combo=t.combo??COMBOS[Math.floor(pick()*COMBOS.length)];
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
 // Nedokončené běhy se do kvantilů počítají jako cap (cenzurováno) → medián je dolní odhad.
 const th=rows.map(r=>r.done?r.to500:CAP),tm=rows.map(r=>(r.done?r.t500:r.time)/60);
 const h100=rows.filter(r=>r.to100!=null);
 return {n,softlock:(n-done.length)/n,
  throws500:{p10:q(th,.1),p50:q(th,.5),p90:q(th,.9)},min500:{p10:q(tm,.1),p50:q(tm,.5),p90:q(tm,.9)},
  throws100:{p10:q(h100.map(r=>r.to100),.1),p50:q(h100.map(r=>r.to100),.5),p90:q(h100.map(r=>r.to100),.9)},
  min100:{p10:q(h100.map(r=>r.t100/60),.1),p50:q(h100.map(r=>r.t100/60),.5),p90:q(h100.map(r=>r.t100/60),.9)},
  never100:(n-h100.length)/n,
  coinsEnd:mean(rows.map(r=>r.coins)),earned:mean(rows.map(r=>r.earned)),buys:mean(rows.map(r=>r.buys)),
  firstBuy:q(rows.filter(r=>r.firstBuy!=null).map(r=>r.firstBuy),.5),
  levels:Object.fromEntries(['dart','glider'].map(m=>[m,Object.fromEntries(BR.map(b=>[b,mean(rows.map(r=>r[m][b]))]))])),
  qteHit:rows.reduce((a,r)=>a+r.qHit,0)/Math.max(1,rows.reduce((a,r)=>a+r.qDone,0)),
  qtePerfect:rows.reduce((a,r)=>a+r.qPerf,0)/Math.max(1,rows.reduce((a,r)=>a+r.qDone,0)),
  qtePerThrow:rows.reduce((a,r)=>a+r.qDone,0)/rows.reduce((a,r)=>a+r.throws,0),
  bestUnfinished:q(rows.filter(r=>!r.done).map(r=>r.best),.5)};
}

async function main(){
 const perCombo=Number(process.argv[2]??250),perScenario=Number(process.argv[3]??1000);
 const t0=performance.now(),tasks=[];
 const scen=(scenario,opt={},prices=null,count=perScenario)=>{for(const skill of Object.keys(SKILLS))for(let i=0;i<count;i+=50)tasks.push({scenario,skill,from:i,to:Math.min(count,i+50),opt,prices});};
 for(const skill of Object.keys(SKILLS))for(const combo of COMBOS)for(let i=0;i<perCombo;i+=50)tasks.push({scenario:'základ',skill,combo,from:i,to:Math.min(perCombo,i+50)});
 const P=m=>BASE_PRICES.map(x=>Math.round(x*m/5)*5);
 scen('mix ×1',{});
 scen('ceny ×2',{},P(2));
 scen('ceny ×3',{},P(3));
 scen('odměna ÷2',{rewardMul:.5});
 scen('ceny ×2, odměna ÷2',{rewardMul:.5},P(2));
 scen('ceny ×4',{},P(4));
 for(const [name,prices,opt] of RECOMMEND)scen(name,opt,prices);
 scen('mix ×1 + spodní mez síly 0,8',{launchFloor:.8});
 scen('mix ×1, bez QTE',{noQte:true});
 scen('ceny ×5, bez QTE',{noQte:true},[50,150,275,425,600]);
 // rozdělení úloh do workerů (prokládaně kvůli vyvážení)
 const W=Math.max(1,availableParallelism()-1),chunks=Array.from({length:W},()=>[]);
 tasks.forEach((t,i)=>chunks[i%W].push(t));
 const results=(await Promise.all(chunks.map(c=>new Promise((res,rej)=>{const w=new Worker(fileURLToPath(import.meta.url),{workerData:c});w.on('message',res);w.on('error',rej);})))).flat();
 const seconds=(performance.now()-t0)/1000;
 const by=(rows,f)=>{const m=new Map();for(const r of rows){const k=f(r);if(!m.has(k))m.set(k,[]);m.get(k).push(r);}return m;};
 const base=results.filter(r=>r.scenario==='základ');
 const out={version:VERSION,generated:new Date().toISOString(),seconds,campaigns:results.length,cap:CAP,uiSeconds:UI_SECONDS,skills:SKILLS,basePrices:BASE_PRICES,recommend:RECOMMEND,
  bySkill:{},byFactor:{},byCombo:{},scenarios:{},branches:branchTable()};
 for(const [s,rows] of by(base,r=>r.skill))out.bySkill[s]=stats(rows);
 for(const fac of ['buy','angle','model'])for(const [k,rows] of by(base,r=>r.skill+'|'+r[fac]))out.byFactor[fac+'|'+k]=stats(rows);
 for(const [k,rows] of by(base,r=>[r.skill,r.buy,r.angle,r.model].join('|')))out.byCombo[k]={...stats(rows),n:rows.length};
 for(const [k,rows] of by(results.filter(r=>r.scenario!=='základ'),r=>r.scenario+'|'+r.skill))out.scenarios[k]=stats(rows);
 await writeFile(new URL('./monte-carlo.json',import.meta.url),JSON.stringify(out,null,1));
 console.log(markdown(out));
 console.log(`\nKampaní: ${results.length}, workerů: ${W}, čas: ${seconds.toFixed(1)} s`);
}

// Kandidáti doporučení: [název, ceny, volby]
export const RECOMMEND=[
 ['ceny ×5 = 50/150/275/425/600',[50,150,275,425,600],{}],
 ['ceny ×6',[60,180,330,510,720],{}],
 ['návrh A: 40/120/240/400/600',[40,120,240,400,600],{}],
 ['návrh B: 30/120/260/420/600',[30,120,260,420,600],{}],
 ['ceny ×5 + spodní mez síly 0,8',[50,150,275,425,600],{launchFloor:.8}],
 ['ceny ×5, odměna ÷2',[50,150,275,425,600],{rewardMul:.5}],
];

// Marginální vliv větví: dolet průměrného hráče (síla 0,7, úhel 20°, bez QTE) při zvednutí jedné větve.
function branchTable(){
 const rows=[];
 for(const model of ['dart','glider'])for(const b of BR){
  const vals=[];for(let L=0;L<=5;L++){const lv={power:0,paper:0,fold:0,[b]:L};let s=0;for(let seed=2;seed<42;seed++){const f=createFlight(model,lv,seed,{x:0,y:0},throwSettings(20,.7));while(!f.landed)step(f);s+=f.x;}vals.push(s/40);}
  rows.push({model,branch:b,dist:vals});
 }
 const all=[];for(const model of ['dart','glider']){const vals=[];for(let L=0;L<=5;L++){let s=0;for(let seed=2;seed<42;seed++){const f=createFlight(model,{power:L,paper:L,fold:L},seed,{x:0,y:0},throwSettings(20,.7));while(!f.landed)step(f);s+=f.x;}vals.push(s/40);}all.push({model,branch:'vše',dist:vals});}
 return [...rows,...all];
}

function markdown(o){
 const L=[],sk=Object.keys(SKILLS);
 const row=(name,s)=>`| ${name} | ${pct(s.softlock)} | ${f0(s.throws100.p50)} (${f0(s.throws100.p10)}–${f0(s.throws100.p90)}) | ${f1(s.min100.p50)} (${f1(s.min100.p10)}–${f1(s.min100.p90)}) | ${f0(s.throws500.p50)} (${f0(s.throws500.p10)}–${f0(s.throws500.p90)}) | ${f1(s.min500.p50)} (${f1(s.min500.p10)}–${f1(s.min500.p90)}) |`;
 const head='| | Softlock | Hody do 100 m: medián (P10–P90) | Minuty do 100 m | Hody do 500 m | Minuty do 500 m |\n|---|---:|---:|---:|---:|---:|';
 L.push('### Profily (základní ceny, všech 24 strategií)',head,...sk.map(s=>row(s,o.bySkill[s])));
 L.push('','### Ekonomika a QTE podle profilu','| Profil | Mince na konci | Vyděláno | Nákupů | 1. nákup po hodu | Šipka síla/papír/přehyby | Kluzák síla/papír/přehyby | QTE úspěch | QTE perfekt | QTE na hod | Nejlepší dolet nedohraných |','|---|---:|---:|---:|---:|---|---|---:|---:|---:|---:|');
 for(const s of sk){const x=o.bySkill[s],lv=m=>BR.map(b=>f1(x.levels[m][b])).join(' / ');L.push(`| ${s} | ${f0(x.coinsEnd)} | ${f0(x.earned)} | ${f1(x.buys)} | ${f0(x.firstBuy)} | ${lv('dart')} | ${lv('glider')} | ${pct(x.qteHit)} | ${pct(x.qtePerfect)} | ${f1(x.qtePerThrow)} | ${f0(x.bestUnfinished)} |`);}
 for(const [fac,vals,title] of [['buy',BUYS,'Strategie nákupu'],['angle',ANGLES,'Strategie úhlu'],['model',MODELS,'Model']]){
  L.push('',`### ${title}: medián hodů do 500 m (softlock)`,`| ${title} | ${sk.join(' | ')} |`,`|---|${sk.map(()=>'---:').join('|')}|`);
  for(const v of vals)L.push(`| ${v} | ${sk.map(s=>{const x=o.byFactor[`${fac}|${s}|${v}`];return `${f0(x.throws500.p50)} (${pct(x.softlock)})`;}).join(' | ')} |`);
 }
 const names=[...new Set(Object.keys(o.scenarios).map(k=>k.split('|')[0]))];
 L.push('','### Citlivost a návrhy (náhodný mix strategií, stejní hráči napříč scénáři)','| Scénář | '+sk.map(s=>`${s}: hody P50 (P10–P90) / min P50 / softlock`).join(' | ')+' |','|---|'+sk.map(()=>'---').join('|')+'|');
 for(const n of names)L.push(`| ${n} | ${sk.map(s=>{const x=o.scenarios[`${n}|${s}`];return `${f0(x.throws500.p50)} (${f0(x.throws500.p10)}–${f0(x.throws500.p90)}) / ${f1(x.min500.p50)} / ${pct(x.softlock)}`;}).join(' | ')} |`);
 L.push('','### Marginální vliv větví (síla 0,7, úhel 20°, bez QTE, průměr 40 seedů), dolet v m na úrovni 0–5','| Model | Větev | 0 | 1 | 2 | 3 | 4 | 5 |','|---|---|---:|---:|---:|---:|---:|---:|');
 for(const b of o.branches)L.push(`| ${b.model==='dart'?'šipka':'kluzák'} | ${b.branch} | ${b.dist.map(f0).join(' | ')} |`);
 return L.join('\n');
}

if(isMainThread&&process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
