// Preview-only comic style "verse" (background-preview.html imports it; the game never does).
// Techniques only: ink outlines, flat hard shadows, Ben-Day halftone, posterized sky, 12 fps "on twos",
// print misregistration on the plane and comic speed lines. Pure helpers are exported for tests.
import {mix} from './themes.js';
import {tileOffset} from './scenes.js';
import {drift} from './motion.js';
const TAU=Math.PI*2;
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const cache=new Map(),memo=(key,fn)=>{if(!cache.has(key))cache.set(key,fn());return cache.get(key);};
// ── Pure helpers
export const INK='#15101f',TWOS=12,HALFTONE_TILE=6,PATTERN_SCALE=2;
// Hold each drawing for 1/fps s ("on twos" at 24 fps film = 12 drawings per second).
export const onTwos=(time,fps=TWOS)=>Math.floor(time*fps+1e-9)/fps;
// 45° Ben-Day grid in a square tile of side s: four corner dots and one centre dot,
// nearest neighbours s/√2 apart (≥ 4.2 logical px for s=6, safe against moiré when scrolling fast).
// Coverage k (0–1) sets the radius: 2πr²/s² = k, capped before dots touch.
export const dotRadius=(k,s=HALFTONE_TILE)=>Math.min(s/(2*Math.SQRT2)*.96,s*Math.sqrt(Math.max(0,k)/(2*Math.PI)));
export const dotSpacing=(s=HALFTONE_TILE)=>s/Math.SQRT2;
export function halftoneDots(k,s=HALFTONE_TILE){const r=dotRadius(k,s);return [[0,0],[s,0],[0,s],[s,s],[s/2,s/2]].map(([x,y])=>[x,y,r]);}
// Posterized sky: flat bands, each edge softened by `steps` halftone strips of the next colour (coverage rising).
export function skyBands(colors,edges,steps=3,zone=18){
 const out=[];
 colors.forEach((color,i)=>{const y0=edges[i],y1=edges[i+1];out.push({y:y0,h:y1-y0,color});
  if(i<colors.length-1)for(let j=0;j<steps;j++){const h=zone/steps;out.push({y:y1-zone+j*h,h,color,dot:colors[i+1],k:(j+1)/(steps+1)});}});
 return out;
}
// One hard shadow tone (no gradient): the body colour pushed towards ink.
export const shadeTone=color=>mix(color,INK,.42);
// Comic speed lines: none below `from` m/s, more and longer with speed; stable per drawing (frame) so they hold on twos.
export function speedLines(vx,frame=0,from=40){
 const k=Math.max(0,Math.min(1,(vx-from)/110));if(!k)return [];
 const n=Math.round(6+k*18),seed=Math.floor(frame*TWOS);
 return Array.from({length:n},(_,i)=>{const r=noise(seed*31+i*7.3);return [noise(seed*13+i)*700-30,12+noise(i*17.1+seed*.37)*336,(50+r*110)*(.5+k)];});
}
// Palette per district: posterized sky top → horizon, building palettes [lit, body, accent], far city, ground.
export const VERSE=[
 {sky:['#2ea8b8','#7fd9c4','#fff0a0','#ffb08a'],biome:['#ff7a59','#c23d5a','#fff36b'],far:'#5aa0b4',ground:'#2d2440',sun:'#fff7cf'},
 {sky:['#1d47a0','#3a88dc','#9ad4ff','#eef6ff'],biome:['#4ec3c7','#215a8c','#ffe14d'],far:'#6d9bd2',ground:'#0f2b4c',sun:'#ffffff'},
 {sky:['#f2782a','#ffaa45','#ffdc85','#fff3d2'],biome:['#9a63db','#4a2f8a','#ffd23f'],far:'#c47ad6',ground:'#3b1f4f',sun:'#fffbe8'},
 {sky:['#0f1336','#283a8f','#2aa99c','#d2ee48'],biome:['#ff4f9e','#3a1f5c','#5cf2ff'],far:'#3a4c9c',ground:'#0b0a20',sun:'#f4ffd8'}];
