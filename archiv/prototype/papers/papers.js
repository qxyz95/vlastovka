// Čtyři druhy papíru (návrh research/design/01-papiry.md): data vzhledu, stopy, částic, rychlostních čar a pocitu z hodu
// a malování vzorů na canvas (stejná textura jde na 3D vlaštovku i na vzorník v HTML). Prototyp, nic v src/ nemění.
// Pravidlo: BARVU stopy dává čtvrť (svet/01 §2.2, 08 §8.2), TVAR stopy, částice, obrys a vzor dává papír.
// Čísla rychlosti a cen jsou zástupná (ladí simulation/progression/), tady jen pro náhled v Dílně.
export const PLACES=['Workshop & First Roofs','Market under the Antennas','Gardens at the Edge','Railway to the River','Warehouses by the Water','Crane Forest',
 'Bridge over the Bay',"Lighthouse at the Pier's End",'Fields beyond the Bay','Wind Ridge','Mountain Saddle','Observatory above the Valley',
 'Gates of the Metropolis','Sky Terraces','Broadcast Tower','Rooftop Harbor'];
export const PLACE_M=305;
// Čtvrti: světlo, nebe, město a barva stopy podle research/svet/01-zivy-svet.md §2.2.
export const DISTRICTS=[
 {id:'suburbs',name:'Violet Suburbs',sky:['#2a1f5c','#6b3fa0','#ff9ec4','#ffc58a'],key:'#ffb38a',dir:[.55,.35,.75],hemi:['#8a7cff','#4a3477'],rim:'#ff6fb5',fog:'#6a4a9a',
  body:['#8e6bbf','#a07ad0','#7d5db0'],shade:'#4a3477',accent:['#ff7a8a'],ground:'#3b2a66',window:'#ffd27a',lit:.4,trail:'#ff6fb5'},
 {id:'docks',name:'Moon Docks',sky:['#0d1b3d','#1e4f7a','#5f8fb8'],key:'#cfe3ff',dir:[-.5,.8,.45],hemi:['#3a5f9a','#0f2b4c'],rim:'#ffb347',fog:'#2a4a6e',
  body:['#215a8c','#2a6a9c','#1b4c78'],shade:'#0f2b4c',accent:['#e8574a','#ffd23f','#2fb8b0'],ground:'#0f2b4c',window:'#ffb347',lit:.25,trail:'#5cd8ff'},
 {id:'horizon',name:'Red Horizon',sky:['#3b1f6e','#e8573a','#ffc35a'],key:'#ff8a3d',dir:[.75,.3,.3],hemi:['#e8573a','#6a3a74'],rim:'#ffc35a',fog:'#c8603a',
  body:['#9a63db','#8a55c8','#a873e0'],shade:'#4a2f8a',accent:['#e8b04a','#c98a2e'],ground:'#c98a2e',window:'#ffe9a8',lit:.08,trail:'#ffc35a'},
 {id:'core',name:'Neon Core',sky:['#0b0a20','#283a8f','#2aa99c','#d2ee48'],key:'#5cf2ff',dir:[-.3,.6,.6],hemi:['#ff4f9e','#1d1233'],rim:'#ff4f9e',fog:'#1a1240',
  body:['#3a1f5c','#44266a','#30184e'],shade:'#1d1233',accent:['#ff4f9e','#5cf2ff','#ffe14d'],ground:'#0b0a20',window:'#5cf2ff',lit:.75,trail:'#ff4f9e'}];
