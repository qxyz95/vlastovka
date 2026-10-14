import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDirector,direct,titleAlpha,punchZoom,speedZoom,placeTitle,ZOOM_RANGE,TITLE} from '../src/render3d/camera.js';
import {follow} from '../src/render3d/geometry.js';
import {PLACE_EN,onTwos,wrap} from '../src/render3d/life.js';
import {ROUTE} from '../src/scenes.js';

// Owned by R5 (camera). Moved from the prototype's life test.
test('director: title and punch-in only at place boundaries, zoom bounded, plane stays put in frame',()=>{
 assert.equal(PLACE_EN.length,ROUTE.length);assert.deepEqual(placeTitle(1),{title:'Market under the Antennas',sub:'VIOLET SUBURBS · 2/4',district:0,first:false});
 assert.equal(titleAlpha(null),0);assert.equal(titleAlpha(1),1);assert.equal(titleAlpha(TITLE.fadeIn+TITLE.hold+TITLE.fadeOut+.01),0);
 assert.equal(punchZoom(null),1);assert.ok(punchZoom(.8)<.9);assert.equal(speedZoom(10),1);assert.ok(speedZoom(200)>1.4);
 const s=createDirector(),titles=[];let t=0;
 for(let x=0;x<1300;x+=.5,t+=1/60){direct(s,{x,v:30,t,dt:1/60,flying:true});if(s.at===t)titles.push(s.title.title);assert.ok(s.zoom>=ZOOM_RANGE[0]-1e-9&&s.zoom<=ZOOM_RANGE[1]+1e-9);
  const v=follow(x,10,{width:120*s.zoom});assert.ok(Math.abs((x-(v.cx-v.width/2))/v.width-148/640)<1e-9,'plane at px 148');}
 assert.deepEqual(titles,PLACE_EN.slice(0,5));
 const g=createDirector();direct(g,{x:400,v:0,t:0,dt:1/60,flying:false});assert.equal(g.title,null,'no title while aiming');
 assert.ok(Math.abs(onTwos(.99)-11/12)<1e-12&&wrap(-1,0,10)===9);
});

