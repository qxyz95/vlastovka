// Visual themes. Route geometry and parallax speeds stay shared; a theme only swaps
// the sky, palettes and the way shapes are painted (fill, paper cut-out, line drawing).
import {tileOffset} from './scenes.js';
import {drift} from './motion.js';
const TAU=Math.PI*2;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export function mix(a,b,k){const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');}
const cache=new Map(),memo=(key,fn)=>{if(!cache.has(key))cache.set(key,fn());return cache.get(key);};
const noise=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
const gradient=(c,stops,y0=0,y1=360)=>{const g=c.createLinearGradient(0,y0,0,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g;};
// Periodic ridge (repeats every 960 px) so it can tile like the sky images.
function ridge(c,color,camera,speed,base,amp,seed){
 c.fillStyle=color;
 for(let x0=tileOffset(camera,speed);x0<640;x0+=960){
  c.beginPath();c.moveTo(x0,360);
  for(let x=0;x<=960;x+=12){const k=x/960*TAU;c.lineTo(x0+x,base-amp*(.55*Math.sin(k*2+seed)+.3*Math.sin(k*5+seed*2)+.15*Math.sin(k*11+seed*3)));}
  c.lineTo(x0+960,360);c.fill();
 }
}
function cloud(c,x,y,s){c.beginPath();c.arc(x,y,16*s,0,TAU);c.arc(x+20*s,y-9*s,20*s,0,TAU);c.arc(x+44*s,y-2*s,15*s,0,TAU);c.rect(x,y,44*s,15*s);}
const CLOUDS=[[70,80,1],[330,128,.7],[560,62,1.25],[800,105,.85]];
// Clouds drift with the shared wind on top of the camera parallax.
function clouds(c,camera,speed,each,time=0){for(let x0=tileOffset(camera-drift(time)*9/speed,speed);x0<640;x0+=960)for(const [x,y,s] of CLOUDS){if(x0+x>-120&&x0+x<700)each(x0+x,y,s);}}

// ── Papírová koláž: denní krajina z vystřihaného papíru, stíny a zrno.
const PAPER_SKY=[['#f2d4bd','#f8ead6'],['#bcd8d8','#eef0e0'],['#f0b48c','#f8e0bd'],['#cdb9dd','#f3e2d0']];
function grain(){return memo('grain',()=>{const g=document.createElement('canvas');g.width=g.height=96;const x=g.getContext('2d');
 for(let i=0;i<1600;i++){x.fillStyle=noise(i)>.5?'#ffffff':'#5a3d22';x.globalAlpha=.05+noise(i*3)*.08;x.fillRect(noise(i*7)*96,noise(i*13)*96,1+noise(i*5)*1.5,1);}return g;});}
const paper={
 id:'paper',name:'Papírová koláž',pixel:false,mode:'paper',base:'#f3e6cf',
 biomes:[['#9a5a45','#d98b63','#fbe7b0'],['#5f8a94','#3f6474','#f2d48b'],['#7d9a5c','#a8805a','#f6e7b4'],['#8a6e9e','#5b4a73','#ffd98a']],
 far:['#e1b99c','#a9c7c8','#c4cf9e','#c3b2cf'],ground:['#c9a27b','#86b6bd','#9cb06f','#a993ab'],dash:'#f6ead2',lights:.35,
 plane:{fill:'#fffdf6',outline:'#6b4a2c',crease:['#d0503c','#3d7fa6']},trail:['#c9a27b','#e7c9a0'],
 shop:{wall:'#c86e52',roof:'#7a3f2e',sign:'#fbe7b0',text:'#5a2f1f',window:'#6b4a3a',light:'#ffe39a',door:'#5a3f30'},kid:['#f1c9a5','#3d7fa6','#d0503c','#4b5a7a'],
 tint:color=>mix(color,'#e8d8bd',.45),fx:{smoke:'#fffaf0',water:'#f4fbfb',beacon:'#d0503c',bird:'#5a3f30',rain:'#5f8fa8',star:'#ffffff'},night:[0,0,0,0],
 sky(c,index,camera,time=0){
  const [top,bottom]=PAPER_SKY[index];c.fillStyle=gradient(c,[top,bottom],0,300);c.fillRect(0,0,640,360);
  shadowed(c,()=>{c.fillStyle='#f7c06e';c.beginPath();for(let i=0;i<12;i++){const a=time*.15+i*TAU/12;c.moveTo(500+Math.cos(a-.12)*36,82+Math.sin(a-.12)*36);c.lineTo(500+Math.cos(a)*(50+Math.sin(time*1.5+i)*3),82+Math.sin(a)*(50+Math.sin(time*1.5+i)*3));c.lineTo(500+Math.cos(a+.12)*36,82+Math.sin(a+.12)*36);}c.fill();
   c.fillStyle='#f4a259';c.beginPath();c.arc(500,82,34,0,TAU);c.fill();});
  shadowed(c,()=>{c.fillStyle='#fffaf0';clouds(c,camera,.06,(x,y,s)=>{cloud(c,x,y+Math.sin(time*.7+x*.01)*2,s);c.fill();},time);});
  shadowed(c,()=>ridge(c,mix(bottom,'#8c7a63',.28),camera,.11,262,34,index));
 },
 overlay(c){c.fillStyle=memo('grain-pattern',()=>c.createPattern(grain(),'repeat'));c.fillRect(0,0,640,360);}
};
function shadowed(c,draw,blur=4){c.save();c.shadowColor='#4a321c50';c.shadowOffsetX=2;c.shadowOffsetY=3;c.shadowBlur=blur;draw();c.restore();}

// ── Technický výkres: modrák, mřížka, vše jen obrysy a kóty.
const BLUEPRINT=['#1d4b86','#183f72','#22507e','#1b3a74'];
const blueprint={
 id:'blueprint',name:'Technický výkres',pixel:false,mode:'line',base:'#1d4b86',
 biomes:Array(4).fill(['#7f93ad','#cfdcec','#ffffff']),ground:BLUEPRINT,dash:'#cfdcec',lights:.55,
 plane:{fill:'#1d4b86',outline:'#ffffff',crease:['#9fe6ff','#ffd27a']},trail:['#cfe6ff','#9fe6ff'],
 shop:{wall:'#9fb2c8',roof:'#ffffff',sign:'#ffffff',text:'#ffffff',window:'#cfdcec',light:'#ffffff',door:'#9fb2c8'},kid:['#ffffff','#9fe6ff','#ffffff','#cfdcec'],
 tint:color=>color,fx:{smoke:'#ffffff',water:'#ffffff',beacon:'#ffffff',bird:'#ffffff',rain:'#ffffff',star:'#ffffff'},night:[0,0,0,0],
 ink(color){return memo('ink'+color,()=>{const [r,g,b]=hex(color.slice(0,7)),l=(.3*r+.59*g+.11*b)/255;return `rgba(234,243,255,${(.38+.62*l).toFixed(2)})`;});},
 sky(c,index,camera,time=0){
  c.fillStyle=BLUEPRINT[index];c.fillRect(0,0,640,360);
  c.save();c.lineWidth=1;
  for(const [step,alpha] of [[16,.07],[80,.15]]){c.strokeStyle=`rgba(255,255,255,${alpha})`;c.beginPath();
   for(let x=tileOffset(camera,.5,step);x<640;x+=step){c.moveTo(x+.5,0);c.lineTo(x+.5,360);}
   for(let y=0;y<360;y+=step){c.moveTo(0,y+.5);c.lineTo(640,y+.5);}c.stroke();}
  c.strokeStyle='rgba(234,243,255,.6)';c.setLineDash([5,4]);c.lineDashOffset=-time*6;
  clouds(c,camera,.06,(x,y,s)=>{cloud(c,x,y,s);c.stroke();},time);
  c.setLineDash([]);c.beginPath();c.arc(500,86,30,0,TAU);const a=time*.2;for(const k of [0,Math.PI/2])c.moveTo(500+Math.cos(a+k)*44,86+Math.sin(a+k)*44),c.lineTo(500-Math.cos(a+k)*44,86-Math.sin(a+k)*44);c.stroke();
  c.setLineDash([2,4]);c.lineDashOffset=time*4;c.beginPath();c.arc(500,86,44,0,TAU);c.stroke();c.setLineDash([]);
  c.fillStyle='rgba(234,243,255,.75)';c.font='10px monospace';c.fillText('R 30',536,62);
  c.strokeStyle='rgba(234,243,255,.35)';ridgeLine(c,camera,.11,262,30,index);
  c.restore();
 },
 overlay(c){c.save();c.strokeStyle='rgba(234,243,255,.8)';c.lineWidth=1;c.strokeRect(476.5,322.5,152,28);c.beginPath();c.moveTo(476,336.5);c.lineTo(628,336.5);c.moveTo(560.5,322);c.lineTo(560.5,336);c.stroke();
  c.fillStyle='rgba(234,243,255,.85)';c.font='9px monospace';c.fillText('PAPER PLANE',482,333);c.fillText('M 1:200',566,333);c.fillText('JUST THROW IT · SHEET 01',482,347);c.restore();}
};
function ridgeLine(c,camera,speed,base,amp,seed){for(let x0=tileOffset(camera,speed);x0<640;x0+=960){c.beginPath();for(let x=0;x<=960;x+=12){const k=x/960*TAU,y=base-amp*(.55*Math.sin(k*2+seed)+.3*Math.sin(k*5+seed*2)+.15*Math.sin(k*11+seed*3));x?c.lineTo(x0+x,y):c.moveTo(x0+x,y);}c.stroke();}}

// ── Soumrak: plochý minimalismus, barevné přechody a vrstvené hřebeny.
const DUSK=[
 {sky:['#2b2d5c','#c0587a','#f6a96b'],sun:'#ffe0a3',ridges:['#b06478','#7d3f62']},
 {sky:['#123a55','#3f8a9a','#f0c28c'],sun:'#fff1c9',ridges:['#5f8f96','#3b6b7a']},
 {sky:['#4a2340','#d0643f','#f7c26b'],sun:'#fff0b0',ridges:['#c0674a','#8f3e3c']},
 {sky:['#140f2e','#4b2a63','#b8578a'],sun:'#ffb9d6',ridges:['#6a3a74','#45285c'],stars:true}];
const dusk={
 id:'dusk',name:'Soumrak',pixel:false,mode:'fill',base:'#2b2d5c',
 biomes:[['#6a3558','#3d1f3f','#ffd59a'],['#2c5566','#163245','#ffe2a8'],['#7a3434','#40192a','#ffd27a'],['#3a2352','#1d1233','#ff9ec7']],
 far:['#8f4c6c','#3f6f80','#9a4a3c','#583a78'],ground:['#2a1530','#0f2738','#2c1020','#120a22'],dash:'#ffffff22',lights:.75,
 plane:{fill:'#fff8ef',outline:'#2b1a2e',crease:['#e86a5a','#5aa9c9']},trail:['#ffe0c0','#ffc0a0'],
 shop:{wall:'#3d1f3f',roof:'#6a3558',sign:'#ffd59a',text:'#3d1f3f',window:'#2a1530',light:'#ffd59a',door:'#2a1530'},kid:['#2b1a2e','#ffd59a','#2b1a2e','#2b1a2e'],
 tint:color=>mix(color,'#3a2242',.35),fx:{smoke:'#c9a9b8',water:'#ffe2a8',beacon:'#ff6b6b',bird:'#2b1a2e',rain:'#ffe2c0',star:'#fff0ff',glow:true},night:[0,0,0,1],
 sky(c,index,camera,time=0){
  const d=DUSK[index];c.fillStyle=gradient(c,d.sky,0,300);c.fillRect(0,0,640,360);
  if(d.stars)for(let i=0;i<60;i++){const x=((noise(i)*960+tileOffset(camera,.02))%960+960)%960;if(x<640){c.fillStyle=`rgba(255,240,255,${(.3+noise(i*9)*.6)*(.55+.45*Math.sin(time*(1+noise(i*4)*2)+i))})`;c.fillRect(x,noise(i*3)*170,1.5,1.5);}}
  const sx=430-((camera*.01)%120),glow=c.createRadialGradient(sx,215,10,sx,215,150+Math.sin(time*.8)*12);glow.addColorStop(0,d.sun+'aa');glow.addColorStop(1,d.sun+'00');
  c.fillStyle=glow;c.fillRect(0,0,640,360);c.fillStyle=d.sun;c.beginPath();c.arc(sx,215,44,0,TAU);c.fill();
  ridge(c,d.ridges[0],camera,.05,250,48,index+1);ridge(c,d.ridges[1],camera,.12,275,36,index+4);
 }
};

const cyber={
 id:'cyber',name:'Kyberpunk pixel',pixel:true,mode:'fill',base:'#120e30',
 biomes:[['#322749','#131b31','#ea70c8'],['#294559','#10263a','#78d8ee'],['#63384e','#302638','#ffa66d'],['#44214e','#18142f','#60eed9']],
 ground:['#101a2c','#122e44','#342b38','#101a2c'],lights:.35,
 plane:{fill:'#efffff',outline:'#0b1935',crease:['#00bddb','#ff43b5']},trail:['#3c91ab','#913a90'],
 shop:{wall:'#121b32',roof:'#793765',sign:'#ef59c1',text:'#17172f',window:'#223c4d',light:'#53dbea',door:'#35344f'},kid:['#9e91bd','#61eafa','#ee50b4','#38466f'],
 tint:color=>color,fx:{smoke:'#8a7aa8',water:'#78d8ee',beacon:'#ff4d6d',bird:'#d0daeb',rain:'#7fd6ff',star:'#e8f6ff',glow:true},night:[1,1,1,1]
};

export const THEMES={cyber,paper,blueprint,dusk};
export const THEME_IDS=Object.keys(THEMES);
let current=cyber;
export const theme=()=>current;
// Preview-only themes (themes-verse.js) are passed as objects; the game only ever passes ids from THEMES.
export function setTheme(id){current=id&&typeof id==='object'?id:Object.hasOwn(THEMES,id??'')?THEMES[id]:cyber;return current;}
// URL (?styl=paper) wins over the stored choice; unknown ids fall back to cyber.
export function pickTheme(param,stored){return [param,stored].find(id=>id&&Object.hasOwn(THEMES,id))??'cyber';}

// Paint a path in the current theme's style. `area` lets tiny shapes skip the paper shadow.
export function paint(c,color,path,area=Infinity){
 const t=current;c.beginPath();path();
 if(t.mode==='line'){c.fillStyle=t.base;c.fill();c.strokeStyle=t.ink(color);c.lineWidth=1.2;c.stroke();}
 else if(t.mode==='paper'&&area>60)shadowed(c,()=>{c.fillStyle=color;c.fill();},3);
 // Ink: flat fill plus a thick dark outline whose width is given in screen pixels (tiny shapes stay flat).
 else if(t.mode==='ink'){c.fillStyle=color;c.fill();if(area>40){c.strokeStyle=t.line;c.lineJoin='round';c.lineWidth=t.lineWidth/(c.getTransform?.().a||1);c.stroke();}}
 else{c.fillStyle=color;c.fill();}
}
export function box(c,color,x,y,w,h){
 if(current.mode==='fill'){c.fillStyle=color;c.fillRect(x,y,w,h);return;}
 paint(c,color,()=>c.rect(x,y,w,h),Math.abs(w*h));
}
export function tri(c,color,x,y,w,h){paint(c,color,()=>{c.moveTo(x,y);c.lineTo(x+w/2,y-h);c.lineTo(x+w,y);c.closePath();},w*h/2);}
