import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { PLACES } from '../src/atlas-content.js';
import {
  IMAGE_PLACES,
  SHAPES,
  TONES,
  VIEWBOX,
  altKey,
  imageUrl,
  silhouette,
} from '../src/atlas-postcards.js';
import { LANG_IDS, has, setStrict } from '../src/i18n.js';
import { postcardOf } from '../src/atlas-ui.js';

setStrict(true);

test('district 1 places have a screenshot, 2-4 have none', () => {
  const withImage = PLACES.filter(p => imageUrl(p.id)).map(p => p.id);
  assert.deepEqual(withImage, IMAGE_PLACES);
  assert.deepEqual(
    PLACES.slice(0, 4).map(p => p.id),
    IMAGE_PLACES,
  );
  for (const p of PLACES.slice(4)) assert.equal(imageUrl(p.id), null);
});

test('screenshots exist and fit the size limit (60 kB webp)', () => {
  for (const id of IMAGE_PLACES) {
    const f = new URL(`../${imageUrl(id)}`, import.meta.url);
    assert.ok(existsSync(f), id);
    assert.ok(statSync(f).size <= 60_000, `${id}: ${statSync(f).size} B`);
  }
});

test('every place kind of districts 2-4 has a silhouette (and so does district 1 as a fallback)', () => {
  for (const p of PLACES) assert.ok(SHAPES[p.kind]?.length >= 3, p.kind);
  assert.equal(PLACES.slice(4).length, 12);
  assert.deepEqual(Object.keys(SHAPES).sort(), PLACES.map(p => p.kind).sort());
});

test('silhouettes are well-formed pure descriptions inside the viewBox', () => {
  for (const p of PLACES) {
    const a = silhouette(p.kind),
      b = silhouette(p.kind);
    assert.deepEqual(a, b);
    assert.equal(a.viewBox, VIEWBOX);
    assert.ok(a.shapes.some(s => s.tone === 'main') && a.shapes.some(s => s.tone === 'ground'));
    for (const s of a.shapes) {
      assert.ok(TONES.includes(s.tone), `${p.kind}: ${s.tone}`);
      assert.ok(['path', 'rect', 'circle'].includes(s.tag));
      for (const [k, v] of Object.entries(s.attrs))
        assert.ok(!/NaN|undefined/.test(String(v)), `${p.kind}.${k}=${v}`);
      if (s.tag === 'path') assert.match(s.attrs.d, /^M[-\d.,LQAVHZ ]+$/);
    }
  }
  assert.ok(silhouette('nonsense').shapes.length > 3);
});

test('alt texts for screenshots exist in EN and CS', () => {
  for (const id of IMAGE_PLACES)
    for (const l of LANG_IDS) assert.ok(has(altKey(id), l), `${l} ${id}`);
  const pc = postcardOf(0);
  assert.equal(pc.kind, 'roofs');
  assert.ok(pc.image && pc.alt);
  const sil = postcardOf(7);
  assert.equal(sil.image, null);
  assert.equal(sil.alt, null);
});
