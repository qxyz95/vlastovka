// Úzký dům se štítem do ulice (karta 2 v research/design/11-katalog-ctvrt1.md). Předobraz: štítové domy Amsterdamu, Lübecku a Telče.
// Rozbíjí linii řadovek a dává ulici vysokou siluetu proti nebi. Čelo je jedna vystřižená karta se stupňovitým, zvonovým nebo prostým štítem,
// střecha za ní je vidět jen jako okraj. Pod vrcholem štítu kladkový trám (amsterdamské domy). Barvy jako house-row.
import {palette} from '../palette.js';
import {SCALE,CARD_DEPTH,LOD_LAYER} from './scale.js';
import {hash,pickOf,tones,block,lista,panel,gableRoof,cornice,windowCut,door,shopfront,steppedGable,outline} from './parts.js';

const BAY=2.4,MARGIN=.7,F=SCALE.floor,W=2*BAY+2*MARGIN,BEAM=Object.freeze({w:.3,h:.3,out:1});
const C=()=>palette('papir').city.districts[0];
const layerOf=(p,lod)=>p.layer==='auto'?LOD_LAYER[Math.min(1,lod)]:p.layer;
// Výška štítu 4–6 m podle seedu (karta: štít 4–6 m).
export const gableHeight=seed=>4+2*hash(seed,1);

function base(p,lod){
 const D=C(),L=layerOf(p,lod),pal=L==='mid'?D.mid:D.near,wall=pal[p.color%pal.length];
 return {D,wall,t:tones(wall),d:CARD_DEPTH[L],H:p.floors*F,x:-W/2,gh:gableHeight(p.seed),roofC:D.roof[p.roof%D.roof.length]};
}
function build(p,lod){
 const {D,wall,t,d,H,x,gh,roofC}=base(p,lod),front=steppedGable({kind:p.gable,x,w:W,y:H,h:gh,color:wall,lod});
 if(lod===2)return [panel({x,w:W,h:H,color:wall,part:'wall'}),...front];
 const out=[block({x,w:W,h:H,d,color:wall}),...front,gableRoof({x,w:W,y:H,front:-.5,d:d-.5,wall,roof:roofC,ov:0,h:gh*.8,eaves:false})];
 const doorBay=hash(p.seed,2)<.5?0:1,bx=i=>x+MARGIN+BAY*(i+.5),shop=p.ground==='shop';
 out.push(...door({cx:bx(doorBay),t,lod}));
 if(shop){const i=1-doorBay;out.push(...shopfront({x0:bx(i)-BAY/2+.25,x1:bx(i)+BAY/2-.25,t,glass:D.glass,awning:pickOf(D.near.filter(c=>c!==wall),p.seed,4),lod}));}
 for(let k=0;k<p.floors;k++)for(let i=0;i<2;i++)if(k||(i!==doorBay&&!shop))out.push(...windowCut({cx:bx(i),y:k*F+SCALE.sill,t,lod}));
 out.push(...windowCut({cx:0,y:H+SCALE.sill,t,lod}));
 if(lod===0)out.push(lista({x:x-.05,w:W+.1,h:.6,front:.06,d:.06,color:t.plinth,part:'plinth'}),cornice({x:x-.1,w:W+.2,y:H-.18,h:.18,out:.12,color:t.trim,part:'stringcourse'}),
  lista({x:-BEAM.w/2,w:BEAM.w,y:H+gh-.75,h:BEAM.h,front:BEAM.out,d:BEAM.out,color:D.trunk,part:'hoist'}));
 return out;
}
// Stínový proxy: obrys domu se štítem (poly, 4–5 △).
function shadow(p){
 const {wall,H,x,gh,d}=base(p,0),top=p.gable==='plain'?[[0,H+gh]]:[[1,H+gh],[-1,H+gh]];
 return [outline([[0,0],[x+W,0],[x+W,H],...top,[x,H],[x,0]],{z:-d/2,color:wall})];
}
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'house-gable',name:'Dům se štítem',district:0,layers:LOD_LAYER,
 prototype:'Úzké štítové domy do ulice: Amsterdam (trapgevel, klokgevel), Lübeck, Telč; kladkový trám pod vrcholem štítu.',
 purpose:'Rozbíjí linii řadovek v ulici a ve středu čtvrti 1 (místa 1 a 2), dává rytmus a vysokou siluetu proti nebi; přízemí s dveřmi, volitelně obchod.',
 params:Object.freeze({floors:P([3,4,5],4),gable:P(['stepped','bell','plain'],'stepped'),color:P([0,1,2,3,4,5,6,7],1),roof:P([0,1,2],0),
  ground:P(['flat','shop'],'flat'),seed:P([1,2,3,4,5],1),layer:P(['auto','near','mid'],'auto')}),
 // Výchozí varianta (přízemí + 3 patra, stupňovitý štít): šířka 2 osy + parapety, výška po vrchol štítu, hloubka ulice + trám + střecha za čelem.
 size:Object.freeze({w:W+.2,h:4*F+gableHeight(1),d:CARD_DEPTH.near+.2+BEAM.out}),
 tris:Object.freeze([220,45,10]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),p=>build(p,2)]),shadow
});
