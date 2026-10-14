// Stánek trhu (karta 9 v research/design/11-katalog-ctvrt1.md): trojice stánků 2,3 m pod jednou pruhovanou markýzou (rozpor R12: dnešní stánek 7 m).
// Předobraz: trhové stánky s pruhovanou markýzou (Náplavka, provensálský trh). Pult je karta, markýza přeložená karta s pruhy (střídané panely)
// a lambrekýnem ze zoubků (flag), zboží v bednách na pultu jako kopečky. Prodavač je model person zvlášť. Srdce místa 2, dav kolem.
// Souřadnice: x na střed trojice, y = 0 zem, čelo pultu z = 0, markýza přesahuje dopředu (+z).
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {block,lista,panel,cutout,tones} from './parts.js';

// Míry karty: stánek 2,3 m × 3, pult 0,95 m (hloubka 1 m), sloupky 2,4 m, markýza 0,5 m (průmět sklonu) s přesahem 0,6 m, lambrekýn 0,3 m.
export const STALL=Object.freeze({unit:2.3,n:3,counter:Object.freeze({h:.95,d:1}),post:Object.freeze({h:2.4,w:.15}),awning:Object.freeze({h:.5,out:.6,side:.15,valance:.3,teeth:9}),
 crate:Object.freeze({w:1.4,h:.3,d:.6,back:.1}),heap:.35,tag:Object.freeze({w:.35,h:.25})});
const W=STALL.unit*STALL.n,AW=W+2*STALL.awning.side,X0=-W/2,AX0=-AW/2;
const L=()=>palette('papir').life,D=()=>palette('papir').city.districts[0];
// Zboží podle karty: ovoce (rajčata, hrušky, dýně), květiny (barvy ulice), chléb (kraft a jeho odstíny); jedna barva na stánek.
const GOODS=()=>({fruit:[T.tomato,D().trees[2],D().near[6]],flowers:[D().near[4],D().near[5],D().near[1]],bread:[T.kraft,D().near[6],tones(T.kraft).trim]});
const colors=p=>{const S=L().stall,stripe=S.stripes[p.stripes%S.stripes.length];return {stripe,cream:S.stripe,base:S.base,post:S.post,goods:GOODS()[p.goods]};};
// Kopeček zboží na bedně (pět bodů, 3 △; LOD 1 jeden trojúhelník).
const heap=(cx,y,w,color,lod)=>cutout(lod?[[cx-w/2,y],[cx+w/2,y],[cx,y+STALL.heap]]:[[cx-w/2,y],[cx+w/2,y],[cx+w/2-.15,y+.2],[cx,y+STALL.heap],[cx-w/2+.15,y+.2]],
 {front:-STALL.crate.back+.02,color,part:'goods'});
function build(p,lod){
 const c=colors(p),{counter:Cn,post:Po,awning:A,crate:Cr}=STALL,ay=Po.h,sx=i=>X0+STALL.unit*(i+.5),out=[];
 if(lod===2)return [panel({x:X0,w:W,h:ay,color:c.base,part:'counter'}),lista({x:AX0,w:AW,y:ay,h:A.h,front:A.out,d:A.out+Cn.d,color:c.stripe,part:'awning'})];
 out.push(block({x:X0,w:W,h:Cn.h,front:0,d:Cn.d,color:c.base,part:'counter',shape:lod?'lista':'box'}));
 // sloupky na hranách stánků (LOD 1 jen krajní)
 for(let i=0;i<=STALL.n;i++)if(!lod||i===0||i===STALL.n)out.push(panel({x:X0+i*STALL.unit-Po.w/2+(i===0?Po.w/2:i===STALL.n?-Po.w/2:0),w:Po.w,h:Po.h,front:.05,color:c.post,part:'post'}));
 // markýza: LOD 0 dva pruhy na stánek (barva + krém), LOD 1 jeden panel na stánek
 const sw=AW/(lod?STALL.n:2*STALL.n);for(let i=0;i<(lod?STALL.n:2*STALL.n);i++)out.push(panel({x:AX0+i*sw,w:sw,y:ay,h:A.h,front:A.out,color:lod||i%2===0?c.stripe:c.cream,part:'awning'}));
 const y=Cn.h;
 for(let i=0;i<STALL.n;i++){if(!lod)out.push(lista({x:sx(i)-Cr.w/2,w:Cr.w,y,h:Cr.h,front:-Cr.back,d:Cr.d,color:T.kraftDark,part:'crate'}));
  out.push(heap(sx(i),lod?y:y+Cr.h,Cr.w-.1,c.goods[i%c.goods.length],lod));}
 if(lod)return out;
 // lambrekýn: zoubky v barvě pruhu nad nimi (zvlněná markýza), nebo rovný pás na stánek (rovná)
 if(p.awning==='wavy'){const tw=AW/A.teeth;for(let i=0;i<A.teeth;i++){const k=Math.floor((i+.5)*tw/sw);out.push({shape:'flag',x:AX0+i*tw,w:tw,y:ay-A.valance,h:A.valance,z:A.out+.02,d:.04,color:k%2?c.cream:c.stripe,part:'valance'});}}
 else for(let i=0;i<STALL.n;i++)out.push(panel({x:AX0+i*AW/STALL.n,w:AW/STALL.n,y:ay-A.valance,h:A.valance,front:A.out+.02,color:c.stripe,part:'valance'}));
 // cedulka s cenou na bedně prostředního stánku
 out.push(panel({x:sx(1)-STALL.tag.w/2,w:STALL.tag.w,y:y+.03,h:STALL.tag.h,front:-Cr.back+.03,color:T.cream,part:'tag'}));
 return out;
}
// Stínový proxy: pult a markýza jako dva panely (4 △), světlo mezi nimi (pod markýzou je vidět stín pultu).
function shadow(p){const c=colors(p),z=-STALL.counter.d/2,{post:Po,awning:A}=STALL;
 return [panel({x:X0,w:W,h:STALL.counter.h,front:z,color:c.base,part:'shadow'}),panel({x:AX0,w:AW,y:Po.h-A.valance,h:A.h+A.valance,front:z,color:c.stripe,part:'shadow'})];}
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'stall',name:'Stánek trhu (trojice)',district:0,layers:LOD_LAYER,
 prototype:'Trhové stánky s pruhovanou markýzou a lambrekýnem (pražská Náplavka, provensálský trh); tři stánky 2,3 m pod jednou markýzou, zboží v bednách.',
 purpose:'Srdce místa 2 „Trh pod praporky“: 19 trojic v ulici (rozestup 9–12 m), dav kolem; prodavač je model person zvlášť.',
 // stripes = barva pruhů (life.stall.stripes), goods = zboží, awning = lambrekýn zoubky / rovný.
 params:Object.freeze({stripes:P([0,1,2,3],0),goods:P(['fruit','flowers','bread'],'fruit'),awning:P(['wavy','straight'],'wavy')}),
 size:Object.freeze({w:AW,h:STALL.post.h+STALL.awning.h,d:STALL.counter.d+STALL.awning.out+.04}),
 // Strop 11 kap. 4.3 [60, 20, 6] (karta odhadem 70 / 20).
 tris:Object.freeze([60,20,6]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),p=>build(p,2)]),shadow
});
