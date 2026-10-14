import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {createFlight,step,eventInput} from '../src/core.js';
import {autoInput} from './helpers/auto-input.js';
import {planFrame,planeWorld,launchLift,viewOf} from '../src/render3d/frame.js';
import {LAUNCH as CAM_LAUNCH,project} from '../src/render3d/camera.js';
import {HAND,restCamera,kidPose,KID_THROW,REST} from '../src/render3d/pose.js';
import {cityChunk,chunkOffset,viewCap,viewCapAt,VIEW_BAND,PLANE_OFFSET} from '../src/render3d/geometry.js';
import {placeCards,cardTriangles,hills} from '../src/render3d/paper-cards.js';
import {suburbLife,behindLaunch,carX} from '../src/render3d/life.js';
import {LAUNCH,AIM_SHOT,DIORAMA,launchStatic,launchShadow,launchFlag,dioramaShadow,buildModel,place} from '../src/render3d/models/index.js';
import {kidRig,poseKid,KID_AT,KID_SCALE} from '../src/render3d/models/kid-rig.js';
import {KID} from '../src/render3d/models/kid.js';
import {cardVertices} from '../src/render3d/paper-cards.js';

// S4 místo odhodu ve hře (research/start/01 §2, dávka S4; 02; bible 05 kap. 3.1 a 9; katalog 11 kap. 3.7 a 4.2; rozhodnutí 06 body 1–7).
const near=(a,b,e=1e-6,msg='')=>assert.ok(Math.abs(a-b)<=e,`${msg} ${a} vs ${b}`);
const THREE_URL=new URL('../vendor/three/three.module.min.js',import.meta.url).href;
registerHooks({resolve:(spec,ctx,next)=>spec==='three'?{url:THREE_URL,shortCircuit:true}:next(spec,ctx)});
globalThis.document??={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:()=>()=>{},set:()=>true})})};

// Lety z HEAD 4df47a7 (před S4), autopilot QTE, 60 Hz: [model, seed, x, t, kroky]. Fyzika (core.js, throw.js) se v S4 nemění.
// QS2 (15. 10.): glider 1 a 7 přepočteny, poslední událost by začala pod EVENT_MIN_Y = 8 m, a proto se nespustí.
const GOLDEN=[['dart',1,260.769395,16.978006,1019],['dart',2,181.505597,11.272374,677],['dart',3,181.505597,11.272374,677],['dart',7,197.433978,11.899052,714],
 ['glider',1,250.043541,24.736751,1485],['glider',2,210.111989,19.878887,1193],['glider',3,210.111989,19.878887,1193],['glider',7,242.417458,22.795524,1368]];
test('physics unchanged by S4: same flights as before (golden from HEAD 4df47a7), the paper renderer does not touch the flight',()=>{
 for(const [model,seed,x,t,n] of GOLDEN){const f=createFlight(model,undefined,seed);let k=0,p=null;
  while(!f.landed&&k<60*120){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);k++;if(seed===1)p=planFrame({f,prev:p,time:f.t,visual:{cssWidth:1280}});}
  assert.equal(k,n,`${model} ${seed} steps`);near(f.x,x,1e-6,`${model} ${seed} x`);near(f.t,t,1e-6,`${model} ${seed} t`);}
 assert.equal(createFlight('dart',undefined,5).y,HAND.y,'physics throws from the hand height (12 m, M-3)');
});

test('hand 12 m (launch-site LAUNCH.hand, no launchLift), rest pitch −8° (R0: one style)',()=>{
 assert.equal(HAND,LAUNCH.hand);assert.deepEqual({...HAND},{x:PLANE_OFFSET,y:12,z:0});assert.equal(REST.pitch,AIM_SHOT.pitch);
 const f=createFlight('dart',undefined,3);
 for(let i=0;i<90;i++){assert.equal(launchLift(f),0);assert.deepEqual(planeWorld(f),[f.x+PLANE_OFFSET,f.y]);step(f);}
 assert.deepEqual(planeWorld(null),[HAND.x,12]);
});

const restPlan=(visual={})=>planFrame({state:'aim',visual:{clock:0,...visual}});
test('aim shot: hand 12 m pinned at (148, 258), 16 m (phone 7 m), camera from slightly below (−8°)',()=>{
 for(const css of [1920,1280,768,390,375,360]){const p=restPlan({cssWidth:css});near(p.view.px,148,1e-6,'px');near(p.view.py,258,1e-6,'py');
  assert.equal(p.camera.pitch,-8);near(p.Y,12,1e-12);assert.ok(p.camera.position[1]<p.camera.target[1],'looks up');assert.ok(p.camera.width<=16&&p.camera.width>=7);}
 const v=viewOf(null);near(v.px,148,1e-6);near(v.py,258,1e-6);
 const rc=restCamera(16/9,16),p=restPlan({cssWidth:1280});for(let i=0;i<3;i++){near(p.camera.position[i],rc.position[i],.05,'= pose.restCamera');near(p.camera.target[i],rc.target[i],.05);}
});

