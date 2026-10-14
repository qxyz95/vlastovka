import {test} from 'node:test';
import assert from 'node:assert/strict';
import {drawUi,drawQte,drawAim,drawLabel,drawPopups,uiScale,uiFrame,withShake,QTE_BASE} from '../src/render3d/ui-layer.js';
import {shakeCamera,flashAlpha,speedLineCount,speedLines,speedLineY,particleScreen,toScreen,fxMap,MAX_ROLL,SPEED_GAP,SPEED_Y} from '../src/render3d/fx-map.js';
import {EVENT_VIEWS,eventView,GENERIC} from '../src/render3d/events-view.js';
import {palette,PAPIR as P,PAPER_TOKENS} from '../src/render3d/palette.js';
import {readFileSync} from 'node:fs';
import {createFx,fxEvent,stepFx,STRIDE} from '../src/juice.js';
import {createEvents} from '../src/events.js';

// Owned by R2 (UI layer). Fake 2D context: records every call with the style state at that moment and tracks the transform.
function fakeCtx(width=1280){
 const ops=[],stack=[];let m=[1,0,0,1,0,0];
 const st={fillStyle:'#000',strokeStyle:'#000',lineWidth:1,globalAlpha:1,font:'10px sans-serif',textAlign:'start',lineCap:'butt',lineJoin:'miter',dash:[]};
 const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
 const rec=name=>(...args)=>{ops.push({name,args,style:{...st,dash:[...st.dash]},m:[...m]});};
 const c={canvas:{width,height:width*9/16},ops,
  save(){stack.push({st:{...st,dash:[...st.dash]},m:[...m]});rec('save')();},
  restore(){const s=stack.pop();if(s){Object.assign(st,s.st);m=s.m;}rec('restore')();},
  setTransform(a,b,cc,d,e,f){m=[a,b,cc,d,e,f];rec('setTransform')(a,b,cc,d,e,f);},
  translate(x,y){m=mul(m,[1,0,0,1,x,y]);rec('translate')(x,y);},
  rotate(a){m=mul(m,[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);rec('rotate')(a);},
  scale(x,y){m=mul(m,[x,0,0,y,0,0]);rec('scale')(x,y);},
  getTransform(){const [a,b,cc,d,e,f]=m;return {a,b,c:cc,d,e,f};},
  setLineDash(d){st.dash=[...d];rec('setLineDash')(d);},
  measureText:t=>({width:String(t).length*6}),
  depth:()=>stack.length};
 for(const n of ['beginPath','arc','stroke','fill','fillRect','strokeRect','clearRect','moveTo','lineTo','closePath','fillText','strokeText'])c[n]=rec(n);
 for(const k of Object.keys(st))if(k!=='dash')Object.defineProperty(c,k,{get:()=>st[k],set:v=>{st[k]=v;}});
 return c;
}
const strokes=c=>{const out=[];let last=null;for(const o of c.ops){if(o.name==='arc')last=o;if(o.name==='stroke'&&last){out.push({...last,style:o.style});last=null;}}return out;};
const near=(a,b,e=1e-9)=>Math.abs(a-b)<e;
const view={cam:0,px:148,py:200,ground:300,k:1},zones={success:[.4,.7],perfect:[.5,.6]};

test('drawQte: track, success and perfect arcs at zone angles (6 / 9 / 11 px), graphite progress dot at view.px/py',()=>{
 const c=fakeCtx();drawQte(c,{type:'bird',phase:'interaction',result:null,held:true,progress:.25,zones},view,0,true);
 const arcs=strokes(c),at=k=>-Math.PI/2+k*Math.PI*2,by=color=>arcs.find(a=>a.style.strokeStyle===color);
 assert.equal(arcs.length,3);
 for(const a of arcs){assert.equal(a.args[0],148);assert.equal(a.args[1],200);assert.equal(a.args[2],30);}
 assert.deepEqual(['track','success','perfect'].map(k=>by(P.qte[k]).style.lineWidth),[6,9,11]);
 assert.ok(near(by(P.qte.track).args[3],at(0))&&near(by(P.qte.track).args[4],at(1)),'full track');
 assert.ok(near(by(P.qte.success).args[3],at(.4))&&near(by(P.qte.success).args[4],at(.7)),'success arc');
 assert.ok(near(by(P.qte.perfect).args[3],at(.5))&&near(by(P.qte.perfect).args[4],at(.6)),'perfect arc');
 const dot=c.ops.find(o=>o.name==='fillRect'&&o.style.fillStyle===P.qte.dot);
 assert.deepEqual(dot.args,[Math.round(148+30-4),Math.round(200-4),8,8],'dot at 3 o\'clock for progress .25');
 assert.equal(c.depth(),0,'save/restore balanced');
});

test('drawQte: warning is dashed, result is one arc in one colour, bird cue only before holding',()=>{
 const w=fakeCtx();drawQte(w,{type:'bird',phase:'warning',held:true,result:null,progress:0,zones},view,0,false);
 const wa=strokes(w);assert.equal(wa.length,1);assert.deepEqual(wa[0].style.dash,[6,6]);assert.equal(wa[0].style.strokeStyle,P.qte.warning);
 assert.ok(wa[0].style.globalAlpha<1);
 for(const [result,color] of [['perfect',P.qte.result.perfect],['success',P.qte.result.success],['miss',P.qte.result.other]]){
  const c=fakeCtx();drawQte(c,{type:'bird',phase:'effect',result,progress:1,zones},view,0,false);
  const a=strokes(c);assert.equal(a.length,1,result);assert.equal(a[0].style.strokeStyle,color);assert.equal(a[0].style.lineWidth,5);assert.deepEqual(a[0].style.dash,[]);
 }
 const cue=held=>{const c=fakeCtx();drawQte(c,{type:'bird',phase:'interaction',held,progress:.1,zones},view,0,true);return c.ops.some(o=>o.name==='fillRect'&&o.style.fillStyle===P.qte.bird.body);};
 assert.ok(cue(false));assert.ok(!cue(true));
});

test('unknown event type: generic ring and label, nothing throws',()=>{
 for(const t of ['gust','bird','steam','thermal','drone','star']){const v=EVENT_VIEWS[t];assert.ok(v.ring.r>0&&v.verb&&v.caption&&v.title,t);assert.equal(eventView(t).type,t);}
 assert.deepEqual(eventView('ufo').ring,GENERIC.ring);assert.equal(eventView('ufo').type,'ufo');assert.equal(eventView(undefined).type,'unknown');
 assert.equal(eventView('toString').title,GENERIC.title,'no prototype lookups');
 const e={type:'ufo',phase:'warning',at:2,result:null};assert.equal(eventView(e,2.5).label,'! GET READY');assert.equal(eventView(e,2.5).age,.5);
 assert.equal(eventView({...e,phase:'interaction'},3).label,GENERIC.caption);assert.equal(eventView({...e,phase:'effect',result:'miss'},3).label,'');
 const c=fakeCtx();
 assert.doesNotThrow(()=>drawQte(c,{type:'ufo',phase:'interaction',progress:.5,zones},view));
 assert.doesNotThrow(()=>drawQte(c,{type:'ufo',phase:'interaction'},view),'missing zones');
 assert.doesNotThrow(()=>drawUi(c,{view,ui:{labels:[eventView(e,2.5)],qte:{type:'ufo',phase:'interaction',progress:.5,zones}}}));
 assert.ok(c.ops.some(o=>o.name==='fillText'&&o.args[0]==='! GET READY'));
});

test('drawUi: logical 640×360 via setTransform, ends on the identity transform, shake stays inside save/restore',()=>{
 const fx=createFx();fxEvent(fx,'throw',{power:1});fxEvent(fx,'perfect');stepFx(fx,1/60,{x:10,y:12,vx:30,vy:2,t:1,landed:false},view,()=>.5);
 const f={x:10,y:12,vx:120,vy:2,t:2,landed:false,events:createEvents(1)};Object.assign(f.events[0],{type:'gust',phase:'interaction',at:1.5});
 const plan=uiFrame({f,view,fx,qte:{type:'gust',phase:'interaction',progress:.3,zones},clock:1.234,t:2,cssWidth:900});
 assert.ok(plan.fx.shake.x||plan.fx.shake.y,'shake present');assert.ok(plan.fx.speedLines.length>0);assert.equal(plan.ui.labels[0].label,'↓ TAP');
 const c=fakeCtx(1280);drawUi(c,plan);
 assert.deepEqual(c.ops[0].args,[2,0,0,2,0,0],'scale = width/640');
 assert.deepEqual(Object.values(c.getTransform()),[1,0,0,1,0,0],'identity at the end');assert.equal(c.depth(),0);
 const rot=c.ops.findIndex(o=>o.name==='rotate'),depthAt=i=>c.ops.slice(0,i).reduce((d,o)=>d+(o.name==='save')-(o.name==='restore'),0);
 assert.ok(rot>0&&depthAt(rot)>0,'shake rotation inside save');
 assert.ok(c.ops.some(o=>o.name==='clearRect'),'transparent overlay is cleared');
 const flash=c.ops.find(o=>o.name==='fillRect'&&o.args[2]===680);assert.ok(flash&&flash.style.globalAlpha>0,'flash drawn');
 // An exception while drawing still restores the base transform.
 const bad=fakeCtx(640);assert.throws(()=>drawUi(bad,{view,ui:{qte:{type:'gust',phase:'interaction',progress:.5,zones:{success:null}}}}));
 assert.deepEqual(Object.values(bad.getTransform()),[1,0,0,1,0,0]);
 const w=fakeCtx();withShake(w,{x:0,y:0,roll:0},()=>{});assert.deepEqual(w.ops.map(o=>o.name),['save','restore']);
});

test('particles follow the view contract sx = px + (wx − cam − px)·k',()=>{
 const v={cam:500,px:148,py:200,ground:300,k:.5};
 assert.deepEqual(particleScreen(v,500+148,200),[148,200],'at the plane = plane');
 assert.deepEqual(particleScreen(v,500+148+100,240),[198,220]);assert.deepEqual(toScreen(748,240,v),[198,220]);
 assert.deepEqual(particleScreen({cam:0,px:148,py:258},300,100),[300,100],'k defaults to 1 (2D framing)');
 const fx=createFx();fx.parts.set([748,240,0,0,0,1,4,1],0);
 const m=fxMap(fx,v),p=m.particles;assert.equal(p.length,1);assert.equal(p[0].x,198);assert.equal(p[0].y,220);assert.equal(p[0].size,(4+1)*.5);
 const c=fakeCtx(640);drawUi(c,{view:v,fx:m,ui:{}});const i=c.ops.findIndex(o=>o.name==='fillRect'&&o.style.fillStyle===P.particles[1]);
 assert.ok(i>0&&c.ops.slice(0,i).some(o=>o.name==='translate'&&o.args[0]===198&&o.args[1]===220),'paper scrap at the particle');assert.equal(STRIDE,8);
});

test('reduced motion and settings: no shake, flash, speed lines or popup motion',()=>{
 const fx=createFx();fxEvent(fx,'perfect');fx.trauma=1;
 const on=shakeCamera(fx,.37,false);assert.ok(on.x||on.y);assert.ok(Math.abs(on.roll)<=MAX_ROLL+1e-12&&MAX_ROLL<=3*Math.PI/180+1e-12);
 assert.ok(near(on.dx,on.x/2.1)&&near(on.dy,-on.y/2.1),'metres = px / 2.1, y up');
 assert.deepEqual(shakeCamera(fx,.37,true),{x:0,y:0,roll:0,dx:0,dy:0});assert.deepEqual(shakeCamera(fx,.37,false,1/2.1,{shake:false}),{x:0,y:0,roll:0,dx:0,dy:0});
 for(let t=0;t<3;t+=.01){const s=shakeCamera({trauma:1},t,false,1,{shake:5});assert.ok(Math.abs(s.roll)<=MAX_ROLL+1e-12);}
 assert.ok(near(flashAlpha(fx,false),.18));assert.equal(flashAlpha(fx,true),0);assert.equal(flashAlpha(fx,false,{flash:false}),0);assert.equal(flashAlpha(null),0);
 const m=fxMap(fx,view,{reduced:true,vx:150,flying:true});
 assert.equal(m.flash,0);assert.equal(m.speedLines.length,0);assert.deepEqual(m.shake,{x:0,y:0,roll:0,dx:0,dy:0});
 fx.popups[0].age=.5;assert.equal(fxMap(fx,view,{reduced:true}).popups[0].rise,0);assert.equal(fxMap(fx,view,{reduced:true}).popups[0].scale,1);assert.ok(fxMap(fx,view).popups[0].rise>0);
 const c=fakeCtx();drawUi(c,{view,fx:{...fxMap(fx,view,{vx:150,flying:true}),flash:.5},ui:{reduced:true}});
 assert.ok(!c.ops.some(o=>o.name==='fillRect'&&o.args[2]===680),'no flash when reduced');assert.ok(!c.ops.some(o=>o.style.strokeStyle===P.speed.line&&o.name==='stroke'),'no speed lines when reduced');
});

test('speedLineCount: none below 40 m/s, 6–24 with speed, off by setting',()=>{
 assert.equal(speedLineCount(0),0);assert.equal(speedLineCount(40),0);assert.equal(speedLineCount(undefined),0);
 assert.equal(speedLineCount(41),6);assert.equal(speedLineCount(150),24);assert.equal(speedLineCount(500),24);
 assert.ok(speedLineCount(95)>6&&speedLineCount(95)<24);
 assert.equal(speedLineCount(150,{speedLines:false}),0);assert.equal(speedLineCount(150,{reduced:true}),0);
 assert.equal(speedLines(150,1).length,24);assert.deepEqual(speedLines(150,1),speedLines(150,1),'stable within a drawing');
 assert.equal(fxMap(createFx(),view,{vx:150,flying:false}).speedLines.length,0,'only in flight');
});

test('drawAim: arrow from the projected plane, panel and power bar; uiScale and palette',()=>{
 const c=fakeCtx();drawAim(c,{angle:30,held:true,charge:.5},{px:148,py:258});
 assert.deepEqual(c.ops.find(o=>o.name==='translate').args,[148,258]);assert.ok(near(c.ops.find(o=>o.name==='rotate').args[0],-Math.PI/6));
 const line=c.ops.filter(o=>o.name==='lineTo')[0];assert.equal(line.args[0],65+.5*45);assert.deepEqual(c.ops.find(o=>o.name==='stroke').style.dash,[7,5]);
 assert.deepEqual(c.ops.find(o=>o.name==='fillRect'&&o.style.fillStyle===P.aim.bar).args,[207,213,261*.5,10]);
 assert.ok(c.ops.some(o=>o.name==='fillText'&&o.args[0]==='RELEASE AT PEAK POWER'));assert.equal(c.depth(),0);
 const idle=fakeCtx();drawAim(idle,{angle:15,held:false,charge:.9},{px:148,py:258});assert.equal(idle.ops.find(o=>o.name==='fillRect'&&o.style.fillStyle===P.aim.bar).args[2],0);
 assert.equal(uiScale(1280),1);assert.equal(uiScale(640),1);assert.ok(uiScale(360)>1.5&&uiScale(360)<=2);assert.equal(uiScale(100),2);assert.equal(uiScale(0),1);
 assert.equal(palette('nope'),P);assert.equal(P.plane.fill,'#ffffff');assert.deepEqual(P.trail,[PAPER_TOKENS.graphite,PAPER_TOKENS.graphite]);
});

test('U5: speed lines skip a ±24 px band around the plane (ink shadow and stroke width included), count unchanged',()=>{
 assert.equal(SPEED_GAP,24);
 for(const py of [-40,0,12,30,90,180,200,258,330,348,400])for(let f=0;f<6;f+=.25)for(const vx of [41,95,150]){
  const lines=speedLines(vx,f,{},py);assert.equal(lines.length,speedLineCount(vx));
  for(const [,y] of lines){assert.ok(y>=SPEED_Y[0]&&y<=SPEED_Y[1],'y in range');
   for(const yy of [y-1,y+1,y+3-.5,y+3+.5])assert.ok(yy<py-SPEED_GAP||yy>py+SPEED_GAP,`line ${yy} crosses the plane band at ${py}`);}}
 assert.deepEqual(speedLines(150,1,{},undefined),speedLines(150,1),'without a plane: old layout');
 assert.equal(speedLineY(0,200),SPEED_Y[0]);assert.ok(speedLineY(.999,200)<=SPEED_Y[1]);
 const m=fxMap(createFx(),{...view,py:180},{vx:150,flying:true,frame:1});assert.equal(m.speedLines.length,24);
 for(const [,y] of m.speedLines)assert.ok(y<180-SPEED_GAP-1||y>180+SPEED_GAP,'fxMap passes view.py');
});

test('U6: cream paper base (95 % alpha) under the QTE ring, as an annulus so the plane in the middle stays free',()=>{
 for(const q of [{type:'bird',phase:'interaction',held:true,progress:.3,zones},{type:'bird',phase:'warning',held:true,progress:0,zones},{type:'bird',phase:'effect',result:'perfect',progress:1,zones}]){
  const c=fakeCtx();drawQte(c,q,view,0,false);const i=c.ops.findIndex(o=>o.name==='fill'),f=c.ops[i];
  assert.ok(f,'base drawn '+q.phase);assert.equal(f.style.fillStyle,P.qte.disc);assert.equal(P.qte.disc,PAPER_TOKENS.cream);assert.ok(near(f.style.globalAlpha,.95));
  const arcs=c.ops.slice(0,i).filter(o=>o.name==='arc').slice(-2);assert.deepEqual(arcs.map(o=>o.args[2]),[30+QTE_BASE,30-QTE_BASE]);assert.equal(arcs[1].args[5],true,'hole = reverse arc');
  assert.ok(c.ops.findIndex(o=>o.name==='stroke')>i,'base under the ring');assert.ok(QTE_BASE>=P.qte.width.perfect/2+3,'covers the 11 px perfect arc with a margin');
  assert.equal(c.ops.find(o=>o.name==='stroke').style.globalAlpha<1,q.phase==='warning','alpha restored after the base');}
 const none=fakeCtx();drawQte(none,{type:'gust',phase:'interaction'},view);assert.ok(!none.ops.some(o=>o.name==='fill'),'no ring, no base');
});

test('U18: canvas UI text without monospace (labels, aim panel, popups use the display stack)',()=>{
 const fonts=[];for(const draw of [c=>drawLabel(c,{label:'↓ TAP',age:0},view),c=>drawAim(c,{angle:15},view),c=>drawPopups(c,[{text:'★',style:'perfect',i:0,alpha:1,scale:1,rise:0}],view)]){
  const c=fakeCtx();draw(c);for(const o of c.ops)if(o.name==='fillText')fonts.push(o.style.font);}
 assert.equal(fonts.length,3);for(const f of fonts){assert.ok(!/monospace/.test(f),f);assert.ok(f.endsWith(P.popup.font),f);}
 assert.ok(!/monospace/.test(readFileSync(new URL('../src/render3d/ui-layer.js',import.meta.url),'utf8')));
});
