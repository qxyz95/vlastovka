// 3D vykreslení hry (three.js). Vlastní integrátor, naplnil R1 ve fázi a1 (research/3d/01-plan-prevodu.md). Ztráta kontextu přijde v a6.
// Veřejné rozhraní je stejné jako 2D render.js, aby ui.js jen přepnul import (3D výchozí, ?render=2d nebo bez WebGL → 2D):
//   render(canvas,f,model,time,visual)  canvas = #game (2D UI vrstva, průhledná, drží posluchače; kreslí do ní ui-layer.js);
//                                       WebGL canvas #scene3d je jeho sourozenec v .scene (chybí-li, vytvoří se před #game). Vrací plan.
//   view(f)                             čistá funkce (žádné three.js), smí ji volat ui.js i juice.stepFx každým snímkem.
// Líná inicializace při prvním render(), resize podle canvas.clientWidth × DPR, ztráta/obnova kontextu, ?perf=1, window.__r3d (advance, snapshot, bench).
//
// ── Smlouva view(f) (plán §1.3) ──────────────────────────────────────────────────────────────────────────────
// Vrací {cam,px,py,ground,k} v logických px plátna 640×360 (stejně jako render.view):
//   X = f.x + PLANE_OFFSET  světová poloha vlaštovky v m (geometry.js: PLANE_OFFSET = 148/2,1; místo `screen` leží od chunkOffset(screen))
//   cam    = X·2,1 − px     pevná jednotka 2,1 px/m nezávislá na zoomu; v klidu px=148, takže cam = f.x·2,1 jako ve 2D
//   px,py  = poloha vlaštovky na obrazovce (logické px); ground = y čáry země (logické px)
//   k      = poměr měřítka: kolik logických px má 1 „světový px“ (2,1 px/m) v hloubce letu z=0 (1 = záběr 2D, < 1 oddálení)
//   částice a stopa z juice.js (světové px wx,wy) kreslí UI vrstva jako sx = px + (wx − cam − px)·k (y obdobně kolem py)
//   view(null) = {px:148, py:258} ±2 px (Dílna a míření; mířicí overlay v ui.js má pevné 148,258)
//   view nemutuje f a nezávisí na čase ani na stavu rendereru (determinismus fyziky).
//
// ── Tvar plan = planFrame(...) (frame.js, R1) ───────────────────────────────────────────────────────────────
// planFrame({f,model,time,visual,state,prev}) → plan; čistá, nemutuje vstup, stejný vstup = stejný plan. Aplikace (scene.js) ho jen zapíše.
//   plan.t        čas scény v s (za letu f.t, jinak visual.clock)
//   plan.state    'workshop' | 'aim' | 'flight' | 'landed'
//   plan.view     {cam,px,py,ground,k} = view(f) pro tento snímek (vč. zoomu kamery)
//   plan.X,plan.Y světová poloha vlaštovky v m
//   plan.camera   {cx,cy,width,height,lift,position:[x,y,z],target:[x,y,z],fov,zoom,lock,shake:[dx,dy]}  (camera.js R5; shake v logických px z fx-map)
//   plan.plane    {x,y,z,angle,roll,squash:[sx,sy],model,look,visible}           (pose.js R3, úhel = juice.flightAngle)
//   plan.kid      {pose,arm,charge,visible}                                       (pose.js R3, jen Dílna/míření)
//   plan.places   [{screen,index,district,x0}]  místa k zobrazení (x0 = chunkOffset(screen)); city.js streamuje nejvýš 1 nové za snímek
//   plan.mood     {sky:[...stops],fog:{color,near,far},hemi:{sky,ground,intensity},key,rim,sun,rain,night,hold}  (mood.js R4)
//   plan.comic    {levels,dotSize,halftone,bands,paletteId}                       (comic.js R4)
//   plan.events   [eventView(e,t)] pohled na aktivní události                     (events-view.js R2)
//   plan.fx       {shake,flash,speedLines,particles,popups,trail}                 (fx-map.js R2; reduced → nulové)
//   plan.ui       {qte,aim,labels,charge,uiScale}                                 (ui-layer.js R2 kreslí do #game)
//   plan.quality  stupeň kvality (quality.js, P)
//
// ── ctx čtvrti: districts[i].build(chunk,ctx) ──────────────────────────────────────────────────────────────
//   ctx = {scene, materials, ramp, hull, mood, reduced}
//   scene      THREE.Scene (jen pro čtení, např. scene.fog); build vrací THREE.Group v lokálních souřadnicích místa (x 0…SCREEN_METERS),
//              city.js ji přidá do skupiny místa posunuté o chunkOffset(screen); build nic nepřidává do scény sám
//   materials  sdílené materiály ze scene.js ({building,glow,sign(text,color,vertical),ground[biome],…}); čtvrť je nedisponuje
//   ramp       toon rampa (toon.toonRamp); hull = materiál obrysu (toon.outlineMaterial)
//   mood       plan.mood v okamžiku stavby; reduced = prefers-reduced-motion
//   chunk      = cityChunk(index) + {screen} (lokální bloky, cedule, lampy, zem)
// ── frameCtx: districts[i].update(group,frameCtx) ──────────────────────────────────────────────────────────
//   frameCtx = {t, X, Y, trail, events, comp, quality}
//   t          čas scény v s (při reduced motion zpomalený na 25 %, viz d2)
//   X,Y        světová poloha vlaštovky v m (jako plan.X/Y); lokálně odečti group.position.x
//   trail      historie letu life.createTrail() ({t,x,y} ve světových m) pro passTime/noticeAge/wake
//   events     plan.events; comp = life.companion(activeEvent(f),f.t) (holub, pára) nebo null
//   quality    plan.quality (LOD: čtvrť smí vynechat drobnosti)
// update volá city.js jen pro viditelná místa; nesmí alokovat geometrii každým snímkem.
import {planFrame,viewOf} from './frame.js';
import {createScene} from './scene.js';
import {drawUi} from './ui-layer.js';
import {frameStats} from '../perf.js';
import {createFlight,step,eventInput} from '../core.js';
const MAX_DPR=2;
let R=null;
export const view=f=>viewOf(f);
const dprNow=()=>Math.min(MAX_DPR,globalThis.devicePixelRatio||1);
function init(canvas){
 let gl=canvas.parentElement?.querySelector('#scene3d');if(!gl){gl=document.createElement('canvas');gl.id='scene3d';canvas.before(gl);}
 const s=createScene(gl,{dpr:dprNow()}),r={gl,s,plan:null,last:null,debug:null};
 const resize=()=>{s.resize(gl.clientWidth||640,gl.clientHeight||360,dprNow());if(r.plan){s.apply(r.plan);s.draw();}};
 r.ro=new ResizeObserver(resize);r.ro.observe(gl);s.resize(gl.clientWidth||640,gl.clientHeight||360,dprNow());s.city.prewarm([0,1]);
 window.__r3d={advance,bench,snapshot,reset,get plan(){return R?.plan;},get stats(){return R?.s.stats();},get scene(){return R?.s;}};
 return r;
}
// UI vrstva (ui-layer.js R2) v rozlišení podle CSS šířky × DPR (1–2× logického 640×360).
function drawLayer(canvas,plan,visual){
 const w=Math.round(640*Math.min(2,Math.max(1,(canvas.clientWidth||640)*dprNow()/640)));if(canvas.width!==w){canvas.width=w;canvas.height=w*9/16;canvas.style.imageRendering='auto';}
 drawUi(canvas.getContext('2d'),plan,visual);
}
export function render(canvas,f,model,time=0,visual={}){
 const r=R??=init(canvas),plan=planFrame({f,model,time,visual:{...visual,cssWidth:canvas.clientWidth||640},prev:r.plan});
 r.s.apply(plan);r.s.draw();drawLayer(canvas,plan,visual);r.plan=plan;r.last={canvas,f,model,time,visual};return plan;
}
// ── Ladění a měření (window.__r3d). Vlastní let ladění (seed z ?seed=, výchozí 1) hru neovlivní.
const seedQ=()=>+new URLSearchParams(globalThis.location?.search).get('seed')||1;
function reset(seed=seedQ(),model=R?.last?.model??'dart',levels){R.debug=createFlight(model,levels,seed);return R.debug;}
// advance(s, input): přetočí ladicí let o s sekund (input(f) → 'down'|'up'|null, např. autopilot) a vykreslí jeden snímek.
function advance(s=1,input=null){
 const f=R.debug??reset(),L=R.last??{};for(let i=0;i<Math.round(s*60)&&!f.landed;i++){const c=input?.(f);if(c)eventInput(f,c,'auto');step(f);}
 render(L.canvas,f,L.model??f.model,f.t,{...(L.visual??{}),fx:null,qte:null,clock:f.t});return {x:f.x,y:f.y,t:f.t,landed:f.landed};
}
// Snímek obrazovky: 3D + UI vrstva složené do PNG (překreslí aktuální plán, takže nepotřebuje preserveDrawingBuffer).
function snapshot(type='image/png'){
 const {gl,s,plan,last}=R;s.draw();const c=document.createElement('canvas');c.width=gl.width;c.height=gl.height;const g=c.getContext('2d');g.drawImage(gl,0,0);
 if(last?.canvas)g.drawImage(last.canvas,0,0,c.width,c.height);return c.toDataURL(type);
}
// bench(n): n snímků synchronně na kopii letu (seed 1, nebo kopie posledního letu), readPixels čeká na GPU. ms celkem a CPU zvlášť.
function bench(n=240,{seed=1,fromLast=false}={}){
 const L=R.last??{},f=fromLast&&L.f&&!L.f.landed?structuredClone(L.f):createFlight(L.model??'dart',undefined,seed),ctx=R.s.renderer.getContext(),px=new Uint8Array(4),all=[],cpu=[];let calls=0,tris=0;
 for(let i=0;i<n;i++){const t0=performance.now();if(!f.landed)step(f);const plan=planFrame({f,model:f.model,time:f.t,visual:{clock:f.t}});R.s.apply(plan);R.s.draw();const t1=performance.now();
  ctx.readPixels(0,0,1,1,ctx.RGBA,ctx.UNSIGNED_BYTE,px);const t2=performance.now();if(i>=10){all.push(t2-t0);cpu.push(t1-t0);}const st=R.s.stats();calls=Math.max(calls,st.calls);tris=Math.max(tris,st.triangles);}
 if(R.plan){R.s.apply(R.plan);R.s.draw();}
 const a=frameStats(all),c=frameStats(cpu),r2=v=>+v.toFixed(2),st=R.s.stats();
 return {frames:a.n,avg:r2(a.avg),p95:r2(a.p95),cpu:r2(c.avg),cpuP95:r2(c.p95),calls,tris,size:st.size,dpr:st.dpr,post:st.post,distance:Math.round(f.x)};
}
