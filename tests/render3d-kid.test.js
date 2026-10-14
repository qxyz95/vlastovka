import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {KID,KID_MESH,KID_POSES,POSES,JOINT,ARM_LEN,kidColors,kidJoints,armToward} from '../src/render3d/models/kid.js';
import {kidRig,poseKid,kidLod,kidDrawRange,KID_LOD,KID_AT,KID_SCALE} from '../src/render3d/models/kid-rig.js';
import {modelById,buildModel,modelTriangles,LAUNCH} from '../src/render3d/models/index.js';
import {lathe} from '../src/render3d/models/parts.js';
import {cardTriangles,cardVertices} from '../src/render3d/paper-cards.js';
import {kidPose,HAND,KID_THROW} from '../src/render3d/pose.js';
import {planFrame} from '../src/render3d/frame.js';
import {PAPIR,PAPER_TOKENS as PT} from '../src/render3d/palette.js';

// Dávka H2: dítě C (research/plan-hratelnost/03-art.md kap. 1.3–1.8, bible 05 kap. 9.4).
const THREE_URL=new URL('../vendor/three/three.module.min.js',import.meta.url).href;
registerHooks({resolve:(spec,ctx,next)=>spec==='three'?{url:THREE_URL,shortCircuit:true}:next(spec,ctx)});
globalThis.document??={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:()=>()=>{},set:()=>true})})};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const phases=[['idle',{phase:'idle'}],['aim',kidPose({rest:true})],['charge',kidPose({rest:true,charge:.6})],['throw',kidPose({thrown:true,rest:false,since:.12})],
 ['wave',kidPose({thrown:true,rest:false,since:2,t:.4})],['desk',kidPose({rest:true,state:'workshop'})],['sit',{phase:'sit'}]];

test('kid C triangles: LOD H 630, LOD 1 130 (tab. 1.3), LOD 2 none; cap [760, 160, 0]; lathe poles are fans, caps on request',()=>{
 assert.deepEqual(KID_MESH.map(m=>m.count/3),[630,130]);const m=modelById('kid');assert.deepEqual([...m.tris],[760,160,0]);
 for(const pose of POSES){assert.equal(modelTriangles(m,0,{pose}),630,pose);assert.equal(modelTriangles(m,1,{pose}),130,pose);assert.deepEqual(buildModel(m,2,{pose}),[]);}
 const by=(lod,part)=>KID_MESH[lod].parts.filter(p=>p.part===part).reduce((s,p)=>s+p.count/3,0);
 assert.deepEqual(['head','hair','eye','cap','capBand','coat','arm','hand','legs','shoe'].map(p=>by(0,p)),[160,40,4,60,24,126,64,24,64,64]);
 assert.deepEqual(['hand','shoe','eye'].map(p=>by(1,p)),[0,0,0],'LOD 1 bez dlaní, bot a očí');
 assert.equal(lathe([[0,0,0],[1,1,1],[2,0,0]],6).p.length/9,12,'two poles = 2 fans');assert.equal(lathe([[0,1,1],[1,1,1]],6,{top:true,bot:true}).p.length/9,12+8);
 assert.equal(cardTriangles(buildModel('kid',0)),cardVertices(buildModel('kid',0)).p.length/9);
});

test('kid LOD hysteresis: LOD 1 below 44 px, back to LOD H above 52 px; one buffer [H][flag][1] with draw ranges',()=>{
 assert.deepEqual([KID_LOD.down,KID_LOD.up],[44,52]);
 let l=0;const seq=[96,60,50,45,43,47,50,52,53,48,44,43.9].map(px=>(l=kidLod(px,l)));assert.deepEqual(seq,[0,0,0,0,1,1,1,1,0,0,0,1]);
 assert.equal(kidLod(NaN,1),1);assert.equal(kidLod(undefined,0),0);
 const rig=kidRig(),[h0,h1]=rig.ranges.h,[f0,f1]=rig.ranges.flag,[l0,l1]=rig.ranges.l1;
 assert.deepEqual([h0,h1-h0,f1,l1-l0,l0],[0,1890,f0+(f1-f0),390,f1]);assert.equal(rig.count,l1);
 assert.deepEqual(kidDrawRange(rig,0),[0,f1],'LOD H + flag');assert.deepEqual(kidDrawRange(rig,1),[f0,rig.count-f0],'flag + LOD 1');
 // výška dítěte z plánu: míření 96 px desktop, 64 px telefon na výšku (LOD H)
 const px=css=>planFrame({time:1,visual:{cssWidth:css,state:'aim'}}).kid.px;assert.ok(Math.abs(px(1280)-95.2)<1&&Math.abs(px(375)-63.75)<1);assert.equal(kidLod(px(375),0),0);
});

