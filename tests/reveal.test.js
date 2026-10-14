import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fresh } from '../src/core.js';
import { PRICES } from '../src/config.js';
import { reveal, coinLine, promptHint, ATLAS_OPEN_METERS, GLIDER_METERS } from '../src/reveal.js';

const save = o => ({ ...fresh(), ...o });
const strong = { power: 0.8 },
  weak = { power: 0.2 };

test('throw 0: only Throw and Settings, nothing else', () => {
  const r = reveal(fresh());
  assert.deepEqual(r, {
    coins: false,
    workshop: false,
    atlas: false,
    models: false,
    branchesNextOnly: true,
    titleButtons: ['throw', 'settings'],
  });
  assert.equal(coinLine(fresh(), PRICES), null);
});

test('after throw 1: coin chip and Workshop, still no Atlas or models', () => {
  const r = reveal(save({ attempts: 1, best: 40, coins: 12 }));
  assert.equal(r.coins && r.workshop, true);
  assert.equal(r.atlas || r.models, false);
  assert.deepEqual(r.titleButtons, ['throw', 'workshop', 'settings']);
});

test('Glider threshold shows the model row', () => {
  assert.equal(reveal(save({ attempts: 3, best: GLIDER_METERS - 1 })).models, false);
  assert.equal(reveal(save({ attempts: 3, best: GLIDER_METERS })).models, true);
  assert.equal(reveal(save({ attempts: 3, best: 10, model: 'glider' })).models, true);
});

test('Atlas threshold', () => {
  assert.equal(reveal(save({ attempts: 9, best: ATLAS_OPEN_METERS - 1 })).atlas, false);
  const r = reveal(save({ attempts: 9, best: ATLAS_OPEN_METERS }));
  assert.equal(r.atlas, true);
  assert.deepEqual(r.titleButtons, ['throw', 'workshop', 'atlas', 'settings']);
});

test('old save with 500 m: everything visible, nothing missing, input not mutated', () => {
  const p = save({ attempts: 40, best: 500, coins: 0, completed: true });
  const before = JSON.stringify(p);
  const r = reveal(p);
  assert.deepEqual([r.coins, r.workshop, r.atlas, r.models], [true, true, true, true]);
  assert.deepEqual(r.titleButtons, ['throw', 'workshop', 'atlas', 'settings']);
  assert.equal(JSON.stringify(p), before);
  // an even older save without newer fields still works
  assert.deepEqual(reveal({ best: 500, attempts: 12, coins: 3 }).titleButtons.length, 4);
  assert.equal(reveal(null).workshop, false);
});

test('coinLine: empty wallet gives the cheapest next level', () => {
  const p = save({ attempts: 1, best: 30, coins: 0 });
  assert.deepEqual(coinLine(p, PRICES), { kind: 'toNext', coins: 35 });
  p.coins = 23;
  assert.deepEqual(coinLine(p, PRICES), { kind: 'toNext', coins: 12 });
});

test('coinLine: counts branches, at most one level per branch', () => {
  const p = save({ attempts: 1, best: 30, coins: 40 });
  assert.deepEqual(coinLine(p, PRICES), { kind: 'canBuy', count: 3 });
  p.coins = 5000; // plenty of coins still means 3 branches, not 15 levels
  assert.deepEqual(coinLine(p, PRICES), { kind: 'canBuy', count: 3 });
  p.levels = { power: 1, paper: 0, fold: 5 }; // power next 105, fold maxed
  p.coins = 50;
  assert.deepEqual(coinLine(p, PRICES), { kind: 'canBuy', count: 1 });
  p.coins = 0;
  assert.deepEqual(coinLine(p, PRICES), { kind: 'toNext', coins: 35 });
});

test('coinLine: everything bought gives null; has no buy/undo helpers', () => {
  const p = save({ attempts: 99, best: 500, coins: 9999, levels: { power: 5, paper: 5, fold: 5 } });
  assert.equal(coinLine(p, PRICES), null);
  assert.equal(coinLine(p), null);
});

test('promptHint: first throw is big with the full hint', () => {
  assert.deepEqual(promptHint([]), { hint: 'first', size: 'big' });
  assert.deepEqual(promptHint(undefined), { hint: 'first', size: 'big' });
});

test('promptHint: throws 1-3 keep the hint, smaller', () => {
  assert.deepEqual(promptHint([strong]), { hint: 'first', size: 'small' });
  assert.deepEqual(promptHint([strong, strong]), { hint: 'first', size: 'small' });
});

test('promptHint: after 3 strong throws the hint is gone and the prompt is calm', () => {
  assert.deepEqual(promptHint([strong, strong, strong]), { hint: null, size: 'calm' });
  assert.deepEqual(promptHint([strong, weak, strong, strong]), { hint: null, size: 'calm' });
});

test('promptHint: weak throws are not strong, so no calm yet', () => {
  assert.equal(promptHint([weak, strong, strong]).size, 'small');
});

test('promptHint: two weak throws in a row bring the hint back once', () => {
  assert.equal(promptHint([strong, strong, strong, weak]).hint, null);
  assert.deepEqual(promptHint([strong, strong, strong, weak, weak]), {
    hint: 'holdLonger',
    size: 'calm',
  });
  assert.equal(promptHint([strong, strong, strong, weak, weak, weak]).hint, null); // not repeated
  assert.equal(promptHint([weak, weak]).hint, 'holdLonger');
});

test('promptHint: a too-short tap shows the hint and does not count as a throw', () => {
  assert.deepEqual(promptHint([{ tap: true }]), { hint: 'holdLonger', size: 'big' });
  assert.deepEqual(promptHint([strong, strong, strong, { tap: true }]), {
    hint: 'holdLonger',
    size: 'calm',
  });
  assert.deepEqual(promptHint([{ tap: true }, strong]), { hint: 'first', size: 'small' });
});

test('promptHint: finished route replaces the hint', () => {
  assert.deepEqual(promptHint([strong, strong, strong], true), { hint: 'complete', size: 'calm' });
});
