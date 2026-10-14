// Dávka U0 „Jeden styl v UI“ (research/plan-hratelnost/02-ux.md §3.2, rozhodnutí 06 z 15. 10.): statická kontrola souborů.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PAPER_TOKENS} from '../src/render3d/palette.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const stripJs=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[\s;{}),])\/\/.*$/gm,'$1');
const html=read('index.html'),css=read('style.css'),ui=stripJs(read('src/ui.js'));

test('U0: index.html bez přepínače stylů a podtitulku „Neon City“, meta barvy podle světlého papíru',()=>{
 assert.ok(!html.includes('theme-picker'),'#theme-picker');assert.ok(!html.includes('brand.sub'),'brand.sub');assert.ok(!/NEON CITY/i.test(html),'Neon City');
 assert.match(html,/<meta name="theme-color" content="([^"]+)">/);assert.equal(html.match(/<meta name="theme-color" content="([^"]+)">/)[1],PAPER_TOKENS.desk);
 assert.match(html,/<meta name="color-scheme" content="light">/);
 // Logo smí dál vést na "./": vzhled už nezávisí na parametru v adrese, takže klik styl nepřepne.
 assert.match(html,/<a href="\.\/" class="brand">JUST THROW IT<\/a>/);
});
test('U0: style.css má papír na :root, žádné větve stylů ani 2D motivy',()=>{
 for(const s of ['data-styl','data-theme','theme-picker','condensed','--indigo-','--lilac-','--magenta-','--cyan-'])assert.ok(!css.includes(s),s);
 const root=css.match(/:root\{([^}]*)\}/)[1];
 assert.match(root,/color-scheme:light/);assert.match(root,/--desk-300:#d9c4a0/i);assert.match(root,/--page-bg:var\(--desk\)/);assert.match(root,/--btn-primary-bg:var\(--tomato-600\)/);
 const defs=new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m=>m[1]));
 for(const [,v] of css.matchAll(/var\((--[a-z0-9-]+)/g))assert.ok(defs.has(v),'nedefinovaný token '+v);
});
test('U0: ui.js nečte styl z adresy, nemá motivy a renderer dostává style:\'papir\' jako konstantu',()=>{
 assert.ok(!/get\('styl'\)/.test(ui),"?styl=");
 for(const s of ['themes.js','applyTheme','THEME_KEY','theme-picker','data-theme-id','dataset.styl','dataset.theme','PAPER_TOKENS'])assert.ok(!ui.includes(s),s);
 assert.match(ui,/const STYLE='papir'/);assert.match(ui,/style:STYLE/);
 assert.match(ui,/try\{localStorage\.removeItem\('just-throw-it-theme'\);\}catch\{\}/,'starý klíč motivu se jednou uklidí');
});
