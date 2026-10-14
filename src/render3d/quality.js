// Kvalitativní úrovně Papírového města (čisté). Zdroj: bible research/design/05-styl-papir.md kap. 5.
// 0 nízká (slabý telefon), 1 střední (výchozí na telefonu: dotyk a šířka < 900 CSS px), 2 vysoká (výchozí na desktopu).
// Čitelnost (obrys vlaštovky, QTE, opar) je na všech úrovních stejná. maxDpr nikdy nad MAX_DPR v index.js.
// Stíny na zem (research/design/08-stiny.md S5): mask = podíl rozlišení masky stínů (0 = bez masky, jen ztmavení paty karet ao),
// blur = průchody rozmazání masky (1 = jeden 2D průchod, 2 = vodorovný + svislý) · fiber vlákna papíru · grain zrno postu · msaa vzorky
export const QUALITY = Object.freeze([
  Object.freeze({
    level: 0,
    maxDpr: 1,
    msaa: 0,
    mask: 0,
    blur: 0,
    ao: true,
    fiber: false,
    grain: false,
    haze: true,
  }),
  Object.freeze({
    level: 1,
    maxDpr: 1.5,
    msaa: 2,
    mask: 1 / 4,
    blur: 1,
    ao: true,
    fiber: true,
    grain: true,
    haze: true,
  }),
  Object.freeze({
    level: 2,
    maxDpr: 2,
    msaa: 4,
    mask: 1 / 3,
    blur: 2,
    ao: true,
    fiber: true,
    grain: true,
    haze: true,
  }),
]);
// Pokles: P95 snímku nad `p95` ms souvisle `hold` s (bible: 33 ms, 2 s). Jen dolů, nikdy nahoru, nikdy během letu.
export const DROP = Object.freeze({ p95: 33, hold: 2 }),
  PHONE_WIDTH = 900;
const clampLevel = v => Math.max(0, Math.min(2, Math.round(Number.isFinite(+v) ? +v : 2)));
export const qualityPreset = level => QUALITY[clampLevel(level)];
// Výchozí úroveň: dotyk a úzká scéna → 1, jinak 2. Úroveň 0 jen automatickým poklesem. dpr zatím nerozhoduje (bible neurčuje).
export function initialQuality({ touch = false, cssWidth = Infinity } = {}) {
  return touch && cssWidth < PHONE_WIDTH ? 1 : 2;
}
// Stav {level, over}: over = jak dlouho (s) je P95 souvisle nad mezí. prev smí být číslo (úroveň). Čisté, nemutuje.
// Za letu se čas nad mezí sčítá dál, pokles proběhne až mimo let (Dílna, výsledek).
export function nextQuality(prev, { p95 = 0, dt = 0, flying = false } = {}) {
  const s =
    typeof prev === 'object' && prev
      ? { level: clampLevel(prev.level), over: Math.max(0, prev.over || 0) }
      : { level: clampLevel(prev), over: 0 };
  const over = p95 > DROP.p95 ? s.over + Math.max(0, dt) : 0;
  if (over >= DROP.hold - 1e-6 && !flying && s.level > 0) return { level: s.level - 1, over: 0 };
  return { level: s.level, over };
}
