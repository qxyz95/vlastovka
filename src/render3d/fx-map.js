// Převod stavu juice.js na pohled 3D/UI (čisté). Vlastní R2. Smlouva view(f) je v ./index.js: částice sx = px + (wx − cam − px)·k, sy = py + (y − py)·k.
// settings (src/settings.js, fáze d2): {shake, flash, speedLines} = true/false nebo síla 0–1; chybí = zapnuto. Reduced motion → nulový otřes, záblesk, rychlostní čáry a pohyb popupů.
import {FX,STRIDE,shake} from '../juice.js';
import {ease,clamp01} from '../motion.js';
import {onTwos} from './life.js';
export const MAX_ROLL=3*Math.PI/180,FLASH_PEAK=.18,SPEED_FROM=40,SPEED_SPAN=110;
const amount=v=>v===undefined?1:+v||0,noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
// Otřes jako pohyb kamery: x,y v logických px (pro 2D vrstvu), dx,dy v m (posun 3D kamery, y nahoru), roll = náklon v rad (≤ 3°).
export function shakeCamera(fx,clock=0,reduced=false,metersPerPx=1/2.1,settings={}){
 const s=reduced||!fx?0:amount(settings.shake);if(!s)return {x:0,y:0,roll:0,dx:0,dy:0};
 const {x,y,a}=shake(fx,clock),roll=Math.max(-MAX_ROLL,Math.min(MAX_ROLL,a*s));
 return {x:x*s,y:y*s,roll,dx:x*s*metersPerPx,dy:-y*s*metersPerPx};
}
// Průhlednost bílého záblesku po perfektu (1 záblesk na událost, ≤ 1 Hz).
export const flashAlpha=(fx,reduced=false,settings={})=>reduced||!fx||fx.flash<=0?0:clamp01(fx.flash/.12)*FLASH_PEAK*clamp01(amount(settings.flash));
// Počet komiksových rychlostních čar (themes-verse.js speedLines): pod 40 m/s žádné, pak 6–24. settings.reduced nebo speedLines:false → 0.
export function speedLineCount(vx,settings={}){
 if(settings.reduced||!amount(settings.speedLines))return 0;const k=clamp01(((vx??0)-SPEED_FROM)/SPEED_SPAN);return k?Math.round(6+k*18):0;
}
// Čáry [x,y,délka] v logických px, stabilní pro jednu kresbu (frame = čas „on twos“), jako themes-verse.js.
export function speedLines(vx,frame=0,settings={}){
 const n=speedLineCount(vx,settings);if(!n)return [];const k=clamp01((vx-SPEED_FROM)/SPEED_SPAN),seed=Math.floor(frame*12);
 return Array.from({length:n},(_,i)=>{const r=noise(seed*31+i*7.3);return [noise(seed*13+i)*700-30,12+noise(i*17.1+seed*.37)*336,(50+r*110)*(.5+k)];});
}
// Světové px (juice.js) → logické px obrazovky podle view {cam,px,py,k}.
export function particleScreen(view,wx,y){const k=view.k??1;return [view.px+(wx-view.cam-view.px)*k,view.py+(y-view.py)*k];}
export const toScreen=(wx,wy,view)=>particleScreen(view,wx,wy);
// Živé částice v obrazovkových px: {kind,x,y,size,alpha}; tvar a průhlednost jako fx-render.js, velikost × min(1,k)
// (přiblížený záběr Follow, k ≈ 2,5, by z jisker udělal velké čtverce přes vlaštovku; oddálení je zmenší).
export function particles(fx,view){
 const out=[],k=view.k??1;if(!fx?.parts)return out;
 for(let o=0;o<fx.parts.length;o+=STRIDE){
  const age=fx.parts[o+4],life=fx.parts[o+5];if(age>=life)continue;
  const kind=fx.parts[o+7],s=fx.parts[o+6],left=1-age/life,[x,y]=particleScreen(view,fx.parts[o],fx.parts[o+1]);
  out.push({kind,x,y,size:(kind===3?s:kind===0?s*(1+age*1.5):s*left+1)*Math.min(1,k),alpha:kind===0?left*.8:left});
 }
 return out;
}
// Popupy pro kreslení: náběh outBack, stoupání outCubic, doznění; reduced motion = bez škálování a stoupání.
export const popups=(fx,reduced=false)=>(fx?.popups??[]).map((p,i)=>{const k=p.age/FX.popupLife;
 return {text:p.text,style:p.style,i,alpha:clamp01((1-k)/.3),scale:reduced?1:ease.outBack(clamp01(p.age/.25)),rise:reduced?0:ease.outCubic(k)*26};});
// Celý plan.fx: opts {reduced, clock, settings, metersPerPx, vx, frame (čas scény), flying}.
export function fxMap(fx,view,opts={}){
 const {reduced=false,clock=0,settings={},metersPerPx=1/2.1,vx=0,frame=0,flying=false}=opts;
 return {shake:shakeCamera(fx,clock,reduced,metersPerPx,settings),flash:flashAlpha(fx,reduced,settings),
  speedLines:flying&&!reduced?speedLines(vx,onTwos(frame),settings):[],particles:particles(fx,view),popups:popups(fx,reduced),
  trail:(fx?.trail??[]).map(([wx,y])=>particleScreen(view,wx,y))};
}
