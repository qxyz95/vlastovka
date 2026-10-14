// Náčrty místa odhodu (art-director, 14. 10. 2026, research/start/02-misto-odhodu-vzhled.md). Bez závislostí:
//   node research/design/img/start/start.mjs  → dnes.png, koncept-1-terasa.png, koncept-2-podkrovi.png, koncept-3-vyhlidka.png, vyhled.png, zaber.png (stejná složka)
// Kamera je stejná jako ve hře (pose.project, geometry.follow + sideCamera: fov 20°, sklon 6°), město je skutečné rozložení místa 0–1
// (geometry.cityChunk) v papírovém stylu bible 05 (karty, řezaná hrana, boky, opar, nebe čtvrti 1). Je to NÁČRT kompozice a měřítka:
// bez stínů, vláken a život města jen naznačený. Vlaštovka se kreslí v obrazovce (bílá, grafitový obrys 2,6 px), jako jediná nakreslená věc.
import {writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {cityChunk,follow} from '../../../../src/render3d/geometry.js';
import {PAPIR,PAPER_TOKENS as T} from '../../../../src/render3d/palette.js';
const OUT=fileURLToPath(new URL('.',import.meta.url)),SS=3;
const D1=PAPIR.city.districts[0],WS=PAPIR.workshop;
// ── barvy
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),C=c=>typeof c==='string'?hex(c):c;
const CUT=hex('#fffaf0'),SIDE=hex('#5b4f7a'),GRAPH=hex(T.graphite);
// ── obrázek (sRGB float), polygony scanline, PNG
class Img{
 constructor(w,h){this.w=w;this.h=h;this.d=new Float32Array(w*h*3);}
 set(i,c,a){const d=this.d;d[i]+=(c[0]-d[i])*a;d[i+1]+=(c[1]-d[i+1])*a;d[i+2]+=(c[2]-d[i+2])*a;}
 poly(pts,c,a=1){c=C(c);let y0=Infinity,y1=-Infinity;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
  y0=Math.max(0,Math.floor(y0));y1=Math.min(this.h-1,Math.ceil(y1));const n=pts.length,xs=[];
  for(let y=y0;y<=y1;y++){const sy=y+.5;xs.length=0;
   for(let i=0;i<n;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%n];if((ay<=sy&&by>sy)||(by<=sy&&ay>sy))xs.push(ax+(sy-ay)/(by-ay)*(bx-ax));}
   xs.sort((p,q)=>p-q);
   for(let k=0;k+1<xs.length;k+=2){const a0=Math.max(0,Math.ceil(xs[k]-.5)),a1=Math.min(this.w-1,Math.floor(xs[k+1]-.5));for(let x=a0;x<=a1;x++)this.set((y*this.w+x)*3,c,a);}}}
 rect(x,y,w,h,c,a=1){this.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],c,a);}
 circle(cx,cy,r,c,a=1,n=40){const p=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;p.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r]);}this.poly(p,c,a);}
 line(x0,y0,x1,y1,w,c,a=1){const l=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/l*w/2,ny=(x1-x0)/l*w/2;this.poly([[x0+nx,y0+ny],[x1+nx,y1+ny],[x1-nx,y1-ny],[x0-nx,y0-ny]],c,a);}
 glow(cx,cy,r,c,a){c=C(c);for(let y=Math.max(0,Math.floor(cy-r));y<Math.min(this.h,cy+r);y++)for(let x=Math.max(0,Math.floor(cx-r));x<Math.min(this.w,cx+r);x++){const q=Math.hypot(x-cx,y-cy)/r;if(q<1)this.set((y*this.w+x)*3,c,a*(1-q)**2);}}
 down(s){const o=new Img(this.w/s|0,this.h/s|0);for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++)for(let k=0;k<3;k++){let v=0;for(let j=0;j<s;j++)for(let i=0;i<s;i++)v+=this.d[((y*s+j)*this.w+x*s+i)*3+k];o.d[(y*o.w+x)*3+k]=v/s/s;}return o;}
 blit(src,ox,oy){for(let y=0;y<src.h;y++)for(let x=0;x<src.w;x++){const X=ox+x,Y=oy+y;if(X<0||Y<0||X>=this.w||Y>=this.h)continue;for(let k=0;k<3;k++)this.d[(Y*this.w+X)*3+k]=src.d[(y*src.w+x)*3+k];}}
 grain(){for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){const n=Math.sin(x*12.9898+y*78.233)*43758.5453,f=1+.035*((n-Math.floor(n))-.5);for(let k=0;k<3;k++)this.d[(y*this.w+x)*3+k]*=f;}}
 png(file){const {w,h}=this,raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;for(let x=0;x<w*3;x++)raw[y*(w*3+1)+1+x]=Math.max(0,Math.min(255,Math.round(this.d[y*w*3+x]*255)));}
  const crcT=[...Array(256)].map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;}),crc=b=>{let c=~0;for(const v of b)c=crcT[(c^v)&255]^(c>>>8);return (~c)>>>0;};
  const chunk=(t,data)=>{const l=Buffer.alloc(4);l.writeUInt32BE(data.length);const td=Buffer.concat([Buffer.from(t),data]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
  writeFileSync(file,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));}
}
// ── písmo 5 × 7 (jen ASCII velká písmena, číslice a pár znaků; popisky bez diakritiky)
const G='A:0e11111f111111|B:1e11111e11111e|C:0e11101010110e|D:1e11111111111e|E:1f10101e10101f|F:1f10101e101010|G:0e111017111 10f|H:1111111f111111|I:0e04040404040e|J:0702020202120c|K:11121418141211|L:1010101010101f|M:111b1515111111|N:11111915131111|O:0e11111111110e|P:1e11111e101010|Q:0e11111115120d|R:1e11111e141211|S:0f10100e01011e|T:1f040404040404|U:1111111111110e|V:1111111111 0a04|W:1111111515150a|X:11110a040a1111|Y:11110a04040404|Z:1f01020408101f|0:0e11131519110e|1:040c040404040e|2:0e11010204081f|3:1f02040201110e|4:02060a121f0202|5:1f101e0101110e|6:0608101e11110e|7:1f010204080808|8:0e11110e11110e|9:0e11110f01020c|::000c0c000c0c00|.:00000000000c0c|,:000000000c0408|-:0000001f000000|/:01020204080810|(:02040808080402|):08040202020408|=:00001f001f0000|%:18190204081303|x:00110a040a1100|+:0004041f040400|>:08040201020408';
const FONT={};for(const e of G.split('|')){const ch=e[0],s=e.slice(2).replace(/ /g,'');FONT[ch]=s;}
const glyphRows=ch=>{const s=FONT[ch];if(!s)return null;const rows=[];let i=0;while(rows.length<7&&i<s.length){rows.push(parseInt(s.slice(i,i+2),16));i+=2;}return rows;};
function text(img,str,x,y,s,c){c=C(c);let cx=x;for(const ch of str.toUpperCase()){const r=glyphRows(ch);if(r)for(let j=0;j<7;j++)for(let i=0;i<5;i++)if((r[j]??0)&(16>>i))img.rect(cx+i*s,y+j*s,s,s,c);cx+=6*s;}return cx;}
const textW=(str,s)=>str.length*6*s;

