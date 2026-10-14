import {test} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {MODELS,modelById,buildModel,buildShadow,modelTriangles,defaults,bounds,place,drawnLods,nearestLod,SCALE,LOD_LAYER} from '../src/render3d/models/index.js';
import {windowCut,door,gate,tones,hash,chimney,gableRoof,eaveRoof,roofAt,balcony,downpipe,dormer,shopfront,steppedGable,gableOutline,GATE} from '../src/render3d/models/parts.js';
import {skylineLayout} from '../src/render3d/models/far-skyline.js';
import {gableHeight} from '../src/render3d/models/house-gable.js';
import {WORKSHOP_AT,SIGN,KID,S} from '../src/render3d/models/workshop.js';
import {TURRET} from '../src/render3d/models/corner-turret.js';
import {PERSON} from '../src/render3d/models/person.js';
import {LAMP} from '../src/render3d/models/street-lamp.js';
import {HAND} from '../src/render3d/pose.js';
import {cityChunk} from '../src/render3d/geometry.js';
import {cardVertices,cardTriangles,CARD_D} from '../src/render3d/paper-cards.js';
import {CARD_DEPTH} from '../src/render3d/models/scale.js';
import {palette,PAPIR,PAPER_TOKENS as PT,mix} from '../src/render3d/palette.js';

// Katalog modelů (research/design/10-katalog-modelu.md, K1) a modely skupin G1 (11-katalog-ctvrt1.md, K3) a G2 (K4): rozhraní, LOD, stropy, měřítko, determinismus.
const HEX=/^#[0-9a-f]{6}$/,SHAPES=new Set(['box','panel','lista','gable','eave','pyr','disc','flag','poly','prism']),near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
const D1=()=>palette('papir').city.districts[0];
// Kombinace parametrů (kartézský součin); barvy a vrstva nemění počet karet, proto se u velkých modelů berou jen výchozí.
const variants=(m,{all=false}={})=>Object.entries(m.params).reduce((acc,[k,v])=>acc.flatMap(p=>(all||!['color','roof','layer'].includes(k)?v.values:[v.default]).map(x=>({...p,[k]:x}))),[{}]);
const inScope=(m,p)=>!m.trisScope||Object.entries(m.trisScope).every(([k,v])=>p[k]<=v);
const sample=(m,n=60)=>{const all=variants(m);return all.length<=n?all:Array.from({length:n},(_,i)=>all[Math.floor(i*all.length/n)]);};
// Výjimky z „bez hořčicové a bílé“ (bible 05 kap. 9, P3): dítě v hořčicové pláštěnce s bílou skládanou čepicí, vystřižená vlaštovka na stole Dílny.
const EXEMPT={workshop:{kid:[PT.mustard,PT.paper],deskPlane:[PT.paper]}};
// Prostor variant K1 (2–4 patra × 2–3 osy × seed 1–5, ostatní výchozí) a průměr △ před K3 (11 kap. 1.3: LOD 0 ⌀ 488, LOD 1 ⌀ 85).
const K1_SPACE=[2,3,4].flatMap(floors=>[2,3].flatMap(bays=>[1,2,3,4,5].map(seed=>({floors,bays,seed}))));

test('registr: G1 a G2 objekty, povinná pole, jednoznačné id, 3 LOD, volitelný stínový proxy',()=>{
 assert.deepEqual(MODELS.map(m=>m.id),['house-row','house-gable','far-skyline','chimney','workshop','corner-turret','person','street-lamp']);
 assert.equal(new Set(MODELS.map(m=>m.id)).size,MODELS.length);assert.deepEqual([...LOD_LAYER],['near','mid','far']);
 for(const m of MODELS){
  for(const k of ['id','name','prototype','purpose'])assert.ok(typeof m[k]==='string'&&m[k].length>2,`${m.id}.${k}`);
  assert.match(m.id,/^[a-z0-9-]+$/);assert.ok(Number.isInteger(m.district)&&m.district>=0&&m.district<4,`${m.id}.district`);
  for(const k of ['w','h','d'])assert.ok(m.size[k]>0&&m.size[k]<200,`${m.id}.size.${k}`);
  assert.equal(m.lod.length,3);assert.ok(m.lod.every(f=>typeof f==='function'));assert.equal(m.tris.length,3);assert.ok(m.tris.every(v=>v>=0));
  assert.ok(drawnLods(m).length>=1);if(m.shadow)assert.equal(typeof m.shadow,'function');
  for(const [k,v] of Object.entries(m.params)){assert.ok(v.values.length>=1,`${m.id}.${k}`);assert.ok(v.values.includes(v.default),`${m.id}.${k} default`);}
  assert.equal(modelById(m.id),m);assert.ok(Object.isFrozen(m));}
 assert.equal(modelById('nope'),null);assert.throws(()=>buildModel('nope'));
 const far=modelById('far-skyline');assert.deepEqual(drawnLods(far),[2]);assert.equal(nearestLod(far,0),2);assert.equal(nearestLod(modelById('house-row'),1),1);
});

