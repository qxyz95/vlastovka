// Kamera jako režisér (čisté funkce bez three.js a DOM, research/svet/01-zivy-svet.md §4, plán 3D fáze c2). Vlastní R5.
// Stavy: rest (Dílna/míření) → follow ⇄ vista / intro (Place intro) / district → landing. Kamera nikdy nestříhá: všechny cíle jdou
// přes damp + omezení rychlosti; od varování QTE do 0,3 s po vyhodnocení je zámek (zoom, px, natočení stojí, kamera jen sleduje).
// Výjimka: Calm camera / reduced motion při výhozu stříhá z klidového záběru na záběr letu (camera.cut, 01 §3.8).
// API pro R1 (frame.js):
//   s=createDirector({width,aspect,fov,pitch})          stav režiséra (width = šířka záběru v m při zoomu 1, výchozí 640/2,1 = 2D)
//   direct(s,{x,y,v,vy,t,dt,flying,landed,f,k,c,dive,best,calm,flat,shake,aimW})  jeden krok, mutuje a vrací s; s.camera = záběr (jen když je y nebo f)
//   nextDirector(prev,input)                           totéž bez mutace (kopie) pro čistý planFrame
//   project(camera,[x,y,z],aspect) → {px,py,depth}    logické px 640×360;  cameraView(camera,X,Y) → {cam,px,py,ground,k} (smlouva view)
// Testy: tests/render3d-camera.test.js.
import {SCREEN_METERS,ROUTE,DISTRICTS,PIXELS_PER_METER} from '../scenes.js';
import {damp} from '../motion.js';
import {smooth} from './life.js';
import {follow,sideCamera,tempoZoom,tempoPx} from './geometry.js';
import {HAND,REST as POSE_REST} from './pose.js';
export const TITLE={fadeIn:.3,hold:1.9,fadeOut:.6},PUNCH={dur:1.6,depth:.13,yaw:2.5},ZOOM_RANGE=[.8,1.5];
// Šířka letu (research/start/01 §3.3): W = W_let · T(π) · (1 + A·smooth(s/full)) · M_stav, s = max(0, (vx − c)/c), c = cestovní rychlost
// výbavy (cruise·π·(1+β)). dead = mrtvé pásmo cíle přebytku, hyst = nejkratší odstup změny směru (s), dive = strop přebytku při Dive,
// ahead = méně s do události → oddálení nezačne, low = krátký let (y pod low m a klesá → oddálení stojí). CRUISE = Dart (config.js), když c chybí.
export const EXCESS={A:.35,full:.8,dead:.05,hyst:.6,dive:.1,ahead:.8,low:3},CRUISE=11;
// Asymetrické tlumení přebytku: ven rychle, dovnitř pomalu (poločas s, strop ln šířky/s).
export const EASE={out:{hl:.25,rate:.8},in:{hl:1.2,rate:.25}};
export const DISTRICT={dur:1.5,out:.5,min:.4},VISTA={calm:2.5,ahead:1.5,leave:1.2,out:1.1,px:-20,minPx:110},LANDING={dur:.85,zoom:.85},LAUNCH={dur:1.2,roll:1.5};
// Zámek QTE a meze: zoom (ln šířky) nejvýš ZOOM_RATE/s na složku, px nejvýš PX_RATE px/s, natočení nejvýš MAX_ROT °. MARGIN = rezerva před událostí.
export const LOCK_AFTER=.3,MARGIN=.2,ZOOM_RATE=.8,PX_RATE=30,MAX_ROT=3,REST={px:148,py:258};
// Ruka dítěte a záběr v klidu z pose.js (R3): HAND (16 m) promítne restCamera na (148, 258); režisér v klidu drží šířku REST.width.
export {HAND};
export const titleAlpha=age=>age==null||age<0?0:age<TITLE.fadeIn?smooth(age/TITLE.fadeIn):age<TITLE.fadeIn+TITLE.hold?1:1-smooth((age-TITLE.fadeIn-TITLE.hold)/TITLE.fadeOut);
// Přiblížení na hranici místa: šířka záběru × (1 − depth·sin), hladký nástup i návrat.
export const punchZoom=age=>age==null||age<0||age>=PUNCH.dur?1:1-PUNCH.depth*Math.sin(Math.PI*smooth(age/PUNCH.dur));
// Hranice čtvrti: oddálení až na 1,5× šířky; zkrácený záběr (dur < 1,5 s) má úměrně menší hloubku, takže rychlost změny zůstane stejná.
export const districtZoom=(age,dur=DISTRICT.dur)=>age==null||age<0||age>=dur||dur<=0?1:1+DISTRICT.out*Math.min(1,dur/DISTRICT.dur)*Math.sin(Math.PI*smooth(age/dur));
// Přebytek rychlosti nad cestovní a z něj násobek šířky (cap = strop, při Dive 1,1).
export const excessOf=(v,c=CRUISE)=>c>0?Math.max(0,(v-c)/c):0;
export const excessZoom=(s,cap=Infinity)=>Math.min(cap,1+EXCESS.A*smooth(s/EXCESS.full));
// Oddálení výhozu: ln šířky z klidového záběru do šířky letu, ease-out za LAUNCH.dur (skončí před první událostí v 1,5 s).
export const launchEase=u=>1-(1-Math.max(0,Math.min(1,u)))**2;
export const placeAt=x=>Math.floor(Math.max(0,x)/SCREEN_METERS);
export function placeTitle(place){const i=place%ROUTE.length,d=Math.floor(i/4);return {title:ROUTE[i].name,sub:`${DISTRICTS[d].name} · ${i%4+1}/4`,district:d,first:i%4===0};}
// QTE zámek: od začátku varování (e.at) do 0,3 s po vyhodnocení (resolvedAt).
export function qteLock(f){if(!f?.events||f.landed)return false;return f.events.some(e=>e.phase==='warning'||e.phase==='interaction'||(e.phase==='waiting'&&f.t>=e.at)||(e.phase==='effect'&&!(f.t>=(e.resolvedAt??-Infinity)+LOCK_AFTER)));}
// Kolik s zbývá do začátku další události (nejdřívější možný čas podle at/gap; 0 = právě běží). Bez událostí Infinity.
export function nextEventIn(f){
 if(!f?.events||f.landed)return Infinity;const i=f.events.findIndex(e=>e.phase!=='done'),e=f.events[i];if(!e)return Infinity;
 if(e.phase==='warning'||e.phase==='interaction')return 0;
 if(e.phase==='effect'){const n=f.events[i+1];return n?Math.max(0,e.doneAt+n.gap-f.t):Infinity;}
 return Number.isFinite(e.at)?Math.max(0,e.at-f.t):Infinity;
}
export function createDirector(opts={}){
 const o={width:640/PIXELS_PER_METER,aspect:16/9,fov:20,pitch:6,flatFov:8,...opts};
 return {place:-1,at:null,zoom:POSE_REST.width/o.width,title:null,alpha:0,opts:o,tz:1,ex:1,exGoal:1,exDir:0,exAt:-1e9,launch:null,cut:false,px:REST.px,yaw:0,roll:0,dy:0,state:'rest',shot:null,shotAt:null,shotDur:0,calmFrom:null,thrownAt:null,landedAt:null,lock:false,camera:null};
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rot=v=>clamp(v,-MAX_ROT,MAX_ROT);
// Klidový záběr (rest) drží přesně šířku pose.REST i při užší šířce Follow (opts.width < REST.width), proto mimo ZOOM_RANGE.
// Damp k cíli, pak omezení kroku: ln poměru (zoom) nebo absolutně (px).
const toward=(x,goal,hl,dt,max,log)=>{const y=damp(x,goal,hl,dt);if(!log)return x+clamp(y-x,-max*dt,max*dt);const d=clamp(Math.log(y/x),-max*dt,max*dt);return x*Math.exp(d);};
// Jeden krok: x,y zobrazená poloha vlaštovky (m, se zrychlením), v,vy rychlost (m/s), t hodiny scény, dt krok, k tempo π, c cestovní rychlost
// výbavy (m/s, už × π), dive = střemhlav, f let (události, landed), best rekord v m (Place intro jen za ním), calm = Calm camera / reduced motion,
// aimW = šířka klidového záběru (m). Bez f (prototyp) není zámek ani vyhlídka. Vrací stejný objekt (mutuje).
// Šířka = opts.width · zoom (stav: vista, district, intro, landing) · ex (přebytek, tlumený asymetricky) / tz (tempo); výhoz ji prolne z klidového záběru.
export function direct(s,{x,y,v=0,vy=0,t,dt,flying,landed,f,k=1,c=CRUISE*k,dive=false,best,calm=false,flat=false,shake,aimW=POSE_REST.width}){
 landed=landed??!!f?.landed;const rest=!flying&&!landed,place=placeAt(x),lock=qteLock(f),ahead=nextEventIn(f),low=y!=null&&y<EXCESS.low&&vy<0;
 const thrown=flying&&s.thrownAt==null;s.cut=false;
 // výhoz z klidu: kamera odjede z klidového záběru (v Calm střih, s.cut pro prolnutí v rendereru)
 if(thrown){s.thrownAt=t;s.calmFrom=t;const from=s.camera&&s.state==='rest';s.launch=from&&!calm?{w:s.camera.width,py:s.camera.py,u:0}:null;s.cut=!!from&&calm;}
 if(rest){s.thrownAt=s.landedAt=null;s.shot=null;s.launch=null;}
 if(landed&&s.landedAt==null)s.landedAt=t;
 if(flying&&place!==s.place){s.place=place;s.at=t;s.title=placeTitle(place);
  if(s.title.first&&place>0){const d=lock?0:Math.min(DISTRICT.dur,ahead-MARGIN);s.shot='district';s.shotDur=d>=DISTRICT.min?d:0;}// koliduje-li s událostí, zkrátí se (případně jen název)
  else {s.shot='intro';s.shotDur=!lock&&(best==null||x>best)&&ahead>=PUNCH.dur+MARGIN?PUNCH.dur:0;}
  s.shotAt=t;}
 const age=s.at==null?null:t-s.at,sa=s.shotAt==null?null:t-s.shotAt,on=sa!=null&&sa<s.shotDur;s.alpha=titleAlpha(age);
 if(lock)s.calmFrom=t;s.lock=lock;
 let mult=1,px=0,yaw=0,roll=0,state='follow';
 if(landed){state='landing';mult=LANDING.zoom;}else if(rest){state='rest';mult=aimW/s.opts.width;}
 else if(on&&s.shot==='district'){state='district';mult=districtZoom(sa,s.shotDur);}
 else if(on&&s.shot==='intro'){state='intro';mult=punchZoom(sa);yaw=PUNCH.yaw*Math.sin(Math.PI*smooth(sa/s.shotDur));}
 else if(f&&!lock&&t-s.calmFrom>=VISTA.calm&&ahead>=(s.state==='vista'?VISTA.leave:VISTA.ahead)){state='vista';mult=VISTA.out;px=VISTA.px;}
 if(flying&&s.thrownAt!=null&&t-s.thrownAt<LAUNCH.dur)roll=LAUNCH.roll*Math.sin(Math.PI*smooth((t-s.thrownAt)/LAUNCH.dur));
 s.state=state;
 if(!lock||!s.camera){// v zámku stojí zoom, přebytek, tempo, px, natočení i svislý posun; kamera jen sleduje vlaštovku
  // Cíl přebytku drží mrtvé pásmo a hystereze; před událostí a u krátkého letu se neoddaluje. Při výhozu a v prvním snímku bez dojezdu.
  const raw=calm||!flying?1:excessZoom(excessOf(v,c),dive?1+EXCESS.dive:Infinity),d=Math.log(raw/s.exGoal),dir=Math.sign(d),snap=!s.camera||thrown||calm||rest;
  if(snap||!flying){s.exGoal=raw;s.exDir=0;s.exAt=t;}
  else if(Math.abs(d)>=Math.log1p(EXCESS.dead)&&!(dir>0&&(ahead<EXCESS.ahead||low))&&!(s.exDir&&dir!==s.exDir&&t-s.exAt<EXCESS.hyst)){s.exGoal=raw;s.exDir=dir;s.exAt=t;}
  const E=s.exGoal>s.ex?EASE.out:EASE.in;s.ex=snap?s.exGoal:toward(s.ex,s.exGoal,E.hl,dt,E.rate,true);
  // stavové záběry (vista, district, intro, landing) se násobí, celek za letu v ZOOM_RANGE·W_let·T
  const zg=rest?mult:calm?1:clamp(mult,ZOOM_RANGE[0]/s.ex,ZOOM_RANGE[1]/s.ex),tg=tempoZoom(k),pg=calm?REST.px:Math.max(Math.min(VISTA.minPx,tempoPx(k)*640),tempoPx(k)*640+px);
  if(!s.camera){s.px=pg;}if(!s.camera||thrown||calm){s.zoom=zg;s.tz=tg;}// první snímek a výhoz bez dojezdu (i v zámku); Calm: T(π) jen mezi hody
  s.zoom=toward(s.zoom,zg,.25,dt,ZOOM_RATE,true);s.tz=toward(s.tz,tg,.25,dt,ZOOM_RATE/2,true);s.px=toward(s.px,pg,.25,dt,PX_RATE,false);
  s.yaw=calm?0:rot(damp(s.yaw,yaw,.2,dt));s.roll=calm?0:rot(damp(s.roll,roll,.2,dt));}
 // Výhoz: postup u jen za letu; krátký let (nízko a klesá) ho zastaví a rovnou přijde záběr dopadu (01 §2.5 bod 3).
 const L=s.launch;if(L&&flying&&!low)L.u=Math.min(1,L.u+dt/LAUNCH.dur);
 const W=s.opts.width*s.zoom*s.ex/s.tz,e=L?launchEase(L.u):1,w=L?Math.exp(Math.log(L.w)+Math.log(W/L.w)*e):W;
 if(y!=null||f){const Y=rest?HAND.y:y??f.y,fp=followPy(Y,w);
  // svisle: v klidu ruka na REST.py, při výhozu plynule z ní do polohy letu (při šířce letu W), jinak dojezd posunu k nule
  if(rest)s.dy=REST.py-fp;else if(L)s.dy=L.py+(followPy(Y,W)-L.py)*e-fp;else if(thrown&&calm)s.dy=0;else if(!lock)s.dy=damp(s.dy,0,.3,dt);
  s.camera=shoot(s,x,Y,{calm,flat,shake,width:w});}
 if(L&&L.u>=1)s.launch=null;
 return s;
}
export const nextDirector=(prev,input)=>direct(structuredClone(prev),input);
// Svislá poloha vlaštovky jako render.view: zem 300 px, nad 190 px se kamera zvedá (vlaštovka zůstane na 110).
const followPy=(Y,w)=>300-Math.min(Math.max(0,Y)*640/w,190);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(c=>c/l);},addS=(a,b,k)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k];
function basis(c){const fw=norm(sub(c.target,c.position)),r0=norm(cross(fw,[0,1,0])),u0=cross(r0,fw),a=(c.roll??0)*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
 return {fw,r:[r0[0]*co+u0[0]*si,r0[1]*co+u0[1]*si,r0[2]*co+u0[2]*si],u:[u0[0]*co-r0[0]*si,u0[1]*co-r0[1]*si,u0[2]*co-r0[2]*si],th:Math.tan(c.fov*Math.PI/360)};}
