// Game-feel state for one throw: screen shake (trauma), hitstop, squash & stretch, smoothed
// rotation, trail, particles and pop-up texts. Pure data + maths, no DOM; drawn by fx-render.js.
import {spring,wobble,noise1,clamp01} from './motion.js';
import {t} from './i18n.js';
export const FX={
 shakePx:7, shakeRad:.035, traumaDecay:1.1,      // trauma² drives shake (Eiserloh); scaled down for 640×360
 hitstop:{perfect:.09,success:.05,land:.12},      // seconds of frozen physics
 popupLife:1.1, trailPoints:26, particles:160
};
// Particle kinds: 0 dust, 1 gold spark, 2 accent spark, 3 wind streak.
const STRIDE=8;// x(world px), y(screen px), vx, vy, age, life, size, kind
export function createFx(){return {trauma:0,hitstop:0,flash:0,stretch:{x:0,v:0},rot:{x:0,v:0},rotReady:false,trail:[],popups:[],queue:[],
 parts:new Float32Array(FX.particles*STRIDE),next:0,speedLines:0,seen:new Set(),landed:false};}
const popup=(fx,text,style)=>fx.popups.push({text,style,age:0});
// Gameplay moments → feedback. `info.power` (0–1) for the throw, `info.text` for pop-ups.
export function fxEvent(fx,type,info={}){
 const add=(trauma,stop=0)=>{fx.trauma=clamp01(fx.trauma+trauma);fx.hitstop=Math.max(fx.hitstop,stop);};
 switch(type){
  case 'throw':add(.2+.3*(info.power??0));fx.stretch.v+=5+6*(info.power??0);fx.queue.push([3,6]);break;
  case 'perfect':add(.35,FX.hitstop.perfect);fx.flash=.12;fx.stretch.v+=6;fx.queue.push([1,22]);popup(fx,t('popup.perfect'),'perfect');break;
  case 'success':add(.15,FX.hitstop.success);fx.stretch.v+=4;fx.queue.push([2,12]);popup(fx,t('popup.success'),'success');break;
  case 'miss':fx.stretch.v-=3;popup(fx,t('popup.miss'),'miss');break;
  case 'boost':fx.speedLines=1;fx.queue.push([3,10]);break;
  case 'milestone':fx.queue.push([1,14]);if(info.text)popup(fx,info.text,'milestone');break;
  case 'land':add(.25+.25*clamp01((info.speed??0)/30),FX.hitstop.land);fx.stretch.v-=7;fx.queue.push([0,28]);popup(fx,info.text,'land');fx.landed=true;break;
 }
}
function emit(fx,kind,n,wx,y,rng){
 for(let i=0;i<n;i++){
  const o=fx.next*STRIDE,a=rng()*Math.PI*2,s=kind===0?35+rng()*75:kind===3?0:40+rng()*110;fx.next=(fx.next+1)%FX.particles;
  fx.parts.set([wx+(kind===3?-10-rng()*30:0),y+(kind===3?(rng()-.5)*30:kind===0?2:0),
   kind===0?Math.cos(a)*s*1.4:kind===3?-180-rng()*120:Math.cos(a)*s, kind===0?-Math.abs(Math.sin(a))*s*.6:kind===3?0:Math.sin(a)*s,
   0,kind===0?.6+rng()*.6:kind===3?.25+rng()*.2:.45+rng()*.45, kind===0?5+rng()*5:kind===3?10+rng()*14:2+rng()*2,kind],o);
 }
}
// Plane rotation the physics implies (nose follows velocity), clamped like the original renderer.
export const flightAngle=f=>f?Math.max(-.5,Math.min(.5,-Math.atan2(f.vy,f.vx))):-.15;
// Advance feedback by real time dt. `view` = {cam, px, py, ground} of the current frame.
export function stepFx(fx,dt,f,view,rng=Math.random){
 fx.trauma=Math.max(0,fx.trauma-FX.traumaDecay*dt);fx.flash=Math.max(0,fx.flash-dt);fx.speedLines=Math.max(0,fx.speedLines-dt);
 wobble(fx.stretch,0,320,11,dt);fx.stretch.x=Math.max(-.35,Math.min(.45,fx.stretch.x));
 const goal=flightAngle(f);if(!fx.rotReady){fx.rot.x=goal;fx.rotReady=true;}spring(fx.rot,goal,.07,dt);
 const wx=view.cam+view.px;
 for(const [kind,n] of fx.queue.splice(0))emit(fx,kind,n,kind===0?wx:wx-4,kind===0?view.ground-6:view.py,rng);
 if(fx.speedLines>0&&rng()<dt*30)emit(fx,3,1,wx,view.py,rng);
 for(let o=0;o<fx.parts.length;o+=STRIDE){
  if(fx.parts[o+4]>=fx.parts[o+5])continue;const k=fx.parts[o+7],drag=k===0?2.2:1.4;
  fx.parts[o+4]+=dt;fx.parts[o]+=fx.parts[o+2]*dt;fx.parts[o+1]+=fx.parts[o+3]*dt;
  fx.parts[o+2]*=Math.exp(-drag*dt);fx.parts[o+3]=fx.parts[o+3]*Math.exp(-drag*dt)+(k===0?-14:k===3?0:90)*dt;
 }
 for(const p of fx.popups)p.age+=dt;fx.popups=fx.popups.filter(p=>p.age<FX.popupLife);
 // Trail in world pixels; drawn relative to the camera so it shows the real flight arc.
 if(f&&!f.landed){const last=fx.trail.at(-1);if(!last||Math.hypot(wx-last[0],view.py-last[1])>5){fx.trail.push([wx,view.py]);if(fx.trail.length>FX.trailPoints)fx.trail.shift();}}
 else if(fx.trail.length)fx.trail.shift();
}
// Shake offset from trauma²; smooth noise so it reads as camera motion, not random jitter.
export function shake(fx,time,reduced=false){
 if(reduced||!fx)return {x:0,y:0,a:0};const s=fx.trauma*fx.trauma;
 return {x:FX.shakePx*s*noise1(time*22,1),y:FX.shakePx*s*noise1(time*22,2),a:FX.shakeRad*s*noise1(time*22,3)};
}
export const liveParticles=fx=>{let n=0;for(let o=0;o<fx.parts.length;o+=STRIDE)if(fx.parts[o+4]<fx.parts[o+5])n++;return n;};
export {STRIDE};
