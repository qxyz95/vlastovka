// Stavební díly katalogu modelů (čisté): vrací karty ve formátu paper-cards ({shape,x,w,y,h,z,d,color}, z = střed hloubky, čelo míří na +z).
// Souřadnice modelu: x na střed půdorysu, y = 0 zem, čelo hlavní stěny v z = 0, hloubka do −z, detail vystupuje do +z.
// Detail = vrstvený karton (bible 05 kap. 3, 10-katalog kap. 2): rám pod tabulkou, parapet a římsa s osvětleným horním řezem, ne textura.
// Tenké díly (11-katalog-ctvrt1.md kap. 1.3, scénář C): 'panel' jen čelo, 'lista' čelo + horní řez; detail pod ~1 px se nekreslí (D-1).
// Každá karta nese `part` (okno, dveře…), aby šlo v testech hlídat měřítko; cardVertices ho ignoruje.
import {mix,palette} from '../palette.js';
import {SCALE} from './scale.js';

// Celočíselný hash (deterministický, nezávislý na Math.sin): 0…1.
export const hash=(seed,i=0)=>{let h=Math.imul((seed|0)^0x9e3779b9,0x85ebca6b)^Math.imul((i|0)+0x632be5ab,0xc2b2ae35);h^=h>>>15;h=Math.imul(h,0x2c1b3c6d);h^=h>>>12;h=Math.imul(h,0x297a2d39);h^=h>>>15;return (h>>>0)/4294967296;};
export const pickOf=(list,seed,i)=>list[Math.floor(hash(seed,i)*list.length)%list.length];

// Tóny papíru ke stěně: výřez okna a dveří podle bible (mix se #3d4f7a), světlé jádro kartonu (cut) na rámy a parapety, sokl do studeného stínu.
export function tones(wall,district=0){
 const P=palette('papir').city,D=P.districts[Math.max(0,Math.min(P.districts.length-1,district|0))];
 return {wall,pane:mix(wall,D.window,.6),door:mix(wall,D.window,.75),frame:mix(wall,P.cut,.55),trim:mix(wall,P.cut,.3),plinth:mix(wall,P.side,.25),shade:mix(wall,P.side,.45),window:D.window,cut:P.cut};
}
// Kvádr s čelem ve `front` (z), hloubka d dozadu; panel (jen čelo) a lista (čelo + horní řez) stejně.
export const block=({x,w,y=0,h,front=0,d,color,part='wall',shape='box'})=>({shape,x,w,y,h,z:front-d/2,d,color,part});
export const panel=({d=.05,...o})=>block({...o,d,shape:'panel'});
export const lista=o=>block({...o,shape:'lista'});
// Sedlová střecha se štítem ke kameře (gable z paper-cards, včetně okapu na čele). Sklon jako paper-cards: výška = 0,42 šířky stěny, přesah ov.
// eaves:false = bez lemů okapu (LOD 2: lem 0,55 m je v dálce pod nejmenším detailem D-1).
export const ROOF_PITCH=.42;
export const gableRoof=({x,w,y,front=0,d,wall,roof,ov=.5,h=w*ROOF_PITCH,eaves=true})=>({shape:'gable',x:x-ov,w:w+2*ov,y,h,z:front+.2-(d+.4)/2,d:d+.4,color:wall,roof,part:'roof',...(eaves?{}:{eaves:false})});
// Střecha okapem ke kameře (11 kap. 1.3 eaveRoof): okap přesahuje čelo o ov, hřeben v půli hloubky, boční štíty v barvě stěny.
// back:false bez zadního sklonu (ze záběru hry ho nikdy není vidět, jen v katalogu dokola).
export const EAVE_H=3.2;
export const eaveRoof=({x,w,y,front=0,d,wall,roof,ov=.4,side=.2,h=EAVE_H,back=true})=>({shape:'eave',x:x-side,w:w+2*side,y,h,z:front+ov-(d+ov+.2)/2,d:d+ov+.2,color:wall,roof,part:'roof',...(back?{}:{back:false})});
// Výška střechy nad okapem v místě x (pro komín); u střechy okapem ke kameře je hřeben rovnoběžný s čelem.
export const roofAt=(r,x)=>r.shape==='eave'?r.y+r.h:r.shape==='flat'?r.y:r.y+r.h*Math.max(0,1-Math.abs(x-(r.x+r.w/2))/(r.w/2));
// Výška předního sklonu střechy okapem ke kameře v hloubce z.
export const slopeAt=(r,z)=>{const z1=r.z+r.d/2,zm=r.z;return r.y+r.h*Math.max(0,Math.min(1,(z1-z)/(z1-zm)));};
// Římsa / kordonová římsa: přeložený proužek (lista) vystupující o `out`, horní řez světlý (shader řeže plochy s normálou nahoru).
export const cornice=({x,w,y,h=.25,out=.25,front=0,color,part='cornice'})=>lista({x,w,y,h,front:front+out,d:out+.05,color,part});

