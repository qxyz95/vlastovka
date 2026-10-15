// Logika karty výsledku a rytmu „důvodu hodit znovu“ (T1, research/plan-hratelnost/05-karty-mechanik.md).
// Čisté funkce dat bez DOM, času a náhody; vstupy se nemění. Výstupy jsou data a i18n klíče s parametry, ne texty:
// UI klíč přeloží přes t(key, params). K4 (čip) nekupuje (06, 15. 10.): informaci dává coinLine z reveal.js.
import { SCREEN_METERS, SECTION_METERS, ROUTE } from './scenes.js';
import { coinLine } from './reveal.js';
import { LOCK_MS, HOLD_MIN_MS } from './screens.js';
import { eventStats } from './events.js';

// Zástupné, doladí balance-analyst (05 karty, čísla jsou zástupná do schválení obsahu).
export const DIFF_MIN_M = 5; // K2 pravidlo 4: Δ pod max(5 m, 4 % minulého doletu) se mlčí
export const DIFF_MIN_SHARE = 0.04; // K2 pravidlo 4
export const MAX_CAUSES = 2; // K2 pravidlo 2: nejvýš dvě změněné věci
export const WIND_STEP = 1; // K2 (d): vítr se uvádí od změny o 1 m/s
export const CHARGE_PEAK_S = 1.15; // vrchol nabíjení z throw.js (chargeAt); před ním „brzy“, za ním „pozdě“
export const POWER_ORDER = ['weak', 'good', 'strong', 'perfect']; // K2 (c): kategorie síly (throw.js grade)
export const PAN_MAX_M = 400; // K3: kamera se natočí k vlajce jen do 400 m od dopadu
export const CLOSE_GOAL_M = 120; // §5/§3: místo „na dohled“ pro důvod C (tabulka rytmu: 12 až 110 m)

const num = v => (Number.isFinite(v) ? v : 0);

// K1: co udělá stisk/puštění na kartě výsledku. Zámek a práh hodu jsou v screens.js (LOCK_MS, HOLD_MIN_MS);
// tady zbývá rozlišení ovládacích prvků. target: 'card' | 'control'; heldMs jen při puštění.
// -> 'ignore' (zámek, vstup se zahodí i na prvcích) | 'control' (prvek, držení nikdy nespustí) | 'charge' | 'throw' | 'tap'
export function resultInput(msSinceShown, target, heldMs = null) {
  if (num(msSinceShown) < LOCK_MS) return 'ignore';
  if (target === 'control') return 'control';
  if (heldMs === null || heldMs === undefined) return 'charge';
  return num(heldMs) >= HOLD_MIN_MS ? 'throw' : 'tap';
}

// Změna výbavy: prev/cur = {levels:{power,paper,folds}, model, atlas:{id:úroveň}} -> seznam odkazů 'level:power:2', 'level:paper:5', 'model:glider'.
function gearChanges(a = {}, b = {}) {
  const out = [];
  for (const id of Object.keys({ ...a.levels, ...b.levels }))
    if (num(a.levels?.[id]) !== num(b.levels?.[id])) out.push(`level:${id}:${num(b.levels?.[id])}`);
  if (a.model !== b.model) out.push(`model:${b.model}`);
  for (const id of Object.keys({ ...a.atlas, ...b.atlas }))
    if (num(a.atlas?.[id]) !== num(b.atlas?.[id])) out.push(`atlas:${id}:${num(b.atlas?.[id])}`);
  return out;
}

// K2 Rozdíl proti minule, jen ve výsledku (06, 15. 10., varianta a). prev/cur:
// {dist, gear, hits, perfects, grade ('weak'..'perfect'), hint ('angle.*' klíč), chargeT (s, nepovinné), wind (m/s, +do zad), record}.
// prev = poslední DOKONČENÝ hod (zrušený se nepočítá, to hlídá volající), u prvního hodu null.
// -> null (první hod, pod prahem, nebo rekord bez změny výbavy) | {kind:'diff'|'diff+cause', delta, key, params:{m}, causes[]}.
// Řádek jen staví vedle sebe rozdíl a to, co se změnilo; nic netvrdí o příčině.
export function throwDiff(prev, cur) {
  if (!prev || !cur) return null;
  const delta = num(cur.dist) - num(prev.dist);
  if (Math.abs(delta) < Math.max(DIFF_MIN_M, DIFF_MIN_SHARE * num(prev.dist))) return null;
  const causes = [];
  const gear = gearChanges(prev.gear, cur.gear);
  if (gear.length)
    causes.push({ type: 'gear', key: 'result.cause.gear', params: { item: gear[0] }, items: gear });
  if (cur.record && !gear.length) return null; // K2 pravidlo 5: rekord a stejná výbava, dva řádky by říkaly totéž
  const dh = num(cur.hits) - num(prev.hits),
    dp = num(cur.perfects) - num(prev.perfects);
  if (dh) causes.push({ type: 'hits', key: 'result.cause.hits', params: { count: num(cur.hits) } });
  if (dp)
    causes.push({
      type: 'perfects',
      key: 'result.cause.perfects',
      params: { count: num(cur.perfects) },
    });
  const gp = POWER_ORDER.indexOf(prev.grade),
    gc = POWER_ORDER.indexOf(cur.grade);
  if (gp >= 0 && gc >= 0 && gc < gp && Number.isFinite(cur.chargeT))
    causes.push({
      type: 'launch',
      key: cur.chargeT < CHARGE_PEAK_S ? 'result.cause.early' : 'result.cause.late',
      params: {},
    });
  if (prev.hint && cur.hint && prev.hint !== cur.hint)
    causes.push({ type: 'angle', key: cur.hint, params: {} });
  const dw = num(cur.wind) - num(prev.wind);
  if (Math.abs(dw) >= WIND_STEP)
    causes.push({
      type: 'wind',
      key: dw > 0 ? 'result.cause.tail' : 'result.cause.head',
      params: {},
    });
  const shown = causes.slice(0, MAX_CAUSES);
  return {
    kind: shown.length ? 'diff+cause' : 'diff',
    delta,
    key: delta > 0 ? 'result.diff.up' : 'result.diff.down',
    params: { m: Math.round(Math.abs(delta)) },
    causes: shown,
  };
}

