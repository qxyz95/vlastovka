// M2: hra létá na src/flight.js. Dílna 3/12/3 (gear.js), kit z save, adaptér letu (core.js) a shoda se simulátorem.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh,
  buy,
  kitOf,
  createFlight,
  flightFor,
  windFor,
  step,
  advance,
  eventInput,
  activeEvent,
  feedbackOf,
  settle,
  reward,
  bestAngle,
  angleHint,
  FINISH,
  GAME_KEY,
  gameFlight,
} from '../src/core.js';
import { branchStatus, paperOpen, BRANCHES, maxLevel, NEW_EVENT_TYPES } from '../src/gear.js';
import { PROGRESSION as P } from '../src/progression-numbers.js';
import { SCREEN_METERS, ROUTE } from '../src/scenes.js';
import { maxLevelOf } from '../src/atlas.js';
import { random } from '../src/random.js';
import { DT, NEW_EVENTS } from '../src/config.js';
import { t } from '../src/i18n.js';
import {
  fly as simFly,
  press as simPress,
  release as simRelease,
} from '../simulation/progression/model.mjs';

const save = o => ({ ...fresh(), ...o });
const med = a => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

test('Workshop: Power 3, Folds 3, Paper 12 at the prices of progression-numbers; next level only', () => {
  assert.deepEqual(
    BRANCHES.map(b => [b.id, maxLevel(b.id)]),
    [
      ['power', 3],
      ['paper', 12],
      ['folds', 3],
    ],
  );
  const p = save({ coins: 49 });
  assert.equal(buy(p, 'power'), false, 'not enough coins');
  assert.equal(branchStatus(p, 'power').next.reason, 'coins');
  assert.equal(branchStatus(p, 'power').next.missing, 1);
  p.coins = 10000;
  assert.equal(buy(p, 'power', 2), false, 'only the next level');
  assert.equal(buy(p, 'fold'), false, 'unknown branch');
  for (let l = 1; l <= 3; l++) assert.ok(buy(p, 'power', l));
  assert.equal(buy(p, 'power'), false, 'maximum');
  assert.equal(branchStatus(p, 'power').next, null);
  assert.equal(p.coins, 10000 - P.workshop.power.prices.reduce((a, b) => a + b));
  for (let l = 1; l <= 3; l++) assert.ok(buy(p, 'folds'));
  assert.deepEqual(p.levels, { power: 3, paper: 0, folds: 3 });
});

test('Paper: Copy from the start, the next kind opens on the 3rd place of a district (opensPaper)', () => {
  const p = save({ coins: 1e6, best: 0 });
  assert.equal(paperOpen(0), 3);
  for (let l = 1; l <= 3; l++) assert.ok(buy(p, 'paper'));
  const s = branchStatus(p, 'paper');
  assert.equal(s.next.reason, 'later');
  assert.equal(ROUTE[s.next.place].kind, 'garden', 'Kraft opens on the 3rd place (garden)');
  assert.equal(buy(p, 'paper'), false);
  p.best = 2 * SCREEN_METERS;
  assert.equal(paperOpen(p.best), 6);
  assert.ok(buy(p, 'paper'));
  assert.equal(p.coins, 1e6 - [180, 320, 520, 500].reduce((a, b) => a + b));
  assert.equal(paperOpen(6 * SCREEN_METERS), 9);
  assert.equal(paperOpen(FINISH), 12);
  assert.equal(paperOpen(10 * SCREEN_METERS - 1), 9);
});

test('kitOf: Workshop, model, Atlas levels from p.best and p.atlas, pockets; new events stay out behind the flag', () => {
  assert.deepEqual(kitOf(fresh()), {
    model: 'dart',
    power: 0,
    folds: 0,
    paper: 0,
    atlas: {},
    slots: [],
  });
  const p = save({
    best: 7 * SCREEN_METERS + 1,
    model: 'glider',
    levels: { power: 2, paper: 5, folds: 1 },
  });
  p.atlas.levels = { chain: 2, steam: 1 };
  p.atlas.pockets = { owned: 1, slots: ['sharp', null] };
  const k = kitOf(p);
  assert.equal(NEW_EVENTS, false);
  assert.deepEqual(k, {
    model: 'glider',
    power: 2,
    folds: 1,
    paper: 5,
    atlas: { glider: 1, chain: 3, pinwheel: 1, tape: 1, crane: 1, skip: 1, gull: 1 },
    slots: ['sharp'],
  });
  assert.equal(kitOf(p, { newEvents: true }).atlas.steam, 2);
  for (const id of NEW_EVENT_TYPES) assert.ok(!(id in kitOf(save({ best: FINISH })).atlas), id);
  assert.equal(kitOf(save({ model: 'glider', best: 99 })).model, 'dart', 'Glider only when found');
});

