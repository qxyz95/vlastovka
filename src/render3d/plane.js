// 3D vlaštovka (planeShape z geometry.js) a 3D stopa letu. Vlastní R1.
// createPlane(ctx) → {group,apply(planePlan,{t,flying}),setModel(model),trail,dispose()}; ctx = {planeHull,palette,scale,shadows}.
// Papír (P3): výplň MeshBasic s barvou vrcholů (nahoru papír, jinak plane.under), bez světla a mlhy; obrys razítkem (planeHull ze scény,
// grafit 2,6 px); měřítko × plan.plane.scale, stopa úměrně; stín na zem shadows.castPlane(geometrie) jako dítě meshe (S4, 08-stiny.md);
// stopa grafitová čárkovaná (paper-cards.PAPER_TRAIL), bez lemu.
// makePlane(model,…) → skupiny root → pitch → yaw → roll; applyPose(p,pose) zapíše plan.plane (úhel z juice.flightAngle jako ve 2D).
import * as THREE from 'three';
import {planeShape,outlineStamp} from './geometry.js';
import {PAPER_TRAIL} from './paper-cards.js';

// Stopa: points = vzorků, step = m mezi vzorky (tvar čárky PAPER_TRAIL).
export const PLANE_SCALE=7.75,TRAIL={points:56,step:.6};
// Barvy vrcholů papírové vlaštovky (lineární RGB): plochy s normálou nahoru (ny > 0,3) papír, kýl a spodní strany under (bible 05 kap. 2.2).
export function planeColors(normals,{fill,under}){const n=normals.length/3,out=new Float32Array(n*3),a=new THREE.Color(fill),b=new THREE.Color(under??fill);
 for(let i=0;i<n;i++)(normals[i*3+1]>.3?a:b).toArray(out,i*3);return out;}
