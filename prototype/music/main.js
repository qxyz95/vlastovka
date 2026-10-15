// Music prototype (research/hudba/01 §6, 03 F): three procedural candidates (B, E, Diorama G), a real flight from core.js
// rendered by render.js, blind listening by 03 F.6 at equal loudness, LUFS by BS.1770, fatigue test, own-file comparison
// and load measurement. Not loaded by the game.
import { createAudio, benchmark, renderOffline } from '../../src/audio.js';
import { createSfx } from '../../src/sfx.js';
import {
  trackFor,
  boundaryPlan,
  comboAfter,
  createTickPlanner,
  audioState,
  rngFor,
  ARC,
  ROUTE_METERS,
} from '../../src/audio-mix.js';
import { lufs, momentaryAt, samplePeak } from '../../src/audio-loudness.js';
import { TRACKS, TRACK_IDS } from '../../src/music/index.js';
import { createFlight, step, activeEvent, eventInput } from '../../src/core.js';
import { windows, TIMING, eventProgress } from '../../src/events.js';
import { DT } from '../../src/config.js';
import { render, view } from '../../src/render.js';
import { createFx, fxEvent, stepFx } from '../../src/juice.js';
import { THEMES, setTheme } from '../../src/themes.js';
import { SECTION_METERS, SCREEN_METERS, routeAt, districtAt } from '../../src/scenes.js';
import { throwSettings, chargeAt } from '../../src/throw.js';
import { lerp } from '../../src/motion.js';
import {
  CRITERIA,
  DIRS,
  blindMap,
  loadStore,
  saveStore,
  summary,
  TARGET_LUFS,
  trimFor,
  quizOrder,
  motifQuiz,
} from './blind.js';
const $ = id => document.getElementById(id),
  canvas = $('game'),
  reduced = matchMedia('(prefers-reduced-motion: reduce)');
const audio = createAudio(),
  sfx = createSfx(audio),
  ctx = audio.ctx;
let store = loadStore();
const ui = { dir: 'G', district: 0, place: 3, follow: false, blind: false, x: 'X1', quiz: null };
let started = false; // music is on by default and starts on the first gesture
// ---------- music selection ----------
for (const id of TRACK_IDS)
  $('dir').add(
    new Option(
      `${id} · ${TRACKS[id].name} (${TRACKS[id].style}${TRACKS[id].quality === 'sketch' ? ', skica' : ''})`,
      id,
    ),
  );
$('dir').add(new Option('Bez hudby (jen efekty)', 'off'));
$('dir').add(new Option('Vlastní soubor', 'file'));
$('dir').value = ui.dir;
ARC.slice(0, 4).forEach((a, i) =>
  $('district').add(new Option(`${i + 1} · ${a.name} (D ${a.mode})`, i)),
);
const musicKey = () => (ui.quiz ? 'G' : ui.blind ? store.map[ui.x] : ui.dir); // the actual direction
const label = () => (ui.quiz ? '?' : ui.blind ? ui.x : ui.dir); // what the page may show
const district = () =>
  ui.quiz
    ? ui.quiz.order[ui.quiz.i]
    : ui.follow
      ? trackFor({ best: S.best }).district
      : ui.district;
const place = () => (ui.follow ? trackFor({ best: S.best }).place : ui.place);
// In blind mode every candidate plays at the same integrated loudness (03 F.4: −22 LUFS), otherwise the louder wins.
const trimOf = k => (ui.blind && !ui.quiz ? trimFor(store, k, district()) : 0);
function applyMusic(o = {}) {
  const k = musicKey();
  if (TRACKS[k]) {
    audio.play(TRACKS[k], district(), audio.seed, o);
    audio.setTrim(trimOf(k));
  } else if (k === 'off') audio.stop();
}
$('dir').onchange = () => {
  ui.dir = $('dir').value;
  if (ui.dir === 'file' && !audio.file) $('file-out').textContent = 'Nejdřív přetáhni soubor.';
  if (ui.dir !== 'file') applyMusic();
};
$('district').onchange = () => {
  ui.district = Number($('district').value);
  applyMusic();
};
$('place').oninput = () => {
  ui.place = Number($('place').value) - 1;
  $('place-out').value = ui.place + 1;
};
$('place').oninput();
$('follow').onchange = () => {
  ui.follow = $('follow').checked;
  $('district').disabled = $('place').disabled = ui.follow;
  applyMusic();
};
$('best').oninput = () => {
  S.best = Number($('best').value);
  if (ui.follow) applyMusic();
};
const MANUAL = [
  ['Dílna', { screen: 'workshop' }],
  ['Míření', { screen: 'aim' }],
  ['Let, klid', { screen: 'flight', speed: 1 }],
  ['Let po zásahu', { screen: 'flight', speed: 1.1, hits: 1 }],
  ['Kombo 3, rychle', { screen: 'flight', speed: 1.6, hits: 3, combo: 3 }],
];
$('intensity').oninput = () => {
  $('int-out').value = MANUAL[$('intensity').value][0];
};
$('intensity').oninput();
// ---------- settings ----------
const pct = v => Math.round(v * 100) + ' %';
function showSettings() {
  const s = audio.settings;
  for (const k of ['master', 'music', 'sfx']) {
    $(k).value = Math.round(s[k] * 100);
    $('o-' + k).value = pct(s[k]);
  }
  $('latency').value = Math.round(s.latency * 1000);
  $('o-latency').value = Math.round(s.latency * 1000) + ' ms';
  for (const k of ['tick', 'calm', 'muted']) $(k).checked = s[k];
}
for (const k of ['master', 'music', 'sfx'])
  $(k).oninput = () => {
    audio.setSettings({ [k]: $(k).value / 100 });
    showSettings();
  };
$('latency').oninput = () => {
  audio.setSettings({ latency: $('latency').value / 1000 });
  showSettings();
};
for (const k of ['tick', 'calm', 'muted'])
  $(k).onchange = () => {
    audio.setSettings({ [k]: $(k).checked });
  };
