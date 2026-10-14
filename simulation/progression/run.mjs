// CLI simulátoru progrese. Zapisuje jen do simulation/progression/out/.
// node simulation/progression/run.mjs [--profiles weak,average,good,expert] [--strategies balanced,paper-first] [--pockets auto,dive+sharp]
//   [--models better|preview|dart|<id>] [--modelset obsah01] [--n 20] [--seed 1] [--params over.json] [--set warp.factor=1] [--sensitivity] [--no-probes] [--probe-n 60] [--out smoke] [--workers 8]
//   [--mailbag] [--targets t90] [--tricks] [--intents all|pigeonExpress,overTheLine,…]
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {availableParallelism} from 'node:os';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {P,setParams,merge,parseSet,PROFILE_SETS,MODEL_SETS,TARGET_SETS} from './params.mjs';
import {campaign} from './campaign.mjs';
import {TRICKS,trickById,intentTricks} from './tricks.mjs';
import {bestAngle,lv,createEvents,derive} from './model.mjs';
import {throwOnce,INTENT_BOTS} from './abilities.mjs';

if(!isMainThread){setParams(workerData.over);parentPort.postMessage(workerData.tasks.map(campaign));}

const q=(v,p)=>{if(!v.length)return null;const s=[...v].sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.floor(p*s.length))];};
const med=v=>q(v,.5),mean=v=>v.length?v.reduce((a,b)=>a+b,0)/v.length:null;
const r0=v=>v==null?'–':Math.round(v),r1=v=>v==null?'–':v.toFixed(1),pc=v=>v==null?'–':(v*100).toFixed(0)+' %',pc1=v=>v==null?'–':(v*100).toFixed(1)+' %';
const inR=(v,[a,b])=>v!=null&&v>=a-1e-9&&v<=b+1e-9;

