import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fresh } from '../src/core.js';
import { SCREEN_METERS } from '../src/scenes.js';
import {
  KEY,
  load,
  decode,
  decodeSave,
  sanitizeAtlas,
  placesFound,
  ATLAS_BONUSES,
  ATLAS_SPECIALS,
  ATLAS_NODES,
  ATLAS_ACTIVE,
  ATLAS_EXCLUSIVE,
  ATLAS_CHARACTERS,
  MAX_POCKETS,
} from '../src/storage.js';
import { BONUSES, SPECIALS, NODES, DISTRICTS } from '../src/atlas-content.js';
import { NUMBERS } from '../src/atlas-numbers.js';
import { discoveries, noveltyKey } from '../src/atlas.js';
import { defaults } from '../simulation/progression/params.mjs';
const P = defaults();
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
const v3 = o => ({
  version: 3,
  coins: 40,
  levels: { power: 1, paper: 0, fold: 2 },
  model: 'dart',
  best: 0,
  completed: false,
  attempts: 5,
  ...o,
});
// Současná verze save (v5 od M2) s daným atlasem.
const v4 = atlas => ({ ...fresh(), coins: 40, best: 700, completed: false, atlas });
test('fresh save is v5 with an empty atlas and survives a round trip', () => {
  const p = fresh();
  assert.equal(p.version, 5);
  assert.deepEqual(p.atlas, {
    levels: {},
    seen: [],
    pending: [],
    lines: {},
    pockets: { owned: 0, slots: [null, null] },
    nodes: { nightRoute: false },
    finished: false,
    hintOpens: 0,
    undo: null,
  });
  assert.deepEqual(decodeSave(JSON.stringify(p)), {
    data: p,
    lossy: false,
    broken: false,
    refund: 0,
  });
  const full = v4({
    levels: { chain: 2, tape: 1 },
    seen: ['glider', 'chain'],
    pending: ['pinwheel'],
    lines: { bolts: 2 },
    pockets: { owned: 2, slots: ['cushion', 'sharp'] },
    nodes: { nightRoute: true },
    finished: true,
    hintOpens: 3,
    undo: { id: 'tape', level: 2, price: 170 },
  });
  assert.deepEqual(decodeSave(JSON.stringify(full)), {
    data: full,
    lossy: false,
    broken: false,
    refund: 0,
  });
});
test('ID lists come from the Atlas modules and match the progression simulator', () => {
  assert.deepEqual(ATLAS_BONUSES, Object.keys(BONUSES));
  assert.deepEqual(ATLAS_SPECIALS, Object.keys(SPECIALS));
  assert.deepEqual(ATLAS_NODES, Object.keys(NODES));
  assert.deepEqual(
    ATLAS_CHARACTERS,
    DISTRICTS.map(d => d.character.id),
  );
  assert.ok(ATLAS_NODES.includes('autoQte'));
  assert.deepEqual(ATLAS_BONUSES, P.atlas.bonuses);
  assert.deepEqual(
    ATLAS_BONUSES.filter(id => NUMBERS.atlas.maxLevel[id] === 1),
    P.atlas.unlevelled,
  );
  assert.deepEqual([...ATLAS_SPECIALS].sort(), Object.keys(P.specials).sort());
  assert.deepEqual([...ATLAS_SPECIALS].sort(), Object.keys(P.pockets.unlock).sort());
  assert.deepEqual([...ATLAS_ACTIVE].sort(), [...P.pockets.active].sort());
  assert.deepEqual(ATLAS_EXCLUSIVE, P.pockets.exclusive);
  assert.equal(MAX_POCKETS, P.pockets.prices.length);
});
test('v3 → v5: empty atlas, one summary notice for records over several places', () => {
  const a = decode(JSON.stringify(v3({ best: 50 })));
  assert.equal(a.version, 5);
  assert.deepEqual(a.atlas, fresh().atlas);
  assert.deepEqual(a.levels, fresh().levels); // stará Dílna vynulovaná, mince vrácené (tests/storage.test.js)
  assert.equal(a.coins, 40 + 35 + 35 + 105);
  const b = decode(JSON.stringify(v3({ best: 3 * SCREEN_METERS + 1 })));
  assert.deepEqual(b.atlas.pending, [{ kind: 'pastFlights', places: 4 }]);
  assert.deepEqual({ ...b.atlas, pending: [] }, fresh().atlas);
  assert.deepEqual(decode(JSON.stringify(v3({ best: SCREEN_METERS }))).atlas.pending, [
    { kind: 'pastFlights', places: 2 },
  ]);
  assert.deepEqual(decode(JSON.stringify(v3({ best: SCREEN_METERS - 0.01 }))).atlas.pending, []);
  assert.equal(placesFound(1e6), 16);
  assert.equal(placesFound(0), 1);
  // a stray atlas in an old save is ignored, the migration starts clean
  assert.deepEqual(
    decode(JSON.stringify(v3({ best: 0, atlas: { levels: { chain: 2 } } }))).atlas,
    fresh().atlas,
  );
  // migrated save decodes to itself (no second notice)
  assert.deepEqual(decode(JSON.stringify(b)), b);
});
test('unknown IDs are dropped and levels clipped to the cap', () => {
  const { atlas, lossy, broken } = sanitizeAtlas({
    ...fresh().atlas,
    levels: { chain: 9, tape: 1, glider: 1, encore: 2, laser: 1, gull: -1, echo: 1.5, star: 0 },
    seen: ['chain', 'laser', 'chain', 'dive'],
    pending: [
      'laser',
      'tape',
      { kind: 'pastFlights', places: 3 },
      { kind: 'x' },
      { kind: 'pastFlights', places: 99 },
    ],
    nodes: { nightRoute: true, autoQte: true, moonRoute: true, autoQTE: 1 },
    lines: { bolts: 500, marge: 2, __proto__: 1, mira: 1 },
  });
  assert.ok(lossy);
  assert.ok(!broken);
  assert.deepEqual(atlas.levels, { chain: NUMBERS.atlas.maxLevel.chain - 1, tape: 1 });
  assert.deepEqual(atlas.seen, ['chain', 'dive']);
  assert.deepEqual(atlas.pending, ['tape', { kind: 'pastFlights', places: 3 }]);
  assert.deepEqual(atlas.nodes, { nightRoute: true, autoQte: true });
  assert.deepEqual(atlas.lines, { bolts: 3, marge: 2 });
});
test('level cap follows NUMBERS.atlas.maxLevel', () => {
  const n = NUMBERS.atlas.maxLevel,
    levels = Object.fromEntries(ATLAS_BONUSES.map(id => [id, 99])),
    r = sanitizeAtlas({ ...fresh().atlas, levels });
  assert.deepEqual(
    r.atlas.levels,
    Object.fromEntries(ATLAS_BONUSES.filter(id => n[id] > 1).map(id => [id, n[id] - 1])),
  );
  assert.ok(r.lossy);
  const exact = Object.fromEntries(
    ATLAS_BONUSES.filter(id => n[id] > 1).map(id => [id, n[id] - 1]),
  );
  assert.deepEqual(sanitizeAtlas({ ...fresh().atlas, levels: exact }), {
    atlas: { ...fresh().atlas, levels: exact },
    lossy: false,
    broken: false,
  });
  assert.deepEqual(
    sanitizeAtlas({ ...fresh().atlas, undo: { id: 'chain', level: n.chain, price: 1 } }).atlas.undo,
    { id: 'chain', level: n.chain, price: 1 },
  );
  assert.equal(
    sanitizeAtlas({ ...fresh().atlas, undo: { id: 'chain', level: n.chain + 1, price: 1 } }).atlas
      .undo,
    null,
  );
});
test('pending keeps every novelty key and drops unknown ones', () => {
  const keys = [
    'chain',
    'glider',
    'encore',
    'district:moon',
    'district:sunset',
    'district:core',
    'paper:kraft',
    'paper:washi',
    'paper:neon',
    'line:bolts:1',
    'line:marge:2',
    'line:stella:3',
    'line:zippy:3',
    'finale',
    { kind: 'pastFlights', places: 5 },
  ];
  const ok = sanitizeAtlas({ ...fresh().atlas, pending: keys });
  assert.deepEqual(ok.atlas.pending, keys);
  assert.ok(!ok.lossy);
  // everything discoveries() can queue over the whole route is accepted
  const all = discoveries(0, 1e6, fresh()).map(noveltyKey),
    r = sanitizeAtlas({ ...fresh().atlas, pending: all });
  assert.ok(all.length > 16);
  assert.deepEqual(r.atlas.pending, all);
  assert.ok(!r.lossy);
  const bad = [
    'laser',
    'district:violet',
    'district:mars',
    'paper:gold',
    'line:bolts:0',
    'line:bolts:4',
    'line:mira:1',
    'line:bolts',
    'finale:1',
    'constructor',
    'paper:constructor',
    'toString',
    '__proto__',
    'dive',
    'nightRoute',
    '',
    7,
    null,
    ['chain'],
    { kind: 'pastFlights', places: 1 },
    { kind: 'pastFlights', places: 17 },
    { kind: 'pastFlights', places: 3, x: 1 },
    { kind: 'finale' },
  ];
  const d = sanitizeAtlas({ ...fresh().atlas, pending: [...bad, 'tape'] });
  assert.deepEqual(d.atlas.pending, ['tape']);
  assert.ok(d.lossy);
  assert.ok(!d.broken);
});
test('pocket slots follow the rules', () => {
  const slots = (owned, s) =>
    sanitizeAtlas({ ...fresh().atlas, pockets: { owned, slots: s } }).atlas.pockets;
  assert.deepEqual(slots(2, ['dive', 'rocket']), { owned: 2, slots: ['dive', null] }); // one active ability
  assert.deepEqual(slots(2, ['sharp', 'calm']), { owned: 2, slots: ['sharp', null] }); // exclusive pair
  assert.deepEqual(slots(2, ['calm', 'dive']), { owned: 2, slots: ['calm', 'dive'] });
  assert.deepEqual(slots(1, ['cushion', 'sharp']), { owned: 1, slots: ['cushion', null] }); // slots ≤ owned
  assert.deepEqual(slots(0, ['cushion', null]), { owned: 0, slots: [null, null] });
  assert.deepEqual(slots(2, ['sharp', 'sharp']), { owned: 2, slots: ['sharp', null] });
  assert.deepEqual(slots(2, ['laser', 'whistle']), { owned: 2, slots: [null, 'whistle'] });
  assert.deepEqual(slots(5, ['sharp', 'dive', 'calm']), { owned: 2, slots: ['sharp', 'dive'] });
  assert.equal(
    sanitizeAtlas({ ...fresh().atlas, pockets: { owned: 2, slots: ['dive', 'rocket'] } }).lossy,
    true,
  );
});
test('invalid undo is cleared; wrong types reset fields and mark the atlas broken', () => {
  for (const undo of [
    { id: 'glider', level: 1, price: 0 },
    { id: 'chain', level: 9, price: 1 },
    { id: 'chain', level: 2, price: -5 },
    'chain',
  ])
    assert.equal(sanitizeAtlas({ ...fresh().atlas, undo }).atlas.undo, null);
  for (const a of [
    null,
    'x',
    [],
    { ...fresh().atlas, levels: [] },
    { ...fresh().atlas, seen: 'chain' },
    { ...fresh().atlas, pockets: { owned: '1', slots: [] } },
    { ...fresh().atlas, finished: 1 },
    { ...fresh().atlas, hintOpens: -1 },
  ]) {
    const r = sanitizeAtlas(a);
    assert.ok(r.broken, JSON.stringify(a));
  }
  const r = sanitizeAtlas({ ...fresh().atlas, seen: 'chain', levels: { chain: 1 } });
  assert.deepEqual(r.atlas.levels, { chain: 1 });
  assert.deepEqual(r.atlas.seen, []);
});
test('damaged atlas is backed up, the rest of the progress is kept', () => {
  const raw = JSON.stringify(v4('garbage')),
    store = mockStorage({ [KEY]: raw });
  const { data, warning } = load();
  assert.equal(store[KEY + '-corrupt'], raw);
  assert.match(warning, /backed up/);
  assert.equal(data.coins, 40);
  assert.equal(data.best, 700);
  assert.deepEqual(data.atlas, fresh().atlas);
  const missing = { ...fresh(), coins: 7 };
  delete missing.atlas;
  const s2 = mockStorage({ [KEY]: JSON.stringify(missing) });
  assert.equal(load().data.coins, 7);
  assert.ok(s2[KEY + '-corrupt']);
});
test('lossy sanitation backs up silently; clean and migrated saves make no backup', () => {
  const raw = JSON.stringify(v4({ ...fresh().atlas, seen: ['laser'] })),
    store = mockStorage({ [KEY]: raw });
  const { data, warning } = load();
  assert.equal(warning, '');
  assert.equal(store[KEY + '-corrupt'], raw);
  assert.deepEqual(data.atlas.seen, []);
  for (const p of [fresh(), v4(fresh().atlas), v3({ best: 900 })]) {
    const s = mockStorage({ [KEY]: JSON.stringify(p) });
    assert.equal(load().warning, '');
    assert.ok(!(KEY + '-corrupt' in s));
  }
});