showSettings();
// ---------- visual equivalents: a lamp for every sound, flashed at its audio time ----------
const LAMPS = {
  beat: '♩ beat',
  bar: '▮ bar',
  tick: '⏱ tik',
  mask: '◌ ticho',
  success: '✓ success',
  perfect: '★ perfect',
  combo: '↗ kombo',
  miss: '○ miss',
  jingle: '♫ znělka',
  stinger: '✶ nová čtvrť',
  duck: '▼ duck',
  throw: '➶ hod',
  boost: '» boost',
  land: '▂ dopad',
  wind: '≈ vítr',
  charge: '⚡ nabití',
  switch: '⇄ skladba',
  rest: '… pauza',
  finale: '☀ finále',
};
const lamps = {};
for (const [k, t] of Object.entries(LAMPS)) {
  const s = document.createElement('span');
  s.className = 'lamp ' + k;
  s.textContent = t;
  $('cues').append(s);
  lamps[k] = s;
}
const meterLamp = (k, v) => {
  lamps[k].style.background =
    v > 0.02 ? `color-mix(in srgb,var(--cyan) ${Math.round(v * 100)}%,#0b0820)` : '';
  lamps[k].style.color = v > 0.3 ? '#000' : '';
};
const timers = new Map(),
  flash = (k, text, ms) => {
    const l = lamps[k];
    if (!l) return;
    if (text) l.textContent = text;
    l.classList.add('on');
    clearTimeout(l._t);
    l._t = setTimeout(
      () => {
        l.classList.remove('on');
      },
      ms ?? (k === 'jingle' || k === 'finale' ? 1500 : 180),
    );
  };
const at = (when, fn) =>
  setTimeout(fn, Math.max(0, (when - ctx.currentTime + (ctx.outputLatency || 0)) * 1000));
audio.on((type, info) => {
  if (type === 'cue') {
    if (info.name === 'wind' || info.name === 'charge') {
      meterLamp(info.name, info.level);
      return;
    }
    timers.set(
      info.id,
      at(info.when, () => {
        timers.delete(info.id);
        flash(
          info.name,
          info.name === 'combo'
            ? `↗ kombo ${info.combo}`
            : info.name === 'jingle'
              ? `♫ ${ARC[info.district]?.name ?? ''}`
              : null,
          info.name === 'mask'
            ? (info.until - info.when) * 1000
            : info.name === 'rest'
              ? info.sec * 1000
              : undefined,
        );
      }),
    );
  }
  if (type === 'uncue') {
    clearTimeout(timers.get(info.id));
    timers.delete(info.id);
  }
  if (type === 'bar') {
    at(info.when, () => flash('bar'));
    for (let b = 0; b < 4; b++) at(info.when + b * info.spb, () => flash('beat'));
  }
  if (type === 'unlock') {
    $('unlock').hidden = true;
    if (!started) {
      started = true;
      if (ui.dir !== 'file') applyMusic();
    }
  }
});
$('unlock').onclick = () => audio.unlock();
// ---------- auto flight ----------
const LEVELS = {
  early: { power: 1, paper: 1, fold: 1 },
  mid: { power: 3, paper: 3, fold: 3 },
  late: { power: 5, paper: 5, fold: 5 },
};
const S = {
  on: false,
  phase: 'workshop',
  t: 0,
  f: null,
  prev: null,
  acc: 0,
  fx: createFx(),
  combo: 0,
  hits: 0,
  throws: 0,
  best: 0,
  preBest: 0,
  newDistrict: null,
  landedAt: 0,
  power: 0,
  release: 1,
  decisions: [],
  seen: new Set(),
  seeds: {},
  banner: null,
};
const planner = createTickPlanner(when => (audio.settings.tick ? sfx.tick(when) : null));
$('auto').onclick = () => setAuto(!S.on);
function setAuto(on) {
  S.on = on;
  $('auto').setAttribute('aria-pressed', on);
  $('auto').textContent = on ? '■ Stop' : '▶ Auto flight';
  if (on) {
    audio.unlock();
    if (!audio.track && !audio.file) applyMusic();
    enter('aim');
  } else {
    planner.clear(ctx);
    sfx.chargeStop();
    sfx.wind(0);
    S.f = null;
    enter('workshop');
  }
}
function enter(phase) {
  S.phase = phase;
  S.t = 0;
  if (phase === 'aim') {
    S.power = 0;
    S.release = 0.85 + 0.3 * Math.random();
  }
  // Result card: the full jingle of a newly reached district plays here, not in flight (03 E.4/5).
  if (phase === 'result' && S.newDistrict != null) {
    if (S.newDistrict >= 4 && musicKey() === 'G') {
      S.phase = 'finale';
      audio.playCue('finale', TRACKS.G);
    } else sfx.jingle(S.newDistrict);
    S.newDistrict = null;
  }
}
function throwPlane() {
  const k = musicKey() ?? 'off';
  S.seeds[k] = (S.seeds[k] ?? 0) + 1;
  const seed = S.seeds[k],
    r = rngFor('throw', seed);
  const f = createFlight(
    'dart',
    LEVELS[$('stage-lv').value],
    seed,
    { x: 0, y: 0 },
    throwSettings(16 + r() * 6, S.power),
  );
  const start = ui.follow
    ? Math.max(0, S.best - 150)
    : district() * SECTION_METERS + place() * SCREEN_METERS + ((seed * 173) % 200);
  f.x = f.startX = start;
  const p = $('qte').value,
    rate = p === 'bot70' ? 0.7 : p === 'bot95' ? 0.95 : 0,
    br = rngFor('bot', seed);
  S.decisions = f.events.map(() => ({ hit: br() < rate, perfect: br() < rate * 0.6, off: br() }));
  Object.assign(S, {
    f,
    prev: null,
    acc: 0,
    fx: createFx(),
    combo: 0,
    hits: 0,
    landedAt: 0,
    preBest: Math.max(S.best, start),
    newDistrict: null,
    seen: new Set(),
  });
  S.throws++;
  fxEvent(S.fx, 'throw', { power: S.power });
  sfx.chargeStop();
  sfx.throw(S.power);
  enter('flight');
}
// Bot: presses on the exact centre (perfect) or inside the success window, from the running event's windows e.w.
function bot(f) {
  if ($('qte').value === 'player') return;
  f.events.forEach((e, i) => {
    const d = S.decisions[i];
    if (!d?.hit || e.result || e.phase !== 'interaction' || !e.w) return;
    const off = d.perfect ? 0 : (0.4 + 0.5 * d.off) * e.w.s;
    if (e.type === 'bird') {
      if (e.heldAt === null) eventInput(f, 'down', 'sim');
      else if (f.t >= e.heldAt + e.w.c + off) eventInput(f, 'up', 'sim');
    } else {
      const c = Array.isArray(e.w.c) ? e.w.c[e.puff ?? 0] : e.w.c;
      if (f.t >= c + off) eventInput(f, 'down', 'sim');
    }
  });
}
function feedback(e) {
  S.combo = comboAfter(S.combo, e.result);
  if (e.result !== 'miss') S.hits++;
  fxEvent(S.fx, e.result);
  if (e.result === 'perfect') sfx.perfect(S.combo);
  else if (e.result === 'success') sfx.success(S.combo);
  else sfx.miss();
  if (e.type === 'gust' && e.result !== 'miss') {
    fxEvent(S.fx, 'boost');
    sfx.boost();
  }
  if ($('qte').value === 'player') {
    const k =
        audio.settings.muted || audio.settings.music === 0 || musicKey() === 'off'
          ? 'off'
          : musicKey() === 'file'
            ? 'file'
            : musicKey(),
      q = (store.qte[k] ??= { n: 0, hit: 0, perfect: 0 });
    q.n++;
    if (e.result !== 'miss') q.hit++;
    if (e.result === 'perfect') q.perfect++;
    saveStore(store);
    showQte();
  }
}
// District boundary in flight (03 E.4): a known district does nothing in the music (banner only), a new one switches in calm.
function onBoundary(px, x) {
  const plan = boundaryPlan(px, x, S.preBest, {
      held: !!audio.mix.held,
      stingers: audio.stingers,
    }),
    d = Math.floor(x / SECTION_METERS);
  const name = d >= 4 ? 'Finale' : ARC[d].name;
  S.banner = {
    text: (plan ? 'NEW DISTRICT · ' : '') + name,
    until: performance.now() + 2000,
  };
  if (!plan) return;
  S.newDistrict = Math.max(S.newDistrict ?? 0, plan.district);
  if (ui.follow && plan.district < 4) {
    S.best = Math.max(S.best, plan.district * SECTION_METERS);
    applyMusic({ calmOnly: true, stinger: plan.stinger });
  }
}
function simulate(dt, now) {
  S.t += dt;
  if (S.phase === 'aim') {
    const held = Math.max(0, S.t - 0.3);
    S.power = chargeAt(Math.min(held, S.release));
    if (S.t > 0.3) sfx.charge(S.power);
    if (held >= S.release) throwPlane();
    return;
  }
  if (S.phase === 'finale' && !audio.cueing && S.t > 3) enter('workshop');
  if (S.phase === 'result' && S.t > 2.5) enter(S.throws % 4 === 0 ? 'workshop' : 'aim');
  if (S.phase === 'workshop' && S.t > 4) enter('aim');
  if (S.phase !== 'flight') return;
  const f = S.f;
  if (S.fx.hitstop > 0) S.fx.hitstop = Math.max(0, S.fx.hitstop - dt);
  else S.acc += dt * (f.warp ?? 1);
  while (S.acc >= DT && !f.landed) {
    S.prev = { x: f.x, y: f.y, vx: f.vx, vy: f.vy, t: f.t };
    bot(f);
    const px = f.x;
    step(f);
    S.acc -= DT;
    if (Math.floor(px / SECTION_METERS) !== Math.floor(f.x / SECTION_METERS)) onBoundary(px, f.x);
  }
  for (const e of f.events)
    if (['success', 'perfect', 'miss'].includes(e.result) && !S.seen.has(e)) {
      S.seen.add(e);
      feedback(e);
    }
  planner.update(
    ctx,
    f.t + (f.landed ? 0 : S.acc),
    activeEvent(f),
    windows(f),
    audio.settings.latency,
  );
  if (f.landed && !S.landedAt) {
    S.landedAt = now;
    const sp = S.prev ? Math.hypot(S.prev.vx, S.prev.vy) : 0,
      kind = routeAt(f.x).kind;
    sfx.land(sp, ['bridge', 'lighthouse'].includes(kind) ? 'water' : 'roof');
    audio.duck(ctx.currentTime, { db: -3, hold: 0.15, release: 0.15 });
    fxEvent(S.fx, 'land', { speed: sp, text: Math.floor(f.x - f.startX) + ' m' });
    if (f.x > S.best) {
      S.best = Math.min(ROUTE_METERS, f.x);
      $('best').value = S.best;
      if (ui.follow) applyMusic();
    }
  }
  if (S.landedAt && now - S.landedAt > 850) {
    planner.clear(ctx);
    enter('result');
  }
}
// ---------- manual events ----------
let manualQte = null,
  manualCombo = 0,
  manualFx = createFx();
