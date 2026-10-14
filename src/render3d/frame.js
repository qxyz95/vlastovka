// Plán snímku (čisté, bez three.js a DOM). Vlastní R1. Tvar plan a smlouva view(f) jsou v ./index.js. Testy: tests/render3d-frame.test.js.
// planFrame({f,model,time,visual,state,prev}) → plan; nemutuje vstup. viewOf(f,camera) → {cam,px,py,ground,k}.
// Kamera: režisér z camera.js (R5: rest → follow ⇄ vista / intro / district → landing, zámek při QTE). Stav režiséra jede v plan.director,
// další snímek ho dostane přes prev (nextDirector, bez mutace). Bez prev začíná režisér znovu (první snímek bez dojezdu).
import {PIXELS_PER_METER as PPM,SCREEN_METERS} from '../scenes.js';
import {activeEvent} from '../events.js';
import {noise1,damp} from '../motion.js';
import {createDirector,direct,nextDirector,cameraView,project as projectCam,qteLock,CRUISE} from './camera.js';
import {follow,sideCamera,PLANE_OFFSET,LAYERS,chunkOffset,placeIndex} from './geometry.js';
import {companion} from './life.js';
import {moodAt} from './mood.js';
import {planePose,kidPose,restCamera,HAND} from './pose.js';
import {comicLook} from './comic.js';
import {fxMap} from './fx-map.js';
import {eventView} from './events-view.js';
import {uiScale} from './ui-layer.js';
import {initialQuality} from './quality.js';

