// Komín (karta 4 v research/design/11-katalog-ctvrt1.md): zděný komín s hlavicí a nástavci, říká „tady se bydlí, je ráno, topí se“.
// Díl parts.chimney je součást modelu domu; tady stojí samostatně na kousku ploché střechy (y = 0), aby šel posoudit v katalogu.
// Kouř (krémové obláčky, instancované) není součást modelu, patří životu čtvrti (K5).
import {palette} from '../palette.js';
import {LOD_LAYER} from './scale.js';
import {tones,chimney,panel} from './parts.js';

const SIZE=Object.freeze({small:.8,big:1.4});
const build=lod=>p=>{const c=palette('papir').life.chimney;return chimney({r:{shape:'flat',y:0},cx:0,w:p.big?SIZE.big:SIZE.small,front:0,d:.8,above:p.above,color:c,cap:tones(c).trim,lod,stacks:p.stacks});};
const P=(values,def)=>Object.freeze({values:Object.freeze(values),default:def});
export default Object.freeze({
 id:'chimney',name:'Komín',district:0,layers:LOD_LAYER,
 prototype:'Zděný komín městského domu s hlavicí a keramickými nástavci (komínovými hlavami), 0,8 m, velký dvojitý 1,4 m.',
 purpose:'Na střechách domů čtvrti 1 (0–2 na dům, díl modelu domu): členitá silueta střech a místo pro ranní kouř.',
 // above = horní hrana dříku nad plochou střechou (1,2–2,5 m; nad hřebenem dává model domu 1 m). Nástavce 1–2 (3. nástavec: BLOCKED, strop 20 △).
 params:Object.freeze({above:P([1.2,1.8,2.5],1.8),stacks:P([1,2],1),big:P([0,1],0)}),
 size:Object.freeze({w:SIZE.small+.3,h:1.8+.3+.35,d:1}),
 tris:Object.freeze([20,8,4]),
 lod:Object.freeze([build(0),build(1),build(2)]),
 shadow:p=>{const [s]=build(1)(p);return [panel({x:s.x,w:s.w,y:s.y,h:s.h,front:-.4,color:s.color,part:'shadow'})];}
});
