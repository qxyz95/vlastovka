// Dílna PAPER LAB ve 3D (three.js): budova a cedule z cityChunk(0) (shop:true), přístavek se střechou, okna, dveře a dítě s vlaštovkou v ruce.
// Vlastní R3. createWorkshop(scene,ctx) → THREE.Group (lokální souřadnice místa 0, přidá se do scene) s metodami
//   update(kidPose,planePose)  pózy z pose.js; planePose = null skryje vlaštovku v ruce (po hodu letí vlaštovka z plane.js)
//   dispose()                   uvolní vlastní geometrie a materiály (sdílené z ctx ne)
// ctx = {ramp, hull, model, planeScale}: rampa a obrys ze scene.js (jinak vlastní z toon.js). group.userData.outlines = vlastní obrysové
// materiály, kterým scéna při resize nastaví uniforms.resolution (a mlhu). Dítě je v měřítku S m na 1 px 2D postavičky a stojí na střeše
// přístavku tak, aby vlaštovka v ruce byla v HAND (pose.js); klidová kamera restCamera() ji promítne na (148, 258).
import * as THREE from 'three';
import {mergeBlocks,planeShape,cityChunk} from './geometry.js';
import {toonRamp,outlineMaterial,signTexture} from './toon.js';
import {HAND,kidPose,planePose} from './pose.js';
import {CYBER,INK} from './palette.js';
export const S=.25;// m na 1 px 2D dítěte (2D: dítě 41 px, vlaštovka 31 px)
// Dítě ve 2D: levý okraj kx, vlaštovka 24 px vpravo a 35 px nad chodidly; rameno (14, 28).
export const KID={x:HAND.x-24*S,y:HAND.y-35*S,z:HAND.z,shoulder:[14*S,28*S]};
const C=h=>new THREE.Color(h);
const PAL=CYBER.workshop;
// Obrysy (bible kap. 3): budova 2,5, dítě a drobnosti 1,7, vlaštovka v ruce 2,6 (nejsilnější), vše tuš INK.
export const OUTLINE={hull:2.5,thin:1.7,plane:2.6};
function bufferOf(m){const g=new THREE.BufferGeometry();for(const [k,n] of [['position',3],['normal',3],['uv',2],['color',3],['outline',3]])g.setAttribute(k,new THREE.BufferAttribute(m[k],n));g.computeBoundingSphere();return g;}
const boxes=list=>bufferOf(mergeBlocks(list,b=>C(b.color).toArray()));
// Kvádr dítěte v px 2D postavičky: x0,y0 (od chodidel), w,h, hloubka d (střed z=0).
const px=(x,y,w,h,d,color)=>({type:'box',x:x*S,w:w*S,y:y*S,h:h*S,z:0,d:d*S,color});

