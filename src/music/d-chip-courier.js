// D · Chip Courier: chiptune / bitpop. Pulse and triangle waves, periodic noise drums, arpeggiated chords, lead with chip-style echo.
// Softened for long sessions: band-limited pulses, low-passed noise, 25 % / 12.5 % duty instead of harsh squares.
import { ARC, rngFor, pick } from '../audio-mix.js';
import { deg, chord, near, phrase, progAt, motifBar, arpBar, hum, events } from './compose.js';
const ID = 'D';
export const districts = [
  {
    name: 'Violet Suburbs',
    bpm: 118,
    mode: 'lydian',
    step: 0.045,
    verb: [0.25, 0.05, 0.1, 0.25],
    echo: [0, 0, 0, 0],
    prog: [
      [0, 1, 0, 4],
      [0, 2, 1, 4],
      [5, 1, 0, 0],
      [0, 1, 5, 4],
    ],
  },
  {
    name: 'Moon Docks',
    bpm: 108,
    mode: 'aeolian',
    step: 0.06,
    half: true,
    verb: [0.45, 0.1, 0.2, 0.4],
    echo: [0.15, 0, 0, 0.2],
    prog: [
      [0, 5, 2, 6],
      [0, 6, 5, 4],
      [0, 3, 6, 2],
      [5, 6, 0, 0],
    ],
  },
  {
    name: 'Red Horizon',
    bpm: 126,
    mode: 'mixolydian',
    step: 0.045,
    verb: [0.3, 0.05, 0.1, 0.3],
    echo: [0, 0, 0, 0.1],
    prog: [
      [0, 6, 3, 0],
      [0, 4, 6, 3],
      [3, 0, 6, 0],
      [0, 5, 6, 3],
    ],
  },
  {
    name: 'Neon Core',
    bpm: 134,
    mode: 'dorian',
    step: 0.035,
    fast: true,
    verb: [0.25, 0.05, 0.1, 0.25],
    echo: [0, 0, 0, 0.1],
    prog: [
      [0, 3, 0, 3],
      [0, 6, 3, 4],
      [0, 4, 6, 3],
      [0, 2, 3, 4],
    ],
  },
];
const TRI = [
  [0, 'o', 0, 'o', 0, 'o', 0, 'o'],
  [0, 0, 'o', 0, 4, 0, 'o', 0],
  [0, 'o', 4, 'o', 0, 'o', 4, 'o'],
  [0, 0, 0, 'o', 0, 0, 4, 4],
];
export function bar(i, d, { seed = 1 } = {}) {
  const c = districts[d],
    m = c.mode,
    ph = phrase(i),
    r = rngFor(seed, ID, d, i),
    pr = rngFor(seed, ID, d, 'ph', ph.p),
    [ev, E] = events();
  const P =
      ph.section === 'B' || ph.section === 'D'
        ? progAt(c.prog, seed, ID + 'b', d, ph.p)
        : progAt(c.prog, seed, ID, d, ph.p),
    root = P[ph.pos % 4],
    sec = ph.section,
    brk = sec === 'C';
  const triPat = pick(pr, TRI),
    leadKind = Math.floor(pr() * 6),
    shape = pick(pr, ['up', 'updown', 'pinky']);
  // L0 bed: one oscillator stepping through the chord (two per bar), thinner duty in the breakdown.
  const ch = near(chord(m, root, 3, 4, ph.pos % 2 ? [1] : []), 67);
  for (const b of [0, 2])
    E(b, 2, ch[0], 'chiparp', 0, 0.7, {
      notes: ch,
      step: c.step,
      duty: brk ? 0.125 : 0.5,
      cut: 3500,
    });
  // L1 pulse: octave-bouncing triangle bass, soft off-beat noise hat.
  if (!brk || ph.pos >= 4)
    for (let k = 0; k < 8; k++) {
      if (c.half && k % 2) continue;
      const x = triPat[k];
      E(
        k * 0.5,
        c.fast ? 0.3 : 0.42,
        x === 'o' ? deg(m, root, 3) : deg(m, root + x, 2),
        'tri',
        1,
        hum(r, k % 2 ? 0.7 : 0.9),
      );
    }
  for (const b of [0.5, 1.5, 2.5, 3.5])
    E(b, 0.05, null, 'cnoise', 1, 0.4, { rate: 2.5, dec: 0.012, metal: true, lvl: 0.06 });
  // L2 groove: triangle kick, noise snare and hats; 16th snare roll at the end of a phrase.
  if (!brk) {
    for (const b of c.half ? [0, 2.5] : [0, 2, ...(r() < 0.4 ? [1.5] : [])])
      E(b, 0.2, null, 'ckick', 2, 0.9);
    for (const b of c.half ? [2] : [1, 3])
      if (!(ph.last && b === 3)) E(b, 0.1, null, 'cnoise', 2, 0.9, { rate: 0.7, dec: 0.07 });
    const hs = c.fast ? 0.25 : 0.5;
    for (let k = 0; k * hs < 4; k++)
      if (!(ph.last && k * hs >= 3))
        E(k * hs, 0.05, null, 'cnoise', 2, hum(r, (k * hs) % 1 ? 0.5 : 0.35), {
          rate: 4,
          dec: 0.015,
          lvl: 0.08,
        });
    if (ph.last)
      for (let k = 0; k < 4; k++)
        E(3 + k * 0.25, 0.1, null, 'cnoise', 2, 0.6 + k * 0.1, { rate: 0.6 + k * 0.25, dec: 0.05 });
  } else if (ph.last)
    for (let k = 0; k < 8; k++)
      E(2 + k * 0.25, 0.1, null, 'cnoise', 2, 0.3 + k * 0.08, { rate: 0.8 + k * 0.15, dec: 0.04 });
  // L3 lead: leitmotif in pulse 25 % with vibrato, answered on odd bars, chip echo (dotted eighth, 12.5 %); counter-arpeggio in B/D.
  const motif = ARC[d].motif,
    rh = ARC[d].rhythm,
    lead =
      ph.pos % 2 === 0
        ? motifBar(r, motif, rh, m, { oct: 5, root, kind: leadKind })
        : r() < 0.5
          ? motifBar(r, motif, rh, m, { oct: 5, root, kind: (leadKind + 2) % 6 })
          : [{ b: 0, d: 3, n: deg(m, root + 4, 5) }];
  for (const n of lead) {
    E(n.b, n.d, n.n, 'pulse', 3, 0.75, { duty: 0.25, vib: 12, cut: 5000 });
    if (n.b + 0.75 < 3.9)
      E(n.b + 0.75, Math.min(n.d, 0.5), n.n, 'pulse', 3, 0.28, { duty: 0.125, cut: 3000 });
  }
  if (sec === 'B' || sec === 'D')
    for (const a of arpBar(near(chord(m, root, 3, 5), 76), { rate: 0.25, shape }))
      E(a.b, 0.2, a.n, 'pulse', 3, a.k % 4 ? 0.25 : 0.35, {
        duty: 0.125,
        dec: 0.05,
        sus: 0.2,
        cut: 4000,
      });
  return ev;
}
export default {
  id: ID,
  name: 'Chip Courier',
  style: 'chiptune / bitpop',
  quality: 'full',
  districts,
  bar,
};
