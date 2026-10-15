// Události ve hře na modelu letu src/flight.js (M2): stav, vstupy, ozdoby a výškový práh QS2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFlight, step, eventInput, GAME } from '../src/core.js';
import { eventStats, activeEvent, TIMING, windows, zones, eventProgress } from '../src/events.js';
import { createDecorations, stepDecorations } from '../src/decorations.js';
import { SECTION_METERS } from '../src/scenes.js';
import { autoInput } from './helpers/auto-input.js';
const { updateEvents } = GAME;
const calm = { x: 0, y: 0 };
// První událost daného typu v čase t (seed 2: bez tutoriálu, bezvětří, ideální úhel).
function event(type, t, levels) {
  const f = createFlight('dart', levels, 2, calm);
  f.events[0].type = type;
  f.t = t;
  updateEvents(f);
  return f;
}
const toInteraction = f => {
  while (f.events[0].phase !== 'interaction') {
    f.t += 1 / 60;
    updateEvents(f);
  }
};
test('gust: press in the warning is ignored, centre is perfect, the second press does nothing', () => {
  const f = event('gust', 1.6);
  assert.equal(f.events[0].phase, 'warning');
  assert.equal(eventInput(f, 'down'), null, 'warning: ignored, try again');
  f.t = f.events[0].w.c;
  updateEvents(f);
  const vy = f.vy;
  assert.equal(eventInput(f, 'down'), 'perfect');
  assert.ok(f.vy > vy);
  assert.equal(eventInput(f, 'down'), null);
  assert.equal(eventStats(f).perfect, 1);
});
test('bird: hold and release in the zone, cancel while holding is a miss, release without hold does nothing', () => {
  const f = event('bird', 1.5);
  toInteraction(f);
  assert.equal(eventInput(f, 'up'), null);
  assert.equal(eventInput(f, 'down'), 'holding');
  f.t += TIMING.birdCenter;
  assert.equal(eventInput(f, 'up'), 'perfect');
  assert.ok(f.carry > 0);
  const g = event('bird', 1.5);
  toInteraction(g);
  eventInput(g, 'down');
  assert.equal(eventInput(g, 'cancel'), 'miss');
  assert.equal(eventInput(g, 'cancel'), null);
});
test('landing interrupts unfinished attempts without counting misses', () => {
  const f = event('bird', 2.5);
  eventInput(f, 'down');
  f.y = 0.00001;
  f.vy = -5;
  step(f);
  assert.ok(f.landed);
  assert.equal(f.events[0].result, 'interrupted');
  assert.equal(eventStats(f).completed, 0);
  assert.equal(activeEvent(f), null);
});
test('cosmetics are seeded, independent, do not start during QTE, and stop at landing', () => {
  const f = createFlight(),
    a = createDecorations(7),
    b = createDecorations(7);
  assert.ok(a.nextAt >= 3 && a.nextAt <= 5);
  let last = null;
  while (!f.landed) {
    step(f);
    const before = { x: f.x, y: f.y, vx: f.vx, vy: f.vy, events: structuredClone(f.events) };
    stepDecorations(a, f);
    stepDecorations(b, f);
    assert.deepEqual(a.active, b.active);
    assert.deepEqual({ x: f.x, y: f.y, vx: f.vx, vy: f.vy, events: f.events }, before);
    if (a.active && a.active !== last) assert.equal(activeEvent(f), null);
    last = a.active;
  }
  assert.equal(a.active, null);
});
test('fixed physics is independent of display frames and cosmetic update frequency', () => {
  const run = fps => {
    const f = createFlight(),
      decor = createDecorations(1);
    let acc = 0;
    while (!f.landed) {
      acc += 1 / fps;
      while (acc >= 1 / 60 && !f.landed) {
        step(f);
        acc -= 1 / 60;
      }
      stepDecorations(decor, f);
    }
    return [f.x, f.t, eventStats(f)];
  };
  assert.deepEqual(run(30), run(60));
  assert.deepEqual(run(144), run(60));
});
test('all eight district decorations have bounded lifetimes and deterministic spacing', () => {
  const types = new Set();
  for (let district = 0; district < 4; district++)
    for (let seed = 1; seed < 30; seed++) {
      const d = createDecorations(seed),
        f = createFlight();
      f.events = [];
      f.x = district * SECTION_METERS + 10;
      f.t = d.nextAt;
      stepDecorations(d, f);
      const e = d.active;
      assert.ok(e);
      types.add(e.type);
      assert.ok(e.until - e.at >= 2 && e.until - e.at <= 4);
      f.t = e.until;
      stepDecorations(d, f);
      assert.equal(d.active, null);
      assert.ok(d.nextAt - f.t >= 6 && d.nextAt - f.t <= 10);
    }
  assert.equal(types.size, 8);
});
test('due decoration is postponed during a QTE effect and starts only after it ends', () => {
  const f = event('gust', 1.6),
    d = createDecorations(9);
  f.t = f.events[0].w.c;
  updateEvents(f);
  d.nextAt = f.t;
  eventInput(f, 'down');
  stepDecorations(d, f);
  assert.equal(d.active, null);
  f.t = f.events[0].doneAt;
  updateEvents(f);
  stepDecorations(d, f);
  assert.ok(d.active);
});
test('ignored or cancelled QTE has exactly the same flight as no input (misses cost nothing without Packing Tape)', () => {
  for (const type of ['gust', 'bird']) {
    const a = createFlight('dart', undefined, 2, calm),
      b = createFlight('dart', undefined, 2, calm);
    a.events[0].type = type;
    b.events[0].type = type;
    while (!a.landed) {
      const e = a.events[0];
      if (e.phase === 'warning') eventInput(a, 'down');
      if (type === 'bird' && e.phase === 'interaction' && e.heldAt === null && !e.result) {
        eventInput(a, 'down');
        eventInput(a, 'cancel');
      }
      step(a);
      step(b);
    }
    assert.equal(a.x, b.x);
    assert.equal(a.t, b.t);
  }
});
test('successful bird never cuts the climb', () => {
  for (const vy of [-3, 5]) {
    const f = event('bird', 1.5);
    toInteraction(f);
    f.vy = vy;
    eventInput(f, 'down');
    f.t += TIMING.birdCenter;
    assert.equal(eventInput(f, 'up'), 'perfect');
    assert.equal(f.vy, Math.max(0.4, vy));
  }
});
test('Folds widen the QTE windows (e.w, zones, windows) and the Glider gains more from hits', () => {
  const w = folds => {
    const f = event('gust', 1.6, { power: 0, paper: 0, folds });
    return f.events[0].w;
  };
  assert.ok(w(3).p > w(0).p && w(3).s > w(0).s);
  const f = event('gust', 1.6);
  const z = zones(f.events[0]);
  assert.ok(z.perfect[0] < z.perfect[1] && z.success[0] < z.perfect[0]);
  assert.ok(
    Math.abs(
      (z.perfect[0] + z.perfect[1]) / 2 - (TIMING.gustCenter - TIMING.warning) / TIMING.bar,
    ) < 1e-9,
  );
  assert.ok(
    windows(createFlight('dart', { power: 0, paper: 0, folds: 3 })).gust.perfect >
      windows(createFlight()).gust.perfect,
  );
  f.t = f.events[0].w.open + 0.3;
  assert.ok(Math.abs(eventProgress(f, f.events[0]) - 0.3 / TIMING.bar) < 1e-9);
  const gain = model => {
    const g = createFlight(model, undefined, 2, calm);
    g.events[0].type = 'gust';
    g.t = 1.6;
    updateEvents(g);
    g.t = g.events[0].w.c;
    updateEvents(g);
    const vy = g.vy;
    eventInput(g, 'down');
    return g.vy - vy;
  };
  assert.ok(gain('glider') > gain('dart'));
});
// QS2: výškový práh QTE 8 m ve hře (research/plan-hratelnost/01 karta QS2, rozhodnutí 06 bod 10, 15. 10. i v tutoriálu).
import { EVENT_MIN_Y } from '../src/config.js';
import { PROGRESSION } from '../src/progression-numbers.js';
import { defaults as simDefaults } from '../simulation/progression/params.mjs';
import { throwSettings } from '../src/throw.js';
import { qteLock, nextEventIn } from '../src/render3d/camera.js';
import { floorHeld } from '../src/render3d/frame.js';
test('QS2: a due event below 8 m keeps waiting with no warning or marker and never counts', () => {
  assert.equal(EVENT_MIN_Y, 8);
  assert.equal(EVENT_MIN_Y, PROGRESSION.physics.eventMinY);
  assert.equal(EVENT_MIN_Y, simDefaults().physics.eventMinY, 'same floor as the simulator');
  const f = createFlight();
  f.y = EVENT_MIN_Y - 0.01;
  f.t = 2.5;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'waiting');
  assert.equal(activeEvent(f), null);
  assert.equal(eventInput(f, 'down'), null);
  assert.equal(f.events[0].result, null);
  // flight.js nechá e.at; kamera ho přes adaptér frame.floorHeld vidí jako Infinity (žádný zámek ani přiblížení).
  assert.equal(qteLock(floorHeld(f)), false, 'no QTE camera lock for a held event');
  assert.equal(nextEventIn(floorHeld(f)), Infinity);
  assert.equal(f.events[0].at, 1.5, 'the flight itself is untouched');
  f.y = 0.00001;
  f.vy = -5;
  step(f);
  assert.ok(f.landed);
  assert.equal(eventStats(f).completed, 0);
  const at = createFlight();
  at.y = EVENT_MIN_Y;
  at.t = 1.5;
  updateEvents(at);
  assert.equal(at.events[0].phase, 'warning', 'exactly 8 m still starts');
});
test('QS2 tutorial (throw 1): gust, then pigeon; the tutorial gust always starts, other throws are random', () => {
  for (const model of ['dart', 'glider'])
    for (let angle = 5; angle <= 40; angle += 5)
      for (const power of [0, 0.5, 1]) {
        const f = createFlight(model, undefined, 1, calm, throwSettings(angle, power));
        assert.deepEqual(
          f.events.slice(0, 2).map(e => e.type),
          ['gust', 'bird'],
        );
        while (f.t < 1.6) step(f);
        assert.notEqual(f.events[0].phase, 'waiting', `${model} ${angle}° ${power}`);
      }
  const types = new Set();
  for (let n = 2; n < 12; n++)
    types.add(
      createFlight('dart', undefined, n)
        .events.slice(0, 2)
        .map(e => e.type)
        .join(),
    );
  assert.ok(types.size > 1, 'from throw 2 the order is random');
});
// Pod prahem čekající událost by v src/flight.js začala s okny od původního e.at (zkrácené varování). Bez schopností (C3) se to
// ve hře nestane: bez události vlaštovka zpátky nad 8 m nevystoupá. Hlídá to tento test.
test('QS2: every event in game flights starts at or above the floor and on schedule', () => {
  for (const model of ['dart', 'glider'])
    for (let seed = 1; seed <= 30; seed++)
      for (const levels of [undefined, { power: 3, paper: 12, folds: 3 }]) {
        const g = createFlight(model, levels, seed);
        while (!g.landed) {
          const before = g.events.map(e => e.phase),
            c = autoInput(g);
          if (c) eventInput(g, c);
          step(g);
          g.events.forEach((e, i) => {
            if (before[i] === 'waiting' && e.phase === 'warning') {
              assert.ok(g.y >= EVENT_MIN_Y, `${model} ${seed} event ${i} at ${g.y}`);
              assert.ok(g.t - e.at < 1 / 60 + 1e-9, `${model} ${seed} event ${i} late`);
            }
          });
        }
      }
});
