// Girlanda s praporky (karta 10 v research/design/11-katalog-ctvrt1.md): praporky přes náměstí při trhu, ohraničují náměstí shora a ukazují vítr.
// Provázek s průvěsem 0,8 m mezi podpěrami po 40 m (lampy nebo štíty, ty kreslí jiné modely), praporky 0,8 m (ozdoba ve zvětšené velikosti,
// rozhodnutí 14. 10.; skutečných 0,3 m by bylo pod 2 px) po ~1,5 m. Barvy life.bunting, hořčicová nahrazena #f2b65a (rozhodnutí 14. 10.,
// rozpor R3: palette.js ji v life.bunting ještě má). Praporky kmitají ve vertex shaderu (karty se `sway`), reduced motion: stojí.
// Souřadnice: x na střed girlandy, y = 0 zem (provázek u podpěr ve výšce y), čelo z = 0.
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {cutout,bounds} from './parts.js';

export const BUNTING=Object.freeze({span:40,sag:.8,line:.06,flag:Object.freeze({w:.8,h:.8}),perSpan:26});
// Barvy praporků: life.bunting bez hořčicové (jen hodnota), místo ní D1.near[1] #f2b65a.
export const buntingColors=()=>{const P=palette('papir');return P.life.bunting.map(c=>c===T.mustard?P.city.districts[0].near[1]:c);};
// Výška provázku v místě u ∈ 0…1 rozpětí: dvě rovné části do průvěsu uprostřed (V; při 0,8 m na 40 m oko oblouk nerozliší).
const sagAt=u=>BUNTING.sag*(1-Math.abs(2*u-1));
// Provázek jednoho rozpětí: LOD 0 pás stálé tloušťky (6 bodů, vějíř z vnitřního horního vrcholu, 4 △), LOD 1 čočka (2 △).
function string(x0,y,lod,color){
 const {span:S,sag,line:t}=BUNTING,xm=x0+S/2,x1=x0+S,ym=y-sag;
 const pts=lod?[[xm,ym+t/2],[x0,y],[xm,ym-t/2],[x1,y]]:[[xm,ym+t/2],[x0,y+t/2],[x0,y-t/2],[xm,ym-t/2],[x1,y-t/2],[x1,y+t/2]];
 return cutout(pts,{front:.02,color,part:'string'});
}
function build(p,lod){
 const n=Math.round(p.length/BUNTING.span),x0=-p.length/2,cols=buntingColors(),line=palette('papir').life.line,{w,h}=BUNTING.flag,step=BUNTING.span/BUNTING.perSpan,out=[];
 for(let s=0;s<n;s++){const sx=x0+s*BUNTING.span;out.push(string(sx,p.y,lod,line));
  // LOD 1 každý druhý praporek (11 kap. 3.3)
  for(let i=lod?1:0;i<BUNTING.perSpan;i+=lod?2:1){const u=(i+.5)/BUNTING.perSpan,cx=sx+u*BUNTING.span,top=p.y-sagAt(u)-BUNTING.line/2;
   out.push({shape:'flag',x:cx-w/2,w,y:top-h,h,z:0,d:.04,color:cols[(s*BUNTING.perSpan+i)%cols.length],part:'pennant',sway:1});}}
 return out;
}
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
const DEF={length:40,y:6.8},box=bounds(build(DEF,0));
export default Object.freeze({
 id:'bunting',name:'Girlanda s praporky',district:0,layers:LOD_LAYER,
 prototype:'Praporková girlanda přes náměstí při trhu (pouťové a trhové vlaječky), provázek s průvěsem mezi lampami nebo štíty.',
 purpose:'Ohraničuje náměstí místa 2 „Trh pod praporky“ shora a pohybem ukazuje vítr: 2 girlandy přes ~200 m ve výšce 6,8 a 8,4 m, pod pásem letu.',
 // length = délka (násobky rozpětí 40 m mezi podpěrami), y = výška provázku u podpěr.
 params:Object.freeze({length:P([40,80,120,160,200],DEF.length),y:P([6.8,8.4],DEF.y)}),
 size:Object.freeze({w:box.w,h:box.h,d:box.d}),
 // Strop 11 kap. 4.3 [150, 75, 0] na 200 m: 5 rozpětí × (provázek 4 + 26 praporků) = 150, LOD 1 5 × (2 + 13) = 75. Stín se nekreslí.
 tris:Object.freeze([150,75,0]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),()=>[]]),shadow:()=>[]
});
