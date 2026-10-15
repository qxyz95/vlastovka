// A1: src/progression-numbers.js je PROVISIONAL kopie simulation/progression/params.mjs. Každé číslo se musí shodovat.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROGRESSION, PROVISIONAL } from '../src/progression-numbers.js';
import { defaults } from '../simulation/progression/params.mjs';
import { NUMBERS } from '../src/atlas-numbers.js';

const GAME =
  'route,physics,models,economy,workshop,atlas,combo,caps,push,events,wind,swing,pockets,specials,warp';

test('progression-numbers: sekce hry se hloubkově rovnají params.mjs', () => {
  const d = defaults();
  assert.equal(PROVISIONAL, true);
  assert.equal(Object.keys(PROGRESSION).join(','), GAME);
  for (const k of Object.keys(PROGRESSION))
    assert.deepStrictEqual(JSON.parse(JSON.stringify(PROGRESSION[k])), d[k], k);
  // sekce simulátoru (boti, kampaň) do hry nepatří
  for (const k of ['profiles', 'bots', 'campaign', 'tricks', 'curve', 'targets'])
    assert.equal(PROGRESSION[k], undefined, k);
});

test('progression-numbers: čísla jsou zmrazená a atlas-numbers z nich odvozená', () => {
  assert.ok(Object.isFrozen(PROGRESSION.atlas.chain[0]));
  assert.throws(() => {
    PROGRESSION.push.base = 9;
  }, TypeError);
  const A = PROGRESSION.atlas;
  assert.deepStrictEqual(NUMBERS.atlas.bonuses, A.bonuses);
  assert.deepStrictEqual(NUMBERS.atlas.values.chain, A.chain);
  assert.deepStrictEqual(
    NUMBERS.atlas.values.echo.map(v => v.share),
    A.echo.share,
  );
  assert.equal(NUMBERS.atlas.values.drone[1].wider, 0.3);
  assert.deepStrictEqual(NUMBERS.pockets.prices, PROGRESSION.pockets.prices);
  assert.equal(NUMBERS.gliderAt, A.gliderAt);
});
