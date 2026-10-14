// Řadový dům čtvrti 1 „Střechy za úsvitu“ (karta 1 v research/design/11-katalog-ctvrt1.md, vzor katalogu 10-katalog-modelu.md).
// Předobraz: řadové domy evropského města (Nyhavn, Vršovice, Gent v pastelech). Barvy z palety čtvrti 1 (bible 05 kap. 2.3), detail tones(stěna).
// Generátor (K5): jeden blok cityChunk = jeden dům, bays = clamp(round((w − 1,4) / 2,4), 2, 6), floors = clamp(round(h / 3), 2, 7) v ulici, 3–12 ve středu.
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {SCALE,CARD_DEPTH,LOD_LAYER} from './scale.js';
import {hash,pickOf,tones,block,lista,gableRoof,eaveRoof,cornice,windowCut,door,gate,balcony,chimney,downpipe,oculus,dormer,shopfront,outline,panel,EAVE_H} from './parts.js';

const BAY=2.4,MARGIN=.7,F=SCALE.floor,ATTIC=.6;
const C=()=>palette('papir').city.districts[0],LIFE=()=>palette('papir').life;
export const widthOf=bays=>bays*BAY+2*MARGIN;
// Vrstva: 'auto' = podle LOD (0 ulice, 1 střed); kvalita 0 posune LOD (D-4), barva a hloubka karty ale zůstanou podle vrstvy.
const layerOf=(p,lod)=>p.layer==='auto'?LOD_LAYER[Math.min(1,lod)]:p.layer;

