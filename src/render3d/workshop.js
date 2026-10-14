// Místo odhodu ve 3D (three.js). Vlastní R3. createWorkshop(scene,ctx) → THREE.Group (souřadnice místa 0, přidá se do scene) s metodami
//   update(kidPose,planePose,{t,reduced})  pózy z pose.js; planePose = null skryje vlaštovku v ruce (po hodu letí vlaštovka z plane.js);
//                               planePose.scale násobí měřítko; t a reduced jen pro praporek
//   dispose()                   uvolní vlastní geometrie, materiály a textury (sdílené z ctx ne)
// ctx = {model, planeScale, paper}: group.userData.outlines = vlastní obrysové materiály (razítko vlaštovky), kterým scéna při resize nastaví
// uniforms.resolution. Vlaštovka v ruce leží v ruce pose.HAND, klidová kamera ji promítne na (148, 258).
// S4 (bible 05 kap. 9, katalog 11 kap. 3.7 a 4.2 varianta A): podkrovní dílna v řezu. Statické H2–H6 kreslí město ve sloučené ulici místa 0
// (city.paperLayers '0s'), tady jen jedna dynamická geometrie dítěte H1 a praporku větru (models/kid-rig.js, paperMaterial(ID.near) ze sdílené sady
// ctx.paper = paper.paperKit(), jinak vlastní; stín dítěte je proxy v masce místa), cedulka PAPER LAB jako textura na kartě domu H2 a vlaštovka
// v ruce ve 12 m (razítko grafit 2,6 px, stín na zem ctx.paper.shadows.castPlane).
import * as THREE from 'three';
import {planeShape,outlineStamp} from './geometry.js';
import {stampOutlineMaterial} from './toon.js';
import {HAND,kidPose,planePose} from './pose.js';
import {PAPIR} from './palette.js';
import {paperMaterial,lin,ID} from './paper.js';
import {planeColors,PLANE_SCALE} from './plane.js';
import {kidRig,poseKid} from './models/kid-rig.js';
import {DIORAMA} from './models/launch-site.js';
import {ATTIC} from './models/workshop-attic.js';
// Cedulka PAPER LAB místa odhodu (bible 05 kap. 9.1, model H2 ATTIC.sign): karta 5,6 × 0,6 m nad okny 2. patra; střed ve světě a čelo
// těsně před kartou modelu (zakryje ji i s podtržením, které kreslí textura).
const ATTIC_AT=DIORAMA.find(o=>o.id==='workshop-attic').at;
export const PAPER_SIGN=Object.freeze({x:ATTIC_AT.x+ATTIC.sign.x,y:ATTIC_AT.y+ATTIC.sign.y+ATTIC.sign.h/2,z:ATTIC_AT.z+ATTIC.sign.front+.015,w:ATTIC.sign.w,h:ATTIC.sign.h,text:'PAPER LAB'});
const makeCanvas=(w,h)=>{if(globalThis.OffscreenCanvas)return new OffscreenCanvas(w,h);const c=globalThis.document.createElement('canvas');c.width=w;c.height=h;return c;};
// Textura cedulky v poměru stran karty (1024 px na šířku): krémová karta, grafitové písmo --display, rajčatové podtržení 2,8 m
// ve výšce 0,08–0,14 m nad spodní hranou (jako karta modelu H2).
export function paperSignTexture(text,P=PAPIR.workshop,make=makeCanvas,{w=PAPER_SIGN.w,h=PAPER_SIGN.h}={}){
 const W=1024,H=Math.round(W*h/w),k=W/w,c=make(W,H),g=c.getContext('2d');g.fillStyle=P.sign;g.fillRect(0,0,W,H);
 g.fillStyle=P.signText;g.font=`700 ${Math.round(H*.6)}px ${PAPIR.popup.font}`;g.textAlign='center';g.textBaseline='middle';g.fillText(text,W/2,H*.42,W*.9);
 g.fillStyle=P.signLine;g.fillRect(W/2-1.4*k,H-.14*k,2.8*k,.06*k);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}

