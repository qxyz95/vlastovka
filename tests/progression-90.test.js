// Simulátor progrese na 90 min: Mailbag (01 §2.11), náhled přehráním (01 §2.10), detektory kousků (05 §4.6), cíle t90 (05 §7.2).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {P,setParams,MODEL_SETS,TARGET_SETS} from '../simulation/progression/params.mjs';
import {campaign,reward,coinReward,mailbagM,replayModel} from '../simulation/progression/campaign.mjs';
import {checks,summarize,trickTable} from '../simulation/progression/run.mjs';
import {createFlight,fly} from '../simulation/progression/model.mjs';
import {throwOnce,lineRocketBot,rocketBot} from '../simulation/progression/abilities.mjs';
import {TRICKS,trickById,detectTricks,intentTricks} from '../simulation/progression/tricks.mjs';

setParams();
const full={power:3,folds:3,paper:6,atlas:{chain:2,steam:2,thermal:2,drone:2,skip:3,pinwheel:1,tape:2,echo:1,star:1},slots:[]};
const sameRun=(a,b)=>assert.deepEqual({t:a.throws,r:a.real,c:a.coins,b:a.buys.map(x=>x.id),f:a.flights},{t:b.throws,r:b.real,c:b.coins,b:b.buys.map(x=>x.id),f:b.flights});

test('mailbag: off by default, coin reward with basket M and cap',()=>{
 assert.equal(P.economy.mailbag.on,false);assert.deepEqual(P.economy.mailbag.levels,[.1,.1,.1]);assert.deepEqual(P.economy.mailbag.unlockPlace,[5,9,13]);
 assert.equal(mailbagM(0),0);assert.ok(Math.abs(mailbagM(3)-.3)<1e-12);
 for(let x=0;x<6000;x+=7.3)assert.equal(coinReward(x,0),reward(x));
 assert.equal(coinReward(1300,.1),154);assert.equal(coinReward(1300,.3),182);assert.equal(coinReward(0,.3),13); // 01 §2.11: hod 0 m = 13 ◈
 assert.equal(coinReward(1300,.9),Math.floor(140*1.5)); // strop koše M +50 %
 const R=campaign({profile:'average',strategy:'realistic',seed:1,id:0});assert.ok(!R.buys.some(b=>b.kind==='mailbag'));assert.deepEqual(R.econ.mailbag,[0,0,0,0]);
});

test('mailbag: levels open by place in order, bonus accounting, no-mailbag / mailbag-first',()=>{
 setParams({economy:{mailbag:{on:true}}});
 try{
  const spec={profile:'average',seed:1,id:1},mf=campaign({...spec,strategy:'mailbag-first'}),nm=campaign({...spec,strategy:'no-mailbag'}),re=campaign({...spec,strategy:'realistic'});
  assert.ok(!nm.buys.some(b=>b.kind==='mailbag'));
  const mb=mf.buys.filter(b=>b.kind==='mailbag');assert.deepEqual(mb.map(b=>b.id),['mailbag1','mailbag2','mailbag3'].slice(0,mb.length));assert.ok(mb.length>=1);
  // úroveň k až po rekordu na začátek místa unlockPlace[k]
  mb.forEach((b,k)=>assert.ok(Math.max(...mf.flights.slice(0,b.throw).map(f=>f[3]))>=(P.economy.mailbag.unlockPlace[k]-1)*P.route.place-1,b.id));
  for(const R of [mf,re]){const inc=R.econ.income.reduce((a,b)=>a+b,0),sp=R.econ.spend.reduce((a,b)=>a+b,0);assert.equal(inc-sp,R.coins);
   const bonus=R.econ.mailbag.reduce((a,b)=>a+b,0),base=R.flights.reduce((a,f)=>a+reward(f[3]),0);
   // flights[3] je zaokrouhlený dolet; bonus = příjem − základní odměny, takže součet sedí do zaokrouhlení
   assert.ok(Math.abs(inc-bonus-base)<=R.throws,`${inc} ${bonus} ${base}`);
   assert.ok(Math.abs(R.mailbag.reduce((a,e)=>a+e.earned,0)-bonus)<1e-6);}
  // bez koupě Mailbagu je realistic shodná s no-mailbag (stejná náhoda)
  if(!re.buys.some(b=>b.kind==='mailbag'))sameRun(re,nm);
  const S=summarize([mf,re,nm]);assert.ok(S.mailbag&&S.mailbag.levels.length===3);assert.ok(S.mailbag.incomeRatio>=1);
 }finally{setParams();}
});

