// Náhled 16 navržených skinů (art-director, 14. 10. 2026, research/obsah/03-vzhled-modelu-a-skinu.md kap. 3).
// Bez závislostí: node research/design/img/obsah/skiny.mjs → skiny.png (+ tabulka průměrné světlosti na stdout).
// Řádek = skin; sloupce: zblízka shora na Copy a na světlém Kraftu #ead7b5 (Dílna), za letu na telefonu 24 px zvětšeno 4× proti nebi čtvrti 1, 2, 3 a 4.
// Vzor se maluje ve „sloupcových“ souřadnicích listu u (ocas 0 → nos 1), v (levý konec křídla 0 → pravý 1), jako planární UV shora (kap. 4).
import {writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const OUT=fileURLToPath(new URL('.',import.meta.url));
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const lin=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;},Lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
const fr=x=>x-Math.floor(x),near=(x,p,w)=>Math.abs(fr(x/p+.5)-.5)*p<w;
// Skiny: base (hex), p(u,v) → hex potisku nebo null. Čísla vzorů v jednotkách listu.
const DAWN=(u,v,a,b)=>{const t=Math.max(0,Math.min(1,u)),A=hex(a),B=hex(b);return '#'+A.map((c,i)=>Math.round(c+(B[i]-c)*t).toString(16).padStart(2,'0')).join('');};
const S=[
 ['K0 Plain','#ffffff',()=>null],
 // K1 Sunrise Postcard: linka střech a komínů grafitem přes zadní třetinu, slunce broskvové, známka v rohu tyrkysová.
 ['K1 Sunrise Postcard','#ffffff',(u,v)=>{const roof=.34+.06*Math.abs(fr(v*6)-.5)*2;if(Math.abs(u-roof)<.007&&u<.5)return '#2a2622';if(u<roof&&Math.abs(fr(v*6)-.8)<.02&&u>roof-.08)return '#2a2622';if(Math.hypot(u-.55,v-.7)<.06)return '#f0a27a';if(u>.08&&u<.2&&v>.12&&v<.26)return u>.09&&u<.19&&v>.13&&v<.25?'#5aa6a0':'#ffffff';return null;}],
 // K2 Harbor Chart: vrstevnice hloubky modře, kotva grafitem.
 ['K2 Harbor Chart','#ffffff',(u,v)=>{const d=Math.hypot(u-.3,(v-.3)*1.4);if(near(d,.09,.006))return d<.25?'#5b8fb0':'#9ec2d6';const x=u-.55,y=v-.72;if((Math.abs(x)<.008&&Math.abs(y)<.07)||(Math.abs(y+.04)<.008&&Math.abs(x)<.04)||(Math.abs(Math.hypot(x,y-.0)-.06)<.008&&y>.02))return '#2a2622';return null;}],
 // K3 Field Almanac: klasy (okrová stébla), větrník grafitem, tečky hvězd.
 ['K3 Field Almanac','#ffffff',(u,v)=>{if(u<.45&&near(v,.12,.006)&&fr(u*10)<.7)return '#c98a4a';if(u<.45&&near(v,.12,.025)&&near(u,.1,.012)&&u>.25)return '#c98a4a';const x=u-.6,y=v-.5;if(Math.hypot(x,y)<.12&&(Math.abs(x)<.008||Math.abs(y)<.008))return '#2a2622';if(near(u,.13,.008)&&near(v,.17,.008)&&u>.7)return '#6b6158';return null;}],
 // K4 Lantern Night: žebra lampionu, okraj pás broskvový, 3 malé lampiony.
 ['K4 Lantern Night','#ffffff',(u,v)=>{for(const [x,y] of [[.35,.3],[.45,.55],[.3,.78]])if(((u-x)/.05)**2+((v-y)/.07)**2<1)return near(v-y,.035,.006)?'#b5503c':'#f0a27a';if(near(u,.12,.005))return '#e0a060';if(u<.06)return '#d9967a';return null;}],
 // K5 Airmail Delivered: šipky letecké pošty na odtokové hraně (cihlová/modrá), kulaté razítko přes křídlo.
 ['K5 Airmail Delivered','#ffffff',(u,v)=>{if(u<.07)return fr(v*8+u*8)<.5?'#b5503c':'#3d4f7a';const d=Math.hypot(u-.42,v-.62);if(Math.abs(d-.13)<.008||Math.abs(d-.09)<.006)return '#6b6158';if(d<.09&&near(v-.62,.03,.005))return '#6b6158';return null;}],
 // K6 Hawk Feather: tahy per (V) tužkou, hnědé konce.
 ['K6 Hawk Feather','#ffffff',(u,v)=>{const w=Math.abs(v-.5);if(near(u+w*.9,.09,.006)&&u<.6&&w>.05)return '#6b6158';if(u<.1&&w>.3)return '#9c7a55';return null;}],
 // K7 Kite Tail: kosočtverce draka v pastelech (+ 3D mašle na ocase, kap. 3.4).
 ['K7 Kite Tail','#ffffff',(u,v)=>{const a=Math.abs(fr(u*5)-.5)+Math.abs(fr(v*4)-.5);if(a<.22){const k=(Math.floor(u*5)+Math.floor(v*4))%3;return ['#e98fa0','#7f9ed6','#9cc3a6'][k];}if(Math.abs(a-.32)<.01)return '#6b6158';return null;}],
 // K8 Skimmer Ripples: soustředné kruhy na vodě (šalvějová modrozelená).
 ['K8 Skimmer Ripples','#ffffff',(u,v)=>{for(const [x,y] of [[.25,.35],[.5,.7]]){const d=Math.hypot(u-x,v-y);if(d<.22&&near(d,.06,.006))return '#5aa6a0';}return null;}],
 // K9 Sail Stripes: námořnické pruhy přes křídlo (námořnická modrá, 20 %).
 ['K9 Sail Stripes','#ffffff',(u,v)=>near(u,.11,.012)&&u<.85?'#22355e':null],
 // K10 Needle Thread: steh po délce (cihlová nit), malé křížky.
 ['K10 Needle Thread','#ffffff',(u,v)=>{for(const y of [.3,.7])if(Math.abs(v-y)<.008&&fr(u*14)<.55)return '#b5503c';if(near(u,.2,.01)&&Math.abs(v-.5)<.03)return '#6b6158';return null;}],
 // K11 Night Mail: hvězdná mapa (souhvězdí tmavomodrou) + v noci krémový lem (kap. 3.4).
 ['K11 Night Mail','#ffffff',(u,v)=>{const P=[[.2,.3],[.35,.42],[.5,.36],[.62,.55],[.3,.7],[.45,.8]];for(const [x,y] of P)if(Math.hypot(u-x,v-y)<.022)return '#3d4f7a';for(let i=0;i<P.length-1;i++){const [a,b]=[P[i],P[i+1]],t=Math.max(0,Math.min(1,((u-a[0])*(b[0]-a[0])+(v-a[1])*(b[1]-a[1]))/((b[0]-a[0])**2+(b[1]-a[1])**2)));if(Math.hypot(u-a[0]-t*(b[0]-a[0]),v-a[1]-t*(b[1]-a[1]))<.004)return '#6b6158';}return null;}],
 // N1 Ruled Notebook: linky sešitu dítěte, okrajová linka cihlová.
 ['N1 Ruled Notebook','#ffffff',(u,v)=>Math.abs(u-.16)<.006?'#b5503c':near(v,.1,.006)?'#7f9ed6':null],
 // N2 Morning Paper: sloupce novin šedě, titulek grafitem.
 ['N2 Morning Paper','#ffffff',(u,v)=>u>.62&&u<.7&&v>.2&&v<.8?'#2a2622':u<.6&&near(u,.045,.01)&&!near(v,.25,.02)&&fr(v*7.3+u*3)>.3?'#8c8379':null],
 // N3 Asanoha: origami vzor konopných listů indigem.
 ['N3 Asanoha','#ffffff',(u,v)=>{const x=u*8,y=v*8*.577;return near(x,1,.025)||near(x+y*1.732,2,.05)||near(x-y*1.732,2,.05)?'#3d4f7a':null;}],
 // N4 Daybreak: lazura úsvitu přes nos (růžová → žlutá), jen tón, bez linek.
 ['N4 Daybreak','#ffffff',(u,v)=>u>.35?DAWN(u,v,'#ffe0e8','#fff0b0'):null],
];
// Šipka (geometry.planeShape dart): horní plochy = křídla s UV shora, spodní = kýl (base × #cdd3e3).
const N=[.55,0,0],T=[-.45,0,0],W=z=>[-.49,.05,z*.36],K=z=>[-.45,-.14,z*.012];
const TRIS=[[N,T,W(1),1],[N,T,W(-1),1],[N,K(1),T,0],[N,K(-1),T,0]];
const uvOf=p=>[(p[0]+.49)/1.04,(p[2]+.36)/.72];
const rot=([x,y,z],pitch=0,yaw=-.2,roll=.42)=>{let c=Math.cos(roll),s=Math.sin(roll);[y,z]=[y*c-z*s,y*s+z*c];c=Math.cos(yaw);s=Math.sin(yaw);[x,z]=[x*c+z*s,-x*s+z*c];return [x,y,z];};
const UNDER=hex('#cdd3e3').map(c=>c/255),INK=hex('#2a2622');
function draw(skin,{len,top,sky,ss=4}){
 const W_=Math.ceil(len*1.4+12),S=W_*ss,k=len*ss,base=hex(skin[1]),col=new Array(S*S).fill(null),mask=new Uint8Array(S*S);
 const P=TRIS.map(([a,b,c,up])=>({p:[a,b,c].map(v=>top?[v[0],-v[2],v[1]]:rot(v)),uv:[a,b,c].map(uvOf),up}));
 P.sort((a,b)=>a.p.reduce((s,v)=>s+v[2],0)-b.p.reduce((s,v)=>s+v[2],0));
 for(const {p,uv,up} of P){const q=p.map(v=>[S/2+v[0]*k,S/2-v[1]*k]),area=(q[1][0]-q[0][0])*(q[2][1]-q[0][1])-(q[2][0]-q[0][0])*(q[1][1]-q[0][1]);if(Math.abs(area)<1e-9)continue;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const px=x+.5,py=y+.5,w0=((q[1][0]-px)*(q[2][1]-py)-(q[2][0]-px)*(q[1][1]-py))/area,w1=((q[2][0]-px)*(q[0][1]-py)-(q[0][0]-px)*(q[2][1]-py))/area,w2=1-w0-w1;
   if(w0<0||w1<0||w2<0)continue;mask[y*S+x]=1;
   if(!up){col[y*S+x]=base.map((c,i)=>c*UNDER[i]);continue;}
   const u=w0*uv[0][0]+w1*uv[1][0]+w2*uv[2][0],v=w0*uv[0][1]+w1*uv[1][1]+w2*uv[2][1],pr=skin[2](u,v);col[y*S+x]=pr?hex(pr):base;}}
 const r=2.6*ss*(top?.6:1),ri=Math.ceil(r),ink=new Uint8Array(S*S);
 for(let y=0;y<S;y++)for(let x=0;x<S;x++)if(mask[y*S+x])for(let dy=-ri;dy<=ri;dy++)for(let dx=-ri;dx<=ri;dx++)if(dx*dx+dy*dy<=r*r){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<S&&Y<S)ink[Y*S+X]=1;}
 const img=new Float32Array(W_*W_*3),skyC=hex(sky);
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const i=y*S+x,c=mask[i]?col[i]:ink[i]?INK:skyC,o=((y/ss|0)*W_+(x/ss|0))*3;for(let j=0;j<3;j++)img[o+j]+=c[j]/(ss*ss);}
 return {W:W_,img};
}
const SKIES=['#a6d0e8','#7cbde0','#f6cb7c','#2b3f6b'],onBase=(s,b)=>[s[0],b,(u,v)=>{const c=s[2](u,v);return c==='#ffffff'?b:c;}];
const cols=S.map(s=>[[draw(s,{len:120,top:true,sky:'#f4ecdc',ss:2}),1],[draw(onBase(s,'#ead7b5'),{len:120,top:true,sky:'#f4ecdc',ss:2}),1],...SKIES.map(sky=>[draw(s,{len:24,sky}),4])]);
const cw=cols[0].map(([c,z])=>c.W*z),ch=Math.max(...cw),gap=6,half=8,Wt=2*(cw.reduce((a,b)=>a+b+gap,gap))+gap,Ht=half*(ch+gap)+gap,px=new Uint8Array(Wt*Ht*3).fill(217);
cols.forEach((row,r)=>{let x0=gap+(r>=half?Wt/2:0);const y0=gap+(r%half)*(ch+gap);row.forEach(([c,z],k)=>{for(let y=0;y<c.W*z;y++)for(let x=0;x<c.W*z;x++){const s=((y/z|0)*c.W+(x/z|0))*3,o=((y0+y)*Wt+x0+x)*3;px[o]=Math.round(c.img[s]);px[o+1]=Math.round(c.img[s+1]);px[o+2]=Math.round(c.img[s+2]);}x0+=cw[k]+gap;});});
function png(w,h,rgb){const crcT=new Int32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c;});
 const crc=b=>{let c=-1;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (c^-1)>>>0;};
 const chunk=(t,d)=>{const b=Buffer.alloc(12+d.length);b.writeUInt32BE(d.length,0);b.write(t,4);d.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,8+d.length)),8+d.length);return b;};
 const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;Buffer.from(rgb.buffer,y*w*3,w*3).copy(raw,y*(w*3+1)+1);}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
writeFileSync(OUT+'skiny.png',png(Wt,Ht,px));
// Průměrná světlost horní plochy (lineárně, jako mipmapa) z mřížky 200 × 200 listu.
const BASES={Copy:'#ffffff',Kraft:'#ead7b5',Washi:'#fbe8cc',Foil:'#e9edf2'};
for(const s of S){const r=Object.entries(BASES).map(([n,b])=>{const t=onBase(s,b);let L=0,n2=0,cov=0;for(let i=0;i<200;i++)for(let j=0;j<200;j++){const c=t[2](i/200,j/200);if(c&&c!==b)cov++;L+=Lum(hex(c??b));n2++;}return n+' '+(L/n2).toFixed(2)+(n==='Copy'?' (potisk '+Math.round(cov/n2*100)+' %)':'');});console.log(s[0].padEnd(22),r.join('  '));}
console.log('pořadí: levý sloupec 1–8, pravý 9–16:',S.map(s=>s[0]).join(' | '));
