import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/atlas-content.js';
import { PROVISIONAL as N } from '../src/atlas-numbers.js';
import { P as SIM } from '../simulation/progression/params.mjs';
import { SCREEN_METERS } from '../src/scenes.js';
import { setLang, setStrict, LOCALES } from '../src/i18n.js';
import {
  fmtCoins,
  fmtMeters,
  fmtPct,
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
  FORBIDDEN_BY_LANG,
} from '../src/atlas-text.js';
import {
  upgradeStatus,
  nextGoal,
  pocketStatus,
  canEquip,
  discoveries,
  parseNovelty,
} from '../src/atlas.js';
setStrict(true);
// Units use a no-break space (i18n unit); the expectations are written with plain spaces.
const norm = v => (typeof v === 'string' ? v.replaceAll(' ', ' ') : v);
const eq = (actual, expected) => assert.equal(norm(actual), norm(expected));
// Runs fn in a language and restores English.
const inLang = (lang, fn) => {
  setLang(lang);
  try {
    return fn();
  } finally {
    setLang('en');
  }
};
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

test('number formats follow the language, one currency, units with a space', () => {
  inLang('en', () => {
    eq(fmtCoins(1240), '1,240 ◈');
    eq(fmtCoins(10000), '10,000 ◈');
    eq(fmtCoins(999999), '999,999 ◈');
    eq(fmtCoins(1234567), '1.2M ◈');
    eq(fmtMeters(86.4), '86 m');
    eq(fmtMeters(1.5), '1.5 m');
    eq(fmtPct(0.13, true), '+13 %');
    eq(fmtPct(0.004, true), '+0.4 %');
    eq(fmtPct(0.3), '30 %');
    eq(coinsLabel(1240), '1,240 coins');
    eq(coinsLabel(1), '1 coin');
  });
  inLang('cs', () => {
    eq(fmtCoins(1240), '1 240 ◈');
    eq(fmtCoins(1234567), '1,2 mil. ◈');
    eq(fmtMeters(1.5), '1,5 m');
    eq(fmtMeters(86.4), '86 m');
    eq(fmtPct(0.004, true), '+0,4 %');
    eq(fmtPct(0.13, true), '+13 %');
    eq(coinsLabel(1), '1 mince');
    eq(coinsLabel(5), '5 mincí');
    eq(coinsLabel(1240), '1 240 mincí');
  });
});
test('every effect template has a value for every level of the numbers module', () => {
  for (const id of N.atlas.bonuses) {
    const b = C.BONUSES[id],
      max = N.atlas.maxLevel[id];
    assert.ok(b, `content for ${id}`);
    if (max <= 1) {
      eq(b.effect, null);
      continue;
    }
    eq(N.atlas.values[id].length, max, `${id} values`);
    eq(N.atlas.prices[id].length, max, `${id} prices`);
    for (let l = 1; l <= max; l++) {
      const s = effectLine(id, N.atlas.values[id], l);
      assert.ok(s && !/[{}]/.test(s) && !/undefined|NaN/.test(s), `${id} level ${l}: ${s}`);
    }
    const ch = effectChange(id, 1);
    assert.ok(ch.now && ch.next && ch.now !== ch.next);
    eq(effectChange(id, max).next, null);
  }
  eq(
    effectLine('chain', N.atlas.values.chain, 1),
    'Each combo step adds +10 % push, up to Combo ×4.',
  );
});
test('content: 16 places with short teasers and a bonus, ids identical to params.mjs', () => {
  eq(C.PLACES.length, 16);
  eq(C.PLACES.length, SIM.route.places);
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
  eq(N.route.place, SCREEN_METERS);
  eq(new Set(C.PLACES.map(x => x.id)).size, 16);
  for (const pl of C.PLACES) {
    assert.ok(pl.teaser.length > 0 && pl.teaser.length <= 90, `${pl.id} teaser`);
    assert.ok(pl.story && pl.name);
  }
  for (const d of C.DISTRICTS) eq(d.character.lines.length, 3);
  for (const id of N.paper.kinds) assert.ok(C.PAPERS[id]);
  for (const id of Object.keys(C.NODES)) assert.ok(id in N.nodes);
  for (const id of Object.keys(C.BONUSES))
    for (const t of C.BONUSES[id].tags) assert.ok(C.TAGS[t], `${id} tag ${t}`);
});
const strings = o =>
  typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : [];
