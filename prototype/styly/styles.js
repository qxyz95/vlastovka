// Pět stylových směrů pro srovnání (čistá data, bez three.js a DOM, běží i v Node pro výpočet kontrastů).
// A0 = dnešní hra (barvy z src/render3d/mood.js a palette.js), B–E = nové směry z research/design/04-nove-smery.md.
// Každý směr: render (jak se kreslí), districts[4] (barvy pro místa 1, 5, 9, 13), qte, ui (třída CSS v ui.css).
import {MOOD_KEYS} from '../../src/render3d/mood.js';
import {CYBER,INK,PAPER,CYAN,MAGENTA,GOLD,MUTE} from '../../src/render3d/palette.js';

export const mix=(a,b,k)=>{const h=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),x=h(a),y=h(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
export const DISTRICT_KINDS=['suburbs','docks','horizon','core'];
export const PLACES=[['Workshop & First Roofs','Gardens at the Edge'],['Crane Forest','Lighthouse Point'],['Mountain Saddle','Wind Fields'],['Broadcast Tower','City Gate']];

// A0: dnešek. Nálada ze středu 2. místa čtvrti (mood.js klíče 1, 5, 9, 13), barvy budov z palette.city.
const A0D=[1,5,9,13].map((k,i)=>{const m=MOOD_KEYS[k],c=CYBER.city;return {
 name:['Violet Suburbs','Moon Docks','Red Horizon','Neon Core'][i],time:['fialový soumrak','měsíční noc','druhý západ','neonová noc'][i],
 mood:m,sky:m.sky,fog:m.fog,wall:c.biomes[i],accent:c.accent[i],ground:c.ground[i],
 plane:{fill:PAPER,edge:INK},trail:{core:m.trail,edge:INK}};});

// Riso barvy (oficiální odstíny inkoustů RISO, jen jako inspirace; tisk se simuluje násobením).
export const RISO={paper:'#f4efe4',black:'#1d1d24',pink:'#ff48b0',blue:'#0078bf',yellow:'#ffe800',orange:'#ff6c2f',teal:'#00838a',federal:'#3d5588',purple:'#765ba7',red:'#ff665e'};
const t=(ink,k)=>mix(RISO.paper,ink,k);

export const STYLES=[
{id:'a0',letter:'A0',name:'Dnešek: Neonový komiks',pitch:'Výchozí bod pro srovnání: toon, obrysy, půltón, okna a neon (schválená bible 02).',
 render:{kind:'a0',cityOutline:2.5,planeOutline:2.6,ink:INK,flat:false,clouds:'a0'},
 districts:A0D,
 qte:{disc:INK,discAlpha:.6,track:MUTE,success:CYAN,perfect:MAGENTA,dot:PAPER},value:GOLD},

{id:'b',letter:'B',name:'Papírové město',pitch:'Papírová vlaštovka konečně patří do svého světa: celé město je vystřižené z barevného papíru a hráč letí nad dioramem, které by si dítě z Dílny postavilo na stole.',
 render:{kind:'paper',cityOutline:0,planeOutline:1.8,ink:'#2b2725',flat:true,clouds:'paper',shadows:true,post:{grain:.05,vignette:.18,levels:0,misreg:0,paperTint:'#fbf4e4'}},
 districts:[
  {name:'Paper Suburbs',time:'ráno',sky:['#7fbfe0','#a6d4e6','#cfe6e6','#f6eedd'],bands:true,sun:{x:.82,y:.2,r:.06,color:'#fff6dc',halo:'#f9e3b0'},
   fog:{color:'#e9efe6',near:700,far:2600},layers:[['#bfd6d6','#c9dccf'],['#e7a28f','#f2c48d','#a9c6b8','#d6b7d9'],['#e0533a','#f2b84b','#2f8f8a','#f6eedd','#ef9a8f']],
   roof:'#2b3f63',ground:'#cdb08a',accent:'#e0533a',light:'#fff6e0',shade:'#5a4a6a',windows:{color:'#2b3f63',density:.25},
   plane:{fill:'#ffffff',edge:'#2b2725'},trail:{core:'#2b2725',edge:null,dash:true}},
  {name:'Paper Docks',time:'poledne u moře',sky:['#4fa3d1','#7cbde0','#b5dbe9','#e9f2ef'],bands:true,sun:{x:.25,y:.12,r:.05,color:'#fffbea',halo:'#d9eef5'},
   fog:{color:'#d7e9ef',near:600,far:2400},layers:[['#9ec2d6','#b6d0de'],['#3d6f8f','#e8b03e','#e0533a','#5b8fb0'],['#22355e','#c8a079','#f6eedd','#e0533a']],
   roof:'#22355e',ground:'#c8a079',water:'#2c6e9b',accent:'#e0533a',light:'#ffffff',shade:'#3c4f6e',windows:{color:'#22355e',density:.2},
   plane:{fill:'#ffffff',edge:'#2b2725'},trail:{core:'#2b2725',edge:null,dash:true}},
  {name:'Paper Fields',time:'zlaté odpoledne',sky:['#f1b45a','#f6cb7c','#f9dfa6','#fbeccc'],bands:true,sun:{x:.78,y:.42,r:.12,color:'#fff6dc',halo:'#fbe2a8'},
   fog:{color:'#f7dcae',near:700,far:2600},layers:[['#d9967a','#cf8a73'],['#d9a35a','#c98a4a','#e0b070'],['#b8863b','#f6eedd','#e0533a','#8fb07a']],
   roof:'#7a3b2e',ground:'#b8863b',accent:'#f6eedd',light:'#fff1d6',shade:'#7a4a3a',windows:{color:'#7a3b2e',density:.1},
   plane:{fill:'#ffffff',edge:'#2b2725'},trail:{core:'#2b2725',edge:null,dash:true}},
  {name:'Paper City',time:'večer',sky:['#1d2b4d','#2b3f6b','#4a5f8f','#e08a74'],bands:true,moon:{x:.7,y:.18,r:.04,color:'#f6eedd'},
   fog:{color:'#3a4a73',near:600,far:2400},layers:[['#3a4a73','#41527c'],['#2b3f6b','#33497a','#5a4a7a'],['#1d2b4d','#26365c','#e0533a','#2f8f8a']],
   roof:'#151f38',ground:'#1d2b4d',accent:'#f2c14e',light:'#ffe9c0',shade:'#0f1830',windows:{color:'#f2c14e',density:.45,glow:true},
   plane:{fill:'#ffffff',edge:'#2b2725'},trail:{core:'#f6eedd',edge:null,dash:true}}],
 qte:{disc:'#f6eedd',discAlpha:.95,track:'#8a7f72',success:'#1f8a8a',perfect:'#e0533a',dot:'#2b2725'},value:'#e8b03e'},

{id:'c',letter:'C',name:'Cestovní plakát',pitch:'Každý okamžik letu vypadá jako starý cestovní plakát „Fly to the Horizon“: velké slunce, ploché barvy, černá kresba a dramatické siluety.',
 render:{kind:'poster',cityOutline:2.2,planeOutline:3,ink:'#161616',flat:false,clouds:'poster',post:{grain:.035,vignette:0,levels:0,misreg:0,paperTint:'#fff8e8'}},
 districts:[
  {name:'Sunrise Suburbs',time:'jitro',sky:['#f4c98a','#f6d9a4','#f8e7c2','#fbf1da'],bands:true,sun:{x:.8,y:.62,r:.13,color:'#f07a4f',rays:'#f6b98a'},
   fog:{color:'#f3dcc0',near:500,far:2200},layers:[['#8fb3c4','#9fbfcc'],['#e8836a','#d9644a','#e9a17a'],['#2d5b7a','#c94a35','#f3ead2','#1f4560']],
   roof:'#1f4560',ground:'#2d5b7a',accent:'#c94a35',light:'#fff1d0',shade:'#1f3550',windows:{color:'#1f4560',density:.18},
   plane:{fill:'#ffffff',edge:'#161616'},trail:{core:'#f3ead2',edge:'#161616'}},
  {name:'Moon Harbour',time:'měsíční noc',sky:['#162a4a','#1f3d66','#2e5a87','#3f72a0'],bands:true,moon:{x:.3,y:.22,r:.07,color:'#f3ead2'},
   fog:{color:'#2a4f78',near:500,far:2200},layers:[['#24456e','#2a4e78'],['#142640','#1b3150'],['#0e1a2e','#13233c','#c94a35']],
   roof:'#0a1322',ground:'#0e1a2e',water:'#1e4a75',accent:'#f2b33d',light:'#3f72a0',shade:'#060c18',windows:{color:'#f2b33d',density:.3,glow:true},
   plane:{fill:'#ffffff',edge:'#161616'},trail:{core:'#f3ead2',edge:'#161616'}},
  {name:'Great Sunset',time:'velký západ slunce',sky:['#7b2d4a','#c8453a','#ec7a2f','#f6b54a'],bands:true,sun:{x:.78,y:.55,r:.2,color:'#fde3a0',rays:'#f9c56a'},
   fog:{color:'#d9643a',near:500,far:2400},layers:[['#b84a45','#a8443f'],['#6e2a45','#7a3048'],['#2e1430','#3a1a38','#c94a35']],
   roof:'#1e0c20',ground:'#2e1430',accent:'#fde3a0',light:'#f6b54a',shade:'#160818',windows:{color:'#fde3a0',density:.05},
   plane:{fill:'#ffffff',edge:'#161616'},trail:{core:'#f3ead2',edge:'#161616'}},
  {name:'Night Metropolis',time:'noční metropole',sky:['#0f1426','#1b2244','#2c3366','#4a3f7a'],bands:true,beams:'#f3ead2',
   fog:{color:'#262c5a',near:500,far:2300},layers:[['#232a52','#2a3260'],['#171c3a','#1d2346'],['#0c0f20','#11152a','#c94a35']],
   roof:'#05070f',ground:'#0c0f20',accent:'#e85d4a',light:'#3a4280',shade:'#04050c',windows:{color:'#f2b33d',colors:['#f2b33d','#e85d4a','#7fd1e0'],density:.4,glow:true},
   plane:{fill:'#ffffff',edge:'#161616'},trail:{core:'#f3ead2',edge:'#161616'}}],
 qte:{disc:'#161616',discAlpha:.85,track:'#f3ead2',success:'#7fd1e0',perfect:'#ff7a5c',dot:'#ffffff'},value:'#f2b33d'},

{id:'d',letter:'D',name:'Risograf',pitch:'Hra jako vytištěný fanzin: dvě tři zářivé tiskové barvy, které se přetiskují přes sebe, zrno papíru a lehce ujetý soutisk, vtipné a hravé.',
 render:{kind:'riso',cityOutline:0,planeOutline:3,ink:RISO.black,flat:false,clouds:'riso',post:{grain:.09,vignette:0,levels:0,misreg:1.6,paperTint:RISO.paper}},
 districts:[
  {name:'Pink Suburbs',time:'ráno (růžová + modrá + žlutá)',sky:[t(RISO.pink,.55),t(RISO.pink,.38),t(RISO.yellow,.35),t(RISO.yellow,.18)],bands:false,sun:{x:.8,y:.3,r:.09,color:t(RISO.yellow,.9)},
   fog:{color:t(RISO.pink,.25),near:900,far:3200},layers:[[t(RISO.blue,.35),t(RISO.pink,.35)],[t(RISO.blue,.6),t(RISO.pink,.65),t(RISO.yellow,.8)],[RISO.blue,RISO.pink,t(RISO.yellow,.95),t(RISO.blue,.8)]],
   roof:RISO.federal,ground:t(RISO.blue,.55),accent:RISO.pink,light:RISO.paper,shade:RISO.federal,windows:{color:RISO.yellow,density:.3},
   plane:{fill:'#fbf8f2',edge:RISO.black},trail:{core:RISO.pink,edge:RISO.federal}},
  {name:'Teal Docks',time:'noc (federální modrá + tyrkys)',sky:[t(RISO.federal,.95),t(RISO.federal,.75),t(RISO.teal,.6),t(RISO.teal,.4)],bands:false,moon:{x:.3,y:.22,r:.07,color:RISO.paper},
   fog:{color:t(RISO.teal,.45),near:900,far:3200},layers:[[t(RISO.teal,.6),t(RISO.federal,.5)],[t(RISO.federal,.8),t(RISO.teal,.85)],[RISO.federal,RISO.teal,t(RISO.pink,.8)]],
   roof:'#2a3a62',ground:RISO.federal,water:t(RISO.teal,.7),accent:RISO.pink,light:RISO.paper,shade:'#1e2a4a',windows:{color:RISO.yellow,density:.25},
   plane:{fill:'#fbf8f2',edge:RISO.black},trail:{core:RISO.pink,edge:RISO.federal}},
  {name:'Orange Horizon',time:'západ (oranžová + žlutá + červená)',sky:[t(RISO.orange,.75),t(RISO.orange,.5),t(RISO.yellow,.7),t(RISO.yellow,.45)],bands:false,sun:{x:.78,y:.5,r:.17,color:RISO.paper},
   fog:{color:t(RISO.orange,.4),near:900,far:3200},layers:[[t(RISO.red,.55),t(RISO.orange,.6)],[t(RISO.red,.85),RISO.orange],[t(RISO.purple,.9),RISO.red,t(RISO.federal,.8)]],
   roof:RISO.federal,ground:t(RISO.purple,.9),accent:RISO.paper,light:RISO.paper,shade:RISO.federal,windows:{color:RISO.yellow,density:.08},
   plane:{fill:'#fbf8f2',edge:RISO.black},trail:{core:RISO.blue,edge:RISO.federal}},
  {name:'Purple Core',time:'noc (fialová + růžová + modrá)',sky:[t(RISO.purple,.8),t(RISO.purple,.6),t(RISO.blue,.45),t(RISO.pink,.45)],bands:false,
   fog:{color:t(RISO.purple,.5),near:900,far:3200},layers:[[t(RISO.blue,.4),t(RISO.purple,.45)],[t(RISO.blue,.6),t(RISO.pink,.5)],[t(RISO.blue,.85),t(RISO.purple,.8),t(RISO.pink,.8)]],
   roof:'#241a3e',ground:'#2a2050',accent:RISO.pink,light:RISO.paper,shade:'#1a1230',windows:{color:RISO.yellow,colors:[RISO.yellow,RISO.pink],density:.4,glow:true},
   plane:{fill:'#fbf8f2',edge:RISO.black},trail:{core:RISO.yellow,edge:RISO.federal}}],
 qte:{disc:RISO.paper,discAlpha:.94,track:RISO.federal,success:RISO.blue,perfect:'#d1517a',dot:RISO.black},value:RISO.yellow},

{id:'e',letter:'E',name:'Protisvětlo',pitch:'Klidný, nádherný let proti zapadajícímu slunci: město jako vrstvy siluet v oparu, jemné přechody oblohy a vlaštovka, která je vždy opakem nebe za ní.',
 render:{kind:'backlit',cityOutline:0,planeOutline:1.6,ink:'#1c1424',flat:false,clouds:'streaks',post:{grain:.025,vignette:.22,levels:0,misreg:0}},
 districts:[
  {name:'Golden Suburbs',time:'zlatá hodina',sky:['#6d5a9e','#e98a8a','#ffcf9a','#fff0c8'],bands:false,sun:{x:.82,y:.66,r:.07,color:'#fff8e6',glow:'#ffd9a0'},
   fog:{color:'#f6c49a',near:150,far:2300},layers:[['#e4a08e','#e09a8c'],['#b8747f','#ad6c7a'],['#4a2f48','#55344f','#5f3a58']],
   roof:'#3d2a45',ground:'#3d2a45',accent:'#ffd9a0',light:'#ffd9a0',shade:'#3d2a45',windows:{color:'#ffd27a',density:.08,glow:true},
   plane:{fill:'#2b1e33',edge:'#fff2d6',rim:true},trail:{core:'#fff2d6',edge:null,soft:true}},
  {name:'Blue Docks',time:'modrá hodina',sky:['#0f1c3d','#1f3d6b','#4a7aa6','#9cc6d8'],bands:false,moon:{x:.3,y:.25,r:.035,color:'#eef6ff',glow:'#6f9cc4'},
   fog:{color:'#5c88ad',near:150,far:2300},layers:[['#4f7898','#4a7292'],['#2b4867','#2f4d6c'],['#12213a','#162740','#1d334d']],
   roof:'#0c182c',ground:'#12213a',water:'#2a4c6c',accent:'#ffcf7a',light:'#9cc6d8',shade:'#0c182c',windows:{color:'#ffcf7a',density:.12,glow:true},
   plane:{fill:'#f4f7ff',edge:'#14203a',rim:false},trail:{core:'#f4f7ff',edge:null,soft:true}},
  {name:'Great Sun',time:'velké slunce',sky:['#3c2a5e','#c4506a','#ff9a5a','#ffe2a0'],bands:false,sun:{x:.75,y:.58,r:.16,color:'#fff4d0',glow:'#ffb070'},
   fog:{color:'#f08a5a',near:150,far:2400},layers:[['#c96a5a','#c46658'],['#9a4a55','#8f4450'],['#2e1530','#3a1a38','#45203f']],
   roof:'#2a1228',ground:'#3d1d38',accent:'#ffe2a0',light:'#ffe2a0',shade:'#2a1228',windows:{color:'#ffd27a',density:.03,glow:true},
   plane:{fill:'#2a1830',edge:'#ffe9c0',rim:true},trail:{core:'#ffe9c0',edge:null,soft:true}},
  {name:'Night City',time:'noc a záře města',sky:['#0a0c1e','#16183a','#2b2758','#6a4a80'],bands:false,
   fog:{color:'#3a2f60',near:150,far:2300},layers:[['#4a3f72','#45396a'],['#2a2248','#2e254e'],['#120f24','#17132c','#1c1734']],
   roof:'#0a0818',ground:'#120f24',accent:'#ffcf7a',light:'#6a4a80',shade:'#0a0818',windows:{color:'#ffcf7a',colors:['#ffcf7a','#ffe6b0','#9fd8ff'],density:.35,glow:true},
   plane:{fill:'#ffffff',edge:'#9fd8ff',rim:true},trail:{core:'#ffffff',edge:null,soft:true}}],
 qte:{disc:'#000000',discAlpha:.62,track:'#ece6f5',success:'#a8ecff',perfect:'#ffb3cf',dot:'#ffffff'},value:'#ffd27a'}
];
export const styleById=id=>STYLES.find(s=>s.id===id)??STYLES[0];
