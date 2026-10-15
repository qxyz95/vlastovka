// Hra na modelu letu src/flight.js (M2): stejná mechanika jako simulátor progrese. Tady je save, kit a tenký adaptér letu
// (createFlight/step/eventInput se stejnými jmény jako dřív, aby renderer a ladění __r3d zůstaly beze změny).
import { DT } from './config.js';
import { createFlightModel } from './flight.js';
import { PROGRESSION as P } from './progression-numbers.js';
import { AIM_MIN, AIM_MAX, throwSettings } from './throw.js';
import { kitOf, buy } from './gear.js';
import { activeEvent } from './events.js';
export { random } from './random.js';
export { activeEvent } from './events.js';
export { kitOf, buy } from './gear.js';

export const GAME = createFlightModel(P);
// Klíč letu hry: rozvrh událostí, vítr a hod jsou funkcí (GAME_KEY, n = attempts + 1), tutoriál (poryv, pak holub) jen pro n = 1.
export const GAME_KEY = 'game';
export const FINISH = P.route.finish;
export function fresh() {
  return {
    version: 5,
    coins: 0,
    levels: { power: 0, paper: 0, folds: 0 },
    model: 'dart',
    best: 0,
    completed: false,
    attempts: 0,
    atlas: {
      levels: {},
      seen: [],
      pending: [],
      lines: {},
      pockets: { owned: 0, slots: [null, null] },
      nodes: { nightRoute: false },
      finished: false,
      hintOpens: 0,
      undo: null,
    },
  };
}
// Let hry. kit = kitOf(p), n = číslo hodu (attempts + 1), angle ve stupních, charge 0..1 (throw.chargeAt).
// Pole navíc pro UI a renderer: model, launch (throwSettings), seed (= n), startX, settled.
// w = vítr (podíl cestovní rychlosti), bez něj se losuje ze seedu jako v simulátoru.
export function gameFlight(kit, n, angle, charge, w = null) {
  const f = GAME.createFlight(kit, { key: GAME_KEY, n, angle, charge, exact: true, w });
  return Object.assign(f, {
    model: kit.model,
    launch: throwSettings(angle, charge),
    seed: n,
    startX: 0,
    settled: false,
  });
}
export const flightFor = (p, angle, charge) => gameFlight(kitOf(p), p.attempts + 1, angle, charge);
// Vítr příštího hodu (podíl cestovní rychlosti, flight.js P.wind), známý před hodem: nezávisí na síle ani úhlu.
export const windFor = p => flightFor(p, 15, 0.5).w;
// Starší podpis (ladění __r3d, testy rendereru): model, úrovně Dílny, seed = číslo hodu, wind = {x: m/s} | podíl | null (ze seedu),
// launch = {angle (rad), power} | null (ideální úhel modelu, 75 % síly).
export function createFlight(
  model = 'dart',
  levels = fresh().levels,
  seed = 1,
  wind = null,
  launch = null,
) {
  const kit = { model, power: 0, folds: 0, paper: 0, ...levels, atlas: {}, slots: [] },
    angle = launch ? (launch.angle * 180) / Math.PI : P.models[model].ideal,
    w = typeof wind === 'number' ? wind : wind ? wind.x / P.models[model].cruise : null;
  return gameFlight(kit, seed, angle, launch?.power ?? 0.75, w);
}
// Jeden pevný krok DT jako jedna obrátka smyčky fly() simulátoru: fyzika, události, skutečný čas; po maxT konec letu.
export function step(f) {
  if (f.landed) return;
  if (f.t >= P.physics.maxT) {
    f.timeout = true;
    f.landed = true;
    GAME.updateEvents(f);
    return;
  }
  GAME.step(f);
  GAME.updateEvents(f);
  GAME.realTime(f);
}
// Smyčka snímku: akumulátor v čase letu; klidné klouzání běží f.warp× rychleji (1,4×). frozen = hitstop (stojí jen fyzika).
// -> {acc, steps}; onStep(f) po každém kroku (ozdoby, interpolace).
export function advance(f, acc, elapsed, frozen = false, onStep = null) {
  if (!frozen) acc += elapsed * (f.warp ?? 1);
  let steps = 0;
  while (acc >= DT && !f.landed) {
    onStep?.(f, 'before');
    step(f);
    acc -= DT;
    steps++;
    onStep?.(f, 'after');
  }
  return { acc, steps };
}
// Vstup hráče do události: 'down' (stisk), 'up' (puštění holuba), 'cancel' (ztracený ukazatel při držení = minutí).
// Stisk ve varování hra ignoruje (null), hráč zkusí znovu.
export function eventInput(f, kind) {
  if (!f || f.landed) return null;
  if (kind === 'down') return GAME.press(f);
  if (kind === 'up') return GAME.release(f);
  if (kind === 'cancel') {
    const e = activeEvent(f);
    return e?.type === 'bird' && e.heldAt !== null && !e.result ? GAME.resolve(f, e, 'miss') : null;
  }
  return null;
}
export const action = f => eventInput(f, 'down');
// Zpráva po vyhodnocení (i18n klíč), 1 s od zásahu.
export const feedbackOf = f =>
  f.lastEv && f.t < f.lastEv.resolvedAt + 1 && f.lastEv.result ? 'feedback.' + f.lastEv.result : '';
export function reward(f) {
  const E = P.economy.reward;
  return E.base + Math.floor(Math.max(0, f.x - (f.startX ?? 0)) / (1 / E.perMeter));
}
export function settle(p, f) {
  if (!f.landed || f.settled) return false;
  if (!Number.isFinite(f.x)) f.x = f.startX; // NaN would be saved as null and wipe the whole save
  f.settled = true;
  p.coins += reward(f);
  p.best = Math.max(p.best, f.x - f.startX);
  p.completed = p.completed || p.best >= FINISH - 1e-9;
  p.attempts++;
  return true;
}
// Úhel nejdelšího pasivního letu (bez událostí, bezvětří) pro kit a sílu, mřížka 1°. Nezávisí na papíru (π), 08 §2.1 závěr 3.
export const bestAngle = (kit, charge) => GAME.bestAngle(kit, charge);
// Short advice after a throw: within 3° counts as right, otherwise point steeper or flatter. Returns an i18n key (t() in ui.js).
export function angleHint(angle, best) {
  const d = Math.round(angle) - best;
  return (
    'angle.' +
    (Math.abs(d) <= 3
      ? 'ok'
      : d > 0
        ? d > 8
          ? 'muchFlatter'
          : 'flatter'
        : d < -8
          ? 'muchSteeper'
          : 'steeper')
  );
}
export { AIM_MIN, AIM_MAX };
