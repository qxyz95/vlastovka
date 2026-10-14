// Všechna laditelná čísla nového systému progrese (návrh research/bonusy/08-navrh-kolo2.md).
// Logika v model/abilities/campaign čte jen odsud. run.mjs umí přepsat cokoli přes --params file.json nebo --set a.b=c.
// Výchozí hodnoty = sada doladěná ve fázi F5 (research/bonusy/12-ladeni2.md), F3 je v out/params-f3.json (10-ladeni.md). Původní čísla z 08 jsou v out/params-08.json
// a u změněných položek v komentáři „08:“.
import {DT,GRAVITY,STEEP_PENALTY,MODELS} from '../../src/config.js';
import {TIMING} from '../../src/events.js';
import {SCREEN_METERS,ROUTE} from '../../src/scenes.js';

const DEFAULTS={
 // Trasa: 16 míst po šířce obrazovky (~304,8 m), 4 čtvrti po 4 místech. Cíl = konec 16. místa (4 876 m).
 route:{place:SCREEN_METERS,places:ROUTE.length,perDistrict:4,finish:SCREEN_METERS*ROUTE.length},
 physics:{dt:DT,gravity:GRAVITY,steepPenalty:STEEP_PENALTY,y0:12,maxT:180,eventMinY:8},
 // Dart beze změny z dnešního config.js, Glider přeladěný podle 08 (Pravidla Dílny).
 models:{dart:{...MODELS.dart},glider:{speed:14,glide:4,drag:.12,cruise:11,ideal:30,qte:1.15}},
 workshop:{
  power:{prices:[50,160,350],step:.14},                         // 08: ceny 40/120/260
  folds:{prices:[50,160,350],steady:.30,window:.25,push:.20},     // 08: 40/120/260, steady .25, window .15; F3 window .20
  // π = 1 + Σ steps; 4 druhy papíru po 3 úrovních, druh k se otevře prvním doletem do čtvrti k.
  // 08: ceny 100/180/300 | 650/900/1150 | 1900/2400/2900 | 3500/4100/4700, kroky .65 | .80 | .75 | .85 (π 10,15)
  // F5: Kraft levný a slabší (D1 bez „šetření na Kraft“), Washi a Neon silnější a dražší; F3: ceny 180/320/520 | 1210/1600/1980 | 3360/4080/4800 | 2640/3190/3740, kroky .62 | .70 | .66 | .64
  paper:{prices:[180,320,520,500,800,1100,2800,3600,4400,3200,3800,4400],steps:[.62,.62,.62,.45,.45,.45,.70,.70,.70,.85,.85,.85],perTier:3,
   openAtPlace:3}, // rozhodnutí 14. 10. (06): druh k+1 se otevře doletem na 3. místo čtvrti k (1–4); 5 = hranice další čtvrti jako v 08 // π 2,86 / 4,21 / 6,31 / 8,86 (F3: 2,86 / 4,96 / 6,94 / 8,86)
 },
 atlas:{
  // pořadí = místa 1..16; glider a encore nemají úrovně
  bonuses:['glider','chain','pinwheel','steam','tape','crane','skip','gull','momentum','thermal','echo','star','drone','paperCrane','onAir','encore'],
  unlevelled:['glider','encore'],gliderAt:100,
  prices:[[40,90],[170,340],[500,1000],[500,1000]], // [úr. 2, úr. 3] podle čtvrti místa; 08: 50/100, 200/400, 450/900, 750/1500; F3: D3 600/1200, D4 480/960
  crane:1.5,                                      // y0 +1,5 m za úroveň (08: 2)
  gull:{carry:[.2,.35,.5],push:[.10,.15,.22]},     // F3: push úr. 3 .20
  tape:[.30,.50,.75],                             // 08: .25/.40/.55; F3: .30/.45/.60 (úr. 3 teď víc než částečný zásah, kvůli slabému SKILLS)
  skip:{keep:[.30,.45,.45],bounces:[1,1,2],vy:3.0,minVx:1.75,chainVx:.5}, // minVx: první dotek (08: .5, oprava 3 z F2); vy 08: 2,2
  momentum:{step:[.004,.014,.022],cap:[.04,.12,.18]}, // 08: .02/.03/.04, strop .30/.35/.40; F3: .008/.018/.028, strop .08/.18/.25
  onAir:{beta:[.10,.15,.20],combo:3},             // 08: .08/.12/.16
  echo:{share:[.10,.40,.50],delay:.6},            // 08: .4/.6/.8; F3: .25/.5/.75 (perfekt termiky přidal Echu)
  paperCrane:{reach:[.03,.05,.08]},              // podíl šířky místa (oprava 2 z F2): 9 / 15 / 24 m
  pinwheel:{rerolls:[1,2,3],                    // 08: 1/2/2
  noHeadwind:[false,false,true]},
  chain:[{step:.10,max:4},{step:.13,max:5},{step:.21,max:5}], // 08: .08×4, .10×4, .12×5; F3 úr. 3 .17
 },
 combo:{step:.05,max:3,success:1,perfect:2,partial:1,star:2},
 caps:{E:2.0,beta:.5},                            // 08: E 1,5 (s čísly 08 nedosažitelný strop; pojistka, oprava 5 z F2)
 push:{base:1.5,perfect:1.25,scaleWithPace:true},
 events:{
  timing:{...TIMING},maxEvents:12,firstAt:1.5,earlyGap:3,earlyCount:3,gapMin:4,gapSpread:3,gapScale:1,effectMin:1,retry:.25,earlyGrace:.12,
  weights:{gust:2,bird:2,steam:1,thermal:1,drone:1}, // steam/thermal/drone jen po odemčení v Atlasu
  gust:{dvy:2,push:1},
  bird:{carry:.8,carryPerfect:1.1,minVx:10,minVy:.4,push:1},
  // nové události: silnější než v 08, aby ve směsi nesnižovaly dolet (06, oprava 4 obecně); 08 v komentáři
  steam:{firstPuff:1.3,gapMin:.45,gapMax:.6,window:.9,lift:1.6,pushFull:2.4,pushPartial:.6,levelPush:.7,burst:{amp:.3,dur:2,shape:'flat'}}, // 08: window .6, lift 1, full 1.5, partial 0, level .3, burst .15
  thermal:{warning:2,column:.65,core:.25,perfect:.08,  /* perfect: ± s kolem středu jádra (rozhodnutí 14. 10.) */ dvy:3.7,push:3.0,half:.6,levelPush:.7,secondChance:.4,followGap:.3},  // 08: core .175, dvy 3, push 1, half .5, level .3
  drone:{lead:.12,dvy:3,push:2.2,levelWindow:1.3,pairChance:.5,followGap:.2},                                 // 08: dvy 2,5, push 1,3, pair .35
  star:{chance:[.08,.12,.16],window:2,slotMin:1,slotMax:3,gap:.5,after:.5,burst:{amp:1,dur:4,shape:'linear'}}, // 08: Starburst +40 %, slotMax 4 (sim.)
  floating:{gust:.25,birdMin:.6,birdMax:.95,rampFrom:3,rampTo:15,readNoise:.15},
 },
 wind:{values:[-.12,-.08,-.04,0,.04,.08,.12],weights:[1,2,3,3,3,2,1],shear:25},
 swing:{zone:.09,peak:1.15,gain:1.05,fromThrow:4},
 pockets:{prices:[300,5040],                      // 08: 600 / 3 500
  secondFromDistrict:2,unlock:{cushion:0,sharp:0,dive:1,calm:1,whistle:2,rocket:2},active:['dive','cushion','whistle','rocket'],exclusive:[['sharp','calm']]},
 specials:{
  sharp:{window:.75,S:1.45},calm:{gap:1.6,S:1.6},  // 08: sharp S 1,3, calm S 1,5
  // fromDiveOnly = oprava 1 z F2; 08: conv .45, lowConv .60, pásmo nízkého průletu 2–5 m
  dive:{maxSink:2.2, /* F5 (výchozí 14. 10.: 3) */ /* strop rychlosti střemhlavu = násobek běžného klesání vx/glide (rozhodnutí 14. 10.), null = bez stropu */ fromDiveOnly:true,gravity:3,accel:2.2,conv:.36,lowConv:.74, /* F3: accel 2.4, conv .40, lowConv .78 */ low:[2,7],keep:.6,waitMax:2,lowBurst:{amp:.2,dur:3,shape:'flat'}},
  cushion:{maxY:6,perfectY:1,midY:2.5,perfectT:1.6,midT:1.2,glide:1.4,glideT:1.5},
  whistle:{uses:1,minY:8,window:.8},             // 08: 3× za let; window = okna přivolané události (rozhodnutí 14. 10.)
  rocket:{charges:2,amp:1.4,tau:1.5},             // 08: amp 1 (vx += cruise)
 },
 warp:{factor:1.4,ramp:.3,lookahead:1},
 time:{ui:8,districtCard:4},
 // Profily = dnešní SKILLS z simulation/monte-carlo.mjs. qte = šum časování [s], bias ~ N(0,qte/2) na kampaň.
 profiles:{
  weak:{mu:.5,sigma:.12,angle:5,qte:.22,react:.45},
  average:{mu:.7,sigma:.10,angle:3.5,qte:.14,react:.35},
  good:{mu:.85,sigma:.07,angle:2.5,qte:.09,react:.3},
  expert:{mu:.95,sigma:.04,angle:1.5,qte:.05,react:.25},
  weakAssist:{mu:.5,sigma:.12,angle:5,qte:.22,react:.45,assist:{window:1.4,noise:.6,slow:.6}}, // DQ-13
  auto:{mu:.5,sigma:.12,angle:5,qte:.22,react:.45,auto:true},                                // DQ-14
 },
 bots:{
  dive:{minY:25,target:5,maxUses:3},cushion:{target:.6},rocket:{margin:.08,endY:2.5},whistle:{combo:2}, // dive 08/DQ-11: cíl 3,5 m, jednou za let (sim. F1)
  previewThrows:1,modelExplore:.15,angleStart:20,angleStep:[3,6],
  pocketAuto:{weak:['rocket','cushion'],average:['rocket','calm'],good:['dive','sharp'],expert:['dive','sharp'],weakAssist:['rocket','cushion'],auto:['rocket','calm']},
  pocketFallback:['cushion','sharp'],fallbackThrows:3, // záloha se nasadí jen při kladném náhledu na posledních hodech (F3)
  // realistický nákupčí (F3): odhad přínosu na minci s log-normální chybou, netrpělivost (nečeká na cíl déle než patience hodů)
  // preference viditelného: papír mění vzhled vlaštovky a má největší náhled, hráč mu dá o čtvrtinu větší váhu
  realistic:{noise:.5,patience:6,kind:{workshop:1,paper:1.25,atlas:1,pocket:1}},
 },
 campaign:{maxThrows:400,strategies:['balanced','realistic','paper-first','atlas-first','cheapest','random'],fallback:'realistic'}, // fallback = čím se řídí paper-/atlas-first mimo svou prioritu
 // Výbavy pro tabulku křivky (08 §2.4). atlas: úroveň každého bonusu; '*' = všechny odemčené na danou úroveň.
 curve:[
  {name:'1. hod (nic)',power:0,folds:0,paper:0,atlas:{}},
  {name:'po Power 1',power:1,folds:0,paper:0,atlas:{}},
  {name:'po Paper 1',power:0,folds:0,paper:1,atlas:{}},
  {name:'střed D1',power:2,folds:1,paper:1,atlas:{chain:1}},
  {name:'konec D1',power:3,folds:3,paper:3,atlas:{chain:2,pinwheel:1,steam:1}},
  {name:'konec D2',power:3,folds:3,paper:6,atlas:{chain:2,pinwheel:1,steam:2,tape:2,crane:2,skip:2,gull:2}},
  {name:'konec D3',power:3,folds:3,paper:9,atlas:{chain:3,pinwheel:2,steam:2,tape:2,crane:2,skip:2,gull:2,momentum:2,thermal:2,echo:2,star:1}},
  {name:'střed D4',power:3,folds:3,paper:10,atlas:{'*':3,encore:0,paperCrane:0,onAir:0}},
  {name:'plná výbava',power:3,folds:3,paper:12,atlas:{'*':3}},
  {name:'plná bez Atlasu',power:3,folds:3,paper:12,atlas:{}},
  {name:'plná, kluzák',model:'glider',power:3,folds:3,paper:12,atlas:{'*':3}},
 ],
 // Cíle 08 §10.2 (run.mjs je porovná a označí OK/FAIL).
 targets:{
  throwsPerDistrict:[[25,35],[20,30],[20,30],[20,30]],minutesPerDistrict:[[12,18],[10,16],[12,18],[14,20]],totalMinutes:[50,75],
  weakFinishWithin:250,weakVsAverage:1.4,expertVsAverage:.7,expertVsWeak:[.6,.75],
  flightMedian:[22,27,30,35],flightP90:45,flightMax:60,droughtMedian:4,droughtMax:8,droughtStat:'p90',placeGapMedian:8,placeGapP90:14,
  pocketSpread:.08,diveCrash:{weak:.15,expert:.03},diveHigh:.02,paperFirst:.10,atlasFirst:.20,atlasBonus:[.03,.15],
  capE:.20,capBeta:.25,gliderShare:[.3,.7],firstPocket:[20,40],levelsBought:[.6,.85],
  skipRate:[.3,.5],          // 06, oprava 3: Stone Skip na úr. 3 zhruba ve 30–50 % letů
  reference:'realistic',     // referenční nákupčí pro délku hry, kapsy a srovnání strategií (F3, AUDIT #37)
 },
};

