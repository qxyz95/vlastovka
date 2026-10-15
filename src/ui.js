import { DT, VERSION } from './config.js';
import { t, num, unit, pct, setLang, pickLang, LANG_KEY, translateMessage } from './i18n.js';
import {
  fresh,
  flightFor,
  advance,
  activeEvent,
  eventInput,
  feedbackOf,
  settle,
  reward,
  bestAngle,
  angleHint,
  FINISH,
} from './core.js';
import { PROGRESSION } from './progression-numbers.js';
import { mountWorkshop } from './workshop-ui.js';
import { load, save } from './storage.js';
import { createFx, fxEvent, stepFx } from './juice.js';
import { lerp } from './motion.js';
import { districtAt } from './scenes.js';
import { chargeAt } from './throw.js';
import { eventProgress, eventStats, zones } from './events.js';
import { createDecorations, stepDecorations } from './decorations.js';
import { initialState, transition, loopRuns, PANELS } from './screens.js';
import { reveal, coinLine, GLIDER_METERS } from './reveal.js';
import { loadSettings, saveSettings, reducedMotion } from './settings.js';
import { devEnabled, addDevCoins } from './dev.js';
import { drawAim, aimAngleAt } from './render3d/ui-layer.js';
import { eventView } from './render3d/events-view.js';
import { introAfter, introPress, introDone } from './render3d/intro.js';
// Renderer: 3D výchozí (src/render3d/), ?render=2d nebo prohlížeč bez WebGL2 → 2D render.js (do smazání 2D, fáze f plánu 3D).
// Oba mají stejné rozhraní render(canvas,f,model,time,visual) a view(f); 3D kreslí mířidla v UI vrstvě, 2D je dostane přes drawAim.
const webgl2 = () => {
  try {
    const g = document.createElement('canvas').getContext('webgl2');
    g?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!g;
  } catch {
    return false;
  }
};
let mode = new URLSearchParams(location.search).get('render') !== '2d' && webgl2() ? '3d' : '2d';
let { render, view } = await (mode === '3d'
  ? import('./render3d/index.js').catch(e => {
      console.warn('3D renderer unavailable, falling back to 2D', e);
      mode = '2d';
      return import('./render.js');
    })
  : import('./render.js'));
// 3D selže až při vytvoření kontextu (první snímek) → přepnout na 2D za běhu.
function fallback2d(e) {
  console.warn('3D renderer failed, falling back to 2D', e);
  mode = '2d';
  document.body.dataset.render = mode;
  import('./render.js')
    .then(m => {
      ({ render, view } = m);
    })
    .catch(() => {});
  render = () => {};
}
const $ = id => document.getElementById(id),
  $$ = sel => document.querySelectorAll(sel),
  loaded = load();
let p = loaded.data,
  f = null,
  last = 0,
  acc = 0;
let fx = null,
  prev = null,
  landedAt = 0,
  decorations = null,
  inputOwner = null,
  bannerQueue = [],
  seenMilestones = new Set(),
  banner = null,
  lastDistrict = 0,
  bestAtStart = 0;
// Obrazovky a panely řídí čistý automat screens.js (U3, 02-ux §1.2): S = {screen, title, panels, charging, shownAt}.
// UI jen posílá události přes go() a podle změny stavu přepíná DOM (sync); vlastní příznaky obrazovek nemá.
let S = initialState();
const store = (() => {
  try {
    return localStorage;
  } catch {
    return null;
  }
})();
let settings = loadSettings(store);
const systemReduce = matchMedia('(prefers-reduced-motion: reduce)'),
  isReduced = () => reducedMotion(settings, systemReduce.matches);
// ?timer: ladicí smyčka ~60 Hz přes MessageChannel (skrytá záložka škrtí rAF i setTimeout) a skrytá záložka se nebere jako pauza
// (automatické ověření ve skrytém okně prohlížeče; točí jedno jádro CPU, jen pro ladění).
const TIMER = new URLSearchParams(location.search).has('timer'),
  hidden = () => document.hidden && !TIMER,
  mc = TIMER ? new MessageChannel() : null;