// Okno (výřez): LOD 0 rám, tabulka, parapet, volitelně nadpraží, okenice a truhlík; LOD 1 jen tabulka; LOD 2 nic (silueta).
// Příčka (0,06 m, pod 1 px) jen na přání (mullion, Dílna v klidovém záběru). cx střed, y spodní hrana tabulky, rozměr tabulky = SCALE.win.
// Okenice = jedna deska za rámem, vykukuje vlevo i vpravo (levnější než dvě).
export function windowCut({cx,y,front=0,t,lod=0,w=SCALE.win.w,h=SCALE.win.h,shutter=null,flowers=null,lintel=false,mullion=false,part='window'}){
 if(lod>=2)return [];
 const x=cx-w/2,pane=panel({x,w,y,h,front:front+(lod?.1:.12),color:t.pane,part});
 if(lod===1)return [pane];
 const f=.14,out=[panel({x:x-f,w:w+2*f,y:y-f,h:h+2*f,front:front+.07,color:t.frame,part:'frame'}),pane,
  lista({x:x-f-.1,w:w+2*f+.2,y:y-f-.1,h:.12,front:front+.28,d:.28,color:t.trim,part:'sill'})];
 if(mullion)out.push(panel({x:cx-.03,w:.06,y,h,front:front+.15,color:t.frame,part:'mullion'}));
 if(lintel)out.push(lista({x:x-f-.05,w:w+2*f+.1,y:y+h+f,h:.16,front:front+.12,d:.12,color:t.trim,part:'lintel'}));
 if(shutter)out.push(panel({x:x-f-.55,w:w+2*f+1.1,y:y-.02,h:h+.04,front:front+.04,color:shutter,part:'shutter'}));
 if(flowers?.length){const bw=w+.1,by=y-f-.1-.32;out.push(lista({x:cx-bw/2,w:bw,y:by,h:.3,front:front+.42,d:.3,color:flowers[0],part:'flowerbox'}));
  flowers.slice(1).forEach((c,i,a)=>out.push({shape:'disc',x:cx-bw/2+bw*(i+.5)/a.length,y:by+.4,r:.18,n:4,z:front+.32,d:.08,color:c,part:'flower'}));}
 return out;
}
// Vchodové dveře: LOD 0 zárubeň, křídlo, schod a stříška (klika 0,1 m pod 1 px se nekreslí, D-1); LOD 1 jen křídlo; LOD 2 nic.
export function door({cx,y=0,front=0,t,lod=0,canopy=null}){
 if(lod>=2)return [];
 const {w,h}=SCALE.door,step=lod?0:.18,x=cx-w/2,leaf=panel({x,w,y:y+step,h,front:front+(lod?.1:.08),color:t.door,part:'door'});
 if(lod===1)return [leaf];
 const out=[panel({x:x-.16,w:w+.32,y:y+step,h:h+.16,front:front+.05,color:t.frame,part:'frame'}),leaf,
  lista({x:x-.3,w:w+.6,y,h:step,front:front+.45,d:.45,color:t.plinth,part:'step'})];
 if(canopy)out.push(lista({x:x-.35,w:w+.7,y:y+step+h+.3,h:.14,front:front+.75,d:.75,color:canopy,part:'canopy'}));
 return out;
}
// Průjezd (průchod do dvora místo dveří): světlá zárubeň a tmavý otvor, GATE = světlost v m (pod kordonem přízemí).
export const GATE=Object.freeze({w:2,h:2.6});
export function gate({cx,front=0,t,lod=0}){
 if(lod>=2)return [];
 const {w,h}=GATE,x=cx-w/2,hole=panel({x,w,y:0,h,front:front+.1,color:t.door,part:'gate'});
 return lod===1?[hole]:[panel({x:x-.16,w:w+.32,y:0,h:h+.16,front:front+.05,color:t.frame,part:'frame'}),hole];
}
// Balkon: deska (lista), zábradlí jako jedna vystřižená karta (panel 0,95 m místo sloupků pod 1 px, D-1) a madlo s horním řezem (lista).
export function balcony({cx,w,y,front=0,depth=.9,color,rail}){
 const x=cx-w/2;
 return [lista({x:x-.05,w:w+.1,y:y-.15,h:.15,front:front+depth,d:depth,color,part:'balcony'}),
  panel({x,w,y,h:.95,front:front+depth-.02,color:rail,part:'railing'}),lista({x,w,y:y+.95,h:.06,front:front+depth,d:.06,color:rail,part:'railing'})];
}
// Komín na střeše r v místě cx (11 kap. 3.2): dřík zapuštěný do střechy, horní hrana `above` nad hřebenem (u ploché střechy nad střechou).
// LOD 0 dřík + hlavice (lista 1,1 × 0,3 m) + 1–2 nástavce ⌀ 0,3 m (lista, hloubka 0,3 m); LOD 1 dřík; LOD 2 dřík jako lista.
// U střechy okapem ke kameře stojí na hřebeni (střed hloubky na hřebeni, pata na předním sklonu).
export function chimney({r,cx,w=.8,front=-1,d=.8,above=1,color,cap,lod=0,stacks=1}){
 if(r.shape==='eave')front=r.z+d/2;
 const y=r.shape==='flat'?r.y:r.shape==='eave'?slopeAt(r,front)-.3:Math.min(roofAt(r,cx-w/2),roofAt(r,cx+w/2))-.3,top=(r.shape==='flat'?r.y:r.y+r.h)+above;
 const shaft=block({x:cx-w/2,w,y,h:top-y,front,d,color,part:'chimney',shape:lod===2?'lista':'box'});
 if(lod>0)return [shaft];
 const out=[shaft,lista({x:cx-w/2-.15,w:w+.3,y:top,h:.3,front:front+.1,d:d+.2,color:cap,part:'chimney'})];
 for(let i=0;i<stacks;i++)out.push(lista({x:cx+(i-(stacks-1)/2)*w/stacks-.15,w:.3,y:top+.3,h:.35,front:front-d/2+.15,d:.3,color,part:'chimney'}));
 return out;
}
// Svod (dešťová trubka) u kraje fasády od okapu k zemi: 0,2 m široká karta (dlouhá svislá linka, čte se; D-1).
export const downpipe=({x,y,front=0,color})=>panel({x,w:.2,y:.2,h:y-.2,front:front+.2,color,part:'downpipe'});
// Kulaté okénko ve štítu (výřez): světlý lem a tmavé sklo, kotouče s n úseky (tenké, jen čelo).
export const oculus=({cx,y,r=.45,front,t,n=10})=>[{shape:'disc',x:cx,y,r:r+.12,n,z:front+.03,d:.06,color:t.frame,part:'oculus'},{shape:'disc',x:cx,y,r,n,z:front+.07,d:.06,color:t.pane,part:'oculus'}];

