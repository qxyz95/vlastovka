// Náčrty plánu hratelnosti, art (art-director, 15. 10. 2026, research/plan-hratelnost/03-art.md). Bez závislostí:
//   node research/design/img/hratelnost/hratelnost.mjs → postavicka-varianty.png, postavicka-pozy.png, uvod-zaber.png, uvod-prechod.png, zbytky-stareho-stylu.png
// NÁČRT tvaru, kompozice a měřítka (ne finální vzhled): kamera a město jako ve hře (fov 20°, cityChunk, koncept 2 místa odhodu), papír bible 05.
// ZÁKLAD převzatý beze změny ze start/start.mjs (art-director 14. 10.): obrázek, písmo, kamera hry, karty, město místa 0–1, koncept 2 (podkrovní dílna), list.
// Mění se jen: OUT (tahle složka) a volání dítěte v conceptB (drawKid místo kid, aby šlo kreslit plastické dítě).
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
 drawKid(S,HX-.32,FL,.1,[HX,HY],{wave:menu});}
// ── sestavení listů
const DESK=hex(T.desk);
function sheet(title,sub,rows,file){const M=24,GAP=24,L=22;let wmax=0,hsum=M+58;for(const r of rows){wmax=Math.max(wmax,r.reduce((s,p)=>s+p.img.w,0)+GAP*(r.length-1));hsum+=L+Math.max(...r.map(p=>p.img.h))+GAP;}
 const img=new Img(wmax+2*M,hsum+M-GAP+8);for(let i=0;i<img.d.length;i+=3){img.d[i]=DESK[0];img.d[i+1]=DESK[1];img.d[i+2]=DESK[2];}
 text(img,title,M,M,3,T.graphite);text(img,sub,M,M+30,2,T.pencil700);let y=M+58;
 for(const r of rows){let x=M;for(const p of r){text(img,p.label,x,y+2,2,T.graphite);img.rect(x-3,y+L-3,p.img.w+6,p.img.h+6,T.cream);img.blit(p.img,x,y+L);x+=p.img.w+GAP;}y+=L+Math.max(...r.map(p=>p.img.h))+GAP;}
 img.png(OUT+file);console.log('ok',file,img.w,img.h);}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// NOVÉ (art-director, 15. 10. 2026, research/plan-hratelnost/03-art.md): plastická postavička, úvodní záběr, zbytky starého stylu.
// ════════════════════════════════════════════════════════════════════════════════════════════════
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';

// ── 3D matematika (rotace jen kolem os, pravotočivě, y nahoru, kamera na +z)
const M=(a,b)=>a.map(r=>[0,1,2].map(j=>r[0]*b[0][j]+r[1]*b[1][j]+r[2]*b[2][j])),ap=(m,v)=>m.map(r=>r[0]*v[0]+r[1]*v[1]+r[2]*v[2]),add=(a,b)=>a.map((v,i)=>v+b[i]);
const I3=[[1,0,0],[0,1,0],[0,0,1]];
// yaw: dopředu (+x) se natočí ke kameře (+z); rz: švih v rovině boku (kladný = ruka dolů → dopředu); rx: odtažení do boku.
const yaw=a=>{const c=Math.cos(a),s=Math.sin(a);return [[c,0,-s],[0,1,0],[s,0,c]];};
const rz=a=>{const c=Math.cos(a),s=Math.sin(a);return [[c,-s,0],[s,c,0],[0,0,1]];};
const rx=a=>{const c=Math.cos(a),s=Math.sin(a);return [[1,0,0],[0,c,-s],[0,s,c]];};
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const newell=p=>{let n=[0,0,0];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];n=[n[0]+(a[1]-b[1])*(a[2]+b[2]),n[1]+(a[2]-b[2])*(a[0]+b[0]),n[2]+(a[0]-b[0])*(a[1]+b[1])];}return norm(n);};
const cen=p=>p.reduce((s,q)=>add(s,q),[0,0,0]).map(v=>v/p.length);

// ── papírové díly: „lathe“ = hranol / komolý jehlan s n stranami podél osy y; prstence [y, rx, rz, dx]. Stěny ven, víčka ±y.
function lathe(rings,n,col,{rot=Math.PI/n,top=true,bot=true}={}){
 const R=rings.map(([y,a,b,dx=0])=>Array.from({length:n},(_,k)=>{const t=rot+k/n*Math.PI*2;return [dx+a*Math.cos(t),y,b*Math.sin(t)];})),F=[];
 const face=(pts,ref)=>{let n0=newell(pts);if(dot3(n0,ref)<0){pts=pts.slice().reverse();n0=n0.map(v=>-v);}F.push({pts,col,tris:pts.length-2});};
 for(let i=0;i+1<R.length;i++)for(let k=0;k<n;k++){const q=[R[i][k],R[i][(k+1)%n],R[i+1][(k+1)%n],R[i+1][k]],c=cen(q),ax=[((rings[i][3]??0)+(rings[i+1][3]??0))/2,c[1],0];face(q,[c[0]-ax[0],0,c[2]]);}
 if(bot)face(R[0],[0,-1,0]);if(top)face(R[R.length-1],[0,1,0]);return F;}
