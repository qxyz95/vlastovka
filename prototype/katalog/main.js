// Katalog modelů K1 (research/design/10-katalog-modelu.md kap. 4 a 6): objekt z registru src/render3d/models na otočném podstavci,
// pohled zblízka / v záběru hry (kamera cameraFor, vrstva podle LOD) / na 25 % v šedi / dioráma místa odhodu G2b v záběru míření 16 m,
// LOD 0–2, varianty, počty △ a draw calls.
import * as THREE from 'three';
import {MODELS,modelById,buildModel,defaults,bounds,nearestLod,SCALE,LOD_LAYER,diorama,DIORAMA,LAUNCH,AIM_SHOT,MENU_SHOT} from '../../src/render3d/models/index.js';
import {cardTriangles,groundCards,PLACE_W} from '../../src/render3d/paper-cards.js';
import {cameraFor} from '../../src/render3d/frame.js';
import {planeShape} from '../../src/render3d/geometry.js';
import {PAPER_ROLE,PAPER_TOKENS as T} from '../../src/render3d/palette.js';
import {paperMaterial,postPass,skyTexture,cardGeometry,lin} from './paper.js';

const $=s=>document.querySelector(s),q=new URLSearchParams(location.search);
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={model:modelById(q.get('model'))?.id??MODELS[0].id,lod:Math.max(0,Math.min(2,+(q.get('lod')??0)||0)),view:['close','game','gray','diorama','diorama-menu'].includes(q.get('view'))?q.get('view'):'close',
 spin:['swing','round','still'].includes(q.get('spin'))?q.get('spin'):REDUCED?'still':'swing',figures:!q.has('nofig'),params:{},angle:0};
// Hra: přední hrana vrstvy (paper-cards, cityChunk: ulice −20…−25, střed ~−100, dálka ~−360), vlaštovka v letové výšce, objekt vpravo před ní.
const GAME={X:100,Y:40,dx:30,front:{near:-20,mid:-100,far:-358}};
// Dioráma (bible 05 kap. 9.2): H1–H6 ve světových souřadnicích místa 1, kamera míření (šířka 16 m, na výšku 7 m, sklon −8°, ruka na 0,38; 0,60).
const G2B=new Set(DIORAMA.map(o=>o.id)),HAND_AT=new THREE.Vector3(LAUNCH.hand.x,LAUNCH.hand.y,LAUNCH.hand.z);
// Tlačítko pohledu „Dioráma“ (prototype-katalog.html se nemění, doplní se sem před navázáním událostí).
const SHOTS={diorama:AIM_SHOT,'diorama-menu':MENU_SHOT},isDio=()=>state.view in SHOTS;
{const g=document.querySelector('[data-pick="view"]')?.parentElement;
 for(const [v,t,title] of [['diorama','Dioráma: míření 16 m','Místo odhodu H1–H6 dohromady v záběru míření (sklon −8°)'],['diorama-menu','Dioráma: menu 28 m','Celé místo odhodu v záběru menu (sklon +2°)']]){
  const b=document.createElement('button');b.type='button';b.dataset.pick='view';b.dataset.value=v;b.textContent=t;b.title=title;g?.append(b);}}

const canvas=$('#scene'),stage=$('#stage');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
renderer.info.autoReset=false;renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const rt=new THREE.WebGLRenderTarget(4,4,{samples:4}),POST=postPass();
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,16/9,.5,4000);
const mat=paperMaterial(),groundMat=paperMaterial({cutK:0,fiber:.05}),flatMat=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
const turntable=new THREE.Group(),spinner=new THREE.Group();turntable.add(spinner);scene.add(turntable);
let modelMesh=null,pedestal=null,ground=null,sky=null,list=[],box=null,dirty=true;

