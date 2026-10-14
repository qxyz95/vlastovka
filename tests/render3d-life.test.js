import {test} from 'node:test';
import assert from 'node:assert/strict';
import {suburbLife,windowPattern,facadeWindows,carX,trainCars,trainHead,trainPeriod,birdAt,passTime,createTrail,pushTrail,wake,windowLight,pose,crowdPose,noticeAge,companion,onTwos,wrap,SUBURBS,TRACK,CAR_RANGE,PLACE_EN,REACT} from '../src/render3d/life.js';
import {autoInput} from './helpers/auto-input.js';
import {cityChunk,chunkOffset,WINDOW_TILE} from '../src/render3d/geometry.js';
import {ROUTE,SCREEN_METERS} from '../src/scenes.js';
import {createFlight,step,eventInput} from '../src/core.js';
import {eventStats} from '../src/events.js';

const frac=x=>x-Math.floor(x);
test('window pattern drives the texture and the wake windows sit on dark cells of the front face',()=>{
 const p=windowPattern();assert.equal(p.length,64);assert.deepEqual(p,windowPattern());const lit=p.filter(c=>c.lit).length;assert.ok(lit>10&&lit<40);
 const b=[0,1,2,3].flatMap(s=>cityChunk(s).blocks.filter(k=>k.tone===0)).sort((x,y)=>facadeWindows(y,p).length-facadeWindows(x,p).length)[0],ws=facadeWindows(b,p);assert.ok(ws.length>4);
 for(const w of ws){assert.ok(w.x-w.w/2>=b.x&&w.x+w.w/2<=b.x+b.w&&w.y+w.h/2<=b.h&&w.y-w.h/2>=0);assert.ok(Math.abs(w.z-(b.z+b.d/2))<.1);
  const u=frac((w.x-b.x)/WINDOW_TILE.w+b.ou),v=frac(w.y/WINDOW_TILE.h+b.ov),col=Math.floor(u*8),row=Math.floor((1-v)*8);
  assert.equal(p[row*8+col].lit,false,'window on a dark texel');}
});
test('suburb layout: deterministic, inside places 1–4, nothing between the camera and the plane',()=>{
 const L=suburbLife();assert.deepEqual(L,suburbLife());assert.equal(SUBURBS.x1,4*SCREEN_METERS);
 for(const k of ['cars','people','chimneys','windows','laundry','bunting','pinwheels','stalls','flocks','balloons','clouds'])assert.ok(L[k].length>0,k);
 for(const k of ['drones','robot','billboard'])assert.equal(L[k],undefined,`H0: ${k} pryč`);
 assert.ok(L.people.filter(p=>p.crowd).length>=50,'market crowd');assert.ok(L.people.some(p=>p.place===0)&&L.people.some(p=>p.place===3));
 for(const p of L.people){assert.ok(p.x>=-15&&p.x<=SUBURBS.x1+30&&p.z<-3,'person behind the plane');assert.ok(REACT[p.kind]);}
 for(const c of L.cars)assert.ok(c.z+.9<-3&&c.speed>0);
 for(const s of L.static)assert.ok(Number.isFinite(s.x+s.w+s.h+s.z+s.d)&&s.w>0&&s.h>0&&s.z+s.d/2<-3,'static decor behind the plane');
 const roofs=[0,1,2,3].flatMap(s=>cityChunk(s).blocks.map(b=>({...b,x:b.x+chunkOffset(s)})));// chunks are local, life is in world metres
 for(const p of L.people.filter(p=>p.y>1))assert.ok(roofs.some(b=>Math.abs(b.h-p.y)<1e-9&&p.x>=b.x&&p.x<=b.x+b.w),'roof people stand on a roof');
 const s1=L.stalls.every(s=>s.x>=SCREEN_METERS&&s.x+s.w<=2*SCREEN_METERS);assert.ok(s1,'stalls on the market');
});
test('traffic and train: continuous, wrap in range, train leaves the tunnel in order',()=>{
 const c={x0:100,dir:1,speed:10};assert.equal(carX(c,1),110);assert.equal(carX({...c,dir:-1},1),90);
 for(let t=0;t<200;t+=.37){const x=carX(c,t);assert.ok(x>=CAR_RANGE[0]&&x<CAR_RANGE[1]);}
 assert.equal(trainHead(0),TRACK.portal);assert.ok(Math.abs(trainHead(trainPeriod()+1)-trainHead(1))<1e-9);
 assert.ok(trainCars(0).every(x=>x===null),'all inside the tunnel at t=0');
 const mid=trainCars(30);assert.ok(mid.filter(x=>x!==null).length===TRACK.cars);for(let i=1;i<mid.length;i++)assert.ok(Math.abs(mid[i-1]-mid[i]-(TRACK.len+TRACK.gap))<1e-9);
 const fl={x0:0,y:40,z:-100,v:6,n:9,seed:1};assert.equal(birdAt(fl,3,0).flap,birdAt(fl,3,.04).flap,'flap on twos');
});
test('trail: pass time is interpolated, unreached points return null; wake and window light envelopes',()=>{
 const h=createTrail();for(let i=0;i<=10;i++)pushTrail(h,i,i*10,20+i);pushTrail(h,11,100,99);assert.equal(h.x.length,11,'x must grow');
 assert.deepEqual(passTime(h,25),{t:2.5,y:22.5});assert.equal(passTime(h,101),null);assert.equal(passTime(createTrail(),0),null);
 assert.equal(wake(null,0),0);assert.equal(wake(-1,0),0);assert.ok(wake(.2,0)>wake(1.5,0)&&wake(.2,0)>wake(.2,20));
 assert.equal(windowLight(null,0),0);assert.equal(windowLight(.05,0,0),0,'delay');assert.ok(windowLight(.4,0,0)>=1);assert.ok(windowLight(.23,0,0)>1,'pops past full');
 assert.equal(windowLight(20,0,.5),0,'switches off later');assert.equal(windowLight(1,40,0),0,'only near the flight height');
});
test('reactions: notice 30 m ahead, poses on twos, wave raises the arm, crowd cheers after a hit',()=>{
 const h=createTrail();for(let i=0;i<=100;i++)pushTrail(h,i*.1,i,15);const p={x:60,y:10,kind:'wave',seed:.3};
 assert.ok(Math.abs(noticeAge(h,p,5)-2)<1e-9);assert.equal(noticeAge(h,{...p,x:200},5),null);assert.equal(noticeAge(h,{...p,y:-60},5),null,'too far above');
 assert.deepEqual(pose('wave',null),{yaw:0,arm:0,hop:0});assert.deepEqual(pose('wave',REACT.wave+.1),{yaw:0,arm:0,hop:0});
 const a=pose('wave',1,20),b=pose('wave',1+1/30,20);assert.deepEqual(a,b,'held for 1/12 s');assert.ok(a.arm>1.5&&a.yaw>0);assert.ok(pose('turn',1,-20).yaw<0);
 assert.ok(pose('jump',.4).hop>0);const c={kind:'turn',seed:.5};assert.ok(crowdPose(c,null,0,.5).arm>2,'cheer');assert.equal(crowdPose(c,null,0,null).arm,0);
});
test('autopilot hits every event; companions follow the event phases',()=>{
 for(const model of ['dart','glider'])for(const seed of [1,2,3,7]){const f=createFlight(model,{power:3,paper:3,fold:3},seed);
  for(let i=0;i<60*120&&!f.landed;i++){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);}
  const s=eventStats(f);assert.ok(s.completed>0);assert.equal(s.hits,s.completed,`${model} seed ${seed}`);}
 assert.equal(companion(null,0),null);
 const w=companion({type:'bird',phase:'warning',at:0},.4),i=companion({type:'bird',phase:'interaction',at:0},1);assert.ok(w.dx>i.dx,'pigeon flies in');
 assert.ok(companion({type:'bird',phase:'effect',at:0,result:'perfect',resolvedAt:2},2.5).dx<1,'carries the plane');
 assert.ok(companion({type:'bird',phase:'effect',at:0,result:'miss',resolvedAt:2},3).dy>10,'leaves with the baguette');
 assert.ok(companion({type:'gust',phase:'interaction',at:0},1).steam>0);
});
