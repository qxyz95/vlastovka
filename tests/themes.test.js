import {test} from 'node:test';
import assert from 'node:assert/strict';
import {THEMES,THEME_IDS,setTheme,theme,pickTheme,mix} from '../src/themes.js';

test('theme choice: URL wins, then stored value, unknown ids fall back to cyber',()=>{
 assert.equal(pickTheme('paper','dusk'),'paper');
 assert.equal(pickTheme('nonsense','dusk'),'dusk');
 assert.equal(pickTheme(null,'__proto__'),'cyber');
 assert.equal(setTheme('missing').id,'cyber');assert.equal(theme().id,'cyber');
});
test('every theme defines palettes for all four districts',()=>{
 assert.deepEqual(THEME_IDS,['cyber','paper','blueprint','dusk']);
 for(const t of Object.values(THEMES)){
  assert.equal(t.biomes.length,4);assert.equal(t.ground.length,4);
  assert.equal(t.plane.crease.length,2);assert.equal(t.kid.length,4);
  assert.equal(typeof t.tint('#123456'),'string');
  if(t.mode==='line')assert.equal(typeof t.ink,'function');
 }
 assert.equal(mix('#000000','#ffffff',.5),'#808080');
});
test('decorations never cut a hole around the plane (no clip), so objects behind it stay visible',async()=>{
 const {drawDecorations}=await import('../src/decorations.js');
 const calls=[],c=new Proxy({},{get:(o,k)=>k in o?o[k]:(...a)=>calls.push(k),set:(o,k,v)=>(o[k]=v,true)});
 setTheme('cyber');
 for(const type of ['robot','train','cargo','steam','sign','drone'])drawDecorations(c,{active:{type,at:0,until:4}},{t:2.68,events:[],landed:false},148,272,false);
 assert.ok(calls.includes('fillRect'),'decorations were drawn');assert.ok(!calls.includes('clip'));
});