export async function runCampaigns(specs,over={},workers=Math.max(1,availableParallelism()-1)){
 if(workers<=1||specs.length<4){setParams(over);return specs.map(campaign);}
 const k=Math.min(workers,specs.length),chunks=Array.from({length:k},()=>[]);specs.forEach((s,i)=>chunks[i%k].push(s));
 const parts=await Promise.all(chunks.map(c=>new Promise((res,rej)=>{const w=new Worker(fileURLToPath(import.meta.url),{workerData:{tasks:c,over}});w.on('message',res);w.on('error',rej);})));
 return parts.flat();
}
// Ekonomika skupiny: průměr ◈ na kampaň (příjem podle čtvrti rekordu před hodem, útrata podle čtvrti při nákupu), útrata po druzích,
// medián zůstatku. Modely: podíl hodů, ◈ a metry na hod, ◈ za skutečnou minutu (let + UI), podíl kampaní s koupí a medián hodu koupě.
export function economy(rs){
 const D=[0,1,2,3],kinds=[...new Set(rs.flatMap(r=>Object.keys(r.econ?.kind??{})))],ms=[...new Set(rs.flatMap(r=>Object.keys(r.byModel??{})))];
 const all=rs.reduce((a,r)=>a+r.throws,0),sum=(m,k)=>rs.reduce((a,r)=>a+(r.byModel?.[m]?.[k]??0),0);
 return {income:D.map(d=>mean(rs.map(r=>r.econ?.income[d]??0))),spend:D.map(d=>mean(rs.map(r=>r.econ?.spend[d]??0))),
  kind:Object.fromEntries(kinds.map(k=>[k,mean(rs.map(r=>r.econ?.kind[k]??0))])),left:med(rs.map(r=>r.coins??0)),
  models:Object.fromEntries(ms.map(m=>{const t=sum(m,'throws'),buys=rs.map(r=>(r.buys??[]).find(b=>b.id==='model:'+m)).filter(Boolean);
   return [m,{share:all?t/all:null,coins:t?sum(m,'coins')/t:null,x:t?sum(m,'x')/t:null,coinsPerMin:t?sum(m,'coins')/(sum(m,'real')/60):null,
    bought:buys.length/rs.length,buyThrow:med(buys.map(b=>b.throw))}];}))};
}
// Souhrn skupiny kampaní (metriky 08 §10.2).
export function summarize(rs){
 const done=rs.filter(r=>r.done),dist=[0,1,2,3].map(d=>rs.map(r=>r.districts[d]?{throws:r.districts[d].throws-(d?r.districts[d-1].throws:0),minutes:r.districts[d].minutes-(d?r.districts[d-1].minutes:0)}:null).filter(Boolean));
 const fl=rs.flatMap(r=>r.flights),byD=[0,1,2,3].map(d=>fl.filter(f=>f[0]===d).map(f=>f[1]));
 const flights=fl.length;
 return {n:rs.length,doneRate:done.length/rs.length,throws:med(rs.map(r=>r.throws)),throwsP90:q(rs.map(r=>r.throws),.9),throwsMax:Math.max(...rs.map(r=>r.throws)),minutes:med(rs.map(r=>r.minutes)),
  district:dist.map(v=>({throws:med(v.map(x=>x.throws)),minutes:med(v.map(x=>x.minutes))})),
  flight:byD.map(v=>({median:med(v),p90:q(v,.9),max:v.length?Math.max(...v):null})),flightP90:q(fl.map(f=>f[1]),.9),flightMax:Math.max(...fl.map(f=>f[1])),simMax:Math.max(...fl.map(f=>f[2])),
  droughtMedian:med(rs.flatMap(r=>r.droughts)),droughtMax:Math.max(0,...rs.flatMap(r=>r.droughts)),droughtMaxMedian:med(rs.map(r=>Math.max(0,...r.droughts))),droughtMaxP90:q(rs.map(r=>Math.max(0,...r.droughts)),.9),
  placeGapMedian:med(rs.flatMap(r=>r.placeGaps)),placeGapP90:q(rs.flatMap(r=>r.placeGaps),.9),
  firstPocket:med(rs.map(r=>r.firstPocket).filter(x=>x!=null)),levelsBought:med(rs.map(r=>r.levelsBought)),gliderShare:med(rs.map(r=>r.gliderThrows/r.throws)),
  eCap:rs.reduce((a,r)=>a+r.eCap,0)/flights,betaCap:rs.reduce((a,r)=>a+r.betaCap,0)/flights,
  // Paper Crane v kampani (rozhodnutí 14. 10.): podíl letů s tahem a podíl tahů, které přenesly rekord na dosud neobjevené místo
  craneTugRate:rs.reduce((a,r)=>a+(r.crane?.tugs??0),0)/flights,craneNewPlace:(()=>{const t=rs.reduce((a,r)=>a+(r.crane?.tugs??0),0);return t?rs.reduce((a,r)=>a+r.crane.newPlace,0)/t:null;})(),
  qteHit:rs.reduce((a,r)=>a+r.qte.hits,0)/Math.max(1,rs.reduce((a,r)=>a+r.qte.done,0)),
  diveCrash:(()=>{const u=rs.reduce((a,r)=>a+r.dive.uses,0);return u?rs.reduce((a,r)=>a+r.dive.crash,0)/u:null;})(),econ:economy(rs),
  ...pace90(rs),...(rs.some(r=>r.mailbag?.length||r.strategy?.includes('mailbag'))?{mailbag:mailbagSummary(rs)}:{}),...(rs.some(r=>r.tricks)?{tricks:trickSummary(rs)}:{}),
  // vítr náhledu 'both' (01 §2.10 bod 7): podíl hodů s modelem jen na jeden hod (Sail / Needle podle větru příštího hodu)
  ...(rs.some(r=>r.windSwitch!=null)?{windSwitch:rs.reduce((a,r)=>a+(r.windSwitch??0),0)/Math.max(1,rs.reduce((a,r)=>a+r.throws,0))}:{})};
}
// Metriky pásem 90 min (05 §7.2), které simulátor umí: sucho bez novinky A, P90 sucha, opakování poryvu + holuba po čtvrtích (podíl mezi
// vyhodnocenými QTE podle čtvrti rekordu před hodem), hody mezi nákupy (rozdíl hodů s nákupem, čtvrť pozdějšího nákupu).
function pace90(rs){
 const gaps=[[],[],[],[]];for(const r of rs){const bt=[...new Map((r.buys??[]).map(b=>[b.throw,b.d??0])).entries()];for(let i=1;i<bt.length;i++)gaps[bt[i][1]].push(bt[i][0]-bt[i-1][0]);}
 return {droughtA:{median:med(rs.flatMap(r=>r.droughtsA??[])),p90:q(rs.flatMap(r=>r.droughtsA??[]),.9),maxP90:q(rs.map(r=>Math.max(0,...(r.droughtsA??[]))),.9)},
  droughtP90:q(rs.flatMap(r=>r.droughts),.9),
  repeat:[0,1,2,3].map(d=>{const a=rs.reduce((s,r)=>s+(r.repeat?.[d][0]??0),0),b=rs.reduce((s,r)=>s+(r.repeat?.[d][1]??0),0);return b?a/b:null;}),
  buyGap:{median:gaps.map(med),p90:q(gaps.flat(),.9)}};
}
// Mailbag (01 §2.11): ◈ z Mailbagu na kampaň, příjem / příjem bez bonusu (v téže kampani), hody na další koupi po čtvrtích (cena / ◈ za
// poslední hod, medián), po úrovních podíl kampaní s koupí, medián hodu koupě, odhad návratnosti při koupi (cena / ◈ navíc za hod),
// podíl vrácených do finále a medián podílu zbývajících hodů do návratnosti (nevrácená = ∞).
export function mailbagSummary(rs){
 const inc=r=>r.econ.income.reduce((a,b)=>a+b,0),mb=r=>(r.econ.mailbag??[]).reduce((a,b)=>a+b,0),toGo=[[],[],[],[]];
 for(const r of rs)for(const b of r.buys??[])if(b.perThrow)toGo[b.d??0].push(b.price/b.perThrow);
 const L=P.economy.mailbag.levels.map((_,k)=>{const es=rs.map(r=>({r,e:(r.mailbag??[]).find(e=>e.level===k+1)})).filter(x=>x.e);
  return {bought:es.length/rs.length,buyThrow:med(es.map(x=>x.e.throw)),payEst:med(es.filter(x=>x.e.perThrow>0).map(x=>x.e.price/x.e.perThrow)),
   paid:es.length?es.filter(x=>x.e.payThrow!=null).length/es.length:null,
   payFrac:med(es.map(x=>x.e.payThrow!=null?(x.e.payThrow-x.e.throw)/Math.max(1,x.r.throws-x.e.throw):Infinity))};});
 return {coins:mean(rs.map(mb)),incomeRatio:mean(rs.map(r=>inc(r)/Math.max(1,inc(r)-mb(r)))),income:mean(rs.map(inc)),toGo:toGo.map(med),levels:L};
}
// Kousky (05 §4.6) skupiny: pro každý kousek lety s přísadami, výskyt (podíl letů s přísadami), kampaně s přísadami, 1. provedení
// (hody od prvního letu s přísadami, medián z kampaní s provedením), podíl kampaní bez provedení, lety s přísadami do 1. provedení
// (medián a P90, nikdy = ∞, pro kousky modelů), diagnostika intervalu dvojic. Systém: 1. kousek mimo modely (medián, nikdy = ∞),
// nalezeno z 13 (medián kampaní), korelace výskytu (φ v letech, kde mají přísady oba). v2: share = podíl všech letů s přísadami (strop Drone
// Ping-Pong = lety s Gates úr. 3), cap = podíl letů s přísadami, kde nastala událost-strop (hvězda, dvojice), byD = výskyt po čtvrtích rekordu
// před hodem (null pod districtMin letů), corr = všechny dvojice (sestupně).
export function trickSummary(rs){
 const T=rs.filter(r=>r.tricks),fl=T.flatMap(r=>r.tricks.flights),bit=(m,i)=>m>>i&1,dMin=P.targets.tricks?.districtMin??30;
 const per=TRICKS.map((t,i)=>{const ing=fl.filter(f=>bit(f[0],i)),fs=T.map(r=>r.tricks.first[t.id]).filter(Boolean),hit=fs.filter(x=>x.hit!=null);
  const dg=T.flatMap(r=>r.tricks.diag[t.id]??[]),byD=[0,1,2,3].map(d=>{const v=ing.filter(f=>f[3]===d);return v.length>=dMin?v.filter(f=>bit(f[1],i)).length/v.length:null;});
  return [t.id,{flights:ing.length,rate:ing.length?ing.filter(f=>bit(f[1],i)).length/ing.length:null,campaigns:fs.length,share:fl.length?ing.length/fl.length:null,
   ...(t.cap&&ing.length?{cap:ing.filter(f=>bit(f[4]??0,i)).length/ing.length}:{}),byD,dMax:byD.some(v=>v!=null)?Math.max(...byD.filter(v=>v!=null)):null,
   first:med(hit.map(x=>x.hit-x.ing+1)),never:fs.length?1-hit.length/fs.length:null,
   firstIng:med(fs.map(x=>x.hitN??Infinity)),firstIngP90:q(fs.map(x=>x.hitN??Infinity),.9),...(dg.length?{gapMin:Math.min(...dg),gapMed:med(dg)}:{})}];});
 const reg=TRICKS.map((t,i)=>[t,i]).filter(([t])=>!t.model);
 const firstAny=T.map(r=>Math.min(Infinity,...reg.map(([t])=>r.tricks.first[t.id]?.hit??Infinity)));
 const found=T.map(r=>TRICKS.filter(t=>r.tricks.first[t.id]?.hit!=null).length/TRICKS.length);
 const corr=[];for(let a=0;a<TRICKS.length;a++)for(let b=a+1;b<TRICKS.length;b++){const both=fl.filter(f=>bit(f[0],a)&&bit(f[0],b));if(both.length<20)continue;
  const n=both.length,pa=both.filter(f=>bit(f[1],a)).length/n,pb=both.filter(f=>bit(f[1],b)).length/n,pab=both.filter(f=>bit(f[1],a)&&bit(f[1],b)).length/n,den=Math.sqrt(pa*(1-pa)*pb*(1-pb));
  if(den>0)corr.push({a:TRICKS[a].id,b:TRICKS[b].id,phi:(pab-pa*pb)/den,n});}
 return {per:Object.fromEntries(per),firstTrick:med(firstAny),found:med(found),foundMin:Math.min(...found),corrMax:corr.reduce((m,c)=>!m||c.phi>m.phi?c:m,null),corrHigh:corr.filter(c=>c.phi>(P.targets.tricks?.corr??.8)),
  corr:[...corr].sort((x,y)=>y.phi-x.phi)};
}

