// I1 (research/bonusy/11-plan-implementace.md): mechaniky za letu podle rozhodnutí 14. 10. (06) a jejich přepínače na chování F3.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P, setParams } from '../simulation/progression/params.mjs';
import {
  createFlight,
  updateEvents,
  press,
  step,
  startDive,
  whistle,
  fly,
} from '../simulation/progression/model.mjs';
import { throwOnce } from '../simulation/progression/abilities.mjs';
import { kitFrom } from '../simulation/progression/run.mjs';

const zero = { model: 'dart', power: 0, folds: 0, paper: 0, atlas: {}, slots: [] };
const full = kitFrom({ power: 3, folds: 3, paper: 12, atlas: { '*': 3 } });
setParams();
const ev = (type, o = {}) => ({
  type,
  i: 0,
  at: 0,
  gap: 0,
  phase: 'waiting',
  result: null,
  heldAt: null,
  off: 0,
  target: 0.75,
  puffGap: 0.5,
  ...o,
});

// Termika: klepnutí v čase střed+dt, vrací {grade, flight}
const thermalTap = (dt, kit = { ...zero, atlas: { thermal: 1, echo: 1 } }) => {
  const f = createFlight(kit, { key: 'th', n: 20, profile: 'average', angle: 20, events: false });
  const e = ev('thermal');
  f.events = [e];
  updateEvents(f);
  f.t = e.w.c + dt;
  updateEvents(f);
  const vx = f.vx,
    vy = f.vy,
    g = press(f);
  return { g, f, e, dvx: f.vx - vx, dvy: f.vy - vy };
};

test('I1 perfekt termiky: střed jádra = perfect (kombo +2, Echo, push.perfect), okraj jádra success, sloup half', () => {
  const T = P.events.thermal,
    k = createFlight({ ...zero, atlas: { thermal: 1 } }, { key: 'th', n: 20, events: false }).d
      .windowK;
  const p = thermalTap(0),
    s = thermalTap(T.perfect * k + 0.02),
    h = thermalTap(T.core * k + 0.05);
  assert.equal(p.g, 'perfect');
  assert.equal(s.g, 'success');
  assert.equal(h.g, 'half');
  assert.equal(thermalTap(-T.perfect * k + 1e-3).g, 'perfect');
  assert.equal(p.f.combo, P.combo.perfect);
  assert.equal(s.f.combo, P.combo.success);
  assert.equal(p.f.stats.perfect, 1);
  assert.equal(p.f.echoes.length, 1);
  assert.equal(s.f.echoes.length, 0);
  // push ×push.perfect, zdvih sloupu stejný (výklad v effect())
  assert.ok(Math.abs(p.dvx / s.dvx - P.push.perfect) < 1e-9, `${p.dvx / s.dvx}`);
  assert.ok(Math.abs(p.dvy - s.dvy) < 1e-12);
  // předčasný stisk před jádrem zůstává okrajem jádra
  assert.equal(thermalTap(-T.core * k - P.events.earlyGrace / 2).g, 'success');
});

test('I1 perfekt termiky: okno se škáluje jako jádro (Folds, Sharp), perfect = 0 vrací chování F3', () => {
  const T = P.events.thermal,
    kit = { ...zero, folds: 3, slots: ['sharp'], atlas: { thermal: 1 } },
    k = createFlight(kit, { key: 'th', n: 20, events: false }).d.windowK;
  assert.ok(Math.abs(thermalTap(0, kit).e.w.p - T.perfect * k) < 1e-12);
  assert.equal(thermalTap(T.perfect * k * 0.95, kit).g, 'perfect');
  assert.equal(thermalTap(T.perfect * k * 1.05, kit).g, 'success');
  setParams({ events: { thermal: { perfect: 0 } } });
  try {
    assert.equal(thermalTap(0).g, 'success');
    assert.equal(thermalTap(0).f.echoes.length, 0);
    assert.equal(thermalTap(T.core + 0.05).g, 'half');
  } finally {
    setParams();
  }
});

test('I1 strop střemhlavu: držený Dive klesá nejvýš maxSink × běžné klesání, null = bez stropu', () => {
  const kit = { ...full, slots: ['dive'] },
    run = over => {
      setParams(over);
      try {
        const f = createFlight(kit, {
          key: 'dv',
          n: 20,
          profile: 'average',
          angle: 25,
          events: false,
          w: 0,
        });
        while (f.vy >= 0) step(f);
        assert.ok(startDive(f));
        let minR = Infinity,
          minVy = 0;
        const D = P.specials.dive;
        for (let i = 0; i < 400 && !f.landed && f.dive; i++) {
          step(f);
          if (f.landed) break;
          const wx = f.w * f.d.m.cruise * f.d.pi * Math.min(1, f.y / P.wind.shear),
            lim = (-(D.maxSink ?? Infinity) * Math.max(0, f.vx - wx)) / f.glide;
          if (D.maxSink != null) assert.ok(f.vy >= lim - 1e-9, `vy ${f.vy} < ${lim}`);
          minR = Math.min(minR, f.vy - lim);
          minVy = Math.min(minVy, f.vy);
        }
        return { minR, minVy };
      } finally {
        setParams();
      }
    };
  const cap = run({}),
    free = run({ specials: { dive: { maxSink: null } } });
  assert.ok(cap.minR < 1e-6, 'strop se dosáhne');
  assert.ok(free.minVy < cap.minVy - 1, `bez stropu strměji ${free.minVy} vs ${cap.minVy}`);
});

