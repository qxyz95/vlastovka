// Tržní hala s lucernou (karta 11 v research/design/11-katalog-ctvrt1.md), dominanta místa 2 „Trh pod praporky“. Předobraz: otevřená tržní hala
// s cihlovým štítem a větrací lucernou na hřebeni (pražské Holešovice, pavilony Les Halles v malém). Široký nízký štít ke kameře s vystřiženým
// půlkruhovým oknem (paprskové příčky), pod ním vjezd s obloukem; nad hřebenem lucerna s lamelami, ze které jde pára události „poryv od tržnice“
// (MARKET VENT, VENT). Cedule bez textu: piktogram jablka. Bedny se zbožím u vjezdu, uvnitř tmavého oblouku stánky. Jedinečná.
// Souřadnice: x na střed čela, y = 0 zem, čelo z = 0, hloubka karty ulice (CARD_DEPTH.near).
import {palette,PAPER_TOKENS as T,mix} from '../palette.js';
import {SCALE,CARD_DEPTH,LOD_LAYER} from './scale.js';
import {tones,block,lista,panel,gableRoof,cornice,windowCut,door,downpipe,cutout,strip,outline} from './parts.js';

const F=SCALE.floor,BAY=2.4;
// Míry: čelo 30 m, zeď 7 m (dvě řady oken po 3 m + atika), štít 7 m (sklon 7/15), vjezd 5 × 4,5 m, půlkruhové okno r 2,6 m, lucerna 8 × 2,5 m nad hřebenem.
export const HALL=Object.freeze({w:30,h:7,gable:7,ov:.5,arch:Object.freeze({w:5,h:4.5,frame:.3}),lunette:Object.freeze({r:2.6,y:.6,frame:.25,spokes:4}),
 lantern:Object.freeze({w:8,above:2.5,front:-.8,d:2.4,roof:1.9,louvres:4}),sign:Object.freeze({w:4,h:.9,y:5.2}),crate:Object.freeze({w:1,h:.6,d:.6})});
