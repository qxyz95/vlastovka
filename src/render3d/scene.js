// Scéna three.js (renderer, světla, mlha, obloha, post-process, sdílené materiály). Vlastní R1; jen R1 mění tento soubor.
// createScene(canvas,{dpr}) → {renderer,scene,camera,materials,ramp,hull,city,plane,resize(w,h,dpr),apply(plan),draw(),stats(),dispose()}.
// apply(plan) jen zapíše plán snímku (frame.js) do objektů; žádná herní logika, fyziku nečte ani nemění.
import * as THREE from 'three';
import {random} from '../random.js';
import {noise1} from '../motion.js';
import {SCREEN_METERS} from '../scenes.js';
import {hash,createTrail,pushTrail} from './life.js';
import {toonRamp,outlineMaterial,windowTexture,signTexture,skyPainter,postPass} from './toon.js';
import {createCity} from './city.js';
import {createPlane} from './plane.js';
import {createLife} from './life3d.js';
import {createWorkshop} from './workshop.js';
import {palette} from './palette.js';

const C=h=>new THREE.Color(h),col=(v,d)=>typeof v==='string'?v:v?.color??d,num=(v,d)=>typeof v==='object'&&v?.intensity!=null?v.intensity:d;
// Barvy budov z prototypu (palety cyber podle čtvrti, zesvětlené pro toon světlo; Violet Suburbs pastelové podle polohy).
// FALLBACK(R2, palette.js): až palette() dodá barvy budov a země, převzít je odtud.
const BIOMES=[['#322749','#131b31','#ea70c8'],['#294559','#10263a','#78d8ee'],['#63384e','#302638','#ffa66d'],['#44214e','#18142f','#60eed9']],GROUND=['#101a2c','#122e44','#342b38','#101a2c'];
const FOG0='#4a1d63',DUSK_FOG='#9c5598',ACCENT=['#3d7fa8','#a8458f','#c27a3a','#3aa88f'];
const TONES=BIOMES.map((p,b)=>[C(p[0]).lerp(C('#ffffff'),.06),C(p[0]).lerp(C('#1a1240'),.15),C(p[0]).lerp(C(FOG0),.45),C(ACCENT[b]),C('#1d5246'),C('#2b2352')].map(c=>c.toArray()));
const PAL=['#8f6ad8','#c56fb5','#6f86e0','#e08aa0','#5fb0c8','#a58be8','#d98ad0'].map(C),SUB=[PAL,PAL.map(c=>c.clone().lerp(C(DUSK_FOG),.35)),[C('#7a4f9e').lerp(C(DUSK_FOG),.4)]].map(l=>l.map(c=>c.toArray()));
const colorOf=b=>(b.biome??0)===0&&(b.tone??0)<3?(l=>l[Math.floor(hash(Math.floor(b.x*3))*l.length)])(SUB[b.tone??0]):TONES[b.biome??0][b.tone??0];
const PLANE_SCALE=7.75;// měřítko vlaštovky jako v Dílně (R3)