// tones = 3 tóny toon rampy (světlo / střed / stín) natvrdo, ne násobením: stín každého papíru míří k inkoustu jinak.
// outline: tloušťka v px obrazovky (jako toon.outlineMaterial), double = druhý barevný obrys za inkoustovým.
// trail: ribbons [{w šířka v m, a průhlednost, twine amplituda kroucení, phase, core bílé jádro, rainbow}], len = počet bodů.
// particle: shape 0 vločka, 1 vlákno, 2 lístek, 3 hvězda, 4 kapka; rate za s; drift = vlastní rychlost (m/s, kladné y nahoru).
// speed: styl rychlostních čar (fx-map.speedLines dává počet a polohu, papír jen kresbu). feel: pružina po hodu (motion.wobble).
export const PAPERS=[
 {id:'copy',name:'Copy Paper',levels:[1,3],opens:null,district:0,line:'Plain office paper. Light and quick to fold.',
  tones:['#ffffff','#dcdcf4','#958dc8'],emissive:'#000000',glow:0,foil:0,outline:{color:'#15101f',px:2.2,double:null},
  crease:{color:'#5b7cff',dash:null},pattern:'ruled',
  trail:{len:44,ribbons:[{w:.34,a:.85}]},
  particle:{shape:0,rate:5,size:5,colors:['#ffffff','#dcdcf4'],drift:[-4,-1.5],life:.7},
  speed:{style:'ruled',color:'#ffffff',alt:'#9fb3ff',width:1.6,count:1},
  feel:{stiffness:320,damping:11,stretch:1.22,glint:0},
  crown:{name:'Ruled contrails',line:'Two ruled lines trail from the wingtips.'},
  sound:'suché šustnutí „fsst“, krátké, vysoké; vítr tenký'},
 {id:'kraft',name:'Kraft Paper',levels:[4,6],opens:2,district:0,line:'Parcel paper. Sturdy fibres, an airmail edge.',
  tones:['#e6b077','#c08550','#74463a'],emissive:'#000000',glow:0,foil:0,outline:{color:'#2a160e',px:2.9,double:null},
  crease:{color:'#3b2114',dash:[.05,.035]},pattern:'kraft',
  trail:{len:48,ribbons:[{w:.2,a:.9,twine:.55,phase:0},{w:.2,a:.9,twine:.55,phase:Math.PI}]},
  particle:{shape:1,rate:7,size:7,colors:['#8a5a32','#f0c890'],drift:[-3,-3],life:.8},
  speed:{style:'stitched',color:'#2a160e',alt:'#f0c890',width:3,count:.85},
  feel:{stiffness:260,damping:22,stretch:1.14,glint:0},
  crown:{name:'Sea spray',line:'Spray kicks up behind you over water.'},
  sound:'nižší papírové „thup“ při hodu, hrubší šum vláken; vítr plnější'},
 {id:'washi',name:'Washi',levels:[7,9],opens:6,district:1,line:'Long fibres, light shines through. Glows a little at night.',
  tones:['#fbe8cc','#e8cba6','#a98f8c'],emissive:'#ffcf7a',glow:.1,foil:0,outline:{color:'#2b2a55',px:2,double:null},
  crease:{color:'#ffffff',dash:null},pattern:'washi',
  trail:{len:52,ribbons:[{w:1,a:.2},{w:.26,a:.55}]},
  particle:{shape:2,rate:4,size:8,colors:['#fff6e6','#ffd9e6'],drift:[-2,1.2],life:1.4},
  speed:{style:'brush',color:'#fff6e6',alt:'#ffd9a0',width:3.4,count:.6},
  feel:{stiffness:140,damping:13,stretch:1.1,glint:0},
  crown:{name:'Paper lantern',line:'The plane glows like a lantern from inside.'},
  sound:'měkký vydechnutý „whff“, bez ostré hrany; nad vodou tichý zvonivý alikvot'},
 {id:'foil',name:'Neon Foil',levels:[10,12],opens:10,district:2,line:'Holographic foil. Throws the city lights back.',
  tones:['#ffffff','#d8d4ff','#6a4fa0'],emissive:'#000000',glow:0,foil:1,outline:{color:'#15101f',px:2.2,double:{color:'#ff4f9e',px:4.6}},
  crease:{color:'#ffffff',dash:null},pattern:'foil',
  trail:{len:60,ribbons:[{w:1.1,a:.75,taper:1,rainbow:1},{w:.22,a:1,core:1,taper:1}]},
  particle:{shape:3,rate:12,size:12,colors:['#ffffff','#5cf2ff','#ffe14d','#ff4f9e'],drift:[-5,0],life:.5},
  speed:{style:'split',color:'#5cf2ff',alt:'#ff4f9e',width:1.8,count:1},
  feel:{stiffness:420,damping:18,stretch:1.18,glint:1},
  crown:{name:'Neon comet',line:'A comet tail, and a soft pop at every place you pass.'},
  sound:'kovové zachřestění fólie, jiskřivý vysoký třpyt; při průletu místem tiché „pop“'}];