// osmistěn (dlaň), stan (skládaná čepice-lodička: hřbet podél x, z boku trojúhelník jako dnešní silueta), plochá destička (oko)
function octa(r,col){const P=[[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]],T=[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]];
 return T.map(t=>{let pts=t.map(i=>P[i]);if(dot3(newell(pts),cen(pts))<0)pts=pts.reverse();return {pts,col,tris:1};});}
function tent(w,h,d,col){const a=[w,0,d],b=[-w,0,d],c=[0,h,d*.15],a2=[w,0,-d],b2=[-w,0,-d],c2=[0,h,-d*.15];
 const f=(pts,ref)=>{if(dot3(newell(pts),ref)<0)pts=pts.reverse();return {pts,col,tris:pts.length-2};};
 return [f([a,c,b],[0,0,1]),f([a2,b2,c2],[0,0,-1]),f([a,a2,c2,c],[1,.3,0]),f([b,c,c2,b2],[-1,.3,0])];}
const plate=(x,y,z,s,col)=>{let pts=[[x,y-s,z-s],[x,y-s,z+s],[x,y+s,z+s],[x,y+s,z-s]];if(newell(pts)[0]<0)pts=pts.reverse();return [{pts,col,tris:2}];};
const plateZ=(x,y,z,s,col)=>{let pts=[[x-s,y-s,z],[x+s,y-s,z],[x+s,y+s,z],[x-s,y+s,z]];if(newell(pts)[2]<0)pts=pts.reverse();return [{pts,col,tris:2}];};
const L16={W:640,H:360},HANDLEN=.5;
const shift=(F,d)=>F.map(f=>({...f,pts:f.pts.map(p=>add(p,d))}));

// ── barvy dítěte (bible 05 kap. 9.4, beze změny) a papírové stínování po stěnách
const KC={coat:hex(WS.shirt),legs:navy,skin:hex(WS.skin),hair:hex(T.pencil700),cap:hex(T.kraft),band:hex(T.tomato),shoe:hex(T.pencil700),eye:hex(T.pencil700)};
const LIGHT=norm([.62,.5,.6]);
// čelo ke kameře = barva karty (+3 % světla), boky do fialova až mix(side, .32), přivrácené ke slunci o 0,08 světlejší, horní plochy mix(cut, .25), spodní mix(side, .42).
function shade(col,n){if(n[1]>.75)return mix(col,CUT,.25);if(n[1]<-.6)return mix(col,SIDE,.42);
 const f=Math.max(0,n[2]),u=Math.min(1,Math.max(0,(f-.5)/.45)),k=Math.max(0,.32*(1-u*u*(3-2*u))-.08*Math.max(0,dot3(n,LIGHT)));return k<.02?mix(col,CUT,.03):mix(col,SIDE,k);}

