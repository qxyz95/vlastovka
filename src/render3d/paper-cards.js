// Papírové karty (čisté, ?styl=papir): bloky cityChunk a život čtvrti → tenké karty dioramatu a jejich vrcholy (stíny na zem: paper-shadow.js).
// Přeneseno z prototype/styly/papir-data.js (bible research/design/05-styl-papir.md kap. 3), barvy z palette(style).city / .life, ne napevno.
// Karta: {shape:'box'|'panel'|'lista'|'gable'|'eave'|'pyr'|'disc'|'flag'|'poly'|'prism', layer:'near'|'mid'|'far'|'cloud'|'balloon', x,w,y,h,z,d, color, roof?, r?, n?, pts?}, metry.
import {SCREEN_METERS} from '../scenes.js';
import {chunkOffset} from './geometry.js';
import {suburbLife,carX,TRACK} from './life.js';
import {palette,mix} from './palette.js';

const hash=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
export const PLACE_W=SCREEN_METERS;
// Id vrstvy: materiál papíru podle něj volí ztmavení paty (dálka, střed, ulice) a příjem stínu na zem (zem). Stíny: paper-shadow.js (08-stiny.md).
export const ID=Object.freeze({sky:0,far:1,mid:2,near:4,ground:8,cloud:16,balloon:32});
// Tloušťka karty podle vrstvy (přední hrana zůstává tam, kde ji má cityChunk), výška panoramy × FAR_H, podíl sedlových střech podle vrstvy.
export const CARD_D=Object.freeze({near:4,mid:6,far:12}),FAR_H=.42,ROOFS=Object.freeze({near:.7,nearWide:.25,mid:.35,far:.4});
// Stopa vlaštovky (kap. 2.2, P3): čárka 1,5 m s mezerou 0,9 m, alfa 0,85, poloviční šířka max(0,22 m, 1,1 CSS px), bez lemu.
export const PAPER_TRAIL=Object.freeze({dash:1.5,period:2.4,alpha:.85,half:.22,minPx:1.1});

const layerOf=b=>b.tone===1?'mid':b.tone===2||b.tone===5?'far':'near';
const pick=(list,x,s=0)=>list[Math.floor(hash(Math.floor(x*3),s)*list.length)%list.length];
const card=(o,layer)=>{const d=Math.min(o.d,CARD_D[layer]);return {...o,z:o.z+o.d/2-d/2,d,layer};};
const colorsOf=(style,district)=>{const D=palette(style).city.districts;return D?.[Math.max(0,Math.min(D.length-1,district|0))]??palette('papir').city.districts[0];};

