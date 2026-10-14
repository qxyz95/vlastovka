import { BRANCHES, PRICES, DT, UPGRADE, VERSION } from './config.js';
import { t, num, unit, pct, setLang, pickLang, LANG_KEY, translateMessage } from './i18n.js';
import {
  fresh,
  buy,
  createFlight,
  step,
  activeEvent,
  eventInput,
  settle,
  reward,
  bestAngle,
  angleHint,
} from './core.js';
import { load, save } from './storage.js';
import { createFx, fxEvent, stepFx } from './juice.js';
import { lerp } from './motion.js';
import { districtAt, routeAt, SCREEN_METERS } from './scenes.js';
import { chargeAt, throwSettings } from './throw.js';
import { eventProgress, eventStats, windows, TIMING } from './events.js';
import { createDecorations, stepDecorations } from './decorations.js';
import { drawAim } from './render3d/ui-layer.js';
import { eventView } from './render3d/events-view.js';
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
  loaded = load();
let p = loaded.data,
  f = null,
  state = 'workshop',
  picked = { branch: 'power', level: 1 },
  last = 0,
  acc = 0;
let fx = null,
  prev = null,
  landedAt = 0,
  decorations = null,
  inputOwner = null,
  milestoneQueue = [],
  seenMilestones = new Set(),
  banner = null,
  lastDistrict = 0,
  districtUntil = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
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
let warning = loaded.warning;
const showWarning = () => {
  $('warning').textContent = translateMessage(warning);
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
    showWarning();
  }
}
const m = (x, d = 0) => unit(x, 'm', d);
// Language: ?lang= in the URL wins, then the last choice, otherwise English. Stored outside the save.
// Switching redraws every text without a reload: static HTML via data-i18n / data-i18n-aria, the rest through refresh() and the frame loop.
function applyLang(id) {
  const lang = setLang(id);
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-aria]'))
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const b of document.querySelectorAll('[data-lang]'))
    b.setAttribute('aria-pressed', b.dataset.lang === lang);
  $('version').textContent = t('footer.version', { version: VERSION });
  showWarning();
  refresh();
  if (state === 'aim') updateAim();
  if ($('result').open && f && outcome) fillResult();
}
for (const b of document.querySelectorAll('[data-lang]'))
  b.onclick = () => applyLang(b.dataset.lang);