// ── kamera hry: fov 20°, sklon 6°, výška záběru v hloubce z = 0
const TAN=Math.tan(10*Math.PI/180);
function camera({aspect,height,cx,cy,pitch=6}){const dist=height/2/TAN,up=dist*Math.tan(pitch*Math.PI/180);return {aspect,height,pitch,width:height*aspect,cx,cy,pos:[cx,cy+up,dist],tgt:[cx,cy,0],dist};}
function project(c,[x,y,z],W,H){const F0=c.tgt.map((v,i)=>v-c.pos[i]),l=Math.hypot(...F0),F=F0.map(v=>v/l),h=Math.hypot(F[0],F[2]),R=[-F[2]/h,0,F[0]/h];
 const U=[R[1]*F[2]-R[2]*F[1],R[2]*F[0]-R[0]*F[2],R[0]*F[1]-R[1]*F[0]],d=[x-c.pos[0],y-c.pos[1],z-c.pos[2]],dot=a=>a[0]*d[0]+a[1]*d[1]+a[2]*d[2],depth=dot(F);
 return [W/2+dot(R)/(depth*TAN*c.aspect)*W/2,H/2-dot(U)/(depth*TAN)*H/2,depth];}
// Kamera, která promítne bod P na zlomek obrazu (fx, fy) (jako pose.restCamera dorovnává HAND na 148, 258).
function anchored({aspect,height,P,fx,fy,pitch=6}){let c=camera({aspect,height,cx:P[0],cy:P[1],pitch});
 for(let i=0;i<6;i++){const [sx,sy]=project(c,P,1,1);c=camera({aspect,height,cx:c.cx+(sx-fx)*c.width,cy:c.cy+(fy-sy)*height,pitch});}return c;}
// Kamera letu = follow + sideCamera (frame.cameraFor), šířka width; vlaštovka v X, Y.
function flight({aspect,width,X,Y,px=148/640}){const v=follow(X,Y,{width,aspect,px});return camera({aspect,height:v.height,cx:v.cx,cy:v.cy});}