// Vikýř na střeše okapem ke kameře (11 kap. 1.3 dormer): LOD 0 tělo, sedlová stříška, okno (rám + tabulka) = 21 △; LOD 1 čelo, tabulka a štít = 5 △.
// y pata (nad okapem), front čelo vikýře, back hloubka těla (k hřebeni). Okno má rozměr SCALE.win.
export const DORMER=Object.freeze({w:2,h:1.9});
export function dormer({cx,y,front,back,t,roof,lod=0}){
 if(lod>=2)return [];
 const {w,h}=DORMER,x=cx-w/2,wy=y+.25,pane=SCALE.win;
 if(lod===1)return [panel({x,w,y,h,front,color:t.wall,part:'dormer'}),panel({x:cx-pane.w/2,w:pane.w,y:wy,h:pane.h,front:front+.1,color:t.pane,part:'dormer'}),
  {shape:'poly',x:x-.1,w:w+.2,y:y+h,h:.9,z:front-.025,d:.05,pts:[[x-.1,y+h],[x+w+.1,y+h],[cx,y+h+.9]],color:roof,part:'dormer'}];
 return [block({x,w,y,h,front,d:front-back,color:t.wall,part:'dormer'}),gableRoof({x,w,y:y+h,front:front+.15,d:front-back,wall:t.wall,roof,ov:.12,h:.9}),
  panel({x:cx-pane.w/2-.14,w:pane.w+.28,y:wy-.14,h:pane.h+.28,front:front+.07,color:t.frame,part:'dormer'}),panel({x:cx-pane.w/2,w:pane.w,y:wy,h:pane.h,front:front+.12,color:t.pane,part:'dormer'})].map(c=>({...c,part:'dormer'}));
}
// Výloha obchodu v přízemí (11 kap. 1.3 shopfront): x0…x1 světlost skla; LOD 0 rám a sklo (panel), markýza (lista) s lambrekýnem (flag po ~0,8 m)
// a vývěsní štít (lista) pod kordonem přízemí; LOD 1 rám a sklo. Sklo D1.glass, markýza jiná barva z D1.near, štít světlý řez stěny.
export function shopfront({x0,x1,front=0,t,glass,awning,lod=0}){
 if(lod>=2)return [];
 const w=x1-x0,out=[panel({x:x0-.15,w:w+.3,y:.35,h:1.9,front:front+.06,color:t.frame,part:'shop'}),panel({x:x0,w,y:.5,h:1.6,front:front+.1,color:glass,part:'shop'})];
 if(lod===1)return out;
 const aw=w+.3,n=Math.max(2,Math.round(aw/.8)),fw=aw/n;
 out.push(lista({x:x0-.15,w:aw,y:2.3,h:.12,front:front+1,d:1,color:awning,part:'canopy'}),lista({x:x0-.15,w:aw,y:2.45,h:.32,front:front+.1,d:.1,color:t.frame,part:'sign'}));
 for(let i=0;i<n;i++)out.push({shape:'flag',x:x0-.15+i*fw,w:fw,y:2.05,h:.25,z:front+.98,d:.04,color:awning,part:'shop'});
 return out;
}
// Vystřižený štít čela (11 kap. 1.3 steppedGable): 'stepped' 3 stupně (lista, světlý řez na stupních; od LOD 1 panel), 'bell' zvonový obrys
// (poly, LOD 0 jemný, jinak hrubý), 'plain' prostý trojúhelník (poly). x,w základna, y pata štítu, h výška štítu.
export const STEPS=3,BELL_NECK=1;
export function gableOutline({kind,x,w,y,h,fine=true}){
 const cx=x+w/2,R=w/2;
 if(kind==='plain')return [[x,y],[x+w,y],[cx,y+h]];
 if(kind==='bell'){const a=BELL_NECK,s=h*.4,sh=fine?[0,.5,1]:[0,1],arc=fine?[0,.25,.5,.75,1]:[0,.5,1],r=[];
  for(const u of sh)r.push([cx+a+(R-a)*Math.cos(u*Math.PI/2),y+s*Math.sin(u*Math.PI/2)]);
  for(const u of arc)r.push([cx+a*Math.cos(u*Math.PI),y+h-a+a*Math.sin(u*Math.PI)]);
  for(const u of [...sh].reverse())r.push([cx-a-(R-a)*Math.cos(u*Math.PI/2),y+s*Math.sin(u*Math.PI/2)]);
  return [[cx,y],...r.filter((p,i)=>!i||Math.hypot(p[0]-r[i-1][0],p[1]-r[i-1][1])>1e-9)];}
 // stupně: obrys pro stínový proxy (zjednodušený lichoběžník přes vrchní stupeň)
 const top=R/STEPS;return [[cx,y],[x+w,y],[cx+top,y+h],[cx-top,y+h],[x,y]];
}
export function steppedGable({kind,x,w,y,h,front=0,color,lod=0}){
 const cx=x+w/2;
 if(kind==='stepped')return Array.from({length:STEPS},(_,i)=>{const ww=w*(1-i/STEPS);return block({x:cx-ww/2,w:ww,y:y+i*h/STEPS,h:h/STEPS,front,d:.3,color,part:'gable',shape:lod?'panel':'lista'});});
 const pts=gableOutline({kind,x,w,y,h,fine:lod===0});
 return [{shape:'poly',x,w,y,h,z:front-.15,d:.3,pts,color,part:'gable'}];
}
// Stínový proxy (11 kap. 1.3, 08-stiny kap. 6): obrys ze tří a méně karet jen čelem, ≤ 7 △.
export const outline=(pts,{z=0,color,part='shadow'})=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);
 return {shape:'poly',x,w:Math.max(...xs)-x,y,h:Math.max(...ys)-y,z:z-.025,d:.05,pts,color,part};};

