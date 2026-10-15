// Music step 4: the game drives Diorama and the effects through game-audio.js (one frame() per frame), the context is
// created on the first gesture only when sound is wanted, and the page lifecycle sleeps / wakes it. Fake AudioContext.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fakeContext } from './helpers/fake-audio.js';
import { createAudio, bindLifecycle, loadAudioSettings, AUDIO_KEY } from '../src/audio.js';
import { createSfx } from '../src/sfx.js';
import {
  audioScreen,
  phaseOf,
  intensityOf,
  audioSettings,
  AUDIO_DEFAULTS,
  mixTargets,
} from '../src/audio-mix.js';
import {
  createGameAudio,
  audioFlags,
  wantsSound,
  wavHeader,
  GAME_TRACK,
} from '../src/game-audio.js';
import { fresh, flightFor, advance, flightInput, activeEvent } from '../src/core.js';
import { SECTION_METERS } from '../src/scenes.js';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const wait = ms => new Promise(r => setTimeout(r, ms));
const page = (hidden = false) => ({
  win: new EventTarget(),
  doc: Object.assign(new EventTarget(), { hidden }),
});

test('audioScreen: menu and Settings = Workshop, Atlas own, Pause = frozen flight, landed = Result, finale', () => {
  assert.equal(audioScreen({ screen: 'home', title: true }), 'workshop');
  assert.equal(audioScreen({ screen: 'home', title: false }), 'aim');
  assert.equal(audioScreen({ screen: 'home', panels: ['menu'] }), 'workshop');
  assert.equal(audioScreen({ screen: 'home', panels: ['settings'] }), 'workshop');
  assert.equal(audioScreen({ screen: 'home', panels: ['workshop'] }), 'workshop');
  assert.equal(audioScreen({ screen: 'result', panels: ['menu', 'atlas'] }), 'atlas');
  assert.equal(audioScreen({ screen: 'flight' }), 'flight');
  assert.equal(audioScreen({ screen: 'flight', panels: ['pause', 'settings'] }), 'flight');
  assert.equal(audioScreen({ screen: 'flight', landed: true }), 'result');
  assert.equal(audioScreen({ screen: 'result' }), 'result');
  assert.equal(audioScreen({ screen: 'chapter', finale: true }), 'finale');
  assert.equal(audioScreen({ screen: 'loading' }), 'workshop');
});
test('Atlas plays like the Workshop (intensity 1, bed only); phases and levels follow map E.2', () => {
  assert.deepEqual(
    mixTargets({ screen: 'atlas' }).layers,
    mixTargets({ screen: 'workshop' }).layers,
  );
  assert.ok(mixTargets({ screen: 'atlas' }).layers[0] > 0);
  const lv = s => [phaseOf(s), intensityOf(s)];
  assert.deepEqual(lv({ screen: 'workshop' }), ['workshop', 1]);
  assert.deepEqual(lv({ screen: 'atlas' }), ['workshop', 1]);
  assert.deepEqual(lv({ screen: 'aim' }), ['aim', 2]);
  assert.deepEqual(lv({ screen: 'flight', hits: 0, speed: 1 }), ['throw', 2]);
  assert.deepEqual(lv({ screen: 'flight', hits: 1, combo: 1 }), ['calm', 2]);
  assert.deepEqual(lv({ screen: 'flight', hits: 2, combo: 2 }), ['calm', 3]);
  assert.deepEqual(lv({ screen: 'flight', event: 'warning' }), ['warning', 1]);
  assert.deepEqual(lv({ screen: 'flight', event: 'window' }), ['window', 1]);
  assert.deepEqual(lv({ screen: 'result' }), ['result', 1]);
  assert.deepEqual(lv({ screen: 'finale' }), ['finale', 3]);
});
test('flags, wantsSound and the WAV header', () => {
  assert.deepEqual(audioFlags('?audio=debug'), { debug: true, rec: false });
  assert.deepEqual(audioFlags('?audio=debug,rec'), { debug: true, rec: true });
  assert.deepEqual(audioFlags('?audio=rec&lang=cs'), { debug: false, rec: true });
  assert.deepEqual(audioFlags(''), { debug: false, rec: false });
  assert.equal(wantsSound(AUDIO_DEFAULTS), true);
  assert.equal(wantsSound({ ...AUDIO_DEFAULTS, muted: true }), false);
  assert.equal(wantsSound({ ...AUDIO_DEFAULTS, music: 0, sfx: 0 }), false);
  const h = new DataView(wavHeader(1000, 48000, 2, 16)),
    s = (o, n) => String.fromCharCode(...new Uint8Array(h.buffer, o, n));
  assert.equal(s(0, 4) + s(8, 4) + s(12, 4) + s(36, 4), 'RIFFWAVEfmt data');
  assert.equal(h.getUint16(20, true), 1);
  assert.equal(h.getUint16(22, true), 2);
  assert.equal(h.getUint32(24, true), 48000);
  assert.equal(h.getUint32(40, true), 4000);
  assert.equal(h.getUint32(4, true), 4036);
});

