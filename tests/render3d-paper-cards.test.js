import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {placeCards,lifeCards,hills,groundCards,cardVertices,cardTriangles,ID,CARD_D,FAR_H,PLACE_W} from '../src/render3d/paper-cards.js';
import {cityChunk,chunkOffset} from '../src/render3d/geometry.js';
import {palette} from '../src/render3d/palette.js';

// Papírové město P0 (spec research/design/06-papir-ctvrt1.md kap. 4): karty a rozpočet na místo (stíny na zem: render3d-paper-shadow.test.js).
const HEX=/^#[0-9a-f]{6}$/;
test('ID vrstev: dálka, střed, ulice, zem, mraky, balóny (zem přijímá stín, vrstvy mají ztmavenou patu)',()=>{
 assert.deepEqual(ID,{sky:0,far:1,mid:2,near:4,ground:8,cloud:16,balloon:32});
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

// Rozpočet místa: hlavní průchod = země + 3 vrstvy karet; stíny na zem jsou zvláštní průchod do masky (3 vrhače, stejné trojúhelníky vrstev,
// 08-stiny.md kap. 6). Život čtvrti 1 a kopce patří místu podle středu karty.
// Dílna (workshop.js, P3), mraky a balóny (sdílené za čtvrť) se počítají zvlášť.
function placeBudget(i,life=lifeCards(),hl=hills(-400,4*PLACE_W+400)){
 const dx=chunkOffset(i),own=c=>Math.floor((c.x+(c.w??0)/2)/PLACE_W)===i,loc=c=>({...c,x:c.x-dx}),d=Math.floor(i/4);
 const cards=[...placeCards(cityChunk(i)),...(d===0?[...life.cards.filter(c=>['near','mid','far'].includes(c.layer)),...hl].filter(own).map(loc):[])];
 const triangles=cardTriangles(cards)+cardTriangles(groundCards('papir',d)),layers=['far','mid','near'].filter(L=>cards.some(c=>c.layer===L)).length;
 return {cards:cards.length,triangles,calls:1+layers,maskCalls:layers};
}
test('rozpočet: každé z 16 míst ≤ 15 tis. trojúhelníků a ≤ 14 draw calls (počítáno z karet)',t=>{
 const life=lifeCards(),hl=hills(-400,4*PLACE_W+400);
 for(let i=0;i<16;i++){const b=placeBudget(i,life,hl);assert.ok(b.triangles<=15000,`místo ${i}: ${b.triangles} △`);assert.ok(b.calls<=14,`místo ${i}: ${b.calls} DC`);t.diagnostic(`místo ${i}: ${b.triangles} △, ${b.calls} DC`);}
});
