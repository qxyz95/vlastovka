// Papírové město (směr B), finální návrh pro čtvrť 1 (research/design/05-styl-papir.md, 06-papir-ctvrt1.md).
// Čistá data a geometrie bez three.js a DOM (běží v Node): tokeny, paleta čtvrti 1, papírové karty z cityChunk + suburbLife,
// profil siluety vrstvy (skyline) pro levné měkké stíny. Game-dev může tyto funkce přenést do src/render3d/ skoro beze změny.
import {SCREEN_METERS} from '../../src/scenes.js';
import {cityChunk,chunkOffset} from '../../src/render3d/geometry.js';
import {suburbLife,carX,TRACK} from '../../src/render3d/life.js';

const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export const mix=(a,b,k)=>{const x=hx(a),y=hx(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');};
const lum=h=>{const [r,g,b]=hx(h).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4;});return .2126*r+.7152*g+.0722*b;};
export const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const hash=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};

// ── 1 primitivní tokeny (bible 05 kap. 2.1)
export const TOKENS=Object.freeze({
 paper:'#ffffff',cream:'#fbf6ec',card:'#f4ecdc',graphite:'#2a2622',pencil:'#6b6158',kraft:'#c9a57c',kraftDark:'#9c7a55',desk:'#d9c4a0',tape:'#efe0a8',
 tomato:'#d9472b',tomatoDark:'#a8341e',teal:'#13807d',mustard:'#e2a43a',mustardText:'#8a5a00',cobalt:'#2456c9',miss:'#8c8379',shade:'#3b3560'});
// ── 2 role (kap. 2.2): jedna role = jedna barva; perfekt a úspěch se liší i tvarem (hvězda).
export const ROLE=Object.freeze({planeFill:TOKENS.paper,planeEdge:TOKENS.graphite,trail:TOKENS.graphite,success:TOKENS.teal,perfect:TOKENS.tomato,
 value:TOKENS.mustard,valueText:TOKENS.mustardText,miss:TOKENS.miss,focus:TOKENS.cobalt,warning:TOKENS.graphite,text:TOKENS.graphite,dim:TOKENS.pencil});
// QTE: krémový papírový kroužek zvednutý nad scénu (stín), grafitová stopa (kap. 5.5).
export const QTE=Object.freeze({disc:TOKENS.cream,discAlpha:.95,track:TOKENS.miss,success:TOKENS.teal,perfect:TOKENS.tomato,dot:TOKENS.graphite});

// ── 3 čtvrť 1 „ráno“ (kap. 2.3): obloha přechodem (bokashi), slunce vpravo nízko, pastely jako Monument Valley, opar jako Alto.
export const D1=Object.freeze({
 sky:['#78b4dc','#a6d0e8','#d8e9ea','#fce4c6'],skyAt:[0,.42,.74,.9],sun:{x:.8,y:.2,r:.05,color:'#fff8e8',glow:'#ffd9a8'},
 haze:{low:'#f6e6d2',high:'#cfe2ec',from:20,to:700,max:.72,curve:.8},
 far:['#a9b6d6','#b4b1d4','#a7bdd6'],hills:['#b3c3dc','#bfc6e0'],
 mid:['#e9b9a5','#c6d8c0','#b6c9e4','#f0d59e','#e2bfd5','#f2c7a8'],
 near:['#e8735a','#f2b65a','#5aa6a0','#f4ece0','#e98fa0','#7f9ed6','#f0a27a','#9cc3a6'],
 roof:['#3d4f7a','#b5503c','#6a5a8e','#3d4f7a'],trees:['#7fb08a','#5f9e86','#a8c48a','#8fbf9a'],trunk:'#9c7a55',
 ground:{near:'#dcc29b',mid:'#e8d6b8',far:'#efe3cf'},cut:'#fffaf0',side:'#5b4f7a',shadow:TOKENS.shade,
 light:[.62,.5,.6],// směr ke slunci (vpravo, nahoře, ke kameře)
 cloud:'#fffaf0',window:'#3d4f7a',warm:'#ffe2a8',
 people:{cloth:['#e8735a','#f2b65a','#5aa6a0','#7f9ed6','#e98fa0','#f4ece0'],skin:['#f3d2b4','#e2b08c','#c98b62','#8d5a3b']},
 balloons:['#e8735a','#f2b65a','#5aa6a0','#e98fa0','#7f9ed6']});

