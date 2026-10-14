// 3D vlaštovka (planeShape z geometry.js, toon + obrys) a 3D stopa letu. Vlastní R1.
// createPlane(ctx) → {group,apply(planePlan,{t,flying}),setModel(model),trail,dispose()}; ctx = {ramp,planeHull,palette,scale,style,shadows}.
// Papír (P3, style nebo palette.id 'papir'): výplň MeshBasic s barvou vrcholů (nahoru papír, jinak plane.under), bez světla a mlhy; obrys razítkem
// (planeHull ze scény, grafit 2,6 px); měřítko (oba styly) × plan.plane.scale, stopa úměrně; stín na zem shadows.castPlane(geometrie) jako dítě meshe (S4, 08-stiny.md);
// stopa grafitová čárkovaná (paper-cards.PAPER_TRAIL), bez lemu.
// makePlane(model,…) → skupiny root → pitch → yaw → roll; applyPose(p,pose) zapíše plan.plane (úhel z juice.flightAngle jako ve 2D).
import * as THREE from 'three';
import {planeShape,outlineStamp} from './geometry.js';
import {PAPER_TRAIL} from './paper-cards.js';

// Stopa: width = poloviční šířka v m u vlaštovky; minHalf a edge v CSS px (bible kap. 5.2: celá šířka ≥ 2 CSS px, lem ≥ 1 CSS px), edgeFrac = lem jako podíl poloviční šířky.
export const PLANE_SCALE=7.75,TRAIL={points:56,step:.6,width:.45,minHalf:2,edge:1,edgeFrac:.25},PAPER_REF=.5;
// Papír (bible kap. 4, 5.1): světlo čtvrti tónuje a stínuje výplň nejvýš o t (palette.plane.maxTint), lineárně, takže svítivost je vždy ≥ 1 − t.
// lit = osvětlená barva toon materiálu (lineární RGB); odstín zůstane, jas se vztáhne k PAPER_REF. Dvojče GLSL je PAPER_GLSL.
export function paperShade(lit,t=.2){const m=Math.max(...lit);return lit.map(v=>1-t*(1-(m>1e-4?v/m*Math.min(1,m/PAPER_REF):0)));}
const PAPER_GLSL=`{float pm=max(max(outgoingLight.r,outgoingLight.g),outgoingLight.b);
vec3 pq=pm>1e-4?outgoingLight/pm*clamp(pm/${PAPER_REF.toFixed(3)},0.,1.):vec3(0.);outgoingLight=1.-paperTint*(1.-pq);}
#include <opaque_fragment>`;
// Bez mlhy: vlaštovka je hrdina (kap. 5.1), mlha by ji v Docks tónovala nad 20 %.
export function paperMaterial(color,ramp,tint=.2){
 const m=new THREE.MeshToonMaterial({color,gradientMap:ramp,side:THREE.DoubleSide,fog:false}),u={value:tint};m.userData.paperTint=u;
 m.onBeforeCompile=s=>{s.uniforms.paperTint=u;s.fragmentShader='uniform float paperTint;\n'+s.fragmentShader.replace('#include <opaque_fragment>',PAPER_GLSL);};
 m.customProgramCacheKey=()=>'paper';return m;
}
export const isPaper=ctx=>(ctx?.style??ctx?.palette?.id)==='papir';
// Barvy vrcholů papírové vlaštovky (lineární RGB): plochy s normálou nahoru (ny > 0,3) papír, kýl a spodní strany under (bible 05 kap. 2.2).
export function planeColors(normals,{fill,under}){const n=normals.length/3,out=new Float32Array(n*3),a=new THREE.Color(fill),b=new THREE.Color(under??fill);
 for(let i=0;i<n;i++)(normals[i*3+1]>.3?a:b).toArray(out,i*3);return out;}
