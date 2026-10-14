// Composition helpers shared by the music directions: pure and deterministic (seeded), Node-testable.
// A bar generator returns events {b beat in bar, d beats, n MIDI or null, i voice, l layer 0–3, v velocity, o options}.
import { KEY, scaleNote, rngFor } from '../audio-mix.js';
export const deg = (mode, d, oct = 4) => scaleNote(KEY, mode, d, oct);
// Diatonic chord on a degree (stacked thirds) plus added degrees (1 = 9th), all inside the mode.
export const chord = (mode, root, size = 3, oct = 3, add = []) =>
  [...Array(size).keys()]
    .map(k => deg(mode, root + 2 * k, oct))
    .concat(add.map(a => deg(mode, root + a, oct)));
// Close voicing: every note folded into a 12-semitone window around `c`.
export const near = (ns, c) =>
  [
    ...new Set(
      ns.map(n => {
        while (n < c - 6) n += 12;
        while (n >= c + 6) n -= 12;
        return n;
      }),
    ),
  ].sort((a, b) => a - b);
// Phrases of 8 bars; the form cycles and every cycle reseeds, so material never loops exactly.
export const FORM = ['A', 'B', 'A', 'C', 'B', 'D'];
export function phrase(bar, len = 8, form = FORM) {
  const p = Math.floor(bar / len),
    pos = bar - p * len;
  return {
    p,
    pos,
    section: form[p % form.length],
    cycle: Math.floor(p / form.length),
    first: pos === 0,
    last: pos === len - 1,
  };
}
// Progression for phrase p; differs from the previous phrase's pick.
export function progAt(pool, seed, id, d, p) {
  const at = q => Math.floor(rngFor(seed, id, d, 'prog', q)() * pool.length),
    i = at(p);
  return pool[p > 0 && i === at(p - 1) ? (i + 1) % pool.length : i];
}
// One bar of the leitmotif, varied: 0 plain, 1 moved to the chord, 2 inverted, 3 retrograde, 4 fragment + answer, 5 ornamented.
export function motifBar(r, motif, rhythm, mode, { oct = 5, root = 0, kind } = {}) {
  const k = kind ?? Math.floor(r() * 6);
  let ds = [...motif],
    rh = [...rhythm];
  if (k === 1) ds = ds.map(x => x + root);
  if (k === 2) ds = ds.map(x => 2 * ds[0] - x);
  if (k === 3) {
    ds.reverse();
    rh.reverse();
  }
  if (k === 4) {
    ds = [...ds.slice(0, 3), ...ds.slice(0, 2).map(x => x + 2)];
    rh = [1, 1, 2, 1, 3];
  }
  const out = [];
  let pos = 0;
  ds.forEach((x, i) => {
    const len = rh[i % rh.length];
    if (k === 5 && len >= 2 && r() < 0.6) {
      out.push(
        { b: pos / 2, d: 0.22, n: deg(mode, x + 1, oct) },
        { b: pos / 2 + 0.25, d: len / 2 - 0.3, n: deg(mode, x, oct) },
      );
    } else out.push({ b: pos / 2, d: (len / 2) * 0.92, n: deg(mode, x, oct) });
    pos += len;
  });
  if (out.length > 3 && r() < 0.25) out.pop();
  return out;
}
export function arpBar(notes, { rate = 0.5, shape = 'up', beats = 4 } = {}) {
  const s = notes,
    seq =
      shape === 'down'
        ? [...s].reverse()
        : shape === 'updown'
          ? [...s, ...s.slice(1, -1).reverse()]
          : shape === 'pinky'
            ? s.slice(1).flatMap(n => [s[0], n])
            : s,
    out = [];
  for (let i = 0; i * rate < beats - 1e-9; i++)
    out.push({ b: i * rate, n: seq[i % seq.length], k: i });
  return out;
}
// Swing: the off-beat of each grid cell (1 = swung eighths, .5 = swung sixteenths) moves to `amt` of the cell.
export function swing(b, amt = 0.6, grid = 1) {
  const c = Math.floor(b / grid + 1e-9),
    f = b - c * grid;
  return Math.abs(f - grid / 2) < 1e-6 ? c * grid + grid * amt : b;
}
export const hum = (r, v, a = 0.12) => v * (1 - a + 2 * a * r());
// [events, add(b,d,n,voice,layer,velocity,options)]
export const events = () => {
  const ev = [];
  return [
    ev,
    (b, d, n, i, l, v, o) => {
      ev.push(o ? { b, d, n, i, l, v, o } : { b, d, n, i, l, v });
    },
  ];
};
