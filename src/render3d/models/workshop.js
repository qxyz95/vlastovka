// Dílna PAPER LAB (karta 5 v research/design/11-katalog-ctvrt1.md, bible 05 kap. 9): domek dítěte na začátku cesty, „domov“ v klidovém záběru.
// Vychází z papírové Dílny P3 (src/render3d/workshop.js workshopCards, three.js): stejné míry a polohy (dům z cityChunk(0) shop, přístavek do výšky
// ruky dítěte KID.y, cedulka paperSign) a doplňky karty: příčky dílenského okna, horní okno s okenicemi, komín, truhlík na přístavku, kolo u zdi,
// poštovní schránka, hřebíky na cedulce, police s papíry v okně. Model je v souřadnicích katalogu (čelo domu z = 0); do hry ho posune
// place(cards, WORKSHOP_AT) zpět do souřadnic místa 0. Nápis PAPER LAB zůstává texturou ve workshop.js (model kreslí jen kartu cedulky).
// Dítě (kid: 1) je statická ukázka klidové pózy pro katalog; ve hře ho animuje workshop.js (kid: 0). Vlaštovku v ruce kreslí plane.js.
import {palette,PAPER_TOKENS as T} from '../palette.js';
import {HAND} from '../pose.js';
import {LOD_LAYER} from './scale.js';
import {tones,block,lista,panel,gableRoof,windowCut,door,chimney,outline} from './parts.js';

// P3: dům = blok cityChunk(0) shop (x 20, šířka 24, výška 12, čelo z −5), štít 8 m s přesahem 0,8; dítě S = 0,25 m na px 2D postavičky.
export const S=.25,KID=Object.freeze({x:HAND.x-24*S,y:HAND.y-35*S,z:HAND.z});
const HOUSE=Object.freeze({x:20,w:24,h:12,front:-5,d:6,roof:8,ov:.8}),ANNEX_END=HAND.x+7;
export const WORKSHOP_AT=Object.freeze({x:(HOUSE.x+ANNEX_END)/2,z:HOUSE.front});
const HX=HOUSE.x-WORKSHOP_AT.x,KX=KID.x-WORKSHOP_AT.x,AX=HX+HOUSE.w,AW=ANNEX_END-HOUSE.x-HOUSE.w,TOP=KID.y,AF=HAND.z-1-HOUSE.front,AD=6,KZ=KID.z-HOUSE.front;
// Cedulka (paperSign): 12 × 2,4 m uprostřed domu pod štítem, 0,3 m před čelem, provázky ±5 m.
export const SIGN=Object.freeze({x:HX+HOUSE.w/2,y:HOUSE.h-1.2,w:12,h:2.4,front:.3,strings:Object.freeze([-5,5])});
const DOOR_X=HX+HOUSE.w-4.5,ANNEX_DOOR_X=AX+AW-5;
const W=()=>palette('papir').workshop,D1=()=>palette('papir').city.districts[0],LIFE=()=>palette('papir').life;
const poly=(pts,front,color,part)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);return {shape:'poly',x,w:Math.max(...xs)-x,y,h:Math.max(...ys)-y,z:front-.025,d:.05,pts,color,part};};
// Proužek mezi dvěma body (rám kola, vidlice), šířka w, jen čelo.
const bar=([x0,y0],[x1,y1],w,front,color,part)=>{const l=Math.hypot(x1-x0,y1-y0),nx=-(y1-y0)/l*w/2,ny=(x1-x0)/l*w/2;return poly([[x0-nx,y0-ny],[x1-nx,y1-ny],[x1+nx,y1+ny],[x0+nx,y0+ny]],front,color,part);};

