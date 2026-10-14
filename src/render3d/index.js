// 3D vykreslení hry (three.js). Vlastní integrátor. Kostra fáze 0 z research/3d/01-plan-prevodu.md, implementace přijde ve fázi a1/a5.
// Veřejné rozhraní je stejné jako 2D render.js, aby ui.js jen přepnul import (3D výchozí, ?render=2d nebo bez WebGL → 2D):
//   render(canvas,f,model,time,visual)  canvas = #scene3d (WebGL); 2D UI kreslí ui-layer.js do #game (průhledný, drží posluchače).
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
const todo=who=>{throw new Error(`render3d: ${who} zatím neimplementováno`);};
export function view(f){return todo('view (integrátor, a1)');}
export function render(canvas,f,model,time=0,visual={}){return todo('render (integrátor, a1/a5)');}