test('karty: platný tvar, barva z palety (hex, bez hořčicové a bílé), konečná čísla; cardVertices sedí na cardTriangles; nekreslený LOD je prázdný',()=>{
 for(const m of MODELS)for(const p of sample(m,24))for(let lod=0;lod<3;lod++){const list=buildModel(m,lod,p);
  if(!m.tris[lod]){assert.equal(list.length,0,`${m.id} LOD ${lod} se nekreslí`);continue;}
  assert.ok(list.length>0);
  for(const c of list){assert.ok(SHAPES.has(c.shape),c.shape);assert.match(c.color,HEX,`${m.id} ${c.part}`);if(c.shape==='gable'||c.shape==='eave')assert.match(c.roof,HEX);
   assert.ok(![PT.mustard,PT.paper].includes(c.color)||EXEMPT[m.id]?.[c.part]?.includes(c.color),`${m.id} ${c.part}: zakázaná barva ${c.color}`);
   for(const k of ['x','y','z','d',...(c.shape==='disc'?['r']:['w','h'])])assert.ok(Number.isFinite(c[k])&&(['x','y','z'].includes(k)||c[k]>0),`${m.id} ${c.part}.${k}=${c[k]}`);
   if(c.shape==='poly')assert.ok(c.pts.length>=3&&c.pts.flat().every(Number.isFinite));}
  const v=cardVertices(list);assert.equal(v.p.length/9,cardTriangles(list));}
});

test('LOD: △ ubývá mezi kreslenými LOD v každé variantě, drží strop tris (11 kap. 4.3) a LOD 2 zachová siluetu LOD 0',t=>{
 for(const m of MODELS){const max=[0,0,0],L=drawnLods(m);
  for(const p of variants(m)){const n=[0,1,2].map(l=>modelTriangles(m,l,p));
   for(let i=1;i<L.length;i++)assert.ok(n[L[i-1]]>n[L[i]],`${m.id} ${JSON.stringify(p)}: ${n}`);
   if(inScope(m,p))n.forEach((v,i)=>max[i]=Math.max(max[i],v));
   if(L.includes(0)&&L.includes(2)){const b0=bounds(buildModel(m,0,p)),b2=bounds(buildModel(m,2,p));
    // Silueta (obrys v x–y) se mezi LOD nemění víc než o přesah drobností (parapety, stříška, hlavice a nástavce komína).
    assert.ok(Math.abs(b0.y1-b2.y1)<=.7&&b2.y0<=b0.y0+.01&&Math.abs(b0.w-b2.w)<=1.2,`${m.id} silueta ${JSON.stringify(p)}`);}}
  max.forEach((v,i)=>assert.ok(v<=m.tris[i],`${m.id} LOD ${i}: ${v} > ${m.tris[i]}`));t.diagnostic(`${m.id}: max △ ${max.join(' / ')} (strop ${m.tris.join(' / ')})`);}
});

test('G0 scénář C: house-row v prostoru variant K1 klesne z ⌀ 488 na ⌀ ≤ 190 △ (LOD 1 z 85 na ≤ 50), čela a silueta zůstanou',t=>{
 const m=modelById('house-row'),avg=l=>K1_SPACE.reduce((s,p)=>s+modelTriangles(m,l,p),0)/K1_SPACE.length,a0=avg(0),a1=avg(1);
 assert.ok(a0<=190&&a0>=110,`LOD 0 ⌀ ${a0}`);assert.ok(a0<=488*.45,'úspora ≥ 55 %');assert.ok(a1<=50&&a1>=30,`LOD 1 ⌀ ${a1}`);
 t.diagnostic(`house-row K1 prostor: ⌀ ${a0.toFixed(1)} / ${a1.toFixed(1)} / ${avg(2).toFixed(1)} △`);
 // Tenké karty kreslí stejná čela (plocha ploch s normálou +z) a stejný obal vrcholů jako plné karty; ubyly jen boky a horní řezy pod 1 px.
 const fronts=v=>{let a=0;for(let i=0;i<v.n.length;i+=9)if(v.n[i+2]===1){const P=v.p;a+=Math.abs((P[i+3]-P[i])*(P[i+7]-P[i+1])-(P[i+6]-P[i])*(P[i+4]-P[i+1]))/2;}return a;},box=v=>{const b=[Infinity,-Infinity,Infinity,-Infinity,-Infinity];
  for(let i=0;i<v.p.length;i+=3){b[0]=Math.min(b[0],v.p[i]);b[1]=Math.max(b[1],v.p[i]);b[2]=Math.min(b[2],v.p[i+1]);b[3]=Math.max(b[3],v.p[i+1]);b[4]=Math.max(b[4],v.p[i+2]);}return b;};
 for(const mm of MODELS)for(const p of sample(mm,30))for(const l of drawnLods(mm)){const list=buildModel(mm,l,p),thin=cardVertices(list),full=cardVertices(list,{thin:false});
  assert.ok(near(fronts(thin),fronts(full),1e-6*fronts(full)),`${mm.id} LOD ${l} plocha čel`);box(thin).forEach((v,i)=>assert.ok(near(v,box(full)[i],1e-9),`${mm.id} LOD ${l} obal`));
  assert.ok(cardTriangles(list)<=cardTriangles(list,{thin:false}));}
});