test('settle: coins = 10 + dolet/10, completed only at the end of the route (4 876 m), not at 500 m', () => {
  assert.ok(Math.abs(FINISH - P.route.finish) < 1e-12 && FINISH > 4876 && FINISH < 4877);
  const p = fresh(),
    f = { landed: true, settled: false, x: 501, startX: 0 };
  assert.equal(reward(f), 60);
  assert.ok(settle(p, f));
  assert.equal(settle(p, f), false, 'once');
  assert.deepEqual([p.coins, p.best, p.completed, p.attempts], [60, 501, false, 1]);
  assert.ok(settle(p, { landed: true, settled: false, x: FINISH, startX: 0 }));
  assert.equal(p.completed, true);
});

test('flight: deterministic from (game key, throw number); wind is known before the throw; throw 1 is the tutorial', () => {
  const p = save({ attempts: 6, levels: { power: 1, paper: 2, folds: 1 } });
  const a = flightFor(p, 20, 0.8),
    b = flightFor(p, 20, 0.8);
  while (!a.landed) step(a);
  while (!b.landed) step(b);
  assert.equal(a.x, b.x);
  assert.equal(a.seed, 7);
  for (const [ang, c] of [
    [5, 0],
    [40, 1],
  ])
    assert.equal(flightFor(p, ang, c).w, windFor(p));
  const winds = new Set(Array.from({ length: 30 }, (_, i) => windFor(save({ attempts: i }))));
  assert.ok(winds.size > 3, 'wind varies between throws');
  const tut = flightFor(fresh(), 18, 0.7);
  assert.deepEqual(
    tut.events.slice(0, 2).map(e => e.type),
    ['gust', 'bird'],
  );
  assert.equal(tut.model, 'dart');
  assert.equal(tut.launch.grade, 'strong');
});

test('eventInput: press in the warning is ignored, feedback key for 1 s after a result', () => {
  const f = createFlight('dart', undefined, 2, { x: 0, y: 0 });
  while (!activeEvent(f)) step(f);
  const e = activeEvent(f);
  assert.equal(e.phase, 'warning');
  assert.equal(eventInput(f, 'down'), null);
  while (f.t < e.w.c) step(f);
  assert.ok(['success', 'perfect'].includes(eventInput(f, 'down')));
  assert.equal(feedbackOf(f), 'feedback.' + e.result);
  while (f.t < e.resolvedAt + 1) step(f);
  assert.equal(feedbackOf(f), '');
});

test('advance: calm gliding runs 1.4× (real time), hitstop freezes only the physics accumulator', () => {
  const f = flightFor(save({ attempts: 3 }), 20, 0.9);
  let acc = 0,
    wall = 0;
  const frozen = advance(f, 0, 0.1, true);
  assert.deepEqual(frozen, { acc: 0, steps: 0 });
  while (!f.landed) {
    ({ acc } = advance(f, acc, 1 / 60));
    wall += 1 / 60;
  }
  assert.ok(Math.max(...[f.warp]) <= P.warp.factor);
  assert.ok(f.real < f.t - 0.5, `real ${f.real} < flight ${f.t}`);
  assert.ok(Math.abs(wall - f.real) < 0.2, `wall clock ${wall} ≈ real ${f.real}`);
});

// Kritérium přijetí M2: stejný let ve hře (smyčka snímků advance + vstupy mezi snímky) a ve fly simulátoru se stejnými vstupy.
// Hra zapisuje, před kterým krokem fyziky vstup přišel; simulátor ho přehraje botem ve stejném kroku (profil bez plánu = bez vlastních stisků).
test('M2: the game loop flies exactly like the simulator fly() with the same scripted inputs (x to 1e-9)', () => {
  const cases = [
    [save({ attempts: 0 }), 18, 0.7],
    [
      save({
        attempts: 7,
        best: 2500,
        model: 'glider',
        levels: { power: 2, paper: 5, folds: 1 },
        atlas: { ...fresh().atlas, levels: { chain: 1, gull: 2 } },
      }),
      27,
      0.95,
    ],
    [save({ attempts: 24, best: FINISH, levels: { power: 3, paper: 12, folds: 3 } }), 22, 1],
  ];
  for (const [p, angle, charge] of cases) {
    const kit = kitOf(p),
      f = flightFor(p, angle, charge),
      r = random(p.attempts + 99),
      log = [];
    let acc = 0,
      k = 0;
    const input = kind => log.push([k, kind, eventInput(f, kind)]);
    while (!f.landed) {
      const e = activeEvent(f);
      if (e && !e.result) {
        const off = (r() - 0.5) * 0.3;
        if (e.phase === 'warning' && r() < 0.05) input('down');
        else if (e.phase === 'interaction') {
          if (e.type !== 'bird' && f.t >= e.w.c + off) input('down');
          if (e.type === 'bird' && e.heldAt === null && r() < 0.2) input('down');
          if (e.type === 'bird' && e.heldAt !== null && f.t - e.heldAt >= e.w.c + off) input('up');
        }
      }
      ({ acc } = advance(f, acc, 0.004 + 0.05 * r(), r() < 0.02, (g, w) => w === 'after' && k++));
    }
    let i = 0;
    const replay = g => {
      for (const [at, kind] of log) if (at === i) (kind === 'down' ? simPress : simRelease)(g);
      i++;
    };
    const s = simFly(
      kit,
      { key: GAME_KEY, n: p.attempts + 1, profile: 'scripted', angle, charge, exact: true },
      [replay],
    );
    assert.ok(
      log.some(([, , res]) => res && res !== 'holding'),
      'some inputs were graded',
    );
    assert.ok(Math.abs(f.x - s.x) <= 1e-9, `x ${f.x} vs ${s.x}`);
    assert.ok(Math.abs(f.t - s.t) <= 1e-9 && Math.abs(f.real - s.real) <= 1e-9);
    assert.deepEqual(
      f.events.map(e => e.result),
      s.events.map(e => e.result),
    );
  }
});

