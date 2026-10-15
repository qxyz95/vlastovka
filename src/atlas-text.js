// Atlas texts and number formats, pure (research/atlas/01-navrh-atlasu.md §3.8, §6.3). Texts come from src/locales via t(),
// numbers via num/unit from i18n (en 1,240 ◈ · cs 1 240 ◈), one currency ◈, units with a space.
import * as CONTENT from './atlas-content.js';
import { NUMBERS } from './atlas-numbers.js';
import { maxLevelOf, nextCost } from './atlas.js';
import { t, num, unit, getLang } from './i18n.js';
// Phrases that pressure or threaten (02 N10, §4.3 points 4–8; CS list in 03-texty.md); atlas tests scan every Atlas and character text in both languages.
export const FORBIDDEN_BY_LANG = {
  en: [
    'last chance',
    'hurry',
    "don't lose",
    'streak',
    'daily',
    'limited',
    'only now',
    'miss out',
    'come back',
  ],
  cs: [
    'poslední šance',
    'pospěš',
    'pohni si',
    'nepřijď o',
    'neztrať',
    'série',
    'denní',
    'každý den',
    'omezen',
    'jen teď',
    'pouze teď',
    'jen dnes',
    'nenech si ujít',
    'vrať se',
    'přijď zpátky',
    'přijď znovu',
  ],
};
export const FORBIDDEN = Object.values(FORBIDDEN_BY_LANG).flat();

const r1 = v => Math.round(v * 10) / 10,
  dec = v => (Number.isInteger(v) ? 0 : 1);
const compacts = {};
export function fmtNum(v) {
  if (Math.abs(v) < 1e6) return num(Math.round(v));
  const l = getLang();
  return (compacts[l] ??= new Intl.NumberFormat(l, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })).format(v);
}
export const fmtCoins = v => `${fmtNum(v)} ◈`;
export function fmtMeters(m) {
  const v = Math.abs(m) < 10 ? r1(m) : Math.round(m);
  return unit(v, 'm', dec(v));
}
export function fmtPct(x, sign = false) {
  const v = r1(x * 100);
  return `${sign && v > 0 ? '+' : ''}${unit(v, '%', dec(v))}`;
}
const fmtSec = v => unit(r1(v), 's', dec(r1(v))),
  fmtTimes = v =>
    v === 1
      ? t('atlas.unit.once')
      : v === 2
        ? t('atlas.unit.twice')
        : t('atlas.unit.times', { count: v });
// Format of each effect-template token (names of values in atlas-numbers.js); tokens not listed are not shown.
const TOKEN_FMT = {
  step: v => fmtPct(v, true),
  cap: v => fmtPct(v, true),
  beta: v => fmtPct(v, true),
  burst: v => fmtPct(v, true),
  push: v => fmtPct(v),
  keep: v => fmtPct(v),
  wider: v => fmtPct(v),
  pair: v => fmtPct(v),
  carry: v => fmtPct(v),
  share: v => fmtPct(v),
  chance: v => fmtPct(v),
  second: v => fmtPct(v),
  max: v => `×${num(r1(v), dec(r1(v)))}`,
  combo: v => `×${num(r1(v), dec(r1(v)))}`,
  lift: fmtMeters,
  reach: fmtMeters,
  delay: fmtSec,
  dur: fmtSec,
  rerolls: fmtTimes,
  bounces: fmtTimes,
};
const tokens = values =>
  Object.fromEntries(
    Object.entries(values)
      .filter(([k, v]) => TOKEN_FMT[k] && typeof v === 'number')
      .map(([k, v]) => [k, TOKEN_FMT[k](v)]),
  );
