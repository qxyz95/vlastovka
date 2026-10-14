import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P, setParams, parseSet } from '../simulation/progression/params.mjs';
import {
  fly,
  createFlight,
  effect,
  step,
  setBurst,
  pace,
} from '../simulation/progression/model.mjs';
import { throwOnce, botsFor } from '../simulation/progression/abilities.mjs';
import { campaign, equip } from '../simulation/progression/campaign.mjs';
import { sampleKit, kitFrom } from '../simulation/progression/run.mjs';

const zero = { model: 'dart', power: 0, folds: 0, paper: 0, atlas: {}, slots: [] };
const full = kitFrom({ power: 3, folds: 3, paper: 12, atlas: { '*': 3 } });
setParams();

test('progression: deterministic by seed, separate streams', () => {
  const ctx = { key: 's|average|0', n: 7, profile: 'average', angle: 24 };
  assert.equal(throwOnce(full, ctx).x, throwOnce(full, ctx).x);
  assert.notEqual(throwOnce(full, ctx).x, throwOnce(full, { ...ctx, key: 's|average|1' }).x);
  const a = campaign({ profile: 'average', id: 3, seed: 5 }),
    b = campaign({ profile: 'average', id: 3, seed: 5 });
  assert.deepEqual(a, b);
  assert.notDeepEqual(campaign({ profile: 'average', id: 4, seed: 5 }).flights, a.flights);
  // výbava nemění náhodu hodu: stejný vítr i síla hodu s jinou výbavou (náhled U1 přehrává stejný hod)
  const f1 = createFlight(zero, ctx),
    f2 = createFlight(full, ctx);
  assert.equal(f1.charge, f2.charge);
});

test('progression: bins keep their caps (E, β, one burst)', () => {
  const f = createFlight(
    { ...full, slots: ['sharp'] },
    { key: 'cap', n: 20, profile: 'average', angle: 25 },
  );
  // strop E je pojistka (zasáhne jen výjimečně), proto se mechanismus stropu ověřuje se sníženým stropem
  f.combo = 99;
  assert.ok(
    effect(f, { type: 'steam' }, 'perfect', 1, true) <=
      P.push.base *
        pace(12) *
        (1 + P.caps.E) *
        P.push.perfect *
        P.specials.sharp.S *
        P.events.steam.pushFull +
        1e-9,
  );
  setParams({ caps: { E: 0.5 } });
  const dvx = effect(f, { type: 'gust' }, 'perfect', 1, true);
  assert.ok(f.stats.eCap);
  assert.ok(
    Math.abs(dvx - P.push.base * pace(12) * 1.5 * P.push.perfect * P.specials.sharp.S) < 1e-9,
  );
  setParams();
  setParams({ caps: { beta: 0.2 } });
  const g = createFlight(full, {
    key: 'beta',
    n: 20,
    profile: 'average',
    angle: 25,
    events: false,
  });
  g.combo = 9;
  while (!g.landed) {
    step(g);
    assert.ok(g.beta <= P.caps.beta + 1e-12);
  }
  assert.ok(g.stats.betaMax > P.caps.beta);
  setParams();
  setBurst(g, { amp: 1, tau: 1.5, shape: 'exp' }, 'rocket');
  setBurst(g, { amp: 0.4, dur: 4, shape: 'linear' }, 'star');
  assert.equal(g.burst.tag, 'star');
  assert.deepEqual(equip(2, 3, ['dive', 'whistle', 'sharp', 'calm']), ['dive', 'sharp']);
});

test('progression: first throw without kit flies ~170–250 m', () => {
  for (const [p, lo, hi] of [
    ['weak', 140, 230],
    ['average', 170, 250],
  ]) {
    const x = sampleKit(zero, p, 40).xMed;
    assert.ok(x >= lo && x <= hi, `${p} ${x}`);
  }
});

test('progression: full kit of an average player flies ~5 km and never over 60 s', () => {
  const r = sampleKit(full, 'average', 40);
  assert.ok(r.xMed > 3500 && r.xMed < 9000, `${r.xMed}`);
  for (const slots of [[], ['dive', 'sharp'], ['whistle', 'calm'], ['rocket'], ['cushion']])
    for (const p of ['average', 'expert'])
      for (let i = 0; i < 15; i++) {
        const f = fly(
          { ...full, slots },
          { key: 'long|' + i, n: 20, profile: p, angle: 25 },
          botsFor({ slots }),
        );
        assert.ok(f.landed && !f.timeout && f.t <= 60, `${slots} ${p} ${f.t}`);
      }
});

