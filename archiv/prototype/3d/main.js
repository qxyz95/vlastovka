// 3D prototyp (prototype-3d.html): stejná fyzika jako hra (src/core.js), dvě varianty vykreslení.
// (a) 3D vlaštovka nad dnešním 2D renderem (render.js, styl cyber, 2D vlaštovka průhledná přes objekt tématu).
// (b) 3D vlaštovka v procedurálním 3D neonovém městě, kamera z boku s úzkým FOV (2,5D).
import * as THREE from 'three';
import {createFlight,step,eventInput,activeEvent} from '../../src/core.js';
import {DT,MODELS} from '../../src/config.js';
import {throwSettings} from '../../src/throw.js';
import {render as render2d,view} from '../../src/render.js';
import {THEMES,setTheme} from '../../src/themes.js';
import {flightAngle} from '../../src/juice.js';
import {spring,lerp,noise1} from '../../src/motion.js';
import {routeAt,districtAt,SCREEN_METERS} from '../../src/scenes.js';
import {frameStats,ring} from '../../src/perf.js';
import {planeShape,mergeBlocks,cityChunk,chunkOffset,follow,sideCamera,tempoZoom,tempoPx,PLANE_OFFSET} from '../../src/render3d/geometry.js';
import {toonRamp,outlineMaterial,windowTexture,signTexture,skyTexture,postPass} from '../../src/render3d/toon.js';
import {createLife} from '../../src/render3d/life3d.js';
import {createTrail,pushTrail,companion,hash,EVENT_TEXT} from '../../src/render3d/life.js';
import {autoInput} from '../../tests/helpers/auto-input.js';
import {createDirector,direct} from '../../src/render3d/camera.js';

const $=id=>document.getElementById(id),C=h=>new THREE.Color(h),clear='rgba(0,0,0,0)';
// Bez zásahu do src/: kopie tématu cyber s průhlednou vlaštovkou (setTheme přijímá objekt). Stopa za letadlem zůstává.
setTheme({...THEMES.cyber,plane:{fill:clear,outline:clear,crease:[clear,clear]}});
const Q=new URLSearchParams(location.search),ui={mode:'b',model:'dart',angle:18,power:.85,level:0,tempo:1,width:120,fov:20,dpr:1,post:0,shadows:true,life:Q.get('life')!=='0',auto:Q.get('auto')!=='0',start:0,director:true};
const stage=$('stage'),c2d=$('c2d'),gl=$('gl');
const renderer=new THREE.WebGLRenderer({canvas:gl,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.BasicShadowMap;renderer.info.autoReset=false;
const rt=new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,samples:4}),post=postPass();
const ramp=toonRamp(),FOG={color:'#4a1d63',near:300,far:1100};
// Nálada: noc (zbytek trasy) a fialový soumrak Violet Suburbs (teplé světlo, levandulová mlha, broskvový obzor).
const NIGHT={fog:C('#4a1d63'),sky:skyTexture(),hemi:[C('#7f73ff'),C('#2a1030'),1.15],key:C('#ffe8ff'),rim:C('#ff4fc3')};
const DUSK={fog:C('#9c5598'),sky:skyTexture(['#2c1a6b','#5a3a9e','#b45aa8','#ff9e8a','#ffd0a0']),hemi:[C('#cdb6ff'),C('#6a3060'),1.5],key:C('#ffd2b8'),rim:C('#ff7ac8')};
const outlines=[],line=(o,base)=>{outlines.push([o,base]);return o;};
const hullMat=line(outlineMaterial({fog:FOG,thickness:2.5}),2.5),thinHull=line(outlineMaterial({fog:FOG,thickness:1.7}),1.7),planeHull=line(outlineMaterial({side:THREE.DoubleSide,thickness:2.6}),2.6);
planeHull.depthWrite=false;
const buildingMat=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:ramp,emissive:0xffffff,emissiveMap:windowTexture(),emissiveIntensity:1.5});
const glowMat=new THREE.MeshBasicMaterial({vertexColors:true});
// Barvy z palet tématu cyber (biomes: [akcent, tělo, okna]), zesvětlené, aby toon světlo mělo s čím pracovat.
const CY=THEMES.cyber,ACCENT=['#3d7fa8','#a8458f','#c27a3a','#3aa88f'];
const TONES=CY.biomes.map((p,b)=>[C(p[0]).lerp(C('#ffffff'),.06),C(p[0]).lerp(C('#1a1240'),.15),C(p[0]).lerp(C(FOG.color),.45),C(ACCENT[b]),C('#1d5246'),C('#2b2352')].map(c=>c.toArray()));
// Violet Suburbs: pastelové domy (barva podle polohy), střed a panorama do levandulové mlhy.
const PAL=['#8f6ad8','#c56fb5','#6f86e0','#e08aa0','#5fb0c8','#a58be8','#d98ad0'].map(C),SUB=[PAL,PAL.map(c=>c.clone().lerp(DUSK.fog,.35)),[C('#7a4f9e').lerp(DUSK.fog,.4)]].map(l=>l.map(c=>c.toArray()));
const colorOf=b=>(b.biome??0)===0&&(b.tone??0)<3?(l=>l[Math.floor(hash(Math.floor(b.x*3))*l.length)])(SUB[b.tone??0]):TONES[b.biome??0][b.tone??0];
const groundMats=CY.ground.map((g,b)=>new THREE.MeshToonMaterial({color:b===1?C('#10294a'):b===0?C('#4b3778'):C(g).lerp(C('#000000'),.25),gradientMap:ramp}));

