import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planFrame,viewOf,project,cameraFor,placesFor,planeWorld,LOGICAL,ASPECT,CAMERA} from '../src/render3d/frame.js';
import {PLANE_OFFSET,LAYERS} from '../src/render3d/geometry.js';
import {PIXELS_PER_METER as PPM,SCREEN_METERS} from '../src/scenes.js';
import {createFlight,step,eventInput} from '../src/core.js';
import {createFx,fxEvent,stepFx} from '../src/juice.js';
import {autoInput} from './helpers/auto-input.js';

// Contract tests for planFrame/view (plan §4.1). Owned by R1.
const fly=(seed=3,cb=()=>{})=>{const f=createFlight('dart',undefined,seed);for(let i=0;i<4000&&!f.landed;i++){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);cb(f,i);}return f;};
const near=(a,b,eps,msg)=>assert.ok(Math.abs(a-b)<=eps,`${msg}: ${a} vs ${b}`);
test('view(null) puts the plane at the aim overlay (148, 258) and cam = X·2,1 − px',()=>{
 const v=viewOf(null);near(v.px,148,2,'px');near(v.py,258,2,'py');assert.ok(v.ground>v.py,'ground below the plane');
 near(v.cam,PLANE_OFFSET*PPM-v.px,1e-9,'cam');near(v.cam,0,1e-6,'cam at rest = 0 like 2D');assert.ok(v.k>0);
 assert.deepEqual(planFrame({f:null}).view,v);
});
test('projecting the plane point with plan.camera gives view.px/py; px stays 148 for the whole flight',()=>{
 let n=0;fly(3,(f,i)=>{if(i%7)return;const p=planFrame({f,model:'dart',time:f.t,visual:{clock:f.t}}),[sx,sy]=project([p.X,p.Y,0],p.camera);
  near(sx,p.view.px,1e-6,'sx');near(sy,p.view.py,1e-6,'sy');near(p.view.px,148,1e-6,'px constant');near(p.view.cam,f.x*PPM,1e-6,'cam = f.x·2,1');
  near(project([p.X,0,0],p.camera)[1],p.view.ground,1e-9,'ground');assert.ok(p.view.py<=p.view.ground+1e-9);n++;});
 assert.ok(n>50);
});
test('particle formula with k: a world point d m ahead of the plane lands d·2,1·k px to the right (and up the same in y)',()=>{
 const f=createFlight('dart',undefined,5);for(let i=0;i<200;i++)step(f);
 const p=planFrame({f}),v=p.view;
 for(const d of [-6,-2,3,8]){const wx=v.cam+v.px+d*PPM,sx=v.px+(wx-v.cam-v.px)*v.k,[px]=project([p.X+d,p.Y,0],p.camera);near(sx,px,.02,`dx ${d} m`);
  const wy=v.py-d*PPM,sy=v.py+(wy-v.py)*v.k,[,py]=project([p.X,p.Y+d,0],p.camera);near(sy,py,.6,`dy ${d} m`);}
 near(v.k,LOGICAL.w/p.camera.width/PPM,.06,'k ≈ 640/(width·2,1)');
});
test('places cover the visible width at the flight depth and the far skyline, nearest first',()=>{
 for(const X of [PLANE_OFFSET,400,1234,5000]){const cam=cameraFor(X,15),ps=placesFor(cam),lo=Math.min(...ps.map(p=>p.x0)),hi=Math.max(...ps.map(p=>p.x0))+SCREEN_METERS;
  for(const z of [0,LAYERS.far]){const half=(cam.dist-z)*Math.tan(cam.fov*Math.PI/360)*ASPECT;assert.ok(lo<=Math.max(0,cam.cx-half)&&hi>=cam.cx+half,`X ${X} z ${z}`);}
  ps.forEach(p=>{assert.equal(p.index,p.screen%16);assert.equal(p.district,Math.floor(p.index/4));assert.equal(p.x0,p.screen*SCREEN_METERS);});
  const d=ps.map(p=>Math.abs(p.x0+SCREEN_METERS/2-cam.cx));assert.deepEqual(d,[...d].sort((a,b)=>a-b));}
});
test('planFrame does not mutate f or fx and is repeatable',()=>{
 const f=createFlight('glider',undefined,1);for(let i=0;i<150;i++)step(f);
 const fx=createFx();fxEvent(fx,'throw');stepFx(fx,1/60,f,viewOf(f),()=>.5);
 const snap=JSON.stringify(f),fsnap=JSON.stringify({...fx,parts:[...fx.parts]}),visual={fx,clock:3,qte:null};
 const a=planFrame({f,model:'glider',time:f.t,visual}),b=planFrame({f,model:'glider',time:f.t,visual,prev:a});
 assert.equal(JSON.stringify(f),snap);assert.equal(JSON.stringify({...fx,parts:[...fx.parts]}),fsnap);assert.deepEqual(a,b);
 assert.equal(a.state,'flight');assert.equal(a.plane.model,'glider');assert.ok(Number.isFinite(a.plane.angle)&&a.mood.fog.far>a.mood.fog.near);
 const r=planFrame({f:null,visual:{charge:.95,clock:1}});assert.equal(r.state,'aim');assert.ok(r.plane.x<planeWorld(null)[0],'pulled back while charging');
});
test('determinism: the same seeded flight with and without planFrame ends identical',()=>{
 for(const seed of [1,2,7]){const a=fly(seed),b=fly(seed,f=>planFrame({f,model:'dart',time:f.t,visual:{clock:f.t,fx:createFx()}}));
  assert.deepEqual(JSON.parse(JSON.stringify(b)),JSON.parse(JSON.stringify(a)));assert.ok(a.landed&&a.x>20);}
});
test('after the throw the director eases from the workshop shot to Follow without a jump (prev chains the director)',()=>{
 const f=createFlight('dart',undefined,2),r=planFrame({f:null,state:'aim'});let prev=r,last=r.camera;
 for(let i=0;i<150;i++){step(f);const p=planFrame({f,prev,time:f.t}),c=p.camera;
  if(!i)near(c.width,r.camera.width,4,'starts at the rest shot');
  assert.ok(Math.abs(Math.log(c.width/last.width))<=.021,'width eases');near(p.view.px,prev.view.px,.51,'px eases');
  near(viewOf(f,c).py,p.view.py,1e-9,'view(f, plan.camera) = plan.view');last=c;prev=p;}
 assert.ok(last.width>=CAMERA.width*.8-1e-9&&last.width<=CAMERA.width*1.5+1e-9,`Follow after the transition: ${last.width}`);
 assert.ok(prev.director.state!=='rest');
});
test('hold („zadržení dechu“) rises during a QTE and falls back after it',()=>{
 const f=createFlight('dart',undefined,1);let prev=planFrame({f:null}),peak=0,after=null;
 for(let i=0;i<900&&!f.landed;i++){step(f);prev=planFrame({f,prev,time:f.t});peak=Math.max(peak,prev.mood.hold);if(peak>.9&&!f.events[0].phase.match(/warning|interaction/)&&f.t>f.events[0].doneAt+1){after=prev.mood.hold;break;}}
 assert.ok(peak>.9,`peak ${peak}`);assert.ok(after!==null&&after<.05,`after ${after}`);assert.equal(planFrame({f:null}).mood.hold,0);
});