export const FOIL_BANDS=['#ff4f9e','#ffe14d','#4a22c8','#5cf2ff'];// světlé a tmavé pruhy střídavě: fólie se liší jasem i bez barvy
// Zástupná čísla náhledu: krok tempa π za úroveň podle 08 W2, rychlost = základ × (1 + .1·Σπ).
const STEP=[.65,.65,.65,.8,.8,.8,.75,.75,.75,.85,.85,.85];
export const speedAt=level=>Math.round(32*(1+.1*STEP.slice(0,level).reduce((s,x)=>s+x,0)));
export const PRICES=[100,180,300,650,900,1150,1900,2400,2900,3500,4100,4700];
export const paperOf=level=>level<=3?0:level<=6?1:level<=9?2:3;
// Náhled koupě (hodnota teď → po koupi): poslední hod přepočtený poměrem rychlostí (doba letu se nemění, 08 W2).
export function preview(level,lastThrow){
 const now=speedAt(level),next=speedAt(level+1),after=Math.round(lastThrow*next/now),from=Math.floor(lastThrow/PLACE_M),to=Math.floor(after/PLACE_M);
 return {now,next,gain:after-lastThrow,after,past:to>from&&to<PLACES.length?PLACES[to]:null};
}
// ── Vzory (canvas 256 × 256, průhledné pozadí: tón toon rampy prosvítá). u = délka vlaštovky (0 ocas → 1 nos), v = rozpětí.
const rnd=seed=>()=>(seed=(seed*16807)%2147483647)/2147483647;
export function paintPattern(id,size=256){
 const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),s=size/256,r=rnd(7);
 if(id==='ruled'){// kancelářské linky po délce + červený okraj u ocasu
  g.strokeStyle='rgba(95,124,255,.55)';g.lineWidth=2.2*s;for(let y=14;y<256;y+=22){g.beginPath();g.moveTo(0,y*s);g.lineTo(size,y*s);g.stroke();}
  g.strokeStyle='rgba(255,90,120,.7)';g.lineWidth=2.6*s;g.beginPath();g.moveTo(52*s,0);g.lineTo(52*s,size);g.stroke();
 }else if(id==='kraft'){// krátká vlákna ve dvou tónech + airmail lem na odtokové hraně (u = 0) + razítko
  for(let i=0;i<520;i++){const x=r()*256,y=r()*256,a=r()*Math.PI,l=4+r()*10;g.strokeStyle=r()<.6?'rgba(120,74,40,.5)':'rgba(250,215,160,.55)';g.lineWidth=(.8+r()*1.2)*s;
   g.beginPath();g.moveTo(x*s,y*s);g.lineTo((x+Math.cos(a)*l)*s,(y+Math.sin(a)*l)*s);g.stroke();}
  for(let y=-20;y<276;y+=24){g.fillStyle=(y/24|0)%2?'#2f56c8':'#d8463a';g.beginPath();g.moveTo(0,y*s);g.lineTo(26*s,(y+12)*s);g.lineTo(26*s,(y+24)*s);g.lineTo(0,(y+12)*s);g.fill();}
  g.strokeStyle='rgba(60,30,20,.75)';g.lineWidth=3*s;g.beginPath();g.arc(150*s,128*s,26*s,0,7);g.stroke();g.beginPath();g.arc(150*s,128*s,19*s,0,7);g.stroke();
  for(const dy of [-6,0,6]){g.beginPath();g.moveTo(178*s,(128+dy)*s);g.quadraticCurveTo(195*s,(122+dy)*s,212*s,(128+dy)*s);g.stroke();}
 }else if(id==='washi'){// seigaiha (vlny = záliv) jemně indigem + dlouhá vlákna kozo
  g.lineWidth=1.6*s;for(let row=0;row<12;row++)for(let col=-1;col<9;col++){const x=(col*32+(row%2)*16)*s,y=(row*16+8)*s;
   for(const rr of [15,10,5]){g.strokeStyle=`rgba(70,100,185,${rr===15?.55:.35})`;g.beginPath();g.arc(x,y,rr*s,Math.PI,0);g.stroke();}}
  for(let i=0;i<60;i++){let x=r()*256,y=r()*256;g.strokeStyle=r()<.5?'rgba(255,255,255,.75)':'rgba(190,160,120,.4)';g.lineWidth=(.6+r()*1.1)*s;g.beginPath();g.moveTo(x*s,y*s);
   for(let k=0;k<4;k++){const nx=x+(r()-.3)*40,ny=y+(r()-.5)*22;g.quadraticCurveTo(((x+nx)/2+(r()-.5)*14)*s,((y+ny)/2)*s,nx*s,ny*s);x=nx;y=ny;}g.stroke();}
 }else if(id==='foil'){// jemné šikmé rýhy (hologram), shader z nich dělá třpyt; alfa nese jas, ne barvu
  g.lineWidth=2*s;for(let k=-256;k<512;k+=7){g.strokeStyle=`rgba(255,255,255,${(k/7|0)%3?.18:.5})`;g.beginPath();g.moveTo(k*s,0);g.lineTo((k+256)*s,size);g.stroke();}
  for(let i=0;i<40;i++){const x=r()*256,y=r()*256;g.fillStyle='rgba(255,255,255,.9)';g.fillRect(x*s,y*s,2*s,2*s);}
 }
 return c;
}
// Vzorník do HTML: tón papíru pod vzorem (u Foil pruhy fólie).
export function paintSwatch(p,w=240,h=64){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 if(p.foil){const gr=g.createLinearGradient(0,0,w,h);FOIL_BANDS.concat(FOIL_BANDS[0]).forEach((b,i,a)=>{gr.addColorStop(i/(a.length-1),b);});g.fillStyle=gr;}else g.fillStyle=p.tones[0];
 g.fillRect(0,0,w,h);if(!p.foil){g.fillStyle=p.tones[1];g.fillRect(0,h*.62,w,h*.38);}
 const pat=paintPattern(p.pattern,256);g.globalAlpha=1;for(let x=0;x<w;x+=128)g.drawImage(pat,x,0,128,128);
 return c;
}
