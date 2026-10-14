import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planeShape,boxVertices,pyramidVertices,mergeBlocks,cityChunk,follow,sideCamera,tempoZoom,tempoPx,faceNormal,PLANE_OFFSET,LAYERS,KIND_PARAMS} from '../prototype/3d/geometry.js';
import {ROUTE,SCREEN_METERS} from '../src/scenes.js';
import {createFlight,step} from '../src/core.js';

const finite=a=>a.every(Number.isFinite),tri=(p,i)=>[p.slice(i*9,i*9+3),p.slice(i*9+3,i*9+6),p.slice(i*9+6,i*9+9)];
test('paper plane: a few finite triangles, nose forward, wings up, keel below',()=>{
 for(const model of ['dart','glider']){
  const s=planeShape(model),n=s.positions.length/9;
  assert.equal(n,s.triangles);assert.ok(n>=4&&n<=8,model);assert.ok(finite(s.positions)&&finite(s.normals)&&finite(s.outline));
  assert.equal(s.normals.length,s.positions.length);assert.equal(s.creases.length,12);
  const xs=s.positions.filter((_,i)=>i%3===0),ys=s.positions.filter((_,i)=>i%3===1);
  assert.ok(Math.max(...xs)>.4&&Math.min(...xs)<-.4);assert.ok(Math.min(...ys)<-.05);
  for(let i=0;i<n;i++){const t=tri(s.positions,i),nn=faceNormal(...t);assert.ok(Math.abs(Math.hypot(...nn)-1)<1e-9);
   // Wings (all vertices at y>=0) face up; outline directions are unit vectors.
   if(t.every(v=>v[1]>=0)&&t.some(v=>Math.abs(v[2])>.1))assert.ok(nn[1]>0,`${model} wing ${i} faces up`);}
  for(let i=0;i<s.outline.length;i+=3)assert.ok(Math.abs(Math.hypot(...s.outline.slice(i,i+3))-1)<1e-9);
 }
 assert.ok(planeShape('glider').triangles>planeShape('dart').triangles);
});
test('box: 5 faces (no bottom), outward normals, corner outline ±1, roof uv on the dark texel',()=>{
 const b={x:10,w:8,z:-20,d:6,h:12,ou:.25,ov:.5},v=boxVertices(b),c=[14,6,-20];
 assert.equal(v.positions.length/3,30);assert.equal(v.uvs.length/2,30);
 for(let i=0;i<10;i++){const t=tri(v.positions,i),n=faceNormal(...t),mid=t.reduce((a,p)=>a.map((x,j)=>x+p[j]/3),[0,0,0]);
  assert.ok(n.reduce((s,x,j)=>s+x*(mid[j]-c[j]),0)>0,'normal points outward');const r=a=>a.map(x=>Math.round(x)+0);assert.deepEqual(r(n),r(v.normals.slice(i*9,i*9+3)));}
 assert.ok(v.outline.every(x=>Math.abs(x)===1));
 for(let i=0;i<30;i++)if(v.normals[i*3+1]>.5)assert.deepEqual(v.uvs.slice(i*2,i*2+2),[.002,.002]);
 const p=pyramidVertices({x:0,w:4,z:0,d:4,h:6});assert.equal(p.positions.length/3,12);assert.ok(Math.max(...p.positions.filter((_,i)=>i%3===1))===6);
});
test('merge: one buffer per layer with per-block colours',()=>{
 const blocks=[{x:0,w:2,z:-10,d:2,h:3,c:[1,0,0]},{type:'pyramid',x:5,w:2,z:-10,d:2,h:3,c:[0,1,0]}],m=mergeBlocks(blocks,b=>b.c);
 assert.equal(m.count,42);assert.equal(m.position.length,126);assert.equal(m.uv.length,84);
 assert.deepEqual([...m.color.slice(0,3)],[1,0,0]);assert.deepEqual([...m.color.slice(-3)],[0,1,0]);
});
test('city chunks follow the route: deterministic, inside their stretch, behind the flight corridor',()=>{
 assert.deepEqual(Object.keys(KIND_PARAMS).sort(),ROUTE.map(r=>r.kind).sort());
 for(let screen=0;screen<32;screen++){
  const a=cityChunk(screen),b=cityChunk(screen);assert.deepEqual(a,b);
  assert.equal(a.kind,ROUTE[screen%16].kind);assert.equal(a.biome,Math.floor(screen%16/4));assert.equal(a.ground.water,a.biome===1);
  assert.ok(a.blocks.length>3,`${a.kind} has buildings`);
  for(const k of a.blocks){assert.ok(finite([k.x,k.w,k.z,k.d,k.h,k.y])&&k.w>0&&k.d>0&&k.h>0);
   // Nothing stands between the camera and the plane (z = 0) except low lamps (lamps are separate).
   assert.ok(k.z+k.d/2<-3,`${a.kind} block in front of the plane`);
   if(!k.shop&&k.tone!==5&&k.type!=='pyramid')assert.ok(k.x>=a.x0-15&&k.x+k.w<=a.x1+30,`${a.kind} block stays near its stretch`);}
  for(const s of a.signs){assert.ok(s.w>0&&s.h>0&&s.text.length>0&&/^#[0-9a-f]{6}$/.test(s.color));}
  for(const l of a.lamps)assert.ok(l.h<=6&&l.z>0);
 }
 assert.ok(cityChunk(0).blocks.some(b=>b.shop)&&cityChunk(0).signs.some(s=>s.text==='PAPER LAB'));
 assert.ok(cityChunk(14).blocks.some(b=>b.h>=180),'broadcast tower');
 assert.ok(Math.max(...cityChunk(15).blocks.filter(b=>b.z<=LAYERS.far+10).map(b=>b.h))>Math.max(...cityChunk(8).blocks.filter(b=>b.z<=LAYERS.far+10).map(b=>b.h)),'core skyline taller than fields');
});
test('camera matches render.view(f) of the game at the game scale',async()=>{
 globalThis.Image??=class{};// backgrounds.js loads sky SVGs at import time; Node has no Image
 const {view}=await import('../src/render.js'),f=createFlight('dart');
 for(let i=0;i<2400&&!f.landed;i++){step(f);if(i%40)continue;
  const v=view(f),c=follow(f.x+PLANE_OFFSET,f.y),left=c.cx-c.width/2,top=c.cy+c.height/2,ppm=640/c.width;
  assert.ok(Math.abs((f.x+PLANE_OFFSET-left)*ppm-v.px)<1e-6);assert.ok(Math.abs((top-f.y)*ppm-v.py)<1e-6);
  assert.ok(Math.abs((top-0)*ppm-v.ground)<1e-6,'ground line');}
 const high=createFlight('dart');high.y=300;const v=view(high),c=follow(PLANE_OFFSET,300);assert.ok(c.lift>0);assert.ok(Math.abs((c.cy+c.height/2-300)*640/c.width-v.py)<1e-6);
});
test('tempo zoom and side camera',()=>{
 assert.equal(tempoZoom(1),1);assert.equal(tempoZoom(100),.7);assert.ok(Math.abs(tempoZoom(5)-.86)<1e-12);
 assert.equal(tempoPx(1)*640,148);assert.ok(Math.abs(tempoPx(100)*640-120)<1e-9);
 const v=follow(100,10,{width:120}),c=sideCamera(v,20,0);
 assert.ok(Math.abs(2*c.dist*Math.tan(10*Math.PI/180)-v.height)<1e-9);assert.deepEqual(c.position.slice(0,2),[v.cx,v.cy]);
 assert.ok(sideCamera(v,20,6).position[1]>v.cy);assert.ok(SCREEN_METERS>300);
});
