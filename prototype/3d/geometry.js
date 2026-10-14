// Čisté funkce 3D prototypu (bez three.js a bez DOM): vlaštovka z trojúhelníků, kvádry a jehlany budov,
// rozložení města podle trasy (src/scenes.js) a kamera ze stejné logiky jako render.view(f). Testy: tests/prototype3d.test.js.
import {ROUTE,SCREEN_METERS,PIXELS_PER_METER} from '../../src/scenes.js';
import {random} from '../../src/random.js';
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
// Vymyšlené neonové reklamy (anglicky jako ve hře, žádné skutečné značky).
export const SIGNS=['PAPER LAB','NOODLES','OPEN 24H','FOLD & FLY','KARAOKE','HOTEL','RAMEN','ARCADE','GLIDE','SKY BAR','CAFE','TAXI'];
export const NEON=['#ff4fc3','#53e6ff','#ffb347','#9dff6a','#c77dff'];
// Vrstvy hloubky za vlaštovkou (z=0): ulice, střed a panorama. Popředí (z>0) jen nízké lampy, aby nezakrylo let.
export const LAYERS={near:-26,mid:-110,far:-380};
// Parametry míst: hustota, rozsah výšek a šířek pro ulici a střed, podíl reklam. Speciality řeší cityChunk.
const K={
 roofs:{near:[.9,8,22,10,18],mid:[.85,16,40],signs:.35},market:{near:[.95,6,14,8,12],mid:[.8,14,34],signs:.8},
 garden:{near:[.25,5,9,8,12],mid:[.5,10,24],signs:.1,trees:14},rail:{near:[.5,6,12,14,22],mid:[.7,12,30],signs:.2,train:true},
 warehouse:{near:[.85,8,14,24,40],mid:[.6,10,22],signs:.3},cranes:{near:[.4,6,10,16,26],mid:[.5,10,20],signs:.15,cranes:3},
 bridge:{near:[0],mid:[.3,8,16],signs:0,bridge:true},lighthouse:{near:[.15,4,8,10,16],mid:[.3,6,14],signs:.1,lighthouse:true},
 fields:{near:[0],mid:[.25,5,10],signs:0},turbines:{near:[0],mid:[.2,5,10],signs:0,turbines:5},
 peaks:{near:[0],mid:[0],signs:0,peaks:true},observatory:{near:[.2,5,9,10,14],mid:[0],signs:.1,peaks:true,observatory:true},
 gate:{near:[.6,10,24,10,16],mid:[.8,20,50],signs:.5,gate:true},terraces:{near:[.7,8,18,12,20],mid:[.85,24,60],signs:.4,terraces:true},
 tower:{near:[.8,12,30,10,16],mid:[.9,30,80],signs:.5,tower:true},port:{near:[.9,14,34,10,18],mid:[.95,30,90],signs:.6}};
