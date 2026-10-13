import {DT, parameters, PRICES} from './config.js';
import {random} from './random.js';
export {random} from './random.js';
import {createEvents,updateEvents,eventInput} from './events.js';
export {activeEvent,eventInput} from './events.js';
export function fresh() {return {version:2,coins:0,levels:{dart:{power:0,paper:0,fold:0},glider:{power:0,paper:0,fold:0}},model:'dart',best:0,completed:false,attempts:0};}
export function buy(p, branch, level) {
  const levels=p.levels[p.model];
  if (p.model==='glider'&&p.best<100) return false;
  if (!(branch in levels) || level!==levels[branch]+1 || level>5 || p.coins<PRICES[level-1]) return false;
  p.coins-=PRICES[level-1]; levels[branch]=level; return true;
}
export function createFlight(model='dart',levels=fresh().levels.dart,seed=1,wind={x:0,y:0},launch=null) {
  const p=parameters(model,levels);
  if(launch){p.speed*=launch.multiplier;p.angle=launch.angle;}
  return {x:0,y:12,startX:0,vx:p.speed*Math.cos(p.angle),vy:p.speed*Math.sin(p.angle),t:0,p,model,wind,launch,landed:false,settled:false,carry:0,seed,events:createEvents(seed,seed===1),feedback:''};
}
export function forces(vx,vy,p,wind={x:0,y:0}) {
  const ax=vx-wind.x, ay=vy-wind.y, v=Math.hypot(ax,ay);
  if(v<1e-10) return {x:0,y:-p.mass*p.gravity};
  const q=0.5*p.rho*v*v*p.area;
  return {x:q*(-p.cd*ax-p.cl*ay)/v,y:q*(-p.cd*ay+p.cl*ax)/v-p.mass*p.gravity};
}
export function action(f){return eventInput(f,'down');}
export function step(f,dt=DT) {
  if(f.landed) return;
  const old={x:f.x,y:f.y,vx:f.vx,vy:f.vy};
  if(f.carry>0) {const h=Math.min(dt,f.carry); f.x+=f.vx*h; f.y+=f.vy*h; f.carry-=h; if(dt-h>1e-10) integrate(f,dt-h);}
  else integrate(f,dt);
  f.t+=dt;
  if(f.y<=0) {const alpha=old.y/(old.y-f.y); f.x=old.x+(f.x-old.x)*alpha; f.vx=old.vx+(f.vx-old.vx)*alpha;f.vy=old.vy+(f.vy-old.vy)*alpha;f.t-=dt*(1-alpha); f.y=0; f.landed=true;}
  updateEvents(f);
}
// Explicit midpoint: small numerical error, no artificial energy clamp.
function integrate(f,dt) {
  const a=forces(f.vx,f.vy,f.p,f.wind), vx=f.vx+a.x/f.p.mass*dt/2,vy=f.vy+a.y/f.p.mass*dt/2;
  const b=forces(vx,vy,f.p,f.wind);
  f.x+=vx*dt; f.y+=vy*dt; f.vx+=b.x/f.p.mass*dt; f.vy+=b.y/f.p.mass*dt;
}
export function reward(f) {return 10+Math.floor(Math.max(0,f.x-f.startX)/10);}
export function settle(p,f) {
  if(!f.landed||f.settled) return false;
  f.settled=true; p.coins+=reward(f); p.best=Math.max(p.best,f.x-f.startX); p.completed=p.completed||p.best>=500; p.attempts++; return true;
}
export function simulate(model,levels,seed=1,profile=0,dt=DT,options={}) {
 const f=createFlight(model,levels,seed,{x:0,y:0},options.launch??null),rng=random(seed+991);
 const decisions=f.events.map(()=>({hit:rng()<profile,perfect:rng()<({.25:.1,.6:.25,.9:.5}[profile]??0)}));
 while(!f.landed&&f.t<180){
  f.events.forEach((e,i)=>{const d=decisions[i];if(!d.hit||e.result||(options.only&&e.type!==options.only))return;
   if(e.type==='gust'&&f.t>=e.at+(d.perfect?1.4:1.25))eventInput(f,'down','sim');
   if(e.type==='bird'){
    if(e.heldAt===null&&f.t>=e.at+1)eventInput(f,'down','sim');
    if(e.heldAt!==null&&f.t>=e.heldAt+(d.perfect?.75:.6))eventInput(f,'up','sim');
   }
  });step(f,dt);
 }
 if(!f.landed)throw Error('Flight exceeded 180 s');return f;
}
