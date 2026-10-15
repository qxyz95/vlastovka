import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fresh, settle, FINISH } from '../src/core.js';
import { KEY, load, decode, decodeSave, LEGACY_PRICES } from '../src/storage.js';
function mockStorage(data) {
  const store = { ...data };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
    },
  });
  return store;
}
test('corrupt save is backed up instead of silently lost', () => {
  const store = mockStorage({ [KEY]: '{broken' });
  const { data, warning } = load();
  assert.deepEqual(data, fresh());
  assert.equal(store[KEY + '-corrupt'], '{broken');
  assert.match(warning, /zálohovaná/);
});
test('missing localStorage falls back to a fresh game', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw Error('denied');
    },
  });
  const { data, warning } = load();
  assert.deepEqual(data, fresh());
  assert.ok(warning);
});
test('NaN landing distance cannot corrupt the save', () => {
  const p = { ...fresh(), coins: 50, best: 120 };
  const f = { landed: true, settled: false, x: NaN, startX: 0 };
  assert.ok(settle(p, f));
  assert.equal(p.coins, 60);
  assert.equal(p.best, 120);
  assert.ok(Number.isSafeInteger(JSON.parse(JSON.stringify(p)).coins));
});

// M2: save v5 (Dílna Power 3 / Paper 12 / Folds 3). Migrace v1–v4 → v5: mince utracené za starou Dílnu (3 × 5 úrovní,
// LEGACY_PRICES) se vrátí, úrovně se vynulují, rekord, pokusy, model a Atlas zůstanou (rozhodnutí 06, 15. 10.).
const old = (version, levels, o = {}) => ({
  version,
  coins: 40,
  levels,
  model: 'glider',
  best: 650,
  completed: true,
  attempts: 31,
  ...o,
});
const L = (power, paper, fold) => ({ power, paper, fold });
const paid = n => LEGACY_PRICES.slice(0, n).reduce((a, b) => a + b, 0);
test('v5: fresh save, round trip, refund 0', () => {
  const p = fresh();
  assert.equal(p.version, 5);
  assert.deepEqual(p.levels, { power: 0, paper: 0, folds: 0 });
  const q = { ...fresh(), coins: 9, best: 800, levels: { power: 3, paper: 7, folds: 2 } };
  assert.deepEqual(decodeSave(JSON.stringify(q)), {
    data: q,
    lossy: false,
    broken: false,
    refund: 0,
  });
});
test('v1, v3, v4 → v5: old Workshop refunded, levels reset, the rest kept', () => {
  assert.deepEqual(LEGACY_PRICES, [35, 105, 195, 300, 420]);
  for (const version of [1, 3, 4]) {
    const raw = old(version, L(3, 2, 5), version === 4 ? { atlas: fresh().atlas } : {}),
      { data, refund } = decodeSave(JSON.stringify(raw));
    assert.equal(refund, paid(3) + paid(2) + paid(5), `v${version}`);
    assert.equal(refund, 335 + 140 + 1055);
    assert.equal(data.version, 5);
    assert.equal(data.coins, 40 + refund);
    assert.deepEqual(data.levels, fresh().levels);
    assert.deepEqual([data.best, data.attempts, data.model], [650, 31, 'glider']);
    assert.equal(data.completed, false, 'completed = whole route (4 876 m), not 500 m');
    const again = decodeSave(JSON.stringify(data));
    assert.equal(again.refund, 0, 'no second refund after the save was written');
    assert.deepEqual(again.data, data);
  }
  assert.equal(decode(JSON.stringify(old(3, L(0, 0, 0), { best: FINISH }))).completed, true);
  assert.equal(decodeSave(JSON.stringify(old(3, L(0, 0, 0)))).refund, 0);
});
test('v2 → v5: both per-model trees were paid for, both are refunded', () => {
  const { data, refund } = decodeSave(
    JSON.stringify(old(2, { dart: L(3, 0, 1), glider: L(1, 4, 0) })),
  );
  assert.equal(refund, paid(3) + paid(1) + paid(1) + paid(4));
  assert.equal(data.coins, 40 + refund);
  assert.deepEqual(data.levels, fresh().levels);
});
test('broken levels in any version: the raw save is backed up, not lost', () => {
  const bad = [
    old(3, L(6, 0, 0)),
    old(2, { dart: L(1, 1, 1) }),
    old(1, { power: 1, paper: 1 }),
    { ...fresh(), levels: { power: 4, paper: 0, folds: 0 } },
    { ...fresh(), levels: { power: 0, paper: 13, folds: 0 } },
    { ...fresh(), levels: { power: 0, paper: 0, fold: 0 } },
    { ...fresh(), levels: { power: 0, paper: 0, folds: 0, extra: 1 } },
    { ...fresh(), levels: { power: 0.5, paper: 0, folds: 0 } },
    { ...fresh(), version: 6 },
  ];
  for (const p of bad) {
    const raw = JSON.stringify(p),
      store = mockStorage({ [KEY]: raw });
    const { data, warning, refund } = load();
    assert.deepEqual(data, fresh(), raw);
    assert.equal(store[KEY + '-corrupt'], raw);
    assert.ok(warning);
    assert.equal(refund, 0);
  }
});
test('load() reports the refund of a migrated save and does not write; loading again gives the same (no double refund)', () => {
  const raw = JSON.stringify(old(4, L(1, 1, 1), { atlas: fresh().atlas })),
    store = mockStorage({ [KEY]: raw });
  const a = load();
  assert.equal(a.refund, 3 * 35);
  assert.equal(a.warning, '');
  assert.equal(store[KEY], raw, 'load does not write');
  assert.ok(!(KEY + '-corrupt' in store));
  assert.equal(load().refund, 3 * 35);
});