// ---------- settings: validation and persistence (own localStorage key, not the game save) ----------
function withStorage(init, fn) {
  const m = new Map(init),
    saved = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: k => m.delete(k),
    },
  });
  try {
    return fn(m);
  } finally {
    if (saved) Object.defineProperty(globalThis, 'localStorage', saved);
    else delete globalThis.localStorage;
  }
}
test('audio settings: defaults 60 / 80 %, out of range or garbage = default, the game save is untouched', () => {
  withStorage([], () => assert.deepEqual(loadAudioSettings(), AUDIO_DEFAULTS));
  withStorage([[AUDIO_KEY, '{oops']], () => assert.deepEqual(loadAudioSettings(), AUDIO_DEFAULTS));
  withStorage([[AUDIO_KEY, JSON.stringify({ music: 1.7, sfx: -0.2, muted: 'yes' })]], () =>
    assert.deepEqual(loadAudioSettings(), AUDIO_DEFAULTS),
  );
  withStorage([[AUDIO_KEY, JSON.stringify({ music: 0.25, sfx: 1, muted: true })]], () =>
    assert.deepEqual(loadAudioSettings(), { ...AUDIO_DEFAULTS, music: 0.25, sfx: 1, muted: true }),
  );
  assert.deepEqual(audioSettings({ music: 0, sfx: 0 }), { ...AUDIO_DEFAULTS, music: 0, sfx: 0 });
  const save = JSON.stringify({ v: 5, best: 749, coins: 12 });
  withStorage([['just-throw-it-v1', save]], m => {
    const ga = createGameAudio({ ...page(), search: '' });
    ga.set({ music: 0.35 });
    ga.set({ muted: true });
    assert.equal(m.get('just-throw-it-v1'), save, 'game save untouched');
    assert.deepEqual(JSON.parse(m.get(AUDIO_KEY)), { ...AUDIO_DEFAULTS, music: 0.35, muted: true });
    // "Reload": a new instance reads the same choice.
    const again = createGameAudio({ ...page(), search: '' });
    assert.equal(again.settings.muted, true);
    assert.equal(again.settings.music, 0.35);
  });
});

