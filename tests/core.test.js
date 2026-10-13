import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,buy,createFlight,step,forces,action,simulate,settle} from '../src/core.js';
import {decode} from '../src/storage.js';
test('deterministic flights, finite landing, timestep convergence and all upgrade levels',()=>{
  for(const model of ['dart','glider']){
    for(const branch of ['power','paper','fold']){
      let previous=0;
      for(let level=0;level<=5;level++){
        const levels={power:0,paper:0,fold:0,[branch]:level};
        const f=simulate(model,levels,42),fine=simulate(model,levels,42,0,1/120);
        assert.equal(f.x,simulate(model,levels,42).x);assert.ok(f.landed&&f.t<180);assert.ok(f.x>previous);previous=f.x;
        assert.ok(Math.abs(f.x-fine.x)/fine.x<0.001);
      }
    }
    assert.ok(simulate(model,{power:5,paper:5,fold:5}).x>=500);
  }
});
test('force directions, zero airspeed, wind and passive energy',()=>{
  const f=createFlight(),p=f.p;
  assert.deepEqual(forces(0,0,p),{x:0,y:-p.mass*p.gravity});
  assert.ok(forces(20,0,p).x<0);
  assert.ok(Math.abs(forces(20,0,p,{x:-5,y:0}).x)>Math.abs(forces(20,0,p,{x:5,y:0}).x));
  for(const model of ['dart','glider']) for(const level of [0,5]){
    const f=createFlight(model,{power:level,paper:level,fold:level});
    const energy=()=>f.p.mass*(.5*(f.vx*f.vx+f.vy*f.vy)+f.p.gravity*f.y);
    let prev=energy();while(!f.landed){step(f);const e=energy();assert.ok(e<=prev+1e-6);prev=e;}
  }
});
test('purchase prerequisites, cap, persistence and one reward',()=>{
  const p=fresh();assert.equal(buy(p,'power',1),false);p.coins=1000;
  assert.equal(buy(p,'power',2),false);for(let i=1;i<=5;i++)assert.ok(buy(p,'power',i));
  assert.equal(p.coins,700);assert.equal(buy(p,'power',6),false);assert.equal(buy(p,'power',5),false);
  assert.deepEqual(decode(JSON.stringify(p)),p);assert.throws(()=>decode('{'));assert.throws(()=>decode('{"version":2}'));
  const f=simulate('dart',fresh().levels.dart);assert.ok(settle(p,f));const coins=p.coins;assert.equal(settle(p,f),false);assert.equal(p.coins,coins);assert.ok(coins>=710);
});
import {chargeAt,throwSettings} from '../src/throw.js';
test('aim and hold changes initial velocity; overholding loses power; bounded finite trajectories',()=>{
 assert.equal(chargeAt(0),0);assert.equal(chargeAt(1.15),1);assert.ok(chargeAt(2.3)<1e-10);
 for(const model of ['dart','glider']) for(const angle of [5,15,40]) for(const power of [0,.5,1]) for(const level of [0,5]){
  const settings=throwSettings(angle,power),f=createFlight(model,{power:level,paper:level,fold:level},7,{x:0,y:0},settings);
  assert.ok(Math.abs(Math.atan2(f.vy,f.vx)-settings.angle)<1e-10);
  while(!f.landed&&f.t<180)step(f);assert.ok(f.landed&&Number.isFinite(f.x));
 }
 const weak=createFlight('dart',fresh().levels.dart,1,{x:0,y:0},throwSettings(15,0));
 const strong=createFlight('dart',fresh().levels.dart,1,{x:0,y:0},throwSettings(15,1));
 assert.ok(strong.vx>weak.vx);assert.deepEqual(strong.events,weak.events);
 assert.equal(strong.events.length,6);
});


test('model upgrades are independent and legacy purchases migrate without loss',()=>{
 const p=fresh();p.coins=100;p.best=120;
 assert.ok(buy(p,'power',1));assert.equal(p.levels.dart.power,1);assert.equal(p.levels.glider.power,0);
 p.model='glider';assert.ok(buy(p,'paper',1));assert.equal(p.levels.dart.paper,0);assert.equal(p.levels.glider.paper,1);assert.equal(p.coins,80);
 assert.deepEqual(decode(JSON.stringify(p)),p);
 const old={...fresh(),version:1,levels:{power:3,paper:2,fold:1}};
 const migrated=decode(JSON.stringify(old));assert.equal(migrated.version,2);assert.deepEqual(migrated.levels.dart,old.levels);assert.deepEqual(migrated.levels.glider,old.levels);
 migrated.levels.dart.power=4;assert.equal(migrated.levels.glider.power,3);
 assert.throws(()=>decode(JSON.stringify({...p,levels:{dart:p.levels.dart}})));
});

