// Prototyp čtyř papírů (research/design/01-papiry.md). Vedle sebe / detail v Dílně / za letu; nákup v Dílně s výměnou papíru.
// Importuje jen čisté a three.js části src/render3d/ (planeShape, mergeBlocks, toon, applyPose, fx-map), nic v src/ nemění.
import * as THREE from 'three';
import {planeShape,mergeBlocks} from '../../src/render3d/geometry.js';
import {outlineMaterial,skyTexture,toonRamp} from '../../src/render3d/toon.js';
import {applyPose,PLANE_SCALE} from '../../src/render3d/plane.js';
import {speedLines} from '../../src/render3d/fx-map.js';
import {onTwos} from '../../src/render3d/comic.js';
import {wobble} from '../../src/motion.js';
import {PAPERS,DISTRICTS,FOIL_BANDS,paintPattern,paintSwatch,PLACES,PRICES,speedAt,paperOf,preview} from './papers.js';

const $=id=>document.getElementById(id),C=h=>new THREE.Color(h),WHITE=C('#ffffff'),BANDS=FOIL_BANDS.map(C);
const mq=matchMedia('(prefers-reduced-motion: reduce)');
const ui={mode:'lineup',paper:0,bg:'auto',speed:95,model:'dart',crown:false,game:false,reduced:mq.matches,wipe:null};
const stage=$('stage'),gl=$('gl'),lines=$('lines'),lg=lines.getContext('2d');
const renderer=new THREE.WebGLRenderer({canvas:gl,antialias:true});renderer.setScissorTest(true);
const ramp=toonRamp(),outlines=[];
const outline=o=>{const m=outlineMaterial(o);outlines.push(m);return m;};

