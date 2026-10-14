import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {PAPIR,PAPER_TOKENS,palette} from '../src/render3d/palette.js';
import {PAPER_KEYS} from '../src/render3d/mood.js';
import {PAPER_TRAIL,ID} from '../src/render3d/paper-cards.js';
import {drawUi,drawQte,drawLabel,drawPopups,drawSpeedLines,drawParticles,drawAim,QTE_BASE,QTE_STAR} from '../src/render3d/ui-layer.js';
import {gustStrips,scrapAngle,scrapTone,particles,GUST} from '../src/render3d/fx-map.js';
import {createFx,fxEvent,stepFx} from '../src/juice.js';
import {HAND,kidPose} from '../src/render3d/pose.js';

// P3 „Hrdina“ Papírového města (spec research/design/06-papir-ctvrt1.md, bible 05 kap. 3, 7, 9, 11, stíny 08-stiny.md S4).
// three.js moduly: holý import 'three' na vendorovaný build (jako import map v prohlížeči); plátno cedulky nahrazeno záznamem volání.
const THREE_URL=new URL('../vendor/three/three.module.min.js',import.meta.url).href;
registerHooks({resolve:(spec,ctx,next)=>spec==='three'?{url:THREE_URL,shortCircuit:true}:next(spec,ctx)});
const drawn=[];
globalThis.document??={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({},{get:(_,k)=>k==='fillText'?(...a)=>drawn.push(a[0]):()=>{},set:()=>true})})};
const THREE=await import('three');
const {createPlane,planeColors,PLANE_SCALE}=await import('../src/render3d/plane.js');
const {createWorkshop,PAPER_SIGN,paperSignTexture}=await import('../src/render3d/workshop.js');
const {paperKit,MASK_LAYER}=await import('../src/render3d/paper.js');

