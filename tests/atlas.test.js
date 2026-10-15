import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/atlas-content.js';
import { PROVISIONAL as N } from '../src/atlas-numbers.js';
import { SCREEN_METERS } from '../src/scenes.js';
import {
  placeStates,
  nextGoal,
  levelOf,
  nextCost,
  upgradeStatus,
  canUpgrade,
  upgrade,
  undoLast,
  clearUndo,
  buyPocket,
  pocketStatus,
  canEquip,
  equip,
  specialsView,
  discoveries,
  queueNovelties,
  takeNovelty,
  districtSummary,
  atlasNotice,
  markSeen,
  nodeStates,
  buyNode,
  opensPaper,
  parseNovelty,
  noveltyKey,
  heardLines,
  openAtlas,
  showHint,
  emptyAtlas,
} from '../src/atlas.js';

// State shaped exactly like p.atlas in §6.2 (save v4).
const atlas = (o = {}) => ({
  levels: {},
  seen: [],
  met: [],
  pending: [],
  lines: {},
  pockets: { owned: 0, slots: [null, null] },
  nodes: { nightRoute: false },
  finished: false,
  hintOpens: 0,
  undo: null,
  ...o,
});
const P = (best, coins = 0, o = {}) => ({ version: 4, coins, best, atlas: atlas(o) });
const at = i => i * SCREEN_METERS,
  FINISH = 16 * SCREEN_METERS;