// Sady profilů (AUDIT F2 §3.2): skills = SKILLS beze změny (základ ladění), x2 = šum časování ×2 (povinně hlídaná robustní sada),
// lapse = SKILLS + výpadek pozornosti (hráč na událost vůbec nezareaguje), jen informativně.
const qte2=k=>Object.fromEntries(Object.entries(DEFAULTS.profiles).map(([p,v])=>[p,{qte:+(v.qte*k).toFixed(3)}]));
export const PROFILE_SETS={skills:{},x2:{profiles:qte2(2)},lapse:{profiles:{weak:{lapse:.12},average:{lapse:.07},good:{lapse:.04},expert:{lapse:.02},weakAssist:{lapse:.12}}}};

const clone=o=>JSON.parse(JSON.stringify(o));
export let P=clone(DEFAULTS);
export const defaults=()=>clone(DEFAULTS);
const isObj=v=>v&&typeof v==='object'&&!Array.isArray(v);
export function merge(target,src){for(const [k,v] of Object.entries(src))isObj(v)&&isObj(target[k])?merge(target[k],v):target[k]=clone(v);return target;}
// Přepíše parametry na místě (sdílený objekt P vidí všechny moduly). reset=true začne od výchozích.
export function setParams(over={},reset=true){if(reset){for(const k of Object.keys(P))delete P[k];Object.assign(P,clone(DEFAULTS));}merge(P,over);return P;}
// "a.b.c=1.2" → {a:{b:{c:1.2}}}; hodnota se čte jako JSON, jinak jako text.
export function parseSet(s){const [path,raw]=s.split('=');let v;try{v=JSON.parse(raw);}catch{v=raw;}const o={};path.split('.').reduce((a,k,i,ks)=>a[k]=i===ks.length-1?v:{},o);return o;}