function bufferOf(m){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(m.position,3));g.setAttribute('normal',new THREE.BufferAttribute(m.normal,3));
 g.setAttribute('uv',new THREE.BufferAttribute(m.uv,2));g.setAttribute('color',new THREE.BufferAttribute(m.color,3));g.setAttribute('outline',new THREE.BufferAttribute(m.outline,3));g.computeBoundingSphere();return g;}

// ── Vlaštovka: několik trojúhelníků, toon 3 tóny, obrys zvětšenou kopií, přehyby čarou. Skupiny pitch → yaw → roll.
function makePlane(model,scale){
 const s=planeShape(model),geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));geo.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
 const mesh=new THREE.Mesh(geo,new THREE.MeshToonMaterial({color:CY.plane.fill,gradientMap:ramp,side:THREE.DoubleSide}));mesh.castShadow=true;mesh.renderOrder=2;
 const hull=new THREE.Mesh(geo,planeHull);hull.renderOrder=1;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 const crease=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:CY.plane.crease[model==='glider'?1:0]}));crease.renderOrder=3;
 const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group();
 roll.add(mesh,hull,crease);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(scale);
 return {root,pitch,yaw,roll,dispose(){geo.dispose();lg.dispose();mesh.material.dispose();crease.material.dispose();}};
}
const rot={x:-.15,v:0};let clock=0;
function pose(p,s){p.pitch.rotation.z=-rot.x;const flying=s&&!s.landed;p.roll.rotation.x=.42+(flying?noise1(clock*1.3,4)*.16:0);p.yaw.rotation.y=-.2+noise1(clock*.6,9)*.05;}

// ── Varianta (a): ortografická kamera v pixelech 640×360 stejně jako 2D canvas.
const flat=new THREE.Scene(),flatCam=new THREE.OrthographicCamera(0,640,360,0,-500,500);
const flatSun=new THREE.DirectionalLight('#ffffff',2.2);flatSun.position.set(-.3,.8,.6);flat.add(new THREE.HemisphereLight('#c8c0ff','#40204a',1.3),flatSun);

// ── Varianta (b): město. Nebe přechodem, mlha do dálky, měsíc s ostrými stíny, růžové protisvětlo.
const city=new THREE.Scene();city.background=skyTexture();city.fog=new THREE.Fog(FOG.color,FOG.near,FOG.far);
const cam3=new THREE.PerspectiveCamera(20,16/9,1,4000),moon=new THREE.DirectionalLight('#ffe8ff',2.3),rim=new THREE.DirectionalLight('#ff4fc3',.9),moonDir=new THREE.Vector3(-.35,.75,.55).normalize();
moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);moon.shadow.bias=-.0006;moon.shadow.normalBias=.04;rim.position.set(.6,.3,-1);
const hemi=new THREE.HemisphereLight('#7f73ff','#2a1030',1.15);city.add(hemi,moon,moon.target,rim);
const sky=new THREE.Group();city.add(sky);
{const n=500,p=new Float32Array(n*3);for(let i=0;i<n;i++)p.set([(Math.random()-.5)*5200,150+Math.random()*900,-1800],i*3);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 sky.add(new THREE.Points(g,new THREE.PointsMaterial({color:'#e8f6ff',size:2,sizeAttenuation:false,fog:false})));
 const m=new THREE.Mesh(new THREE.CircleGeometry(70,40),new THREE.MeshBasicMaterial({color:'#ffe3f4',fog:false}));m.position.set(420,520,-1700);sky.add(m);}
