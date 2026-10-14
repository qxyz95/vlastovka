import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MODELS,modelById,buildModel,buildShadow,modelTriangles,defaults,bounds,place,drawnLods,nearestLod,SCALE,LOD_LAYER} from '../src/render3d/models/index.js';
import {windowCut,door,gate,tones,hash,chimney,gableRoof,eaveRoof,roofAt,balcony,downpipe,dormer,shopfront,steppedGable,gableOutline,GATE} from '../src/render3d/models/parts.js';
import {skylineLayout} from '../src/render3d/models/far-skyline.js';
import {gableHeight} from '../src/render3d/models/house-gable.js';
import {cardVertices,cardTriangles,CARD_D} from '../src/render3d/paper-cards.js';
import {CARD_DEPTH} from '../src/render3d/models/scale.js';
import {palette,PAPER_TOKENS as PT,mix} from '../src/render3d/palette.js';

// Katalog modelů (research/design/10-katalog-modelu.md, K1) a modely skupiny G1 (11-katalog-ctvrt1.md, K3): rozhraní, LOD, stropy, měřítko, determinismus.
const HEX=/^#[0-9a-f]{6}$/,SHAPES=new Set(['box','panel','lista','gable','eave','pyr','disc','flag','poly']),near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
const D1=()=>palette('papir').city.districts[0];
// Kombinace parametrů (kartézský součin); barvy a vrstva nemění počet karet, proto se u velkých modelů berou jen výchozí.
const variants=(m,{all=false}={})=>Object.entries(m.params).reduce((acc,[k,v])=>acc.flatMap(p=>(all||!['color','roof','layer'].includes(k)?v.values:[v.default]).map(x=>({...p,[k]:x}))),[{}]);
const inScope=(m,p)=>!m.trisScope||Object.entries(m.trisScope).every(([k,v])=>p[k]<=v);
const sample=(m,n=60)=>{const all=variants(m);return all.length<=n?all:Array.from({length:n},(_,i)=>all[Math.floor(i*all.length/n)]);};
// Prostor variant K1 (2–4 patra × 2–3 osy × seed 1–5, ostatní výchozí) a průměr △ před K3 (11 kap. 1.3: LOD 0 ⌀ 488, LOD 1 ⌀ 85).
const K1_SPACE=[2,3,4].flatMap(floors=>[2,3].flatMap(bays=>[1,2,3,4,5].map(seed=>({floors,bays,seed}))));

test('registr: G1 objekty, povinná pole, jednoznačné id, 3 LOD, volitelný stínový proxy',()=>{
 assert.deepEqual(MODELS.map(m=>m.id),['house-row','house-gable','far-skyline','chimney']);
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
    {const u=(c.y-SCALE.sill)/SCALE.floor;assert.ok(near(u,Math.round(u),1e-9),`${m.id} okno mimo patro y=${c.y}`);}}
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
