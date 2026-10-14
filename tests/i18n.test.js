import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {t,num,unit,pct,setLang,getLang,pickLang,setStrict,has,paramsOf,LOCALES,LANG_IDS,DEFAULT_LANG,translateMessage} from '../src/i18n.js';
import en from '../src/locales/en.js';
import cs from '../src/locales/cs.js';
import {BRANCHES,MODELS} from '../src/config.js';
import {ROUTE,DISTRICTS,routeAt,districtAt,SCREEN_METERS} from '../src/scenes.js';
import {throwSettings} from '../src/throw.js';
import {angleHint} from '../src/core.js';
import {eventView,EVENT_VIEWS} from '../src/render3d/events-view.js';
setStrict(true);
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('i18n: both dictionaries have the same keys, the same {params} and the plural forms of their language',()=>{
 assert.deepEqual(LANG_IDS,['en','cs']);assert.equal(DEFAULT_LANG,'en');
 assert.deepEqual(Object.keys(cs).sort(),Object.keys(en).sort());
 for(const k of Object.keys(en)){
  assert.deepEqual(paramsOf(cs[k]),paramsOf(en[k]),`params of ${k}`);
  assert.equal(typeof cs[k],typeof en[k],`shape of ${k}`);
  if(typeof en[k]==='object'){assert.deepEqual(Object.keys(en[k]).sort(),['one','other'],k);assert.deepEqual(Object.keys(cs[k]).sort(),['few','many','one','other'],k);}
  else {assert.ok(en[k].trim(),`empty en ${k}`);assert.ok(cs[k].trim(),`empty cs ${k}`);}
 }
});
test('i18n: params, Czech plurals 1 hod / 2 hody / 5 hodů, English one/other',()=>{
 assert.equal(t('detail.buy',{price:35},'en'),'Buy for 35 ◈');assert.equal(t('detail.buy',{price:1240},'cs'),'Koupit za 1 240 ◈');
 assert.deepEqual([1,2,4,5,22,1.5].map(count=>t('unit.throws',{count},'cs')),['1 hod','2 hody','4 hody','5 hodů','22 hodů','1,5 hodu']);
 assert.deepEqual([1,2,0].map(count=>t('unit.throws',{count},'en')),['1 throw','2 throws','0 throws']);
 assert.equal(t('detail.missing',{count:1},'cs'),'Chybí 1 mince.');assert.equal(t('detail.missing',{count:5},'cs'),'Chybí 5 mincí.');
 assert.equal(t('detail.missing',{count:1},'en'),'1 coin short.');
 assert.equal(t('detail.locked',{},'en'),'Buy level {level} of this branch first.','missing param stays visible');
});
test('i18n: number and unit format follows the language',()=>{
 assert.equal(num(1240,0,'en'),'1,240');assert.equal(num(1240,0,'cs'),'1 240');
 assert.equal(num(1240.5,1,'en'),'1,240.5');assert.equal(num(1240.5,1,'cs'),'1 240,5');
 assert.equal(unit(4876,'m',0,'en'),'4,876 m');assert.equal(unit(12.25,'s',1,'cs'),'12,3 s');
 assert.equal(pct(.75,0,'en'),'75%');assert.equal(pct(.75,0,'cs'),'75 %');
});
test('i18n: choice of language: URL wins, then the stored value, otherwise English',()=>{
 assert.equal(pickLang('cs','en'),'cs');assert.equal(pickLang('EN','cs'),'en');
 assert.equal(pickLang('de','cs'),'cs');assert.equal(pickLang(null,'cs'),'cs');
 assert.equal(pickLang(null,null),'en');assert.equal(pickLang('__proto__','toString'),'en');
 assert.equal(setLang('xx'),'en');assert.equal(setLang('cs'),'cs');assert.equal(getLang(),'cs');setLang('en');
});
test('i18n: a missing key falls back to English, in strict mode (tests) it fails',()=>{
 const saved=cs['hud.best'];delete cs['hud.best'];
 try{setStrict(false);assert.equal(t('hud.best',{},'cs'),'BEST');assert.equal(t('no.such.key'),'no.such.key');
  setStrict(true);assert.throws(()=>t('hud.best',{},'cs'),/missing key "hud.best"/);assert.throws(()=>t('no.such.key'),/missing key/);}
 finally{cs['hud.best']=saved;setStrict(true);}
});
test('i18n: every dynamic key built from game data exists',()=>{
 const keys=[...BRANCHES.flatMap(b=>['branch.'+b.id,'branch.'+b.id+'.effect']),...Object.keys(MODELS).flatMap(m=>['model.'+m,'model.'+m+'.desc']),
  ...ROUTE.flatMap(r=>['place.'+r.kind,'place.'+r.kind+'.story']),...DISTRICTS.map(d=>'district.'+d.id),
  ...[0,.4,.8,1].map(c=>'throw.'+throwSettings(15,c).grade),...[-12,-5,0,5,12].map(d=>angleHint(20+d,20)),
  ...['success','perfect','miss'].flatMap(r=>['feedback.'+r,'popup.'+r])];
 for(const id of LANG_IDS)for(const k of keys)assert.ok(has(k,id),`${id}: ${k}`);
 for(const type of Object.keys(EVENT_VIEWS))assert.ok(eventView(type).title&&eventView(type).caption);
});
test('i18n: switching the language at run time changes place, district and event texts',()=>{
 const x=SCREEN_METERS*1.5;
 setLang('en');assert.equal(routeAt(x).name,'Market under the Bunting');assert.equal(districtAt(x).name,'SUNRISE ROOFS · 2/4 · Market under the Bunting');
 assert.equal(eventView({type:'gust',phase:'warning',at:0,result:null},.1).label,'! GET READY');
 setLang('cs');assert.equal(routeAt(x).name,'Trh pod praporky');assert.equal(routeAt(0).story,'Z okna dílny vyrážíš nad spící ulici.');
 assert.equal(districtAt(x).name,'STŘECHY ZA ÚSVITU · 2/4 · Trh pod praporky');
 assert.equal(eventView({type:'gust',phase:'interaction',at:0,result:null},1).label,'↓ KLEPNI');assert.equal(eventView('bird').title,'Papírový holub-kurýr');
 setLang('en');
});
test('i18n: district and place names follow the Paper City bible, set C (decision 14. 10.)',()=>{
 const want={en:['SUNRISE ROOFS','BRIGHT HARBOR','GOLDEN FIELDS','LANTERN CITY'],cs:['STŘECHY ZA ÚSVITU','SLUNNÝ PŘÍSTAV','ZLATÁ POLE','MĚSTO LAMPIONŮ']};
 const places={en:{market:'Market under the Bunting',turbines:'Windmill Ridge',gate:'Gates of the Lantern City',tower:'Clock Tower'},cs:{market:'Trh pod praporky',turbines:'Hřeben větrníků',gate:'Brány Města lampionů',tower:'Hodinová věž'}};
 for(const lang of ['en','cs']){setLang(lang);assert.deepEqual(DISTRICTS.map(d=>t('district.'+d.id)),want[lang]);for(const [k,v] of Object.entries(places[lang]))assert.equal(t('place.'+k),v);}
 setLang('en');
});
// Strážní test: v hráčských souborech nezůstal natvrdo český text (česká písmena mimo komentáře) a všechny klíče existují.
const CZ=/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/;
const stripJs=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[\s;{}),])\/\/.*$/gm,'$1');
const stripHtml=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/aria-label="Čeština"/g,'');// název jazyka se nepřekládá
test('guard: no hard-coded Czech text left in index.html, bonus.html, ui.js and the translated modules',()=>{
 const files={'index.html':stripHtml(read('index.html')),'bonus.html':stripHtml(read('bonus.html'))};
 for(const p of ['ui.js','config.js','scenes.js','events.js','throw.js','core.js','juice.js','atmosphere.js','decorations.js','render3d/events-view.js','render3d/ui-layer.js','render3d/camera.js'])files[p]=stripJs(read('src/'+p));
 for(const [name,text] of Object.entries(files))text.split('\n').forEach((line,i)=>assert.ok(!CZ.test(line),`${name}:${i+1} contains Czech text: ${line.trim().slice(0,90)}`));
});
test('guard: every data-i18n key and every literal t(\'…\') key exists in both dictionaries',()=>{
 const used=new Set();
 for(const p of ['index.html','bonus.html'])for(const [,k] of read(p).matchAll(/data-i18n(?:-aria)?="([^"]+)"/g))used.add(k);
 for(const p of ['ui.js','juice.js','atmosphere.js','render3d/ui-layer.js','render3d/events-view.js'])for(const [,k] of read('src/'+p).matchAll(/\b(?:t|tr)\(\s*'([a-z][\w.]*\w)'/g))used.add(k);
 for(const [,k] of read('src/ui.js').matchAll(/'((?:help|flight|aim|result|banner|node|detail)\.[A-Za-z.]+)'/g))used.add(k);
 assert.ok(used.size>60,`found ${used.size} keys`);
 for(const k of used)for(const id of LANG_IDS)assert.ok(has(k,id),`${id}: missing "${k}"`);
 assert.match(read('index.html'),/^<!doctype html>\r?\n<html lang="en">/,'default language in the HTML is English');
});
test('i18n: every save warning from storage.js is shown in the chosen language',async()=>{
 const src=read('src/storage.js'),msgs=[...src.matchAll(/'([^'\n]{20,}\.)'/g)].map(x=>x[1]).filter(s=>/ /.test(s));
 assert.ok(msgs.length>=4,'warnings found in storage.js');
 for(const msg of msgs){const en=translateMessage(msg,'storage.','en'),cz=translateMessage(msg,'storage.','cs');
  assert.notEqual(en,cz,`no storage.* key for "${msg}"`);assert.ok(has(Object.keys(LOCALES.en).find(k=>LOCALES.en[k]===en),'cs'));}
 assert.equal(translateMessage(''),'');assert.equal(translateMessage('Unknown text.'),'Unknown text.');
 const store={},ls=globalThis.localStorage;globalThis.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>{if(k.endsWith('-corrupt'))store[k]=v;else throw Error('full');}};
 try{const {load,save,KEY}=await import('../src/storage.js');store[KEY]='{broken';
  assert.equal(translateMessage(load().warning,'storage.','en'),t('storage.corruptBackup',{},'en'));
  assert.equal(translateMessage(save({}),'storage.','en'),t('storage.saveFailed',{},'en'));
  assert.equal(translateMessage(save({}),'storage.','cs'),t('storage.saveFailed',{},'cs'));}
 finally{globalThis.localStorage=ls;}
});
test('U1: removed style keys are gone and unread; no night/neon wording; new keys from UX 5.1 and menu 10 exist with the same params',()=>{
 const gone=k=>/^theme\./.test(k)||['nav.style','nav.styleLabel','brand.sub'].includes(k);
 for(const d of [en,cs])assert.deepEqual(Object.keys(d).filter(gone),[]);
 const srcs=[...readdirSync(new URL('../src/',import.meta.url),{recursive:true}).filter(f=>f.endsWith('.js')&&!f.startsWith('locales')).map(f=>read('src/'+f)),read('index.html'),read('bonus.html')];
 for(const s of srcs)assert.ok(!/['"`]theme\.|nav\.style|brand\.sub|data-i18n="theme/.test(s),'a removed key is still read');
 for(const [lang,d] of [['en',en],['cs',cs]])for(const [k,v] of Object.entries(d))assert.ok(!/neon|night|cyber|noc[ní]|noční|neonov|kyber/i.test(JSON.stringify(v)),`${lang}: ${k} mentions night/neon`);
 for(const k of ['prompt.throw','prompt.hintTouch','prompt.tooShort','status.thrown','menu.coins','hud.newBest','gain.atlasPlace','result.coinsNow','result.canBuy','workshop.levelOf','atlas.lockedAt','settings.fullscreen','settings.tapToggle','confirm.delete','pause.cancelHelp','flight.btnIdle'])for(const id of LANG_IDS)assert.ok(has(k,id),`${id}: ${k}`);
 assert.deepEqual(paramsOf(en['status.thrown']),['angle','grade']);
 assert.equal(t('scene.label',{},'en'),'A paper plane over a paper town at sunrise');assert.equal(t('workshop.launch',{},'cs'),'Hoď ji ↗');
 assert.equal(t('result.canBuy',{count:1},'cs'),'Stačí na 1 vylepšení');assert.equal(t('menu.coins',{count:2},'cs'),'2 mince');
 assert.match(read('bonus.html'),/theme-color" content="#d9c4a0"/);assert.match(read('bonus.html'),/color-scheme" content="light"/);
});
test('guard: navigation links and language buttons keep a 44 px touch target (also on bonus.html without the picker)',()=>{
 const css=read('style.css');
 assert.match(css,/\.page-nav a\{[^}]*min-height:44px/);assert.match(css,/\.lang-picker button\{[^}]*min-height:44px;min-width:44px/);
});