// Křivka 08 §2.4: pevné výbavy, úhel = nejlepší pasivní + chyba profilu, n letů na buňku (hod č. 20: plující střed i švih zapnuté).
const allAtlas=lvl=>Object.fromEntries(P.atlas.bonuses.filter(b=>!P.atlas.unlevelled.includes(b)).map(b=>[b,lvl]));
export function kitFrom(c){const a=c.atlas['*']!=null?{...allAtlas(c.atlas['*']),...c.atlas}:{...c.atlas};delete a['*'];for(const k of Object.keys(a))if(!a[k])delete a[k];return {model:c.model??'dart',power:c.power,folds:c.folds,paper:c.paper,atlas:a,slots:c.slots??[]};}
export function sampleKit(kit,profile,n=60,extra={}){
 const a=bestAngle(kit,Math.round(P.profiles[profile].mu*20)/20),xs=[],ts=[],rs=[],out={crash:0,uses:0,skip:0,tug:0,eCap:0,star:0};
 for(let i=0;i<n;i++){const f=throwOnce(kit,{key:'probe|'+i,n:20,profile,angle:a,...extra});xs.push(f.x);ts.push(f.t);rs.push(f.real);out.uses+=f.stats.dive.uses;out.crash+=f.stats.dive.crash;
  out.skip+=f.stats.skips>0;out.tug+=f.stats.tug>0;out.eCap+=f.stats.eCap;out.star+=f.stats.star.seen>0;}
 for(const k of ['skip','tug','eCap','star'])out[k]/=n;
 return {x:mean(xs),xMed:med(xs),t:med(ts),real:med(rs),realMax:Math.max(...rs),speed:mean(xs)/mean(ts),...out};
}
export function curve(profiles,n){return P.curve.map(c=>{const kit=kitFrom(c);return {name:c.name,pi:1+P.workshop.paper.steps.slice(0,c.paper).reduce((a,b)=>a+b,0),cells:Object.fromEntries(profiles.map(p=>[p,sampleKit(kit,p,n)]))};});}
// Atlas na úr. 3: plná výbava s bonusem proti plné výbavě bez něj (průměrný hráč).
export function atlasProbe(n,profile='average'){const full=kitFrom({power:3,folds:3,paper:12,atlas:{'*':3}}),b0=sampleKit(full,profile,n),base=b0.x;
 return Object.keys(full.atlas).map(b=>{const k={...full,atlas:{...full.atlas}};delete k.atlas[b];const x=sampleKit(k,profile,n).x;
  return {bonus:b,gain:base/x-1,...(b==='skip'?{rate:b0.skip}:b==='paperCrane'?{rate:b0.tug}:b==='star'?{rate:b0.star}:{})};});}
// Shooting Star (rozhodnutí 14. 10.): zisk doletu jen v letech, kde hvězda v rozvrhu přišla. Stejný hod s hvězdou úr. lvl a bez ní
// (los hvězdy v createEvents nemění zbytek rozvrhu). Prochází klíče, dokud nenajde n letů s hvězdou (nejvýš scan·n klíčů).
export function starProbe(n,profile='average',lvl=3,scan=40){
 const full=kitFrom({power:3,folds:3,paper:12,atlas:{'*':3}}),k1={...full,atlas:{...full.atlas,star:lvl}},k0={...full,atlas:{...full.atlas}};delete k0.atlas.star;
 const a=bestAngle(k1,Math.round(P.profiles[profile].mu*20)/20),d=derive(k1),x1=[],x0=[];let keys=0,seen=0;
 for(let i=0;x1.length<n&&i<scan*n;i++){keys++;const key='probe|'+i;if(!createEvents(k1,key,20,d).list.some(e=>e.type==='star'))continue;
  const ctx={key,n:20,profile,angle:a},f=throwOnce(k1,ctx);x1.push(f.x);x0.push(throwOnce(k0,ctx).x);seen+=f.stats.star.seen>0;}
 return {bonus:'star',level:lvl,flights:x1.length,keys,scheduled:x1.length/keys,seen:x1.length?seen/x1.length:null,x:mean(x1),x0:mean(x0),gain:x1.length?mean(x1)/mean(x0)-1:null};
}
// Schopnosti a pasivní speciály na výbavě „konec D3“, včetně vysokého vybrání Dive (bot pustí ve 12 m).
export function abilityProbe(profiles,n){const c=P.curve.find(c=>c.name==='konec D3')??P.curve.at(-1),kit=kitFrom(c);
 return profiles.map(p=>{const base=sampleKit(kit,p,n),row={profile:p,base:base.x,baseReal:base.real};
  for(const s of ['cushion','sharp','calm','dive','whistle','rocket']){const r=sampleKit({...kit,slots:[s]},p,n);row[s]={gain:r.x/base.x-1,real:r.real,crash:r.uses?r.crash/r.uses:null};}
  const hi=sampleKit({...kit,slots:['dive']},p,n,{bot:{dive:{target:12}}});row.diveHigh={gain:hi.x/base.x-1,crash:hi.uses?hi.crash/hi.uses:null};return row;});}

