import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MOOD_KEYS,moodAt,breath,ROUTE_END,CORE_HORIZON} from '../src/render3d/mood.js';
import * as comic from '../src/render3d/comic.js';
import * as verse from '../src/themes-verse.js';
import {mix} from '../src/themes.js';
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

test('spojitost: na 1 m se barva ani číslo nezmění skokem, ani na hranicích čtvrtí',()=>{
 let maxC=0,maxN=0;const at=[];
 for(let x=0;x<=5400;x+=1){const a=walk(moodAt(x)),b=walk(moodAt(x+1));
  a.c.forEach(([p,v],i)=>{const d=Math.max(...rgb(v).map((c,j)=>Math.abs(c-rgb(b.c[i][1])[j])));if(d>maxC){maxC=d;at[0]=[x,p];}});
  a.n.forEach(([p,v],i)=>{if(['.x','.place','.district'].includes(p))return;const d=Math.abs(v-b.n[i][1])/(p.includes('fog')?1000:1);if(d>maxN){maxN=d;at[1]=[x,p];}});}
 assert.ok(maxC<=2,`barva skočila o ${maxC} u ${at[0]}`);assert.ok(maxN<.01,`číslo skočilo o ${maxN} u ${at[1]}`);
 for(let i=1;i<4;i++){const x=i*SECTION_METERS,a=walk(moodAt(x-.5)),b=walk(moodAt(x+.5));// hranice čtvrti
  a.c.forEach(([p,v],j)=>assert.ok(Math.max(...rgb(v).map((c,k)=>Math.abs(c-rgb(b.c[j][1])[k])))<=1,`hranice ${i}${p}`));}
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

test('oblouk „za sluncem“: soumrak, měsíc, druhý západ, neony, úsvit; barevný, ne temný',()=>{
 const K=MOOD_KEYS;
 assert.ok(K[0].sun.alpha>.5&&K[0].sun.height<0,'Suburbs: slunce právě zapadlo');
 assert.ok(K[5].moon.alpha===1&&K[5].sun.alpha===0&&K[5].particles.kind==='drizzle','Docks: měsíc a mrholení');
 assert.ok(K[8].sun2.alpha===1&&K[8].sun2.height>0&&K[11].sun2.height<0,'Red Horizon: druhé slunce nad obzorem, pak zapadne');
 assert.ok(K[14].neon===1&&K[14].windows>=.7,'Core: neonová noc');
 assert.ok(K[16].sun.height>0&&K[16].night===0&&moodAt(ROUTE_END+SCREEN_METERS).dawn===1,'úsvit za cílem');
 for(let x=0;x<=5400;x+=50){const m=moodAt(x),avg=m.sky.reduce((s,c)=>s+lum(c),0)/4;assert.ok(avg>55,`obloha moc tmavá u ${x} m (${avg.toFixed(0)})`);
  assert.ok(lum(m.fog.color)>35&&m.hemi.intensity>=1.2,`scéna moc tmavá u ${x} m`);}
});

test('Neon Core: obzor tyrkysový #2aa99c → #7ff0d8 v klíčích 12–15, limetková nikde (bible kap. 2.3)',()=>{
 assert.deepEqual([...CORE_HORIZON],['#2aa99c','#7ff0d8']);assert.ok(Object.isFrozen(CORE_HORIZON));
 for(let i=12;i<16;i++){assert.equal(MOOD_KEYS[i].district,3);assert.deepEqual(MOOD_KEYS[i].sky.slice(2),[...CORE_HORIZON],`klíč ${i}`);}
 const LIME=['#cce65a','#d2ee48','#c4dc74','#e8d070'],hsv=h=>{const [r,g,b]=rgb(h),M=Math.max(r,g,b),d=M-Math.min(r,g,b);
  const H=!d?0:M===r?60*(((g-b)/d+6)%6):M===g?60*((b-r)/d+2):60*((r-g)/d+4);return [H,M?d/M:0];};
 for(const k of MOOD_KEYS)for(const [p,v] of walk(k).c)assert.ok(!LIME.includes(v),`${k.name}${p}`);
 for(let x=0;x<=5400;x+=5)moodAt(x).sky.forEach((c,i)=>{const [H,S]=hsv(c);assert.ok(!(H>=60&&H<=140&&S>.3),`zelený pás ${i} u ${x} m: ${c}`);});
 const ink='#15101f',L=h=>{const [r,g,b]=rgb(h).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;},cr=(a,b)=>(Math.max(L(a),L(b))+.05)/(Math.min(L(a),L(b))+.05);
 assert.ok(cr(ink,'#7ff0d8')>=13.5&&cr(ink,'#2aa99c')>=6.3,'tuš × obzor podle bible (13,6 a 6,4)');
});

test('breath tlumí pozadí, popředí nechává',()=>{
 for(const x of [100,1500,2700,4300]){const m=moodAt(x),b=breath(m,1),h=moodAt(x,0,{hold:1});
  assert.deepEqual(h,b);assert.equal(breath(m,0),m);assert.equal(b.hold,1);assert.equal(m.hold,0);
  b.sky.forEach((c,i)=>assert.ok(lum(c)<lum(m.sky[i])||lum(m.sky[i])<1));assert.ok(lum(b.fog.color)<lum(m.fog.color));
  assert.ok(b.hemi.intensity<m.hemi.intensity&&b.key.intensity<m.key.intensity&&b.neon<=m.neon);
  assert.equal(b.trail,m.trail);assert.equal(b.windows,m.windows);assert.equal(b.rain,m.rain);
  const half=breath(m,.5);assert.ok(half.hemi.intensity<m.hemi.intensity&&half.hemi.intensity>b.hemi.intensity);}
});

test('comic.js: kopie čistých částí themes-verse.js dává stejné výsledky',()=>{
 for(const t of [0,.04,.0833,.5,1,1.25,7.77,100])assert.equal(comic.onTwos(t),verse.onTwos(t));
 for(const f of [6,8,24])assert.equal(comic.onTwos(.31,f),verse.onTwos(.31,f));
 for(const k of [0,.1,.3,.5,.9,1])assert.deepEqual(comic.halftoneDots(k),verse.halftoneDots(k)),assert.equal(comic.dotRadius(k,8),verse.dotRadius(k,8));
 assert.equal(comic.dotSpacing(),verse.dotSpacing());
 for(const v of verse.VERSE)assert.deepEqual(comic.skyBands(v.sky,verse.SKY_EDGES),verse.skyBands(v.sky,verse.SKY_EDGES));
 assert.deepEqual(comic.skyBands(['#000000','#ffffff'],[0,100,200],5,30),verse.skyBands(['#000000','#ffffff'],[0,100,200],5,30));
 for(const [vx,f] of [[20,0],[80,1.3],[200,4.2]])assert.deepEqual(comic.speedLines(vx,f),verse.speedLines(vx,f));
 assert.deepEqual(comic.VERSE,verse.VERSE);assert.deepEqual(comic.SKY_EDGES,verse.SKY_EDGES);assert.equal(comic.INK,verse.INK);assert.equal(comic.TWOS,verse.TWOS);
 for(const [a,b,k] of [['#000000','#ffffff',.5],['#ff4f9e','#15101f',.42]])assert.equal(comic.mix(a,b,k),mix(a,b,k));
 assert.equal(comic.shadeTone('#c23d5a'),verse.shadeTone('#c23d5a'));
});

test('comicLook: parametry toon rampy a post-procesu podle kvality',()=>{
 const m=moodAt(3000),hi=comic.comicLook(m,'high'),lo=comic.comicLook(m,0);
 assert.deepEqual(hi.bands,comic.skyBands(m.sky,comic.SKY_EDGES));assert.equal(hi.paletteId,m.district);
 assert.equal(hi.ramp.length,3);assert.ok(hi.ramp.every((v,i,a)=>v>=0&&v<=255&&(!i||v>a[i-1])));
 assert.ok(hi.halftone===1&&lo.halftone===0&&hi.levels>=2&&hi.dotSize>0&&hi.outline.thickness>lo.outline.thickness);
 assert.match(hi.outline.color,HEX);assert.equal(comic.comicLook(m,'mid').quality,1);assert.equal(comic.comicLook(m).quality,2);
 assert.ok(comic.comicLook(moodAt(4300)).ramp[0]<comic.comicLook(moodAt(2600)).ramp[0],'v noci tvrdší stín');
});
