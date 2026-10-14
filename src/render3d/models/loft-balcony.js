// Pavlač s půdními dveřmi (karta H4 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.3 S-2): viditelná hrana, u které stojí dítě.
// Kraftová deska na dvou konzolách, tmavomodré zábradlí 0,95 m po sloupcích (LOD H, 80 px/m: výjimka z D-1 a z balcony), půdní dveře otevřené
// ke kameře s krémovou klikou (ne hořčicová). Souřadnice: x na střed desky (od boční stěny domu x = −w/2 po ruku dítěte), y = 0 horní plocha desky, čelo desky z = 0.
import {palette,mix,PAPER_TOKENS as T} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {block,panel,strip} from './parts.js';
import {LAUNCH} from './launch-site.js';

const W=LAUNCH.deckEnd-LAUNCH.house.x1,X0=-W/2;
// deska 4,1 × 2,4 × 0,2 m (od domu po ruku; karta 4 m), sloupky 0,05 m po 0,5 m, madlo 0,07 m s horní hranou 0,95 m, zábradlí 0,1 m za čelem desky.
// Dveře 0,95 × 2,05 m otevřené o 90° ke kameře (křídlo před lícem domu), klika ⌀ 0,1 m ve výšce 1 m.
export const LOFT=Object.freeze({w:W,deck:Object.freeze({d:2.4,t:.2}),rail:Object.freeze({h:.95,post:.05,step:.5,hand:.07,front:-.1}),
 door:Object.freeze({w:.95,h:2.05,x:X0-.1,front:.5}),knob:Object.freeze({r:.05,y:1})});
const C=()=>{const P=palette('papir'),navy=P.city.districts[0].window;return {deck:T.kraftDark,navy,inset:mix(navy,P.city.cut,.15),knob:T.cream};};

function build(){
 const c=C(),R=LOFT.rail,D=LOFT.door,out=[block({x:X0,w:W,y:-LOFT.deck.t,h:LOFT.deck.t,d:LOFT.deck.d,color:c.deck,part:'deck'})];
 // konzoly: šikmé vzpěry od zdi domu pod desku (přední a zadní)
 for(const z of [-.1,-LOFT.deck.d+.2])out.push(strip([X0,-1.4],[X0+1.6,-LOFT.deck.t],.15,{front:z,color:c.deck,part:'bracket'}));
 // zábradlí: 9 sloupků po 0,5 m a madlo
 const n=Math.round((W-.1)/R.step)+1;
 for(let i=0;i<n;i++)out.push(panel({x:X0+.05+i*R.step,w:R.post,h:R.h,front:R.front,color:c.navy,part:'railing'}));
 out.push(panel({x:X0,w:W,y:R.h-R.hand,h:R.hand,front:R.front+.01,color:c.navy,part:'railing'}));
 // půdní dveře: křídlo s vloženou výplní, klika
 out.push(panel({x:D.x,w:D.w,h:D.h,front:D.front,color:c.navy,part:'loftDoor'}),panel({x:D.x+.08,w:D.w-.16,y:.08,h:D.h-.16,front:D.front+.01,color:c.inset,part:'loftDoor'}),
  {shape:'disc',x:D.x+D.w-.2,y:LOFT.knob.y,r:LOFT.knob.r,n:10,z:D.front+.03,d:.02,color:c.knob,part:'knob'});
 return out;
}
export default Object.freeze({
 id:'loft-balcony',name:'Pavlač s půdními dveřmi',district:0,layers:LOD_LAYER,hero:true,
 prototype:'Dřevěná pavlač u půdních dveří (amsterdamské a pražské podkroví) s tmavomodrým litinovým zábradlím.',
 purpose:'Hrana místa odhodu (S-2): dítě stojí u zábradlí, ruka 1,4 m nad deskou, za vlaštovkou je nebe (madlo 0,95 m pod rukou).',
 params:Object.freeze({}),
 size:Object.freeze({w:W+.1,h:3.51,d:2.94}),
 // Strop 11 kap. 3.7: [55, 0, 0].
 tris:Object.freeze([55,0,0]),
 lod:Object.freeze([()=>build(),()=>[],()=>[]]),shadow:()=>[]
});
