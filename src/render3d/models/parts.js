// Stavební díly katalogu modelů (čisté): vrací karty ve formátu paper-cards ({shape,x,w,y,h,z,d,color}, z = střed hloubky, čelo míří na +z).
// Souřadnice modelu: x na střed půdorysu, y = 0 zem, čelo hlavní stěny v z = 0, hloubka do −z, detail vystupuje do +z.
// Detail = vrstvený karton (bible 05 kap. 3, 10-katalog kap. 2): rám pod tabulkou, parapet a římsa s osvětleným horním řezem, ne textura.
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
// Kvádr s čelem ve `front` (z), hloubka d dozadu.
export const block=({x,w,y=0,h,front=0,d,color,part='wall'})=>({shape:'box',x,w,y,h,z:front-d/2,d,color,part});
// Sedlová střecha se štítem ke kameře (gable z paper-cards, včetně okapu na čele). Sklon jako paper-cards: výška = 0,42 šířky stěny, přesah ov.
export const ROOF_PITCH=.42;
export const gableRoof=({x,w,y,front=0,d,wall,roof,ov=.5,h=w*ROOF_PITCH})=>({shape:'gable',x:x-ov,w:w+2*ov,y,h,z:front+.2-(d+.4)/2,d:d+.4,color:wall,roof,part:'roof'});
// Výška střechy nad okapem v místě x (pro komín a vikýř).
export const roofAt=(r,x)=>r.y+r.h*Math.max(0,1-Math.abs(x-(r.x+r.w/2))/(r.w/2));
// Římsa / kordonová římsa: pruh vystupující o `out`, horní řez světlý (shader řeže plochy s normálou nahoru).
export const cornice=({x,w,y,h=.25,out=.25,front=0,color,part='cornice'})=>block({x,w,y,h,front:front+out,d:out+.05,color,part});

