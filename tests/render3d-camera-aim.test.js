import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planFrame,viewOf,launchLift,planeWorld,planeScale,PLANE_SIZE,CAMERA} from '../src/render3d/frame.js';
import {LAUNCH} from '../src/render3d/camera.js';
import {REST,HAND,aimWidth,planePose} from '../src/render3d/pose.js';
import {createFlight,step} from '../src/core.js';

// S2 záběr míření a výhoz (research/start/01 §2.2, 02 §2, rozhodnutí 06): polodetail 16 m (telefon 7 m), přisunutí při nabíjení,
// oddálení výhozu ≤ 1,2 s, vlaštovka v ruce 0,5 m. Smlouva view(null) = (148, 258) zůstává.
const near=(a,b,eps,msg)=>assert.ok(Math.abs(a-b)<=eps,`${msg}: ${a} vs ${b}`);
const restPlan=(o={})=>planFrame({state:'aim',...o,visual:{clock:0,...o.visual}});
test('aim shot: 16 m on desktop, narrower down to 7 m so the 0,5 m plane in the hand keeps ≥ 27 px (≥ 25,7 at 360); the hand stays at (148, 258)',()=>{
 for(const [css,W] of [[1920,16],[1280,16],[864,16],[768,768/54],[500,500/54],[390,390/54],[375,7],[360,7]]){const p=restPlan({visual:{cssWidth:css}});
  near(p.camera.width,W,1e-9,`css ${css}`);near(aimWidth(css),W,1e-9,`aimWidth ${css}`);near(p.view.px,148,1e-6,'px');near(p.view.py,258,1e-6,'py');
  const L=p.hand.scale*PLANE_SIZE.max;near(L,.5*planeScale(css),1e-9,'0,5 m in the hand (+15 % on a narrow scene)');assert.ok(L/W*css>=25.7,`css ${css}: ${L/W*css} px`);}
 near(restPlan({visual:{cssWidth:1280}}).hand.scale*PLANE_SIZE.max/16*1280,40,1e-9,'40 px at 1280');
 const v=viewOf(null);near(v.px,148,1e-6,'view(null) px');near(v.py,258,1e-6,'view(null) py');near(v.k,640/2.1/aimWidth(640),.5,'k of the aim shot (logical 640 px wide)');
});
test('charging pushes the camera in by up to 6 % (smoothly), Calm camera and reduced motion keep the aim shot still',()=>{
 let p=restPlan({visual:{cssWidth:1280}}),last=p.camera.width;
 for(let i=1;i<=120;i++){const clock=i/60,charge=Math.min(1,clock/1.15);p=planFrame({state:'aim',prev:p,visual:{clock,charge,cssWidth:1280}});
  assert.ok(p.camera.width<=last+1e-9&&Math.log(last/p.camera.width)<=.8/60+1e-9,'eases in');last=p.camera.width;near(p.view.px,148,1e-6,'hand pinned');near(p.view.py,258,1e-6,'hand pinned');}
 near(last,16*(1-REST.push),.05,'≈ 6 % closer at full charge');
 for(const visual of [{settings:{calm:true}},{reduced:true}]){let q=restPlan({visual:{cssWidth:1280,...visual}});
  for(let i=1;i<=60;i++){q=planFrame({state:'aim',prev:q,visual:{clock:i/60,charge:i/60,cssWidth:1280,...visual}});assert.equal(q.camera.width,16);}}
 const pulled=planePose({charge:1,size:.5/7.75}),old=planePose({charge:1});near(pulled.dx,old.dx*.5/7.75,1e-12,'pull-back scales with the plane size');
});
// Rest (charged) → throw → flight, chained like ui.js.
function throwChain({css=1280,visual={},seed=2,frames=150}={}){
 let p=restPlan({visual:{cssWidth:css,...visual}});for(let i=1;i<=60;i++)p=planFrame({state:'aim',prev:p,visual:{clock:i/60,charge:Math.min(1,i/69),cssWidth:css,...visual}});
 const f=createFlight('dart',undefined,seed),out=[{t:0,w:p.camera.width,Y:HAND.y,py:p.view.py,cut:false}];
 for(let i=0;i<frames;i++){step(f);p=planFrame({f,prev:p,time:f.t,visual:{cssWidth:css,...visual}});out.push({t:f.t,w:p.camera.width,Y:p.Y,py:p.view.py,px:p.view.px,launch:p.director.launch,cut:p.camera.cut,len:p.plane.scale*PLANE_SIZE.max});}
 return out;
}
test('throw: pull-out from the aim shot to the flight width only outwards and done by 1,2 s; the plane leaves the hand without a jump',()=>{
 for(const css of [1280,375]){const o=throwChain({css});
  for(let i=1;i<o.length;i++){const a=o[i-1],b=o[i];if(b.t<=LAUNCH.dur)assert.ok(b.w>=a.w-1e-9,`css ${css}: only outwards`);
   assert.ok(Math.abs(b.py-a.py)<=4,`css ${css}: py jump ${b.py-a.py}`);assert.ok(Math.abs(b.Y-a.Y)<.5,`css ${css}: plane height continuous`);}
  assert.ok(o.filter(x=>x.t>LAUNCH.dur+1e-9).every(x=>x.launch===null),'launch over by 1,2 s');
  const end=o.find(x=>x.t>LAUNCH.dur);assert.ok(end.w>=.9*CAMERA.width,`flight width after the throw ${end.w}`);
  near(o[1].Y,HAND.y,.4,'first flight frame starts at the hand');
  const sz=o.slice(1).map(x=>x.len/x.w*css);assert.ok(sz.every(px=>px>=24-1e-9),'≥ 24 px');}
 const d=throwChain({css:1280}).slice(1).map(x=>x.len/x.w*1280);assert.ok(d.at(-1)>d[0]*1.4,`desktop: plane grows on screen ${d[0]} → ${d.at(-1)}`);
});
test('launchLift: display only, from the hand (12 m) to a higher physics start (f.d.y0) within LAUNCH.dur; physics untouched',()=>{
 const f=createFlight('dart',undefined,3);assert.equal(HAND.y,12);assert.equal(launchLift(f),0,'hand = y0 (S4): nothing to bridge');for(let i=0;i<72;i++)step(f);assert.equal(launchLift(f),0);
 assert.equal(planeWorld(f)[1],f.y);assert.equal(launchLift({t:0,d:{y0:16}}),HAND.y-16,'Crane Lift');assert.ok(Math.abs(launchLift({t:LAUNCH.dur,d:{y0:16}}))<1e-12);
 const a=createFlight('dart',undefined,4),b=createFlight('dart',undefined,4);for(let i=0;i<300;i++){step(a);step(b);planFrame({f:b,time:b.t});}assert.deepEqual(a,b);
});
test('Calm camera / reduced motion: throw cuts from the aim shot to W_let·T (camera.cut on that frame), no pull-out',()=>{
 const o=throwChain({visual:{reduced:true},frames:30});assert.equal(o[1].cut,true);assert.ok(o.slice(2).every(x=>!x.cut));
 near(o[1].w,CAMERA.width,1e-9,'flight width right away');assert.ok(o.slice(1).every(x=>Math.abs(x.w-CAMERA.width)<1e-9));
});
test('R0: one style, visual.style is ignored (same aim shot 16 m with cyber, papir or none)',()=>{
 const a=restPlan({visual:{cssWidth:1280}});near(a.camera.width,16,1e-9,'16 m');assert.ok(!('style' in a));
 for(const style of ['cyber','papir'])assert.deepEqual(restPlan({visual:{cssWidth:1280,style}}),a,style);
});