test('preview replay: forced QTE grades, ideal shift, current model estimate 1',()=>{
 // stejný hod s vynucenými výsledky jiného letu: události vyhodnocené v obou letech mají stejné výsledky
 const ctx={key:'pr|3',n:20,profile:'weak',angle:18},a=throwOnce({...full,model:'dart'},ctx);
 const grades=Object.fromEntries(a.events.filter(e=>e.result&&e.result!=='interrupted').map(e=>[e.i,e.result]));
 const b=throwOnce({...full,model:'glider'},{...ctx,angle:30,grades});
 for(const e of b.events)if(e.result&&grades[e.i]&&e.result!=='interrupted')assert.equal(e.result,grades[e.i]);
 // přehrání vlastních výsledků se stejným modelem = původní let
 assert.equal(throwOnce({...full,model:'dart'},{...ctx,grades}).x,a.x);
 const hist=[1,2,3,4,5,6].map(n=>({key:'pr',n,profile:'average',bias:0,angle:18})),meta=hist.map(h=>{const f=throwOnce({...full,model:'dart'},h);
  return {model:'dart',grades:Object.fromEntries(f.events.filter(e=>e.result&&e.result!=='interrupted').map(e=>[e.i,e.result]))};});
 const r=replayModel(full,['dart','glider'],{hist,meta,cur:'dart',key:'pr',n:7,profile:'average'});
 assert.equal(r.est.dart,1);assert.ok(r.est.glider>0);assert.equal(r.model,r.est.glider>1?'glider':'dart');
 assert.deepEqual(replayModel(full,['dart','glider'],{hist:[],meta:[],cur:'dart',key:'pr',n:1,profile:'average'}),{model:'dart',est:{dart:1}});
 // úhel posunutý o rozdíl ideálů: glider z hodu Dartem na 18° letí na 30°
 const f=throwOnce({...full,model:'glider'},{...hist[0],angle:18+P.models.glider.ideal-P.models.dart.ideal,grades:meta[0].grades,exact:true});assert.ok(Math.abs(f.angle-30)<1);
});

test('preview replay: campaign uses replay by default, passive mode stays available',()=>{
 setParams(MODEL_SETS.obsah01);
 try{const spec={profile:'average',strategy:'realistic',model:'preview',seed:1,id:0},rep=campaign(spec);
  setParams({...MODEL_SETS.obsah01,bots:{modelPick:{mode:'passive'}}});const pas=campaign(spec);
  assert.ok((rep.byModel.glider?.throws??0)>0,'replay volí i Glider');assert.notDeepEqual(rep.flights,pas.flights);
 }finally{setParams();}
});

// syntetický let pro detektory: události {type,i,result,resolvedAt,comboBefore}
const ev=(type,result,t,extra={})=>({type,i:extra.i??Math.round(t*10),result,resolvedAt:t,comboBefore:extra.combo??0,phase:'done'});
const fake=(events,o={})=>({events,echoes:o.echoes??[],stats:{skips:0,maxY:12,...o.stats},kit:o.kit??full,w:o.w??0,t:o.t??20,x:o.x??1000});
const hit=(id,f,replay)=>trickById[id].detect(f,replay);

