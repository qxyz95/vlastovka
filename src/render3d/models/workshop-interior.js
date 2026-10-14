// Dílna v podkroví (karta H3 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.1): výloha postupu a pozadí panelu Dílny.
// Stůl s lampou, stohy papíru, kelímek s tužkami a řezačka; police s rolemi papírů (přibývají s druhy papíru), nástěnka s pohlednicemi míst
// Atlasu (přibývají s místy), provázek s hotovými barevnými vlaštovkami bez obrysu (S-6). Zvolenou vlaštovku na stole kreslí plane.js.
// Vše o tón tmavší a méně syté než fasáda (ve stínu střechy): barva = mix(token, city.side, .2). Stav (role, pohlednice) se čte ze savu při změně, ne za snímek.
// Souřadnice: x na střed domu (jako H2), y = 0 podlaha podkroví, z = 0 líc domu (zadní stěna podkroví v LAUNCH.house.back).
import {palette,mix,PAPER_TOKENS as T} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {block,lista,panel,cutout,strip} from './parts.js';
import {LAUNCH} from './launch-site.js';

const H=LAUNCH.house,X0=-(H.x1-H.x0)/2,BACK=H.back,DIM=.2;
// Role papírů v pořadí žebříku (bible 17.3: Copy, Kraft, Washi, Stříbrná fólie) z tokenů: bílá patří vlaštovce (Copy krémová), fólie sklem čtvrti (úsvit #cfe2ec).
export const ROLLS=Object.freeze(['copy','kraft','washi','foil']),CARDS=16;
export const DESK=Object.freeze({x:X0+.8,w:3.4,h:.8,d:.8,front:-2.4}),BOARD=Object.freeze({x:X0+4.6,w:2.6,y:.9,h:1.6}),SHELF=Object.freeze({x:X0+.6,w:3,y:1.7});
const C=()=>{const P=palette('papir'),D=P.city.districts,dim=c=>mix(c,P.city.side,DIM);
 return {dim,desk:dim(T.kraftDark),lamp:dim(T.teal),cup:dim(T.teal),board:dim(T.kraft),card:dim(T.cream),shelf:dim(T.kraftDark),pencil:dim(T.pencil),cutter:dim(T.card),
  rolls:[T.cream,T.kraft,T.card,D[0].glass].map(dim),pastel:P.life.pastel.map(dim),place:i=>dim(D[i>>2].near[i%4%D[i>>2].near.length]),near:D[0].near.map(dim)};};