const bonusOf = (b, c) => (typeof b === 'string' ? c.BONUSES[b] : b);
// Effect sentences of a level: a sentence with `if` shows only when that value is truthy at the level.
export function effectLine(bonus, values, level, c = CONTENT) {
  const b = bonusOf(bonus, c),
    v = values?.[level - 1];
  if (!b?.effect || !v) return null;
  const params = tokens(v);
  return b.effect
    .filter(e => !e.if || v[e.if])
    .map(e => t(e.key, params))
    .join(' ');
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
  `${place.name} · ${t('atlas.teaser.distance', { m: meters(metersToGo) })}`;
export function goalLine(goal, c = CONTENT) {
  if (goal.delivered) return t('atlas.goal.delivered');
  const pl = c.PLACES.find(x => x.id === goal.placeId),
    m = meters(goal.metersToGo);
  return `${t('atlas.goal.label')} ${pl ? t('atlas.goal.next', { place: pl.name, m }) : t('atlas.goal.finish', { m })}`;
}
// Teaser bonus: name and one sentence, no numbers (question 2 in §9).
export const teaserBonusLine = (id, c = CONTENT) =>
  t('atlas.teaser.bonus', { bonus: c.BONUSES[id].name, pitch: c.BONUSES[id].line });
// Button for an upgradeStatus() result.
export function priceLine(s) {
  if (s.reason === 'max') return t('atlas.button.max');
  if (s.reason === 'soon') return t('atlas.label.comingSoon');
  if (s.reason === 'unlevelled' || s.reason === 'unknown') return null;
  return s.ok
    ? t('atlas.button.levelUp', { price: fmtCoins(s.price) })
    : t('atlas.button.toGo', { price: fmtCoins(s.missing) });
}
export const levelsLine = (id, n = NUMBERS) =>
  Array.from({ length: maxLevelOf(id, n) - 1 }, (_, i) => nextCost(id, i + 1, n));
export function pocketLine(s, c = CONTENT) {
  if (!s.next) return null;
  const { n: k, price, reason, fromDistrict } = s.next;
  return reason === 'later'
    ? t('atlas.pocket.later', { n: k, district: c.DISTRICTS[fromDistrict].name })
    : t('atlas.pocket.locked', { n: k, price: fmtCoins(price) });
}
// r = canEquip() result for special id.
export function reasonLine(r, id, c = CONTENT) {
  if (!r || r.ok) return null;
  if (r.reason === 'exclusive')
    return t('atlas.pocket.passiveRule', { a: c.SPECIALS[r.other]?.name, b: c.SPECIALS[id]?.name });
  if (r.reason === 'active') return t('atlas.pocket.activeRule');
  return ['slot', 'unknown', 'later'].includes(r.reason) ? t('atlas.reason.' + r.reason) : null;
}
const list = items => new Intl.ListFormat(getLang(), { type: 'conjunction' }).format(items);
export function noveltyLine(x, c = CONTENT) {
  if (!x) return null;
  switch (x.type) {
    case 'finale':
      return t('atlas.delivered.title');
    case 'past':
      return t('atlas.result.migration', { count: x.count });
    case 'district': {
      const s = x.specials.map(id => c.SPECIALS[id].name);
      return [
        t('atlas.result.district', { district: c.DISTRICTS[x.district].name }),
        s.length && t('atlas.result.special', { list: list(s) }),
        x.pocket && t('atlas.toast.pocketOpen', { n: x.pocket }),
      ]
        .filter(Boolean)
        .join(' · ');
    }
    case 'bonus': {
      const pl = c.PLACES[x.index],
        p = { place: pl.name, bonus: c.BONUSES[x.id].name };
      return x.paper
        ? t('atlas.result.foundPaper', { ...p, paper: c.PAPERS[x.paper] })
        : t('atlas.result.found', p);
    }
    case 'paper':
      return t('atlas.result.paper', { paper: c.PAPERS[x.id] });
    case 'line': {
      const ch = c.DISTRICTS[x.district].character;
      return t('atlas.result.line', { name: ch.name, line: ch.lines[x.n - 1] });
    }
  }
  return null;
}
export const levelToast = (id, level, c = CONTENT) =>
  t('atlas.toast.levelUp', { bonus: c.BONUSES[id].name, n: level });
export const coinsLabel = v => t('atlas.wallet.aria', { count: Math.round(v) });
