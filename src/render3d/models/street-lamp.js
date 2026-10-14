// Pouliční lampa (karta 8 v research/design/11-katalog-ctvrt1.md): litinová lampa s lucernou na rameni (pražská ramenná lampa v jednoduchém tvaru).
// Ráno nesvítí (sklo D1.glass), večerní svit patří lampionům čtvrti 4. Rytmus ulice: chodník před domy (z ≈ −17), každých 30–45 m.
// Osa sloupu v x = 0, z = −AXIS (čelo patky v z = 0); rameno míří do strany (+x, dvouramenná i −x), aby se v bočním záběru četlo.
import {palette} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {lista,panel} from './parts.js';

// Míry karty: sloup 4,5 × 0,25 m, patka 0,5 m, rameno 0,8 m, lucerna 0,6 × 0,9 m (tělo 0,65 + stříška 0,25), visí pod koncem ramene.
export const LAMP=Object.freeze({h:4.5,pole:.25,base:.5,arm:.8,armY:4.15,armH:.12,lw:.6,lh:.65,roof:.25,finial:.25,basketY:2.4});
const AXIS=LAMP.base/2,C=()=>palette('papir').city.districts[0],LIFE=()=>palette('papir').life;
const tri=(pts,color,part)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);return {shape:'poly',x,w:Math.max(...xs)-x,y,h:Math.max(...ys)-y,z:-AXIS+.02,d:.04,pts,color,part};};
// Rameno se stříškou a lucernou na straně s (+1 vpravo, −1 vlevo); LOD 0 lucerna box + sklo + konzola (ozdoba), LOD 1 jen čelo lucerny.
function arm(s,iron,glass,lod){
 const {arm:A,armY:y,armH,lw,lh,roof}=LAMP,cx=s*A,ly=y-lh,x0=Math.min(0,cx),out=[panel({x:x0+(s<0?-.05:.05),w:A,y,h:armH,front:-AXIS+.03,color:iron,part:'arm'})];
 const top=[[cx-lw/2-.06,ly+lh],[cx+lw/2+.06,ly+lh],[cx,ly+lh+roof]];
 if(lod)return [...out,panel({x:cx-lw/2,w:lw,y:ly,h:lh,front:-AXIS+lw/2,color:iron,part:'lantern'}),tri(top,iron,'lantern')];
 // konzola pod ramenem: trojúhelník od sloupu k rameni (CCW podle strany)
 const br=s>0?[[0,y-.6],[A*.6,y],[0,y]]:[[0,y-.6],[0,y],[-A*.6,y]];
 return [...out,{shape:'box',x:cx-lw/2,w:lw,y:ly,h:lh,z:-AXIS,d:lw,color:iron,part:'lantern'},panel({x:cx-lw/2+.1,w:lw-.2,y:ly+.08,h:lh-.16,front:-AXIS+lw/2+.02,color:glass,part:'glass'}),
  {...tri(top,iron,'lantern'),z:-AXIS+lw/2,d:.04},tri(br,iron,'ornament')];
}
function build(p,lod){
 const D=C(),iron=D.window,{h,pole,base,finial}=LAMP,out=[];
 if(!lod)out.push(lista({x:-base/2,w:base,h:base,front:0,d:base,color:iron,part:'base'}));
 out.push(panel({x:-pole/2,w:pole,h,front:-AXIS+pole/2,color:iron,part:'pole'}));
 for(const s of p.arms===2?[1,-1]:[1])out.push(...arm(s,iron,D.glass,lod));
 if(lod)return out;
 out.push(tri([[-pole/2-.05,h],[pole/2+.05,h],[0,h+finial]],iron,'ornament'));
 // Květinový koš (+7 △): košík na sloupu, převislé květy jako trojúhelníky dolů (flag).
 if(p.basket){const y=LAMP.basketY,w=.8,f=[D.trees[0],LIFE().balloons[0],LIFE().balloons[3]];
  out.push(lista({x:-w/2,w,y,h:.3,front:.15,d:.4,color:D.trunk,part:'basket'}),...f.map((c,i)=>({shape:'flag',x:-w/2+i*w/3,w:w/3,y:y-.35,h:.4,z:.17,d:.04,color:c,part:'flower'})));}
 return out;
}
// Stínový proxy: sloup a lucerna(y) jako panely (≤ 6 △).
function shadow(p){
 const {h,pole,arm:A,armY,lw,lh}=LAMP,iron=C().window,z=-AXIS-.02;
 return [panel({x:-pole/2,w:pole,h,front:z,color:iron,part:'shadow'}),...(p.arms===2?[1,-1]:[1]).map(s=>panel({x:s*A-lw/2,w:lw,y:armY-lh,h:lh,front:z,color:iron,part:'shadow'}))];
}
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'street-lamp',name:'Pouliční lampa',district:0,layers:LOD_LAYER,
 prototype:'Litinová ramenná lampa s lucernou (pražské lampy v jednoduchém tvaru), volitelně s květinovým košem na sloupu.',
 purpose:'Rytmus ulice čtvrti 1: chodník před domy každých 30–45 m (7 na místo, v trhu místo nich girlandy). Ráno nesvítí.',
 params:Object.freeze({arms:P([1,2],1),basket:P([0,1],0)}),
 // Výchozí varianta (jedno rameno): patka až konec lucerny, výška po špici sloupu, hloubka patky a lucerny.
 size:Object.freeze({w:LAMP.base/2+LAMP.arm+LAMP.lw/2,h:LAMP.h+LAMP.finial,d:LAMP.lw}),
 // Strop karty [21, 8, 0] platí pro jednoramennou bez koše (21 / 7). Dvouramenná s košem má 42 / 12 (strop zvýšen rozhodnutím 14. 10.).
 tris:Object.freeze([42,12,0]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),()=>[]]),shadow
});
