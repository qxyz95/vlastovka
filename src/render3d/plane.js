// 3D vlaštovka (planeShape z geometry.js, toon + obrys) a 3D stopa letu. Vlastní R1.
// createPlane(ctx) → {group,apply(planePlan,{t,flying}),setModel(model),dispose()}; ctx = {ramp,planeHull,palette,scale}.
// makePlane(model,…) → skupiny root → pitch → yaw → roll; applyPose(p,pose) zapíše plan.plane (úhel z juice.flightAngle jako ve 2D).
import * as THREE from 'three';
import {planeShape} from './geometry.js';

export const PLANE_SCALE=6.5,TRAIL={points:56,step:.6,width:.45};
export function makePlane(model,{ramp,planeHull,palette,scale=PLANE_SCALE}){
 const s=planeShape(model),geo=new THREE.BufferGeometry(),P=palette.plane;
 geo.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));geo.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
 const mesh=new THREE.Mesh(geo,new THREE.MeshToonMaterial({color:P.fill,gradientMap:ramp,side:THREE.DoubleSide}));mesh.castShadow=true;mesh.renderOrder=2;
 const hull=new THREE.Mesh(geo,planeHull);hull.renderOrder=1;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
 const crease=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:P.crease[model==='glider'?1:0]}));crease.renderOrder=3;
 const root=new THREE.Group(),pitch=new THREE.Group(),yaw=new THREE.Group(),roll=new THREE.Group();
 roll.add(mesh,hull,crease);yaw.add(roll);pitch.add(yaw);root.add(pitch);root.scale.setScalar(scale);
 return {model,root,pitch,yaw,roll,dispose(){geo.dispose();lg.dispose();mesh.material.dispose();crease.material.dispose();}};
}
// Póza: pitch = −angle (2D rotate kladně = nos dolů), roll náklon křídel k divákovi, squash [podél nosu, napříč].
export function applyPose(p,o){
 p.root.visible=o.visible!==false;p.root.position.set(o.x,o.y,o.z??0);p.pitch.rotation.z=-o.angle;p.yaw.rotation.y=o.yaw??-.2;p.roll.rotation.x=o.roll??.42;
 const [sx,sy]=o.squash??[1,1];p.yaw.scale.set(sx,sy,sy);
}
// Stopa: pásek za vlaštovkou ve světových m, průhlednost klesá ke konci; po dopadu se zkracuje jako stopa v juice.js.
function makeTrail(color){
 const N=TRAIL.points,pos=new Float32Array(N*2*3),col=new Float32Array(N*2*4),idx=[],c=new THREE.Color(color);
 for(let i=0;i<N-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,4));geo.setIndex(idx);
 const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));mesh.frustumCulled=false;mesh.renderOrder=1;
 const pts=[];
 function update(x,y,flying){
  const last=pts.at(-1);if(flying){if(!last||Math.hypot(x-last[0],y-last[1])>TRAIL.step){pts.push([x,y]);if(pts.length>N)pts.shift();}}else if(pts.length)pts.shift();
  const n=pts.length;mesh.visible=n>1;if(n<2)return;
  for(let i=0;i<N;i++){const p=pts[Math.min(i,n-1)],k=i<n?i/(n-1):1,w=TRAIL.width*(.3+.7*k),a=i<n?.75*k*k:0;
   pos.set([p[0],p[1]-w,-.4,p[0],p[1]+w,-.4],i*6);col.set([c.r,c.g,c.b,a,c.r,c.g,c.b,a],i*8);}
  geo.attributes.position.needsUpdate=geo.attributes.color.needsUpdate=true;
 }
 return {mesh,update,reset(){pts.length=0;mesh.visible=false;},setColor(h){c.set(h);},dispose(){geo.dispose();mesh.material.dispose();}};
}
export function createPlane(ctx){
 const group=new THREE.Group(),trail=makeTrail(ctx.palette.trail[0]);group.add(trail.mesh);let p=null,lastX=null;
 const setModel=model=>{if(p?.model===model)return;if(p){p.root.removeFromParent();p.dispose();}p=makePlane(model,ctx);group.add(p.root);};
 setModel('dart');
 function apply(o,{flying=false,trailColor}={}){
  setModel(o.model??'dart');applyPose(p,o);
  if(lastX!=null&&o.x<lastX-1)trail.reset();lastX=o.x;// nový hod: vlaštovka skočila zpět
  if(trailColor)trail.setColor(trailColor);trail.update(o.x-.45*PLANE_SCALE*Math.cos(o.angle),o.y+.45*PLANE_SCALE*Math.sin(o.angle),flying);
 }
 return {group,apply,setModel,dispose(){p?.dispose();trail.dispose();}};
}