test('měřítko: okna 1,2 × 1,4 m nad sebou po 3 m, dveře 2,2 m u země, jeden vchod, komín nad hřebenem, rozměry výchozí varianty = size',()=>{
 assert.deepEqual({...SCALE,door:{...SCALE.door},win:{...SCALE.win}},{floor:3,door:{w:1.1,h:2.2},win:{w:1.2,h:1.4},sill:.9,person:1.7,plane:7.75});
 assert.deepEqual({...CARD_DEPTH},{...CARD_D},'hloubka karet jako paper-cards');
 for(const m of MODELS){
  const b=bounds(buildModel(m,nearestLod(m,0)));for(const k of ['w','h','d'])assert.ok(Math.abs(b[k]-m.size[k])<=.5,`${m.id} size.${k}: ${b[k].toFixed(2)} vs ${m.size[k]}`);
  for(const p of sample(m,80))for(let lod=0;lod<2;lod++){const list=buildModel(m,lod,p),q={...defaults(m),...p};
   const win=list.filter(c=>c.part==='window'),doors=list.filter(c=>c.part==='door'),gates=list.filter(c=>c.part==='gate');
   for(const c of win){assert.ok(near(c.w,SCALE.win.w)&&near(c.h,SCALE.win.h),`${m.id} okno ${c.w}×${c.h}`);
    {const u=(c.y-SCALE.sill-(m.ground??SCALE.floor)+SCALE.floor)/SCALE.floor;assert.ok(near(u,Math.round(u),1e-9),`${m.id} okno mimo patro y=${c.y}`);}}
   for(const c of doors){assert.ok(near(c.h,SCALE.door.h)&&near(c.w,SCALE.door.w),`${m.id} dveře ${c.w}×${c.h}`);assert.ok(c.y<.3,'dveře u země');}
   for(const c of gates){assert.ok(near(c.w,GATE.w)&&near(c.h,GATE.h)&&c.y===0,'průjezd');}
   if(m.id==='house-row'||m.id==='house-gable'){assert.equal(doors.length+gates.length,1,`${m.id}: jeden vchod`);const H=q.floors*SCALE.floor;
    assert.ok(list.some(c=>c.part==='wall'&&near(c.h,H)),'stěna = patra × 3 m');assert.equal(gates.length,q.ground==='gate'?1:0);
    assert.equal(list.some(c=>c.part==='shop'),q.ground==='shop','výloha jen u obchodu');}
   if(m.id==='house-row'){assert.ok(list.some(c=>c.part==='chimney'),'komín');
    // okna nad sebou: každá osa má v patrech okno (kromě vchodu, výlohy a balkonu)
    assert.equal(new Set(win.map(c=>(c.x+c.w/2).toFixed(3))).size,q.bays);
    const roof=list.find(c=>c.part==='roof'),top=Math.max(...list.filter(c=>c.part==='chimney').map(c=>c.y+c.h)),ridge=roof?roof.y+roof.h:q.floors*3;
    assert.ok(top-ridge>=(roof?1:1.2)-1e-9,`komín ${top} nad hřebenem ${ridge}`);}
   if(m.id==='house-gable'){assert.equal(new Set(win.map(c=>(c.x+c.w/2).toFixed(3))).size,3,'2 osy + okno ve štítu');
    const gh=gableHeight(q.seed);assert.ok(gh>=4&&gh<=6);assert.ok(near(bounds(list).y1,q.floors*3+gh,1e-9),'vrchol štítu');}}}
});