// Zapadající slunce s halo za panoramou (jen v soumraku).
const sun=new THREE.Group();for(const [r,c,z] of [[190,'#ff9ec0',-1720],[125,'#ffc89a',-1700],[95,'#ffe6b8',-1690]]){const m=new THREE.Mesh(new THREE.CircleGeometry(r,48),new THREE.MeshBasicMaterial({color:c,fog:false,transparent:r>150,opacity:r>150?.45:1}));m.position.set(260,70,z);sun.add(m);}sky.add(sun);
function mood(x){const d=districtAt(x),w=d.index===0?1-d.blend:d.index===3?d.blend:0,M=(a,b)=>a.clone().lerp(b,w);
 city.fog.color.copy(M(NIGHT.fog,DUSK.fog));for(const [o] of outlines)o.uniforms.fogColor.value.copy(city.fog.color);
 city.background=w>.5?DUSK.sky:NIGHT.sky;hemi.color.copy(M(NIGHT.hemi[0],DUSK.hemi[0]));hemi.groundColor.copy(M(NIGHT.hemi[1],DUSK.hemi[1]));hemi.intensity=lerp(NIGHT.hemi[2],DUSK.hemi[2],w);
 moon.color.copy(M(NIGHT.key,DUSK.key));rim.color.copy(M(NIGHT.rim,DUSK.rim));sun.visible=w>.3;}
const unit=new THREE.PlaneGeometry(1,1),signMats=new Map(),signList=[];
const signMat=(text,color,vertical)=>{const k=text+color+vertical;if(!signMats.has(k)){const m=new THREE.MeshBasicMaterial({map:signTexture(text,color,vertical),toneMapped:false});signMats.set(k,m);signList.push(m);}return signMats.get(k);};
// cityChunk je v lokálních souřadnicích místa, skupina se posune o chunkOffset(screen). Dílna jen na první obrazovce.
function buildChunk(screen){
 const c0=cityChunk(screen),g=new THREE.Group(),keep=b=>screen<16||!b.shop,c={...c0,blocks:c0.blocks.filter(keep),signs:c0.signs.filter(keep)};g.position.x=chunkOffset(screen);
 const solid=c.blocks.filter(b=>!b.beacon).concat(c.lamps.map(l=>({type:'box',x:l.x,w:.5,z:l.z,d:.5,h:l.h,biome:c.biome,tone:1})));
 const glow=c.blocks.filter(b=>b.beacon).map(b=>({...b,glow:'#ff4d6d'})).concat(c.lamps.map(l=>({type:'box',x:l.x-.6,w:1.7,z:l.z,d:.9,h:.5,y:l.h,glow:l.color})));
 for(let x=c.x0;x<c.x1-7;x+=14)glow.push({type:'box',x,w:7,z:3,d:.3,h:.05,glow:c.ground.water?'#2f6f9a':'#3b2d6e'});
 const geo=bufferOf(mergeBlocks(solid,colorOf)),mesh=new THREE.Mesh(geo,buildingMat);mesh.castShadow=mesh.receiveShadow=true;
 g.add(mesh,new THREE.Mesh(geo,hullMat),new THREE.Mesh(bufferOf(mergeBlocks(glow,b=>C(b.glow).toArray())),glowMat));
 for(const s of c.signs){const m=new THREE.Mesh(unit,signMat(s.text,s.color,s.vertical));m.scale.set(s.w,s.h,1);m.position.set(s.x+s.w/2,s.y+s.h/2,s.z);g.add(m);}
 const left=screen===0?c.x0-600:c.x0,ground=new THREE.Mesh(new THREE.PlaneGeometry(c.x1-left+.5,700),groundMats[c.biome]);
 ground.rotation.x=-Math.PI/2;ground.position.set((left+c.x1)/2,0,-290);ground.receiveShadow=true;g.add(ground);
 return g;
}
const chunks=new Map();
function stream(cx,width,dist){
 const reach=width/2*(dist+420)/dist+80,a=Math.max(0,Math.floor((cx-reach)/305)),b=Math.floor((cx+reach)/305);let built=0;
 for(let s=a;s<=b&&built<2;s++)if(!chunks.has(s)){chunks.set(s,buildChunk(s));city.add(chunks.get(s));built++;}
 for(const [s,g] of chunks)if(s<a-1||s>b+1){city.remove(g);g.traverse(o=>{if(o.geometry&&o.geometry!==unit)o.geometry.dispose();});chunks.delete(s);}
}

