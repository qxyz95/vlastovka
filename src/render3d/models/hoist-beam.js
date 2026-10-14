// Trám s kladkou (karta H5 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.3 S-6): amsterdamský trám z vrcholu štítu přes pavlač,
// kladka, lano a košík papírů; na konci trámu praporek větru z lepicí pásky. Místo pro hák Crane Lift: úrovně 1–3 zvedají plošinu nad pavlač
// (1,5 / 3 / 4,5 m), košík pak stojí na plošině. Nic bílého ani grafitového, vše matné nad dítětem (S-6). Praporek vlaje ve vertex shaderu
// (atribut sway, S4), při reduced motion jen natočený po větru (S-7). Souřadnice: x na střed trámu, y = 0 podlaha pavlače, čelo trámu z = 0.
import {PAPER_TOKENS as T} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {block,lista,panel,cutout,strip} from './parts.js';
import {LAUNCH} from './launch-site.js';

const L=LAUNCH.beam.len,BY=LAUNCH.beam.y;
// trám 9 × 0,3 × 0,3 m, kladka ⌀ 0,45 m 0,3 m od konce, lano 0,03 m, košík 0,65 × 0,45 m, praporek 0,8 m; plošina 1,6 m, hák 1 m nad ní.
export const HOIST=Object.freeze({beam:.3,pulley:Object.freeze({x:L/2-.3,r:.225}),rope:.03,basket:Object.freeze({w:.65,h:.45,d:.5,y:2.9}),flag:.8,
 platform:Object.freeze({w:1.6,step:1.5,hook:1})});
const C=()=>({wood:T.kraftDark,rope:T.pencil,tape:T.tape});

function build(p){
 const c=C(),P=HOIST.pulley,py=BY-P.r+.02,rx=P.x+P.r,B=HOIST.basket,out=[block({x:-L/2,w:L,y:BY,h:HOIST.beam,front:0,d:HOIST.beam,color:c.wood,part:'beam'}),
  {shape:'disc',x:P.x,y:py,r:P.r,n:14,z:.06,d:.04,color:c.rope,part:'pulley'}];
 // praporek větru: proužek pásky z konce trámu po větru (wind 1 doprava, −1 doleva), zužuje se
 const fx=L/2,fy=BY+HOIST.beam-.05,tip=[fx+p.wind*HOIST.flag,fy-.12],a=[fx,fy-.13],b=[tip[0],tip[1]+.04],e=[fx,fy];
 out.push(cutout(p.wind>0?[a,tip,b,e]:[a,e,b,tip],{front:.04,color:c.tape,part:'flag'}));
 // lano a náklad: bez háku košík na laně; s hákem plošina v úrovni × 1,5 m, dva závěsy k háku, košík na plošině
 const bx=rx-B.w/2;
 if(!p.crane){out.push(panel({x:rx-HOIST.rope/2,w:HOIST.rope,y:B.y+B.h,h:py-B.y-B.h,front:.08,color:c.rope,part:'rope'}),
  block({x:bx,w:B.w,y:B.y,h:B.h,front:.1,d:B.d,color:c.wood,part:'basket'}));return out;}
 const F=HOIST.platform,y=p.crane*F.step,hy=y+F.hook,x0=rx-F.w/2;
 out.push(panel({x:rx-HOIST.rope/2,w:HOIST.rope,y:hy,h:py-hy,front:.08,color:c.rope,part:'rope'}),
  cutout([[rx-.04,hy-.18],[rx+.12,hy-.1],[rx+.12,hy+.02],[rx-.04,hy+.02]],{front:.09,color:c.rope,part:'hook'}),
  strip([rx,hy-.15],[x0+.05,y+.12],HOIST.rope,{front:.08,color:c.rope,part:'hanger'}),strip([rx,hy-.15],[x0+F.w-.05,y+.12],HOIST.rope,{front:.08,color:c.rope,part:'hanger'}),
  lista({x:x0,w:F.w,y,h:.12,front:.12,d:1,color:c.wood,part:'platform'}),block({x:bx,w:B.w,y:y+.12,h:B.h,front:.1,d:B.d,color:c.wood,part:'basket'}));
 return out;
}
const Pp=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'hoist-beam',name:'Trám s kladkou',district:0,layers:LOD_LAYER,hero:true,
 prototype:'Trám s kladkou ve štítu amsterdamského domu (zvedání nákladu do podkroví), košík papírů a praporek z lepicí pásky.',
 purpose:'Místo pro hák Crane Lift (plošina nad pavlačí podle úrovně) a ukazatel větru nad dítětem při míření.',
 // crane 0 = bez háku (košík na laně), 1–3 = úroveň Crane Lift; wind = směr praporku.
 params:Object.freeze({crane:Pp([0,1,2,3],0),wind:Pp([1,-1],1)}),
 size:Object.freeze({w:L+.8,h:3.2,d:.5}),
 // Strop 11 kap. 3.7: [60, 0, 0] (s hákem úr. 3).
 tris:Object.freeze([60,0,0]),
 lod:Object.freeze([p=>build(p),()=>[],()=>[]]),shadow:()=>[]
});
