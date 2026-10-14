// Detektory kousků (research/obsah/05-plan-90-minut.md §4.5, ověření §4.6). Jen měření v simulátoru, ve hře nejsou.
// Kousek = čistá podmínka nad záznamem jednoho letu (f po fly: události s result / resolvedAt / comboBefore, echoes se src, stats.rocketT,
// stats.maxY, stats.skips, w, kit). has(kit) = hráč má v tomto letu přísady. intent = politika bota se záměrem (05 §4.6), null = simulátor
// nemá páku, záměr je NOT ASSESSED. note = kde simulátor kousek nemodeluje věrně.
import {P} from './params.mjs';
import {lv} from './model.mjs';

const done=f=>f.events.filter(e=>e.result&&e.result!=='interrupted').sort((a,b)=>a.resolvedAt-b.resolvedAt);
const regular=f=>done(f).filter(e=>e.type!=='star');
const ok=e=>P.tricks.ok.includes(e.result);
const hasModel=id=>kit=>(kit.model??'dart')===id;
// nejkratší interval mezi vyhodnocením a vyhodnocením následující události (pár a → b), nebo null
const pairGap=(seq,ta,tb)=>{let g=null;for(let i=1;i<seq.length;i++){const a=seq[i-1],b=seq[i];if(a.type===ta&&a.result==='perfect'&&b.type===tb&&b.result==='perfect'){const d=b.resolvedAt-a.resolvedAt;if(g==null||d<g)g=d;}}return g;};
const droneGap=f=>{const ds=done(f).filter(e=>e.type==='drone'&&e.result==='perfect');let g=null;for(let i=1;i<ds.length;i++){const d=ds[i].resolvedAt-ds[i-1].resolvedAt;if(g==null||d<g)g=d;}return g;};

