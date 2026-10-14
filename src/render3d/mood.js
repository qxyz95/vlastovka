// Nálada (čisté): 16 klíčových snímků (střed každého místa ROUTE) + úsvit za cílem, oblouk „za sluncem“ (research/svet/01-zivy-svet.md §2).
// Fialový soumrak → měsíční noc s mrholením → druhý západ v Red Horizon → neonová noc → úsvit. Vlastní R4, aplikaci ve scéně dělá R1.
// moodAt(x,t,{hold}) → plan.mood. Mezi středy míst smooth(), takže hranice čtvrtí nejsou skok; déšť je přímo atmosphereAt(x,t).rain.
// Tvar (barvy '#rrggbb', délky v m, intenzity pro three.js světla):
//  sky [4 barvy shora k obzoru] · sun/sun2 {color,halo,height,alpha} (height = podíl výšky obrazu nad obzorem, záporné = pod ním)
//  moon {color,height,alpha} · key {color,intensity,dir:[x,y,z] jednotkový, od scény ke světlu} · rim {color,intensity}
//  hemi {sky,ground,intensity} · fog {color,near,far} · windows 0–1 (podíl svítících) · windowColor · neon 0–1 · night 0–1 (hvězdy)
//  rain 0–1 · trail · particles {color,density 0–1,kind} · x, place (index místa, desetinně), district, hold 0–1
import {ROUTE,SCREEN_METERS,SCREENS_PER_BIOME,atmosphereAt,smooth} from '../scenes.js';
import {PAPER_MOODS} from './paper-mood.js';
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,k)=>{const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
const lerp=(a,b,k)=>a+(b-a)*k,norm=v=>{const l=Math.hypot(...v)||1;return v.map(c=>c/l);};
export const ROUTE_END=ROUTE.length*SCREEN_METERS;// 4 876 m
const S=(color,halo,height,alpha)=>({color,halo,height,alpha}),OFF=S('#ffe6b8','#ff9e8a',-.2,0),MOON_OFF={color:'#f4f8ff',height:.1,alpha:0};
const K=(sky,o)=>({sky,sun:OFF,sun2:OFF,moon:MOON_OFF,...o});
// Obzor Neon Core (místa 12–15): 3. pás a obzor tyrkysové, ne limetkové (bible kap. 2.3, rozhodnutí 14. 10.).
export const CORE_HORIZON=Object.freeze(['#2aa99c','#7ff0d8']);
// Pořadí = ROUTE (0–15), 16 = úsvit. kind částic: fireflies, drizzle, pollen, snow, sparks, motes.
const KEYS=[
 K(['#3a2a7a','#7a4fb8','#ff9ec4','#ffc58a'],{sun:S('#ffe6b8','#ffb38a',-.02,.9),key:{color:'#ffb38a',intensity:1.3,dir:[.8,.25,.5]},rim:{color:'#ff6fb5',intensity:.9},
  hemi:{sky:'#b0a2ff',ground:'#5a3a7a',intensity:1.5},fog:{color:'#8a64b8',near:420,far:1500},windows:.3,windowColor:'#ffd27a',neon:.15,night:.05,trail:'#ff8ccf',particles:{color:'#fff3a0',density:.3,kind:'fireflies'}}),
 K(['#35287a','#7048b0','#f08cc0','#ffb88a'],{sun:S('#ffe6b8','#ffaa88',-.05,.75),key:{color:'#ffaa90',intensity:1.25,dir:[.75,.3,.55]},rim:{color:'#ff6fb5',intensity:1},
  hemi:{sky:'#a99cff',ground:'#553670',intensity:1.45},fog:{color:'#8060b0',near:400,far:1450},windows:.4,windowColor:'#ffd27a',neon:.35,night:.15,trail:'#ff8ccf',particles:{color:'#fff3a0',density:.3,kind:'fireflies'}}),
 K(['#302474','#6242a8','#de80c0','#ffa09a'],{sun:S('#ffe0c0','#ff9aa0',-.08,.5),key:{color:'#f0a8c8',intensity:1.2,dir:[.6,.4,.6]},rim:{color:'#ff7ac8',intensity:.9},
  hemi:{sky:'#a09cff',ground:'#4e3470',intensity:1.4},fog:{color:'#7a5cb0',near:400,far:1450},windows:.42,windowColor:'#ffd27a',neon:.15,night:.3,trail:'#ff8ccf',particles:{color:'#fff3a0',density:.5,kind:'fireflies'}}),
 K(['#24226e','#3f4ca4','#8a80d2','#e090b8'],{sun:S('#ffe0c0','#d890c8',-.12,.2),moon:{color:'#f4f8ff',height:.2,alpha:.6},key:{color:'#d8d0ff',intensity:1.35,dir:[-.1,.7,.6]},rim:{color:'#ffb347',intensity:.7},
  hemi:{sky:'#8ca0f0',ground:'#33306a',intensity:1.35},fog:{color:'#4a5a9a',near:340,far:1300},windows:.35,windowColor:'#ffc070',neon:.2,night:.45,trail:'#a8b0ff',particles:{color:'#e0e8ff',density:.3,kind:'drizzle'}}),
 K(['#16306a','#1e5a96','#4f96d0','#94c8f0'],{moon:{color:'#f4f8ff',height:.32,alpha:1},key:{color:'#cfe3ff',intensity:1.6,dir:[-.35,.8,.5]},rim:{color:'#ffb347',intensity:.75},
  hemi:{sky:'#72a6e8',ground:'#1c3a5e',intensity:1.35},fog:{color:'#33608e',near:280,far:1150},windows:.25,windowColor:'#ffb347',neon:.25,night:.6,trail:'#5ce6ff',particles:{color:'#d8f4ff',density:.6,kind:'drizzle'}}),
 K(['#14306c','#1e5c9a','#5098d2','#9ccef2'],{moon:{color:'#f4f8ff',height:.38,alpha:1},key:{color:'#cfe3ff',intensity:1.65,dir:[-.35,.8,.5]},rim:{color:'#ffb347',intensity:.8},
  hemi:{sky:'#74a8ea',ground:'#1a385c',intensity:1.35},fog:{color:'#32608e',near:240,far:1050},windows:.25,windowColor:'#ffb347',neon:.3,night:.65,trail:'#5ce6ff',particles:{color:'#d8f4ff',density:.75,kind:'drizzle'}}),
 K(['#143270','#22609e','#5c9cd4','#a8d4f4'],{moon:{color:'#ffffff',height:.42,alpha:1},key:{color:'#d4e8ff',intensity:1.7,dir:[-.3,.82,.5]},rim:{color:'#5ce6ff',intensity:.7},
  hemi:{sky:'#78acee',ground:'#1a3a60',intensity:1.4},fog:{color:'#3a6a98',near:220,far:980},windows:.22,windowColor:'#ffb347',neon:.25,night:.65,trail:'#5ce6ff',particles:{color:'#d8f4ff',density:.7,kind:'drizzle'}}),
 K(['#1e3274','#3c5eac','#b48ab8','#ffb478'],{sun2:S('#ffe08a','#ff9a50',-.01,.55),moon:{color:'#ffffff',height:.45,alpha:.7},key:{color:'#ffc8a0',intensity:1.5,dir:[.4,.6,.6]},rim:{color:'#ffb347',intensity:.9},
  hemi:{sky:'#a0a8ee',ground:'#3a3a70',intensity:1.4},fog:{color:'#8a7aa8',near:320,far:1350},windows:.2,windowColor:'#ffb347',neon:.2,night:.4,trail:'#9ad8ff',particles:{color:'#e8f0ff',density:.4,kind:'drizzle'}}),
 K(['#3e2c84','#c8507a','#ff9a4a','#ffd27a'],{sun2:S('#ffe89a','#ff8a3d',.12,1),key:{color:'#ff9a50',intensity:1.85,dir:[.85,.3,.45]},rim:{color:'#ffc35a',intensity:1.1},
  hemi:{sky:'#ffb48a',ground:'#6a3a74',intensity:1.5},fog:{color:'#e07a4a',near:420,far:1650},windows:.1,windowColor:'#ffd27a',neon:0,night:0,trail:'#ffd23f',particles:{color:'#ffe9a0',density:.4,kind:'pollen'}}),
 K(['#4a2884','#e05a44','#ffa048','#ffd06a'],{sun2:S('#ffe89a','#ff7a3a',.05,1),key:{color:'#ff8f48',intensity:1.8,dir:[.9,.2,.4]},rim:{color:'#ffc35a',intensity:1.2},
  hemi:{sky:'#ffa888',ground:'#6a3a74',intensity:1.5},fog:{color:'#d86a4a',near:420,far:1650},windows:.1,windowColor:'#ffd27a',neon:0,night:0,trail:'#ffd23f',particles:{color:'#ffe9a0',density:.45,kind:'pollen'}}),
 K(['#4a2a8a','#c8508a','#ff8aa8','#ffc0a0'],{sun2:S('#ffd0a0','#ff6a8a',0,.85),key:{color:'#ff9ab8',intensity:1.5,dir:[.9,.15,.4]},rim:{color:'#ffb0c8',intensity:1},
  hemi:{sky:'#ffa8c8',ground:'#5a3a80',intensity:1.5},fog:{color:'#c8708a',near:400,far:1550},windows:.08,windowColor:'#ffd27a',neon:0,night:.15,trail:'#ffd23f',particles:{color:'#ffffff',density:.4,kind:'snow'}}),
 K(['#2a226e','#5a3a9e','#b46aa8','#ff9e8a'],{sun2:S('#ffc0a0','#ff8a9a',-.06,.4),key:{color:'#e0a8d0',intensity:1.3,dir:[.6,.4,.6]},rim:{color:'#c77dff',intensity:1},
  hemi:{sky:'#a898f0',ground:'#3e2a6a',intensity:1.4},fog:{color:'#7a5098',near:380,far:1450},windows:.25,windowColor:'#ffe0a0',neon:.2,night:.55,trail:'#ffb0d8',particles:{color:'#f0e8ff',density:.25,kind:'snow'}}),
 K(['#1c1c52','#353c9e',...CORE_HORIZON],{key:{color:'#c77dff',intensity:1,dir:[0,.9,.4]},rim:{color:'#5cf2ff',intensity:1.2},
  hemi:{sky:'#8a7eff',ground:'#2e1448',intensity:1.35},fog:{color:'#33206a',near:360,far:1400},windows:.55,windowColor:'#ffe14d',neon:.7,night:.8,trail:'#ff4f9e',particles:{color:'#5cf2ff',density:.3,kind:'sparks'}}),
 K(['#18184c','#303a98',...CORE_HORIZON],{key:{color:'#d08aff',intensity:1,dir:[.1,.9,.4]},rim:{color:'#5cf2ff',intensity:1.3},
  hemi:{sky:'#8a7aff',ground:'#2c1446',intensity:1.35},fog:{color:'#301e66',near:360,far:1400},windows:.65,windowColor:'#ffe14d',neon:.85,night:.85,trail:'#ff4f9e',particles:{color:'#5cf2ff',density:.35,kind:'sparks'}}),
 K(['#141444','#283a90',...CORE_HORIZON],{key:{color:'#ff8ad8',intensity:.95,dir:[0,.95,.3]},rim:{color:'#5cf2ff',intensity:1.4},
  hemi:{sky:'#8070ff',ground:'#2a1244',intensity:1.3},fog:{color:'#2c1c62',near:380,far:1450},windows:.75,windowColor:'#ffe14d',neon:1,night:.9,trail:'#ff4f9e',particles:{color:'#ff4f9e',density:.4,kind:'sparks'}}),
 K(['#1e2058','#363e9c',...CORE_HORIZON],{key:{color:'#e8a0ff',intensity:1.1,dir:[-.3,.8,.5]},rim:{color:'#5cf2ff',intensity:1.2},
  hemi:{sky:'#8c84ff',ground:'#34184c',intensity:1.4},fog:{color:'#3a2a70',near:400,far:1500},windows:.7,windowColor:'#ffe14d',neon:.85,night:.7,trail:'#ff4f9e',particles:{color:'#ffe14d',density:.3,kind:'sparks'}}),
 K(['#5a7ad8','#9ab8f0','#ffd0e0','#fff0b0'],{sun:S('#fffbe8','#ffc58a',.08,1),key:{color:'#ffe0b0',intensity:1.9,dir:[-.7,.4,.55]},rim:{color:'#ffb0d0',intensity:.9},
  hemi:{sky:'#d0e2ff',ground:'#8a74b0',intensity:1.7},fog:{color:'#e8c8e0',near:480,far:1850},windows:.15,windowColor:'#ffe8b0',neon:.15,night:0,trail:'#ffe14d',particles:{color:'#fff7d0',density:.3,kind:'motes'}})];
// Klíč i leží ve středu místa i; úsvit (16) ve středu „17. místa“ za cílem 4 876 m. Mimo krajní klíče se drží krajní nálada.
export const MOOD_KEYS=KEYS.map((m,i)=>Object.freeze({...m,x:(i+.5)*SCREEN_METERS,name:ROUTE[i]?.name??'Dawn',district:Math.min(3,Math.floor(i/SCREENS_PER_BIOME)),dawn:i===16}));
const isHex=v=>typeof v==='string'&&v[0]==='#';
// Prolnutí dvou nálad: barvy mix, čísla lerp, směr normalizovaný, kind podle bližšího klíče.
function blend(a,b,k){
 const go=(x,y,key)=>isHex(x)?mix(x,y,k):typeof x==='number'?lerp(x,y,k):Array.isArray(x)?(key==='dir'?norm(x.map((v,i)=>lerp(v,y[i],k))):x.map((v,i)=>go(v,y[i]))):
  x&&typeof x==='object'?Object.fromEntries(Object.keys(x).map(n=>[n,go(x[n],y[n],n)])):(k<.5?x:y);
 return go(a,b);
}
// Papírové město (?styl=papir): stejné pozice a tvar klíčů z paper-mood.js, navíc skyAt, haze, light, shadow (bible 05 kap. 2.3, 4).
export const PAPER_KEYS=PAPER_MOODS.map((m,i)=>Object.freeze({...m,x:MOOD_KEYS[i].x,name:MOOD_KEYS[i].name,district:MOOD_KEYS[i].district,dawn:i===16}));
const PICK=['sky','sun','sun2','moon','key','rim','hemi','fog','windows','windowColor','neon','night','trail','particles'],PAPER_PICK=[...PICK,'skyAt','haze','light','shadow'];
// style 'papir' → PAPER_KEYS (výsledek má navíc style:'papir'), cokoli jiného → MOOD_KEYS beze změny.
export function moodAt(distance,time=0,{hold=0,style}={}){
 const paper=style==='papir',K=paper?PAPER_KEYS:MOOD_KEYS,P=paper?PAPER_PICK:PICK;
 const x=Number.isFinite(distance)?Math.max(0,distance):0,p=Math.min(K.length-1,Math.max(0,x/SCREEN_METERS-.5)),i=Math.min(K.length-2,Math.floor(p));
 const a=K[i],b=K[i+1],k=smooth(p-i),m=blend(Object.fromEntries(P.map(n=>[n,a[n]])),Object.fromEntries(P.map(n=>[n,b[n]])),k);
 const mood={...m,rain:atmosphereAt(x,time).rain,x,place:p,district:k<.5?a.district:b.district,dawn:smooth((x-K[15].x)/SCREEN_METERS),hold:0,...(paper?{style:'papir'}:{})};
 return hold>0?breath(mood,hold):mood;
}
// „Zadržení dechu“ při události: pozadí (obloha, mlha, hemisféra, neony, hvězdy) o stupeň tlumenější a méně syté; vlaštovka, stopa a okna zůstávají.
const lum=c=>{const [r,g,b]=hex(c);return .299*r+.587*g+.114*b;};
const g2=v=>'#'+Math.round(v).toString(16).padStart(2,'0').repeat(3);
const dim=(c,k)=>mix(c,g2(lum(c)*.72),k*.45);
export function breath(mood,level=1){
 const k=Math.max(0,Math.min(1,level));if(!k)return mood;
 return {...mood,hold:k,sky:mood.sky.map(c=>dim(c,k)),fog:{...mood.fog,color:dim(mood.fog.color,k)},
  hemi:{sky:dim(mood.hemi.sky,k),ground:dim(mood.hemi.ground,k),intensity:mood.hemi.intensity*(1-.25*k)},
  key:{...mood.key,intensity:mood.key.intensity*(1-.15*k)},neon:mood.neon*(1-.3*k),night:mood.night*(1-.3*k),
  sun:{...mood.sun,alpha:mood.sun.alpha*(1-.3*k)},sun2:{...mood.sun2,alpha:mood.sun2.alpha*(1-.3*k)},moon:{...mood.moon,alpha:mood.moon.alpha*(1-.3*k)},
  ...(mood.haze?{haze:{...mood.haze,low:dim(mood.haze.low,k),high:dim(mood.haze.high,k)}}:{})};
}
