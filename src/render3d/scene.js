// Scéna three.js (renderer, světla, obloha, post-process, sdílené materiály). Vlastní R1; jen R1 mění tento soubor.
// createScene(canvas,{dpr}) → {renderer,scene,camera,materials,ramp,hull,city,plane,life,companion,workshop,resize(w,h,dpr),apply(plan),draw(),warm(),stats(),hide(what),dispose()}.
// apply(plan) jen zapíše plán snímku (frame.js) do objektů; žádná herní logika, fyziku nečte ani nemění.
// Papírové město (P1, bible 05 kap. 3–4, stíny 08-stiny.md): bez shadowMap, mlhy a půltónu; nebe paperSky, post paperPost, město z karet
// (city.js) se sdílenými materiály paperKit (opar a světlo z plan.mood), stíny na zem (maska před hlavním průchodem), kvalita z plan.quality.
// Světla a toon rampa zůstávají jen pro toon objekty, které ještě nejsou z karet (život čtvrti, holub); papírový shader je nečte.
import * as THREE from 'three';
import {SCREEN_METERS} from '../scenes.js';
import {createTrail,pushTrail} from './life.js';
import {toonRamp,outlineMaterial,stampOutlineMaterial} from './toon.js';
import {PAPER_OUTLINE} from './comic.js';
import {createCity} from './city.js';
import {createPlane,PLANE_SCALE} from './plane.js';
import {createLife} from './life3d.js';
import {createCompanion} from './companion3d.js';
import {createWorkshop} from './workshop.js';
import {PAPIR} from './palette.js';
import {paperKit,paperPost,paperSky,MASK_LAYER} from './paper.js';
import {qualityPreset} from './quality.js';