test('place states derive from the record: exact boundaries and the Glider at 100 m', () => {
  let s = placeStates(P(99.9));
  assert.equal(s[0].state, 'teaser');
  assert.equal(s[0].bonus, 'glider');
  assert.ok(Math.abs(s[0].metersToGo - 0.1) < 1e-9);
  s = placeStates(P(100));
  assert.equal(s[0].state, 'found');
  assert.equal(s[1].state, 'teaser');
  s = placeStates(P(at(1) - 1e-6));
  assert.equal(s[1].state, 'teaser');
  for (const i of [1, 4, 7, 15]) {
    s = placeStates(P(at(i)));
    assert.equal(s[i].state, 'found', `place ${i} at exactly ${i}·SCREEN_METERS`);
    if (i < 15) assert.equal(s[i + 1].state, 'teaser');
  }
  s = placeStates(P(at(2) - 1));
  assert.deepEqual(
    s.slice(0, 8).map(x => x.state),
    ['found', 'found', 'teaser', 'unknown', 'frame', 'frame', 'frame', 'frame'],
  );
  assert.equal(placeStates(P(FINISH)).filter(x => x.state === 'teaser').length, 0);
  assert.equal(placeStates(P(FINISH)).length, N.route.places);
});
test('at most one teaser, and nothing beyond it leaks (08 N2 guard)', () => {
  for (let best = 0; best <= FINISH + 50; best += 37) {
    const p = P(best),
      s = placeStates(p),
      teasers = s.filter(x => x.state === 'teaser');
    assert.ok(teasers.length <= 1);
    const k = s.findIndex(x => x.state !== 'found' && x.state !== 'level' && x.state !== 'max'),
      out = JSON.stringify(s);
    if (k < 0) continue;
    const reached = Math.max(
      ...s
        .filter(x => x.state === 'found' || x.state === 'level' || x.state === 'max')
        .map(x => x.district),
      0,
    );
    for (let i = k + 1; i < 16; i++) {
      const pl = C.PLACES[i];
      assert.ok(
        !out.includes(pl.name) && !out.includes(pl.teaser) && !out.includes(`"${pl.id}"`),
        `place ${i} leaked at ${best} m`,
      );
      if (C.PLACES.slice(0, k + 1).every(x => x.bonus !== pl.bonus))
        assert.ok(!out.includes(C.BONUSES[pl.bonus].name), `bonus of place ${i} leaked`);
      assert.equal(s[i].state, s[i].district <= reached ? 'unknown' : 'frame');
    }
  }
});
test('next goal and district summary only for reached districts', () => {
  assert.deepEqual(nextGoal(P(0)), { placeId: 'roofs', index: 0, metersToGo: 100 });
  const g = nextGoal(P(at(2) - 86));
  assert.equal(g.placeId, 'gardens');
  assert.ok(Math.abs(g.metersToGo - 86) < 1e-9);
  assert.deepEqual(nextGoal(P(FINISH)), { delivered: true });
  assert.deepEqual(districtSummary(P(at(2) - 1)), [{ index: 0, id: 'violet', found: 2, total: 4 }]);
  assert.deepEqual(
    districtSummary(P(at(5))).map(x => x.found),
    [4, 2],
  );
});
test('levels, prices, missing coins, maximum, undo and its cancellation by a throw', () => {
  const p = P(at(1), 1000);
  assert.equal(levelOf(p, 'chain'), 1);
  assert.equal(levelOf(p, 'pinwheel'), 0);
  assert.equal(nextCost('chain', 1), N.atlas.prices.chain[1]);
  assert.equal(nextCost('chain', N.atlas.maxLevel.chain), null);
  assert.equal(upgradeStatus(p, 'pinwheel').reason, 'unknown');
  assert.equal(upgradeStatus(p, 'glider').reason, 'unlevelled');
  const poor = P(at(1), 5);
  assert.deepEqual(
    [upgradeStatus(poor, 'chain').reason, upgradeStatus(poor, 'chain').missing],
    ['coins', N.atlas.prices.chain[1] - 5],
  );
  assert.equal(upgrade(poor, 'chain'), false);
  assert.equal(poor.coins, 5);
  assert.ok(upgrade(p, 'chain'));
  assert.equal(levelOf(p, 'chain'), 2);
  assert.equal(p.atlas.levels.chain, 1);
  assert.deepEqual(p.atlas.undo, { id: 'chain', level: 2, price: N.atlas.prices.chain[1] });
  assert.ok(undoLast(p));
  assert.equal(levelOf(p, 'chain'), 1);
  assert.equal(p.coins, 1000);
  assert.equal(p.atlas.levels.chain, undefined);
  assert.equal(undoLast(p), false);
  while (canUpgrade(p, 'chain')) upgrade(p, 'chain');
  assert.equal(levelOf(p, 'chain'), N.atlas.maxLevel.chain);
  assert.equal(upgradeStatus(p, 'chain').reason, 'max');
  assert.equal(placeStates(p)[1].state, 'max');
  clearUndo(p);
  assert.equal(p.atlas.undo, null);
  assert.equal(undoLast(p), false);
  // stored levels above the maximum are clamped in reading
  assert.equal(levelOf(P(at(1), 0, { levels: { chain: 99 } }), 'chain'), N.atlas.maxLevel.chain);
});
test('no fixed 3 levels or prices: logic follows the numbers module', () => {
  const n = structuredClone(N);
  n.atlas.maxLevel.chain = 5;
  n.atlas.prices.chain = [null, 10, 20, 30, 40];
  n.atlas.values.chain = [1, 2, 3, 4, 5].map(k => ({ step: k / 100, max: k }));
  const p = P(at(1), 1000);
  let k = 0;
  while (upgrade(p, 'chain', C, n)) k++;
  assert.equal(k, 4);
  assert.equal(levelOf(p, 'chain', C, n), 5);
  assert.equal(p.coins, 900);
  assert.equal(placeStates(p, C, n)[1].state, 'max');
  n.atlas.prices.pinwheel = [null, null, null];
  assert.equal(upgradeStatus(P(at(2), 1e6), 'pinwheel', C, n).reason, 'soon');
});
test('pockets: second one from Red Horizon, one active, Sharp Edge × Calm Sky, free swap', () => {
  const p = P(at(1), 10000);
  assert.equal(pocketStatus(p).next.price, N.pockets.prices[0]);
  assert.equal(canEquip(p, 0, 'cushion').reason, 'slot');
  assert.ok(buyPocket(p));
  assert.equal(p.coins, 10000 - N.pockets.prices[0]);
  assert.equal(p.atlas.pockets.owned, 1);
  assert.equal(pocketStatus(p).next.reason, 'later');
  assert.equal(buyPocket(p), false);
  assert.equal(canEquip(p, 0, 'dive').reason, 'later');
  assert.equal(canEquip(p, 0, 'nope').reason, 'unknown');
  assert.ok(equip(p, 0, 'cushion'));
  assert.ok(equip(p, 0, 'sharp'));
  assert.deepEqual(p.atlas.pockets.slots, ['sharp', null]);
  const red = P(at(8), 10000, { pockets: { owned: 1, slots: ['cushion', null] } });
  assert.ok(buyPocket(red));
  assert.equal(red.atlas.pockets.owned, 2);
  assert.deepEqual(canEquip(red, 1, 'dive'), { ok: false, reason: 'active', other: 'cushion' });
  assert.ok(equip(red, 1, 'sharp'));
  assert.deepEqual(canEquip(red, 0, 'calm'), { ok: false, reason: 'exclusive', other: 'sharp' });
  const coins = red.coins;
  assert.ok(equip(red, 0, 'whistle'));
  assert.ok(equip(red, 0, 'cushion'));
  assert.equal(red.coins, coins);
  assert.ok(equip(red, 0, 'sharp'));
  assert.deepEqual(red.atlas.pockets.slots, ['sharp', null]); // moving an equipped special
  assert.ok(equip(red, 1, null));
  const v = specialsView(P(at(1), 0, { pockets: { owned: 1, slots: [null, null] } }), 0);
  assert.deepEqual(
    [v.active.map(x => x.id), v.passive.map(x => x.id), v.moreIn],
    [['cushion'], ['sharp'], 1],
  );
});
test('novelties: one per throw by priority, the rest waits', () => {
  const p = P(at(5));
  const list = discoveries(0, at(5), p);
  assert.deepEqual(list.map(x => x.type).slice(0, 1), ['district']);
  assert.ok(list.some(x => x.type === 'bonus' && x.id === 'pinwheel' && x.paper === 'kraft'));
  queueNovelties(p, list);
  const n0 = p.atlas.pending.length;
  queueNovelties(p, list);
  assert.equal(p.atlas.pending.length, n0);
  const first = takeNovelty(p);
  assert.equal(first.type, 'district');
  assert.deepEqual(first.specials, ['dive', 'calm']);
  assert.equal(p.atlas.lines.marge, 1);
  assert.equal(p.atlas.pending.length, n0 - 1);
  const order = [];
  let x;
  while ((x = takeNovelty(p))) order.push(x.type);
  assert.deepEqual(
    order,
    [...order].sort(
      (a, b) => ['bonus', 'paper', 'line'].indexOf(a) - ['bonus', 'paper', 'line'].indexOf(b),
    ),
  );
  assert.equal(takeNovelty(p), null);
  assert.equal(p.atlas.lines.bolts, 3);
  const fin = P(FINISH - 1);
  queueNovelties(fin, discoveries(FINISH - 1, FINISH, fin));
  queueNovelties(fin, [{ type: 'bonus', id: 'onAir' }]);
  assert.equal(takeNovelty(fin).type, 'finale');
  assert.ok(fin.atlas.finished);
  assert.equal(fin.atlas.lines.zippy, 3);
  // migration summary from storage.js and string keys round-trip
  const m = P(at(3), 0, { pending: [{ kind: 'pastFlights', places: 3 }] });
  assert.deepEqual(takeNovelty(m), { type: 'past', count: 3 });
  for (const k of ['chain', 'district:moon', 'paper:washi', 'line:stella:2', 'finale'])
    assert.equal(JSON.stringify(noveltyKey(parseNovelty(k))), JSON.stringify(k));
  assert.equal(parseNovelty('nope'), null);
  assert.equal(parseNovelty('line:bolts:9'), null);
  const heard = P(at(3), 0, { lines: { bolts: 2 } });
  queueNovelties(heard, [{ type: 'line', character: 'bolts', n: 2 }]);
  assert.equal(heard.atlas.pending.length, 0);
  assert.deepEqual(heardLines(heard, 0), C.DISTRICTS[0].character.lines.slice(0, 2));
});
test('paper opens on the openAtPlace-th place of a district', () => {
  assert.deepEqual(
    [0, 1, 2, 3, 4, 6, 10, 14].map(i => opensPaper(i)),
    [null, null, 'kraft', null, null, 'washi', 'neon', null],
  );
  assert.equal(opensPaper(1, { ...N, paper: { ...N.paper, openAtPlace: 2 } }), 'kraft');
});
// Night Route is hidden and Autopilot waits for the 2nd wave (A2): neither is listed by default; the node logic is checked with both switched on.
const CN = {
  ...C,
  NODES: {
    nightRoute: { ...C.NODES.nightRoute, hidden: false },
    autoQte: { ...C.NODES.autoQte, wave: 1 },
  },
};
test('Night Route and Autopilot are not listed by default', () => {
  const done = P(FINISH, 1e6, { finished: true });
  assert.deepEqual(nodeStates(done), []);
  assert.equal(buyNode(done, 'nightRoute'), false);
  assert.equal(C.NODES.nightRoute.hidden, true);
  assert.equal(C.NODES.autoQte.wave, 2);
});
test('Night Route only after the route is finished; Autopilot waits for a price', () => {
  const p = P(at(15), 1e6);
  assert.ok(!nodeStates(p, CN).some(x => x.id === 'nightRoute'));
  assert.equal(nodeStates(p, CN).find(x => x.id === 'autoQte').state, 'soon');
  const done = P(FINISH, 1e6, { finished: true });
  assert.equal(nodeStates(done, CN).find(x => x.id === 'nightRoute').state, 'soon');
  assert.equal(buyNode(done, 'nightRoute', CN), false);
  const n = structuredClone(N);
  n.nodes.nightRoute.price = 2000;
  assert.equal(buyNode(P(at(15), 1e6), 'nightRoute', CN, n), false);
  assert.ok(buyNode(done, 'nightRoute', CN, n));
  assert.equal(done.coins, 1e6 - 2000);
  assert.equal(done.atlas.nodes.nightRoute, true);
  assert.equal(nodeStates(done, CN, n).find(x => x.id === 'nightRoute').state, 'owned');
});
test('atlas notice reacts to unseen things only, never to affordable purchases', () => {
  const p = P(50, 1e6);
  assert.equal(atlasNotice(p), false);
  p.best = 100;
  assert.equal(atlasNotice(p), true);
  markSeen(p, 'glider');
  assert.equal(atlasNotice(p), false);
  p.best = at(1);
  markSeen(p, 'chain');
  assert.ok(canUpgrade(p, 'chain'));
  assert.equal(pocketStatus(p).next.ok, true);
  assert.equal(atlasNotice(p), false);
  buyPocket(p);
  assert.equal(atlasNotice(p), true);
  markSeen(p, 'cushion');
  markSeen(p, 'sharp');
  assert.equal(atlasNotice(p), false);
  const n = structuredClone(N);
  n.nodes.autoQte.price = 10;
  assert.equal(atlasNotice(p, CN, n), true);
});
test('hint collapses after three opens; functions tolerate a missing atlas', () => {
  const p = P(0);
  for (let i = 0; i < 3; i++) {
    assert.ok(showHint(p));
    openAtlas(p);
  }
  assert.equal(showHint(p), false);
  const bare = { coins: 0, best: at(1) };
  assert.equal(placeStates(bare)[1].state, 'found');
  assert.equal(atlasNotice(bare), true);
  markSeen(bare, 'glider');
  assert.deepEqual(bare.atlas.seen, ['glider']);
  assert.deepEqual(Object.keys(emptyAtlas()).sort(), Object.keys(atlas()).sort());
});

test('novelty keys reject inherited object names', async () => {
  const { isNoveltyKey } = await import('../src/atlas.js');
  for (const k of [
    'constructor',
    'toString',
    '__proto__',
    'paper:constructor',
    'paper:toString',
    'hasOwnProperty',
  ])
    assert.equal(isNoveltyKey(k), false, k);
  assert.equal(isNoveltyKey('paper:kraft'), true);
});