const walkNovelties = () => {
  const out = [];
  for (let b = 0; b <= 16 * SCREEN_METERS; b += SCREEN_METERS)
    for (const x of discoveries(b - SCREEN_METERS, b, P(b))) out.push(noveltyLine(x));
  return out;
};
test('no pressure or loss wording anywhere in Atlas or character texts (02 N10), in both languages', () => {
  for (const lang of ['en', 'cs'])
    inLang(lang, () => {
      const all = strings([
        C.DISTRICTS,
        C.PLACES,
        C.BONUSES,
        C.TAGS,
        C.SPECIALS,
        C.PAPERS,
        C.NODES,
        Object.entries(LOCALES[lang])
          .filter(([k]) => k.startsWith('atlas.'))
          .map(([, v]) => v),
        walkNovelties(),
      ]);
      assert.ok(all.length > 400, lang);
      for (const s of all)
        for (const w of FORBIDDEN)
          assert.ok(!s.toLowerCase().includes(w), `${lang}: "${w}" in: ${s}`);
    });
  assert.ok(FORBIDDEN_BY_LANG.en.every(w => FORBIDDEN.includes(w)));
  assert.ok(FORBIDDEN_BY_LANG.cs.every(w => FORBIDDEN.includes(w)));
});
test('lines for goals, prices, pockets, reasons and novelties (EN)', () => {
  eq(
    goalLine(nextGoal(P(2 * SCREEN_METERS - 86))),
    'Next: Gardens at the Edge · 86 m past your best',
  );
  eq(goalLine({ delivered: true }), 'Delivered. The Workshop is yours.');
  eq(
    goalLine(nextGoal(P(15 * SCREEN_METERS))),
    `Next: the finish line · ${fmtMeters(SCREEN_METERS)} past your best`,
  );
  eq(teaserLine(C.PLACES[2], 0.2), 'Gardens at the Edge · 1 m past your best');
  eq(teaserBonusLine('pinwheel'), 'Pinwheel · Spin the wind before you throw.');
  eq(priceLine(upgradeStatus(P(SCREEN_METERS, 1000), 'chain')), 'Level up · 40 ◈');
  eq(priceLine(upgradeStatus(P(SCREEN_METERS, 10), 'chain')), '30 ◈ to go');
  eq(priceLine(upgradeStatus(P(SCREEN_METERS, 0, { levels: { chain: 2 } }), 'chain')), 'Max level');
  eq(pocketLine(pocketStatus(P(0))), 'Pocket 1 · 300 ◈');
  eq(
    pocketLine(pocketStatus(P(SCREEN_METERS, 0, { pockets: { owned: 1, slots: [null, null] } }))),
    'Pocket 2 opens in Golden fields',
  );
  const red = P(8 * SCREEN_METERS, 0, { pockets: { owned: 2, slots: ['sharp', null] } });
  eq(reasonLine(canEquip(red, 1, 'calm'), 'calm'), "Sharp Edge and Calm Sky don't mix.");
  eq(
    noveltyLine(parseNovelty('pinwheel')),
    'Found: Gardens at the Edge → Pinwheel · Kraft Paper is in the Workshop',
  );
  eq(
    noveltyLine(parseNovelty('district:sunset')),
    'New district: Golden fields · New in your pockets: Whistle and Paper Rocket · Pocket 2 is open. Pick a special.',
  );
  eq(noveltyLine({ type: 'past', count: 3 }), 'Your past flights found 3 places.');
  assert.match(noveltyLine(parseNovelty('line:bolts:1')), /^Otto: “Oh\. A paper plane/);
  eq(levelToast('chain', 2), 'Crowd Chain · Level 2');
  eq(
    effectLine('drone', N.atlas.values.drone, 3),
    'Tap right before a lantern to bounce up and forward. The tap window is 30 % wider. Lanterns hang in pairs 50 % of the time.',
  );
});
test('lines for goals, prices, novelties and effects (CS)', () =>
  inLang('cs', () => {
    eq(
      goalLine(nextGoal(P(2 * SCREEN_METERS - 86))),
      'Další: Zahrady na okraji · 86 m za rekordem',
    );
    eq(priceLine(upgradeStatus(P(SCREEN_METERS, 1000), 'chain')), 'Vylepšit · 40 ◈');
    eq(priceLine(upgradeStatus(P(SCREEN_METERS, 10), 'chain')), 'Chybí 30 ◈');
    eq(
      noveltyLine(parseNovelty('district:sunset')),
      'Nová čtvrť: Zlatá pole · Nové v kapsách: Píšťalka a Papírová raketa · Kapsa 2 je otevřená. Vyber speciál.',
    );
    eq(noveltyLine({ type: 'past', count: 3 }), 'Tvoje dřívější lety našly 3 místa.');
    assert.match(noveltyLine(parseNovelty('line:bolts:1')), /^Otto: „Á\. Papírová vlaštovka/);
    eq(levelToast('chain', 2), 'Řetěz fanoušků · úroveň 2');
    eq(effectLine('crane', N.atlas.values.crane, 2), 'Startuješ o 3 m výš.');
    eq(
      effectLine('pinwheel', N.atlas.values.pinwheel, 3),
      'Vítr můžeš přetočit 3krát za hod. Přetočení nikdy nepadne na protivítr.',
    );
  }));
