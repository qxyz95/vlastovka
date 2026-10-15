import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { devEnabled, addDevCoins, DEV_COINS } from '../src/dev.js';
import { fresh } from '../src/core.js';
import { load, save } from '../src/storage.js';
import { compact } from './helpers/compact.js';

test('dev: enabled only with ?dev=1', () => {
  assert.equal(devEnabled('?dev=1'), true);
  assert.equal(devEnabled('?lang=cs&dev=1'), true);
  assert.equal(devEnabled(''), false);
  assert.equal(devEnabled('?dev'), false);
  assert.equal(devEnabled('?dev=0'), false);
});

test('dev: +1000 coins only, best and levels untouched, save stays valid', () => {
  const p = fresh();
  p.best = 42;
  const before = JSON.stringify({ ...p, coins: 0 });
  addDevCoins(p);
  assert.equal(p.coins, DEV_COINS);
  assert.equal(JSON.stringify({ ...p, coins: 0 }), before);
  addDevCoins(p);
  assert.equal(p.coins, 2 * DEV_COINS);
  const mem = new Map();
  globalThis.localStorage = {
    getItem: k => mem.get(k) ?? null,
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: k => mem.delete(k),
  };
  try {
    assert.equal(save(p), '');
    assert.equal(load().data.coins, 2 * DEV_COINS);
  } finally {
    delete globalThis.localStorage;
  }
});

test('dev: button hidden by default and wired in ui.js, text in EN and CS', async () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<button id="dev-coins"[^>]*hidden/);
  const ui = compact(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'));
  assert.ok(ui.includes(compact('if (devEnabled(location.search))')));
  assert.ok(ui.includes(compact('addDevCoins(p)')));
  for (const lang of ['en', 'cs']) {
    const { default: dict } = await import(`../src/locales/${lang}.js`);
    assert.ok(dict['settings.devCoins'], lang);
  }
});