// Kritérium přijetí M2 (04 §Shrnutí: hod 0,95, 90 % zásahů, plná výbava): Dílna max, Atlas max podle PROGRESSION, bez kapes.
// Hráč stiskne ve středu okna s šumem 0,05 s, každou desátou událost mine. Hody 20–59 (plující střed, švih), skutečný čas s 1,4×.
const fullSave = (model, n) => {
  const p = save({
    best: FINISH,
    attempts: n - 1,
    model,
    levels: { power: 3, paper: 12, folds: 3 },
  });
  for (const id of P.atlas.bonuses) if (maxLevelOf(id) > 1) p.atlas.levels[id] = maxLevelOf(id) - 1;
  return p;
};
function fullKitRun(model, newEvents) {
  const xs = [],
    real = [];
  for (let n = 20; n < 60; n++) {
    const kit = kitOf(fullSave(model, n), { newEvents }),
      f = gameFlight(kit, n, bestAngle(kit, 0.95), 0.95),
      r = random(n * 7 + 1),
      plan = new Map(); // událost → {skip, jit}
    while (!f.landed) {
      const e = activeEvent(f);
      if (e && !e.result && e.phase === 'interaction') {
        if (!plan.has(e)) plan.set(e, { skip: r() < 0.1, jit: (r() - 0.5) * 0.1 });
        const { skip, jit } = plan.get(e),
          c = e.type === 'steam' ? e.w.c[e.puff] : e.w.c;
        if (!skip) {
          if (e.type === 'bird') {
            if (e.heldAt === null) eventInput(f, 'down');
            else if (f.t - e.heldAt >= c + jit) eventInput(f, 'up');
          } else if (f.t >= c + jit) eventInput(f, 'down');
        }
      }
      step(f);
    }
    xs.push(f.x);
    real.push(f.real);
  }
  return {
    median: med(xs),
    min: Math.min(...xs),
    real: med(real),
    realMax: Math.max(...real),
  };
}
test('M2: full gear flies the whole route (median ≥ 4 876 m) in ≤ 35 s of real time', () => {
  for (const newEvents of [false, true]) {
    const r = fullKitRun('glider', newEvents);
    console.log('M2 full gear glider', newEvents ? 'all events' : 'gust+bird', JSON.stringify(r));
    assert.ok(r.median >= FINISH, `glider ${newEvents ? 'all events' : 'gust+bird'}: ${r.median}`);
    assert.ok(r.real <= 35, `real ${r.real}`);
  }
});

test('best angle: from the kit, independent of Paper (pace π); the Glider wants a steeper throw', () => {
  const kit = { model: 'dart', power: 0, folds: 0, paper: 0, atlas: {} },
    dart = bestAngle(kit, 1);
  assert.equal(bestAngle({ ...kit, paper: 12 }, 1), dart);
  assert.ok(dart >= 15 && dart <= 32);
  assert.ok(bestAngle({ ...kit, model: 'glider' }, 1) > dart);
  const x = a => {
    const f = createFlight(
      'dart',
      undefined,
      1,
      { x: 0, y: 0 },
      { angle: (a * Math.PI) / 180, power: 1 },
    );
    f.events = [];
    while (!f.landed) step(f);
    return f.x;
  };
  assert.ok(x(dart) >= x(dart - 5) && x(dart) >= x(dart + 5));
  assert.equal(angleHint(dart + 2, dart), 'angle.ok');
  assert.equal(angleHint(dart + 5, dart), 'angle.flatter');
  assert.equal(angleHint(dart - 12, dart), 'angle.muchSteeper');
  assert.equal(t(angleHint(dart + 2, dart), {}, 'cs'), 'Úhel sedí');
  assert.equal(t(angleHint(dart - 12, dart), {}, 'en'), 'Try much steeper');
});

test('fixed step: one game step is one DT of flight time', () => {
  const f = createFlight();
  step(f);
  assert.ok(Math.abs(f.t - DT) < 1e-12);
});
