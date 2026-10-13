import {random} from './random.js';
// Effect sizes before the model's `qte` multiplier.
export const HELP={gustX:1.5,gustY:2,perfect:1.25,birdTime:.8,birdPerfect:1.1};
// Timing in seconds. Gust: tap relative to event start (warning .8 s, then 1.2 s bar).
// Bird: hold length. Half-widths scale with the fold upgrade (f.p.window).
export const TIMING={warning:.8,bar:1.2,gustCenter:1.4,gustSuccess:.28,gustPerfect:.1,birdCenter:.75,birdSuccess:.25,birdPerfect:.1,maxEvents:10};
export function createEvents(seed,tutorial=false){
 const rng=random(seed),events=[];
 for(let i=0;i<TIMING.maxEvents;i++){
  let type=rng()<.5?'gust':'bird';
  if(tutorial&&i<2)type=i?'bird':'gust';
  if(i>=2&&events[i-1].type===type&&events[i-2].type===type)type=type==='gust'?'bird':'gust';
  events.push({type,at:i===0?1.5:Infinity,gap:i<3?3:4+3*rng(),phase:'waiting',heldAt:null,owner:null,result:null,doneAt:null});
 }
 return events;
}
export function windows(f){
 const k=f?.p?.window??1;
 return {gust:{center:TIMING.gustCenter,success:TIMING.gustSuccess*k,perfect:TIMING.gustPerfect*k},
  bird:{center:TIMING.birdCenter,success:TIMING.birdSuccess*k,perfect:TIMING.birdPerfect*k}};
}
const grade=(delta,w)=>delta<=w.perfect+1e-9?'perfect':delta<=w.success+1e-9?'success':'miss';
export function activeEvent(f){return f&&!f.landed?f.events.find(e=>['warning','interaction','effect'].includes(e.phase))??null:null;}
function resolve(f,e,result){
 if(e.result)return null;
 e.result=result;e.owner=null;e.phase='effect';e.resolvedAt=f.t;
 if(result==='success'||result==='perfect'){
  const q=f.p.qte??1;
  if(e.type==='gust'){const k=(result==='perfect'?HELP.perfect:1)*q;f.vx+=HELP.gustX*k;f.vy+=HELP.gustY*k;}
  else {f.carry=(result==='perfect'?HELP.birdPerfect:HELP.birdTime)*q;f.vx=Math.max(10,f.vx);f.vy=Math.max(.4,f.vy);}
 }
 e.doneAt=f.t+Math.max(1,e.type==='bird'?f.carry:0);
 f.feedback={success:'✓ Úspěch',perfect:'★ Perfektní',miss:'○ Bez bonusu'}[result];f.feedbackUntil=f.t+1;
 return result;
}
export function updateEvents(f){
 if(f.landed){for(const e of f.events)if(e.phase!=='done'){if(!e.result)e.result='interrupted';e.phase='done';e.owner=null;}f.carry=0;return;}
 for(let i=0;i<f.events.length;i++){
  const e=f.events[i];
  if(e.phase==='waiting'&&f.t>=e.at)e.phase='warning';
  if(e.phase==='warning'&&f.t>=e.at+TIMING.warning)e.phase='interaction';
  if(e.phase==='interaction'&&!e.result&&f.t>(e.heldAt===null?e.at+TIMING.warning+TIMING.bar:e.heldAt+TIMING.bar)+1e-9)resolve(f,e,'miss');
  if(e.phase==='effect'&&f.t>=e.doneAt){e.phase='done';const next=f.events[i+1];if(next)next.at=e.doneAt+next.gap;}
 }
}
export function eventInput(f,kind,owner='key'){
 if(!f||f.landed)return null;
 updateEvents(f);const e=activeEvent(f);if(!e||e.result)return null;
 if(kind==='cancel'){return e.heldAt!==null&&e.owner===owner?resolve(f,e,'miss'):null;}
 if(kind==='down'){
  // Pressing during the warning is ignored, so anticipating never costs the attempt.
  if(e.heldAt!==null||e.phase!=='interaction')return null;
  if(e.type==='bird'){e.heldAt=f.t;e.owner=owner;return 'holding';}
  const w=windows(f).gust;return resolve(f,e,grade(Math.abs(f.t-e.at-w.center),w));
 }
 if(kind==='up'&&e.type==='bird'&&e.heldAt!==null&&e.owner===owner){const w=windows(f).bird;return resolve(f,e,grade(Math.abs(f.t-e.heldAt-w.center),w));}
 return null;
}
export function eventProgress(f,e){return Math.max(0,Math.min(1,(e.type==='bird'?(e.heldAt===null?0:f.t-e.heldAt):f.t-e.at-TIMING.warning)/TIMING.bar));}
export function eventStats(f){const done=f.events.filter(e=>['success','perfect','miss'].includes(e.result));return {completed:done.length,hits:done.filter(e=>e.result!=='miss').length,perfect:done.filter(e=>e.result==='perfect').length};}
