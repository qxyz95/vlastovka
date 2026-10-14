import {test} from 'node:test';
import assert from 'node:assert/strict';
import {placeCards,lifeCards,hills,groundCards,cardVertices,cardTriangles,cardKind,ID,CARD_D,FAR_H,PLACE_W,THIN,LISTA} from '../src/render3d/paper-cards.js';
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

// Test přenosu 1:1 z prototypu papir-data.js zrušen 15. 10.: prototyp je zmrazený v archiv/prototype/styly, zdrojem pravdy je hra.
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

// Tenké karty K3 (research/design/11-katalog-ctvrt1.md kap. 1.3, scénář C): stejná čela, méně trojúhelníků.
test('tenké karty: panel 2 △, lista 4 △, box ≤ 0,15 m sám jako panel / lista podle dílu, tenký disc jen čelem, thin:false kreslí plně',()=>{
 const b={shape:'box',x:0,w:2,y:1,h:1,z:0,d:.1,color:'#e8735a'},tri=l=>cardVertices(l).p.length/9;
 assert.equal(cardKind(b),'panel');assert.equal(cardKind({...b,part:'sill'}),'lista');assert.equal(cardKind({...b,d:THIN+.01}),'box');assert.equal(cardKind(b,false),'box');
 assert.ok(LISTA.has('cornice')&&LISTA.has('step')&&!LISTA.has('window'));
 for(const [c,n] of [[{...b,shape:'panel'},2],[{...b,shape:'lista'},4],[b,2],[{...b,part:'sill'},4],[{...b,d:1},8],[{shape:'disc',x:0,y:0,r:1,n:6,z:0,d:.08,color:'#e8735a'},4],
  [{shape:'disc',x:0,y:0,r:1,n:6,z:0,d:.5,color:'#e8735a'},18],[{shape:'gable',x:0,w:4,y:0,h:2,z:0,d:4,color:'#e8735a',roof:'#3d4f7a',eaves:false},5],
  [{shape:'eave',x:0,w:4,y:0,h:2,z:0,d:4,color:'#e8735a',roof:'#3d4f7a'},6],[{shape:'eave',x:0,w:4,y:0,h:2,z:0,d:4,color:'#e8735a',roof:'#3d4f7a',back:false},4],
  [{shape:'poly',x:0,w:2,y:0,h:2,z:0,d:.1,pts:[[1,0],[2,0],[2,1],[1,2],[0,1],[0,0]],color:'#e8735a'},4]]){
  assert.equal(cardTriangles([c]),n,`${c.shape} ${c.part??''}`);assert.equal(tri([c]),n);}
 // panel = čelo boxu, lista = čelo + horní řez: stejné vrcholy jako první 2 / 4 trojúhelníky plného boxu
 const full=cardVertices([{...b,d:1}]),pn=cardVertices([{...b,d:1,shape:'panel'}]),ls=cardVertices([{...b,d:1,shape:'lista'}]);
 assert.deepEqual(pn.p,full.p.slice(0,18));assert.deepEqual(ls.p,full.p.slice(0,36));assert.deepEqual(ls.n,full.n.slice(0,36));
 assert.equal(cardTriangles([b],{thin:false}),8);assert.equal(cardVertices([b],{thin:false}).p.length/9,8);
 // Sklony střechy okapem: přední míří nahoru a ke kameře, zadní nahoru a od kamery; poly CCW (normála +z, kladná plocha).
 const e=cardVertices([{shape:'eave',x:0,w:4,y:0,h:2,z:0,d:4,color:'#e8735a',roof:'#3d4f7a'}]);assert.ok(e.n[1]>0&&e.n[2]>0&&e.n[19]>0&&e.n[20]<0);
 const cross=(P,i)=>(P[i+3]-P[i])*(P[i+7]-P[i+1])-(P[i+6]-P[i])*(P[i+4]-P[i+1]),pv=cardVertices([{shape:'poly',x:0,w:2,y:0,h:2,z:0,d:.1,pts:[[1,0],[2,0],[2,1],[1,2],[0,1],[0,0]],color:'#e8735a'}]);
 for(let i=0;i<pv.p.length;i+=9)assert.ok(cross(pv.p,i)>0,'CCW');
 // Hranol věžičky (K4): šestiboký 3 stěny + víko = 10 △, bez víka 6, jehlan 3; stěny míří ven a ke kameře, víko nahoru, pořadí vrcholů sedí na normálu.
 const pr={shape:'prism',x:-2,w:4,y:15,h:6,z:-1,d:4*Math.sin(Math.PI/3),n:6,color:'#3d4f7a'};
 for(const [c,n] of [[pr,10],[{...pr,top:false},6],[{...pr,apex:true},3],[{...pr,n:8},14]]){assert.equal(cardTriangles([c]),n,JSON.stringify(c));assert.equal(tri([c]),n);
  const v=cardVertices([c]),P=v.p;
  for(let i=0;i<P.length;i+=9){const u=[P[i+3]-P[i],P[i+4]-P[i+1],P[i+5]-P[i+2]],w=[P[i+6]-P[i],P[i+7]-P[i+1],P[i+8]-P[i+2]],x=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
   const nn=[v.n[i],v.n[i+1],v.n[i+2]];assert.ok(x[0]*nn[0]+x[1]*nn[1]+x[2]*nn[2]>0,'CCW zvenku');assert.ok(nn[2]>=-1e-9||nn[1]>.99,'stěny ke kameře');
   const mx=(P[i]+P[i+3]+P[i+6])/3-0,mz=(P[i+2]+P[i+5]+P[i+8])/3-pr.z;if(nn[1]<.99)assert.ok(mx*nn[0]+mz*nn[2]>0,'normála ven');}
  for(let i=0;i<P.length;i+=3){assert.ok(P[i]>=c.x-1e-9&&P[i]<=c.x+c.w+1e-9&&P[i+2]>=c.z-c.d/2-1e-9&&P[i+2]<=c.z+c.d/2+1e-9,'uvnitř obalu');}}
 const fr=cardVertices([pr]);assert.ok(fr.n.some((x,i)=>i%3===2&&Math.abs(x-1)<1e-9),'čelní stěna plochou ke kameře');
 // Hra: tenké karty ubraly trojúhelníky města, ne čela (okna, prádlo, šňůry, větrníky)
 const list=[...placeCards(cityChunk(1)),...lifeCards().cards];assert.ok(cardTriangles(list)<cardTriangles(list,{thin:false}));
});