// Srovnání s cíli 08 §10.2.
export function checks(G,probes){
 const T=P.targets,ref=T.reference??'balanced',out=[],add=(name,value,ok,goal)=>out.push({name,value,goal,ok:ok==null||ok==='na'?ok??null:!!ok});
 // referenční volba modelu: targets.model (t90: preview), když ji běh má, jinak better
 const mk=T.model&&Object.keys(G).some(x=>x.endsWith('|'+T.model))?T.model:'better';
 const g=(p,s=ref,k='auto')=>G[`${p}|${s}|${k}|${mk}`];
 const A=g('average'),W=g('weak'),X=g('expert');
 if(A){
  A.district.forEach((d,i)=>add(`Hody D${i+1} (průměrný)`,r0(d.throws),inR(d.throws,T.throwsPerDistrict[i]),T.throwsPerDistrict[i].join('–')));
  A.district.forEach((d,i)=>add(`Minuty D${i+1} (průměrný)`,r1(d.minutes),inR(d.minutes,T.minutesPerDistrict[i]),T.minutesPerDistrict[i].join('–')));
  add('Minuty celkem (průměrný)',r1(A.minutes),inR(A.minutes,T.totalMinutes),T.totalMinutes.join('–'));
  A.flight.forEach((f,i)=>add(`Let medián D${i+1} [s]`,r1(f.median),f.median!=null&&f.median<=T.flightMedian[i],'≤ '+T.flightMedian[i]));
  add('Let P90 [s]',r1(A.flightP90),A.flightP90<=T.flightP90,'≤ '+T.flightP90);
  // sucho (rozhodnutí 14. 10.): maximum se hodnotí podle droughtStat: 'p90' = P90 maxim jednotlivých kampaní, 'max' = absolutní maximum
  const dS=T.droughtStat??'max',dM=dS==='p90'?A.droughtMaxP90:A.droughtMax;
  add(`Sucho medián / ${dS==='p90'?'P90 max kampaní':'max'}`,`${r0(A.droughtMedian)} / ${r0(dM)} (max ${A.droughtMax}, P90 ${r0(A.droughtMaxP90)})`,A.droughtMedian<=T.droughtMedian&&dM<=T.droughtMax,`≤ ${T.droughtMedian} / ≤ ${T.droughtMax}`);
  add('Mezi místy medián / P90',`${r0(A.placeGapMedian)} / ${r0(A.placeGapP90)}`,A.placeGapMedian<=T.placeGapMedian&&A.placeGapP90<=T.placeGapP90,`≤ ${T.placeGapMedian} / ≤ ${T.placeGapP90}`);
  add('Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info)',`${pc1(A.craneTugRate)} / ${pc(A.craneNewPlace)}`,null,'–');
  add('Strop E zasažen (lety)',pc(A.eCap),A.eCap<=T.capE,'≤ '+pc(T.capE));
  add('Strop β zasažen (lety)',pc(A.betaCap),A.betaCap<=T.capBeta,'≤ '+pc(T.capBeta));
  add('Podíl kluzáku',pc(A.gliderShare),inR(A.gliderShare,T.gliderShare),T.gliderShare.map(pc).join('–'));
  add('První kapsa (hod)',r0(A.firstPocket),inR(A.firstPocket,T.firstPocket),T.firstPocket.join('–'));
  add('Koupené úrovně v cíli',pc(A.levelsBought),inR(A.levelsBought,T.levelsBought),T.levelsBought.map(pc).join('–'));
  // pásma 90 min (05 §7.2), jen když je sada cílů má (--targets t90)
  if(T.totalThrows)add('Hody celkem (průměrný)',r0(A.throws),inR(A.throws,T.totalThrows),T.totalThrows.join('–'));
  if(T.droughtA){const a=A.droughtA,t=T.droughtA;add('Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant)',`${r0(a.median)} / ${r0(a.p90)} / ${r0(a.maxP90)}`,
   a.median<=t.median&&a.p90<=t.p90&&a.maxP90<=t.maxP90,`≤ ${t.median} / ≤ ${t.p90} / ≤ ${t.maxP90}`);}
  if(T.droughtP90!=null)add('Sucho bez nákupu ani novinky P90',r0(A.droughtP90),A.droughtP90<=T.droughtP90,'≤ '+T.droughtP90);
  if(T.repeat)A.repeat.forEach((v,i)=>add(`Poryv + holub mezi QTE D${i+1} (bez variant)`,pc(v),v!=null&&v<=T.repeat[i]+1e-9,'≤ '+pc(T.repeat[i])));
  if(T.buyGap)add('Hody mezi nákupy medián D1–D4 / P90',`${A.buyGap.median.map(r0).join(' / ')} / ${r0(A.buyGap.p90)}`,
   A.buyGap.median.every((v,i)=>v!=null&&v<=T.buyGap.median[i])&&A.buyGap.p90<=T.buyGap.p90,`≤ ${T.buyGap.median.join(' / ')} / ≤ ${T.buyGap.p90}`);
  if(T.notAssessed){for(const m of ['Mezi zastávkami (zastávky v simulátoru nejsou)','Fronta novinek (není v simulátoru)','Varianty událostí: přínos a první setkání (nejsou v simulátoru)',
   'Délka letu: varianty, vír a lampiony (nejsou v simulátoru)'])add(m,'–','na','05 §7.2');
   if(!A.tricks)add('Kousky (05 §4.6, běh bez --tricks)','–','na','brána 6 z 8');}
 }
 const all=Object.values(G);if(all.length)add('Žádný let > 60 s (skutečný)',r1(Math.max(...all.map(x=>x.flightMax))),Math.max(...all.map(x=>x.flightMax))<=T.flightMax,'≤ '+T.flightMax);
 if(W)add(`Slabý: cíl do ${T.weakFinishWithin} hodů`,pc(W.doneRate)+` (max ${W.throwsMax})`,W.doneRate===1&&W.throwsMax<=T.weakFinishWithin,'100 %');
 if(W&&A&&T.weakVsAverageStat==='minutes')add('Slabý / průměrný (minuty)',(W.minutes/A.minutes).toFixed(2),W.minutes/A.minutes<=T.weakVsAverage,'≤ '+T.weakVsAverage);
 else if(W&&A)add('Slabý / průměrný (hody)',(W.throws/A.throws).toFixed(2),W.throws/A.throws<=T.weakVsAverage,'≤ '+T.weakVsAverage);
 if(X&&A)add('Expert / průměrný (hody)',(X.throws/A.throws).toFixed(2),X.throws/A.throws>=T.expertVsAverage,'≥ '+T.expertVsAverage);
 if(X&&W)add('Expert / slabý (hody)',(X.throws/W.throws).toFixed(2),inR(X.throws/W.throws,T.expertVsWeak),T.expertVsWeak.join('–'));
 const bestSomewhere=new Set(),pkSeen=new Set();
 for(const p of Object.keys(P.profiles)){const b=g(p),pf=g(p,'paper-first'),af=g(p,'atlas-first'),bal=g(p,'balanced');
  if(b&&pf)add(`Paper napřed rychlejší o (${p})`,pc((b.minutes-pf.minutes)/b.minutes),(b.minutes-pf.minutes)/b.minutes<=T.paperFirst,'≤ '+pc(T.paperFirst));
  if(b&&af)add(`Atlas napřed pomalejší o (${p})`,pc((af.minutes-b.minutes)/b.minutes),(af.minutes-b.minutes)/b.minutes<=T.atlasFirst,'≤ '+pc(T.atlasFirst));
  if(b&&bal&&ref!=='balanced')add(`Optimální nákup rychlejší o (${p}, info)`,pc((b.minutes-bal.minutes)/b.minutes),null,'–');
  const pk=Object.entries(G).filter(([k])=>k.startsWith(p+'|'+ref+'|')&&!k.includes('|auto|')&&!k.includes('|none|')&&!k.includes('|i:')).map(([k,v])=>({k:k.split('|')[2],m:v.minutes})).sort((a,b)=>a.m-b.m);
  if(pk.length>=2){add(`Kapsy ${p}: nejlepší ${pk[0].k} vs. ${pk[1].k}`,pc(pk[1].m/pk[0].m-1),pk[1].m/pk[0].m-1<=T.pocketSpread,'≤ '+pc(T.pocketSpread));bestSomewhere.add(pk[0].k);pk.forEach(x=>pkSeen.add(x.k));}
 }
 if(pkSeen.size)add('Kapsy: nejlepší aspoň v jednom profilu',[...bestSomewhere].join(', ')+' (nikde: '+([...pkSeen].filter(x=>!bestSomewhere.has(x)).join(', ')||'–')+')',bestSomewhere.size===pkSeen.size,'všechny');
 if(probes?.abilities)for(const r of probes.abilities){
  if(r.profile in T.diveCrash)add(`Dive pády (${r.profile})`,pc(r.dive.crash),r.dive.crash<=T.diveCrash[r.profile],'≤ '+pc(T.diveCrash[r.profile]));
  if(r.profile==='average')add('Dive vysoké vybrání (průměrný)',pc1(r.diveHigh.gain),Math.abs(r.diveHigh.gain)<=T.diveHigh,'±'+pc(T.diveHigh));
 }
 // rozhodnutí 14. 10.: Paper Crane jen hlášení, Shooting Star ziskem v letu s hvězdou, Packing Tape u slabého; ostatní 3–15 % u průměrného
 const own={paperCrane:1,star:1,tape:1},starMin=T.starInFlight??.03,tapeW=T.tapeWeak??T.atlasBonus;
 if(probes?.atlas)for(const a of probes.atlas)add(`Atlas ${a.bonus} na úr. 3${own[a.bonus]?' (info)':''}`,pc1(a.gain)+(a.rate!=null?` (v ${pc(a.rate)} letů)`:''),own[a.bonus]?null:inR(a.gain,T.atlasBonus),own[a.bonus]?'–':T.atlasBonus.map(pc).join('–'));
 if(probes?.atlas){const c=probes.atlas.find(a=>a.bonus==='paperCrane');if(c?.rate!=null)add('Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info)',pc(c.rate),null,'–');}
 if(probes?.star?.gain!=null)add('Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná)',pc1(probes.star.gain)+` (${probes.star.flights} letů)`,probes.star.gain>=starMin-1e-9,'≥ '+pc(starMin));
 if(probes?.atlasWeak){const t=probes.atlasWeak.find(a=>a.bonus==='tape');if(t)add('Packing Tape úr. 3 (slabý, plná)',pc1(t.gain),inR(t.gain,tapeW),tapeW.map(pc).join('–'));}
 if(probes?.atlas){const s=probes.atlas.find(a=>a.bonus==='skip');if(s?.rate!=null)add('Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná)',pc(s.rate),inR(s.rate,T.skipRate),T.skipRate.map(pc).join('–'));}
 // Mailbag (01 §2.11, §6.1 B10 a B17): reference proti no-mailbag a mailbag-first, jen když je běh má
 const MBt=T.mailbag??{income:1.2,toGo:.85,first:.08,payback:.7};
 for(const p of Object.keys(P.profiles)){const a=g(p),nm=g(p,'no-mailbag'),mf=g(p,'mailbag-first');if(!a?.mailbag)continue;
  if(nm)add(`Mailbag: příjem kampaně / bez Mailbagu (${p}, proti no-mailbag)`,(a.mailbag.income/nm.econ.income.reduce((s,v)=>s+v,0)).toFixed(2),a.mailbag.income/nm.econ.income.reduce((s,v)=>s+v,0)<=MBt.income+1e-9,'≤ '+MBt.income);
  add(`Mailbag: příjem / příjem bez bonusu v téže kampani (${p})`,a.mailbag.incomeRatio.toFixed(2),a.mailbag.incomeRatio<=MBt.income+1e-9,'≤ '+MBt.income);
  if(nm?.mailbag){const r=a.mailbag.toGo.map((v,i)=>v!=null&&nm.mailbag.toGo[i]?v/nm.mailbag.toGo[i]:null);
   add(`Mailbag: hody na další koupi / bez Mailbagu D1–D4 (${p})`,r.map(v=>v==null?'–':v.toFixed(2)).join(' / '),r.every(v=>v==null||v>=MBt.toGo-1e-9),'≥ '+MBt.toGo);}
  if(mf)add(`Mailbag napřed rychlejší o (${p}, hody)`,pc((a.throws-mf.throws)/a.throws),(a.throws-mf.throws)/a.throws<=MBt.first+1e-9,'≤ '+pc(MBt.first));
  const l3=a.mailbag.levels.at(-1);if(l3?.bought)add(`Mailbag III: návratnost do finále, podíl zbývajících hodů (${p}, medián; vráceno)`,`${l3.payFrac===Infinity?'∞':pc(l3.payFrac)} (${pc(l3.paid)})`,l3.payFrac<=MBt.payback,'≤ '+pc(MBt.payback));}
 return out;
}

