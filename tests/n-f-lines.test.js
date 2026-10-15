import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/atlas-content.js';
import { NUMBERS as N } from '../src/atlas-numbers.js';
import {
  emptyAtlas,
  placeStart,
  discoveries,
  queueNovelties,
  takeNovelty,
  heardLines,
} from '../src/atlas.js';
import { setLang, setStrict, t } from '../src/i18n.js';

setStrict(true);
const PER = N.route.perDistrict;

// 08 §7.1: line 1 = first arrival in the district, 2 = 3rd place of the district, 3 = first flight into the next district (finale for the last one).
test('N-F: character lines unlock at the first arrival, the 3rd place and the next district (finale) for all 4 characters', () => {
  assert.equal(C.DISTRICTS.length, 4);
  const p = { best: 0, atlas: emptyAtlas() },
    first = {};
  let prev = 0;
  for (let best = 0; best <= N.route.finish + 1; best += 1) {
    // each throw reaches `best`; all pending novelties are drained (one per throw in the game)
    queueNovelties(p, discoveries(prev, best, p));
    while (takeNovelty(p)) {
      C.DISTRICTS.forEach((d, i) => {
        const n = heardLines(p, i).length;
        for (let k = 1; k <= n; k++) first[`${i}:${k}`] ??= best;
      });
    }
    prev = best;
  }
  C.DISTRICTS.forEach((d, i) => {
    const last = i === C.DISTRICTS.length - 1,
      want = [
        i === 0 ? N.gliderAt : placeStart(i * PER),
        placeStart(i * PER + 2),
        last ? N.route.finish : placeStart((i + 1) * PER),
      ];
    want.forEach((m, k) =>
      assert.ok(
        first[`${i}:${k + 1}`] >= Math.floor(m) && first[`${i}:${k + 1}`] <= Math.ceil(m),
        `${d.character.id} line ${k + 1} unlocks at ${first[`${i}:${k + 1}`]} m, expected ${m.toFixed(1)}`,
      ),
    );
  });
});

test('N-F: the last character line 3 speaks after the Harbor (finale), not about it being ahead', () => {
  for (const lang of ['en', 'cs']) {
    setLang(lang);
    assert.doesNotMatch(t('atlas.character.zippy.line3'), /right ahead|hned před tebou/);
  }
  setLang('en');
});
