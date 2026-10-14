import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PAPER_KEYS as MOOD_KEYS,moodAt,breath,ROUTE_END} from '../src/render3d/mood.js';
import {ROUTE,SCREEN_METERS,SECTION_METERS,atmosphereAt} from '../src/scenes.js';

const HEX=/^#[0-9a-f]{6}$/;
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const lum=h=>{const [r,g,b]=rgb(h);return .299*r+.587*g+.114*b;};
// Všechny barvy objektu nálady jako [cesta, hex]; čísla zvlášť.
const walk=(o,p='',out={c:[],n:[]})=>{for(const [k,v] of Object.entries(o)){const q=p+'.'+k;
 if(typeof v==='string'&&v[0]==='#')out.c.push([q,v]);else if(typeof v==='number')out.n.push([q,v]);else if(v&&typeof v==='object')walk(v,q,out);}return out;};

test('17 klíčů (16 míst + úsvit za cílem) a platné hex barvy',()=>{
 assert.equal(MOOD_KEYS.length,17);assert.equal(ROUTE.length,16);assert.ok(Math.abs(ROUTE_END-4876)<1);
 MOOD_KEYS.forEach((k,i)=>{assert.equal(k.name,ROUTE[i]?.name??'Dawn');assert.ok(Math.abs(k.x-(i+.5)*SCREEN_METERS)<1e-9);
  const {c}=walk(k);assert.ok(c.length>=17);for(const [p,v] of c)assert.match(v,HEX,`klíč ${i}${p}`);assert.equal(k.sky.length,4);});
 assert.ok(MOOD_KEYS[16].x>ROUTE_END&&MOOD_KEYS[16].dawn);
 for(const x of [0,700,2500,4000,4876,6000]){const {c}=walk(moodAt(x));for(const [p,v] of c)assert.match(v,HEX,`${x} m${p}`);}
});

test('spojitost: na 1 m se barva ani číslo nezmění skokem (≤ 3 na kanál, papír má jednu náladu na čtvrť), ani na hranicích čtvrtí',()=>{
 let maxC=0,maxN=0;const at=[];
 for(let x=0;x<=5400;x+=1){const a=walk(moodAt(x)),b=walk(moodAt(x+1));
  a.c.forEach(([p,v],i)=>{const d=Math.max(...rgb(v).map((c,j)=>Math.abs(c-rgb(b.c[i][1])[j])));if(d>maxC){maxC=d;at[0]=[x,p];}});
  a.n.forEach(([p,v],i)=>{if(['.x','.place','.district'].includes(p))return;const d=Math.abs(v-b.n[i][1])/(p.includes('fog')?1000:1);if(d>maxN){maxN=d;at[1]=[x,p];}});}
 assert.ok(maxC<=3,`barva skočila o ${maxC} u ${at[0]}`);assert.ok(maxN<.01,`číslo skočilo o ${maxN} u ${at[1]}`);
 for(let i=1;i<4;i++){const x=i*SECTION_METERS,a=walk(moodAt(x-.5)),b=walk(moodAt(x+.5));// hranice čtvrti
  a.c.forEach(([p,v],j)=>assert.ok(Math.max(...rgb(v).map((c,k)=>Math.abs(c-rgb(b.c[j][1])[k])))<=3,`hranice ${i}${p}`));}
});

test('rozsahy: okna, neony, noc, déšť 0–1, mlha near < far, světla kladná, směr jednotkový',()=>{
 for(let x=0;x<=5400;x+=37){const m=moodAt(x,x/80);
  for(const v of [m.windows,m.neon,m.night,m.rain,m.particles.density,m.sun.alpha,m.sun2.alpha,m.moon.alpha,m.hold])assert.ok(v>=0&&v<=1,`${x} m`);
  assert.ok(m.fog.near>0&&m.fog.near<m.fog.far,`mlha ${x} m`);assert.ok(m.key.intensity>0&&m.hemi.intensity>0&&m.rim.intensity>=0);
  assert.ok(Math.abs(Math.hypot(...m.key.dir)-1)<1e-9);assert.equal(typeof m.particles.kind,'string');}
 assert.deepEqual(moodAt(-50),moodAt(0));assert.deepEqual(moodAt(NaN),moodAt(0));
});

test('déšť odpovídá atmosphereAt',()=>{
 for(let x=0;x<=6000;x+=13)for(const t of [0,3.3,20])assert.equal(moodAt(x,t).rain,atmosphereAt(x,t).rain);
});

test('breath tlumí pozadí, popředí nechává',()=>{
 for(const x of [100,1500,2700,4300]){const m=moodAt(x),b=breath(m,1),h=moodAt(x,0,{hold:1});
  assert.deepEqual(h,b);assert.equal(breath(m,0),m);assert.equal(b.hold,1);assert.equal(m.hold,0);
  b.sky.forEach((c,i)=>assert.ok(lum(c)<lum(m.sky[i])||lum(m.sky[i])<1));assert.ok(lum(b.fog.color)<lum(m.fog.color));
  assert.ok(b.hemi.intensity<m.hemi.intensity&&b.key.intensity<m.key.intensity&&b.neon<=m.neon);
  assert.equal(b.trail,m.trail);assert.equal(b.windows,m.windows);assert.equal(b.rain,m.rain);
  const half=breath(m,.5);assert.ok(half.hemi.intensity<m.hemi.intensity&&half.hemi.intensity>b.hemi.intensity);}
});