// Tabulka kousků s verdikty podle prahů 05 §4.6 (targets.tricks). Základ = skupiny bez záměru s detekcí, záměr = skupiny `…|i:<id>`.
// Hodnotí se průměrný (výskyt, výskyt po čtvrtích, záměr, 1. provedení) a poměr expert / slabý. Kousek bez letů s přísadami = NOT ASSESSED.
// Dva verdikty: verdictIntent = záměr u všech kousků (brána strict / lenient), verdictClass = podle třídy (05 §4.6, doplněno 14. 10.):
// volba záměrem, dovednost poměrem expert / slabý (skillEW / skillChance), pestrost jen četností. verdict = podle targets.tricks.gateBy.
export function trickTable(G){
 const TT=P.targets.tricks,ref=P.targets.reference??'balanced',keys=Object.keys(G).filter(k=>G[k].tricks&&!k.includes('|i:'));if(!keys.length)return null;
 const combo=(keys.find(k=>k.split('|')[1]===ref)??keys[0]).split('|').slice(1).join('|'),grp=(p,i)=>G[`${p}|${combo}${i?'|i:'+i:''}`];
 const band=(v,lo,hi,lab)=>v==null?'NOT ASSESSED':v<lo-1e-9?lab[0]:v>hi+1e-9?lab[2]:lab[1];
 const rows=TRICKS.map(t=>{
  // výskyt bez záměru: běžná skupina; když v ní kapsa ze záměru není (0 letů s přísadami), skupina „kapsa bez záměru“ (`|i:<id>|base`),
  // a když kousek nemá vlastního bota (Kettle Song), skupina se záměrem (jen kapsa)
  const pb=t.intent?.pocket?INTENT_BOTS[t.id]?t.id+'|base':t.id:null,base=p=>{const v=grp(p)?.tricks?.per[t.id];if(v?.flights||!pb)return [v,''];const u=grp(p,pb)?.tricks?.per[t.id];return u?.flights?[u,'kapsa']:[v,''];};
  const [a,af]=base('average'),[w]=base('weak'),[x]=base('expert'),ai=t.intent?grp('average',t.id)?.tricks?.per[t.id]:null;
  // kousky modelů: 1. provedení z lety s modelem; když ho základní bot (volba modelu) nevolí, ze skupiny se záměrem (model v ruce)
  const fm=t.model&&!a?.campaigns&&ai?.campaigns?ai:a;
  const r={id:t.id,name:t.name,model:!!t.model,note:t.note??'',rate:a?.flights?a.rate:null,flights:a?.flights??0,weak:w?.flights?w.rate:null,expert:x?.flights?x.rate:null,
   intent:ai?.flights?ai.rate:null,first:a?.first??null,never:a?.never??null,firstIng:fm?.firstIng??null,firstIngP90:fm?.firstIngP90??null,firstFrom:fm&&fm===ai?'záměr':'',
   gapMin:a?.gapMin??null,gapMed:a?.gapMed??null,gapIntent:ai?.gapMin??null,baseFrom:af,cls:t.cls??null,share:a?.share??null,cap:a?.cap??null,byD:a?.byD??null,dMax:a?.dMax??null};
  r.ratio=r.intent!=null&&r.rate?r.intent/r.rate:r.intent!=null&&r.intent>0?Infinity:null;r.ew=r.weak==null||r.expert==null?null:r.weak?r.expert/r.weak:r.expert>0?Infinity:null;
  r.vRate=r.rate==null?'NOT ASSESSED':r.rate<TT.rare?'vzácný':r.rate>TT.obvious?'samozřejmý':r.rate>=TT.healthy[0]-1e-9&&r.rate<=TT.healthy[1]+1e-9?'zdravý':'hraniční';
  r.vIntent=!t.intent?'NOT ASSESSED (bez páky)':r.intent==null?'NOT ASSESSED (neběželo)':r.intent<TT.intentMin?'vzácný':r.ratio<TT.chance?'náhoda':r.ratio>=TT.intentRatio?'zdravý':'hraniční';
  r.vFirst=t.model?(r.firstIng==null?'NOT ASSESSED':r.firstIng<=TT.model[0]&&r.firstIngP90<=TT.model[1]?'zdravý':'pomalý')
   :r.rate==null?'NOT ASSESSED':r.never>TT.never||r.first==null||r.first>TT.firstRare?'vzácný':r.first<=TT.firstObvious?'samozřejmý':band(r.first,TT.first[0],TT.first[1],['hraniční','zdravý','hraniční']);
  r.vEW=r.ew==null?'–':r.ew>TT.expertWeakRare?'jen perfektnost':r.ew<=TT.expertWeak?'zdravý':'hraniční';
  r.vDist=r.dMax==null?'–':r.dMax>TT.obvious+1e-9?'samozřejmý':'zdravý';
  r.vSkill=r.ew==null?'NOT ASSESSED':r.ew>=(TT.skillEW??1.3)-1e-9?'zdravý':r.ew<(TT.skillChance??1)-1e-9?'náhoda':'hraniční';
  const parts=[r.vRate,r.vFirst,r.vEW,r.vDist].filter(v=>v!=='–');
  // kousky modelů (= podpisové skiny) se hodnotí jen hody s modelem do 1. provedení (01 §6.1 bod 15), výskyt a záměr jsou informace
  if(t.model){r.verdict=r.verdictIntent=r.verdictClass=r.vFirst==='NOT ASSESSED'?'NOT ASSESSED':r.vFirst==='zdravý'?'HEALTHY':'CONCERNS';r.vClass='01 §6.1 b. 15';return r;}
  const verd=c=>r.vRate.startsWith('NOT')?'NOT ASSESSED':parts.some(v=>v==='vzácný'||v==='samozřejmý')?'CRITICAL':parts.some(v=>v!=='zdravý')||c==='vzácný'||c==='náhoda'||c==='hraniční'?'CONCERNS':c==='zdravý'?'HEALTHY':'HEALTHY (záměr NOT ASSESSED)';
  r.vClass=t.cls==='dovednost'?r.vSkill:t.cls==='pestrost'?'zdravý':r.vIntent;
  r.verdictIntent=verd(r.vIntent);r.verdictClass=verd(r.vClass);r.verdict=TT.gateBy==='class'?r.verdictClass:r.verdictIntent;
  return r;});
 const A=grp('average')?.tricks,Wk=grp('weak')?.tricks,reg=rows.filter(r=>!r.model);
 return {combo,rows,gate:{strict:reg.filter(r=>r.verdictIntent==='HEALTHY').length,lenient:reg.filter(r=>r.verdictIntent.startsWith('HEALTHY')).length,
   byClass:reg.filter(r=>r.verdictClass==='HEALTHY').length,by:TT.gateBy??'intent',of:reg.length,need:TT.gate,build:build(rows)},
  system:{firstTrick:A?.firstTrick??null,found:A?.found??null,foundWeak:Wk?.found??null,corrMax:A?.corrMax??null,corrHigh:A?.corrHigh??[],
   corrList:(A?.corr??[]).filter(c=>c.phi>(TT.corrList??.5))}};
}
// Verdikt „postavit“ (rozhodnutí uživatele 14. 10., konec 06): zdravé kousky mimo modely podle platné brány (verdict) + všechny kousky modelů;
// ≥ gate zdravých = systém, gateMin..gate−1 = jen zdravé + modely, méně = 05 §4.7 (jen kousky modelů = podpisové skiny).
function build(rows){const TT=P.targets.tricks,ok=rows.filter(r=>!r.model&&r.verdict==='HEALTHY').map(r=>r.id),models=rows.filter(r=>r.model).map(r=>r.id),k=ok.length;
 const mode=k>=TT.gate?'system':k>=(TT.gateMin??4)?'healthy+models':'4.7';return {mode,tricks:mode==='4.7'?[]:ok,models,healthy:ok};}
