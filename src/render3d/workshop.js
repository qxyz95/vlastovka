// Místo odhodu ve 3D (three.js). Vlastní R3. createWorkshop(scene,ctx) → THREE.Group (souřadnice místa 0, přidá se do scene) s metodami
//   update(kidPose,planePose,{t,reduced})  pózy z pose.js; planePose = null skryje vlaštovku v ruce (po hodu letí vlaštovka z plane.js);
//                               planePose.scale násobí měřítko (papír); t a reduced jen pro papírový praporek
//   dispose()                   uvolní vlastní geometrie, materiály a textury (sdílené z ctx ne)
// ctx = {ramp, hull, model, planeScale, style, palette, paper}: rampa a obrys ze scene.js (jinak vlastní z toon.js). group.userData.outlines = vlastní obrysové
// materiály, kterým scéna při resize nastaví uniforms.resolution (a mlhu). Vlaštovka v ruce leží v ruce stylu (pose.handOf), klidová kamera ji promítne na (148, 258).
// Cyber: Dílna PAPER LAB z cityChunk(0) (shop:true), přístavek se střechou, okna, dveře a dítě v měřítku S m na 1 px 2D postavičky, ruka HAND 16 m.
// Papír (S4, bible 05 kap. 9, katalog 11 kap. 3.7 a 4.2 varianta A): podkrovní dílna v řezu. Statické H2–H6 kreslí město ve sloučené ulici místa 0
// (city.paperLayers '0s'), tady jen jedna dynamická geometrie dítěte H1 a praporku větru (models/kid-rig.js, paperMaterial(ID.near) ze sdílené sady
// ctx.paper = paper.paperKit(), jinak vlastní; stín dítěte je proxy v masce místa), cedulka PAPER LAB jako textura na kartě domu H2 a vlaštovka
// v ruce ve 12 m (razítko grafit 2,6 px, stín na zem ctx.paper.shadows.castPlane).
import * as THREE from 'three';
import {mergeBlocks,planeShape,cityChunk,outlineStamp} from './geometry.js';
import {toonRamp,outlineMaterial,stampOutlineMaterial,signTexture} from './toon.js';
import {HAND,PAPER_HAND,kidPose,planePose} from './pose.js';
import {CYBER,PAPIR,INK} from './palette.js';
import {paperMaterial,lin,ID} from './paper.js';
import {planeColors} from './plane.js';
import {kidRig,poseKid} from './models/kid-rig.js';
import {DIORAMA} from './models/launch-site.js';
import {ATTIC} from './models/workshop-attic.js';
export const S=.25;// m na 1 px 2D dítěte (2D: dítě 41 px, vlaštovka 31 px)
// Dítě ve 2D: levý okraj kx, vlaštovka 24 px vpravo a 35 px nad chodidly; rameno (14, 28).
export const KID={x:HAND.x-24*S,y:HAND.y-35*S,z:HAND.z,shoulder:[14*S,28*S]};
const C=h=>new THREE.Color(h);
// Obrysy (bible kap. 3): budova 2,5, dítě a drobnosti 1,7, vlaštovka v ruce 2,6 (nejsilnější), vše tuš INK.
export const OUTLINE={hull:2.5,thin:1.7,plane:2.6};
function bufferOf(m){const g=new THREE.BufferGeometry();for(const [k,n] of [['position',3],['normal',3],['uv',2],['color',3],['outline',3]])g.setAttribute(k,new THREE.BufferAttribute(m[k],n));g.computeBoundingSphere();return g;}
const boxes=list=>bufferOf(mergeBlocks(list,b=>C(b.color).toArray()));
// Kvádr dítěte v px 2D postavičky: x0,y0 (od chodidel), w,h, hloubka d (střed z=0).
const px=(x,y,w,h,d,color)=>({type:'box',shape:'box',x:x*S,w:w*S,y:y*S,h:h*S,z:0,d:d*S,color});
const shopOf=()=>{const c0=cityChunk(0);return {b:c0.blocks.find(x=>x.shop),sg:c0.signs.find(x=>x.shop)};};
// Části dítěte cyber Dílny (skupiny legs → body, upper, head, arm) v px 2D postavičky.
export function kidParts(P){
 const at=(list,dx)=>list.map(p=>({...p,x:p.x-dx}));
 return {legs:at([px(1,0,5,10,5,P.legs),px(11,0,5,10,5,P.legs)],8*S),upper:at([px(0,10,16,20,9,P.shirt)],8*S),
  head:at([px(3,30,10,11,9,P.skin),px(6,34,9,3,9.6,P.visor),px(2,39,12,3,10,P.legs)],8*S),
  arm:[px(0,-2,15,4,4,P.shirt),px(14,-3,5,6,5,P.skin)]};
}
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

