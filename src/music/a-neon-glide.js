// A · Neon Glide: synthwave / chillwave. Saw pads, eighth-note bass, arpeggio, gated-reverb drums, bell and saw lead.
// Suburbs lydian with a light kit, Docks aeolian half-time with echo, Horizon mixolydian with wide chords, Core dorian with full drums and 16th arps.
import { ARC, rngFor, pick } from '../audio-mix.js';
import { deg, chord, near, phrase, progAt, motifBar, arpBar, hum, events } from './compose.js';
const ID = 'A';
export const districts = [
  {
    name: 'Violet Suburbs',
    bpm: 100,
    mode: 'lydian',
    kit: 'light',
    pad: 1700,
    arp: 0.5,
    verb: [0.5, 0.15, 0.25, 0.45],
    echo: [0, 0, 0, 0.25],
    prog: [
      [0, 1, 0, 1],
      [0, 1, 5, 2],
      [5, 1, 0, 4],
      [0, 2, 1, 4],
    ],
  },
  {
    name: 'Moon Docks',
    bpm: 94,
    mode: 'aeolian',
    kit: 'half',
    pad: 1100,
    arp: 0.5,
    verb: [0.8, 0.2, 0.4, 0.6],
    echo: [0.12, 0, 0.1, 0.35],
    prog: [
      [0, 5, 2, 6],
      [0, 3, 5, 4],
      [0, 6, 5, 6],
      [5, 6, 0, 0],
      [0, 5, 3, 4],
    ],
  },
  {
    name: 'Red Horizon',
    bpm: 104,
    mode: 'mixolydian',
    kit: 'std',
    pad: 2400,
    arp: 0.5,
    wide: true,
    verb: [0.6, 0.15, 0.25, 0.4],
    echo: [0, 0, 0, 0.25],
    prog: [
      [0, 6, 3, 0],
      [0, 4, 6, 3],
      [3, 6, 0, 0],
      [0, 5, 6, 3],
      [5, 3, 6, 0],
    ],
  },
  {
    name: 'Neon Core',
    bpm: 108,
    mode: 'dorian',
    kit: 'full',
    pad: 2000,
    arp: 0.25,
    fast: true,
    verb: [0.45, 0.1, 0.2, 0.35],
    echo: [0, 0, 0, 0.2],
    prog: [
      [0, 3, 0, 3],
      [0, 6, 3, 0],
      [0, 4, 6, 3],
      [0, 3, 6, 4],
      [2, 3, 0, 0],
    ],
  },
];
// Bass eighths: degree offsets from the chord root, 'o' = octave up.
const BASS = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 'o', 0, 0, 0, 'o', 0],
  [0, 0, 0, 0, 0, 0, 4, 'o'],
  [0, 'o', 0, 0, 'o', 0, 0, 4],
];
const TOMS = [7, 5, 3, 0];
export function bar(i, d, { seed = 1 } = {}) {
  const c = districts[d],
    m = c.mode,
    ph = phrase(i),
    r = rngFor(seed, ID, d, i),
    pr = rngFor(seed, ID, d, 'ph', ph.p),
    P = progAt(c.prog, seed, ID, d, ph.p),
    [ev, E] = events();
  const per = c.fast ? 1 : 2,
    ci = Math.floor(ph.pos / per) % 4,
    root = P[ci],
    next = ph.last ? progAt(c.prog, seed, ID, d, ph.p + 1)[0] : P[(ci + 1) % 4];
  const bassPat = pick(pr, BASS),
    shape = pick(pr, ['up', 'updown', 'pinky', 'down']),
    leadKind = Math.floor(pr() * 6),
    sec = ph.section,
    brk = sec === 'C';
  // L0 bed: pad chord on every chord change (+ low root on wide Horizon chords), occasional high bell shimmer.
  if (ph.pos % per === 0) {
    for (const n of near(chord(m, root, 4, 3, c.wide ? [1] : []), c.wide ? 64 : 60))
      E(0, per * 4 - 0.05, n, 'pad', 0, hum(r, 0.8, 0.08), {
        cut: c.pad * (brk ? 0.7 : 1),
        a: 0.4,
        r: 1.4,
      });
    if (c.wide) E(0, per * 4 - 0.05, deg(m, root, 2), 'pad', 0, 0.5, { cut: 600, a: 0.5, r: 1.2 });
  }
  if (r() < 0.3)
    E(1 + Math.floor(r() * 3), 2, deg(m, root + 4 + 2 * Math.floor(r() * 2), 6), 'bell', 0, 0.22, {
      dec: 2.4,
      index: 1.4,
    });
  // L1 pulse: eighth-note bass (quarters in the Docks), approach note into the next phrase, soft off-beat shaker.
  if (!brk || ph.pos >= 6) {
    const step = c.kit === 'half' ? 1 : 0.5;
    for (let k = 0; k * step < 4; k++) {
      const x = bassPat[(k * step * 2) % 8];
      let n = x === 'o' ? deg(m, root, 3) : deg(m, root + x, 2);
      if (ph.last && k * step >= 3.5) n = deg(m, next + 1, 2);
      E(k * step, step * 0.85, n, 'bass', 1, hum(r, k % 2 ? 0.6 : 0.85), {
        cut: m === 'aeolian' ? 500 : 750,
      });
    }
  }
  for (const b of [0.5, 1.5, 2.5, 3.5]) E(b, 0.1, null, 'shaker', 1, hum(r, 0.35, 0.2));
  // L2 groove: kit per district; breakdown keeps only hats and a build-up roll.
  if (brk) {
    for (let k = 0; k < 8; k++) if (r() < 0.6) E(k * 0.5, 0.1, null, 'hat', 2, 0.35);
    if (ph.last) for (let k = 0; k < 8; k++) E(2 + k * 0.25, 0.1, null, 'snare', 2, 0.2 + k * 0.08);
  } else if (c.kit === 'light') {
    E(1, 0.1, null, 'rim', 2, 0.6);
    E(3, 0.1, null, 'rim', 2, 0.65);
    for (let k = 0; k < 16; k++) E(k * 0.25, 0.1, null, 'shaker', 2, k % 2 ? 0.25 : 0.45);
    if (sec === 'B' || sec === 'D') E(0, 0.2, null, 'felt', 2, 0.7);
    if (ph.last)
      for (const [k, b] of [3, 3.33, 3.66].entries()) E(b, 0.1, null, 'rim', 2, 0.4 + k * 0.15);
  } else {
    const kick =
      c.kit === 'full'
        ? [0, 1, 2, 3]
        : c.kit === 'half'
          ? [0, r() < 0.4 ? 2.5 : null]
          : [0, 2, r() < 0.35 ? 1.75 : null, r() < 0.3 ? 2.5 : null];
    for (const b of kick) if (b !== null) E(b, 0.2, null, 'kick', 2, b % 1 ? 0.6 : 0.95);
    for (const b of c.kit === 'half' ? [2] : [1, 3])
      E(b, 0.3, null, 'snare', 2, 0.85, { gate: true });
    if (c.kit === 'full' || sec === 'D') for (const b of [1, 3]) E(b, 0.1, null, 'clap', 2, 0.5);
    const hs = c.kit === 'full' ? 0.25 : 0.5;
    for (let k = 0; k * hs < 4; k++) {
      const b = k * hs;
      if (ph.last && b >= 3) break;
      E(
        b,
        0.1,
        null,
        'hat',
        2,
        hum(r, b % 1 === 0.5 ? 0.65 : 0.4),
        c.kit === 'full' && b % 1 === 0.5 && sec === 'D' ? { open: true } : undefined,
      );
    }
    if (ph.last)
      TOMS.forEach((t, k) => E(3 + k * 0.25, 0.2, deg(m, t, 2), 'tom', 2, 0.6 + k * 0.1));
    if (ph.first && ph.p > 0) E(0, 2, null, 'crash', 2, 0.6);
  }
  // L3 lead: arpeggio over the chord; leitmotif lead in B/D sections (bell doubling in D).
  for (const a of arpBar(near(chord(m, root, 4, 4), 69), { rate: brk ? 0.5 : c.arp, shape }))
    E(a.b, c.arp * 0.9, a.n, 'pluck', 3, hum(r, a.k % 4 === 0 ? 0.75 : 0.5), {
      cut: 3800,
      dec: 0.09,
    });
  if (sec === 'B' || sec === 'D') {
    const motif = ARC[d].motif,
      rh = ARC[d].rhythm;
    if (ph.pos % 2 === 0 || r() < 0.6)
      for (const n of motifBar(r, motif, rh, m, {
        oct: 5,
        root,
        kind: ph.pos % 2 ? undefined : leadKind,
      })) {
        E(n.b, n.d, n.n, 'lead', 3, 0.7);
        if (sec === 'D') E(n.b, n.d, n.n + 12, 'bell', 3, 0.25, { dec: 1.2 });
      }
  }
  return ev;
}
export default {
  id: ID,
  name: 'Neon Glide',
  style: 'synthwave / chillwave',
  quality: 'full',
  districts,
  bar,
};