// Vystřižené čelo z bodů (CCW, jen čelo, pts.length − 2 △) a proužek mezi dvěma body šířky w (2 △): provázek, lano, rameno, konzola.
export const cutout=(pts,{front=0,color,part})=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);
 return {shape:'poly',x,w:Math.max(...xs)-x,y,h:Math.max(...ys)-y,z:front-.025,d:.05,pts,color,part};};
export const strip=([x0,y0],[x1,y1],w,o)=>{const l=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/l*w/2,ny=(x1-x0)/l*w/2;return cutout([[x0-nx,y0-ny],[x1-nx,y1-ny],[x1+nx,y1+ny],[x0+nx,y0+ny]],o);};
// Střecha v řezu (G2b, 11 kap. 3.7 H2): domeček pro panenky bez přední stěny podkroví. Dva sklony jako silné rajčatové pásy (čelo řezu, svislá
// tloušťka t) se světlým jádrem kartonu podél horní hrany (pás core, barva cut = mix(střecha, city.cut, .55)): 2 × (2 + 2) = 8 △; LOD 2 bez jádra 4 △.
// x,w stěna, y výška okapu na líci stěny (nadezdívka), h podhled hřebene nad ní, ov přesah za stěnu. Vrchní plochy sklonů se nekreslí:
// kamera míření (sklon −8°) i menu jsou pod hřebenem, světlé jádro zastoupí horní řez (jako u lista).
export const CUT_ROOF=Object.freeze({ov:.7,t:.45,core:.08});
export function cutRoof({x,w,y,h,front=0,roof,cut,ov=CUT_ROOF.ov,t=CUT_ROOF.t,core=CUT_ROOF.core,lod=0}){
 const s=h/(w/2),cx=x+w/2,A=[x-ov,y-ov*s],B=[x+w+ov,y-ov*s],R=[cx,y+h],up=([a,b],d)=>[a,b+d];
 const out=[cutout([A,R,up(R,t),up(A,t)],{front,color:roof,part:'roof'}),cutout([R,B,up(B,t),up(R,t)],{front,color:roof,part:'roof'})];
 if(lod<2)out.push(cutout([up(A,t-core),up(R,t-core),up(R,t),up(A,t)],{front:front+.02,color:cut,part:'roofCut'}),cutout([up(R,t-core),up(B,t-core),up(B,t),up(R,t)],{front:front+.02,color:cut,part:'roofCut'}));
 return out;
}
// Posun seznamu karet (umístění modelu do místa / vrstvy). Nemutuje vstup (body obrysu poly se posunou také).
export const place=(list,{x=0,y=0,z=0}={})=>list.map(c=>({...c,x:c.x+x,y:c.y+y,z:c.z+z,...(c.pts?{pts:c.pts.map(([a,b])=>[a+x,b+y])}:{})}));
// Obalový kvádr karet (kotouč podle poloměru, štít, jehlan a poly po obalu x,w,y,h).
export function bounds(list){
 const b={x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity,z0:Infinity,z1:-Infinity};
 for(const c of list){const [x0,x1,y0,y1]=c.shape==='disc'?[c.x-c.r,c.x+c.r,c.y-c.r,c.y+c.r]:[c.x,c.x+c.w,c.y,c.y+c.h];
  b.x0=Math.min(b.x0,x0);b.x1=Math.max(b.x1,x1);b.y0=Math.min(b.y0,y0);b.y1=Math.max(b.y1,y1);b.z0=Math.min(b.z0,c.z-c.d/2);b.z1=Math.max(b.z1,c.z+c.d/2);}
 return {...b,w:b.x1-b.x0,h:b.y1-b.y0,d:b.z1-b.z0};
}