// Stencil: id vrstvy (hodnota zapsaná vrstvou) a maska příjemců stínu. Stín vrstvy padá jen na vrstvy za ní a na nebe.
export const ID=Object.freeze({sky:0,far:1,mid:2,near:4,ground:8,cloud:16,balloon:32});
// Stylizované světlo dioramatu: posun a měkkost stínu rostou s hloubkou mezi vrstvami (dz, strop 140 m), ne se skutečnou vzdáleností.
export const SHADOW=Object.freeze({k:[-.07,-.045],pen:.022,penMin:.4,dzCap:140,alpha:.2,
 casters:{near:{dz:84,mask:0xFC},mid:{dz:140,mask:0xFE},far:{dz:140,mask:0xFF}},plane:{dz:40,z:-1.5,mask:0xF8,alpha:.3},cloud:{dz:120,mask:0xFF,alpha:.12}});
export const shadowOffset=dz=>{const d=Math.min(dz,SHADOW.dzCap);return {dx:SHADOW.k[0]*d,dy:SHADOW.k[1]*d,pen:Math.max(SHADOW.penMin,SHADOW.pen*d)};};

// Tloušťka karty podle vrstvy (diorama: tenké kulisy, přední hrana zůstává tam, kde ji má cityChunk).
const CARD_D={near:4,mid:6,far:12},FAR_H=.42;
const layerOf=b=>b.tone===1?'mid':b.tone===2||b.tone===5?'far':'near';
const pick=(list,x,s=0)=>list[Math.floor(hash(Math.floor(x*3),s)*list.length)%list.length];
const card=(o,layer)=>{const d=Math.min(o.d,CARD_D[layer]);return {...o,z:o.z+o.d/2-d/2,d,layer};};

