import {test} from 'node:test';
import assert from 'node:assert/strict';
import {kidPose,planePose,HAND,REST,restCamera} from '../src/render3d/pose.js';
import {PLANE_OFFSET} from '../src/render3d/geometry.js';
import {noise1,fbm} from '../src/motion.js';
import {flightAngle,createFx} from '../src/juice.js';
import {createFlight} from '../src/core.js';

// Owned by R3. Reference = the inline plane formula from src/render.js (copied; render.js touches the canvas).
// 2D: px = v.px − charge·8, py = v.py + (f ? 0 : fbm(anim·.5,8)·2 + tremble); angle in canvas units (y down), scale (1+s, 1−.6s).
function ref2d({f,fx,charge,anim,clock,reduced}){
 charge=f?0:charge??0;
 const tremble=charge>.9&&!reduced?noise1((clock)*40,6)*1.5:0,dx=-charge*8,dy=f?0:fbm(anim*.5,8)*2+tremble;
 const stretch=fx?fx.stretch.x:-charge*.2,flutter=f&&!f.landed?noise1(anim*3,4)*.05:noise1(anim*.7,4)*.04;
 return {angle:(fx?.rotReady?fx.rot.x:flightAngle(f))-charge*.25+flutter,dx,dy,sx:1+stretch,sy:1-stretch*.6};
}
const near=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-9,`${msg}: ${a} vs ${b}`);

test('kid: lean grows with charge, waves only after the throw, reduced motion has no breathing',()=>{
 let last=-1;for(const c of [0,.25,.5,.75,1]){const k=kidPose({charge:c,t:3});assert.ok(k.lean>last&&k.back>=0);last=k.lean;}
 assert.ok(kidPose({charge:1}).back>kidPose({charge:.2}).back);
 for(const t of [0,.3,1.7,4.2]){assert.equal(kidPose({t,charge:.5}).arm,null,'holds the plane before the throw');assert.equal(typeof kidPose({t,thrown:true}).arm,'number');}
 const waves=[.1,.2,.3,.4].map(t=>kidPose({t,thrown:true}).arm);assert.ok(Math.max(...waves)-Math.min(...waves)>.3,'arm swings');
 assert.ok(waves.every(a=>a>.7&&a<1.8),'arm up (2D rotate −1,25 ± .45 → +z)');
 assert.ok([.3,.9,1.5].some(t=>Math.abs(kidPose({t}).bob)>.1),'breathes normally');
 for(const t of [0,.3,.9,1.5,7])assert.equal(kidPose({t,reduced:true}).bob,0,'no breathing with reduced motion');
 assert.equal(kidPose({t:.3,thrown:true}).bob,0,'no breathing after throw (2D)');
 assert.equal(kidPose({t:5,reduced:true}).flicker,false);
});

test('plane pose parity with render.js: same angle (sign flipped for y-up), offset in m via 2.1 px/m, same squash',()=>{
 const f=createFlight('dart',undefined,3),fx=createFx();fx.stretch.x=.17;fx.rot.x=-.31;fx.rotReady=true;
 const cases=[];
 for(const charge of [0,.3,.6,.91,1])for(const anim of [0,.37,2.4,9.1])cases.push({f:null,fx:null,charge,anim,clock:anim+.05,reduced:false},{f:null,fx,charge,anim,clock:anim*1.3,reduced:false},{f:null,fx:null,charge,anim:0,clock:anim,reduced:true});
 for(const anim of [0,1.1,3.3])cases.push({f,fx,charge:.8,anim,clock:anim},{f,fx:null,charge:0,anim,clock:anim},{f:{...f,landed:true},fx,charge:0,anim,clock:anim});
 for(const c of cases){const r=ref2d(c),p=planePose(c),tag=JSON.stringify({charge:c.charge,anim:c.anim,f:!!c.f,fx:!!c.fx,reduced:c.reduced});
  near(p.angle,-r.angle,'angle '+tag);near(p.dx*2.1,r.dx,'dx '+tag);near(-p.dy*2.1,r.dy,'dy '+tag);near(p.squash[0],r.sx,'sx '+tag);near(p.squash[1],r.sy,'sy '+tag);}
 assert.ok(planePose({charge:.95,anim:1,clock:1.234}).dy!==planePose({charge:.95,anim:1,clock:1.234,reduced:true}).dy,'tremble above 90 %');
});

// Rest camera = follow + sideCamera (perspective, pitch 6°): project HAND by hand, it must land on view(null) = (148, 258) ±2 px.
test('rest camera projects the plane in hand to (148, 258)',()=>{
 near(HAND.x,PLANE_OFFSET,'HAND.x');assert.ok(Math.abs(HAND.y-16)<1e-9&&HAND.z===0);
 const c=restCamera(),[ex,ey,ez]=c.position,[tx,ty,tz]=c.target,fw=[tx-ex,ty-ey,tz-ez],l=Math.hypot(...fw),F=fw.map(v=>v/l);
 const R=[-F[2],0,F[0]].map(v=>v/Math.hypot(F[0],F[2])),U=[R[1]*F[2]-R[2]*F[1],R[2]*F[0]-R[0]*F[2],R[0]*F[1]-R[1]*F[0]];
 const project=([x,y,z])=>{const d=[x-ex,y-ey,z-ez],dot=a=>a[0]*d[0]+a[1]*d[1]+a[2]*d[2],t=Math.tan(REST.fov*Math.PI/360),depth=dot(F);
  return [320+dot(R)/(depth*t*16/9)*320,180-dot(U)/(depth*t)*180];};
 const [sx,sy]=project([HAND.x,HAND.y,HAND.z]);assert.ok(Math.abs(sx-148)<=.05&&Math.abs(sy-258)<=.05,`HAND → ${sx.toFixed(2)}, ${sy.toFixed(2)}`);
 const [,gy]=project([HAND.x,0,0]);assert.ok(Math.abs(gy-300)<=3,`ground line ${gy}`);
 assert.ok(Math.abs(REST.width-640/2.1/1.25)<1e-9);
});
