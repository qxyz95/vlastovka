import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ease,
  tween,
  damp,
  spring,
  wobble,
  noise1,
  fbm,
  drift,
  wind,
  sway,
} from '../src/motion.js';
import { createFx, fxEvent, stepFx, shake, liveParticles, flightAngle, FX } from '../src/juice.js';
import { random } from '../src/random.js';

const view = { cam: 0, ground: 300, px: 148, py: 200 };
test('easings start at 0 and end at 1', () => {
  for (const [name, fn] of Object.entries(ease)) {
    assert.ok(Math.abs(fn(0)) < 1e-9, name);
    assert.ok(Math.abs(fn(1) - 1) < 1e-9, name);
  }
  assert.equal(tween(10, 20, 2), 20);
  assert.equal(tween(10, 20, -1), 10);
  assert.ok(ease.outBack(0.6) > 1, 'outBack overshoots');
});
test('damping and springs are frame-rate independent', () => {
  assert.ok(Math.abs(damp(0, 1, 0.2, 0.2) - 0.5) < 1e-12);
  let a = 0,
    b = 0;
  for (let i = 0; i < 30; i++) a = damp(a, 1, 0.1, 1 / 60);
  for (let i = 0; i < 60; i++) b = damp(b, 1, 0.1, 1 / 120);
  assert.ok(Math.abs(a - b) < 1e-12);
  const s60 = { x: 0, v: 0 },
    s120 = { x: 0, v: 0 };
  for (let i = 0; i < 30; i++) spring(s60, 1, 0.15, 1 / 60);
  for (let i = 0; i < 60; i++) spring(s120, 1, 0.15, 1 / 120);
  assert.ok(Math.abs(s60.x - s120.x) < 1e-9);
  const s = { x: 0, v: 0 };
  for (let i = 0; i < 120; i++) spring(s, 1, 0.1, 1 / 60);
  assert.ok(Math.abs(s.x - 1) < 1e-4, 'critical spring settles');
  const w = { x: 0, v: 10 };
  let peak = 0;
  for (let i = 0; i < 240; i++) {
    wobble(w, 0, 320, 11, 1 / 60);
    peak = Math.max(peak, Math.abs(w.x));
  }
  assert.ok(peak > 0 && Math.abs(w.x) < 1e-3, 'wobble rings, then settles');
  const slow = { x: 0, v: 10 };
  wobble(slow, 0, 320, 11, 0.5);
  assert.ok(Number.isFinite(slow.x) && Math.abs(slow.x) < 1, 'stable on a long frame');
});
test('noise is deterministic, bounded and continuous', () => {
  assert.equal(noise1(3.7, 2), noise1(3.7, 2));
  assert.notEqual(noise1(3.7, 2), noise1(3.7, 3));
  assert.equal(noise1(5, 1), 0, 'zero at lattice points');
  for (let x = 0; x < 200; x += 0.013) {
    const n = noise1(x, 4);
    assert.ok(n >= -1.01 && n <= 1.01);
    assert.ok(Math.abs(noise1(x + 1e-4, 4) - n) < 1e-3);
    assert.ok(Math.abs(fbm(x, 1)) <= 1.01);
  }
});
test('shared wind: air always moves forward, gusts stay within a sane range', () => {
  let sum = 0,
    n = 0;
  for (let t = 0; t < 1500; t += 0.1) {
    assert.ok(drift(t + 0.1) > drift(t), 'drift is monotonic at ' + t);
    const w = wind(t);
    assert.ok(w > 0.2 && w < 1.9, 'wind ' + w);
    sum += w;
    n++;
    assert.ok(Math.abs(sway(t, t * 7)) < 1.2);
  }
  assert.ok(Math.abs(sum / n - 1) < 0.1, 'average wind ≈ 1');
});
test('game feel: events add trauma and hitstop, then everything decays', () => {
  const fx = createFx(),
    rng = random(7);
  fxEvent(fx, 'throw', { power: 1 });
  assert.ok(fx.trauma > 0.4 && fx.stretch.v > 0);
  fxEvent(fx, 'perfect');
  assert.equal(fx.hitstop, FX.hitstop.perfect);
  assert.ok(fx.flash > 0);
  assert.equal(fx.popups.at(-1).style, 'perfect');
  fxEvent(fx, 'land', { speed: 40, text: '123 m' });
  assert.ok(fx.trauma <= 1 && fx.landed);
  stepFx(fx, 1 / 60, null, view, rng);
  assert.ok(liveParticles(fx) > 30, 'bursts spawn particles');
  for (let i = 0; i < 300; i++) stepFx(fx, 1 / 60, null, view, rng);
  assert.equal(fx.trauma, 0);
  assert.equal(fx.popups.length, 0);
  assert.equal(liveParticles(fx), 0);
  assert.ok(Math.abs(fx.stretch.x) < 1e-3);
});
test('particle pool never grows and reduced motion disables shake', () => {
  const fx = createFx(),
    rng = random(3);
  for (let i = 0; i < 50; i++) {
    fxEvent(fx, 'perfect');
    stepFx(fx, 1 / 60, null, view, rng);
  }
  assert.equal(fx.parts.length, FX.particles * 8);
  assert.ok(liveParticles(fx) <= FX.particles);
  fx.trauma = 1;
  assert.deepEqual(shake(fx, 1.3, true), { x: 0, y: 0, a: 0 });
  const s = shake(fx, 1.37, false);
  assert.ok(Math.abs(s.x) <= FX.shakePx && Math.abs(s.a) <= FX.shakeRad);
});
test('rotation spring starts at the flight angle and follows it smoothly', () => {
  const fx = createFx(),
    f = { vx: 10, vy: 10, landed: false };
  stepFx(fx, 1 / 60, f, view);
  assert.ok(Math.abs(fx.rot.x - flightAngle(f)) < 1e-9);
  f.vy = -10;
  stepFx(fx, 1 / 60, f, view);
  assert.ok(fx.rot.x < flightAngle(f) - 0.1, 'does not snap');
  for (let i = 0; i < 60; i++) stepFx(fx, 1 / 60, f, view);
  assert.ok(Math.abs(fx.rot.x - flightAngle(f)) < 1e-3);
});