test('kid poses: joints within limits, fixed arm length, the throwing arm T is the far one, palm T on the launch point and on the plane while charging, feet move only by back',()=>{
 const rig=kidRig(),J=()=>rig.J,at=j=>[J()[j*12+9],J()[j*12+10],J()[j*12+11]];
 for(const [name,k] of phases){poseKid(rig,k,name==='aim'||name==='charge'?HAND:null,{t:.7});const A=rig.A;
  assert.ok(A.yaw>=.2&&A.yaw<=.95,`${name} yaw ${A.yaw}`);assert.ok(Math.abs(A.lean)<=.2&&Math.abs(A.head[0])<=.4&&Math.abs(A.head[1])<=.45,`${name} lean/head`);
  for(const a of [A.armT,A.armF])assert.ok(Math.abs(a[0])<=Math.PI&&Math.abs(a[1])<=.6,`${name} arm ${a}`);assert.ok([A.legR,A.legL].every(v=>v>=-.3&&v<=1.55),`${name} legs`);
  for(const [arm,hand] of [[JOINT.armT,JOINT.handT],[JOINT.armF,JOINT.handF]])assert.ok(Math.abs(dist(at(arm),at(hand))-ARM_LEN)<1e-9,`${name}: arm length fixed`);
  assert.ok(at(JOINT.armT)[2]<at(JOINT.armF)[2],`${name}: T shoulder is farther from the camera (−z)`);}
 // míření: dlaň T přesně v bodě výhozu (M-3)
 poseKid(rig,kidPose({rest:true}),HAND,{reduced:true});assert.ok(dist(at(JOINT.handT),[HAND.x,HAND.y,HAND.z])<1e-3);assert.ok(rig.palms[5]>rig.palms[2],'F nearer the camera');
 // nabíjení 0 → 1 se skutečnou polohou vlaštovky (planePose) na šířkách 360–1920: |dlaň T − vlaštovka| ≤ 5 cm; chodidla jen o back
 const shoe=()=>{const r=KID_MESH[0].parts.filter(p=>p.part==='shoe');let x=0,n=0,y=Infinity;for(const p of r)for(let v=p.start;v<p.start+p.count;v++){x+=rig.positions[v*3];y=Math.min(y,rig.positions[v*3+1]);n++;}return [x/n,y];};
 for(const css of [360,390,768,1280,1920])for(const c of [0,.25,.5,.75,1]){const p=planFrame({time:1.3,visual:{cssWidth:css,charge:c,state:'aim'}}),h={x:HAND.x+p.hand.dx,y:HAND.y+p.hand.dy,z:HAND.z};
  poseKid(rig,p.kid,h,{t:1.3});assert.ok(Math.hypot(rig.last[2]-h.x,rig.last[3]-h.y,rig.last[5]-h.z)<=.05,`css ${css} charge ${c}`);}
 poseKid(rig,kidPose({rest:true}),HAND,{reduced:true});const [x0]=shoe();const k=kidPose({rest:true,charge:1});poseKid(rig,k,{x:HAND.x-.246,y:12},{reduced:true});const [x1,y1]=shoe();
 assert.ok(Math.abs(x1-x0+k.back*KID_SCALE)<.03,`feet moved ${x1-x0} vs back ${-k.back*KID_SCALE}`);assert.ok(y1>LAUNCH.floor-.015,'no sinking into the deck');
 // výhoz: švih z posledního úhlu ruky T do [1,9; 0,1]; ruka F ukazuje úhel mířidel
 poseKid(rig,kidPose({thrown:true,rest:false,since:KID_THROW*(1-1e-9)}),null);assert.ok(Math.abs(rig.A.armT[0]-KID_POSES.throw.armT[0])<1e-6);
 poseKid(rig,{...kidPose({rest:true}),aim:30},HAND);assert.ok(Math.abs(rig.A.armF[0]-(Math.PI/2+Math.PI/6))<1e-9,'F follows the aim angle');
 // armToward míří přesně, když je cíl v dosahu
 const o=armToward(.2,.4,-.1,.1);const d=[Math.sin(o[0]),-Math.cos(o[0])*Math.cos(o[1]),-Math.cos(o[0])*Math.sin(o[1])],u=[.2,.4,-.1].map(v=>v/Math.hypot(.2,.4,.1));assert.ok(dist(d,u)<1e-9);
});