// ── tři varianty tvaru (stejná výška 1,2 m, stejné barvy, stejné klouby): A skládaná loutka, B vrstvená karta 2,5D, C oblá figurka
const VAR={
 A:{name:'A SKLADANA LOUTKA',short:'A LOUTKA',lod:0,
  leg:()=>lathe([[-.41,.055,.055],[0,.065,.065]],4,KC.legs),shoe:()=>lathe([[-.06,.1,.06,.04],[0,.085,.06,.03]],4,KC.shoe),
  coat:()=>lathe([[-.06,.15,.26],[.46,.11,.17]],6,KC.coat,{rot:0}),
  head:()=>lathe([[0,.14,.13],[.19,.155,.145],[.29,.1,.09]],8,KC.skin),
  hair:()=>lathe([[.1,.07,.13,-.1],[.27,.07,.1,-.06]],4,KC.hair),eyes:()=>[...plate(.152,.16,.05,.018,KC.eye),...plate(.152,.16,-.05,.018,KC.eye)],
  cap:()=>[...tent(.2,.25,.135,KC.cap),...lathe([[-.03,.19,.145],[.03,.19,.145]],4,KC.band,{top:false,bot:false})],
  arm:()=>lathe([[-.5,.045,.045],[0,.055,.055]],4,KC.coat),hand:()=>octa(.06,KC.skin)},
 A1:{name:'A LOD 1',lod:1,
  leg:()=>lathe([[-.47,.06,.06],[0,.07,.07]],3,KC.legs,{bot:false,top:false}),shoe:()=>[],
  coat:()=>lathe([[-.06,.15,.26],[.46,.11,.17]],4,KC.coat,{top:false}),
  head:()=>lathe([[0,.15,.14],[.29,.12,.11]],6,KC.skin,{bot:false}),hair:()=>[],eyes:()=>[],
  cap:()=>tent(.2,.25,.135,KC.cap).slice(0,2),arm:()=>lathe([[-.55,.05,.05],[0,.055,.055]],3,KC.coat,{bot:false,top:false}),hand:()=>[]},
 B:{name:'B VRSTVENA KARTA 2,5D',short:'B KARTA 2,5D',lod:0,flat:true,
  leg:()=>lathe([[-.41,.08,.02],[0,.08,.02]],4,KC.legs),shoe:()=>lathe([[-.06,.12,.02,.04],[0,.12,.02,.04]],4,KC.shoe),
  coat:()=>lathe([[-.06,.37,.02],[.46,.24,.02]],4,KC.coat),
  head:()=>discZ(.015,.14,10,.02,KC.skin),hair:()=>shift(discZ(0,.15,8,.02,KC.hair),[-.04,0,-.03]),eyes:()=>plateZ(.08,.16,.025,.018,KC.eye),
  cap:()=>tent(.2,.25,.02,KC.cap),arm:()=>lathe([[-.5,.07,.02],[0,.07,.02]],4,KC.coat),hand:()=>discZ(0,0,6,.02,KC.skin,.055)},
 C:{name:'C OBLA FIGURKA',short:'C OBLA',lod:0,
  leg:()=>lathe([[-.41,.055,.055],[-.2,.062,.062],[0,.065,.065]],8,KC.legs),shoe:()=>lathe([[-.06,.1,.06,.04],[-.02,.1,.065,.04],[.02,.07,.05,.02]],8,KC.shoe),
  coat:()=>lathe([[-.06,.15,.26],[.1,.15,.25],[.3,.13,.21],[.46,.11,.16]],16,KC.coat),
  head:()=>lathe([[0,.05,.05],[.03,.11,.1],[.08,.145,.135],[.145,.155,.145],[.21,.145,.135],[.26,.11,.1],[.29,.05,.05]],16,KC.skin),
  hair:()=>lathe([[.08,.1,.14,-.07],[.2,.11,.14,-.06],[.29,.07,.09,-.04]],10,KC.hair),eyes:()=>[...plate(.152,.16,.05,.018,KC.eye),...plate(.152,.16,-.05,.018,KC.eye)],
  cap:()=>[...lathe([[0,.19,.15],[.08,.17,.13],[.18,.1,.08],[.25,.02,.02]],12,KC.cap),...lathe([[-.03,.19,.15],[.03,.19,.15]],12,KC.band,{top:false,bot:false})],
  arm:()=>lathe([[-.5,.045,.045],[-.25,.05,.05],[0,.055,.055]],8,KC.coat),hand:()=>lathe([[-.06,.02,.02],[-.03,.055,.05],[.03,.055,.05],[.06,.02,.02]],8,KC.skin)}
};
// kotouč čelem ke kameře (varianta B: hlava, vlasy, dlaň jako dnešní karty)
function discZ(cx,cy,n,d,col,r=.15){const ring=z=>Array.from({length:n},(_,k)=>{const t=k/n*Math.PI*2;return [cx+r*Math.cos(t),cy+r*Math.sin(t),z];}),a=ring(d),b=ring(-d),F=[{pts:a,col,tris:n-2},{pts:b.slice().reverse(),col,tris:n-2}];
 for(let k=0;k<n;k++){let q=[a[k],b[k],b[(k+1)%n],a[(k+1)%n]];const c=cen(q);if(dot3(newell(q),[c[0]-cx,c[1]-cy,0])<0)q=q.reverse();F.push({pts:q,col,tris:2});}return F;}