export function makePlane(model,ctx){
 const {planeHull,palette,scale=PLANE_SCALE,shadows}=ctx,s=planeShape(model),geo=new THREE.BufferGeometry(),P=palette.plane;
 geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));geo.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
 geo.setAttribute('color',new THREE.BufferAttribute(planeColors(s.normals,P),3));
 const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:false}));mesh.renderOrder=2;
 // S4: vrhač do masky stínů (vrstva MASK_LAYER), dědí matrixWorld meshe a skryje se s ním; geometrie i materiál sdílené (nedisponovat zvlášť).
 const shadow=shadows?shadows.castPlane(geo):null;if(shadow)mesh.add(shadow);
 // Obrys razítkem (geometry.outlineStamp + toon.stampOutlineMaterial), renderOrder 2 = až po stopě (transparentní, renderOrder 1).
 const st=outlineStamp(s.positions),hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(st.positions,3));hg.setAttribute('shift',new THREE.Float32BufferAttribute(st.shift,2));
 const hull=new THREE.Mesh(hg,planeHull);hull.renderOrder=2;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 const crease=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:P.crease[model==='glider'?1:0]}));crease.renderOrder=3;
 const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group();
 roll.add(mesh,hull,crease);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(scale);
 return {model,root,pitch,yaw,roll,mesh,hull,shadow,dispose(){shadow?.removeFromParent();geo.dispose();hg.dispose();lg.dispose();mesh.material.dispose();crease.material.dispose();}};
}
// Póza: pitch = −angle (2D rotate kladně = nos dolů), roll náklon křídel k divákovi, squash [podél nosu, napříč].
export function applyPose(p,o){
 p.root.visible=o.visible!==false;p.root.position.set(o.x,o.y,o.z??0);p.pitch.rotation.z=-o.angle;p.yaw.rotation.y=o.yaw??-.2;p.roll.rotation.x=o.roll??.42;
 const [sx,sy]=o.squash??[1,1];p.yaw.scale.set(sx,sy,sy);
}
// Papírová stopa (bible 05 kap. 3, spec 06): grafitová tužka bez lemu, čárka PAPER_TRAIL.dash z periody period (m po dráze letu, čárky stojí ve světě),
// poloviční šířka max(half m, minPx CSS px), průhlednost alpha·√k ke konci.
const PAPER_TRAIL_VS=`attribute vec3 dir;attribute float side,halfW,alpha,dist;uniform vec2 res;uniform float dpr,minPx;varying float vA,vD;
void main(){vec4 c=projectionMatrix*modelViewMatrix*vec4(position,1.),c2=projectionMatrix*modelViewMatrix*vec4(position+dir,1.);
vec2 h=res*.5,d=c2.xy/c2.w*h-c.xy/c.w*h;d=dot(d,d)>1e-8?normalize(d):vec2(1.,0.);
float hw=max(halfW*projectionMatrix[1][1]*h.y/c.w,minPx*dpr);c.xy+=vec2(-d.y,d.x)*side*hw/h*c.w;vA=alpha;vD=dist;gl_Position=c;}`;
const PAPER_TRAIL_FS=`uniform vec3 core;uniform float dash,period;varying float vA,vD;
void main(){if(fract(vD/period)*period>dash||vA<.01)discard;gl_FragColor=vec4(core,vA);
#include <colorspace_fragment>
}`;
// Stopa: pás za vlaštovkou ve světových m (čárkovaná tužka, výše); průhlednost klesá ke konci, po dopadu se zkracuje jako stopa v juice.js.
// Pevná pole, za snímek se nic nealokuje.
const TRAIL_ATTRS=['position','dir','halfW','alpha','dist'];
function makeTrail(color){
 const N=TRAIL.points,pos=new Float32Array(N*6),dir=new Float32Array(N*6),side=new Float32Array(N*2),halfW=new Float32Array(N*2),alpha=new Float32Array(N*2),dist=new Float32Array(N*2),idx=[];
 for(let i=0;i<N;i++){side[i*2]=-1;side[i*2+1]=1;if(i<N-1){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const geo=new THREE.BufferGeometry(),attr=(n,a,s)=>geo.setAttribute(n,new THREE.BufferAttribute(a,s));
 attr('position',pos,3);attr('dir',dir,3);attr('side',side,1);attr('halfW',halfW,1);attr('alpha',alpha,1);attr('dist',dist,1);geo.setIndex(idx);
 const u={res:{value:new THREE.Vector2(1,1)},dpr:{value:1},core:{value:new THREE.Color(color)},minPx:{value:PAPER_TRAIL.minPx},dash:{value:PAPER_TRAIL.dash},period:{value:PAPER_TRAIL.period}};
 const mesh=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:u,vertexShader:PAPER_TRAIL_VS,fragmentShader:PAPER_TRAIL_FS,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
 mesh.frustumCulled=false;mesh.renderOrder=1;mesh.visible=false;
 mesh.onBeforeRender=r=>{r.getDrawingBufferSize(u.res.value);u.dpr.value=r.getPixelRatio();};
 const pts=[];let od=0;// od = ujetá dráha stopy (m), poloha čárek
 function update(x,y,flying,ws=1){// ws = šířka stopy úměrně velikosti vlaštovky
  const last=pts.at(-1);if(flying){const l=last?Math.hypot(x-last[0],y-last[1]):0;if(!last||l>TRAIL.step){od+=l;pts.push([x,y,od]);if(pts.length>N)pts.shift();}}else if(pts.length)pts.shift();
  const n=pts.length;mesh.visible=n>1;if(n<2)return;
  for(let i=0;i<N;i++){const j=Math.min(i,n-1),p=pts[j],a=pts[Math.max(0,j-1)],b=pts[Math.min(n-1,j+1)],k=i<n?i/(n-1):1,o=i*6;
   pos[o]=pos[o+3]=p[0];pos[o+1]=pos[o+4]=p[1];pos[o+2]=pos[o+5]=-.4;dir[o]=dir[o+3]=b[0]-a[0];dir[o+1]=dir[o+4]=b[1]-a[1];dir[o+2]=dir[o+5]=0;
   halfW[i*2]=halfW[i*2+1]=PAPER_TRAIL.half*ws;alpha[i*2]=alpha[i*2+1]=i<n?PAPER_TRAIL.alpha*Math.sqrt(k):0;dist[i*2]=dist[i*2+1]=p[2];}
  for(const name of TRAIL_ATTRS)geo.attributes[name].needsUpdate=true;
 }
 return {mesh,uniforms:u,points:pts,update,reset(){pts.length=0;od=0;mesh.visible=false;},setColor(h){u.core.value.set(h);},dispose(){geo.dispose();mesh.material.dispose();}};
}
export function createPlane(ctx){
 const group=new THREE.Group(),trail=makeTrail(ctx.palette.trail[0]),base=ctx.scale??PLANE_SCALE;group.add(trail.mesh);let p=null,lastX=null;
 const setModel=model=>{if(p?.model===model)return;if(p){p.root.removeFromParent();p.dispose();}p=makePlane(model,ctx);group.add(p.root);};
 setModel('dart');
 function apply(o,{flying=false,trailColor}={}){
  setModel(o.model??'dart');applyPose(p,o);const k=o.scale??1,scale=base*k;p.root.scale.setScalar(scale);// plan.plane.scale: délka podle záběru (frame.planeLength) × +15 % papíru na úzké scéně
  if(lastX!=null&&o.x<lastX-1)trail.reset();lastX=o.x;// nový hod: vlaštovka skočila zpět
  if(trailColor)trail.setColor(trailColor);trail.update(o.x-.45*scale*Math.cos(o.angle),o.y+.45*scale*Math.sin(o.angle),flying,k);
 }
 return {group,apply,setModel,trail,get current(){return p;},dispose(){p?.dispose();trail.dispose();}};
}
