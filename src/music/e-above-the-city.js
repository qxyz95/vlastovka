// E · Above the City: generative ambient with adaptive layers. Pads, piano on independent Eno-style cycles, bells, choir, wind and city noise.
// Nothing loops: chords follow a seeded chain every 2 bars, piano voices run on incommensurate cycles, speed raises note density.
import { ARC, rngFor, pick } from '../audio-mix.js';
import { deg, chord, near, motifBar, hum, events } from './compose.js';
const ID = 'E';
export const districts = [
  {
    name: 'Violet Suburbs',
    bpm: 66,
    mode: 'lydian',
    pool: [0, 0, 1, 4, 5, 2],
    keys: 'piano',
    verb: [0.9, 0.6, 0.3, 0.8],
    echo: [0, 0.12, 0, 0.3],
  },
  {
    name: 'Moon Docks',
    bpm: 60,
    mode: 'aeolian',
    pool: [0, 5, 2, 6, 3, 0],
    keys: 'epiano',
    choir: true,
    verb: [1, 0.7, 0.3, 0.9],
    echo: [0.1, 0.25, 0, 0.35],
  },
  {
    name: 'Red Horizon',
    bpm: 70,
    mode: 'mixolydian',
    pool: [0, 6, 3, 0, 4, 5],
    keys: 'piano',
    glock: true,
    verb: [0.8, 0.5, 0.3, 0.7],
    echo: [0, 0.1, 0, 0.3],
  },
  {
    name: 'Neon Core',
    bpm: 76,
    mode: 'dorian',
    pool: [0, 3, 6, 0, 4, 2],
    keys: 'epiano',
    pulse: true,
    verb: [0.7, 0.4, 0.25, 0.6],
    echo: [0, 0.2, 0.1, 0.3],
  },
];
// Piano cycles in beats [period, offset]: they drift against each other and against the 2-bar chords.
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
export function bar(i, d, { seed = 1, density = 0.5 } = {}) {
  const c = districts[d],
    m = c.mode,
    r = rngFor(seed, ID, d, i),
    k = Math.floor(i / 2),
    root = chordAt(c, seed, d, k),
    first = i % 2 === 0,
    [ev, E] = events();
  // L0 bed: slow pad (add9) every chord, choir in the Docks, wind/city noise every 4 bars with overlap.
  if (first) {
    for (const n of near(chord(m, root, 3, 3, [1]), 62))
      E(0, 8.3, n, 'pad', 0, 0.7, { cut: 1100, a: 2.2, r: 3 });
    if (c.choir) E(0.5, 7.5, deg(m, root + 4, 4), 'choir', 0, 0.6, { vowel: 'o', a: 2, r: 2.5 });
  }
  if (i % 4 === 0) E(0, 18, null, 'air', 0, 0.8, { seed: i + d * 1000 });
  // L1 pulse: low sine root on the chord, piano cycles, extra notes with speed (density).
  if (first) E(0, 7.5, deg(m, root, 2), 'sub', 1, 0.45, { a: 0.8, r: 1.5 });
  for (const [P, off] of LOOPS)
    for (let q = Math.max(0, Math.ceil((i * 4 - off) / P)); off + q * P < i * 4 + 4; q++) {
      const at = off + q * P - i * 4,
        rr = rngFor(seed, ID, d, 'loop', P, q);
      if (rr() < 0.25) continue;
      E(
        at,
        3,
        deg(m, root + pick(rr, [0, 2, 4, 1, 4, 6]), rr() < 0.5 ? 4 : 5),
        c.keys,
        1,
        0.32 + 0.28 * rr(),
      );
    }
  for (let s = 0; s < 8; s++)
    if (r() < density * 0.18)
      E(s * 0.5, 1, deg(m, root + pick(r, [0, 2, 4, 7]), 5), c.keys, 1, 0.22);
  // L2 groove: a soft heartbeat (felt kick), brushed shaker, muted pulse in the Core.
  E(0, 0.3, null, 'felt', 2, 0.7);
  if (density > 0.4 || c.pulse) E(2, 0.3, null, 'felt', 2, 0.5);
  for (let s = 0; s < 8; s++)
    if (r() < 0.7) E(s * 0.5, 0.1, null, 'shaker', 2, s % 2 ? 0.22 : 0.32);
  if (c.pulse)
    for (let s = 0; s < 8; s++)
      E(s * 0.5, 0.4, deg(m, root, 3), 'pluck', 2, s % 2 ? 0.35 : 0.5, {
        cut: 900,
        floor: 300,
        dec: 0.05,
      });
  // L3 lead: bell leitmotif with loose timing every other bar, scattered glock or bell sparkles between.
  if (first)
    for (const n of motifBar(r, ARC[d].motif, ARC[d].rhythm, m, { oct: 5, root: root % 3 }))
      E(Math.max(0, n.b + (r() - 0.5) * 0.1), n.d + 1, n.n, 'bell', 3, hum(r, 0.5), {
        dec: 3,
        index: 1.6,
      });
  else
    for (let s = 0, n = 2 + Math.floor(r() * 2); s < n; s++)
      E(
        Math.floor(r() * 8) / 2,
        1.5,
        deg(m, root + pick(r, [0, 2, 4, 6]), 6),
        c.glock ? 'glock' : 'bell',
        3,
        0.3,
        { dec: 2 },
      );
  return ev;
}
export default {
  id: ID,
  name: 'Above the City',
  style: 'generative ambient',
  quality: 'full',
  districts,
  bar,
};