// Story line under the scene: the current place in flight, otherwise the farthest place reached.
function setStory(text) {
  if ($('journey-story').textContent !== text) $('journey-story').textContent = text;
}
function storyAt(x, key = 'story.line') {
  const place = routeAt(x);
  return t(key, { place: place.name, story: place.story });
}
function refresh() {
  $('coins').textContent = p.coins;
  $('best').textContent = m(Math.floor(p.best));
  $('milestone').textContent = m(
    [100, 250, 500].find(n => n > p.best) ??
      Math.ceil((Math.floor(p.best / SCREEN_METERS) + 1) * SCREEN_METERS),
  );
  setStory(p.best > 0 ? storyAt(p.best, 'story.farthest') : storyAt(0));
  for (const m of ['dart', 'glider']) {
    $(m).classList.toggle('selected', p.model === m);
    $(m).setAttribute('aria-pressed', p.model === m);
  }
  $('glider').disabled = p.best < 100;
  $('glider-description').textContent =
    p.best < 100 ? t('model.glider.locked', { distance: m(100) }) : t('model.glider.desc');
  $('tree').replaceChildren();
  for (const b of BRANCHES) {
    const row = document.createElement('div');
    row.className = 'branch';
    const label = document.createElement('div');
    label.className = 'branch-label';
    label.textContent = b.icon + '  ' + t('branch.' + b.id);
    row.append(label);
    const nodes = document.createElement('div');
    nodes.className = 'nodes';
    for (let l = 1; l <= 5; l++) {
      const node = document.createElement('button'),
        owned = l <= p.levels[b.id],
        locked = l > p.levels[b.id] + 1;
      node.className =
        'node' +
        (owned ? ' owned' : locked ? ' locked' : '') +
        (picked.branch === b.id && picked.level === l ? ' picked' : '');
      const small = document.createElement('small');
      small.textContent = owned ? t('node.done') : num(PRICES[l - 1]) + ' ◈';
      node.append(`${owned ? '✓' : locked ? '·' : b.icon} ${l}`, small);
      node.setAttribute(
        'aria-label',
        t('node.aria', {
          branch: t('branch.' + b.id),
          level: l,
          status: t(
            owned
              ? 'node.owned'
              : locked
                ? 'node.locked'
                : p.coins < PRICES[l - 1]
                  ? 'node.poor'
                  : 'node.available',
          ),
        }),
      );
      node.onclick = () => {
        picked = { branch: b.id, level: l };
        refresh();
        $('tree')
          .querySelectorAll('.branch')
          [BRANCHES.indexOf(b)].querySelectorAll('button')
          [l - 1].focus();
      };
      nodes.append(node);
    }
    row.append(nodes);
    $('tree').append(row);
  }
  const b = BRANCHES.find(b => b.id === picked.branch),
    l = picked.level,
    owned = l <= p.levels[b.id],
    locked = l > p.levels[b.id] + 1;
  const price = PRICES[l - 1],
    el = (tag, text, cls) => {
      const e = document.createElement(tag);
      e.textContent = text;
      if (cls) e.className = cls;
      return e;
    },
    buyButton = el('button', owned ? t('detail.bought') : t('detail.buy', { price }));
  buyButton.id = 'buy';
  buyButton.disabled = owned || locked || p.coins < price;
  $('detail').replaceChildren(
    el('span', t('detail.eyebrow', { level: l }), 'eyebrow'),
    el('h3', b.icon + ' ' + t('branch.' + b.id)),
    el('p', effectText(b.id)),
    el(
      'p',
      owned
        ? t('detail.owned')
        : locked
          ? t('detail.locked', { level: l - 1 })
          : t('detail.price', { price }) +
            ' · ' +
            (p.coins < price ? t('detail.missing', { count: price - p.coins }) : t('detail.ready')),
    ),
    buyButton,
  );
  $('buy').onclick = () => {
    if (buy(p, b.id, l)) {
      persist();
      refresh();
      $('launch').focus();
    }
  };
}
// Effect numbers come from config (UPGRADE), so the text follows any rebalance.
function effectText(id) {
  const plus = x => '+' + pct(x);
  return t(
    'branch.' + id + '.effect',
    id === 'power'
      ? { speed: plus(UPGRADE.power) }
      : id === 'paper'
        ? { glide: plus(UPGRADE.paper) }
        : { steady: plus(UPGRADE.steady), window: plus(UPGRADE.window), qte: plus(UPGRADE.qte) },
  );
}
let angle = 15,
  held = false,
  heldTime = 0,
  owner = null;
