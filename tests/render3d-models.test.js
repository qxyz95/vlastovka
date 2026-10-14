import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MODELS,modelById,buildModel,modelTriangles,defaults,bounds,place,SCALE,LOD_LAYER} from '../src/render3d/models/index.js';
import {windowCut,door,tones,hash,chimney,gableRoof,roofAt} from '../src/render3d/models/parts.js';
import {cardVertices,cardTriangles,CARD_D} from '../src/render3d/paper-cards.js';
import {CARD_DEPTH} from '../src/render3d/models/scale.js';
import {palette} from '../src/render3d/palette.js';

// Katalog modelů K1 (research/design/10-katalog-modelu.md): rozhraní, LOD, měřítko, determinismus.
const HEX=/^#[0-9a-f]{6}$/,SHAPES=new Set(['box','gable','pyr','disc','flag']),near=(a,b,e=1e-6)=>Math.abs(a-b)<=e;
// Všechny kombinace parametrů (kartézský součin hodnot).
const variants=m=>Object.entries(m.params).reduce((acc,[k,v])=>acc.flatMap(p=>v.values.map(x=>({...p,[k]:x}))),[{}]);

test('registr: každý objekt má povinná pole, jednoznačné id a 3 LOD',()=>{
 assert.ok(MODELS.length>=1);assert.equal(new Set(MODELS.map(m=>m.id)).size,MODELS.length);assert.deepEqual([...LOD_LAYER],['near','mid','far']);
 for(const m of MODELS){
  for(const k of ['id','name','prototype','purpose'])assert.ok(typeof m[k]==='string'&&m[k].length>2,`${m.id}.${k}`);
  assert.match(m.id,/^[a-z0-9-]+$/);assert.ok(Number.isInteger(m.district)&&m.district>=0&&m.district<4,`${m.id}.district`);
  for(const k of ['w','h','d'])assert.ok(m.size[k]>0&&m.size[k]<200,`${m.id}.size.${k}`);
  assert.equal(m.lod.length,3);assert.ok(m.lod.every(f=>typeof f==='function'));assert.equal(m.tris.length,3);
  for(const [k,v] of Object.entries(m.params)){assert.ok(v.values.length>=1,`${m.id}.${k}`);assert.ok(v.values.includes(v.default),`${m.id}.${k} default`);}
  assert.equal(modelById(m.id),m);assert.ok(Object.isFrozen(m));}
 assert.equal(modelById('nope'),null);assert.throws(()=>buildModel('nope'));
});

test('karty: platný tvar, barva z palety (hex), konečná čísla; cardVertices sedí na cardTriangles',()=>{
 for(const m of MODELS)for(let lod=0;lod<3;lod++){const list=buildModel(m,lod);assert.ok(list.length>0);
  for(const c of list){assert.ok(SHAPES.has(c.shape),c.shape);assert.match(c.color,HEX,`${m.id} ${c.part}`);if(c.shape==='gable')assert.match(c.roof,HEX);
   for(const k of ['x','y','z','d',...(c.shape==='disc'?['r']:['w','h'])])assert.ok(Number.isFinite(c[k])&&(['x','y','z'].includes(k)||c[k]>0),`${m.id} ${c.part}.${k}=${c[k]}`);}
  const v=cardVertices(list);assert.equal(v.p.length/9,cardTriangles(list));}
});

test('LOD: trojúhelníků ubývá 0 > 1 > 2 v každé variantě, drží strop tris a LOD 2 zachová siluetu LOD 0',t=>{
 for(const m of MODELS){const max=[0,0,0];
  for(const p of variants(m)){const n=[0,1,2].map(l=>modelTriangles(m,l,p));
   assert.ok(n[0]>n[1]&&n[1]>n[2],`${m.id} ${JSON.stringify(p)}: ${n}`);n.forEach((v,i)=>max[i]=Math.max(max[i],v));
   const b0=bounds(buildModel(m,0,p)),b2=bounds(buildModel(m,2,p));
   // Silueta (obrys v x–y) se mezi LOD nemění víc než o přesah drobností (parapety, stříška, okenice).
   assert.ok(Math.abs(b0.y1-b2.y1)<=.6&&b2.y0<=b0.y0+.01&&Math.abs(b0.w-b2.w)<=1.2,`${m.id} silueta ${JSON.stringify(p)}`);}
  max.forEach((v,i)=>assert.ok(v<=m.tris[i],`${m.id} LOD ${i}: ${v} > ${m.tris[i]}`));t.diagnostic(`${m.id}: max △ ${max.join(' / ')}`);}
});

