import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MODELS,ACTIVE_MODELS,modelById,buildModel,buildShadow,modelTriangles,defaults,bounds,place,drawnLods,nearestLod,SCALE,LOD_LAYER,diorama,dioramaShadow,DIORAMA,LAUNCH,AIM_SHOT,MENU_SHOT} from '../src/render3d/models/index.js';
import {windowCut,door,gate,tones,hash,chimney,gableRoof,eaveRoof,roofAt,balcony,downpipe,dormer,shopfront,steppedGable,gableOutline,GATE,cutRoof,CUT_ROOF} from '../src/render3d/models/parts.js';
import {KID as CHILD} from '../src/render3d/models/kid.js';
import {ATTIC} from '../src/render3d/models/workshop-attic.js';
import {LOFT} from '../src/render3d/models/loft-balcony.js';
import {HOIST} from '../src/render3d/models/hoist-beam.js';
import {WALL} from '../src/render3d/models/retaining-wall.js';
import {PLANE_OFFSET} from '../src/render3d/geometry.js';
import {skylineLayout} from '../src/render3d/models/far-skyline.js';
import {gableHeight} from '../src/render3d/models/house-gable.js';
import {TURRET} from '../src/render3d/models/corner-turret.js';
import {PERSON} from '../src/render3d/models/person.js';
import {LAMP} from '../src/render3d/models/street-lamp.js';
import {cardVertices,cardTriangles,CARD_D} from '../src/render3d/paper-cards.js';
import {CARD_DEPTH} from '../src/render3d/models/scale.js';
import {palette,PAPIR,PAPER_TOKENS as PT,mix} from '../src/render3d/palette.js';

// Katalog modelů (research/design/10-katalog-modelu.md, K1) a modely skupin G1 (11-katalog-ctvrt1.md, K3) a G2 (K4): rozhraní, LOD, stropy, měřítko, determinismus.
const HEX=/^#[0-9a-f]{6}$/,SHAPES=new Set(['box','panel','lista','gable','eave','pyr','disc','flag','poly','prism']),near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
const D1=()=>palette('papir').city.districts[0];
const G2B=['kid','workshop-attic','workshop-interior','loft-balcony','hoist-beam','retaining-wall'];
// Kombinace parametrů (kartézský součin); barvy a vrstva nemění počet karet, proto se u velkých modelů berou jen výchozí.
const variants=(m,{all=false}={})=>Object.entries(m.params).reduce((acc,[k,v])=>acc.flatMap(p=>(all||!['color','roof','layer'].includes(k)?v.values:[v.default]).map(x=>({...p,[k]:x}))),[{}]);
const inScope=(m,p)=>!m.trisScope||Object.entries(m.trisScope).every(([k,v])=>p[k]<=v);
const sample=(m,n=60)=>{const all=variants(m);return all.length<=n?all:Array.from({length:n},(_,i)=>all[Math.floor(i*all.length/n)]);};
// Prostor variant K1 (2–4 patra × 2–3 osy × seed 1–5, ostatní výchozí) a průměr △ před K3 (11 kap. 1.3: LOD 0 ⌀ 488, LOD 1 ⌀ 85).
const K1_SPACE=[2,3,4].flatMap(floors=>[2,3].flatMap(bays=>[1,2,3,4,5].map(seed=>({floors,bays,seed}))));