test('house-row: parametry karty 1 (patra, osy, střechy, přízemí, vikýře, vrstva) a barvy podle vrstvy',()=>{
 const m=modelById('house-row'),D=D1();
 assert.deepEqual(m.params.floors.values,[2,3,4,5,6,7,8,9,10,11,12]);assert.deepEqual(m.params.bays.values,[2,3,4,5,6]);
 for(const p of variants(m).filter((_,i)=>i%7===0)){const l=buildModel(m,0,p),w=l.find(c=>c.part==='wall');
  assert.ok(near(w.w,p.bays*2.4+1.4),'šířka = osy · 2,4 + 1,4');assert.ok(D.near.includes(w.color));
  const r=l.find(c=>c.part==='roof');assert.equal(r?.shape??'flat',{gable:'gable',eave:'eave',flat:'flat'}[p.roofType]);if(r)assert.ok(D.roof.includes(r.roof));
  if(p.roofType==='flat')assert.ok(l.some(c=>c.part==='coping'),'atika');
  assert.equal(l.filter(c=>c.part==='dormer'&&c.shape==='box').length,p.roofType==='eave'?p.dormers:0,'vikýře jen na střeše okapem');
  // D-1: příčky a kliky se v ulici nekreslí
  assert.ok(!l.some(c=>c.part==='mullion'||c.part==='knob'));}
 assert.ok(D.mid.includes(buildModel(m,1).find(c=>c.part==='wall').color),'střed = D1.mid');assert.ok(D.near.includes(buildModel(m,1,{layer:'near'}).find(c=>c.part==='wall').color),'vrstva přepíše LOD');
 assert.equal(buildModel(m,1,{layer:'near'}).find(c=>c.part==='wall').d,CARD_DEPTH.near);assert.equal(buildModel(m,1).find(c=>c.part==='wall').d,CARD_DEPTH.mid);
 // truhlíky u 30 % oken pater
 const p={floors:7,bays:6,seed:3},l=buildModel(m,0,p),upper=l.filter(c=>c.part==='window'&&c.y>3).length,fl=l.filter(c=>c.part==='flowerbox').length;assert.equal(fl,Math.round((upper+(l.some(c=>c.part==='balconyDoor')?1:0))*.3));
 // LOD 2 = tělo lista 4 + střecha 4–5 (+ atika 4) + komín lista 4 ≤ 13
 for(const roofType of ['gable','eave','flat'])assert.ok(modelTriangles(m,2,{roofType})<=13);
});

test('far-skyline: 2–4 budovy, sousedi ≥ 3 m rozdíl, 1–3 prvky siluety, bez oken, tónové barvy D1.far',()=>{
 const m=modelById('far-skyline'),D=D1();
 for(const p of variants(m,{all:true})){const L=skylineLayout(p),B=L.buildings;
  assert.ok(B.length>=2&&B.length<=4);assert.ok(near(B.reduce((s,b)=>s+b.w,0),p.w,1e-9),'budovy vyplní blok');
  for(let i=1;i<B.length;i++)assert.ok(Math.abs(B[i].h-B[i-1].h)>=3-1e-9,`sousední výšky ${B[i-1].h} ${B[i].h}`);
  assert.ok(L.elements.length>=1&&L.elements.length<=3);assert.ok(B.some(b=>!b.roof),'aspoň jedna plochá střecha');
  for(const e of L.elements)if(B[e.i].roof)assert.equal(e.kind,'chimney');
  const list=buildModel(m,2,p),walls=list.filter(c=>c.part==='wall');assert.equal(walls.length,B.length);
  assert.ok(!list.some(c=>['window','door'].includes(c.part)));for(const c of walls){assert.ok(D.far.includes(c.color));assert.equal(c.d,CARD_DEPTH.far);}
  for(const c of list.filter(c=>c.shape==='pyr'||c.shape==='disc'||c.shape==='gable'))assert.ok(D.far.some(w=>mix(w,D.roof[0],.25)===(c.roof??c.color)));}
});

test('determinismus: stejné parametry = stejné karty, buildModel nemutuje, seed mění jen drobnosti',()=>{
 for(const m of MODELS){const p=defaults(m),snap=JSON.stringify(p);
  for(let lod=0;lod<3;lod++)assert.deepEqual(buildModel(m,lod,p),buildModel(m,lod,{...p}));assert.equal(JSON.stringify(p),snap);
  const seeds=m.params.seed?.values??[];if(seeds.length>1){const L=nearestLod(m,0),all=seeds.map(s=>JSON.stringify(buildModel(m,L,{seed:s})));
   assert.ok(new Set(all).size>1,'seed dává varianty');
   if(m.id==='house-row')for(const s of seeds)assert.ok(Math.abs(bounds(buildModel(m,2,{seed:s})).w-bounds(buildModel(m,2,{seed:seeds[0]})).w)<1e-9);}}
 assert.equal(hash(7,3),hash(7,3));assert.notEqual(hash(7,3),hash(7,4));for(let i=0;i<200;i++){const v=hash(i,i*3);assert.ok(v>=0&&v<1);}
});