test('měřítko: okna 1,2 × 1,4 m nad sebou po 3 m, dveře 2,2 m u země, rozměry výchozí varianty = size',()=>{
 assert.deepEqual({...SCALE,door:{...SCALE.door},win:{...SCALE.win}},{floor:3,door:{w:1.1,h:2.2},win:{w:1.2,h:1.4},sill:.9,person:1.7,plane:7.75});
 assert.deepEqual({...CARD_DEPTH},{...CARD_D},'hloubka karet jako paper-cards');
 for(const m of MODELS){
  const b=bounds(buildModel(m,0));for(const k of ['w','h','d'])assert.ok(Math.abs(b[k]-m.size[k])<=.5,`${m.id} size.${k}: ${b[k].toFixed(2)} vs ${m.size[k]}`);
  for(const p of variants(m))for(let lod=0;lod<2;lod++){const list=buildModel(m,lod,p);
   const win=list.filter(c=>c.part==='window'),doors=list.filter(c=>c.part==='door');
   for(const c of win){assert.ok(near(c.w,SCALE.win.w)&&near(c.h,SCALE.win.h),`${m.id} okno ${c.w}×${c.h}`);
    {const u=(c.y-SCALE.sill)/SCALE.floor;assert.ok(near(u,Math.round(u),1e-9),`${m.id} okno mimo patro y=${c.y}`);}}
   for(const c of doors){assert.ok(near(c.h,SCALE.door.h)&&near(c.w,SCALE.door.w),`${m.id} dveře ${c.w}×${c.h}`);assert.ok(c.y<.3,'dveře u země');}
   if(m.id==='house-row'){assert.equal(doors.length,1,'dům má jedny dveře');const H=p.floors*SCALE.floor;
    assert.ok(list.some(c=>c.part==='wall'&&near(c.h,H)),'stěna = patra × 3 m');assert.ok(list.some(c=>c.part==='chimney'),'komín');
    // okna nad sebou: každá osa má v každém patře okno (kromě dveří a balkonu)
    const cols=new Set(win.map(c=>(c.x+c.w/2).toFixed(3)));assert.equal(cols.size,p.bays);}}}
});

test('determinismus: stejné parametry = stejné karty, buildModel nemutuje, seed mění jen drobnosti',()=>{
 for(const m of MODELS){const p=defaults(m),snap=JSON.stringify(p);
  for(let lod=0;lod<3;lod++)assert.deepEqual(buildModel(m,lod,p),buildModel(m,lod,{...p}));assert.equal(JSON.stringify(p),snap);
  const seeds=m.params.seed?.values??[];if(seeds.length>1){const a=buildModel(m,0,{seed:seeds[0]}),all=seeds.map(s=>JSON.stringify(buildModel(m,0,{seed:s})));
   assert.ok(new Set(all).size>1,'seed dává varianty');for(const s of seeds){const b=bounds(buildModel(m,2,{seed:s}));assert.ok(Math.abs(b.w-bounds(buildModel(m,2,{seed:seeds[0]})).w)<1e-9);}
   assert.ok(a.length>0);}}
 assert.equal(hash(7,3),hash(7,3));assert.notEqual(hash(7,3),hash(7,4));for(let i=0;i<200;i++){const v=hash(i,i*3);assert.ok(v>=0&&v<1);}
});

test('díly: okno a dveře podle LOD, komín sedí na střeše, place nemutuje',()=>{
 const t=tones('#e8735a');assert.ok(Object.values(t).every(c=>HEX.test(c)));
 assert.equal(windowCut({cx:0,y:1,t,lod:2}).length,0);assert.equal(windowCut({cx:0,y:1,t,lod:1}).length,1);
 assert.ok(windowCut({cx:0,y:1,t,lod:0,shutter:'#5aa6a0',flowers:['#9c7a55','#e8735a']}).length>windowCut({cx:0,y:1,t,lod:0}).length);
 assert.equal(door({cx:0,t,lod:2}).length,0);assert.equal(door({cx:0,t,lod:1})[0].y,0);
 const r=gableRoof({x:-4,w:8,y:9,d:4,wall:'#e8735a',roof:'#3d4f7a'}),ch=chimney({r,cx:2,color:'#9a4a3a',cap:'#ffffff',lod:0});
 assert.ok(ch[0].y<roofAt(r,1.6)&&ch[0].y<roofAt(r,2.4),'komín zapuštěný do střechy');assert.ok(ch[0].y+ch[0].h>r.y+r.h,'komín nad hřebenem');
 const list=buildModel(MODELS[0],0),s=JSON.stringify(list),moved=place(list,{x:100,z:-20});assert.equal(JSON.stringify(list),s);
 assert.ok(near(bounds(moved).x0,bounds(list).x0+100)&&near(bounds(moved).z1,bounds(list).z1-20));
 // barvy z palety čtvrti 1 (žádný ručně psaný hex mimo palette.js): stěny domu z near, střechy z roof
 const D=palette('papir').city.districts[0];for(const p of variants(MODELS[0]).slice(0,30)){const l=buildModel(MODELS[0],0,p);
  assert.ok(D.near.includes(l.find(c=>c.part==='wall').color));assert.ok(D.roof.includes(l.find(c=>c.part==='roof').roof));}
});