test('I1 strop střemhlavu: nemění zisk dive.gain ani vybrání, celé lety deterministické', () => {
  const kit = { ...full, slots: ['dive'] },
    ctx = { key: 'dvf|3', n: 20, profile: 'expert', angle: 25 };
  const g = over => {
    setParams(over);
    try {
      const f = createFlight(kit, { ...ctx, events: false, w: 0 });
      while (f.vy >= 0) step(f);
      startDive(f);
      for (let i = 0; i < 30; i++) step(f);
      return f.dive.gain;
    } finally {
      setParams();
    }
  };
  assert.ok(Math.abs(g({}) - g({ specials: { dive: { maxSink: null } } })) < 1e-12);
  assert.equal(throwOnce(kit, ctx).x, throwOnce(kit, ctx).x);
  // stejný vítr a síla hodu se stropem i bez něj (strop nebere náhodu)
  setParams({ specials: { dive: { maxSink: null } } });
  const b = throwOnce(kit, ctx);
  setParams();
  const a = throwOnce(kit, ctx);
  assert.equal(a.w, b.w);
  assert.equal(a.charge, b.charge);
});

test('I1 Whistle: přivolaná událost má okna ×window (časy a sloup beze změny), window = 1 vrací chování F3', () => {
  const kit = { ...zero, atlas: { steam: 1, thermal: 1, drone: 2, star: 1 }, slots: ['whistle'] };
  const wins = (type, whistled) => {
    const f = createFlight(kit, { key: 'wh', n: 20, profile: 'average', angle: 20, events: false });
    f.t = 5;
    f.lastResolved = -9;
    const e = ev(type, { at: 20 });
    f.events = [e];
    if (whistled) assert.ok(whistle(f));
    else e.at = f.t;
    assert.equal(!!e.whistled, whistled);
    assert.equal(e.at, 5);
    updateEvents(f);
    return e.w;
  };
  const W = P.specials.whistle.window;
  for (const type of ['gust', 'bird', 'steam', 'thermal', 'drone', 'star']) {
    const a = wins(type, false),
      b = wins(type, true);
    assert.ok(Math.abs(b.s - a.s * W) < 1e-12 && Math.abs(b.p - a.p * W) < 1e-12, type);
    assert.deepEqual(b.c, a.c, type);
    assert.equal(b.open, a.open, type);
    if (type === 'thermal') assert.equal(b.col, a.col);
    if (type !== 'steam') assert.equal(b.close, a.close, type);
  }
  setParams({ specials: { whistle: { window: 1 } } });
  try {
    for (const type of ['gust', 'thermal', 'star'])
      assert.deepEqual(wins(type, true), wins(type, false));
  } finally {
    setParams();
  }
});

test('I1 Whistle: užší okno může změnit výsledek, běžná událost se nemění; let s pískáním deterministický', () => {
  const kit = { ...zero, atlas: { thermal: 1 } },
    tap = (whistled, dt) => {
      const f = createFlight(kit, {
        key: 'wt',
        n: 20,
        profile: 'average',
        angle: 20,
        events: false,
      });
      f.t = 5;
      f.lastResolved = -9;
      const e = ev('thermal', { at: 20 });
      f.events = [e];
      if (whistled) whistle(f);
      else e.at = f.t;
      updateEvents(f);
      f.t = e.w.c + dt;
      updateEvents(f);
      return press(f);
    };
  const k = createFlight(kit, { key: 'wt', n: 20, events: false }).d.windowK,
    T = P.events.thermal,
    dt = (T.core * k * (1 + P.specials.whistle.window)) / 2;
  assert.equal(tap(false, dt), 'success');
  assert.equal(tap(true, dt), 'half');
  const wk = { ...full, slots: ['whistle', 'calm'] },
    ctx = { key: 'whf|1', n: 20, profile: 'good', angle: 25 },
    a = throwOnce(wk, ctx);
  assert.ok(a.stats.whistle > 0, 'bot pískal');
  assert.equal(a.x, throwOnce(wk, ctx).x);
});