export function createWorkshop(scene,ctx={}){
 const group=new THREE.Group(),own=[],outlines=[],ramp=ctx.ramp??toonRamp(),fog=scene?.fog;
 const mk=(o,m)=>(own.push(o),m===undefined?o:m);
 const hull=ctx.hull??mk(outlineMaterial({fog,color:INK,thickness:OUTLINE.hull})),thin=mk(outlineMaterial({fog,color:INK,thickness:OUTLINE.thin}));outlines.push(thin);if(!ctx.hull)outlines.push(hull);
 const toon=mk(new THREE.MeshToonMaterial({vertexColors:true,gradientMap:ramp}));
 const glow=mk(new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}));
 const solid=(list,line=hull,parent=group)=>{const g=mk(boxes(list)),m=new THREE.Mesh(g,toon),o=new THREE.Mesh(g,line);m.castShadow=m.receiveShadow=true;parent.add(m,o);return m;};
 // Budova a cedule z cityChunk(0); přístavek pod dítětem sahá od budovy až za ruku.
 const c0=cityChunk(0),b=c0.blocks.find(x=>x.shop),sg=c0.signs.find(x=>x.shop),front=b.z+b.d/2,top=KID.y,ax=b.x+b.w,aw=HAND.x+7-ax,az=HAND.z-3.5,ad=11,af=az+ad/2;
 solid([{...b,type:'box',color:PAL.wall},{type:'box',x:b.x-.5,w:b.w+1,y:b.h,h:.7,z:b.z,d:b.d+1,color:PAL.roof},
  {type:'box',x:ax,w:aw,y:0,h:top-.5,z:az,d:ad,color:PAL.annex},{type:'box',x:ax-.3,w:aw+.6,y:top-.5,h:.5,z:az,d:ad+.6,color:PAL.roof},
  // dveře a rámy oken (budova: okno pod cedulí, přístavek: výloha a dveře)
  {type:'box',x:b.x+b.w-6.5,w:4.2,y:0,h:5.6,z:front+.15,d:.3,color:PAL.door},{type:'box',x:b.x+2.6,w:11.8,y:1.6,h:5,z:front+.1,d:.2,color:PAL.frame},
  {type:'box',x:ax+3,w:12,y:1.4,h:4.4,z:af+.1,d:.2,color:PAL.frame},{type:'box',x:ax+aw-7,w:4.2,y:0,h:5.2,z:af+.15,d:.3,color:PAL.door},
  // zábradlí střechy přístavku před dítětem a vzadu
  ...[0,1,2,3,4].map(i=>({type:'box',x:ax+1+i*(aw-2.4)/4,w:.4,y:top,h:1.3,z:af-.3,d:.4,color:PAL.rail})),{type:'box',x:ax+1,w:aw-2,y:top+1.3,h:.35,z:af-.3,d:.5,color:PAL.rail},
  {type:'box',x:ax+1,w:aw-2,y:top+1.3,h:.35,z:az-ad/2+.3,d:.5,color:PAL.rail}]);
 // Okna svítí (dýchající světlo); barva materiálu se násobí kidPose.glow.
 const lit=new THREE.Mesh(mk(boxes([{type:'box',x:b.x+3,w:11,y:2,h:4.2,z:front+.25,d:.1,color:PAL.window},{type:'box',x:b.x+3.6,w:9.8,y:5,h:.6,z:front+.32,d:.05,color:PAL.light},
  {type:'box',x:b.x+5,w:1.8,y:2.6,h:1.8,z:front+.32,d:.05,color:PAL.light},{type:'box',x:ax+3.4,w:11.2,y:1.8,h:3.6,z:af+.25,d:.1,color:PAL.warm}])),glow);group.add(lit);
 // Neonová cedule PAPER LAB: občas blikne (kidPose.flicker, šum jako ve 2D).
 const signMat=mk(new THREE.MeshBasicMaterial({map:signTexture(sg.text,sg.color,!!sg.vertical),toneMapped:false})),sign=new THREE.Mesh(mk(new THREE.PlaneGeometry(1,1)),signMat);
 sign.scale.set(sg.w,sg.h,1);sign.position.set(sg.x+sg.w/2,sg.y+sg.h/2,Math.max(sg.z,front+.35));group.add(sign);
 // Dítě: kid (couvne) → body (záklon kolem chodidel) → upper (dýchání) → head, arm (pivot v rameni).
 const kid=new THREE.Group(),body=new THREE.Group(),upper=new THREE.Group(),head=new THREE.Group(),arm=new THREE.Group();
 kid.position.set(KID.x,KID.y,KID.z);kid.add(body);body.add(upper);upper.add(head,arm);group.add(kid);
 body.position.x=8*S;// osa záklonu uprostřed chodidel
 const at=(list,dx)=>list.map(p=>({...p,x:p.x-dx}));
 solid(at([px(1,0,5,10,5,PAL.legs),px(11,0,5,10,5,PAL.legs)],8*S),thin,body);
 solid(at([px(0,10,16,20,9,PAL.shirt)],8*S),thin,upper);
 solid(at([px(3,30,10,11,9,PAL.skin),px(6,34,9,3,9.6,PAL.visor),px(2,39,12,3,10,PAL.legs)],8*S),thin,head);
 arm.position.set(KID.shoulder[0]-8*S,KID.shoulder[1],6.5*S);// ruka před trupem (ke kameře)
 solid([px(0,-2,15,4,4,PAL.shirt),px(14,-3,5,6,5,PAL.skin)],thin,arm);
 // Vlaštovka v ruce: planeShape (toon, obrys zvětšenou kopií, přehyby), skupiny root (poloha) → tilt (rotace z) → squash → roll.
 const planeHull=mk(outlineMaterial({side:THREE.DoubleSide,color:INK,thickness:OUTLINE.plane}));planeHull.depthWrite=false;outlines.push(planeHull);
 const planeMat=mk(new THREE.MeshToonMaterial({color:PAL.plane,gradientMap:ramp,side:THREE.DoubleSide})),creaseMat=mk(new THREE.LineBasicMaterial({color:PAL.crease}));
 const shapes={},shapeOf=model=>shapes[model]??=(s=>{const g=mk(new THREE.BufferGeometry()),l=mk(new THREE.BufferGeometry());
  g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));g.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
  l.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));return {g,l};})(planeShape(model));
 const plane=new THREE.Group(),tilt=new THREE.Group(),squash=new THREE.Group(),roll=new THREE.Group(),pm=new THREE.Mesh(undefined,planeMat),ph=new THREE.Mesh(undefined,planeHull),pc=new THREE.LineSegments(undefined,creaseMat);
 pm.castShadow=true;pm.renderOrder=2;ph.renderOrder=1;pc.renderOrder=3;roll.add(pm,ph,pc);squash.add(roll);tilt.add(squash);plane.add(tilt);group.add(plane);
 roll.rotation.x=.42;roll.rotation.y=-.2;// křídla natočená ke kameře jako v prototypu
 let model=null;const setModel=m=>{if(m===model)return;model=m;const s=shapeOf(m);pm.geometry=ph.geometry=s.g;pc.geometry=s.l;};setModel(ctx.model??'dart');
 const scale=ctx.planeScale??31*S;
 const v=new THREE.Vector3();
 group.update=(k,p)=>{
  if(k){kid.position.x=KID.x-k.back;body.rotation.z=k.lean;upper.position.y=k.bob;
   lit.material.color.setScalar(k.glow);signMat.color.setScalar(k.flicker?.35:1);}
  plane.visible=!!p;
  if(p){if(p.model)setModel(p.model);plane.position.set(HAND.x+p.dx,HAND.y+p.dy,HAND.z);tilt.rotation.z=p.angle;squash.scale.set(p.squash[0]*scale,p.squash[1]*scale,scale);}
  // Ruka: mávání (kidPose.arm) nebo míří k vlaštovce a natáhne se k ní.
  if(k?.arm!=null){arm.rotation.z=k.arm;arm.scale.x=1;}
  else{arm.updateWorldMatrix(true,false);v.setFromMatrixPosition(arm.matrixWorld);group.worldToLocal(v);const tx=plane.position.x-v.x,ty=plane.position.y-v.y;
   arm.rotation.z=Math.atan2(ty,tx)-body.rotation.z;arm.scale.x=Math.max(.6,Math.min(1.4,Math.hypot(tx,ty)/(16*S)));}
 };
 group.dispose=()=>{for(const o of own)o.dispose?.();group.removeFromParent();};
 for(const o of outlines)o.userData.base=o.uniforms.thickness.value;// základ v CSS px; scéna ho může násobit DPR jako u svých obrysů
 group.userData.outlines=outlines;group.userData.kid=kid;group.userData.plane=plane;
 group.update(kidPose(),planePose());
 scene?.add?.(group);
 return group;
}
