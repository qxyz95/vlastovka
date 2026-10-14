import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P, setParams, MODEL_SETS } from '../simulation/progression/params.mjs';
import { campaign, reward, paidModels, previewModel } from '../simulation/progression/campaign.mjs';
import { economy, summarize } from '../simulation/progression/run.mjs';
import { createFlight, effect, fly } from '../simulation/progression/model.mjs';
import { throwOnce } from '../simulation/progression/abilities.mjs';

setParams();
const DART = { ...P.models.dart },
  withModel = (m, extra = {}) => setParams({ models: { x: { ...DART, ...m, ...extra } } });
const full = {
  power: 3,
  folds: 3,
  paper: 6,
  atlas: { chain: 2, steam: 2, thermal: 2, drone: 2, skip: 3, pinwheel: 1 },
  slots: [],
};

test('progression models: reward = base + floor(distance·perMeter), bit-identical to 10 + floor(x/10)', () => {
  assert.deepEqual(P.economy.reward, { base: 10, perMeter: 0.1 });
  assert.equal(reward(1300), 140);
  assert.equal(reward(4200), 430);
  assert.equal(reward(0), 10);
  assert.equal(reward(-25), 10);
  assert.equal(reward(9.99), 10);
  for (let x = 0; x < 8000; x += 0.37) assert.equal(reward(x), 10 + Math.floor(x / 10));
  for (let x = 0; x <= 8000; x += 10) assert.equal(reward(x), 10 + x / 10);
  setParams({ economy: { reward: { base: 5, perMeter: 0.2 } } });
  assert.equal(reward(1300), 265);
  setParams();
});

// Snímky kampaní z HEAD 222b013 před změnou (out/k-sim-before.json, --raw): výchozí katalog = stejný výsledek.
test('progression models: default catalog reproduces pre-change campaigns exactly', () => {
  assert.deepEqual(Object.keys(P.models), ['dart', 'glider']);
  assert.deepEqual(paidModels(), []);
  const snap = [
    [
      { profile: 'average', strategy: 'realistic', id: 0 },
      { throws: 87, best: 4876, coins: 997, buys: 38, glider: 33, real: 2811.473489166293 },
    ],
    [
      { profile: 'expert', strategy: 'balanced', id: 1 },
      { throws: 78, best: 5916, coins: 1422, buys: 32, glider: 34, real: 2516.0527139140113 },
    ],
  ];
  for (const [spec, s] of snap) {
    const R = campaign({ ...spec, pockets: 'auto', model: 'better', seed: 1 });
    assert.deepEqual(
      {
        throws: R.throws,
        best: R.best,
        coins: R.coins,
        buys: R.buys.length,
        glider: R.gliderThrows,
        real: R.real,
      },
      s,
      spec.profile,
    );
    assert.ok(!R.buys.some(b => b.kind === 'model'));
    assert.deepEqual(R.kit.models, ['dart', 'glider']);
    // ekonomika: příjem − útrata = zůstatek; útrata po druzích = útrata po čtvrtích
    const inc = R.econ.income.reduce((a, b) => a + b, 0),
      sp = R.econ.spend.reduce((a, b) => a + b, 0);
    assert.equal(inc - sp, R.coins);
    assert.equal(
      Object.values(R.econ.kind).reduce((a, b) => a + b, 0),
      sp,
    );
    assert.equal(R.byModel.dart.throws + R.byModel.glider.throws, R.throws);
    assert.equal(R.byModel.glider.throws, R.gliderThrows);
    assert.equal(R.byModel.dart.coins + R.byModel.glider.coins, inc);
  }
});

test('progression models: catalog offer kind model after unlockPlace, strategies no-models / models-first', () => {
  setParams(MODEL_SETS.obsah01);
  assert.deepEqual(paidModels(), ['hawk', 'kite', 'skimmer', 'sail', 'needle']);
  const spec = { profile: 'average', pockets: 'auto', model: 'better', seed: 1, id: 0 };
  const mf = campaign({ ...spec, strategy: 'models-first' }),
    nm = campaign({ ...spec, strategy: 'no-models' });
  assert.ok(!nm.buys.some(b => b.kind === 'model'));
  assert.deepEqual(Object.keys(nm.byModel).sort(), ['dart', 'glider']);
  const hawk = mf.buys.find(b => b.id === 'model:hawk');
  assert.ok(hawk, 'models-first koupí Hawk');
  assert.equal(hawk.price, 400);
  // koupě až po rekordu na začátek místa 4 (3 · 304,8 m)
  assert.ok(Math.max(...mf.flights.slice(0, hawk.throw).map(f => f[3])) >= 3 * P.route.place - 1);
  assert.ok(mf.byModel.hawk?.throws > 0);
  assert.ok(mf.kit.models.includes('hawk'));
  assert.equal(
    mf.econ.kind.model,
    mf.buys.filter(b => b.kind === 'model').reduce((a, b) => a + b.price, 0),
  );
  // souhrn: podíly hodů po modelech dají 1, koupě Hawku v obou kampaních skupiny
  const E = economy([mf, mf]);
  assert.ok(Math.abs(Object.values(E.models).reduce((a, v) => a + v.share, 0) - 1) < 1e-9);
  assert.equal(E.models.hawk.bought, 1);
  assert.ok(summarize([mf]).econ.income.length === 4);
  setParams();
});