export function makePlane(model,ctx){
 const {ramp,planeHull,palette,scale=PLANE_SCALE,shadows}=ctx,paper=isPaper(ctx),s=planeShape(model),geo=new THREE.BufferGeometry(),P=palette.plane;
 geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));geo.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
 if(paper)geo.setAttribute('color',new THREE.BufferAttribute(planeColors(s.normals,P),3));
 const mesh=new THREE.Mesh(geo,paper?new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:false}):paperMaterial(P.fill,ramp,P.maxTint??.2));mesh.castShadow=!paper;mesh.renderOrder=2;
 // S4: vrhač do masky stínů (vrstva MASK_LAYER), dědí matrixWorld meshe a skryje se s ním; geometrie i materiál sdílené (nedisponovat zvlášť).
 const shadow=paper&&shadows?shadows.castPlane(geo):null;if(shadow)mesh.add(shadow);
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
// Profil stopy v px plátna: proj = poloviční šířka promítnutá z m; half, edge (lem na každém okraji) a core (celá šířka jádra). Dvojče GLSL v TRAIL_VS/FS.
export function trailProfile(proj,dpr=1){const half=Math.max(proj,TRAIL.minHalf*dpr),edge=Math.min(half,Math.max(TRAIL.edge*dpr,TRAIL.edgeFrac*half));return {half,edge,core:2*(half-edge)};}
const TRAIL_VS=`attribute vec3 dir;attribute float side,halfW,alpha;uniform vec2 res;uniform float dpr;varying float vSide,vHalf,vA;
void main(){vec4 c=projectionMatrix*modelViewMatrix*vec4(position,1.),c2=projectionMatrix*modelViewMatrix*vec4(position+dir,1.);
vec2 h=res*.5,d=c2.xy/c2.w*h-c.xy/c.w*h;d=dot(d,d)>1e-8?normalize(d):vec2(1.,0.);
float hw=max(halfW*projectionMatrix[1][1]*h.y/c.w,${TRAIL.minHalf.toFixed(1)}*dpr);c.xy+=vec2(-d.y,d.x)*side*hw/h*c.w;
vSide=side;vHalf=hw;vA=alpha;gl_Position=c;}`;
const TRAIL_FS=`uniform vec3 core,edge;uniform float dpr;varying float vSide,vHalf,vA;
void main(){float e=min(vHalf,max(${TRAIL.edge.toFixed(1)}*dpr,${TRAIL.edgeFrac.toFixed(3)}*vHalf));gl_FragColor=vec4(abs(vSide)*vHalf>vHalf-e?edge:core,vA);
#include <colorspace_fragment>
}`;
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
// Stopa: pás za vlaštovkou ve světových m s tušovým lemem na obou okrajích (bible kap. 5.2), šířka v px plátna aspoň minHalf;
// průhlednost klesá ke konci; po dopadu se zkracuje jako stopa v juice.js. Pevná pole, za snímek se nic nealokuje. paper = čárkovaná tužka (výše).
const TRAIL_ATTRS=['position','dir','halfW','alpha'],TRAIL_ATTRS_PAPER=[...TRAIL_ATTRS,'dist'];
function makeTrail(color,edgeColor,paper=false){
 const N=TRAIL.points,pos=new Float32Array(N*6),dir=new Float32Array(N*6),side=new Float32Array(N*2),halfW=new Float32Array(N*2),alpha=new Float32Array(N*2),dist=new Float32Array(N*2),idx=[];
 for(let i=0;i<N;i++){side[i*2]=-1;side[i*2+1]=1;if(i<N-1){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const geo=new THREE.BufferGeometry(),attr=(n,a,s)=>geo.setAttribute(n,new THREE.BufferAttribute(a,s));
 attr('position',pos,3);attr('dir',dir,3);attr('side',side,1);attr('halfW',halfW,1);attr('alpha',alpha,1);if(paper)attr('dist',dist,1);geo.setIndex(idx);
 const u={res:{value:new THREE.Vector2(1,1)},dpr:{value:1},core:{value:new THREE.Color(color)},edge:{value:new THREE.Color(edgeColor)},
  ...(paper?{minPx:{value:PAPER_TRAIL.minPx},dash:{value:PAPER_TRAIL.dash},period:{value:PAPER_TRAIL.period}}:{})};
 const mesh=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:u,vertexShader:paper?PAPER_TRAIL_VS:TRAIL_VS,fragmentShader:paper?PAPER_TRAIL_FS:TRAIL_FS,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
 mesh.frustumCulled=false;mesh.renderOrder=1;mesh.visible=false;
 mesh.onBeforeRender=r=>{r.getDrawingBufferSize(u.res.value);u.dpr.value=r.getPixelRatio();};
 const pts=[];let od=0;// od = ujetá dráha stopy (m), u papíru poloha čárek
 function update(x,y,flying,ws=1){// ws = šířka stopy úměrně velikosti vlaštovky
  const last=pts.at(-1);if(flying){const l=last?Math.hypot(x-last[0],y-last[1]):0;if(!last||l>TRAIL.step){od+=l;pts.push([x,y,od]);if(pts.length>N)pts.shift();}}else if(pts.length)pts.shift();
  const n=pts.length;mesh.visible=n>1;if(n<2)return;
  for(let i=0;i<N;i++){const j=Math.min(i,n-1),p=pts[j],a=pts[Math.max(0,j-1)],b=pts[Math.min(n-1,j+1)],k=i<n?i/(n-1):1,w=TRAIL.width*ws*(.3+.7*k),o=i*6;
   pos[o]=pos[o+3]=p[0];pos[o+1]=pos[o+4]=p[1];pos[o+2]=pos[o+5]=-.4;dir[o]=dir[o+3]=b[0]-a[0];dir[o+1]=dir[o+4]=b[1]-a[1];dir[o+2]=dir[o+5]=0;
   halfW[i*2]=halfW[i*2+1]=paper?PAPER_TRAIL.half*ws:w;alpha[i*2]=alpha[i*2+1]=i<n?paper?PAPER_TRAIL.alpha*Math.sqrt(k):k*k:0;dist[i*2]=dist[i*2+1]=p[2];}
  for(const name of paper?TRAIL_ATTRS_PAPER:TRAIL_ATTRS)geo.attributes[name].needsUpdate=true;
 }
 return {mesh,uniforms:u,points:pts,paper,update,reset(){pts.length=0;od=0;mesh.visible=false;},setColor(h){u.core.value.set(h);},dispose(){geo.dispose();mesh.material.dispose();}};
}
export function createPlane(ctx){
 const paper=isPaper(ctx),group=new THREE.Group(),trail=makeTrail(ctx.palette.trail[0],ctx.palette.trailEdge,paper),base=ctx.scale??PLANE_SCALE;group.add(trail.mesh);let p=null,lastX=null;
 const setModel=model=>{if(p?.model===model)return;if(p){p.root.removeFromParent();p.dispose();}p=makePlane(model,ctx);group.add(p.root);};
 setModel('dart');
 function apply(o,{flying=false,trailColor}={}){
  setModel(o.model??'dart');applyPose(p,o);const k=o.scale??1,scale=base*k;p.root.scale.setScalar(scale);// plan.plane.scale: délka podle záběru (frame.planeLength) × +15 % papíru na úzké scéně
  if(lastX!=null&&o.x<lastX-1)trail.reset();lastX=o.x;// nový hod: vlaštovka skočila zpět
  if(trailColor)trail.setColor(trailColor);trail.update(o.x-.45*scale*Math.cos(o.angle),o.y+.45*scale*Math.sin(o.angle),flying,k);
 }
 return {group,apply,setModel,trail,paper,get current(){return p;},dispose(){p?.dispose();trail.dispose();}};
}