// ---------- lazy context ----------
function harness(settings = AUDIO_DEFAULTS, hidden = false) {
  const { win, doc } = page(hidden),
    made = [],
    calls = [];
  const ga = createGameAudio({
    win,
    doc,
    search: '',
    settings,
    makeAudio: () => {
      const ctx = fakeContext();
      ctx.state = 'suspended'; // a context made before the gesture starts suspended
      const a = createAudio({ ctx, autoUnlock: false, autoStart: false });
      made.push(a);
      return a;
    },
    makeSfx: a => {
      const real = createSfx(a);
      return new Proxy(real, {
        get: (t, k) =>
          typeof t[k] === 'function'
            ? (...x) => {
                calls.push([k, ...x]);
                return t[k](...x);
              }
            : t[k],
      });
    },
  });
  return { ga, win, doc, made, calls };
}
test('no AudioContext before the first gesture, none at all while muted; unmuting creates and unlocks it', () => {
  const h = harness();
  h.ga.frame({ screen: 'home', title: true, panels: [], best: 0 });
  assert.equal(h.made.length, 0, 'nothing before a gesture');
  h.win.dispatchEvent(new Event('pointerdown'));
  assert.equal(h.made.length, 1);
  assert.equal(h.ga.engine.ctx.state, 'running', 'resumed inside the gesture');
  h.win.dispatchEvent(new Event('keydown'));
  assert.equal(h.made.length, 1, 'one context only');
  h.ga.frame({ screen: 'home', title: true, panels: [], best: 0 });
  assert.equal(h.ga.engine.track?.id, GAME_TRACK, 'Diorama plays in the game');

  const m = harness({ ...AUDIO_DEFAULTS, muted: true });
  m.win.dispatchEvent(new Event('pointerdown'));
  m.ga.frame({ screen: 'home', title: true, panels: [], best: 0 });
  assert.equal(m.made.length, 0, 'muted: no context');
  m.ga.set({ music: 0.4 });
  assert.equal(m.made.length, 0, 'still muted');
  m.ga.set({ muted: false });
  assert.equal(m.made.length, 1, 'unmute (a click) creates it');
  assert.equal(m.ga.engine.ctx.state, 'running');
});
test('the Settings controls: sliders 0–100 in steps, "Muted" disables them, values show as percent', () => {
  const el = () => {
    const e = new EventTarget();
    return Object.assign(e, {
      value: '',
      disabled: false,
      checked: false,
      textContent: '',
      setAttribute() {},
    });
  };
  const els = { music: el(), sfx: el(), mute: el(), musicOut: el(), sfxOut: el() },
    ga = createGameAudio({
      ...page(),
      search: '',
      settings: AUDIO_DEFAULTS,
      els,
      makeAudio: () => null,
    });
  assert.equal(els.music.value, '60');
  assert.equal(els.sfx.value, '80');
  assert.match(els.musicOut.textContent, /^60\s?%$/);
  els.music.value = '35';
  els.music.dispatchEvent(new Event('input'));
  assert.equal(ga.settings.music, 0.35);
  els.mute.checked = true;
  els.mute.dispatchEvent(new Event('change'));
  assert.equal(ga.settings.muted, true);
  assert.equal(els.music.disabled, true);
  assert.equal(els.sfxOut.textContent, 'Muted');
});