// Obrys vlaštovky v ruce (razítko) v CSS px, stejně jako letící vlaštovka.
export const OUTLINE={plane:2.6};
export function createWorkshop(scene,ctx={}){
 const PAL=PAPIR.workshop,group=new THREE.Group(),own=[],outlines=[],kit=ctx.paper,shadows=kit?.shadows,H=HAND;
 const mk=(o,m)=>(own.push(o),m===undefined?o:m);
 // Dítě H1 + praporek H5: jedna dynamická geometrie (models/kid-rig.js), polohy přepisuje update bez alokace; obal pevný (praporek i záklon).
 const rig=kidRig(),g=mk(new THREE.BufferGeometry()),col=new Float32Array(rig.count*3);rig.colors.forEach((h,i)=>{const c=lin(h);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;});
 g.setAttribute('position',new THREE.BufferAttribute(rig.positions,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('normal',new THREE.BufferAttribute(rig.normals,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 g.computeBoundingSphere();g.boundingSphere.radius+=1;
 const hero=new THREE.Mesh(g,kit?.material(ID.near)??mk(paperMaterial(ID.near)));hero.userData.layer=ID.near;group.add(hero);
 const sg=PAPER_SIGN,signMat=mk(new THREE.MeshBasicMaterial({map:mk(paperSignTexture(sg.text,PAL)),fog:false}));
 const sign=new THREE.Mesh(mk(new THREE.PlaneGeometry(sg.w,sg.h)),signMat);sign.position.set(sg.x,sg.y,sg.z);group.add(sign);
 // Vlaštovka v ruce: planeShape, skupiny root (poloha) → tilt (rotace z) → squash → roll; barva vrcholů bez světla (jako plane.js),
 // obrys razítkem grafit 2,6 px, přehyb tužkou, stín na zem castPlane.
 const planeHull=mk(stampOutlineMaterial({color:PAPIR.plane.outline,thickness:OUTLINE.plane}));planeHull.depthWrite=false;outlines.push(planeHull);
 const planeMat=mk(new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:false})),creaseMat=mk(new THREE.LineBasicMaterial({color:PAL.crease}));
 const shapes={},shapeOf=model=>shapes[model]??=(s=>{const g=mk(new THREE.BufferGeometry()),l=mk(new THREE.BufferGeometry());
  g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));g.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
  l.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
  g.setAttribute('color',new THREE.BufferAttribute(planeColors(s.normals,PAPIR.plane),3));
  const st=outlineStamp(s.positions),h=mk(new THREE.BufferGeometry());h.setAttribute('position',new THREE.Float32BufferAttribute(st.positions,3));h.setAttribute('shift',new THREE.Float32BufferAttribute(st.shift,2));
  return {g,l,h};})(planeShape(model));
 const plane=new THREE.Group(),tilt=new THREE.Group(),squash=new THREE.Group(),roll=new THREE.Group(),pm=new THREE.Mesh(undefined,planeMat),ph=new THREE.Mesh(undefined,planeHull),pc=new THREE.LineSegments(undefined,creaseMat);
 pm.renderOrder=2;ph.renderOrder=2;pc.renderOrder=3;roll.add(pm,ph,pc);squash.add(roll);tilt.add(squash);plane.add(tilt);group.add(plane);
 roll.rotation.x=.42;roll.rotation.y=-.2;// křídla natočená ke kameře jako v prototypu
 let model=null,ps=null;const setModel=m=>{if(m===model)return;model=m;const s=shapeOf(m);pm.geometry=s.g;ph.geometry=s.h;pc.geometry=s.l;if(ps)ps.geometry=s.g;};setModel(ctx.model??'dart');
 if(shadows){ps=shadows.castPlane(pm.geometry);pm.add(ps);}// stín vlaštovky v ruce na zem (dítě dědí matrixWorld)
 const scale=ctx.planeScale??PLANE_SCALE;
 const at={x:0,y:0},pos=hero.geometry.attributes.position;
 group.update=(k,p,{t=0,reduced=false}={})=>{
  plane.visible=!!p;
  // plan.hand.scale: velikost vlaštovky v ruce podle záběru (S3) a +15 % na úzké scéně (P0)
  if(p){if(p.model)setModel(p.model);const sc=scale*(p.scale??1);plane.position.set(H.x+p.dx,H.y+p.dy,H.z);tilt.rotation.z=p.angle;squash.scale.set(p.squash[0]*sc,p.squash[1]*sc,sc);}
  // Dítě a praporek (CPU, bez alokace); dlaň drží vlaštovku v ruce, po hodu švih a mávání.
  if(k){at.x=plane.position.x;at.y=plane.position.y;poseKid(rig,k,p?at:null,{t,reduced});pos.needsUpdate=true;}
 };
 group.dispose=()=>{for(const o of own)o.dispose?.();group.removeFromParent();};
 for(const o of outlines)o.userData.base=o.uniforms.thickness.value;// základ v CSS px; scéna ho může násobit DPR jako u svých obrysů
 group.userData.outlines=outlines;group.userData.kid=hero;group.userData.plane=plane;group.userData.rig=rig;
 group.update(kidPose(),planePose());
 scene?.add?.(group);
 return group;
}
