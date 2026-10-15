import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fresh } from '../src/core.js';
import { decodeSave } from '../src/storage.js';
import { compact } from './helpers/compact.js';

test('C2b: první setkání se ukládá do p.atlas.met, starý save bez pole = prázdné, neznámé typy pryč', () => {
  assert.deepEqual(fresh().atlas.met, []);
  const p = fresh();
  p.atlas.met = ['steam', 'star'];
  assert.deepEqual(decodeSave(JSON.stringify(p)).data.atlas.met, ['steam', 'star']);
  const old = fresh();
  delete old.atlas.met;
  assert.deepEqual(decodeSave(JSON.stringify(old)).data.atlas.met, []);
  const bad = fresh();
  bad.atlas.met = ['steam', 'gust', 'steam', 7];
  assert.deepEqual(decodeSave(JSON.stringify(bad)).data.atlas.met, ['steam']);
  const ui = compact(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'));
  assert.ok(ui.includes(compact('isFirstMeet(ev, p.atlas.met, NEW_EVENT_TYPES)')));
  assert.ok(ui.includes(compact('p.atlas.met.push(ev.type)')));
  assert.ok(ui.includes(compact('paper: p.levels?.paper ?? 0,')));
});