const col=(v,d)=>typeof v==='string'?v:v?.color??d,num=(v,d)=>typeof v==='object'&&v?.intensity!=null?v.intensity:d;
// Obrysy místa odhodu (workshop.js): tloušťka userData.base v CSS px (bez něj tloušťka z doby vzniku) × DPR, jako obrysy scény.
const firstThickness=new WeakMap();
export function scaleOutline(m,res,d){if(!firstThickness.has(m))firstThickness.set(m,m.uniforms.thickness.value);m.uniforms.resolution.value.copy(res);m.uniforms.thickness.value=(m.userData.base??firstThickness.get(m))*d;}
export function createScene(canvas,{dpr=1}={}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
 renderer.shadowMap.enabled=false;renderer.info.autoReset=false;
 const rt=new THREE.WebGLRenderTarget(4,4,{samples:4,depthBuffer:true}),post=paperPost(),sky=paperSky();
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(20,16/9,1,4000),ramp=toonRamp(),pal=PAPIR,LI=pal.lights,kit=paperKit();
 // Obrysy toon objektů: tloušťka z plan.comic.outline (comic.PAPER_OUTLINE: svět 0, vlaštovka 2,6) v px obrazovky × DPR.
 let look=PAPER_OUTLINE;const outlines=[],line=(m,key)=>{outlines.push([m,key]);return m;},thick=()=>{for(const [m,key] of outlines)m.uniforms.thickness.value=look[key]*dpr;};
 const hull=line(outlineMaterial({color:look.color}),'building'),thinHull=line(outlineMaterial({color:look.color}),'detail');
 const planeHull=line(stampOutlineMaterial({color:pal.plane.outline}),'plane');thick();
 const materials={hull,thinHull,planeHull,paper:kit};
 // Světla toon objektů: hemisféra, klíčové a protisvětlo (barvy a síla z plan.mood).
 const hemi=new THREE.HemisphereLight(LI.hemiSky,LI.hemiGround,1.15),key=new THREE.DirectionalLight(LI.key,2.3),rim=new THREE.DirectionalLight(LI.rim,.9);
 rim.position.set(.6,.3,-1);scene.add(hemi,key,key.target,rim);
 // Místo odhodu: dítě s vlaštovkou v ruce (workshop.js R3); statické dioráma kreslí město v ulici místa 0.
 const workshop=createWorkshop(scene,{model:'dart',planeScale:PLANE_SCALE,paper:kit});
 let mood=null;
 const city=createCity({scene,materials,ramp,hull,mood:()=>mood,reduced:false});scene.add(city.group);
 const plane=createPlane({planeHull,palette:pal,scale:PLANE_SCALE,shadows:kit.shadows});scene.add(plane.group);
 // Holub-kurýr a pára z ventilace (a4) v každé čtvrti.
 const companion=createCompanion({ramp,hull:thinHull,palette:pal});scene.add(companion.group);
 // FALLBACK(D1): Violet Suburbs žije zatím přes life3d.js ve světových souřadnicích (místa 0–3); H4 ji převede na papírové modely.
 const life=createLife({ramp,hull,thinHull});scene.add(life.group);
 let trail=createTrail(),lastX=Infinity,size=[4,4],quality=null,maskCalls=0;const buf=new THREE.Vector2(4,4);
 function resize(w,h,d=dpr){dpr=d;renderer.setPixelRatio(d);renderer.setSize(w,h,false);size=[w,h];const b=renderer.getDrawingBufferSize(buf);rt.setSize(b.x,b.y);kit.shadows.resize(b.x,b.y);
  for(const [m] of outlines)m.uniforms.resolution.value.copy(b);thick();
  for(const m of workshop.userData.outlines??[])scaleOutline(m,b,d);post.mat.uniforms.resolution.value.copy(b);}
 function apply(plan){
  const m=plan.mood,cam=plan.camera,sh=cam.shake??{},X=plan.X,Y=plan.Y,t=plan.t;mood=m;
  // Kamera: Follow + otřes (m) a náklon (rad) kolem osy pohledu.
  camera.fov=cam.fov;camera.aspect=size[0]/size[1]||16/9;camera.updateProjectionMatrix();
  // otřes posouvá obraz o (dx,dy) m stejně jako UI vrstvu (withShake), kamera proto jede opačně
  const ox=-(sh.dx??0),oy=-(sh.dy??0);camera.position.set(cam.position[0]+ox,cam.position[1]+oy,cam.position[2]);camera.lookAt(cam.target[0]+ox,cam.target[1]+oy,cam.target[2]);const rz=(cam.roll??0)*Math.PI/180+(sh.roll??0);if(rz)camera.rotateZ(rz);// náklon režiséra (°) + otřes (rad)
  // Opar, světlo a stín do sdílených uniforem, nebe (překreslí se jen při změně), světla toon objektů, kvalita (stíny, vlákna, zrno, MSAA).
  kit.applyMood(m);const tx=sky.paint(m,buf.x,buf.y);if(scene.background!==tx)scene.background=tx;
  hemi.color.set(m.hemi.sky);hemi.groundColor.set(m.hemi.ground);hemi.intensity=m.hemi.intensity;key.color.set(col(m.key,LI.key));key.intensity=num(m.key,1);rim.color.set(col(m.rim,LI.rim));rim.intensity=num(m.rim,0);
  if(kit.setQuality(plan.quality)){const q=qualityPreset(plan.quality);post.setGrain(q.grain);if(rt.samples!==q.msaa){rt.samples=q.msaa;rt.dispose();}}
  // Toon rampa a obrysy toon objektů podle plan.comic.
  const k=plan.comic??{};
  if(k.ramp&&k.ramp.join()!==ramp.userData.key){ramp.image.data.set(k.ramp);ramp.needsUpdate=true;ramp.userData.key=k.ramp.join();}
  if(k.outline&&k.outline!==look){look=k.outline;hull.uniforms.color.value.set(look.color);thinHull.uniforms.color.value.set(look.color);thick();}
  // Město (stream z keše, nejvýš 1 nové místo) a vlaštovka.
  city.stream(plan);
  const flying=plan.state==='flight';if(X<lastX-1)trail=createTrail();lastX=X;if(flying)pushTrail(trail,t,X,Y);
  plane.apply(plan.plane,{flying,trailColor:m.trail});
  city.update({t,X,Y,trail,events:plan.events,comp:plan.comp,quality:plan.quality});
  life.group.visible=cam.cx-cam.width<4*SCREEN_METERS+200;if(life.group.visible)life.update({t,X,trail,cheerAge:plan.cheer});
  companion.update({t,X,Y,vx:plan.vx,ev:plan.ev,comp:plan.comp,carry:plan.carry,reduced:plan.reduced});
  workshop.update(plan.kid,plan.hand,{t:plan.t,reduced:plan.reduced});
  quality=plan.quality;
 }
 function draw(){
  renderer.info.reset();
  maskCalls=kit.shadows.render(renderer,scene,camera)?renderer.info.render.calls:0;renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(null);
  post.mat.uniforms.tDiffuse.value=rt.texture;renderer.render(post.scene,post.cam);
 }
 // Předehřátí v Dílně: shadery všech materiálů (i skrytých: vlaštovka, holub, pára) bez záseku při prvním hodu.
 function warm(){const hidden=[];scene.traverse(o=>{if(!o.visible){hidden.push(o);o.visible=true;}});camera.layers.enable(MASK_LAYER);try{renderer.compile(scene,camera);}finally{for(const o of hidden)o.visible=false;camera.layers.set(0);}}
 const stats=()=>({calls:renderer.info.render.calls,maskCalls,triangles:renderer.info.render.triangles,post:true,quality,size:`${canvas.width}×${canvas.height}`,dpr,...city.stats(),lifeInstances:life.instances});
 function dispose(){kit.dispose();post.dispose();city.dispose();plane.dispose();companion.dispose();workshop.dispose();life.dispose();sky.dispose();rt.dispose();ramp.dispose();
  scene.traverse(o=>{o.geometry?.dispose?.();});for(const mm of [hull,thinHull,planeHull])mm.dispose();renderer.dispose();}
 // Měření (index.js measurePlane): skryje stopu, nebo i vlaštovku (letící i v ruce v Dílně); hidden(null) vrátí viditelnost.
 const saved=new Map();
 function hide(what){if(what==null){for(const [o,v] of saved)o.visible=v;saved.clear();return;}
  const list=[plane.trail.mesh,...(what==='plane'?[plane.group,workshop.userData.plane].filter(Boolean):[])];for(const o of list){if(!saved.has(o))saved.set(o,o.visible);o.visible=false;}}
 return {renderer,scene,camera,materials,ramp,hull,city,plane,life,companion,workshop,resize,apply,draw,warm,stats,hide,dispose};
}
