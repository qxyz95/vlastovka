// Pure distance/time helpers shared by rendering, previews and tests.
export const DISTRICTS=[{id:'violet',name:'FIALOVÉ PŘEDMĚSTÍ'},{id:'moon',name:'MĚSÍČNÍ DOKY'},{id:'sunset',name:'RUDÝ HORIZONT'},{id:'core',name:'NEONOVÉ JÁDRO'}];
export const PIXELS_PER_METER=2.1, SCREEN_PIXELS=640, SCREENS_PER_BIOME=4;
export const SCREEN_METERS=SCREEN_PIXELS/PIXELS_PER_METER;
export const SECTION_METERS=SCREEN_METERS*SCREENS_PER_BIOME, TRANSITION_METERS=SCREEN_METERS/2;
// Each entry is a physical stretch of the route, not a replacement backdrop.
export const ROUTE=[
 {name:'Dílna a první střechy',story:'Z okna dílny vyrážíš nad spící ulici.',kind:'roofs'},
 {name:'Tržnice pod anténami',story:'Za domy se otevírá náměstí s noční tržnicí.',kind:'market'},
 {name:'Zahrady na okraji',story:'Střechy řídnou, pod křídly zůstávají zahrady.',kind:'garden'},
 {name:'Železnice k řece',story:'Sleduješ koleje až k prvnímu přístavnímu molu.',kind:'rail'},
 {name:'Skladiště u vody',story:'Město za tebou mizí mezi přístavními sklady.',kind:'warehouse'},
 {name:'Les přístavních jeřábů',story:'Prolétáš kolem jeřábů nad nákladními loděmi.',kind:'cranes'},
 {name:'Most přes záliv',story:'Podél dlouhého mostu překonáváš otevřenou vodu.',kind:'bridge'},
 {name:'Maják na konci mola',story:'Světlo majáku ukazuje cestu k protějšímu břehu.',kind:'lighthouse'},
 {name:'Pole za zálivem',story:'Přístav střídají dlouhé pásy polí.',kind:'fields'},
 {name:'Větrný hřeben',story:'Nad poli se otáčejí větrné elektrárny.',kind:'turbines'},
 {name:'Horské sedlo',story:'Krajina se zvedá do skalnatého horského sedla.',kind:'peaks'},
 {name:'Observatoř nad údolím',story:'Za observatoří poprvé zahlédneš světla vzdáleného města.',kind:'observatory'},
 {name:'Brány metropole',story:'Z kopců přilétáš k branám neonové metropole.',kind:'gate'},
 {name:'Zahrady ve výškách',story:'Letíš mezi terasami a visutými zahradami.',kind:'terraces'},
 {name:'Vysílací věž',story:'Míjíš nejvyšší věž, světelný bod celé cesty.',kind:'tower'},
 {name:'Střešní přístav',story:'Za střešním přístavem začíná další cesta za obzor.',kind:'port'}
];
export function routeAt(distance){
 let position=Math.max(0,distance)/SCREEN_METERS;
 if(Math.abs(position-Math.round(position))<1e-10)position=Math.round(position);
 const screen=Math.floor(position),index=screen%ROUTE.length;
 return {...ROUTE[index],screen,index,biome:Math.floor(index/SCREENS_PER_BIOME),
  part:index%SCREENS_PER_BIOME+1,chapter:Math.floor(screen/ROUTE.length)+1,
  progress:position-screen};
}
export const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function districtAt(distance){
 const route=routeAt(distance),index=route.biome;
 const local=(route.part-1+route.progress)*SCREEN_METERS;
 const blend=smooth((local-(SECTION_METERS-TRANSITION_METERS))/TRANSITION_METERS);
 const next=(index+1)%DISTRICTS.length;
 return {index,next,blend,name:`${DISTRICTS[index].name} · ${route.part}/4 · ${route.name}`};
}
export function tileOffset(camera,speed,width=960){return -((camera*speed%width+width)%width);}
export function atmosphereAt(distance,time){
 const d=districtAt(distance),rain=[0,.85,.15,.45];
 const cycle=Math.floor(time/14),phase=time%14;
 return {rain:rain[d.index]*(1-d.blend)+rain[d.next]*d.blend,
  flock:phase<7?{x:740-phase*120,y:100+Math.sin(cycle*2.4)*35,alpha:smooth(phase)*smooth(7-phase)}:null};
}
