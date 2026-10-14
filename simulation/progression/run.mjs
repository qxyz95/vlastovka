// CLI simulátoru progrese. Zapisuje jen do simulation/progression/out/.
// node simulation/progression/run.mjs [--profiles weak,average,good,expert] [--strategies balanced,paper-first] [--pockets auto,dive+sharp]
//   [--models better] [--n 20] [--seed 1] [--params over.json] [--set warp.factor=1] [--sensitivity] [--no-probes] [--probe-n 60] [--out smoke] [--workers 8]
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';
import {availableParallelism} from 'node:os';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {P,setParams,merge,parseSet,PROFILE_SETS} from './params.mjs';
import {campaign} from './campaign.mjs';
import {bestAngle,lv,createEvents,derive} from './model.mjs';
import {throwOnce} from './abilities.mjs';

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
  diveCrash:(()=>{const u=rs.reduce((a,r)=>a+r.dive.uses,0);return u?rs.reduce((a,r)=>a+r.dive.crash,0)/u:null;})()};
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
 const T=P.targets,ref=T.reference??'balanced',out=[],add=(name,value,ok,goal)=>out.push({name,value,goal,ok:ok==null?null:!!ok});
 const g=(p,s=ref,k='auto')=>G[`${p}|${s}|${k}|better`];
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
 }
 const all=Object.values(G);if(all.length)add('Žádný let > 60 s (skutečný)',r1(Math.max(...all.map(x=>x.flightMax))),Math.max(...all.map(x=>x.flightMax))<=T.flightMax,'≤ '+T.flightMax);
 if(W)add(`Slabý: cíl do ${T.weakFinishWithin} hodů`,pc(W.doneRate)+` (max ${W.throwsMax})`,W.doneRate===1&&W.throwsMax<=T.weakFinishWithin,'100 %');
 if(W&&A)add('Slabý / průměrný (hody)',(W.throws/A.throws).toFixed(2),W.throws/A.throws<=T.weakVsAverage,'≤ '+T.weakVsAverage);
 if(X&&A)add('Expert / průměrný (hody)',(X.throws/A.throws).toFixed(2),X.throws/A.throws>=T.expertVsAverage,'≥ '+T.expertVsAverage);
 if(X&&W)add('Expert / slabý (hody)',(X.throws/W.throws).toFixed(2),inR(X.throws/W.throws,T.expertVsWeak),T.expertVsWeak.join('–'));
 const bestSomewhere=new Set(),pkSeen=new Set();
 for(const p of Object.keys(P.profiles)){const b=g(p),pf=g(p,'paper-first'),af=g(p,'atlas-first'),bal=g(p,'balanced');
  if(b&&pf)add(`Paper napřed rychlejší o (${p})`,pc((b.minutes-pf.minutes)/b.minutes),(b.minutes-pf.minutes)/b.minutes<=T.paperFirst,'≤ '+pc(T.paperFirst));
  if(b&&af)add(`Atlas napřed pomalejší o (${p})`,pc((af.minutes-b.minutes)/b.minutes),(af.minutes-b.minutes)/b.minutes<=T.atlasFirst,'≤ '+pc(T.atlasFirst));
  if(b&&bal&&ref!=='balanced')add(`Optimální nákup rychlejší o (${p}, info)`,pc((b.minutes-bal.minutes)/b.minutes),null,'–');
  const pk=Object.entries(G).filter(([k])=>k.startsWith(p+'|'+ref+'|')&&!k.includes('|auto|')&&!k.includes('|none|')).map(([k,v])=>({k:k.split('|')[2],m:v.minutes})).sort((a,b)=>a.m-b.m);
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
 return out;
}