// ── scéna: plochy (karty) ve světě; opar podle bible 05 kap. 4
const HAZE_LO=hex('#f6e6d2'),HAZE_HI=hex('#cfe2ec');
const hazeOf=(z,y)=>.72*Math.min(1,Math.max(0,(-z-20)/680))**.8,hazeCol=y=>mix(HAZE_LO,HAZE_HI,Math.min(1,Math.max(0,y/160)));
class Scene{
 constructor(){this.f=[];}
 face(pts,color,o={}){this.f.push({pts,color:C(color),a:o.a??1,z:o.z??pts[0][2],y:o.y??pts.reduce((s,p)=>s+p[1],0)/pts.length,bias:o.bias??0,haze:o.haze??true});}
 panel(x,y,w,h,z,c,o){this.face([[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],c,o);}
 poly(pts,z,c,o){this.face(pts.map(([x,y])=>[x,y,z]),c,o);}
 disc(cx,cy,r,z,c,o,n=18){const p=[];for(let i=0;i<n;i++){const t=i/n*Math.PI*2;p.push([cx+Math.cos(t)*r,cy+Math.sin(t)*r]);}this.poly(p,z,c,o);}
 bar([x0,y0],[x1,y1],w,z,c,o){const l=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/l*w/2,ny=(x1-x0)/l*w/2;this.poly([[x0+nx,y0+ny],[x1+nx,y1+ny],[x1-nx,y1-ny],[x0-nx,y0-ny]],z,c,o);}
 // Karta (bible 05 kap. 3): čelo, horní řez světlý, boky do fialova. zf = přední hrana, d hloubka.
 box(x,y,w,h,zf,d,c,o={}){c=C(c);const zb=zf-d;
  this.face([[x,y,zb],[x,y,zf],[x,y+h,zf],[x,y+h,zb]],mix(c,SIDE,.3),{...o,z:zf,bias:.3});this.face([[x+w,y,zf],[x+w,y,zb],[x+w,y+h,zb],[x+w,y+h,zf]],mix(c,SIDE,.22),{...o,z:zf,bias:.3});
  this.face([[x,y+h,zf],[x+w,y+h,zf],[x+w,y+h,zb],[x,y+h,zb]],mix(c,CUT,.55),{...o,z:zf,bias:d+.5});this.panel(x,y,w,h,zf,c,{...o,z:zf});}
 // Sedlová střecha se štítem ke kameře: štít v barvě stěny, dvě plochy střechy, světlý řez na hraně.
 gable(x,w,y,h,zf,d,wall,roof,o={},ov=.5){roof=C(roof);const zb=zf-d,m=x+w/2,s=h/(w/2),e=y-ov*s;
  this.face([[x-ov,e,zf+.15],[m,y+h,zf+.15],[m,y+h,zb],[x-ov,e,zb]],mix(roof,SIDE,.12),{...o,z:zf,bias:.25});
  this.face([[m,y+h,zf+.15],[x+w+ov,e,zf+.15],[x+w+ov,e,zb],[m,y+h,zb]],mix(roof,CUT,.1),{...o,z:zf,bias:.25});
  this.poly([[x,y],[x+w,y],[m,y+h]],zf,wall,o);const t=Math.max(.25,h*.05);
  this.poly([[x-ov,e],[m,y+h],[m,y+h+t],[x-ov,e+t]],zf+.16,mix(roof,CUT,.55),{...o,bias:-.05});this.poly([[m,y+h],[x+w+ov,e],[x+w+ov,e+t],[m,y+h+t]],zf+.16,mix(roof,CUT,.55),{...o,bias:-.05});}
 win(cx,y,zf,wall,o,w=1.2,h=1.4){const fr=mix(C(wall),CUT,.5);this.panel(cx-w/2-.12,y-.12,w+.24,h+.24,zf+.02,fr,o);this.panel(cx-w/2,y,w,h,zf+.04,mix(C(wall),hex('#3d4f7a'),.6),o);}
 render(cam,W,H){const items=this.f.map(f=>{const p=f.pts.map(v=>project(cam,v,W,H));return {f,p,depth:cam.pos[2]-f.z+f.bias};}).filter(i=>i.p.every(q=>q[2]>.1));
  items.sort((a,b)=>b.depth-a.depth);return items;}
}
// ── město: místa 0 a 1 z cityChunk (karta 4 / 6 / 12 m, přední hrana jako v kódu, dálka × 0,42)
let MID_CAP=true;// pás výhledu: střed (vrstva −110 m) do 150 m od startu nejvýš 13 m, aby za dítětem bylo nebe a slunce
function city(S,{skipNear=()=>false}={}){
 for(const ci of [0,1]){const c=cityChunk(ci),off=ci*304.762;let k=0;
  for(const b of c.blocks){if(b.shop)continue;const x=b.x+off,front=b.z+b.d/2,lay=b.z>-60?'near':b.z>-200?'mid':'far';k++;
   if(lay==='near'&&skipNear(x,b.w))continue;
   const col=lay==='near'?D1.near[k%8]:lay==='mid'?D1.mid[k%6]:D1.far[k%3],h=lay==='far'?b.h*.42:lay==='mid'&&MID_CAP&&x<150?Math.min(b.h,13):b.h,d=lay==='near'?4:lay==='mid'?6:12,roof=D1.roof[k%4];
   S.box(x,0,b.w,h,front,d,col);
   const gab=lay==='near'?k%10<7:lay==='mid'?k%20<7:k%5<2;if(gab)S.gable(x,b.w,h,Math.min(7,b.w*.45),front,d,col,roof);
   else S.panel(x-.3,h,b.w+.6,.5,front+.05,mix(C(col),CUT,.4));
   if(lay!=='far'){const floors=Math.floor(h/3),bays=Math.max(1,Math.round((b.w-1.4)/2.4));
    for(let f=lay==='near'?1:1;f<floors;f+=lay==='mid'?2:1)for(let i=0;i<bays;i+=lay==='mid'?2:1)S.win(x+.7+2.4*i+1.2,f*3+.9,front,col);
    if(lay==='near')S.panel(x+b.w*.5-.55,0,1.1,2.2,front+.03,hex('#3d4f7a'));}
   if(lay==='near'&&k%3===0)S.box(x+b.w*.7,h+(gab?1:0),.8,2.2,front-1,.8,PAPIR.life.chimney);}
 }
 // zeleň ve středu, kopce v dálce, zem ve třech pásech, mraky a balón
 for(let i=0;i<14;i++){const x=10+i*37%600,z=-100-(i%3)*4;S.box(x-.2,0,.4,4,z,.4,D1.trunk);S.disc(x,6,3.2,z+.3,D1.trees[i%4]);}
 S.poly([[-200,0],[-200,40],[40,62],[160,48],[300,70],[460,52],[700,58],[700,0]],-460,D1.hills[0]);S.poly([[-200,0],[-200,30],[90,36],[240,44],[420,33],[700,40],[700,0]],-430,D1.hills[1]);
}
function ground(S){const g=D1.ground;for(const [z0,z1,c] of [[60,-40,g.near],[-40,-160,g.mid],[-160,-900,g.far]])S.face([[-300,0,z0],[900,0,z0],[900,0,z1],[-300,0,z1]],c,{z:z1*.5+z0*.5,bias:1e5});}
function sky(S){for(const [x,y,s] of [[40,150,1],[220,190,1.3],[380,140,.9],[560,170,1.2]]){for(const [dx,dy,r] of [[0,0,9],[10,3,11],[21,0,8]])S.disc(x+dx*s,y+dy*s,r*s,-600,'#fffaf0',{haze:false,a:.95});}
 S.disc(150,95,4,-300,PAPIR.life.balloons[0]);S.panel(149.2,88,1.6,1.6,-300,PAPIR.life.basket);}
// ── dítě ve skutečném měřítku (11 karta 7: člověk 1,7 m × 0,7 ≈ 1,2 m): nohy, pláštěnka, hlava, novinová čepice (krémová, ne bílá)
const KIDC={legs:'#3d4f7a',coat:WS.shirt,skin:WS.skin,hair:T.pencil700,cap:T.card,capBand:T.tomato};
function kid(S,fx,fy,z,hand,{wave=false}={}){const o={haze:false};
 S.panel(fx-.14,fy,.11,.46,z,KIDC.legs,o);S.panel(fx+.03,fy,.11,.46,z,KIDC.legs,o);S.panel(fx-.17,fy,.16,.06,z+.01,T.pencil700,o);S.panel(fx+.02,fy,.17,.06,z+.01,T.pencil700,o);
 S.poly([[fx-.26,fy+.4],[fx+.26,fy+.4],[fx+.17,fy+.9],[fx-.17,fy+.9]],z+.02,KIDC.coat,o);
 S.bar([fx-.06,fy+.84],[fx-.22,fy+.5],.1,z-.02,mix(hex(KIDC.coat),SIDE,.2),o);
 S.disc(fx-.03,fy+1.05,.155,z+.02,KIDC.hair,o);S.disc(fx+.02,fy+1.04,.145,z+.03,KIDC.skin,o);S.disc(fx+.1,fy+1.05,.018,z+.04,T.pencil700,o,8);
 S.poly([[fx-.19,fy+1.11],[fx+.18,fy+1.11],[fx,fy+1.36]],z+.05,KIDC.cap,o);S.panel(fx-.19,fy+1.09,.37,.05,z+.06,KIDC.capBand,o);
 const sh=[fx+.06,fy+.84],hd=wave?[fx+.25,fy+1.45]:hand;S.bar(sh,hd,.1,z+.07,mix(hex(KIDC.coat),SIDE,.12),o);S.disc(hd[0],hd[1],.055,z+.08,KIDC.skin,o,10);}
// ── vlaštovka v obrazovce: bílá výplň, spodní plocha #cdd3e3, obrys grafit 2,6 px razítkem (8 směrů), přehyb tužkou
function plane(img,x,y,len,ang,s){const P=(px,py)=>{const c=Math.cos(ang),q=Math.sin(ang);return [x+(px*c-py*q)*len,y-(px*q+py*c)*len];};
 const wing=[P(.55,0),P(-.45,.24),P(-.36,.03)],keel=[P(.55,0),P(-.42,-.13),P(-.4,0)],ow=2.6*s;
 for(let i=0;i<8;i++){const t=i/8*Math.PI*2,dx=Math.cos(t)*ow,dy=Math.sin(t)*ow;img.poly(wing.map(([a,b])=>[a+dx,b+dy]),GRAPH);img.poly(keel.map(([a,b])=>[a+dx,b+dy]),GRAPH);}
 img.poly(keel,PAPIR.plane.under);img.poly(wing,PAPIR.plane.fill);const [a,b]=P(.55,0),[c,d]=P(-.38,.02);img.line(a,b,c,d,1*s,T.pencil);}
function dashes(img,pts,s,c=GRAPH,a=.85,dash=10,gap=6,w=2.2){let acc=0,on=true;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i],l=Math.hypot(x1-x0,y1-y0);if(on)img.line(x0,y0,x1,y1,w*s,c,a);acc+=l;if(acc>(on?dash:gap)*s){acc=0;on=!on;}}}
// ── vykreslení jednoho záběru
function shot(build,{W,H,cam,planeAt=null,planeLen=null,planeAng=.26,trail=null,aim=false,ui=null,sun=[.8,.2]}){
 const w=W*SS,h=H*SS,img=new Img(w,h),S=new Scene();build(S);ground(S);
 const stops=[[0,'#78b4dc'],[.42,'#a6d0e8'],[.74,'#d8e9ea'],[.9,'#fce4c6'],[1,'#fce4c6']].map(([t,c])=>[t,hex(c)]);
 for(let y=0;y<h;y++){const t=y/h;let k=0;while(k<stops.length-2&&t>stops[k+1][0])k++;const [t0,c0]=stops[k],[t1,c1]=stops[k+1],c=mix(c0,c1,Math.min(1,(t-t0)/(t1-t0)));for(let x=0;x<w;x++){const i=(y*w+x)*3;img.d[i]=c[0];img.d[i+1]=c[1];img.d[i+2]=c[2];}}
 const sr=.045*Math.min(w,h)*1.4;img.glow(sun[0]*w,sun[1]*h,sr*9,'#ffd9a8',.55);img.circle(sun[0]*w,sun[1]*h,sr*1.15,'#fffaf0',.9);img.circle(sun[0]*w,sun[1]*h,sr,'#fff8e8');
 for(const it of S.render(cam,w,h)){const {f,p}=it;let c=f.color;if(f.haze)c=mix(c,hazeCol(f.y),hazeOf(f.z,f.y));img.poly(p.map(q=>[q[0],q[1]]),c,f.a);}
 const pr=v=>project(cam,v,w,h);
 if(trail){const pts=trail.map(v=>pr(v));dashes(img,pts,SS);}
 if(aim){const [hx,hy]=pr(aim.from);for(let i=1;i<=9;i++){const t=i/9,X=aim.from[0]+aim.dx*t,Y=aim.from[1]+aim.dy*t-aim.drop*t*t,[sx,sy]=pr([X,Y,0]);img.circle(sx,sy,(3.2-1.6*t)*SS,GRAPH,.75*(1-t*.6));}}
 if(planeAt){const [sx,sy]=pr(planeAt),[ax]=pr([planeAt[0]+planeLen,planeAt[1],0]);plane(img,sx,sy,ax-sx,planeAng,SS);}
 img.grain();const out=img.down(SS);if(ui)ui(out,W,H);return out;}
