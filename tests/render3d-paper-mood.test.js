import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CYBER,PAPIR,PALETTES,palette,PAPER_TOKENS,PAPER_ROLE} from '../src/render3d/palette.js';
import {moodAt,MOOD_KEYS,PAPER_KEYS,breath} from '../src/render3d/mood.js';
import {PAPER_MOODS} from '../src/render3d/paper-mood.js';
import {SCREEN_METERS} from '../src/scenes.js';

// Papírové město P0: paleta PAPIR (bible 05 kap. 2) a nálady (kap. 2.3, 4).
const HEX=/^#[0-9a-f]{6}$/;
const lin=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4;},lum=h=>{const [r,g,b]=[1,3,5].map(i=>lin(parseInt(h.slice(i,i+2),16)));return .2126*r+.7152*g+.0722*b;};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const walk=(o,p='')=>typeof o==='string'?[[p,o]]:Array.isArray(o)?o.flatMap((v,i)=>walk(v,`${p}[${i}]`)):o&&typeof o==='object'?Object.entries(o).flatMap(([k,v])=>walk(v,`${p}.${k}`)):[];
const keysOf=(o,p='')=>o&&typeof o==='object'&&!Array.isArray(o)?Object.entries(o).flatMap(([k,v])=>[p+k,...keysOf(v,p+k+'.')]):[];

test('paleta PAPIR: stejné klíče jako CYBER (žádné neznámé ani chybějící), čtené podklíče všechny, barvy hex',()=>{
 assert.equal(palette('papir'),PAPIR);assert.equal(PALETTES.papir,PAPIR);assert.equal(palette(),CYBER);
 assert.deepEqual(Object.keys(PAPIR).sort(),Object.keys(CYBER).sort());
 // Podklíče, které čtou scene/plane/ui-layer/companion3d/life3d/workshop: všechny z CYBER musí být i v PAPIR (cesta papírové dávky může číst stejně).
 for(const g of ['plane','popup','qte','label','aim','speed','sky','lights','companion','workshop','life','fx','shop']){const miss=keysOf(CYBER[g]).filter(k=>!keysOf(PAPIR[g]).includes(k));assert.deepEqual(miss,[],g);}
 assert.equal(PAPIR.trail.length,2);assert.equal(PAPIR.particles.length,5);assert.equal(PAPIR.kid.length,4);assert.equal(PAPIR.city.districts.length,4);
 for(const [p,v] of walk(PAPIR))if(!/font$/.test(p)&&p!=='.id')assert.match(v,HEX,p);
 for(const [k,v] of Object.entries(PAPER_TOKENS))if(!['display','body','hand'].includes(k))assert.match(v,HEX,k);
 assert.ok(!/monospace/.test(PAPER_TOKENS.display+PAPER_TOKENS.body+PAPER_TOKENS.hand));
});

test('paleta PAPIR: role a tokeny podle bible (jedna role = jedna barva, kontrasty kap. 2.4)',()=>{
 const T=PAPER_TOKENS;
 assert.equal(PAPIR.plane.fill,T.paper);assert.equal(PAPIR.plane.outline,T.graphite);assert.equal(PAPIR.plane.outlinePx,2.6);assert.equal(PAPIR.plane.maxTint,0);
 assert.equal(PAPIR.qte.success,T.teal);assert.equal(PAPIR.qte.perfect,T.tomato);assert.equal(PAPIR.qte.track,T.miss);assert.equal(PAPIR.qte.dot,T.graphite);
 assert.equal(PAPIR.qte.disc,T.cream);assert.equal(PAPIR.qte.discAlpha,.95);assert.equal(PAPIR.label.bg,T.graphite);assert.equal(PAPIR.label.text,T.cream);
 assert.equal(PAPER_ROLE.value,T.mustard);assert.notEqual(PAPER_ROLE.success,PAPER_ROLE.perfect);
 // Hořčicová jen hodnota: mimo hodnotové role a Dílnu (pláštěnka, knoflík) ani jinde v UI paletě.
 for(const g of ['plane','qte','label','aim','speed','popup','companion'])for(const [p,v] of walk(PAPIR[g]))if(v===T.mustard)assert.fail(`${g}${p}: hořčicová mimo hodnotu`);
 assert.ok(contrast(T.graphite,T.cream)>=13);assert.ok(contrast(T.pencil,T.cream)>=4.5);assert.ok(contrast(T.mustardText,T.cream)>=4.5);
 assert.ok(contrast(T.cream,T.tomato600)>=4.5);assert.ok(contrast(T.pencil700,T.desk)>=4.5);assert.ok(contrast(T.cobalt,T.desk)>=3);
 // QTE na krémovém disku 95 % nad nejsvětlejším i nejtmavším pásem ranního nebe ≥ 3 : 1 (kap. 11).
 const mix=(a,b,k)=>'#'+[1,3,5].map(i=>{const x=parseInt(a.slice(i,i+2),16),y=parseInt(b.slice(i,i+2),16);return Math.round(x+(y-x)*k).toString(16).padStart(2,'0');}).join('');
 for(const s of [PAPER_MOODS[0].sky[0],PAPER_MOODS[0].sky[3]]){const d=mix(s,PAPIR.qte.disc,PAPIR.qte.discAlpha);for(const k of ['track','success','perfect','dot'])assert.ok(contrast(PAPIR.qte[k],d)>=3,`${k} na ${d}`);}
});

