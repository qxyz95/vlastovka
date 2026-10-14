import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {CYBER,INK,PAPER,CYAN,MAGENTA,GOLD,MUTE,mix} from '../src/render3d/palette.js';
import {MOOD_KEYS} from '../src/render3d/mood.js';
import {suburbLife} from '../src/render3d/life.js';
import {NEON,cityChunk,planeShape,outlineStamp,STAMP_DIRS} from '../src/render3d/geometry.js';
import {OUTLINE} from '../src/render3d/comic.js';

// Dávka G4 „Zbytky“ (bible research/design/02-styl.md): poslední ruční barvy v src/render3d/ na tokeny, zem Docks bez tyrkysové,
// stopa QTE čitelná na tuši, celý obrys vlaštovky, písmo Atlasu a strážní test hex / monospace.
const dir=new URL('../src/render3d/',import.meta.url),src=n=>readFileSync(new URL(n,dir),'utf8');
registerHooks({resolve:(s,c,next)=>s==='three'?{url:new URL('../vendor/three/three.module.min.js',import.meta.url).href,shortCircuit:true}:next(s,c)});
const THREE=await import('three'),toon=await import('../src/render3d/toon.js'),planeMod=await import('../src/render3d/plane.js');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const lin=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
const L=h=>{const [r,g,b]=rgb(h).map(v=>lin(v/255));return .2126*r+.7152*g+.0722*b;};
const ratio=(a,b)=>{const [x,y]=[L(a),L(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05);};
const green=h=>{const [r,g,b]=rgb(h);return g>r+12&&g>b+12;};
const OLD_GREEN=['#3d8a6a','#5ee0c8','#b4f06a','#5aa7b8','#9dff6a'];
const files=[...readdirSync(dir).filter(n=>n.endsWith('.js')),...readdirSync(new URL('districts/',dir)).map(n=>'districts/'+n)];

test('life.js: barvy Suburbs z palette.life, bez zelené a bez GOLD v dekoracích',()=>{
 const K=CYBER.life,L=suburbLife(),used=new Set([...L.people.flatMap(p=>[p.cloth,p.skin]),...L.cars.map(c=>c.color),...L.stalls.map(s=>s.color),
  ...L.laundry.flatMap(l=>l.items.map(i=>i.color)),...L.bunting.flatMap(l=>l.items.map(i=>i.color)),...L.pinwheels.map(p=>p.color),...L.balloons.map(b=>b.color),...L.static.map(s=>s.color)]);
 const allowed=new Set([...K.people.cloth,...K.people.skin,...K.pastel,K.chimney,...Object.values(K.tanks),K.mast,...Object.values(K.stall),K.line,...Object.values(K.tunnel),K.pyramid,...Object.values(K.rail),K.platform,K.pole]);
 for(const c of used){assert.ok(allowed.has(c),'mimo paletu '+c);assert.ok(!green(c),'zelená '+c);assert.ok(!OLD_GREEN.includes(c),c);}
 for(const c of [...K.people.cloth,...K.pastel])assert.notEqual(c,GOLD,'zlatá jen hodnota a neon');
 assert.ok(K.people.cloth.includes(CYAN)&&K.pastel.includes(CYAN));
});

test('NEON cedulí a lamp jen CYAN, MAGENTA, GOLD; okna z city.windows (tokeny a mix z nich)',()=>{
 assert.deepEqual(NEON,[MAGENTA,CYAN,GOLD]);
 for(let i=0;i<16;i++){const c=cityChunk(i);for(const s of [...c.signs,...c.lamps])assert.ok(NEON.includes(s.color),`místo ${i}: ${s.color}`);}
 assert.deepEqual(CYBER.city.windows,[MAGENTA,CYAN,GOLD,mix(GOLD,PAPER,.5)]);
 assert.match(src('toon.js'),/const colors=CYBER\.city\.windows;/);
 for(const c of CYBER.city.windows)assert.ok(!green(c));
});

// Přibližné světlo země (MeshToon, plochá zem nahoru): albedo/π × (hemi.sky + key·stín + rim), mlha podle vzdálenosti, sRGB, posterizace 6 úrovní (comic levels).
function litGround(g,m,shadow,d){const a=rgb(g).map(v=>lin(v/255)),c=k=>rgb(k).map(v=>lin(v/255)),hs=c(m.hemi.sky),k=c(m.key.color),r=c(m.rim.color),f=c(m.fog.color);
 const ff=Math.min(1,Math.max(0,(d-m.fog.near)/(m.fog.far-m.fog.near)));
 return {ff,p:a.map((v,j)=>{const o=v/Math.PI*(hs[j]*m.hemi.intensity+k[j]*m.key.intensity*shadow+r[j]*m.rim.intensity);return Math.floor(Math.pow(o+(f[j]-o)*ff,1/2.2)*6+.5);})};}
test('zem čtvrtí po světle, mlze a posterizaci bez zelené; Docks ani tyrkysová (G4)',()=>{
 const P=CYBER.city;assert.equal(P.ground[1],'#1c2878');
 for(let b=0;b<4;b++){const g=mix(P.ground[b],'#000000',P.groundDark[b]);assert.ok(!green(g));
  for(const m of MOOD_KEYS.slice(b*4,b*4+4))for(const sh of [1,0])for(let d=0;d<=1500;d+=25){const {ff,p}=litGround(g,m,sh,d);if(ff>.98)continue;
   assert.ok(!(p[1]>p[2]&&p[1]>p[0]),`čtvrť ${b} ${m.name} d=${d}: zelená ${p}`);
   if(b===1)assert.ok(!(p[1]>=p[2]&&p[1]>p[0]),`Docks ${m.name} d=${d}: tyrkysová ${p}`);}}
});

test('stopa QTE = MUTE, na tuši aspoň 3 : 1 (dřív #3b4170 jen 1,9)',()=>{
 assert.equal(CYBER.qte.track,MUTE);assert.ok(ratio(CYBER.qte.track,INK)>=3);assert.ok(ratio('#3b4170',INK)<3);
});

test('obrys vlaštovky razítkem: 8 směrů po kružnici, posun ≥ tloušťka v každém směru, kreslí se po stopě',()=>{
 const s=planeShape('dart'),st=outlineStamp(s.positions),k=s.positions.length/3;
 assert.equal(STAMP_DIRS,8);assert.equal(st.count,k*8);assert.equal(st.positions.length,k*24);assert.equal(st.shift.length,k*16);
 const dirs=[];for(let i=0;i<8;i++){assert.deepEqual([...st.positions.slice(i*k*3,(i+1)*k*3)],s.positions.map(v=>Math.fround(v)));dirs.push([st.shift[i*k*2],st.shift[i*k*2+1]]);}
 // hrana s libovolnou normálou (po 1°) se posune aspoň o celou tloušťku a nejvýš o 1/cos(π/8)
 for(let a=0;a<360;a++){const n=[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)],best=Math.max(...dirs.map(d=>d[0]*n[0]+d[1]*n[1]));assert.ok(best>=1-1e-6&&best<=1/Math.cos(Math.PI/8)+1e-6,`${a}°: ${best}`);}
 const m=toon.stampOutlineMaterial();assert.equal(m.uniforms.thickness.value,OUTLINE.plane);assert.equal(m.uniforms.color.value.getHex(),new THREE.Color(INK).getHex());
 assert.ok(m.transparent&&!m.depthWrite&&m.side===THREE.DoubleSide&&m.uniforms.push.value>0);
 assert.ok(m.vertexShader.includes('attribute vec2 shift')&&m.vertexShader.includes('clip.xy+=shift*thickness*2./resolution*clip.w'));
 assert.ok(OUTLINE.plane>=2.6&&OUTLINE.plane>OUTLINE.building&&OUTLINE.plane>OUTLINE.detail,'nejsilnější obrys ve scéně');
 const pl=planeMod.createPlane({ramp:null,planeHull:m,palette:CYBER,scale:planeMod.PLANE_SCALE}),p=pl.current;
 assert.equal(p.hull.material,m);assert.ok(p.hull.geometry.getAttribute('shift'));assert.equal(p.hull.geometry.getAttribute('position').count,k*8);
 assert.ok(p.hull.renderOrder>pl.trail.mesh.renderOrder,'obrys po stopě');pl.dispose();
 assert.match(src('scene.js'),/planeHull=line\(stampOutlineMaterial\(\{color:pal\.plane\.outline\}\),'plane'\)/);
});

