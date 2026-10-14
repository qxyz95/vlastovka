// Siluety navržených modelů vlaštovek (art-director, 14. 10. 2026, research/obsah/03-vzhled-modelu-a-skinu.md).
// Bez závislostí: node research/design/img/obsah/siluety.mjs [--pruzkum] → siluety[-pruzkum].png, siluety[-pruzkum]-seda.png a tabulka rozlišitelnosti na stdout.
// Konvence jako src/render3d/geometry.planeShape: nos +x, délka 1, y nahoru, z rozpětí. Póza za letu jako frame.js tilt (roll .42, yaw −.2)
// a pitch z úhlu letu. Promítání ortografické (kamera hry je daleko, vlaštovka malá). Obrys = dilatace masky o 2,6 px (razítko, bible 05 kap. 3).
// Barvy: výplň #ffffff nahoře, #cdd3e3 spodní plochy (PAPIR.plane), obrys #2a2622, nebe čtvrti 1 (#a6d0e8) a čtvrti 4 (#2b3f6b).
import {writeFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const OUT=fileURLToPath(new URL('.',import.meta.url));
const mirror=(tris)=>tris.flatMap(t=>[t,t.map(([x,y,z])=>[x,y,-z])]);
// Každý model: trojúhelníky jedné poloviny (zrcadlí se) + středové. Čísla jsou návrh tvaru, ne fyzika.
const M={
 dart:{name:'Dart / Šipka',half:[[[.55,0,0],[-.45,0,0],[-.49,.05,.36]],[[.55,0,0],[-.45,-.14,.012],[-.45,0,0]]]},
 glider:{name:'Glider / Kluzák',half:[[[.42,0,0],[-.45,0,0],[-.49,.05,.5]],[[.42,0,0],[-.45,-.09,.012],[-.45,0,0]],[[.42,0,0],[-.49,.05,.5],[.02,.03,.44]]]},
 // ── Návrh pro 01-game-design §2 (výchozí sada): Hawk, Kite, Skimmer, Sail, Needle, Night Owl. Výše jsou varianty z průzkumu (--pruzkum).
 hawk:{name:'Hawk / Sokol',half:[[[.55,0,0],[-.45,0,0],[.1,.02,.05]],[[.18,.02,.04],[-.08,.02,.04],[-.36,.07,.6]],[[.18,.02,.04],[-.36,.07,.6],[-.24,.07,.62]],[[.55,0,0],[-.45,-.1,.012],[-.45,0,0]]]},
 kite:{name:'Kite / Drak',half:[[[.3,0,.06],[-.45,0,0],[-.45,.3,.56]],[[.3,0,.06],[-.45,.3,.56],[-.05,.3,.58]],[[.3,0,0],[.3,0,.06],[-.45,0,0]],[[.3,0,0],[-.45,-.05,.012],[-.45,0,0]]]},
 skimmer:{name:'Skimmer / Žabka',half:[[[.42,0,.13],[-.45,0,0],[-.4,-.2,.4]],[[.42,0,.13],[-.4,-.2,.4],[.1,-.16,.4]],[[.42,0,0],[.42,0,.13],[-.45,0,0]],[[.42,0,0],[-.45,-.02,.012],[-.45,0,0]]]},
 sail:{name:'Sail / Plachta',half:[[[.55,0,0],[-.45,0,0],[-.49,.05,.3]],[[.55,0,0],[-.45,-.08,.012],[-.45,0,0]],[[.15,0,.01],[-.45,0,.01],[-.4,.52,.01]]]},
 needle:{name:'Needle / Jehla',half:[[[.55,0,0],[-.45,0,0],[-.47,.03,.16]],[[.55,0,0],[-.45,-.05,.012],[-.45,0,0]],[[-.3,0,.012],[-.47,0,.012],[-.47,-.16,.012]]]},
 owl:{name:'Night Owl / Sova (rezerva: vidlice)',half:[[[.5,0,0],[-.1,0,0],[-.72,.12,.4]],[[-.1,0,0],[-.38,.04,.08],[-.72,.12,.4]],[[.5,0,0],[-.1,-.12,.012],[-.1,0,0]]]},
 PRUZKUM_START:null,
 // Široké křídlo: delta s useknutými konci (rovná hrana na špičce křídla), mělký kýl.
 wide:{name:'Wide Wing / Široké křídlo',half:[[[.3,0,.07],[-.45,0,0],[-.47,.04,.78]],[[.3,0,.07],[-.47,.04,.78],[-.1,.04,.78]],[[.3,0,0],[.3,0,.07],[-.45,0,0]],[[.3,0,0],[-.45,-.05,.012],[-.45,0,0]]]},
 // Těžký nos: kýl nejhlubší vpředu (nos přeložený 3×), krátká křídla, tupá špička.
 heavy:{name:'Heavy Nose / Těžký nos',half:[[[.42,.0,0],[-.45,0,0],[-.47,.05,.28]],[[.42,0,.03],[.22,-.3,.03],[-.45,-.03,.012]],[[.42,0,.03],[-.45,-.03,.012],[-.45,0,0]],[[.42,0,.03],[.46,-.18,.03],[.22,-.3,.03]]]},
 // Dvouplošník: spodní křídlo jako šipka, horní menší a posunuté o 0,17 nahoru a 0,08 dopředu (vzpěry jen jako přehyb).
 biplane:{name:'Biplane / Dvouplošník',half:[[[.5,0,0],[-.45,0,0],[-.49,.04,.4]],[[.5,0,0],[-.45,-.1,.012],[-.45,0,0]],[[.45,.38,0],[-.25,.38,0],[-.3,.41,.26]],[[.08,.02,.03],[.02,.02,.03],[.02,.38,.03]]]},
 // Zahnuté konce: šipka se svislými ploutvičkami nahoru na koncích křídel.
 winglet:{name:'Fin Tips / Ploutvičky',half:[[[.55,0,0],[-.45,0,0],[-.49,.05,.36]],[[.55,0,0],[-.45,-.12,.012],[-.45,0,0]],[[-.49,.05,.36],[-.15,.05,.36],[-.47,.36,.36]]]},
 // Vlaštovčí ocas: konce křídel přesahují ocas dozadu, uprostřed zářez (vidlice).
 swallow:{name:'Swallowtail / Vidlice',half:[[[.5,0,0],[-.1,0,0],[-.85,.12,.42]],[[-.1,0,0],[-.4,.04,.08],[-.85,.12,.42]],[[.5,0,0],[-.1,-.12,.012],[-.1,0,0]]]},
 // Albatros: dlouhá rovná křídla kolmo k trupu (vysoká štíhlost), úzký trup.
 albatross:{name:'Long Wing / Albatros',half:[[[.5,0,0],[-.45,0,0],[.05,.02,.06]],[[.12,.02,.04],[-.1,.02,.04],[-.04,.05,.62]],[[.12,.02,.04],[-.04,.05,.62],[.06,.05,.62]],[[.5,0,0],[-.45,-.08,.012],[-.45,0,0]]]},
};
const ALL=Object.keys(M),cut=ALL.indexOf('PRUZKUM_START'),PR=process.argv.includes('--pruzkum');delete M.PRUZKUM_START;
const IDS=PR?['dart','glider',...ALL.slice(cut+1)]:ALL.slice(0,cut);const SUF=PR?'-pruzkum':'';
const rot=(v,{pitch=0,yaw=-.2,roll=.42})=>{let [x,y,z]=v;
 let c=Math.cos(roll),s=Math.sin(roll);[y,z]=[y*c-z*s,y*s+z*c];
 c=Math.cos(yaw);s=Math.sin(yaw);[x,z]=[x*c+z*s,-x*s+z*c];
 c=Math.cos(pitch);s=Math.sin(pitch);[x,y]=[x*c-y*s,x*s+y*c];return [x,y,z];};
const sub=(a,b)=>a.map((v,i)=>v-b[i]),cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
// Rasterizace do pole RGB (supersampling SS), malířův algoritmus podle z.
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function render(id,{len,pose,sky,top=false,ss=4,pad=6}){
 const tris=mirror(M[id].half).map(t=>({t,up:(n=>n[1]>=0)(cr(sub(t[1],t[0]),sub(t[2],t[0])))}));
 const P=tris.map(({t,up})=>({p:t.map(v=>top?[v[0],-v[2],v[1]]:rot(v,pose)),up:top?true:Math.abs(cr(sub(t[1],t[0]),sub(t[2],t[0]))[1])/Math.hypot(...cr(sub(t[1],t[0]),sub(t[2],t[0])))>.3}));
 const W=Math.ceil(len*1.5+pad*2),H=W,S=W*ss,k=len*ss,cx=S/2,cy=S/2;
 const mask=new Uint8Array(S*S),col=new Uint8Array(S*S);// col 1 = top, 2 = under
 P.sort((a,b)=>a.p.reduce((s,v)=>s+v[2],0)-b.p.reduce((s,v)=>s+v[2],0));
 for(const {p,up} of P){const q=p.map(v=>[cx+v[0]*k,cy-v[1]*k]);const xs=q.map(v=>v[0]),ys=q.map(v=>v[1]);
  const area=(q[1][0]-q[0][0])*(q[2][1]-q[0][1])-(q[2][0]-q[0][0])*(q[1][1]-q[0][1]);if(Math.abs(area)<1e-9)continue;
  for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(S-1,Math.ceil(Math.max(...ys)));y++)for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(S-1,Math.ceil(Math.max(...xs)));x++){
   const px=x+.5,py=y+.5,w0=((q[1][0]-px)*(q[2][1]-py)-(q[2][0]-px)*(q[1][1]-py))/area,w1=((q[2][0]-px)*(q[0][1]-py)-(q[0][0]-px)*(q[2][1]-py))/area,w2=1-w0-w1;
   if(w0>=0&&w1>=0&&w2>=0){mask[y*S+x]=1;col[y*S+x]=up?1:2;}}}
 // Obrys: dilatace o 2,6 px (v sub-pixelech 2,6·ss).
 const r=2.6*ss,ri=Math.ceil(r),out=new Uint8Array(S*S);
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){if(!mask[y*S+x])continue;for(let dy=-ri;dy<=ri;dy++)for(let dx=-ri;dx<=ri;dx++){if(dx*dx+dy*dy>r*r)continue;const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<S&&Y<S)out[Y*S+X]=1;}}
 const C={sky:hex(sky),top:hex('#ffffff'),under:hex('#cdd3e3'),ink:hex('#2a2622')},img=new Float32Array(W*H*3),sil=new Uint8Array(W*H);
 for(let y=0;y<S;y++)for(let x=0;x<S;x++){const i=y*S+x,c=mask[i]?(col[i]===1?C.top:C.under):out[i]?C.ink:C.sky,o=((y/ss|0)*W+(x/ss|0))*3;for(let j=0;j<3;j++)img[o+j]+=c[j]/(ss*ss);if(out[i])sil[(y/ss|0)*W+(x/ss|0)]++;}
 return {W,H,img,sil:sil.map(v=>v>=ss*ss/2?1:0)};
}
// Rozlišitelnost: IoU masek siluet (s obrysem) po zarovnání těžišť; 1 = stejné, < 0,75 = rozlišitelné na první pohled (pracovní práh).
function iou(a,b){const cen=s=>{let n=0,x=0,y=0;for(let i=0;i<s.sil.length;i++)if(s.sil[i]){n++;x+=i%s.W;y+=i/s.W|0;}return [x/n,y/n];};
 const [ax,ay]=cen(a),[bx,by]=cen(b),dx=Math.round(bx-ax),dy=Math.round(by-ay);let I=0,U=0;
 for(let y=0;y<a.H;y++)for(let x=0;x<a.W;x++){const A=a.sil[y*a.W+x],X=x+dx,Y=y+dy,B=X>=0&&Y>=0&&X<b.W&&Y<b.H?b.sil[Y*b.W+X]:0;if(A&&B)I++;if(A||B)U++;}return I/U;}