// ── Materiál papíru: 3 tvrdé tóny (vlastní pro každý papír), vzor z canvasu, půltón ve stínu, obrysové světlo čtvrti,
// u Foil duhové pruhy podle úhlu pohledu (posterizované na 4 barvy) a tvrdý odlesk, u Washi vnitřní záře.
// clipLo/clipHi + edge = výměna papíru „přeložením“ od nosu k ocasu.
const VS=`varying vec3 vN;varying vec3 vV;varying vec2 vUv;
void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
const FS=`uniform sampler2D map;uniform vec3 t0;uniform vec3 t1;uniform vec3 t2;uniform vec3 ink;uniform vec3 lightDir;uniform vec3 lightCol;uniform vec3 rimCol;
uniform vec3 emissive;uniform float glow;uniform float foil;uniform vec3 b0;uniform vec3 b1;uniform vec3 b2;uniform vec3 b3;uniform float shift;
uniform float clipLo;uniform float clipHi;uniform float edge;uniform float dotSize;uniform float flash;uniform float silhouette;
varying vec3 vN;varying vec3 vV;varying vec2 vUv;
void main(){
 if(vUv.x<clipLo||vUv.x>clipHi)discard;
 vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;
 vec3 L=normalize(lightDir);float d=dot(N,L)*.5+.5;float band=d>.6?0.:d>.36?1.:2.;
 vec3 c=band<.5?t0:band<1.5?t1:t2;float lv=band<.5?1.:band<1.5?.8:.52;
 vec4 tx=texture2D(map,vUv);
 if(foil>.5){float h=fract(dot(N,vV)*1.7+vUv.x*.9+vUv.y*.6+shift);vec3 f=h<.25?b0:h<.5?b1:h<.75?b2:b3;c=mix(c,f*lv,.82)+tx.a*.16;
  vec3 H=normalize(L+vV);if(dot(N,H)>.965)c=vec3(1.);}
 else c=mix(c,tx.rgb*lv,tx.a);
 c*=mix(vec3(1.),lightCol,.3);
 float rim=1.-abs(dot(N,vV));c+=rimCol*step(.8,rim)*.4;
 if(band>1.5){vec2 g=mat2(.7071,-.7071,.7071,.7071)*gl_FragCoord.xy/dotSize;if(length(fract(g)-.5)<.27)c=mix(c,ink,.5);}
 c+=emissive*glow;
 if(edge>=0.&&abs(vUv.x-edge)<.02)c=vec3(1.);
 c=mix(c,vec3(1.),flash);c=mix(c,ink*1.8+.05,silhouette);
 gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
}`;
const textures={};
const patternTex=id=>textures[id]??=(t=>{t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;})(new THREE.CanvasTexture(paintPattern(id)));
const halo=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,4,64,64,62);
 r.addColorStop(0,'rgba(255,210,140,.6)');r.addColorStop(.45,'rgba(255,190,110,.35)');r.addColorStop(1,'rgba(255,170,90,0)');g.fillStyle=r;g.fillRect(0,0,128,128);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;})();
// Tvar vlaštovky z geometry.planeShape + uv (u po délce, v po rozpětí; kýl podle výšky).
const shapes={};
const shapeOf=model=>shapes[model]??=(()=>{const s=planeShape(model),uv=[];
 for(let i=0;i<s.positions.length;i+=3){const y=s.positions[i+1],z=s.positions[i+2];uv.push(s.positions[i]+.45,Math.abs(z)<.02?.5-y*2:.5+z);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));
 geo.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 const lgeo=new THREE.BufferGeometry();lgeo.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 return {geo,lgeo,span:model==='glider'?.5:.36};})();
function makePlane(p,model){
 const {geo,lgeo,span}=shapeOf(model),[a,b,c]=p.tones.map(C);
 const mat=new THREE.ShaderMaterial({vertexShader:VS,fragmentShader:FS,side:THREE.DoubleSide,uniforms:{map:{value:patternTex(p.pattern)},t0:{value:a},t1:{value:b},t2:{value:c},
  ink:{value:C(p.outline.color)},lightDir:{value:new THREE.Vector3(0,1,1)},lightCol:{value:C('#ffffff')},rimCol:{value:C('#000000')},emissive:{value:C(p.emissive)},glow:{value:p.glow},
  foil:{value:p.foil},b0:{value:BANDS[0]},b1:{value:BANDS[1]},b2:{value:BANDS[2]},b3:{value:BANDS[3]},shift:{value:0},clipLo:{value:-1},clipHi:{value:2},edge:{value:-1},
  dotSize:{value:4},flash:{value:0},silhouette:{value:0}}});
 const mesh=new THREE.Mesh(geo,mat);mesh.renderOrder=2;
 const hullMat=outline({side:THREE.DoubleSide,thickness:p.outline.px,color:p.outline.color});hullMat.depthWrite=false;const hull=new THREE.Mesh(geo,hullMat);hull.renderOrder=1;
 const parts=[mesh,hull];
 if(p.outline.double){const m=outline({side:THREE.DoubleSide,thickness:p.outline.double.px,color:p.outline.double.color});m.depthWrite=false;const h=new THREE.Mesh(geo,m);h.renderOrder=0;parts.push(h);}
 const crease=new THREE.LineSegments(lgeo,p.crease.dash?new THREE.LineDashedMaterial({color:p.crease.color,dashSize:p.crease.dash[0],gapSize:p.crease.dash[1]}):new THREE.LineBasicMaterial({color:p.crease.color}));
 if(p.crease.dash)crease.computeLineDistances();crease.renderOrder=3;parts.push(crease);
 const glowSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:halo,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));glowSprite.scale.set(1.7,1.1,1);glowSprite.position.set(.05,0,0);glowSprite.visible=false;glowSprite.renderOrder=0;
 const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group(),tail=new THREE.Object3D(),tipL=new THREE.Object3D(),tipR=new THREE.Object3D();
 tail.position.set(-.45,-.02,0);tipL.position.set(-.48,.05,span);tipR.position.set(-.48,.05,-span);
 roll.add(...parts,glowSprite,tail,tipL,tipR);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(PLANE_SCALE);
 return {p,model,root,pitch,yaw,roll,mat,glowSprite,tail,tipL,tipR};
}
const planes={dart:PAPERS.map(p=>makePlane(p,'dart')),glider:PAPERS.map(p=>makePlane(p,'glider'))};

// ── Čtvrti: obloha, mlha, světlo a pruh komiksového města (blízká a vzdálená řada, okna), aby šlo posoudit čitelnost papíru na pozadí.
const L=420,FOG=[140,560];
function strip(d,seed,{z,depth,base,hmin,hmax,far}){
 let s=seed;const r=()=>(s=(s*16807)%2147483647)/2147483647,blocks=[],wins=[],fogC=C(d.fog);
 for(let x=0;x<L;){const w=7+r()*12,h=hmin+r()*(hmax-hmin),body=C(d.body[Math.floor(r()*d.body.length)]);if(far)body.lerp(fogC,.45);
  blocks.push({type:'box',x,w,y:base,h,z,d:depth,color:body});
  if(r()<.55)blocks.push({type:'box',x:x-.3,w:w+.6,y:base+h,h:.9,z,d:depth+.6,color:C(d.accent[Math.floor(r()*d.accent.length)]).lerp(fogC,far?.45:0)});
  if(!far)for(let wy=base+h-4;wy>base+2;wy-=4)for(let wx=x+1.5;wx<x+w-2;wx+=3.2)if(r()<d.lit)wins.push({type:'box',x:wx,w:1.6,y:wy,h:1.8,z:z+depth/2+.05,d:.1,color:C(d.window)});
  x+=w+1+r()*4;}
 return {blocks,wins};
}
function bufferOf(m){const g=new THREE.BufferGeometry();for(const [k,n] of [['position',3],['normal',3],['uv',2],['color',3],['outline',3]])g.setAttribute(k,new THREE.BufferAttribute(m[k],n));g.computeBoundingSphere();return g;}
function makeDistrict(d,i){
 const scene=new THREE.Scene();scene.background=skyTexture(d.sky);scene.fog=new THREE.Fog(d.fog,...FOG);
 scene.add(new THREE.HemisphereLight(d.hemi[0],d.hemi[1],1.3));const key=new THREE.DirectionalLight(d.key,2.2);key.position.set(...d.dir);scene.add(key);
 const toon=new THREE.MeshToonMaterial({vertexColors:true,gradientMap:ramp}),lit=new THREE.MeshBasicMaterial({vertexColors:true}),hull=outline({fog:{color:d.fog,near:FOG[0],far:FOG[1]},thickness:2});
 const row=(o,seed)=>{const g=new THREE.Group(),{blocks,wins}=strip(d,seed,o),bg=bufferOf(mergeBlocks(blocks,b=>b.color.toArray()));
  const wg=wins.length?bufferOf(mergeBlocks(wins,b=>b.color.toArray())):null;
  for(const off of [0,L]){const m=new THREE.Mesh(bg,toon),h=new THREE.Mesh(bg,hull);m.position.x=h.position.x=off;g.add(m,h);if(wg){const w=new THREE.Mesh(wg,lit);w.position.x=off;g.add(w);}}
  scene.add(g);return g;};
 const near=row({z:-40,depth:10,base:-50,hmin:16,hmax:34},11+i*97),far=row({z:-175,depth:14,base:-80,hmin:24,hmax:52,far:true},53+i*31);
 return {d,scene,near,far,lightDir:new THREE.Vector3(...d.dir).normalize(),key:C(d.key),rim:C(d.rim),trail:C(d.trail)};
}
const districts=DISTRICTS.map(makeDistrict);
const camera=new THREE.PerspectiveCamera(20,16/9,1,2000);

// ── Stopa: pásky ve scéně (svět ubíhá, vlaštovka stojí). Barva = čtvrť, tvar = papír (jedna linka, provázek, měkký lampion, kometa).
const N=96;
function ribbon(){const pos=new Float32Array(N*6),col=new Float32Array(N*8),idx=[];for(let i=0;i<N-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,4));geo.setIndex(idx);
 const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,fog:false}));mesh.frustumCulled=false;mesh.renderOrder=-1;return {mesh,pos,col,geo};}
const trail={group:new THREE.Group(),ribbons:Array.from({length:4},ribbon),src:{tail:[],tipL:[],tipR:[]},acc:0,s:0};
trail.ribbons.forEach(r=>trail.group.add(r.mesh));
const tmp=new THREE.Vector3(),tmpC=new THREE.Color();
function fillRibbon(r,pts,st,col,len){
 const n=Math.min(pts.length,len);r.mesh.visible=n>1;if(n<2)return;
 for(let i=0;i<N;i++){const j=Math.min(i,n-1),q=pts[pts.length-1-j],a=j/(len-1),alive=i<n;
  const off=st.twine?st.twine*Math.sin(q.s*.35+st.phase):0,w=st.w*(st.taper?Math.pow(Math.max(0,1-a),.8):.35+.65*(1-a))/2;
  const cc=st.core?WHITE:st.rainbow&&a>.1?BANDS[Math.floor(q.s/9)%4]:col,al=alive?st.a*Math.pow(Math.max(0,1-a),1.3):0;
  r.pos.set([q.x,q.y+off-w,q.z,q.x,q.y+off+w,q.z],i*6);r.col.set([cc.r,cc.g,cc.b,al,cc.r,cc.g,cc.b,al],i*8);}
 r.geo.attributes.position.needsUpdate=r.geo.attributes.color.needsUpdate=true;
}
function updateTrail(pl,dt,v,dist){
 const p=pl.p,crown=ui.crown,len=Math.round(p.trail.len*(crown&&p.id==='foil'?1.5:1)),S=trail.src;
 for(const k in S)for(const q of S[k])q.x-=v*dt;
 trail.acc+=v*dt;trail.s+=v*dt;
 if(trail.acc>=1||!S.tail.length){trail.acc=0;for(const k of ['tail','tipL','tipR']){pl[k].getWorldPosition(tmp);S[k].push({x:tmp.x,y:tmp.y,z:k==='tail'?tmp.z-.3:tmp.z,s:trail.s});if(S[k].length>N)S[k].shift();}}
 const rs=[...p.trail.ribbons.map(st=>[S.tail,st])];
 if(crown&&p.id==='copy')rs.push([S.tipL,{w:.12,a:.9,ruled:1}],[S.tipR,{w:.12,a:.9,ruled:1}]);
 trail.ribbons.forEach((r,i)=>{const x=rs[i];if(!x){r.mesh.visible=false;return;}fillRibbon(r,x[0],x[1],x[1].ruled?C('#9fb3ff'):currentDistrict().trail,x[1].ruled?36:len);});
}
const resetTrail=()=>{for(const k in trail.src)trail.src[k].length=0;};

// ── Částice: tvar podle papíru (vločka, vlákno, lístek, hvězda, kapka tříště). Pohybují se se světem a vlastním unášením.
const PN=420,pp={pos:new Float32Array(PN*3),size:new Float32Array(PN),alpha:new Float32Array(PN),col:new Float32Array(PN*3),rot:new Float32Array(PN),shape:new Float32Array(PN),
 vel:new Float32Array(PN*3),age:new Float32Array(PN).fill(9),life:new Float32Array(PN).fill(1),grav:new Float32Array(PN),base:new Float32Array(PN),next:0};
const pgeo=new THREE.BufferGeometry();
for(const [k,a,n] of [['position',pp.pos,3],['aSize',pp.size,1],['aAlpha',pp.alpha,1],['aCol',pp.col,3],['aRot',pp.rot,1],['aShape',pp.shape,1]])pgeo.setAttribute(k,new THREE.BufferAttribute(a,n));
const pmat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{scale:{value:1}},
 vertexShader:`attribute float aSize;attribute float aAlpha;attribute vec3 aCol;attribute float aRot;attribute float aShape;uniform float scale;varying float vA;varying vec3 vC;varying float vR;varying float vS;