export const TRICKS=[
 {id:'pigeonExpress',name:'Pigeon Express',from:1,has:()=>true,intent:{pocket:'whistle'},
  diag:f=>pairGap(regular(f),'bird','gust'),detect:f=>{const g=pairGap(regular(f),'bird','gust');return g!=null&&g<=P.tricks.pigeonWindow+1e-9;},
  note:'interval puštění holuba → klepnutí dalšího poryvu je v rozvrhu 08 nejméně ~5 s (Whistle ~2,2 s), okno 1,5 s je nedosažitelné'},
 {id:'kettleSong',name:'Kettle Song',from:4,has:kit=>lv(kit,'steam')>0,intent:null,
  detect:f=>done(f).some(e=>e.type==='steam'&&e.result==='perfect'),note:'záměr: simulátor nemá páku na perfektnost (šum časování je vlastnost profilu)'},
 {id:'overTheLine',name:'Over the Line',from:1,has:kit=>(kit.slots??[]).includes('rocket'),intent:{pocket:'rocket'},replay:true,
  detect:(f,replay)=>{const T=f.stats.touchT??[f.t],ts=(f.stats.rocketT??[]).filter(t=>T.some(c=>c>=t-1e-9&&c-t<=P.tricks.lineWindow+1e-9));if(!ts.length||!replay)return false;
   const x0=replay({rocket:{offAfter:ts[0]}}).x,pl=P.route.place;return Math.floor(f.x/pl)>Math.floor(x0/pl);},
  note:'jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet'},
 {id:'tapeSave',name:'Tape Save',from:5,has:kit=>lv(kit,'tape')>0,intent:null,
  detect:f=>{const s=regular(f);for(let i=1;i<s.length;i++)if(s[i-1].result==='miss'&&s[i].result==='perfect')return true;return false;},
  note:'záměr: hráč si minutí nevybírá, simulátor nemá páku'},
 {id:'steamOrgan',name:'Steam Organ',from:11,has:kit=>lv(kit,'steam')>0&&lv(kit,'echo')>0,intent:null,
  detect:f=>done(f).some(e=>e.type==='steam'&&e.result==='perfect'&&f.echoes.some(c=>c.src===e.i&&c.done)),
  note:'pára má v simulátoru 2 obláčky (08), 05 píše 3; Echo je pasivní bonus Atlasu (ne kapsa), záměr „Echo v kapse“ nemá páku'},
 {id:'wish',name:'Wish',from:12,has:kit=>lv(kit,'star')>0,intent:null,
  detect:f=>done(f).some(e=>e.type==='star'&&e.result!=='miss'&&e.comboBefore>=P.tricks.wishCombo),note:'záměr: simulátor nemá páku'},
 {id:'dronePingPong',name:'Drone Ping-Pong',from:13,has:kit=>lv(kit,'drone')>0,intent:{pocket:'whistle'},
  diag:droneGap,detect:f=>{const g=droneGap(f);return g!=null&&g<=P.tricks.droneWindow+1e-9;},
  note:'dvojice dronů (úr. 3) má mezi vyhodnoceními nejméně ~3,1 s (effectMin 1 + followGap 0,2 + 1,88), okno 2 s je nedosažitelné'},
 {id:'allTheVerbs',name:'All the Verbs',from:13,has:kit=>lv(kit,'steam')>0&&(lv(kit,'thermal')>0||lv(kit,'drone')>0),intent:null,
  detect:f=>{const s=done(f).filter(ok),t=new Set(s.map(e=>e.type));return (t.has('gust')||t.has('star'))&&t.has('bird')&&t.has('steam')&&(t.has('thermal')||t.has('drone'));},
  note:'tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku'},
 // kousky modelů = podmínky podpisových skinů K6–K10 (01 §3.2)
 {id:'hawkFeather',name:'Hawk: 3 perfekty za sebou',model:'hawk',has:hasModel('hawk'),intent:{model:'hawk'},
  detect:f=>{let run=0;for(const e of regular(f)){run=e.result==='perfect'?run+1:0;if(run>=P.tricks.hawkRun)return true;}return false;},note:'hvězda řadu nepřerušuje ani nepočítá'},
 {id:'kiteTail',name:'Kite: perfekt termiky nebo 40 m',model:'kite',has:hasModel('kite'),intent:{model:'kite'},
  detect:f=>f.stats.maxY>=P.tricks.kiteY||done(f).some(e=>e.type==='thermal'&&e.result==='perfect')},
 {id:'skimmerRipples',name:'Skimmer: dvojitý odraz',model:'skimmer',has:hasModel('skimmer'),intent:{model:'skimmer'},detect:f=>f.stats.skips>=P.tricks.skimmerSkips},
 {id:'sailStripes',name:'Sail: zadní vítr',model:'sail',has:hasModel('sail'),intent:{model:'sail',wind:true},detect:f=>f.w>=P.tricks.sailWind-1e-9},
 {id:'needleThread',name:'Needle: 2 drony',model:'needle',has:hasModel('needle'),intent:{model:'needle'},
  detect:f=>done(f).filter(e=>e.type==='drone'&&ok(e)).length>=P.tricks.needleDrones},
];
export const trickById=Object.fromEntries(TRICKS.map(t=>[t.id,t]));
export const intentTricks=()=>TRICKS.filter(t=>t.intent).map(t=>t.id);

// Kousky jednoho letu: bitové masky přísad a provedení (pořadí TRICKS) a diagnostika intervalů dvojic.
// replay(bot) = stejný hod s přepsanými boty (protifaktický let Over the Line), volá se jen při výstřelu v posledním okně.
export function detectTricks(f,replay){
 let ing=0,hit=0;const diag={};
 TRICKS.forEach((t,i)=>{if(!t.has(f.kit))return;ing|=1<<i;if(t.detect(f,replay))hit|=1<<i;if(t.diag){const g=t.diag(f);if(g!=null)diag[t.id]=g;}});
 return {ing,hit,diag};
}
