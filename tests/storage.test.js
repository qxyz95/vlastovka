import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,settle} from '../src/core.js';
import {KEY,load} from '../src/storage.js';
function mockStorage(data){const store={...data};Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v);}}});return store;}
test('corrupt save is backed up instead of silently lost',()=>{
 const store=mockStorage({[KEY]:'{broken'});const {data,warning}=load();
 assert.deepEqual(data,fresh());assert.equal(store[KEY+'-corrupt'],'{broken');assert.match(warning,/zálohovaná/);
});
test('missing localStorage falls back to a fresh game',()=>{
 Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('denied');}});
 const {data,warning}=load();assert.deepEqual(data,fresh());assert.ok(warning);
});
test('NaN landing distance cannot corrupt the save',()=>{
 const p={...fresh(),coins:50,best:120};const f={landed:true,settled:false,x:NaN,startX:0};
 assert.ok(settle(p,f));assert.equal(p.coins,60);assert.equal(p.best,120);assert.ok(Number.isSafeInteger(JSON.parse(JSON.stringify(p)).coins));
});
