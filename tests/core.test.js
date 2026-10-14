import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,buy,createFlight,step,simulate,settle,bestAngle as passiveBestAngle,angleHint} from '../src/core.js';
import {PRICES} from '../src/config.js';
import {decode} from '../src/storage.js';
import {chargeAt,throwSettings} from '../src/throw.js';
import {t} from '../src/i18n.js';
const L=(power,paper,fold)=>({power,paper,fold});
const bestAngle=(model,levels,power=1)=>{let best=[0,0];for(let a=5;a<=40;a++){const x=simulate(model,levels,2,0,1/60,{launch:throwSettings(a,power)}).x;if(x>best[0])best=[x,a];}return best;};
test('deterministic flights, finite landing, timestep convergence and all upgrade levels',()=>{
  for(const model of ['dart','glider']){
    for(const branch of ['power','paper','fold']){
      let previous=0;
      for(let level=0;level<=5;level++){
        const levels={...L(0,0,0),[branch]:level};
        const f=simulate(model,levels,42),fine=simulate(model,levels,42,0,1/120);
        assert.equal(f.x,simulate(model,levels,42).x);assert.ok(f.landed&&f.t<180);assert.ok(f.x>previous);previous=f.x;
        assert.ok(Math.abs(f.x-fine.x)/fine.x<0.002);
      }
    }
  }
});
test('glide never sinks faster than speed / glide ratio, tailwind and updraft help',()=>{
  for(const model of ['dart','glider']){
    const f=createFlight(model,L(0,3,0));
    while(!f.landed){step(f);if(!f.landed&&f.carry<=0)assert.ok(f.vy>=-f.vx/f.p.glide-1e-9);}
  }
  const fly=wind=>{const f=createFlight('dart',L(0,0,0),5,wind);while(!f.landed)step(f);return f.x;};
  assert.ok(fly({x:2,y:0})>fly({x:0,y:0}));assert.ok(fly({x:0,y:.3})>fly({x:0,y:0}));
});
test('each model has an interior best angle and the glider prefers steeper throws',()=>{
  const dart=bestAngle('dart',L(0,0,0)),glider=bestAngle('glider',L(0,0,0));
  assert.ok(dart[1]>10&&dart[1]<35);assert.ok(glider[1]>dart[1]&&glider[1]<40);
});
test('models have distinct niches: dart for power builds, glider for paper builds',()=>{
  assert.ok(bestAngle('dart',L(5,0,0))[0]>bestAngle('glider',L(5,0,0))[0]);
  assert.ok(bestAngle('glider',L(0,5,0))[0]>bestAngle('dart',L(0,5,0))[0]);
  const ratio=bestAngle('glider',L(0,0,0))[0]/bestAngle('dart',L(0,0,0))[0];assert.ok(ratio>.9&&ratio<1.1);
});
test('fold forgives weak throws; a weak but fully upgraded throw still reaches 500 m',()=>{
  const gap=fold=>bestAngle('dart',L(0,0,fold),1)[0]-bestAngle('dart',L(0,0,fold),.5)[0];
  assert.ok(gap(5)<gap(0)*.6);
  for(const model of ['dart','glider'])assert.ok(bestAngle(model,L(5,5,5),.5)[0]>=500);
});
test('purchase prerequisites, cap, persistence and one reward',()=>{
  const p=fresh();assert.equal(buy(p,'power',1),false);p.coins=2000;
  assert.equal(buy(p,'power',2),false);for(let i=1;i<=5;i++)assert.ok(buy(p,'power',i));
  assert.equal(p.coins,2000-PRICES.reduce((a,b)=>a+b));assert.equal(buy(p,'power',6),false);assert.equal(buy(p,'power',5),false);assert.equal(buy(p,'toString',1),false);
  assert.deepEqual(decode(JSON.stringify(p)),p);assert.throws(()=>decode('{'));assert.throws(()=>decode('{"version":3}'));
  const f=simulate('dart',fresh().levels);assert.ok(settle(p,f));const coins=p.coins;assert.equal(settle(p,f),false);assert.equal(p.coins,coins);assert.equal(coins,2000-PRICES.reduce((a,b)=>a+b)+10+Math.floor(f.x/10));
});
test('aim and hold changes initial velocity; overholding loses power; bounded finite trajectories',()=>{
 assert.equal(chargeAt(0),0);assert.equal(chargeAt(1.15),1);assert.ok(chargeAt(2.3)<1e-10);
 for(const model of ['dart','glider']) for(const angle of [5,15,40]) for(const power of [0,.5,1]) for(const level of [0,5]){
  const settings=throwSettings(angle,power),f=createFlight(model,L(level,level,level),7,{x:0,y:0},settings);
  assert.ok(Math.abs(Math.atan2(f.vy,f.vx)-settings.angle)<1e-10);
  while(!f.landed&&f.t<180)step(f);assert.ok(f.landed&&Number.isFinite(f.x));
 }
 const weak=createFlight('dart',fresh().levels,1,{x:0,y:0},throwSettings(15,0));
 const strong=createFlight('dart',fresh().levels,1,{x:0,y:0},throwSettings(15,1));
 assert.ok(strong.vx>weak.vx);assert.deepEqual(strong.events,weak.events);
});
test('upgrades are shared by both models; older saves migrate without loss',()=>{
 const p=fresh();p.coins=100;p.best=120;
 assert.ok(buy(p,'power',1));p.model='glider';assert.ok(buy(p,'paper',1));assert.deepEqual(p.levels,L(1,1,0));assert.equal(p.coins,100-2*PRICES[0]);
 assert.deepEqual(decode(JSON.stringify(p)),p);
 const v1=decode(JSON.stringify({...fresh(),version:1,levels:L(3,2,1)}));assert.equal(v1.version,4);assert.deepEqual(v1.levels,L(3,2,1));
 const v2=decode(JSON.stringify({...fresh(),version:2,levels:{dart:L(3,0,1),glider:L(1,4,0)}}));assert.deepEqual(v2.levels,L(3,4,1));
 assert.throws(()=>decode(JSON.stringify({...fresh(),version:2,levels:{dart:L(1,1,1)}})));
 assert.throws(()=>decode(JSON.stringify({...fresh(),levels:L(6,0,0)})));
});
test('angle hint points to the best passive angle for model, upgrades and power',()=>{
 const dart=passiveBestAngle('dart',L(0,0,0),1),glider=passiveBestAngle('glider',L(0,0,0),1);
 assert.ok(dart>=15&&dart<=32);assert.ok(glider>dart);
 const x=a=>{const f=createFlight('dart',L(0,0,0),1,{x:0,y:0},throwSettings(a,1));f.events=[];while(!f.landed)step(f);return f.x;};
 assert.ok(x(dart)>=x(dart-5)&&x(dart)>=x(dart+5));
 assert.equal(angleHint(dart+2,dart),'angle.ok');assert.equal(angleHint(dart+5,dart),'angle.flatter');assert.equal(angleHint(dart-12,dart),'angle.muchSteeper');
 assert.equal(t(angleHint(dart+2,dart),{},'cs'),'Úhel sedí');assert.equal(t(angleHint(dart+5,dart),{},'cs'),'Zkus o kus plošeji');
 assert.equal(t(angleHint(dart-12,dart),{},'en'),'Try much steeper');
});