const EVENTS = {
  'Varování + okno (tik)': () => {
    manualQte = { start: ctx.currentTime, result: null };
    const w = windows(null).gust;
    manualQte.tick = audio.settings.tick
      ? sfx.tick(ctx.currentTime + w.center - (ctx.outputLatency || 0) + audio.settings.latency)
      : null;
  },
  Success: () => {
    manualCombo++;
    sfx.success(manualCombo);
    fxEvent(manualFx, 'success');
  },
  Perfect: () => {
    manualCombo++;
    sfx.perfect(manualCombo);
    fxEvent(manualFx, 'perfect');
  },
  Miss: () => {
    manualCombo = 0;
    sfx.miss();
    fxEvent(manualFx, 'miss');
  },
  'Znělka čtvrti (karta)': () => sfx.jingle(district()),
  'Stinger nové čtvrti': () => sfx.stinger((district() + 1) % 4),
  'Hranice (nová čtvrť)': () => {
    const d = (district() + 1) % 4;
    ui.district = d;
    $('district').value = d;
    applyMusic({ stinger: true });
  },
  'Finále (Diorama)': () => audio.playCue('finale', TRACKS.G),
  'Pauza proti únavě (10 s)': () => audio.rest(10),
  Hod: () => {
    sfx.throw(0.9);
    fxEvent(manualFx, 'throw', { power: 0.9 });
  },
  Dopad: () => {
    sfx.land(18);
    fxEvent(manualFx, 'land', { speed: 18, text: 'flop' });
  },
  'Dopad do vody': () => sfx.land(14, 'water'),
  'Nabíjení 1 s': () => {
    let p = 0;
    const id = setInterval(() => {
      p += 0.05;
      sfx.charge(chargeAt(p));
      if (p >= 1.05) {
        clearInterval(id);
        sfx.chargeStop();
        sfx.throw(0.95);
      }
    }, 50);
  },
  'Vítr nahoru/dolů': () => {
    let p = 0;
    const id = setInterval(() => {
      p += 0.05;
      sfx.wind(Math.sin(Math.PI * Math.min(1, p / 3)));
      if (p >= 3) {
        clearInterval(id);
        sfx.wind(0);
      }
    }, 50);
  },
};
for (const [name, fn] of Object.entries(EVENTS)) {
  const b = document.createElement('button');
  b.textContent = name;
  b.onclick = () => {
    audio.unlock();
    if (!audio.track && !audio.file) applyMusic();
    fn();
  };
  $('ev-buttons').append(b);
}
function manualPhase() {
  if (!manualQte) return 'none';
  const t = ctx.currentTime - manualQte.start;
  if (t < TIMING.warning) return 'warning';
  if (t < TIMING.warning + TIMING.bar && !manualQte.result) return 'window';
  if (t < TIMING.warning + TIMING.bar + 0.6) return 'effect';
  manualQte = null;
  return 'none';
}
function manualPress() {
  if (manualPhase() !== 'window') return;
  const w = windows(null).gust,
    d = Math.abs(ctx.currentTime - manualQte.start - w.center);
  manualQte.result = d <= w.perfect ? 'perfect' : d <= w.success ? 'success' : 'miss';
  manualQte.tick?.cancel?.();
  EVENTS[
    manualQte.result === 'perfect' ? 'Perfect' : manualQte.result === 'success' ? 'Success' : 'Miss'
  ]();
}
// ---------- input ----------
const press = kind => {
  if (S.on && S.phase === 'flight' && S.f && $('qte').value === 'player')
    eventInput(S.f, kind, 'key');
  else if (!S.on && kind === 'down') manualPress();
};
addEventListener('keydown', e => {
  if (e.code === 'Space' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
    e.preventDefault();
    if (!e.repeat) press('down');
  }
  if (e.code === 'KeyM' && e.target.tagName !== 'INPUT') {
    audio.setSettings({ muted: !audio.settings.muted });
    showSettings();
  }
});
addEventListener('keyup', e => {
  if (e.code === 'Space') press('up');
});
canvas.addEventListener('pointerdown', () => press('down'));
addEventListener('pointerup', () => press('up'));
addEventListener('pointercancel', () => press('up'));
addEventListener('blur', () => press('up'));
// ---------- theme ----------
for (const id of Object.keys(THEMES)) $('theme').add(new Option(THEMES[id].name ?? id, id));
$('theme').value = 'paper';
setTheme('paper');
$('theme').onchange = () => setTheme($('theme').value);
// ---------- frame loop ----------
const zones = (f, kind) => {
  const w = windows(f)[kind],
    c = (kind === 'gust' ? w.center - TIMING.warning : w.center) / TIMING.bar,
    s = w.success / TIMING.bar,
    pf = w.perfect / TIMING.bar;
  return { success: [c - s, c + s], perfect: [c - pf, c + pf] };
};
// ?timer: a timer loop instead of requestAnimationFrame (for automated checks in a hidden window).
const TIMER = new URLSearchParams(location.search).has('timer'),
  nextFrame = TIMER ? cb => setTimeout(() => cb(performance.now()), 16) : requestAnimationFrame;