test('progression: weak campaign finishes, params can be overridden', () => {
  const r = campaign({ profile: 'weak', id: 1 });
  assert.ok(r.done && r.throws <= P.targets.weakFinishWithin);
  assert.equal(r.districts.length, 4);
  setParams(parseSet('warp.factor=1'));
  assert.equal(P.warp.factor, 1);
  const slow = campaign({ profile: 'weak', id: 1 });
  setParams();
  assert.ok(slow.minutes > r.minutes);
  assert.equal(P.warp.factor, 1.4);
});

// --- Audit F2 (simulation/progression/AUDIT.md) ---
import { createFlight as gameFlight, step as gameStep } from '../src/core.js';
import { throwSettings } from '../src/throw.js';
import { updateEvents, press, bestAngle } from '../simulation/progression/model.mjs';

test('progression audit: passive flight at π=1 matches the game exactly', () => {
  for (const [a, c] of [
    [18, 0.75],
    [30, 0.5],
    [10, 1],
  ]) {
    const g = gameFlight(
      'dart',
      { power: 0, paper: 0, fold: 0 },
      1,
      { x: 0, y: 0 },
      throwSettings(a, c),
    );
    g.events = [];
    while (!g.landed) gameStep(g);
    const s = fly(zero, { angle: a, charge: c, exact: true, events: false, w: 0, n: 1 });
    assert.ok(Math.abs(g.x - s.x) < 1e-9 && Math.abs(g.t - s.t) < 1e-9, `${a}° ${g.x} vs ${s.x}`);
  }
});

test('progression audit: pace π multiplies distance, not flight time (08 §2.1 závěr 3)', () => {
  const ctx = { angle: 20, charge: 0.8, exact: true, events: false, w: 0, n: 1 },
    a = fly(zero, ctx),
    b = fly({ ...zero, paper: 12 }, ctx);
  assert.ok(Math.abs(b.x / a.x - pace(12)) < 1e-6, `${b.x / a.x}`);
  assert.ok(Math.abs(b.t - a.t) < 1e-9);
});

test('progression audit: push modes (formula 08 §2.3 vs. probes sim3/camp2)', () => {
  const kit = { ...zero, folds: 3, paper: 12 },
    pi = pace(12),
    E = 3 * P.workshop.folds.push;
  const f = createFlight(kit, { key: 'push', n: 20, profile: 'average', angle: 20, events: false });
  assert.ok(
    Math.abs(effect(f, { type: 'gust' }, 'success', 1, true) - P.push.base * pi * (1 + E)) < 1e-9,
  );
  setParams({ push: { scaleWithPace: false } });
  // sondy: základ 1,5 bez π, přírůstek z E × π (dřív false vypnul π i u přírůstku E)
  assert.ok(
    Math.abs(effect(f, { type: 'gust' }, 'success', 1, true) - P.push.base * (1 + pi * E)) < 1e-9,
  );
  setParams();
});

test('progression audit: early tap before the thermal core counts as the core edge (Z4)', () => {
  const T = P.events.thermal,
    tap = dt => {
      const f = createFlight(
        { ...zero, atlas: { thermal: 1 } },
        { key: 'th', n: 20, profile: 'average', angle: 20, events: false },
      );
      const e = {
        type: 'thermal',
        i: 0,
        at: 0,
        gap: 0,
        phase: 'waiting',
        result: null,
        heldAt: null,
        off: 0,
        target: 0.75,
        puffGap: 0.5,
      };
      f.events = [e];
      updateEvents(f);
      f.t = e.w.c + dt;
      updateEvents(f);
      return press(f);
    };
  assert.equal(tap(-T.core - P.events.earlyGrace / 2), 'success');
  assert.equal(tap(-T.core - 0.2), 'half');
  assert.equal(tap(0), 'perfect'); // střed jádra = perfekt (rozhodnutí 14. 10.)
  setParams({ events: { thermal: { perfect: 0 } } });
  assert.equal(tap(0), 'success');
  setParams();
});

