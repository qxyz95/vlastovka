import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as A from '../src/atlas.js';
import { NUMBERS } from '../src/atlas-numbers.js';
import { fmtCoins } from '../src/atlas-text.js';
import { LOCALES, LANG_IDS, setLang, setStrict, has, paramsOf, t } from '../src/i18n.js';
import {
  TONES,
  atlasModel,
  buyModel,
  cardModel,
  detailModel,
  districtsModel,
  nodesModel,
  pickerModel,
  pocketsModel,
  stepCard,
  undoModel,
} from '../src/atlas-ui.js';

setStrict(true);
const save = (best, coins = 0, atlas) => ({ best, coins, ...(atlas && { atlas }) });
const PLACE = NUMBERS.route.place;
const src = readFileSync(new URL('../src/atlas-ui.js', import.meta.url), 'utf8');
const inLang = (l, fn) => {
  setLang(l);
  try {
    return fn();
  } finally {
    setLang('en');
  }
};

test('16 places: all states come from placeStates, empty save shows the first teaser and unknown cards only', () => {
  const m = districtsModel(save(0));
  assert.equal(m.length, 4);
  assert.deepEqual(
    m.map(d => d.cards.length),
    [4, 0, 0, 0],
  );
  assert.deepEqual(
    m[0].cards.map(c => c.kind),
    ['teaser', 'unknown', 'unknown', 'unknown'],
  );
  assert.ok(m.slice(1).every(d => d.frame && d.frameAria && !d.reached && d.count === null));
  assert.ok(m[0].reached && m[0].frame === null && m[0].count);
  assert.deepEqual(
    m.map(d => d.tone),
    TONES,
  );
});
test('late save: found cards, one teaser in a not yet reached district, counts only for reached districts', () => {
  const m = districtsModel(save(2000, 3000));
  const kinds = m.flatMap(d => d.cards.map(c => c.kind));
  assert.equal(kinds.filter(k => k === 'teaser').length, 1);
  assert.equal(kinds.filter(k => k !== 'teaser' && k !== 'unknown').length, 7);
  assert.ok(m[1].reached && !m[2].reached && m[2].frame);
  assert.equal(m[1].cards.find(c => c.kind === 'teaser').index, 7);
  assert.ok(m[2].count === null && m[3].count === null);
});
test('at most one teaser for any record, hidden places carry no name', () => {
  for (let best = 0; best <= 5200; best += 41) {
    const cards = districtsModel(save(best)).flatMap(d => d.cards);
    assert.ok(cards.filter(c => c.kind === 'teaser').length <= 1, `best ${best}`);
    for (const c of cards.filter(x => x.kind === 'unknown'))
      assert.ok(c.name === '???' && !c.interactive);
  }
  const done = districtsModel(save(5000));
  assert.ok(done.flatMap(d => d.cards).every(c => c.kind !== 'teaser' && c.kind !== 'unknown'));
  assert.ok(done.every(d => d.reached && !d.frame));
});
test('card status is text, never only colour: New / Level n / Max level', () => {
  const p = save(2000, 0);
  const sts = A.placeStates(p);
  assert.match(cardModel(sts[1]).status, /New/);
  A.markSeen(p, 'chain');
  p.atlas.levels.chain = 1;
  const lvl = cardModel(A.placeStates(p)[1]);
  assert.match(lvl.status, /Level 2/);
  assert.deepEqual(lvl.dots, { level: 2, max: 3 });
  p.atlas.levels.chain = 2;
  assert.equal(cardModel(A.placeStates(p)[1]).kind, 'max');
  assert.equal(cardModel(A.placeStates(p)[1]).status, 'Max level');
  assert.equal(cardModel(sts[0]).dots, null);
  assert.match(cardModel(sts[7]).aria, /Next/);
});
test('detail: now → next effect, price with missing coins, max, no buy for glider and teaser', () => {
  const poor = detailModel(save(2000, 10), 1);
  assert.equal(poor.kind, 'found');
  assert.ok(poor.now && poor.next && poor.nextLabel);
  assert.equal(poor.buy.kind, 'missing');
  assert.equal(poor.buy.missing, 30);
  assert.equal(poor.buy.label, `${fmtCoins(30)} to go`);
  const rich = detailModel(save(2000, 1000), 1);
  assert.equal(rich.buy.kind, 'buy');
  assert.equal(rich.buy.label, `Level up · ${fmtCoins(40)}`);
  assert.equal(detailModel(save(2000, 1000), 0).buy, null);
  const t7 = detailModel(save(2000, 1000), 7);
  assert.equal(t7.kind, 'teaser');
  assert.ok(t7.distance && t7.pitch && t7.teaser && !('buy' in t7));
  assert.equal(detailModel(save(2000), 12), null);
  assert.equal(detailModel(save(0), 3), null);
  const p = save(2000, 1000, { ...A.emptyAtlas(), levels: { chain: 2 } });
  assert.equal(detailModel(p, 1).buy.kind, 'max');
  assert.equal(detailModel(p, 1).next, null);
  assert.equal(buyModel({ ok: false, reason: 'soon' }), null);
  assert.equal(buyModel({ ok: false, reason: 'unlevelled' }), null);
});
test('buy and undo through atlas.js keep the model consistent', () => {
  const p = save(2000, 100);
  assert.equal(undoModel(p), null);
  assert.ok(A.upgrade(p, 'chain'));
  assert.equal(p.coins, 60);
  assert.equal(detailModel(p, 1).level, 2);
  assert.equal(detailModel(p, 1).undo.id, 'chain');
  assert.equal(detailModel(p, 2).undo, null);
  assert.ok(A.undoLast(p));
  assert.equal(p.coins, 100);
  assert.equal(undoModel(p), null);
});
test('pockets: hidden before the first place, priced afterwards, second only from its district', () => {
  assert.deepEqual(pocketsModel(save(0)).owned, []);
  const first = pocketsModel(save(2000, 100));
  assert.equal(first.next.n, 1);
  assert.equal(first.next.ok, false);
  assert.match(first.next.label, /to go/);
  const ready = pocketsModel(save(2000, 1000));
  assert.equal(ready.next.ok, true);
  assert.match(ready.next.label, /Open pocket/);
  const own = save(2000, 0, { ...A.emptyAtlas(), pockets: { owned: 1, slots: ['dive', null] } });
  const m = pocketsModel(own);
  assert.equal(m.owned[0].name, 'Dive');
  assert.equal(m.next, null);
  assert.equal(pocketsModel(save(0)).next?.n ?? 1, 1);
});
test('picker: one active ability at a time and Sharp × Calm are exclusive, blocked rows say why', () => {
  const atlas = { ...A.emptyAtlas(), pockets: { owned: 2, slots: ['dive', 'sharp'] } };
  const p = save(2000, 0, atlas);
  const slot0 = pickerModel(p, 0);
  assert.ok(slot0.active.find(r => r.id === 'dive').equipped);
  assert.ok(slot0.active.every(r => r.ok || r.reason));
  const calm0 = slot0.passive.find(r => r.id === 'calm');
  assert.equal(calm0.ok, false);
  assert.match(calm0.reason, /Sharp Edge and Calm Sky/);
  assert.match(slot0.passiveRule, /don't mix/);
  const slot1 = pickerModel(p, 1);
  const cushion = slot1.active.find(r => r.id === 'cushion');
  assert.equal(cushion.ok, false);
  assert.match(cushion.reason, /One active ability/);
  assert.ok(slot1.passive.find(r => r.id === 'sharp').equipped);
  assert.equal(slot1.emptyLabel, 'Empty this pocket');
  assert.equal(pickerModel(p, 0).moreIn, 'More in Golden Fields');
  const early = pickerModel(
    save(300, 0, { ...A.emptyAtlas(), pockets: { owned: 1, slots: [null] } }),
    0,
  );
  assert.deepEqual(
    early.active.map(r => r.id),
    ['cushion'],
  );
  assert.deepEqual(
    early.passive.map(r => r.id),
    ['sharp'],
  );
  assert.equal(early.moreIn, 'More in Bright Harbor');
});
test('nodes: hidden and later-wave nodes never appear, no "Coming soon"', () => {
  assert.deepEqual(nodesModel(save(5000, 99999)), []);
  assert.deepEqual(nodesModel(save(0)), []);
});
test('atlasModel: wallet, goal line, rule sentence only for the first opens', () => {
  const m = atlasModel(save(2000, 1240));
  assert.equal(m.wallet.text, '1,240 ◈');
  assert.equal(m.wallet.aria, '1,240 coins');
  assert.match(m.goal, /^Next: /);
  assert.equal(m.showRule, true);
  assert.equal(atlasModel(save(2000, 0, { ...A.emptyAtlas(), hintOpens: 3 })).showRule, false);
  assert.match(atlasModel(save(5000)).goal, /Delivered/);
});
test('Czech: district titles in normal case, texts resolve', () => {
  inLang('cs', () => {
    const m = districtsModel(save(2000, 1000));
    assert.deepEqual(
      m.map(d => d.title),
      ['Střechy za úsvitu', 'Slunný přístav', 'Zlatá pole', 'Město lampionů'],
    );
    assert.match(atlasModel(save(2000, 1240)).wallet.text, /^1\s240 ◈$/);
    assert.ok(
      detailModel(save(2000, 1000), 1).buy.label.startsWith('Zvýšit') ||
        detailModel(save(2000, 1000), 1).buy.label.length > 3,
    );
  });
  inLang('en', () => {
    assert.deepEqual(
      districtsModel(save(5000)).map(d => d.title),
      ['Sunrise Roofs', 'Bright Harbor', 'Golden Fields', 'Lantern City'],
    );
  });
});
test('arrow navigation steps through interactive cards and between districts', () => {
  const m = atlasModel(save(2000));
  assert.equal(stepCard(m, 0, 'ArrowRight'), 1);
  assert.equal(stepCard(m, 0, 'ArrowLeft'), 0);
  assert.equal(stepCard(m, 7, 'ArrowRight'), 7, 'teaser is the last interactive card');
  assert.equal(stepCard(m, 1, 'ArrowDown'), 5);
  assert.equal(stepCard(m, 5, 'ArrowUp'), 1);
  assert.equal(stepCard(m, 0, 'ArrowUp'), 0);
  assert.equal(stepCard(m, 3, 'End'), 7);
  assert.equal(stepCard(m, 5, 'Home'), 0);
  assert.equal(stepCard(m, 99, 'ArrowRight'), 0);
  assert.equal(
    stepCard(atlasModel(save(0)), 0, 'ArrowRight'),
    0,
    'only the teaser is reachable at the start',
  );
});

test('atlas-ui.js: no hard-coded player text, no innerHTML', () => {
  assert.ok(!/innerHTML|insertAdjacentHTML/.test(src));
  const lits = [...src.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map(m => m[1]);
  for (const s of lits.filter(x => /[A-Za-zÀ-ɏ]/.test(x))) {
    assert.ok(!/[^\x00-\x7f]/.test(s) || /^[●○]+$/.test(s) || s === '×', `non-ASCII literal: ${s}`);
    assert.ok(!/\b[A-Z][a-z]+ [a-z]+/.test(s), `sentence-like literal: ${s}`);
  }
  assert.ok(/\bt\('atlas\./.test(src));
});
test('every atlas.* key used by atlas-ui.js exists in EN and CS with equal parameters', () => {
  const keys = new Set([...src.matchAll(/'(atlas\.[\w.]+)'/g)].map(m => m[1]));
  for (const id of ['violet', 'moon', 'sunset', 'core']) keys.add(`atlas.district.${id}.title`);
  assert.ok(keys.size > 25);
  for (const k of keys) {
    for (const l of LANG_IDS) assert.ok(has(k, l), `${l}: ${k}`);
    assert.deepEqual(paramsOf(LOCALES.en[k]), paramsOf(LOCALES.cs[k]), k);
  }
  assert.equal(t('atlas.ui.nodes'), 'Extras');
});