let last = 0,
  glide = 0,
  frameMs = 0,
  prevX = 0;
function frame(now) {
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
  last = now;
  if (!document.hidden || TIMER) {
    if (S.on) simulate(dt, now);
    if (fat.on) fatigueStep(dt);
    const f = S.on ? S.f : null,
      inFlight = S.on && S.phase === 'flight' && f,
      e = inFlight ? activeEvent(f) : null;
    // One audio state per frame (03 F.2): from the auto flight, or from the manual slider and manual QTE.
    let st;
    if (S.on) {
      st = audioState(
        inFlight ? { ...f, t: f.t + (f.landed ? 0 : S.acc) } : f,
        {
          best: S.best,
          combo: S.combo,
          prevX,
          calm: audio.settings.calm,
          reducedMotion: reduced.matches,
        },
        S.phase,
      );
      st.combo = S.combo;
      st.hits = S.hits;
      prevX = f?.x ?? 0;
    } else {
      st = { ...MANUAL[$('intensity').value][1], event: manualPhase() };
      if (st.event !== 'none') {
        st.screen = 'flight'; // a manual QTE always thins like in flight
        if (manualQte) st.centres = [manualQte.start + windows(null).gust.center];
        st.flightT = ctx.currentTime;
      }
    }
    st.place = place();
    audio.update(st);
    sfx.wind(inFlight && !f.landed ? Math.max(0, Math.min(1, (f.vx / f.cruise - 0.8) / 1.6)) : 0);
    // Draw: the flight (interpolated between physics steps) or a gentle glide in manual mode.
    const t0 = performance.now();
    let shown,
      qte = null,
      fx = S.on ? S.fx : manualFx,
      charge = 0;
    if (inFlight) {
      const a = Math.min(1, S.acc / DT);
      shown =
        S.prev && !f.landed
          ? {
              ...f,
              x: lerp(S.prev.x, f.x, a),
              y: lerp(S.prev.y, f.y, a),
              vx: lerp(S.prev.vx, f.vx, a),
              vy: lerp(S.prev.vy, f.vy, a),
              t: lerp(S.prev.t, f.t, a),
            }
          : f;
      if (e)
        qte = {
          type: e.type,
          phase: e.phase,
          result: e.result,
          held: e.heldAt !== null,
          progress: eventProgress(f, e),
          zones: zones(f, e.type === 'bird' ? 'bird' : 'gust'),
        };
    } else if (S.on) {
      shown = S.phase === 'result' ? f : null;
      charge = S.phase === 'aim' ? S.power : 0;
    } else {
      glide += dt * 22;
      shown = {
        x: district() * SECTION_METERS + (glide % 1100),
        y: 35,
        vx: 22,
        vy: 0,
        t: now / 1000,
        events: [],
        landed: false,
      };
      const ph = manualPhase();
      if (ph !== 'none') {
        const fake = { p: { window: 1 } },
          z = zones(fake, 'gust');
        qte = {
          type: 'gust',
          phase: ph === 'window' ? 'interaction' : ph,
          result: manualQte?.result ?? null,
          held: false,
          progress: Math.max(
            0,
            Math.min(1, (ctx.currentTime - (manualQte?.start ?? 0) - TIMING.warning) / TIMING.bar),
          ),
          zones: z,
        };
      }
    }
    if (!ui.quiz) {
      stepFx(fx, dt, shown, view(shown));
      render(canvas, shown, 'dart', now / 1000, {
        reduced: reduced.matches,
        qte,
        fx,
        charge,
        clock: now / 1000,
      });
    }
    frameMs = frameMs * 0.95 + (performance.now() - t0) * 0.05;
    hud(st, shown);
    timeline();
  }
  nextFrame(frame);
}
function hud(st, shown) {
  const k = musicKey(),
    tr = TRACKS[k],
    hide = ui.blind || ui.quiz,
    name = hide
      ? label()
      : tr
        ? `${k} · ${tr.name}`
        : k === 'file'
          ? `soubor: ${audio.file?.name ?? '—'}`
          : 'bez hudby';
  const dd = tr?.districts[audio.district] ?? null;
  $('hud').textContent = [
    `${name}${dd && !hide ? ` · ${dd.name} · ${dd.bpm} BPM · D ${dd.mode} · místo ${audio.place + 1}` : dd && !ui.quiz ? ` · čtvrť ${audio.district + 1}` : ''}`,
    `stav ${st.screen}${st.event && st.event !== 'none' ? ' · ' + st.event : ''} · kombo ${st.combo ?? 0} · zásahy ${st.hits ?? 0}${audio.resting() ? ' · pauza proti únavě' : ''}${audio.bedOnly ? ' · jen plocha' : ''}`,
    shown && !ui.quiz ? `${Math.floor(shown.x)} m · ${districtAt(shown.x).name}` : '',
    S.on && S.f && !ui.quiz
      ? `rychlost ${(S.f.vx / S.f.cruise).toFixed(2)}× · výška ${S.f.y.toFixed(0)} m · seed ${S.f.seed}`
      : '',
    S.on && S.phase === 'flight' && $('qte').value === 'player' ? 'MEZERNÍK = QTE' : '',
  ]
    .filter(Boolean)
    .join('\n');
  const tf = trackFor({ best: S.best });
  $('best-out').value = `${Math.floor(S.best)} m → ${ARC[tf.district].name}, místo ${tf.place + 1}`;
  const b = S.banner && performance.now() < S.banner.until;
  $('banner').hidden = !b;
  if (b) $('banner').textContent = S.banner.text;
}
// Timeline of the next 4 s (visual equivalent of the silence mask): beats, bar lines, QTE centres and masks.
const tl = $('timeline'),
  tlc = tl.getContext('2d');