test('progression audit: best-angle cache follows changed physics', () => {
  const a = bestAngle(zero, 0.7);
  setParams({ physics: { steepPenalty: 0 } });
  const b = bestAngle(zero, 0.7);
  setParams();
  assert.notEqual(a, b);
  assert.equal(bestAngle(zero, 0.7), a);
});

// --- Ladění F3: opravy mechanik 1–5 z AUDIT §5 / 06 a chování botů (research/bonusy/10-ladeni.md) ---
import { startDive, pullUp, createEvents, derive, lv } from '../simulation/progression/model.mjs';
import { diveBot } from '../simulation/progression/abilities.mjs';
import { PROFILE_SETS } from '../simulation/progression/params.mjs';
const flat = (kit, o = {}) => {
  const f = createFlight(kit, {
    key: 'f3',
    n: 20,
    profile: 'average',
    angle: 20,
    events: false,
    w: 0,
    ...o,
  });
  return f;
};

test('F3 oprava 1: Dive převádí jen rychlost nabranou střemhlavem, ťuknutí nic nedá', () => {
  const kit = { ...zero, paper: 6, slots: ['dive'] },
    D = P.specials.dive;
  // přebytek z pushe události (vx = 1,5·cruise), ponoření a okamžité vybrání: vy ani vx se nezmění
  const f = flat(kit);
  f.y = 30;
  f.vx = 1.5 * f.cruise;
  f.vy = -2;
  f.t = 5;
  const vx0 = f.vx;
  assert.ok(startDive(f));
  pullUp(f);
  assert.ok(Math.abs(f.vx - vx0) < 1e-9 && Math.abs(f.vy + 2) < 1e-9, `${f.vx} ${f.vy}`);
  // skutečné ponoření: převede se nejvýš nabraný zisk, push zůstane v vx
  const g = flat(kit);
  g.y = 30;
  g.vx = 1.5 * g.cruise;
  g.vy = -2;
  g.t = 5;
  startDive(g);
  for (let i = 0; i < 40; i++) step(g);
  const gain = g.dive.gain,
    before = g.vx,
    vy = g.vy;
  assert.ok(gain > 0);
  pullUp(g);
  assert.ok(Math.abs(g.vy - (Math.max(vy, -2) + (D.conv * gain) / g.d.pi)) < 1e-9);
  assert.ok(Math.abs(g.vx - (before - (1 - D.keep) * gain)) < 1e-9);
  // výklad 08 (fromDiveOnly=false) bere celý přebytek a vy od nuly
  setParams({ specials: { dive: { fromDiveOnly: false } } });
  const h = flat(kit);
  h.y = 30;
  h.vx = 1.5 * h.cruise;
  h.vy = -2;
  h.t = 5;
  startDive(h);
  pullUp(h);
  assert.ok(h.vy > 1, `${h.vy}`);
  setParams();
});

test('F3 oprava 1: bot Dive se ponoří nejvýš maxUses-krát za let', () => {
  const kit = { ...full, slots: ['dive'] };
  for (let i = 0; i < 20; i++) {
    const f = fly(kit, { key: 'dv|' + i, n: 20, profile: 'expert', angle: 20 }, [diveBot]);
    assert.ok(f.stats.dive.uses <= P.bots.dive.maxUses);
  }
});

test('F3 oprava 2: Paper Crane táhne jen o šířku místa (9 / 15 / 24 m), ne o podíl doletu', () => {
  const land = (lvl, gap) => {
    const f = flat({ ...zero, paper: 12, atlas: { paperCrane: lvl } });
    const B = 13 * P.route.place;
    f.x = B - gap;
    f.y = 0.01;
    f.vy = -1;
    f.vx = f.cruise;
    while (!f.landed) step(f);
    return f;
  };
  assert.ok(land(3, 20).stats.tug > 0);
  assert.equal(land(1, 20).stats.tug, 0);
  assert.equal(land(3, 60).stats.tug, 0); // 60 m < 8 % z 3,9 km, dřív by táhl
  assert.ok(Math.abs(P.atlas.paperCrane.reach[2] * P.route.place - 24.4) < 0.1);
});

