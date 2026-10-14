import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/atlas-content.js';
import { PROVISIONAL as N } from '../src/atlas-numbers.js';
import { P as SIM } from '../simulation/progression/params.mjs';
import { SCREEN_METERS } from '../src/scenes.js';
import {
  fmtCoins,
  fmtMeters,
  fmtPct,
  fill,
  effectLine,
  effectChange,
  teaserLine,
  goalLine,
  priceLine,
  pocketLine,
  reasonLine,
  noveltyLine,
  teaserBonusLine,
  levelToast,
  coinsLabel,
  FORBIDDEN,
} from '../src/atlas-text.js';
import {
  upgradeStatus,
  nextGoal,
  pocketStatus,
  canEquip,
  discoveries,
  parseNovelty,
} from '../src/atlas.js';
const P = (best, coins = 0, o = {}) => ({
  version: 4,
  coins,
  best,
  atlas: {
    levels: {},
    seen: [],
    pending: [],
    lines: {},
    pockets: { owned: 0, slots: [null, null] },
    nodes: { nightRoute: false },
    finished: false,
    hintOpens: 0,
    undo: null,
    ...o,
  },
});

test('number formats: en-US, one currency, units with a space', () => {
  assert.equal(fmtCoins(1240), '1,240 ◈');
  assert.equal(fmtCoins(10000), '10,000 ◈');
  assert.equal(fmtCoins(999999), '999,999 ◈');
  assert.equal(fmtCoins(1234567), '1.2M ◈');
  assert.equal(fmtMeters(86.4), '86 m');
  assert.equal(fmtMeters(1.5), '1.5 m');
  assert.equal(fmtPct(0.13, true), '+13 %');
  assert.equal(fmtPct(0.004, true), '+0.4 %');
  assert.equal(fmtPct(0.3), '30 %');
  assert.equal(coinsLabel(1240), '1,240 coins');
  assert.equal(fill('{a?x {b|+pct}}{c?never}', { a: 1, b: 0.1, c: false }), 'x +10 %');
  assert.equal(fill('{n|count:place}', { n: 1 }), '1 place');
});
test('every effect template has a value for every level of the numbers module', () => {
  for (const id of N.atlas.bonuses) {
    const b = C.BONUSES[id],
      max = N.atlas.maxLevel[id];
    assert.ok(b, `content for ${id}`);
    if (max <= 1) {
      assert.equal(b.effect, null);
      continue;
    }
    assert.equal(N.atlas.values[id].length, max, `${id} values`);
    assert.equal(N.atlas.prices[id].length, max, `${id} prices`);
    for (let l = 1; l <= max; l++) {
      const s = effectLine(id, N.atlas.values[id], l);
      assert.ok(s && !/[{}]/.test(s) && !/undefined|NaN/.test(s), `${id} level ${l}: ${s}`);
    }
    const ch = effectChange(id, 1);
    assert.ok(ch.now && ch.next && ch.now !== ch.next);
    assert.equal(effectChange(id, max).next, null);
  }
  assert.equal(
    effectLine('chain', N.atlas.values.chain, 1),
    'Each combo step adds +10 % push (max ×4)',
  );
});
test('content: 16 places with short teasers and a bonus, ids identical to params.mjs', () => {
  assert.equal(C.PLACES.length, 16);
  assert.equal(C.PLACES.length, SIM.route.places);
  assert.deepEqual(
    C.PLACES.map(x => x.bonus),
    SIM.atlas.bonuses,
  );
  assert.deepEqual(N.atlas.bonuses, SIM.atlas.bonuses);
  assert.deepEqual(Object.keys(C.BONUSES).sort(), [...SIM.atlas.bonuses].sort());
  assert.deepEqual(
    [...SIM.atlas.unlevelled].sort(),
    N.atlas.bonuses.filter(id => N.atlas.maxLevel[id] <= 1).sort(),
  );
  assert.deepEqual(Object.keys(C.SPECIALS).sort(), Object.keys(SIM.pockets.unlock).sort());
  assert.deepEqual([...N.pockets.active].sort(), [...SIM.pockets.active].sort());
  assert.equal(N.route.place, SCREEN_METERS);
  assert.equal(new Set(C.PLACES.map(x => x.id)).size, 16);
  for (const pl of C.PLACES) {
    assert.ok(pl.teaser.length > 0 && pl.teaser.length <= 90, `${pl.id} teaser`);
    assert.ok(pl.story && pl.name);
  }
  for (const d of C.DISTRICTS) assert.equal(d.character.lines.length, 3);
  for (const id of N.paper.kinds) assert.ok(C.PAPERS[id]);
  for (const id of Object.keys(C.NODES)) assert.ok(id in N.nodes);
  for (const id of Object.keys(C.BONUSES))
    for (const t of C.BONUSES[id].tags) assert.ok(C.TAGS[t], `${id} tag ${t}`);
});
const strings = o =>
  typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : [];