// Karty jednoho místa z cityChunk(index) v LOKÁLNÍCH souřadnicích místa (x 0…PLACE_W, jako chunk; posun dělá volající přes chunkOffset).
// Náhodné volby (barva, střecha, okna) hashují světové x, takže místa 0–3 vypadají jako v prototypu. Dílna (shop) se vynechá, kreslí ji workshop.js.
// opts {farH, roofs} dovolí čtvrti (districts/*-layout.js paper) přepsat výšku panoramy a podíl střech.
export function placeCards(chunk,style='papir',{farH=FAR_H,roofs=ROOFS}={}){
 const C=colorsOf(style,chunk.biome),dx=chunkOffset(chunk.index),out=[],add=o=>{out.push(o);return o;};
 for(const b of chunk.blocks){if(b.shop)continue;const L=layerOf(b),x=b.x+dx;
  if(b.tone===4){// strom: kmen + papírový kotouč
   add(card({shape:'box',x:x+b.w/2-.35,w:.7,y:0,h:b.h*.45,z:b.z,d:.7,color:C.trunk},'near'));
   add(card({shape:'disc',x:x+b.w/2,y:b.h*.45+b.w*.75,r:b.w*.85,z:b.z+.4,d:1,color:pick(C.trees,x,4)},'near'));continue;}
  if(b.h<1){add(card({shape:'box',x,w:b.w,y:b.y??0,h:b.h,z:b.z,d:b.d,color:C.flat},'near'));continue;}// kolejové lože a ploché pásy bez střech
  if(b.tone===3){add(card({shape:'box',x,w:b.w,y:b.y??0,h:b.h,z:b.z,d:b.d,color:b.w>15?pick(C.near,x,9):C.roof[0]},'near'));continue;}
  const pal=L==='near'?C.near:L==='mid'?C.mid:C.far,col=pick(pal,x,L.length);
  const o=add(card({shape:b.type==='pyramid'?'pyr':'box',x,w:b.w,y:b.y??0,h:L==='far'?b.h*farH:b.h,z:b.z,d:b.d,color:col},L));
  const roofP=L==='near'?(b.w<=20?roofs.near:roofs.nearWide??ROOFS.nearWide):L==='mid'?roofs.mid:roofs.far;
  // Okna = malé tmavé výřezy, dveře jen v ulici, panorama bez oken (silueta).
  if(o.shape==='box'&&L!=='far'&&b.w>=7&&o.h>=7){const sp=L==='near'?4.2:6,ww=L==='near'?1.3:1.6,wh=L==='near'?1.8:2.2,fz=o.z+o.d/2+.05,wc=mix(col,C.window,.6),cols=Math.floor((b.w-2)/sp),rows=Math.floor((o.h-3)/4.2);
   for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)if(hash(x*13+i*7+j*3,6)<.55)out.push({shape:'box',layer:L,x:x+1+(i+.5)*(b.w-2)/cols-ww/2,w:ww,y:3+j*4.2,h:wh,z:fz,d:.1,color:wc});
   if(L==='near')out.push({shape:'box',layer:L,x:x+b.w*(.2+.5*hash(x,8)),w:1.6,y:0,h:2.6,z:fz,d:.1,color:mix(col,C.window,.75)});}
  if(o.shape==='box'&&hash(Math.floor(x*7),2)<roofP){const ov=.6;add({shape:'gable',x:x-ov,w:b.w+2*ov,y:o.h,h:Math.min(L==='far'?14:9,b.w*.42),z:o.z,d:o.d+.4,layer:L,color:col,roof:L==='far'?mix(col,C.roof[0],.25):pick(C.roof,x,5)});}
 }
 // Zahrady: stromy i ve středu, živé ploty u ulice, skleník (aby místo nebylo prázdné).
 if(chunk.kind==='garden'){for(let x=dx+6,i=0;x<dx+PLACE_W-6;i++){const r=3.5+hash(i,21)*3;out.push({shape:'box',layer:'mid',x:x-.5,w:1,y:0,h:6,z:-104,d:1,color:C.trunk},{shape:'disc',layer:'mid',x,y:6+r*.8,r,n:20,z:-103.5,d:1.5,color:pick(C.trees,x,22)});x+=9+hash(i,23)*12;}
  for(let x=dx+4,i=0;x<dx+PLACE_W-10;i++){const w=6+hash(i,24)*10;out.push({shape:'box',layer:'near',x,w,y:0,h:1.4+hash(i,25),z:-20,d:1.6,color:C.hedge[i%3?0:1]});x+=w+4+hash(i,26)*10;}
  out.push({shape:'box',layer:'near',x:dx+150,w:14,y:0,h:5,z:-24,d:4,color:C.glass},{shape:'gable',layer:'near',x:dx+149.5,w:15,y:5,h:3.5,z:-24,d:4.4,color:C.glass,roof:C.glassRoof});}
 for(const c of out)c.x-=dx;
 return out;
}
// Vzdálené kopce za městem (opar), světové x0…x1.
export function hills(x0,x1,style='papir',district=0){const C=colorsOf(style,district),out=[];
 for(let x=x0,i=0;x<x1;i++){const w=260+hash(i,11)*320;out.push({shape:'pyr',x,w,y:0,h:28+hash(i,12)*34,z:-560,d:20,layer:'far',color:C.hills[i%2]});x+=w*.55;}return out;}
