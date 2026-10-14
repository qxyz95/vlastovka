// 3D vykreslení hry (three.js), výchozí renderer hry od a5. Vlastní integrátor, jádro naplnil R1 ve fázi a1 (research/3d/01-plan-prevodu.md).
// Veřejné rozhraní je stejné jako 2D render.js, aby ui.js jen přepnul import (3D výchozí, ?render=2d nebo bez WebGL → 2D):
//   render(canvas,f,model,time,visual)  canvas = #game (2D UI vrstva, průhledná, drží posluchače; kreslí do ní ui-layer.js);
//                                       WebGL canvas #scene3d je jeho sourozenec v .scene (chybí-li, vytvoří se před #game). Vrací plan.
//   view(f)                             bez three.js, smí ji volat ui.js i juice.stepFx každým snímkem: za letu krok režiséra z posledního plánu
//                                       (= plan.view snímku, který render s týmž f nakreslí), bez vykresleného plánu čisté viewOf(f).
//   visual                              {state ('workshop'|'aim'|'flight'|'result'), aim {angle,held,charge}, best, reduced, fx, qte, charge, clock, settings}
// Líná inicializace při prvním render(), resize podle canvas.clientWidth × DPR, window.__r3d (advance, snapshot, bench, lose, restore).
// a6: ztráta kontextu → hra a UI vrstva běží dál, pod nimi gradient z plan.mood; obnova postaví scénu znovu. V Dílně a při míření
// předehřátí (stavba dalších míst po jednom za snímek + renderer.compile). Dílna a výsledek 30 fps, skrytá záložka nekreslí. ?perf=1 = panel ms/snímek.
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
import {planFrame,viewOf,directorFor,planeWorld} from './frame.js';
import {cameraView} from './camera.js';
import {createScene} from './scene.js';
import {drawUi} from './ui-layer.js';
import {INK,PAPER,NIGHT,CYAN,BODY} from './palette.js';
import {frameStats,ring} from '../perf.js';
import {createFlight,step,eventInput} from '../core.js';
const MAX_DPR=2,SLOW=1000/30-2,WARM=[2,3,4,5];
let R=null;
// Za letu stejný krok režiséra, jaký udělá render(f) (planFrame s prev = poslední plán); po dopadu kamera posledního snímku.
export function view(f){const p=R?.plan;if(!f||!p||p.state==='aim'||p.state==='workshop')return viewOf(f);
 const [X,Y]=planeWorld(f);return cameraView(f.landed?p.camera:directorFor({f,prev:p,time:f.t,visual:R.last?.visual}).camera,X,Y);}
