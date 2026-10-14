import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CYBER,PAPER,STEAM} from '../src/render3d/palette.js';

// Dávka G3 (research/design/03-styl-implementace.md U14–U16): živé prvky, Dílna a holub berou barvy jen z palette.js. Moduly s three.js
// v Node nejdou importovat, proto kontrola textu zdroje.
const src=n=>readFileSync(new URL('../src/render3d/'+n,import.meta.url),'utf8');
const FILES=['life3d.js','workshop.js','companion3d.js'];
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const L=h=>{const [r,g,b]=rgb(h).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};

test('U14: life3d, workshop a companion3d bez hex literálů, barvy jen z palette.js',()=>{
 for(const n of FILES){const s=src(n);assert.deepEqual(s.match(/#[0-9a-f]{3,8}\b|0x[0-9a-f]{6}\b/gi)??[],[],n);}
 for(const n of ['life3d.js','workshop.js'])assert.match(src(n),/import \{[^}]*CYBER[^}]*\} from '\.\/palette\.js'/,n);
 assert.match(src('workshop.js'),/PAL=\(paper\?PAPIR:CYBER\)\.workshop;/);// P3: papírová Dílna bere PAPIR.workshop
 assert.match(src('life3d.js'),/K=CYBER\.life\b/);
 assert.match(src('companion3d.js'),/K=palette\.companion\b/);
});

test('H0: life3d bez kouře, mraků, dronů, robota, reklamy a holuba; pára ventilace = steam, nejvýš 60 % svítivosti vlaštovky',()=>{
 const s=src('life3d.js').replace(/^\s*\/\/.*$/gm,'');for(const w of ['smoke','clouds','drone','robot','pigeon','ADS','signTexture','puff','steam'])assert.ok(!s.includes(w),w);
 assert.match(src('companion3d.js'),/MeshToonMaterial\(\{color:K\.steam\b/);
 assert.equal(CYBER.companion.steam,STEAM);
 assert.ok(L(CYBER.steam)<=.6*L(CYBER.plane.fill)&&CYBER.plane.fill===PAPER);
});

test('U16: obrysy Dílny 2,5 / 1,7, vlaštovka v ruce 2,6 (nejsilnější), vše tuš INK',()=>{
 const s=src('workshop.js');
 assert.match(s,/export const OUTLINE=\{hull:2\.5,thin:1\.7,plane:2\.6\};/);
 const calls=s.match(/outlineMaterial\(\{[^}]*\}\)/g);assert.equal(calls.length,3);
 for(const c of calls){assert.match(c,/color:INK/,c);assert.match(c,/thickness:OUTLINE\.(hull|thin|plane)\b/,c);}
});
