import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {INK,OUTLINE} from '../src/render3d/comic.js';
import {palette} from '../src/render3d/palette.js';

// G2 „Tuš a půltón“ (research/design/03-styl-implementace.md U2, U8–U11, U13, U14 nebe, U17, U18). three.js moduly se v Node jen importují
// (vendor/three přes hook místo import map) a kontrolují bez GPU: materiály, úpravy shaderů, barvy budov.
const dir=new URL('../src/render3d/',import.meta.url),src=n=>readFileSync(new URL(n,dir),'utf8');
registerHooks({resolve:(s,c,next)=>s==='three'?{url:new URL('../vendor/three/three.module.min.js',import.meta.url).href,shortCircuit:true}:next(s,c)});
const THREE=await import('three'),toon=await import('../src/render3d/toon.js'),scene=await import('../src/render3d/scene.js');

test('jedna tuš: staré tuše #07051a a #0b1935 nikde v src/render3d, obrys z comic.OUTLINE',()=>{
 const files=readdirSync(dir).filter(n=>n.endsWith('.js'));
 for(const n of files)for(const old of ['#07051a','#0b1935'])assert.ok(!src(n).toLowerCase().includes(old),`${n} obsahuje ${old}`);
 assert.equal(INK,palette('cyber').plane.outline);
 const m=toon.outlineMaterial();assert.equal(m.uniforms.color.value.getHex(),new THREE.Color(INK).getHex());assert.equal(m.uniforms.thickness.value,OUTLINE.building);
 // scene.js bere tloušťky jen z OUTLINE (plan.comic.outline), žádná vlastní čísla
 const s=src('scene.js');assert.ok(!/thickness:\s*[\d.]/.test(s)&&!/,\s*(2\.5|1\.7|2\.6)\)/.test(s));
 for(const k of ['building','detail','plane'])assert.ok(s.includes(`'${k}'`),k);
});

test('PLANE_SCALE: jediné číslo v plane.js, scene.js ho importuje',()=>{
 const s=src('scene.js');assert.ok(!/const\s+PLANE_SCALE\s*=/.test(s));assert.match(s,/import \{[^}]*PLANE_SCALE[^}]*\} from '\.\/plane\.js'/);
});

test('scene.js bez ručních hex barev (nebe, světla, budovy z palette.js), monospace pryč z mých modulů',()=>{
 assert.deepEqual(src('scene.js').match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi)??[],[]);
 for(const n of ['scene.js','toon.js','comic.js','index.js'])assert.ok(!src(n).includes('monospace'),n);
});

test('budovy bez zelené: žádný tón s G výrazně nad R i B (U11)',()=>{
 const P=palette('cyber').city,of=scene.cityColors(P),toS=v=>new THREE.Color(...v).convertLinearToSRGB().toArray();
 for(let biome=0;biome<4;biome++)for(let tone=0;tone<6;tone++)for(let x=0;x<300;x+=7){
  const [r,g,b]=toS(of({biome,tone,x}));assert.ok(g<=Math.max(r,b)+.02,`čtvrť ${biome} tón ${tone}: ${[r,g,b].map(v=>v.toFixed(2))}`);}
});

test('půltón: maska jen z materiálu budov (stín klíčového světla, bez oken, slábne s mlhou), post kreslí jen pod maskou',()=>{
 const m=toon.buildingMaterial({ramp:toon.toonRamp(),farZ:-245}),lib=THREE.ShaderLib.toon,sh={uniforms:{},vertexShader:lib.vertexShader,fragmentShader:lib.fragmentShader};
 m.onBeforeCompile(sh);
 assert.ok(sh.uniforms.winColor&&sh.uniforms.farZ.value===-245);
 for(const part of Object.values(toon.BUILDING_FRAG))assert.ok(sh.fragmentShader.includes(part),part.slice(0,40));
 assert.ok(sh.vertexShader.includes('vWz=(modelMatrix*vec4(transformed,1.)).z;'));
 const f=sh.fragmentShader,at=s=>f.indexOf(s);// pořadí: okna → maska po světlech → alfa až na konci (po mlze)
 assert.ok(at('#include <emissivemap_fragment>')<at('float wl=')&&at('#include <lights_fragment_end>')<at('float htMask')&&at('#include <fog_fragment>')<at('gl_FragColor.a=1.-htMask'));
 // každý #include musí existovat v ShaderChunk r170 (jinak by shader nešel přeložit)
 for(const [,name] of f.matchAll(/#include <(\w+)>/g))assert.ok(name in THREE.ShaderChunk,name);
 assert.ok(/getShadow\(directionalShadowMap\[0\]/.test(f)&&f.includes('getGradientIrradiance(normal,directionalLights[0].direction)'));
 const post=toon.postPass().mat.fragmentShader;assert.ok(post.includes('clamp(1.-c.a,0.,1.)'),'tečky jen pod maskou');assert.ok(post.includes(',1.);}'),'výstup neprůhledný');
});

test('cedule bez monospace: písmo DISPLAY z palette.js (U18)',()=>{
 const s=src('toon.js');assert.ok(s.includes('px ${DISPLAY}`'));assert.ok(!s.includes('monospace'));
});

test('obrysy Dílny: userData.base (nebo původní tloušťka) × DPR při každém resize, bez kumulace',()=>{
 const res=new THREE.Vector2(1280,720),a=toon.outlineMaterial({thickness:2.2}),b=toon.outlineMaterial({thickness:1.6});b.userData.base=1.7;
 for(const d of [2,1.5,1]){scene.scaleOutline(a,res,d);scene.scaleOutline(b,res,d);assert.ok(Math.abs(a.uniforms.thickness.value-2.2*d)<1e-9&&Math.abs(b.uniforms.thickness.value-1.7*d)<1e-9,`dpr ${d}`);}
 assert.ok(a.uniforms.resolution.value.equals(res));
});