// Podstavec: kraftový válec (vršek dostane světlý řez z papírového shaderu), barva vrcholů pro shader.
function colored(g,hex){const c=lin(hex),n=g.attributes.position.count,C=new Float32Array(n*3);for(let i=0;i<n;i++)C.set([c.r,c.g,c.b],i*3);g.setAttribute('color',new THREE.BufferAttribute(C,3));return g;}
// Měřítko: člověk 1,7 m (model person z katalogu, K4) a vlaštovka v herním měřítku (planeShape × 7,75 = plane.js PLANE_SCALE, poloha jako za letu).
const person=new THREE.Mesh(cardGeometry(buildModel('person',0,{cloth:2})),mat);
const plane=(()=>{const s=planeShape('dart'),g=new THREE.BufferGeometry(),n=s.positions.length/3,C=new Float32Array(n*3);
 for(let i=0;i<n;i++){const c=lin(s.normals[i*3+1]>.3?PAPER_ROLE.planeFill:PAPER_ROLE.planeUnder);C.set([c.r,c.g,c.b],i*3);}
 g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingBox();
 const m=new THREE.Mesh(g,flatMat);m.scale.setScalar(SCALE.plane);m.rotation.set(.42,-.2,0,'ZYX');return m;})();
scene.add(person,plane);