// Společný základ všech LOD: stěna, střecha a komín ve stejné siluetě (LOD 2 = jen tohle, tělo jako lista, střecha bez lemů / zadního sklonu).
function shell(p,lod){
 const D=C(),L=layerOf(p,lod),pal=L==='mid'?D.mid:D.near,wall=pal[p.color%pal.length],roofC=D.roof[p.roof%D.roof.length],w=widthOf(p.bays),H=p.floors*F,d=CARD_DEPTH[L],x=-w/2,lo=lod===2;
 const roof=p.roofType==='eave'?eaveRoof({x,w,y:H,d,wall,roof:roofC,back:!lo}):p.roofType==='flat'?null:gableRoof({x,w,y:H,d,wall,roof:roofC,eaves:!lo});
 const r=roof??{shape:'flat',y:H},ch=LIFE().chimney;
 const cards=[block({x,w,h:H,d,color:wall,shape:lo?'lista':'box'}),...(roof?[roof]:[lista({x:x-.05,w:w+.1,y:H,h:ATTIC,front:.05,d:.35,color:wall,part:'coping'})]),
  ...chimney({r,cx:x+w*(hash(p.seed,1)<.5?.27:.73),color:ch,cap:tones(ch).trim,lod,stacks:hash(p.seed,8)<.3?2:1,above:roof?1:1.2+1.3*hash(p.seed,7)})];
 return {D,wall,roofC,w,H,d,x,roof,cards};
}
function build(p,lod){
 const s=shell(p,lod),{w,H,x,roof}=s,t=tones(s.wall),out=s.cards;
 if(lod===2)return out;
 const doorBay=hash(p.seed,2)<.5?0:p.bays-1,bayX=i=>x+MARGIN+BAY*(i+.5),shop=p.ground==='shop';
 const near=s.D.near.filter(c=>c!==s.wall),accent=pickOf(near,p.seed,4);
 out.push(...(p.ground==='gate'?gate({cx:bayX(doorBay),t,lod}):door({cx:bayX(doorBay),t,lod,canopy:s.roofC})));
 // Výloha přes všechny osy přízemí kromě vchodu.
 if(shop){const a=doorBay===0?1:0,b=doorBay===0?p.bays-1:p.bays-2;out.push(...shopfront({x0:bayX(a)-BAY/2+.25,x1:bayX(b)+BAY/2-.25,t,glass:s.D.glass,awning:accent,lod}));}
 out.push(cornice({x:x-.15,w:w+.3,y:H-.32,h:.32,out:.3,color:t.trim}));
 // Vikýře jen na střeše okapem ke kameře: pata 0,3 m nad okapem, čelo na předním sklonu, tělo k hřebeni.
 if(roof?.shape==='eave'&&p.dormers>0){const z1=roof.z+roof.d/2,zm=roof.z,front=z1-.3/EAVE_H*(z1-zm),i1=Math.floor((p.bays-1)/3);
  for(const cx of p.dormers===1?[0]:[bayX(i1),bayX(p.bays-1-i1)])out.push(...dormer({cx,y:H+.3,front,back:zm,t,roof:s.roofC,lod}));}
 if(lod===0){
  const shutter=hash(p.seed,3)<.6?accent:null,flowers=[s.D.trunk,...LIFE().balloons.slice(0,3)];
  const balc=p.floors>=3&&hash(p.seed,5)<.6?Math.floor(p.bays/2):-1,fh=(k,i)=>hash(p.seed,10+k*7+i);
  // Truhlík u 30 % oken pater (karta 1): okna s nejnižším hashem, takže počet nepřeteče strop ani u nejbohatší varianty.
  const upper=[];for(let k=1;k<p.floors;k++)for(let i=0;i<p.bays;i++)if(k!==1||i!==balc)upper.push(fh(k,i));
  const fMax=upper.sort((a,b)=>a-b)[Math.round(upper.length*.3)-1]??-1;
  out.push(lista({x:x-.05,w:w+.1,h:.6,front:.06,d:.06,color:t.plinth,part:'plinth'}),downpipe({x:hash(p.seed,6)<.5?x+.15:x+w-.35,y:H-.32,color:t.shade}));
  for(let k=1;k<p.floors;k++)out.push(cornice({x,w,y:k*F-.18,h:.18,out:.12,color:t.trim,part:'stringcourse'}));
  for(let k=0;k<p.floors;k++)for(let i=0;i<p.bays;i++){if(k===0&&(i===doorBay||shop))continue;
   if(k===1&&i===balc){out.push(...windowCut({cx:bayX(i),y:F,h:SCALE.door.h,t,lod,part:'balconyDoor'}),...balcony({cx:bayX(i),w:BAY-.3,y:F,color:t.trim,rail:T.pencil700}));continue;}
   out.push(...windowCut({cx:bayX(i),y:k*F+SCALE.sill,t,lod,shutter:k>0?shutter:null,flowers:k>0&&fh(k,i)<=fMax?flowers:null}));}
  if(roof?.shape==='gable'&&roof.h>2.4)out.push(...oculus({cx:0,y:H+roof.h*.36,r:.42,front:.2,t,n:6}));
 }else for(let k=0;k<p.floors;k++)for(let i=0;i<p.bays;i++)if(k||(i!==doorBay&&!shop))out.push(...windowCut({cx:bayX(i),y:k*F+SCALE.sill,t,lod}));
 return out;
}
// Stínový proxy: obrys domu se střechou (poly, 2–4 △) a komín (panel 2 △), uprostřed hloubky karty.
function shadow(p){
 const s=shell(p,0),{w,H,x,roof}=s,z=-s.d/2,top=roof?.shape==='gable'?H+roof.h:roof?.shape==='eave'?H+EAVE_H:H+ATTIC,ch=s.cards.find(c=>c.part==='chimney');
 const pts=roof?.shape==='gable'?[[0,0],[x+w,0],[x+w,H],[0,top],[x,H],[x,0]]:[[x,0],[x+w,0],[x+w,top],[x,top]];
 return [outline(pts,{z,color:s.wall}),panel({x:ch.x,w:ch.w,y:ch.y,h:ch.h,front:z+.05,color:ch.color,part:'shadow'})];
}
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'house-row',name:'Řadový dům',district:0,layers:LOD_LAYER,
 prototype:'Řadové domy evropského města: Nyhavn (Kodaň), Vršovice (Praha), Gent v pastelech; štít, okap nebo atika do ulice.',
 purpose:'Hlavní zástavba ulice a středu čtvrti 1; dveře nebo průjezd u země, okna v patrech nad sebou, komín, schod ke dveřím, výloha u části domů.',
 params:Object.freeze({floors:P([2,3,4,5,6,7,8,9,10,11,12],3),bays:P([2,3,4,5,6],3),color:P([0,1,2,3,4,5,6,7],0),roof:P([0,1,2],1),seed:P([1,2,3,4,5],1),
  roofType:P(['gable','eave','flat'],'gable'),ground:P(['flat','shop','gate'],'flat'),dormers:P([0,1,2],0),layer:P(['auto','near','mid'],'auto')}),
 // Výchozí varianta (3 patra, 3 osy, štít): šířka štítu s přesahem, výška po nástavec komína, hloubka karty ulice + přesah střechy + balkon.
 size:Object.freeze({w:widthOf(3)+1,h:3*F+widthOf(3)*.42+1+.3+.35,d:CARD_DEPTH.near+.2+.9}),
 // Strop △ (11 kap. 4.3: [600, 130, 13]) pro nejbohatší variantu ulice 6 os × 7 pater; vyšší domy středu (8–12 pater) jsou jen v LOD 1 a strop jim
 // neplatí (6 × 12 v LOD 1 ≈ 173 △). LOD 0 650 (rozhodnutí 14. 10.): střecha okapem se 2 vikýři, okenicemi a truhlíky má 640 △.
 tris:Object.freeze([650,130,13]),trisScope:Object.freeze({floors:7}),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),p=>build(p,2)]),shadow
});