function timeline() {
  const W = tl.width,
    H = tl.height,
    t0 = ctx.currentTime,
    span = 4,
    X = t => ((t - t0) / span) * W;
  tlc.fillStyle = '#120e30';
  tlc.fillRect(0, 0, W, H);
  for (const [a, b] of audio.mask) {
    tlc.fillStyle = '#ff4fc355';
    tlc.fillRect(X(a), 0, Math.max(2, X(b) - X(a)), H);
  }
  if (audio.track) {
    const spb = audio.spb;
    for (
      let k = Math.ceil((t0 - audio.barStart) / spb);
      audio.barStart + k * spb < t0 + span;
      k++
    ) {
      const x = X(audio.barStart + k * spb);
      tlc.fillStyle = k % 4 === 0 ? '#ffd166' : '#3a2f80';
      tlc.fillRect(x, k % 4 === 0 ? 0 : H / 2, 2, k % 4 === 0 ? H : H / 2);
    }
  }
  tlc.fillStyle = '#53e6ff';
  for (const c of audio.centres) tlc.fillRect(X(c) - 1, 0, 3, H);
  tlc.fillStyle = '#e8e6ff';
  tlc.font = '11px ui-monospace,Consolas,monospace';
  tlc.fillText(
    `${audio.mix.held ? 'filtr 1,8 kHz' : 'filtr otevřený'}${audio.pending ? ' · čeká přepnutí' : ''}`,
    4,
    12,
  );
}
// ---------- layer meters and load ----------
$('layers').innerHTML =
  ['L0 bed', 'L1 pulse', 'L2 groove', 'L3 lead']
    .map(
      (n, i) =>
        `<div>${n} <span class="meter"><i id="lm${i}"></i></span> <output id="lv${i}"></output></div>`,
    )
    .join('') +
  '<div>filtr <output id="lf"></output> · pad <output id="lp"></output> · úroveň <span class="meter"><i id="rms"></i></span></div>';