test('tricks: detectors on synthetic flights',()=>{
 assert.equal(TRICKS.length,13);assert.deepEqual(intentTricks(),['pigeonExpress','overTheLine','dronePingPong','hawkFeather','kiteTail','skimmerRipples','sailStripes','needleThread']);
 assert.ok(hit('pigeonExpress',fake([ev('bird','perfect',3),ev('gust','perfect',4.4)])));
 assert.ok(!hit('pigeonExpress',fake([ev('bird','perfect',3),ev('gust','perfect',4.6)])));
 assert.ok(!hit('pigeonExpress',fake([ev('bird','success',3),ev('gust','perfect',4)])));
 assert.ok(!hit('pigeonExpress',fake([ev('bird','perfect',3),ev('steam','perfect',3.5),ev('gust','perfect',4)])));
 assert.ok(hit('kettleSong',fake([ev('steam','perfect',3)])));assert.ok(!hit('kettleSong',fake([ev('steam','success',3)])));
 assert.ok(hit('tapeSave',fake([ev('gust','miss',3),ev('star','perfect',4),ev('bird','perfect',6)])));assert.ok(!hit('tapeSave',fake([ev('gust','miss',3),ev('bird','success',6)])));
 const st=ev('steam','perfect',3,{i:4});
 assert.ok(hit('steamOrgan',fake([st],{echoes:[{src:4,done:true}]})));assert.ok(!hit('steamOrgan',fake([st],{echoes:[{src:4}]})));
 assert.ok(hit('wish',fake([ev('star','perfect',5,{combo:5})])));assert.ok(!hit('wish',fake([ev('star','perfect',5,{combo:4})])));assert.ok(!hit('wish',fake([ev('star','miss',5,{combo:9})])));
 assert.ok(hit('dronePingPong',fake([ev('drone','perfect',3),ev('drone','perfect',5)])));assert.ok(!hit('dronePingPong',fake([ev('drone','perfect',3),ev('drone','perfect',5.2)])));
 const verbs=[ev('gust','success',2),ev('bird','perfect',5),ev('steam','success',9),ev('drone','success',13)];
 assert.ok(hit('allTheVerbs',fake(verbs)));assert.ok(!hit('allTheVerbs',fake(verbs.slice(0,3))));assert.ok(!hit('allTheVerbs',fake([...verbs.slice(0,2),ev('steam','partial',9),verbs[3]])));
 const hawk={...full,model:'hawk'};
 assert.ok(hit('hawkFeather',fake([ev('gust','perfect',1),ev('bird','perfect',2),ev('star','miss',2.5),ev('gust','perfect',3)],{kit:hawk})));
 assert.ok(!hit('hawkFeather',fake([ev('gust','perfect',1),ev('bird','success',2),ev('gust','perfect',3),ev('gust','perfect',4)],{kit:hawk})));
 assert.ok(hit('kiteTail',fake([],{stats:{maxY:41}})));assert.ok(hit('kiteTail',fake([ev('thermal','perfect',3)])));assert.ok(!hit('kiteTail',fake([ev('thermal','success',3)])));
 assert.ok(hit('skimmerRipples',fake([],{stats:{skips:2}})));assert.ok(!hit('skimmerRipples',fake([],{stats:{skips:1}})));
 assert.ok(hit('sailStripes',fake([],{w:.08})));assert.ok(!hit('sailStripes',fake([],{w:.04})));
 assert.ok(hit('needleThread',fake([ev('drone','success',3),ev('drone','perfect',8)])));assert.ok(!hit('needleThread',fake([ev('drone','success',3),ev('drone','miss',8)])));
 // Over the Line: výstřel do 1 s před dotykem země a bez něj by let skončil před hranicí místa
 const pl=P.route.place,otl=(fire,touch,x0)=>hit('overTheLine',fake([],{x:pl+5,stats:{rocketT:[fire],touchT:[touch]}}),()=>({x:x0}));
 assert.ok(otl(9.5,10,pl-5));assert.ok(!otl(9.5,10,pl+1));assert.ok(!otl(8.5,10,pl-5));
 // přísady a model v ruce
 assert.ok(!trickById.kettleSong.has({atlas:{}}));assert.ok(trickById.overTheLine.has({slots:['rocket']}));assert.ok(!trickById.hawkFeather.has(full));
 const D=detectTricks(fake([ev('steam','perfect',3)]));assert.ok(D.hit>>1&1);assert.equal(D.ing>>TRICKS.findIndex(t=>t.id==='hawkFeather')&1,0);
});