const BUILD={system:'systém kousků (brána prošla)','healthy+models':'jen zdravé kousky + kousky modelů','4.7':'05 §4.7, kousky mimo modely nestavět'};
const inf=v=>v==null?'–':v===Infinity?'∞':r0(v),ratio=v=>v==null?'–':v===Infinity?'∞':v.toFixed(2)+'×';

function markdown(rep){
 const L=[`# Simulátor progrese: ${rep.name}`,'',`Spuštěno ${rep.date}, ${rep.n} kampaní na skupinu, seed ${rep.seed}. Parametry přepsané: \`${JSON.stringify(rep.over)}\`.`,''];
 if(rep.curve){const ps=Object.keys(rep.curve[0].cells);L.push('## Křivka (08 §2.4)','',`| Výbava | π | ${ps.map(p=>p+' dolet').join(' | ')} | let ${ps[1]??ps[0]} sim / skut. [s] | prům. rychlost [m/s] |`,`|---|---:|${ps.map(()=>'---:').join('|')}|---|---:|`);
  for(const r of rep.curve){const c=r.cells[ps[1]??ps[0]];L.push(`| ${r.name} | ${r.pi.toFixed(2)} | ${ps.map(p=>r0(r.cells[p].x)).join(' | ')} | ${r1(c.t)} / ${r1(c.real)} | ${r0(c.speed)} |`);}L.push('');}
 L.push('## Kampaně (08 §2.6)','','| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |','|---|---:|---|---|---|---|---|---|---|---:|');
 for(const [k,s] of Object.entries(rep.groups))L.push(`| ${k} | ${pc(s.doneRate)} | ${s.district.map(d=>`${r0(d.throws)} / ${r1(d.minutes)}`).join(' | ')} | ${r0(s.throws)} / ${r1(s.minutes)} | ${s.flight.map(f=>r1(f.median)).join(' · ')} | ${r1(s.flightP90)} / ${r1(s.flightMax)} | ${pc(s.qteHit)} |`);
 L.push('','| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |','|---|---|---|---:|---:|---:|---:|---:|---:|');
 for(const [k,s] of Object.entries(rep.groups))L.push(`| ${k} | ${r0(s.droughtMedian)} / ${s.droughtMax} / ${r0(s.droughtMaxP90)} | ${r0(s.placeGapMedian)} / ${r0(s.placeGapP90)} | ${r0(s.firstPocket)} | ${pc(s.levelsBought)} | ${pc(s.gliderShare)} | ${pc(s.eCap)} | ${pc(s.betaCap)} | ${pc(s.diveCrash)} |`);
 {const E=Object.entries(rep.groups).filter(([,s])=>s.econ);
  if(E.length){L.push('','## Ekonomika (průměr ◈ na kampaň)','','| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |','|---|---|---|---|---:|');
   for(const [k,s] of E)L.push(`| ${k} | ${s.econ.income.map(r0).join(' / ')} | ${s.econ.spend.map(r0).join(' / ')} | ${Object.entries(s.econ.kind).map(([a,v])=>`${a} ${r0(v)}`).join(', ')||'–'} | ${r0(s.econ.left)} |`);
   L.push('','| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |','|---|---|');
   for(const [k,s] of E)L.push(`| ${k} | ${Object.entries(s.econ.models).map(([m,v])=>`${m}: ${pc(v.share)} · ${r0(v.coins)} · ${r0(v.x)} · ${r0(v.coinsPerMin)}${P.models[m]?.price!=null?` · ${pc(v.bought)} (${r0(v.buyThrow)})`:''}`).join('; ')} |`);}}
 if(rep.probes?.abilities){L.push('','## Speciály na výbavě „konec D3“ (zisk doletu)','','| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |','|---|---:|---:|---:|---:|---:|---:|---:|---:|');
  for(const r of rep.probes.abilities)L.push(`| ${r.profile} | ${r0(r.base)} | ${pc1(r.cushion.gain)} | ${pc1(r.sharp.gain)} | ${pc1(r.calm.gain)} | ${pc1(r.dive.gain)} (${pc(r.dive.crash)}) | ${pc1(r.whistle.gain)} | ${pc1(r.rocket.gain)} | ${pc1(r.diveHigh.gain)} |`);}
 if(rep.probes?.atlas){L.push('','## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)','',rep.probes.atlas.map(a=>`${a.bonus} ${pc1(a.gain)}${a.rate!=null?` (${pc(a.rate)} letů)`:''}`).join(' · '));}
 if(rep.probes?.star){const s=rep.probes.star;L.push('',`Shooting Star úr. ${s.level} v letech s hvězdou: ${pc1(s.gain)} (${s.flights} letů, hvězda v rozvrhu ${pc(s.scheduled)} klíčů, začala v ${pc(s.seen)}).`);}
 {const cr=Object.entries(rep.groups).filter(([,s])=>s.craneTugRate);if(cr.length)L.push('','Paper Crane v kampani (tah v letech / přes nové místo): '+cr.map(([k,s])=>`${k} ${pc1(s.craneTugRate)} / ${pc(s.craneNewPlace)}`).join(' · '));}
 {const ws=Object.entries(rep.groups).filter(([,s])=>s.windSwitch!=null);if(ws.length)L.push('','Náhled s větrem „both“ (01 §2.10 bod 7), hody s modelem jen na jeden hod: '+ws.map(([k,s])=>`${k} ${pc1(s.windSwitch)}`).join(' · '));}
 if(rep.probes?.atlasWeak){L.push('','Slabý: '+rep.probes.atlasWeak.map(a=>`${a.bonus} ${pc1(a.gain)}${a.rate!=null?` (${pc(a.rate)})`:''}`).join(' · '));}
 if(rep.sensitivity){L.push('',`## Citlivost (08 §10.3, průměrný a slabý, ${P.targets.reference??'balanced'})`,'','| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |','|---|---|---|---|---|---|');
  for(const s of rep.sensitivity)L.push(`| ${s.name} | ${r0(s.average?.throws)} / ${r1(s.average?.minutes)} | ${(s.average?.district??[]).map(r0).join(' / ')} | ${r1(s.average?.flightP90)} / ${r1(s.average?.flightMax)} | ${r0(s.weak?.throws)} / ${r1(s.weak?.minutes)} (${s.weak?.max??'–'}) | ${r0(s.full?.x)} / ${r1(s.full?.real)} |`);}
 {const M=Object.entries(rep.groups).filter(([,s])=>s.mailbag);
  if(M.length){L.push('','## Mailbag (01 §2.11)','','| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |','|---|---|---:|---|---|');
   for(const [k,s] of M)L.push(`| ${k} | ${r0(s.mailbag.coins)} / ${r0(s.mailbag.income)} | ${s.mailbag.incomeRatio.toFixed(3)} | ${s.mailbag.toGo.map(r1).join(' / ')} | ${s.mailbag.levels.map(l=>`${pc(l.bought)} (${r0(l.buyThrow)}) · ${r0(l.payEst)} · ${pc(l.paid)} · ${l.payFrac===Infinity?'∞':pc(l.payFrac)}`).join(' — ')} |`);}}
 if(rep.tricks){const X=rep.tricks,S=X.system;
  L.push('',`## Kousky (05 §4.6, skupina ${X.combo})`,'',`Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.`,'',
   '| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |','|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|');
  for(const r of X.rows)L.push(`| ${r.name} | ${r.cls??'–'} | ${r.flights} · ${pc(r.share)} | ${pc(r.cap)} | ${pc1(r.weak)} | ${pc1(r.rate)} | ${pc1(r.expert)} | ${(r.byD??[]).map(pc).join(' / ')||'–'} | ${pc1(r.intent)} (${ratio(r.ratio)}) | ${r.model?`${inf(r.firstIng)} / ${inf(r.firstIngP90)}${r.firstFrom?' (záměr)':''}`:`${inf(r.first)} (${pc(r.never)})`} | ${ratio(r.ew)} | ${r.gapMin!=null?`${r1(r.gapMin)} / ${r1(r.gapMed)}`:'–'}${r.gapIntent!=null?`; záměr min ${r1(r.gapIntent)}`:''} | ${r.vRate} · ${r.vIntent} · ${r.vFirst} · ${r.vEW} · ${r.vDist} · ${r.vClass} | ${r.verdictIntent} / ${r.verdictClass} | ${r.baseFrom?'výskyt bez záměru ze skupiny s kapsou ze záměru; ':''}${r.note} |`);
  const TT=P.targets.tricks;
  L.push('',`Brána (${X.gate.of} kousků mimo modely, platí ${X.gate.by==='class'?'podle tříd':'záměr u všech'}): záměr u všech zdravých ${X.gate.strict} (se záměrem NOT ASSESSED ${X.gate.lenient}), podle tříd (dovednost: expert / slabý ≥ ${TT.skillEW}×) ${X.gate.byClass}, z ${X.gate.of}, potřeba ${X.gate.need}. Čtvrť se počítá od ${TT.districtMin} letů s přísadami.`,
   `**Postavit:** ${BUILD[X.gate.build.mode]}: ${[...X.gate.build.tricks.map(id=>X.rows.find(r=>r.id===id).name),...X.gate.build.models.map(id=>X.rows.find(r=>r.id===id).name)].join(', ')}.`,
   `Korelace φ nad ${TT.corrList}: ${S.corrList?.length?S.corrList.map(c=>`${c.a} × ${c.b} ${c.phi.toFixed(2)} (${c.n})`).join(', '):'žádná'}.`,
   `Systém: 1. kousek mimo modely (medián průměrného) ${inf(S.firstTrick)} hodů (cíl ≤ ${TT.firstTrick}); nalezeno z 13 průměrný ${pc(S.found)} (cíl ${TT.found.map(pc).join('–')}), slabý ${pc(S.foundWeak)} (cíl ≥ ${pc(TT.foundWeak)}); nejvyšší korelace ${S.corrMax?`${S.corrMax.a} × ${S.corrMax.b} φ ${S.corrMax.phi.toFixed(2)} (${S.corrMax.n} letů)`:'–'}, nad ${TT.corr}: ${S.corrHigh.map(c=>`${c.a} × ${c.b}`).join(', ')||'žádná'}. Kousky nic nedávají, délku nemění (test \`progression-90\`).`);}
 L.push('',rep.targetSet&&rep.targetSet!=='default'?`## Cíle (sada ${rep.targetSet})`:'## Cíle 08 §10.2','','| Metrika | Hodnota | Cíl | |','|---|---|---|---|',...rep.checks.map(c=>`| ${c.name} | ${c.value} | ${c.goal} | ${c.ok==null?'–':c.ok==='na'?'NOT ASSESSED':c.ok?'OK':'FAIL'} |`));
 return L.join('\n')+'\n';
}

