// Prototyp 5 stylových směrů (research/design/04-nove-smery.md). Jedna scéna (kousek čtvrti, obloha, vlaštovka, stopa),
// pět způsobů kresby. A0 kreslí materiály ze src/render3d (toon, obrysy, půltón), B–E vlastní ploché shadery v tomto souboru.
// Ladění: window.__styly = {set({style,district,mode,view}), measure(), postcards()}.
import * as THREE from 'three';
import {planeShape,outlineStamp,boxVertices,pyramidVertices} from '../../src/render3d/geometry.js';
import {outlineMaterial,stampOutlineMaterial,postPass,buildingMaterial,windowTexture,toonRamp} from '../../src/render3d/toon.js';
import {createPlane,applyPose,PLANE_SCALE} from '../../src/render3d/plane.js';
import {CYBER,INK} from '../../src/render3d/palette.js';
import {STYLES,styleById,mix,DISTRICT_KINDS,PLACES} from './styles.js';
import {cityBlocks,windowsFor,LAYER_Z} from './city.js';

const $=s=>document.querySelector(s),stage=$('#stage'),canvas=$('#scene');
const q=new URLSearchParams(location.search);
const state={style:q.get('style')??'a0',district:+(q.get('d')??0),mode:q.get('mode')??'still',view:q.get('view')??'desktop',t:3.2};
const BARE=q.has('bare');if(BARE)document.body.classList.add('bare');if(q.has('cards'))document.body.classList.add('cards');
const VIEWS={desktop:[1280,800],phone:[375,667],landscape:[932,430]};
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const rt=new THREE.WebGLRenderTarget(4,4,{samples:4}),camera=new THREE.PerspectiveCamera(20,16/9,1,6000);
let scene=null,world=null;

// ---------- materiály ----------
// Plochý materiál podle normály: přední stěna = barva vrcholu, střecha (n.y) k `light`, bok (n.x) k `shade`; mlha podle hloubky.
function flatMaterial({light,shade,topK=.35,sideK=.35,fog,opacity=1,blending=THREE.NormalBlending,haze=1}){
 return new THREE.ShaderMaterial({vertexColors:true,transparent:opacity<1||blending!==THREE.NormalBlending,blending,depthWrite:blending===THREE.NormalBlending,premultipliedAlpha:blending===THREE.MultiplyBlending,
  uniforms:{light:{value:new THREE.Color(light)},shade:{value:new THREE.Color(shade)},topK:{value:topK},sideK:{value:sideK},
   fogColor:{value:new THREE.Color(fog.color)},fogNear:{value:fog.near},fogFar:{value:fog.far},opacity:{value:opacity},haze:{value:haze}},
  vertexShader:`varying vec3 vC;varying vec3 vN;varying float vD;
void main(){vC=color;vN=normalize(mat3(modelMatrix)*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vD=-mv.z;gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform vec3 light,shade,fogColor;uniform float topK,sideK,fogNear,fogFar,opacity,haze;varying vec3 vC;varying vec3 vN;varying float vD;
void main(){vec3 c=vC;if(vN.y>.5)c=mix(c,light,topK);else if(abs(vN.x)>.5)c=mix(c,shade,sideK);
c=mix(c,fogColor,haze*smoothstep(fogNear,fogFar,vD));
gl_FragColor=vec4(c,opacity);
${'#ifdef PREMULTIPLIED_ALPHA'}
gl_FragColor.rgb*=gl_FragColor.a;
${'#endif'}
}`});
}
// Post-proces B–E: převod do sRGB, ujetý soutisk (tmavší kopie posunutá o misreg px), zrno papíru, tón papíru, vinětace.
function stylePost(){
 const mat=new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:null},res:{value:new THREE.Vector2(1,1)},grain:{value:0},vignette:{value:0},misreg:{value:0},paper:{value:new THREE.Color(1,1,1)},levels:{value:0}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 res;uniform float grain,vignette,misreg,levels;uniform vec3 paper;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
