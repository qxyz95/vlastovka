import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

// Pure render3d modules must run in Node (no node_modules, no DOM): static text check, then a real import.
const dir = new URL('../src/render3d/', import.meta.url);
const PURE = [
  'geometry',
  'camera',
  'life',
  'mood',
  'pose',
  'fx-map',
  'comic',
  'palette',
  'events-view',
  'quality',
  'frame',
  'ui-layer',
  'paper-mood',
  'paper-cards',
  'paper-shadow',
  'intro',
]
  .map(n => n + '.js')
  .concat(
    readdirSync(new URL('districts/', dir))
      .filter(n => n.endsWith('-layout.js'))
      .map(n => 'districts/' + n),
  )
  .concat(
    readdirSync(new URL('models/', dir))
      .filter(n => n.endsWith('.js'))
      .map(n => 'models/' + n),
  );
const BANNED = [
  [/from\s*['"]three['"]/, "from 'three'"],
  [/\bdocument\b/, 'document'],
  [/\bwindow\./, 'window.'],
  [/\brequestAnimationFrame\b/, 'requestAnimationFrame'],
];
test('pure render3d modules do not touch three.js or the DOM', async () => {
  assert.equal(PURE.filter(n => n.startsWith('districts/')).length, 4, 'four district layouts');
  assert.ok(
    PURE.includes('models/index.js') && PURE.includes('models/parts.js'),
    'model catalog is pure',
  );
  for (const name of PURE) {
    const url = new URL(name, dir);
    assert.ok(existsSync(url), name);
    const text = readFileSync(url, 'utf8');
    for (const [re, label] of BANNED) assert.ok(!re.test(text), `${name} contains ${label}`);
    await import(url.href);
  }
});
test('district registry: four districts in route order with build/update', async () => {
  const { DISTRICT_VIEWS, districtOf } = await import('../src/render3d/districts/index.js');
  assert.deepEqual(
    DISTRICT_VIEWS.map(d => d.id),
    ['suburbs', 'docks', 'horizon', 'core'],
  );
  for (const d of DISTRICT_VIEWS) {
    assert.equal(typeof d.build, 'function');
    assert.equal(typeof d.update, 'function');
    assert.equal(d.layout.id, d.id);
  }
  assert.equal(districtOf(5).id, 'docks');
  assert.equal(districtOf(31).id, 'core');
});
