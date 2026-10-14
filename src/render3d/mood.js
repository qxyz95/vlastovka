// Nálada (čisté): 16 klíčových snímků Papírového města (paper-mood.js, střed každého místa ROUTE) + úsvit za cílem (research/svet/01-zivy-svet.md §2).
// moodAt(x,t,{hold}) → plan.mood. Mezi středy míst smooth(), takže hranice čtvrtí nejsou skok; déšť je přímo atmosphereAt(x,t).rain. Vlastní R4.
// Tvar (barvy '#rrggbb', délky v m): sky [4 barvy shora k obzoru] · skyAt · sun/sun2 {color,halo,height,alpha,x,y,r} · moon {color,height,alpha}
//  key {color,intensity,dir} · rim · hemi {sky,ground,intensity} · fog {color,near,far} · haze · light · shadow · windows · windowColor · neon · night
//  rain 0–1 · trail · particles {color,density 0–1,kind} · x, place (index místa, desetinně), district, dawn, hold 0–1
import {ROUTE,SCREEN_METERS,SCREENS_PER_BIOME,atmosphereAt,smooth} from '../scenes.js';
import {PAPER_MOODS} from './paper-mood.js';
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const mix=(a,b,k)=>{const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
const lerp=(a,b,k)=>a+(b-a)*k,norm=v=>{const l=Math.hypot(...v)||1;return v.map(c=>c/l);};
export const ROUTE_END=ROUTE.length*SCREEN_METERS;// 4 876 m
const isHex=v=>typeof v==='string'&&v[0]==='#';
// Prolnutí dvou nálad: barvy mix, čísla lerp, směr normalizovaný, kind podle bližšího klíče.
function blend(a,b,k){
 const go=(x,y,key)=>isHex(x)?mix(x,y,k):typeof x==='number'?lerp(x,y,k):Array.isArray(x)?(key==='dir'?norm(x.map((v,i)=>lerp(v,y[i],k))):x.map((v,i)=>go(v,y[i]))):
  x&&typeof x==='object'?Object.fromEntries(Object.keys(x).map(n=>[n,go(x[n],y[n],n)])):(k<.5?x:y);
 return go(a,b);
}
// Klíč i leží ve středu místa i; úsvit (16) ve středu „17. místa“ za cílem 4 876 m. Mimo krajní klíče se drží krajní nálada.
export const PAPER_KEYS=PAPER_MOODS.map((m,i)=>Object.freeze({...m,x:(i+.5)*SCREEN_METERS,name:ROUTE[i]?.name??'Dawn',district:Math.min(3,Math.floor(i/SCREENS_PER_BIOME)),dawn:i===16}));
const P=['sky','sun','sun2','moon','key','rim','hemi','fog','windows','windowColor','neon','night','trail','particles','skyAt','haze','light','shadow'];
export function moodAt(distance,time=0,{hold=0}={}){
 const K=PAPER_KEYS;
 const x=Number.isFinite(distance)?Math.max(0,distance):0,p=Math.min(K.length-1,Math.max(0,x/SCREEN_METERS-.5)),i=Math.min(K.length-2,Math.floor(p));
 const a=K[i],b=K[i+1],k=smooth(p-i),m=blend(Object.fromEntries(P.map(n=>[n,a[n]])),Object.fromEntries(P.map(n=>[n,b[n]])),k);
 const mood={...m,rain:atmosphereAt(x,time).rain,x,place:p,district:k<.5?a.district:b.district,dawn:smooth((x-K[15].x)/SCREEN_METERS),hold:0};
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
