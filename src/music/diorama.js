// G · Diorama: a small paper band at a table in the attic (research/hudba/03 B–E). Music box, felt piano, plucked string
// (Karplus–Strong), flute, upright bass, "whispered paper" bed; paper percussion (shoe box, page, brush, pencil, crumple).
// Generative core of E (Eno cycles, seeded chord chain, density from speed), one theme "Throw" (ARC) growing with the place.
import { ARC, rngFor, pick } from '../audio-mix.js';
import { deg, chord, near, phrase, motifBar, swing, events } from './compose.js';
const ID = 'G';
// One sharp less per district (B.3): lydian → ionian → mixolydian → dorian, sunrise again in the finale.
export const districts = [
  {
    name: 'Sunrise Roofs',
    bpm: 84,
    mode: 'lydian',
    swing: 0,
    lead: 'musicbox',
    keys: 'piano',
    verbSec: 1.2,
    // Layer balance in dB, set by measured LUFS (03 F.4): the bed carries, the pulse stays under the thinning.
    layerDb: [11.4, -12.5, 7.6, 10.6],
    verb: [0.35, 0.2, 0.08, 0.35],
    echo: [0, 0.05, 0, 0.1],
    pool: [0, 1, 0, 5, 4],
    sparse: true,
    sparkle: true,
  },
  {
    name: 'Bright Harbor',
    bpm: 92,
    mode: 'ionian',
    swing: 0.58,
    lead: 'flute',
    keys: 'ks',
    verbSec: 1.8,
    layerDb: [11.4, -11.7, 6.6, 6.4],
    verb: [0.45, 0.25, 0.1, 0.4],
    echo: [0, 0.1, 0, 0.15],
    pool: [0, 3, 4, 5],
    waves: true,
  },
  {
    name: 'Golden Fields',
    bpm: 96,
    mode: 'mixolydian',
    swing: 0.66,
    lead: 'flute',
    keys: 'piano',
    verbSec: 0.9,
    layerDb: [11.4, -12, 6.6, 6],
    verb: [0.3, 0.15, 0.06, 0.28],
    echo: [0, 0, 0, 0.1],
    pool: [0, 6, 3, 0],
    ostinato: true,
    second: true,
  },
  {
    name: 'Lantern City',
    bpm: 100,
    mode: 'dorian',
    swing: 0,
    lead: 'piano',
    keys: 'piano',
    verbSec: 1.4,
    layerDb: [9.9, -12.1, 6.3, 4.8],
    verb: [0.4, 0.2, 0.08, 0.35],
    echo: [0, 0.12, 0, 0.3],
    pool: [0, 3, 0, 6],
    canon: true,
    reed: true,
    sparkle: true,
    syncopated: true,
  },
];
export const finale = {
  name: 'Delivered',
  bpm: 72,
  mode: 'lydian',
  verbSec: 2.5,
  roots: [0, 1, 3, 0],
};
// Voices of the band (03 B.2); everything else in synth.js belongs to the old directions.
export const VOICES = [
  'musicbox',
  'piano',
  'ks',
  'flute',
  'upright',
  'sub',
  'paperpad',
  'organ',
  'box',
  'page',
  'brush',
  'pencil',
  'crumple',
  'air',
];
// Piano cycles in beats [period, offset] (Eno): they drift against each other and the 2-bar chords.
const LOOPS = [
  [6.5, 0],
  [9, 1.5],
  [10.75, 3],
  [13.5, 0.75],
];
const chordAt = (c, seed, d, k) => {
  const at = q => Math.floor(rngFor(seed, ID, d, 'c', q)() * c.pool.length),
    i = at(k),
    j = k > 0 ? at(k - 1) : -1;
  return c.pool[i === j ? (i + 1) % c.pool.length : i];
};
// Notes of the theme a lead plays at place 0–3 (C.2): head 1-5-6, + the 4th, the whole theme; the answer comes at place 3.
export const THEME_LEN = [3, 4, 6, 6];
export const ANSWER = [5, 6, 7];
export function themeNotes(d, place = 3, oct = 4) {
  const a = ARC[d],
    n = THEME_LEN[Math.max(0, Math.min(3, place))],
    out = [];
  let pos = 0;
  a.motif.slice(0, n).forEach((x, k) => {
    const len = a.rhythm[k];
    out.push({ b: pos / 2, d: (len / 2) * 0.92, n: deg(a.mode, x, oct) });
    pos += len;
  });
  return out;
}
const answerNotes = (mode, oct) =>
  ANSWER.map((x, k) => ({ b: [0, 1, 2][k], d: k === 2 ? 1.8 : 0.9, n: deg(mode, x, oct) }));