// Živá čtvrť (life3d.js) a stav režiséra kamery, stopy letu a reakcí.
const life=createLife({ramp,hull:hullMat,thinHull});city.add(life.group);
let trail=createTrail(),dirS=createDirector(),seen=new WeakSet(),cheerAt=null,caption=null,landedAt=null,talking=false,lifeInfo=null;
let planes={};
function rebuildPlanes(){for(const p of Object.values(planes)){p.root.removeFromParent();p.dispose();}planes={flat:makePlane(ui.model,38),city:makePlane(ui.model,6.5)};flat.add(planes.flat.root);city.add(planes.city.root);}
rebuildPlanes();

// ── Let: pevný krok DT jako ui.js, vykreslení interpolované mezi kroky. Tempo jen násobí zobrazenou vzdálenost.
let f=null,prev=null,acc=0,seed=0,last=performance.now(),aspect=16/9;
function throwIt(){const lv=ui.level,launch=throwSettings(ui.angle,ui.power);f=createFlight(ui.model,{power:lv,paper:lv,fold:lv},++seed,{x:0,y:0},launch);prev=null;acc=0;trail=createTrail();dirS.place=-1;dirS.at=null;seen=new WeakSet();cheerAt=null;caption=null;landedAt=null;rot.x=flightAngle(f);rot.v=0;}
function press(owner){if(!f||f.landed)throwIt();else eventInput(f,'down',owner);}
function releaseKey(owner){if(f)eventInput(f,'up',owner);}
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(!e.repeat)press('key');}else if(e.code==='KeyR'){f=null;}else if(e.code==='KeyL'){$('life').checked=!ui.life;$('life').dispatchEvent(new Event('input'));}else if(e.code==='Digit1')setMode('a');else if(e.code==='Digit2')setMode('b');});
addEventListener('keyup',e=>{if(e.code==='Space'){e.preventDefault();releaseKey('key');}});
stage.addEventListener('pointerdown',e=>{e.preventDefault();stage.setPointerCapture(e.pointerId);press('pointer');});
stage.addEventListener('pointerup',()=>releaseKey('pointer'));

