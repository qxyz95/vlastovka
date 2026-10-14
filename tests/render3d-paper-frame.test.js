import {test} from 'node:test';
import assert from 'node:assert/strict';
import {QUALITY,DROP,initialQuality,nextQuality,qualityPreset} from '../src/render3d/quality.js';
import {comicLook,PAPER_OUTLINE} from '../src/render3d/comic.js';
import {planFrame,PLANE_NARROW,planeScale,planeSizeScale,planeLength,PLANE_SIZE} from '../src/render3d/frame.js';
import {moodAt} from '../src/render3d/mood.js';
import {PAPER_TOKENS} from '../src/render3d/palette.js';
import {createFlight,step} from '../src/core.js';

// Papírové město P0: quality.js (bible 05 kap. 5), comicLook, plan.quality / měřítko vlaštovky (frame.js).

test('quality: tři úrovně podle bible, výchozí podle zařízení, čitelnost na všech stejná',()=>{
 assert.deepEqual(QUALITY.map(q=>q.level),[0,1,2]);
 // stíny na zem (08-stiny.md S5): 0 jen pata karet, 1 maska 1/4 a 1 rozmazání, 2 maska 1/3 a 2 rozmazání
 assert.deepEqual(QUALITY.map(q=>q.mask),[0,1/4,1/3]);assert.deepEqual(QUALITY.map(q=>q.blur),[0,1,2]);assert.deepEqual(QUALITY.map(q=>q.msaa),[0,2,4]);
 assert.ok(QUALITY.every(q=>q.ao&&q.haze&&q.maxDpr<=2));assert.equal(QUALITY[1].maxDpr,1.5);assert.equal(QUALITY[0].maxDpr,1);
 assert.ok(!QUALITY[0].fiber&&!QUALITY[0].grain&&QUALITY[1].fiber&&QUALITY[1].grain);
 assert.equal(initialQuality({touch:true,cssWidth:390}),1);assert.equal(initialQuality({touch:true,cssWidth:1280}),2);
 assert.equal(initialQuality({touch:false,cssWidth:390}),2);assert.equal(initialQuality(),2);
 assert.equal(qualityPreset(5),QUALITY[2]);assert.equal(qualityPreset(-1),QUALITY[0]);assert.equal(qualityPreset('x'),QUALITY[2]);
});

test('nextQuality: jen dolů, po 2 s nad 33 ms, nikdy během letu, nikdy nahoru',()=>{
 let s=2;for(let i=0;i<7;i++)s=nextQuality(s,{p95:40,dt:.25});assert.equal(s.level,2,'1,75 s');
 s=nextQuality(s,{p95:40,dt:.25});assert.equal(s.level,1);assert.equal(s.over,0);
 // přerušené překročení se nesčítá
 s=nextQuality(1,{p95:40,dt:1.5});s=nextQuality(s,{p95:20,dt:.1});s=nextQuality(s,{p95:40,dt:1});assert.equal(s.level,1);
 // za letu se čeká, pokles až po dopadu
 s={level:2,over:0};for(let i=0;i<12;i++)s=nextQuality(s,{p95:50,dt:.25,flying:true});assert.equal(s.level,2);assert.ok(s.over>=DROP.hold);
 s=nextQuality(s,{p95:50,dt:.25});assert.equal(s.level,1);
 // nikdy nahoru, nikdy pod 0
 for(const p95 of [1,5,16])assert.equal(nextQuality({level:0,over:9},{p95,dt:10}).level,0);
 s={level:0,over:0};for(let i=0;i<500;i++)s=nextQuality(s,{p95:99,dt:.1});assert.equal(s.level,0);
 let lv=2;for(let i=0;i<2000;i++){const n=nextQuality({level:lv,over:i%7},{p95:i%3?10:60,dt:.4,flying:i%5===0});assert.ok(n.level<=lv);lv=n.level;}
 const prev={level:2,over:1};nextQuality(prev,{p95:60,dt:2});assert.deepEqual(prev,{level:2,over:1},'nemutuje');
});

test('comicLook: obrysy jen vlaštovce (grafit 2,6 px), toon rampa bez stínování, kvalita 0–2',()=>{
 for(const q of [0,1,2]){const c=comicLook(q);
  assert.equal(c.quality,q);assert.equal(c.outline,PAPER_OUTLINE);assert.equal(c.worldOutline,false);assert.deepEqual(c.ramp,[255,255,255]);
  assert.equal(c.outline.plane,2.6);assert.equal(c.outline.building,0);assert.equal(c.outline.detail,0);assert.equal(c.outline.color,PAPER_TOKENS.graphite);}
 assert.equal(comicLook('mid').quality,1);assert.equal(comicLook().quality,2);assert.equal(comicLook({level:0}).quality,0);
});

const flight=()=>{const f=createFlight('dart',undefined,1);for(let i=0;i<90;i++)step(f);return f;};
test('planFrame: jediný styl (visual.style se ignoruje), plan.quality z quality.js nebo visual.quality',()=>{
 const f=flight(),base={clock:1.5,state:'flight'};
 for(const v of [{},{cssWidth:390,touch:true},{cssWidth:1280}]){const a=planFrame({f,time:f.t,visual:{...base,...v}});
  assert.ok(!('style' in a)&&!('style' in a.mood)&&!('style' in a.comic));assert.ok('haze' in a.mood);assert.equal(a.plane.scale,planeSizeScale(a.camera.width,v.cssWidth??640));
  assert.deepEqual(a.mood,{...moodAt(a.X,a.t,{hold:0}),fog:a.mood.fog});
  for(const style of ['cyber','papir'])assert.deepEqual(planFrame({f,time:f.t,visual:{...base,...v,style}}),a,style);}
 assert.equal(planFrame({f,time:f.t,visual:{...base,cssWidth:1280}}).quality,2);
 assert.equal(planFrame({f,time:f.t,visual:{...base,cssWidth:390,touch:true}}).quality,1);
 assert.equal(planFrame({f,time:f.t,visual:{...base,cssWidth:390,touch:true,quality:0}}).quality,0);
});

test('vlaštovka na úzké scéně o 15 % větší (let i Dílna), fyzika a záběr beze změny',()=>{
 assert.deepEqual(PLANE_NARROW,{width:500,scale:1.15});
 assert.equal(planeScale(390),1.15);assert.equal(planeScale(499),1.15);assert.equal(planeScale(500),1);
 const f=flight(),fl=planFrame({f,time:f.t,visual:{clock:1,state:'flight',cssWidth:375}}),wide=planFrame({f,time:f.t,visual:{clock:1,state:'flight',cssWidth:1280}});
 const W=fl.camera.width;assert.equal(fl.plane.scale,planeLength(W,375)/PLANE_SIZE.max*1.15);assert.equal(wide.plane.scale,planeLength(W,1280)/PLANE_SIZE.max);assert.equal(fl.plane.x,wide.plane.x);assert.deepEqual(fl.view,wide.view);
 const rest=planFrame({visual:{clock:1,state:'workshop',cssWidth:375}});assert.equal(rest.hand.scale,planeSizeScale(rest.camera.width,375));const rw=planFrame({visual:{clock:1,state:'workshop'}}).view;assert.ok(Math.abs(rest.view.px-rw.px)<1e-6&&Math.abs(rest.view.py-rw.py)<1e-6,'ruka na (148, 258) i na telefonu');assert.ok(rest.view.k>rw.k*1.5,'telefon 7 m, výchozí 640 px 11,9 m');
});
