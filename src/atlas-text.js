// Atlas formatting and templates, pure (research/atlas/01-navrh-atlasu.md §3.8, §6.3). Numbers en-US, one currency ◈, units with a space.
import * as CONTENT from './atlas-content.js';
import { NUMBERS } from './atlas-numbers.js';
import { maxLevelOf, nextCost } from './atlas.js';
const INT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }),
  ONE = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const COMPACT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
// Phrases that pressure or threaten (02 N10, §4.3 points 4–8); atlas-text tests scan every Atlas and character text.
export const FORBIDDEN = [
  'last chance',
  'hurry',
  "don't lose",
  'streak',
  'daily',
  'limited',
  'only now',
  'miss out',
  'come back',
];

export const fmtNum = v => (Math.abs(v) >= 1e6 ? COMPACT.format(v) : INT.format(Math.round(v)));
export const fmtCoins = v => `${fmtNum(v)} ◈`;
export const fmtMeters = m => `${Math.abs(m) < 10 ? ONE.format(m) : INT.format(Math.round(m))} m`;
export function fmtPct(x, sign = false) {
  const v = Math.round(x * 1000) / 10;
  return `${sign && v > 0 ? '+' : ''}${ONE.format(v)} %`;
}
const plural = (k, w) => `${INT.format(k)} ${k === 1 ? w : w + 's'}`;
const FMT = {
  pct: v => fmtPct(v),
  '+pct': v => fmtPct(v, true),
  m: fmtMeters,
  '+m': v => `+${fmtMeters(v)}`,
  s: v => `${ONE.format(v)} s`,
  x: v => `×${ONE.format(v)}`,
  times: v => (v === 1 ? 'once' : v === 2 ? 'twice' : `${INT.format(v)} times`),
  coins: fmtCoins,
};
function format(v, f) {
  if (!f) return typeof v === 'number' ? ONE.format(v) : String(v);
  if (f.startsWith('count:')) return plural(v, f.slice(6));
  return FMT[f] ? FMT[f](v) : String(v);
}
// {key?text} only when values[key] is truthy (text may hold {placeholders}), then {key} / {key|fmt}. Missing values stay visible as {key}.
export function fill(t, vals = {}) {
  return t
    .replace(/\{(\w+)\?((?:[^{}]|\{[^{}]*\})*)\}/g, (_, k, txt) => (vals[k] ? txt : ''))
    .replace(/\{(\w+)(?:\|([\w+:]+))?\}/g, (m, k, f) => (vals[k] == null ? m : format(vals[k], f)));
}
const bonusOf = (b, c) => (typeof b === 'string' ? c.BONUSES[b] : b);
export function effectLine(bonus, values, level, c = CONTENT) {
  const b = bonusOf(bonus, c),
    v = values?.[level - 1];
  return b?.effect && v ? fill(b.effect, v) : null;
}
// Effect now → after the next level (null at max or without levels).
export function effectChange(id, level, c = CONTENT, n = NUMBERS) {
  const v = n.atlas.values[id];
  return {
    now: effectLine(id, v, level, c),
    next: level < maxLevelOf(id, n) ? effectLine(id, v, level + 1, c) : null,
  };
}
const meters = m => fmtMeters(Math.max(1, Math.ceil(m)));
export const teaserLine = (place, metersToGo) =>
  `${place.name} · ${meters(metersToGo)} past your best`;
export function goalLine(goal, c = CONTENT) {
  if (goal.delivered) return c.TEXT.delivered;
  const pl = c.PLACES.find(x => x.id === goal.placeId);
  return fill(c.TEXT.next, { place: pl.name, meters: meters(goal.metersToGo) });
}
// Teaser bonus: name and one sentence, no numbers (question 2 in §9).
export const teaserBonusLine = (id, c = CONTENT) => `${c.BONUSES[id].name} · ${c.BONUSES[id].line}`;
// Button for an upgradeStatus() result.
export function priceLine(s, c = CONTENT) {
  const T = c.TEXT;
  if (s.reason === 'max') return T.maxLevel;
  if (s.reason === 'soon') return T.comingSoon;
  if (s.reason === 'unlevelled' || s.reason === 'unknown') return null;
  return s.ok
    ? fill(T.levelUp, { price: fmtCoins(s.price) })
    : fill(T.toGo, { price: fmtCoins(s.missing) });
}
export const levelsLine = (id, n = NUMBERS) =>
  Array.from({ length: maxLevelOf(id, n) - 1 }, (_, i) => nextCost(id, i + 1, n));
export function pocketLine(s, c = CONTENT) {
  if (!s.next) return null;
  const T = c.TEXT,
    { n: k, price, reason, fromDistrict } = s.next;
  return reason === 'later'
    ? fill(T.pocketLater, { n: k, district: c.DISTRICTS[fromDistrict].name })
    : fill(T.pocketLocked, { n: k, price: fmtCoins(price) });
}
// r = canEquip() result for special id.
export function reasonLine(r, id, c = CONTENT) {
  if (!r || r.ok) return null;
  const R = c.TEXT.reasons;
  if (r.reason === 'exclusive')
    return fill(R.exclusive, { a: c.SPECIALS[r.other]?.name, b: c.SPECIALS[id]?.name });
  return R[r.reason] ?? null;
}
export function noveltyLine(x, c = CONTENT) {
  const T = c.TEXT;
  if (!x) return null;
  switch (x.type) {
    case 'finale':
      return T.finale;
    case 'past':
      return fill(T.past, { count: x.count });
    case 'district': {
      const d = c.DISTRICTS[x.district],
        s = x.specials.map(id => c.SPECIALS[id].name).join(', ');
      return [
        fill(T.district, { district: d.name }),
        s && fill(T.districtPockets, { specials: s }),
        x.pocket && fill(T.pocketOpen, { n: x.pocket }),
      ]
        .filter(Boolean)
        .join(' · ');
    }
    case 'bonus': {
      const pl = c.PLACES[x.index],
        line = fill(T.found, { place: pl.name, bonus: c.BONUSES[x.id].name });
      return x.paper ? `${line} · ${fill(T.foundPaper, { paper: c.PAPERS[x.paper] })}` : line;
    }
    case 'paper':
      return fill(T.paper, { paper: c.PAPERS[x.id] });
    case 'line': {
      const ch = c.DISTRICTS[x.district].character;
      return fill(T.line, { name: ch.name, line: ch.lines[x.n - 1] });
    }
  }
  return null;
}
export const levelToast = (id, level, c = CONTENT) =>
  fill(c.TEXT.levelToast, { bonus: c.BONUSES[id].name, level });
export const coinsLabel = v => `${INT.format(Math.round(v))} coins`;
