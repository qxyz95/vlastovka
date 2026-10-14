// Dítě, hrdina startu (karta H1 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.4): papírová postavička `person` × 0,7 = 1,2 m.
// Hlava kotouč ⌀ 0,3 m, pláštěnka lichoběžník, nohy 0,45 m, vlasy kotouč za hlavou, oko tečka, skládaná čepice (trojúhelník s proužkem), boty.
// Jen čela (1–2 draw calls ve hře, animace pózy v S4). Souřadnice: x = 0 střed chodidel, y = 0 podlaha, čelo z = 0, dítě hledí na +x (směr hodu).
// Pózy jsou statické ukázky pro katalog; ruka v póze míření je 1,4 m nad chodidly (M-3: ruka 12 m, podlaha pavlače 10,6 m).
import {palette,mix,PAPER_TOKENS as T} from '../palette.js';
import {PERSON} from './person.js';
import {LOD_LAYER} from './scale.js';
import {panel,cutout,strip} from './parts.js';

export const KID=Object.freeze({h:PERSON.h*PERSON.child,head:.15,legs:.45,coat:Object.freeze([.4,.9]),shoulder:Object.freeze([.06,.84]),back:Object.freeze([-.06,.84]),cap:1.36,
 // ruka (střed dlaně) podle pózy, od středu chodidel; sed = na podlaze pavlače, trup o 0,4 m níž
 hand:Object.freeze({aim:[.32,1.4],charge:[-.3,1.32],throw:[.48,.98],wave:[.22,1.5],sit:[.3,.32],desk:[.42,.76]}),lean:Object.freeze({aim:0,charge:-.08,throw:.07,wave:0,sit:0,desk:.04})});
export const POSES=Object.freeze(Object.keys(KID.hand));
const C=()=>{const P=palette('papir'),D=P.city.districts[0];return {coat:D.near[1],legs:D.window,skin:P.life.people.skin[0],cap:T.kraft,band:T.tomato,ink:T.pencil700,side:P.city.side};};
const disc=(x,y,r,n,z,color,part)=>({shape:'disc',x,y,r,n,z,d:.02,color,part});

function build(p,lod){
 const c=C(),sit=p.pose==='sit',dy=sit?-.4:0,lean=KID.lean[p.pose],[hx,hy]=KID.hand[p.pose],up=([x,y],k=1)=>[x+lean*k,y+dy];
 const out=[],arm=mix(c.coat,c.side,.12),armBack=mix(c.coat,c.side,.2);
 // nohy: stojí (2 nohy + boty), sedí (stehna vodorovně dopředu po podlaze)
 if(sit)out.push(cutout([[-.12,0],[.42,0],[.42,.13],[-.12,.13]],{front:0,color:c.legs,part:'legs'}),...(lod?[]:[panel({x:.42,w:.06,y:0,h:.17,front:.01,color:c.ink,part:'shoe'})]));
 else if(lod)out.push(cutout([[-.15,0],[.15,0],[.13,KID.legs],[-.13,KID.legs]],{front:0,color:c.legs,part:'legs'}));
 else out.push(panel({x:-.14,w:.11,h:.46,color:c.legs,part:'legs'}),panel({x:.03,w:.11,h:.46,color:c.legs,part:'legs'}),
  panel({x:-.17,w:.16,h:.06,front:.01,color:c.ink,part:'shoe'}),panel({x:.02,w:.17,h:.06,front:.01,color:c.ink,part:'shoe'}));
 // pláštěnka (lichoběžník 0,52 → 0,34 m), zadní ruka za tělem (jen LOD H)
 const [c0,c1]=KID.coat;out.push(cutout([up([-.26,c0],0),up([.26,c0],0),up([.17,c1]),up([-.17,c1])],{front:.02,color:c.coat,part:'coat'}));
 if(!lod)out.push(strip(up(KID.back),up([-.22,.5]),.1,{front:-.02,color:armBack,part:'arm'}));
 // hlava: vlasy (kotouč za hlavou), obličej, oko; čepice z kraftu s rajčatovým proužkem
 const hc=up([.02,1.05]),hair=up([-.04,1.05]),r=KID.head;
 out.push(disc(hair[0],hair[1],r,lod?6:14,.025,c.ink,'hair'),disc(hc[0],hc[1],r,lod?8:16,.035,c.skin,'head'));
 if(!lod)out.push(disc(hc[0]+.08,hc[1]+.01,.018,6,.045,c.ink,'eye'));
 out.push(cutout([up([-.19,1.11]),up([.18,1.11]),up([0,KID.cap])],{front:.055,color:c.cap,part:'cap'}));
 if(!lod){const b=up([-.19,1.09]);out.push(panel({x:b[0],w:.37,y:b[1],h:.05,front:.065,color:c.band,part:'capBand'}));}
 // přední ruka od ramene k dlani (póza), dlaň kotouč
 const hand=[hx,hy];out.push(strip(up(KID.shoulder,.9),hand,.1,{front:.075,color:arm,part:'arm'}));
 if(!lod)out.push(disc(hand[0],hand[1],.055,8,.085,c.skin,'hand'));
 return out;
}
// Stínový proxy (11 kap. 4.2: ≤ 4 △, stojící pózy stín nemění): obrys nohy–pláštěnka–čepice, 5 bodů = 3 △; sed (menu) nízký obrys s nohama vpřed.
const shadow=p=>[cutout(p.pose==='sit'?[[-.26,0],[.42,0],[.42,.13],[0,KID.cap-.4],[-.26,KID.coat[1]-.4]]:[[-.2,0],[.2,0],[.26,KID.coat[0]],[0,KID.cap],[-.26,KID.coat[0]]],
 {front:-.01,color:C().coat,part:'shadow'})];
const Pp=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'kid',name:'Dítě (hrdina startu)',district:0,layers:LOD_LAYER,hero:true,
 prototype:'Papírová postavička (person × 0,7, Tearaway): dítě v pláštěnce se skládanou papírovou čepicí, které vlaštovky skládá a hází.',
 purpose:'Hráčova postava na pavlači místa odhodu: zblízka při každém míření (96 px), v menu a u stolu Dílny; LOD 1 pro oddálení a menu z dálky.',
 params:Object.freeze({pose:Pp(POSES,'aim')}),
 // Výchozí póza míření: od zadní ruky po dlaň, výška po dlaň (1,4 m + dlaň), hloubka vrstev čel.
 size:Object.freeze({w:.64,h:1.455,d:.17}),
 // Strop 11 kap. 3.7: [80 LOD H, 20 oddálení, 0].
 tris:Object.freeze([80,20,0]),
 lod:Object.freeze([p=>build(p,0),p=>build(p,1),()=>[]]),shadow
});