export const SKY_EDGES=[0,92,168,232,360];
// ── Canvas helpers (browser only)
function tile(color,k){return memo('t'+color+k,()=>{const s=HALFTONE_TILE*PATTERN_SCALE,g=document.createElement('canvas');g.width=g.height=s;const x=g.getContext('2d');x.fillStyle=color;
 for(const [dx,dy,r] of halftoneDots(k)){x.beginPath();x.arc(dx*PATTERN_SCALE,dy*PATTERN_SCALE,r*PATTERN_SCALE,0,TAU);x.fill();}return g;});}
// Pattern drawn at 2× and scaled back once, so dots stay crisp on the 1280 px canvas. The pattern origin follows the
// current transform, so dots stay anchored to the object (route chunk, sprite) instead of the screen.
function halftone(c,color,k){return memo('p'+color+k,()=>{const p=c.createPattern(tile(color,k),'repeat');p.setTransform?.(new DOMMatrix([1/PATTERN_SCALE,0,0,1/PATTERN_SCALE,0,0]));return p;});}
const lw=c=>verse.lineWidth/(c.getTransform?.().a||1);
function cloud(c,x,y,s){c.beginPath();c.arc(x,y,16*s,0,TAU);c.arc(x+20*s,y-9*s,20*s,0,TAU);c.arc(x+44*s,y-2*s,15*s,0,TAU);c.rect(x,y,44*s,15*s);}
const CLOUDS=[[70,80,1],[330,128,.7],[560,62,1.25],[800,105,.85]];
// Static layers are rendered once into 2× sprites (memoized like paper's grain) and only blitted per frame:
// halftone fills under a clip are the expensive part, so they never run in the frame loop.
function sprite(key,w,h,draw){return memo('s'+key,()=>{const g=document.createElement('canvas');g.width=Math.ceil(w*PATTERN_SCALE);g.height=Math.ceil(h*PATTERN_SCALE);const x=g.getContext('2d');x.scale(PATTERN_SCALE,PATTERN_SCALE);draw(x);return g;});}
const ridgeY=(x,base,amp,seed)=>{const k=x/960*TAU;return base-amp*(.55*Math.sin(k*2+seed)+.3*Math.sin(k*5+seed*2)+.15*Math.sin(k*11+seed*3));};
// Periodic 960 px ridge tile; only the top edge is inked so tile seams stay invisible.
function ridge(c,color,camera,speed,base,amp,seed){
 const top=base-amp-4,g=sprite(`r${color}${seed}`,960,360-top,x=>{x.translate(0,-top);x.beginPath();x.moveTo(0,360);for(let i=0;i<=960;i+=12)x.lineTo(i,ridgeY(i,base,amp,seed));x.lineTo(960,360);x.closePath();
  x.fillStyle=color;x.fill();x.save();x.clip();x.fillStyle=halftone(x,INK,.18);x.fillRect(0,top,960,360);x.restore();
  x.beginPath();for(let i=0;i<=960;i+=12)i?x.lineTo(i,ridgeY(i,base,amp,seed)):x.moveTo(i,ridgeY(i,base,amp,seed));x.strokeStyle=INK;x.lineWidth=lw(x);x.stroke();});
 for(let x0=tileOffset(camera,speed);x0<640;x0+=960)c.drawImage(g,x0,top,960,360-top);
}
// Posterized bands with halftone strips; 1 tile wider than the screen so it can slide by the dot period.
const skySprite=v=>sprite('sky'+v.sky.join(),640+HALFTONE_TILE,360,x=>{for(const b of skyBands(v.sky,SKY_EDGES)){x.fillStyle=b.dot?halftone(x,b.dot,b.k):b.color;x.fillRect(0,b.y,640+HALFTONE_TILE,b.h);}});
// Flat sun/moon with an ink ring and a halftone shadow crescent.
const sunSprite=v=>sprite('sun'+v.sun+v.sky[2],80,80,x=>{x.beginPath();x.arc(40,40,34,0,TAU);x.fillStyle=v.sun;x.fill();x.save();x.clip();x.beginPath();x.arc(54,48,34,0,TAU);x.fillStyle=halftone(x,v.sky[2],.45);x.fill();x.restore();
 x.beginPath();x.arc(40,40,34,0,TAU);x.strokeStyle=INK;x.lineWidth=lw(x);x.stroke();});
