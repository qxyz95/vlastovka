// Kamera jako režisér (čisté funkce bez three.js): nadpis místa a krátké přiblížení na hranici místa, oddálení při rychlém letu.
// Mění jen šířku záběru; vlaštovka zůstává na stejném místě obrazu (follow → px), takže sledování nerozbije. Vlastní R5 (doplní stavy Follow/Vista/Place intro/District/Landing, zámek při QTE, Calm). Testy: tests/render3d-life.test.js.
import {SCREEN_METERS,ROUTE} from '../scenes.js';
import {damp} from '../motion.js';
import {PLACE_EN,DISTRICT_EN,smooth} from './life.js';
export const TITLE={fadeIn:.3,hold:1.9,fadeOut:.6},PUNCH={dur:1.6,depth:.13},SPEED={from:24,span:90,out:.45},ZOOM_RANGE=[.8,1.5];
export const titleAlpha=age=>age==null||age<0?0:age<TITLE.fadeIn?smooth(age/TITLE.fadeIn):age<TITLE.fadeIn+TITLE.hold?1:1-smooth((age-TITLE.fadeIn-TITLE.hold)/TITLE.fadeOut);
// Přiblížení na hranici: šířka záběru × (1 − depth·sin), hladký nástup i návrat.
export const punchZoom=age=>age==null||age<0||age>=PUNCH.dur?1:1-PUNCH.depth*Math.sin(Math.PI*smooth(age/PUNCH.dur));
// Oddálení podle zobrazené rychlosti (m/s): do 24 m/s nic, pak plynule až o 45 %.
export const speedZoom=v=>1+SPEED.out*smooth((v-SPEED.from)/SPEED.span);
export const placeAt=x=>Math.floor(Math.max(0,x)/SCREEN_METERS);
export function placeTitle(place){const i=place%ROUTE.length,d=Math.floor(i/4);return {title:PLACE_EN[i],sub:`${DISTRICT_EN[d]} · ${i%4+1}/4`,district:d,first:i%4===0};}
export function createDirector(){return {place:-1,at:null,zoom:1,title:null};}
// Jeden krok: x a v jsou zobrazené (s tempem), t hodiny scény, dt krok. Vrací stejný objekt (mutuje jako spring v motion.js).
export function direct(s,{x,v,t,dt,flying}){
 const place=placeAt(x);if(flying&&place!==s.place){s.place=place;s.at=t;s.title=placeTitle(place);}
 const age=s.at==null?null:t-s.at,goal=Math.max(ZOOM_RANGE[0],Math.min(ZOOM_RANGE[1],punchZoom(age)*speedZoom(flying?v:0)));
 s.zoom=damp(s.zoom,goal,.25,dt);s.alpha=titleAlpha(age);return s;
}