// ── UI náznak (07-menu): krémové karty, rajčatové hlavní tlačítko, mince vpravo nahoře; jen rozložení, ne finální vzhled
const card=(img,x,y,w,h,c=T.cream)=>{img.rect(x+2,y+3,w,h,hex('#3b3560'),.18);img.rect(x,y,w,h,c);};
function menuUI(img,W,H){const s=W>=500?2:1,portrait=H>W;
 card(img,W-(portrait?70:96),10,portrait?60:84,portrait?20:24);img.circle(W-(portrait?60:82),portrait?20:22,portrait?5:6,T.mustard);text(img,'1240',W-(portrait?51:72),portrait?17:18,1,T.graphite);
 const bx=portrait?16:Math.round(W*.06),bw=portrait?W-32:Math.round(W*.27),ty=portrait?40:Math.round(H*.18);
 text(img,'JUST',bx,ty,portrait?4:4,T.graphite);text(img,'THROW IT',bx,ty+(portrait?34:34),portrait?4:4,T.graphite);
 let y=portrait?H-4*(26+6)-14:Math.round(H*.44);const labels=['THROW','WORKSHOP','ATLAS','SETTINGS'];
 labels.forEach((l,i)=>{const bh=i?(portrait?24:24):(portrait?30:30);card(img,bx,y,bw,bh,i?T.cream:T.tomato600);if(!i)img.rect(bx,y+bh-3,bw,3,T.tomatoDark);text(img,l,bx+10,y+(bh-7)/2|0,1,i?T.graphite:T.cream);y+=bh+6;});}
function aimUI(img,W,H){const portrait=H>W;card(img,W-(portrait?58:70),10,portrait?48:58,22);text(img,'0 M',W-(portrait?50:60),17,1,T.graphite);
 card(img,W-(portrait?56:96),H-(portrait?62:46),portrait?44:84,portrait?44:34,T.tomato600);text(img,'HOLD',W-(portrait?50:80),H-(portrait?44:33),1,T.cream);
 card(img,10,H-(portrait?62:46),portrait?44:60,portrait?44:34);text(img,'15',portrait?25:30,H-(portrait?44:33),1,T.graphite);}
function flyUI(img,W,H){const portrait=H>W;card(img,W-(portrait?62:76),10,portrait?52:64,22);text(img,'38 M',W-(portrait?54:68),17,1,T.graphite);}