test('kid normals: unit length after poseKid, pointing out of their part; reduced motion is independent of time; poseKid writes the same arrays',()=>{
 const rig=kidRig(),pos=rig.positions,nor=rig.normals;
 for(const lod of [0,1])for(const [name,k] of phases){const L=poseKid(rig,k,name==='aim'?HAND:null,{t:1.1,lod});assert.equal(L,rig.last);assert.equal(rig.positions,pos);assert.equal(rig.normals,nor);
  const off=lod?rig.ranges.l1[0]:0;
  for(const p of KID_MESH[lod].parts){let c=[0,0,0];for(let v=p.start;v<p.start+p.count;v++)for(let i=0;i<3;i++)c[i]+=pos[(off+v)*3+i]/p.count;
   for(let v=p.start;v<p.start+p.count;v+=3){const i=(off+v)*3,n=[nor[i],nor[i+1],nor[i+2]];assert.ok(Math.abs(Math.hypot(...n)-1)<1e-5,`${name} ${p.part} |n|`);
    if(p.part==='eye')continue;const t=[0,1,2].map(a=>(pos[i+a]+pos[i+3+a]+pos[i+6+a])/3-c[a]);assert.ok(n[0]*t[0]+n[1]*t[1]+n[2]*t[2]>0,`${name} LOD ${lod} ${p.part}: normal points out`);}}}
 for(const [name,k] of phases){const snap=t=>{poseKid(rig,{...k,bob:0},name==='aim'||name==='charge'?HAND:null,{t,reduced:true});return Array.from(pos);};assert.deepEqual(snap(.3),snap(1.7),`${name}: reduced motion still`);}
 const breathe=t=>{poseKid(rig,{phase:'idle'},null,{t,lod:0});return pos[KID_MESH[0].parts.find(p=>p.part==='head').start*3+1];};
 const ys=[.1,.3,.5,.7,.9].map(breathe);assert.ok(Math.max(...ys)-Math.min(...ys)>.005&&Math.max(...ys)-Math.min(...ys)<=.021,'breathing ±1 cm');assert.equal(breathe(.30),breathe(.31),'on twos');
});

test('kid colours only from tokens (bible 9.4), no outline, no mustard, white or graphite',()=>{
 const c=kidColors(),W=PAPIR.workshop;assert.deepEqual(c,{coat:'#f2b65a',legs:'#3d4f7a',skin:'#f3d2b4',hair:PT.pencil700,cap:PT.kraft,capBand:PT.tomato,shoe:PT.pencil700,eye:PT.pencil700});
 assert.deepEqual([PT.pencil700,PT.kraft,PT.tomato,W.shirt,W.legs,W.skin],['#4a4038','#c9a57c','#d9472b','#f2b65a','#3d4f7a','#f3d2b4']);
 const all=new Set([...KID_MESH[0].color,...KID_MESH[1].color]);for(const h of all)assert.ok(Object.values(c).includes(h)&&![PT.mustard,PT.paper,PT.graphite].includes(h),h);
 assert.ok(KID_MESH[0].parts.filter(p=>p.joint===JOINT.armT||p.joint===JOINT.armF).every(p=>p.color===c.coat),'sleeves in the coat colour');
});