const dprNow=()=>Math.min(MAX_DPR,globalThis.devicePixelRatio||1);
const query=k=>new URLSearchParams(globalThis.location?.search).get(k);
function init(canvas){
 let gl=canvas.parentElement?.querySelector('#scene3d');if(!gl){gl=document.createElement('canvas');gl.id='scene3d';canvas.before(gl);}
 const r={gl,s:null,plan:null,last:null,debug:null,lost:false,warm:0,drawn:0,ext:null,timer:query('timer')!=null};
 const size=()=>[gl.clientWidth||640,gl.clientHeight||360];
 const build=()=>{r.s=createScene(gl,{dpr:dprNow()});r.s.resize(...size(),dprNow());r.s.city.prewarm([0,1]);r.warm=0;r.ext=r.s.renderer.getContext().getExtension('WEBGL_lose_context');};
 build();r.perf=query('perf')==='1'?perfPanel(canvas):null;
 r.ro=new ResizeObserver(()=>{if(r.lost)return;r.s.resize(...size(),dprNow());if(r.plan){r.s.apply(r.plan);r.s.draw();}});r.ro.observe(gl);
 // Ztráta kontextu: three.js přestane kreslit, hra jede dál s gradientem pod UI. Obnova: stará scéna pryč, nová na stejném plátně.
 gl.addEventListener('webglcontextlost',e=>{e.preventDefault();r.lost=true;});
 gl.addEventListener('webglcontextrestored',()=>{try{r.s.dispose();}catch{}build();r.lost=false;if(r.plan){r.s.apply(r.plan);r.s.draw();}});
 window.__r3d={advance,bench,snapshot,reset,lose:()=>r.ext?.loseContext(),restore:()=>r.ext?.restoreContext(),get plan(){return R?.plan;},get stats(){return R?.s.stats();},get scene(){return R?.s;},get lost(){return R?.lost;}};
 return r;
}
// UI vrstva (ui-layer.js R2) v rozlišení podle CSS šířky × DPR (1–2× logického 640×360). Bez kontextu WebGL pod ní gradient z nálady.
function drawLayer(canvas,plan,visual,lost){
 const w=Math.round(640*Math.min(2,Math.max(1,(canvas.clientWidth||640)*dprNow()/640)));if(canvas.width!==w){canvas.width=w;canvas.height=w*9/16;canvas.style.imageRendering='auto';}
 const c=canvas.getContext('2d');if(lost){backdrop(c,plan.mood,w/640,plan);plan={...plan,ui:{...plan.ui,clear:false}};}drawUi(c,plan,visual);
}
// Nouzové pozadí: pásy oblohy (mood.sky shora k obzoru) přechodem, obzor na 300/360 jako ve 2D, pod ním zem ztmaveným tónem mlhy.
export function backdrop(c,mood,s=1,plan=null){
 c.setTransform(s,0,0,s,0,0);const g=c.createLinearGradient(0,0,0,300),sky=mood?.sky??['#3a2a7a','#ff9ec4'];sky.forEach((col,i)=>g.addColorStop(i/(sky.length-1),col));
 c.fillStyle=g;c.fillRect(0,0,640,300);c.fillStyle=mood?.fog?.color??'#2a1d44';c.fillRect(0,300,640,60);c.fillStyle='#00000088';c.fillRect(0,300,640,60);
 // vlaštovka jako bílá silueta (úhel jako ve 2D: kladný = nos dolů), aby let šel sledovat i bez 3D
 const v=plan?.view,a=plan?.plane;if(v&&(a?.visible||plan.hand)){c.translate(v.px,v.py);c.rotate(a?.visible?a.angle:-.15);c.fillStyle=PAPER;c.strokeStyle=INK;c.lineWidth=2;c.beginPath();c.moveTo(16,0);c.lineTo(-14,-7);c.lineTo(-8,0);c.lineTo(-14,6);c.closePath();c.fill();c.stroke();}
 c.setTransform(1,0,0,1,0,0);
}
const idle=state=>state==='workshop'||state==='result';
// Předehřátí v klidu: nejvýš 1 další místo za snímek (WARM), nakonec jednou kompilace shaderů (i skrytých objektů).
function warmStep(r){if(r.warm>WARM.length||r.lost)return;if(r.warm<WARM.length)r.s.city.prewarm([WARM[r.warm]]);else r.s.warm();r.warm++;}
export function render(canvas,f,model,time=0,visual={},force=false){
 const r=R??=init(canvas),now=performance.now();r.last={canvas,f,model,time,visual};
 if(!force&&globalThis.document?.hidden&&!r.timer)return r.plan;// skrytá záložka nekreslí (kromě ?timer pro ověření ve skrytém okně)
 if(!force&&idle(visual.state)&&r.plan&&now-r.drawn<SLOW)return r.plan;// Dílna a výsledek 30 fps
 const plan=planFrame({f,model,time,visual:{...visual,cssWidth:canvas.clientWidth||640},prev:r.plan});
 if(!r.lost){const t0=performance.now();r.s.apply(plan);r.s.draw();r.perf?.cpu.push(performance.now()-t0);if(plan.state==='aim'||plan.state==='workshop')warmStep(r);}
 drawLayer(canvas,plan,visual,r.lost);r.perf?.frame(now,r);r.drawn=now;r.plan=plan;return plan;
}
// ?perf=1: panel s ms/snímek (interval mezi snímky), CPU (apply + draw bez čekání na GPU), draw calls a trojúhelníky.
function perfPanel(canvas){
 const el=document.createElement('pre');el.id='perf3d';el.style.cssText=`position:absolute;right:8px;top:64px;margin:0;padding:6px 8px;background:${NIGHT}cc;color:${CYAN};font:11px/1.35 ${BODY};font-variant-numeric:tabular-nums;pointer-events:none;z-index:2`;
 canvas.parentElement?.append(el);const iv=ring(240),cpu=ring(240);let prev=0,shown=0;
 return {el,iv,cpu,frame(now,r){if(prev&&now-prev<250)iv.push(now-prev);prev=now;if(now-shown<500)return;shown=now;const a=frameStats(iv.values),c=frameStats(cpu.values),st=r.s.stats();
  el.textContent=`3D ${st.size} dpr ${st.dpr}${r.lost?' LOST':''}\nframe ${a.avg.toFixed(1)} ms (p95 ${a.p95.toFixed(1)}) ${a.avg?(1000/a.avg).toFixed(0):0} fps\ncpu ${c.avg.toFixed(2)} ms (p95 ${c.p95.toFixed(2)})\ncalls ${st.calls} tris ${(st.triangles/1000).toFixed(1)}k`;}};
}
// ── Ladění a měření (window.__r3d). Vlastní let ladění (seed z ?seed=, výchozí 1) hru neovlivní.
const seedQ=()=>+new URLSearchParams(globalThis.location?.search).get('seed')||1;
function reset(seed=seedQ(),model=R?.last?.model??'dart',levels){R.debug=createFlight(model,levels,seed);return R.debug;}
// advance(s, input): přetočí ladicí let o s sekund (input(f) → 'down'|'up'|null, např. autopilot) a vykreslí jeden snímek.
function advance(s=1,input=null){
 const f=R.debug??reset(),L=R.last??{};for(let i=0;i<Math.round(s*60)&&!f.landed;i++){const c=input?.(f);if(c)eventInput(f,c,'auto');step(f);}
 render(L.canvas,f,L.model??f.model,f.t,{...(L.visual??{}),state:f.landed?'result':'flight',aim:null,fx:null,qte:null,clock:f.t},true);return {x:f.x,y:f.y,t:f.t,landed:f.landed};
}
// Snímek obrazovky: 3D + UI vrstva složené do PNG (překreslí aktuální plán, takže nepotřebuje preserveDrawingBuffer).
function snapshot(type='image/png'){
 const {gl,s,plan,last}=R;if(!R.lost)s.draw();const c=document.createElement('canvas');c.width=gl.width;c.height=gl.height;const g=c.getContext('2d');g.drawImage(gl,0,0);
 if(last?.canvas)g.drawImage(last.canvas,0,0,c.width,c.height);return c.toDataURL(type);
}
// bench(n): n snímků synchronně na kopii letu (seed 1, nebo kopie posledního letu), readPixels čeká na GPU. ms celkem a CPU zvlášť.
function bench(n=240,{seed=1,fromLast=false}={}){
 const L=R.last??{},f=fromLast&&L.f&&!L.f.landed?structuredClone(L.f):createFlight(L.model??'dart',undefined,seed),ctx=R.s.renderer.getContext(),px=new Uint8Array(4),all=[],cpu=[];let calls=0,tris=0;
 let prev=null;for(let i=0;i<n;i++){const t0=performance.now();if(!f.landed)step(f);const plan=prev=planFrame({f,model:f.model,time:f.t,visual:{clock:f.t,state:'flight'},prev});R.s.apply(plan);R.s.draw();const t1=performance.now();
  ctx.readPixels(0,0,1,1,ctx.RGBA,ctx.UNSIGNED_BYTE,px);const t2=performance.now();if(i>=10){all.push(t2-t0);cpu.push(t1-t0);}const st=R.s.stats();calls=Math.max(calls,st.calls);tris=Math.max(tris,st.triangles);}
 if(R.plan){R.s.apply(R.plan);R.s.draw();}
 const a=frameStats(all),c=frameStats(cpu),r2=v=>+v.toFixed(2),st=R.s.stats();
 return {frames:a.n,avg:r2(a.avg),p95:r2(a.p95),cpu:r2(c.avg),cpuP95:r2(c.p95),calls,tris,size:st.size,dpr:st.dpr,post:st.post,distance:Math.round(f.x)};
}
