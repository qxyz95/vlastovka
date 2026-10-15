import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compact } from './helpers/compact.js';
import { fresh, kitOf } from '../src/core.js';
import { resultNovelty, atlasDot } from '../src/reveal.js';
import { noveltyLine } from '../src/atlas-text.js';
import { upgrade, levelOf, markSeen, nextCost, clearUndo, placeStart } from '../src/atlas.js';
import { setLang } from '../src/i18n.js';

setLang('en');
const MARKET = placeStart(1) + 5; // just past the Market (Crowd Chain)
const ui = compact(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'));

test('front novinek: na kartu jedna, dle priority, nic dvakrát, zbytek čeká', () => {
  const p = fresh();
  p.best = MARKET;
  const seen = [];
  for (let i = 0; i < 10; i++) {
    const x = resultNovelty(p, i === 0 ? 0 : p.best);
    if (!x) break;
    seen.push(x.type + ':' + (x.id ?? x.character ?? ''));
  }
  assert.ok(seen.length >= 2, 'dvě místa objevená jedním hodem dají víc novinek');
  assert.equal(new Set(seen).size, seen.length, 'nic dvakrát');
  assert.equal(seen.at(-1).startsWith('line') || seen.some(s => s === 'bonus:chain'), true);
  assert.ok(seen.indexOf('bonus:glider') < seen.indexOf('bonus:chain'), 'pořadí podle trasy');
  assert.equal(resultNovelty(p, p.best), null, 'bez nového objevu a prázdné fronty nic');
});

test('jeden hod = jedna novinka, zbytek zůstane ve frontě až do dalšího hodu', () => {
  const p = fresh();
  p.best = MARKET;
  const first = resultNovelty(p, 0);
  assert.ok(first);
  assert.ok(p.atlas.pending.length >= 1);
  const left = p.atlas.pending.length;
  const second = resultNovelty(p, p.best);
  assert.ok(second);
  assert.equal(p.atlas.pending.length, left - 1);
});

test('novinka má čitelný řádek (nové místo a bonus) v EN i CS', () => {
  const p = fresh();
  p.best = MARKET;
  let x = null;
  for (let i = 0; i < 6 && x?.id !== 'chain'; i++) x = resultNovelty(p, i ? p.best : 0);
  assert.equal(x.id, 'chain');
  assert.match(noveltyLine(x), /Found: Market/);
  setLang('cs');
  assert.match(noveltyLine(x), /Nalezeno: /);
  setLang('en');
});

test('tečka Atlasu: jen odkrytý Atlas a skutečně neviděná novinka', () => {
  const p = fresh();
  assert.equal(atlasDot(p), false, 'před odkrytím Atlasu nic');
  p.best = MARKET;
  p.attempts = 3;
  assert.equal(atlasDot(p), true, 'objevený bonus, který hráč neviděl');
  markSeen(p, 'glider');
  markSeen(p, 'chain');
  assert.equal(atlasDot(p), false, 'po zhlédnutí tečka zmizí');
});

test('koupě Crowd Chain úr. 2 zvýší úroveň v kitOf dalšího letu', () => {
  const p = fresh();
  p.best = MARKET;
  assert.equal(kitOf(p).atlas.chain, 1);
  p.coins = nextCost('chain', 1) + 1;
  assert.ok(upgrade(p, 'chain'));
  assert.equal(levelOf(p, 'chain'), 2);
  assert.equal(kitOf(p).atlas.chain, 2);
  assert.ok(p.atlas.undo);
  clearUndo(p);
  assert.equal(p.atlas.undo, null, 'Undo platí jen do dalšího hodu');
  assert.equal(kitOf(p).atlas.chain, 2, 'úroveň zůstává');
});

test('ui.js: Atlas se připojí, clearUndo při startu hodu, nová novinka a tečka', () => {
  assert.match(ui, /mountAtlas\(\$\('atlas'\),\{getSave:\(\)=>p,persist,onChange:/);
  assert.match(ui, /onNav:target=>/);
  assert.match(ui, /function startFlight\([^)]*\)\{intro=null;clearUndo\(p\);/);
  assert.match(ui, /resultNovelty\(p,previous\)/);
  assert.match(ui, /noveltyLine\(outcome\.novelty\)/);
  assert.match(ui, /atlasDot\(p\)/);
  assert.match(ui, /S\.panels\.includes\('atlas'\)/);
  assert.equal(ui.match(/atlas\.refresh\(\)/g).length >= 3, true, 'jazyk, reset, dev mince');
});