export function createWorkshop(scene,ctx={}){
 const paper=(ctx.style??ctx.palette?.id)==='papir',PAL=(paper?PAPIR:CYBER).workshop;
 const group=new THREE.Group(),own=[],outlines=[],fog=scene?.fog,kit=paper?ctx.paper:null,shadows=kit?.shadows;
 const mk=(o,m)=>(own.push(o),m===undefined?o:m);
 let lit=null,signMat,hero=null,rig=null,solid=null;const H=paper?PAPER_HAND:HAND;
 if(paper){
  // Dítě H1 + praporek H5: jedna dynamická geometrie (models/kid-rig.js), polohy přepisuje update bez alokace; obal pevný (praporek i záklon).
  rig=kidRig();const g=mk(new THREE.BufferGeometry()),col=new Float32Array(rig.count*3);rig.colors.forEach((h,i)=>{const c=lin(h);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;});
  g.setAttribute('position',new THREE.BufferAttribute(rig.positions,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('normal',new THREE.BufferAttribute(rig.normals,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  g.computeBoundingSphere();g.boundingSphere.radius+=1;
  hero=new THREE.Mesh(g,kit?.material(ID.near)??mk(paperMaterial(ID.near)));hero.userData.layer=ID.near;group.add(hero);
  const sg=PAPER_SIGN;signMat=mk(new THREE.MeshBasicMaterial({map:mk(paperSignTexture(sg.text,PAL)),fog:false}));
  const sign=new THREE.Mesh(mk(new THREE.PlaneGeometry(sg.w,sg.h)),signMat);sign.position.set(sg.x,sg.y,sg.z);group.add(sign);
 }else{
  const ramp=ctx.ramp??toonRamp(),hull=ctx.hull??mk(outlineMaterial({fog,color:INK,thickness:OUTLINE.hull})),thin=mk(outlineMaterial({fog,color:INK,thickness:OUTLINE.thin}));outlines.push(thin);if(!ctx.hull)outlines.push(hull);
  const toon=mk(new THREE.MeshToonMaterial({vertexColors:true,gradientMap:ramp}));
  solid=(list,line=hull,parent=group)=>{const g=mk(boxes(list)),m=new THREE.Mesh(g,toon),o=new THREE.Mesh(g,line);m.castShadow=m.receiveShadow=true;parent.add(m,o);return m;};
  solid.thin=thin;solid.ramp=ramp;
  const {b,sg}=shopOf();
  // Budova a cedule z cityChunk(0); přístavek pod dítětem sahá od budovy až za ruku.
  const front=b.z+b.d/2,top=KID.y,ax=b.x+b.w,aw=HAND.x+7-ax,az=HAND.z-3.5,ad=11,af=az+ad/2;
  solid([{...b,type:'box',color:PAL.wall},{type:'box',x:b.x-.5,w:b.w+1,y:b.h,h:.7,z:b.z,d:b.d+1,color:PAL.roof},
   {type:'box',x:ax,w:aw,y:0,h:top-.5,z:az,d:ad,color:PAL.annex},{type:'box',x:ax-.3,w:aw+.6,y:top-.5,h:.5,z:az,d:ad+.6,color:PAL.roof},
   // dveře a rámy oken (budova: okno pod cedulí, přístavek: výloha a dveře)
   {type:'box',x:b.x+b.w-6.5,w:4.2,y:0,h:5.6,z:front+.15,d:.3,color:PAL.door},{type:'box',x:b.x+2.6,w:11.8,y:1.6,h:5,z:front+.1,d:.2,color:PAL.frame},
   {type:'box',x:ax+3,w:12,y:1.4,h:4.4,z:af+.1,d:.2,color:PAL.frame},{type:'box',x:ax+aw-7,w:4.2,y:0,h:5.2,z:af+.15,d:.3,color:PAL.door},
   // zábradlí střechy přístavku před dítětem a vzadu
   ...[0,1,2,3,4].map(i=>({type:'box',x:ax+1+i*(aw-2.4)/4,w:.4,y:top,h:1.3,z:af-.3,d:.4,color:PAL.rail})),{type:'box',x:ax+1,w:aw-2,y:top+1.3,h:.35,z:af-.3,d:.5,color:PAL.rail},
   {type:'box',x:ax+1,w:aw-2,y:top+1.3,h:.35,z:az-ad/2+.3,d:.5,color:PAL.rail}]);
  // Okna svítí (dýchající světlo); barva materiálu se násobí kidPose.glow.
  const glow=mk(new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}));
  lit=new THREE.Mesh(mk(boxes([{type:'box',x:b.x+3,w:11,y:2,h:4.2,z:front+.25,d:.1,color:PAL.window},{type:'box',x:b.x+3.6,w:9.8,y:5,h:.6,z:front+.32,d:.05,color:PAL.light},
   {type:'box',x:b.x+5,w:1.8,y:2.6,h:1.8,z:front+.32,d:.05,color:PAL.light},{type:'box',x:ax+3.4,w:11.2,y:1.8,h:3.6,z:af+.25,d:.1,color:PAL.warm}])),glow);group.add(lit);
  // Neonová cedule PAPER LAB: občas blikne (kidPose.flicker, šum jako ve 2D).
  signMat=mk(new THREE.MeshBasicMaterial({map:signTexture(sg.text,sg.color,!!sg.vertical),toneMapped:false}));const sign=new THREE.Mesh(mk(new THREE.PlaneGeometry(1,1)),signMat);
  sign.scale.set(sg.w,sg.h,1);sign.position.set(sg.x+sg.w/2,sg.y+sg.h/2,Math.max(sg.z,front+.35));group.add(sign);
 }
 // Cyber dítě: kid (couvne) → body (záklon kolem chodidel) → upper (dýchání) → head, arm (pivot v rameni).
 const kid=new THREE.Group(),body=new THREE.Group(),upper=new THREE.Group(),head=new THREE.Group(),arm=new THREE.Group();
 if(!paper){kid.position.set(KID.x,KID.y,KID.z);kid.add(body);body.add(upper);upper.add(head,arm);group.add(kid);
  body.position.x=8*S;// osa záklonu uprostřed chodidel
  const parts=kidParts(PAL);
  solid(parts.legs,solid.thin,body);solid(parts.upper,solid.thin,upper);solid(parts.head,solid.thin,head);
  arm.position.set(KID.shoulder[0]-8*S,KID.shoulder[1],6.5*S);// ruka před trupem (ke kameře)
  solid(parts.arm,solid.thin,arm);}
 // Vlaštovka v ruce: planeShape, skupiny root (poloha) → tilt (rotace z) → squash → roll. Cyber: toon, obrys zvětšenou kopií, přehyby;
 // papír: barva vrcholů bez světla (jako plane.js), obrys razítkem grafit 2,6 px, přehyb tužkou, stín na zem castPlane.
 const planeHull=mk(paper?stampOutlineMaterial({color:PAPIR.plane.outline,thickness:OUTLINE.plane}):outlineMaterial({side:THREE.DoubleSide,color:INK,thickness:OUTLINE.plane}));planeHull.depthWrite=false;outlines.push(planeHull);
 const planeMat=mk(paper?new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:false}):new THREE.MeshToonMaterial({color:PAL.plane,gradientMap:solid?.ramp,side:THREE.DoubleSide})),creaseMat=mk(new THREE.LineBasicMaterial({color:PAL.crease}));
 const shapes={},shapeOf=model=>shapes[model]??=(s=>{const g=mk(new THREE.BufferGeometry()),l=mk(new THREE.BufferGeometry());
  g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));g.setAttribute('outline',new THREE.Float32BufferAttribute(s.outline,3));
  l.setAttribute('position',new THREE.Float32BufferAttribute(s.creases,3));
  if(!paper)return {g,l,h:g};
  g.setAttribute('color',new THREE.BufferAttribute(planeColors(s.normals,PAPIR.plane),3));
  const st=outlineStamp(s.positions),h=mk(new THREE.BufferGeometry());h.setAttribute('position',new THREE.Float32BufferAttribute(st.positions,3));h.setAttribute('shift',new THREE.Float32BufferAttribute(st.shift,2));
  return {g,l,h};})(planeShape(model));
 const plane=new THREE.Group(),tilt=new THREE.Group(),squash=new THREE.Group(),roll=new THREE.Group(),pm=new THREE.Mesh(undefined,planeMat),ph=new THREE.Mesh(undefined,planeHull),pc=new THREE.LineSegments(undefined,creaseMat);
 pm.castShadow=!paper;pm.renderOrder=2;ph.renderOrder=paper?2:1;pc.renderOrder=3;roll.add(pm,ph,pc);squash.add(roll);tilt.add(squash);plane.add(tilt);group.add(plane);
 roll.rotation.x=.42;roll.rotation.y=-.2;// křídla natočená ke kameře jako v prototypu
 let model=null,ps=null;const setModel=m=>{if(m===model)return;model=m;const s=shapeOf(m);pm.geometry=s.g;ph.geometry=s.h;pc.geometry=s.l;if(ps)ps.geometry=s.g;};setModel(ctx.model??'dart');
 if(paper&&shadows){ps=shadows.castPlane(pm.geometry);pm.add(ps);}// stín vlaštovky v ruce na zem (dítě dědí matrixWorld)
 const scale=ctx.planeScale??31*S;
 const v=new THREE.Vector3();
 const at={x:0,y:0},pos=hero?.geometry.attributes.position;
 group.update=(k,p,{t=0,reduced=false}={})=>{
  if(k&&!paper){kid.position.x=KID.x-k.back;body.rotation.z=k.lean;upper.position.y=k.bob;
   if(lit){lit.material.color.setScalar(k.glow);signMat.color.setScalar(k.flicker?.35:1);}}
  plane.visible=!!p;
  // plan.hand.scale: velikost vlaštovky v ruce podle záběru (S3), v papíru i +15 % na úzké scéně (P0)
  if(p){if(p.model)setModel(p.model);const sc=scale*(p.scale??1);plane.position.set(H.x+p.dx,H.y+p.dy,H.z);tilt.rotation.z=p.angle;squash.scale.set(p.squash[0]*sc,p.squash[1]*sc,sc);}
  // Papír: dítě a praporek (CPU, bez alokace); dlaň drží vlaštovku v ruce, po hodu švih a mávání.
  if(paper){if(k){at.x=plane.position.x;at.y=plane.position.y;poseKid(rig,k,p?at:null,{t,reduced});pos.needsUpdate=true;}return;}
  // Ruka: mávání (kidPose.arm) nebo míří k vlaštovce a natáhne se k ní.
  if(k?.arm!=null){arm.rotation.z=k.arm;arm.scale.x=1;}
  else{arm.updateWorldMatrix(true,false);v.setFromMatrixPosition(arm.matrixWorld);group.worldToLocal(v);const tx=plane.position.x-v.x,ty=plane.position.y-v.y;
   arm.rotation.z=Math.atan2(ty,tx)-body.rotation.z;arm.scale.x=Math.max(.6,Math.min(1.4,Math.hypot(tx,ty)/(16*S)));}
 };
 group.dispose=()=>{for(const o of own)o.dispose?.();group.removeFromParent();};
 for(const o of outlines)o.userData.base=o.uniforms.thickness.value;// základ v CSS px; scéna ho může násobit DPR jako u svých obrysů
 group.userData.outlines=outlines;group.userData.kid=paper?hero:kid;group.userData.plane=plane;group.userData.style=paper?'papir':'cyber';group.userData.rig=rig;
 group.update(kidPose(),planePose());
 scene?.add?.(group);
 return group;
}
