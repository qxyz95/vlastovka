import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {placeCards,lifeCards,hills,groundCards,cardVertices,cardTriangles,skyline,skylineStrip,shadowOffset,shadowCasters,shadowZ,ID,SHADOW,CARD_D,FAR_H,PLACE_W} from '../src/render3d/paper-cards.js';
import {cityChunk,chunkOffset} from '../src/render3d/geometry.js';
import {palette} from '../src/render3d/palette.js';

// Papírové město P0 (spec research/design/06-papir-ctvrt1.md kap. 4): karty, siluety stínů, rozpočet na místo.
const HEX=/^#[0-9a-f]{6}$/;
const rand=s=>()=>(s=(s*16807)%2147483647)/2147483647;
const randomCards=seed=>{const r=rand(seed),S=['box','gable','pyr','disc','flag'];return Array.from({length:40},()=>{const shape=S[Math.floor(r()*5)],x=r()*200,w=2+r()*20;
 return shape==='disc'?{shape,x,y:r()*20,r:1+r()*6,z:0,d:1}:{shape,x,w,y:r()*10,h:.5+r()*30,z:0,d:1};});};
// Výška karty v bodě x (bez rozmazání), jak ji má skyline.
// Vzorkuje se po 1 m: karta pokrývá vzorky od round(x) do round(x+w), jako skyline.
const topAt=(b,x)=>{if(b.shape==='flag')return 0;if(b.shape==='disc'){const t=b.r*b.r-(x-b.x)**2;return t>0?b.y+Math.sqrt(t):0;}
 if(x<Math.round(b.x)||x>Math.round(b.x+b.w))return 0;if(b.shape==='gable'||b.shape==='pyr')return b.y+b.h*Math.max(0,1-Math.abs((x-(b.x+b.w/2))/(b.w/2)));return b.y+b.h;};

test('skyline bez rozmazání = sjednocení (max) karet, rozmazání nezvýší maximum ani nevytvoří stín mimo karty',()=>{
 for(const seed of [3,17,99]){const list=randomCards(seed),raw=skyline(list,-10,230,{step:1,blur:0});
  for(let i=0;i<raw.h.length;i++){const x=raw.x0+i;assert.ok(Math.abs(raw.h[i]-Math.max(0,...list.map(b=>topAt(b,x))))<1e-3,`seed ${seed} x ${x}`);}
  for(const blur of [2,4,8]){const s=skyline(list,-10,230,{step:1,blur});assert.ok(Math.max(...s.h)<=Math.max(...raw.h)+1e-4,`blur ${blur}`);
   const r=Math.round(blur/2);for(let i=0;i<s.h.length;i++){const near=raw.h.slice(Math.max(0,i-r),i+r+1);if(Math.max(...near)===0)assert.equal(s.h[i],0);}}}
 assert.equal(skyline([],0,10).h.every(v=>v===0),true);
 const strip=skylineStrip(skyline([{shape:'box',x:0,w:10,y:0,h:5,z:0,d:1}],-5,15,{blur:0}),{pen:1,z:-3});
 assert.equal(strip.position.length,strip.triangles*9);assert.equal(strip.h.length,strip.triangles*3);assert.ok(strip.position.every((v,i)=>i%3!==2||v===-3));
});

test('shadowOffset: posun ke světlu doleva dolů, měkkost s hloubkou, strop dzCap',()=>{
 const a=shadowOffset(40),b=shadowOffset(SHADOW.dzCap),c=shadowOffset(1000);
 assert.ok(a.dx<0&&a.dy<0&&b.pen>a.pen);assert.deepEqual(c,b);assert.equal(shadowOffset(0).pen,SHADOW.penMin);
 assert.deepEqual(ID,{sky:0,far:1,mid:2,near:4,ground:8,cloud:16,balloon:32});
 assert.equal(SHADOW.casters.near.mask,0xFC);assert.equal(SHADOW.casters.mid.mask,0xFE);assert.equal(SHADOW.casters.far.mask,0xFF);assert.equal(SHADOW.plane.mask,0xF8);
});

