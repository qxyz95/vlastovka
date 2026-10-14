// Model letu 1.0 podle 08 §2.3: tempo π, posílení β, výtrysky, push E se stropem, styl S, y0, vítr se střihem,
// události (poryv, holub, pára, termika, dron, hvězda), plující střed, kombo, Atlas a mechanika schopností.
// Pevný krok DT jako ve hře. Hráčské vstupy (QTE bot) jsou tady, boti schopností v abilities.mjs.
import {random} from '../../src/random.js';
import {throwSettings,AIM_MIN,AIM_MAX} from '../../src/throw.js';
import {P} from './params.mjs';

export const hash=(...parts)=>{let h=2166136261;for(const c of parts.join('|')){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
export const stream=(...parts)=>random(hash(...parts));
export const gauss=r=>{let u=0;while(u===0)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r());};
export const clip=(v,a,b)=>Math.max(a,Math.min(b,v));
export const lv=(kit,k)=>kit.atlas?.[k]??0;
export const pace=paper=>1+P.workshop.paper.steps.slice(0,paper).reduce((a,b)=>a+b,0);
const TYPES=['gust','bird','steam','thermal','drone'],ACTIVE=['warning','interaction','effect'];

// Odvozené parametry výbavy (kit = {model,power,folds,paper,atlas:{bonus:úroveň},slots:[speciály]}).
export function derive(kit){
 const m=P.models[kit.model??'dart'],W=P.workshop,s=kit.slots??[],sharp=s.includes('sharp'),calm=s.includes('calm'),fo=kit.folds??0;
 return {m,pi:pace(kit.paper??0),speed:m.speed*(1+W.power.step*(kit.power??0)),steadyK:W.folds.steady*fo,
  windowK:(1+W.folds.window*fo)*(sharp?P.specials.sharp.window:1),foldsE:W.folds.push*fo,
  S:sharp?P.specials.sharp.S:calm?P.specials.calm.S:1,gapMul:(calm?P.specials.calm.gap:1)*P.events.gapScale,
  y0:P.physics.y0+P.atlas.crane*lv(kit,'crane'),active:s.find(x=>P.pockets.active.includes(x))??null};
}

function pickType(r,kit,avoid){
 const w=P.events.weights,opts=TYPES.filter(t=>t!==avoid&&(t==='gust'||t==='bird'||lv(kit,t)>0));
 let x=r()*opts.reduce((a,t)=>a+w[t],0);for(const t of opts){x-=w[t];if(x<0)return t;}return opts.at(-1);
}
// Rozvrh událostí letu (stream „events“). Náhodná čísla se berou v pevném pořadí, ať je rozvrh stabilní.
export function createEvents(kit,key,n,d){
 const r=stream(key,'events',n),E=P.events,F=E.floating,ramp=clip((n-F.rampFrom)/(F.rampTo-F.rampFrom),0,1),list=[];
 const sl=lv(kit,'star'),starRoll=r(),slotRoll=r(),starAt=sl&&starRoll<E.star.chance[sl-1]?E.star.slotMin+Math.floor(slotRoll*(E.star.slotMax-E.star.slotMin+1)):-1;
 while(list.length<E.maxEvents){
  const i=list.length,prev=list.slice(-2),avoid=prev.length===2&&prev[0].type===prev[1].type?prev[0].type:null;
  let type=pickType(r,kit,avoid);const g=r(),off=r(),tg=r(),pg=r(),fo=r();
  if(n===1&&i<2)type=i?'bird':'gust';
  const e={type,i,at:i===0?E.firstAt:Infinity,gap:(i<E.earlyCount?E.earlyGap:E.gapMin+E.gapSpread*g)*d.gapMul,phase:'waiting',result:null,heldAt:null,
   off:(2*off-1)*F.gust*ramp,target:E.timing.birdCenter+(F.birdMin+(F.birdMax-F.birdMin)*tg-E.timing.birdCenter)*ramp,
   puffGap:E.steam.gapMin+(E.steam.gapMax-E.steam.gapMin)*pg};
  list.push(e);
  // Termika úr. 3: druhý sloup, Dron úr. 3: dvojice. Vloží se jako další událost téhož typu s krátkým rozestupem.
  const follow=type==='thermal'&&lv(kit,'thermal')>=3&&fo<E.thermal.secondChance?E.thermal.followGap:type==='drone'&&lv(kit,'drone')>=3&&fo<E.drone.pairChance?E.drone.followGap:null;
  if(follow!==null&&list.length<E.maxEvents)list.push({...e,i:list.length,at:Infinity,gap:follow,follow:true});
 }
 // Shooting Star (oprava 4 z auditu F2, rozhodnutí 06): událost NAVÍC. Vloží se před běžnou událost č. starAt s krátkou
 // mezerou a běžný rozvrh po ní pokračuje, jako by tam nebyla (viz updateEvents), takže žádnou událost nevytlačí.
 if(starAt>=0){const pos=list.filter(e=>!e.follow).at(starAt),p=pos?list.indexOf(pos):-1;
  if(p>0)list.splice(p,0,{type:'star',i:100,at:Infinity,gap:E.star.gap*d.gapMul,phase:'waiting',result:null,heldAt:null,off:list[p].off,target:list[p].target,puffGap:list[p].puffGap,extra:true});}
 return {list,ramp};
}

const burstAt=(b,age)=>!b||age<0?0:b.shape==='flat'?(age<b.dur?b.amp:0):b.shape==='linear'?b.amp*Math.max(0,1-age/b.dur):b.amp*Math.exp(-age/b.tau);
export function setBurst(f,b,tag){f.burst={...b,t0:f.t,tag};f.stats.bursts[tag]=(f.stats.bursts[tag]??0)+1;}

// ctx: {key,n,profile,bias,angle,charge?,w?,events?=true,exact?}
export function createFlight(kit,ctx){
 const d=derive(kit),m=d.m,sk=P.profiles[ctx.profile??'average'],n=ctx.n??1,key=ctx.key??'k',A=P.atlas;
 const rl=stream(key,'launch',n),rw=stream(key,'wind',n);
 // vítr: los ze sady s vahami, Pinwheel přetáčí protivítr (bot přetočí vždy, když w < 0)
 const W=P.wind,draw=noHead=>{const idx=W.values.map((v,i)=>i).filter(i=>!noHead||W.values[i]>=0);let x=rw()*idx.reduce((a,i)=>a+W.weights[i],0);for(const i of idx){x-=W.weights[i];if(x<0)return W.values[i];}return W.values[idx.at(-1)];};
 let w=ctx.w??draw(false),rerolls=0;const pw=lv(kit,'pinwheel');
 // bot přetočí, když je nový los v průměru lepší než současný vítr (úr. 1–2: jen protivítr; úr. 3 bez protivětru: i bezvětří a slabý vítr do zad)
 const evW=nh=>{const idx=W.values.map((v,i)=>i).filter(i=>!nh||W.values[i]>=0),sw=idx.reduce((a,i)=>a+W.weights[i],0);return idx.reduce((a,i)=>a+W.values[i]*W.weights[i],0)/sw;};
 if(ctx.w==null&&pw){const nh=A.pinwheel.noHeadwind[pw-1],E=evW(nh)-1e-9;while(w<E&&rerolls<A.pinwheel.rerolls[pw-1]){w=draw(nh);rerolls++;}}
 // hod: síla ~ N(mu,sigma), úhel = záměr + N(0,angle); švih na vrcholu ukazatele od 4. hodu
 const g1=gauss(rl),g2=gauss(rl),charge=ctx.charge??clip(sk.mu+sk.sigma*g1,0,1),deg=(ctx.angle??m.ideal)+(ctx.exact?0:sk.angle*g2);
 const L=throwSettings(deg,charge),steady=L.power+(1-L.power)*d.steadyK,over=Math.max(0,L.angle*180/Math.PI-m.ideal),S=P.swing;
 const swing=n>=S.fromThrow&&charge>=(1-Math.cos((S.peak-S.zone)*Math.PI/1.15))/2;
 const speed=d.speed*(.7+.4*steady)*Math.max(.2,1-P.physics.steepPenalty*over*over)*(swing?S.gain:1);
 const ev=ctx.events===false?{list:[],ramp:0}:createEvents(kit,key,n,d);
 const ch=lv(kit,'chain'),sp=lv(kit,'skip'),mo=lv(kit,'momentum'),oa=lv(kit,'onAir'),pc=lv(kit,'paperCrane');
 return {kit,d,sk,ctx,key,n,x:0,y:d.y0,vx:speed*Math.cos(L.angle)*d.pi,vy:speed*Math.sin(L.angle),t:0,real:0,warp:1,carry:0,hoverT:0,glideT:0,
  w,rerolls,charge,angle:L.angle*180/Math.PI,swing,beta:0,cruise:m.cruise*d.pi,glide:m.glide*d.pi,burst:null,echoes:[],combo:0,lastResolved:-9,
  events:ev.list,ramp:ev.ramp,landed:false,timeout:false,dive:null,abil:{},bias:ctx.bias??0,auto:!!sk.auto,assist:sk.assist??null,
  comboSpec:ch?A.chain[ch-1]:{step:P.combo.step,max:P.combo.max},skips:sp?A.skip.bounces[sp-1]+(m.skip??0):0,skipKeep:sp?A.skip.keep[sp-1]:0,
  mom:mo?{step:A.momentum.step[mo-1],cap:A.momentum.cap[mo-1]}:null,onAirB:oa?A.onAir.beta[oa-1]:0,tape:lv(kit,'tape')?A.tape[lv(kit,'tape')-1]:0,
  echo:lv(kit,'echo')?A.echo.share[lv(kit,'echo')-1]:0,reach:pc?A.paperCrane.reach[pc-1]*P.route.place:0,craneUsed:false,
  gull:lv(kit,'gull')?{carry:A.gull.carry[lv(kit,'gull')-1],push:A.gull.push[lv(kit,'gull')-1]}:null,
  stats:{done:0,hits:0,perfect:0,miss:0,types:{},comboMax:0,eCap:false,betaCap:false,eMax:0,betaMax:0,bursts:{},skips:0,tug:0,star:{seen:0,hit:0},
   dive:{uses:0,crash:0,low:0,high:0},cushion:{used:0,band:null},rocket:0,whistle:0}};
}

export const activeEvent=f=>f.landed?null:f.events.find(e=>ACTIVE.includes(e.phase))??null;
// Okna a časy události v absolutním čase letu (spočítané při začátku varování).
// Událost přivolaná pískáním (e.whistled) má okna úspěchu i perfektu ×specials.whistle.window (rozhodnutí 14. 10., risk za odměnu);
// časy (varování, střed, kontakt dronu) a sloup termiky zůstávají. window = 1 → chování F3.
function windowsOf(f,e){
 const T=P.events.timing,E=P.events,k=f.d.windowK*(f.assist?.window??1)*(e.whistled?P.specials.whistle.window:1),w=T.warning;
 switch(e.type){
  case 'gust':return {open:e.at+w,close:e.at+w+T.bar,c:e.at+T.gustCenter+e.off,s:T.gustSuccess*k,p:T.gustPerfect*k};
  case 'bird':return {open:e.at+w,close:e.at+w+T.bar,c:e.target,s:T.birdSuccess*k,p:T.birdPerfect*k};
  case 'steam':{const c1=e.at+E.steam.firstPuff,s=T.gustSuccess*E.steam.window*k;return {open:e.at+w,c:[c1,c1+e.puffGap],close:c1+e.puffGap+s,s,p:T.gustPerfect*E.steam.window*k};}
  case 'thermal':{const c=e.at+E.thermal.warning+E.thermal.column;return {open:c-E.thermal.column,close:c+E.thermal.column,c,s:E.thermal.core*k,p:(E.thermal.perfect??0)*k,col:E.thermal.column};} // p: perfekt termiky (14. 10.), 0 = bez perfektu
  case 'drone':{const contact=e.at+w+T.bar,dk=lv(f.kit,'drone')>=2?E.drone.levelWindow:1;return {open:e.at+w,close:contact,c:contact-E.drone.lead,s:T.gustSuccess*k*dk,p:T.gustPerfect*k*dk};}
  case 'star':return {open:e.at+w,close:e.at+w+T.bar,c:e.at+T.gustCenter+e.off,s:T.gustPerfect*E.star.window*k,p:T.gustPerfect*E.star.window*k};
 }
}
// Předčasný stisk do earlyGrace před oknem úspěchu se počítá jako okraj okna (08 Z4).
function gradeTap(t,c,s,p){const dd=Math.abs(t-c);return dd<=p+1e-9?'perfect':dd<=s+1e-9?'success':t<c-s&&t>=c-s-P.events.earlyGrace-1e-9?'success':'miss';}

function comboBonus(f){return Math.min(f.combo,f.comboSpec.max)*f.comboSpec.step;}
// Účinek zásahu: svislá část pevně (× model.qte), vodorovný push 1,5·π·(1+E)·perfekt·S·typ.
// Pole modelu (01 §2.9): liftK násobí svislou část poryvu, páry a termiky, pushK vodorovný push, perfectK nahrazuje push.perfect
// jen ve vodorovném pushi, droneBurst = dron bez svislé části a push dronu ×droneBurst. Chybějící pole = beze změny.
// Perfekt termiky (14. 10.) násobí jen push (perf v dvx) a dá kombo +2 a Echo; zdvih sloupu (dvy) je stejný jako u úspěchu
// (výklad: sloup zvedá stejně, střed jádra odměňuje rychlostí; obdobně pára, kde perf zdvih nemění).
export function effect(f,e,grade,share,withCombo){
 const E=P.events,m=f.d.m,q=m.qte,perf=grade==='perfect'?P.push.perfect:1,t=e.type,lift=m.liftK??1;
 let typeMul=E[t].push??1;
 if(t==='gust')f.vy+=E.gust.dvy*q*perf*share*lift;
 if(t==='bird'){f.carry=(grade==='perfect'?E.bird.carryPerfect:E.bird.carry)*q*(1+(f.gull?.carry??0))*share;f.vx=Math.max(E.bird.minVx,f.vx);f.vy=Math.max(E.bird.minVy,f.vy);}
 if(t==='steam'){f.vy+=E.steam.lift*q*(grade==='partial'?1:2)*share*lift;typeMul=grade==='partial'?E.steam.pushPartial:E.steam.pushFull;}
 if(t==='thermal'){const h=grade==='half'?E.thermal.half:1;f.vy+=E.thermal.dvy*q*h*share*lift;typeMul=E.thermal.push*h;}
 if(t==='drone'){if(m.droneBurst)typeMul*=m.droneBurst;else f.vy+=E.drone.dvy*q*perf*share;}
 const own=(t==='steam'||t==='thermal')&&lv(f.kit,t)>=2?E[t].levelPush:0;
 const raw=f.d.foldsE+(withCombo?comboBonus(f):0)+(t==='bird'?(f.gull?.push??0):0)+own;
 if(raw>P.caps.E+1e-9)f.stats.eCap=true;f.stats.eMax=Math.max(f.stats.eMax,raw);
 // scaleWithPace=false = varianta sond 08 (sim3/camp2): základ 1,5 bez π, přírůstek z E se násobí π (AUDIT F2).
 const perfH=grade==='perfect'?m.perfectK??P.push.perfect:1;
 const dvx=P.push.base*((P.push.scaleWithPace?f.d.pi:1)+f.d.pi*Math.min(P.caps.E,raw))*perfH*f.d.S*typeMul*share*(m.pushK??1);
 f.vx+=dvx;return dvx;
}
function resolve(f,e,grade){
 if(e.result)return null;
 e.result=grade;e.phase='effect';f.lastResolved=f.t;const st=f.stats,ok=grade!=='miss';
 st.done++;st.types[e.type]??={n:0,hit:0};st.types[e.type].n++;
 if(e.type==='star'){st.star.seen++;if(ok){st.star.hit++;st.hits++;st.types.star.hit++;setBurst(f,P.events.star.burst,'star');f.combo+=P.combo.star;}else f.combo=0;}
 else if(!ok){st.miss++;f.combo=0;if(f.d.m.missK)f.vx*=1-f.d.m.missK;if(f.tape)effect(f,e,'success',f.tape,false);}
 else {
  st.hits++;st.types[e.type].hit++;if(grade==='perfect')st.perfect++;
  const dvx=effect(f,e,grade,1,true);
  f.combo+=grade==='perfect'?P.combo.perfect:grade==='success'?P.combo.success:P.combo.partial;
  if(grade==='perfect'&&f.echo)f.echoes.push({at:f.t+P.atlas.echo.delay,dvx:dvx*f.echo});
  if(e.type==='steam'&&grade==='perfect'&&lv(f.kit,'steam')>=3)setBurst(f,P.events.steam.burst,'steam');
 }
 st.comboMax=Math.max(st.comboMax,f.combo);
 e.doneAt=f.t+Math.max(P.events.effectMin,e.type==='bird'?f.carry:0);
 return grade;
}
// Vstupy hráče do aktuální události. null = ignorováno (varování), hráč zkusí znovu.
export function press(f){
 const e=activeEvent(f);if(!e||e.result||e.phase!=='interaction')return null;const w=e.w,t=f.t;
 if(e.type==='bird'){if(e.heldAt!==null)return null;e.heldAt=t;return 'holding';}
 if(e.type==='steam'){const g=gradeTap(t,w.c[e.puff],w.s,w.p);e.puffs.push(g);e.puff++;return e.puff===2?finishSteam(f,e):g;}
 if(e.type==='thermal'){const dd=Math.abs(t-w.c),early=t<w.c-w.s&&t>=w.c-w.s-P.events.earlyGrace-1e-9;return resolve(f,e,w.p>0&&dd<=w.p+1e-9?'perfect':dd<=w.s+1e-9||early?'success':dd<=w.col+1e-9?'half':'miss');} // perfekt = střed jádra (14. 10.); předčasný stisk před jádrem = okraj jádra (Z4, AUDIT F2)
 if(e.type==='star'){const g=gradeTap(t,w.c,w.s,w.p);return resolve(f,e,g==='miss'?'miss':'perfect');}
 return resolve(f,e,gradeTap(t,w.c,w.s,w.p));
}
export function release(f){const e=activeEvent(f);if(!e||e.type!=='bird'||e.heldAt===null||e.result)return null;return resolve(f,e,gradeTap(f.t-e.heldAt,e.w.c,e.w.s,e.w.p));}
function finishSteam(f,e){const hits=e.puffs.filter(g=>g!=='miss').length;return resolve(f,e,hits===2?(e.puffs.every(g=>g==='perfect')?'perfect':'success'):hits===1?'partial':'miss');}

function startEvent(f,e){
 if(f.dive)pullUp(f);
 e.phase='warning';e.w=windowsOf(f,e);if(e.type==='steam'){e.puff=0;e.puffs=[];}
 // plán hráče pro tuto událost: vlastní stream (stejný šum při přehrání s jinou výbavou)
 const r=stream(f.key,'plan',f.n,e.i),sk=f.sk,ns=f.assist?.noise??1,sd=sk.qte*ns,b=f.bias,n1=gauss(r),n2=gauss(r),fl=1+P.events.floating.readNoise*f.ramp,w=e.w;
 e.plan={k:0,press:e.type==='bird'?[w.open+Math.max(-.5,sk.react*ns+sd*1.2*n2)]:e.type==='steam'?[w.c[0]+b+sd*n1,w.c[1]+b+sd*n2]:[w.c+b+sd*(e.type==='gust'?fl:1)*n1],
  hold:e.type==='bird'?w.c+b+sd*fl*n1:0};
 // výpadek pozornosti (F3): s pravděpodobností lapse hráč na událost nezareaguje vůbec (los až za šumem, CRN drží)
 if(r()<(sk.lapse??0))e.plan.press=[];
}
export function updateEvents(f){
 const E=P.events,T=E.timing,t=f.t;
 if(f.landed){for(const e of f.events)if(e.phase!=='done'){if(!e.result&&e.phase!=='waiting')e.result='interrupted';e.phase='done';}f.carry=0;return;}
 for(let i=0;i<f.events.length;i++){
  const e=f.events[i];
  // pod 8 m události nezačínají; držený Dive odloží začátek nejvýš o waitMax, pak se vlaštovka sama vybere
  if(e.phase==='waiting'&&t>=e.at&&f.y>=P.physics.eventMinY&&(!f.dive||t>=e.at+P.specials.dive.waitMax))startEvent(f,e);
  if(e.phase==='warning'&&t>=e.w.open-1e-9)e.phase='interaction';
  if(e.phase==='interaction'&&!e.result){
   if(e.type==='steam'){while(e.puff<2&&t>e.w.c[e.puff]+e.w.s+1e-9){e.puffs.push('miss');e.puff++;}if(e.puff===2)finishSteam(f,e);}
   else if(e.type==='bird'){if(e.heldAt===null?t>e.w.close+1e-9:t>e.heldAt+T.bar+1e-9)resolve(f,e,'miss');}
   else if(t>e.w.close+1e-9)resolve(f,e,'miss');
  }
  if(e.phase==='effect'&&t>=e.doneAt){e.phase='done';const next=f.events[i+1];
   if(next?.extra){next.at=e.doneAt+next.gap;next.base=e.doneAt;}
   // po události navíc běží rozvrh od konce předchozí běžné události; jen když by se překrývaly, posune se o E.star.after
   else if(next)next.at=e.extra&&e.base!=null?Math.max(e.base+next.gap,e.doneAt+E.star.after):e.doneAt+next.gap;}
 }
}
// QTE bot: stiskne podle plánu, stisk ve varování hra ignoruje → zkusí znovu za retry. Auto (DQ-14) dá úspěch ve středu.
export function playerEvents(f){
 const e=activeEvent(f);if(!e||e.result||e.phase==='effect')return;const pl=e.plan,t=f.t;
 if(f.auto){if(e.phase!=='interaction')return;
  if(e.type==='bird'){if(e.heldAt===null)press(f);else if(t>=e.heldAt+e.w.c)resolve(f,e,'success');return;}
  const c=e.type==='steam'?e.w.c[1]:e.w.c;if(t>=c)e.type==='star'?resolve(f,e,'perfect'):resolve(f,e,'success');return;}
 if(e.type==='bird'&&e.heldAt!==null){if(t>=e.heldAt+pl.hold)release(f);return;}
 if(pl.k<pl.press.length&&t>=pl.press[pl.k]){if(press(f)===null&&!e.result&&e.phase!=='interaction')pl.press[pl.k]+=P.events.retry;else pl.k++;}
}

// Schopnosti (mechanika; rozhodují boti v abilities.mjs). Jedno tlačítko: mimo varování/interakci a 0,3 s po vyhodnocení.
export const canAct=f=>!f.landed&&!f.events.some(e=>e.phase==='warning'||e.phase==='interaction')&&f.t>=f.lastResolved+.3;
export function startDive(f){if(f.dive||!canAct(f))return false;f.dive={t0:f.t,y0:f.y,gain:0,vy0:f.vy};f.stats.dive.uses++;return true;}
export function pullUp(f){
 // Oprava 1 z auditu F2 (06): převádí se jen rychlost nabraná střemhlavem (f.dive.gain, doznívá stejně jako vx),
 // ne celý přebytek vx − cruise, ve kterém je i push událostí. Zbytek přebytku zůstává beze změny.
 if(!f.dive)return;const D=P.specials.dive,low=f.y>=D.low[0]&&f.y<=D.low[1],ex=D.fromDiveOnly?clip(f.dive.gain,0,Math.max(0,f.vx-f.cruise)):f.vx-f.cruise;
 // Svislá část: 08 má max(vy,0), tj. vybrání vynuluje i běžné klesání, což dá zisk bez střemhlavu (ťukání = vznášení).
 // V duchu opravy 1 se vy vrací nejvýš na hodnotu ze začátku ponoření (fromDiveOnly), zisk nese jen konverze ex.
 const floor=D.fromDiveOnly?Math.min(0,f.dive.vy0):0;
 f.vy=Math.max(f.vy,floor)+(low?D.lowConv:D.conv)*ex/f.d.pi;f.vx-=(1-D.keep)*ex;
 if(low){f.stats.dive.low++;setBurst(f,D.lowBurst,'lowPass');}else if(f.y>8)f.stats.dive.high++;
 f.dive=null;
}
export function cushion(f){
 const C=P.specials.cushion;if(f.abil.cushion||!canAct(f)||f.y>C.maxY)return false;f.abil.cushion=true;f.stats.cushion.used++;
 if(f.y<=C.perfectY){f.hoverT=C.perfectT;f.stats.cushion.band='perfect';}else if(f.y<=C.midY){f.hoverT=C.midT;f.stats.cushion.band='mid';}else{f.glideT=C.glideT;f.stats.cushion.band='high';}
 return true;
}
export function whistle(f){
 if((f.abil.whistle??0)>=P.specials.whistle.uses||!canAct(f)||activeEvent(f))return false;
 const next=f.events.find(e=>e.phase==='waiting');if(!next||!(next.at>f.t))return false;
 next.at=f.t;next.whistled=true;f.abil.whistle=(f.abil.whistle??0)+1;f.stats.whistle++;return true;
}
export function rocket(f){const R=P.specials.rocket;if((f.abil.rocket??0)>=R.charges||!canAct(f))return false;f.abil.rocket=(f.abil.rocket??0)+1;f.stats.rocket++;setBurst(f,{amp:R.amp,tau:R.tau,shape:'exp'},'rocket');return true;}
export const burstLeft=f=>f.burst?burstAt(f.burst,f.t-f.burst.t0):0;

// Jeden krok fyziky (dnešní arkádový model + π, β, výtrysk, vítr se střihem, Dive, Cushion, Stone Skip, Paper Crane).
export function step(f){
 if(f.landed)return;
 const dt=P.physics.dt,d=f.d,m=d.m,g=P.physics.gravity,st=f.stats;
 for(const ec of f.echoes)if(!ec.done&&f.t>=ec.at){f.vx+=ec.dvx;ec.done=true;st.bursts.echo=(st.bursts.echo??0)+1;}
 const places=Math.floor(f.x/P.route.place),raw=(f.mom?Math.min(f.mom.cap,f.mom.step*places):0)+(f.onAirB&&f.combo>=P.atlas.onAir.combo?f.onAirB:0);
 if(raw>P.caps.beta+1e-9)st.betaCap=true;st.betaMax=Math.max(st.betaMax,raw);f.beta=Math.min(P.caps.beta,raw);
 const cruise=m.cruise*d.pi*(1+f.beta),glide=m.glide*d.pi*(1+f.beta)*(f.glideT>0?P.specials.cushion.glide:1);f.cruise=cruise;f.glide=glide;
 const wx=f.w*(m.windK??1)*m.cruise*d.pi*Math.min(1,Math.max(0,f.y)/P.wind.shear); // windK (01 §2.9) násobí vítr, ne rychlost
 const ox=f.x,oy=f.y,ovx=f.vx,ovy=f.vy;let h=dt;
 if(f.carry>0){const c=Math.min(dt,f.carry);f.x+=f.vx*c;f.y+=f.vy*c;f.carry-=c;h=dt-c;}
 if(h>1e-10){
  const air=f.vx-wx;f.vx=wx+cruise+(air-cruise)*Math.exp(-m.drag*h);
  if(f.dive){const D=P.specials.dive;f.dive.gain=f.dive.gain*Math.exp(-m.drag*h)+D.accel*d.pi*h;f.vx+=D.accel*d.pi*h;f.vy-=g*D.gravity*h;
   if(D.maxSink!=null){const sink=-D.maxSink*Math.max(0,f.vx-wx)/glide;if(f.vy<sink)f.vy=sink;}} // strop střemhlavu = maxSink × běžné klesání (14. 10.), null = bez stropu
  else if(f.hoverT>0)f.vy=Math.max(0,f.vy-g*h);
  else{f.vy-=g*h;const gl=m.ground&&f.y<m.ground.below?glide*m.ground.glide:glide,sink=-Math.max(0,f.vx-wx)/gl;if(f.vy<sink)f.vy=sink;} // ground (01 §2.4): pod below m klesá pomaleji
  f.x+=f.vx*h;f.y+=f.vy*h;
 }
 if(f.burst)f.x+=burstAt(f.burst,f.t-f.burst.t0)*cruise*dt;
 f.hoverT=Math.max(0,f.hoverT-dt);f.glideT=Math.max(0,f.glideT-dt);f.t+=dt;
 if(f.y<=0){
  const a=oy/(oy-f.y);f.x=ox+(f.x-ox)*a;f.vx=ovx+(f.vx-ovx)*a;f.vy=ovy+(f.vy-ovy)*a;f.t-=dt*(1-a);f.y=0;
  if(f.dive){st.dive.crash++;f.dive=null;}
  const S=P.atlas.skip,vEff=f.vx+(f.burst?burstAt(f.burst,f.t-f.burst.t0)*cruise:0);
  if(st.landV==null)st.landV=vEff/cruise;
  // Oprava 3 z F2 (06): první odraz jen při rychlém dopadu (efektivní vodorovná rychlost vč. výtrysku > minVx·cruise),
  // další odrazy úr. 3 už jen s původní podmínkou chainVx (kámen, který se jednou odrazil, skáče dál).
  if(f.skips>0&&vEff>(st.skips?S.chainVx:S.minVx)*cruise){f.skips--;st.skips++;f.y=.01;f.vy=S.vy;f.vx*=f.skipKeep;}
  else{
   if(f.reach&&!f.craneUsed){const B=Math.ceil(f.x/P.route.place-1e-9)*P.route.place,gap=B-f.x;if(gap>1e-6&&gap<=f.reach){f.craneUsed=true;st.tug=gap+.01;f.x=B+.01;}}
   f.landed=true;
  }
 }
}
// Skutečný čas: klidné klouzání (žádná událost, další nezačne do 1 s, vlaštovka klesá) běží warp×, náběh ramp s.
function realTime(f){
 const W=P.warp,dt=P.physics.dt,e=activeEvent(f),next=f.events.find(x=>x.phase==='waiting');
 const calm=!e&&!f.dive&&f.vy<0&&(!next||next.at>f.t+W.lookahead),target=calm?W.factor:1,rate=(W.factor-1)/W.ramp*dt;
 f.warp=target>f.warp?Math.min(target,f.warp+rate):Math.max(target,f.warp-rate);
 const slow=f.assist?.slow&&e&&(e.phase==='warning'||e.phase==='interaction')?f.assist.slow:1;
 f.real+=dt/f.warp/slow;
}
// Celý hod. bots = funkce (f)=>void volané každý krok před fyzikou (schopnosti).
export function fly(kit,ctx,bots=[]){
 const f=createFlight(kit,ctx);
 while(!f.landed&&f.t<P.physics.maxT){playerEvents(f);for(const b of bots)b(f);step(f);updateEvents(f);realTime(f);}
 if(!f.landed){f.timeout=true;f.landed=true;updateEvents(f);}
 return f;
}
// Úhel nejdelšího pasivního letu (bez událostí, bezvětří), mřížka 1° jako bestAngle ve hře. Nezávisí na π (08 §2.1 závěr 3).
const angleCache=new Map();
export function bestAngle(kit,charge){
 const k=[kit.model??'dart',kit.power??0,kit.folds??0,lv(kit,'crane'),charge.toFixed(2),JSON.stringify(P.models),JSON.stringify(P.physics),P.atlas.crane,P.workshop.power.step,P.workshop.folds.steady].join('|'); // klíč nese vše, co let bez událostí ovlivní (AUDIT F2)
 if(angleCache.has(k))return angleCache.get(k);
 const base={model:kit.model,power:kit.power,folds:kit.folds,paper:0,atlas:{crane:lv(kit,'crane')}};let best={a:AIM_MIN,x:-1};
 for(let a=AIM_MIN;a<=AIM_MAX;a++){const f=fly(base,{angle:a,charge,exact:true,events:false,w:0,n:1});if(f.x>best.x)best={a,x:f.x};}
 angleCache.set(k,best.a);return best.a;
}