// Perspektivní projekce bodu světa (m) do logických px 640×360 (fov svislý, aspect = šířka/výška obrazu).
export function project(camera,point,aspect=camera.aspect??16/9){const b=basis(camera),d=sub(point,camera.position),z=dot(d,b.fw);
 return {px:320*(1+dot(d,b.r)/(z*b.th*aspect)),py:180*(1-dot(d,b.u)/(z*b.th)),depth:z};}
// Záběr: orientace ze sideCamera (+ natočení yaw/roll), pak posun kamery v x/y světa tak, aby vlaštovka [X,Y,0] padla přesně na (s.px, py).
export function shoot(s,X,Y,{calm=false,flat=false,shake,width}={}){
 const o=s.opts,w=width??o.width*s.zoom*s.ex/s.tz,fov=calm&&flat?o.flatFov:o.fov,pitch=calm&&flat?0:o.pitch,v=follow(X,Y,{width:w,aspect:o.aspect,px:s.px/640}),c=sideCamera(v,fov,pitch);
 const ya=s.yaw*Math.PI/180,dir=sub(c.target,c.position),fw=[dir[0]*Math.cos(ya)-dir[2]*Math.sin(ya),dir[1],dir[0]*Math.sin(ya)+dir[2]*Math.cos(ya)];
 const cam={position:c.position,target:addS(c.position,fw,1),fov,roll:s.roll,aspect:o.aspect},ty=followPy(Y,w)+s.dy;
 // posun v rovině x/y světa (hloubka zůstane, jako pose.restCamera); kvůli sklonu pár iterací, konverguje na < 1e-9 px
 let P=cam.position,T=cam.target;const th=Math.tan(fov*Math.PI/360);
 for(let i=0;i<6;i++){const p=project({...cam,position:P,target:T},[X,Y,0]),dx=(p.px-s.px)*p.depth*th*o.aspect/320,dy=(ty-p.py)*p.depth*th/180*Math.cos(pitch*Math.PI/180);
  P=[P[0]+dx,P[1]+dy,P[2]];T=[T[0]+dx,T[1]+dy,T[2]];}
 return {cx:v.cx,cy:v.cy,width:w,height:w/o.aspect,lift:v.lift,position:P,target:T,fov,pitch,yaw:s.yaw,roll:s.roll,aspect:o.aspect,dist:c.dist,
  zoom:o.width/w,lock:s.lock,state:s.state,cut:s.cut,shake:calm||!shake?[0,0]:[shake[0],shake[1]],px:s.px,py:ty,flat:calm&&flat,title:s.title,alpha:s.alpha};
}
// Smlouva view(f) z kamery: cam = X·2,1 − px, k = logické px na světový px (2,1 px/m) v hloubce vlaštovky, ground = py země pod vlaštovkou.
export function cameraView(camera,X,Y){const p=project(camera,[X,Y,0]),q=project(camera,[X+1,Y,0]),g=project(camera,[X,0,0]);
 return {cam:X*PIXELS_PER_METER-p.px,px:p.px,py:p.py,ground:g.py,k:(q.px-p.px)/PIXELS_PER_METER};}