// Karty jednoho místa (index 0–3) ve světových m. shape: box | gable (sedlová střecha, štít ke kameře) | pyr | disc (strom, hlava) | flag (vlaječka).
export function placeCards(index){
 const c=cityChunk(index),dx=chunkOffset(index),out=[],add=o=>{out.push(o);return o;};
 for(const b of c.blocks){if(b.shop)continue;const L=layerOf(b),x=b.x+dx;
  if(b.tone===4){// strom: kmen + papírový kotouč (Paper Mario), místo jehlanu
   add(card({shape:'box',x:x+b.w/2-.35,w:.7,y:0,h:b.h*.45,z:b.z,d:.7,color:D1.trunk},'near'));
   add(card({shape:'disc',x:x+b.w/2,y:b.h*.45+b.w*.75,r:b.w*.85,z:b.z+.4,d:1,color:pick(D1.trees,x,4)},'near'));continue;}
  if(b.h<1){add(card({shape:'box',x,w:b.w,y:b.y??0,h:b.h,z:b.z,d:b.d,color:TOKENS.kraftDark},'near'));continue;}// kolejové lože a podobné ploché pásy
  if(b.tone===3){add(card({shape:'box',x,w:b.w,y:b.y??0,h:b.h,z:b.z,d:b.d,color:b.w>15?pick(D1.near,x,9):D1.roof[0]},'near'));continue;}
  const pal=L==='near'?D1.near:L==='mid'?D1.mid:D1.far,col=pick(pal,x,L.length);
  // Panorama čtvrti 1 nízká (ráno nad předměstím, ne věže metropole): výška × FAR_H.
  const o=add(card({shape:b.type==='pyramid'?'pyr':'box',x,w:b.w,y:b.y??0,h:L==='far'?b.h*FAR_H:b.h,z:b.z,d:b.d,color:col},L));
  // Sedlové střechy (Monument Valley: čistý trojúhelník) na nízkých domech ulice a části středu.
  const roofP=L==='near'?(b.w<=20?.7:.25):L==='mid'?.35:.4;
  // Okna jako malé tmavé výřezy (žádná svítící mřížka), dveře u ulice; v panoramě nic (silueta).
  if(o.shape==='box'&&L!=='far'&&b.w>=7&&o.h>=7){const sp=L==='near'?4.2:6,ww=L==='near'?1.3:1.6,wh=L==='near'?1.8:2.2,fz=o.z+o.d/2+.05,wc=mix(col,D1.window,.6),cols=Math.floor((b.w-2)/sp),rows=Math.floor((o.h-3)/4.2);
   for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)if(hash(x*13+i*7+j*3,6)<.55)out.push({shape:'box',layer:L,x:x+1+(i+.5)*(b.w-2)/cols-ww/2,w:ww,y:3+j*4.2,h:wh,z:fz,d:.1,color:wc});
   if(L==='near')out.push({shape:'box',layer:L,x:x+b.w*(.2+.5*hash(x,8)),w:1.6,y:0,h:2.6,z:fz,d:.1,color:mix(col,D1.window,.75)});}
  if(o.shape==='box'&&hash(Math.floor(x*7),2)<roofP){const ov=.6;add({shape:'gable',x:x-ov,w:b.w+2*ov,y:o.h,h:Math.min(L==='far'?14:9,b.w*.42),z:o.z,d:o.d+.4,layer:L,color:col,roof:L==='far'?mix(col,D1.roof[0],.25):pick(D1.roof,x,5)});}
 }
 // Zahrady (místo 3): stromy i ve středu, živé ploty a záhony u ulice, skleník; aby místo nebylo prázdné.
 if(c.kind==='garden'){for(let x=dx+6,i=0;x<dx+PLACE_W-6;i++){const r=3.5+hash(i,21)*3;out.push({shape:'box',layer:'mid',x:x-.5,w:1,y:0,h:6,z:-104,d:1,color:D1.trunk},{shape:'disc',layer:'mid',x,y:6+r*.8,r,n:20,z:-103.5,d:1.5,color:pick(D1.trees,x,22)});x+=9+hash(i,23)*12;}
  for(let x=dx+4,i=0;x<dx+PLACE_W-10;i++){const w=6+hash(i,24)*10;out.push({shape:'box',layer:'near',x,w,y:0,h:1.4+hash(i,25),z:-20,d:1.6,color:i%3?'#8fbf9a':'#7fb08a'});x+=w+4+hash(i,26)*10;}
  out.push({shape:'box',layer:'near',x:dx+150,w:14,y:0,h:5,z:-24,d:4,color:'#cfe2ec'},{shape:'gable',layer:'near',x:dx+149.5,w:15,y:5,h:3.5,z:-24,d:4.4,color:'#cfe2ec',roof:'#9fc3cf'});}
 return out;
}
// Vzdálené kopce za městem (opar), aby panorama mělo měkkou siluetu jako Alto.
export function hills(x0,x1){const out=[];for(let x=x0,i=0;x<x1;i++){const w=260+hash(i,11)*320;out.push({shape:'pyr',x,w,y:0,h:28+hash(i,12)*34,z:-560,d:20,layer:'far',color:D1.hills[i%2]});x+=w*.55;}return out;}