function rebuild(){
 // Model, který se v daném LOD nekreslí (dálka: strop 0), ukáže nejbližší kreslený LOD.
 const m=modelById(state.model),dio=isDio();state.shown=dio?state.lod:nearestLod(m,state.lod);
 list=dio?diorama(state.lod,G2B.has(m.id)?{[m.id]:state.params}:{}):buildModel(m,state.shown,state.params);box=bounds(list);
 modelMesh?.geometry.dispose();pedestal?.geometry.dispose();if(ground){ground.geometry.dispose();scene.remove(ground);}modelMesh=pedestal=ground=null;spinner.clear();turntable.clear();turntable.add(spinner);
 modelMesh=new THREE.Mesh(cardGeometry(list),mat);
 // Model otáčený kolem středu půdorysu; na podstavci stojí ve 0, ve hře přední hranou na hraně vrstvy.
 const cx=(box.x0+box.x1)/2,cz=(box.z0+box.z1)/2;modelMesh.position.set(-cx,0,-cz);spinner.add(modelMesh);
 if(dio){modelMesh.position.set(0,0,0);turntable.position.set(0,0,0);ground=new THREE.Mesh(cardGeometry(groundCards('papir',0)),groundMat);scene.add(ground);}
 else if(state.view==='game'){const L=LOD_LAYER[state.shown];turntable.position.set(GAME.X+GAME.dx,0,GAME.front[L]-(box.z1-cz));
  ground=new THREE.Mesh(cardGeometry(groundCards('papir',0)),groundMat);ground.position.x=GAME.X-PLACE_W/2;scene.add(ground);}
 else{turntable.position.set(0,0,0);const r=Math.hypot(box.w,box.d)/2+1.2;pedestal=new THREE.Mesh(colored(new THREE.CylinderGeometry(r,r*1.04,.5,48),T.kraft),mat);pedestal.position.y=-.25;turntable.add(pedestal);}
 const fig=state.figures&&state.view!=='game'&&!dio;person.visible=fig;person.position.set(-(Math.hypot(box.w,box.d)/2+2.4),0,0);
 // Vlaštovka: ve hře 7,75 m v letové výšce, v diorámatu v ruce dítěte 0,5 m (M-2), jinak vedle modelu.
 plane.visible=state.figures;plane.scale.setScalar(dio?AIM_SHOT.planeInHand:SCALE.plane);
 if(state.view==='game')plane.position.set(GAME.X,GAME.Y,0);else if(dio)plane.position.copy(HAND_AT);else plane.position.set(box.w/2+2+SCALE.plane/2,box.h*.55,1);
 dirty=true;ui();
}
// Kamera: zblízka (a v šedi) podle obalu modelu, mírně shora; ve hře cameraFor jako za letu (fov 20, šířka záběru 120 m).
function aim(){
 const a=canvas.width/canvas.height;camera.aspect=a;
 if(isDio())aimShot(a,SHOTS[state.view]);
 else if(state.view==='game'){const c=cameraFor(GAME.X,GAME.Y);camera.fov=c.fov;camera.position.set(...c.position);camera.lookAt(...c.target);camera.near=1;camera.far=6000;}
 else{const span=Math.max(box.h+1,(Math.hypot(box.w,box.d)+(state.figures?SCALE.plane*2+5:2))/a)*1.15,fov=30,dist=span/2/Math.tan(fov/2*Math.PI/180),cy=box.h*.45;
  camera.fov=fov;camera.position.set(state.figures?SCALE.plane*.6:0,cy+dist*.14,dist);camera.lookAt(state.figures?SCALE.plane*.6:0,cy,0);camera.near=.5;camera.far=dist*4+50;}
 camera.updateProjectionMatrix();
}
// Záběr diorámatu jako náčrt start.mjs anchored(): výška záběru v hloubce z = 0 ze šířky S (míření 16 m, menu 28 m), kamera posunutá o tan(sklon),
// cíl se posouvá, dokud ruka nepadne na S.at obrazu (míření 0,38; 0,60).
const _v=new THREE.Vector3();
function aimShot(a,S){
 const portrait=a<1,height=(portrait?S.portraitWidth:S.width)/a,[fx,fy]=portrait?S.portraitAt:S.at,dist=height/2/Math.tan(S.fov/2*Math.PI/180),up=dist*Math.tan(S.pitch*Math.PI/180);
 let cx=HAND_AT.x,cy=HAND_AT.y;camera.fov=S.fov;camera.near=.1;camera.far=3000;
 for(let i=0;i<6;i++){camera.position.set(cx,cy+up,dist);camera.lookAt(cx,cy,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
  _v.copy(HAND_AT).project(camera);const sx=(_v.x+1)/2,sy=(1-_v.y)/2;cx+=(sx-fx)*height*a;cy+=(fy-sy)*height;}
 camera.position.set(cx,cy+up,dist);camera.lookAt(cx,cy,0);
}
function size(){
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight),dpr=renderer.getPixelRatio();
 renderer.setSize(w,h,false);rt.setSize(Math.round(w*dpr),Math.round(h*dpr));sky?.dispose();sky=skyTexture(Math.min(1024,Math.round(w*dpr)),Math.min(1024,Math.round(h*dpr)));scene.background=sky;dirty=true;
}
function render(){
 aim();const W=canvas.width,H=canvas.height;
 renderer.info.reset();renderer.setRenderTarget(rt);renderer.setClearColor(0,1);renderer.clear();renderer.render(scene,camera);
 const calls=renderer.info.render.calls,tris=renderer.info.render.triangles;
 POST.mat.uniforms.tDiffuse.value=rt.texture;POST.mat.uniforms.res.value.set(W,H);POST.mat.uniforms.gray.value=state.view==='gray'?1:0;
 renderer.setRenderTarget(null);renderer.render(POST.scene,POST.cam);
 stats={calls:calls+1,tris,model:cardTriangles(list),mem:{...renderer.info.memory}};
}
let stats={},last=performance.now();
function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 if(state.spin!=='still'){state.t=(state.t??0)+dt;state.angle=state.spin==='swing'?Math.sin(state.t*.5)*Math.PI/3:state.t*.4;dirty=true;}
 if(dirty){spinner.rotation.y=state.view==='game'||isDio()?0:state.angle;render();dirty=false;statsUi();}
 requestAnimationFrame(loop);
}

