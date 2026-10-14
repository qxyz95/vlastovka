import {test} from 'node:test';
import assert from 'node:assert/strict';
import {QUALITY,DROP,initialQuality,nextQuality,qualityPreset} from '../src/render3d/quality.js';
import {comicLook,PAPER_OUTLINE,OUTLINE} from '../src/render3d/comic.js';
import {planFrame,PLANE_NARROW,planeScale,styleOf} from '../src/render3d/frame.js';
import {moodAt} from '../src/render3d/mood.js';
import {PAPER_TOKENS} from '../src/render3d/palette.js';
import {createFlight,step} from '../src/core.js';

// Papírové město P0: quality.js (bible 05 kap. 5), comicLook pro papír, plan.style / plan.quality / měřítko vlaštovky (frame.js).

test('quality: tři úrovně podle bible, výchozí podle zařízení, čitelnost na všech stejná',()=>{
 assert.deepEqual(QUALITY.map(q=>q.level),[0,1,2]);
 assert.deepEqual(QUALITY.map(q=>q.shadows.length),[0,1,3]);assert.deepEqual(QUALITY.map(q=>q.msaa),[0,2,4]);
 assert.ok(QUALITY.every(q=>q.planeShadow&&q.haze&&q.maxDpr<=2));assert.equal(QUALITY[1].maxDpr,1.5);assert.equal(QUALITY[0].maxDpr,1);
 assert.ok(!QUALITY[0].fiber&&!QUALITY[0].grain&&QUALITY[1].fiber&&QUALITY[1].grain&&QUALITY[2].cloudShadows&&!QUALITY[1].cloudShadows);
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

test('comicLook papír: bez půltónu a posterizace, obrysy jen vlaštovce (grafit 2,6 px); cyber beze změny',()=>{
 for(const q of [0,1,2]){const m=moodAt(300,0,{style:'papir'}),c=comicLook(m,q);
  assert.equal(c.style,'papir');assert.equal(c.halftone,0);assert.equal(c.levels,8);assert.equal(c.outline,PAPER_OUTLINE);assert.equal(c.worldOutline,false);
  assert.equal(c.outline.plane,2.6);assert.equal(c.outline.building,0);assert.equal(c.outline.color,PAPER_TOKENS.graphite);assert.equal(c.ink,PAPER_TOKENS.graphite);
  assert.deepEqual(comicLook(m,q,'papir'),c);
  const cy=comicLook(moodAt(300),q);assert.equal(cy.outline,OUTLINE);assert.ok(!('style' in cy));assert.deepEqual(comicLook(moodAt(300),q,'cyber'),cy);}
});

const flight=()=>{const f=createFlight('dart',undefined,1);for(let i=0;i<90;i++)step(f);return f;};
test('planFrame: plan.style a plan.quality, výchozí hra beze změny',()=>{
 assert.equal(styleOf({}),'cyber');assert.equal(styleOf({style:'papir'}),'papir');assert.equal(styleOf({style:'neon'}),'cyber');assert.equal(styleOf(null),'cyber');
 const f=flight(),base={clock:1.5,state:'flight'};
 for(const v of [{},{cssWidth:390,touch:true},{cssWidth:1280}]){const a=planFrame({f,time:f.t,visual:{...base,...v}});
  assert.equal(a.style,'cyber');assert.equal(a.quality,2,'cyber kvalita vždy 2 bez visual.quality');assert.equal(a.plane.scale,1);assert.ok(!('style' in a.mood));
  assert.deepEqual(a.mood,{...moodAt(a.X,a.t,{hold:0}),fog:a.mood.fog});}
 assert.equal(planFrame({f,time:f.t,visual:{...base,quality:0}}).quality,0);
 const p=planFrame({f,time:f.t,visual:{...base,style:'papir',cssWidth:1280}});
 assert.equal(p.style,'papir');assert.equal(p.quality,2);assert.equal(p.mood.style,'papir');assert.equal(p.comic.style,'papir');assert.ok('haze' in p.mood);
 assert.equal(planFrame({f,time:f.t,visual:{...base,style:'papir',cssWidth:390,touch:true}}).quality,1);
 assert.equal(planFrame({f,time:f.t,visual:{...base,style:'papir',cssWidth:390,touch:true,quality:0}}).quality,0);
 // Stejný let a kamera v obou stylech (styl mění jen vzhled).
 const c=planFrame({f,time:f.t,visual:base});assert.deepEqual(p.camera,c.camera);assert.deepEqual(p.view,c.view);assert.deepEqual({...p.plane,scale:1},c.plane);
});

test('vlaštovka na úzké scéně o 15 % větší jen v papíru (let i Dílna), fyzika a záběr beze změny',()=>{
 assert.deepEqual(PLANE_NARROW,{width:500,scale:1.15});
 assert.equal(planeScale('papir',390),1.15);assert.equal(planeScale('papir',499),1.15);assert.equal(planeScale('papir',500),1);assert.equal(planeScale('cyber',390),1);
 const f=flight(),fl=planFrame({f,time:f.t,visual:{clock:1,state:'flight',style:'papir',cssWidth:375}}),wide=planFrame({f,time:f.t,visual:{clock:1,state:'flight',style:'papir',cssWidth:1280}});
 assert.equal(fl.plane.scale,1.15);assert.equal(wide.plane.scale,1);assert.equal(fl.plane.x,wide.plane.x);assert.deepEqual(fl.view,wide.view);
 const rest=planFrame({visual:{clock:1,state:'workshop',style:'papir',cssWidth:375}});assert.equal(rest.hand.scale,1.15);assert.deepEqual(rest.view,planFrame({visual:{clock:1,state:'workshop'}}).view);
 assert.equal(planFrame({visual:{clock:1,state:'workshop',cssWidth:375}}).hand.scale,1);
});