const POSES={rovne:{pitch:0},stoupa:{pitch:.3},klesa:{pitch:-.35}};
const PHONE=24,DESK=58;// CSS px délky vlaštovky: telefon 21 × 1,15 ≈ 24, desktop 58 (bible 05 kap. 3)
const worst={};
for(const [pn,pose] of Object.entries(POSES)){const R=Object.fromEntries(IDS.map(id=>[id,render(id,{len:PHONE,pose,sky:'#a6d0e8'})]));
 for(let i=0;i<IDS.length;i++)for(let j=i+1;j<IDS.length;j++){const k=IDS[i]+' × '+IDS[j],v=iou(R[IDS[i]],R[IDS[j]]);worst[k]=Math.max(worst[k]??0,v);}}
console.log('IoU siluet na telefonu (24 px, nejhorší ze 3 póz), seřazeno:');
for(const [k,v] of Object.entries(worst).sort((a,b)=>b[1]-a[1]))console.log(v.toFixed(2),k);
// List: řádek = model; sloupce: telefon 24 px zvětšený 4× (nejbližší soused), desktop 58 px, telefon večer 4×, pohled shora 58 px.
function sheet(gray){
 const cells=IDS.map(id=>[[render(id,{len:PHONE,pose:POSES.rovne,sky:'#a6d0e8'}),4],[render(id,{len:PHONE,pose:POSES.klesa,sky:'#a6d0e8'}),4],[render(id,{len:DESK,pose:POSES.rovne,sky:'#a6d0e8'}),2],[render(id,{len:PHONE,pose:POSES.rovne,sky:'#2b3f6b'}),4],[render(id,{len:DESK,top:true,sky:'#efe3cf'}),2]]);
 const cw=cells[0].map(([c,z])=>c.W*z),ch=Math.max(...cells[0].map(([c,z])=>c.H*z)),gap=6,Wt=cw.reduce((a,b)=>a+b+gap,gap),Ht=IDS.length*(ch+gap)+gap;
 const px=new Uint8Array(Wt*Ht*3).fill(217);
 cells.forEach((row,r)=>{let x0=gap;row.forEach(([c,z],k)=>{const y0=gap+r*(ch+gap);for(let y=0;y<c.H*z;y++)for(let x=0;x<c.W*z;x++){const s=((y/z|0)*c.W+(x/z|0))*3,o=((y0+y)*Wt+x0+x)*3;let v=[c.img[s],c.img[s+1],c.img[s+2]];if(gray){const g=.2126*v[0]+.7152*v[1]+.0722*v[2];v=[g,g,g];}px.set(v.map(Math.round),o);}x0+=cw[k]+gap;});});
 return png(Wt,Ht,px);
}
function png(w,h,rgb){const crcT=new Int32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c;});
 const crc=b=>{let c=-1;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (c^-1)>>>0;};
 const chunk=(t,d)=>{const b=Buffer.alloc(12+d.length);b.writeUInt32BE(d.length,0);b.write(t,4);d.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,8+d.length)),8+d.length);return b;};
 const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;Buffer.from(rgb.buffer,y*w*3,w*3).copy(raw,y*(w*3+1)+1);}
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
writeFileSync(OUT+'siluety'+SUF+'.png',sheet(false));writeFileSync(OUT+'siluety'+SUF+'-seda.png',sheet(true));
console.log('řádky:',IDS.map(id=>M[id].name).join(' | '));
// Plocha siluety (s obrysem) proti šipce a poloměr opsané kružnice od těžiště v délkách vlaštovky (QTE: volný střed kruhu = 21 log. px ≈ 0,72 délky na desktopu).
{const R=Object.fromEntries(IDS.map(id=>[id,render(id,{len:PHONE,pose:POSES.rovne,sky:'#a6d0e8'})])),area=s=>s.sil.reduce((a,b)=>a+b,0);
 console.log('plocha / šipka a poloměr (délky):',IDS.map(id=>{const s=R[id];let n=0,cx=0,cy=0;s.sil.forEach((v,i)=>{if(v){n++;cx+=i%s.W;cy+=i/s.W|0;}});cx/=n;cy/=n;let r=0;s.sil.forEach((v,i)=>{if(v)r=Math.max(r,Math.hypot(i%s.W-cx,(i/s.W|0)-cy));});return id+' '+(area(s)/area(R.dart)).toFixed(2)+' r '+(r/PHONE).toFixed(2);}).join(', '));}
console.log('△ na model:',IDS.map(id=>id+' '+mirror(M[id].half).length).join(', '));
