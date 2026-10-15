import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createDirector,
  direct,
  excessOf,
  excessZoom,
  launchEase,
  EXCESS,
  EASE,
  LAUNCH,
  CRUISE,
  ZOOM_RANGE,
} from '../src/render3d/camera.js';
import { planFrame, directorFor, paceOf, cruiseOf, calmOf, CAMERA } from '../src/render3d/frame.js';
import { tempoZoom } from '../src/render3d/geometry.js';
import { createFlight, step } from '../src/core.js';
import { eventInput } from '../src/core.js';
import { autoInput } from './helpers/auto-input.js';

// S1 kamera letu (research/start/01 §3.3–§3.4): šířka z přebytku rychlosti nad cestovní rychlostí výbavy a z tempa π.
const DT = 1 / 60,
  near = (a, b, eps, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg}: ${a} vs ${b}`);
const flyer = (o = {}) => createDirector({ width: 120, ...o });
// Synthetic flight without events: v(t) speed profile, y high (no short-flight rule).
function glide(
  vOf,
  { s = flyer(), t0 = 0, T = 6, f = null, dive = () => false, y = () => 40, vy = () => 0 } = {},
) {
  const out = [];
  for (let t = t0; t < t0 + T - 1e-9; t += DT) {
    direct(s, {
      x: 200 + t * 15,
      y: y(t),
      v: vOf(t),
      vy: vy(t),
      t,
      dt: DT,
      flying: true,
      f,
      dive: dive(t),
    });
    out.push({ t, ex: s.ex, goal: s.exGoal, w: s.camera.width });
  }
  return { s, out };
}

test('excess: s = max(0,(vx − c)/c), W × (1 + 0,35·smooth(s/0,8)); Dart throw ≈ +34 %, at cruise nothing, Dive capped at +10 %', () => {
  near(excessOf(19, 11), 8 / 11, 1e-12, 'Dart s');
  assert.equal(excessOf(9, 11), 0);
  assert.equal(excessOf(30, 0), 0);
  near(excessZoom(excessOf(19, 11)), 1.34, 0.01, 'Dart throw');
  assert.equal(excessZoom(0), 1);
  assert.equal(excessZoom(5), 1 + EXCESS.A);
  assert.equal(excessZoom(1, 1 + EXCESS.dive), 1.1);
  near(excessZoom(0.14), 1 + 0.35 * 0.0858, 0.002, 'push 1,5 → ~+3 %');
  assert.equal(launchEase(0), 0);
  assert.equal(launchEase(1), 1);
  assert.ok(launchEase(0.5) > 0.5, 'ease-out');
});
test('pace π and cruise from the kit: frame.js passes real k and c (no k:1), Calm and reduced motion share the camera rule', () => {
  const f = createFlight('dart', undefined, 4);
  assert.equal(paceOf(f), 1);
  assert.equal(cruiseOf(f), f.cruise); // M2: let hry nese π v f.d.pi a cestovní rychlost v f.cruise
  const g = { ...f, d: { pi: 2 }, cruise: 30 };
  assert.equal(paceOf(g), 2);
  assert.equal(cruiseOf(g), 30);
  assert.equal(cruiseOf({ p: { cruise: 11 } }, 1.5), 16.5);
  assert.equal(calmOf({ reduced: true }), true);
  assert.equal(calmOf({ settings: { calm: true } }), true);
  assert.equal(calmOf({}), false);
  for (const pi of [1, 2, 6]) {
    const h = { ...f, events: [], d: { pi }, cruise: 11 * pi, vx: 19 * pi },
      c = directorFor({ f: h }).camera;
    near(
      c.width,
      (CAMERA.width * excessZoom(excessOf(19, 11))) / tempoZoom(pi),
      1e-9,
      `π ${pi}: same excess, wider by T(π)`,
    );
  }
  const calm = directorFor({
    f: { ...f, events: [], d: { pi: 6 }, cruise: 66, vx: 200 },
    visual: { reduced: true },
  }).camera;
  near(calm.width, CAMERA.width / tempoZoom(6), 1e-9, 'reduced = W_let·T');
});
test('asymmetric easing: out ≤ 0,8 ln/s, in ≤ 0,25 ln/s and slower half-life; back to W_let after slowing down', () => {
  const { out } = glide(t => (t < 1 ? 11 : t < 1.05 ? 30 : 11), { T: 12 });
  let maxOut = 0,
    maxIn = 0;
  for (let i = 1; i < out.length; i++) {
    const d = Math.log(out[i].ex / out[i - 1].ex) / DT;
    maxOut = Math.max(maxOut, d);
    maxIn = Math.min(maxIn, d);
  }
  assert.ok(maxOut <= EASE.out.rate + 1e-9 && maxOut > 0.5, `out ${maxOut}`);
  assert.ok(-maxIn <= EASE.in.rate + 1e-9 && -maxIn > 0.05, `in ${maxIn}`);
  const peak = out.findIndex(o => o.ex === Math.max(...out.map(p => p.ex))),
    up = out[peak].t - 1,
    down = out.findIndex((o, i) => i > peak && o.ex < 1.01);
  assert.ok(up < 1, `zooms out within 1 s (${up})`);
  assert.ok(down > 0 && out[down].t - out[peak].t > 2 * up, 'zooms back in much slower');
});
test('dead band: target changes under 5 % are ignored; hysteresis: no direction change within 0,6 s', () => {
  const { out } = glide(t => 16 + 0.3 * Math.sin(t * 9), { T: 4 });
  const goals = new Set(out.slice(1).map(o => o.goal));
  assert.equal(goals.size, 1, 'wind wobble does not breathe');
  const { s } = glide(() => 16, { T: 2 });
  const g0 = s.exGoal;
  direct(s, { x: 300, y: 40, v: 22, t: 2, dt: DT, flying: true });
  const up = s.exGoal;
  assert.ok(up > g0 * 1.05, 'big change is taken');
  direct(s, { x: 301, y: 40, v: 12, t: 2.3, dt: DT, flying: true });
  assert.equal(s.exGoal, up, 'reverse within 0,6 s is held');
  direct(s, { x: 302, y: 40, v: 12, t: 2.65, dt: DT, flying: true });
  assert.ok(s.exGoal < up, 'reverse after 0,6 s');
});
test('no zoom-out start less than 0,8 s before an event; Dive locks the excess zoom at +10 %; short flight freezes the launch pull-out', () => {
  const f = {
    t: 0,
    landed: false,
    events: [{ type: 'gust', at: 3.5, gap: 3, phase: 'waiting', result: null }],
  };
  const { s } = glide(t => ((f.t = t), 11), { T: 2.9, f });
  direct(s, { x: 300, y: 40, v: 25, t: 2.9, dt: DT, flying: true, f: { ...f, t: 2.9 } });
  assert.equal(s.exGoal, 1, '0,6 s before the event: held');
  direct(s, { x: 300, y: 40, v: 25, t: 2.9, dt: DT, flying: true });
  assert.ok(s.exGoal > 1.3, 'without the event it zooms out');
  const { out } = glide(() => 40, { T: 3, dive: () => true });
  assert.ok(
    out.every(o => o.ex <= 1 + EXCESS.dive + 1e-12),
    'Dive cap',
  );
  const r = createDirector({ width: 120 });
  direct(r, { x: 70, y: 16, t: 0, dt: 0, flying: false });
  for (let i = 0; i < 40; i++) {
    const t = i * DT;
    direct(r, {
      x: 70 + t * 15,
      y: i < 20 ? 10 : 2.5,
      vy: i < 20 ? 3 : -4,
      v: 15,
      t,
      dt: i ? DT : 0,
      flying: true,
    });
  }
  near(r.launch.u, 19 / 60 / LAUNCH.dur, 1e-9, 'launch progress stops when low and falling');
});
// Real game flights through planFrame (rest → throw → flight → landing), as ui.js chains them.
function chain(seed, { model = 'dart', levels } = {}) {
  const f = createFlight(model, levels, seed),
    frames = [];
  let prev = planFrame({ f: null, state: 'aim', visual: { clock: 0 } });
  while (!f.landed && f.t < 120) {
    const c = autoInput(f);
    if (c) eventInput(f, c, 'auto');
    step(f);
    prev = planFrame({ f, prev, time: f.t });
    frames.push({
      t: f.t,
      w: prev.camera.width,
      lock: prev.camera.lock,
      launch: prev.director.launch,
      state: prev.director.state,
    });
  }
  return { f, frames };
}
test('early Dart (π 1): the throw is visibly wider (max W / W_let ≥ 1,25), the pull-out ends by 1,2 s and W ≥ 0,9·W_let at the first warning', () => {
  for (const seed of [1, 2, 3, 5, 8, 13]) {
    const { f, frames } = chain(seed),
      max = Math.max(...frames.map(x => x.w));
    assert.ok(max / CAMERA.width >= 1.25, `seed ${seed}: max ${max}`);
    assert.ok(
      frames.filter(x => x.t >= LAUNCH.dur + 1e-9).every(x => x.launch === null),
      `seed ${seed}: launch over by 1,2 s`,
    );
    const first = frames.find(x => x.t >= f.events[0].at);
    assert.ok(first.w >= 0.9 * CAMERA.width, `seed ${seed}: W at warning ${first.w}`);
    const ws = frames
      .filter(x => x.t > LAUNCH.dur && !x.lock && x.state !== 'landing')
      .map(x => x.w);
    assert.ok(
      ws.every(w => w <= ZOOM_RANGE[1] * CAMERA.width + 1e-6),
      `seed ${seed}: ≤ W_max`,
    );
  }
});