test('registr: G1, G2 a G2b objekty, povinná pole, jednoznačné id, 3 LOD, volitelný stínový proxy; K4 workshop po S4 odstraněn',()=>{
 assert.deepEqual(MODELS.map(m=>m.id),['house-row','house-gable','far-skyline','chimney','corner-turret','person','street-lamp',
  'kid','workshop-attic','workshop-interior','loft-balcony','hoist-beam','retaining-wall']);
 assert.equal(modelById('workshop'),null,'K4 workshop nahrazen G2b a ve hře zapojen (S4)');assert.deepEqual(ACTIVE_MODELS,MODELS);
 assert.deepEqual(MODELS.filter(m=>m.hero).map(m=>m.id),G2B,'G2b = LOD H (hrdina)');
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
   assert.ok(![PT.mustard,PT.paper].includes(c.color),`${m.id} ${c.part}: zakázaná barva ${c.color}`);
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
// Grafit (jediná tuš) jen do 8 m nad zemí (11 kap. 1.4, P1), bez výjimek (S4: zábradlí a provázky místa odhodu tmavomodré a tužkou).
test('G2 barvy: grafit nejvýš 8 m nad zemí, hořčicová nikde (pláštěnka #f2b65a, klika krémová)',()=>{
 for(const m of MODELS)for(const p of sample(m,24))for(const l of drawnLods(m))for(const c of buildModel(m,l,p)){
  if(c.color===PT.graphite)assert.ok((c.shape==='disc'?c.y+c.r:c.y+c.h)<=8+1e-9,`${m.id} ${c.part}: grafit ve výšce ${c.y}`);
  assert.notEqual(c.color,PT.mustard,`${m.id} ${c.part}: hořčicová jen hodnota`);}
 assert.ok(buildModel('loft-balcony',0).some(c=>c.part==='knob'&&c.color===PT.cream));
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

// ── G2b (místo odhodu, 11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 3.1 a 9): dítě, dům s podkrovím v řezu, dílna, pavlač, trám, opěrná zeď.
const NAVY='#3d4f7a',CUT=()=>palette('papir').city.cut,SIDE=()=>palette('papir').city.side;
const richest={'workshop-interior':{rolls:4,cards:16},'hoist-beam':{crane:3}};
test('G2b stropy △ (11 kap. 3.7 a 4.3) po LOD, pokles mezi LOD a dioráma ≤ 720 △ (dřív workshop 1 000)',t=>{
 const CAP={kid:[80,20,0],'workshop-attic':[230,0,20],'workshop-interior':[200,0,0],'loft-balcony':[55,0,0],'hoist-beam':[60,0,0],'retaining-wall':[95,0,4]};
 for(const id of G2B){const m=modelById(id);assert.deepEqual([...m.tris],CAP[id],id);
  const max=[0,1,2].map(l=>Math.max(...variants(m).map(p=>modelTriangles(m,l,p))));max.forEach((v,l)=>assert.ok(v<=CAP[id][l],`${id} LOD ${l}: ${v}`));
  for(let l=1;l<3;l++)if(!CAP[id][l])assert.equal(max[l],0,`${id} LOD ${l} se nekreslí`);
  for(const p of variants(m)){const n=[0,1,2].map(l=>modelTriangles(m,l,p)),L=drawnLods(m);for(let i=1;i<L.length;i++)assert.ok(n[L[i-1]]>n[L[i]],`${id} pokles ${n}`);}
  t.diagnostic(`${id}: max △ ${max.join(' / ')} (strop ${CAP[id].join(' / ')})`);}
 assert.ok(Object.values(CAP).reduce((s,c)=>s+c[0],0)<=720);
 const all=cardTriangles(diorama(0,richest));assert.ok(all<=720,`dioráma ${all} △`);assert.ok(all>=400,'hodně detailu (odhad 615–635)');
 assert.ok(cardTriangles(diorama(2))<=24,'dálka: dům + zeď');t.diagnostic(`dioráma LOD H ${all} △ (výchozí ${cardTriangles(diorama(0))}), LOD 2 ${cardTriangles(diorama(2))} △`);
});

test('G2b měřítko: dítě 1,2 m, ruka 12 m, podlaha 10,6 m, zábradlí 0,95 m, skutečné dveře a okna, zeď 1,1 m',()=>{
 const d=diorama(),of=(id,part)=>d.filter(c=>c.model===id&&(!part||c.part===part)),top=c=>c.shape==='disc'?c.y+c.r:c.y+c.h;
 // dítě = person × 0,7 (hlava končí v 1,2 m, čepice nad ní), chodidla na podlaze pavlače, dlaň v póze míření ve výšce výhozu fyziky (core.js y 12 m)
 const kid=buildModel('kid',0),head=kid.find(c=>c.part==='head');assert.ok(near(top(head),1.2,1e-9)&&near(CHILD.h,1.19,1e-9),`hlava ${top(head)}`);
 assert.ok(near(bounds(kid).y0,0)&&top(kid.find(c=>c.part==='cap'))>1.3,'čepice nad hlavou');
 for(const pose of Object.keys(CHILD.hand)){const l=buildModel('kid',0,{pose}),h=l.find(c=>c.part==='hand');assert.ok(near(h.x,CHILD.hand[pose][0])&&near(h.y,CHILD.hand[pose][1]),pose);
  assert.ok(near(bounds(l).y0,0),`${pose} na podlaze`);}
 const hand=of('kid','hand')[0];assert.ok(near(hand.x,PLANE_OFFSET,1e-9)&&near(hand.y,12,1e-9),`ruka ${hand.x} ${hand.y}`);assert.deepEqual([LAUNCH.hand.y,LAUNCH.floor],[12,10.6]);
 assert.ok(near(bounds(of('kid')).y0,LAUNCH.floor),'dítě stojí na pavlači');
 // pavlač: horní plocha desky = podlaha podkroví 10,6 m; madlo 0,95 m; sloupky po 0,5 m; dítě za zábradlím, ruka nad madlem (za vlaštovkou nebe)
 const deck=of('loft-balcony','deck')[0],rail=of('loft-balcony','railing'),posts=rail.filter(c=>c.w<.1).sort((a,b)=>a.x-b.x);
 assert.ok(near(deck.y+deck.h,10.6,1e-9)&&near(deck.w,4.1,1e-9)&&near(deck.d,2.4)&&near(deck.h,.2));
 assert.ok(near(Math.max(...rail.map(top))-10.6,.95,1e-9),'zábradlí 0,95 m');assert.equal(posts.length,9);posts.slice(1).forEach((c,i)=>assert.ok(near(c.x-posts[i].x,.5,1e-9)));
 assert.ok(Math.max(...of('kid').map(c=>c.z+c.d/2))<Math.min(...rail.map(c=>c.z-c.d/2)),'dítě za zábradlím');assert.ok(hand.y-10.6>.95+.4,'ruka nad madlem');
 assert.ok(near(deck.x+deck.w,LAUNCH.deckEnd,1e-9)&&deck.x+deck.w>hand.x&&near(deck.x,LAUNCH.house.x1,1e-9),'pavlač od domu po ruku');
 // dveře: vchod domu 1,1 × 2,2 m (u paty hlídá obecný test), půdní dveře 0,95 × 2,05 m na pavlači, okna 1,2 × 1,4 m ve 2 patrech po 4
 const attic=buildModel('workshop-attic',0),dr=attic.filter(c=>c.part==='door');assert.equal(dr.length,1);assert.ok(near(dr[0].w,1.1)&&near(dr[0].h,2.2));
 const ld=of('loft-balcony','loftDoor').find(c=>c.color===NAVY);assert.ok(near(ld.w,.95)&&near(ld.h,2.05)&&near(ld.y,10.6),'půdní dveře');
 const win=attic.filter(c=>c.part==='window');assert.equal(win.length,8);assert.deepEqual([...new Set(win.map(c=>c.y))].sort(),[4.4,7.4]);
 // dům: 12 × 8 m, přízemí 3,5 + 2 × 3 m na zdi 1,1 m = podlaha podkroví 10,6 m, nadezdívka 2,3 m, střecha 4,6 m
 const body=of('workshop-attic','wall')[0];assert.ok(near(body.w,12)&&near(body.d,8)&&near(body.y,1.1)&&near(body.y+body.h,10.6,1e-9));
 assert.ok(near(ATTIC.knee-ATTIC.floor,2.3)&&near(ATTIC.ridge-ATTIC.knee,4.6));
 const wall=of('retaining-wall','wall')[0];assert.ok(near(wall.w,31)&&near(wall.h,1.1)&&wall.y===0);
 const st=of('retaining-wall','stair').sort((a,b)=>a.x-b.x);assert.equal(st.length,7);assert.ok(near(top(st[0]),1.1)&&st.every((c,i)=>!i||near(top(st[i-1])-top(c),1.1/7,1e-9)),'7 schodů dolů do ulice');
 assert.ok(near(st[6].x+st[6].w,wall.x+wall.w,1e-9),'schody končí s koncem zdi');
 // trám 9 m z vrcholu štítu nad pavlač, košík nad dítětem (S-6), kladka ⌀ 0,45 m
 const beam=of('hoist-beam','beam')[0];assert.ok(near(beam.w,9)&&near(beam.x,(LAUNCH.house.x0+LAUNCH.house.x1)/2,1e-9)&&near(beam.h,.3));
 assert.ok(of('hoist-beam','basket')[0].y>Math.max(...of('kid').map(top)),'košík nad dítětem');assert.ok(near(of('hoist-beam','pulley')[0].r*2,.45));
 assert.deepEqual({...AIM_SHOT,at:[...AIM_SHOT.at],portraitAt:[...AIM_SHOT.portraitAt]},{width:16,portraitWidth:7,pitch:-8,fov:20,at:[.38,.6],portraitAt:[.4,.62],planeInHand:.5});
 assert.ok(MENU_SHOT.width>=25&&MENU_SHOT.width<=43&&MENU_SHOT.pitch===2,'menu 25–43 m, sklon +2°');
});

test('G2b barvy: pláštěnka #f2b65a, čepice kraft, zábradlí a rámy #3d4f7a, žádná hořčicová, bílá ani grafit, klika krémová, interiér o tón tmavší',()=>{
 const D=D1(),P=palette('papir');assert.equal(D.near[1],'#f2b65a');assert.equal(D.window,NAVY);
 for(const pose of modelById('kid').params.pose.values)for(const l of [0,1]){const k=buildModel('kid',l,{pose}),col=part=>k.filter(c=>c.part===part).map(c=>c.color);
  assert.deepEqual(col('coat'),['#f2b65a']);assert.deepEqual(col('cap'),[PT.kraft]);assert.ok(col('legs').every(c=>c===NAVY));assert.ok(col('head').every(c=>c===P.life.people.skin[0]));
  if(!l){assert.deepEqual(col('capBand'),[PT.tomato]);assert.ok([...col('shoe'),...col('eye')].every(c=>c===PT.pencil700));}}
 const d=diorama(0,richest);
 for(const c of d)assert.ok(![PT.mustard,PT.paper,PT.graphite].includes(c.color),`${c.model} ${c.part}: ${c.color}`);
 assert.ok(d.filter(c=>c.part==='railing').length>=10&&d.filter(c=>c.part==='railing').every(c=>c.color===NAVY),'zábradlí tmavomodré (S-2)');
 assert.equal(d.filter(c=>c.model==='workshop-attic'&&c.part==='frame'&&c.color===NAVY).length,8,'rámy oken tmavomodré');
 assert.deepEqual(d.filter(c=>c.part==='knob').map(c=>c.color),[PT.cream],'klika krémová');assert.ok(d.filter(c=>c.part==='loftDoor').some(c=>c.color===NAVY));
 assert.ok(d.filter(c=>c.part==='door').every(c=>c.color===NAVY),'dveře tmavomodré');
 // dům: stěna krémová, střecha rajčatová, řez mix(tomato, cut, .55), teplé sklo jen v domě (S-4)
 const A=d.filter(c=>c.model==='workshop-attic');assert.equal(A.find(c=>c.part==='wall').color,PAPIR.workshop.wall);
 assert.ok(A.filter(c=>c.part==='roof').every(c=>c.color===PT.tomato));assert.ok(A.filter(c=>c.part==='roofCut').every(c=>c.color===mix(PT.tomato,CUT(),.55)));
 assert.ok(d.filter(c=>c.color===P.city.warm).every(c=>c.model==='workshop-attic'),'teplé světlo jen domov');assert.ok(A.filter(c=>c.part==='window').every(c=>c.color===P.city.warm));
 // pavlač, trám, zeď
 assert.ok(d.filter(c=>c.part==='deck'||c.part==='beam'||c.part==='basket').every(c=>c.color===PT.kraftDark));assert.equal(d.find(c=>c.part==='flag').color,PT.tape);
 assert.ok(d.filter(c=>c.part==='rope'||c.part==='pulley').every(c=>c.color===PT.pencil));
 assert.ok(d.filter(c=>c.model==='retaining-wall').every(c=>c.color===D.ground.near||c.color===mix(D.ground.near,SIDE(),.3)));
 // interiér: každá barva = mix(token nebo barva palety, city.side, .2)
 const base=[...Object.values(PT),...P.life.pastel,...P.city.districts.flatMap(x=>[...x.near,x.glass])],dim=new Set(base.map(c=>mix(c,SIDE(),.2)));
 for(const c of d.filter(c=>c.model==='workshop-interior'))assert.ok(dim.has(c.color),`interiér ${c.part} ${c.color}`);
});

test('G2b díl cutRoof: 2 sklony × (čelo + světlé jádro) = 8 △, LOD 2 4 △, CCW, hřeben a přesah, podhled na líci nadezdívky',()=>{
 const r=cutRoof({x:-6,w:12,y:11.8,h:4.6,roof:PT.tomato,cut:'#f0a090'});assert.equal(cardTriangles(r),8);assert.equal(cardTriangles(cutRoof({x:-6,w:12,y:11.8,h:4.6,roof:PT.tomato,cut:'#f0a090',lod:2})),4);
 const area=pts=>pts.reduce((s,[x,y],i)=>{const [u,v]=pts[(i+1)%pts.length];return s+x*v-u*y;},0)/2;for(const c of r)assert.ok(area(c.pts)>0,'CCW');
 const b=bounds(r);assert.ok(near(b.x0,-6-CUT_ROOF.ov)&&near(b.x1,6+CUT_ROOF.ov)&&near(b.y1,11.8+4.6+CUT_ROOF.t));
 const sk=r[0].pts,slope=(sk[1][1]-sk[0][1])/(sk[1][0]-sk[0][0]);assert.ok(near(sk[0][1]+slope*CUT_ROOF.ov,11.8,1e-9),'podhled prochází hranou nadezdívky');
 const core=r.filter(c=>c.part==='roofCut');assert.equal(core.length,2);assert.ok(core.every(c=>c.z>r[0].z),'jádro před čelem');
 const v=cardVertices(r);for(let i=2;i<v.n.length;i+=3)assert.equal(v.n[i],1,'jen čela');
});

test('G2b varianty: pózy dítěte, role a pohlednice v dílně, hák Crane Lift úr. 1–3, praporek po větru',()=>{
 const k=modelById('kid');assert.deepEqual([...k.params.pose.values],['aim','charge','throw','wave','sit','desk']);
 const hy=p=>buildModel(k,0,{pose:p}).find(c=>c.part==='hand').y;assert.ok(hy('wave')>hy('aim')&&hy('aim')>hy('throw'));assert.ok(bounds(buildModel(k,0,{pose:'sit'})).y1<1);
 const I=modelById('workshop-interior'),n=(p,part)=>buildModel(I,0,p).filter(c=>c.part===part).length;
 for(const rolls of [1,2,3,4])assert.equal(n({rolls},'roll'),rolls*2,'role s dutinkou');for(const cards of [0,5,16])assert.equal(n({cards},'postcard'),cards*2);
 assert.ok(modelTriangles(I,0,{rolls:1,cards:0})<modelTriangles(I,0));
 // pohlednice: řádek = čtvrť Atlasu, obrázek v barvě místa (tónovaně)
 const pics=buildModel(I,0).filter(c=>c.part==='postcard'&&c.w<.5),rows=[...new Set(pics.map(c=>c.y))];assert.equal(rows.length,4);
 assert.equal(pics[4].color,mix(palette('papir').city.districts[1].near[0],SIDE(),.2));
 assert.ok(['desk','lamp','papers','cup','pencils','cutter','shelf','board','string','planes'].every(part=>n({},part)>0));
 const H=modelById('hoist-beam');assert.ok(buildModel(H,0).some(c=>c.part==='basket')&&!buildModel(H,0).some(c=>c.part==='platform'));
 for(const crane of [1,2,3]){const l=buildModel(H,0,{crane}),pf=l.find(c=>c.part==='platform');assert.ok(near(pf.y,crane*HOIST.platform.step),`plošina úr. ${crane}`);
  assert.ok(near(l.find(c=>c.part==='basket').y,pf.y+pf.h),'košík na plošině');assert.ok(l.some(c=>c.part==='hook'));}
 const fl=w=>bounds([buildModel(H,0,{wind:w}).find(c=>c.part==='flag')]);assert.ok(fl(1).x0>=LAUNCH.beam.len/2-1e-9&&fl(-1).x1<=LAUNCH.beam.len/2+1e-9);
 assert.ok(near(LOFT.rail.h,.95)&&near(WALL.h,1.1));
});

test('G2b dioráma: rozvržení, determinismus, stínový proxy H2 + H6 ≤ 11 △ a dítě ≤ 4 △',()=>{
 assert.deepEqual(DIORAMA.map(o=>o.id).sort(),[...G2B].sort());const a=diorama(),b=diorama();assert.deepEqual(a,b);
 assert.equal(JSON.stringify(diorama(0,{kid:{pose:'wave'}})),JSON.stringify(diorama(0,{kid:{pose:'wave'}})));assert.notEqual(JSON.stringify(diorama(0,{kid:{pose:'wave'}})),JSON.stringify(a));
 assert.equal(a.length,G2B.reduce((s,id)=>s+buildModel(id,0).length,0));assert.ok(diorama(0,{},{only:['kid']}).every(c=>c.model==='kid'));
 const by=id=>cardTriangles(buildShadow(id));assert.ok(by('workshop-attic')+by('retaining-wall')<=11);assert.ok(by('kid')<=4);
 for(const id of ['workshop-interior','loft-balcony','hoist-beam'])assert.equal(buildShadow(id).length,0,`${id} bez stínu (11 kap. 4.2)`);
 assert.ok(cardTriangles(dioramaShadow())<=15);
 // dům stojí na zdi, interiér na podlaze podkroví uvnitř domu, dům vlevo od ruky
 const box=id=>bounds(a.filter(c=>c.model===id));assert.ok(near(box('workshop-attic').y0,LAUNCH.wall)&&near(box('workshop-interior').y0,LAUNCH.floor));
 assert.ok(box('workshop-interior').x0>=LAUNCH.house.x0&&box('workshop-interior').x1<=LAUNCH.house.x1,'dílna uvnitř domu');
 assert.ok(box('workshop-attic').x1<LAUNCH.hand.x&&box('retaining-wall').x0<LAUNCH.house.x0);
});