// Život čtvrti 1 (suburbLife) jako papírové karty: komíny, nádrže, antény, prádlo, vlaječky, stánky, větrníky, lidé, auta, vlak, tunel.
export function lifeCards(){
 const L=suburbLife(),out=[],add=(o,layer='near')=>out.push({layer,...o}),P=D1.people;
 for(const c of L.chimneys)add({shape:'box',x:c.x-.5,w:c.big?1.6:1,y:c.y,h:c.h,z:c.z,d:1,color:'#9a4a3a'},c.big?'mid':'near');
 for(const t of L.tanks){add({shape:'box',x:t.x,w:2.6,y:t.y+.9,h:2.6,z:t.z,d:2.6,color:'#9fb7d9'});add({shape:'box',x:t.x+.3,w:.3,y:t.y,h:.9,z:t.z,d:.3,color:TOKENS.pencil});add({shape:'box',x:t.x+2,w:.3,y:t.y,h:.9,z:t.z,d:.3,color:TOKENS.pencil});add({shape:'pyr',x:t.x,w:2.6,y:t.y+3.5,h:1.2,z:t.z,d:2.6,color:TOKENS.tomato});}
 for(const a of L.antennas){const lay=a.h>8?'mid':'near';add({shape:'box',x:a.x-.12,w:.24,y:a.y,h:a.h,z:a.z,d:.24,color:TOKENS.pencil},lay);add({shape:'box',x:a.x-1.2,w:2.4,y:a.y+a.h*.7,h:.16,z:a.z,d:.16,color:TOKENS.pencil},lay);}
 for(const l of L.laundry){add({shape:'box',x:l.x0,w:l.x1-l.x0,y:l.y,h:.06,z:l.z,d:.06,color:TOKENS.pencil});for(const it of l.items)add({shape:'box',x:it.x,w:it.w,y:l.y-it.h,h:it.h,z:l.z,d:.08,color:pick(P.cloth,it.x,3)});}
 for(const b of L.bunting){add({shape:'box',x:b.x0,w:b.x1-b.x0,y:b.y,h:.06,z:b.z,d:.06,color:TOKENS.pencil});b.items.forEach((it,i)=>add({shape:'flag',x:it.x-.55,w:1.1,y:b.y-1.2,h:1.2,z:b.z,d:.08,color:[TOKENS.tomato,'#f2b65a',TOKENS.teal,TOKENS.cream,'#7f9ed6'][i%5]}));}
 for(const s of L.stalls){add({shape:'box',x:s.x,w:s.w,y:0,h:1.1,z:s.z,d:s.d,color:TOKENS.card});for(const dx of [.1,s.w-.3])add({shape:'box',x:s.x+dx,w:.2,y:0,h:2.5,z:s.z+1.3,d:.2,color:TOKENS.pencil});
  for(let j=0;j<4;j++)add({shape:'box',x:s.x-.3+j*1.9,w:1.9,y:2.5,h:.45,z:s.z+.3,d:3.8,color:j%2?TOKENS.cream:pick([TOKENS.tomato,'#5aa6a0','#e98fa0','#f2b65a'],s.x,6)});}
 for(const p of L.pinwheels){add({shape:'box',x:p.x-.06,w:.12,y:0,h:p.y,z:p.z,d:.12,color:TOKENS.pencil});add({shape:'disc',x:p.x,y:p.y,r:.7,n:4,z:p.z+.1,d:.08,color:pick(D1.balloons,p.x,7)});}
 for(const p of L.people){add({shape:'box',x:p.x-.4,w:.8,y:p.y,h:1.3,z:p.z,d:.5,color:p.cloth?pick(P.cloth,p.x*5,1):P.cloth[0]});add({shape:'disc',x:p.x,y:p.y+1.65,r:.38,n:8,z:p.z,d:.5,color:pick(P.skin,p.x*7,2)});}
 for(const c of L.cars){const x=carX(c,0);add({shape:'box',x,w:c.len,y:.35,h:1.1,z:c.z,d:1.8,color:pick(D1.near,x,8)});add({shape:'box',x:x+.9,w:2.2,y:1.45,h:.8,z:c.z,d:1.6,color:TOKENS.cream});}
 add({shape:'box',x:TRACK.portal-12,w:22,y:0,h:9,z:TRACK.z,d:6,color:'#9cc3a6'});add({shape:'box',x:TRACK.portal-4,w:6,y:0,h:5.4,z:TRACK.z+3.2,d:.6,color:TOKENS.graphite});
 add({shape:'pyr',x:TRACK.portal-20,w:36,y:0,h:16,z:TRACK.z-6,d:8,color:'#a8c48a'});
 add({shape:'box',x:TRACK.portal-2,w:TRACK.end+300-TRACK.portal,y:0,h:.3,z:TRACK.z,d:3.2,color:TOKENS.kraftDark});
 add({shape:'box',x:1094,w:78,y:0,h:.8,z:-11.9,d:2.6,color:TOKENS.card});
 for(const b of L.balloons){add({shape:'disc',x:b.x,y:b.y,r:b.r,n:20,z:b.z,d:1,color:pick(D1.balloons,b.x,9)},'balloon');add({shape:'box',x:b.x-.9,w:1.8,y:b.y-b.r-2.4,h:1.4,z:b.z,d:1,color:TOKENS.kraftDark},'balloon');}
 for(const c of L.clouds)for(let k=0;k<3;k++){const r=c.sx*(k===1?.42:.3);add({shape:'disc',x:c.x+(k-1)*c.sx*.45,y:c.y+(k===1?c.sy*.6:0),r,n:24,z:c.z,d:2,color:D1.cloud},'cloud');}
 return {cards:out,clouds:L.clouds,balloons:L.balloons};
}