// One bar. o = {seed, density 0–1 (speed), place 0–3 (frontier inside the district), bedOnly (fatigue: no theme)}.
export function bar(i, d, { seed = 1, density = 0.5, place = 3, bedOnly = false } = {}) {
  const c = districts[d],
    m = c.mode,
    ph = phrase(i),
    r = rngFor(seed, ID, d, i),
    root = chordAt(c, seed, d, Math.floor(i / 2)),
    first = i % 2 === 0,
    exhale = ph.section === 'C',
    sw = b => (c.swing ? swing(b, c.swing) : b),
    leadOct = c.lead === 'piano' ? 3 : 4,
    [ev, E] = events();
  // L0 bed: whispered paper on the chord tones (add9), harmonium drone in the lanterns, wind through the open window.
  if (first) {
    const ns = near(chord(m, root, 3, 3, [1]), 60);
    E(0, 8.2, ns[0], 'paperpad', 0, 0.6, { notes: ns, a: 1.5, r: 2 });
    if (c.reed)
      for (const n of [deg(m, root, 3), deg(m, root + 4, 3)])
        E(0, 7.8, n, 'organ', 0, 0.45, { reed: true });
  }
  if (i % 4 === 0) E(0, 18, null, 'air', 0, 0.55, { seed: i + d * 1000 });
  // The head of the theme, quietly in the felt piano, every other phrase (heard in the Workshop and Result too).
  if (!bedOnly && ph.first && ph.p % 2 === 0)
    for (const n of themeNotes(d, place, leadOct))
      E(sw(n.b), n.d + 0.5, n.n, 'piano', 0, 0.3, { felt: true });
  // L1 pulse: upright bass, piano or string on the Eno cycles, waves / windmill ostinato, more notes with speed.
  if (first) E(0, 7.5, deg(m, root, 2), 'sub', 1, 0.3, { a: 0.8, r: 1.5 });
  const fifth = deg(m, root + (r() < 0.6 ? 4 : 2), 2);
  if (c.syncopated) {
    E(0, 1.2, deg(m, root, 2), 'upright', 1, 0.8);
    E(1.5, 0.8, fifth, 'upright', 1, 0.6);
    E(2.5, 0.4, deg(m, root, 2), 'upright', 1, 0.55);
    E(3.5, 0.4, deg(m, root + 1, 2), 'upright', 1, 0.5);
  } else {
    E(0, 1.6, deg(m, root, 2), 'upright', 1, 0.8);
    E(2, c.sparse ? 1.6 : 1, fifth, 'upright', 1, 0.6);
    if (!c.sparse) E(sw(3.5), 0.4, deg(m, root, 2), 'upright', 1, 0.45);
  }
  for (const [P, off] of LOOPS)
    for (let q = Math.max(0, Math.ceil((i * 4 - off) / P)); off + q * P < i * 4 + 4; q++) {
      const at = off + q * P - i * 4,
        rr = rngFor(seed, ID, d, 'loop', P, q);
      if (rr() < 0.3) continue;
      E(
        at,
        2.5,
        deg(m, root + pick(rr, [0, 2, 4, 1, 4, 6]), rr() < 0.6 ? 4 : 5),
        c.keys,
        1,
        0.28 + 0.24 * rr(),
        c.keys === 'piano' ? { felt: true } : undefined,
      );
    }
  if (c.waves) {
    const ns = near(chord(m, root, 3, 4), 66),
      seq = [...ns, ns[0] + 12, ...ns.slice(1).reverse()];
    for (let s = 0; s < 8; s++)
      E(sw(s * 0.5), 0.9, seq[s % seq.length], 'ks', 1, 0.22 + 0.2 * Math.sin((Math.PI * s) / 7));
  }
  if (c.ostinato)
    [0, 4, 6, 4, 0, 4, 6, 7].forEach((x, s) =>
      E(sw(s * 0.5), 0.8, deg(m, x, 3), 'ks', 1, s % 2 ? 0.26 : 0.36),
    );
  for (let s = 0; s < 8; s++)
    if (r() < density * 0.22)
      E(sw(s * 0.5), 1, deg(m, root + pick(r, [0, 2, 4, 7]), 5), c.waves ? 'ks' : c.keys, 1, 0.2, {
        felt: true,
      });
  // L2 paper percussion: finger on a shoe box, flat hand on a page, brush on paper; the exhale (section C) has none.
  if (!exhale) {
    E(0, 0.3, null, 'box', 2, 0.75);
    if (density > 0.4 || c.syncopated) E(c.syncopated ? 2.5 : 2, 0.3, null, 'box', 2, 0.5);
    for (const b of c.sparse && density < 0.6 ? [3] : [1, 3]) E(b, 0.2, null, 'page', 2, 0.6);
    if (c.syncopated && r() < 0.6) E(2.75, 0.1, null, 'page', 2, 0.25);
    for (let s = 0; s < 8; s++)
      if (r() < 0.7)
        E(sw(s * 0.5), 0.1, null, 'brush', 2, (s % 2 ? 0.25 : 0.35) * (1 - 0.5 * density));
    if (ph.last && r() < 0.5) E(3.5, 0.05, null, 'pencil', 2, 0.5);
    if (ph.last && r() < 0.35) E(3, 0.8, null, 'crumple', 2, 0.5, { seed: i });
  }
  // L3 lead: the theme twice a phrase (the morning every other phrase), longer with the place; every form cycle varies it.
  const cyc = ph.cycle % 3,
    stating = (ph.pos === 0 || ph.pos === 4) && (!c.sparse || ph.p % 2 === 0);
  if (stating) {
    const notes =
      cyc === 2 && place >= 2
        ? motifBar(r, ARC[d].motif, ARC[d].rhythm, m, { oct: leadOct, kind: 4 }).slice(0, 5)
        : themeNotes(d, place, leadOct);
    notes.forEach((n, k) => {
      const o = c.lead === 'piano' ? { felt: true, part: 'theme' } : { part: 'theme' };
      E(sw(n.b), n.d, n.n, c.lead, 3, 0.62, o);
      if (cyc === 1) E(sw(n.b), n.d, n.n + 12, 'musicbox', 3, 0.3, { part: 'double' });
      // Golden Fields: a second flute a third below.
      if (c.second && cyc !== 2)
        E(sw(n.b), n.d, deg(m, ARC[d].motif[k] - 2, leadOct), 'flute', 3, 0.35, { part: 'second' });
    });
  }
  if ((ph.pos === 1 || ph.pos === 5) && (!c.sparse || ph.p % 2 === 0)) {
    if (place >= 3)
      for (const n of answerNotes(m, leadOct))
        E(
          sw(n.b),
          n.d,
          n.n,
          c.lead,
          3,
          0.55,
          c.lead === 'piano' ? { felt: true, part: 'answer' } : { part: 'answer' },
        );
    // Lanterns light up one after another: the music box repeats the theme a bar later, two octaves up.
    if (c.canon)
      for (const n of themeNotes(d, place, 6))
        E(n.b, n.d, n.n, 'musicbox', 3, 0.3, { part: 'canon' });
  } else if (c.sparkle && !stating && r() < 0.5)
    E(Math.floor(r() * 8) / 2, 1.2, deg(m, root + pick(r, [0, 2, 4, 6]), 6), 'musicbox', 3, 0.22, {
      part: 'sparkle',
    });
  return ev;
}
// Notes the plucked string can play in a district (for warming the KS cache before the music needs it, off the scheduler).
const KS_NOTES = new Map();
export function ksNotes(d) {
  if (!KS_NOTES.has(d)) {
    const s = new Set();
    for (const seed of [1, 2, 3])
      for (let i = 0; i < 64; i++)
        for (const e of bar(i, d, { seed, density: 1, place: 3 })) if (e.i === 'ks') s.add(e.n);
    KS_NOTES.set(
      d,
      [...s].sort((x, y) => x - y),
    );
  }
  return KS_NOTES.get(d);
}
// Finale "Delivered." (C.2, E.2): every instrument plays one phrase of the resolved theme, 4 s of silence, a solo music box.
// Returns events with b in beats from the start and a ritardando already applied.
export function cue(name, { seed = 1 } = {}) {
  if (name !== 'finale') return [];
  const f = finale,
    m = f.mode,
    a = ARC[4],
    [ev, E] = events(),
    rit = b => b + 0.012 * b * b,
    r = rngFor(seed, ID, 'finale');
  ['musicbox', 'flute', 'ks', 'piano'].forEach((voice, k) => {
    const at = k * 8,
      root = f.roots[k];
    const ns = near(chord(m, root, 3, 3, [1]), 60);
    E(rit(at), 8, ns[0], 'paperpad', 0, 0.55, { notes: ns, a: 1.2, r: 2.5 });
    E(rit(at), 3, deg(m, root, 2), 'upright', 1, 0.6);
    for (const n of themeNotes(4, 3, voice === 'piano' ? 4 : 5))
      E(
        rit(at + n.b),
        n.d * 1.4,
        n.n,
        voice,
        3,
        0.55 + 0.1 * r(),
        voice === 'piano' ? { felt: true } : undefined,
      );
  });
  const solo = 32 + (4 * f.bpm) / 60 + 1;
  for (const n of themeNotes(4, 3, 5)) E(rit(solo) + n.b * 1.3, n.d * 2, n.n, 'musicbox', 3, 0.6);
  E(rit(solo) + 6, 6, deg(m, 0, 4), 'musicbox', 3, 0.4);
  return ev;
}
export default {
  id: ID,
  name: 'Diorama',
  style: 'paper band, generative acoustic',
  quality: 'full',
  districts,
  finale,
  bar,
  cue,
  ksNotes,
};
