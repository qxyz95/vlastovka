// Autopilot (režim sledování) pro testy, prototyp a budoucí __r3d: stiskne poryv ve středu okna, holuba podrží právě po střední dobu.
// Vrací 'down' / 'up' / null. Není součástí hry (src/), proto žije mezi pomocníky testů. Okna události jsou v e.w (src/flight.js).
import { activeEvent } from '../../src/events.js';
export function autoInput(f, dt = 1 / 60) {
  const e = activeEvent(f);
  if (!e || e.result || e.phase !== 'interaction') return null;
  if (e.type !== 'bird') return f.t + dt / 2 >= e.w.c ? 'down' : null;
  if (e.heldAt === null) return 'down';
  return f.t + dt / 2 >= e.heldAt + e.w.c ? 'up' : null;
}
