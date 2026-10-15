// Gradual reveal (02-ux §4.1, §4.4, §2.2): what the UI shows for a given save, the coin line and the prompt hint.
// Pure functions of data, no DOM and no texts: the UI maps the returned ids and kinds to i18n keys.
import { BRANCH_IDS, branchStatus } from './gear.js';
import { NUMBERS } from './atlas-numbers.js';
import { SCREEN_METERS } from './scenes.js';

// Placeholder thresholds, tune later by the game designer (zástupné, doladí game-designer). Only these may be edited here.
export const ATLAS_OPEN_PLACE = 2; // the Atlas opens when the 2nd place of the route is reached (02-ux §4.1)
export const ATLAS_OPEN_METERS = (ATLAS_OPEN_PLACE - 1) * SCREEN_METERS;
export const GLIDER_METERS = NUMBERS.gliderAt; // from atlas-numbers (100 m), the model row appears with the Glider
export const WEAK_POWER = 0.35; // a throw below this power (0..1) is weak (02-ux §2.2)
export const WEAK_STREAK = 2; // weak throws in a row that bring the hint back once
export const STRONG_FOR_CALM = 3; // strong throws after which the hint goes away and the prompt calms down

const num = v => (Number.isFinite(v) ? v : 0);

// p: save (tolerates missing fields of old saves). Nothing here is announced retroactively: an old save with 500 m
// just sees everything it has already earned (02-ux §4.7 bod 3).
export function reveal(p) {
  const attempts = num(p?.attempts),
    best = num(p?.best),
    coins = num(p?.coins);
  const workshop = attempts >= 1 || best > 0 || coins > 0;
  const atlas = best >= ATLAS_OPEN_METERS || !!p?.completed || !!p?.atlas?.finished;
  const models = best >= GLIDER_METERS || p?.model === 'glider' || !!p?.completed;
  return {
    coins: workshop, // coin chip appears after the first throw
    workshop,
    atlas,
    models, // the model row in the Workshop only with the Glider
    branchesNextOnly: true, // each branch shows only its next level
    titleButtons: [
      'throw',
      ...(workshop ? ['workshop'] : []),
      ...(atlas ? ['atlas'] : []),
      'settings',
    ],
  };
}

// Coin line of the result card (02-ux §4.2): how many branches have their next level affordable (at most one per branch),
// otherwise how many coins are missing to the cheapest next level; null when hidden or everything is bought.
// Workshop prices from gear.js (Power 3, Folds 3, Paper 12); a paper kind that is not open yet does not count.
// The chip only informs, it does not buy (decision 06, 15. 10.).
export function coinLine(p) {
  if (!reveal(p).coins) return null;
  const q = { ...p, coins: num(p.coins), best: num(p.best) },
    next = BRANCH_IDS.map(id => branchStatus(q, id).next).filter(n => n && n.reason !== 'later');
  if (!next.length) return null;
  const count = next.filter(n => n.ok).length;
  return count
    ? { kind: 'canBuy', count }
    : { kind: 'toNext', coins: Math.min(...next.map(n => n.missing)) };
}

// Hint below the prompt (02-ux §2.2). history: throws oldest first, each {power: 0..1} or {tap: true} for a tap too short to throw.
// -> {hint: null | 'first' | 'holdLonger' | 'complete', size: 'big' | 'small' | 'calm'}; the UI picks the device wording for 'first'.
export function promptHint(history = [], completed = false) {
  if (completed) return { hint: 'complete', size: 'calm' };
  const h = Array.isArray(history) ? history : [],
    throws = h.filter(e => !e?.tap),
    strong = throws.filter(e => num(e.power) >= WEAK_POWER).length,
    size = strong >= STRONG_FOR_CALM ? 'calm' : throws.length === 0 ? 'big' : 'small',
    weakRun = throws.length - 1 - throws.findLastIndex(e => num(e.power) >= WEAK_POWER);
  if (h.at(-1)?.tap || weakRun === WEAK_STREAK) return { hint: 'holdLonger', size };
  return strong >= STRONG_FOR_CALM ? { hint: null, size } : { hint: 'first', size };
}