function markdown(rep){
 const L=[`# Simulátor progrese: ${rep.name}`,'',`Spuštěno ${rep.date}, ${rep.n} kampaní na skupinu, seed ${rep.seed}. Parametry přepsané: \`${JSON.stringify(rep.over)}\`.`,''];
 if(rep.curve){const ps=Object.keys(rep.curve[0].cells);L.push('## Křivka (08 §2.4)','',`| Výbava | π | ${ps.map(p=>p+' dolet').join(' | ')} | let ${ps[1]??ps[0]} sim / skut. [s] | prům. rychlost [m/s] |`,`|---|---:|${ps.map(()=>'---:').join('|')}|---|---:|`);
  for(const r of rep.curve){const c=r.cells[ps[1]??ps[0]];L.push(`| ${r.name} | ${r.pi.toFixed(2)} | ${ps.map(p=>r0(r.cells[p].x)).join(' | ')} | ${r1(c.t)} / ${r1(c.real)} | ${r0(c.speed)} |`);}L.push('');}
 L.push('## Kampaně (08 §2.6)','','| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |','|---|---:|---|---|---|---|---|---|---|---:|');
 for(const [k,s] of Object.entries(rep.groups))L.push(`| ${k} | ${pc(s.doneRate)} | ${s.district.map(d=>`${r0(d.throws)} / ${r1(d.minutes)}`).join(' | ')} | ${r0(s.throws)} / ${r1(s.minutes)} | ${s.flight.map(f=>r1(f.median)).join(' · ')} | ${r1(s.flightP90)} / ${r1(s.flightMax)} | ${pc(s.qteHit)} |`);
 L.push('','| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |','|---|---|---|---:|---:|---:|---:|---:|---:|');
 for(const [k,s] of Object.entries(rep.groups))L.push(`| ${k} | ${r0(s.droughtMedian)} / ${s.droughtMax} / ${r0(s.droughtMaxP90)} | ${r0(s.placeGapMedian)} / ${r0(s.placeGapP90)} | ${r0(s.firstPocket)} | ${pc(s.levelsBought)} | ${pc(s.gliderShare)} | ${pc(s.eCap)} | ${pc(s.betaCap)} | ${pc(s.diveCrash)} |`);
 if(rep.probes?.abilities){L.push('','## Speciály na výbavě „konec D3“ (zisk doletu)','','| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |','|---|---:|---:|---:|---:|---:|---:|---:|---:|');
  for(const r of rep.probes.abilities)L.push(`| ${r.profile} | ${r0(r.base)} | ${pc1(r.cushion.gain)} | ${pc1(r.sharp.gain)} | ${pc1(r.calm.gain)} | ${pc1(r.dive.gain)} (${pc(r.dive.crash)}) | ${pc1(r.whistle.gain)} | ${pc1(r.rocket.gain)} | ${pc1(r.diveHigh.gain)} |`);}
 if(rep.probes?.atlas){L.push('','## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)','',rep.probes.atlas.map(a=>`${a.bonus} ${pc1(a.gain)}${a.rate!=null?` (${pc(a.rate)} letů)`:''}`).join(' · '));}
 if(rep.probes?.star){const s=rep.probes.star;L.push('',`Shooting Star úr. ${s.level} v letech s hvězdou: ${pc1(s.gain)} (${s.flights} letů, hvězda v rozvrhu ${pc(s.scheduled)} klíčů, začala v ${pc(s.seen)}).`);}
 {const cr=Object.entries(rep.groups).filter(([,s])=>s.craneTugRate);if(cr.length)L.push('','Paper Crane v kampani (tah v letech / přes nové místo): '+cr.map(([k,s])=>`${k} ${pc1(s.craneTugRate)} / ${pc(s.craneNewPlace)}`).join(' · '));}
 if(rep.probes?.atlasWeak){L.push('','Slabý: '+rep.probes.atlasWeak.map(a=>`${a.bonus} ${pc1(a.gain)}${a.rate!=null?` (${pc(a.rate)})`:''}`).join(' · '));}
 if(rep.sensitivity){L.push('',`## Citlivost (08 §10.3, průměrný a slabý, ${P.targets.reference??'balanced'})`,'','| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |','|---|---|---|---|---|---|');
  for(const s of rep.sensitivity)L.push(`| ${s.name} | ${r0(s.average?.throws)} / ${r1(s.average?.minutes)} | ${(s.average?.district??[]).map(r0).join(' / ')} | ${r1(s.average?.flightP90)} / ${r1(s.average?.flightMax)} | ${r0(s.weak?.throws)} / ${r1(s.weak?.minutes)} (${s.weak?.max??'–'}) | ${r0(s.full?.x)} / ${r1(s.full?.real)} |`);}
 L.push('','## Cíle 08 §10.2','','| Metrika | Hodnota | Cíl | |','|---|---|---|---|',...rep.checks.map(c=>`| ${c.name} | ${c.value} | ${c.goal} | ${c.ok==null?'–':c.ok?'OK':'FAIL'} |`));
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

function args(argv){const o={set:[]};for(let i=0;i<argv.length;i++){const a=argv[i];if(!a.startsWith('--'))continue;const k=a.slice(2),v=argv[i+1]&&!argv[i+1].startsWith('--')?argv[++i]:true;k==='set'?o.set.push(v):o[k]=v;}return o;}
async function main(){
 const a=args(process.argv.slice(2)),list=(v,d)=>(v&&v!==true?String(v):d).split(',').filter(Boolean);
 let over={};if(a.profileset&&a.profileset!==true){if(!PROFILE_SETS[a.profileset])throw new Error('profileset '+a.profileset);over=merge(over,JSON.parse(JSON.stringify(PROFILE_SETS[a.profileset])));}
 if(a.params)over=merge(over,JSON.parse(await readFile(a.params,'utf8')));for(const s of a.set)over=merge(over,parseSet(s));
 setParams(over);
 const profiles=list(a.profiles,'weak,average,good,expert'),strategies=list(a.strategies,'balanced'),pockets=list(a.pockets,'auto'),models=list(a.models,'better');
 const n=+(a.n??20),seed=+(a.seed??1),name=a.out??'run',probeN=+(a['probe-n']??60),workers=+(a.workers??Math.max(1,availableParallelism()-1));
 const specs=profiles.flatMap(p=>strategies.flatMap(s=>pockets.flatMap(k=>models.flatMap(m=>Array.from({length:n},(_,id)=>({profile:p,strategy:s,pockets:k,model:m,seed,id}))))));
 const t0=Date.now(),rs=await runCampaigns(specs,over,workers);setParams(over);
 const groups={};for(const r of rs)(groups[`${r.profile}|${r.strategy}|${r.pockets}|${r.model}`]??=[]).push(r);
 const G=Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,summarize(v)]));
 const rep={name,date:new Date().toISOString(),n,seed,over,groups:G};
 if(!a['no-probes']){rep.curve=curve(profiles,probeN);rep.probes={abilities:abilityProbe(profiles,probeN),atlas:atlasProbe(probeN),atlasWeak:atlasProbe(probeN,'weak'),star:starProbe(probeN)};}
 if(a.sensitivity){rep.sensitivity=[];const ref=P.targets.reference??'balanced';
  for(const [nm,fn] of SENSITIVITY){setParams(over);const o=merge(JSON.parse(JSON.stringify(over)),fn());
   const ss=['average','weak'].flatMap(p=>Array.from({length:n},(_,id)=>({profile:p,strategy:ref,pockets:'auto',model:'better',seed,id})));
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