function draw(scene,cam){
 if(ui.post){renderer.setRenderTarget(rt);renderer.clear();renderer.render(scene,cam);renderer.setRenderTarget(null);post.mat.uniforms.tDiffuse.value=rt.texture;renderer.clear();renderer.render(post.scene,post.cam);}
 else{renderer.setRenderTarget(null);renderer.clear();renderer.render(scene,cam);}
}
function drawFlat(shown){
 render2d(c2d,shown,ui.model,clock,{clock});
 const v=view(shown);planes.flat.root.position.set(v.px,360-v.py,0);pose(planes.flat,shown);draw(flat,flatCam);
}
function drawCity(shown,dt=1/60){
 const X=(shown?.x??0)+PLANE_OFFSET,Y=shown?.y??12,k=ui.tempo,flying=!!shown&&!shown.landed;
 if(flying)pushTrail(trail,clock,X,Y);
 direct(dirS,{x:X,v:(shown?.vx??0)*k,t:clock,dt,flying:flying&&ui.director});if(!ui.director){dirS.zoom=1;dirS.alpha=0;}
 const v=follow(X,Y,{width:ui.width/tempoZoom(k)*dirS.zoom,aspect,px:tempoPx(k)}),c=sideCamera(v,ui.fov,6);mood(X);
 cam3.fov=ui.fov;cam3.aspect=aspect;cam3.updateProjectionMatrix();cam3.position.set(...c.position);cam3.lookAt(...c.target);
 city.fog.near=c.dist+60;city.fog.far=c.dist+950;hullMat.uniforms.fogNear.value=city.fog.near;hullMat.uniforms.fogFar.value=city.fog.far;
 const ext=Math.max(150,v.width*.9),sc=moon.shadow.camera;sc.left=sc.bottom=-ext;sc.right=sc.top=ext;sc.near=1;sc.far=1200;sc.updateProjectionMatrix();
 moon.target.position.set(v.cx,v.cy*.5,-40);moon.position.copy(moon.target.position).addScaledVector(moonDir,500);moon.castShadow=ui.shadows;
 sky.position.x=v.cx*.92;stream(v.cx,v.width,c.dist);
 planes.city.root.position.set(X,Y+(shown?.landed?.6:0),0);pose(planes.city,shown);
 // Neonové cedule občas zablikají (šum, ne náhoda za snímek).
 life.group.visible=ui.life;
 lifeInfo=ui.life?life.update({t:clock,X,Y,trail,comp:companion(activeEvent(f),f?.t??0),cheerAge:cheerAt==null?null:clock-cheerAt}):null;
 signList.forEach((m,i)=>m.color.setScalar(noise1(clock*.8,i*13)>.62&&noise1(clock*25,i)>0?.35:1));
 draw(city,cam3);overlays(X,Y);
}

// ── Měření: interval mezi snímky (FPS, průměr, P95) a čas práce na CPU v jednom snímku.
const frames=ring(240),work=ring(240);let shownAt=0;
function frame(now){
 const dt=Math.min(.1,(now-last)/1000);frames.push(now-last);last=now;const t0=performance.now();clock+=dt;renderer.info.reset();
 if(ui.auto&&ui.mode==='b'){if(!f){if(clock>1)throwIt();}else if(f.landed){landedAt??=clock;if(clock-landedAt>2.6)throwIt();}}
 if(f&&!f.landed){acc+=dt;while(acc>=DT&&!f.landed){if(ui.auto){const c=autoInput(f,DT);if(c)eventInput(f,c,'auto');}prev={x:f.x,y:f.y,vx:f.vx,vy:f.vy,t:f.t};step(f);acc-=DT;}}
 // Trefa / minutí události: dav na tržnici zajásá, u vlaštovky hláška (08 §7.2).
 if(f)for(const e of f.events)if(e.result&&e.result!=='interrupted'&&!seen.has(e)){seen.add(e);const hit=e.result!=='miss';if(hit)cheerAt=clock;caption={text:EVENT_TEXT[e.type][hit?'hit':'miss'],at:clock,hit};}
 const a=Math.min(1,acc/DT),s=f&&prev&&!f.landed?{...f,x:lerp(prev.x,f.x,a),y:lerp(prev.y,f.y,a),vx:lerp(prev.vx,f.vx,a),vy:lerp(prev.vy,f.vy,a),t:lerp(prev.t,f.t,a)}:f;
 const shown=s?{...s,x:ui.start*SCREEN_METERS+s.x*ui.tempo}:null;
 spring(rot,flightAngle(s),.07,dt);
 if(ui.mode==='a')drawFlat(shown);else drawCity(shown,dt);
 work.push(performance.now()-t0);
 if(now-shownAt>250){shownAt=now;hud(shown);}
 requestAnimationFrame(frame);
}
function hud(shown){
 const fr=frameStats(frames.values),w=frameStats(work.values),i=renderer.info.render,d=shown?.x??0,e=activeEvent(f);
 $('stats').textContent=`${(1000/(fr.avg||1)).toFixed(0)} FPS · snímek ${fr.avg.toFixed(1)} ms (P95 ${fr.p95.toFixed(1)})\nCPU ${w.avg.toFixed(2)} ms (P95 ${w.p95.toFixed(2)}) · DPR ${ui.dpr} · ${gl.width}×${gl.height}\n${i.calls} draw calls · ${(i.triangles/1000).toFixed(1)}k trojúhelníků${ui.mode==='b'?` · ${chunks.size} míst`:''}${ui.mode==='b'?`\nlife: ${ui.life?'on':'off'} (${life.instances} instancí, ${life.meshes} instanced sítí)${ui.auto?' · autopilot':''}`:''}`;
 $('flight').textContent=`${Math.floor(d)} m${ui.tempo>1?` (fyzika ${Math.floor(f?.x??0)} m)`:''} · ${((shown?.vx??0)*ui.tempo).toFixed(0)} m/s · ${districtAt(d).name.split(' · ')[0]} · ${routeAt(d).name}`+
  (e?`\n${e.type==='gust'?'PORYV':'HOLUB'} · ${e.phase==='warning'?'připrav se':e.phase==='interaction'?(e.type==='gust'?'KLEPNI':'PODRŽ / PUSŤ'):'hotovo'}`:'')+(!f?'\nMezerník nebo klepnutí = hod':f.landed?'\nDopad. Mezerník = další hod':'');
}