test('throw: the plane leaves the hand at 12 m without a jump, pitch eases −8° → +6° with the pull-out (≤ 1,2 s); Calm cuts straight to +6°',()=>{
 let p=restPlan({cssWidth:1280});for(let i=1;i<=40;i++)p=planFrame({state:'aim',prev:p,visual:{clock:i/60,charge:Math.min(1,i/46),cssWidth:1280}});
 const f=createFlight('dart',undefined,2),out=[];let last=p.camera.pitch,lastY=12;
 for(let i=0;i<120;i++){step(f);p=planFrame({f,prev:p,time:f.t,visual:{cssWidth:1280}});
  assert.ok(p.camera.pitch>=last-1e-9,'pitch only rises');assert.ok(Math.abs(p.Y-lastY)<.5,'height continuous');near(p.Y,f.y,1e-12,'display = physics');last=p.camera.pitch;lastY=p.Y;out.push([f.t,p.camera.pitch]);}
 near(out[0][1],-8,.5,'starts at the aim pitch');assert.ok(out.filter(([t])=>t>CAM_LAUNCH.dur+1e-9).every(([,a])=>a===6),'flight pitch after the pull-out');
 let q=restPlan({cssWidth:1280,reduced:true});const g=createFlight('dart',undefined,2);step(g);q=planFrame({f:g,prev:q,time:g.t,visual:{cssWidth:1280,reduced:true}});
 assert.equal(q.camera.cut,true);assert.equal(q.camera.pitch,6);
});

// Paprsek z kamery přes bod P: zasáhne čelo karty (obdélník, štít, mnohoúhelník, kotouč)?
function hits(cam,P,cards){const E=cam.position,d=P.map((v,i)=>v-E[i]),out=[];
 for(const c of cards){const zf=c.z+c.d/2,t=(zf-E[2])/d[2];if(!(t>0))continue;const x=E[0]+d[0]*t,y=E[1]+d[1]*t;let inside;
  if(c.shape==='poly'){const q=c.pts;inside=false;for(let i=0,j=q.length-1;i<q.length;j=i++)if((q[i][1]>y)!==(q[j][1]>y)&&x<(q[j][0]-q[i][0])*(y-q[i][1])/(q[j][1]-q[i][1])+q[i][0])inside=!inside;}
  else if(c.shape==='disc')inside=Math.hypot(x-c.x,y-c.y)<=c.r;
  else if(c.shape==='gable'||c.shape==='pyr'){const xm=c.x+c.w/2;inside=x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h*(1-Math.abs(x-xm)/(c.w/2));}
  else inside=x>=c.x&&x<=c.x+c.w&&y>=c.y&&y<=c.y+c.h;
  if(inside)out.push(c);}
 return out;}
const worldCards=async()=>{const {paperLayers}=await import('../src/render3d/city.js');const all=[];
 for(const [i,key] of [[0,'0s'],[1,'1']]){const L=paperLayers(i,key),dx=chunkOffset(i);for(const k of ['far','mid','near'])for(const c of L[k])all.push({...c,x:c.x+dx,pts:c.pts?.map(([a,b])=>[a+dx,b])});}
 return all;};
test('aim shot framing (S-1…S-7): kid 1,2 m, plane in hand and the sky behind it in frame; nothing of the street, middle or diorama behind the plane',async()=>{
 const cards=await worldCards(),rig=kidRig();poseKid(rig,kidPose({rest:true}),HAND);
 for(const css of [1280,375]){const cam=restPlan({cssWidth:css}).camera,pr=pt=>project(cam,pt,16/9);
  // dítě od kolen nahoru (bible 05 kap. 9.2), na šířce 1280 celé; vlaštovka v ruce
  for(const pt of [[KID_AT.x,KID_AT.y+(css<500?KID.legs:0),KID_AT.z],[KID_AT.x,KID_AT.y+KID.cap,KID_AT.z],[HAND.x+.25,12,0],[HAND.x-.25,12,0]]){const q=pr(pt);assert.ok(q.px>0&&q.px<640&&q.py>0&&q.py<360,`css ${css}: ${pt} → ${q.px},${q.py}`);}
  const px=(pr([KID_AT.x,KID_AT.y+KID.cap,KID_AT.z]).py-pr([KID_AT.x,KID_AT.y,KID_AT.z]).py)*-1;assert.ok(px>40,`kid ${px} logical px`);
  // za vlaštovkou (±0,25 m podél, do 0,3 m nad ní) jen nebe nebo vzdálená dálka a kopce v oparu, žádná ulice, střed ani dioráma
  for(const [dx,dy] of [[0,0],[.25,0],[-.25,0],[.25,.1],[0,.3],[.5,.15]]){const h=hits(cam,[HAND.x+dx,12+dy,0],cards).filter(c=>c.layer!=='far');
   assert.deepEqual(h.map(c=>`${c.model??c.layer} ${c.part??c.shape}`),[],`css ${css}: behind the plane at ${dx},${dy}`);}}
 // zábradlí pod rukou (madlo 0,95 m nad pavlačí), ruka 1,4 m nad podlahou pavlače 10,6 m
 const rail=launchStatic().filter(c=>c.part==='railing');assert.ok(Math.max(...rail.map(c=>c.y+c.h))<12-.3);near(LAUNCH.floor+KID.aimHand,12,1e-9);
});