// ── kostra (tuhé díly s klouby, žádný skinning): kořen v chodidlech, trup v kyčli, hlava v krku, ruce v ramenou, nohy v kyčlích
// Úhly pózy: yaw (natočení ke kameře), lean (záklon / předklon kolem chodidel), back (couvnutí, m), drop (sed), trunk, head [yaw, kývnutí],
// armT / armF [švih rz, odtažení rx], legR / legL [rz]. T = vzdálenější ruka, hází (paže jde za hlavou, obličej zůstane vidět); F = blízká ruka, ukazuje směr hodu.
const POSE={
 klid:{yaw:.75,head:[.25,0],armT:[1.25,-.15],armF:[1.2,-.25],legR:[0],legL:[0],plane:true},
 mireni:{yaw:.55,head:[-.1,.1],armT:[2.71,.1],armF:[1.95,.05],legR:[.16],legL:[-.12],plane:true},
 nabijeni:{yaw:.55,lean:.08,back:.07,head:[-.1,.14],armT:[-2.5,.15],armF:[1.65,.05],legR:[.22],legL:[-.2],plane:true},
 vyhoz:{yaw:.25,lean:-.07,head:[0,-.05],armT:[1.9,.1],armF:[-.6,.15],legR:[.38],legL:[-.28]},
 mavani:{yaw:.9,head:[-.35,.1],armF:[2.75,.55],armT:[.1,.12],legR:[0],legL:[0]},
 sed:{yaw:.6,drop:.36,head:[.3,0],armF:[.55,.2],armT:[-.45,.2],legR:[1.5],legL:[1.45]},
 stul:{yaw:.5,lean:-.1,head:[0,-.4],armF:[1.25,.05],armT:[1.1,.05],legR:[0],legL:[0]}
};
// Sestaví díly v pozici: vrací {faces:[{pts,n,col,z}], hand:[x,y,z], tris}. at = chodidla ve světě.
function buildKid(v,pose,at=[0,0,0],{handAt=null}={}){
 const V=VAR[v],P=POSE[pose],out=[];let tris=0;
 const root=M(yaw(P.yaw*(V.flat?.3:1)),rz(P.lean??0)),T0=[at[0]-(P.back??0),at[1]-(P.drop??0),at[2]];
 const put=(F,R,t)=>{for(const f of F){const pts=f.pts.map(p=>add(ap(R,p),t)),n=newell(pts);tris+=f.tris;out.push({pts,n,col:f.col});}};
 const child=(R,t,pivot,Rl)=>[M(R,Rl),add(t,ap(R,pivot))];
 // nohy
 for(const [s,a] of [[1,P.legR[0]],[-1,P.legL[0]]]){const [R,t]=child(root,T0,[0,.46,s*.08],rz(a));put(V.leg(),R,t);const [R2,t2]=child(R,t,[0,-.42,0],I3);put(V.shoe(),R2,t2);}
 const [Rt,tt]=child(root,T0,[0,.44,0],I3);put(V.coat(),Rt,tt);
 const [Rh,th]=child(Rt,tt,[.01,.47,0],M(yaw(P.head[0]),rz(P.head[1])));put(V.head(),Rh,th);put(V.hair(),Rh,th);put(V.eyes(),Rh,th);
 const [Rc,tc]=child(Rh,th,[-.01,.255,0],I3);put(V.cap(),Rc,tc);
 let hand=null;
 for(const [s,[a,b]] of [[-1,P.armT],[1,P.armF]]){const [R,t]=child(Rt,tt,[0,.41,s*(V.flat?.035:.2)],M(rx(-b*s),rz(a)));put(V.arm(),R,t);const [R2,t2]=child(R,t,[0,-.55,0],I3);put(V.hand(),R2,t2);if(s<0)hand=t2;}
 // ruka přesně v bodě výhozu (M-3): celé dítě se posune, ne ruka
 if(handAt&&hand){const d=handAt.map((v,i)=>v-hand[i]);for(const f of out)f.pts=f.pts.map(p=>add(p,d));hand=handAt;}
 for(const f of out){f.z=cen(f.pts)[2];f.c=shade(f.col,f.n);}
 return {faces:out,hand,tris};}

