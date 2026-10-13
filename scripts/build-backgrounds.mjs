import {writeFile} from 'node:fs/promises';
const root=new URL('../assets/backgrounds/',import.meta.url);
const palettes=[
 ['violet','#120e30','#4b2065','#b84eab','#22183c','#100e24','#ea70c8','#79e8ee'],
 ['moon','#101b36','#314c68','#93a3cf','#21344d','#0d172d','#78d8ee','#decba7'],
 ['sunset','#331933','#a24d61','#ed9d7e','#603348','#271a30','#ffa66d','#f976b1'],
 ['core','#1c0c2e','#682055','#b93a85','#371634','#130e22','#f753ba','#60eed9']
];
let seed=11;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
for(const [index,p] of palettes.entries())for(const layer of ['sky','far','near']){
 seed=37+index*93+(layer==='near'?52:0);let s='';
 const rect=(x,y,w,h,color)=>{s+=`<rect x="${Math.round(x)}" y="${Math.round(y)}" width="${Math.round(w)}" height="${Math.round(h)}" fill="${color}"/>`;};
 if(layer==='sky'){
  for(let y=0;y<360;y+=12){const t=y/360;const mix=(a,b)=>Math.round(parseInt(a,16)*(1-t)+parseInt(b,16)*t).toString(16).padStart(2,'0');const col='#'+[1,3,5].map(k=>mix(p[1].slice(k,k+2),p[2].slice(k,k+2))).join('');rect(0,y,960,12,col);}
  for(let i=0;i<100;i++)rect(rand()*960,rand()*190,rand()>.92?2:1,1,p[3]);
  const mx=index===1?490:510,my=index===1?105:95,r=index===1?65:47;
  for(let yy=-r;yy<r;yy+=3){const ww=Math.sqrt(r*r-yy*yy);rect(mx-ww,my+yy,ww*2,3,p[3]);}
  if(index!==1)for(let y=105;y<146;y+=7)rect(mx-50,y,100,3,p[2]);
  else for(let i=0;i<20;i++)rect(mx-40+rand()*70,my-40+rand()*70,5+rand()*10,3,p[2]);
  for(let i=0;i<13;i++){const x=rand()*960,y=50+rand()*140;rect(x,y,70+rand()*90,5,p[2]);rect(x+17,y-5,45,5,p[2]);}
 }else{
  const far=layer==='far',base=far?320:350;
  for(let x=0;x<960;){const w=far?20+Math.floor(rand()*38):44+Math.floor(rand()*44),h=(far?65:100)+Math.floor(rand()*(far?95:130)),y=base-h;
   rect(x,y,w,h,p[far?4:5]);rect(x+4,y-5,w-8,5,p[far?4:5]);
   if(rand()>.35){rect(x+w/2,y-23,2,20,p[far?4:5]);rect(x+w/2-1,y-24,4,2,p[6]);}
   if(!far){rect(x+w-4,y+8,2,h-8,p[4]);rect(x+7,y-13,w-14,8,p[5]);
    if(rand()>.5){rect(x+6,y+15,w-12,15,p[6]);for(let k=0;k<4;k++)rect(x+10+k*10,y+18,5,8,p[5]);}
    if(index===3&&rand()>.6){rect(x+w-13,y+35,7,65,p[7]);for(let j=0;j<8;j++)rect(x+w-12,y+38+j*7,5,3,p[5]);}
   }
   for(let yy=y+40;yy<base-8;yy+=far?12:13)for(let xx=x+7;xx<x+w-7;xx+=far?8:11)if(rand()>.43)rect(xx,yy,far?2:5,far?3:4,rand()>.7?p[7]:far?p[2]:p[6]);
   if(!far)for(let j=0;j<3;j++)rect(x+4,base-20-j*8,w-8,2,p[4]);
   x+=w+4+Math.floor(rand()*12);
  }
  if(!far){for(let i=0;i<6;i++){const x=i*170+12;rect(x,280,110,5,p[4]);rect(x+15,284,3,60,p[5]);rect(x+83,284,3,60,p[5]);}}
 }
 await writeFile(new URL(`${p[0]}-${layer}.svg`,root),`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360" shape-rendering="crispEdges">${s}</svg>`);
}
await writeFile(new URL('README.md',root),'# Cyberpunk backgrounds\n\nVlastní SVG pixelové assety vytvořené pro tuto hru, bez převzatých obrázků. Čtyři čtvrti × tři vrstvy (sky, far, near), 960 × 360. Generátor: scripts/build-backgrounds.mjs. Referenční screenshot sloužil pouze jako inspirace atmosféry. Každá vrstva se samostatně opakuje a posouvá v renderu.\n');

