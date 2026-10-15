// Výbava hráče (M2, research/atlas/04-plan-zapojeni.md): Dílna Power 3 / Folds 3 / Paper 12 (08, 06 14. 10.) a kit letu pro src/flight.js.
// Čisté funkce bez DOM. Ceny, počty úrovní a otevírání papíru jen z progression-numbers.js (PROVISIONAL kopie params.mjs).
import { PROGRESSION as P } from './progression-numbers.js';
import { levelOf, opensPaper, isFound } from './atlas.js';
import { NEW_EVENTS } from './config.js';

// key = i18n klíč větve (branch.<key>): Folds má od verze 0.6 klíč branch.fold, v save i v kitu je `folds` jako v simulátoru.
export const BRANCHES = [
  { id: 'power', icon: '↗', key: 'power' },
  { id: 'paper', icon: '▱', key: 'paper' },
  { id: 'folds', icon: '⌁', key: 'fold' },
];
export const BRANCH_IDS = BRANCHES.map(b => b.id);
export const maxLevel = id => P.workshop[id]?.prices.length ?? 0;
export const priceOf = (id, level) => P.workshop[id]?.prices[level - 1] ?? null;
// Druhy papíru (copy, kraft, washi, neon) po perTier úrovních; druh k+1 se otevře doletem na místo, které ho otevírá (atlas.opensPaper).
const paperOpener = k => {
  for (let i = 0; i < P.route.places; i++) if (opensPaper(i) && --k === 0) return i;
  return -1;
};
export function paperOpen(best) {
  const W = P.workshop.paper,
    kinds = Math.ceil(W.prices.length / W.perTier);
  let open = 1;
  for (let k = 1; k < kinds; k++) if (isFound(best, paperOpener(k))) open = k + 1;
  return Math.min(W.prices.length, open * W.perTier);
}
// -> {id, level, max, next: null (maximum) | {level, price, ok, reason: null|'coins'|'later', missing, place (index místa, které ho otevře)}}
export function branchStatus(p, id) {
  const level = p.levels?.[id] ?? 0,
    max = maxLevel(id);
  if (level >= max) return { id, level, max, next: null };
  const price = priceOf(id, level + 1),
    missing = Math.max(0, price - (p.coins ?? 0)),
    later = id === 'paper' && level >= paperOpen(p.best ?? 0),
    reason = later ? 'later' : missing ? 'coins' : null;
  return {
    id,
    level,
    max,
    next: {
      level: level + 1,
      price,
      ok: !reason,
      reason,
      missing,
      place: later ? paperOpener(Math.floor(level / P.workshop.paper.perTier)) : null,
    },
  };
}
// Koupě další úrovně větve (level = kontrola, že kupuje právě další úroveň).
export function buy(p, id, level = (p.levels?.[id] ?? 0) + 1) {
  if (!BRANCH_IDS.includes(id)) return false;
  const s = branchStatus(p, id);
  if (!s.next?.ok || level !== s.next.level) return false;
  p.coins -= s.next.price;
  p.levels[id] = s.next.level;
  return true;
}
// Události, které hra zatím nezná (C2 je zapojí); bez příznaku se jejich bonusy do kitu nedostanou, takže nepřijdou.
export const NEW_EVENT_TYPES = ['steam', 'thermal', 'drone', 'star'];
// Kit letu z save: Dílna, model, úrovně Atlasu (objev z p.best, koupené úrovně z p.atlas) a speciály v kapsách.
export function kitOf(p, { newEvents = NEW_EVENTS } = {}) {
  const atlas = {};
  for (const id of P.atlas.bonuses) {
    const l = levelOf(p, id);
    if (l > 0 && (newEvents || !NEW_EVENT_TYPES.includes(id))) atlas[id] = l;
  }
  return {
    model: p.model === 'glider' && atlas.glider ? 'glider' : 'dart',
    power: p.levels?.power ?? 0,
    folds: p.levels?.folds ?? 0,
    paper: p.levels?.paper ?? 0,
    atlas,
    slots: (p.atlas?.pockets?.slots ?? []).filter(Boolean),
  };
}
