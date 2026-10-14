import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planFrame,planeLength,planeSizeScale,PLANE_SIZE,PLANE_NARROW} from '../src/render3d/frame.js';
import {createFlight,step} from '../src/core.js';
import {eventInput} from '../src/events.js';
import {autoInput} from './helpers/auto-input.js';

// S3 velikost vlaštovky (research/start/02 M-2, 01 §3.7): délka podle šířky záběru, na úzké scéně aspoň 24 CSS px.
const near=(a,b,eps,msg)=>assert.ok(Math.abs(a-b)<=eps,`${msg}: ${a} vs ${b}`);
test('L(W) = 0,5·(W/16)^1,36: 0,5 m in the hand at 16 m, 7,75 m at 120 m, constant above; grows on screen while zooming out',()=>{
 near(planeLength(16,1280),.5,1e-12,'hand');near(planeLength(120,1280),7.75,.03,'flight');assert.equal(planeLength(250,1280),PLANE_SIZE.max);
 near(planeLength(16,1280)/16*1280,40,1e-9,'40 px in the hand at 1280');near(planeLength(120,1280)/120*1280,82.7,.5,'~83 px at 120 m');
 let last=0;for(let W=16;W<=120;W+=.5){const px=planeLength(W,1280)/W*1280;assert.ok(px>=last-1e-9,'screen size never shrinks during the pull-out');last=px;}
});
test('narrow scene (< 500 CSS px): plane ≥ 24 CSS px at any width; continuous in W; wide scene unchanged',()=>{
 for(const css of [360,390,499])for(let W=5;W<=320;W+=1.5){assert.ok(planeLength(W,css)/W*css>=PLANE_SIZE.minPx-1e-9,`css ${css} W ${W}`);
  near(planeLength(W+.01,css),planeLength(W,css),.01,'continuous');}
 assert.equal(planeLength(200,PLANE_NARROW.width),PLANE_SIZE.max,'500 px and wider: no floor');
 assert.equal(planeSizeScale(120,'papir',390),planeLength(120,390)/PLANE_SIZE.max*1.15);assert.equal(planeSizeScale(120,'cyber',390),planeLength(120,390)/PLANE_SIZE.max);
});
test('flight on a 360 px scene: plan.plane.scale keeps the plane ≥ 24 CSS px in every frame (both styles)',()=>{
 for(const style of ['cyber','papir']){const f=createFlight('dart',{power:5,paper:5,fold:5},3);let prev=planFrame({f:null,state:'aim',visual:{clock:0,cssWidth:360,style}}),n=0;
  while(!f.landed&&f.t<120){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);prev=planFrame({f,prev,time:f.t,visual:{cssWidth:360,style}});
   const len=prev.plane.scale*PLANE_SIZE.max/(style==='papir'?1.15:1);assert.ok(len/prev.camera.width*360>=24-1e-9,`${style} t ${f.t}`);n++;}
  assert.ok(n>300);}
});
