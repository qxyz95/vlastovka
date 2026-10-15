import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fresh } from '../src/core.js';
import { SCREEN_METERS, SECTION_METERS, ROUTE } from '../src/scenes.js';
import { LOCK_MS } from '../src/screens.js';
import {
  resultInput,
  throwDiff,
  nextGoal,
  shouldPan,
  chapterTrigger,
  airFocus,
  FOCUS_ORDER,
  throwReasons,
  dryRun,
  throwFacts,
} from '../src/result.js';
import { flightFor, step, kitOf } from '../src/core.js';

const gear = (power = 0, extra = {}) => ({
  levels: { power, paper: 0, folds: 0 },
  model: 'dart',
  ...extra,
});
const hit = (dist, o = {}) => ({
  dist,
  gear: gear(),
  hits: 2,
  perfects: 0,
  grade: 'strong',
  hint: 'angle.ok',
  wind: 0,
  ...o,
});
const save = o => ({ ...fresh(), attempts: 3, ...o });

test('K1: resultInput, 399 ms ignore, control, charge, throw/tap', () => {
  assert.equal(resultInput(LOCK_MS - 1, 'card'), 'ignore');
  assert.equal(resultInput(LOCK_MS - 1, 'control'), 'ignore');
  assert.equal(resultInput(LOCK_MS, 'control'), 'control');
  assert.equal(resultInput(LOCK_MS, 'card'), 'charge');
  assert.equal(resultInput(LOCK_MS, 'card', 150), 'throw');
  assert.equal(resultInput(LOCK_MS, 'card', 149), 'tap');
  assert.equal(resultInput(LOCK_MS, 'control', 900), 'control');
});

test('K2 hod 1: bez předchozího hodu je řádek němý', () => {
  assert.equal(throwDiff(null, hit(100)), null);
  assert.equal(throwDiff(undefined, hit(100)), null);
});

test('K2 práh: |Δ| pod max(5 m, 4 %) nemá Δ ani příčiny', () => {
  assert.equal(throwDiff(hit(100), hit(104.9, { hits: 5 })), null);
  assert.equal(throwDiff(hit(1000), hit(1039, { hits: 5 })), null); // 4 % z 1000 = 40
  const d = throwDiff(hit(1000), hit(1041));
  assert.equal(d.kind, 'diff');
  assert.equal(d.delta, 41);
  assert.deepEqual(d.causes, []);
});

test('K2 pořadí: koupě + o 2 zásahy víc = [gear, hits] v tomto pořadí', () => {
  const d = throwDiff(hit(100), hit(140, { gear: gear(1), hits: 4 }));
  assert.equal(d.kind, 'diff+cause');
  assert.equal(d.key, 'result.diff.up');
  assert.deepEqual(d.params, { m: 40 });
  assert.deepEqual(
    d.causes.map(c => c.type),
    ['gear', 'hits'],
  );
  assert.deepEqual(d.causes[0].params, { item: 'level:power:1' });
  assert.deepEqual(d.causes[1].params, { count: 4 });
});

test('K2 stejná výbava a stejné zásahy: nikdy příčina gear ani hits', () => {
  const d = throwDiff(hit(100), hit(60, { wind: 3 }));
  assert.equal(d.key, 'result.diff.down');
  assert.deepEqual(d.params, { m: 40 });
  assert.deepEqual(
    d.causes.map(c => c.type),
    ['wind'],
  );
  assert.equal(d.causes[0].key, 'result.cause.tail');
});

test('K2 nejvýš dvě příčiny a jen skutečné změny (perfekty, úhel, brzy/pozdě, vítr)', () => {
  const cur = hit(200, {
    gear: gear(1, { model: 'glider' }),
    hits: 3,
    perfects: 1,
    hint: 'angle.steeper',
    wind: -2,
  });
  assert.equal(throwDiff(hit(100), cur).causes.length, 2);
  const p = throwDiff(hit(100), hit(160, { perfects: 2 }));
  assert.deepEqual(
    p.causes.map(c => c.key),
    ['result.cause.perfects'],
  );
  const early = throwDiff(hit(100), hit(160, { grade: 'weak', chargeT: 0.4 }));
  assert.equal(early.causes[0].key, 'result.cause.early');
  const late = throwDiff(hit(100), hit(160, { grade: 'weak', chargeT: 1.9 }));
  assert.equal(late.causes[0].key, 'result.cause.late');
  const angle = throwDiff(hit(100), hit(160, { hint: 'angle.muchFlatter' }));
  assert.deepEqual(
    angle.causes.map(c => c.key),
    ['angle.muchFlatter'],
  );
  const head = throwDiff(hit(100, { wind: 2 }), hit(160, { wind: 0.5 }));
  assert.equal(head.causes[0].key, 'result.cause.head');
  assert.equal(throwDiff(hit(100, { wind: 2 }), hit(160, { wind: 1.5 })).causes.length, 0);
});