vec3 g(vec2 uv){return pow(max(texture2D(tDiffuse,uv).rgb,0.),vec3(1./2.2));}
void main(){vec3 s=g(vUv);
if(misreg>0.){vec3 s2=g(vUv+vec2(misreg,-misreg*.6)/res);s=mix(s,min(s,s2),.6);}
if(levels>0.)s=floor(s*levels+.5)/levels;
s*=paper;vec2 px=floor(vUv*res/1.5);float n=h(px)-.5;s+=n*grain*(.6+.4*(1.-dot(s,vec3(.33))));
float v=length(vUv-.5)*1.45;s*=1.-vignette*pow(v,2.5);gl_FragColor=vec4(clamp(s,0.,1.),1.);}`,depthTest:false,depthWrite:false});
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,0,2],2));
 const sc=new THREE.Scene(),mesh=new THREE.Mesh(geo,mat);mesh.frustumCulled=false;sc.add(mesh);return {mat,scene:sc,cam:new THREE.OrthographicCamera(-1,1,1,-1,0,1)};
}
const A0POST=postPass(),POST=stylePost();

// ---------- obloha (kreslená do plátna, pozadí scény) ----------
function skyCanvas(st,d,w,h){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),R=st.render.kind,s=d.sky,hz=h*.86;
 if(d.bands){const n=s.length;for(let i=0;i<n;i++){g.fillStyle=s[i];g.fillRect(0,hz*i/n,w,hz/n+1);}g.fillStyle=s[n-1];g.fillRect(0,hz,w,h-hz);}
 else{const gr=g.createLinearGradient(0,0,0,hz);s.forEach((c2,i)=>gr.addColorStop(i/(s.length-1),c2));g.fillStyle=gr;g.fillRect(0,0,w,h);}
 const night=R==='a0'?d.mood.night>.3:!d.sun;
 if(night&&(R==='a0'||R==='backlit'||R==='poster')){let a=7;const rnd=()=>(a=(a*16807)%2147483647)/2147483647;g.fillStyle=R==='poster'?'#f3ead2':'#eef4ff';
  for(let i=0;i<160;i++){const x=rnd()*w,y=rnd()*hz*.6,r=(rnd()<.1?1.6:.9)*h/600;g.globalAlpha=.4+.6*rnd();g.beginPath();g.arc(x,y,r,0,7);g.fill();}g.globalAlpha=1;}
 const disc=(o,isSun)=>{const x=o.x*w,y=o.y*hz,r=o.r*h;
  if(R==='backlit'){const gr=g.createRadialGradient(x,y,0,x,y,r*(isSun?7:6));gr.addColorStop(0,o.color);gr.addColorStop(.12,o.glow??o.color);gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.globalAlpha=isSun?.85:.5;g.fillRect(0,0,w,h);g.globalAlpha=1;}
  if(R==='poster'&&o.rays){g.fillStyle=o.rays;for(let i=0;i<16;i++){const a0=i/16*Math.PI*2,a1=a0+Math.PI/16;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a0)*w,y+Math.sin(a0)*w);g.lineTo(x+Math.cos(a1)*w,y+Math.sin(a1)*w);g.fill();}}
  if(R==='a0'){g.fillStyle=o.halo??o.color;g.globalAlpha=.35;g.beginPath();g.arc(x,y,r*1.8,0,7);g.fill();g.globalAlpha=.6;g.beginPath();g.arc(x,y,r*1.35,0,7);g.fill();g.globalAlpha=1;}
  if(R==='paper'&&o.halo){g.fillStyle=o.halo;g.beginPath();g.arc(x,y,r*1.5,0,7);g.fill();}
  g.fillStyle=o.color;g.beginPath();g.arc(x,y,r,0,7);g.fill();
  if(R==='poster'){g.strokeStyle=st.render.ink;g.lineWidth=h/300;g.stroke();}};
 if(d.beams){g.fillStyle=d.beams;g.globalAlpha=.16;for(const [x,a] of [[.35,-.25],[.6,.18],[.85,-.08]]){g.beginPath();g.moveTo(x*w-6,hz);g.lineTo(x*w+6,hz);g.lineTo(x*w+Math.sin(a)*h+60,0);g.lineTo(x*w+Math.sin(a)*h-60,0);g.fill();}g.globalAlpha=1;}
 if(d.sun)disc(d.sun,true);if(d.moon)disc(d.moon,false);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return tx;
}
// A0: obloha a nálada z mood.js (4 pásy přechodem, posterizace je v post-procesu), slunce ve 3 kruzích.
function a0District(d,i){const m=d.mood,o={sky:m.sky,bands:false};const s=m.sun2.alpha>0?m.sun2:m.sun.alpha>0?m.sun:null;
 if(s&&s.height>-.05)o.sun={x:.78,y:1-Math.max(.05,s.height)*.9-.1,r:.07,color:s.color,halo:s.halo};if(m.moon.alpha>.3)o.moon={x:.3,y:.25,r:.045,color:m.moon.color,halo:'#ffffff'};return o;}

// ---------- geometrie města ----------
function addBlock(arr,b){const v=b.shape==='pyr'?pyramidVertices(b):boxVertices(b);
 if(b.rz!=null){const [px,py]=b.pivot,c=Math.cos(b.rz),s=Math.sin(b.rz),rot=(a,i,cx,cy)=>{const x=a[i]-cx,y=a[i+1]-cy;a[i]=cx+x*c-y*s;a[i+1]=cy+x*s+y*c;};
  for(let i=0;i<v.positions.length;i+=3){rot(v.positions,i,px,py);rot(v.normals,i,0,0);rot(v.outline,i,0,0);}}
 arr.push(v);return v;}
function merged(list,colors){
 const n=list.reduce((a,v)=>a+v.positions.length,0),P=new Float32Array(n),N=new Float32Array(n),O=new Float32Array(n),C=new Float32Array(n),U=new Float32Array(n/3*2);let o=0,u=0;
 list.forEach((v,i)=>{P.set(v.positions,o);N.set(v.normals,o);O.set(v.outline,o);U.set(v.uvs,u);const c=colors[i];for(let k=0;k<v.positions.length;k+=3){C[o+k]=c.r;C[o+k+1]=c.g;C[o+k+2]=c.b;}o+=v.positions.length;u+=v.uvs.length;});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('outline',new THREE.BufferAttribute(O,3));
 g.setAttribute('color',new THREE.BufferAttribute(C,3));g.setAttribute('uv',new THREE.BufferAttribute(U,2));return g;
}
// Papírové kulisy: vrstvy blíž k sobě (diorama), zmenšené tak, aby zdánlivá velikost zůstala stejná.
const FLAT_Z=[-330,-170,-60],CAM_D=486;
function flatten(b){const s=(CAM_D-FLAT_Z[b.layer])/(CAM_D-LAYER_Z[b.layer]),z0=LAYER_Z[b.layer];
 if(b.role==='ground'||b.role==='water'){b.z=FLAT_Z[b.layer]+(b.z-z0)*s;b.d*=s;return b;}
 const cx=state.anchor??0;b.x=cx+(b.x-cx);b.w*=s;b.h*=s;b.y*=s;b.d*=s;b.z=FLAT_Z[b.layer]+(b.z-z0)*s;if(b.pivot)b.pivot=[b.pivot[0],b.pivot[1]*s];return b;}

function colorFor(st,d,b,i){
 const R=st.render.kind;
 if(R==='a0'){const c=CYBER.city,base=i===0&&b.layer>0?c.suburbs[b.ci%c.suburbs.length]:d.wall;
  const k={wall:base,dominant:d.accent,roof:c.roof,accent:d.accent,ground:d.ground,water:c.water}[b.role]??base;return b.layer===0&&b.role!=='ground'?mix(k,d.fog.color,.35):k;}
 const L=d.layers[b.layer];
 switch(b.role){case 'wall':return L[b.ci%L.length];case 'dominant':return b.layer===2?d.accent:L[(b.ci+1)%L.length];case 'roof':return d.roof;case 'accent':return R==='backlit'?L[0]:d.accent;
  case 'water':return d.water??d.ground;case 'ground':return b.layer===2?d.ground:mix(d.ground,L[0],b.layer===1?.6:.85);}
 return L[0];
}

// ---------- vlaštovka a stopa (B–E) ----------
function makeFlatPlane(st,d){
 const s=planeShape('dart'),geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));
 const col=new Float32Array(s.positions.length),c=new THREE.Color(d.plane.fill);for(let i=0;i<col.length;i+=3){col[i]=c.r;col[i+1]=c.g;col[i+2]=c.b;}geo.setAttribute('color',new THREE.BufferAttribute(col,3));
 const dark=new THREE.Color(d.plane.fill).getHSL({}).l<.5;
 const mat=flatMaterial({light:d.plane.fill,shade:dark?mix(d.plane.fill,'#000000',.3):mix(d.plane.fill,d.plane.edge,.14),topK:0,sideK:1,fog:{color:'#000',near:1e9,far:2e9}});
 const mesh=new THREE.Mesh(geo,mat);mesh.renderOrder=3;
 const stp=outlineStamp(s.positions),hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(stp.positions,3));hg.setAttribute('shift',new THREE.Float32BufferAttribute(stp.shift,2));
 const hull=new THREE.Mesh(hg,stampOutlineMaterial({color:d.plane.edge,thickness:st.render.planeOutline}));hull.renderOrder=3;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 const crease=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:dark?d.plane.edge:mix(d.plane.edge,d.plane.fill,.3)}));crease.renderOrder=4;
 const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group();roll.add(mesh,hull,crease);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(PLANE_SCALE);
 if(st.render.shadows){mesh.castShadow=true;}
 return {root,pitch,yaw,roll,mesh,hull,dispose(){geo.dispose();hg.dispose();lg.dispose();mat.dispose();hull.material.dispose();crease.material.dispose();}};
}
const TN=60;
function makeRibbon(color,half,{dash=false,soft=false}={}){
 const pos=new Float32Array(TN*6),col=new Float32Array(TN*8),idx=[];for(let i=0;i<TN-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,4));geo.setIndex(idx);
 const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:false,blending:soft?THREE.AdditiveBlending:THREE.NormalBlending}));
 mesh.frustumCulled=false;const c=new THREE.Color(color);
 return {mesh,update(pts){const n=pts.length;for(let i=0;i<TN;i++){const p=pts[Math.min(i,n-1)]??[0,0],k=n>1?Math.min(i,n-1)/(n-1):0,w=half*(.35+.65*k),o=i*6;
   pos[o]=pos[o+3]=p[0];pos[o+1]=p[1]-w;pos[o+4]=p[1]+w;pos[o+2]=pos[o+5]=.5;
   let a=i<n?(soft?k*k*.8:k*.9+.1):0;if(dash&&Math.floor(i/2)%2)a=0;for(const j of [0,1]){const q2=(i*2+j)*4;col[q2]=c.r;col[q2+1]=c.g;col[q2+2]=c.b;col[q2+3]=a;}}
  geo.attributes.position.needsUpdate=geo.attributes.color.needsUpdate=true;},dispose(){geo.dispose();mesh.material.dispose();}};
}

// ---------- stavba scény ----------
function disposeWorld(){if(!world)return;scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!o.userData.keep){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{for(const k of ['map','emissiveMap','gradientMap'])m[k]?.dispose?.();m.dispose();});}});
 world.plane?.dispose?.();world.a0plane?.dispose?.();world.sky?.dispose();scene=null;world=null;}
function build(styleId,di){
 disposeWorld();const st=styleById(styleId),R=st.render.kind,kind=DISTRICT_KINDS[di];let d=st.districts[di];
 if(R==='a0')d={...d,...a0District(d,di)};
 scene=new THREE.Scene();world={st,d,R,kind,cam:{}};
 const fog=R==='a0'?d.fog:d.fog;scene.fog=new THREE.Fog(fog.color,fog.near,fog.far);
 // město
 const blocks=cityBlocks(kind).map(b=>st.render.flat?flatten(b):b);
 const byLayer=[[],[],[],[],[],[]],cols=[[],[],[],[],[],[]];
 // riso: zem a voda kryjí (normální míchání), budovy se přetiskují (násobení)
 for(const b of blocks){const L=b.layer+(R==='riso'&&(b.role==='ground'||b.role==='water')?3:0);addBlock(byLayer[L],b);cols[L].push(new THREE.Color(colorFor(st,d,b,di)));}
 if(R!=='riso'){byLayer.length=3;cols.length=3;}
 const outlines=st.render.cityOutline>0;
 if(R==='a0'){
  const ramp=toonRamp([70,150,255]),wt=windowTexture(7,Math.max(.12,d.mood.windows));world.ramp=ramp;
  const mat=buildingMaterial({ramp,emissiveMap:wt,farZ:-600});mat.userData.uniforms.winColor.value.set(d.mood.windowColor);
  byLayer.forEach((l,i)=>{const g=merged(l,cols[i]),m=new THREE.Mesh(g,i?mat:mat);m.castShadow=m.receiveShadow=true;scene.add(m);
   const o=new THREE.Mesh(g,outlineMaterial({thickness:st.render.cityOutline,fog:d.fog}));scene.add(o);});
  const m=d.mood,key=new THREE.DirectionalLight(m.key.color,m.key.intensity);key.position.set(...m.key.dir.map(v=>v*800));key.castShadow=true;
  Object.assign(key.shadow.camera,{left:-600,right:600,top:500,bottom:-100,near:10,far:3000});key.shadow.mapSize.set(2048,2048);scene.add(key,key.target);world.key=key;
  scene.add(new THREE.HemisphereLight(m.hemi.sky,m.hemi.ground,m.hemi.intensity));const rim=new THREE.DirectionalLight(m.rim.color,m.rim.intensity);rim.position.set(-400,200,-600);scene.add(rim);
 }else if(R==='paper'){
  const mat=new THREE.MeshLambertMaterial({vertexColors:true});
  byLayer.forEach((l,i)=>{const m=new THREE.Mesh(merged(l,cols[i]),mat);m.castShadow=m.receiveShadow=true;scene.add(m);});
  const key=new THREE.DirectionalLight(d.light,1.25);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.radius=6;key.shadow.bias=-.0008;
  Object.assign(key.shadow.camera,{left:-450,right:450,top:380,bottom:-60,near:10,far:1600});scene.add(key,key.target);world.key=key;world.keyDir=[-.35,.55,.75];
  scene.add(new THREE.HemisphereLight('#ffffff',d.shade,1.9));
  // kulisa oblohy, na kterou padají stíny vrstev (diorama)
  const back=new THREE.Mesh(new THREE.PlaneGeometry(9000,3000),new THREE.ShadowMaterial({opacity:.22,color:new THREE.Color(d.shade)}));back.position.set(1000,1000,-420);back.receiveShadow=true;scene.add(back);
 }else{
  const top={poster:.3,riso:0,backlit:.12}[R],side={poster:.45,riso:0,backlit:.2}[R],haze=R==='backlit'?1:R==='poster'?.55:.4;
  byLayer.forEach((l,i)=>{if(!l.length)return;const multiply=R==='riso'&&i<3;const m=new THREE.Mesh(merged(l,cols[i]),flatMaterial({light:d.light,shade:d.shade,topK:top,sideK:side,fog:d.fog,haze,opacity:multiply?1:1,blending:multiply?THREE.MultiplyBlending:THREE.NormalBlending}));
   m.renderOrder=R==='riso'?(i>=3?-1:i):i;scene.add(m);if(outlines){const o=new THREE.Mesh(m.geometry,outlineMaterial({color:st.render.ink,thickness:st.render.cityOutline*(i===0?.7:1),fog:{color:d.fog.color,near:d.fog.near*1.6,far:d.fog.far*1.4}}));scene.add(o);}});
 }
 // okna (B–E)
 if(R!=='a0'&&d.windows?.density){const ws=windowsFor(blocks,d.windows.density),g=new THREE.PlaneGeometry(1,1),m=new THREE.MeshBasicMaterial({fog:true,transparent:R==='riso',blending:R==='riso'?THREE.MultiplyBlending:THREE.NormalBlending,premultipliedAlpha:R==='riso'});
  const im=new THREE.InstancedMesh(g,m,ws.length),M=new THREE.Matrix4(),C=new THREE.Color(),list=d.windows.colors??[d.windows.color];
  ws.forEach((w,i)=>{M.makeScale(w.w,w.h,1).setPosition(w.x,w.y,w.z);im.setMatrixAt(i,M);im.setColorAt(i,C.set(list[w.ci%list.length]));});im.renderOrder=5;scene.add(im);}
 // mraky
 const cl=st.render.clouds,cg=new THREE.CircleGeometry(1,28),cz=st.render.flat?-300:-1000,cs=st.render.flat?.5:1;
 const cloudCol=R==='a0'?mix(d.sky[2],'#ffffff',.25):R==='paper'?'#ffffff':R==='poster'?mix(d.sky[d.sky.length-1],'#ffffff',.35):R==='riso'?mix('#ffffff',d.layers[1][0],.35):mix(d.sky[2],'#ffffff',.3);
 const cm=new THREE.MeshBasicMaterial({color:cloudCol,fog:false,transparent:R!=='paper',opacity:R==='backlit'?.55:1,blending:R==='riso'?THREE.MultiplyBlending:THREE.NormalBlending,premultipliedAlpha:R==='riso'});
 const cn=di===3&&R!=='paper'?0:7;for(let i=0;i<cn;i++){const x=-200+i*420+((i*137)%160),y=(cl==='streaks'?150:300)*cs+((i*71)%90)*cs;
  for(let k=0;k<(cl==='streaks'?1:4);k++){const m=new THREE.Mesh(cg,cm),r=(cl==='streaks'?60:18+((i+k)*13)%16)*cs;m.scale.set(cl==='streaks'?r*3:r*(cl==='a0'?2.2:1),cl==='streaks'?r*.08:r*(cl==='a0'?.6:1),1);
   m.position.set(x+k*r*1.1,y+(k%2?r*.35:0),cz);if(R==='paper')m.castShadow=true;scene.add(m);}}
 // vlaštovka
 if(R==='a0'){const p=createPlane({ramp:world.ramp,planeHull:stampOutlineMaterial({color:INK,thickness:2.6}),palette:CYBER});scene.add(p.group);world.a0plane=p;}
 else{world.plane=makeFlatPlane(st,d);scene.add(world.plane.root);const tr=d.trail;world.trail=[];
  if(tr.edge)world.trail.push(makeRibbon(tr.edge,.95,tr));world.trail.push(makeRibbon(tr.core,tr.edge?.5:.55,tr));world.trail.forEach(r=>{r.mesh.renderOrder=2;scene.add(r.mesh);});}
 world.pts=[];
 return world;
}

// ---------- let a kamera ----------
const SPEED=62;
function flightAt(t){const x=120+SPEED*t,y=82+16*Math.sin(t*.8)+5*Math.sin(t*2.1),dy=16*.8*Math.cos(t*.8)+5*2.1*Math.cos(t*2.1);return {x,y,angle:Math.atan2(-dy,SPEED)};}
function pose(t){
 const f=flightAt(t),w=world;
 // stopa: body za posledních ~1,6 s
 w.pts.length=0;for(let i=TN-1;i>=0;i--){const g=flightAt(t-i*.028);w.pts.push([g.x-.42*PLANE_SCALE*Math.cos(g.angle),g.y+.42*PLANE_SCALE*Math.sin(g.angle)]);}
 if(w.a0plane){const p=w.a0plane;p.trail.reset();for(let i=TN;i>0;i--){const g=flightAt(t-i*.028);p.apply({x:g.x,y:g.y,angle:g.angle},{flying:true,trailColor:w.d.mood.trail});}p.apply({x:f.x,y:f.y,angle:f.angle},{flying:true,trailColor:w.d.mood.trail});}
 else{applyPose(w.plane,{x:f.x,y:f.y,angle:f.angle});w.trail.forEach(r=>r.update(w.pts));}
 return f;
}
function frameCamera(f,w,h){
 const aspect=w/h,width=aspect>1.2?305:aspect>.9?240:120,fovH=Math.tan(THREE.MathUtils.degToRad(10))*aspect,dist=width/2/fovH,H=2*dist*Math.tan(THREE.MathUtils.degToRad(10));
 const cx=f.x+width*(.5-.23),cy=Math.max(H*.42,f.y-H*.08);camera.aspect=aspect;camera.position.set(cx,cy+H*.04,dist);camera.lookAt(cx,cy,0);camera.updateProjectionMatrix();
 world.cam={width,dist,H};
 if(world.key){const k=world.keyDir??world.d.mood?.key.dir??[.6,.5,.6];world.key.position.set(cx+k[0]*900,k[1]*900,k[2]*900);world.key.target.position.set(cx,0,-200);world.key.target.updateMatrixWorld();}
}
let skyKey='';
function render(target=null,w=canvas.width,h=canvas.height){
 const f=pose(state.t);frameCamera(f,w,h);
 const k=`${state.style}${state.district}${w}x${h}`;if(skyKey!==k||!world.sky){world.sky?.dispose();const sw=Math.min(1024,w),sh=Math.round(sw*h/w);world.sky=skyCanvas(world.st,world.d,sw,sh);scene.background=world.sky;skyKey=k;}
 rt.setSize(w,h);scene.traverse(o=>{const u=o.material?.uniforms?.resolution;if(u)u.value.set(w,h);});
 renderer.setRenderTarget(rt);renderer.setClearColor(0x000000,1);renderer.clear();renderer.render(scene,camera);
 const P=world.R==='a0'?A0POST:POST,u=P.mat.uniforms;u.tDiffuse.value=rt.texture;
 if(world.R==='a0'){u.resolution.value.set(w,h);u.dotSize.value=5*renderer.getPixelRatio();}
 else{const p=world.st.render.post??{};u.res.value.set(w,h);u.grain.value=p.grain??0;u.vignette.value=p.vignette??0;u.misreg.value=(p.misreg??0)*renderer.getPixelRatio();u.paper.value.set(p.paperTint??'#ffffff');u.levels.value=p.levels??0;}
 renderer.setRenderTarget(target);renderer.render(P.scene,P.cam);renderer.setRenderTarget(null);
 return f;
}

// ---------- UI (DOM nad plátnem) ----------
function sizeStage(){
 const [w,h]=VIEWS[state.view]??VIEWS.desktop,avail=document.querySelector('main').clientWidth,k=Math.min(1,avail/w,BARE?(innerHeight-8)/h:1);
 stage.style.width=w+'px';stage.style.height=h+'px';stage.style.transform=`scale(${k})`;stage.parentElement.style.height=h*k+'px';
 renderer.setSize(w,h,false);
}
function updateUi(f){
 const st=styleById(state.style),d=st.districts[state.district],pl=PLACES[state.district];
 stage.dataset.style=st.id;stage.dataset.mode=state.mode;stage.dataset.view=state.view;
 $('#hud-district').textContent=(st.id==='a0'?d.name:d.name).toUpperCase();$('#hud-place').textContent=pl[0];
 $('#hud-dist').textContent=Math.round(state.district*1219+f.x*.5)+' m';
 const qd=st.qte,root=document.documentElement.style;for(const [k,v] of Object.entries({'--qte-disc':qd.disc,'--qte-track':qd.track,'--qte-ok':qd.success,'--qte-perfect':qd.perfect,'--qte-dot':qd.dot,'--value':st.value}))stage.style.setProperty(k,v);
 $('#qte-disc').setAttribute('fill-opacity',qd.discAlpha);
 // QTE kruh vpravo před vlaštovkou
 const v=new THREE.Vector3(f.x,f.y,0).project(camera),W=stage.clientWidth||+stage.style.width.replace('px',''),H=+stage.style.height.replace('px','');
 const qe=$('#qte');qe.style.left=((v.x*.5+.5)*W+Math.max(90,W*.22))+'px';qe.style.top=((-v.y*.5+.5)*H-Math.min(70,H*.1))+'px';
 document.querySelectorAll('[data-pick]').forEach(b=>b.setAttribute('aria-pressed',String(state[b.dataset.pick]==b.dataset.value)));
 $('#pitch').innerHTML=`<b>${st.letter} ${st.name}</b> · ${d.name} (${d.time})<br>${st.pitch}`;
}
// Pohlednice: 4 místa aktuálního stylu vykreslená do render targetu 480 × 320 a vložená do rámu stylu.
const capRT=new THREE.WebGLRenderTarget(480,320);
function postcards(){
 const st=styleById(state.style),box=$('#cards');box.innerHTML='';box.dataset.style=st.id;const keep=state.district,keepT=state.t;
 for(let i=0;i<4;i++){build(st.id,i);state.t=3.2;skyKey='';render(capRT,480,320);
  const px=new Uint8Array(480*320*4);renderer.readRenderTargetPixels(capRT,0,0,480,320,px);
  const c=document.createElement('canvas');c.width=480;c.height=320;const g=c.getContext('2d'),img=g.createImageData(480,320);
  for(let y=0;y<320;y++)img.data.set(px.subarray((319-y)*480*4,(320-y)*480*4),y*480*4);g.putImageData(img,0,0);
  const d=st.districts[i],fig=document.createElement('figure');fig.className='card';fig.innerHTML=`<div class="card-img"><img alt="" src="${c.toDataURL('image/jpeg',.9)}"><span class="card-title">${PLACES[i][0]}</span></div><figcaption><b>${d.name}</b><span>${i*4+1}/16</span></figcaption>`;box.append(fig);}
 state.district=keep;state.t=keepT;build(st.id,keep);skyKey='';
}
// Změřený kontrast (WCAG) vlaštovky z vykresleného snímku: výplň (střed křídla) a pozadí (okolí bez vlaštovky).
const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;};return .2126*f(r)+.7152*f(g)+.0722*f(b);};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
// Vlaštovka = pixely, které se změní, když ji skryjeme (okno 48 × 48 px kolem středu). Výplň = změněné pixely nejdál od barvy obrysu,
// obrys = změněné pixely nejblíž barvě obrysu, pozadí = průměr nezměněných pixelů v okně (místní okolí).
function measure(){
 const gl=renderer.getContext(),W=canvas.width,H=canvas.height,S=Math.round(24*renderer.getPixelRatio()),n=S*2+1;
 const pl=world.a0plane?world.a0plane.current:world.plane;
 const grab=(x,y)=>{const b=new Uint8Array(n*n*4);gl.readPixels(Math.round(x)-S,H-Math.round(y)-S,n,n,gl.RGBA,gl.UNSIGNED_BYTE,b);return b;};
 const hideTrail=v=>{(world.trail??[]).forEach(r=>r.mesh.visible=v);if(world.a0plane)world.a0plane.trail.mesh.visible=v;};
 hideTrail(false);render();pl.root.updateMatrixWorld(true);const c=new THREE.Vector3().setFromMatrixPosition(pl.root.matrixWorld).project(camera),cx=(c.x*.5+.5)*W,cy=(-c.y*.5+.5)*H;
 const A=grab(cx,cy);pl.roll.visible=false;render();const B=grab(cx,cy);pl.roll.visible=true;hideTrail(true);render();
 const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),toHex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''),E=hx(world.d.plane.edge);
 const changed=[],bg=[0,0,0];let nb=0;
 for(let i=0;i<n*n;i++){const a=[A[i*4],A[i*4+1],A[i*4+2]],b=[B[i*4],B[i*4+1],B[i*4+2]],d=Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  if(d>24)changed.push(a);else{bg[0]+=b[0];bg[1]+=b[1];bg[2]+=b[2];nb++;}}
 const bgc=bg.map(v=>v/Math.max(1,nb)),dist=p=>Math.hypot(p[0]-E[0],p[1]-E[1],p[2]-E[2]),mx=Math.max(0,...changed.map(dist));
 const avg=l=>l.length?[0,1,2].map(k=>l.reduce((s,p)=>s+p[k],0)/l.length):[0,0,0];
 const fill=avg(changed.filter(p=>dist(p)>mx*.75)),edge=avg(changed.filter(p=>dist(p)<mx*.25));
 return {style:state.style,district:state.district,px:changed.length,fill:toHex(fill),edge:toHex(edge),bg:toHex(bgc),fillVsBg:+ratio(fill,bgc).toFixed(2),edgeVsBg:+ratio(edge,bgc).toFixed(2),edgeSpec:world.d.plane.edge,edgeSpecVsBg:+ratio(E,bgc).toFixed(2)};
}

// ---------- smyčka ----------
let last=performance.now(),dirty=true;
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;
 if(state.mode==='flight'||state.mode==='menu'){state.t+=dt*(state.mode==='menu'?.6:1);if(state.t>36)state.t=3.2;dirty=true;
  if(state.mode==='flight'&&state.auto!=null&&state.t-state.auto>9)go('still');}
 if(dirty&&document.visibilityState==='visible'){const f=render();updateUi(f);dirty=state.mode==='flight'||state.mode==='menu';}
 requestAnimationFrame(loop);}
function set(o={}){const rebuild=o.style!=null&&o.style!==state.style||o.district!=null&&o.district!==state.district||!world;Object.assign(state,o);
 if(o.mode&&!['flight','menu','pause','settings','atlas','workshop'].includes(o.mode))state.t=3.2;if(o.mode&&o.mode!=='flight')state.auto=null;if(o.view)sizeStage();if(rebuild){build(state.style,state.district);skyKey='';}
 const f=render();updateUi(f);dirty=true;if((rebuild&&!o.nocards)||o.cards)postcards();
 const u=new URL(location);u.searchParams.set('style',state.style);u.searchParams.set('d',state.district);u.searchParams.set('mode',state.mode);u.searchParams.set('view',state.view);history.replaceState(null,'',u);}
document.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.pick,v=k==='district'?+b.dataset.value:b.dataset.value;set({[k]:v});}));
addEventListener('keydown',e=>{const i=STYLES.findIndex(s=>s.id===state.style);if(e.key==='ArrowRight')set({style:STYLES[(i+1)%5].id});if(e.key==='ArrowLeft')set({style:STYLES[(i+4)%5].id});
 if(/^[1-4]$/.test(e.key))set({district:+e.key-1});});
addEventListener('resize',()=>{sizeStage();dirty=true;});
if(matchMedia('(prefers-reduced-motion: reduce)').matches&&state.mode==='flight')state.mode='still';
sizeStage();build(state.style,state.district);set({});postcards();requestAnimationFrame(loop);
// ---------- průchod obrazovkami jako ve hře (maketa): menu → let → výsledek (a) → znovu / Dílna / Atlas / menu ----------
const T={en:{tagline:'Fly to the horizon · by paper',throw:'Throw',workshop:'Workshop',atlas:'Atlas',settings:'Settings',paused:'Paused',resume:'Resume',menu:'Menu',language:'Language',music:'Music',sound:'Sound',motion:'Reduce motion',back:'Back',delivered:'Delivered',best:'New best',again:'Throw again',distance:'Distance',coins:'Coins',pause:'Pause',paper:'Paper',power:'Power',folds:'Folds'},
 cs:{tagline:'Leť za obzor · po papíře',throw:'Házet',workshop:'Dílna',atlas:'Atlas',settings:'Nastavení',paused:'Pauza',resume:'Pokračovat',menu:'Menu',language:'Jazyk',music:'Hudba',sound:'Zvuky',motion:'Omezit pohyb',back:'Zpět',delivered:'Doručeno',best:'Nový rekord',again:'Házet znovu',distance:'Vzdálenost',coins:'Mince',pause:'Pauza',paper:'Papír',power:'Síla',folds:'Přehyby'}};
function lang(id){state.lang=id;const d=T[id]??T.en;document.querySelectorAll('#stage [data-t]').forEach(e=>{e.textContent=d[e.dataset.t]??e.textContent;});
 document.querySelectorAll('#stage [data-t-aria]').forEach(e=>e.setAttribute('aria-label',d[e.dataset.tAria]));document.querySelectorAll('#stage [data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===id)));}
const OVER=['pause','settings','atlas','workshop'],stack=[];
// Překryvy (pauza, nastavení, Atlas, Dílna) se vrací tam, odkud přišly; návrat do letu let nepřeruší, jinak „Házet“ = nový hod.
function go(to){const from=state.mode,auto=state.auto??state.keep;let resume=from==='pause'&&to==='flight';
 if(to==='back'){to=stack.pop()??'menu';resume=to==='flight'||to==='event';}else if(OVER.includes(to)){if(!OVER.includes(from)||from==='pause')stack.push(from);}else stack.length=0;
 if(to==='atlas')fillAtlas();set({mode:to});
 if(to==='flight'){if(resume)state.auto=auto;else{state.t=3.2;state.auto=3.2;}}else state.keep=auto;}
function fillAtlas(){const box=document.querySelector('#atlas-cards');if(!box)return;box.innerHTML='';box.dataset.style=state.style;document.querySelectorAll('#cards .card').forEach(c=>box.append(c.cloneNode(true)));}
stage.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go);}const l=e.target.closest('[data-lang]');if(l)lang(l.dataset.lang);});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(state.mode==='flight'||state.mode==='event')go('pause');else if(OVER.includes(state.mode))go('back');}});
window.__styly={go,lang,set,measure,postcards,state,renderer,info:()=>({calls:renderer.info.render.calls,tris:renderer.info.render.triangles})};
