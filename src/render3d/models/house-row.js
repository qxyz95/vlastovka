// Řadový dům čtvrti 1 „Střechy za úsvitu“ (vzorový objekt katalogu, 10-katalog-modelu.md kap. 4 a 5).
// Předobraz: úzký evropský městský dům se štítem do ulice (kodaňský Nyhavn, amsterodamský grachtenhuis). Barvy z palety čtvrti 1 (bible 05 kap. 2.3).
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {SCALE,CARD_DEPTH,LOD_LAYER} from './scale.js';
import {hash,pickOf,tones,block,gableRoof,cornice,windowCut,door,balcony,chimney,downpipe,oculus} from './parts.js';

const BAY=2.4,MARGIN=.7,F=SCALE.floor;
const C=()=>palette('papir').city.districts[0],LIFE=()=>palette('papir').life;
export const widthOf=bays=>bays*BAY+2*MARGIN;

// Společný základ všech LOD: stěna, střecha a komín ve stejné siluetě (LOD 2 = jen tohle).
function shell(p,lod){
 const D=C(),wall=D.near[p.color%D.near.length],roofC=D.roof[p.roof%D.roof.length],w=widthOf(p.bays),H=p.floors*F,d=CARD_DEPTH[LOD_LAYER[lod]],x=-w/2;
 const roof=gableRoof({x,w,y:H,d,wall,roof:roofC});
 return {D,wall,w,H,d,x,roof,cards:[block({x,w,h:H,d,color:wall}),roof,
  ...chimney({r:roof,cx:x+w*(hash(p.seed,1)<.5?.27:.73),color:LIFE().chimney,cap:tones(LIFE().chimney).frame,lod})]};
}
function build(p,lod){
 const s=shell(p,lod),{w,H,x}=s,t=tones(s.wall),out=s.cards;
 if(lod===2)return out;
 const doorBay=hash(p.seed,2)<.5?0:p.bays-1,bayX=i=>x+MARGIN+BAY*(i+.5);
 out.push(...door({cx:bayX(doorBay),t,lod,canopy:s.roof.roof,knob:T.pencil700}));
 if(lod===0){
  const near=s.D.near.filter(c=>c!==s.wall),shutter=hash(p.seed,3)<.6?pickOf(near,p.seed,4):null,flowers=[s.D.trunk,...LIFE().balloons.slice(0,3)];
  const balc=p.floors>=3&&hash(p.seed,5)<.6?Math.floor(p.bays/2):-1;
  out.push(block({x:x-.05,w:w+.1,h:.6,front:.06,d:.06,color:t.plinth,part:'plinth'}),cornice({x:x-.15,w:w+.3,y:H-.32,h:.32,out:.3,color:t.trim}),
   downpipe({x:hash(p.seed,6)<.5?x+.15:x+w-.27,y:H-.32,color:t.shade}));
  for(let k=1;k<p.floors;k++)out.push(cornice({x,w,y:k*F-.18,h:.18,out:.12,color:t.trim,part:'stringcourse'}));
  for(let k=0;k<p.floors;k++)for(let i=0;i<p.bays;i++){if(k===0&&i===doorBay)continue;
   const y=k*F+SCALE.sill;
   if(k===1&&i===balc){out.push(...windowCut({cx:bayX(i),y:F,h:SCALE.door.h,t,lod,lintel:false,part:'balconyDoor'}),...balcony({cx:bayX(i),w:BAY-.3,y:F,color:t.trim,rail:T.pencil700}));continue;}
   out.push(...windowCut({cx:bayX(i),y,t,lod,shutter:k>0?shutter:null,flowers:k>0&&hash(p.seed,10+k*7+i)<.3?flowers:null}));}
  if(s.roof.h>2.4)out.push(...oculus({cx:0,y:H+s.roof.h*.36,r:.42,front:.2,t,n:6}));
 }else for(let k=0;k<p.floors;k++)for(let i=0;i<p.bays;i++)if(k||i!==doorBay)out.push(...windowCut({cx:bayX(i),y:k*F+SCALE.sill,t,lod}));
 return out;
}
export default Object.freeze({
 id:'house-row',name:'Řadový dům',district:0,layers:LOD_LAYER,
 prototype:'Úzký evropský městský dům se štítem do ulice: Nyhavn (Kodaň), grachtenhuis (Amsterdam).',
 purpose:'Hlavní zástavba ulice a středu čtvrti 1; dveře u země, okna v patrech nad sebou, komín, schod ke dveřím.',
 params:Object.freeze({floors:Object.freeze({values:[2,3,4],default:3}),bays:Object.freeze({values:[2,3],default:3}),
  color:Object.freeze({values:[0,1,2,3,4,5,6,7],default:0}),roof:Object.freeze({values:[0,1,2],default:1}),seed:Object.freeze({values:[1,2,3,4,5],default:1})}),
 // Výchozí varianta (3 patra, 3 osy): šířka štítu s přesahem, výška po nástavec komína, hloubka karty ulice + přesah střechy + balkon.
 size:Object.freeze({w:widthOf(3)+1,h:3*F+widthOf(3)*.42+.8+.14+.35,d:CARD_DEPTH.near+.2+.9}),
 // Strop trojúhelníků na LOD pro nejbohatší variantu (návrh K1, ověří K5 rozpočtem místa).
 tris:Object.freeze([800,160,40]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),p=>build(p,2)])
});