export const LOGICAL={w:640,h:360},ASPECT=16/9,REST={px:148,py:258};
// Papírové město: vlaštovka na scéně užší než `width` CSS px o 15 % větší (rozhodnutí 14. 10., spec 06 kap. 6), jen vzhled, fyzika ani kamera beze změny.
export const PLANE_NARROW=Object.freeze({width:500,scale:1.15});
export const styleOf=visual=>visual?.style==='papir'?'papir':'cyber';
export const planeScale=(style,cssWidth=640)=>style==='papir'&&cssWidth<PLANE_NARROW.width?PLANE_NARROW.scale:1;
// Délka vlaštovky podle šířky záběru W (research/start/02 M-2, 01 §3.7): v ruce 0,5 m při 16 m, L(W) = 0,5·(W/16)^1,36 až do 7,75 m
// (plane.PLANE_SCALE, W 120 m), dál stálá. Na úzké scéně (< PLANE_NARROW.width CSS px) aspoň minPx CSS px. Jen vzhled, fyzika je bod.
export const PLANE_SIZE=Object.freeze({hand:.5,ref:16,exp:1.36,max:7.75,minPx:24});
export const planeLength=(W,cssWidth=640)=>Math.max(Math.min(PLANE_SIZE.max,PLANE_SIZE.hand*(W/PLANE_SIZE.ref)**PLANE_SIZE.exp),cssWidth<PLANE_NARROW.width?PLANE_SIZE.minPx*W/cssWidth:0);
// Násobek PLANE_SCALE pro plan.plane.scale a plan.hand.scale: délka podle záběru × +15 % papíru na úzké scéně.
export const planeSizeScale=(W,style,cssWidth=640)=>planeLength(W,cssWidth)/PLANE_SIZE.max*planeScale(style,cssWidth);
// Záběr Follow: šířka 120 m ve hloubce letu (k ≈ 2,5), úzký FOV a mírný pohled shora jako v prototypu. V klidu záběr Dílny z pose.js (k = 1,25).
export const CAMERA={width:120,fov:20,pitch:6};
// ── Projekce (stejná jako THREE.PerspectiveCamera.lookAt, up = +y, bez zoomu a posunu pohledu; náklon camera.roll ve ° jako camera.js).
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const tanV=cam=>Math.tan(cam.fov*Math.PI/360);
// Bod světa (m) → [sx,sy,depth] v logických px 640×360; depth = vzdálenost podél osy pohledu.
export function project(p,cam){if(cam.roll){const q=projectCam(cam,p,ASPECT);return [q.px,q.py,q.depth];}
 const f=norm(sub(cam.target,cam.position)),r=norm(cross(f,[0,1,0])),u=cross(r,f),d=sub(p,cam.position),z=dot(d,f),tv=tanV(cam);
 return [LOGICAL.w/2*(1+dot(d,r)/(z*tv*ASPECT)),LOGICAL.h/2*(1-dot(d,u)/(z*tv)),z];
}
// Logické px na 1 m v hloubce depth.
export const pxPerMeter=(depth,cam)=>LOGICAL.w/2/(depth*tanV(cam)*ASPECT);
// Kamera Follow pro vlaštovku v (X,Y) m. zoom násobí šířku záběru (R5). Vrací tvar plan.camera.
export function cameraFor(X,Y,{width=CAMERA.width,zoom=1,fov=CAMERA.fov,pitch=CAMERA.pitch,px=REST.px}={}){
 const v=follow(X,Y,{width:width*zoom,aspect:ASPECT,px:px/LOGICAL.w}),s=sideCamera(v,fov,pitch);
 const cam={...v,position:s.position,target:s.target,dist:s.dist,fov,zoom,lock:false,shake:[0,0]};
 // Pohled shora mírně mění hloubku bodu podle výšky: posun kamery v x (kolmo na osu pohledu) dorovná vlaštovku přesně na px.
 const [sx,,z]=project([X,Y,0],cam),dx=(sx-px)/pxPerMeter(z,cam);
 return {...cam,cx:cam.cx+dx,position:[cam.position[0]+dx,...cam.position.slice(1)],target:[cam.target[0]+dx,...cam.target.slice(1)]};
}
export const planeWorld=f=>f?[f.x+PLANE_OFFSET,f.y]:[HAND.x,HAND.y];
// Režisér (camera.js): šířka záběru Follow CAMERA.width, v klidu záběr Dílny z pose.js (HAND na (148, 258)). Klidový stav je konstantní.
export const DIRECTOR={width:CAMERA.width,fov:CAMERA.fov,pitch:CAMERA.pitch,aspect:ASPECT};
let rest;const restDirector=()=>rest??=direct(createDirector(DIRECTOR),{x:HAND.x,y:HAND.y,v:0,t:0,dt:0,flying:false});
// Tempo π a cestovní rychlost výbavy (01 §3.3): nový systém nese π v f.d.pi a cestovní rychlost s β v f.cruise (simulation/progression/model.mjs),
// dnešní hra jen f.p.cruise (π = 1). Calm camera i reduced motion = kamera bez dynamického zoomu (01 §3.8).
export const paceOf=f=>f?.d?.pi??f?.p?.pi??1;
export const cruiseOf=(f,k=paceOf(f))=>f?.cruise??(f?.p?.cruise??CRUISE)*k;
export const calmOf=visual=>!!(visual?.settings?.calm||visual?.reduced);
// Jeden krok režiséra pro let f (bez f = klid). time = hodiny scény (za letu f.t, po dopadu f.t + čas od dopadu, v klidu visual.clock).
// prev = předchozí plan (jeho director a dirT); bez prev nový režisér. Čisté: prev.director se nemutuje.
export function directorFor({f=null,prev=null,time,visual={}}={}){
 if(!f)return restDirector();
 const flying=!f.landed,t=flying?f.t:time??f.t,[X,Y]=planeWorld(f),base=prev?.director,dt=base?Math.max(0,Math.min(.1,t-(prev.dirT??t))):1/60;
 const k=paceOf(f),input={x:X,y:Y,v:f.vx,vy:f.vy,t,dt,flying,landed:f.landed,f,k,c:cruiseOf(f,k),dive:!!f.dive,best:visual.best,calm:calmOf(visual)};
 return base?nextDirector(base,input):direct(createDirector(DIRECTOR),input);
}
export const cameraOf=f=>directorFor({f}).camera;
// Smlouva view(f): {cam,px,py,ground,k} v logických px; cam = X·2,1 − px.
export function viewOf(f,camera){const [X,Y]=planeWorld(f);return cameraView(camera??cameraOf(f),X,Y);}
// Místa, která kamera vidí (i panorama v hloubce LAYERS.far a zem za ní), seřazená od nejbližšího ke středu záběru.
export function placesFor(cam,margin=80){
 const depth=cam.dist-LAYERS.far+60,reach=depth*tanV(cam)*ASPECT+margin,a=Math.max(0,Math.floor((cam.cx-reach)/SCREEN_METERS)),b=Math.floor((cam.cx+reach)/SCREEN_METERS),out=[];
 for(let s=a;s<=b;s++){const index=placeIndex(s);out.push({screen:s,index,district:Math.floor(index/4),x0:chunkOffset(s)});}
 return out.sort((p,q)=>Math.abs(p.x0+SCREEN_METERS/2-cam.cx)-Math.abs(q.x0+SCREEN_METERS/2-cam.cx));
}
// 3D doplněk k póze z pose.js: náklon křídel k divákovi (roll) a stáčení (yaw), za letu jemně šumem.
const tilt=(t,anim,flying,reduced)=>({roll:.42+(flying&&!reduced?noise1(t*1.3,4)*.16:0),yaw:-.2+(reduced?0:noise1(anim*.6,9)*.05)});
// Čas od poslední trefy (dav na tržnici jásá); bez historie, jen z f.events[].doneAt.
const cheerAge=f=>{let at=null;if(f)for(const e of f.events)if(e.result&&e.result!=='miss'&&e.result!=='interrupted'&&e.doneAt!=null)at=at==null?e.doneAt:Math.max(at,e.doneAt);return at==null?null:f.t-at;};