test('K2 rekord: druhý řádek jen při změně výbavy', () => {
  assert.equal(throwDiff(hit(100), hit(180, { record: true, hits: 4 })), null);
  const d = throwDiff(hit(100), hit(180, { record: true, gear: gear(1) }));
  assert.equal(d.causes[0].type, 'gear');
});

test('K2 řádek netvrdí příčinu: klíče nemají kauzální tvar', () => {
  const d = throwDiff(hit(100), hit(200, { gear: gear(1), hits: 5, wind: 3 }));
  for (const k of [d.key, ...d.causes.map(c => c.key)])
    assert.doesNotMatch(k, /because|due|cause\.(by|why)/);
  assert.deepEqual(Object.keys(d).sort(), ['causes', 'delta', 'key', 'kind', 'params']);
});

test('K3 nextGoal: začátek hry míří na Market, za dosažením na další, konec trasy null', () => {
  const g = nextGoal(fresh());
  assert.equal(g.placeIndex, 1);
  assert.equal(g.kind, ROUTE[1].kind);
  assert.equal(g.nameKey, 'place.' + ROUTE[1].kind);
  assert.ok(Math.abs(g.x - SCREEN_METERS) < 1e-9);
  assert.ok(Math.abs(g.metersLeft - SCREEN_METERS) < 1e-9);
  const g2 = nextGoal({ best: SCREEN_METERS + 1 });
  assert.equal(g2.placeIndex, 2);
  assert.ok(Math.abs(g2.metersLeft - (SCREEN_METERS - 1)) < 1e-9);
  assert.equal(nextGoal({ best: SCREEN_METERS * (ROUTE.length - 1) }), null);
  assert.equal(nextGoal({ best: 1e9 }), null);
  assert.equal(nextGoal({}).placeIndex, 1);
  assert.equal(nextGoal(null).placeIndex, 1);
});

test('K3 shouldPan: jen do 400 m, reduced nikdy', () => {
  assert.equal(shouldPan(100, 500), true);
  assert.equal(shouldPan(100, 501), false);
  assert.equal(shouldPan(100, 300, true), false);
  assert.equal(shouldPan(NaN, 300), false);
});

test('K9 chapterTrigger: hranice čtvrtí 5, 9, 13 a jen poprvé', () => {
  assert.equal(chapterTrigger(0, SECTION_METERS - 1), null);
  assert.equal(chapterTrigger(0, SECTION_METERS), 1);
  assert.equal(chapterTrigger(SECTION_METERS - 5, SECTION_METERS + 5), 1);
  assert.equal(chapterTrigger(2 * SECTION_METERS - 1, 2 * SECTION_METERS + 1), 2);
  assert.equal(chapterTrigger(3 * SECTION_METERS - 1, 3 * SECTION_METERS + 1), 3);
});

test('K9 chapterTrigger: znovu nikdy, přeletí-li dvě hranice jen vyšší', () => {
  assert.equal(chapterTrigger(SECTION_METERS + 1, SECTION_METERS + 50), null);
  assert.equal(chapterTrigger(SECTION_METERS, SECTION_METERS * 1.5), null);
  assert.equal(chapterTrigger(10, 2.5 * SECTION_METERS), 2);
  assert.equal(chapterTrigger(10, 3.5 * SECTION_METERS), 3);
  assert.equal(chapterTrigger(undefined, NaN), null);
});

test('§1 airFocus: pro každou dvojici vyhraje vyšší priorita', () => {
  for (let i = 0; i < FOCUS_ORDER.length; i++)
    for (let j = i + 1; j < FOCUS_ORDER.length; j++) {
      const r = airFocus({ [FOCUS_ORDER[i]]: true, [FOCUS_ORDER[j]]: true });
      assert.equal(r.focus, FOCUS_ORDER[i]);
      assert.deepEqual(r.muted, [FOCUS_ORDER[j]]);
    }
});

