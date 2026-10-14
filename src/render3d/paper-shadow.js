// Stíny Papírového města „na zem“ (čisté, bez three.js). Zdroj: research/design/08-stiny.md kap. 5–6 (S1), prototyp prototype/styly/stiny.js (VY, LIGHT, projMat).
// Rozhodnutí 14. 10. (06-rozhodnuti.md „Stíny, přechody a modely“): stíny na zem, ráno jemné, ve Zlatých polích výraznější a delší; siluety ze skyline zrušeny.
// Každá karta (i vlaštovka) se promítne podél světla na zem (y = 0) do malé masky, maska se rozmaže a zem ji čte na stejném místě obrazovky.
// Síla klesá s výškou bodu (u paty ostře a tmavě), vlaštovka slábne s výškou letu. Karty stín nedostávají, jen pata karty se jemně ztmaví (AO).
import {smooth} from '../scenes.js';

// tint = studený odstín (sRGB 0–255), kterým stín násobí papír (S-5); k = síla násobení; blur = krok rozmazání v texelech masky;
// fade.card [od, do (m výšky vrhače), útlum nahoře] (S-4), fade.plane = výška (m), na které stín vlaštovky klesne na 1/e (S-6);
// ao.h výška ztmavení paty podle vrstvy (m), ao.k síla (S-4).
export const SHADOW_LOOK=Object.freeze({tint:Object.freeze([93,100,168]),k:.62,blur:1,
 fade:Object.freeze({card:Object.freeze([0,45,.45]),plane:70}),ao:Object.freeze({h:Object.freeze({near:1.4,mid:2.8,far:6}),k:.2})});
// Síla stínu podle čtvrti (klíče nálady 0–15 po čtyřech, 16 úsvit): ráno a poledne jemné (a), Zlatá pole výraznější (b, 0,8), večer slabé (S-8, 0,3).
export const SHADOW_STRENGTH=Object.freeze([.62,.62,.8,.3,.62]);
// Výška slunce: elevace světla se škáluje podle výšky slunce v obraze proti ranní náladě (sun.y 0,2); nízké slunce = delší stíny. Spodní mez elevace.
export const SUN_REF_Y=.2,MIN_ELEVATION=.15;
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(c=>c/l);};
const strengthAt=place=>{const p=Math.max(0,Math.min(16,place??0)),i=Math.min(15,Math.floor(p)),d=j=>SHADOW_STRENGTH[Math.min(4,Math.floor(j/4))],a=d(i),b=d(i+1);return a===b?a:a+(b-a)*smooth(p-i);};
// Směr ke světlu [x,y,z] (jednotkový) a síla stínu z plan.mood (moodAt s style 'papir'). Slunce na obloze je vždy ZA městem → z < 0 (S-1),
// strana podle polohy slunce v obraze (vpravo = +x), elevace podle mood.light škálovaná výškou slunce. Bez slunce (večer) směr z mood.light, z < 0.
export function shadowLight(mood={}){
 const l=mood.light??[.62,.5,.6],s=mood.sun,on=s&&s.alpha>0&&Number.isFinite(s.x)&&Number.isFinite(s.y);
 const x=on&&s.x!==.5?Math.sign(s.x-.5)*Math.abs(l[0]):l[0],y=on?Math.max(MIN_ELEVATION,l[1]*(1-s.y)/(1-SUN_REF_Y)):l[1];
 return {dir:norm([x,y,-Math.abs(l[2])]),k:strengthAt(mood.place)};
}
// Referenční projekce bodu na zem podél světla L (jako vertex shader masky): p' = p − L·(p.y / L.y), y = 0.
export function projectToGround(p,L){const h=Math.max(0,p[1]),t=h/L[1];return [p[0]-L[0]*t,0,p[2]-L[2]*t];}
// Síla stínu bodu karty ve výšce h (m) a vlaštovky ve výšce h (jako shader).
const sstep=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export const cardFade=(h,[a,b,z]=SHADOW_LOOK.fade.card)=>1-z*sstep(a,b,Math.max(0,h));
export const planeFade=(h,f=SHADOW_LOOK.fade.plane)=>Math.exp(-Math.max(0,h)/f);
// Ztmavení paty karty podle vrstvy ve výšce y (násobitel barvy 1 − k … 1).
export const aoAt=(layer,y,{h,k}=SHADOW_LOOK.ao)=>h[layer]?1-k*(1-sstep(0,h[layer],y)):1;