// ── vykreslení samotné postavičky (list): nebe čtvrti 1, tmavomodré zábradlí před dítětem, vlaštovka v ruce 0,5 m
const SKY_STOPS=[[0,'#78b4dc'],[.42,'#a6d0e8'],[.74,'#d8e9ea'],[.9,'#fce4c6'],[1,'#fce4c6']].map(([t,c])=>[t,hex(c)]);
function skyFill(img,t0=0,t1=1){const {w,h}=img;for(let y=0;y<h;y++){const t=t0+(t1-t0)*y/h;let k=0;while(k<SKY_STOPS.length-2&&t>SKY_STOPS[k+1][0])k++;const [a,c0]=SKY_STOPS[k],[b,c1]=SKY_STOPS[k+1],c=mix(c0,c1,Math.min(1,(t-a)/(b-a)));for(let x=0;x<w;x++){const i=(y*w+x)*3;img.d[i]=c[0];img.d[i+1]=c[1];img.d[i+2]=c[2];}}}
function figure(v,pose,{W=220,H=300,height=1.75,rail=true,planeOn=true,gray=false,fy=.56,pitch=-8}={}){
 const w=W*SS,h=H*SS,img=new Img(w,h);skyFill(img,.35,.8);
 const cam=anchored({aspect:W/H,height,P:[0,.68,0],fx:.5,fy,pitch}),k=buildKid(v,pose),pr=p=>project(cam,p,w,h);
 const items=k.faces.filter(f=>dot3(f.n,norm(cam.pos.map((c,i)=>c-cen(f.pts)[i])))>0).sort((a,b)=>a.z-b.z);
 for(const f of items)img.poly(f.pts.map(p=>pr(p).slice(0,2)),f.c);
 if(rail){const ppm=h/height,y0=pr([0,0,.75])[1],y1=pr([0,.95,.75])[1];for(let x=-1.2;x<1.3;x+=.45){const [sx]=pr([x,0,.75]);img.rect(sx-.025*ppm,y1,Math.max(2,.05*ppm),y0-y1,navy);}
  img.rect(0,y1-.035*ppm,w,.07*ppm,navy);img.rect(0,y0,w,h-y0,mix(kraft,CUT,.1));}
 if(planeOn&&POSE[pose].plane&&k.hand){const [sx,sy]=pr(k.hand),[ax]=pr([k.hand[0]+.5,k.hand[1],k.hand[2]]);plane(img,sx,sy,ax-sx,pose==='nabijeni'?.45:.26,SS);}
 let out=img.down(SS);if(gray)out=grayOf(out);return {img:out,tris:k.tris};}
function grayOf(src){const o=new Img(src.w,src.h);for(let i=0;i<src.d.length;i+=3){const L=.2126*src.d[i]+.7152*src.d[i+1]+.0722*src.d[i+2];o.d[i]=o.d[i+1]=o.d[i+2]=L;}return o;}
// zmenšení na cílovou výšku dítěte v px (náhled „jak velké je ve hře“), pak zpět zvětšené po pixelech, aby byl vidět skutečný detail
function atPx(v,pose,kidPx,{gray=false,box=4}={}){const H=Math.round(kidPx*1.75/1.2),W=Math.round(H*.75);const f=figure(v,pose,{W,H,gray});return blowUp(f.img,box);}
function blowUp(src,k){const o=new Img(src.w*k,src.h*k);for(let y=0;y<o.h;y++)for(let x=0;x<o.w;x++){const a=((y/k|0)*src.w+(x/k|0))*3,b=(y*o.w+x)*3;o.d[b]=src.d[a];o.d[b+1]=src.d[a+1];o.d[b+2]=src.d[a+2];}return o;}

// ── dítě ve světové scéně (koncept 2): mode 'flat' = dnešní karty, '3d' = varianta A; ruka přesně v HAND
let KID_MODE='flat',KID_POSE='mireni';
function drawKid(S,fx,fy,z,hand,{wave=false}={}){if(KID_MODE==='flat')return kid(S,fx,fy,z,hand,{wave});
 const p=wave?'mavani':KID_POSE,k=buildKid(KID_MODE,p,[fx,fy,z],{handAt:p==='mireni'||p==='nabijeni'?[hand[0],hand[1],0]:null});
 for(const f of k.faces)if(f.n[2]>0)S.face(f.pts,f.c,{haze:false,z:f.z,bias:-.001});}
// kouř dnes (life3d: low-poly koule CYBER.steam, toon, neprůhledné, 3–7 m) za dítětem: komíny ulice a středu
const STEAM_C=hex('#beb0d3'),STEAM_D=hex('#8a7aa8'),CHIM_C=hex('#7a4f86');
function oldSmoke(S){for(const [x,z,h,big] of [[66.5,-24,14.2,0],[77.5,-27,13.4,0],[86,-110,21,1],[58,-30,12.8,0]]){S.box(x-.5,h-2.4,1,2.4,z,1,CHIM_C);
  for(let j=0;j<5;j++){const r=(big?1.7:1)*(.9+j*.38),cx=x+j*.9,cy=h+1+j*2.1*(big?1.5:1);const hexp=[...Array(6)].map((_,i)=>{const t=i/6*Math.PI*2+.3*j;return [cx+Math.cos(t)*r,cy+Math.sin(t)*r];});
   S.poly(hexp,z+.2+j*.01,STEAM_C);S.poly(hexp.slice(0,4).map(([a,b])=>[a,b]).concat([[cx,cy]]),z+.25+j*.01,STEAM_D,{a:.6});}}}