// ── koncepty. HAND zůstává jako ve hře (pose.HAND: x 70,5 m, y 16 m), fyzika i město se nemění; podlaha pod dítětem = HAND.y − 1,4 m.
// Ruka ve 12 m = výška výhozu fyziky (core.js y0, 01-zacatek-a-kamera §1.5); dnešní HAND je 16 m (jen záběr Dnes).
const HX=148/2.1,HY=12,FL=HY-1.4,HAND=[HX,HY,0],HY0=16,HAND0=[HX,HY0,0];
const navy=hex('#3d4f7a'),cream=hex(WS.wall),tom=hex(T.tomato),teal=hex(WS.annex),warm=hex(WS.window),kraft=hex(T.kraftDark);
// A: Dílna je kůlna na střešní terase starého domu (přízemí 3,5 + 3 patra × 3,7 m), dítě stojí na bedně u zábradlí.
function conceptA(S,{menu=false}={}){city(S,{skipNear:x=>x>50&&x<75});const x0=57,x1=72.6,zf=1.2;
 S.box(x0,0,x1-x0,FL-.3,zf,9,cream);S.panel(x0-.3,FL-.6,x1-x0+.6,.6,zf+.1,mix(cream,CUT,.5));S.box(x0-.1,FL-.3,x1-x0+.2,.3,zf+.05,9.1,mix(cream,SIDE,.08));
 S.panel(x0+1,0,x1-x0-2,.6,zf+.03,mix(cream,SIDE,.12));
 for(let f=0;f<2;f++)for(let i=0;i<5;i++)S.win(x0+1.6+i*2.95,3.5+f*3.55+.9,zf,cream);
 S.panel(x0+2,0,1.1,2.2,zf+.04,navy);S.panel(x0+1.8,2.2,1.5,.12,zf+.08,tom);S.panel(x0+4,.9,6,2.2,zf+.03,hex(T.graphite),{a:0});S.win(x0+6,.9,zf,cream,4.5,1.9);
 S.panel(x1-1.6,1,.45,.55,zf+.2,tom);
 // kůlna Dílny na terase: tyrkysová, krémová lišta, rajčatová pultová střecha, teplé okno se stolem, cedulka PAPER LAB, dveře
 const sx=x0+.8,sw=6.2,sz=-1.2;S.box(sx,FL,sw,2.5,sz,3.6,teal);S.poly([[sx-.3,FL+2.4],[sx+sw+.3,FL+2.4],[sx+sw+.3,FL+2.8],[sx-.3,FL+3.3]],sz+.12,tom);
 S.panel(sx+.4,FL+.9,2.8,1.3,sz+.03,mix(teal,CUT,.5));S.panel(sx+.5,FL+1,2.6,1.1,sz+.05,warm);S.panel(sx+.6,FL+1.25,2.4,.1,sz+.06,kraft);S.disc(sx+1.1,FL+1.5,.12,sz+.07,'#13807d',{},8);
 S.panel(sx+4,FL,.9,2,sz+.04,navy);S.panel(sx+3.75,FL+2.1,1.4,.32,sz+.1,T.card);S.panel(sx+4,FL+2.14,.9,.04,sz+.11,tom);
 // komín s obláčkem, květináče, šňůra s papíry
 S.box(66.2,FL,.7,1.8,-2.5,.7,PAPIR.life.chimney);if(!menu)for(const [dx,dy,r] of [[.3,2.3,.25],[.1,2.8,.32],[.5,3.4,.38]])S.disc(66.5+dx,FL+dy,r,-2.4,'#fffaf0',{a:.55});
 for(const [x,c] of [[64.6,tom],[65.3,kraft],[67.6,tom]]){S.box(x,FL,.4,.35,.6,.4,c);S.disc(x+.2,FL+.6,.3,.65,D1.trees[(x*3|0)%4]);}
 S.bar([sx+sw,FL+1.9],[66.2,FL+1.7],.03,-.6,T.pencil);[[D1.near[4],0],[D1.near[1],.55],[D1.near[5],1.1]].forEach(([c,dx])=>S.panel(sx+sw+.3+dx,FL+1.4,.38,.42,-.55,c));
 // bedna pod dítětem, zábradlí tmavomodré (ne grafit), dítě
 S.box(HX-.62,FL,.62,.3,.25,.5,kraft);if(menu)S.box(HX-.4,FL+.3,.2,.04,.4,.2,T.paper);
 for(let x=x0+.3;x<x1;x+=.55)S.panel(x,FL,.05,.95,zf-.1,navy);S.panel(x0+.2,FL+.9,x1-x0-.4,.07,zf-.08,navy);
 kid(S,HX-.32,FL+.3,.1,[HX,HY],{wave:menu});}
// B: podkrovní dílna v řezu (domeček pro panenky) na opěrné zdi nad ulicí; dítě na pavlači u půdních dveří, nad ním trám s kladkou.
function conceptB(S,{menu=false}={}){city(S,{skipNear:x=>x>44&&x<75});const wall=1.1,x0=55.5,x1=67.5,zf=1.2,ak=2.3,ar=4.6,stone=hex('#d9bf98');
 S.box(44,0,31,wall,zf+3,12,stone);for(let i=0;i<11;i++)S.panel(44.6+i*2.8,.5+(i%2)*.7,1.6,.06,zf+3.02,mix(stone,SIDE,.2));
 for(let i=0;i<7;i++)S.box(72.6+i*.35,0,.35,wall-i*.3,zf+4.5,1.5,mix(stone,CUT,.2));
 S.box(x0,wall,x1-x0,FL-wall,zf,8,cream);S.panel(x0-.2,wall,x1-x0+.4,.5,zf+.05,mix(cream,SIDE,.12));
 S.panel(x0+1.2,wall,1.1,2.2,zf+.04,navy);S.panel(x0+1,wall+2.2,1.5,.12,zf+.08,tom);S.win(x0+4.6,wall+.8,zf,cream,3.4,1.9);S.panel(x1-1.4,wall+1,.45,.55,zf+.2,tom);
 for(let f=0;f<2;f++)for(let i=0;i<4;i++)S.win(x0+1.6+i*2.95,wall+3.5+f*3+.9,zf,cream);
 S.panel(x0+3.2,FL-1.05,5.6,.8,zf+.12,T.card);S.panel(x0+4.6,FL-1,2.8,.06,zf+.13,tom);
 // podkroví: zadní stěna, podlaha, nadezdívka a střecha v řezu (rajčatová s krémovým jádrem řezu)
 const zb=-5;S.panel(x0,FL,x1-x0,ak,zb,mix(hex(T.card),SIDE,.06));S.poly([[x0,FL+ak],[x1,FL+ak],[(x0+x1)/2,FL+ak+ar]],zb,mix(hex(T.card),SIDE,.12));
 S.face([[x0,FL,zf],[x1,FL,zf],[x1,FL,zb],[x0,FL,zb]],mix(kraft,CUT,.35),{bias:.2});
 // interiér: stůl, lampa, stoh papírů, police s rolemi, nástěnka s pohlednicemi, hotové vlaštovky na provázku
 S.box(x0+.8,FL,3.4,.8,-1.2,1.4,kraft);S.panel(x0+1.2,FL+.8,1.3,.08,-1.15,'#fbf6ec');S.bar([x0+3.6,FL+.8],[x0+3.3,FL+1.6],.06,-1.1,'#13807d');S.poly([[x0+3.05,FL+1.5],[x0+3.55,FL+1.7],[x0+3.3,FL+1.35]],-1.1,'#13807d');
 [[D1.near[4],0],[D1.near[1],.18],[D1.near[5],.36]].forEach(([c,dy])=>S.panel(x0+2.6,FL+.8+dy,.9,.16,-1.14,c));
 S.panel(x0+.6,FL+1.7,3,.1,zb+.1,kraft);[0,1,2,3,4].forEach(i=>S.disc(x0+.9+i*.55,FL+1.95,.17,zb+.12,PAPIR.life.pastel[i],{},10));
 S.panel(x0+4.6,FL+.9,2.6,1.6,zb+.05,hex(T.kraft));[[.2,.9,D1.near[0]],[1.0,.95,D1.near[2]],[1.7,.85,D1.near[5]],[.6,.25,D1.near[6]],[1.4,.2,D1.near[1]]].forEach(([dx,dy,c])=>{S.panel(x0+4.6+dx,FL+.9+dy,.65,.5,zb+.07,T.cream);S.panel(x0+4.65+dx,FL+.97+dy,.55,.32,zb+.08,c);});
 S.bar([x0+.5,FL+3.2],[x1-1,FL+3.1],.025,-2,T.pencil);[[D1.near[1],2],[D1.near[2],4],[hex(T.kraft),6.5]].forEach(([c,dx])=>S.poly([[x0+dx,FL+3.15],[x0+dx+.5,FL+3],[x0+dx+.1,FL+2.85]],-1.95,c));
 // řez: nadezdívka (krémová stěna, světlá hrana) a střecha
 const t=.32;S.panel(x0-.2,FL,.45,ak,zf+.05,cream);S.panel(x0-.2,FL,.06,ak,zf+.06,CUT);
 S.panel(x1-.25,FL+1.95,.45,ak-1.95,zf+.05,cream);
 S.poly([[x0-.7,FL+ak-.2],[(x0+x1)/2,FL+ak+ar],[(x0+x1)/2,FL+ak+ar+t*1.4],[x0-.7,FL+ak-.2+t*1.4]],zf+.1,tom);S.poly([[(x0+x1)/2,FL+ak+ar],[x1+.7,FL+ak-.2],[x1+.7,FL+ak-.2+t*1.4],[(x0+x1)/2,FL+ak+ar+t*1.4]],zf+.1,tom);
 S.poly([[x0-.7,FL+ak-.2],[(x0+x1)/2,FL+ak+ar],[(x0+x1)/2,FL+ak+ar+.08],[x0-.7,FL+ak-.12]],zf+.12,CUT);S.poly([[(x0+x1)/2,FL+ak+ar],[x1+.7,FL+ak-.2],[x1+.7,FL+ak-.12],[(x0+x1)/2,FL+ak+ar+.08]],zf+.12,CUT);
 S.face([[x0-.7,FL+ak-.2+t*1.4,zf+.1],[(x0+x1)/2,FL+ak+ar+t*1.4,zf+.1],[(x0+x1)/2,FL+ak+ar+t*1.4,zb-1],[x0-.7,FL+ak-.2+t*1.4,zb-1]],mix(tom,SIDE,.12),{bias:.25});
 S.face([[(x0+x1)/2,FL+ak+ar+t*1.4,zf+.1],[x1+.7,FL+ak-.2+t*1.4,zf+.1],[x1+.7,FL+ak-.2+t*1.4,zb-1],[(x0+x1)/2,FL+ak+ar+t*1.4,zb-1]],mix(tom,CUT,.1),{bias:.25});
 // pavlač s půdními dveřmi: deska, konzoly, tmavomodré zábradlí, otevřené křídlo dveří, trám s kladkou a košíkem papírů
 const bx1=71.6;S.box(x1,FL-.2,bx1-x1,.2,zf-.2,2.4,kraft);S.bar([x1,FL-1.4],[x1+1.6,FL-.2],.15,zf-.3,kraft);
 for(let x=x1+.3;x<bx1;x+=.5)S.panel(x,FL,.05,.95,zf-.3,navy);S.panel(x1+.2,FL+.9,bx1-x1-.2,.07,zf-.28,navy);
 S.panel(x1-.1,FL,.95,2.05,zf+.3,navy);S.panel(x1-.02,FL+.08,.79,1.89,zf+.31,mix(navy,CUT,.15));S.disc(x1+.65,FL+1,.05,zf+.32,WS.knob,{},8);
 S.box((x0+x1)/2,FL+ak+ar-1.1,9,.3,zf-1,.3,kraft);S.disc((x0+x1)/2+8.7,FL+ak+ar-1.2,.22,zf-.7,T.pencil,{},12);S.bar([(x0+x1)/2+8.92,FL+ak+ar-1.2],[(x0+x1)/2+8.92,FL+3.3],.03,zf-.7,T.pencil);
 S.box((x0+x1)/2+8.6,FL+2.9,.65,.45,zf-.65,.5,hex(T.kraft));
 kid(S,HX-.32,FL,.1,[HX,HY],{wave:menu});}
