// C4: Dílna 3/12/3 — žebřík papírů a zámky, Undo poslední koupě, náhled „≈ +X m“ (deterministický, rozdíl > 0), texty EN i CS.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fresh, flightFor, step } from '../src/core.js';
import { buy, buyUndoable, canUndo, undoBuy, paperOpen } from '../src/gear.js';
import { opensPaper } from '../src/atlas.js';
import { paperLadder } from '../src/workshop-ui.js';
import { previewGain, throwRecord, calmThrow } from '../src/workshop-preview.js';
import { SCREEN_METERS, ROUTE } from '../src/scenes.js';
import { LOCALES, paramsOf } from '../src/i18n.js';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const save = (over = {}) => ({ ...fresh(), attempts: 3, coins: 100000, ...over });
const opener = kind => {
  for (let i = 0; i < 16; i++) if (opensPaper(i) === kind) return i;
};

test('paper ladder: 4 kinds x 3 levels, states done / active / waits / locked with the opening place', () => {
  const states = p => paperLadder(p).map(k => k.state);
  const kinds = paperLadder(fresh());
  assert.deepEqual(
    kinds.map(k => k.kind),
    ['copy', 'kraft', 'washi', 'neon'],
  );
  assert.deepEqual(
    kinds.map(k => k.levels),
    [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ],
  );
  assert.deepEqual(states(fresh()), ['active', 'locked', 'locked', 'locked']);
  assert.deepEqual(
    kinds.slice(1).map(k => k.place),
    ['kraft', 'washi', 'neon'].map(opener),
    'every locked kind names the place that opens it (Opens at …)',
  );
  assert.ok(
    kinds.slice(1).every(k => ROUTE[k.place].kind),
    'the place has a name key',
  );
  assert.equal(kinds[0].place, null);
  // doletěl na místo, které otevírá kraft: kraft čeká na copy, copy dokoupený -> kraft active
  const best = opener('kraft') * SCREEN_METERS + SCREEN_METERS;
  assert.ok(paperOpen(best) >= 6);
  assert.deepEqual(states(save({ best })), ['active', 'waits', 'locked', 'locked']);
  assert.deepEqual(states(save({ best, levels: { power: 0, paper: 3, folds: 0 } })), [
    'done',
    'active',
    'locked',
    'locked',
  ]);
  assert.deepEqual(
    paperLadder(save({ levels: { power: 0, paper: 4, folds: 0 }, best })).map(k => k.done),
    [3, 1, 0, 0],
  );
  const all = save({ best: 1e6, levels: { power: 3, paper: 12, folds: 3 } });
  assert.deepEqual(states(all), ['done', 'done', 'done', 'done']);
});

test('undo: returns coins and the level, valid only until the next throw, once, and only for the current level', () => {
  const p = save({ attempts: 2, coins: 500 });
  const u = buyUndoable(p, 'power');
  assert.equal(p.levels.power, 1);
  assert.equal(p.coins, 450);
  assert.deepEqual(u, { id: 'power', level: 1, price: 50, attempts: 2 });
  assert.equal(canUndo(p, u), true);
  assert.equal(undoBuy(p, u), true);
  assert.equal(p.levels.power, 0);
  assert.equal(p.coins, 500);
  assert.equal(undoBuy(p, u), false, 'only once');
  assert.equal(p.coins, 500);
  // další hod (settle zvýší attempts) Undo ruší
  const q = save({ attempts: 2, coins: 500 }),
    v = buyUndoable(q, 'folds');
  q.attempts++;
  assert.equal(canUndo(q, v), false);
  assert.equal(undoBuy(q, v), false);
  assert.equal(q.levels.folds, 1);
  // nejde koupit -> žádný záznam; změněná úroveň (jiná koupě přes ni) Undo neplatí
  assert.equal(buyUndoable(save({ coins: 0 }), 'power'), null);
  const r = save({ coins: 500 }),
    w = buyUndoable(r, 'power');
  buy(r, 'power');
  assert.equal(canUndo(r, w), false);
  assert.equal(canUndo(r, null), false);
});

function flownThrow(p, angle = 15, charge = 0.9) {
  const f = flightFor(p, angle, charge);
  while (!f.landed) step(f);
  return f;
}

test('preview: hidden before the first throw, deterministic, positive after buying Power / Paper / Folds', () => {
  assert.equal(previewGain(fresh(), 'power', 1), null, 'no throw yet');
  const p = save({ attempts: 4, coins: 5000, best: 1e6, levels: { power: 1, paper: 1, folds: 0 } }),
    rec = throwRecord(flownThrow(p, 14, 0.8));
  assert.equal(rec.n, 5);
  for (const id of ['power', 'paper', 'folds']) {
    const level = p.levels[id] + 1,
      a = previewGain(p, id, level, rec),
      b = previewGain(p, id, level, rec);
    assert.deepEqual(a, b, id + ' deterministic');
    assert.equal(a.mode, 'replay');
    assert.ok(a.gain > 0, `${id}: ${a.gain}`);
    assert.ok(Math.abs(a.after - a.now - a.gain) < 1e-9);
  }
  // „teď“ = skutečný dolet toho hodu (stejný seed, úhel, síla, vítr a zásahy)
  assert.ok(Math.abs(previewGain(p, 'power', 2, rec).now - flownThrow(p, 14, 0.8).x) < 1e-6);
});

test('preview without a record: typical calm throw; nothing for owned or too-far levels', () => {
  const p = save({ attempts: 2, coins: 5000 }),
    c = calmThrow(p);
  assert.equal(c.grades, null);
  assert.equal(c.w, 0);
  for (const id of ['power', 'paper']) {
    const g = previewGain(p, id, 1);
    assert.equal(g.mode, 'calm');
    assert.ok(g.gain > 0, id);
  }
  assert.equal(previewGain(p, 'power', 0), null);
  assert.equal(
    previewGain({ ...p, levels: { power: 1, paper: 0, folds: 0 } }, 'power', 1),
    null,
    'already owned',
  );
  assert.equal(previewGain(p, 'power', 4), null, 'above the maximum');
});

test('Workshop texts: every new workshop key exists in EN and CS with the same parameters', () => {
  const keys = Object.keys(LOCALES.en).filter(k =>
    /^workshop\.(opensAt|toGo|buyFirst|kind|paperLadder|treeLabel|modelsLabel|value|nowAfter|nowOnly|preview|undo|bought|undone)/.test(
      k,
    ),
  );
  assert.ok(keys.length >= 20, 'found ' + keys.length);
  for (const k of keys) {
    assert.ok(k in LOCALES.cs, 'cs: ' + k);
    assert.deepEqual(paramsOf(LOCALES.cs[k]), paramsOf(LOCALES.en[k]), k);
  }
});

test('workshop-ui.js and workshop-preview.js have no hard-coded player text', () => {
  for (const file of ['src/workshop-ui.js', 'src/workshop-preview.js']) {
    const src = read(file)
      .replace(/\/\/.*$/gm, '')
      .replace(/^import .*$/gm, '');
    // věta v uvozovkách: Velké slovo + malé slovo, nebo cokoli s diakritikou
    const bad = [...src.matchAll(/(['"`])((?:(?!\1).)+)\1/g)]
      .map(m => m[2])
      .filter(x => /^[A-Z][a-z]+ [a-z]+/.test(x) || /[À-ž]/.test(x));
    assert.deepEqual(bad, [], file);
  }
});