// ── UI náznaky úvodu (N8, N9): hra přes celou plochu, výzva textem uprostřed nebe, mince malé vpravo nahoře
function introUI(img,W,H){const s=W>=500?2:1,line='THROW IT',sub='HOLD AND RELEASE',cy=Math.round(H*(H>W?.2:W/H>2?.07:.17));
 const tw=textW(line,s*2);text(img,line,(W-tw)/2|0,cy,s*2,T.graphite);text(img,sub,(W-textW(sub,s))/2|0,cy+16*s+4,s,T.pencil700);
 card(img,W-(H>W?58:72),8,H>W?50:64,18);img.circle(W-(H>W?50:62),17,4,T.mustard);text(img,'120',W-(H>W?42:54),14,1,T.graphite);}
function keepOut(img,W,H,zones){for(const [x,y,w,h,c] of zones){const X=x*W,Y=y*H,ww=w*W,hh=h*H,col=hex(c);for(let i=0;i<ww;i+=6){img.rect(X+i,Y,3,1,col);img.rect(X+i,Y+hh,3,1,col);}for(let j=0;j<hh;j+=6){img.rect(X,Y+j,1,3,col);img.rect(X+ww,Y+j,1,3,col);}}}

// ── PNG dekodér (8 bit RGB/RGBA, bez prokládání) pro popis screenshotu tvůrce
function readPng(file){const b=readFileSync(file),w=b.readUInt32BE(16),h=b.readUInt32BE(20),ct=b[25],bpp=ct===6?4:3,idat=[];let p=8;
 while(p<b.length){const len=b.readUInt32BE(p),type=b.toString('ascii',p+4,p+8);if(type==='IDAT')idat.push(b.subarray(p+8,p+8+len));p+=12+len;}
 const raw=inflateSync(Buffer.concat(idat)),stride=w*bpp,px=Buffer.alloc(h*stride);
 for(let y=0;y<h;y++){const f=raw[y*(stride+1)],src=raw.subarray(y*(stride+1)+1,(y+1)*(stride+1)),o=y*stride;
  for(let x=0;x<stride;x++){const a=x>=bpp?px[o+x-bpp]:0,up=y?px[o-stride+x]:0,c=y&&x>=bpp?px[o-stride+x-bpp]:0;let v=src[x];
   if(f===1)v+=a;else if(f===2)v+=up;else if(f===3)v+=(a+up)>>1;else if(f===4){const q=a+up-c,pa=Math.abs(q-a),pb=Math.abs(q-up),pc=Math.abs(q-c);v+=pa<=pb&&pa<=pc?a:pb<=pc?up:c;}px[o+x]=v&255;}}
 const img=new Img(w,h);for(let i=0;i<w*h;i++)for(let k=0;k<3;k++)img.d[i*3+k]=px[i*bpp+k]/255;return img;}
function ring(img,x,y,r,c,wd=4){c=C(c);for(let a=0;a<360;a+=1.5){const t=a*Math.PI/180;img.rect(x+Math.cos(t)*r-wd/2,y+Math.sin(t)*r-wd/2,wd,wd,c);}}
function tag(img,x,y,n,c=T.tomato600){img.circle(x,y,15,c);text(img,String(n),x-(String(n).length*6*3)/2+2,y-10,3,T.cream);}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// LISTY
// ════════════════════════════════════════════════════════════════════════════════════════════════
const RES={};
// 1 Varianty tvaru: velké (3/4 pohled), desktop 96 px, telefon 64 px, telefon 64 px v šedi (test čitelnosti bible kap. 6)
{const rows=[];RES.tris={};
 for(const v of ['flat','A','B','C']){
  if(v==='flat'){// dnešní karty: kid() ze start.mjs ve stejném záběru
   const mk=(W,H,height,g)=>{const w=W*SS,h=H*SS,img=new Img(w,h);skyFill(img,.35,.8);const cam=anchored({aspect:W/H,height,P:[0,.68,0],fx:.5,fy:.56,pitch:-8}),S=new Scene();kid(S,-.32,0,.1,[0,1.4]);
    for(const it of S.render(cam,w,h))img.poly(it.p.map(q=>[q[0],q[1]]),it.f.color,it.f.a);const [sx,sy]=project(cam,[0,1.4,0],w,h),[ax]=project(cam,[.5,1.4,0],w,h);plane(img,sx,sy,ax-sx,.26,SS);let o=img.down(SS);return g?grayOf(o):o;};
   const big=mk(220,300,1.75),H96=Math.round(96*1.75/1.2),H64=Math.round(64*1.75/1.2);
   rows.push([{label:'DNES 49 TRI',img:big},{label:'96 PX',img:blowUp(mk(Math.round(H96*.75),H96,1.75),2)},{label:'64 PX',img:blowUp(mk(Math.round(H64*.75),H64,1.75),3)},{label:'64 PX SEDA',img:blowUp(mk(Math.round(H64*.75),H64,1.75,true),3)}]);continue;}
  const big=figure(v,'mireni',{rail:false});RES.tris[v]=big.tris;
  rows.push([{label:`${VAR[v].short} ${big.tris} TRI`,img:big.img},{label:'96 PX',img:blowUp(figure(v,'mireni',{W:Math.round(140*.75),H:140}).img,2)},
   {label:'64 PX',img:atPx(v,'mireni',64,{box:3})},{label:'64 PX SEDA',img:atPx(v,'mireni',64,{gray:true,box:3})}]);}
 RES.tris.A1=buildKid('A1','mireni').tris;
 sheet('N5 PLASTICKA POSTAVICKA: TRI VARIANTY TVARU','STEJNA VYSKA 1,2 M, BARVY A KLOUBY. POZA MIRENI, KAMERA HRY (SKLON -8). PX = VYSKA DITETE NA OBRAZOVCE.',rows,'postavicka-varianty.png');}
