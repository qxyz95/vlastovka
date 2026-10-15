// Náhled „≈ +X m“ v Dílně (C4): přehraje hod hráče s výbavou teď a s úrovní větve po koupi, rozdíl doletu je přínos.
// Čisté funkce bez DOM, deterministické (seed hodu, pevný krok jako ve hře).
// Zvolený režim: je-li k dispozici záznam posledního hodu (throwRecord), přehraje se stejný seed, úhel, síla, vítr a stejné výsledky
// QTE (ctx.grades, rozvrh událostí nezávisí na Dílně). Bez záznamu (po načtení hry) se ukáže klidný typický hod: síla 0,75,
// nejlepší úhel, bez větru a událostí. Hráč, který ještě neházel, náhled nemá.
import { GAME, GAME_KEY, step, bestAngle } from './core.js';
import { kitOf, maxLevel } from './gear.js';

export const CALM_CHARGE = 0.75;
// Záznam doletělého letu f (ui.js po settle): seed hodu, skutečný úhel a síla, vítr a výsledky událostí podle indexu.
export function throwRecord(f) {
  const grades = {};
  for (const e of f.events ?? []) if (e.result) grades[e.i] = e.result;
  return { n: f.seed, angle: f.angle, charge: f.charge, w: f.w, grades };
}
// Typický klidný hod pro save bez záznamu: seed posledního hodu (attempts), bez událostí.
export const calmThrow = p => ({
  n: Math.max(1, p.attempts),
  angle: bestAngle(kitOf(p), CALM_CHARGE),
  charge: CALM_CHARGE,
  w: 0,
  grades: null,
});
export function distanceOf(kit, last) {
  const f = GAME.createFlight(kit, {
    key: GAME_KEY,
    n: last.n,
    angle: last.angle,
    charge: last.charge,
    exact: true,
    w: last.w ?? null,
    ...(last.grades ? { grades: last.grades } : { events: false }),
  });
  while (!f.landed) step(f);
  return Number.isFinite(f.x) ? f.x : 0;
}
// -> null (hráč neházel, nebo úroveň není nad současnou) | {mode: 'replay' | 'calm', now, after, gain} v metrech.
export function previewGain(p, id, toLevel, last = null) {
  const level = p.levels?.[id] ?? 0;
  if (!(p.attempts > 0) || toLevel <= level || toLevel > maxLevel(id)) return null;
  const rec = last ?? calmThrow(p),
    kit = kitOf(p),
    now = distanceOf(kit, rec),
    after = distanceOf({ ...kit, [id]: toLevel }, rec);
  return { mode: rec.grades ? 'replay' : 'calm', now, after, gain: after - now };
}
