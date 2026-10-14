// Autopilot (režim sledování) pro testy, prototyp a budoucí __r3d: stiskne poryv ve středu okna, holuba podrží právě po střední dobu.
// Vrací 'down' / 'up' / null. Není součástí hry (src/), proto žije mezi pomocníky testů.
import {windows,activeEvent} from '../../src/events.js';
export function autoInput(f,dt=1/60){const e=activeEvent(f);if(!e||e.result||e.phase!=='interaction')return null;const w=windows(f);
 if(e.type==='gust')return f.t+dt/2>=e.at+w.gust.center?'down':null;
 if(e.heldAt===null)return 'down';return f.t+dt/2>=e.heldAt+w.bird.center?'up':null;}