test('stínový proxy: ≤ 7 △, jen čela, obrys CCW a uvnitř obalu LOD 0',()=>{
 const area=pts=>pts.reduce((s,[x,y],i)=>{const [u,v]=pts[(i+1)%pts.length];return s+x*v-u*y;},0)/2;
 for(const m of MODELS)for(const p of sample(m,30)){const s=buildShadow(m,p),b=bounds(buildModel(m,nearestLod(m,0),p));
  assert.ok(cardTriangles(s)<=7,`${m.id} stín ${cardTriangles(s)} △`);assert.ok(s.every(c=>c.shape==='poly'||c.shape==='panel'));
  for(const c of s.filter(c=>c.shape==='poly'))assert.ok(area(c.pts)>0,'CCW');
  const bs=bounds(s);assert.ok(bs.x0>=b.x0-.01&&bs.x1<=b.x1+.01&&bs.y1<=b.y1+.01,`${m.id} stín mimo obal`);
  const v=cardVertices(s);for(let i=0;i<v.n.length;i+=3)assert.equal(v.n[i+2],1);}
});

test('díly: tenké karty a D-1 (okno, dveře, průjezd, balkon, svod, komín, vikýř, výloha, štít), place nemutuje',()=>{
 const t=tones('#e8735a');assert.ok(Object.values(t).every(c=>HEX.test(c)));
 assert.equal(windowCut({cx:0,y:1,t,lod:2}).length,0);assert.deepEqual(windowCut({cx:0,y:1,t,lod:1}).map(c=>c.shape),['panel']);
 const w0=windowCut({cx:0,y:1,t,lod:0});assert.equal(cardTriangles(w0),8,'rám 2 + tabulka 2 + parapet 4');assert.ok(!w0.some(c=>c.part==='mullion'));
 assert.ok(windowCut({cx:0,y:1,t,lod:0,mullion:true}).some(c=>c.part==='mullion'),'příčka jen na přání (Dílna)');
 assert.ok(windowCut({cx:0,y:1,t,lod:0,shutter:'#5aa6a0',flowers:['#9c7a55','#e8735a']}).length>w0.length);
 assert.equal(door({cx:0,t,lod:2}).length,0);assert.equal(door({cx:0,t,lod:1})[0].y,0);const d0=door({cx:0,t,lod:0,canopy:'#3d4f7a'});
 assert.ok(!d0.some(c=>c.part==='knob'));assert.equal(cardTriangles(d0),12);assert.equal(cardTriangles(gate({cx:0,t,lod:0})),4);assert.equal(gate({cx:0,t,lod:2}).length,0);
 const bal=balcony({cx:0,w:2.1,y:3,color:'#ef9c87',rail:'#4a4038'});assert.equal(bal.length,3);assert.equal(cardTriangles(bal),10,'deska + zábradlí jedna karta + madlo');
 const dp=downpipe({x:0,y:9,color:'#000000'});assert.ok(near(dp.w,.2)&&dp.shape==='panel');
 const r=gableRoof({x:-4,w:8,y:9,d:4,wall:'#e8735a',roof:'#3d4f7a'}),ch=chimney({r,cx:2,color:'#9a4a3a',cap:'#ffffff',lod:0});
 assert.ok(ch[0].y<roofAt(r,1.6)&&ch[0].y<roofAt(r,2.4),'komín zapuštěný do střechy');assert.ok(near(ch[0].y+ch[0].h,r.y+r.h+1),'dřík 1 m nad hřebenem');
 assert.equal(cardTriangles(ch),16);assert.equal(cardTriangles(chimney({r,cx:2,color:'#9a4a3a',cap:'#ffffff',lod:0,stacks:2})),20);
 assert.equal(cardTriangles(chimney({r,cx:2,color:'#9a4a3a',lod:1})),8);assert.equal(cardTriangles(chimney({r,cx:2,color:'#9a4a3a',lod:2})),4);
 assert.ok(near(ch[1].w,1.1)&&near(ch[1].h,.3)&&ch[1].shape==='lista','hlavice 1,1 × 0,3 m');
 assert.equal(cardTriangles([gableRoof({x:0,w:8,y:0,d:4,wall:'#e8735a',roof:'#3d4f7a',eaves:false})]),5);
 const er=eaveRoof({x:-4,w:8,y:9,d:4,wall:'#e8735a',roof:'#3d4f7a'});assert.equal(cardTriangles([er]),6);assert.equal(cardTriangles([{...er,back:false}]),4);
 const ce=chimney({r:er,cx:2,color:'#9a4a3a',lod:1})[0];assert.ok(ce.y<r.y+er.h&&near(ce.y+ce.h,er.y+er.h+1),'komín na hřebeni střechy okapem');
 assert.equal(cardTriangles(dormer({cx:0,y:9.3,front:.3,back:-2,t,roof:'#3d4f7a',lod:0})),21);assert.equal(cardTriangles(dormer({cx:0,y:9.3,front:.3,back:-2,t,roof:'#3d4f7a',lod:1})),5);
 const sf=shopfront({x0:-1,x1:1,t,glass:'#cfe2ec',awning:'#5aa6a0',lod:0});assert.ok(cardTriangles(sf)>=14&&cardTriangles(sf)<=20,`výloha ${cardTriangles(sf)}`);
 assert.equal(cardTriangles(shopfront({x0:-1,x1:1,t,glass:'#cfe2ec',awning:'#5aa6a0',lod:1})),4);assert.ok(Math.max(...sf.map(c=>c.y+c.h))<3-.18,'pod kordonem přízemí');
 const G={x:-3.1,w:6.2,y:12,h:5,color:'#e8735a'};
 assert.equal(cardTriangles(steppedGable({...G,kind:'stepped',lod:0})),12);assert.equal(cardTriangles(steppedGable({...G,kind:'stepped',lod:1})),6);
 assert.equal(cardTriangles(steppedGable({...G,kind:'bell',lod:0})),10);assert.equal(cardTriangles(steppedGable({...G,kind:'bell',lod:1})),6);assert.equal(cardTriangles(steppedGable({...G,kind:'plain',lod:0})),1);
 for(const kind of ['stepped','bell','plain'])assert.ok(near(Math.max(...gableOutline({...G,kind}).map(p=>p[1])),17),'vrchol štítu');
 const list=buildModel(MODELS[1],0),s=JSON.stringify(list),moved=place(list,{x:100,z:-20});assert.equal(JSON.stringify(list),s);
 assert.ok(near(bounds(moved).x0,bounds(list).x0+100)&&near(bounds(moved).z1,bounds(list).z1-20));
 const pm=moved.find(c=>c.shape==='poly'||c.part==='gable');if(pm?.pts)assert.ok(near(pm.pts[0][0],list.find(c=>c.pts).pts[0][0]+100));
});