test('kidMaterial: ramp per face (03 kap. 1.5), shared kit uniforms; plane in hand drawn over the kid by a view-space depth bias (keeps its own depth order)',async()=>{
 const {kidShade,kidMaterial,KID_SHADE,paperKit}=await import('../src/render3d/paper.js'),{createWorkshop,handDepthBias,biasChunk,HAND_DEPTH}=await import('../src/render3d/workshop.js');
 const col=[1,.5,0],cut=[1,1,1],side=[0,0,.5],eq=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<1e-9);
 assert.ok(eq(kidShade([0,1,0],col,cut,side),[1,.625,.25]),'top mix(cut, .25)');assert.ok(eq(kidShade([0,-1,0],col,cut,side),[.58,.29,.21]),'bottom mix(side, .42)');
 assert.ok(eq(kidShade([0,0,1],col,cut,side),[1,.515,.03]),'facing the camera: mix(cut, .03)');
 const s=kidShade([-1,0,0],col,cut,side);assert.ok(eq(s,[.68,.34,.16]),'side away from the sun: mix(side, .32)');
 const lit=kidShade([.7071,0,.7071],col,cut,side),dark=kidShade([-.7071,0,.7071],col,cut,side);assert.ok(lit[0]>dark[0],'sunward side lighter');
 assert.deepEqual([KID_SHADE.topK,KID_SHADE.bottomK,KID_SHADE.side,KID_SHADE.lit],[.25,.42,.32,.08]);assert.equal(PAPIR.city.cut,'#fffaf0');assert.equal(PAPIR.city.side,'#5b4f7a');
 const kit=paperKit(),m=kidMaterial(kit.uniforms);assert.equal(m.uniforms.cut,kit.uniforms.cut);assert.equal(m.uniforms.fiberOn,kit.uniforms.fiberOn);assert.ok(m.vertexColors&&!m.uniforms.tMask,'no mask shadow, no outline');
 assert.match(m.fragmentShader,/smoothstep\(0\.50,0\.95,n\.z\)/);m.dispose();
 // jedna síť dítěte + praporku, drawRange podle px
 const g=createWorkshop(null,{paper:kit}),hero=g.userData.kid,dr=()=>[hero.geometry.drawRange.start,hero.geometry.drawRange.count],rig=g.userData.rig;
 assert.deepEqual(dr(),kidDrawRange(rig,0));g.update({...kidPose({rest:true}),px:30},{dx:0,dy:0,angle:0,squash:[1,1]});assert.deepEqual(dr(),kidDrawRange(rig,1),'LOD 1 under 44 px');
 g.update({...kidPose({rest:true}),px:50},{dx:0,dy:0,angle:0,squash:[1,1]});assert.deepEqual(dr(),kidDrawRange(rig,1),'hysteresis');
 g.update({...kidPose({rest:true}),px:96},{dx:0,dy:0,angle:0,squash:[1,1]});assert.deepEqual(dr(),kidDrawRange(rig,0));
 assert.equal(hero.geometry.attributes.normal.usage,hero.geometry.attributes.position.usage,'normals dynamic too');
 // klid: vlaštovka mezi oběma dlaněmi
 g.update({phase:'idle',px:60},{dx:0,dy:0,angle:0,squash:[1,1]});const P=rig.palms,pl=g.userData.plane.position;assert.ok(Math.abs(pl.x-(P[0]+P[3])/2)<1e-9&&Math.abs(pl.y-(P[1]+P[4])/2)<1e-9);
 // vlaštovka v ruce: posun hloubky (ne depthTest:false), obrys razítkem jen 0,15 m za ní
 const meshes=g.userData.plane.getObjectsByProperty('isMesh',true).concat(g.userData.plane.getObjectsByProperty('isLineSegments',true)).filter(o=>!o.userData.shadow);
 assert.ok(meshes.length>=3&&meshes.every(o=>o.material.userData.handBias===HAND_DEPTH.bias&&o.material.depthTest!==false),'mesh, hull and crease biased, depth test on');
 const sh={vertexShader:'a\n#include <project_vertex>\nb'};meshes.find(o=>o.material.isMeshBasicMaterial).material.onBeforeCompile(sh);assert.match(sh.vertexShader,/mvPosition\.xyz\*=max\(\.05,\(-mvPosition\.z-0\.60\)/);
 assert.equal(biasChunk('x'),'x');const hull=g.userData.outlines[0];assert.match(hull.vertexShader,/mv\.xyz\*=max\(\.05,\(-mv\.z-0\.60\)/);assert.equal(hull.uniforms.push.value,HAND_DEPTH.push);
 assert.ok(HAND_DEPTH.push<HAND_DEPTH.bias-.3,'outline stays in front of the kid (cap ≤ 0,3 m in front of the plane)');
 g.dispose();kit.dispose();
});
