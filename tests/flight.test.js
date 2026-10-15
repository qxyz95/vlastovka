// A1 (research/atlas/04-plan-zapojeni.md): mechanika letu v src/flight.js, společná pro hru i simulátor.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFlightModel, lv } from '../src/flight.js';
import { PROGRESSION } from '../src/progression-numbers.js';
import { setParams } from '../simulation/progression/params.mjs';
import { fly as simFly } from '../simulation/progression/model.mjs';

const M = createFlightModel(PROGRESSION);
const P = PROGRESSION;
const kit = { model: 'dart', power: 2, folds: 2, paper: 4, atlas: { chain: 2, steam: 2, echo: 1 } };
const ctx = { key: 'test', n: 6, charge: 0.9, angle: 20, exact: true };
// Vstupy hráče: ťuk ve středu okna, holub drží do středu. Stisk ve varování hra ignoruje (press vrátí null).
const tapper = m => f => {
  const e = m.activeEvent(f);
  if (!e || e.result || e.phase !== 'interaction') return;
  if (e.type === 'bird') {
    if (e.heldAt === null) m.press(f);
    else if (f.t - e.heldAt >= e.w.c) m.release(f);
  } else if (f.t >= (e.type === 'steam' ? e.w.c[e.puff] : e.w.c)) m.press(f);
};
const trace = f =>
  JSON.stringify({
    x: f.x,
    y: f.y,
    t: f.t,
    vx: f.vx,
    w: f.w,
    combo: f.combo,
    stats: f.stats,
    ev: f.events.map(e => [e.type, e.result, e.resolvedAt]),
  });

test('flight: stejný seed a vstupy dají stejný let (i v nové instanci modelu)', () => {
  const a = M.fly(kit, ctx, [tapper(M)]),
    M2 = createFlightModel(PROGRESSION),
    b = M2.fly(kit, ctx, [tapper(M2)]);
  assert.equal(trace(a), trace(b));
  assert.ok(a.stats.done >= 3 && a.stats.hits >= 2, 'let má vyhodnocené zásahy');
  const c = M.fly(kit, { ...ctx, key: 'jiny' }, [tapper(M)]);
  assert.notEqual(trace(a), trace(c), 'jiný klíč = jiný rozvrh a vítr');
});

test('flight: čistý modul bez DOM a three.js, importuje jen čisté moduly src', () => {
  for (const file of ['flight.js', 'progression-numbers.js']) {
    const src = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8'),
      code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    // window/document jako globál (klíč nebo vlastnost window = okno QTE)
    for (const re of [
      /(^|[^.\w])document\b(?!\s*:)/,
      /(^|[^.\w])window\b(?!\s*:)/,
      /three/i,
      /requestAnimationFrame/,
      /\bMath\.random\b/,
      /Date\.now|performance\./,
    ])
      assert.doesNotMatch(code, re, `${file}: ${re}`);
    const imports = [...code.matchAll(/from\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    assert.ok(
      imports.every(p => /^\.\/(random|throw|config|events|scenes)\.js$/.test(p)),
      `${file}: ${imports}`,
    );
  }
});

test('flight: čísla hry dají stejný let jako simulátor s params.mjs', () => {
  setParams();
  for (const k of [kit, { model: 'glider', paper: 7, atlas: { crane: 3, skip: 2, momentum: 3 } }]) {
    const a = M.fly(k, { ...ctx, events: false }),
      b = simFly(k, { ...ctx, events: false });
    assert.equal(a.x, b.x);
    assert.equal(a.t, b.t);
  }
  assert.equal(M.bestAngle({ model: 'dart' }, 0.9), M.bestAngle({ model: 'dart' }, 0.9));
});

test('flight: hook onEventStart dostane událost s okny, model P nemění', () => {
  const seen = [],
    m = createFlightModel(PROGRESSION, {
      onEventStart: (f, e) => seen.push([e.type, !!e.w, e.phase]),
    });
  m.fly(kit, ctx, [tapper(m)]);
  assert.ok(seen.length >= 3);
  assert.ok(seen.every(([, w, ph]) => w && ph === 'warning'));
  assert.ok(Object.isFrozen(PROGRESSION.events.gust), 'zmrazená čísla přežila let beze změny');
});

test('flight: bonus Crowd Chain zvětší push z komba, Crane Lift zvedne start', () => {
  const push = atlas => {
    const f = M.createFlight({ model: 'dart', atlas }, { ...ctx, events: false });
    f.combo = 3;
    return M.effect(f, { type: 'gust' }, 'success', 1, true);
  };
  const c = P.atlas.chain[0];
  // dart, papír 0 (π = 1), poryv: dvx = base·(1 + E), E = min(kombo, strop)·krok
  assert.ok(Math.abs(push({}) - P.push.base * (1 + 3 * P.combo.step)) < 1e-12);
  assert.ok(Math.abs(push({ chain: 1 }) - P.push.base * (1 + Math.min(3, c.max) * c.step)) < 1e-12);
  assert.ok(push({ chain: 1 }) > push({}));
  for (const l of [0, 1, 3]) {
    const f = M.createFlight({ model: 'dart', atlas: { crane: l } }, { ...ctx, events: false });
    assert.equal(f.y, P.physics.y0 + P.atlas.crane * l);
    assert.equal(lv(f.kit, 'crane'), l);
  }
  assert.ok(
    M.fly({ model: 'dart', atlas: { crane: 3 } }, { ...ctx, events: false }).x >
      M.fly({ model: 'dart' }, { ...ctx, events: false }).x,
  );
});
