// Kampaň po místech (08 §10.1 bod 2, 5, 6): odemykání Atlasu doletem, druhy papíru doletem na místo (openAtPlace), kapsy, nákupní strategie,
// volba modelu, učení úhlu z nápovědy po hodu a měření času (simulovaný let, skutečný se zrychlením, UI, karty čtvrtí).
import {P} from './params.mjs';
import {stream,gauss,clip,bestAngle,createFlight,fly} from './model.mjs';
import {throwOnce} from './abilities.mjs';

const levelled=()=>P.atlas.bonuses.filter(b=>!P.atlas.unlevelled.includes(b));
export const totalLevels=()=>P.workshop.power.prices.length+P.workshop.folds.prices.length+P.workshop.paper.prices.length+levelled().length*2;
const placeOf=b=>P.atlas.bonuses.indexOf(b); // 0..15
const districtOf=dist=>Math.min(3,Math.floor(Math.max(0,dist)/(P.route.place*P.route.perDistrict)));
// Otevřené druhy papíru (rozhodnutí 14. 10.): druh k+1 (k = 1…3) je v nabídce od rekordu ≥ začátek místa (k−1)·perDistrict + openAtPlace
// (místa 1–16, místo m začíná v (m−1)·place). openAtPlace = 5 = hranice další čtvrti (08). Kapsy a speciály dál podle čtvrti.
// Odměna za hod (04 §1.1): base + floor(max(0, dolet)·perMeter). Dělení převrácenou hodnotou drží výsledek bitově shodný s floor(x/10).
export const reward=x=>{const E=P.economy.reward;return E.base+Math.floor(Math.max(0,x)/(1/E.perMeter));};
// Modely za mince: v katalogu P.models mají price, v nabídce od rekordu na začátek místa unlockPlace.
export const paidModels=()=>Object.entries(P.models).filter(([,m])=>m.price!=null).map(([id])=>id);
const MODEL_STRATEGIES=['no-models','models-first'];
// Volba 'preview' = náhled v Dílně (01 §2.10): vítr před hodem je známý (vč. Pinwheel), pasivní let bez událostí každého vlastněného modelu
// s jeho úhlem záměru a silou mu profilu, vezme nejdelší. bots.modelPick.noise = log-normální chyba odhadu (stream r).
export function previewModel(kit,owned,{key,n,profile,intent={},r=null}){
 const sk=P.profiles[profile],w=createFlight(kit,{key,n,profile,events:false}).w,charge=Math.round(sk.mu*20)/20,nz=P.bots.modelPick?.noise??0;let best=null;
 for(const m of owned){let x=fly({...kit,model:m},{key,n,profile,angle:intent[m]??P.bots.angleStart,charge,exact:true,events:false,w}).x;
  if(nz&&r)x*=Math.exp(nz*gauss(r));if(!best||x>best.x)best={model:m,x,w};}
 return best;
}
export const paperTiers=best=>{const W=P.workshop.paper,R=P.route,tiers=Math.ceil(W.prices.length/W.perTier);let t=1;
 for(let k=1;k<tiers;k++)if(best>=((k-1)*R.perDistrict+(W.openAtPlace??R.perDistrict+1)-1)*R.place)t=k+1;return t;};

// Kapsy: požadované speciály (pořadí = priorita), pak záložní. Nanejvýš 1 aktivní, Sharp Edge a Calm Sky se vylučují.
export function equip(owned,district,wanted,fallback=P.bots.pocketFallback){
 const out=[],U=P.pockets.unlock;
 for(const s of [...new Set([...wanted,...fallback])]){
  if(out.length>=owned)break;
  if(!(s in U)||district<U[s]||out.includes(s))continue;
  if(P.pockets.active.includes(s)&&out.some(x=>P.pockets.active.includes(x)))continue;
  if(P.pockets.exclusive.some(g=>g.includes(s)&&out.some(x=>g.includes(x))))continue;
  out.push(s);
 }
 return out;
}