test('PAPER_KEYS: 17 klíčů na stejných x jako MOOD_KEYS, jedna nálada na čtvrť, tvar shodný se cyber + skyAt/haze/light/shadow',()=>{
 assert.equal(PAPER_KEYS.length,17);assert.equal(PAPER_KEYS.length,MOOD_KEYS.length);
 PAPER_KEYS.forEach((k,i)=>{assert.equal(k.x,MOOD_KEYS[i].x);assert.equal(k.district,MOOD_KEYS[i].district);assert.equal(k.dawn,i===16);
  for(const n of Object.keys(MOOD_KEYS[0]).filter(n=>!['name'].includes(n)))assert.ok(n in k,`${i}: ${n}`);
  assert.equal(k.sky.length,4);assert.equal(k.skyAt.length,4);assert.ok(k.skyAt.every((v,j)=>j===0||v>k.skyAt[j-1]));
  for(const n of ['low','high','from','to','max','curve'])assert.ok(n in k.haze,n);assert.ok(k.haze.max<=.72);assert.equal(k.light.length,3);assert.match(k.shadow,HEX);
  assert.equal(k.neon,0);for(const [p,v] of walk(k))if(!['name'].includes(p.slice(1))&&p!=='.particles.kind')assert.match(v,HEX,`${i}${p}`);});
 for(let d=0;d<4;d++)for(let j=1;j<4;j++)assert.deepEqual(PAPER_MOODS[d*4+j],PAPER_MOODS[d*4]);
 // Čtvrť 1 „ráno“ beze změny (rozhodnutí 14. 10.).
 const m=PAPER_KEYS[0];assert.deepEqual(m.sky,['#78b4dc','#a6d0e8','#d8e9ea','#fce4c6']);assert.deepEqual(m.skyAt,[0,.42,.74,.9]);
 assert.deepEqual(m.haze,{low:'#f6e6d2',high:'#cfe2ec',from:20,to:700,max:.72,curve:.8});assert.deepEqual(m.light,[.62,.5,.6]);assert.equal(m.shadow,PAPER_TOKENS.shade);
 assert.equal(m.trail,PAPER_TOKENS.graphite);assert.equal(PAPER_KEYS[12].trail,PAPER_TOKENS.cream,'večer stopa krémová');
 // Stopa ≥ 3 : 1 proti každému pásu nebe čtvrti 1 (P1). Čtvrti 2–4 jsou prozatímní (večer: krém × obzor #e08a74 jen 2,4 : 1, řeší návrh čtvrti 4).
 for(const k of PAPER_KEYS.slice(0,4))for(const s of k.sky)assert.ok(contrast(k.trail,s)>=3,`stopa ${k.trail} × ${s}`);
});

test('moodAt se style: papír z PAPER_KEYS, plynulý přechod, bez stylu beze změny, zadržení dechu tlumí i opar',()=>{
 for(const x of [0,100,700,2500,4000,4876,6000]){assert.deepEqual(moodAt(x,1.5,{style:'cyber'}),moodAt(x,1.5));assert.deepEqual(moodAt(x,1.5,{style:'nope'}),moodAt(x,1.5));
  const p=moodAt(x,1.5,{style:'papir'});assert.equal(p.style,'papir');assert.ok(!('style' in moodAt(x,1.5)));
  for(const n of ['sky','skyAt','haze','light','shadow','trail','sun','moon','fog','particles','x','place','district','dawn','hold','rain'])assert.ok(n in p,n);}
 assert.deepEqual(moodAt(SCREEN_METERS*1.5,0,{style:'papir'}).sky,PAPER_KEYS[1].sky);
 assert.deepEqual(moodAt(-50,0,{style:'papir'}),moodAt(0,0,{style:'papir'}));assert.deepEqual(moodAt(NaN,0,{style:'papir'}),moodAt(0,0,{style:'papir'}));
 const ch=(a,b)=>Math.max(...[0,1,2].map(j=>Math.abs(parseInt(a.slice(1+2*j,3+2*j),16)-parseInt(b.slice(1+2*j,3+2*j),16))));
 for(let x=0;x<=5400;x+=1){const a=moodAt(x,0,{style:'papir'}),b=moodAt(x+1,0,{style:'papir'});for(let j=0;j<4;j++)assert.ok(ch(a.sky[j],b.sky[j])<=3,`skok nebe u ${x} m`);}
 const m=moodAt(400,0,{style:'papir'}),h=moodAt(400,0,{style:'papir',hold:1});
 assert.deepEqual(h,breath(m,1));assert.notEqual(h.haze.low,m.haze.low);assert.equal(h.trail,m.trail);assert.equal(h.style,'papir');
 assert.ok(!('haze' in breath(moodAt(400),1)),'cyber bez oparu');
});