// ── Režisér c2 (R5): zámek QTE, bez skoků, District, Calm, rotace, determinismus, project = view ──
import {createDirector as mk,direct as dir,project,cameraView,nextDirector,qteLock,nextEventIn,DISTRICT,MAX_ROT,LOCK_AFTER,REST,HAND} from '../src/render3d/camera.js';
import {PLANE_OFFSET} from '../src/render3d/geometry.js';
import {restCamera,REST as POSE_REST} from '../src/render3d/pose.js';
import {createFlight,step} from '../src/core.js';
import {eventInput} from '../src/events.js';
import {autoInput} from './helpers/auto-input.js';
import {SCREEN_METERS} from '../src/scenes.js';
const DT=1/60;
// Celý hod: 30 snímků v klidu (Dílna), let s autopilotem, 60 snímků po dopadu. Tempo k roste během letu (ověří i tempo zoom).
function run(seed,{calm=false,flat=false,tempo=t=>1+.4*Math.min(1,t/10),levels={power:3,paper:3,fold:2},shake=[3,-2]}={}){
 const s=mk(),f=createFlight('dart',levels,seed),frames=[];let t=0;
 const frame=(sh,flying)=>{const k=sh?tempo(f.t):1,X=(sh?f.x*k:0)+PLANE_OFFSET,Y=sh?f.y:HAND.y;dir(s,{x:X,y:Y,v:(sh?f.vx:0)*k,t,dt:DT,flying,f:sh?f:null,k,calm,flat,shake});
  frames.push({t,ft:f.t,lock:s.lock,state:s.state,cam:structuredClone(s.camera),view:cameraView(s.camera,X,Y),X,Y});t+=DT;};
 for(let i=0;i<30;i++)frame(null,false);
 while(!f.landed&&f.t<120){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);frame(f,!f.landed);}
 for(let i=0;i<60;i++)frame(f,false);
 return {frames,f};
}
test('camera: view(null) at the kid hand (148, 258) ±2 px; project of the plane = view = director target',()=>{
 const s=mk();dir(s,{x:PLANE_OFFSET,v:0,t:0,dt:DT,flying:false,y:HAND.y});const v=cameraView(s.camera,PLANE_OFFSET,HAND.y);
 assert.ok(Math.abs(v.px-REST.px)<=2&&Math.abs(v.py-REST.py)<=2,`rest ${v.px},${v.py}`);const rc=restCamera(16/9);assert.ok(Math.abs(v.k-POSE_REST.k)<.02,'k = REST.k');assert.ok(Math.abs(s.camera.width-rc.width)<1e-9);
 for(let i=0;i<3;i++)assert.ok(Math.abs(s.camera.position[i]-rc.position[i])<.05&&Math.abs(s.camera.target[i]-rc.target[i])<.05,'same as pose.restCamera');
 assert.ok(Math.abs(v.cam-(PLANE_OFFSET*2.1-v.px))<1e-9);
 const {frames}=run(3);
 for(const fr of frames){const p=project(fr.cam,[fr.X,fr.Y,0]);assert.ok(Math.abs(p.px-fr.view.px)<1e-9&&Math.abs(p.py-fr.view.py)<1e-9);
  assert.ok(Math.abs(p.px-fr.cam.px)<1e-6&&Math.abs(p.py-fr.cam.py)<1e-6,'plane pinned where the director wants it');assert.ok(p.depth>0);}
});
test('camera: QTE lock — from warning to 0.3 s after the result the zoom stays put and px drifts ≤ 2 px',()=>{
 for(const seed of [1,2,5,9]){const {frames,f}=run(seed);let checked=0;
  for(const e of f.events.filter(e=>e.resolvedAt!=null)){const w=frames.filter(fr=>fr.ft>=e.at&&fr.ft<=e.resolvedAt+LOCK_AFTER-1e-6);if(!w.length)continue;checked++;
   assert.ok(w.every(fr=>fr.lock),'locked');const z=w.map(fr=>fr.cam.width),px=w.map(fr=>fr.view.px);
   assert.ok(Math.max(...z)-Math.min(...z)<1e-9,`seed ${seed}: zoom changed in lock`);assert.ok(Math.max(...px)-Math.min(...px)<=2,`seed ${seed}: px drift`);
   assert.ok(w.every(fr=>fr.cam.yaw===w[0].cam.yaw&&fr.cam.roll===w[0].cam.roll),'no rotation in lock');}
  assert.ok(checked>=3,`seed ${seed}: ${checked} events checked`);}
});
test('camera: never cuts — bounded width and px change per frame, plane moves continuously on screen',()=>{
 for(const seed of [1,4,7]){const {frames}=run(seed);
  for(let i=1;i<frames.length;i++){const a=frames[i-1],b=frames[i];
   assert.ok(Math.abs(Math.log(b.cam.width/a.cam.width))<=.021,`seed ${seed} frame ${i}: width jump`);
   assert.ok(Math.abs(b.view.px-a.view.px)<=.51,`px jump ${b.view.px-a.view.px}`);assert.ok(Math.abs(b.view.py-a.view.py)<=4,`py jump ${b.view.py-a.view.py}`);}
  assert.ok(new Set(frames.map(fr=>fr.state)).has('vista'),'vista appears in calm gliding');assert.ok(frames.some(fr=>fr.state==='landing'));}
});
test('camera: District shot shortens when it would collide with an event (events are never moved)',()=>{
 const B=4*SCREEN_METERS,shot=evAt=>{const s=mk(),f={t:0,landed:false,events:[{type:'gust',at:evAt,gap:3,phase:'waiting',result:null}]};
  for(let i=0;i<120;i++){const t=i*DT;f.t=t;dir(s,{x:B-30+i*.5,y:20,v:30,t,dt:DT,flying:true,f});if(s.shot==='district')return {s,at:evAt};}};
 const free=shot(100).s,near=shot(1.8).s,tight=shot(1.3).s;
 assert.equal(free.shotDur,DISTRICT.dur);assert.ok(near.shotDur<DISTRICT.dur&&near.shotDur>=DISTRICT.min,`shortened ${near.shotDur}`);
 assert.ok(near.shotAt+near.shotDur<=1.8-.1,'ends before the warning');assert.equal(tight.shotDur,0,'only the title when there is no room');
 assert.equal(near.title.first,true);assert.equal(tight.title.title,PLACE_EN[4]);
 const f={t:2,landed:false,events:[{at:1.5,phase:'effect',resolvedAt:1.8,doneAt:2.8},{at:Infinity,gap:3,phase:'waiting'}]};
 assert.equal(qteLock(f),true);assert.ok(Math.abs(nextEventIn(f)-3.8)<1e-9);f.t=2.2;assert.equal(qteLock(f),false);
});
test('camera: Calm camera — zoom always 1, no rotation or shake, optional flattened depth',()=>{
 for(const flat of [false,true]){const {frames}=run(2,{calm:true,flat});
  for(const fr of frames){assert.equal(fr.cam.zoom,1);assert.equal(fr.cam.yaw,0);assert.equal(fr.cam.roll,0);assert.deepEqual(fr.cam.shake,[0,0]);assert.ok(Math.abs(fr.view.px-148)<1e-9);
   if(flat)assert.ok(fr.cam.pitch===0&&fr.cam.fov<20);}}
 const {frames}=run(2);assert.ok(frames.some(fr=>fr.cam.shake[0]===3),'shake passes through without calm');assert.ok(frames.some(fr=>fr.cam.zoom<.97),'zoom out with speed and tempo');
});
test('camera: rotation ≤ 3°, deterministic, nextDirector does not mutate',()=>{
 const runs=[1,6].map(seed=>run(seed,{tempo:t=>1+t*.3}));
 for(const {frames} of runs)for(const fr of frames)assert.ok(Math.abs(fr.cam.yaw)<=MAX_ROT&&Math.abs(fr.cam.roll)<=MAX_ROT);
 assert.ok(runs[0].frames.some(fr=>Math.abs(fr.cam.yaw)>1),'place intro turns a little');
 assert.deepEqual(run(6,{tempo:t=>1+t*.3}).frames,runs[1].frames);
 const s=mk(),copy=structuredClone(s),n=nextDirector(s,{x:100,y:20,v:40,t:1,dt:DT,flying:true});assert.deepEqual(s,copy);assert.notEqual(n,s);assert.equal(n.place,0);
});