// ── Vrcholy karet: pozice, normála, barva (0–1 sRGB hex se převede ve three.js). Čelo karty míří na +z (ke kameře).
const quad=(o,a,b,c,d,n,col)=>{for(const v of [a,b,c,a,c,d]){o.p.push(...v);o.n.push(...n);o.c.push(col);}};
export function cardVertices(list){
 const o={p:[],n:[],c:[]};
 for(const b of list){const z0=b.z-b.d/2,z1=b.z+b.d/2;
  if(b.shape==='box'){const x0=b.x,x1=b.x+b.w,y0=b.y,y1=b.y+b.h,col=b.color;
   quad(o,[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1],col);quad(o,[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0],col);
   quad(o,[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0],col);quad(o,[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0],col);}
  else if(b.shape==='gable'){const x0=b.x,x1=b.x+b.w,xm=(x0+x1)/2,y0=b.y,y1=b.y+b.h,s=Math.hypot(b.h,b.w/2),nl=[-b.h/s,b.w/2/s,0],nr=[b.h/s,b.w/2/s,0];
   for(const v of [[x0,y0,z1],[x1,y0,z1],[xm,y1,z1]]){o.p.push(...v);o.n.push(0,0,1);o.c.push(b.color);}
   quad(o,[x0,y0,z1],[xm,y1,z1],[xm,y1,z0],[x0,y0,z0],nl,b.roof);quad(o,[xm,y1,z1],[x1,y0,z1],[x1,y0,z0],[xm,y1,z0],nr,b.roof);
   // okap: tenký pruh střechy na čele štítu (papír přeložený přes hranu)
   const t=.55;for(const [a,c2] of [[[x0,y0,z1+.05],[xm,y1,z1+.05]],[[xm,y1,z1+.05],[x1,y0,z1+.05]]]){const dx=c2[0]-a[0],dy=c2[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l*t,ny=dx/l*t;
    quad(o,a,c2,[c2[0]-nx,c2[1]-ny,c2[2]],[a[0]-nx,a[1]-ny,a[2]],[0,0,1],b.roof);}}
  else if(b.shape==='pyr'||b.shape==='flag'){const x0=b.x,x1=b.x+b.w,xm=(x0+x1)/2,flag=b.shape==='flag',ya=flag?b.y+b.h:b.y,yb=flag?b.y:b.y+b.h;
   const tri=flag?[[x0,ya,z1],[xm,yb,z1],[x1,ya,z1]]:[[x0,ya,z1],[x1,ya,z1],[xm,yb,z1]];for(const v of tri){o.p.push(...v);o.n.push(0,0,1);o.c.push(b.color);}
   if(!flag){const s=Math.hypot(b.h,b.w/2);quad(o,[x0,ya,z1],[xm,yb,z1],[xm,yb,z0],[x0,ya,z0],[-b.h/s,b.w/2/s,0],b.color);quad(o,[xm,yb,z1],[x1,ya,z1],[x1,ya,z0],[xm,yb,z0],[b.h/s,b.w/2/s,0],b.color);}}
  else if(b.shape==='disc'){const n=b.n??18,a0=b.n===4?0:Math.PI/2;for(let i=0;i<n;i++){const a=a0+i/n*Math.PI*2,c2=a0+(i+1)/n*Math.PI*2,P=t=>[b.x+Math.cos(t)*b.r,b.y+Math.sin(t)*b.r];
    const [ax,ay]=P(a),[bx,by]=P(c2);o.p.push(b.x,b.y,z1,ax,ay,z1,bx,by,z1);o.n.push(0,0,1,0,0,1,0,0,1);o.c.push(b.color,b.color,b.color);
    const nm=[Math.cos((a+c2)/2),Math.sin((a+c2)/2),0];quad(o,[ax,ay,z1],[ax,ay,z0],[bx,by,z0],[bx,by,z1],nm,b.color);}}}
 return o;
}

// ── Profil siluety vrstvy (skyline): výška h(x) sjednocení všech karet vrstvy, vzorek po `step` m, rozmazaný klouzavým průměrem
// přes `blur` m (měkké svislé hrany). Stín vrstvy = oblast pod profilem, posunutá podle shadowOffset a měkká i ve svislém směru.
export function skyline(list,x0,x1,{step=1,blur=4}={}){
 const n=Math.max(2,Math.ceil((x1-x0)/step)+1),h=new Float32Array(n);
 const at=x=>Math.round((x-x0)/step);
 for(const b of list){
  if(b.shape==='disc'){for(let i=Math.max(0,at(b.x-b.r));i<=Math.min(n-1,at(b.x+b.r));i++){const dx=x0+i*step-b.x,t=b.r*b.r-dx*dx;if(t>0)h[i]=Math.max(h[i],b.y+Math.sqrt(t));}continue;}
  const i0=Math.max(0,at(b.x)),i1=Math.min(n-1,at(b.x+b.w));
  for(let i=i0;i<=i1;i++){const x=x0+i*step;let top=b.y+b.h;
   if(b.shape==='gable'||b.shape==='pyr'){const u=1-Math.abs((x-(b.x+b.w/2))/(b.w/2));top=b.y+b.h*Math.max(0,u);}
   if(b.shape==='flag')continue;h[i]=Math.max(h[i],top);}}
 const r=Math.max(0,Math.round(blur/step/2)),out=new Float32Array(n);
 for(let i=0;i<n;i++){let s=0,c=0;for(let j=i-r;j<=i+r;j++)if(j>=0&&j<n){s+=h[j];c++;}out[i]=s/c;}
 return {x0,step,h:out};
}
// Pás stínu z profilu: sloupce (x_i … x_{i+1}) od spodku po vrchol + penumbru; atribut aH = výška profilu ve vrcholu.
export function skylineStrip(sk,{pen,z,bottom=-2}){
 const p=[],H=[];for(let i=0;i<sk.h.length-1;i++){const xa=sk.x0+i*sk.step,xb=xa+sk.step,ha=sk.h[i],hb=sk.h[i+1];if(ha<.05&&hb<.05)continue;const top=Math.max(ha,hb)+pen;
  for(const [x,y,hh] of [[xa,bottom,ha],[xb,bottom,hb],[xb,top,hb],[xa,bottom,ha],[xb,top,hb],[xa,top,ha]]){p.push(x,y,z);H.push(hh);}}
 return {position:p,h:H,triangles:p.length/9};
}
export const PLACE_W=SCREEN_METERS;

// ── Názvy (návrh, kap. 10 bible 05): varianty čtvrtí a 16 míst EN/CS. Prototyp ukazuje doporučenou variantu C.
export const NAMES={
 districts:{A:[['MORNING ROOFS','RANNÍ STŘECHY'],['NOON HARBOR','POLEDNÍ PŘÍSTAV'],['GOLDEN FIELDS','ZLATÁ POLE'],['EVENING CITY','VEČERNÍ MĚSTO']],
  B:[['PAPER SUBURBS','PAPÍROVÉ PŘEDMĚSTÍ'],['CARDBOARD DOCKS','KARTONOVÉ DOKY'],['KRAFT HILLS','KOPCE Z LEPENKY'],['TISSUE CITY','MĚSTO Z HEDVÁBNÉHO PAPÍRU']],
  C:[['SUNRISE ROOFS','STŘECHY ZA ÚSVITU'],['BRIGHT HARBOR','SLUNNÝ PŘÍSTAV'],['GOLDEN FIELDS','ZLATÁ POLE'],['LANTERN CITY','MĚSTO LAMPIONŮ']]},
 places:[['Workshop & First Roofs','Dílna a první střechy'],['Market under the Bunting','Trh pod praporky'],['Gardens at the Edge','Zahrady na okraji'],['Railway to the River','Železnice k řece']]};