function build(p){
 const c=C(),out=[],dz=DESK.front,top=DESK.h;
 // stůl: deska (kvádr 3,4 × 0,8 m) na dvou nohách
 out.push(block({x:DESK.x,w:DESK.w,y:top-.08,h:.08,front:dz,d:DESK.d,color:c.desk,part:'desk'}),
  ...[DESK.x+.05,DESK.x+DESK.w-.13].map(x=>panel({x,w:.08,h:top-.08,front:dz-.05,color:c.desk,part:'desk'})));
 // lampa na pravém konci stolu: patka, dvě ramena, stínítko (trojúhelník), teal ve stínu
 const lx=DESK.x+DESK.w-.6,lz=dz-.4;
 out.push(panel({x:lx-.15,w:.3,y:top,h:.05,front:lz,color:c.lamp,part:'lamp'}),strip([lx,top+.04],[lx-.25,top+.65],.05,{front:lz,color:c.lamp,part:'lamp'}),
  strip([lx-.25,top+.65],[lx+.05,top+.9],.05,{front:lz,color:c.lamp,part:'lamp'}),cutout([[lx-.12,top+.68],[lx+.32,top+.78],[lx+.02,top+1.02]],{front:lz+.01,color:c.lamp,part:'lamp'}));
 // stohy papíru (3 barvy), kelímek se 3 tužkami, řezačka (deska a nůž)
 out.push(...[0,1,2].map(i=>panel({x:DESK.x+1.8,w:.9,y:top+i*.16,h:.16,front:dz-.3,color:c.near[[4,1,5][i]],part:'papers'})),
  panel({x:DESK.x+.3,w:.2,y:top,h:.25,front:dz-.2,color:c.cup,part:'cup'}),
  ...[0,1,2].map(i=>panel({x:DESK.x+.33+i*.06,w:.03,y:top+.15,h:.28-i*.04,front:dz-.25,color:c.pastel[i*2],part:'pencils'})),
  panel({x:DESK.x+.7,w:.8,y:top,h:.04,front:dz-.3,color:c.cutter,part:'cutter'}),strip([DESK.x+.75,top+.06],[DESK.x+1.45,top+.25],.03,{front:dz-.29,color:c.pencil,part:'cutter'}));
 // police s rolemi papírů na zadní stěně (role = kotouč jen čelem s dutinkou)
 out.push(lista({x:SHELF.x,w:SHELF.w,y:SHELF.y,h:.1,front:BACK+.4,d:.38,color:c.shelf,part:'shelf'}));
 for(let i=0;i<p.rolls;i++){const x=SHELF.x+.4+i*.7;out.push({shape:'disc',x,y:SHELF.y+.27,r:.17,n:10,z:BACK+.2,d:.04,color:c.rolls[i],part:'roll'},
  {shape:'disc',x,y:SHELF.y+.27,r:.06,n:6,z:BACK+.24,d:.04,color:c.shelf,part:'roll'});}
 // nástěnka: kraftová deska, pohlednice 4 × 4 (řádek = čtvrť Atlasu shora, sloupec = místo), krémová kartička s obrázkem v barvě místa
 out.push(panel({x:BOARD.x,w:BOARD.w,y:BOARD.y,h:BOARD.h,front:BACK+.05,color:c.board,part:'board'}));
 for(let i=0;i<p.cards;i++){const cx=BOARD.x+.05+(i%4)*.65,cy=BOARD.y+BOARD.h-.43-(i>>2)*.4;
  out.push(panel({x:cx,w:.55,y:cy,h:.34,front:BACK+.07,color:c.card,part:'postcard'}),panel({x:cx+.04,w:.47,y:cy+.1,h:.2,front:BACK+.08,color:c.place(i),part:'postcard'}));}
 // provázek pod střechou s hotovými vlaštovkami (barevné, bez obrysu, ne bílé)
 const sz=-3.5,a=[X0+1.5,3.3],b=[-X0-1.5,3.25],y=x=>a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
 out.push(strip(a,b,.025,{front:sz,color:c.pencil,part:'string'}));
 [[-3,c.near[1]],[-1,c.near[2]],[1.2,c.board],[3.2,c.near[4]]].forEach(([x,col])=>{const t=y(x);
  out.push(cutout([[x+.5,t-.2],[x+.1,t-.12],[x,t-.04],[x+.08,t-.3]],{front:sz+.01,color:col,part:'planes'}));});
 return out;
}
const Pp=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'workshop-interior',name:'Dílna v podkroví',district:0,layers:LOD_LAYER,hero:true,
 prototype:'Dětská dílna v podkroví: stůl s lampou a stohy papíru, police s rolemi papírů, nástěnka s pohlednicemi, vlaštovky na provázku.',
 purpose:'Výloha postupu (role přibývají s druhy papíru, pohlednice s místy Atlasu) a pozadí panelu Dílny (kamera najede na stůl, ~5 m).',
 // rolls 1–4 druhy papíru, cards 0–16 pohlednic; výchozí = nejbohatší stav (katalog a strop).
 params:Object.freeze({rolls:Pp([1,2,3,4],4),cards:Pp(Array.from({length:CARDS+1},(_,i)=>i),CARDS)}),
 size:Object.freeze({w:9.9,h:3.31,d:3.8}),
 // Strop 11 kap. 3.7: [200, 0, 0] (za oddálení se interiér neukazuje, stín nemá).
 tris:Object.freeze([200,0,0]),
 lod:Object.freeze([p=>build(p),()=>[],()=>[]]),shadow:()=>[]
});
