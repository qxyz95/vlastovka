// Čisté funkce 3D vykreslení (bez three.js a bez DOM). Vlastní R1: vlaštovka z trojúhelníků, kvádry a jehlany budov,
// rozložení města podle trasy (src/scenes.js) a kamera ze stejné logiky jako render.view(f). Testy: tests/render3d-geometry.test.js.
import {ROUTE,SCREEN_METERS,PIXELS_PER_METER} from '../scenes.js';
import {random} from '../random.js';
import {SUBURBS_LAYOUT} from './districts/suburbs-layout.js';
import {DOCKS_LAYOUT} from './districts/docks-layout.js';
import {HORIZON_LAYOUT} from './districts/horizon-layout.js';
import {CORE_LAYOUT} from './districts/core-layout.js';
// Ve 2D je vlaštovka vždy na px 148 a kamera = dolet, takže ve světě trasy leží 148 px (~70 m) před doletem.
export const PLANE_OFFSET=148/PIXELS_PER_METER;
export const WINDOW_TILE={w:24,h:28};// metry na jednu dlaždici textury oken (8 × 8 oken)
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
export const faceNormal=(a,b,c)=>norm(cross(sub(b,a),sub(c,a)));
// Otočí trojúhelník tak, aby jeho normála mířila ve směru `axis` (0 x, 1 y, 2 z) se znaménkem `sign`.
const orient=(t,axis,sign)=>faceNormal(...t)[axis]*sign<0?[t[0],t[2],t[1]]:t;
// Papírová skládačka: nos na +x, délka 1, křídla nahoře (lehké vzepětí), dvojitý kýl pod nimi.
const SHAPES={dart:{nose:.55,tail:-.45,keel:-.14,span:.36,lead:null},glider:{nose:.42,tail:-.45,keel:-.09,span:.5,lead:[.02,.03,.44]}};
export function planeShape(model='dart'){
 const s=SHAPES[model]??SHAPES.dart,N=[s.nose,0,0],T=[s.tail,0,0],tris=[];
 for(const side of [1,-1]){const W=[s.tail-.04,.05,side*s.span],K=[s.tail,s.keel,side*.012];
  tris.push(orient([N,T,W],1,1),orient([N,K,T],2,side));
  if(s.lead)tris.push(orient([N,W,[s.lead[0],s.lead[1],side*s.lead[2]]],1,1));}
 const positions=[],normals=[],outline=[],center=[(s.nose+s.tail)/2,-.02,0];
 for(const t of tris){const n=faceNormal(...t);for(const v of t){positions.push(...v);normals.push(...n);outline.push(...norm(sub(v,center)));}}
 // Přehyby: hřbet a hrana kýlu (čáry v barvě tématu).
 const creases=[...N,...T,...N,s.tail,s.keel,0];
 return {positions,normals,outline,creases,triangles:tris.length};
}
// Obrys vlaštovky razítkem (bible kap. 3: celý, ≥ 2,6 px, nejsilnější): n kopií trojúhelníků posunutých v px obrazovky po kružnici
// (toon.stampOutlineMaterial). Sjednocení obtáhne siluetu v každém natočení; radiální hull z `outline` mizel, kde mířil do hloubky (křídla).
// Délka posunu 1/cos(π/n): hrana libovolného směru dostane aspoň plnou tloušťku, nejvýš 1/cos(π/n) ≈ 1,08× (n = 8).
export const STAMP_DIRS=8;
export function outlineStamp(positions,n=STAMP_DIRS){
 const k=positions.length/3,pos=new Float32Array(k*3*n),shift=new Float32Array(k*2*n),r=1/Math.cos(Math.PI/n);
 for(let i=0;i<n;i++){const a=i*2*Math.PI/n,c=Math.cos(a)*r,s=Math.sin(a)*r;pos.set(positions,i*k*3);for(let j=0;j<k;j++){shift[(i*k+j)*2]=c;shift[(i*k+j)*2+1]=s;}}
 return {positions:pos,shift,count:k*n};
}
// Kvádr {x (levý okraj), w, z (střed), d, h, y (spodek, výchozí 0)}. Vrací zploštělé pole vrcholů bez dna.
// outline = součet normál stěn v rohu (±1,±1,±1): posun o t posune každou stěnu přesně o t (inverted hull).
// uv: okna podle metrů (WINDOW_TILE) s posunem ou/ov; střecha míří na tmavý okraj dlaždice.
export function boxVertices(b){
 const x0=b.x,x1=b.x+b.w,y0=b.y??0,y1=y0+b.h,z0=b.z-b.d/2,z1=b.z+b.d/2,ou=b.ou??0,ov=b.ov??0,TW=WINDOW_TILE.w,TH=WINDOW_TILE.h;
 const faces=[
  [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],[[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]],
  [[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]],[[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]],
  [[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]]];
 const out={positions:[],normals:[],uvs:[],outline:[]},cx=(x0+x1)/2,cy=(y0+y1)/2;
 for(const q of faces){const n=faceNormal(q[0],q[1],q[2]);for(const i of [0,1,2,0,2,3]){const v=q[i];out.positions.push(...v);out.normals.push(...n);
  out.outline.push(Math.sign(v[0]-cx),Math.sign(v[1]-cy),Math.sign(v[2]-b.z));
  out.uvs.push(...(n[1]>.5?[.002,.002]:n[2]?[(v[0]-x0)/TW+ou,(v[1]-y0)/TH+ov]:[(v[2]-z0)/TW+ou,(v[1]-y0)/TH+ov]));}}
 return out;
}
// Jehlan (hory, střechy, stromy): čtvercová podstava stejně jako kvádr, vrchol uprostřed.
export function pyramidVertices(b){
 const x0=b.x,x1=b.x+b.w,y0=b.y??0,z0=b.z-b.d/2,z1=b.z+b.d/2,A=[(x0+x1)/2,y0+b.h,b.z],out={positions:[],normals:[],uvs:[],outline:[]};
 for(const [p,q] of [[[x0,y0,z1],[x1,y0,z1]],[[x1,y0,z1],[x1,y0,z0]],[[x1,y0,z0],[x0,y0,z0]],[[x0,y0,z0],[x0,y0,z1]]]){
  const n=faceNormal(p,q,A);for(const v of [p,q,A]){out.positions.push(...v);out.normals.push(...n);out.uvs.push(.002,.002);
   out.outline.push(...(v===A?[0,1,0]:[Math.sign(v[0]-A[0]),0,Math.sign(v[2]-b.z)]));}}
 return out;
}
// Sloučí bloky do jednoho bufferu (jeden draw call na vrstvu). colorOf(block) → [r,g,b] 0–1.
export function mergeBlocks(blocks,colorOf=()=>[1,1,1]){
 const parts=blocks.map(b=>(b.type==='pyramid'?pyramidVertices:boxVertices)(b)),n=parts.reduce((s,p)=>s+p.positions.length/3,0);
 const m={position:new Float32Array(n*3),normal:new Float32Array(n*3),outline:new Float32Array(n*3),uv:new Float32Array(n*2),color:new Float32Array(n*3),count:n};
 let o=0;parts.forEach((p,i)=>{const k=p.positions.length/3,c=colorOf(blocks[i]);m.position.set(p.positions,o*3);m.normal.set(p.normals,o*3);m.outline.set(p.outline,o*3);m.uv.set(p.uvs,o*2);for(let j=0;j<k;j++)m.color.set(c,(o+j)*3);o+=k;});
 return m;
}
// Vrstvy hloubky za vlaštovkou (z=0): ulice, střed a panorama.
export const LAYERS={near:-26,mid:-110,far:-380};
// Parametry a zvláštnosti míst jsou v districts/<id>-layout.js (vlastní je agent čtvrti); tady jen obecné řady domů.
export const DISTRICT_LAYOUTS=[SUBURBS_LAYOUT,DOCKS_LAYOUT,HORIZON_LAYOUT,CORE_LAYOUT];
export const KIND_PARAMS=Object.assign({},...DISTRICT_LAYOUTS.map(l=>l.kinds));
export const placeIndex=screen=>((screen%ROUTE.length)+ROUTE.length)%ROUTE.length;
// Posun skupiny místa ve světě (m): obrazovka `screen` (0, 1, … i za 16) leží na screen*SCREEN_METERS. Vlaštovka je na f.x+PLANE_OFFSET.
export const chunkOffset=screen=>screen*SCREEN_METERS;
// Jedno místo trasy (index 0–15, větší se zabalí) → bloky a zem v LOKÁLNÍCH souřadnicích (x 0…SCREEN_METERS),
// takže výsledek jde kešovat podle indexu a skupinu jen posunout o chunkOffset(screen). Seed = index, místa se po 16 opakují.
// Blok staré Dílny (shop:true) v indexu 0 zůstává jen kvůli pořadí náhody; město ho nekreslí (místo odhodu jsou modely, city.js).
// tone: 0 ulice, 1 střed, 2 panorama, 3 akcent (kontejnery, vlak), 4 zeleň, 5 hory.
// opts.view = pás výhledu S-1 (jen Papírové město, jen první obrazovka místa 0): domy ulice a středu kolem startu snížené (viewCap), až po
// vygenerování, takže pořadí náhody, šířky i polohy zůstávají (bez opts stejné místo jako dřív).
export function cityChunk(index,{view=false}={}){
 index=placeIndex(index);const kind=ROUTE[index].kind,biome=Math.floor(index/4),L=DISTRICT_LAYOUTS[biome],k=L.kinds[kind],rng=random(index*7919+13),W=SCREEN_METERS;
 const blocks=[],between=(a,b)=>a+rng()*(b-a);
 const add=b=>{const block={type:'box',y:0,biome,tone:0,ou:Math.floor(rng()*8)/8,ov:Math.floor(rng()*8)/8,...b};blocks.push(block);return block;};
 const row=(z,d,[dens=0,hmin,hmax,wmin=12,wmax=26],tone,gap=2)=>{const out=[];for(let x=0;x<W-wmin;){const w=Math.min(between(wmin,wmax),W-x);if(rng()<dens)out.push(add({x,w:w-gap,z:z-rng()*6,d,h:between(hmin,hmax),tone}));x+=w;}return out;};
 // Panorama: v jádře metropole vyšší a hustší, na polích a horách řídké.
 const tall=L.tall;
 row(LAYERS.far,50,[k.open?.25:.85,30*tall,150*tall,18,40],2,6);
 const mid=row(LAYERS.mid,26,k.mid,1,3),near=row(LAYERS.near,14,k.near,0);
 if(index===0)add({x:20,w:24,z:-10,d:10,h:12,tone:3,shop:true});
 L.extras(kind,{add,rng,between,W,index});
 return {index,kind,biome,district:L.id,x0:0,x1:W,blocks:view&&index===0?blocks.map(viewCap):blocks,ground:{x0:0,x1:W,biome,water:biome===1}};
}
// Pás výhledu S-1 (bible 05 kap. 9.3, rozhodnutí 06 bod 5): ruka 12 m (launch-site LAUNCH.hand, x = PLANE_OFFSET). Střed (tone 1) do reach m
// od ruky (vodorovně, podle nejbližší hrany domu) nejvýš h = ruka + 1 m, ulice (tone 0) do 60 m nejvýš ruka − 1 m; za reach strop lineárně
// roste a za reach + ramp končí (top = nejvyšší dům vrstvy ve čtvrti 1, dál výšky jako dřív). cap = strop celé výšky včetně střechy (paper-cards).
export const VIEW_BAND=Object.freeze({x:PLANE_OFFSET,mid:Object.freeze({h:13,reach:150,ramp:100,top:40}),near:Object.freeze({h:11,reach:60,ramp:100,top:22})});
export const viewCapAt=(layer,d)=>{const L=VIEW_BAND[layer];return d<=L.reach?L.h:d>=L.reach+L.ramp?Infinity:L.h+(L.top-L.h)*(d-L.reach)/L.ramp;};
export function viewCap(b){
 if(b.shop||(b.tone!==0&&b.tone!==1)||b.h<1)return b;
 const cap=viewCapAt(b.tone===1?'mid':'near',Math.max(0,b.x-VIEW_BAND.x,VIEW_BAND.x-(b.x+b.w)));
 return cap===Infinity?b:{...b,h:Math.min(b.h,cap),cap};
}
// Kamera jako render.view(f), jen v metrech: vlaštovka na px/640 zleva, zem 60/360 nad spodním okrajem,
// nad 190/360 výšky obrazu se kamera zvedá. width = viditelná šířka v metrech ve hloubce letu (hra: 640/2,1).
export function follow(x,y,{width=640/PIXELS_PER_METER,aspect=16/9,px=148/640,ground=60/360,top=110/360}={}){
 const height=width/aspect,lift=Math.max(0,y-height*(1-top-ground));
 return {cx:x+width*(.5-px),cy:lift+height*(.5-ground),width,height,lift};
}
// Rychlé tempo podle 08-navrh-kolo2 §2.5: oddálení clamp(1 − .035·(π − 1), .7, 1) a posun vlaštovky z px 148 na 120.
export const tempoZoom=k=>Math.max(.7,Math.min(1,1-.035*(k-1)));
export const tempoPx=k=>(148-28*(1-tempoZoom(k))/.3)/640;
// Perspektivní kamera z boku: vzdálenost tak, aby ve hloubce z=0 byla vidět výška `height`; mírný pohled shora (pitch).
export function sideCamera(v,fov=20,pitch=6){
 const dist=v.height/2/Math.tan(fov*Math.PI/360),up=dist*Math.tan(pitch*Math.PI/180);
 return {position:[v.cx,v.cy+up,dist],target:[v.cx,v.cy,0],dist};
}