// ── G2 (K4): Dílna, nárožní dům s věžičkou, člověk, lampa (11-katalog-ctvrt1.md karty 5–8).
const front=c=>c.z+c.d/2,same=(a,b,e=1e-9)=>['x','w','y','h'].every(k=>near(a[k],b[k],e))&&near(front(a),front(b),e);
// Grafit (jediná tuš) jen do 8 m nad zemí (11 kap. 1.4, P1). Výjimky: barvy Dílny z P3 beze změny (bible 05 kap. 9: zábradlí, provázky, dítě).
const GRAPHITE_OK={workshop:new Set(['kid','string','railing'])};
test('G2 barvy: grafit nejvýš 8 m nad zemí, hořčicová jen pláštěnka dítěte (klika Dílny ne)',()=>{
 for(const m of MODELS)for(const p of sample(m,24))for(const l of drawnLods(m))for(const c of buildModel(m,l,p)){
  if(c.color===PT.graphite&&!GRAPHITE_OK[m.id]?.has(c.part))assert.ok((c.shape==='disc'?c.y+c.r:c.y+c.h)<=8+1e-9,`${m.id} ${c.part}: grafit ve výšce ${c.y}`);
  if(c.color===PT.mustard)assert.equal(`${m.id} ${c.part}`,'workshop kid');}
 assert.ok(buildModel('workshop',0,{door:'p3'}).some(c=>c.part==='knob'&&c.color!==PT.mustard));
});

test('workshop: vychází z P3 workshopCards (dům, štít, dílenské okno se stolem, přístavek do výšky ruky dítěte, zábradlí, cedulka)',async()=>{
 registerHooks({resolve:(spec,ctx,next)=>spec==='three'?{url:new URL('../vendor/three/three.module.min.js',import.meta.url).href,shortCircuit:true}:next(spec,ctx)});
 const P3=await import('../src/render3d/workshop.js'),old=P3.workshopCards(),sg=P3.paperSign();
 assert.deepEqual({...KID},{x:P3.KID.x,y:P3.KID.y,z:P3.KID.z});assert.equal(S,P3.S);
 const shop=cityChunk(0).blocks.find(b=>b.shop);assert.deepEqual([WORKSHOP_AT.z,shop.x,shop.w,shop.h],[shop.z+shop.d/2,20,24,12],'dům = blok cityChunk(0) shop');
 for(const door of ['world','p3']){const cards=place(buildModel('workshop',0,{door,kid:0}),WORKSHOP_AT);
  // Všechny karty P3 kromě dveří, kliky a provázků (P3: nulová výška) mají v modelu kartu se stejným čelem; dveře P3 jen ve variantě p3.
  for(const c of old){const kind=c.color===PAPIR.workshop.door?'door':c.color===PAPIR.workshop.knob?'knob':c.color===PAPIR.workshop.string&&c.h<.01?'string':'';
   if(kind==='string'||kind==='knob'||(kind&&door==='world'))continue;
   assert.ok(cards.some(k=>same(k,c)),`${door}: chybí karta P3 ${c.shape} ${c.color} x=${c.x}`);}
  const sign=cards.find(c=>c.part==='sign');assert.ok(near(sign.x+sign.w/2,sg.x)&&near(sign.y+sign.h/2,sg.y)&&near(sign.w,sg.w)&&near(front(sign),sg.z));
  const terrace=cards.find(c=>c.part==='terrace');assert.ok(near(terrace.y+terrace.h,KID.y),'terasa ve výšce chodidel dítěte');assert.ok(terrace.x+terrace.w>=HAND.x+7,'přístavek až za ruku');}
 assert.ok(near(SIGN.x+WORKSHOP_AT.x,sg.x));
});