test('placeCards: deterministické, nemutuje chunk, lokální x, tloušťka karet podle vrstvy, panorama × FAR_H, barvy z palety čtvrti',()=>{
 for(let i=0;i<16;i++){const c=cityChunk(i),snap=JSON.stringify(c),a=placeCards(c),b=placeCards(cityChunk(i));
  assert.deepEqual(a,b,`místo ${i}`);assert.equal(JSON.stringify(c),snap,'chunk beze změny');assert.ok(a.length>0);
  const lo=Math.min(0,...c.blocks.map(b=>b.x)),hi=Math.max(PLACE_W,...c.blocks.map(b=>b.x+b.w));
  const D=palette('papir').city.districts[Math.floor(i/4)],allowed=new Set([...D.near,...D.mid,...D.far,...D.roof,...D.trees,D.trunk,D.flat,...D.hedge,D.glass,D.glassRoof]);
  for(const k of a){assert.match(k.color,HEX);assert.ok(['near','mid','far'].includes(k.layer));assert.ok(k.x>lo-2&&k.x<hi+2,`x ${k.x}`);
   if(k.shape!=='gable'&&k.d>.2)assert.ok(k.d<=CARD_D[k.layer]+.41,`${k.layer} d ${k.d}`);
   if(k.d>.2&&k.shape==='box'&&!allowed.has(k.color))assert.fail(`místo ${i}: barva ${k.color} mimo paletu čtvrti`);}
  assert.ok(!a.some(k=>k.shop),'Dílna se nekreslí jako karta města');}
 const c=cityChunk(5),far=c.blocks.filter(b=>b.tone===2),cards=placeCards(c).filter(k=>k.layer==='far'&&k.shape!=='gable');
 assert.ok(Math.max(...cards.map(k=>k.h))<=Math.max(...far.map(b=>b.h))*FAR_H+1e-9);
 // Ploché pásy (< 1 m) bez střech: na kolejovém loži Železnice nesmí vzniknout štít přes celé místo (bible kap. 14).
 const rail=placeCards(cityChunk(3));for(const g of rail.filter(k=>k.shape==='gable'))assert.ok(g.y>=1,'štít jen na domech');
 // Jiný styl (cyber nemá karty čtvrtí) padá na papír, neshodí se.
 assert.deepEqual(placeCards(cityChunk(1),'cyber'),placeCards(cityChunk(1)));
});

test('prototyp a hra dávají stejné karty (přenos 1:1 z papir-data.js)',async t=>{
 const url=new URL('../prototype/styly/papir-data.js',import.meta.url);if(!existsSync(url))return t.skip('prototyp smazán');
 const proto=await import(url.href);
 for(let i=0;i<4;i++)assert.deepEqual(placeCards(cityChunk(i)).map(k=>({...k,x:k.x+chunkOffset(i)})).map(k=>JSON.stringify(k)),proto.placeCards(i).map(k=>JSON.stringify(k)),`místo ${i}`);
 assert.deepEqual(lifeCards().cards,proto.lifeCards().cards);assert.deepEqual(hills(-400,1600),proto.hills(-400,1600));
 const list=proto.placeCards(1);assert.deepEqual(cardVertices(list),proto.cardVertices(list));
});

test('cardVertices: počet vrcholů odpovídá cardTriangles, normály jednotkové',()=>{
 const list=[...placeCards(cityChunk(1)),...lifeCards().cards.slice(0,200),...groundCards()],v=cardVertices(list);
 assert.equal(v.p.length,v.n.length);assert.equal(v.c.length*3,v.p.length);assert.equal(v.p.length/9,cardTriangles(list));
 for(let i=0;i<v.n.length;i+=3)assert.ok(Math.abs(Math.hypot(v.n[i],v.n[i+1],v.n[i+2])-1)<1e-6);
});

// Rozpočet místa podle bible kap. 5: země + 3 vrstvy karet + 3 pásy stínů (siluety); život čtvrti 1 a kopce patří místu podle středu karty.
// Dílna (workshop.js, P3), mraky a balóny (sdílené za čtvrť) se počítají zvlášť.
function placeBudget(i,life=lifeCards(),hl=hills(-400,4*PLACE_W+400)){
 const dx=chunkOffset(i),own=c=>Math.floor((c.x+(c.w??0)/2)/PLACE_W)===i,loc=c=>({...c,x:c.x-dx}),d=Math.floor(i/4);
 const cards=[...placeCards(cityChunk(i)),...(d===0?[...life.cards.filter(c=>['near','mid','far'].includes(c.layer)),...hl].filter(own).map(loc):[])];
 let triangles=cardTriangles(cards)+cardTriangles(groundCards('papir',d)),calls=1;
 for(const L of ['far','mid','near']){const list=cards.filter(c=>c.layer===L);if(!list.length)continue;const o=shadowOffset(SHADOW.casters[L].dz);calls+=2;
  triangles+=skylineStrip(skyline(shadowCasters(list),-20,PLACE_W+20,{step:1,blur:o.pen}),{pen:o.pen,z:shadowZ(list,L)}).triangles;}
 return {cards:cards.length,triangles,calls};
}
test('rozpočet: každé z 16 míst ≤ 15 tis. trojúhelníků a ≤ 14 draw calls (počítáno z karet)',t=>{
 const life=lifeCards(),hl=hills(-400,4*PLACE_W+400);
 for(let i=0;i<16;i++){const b=placeBudget(i,life,hl);assert.ok(b.triangles<=15000,`místo ${i}: ${b.triangles} △`);assert.ok(b.calls<=14,`místo ${i}: ${b.calls} DC`);t.diagnostic(`místo ${i}: ${b.triangles} △, ${b.calls} DC`);}
});