// Země místa (blízko / střed / dálka), lokální x jako placeCards.
export function groundCards(style='papir',district=0){const G=colorsOf(style,district).ground,x=-1,w=PLACE_W+2;
 return [{shape:'box',layer:'ground',x,w,y:-.4,h:.4,z:-10,d:100,color:G.near},{shape:'box',layer:'ground',x,w,y:-.4,h:.4,z:-155,d:190,color:G.mid},{shape:'box',layer:'ground',x,w,y:-.4,h:.4,z:-575,d:650,color:G.far}];}

// Život čtvrti 1 (suburbLife, světové souřadnice) jako karty; auta v poloze t = 0 (pohyb dělá life3d.js). Vrací {cards, clouds, balloons}.
export function lifeCards(life=suburbLife(),style='papir'){
 const P=palette(style),Q=P.life,C=colorsOf(style,0),out=[],add=(o,layer='near')=>out.push({layer,...o}),ink=Q.line,people=Q.people;
 for(const c of life.chimneys)add({shape:'box',x:c.x-.5,w:c.big?1.6:1,y:c.y,h:c.h,z:c.z,d:1,color:Q.chimney},c.big?'mid':'near');
 for(const t of life.tanks){add({shape:'box',x:t.x,w:2.6,y:t.y+.9,h:2.6,z:t.z,d:2.6,color:Q.tanks.body});add({shape:'box',x:t.x+.3,w:.3,y:t.y,h:.9,z:t.z,d:.3,color:Q.tanks.leg});add({shape:'box',x:t.x+2,w:.3,y:t.y,h:.9,z:t.z,d:.3,color:Q.tanks.leg});add({shape:'pyr',x:t.x,w:2.6,y:t.y+3.5,h:1.2,z:t.z,d:2.6,color:Q.tanks.roof});}
 for(const a of life.antennas){const lay=a.h>8?'mid':'near';add({shape:'box',x:a.x-.12,w:.24,y:a.y,h:a.h,z:a.z,d:.24,color:Q.mast},lay);add({shape:'box',x:a.x-1.2,w:2.4,y:a.y+a.h*.7,h:.16,z:a.z,d:.16,color:Q.mast},lay);}
 for(const l of life.laundry){add({shape:'box',x:l.x0,w:l.x1-l.x0,y:l.y,h:.06,z:l.z,d:.06,color:ink});for(const it of l.items)add({shape:'box',x:it.x,w:it.w,y:l.y-it.h,h:it.h,z:l.z,d:.08,color:pick(people.cloth,it.x,3)});}
 for(const b of life.bunting){add({shape:'box',x:b.x0,w:b.x1-b.x0,y:b.y,h:.06,z:b.z,d:.06,color:ink});b.items.forEach((it,i)=>add({shape:'flag',x:it.x-.55,w:1.1,y:b.y-1.2,h:1.2,z:b.z,d:.08,color:Q.bunting[i%Q.bunting.length]}));}
 for(const s of life.stalls){add({shape:'box',x:s.x,w:s.w,y:0,h:1.1,z:s.z,d:s.d,color:Q.stall.base});for(const dx of [.1,s.w-.3])add({shape:'box',x:s.x+dx,w:.2,y:0,h:2.5,z:s.z+1.3,d:.2,color:Q.stall.post});
  for(let j=0;j<4;j++)add({shape:'box',x:s.x-.3+j*1.9,w:1.9,y:2.5,h:.45,z:s.z+.3,d:3.8,color:j%2?Q.stall.stripe:pick(Q.stall.stripes,s.x,6)});}
 for(const p of life.pinwheels){add({shape:'box',x:p.x-.06,w:.12,y:0,h:p.y,z:p.z,d:.12,color:Q.pole});add({shape:'disc',x:p.x,y:p.y,r:.7,n:4,z:p.z+.1,d:.08,color:pick(Q.balloons,p.x,7)});}
 for(const p of life.people){add({shape:'box',x:p.x-.4,w:.8,y:p.y,h:1.3,z:p.z,d:.5,color:p.cloth?pick(people.cloth,p.x*5,1):people.cloth[0]});add({shape:'disc',x:p.x,y:p.y+1.65,r:.38,n:8,z:p.z,d:.5,color:pick(people.skin,p.x*7,2)});}
 for(const c of life.cars){const x=carX(c,0);add({shape:'box',x,w:c.len,y:.35,h:1.1,z:c.z,d:1.8,color:pick(C.near,x,8)});add({shape:'box',x:x+.9,w:2.2,y:1.45,h:.8,z:c.z,d:1.6,color:Q.car.cabin});}
 add({shape:'box',x:TRACK.portal-12,w:22,y:0,h:9,z:TRACK.z,d:6,color:Q.tunnel.wall});add({shape:'box',x:TRACK.portal-4,w:6,y:0,h:5.4,z:TRACK.z+3.2,d:.6,color:Q.tunnel.mouth});
 add({shape:'pyr',x:TRACK.portal-20,w:36,y:0,h:16,z:TRACK.z-6,d:8,color:Q.pyramid});
 add({shape:'box',x:TRACK.portal-2,w:TRACK.end+300-TRACK.portal,y:0,h:.3,z:TRACK.z,d:3.2,color:Q.rail.bed});
 add({shape:'box',x:1094,w:78,y:0,h:.8,z:-11.9,d:2.6,color:Q.platform});
 for(const b of life.balloons){add({shape:'disc',x:b.x,y:b.y,r:b.r,n:20,z:b.z,d:1,color:pick(Q.balloons,b.x,9)},'balloon');add({shape:'box',x:b.x-.9,w:1.8,y:b.y-b.r-2.4,h:1.4,z:b.z,d:1,color:Q.basket},'balloon');}
 for(const c of life.clouds)for(let k=0;k<3;k++){const r=c.sx*(k===1?.42:.3);add({shape:'disc',x:c.x+(k-1)*c.sx*.45,y:c.y+(k===1?c.sy*.6:0),r,n:24,z:c.z,d:2,color:Q.cloud},'cloud');}
 return {cards:out,clouds:life.clouds,balloons:life.balloons};
}