export const KIND_PARAMS=K;
// Jedno místo trasy (screen = index obrazovky 305 m, opakuje se po 16) → bloky, reklamy, lampy a zem.
// tone: 0 ulice, 1 střed, 2 panorama, 3 akcent (kontejnery, vlak), 4 zeleň, 5 hory.
export function cityChunk(screen){
 const index=screen%ROUTE.length,kind=ROUTE[index].kind,biome=Math.floor(index/4),k=K[kind],rng=random(screen*7919+13),x0=screen*SCREEN_METERS,W=SCREEN_METERS;
 const blocks=[],signs=[],lamps=[],between=(a,b)=>a+rng()*(b-a);
 const add=b=>{const block={type:'box',y:0,biome,tone:0,ou:Math.floor(rng()*8)/8,ov:Math.floor(rng()*8)/8,...b};blocks.push(block);return block;};
 const row=(z,d,[dens=0,hmin,hmax,wmin=12,wmax=26],tone,gap=2)=>{const out=[];for(let x=x0;x<x0+W-wmin;){const w=Math.min(between(wmin,wmax),x0+W-x);if(rng()<dens)out.push(add({x,w:w-gap,z:z-rng()*6,d,h:between(hmin,hmax),tone}));x+=w;}return out;};
 // Panorama: v jádře metropole vyšší a hustší, na polích a horách řídké.
 const tall=[1,.7,.5,1.4][biome],open=['fields','turbines','peaks','observatory'].includes(kind);
 row(LAYERS.far,50,[open?.25:.85,30*tall,150*tall,18,40],2,6);
 const mid=row(LAYERS.mid,26,k.mid,1,3),near=row(LAYERS.near,14,k.near,0);
 if(screen===0)add({x:20,w:24,z:-10,d:10,h:12,tone:3,shop:true});// dílna PAPER LAB u startu
 if(k.trees)for(let i=0;i<k.trees;i++)add({type:'pyramid',x:x0+rng()*W,w:4,z:-14-rng()*10,d:4,h:between(6,11),tone:4});
 if(k.train){for(let i=0;i<5;i++)add({x:x0+60+i*21,w:20,z:-9,d:4,h:4.5,y:.4,tone:3});add({x:x0,w:W,z:-9,d:5,h:.4,tone:1});}
 if(k.cranes)for(let i=0;i<k.cranes;i++){const cx=x0+40+i*W/k.cranes;add({x:cx,w:2.5,z:-45,d:2.5,h:46,tone:3});add({x:cx-14,w:44,z:-45,d:2,h:3,y:42,tone:3});for(let j=0;j<4;j++)add({x:cx+10+j*7,w:6,z:-30,d:3,h:3,y:j%2*3,tone:3});}
 if(k.bridge){add({x:x0,w:W,z:-14,d:8,h:2,y:9,tone:1});for(let x=x0+20;x<x0+W;x+=70)add({x,w:3,z:-14,d:9,h:34,tone:1});}
 if(k.lighthouse){const b=add({x:x0+W*.7,w:5,z:-32,d:5,h:34,tone:0});add({x:b.x-1,w:7,z:-32,d:7,h:4,y:34,tone:3,beacon:true});}
 if(k.turbines)for(let i=0;i<k.turbines;i++){const x=x0+30+i*W/k.turbines;add({x,w:1.4,z:-70,d:1.4,h:44,tone:1});add({x:x-11,w:24,z:-69,d:.6,h:1,y:43,tone:1});add({x:x-.2,w:1.8,z:-69,d:.6,h:24,y:32,tone:1});}
 if(k.peaks)for(let i=0;i<5;i++){const w=between(90,180);add({type:'pyramid',x:x0+i*W/5-w/4,w,z:-200-rng()*80,d:w*.6,h:between(50,120),tone:5});}
 if(k.observatory){add({x:x0+W*.55,w:14,z:-60,d:14,h:10,y:30,tone:1});add({x:x0+W*.55-30,w:74,z:-60,d:30,h:30,tone:5});add({type:'pyramid',x:x0+W*.55+1,w:12,z:-60,d:12,h:8,y:40,tone:3});}
 if(k.gate){for(const f of [.35,.6])add({x:x0+W*f,w:7,z:-40,d:7,h:60,tone:0});add({x:x0+W*.35,w:W*.25+7,z:-40,d:6,h:5,y:55,tone:3,sign:'METROPOLIS'});}
 if(k.terraces)for(let i=0;i<4;i++)add({x:x0+80+i*14,w:40-i*8,z:-60+i*6,d:14,h:46-i*10,tone:1});
 if(k.tower){const x=x0+W*.5;add({x,w:14,z:-70,d:14,h:180,tone:1});add({x:x+6,w:2,z:-70,d:2,h:40,y:180,tone:3,beacon:true});}
 // Reklamy na čelech ulice a středu: vodorovné nad přízemím, svislé na vyšších domech.
 for(const b of [...near,...mid])if(b.h>9&&rng()<k.signs){const vertical=b.h>22&&rng()<.4,w=vertical?2.4:Math.min(b.w-2,between(6,11)),h=vertical?between(7,12):2.6;
  signs.push({x:b.x+between(1,Math.max(1,b.w-w-1)),y:vertical?between(6,b.h-h-1):Math.min(b.h-h-1,between(4,b.h*.6)),z:b.z+b.d/2+.4,w,h,vertical,text:SIGNS[Math.floor(rng()*SIGNS.length)],color:NEON[Math.floor(rng()*NEON.length)]});}
 for(const b of blocks)if(b.sign)signs.push({x:b.x+b.w*.25,y:b.y+.8,z:b.z+b.d/2+.4,w:b.w*.5,h:3.4,text:b.sign,color:NEON[1]});
 if(screen===0)signs.push({x:22,y:7.5,z:-4.6,w:20,h:3,text:'PAPER LAB',color:NEON[0]});
 if(!['bridge','fields','peaks','turbines'].includes(kind))for(let x=x0+15;x<x0+W;x+=45)lamps.push({x,z:9,h:6,color:NEON[biome%NEON.length]});
 return {screen,index,kind,biome,x0,x1:x0+W,blocks,signs,lamps,ground:{x0,x1:x0+W,biome,water:biome===1}};
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
