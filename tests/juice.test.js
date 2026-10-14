import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createFx,fxEvent,stepFx,STRIDE} from '../src/juice.js';
import {PAPIR,PAPER_ROLE} from '../src/render3d/palette.js';

const view={cam:0,px:148,py:200,ground:300},live=fx=>{const out=[];for(let o=0;o<fx.parts.length;o+=STRIDE)if(fx.parts[o+4]<fx.parts[o+5])out.push(o);return out;};
const kinds=fx=>[...new Set(live(fx).map(o=>fx.parts[o+7]))];
const burst=(type,info)=>{const fx=createFx();fxEvent(fx,type,info);stepFx(fx,1/60,null,view,()=>.5);return fx;};
test('milestone sparks are value (gold, particles[4]), perfect sparks stay magenta (particles[1])',()=>{
 assert.deepEqual(kinds(burst('milestone',{text:'100 m'})),[4]);assert.equal(PAPIR.particles[4],PAPER_ROLE.value);
 assert.deepEqual(kinds(burst('perfect')),[1]);assert.equal(PAPIR.particles[1],PAPER_ROLE.perfect);
 const fx=burst('milestone',{text:'100 m'});assert.equal(fx.popups[0].style,'milestone');
 for(let i=0;i<30;i++)stepFx(fx,1/60,null,view,()=>.5);
 assert.ok(live(fx).some(o=>fx.parts[o+3]>0),'value sparks fall like the other sparks');
});
