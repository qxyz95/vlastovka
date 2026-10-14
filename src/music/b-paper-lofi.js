// B · Paper Lo-fi (sketch): lo-fi hip hop. Swung Rhodes 7th chords, vinyl crackle, upright bass, muted boom-bap; rain and sax in the Docks.
import { ARC, rngFor } from '../audio-mix.js';
import { deg, chord, near, phrase, progAt, motifBar, swing, hum, events } from './compose.js';
const ID = 'B',
  SW = 0.62;
export const districts = [
  {
    name: 'Violet Suburbs',
    bpm: 84,
    mode: 'lydian',
    lead: 'epiano',
    verb: [0.45, 0.15, 0.15, 0.4],
    echo: [0, 0, 0, 0.15],
    prog: [
      [0, 1, 5, 4],
      [0, 2, 1, 4],
      [5, 1, 0, 0],
    ],
  },
  {
    name: 'Moon Docks',
    bpm: 78,
    mode: 'aeolian',
    lead: 'sax',
    rain: true,
    verb: [0.55, 0.2, 0.2, 0.5],
    echo: [0, 0, 0, 0.25],
    prog: [
      [0, 3, 6, 2],
      [0, 5, 3, 4],
      [3, 4, 0, 0],
    ],
  },
  {
    name: 'Red Horizon',
    bpm: 86,
    mode: 'mixolydian',
    lead: 'pluck',
    verb: [0.45, 0.15, 0.15, 0.4],
    echo: [0, 0, 0, 0.2],
    prog: [
      [0, 6, 3, 0],
      [3, 4, 0, 5],
      [0, 5, 6, 3],
    ],
  },
  {
    name: 'Neon Core',
    bpm: 90,
    mode: 'dorian',
    lead: 'epiano',
    hard: true,
    verb: [0.4, 0.1, 0.15, 0.35],
    echo: [0, 0, 0, 0.15],
    prog: [
      [0, 3, 0, 3],
      [1, 4, 0, 0],
      [0, 6, 3, 4],
    ],
  },
];
export function bar(i, d, { seed = 1 } = {}) {
  const c = districts[d],
    m = c.mode,
    ph = phrase(i),
    r = rngFor(seed, ID, d, i),
    P = progAt(c.prog, seed, ID, d, ph.p),
    root = P[ph.pos % 4],
    next = P[(ph.pos + 1) % 4],
    sec = ph.section,
    [ev, E] = events();
  // L0: Rhodes 7th + 9th, laid-back comping; vinyl (and rain) beds every 4 bars.
  const ch = near(chord(m, root, 4, 3, [1]), 60);
  for (const n of ch) {
    E(0.03, 1.6, n, 'epiano', 0, hum(r, 0.55));
    E(swing(2.5, SW), 1.2, n, 'epiano', 0, hum(r, 0.42));
  }
  if (i % 4 === 0) {
    E(0, 16.5, null, 'vinyl', 0, 0.8);
    if (c.rain) E(0, 16.5, null, 'rain', 0, 0.8);
  }
  // L1: upright bass, root then fifth or walk into the next chord.
  E(0, 1.2, deg(m, root, 2), 'upright', 1, 0.85);
  E(swing(1.5, SW), 0.5, deg(m, root + 4, 2), 'upright', 1, 0.6);
  E(2, 1, deg(m, root + (r() < 0.5 ? 2 : 4), 2), 'upright', 1, 0.7);
  E(swing(3.5, SW), 0.4, deg(m, next - 1, 2), 'upright', 1, 0.55);
  // L2: muted boom-bap with swung hats; the Core adds ghost snares and a pickup kick.
  for (const b of [0, r() < 0.5 ? swing(1.5, SW) : 2.75])
    E(b, 0.2, null, 'kick', 2, 0.8, { f0: 110, dec: 0.08 });
  for (const b of [1, 3]) E(b, 0.2, null, 'snare', 2, 0.7, { tone: 1400, dec: 0.06 });
  for (let k = 0; k < 8; k++)
    E(swing(k * 0.5, SW), 0.1, null, 'hat', 2, hum(r, k % 2 ? 0.35 : 0.5));
  if (c.hard) {
    E(3.75, 0.2, null, 'kick', 2, 0.6, { f0: 110 });
    E(swing(2.5, SW), 0.1, null, 'snare', 2, 0.18, { tone: 1400 });
  }
  // L3: lead from the leitmotif (sax / Rhodes / pluck), swung, with rests.
  if (sec !== 'C' && (ph.pos % 2 === 0 || r() < 0.4))
    for (const n of motifBar(r, ARC[d].motif, ARC[d].rhythm, m, {
      oct: c.lead === 'sax' ? 4 : 5,
      root,
    }))
      E(
        swing(n.b, SW),
        n.d,
        n.n,
        c.lead,
        3,
        0.6,
        c.lead === 'pluck' ? { cut: 2500, dec: 0.12, wave: 'triangle' } : undefined,
      );
  return ev;
}
export default {
  id: ID,
  name: 'Paper Lo-fi',
  style: 'lo-fi hip hop / chillhop',
  quality: 'sketch',
  districts,
  bar,
};