test('workshop: doplňky karty 5 (příčky, okenice, komín, truhlík, kolo, schránka, hřebíky, police), dítě volitelně, LOD 2 hmota ≤ 30 △',()=>{
 const m=modelById('workshop'),W=PAPIR.workshop,l=buildModel(m,0),has=part=>l.filter(c=>c.part===part);
 assert.ok(has('mullion').length>=3,'příčky dílenského okna');assert.equal(has('shutter').length,1,'okenice u horního okna');
 const top=Math.max(...has('chimney').map(c=>c.y+c.h)),ridge=Math.max(...l.filter(c=>c.part==='roof').map(c=>c.y+c.h));assert.ok(top-ridge>=1,'komín nad hřebenem');
 assert.ok(has('flowerbox').length===1&&has('flower').length>=3,'truhlík s květinami');assert.ok(has('mailbox').every(c=>c.color===PT.tomato)&&has('mailbox').length===1);
 const wheels=has('bike').filter(c=>c.shape==='disc');assert.equal(wheels.length,2);assert.ok(wheels.every(c=>c.d<=.1&&near(c.y,c.r)),'kola jen čelem na zemi');
 assert.ok(has('bike').some(c=>c.color===palette('papir').city.districts[0].near[2]),'rám kola teal');
 assert.equal(has('nail').length,2);assert.equal(has('string').length,2);assert.ok(has('papers').length>=2&&has('shelf').length===1);
 assert.ok(has('kid').some(c=>c.color===W.shirt)&&!buildModel(m,0,{kid:0}).some(c=>c.part==='kid'),'dítě jen s kid: 1');
 assert.equal(cardTriangles(buildModel(m,0))-cardTriangles(buildModel(m,0,{kid:0})),49,'dítě P3 (kvádry) ~50 △');
 // Barvy jen z PAPIR.workshop, palety čtvrti 1 a života (kolo, schránka, truhlík, hřebíky, komín).
 const D=palette('papir').city.districts[0],life=palette('papir').life,ok=new Set([...Object.values(W),D.near[2],D.trunk,PT.tomato,PT.pencil,PT.pencil700,...life.balloons,...life.pastel,life.chimney,
  ...Object.values(tones(life.chimney)),...Object.values(tones(W.wall)),...Object.values(tones(W.annex))]);
 for(const p of variants(m))for(const c of buildModel(m,0,p))assert.ok(ok.has(c.color),`${c.part} ${c.color}`);
 // Dveře světa 1,1 × 2,2 m (dva vchody: dům a přístavek), varianta p3 = dveře P3 4,2 × 6 m.
 assert.equal(has('door').length,2);const wide=buildModel(m,0,{door:'p3'}).filter(c=>c.part==='wideDoor');assert.ok(wide.length===2&&near(wide[0].w,4.2)&&near(wide[0].h,6));
 assert.ok(modelTriangles(m,2)<=30&&modelTriangles(m,2,{kid:0})<modelTriangles(m,2));assert.equal(buildModel(m,1).length,0,'LOD 1 se nekreslí');
});

test('corner-turret: přízemí + 4 patra, arkýř přes 3 patra, šestiboká věžička (3 stěny) s jehlanem do 25 m a praporkem, zrcadlení',()=>{
 const m=modelById('corner-turret'),D=palette('papir').city.districts[0],l=buildModel(m,0),by=part=>l.filter(c=>c.part===part);
 const wall=l.find(c=>c.part==='wall');assert.ok(near(wall.h,15)&&near(wall.w,14)&&wall.color===D.near[6]);
 const drum=by('turret')[0],helm=by('helm')[0];assert.equal(drum.shape,'prism');assert.equal(drum.n,6);assert.equal(cardTriangles([drum]),6,'3 viditelné stěny');
 assert.ok(near(drum.w,4)&&near(drum.y,15)&&near(drum.y+drum.h,21),'buben ⌀ 4 m nad římsou');assert.ok(helm.apex&&near(helm.y+helm.h,25),'jehlan do 25 m');
 assert.equal(drum.color,D.near[6],'buben v barvě stěny (14. 10.)');assert.ok([helm.color,l.find(c=>c.part==='roof').roof].every(c=>c===D.roof[0]),'jehlan a střecha #3d4f7a');
 const flag=by('flag')[0];assert.ok(flag.color===PT.tomato&&near(flag.w,1)&&near(flag.h,.7)&&flag.y>25,'praporek 1 × 0,7 m nad jehlanem');
 const oriel=by('oriel').find(c=>c.shape==='box');assert.ok(near(oriel.y,6)&&near(oriel.y+oriel.h,15)&&oriel.color===tones(D.near[6]).trim,'arkýř 2.–4. patro');
 const ow=l.filter(c=>c.part==='window'&&near(c.x+c.w/2,TURRET.cx)&&c.z>.5);assert.equal(ow.length,4,'3 okna arkýře + okno věžičky');
 assert.equal(by('balcony').length,2);assert.ok(by('flower').length>=6,'balkony s květinami');assert.equal(l.filter(c=>c.part==='door').length,1);assert.ok(by('shop').length>0);
 const L=buildModel(m,0,{side:'left'}),b=bounds(l),bl=bounds(L);assert.ok(near(bl.x0,-b.x1)&&near(bl.x1,-b.x0)&&near(bl.y1,b.y1));assert.equal(cardTriangles(L),cardTriangles(l));
 assert.ok(L.find(c=>c.part==='turret').x<0,'věžička vlevo');
 for(const c of [...L,...buildShadow(m,{side:'left'})].filter(c=>c.pts)){const a=c.pts.reduce((s,[x,y],i)=>{const [u,v]=c.pts[(i+1)%c.pts.length];return s+x*v-u*y;},0);assert.ok(a>0,`${c.part} CCW po zrcadlení`);}
});