function show(next) {
  state = next;
  document.body.classList.toggle('in-flight', next === 'flight');
  for (const id of ['workshop', 'flight', 'aim']) $(id).hidden = id !== next;
  $('game').classList.toggle('aiming', next === 'aim');
  if (next !== 'flight') {
    $('milestone-banner').hidden = true;
    $('scene-label').classList.remove('district-highlight');
  }
  if (next === 'workshop' || next === 'aim') {
    $('flight-reward').textContent = num(10) + ' ◈';
    decorations = null;
  }
}
function prepare() {
  if ($('result').open) $('result').close();
  f = null;
  fx = null;
  held = false;
  owner = null;
  heldTime = 0;
  acc = 0;
  show('aim');
  updateAim();
  $('hold').focus();
  $('game').scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function workshop(upgrades = false) {
  if ($('result').open) $('result').close();
  held = false;
  owner = null;
  f = null;
  fx = null;
  show('workshop');
  refresh();
  if (upgrades) {
    $('tree').scrollIntoView({ block: 'center' });
    $('tree').querySelector('button').focus();
  } else $('launch').focus();
}
function updateAim() {
  const charge = held ? chargeAt(heldTime) : 0;
  $('angle').value = angle;
  $('angle-value').textContent = Math.round(angle) + '°';
  $('charge-fill').style.width = charge * 100 + '%';
  const label = t(held ? 'aim.release' : 'aim.ready', {
    power: pct(Math.round(charge * 100) / 100),
  });
  if ($('charge-label').textContent !== label) $('charge-label').textContent = label;
}
function begin(source) {
  if (state !== 'aim' || held || hidden()) return;
  held = true;
  owner = source;
  heldTime = 0;
}
function release(source) {
  if (!held || owner !== source || state !== 'aim') return;
  const launch = throwSettings(angle, chargeAt(heldTime));
  held = false;
  owner = null;
  f = createFlight(p.model, p.levels, p.attempts + 1, { x: 0, y: 0 }, launch);
  acc = 0;
  prev = null;
  landedAt = 0;
  fx = createFx();
  fxEvent(fx, 'throw', { power: launch.power });
  decorations = createDecorations(f.seed);
  zoneKind = null;
  inputOwner = null;
  milestoneQueue = [];
  seenMilestones = new Set();
  banner = null;
  lastDistrict = 0;
  districtUntil = 0;
  show('flight');
  $('event-help').textContent = t('throw.' + launch.grade);
  $('action').disabled = true;
}
function cancelHold() {
  held = false;
  owner = null;
  heldTime = 0;
  updateAim();
}
function aimPointer(e) {
  const r = $('game').getBoundingClientRect(),
    o = view(null);
  const x = ((e.clientX - r.left) * 640) / r.width,
    y = ((e.clientY - r.top) * 360) / r.height;
  angle = Math.max(5, Math.min(40, (Math.atan2(o.py - y, Math.max(1, x - o.px)) * 180) / Math.PI));
  updateAim();
}
for (const target of [$('hold'), $('game')]) {
  target.addEventListener('pointerdown', e => {
    if (state !== 'aim' || e.button !== 0 || held) return;
    e.preventDefault();
    if (target === $('game')) aimPointer(e);
    target.setPointerCapture(e.pointerId);
    begin(e.pointerId);
  });
  target.addEventListener('pointermove', e => {
    if (state === 'aim' && target === $('game') && (!held || owner === e.pointerId)) aimPointer(e);
  });
  target.addEventListener('pointerup', e => {
    release(e.pointerId);
  });
  target.addEventListener('pointercancel', cancelHold);
  target.addEventListener('lostpointercapture', () => {
    if (held) cancelHold();
  });
}
$('angle').oninput = () => {
  angle = Number($('angle').value);
  updateAim();
};
$('launch').onclick = prepare;
$('retry').onclick = prepare;
$('upgrades').onclick = () => workshop(true);
$('return').onclick = () => workshop();
$('cancel-aim').onclick = () => workshop();
$('result').addEventListener('cancel', e => {
  e.preventDefault();
  workshop();
});
for (const m of ['dart', 'glider'])
  $(m).onclick = () => {
    if (m === 'glider' && p.best < 100) return;
    p.model = m;
    persist();
    refresh();
  };
function flightDown(source) {
  if (state !== 'flight' || hidden() || inputOwner !== null) return;
  const e = activeEvent(f);
  if (!e || e.result) return;
  inputOwner = source;
  eventInput(f, 'down', source);
}
function flightUp(source) {
  if (inputOwner !== source) return;
  eventInput(f, 'up', source);
  inputOwner = null;
}
function flightCancel() {
  if (inputOwner !== null) eventInput(f, 'cancel', inputOwner);
  inputOwner = null;
}
$('game').addEventListener('pointerdown', e => {
  if (state !== 'flight' || e.button !== 0 || inputOwner !== null) return;
  e.preventDefault();
  try {
    $('game').setPointerCapture(e.pointerId);
  } catch {}
  flightDown(e.pointerId);
});
$('game').addEventListener('pointerup', e => {
  if (state === 'flight') flightUp(e.pointerId);
});
$('game').addEventListener('pointercancel', e => {
  if (state === 'flight' && inputOwner === e.pointerId) flightCancel();
});
$('action').addEventListener('pointerdown', e => {
  if (e.button !== 0 || inputOwner !== null) return;
  e.preventDefault();
  $('action').setPointerCapture(e.pointerId);
  flightDown(e.pointerId);
});
$('action').addEventListener('pointerup', e => flightUp(e.pointerId));
$('action').addEventListener('pointercancel', e => {
  if (inputOwner === e.pointerId) flightCancel();
});
$('action').addEventListener('lostpointercapture', e => {
  if (inputOwner === e.pointerId) flightCancel();
});
// Space on another focused button (e.g. "Zpět do dílny") must activate that button, not throw.
const otherButton = e =>
  e.target instanceof HTMLButtonElement && e.target !== $('hold') && e.target !== $('action');
window.addEventListener('keydown', e => {
  if (
    state === 'aim' &&
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
    (e.code === 'Space' || (e.code === 'Enter' && e.target === $('action'))) &&
    (state === 'flight' || state === 'aim') &&
    !otherButton(e)
  ) {
    e.preventDefault();
    if (!e.repeat) {
      if (state === 'aim') begin('key');
      else flightDown('key');
    }
  }
});
window.addEventListener('keyup', e => {
  if (otherButton(e)) return;
  if (e.code === 'Space' || e.code === 'Enter') {
    if (state === 'aim') {
      e.preventDefault();
      release('key');
    } else if (state === 'flight') {
      e.preventDefault();
      flightUp('key');
    }
  }
});
window.addEventListener('blur', () => {
  if (state === 'aim') cancelHold();
  flightCancel();
});
$('reset').onclick = () => {
  if (confirm(t('footer.confirm'))) {
    p = fresh();
    persist();
    workshop();
  }
};
document.addEventListener('visibilitychange', () => {
  last = 0;
  acc = 0;
  if (hidden()) {
    if (state === 'aim') cancelHold();
    flightCancel();
  }
  $('paused').hidden = !hidden();
});
// Result facts are kept as data (outcome), so a language switch can redraw the dialog.
let outcome = null;
function finish() {
  const previous = p.best;
  settle(p, f);
  persist();
  refresh();
  show('result');
  outcome = {
    record: f.x > previous,
    glider: previous < 100 && p.best >= 100,
    hint: angleHint((f.launch.angle * 180) / Math.PI, bestAngle(f.model, p.levels, f.launch.power)),
  };
  fillResult();
  $('result').showModal();
  $('retry').focus();
}
function fillResult() {
  $('result-title').textContent = t(f.x >= 500 ? 'result.goal' : 'result.title');
  $('stat-distance').textContent = m(f.x, 1);
  $('stat-time').textContent = unit(f.t, 's', 1);
  $('stat-power').textContent = pct(Math.round(f.launch.power * 100) / 100);
  $('stat-angle').textContent = Math.round((f.launch.angle * 180) / Math.PI) + '°';
  const stats = eventStats(f);
  $('stat-events').textContent = stats.hits + ' / ' + stats.completed + ' · ★ ' + stats.perfect;
  $('stat-best').textContent = m(p.best, 1);
  $('reward-breakdown').textContent = t('result.breakdown', { base: 10, distance: reward(f) - 10 });
  $('stat-reward').textContent = num(reward(f));
  $('result-progress').value = Math.min(500, p.best);
  $('result-progress-label').textContent =
    p.best >= 500
      ? t('result.goalDone', { distance: m(p.best) })
      : t('result.progress', { best: num(Math.floor(p.best)), goal: m(500) });
  $('result-text').textContent = [
    t('throw.' + f.launch.grade),
    t(outcome.hint),
    outcome.record ? t('result.record') : '',
    outcome.glider ? t('result.gliderUnlocked') : '',
  ]
    .filter(Boolean)
    .join(' · ');
}
function frame(now) {
  const elapsed = last ? Math.min((now - last) / 1000, 0.1) : 0;
  last = now;
  if (!hidden()) {
    if (state === 'aim') {
      if (held) heldTime += elapsed;
      updateAim();
    }
    if (state === 'flight') {
      // Hitstop freezes physics for a few frames; QTE timing runs on flight time, so it is unaffected.
      if (fx.hitstop > 0) fx.hitstop = Math.max(0, fx.hitstop - elapsed);
      else acc += elapsed;
      while (acc >= DT && !f.landed) {
        prev = { x: f.x, y: f.y, vx: f.vx, vy: f.vy, t: f.t };
        step(f);
        stepDecorations(decorations, f);
        acc -= DT;
      }
      juiceEvents();
      // Let the landing dust and shake play before the result dialog covers the scene.
      if (f.landed) {
        if (!landedAt) landedAt = now;
        if (now - landedAt > (reduced.matches ? 300 : 850)) finish();
      }
      updateFlightUI();
    }
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
    if (fx) stepFx(fx, elapsed, shown, view(shown));
    const dist = m(Math.floor(f?.x ?? 0)),
      sceneLabel = state === 'aim' ? t('scene.aim') : districtAt(f?.x ?? 0).name;
    if ($('distance').textContent !== dist) $('distance').textContent = dist;
    if ($('scene-label').textContent !== sceneLabel) $('scene-label').textContent = sceneLabel;
    const charge = state === 'aim' && held ? chargeAt(heldTime) : 0,
      aim = state === 'aim' ? { angle, held, charge } : null;
    try {
      render(
        $('game'),
        shown,
        p.model,
        f ? f.t + (f.landed && landedAt ? (now - landedAt) / 1000 : 0) : now / 1000,
        {
          decorations,
          reduced: reduced.matches,
          qte: qteVisual(),
          fx,
          charge,
          clock: now / 1000,
          state,
          aim,
          best: p.best,
          style: STYLE,
          touch: coarse.matches,
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
// Bar position of an event's success/perfect windows, as fractions of the bar.
function zonesFor(kind) {
  const w = windows(f)[kind],
    c = (kind === 'gust' ? w.center - TIMING.warning : w.center) / TIMING.bar,
    s = w.success / TIMING.bar,
    pf = w.perfect / TIMING.bar;
  return { success: [c - s, c + s], perfect: [c - pf, c + pf] };
}
let zoneKind = null;
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
  if (state !== 'flight' || !f) return null;
  const e = activeEvent(f);
  if (!e) return null;
  return {
    type: e.type,
    phase: e.phase,
    result: e.result,
    held: e.heldAt !== null,
    progress: eventProgress(f, e),
    zones: zonesFor(e.type),
  };
}
function updateFlightUI() {
  const e = activeEvent(f),
    interactive = e && !e.result;
  if (e && e.type !== zoneKind) {
    zoneKind = e.type;
    const z = zonesFor(zoneKind);
    for (const [cls, [a, b]] of [
      ['success-zone', z.success],
      ['perfect-zone', z.perfect],
    ]) {
      const el = document.querySelector('.' + cls);
      el.style.left = a * 100 + '%';
      el.style.width = (b - a) * 100 + '%';
    }
  }
  const title = e ? eventView(e.type).title : t('flight.calm'),
    act = t(
      e?.type === 'bird' ? (e.heldAt !== null ? 'flight.release' : 'flight.hold') : 'flight.tap',
    );
  if ($('event-title').textContent !== title) $('event-title').textContent = title;
  $('action').disabled = !interactive;
  if ($('action').textContent !== act) $('action').textContent = act;
  $('flight').dataset.kind = e?.type ?? 'none';
  $('flight').dataset.phase = e?.phase ?? 'idle';
  $('needle').style.left = (e ? eventProgress(f, e) * 100 : 0) + '%';
  const help =
    e?.phase === 'warning'
      ? t('help.ready')
      : interactive
        ? t(e.type === 'gust' ? 'help.gust' : e.heldAt !== null ? 'help.holding' : 'help.bird')
        : f.t < f.feedbackUntil
          ? t(f.feedback)
          : t('help.idle');
  if ($('event-help').textContent !== help) $('event-help').textContent = help;
  const rw = num(reward(f)) + ' ◈';
  if ($('flight-reward').textContent !== rw) $('flight-reward').textContent = rw;
  setStory(storyAt(f.x));
  for (const m of [100, 250, 500])
    if (f.x >= m && !seenMilestones.has(m)) {
      seenMilestones.add(m);
      milestoneQueue.push(m);
      fxEvent(fx, 'milestone');
    }
  if (banner && f.t >= banner.until) banner = null;
  if (!e && !banner && milestoneQueue.length)
    banner = { value: milestoneQueue.shift(), until: f.t + 1.5 };
  $('milestone-banner').hidden = !!e || !banner || f.landed;
  if (banner) {
    const text = t(banner.value === 500 ? 'banner.goal' : 'banner.milestone', {
      distance: m(banner.value),
    });
    if ($('milestone-banner').textContent !== text) $('milestone-banner').textContent = text;
  }
  const district = districtAt(f.x).index;
  if (district !== lastDistrict) {
    lastDistrict = district;
    districtUntil = f.t + 1.5;
  }
  $('scene-label').classList.toggle('district-highlight', f.t < districtUntil);
}
{
  let stored = null;
  try {
    stored = localStorage.getItem(LANG_KEY);
  } catch {}
  applyLang(pickLang(new URLSearchParams(location.search).get('lang'), stored));
}
tick();
