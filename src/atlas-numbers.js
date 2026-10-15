// Tunable numbers of the Atlas (research/atlas/01-navrh-atlasu.md §6.2). PROVISIONAL: derived from src/progression-numbers.js
// (copy of simulation/progression/params.mjs with a parity test). Step C1 replaces it with the tuned set; nothing else may hardcode levels or prices.
import { SCREEN_METERS } from './scenes.js';
import { PROGRESSION as G } from './progression-numbers.js';

const A = G.atlas,
  E = G.events;
// Same order as params.mjs atlas.bonuses (place 1..16).
const BONUS_IDS = [...A.bonuses];
const UNLEVELLED = [...A.unlevelled];
const DISTRICT_PRICES = A.prices; // [level 2, level 3] by district of the place
const lv = (a, i) => a[Math.min(i, a.length - 1)];
const r9 = v => Math.round(v * 1e9) / 1e9;
const L3 = [1, 2, 3];
// values[id][level-1] = template values for that level (params atlas.* and events.*).
const VALUES = {
  chain: A.chain.map(c => ({ step: c.step, max: c.max })),
  pinwheel: L3.map((l, i) => ({
    rerolls: A.pinwheel.rerolls[i],
    noHeadwind: A.pinwheel.noHeadwind[i],
  })),
  steam: L3.map(l => ({
    push: l >= 2 ? E.steam.levelPush : 0,
    burst: l >= 3 ? E.steam.burst.amp : 0,
    dur: E.steam.burst.dur,
  })),
  tape: A.tape.map(keep => ({ keep })),
  crane: L3.map(l => ({ lift: A.crane * l })),
  skip: L3.map((l, i) => ({ keep: A.skip.keep[i], bounces: A.skip.bounces[i] })),
  gull: L3.map((l, i) => ({ carry: A.gull.carry[i], push: A.gull.push[i] })),
  momentum: L3.map((l, i) => ({ step: A.momentum.step[i], cap: A.momentum.cap[i] })),
  thermal: L3.map(l => ({
    push: l >= 2 ? E.thermal.levelPush : 0,
    second: l >= 3 ? E.thermal.secondChance : 0,
  })),
  echo: A.echo.share.map(share => ({ share, delay: A.echo.delay })),
  star: E.star.chance.map(chance => ({ chance, amp: E.star.burst.amp, dur: E.star.burst.dur })),
  drone: L3.map(l => ({
    wider: l >= 2 ? r9(E.drone.levelWindow - 1) : 0,
    pair: l >= 3 ? E.drone.pairChance : 0,
  })),
  paperCrane: A.paperCrane.reach.map(r => ({ reach: Math.round(r * SCREEN_METERS) })),
  onAir: A.onAir.beta.map(beta => ({ beta, combo: A.onAir.combo })),
};
const levelled = BONUS_IDS.filter(id => !UNLEVELLED.includes(id));
const Pk = G.pockets;
export const PROVISIONAL = {
  provisional: true,
  route: { ...G.route },
  atlas: {
    bonuses: BONUS_IDS,
    maxLevel: Object.fromEntries(BONUS_IDS.map(id => [id, UNLEVELLED.includes(id) ? 1 : 3])),
    // prices[id][level-1] = cost of reaching that level; level 1 is free (found by flying).
    prices: Object.fromEntries(
      BONUS_IDS.map((id, i) => [
        id,
        UNLEVELLED.includes(id) ? [null] : [null, ...lv(DISTRICT_PRICES, Math.floor(i / 4))],
      ]),
    ),
    values: Object.fromEntries(levelled.map(id => [id, VALUES[id]])),
  },
  pockets: {
    prices: [...Pk.prices],
    secondFromDistrict: Pk.secondFromDistrict,
    unlock: { ...Pk.unlock },
    active: [...Pk.active],
    exclusive: Pk.exclusive.map(g => [...g]),
    oneActive: true,
  },
  paper: { kinds: ['copy', 'kraft', 'washi', 'neon'], openAtPlace: G.workshop.paper.openAtPlace },
  gliderAt: A.gliderAt,
  coinMultiplier: null,
  // Nodes not bound to a place (or bound optionally). price null = not tuned yet → "Coming soon".
  nodes: { nightRoute: { price: null }, autoQte: { price: null } },
};
export const NUMBERS = PROVISIONAL;