// C: vyhlídka na kopci nad městem; Dílna je chaloupka na hřebeni, dítě na dřevěné vyhlídce s dalekohledem.
function conceptC(S,{menu=false}={}){city(S,{skipNear:x=>x<78});const crest=FL-.3,grass=hex(D1.trees[2]),grass2=hex(D1.trees[3]);
 S.poly([[-60,0],[-60,crest+3],[10,crest+3.6],[40,crest+1.8],[64,crest+.6],[92,crest-2],[120,0]],-9,mix(grass2,SIDE,.08));
 const hill=[[-60,0],[-60,crest-1],[20,crest-.4],[42,crest],[73,crest],[80,crest-1.6],[88,crest-6],[96,crest-11],[104,0]];
 S.face(hill.slice(1,-1).flatMap(()=>[]).concat([[-60,crest-1,2],[20,crest-.4,2],[42,crest,2],[73,crest,2],[73,crest,-7],[42,crest,-7],[20,crest-.4,-7],[-60,crest-1,-7]]),mix(grass,CUT,.25),{bias:.3});
 S.poly(hill,2,grass);for(let x=-60;x<103;x+=.9){const y=x<20?crest-1+(x+60)/80*.6:x<42?crest-.4+(x-20)/22*.4:x<73?crest:x<80?crest-(x-73)/7*1.6:x<88?crest-1.6-(x-80)/8*4.4:x<96?crest-6-(x-88)/8*5:crest-11-(x-96)/8*(crest-11);S.poly([[x,y-.05],[x+.9,y-.05],[x+.45,y+.35]],2.05,mix(grass,CUT,.18));}
 for(let i=0;i<9;i++)S.box(74+i*2.6,crest-1.3-i*1.55,2.6,.4,2.6,1.6,mix(kraft,CUT,.3));
 // chaloupka Dílny: krémová, rajčatový štít, dílenské okno se stolem, dveře, cedulka na provázcích, kolo, schránka
 const cx=45,cw=10,cz=-1.5,ch=3.4;S.box(cx,crest,cw,ch,cz,5,cream);S.gable(cx,cw,crest+ch,3,cz,5,cream,tom);
 S.panel(cx+.8,crest+.9,4.6,1.9,cz+.03,navy);S.panel(cx+.95,crest+1.05,4.3,1.6,cz+.05,warm);S.panel(cx+1.1,crest+1.5,4,.12,cz+.06,kraft);S.poly([[cx+2.2,crest+1.62],[cx+3.1,crest+1.7],[cx+2.4,crest+1.85]],cz+.07,'#ffffff');
 S.panel(cx+6.8,crest,1.1,2.2,cz+.04,navy);S.panel(cx+3.2,crest+ch+.35,3.6,.75,cz+.2,T.card);S.panel(cx+4,crest+ch+.42,2,.06,cz+.21,tom);
 S.bar([cx+3.6,crest+ch+1.1],[cx+3.9,crest+ch+1.9],.03,cz+.19,T.pencil);S.bar([cx+6.4,crest+ch+1.1],[cx+6.1,crest+ch+1.9],.03,cz+.19,T.pencil);
 S.box(cx+cw*.75,crest+ch+1.2,.6,1.6,cz-1.5,.6,PAPIR.life.chimney);if(!menu)S.disc(cx+cw*.75+.4,crest+ch+3.4,.4,cz-1.4,'#fffaf0',{a:.5});
 S.disc(cx+9.4,crest+.35,.35,cz+.5,T.pencil700,{},10);S.disc(cx+10.6,crest+.35,.35,cz+.5,T.pencil700,{},10);S.poly([[cx+9.4,crest+.35],[cx+10.1,crest+.4],[cx+9.8,crest+1.05]],cz+.52,D1.near[2]);
 S.box(57.5,crest,.12,1.1,0,.12,kraft);S.box(57.3,crest+1.1,.5,.45,0,.4,tom);
 // strom za chaloupkou, lavička
 S.box(39.2,crest,.5,3.6,-4,.5,D1.trunk);S.disc(39.45,crest+5,2.8,-3.6,D1.trees[0]);S.disc(41.2,crest+4.1,2,-3.5,D1.trees[1]);
 S.box(60,crest,2,.45,-.6,.5,kraft);S.panel(60,crest+.45,2,.5,-1.05,mix(kraft,CUT,.2));
 // vyhlídka: dřevěná podlaha, zábradlí, dalekohled na sloupku (tyrkys)
 S.box(64,crest,8.3,.3,1.3,3,mix(kraft,CUT,.2));for(let x=64.3;x<72.3;x+=.6)S.panel(x,FL,.06,.95,1.2,kraft);S.panel(64.1,FL+.9,8.1,.08,1.22,kraft);
 S.box(67.2,FL,.12,1.05,.3,.12,T.pencil700);S.poly([[66.85,FL+1.05],[67.75,FL+1.25],[67.75,FL+1.5],[66.85,FL+1.4]],.35,'#13807d');
 for(let i=0;i<14;i++){const x=10+i*4.7;S.disc(x,crest-.6-(i%3)*.1,.12,2.1,i%2?'#fffaf0':D1.near[1],{},8);}
 kid(S,HX-.32,FL,.1,[HX,HY],{wave:menu});}
