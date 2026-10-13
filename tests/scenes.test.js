import {test} from 'node:test';
import assert from 'node:assert/strict';
import {districtAt,tileOffset,atmosphereAt,routeAt,ROUTE,SECTION_METERS,SCREEN_METERS,TRANSITION_METERS} from '../src/scenes.js';
import {createFlight} from '../src/core.js';

test('transitions remain continuous over boundaries and thousands of meters',()=>{
 for(let step=1;step<=20;step++){
  const boundary=step*SECTION_METERS;
  const before=districtAt(boundary-1e-4),after=districtAt(boundary);
  assert.equal(before.next,after.index);assert.ok(before.blend>1-1e-8);assert.equal(after.blend,0);
  assert.ok(Math.abs(atmosphereAt(boundary-1e-4,3).rain-atmosphereAt(boundary,3).rain)<1e-8);
 }
 assert.equal(districtAt(-10).index,0);
 assert.ok(Math.abs(districtAt(SECTION_METERS-TRANSITION_METERS/2).blend-.5)<1e-10);
});
test('each biome contains four different consecutive world screens before advancing',()=>{
 assert.equal(new Set(ROUTE.map(p=>p.kind)).size,16);
 for(let screen=0;screen<80;screen++){
  const middle=routeAt((screen+.5)*SCREEN_METERS);
  assert.equal(middle.screen,screen);assert.equal(middle.part,screen%4+1);
  assert.equal(middle.biome,Math.floor(screen/4)%4);
  assert.equal(districtAt((screen+.5)*SCREEN_METERS).index,middle.biome);
  assert.equal(routeAt((screen+1)*SCREEN_METERS-1e-5).index,screen%16);
  assert.equal(routeAt((screen+1)*SCREEN_METERS+1e-5).index,(screen+1)%16);
 }
});
test('all parallax layers move left and tile exactly at wrap',()=>{
 for(const speed of [.035,.19,.48,1]){
  assert.ok(tileOffset(101,speed)<tileOffset(100,speed));
  const wrap=960/speed;
  assert.ok(Math.abs(tileOffset(wrap-1e-4,speed)+960)<.001);
  assert.ok(Math.abs(tileOffset(wrap,speed))<.001);
 }
});
test('atmosphere is deterministic and does not mutate simulation',()=>{
 const f=createFlight(),before=structuredClone(f);
 assert.deepEqual(atmosphereAt(2000,32),atmosphereAt(2000,32));
 assert.deepEqual(f,before);assert.equal(atmosphereAt(0,9).flock,null);
});