// spec: {profile, strategy, pockets ('auto' | 'none' | 'dive+sharp' …), model ('better'|'preview'|id modelu), seed, id}
// model: 'better' = poslední dolety vlastněných modelů + zkouška modelExplore (dnešní MC), 'preview' = náhled v Dílně před hodem
// (pasivní let se známým větrem, bots.modelPick), id modelu = jen ten, pokud ho hráč vlastní.
export function campaign(spec){
 const profile=spec.profile??'average',strategy=spec.strategy??'balanced',pk=spec.pockets??'auto',modelRule=spec.model??'better';
 const key=`${spec.seed??1}|${profile}|${spec.id??0}`; // společná náhoda napříč strategiemi a kapsami (CRN)
 const sk=P.profiles[profile],rc=stream(key,'campaign'),bias=sk.qte/2*gauss(stream(key,'bias'));
 const wanted=pk==='auto'?P.bots.pocketAuto[profile]??[]:pk==='none'?[]:pk.split('+');
 const ids=Object.keys(P.models);
 const st={coins:0,power:0,folds:0,paper:0,atlas:{},pockets:0,best:0,throws:0,places:0,district:0,glider:false,model:'dart',owned:['dart'],
  intent:Object.fromEntries(ids.map(m=>[m,P.bots.angleStart])),last:Object.fromEntries(ids.map(m=>[m,null])),history:[],fallback:[],fbSig:''};
 const rp=stream(key,'modelpick');
 const rn=stream(key,'shopnoise');
 const R={profile,strategy,pockets:pk,model:modelRule,id:spec.id??0,done:false,real:0,sim:0,districts:[],flights:[],droughts:[],placeGaps:[],firstPocket:null,
  crane:{tugs:0,newPlace:0},gliderThrows:0,byModel:{},econ:{income:[0,0,0,0],spend:[0,0,0,0],kind:{}},eCap:0,betaCap:0,qte:{done:0,hits:0,perfect:0},dive:{uses:0,crash:0,low:0},buys:[],slotsUsed:{}};
 let drought=0,lastPlaceThrow=0,target=null;
 const kitOf=(o={})=>{const s={...st,...o};return {model:s.model,power:s.power,folds:s.folds,paper:s.paper,atlas:{...s.atlas},slots:equip(s.pockets,s.district,wanted,s.fallback)};};
 // Záloha kapes (AUDIT F2 #34): záložní speciál se nasadí, jen když náhled na posledních hodech ukáže kladný přínos.
 const refreshFallback=()=>{
  const sig=`${st.pockets}|${st.district}`;if(sig===st.fbSig)return;st.fbSig=sig;st.fallback=[];
  const hs=st.history.slice(-P.bots.fallbackThrows);if(!hs.length||!st.pockets)return;
  for(const c of P.bots.pocketFallback){const k0=kitOf(),k1=kitOf({fallback:[...st.fallback,c]});if(k1.slots.length===k0.slots.length)continue;
   let g=0;for(const h of hs)g+=throwOnce(k1,h).x-throwOnce(k0,h).x;if(g>0)st.fallback.push(c);}
 };
 // Nákupní nabídka: Dílna, úrovně Atlasu, kapsy.
 const offers=()=>{
  const W=P.workshop,o=[];
  for(const b of ['power','folds'])if(st[b]<W[b].prices.length)o.push({id:b,kind:'workshop',price:W[b].prices[st[b]],apply:x=>x[b]++});
  if(st.paper<Math.min(W.paper.prices.length,W.paper.perTier*paperTiers(st.best)))o.push({id:'paper',kind:'paper',price:W.paper.prices[st.paper],apply:x=>x.paper++});
  for(const [b,l] of Object.entries(st.atlas))if(l>=1&&l<3&&!P.atlas.unlevelled.includes(b))o.push({id:'atlas:'+b,kind:'atlas',price:P.atlas.prices[Math.floor(placeOf(b)/P.route.perDistrict)][l-1],apply:x=>x.atlas={...x.atlas,[b]:l+1}});
  if(pk!=='none'&&(st.pockets===0||st.pockets===1&&st.district>=P.pockets.secondFromDistrict))o.push({id:'pocket'+(st.pockets+1),kind:'pocket',price:P.pockets.prices[st.pockets],apply:x=>x.pockets++});
  if(strategy!=='no-models')for(const m of paidModels())if(!st.owned.includes(m)&&st.places>=P.models[m].unlockPlace)
   o.push({id:'model:'+m,kind:'model',model:m,price:P.models[m].price,apply:x=>x.owned=[...x.owned,m]});
  return o;
 };
 // Náhled U1: přehrání posledních hodů s novou úrovní, přínos v metrech.
 const gain=o=>{
  const hs=st.history.slice(-P.bots.previewThrows);if(!hs.length)return 0;
  const after={...st,atlas:{...st.atlas}};o.apply(after);
  // náhled kapsy ukáže hod s tím, co by do ní hráč nasadil (požadované speciály, jinak záložní), ne prázdnou kapsu
  if(o.kind==='pocket')after.fallback=P.bots.pocketFallback;
  // náhled modelu (U1, 01 §2.10): stejné hody s novým modelem a jeho úhlem záměru
  if(o.kind==='model')after.model=o.model;
  const k0=kitOf(),k1=kitOf(after),ang=o.kind==='model'?st.intent[o.model]:null;let g=0;
  for(const h of hs)g+=throwOnce(k1,ang==null?h:{...h,angle:ang}).x-throwOnce(k0,h).x;return g/hs.length;
 };
 const buy=o=>{st.coins-=o.price;o.apply(st);R.buys.push({throw:st.throws,id:o.id,price:o.price,kind:o.kind});
  R.econ.spend[st.district]+=o.price;R.econ.kind[o.kind]=(R.econ.kind[o.kind]??0)+o.price;if(o.kind==='pocket'&&R.firstPocket===null)R.firstPocket=st.throws;target=null;return 1;};
 const pickValue=os=>{let best=null;for(const o of os){o.value=(Math.max(0,gain(o))+1e-6)/o.price;if(!best||o.value>best.value)best=o;}return best;};
 const shop=()=>{
  let n=0;
  for(let guard=0;guard<40;guard++){
   const os=offers();if(!os.length)break;
   if(strategy==='random'){const af=os.filter(o=>o.price<=st.coins);if(!af.length)break;n+=buy(af[Math.floor(rc()*af.length)]);continue;}
   if(st.coins<Math.min(...os.map(o=>o.price)))break;
   let pick;
   const base=strategy==='paper-first'||strategy==='atlas-first'||MODEL_STRATEGIES.includes(strategy)?P.campaign.fallback:strategy;
   if(strategy==='cheapest')pick=os.reduce((a,b)=>b.price<a.price?b:a);
   else if(strategy==='paper-first'&&os.some(o=>o.kind==='paper'))pick=os.find(o=>o.kind==='paper');
   else if(strategy==='atlas-first'&&os.some(o=>o.kind==='atlas'))pick=os.filter(o=>o.kind==='atlas').reduce((a,b)=>b.price<a.price?b:a);
   else if(strategy==='models-first'&&os.some(o=>o.kind==='model'))pick=os.filter(o=>o.kind==='model').reduce((a,b)=>b.price<a.price?b:a);
   else if(base==='realistic'){
    // realistický hráč: náhled U1 vidí, ale přínos na minci odhaduje s chybou (log-normální, nový los při každém rozhodnutí)
    // a je netrpělivý: když by na vybranou věc čekal déle než patience hodů, koupí nejlepší z toho, na co už má
    const Rl=P.bots.realistic,b0=P.economy.reward.base,inc=Math.max(b0,st.lastReward??b0);
    for(const o of os)o.value=(Math.max(0,gain(o))+1e-6)/o.price*Math.exp(Rl.noise*gauss(rn))*(Rl.kind[o.kind]??1);
    const top=os.reduce((a,b)=>b.value>a.value?b:a);
    if(top.price<=st.coins)pick=top;
    else if((top.price-st.coins)/inc>Rl.patience){const af=os.filter(o=>o.price<=st.coins);if(!af.length)break;pick=af.reduce((a,b)=>b.value>a.value?b:a);}
    else break;
   }
   else{ // balanced: nejvyšší náhled na minci; když na cíl nestačí, šetří na něj (E09 „210 ◈ to go“)
    const sig=os.map(o=>o.id).join();
    if(target&&target.sig===sig){if(st.coins<target.price)break;pick=os.find(o=>o.id===target.id);}
    else{pick=pickValue(os);target={id:pick.id,price:pick.price,sig};}
   }
   if(st.coins<pick.price)break;n+=buy(pick);
  }
  return n;
 };
 const D=P.route.place*P.route.perDistrict;
 while(st.best<P.route.finish&&st.throws<P.campaign.maxThrows){
  // model: „better“ vezme vlastněný model s nejdelším posledním doletem (dosud nehozený zkusí hned) a s pravděpodobností modelExplore
  // zkusí jiný (se dvěma modely přesně dnešní pravidlo Dart/Glider); „preview“ podle náhledu v Dílně; id = pevný model, když ho vlastní
  const n=st.throws+1,o=st.owned;
  if(o.length>1&&modelRule!=='dart'){
   if(modelRule==='preview')st.model=previewModel(kitOf(),o,{key,n,profile,intent:st.intent,r:rp}).model;
   else if(modelRule!=='better'){if(o.includes(modelRule))st.model=modelRule;}
   else{const L=st.last;let m=o.find(x=>L[x]==null);if(!m){m=o[0];for(const x of o)if(L[x]>L[m])m=x;}
    if(rc()<P.bots.modelExplore){const others=o.filter(x=>x!==m);m=others.length===1?others[0]:others[Math.floor(rc()*others.length)];}st.model=m;}
  }
  const kit=kitOf(),ctx={key,n,profile,bias,angle:st.intent[st.model]};
  const f=throwOnce(kit,ctx),x=f.x,d0=st.district;
  st.throws=n;st.lastReward=reward(x);st.coins+=st.lastReward;st.best=Math.max(st.best,x);st.last[st.model]=x;
  st.history.push(ctx);if(st.history.length>8)st.history.shift();
  R.real+=f.real+P.time.ui;R.sim+=f.t;if(st.model==='glider')R.gliderThrows++;
  R.econ.income[d0]+=st.lastReward;const bm=R.byModel[st.model]??={throws:0,coins:0,real:0,x:0};bm.throws++;bm.coins+=st.lastReward;bm.real+=f.real+P.time.ui;bm.x+=x;
  R.eCap+=f.stats.eCap;R.betaCap+=f.stats.betaCap;R.qte.done+=f.stats.done;R.qte.hits+=f.stats.hits;R.qte.perfect+=f.stats.perfect;
  R.dive.uses+=f.stats.dive.uses;R.dive.crash+=f.stats.dive.crash;R.dive.low+=f.stats.dive.low;
  for(const s of kit.slots)R.slotsUsed[s]=(R.slotsUsed[s]??0)+1;
  R.flights.push([d0,+f.real.toFixed(2),+f.t.toFixed(2),Math.round(x)]);
  // nápověda úhlu po hodu (core.angleHint): do 3° sedí, jinak o kus / mnohem strměji či plošeji
  const best=bestAngle(kit,Math.round(f.charge*20)/20),dd=Math.round(f.angle)-best;
  if(Math.abs(dd)>3)st.intent[st.model]=clip(st.intent[st.model]-Math.sign(dd)*P.bots.angleStep[Math.abs(dd)>8?1:0],5,40);
  // Paper Crane (rozhodnutí 14. 10.): tah, který přenesl rekord přes začátek dosud neobjeveného místa
  if(f.stats.tug>0){R.crane.tugs++;const pl=v=>Math.min(P.route.places,Math.floor(Math.max(0,v)/P.route.place)+1),known=Math.max(1,st.places);
   if(pl(x)>known&&pl(x-f.stats.tug)<=known)R.crane.newPlace++;}
  // odemčení: Glider na 100 m, místo k (rekord ≥ začátek místa) dá bonus úr. 1, čtvrť otevře papír a kapsové speciály
  let novelty=false;
  if(!st.glider&&st.best>=P.atlas.gliderAt){st.glider=true;st.owned.push('glider');novelty=true;}
  const places=Math.min(P.route.places,Math.floor(st.best/P.route.place)+1);
  if(places>Math.max(1,st.places)){
   for(let k=Math.max(1,st.places)+1;k<=places;k++){const b=P.atlas.bonuses[k-1];if(!P.atlas.unlevelled.includes(b))st.atlas[b]=1;}
   R.placeGaps.push(n-lastPlaceThrow);lastPlaceThrow=n;novelty=true;
  }
  st.places=Math.max(st.places,places);
  const nd=districtOf(st.best);
  for(let k=st.district+1;k<=nd;k++)R.real+=P.time.districtCard;
  for(let k=R.districts.length;k<Math.min(4,Math.floor(st.best/D));k++)R.districts.push({throws:n,minutes:R.real/60});
  st.district=Math.max(st.district,nd);
  if(st.best>=P.route.finish){R.done=true;if(drought)R.droughts.push(drought);break;}
  if(shop())novelty=true;
  refreshFallback();
  if(novelty){if(drought)R.droughts.push(drought);drought=0;}else drought++;
 }
 if(!R.done&&drought)R.droughts.push(drought);
 R.throws=st.throws;R.minutes=R.real/60;R.best=Math.round(st.best);R.coins=st.coins;
 R.kit={power:st.power,folds:st.folds,paper:st.paper,atlas:st.atlas,pockets:st.pockets,models:st.owned};
 R.levelsBought=(st.power+st.folds+st.paper+Object.entries(st.atlas).filter(([b])=>!P.atlas.unlevelled.includes(b)).reduce((a,[,l])=>a+l-1,0))/totalLevels();
 return R;
}