const buf = new Float32Array(512);
setInterval(() => {
  const g = audio.g;
  g.layers.forEach((L, i) => {
    const v = L.gain.gain.value;
    $('lm' + i).style.width = Math.min(100, v * 100) + '%';
    $('lv' + i).value = v.toFixed(2);
  });
  $('lf').value = Math.round(g.lp.frequency.value) + ' Hz';
  $('lp').value = Math.round(g.layers[0].lp.frequency.value) + ' Hz';
  g.analyser.getFloatTimeDomainData(buf);
  let s = 0;
  for (const x of buf) s += x * x;
  $('rms').style.width = Math.min(100, Math.sqrt(s / buf.length) * 300) + '%';
  const st = audio.stats();
  monitor.sample(st);
  $('load').textContent =
    `hlasy ${st.voices} (špička ${st.peak}) · fronta ${st.queue} · zahozeno maskou ${st.dropped}\nplánovač ${st.schedAvg.toFixed(3)} ms prům. / ${st.schedMax.toFixed(2)} ms max (celkem ${st.schedMaxAll.toFixed(2)})\nrender ${frameMs.toFixed(2)} ms/snímek · ${st.state} · ${st.rate} Hz · latence ${(st.base * 1000).toFixed(0)}+${(st.output * 1000).toFixed(0)} ms${st.underruns != null ? ` · výpadky ${st.underruns} (${st.underrunMs.toFixed(0)} ms)` : ''}\nKS cache ${st.ksBuffers} not = ${(st.ksBytes / 1048576).toFixed(2)} MB · limiter ${st.limiter?.toFixed(1) ?? '–'} dB`;
}, 100);
// Long-run load monitor (03 F.5): underruns since start, worst scheduler pump, voices peak, limiter, hidden time.
const monitor = {
  on: false,
  sample(st) {
    if (!this.on) return;
    const m = this.data;
    m.samples++;
    m.underruns = st.underruns != null ? st.underruns - m.underruns0 : null;
    m.underrunMs = st.underrunMs != null ? st.underrunMs - m.underrunMs0 : null;
    m.schedMax = Math.max(m.schedMax, st.schedMax);
    m.peak = Math.max(m.peak, st.voices);
    if (st.limiter != null && S.phase === 'flight') {
      m.limMin = Math.min(m.limMin, st.limiter);
      m.limSum += st.limiter;
      m.limN++;
    }
    if (document.hidden) m.hiddenSamples++;
    m.ksBytes = st.ksBytes;
    m.ksBuffers = st.ksBuffers;
    m.sec = ctx.currentTime - m.t0;
  },
  start() {
    const st = audio.stats();
    this.data = {
      t0: ctx.currentTime,
      started: new Date().toISOString(),
      ua: navigator.userAgent,
      underruns0: st.underruns ?? 0,
      underrunMs0: st.underrunMs ?? 0,
      samples: 0,
      hiddenSamples: 0,
      schedMax: 0,
      peak: 0,
      limMin: 0,
      limSum: 0,
      limN: 0,
    };
    this.on = true;
  },
  report() {
    const m = this.data;
    return m && { ...m, limAvg: m.limN ? m.limSum / m.limN : null };
  },
};
$('bench').onclick = async () => {
  $('bench-out').textContent = 'běží…';
  const rows = [];
  for (const id of TRACK_IDS) {
    const r = await benchmark(TRACKS[id], district(), 8);
    rows.push(
      `${ui.blind ? '?' : id} čtvrť ${r.district + 1}: 8 s za ${r.ms.toFixed(0)} ms = ${r.factor.toFixed(1)}× realtime · špička ${r.peak} hlasů · ${r.events} not`,
    );
    $('bench-out').textContent = rows.join('\n') + '\nběží…';
  }
  $('bench-out').textContent = rows.join('\n');
};
// ---------- loudness (03 F.4) ----------
const CALM = { screen: 'flight', combo: 3, hits: 3, speed: 1.2 },
  chans = b => [b.getChannelData(0), b.getChannelData(1)];