// Dnes: Dílna P3 (workshop.js workshopCards): dům x 20–44 m, 24 × 12 m + štít 8 m, přístavek do 7,25 m, dítě 47 px × 0,25 = 11,75 m.
function today(S){city(S);const HY=HY0,front=-5,top=HY-35*.25,cream_=cream;S.box(20,0,24,12,front,6,cream_);S.gable(20,24,12,8,front,6,cream_,tom,{},.8);
 S.panel(22.4,1.4,12.2,5.6,front+.05,hex(T.graphite));S.panel(22.8,1.8,11.4,4.8,front+.12,warm);S.panel(37.4,0,4.2,6,front+.1,navy);
 S.panel(26,10.2,12,2.4,front+.3,T.card);const ax=44,aw=HX+7-ax;
 S.box(ax,0,aw,top-.5,-1,6,teal);S.box(ax-.3,top-.5,aw+.6,.5,-.7,6.6,cream);S.panel(ax+3,1.4,11,3.8,-.95,warm);S.panel(ax+aw-7,0,4,5,-.9,navy);
 for(let i=0;i<6;i++)S.panel(ax+1+i*(aw-2.4)/5,top,.35,1.4,-1.4,T.graphite);S.panel(ax+1,top+1.4,aw-2,.3,-1.4,T.graphite);
 const k=.25,kx=HX-24*k,ky=top,z=0,o={haze:false};S.panel(kx+1*k,ky,5*k,10*k,z,WS.legs,o);S.panel(kx+11*k,ky,5*k,10*k,z,WS.legs,o);S.panel(kx,ky+10*k,16*k,20*k,z,WS.shirt,o);
 S.panel(kx+3*k,ky+30*k,10*k,10*k,z,WS.skin,o);S.poly([[kx+1*k,ky+40*k],[kx+15*k,ky+40*k],[kx+8*k,ky+47*k]],z,WS.visor,o);S.bar([kx+14*k,ky+28*k],[HX,HY],4*k,z+.1,WS.shirt,o);
 // měřítko: člověk 1,7 m a dveře 1,1 × 2,2 m u dítěte (světové míry 11 kap. 1.1)
 S.panel(50,top,.5,1.7,.2,D1.near[0],o);S.disc(50.25,top+1.9,.22,.2,WS.skin,o);}

// ── sestavení listů
const DESK=hex(T.desk);
function sheet(title,sub,rows,file){const M=24,GAP=24,L=22;let wmax=0,hsum=M+58;for(const r of rows){wmax=Math.max(wmax,r.reduce((s,p)=>s+p.img.w,0)+GAP*(r.length-1));hsum+=L+Math.max(...r.map(p=>p.img.h))+GAP;}
 const img=new Img(wmax+2*M,hsum+M-GAP+8);for(let i=0;i<img.d.length;i+=3){img.d[i]=DESK[0];img.d[i+1]=DESK[1];img.d[i+2]=DESK[2];}
 text(img,title,M,M,3,T.graphite);text(img,sub,M,M+30,2,T.pencil700);let y=M+58;
 for(const r of rows){let x=M;for(const p of r){text(img,p.label,x,y+2,2,T.graphite);img.rect(x-3,y+L-3,p.img.w+6,p.img.h+6,T.cream);img.blit(p.img,x,y+L);x+=p.img.w+GAP;}y+=L+Math.max(...r.map(p=>p.img.h))+GAP;}
 img.png(OUT+file);console.log('ok',file,img.w,img.h);}