// 2 Pózy varianty A + LOD 1
{const ps=['klid','mireni','nabijeni','vyhoz','mavani','sed','stul'];
 const row1=ps.slice(0,4).map(p=>({label:p.toUpperCase(),img:figure('A',p,{W:200,H:280}).img})),row2=ps.slice(4).map(p=>({label:p.toUpperCase(),img:figure('A',p,{W:200,H:280,rail:p!=='stul'}).img}));
 row2.push({label:`LOD 1 ${RES.tris.A1} TRI (MENU, ODDALENI)`,img:figure('A1','mireni',{W:200,H:280}).img});
 sheet('N5 POZY VARIANTY A (SKLADANA LOUTKA)','KLID, MIRENI, NABIJENI, VYHOZ, MAVANI, SED NA PAVLACI, U STOLU. TUHE DILY S KLOUBY, BEZ OBRYSU.',[row1,row2],'postavicka-pozy.png');}
// 3 Úvodní záběr: dnes (míření 16 m, kouř za dítětem) × návrh úvodu 30 m × míření 16 m bez kouře; telefon na výšku a na šířku; přechod
{const aimCam=a=>anchored({aspect:a,height:16/a,P:HAND,fx:.38,fy:.6,pitch:-8});
 const INTRO={width:30,at:[.64,.66],portraitWidth:18,portraitAt:[.8,.62],landWidth:30,landAt:[.66,.64],pitch:2};
 const introCam=(a,W,at)=>anchored({aspect:a,height:W/a,P:HAND,fx:at[0],fy:at[1],pitch:INTRO.pitch});
 KID_MODE='flat';const today=shot(S=>{sky(S);conceptB(S);oldSmoke(S);},{...L16,cam:aimCam(16/9),planeAt:HAND,planeLen:HANDLEN,ui:aimUI});
 KID_MODE='A';KID_POSE='klid';const KH=buildKid('A','klid',[HX-.32,FL,.1]).hand;
 const intro=shot(S=>{sky(S);conceptB(S);},{...L16,cam:introCam(16/9,INTRO.width,INTRO.at),planeAt:KH,planeLen:HANDLEN,ui:(img,W,H)=>{introUI(img,W,H);keepOut(img,W,H,[[.3,.08,.4,.2,T.teal],[.56,.5,.14,.32,T.tomato600]]);}});
 KID_POSE='mireni';const aimNew=shot(S=>{sky(S);conceptB(S);},{...L16,cam:aimCam(16/9),planeAt:HAND,planeLen:HANDLEN,ui:aimUI,aim:{from:HAND,dx:5.2,dy:3,drop:.7}});
 KID_POSE='klid';const LPh={W:202,H:360},LL={W:466,H:215};
 const introP=shot(S=>{sky(S);conceptB(S);},{...LPh,cam:introCam(LPh.W/LPh.H,INTRO.portraitWidth,INTRO.portraitAt),planeAt:KH,planeLen:HANDLEN,ui:introUI,sun:[.78,.16]});
 KID_POSE='mireni';const aimP=shot(S=>{sky(S);conceptB(S);},{...LPh,cam:anchored({aspect:LPh.W/LPh.H,height:7/(LPh.W/LPh.H),P:HAND,fx:.4,fy:.62,pitch:-8}),planeAt:HAND,planeLen:HANDLEN,ui:aimUI,sun:[.78,.16]});
 KID_POSE='klid';const introL=shot(S=>{sky(S);conceptB(S);},{...LL,cam:introCam(LL.W/LL.H,INTRO.landWidth,INTRO.landAt),planeAt:KH,planeLen:HANDLEN,ui:introUI});
 sheet('N6 PRVNI ZABER: DUM S DILNOU, ZA DITETEM NEBE','1 DNES = ZABER MIRENI 16 M, KOUR Z KOMINU ZA DITETEM. 2 NAVRH UVOD 30 M (TYRKYS = MISTO PRO TEXT, RAJCE = NIC NEZAKRYVAT). 3 PAK MIRENI 16 M.',
  [[{label:'1 DNES: PRVNI ZABER = MIRENI 16 M',img:today},{label:'2 NAVRH: UVOD 30 M, SKLON +2',img:intro},{label:'3 PO DOTYKU: MIRENI 16 M',img:aimNew}],
   [{label:'4 UVOD 18M',img:introP},{label:'5 MIRENI 7M',img:aimP},{label:'6 NA SIRKU 932X430: UVOD 30 M',img:introL}]],'uvod-zaber.png');
 // přechod úvod → míření: šířka logaritmicky, kotva ruky a sklon lineárně, ease in-out 0,6 s
 const fr=[0,.33,.66,1].map(u=>{const e=u*u*(3-2*u),W=Math.exp(Math.log(30)+(Math.log(16)-Math.log(30))*e),fx=.64+(.38-.64)*e,fy=.66+(.6-.66)*e,pitch=2+(-8-2)*e;
  KID_POSE=u<.5?'klid':'mireni';return {label:`${Math.round(u*600)} MS: ${W.toFixed(1).replace('.',',')} M`,img:shot(S=>{sky(S);conceptB(S);},{W:320,H:180,cam:anchored({aspect:16/9,height:W*9/16,P:HAND,fx,fy,pitch}),planeAt:u<.5?KH:HAND,planeLen:HANDLEN})};});
 sheet('N6 PRECHOD UVOD -> MIRENI (600 MS, VSTUP SE PRIJIMA HNED)','SIRKA 30 -> 16 M LOGARITMICKY, RUKA (0,64; 0,66) -> (0,38; 0,60), SKLON +2 -> -8. REDUCED MOTION = STRIH.',[fr],'uvod-prechod.png');
 RES.intro=INTRO;}