test('no pressure or loss wording anywhere in Atlas or character texts (02 N10)', () => {
  const all = strings([
    C.RULE,
    C.DISTRICTS,
    C.PLACES,
    C.BONUSES,
    C.TAGS,
    C.SPECIALS,
    C.PAPERS,
    C.NODES,
    C.TEXT,
  ]);
  assert.ok(all.length > 150);
  for (const s of all)
    for (const w of FORBIDDEN) assert.ok(!s.toLowerCase().includes(w), `"${w}" in: ${s}`);
  const all2 = [];
  for (let b = 0; b <= 16 * SCREEN_METERS; b += SCREEN_METERS)
    for (const x of discoveries(b - SCREEN_METERS, b, P(b))) all2.push(noveltyLine(x));
  for (const s of all2) for (const w of FORBIDDEN) assert.ok(!s.toLowerCase().includes(w));
});
test('lines for goals, prices, pockets, reasons and novelties', () => {
  assert.equal(
    goalLine(nextGoal(P(2 * SCREEN_METERS - 86))),
    'Next: Gardens at the Edge · 86 m past your best',
  );
  assert.equal(goalLine({ delivered: true }), 'Delivered. The Workshop is yours.');
  assert.equal(teaserLine(C.PLACES[2], 0.2), 'Gardens at the Edge · 1 m past your best');
  assert.equal(teaserBonusLine('pinwheel'), 'Pinwheel · Spin the wind before you throw.');
  assert.equal(priceLine(upgradeStatus(P(SCREEN_METERS, 1000), 'chain')), 'Level up · 40 ◈');
  assert.equal(priceLine(upgradeStatus(P(SCREEN_METERS, 10), 'chain')), '30 ◈ to go');
  assert.equal(
    priceLine(upgradeStatus(P(SCREEN_METERS, 0, { levels: { chain: 2 } }), 'chain')),
    'Max level',
  );
  assert.equal(pocketLine(pocketStatus(P(0))), 'Pocket 1 · 300 ◈');
  assert.equal(
    pocketLine(pocketStatus(P(SCREEN_METERS, 0, { pockets: { owned: 1, slots: [null, null] } }))),
    'Pocket 2 opens in Red Horizon',
  );
  const red = P(8 * SCREEN_METERS, 0, { pockets: { owned: 2, slots: ['sharp', null] } });
  assert.equal(reasonLine(canEquip(red, 1, 'calm'), 'calm'), "Sharp Edge and Calm Sky don't mix");
  assert.equal(
    noveltyLine(parseNovelty('pinwheel')),
    'Found: Gardens at the Edge → Pinwheel · Kraft Paper is in the Workshop',
  );
  assert.equal(
    noveltyLine(parseNovelty('district:sunset')),
    'New district: Red Horizon · New in your pockets: Whistle, Paper Rocket · Pocket 2 is open',
  );
  assert.equal(noveltyLine({ type: 'past', count: 3 }), 'Your past flights found 3 places');
  assert.match(noveltyLine(parseNovelty('line:bolts:1')), /^Bolts: “Oh\. A paper plane/);
  assert.equal(levelToast('chain', 2), 'Crowd Chain · Level 2');
});
