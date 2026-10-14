import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFlight, step, simulate } from '../src/core.js';
import {
  createEvents,
  updateEvents,
  eventInput,
  eventStats,
  activeEvent,
  HELP,
  TIMING,
  windows,
} from '../src/events.js';
import { createDecorations, stepDecorations } from '../src/decorations.js';
function event(type, t) {
  const f = createFlight();
  f.events[0].type = type;
  f.t = t;
  updateEvents(f);
  return f;
}
test('gust early, missing, success, perfect, repeated inputs and exact impulse', () => {
  assert.equal(eventInput(event('gust', 1.7), 'down'), null);
  for (const [t, expected] of [
    [2.5, 'miss'],
    [2.7, 'success'],
    [2.95, 'perfect'],
    [3.4, 'miss'],
  ]) {
    const f = event('gust', t),
      vx = f.vx,
      vy = f.vy;
    assert.equal(eventInput(f, 'down'), expected);
    assert.equal(eventInput(f, 'down'), null);
    assert.equal(eventInput(f, 'up'), null);
    const k = expected === 'perfect' ? HELP.perfect : expected === 'success' ? 1 : 0;
    assert.equal(f.vx, vx + HELP.gustX * k * f.p.qte);
    assert.equal(f.vy, vy + HELP.gustY * k * f.p.qte);
  }
  const f = event('gust', 3.6);
  assert.equal(f.events[0].result, 'miss');
});
test('bird hold/release, wrong owner, repeat, cancel and timeout', () => {
  for (const [duration, expected] of [
    [0.2, 'miss'],
    [0.55, 'success'],
    [0.75, 'perfect'],
    [1.05, 'miss'],
    [1.3, 'miss'],
  ]) {
    const f = event('bird', 2.5),
      vx = f.vx;
    assert.equal(eventInput(f, 'down', 'finger1'), 'holding');
    assert.equal(eventInput(f, 'down', 'finger2'), null);
    assert.equal(eventInput(f, 'up', 'finger2'), null);
    f.t += duration;
    eventInput(f, 'up', 'finger1');
    assert.equal(f.events[0].result, expected);
    if (expected === 'miss') {
      assert.equal(f.vx, vx);
      assert.equal(f.carry, 0);
    } else assert.ok(f.carry > 0 && f.carry <= HELP.birdPerfect * f.p.qte);
    while (!f.landed && f.t < 180) step(f);
    assert.ok(f.landed);
    assert.equal(f.carry, 0);
  }
  const f = event('bird', 2.5);
  eventInput(f, 'down', 'touch');
  assert.equal(eventInput(f, 'cancel', 'touch'), 'miss');
  assert.equal(eventInput(f, 'up', 'touch'), null);
  const early = event('bird', 1.6);
  assert.equal(eventInput(early, 'down'), null);
  assert.equal(early.events[0].result, null);
  const absent = event('bird', 3.6);
  assert.equal(absent.events[0].result, 'miss');
});
test('schedule starts at 1.5, waits for result/effect, caps the count and avoids triple repeats', () => {
  for (let seed = 1; seed <= 100; seed++) {
    const events = createEvents(seed, seed === 1);
    assert.equal(events.length, TIMING.maxEvents);
    assert.equal(events[0].at, 1.5);
    for (let i = 2; i < events.length; i++)
      assert.ok(!(events[i].type === events[i - 1].type && events[i].type === events[i - 2].type));
  }
  assert.deepEqual(
    createEvents(1, true)
      .slice(0, 2)
      .map(e => e.type),
    ['gust', 'bird'],
  );
  const f = simulate('glider', { power: 5, paper: 5, fold: 5 }, 43, 1);
  for (let i = 1; i < f.events.length; i++)
    if (Number.isFinite(f.events[i].at)) {
      const gap = f.events[i].at - f.events[i - 1].doneAt;
      assert.ok(i < 3 ? Math.abs(gap - 3) < 1e-8 : gap >= 4 && gap <= 7);
    }
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
  let starts = 0,
    last = null;
  while (!f.landed) {
    step(f);
    const before = { x: f.x, y: f.y, vx: f.vx, vy: f.vy, events: structuredClone(f.events) };
    stepDecorations(a, f);
    stepDecorations(b, f);
    assert.deepEqual(a.active, b.active);
    assert.deepEqual({ x: f.x, y: f.y, vx: f.vx, vy: f.vy, events: f.events }, before);
    if (a.active && a.active !== last) {
      assert.equal(activeEvent(f), null);
      starts++;
    }
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
  const f = event('gust', 2.9),
    d = createDecorations(9);
  d.nextAt = f.t;
  eventInput(f, 'down');
  stepDecorations(d, f);
  assert.equal(d.active, null);
  f.t = f.events[0].doneAt;
  updateEvents(f);
  stepDecorations(d, f);
  assert.ok(d.active);
});
test('cancelled or ignored QTE has exactly the same passive flight as no assistance', () => {
  for (const type of ['gust', 'bird']) {
    const a = createFlight(),
      b = createFlight();
    a.events[0].type = type;
    b.events[0].type = type;
    while (!a.landed) {
      if (
        a.events[0].phase === 'interaction' &&
        a.events[0].heldAt === null &&
        !a.events[0].result
      ) {
        if (type === 'bird') {
          eventInput(a, 'down', 'touch');
          eventInput(a, 'cancel', 'touch');
        } else eventInput(a, 'down', 'touch');
      }
      step(a);
      step(b);
    }
    assert.equal(a.x, b.x);
    assert.equal(a.t, b.t);
  }
});
import { SECTION_METERS } from '../src/scenes.js';
test('successful bird never cuts the climb', () => {
  for (const vy of [-3, 5]) {
    const f = event('bird', 2.5);
    f.vy = vy;
    eventInput(f, 'down');
    f.t += 0.75;
    assert.equal(eventInput(f, 'up'), 'perfect');
    assert.equal(f.vy, Math.max(0.4, vy));
  }
});
test('fold upgrade widens QTE windows and the glider gains more from hits', () => {
  const w0 = windows(createFlight('dart', { power: 0, paper: 0, fold: 0 })),
    w5 = windows(createFlight('dart', { power: 0, paper: 0, fold: 5 }));
  assert.ok(w5.gust.perfect > w0.gust.perfect && w5.bird.success > w0.bird.success);
  const at = (t, fold) => {
    const f = createFlight('dart', { power: 0, paper: 0, fold });
    f.events[0].type = 'gust';
    f.t = t;
    updateEvents(f);
    return eventInput(f, 'down');
  };
  assert.equal(at(3.02, 0), 'success');
  assert.equal(at(3.02, 5), 'perfect');
  const gain = model => {
    const f = createFlight(model);
    f.events[0].type = 'gust';
    f.t = 2.9;
    updateEvents(f);
    const vy = f.vy;
    eventInput(f, 'down');
    return f.vy - vy;
  };
  assert.ok(gain('glider') > gain('dart'));
});
// QS2: výškový práh QTE 8 m ve hře (research/plan-hratelnost/01 karta QS2, rozhodnutí 06 bod 10).
import { EVENT_MIN_Y } from '../src/config.js';
import { defaults as simDefaults } from '../simulation/progression/params.mjs';
import { throwSettings } from '../src/throw.js';
import { qteLock, nextEventIn } from '../src/render3d/camera.js';
test('QS2: a due event below 8 m keeps waiting with no warning or marker and never counts', () => {
  assert.equal(EVENT_MIN_Y, 8);
  assert.equal(
    EVENT_MIN_Y,
    simDefaults().physics.eventMinY,
    'same floor as the progression simulator',
  );
  const f = createFlight();
  f.y = EVENT_MIN_Y - 0.01;
  f.t = 2.5;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'waiting');
  assert.equal(activeEvent(f), null);
  assert.equal(eventInput(f, 'down'), null);
  assert.equal(f.events[0].result, null);
  assert.equal(qteLock(f), false, 'no QTE camera lock for a held event');
  assert.equal(nextEventIn(f), Infinity);
  f.y = 0.00001;
  f.vy = -5;
  step(f);
  assert.ok(f.landed);
  assert.equal(eventStats(f).completed, 0);
  assert.equal(f.feedback, '');
  const at = createFlight();
  at.y = EVENT_MIN_Y;
  at.t = 1.5;
  updateEvents(at);
  assert.equal(at.events[0].phase, 'warning', 'exactly 8 m still starts');
});
test('QS2: climbing back above the floor starts the held event with a full warning', () => {
  const f = createFlight();
  f.y = 5;
  f.t = 2;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'waiting');
  f.y = 9;
  f.t = 4;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'warning');
  assert.equal(f.events[0].at, 4);
  f.t = 4 + TIMING.warning - 0.01;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'warning');
  f.t = 4 + TIMING.warning;
  updateEvents(f);
  assert.equal(f.events[0].phase, 'interaction');
  const on = createFlight();
  on.t = 1.52;
  updateEvents(on);
  assert.equal(on.events[0].at, 1.5, 'on-time starts keep the schedule');
});
test('QS2: the floor uses no randomness, flights stay deterministic and the tutorial gust always starts', () => {
  for (const seed of [1, 2, 7, 43]) {
    const plain = createEvents(seed, seed === 1).map(e => [e.type, e.gap]);
    const a = simulate('glider', { power: 0, paper: 0, fold: 0 }, seed, 0.7),
      b = simulate('glider', { power: 0, paper: 0, fold: 0 }, seed, 0.7);
    assert.deepEqual(
      a.events.map(e => [e.type, e.gap]),
      plain,
    );
    assert.equal(a.x, b.x);
    assert.equal(a.t, b.t);
  }
  for (const model of ['dart', 'glider'])
    for (let angle = 5; angle <= 40; angle += 5)
      for (const power of [0, 0.5, 1]) {
        const f = createFlight(
          model,
          { power: 0, paper: 0, fold: 0 },
          1,
          { x: 0, y: 0 },
          throwSettings(angle, power),
        );
        while (f.t < 1.6) step(f);
        assert.equal(f.events[0].type, 'gust');
        assert.notEqual(f.events[0].phase, 'waiting', `${model} ${angle}° ${power}`);
      }
});
test('QS2: every event in real flights starts at or above the floor', () => {
  for (const model of ['dart', 'glider'])
    for (let seed = 1; seed <= 30; seed++) {
      const f = simulate(model, { power: 2, paper: 2, fold: 2 }, seed, 0),
        g = createFlight(model, { power: 2, paper: 2, fold: 2 }, seed);
      while (!g.landed && g.t < 180) {
        const before = g.events.map(e => e.phase);
        step(g);
        g.events.forEach((e, i) => {
          if (before[i] === 'waiting' && e.phase === 'warning')
            assert.ok(g.y >= EVENT_MIN_Y, `${model} ${seed} event ${i} at ${g.y}`);
        });
      }
      assert.equal(g.x, f.x);
    }
});