// ── Vrcholy karet: pozice, normála, barva ('#rrggbb' sRGB, převod dělá three.js modul). Čelo karty míří na +z (ke kameře), pořadí vrcholů CCW zvenku.
// Tenké karty (research/design/11-katalog-ctvrt1.md kap. 1.3, scénář C): 'panel' = jen čelo (2 △), 'lista' = čelo + světlý horní řez (4 △).
// box tenčí než THIN se kreslí sám jako panel (díly ze seznamu LISTA jako lista), disc s d ≤ THIN_DISC jen čelem (n − 2 △): boky jsou v záběru pod 1 px.
// Další tvary katalogu: gable {eaves:false} bez lemů okapu (5 △), 'eave' střecha okapem ke kameře (hřeben v půli hloubky, 2 sklony + 2 boční
// štíty; back:false bez zadního sklonu, 4 △), 'poly' vystřižené čelo {pts:[[x,y]…] CCW, vějíř z pts[0], hvězdicový k pts[0]; x,w,y,h = obal}.
// 'prism' (K4, věžička): n-boký hranol {x,w,y,h,z,d, n=6}, jen přivrácená polovina plášťů (n/2 ploch k +z, plochou stěnou ke kameře) a víko
// (n − 2 △, top:false bez víka); apex:true = jehlan nad toutéž podstavou (n/2 △). x,w,z,d = obal podstavy (elipsa vepsaná do w × d).
// opts.thin=false nakreslí panel, lista a tenký disc jako plnou kartu (porovnání se stavem před K3).
export const THIN=.15,THIN_DISC=.1,LISTA=Object.freeze(new Set(['sill','cornice','stringcourse','plinth','step','canopy','flowerbox','lintel','balcony','counter','coping']));
export const cardKind=(b,thin=true)=>b.shape==='panel'||b.shape==='lista'?(thin?b.shape:'box'):b.shape==='box'&&thin&&b.d<=THIN?(LISTA.has(b.part)?'lista':'panel'):b.shape==='disc'&&thin&&b.d<=THIN_DISC?'plate':b.shape;
const quad=(o,a,b,c,d,n,col)=>{for(const v of [a,b,c,a,c,d]){o.p.push(...v);o.n.push(...n);o.c.push(col);}};
const tri=(o,a,b,c,n,col)=>{for(const v of [a,b,c]){o.p.push(...v);o.n.push(...n);o.c.push(col);}};
export function cardVertices(list,{thin=true}={}){
 const o={p:[],n:[],c:[]};
 for(const b of list){const z0=b.z-b.d/2,z1=b.z+b.d/2,k=cardKind(b,thin);
  if(k==='box'||k==='panel'||k==='lista'){const x0=b.x,x1=b.x+b.w,y0=b.y,y1=b.y+b.h,col=b.color;
   quad(o,[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1],col);if(k==='panel')continue;quad(o,[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0],col);if(k==='lista')continue;
   quad(o,[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0],col);quad(o,[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0],col);}
  else if(k==='gable'){const x0=b.x,x1=b.x+b.w,xm=(x0+x1)/2,y0=b.y,y1=b.y+b.h,s=Math.hypot(b.h,b.w/2),nl=[-b.h/s,b.w/2/s,0],nr=[b.h/s,b.w/2/s,0];
   for(const v of [[x0,y0,z1],[x1,y0,z1],[xm,y1,z1]]){o.p.push(...v);o.n.push(0,0,1);o.c.push(b.color);}
   quad(o,[x0,y0,z1],[xm,y1,z1],[xm,y1,z0],[x0,y0,z0],nl,b.roof);quad(o,[xm,y1,z1],[x1,y0,z1],[x1,y0,z0],[xm,y1,z0],nr,b.roof);
   if(b.eaves===false)continue;
   // okap: tenký pruh střechy na čele štítu (papír přeložený přes hranu)
   const t=.55;for(const [a,c2] of [[[x0,y0,z1+.05],[xm,y1,z1+.05]],[[xm,y1,z1+.05],[x1,y0,z1+.05]]]){const dx=c2[0]-a[0],dy=c2[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l*t,ny=dx/l*t;
    quad(o,a,c2,[c2[0]-nx,c2[1]-ny,c2[2]],[a[0]-nx,a[1]-ny,a[2]],[0,0,1],b.roof);}}
  else if(k==='eave'){const x0=b.x,x1=b.x+b.w,y0=b.y,y1=b.y+b.h,zm=(z0+z1)/2,f=Math.hypot(b.h,z1-zm);
   quad(o,[x0,y0,z1],[x1,y0,z1],[x1,y1,zm],[x0,y1,zm],[0,(z1-zm)/f,b.h/f],b.roof);
   if(b.back!==false)quad(o,[x1,y0,z0],[x0,y0,z0],[x0,y1,zm],[x1,y1,zm],[0,(zm-z0)/f,-b.h/f],b.roof);
   tri(o,[x0,y0,z0],[x0,y0,z1],[x0,y1,zm],[-1,0,0],b.color);tri(o,[x1,y0,z1],[x1,y0,z0],[x1,y1,zm],[1,0,0],b.color);}
  else if(k==='prism'){const n=b.n??6,h=n>>1,cx=b.x+b.w/2,y0=b.y,y1=b.y+b.h,sm=Math.max(...Array.from({length:h+1},(_,i)=>Math.sin(i/n*Math.PI*2))),P=(i,y)=>[cx+Math.cos(i/n*Math.PI*2)*b.w/2,y,b.z+Math.sin(i/n*Math.PI*2)/sm*b.d/2];
   const N=(a,c,e)=>{const u=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],v=[e[0]-a[0],e[1]-a[1],e[2]-a[2]],m=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...m);return m.map(x=>x/l);};
   if(b.apex){const t=[cx,y1,b.z];for(let i=0;i<h;i++){const a=P(i+1,y0),c=P(i,y0);tri(o,a,c,t,N(a,c,t),b.color);}continue;}
   for(let i=0;i<h;i++){const a=P(i+1,y0),c=P(i,y0),e=P(i,y1),f=P(i+1,y1);quad(o,a,c,e,f,N(a,c,e),b.color);}
   if(b.top!==false)for(let i=1;i<n-1;i++)tri(o,P(0,y1),P(i+1,y1),P(i,y1),[0,1,0],b.color);}
  else if(k==='poly'){const P=b.pts,v=([x,y])=>[x,y,z1];for(let i=1;i<P.length-1;i++)tri(o,v(P[0]),v(P[i]),v(P[i+1]),[0,0,1],b.color);}
  else if(k==='pyr'||k==='flag'){const x0=b.x,x1=b.x+b.w,xm=(x0+x1)/2,flag=k==='flag',ya=flag?b.y+b.h:b.y,yb=flag?b.y:b.y+b.h;
   const tr=flag?[[x0,ya,z1],[xm,yb,z1],[x1,ya,z1]]:[[x0,ya,z1],[x1,ya,z1],[xm,yb,z1]];for(const v of tr){o.p.push(...v);o.n.push(0,0,1);o.c.push(b.color);}
   if(!flag){const s=Math.hypot(b.h,b.w/2);quad(o,[x0,ya,z1],[xm,yb,z1],[xm,yb,z0],[x0,ya,z0],[-b.h/s,b.w/2/s,0],b.color);quad(o,[xm,yb,z1],[x1,ya,z1],[x1,ya,z0],[xm,yb,z0],[b.h/s,b.w/2/s,0],b.color);}}
  else if(k==='plate'){const n=b.n??18,a0=b.n===4?0:Math.PI/2,P=i=>[b.x+Math.cos(a0+i/n*Math.PI*2)*b.r,b.y+Math.sin(a0+i/n*Math.PI*2)*b.r,z1];
   for(let i=1;i<n-1;i++)tri(o,P(0),P(i),P(i+1),[0,0,1],b.color);}
  else if(k==='disc'){const n=b.n??18,a0=b.n===4?0:Math.PI/2;for(let i=0;i<n;i++){const a=a0+i/n*Math.PI*2,c2=a0+(i+1)/n*Math.PI*2,P=t=>[b.x+Math.cos(t)*b.r,b.y+Math.sin(t)*b.r];
    const [ax,ay]=P(a),[bx,by]=P(c2);o.p.push(b.x,b.y,z1,ax,ay,z1,bx,by,z1);o.n.push(0,0,1,0,0,1,0,0,1);o.c.push(b.color,b.color,b.color);
    const nm=[Math.cos((a+c2)/2),Math.sin((a+c2)/2),0];quad(o,[ax,ay,z1],[ax,ay,z0],[bx,by,z0],[bx,by,z1],nm,b.color);}}}
 return o;
}
// Trojúhelníky karet bez sestavení vrcholů (rozpočet): box 8, panel 2, lista 4, gable 9 (bez lemů 5), eave 6 (bez zad 4), pyr 5, flag 1, poly body − 2,
// disc 3 × n, tenký disc n − 2 (mnohoúhelník čelem).
// prism n/2 · 2 + víko n − 2 (šestiboký 10, bez víka 6), jehlan prism n/2.
const TRIS={box:8,panel:2,lista:4,pyr:5,flag:1};
const prismTris=b=>{const n=b.n??6;return b.apex?n>>1:(n>>1)*2+(b.top===false?0:n-2);};
export const cardTriangles=(list,{thin=true}={})=>list.reduce((s,b)=>{const k=cardKind(b,thin);
 return s+(TRIS[k]??(k==='gable'?(b.eaves===false?5:9):k==='eave'?(b.back===false?4:6):k==='poly'?b.pts.length-2:k==='plate'?(b.n??18)-2:k==='prism'?prismTris(b):3*(b.n??18)));},0);
