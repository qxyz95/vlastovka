import {random} from './random.js';
export const HELP={gustX:1.5,gustY:.5,perfect:1.25,birdTime:.8,birdPerfect:1.1};
export function createEvents(seed,tutorial=false){
 const rng=random(seed),events=[];
 for(let i=0;i<6;i++){
  let type=rng()<.5?'gust':'bird';
  if(tutorial&&i<2)type=i?'bird':'gust';
  if(i>=2&&events[i-1].type===type&&events[i-2].type===type)type=type==='gust'?'bird':'gust';
  events.push({type,at:i===0?1.5:Infinity,gap:i<3?3:10+4*rng(),phase:'waiting',heldAt:null,owner:null,result:null,doneAt:null});
 }
 return events;
}
export function activeEvent(f){return f&&!f.landed?f.events.find(e=>['warning','interaction','effect'].includes(e.phase))??null:null;}
function resolve(f,e,result){
 if(e.result)return null;
 e.result=result;e.owner=null;e.phase='effect';e.resolvedAt=f.t;
 if(result==='success'||result==='perfect'){
  if(e.type==='gust'){const k=result==='perfect'?HELP.perfect:1;f.vx+=HELP.gustX*k;f.vy+=HELP.gustY*k;}
  else {f.carry=result==='perfect'?HELP.birdPerfect:HELP.birdTime;f.vx=Math.max(10,f.vx);f.vy=Math.max(.4,f.vy);}
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
  if(e.phase==='warning'&&f.t>=e.at+.8)e.phase='interaction';
  if(e.phase==='interaction'&&!e.result&&f.t>(e.heldAt===null?e.at+2:e.heldAt+1.2)+1e-9)resolve(f,e,'miss');
  if(e.phase==='effect'&&f.t>=e.doneAt){e.phase='done';const next=f.events[i+1];if(next)next.at=e.doneAt+next.gap;}
 }
}
export function eventInput(f,kind,owner='key'){
 if(!f||f.landed)return null;
 updateEvents(f);const e=activeEvent(f);if(!e||e.result)return null;
 if(kind==='cancel'){return e.heldAt!==null&&e.owner===owner?resolve(f,e,'miss'):null;}
 if(kind==='down'){
  if(e.heldAt!==null)return null;
  if(e.phase==='warning')return resolve(f,e,'miss');
  if(e.type==='bird'){e.heldAt=f.t;e.owner=owner;return 'holding';}
  const delta=Math.abs(f.t-e.at-1.4);return resolve(f,e,delta<=.06+1e-9?'perfect':delta<=.2+1e-9?'success':'miss');
 }
 if(kind==='up'&&e.type==='bird'&&e.heldAt!==null&&e.owner===owner){const t=f.t-e.heldAt;return resolve(f,e,t>=.69-1e-9&&t<=.81+1e-9?'perfect':t>=.55-1e-9&&t<=.95+1e-9?'success':'miss');}
 return null;
}
export function eventProgress(f,e){return Math.max(0,Math.min(1,(e.type==='bird'?(e.heldAt===null?0:f.t-e.heldAt):f.t-e.at-.8)/1.2));}
export function eventStats(f){const done=f.events.filter(e=>['success','perfect','miss'].includes(e.result));return {completed:done.length,hits:done.filter(e=>e.result!=='miss').length,perfect:done.filter(e=>e.result==='perfect').length};}
