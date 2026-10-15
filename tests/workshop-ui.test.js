// M2: Dílna vyjmutá z ui.js do src/workshop-ui.js (mountWorkshop), stromy Power 3 / Paper 12 / Folds 3 nad gear.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fresh } from '../src/core.js';
import { nodeLevels, mountWorkshop } from '../src/workshop-ui.js';
import { SCREEN_METERS } from '../src/scenes.js';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

// Minimální DOM: jen to, co mountWorkshop používá.
class El {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.attrs = {};
    this.dataset = {};
    this.className = '';
    this.textContent = '';
    this.disabled = false;
    const cls = new Set();
    this.classList = {
      add: c => cls.add(c),
      toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)),
      contains: c => cls.has(c) || this.className.split(' ').includes(c),
    };
  }
  append(...xs) {
    for (const x of xs) this.children.push(typeof x === 'string' ? { text: x } : x);
  }
  replaceChildren(...xs) {
    this.children = [];
    this.append(...xs);
  }
  setAttribute(k, v) {
    this.attrs[k] = String(v);
  }
  focus() {}
  all() {
    return this.children.flatMap(c => (c instanceof El ? [c, ...c.all()] : []));
  }
  querySelector(sel) {
    return this.all().find(e => '#' + e.id === sel) ?? null;
  }
}
globalThis.document = { createElement: tag => new El(tag) };
const dialog = () => {
  const root = new El('dialog');
  for (const id of ['tree', 'detail', 'dart', 'glider', 'glider-description']) {
    const e = new El('div');
    e.id = id;
    root.append(e);
  }
  return root;
};
const text = e =>
  [e.textContent, ...e.children.map(c => (c instanceof El ? text(c) : c.text))].join(' ');

test('nodeLevels: Power and Folds show all 3 levels, Paper only the kind with the next level', () => {
  assert.deepEqual(nodeLevels('power', 0), [1, 2, 3]);
  assert.deepEqual(nodeLevels('folds', 3), [1, 2, 3]);
  assert.deepEqual(nodeLevels('paper', 0), [1, 2, 3]);
  assert.deepEqual(nodeLevels('paper', 2), [1, 2, 3]);
  assert.deepEqual(nodeLevels('paper', 3), [4, 5, 6]);
  assert.deepEqual(nodeLevels('paper', 12), [10, 11, 12]);
});

test('mountWorkshop: three branches, buying the next level, not enough coins, Paper waits for its place', () => {
  const p = { ...fresh(), attempts: 1, coins: 60 },
    root = dialog();
  let changes = 0;
  const w = mountWorkshop(root, { getSave: () => p, onChange: () => (changes++, w.refresh()) });
  w.refresh();
  const tree = root.querySelector('#tree');
  assert.deepEqual(
    tree.children.map(r => r.dataset.branch),
    ['power', 'paper', 'folds'],
  );
  assert.deepEqual(
    tree.children.map(r => r.children[1].children.length),
    [3, 3, 3],
  );
  const buy = () => root.querySelector('#buy');
  assert.equal(buy().disabled, false);
  buy().onclick();
  assert.equal(p.levels.power, 1);
  assert.equal(p.coins, 10);
  assert.equal(changes, 1);
  assert.equal(buy().disabled, true, 'Power 2 costs 160');
  assert.match(text(root.querySelector('#detail')), /150/, 'how many coins are missing');
  // Paper: Copy bought out, Kraft waits for the 3rd place
  Object.assign(p, { coins: 5000, levels: { power: 1, paper: 3, folds: 0 } });
  tree.children[1].children[1].children[0].onclick();
  assert.equal(buy().disabled, true);
  p.best = 2 * SCREEN_METERS;
  w.refresh();
  assert.equal(buy().disabled, false);
  buy().onclick();
  assert.equal(p.levels.paper, 4);
  // Glider jen od 100 m
  p.best = 50;
  w.refresh();
  assert.equal(root.querySelector('#glider').disabled, true);
  root.querySelector('#glider').onclick();
  assert.equal(p.model, 'dart');
  p.best = 100;
  w.refresh();
  root.querySelector('#glider').onclick();
  assert.equal(p.model, 'glider');
});

test('ui.js mounts the Workshop and has no old tree, prices or upgrade numbers', () => {
  const ui = read('src/ui.js'),
    ws = read('src/workshop-ui.js');
  assert.match(ui, /mountWorkshop\(\$\('workshop'\)/);
  for (const re of [/\bPRICES\b/, /\bBRANCHES\b/, /\bUPGRADE\b/, /createFlight\(/, /\bstep\(f\)/])
    assert.doesNotMatch(ui, re);
  assert.doesNotMatch(ws, /\b(35|50|105|160|180|350)\b/, 'prices come from progression-numbers');
});