// ---------- UI ----------
const fmt=v=>v.toFixed(2).replace('.',',');
function ui(){
 const m=modelById(state.model),p={...defaults(m),...state.params};
 document.querySelectorAll('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',String(String(state[b.dataset.pick])===b.dataset.value)));
 stage.dataset.view=state.view;$('#model').value=state.model;$('#figures').checked=state.figures;
 const dio=isDio();
 $('#m-name').textContent=dio?`Dioráma místa odhodu H1–H6${G2B.has(m.id)?` (varianta: ${m.id})`:''}`:`${m.name} (${m.id})${m.replacedBy?` · nahrazeno modelem ${m.replacedBy}`:''}`;$('#m-proto').textContent=m.prototype;$('#m-purpose').textContent=m.purpose;
 $('#m-size').textContent=`${fmt(m.size.w)} × ${fmt(m.size.h)} × ${fmt(m.size.d)} m (š × v × h)`;$('#m-bounds').textContent=`${fmt(box.w)} × ${fmt(box.h)} × ${fmt(box.d)} m`;
 // LOD 0 modelů místa odhodu (hero) je LOD H (11 kap. 1.2: 80 px/m při míření); v diorámatu součet H1–H6 proti součtu stropů.
 const lodName=(mm,l)=>mm.hero&&!l?'H (místo odhodu)':LOD_LAYER[l],dioCap=l=>DIORAMA.reduce((s,o)=>s+modelById(o.id).tris[l],0);
 $('#m-lod').innerHTML=[0,1,2].map(l=>{const n=dio?cardTriangles(diorama(l,G2B.has(m.id)?{[m.id]:p}:{})):cardTriangles(buildModel(m,l,p)),cap=dio?dioCap(l):m.tris[l],over=n>cap;
  return `<tr${l===state.shown?' class="on"':''}><th>${l}</th><td>${dio?(l?LOD_LAYER[l]:'H (místo odhodu)'):lodName(m,l)}${cap?'':' (nekreslí se)'}</td><td${over?' class="over"':''}>${n}</td><td>${cap}</td></tr>`;}).join('');
 // Volby varianty se staví jen při změně objektu (fokus klávesnice v selectu zůstane).
 const box2=$('#params');if(box2.dataset.model!==m.id){box2.dataset.model=m.id;box2.innerHTML='';
  for(const [k,v] of Object.entries(m.params)){const l=document.createElement('label'),s=document.createElement('select');l.textContent=k+' ';s.dataset.param=k;
   for(const x of v.values){const o=document.createElement('option');o.value=x;o.textContent=x;s.append(o);}l.append(s);box2.append(l);}}
 box2.querySelectorAll('select').forEach(s=>s.value=String(p[s.dataset.param]));
}
function statsUi(){$('#r-calls').textContent=stats.calls;$('#r-tris').textContent=stats.tris;$('#r-model').textContent=`1 / ${stats.model}`;$('#r-mem').textContent=`${stats.mem.geometries} / ${stats.mem.textures}`;}
function set(o={}){
 if(o.model&&o.model!==state.model){if(!modelById(o.model))return;state.params={};}
 if(o.params)o={...o,params:{...state.params,...o.params}};Object.assign(state,o);
 if('spin' in o&&o.spin==='still')state.t=0;rebuild();
}
$('#model').innerHTML=MODELS.map(m=>`<option value="${m.id}">${m.name}${m.replacedBy?' (nahrazeno)':''}${m.hero?' · G2b':''}</option>`).join('');
$('#model').addEventListener('change',e=>set({model:e.target.value}));
$('#figures').addEventListener('change',e=>set({figures:e.target.checked}));
$('#params').addEventListener('change',e=>{const k=e.target.dataset.param;if(k){const v=e.target.value;set({params:{[k]:Number.isNaN(+v)?v:+v}});}});
document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pick,v=b.dataset.value;set({[k]:k==='lod'?+v:v});}));
addEventListener('keydown',e=>{if(e.target.closest?.('select'))return;const d=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0;if(!d)return;
 e.preventDefault();state.spin='still';state.angle+=d*Math.PI/12;dirty=true;ui();});
new ResizeObserver(()=>{size();}).observe(canvas);
canvas.addEventListener('webglcontextlost',e=>e.preventDefault());canvas.addEventListener('webglcontextrestored',()=>{size();rebuild();});
window.__katalog={set,info:()=>({...stats,state:{...state},bounds:box}),models:MODELS.map(m=>m.id)};
rebuild();size();requestAnimationFrame(loop);