// Okno (výřez): LOD 0 rám, tabulka, svislá příčka (dvoukřídlé okno), parapet, volitelně nadpraží, okenice a truhlík; LOD 1 jen tabulka; LOD 2 nic (silueta).
// cx střed, y spodní hrana tabulky. Rozměr tabulky = světlost okna SCALE.win. Okenice = jedna deska za rámem, vykukuje vlevo i vpravo (levnější než dvě).
export function windowCut({cx,y,front=0,t,lod=0,w=SCALE.win.w,h=SCALE.win.h,shutter=null,flowers=null,lintel=false,part='window'}){
 if(lod>=2)return [];
 const x=cx-w/2,pane=block({x,w,y,h,front:front+(lod?.1:.12),d:lod?.1:.12,color:t.pane,part});
 if(lod===1)return [pane];
 const f=.14,out=[block({x:x-f,w:w+2*f,y:y-f,h:h+2*f,front:front+.07,d:.07,color:t.frame,part:'frame'}),pane,
  block({x:cx-.03,w:.06,y,h,front:front+.15,d:.03,color:t.frame,part:'mullion'}),
  block({x:x-f-.1,w:w+2*f+.2,y:y-f-.1,h:.12,front:front+.28,d:.28,color:t.trim,part:'sill'})];
 if(lintel)out.push(block({x:x-f-.05,w:w+2*f+.1,y:y+h+f,h:.16,front:front+.12,d:.12,color:t.trim,part:'lintel'}));
 if(shutter)out.push(block({x:x-f-.55,w:w+2*f+1.1,y:y-.02,h:h+.04,front:front+.04,d:.04,color:shutter,part:'shutter'}));
 if(flowers?.length){const bw=w+.1,by=y-f-.1-.32;out.push(block({x:cx-bw/2,w:bw,y:by,h:.3,front:front+.42,d:.3,color:flowers[0],part:'flowerbox'}));
  flowers.slice(1).forEach((c,i,a)=>out.push({shape:'disc',x:cx-bw/2+bw*(i+.5)/a.length,y:by+.4,r:.18,n:4,z:front+.32,d:.08,color:c,part:'flower'}));}
 return out;
}
// Vchodové dveře: LOD 0 zárubeň, křídlo, klika, schod a stříška; LOD 1 jen křídlo; LOD 2 nic.
export function door({cx,y=0,front=0,t,lod=0,canopy=null,knob=null}){
 if(lod>=2)return [];
 const {w,h}=SCALE.door,step=lod?0:.18,x=cx-w/2,leaf=block({x,w,y:y+step,h,front:front+(lod?.1:.08),d:lod?.1:.08,color:t.door,part:'door'});
 if(lod===1)return [leaf];
 const out=[block({x:x-.16,w:w+.32,y:y+step,h:h+.16,front:front+.05,d:.05,color:t.frame,part:'frame'}),leaf,
  block({x:x-.3,w:w+.6,y,h:step,front:front+.45,d:.45,color:t.plinth,part:'step'})];
 if(knob)out.push(block({x:x+w-.22,w:.1,y:y+step+1.02,h:.1,front:front+.12,d:.04,color:knob,part:'knob'}));
 if(canopy)out.push(block({x:x-.35,w:w+.7,y:y+step+h+.3,h:.14,front:front+.75,d:.75,color:canopy,part:'canopy'}));
 return out;
}
// Balkon se zábradlím: deska, horní madlo a sloupky (každých ~0,45 m, aspoň 3), boční madla.
export function balcony({cx,w,y,front=0,depth=.9,color,rail}){
 const x=cx-w/2,n=Math.max(3,Math.round(w/.45)),out=[block({x:x-.05,w:w+.1,y:y-.15,h:.15,front:front+depth,d:depth,color,part:'balcony'}),
  block({x,w,y:y+.95,h:.06,front:front+depth-.02,d:.06,color:rail,part:'railing'})];
 for(let i=0;i<=n;i++)out.push(block({x:x+i*(w-.04)/n,w:.04,y,h:.95,front:front+depth-.03,d:.04,color:rail,part:'railing'}));
 for(const sx of [x,x+w-.06])out.push(block({x:sx,w:.06,y:y+.95,h:.06,front:front+depth,d:depth,color:rail,part:'railing'}));
 return out;
}
// Komín na střeše r v místě cx: spodek pod plochou střechy, vršek `above` nad hřebenem. LOD 0 hlava (deska) a nástavec.
export function chimney({r,cx,w=.8,front=-1,d=.8,above=.8,color,cap,lod=0}){
 const y=Math.min(roofAt(r,cx-w/2),roofAt(r,cx+w/2))-.3,top=r.y+r.h+above,out=[block({x:cx-w/2,w,y,h:top-y,front,d,color,part:'chimney'})];
 if(lod===0)out.push(block({x:cx-w/2-.1,w:w+.2,y:top,h:.14,front:front+.1,d:d+.2,color:cap,part:'chimney'}),block({x:cx-.15,w:.3,y:top+.14,h:.35,front:front-d/2+.15,d:.3,color,part:'chimney'}));
 return out;
}
// Svod (dešťová trubka) u kraje fasády od okapu k zemi.
export const downpipe=({x,y,front=0,color})=>block({x,w:.12,y:.2,h:y-.2,front:front+.2,d:.12,color,part:'downpipe'});
// Kulaté okénko ve štítu (výřez): světlý lem a tmavé sklo, kotouče s n úseky.
export const oculus=({cx,y,r=.45,front,t,n=10})=>[{shape:'disc',x:cx,y,r:r+.12,n,z:front+.03,d:.06,color:t.frame,part:'oculus'},{shape:'disc',x:cx,y,r,n,z:front+.07,d:.06,color:t.pane,part:'oculus'}];

// Posun seznamu karet (umístění modelu do místa / vrstvy). Nemutuje vstup.
export const place=(list,{x=0,y=0,z=0}={})=>list.map(c=>({...c,x:c.x+x,y:c.y+y,z:c.z+z}));
// Obalový kvádr karet (kotouč podle poloměru, štít a jehlan po vrcholu).
export function bounds(list){
 const b={x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity,z0:Infinity,z1:-Infinity};
 for(const c of list){const [x0,x1,y0,y1]=c.shape==='disc'?[c.x-c.r,c.x+c.r,c.y-c.r,c.y+c.r]:[c.x,c.x+c.w,c.y,c.y+c.h];
  b.x0=Math.min(b.x0,x0);b.x1=Math.max(b.x1,x1);b.y0=Math.min(b.y0,y0);b.y1=Math.max(b.y1,y1);b.z0=Math.min(b.z0,c.z-c.d/2);b.z1=Math.max(b.z1,c.z+c.d/2);}
 return {...b,w:b.x1-b.x0,h:b.y1-b.y0,d:b.z1-b.z0};
}
