import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {OLD_LIFE,PAPIR} from '../src/render3d/palette.js';
import {suburbLife} from '../src/render3d/life.js';
import {planeShape,outlineStamp,STAMP_DIRS} from '../src/render3d/geometry.js';
import {PAPER_OUTLINE} from '../src/render3d/comic.js';

// Dávka G4 „Zbytky“, po R0 (jediný styl): barvy života z palette.js (OLD_LIFE do převodu H4), celý obrys vlaštovky, písmo Atlasu
// a strážní test hex / monospace.
const dir=new URL('../src/render3d/',import.meta.url),src=n=>readFileSync(new URL(n,dir),'utf8');
registerHooks({resolve:(s,c,next)=>s==='three'?{url:new URL('../vendor/three/three.module.min.js',import.meta.url).href,shortCircuit:true}:next(s,c)});
const THREE=await import('three'),toon=await import('../src/render3d/toon.js'),planeMod=await import('../src/render3d/plane.js');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const green=h=>{const [r,g,b]=rgb(h);return g>r+12&&g>b+12;};
const OLD_GREEN=['#3d8a6a','#5ee0c8','#b4f06a','#5aa7b8','#9dff6a'];
const files=[...readdirSync(dir).filter(n=>n.endsWith('.js')),...readdirSync(new URL('districts/',dir)).map(n=>'districts/'+n)];

test('life.js: barvy Suburbs z palette.js OLD_LIFE, bez zelené a bez zlaté v dekoracích',()=>{
 const K=OLD_LIFE,L=suburbLife(),used=new Set([...L.people.flatMap(p=>[p.cloth,p.skin]),...L.cars.map(c=>c.color),...L.stalls.map(s=>s.color),
  ...L.laundry.flatMap(l=>l.items.map(i=>i.color)),...L.bunting.flatMap(l=>l.items.map(i=>i.color)),...L.pinwheels.map(p=>p.color),...L.balloons.map(b=>b.color),...L.static.map(s=>s.color)]);
 const allowed=new Set([...K.people.cloth,...K.people.skin,...K.pastel,K.chimney,...Object.values(K.tanks),K.mast,...Object.values(K.stall),K.line,...Object.values(K.tunnel),K.pyramid,...Object.values(K.rail),K.platform]);
 for(const c of used){assert.ok(allowed.has(c),'mimo paletu '+c);assert.ok(!green(c),'zelená '+c);assert.ok(!OLD_GREEN.includes(c),c);}
 for(const c of [...K.people.cloth,...K.pastel])assert.notEqual(c,'#ffd166','zlatá jen hodnota');
});

test('obrys vlaštovky razítkem: 8 směrů po kružnici, posun ≥ tloušťka v každém směru, kreslí se po stopě',()=>{
 const s=planeShape('dart'),st=outlineStamp(s.positions),k=s.positions.length/3;
 assert.equal(STAMP_DIRS,8);assert.equal(st.count,k*8);assert.equal(st.positions.length,k*24);assert.equal(st.shift.length,k*16);
 const dirs=[];for(let i=0;i<8;i++){assert.deepEqual([...st.positions.slice(i*k*3,(i+1)*k*3)],s.positions.map(v=>Math.fround(v)));dirs.push([st.shift[i*k*2],st.shift[i*k*2+1]]);}
 // hrana s libovolnou normálou (po 1°) se posune aspoň o celou tloušťku a nejvýš o 1/cos(π/8)
 for(let a=0;a<360;a++){const n=[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)],best=Math.max(...dirs.map(d=>d[0]*n[0]+d[1]*n[1]));assert.ok(best>=1-1e-6&&best<=1/Math.cos(Math.PI/8)+1e-6,`${a}°: ${best}`);}
 const m=toon.stampOutlineMaterial();assert.equal(m.uniforms.thickness.value,PAPER_OUTLINE.plane);assert.equal(m.uniforms.color.value.getHex(),new THREE.Color(PAPER_OUTLINE.color).getHex());
 assert.ok(m.transparent&&!m.depthWrite&&m.side===THREE.DoubleSide&&m.uniforms.push.value>0);
 assert.ok(m.vertexShader.includes('attribute vec2 shift')&&m.vertexShader.includes('clip.xy+=shift*thickness*2./resolution*clip.w'));
 assert.ok(PAPER_OUTLINE.plane>=2.6&&PAPER_OUTLINE.building===0&&PAPER_OUTLINE.detail===0,'obrys má jen vlaštovka');
 const pl=planeMod.createPlane({planeHull:m,palette:PAPIR,scale:planeMod.PLANE_SCALE}),p=pl.current;
 assert.equal(p.hull.material,m);assert.ok(p.hull.geometry.getAttribute('shift'));assert.equal(p.hull.geometry.getAttribute('position').count,k*8);
 assert.ok(p.hull.renderOrder>pl.trail.mesh.renderOrder,'obrys po stopě');pl.dispose();
 assert.match(src('scene.js'),/planeHull=line\(stampOutlineMaterial\(\{color:pal\.plane\.outline\}\),'plane'\)/);
});

test('Atlas: písmo Bahnschrift + font-stretch:condensed jako style.css (rodina „Bahnschrift Condensed“ v Chrome neexistuje)',()=>{
 const css=readFileSync(new URL('../prototype/atlas/atlas.css',import.meta.url),'utf8');
 assert.match(css,/--display:"Bahnschrift","Bahnschrift Condensed",/);
 for(const rule of css.match(/\{[^}]*var\(--display\)[^}]*\}/g)){const f=rule.search(/font:[^;]*var\(--display\)/);assert.ok(rule.lastIndexOf('font-stretch:condensed')>f,rule.slice(0,60));}
});

const HEX_OK={};
test('strážní test: hex barvy jen v palette.js, mood.js a paper-mood.js, monospace nikde v kódu src/render3d',()=>{
 for(const n of files){if(n==='palette.js'||n==='mood.js'||n==='paper-mood.js')continue;
  const found=src(n).match(/'#[0-9a-f]{3,8}'|"#[0-9a-f]{3,8}"|`#[0-9a-f]{3,8}`|#[0-9a-f]{6}\b|0x[0-9a-f]{6}\b/gi)??[];
  assert.deepEqual(found.filter(h=>!(HEX_OK[n]??[]).includes(h)),[],n);
  assert.ok(!/['"`][^'"`\n]*monospace/.test(src(n)),n+': monospace');}
 for(const n of ['palette.js','mood.js','paper-mood.js'])assert.ok(!/['"`][^'"`\n]*monospace/.test(src(n)),n);
});
