// Registr čtyř čtvrtí (vlastní integrátor). Pořadí = biome = DISTRICTS ve scenes.js (violet, moon, sunset, core).
// Každá čtvrť: {id, places (indexy 0–15), layout (čisté *-layout.js pro cityChunk), build(chunk,ctx) → THREE.Group|null, update(group,frameCtx)}.
// Smlouvy ctx a frameCtx jsou v ../index.js. Agenti D1–D4 mění jen districts/<id>.js a <id>-layout.js, registr ne.
import { SUBURBS_LAYOUT } from './suburbs-layout.js';
import { DOCKS_LAYOUT } from './docks-layout.js';
import { HORIZON_LAYOUT } from './horizon-layout.js';
import { CORE_LAYOUT } from './core-layout.js';
import * as suburbs from './suburbs.js';
import * as docks from './docks.js';
import * as horizon from './horizon.js';
import * as core from './core.js';
export const DISTRICT_VIEWS = [
  [SUBURBS_LAYOUT, suburbs],
  [DOCKS_LAYOUT, docks],
  [HORIZON_LAYOUT, horizon],
  [CORE_LAYOUT, core],
].map(([layout, m]) => ({
  id: layout.id,
  places: layout.places,
  layout,
  build: m.build,
  update: m.update,
}));
export const districtOf = index => DISTRICT_VIEWS[Math.floor((((index % 16) + 16) % 16) / 4)];