test('progression models: preview pick follows the known wind (windK)', () => {
  withModel({}, { windK: 3 });
  const kit = { ...full, atlas: {} };
  const pick = w0 => {
    for (let n = 1; n < 200; n++) {
      const k = 'pv|' + n,
        f = createFlight(kit, { key: k, n, profile: 'average', events: false });
      if (Math.sign(f.w) === w0)
        return previewModel(kit, ['dart', 'x'], { key: k, n, profile: 'average' });
    }
  };
  const tail = pick(1),
    head = pick(-1);
  assert.ok(tail.w > 0 && tail.model === 'x');
  assert.ok(head.w < 0 && head.model === 'dart');
  setParams();
});

test('progression models: neutral new fields change nothing', () => {
  for (let i = 0; i < 6; i++) {
    const ctx = { key: 'nf|' + i, n: 20, profile: 'weak', angle: 18 };
    setParams();
    const a = throwOnce({ ...full, model: 'dart' }, ctx);
    withModel({
      perfectK: 1.25,
      missK: 0,
      liftK: 1,
      pushK: 1,
      windK: 1,
      skip: 0,
      droneBurst: 0,
      ground: null,
    });
    const b = throwOnce({ ...full, model: 'x' }, ctx);
    assert.equal(b.x, a.x);
    assert.equal(b.t, a.t);
  }
  setParams();
});

test('progression models: windK scales wind both ways, ground lengthens low glide, skip adds a bounce with Stone Skip', () => {
  const pass = (m, w) => {
    withModel(m);
    return fly(
      { model: 'x', power: 3, paper: 6, atlas: {} },
      { angle: 18, charge: 0.8, exact: true, events: false, w, n: 20 },
    ).x;
  };
  const base = pass({}, 0);
  assert.equal(pass({ windK: 2.5 }, 0), base);
  assert.ok(pass({ windK: 2.5 }, 0.12) > pass({}, 0.12));
  assert.ok(pass({ windK: 2.5 }, -0.12) < pass({}, -0.12));
  assert.ok(pass({ ground: { below: 6, glide: 1.7 } }, 0) > base);
  assert.equal(pass({ ground: { below: 0, glide: 1.7 } }, 0), base);
  withModel({ skip: 1 });
  const ctx = { key: 'sk', n: 20, profile: 'average', events: false };
  assert.equal(
    createFlight({ model: 'x', atlas: { skip: 3 } }, ctx).skips,
    P.atlas.skip.bounces[2] + 1,
  );
  assert.equal(createFlight({ model: 'x', atlas: {} }, ctx).skips, 0);
  setParams();
});

test('progression models: perfectK, pushK, liftK and droneBurst in the event effect', () => {
  const hit = (m, type, grade) => {
    withModel(m);
    const f = createFlight(
        { model: 'x', power: 3, paper: 6, atlas: {} },
        { key: 'ef', n: 20, profile: 'average', events: false },
      ),
      vy = f.vy;
    const dvx = effect(f, { type }, grade, 1, false);
    return { dvx, dvy: f.vy - vy };
  };
  const g0 = hit({}, 'gust', 'perfect'),
    g1 = hit({ perfectK: 1.6 }, 'gust', 'perfect');
  assert.ok(Math.abs(g1.dvx / g0.dvx - 1.6 / P.push.perfect) < 1e-9);
  assert.equal(g1.dvy, g0.dvy); // perfectK jen vodorovně
  assert.equal(hit({ perfectK: 1.6 }, 'gust', 'success').dvx, hit({}, 'gust', 'success').dvx);
  assert.ok(
    Math.abs(hit({ pushK: 0.6 }, 'bird', 'success').dvx / hit({}, 'bird', 'success').dvx - 0.6) <
      1e-9,
  );
  for (const t of ['gust', 'thermal'])
    assert.ok(
      Math.abs(hit({ liftK: 1.6 }, t, 'success').dvy / hit({}, t, 'success').dvy - 1.6) < 1e-9,
      t,
    );
  const d0 = hit({}, 'drone', 'success'),
    d1 = hit({ droneBurst: 1.5 }, 'drone', 'success');
  assert.ok(d0.dvy > 0);
  assert.equal(d1.dvy, 0);
  assert.ok(Math.abs(d1.dvx / d0.dvx - 1.5) < 1e-9);
  setParams();
});

test('progression models: missK costs horizontal speed on a missed event', () => {
  let found = 0;
  for (let i = 0; i < 40 && found < 3; i++) {
    const ctx = { key: 'mk|' + i, n: 20, profile: 'weak', angle: 18 };
    setParams();
    const a = throwOnce({ ...full, model: 'dart' }, ctx);
    withModel({ missK: 0.06 });
    const b = throwOnce({ ...full, model: 'x' }, ctx);
    if (a.stats.miss === 0) {
      assert.equal(b.x, a.x);
      continue;
    }
    found++;
    assert.notEqual(b.x, a.x);
  }
  assert.ok(found > 0);
  setParams();
});
