// Jazyk hry (čisté, bez DOM): slovníky src/locales/*.js, t(key,params), plurály přes Intl.PluralRules, čísla podle jazyka.
// Hodnota ve slovníku je text s {param}, nebo objekt plurálních tvarů {one,few,many,other} vybraný podle params.count.
// Chybějící klíč: fallback na EN, pak klíč samotný; setStrict(true) (testy) místo toho vyhodí chybu.
// Volba: ?lang= v URL, pak uložená hodnota (localStorage['just-throw-it-lang'], mimo save), jinak EN.
import en from './locales/en.js';
import cs from './locales/cs.js';
export const LOCALES = { en, cs },
  LANG_IDS = Object.keys(LOCALES),
  DEFAULT_LANG = 'en',
  LANG_KEY = 'just-throw-it-lang';
// Názvy jazyků se píšou vždy v daném jazyce, nepřekládají se.
export const LANG_NAMES = { en: 'English', cs: 'Čeština' };
const TAGS = { en: 'en-US', cs: 'cs-CZ' };
let lang = DEFAULT_LANG,
  strict = false;
const plurals = {},
  formats = {};
export const getLang = () => lang;
export const isLang = id => typeof id === 'string' && Object.hasOwn(LOCALES, id);
export function setLang(id) {
  lang = isLang(id) ? id : DEFAULT_LANG;
  return lang;
}
export function setStrict(on = true) {
  strict = !!on;
}
export function pickLang(query, stored) {
  for (const v of [query, stored]) {
    const id = typeof v === 'string' ? v.trim().toLowerCase() : null;
    if (isLang(id)) return id;
  }
  return DEFAULT_LANG;
}
export const has = (key, id = lang) => Object.hasOwn(LOCALES[id] ?? {}, key);
const rules = id => (plurals[id] ??= new Intl.PluralRules(TAGS[id]));
// Formát čísla: en 1,240.5 · cs 1 240,5 (mezera je nedělitelná). d = počet desetinných míst.
export function num(x, d = 0, id = lang) {
  const k = id + d;
  return (formats[k] ??= new Intl.NumberFormat(TAGS[id] ?? TAGS.en, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })).format(x);
}
// Jednotka za číslem nedělitelnou mezerou (1,240 m · 1 240 m); procenta podle jazyka (75% · 75 %), x je podíl 0–1.
export const unit = (x, u, d = 0, id = lang) => num(x, d, id) + ' ' + u;
export function pct(x, d = 0, id = lang) {
  const k = id + '%' + d;
  return (formats[k] ??= new Intl.NumberFormat(TAGS[id] ?? TAGS.en, {
    style: 'percent',
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })).format(x);
}
function pick(v, params, id) {
  if (typeof v === 'string') return v;
  const n = Number(params.count);
  return v[rules(id).select(Number.isFinite(n) ? n : 0)] ?? v.other;
}
export function t(key, params = {}, id = lang) {
  let from = id;
  if (!has(key, from)) {
    if (strict) throw Error(`i18n: missing key "${key}" (${id})`);
    from = DEFAULT_LANG;
    if (!has(key, from)) return key;
  }
  return pick(LOCALES[from][key], params, from).replace(/\{(\w+)\}/g, (m, name) => {
    const v = params[name];
    return v == null
      ? m
      : typeof v === 'number'
        ? num(v, Number.isInteger(v) ? 0 : 1, from)
        : String(v);
  });
}
// Hláška z modulu mimo i18n (storage.js vrací hotový text): najde klíč s prefixem, jehož text v kterémkoli jazyce se shoduje, a vrátí ho v aktuálním jazyce; neznámý text projde beze změny.
export function translateMessage(text, prefix = 'storage.', id = lang) {
  if (!text) return '';
  for (const dict of Object.values(LOCALES))
    for (const [k, v] of Object.entries(dict))
      if (k.startsWith(prefix) && v === text) return t(k, {}, id);
  return text;
}
// Parametry {name} v textu (u plurálu ze všech tvarů), pro test shody slovníků.
export function paramsOf(v) {
  const s = new Set();
  for (const text of typeof v === 'string' ? [v] : Object.values(v ?? {}))
    for (const [, n] of String(text).matchAll(/\{(\w+)\}/g)) s.add(n);
  return [...s].sort();
}
