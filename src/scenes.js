import {t} from './i18n.js';
// Pure distance/time helpers shared by rendering, previews and tests.
// Names and stories are read in the current language (src/locales: district.<id>, place.<kind>, place.<kind>.story).
export const DISTRICTS=['violet','moon','sunset','core'].map(id=>({id,get name(){return t('district.'+id);}}));
export const PIXELS_PER_METER=2.1, SCREEN_PIXELS=640, SCREENS_PER_BIOME=4;
export const SCREEN_METERS=SCREEN_PIXELS/PIXELS_PER_METER;
export const SECTION_METERS=SCREEN_METERS*SCREENS_PER_BIOME, TRANSITION_METERS=SCREEN_METERS/2;
// Each entry is a physical stretch of the route, not a replacement backdrop.
export const ROUTE=['roofs','market','garden','rail','warehouse','cranes','bridge','lighthouse','fields','turbines','peaks','observatory','gate','terraces','tower','port'].map(kind=>({kind,get name(){return t('place.'+kind);},get story(){return t('place.'+kind+'.story');}}));
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
 return {index,next,blend,name:t('scene.district',{district:DISTRICTS[index].name,part:route.part,place:route.name})};
}
export function tileOffset(camera,speed,width=960){return -((camera*speed%width+width)%width);}
export function atmosphereAt(distance,time){
 const d=districtAt(distance),rain=[0,.85,.15,.45];
 const cycle=Math.floor(time/14),phase=time%14;
 return {rain:rain[d.index]*(1-d.blend)+rain[d.next]*d.blend,
  flock:phase<7?{x:740-phase*120,y:100+Math.sin(cycle*2.4)*35,alpha:smooth(phase)*smooth(7-phase)}:null};
}