const W=HALL.w,H=HALL.h,X0=-W/2,RIDGE=H+HALL.gable,LT=RIDGE+HALL.lantern.above,d=CARD_DEPTH.near;
// Výška štítu nad zdí v místě x (okap s přesahem ov) a pata lucerny (zapuštěná pod sklon, ven vystupuje jen nad hřebenem).
const gableAt=x=>H+HALL.gable*Math.max(0,1-Math.abs(x)/(W/2+HALL.ov)),LB=gableAt(HALL.lantern.w/2)-.3;
// Výdech páry pro událost MARKET VENT: střed horní hrany lucerny (souřadnice modelu).
export const VENT=Object.freeze({x:0,y:LT+HALL.lantern.roof,z:HALL.lantern.front-HALL.lantern.d/2});
// Osy oken: 4 vlevo a 4 vpravo od vjezdu (±4,8 … ±12 m); přízemí: vlevo dveře v krajní ose, u vjezdu bedny místo oken.
const AXES=[0,1,2,3].map(i=>4.8+BAY*i),C=()=>palette('papir').city.districts[0];
// Oblouk (obdélník s půlkruhem nahoře) jako vystřižené čelo: n úseků oblouku, CCW, konvexní (vějíř z levého dolního rohu).
const archPts=(cx,w,h,n)=>{const r=w/2,s=h-r,a=Array.from({length:n+1},(_,i)=>[cx+r*Math.cos(i/n*Math.PI),s+r*Math.sin(i/n*Math.PI)]);return [[cx-r,0],[cx+r,0],...a];};
const halfDisc=(cx,y,r,n)=>Array.from({length:n+1},(_,i)=>[cx+r*Math.cos(i/n*Math.PI),y+r*Math.sin(i/n*Math.PI)]);
function build(p,lod){
 const D=C(),wall=D.near[3],brick=D.roof[1],lant=D.roof[0],t=tones(wall),tb=tones(brick),tl=tones(lant),L=HALL.lantern,A=HALL.arch,U=HALL.lunette;
 const out=[block({x:X0,w:W,h:H,d,color:wall,shape:lod===2?'lista':'box'}),gableRoof({x:X0,w:W,y:H,d,wall:brick,roof:brick,ov:HALL.ov,h:HALL.gable,eaves:lod===0}),
  block({x:-L.w/2,w:L.w,y:LB,h:LT-LB,front:L.front,d:L.d,color:lant,part:'lantern',shape:lod===2?'lista':'box'}),
  gableRoof({x:-L.w/2,w:L.w,y:LT,front:L.front,d:L.d,wall:lant,roof:brick,ov:.3,h:L.roof,eaves:lod===0})];
 if(lod===2)return out;
 // vjezd: tmavý otvor s obloukem (LOD 0 se světlým rámem a stánky uvnitř), půlkruhové okno ve štítu (LOD 0 rám a paprskové příčky)
 const n=lod?4:6,arch=archPts(0,A.w,A.h,n),uy=H+U.y;
 out.push(cutout(arch,{front:.1,color:t.door,part:'arch'}),cutout(halfDisc(0,uy,U.r,n),{front:.28,color:tb.pane,part:'lunette'}));
 for(const ax of AXES)for(const s of [-1,1]){const cx=s*ax;out.push(...windowCut({cx,y:F+SCALE.sill,t,lod,lintel:!lod}));
  if(Math.abs(ax-AXES[0])<1e-9)continue;if(s<0&&ax===AXES[3]){out.push(...door({cx,t,lod}));continue;}out.push(...windowCut({cx,y:SCALE.sill,t,lod}));}
 const sg=HALL.sign;out.push(panel({x:-sg.w/2,w:sg.w,y:sg.y,h:sg.h,front:.1,color:T.card,part:'sign'}));
 if(lod)return out;
 out.push(cutout(archPts(0,A.w+2*A.frame,A.h+A.frame,n),{front:.06,color:t.frame,part:'arch'}),cutout(halfDisc(0,uy,U.r+U.frame,n),{front:.24,color:tb.frame,part:'lunette'}));
 // paprskové příčky půlkruhového okna (výřezy v barvě rámu)
 for(let i=1;i<=U.spokes;i++){const a=i/(U.spokes+1)*Math.PI;out.push(strip([0,uy],[U.r*Math.cos(a),uy+U.r*Math.sin(a)],.12,{front:.31,color:tb.frame,part:'lunette'}));}
 // lamely lucerny (lista, světlý řez), cedule s piktogramem jablka (kotouč + list)
 for(let i=0;i<L.louvres;i++)out.push(lista({x:-L.w/2+.3,w:L.w-.6,y:RIDGE+.25+i*(L.above-.4)/L.louvres,h:.2,front:L.front+.15,d:.15,color:tl.trim,part:'louvre'}));
 out.push({shape:'disc',x:0,y:sg.y+sg.h/2-.05,r:.3,n:8,z:.14,d:.06,color:T.tomato,part:'sign'},{shape:'flag',x:.02,w:.3,y:sg.y+sg.h/2+.2,h:.18,z:.16,d:.04,color:D.trees[0],part:'sign'});
 // uvnitř oblouku dva stánky (pult a markýza) v tónu stínu, vjezd není prázdná díra
 const S=palette('papir').life.stall,dim=c=>mix(c,palette('papir').city.side,.35);
 out.push(lista({x:-2,w:4,y:0,h:.95,front:.13,d:.13,color:dim(S.base),part:'counter'}),...[-1,0,1].map(i=>panel({x:-1.95+(i+1)*1.3,w:1.3,y:2.1,h:.4,front:.14,color:dim(i?S.stripes[0]:S.stripe),part:'awning'})));
 // sokl, římsa pod štítem, kordon nad přízemím (přerušený obloukem), lizény po stranách vjezdu a na nárožích, svody
 const sc=A.w/2+A.frame+.1;
 out.push(lista({x:X0-.05,w:W+.1,h:.6,front:.06,d:.06,color:t.plinth,part:'plinth'}),cornice({x:X0-.15,w:W+.3,y:H-.32,h:.32,out:.3,color:t.trim}),
  ...[-1,1].map(s=>cornice({x:s<0?X0:sc,w:W/2-sc,y:F-.18,h:.18,out:.12,color:t.trim,part:'stringcourse'})),
  ...[-(sc+.3),sc,X0+.2,-X0-.8].map(x=>panel({x,w:.6,y:.6,h:H-.92,front:.08,color:t.trim,part:'pilaster'})),
  downpipe({x:X0+.9,y:H-.32,color:t.shade}),downpipe({x:-X0-1.1,y:H-.32,color:t.shade}));
 // bedny se zbožím u vjezdu (v ose oken u oblouku): kraft, kopeček ovoce
 const goods=[T.tomato,D.trees[2],D.near[6],D.near[4]];
 [-1,1].forEach((s,k)=>[-.55,.55].forEach((o,j)=>{const cx=s*AXES[0]+o,c=HALL.crate;
  out.push(block({x:cx-c.w/2,w:c.w,h:c.h,front:.9,d:c.d,color:T.kraftDark,part:'crate'}),cutout([[cx-c.w/2+.05,c.h],[cx+c.w/2-.05,c.h],[cx,c.h+.35]],{front:.6,color:goods[k*2+j],part:'goods'}));}));
 return out;
}
// Stínový proxy: obrys čela se štítem (poly 3 △) a lucerna (panel 2 △).
function shadow(){
 const D=C(),z=-d/2,L=HALL.lantern;
 return [outline([[0,0],[-X0,0],[-X0,H],[0,RIDGE],[X0,H],[X0,0]],{z,color:D.near[3]}),panel({x:-L.w/2,w:L.w,y:LB,h:LT-LB,front:z,color:D.roof[0],part:'shadow'})];
}
export default Object.freeze({
 id:'market-hall',name:'Tržní hala s lucernou',district:0,layers:LOD_LAYER,
 prototype:'Otevřená tržní hala s cihlovým štítem, půlkruhovým oknem, vjezdem s obloukem a větrací lucernou na hřebeni (pražské Holešovice, Les Halles v malém).',
 purpose:'Dominanta místa 2 „Trh pod praporky“ (1× v ulici, nejširší střecha místa); lucerna je zdroj páry události „poryv od tržnice“ (MARKET VENT).',
 params:Object.freeze({}),
 // Výchozí (jediná) varianta: šířka se štítem a přesahem, výška po vrchol stříšky lucerny, hloubka karty ulice + štít + bedny.
 size:Object.freeze({w:W+2*HALL.ov,h:LT+HALL.lantern.roof,d:d+.9+.2}),
 // Strop 11 kap. 4.3 [550, 150, 25] (karta odhadem 700 / 150 / 25 s plnými kvádry).
 tris:Object.freeze([550,150,25]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),p=>build(p,2)]),shadow
});
