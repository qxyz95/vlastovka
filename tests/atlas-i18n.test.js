import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/atlas-content.js';
import { ROUTE } from '../src/scenes.js';
import { LOCALES, LANG_IDS, setLang, setStrict, has, paramsOf, t } from '../src/i18n.js';
import { fmtCoins, fmtMeters, fmtPct } from '../src/atlas-text.js';
const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
setStrict(true);
const inLang = (lang, fn) => {
  setLang(lang);
  try {
    return fn();
  } finally {
    setLang('en');
  }
};
// Player text of content: only live getters (ids, kinds and colors are data, not text).
const texts = (o, out = []) => {
  if (!o || typeof o !== 'object') return out;
  for (const d of Object.values(Object.getOwnPropertyDescriptors(o))) {
    const v = d.get ? d.get.call(o) : d.value;
    if (d.get && typeof v === 'string') out.push(v);
    else if (d.get && Array.isArray(v)) out.push(...v.filter(x => typeof x === 'string'));
    else texts(v, out);
  }
  return out;
};
const strings = o =>
  typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : [];
const content = () =>
  texts([C.DISTRICTS, C.PLACES, C.BONUSES, C.TAGS, C.SPECIALS, C.PAPERS, C.NODES]);

test('every atlas.* key exists in EN and CS with the same parameters and plural forms', () => {
  const keys = new Set(
    LANG_IDS.flatMap(l => Object.keys(LOCALES[l]).filter(k => k.startsWith('atlas.'))),
  );
  assert.ok(keys.size > 280, `${keys.size} keys`);
  for (const k of keys) {
    for (const l of LANG_IDS) assert.ok(has(k, l), `${l}: missing ${k}`);
    assert.deepEqual(paramsOf(LOCALES.en[k]), paramsOf(LOCALES.cs[k]), `params of ${k}`);
    if (typeof LOCALES.en[k] === 'object')
      assert.deepEqual(
        Object.keys(LOCALES.en[k]).sort(),
        ['one', 'other'],
        `EN plural forms of ${k}`,
      );
    if (typeof LOCALES.cs[k] === 'object')
      assert.deepEqual(
        Object.keys(LOCALES.cs[k]).sort(),
        ['few', 'many', 'one', 'other'],
        `CS plural forms of ${k}`,
      );
    for (const l of LANG_IDS)
      assert.ok(
        strings(LOCALES[l][k]).every(s => s.trim()),
        `${l}: ${k}`,
      );
  }
});
test('every key used by atlas-content and atlas-text resolves in strict mode, in both languages', () => {
  const src = read('src/atlas-text.js');
  const literal = [...src.matchAll(/'(atlas\.[\w.]+)'/g)]
    .map(m => m[1])
    .filter(k => !k.endsWith('.'));
  assert.ok(literal.length > 20);
  for (const l of LANG_IDS)
    inLang(l, () => {
      for (const k of literal) assert.ok(has(k, l), `${l}: ${k}`);
      for (const r of ['slot', 'unknown', 'later']) assert.ok(has('atlas.reason.' + r, l));
      const all = content();
      assert.ok(all.length > 150, `${l}: ${all.length} strings`);
      for (const s of all) assert.ok(s.trim() && !/^atlas\./.test(s), `${l}: ${s}`);
      for (const b of Object.values(C.BONUSES))
        for (const e of b.effect ?? []) assert.ok(has(e.key, l), `${l}: ${e.key}`);
      t('atlas.rule');
    });
});
test('guard: no stale cyber wording in any Atlas text or in the locales (both languages)', () => {
  const stale = {
    en: /violet|neon|cyber|antenna|broadcast|metropolis|bolts|zippy|ad drone|\bdrones?\b|robot|on air/i,
    cs: /fialov|neon|kyber|anten|anté|vysílací|metropol|bolts|zippy|\bdron|robot|ve vysílání/i,
  };
  for (const l of LANG_IDS)
    inLang(l, () => {
      const all = [...content(), ...strings(Object.values(LOCALES[l]))];
      for (const s of all) assert.ok(!stale[l].test(s), `${l}: "${s}"`);
    });
});
test('06 names: Sky Lantern, Chimes, Silver Foil, Paper Pigeon, Lantern Draft, Windmill Wake, new characters', () => {
  inLang('en', () => {
    assert.equal(C.BONUSES.drone.name, 'Sky Lantern');
    assert.equal(C.BONUSES.onAir.name, 'Chimes');
    assert.equal(C.PAPERS.neon, 'Silver Foil');
    assert.equal(C.DISTRICTS[0].locals.bird, 'Paper Pigeon');
    assert.equal(C.DISTRICTS[3].locals.bird, 'Paper Pigeon');
    assert.equal(C.DISTRICTS[3].locals.gust, 'Lantern Draft');
    assert.equal(C.DISTRICTS[2].locals.gust, 'Windmill Wake');
    assert.equal(C.DISTRICTS[0].character.role, 'Retired postman');
    assert.equal(C.DISTRICTS[3].character.role, "Lamplighter who'd rather be a pigeon");
    assert.equal(C.DISTRICTS[1].character.name, 'Marge');
    assert.equal(C.DISTRICTS[2].character.name, 'Stella');
  });
  inLang('cs', () => {
    assert.equal(C.BONUSES.drone.name, 'Nebeský lampion');
    assert.equal(C.BONUSES.onAir.name, 'Zvonkohra');
    assert.equal(C.PAPERS.neon, 'Stříbrná fólie');
    assert.equal(C.DISTRICTS[0].locals.bird, 'Papírový holub');
    assert.equal(C.DISTRICTS[3].locals.gust, 'Tah od lampionů');
    assert.equal(C.DISTRICTS[2].locals.gust, 'Závan od mlýna');
    assert.equal(C.DISTRICTS[0].character.role, 'Listonoš v penzi');
    assert.equal(C.DISTRICTS[3].character.role, 'Lampář, který by radši byl holub');
  });
});
test('places: kind maps to the route, names and stories come from place.<kind>', () => {
  assert.equal(C.PLACES.length, ROUTE.length);
  C.PLACES.forEach((pl, i) => {
    assert.equal(pl.kind, ROUTE[i].kind, `${pl.id} kind`);
    for (const l of LANG_IDS)
      inLang(l, () => {
        assert.equal(pl.name, t('place.' + pl.kind));
        assert.equal(pl.story, t('place.' + pl.kind + '.story'));
        assert.equal(pl.name, ROUTE[i].name);
      });
  });
  assert.equal(new Set(C.PLACES.map(x => x.kind)).size, 16);
  assert.deepEqual(
    C.PLACES.map(x => x.id),
    [
      'roofs',
      'market',
      'gardens',
      'railway',
      'warehouses',
      'cranes',
      'bridge',
      'lighthouse',
      'fields',
      'ridge',
      'saddle',
      'observatory',
      'gates',
      'terraces',
      'tower',
      'harbor',
    ],
  );
  assert.deepEqual(
    C.DISTRICTS.map(d => d.id),
    ['violet', 'moon', 'sunset', 'core'],
  );
  assert.deepEqual(
    C.DISTRICTS.map(d => d.character.id),
    ['bolts', 'marge', 'stella', 'zippy'],
  );
});
test('district names come from district.* (sentence case), not duplicated in Atlas keys', () => {
  inLang('en', () =>
    assert.deepEqual(
      C.DISTRICTS.map(d => d.name),
      ['Sunrise roofs', 'Bright harbor', 'Golden fields', 'Lantern city'],
    ),
  );
  inLang('cs', () => assert.equal(C.DISTRICTS[0].name, 'Střechy za úsvitu'));
  for (const l of LANG_IDS)
    assert.ok(!Object.keys(LOCALES[l]).some(k => /^atlas\.(district|place)\.\w+\.name$/.test(k)));
});
test('texts follow the language live; numbers follow the language', () => {
  const pl = C.PLACES[1];
  assert.equal(
    inLang('en', () => pl.name),
    'Market under the Bunting',
  );
  assert.equal(
    inLang('cs', () => pl.name),
    'Trh pod praporky',
  );
  assert.equal(
    inLang('cs', () => fmtCoins(1240)),
    '1 240 ◈',
  );
  assert.equal(
    inLang('en', () => fmtCoins(1240)),
    '1,240 ◈',
  );
  assert.equal(
    inLang('cs', () => fmtMeters(1.5)),
    '1,5 m',
  );
  assert.equal(
    inLang('en', () => fmtPct(0.134, true)),
    '+13.4 %',
  );
});
test('nodes: Night Route hidden (no player text), Autopilot marked for the 2nd wave', () => {
  assert.equal(C.NODES.nightRoute.hidden, true);
  assert.equal(C.NODES.nightRoute.name, undefined);
  assert.equal(C.NODES.autoQte.wave, 2);
  for (const l of LANG_IDS)
    assert.ok(!Object.keys(LOCALES[l]).some(k => /nightRoute|nightNote/.test(k)));
});
test('03-texty.md is marked outdated and zdroje.md calls it superseded', () => {
  assert.match(
    read('research/atlas/03-texty.md'),
    /^> \*\*ZASTARALÉ \(15\. 10\. 2026\):\*\* texty Atlasu žijí v `src\/locales/,
  );
  const row = read('docs/zdroje.md')
    .split('\n')
    .find(l => l.includes('research/atlas/03-texty.md'));
  assert.match(row, /překonaný/);
});
