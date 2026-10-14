import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CYBER,PALETTES,palette,mix,TOKENS,ROLE,STEAM,DISPLAY,BODY,INK,PAPER,CYAN,MAGENTA,GOLD,FOCUS,MISS,NIGHT,PLATE,PLATE2,TEXT,DIM,MUTE} from '../src/render3d/palette.js';

// Tokeny palety podle stylové bible research/design/02-styl.md (dávka G0).
const HEX=/^#[0-9a-f]{6}$/;
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const L=h=>{const [r,g,b]=rgb(h).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
const ratio=(a,b)=>{const [x,y]=[L(a),L(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05);};
// Všechny barvy palety jako [cesta, hex].
const walk=(o,p='',out=[])=>{for(const [k,v] of Object.entries(o)){const q=p+'.'+k;if(typeof v==='string'&&v[0]==='#')out.push([q,v]);else if(v&&typeof v==='object')walk(v,q,out);}return out;};
const colors=walk(CYBER);

test('jádro palety = bible kap. 2.1 a tokeny Atlasu (kap. 7)',()=>{
 assert.deepEqual({INK,PAPER,CYAN,MAGENTA,GOLD,FOCUS,MISS,NIGHT,PLATE,PLATE2,TEXT,DIM,MUTE},
  {INK:'#15101f',PAPER:'#ffffff',CYAN:'#5cf2ff',MAGENTA:'#ff4f9e',GOLD:'#ffd166',FOCUS:'#fff27a',MISS:'#cfd3e0',NIGHT:'#1b1444',PLATE:'#251c57',PLATE2:'#30256d',TEXT:'#f5f1ff',DIM:'#c9c0f0',MUTE:'#a79cd8'});
 assert.ok(Object.isFrozen(TOKENS)&&Object.isFrozen(ROLE));
 for(const [k,v] of Object.entries({ink:INK,paper:PAPER,cyan:CYAN,magenta:MAGENTA,gold:GOLD,focus:FOCUS,night:NIGHT,plate:PLATE,text:TEXT,steam:STEAM,display:DISPLAY,body:BODY}))assert.equal(TOKENS[k],v,k);
 assert.deepEqual({...ROLE},{success:CYAN,perfect:MAGENTA,value:GOLD,miss:MISS,warning:FOCUS});
 assert.ok(colors.length>100);for(const [p,v] of colors)assert.match(v,HEX,p);
 assert.equal(mix('#000000','#ffffff',0),'#000000');assert.equal(mix('#000000','#ffffff',1),'#ffffff');assert.equal(mix('#000000','#ffffff',.5),'#808080');
});

test('jedna tuš: obrysy, lem stopy, podklad QTE a stín písma = ink; staré tuše nikde',()=>{
 for(const v of [CYBER.plane.outline,CYBER.trailEdge,CYBER.popup.outline,CYBER.speed.ink,CYBER.qte.disc])assert.equal(v,INK);
 assert.equal(CYBER.qte.discAlpha,.6);
 for(const old of ['#0b1935','#07051a','#141c32','#120a2a','#0e0b1c'])assert.ok(!colors.some(([,v])=>v===old),old);
 assert.ok(ratio(MAGENTA,INK)>=6,'jádro stopy Core × lem');assert.ok(ratio('#ffd23f',INK)>=12,'jádro stopy Horizon × lem');
});

test('vlaštovka: obrys ink, tónování nejvýš 20 %, záhyby azurová a magenta',()=>{
 assert.equal(CYBER.plane.maxTint,.2);assert.deepEqual(CYBER.plane.crease,[CYAN,MAGENTA]);
 assert.ok(ratio(PAPER,INK)>=17);assert.equal(CYBER.workshop.plane,PAPER);assert.equal(CYBER.workshop.crease,MAGENTA);
});

test('perfekt magenta, úspěch azurová, zlatá jen hodnota',()=>{
 const p=CYBER.popup;assert.equal(p.perfect,MAGENTA);assert.equal(p.success,CYAN);assert.equal(p.milestone,GOLD);assert.equal(p.miss,MISS);
 assert.equal(CYBER.particles[2],CYAN,'jiskra úspěchu');assert.equal(CYBER.particles[4],GOLD,'jiskra hodnoty');
 // Zlatá nesmí být v UI mimo hodnotu (QTE, mířidla, štítky, vlaštovka, záblesk, rychlostní čáry).
 for(const key of ['qte','aim','label','plane','speed'])assert.ok(!walk(CYBER[key]).some(([,v])=>v===GOLD),key);
 assert.notEqual(CYBER.flash,GOLD);assert.notEqual(CYBER.qte.bird.beak,GOLD);
});

test('sjednocená azurová a magenta: neonové akcenty jsou tokeny, staré odstíny pryč',()=>{
 const C=CYBER,L3=C.life,W=C.workshop;
 for(const v of [C.qte.bird.wing,C.companion.grate,L3.drone.on,L3.robot.eye,W.light,W.visor,C.kid[1],C.shop.light])assert.equal(v,CYAN);
 for(const v of [C.companion.eye,L3.pigeon.eye,L3.bulb.party[1],W.shirt,C.lights.rim,C.kid[2],C.shop.sign])assert.equal(v,MAGENTA);
 assert.equal(C.qte.gust,mix(CYAN,PAPER,.6));
 // qte.success a qte.result.success jsou zatím LEGACY (hlídá je test UI), jinde staré odstíny nejsou.
 const OLD=['#00bddb','#53dbea','#53e6ff','#61eafa','#62ecff','#65f7ef','#66f7ef','#6ffff0','#ff43b5','#ff4fc3','#ee50b4','#ef59c1','#ff6fd0','#ff8fd8'];
 assert.deepEqual(colors.filter(([,v])=>OLD.includes(v)),[]);
 for(const c of L3.ads)assert.ok([CYAN,MAGENTA,GOLD].includes(c),'cedule jen cyan / magenta / gold');assert.equal(L3.ads.length,4);
});

test('pára a kouř šedofialové, svítivost nejvýš 60 % papíru',()=>{
 assert.equal(CYBER.steam,STEAM);assert.equal(CYBER.companion.steam,STEAM);
 assert.ok(L(STEAM)<=.6*L(PAPER),`svítivost ${L(STEAM).toFixed(2)}`);
 const [r,g,b]=rgb(STEAM);assert.ok(b>r&&r>g,'fialový nádech');assert.ok(Math.max(r,g,b)-Math.min(r,g,b)<60,'šedá, ne sytá');
});

test('UI vrstva na tokenech Atlasu: mířicí panel, štítky, písmo bez monospace',()=>{
 const a=CYBER.aim,l=CYBER.label;
 assert.deepEqual([a.panel,a.text,a.arrow,a.cap,l.bg,l.text],[PLATE,TEXT,FOCUS,PAPER,NIGHT,TEXT]);
 assert.ok(ratio(a.text,a.panel)>=4.5&&ratio(l.text,l.bg)>=4.5,'text ≥ 4,5 : 1');assert.ok(ratio(a.arrow,PLATE)>=3,'šipka ≥ 3 : 1');
 assert.equal(CYBER.popup.font,DISPLAY);assert.ok(!JSON.stringify(CYBER).includes('monospace'));
 assert.match(DISPLAY,/^"Bahnschrift Condensed".*"Arial Narrow",sans-serif$/);assert.match(BODY,/sans-serif$/);
 assert.equal(CYBER.flash,PAPER);assert.equal(CYBER.speed.line,PAPER);
});

test('nové tokeny pro scene/life3d/workshop existují; stará jména zůstávají (aliasy)',()=>{
 const C=CYBER;
 assert.deepEqual(Object.keys(C.sky.sun),['halo','mid','core']);for(const v of [C.sky.moon,C.sky.stars,C.lights.hemiSky,C.lights.hemiGround,C.lights.key])assert.match(v,HEX);
 for(const k of ['car','train','windows','bulb','antenna','drone','bird','basket','rope','cloud','robot','pigeon','ads'])assert.ok(k in C.life,k);
 assert.equal(C.life.train.cars.length,6);assert.equal(C.life.windows.length,4);
 for(const k of ['wall','annex','roof','trim','door','frame','window','light','warm','skin','visor','shirt','legs','rail','plane','crease'])assert.match(C.workshop[k],HEX,k);
 // Klíče, které dnes čtou scene.js, plane.js, ui-layer.js a companion3d.js.
 assert.equal(C.trail.length,2);assert.equal(C.particles.length,5);assert.equal(C.kid.length,4);
 for(const k of ['fill','outline','crease'])assert.ok(k in C.plane,k);for(const k of ['perfect','success','miss','milestone','land','outline','font'])assert.ok(k in C.popup,k);
 for(const k of ['track','success','perfect','dot','warning','result','gust','bird'])assert.ok(k in C.qte,k);for(const k of ['arrow','panel','text','bar','cap'])assert.ok(k in C.aim,k);
 for(const k of ['biomes','accent','ground','groundDark','suburbs','far','light','shade','roof','trim','fog0','duskFog','beacon','water','lane'])assert.ok(k in C.city,k);
 for(const k of ['body','head','beak','tail','bread','wing','eye','steam','vent','grate'])assert.ok(k in C.companion,k);
 assert.equal(palette('cyber'),CYBER);assert.equal(palette('nope'),CYBER);assert.deepEqual(Object.keys(PALETTES),['cyber']);
});