const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const L=h=>{const [r,g,b]=rgb(h).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const mixHex=(a,b,k)=>'#'+rgb(a).map((v,i)=>Math.round(v+(rgb(b)[i]-v)*k).toString(16).padStart(2,'0')).join('');
const hex=c=>'#'+c.getHexString();

function fakeCtx(width=1280){
 const ops=[],stack=[];let m=[1,0,0,1,0,0];
 const st={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,globalAlpha:1,font:'10px sans-serif',textAlign:'start',textBaseline:'alphabetic',lineCap:'butt',lineJoin:'miter',shadowColor:'rgba(0,0,0,0)',shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,dash:[]};
 const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
 const rec=name=>(...args)=>{ops.push({name,args,style:{...st,dash:[...st.dash]},m:[...m]});};
 const c={canvas:{width,height:width*9/16},ops,
  save(){stack.push({st:{...st,dash:[...st.dash]},m:[...m]});rec('save')();},restore(){const s=stack.pop();if(s){Object.assign(st,s.st);m=s.m;}rec('restore')();},
  setTransform(a,b,cc,d,e,f){m=[a,b,cc,d,e,f];rec('setTransform')(a,b,cc,d,e,f);},translate(x,y){m=mul(m,[1,0,0,1,x,y]);rec('translate')(x,y);},
  rotate(a){m=mul(m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);rec('rotate')(a);},getTransform(){const [a,b,cc,d,e,f]=m;return {a,b,c:cc,d,e,f};},
  setLineDash(d){st.dash=[...d];rec('setLineDash')(d);},measureText:t=>({width:String(t).length*6})};
 for(const n of ['beginPath','arc','stroke','fill','fillRect','strokeRect','clearRect','moveTo','lineTo','closePath','fillText','strokeText'])c[n]=rec(n);
 for(const k of Object.keys(st))if(k!=='dash')Object.defineProperty(c,k,{get:()=>st[k],set:v=>{st[k]=v;}});
 return c;
}
const view={cam:0,px:148,py:200,ground:300,k:1},zones={success:[.4,.7],perfect:[.5,.6]};
const strip=c=>c.ops.map(o=>[o.name,o.args.map(a=>typeof a==='number'?+a.toFixed(4):a),o.style.fillStyle,o.style.strokeStyle,o.style.lineWidth,+o.style.globalAlpha.toFixed(4)]);
const planeCtx=(palette,extra={})=>({planeHull:new THREE.MeshBasicMaterial(),palette,scale:PLANE_SCALE,...extra});

// ── Vlaštovka a stopa (plane.js)
test('P3 plane: paper fill = vertex colours without light (up = paper, keel and undersides = planeUnder), graphite 2.6 px outline in the palette',()=>{
 const kit=paperKit(),pl=createPlane(planeCtx(PAPIR,{shadows:kit.shadows})),p=pl.current,m=p.mesh.material;
 assert.ok(m.isMeshBasicMaterial&&m.vertexColors&&m.fog===false,'no lighting, no fog');assert.equal(p.mesh.castShadow,false,'no three.js shadow map');
 const n=p.mesh.geometry.attributes.normal.array,col=p.mesh.geometry.attributes.color.array,fill=new THREE.Color(PAPIR.plane.fill),under=new THREE.Color(PAPIR.plane.under);
 let up=0,down=0;for(let i=0;i<n.length/3;i++){const want=(n[i*3+1]>.3?fill:under).toArray();for(let j=0;j<3;j++)assert.ok(Math.abs(col[i*3+j]-want[j])<1e-6,`vertex ${i}`);n[i*3+1]>.3?up++:down++;}
 assert.ok(up>0&&down>0,'both faces present');
 assert.equal(PAPIR.plane.outline,PAPER_TOKENS.graphite);assert.equal(PAPIR.plane.outlinePx,2.6);assert.deepEqual(PAPIR.plane.crease,[PAPER_TOKENS.pencil,PAPER_TOKENS.pencil]);
 pl.dispose();kit.dispose();
});

test('P3 plane: S4 shadow = castPlane of the plane geometry as a child of the mesh (mask layer only, follows model changes, nothing per frame)',()=>{
 const kit=paperKit(),pl=createPlane(planeCtx(PAPIR,{shadows:kit.shadows})),p=pl.current,sh=p.shadow;
 assert.ok(sh,'shadow caster');assert.equal(sh.parent,p.mesh,'child of the plane mesh (inherits matrixWorld, hides with it)');assert.equal(sh.geometry,p.mesh.geometry,'shared geometry');
 assert.equal(sh.material,kit.shadows.materials.plane,'plane mask material (exp fade with height)');assert.ok(sh.layers.isEnabled(MASK_LAYER)&&!sh.layers.isEnabled(0),'only in the mask pass');
 pl.apply({x:0,y:30,angle:0,model:'glider'},{flying:true});const q=pl.current;assert.notEqual(q,p);assert.equal(q.shadow.parent,q.mesh);assert.equal(sh.parent,null,'old caster removed');
 for(let i=0;i<5;i++)pl.apply({x:i,y:30,angle:0,model:'glider'},{flying:true});assert.equal(pl.current.shadow,q.shadow,'same caster every frame');
 // bez sady stínů (kvalita bez scény) žádný vrhač
 assert.equal(createPlane(planeCtx(PAPIR)).current.shadow,null);
 pl.dispose();kit.dispose();
});

test('P3 plane: scale × plan.plane.scale (length by the shot width, S3; +15 % narrow)',()=>{
 const pp=createPlane(planeCtx(PAPIR));pp.apply({x:0,y:30,angle:0,scale:1.15},{flying:true});assert.ok(Math.abs(pp.current.root.scale.x-PLANE_SCALE*1.15)<1e-9);
 pp.apply({x:1,y:30,angle:0},{flying:true});assert.equal(pp.current.root.scale.x,PLANE_SCALE,'missing scale = 1');
 pp.apply({x:0,y:30,angle:0,scale:.5},{flying:true});assert.equal(pp.current.root.scale.x,PLANE_SCALE*.5);
});

test('P3 trail: graphite pencil dashes (1.5 m of 2.4 m along the path, fixed in the world), half width max(0.22 m, 1.1 CSS px), no edge, alpha 0.85·√k',()=>{
 const pl=createPlane(planeCtx(PAPIR)),tr=pl.trail,u=tr.uniforms,geo=tr.mesh.geometry;
 assert.equal(u.dash.value,PAPER_TRAIL.dash);assert.equal(u.period.value,PAPER_TRAIL.period);assert.equal(u.minPx.value,PAPER_TRAIL.minPx);
 assert.deepEqual([PAPER_TRAIL.dash,PAPER_TRAIL.period,PAPER_TRAIL.half,PAPER_TRAIL.minPx,PAPER_TRAIL.alpha],[1.5,2.4,.22,1.1,.85]);
 assert.equal(hex(u.core.value),PAPIR.trail[0]);assert.ok(!('edge' in u),'no edge');
 const fs=tr.mesh.material.fragmentShader;assert.match(fs,/discard/);assert.doesNotMatch(fs,/edge/,'no ink edge in the paper trail');
 const buf=geo.attributes.dist.array;for(let i=0;i<30;i++)pl.apply({x:i*2,y:30,angle:0},{flying:true,trailColor:PAPIR.trail[0]});
 assert.equal(geo.attributes.dist.array,buf,'fixed buffers');
 const n=tr.points.length,d=geo.attributes.dist.array,a=geo.attributes.alpha.array,h=geo.attributes.halfW.array;
 for(let i=1;i<n;i++)assert.ok(d[i*2]>d[(i-1)*2],'distance grows along the trail');
 assert.ok(Math.abs(a[(n-1)*2]-.85)<1e-6);assert.ok(Math.abs(a[Math.floor(n/2)*2]-.85*Math.sqrt(Math.floor(n/2)/(n-1)))<1e-6);for(let i=0;i<n;i++)assert.ok(Math.abs(h[i*2]-.22)<1e-6);
 const before=d[(n-1)*2];pl.apply({x:60,y:30,angle:0},{flying:true});assert.ok(Math.abs(geo.attributes.dist.array[(tr.points.length-1)*2]-before-2)<1e-6,'dash phase keeps the odometer');
 for(let i=0;i<5;i++)pl.apply({x:60,y:30,angle:0},{flying:false});assert.equal(tr.points.length,n+1-5,'landing shortens the trail');
 assert.equal(geo.attributes.dist.array[0],tr.points[0][2],'dashes stay in the world when old points drop');
 pl.apply({x:0,y:30,angle:0},{flying:true});assert.equal(tr.points.length,1,'new throw resets');assert.equal(tr.points[0][2],0,'odometer reset');
});

test('P3 contrast: graphite outline and trail ≥ 3 : 1 against every sky stop and the haze of district 1 (hex; pixels NOT ASSESSED here)',()=>{
 const G=PAPER_TOKENS.graphite;
 for(const k of PAPER_KEYS.slice(0,4)){assert.equal(k.trail,G);for(const s of [...k.sky,k.haze.low,k.haze.high])assert.ok(ratio(G,s)>=3,`${k.name}: ${G} × ${s} = ${ratio(G,s).toFixed(2)}`);}
});

// ── Dílna (workshop.js)
test('S4 launch site tokens (06 bod 6, bible 05 kap. 9.4–9.5): coat #f2b65a, kraft cap with tomato band, navy rail, frames and legs, cream knob, pencil strings',()=>{
 const W=PAPIR.workshop,D1=palette('papir').city.districts[0];
 assert.equal(W.shirt,'#f2b65a');assert.equal(W.shirt,D1.near[1]);assert.equal(W.visor,PAPER_TOKENS.kraft);assert.equal(W.capBand,PAPER_TOKENS.tomato);
 for(const k of ['rail','frame','door','legs'])assert.equal(W[k],'#3d4f7a',k);assert.equal(W.knob,PAPER_TOKENS.cream);assert.equal(W.string,PAPER_TOKENS.pencil);
 assert.ok(![W.shirt,W.visor,W.rail,W.knob,W.string].some(c=>c===PAPER_TOKENS.mustard||c===PAPER_TOKENS.paper||c===PAPER_TOKENS.graphite),'no mustard, white or graphite next to the plane');
 // cedulka PAPER LAB: textura v poměru stran karty H2 (5,6 × 0,6 m), nápis a podtržení
 drawn.length=0;const tx=paperSignTexture(PAPER_SIGN.text);assert.ok(drawn.includes('PAPER LAB'));assert.ok(Math.abs(tx.image.width/tx.image.height-PAPER_SIGN.w/PAPER_SIGN.h)<.1);tx.dispose();
});

test('S4/H2 workshop: kid C + flag one dynamic mesh (kidMaterial on the shared kit uniforms), sign texture, plane in hand at 12 m stamped in graphite, no card casters',()=>{
 const kit=paperKit(),g=createWorkshop(null,{paper:kit,planeScale:PLANE_SCALE});
 const meshes=[],casters=[];g.traverse(o=>{if(o.userData.shadow)casters.push(o);else if(o.isMesh)meshes.push(o);});
 const hero=meshes.filter(m=>m.material.uniforms?.Lk);assert.equal(hero.length,1,'kid + flag = 1 draw call');assert.equal(g.userData.kid,hero[0]);
 assert.equal(hero[0].material.uniforms.cut,kit.uniforms.cut,'shared kit uniforms (mood, fibre)');assert.equal(hero[0].userData.layer,ID.near);
 assert.equal(casters.length,1,'only the plane in hand casts (kid shadow is a proxy in the place mask)');assert.ok(casters.every(c=>c.layers.isEnabled(MASK_LAYER)));
 const sign=meshes.find(m=>m.material.map);assert.ok(sign&&Math.abs(sign.geometry.parameters.width-PAPER_SIGN.w)<1e-9,'paper sign texture on the H2 card');
 assert.deepEqual([sign.position.x,sign.position.y,sign.position.z].map(v=>+v.toFixed(6)),[PAPER_SIGN.x,PAPER_SIGN.y,PAPER_SIGN.z].map(v=>+v.toFixed(6)));
 const own=g.children.filter(o=>o.isMesh);assert.equal(own.length,2,'launch site group: hero + sign (plane in hand is the player, counted to the scene)');
 const pm=g.userData.plane.getObjectsByProperty('isMesh',true).find(m=>m.material.isMeshBasicMaterial&&m.material.vertexColors);
 assert.ok(pm,'plane in hand: vertex colours');assert.ok(pm.children.some(c=>c.material===kit.shadows.materials.plane),'caster under the hand plane');
 const outl=g.userData.outlines;assert.equal(outl.length,1,'only the plane is outlined');assert.equal(hex(outl[0].uniforms.color.value),PAPER_TOKENS.graphite);assert.equal(outl[0].userData.base,2.6);
 assert.ok(meshes.every(m=>!m.material.isMeshToonMaterial),'no toon');
 const sq=g.userData.plane.children[0].children[0];
 g.update(null,{dx:0,dy:0,angle:0,squash:[1,1],scale:1.15});assert.ok(Math.abs(sq.scale.z-PLANE_SCALE*1.15)<1e-9,'plan.hand.scale');
 g.update(null,{dx:0,dy:0,angle:0,squash:[1,1],model:'glider'});assert.equal(pm.children[0].geometry,pm.geometry,'caster follows the model');
 assert.deepEqual([g.userData.plane.position.x,g.userData.plane.position.y],[HAND.x,12],'plane in hand at the physics height');
 // pózy: dlaň drží vlaštovku (i stažení při nabíjení), po hodu švih a mávání; poloha se přepisuje v témže bufferu (bez nové geometrie)
 const pos=hero[0].geometry.attributes.position,arr=pos.array,v0=pos.version,rig=g.userData.rig;
 g.update(kidPose({charge:1,rest:true}),{dx:-.246,dy:0,angle:0,squash:[1,1]});// stažení vlaštovky při charge 1 na 1280 px (pose.planePose)
 assert.ok(Math.hypot(rig.last[2]-(HAND.x-.246),rig.last[3]-12,rig.last[5]-HAND.z)<=.05,'palm T on the pulled-back plane (≤ 5 cm)');
 g.update(kidPose({thrown:true,rest:false,since:2,t:1}),null,{t:1});assert.equal(g.userData.plane.visible,false);assert.ok(rig.palms[4]>rig.last[1],'waving hand F above the shoulder');
 assert.equal(pos.array,arr);assert.ok(pos.version>v0,'positions uploaded');
 g.dispose();kit.dispose();
 const solo=createWorkshop(null,{});let n=0;solo.traverse(o=>{if(o.userData.shadow)n++;});assert.equal(n,0);solo.dispose();
});

// ── UI vrstva (ui-layer.js, fx-map.js)
test('P3 QTE: cream annulus 0.95 with a lifted-paper shadow, arcs 6 / 9 / 11 px, graphite dot, tomato star on the perfect zone, centre stays free',()=>{
 const c=fakeCtx(1280);c.setTransform(2,0,0,2,0,0);drawQte(c,{type:'bird',phase:'interaction',progress:.25,zones,held:true},view,0,false,PAPIR);
 const base=c.ops.find(o=>o.name==='fill');assert.equal(base.style.fillStyle,PAPIR.qte.disc);assert.ok(Math.abs(base.style.globalAlpha-.95)<1e-9);
 assert.equal(base.style.shadowColor,'rgba(40,25,10,0.35)');assert.equal(base.style.shadowBlur,8,'4 px × canvas scale');assert.deepEqual([base.style.shadowOffsetX,base.style.shadowOffsetY],[6,6]);
 const arcs=c.ops.filter(o=>o.name==='arc');assert.deepEqual(arcs.slice(0,2).map(o=>o.args[2]),[30+QTE_BASE,30-QTE_BASE],'annulus, hole in the middle');
 const st=c.ops.filter(o=>o.name==='stroke').map(o=>[o.style.strokeStyle,o.style.lineWidth,o.style.shadowBlur]);
 assert.deepEqual(st.slice(0,3),[[PAPIR.qte.track,6,0],[PAPIR.qte.success,9,0],[PAPIR.qte.perfect,11,0]],'arcs without shadow');
 const si=c.ops.findIndex(o=>o.name==='fill'&&o.style.fillStyle===PAPIR.qte.perfect),di=c.ops.findLastIndex(o=>(o.name==='fillRect'||o.name==='fill')&&o.style.fillStyle===PAPIR.qte.dot);
 assert.ok(si>0,'star');assert.ok(di>si,'dot on top of the star');assert.equal(c.ops[si-1].style.strokeStyle,PAPIR.qte.disc,'cream cut edge around the star');
 const sx=c.ops.filter(o=>o.name==='moveTo'||o.name==='lineTo').map(o=>Math.hypot(o.args[0]-view.px,o.args[1]-view.py));
 assert.ok(sx.length===10&&sx.every(r=>r>=30-QTE_STAR-1e-9&&r<=30+QTE_STAR+1e-9),'star sits on the ring, not over the plane');
});

test('P3 QTE contrast (bible 05 kap. 11): track, success, perfect and dot ≥ 3 : 1 on the cream disc mixed with the lightest and darkest sky of district 1',()=>{
 const k=PAPIR.qte,sky=PAPER_KEYS[0].sky;
 for(const bg of sky.map(s=>mixHex(s,k.disc,k.discAlpha)))for(const [n,c] of [['track',k.track],['success',k.success],['perfect',k.perfect],['dot',k.dot]])
  assert.ok(ratio(c,bg)>=3,`${n} ${c} × ${bg} = ${ratio(c,bg).toFixed(2)}`);
 assert.ok(ratio(k.warning,k.disc)>=3);
});

test('P3 gust: wavy cream strips with a graphite edge left of the plane, drifting; static with reduced motion',()=>{
 const s=gustStrips(148,200,.1),r=gustStrips(148,200,.1,true);assert.equal(s.length,GUST.n);assert.equal(s[0].length,GUST.points);
 for(const t of [0,.1,.2,.3])assert.ok(gustStrips(148,200,t).flat().every(([x,y])=>x>=148-70&&x<=148-12&&Math.abs(y-200)<30),'left of the plane, never over it');
 assert.notDeepEqual(gustStrips(148,200,.2),s,'moves');assert.deepEqual(gustStrips(148,200,.7,true),r,'reduced = static');
 const c=fakeCtx();drawQte(c,{type:'gust',phase:'interaction',progress:.2,zones},view,.1,false,PAPIR);
 const st=c.ops.filter(o=>o.name==='stroke').slice(0,2).map(o=>[o.style.strokeStyle,o.style.lineWidth]);assert.deepEqual(st,[[PAPIR.qte.gustEdge,4],[PAPIR.qte.gust,2]]);
 assert.ok(!c.ops.some(o=>o.name==='fillRect'&&o.style.fillStyle===PAPIR.qte.gust),'strips, not dashes');
});

test('P3 labels and popups: graphite tape −2° with cream text; popups as cream paper tags tilted ±1.5° with a lift shadow, text in the role colour',()=>{
 const c=fakeCtx();drawLabel(c,{label:'GUST!',age:0},view,PAPIR);const r=c.ops.find(o=>o.name==='rotate');assert.ok(Math.abs(r.args[0]+2*Math.PI/180)<1e-12);
 const rect=c.ops.find(o=>o.name==='fillRect'),txt=c.ops.find(o=>o.name==='fillText');assert.equal(rect.style.fillStyle,PAPER_TOKENS.graphite);assert.equal(txt.style.fillStyle,PAPER_TOKENS.cream);
 assert.ok(ratio(PAPIR.label.text,PAPIR.label.bg)>=4.5,'small label text ≥ 4.5 : 1');
 const p=fakeCtx();drawPopups(p,[{text:'PERFECT',style:'perfect',i:0,alpha:1,scale:1,rise:0},{text:'OK',style:'success',i:1,alpha:1,scale:1,rise:0}],view,PAPIR);
 const tags=p.ops.filter(o=>o.name==='fillRect'),texts=p.ops.filter(o=>o.name==='fillText'),rots=p.ops.filter(o=>o.name==='rotate').map(o=>o.args[0]*180/Math.PI);
 assert.ok(tags.every(o=>o.style.fillStyle===PAPER_TOKENS.cream&&o.style.shadowBlur>0));assert.deepEqual(texts.map(o=>o.style.fillStyle),[PAPIR.popup.perfect,PAPIR.popup.success]);
 assert.ok(texts.every(o=>o.style.shadowBlur===0),'text without shadow');assert.ok(!p.ops.some(o=>o.name==='strokeText'),'no ink outline');
 assert.deepEqual(rots.map(v=>+v.toFixed(6)),[-1.5,-1.5,1.5,1.5]);
 for(const s of ['perfect','success','miss','milestone','land'])assert.ok(ratio(PAPIR.popup[s],PAPIR.popup.bg)>=3,`${s} on cream`);
});

test('P3 speed lines and scraps: one pass of 1 px graphite at alpha 0.5; sparks become rotated paper scraps (success alternates teal / cream), no spin with reduced motion',()=>{
 const c=fakeCtx();drawSpeedLines(c,[[300,50,80],[200,300,60]],PAPIR);const s=c.ops.filter(o=>o.name==='stroke');
 assert.equal(s.length,1);assert.equal(s[0].style.strokeStyle,PAPER_TOKENS.graphite);assert.equal(s[0].style.lineWidth,1);assert.equal(s[0].style.globalAlpha,.5);
 const fx=createFx();fxEvent(fx,'success');stepFx(fx,.1,null,{cam:0,px:148,py:200,ground:300},()=>.3);const list=particles(fx,{cam:0,px:148,py:200,k:1});
 assert.ok(list.length>0&&list.every(q=>Number.isInteger(q.i)&&q.age>0));
 const q=list[0];assert.notEqual(scrapAngle(q),scrapAngle({...q,age:q.age+.1}),'spins');assert.equal(scrapAngle(q,true),scrapAngle({...q,age:q.age+.1},true),'reduced: no spin');
 const d=fakeCtx();drawParticles(d,[{kind:2,x:10,y:10,size:3,alpha:1,i:0,age:.1},{kind:2,x:20,y:10,size:3,alpha:1,i:1,age:.1},{kind:1,x:30,y:10,size:3,alpha:1,i:2,age:.1}],PAPIR);
 const r=d.ops.filter(o=>o.name==='fillRect');assert.deepEqual(r.map(o=>o.style.fillStyle),[PAPIR.particles[2],PAPIR.particles[0],PAPIR.particles[1]]);
 assert.equal(scrapTone({i:3}),1);assert.ok(r.every(o=>Math.abs(o.args[2]*.55-o.args[3])<1e-9),'paper strip, not a square');assert.equal(d.ops.filter(o=>o.name==='rotate').length,3);
});

test('P3 aim: graphite arrow on a cream card with a lifted shadow',()=>{
 const c=fakeCtx();drawAim(c,{angle:20,held:true,charge:.5},{px:148,py:258},PAPIR);
 assert.equal(c.ops.find(o=>o.name==='stroke').style.strokeStyle,PAPER_TOKENS.graphite);
 const panels=c.ops.filter(o=>o.name==='fillRect'&&o.style.fillStyle===PAPER_TOKENS.cream);assert.ok(panels.some(o=>o.style.shadowBlur>0)&&panels.some(o=>o.style.shadowBlur===0));
 assert.ok(ratio(PAPIR.aim.text,PAPIR.aim.panel)>=4.5);
});
test('R0 one style: drawUi always paper (plan.style and ui.palette ignored), defaults of the draw functions are PAPIR',()=>{
 const fx=createFx();fxEvent(fx,'perfect');stepFx(fx,.05,null,{cam:0,px:148,py:200,ground:300},()=>.4);
 const plan=(style,pal)=>({t:1,style,view,fx:{shake:{x:0,y:0,roll:0},flash:0,speedLines:[[300,50,80]],particles:particles(fx,view),popups:[{text:'PERFECT',style:'perfect',i:0,alpha:1,scale:1,rise:0}]},
  ui:{qte:{type:'gust',phase:'interaction',progress:.3,zones},labels:[{label:'GUST!',age:.2}],aim:null,reduced:false,uiScale:1,palette:pal}});
 const run=p=>{const c=fakeCtx(1280);drawUi(c,p);return c;},base=strip(run(plan()));
 for(const [st,pal] of [['cyber'],['papir'],[undefined,'cyber']])assert.deepEqual(strip(run(plan(st,pal))),base,`${st}/${pal}`);
 const pa=run(plan());assert.ok(pa.ops.some(o=>o.name==='fill'&&o.style.fillStyle===PAPIR.qte.disc));
 const a=fakeCtx(),b=fakeCtx();drawAim(a,{angle:20,held:true,charge:.5},{px:148,py:258});drawAim(b,{angle:20,held:true,charge:.5},{px:148,py:258},PAPIR);assert.deepEqual(strip(a),strip(b));
 assert.equal(palette('cyber'),PAPIR);
});