test('tricks: detection does not change the campaign, intent changes pockets and bots',()=>{
 const spec={profile:'average',strategy:'realistic',seed:1,id:2},a=campaign(spec),b=campaign({...spec,tricks:true});
 sameRun(a,b);assert.equal(b.tricks.flights.length,b.throws);assert.ok(!a.tricks);
 const c=campaign({...spec,intent:'overTheLine'});assert.equal(c.intent,'overTheLine');assert.ok(c.tricks);
 assert.ok((c.slotsUsed.rocket??0)>=(b.slotsUsed.rocket??0));
 assert.throws(()=>campaign({...spec,intent:'nope'}));
 // protifaktický let: od offAfter oba boti rakety nestřílí
 const kit={...full,slots:['rocket']},ctx={key:'ol|1',n:20,profile:'average',angle:18},f=throwOnce(kit,ctx);assert.ok(f.stats.rocketT?.length>0);
 assert.equal(throwOnce(kit,{...ctx,bot:{rocket:{offAfter:0}}}).stats.rocketT,undefined);
 assert.equal(throwOnce(kit,{...ctx,intent:'overTheLine',bot:{rocket:{offAfter:0}}}).stats.rocketT,undefined);
 assert.ok(typeof lineRocketBot==='function'&&typeof rocketBot==='function');
});

test('t90 targets: 05 §7.2 bands, NOT ASSESSED rows only with the set',()=>{
 const T=TARGET_SETS.t90.targets;
 assert.deepEqual(T.throwsPerDistrict,[[34,46],[36,48],[37,49],[36,48]]);assert.deepEqual(T.minutesPerDistrict,[[14,20],[18,24],[21,27],[23,29]]);
 assert.deepEqual(T.totalMinutes,[82,98]);assert.deepEqual(T.totalThrows,[150,185]);assert.equal(T.weakVsAverage,1.35);assert.equal(T.expertVsAverage,.69);
 assert.deepEqual(T.droughtA,{median:3,p90:6,maxP90:12});assert.equal(T.droughtP90,5);assert.equal(T.placeGapMedian,11);assert.equal(T.placeGapP90,17);
 const rs=[0,1].map(id=>campaign({profile:'average',strategy:'realistic',seed:1,id})),W=[0,1].map(id=>campaign({profile:'weak',strategy:'realistic',seed:1,id}));
 const G={'average|realistic|auto|better':summarize(rs),'weak|realistic|auto|better':summarize(W)};
 const def=checks(G,null);assert.ok(!def.some(c=>c.ok==='na'));assert.ok(def.some(c=>c.name==='Slabý / průměrný (hody)'));
 setParams(TARGET_SETS.t90);
 try{const c=checks(G,null);assert.ok(c.filter(x=>x.ok==='na').length>=4);assert.ok(c.some(x=>x.name==='Slabý / průměrný (minuty)'));
  assert.ok(c.some(x=>x.name.startsWith('Sucho bez novinky A')));assert.ok(c.some(x=>x.name==='Hody celkem (průměrný)'));
  // targets.model 'preview' bez skupiny preview → reference better
  assert.ok(c.some(x=>x.name==='Hody D1 (průměrný)'));
 }finally{setParams();}
 const S=summarize(rs);assert.equal(S.repeat.length,4);assert.ok(S.repeat[0]>.9);assert.ok(S.droughtA.median!=null);
});

test('tricks: verdict table follows 05 §4.6 thresholds',()=>{
 const per=(rate,first,never,extra={})=>({flights:200,rate,campaigns:4,first,never,firstIng:3,firstIngP90:9,...extra});
 const grp=o=>({tricks:{per:Object.fromEntries(TRICKS.map(t=>[t.id,o[t.id]??per(.1,10,0)])),firstTrick:5,found:.5,corrHigh:[]}});
 const G={'average|realistic|auto|better':grp({kettleSong:per(.3,5,0),wish:per(.005,50,.8)}),'weak|realistic|auto|better':grp({}),'expert|realistic|auto|better':grp({}),
  'average|realistic|auto|better|i:overTheLine':grp({overTheLine:per(.2,5,0)}),'average|realistic|auto|better|i:pigeonExpress':grp({pigeonExpress:per(.11,5,0)})};
 const X=trickTable(G),row=id=>X.rows.find(r=>r.id===id);
 assert.equal(row('overTheLine').verdict,'HEALTHY');assert.equal(row('pigeonExpress').vIntent,'náhoda');assert.equal(row('kettleSong').vRate,'samozřejmý');
 assert.equal(row('kettleSong').verdict,'CRITICAL');assert.equal(row('wish').vRate,'vzácný');assert.equal(row('tapeSave').verdict,'HEALTHY (záměr NOT ASSESSED)');
 assert.equal(row('hawkFeather').verdict,'HEALTHY');assert.equal(X.gate.of,8);assert.equal(X.gate.strict,1);
});
