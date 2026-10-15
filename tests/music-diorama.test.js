import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import Diorama, {
  bar,
  cue,
  districts,
  finale,
  VOICES,
  THEME_LEN,
  themeNotes,
} from '../src/music/diorama.js';
import { TRACKS, TRACK_IDS } from '../src/music/index.js';
import { VOICE_NAMES } from '../src/music/synth.js';
import { ARC, inScale } from '../src/audio-mix.js';

const pitches = e => [e.n, ...(e.o?.notes ?? [])].filter(n => n != null);
const sig = evs => JSON.stringify(evs);

test('Diorama is registered as G next to B and E', () => {
  assert.equal(TRACKS.G, Diorama);
  assert.deepEqual(TRACK_IDS, ['B', 'E', 'G']);
  assert.equal(Diorama.id, 'G');
  assert.equal(districts.length, 4);
});
test('T-3 every pitched note of 64 bars is in the district mode (3 seeds, every place)', () => {
  for (let d = 0; d < 4; d++)
    for (const seed of [1, 2, 99])
      for (let i = 0; i < 64; i++)
        for (const e of bar(i, d, { seed, density: 0.8, place: i % 4 }))
          for (const n of pitches(e))
            assert.ok(inScale(n, 'D', districts[d].mode), `d${d} s${seed} bar ${i} ${e.i} ${n}`);
  for (const e of cue('finale')) for (const n of pitches(e)) assert.ok(inScale(n, 'D', 'lydian'));
});
test('T-4 determinism: same (i, d, seed, place) → same events; another seed differs in at least 1 of 8 bars', () => {
  for (let d = 0; d < 4; d++) {
    let differ = 0;
    for (let i = 0; i < 8; i++) {
      const o = { seed: 5, density: 0.6, place: 2 };
      assert.equal(sig(bar(i, d, o)), sig(bar(i, d, { ...o })), `d${d} bar ${i}`);
      if (sig(bar(i, d, o)) !== sig(bar(i, d, { ...o, seed: 6 }))) differ++;
    }
    assert.ok(differ >= 1, `d${d}: ${differ} bars differ`);
  }
  assert.equal(sig(cue('finale', { seed: 3 })), sig(cue('finale', { seed: 3 })));
});
test('T-5 only the paper band voices (03 B.2), none of the removed neon or lo-fi voices', () => {
  const banned = ['pad', 'bass', 'lead', 'pluck', 'kick', 'snare', 'clap', 'hat', 'tom', 'crash'];
  banned.push('vinyl', 'rain', 'sax', 'choir', 'epiano', 'shaker', 'rim', 'felt', 'bell', 'glock');
  const used = new Set();
  for (let d = 0; d < 4; d++)
    for (let i = 0; i < 96; i++)
      for (const e of bar(i, d, { seed: 3, density: 1, place: 3 })) used.add(e.i);
  for (const e of cue('finale')) used.add(e.i);
  for (const v of used) {
    assert.ok(VOICES.includes(v), `${v} is not a band voice`);
    assert.ok(VOICE_NAMES.includes(v), `${v} missing in synth.js`);
    assert.ok(!banned.includes(v), v);
  }
  for (const v of VOICES) assert.ok(VOICE_NAMES.includes(v), `synth.js has ${v}`);
  for (const v of ['musicbox', 'ks', 'flute', 'paperpad', 'box', 'page', 'brush', 'crumple'])
    assert.ok(used.has(v), `${v} is used`);
});
test('T-6 the lead grows with the place: 3 / 4 / 6 / 6 notes of the theme, the answer only at place 4', () => {
  for (let d = 0; d < 4; d++)
    for (let place = 0; place < 4; place++) {
      // Phrase 0, cycle 0: bar 0 states the theme, bar 1 may answer.
      const theme = bar(0, d, { seed: 1, place }).filter(e => e.l === 3 && e.o?.part === 'theme'),
        answer = bar(1, d, { seed: 1, place }).filter(e => e.l === 3 && e.o?.part === 'answer');
      assert.equal(theme.length, THEME_LEN[place], `d${d} place ${place}`);
      assert.equal(THEME_LEN[place], [3, 4, 6, 6][place]);
      assert.deepEqual(
        theme.map(e => e.n),
        themeNotes(d, place, d === 3 ? 3 : 4).map(n => n.n),
        'the plain shape of ARC',
      );
      assert.equal(answer.length > 0, place === 3, `d${d} place ${place} answer`);
      if (place === 3) assert.ok(answer[1].n > answer[0].n && answer[2].n > answer[1].n, 'rises');
    }
  // Theme starts with the leap of a fifth (D → A) in every district.
  for (let d = 0; d < 4; d++) assert.equal(themeNotes(d, 0)[1].n - themeNotes(d, 0)[0].n, 7);
});
test('T-7 higher density → more pulse (L1) notes over 32 bars', () => {
  for (let d = 0; d < 4; d++) {
    const count = density => {
      let n = 0;
      for (let i = 0; i < 32; i++)
        n += bar(i, d, { seed: 4, density }).filter(e => e.l === 1).length;
      return n / 32;
    };
    assert.ok(count(0.9) > count(0.1), `d${d}: ${count(0.1)} → ${count(0.9)}`);
  }
});
test('T-9 tempo 84 / 92 / 96 / 100 BPM, rooms of districts 1–4 at most 1.8 s, the finale the widest', () => {
  assert.deepEqual(
    districts.map(d => d.bpm),
    [84, 92, 96, 100],
  );
  assert.deepEqual(
    districts.map(d => d.mode),
    ARC.slice(0, 4).map(a => a.mode),
  );
  for (const d of districts) assert.ok(d.verbSec > 0 && d.verbSec <= 1.8, d.name);
  assert.ok(finale.verbSec > Math.max(...districts.map(d => d.verbSec)));
  assert.equal(finale.bpm, 72);
});
test('events are valid bars: beats inside the bar, positive length and velocity, all four layers', () => {
  for (let d = 0; d < 4; d++) {
    const layers = new Set();
    for (let i = 0; i < 48; i++)
      for (const e of bar(i, d, { seed: 2, density: 0.7, place: 3 })) {
        assert.ok(e.b >= 0 && e.b < 4, `d${d} ${e.i} b ${e.b}`);
        assert.ok(e.d > 0 && e.v > 0 && e.v <= 1.2, `d${d} ${e.i}`);
        layers.add(e.l);
      }
    assert.equal(layers.size, 4);
  }
  assert.ok(
    bar(8 * 3, 0, { seed: 1 }).every(e => e.l !== 2),
    'phrase C exhales: no paper percussion',
  );
  const bed = bar(0, 0, { seed: 1, bedOnly: true });
  assert.ok(!bed.some(e => e.l === 0 && e.i === 'piano'), 'bedOnly: no theme in the piano');
  assert.ok(
    bar(0, 0, { seed: 1 }).some(e => e.l === 0 && e.i === 'piano'),
    'theme in the felt piano',
  );
});
test('finale: four instruments in turn, then a solo music box landing on the tonic', () => {
  const ev = cue('finale'),
    lead = ev.filter(e => e.l === 3);
  assert.deepEqual([...new Set(lead.map(e => e.i))], ['musicbox', 'flute', 'ks', 'piano']);
  assert.equal(lead.at(-1).i, 'musicbox');
  assert.equal(lead.at(-1).n % 12, 2, 'ends on D');
  assert.deepEqual(cue('other'), []);
});
test('S-1 Diorama loads no files: no fetch or decodeAudioData in diorama.js, ks.js and the voices; no new assets', () => {
  for (const f of ['src/music/diorama.js', 'src/music/ks.js', 'src/music/synth.js']) {
    const s = readFileSync(new URL('../' + f, import.meta.url), 'utf8');
    assert.ok(!/\bfetch\s*\(|decodeAudioData|new Audio\(|XMLHttpRequest/.test(s), f);
  }
  let audio = [];
  try {
    audio = readdirSync(new URL('../assets/audio/', import.meta.url));
  } catch {}
  assert.deepEqual(audio, [], 'assets/audio/ holds nothing');
});
