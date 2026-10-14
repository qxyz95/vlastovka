// Úvodní záběr a jízda do míření (čisté, bez three.js a DOM; H1, research/plan-hratelnost/03-art.md kap. 2, bible 05 kap. 9.2 „Úvod“).
// Úvod stojí, dokud hráč poprvé nestiskne; stisk spustí jízdu INTRO.dur s do záběru míření a zároveň nabíjení (vstup se přijímá hned).
// Stav v ui.js: intro = {pressed: s | null} nebo null (bez úvodu). Kdy se úvod ukáže: introAfter(odkud).
import { INTRO_SHOT } from './models/launch-site.js';
import { REST } from './camera.js';

// dur = jízda (s), fade = zmizení nápisu po stisku (s), kid = přechod dítěte klid → míření kolem poloviny jízdy (s).
export const INTRO = Object.freeze({ dur: 0.6, fade: 0.2, kid: 0.2 });
const clamp01 = u => Math.max(0, Math.min(1, u)),
  ease = u => u * u * (3 - 2 * u),
  lerp = (a, b, u) => a + (b - a) * u;
// Úvod po načtení a po zavření Dílny, Atlasu nebo menu; „Hodit znovu“ jde rovnou do míření (rozhodnutí 06 bod 15, 03-art kap. 2.3).
export const INTRO_FROM = Object.freeze(['load', 'workshop', 'atlas', 'menu']);
export const introAfter = from => (INTRO_FROM.includes(from) ? { pressed: null } : null);
// První stisk spustí jízdu (další stisky ji neposouvají); bez úvodu nic.
export const introPress = (intro, now) =>
  intro && intro.pressed == null ? { ...intro, pressed: now } : intro;
// Průběh jízdy u 0–1 (čas od stisku since, s); calm = reduced motion nebo Calm camera → střih (u = 1 hned po stisku).
export const introProgress = (since, calm = false) =>
  since == null ? 0 : calm ? 1 : clamp01(since / INTRO.dur);
// Úvod skončil (jízda dojela) → ui.js ho zahodí a dál běží obyčejné míření.
export const introDone = (intro, now, calm = false) =>
  !intro || (intro.pressed != null && introProgress(now - intro.pressed, calm) >= 1);
// Varianta záběru podle poměru stran scény: na výšku (< 1), telefon na šířku (≥ 2), jinak desktop.
export function introVariant(aspect = 16 / 9) {
  const S = INTRO_SHOT;
  if (aspect < 1) return { width: S.portraitWidth, at: S.portraitAt, text: S.portraitText };
  if (aspect >= 2) return { width: S.landWidth, at: S.landAt, text: S.landText };
  return { width: S.width, at: S.at, text: S.text };
}
// Záběr v průběhu jízdy: ease in-out, šířka logaritmicky, kotva ruky (podíl obrazu) lineárně, sklon lineárně.
// aim = cílový záběr míření {width, pitch, at}; dnešní hra drží ruku v míření na camera.REST (148, 258) z 640×360.
export function introShot(u, { aspect = 16 / 9, aim = {} } = {}) {
  const v = introVariant(aspect),
    w1 = aim.width ?? 16,
    p1 = aim.pitch ?? -8,
    a1 = aim.at ?? [REST.px / 640, REST.py / 360],
    e = ease(clamp01(u));
  return {
    width: e <= 0 ? v.width : e >= 1 ? w1 : Math.exp(lerp(Math.log(v.width), Math.log(w1), e)),
    at: [lerp(v.at[0], a1[0], e), lerp(v.at[1], a1[1], e)],
    pitch: lerp(INTRO_SHOT.pitch, p1, e),
    text: v.text,
  };
}
// Nápis v nebi: plně vidět do stisku, pak zmizí za INTRO.fade s (calm hned).
export const introTitleAlpha = (since, calm = false) =>
  since == null ? 1 : calm ? 0 : clamp01(1 - since / INTRO.fade);
// Váha pózy klid (1) proti míření (0): přechod INTRO.kid s kolem poloviny jízdy.
export const introIdle = u => 1 - ease(clamp01((u - 0.5) / (INTRO.kid / INTRO.dur) + 0.5));
