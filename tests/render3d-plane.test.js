import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {MOOD_KEYS} from '../src/render3d/mood.js';
import {CYBER,INK} from '../src/render3d/palette.js';

// plane.js is a three.js module: map the bare 'three' import to the vendored build (as the import map does in the browser).
const THREE_URL=new URL('../vendor/three/three.module.min.js',import.meta.url).href;
registerHooks({resolve:(spec,ctx,next)=>spec==='three'?{url:THREE_URL,shortCircuit:true}:next(spec,ctx)});
const THREE=await import('three');
const {PLANE_SCALE,TRAIL,paperShade,paperMaterial,trailProfile,createPlane}=await import('../src/render3d/plane.js');
const lin=h=>new THREE.Color(h).toArray(),lum=([r,g,b])=>.2126*r+.7152*g+.0722*b;
const ctx=()=>({ramp:null,planeHull:new THREE.MeshBasicMaterial(),palette:CYBER,scale:PLANE_SCALE});

test('U13: one PLANE_SCALE = 7.75 m',()=>{assert.equal(PLANE_SCALE,7.75);assert.equal(createPlane(ctx()).current.root.scale.x,7.75);});

test('U1: paper stays white, district light tints and shades it by at most maxTint (luminance ≥ 80 % in every mood)',()=>{
 const t=CYBER.plane.maxTint;assert.equal(t,.2);assert.equal(CYBER.plane.fill,'#ffffff');
 const add=(...l)=>l.reduce((s,c)=>s.map((v,i)=>v+c[i]),[0,0,0]),sc=(c,k)=>c.map(v=>v*k);
 for(const m of MOOD_KEYS){
  const key=sc(lin(m.key.color),m.key.intensity/Math.PI),hemi=sc(lin(m.hemi.sky),m.hemi.intensity/Math.PI),rim=sc(lin(m.rim.color),m.rim.intensity/Math.PI);
  for(const lit of [add(key,hemi,rim),add(key,hemi),hemi,sc(hemi,.3),[0,0,0]]){const out=paperShade(lit,t);
   assert.ok(lum(out)>=.8-1e-9,`${m.name}: luminance ${lum(out)}`);for(const v of out)assert.ok(v>=1-t-1e-9&&v<=1+1e-9,`${m.name}: channel ${v} within maxTint`);}
 }
 for(const lit of [[1,0,0],[0,0,1],[0,1,0],[5,5,5]])assert.ok(lum(paperShade(lit,t))>=.8);
 assert.deepEqual(paperShade([.9,.9,.9],t),[1,1,1],'bright white light = pure paper');
 assert.ok(paperShade([1,.2,.05],t)[2]<paperShade([1,.9,.8],t)[2],'hue of the light survives (lightly)');
});

test('U1: paper material injects the tint into the toon shader, no fog, uniform from the palette',()=>{
 const m=paperMaterial('#ffffff',null,.2),s={uniforms:{},fragmentShader:THREE.ShaderLib.toon.fragmentShader};m.onBeforeCompile(s);
 assert.equal(m.fog,false);assert.equal(s.uniforms.paperTint.value,.2);assert.equal(s.uniforms.paperTint,m.userData.paperTint);
 assert.match(s.fragmentShader,/^uniform float paperTint;/);assert.match(s.fragmentShader,/outgoingLight=1\.-paperTint\*\(1\.-pq\);}\n#include <opaque_fragment>/);
 const p=createPlane(ctx()).current;assert.equal(p.mesh.material.userData.paperTint.value,CYBER.plane.maxTint);
});

test('U3: trail profile, ≥ 2 CSS px wide with an ink edge ≥ 1 CSS px on both sides at any zoom and DPR',()=>{
 for(const dpr of [1,1.5,2])for(const proj of [0,.3,1,2,3,6,12,40]){const {half,edge,core}=trailProfile(proj*dpr,dpr);
  assert.ok(2*half>=2*dpr,'width ≥ 2 CSS px');assert.ok(edge>=dpr-1e-9,'edge ≥ 1 CSS px');assert.ok(core>0,'district colour core visible');assert.ok(half>=proj*dpr);}
 assert.deepEqual(trailProfile(0,1),{half:2,edge:1,core:2});assert.equal(TRAIL.minHalf,2);assert.equal(TRAIL.edge,1);
});

test('U3: trail ribbon, two vertices per point (side ±1), ink edge, district core colour, fixed buffers, reset on a new throw',()=>{
 const pl=createPlane(ctx()),tr=pl.trail,geo=tr.mesh.geometry,buf=geo.attributes.position.array;
 assert.equal(tr.mesh.visible,false);assert.equal(geo.attributes.position.count,TRAIL.points*2);
 assert.deepEqual([...geo.attributes.side.array.slice(0,4)],[-1,1,-1,1]);
 assert.equal(tr.uniforms.edge.value.getHexString(),INK.slice(1),'edge = trailEdge = ink');
 for(let i=0;i<20;i++)pl.apply({x:i*2,y:30+i*.5,angle:-.1},{flying:true,trailColor:'#ff4f9e'});
 assert.equal(tr.uniforms.core.value.getHexString(),'ff4f9e');assert.ok(tr.mesh.visible);assert.equal(tr.points.length,20);
 assert.equal(geo.attributes.position.array,buf,'no reallocation per frame');
 const n=tr.points.length-1,a=geo.attributes.alpha.array,h=geo.attributes.halfW.array,d=geo.attributes.dir.array;
 assert.equal(a[n*2],1);assert.equal(a[0],0);assert.ok(Math.abs(h[n*2]-TRAIL.width)<1e-6);assert.ok(d[n*6]>0,'tangent along the flight');
 const pos=geo.attributes.position.array;assert.equal(pos[n*6],pos[n*6+3]);assert.equal(pos[n*6+1],pos[n*6+4]);
 pl.apply({x:0,y:30,angle:0},{flying:true});assert.equal(tr.points.length,1,'jump back = new throw');assert.equal(tr.mesh.visible,false);
 assert.doesNotThrow(()=>pl.dispose());
});

test('S3: plan.plane.scale sizes the plane in both styles and the trail width follows it',()=>{
 const pl=createPlane(ctx());for(let i=0;i<5;i++)pl.apply({x:i*2,y:30,angle:0,scale:.25},{flying:true});
 assert.equal(pl.current.root.scale.x,PLANE_SCALE*.25);const h=pl.trail.mesh.geometry.attributes.halfW.array;assert.ok(Math.abs(h[4*2]-TRAIL.width*.25)<1e-6,'trail head half width × scale');
 pl.apply({x:10,y:30,angle:0},{flying:true});assert.equal(pl.current.root.scale.x,PLANE_SCALE,'missing scale = 1');pl.dispose();
});