// Dítě (P3 kidParts, papír): kvádry v px 2D postavičky, klidová póza; ruka míří k vlaštovce v HAND (proužek místo otočené skupiny).
function kid(P){
 const b=(x,y,w,h,d,color,shape='box')=>({shape,x:KX+x*S,w:w*S,y:KID.y+y*S,h:h*S,z:KZ,d:d*S,color,part:'kid'});
 const sh=[KX+14*S,KID.y+28*S],hand=[KX+22.5*S,HAND.y-1*S];
 return [b(1,0,5,10,5,P.legs),b(11,0,5,10,5,P.legs),b(0,10,16,20,9,P.shirt),b(3,30,10,10,9,P.skin),b(2,38,12,3,9.4,P.frame),b(1,40,14,7,9,P.visor,'pyr'),
  {...bar(sh,hand,4*S,KZ+6.5*S+2*S,P.shirt,'kid')},{...bar(hand,[hand[0]+4*S,hand[1]+1*S],6*S,KZ+6.5*S+2.5*S,P.skin,'kid')}];
}
// Kolo opřené o zeď (karta: 2 kotouče jen čelem, rám D1.near[2]): vystřižený hlavní a zadní trojúhelník rámu, vidlice, řídítka a sedlo.
function bike(x,front){
 const r=.35,rear=[x+r,r],fr=[x+r+1.1,r],bb=[x+r+.5,.3],seat=[x+r+.3,.95],head=[x+r+.95,.95],teal=D1().near[2],tyre=T.pencil700;
 return [{shape:'disc',x:rear[0],y:r,r,n:8,z:front-.02,d:.04,color:tyre,part:'bike'},{shape:'disc',x:fr[0],y:r,r,n:8,z:front-.02,d:.04,color:tyre,part:'bike'},
  poly([bb,head,seat],front+.02,teal,'bike'),poly([rear,bb,seat],front+.02,teal,'bike'),bar(head,fr,.07,front+.03,teal,'bike'),
  panel({x:head[0]-.1,w:.35,y:head[1]+.05,h:.07,front:front+.04,color:tyre,part:'bike'}),panel({x:seat[0]-.15,w:.3,y:seat[1]+.03,h:.08,front:front+.04,color:tyre,part:'bike'})];
}
function build(p,lod){
 const P=W(),D=D1(),L=LIFE(),p3=p.door==='p3',out=[];
 const roof=gableRoof({x:HX,w:HOUSE.w,y:HOUSE.h,d:HOUSE.d,wall:P.wall,roof:P.roof,ov:HOUSE.ov,h:HOUSE.roof,...(lod===2?{eaves:false}:{})});
 const ch=L.chimney,chim=chimney({r:roof,cx:HX+HOUSE.w*.8,color:ch,cap:tones(ch).trim,lod,above:1,stacks:2});
 const annex=[block({x:AX,w:AW,h:TOP-.5,front:AF,d:AD,color:P.annex,part:'annex',shape:lod===2?'lista':'box'}),block({x:AX-.3,w:AW+.6,y:TOP-.5,h:.5,front:AF+.3,d:AD+.6,color:P.trim,part:'terrace',shape:lod===2?'lista':'box'})];
 if(lod===2)return [block({x:HX,w:HOUSE.w,h:HOUSE.h,d:HOUSE.d,color:P.wall,shape:'lista'}),roof,...chim,...annex,panel({x:SIGN.x-SIGN.w/2,w:SIGN.w,y:SIGN.y-SIGN.h/2,h:SIGN.h,front:SIGN.front,color:P.sign,part:'sign'}),
  ...(p.kid?[panel({x:KX,w:16*S,y:KID.y,h:47*S,front:KZ,color:P.shirt,part:'kid'})]:[])];
 out.push(block({x:HX,w:HOUSE.w,h:HOUSE.h,d:HOUSE.d,color:P.wall}),roof,...chim,...annex);
 // Dílenské okno (výjimka z měřítka okna): rám, teplé sklo, stůl dítěte (deska, kelímek s tužkami, tužka, vystřižená vlaštovka), police s papíry, příčky.
 const wx=HX+2.8,ww=11.4,wy=1.8,wh=4.8;
 out.push(panel({x:wx-.4,w:ww+.8,y:wy-.4,h:wh+.8,front:.1,d:.1,color:P.frame,part:'frame'}),panel({x:wx,w:ww,y:wy,h:wh,front:.17,d:.1,color:P.window,part:'workshopWindow'}),
  panel({x:wx+.4,w:10.6,y:3.1,h:.35,front:.225,color:P.desk,part:'desk'}),panel({x:HX+4,w:.9,y:3.45,h:1.3,front:.225,color:P.cup,part:'desk'}),
  panel({x:HX+11,w:.25,y:3.45,h:1.7,front:.225,color:P.frame,part:'desk'}),{shape:'flag',x:HX+6,w:2.4,y:3.5,h:1,z:.22,d:.05,color:P.plane,part:'deskPlane'});
 // Okna nad vchodem (nad sebou): patro a horní okno s okenicemi; u dveří P3 (6 m) jen horní. Teplé sklo, rám tmavomodrý (grafit nad 8 m ne).
 const ut={...tones(P.wall),pane:P.window,frame:P.door,trim:P.trim};
 out.push(lista({x:wx-.6,w:ww+1.2,y:wy-.55,h:.15,front:.35,d:.35,color:P.trim,part:'sill'}),lista({x:HX+3.2,w:2.2,y:5,h:.1,front:.26,d:.06,color:P.desk,part:'shelf'}),
  ...[[.5,.3,P.sign],[.45,.45,L.pastel[2]],[.5,.22,L.pastel[4]]].map(([w,h,c],i)=>panel({x:HX+3.3+i*.7,w,y:5.1,h,front:.25,color:c,part:'papers'})),
  ...[1,2,3].map(k=>panel({x:wx+ww*k/4-.1,w:.2,y:wy,h:wh,front:.32,color:P.frame,part:'mullion'})),panel({x:wx,w:ww,y:5.8,h:.2,front:.33,color:P.frame,part:'mullion'}));
 // Vchody: dveře světa (1,1 × 2,2 m se schodem a stříškou) nebo dveře P3 (4,2 × 6 m s klikou; klika krémová místo hořčicové, BLOCKED).
 const dt={...tones(P.wall),door:P.door};
 if(p3)out.push(panel({x:DOOR_X-2.1,w:4.2,h:6,front:.2,color:P.door,part:'wideDoor'}),panel({x:DOOR_X+1.2,w:.5,y:2.8,h:.5,front:.3,color:P.trim,part:'knob'}),
  panel({x:ANNEX_DOOR_X-2,w:4,h:5,front:AF+.2,color:P.door,part:'wideDoor'}));
 else out.push(...door({cx:DOOR_X,t:dt,lod,canopy:P.roof}),...door({cx:ANNEX_DOOR_X,front:AF,t:{...tones(P.annex),door:P.door},lod,canopy:P.trim}),...windowCut({cx:DOOR_X,y:4.4,t:ut,lod}));
 out.push(...windowCut({cx:DOOR_X,y:7.4,t:ut,lod,shutter:P.annex}));
 // Poštovní schránka u dveří (PT.tomato), kolo opřené o zeď mezi oknem a vchodem.
 out.push(lista({x:HX+HOUSE.w-1.9,w:.45,y:1.1,h:.55,front:.3,d:.3,color:T.tomato,part:'mailbox'}),...bike(HX+14.95,.4));
 // Přístavek: teplá výloha s rámem, truhlík s květinami pod ní, grafitové zábradlí terasy (sloupky + madlo).
 out.push(panel({x:AX+2.7,w:11.6,y:1.1,h:4.4,front:AF+.05,color:P.frame,part:'frame'}),panel({x:AX+3,w:11,y:1.4,h:3.8,front:AF+.1,color:P.warm,part:'workshopWindow'}),
  lista({x:AX+3.5,w:10,y:.75,h:.45,front:AF+.45,d:.4,color:D.trunk,part:'flowerbox'}),
  ...[0,1,2,3,4].map(i=>({shape:'disc',x:AX+4.4+i*2.05,y:1.45,r:.3,n:6,z:AF+.42,d:.04,color:[L.balloons[0],L.balloons[3],L.balloons[4]][i%3],part:'flower'})));
 for(let i=0;i<6;i++)out.push(lista({x:AX+1+i*(AW-2.4)/5,w:.35,y:TOP,h:1.4,front:AF-.225,d:.35,color:P.rail,part:'railing'}));
 out.push(lista({x:AX+1,w:AW-2,y:TOP+1.4,h:.3,front:AF-.2,d:.4,color:P.rail,part:'railing'}));
 // Cedulka PAPER LAB: krémová karta, rajčatové podtržení, provázky ke štítu a hřebíky (tužka: grafit nad 8 m ne, 11 kap. 1.4).
 const sx=SIGN.x-SIGN.w/2,sy=SIGN.y-SIGN.h/2;
 out.push(panel({x:sx,w:SIGN.w,y:sy,h:SIGN.h,front:SIGN.front,color:P.sign,part:'sign'}),panel({x:SIGN.x-2.5,w:5,y:sy+.25,h:.12,front:SIGN.front+.02,color:P.signLine,part:'sign'}),
  ...SIGN.strings.flatMap(dx=>[panel({x:SIGN.x+dx-.04,w:.08,y:sy+SIGN.h-.2,h:1.8,front:SIGN.front-.03,color:P.string,part:'string'}),
   {shape:'disc',x:SIGN.x+dx,y:sy+SIGN.h-.25,r:.16,n:4,z:SIGN.front+.03,d:.04,color:T.pencil,part:'nail'}]));
 return [...out,...(p.kid?kid(P):[])];
}
// Stínový proxy: dům se štítem (5 bodů, 3 △), přístavek a dítě (panely), ≤ 7 △.
function shadow(p){
 const P=W(),x0=HX,x1=HX+HOUSE.w,h=HOUSE.h,z=-HOUSE.d/2;
 return [outline([[x0,0],[x1,0],[x1,h],[(x0+x1)/2,h+HOUSE.roof],[x0,h]],{z,color:P.wall}),panel({x:AX,w:AW,h:TOP,front:AF-AD/2,color:P.annex,part:'shadow'}),
  ...(p.kid?[panel({x:KX,w:16*S,y:KID.y,h:47*S,front:KZ,color:P.shirt,part:'shadow'})]:[])];
}
const Pp=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'workshop',name:'Dílna PAPER LAB',district:0,layers:LOD_LAYER,
 prototype:'Domek dítěte na začátku cesty (bible 05 kap. 9): krémový dům se štítem, velké dílenské okno se stolem, cedulka na provázcích, tyrkysový přístavek s terasou.',
 purpose:'Hrdina ulice místa 1 („domov“): hráč ji vidí před každým hodem v klidovém záběru; dítě stojí na terase přístavku a drží vlaštovku.',
 // door: 'world' dveře světa 1,1 × 2,2 m (doporučeno, 10 kap. 2), 'p3' dveře dnešní Dílny 4,2 × 6 m (BLOCKED). kid: statické dítě pro katalog.
 params:Object.freeze({door:Pp(['world','p3'],'world'),kid:Pp([1,0],1)}),
 // Přízemí 3,5 m (karta 5: přízemí 3,5 + patro 3 + podkroví), okna nad vchodem v 4,4 a 7,4 m.
 ground:3.5,
 // Výchozí varianta: od přesahu štítu po konec terasy, výška po nástavce komína, hloubka od zadní hrany střechy po ruku dítěte.
 size:Object.freeze({w:ANNEX_END-HOUSE.x+HOUSE.ov+.3,h:HOUSE.h+HOUSE.roof+1.65,d:13.45}),
 // Strop 11 kap. 4.3 [1 000, 0, 30]: LOD 1 se nekreslí (Dílna je hrdina ulice místa 1, i v kvalitě 0 LOD 0), LOD 2 = hmota pro stín a dálku.
 tris:Object.freeze([1000,0,30]),
 lod:Object.freeze([p=>build(p,0),()=>[],p=>build(p,2)]),shadow
});