async function measureTrack(id, d, sec = 60, state = CALM, o = {}) {
  const b = await renderOffline(TRACKS[id], d, sec, { state, density: 0.7, place: 3, ...o });
  return { lufs: lufs(chans(b), b.sampleRate), peak: samplePeak(chans(b)), buffer: b };
}
// Effects over the music at the same moment: momentary loudness (400 ms) of the effect alone vs the music alone.
async function overMusic(id, d, state, fire, at = 6) {
  const opts = { state, density: 0.7, place: 3 },
    music = await renderOffline(TRACKS[id], d, 10, {
      ...opts,
      sfx: false,
      centres: state.centres,
      extra: api => fire(createSfx(api), at),
    }),
    fx = await renderOffline(TRACKS[id], d, 10, {
      ...opts,
      music: false,
      extra: api => fire(createSfx(api), at),
    });
  const m = momentaryAt(chans(music), music.sampleRate, at + 0.15),
    e = momentaryAt(chans(fx), fx.sampleRate, at + 0.15);
  return { music: m, effect: e, diff: e - m, effectPeak: samplePeak(chans(fx)) };
}
async function lufsAll(ids = TRACK_IDS, sec = 60) {
  const rows = [],
    out = $('lufs-out'),
    show = () => (out.textContent = rows.map(r => r.text).join('\n') + '\nběží…');
  for (const id of ids)
    for (let d = 0; d < 4; d++) {
      const r = await measureTrack(id, d, sec);
      rows.push({
        id,
        d,
        lufs: r.lufs,
        peak: r.peak,
        text: `${ui.blind ? '?' : id} čtvrť ${d + 1}: ${r.lufs.toFixed(1)} LUFS · vrchol ${r.peak.toFixed(1)} dBFS`,
      });
      show();
    }
  const extra = {};
  if (ids.includes('G')) {
    const calm = rows.find(r => r.id === 'G' && r.d === 0).lufs,
      ws = (await measureTrack('G', 0, sec, { screen: 'workshop' })).lufs,
      res = (await measureTrack('G', 0, sec, { screen: 'result' })).lufs,
      win = (await measureTrack('G', 0, sec, { ...CALM, event: 'window' })).lufs,
      perfect = await overMusic('G', 0, CALM, (s, t) => s.perfect(3, t)),
      tick = await overMusic('G', 0, { ...CALM, event: 'window', centres: [6] }, (s, t) =>
        s.tick(t),
      ),
      g = rows.filter(r => r.id === 'G').map(r => r.lufs);
    Object.assign(extra, {
      calm,
      workshop: ws,
      result: res,
      window: win,
      spread: Math.max(...g) - Math.min(...g),
      perfect,
      tick,
    });
    rows.push({
      text: [
        `G rozdíl čtvrtí ${extra.spread.toFixed(1)} LU`,
        `G Dílna ${(calm - ws).toFixed(1)} LU tišší, výsledek ${(calm - res).toFixed(1)} LU tišší než klidný let`,
        `G okno QTE ${(calm - win).toFixed(1)} LU tišší než klidný let`,
        `G perfekt nad hudbou ${perfect.diff.toFixed(1)} LU (momentary), tik nad hudbou v okně ${tick.diff.toFixed(1)} LU`,
      ].join('\n'),
    });
  }
  out.textContent = rows.map(r => r.text).join('\n');
  const result = { at: new Date().toISOString(), sec, rate: 48000, rows, extra };
  globalThis.musicProto.lufs = result;
  return result;
}
$('lufs').onclick = () => lufsAll();
// ---------- blind mode (03 F.6) ----------
for (const x of Object.keys(store.map)) {
  const b = document.createElement('button');
  b.textContent = x;
  b.dataset.x = x;
  b.onclick = () => {
    ui.x = x;
    pickX();
    applyMusic();
  };
  $('blind-picks').append(b);
}
const pickX = () => {
  for (const b of $('blind-picks').children) b.setAttribute('aria-pressed', b.dataset.x === ui.x);
};
pickX();
// Equal loudness: 30 s offline per candidate and district, trims cached in the store (localStorage).
async function equalize() {
  store.trims ??= {};
  const todo = DIRS.flatMap(id => [0, 1, 2, 3].map(d => [id, d])).filter(
    ([id, d]) => store.trims[id + d] == null,
  );
  for (const [i, [id, d]] of todo.entries()) {
    $('blind-status').textContent = `vyrovnávám hlasitost ${i + 1}/${todo.length}…`;
    const l = (await measureTrack(id, d, 30)).lufs;
    store.trims[id + d] = Number.isFinite(l) ? TARGET_LUFS - l : 0;
  }
  saveStore(store);
  $('blind-status').textContent = `vyrovnáno na ${TARGET_LUFS} LUFS`;
  applyMusic();
}
$('blind').onchange = async () => {
  ui.blind = $('blind').checked;
  $('dir').disabled = ui.blind;
  $('blind-picks').hidden = !ui.blind;
  showRatings();
  applyMusic();
  if (ui.blind) await equalize();
};
$('rate-form').innerHTML = CRITERIA.map(
  c =>
    `<span>${c.label}</span><select id="rc-${c.id}"><option value="">–</option>${[1, 2, 3, 4, 5].map(v => `<option>${v}</option>`).join('')}</select>`,
).join('');
let revealed = false;
$('rate-save').onclick = () => {
  const scores = {};
  for (const c of CRITERIA) {
    const v = Number($('rc-' + c.id).value);
    if (v) scores[c.id] = v;
  }
  if (!Object.keys(scores).length) return;
  store.ratings.push({
    x: ui.blind ? ui.x : null,
    dir: musicKey(),
    blind: ui.blind,
    district: audio.district,
    mode: S.on ? 'auto' : 'manual',
    at: new Date().toISOString(),
    scores,
    note: $('rate-note').value,
  });
  saveStore(store);
  for (const c of CRITERIA) $('rc-' + c.id).value = '';
  $('rate-note').value = '';
  showRatings();
};
$('reveal').onclick = () => {
  revealed = !revealed;
  showRatings();
};
$('new-session').onclick = () => {
  const seed = Date.now() % 100000;
  store.seed = seed;
  store.map = blindMap(seed);
  saveStore(store);
  revealed = false;
  showRatings();
  applyMusic();
};
$('export').onclick = () => {
  const blob = new Blob(
      [
        JSON.stringify(
          { exported: new Date().toISOString(), store, summary: summary(store) },
          null,
          1,
        ),
      ],
      { type: 'application/json' },
    ),
    a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'music-ratings.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
function showRatings() {
  const hide = ui.blind && !revealed,
    inv = Object.fromEntries(Object.entries(store.map).map(([x, d]) => [d, x]));
  const lines = store.ratings.slice(-8).map(
    r =>
      `${hide ? (r.x ?? '?') : r.dir}${r.x && !hide ? ' (' + r.x + ')' : ''} č${r.district + 1}: ${Object.entries(
        r.scores,
      )
        .map(([k, v]) => k + ' ' + v)
        .join(', ')}${r.note ? ' · ' + r.note : ''}`,
  );
  let out = `${store.ratings.length} hodnocení` + (lines.length ? '\n' + lines.join('\n') : '');
  if (!hide) {
    const s = summary(store);
    out +=
      '\n\nPrůměry:\n' +
      DIRS.filter(d => s[d])
        .map(
          d =>
            `${d}${ui.blind ? ' = ' + inv[d] : ''}: ` +
            CRITERIA.map(c => (s[d].scores[c.id] ? c.id + ' ' + s[d].scores[c.id].toFixed(1) : ''))
              .filter(Boolean)
              .join(', ') +
            (Object.keys(s[d].fatigue).length
              ? ' · únava ' +
                Object.entries(s[d].fatigue)
                  .map(([m, v]) => m + '. min ' + v)
                  .join(', ')
              : ''),
        )
        .join('\n');
    if (store.quiz?.length)
      out += `\nRozlišení čtvrtí: ${store.quiz.map(q => q.correct + '/4').join(', ')}`;
    if (store.motif?.length)
      out += `\nLeitmotiv: ${store.motif.map(q => (q.correct ? 'správně' : 'špatně')).join(', ')}`;
  }
  $('ratings').textContent = out;
}
showRatings();
function showQte() {
  const s = summary(store),
    rows = Object.entries(s)
      .filter(([, o]) => o.qteN)
      .map(
        ([d, o]) =>
          `${ui.blind && !revealed && d.length === 1 ? '?' : d}: ${o.qteN} událostí · zásah ${(o.hitRate * 100).toFixed(0)} % · perfekt ${(o.perfectRate * 100).toFixed(0)} %`,
      );
  $('qte-stats').textContent = rows.length
    ? rows.join('\n')
    : 'Zapni Auto flight v režimu „Hraju já“. Zásahy se počítají zvlášť pro každý směr a pro „off“ (ztlumeno / bez hudby), na stejných seedech.';
}
showQte();
// Block 2: which district is it? 4 × 45 s of Diorama in a seeded order, no picture, names hidden.
const QUIZ_SEC = 45,
  DAYTIME = ['ráno', 'poledne u moře', 'zlaté odpoledne', 'večer s lampiony'];
$('quiz').onclick = () => {
  if (ui.quiz) return stopQuiz();
  audio.unlock();
  ui.quiz = { order: quizOrder(store.seed + (store.quiz?.length ?? 0)), i: 0, t0: 0, answers: [] };
  ui.quiz.t0 = performance.now();
  canvas.style.visibility = 'hidden';
  $('quiz').textContent = '■ Přerušit blok 2';
  applyMusic();
  showQuiz();
};
function showQuiz() {
  const q = ui.quiz,
    box = $('quiz-box');
  box.hidden = false;
  box.innerHTML = `<b>Ukázka ${q.i + 1}/4</b> (${QUIZ_SEC} s): která denní doba to je? `;
  DAYTIME.forEach((name, d) => {
    const b = document.createElement('button');
    b.textContent = name;
    b.onclick = () => {
      q.answers.push(d);
      if (++q.i >= 4) finishQuiz();
      else {
        q.t0 = performance.now();
        applyMusic();
        showQuiz();
      }
    };
    box.append(b);
  });
}
function finishQuiz() {
  const q = ui.quiz,
    correct = q.answers.filter((a, i) => a === q.order[i]).length;
  (store.quiz ??= []).push({
    at: new Date().toISOString(),
    order: q.order,
    answers: q.answers,
    correct,
  });
  saveStore(store);
  stopQuiz(`hotovo: ${correct}/4 správně`);
}
function stopQuiz(msg = 'přerušeno') {
  ui.quiz = null;
  canvas.style.visibility = '';
  $('quiz').textContent = '▶ Blok 2: rozlišení čtvrtí';
  $('quiz-box').hidden = true;
  $('quiz-status').textContent = msg;
  applyMusic();
  showRatings();
}
setInterval(() => {
  if (!ui.quiz) return;
  const left = QUIZ_SEC - (performance.now() - ui.quiz.t0) / 1000;
  $('quiz-status').textContent =
    left > 0 ? `zbývá ${Math.ceil(left)} s` : 'čas vypršel, vyber odpověď';
}, 250);
// Block 4: leitmotif, three short melodies on the same instrument in a seeded order.
const motifPlays = () => motifQuiz(store.seed + (store.motif?.length ?? 0));
$('motif').onclick = () => {
  audio.unlock();
  const q = motifPlays(),
    box = $('motif-box');
  box.hidden = false;
  box.innerHTML = '<b>Která je melodie vlaštovky, kterou už znáš?</b> ';
  q.items.forEach((it, k) => {
    const play = document.createElement('button');
    play.textContent = `▶ Z${k + 1}`;
    play.onclick = () => playMelody(it.notes);
    const pick = document.createElement('button');
    pick.textContent = `vybrat Z${k + 1}`;
    pick.onclick = () => {
      (store.motif ??= []).push({
        at: new Date().toISOString(),
        order: q.items.map(i => i.kind),
        pick: q.items[k].kind,
        correct: q.items[k].kind === 'theme',
      });
      saveStore(store);
      box.hidden = true;
      showRatings();
    };
    box.append(play, pick);
  });
};
// Same instrument and tempo for all three melodies (a beat = 0.55 s).
function playMelody(notes) {
  const t = ctx.currentTime + 0.1,
    spb = 0.55;
  audio.cue('jingle', t);
  for (const n of notes)
    sfx.note({ i: 'musicbox', n: n.n, d: n.d * spb, v: 0.7, o: { dec: 0.9 } }, t + n.b * spb);
}
// ---------- fatigue test ----------
const fat = { on: false, t: 0, asked: new Set(), dir: null, x: null, ask: [], kind: 'fatigue' };
const ASK = { fatigue: [1, 5, 10], block3: [0.02, 3.5] };
function startFatigue(kind) {
  if (fat.on) {
    stopFatigue('přerušeno');
    return;
  }
  Object.assign(fat, {
    on: true,
    t: 0,
    asked: new Set(),
    dir: musicKey(),
    x: ui.blind ? ui.x : null,
    kind,
    ask: ASK[kind],
  });
  $(kind === 'block3' ? 'block3' : 'fatigue').textContent = '■ Přerušit';
  $('dir').disabled = true;
  $('blind').disabled = true;
  if (!S.on) setAuto(true);
}
$('fatigue').onclick = () => startFatigue('fatigue');
$('block3').onclick = () => {
  if (!fat.on) {
    ui.follow = false;
    $('follow').checked = false;
    ui.district = 2;
    $('district').value = 2;
    ui.place = 3;
    $('place').value = 4;
    $('place').oninput();
    applyMusic();
  }
  startFatigue('block3');
};
function fatigueStep(dt) {
  fat.t += dt;
  const m = fat.t / 60,
    total = fat.ask.at(-1);
  $('fatigue-status').textContent =
    `${Math.floor(fat.t / 60)}:${String(Math.floor(fat.t % 60)).padStart(2, '0')} / ${Math.floor(total)}:${String(Math.round((total % 1) * 60)).padStart(2, '0')} · ${fat.x ?? (ui.blind ? '?' : fat.dir)} · čtvrť ${district() + 1}`;
  for (const q of fat.ask)
    if (m >= q && !fat.asked.has(q)) {
      fat.asked.add(q);
      ask(q);
    }
}
function ask(minute) {
  const box = $('fatigue-ask'),
    keep = fat.kind === 'block3';
  box.hidden = false;
  box.innerHTML = keep
    ? `<b>${minute < 1 ? 'Začátek' : minute + '. minuta'}:</b> nechal bys ji zapnutou? `
    : `<b>${minute}. minuta:</b> jak moc tě hudba unavuje? `;
  for (let v = 1; v <= 5; v++) {
    const b = document.createElement('button');
    b.textContent =
      v +
      (keep
        ? v === 1
          ? ' ne'
          : v === 5
            ? ' určitě'
            : ''
        : v === 1
          ? ' vůbec'
          : v === 5
            ? ' vypnul bych'
            : '');
    b.onclick = () => {
      store.fatigue.push({
        dir: fat.dir,
        x: fat.x,
        minute,
        kind: fat.kind,
        score: keep ? v : 6 - v,
        raw: v,
        district: district(),
        at: new Date().toISOString(),
      });
      saveStore(store);
      box.hidden = true;
      showRatings();
      if (minute === fat.ask.at(-1)) stopFatigue('hotovo');
    };
    box.append(b);
  }
}
function stopFatigue(why) {
  fat.on = false;
  $('fatigue').textContent = '▶ Spustit únavový test (10 min)';
  $('block3').textContent = '▶ Blok 3: únava 3:30 (čtvrť 3, místo 4)';
  $('dir').disabled = ui.blind;
  $('blind').disabled = false;
  $('fatigue-status').textContent += ` · ${why}`;
}
// ---------- own file ----------
async function useFile(file) {
  if (!file) return;
  audio.unlock();
  try {
    const info = await audio.playFile(await file.arrayBuffer(), file.name);
    ui.dir = 'file';
    $('dir').value = 'file';
    $('file-out').textContent =
      `${file.name} · ${info.duration.toFixed(1)} s, smyčka přes stejný filtr a ducking (bez vrstev)`;
  } catch (err) {
    $('file-out').textContent = 'Soubor nejde dekódovat: ' + err.message;
  }
}
const drop = $('drop');
drop.ondragover = e => {
  e.preventDefault();
  drop.classList.add('over');
};
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = e => {
  e.preventDefault();
  drop.classList.remove('over');
  useFile(e.dataTransfer.files[0]);
};
$('file').onchange = () => useFile($('file').files[0]);
nextFrame(frame);
// Debug and measurement handle for console checks.
globalThis.musicProto = {
  audio,
  sfx,
  S,
  ui,
  store,
  lufsAll,
  measureTrack,
  overMusic,
  monitor,
  setAuto,
};