let tickAt = 0;
if (mc)
  mc.port1.onmessage = () => {
    const n = performance.now();
    if (n - tickAt >= 16) {
      tickAt = n;
      frame(n);
    } else mc.port2.postMessage(0);
  };
const tick = () => (mc ? mc.port2.postMessage(0) : requestAnimationFrame(frame));
// Vrácené mince za starou Dílnu (migrace save v5) se oznámí jednou po načtení, v aktuálním jazyce.
let warning = loaded.warning,
  refund = loaded.refund ?? 0,
  warningClosed = false;
const showWarning = () => {
  const text = [translateMessage(warning), refund ? t('save.refund', { coins: num(refund) }) : '']
    .filter(Boolean)
    .join(' ');
  $('warning-text').textContent = text;
  $('warning').hidden = !text || warningClosed;
};
$('warning-close').onclick = () => {
  warningClosed = true;
  showWarning();
};
// Jediný styl je Papírové město (06, 15. 10.): CSS ho má na :root, renderer dostane visual.style jako konstantu, dokud R0 nesmaže cyber větve.
// Bývalý klíč 2D přepínače motivů se jednou uklidí; save hry se nemění.
const STYLE = 'papir',
  coarse = matchMedia('(pointer: coarse)');
document.body.dataset.render = mode;
try {
  localStorage.removeItem('just-throw-it-theme');
} catch {}
function persist() {
  const w = save(p);
  if (w) {
    warning = w;
    warningClosed = false;
    showWarning();
  }
}
const m = (x, d = 0) => unit(x, 'm', d);
// Velikost plátna v CSS px (celé okno, 02-ux §1.5): poměr stran jde rendereru, čte se jen při resize, ne každým snímkem.
const gameSize = { width: 640, height: 360 };
{
  const r = $('game').getBoundingClientRect();
  if (r.width && r.height) Object.assign(gameSize, { width: r.width, height: r.height });
  new ResizeObserver(([e]) => {
    const r = e.contentRect;
    if (r.width && r.height) Object.assign(gameSize, { width: r.width, height: r.height });
  }).observe($('game'));
}
// Language: ?lang= in the URL wins, then the last choice, otherwise English. Stored outside the save.
// Switching redraws every text without a reload: static HTML via data-i18n / data-i18n-aria, the rest through refresh() and the frame loop.
function applyLang(id) {
  const lang = setLang(id);
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
  for (const el of $$('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of $$('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const b of $$('[data-lang]')) b.setAttribute('aria-pressed', b.dataset.lang === lang);
  $('version').textContent = t('footer.version', { version: VERSION });
  showWarning();
  refresh();
  layout();
  if (S.screen === 'home') updateAim();
  if (S.screen === 'result' && f && outcome) fillResult();
}
for (const b of $$('[data-lang]')) b.onclick = () => applyLang(b.dataset.lang);
// Pohyb: volba v Nastavení přebíjí systém (settings.js); CSS čte data-reduced, renderer visual.reduced.
function applyMotion() {
  document.documentElement.dataset.reduced = isReduced();
  for (const r of $$('input[name="motion"]')) r.checked = r.value === settings.motion;
}
for (const r of $$('input[name="motion"]'))
  r.onchange = () => {
    settings = { ...settings, motion: r.value };
    saveSettings(settings, store);
    applyMotion();
  };
systemReduce.addEventListener?.('change', applyMotion);
// Postupné odkrývání (U4, reveal.js): tlačítka titulu, Menu, výsledku a Dílny, čip mincí, řada modelů.
function applyReveal() {
  const R = reveal(p);
  for (const b of $$('[data-open="workshop"], [data-open="atlas"]')) b.hidden = !R[b.dataset.open];
  $('models').hidden = !R.models;
  $('title-status').textContent = p.completed ? t('menu.delivered') : '';
  return R;
}
const workshop = mountWorkshop($('workshop'), {
  getSave: () => p,
  onChange: () => {
    persist();
    refresh();
  },
});
function refresh() {
  applyReveal();
  $('coins').textContent = num(p.coins);
  $('hud-coins').setAttribute('aria-label', t('menu.coins', { count: p.coins }));
  workshop.refresh();
}
// Úvod (H1): {pressed: s | null} nebo null. Ukáže se po načtení ('loaded') a po zavření Dílny, Atlasu nebo Menu zpět na Domov
// (introAfter podle zavřeného panelu), ne po „Hodit znovu“ ('throwAgain', stisk na kartě výsledku) ani po zrušení hodu.
// Stisk na Domově = událost 'press' (screens.js) a zároveň introPress: jízda do míření a nabíjení.
let intro = null;
let angle = 15,
  held = false,
  heldTime = 0,
  owner = null,
  pending = null;
const isCard = () => S.screen === 'result' || S.screen === 'chapter';
// Jediný vstup do automatu: vrací true, když se stav změnil.
function go(e) {
  const was = S;
  S = transition(S, e);
  if (S === was) return false;
  sync(was, e);
  return true;
}
function sync(was, e) {
  const screen = S.screen !== was.screen || e.type === 'resetProgress',
    panels = S.panels.join() !== was.panels.join();
  if (!S.charging && held) {
    held = false;
    owner = null;
    heldTime = 0;
  }
  if (panels && S.panels.length) flightCancel();
  layout();
  if (screen) enter(e);
  if (panels) {
    if (!S.panels.length && S.screen === 'home' && was.panels.length)
      intro = introAfter(was.panels.at(-1)) ?? intro;
    if (S.panels.at(-1) === 'pause') $('pause-note').hidden = e.type !== 'hidden';
    showPanels();
    syncHistory();
  }
  if (screen || panels) focusDefault();
}
function enter(e) {
  if (S.screen === 'home')
    prepare(e.type === 'loaded' || e.type === 'resetProgress' ? 'load' : 'throwAgain');
  else if (S.screen === 'flight') startFlight(pending);
  else if (isCard()) finish();
}
// DOM podle stavu: obrazovka a titul jako data-* na <body> (CSS), rohové ovládání, karta výsledku, ☰ / ❚❚.
function layout() {
  const b = document.body.dataset,
    flight = S.screen === 'flight',
    title = S.screen === 'home' && S.title ? 'on' : '';
  if (b.screen !== S.screen) b.screen = S.screen;
  if (b.title !== title) b.title = title;
  $('aim').hidden = S.screen !== 'home';
  $('flight').hidden = !flight;
  $('result').hidden = !isCard();
  $('game').classList.toggle('aiming', S.screen === 'home');
  $('menu-btn').textContent = flight ? '❚❚' : '☰';
  $('menu-btn').setAttribute('aria-label', t(flight ? 'hud.pause' : 'menu.open'));
  if (!flight) $('banner').hidden = true;
}
function showPanels() {
  for (const id of PANELS) if ($(id).open && !S.panels.includes(id)) $(id).close();
  for (const id of S.panels) if (!$(id).open) $(id).showModal();
}
function focusDefault() {
  if (S.panels.length) return;
  (S.screen === 'home' ? $('hold') : isCard() ? $('retry') : null)?.focus({ preventScroll: true });
}
// Systémové zpět (Android, gesto, Alt+←) zavírá panely: každý otevřený panel má záznam v historii (02-ux §1.2 back()).
let depth = 0,
  skipPop = 0;
function syncHistory() {
  const want = S.panels.length;
  if (want > depth) for (; depth < want; depth++) history.pushState({ jti: depth + 1 }, '');
  else if (want < depth) {
    skipPop++;
    history.go(want - depth);
    depth = want;
  }
}
addEventListener('popstate', () => {
  if (skipPop) {
    skipPop--;
    return;
  }
  const d = history.state?.jti ?? 0;
  if (d >= depth) {
    depth = d;
    return;
  }
  depth = d;
  while (S.panels.length > d && go({ type: 'close' }));
});
for (const id of PANELS) {
  // Esc v panelu: zpět o jeden krok přes automat (cancel); zavření prohlížečem mimo automat srovná stav.
  $(id).addEventListener('cancel', e => {
    e.preventDefault();
    go({ type: 'back' });
  });
  $(id).addEventListener('close', () => {
    if (S.panels.includes(id)) go({ type: 'back' });
  });
}
for (const b of $$('[data-open]')) b.onclick = () => go({ type: 'open', panel: b.dataset.open });
for (const b of $$('[data-close]')) b.onclick = () => go({ type: 'close' });
$('menu-btn').onclick = () => go({ type: 'open', panel: S.screen === 'flight' ? 'pause' : 'menu' });
$('cancel-throw').onclick = () => go({ type: 'cancelThrow' });
$('retry').onclick = () => go({ type: 'throwAgain' });
$('confirm-delete').onclick = () => {
  p = fresh();
  refund = 0;
  persist();
  refresh();
  go({ type: 'resetProgress' });
};
// ?dev=1: „+1000 mincí“ v Nastavení, aby šlo odemknout vše bez grindu (jen mince, rekord ne; rozhodnutí 06).
if (devEnabled(location.search)) {
  $('dev-coins').hidden = false;
  $('dev-coins').onclick = () => {
    addDevCoins(p);
    persist();
    refresh();
  };
}
function prepare(from = 'throwAgain') {
  intro = introAfter(from);
  f = null;
  fx = null;
  decorations = null;
  held = false;
  owner = null;
  heldTime = 0;
  acc = 0;
  updateAim();
}
function updateAim() {
  $('angle').value = angle;
  $('angle-value').textContent = Math.round(angle) + '°';
}
function begin(source) {
  if (held || hidden() || S.panels.length) return;
  go({ type: 'press', t: performance.now() });
  if (S.screen !== 'home' || !S.charging) return;
  held = true;
  owner = source;
  heldTime = 0;
  intro = introPress(intro, performance.now() / 1000);
}
// Puštění: automat rozhodne, jestli to byl hod (≥ HOLD_MIN_MS), nebo jen ťuknutí (Domov zůstane).
function release(source) {
  if (!held || owner !== source || S.screen !== 'home') return;
  pending = { angle, charge: chargeAt(heldTime) };
  const heldMs = heldTime * 1000;
  held = false;
  owner = null;
  go({ type: 'release', heldMs });
  heldTime = 0;
}
function startFlight({ angle, charge }) {
  intro = null;
  f = flightFor(p, angle, charge);
  const launch = f.launch;
  acc = 0;
  prev = null;
  landedAt = 0;
  fx = createFx();
  fxEvent(fx, 'throw', { power: launch.power });
  decorations = createDecorations(f.seed);
  zoneEvent = null;
  inputOwner = null;
  bannerQueue = [];
  seenMilestones = new Set();
  banner = null;
  lastDistrict = 0;
  bestAtStart = p.best;
  $('event-help').textContent = t('throw.' + launch.grade);
  $('action').disabled = true;
  $('hud-best').hidden = true;
}
function cancelHold() {
  if (held) {
    held = false;
    owner = null;
    heldTime = 0;
  }
  go({ type: 'holdCancel' });
  updateAim();
}
// Míření ukazatelem: úhel ve skutečných CSS px plátna (02-ux §1.5, ui-layer.aimAngleAt), ne v natažených 640 × 360.
function aimPointer(e) {
  const r = $('game').getBoundingClientRect();
  angle = aimAngleAt({ x: e.clientX - r.left, y: e.clientY - r.top }, view(null), r);
  updateAim();
}
// Podržet kdekoli ve scéně: na Domově nabíjení, na kartě výsledku (po zámku) rovnou nový hod; za letu vstup události.
$('game').addEventListener('pointerdown', e => {
  if (e.button !== 0 || S.panels.length) return;
  if (S.screen === 'flight') {
    if (inputOwner !== null) return;
    e.preventDefault();
    try {
      $('game').setPointerCapture(e.pointerId);
    } catch {}
    flightDown(e.pointerId);
    return;
  }
  if (S.screen !== 'home' && !isCard()) return;
  e.preventDefault();
  begin(e.pointerId);
  if (!held) return;
  aimPointer(e);
  try {
    $('game').setPointerCapture(e.pointerId);
  } catch {}
});
$('game').addEventListener('pointermove', e => {
  if (S.screen === 'home' && !S.panels.length && (!held || owner === e.pointerId)) aimPointer(e);
});
$('game').addEventListener('pointerup', e => {
  if (S.screen === 'flight') flightUp(e.pointerId);
  else release(e.pointerId);
});
$('game').addEventListener('pointercancel', e => {
  if (S.screen === 'flight') {
    if (inputOwner === e.pointerId) flightCancel();
  } else if (held && owner === e.pointerId) cancelHold();
});
$('game').addEventListener('lostpointercapture', e => {
  if (held && owner === e.pointerId) cancelHold();
});
// Dočasné tlačítko Hold v rohu (do U6): stejné nabíjení jako držení ve scéně.
$('hold').addEventListener('pointerdown', e => {
  if (S.screen !== 'home' || e.button !== 0 || held) return;
  e.preventDefault();
  try {
    $('hold').setPointerCapture(e.pointerId);
  } catch {}
  begin(e.pointerId);
});
$('hold').addEventListener('pointerup', e => release(e.pointerId));
$('hold').addEventListener('pointercancel', cancelHold);
$('hold').addEventListener('lostpointercapture', () => {
  if (held) cancelHold();
});
$('angle').oninput = () => {
  angle = Number($('angle').value);
  updateAim();
};
function flightDown(source) {
  if (S.screen !== 'flight' || !loopRuns(S) || hidden() || inputOwner !== null) return;
  const e = activeEvent(f);
  if (!e || e.result) return;
  inputOwner = source;
  eventInput(f, 'down');
}
function flightUp(source) {
  if (inputOwner !== source) return;
  eventInput(f, 'up');
  inputOwner = null;
}
function flightCancel() {
  if (inputOwner !== null && f) eventInput(f, 'cancel');
  inputOwner = null;
}
$('action').addEventListener('pointerdown', e => {
  if (e.button !== 0 || inputOwner !== null) return;
  e.preventDefault();
  try {
    $('action').setPointerCapture(e.pointerId);
  } catch {}
  flightDown(e.pointerId);
});
$('action').addEventListener('pointerup', e => flightUp(e.pointerId));
$('action').addEventListener('pointercancel', e => {
  if (inputOwner === e.pointerId) flightCancel();
});
$('action').addEventListener('lostpointercapture', e => {
  if (inputOwner === e.pointerId) flightCancel();
});
// Space on another focused button (e.g. a title button) must activate that button, not throw.
const otherButton = e =>
  e.target instanceof HTMLButtonElement && e.target !== $('hold') && e.target !== $('action');
window.addEventListener('keydown', e => {
  // Esc bez panelu: Domov a výsledek → Menu, let → Pauza (v panelu ho řeší jeho událost cancel).
  if (e.key === 'Escape') {
    if (!S.panels.length && S.screen !== 'loading') {
      e.preventDefault();
      go({ type: 'back' });
    }
    return;
  }
  if (S.panels.length) return;
  const home = S.screen === 'home';
  if (
    home &&
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) &&
    e.target !== $('angle')
  ) {
    e.preventDefault();
    angle = Math.max(
      5,
      Math.min(40, angle + (['ArrowUp', 'ArrowRight'].includes(e.code) ? 1 : -1)),
    );
    updateAim();
  }
  if (
    (e.code === 'Space' || (e.code === 'Enter' && (e.target === $('action') || home))) &&
    (S.screen === 'flight' || home || isCard()) &&
    !otherButton(e)
  ) {
    e.preventDefault();
    if (!e.repeat) {
      if (S.screen === 'flight') flightDown('key');
      else begin('key');
    }
  }
});
window.addEventListener('keyup', e => {
  if (otherButton(e)) return;
  if (e.code === 'Space' || e.code === 'Enter') {
    if (S.screen === 'home') {
      e.preventDefault();
      release('key');
    } else if (S.screen === 'flight') {
      e.preventDefault();
      flightUp('key');
    }
  }
});
window.addEventListener('blur', () => {
  if (held) cancelHold();
  flightCancel();
});
// Skrytí karty: konec držení, za letu automatická pauza (screens.js 'hidden').
document.addEventListener('visibilitychange', () => {
  last = 0;
  acc = 0;
  if (hidden()) {
    if (held) cancelHold();
    flightCancel();
    go({ type: 'hidden' });
  }
});
// Result facts are kept as data (outcome), so a language switch can redraw the card.
let outcome = null;
function finish() {
  const previous = p.best;
  settle(p, f);
  persist();
  refresh();
  outcome = {
    record: f.x > previous,
    glider: previous < GLIDER_METERS && p.best >= GLIDER_METERS,
    hint: angleHint(f.angle, bestAngle(f.kit, f.charge)),
  };
  fillResult();
}
function fillResult() {
  $('result-title').textContent = t(f.x >= FINISH - 1e-9 ? 'result.goal' : 'result.title');
  $('stat-distance').textContent = m(f.x, 1);
  $('stat-time').textContent = unit(f.t, 's', 1);
  $('stat-power').textContent = pct(Math.round(f.launch.power * 100) / 100);
  $('stat-angle').textContent = Math.round((f.launch.angle * 180) / Math.PI) + '°';
  const stats = eventStats(f);
  $('stat-events').textContent = stats.hits + ' / ' + stats.completed + ' · ★ ' + stats.perfect;
  $('stat-best').textContent = m(p.best, 1);
  const base = PROGRESSION.economy.reward.base;
  $('reward-breakdown').textContent = t('result.breakdown', { base, distance: reward(f) - base });
  $('stat-reward').textContent = num(reward(f));
  // Cíl = konec trasy (4 876 m, p.completed), ne dřívějších 500 m.
  $('result-progress').max = FINISH;
  $('result-progress').value = Math.min(FINISH, p.best);
  $('result-progress-label').textContent = p.completed
    ? t('result.goalDone', { distance: m(p.best) })
    : t('result.progress', { best: num(Math.floor(p.best)), goal: m(FINISH) });
  // Řádek mincí (reveal.coinLine): jen informuje, kupuje se v Dílně (06, 15. 10.). Pořadí řádků karty je U7.
  const coins = coinLine(p);
  $('result-coins').hidden = !coins;
  if (coins)
    $('result-coins').textContent =
      coins.kind === 'canBuy'
        ? t('result.canBuy', { count: coins.count })
        : t('result.toNextBuy', { coins: num(coins.coins) + ' ◈' });
  $('result-text').textContent = [
    t('throw.' + f.launch.grade),
    t(outcome.hint),
    outcome.record ? t('result.record') : '',
    outcome.glider ? t('result.gliderUnlocked') : '',
  ]
    .filter(Boolean)
    .join(' · ');
}
// HUD jen dolet a mince (02-ux §1.4, 06 B3): dolet za letu a na kartě (na Domově jen před prvním hodem), mince od prvního výsledku.
const setText = (el, s) => {
  if (el.textContent !== s) el.textContent = s;
};
const setHidden = (el, h) => {
  if (el.hidden !== h) el.hidden = h;
};
function updateHud() {
  const flight = S.screen === 'flight';
  setHidden(
    $('hud-distance'),
    !(flight || isCard() || (S.screen === 'home' && p.attempts === 0 && !S.title)),
  );
  setText($('distance'), m(Math.floor(f?.x ?? 0)));
  setHidden($('hud-coins'), !reveal(p).coins);
  setText($('coins'), flight && f ? '+' + num(reward(f)) : num(p.coins));
}
function frame(now) {
  const elapsed = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  if (!hidden()) {
    const runs = loopRuns(S),
      reduced = isReduced();
    if (S.screen === 'home') {
      if (held && runs) heldTime += elapsed;
      if (intro && introDone(intro, now / 1000, reduced)) intro = null;
    }
    if (S.screen === 'flight' && f && runs) {
      // Hitstop freezes physics for a few frames; QTE timing runs on flight time, so it is unaffected.
      // Klidné klouzání běží f.warp× rychleji (1,4×, flight.realTime), jako skutečný čas simulátoru.
      const frozen = fx.hitstop > 0;
      if (frozen) fx.hitstop = Math.max(0, fx.hitstop - elapsed);
      ({ acc } = advance(f, acc, elapsed, frozen, onStep));
      juiceEvents();
      // Let the landing dust and shake play before the result card covers the scene.
      if (f.landed) {
        if (!landedAt) landedAt = now;
        if (now - landedAt > (reduced ? 300 : 850)) go({ type: 'landed', t: now, chapter: false });
      }
      if (S.screen === 'flight') updateFlightUI();
    }
    updateHud();
    // Draw between the last two physics steps so motion is smooth on 120 Hz screens too.
    const a = Math.min(1, acc / DT),
      shown =
        f && prev && !f.landed
          ? {
              ...f,
              x: lerp(prev.x, f.x, a),
              y: lerp(prev.y, f.y, a),
              vx: lerp(prev.vx, f.vx, a),
              vy: lerp(prev.vy, f.vy, a),
              t: lerp(prev.t, f.t, a),
            }
          : f;
    if (fx && runs) stepFx(fx, elapsed, shown, view(shown));
    const home = S.screen === 'home',
      state = home ? 'aim' : S.screen === 'flight' ? 'flight' : 'result',
      charge = home && held ? chargeAt(heldTime) : 0,
      aim = home ? { angle, held, charge } : null;
    try {
      render(
        $('game'),
        shown,
        p.model,
        f ? f.t + (f.landed && landedAt ? (now - landedAt) / 1000 : 0) : now / 1000,
        {
          decorations,
          reduced,
          qte: qteVisual(),
          fx,
          charge,
          clock: now / 1000,
          state,
          aim,
          intro: home &&
            intro && { since: intro.pressed == null ? null : now / 1000 - intro.pressed },
          best: p.best,
          style: STYLE,
          touch: coarse.matches,
          aspect: gameSize.width / gameSize.height,
        },
      );
    } catch (e) {
      if (mode !== '3d') throw e;
      fallback2d(e);
    }
    // 2D renderer mířidla nekreslí: stejná kresba jako UI vrstva 3D, z promítnuté vlaštovky view(null).
    if (aim && mode === '2d') {
      const c = $('game').getContext('2d'),
        k = c.canvas.width / 640;
      c.setTransform(k, 0, 0, k, 0, 0);
      drawAim(c, aim, view(null));
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  tick();
}
// Před každým krokem fyziky snímek pro interpolaci, po něm ozdoby scény.
const onStep = (g, when) => {
  if (when === 'before') prev = { x: g.x, y: g.y, vx: g.vx, vy: g.vy, t: g.t };
  else stepDecorations(decorations, g);
};
let zoneEvent = null;
// Turn resolved events and the landing into feedback (each only once).
function juiceEvents() {
  for (const e of f.events)
    if (['success', 'perfect', 'miss'].includes(e.result) && !fx.seen.has(e)) {
      fx.seen.add(e);
      fxEvent(fx, e.result);
      if (e.type === 'gust' && e.result !== 'miss') fxEvent(fx, 'boost');
    }
  if (f.landed && !fx.landed)
    fxEvent(fx, 'land', { speed: prev ? Math.hypot(prev.vx, prev.vy) : 0, text: m(f.x, 1) });
}
// What the canvas needs to draw the in-scene timing ring.
function qteVisual() {
  if (S.screen !== 'flight' || !f) return null;
  const e = activeEvent(f);
  if (!e) return null;
  return {
    type: e.type,
    phase: e.phase,
    result: e.result,
    held: e.heldAt !== null,
    progress: eventProgress(f, e),
    zones: zones(e),
  };
}
function updateFlightUI() {
  const e = activeEvent(f),
    interactive = e && !e.result;
  // Časovací pruh pod scénou je volba Nastavení (settings.timingBar, přepínač přijde v U9); jinak jen kruh ve scéně.
  setHidden($('timing'), !settings.timingBar);
  // Okna se liší událost od události (plující střed, Folds), proto se pruh přepočítá pro každou novou událost.
  if (e && e !== zoneEvent && e.w) {
    zoneEvent = e;
    const z = zones(e);
    for (const [cls, [a, b]] of [
      ['success-zone', z.success],
      ['perfect-zone', z.perfect],
    ]) {
      const el = document.querySelector('.' + cls);
      el.style.left = a * 100 + '%';
      el.style.width = (b - a) * 100 + '%';
    }
  }
  const act = t(
    e?.type === 'bird' ? (e.heldAt !== null ? 'flight.release' : 'flight.hold') : 'flight.tap',
  );
  $('action').disabled = !interactive;
  setText($('action'), act);
  $('flight').dataset.kind = e?.type ?? 'none';
  $('flight').dataset.phase = e?.phase ?? 'idle';
  if (settings.timingBar) $('needle').style.left = (e ? eventProgress(f, e) * 100 : 0) + '%';
  const help =
    e?.phase === 'warning'
      ? t('help.ready')
      : interactive
        ? t(e.type === 'gust' ? 'help.gust' : e.heldAt !== null ? 'help.holding' : 'help.bird')
        : feedbackOf(f)
          ? t(feedbackOf(f))
          : t('help.idle');
  setText($('event-help'), help);
  if (bestAtStart > 0 && f.x > bestAtStart) setHidden($('hud-best'), false);
  // Banner (02-ux §1.1, §1.4): nejvýš jeden, mimo událost; nová čtvrť má přednost před milníkem.
  for (const v of [100, 250, 500, FINISH])
    if (f.x >= v && !seenMilestones.has(v)) {
      seenMilestones.add(v);
      bannerQueue.push({ kind: 'milestone', value: v });
      fxEvent(fx, 'milestone');
    }
  const district = districtAt(f.x).index;
  if (district !== lastDistrict) {
    lastDistrict = district;
    bannerQueue.unshift({ kind: 'district', x: f.x });
  }
  if (banner && f.t >= banner.until) banner = null;
  if (!e && !banner && bannerQueue.length) banner = { ...bannerQueue.shift(), until: f.t + 1.5 };
  setHidden($('banner'), !!e || !banner || f.landed);
  if (banner)
    setText(
      $('banner'),
      banner.kind === 'district'
        ? districtAt(banner.x).name
        : t(banner.value === FINISH ? 'banner.goal' : 'banner.milestone', {
            distance: m(banner.value),
          }),
    );
}
{
  let stored = null;
  try {
    stored = localStorage.getItem(LANG_KEY);
  } catch {}
  applyLang(pickLang(new URLSearchParams(location.search).get('lang'), stored));
}
applyMotion();
// Načteno: titulní stav místo „Unfolding the city…“, tlačítka titulu povolená.
$('title-status').removeAttribute('data-i18n');
for (const b of $$('#title button')) b.disabled = false;
go({ type: 'loaded' });
// bonus.html přesměruje na ./#atlas: Atlas se otevře jako panel (jen když je už odkrytý).
if (location.hash === '#atlas') {
  history.replaceState(null, '', location.pathname + location.search);
  if (reveal(p).atlas) go({ type: 'open', panel: 'atlas' });
}
tick();
