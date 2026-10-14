import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAPIR, OLD_LIFE, palette, PAPER_TOKENS, PAPER_ROLE } from '../src/render3d/palette.js';
import { moodAt, PAPER_KEYS, breath } from '../src/render3d/mood.js';
import { PAPER_MOODS } from '../src/render3d/paper-mood.js';
import { SCREEN_METERS } from '../src/scenes.js';

// Papírové město P0, po R0 jediný styl: paleta PAPIR (bible 05 kap. 2) a nálady (kap. 2.3, 4).
const HEX = /^#[0-9a-f]{6}$/;
const lin = c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  },
  lum = h => {
    const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
const contrast = (a, b) => {
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const walk = (o, p = '') =>
  typeof o === 'string'
    ? [[p, o]]
    : Array.isArray(o)
      ? o.flatMap((v, i) => walk(v, `${p}[${i}]`))
      : o && typeof o === 'object'
        ? Object.entries(o).flatMap(([k, v]) => walk(v, `${p}.${k}`))
        : [];

test('paleta: jediná PAPIR (palette() parametr ignoruje), klíče, které čtou scene/plane/ui-layer/companion3d/workshop/modely, barvy hex', () => {
  for (const id of [undefined, 'papir', 'cyber', 'nope'])
    assert.equal(palette(id), PAPIR, String(id));
  assert.deepEqual(Object.keys(PAPIR).sort(), [
    'aim',
    'city',
    'companion',
    'flash',
    'id',
    'label',
    'life',
    'lights',
    'particles',
    'plane',
    'popup',
    'qte',
    'speed',
    'trail',
    'workshop',
  ]);
  for (const [g, ks] of Object.entries({
    plane: ['fill', 'under', 'outline', 'crease', 'outlinePx'],
    qte: [
      'track',
      'success',
      'perfect',
      'dot',
      'warning',
      'disc',
      'discAlpha',
      'shadow',
      'width',
      'result',
      'gust',
      'gustEdge',
      'bird',
    ],
    popup: ['perfect', 'success', 'miss', 'milestone', 'land', 'font', 'bg', 'tilt'],
    label: ['bg', 'text', 'tilt'],
    aim: ['arrow', 'panel', 'text', 'bar', 'cap'],
    speed: ['line', 'alpha', 'width', 'gap'],
    lights: ['hemiSky', 'hemiGround', 'key', 'rim'],
    companion: ['body', 'head', 'beak', 'tail', 'bread', 'wing', 'eye', 'steam', 'vent', 'grate'],
  }))
    for (const k of ks) assert.ok(k in PAPIR[g], `${g}.${k}`);
  assert.equal(PAPIR.trail.length, 2);
  assert.equal(PAPIR.particles.length, 5);
  assert.equal(PAPIR.city.districts.length, 4);
  for (const [p, v] of walk(PAPIR)) if (!/font$/.test(p) && p !== '.id') assert.match(v, HEX, p);
  for (const [p, v] of walk(OLD_LIFE)) assert.match(v, HEX, 'OLD_LIFE' + p);
  for (const [k, v] of Object.entries(PAPER_TOKENS))
    if (!['display', 'body', 'hand'].includes(k)) assert.match(v, HEX, k);
  assert.ok(!/monospace/.test(PAPER_TOKENS.display + PAPER_TOKENS.body + PAPER_TOKENS.hand));
});

test('paleta PAPIR: role a tokeny podle bible (jedna role = jedna barva, kontrasty kap. 2.4)', () => {
  const T = PAPER_TOKENS;
  assert.equal(PAPIR.plane.fill, T.paper);
  assert.equal(PAPIR.plane.outline, T.graphite);
  assert.equal(PAPIR.plane.outlinePx, 2.6);
  assert.equal(PAPIR.qte.success, T.teal);
  assert.equal(PAPIR.qte.perfect, T.tomato);
  assert.equal(PAPIR.qte.track, T.miss);
  assert.equal(PAPIR.qte.dot, T.graphite);
  assert.equal(PAPIR.qte.disc, T.cream);
  assert.equal(PAPIR.qte.discAlpha, 0.95);
  assert.equal(PAPIR.label.bg, T.graphite);
  assert.equal(PAPIR.label.text, T.cream);
  assert.equal(PAPER_ROLE.value, T.mustard);
  assert.notEqual(PAPER_ROLE.success, PAPER_ROLE.perfect);
  // Hořčicová jen hodnota: mimo hodnotové role a Dílnu (pláštěnka, knoflík) ani jinde v UI paletě.
  for (const g of ['plane', 'qte', 'label', 'aim', 'speed', 'popup', 'companion'])
    for (const [p, v] of walk(PAPIR[g]))
      if (v === T.mustard) assert.fail(`${g}${p}: hořčicová mimo hodnotu`);
  assert.ok(contrast(T.graphite, T.cream) >= 13);
  assert.ok(contrast(T.pencil, T.cream) >= 4.5);
  assert.ok(contrast(T.mustardText, T.cream) >= 4.5);
  assert.ok(contrast(T.cream, T.tomato600) >= 4.5);
  assert.ok(contrast(T.pencil700, T.desk) >= 4.5);
  assert.ok(contrast(T.cobalt, T.desk) >= 3);
  // QTE na krémovém disku 95 % nad nejsvětlejším i nejtmavším pásem ranního nebe ≥ 3 : 1 (kap. 11).
  const mix = (a, b, k) =>
    '#' +
    [1, 3, 5]
      .map(i => {
        const x = parseInt(a.slice(i, i + 2), 16),
          y = parseInt(b.slice(i, i + 2), 16);
        return Math.round(x + (y - x) * k)
          .toString(16)
          .padStart(2, '0');
      })
      .join('');
  for (const s of [PAPER_MOODS[0].sky[0], PAPER_MOODS[0].sky[3]]) {
    const d = mix(s, PAPIR.qte.disc, PAPIR.qte.discAlpha);
    for (const k of ['track', 'success', 'perfect', 'dot'])
      assert.ok(contrast(PAPIR.qte[k], d) >= 3, `${k} na ${d}`);
  }
});

test('PAPER_KEYS: 17 klíčů ve středech míst (+ úsvit), jedna nálada na čtvrť, tvar mood.js + skyAt/haze/light/shadow', () => {
  assert.equal(PAPER_KEYS.length, 17);
  PAPER_KEYS.forEach((k, i) => {
    assert.equal(k.x, (i + 0.5) * SCREEN_METERS);
    assert.equal(k.district, Math.min(3, Math.floor(i / 4)));
    assert.equal(k.dawn, i === 16);
    for (const n of [
      'sky',
      'sun',
      'sun2',
      'moon',
      'key',
      'rim',
      'hemi',
      'fog',
      'windows',
      'windowColor',
      'neon',
      'night',
      'trail',
      'particles',
    ])
      assert.ok(n in k, `${i}: ${n}`);
    assert.equal(k.sky.length, 4);
    assert.equal(k.skyAt.length, 4);
    assert.ok(k.skyAt.every((v, j) => j === 0 || v > k.skyAt[j - 1]));
    for (const n of ['low', 'high', 'from', 'to', 'max', 'curve']) assert.ok(n in k.haze, n);
    assert.ok(k.haze.max <= 0.72);
    assert.equal(k.light.length, 3);
    assert.match(k.shadow, HEX);
    assert.equal(k.neon, 0);
    for (const [p, v] of walk(k))
      if (!['name'].includes(p.slice(1)) && p !== '.particles.kind')
        assert.match(v, HEX, `${i}${p}`);
  });
  for (let d = 0; d < 4; d++)
    for (let j = 1; j < 4; j++) assert.deepEqual(PAPER_MOODS[d * 4 + j], PAPER_MOODS[d * 4]);
  // Čtvrť 1 „ráno“ beze změny (rozhodnutí 14. 10.).
  const m = PAPER_KEYS[0];
  assert.deepEqual(m.sky, ['#78b4dc', '#a6d0e8', '#d8e9ea', '#fce4c6']);
  assert.deepEqual(m.skyAt, [0, 0.42, 0.74, 0.9]);
  assert.deepEqual(m.haze, {
    low: '#f6e6d2',
    high: '#cfe2ec',
    from: 20,
    to: 700,
    max: 0.72,
    curve: 0.8,
  });
  assert.deepEqual(m.light, [0.62, 0.5, 0.6]);
  assert.equal(m.shadow, PAPER_TOKENS.shade);
  assert.equal(m.trail, PAPER_TOKENS.graphite);
  assert.equal(PAPER_KEYS[12].trail, PAPER_TOKENS.cream, 'večer stopa krémová');
  // Stopa ≥ 3 : 1 proti každému pásu nebe čtvrti 1 (P1). Čtvrti 2–4 jsou prozatímní (večer: krém × obzor #e08a74 jen 2,4 : 1, řeší návrh čtvrti 4).
  for (const k of PAPER_KEYS.slice(0, 4))
    for (const s of k.sky) assert.ok(contrast(k.trail, s) >= 3, `stopa ${k.trail} × ${s}`);
});

test('moodAt: papír z PAPER_KEYS (style se ignoruje), plynulý přechod, zadržení dechu tlumí i opar', () => {
  for (const x of [0, 100, 700, 2500, 4000, 4876, 6000]) {
    assert.deepEqual(moodAt(x, 1.5, { style: 'cyber' }), moodAt(x, 1.5));
    assert.deepEqual(moodAt(x, 1.5, { style: 'papir' }), moodAt(x, 1.5));
    const p = moodAt(x, 1.5);
    assert.ok(!('style' in p));
    for (const n of [
      'sky',
      'skyAt',
      'haze',
      'light',
      'shadow',
      'trail',
      'sun',
      'moon',
      'fog',
      'particles',
      'x',
      'place',
      'district',
      'dawn',
      'hold',
      'rain',
    ])
      assert.ok(n in p, n);
  }
  assert.deepEqual(moodAt(SCREEN_METERS * 1.5, 0).sky, PAPER_KEYS[1].sky);
  assert.deepEqual(moodAt(-50, 0), moodAt(0, 0));
  assert.deepEqual(moodAt(NaN, 0), moodAt(0, 0));
  const ch = (a, b) =>
    Math.max(
      ...[0, 1, 2].map(j =>
        Math.abs(
          parseInt(a.slice(1 + 2 * j, 3 + 2 * j), 16) - parseInt(b.slice(1 + 2 * j, 3 + 2 * j), 16),
        ),
      ),
    );
  for (let x = 0; x <= 5400; x += 1) {
    const a = moodAt(x, 0),
      b = moodAt(x + 1, 0);
    for (let j = 0; j < 4; j++) assert.ok(ch(a.sky[j], b.sky[j]) <= 3, `skok nebe u ${x} m`);
  }
  const m = moodAt(400, 0),
    h = moodAt(400, 0, { hold: 1 });
  assert.deepEqual(h, breath(m, 1));
  assert.notEqual(h.haze.low, m.haze.low);
  assert.equal(h.trail, m.trail);
});