test('F3 oprava 3: Stone Skip se odrazí jen při rychlém dopadu, další odrazy úr. 3 s mírnější podmínkou', () => {
  const land = (k, lvl = 3) => {
    const f = flat({ ...zero, paper: 6, atlas: { skip: lvl } });
    f.y = 0.02;
    f.vy = -1;
    f.vx = k * f.cruise;
    step(f);
    step(f);
    return f;
  };
  assert.equal(land(P.atlas.skip.minVx - 0.1).stats.skips, 0);
  assert.equal(land(P.atlas.skip.minVx + 0.1).stats.skips, 1);
  const g = flat({ ...zero, paper: 6, atlas: { skip: 3 } });
  g.y = 0.02;
  g.vy = -1;
  g.vx = (P.atlas.skip.minVx + 0.3) * g.cruise;
  while (!g.landed) step(g);
  assert.equal(g.stats.skips, 2);
});

test('F3 oprava 4: Shooting Star je událost navíc a běžný rozvrh nemění', () => {
  const kit = { ...full },
    noStar = { ...full, atlas: { ...full.atlas } };
  delete noStar.atlas.star;
  let seen = 0;
  for (let i = 0; i < 300 && seen < 5; i++) {
    const key = 'st|' + i,
      a = createEvents(kit, key, 20, derive(kit)).list,
      b = createEvents(noStar, key, 20, derive(noStar)).list;
    if (!a.some(e => e.type === 'star')) continue;
    seen++;
    const reg = a.filter(e => e.type !== 'star');
    assert.equal(reg.length, b.length);
    assert.deepEqual(
      reg.map(e => [e.type, e.gap]),
      b.map(e => [e.type, e.gap]),
    );
    // za letu: běžná událost po hvězdě začne v base + gap, nebo nejdřív after po konci hvězdy
    const f = fly(kit, { key, n: 20, profile: 'expert', angle: 20 }),
      k = f.events.findIndex(e => e.type === 'star'),
      s = f.events[k],
      nx = f.events[k + 1];
    if (s.doneAt != null && nx && nx.at !== Infinity && s.base != null)
      assert.ok(Math.abs(nx.at - Math.max(s.base + nx.gap, s.doneAt + P.events.star.after)) < 1e-9);
  }
  assert.ok(seen >= 3);
});

test('F3 oprava 5: strop E je dosažitelná pojistka', () => {
  const own = Math.max(P.events.steam.levelPush, P.events.thermal.levelPush),
    c3 = P.atlas.chain[2];
  assert.ok(3 * P.workshop.folds.push + c3.step * c3.max + own > P.caps.E);
  assert.ok(3 * P.workshop.folds.push + c3.step * c3.max <= P.caps.E);
});

test('F3 boti: Pinwheel úr. 3 přetočí i bezvětří, výpadek pozornosti dá minutí, sada šum ×2 zdvojí qte', () => {
  let rer = 0;
  for (let i = 0; i < 200; i++) {
    const f = createFlight(
      { ...zero, atlas: { pinwheel: 3 } },
      { key: 'pw|' + i, n: 5, profile: 'average', angle: 20 },
    );
    assert.ok(f.w >= 0);
    rer += f.rerolls;
  }
  assert.ok(rer > 0);
  setParams({ profiles: { average: { lapse: 1 } } });
  const f = throwOnce(full, { key: 'lap', n: 20, profile: 'average', angle: 20 });
  assert.equal(f.stats.hits, 0);
  assert.ok(f.stats.done > 0);
  setParams();
  assert.equal(PROFILE_SETS.x2.profiles.average.qte, 2 * P.profiles.average.qte);
});

test('F3 nákup: realistický nákupčí je deterministický a liší se od optimálního, kapsa se kupuje s náhledem', () => {
  const a = campaign({ profile: 'average', strategy: 'realistic', id: 2, seed: 3 }),
    b = campaign({ profile: 'average', strategy: 'realistic', id: 2, seed: 3 });
  assert.deepEqual(a.buys, b.buys);
  assert.notDeepEqual(
    a.buys.map(x => x.id),
    campaign({ profile: 'average', strategy: 'balanced', id: 2, seed: 3 }).buys.map(x => x.id),
  );
  assert.ok(a.done && a.firstPocket != null && a.firstPocket <= 60, `${a.firstPocket}`);
});