// ---------- lifecycle ----------
function lifecycle(hidden = false) {
  const ctx = fakeContext(),
    a = createAudio({ ctx, autoUnlock: false, autoStart: false }),
    p = page(hidden);
  bindLifecycle(a, p);
  return { ctx, a, ...p };
}
test('hidden tab or pagehide: master fades to 0 and the context suspends; visible again: resume and fade in', async () => {
  const { ctx, a, win, doc } = lifecycle();
  win.dispatchEvent(new Event('pointerdown'));
  assert.equal(ctx.state, 'running');
  doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(a.g.master.gain.events.at(-1).v, 0, 'faded before suspend');
  await wait(90);
  assert.equal(ctx.state, 'suspended');
  doc.hidden = false;
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(ctx.state, 'running');
  assert.ok(a.g.master.gain.events.at(-1).v > 0, 'fade in');
  win.dispatchEvent(new Event('pagehide'));
  await wait(90);
  assert.equal(ctx.state, 'suspended');
  win.dispatchEvent(new Event('pageshow'));
  assert.equal(ctx.state, 'running');
});
test('a visible page that was never tapped does not resume; mute keeps it asleep after the tab returns', async () => {
  const { ctx, a, win, doc } = lifecycle();
  ctx.state = 'suspended';
  doc.dispatchEvent(new Event('visibilitychange'));
  win.dispatchEvent(new Event('focus'));
  assert.equal(ctx.state, 'suspended', 'no gesture yet');
  win.dispatchEvent(new Event('pointerdown'));
  assert.equal(ctx.state, 'running');
  a.setSettings({ muted: true });
  await wait(90);
  assert.equal(ctx.state, 'suspended');
  doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  doc.hidden = false;
  doc.dispatchEvent(new Event('visibilitychange'));
  win.dispatchEvent(new Event('pointerdown'));
  assert.equal(ctx.state, 'suspended', 'muted stays asleep');
  a.setSettings({ muted: false });
  assert.equal(ctx.state, 'running');
  a.setSettings({ muted: false });
});
test('iOS interruption: "interrupted" is counted, the next gesture or focus resumes; a system suspend is resumed', () => {
  const { ctx, a, win } = lifecycle();
  win.dispatchEvent(new Event('pointerdown'));
  ctx.blockResume = true;
  ctx.setState('interrupted');
  assert.equal(a.interruptions, 1);
  assert.equal(ctx.state, 'interrupted');
  ctx.blockResume = false;
  win.dispatchEvent(new Event('focus'));
  assert.equal(ctx.state, 'running', 'focus retries');
  ctx.blockResume = true;
  ctx.setState('interrupted');
  ctx.blockResume = false;
  win.dispatchEvent(new Event('touchend'));
  assert.equal(ctx.state, 'running', 'a gesture retries');
  ctx.setState('suspended');
  assert.equal(ctx.state, 'running', 'suspended by the system while it should play → resume');
});
test('a page loaded hidden starts asleep; the scheduler keeps no state across sleeps (no stuck notes)', async () => {
  const { ctx, a, win, doc } = lifecycle(true);
  win.dispatchEvent(new Event('pointerdown'));
  assert.equal(a.asleep.has('hidden'), true);
  await wait(90);
  assert.notEqual(ctx.state, 'running');
  doc.hidden = false;
  doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(ctx.state, 'running');
});