test('§1 airFocus: jedna věc, nic, pořadí zadání nehraje roli, nic se neruší', () => {
  assert.deepEqual(airFocus({}), { focus: null, muted: [], camera: false });
  assert.equal(airFocus({ ribbon: true }).focus, 'ribbon');
  const all = Object.fromEntries(FOCUS_ORDER.map(k => [k, true]));
  const r = airFocus(all);
  assert.equal(r.focus, 'qte');
  assert.deepEqual([r.focus, ...r.muted], FOCUS_ORDER);
});

test('§1 airFocus: při reduced nikdy pohyb kamery', () => {
  const all = Object.fromEntries(FOCUS_ORDER.map(k => [k, true]));
  assert.equal(airFocus(all, true).camera, false);
  assert.equal(airFocus({ newPlace: true }, true).camera, false);
  assert.equal(airFocus({ newPlace: true }, false).camera, true);
});

test('§5 throwReasons: rekord, rozdíl, blízký cíl, novinka, nové místo, koupě', () => {
  const p = save({ best: SCREEN_METERS - 50, coins: 500 });
  const diff = { kind: 'diff' };
  assert.deepEqual(throwReasons({ dist: p.best, prevBest: 100, p, diff, novelties: 1 }), [
    'R',
    'M',
    'C',
    'N',
    'K',
  ]);
  const q = save({ best: SCREEN_METERS + 10, coins: 0 });
  assert.deepEqual(throwReasons({ dist: q.best, prevBest: SCREEN_METERS - 10, p: q }), ['R', 'P']);
  assert.deepEqual(throwReasons({ dist: 50, prevBest: 100, p: save({ best: 100 }) }), []);
});

test('§5 dryRun: nejdelší řada hodů jen s koupí nebo bez důvodu', () => {
  assert.equal(dryRun([['R'], ['K'], [], ['K'], ['K'], ['M']]), 4);
  assert.equal(dryRun([['K', 'R'], []]), 1);
  assert.equal(dryRun([]), 0);
});

test('determinismus: bez Math.random a času, vstupy se nemění', () => {
  const src = readFileSync(new URL('../src/result.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /Math\.random|Date\.now|performance\.now|new Date/);
  const a = hit(100),
    b = hit(180, { gear: gear(1), hits: 4, wind: 3 }),
    p = save({ best: 400, coins: 100 }),
    s = { qte: true, ribbon: true };
  const snap = JSON.stringify([a, b, p, s]);
  const d1 = throwDiff(a, b);
  nextGoal(p);
  throwReasons({ dist: 180, prevBest: 100, p, diff: d1, novelties: 2 });
  airFocus(s);
  chapterTrigger(10, 4000);
  assert.equal(JSON.stringify([a, b, p, s]), snap);
  assert.deepEqual(throwDiff(a, b), d1);
});

// M2: fakta hodu z letu hry (src/flight.js). Paper = úroveň papíru (tempo π), vítr v m/s se škáluje s π.
test('throwFacts: gear from the flight kit (levels power/paper/folds, model, Atlas), wind in m/s, stats from events', () => {
  const p = { ...fresh(), attempts: 5, best: 700, levels: { power: 1, paper: 4, folds: 2 } },
    f = flightFor(p, 20, 0.8);
  while (!f.landed) step(f);
  const a = throwFacts(f, { hint: 'angle.ok', record: true });
  assert.deepEqual(a.gear, {
    levels: { power: 1, paper: 4, folds: 2 },
    model: 'dart',
    atlas: kitOf(p).atlas,
  });
  assert.equal(a.dist, f.x);
  assert.equal(a.grade, 'strong');
  assert.equal(a.record, true);
  assert.equal(a.hint, 'angle.ok');
  assert.ok(Math.abs(a.wind - f.w * 11 * f.d.pi) < 1e-9, 'Dart cruise 11 m/s × π');
  const fast = { ...f, d: { ...f.d, pi: 2 * f.d.pi } };
  assert.ok(Math.abs(throwFacts(fast).wind - 2 * a.wind) < 1e-9 || a.wind === 0);
  const b = {
    ...a,
    gear: { ...a.gear, levels: { ...a.gear.levels, paper: 5 } },
    dist: a.dist + 200,
    record: false,
  };
  const d = throwDiff(a, b);
  assert.deepEqual(d.causes[0].params, { item: 'level:paper:5' });
});