test('person: 1,7 m (dítě 1,2 m), chodidla na zemi, 3 postoje, LOD 0 ≤ 20 △ i s doplňkem, LOD 1 = 10 △, barvy z life.people',()=>{
 const m=modelById('person'),L=palette('papir').life.people,hair=[PT.pencil,palette('papir').city.districts[0].trunk,PT.kraft];
 for(const p of variants(m,{all:true}).filter((_,i)=>i%5===0)){const l=buildModel(m,0,p),b=bounds(l),k=p.child?PERSON.child:1;
  assert.ok(near(b.y0,0,1e-6),`chodidla ${b.y0}`);if(p.pose!=='sit')assert.ok(near(b.y1,SCALE.person*k,1e-6),`výška ${b.y1}`);else assert.ok(b.y1<SCALE.person*k-.1);
  assert.ok(L.cloth.includes(l.find(c=>c.part==='trunk').color)&&L.skin.includes(l.find(c=>c.part==='head').color));
  const h=l.find(c=>c.part==='hair'||c.part==='hat');assert.ok(hair.includes(h.color)||h.part==='hat');
  assert.equal(l.filter(c=>c.part==='arm').length,2);assert.equal(buildModel(m,1,p).filter(c=>c.part==='arm').length,0);
  assert.equal(modelTriangles(m,0,p),p.extra==='none'?18:20);assert.equal(modelTriangles(m,1,p),10);
  assert.ok(l.every(c=>c.shape!=='box'),'jen čela (instancing)');}
 const head=buildModel(m,0).find(c=>c.part==='head');assert.ok(near(head.r,PERSON.head)&&head.d<=.1);
 const w=s=>bounds(buildModel(m,0,{pose:s}));assert.ok(w('walk').w>w('stand').w,'chůze: nohy rozkročené');assert.ok(w('sit').d>.3,'sed: stehna ke kameře');
 assert.ok(near(PERSON.shoulder.y,PERSON.hip+PERSON.trunk-.05),'pivot ruky pro pose.js');
});

test('street-lamp: sloup 4,5 × 0,25 m, patka 0,5 m, rameno 0,8 m, lucerna 0,6 × 0,9 m, litina D1.window, ráno sklo D1.glass; jednoramenná 21 / 7 △',()=>{
 const m=modelById('street-lamp'),D=palette('papir').city.districts[0],l=buildModel(m,0),by=part=>l.filter(c=>c.part===part);
 const pole=by('pole')[0];assert.ok(near(pole.h,4.5)&&near(pole.w,.25)&&pole.y===0);const base=by('base')[0];assert.ok(near(base.w,.5)&&near(base.h,.5));
 const arm=by('arm')[0];assert.ok(near(arm.w,LAMP.arm));const lb=bounds(by('lantern'));assert.ok(near(lb.w,.6+.12)&&near(lb.h,.9),`lucerna ${lb.w}×${lb.h}`);
 assert.ok(l.filter(c=>c.part!=='glass').every(c=>c.color===D.window));assert.equal(by('glass')[0].color,D.glass);
 assert.equal(modelTriangles(m,0),21);assert.equal(modelTriangles(m,1),7);assert.equal(modelTriangles(m,0,{basket:1})-modelTriangles(m,0),7,'koš +7');
 const two=buildModel(m,0,{arms:2});assert.equal(two.filter(c=>c.part==='glass').length,2);assert.ok(near(bounds(two).x0,-bounds(two).x1),'dvouramenná souměrná');
});
