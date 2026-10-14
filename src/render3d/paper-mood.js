// Nálady Papírového města (čisté, ?styl=papir). Zdroj pravdy: bible research/design/05-styl-papir.md kap. 2.3 a 4, prototyp papir-data.js D1.
// 17 klíčů ve tvaru mood.js (16 míst ROUTE + úsvit za cílem), jedna nálada na čtvrť: ráno, poledne u moře, zlaté odpoledne, večer s lampiony.
// Čtvrť 1 navržená, čtvrti 2–4 a úsvit prozatímní (bible 2.3); polohy slunce a měsíce mimo čtvrť 1 jsou jen hrubé podle slov bible.
// Navíc proti mood.js: skyAt (zastávky přechodu 0–1 shora), sun {x,y,r} (podíl šířky / výšky obrazu), haze {low,high,from,to,max,curve}
// (opar podle hloubky max·((−z−from)/(to−from))^curve, barva od low u země k high ve 160 m), light [x,y,z] směr ke slunci, shadow (barva stínů).
// Světla three.js (key, rim, hemi) a fog papírový shader nečte; jsou tu jen kvůli shodnému tvaru a záloze.
import {PAPER_TOKENS as T} from './palette.js';

const norm=v=>{const l=Math.hypot(...v)||1;return v.map(c=>c/l);};
const SKY_AT=[0,.42,.74,.9],LIGHT=[.62,.5,.6],OFF={color:'#fff8e8',halo:'#ffd9a8',height:-.2,alpha:0,x:.8,y:1.2,r:.05};
const sun=(color,halo,x,y,r,alpha=1)=>({color,halo,height:1-y,alpha,x,y,r});
const key=(sky,{sun:s,moon=null,haze,trail=T.graphite,light=LIGHT})=>({
 sky,skyAt:SKY_AT,sun:s,sun2:OFF,moon:moon??{color:'#f6eedd',height:.1,alpha:0},
 key:{color:s.alpha?s.color:'#f6eedd',intensity:1,dir:norm(light)},rim:{color:s.halo,intensity:0},hemi:{sky:T.paper,ground:'#5b4f7a',intensity:1.7},
 fog:{color:haze.low,near:haze.from,far:haze.to},haze,light,shadow:T.shade,
 windows:0,windowColor:'#ffe2a8',neon:0,night:0,trail,particles:{color:T.cream,density:0,kind:'motes'}});
const H=(low,high=low,max=.72)=>({low,high,from:20,to:700,max,curve:.8});
// Čtvrť 1 „ráno“ (navrženo): plynulá obloha, slunce vpravo nahoře se září, opar teplý dole a studený nahoře.
const MORNING=key(['#78b4dc','#a6d0e8','#d8e9ea','#fce4c6'],{sun:sun('#fff8e8','#ffd9a8',.8,.2,.05),haze:H('#f6e6d2','#cfe2ec')});
// Prozatímní (bible 2.3): poledne u moře (slunce vysoko, bílé), zlaté odpoledne (velké nízko), večer (měsíc, stopa krémová).
const NOON=key(['#4fa3d1','#7cbde0','#b5dbe9','#e9f2ef'],{sun:sun(T.paper,T.cream,.7,.1,.04),haze:H('#d7e9ef')});
const GOLDEN=key(['#f1b45a','#f6cb7c','#f9dfa6','#fbeccc'],{sun:sun('#fff8e8','#ffd9a8',.75,.6,.08),haze:H('#f7dcae')});
const EVENING=key(['#1d2b4d','#2b3f6b','#4a5f8f','#e08a74'],{sun:{...OFF},moon:{color:'#f6eedd',height:.75,alpha:1},haze:H('#3a4a73'),trail:T.cream});
const DAWN=key(['#9ab8f0','#ffd0e0','#fff0b0','#fff0b0'],{sun:sun('#fff8e8','#ffd9a8',.5,.88,.06),haze:H('#fff0b0','#ffd0e0')});
// Pořadí = ROUTE (0–15), 16 = úsvit. Uvnitř čtvrti stejná nálada; přechod mezi čtvrtěmi dělá mood.js smooth() mezi středy míst.
export const PAPER_MOODS=Object.freeze([...[MORNING,NOON,GOLDEN,EVENING].flatMap(m=>[m,m,m,m]),DAWN]);