test('Atlas: písmo Bahnschrift + font-stretch:condensed jako style.css (rodina „Bahnschrift Condensed“ v Chrome neexistuje)',()=>{
 const css=readFileSync(new URL('../prototype/atlas/atlas.css',import.meta.url),'utf8');
 assert.match(css,/--display:"Bahnschrift","Bahnschrift Condensed",/);
 for(const rule of css.match(/\{[^}]*var\(--display\)[^}]*\}/g)){const f=rule.search(/font:[^;]*var\(--display\)/);assert.ok(rule.lastIndexOf('font-stretch:condensed')>f,rule.slice(0,60));}
});

// Výjimky (data, ne paleta): toon.js '#000' = nulová emise v emissiveMap oken, 0xffffff = násobitel emise budov (barvu nese mapa).
const HEX_OK={'toon.js':["'#000'",'0xffffff']};
test('strážní test: hex barvy jen v palette.js, mood.js a paper-mood.js, monospace nikde v kódu src/render3d',()=>{
 for(const n of files){if(n==='palette.js'||n==='mood.js'||n==='paper-mood.js')continue;
  const found=src(n).match(/'#[0-9a-f]{3,8}'|"#[0-9a-f]{3,8}"|`#[0-9a-f]{3,8}`|#[0-9a-f]{6}\b|0x[0-9a-f]{6}\b/gi)??[];
  assert.deepEqual(found.filter(h=>!(HEX_OK[n]??[]).includes(h)),[],n);
  assert.ok(!/['"`][^'"`\n]*monospace/.test(src(n)),n+': monospace');}
 for(const n of ['palette.js','mood.js','paper-mood.js'])assert.ok(!/['"`][^'"`\n]*monospace/.test(src(n)),n);
});