// ---------- the director on a real flight ----------
// Bot like the prototype: presses exactly on each centre (bird: holds at the open, lets go on the centre).
function bot(f) {
  const e = activeEvent(f);
  if (!e || e.result || e.phase !== 'interaction' || !e.w) return;
  if (e.type === 'bird') {
    if (e.heldAt === null) flightInput(f, 'down');
    else if (f.t >= e.heldAt + e.w.c) flightInput(f, 'up');
    return;
  }
  const c = Array.isArray(e.w.c) ? e.w.c[e.puff ?? 0] : e.w.c;
  if (f.t >= c) {
    flightInput(f, 'down');
    flightInput(f, 'up');
  }
}
function play(h, f, { best = 0, hitstop = 0 } = {}) {
  const ctx = h.ga.engine.ctx,
    dt = 1 / 60,
    ticks = [],
    centres = [];
  let acc = 0,
    frozen = 0,
    seen = 0;
  const stopped = new Set();
  for (let k = 0; k < 60 * 120 && !(f.landed && frozen <= 0 && k > 0 && seen++ > 60); k++) {
    ctx.currentTime = Math.round((ctx.currentTime + dt) * 1e6) / 1e6;
    const e = activeEvent(f);
    if (frozen > 0) frozen--;
    else {
      bot(f);
      ({ acc } = advance(f, acc, dt, false));
    }
    // Worst case for the tick: physics freezes inside the window, after the tick was planned.
    if (hitstop && e?.phase === 'interaction' && !e.result && !stopped.has(e)) {
      stopped.add(e);
      frozen = hitstop;
    }
    // Audio time at which the flight passes each centre (the tick must sound there, latency 0).
    if (e?.w && !e.result) {
      const cs =
        e.type === 'bird' ? (e.heldAt != null ? [e.heldAt + e.w.c] : []) : [].concat(e.w.c);
      for (const c of cs)
        if (f.t >= c && f.t - dt * 1.01 < c && !centres.some(x => x.c === c))
          centres.push({ c, at: ctx.currentTime - (f.t - c) });
    }
    h.ga.frame({ screen: 'flight', title: false, panels: [], f, acc, best, completed: false });
    h.ga.engine.pump();
  }
  for (const [k, when] of h.calls) if (k === 'tick') ticks.push(when);
  return { ticks, centres };
}
function started(best = 0) {
  const h = harness();
  h.win.dispatchEvent(new Event('pointerdown'));
  h.ga.frame({
    screen: 'home',
    title: false,
    panels: [],
    best,
    held: true,
    heldMs: 400,
    charge: 0.7,
  });
  return h;
}
test('a whole flight: charge, throw, one sound per resolved event, ticks on the centres, landing once', () => {
  const h = started(),
    p = fresh(),
    f = flightFor(p, 25, 0.9);
  assert.ok(
    h.calls.some(([k]) => k === 'charge'),
    'charge tone while holding',
  );
  const { ticks, centres } = play(h, f);
  const n = k => h.calls.filter(([x]) => x === k).length;
  assert.equal(n('throw'), 1);
  assert.equal(n('chargeStop') >= 1, true);
  const resolved = f.events.filter(e =>
    ['success', 'perfect', 'miss', 'partial', 'half'].includes(e.result),
  );
  assert.ok(resolved.length >= 2, 'the tutorial flight has events');
  assert.equal(n('success') + n('perfect') + n('miss'), resolved.length);
  assert.equal(n('land'), 1);
  assert.ok(ticks.length >= resolved.length, 'every event got a tick');
  for (const { at } of centres)
    assert.ok(
      ticks.some(t => Math.abs(t - at) < 0.03),
      `tick within 30 ms of the centre at ${at.toFixed(3)} (${ticks.map(t => t.toFixed(3))})`,
    );
});
test('hitstop freezes only the physics: a planned tick is re-planned and still lands on the centre in audio time', () => {
  const h = started(),
    f = flightFor(fresh(), 25, 0.9),
    { ticks, centres } = play(h, f, { hitstop: 6 });
  assert.ok(centres.length >= 2);
  assert.ok(
    h.calls.filter(([k]) => k === 'tick').length > centres.length,
    're-planned after the freeze',
  );
  for (const { at } of centres)
    assert.ok(
      ticks.some(t => Math.abs(t - at) < 0.03),
      at.toFixed(3),
    );
});
test('a new district in flight switches in calm with a stinger; the Result plays its jingle; the finale once', async () => {
  const h = started(),
    f = flightFor(fresh(), 25, 0.9);
  f.x = SECTION_METERS - 20;
  play(h, f, { best: 0 });
  const a = h.ga.engine;
  assert.ok(a.district === 1 || a.pending?.district === 1, 'Bright Harbor follows');
  // Result after the landing: best now in district 1 → the full jingle on the card.
  h.ga.frame({ screen: 'result', panels: [], f, best: f.x, completed: false });
  assert.equal(h.calls.filter(([k]) => k === 'jingle').length, 1);
  assert.equal(h.calls.find(([k]) => k === 'jingle')[1], 1);
  h.ga.frame({ screen: 'result', panels: [], f, best: f.x, completed: false });
  assert.equal(h.calls.filter(([k]) => k === 'jingle').length, 1, 'once per card');
  // A known district again: a boundary below the frontier does nothing.
  const g = flightFor(fresh(), 25, 0.9);
  g.x = SECTION_METERS - 20;
  const before = h.calls.filter(([k]) => k === 'stinger').length;
  h.ga.frame({ screen: 'home', panels: [], best: SECTION_METERS * 1.5 });
  play(h, g, { best: SECTION_METERS * 1.5 });
  assert.equal(a.pending?.stinger ?? false, false);
  await wait(5);
  assert.equal(h.calls.filter(([k]) => k === 'stinger').length, before, 'revisit: no stinger');
  // Finale: completed turns true on this card → the finale cue, not a jingle.
  const z = flightFor(fresh(), 25, 0.9);
  h.ga.frame({ screen: 'home', panels: [], best: 4000, completed: false });
  play(h, z, { best: 4000 });
  h.ga.frame({ screen: 'result', panels: [], f: z, best: 4900, completed: true });
  assert.equal(a.cueing?.name, 'finale');
  assert.equal(h.ga.state.screen, 'finale');
});
test('pause over a flight cancels the planned tick and the wind; the game is silent but runs without a context', () => {
  const h = started(),
    f = flightFor(fresh(), 25, 0.9);
  let acc = 0;
  for (let k = 0; k < 600 && !(activeEvent(f)?.phase === 'interaction'); k++) {
    h.ga.engine.ctx.currentTime += 1 / 60;
    ({ acc } = advance(f, acc, 1 / 60));
    h.ga.frame({ screen: 'flight', panels: [], f, acc, best: 0 });
  }
  h.ga.frame({ screen: 'flight', panels: ['pause'], f, acc, best: 0 });
  assert.deepEqual(h.ga.state.centres, [], 'no mask while paused');
  assert.equal(h.calls.at(-1)?.[0] === 'wind' ? h.calls.at(-1)[1] : 0, 0);
  const silent = createGameAudio({ ...page(), search: '', settings: { muted: true } });
  assert.doesNotThrow(() => {
    silent.frame({ screen: 'flight', panels: [], f, acc, best: 0 });
    silent.frame({ screen: 'result', panels: [], f, best: 10 });
  });
  assert.equal(silent.engine, null);
});
test('one place drives the audio: ui.js calls gameAudio.frame once, before rendering; game logic and render3d untouched', () => {
  const ui = read('src/ui.js'),
    ga = read('src/game-audio.js');
  assert.equal((ui.match(/gameAudio\.frame\(\{/g) ?? []).length, 1);
  assert.ok(
    ui.indexOf('gameAudio.frame({') < ui.search(/render\(\s*\$\('game'\)/),
    'audio before the render call',
  );
  assert.ok(!/render3d|three/.test(ga), 'no renderer in game-audio');
  for (const p of [
    'src/core.js',
    'src/events.js',
    'src/flight.js',
    'src/throw.js',
    'src/scenes.js',
  ])
    assert.ok(!/game-audio|audio\.js|AudioContext/.test(read(p)), p + ' knows nothing about audio');
  assert.ok(!/createAudio\(|new AudioContext/.test(ui), 'ui.js has no Web Audio of its own');
  // Space in an open panel belongs to its controls (Mute all toggles on keyup), the game keyup must not prevent it.
  assert.match(
    ui.slice(ui.indexOf("addEventListener('keyup'")).split('\n')[2],
    /otherButton\(e\) \|\| S\.panels\.length\) return/,
  );
});
test('the silence mask sits around the planned tick, which is early by the output latency (and the calibration)', () => {
  const ctx = Object.assign(fakeContext(), { outputLatency: 0.2 }),
    a = createAudio({ ctx, autoUnlock: false, autoStart: false }),
    near = (x, y) => Math.abs(x - y) < 1e-9;
  a.update({ screen: 'flight', event: 'window', centres: [1], flightT: 0 });
  assert.ok(near(a.mask[0][0], 0.68) && near(a.mask[0][1], 0.92), JSON.stringify(a.mask));
  a.setSettings({ latency: 0.05 }); // calibration: + = later
  a.update({ screen: 'flight', event: 'window', centres: [1], flightT: 0 });
  assert.ok(near(a.mask[0][0], 0.73), JSON.stringify(a.mask));
  a.setSettings({ latency: 0 });
});