export function planFrame({f=null,model='dart',time=0,visual={},state,prev=null}={}){
 const style=styleOf(visual),paper=style==='papir',cssWidth=visual.cssWidth??640;
 // Kvalita: ve výchozím stylu jako dřív (visual.quality ?? 2); v papíru výchozí z quality.js (pokles podle P95 drží volající přes nextQuality).
 const quality=visual.quality??(paper?initialQuality({touch:!!visual.touch,cssWidth}):2);
 const flying=!!f&&!f.landed,t=flying?f.t:visual.clock??time,clock=visual.clock??time,reduced=!!visual.reduced,charge=f?0:visual.charge??0;
 state=state??visual.state??(f?(f.landed?'landed':'flight'):'aim');
 state=state==='result'?'landed':state;
 const rest=state==='aim'||state==='workshop',[X,Y]=planeWorld(rest?null:f);
 // Kamera: režisér (camera.js). V Dílně a při míření klidový záběr (i když ui.js ještě drží dopadlý let).
 const director=rest?restDirector():directorFor({f,prev,time,visual}),dirT=f&&!rest?(f.landed?time??f.t:f.t):clock,calm=calmOf(visual);
 const v=cameraView(director.camera,X,Y),scale=planeSizeScale(director.camera.width,style,cssWidth),mpp=1/(PPM*v.k),opts={reduced,clock,settings:visual.settings,metersPerPx:mpp,vx:f?.vx??0,frame:t,flying};
 const fxv=fxMap(visual.fx,v,opts);
 // otřes: x,y logické px (UI vrstva), dx,dy m a roll rad (3D kamera); Calm camera bez otřesu
 const camera={...director.camera,shake:calm?{x:0,y:0,roll:0,dx:0,dy:0}:fxv.shake??{x:0,y:0,roll:0,dx:0,dy:0}};if(calm)fxv.shake=camera.shake;
 // Póza z pose.js (R3). Tam je angle = rotation.z three.js (−úhel 2D); plan.plane.angle drží znaménko juice.flightAngle podle smlouvy.
 const anim=reduced?0:t,own=planePose({f:rest?null:f,fx:rest?null:visual.fx,charge,anim,clock,reduced});
 const plane={x:X+own.dx,y:Y+own.dy+(f?.landed?.6:0),z:0,angle:-own.angle,...tilt(t,anim,flying,reduced),squash:own.squash,model,look:null,visible:!rest,scale};// v klidu drží vlaštovku workshop.js
 const kid={...kidPose({charge,thrown:!!f&&f.t>0,t:anim,reduced}),visible:rest};
 const e=rest?null:activeEvent(f),events=e?[eventView(e,f.t)]:[];
 // „Zadržení dechu“: od varování QTE do 0,3 s po výsledku (qteLock) se pozadí tlumí; náběh i doznění přes damp (stav v prev.mood.hold).
 const goal=!rest&&qteLock(f)?1:0,hold=prev&&!rest?damp(prev.mood?.hold??0,goal,.12,Math.max(0,Math.min(.1,dirT-(prev.dirT??dirT)))):goal;
 const m=moodAt(X,t,{hold:hold<1e-3?0:hold,style}),mood={...m,fog:{near:camera.dist+60,far:camera.dist+950,...m.fog}};
 const comic=comicLook(mood,quality,style);
 return {t,state,view:v,hand:rest?{...own,model,scale}:null,X,Y,camera,director,dirT,vx:f?.vx??0,carry:f?.carry??0,ev:e?{at:e.at,phase:e.phase}:null,plane,kid,places:placesFor(camera),mood,comic,events,fx:fxv,comp:companion(e,f?.t??0),cheer:cheerAge(f),
  ui:{qte:visual.qte??null,aim:visual.aim??null,labels:events,charge,reduced,uiScale:uiScale(cssWidth),palette:visual.palette},quality,style,reduced};
}