// ── Ovládání v panelu.
function setMode(m){ui.mode=m;c2d.hidden=m!=='a';document.querySelectorAll('[name=mode]').forEach(r=>r.checked=r.value===m);$('width-row').hidden=m!=='b';}
function resize(){const r=stage.getBoundingClientRect();css.w=r.width;css.h=r.height;renderer.setPixelRatio(ui.dpr);renderer.setSize(r.width,r.height,false);aspect=r.width/r.height;
 const b=renderer.getDrawingBufferSize(new THREE.Vector2());rt.setSize(b.x,b.y);for(const [m,base] of outlines){m.uniforms.resolution.value.copy(b);m.uniforms.thickness.value=base*ui.dpr;}
 post.mat.uniforms.resolution.value.copy(b);post.mat.uniforms.dotSize.value=4.5*ui.dpr;}
const bind=(id,fn)=>{const el=$(id);el.addEventListener('input',()=>{fn(el);el.blur?.();});fn(el);};
document.querySelectorAll('[name=mode]').forEach(r=>r.addEventListener('change',()=>setMode(r.value)));
bind('model',el=>{ui.model=el.value;rebuildPlanes();$('angle').value=MODELS[ui.model].ideal;$('angle').dispatchEvent(new Event('input'));});
bind('angle',el=>{ui.angle=+el.value;$('angle-v').textContent=el.value+'°';});
bind('power',el=>{ui.power=+el.value/100;$('power-v').textContent=el.value+' %';});
bind('level',el=>{ui.level=+el.value;$('level-v').textContent=el.value;});
bind('tempo',el=>{ui.tempo=+el.value;});
bind('width',el=>{ui.width=+el.value;$('width-v').textContent=el.value+' m';});
bind('fov',el=>{ui.fov=+el.value;$('fov-v').textContent=el.value+'°';});
bind('post',el=>{ui.post=+el.value;post.mat.uniforms.mode.value=ui.post===2?1:0;});
bind('shadows',el=>{ui.shadows=el.checked;});
document.querySelectorAll('[name=dpr]').forEach(r=>r.addEventListener('change',()=>{ui.dpr=+r.value;resize();frames.clear();work.clear();}));
$('reset').addEventListener('click',()=>{f=null;});
$('life').checked=ui.life;$('auto').checked=ui.auto;
bind('life',el=>{ui.life=el.checked;frames.clear();work.clear();});
bind('auto',el=>{ui.auto=el.checked;});
bind('director',el=>{ui.director=el.checked;});
bind('start',el=>{ui.start=+el.value;f=null;});
$('bench-life').addEventListener('click',()=>{const r=[false,true].map(l=>{const old=ui.life;ui.life=l;const b=bench(240,'b');ui.life=old;return b;});
 $('bench').textContent=r.map(b=>`life ${b.life?'on ':'off'} · ${b.avg} ms (P95 ${b.p95}) · ${b.calls} calls · ${(b.tris/1000).toFixed(1)}k tri · ${b.size} · DPR ${b.dpr}${b.shadows?' · stíny':''}`).join('\n');});