export function createScene(canvas,{dpr=1,shadows=true}={}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.shadowMap.enabled=shadows;renderer.shadowMap.type=THREE.BasicShadowMap;renderer.info.autoReset=false;
 const rt=new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,samples:4}),post=postPass(),sky=skyPainter();
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(20,16/9,1,4000),ramp=toonRamp(),pal=palette('cyber');
 scene.fog=new THREE.Fog(FOG0,300,1100);scene.background=sky.texture;
 // Obrysy: tloušťka v px obrazovky × DPR, mlha ručně v shaderu (vzdálené obrysy mizí s budovami).
 const outlines=[],line=(m,base)=>{outlines.push([m,base]);return m;};
 const hull=line(outlineMaterial({fog:{color:FOG0,near:300,far:1100},thickness:2.5}),2.5),thinHull=line(outlineMaterial({fog:{color:FOG0,near:300,far:1100},thickness:1.7}),1.7);
 const planeHull=line(outlineMaterial({side:THREE.DoubleSide,thickness:2.6,color:pal.plane.outline}),2.6);planeHull.depthWrite=false;
 const signMats=new Map(),signList=[],unit=new THREE.PlaneGeometry(1,1);
 const materials={unit,colorOf,rgb:h=>C(h).toArray(),
  building:new THREE.MeshToonMaterial({vertexColors:true,gradientMap:ramp,emissive:0xffffff,emissiveMap:windowTexture(),emissiveIntensity:1.5}),
  glow:new THREE.MeshBasicMaterial({vertexColors:true}),
  ground:GROUND.map((g,b)=>new THREE.MeshToonMaterial({color:b===1?C('#10294a'):b===0?C('#4b3778'):C(g).lerp(C('#000000'),.25),gradientMap:ramp})),
  sign(text,color,vertical=false){const k=text+color+vertical;if(!signMats.has(k)){const m=new THREE.MeshBasicMaterial({map:signTexture(text,color,vertical),toneMapped:false});signMats.set(k,m);signList.push(m);}return signMats.get(k);},
  hull,thinHull,planeHull};
 // Světla: hemisféra, klíčové (měsíc/slunce se stíny) a růžové protisvětlo.
 const hemi=new THREE.HemisphereLight('#7f73ff','#2a1030',1.15),key=new THREE.DirectionalLight('#ffe8ff',2.3),rim=new THREE.DirectionalLight('#ff4fc3',.9),keyDir=new THREE.Vector3(-.35,.75,.55).normalize();
 key.castShadow=shadows;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0006;key.shadow.normalBias=.04;rim.position.set(.6,.3,-1);scene.add(hemi,key,key.target,rim);
 // Nebe: hvězdy (seedované), měsíc a slunce s halo; skupina jede s kamerou (paralaxa .92).
 const skyG=new THREE.Group(),rng=random(4242);scene.add(skyG);
 const starN=500,sp=new Float32Array(starN*3);for(let i=0;i<starN;i++)sp.set([(rng()-.5)*5200,150+rng()*900,-1800],i*3);
 const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
 const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:'#e8f6ff',size:2,sizeAttenuation:false,fog:false,transparent:true}));skyG.add(stars);
 const disc=(r,c,o=1)=>new THREE.Mesh(new THREE.CircleGeometry(r,48),new THREE.MeshBasicMaterial({color:c,fog:false,transparent:true,opacity:o,depthWrite:false}));
 const moon=disc(70,'#ffe3f4');moon.position.set(420,520,-1700);skyG.add(moon);
 const sunOf=x=>{const g=new THREE.Group(),halo=disc(190,'#ff9ec0',.45),mid=disc(125,'#ffc89a'),core=disc(95,'#ffe6b8');halo.position.z=-20;core.position.z=10;g.add(halo,mid,core);g.position.set(x,70,-1700);skyG.add(g);return {g,halo,mid,core};};
 const suns=[sunOf(260),sunOf(-380)];
 // Město, vlaštovka, Dílna (R3) a živá čtvrť.
 // Dílna a dítě s vlaštovkou v ruce (workshop.js R3); město proto shop bloky z cityChunk(0) nekreslí.
 const workshop=createWorkshop(scene,{ramp,hull,model:'dart',planeScale:PLANE_SCALE});
 let mood=null;
 const city=createCity({scene,materials,ramp,hull,mood:()=>mood,reduced:false,shop:()=>false});scene.add(city.group);
 const plane=createPlane({ramp,planeHull,palette:pal,scale:PLANE_SCALE});scene.add(plane.group);
 // FALLBACK(D1): Violet Suburbs žije zatím přes life3d.js ve světových souřadnicích (místa 0–3); D1 ji přesune do districts/suburbs.js.
 const life=createLife({ramp,hull,thinHull});scene.add(life.group);
 let trail=createTrail(),lastX=Infinity,usePost=true,size=[4,4];
 function resize(w,h,d=dpr){dpr=d;renderer.setPixelRatio(d);renderer.setSize(w,h,false);size=[w,h];const b=renderer.getDrawingBufferSize(new THREE.Vector2());rt.setSize(b.x,b.y);
  for(const [m,base] of outlines){m.uniforms.resolution.value.copy(b);m.uniforms.thickness.value=base*d;}
  for(const m of workshop.userData.outlines??[])m.uniforms.resolution.value.copy(b);post.mat.uniforms.resolution.value.copy(b);}
 function apply(plan){
  const m=plan.mood,cam=plan.camera,sh=cam.shake??{},X=plan.X,Y=plan.Y,t=plan.t;mood=m;
  // Kamera: Follow + otřes (m) a náklon (rad) kolem osy pohledu.
  camera.fov=cam.fov;camera.aspect=size[0]/size[1]||16/9;camera.updateProjectionMatrix();
  camera.position.set(cam.position[0]+(sh.dx??0),cam.position[1]+(sh.dy??0),cam.position[2]);camera.lookAt(cam.target[0]+(sh.dx??0),cam.target[1]+(sh.dy??0),cam.target[2]);if(sh.roll)camera.rotateZ(sh.roll);
  // Nálada: mlha (i v obrysech), nebe, světla, slunce/měsíc, hvězdy, okna.
  scene.fog.color.set(m.fog.color);scene.fog.near=m.fog.near;scene.fog.far=m.fog.far;
  for(const o of [...outlines.map(x=>x[0]),...(workshop.userData.outlines??[])])if(o.uniforms.fogNear){o.uniforms.fogColor.value.copy(scene.fog.color);o.uniforms.fogNear.value=m.fog.near;o.uniforms.fogFar.value=m.fog.far;}
  sky.paint(m.sky);hemi.color.set(m.hemi.sky);hemi.groundColor.set(m.hemi.ground);hemi.intensity=m.hemi.intensity;
  key.color.set(col(m.key,'#ffe8ff'));key.intensity=num(m.key,2.3);rim.color.set(col(m.rim,'#ff4fc3'));rim.intensity=num(m.rim,.9);
  if(m.key?.dir)keyDir.set(...m.key.dir).normalize();
  const ext=Math.max(150,cam.width*.9),sc=key.shadow.camera;sc.left=sc.bottom=-ext;sc.right=sc.top=ext;sc.near=1;sc.far=1200;sc.updateProjectionMatrix();
  key.target.position.set(cam.cx,cam.cy*.5,-40);key.position.copy(key.target.position).addScaledVector(keyDir,500);
  // Výška slunce a měsíce = podíl výšky obrazu nad obzorem (mood.js); obzor v hloubce oblohy na 300/360 jako zem ve 2D.
  const D=cam.dist+1700,H=2*D*Math.tan(cam.fov*Math.PI/360),horizon=cam.position[1]-D*Math.tan(6*Math.PI/180)-H*(300/360-.5);
  skyG.position.x=cam.cx*.92;
  [m.sun,m.sun2].forEach((s,i)=>{const o=suns[i],on=typeof s==='object'&&s?s.alpha>0:!!s&&!i;o.g.visible=on;if(on&&typeof s==='object'){o.g.position.y=horizon+s.height*H;o.core.material.color.set(s.color);o.mid.material.color.set(s.color).lerp(C(s.halo),.5);o.halo.material.color.set(s.halo);
   for(const d of [o.core,o.mid])d.material.opacity=s.alpha;o.halo.material.opacity=.45*s.alpha;}else if(on)o.g.position.y=horizon+.1*H;});
  if(m.moon){moon.visible=m.moon.alpha>0;moon.material.color.set(m.moon.color);moon.material.opacity=m.moon.alpha;moon.position.y=horizon-skyG.position.y+m.moon.height*H;}else moon.visible=m.night>.5;
  stars.material.opacity=Math.max(0,Math.min(1,m.night??1));stars.visible=stars.material.opacity>.02;
  materials.building.emissiveIntensity=1.5*(.35+.65*(m.windows??1));
  // Komiks: posterizace a půltón v post-procesu (comic.js), toon rampa podle noci.
  const k=plan.comic??{};usePost=(k.halftone??0)>0||(k.levels??8)<8;post.mat.uniforms.levels.value=k.levels??6;post.mat.uniforms.mode.value=k.halftone?1:0;
  post.mat.uniforms.dotSize.value=(k.dotSize??5)*dpr;post.mat.uniforms.shade.value=k.shadeLimit??.42;
  if(k.ramp&&k.ramp.join()!==ramp.userData.key){ramp.image.data.set(k.ramp);ramp.needsUpdate=true;ramp.userData.key=k.ramp.join();}
  if(k.outline?.color){hull.uniforms.color.value.set(k.outline.color);thinHull.uniforms.color.value.set(k.outline.color);}
  // Město (stream z keše, nejvýš 1 nové místo) a vlaštovka.
  city.stream(plan);
  const flying=plan.state==='flight';if(X<lastX-1)trail=createTrail();lastX=X;if(flying)pushTrail(trail,t,X,Y);
  plane.apply(plan.plane,{flying,trailColor:m.trail});
  const frameCtx={t,X,Y,trail,events:plan.events,comp:plan.comp,quality:plan.quality};city.update(frameCtx);
  life.group.visible=cam.cx-cam.width<4*SCREEN_METERS+200;if(life.group.visible)life.update({t,X,Y,trail,comp:plan.comp,cheerAge:plan.cheer});
  workshop.update(plan.kid,plan.hand);
  // Neonové cedule občas zablikají (šum, ne náhoda za snímek).
  signList.forEach((s,i)=>s.color.setScalar(noise1(t*.8,i*13)>.62&&noise1(t*25,i)>0?.35:1));
 }
 function draw(){
  renderer.info.reset();
  if(usePost){renderer.setRenderTarget(rt);renderer.clear();renderer.render(scene,camera);renderer.setRenderTarget(null);post.mat.uniforms.tDiffuse.value=rt.texture;renderer.clear();renderer.render(post.scene,post.cam);}
  else{renderer.setRenderTarget(null);renderer.clear();renderer.render(scene,camera);}
 }
 const stats=()=>({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,post:usePost,size:`${canvas.width}×${canvas.height}`,dpr,...city.stats(),lifeInstances:life.instances});
 function dispose(){city.dispose();plane.dispose();workshop.dispose();sky.dispose();rt.dispose();
  scene.traverse(o=>{o.geometry?.dispose?.();});for(const mm of [...signList,...Object.values(materials).filter(v=>v?.isMaterial),...materials.ground])mm.dispose();renderer.dispose();}
 return {renderer,scene,camera,materials,ramp,hull,city,plane,life,resize,apply,draw,stats,dispose};
}
