// Plán snímku (čisté, bez three.js a DOM). Vlastní R1. Tvar plan a smlouva view(f) jsou v ./index.js. Testy: tests/render3d-frame.test.js.
// planFrame({f,model,time,visual,state,prev}) → plan; nemutuje vstup. viewOf(f,camera) → {cam,px,py,ground,k}.
// Kamera: Follow z geometry.js (follow + sideCamera), x dorovnané tak, aby vlaštovka padla přesně na px 148 i při pohledu shora.
import {PIXELS_PER_METER as PPM,SCREEN_METERS} from '../scenes.js';
import {activeEvent} from '../events.js';
import {noise1,lerp} from '../motion.js';
import {follow,sideCamera,PLANE_OFFSET,LAYERS,chunkOffset,placeIndex} from './geometry.js';
import {companion} from './life.js';
import {moodAt} from './mood.js';
import {planePose,kidPose,restCamera,HAND} from './pose.js';
import {comicLook} from './comic.js';
import {fxMap} from './fx-map.js';
import {eventView} from './events-view.js';
import {uiScale} from './ui-layer.js';

export const LOGICAL={w:640,h:360},ASPECT=16/9,REST={px:148,py:258};
// Záběr Follow: šířka 120 m ve hloubce letu (k ≈ 2,5), úzký FOV a mírný pohled shora jako v prototypu. V klidu záběr Dílny z pose.js (k = 1,25).
export const CAMERA={width:120,fov:20,pitch:6};
// ── Projekce (stejná jako THREE.PerspectiveCamera.lookAt, up = +y, bez zoomu a posunu pohledu).
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const tanV=cam=>Math.tan(cam.fov*Math.PI/360);
// Bod světa (m) → [sx,sy,depth] v logických px 640×360; depth = vzdálenost podél osy pohledu.
export function project(p,cam){
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
// Klidový záběr Dílny (pose.js R3: restCamera promítne HAND, vlaštovku v ruce, na (148, 258)). Konstantní, proto spočítaný jednou.
let rest;const restCam=()=>rest??={zoom:1,lock:false,shake:[0,0],...restCamera(ASPECT)};
export const planeWorld=f=>f?[f.x+PLANE_OFFSET,f.y]:[HAND.x,HAND.y];
// Kamera snímku: za letu a po dopadu Follow, v Dílně a při míření klidový záběr.
// Přechod z klidu do Follow po hodu: čistě podle f.t (smoothstep přes TRANSITION s), takže view(f) zůstává bez stavu a shodný s plan.view.
export const TRANSITION=1.2;
const ease01=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);},L3=(a,b,w)=>a.map((v,i)=>lerp(v,b[i],w));
export function cameraOf(f){
 const o=restCam();if(!f)return {...o,position:[...o.position],target:[...o.target]};
 const [X,Y]=planeWorld(f),c=cameraFor(X,Y),w=ease01(f.t/TRANSITION);if(w>=1)return c;
 const b={...c,cx:lerp(o.cx,c.cx,w),cy:lerp(o.cy,c.cy,w),width:lerp(o.width,c.width,w),height:lerp(o.height,c.height,w),dist:lerp(o.dist,c.dist,w),position:L3(o.position,c.position,w),target:L3(o.target,c.target,w)};
 const [sx,,z]=project([X,Y,0],b),dx=(sx-REST.px)/pxPerMeter(z,b);// vlaštovka i během přechodu přesně na px 148
 return {...b,cx:b.cx+dx,position:[b.position[0]+dx,b.position[1],b.position[2]],target:[b.target[0]+dx,b.target[1],b.target[2]]};
}
// Smlouva view(f): {cam,px,py,ground,k} v logických px; cam = X·2,1 − px.
export function viewOf(f,camera){
 const [X,Y]=planeWorld(f),c=camera??cameraOf(f),[px,py,z]=project([X,Y,0],c),ground=project([X,0,0],c)[1];
 return {cam:X*PPM-px,px,py,ground,k:pxPerMeter(z,c)/PPM};
}
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
 const flying=!!f&&!f.landed,t=flying?f.t:visual.clock??time,clock=visual.clock??time,reduced=!!visual.reduced,charge=f?0:visual.charge??0;
 state=state??visual.state??(f?(f.landed?'landed':'flight'):'aim');
 const [X,Y]=planeWorld(f);
 // FALLBACK(R5, camera.js): pevný Follow bez stavů Vista/Place intro/Landing a bez zámku při QTE.
 const camera=cameraOf(f),v=viewOf(f,camera),mpp=1/(PPM*v.k),opts={reduced,clock,settings:visual.settings,metersPerPx:mpp,vx:f?.vx??0,frame:t,flying};
 const fxv=fxMap(visual.fx,v,opts);
 camera.shake=fxv.shake??{x:0,y:0,roll:0,dx:0,dy:0};// otřes: x,y logické px (UI vrstva), dx,dy m a roll rad (3D kamera)
 // Póza z pose.js (R3). Tam je angle = rotation.z three.js (−úhel 2D); plan.plane.angle drží znaménko juice.flightAngle podle smlouvy.
 const anim=reduced?0:t,own=planePose({f,fx:visual.fx,charge,anim,clock,reduced}),rest=state==='aim'||state==='workshop';
 const plane={x:X+own.dx,y:Y+own.dy+(f?.landed?.6:0),z:0,angle:-own.angle,...tilt(t,anim,flying,reduced),squash:own.squash,model,look:null,visible:!rest};// v klidu drží vlaštovku workshop.js
 const kid={...kidPose({charge,thrown:!!f&&f.t>0,t:anim,reduced}),visible:rest};
 const e=activeEvent(f),events=e?[eventView(e,f.t)]:[];
 // hold („zadržení dechu“) zatím 0, rozhodne c1/c2 (kamera a nálada při QTE).
 const m=moodAt(X,t,{hold:0}),mood={...m,fog:{near:camera.dist+60,far:camera.dist+950,...m.fog}};
 const comic=comicLook(mood,visual.quality??2);
 return {t,state,view:v,hand:rest?{...own,model}:null,X,Y,camera,plane,kid,places:placesFor(camera),mood,comic,events,fx:fxv,comp:companion(e,f?.t??0),cheer:cheerAge(f),
  ui:{qte:visual.qte??null,aim:visual.aim??null,labels:events,charge,reduced,uiScale:uiScale(visual.cssWidth??640),palette:visual.palette},quality:visual.quality??2,reduced};
}
