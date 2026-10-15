import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import en from '../src/locales/en.js';
import cs from '../src/locales/cs.js';

const read = f => readFileSync(new URL(f, import.meta.url), 'utf8');
const css = read('../style.css'),
  html = read('../index.html');

test('N-B: Whistle texts talk about the next event, not a bird', () => {
  for (const [lang, d] of [
    ['en', en],
    ['cs', cs],
  ])
    for (const k of [
      'atlas.special.whistle.tradeoff',
      'atlas.special.whistle.hint',
      'ability.hint.whistle',
    ])
      assert.doesNotMatch(d[k], /bird|pták|holub/i, `${lang} ${k}`);
  assert.match(en['ability.hint.whistle'], /next event/);
  assert.match(cs['ability.hint.whistle'], /další událost/);
});

test('N-C: the angle slider has a touch target of at least 44 px', () => {
  assert.match(css, /#aim input \{[^}]*min-height: 44px/);
});

test('N-E: the Workshop detail panel is not a live region, the status line is', () => {
  assert.doesNotMatch(html, /<aside id="detail"[^>]*aria-live/);
  assert.match(html, /id="workshop-live" class="sr-only" role="status"/);
});

test('N-4: on short landscape screens Buy (detail) and Reset stay reachable', () => {
  const m = css.match(
    /@media \(max-height: 500px\) and \(orientation: landscape\) \{[^@]*?#detail \{[^}]*\}/,
  );
  assert.ok(m, 'short landscape block with #detail');
  assert.match(m[0], /position: sticky/);
  assert.match(css, /#settings fieldset:has\(#reset\) \{[^}]*position: sticky/);
});