test('view band S-1 (first screen of place 1): middle ≤ 13 m within 150 m of the hand, street ≤ 11 m within 60 m, roofs included, ramps back',()=>{
 const raw=cityChunk(0),cap=cityChunk(0,{view:true});assert.deepEqual(cityChunk(0,{view:false}),raw,'without view unchanged');
 assert.equal(cap.blocks.length,raw.blocks.length);cap.blocks.forEach((b,i)=>{const a=raw.blocks[i];for(const k of ['x','w','z','d','tone','type'])assert.equal(b[k],a[k]);assert.ok(b.h<=a.h);});
 assert.deepEqual(cityChunk(1,{view:true}),cityChunk(1),'only place index 0 (city.js asks just for the first screen)');
 assert.ok(raw.blocks.some(b=>b.tone===1&&b.h>13&&Math.max(0,b.x-VIEW_BAND.x,VIEW_BAND.x-b.x-b.w)<=150),'today the middle is taller (17–38 m)');
 const dist=c=>Math.max(0,c.x-PLANE_OFFSET,PLANE_OFFSET-(c.x+c.w));
 const cards=placeCards(cap,'papir');
 for(const c of cards){if(c.layer==='mid'&&dist(c)<=150)assert.ok(c.y+c.h<=13+1e-9,`mid ${c.shape} at ${c.x}: ${c.y+c.h}`);
  if(c.layer==='near'&&dist(c)<=60&&c.shape!=='disc')assert.ok(c.y+c.h<=11+1e-9,`near ${c.shape} at ${c.x}: ${c.y+c.h}`);}
 assert.equal(viewCapAt('mid',150),13);near(viewCapAt('mid',200),26.5);assert.equal(viewCapAt('mid',250),Infinity);assert.equal(viewCapAt('near',60),11);
 assert.equal(viewCap({tone:3,h:30,x:70,w:5}).h,30,'accents untouched');
 // život sedí na snížených střechách; bez view beze změny
 const L=suburbLife({view:true}),L0=suburbLife();assert.deepEqual(suburbLife({view:false}),L0);
 for(const c of L.chimneys.filter(c=>!c.big&&Math.abs(c.x-PLANE_OFFSET)<55))assert.ok(c.y<=11+1e-9,`chimney on a lowered roof ${c.y}`);
});

test('place 1 street (paper) holds the diorama H2–H6 merged (11 kap. 4.2 A); kid and flag drawn by the launch site; shadow proxies only in the mask',async()=>{
 const {paperLayers}=await import('../src/render3d/city.js');
 const s=paperLayers(0,'0s'),r=paperLayers(0,'0r'),st=launchStatic();
 assert.ok(st.length>100&&st.every(c=>c.layer==='near'&&c.model!=='kid'&&c.part!=='flag'));assert.equal(launchFlag().length,1);
 assert.equal(s.near.filter(c=>c.model).length,st.length,'diorama in the street of the first screen');assert.equal(r.near.filter(c=>c.model).length,0,'not on later laps');assert.equal(r.nearShadow,undefined);
 assert.ok(s.nearShadow.every(c=>!c.model||c.part==='shadow'),'mask: no diorama detail');assert.equal(s.nearShadow.filter(c=>c.part==='shadow').length,launchShadow().length);
 assert.ok(cardTriangles(launchShadow())<=11+4,'proxy H2 + H6 ≤ 11 △ + kid ≤ 4 △');assert.deepEqual(launchShadow().map(c=>c.layer),dioramaShadow().map(()=>'near'));
 assert.deepEqual(DIORAMA.map(o=>o.id).filter(id=>id!=='kid'),['retaining-wall','workshop-attic','workshop-interior','loft-balcony','hoist-beam']);
});