void main(){vA=aAlpha;vC=aCol;vR=aRot;vS=aShape;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*scale;}`,
 fragmentShader:`varying float vA;varying vec3 vC;varying float vR;varying float vS;
void main(){vec2 q=gl_PointCoord-.5;float cs=cos(vR),sn=sin(vR);vec2 p=vec2(cs*q.x-sn*q.y,sn*q.x+cs*q.y);float inside=0.,edge=0.;
 if(vS<.5){float d=max(abs(p.x),abs(p.y)*1.4);inside=step(d,.3);edge=step(.22,d);}
 else if(vS<1.5){inside=step(abs(p.y),.07)*step(abs(p.x),.46);}
 else if(vS<2.5){float d=length(p/vec2(.44,.22));inside=step(d,1.);edge=step(.72,d);}
 else if(vS<3.5){float d=abs(p.x)*abs(p.y)*90.+length(p)*1.6;inside=step(d,.8);}
 else{float d=length(p);inside=step(d,.3);edge=step(.2,d)*step(q.y,0.);}
 if(inside<.5||vA<=0.)discard;vec3 c=mix(vC,vec3(.08,.06,.12),edge*.7);gl_FragColor=vec4(c,vA);
#include <colorspace_fragment>
}`});
const points=new THREE.Points(pgeo,pmat);points.frustumCulled=false;points.renderOrder=4;
function spawn(x,y,z,shape,color,size,vx,vy,life,grav=0){const i=pp.next;pp.next=(pp.next+1)%PN;tmpC.set(color);
 pp.pos.set([x,y,z],i*3);pp.vel.set([vx,vy,0],i*3);pp.col.set([tmpC.r,tmpC.g,tmpC.b],i*3);pp.age[i]=0;pp.life[i]=life;pp.base[i]=size;pp.shape[i]=shape;pp.rot[i]=Math.random()*6.3;pp.grav[i]=grav;}
let spawnAcc=0,popT=0;
function updateParticles(pl,dt,v,flying){
 const p=pl.p,P=p.particle,rnd=Math.random;
 if(flying&&!ui.reduced){pl.tail.getWorldPosition(tmp);spawnAcc+=dt*P.rate*(.5+v/120);
  while(spawnAcc>=1){spawnAcc--;spawn(tmp.x+rnd()*.6,tmp.y+(rnd()-.5)*1.2,tmp.z+.5,P.shape,P.colors[Math.floor(rnd()*P.colors.length)],P.size*(.7+rnd()*.6),P.drift[0]*(1+rnd()),P.drift[1]*(.5+rnd()),P.life*(.7+rnd()*.6));}
  if(ui.crown&&p.id==='kraft'&&ui.bgIndex!==2&&rnd()<dt*40)spawn(tmp.x,tmp.y-1.5,tmp.z+.6,4,rnd()<.5?'#e8f6ff':'#9fe3ff',6+rnd()*5,-8-rnd()*6,6+rnd()*8,.8,-28);
  if(ui.crown&&p.id==='foil'){popT+=dt;if(popT>2.4){popT=0;pl.root.getWorldPosition(tmp);for(let k=0;k<16;k++){const a=k/16*6.283;spawn(tmp.x,tmp.y,tmp.z+1,3,FOIL_BANDS[k%4],11,Math.cos(a)*16-v*.2,Math.sin(a)*16,.45);}}}}
 for(let i=0;i<PN;i++){const age=pp.age[i]+=dt,life=pp.life[i];if(age>=life){pp.alpha[i]=0;pp.size[i]=0;continue;}
  const k=1-age/life;pp.vel[i*3+1]+=pp.grav[i]*dt;pp.pos[i*3]+=(pp.vel[i*3]-v*.6)*dt;pp.pos[i*3+1]+=pp.vel[i*3+1]*dt;pp.rot[i]+=dt*3;
  pp.alpha[i]=pp.shape[i]===3?k*(.6+.4*Math.sin(age*40)):k;pp.size[i]=pp.base[i]*(pp.shape[i]===3?.6+k*.6:1);}
 for(const n of ['position','aSize','aAlpha','aCol','aRot','aShape'])pgeo.attributes[n].needsUpdate=true;
}

// ── Pocit z hodu: protažení s pružinou podle papíru, odhoz kamery, u Foil záblesk odlesku. Při omezeném pohybu jen rozjezd rychlosti.
const feel={stretch:{x:1,v:0},kick:0,flash:0,t:9};
function throwPlane(){const f=PAPERS[ui.paper].feel;feel.t=0;resetTrail();if(!ui.reduced){feel.stretch={x:f.stretch,v:0};feel.kick=1.6;feel.flash=f.glint?.75:0;}}

// ── Vykreslení
let W=1,H=1,dpr=1;
function resize(){const r=stage.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);
 renderer.setPixelRatio(dpr);renderer.setSize(W,H,false);lines.width=Math.round(W*dpr);lines.height=Math.round(H*dpr);layoutLabels();}
new ResizeObserver(resize).observe(stage);
const districtOf=i=>ui.bg==='auto'?PAPERS[i].district:+ui.bg;
const currentDistrict=()=>districts[ui.bgIndex??0];
function setLook(pl,D,{flash=0,silhouette=0}={}){const u=pl.mat.uniforms;
 u.lightDir.value.copy(D.lightDir).transformDirection(camera.matrixWorldInverse);u.lightCol.value.copy(D.key);u.rimCol.value.copy(D.rim);
 u.dotSize.value=4*dpr;u.flash.value=flash;u.silhouette.value=silhouette;
 u.shift.value=ui.reduced?0:clock*.05;u.glow.value=pl.p.glow+(ui.crown&&pl.p.id==='washi'?.22:0);pl.glowSprite.visible=ui.crown&&pl.p.id==='washi'&&!silhouette;}
function viewport(x,y,w,h){renderer.setViewport(x,y,w,h);renderer.setScissor(x,y,w,h);camera.aspect=w/h;camera.updateProjectionMatrix();for(const m of outlines)m.uniforms.resolution.value.set(w*dpr,h*dpr);}
function place(D,dist,farK=1){D.near.position.x=-(dist%L)-100;D.far.position.x=-((dist*farK)%L)-100;}
const ownedPaper=()=>paperOf(Math.max(1,ws.level));
let clock=0,dist=0;
function lineupCells(){const narrow=W<560,cols=narrow?2:4,rows=narrow?2:1,w=W/cols,h=H/rows;return PAPERS.map((_,i)=>({x:(i%cols)*w,y:Math.floor(i/cols)*h,w,h}));}
function poseTurn(pl,t,phase=0){applyPose(pl,{x:0,y:0,z:0,angle:-.06,yaw:-.35+(ui.reduced?0:Math.sin(t*.6+phase)*.75),roll:.8+(ui.reduced?0:Math.sin(t*.9+phase)*.1),squash:[1,1]});}
function frame(dt){
 clock+=dt;const set=planes[ui.model];for(const m in planes)for(const pl of planes[m])pl.root.removeFromParent();
 lg.setTransform(1,0,0,1,0,0);lg.clearRect(0,0,lines.width,lines.height);trail.group.visible=points.visible=false;
 if(ui.mode==='lineup'){
  lineupCells().forEach((c,i)=>{const D=districts[districtOf(i)],pl=set[i];if(i)set[i-1].root.removeFromParent();D.scene.add(pl.root);place(D,0);
   const fit=Math.max(8.4/(c.w/c.h),7);camera.position.set(0,1.8,fit/(2*Math.tan(10*Math.PI/180)));camera.lookAt(0,-.4,0);camera.updateMatrixWorld();
   viewport(c.x,H-c.y-c.h,c.w,c.h);poseTurn(pl,clock,i*.8);setLook(pl,D);renderer.render(D.scene,camera);});
  return;
 }
 const i=ui.paper,D=districts[ui.bgIndex=districtOf(i)],pl=set[i];D.scene.add(pl.root);
 if(ui.mode==='closeup'){
  place(D,clock*(ui.reduced?0:3));camera.position.set(0,1.5,34);camera.lookAt(0,-.6,0);camera.updateMatrixWorld();viewport(0,0,W,H);
  const locked=!opened(i);poseTurn(pl,clock);
  if(ui.wipe){const wp=ui.wipe,k=Math.min(1,(clock-wp.t0)/wp.dur),e=1-(1-k)**3,from=set[wp.from];D.scene.add(from.root);poseTurn(from,clock);
   from.mat.uniforms.clipHi.value=1-e;pl.mat.uniforms.clipLo.value=1-e;pl.mat.uniforms.edge.value=k<1?1-e:-1;setLook(from,D);
   if(k>=1){from.root.removeFromParent();from.mat.uniforms.clipHi.value=2;pl.mat.uniforms.clipLo.value=-1;ui.wipe=null;}}
  setLook(pl,D,{silhouette:locked?1:0});renderer.render(D.scene,camera);return;
 }
 // Za letu: vlaštovka stojí vlevo od středu, svět ubíhá rychlostí letu.
 feel.t+=dt;const v=ui.speed*(1-Math.exp(-feel.t*3.2));dist+=v*dt;
 wobble(feel.stretch,1,PAPERS[i].feel.stiffness,PAPERS[i].feel.damping,dt);feel.kick*=Math.exp(-dt*9);feel.flash=Math.max(0,feel.flash-dt*6);
 const sx=ui.reduced?1:feel.stretch.x,bob=ui.reduced?0:Math.sin(clock*1.4)*.9;
 applyPose(pl,{x:0,y:bob,z:0,angle:-.05+(ui.reduced?0:Math.sin(clock*1.1)*.04),yaw:-.22,roll:.42,squash:[sx,1/Math.sqrt(sx)]});pl.root.updateMatrixWorld(true);
 place(D,dist,ui.reduced?0:1);
 const z=ui.game?230:105;camera.position.set(14-feel.kick,4,z);camera.lookAt(14-feel.kick*.5,0,0);camera.updateMatrixWorld();viewport(0,0,W,H);
 D.scene.add(trail.group,points);trail.group.visible=points.visible=true;updateTrail(pl,dt,v,dist);updateParticles(pl,dt,v,true);pmat.uniforms.scale.value=dpr*H/360*(ui.game?.6:1);
 setLook(pl,D,{flash:feel.flash});renderer.render(D.scene,camera);
 drawSpeedLines(PAPERS[i],v);
}
// Rychlostní čáry: počet a poloha z fx-map.speedLines (pod 40 m/s žádné, při omezeném pohybu žádné), kresba podle papíru.
function drawSpeedLines(p,v){
 if(ui.reduced)return;const all=speedLines(v,onTwos(clock),{reduced:ui.reduced}),n=Math.ceil(all.length*p.speed.count),S=p.speed,sx=lines.width/640,sy=lines.height/360,u=sx;
 lg.lineCap='round';
 all.slice(0,n).forEach(([x,y,len],k)=>{const X=x*sx,Y=y*sy,Lp=len*sx;lg.globalCompositeOperation='source-over';lg.setLineDash([]);lg.globalAlpha=.85;
  if(S.style==='ruled'){lg.strokeStyle=k%4?S.color:S.alt;lg.lineWidth=S.width*u;line(X,Y,Lp);}
  else if(S.style==='stitched'){lg.strokeStyle=S.color;lg.lineWidth=(S.width+2)*u;line(X,Y,Lp);lg.setLineDash([10*u,6*u]);lg.strokeStyle=S.alt;lg.lineWidth=S.width*u*.6;line(X,Y,Lp);}
  else if(S.style==='brush'){lg.globalAlpha=.6;lg.fillStyle=k%3?S.color:S.alt;const w=S.width*u;lg.beginPath();lg.moveTo(X,Y);lg.quadraticCurveTo(X+Lp*.6,Y-w,X+Lp,Y);lg.quadraticCurveTo(X+Lp*.6,Y+w*.4,X,Y);lg.fill();}
  else if(S.style==='split'){lg.globalCompositeOperation='lighter';lg.lineWidth=S.width*u;lg.strokeStyle=S.color;line(X,Y-1.5*u,Lp);lg.strokeStyle=S.alt;line(X+3*u,Y+1.5*u,Lp);}
 });lg.globalAlpha=1;lg.globalCompositeOperation='source-over';lg.setLineDash([]);
}
const line=(x,y,l)=>{lg.beginPath();lg.moveTo(x,y);lg.lineTo(x+l,y);lg.stroke();};

// ── Popisky v režimu Vedle sebe (ikona + název: rozlišení bez barvy).
const icon=p=>`<svg aria-hidden="true"><use href="#i-${p.id}"></use></svg>`;
function layoutLabels(){const box=$('labels');box.innerHTML='';if(ui.mode!=='lineup')return;
 lineupCells().forEach((c,i)=>{const p=PAPERS[i],el=document.createElement('div');el.className='cell-label';el.style.left=c.x+8+'px';el.style.top=c.y+8+'px';
  if(i===ui.paper)el.style.borderColor='#ff3c8e';el.innerHTML=`${icon(p)}${p.name} <small>${DISTRICTS[districtOf(i)].name}</small>`;box.appendChild(el);});}
function caption(){const p=PAPERS[ui.paper],c=$('caption');
 if(ui.mode==='lineup')c.textContent='';
 else if(ui.mode==='closeup')c.textContent=!opened(ui.paper)?`Opens at ${PLACES[p.opens]}`:owns(ui.paper)?`${p.name}, level ${Math.min(3,ws.level-p.levels[0]+1)||1} of 3`:`Preview: ${p.name}, not bought yet`;
 else c.textContent=`${p.name} over ${DISTRICTS[districtOf(ui.paper)].name}, ${ui.speed} m/s${ui.crown?`, crown: ${p.crown.name}`:''}`;}

// ── Dílna (herní texty anglicky). Stav dema: nejdál doletěné místo, úroveň papíru 0–12, mince. Čísla zástupná.
const LAST={0:420,2:640,6:1870,10:3090};
const ws={progress:2,level:3,coins:700,last:null,seen:new Set([0,1])};
const opened=i=>PAPERS[i].opens==null||ws.progress>=PAPERS[i].opens;
const owns=i=>i===0||ws.level>=PAPERS[i].levels[0];
function renderTiers(){const ol=$('tiers');ol.innerHTML='';
 PAPERS.forEach((p,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='tier';b.setAttribute('aria-pressed',String(i===ui.paper));
  const have=Math.max(0,Math.min(3,ws.level-p.levels[0]+1)),state=!opened(i)?'locked':have>=3?'owned':have>0?'current':ws.level>=p.levels[0]-1?'open':'queued';b.dataset.state=state;
  const st={locked:`Opens at ${PLACES[p.opens]}`,owned:'All 3 levels',current:`Level ${have} of 3`,open:'Ready to fold',queued:`After ${PAPERS[i-1]?.name}`}[state];
  b.innerHTML=`<span class="sw"></span><span><span class="nm">${state==='locked'?'':icon(p)}${state==='locked'?'Unknown paper':p.name}<span class="pips" aria-label="${have} of 3 levels">${[0,1,2].map(k=>`<i class="${k<have?'on':''}"></i>`).join('')}</span></span><span class="st">${st}</span></span>`;
  b.querySelector('.sw').replaceWith(paintSwatch(p,144,104));b.onclick=()=>select(i,true);li.appendChild(b);ol.appendChild(li);});
 $('coins').textContent=`◈ ${ws.coins.toLocaleString('en-US')}`;renderOffer();}
function renderOffer(){const o=$('offer'),next=ws.level+1;
 if(next>12){o.innerHTML='<h3>Neon Foil 12</h3><p>Every paper folded. The Workshop is yours.</p>';return;}
 const pi=paperOf(next),p=PAPERS[pi];
 if(!opened(pi)){o.innerHTML=`<h3>Next paper</h3><p>A new paper opens at ${PLACES[p.opens]}.</p>`;return;}
 const pv=preview(ws.level,LAST[ws.progress]),price=PRICES[next-1],first=next===p.levels[0],third=next===p.levels[1],can=ws.coins>=price;
 const label=can?(first?`Fold in ${p.name} · ${price.toLocaleString('en-US')} ◈`:`Upgrade to ${p.name} ${next} · ${price.toLocaleString('en-US')} ◈`):`${p.name} ${next} · ${(price-ws.coins).toLocaleString('en-US')} ◈ to go`;
 o.innerHTML=`<h3>${p.name} ${next}</h3><dl><dt>Speed</dt><dd>${pv.now} → <span class="to">${pv.next} m/s</span></dd><dt>Last throw</dt><dd>${LAST[ws.progress]} m → <span class="to">≈ ${pv.after} m</span>${pv.past?`<br><small>past ${pv.past}</small>`:''}</dd><dt>Airtime</dt><dd>same</dd>${third?`<dt>Level 3</dt><dd>${p.crown.name}</dd>`:''}</dl>`+
  `<button type="button" class="btn primary" id="buy" ${can?'':'disabled'}>${label}</button>${ws.last?'<button type="button" class="link" id="undo">Undo last purchase</button>':''}`;
 if(can)$('buy').onclick=()=>buy(next,price,pi,first);if(ws.last)$('undo').onclick=undo;}
function toast(t){$('toast').textContent=t;}
function buy(next,price,pi,first){const before=ownedPaper();ws.last={level:ws.level,coins:ws.coins};ws.coins-=price;ws.level=next;
 if(first&&pi!==before){setMode('closeup');ui.paper=pi;if(!ui.reduced)ui.wipe={from:before,to:pi,t0:clock,dur:.75};toast(`Folded in ${PAPERS[pi].name}.`);}
 else{ui.paper=pi;toast(next===PAPERS[pi].levels[1]?`Upgraded to ${PAPERS[pi].name} ${next}. ${PAPERS[pi].crown.name} added.`:`Upgraded to ${PAPERS[pi].name} ${next}.`);if(next===PAPERS[pi].levels[1]){ui.crown=true;$('crown').checked=true;}}
 renderTiers();caption();}
function undo(){if(!ws.last)return;Object.assign(ws,ws.last,{last:null});ui.paper=ownedPaper();ui.wipe=null;toast('Purchase undone.');renderTiers();caption();}
// Odemčení: po letu, který poprvé doletěl na 3. místo čtvrti, karta ve výsledku (jedna novinka, žádný odpočet ani puntík).
function setProgress(v){ws.progress=v;ws.last=null;const fresh=PAPERS.map((_,i)=>i).filter(i=>opened(i)&&!ws.seen.has(i));fresh.forEach(i=>ws.seen.add(i));
 if(v<2)ws.level=Math.min(ws.level,3);else if(v<6)ws.level=Math.min(ws.level,6);else if(v<10)ws.level=Math.min(ws.level,9);
 renderTiers();if(fresh.length){const i=fresh.at(-1),p=PAPERS[i];$('unlock-title').textContent=p.name;$('unlock-line').textContent=`New in the Workshop. ${p.line}`;$('unlock').hidden=false;setMode('closeup');ui.paper=i;caption();$('unlock-open').focus();}}
function closeUnlock(){$('unlock').hidden=true;}
$('unlock-open').onclick=()=>{closeUnlock();setMode('closeup');const b=$('tiers').children[ui.paper]?.querySelector('button');b?.focus();};
$('unlock-throw').onclick=()=>{closeUnlock();ui.paper=ownedPaper();setMode('flight');throwPlane();renderTiers();};
$('progress').onchange=e=>setProgress(+e.target.value);
$('add-coins').onclick=()=>{ws.coins+=1000;renderTiers();};

// ── Ovládání
function setMode(m){ui.mode=m;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===m)));if(m==='flight')resetTrail();layoutLabels();caption();}
function select(i,fromTier){ui.paper=i;ui.wipe=null;if(fromTier&&ui.mode==='lineup')setMode('closeup');if(ui.mode==='flight')throwPlane();renderTiers();layoutLabels();caption();}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{setMode(b.dataset.mode);if(b.dataset.mode==='flight')throwPlane();});
$('bg').onchange=e=>{ui.bg=e.target.value;layoutLabels();caption();resetTrail();};
$('speed').oninput=e=>{ui.speed=+e.target.value;$('speed-v').textContent=`${ui.speed} m/s (zástupné)`;caption();};$('speed').oninput({target:$('speed')});
$('model').onchange=e=>{ui.model=e.target.value;resetTrail();};
$('crown').onchange=e=>{ui.crown=e.target.checked;caption();};
$('game').onchange=e=>{ui.game=e.target.checked;};
$('gray').onchange=e=>stage.classList.toggle('gray',e.target.checked);
$('reduced').checked=ui.reduced;$('reduced').onchange=e=>{ui.reduced=e.target.checked;};
mq.addEventListener?.('change',e=>{ui.reduced=e.matches;$('reduced').checked=e.matches;});
stage.addEventListener('click',()=>{if(ui.mode==='flight')throwPlane();});
addEventListener('keydown',e=>{if(e.target.closest?.('input,select,textarea'))return;
 if(/^[1-4]$/.test(e.key))select(+e.key-1);
 else if(e.code==='Space'&&!e.target.closest?.('button')){e.preventDefault();if(ui.mode!=='flight')setMode('flight');throwPlane();}});
// ?mode=flight&paper=3&bg=1&crown=1&w=  pro screenshoty
const Q=new URLSearchParams(location.search);
if(Q.has('paper'))ui.paper=+Q.get('paper');if(Q.has('bg')){ui.bg=Q.get('bg');$('bg').value=ui.bg;}if(Q.get('crown')==='1'){ui.crown=true;$('crown').checked=true;}
if(Q.has('speed')){ui.speed=+Q.get('speed');$('speed').value=ui.speed;$('speed').oninput({target:$('speed')});}
renderTiers();setMode(Q.get('mode')??'lineup');if(ui.mode==='flight')throwPlane();resize();

let last=performance.now(),ms=0,n=0;
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;const t0=performance.now();frame(dt);ms+=performance.now()-t0;
 if(++n===60){$('perf').textContent=`CPU ${(ms/n).toFixed(1)} ms/snímek`;ms=0;n=0;}tick(loop);}
// ?timer = smyčka přes setTimeout (běží i ve skrytém okně, pro automatické ověření), jinak requestAnimationFrame.
const tick=Q.has('timer')?f=>setTimeout(()=>f(performance.now()),16):requestAnimationFrame.bind(window);
tick(loop);
window.__papers={ui,ws,frame,setProgress,select,setMode,get clock(){return clock;}};