// Fakta hodu pro throwDiff z letu hry (M2, src/flight.js): výbava z kitu letu (Paper = úroveň papíru 0–12, tedy tempo π, ne klouzavost),
// vítr v m/s ve výšce plného střihu (podíl f.w × cestovní rychlost modelu × π, kladný do zad). extra: {hint, chargeT, record}.
export function throwFacts(f, extra = {}) {
  const k = f.kit ?? {},
    m = f.d?.m ?? {},
    st = eventStats(f);
  return {
    dist: num(f.x) - num(f.startX),
    gear: {
      levels: { power: num(k.power), paper: num(k.paper), folds: num(k.folds) },
      model: k.model,
      atlas: { ...k.atlas },
    },
    hits: st.hits,
    perfects: st.perfect,
    grade: f.launch?.grade,
    wind: num(f.w) * (m.windK ?? 1) * num(m.cruise) * (f.d?.pi ?? 1),
    record: false,
    ...extra,
  };
}

// K3 Další cíl: nejbližší nedosažené místo trasy podle p.best (místo i začíná na i * SCREEN_METERS).
// -> {placeIndex, x, metersLeft, kind, nameKey:'place.<kind>'}; za posledním místem null.
export function nextGoal(p) {
  const best = Math.max(0, num(p?.best)),
    placeIndex = Math.floor(best / SCREEN_METERS) + 1;
  if (placeIndex >= ROUTE.length) return null;
  const x = placeIndex * SCREEN_METERS,
    kind = ROUTE[placeIndex].kind;
  return { placeIndex, x, metersLeft: x - best, kind, nameKey: 'place.' + kind };
}

// K3: natočit kameru k vlajce jen když je do PAN_MAX_M od dopadu (jinak bez pohybu). reduced = nikdy.
export const shouldPan = (landX, flagX, reduced = false) =>
  !reduced &&
  Number.isFinite(landX) &&
  Number.isFinite(flagX) &&
  Math.abs(flagX - landX) <= PAN_MAX_M;

// K9: první překročení hranice čtvrti (místa 5, 9, 13 = násobky SECTION_METERS). -> index nové čtvrti (1..3) nebo null.
// Přeletí-li hod dvě hranice, vrací se jen vyšší; hranice, která už byla překonána (prevBest ≥ hranice), se neopakuje.
// Karta říká „{předchozí čtvrť} stojí“, tedy district index − 1. Finále (místo 16) tu není, patří screens/ui.
export function chapterTrigger(prevBest, best) {
  const a = num(prevBest),
    b = num(best);
  for (let d = 3; d >= 1; d--) if (b >= d * SECTION_METERS && a < d * SECTION_METERS) return d;
  return null;
}

// §1 Pravidlo jedné výrazné věci. Priorita od nejvyšší; state = {id: true} pro věci, které právě běží.
export const FOCUS_ORDER = [
  'qte',
  'firstEvent',
  'newPlace',
  'ribbon',
  'dominant',
  'rising',
  'carpetEnd',
];
// -> {focus: id|null, muted: [id...] (běží potichu: bez zvukového akcentu, menší amplituda, bez kamery),
//     camera: smí vybraná věc hýbat kamerou (nikdy při reduced)}
export function airFocus(state = {}, reduced = false) {
  const active = FOCUS_ORDER.filter(id => state?.[id]),
    focus = active[0] ?? null;
  return { focus, muted: active.slice(1), camera: !!focus && !reduced };
}

// §5 Důvody hodit znovu: R rekord · M rozdíl proti minule · C blízký cíl · N novinka · P nové místo · K koupě.
// in: {dist, prevBest, p (save po hodu), diff (výstup throwDiff), novelties (počet čekajících novinek)}.
export const REASON_ORDER = ['R', 'M', 'C', 'N', 'P', 'K'];
export function throwReasons({ dist, prevBest, p, diff = null, novelties = 0 } = {}) {
  const best = num(p?.best),
    goal = nextGoal(p),
    has = {
      R: num(dist) > num(prevBest),
      M: !!diff,
      C: !!goal && goal.metersLeft <= CLOSE_GOAL_M,
      N: num(novelties) > 0,
      P: Math.floor(num(prevBest) / SCREEN_METERS) < Math.floor(best / SCREEN_METERS),
      K: coinLine(p)?.kind === 'canBuy',
    };
  return REASON_ORDER.filter(r => has[r]);
}

// §5 C1: nejdelší řada hodů, kde je jediným důvodem koupa nebo nic. list = pole výstupů throwReasons.
export function dryRun(list = []) {
  let run = 0,
    max = 0;
  for (const r of list) {
    run = r.every(x => x === 'K') ? run + 1 : 0;
    max = Math.max(max, run);
  }
  return max;
}