const CLOSE_PITCH=+(process.env.PITCH??-8),L16={W:640,H:360},LP={W:202,H:360},PLANE=7.75,HANDLEN=.5,AIM_H=9,AIM_HP=12.4;// zblízka: výška záběru 9 m (šířka 16 m), na výšku 12,4 m (šířka 7 m); vlaštovka v ruce 0,5 m
// Záběry: zblízka (míření), oddálení (let ~1 s po výhozu, kamera letu 120 m), menu (ustavující záběr, UI vlevo / dole).
function conceptSheet(id,name,sub,build,{menuP=[.8,.62],menuH=14,menuPP=[.62,.5],menuHP=20}){
 const aim={from:HAND,dx:5.2,dy:3,drop:.7},fl=[92,23.5,0],tr=[];for(let i=0;i<=24;i++){const t=i/24;tr.push([HX+(fl[0]-HX)*t,HY+(fl[1]-HY)*t+4*t*(1-t),0]);}
 const flP=[86,22.5,0],trP=[];for(let i=0;i<=24;i++){const t=i/24;trP.push([HX+(flP[0]-HX)*t,HY+(flP[1]-HY)*t+3*t*(1-t),0]);}
 const close=shot(S=>{sky(S);build(S);},{...L16,cam:anchored({aspect:16/9,height:AIM_H,P:HAND,fx:.38,fy:.6,pitch:CLOSE_PITCH}),planeAt:HAND,planeLen:HANDLEN,aim,ui:aimUI});
 const wide=shot(S=>{sky(S);build(S);},{...L16,cam:flight({aspect:16/9,width:120,X:fl[0],Y:fl[1]}),planeAt:fl,planeLen:PLANE,planeAng:.12,trail:tr,ui:flyUI});
 const menu=shot(S=>{sky(S);build(S,{menu:true});},{...L16,cam:anchored({aspect:16/9,height:menuH,P:HAND,fx:menuP[0],fy:menuP[1],pitch:2}),planeAt:[HX+menuH*.1,HY+menuH*.28,0],planeLen:HANDLEN*menuH/AIM_H*1.4,planeAng:-.15,ui:menuUI});
 const closeP=shot(S=>{sky(S);build(S);},{...LP,cam:anchored({aspect:LP.W/LP.H,height:AIM_HP,P:HAND,fx:.4,fy:.62,pitch:CLOSE_PITCH}),planeAt:HAND,planeLen:HANDLEN,aim,ui:aimUI,sun:[.78,.16]});
 const wideP=shot(S=>{sky(S);build(S);},{...LP,cam:flight({aspect:LP.W/LP.H,width:70,X:flP[0],Y:flP[1],px:.3}),planeAt:flP,planeLen:PLANE,planeAng:.12,trail:trP,ui:flyUI,sun:[.78,.16]});
 const menuP_=shot(S=>{sky(S);build(S,{menu:true});},{...LP,cam:anchored({aspect:LP.W/LP.H,height:menuHP,P:HAND,fx:menuPP[0],fy:menuPP[1],pitch:2}),planeAt:[HX-menuHP*.12,HY+menuHP*.02,0],planeLen:HANDLEN*menuHP/AIM_HP*1.4,planeAng:-.15,ui:menuUI,sun:[.78,.16]});
 sheet(name,sub,[[{label:'1 ZBLIZKA - MIRENI 16:9',img:close},{label:'2 ODDALENI - LET 16:9 (SIRKA 120 M)',img:wide},{label:'3 HLAVNI MENU 16:9',img:menu}],
  [{label:'4 ZBLIZKA',img:closeP},{label:'5 ODDALENI',img:wideP},{label:'6 MENU',img:menuP_}]],`koncept-${id}.png`);}
conceptSheet('1-terasa','KONCEPT 1: TERASA NA STRESE','DILNA = KULNA NA STRESNI TERASE STAREHO DOMU. DITE NA BEDNE U ZABRADLI.',conceptA,{});
conceptSheet('2-podkrovi','KONCEPT 2: PODKROVNI DILNA V REZU','DOMECEK V REZU NA OPERNE ZDI. DITE NA PAVLACI U PUDNICH DVERI, NAD NIM TRAM S KLADKOU.',conceptB,{menuH:16,menuP:[.85,.6]});
conceptSheet('3-vyhlidka','KONCEPT 3: VYHLIDKA NA KOPCI','DILNA = CHALOUPKA NA HREBENI KOPCE. DITE NA DREVENE VYHLIDCE S DALEKOHLEDEM, MESTO POD KOPCEM.',conceptC,{menuH:24,menuP:[.88,.6],menuHP:28});
// Dnes: klidová kamera hry (restCamera: šířka 243,8 m, HAND na 148, 258) a stejný záběr na telefonu na výšku (pás 16:9 jako dnes).
{const REST_W=640/2.1/1.25,restCam=anchored({aspect:16/9,height:REST_W*9/16,P:HAND0,fx:148/640,fy:258/360});
 const now=shot(S=>{sky(S);today(S);},{...L16,cam:restCam,planeAt:HAND0,planeLen:PLANE});
 const zoom=shot(S=>{sky(S);today(S);},{...L16,cam:anchored({aspect:16/9,height:34,P:[50,10,0],fx:.5,fy:.55}),planeAt:HAND0,planeLen:PLANE});
 const flyNow=shot(S=>{sky(S);today(S);},{...L16,cam:flight({aspect:16/9,width:120,X:92,Y:23.5}),planeAt:[92,23.5,0],planeLen:PLANE,planeAng:.12});
 sheet('DNES: DILNA PAPER LAB V KLIDOVEM ZABERU','DITE 11,75 M (47 PX x 0,25 M), DUM 12 M, DVERE 4,2 x 6 M, PRISTAVEK 7,25 M. VEDLE DITETE CLOVEK 1,7 M.',
  [[{label:'KLID DNES (SIRKA 244 M)',img:now},{label:'VYREZ: MERITKO DITETE A CLOVEKA',img:zoom},{label:'LET DNES (SIRKA 120 M)',img:flyNow}]],'dnes.png');}

// Pás výhledu: stejný záběr zblízka (koncept B) se středem místa 1 jako dnes a se stropem 13 m do 150 m od startu.
{const cam=anchored({aspect:16/9,height:AIM_H,P:HAND,fx:.38,fy:.6,pitch:CLOSE_PITCH}),o={...L16,cam,planeAt:HAND,planeLen:HANDLEN};
 MID_CAP=false;const a=shot(S=>{sky(S);conceptB(S);},o);MID_CAP=true;const b=shot(S=>{sky(S);conceptB(S);},o);
 sheet('PAS VYHLEDU: CO JE ZA DITETEM PRI MIRENI','STRED MISTA 1 (VRSTVA -110 M) MA U STARTU DOMY 18-38 M. ZA DITETEM PAK NENI NEBE ANI SLUNCE.',[[{label:'DNESNI STRED (AZ 38 M)',img:a},{label:'STROP 13 M DO 150 M OD STARTU',img:b}]],'vyhled.png');}
// Šířka záběru při míření: detail 8 m, polodetail 16 m (doporučeno) a W_aim 55 m z 01-zacatek-a-kamera §3.3 (vlaštovka v herním měřítku 7,75 m).
{const mk=(height,len,label)=>({label,img:shot(S=>{sky(S);conceptB(S);},{...L16,cam:anchored({aspect:16/9,height,P:HAND,fx:.38,fy:.6,pitch:CLOSE_PITCH}),planeAt:HAND,planeLen:len,ui:aimUI})});
 sheet('SIRKA ZABERU PRI MIRENI (KONCEPT 2)','DITE 1,2 M. VLASTOVKA V RUCE 0,35 / 0,5 / 7,75 M. PX PLATI PRO SIRKU 1280.',
  [[mk(4.5,.35,'DETAIL 8 M: DITE 190 PX, VLASTOVKA 56 PX'),mk(9,.5,'POLODETAIL 16 M: DITE 96 PX, VLASTOVKA 40 PX'),mk(55*9/16,7.75,'W_AIM 55 M (01): DITE 28 PX, VLASTOVKA 180 PX')]],'zaber.png');}