// 4 Screenshot tvůrce 223830 s čísly zbytků starého stylu (kap. 3 dokumentu)
{const src=readPng(fileURLToPath(new URL('../../../../Snímek obrazovky 2026-10-14 223830.png',import.meta.url)));
 const marks=[[885,470,62,1],[400,520,55,1],[1185,510,48,1],[330,330,48,2],[845,288,40,3],[762,375,40,3],[885,385,40,3],[845,640,30,4],[958,632,30,4],[815,640,26,5],[1160,628,30,5],[415,600,40,6],[860,190,0,0]];
 for(const [x,y,r,n] of marks){if(!n)continue;ring(src,x,y,r,T.tomato600,4);tag(src,x+r*.75+12,y-r*.75-10,n);}
 const L=['1 KOUR: NIZKOPOLY KOULE CYBER.STEAM, TOON','2 BALON: IKOSAEDR S OBRYSEM, CYBER BARVY','3 MRAKY: RUZOVE ELIPSOIDY CYBER.LIFE.CLOUD','4 LIDE: KVADRY 2 M S OBRYSEM (MA BYT 1,7 M PAPIR)','5 KOMINY: FIALOVE KVADRY CYBER.LIFE.CHIMNEY','6 DITE: PLOCHE KARTY (N5)'];
 const leg=new Img(src.w,40+L.length*26);for(let i=0;i<leg.d.length;i+=3){leg.d[i]=hex(T.desk)[0];leg.d[i+1]=hex(T.desk)[1];leg.d[i+2]=hex(T.desk)[2];}
 L.forEach((s,i)=>text(leg,s,20,16+i*26,3,T.graphite));
 const out=new Img(src.w,src.h+leg.h);out.blit(src,0,0);out.blit(leg,0,src.h);out.png(OUT+'zbytky-stareho-stylu.png');console.log('ok zbytky-stareho-stylu.png',out.w,out.h);}
console.log(JSON.stringify(RES));