// ── Překryvy: nadpis místa (režisér), bublina Bolts, hláška k události. DOM jen při změně.
const ov={title:$('title'),bubble:$('bubble'),caption:$('caption')},V3=new THREE.Vector3(),css={w:1,h:1};
const setText=(el,t)=>{if(el.textContent!==t)el.textContent=t;},show=(el,on)=>{if(el.hidden===on)el.hidden=!on;};
const at=(el,x,y,z)=>{V3.set(x,y,z).project(cam3);const ok=V3.z<1&&Math.abs(V3.x)<1.1&&Math.abs(V3.y)<1.1;if(ok){el.style.left=((V3.x+1)/2*css.w).toFixed(0)+'px';el.style.top=((1-V3.y)/2*css.h).toFixed(0)+'px';}return ok;};
function overlays(X,Y){
 if(ui.mode!=='b'){for(const el of Object.values(ov))show(el,false);return;}
 const t=dirS.title;show(ov.title,!!t&&dirS.alpha>.01);if(t){setText(ov.title.firstElementChild,t.title);setText(ov.title.lastElementChild,t.sub);ov.title.style.opacity=dirS.alpha.toFixed(2);}
 const tk=!!lifeInfo?.talking;if(tk&&!talking)setText(ov.bubble,life.nextQuote());talking=tk;show(ov.bubble,tk&&at(ov.bubble,lifeInfo.robotHead.x,lifeInfo.robotHead.y,lifeInfo.robotHead.z));
 const e=activeEvent(f),name=e&&!e.result&&e.phase!=='effect'?EVENT_TEXT[e.type].name+(e.phase==='warning'?'!':e.type==='gust'?' · TAP':' · HOLD'):null,cap=caption&&clock-caption.at<2.2?caption.text:null;
 const txt=name??cap;show(ov.caption,!!txt&&at(ov.caption,X+2,Y+7,0));if(txt){setText(ov.caption,txt);ov.caption.classList.toggle('miss',!name&&!caption?.hit);}
}
new ResizeObserver(resize).observe(stage);
setMode(new URLSearchParams(location.search).get('varianta')==='a'?'a':'b');resize();requestAnimationFrame(frame);
// Benchmark nezávislý na rAF (funguje i ve skryté záložce): n snímků synchronně, readPixels čeká na dokončení GPU.
function bench(n=120,mode=ui.mode){const auto=ui.auto;ui.auto=false;const old=ui.mode;setMode(mode);throwIt();const px=new Uint8Array(4),ctx=renderer.getContext(),times=[];
 for(let i=0;i<n;i++){const t0=performance.now();clock+=1/60;if(!f.landed){const c=autoInput(f);if(c)eventInput(f,c,'auto');step(f);}const sh={...f,x:ui.start*SCREEN_METERS+f.x*ui.tempo};spring(rot,flightAngle(f),.07,1/60);renderer.info.reset();if(mode==='a')drawFlat(sh);else drawCity(sh);ctx.readPixels(0,0,1,1,ctx.RGBA,ctx.UNSIGNED_BYTE,px);times.push(performance.now()-t0);}
 setMode(old);ui.auto=auto;const st=frameStats(times.slice(10));return {mode,life:ui.life,dpr:ui.dpr,post:ui.post,tempo:ui.tempo,shadows:ui.shadows,size:`${gl.width}×${gl.height}`,avg:+st.avg.toFixed(2),p95:+st.p95.toFixed(2),calls:renderer.info.render.calls,tris:renderer.info.render.triangles};}
// Přetočení letu o s sekund a jeden snímek (ladění, snímky obrazovky ve skryté záložce).
function advance(s=1){if(!f)throwIt();for(let i=0;i<s*60&&!f.landed;i++)step(f);prev=null;rot.x=flightAngle(f);const sh={...f,x:ui.start*SCREEN_METERS+f.x*ui.tempo};if(ui.mode==="a")drawFlat(sh);else drawCity(sh);hud(sh);return {x:f.x,y:f.y,landed:f.landed};}
window.proto={bench,advance,life,get dir(){return dirS;},get f(){return f;},throwIt,ui,renderer,setMode,resize};// pro ladění z konzole