export const SENSITIVITY=[
 ['krok papíru ×0,9',()=>({workshop:{paper:{steps:P.workshop.paper.steps.map(x=>x*.9)}}})],['krok papíru ×1,1',()=>({workshop:{paper:{steps:P.workshop.paper.steps.map(x=>x*1.1)}}})],
 ['zrychlení klouzání 1,0',()=>({warp:{factor:1}})],['zrychlení klouzání 1,4',()=>({warp:{factor:1.4}})],
 ['ceny ×0,8',()=>prices(.8)],['ceny ×1,25',()=>prices(1.25)],
 ['Shooting Star ×0,5',()=>({events:{star:{chance:P.events.star.chance.map(x=>x*.5)}}})],['Shooting Star ×2',()=>({events:{star:{chance:P.events.star.chance.map(x=>x*2)}}})],
 ['rozestup událostí ×0,8',()=>({events:{gapScale:.8}})],['rozestup událostí ×1,25',()=>({events:{gapScale:1.25}})],
 ['readNoise 0',()=>({events:{floating:{readNoise:0}}})],['readNoise 0,4',()=>({events:{floating:{readNoise:.4}}})],
 ['push sond (scaleWithPace=false)',()=>({push:{scaleWithPace:false}})],
 ['nákupčí: trpělivost 3',()=>({bots:{realistic:{patience:3}}})],['nákupčí: trpělivost 10',()=>({bots:{realistic:{patience:10}}})],
 ['nákupčí: chyba odhadu 0,25',()=>({bots:{realistic:{noise:.25}}})],['nákupčí: chyba odhadu 0,8',()=>({bots:{realistic:{noise:.8}}})],
 ['nákupčí: bez preference papíru',()=>({bots:{realistic:{kind:{paper:1}}}})],
 // přepínače rozhodnutí 14. 10. na původní chování F3
 ['papír na hranici čtvrti (openAtPlace 5)',()=>({workshop:{paper:{openAtPlace:5}}})],['termika bez perfektu (thermal.perfect 0)',()=>({events:{thermal:{perfect:0}}})],
 ['Dive bez stropu (dive.maxSink null)',()=>({specials:{dive:{maxSink:null}}})],['Whistle plné okno (whistle.window 1)',()=>({specials:{whistle:{window:1}}})],
];
const sc=(a,k)=>a.map(x=>Math.round(x*k));
function prices(k){return {workshop:{power:{prices:sc(P.workshop.power.prices,k)},folds:{prices:sc(P.workshop.folds.prices,k)},paper:{prices:sc(P.workshop.paper.prices,k)}},atlas:{prices:P.atlas.prices.map(a=>sc(a,k))},pockets:{prices:sc(P.pockets.prices,k)}};}