// Double-width stroke under the fill leaves only the outer silhouette inked (no inner circle seams).
const cloudSprite=(v,s)=>sprite('cl'+v.sky[1]+s,80*s+8,50*s+8,x=>{const ox=16*s+4,oy=29*s+4;cloud(x,ox,oy,s);x.strokeStyle=INK;x.lineWidth=lw(x)*2;x.stroke();x.fillStyle='#ffffff';x.fill();
 x.save();x.clip();x.fillStyle=halftone(x,v.sky[1],.4);x.fillRect(0,oy+2*s,80*s+8,30*s);x.restore();});
export const verse={
 id:'verse',name:'Comic ink (prototype)',pixel:false,mode:'ink',line:INK,lineWidth:2.6,base:VERSE[0].sky[0],
 biomes:VERSE.map(v=>v.biome),far:VERSE.map(v=>v.far),ground:VERSE.map(v=>v.ground),dash:'#ffffff55',lights:.45,
 plane:{fill:'#ffffff',outline:INK,crease:['#ff3b6b','#1ec8ff']},trail:['#ffffff','#ffe14d'],
 // Cyan and magenta plates, ~2 screen px off register (logical px at the 2× canvas).
 misregister:[[-1,.5,'#00c2ff'],[1,-.5,'#ff2fa0']],
 shop:{wall:'#c23d5a',roof:'#15101f',sign:'#fff36b',text:INK,window:'#2d2440',light:'#fff36b',door:'#2d2440'},kid:['#f1c9a5','#1ec8ff','#ff3b6b','#2d2440'],
 tint:color=>color,fx:{smoke:'#ffffff',water:'#ffffff',beacon:'#ff3b6b',bird:INK,rain:'#d8f4ff',star:'#ffffff'},night:[0,0,0,1],
 frame:t=>onTwos(t),
 sky(c,index,camera,time=0){
  const v=VERSE[index];c.drawImage(skySprite(v),tileOffset(camera,.035,HALFTONE_TILE),0,640+HALFTONE_TILE,360);c.drawImage(sunSprite(v),460,42,80,80);
  for(let x0=tileOffset(camera-drift(time)*9/.06,.06);x0<640;x0+=960)for(const [x,y,s] of CLOUDS){const cx=x0+x;if(cx>-120&&cx<700)c.drawImage(cloudSprite(v,s),cx-16*s-4,y-29*s-4,80*s+8,50*s+8);}
  ridge(c,mix(v.sky[3],v.far,.55),camera,.11,262,34,index);
 },
 // Shadow side of a building: one hard tone plus ink halftone, anchored to the building.
 shade(c,x,y,w,h,p){const sw=Math.round(w*.3);c.fillStyle=shadeTone(p[1]);c.fillRect(x,y,sw,h);c.fillStyle=halftone(c,INK,.3);c.fillRect(x,y,sw,h);
  c.strokeStyle=INK;c.lineWidth=lw(c);c.strokeRect(x,y,w,h);c.beginPath();c.moveTo(x+sw,y);c.lineTo(x+sw,y+h);c.stroke();},
 // Speed lines on top of the scene (not with reduced motion); they hold for a drawing like the rest.
 overlay(c,{f,env=0,reduced}={}){if(reduced||!f||f.landed)return;const lines=speedLines(f.vx??0,env);if(!lines.length)return;
  c.save();c.strokeStyle='#ffffff';c.lineCap='round';c.globalAlpha=.75;
  for(const [x,y,len] of lines){c.lineWidth=1+((x*7)%2);c.beginPath();c.moveTo(x,y);c.lineTo(x-len,y);c.stroke();}
  c.strokeStyle=INK;c.globalAlpha=.5;c.lineWidth=1;c.beginPath();for(const [x,y,len] of lines.slice(0,lines.length>>1)){c.moveTo(x+12,y+3);c.lineTo(x+12-len*.6,y+3);}c.stroke();c.restore();}
};