test('place 1 budget (paper, Node): ≤ 9 draw calls of its own incl. mask (+ 5 shared for the district = 14) and ≤ 15 000 △',async()=>{
 const {paperLayers,buildPaperPlace}=await import('../src/render3d/city.js'),{paperKit}=await import('../src/render3d/paper.js'),{createWorkshop}=await import('../src/render3d/workshop.js');
 const kit=paperKit(),tri=o=>o.geometry.attributes.position.count/3;let dc=0,mask=0,tris=0;
 const {group,geos}=buildPaperPlace(paperLayers(0,'0s'),kit);group.traverse(o=>{if(!o.isMesh)return;if(o.userData.shadow)mask++;else{dc++;tris+=tri(o);}});
 const site=createWorkshop(null,{paper:kit});for(const o of site.children)if(o.isMesh){dc++;tris+=tri(o);}
 assert.deepEqual([dc,mask],[6,3],'ground, far, mid, street+diorama, kid+flag, sign; 3 mask casters');assert.ok(dc+mask<=9);assert.ok(tris<=15000,`${tris} △`);
 site.dispose();geos.forEach(g=>g.dispose());kit.dispose();
});

test('kid C rig: aim pose = catalogue model, feet on the deck, palm T on the plane; phases idle/rest → aim → charge → throw → wave; flag flutters on twos, still with reduced motion',()=>{
 const P=(o)=>kidPose(o);
 assert.equal(P({rest:true,state:'workshop'}).phase,'rest');assert.equal(P({rest:true}).phase,'aim');assert.equal(P({rest:true,charge:.4}).phase,'charge');
 assert.equal(P({thrown:true,rest:false,since:.1}).phase,'throw');assert.equal(P({thrown:true,rest:false,since:KID_THROW+.01}).phase,'wave');
 assert.equal(P({thrown:true,rest:false,since:.15}).swing,.5);assert.equal(P({charge:.3,t:2,thrown:false}).phase,'charge');
 // míření (reduced = bez dýchání): LOD H je model katalogu v póze míření posunutý do místa
 const rig=kidRig(),m=cardVertices(place(buildModel('kid',0,{pose:'aim'}),KID_AT));
 poseKid(rig,P({rest:true}),HAND,{reduced:true});for(let i=0;i<m.p.length;i++)near(rig.positions[i],m.p[i],1e-5,'body = model aim pose');
 let y0=Infinity;for(let i=0;i<rig.ranges.h[1];i++)y0=Math.min(y0,rig.positions[i*3+1]);near(y0,LAUNCH.floor,1e-5,'feet on the deck');
 near(rig.last[2],HAND.x,1e-6);near(rig.last[3],12,1e-6);near(rig.last[5],HAND.z,1e-6);
 const ch=P({rest:true,charge:1});poseKid(rig,ch,{x:HAND.x-.25,y:12},{reduced:true});assert.ok(rig.last[0]<KID_AT.x+KID.aimPalm[0]-.1,'leans back');
 near(ch.back*KID_SCALE,.146,.01,'steps back ~15 cm (1,2 m kid)');
 poseKid(rig,P({thrown:true,rest:false,since:KID_THROW*(1-1e-9)}),null);assert.ok(rig.last[3]<rig.last[1]+.3&&rig.last[2]>rig.last[0],'throw ends forward');
 const wave=[.1,.25,.4,.55].map(t=>{poseKid(rig,P({thrown:true,rest:false,since:2,t}),null,{t});return Array.from(rig.palms.slice(3));});assert.ok(wave.every(([,y])=>y>LAUNCH.floor+1.2),'hand F up');
 assert.ok(Math.max(...wave.map(p=>Math.hypot(p[0]-wave[0][0],p[1]-wave[0][1],p[2]-wave[0][2])))>.2,'waves');
 const [f0,f1]=rig.ranges.flag,flag=t=>{poseKid(rig,P({rest:true}),HAND,{t});return Array.from(rig.positions.slice(f0*3,f1*3));};
 assert.notDeepEqual(flag(.3),flag(.6),'flutters');assert.deepEqual(flag(.30),flag(.31),'on twos');
 poseKid(rig,P({rest:true}),HAND,{t:.7,reduced:true});const still=Array.from(rig.positions.slice(f0*3,f1*3));assert.deepEqual(still,Array.from(rig.base.slice(f0*3,f1*3)),'reduced motion: flag still, pointing downwind');
 assert.ok(launchFlag()[0].pts.some(([x])=>x>rig.flag.x0+.5),'flag points with the wind (+x)');
});

test('cars hide where the lanes cross the retaining wall (paper life only)',()=>{
 assert.ok(behindLaunch(LAUNCH.wallX+5));assert.ok(behindLaunch(LAUNCH.wallX-1));assert.ok(!behindLaunch(LAUNCH.wallX-3));assert.ok(!behindLaunch(LAUNCH.wallX+LAUNCH.wallW+2.2));
 const cars=suburbLife({view:true}).cars;assert.ok(cars.some(c=>behindLaunch(carX(c,3))===false));
});