export function args(argv){const o={set:[]};for(let i=0;i<argv.length;i++){const a=argv[i];if(!a.startsWith('--'))continue;const k=a.slice(2),v=argv[i+1]&&!argv[i+1].startsWith('--')?argv[++i]:true;k==='set'?o.set.push(v):o[k]=v;}return o;}
async function main(){
 const a=args(process.argv.slice(2)),list=(v,d)=>(v&&v!==true?String(v):d).split(',').filter(Boolean);
 let over={};if(a.profileset&&a.profileset!==true){if(!PROFILE_SETS[a.profileset])throw new Error('profileset '+a.profileset);over=merge(over,JSON.parse(JSON.stringify(PROFILE_SETS[a.profileset])));}
 if(a.modelset&&a.modelset!==true){if(!MODEL_SETS[a.modelset])throw new Error('modelset '+a.modelset);over=merge(over,JSON.parse(JSON.stringify(MODEL_SETS[a.modelset])));}
 if(a.targets&&a.targets!==true){if(!TARGET_SETS[a.targets])throw new Error('targets '+a.targets);over=merge(over,JSON.parse(JSON.stringify(TARGET_SETS[a.targets])));}
 if(a.mailbag)over=merge(over,{economy:{mailbag:{on:true}}});
 if(a.params)over=merge(over,JSON.parse(await readFile(a.params,'utf8')));for(const s of a.set)over=merge(over,parseSet(s));
 setParams(over);
 const profiles=list(a.profiles,'weak,average,good,expert'),strategies=list(a.strategies,'balanced'),pockets=list(a.pockets,'auto'),models=list(a.models,'better');
 const n=+(a.n??20),seed=+(a.seed??1),name=a.out??'run',probeN=+(a['probe-n']??60),workers=+(a.workers??Math.max(1,availableParallelism()-1));
 // kousky: --tricks = detekce ve všech skupinách, --intents = navíc skupiny s botem se záměrem (all = všechny kousky s pákou v simulátoru)
 const intents=a.intents?(a.intents===true||a.intents==='all'?intentTricks():list(a.intents,'')):[],tricks=!!(a.tricks||intents.length);
 // kousky s kapsou ze záměru a vlastním botem dostanou i skupinu „kapsa bez záměru“ (`|i:<id>|base`, běžní boti)
 const bases=intents.filter(i=>trickById[i]?.intent?.pocket&&INTENT_BOTS[i]).map(i=>i+'|base');
 const specs=profiles.flatMap(p=>strategies.flatMap(s=>pockets.flatMap(k=>models.flatMap(m=>[null,...intents,...bases].flatMap(i=>Array.from({length:n},(_,id)=>({profile:p,strategy:s,pockets:k,model:m,seed,id,
  ...(tricks?{tricks:true}:{}),...(i?{intent:i.split('|')[0],...(i.endsWith('|base')?{intentBase:true}:{})}:{})})))))));
 const t0=Date.now(),rs=await runCampaigns(specs,over,workers);setParams(over);
 const groups={};for(const r of rs)(groups[`${r.profile}|${r.strategy}|${r.pockets}|${r.model}${r.intent?'|i:'+r.intent+(r.intentBase?'|base':''):''}`]??=[]).push(r);
 const G=Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,summarize(v)]));
 const rep={name,date:new Date().toISOString(),n,seed,over,groups:G};if(a.targets&&a.targets!==true)rep.targetSet=a.targets;
 if(tricks)rep.tricks=trickTable(G);
 if(!a['no-probes']){rep.curve=curve(profiles,probeN);rep.probes={abilities:abilityProbe(profiles,probeN),atlas:atlasProbe(probeN),atlasWeak:atlasProbe(probeN,'weak'),star:starProbe(probeN)};}
 if(a.sensitivity){rep.sensitivity=[];const ref=P.targets.reference??'balanced';
  for(const [nm,fn] of SENSITIVITY){setParams(over);const o=merge(JSON.parse(JSON.stringify(over)),fn());
   const ss=['average','weak'].flatMap(p=>Array.from({length:n},(_,id)=>({profile:p,strategy:ref,pockets:'auto',model:P.targets.model??'better',seed,id})));
   const rr=await runCampaigns(ss,o,workers);setParams(o);
   const row={name:nm,average:summarize(rr.filter(r=>r.profile==='average')),weak:summarize(rr.filter(r=>r.profile==='weak')),full:sampleKit(kitFrom(P.curve.find(c=>c.name==='plná výbava')),'average',probeN)};
   rep.sensitivity.push({name:nm,average:{throws:row.average.throws,minutes:row.average.minutes,district:row.average.district.map(d=>d.throws),flightP90:row.average.flightP90,flightMax:row.average.flightMax},weak:{throws:row.weak.throws,minutes:row.weak.minutes,max:row.weak.throwsMax},full:{x:row.full.x,real:row.full.real}});}
  setParams(over);}
 rep.checks=checks(G,rep.probes);rep.seconds=(Date.now()-t0)/1000;
 const dir=join(dirname(fileURLToPath(import.meta.url)),'out');await mkdir(dir,{recursive:true});
 await writeFile(join(dir,name+'.json'),JSON.stringify({...rep,raw:a.raw?rs:undefined},null,1));const md=markdown(rep);await writeFile(join(dir,name+'.md'),md);
 console.log(md);console.log(`Hotovo za ${rep.seconds.toFixed(0)} s → simulation/progression/out/${name}.{json,md}`);
}
if(isMainThread&&process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
