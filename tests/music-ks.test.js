import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ksSamples } from '../src/music/ks.js';

const rms = (a, from, to) => {
  let s = 0;
  for (let i = from; i < to; i++) s += a[i] * a[i];
  return Math.sqrt(s / (to - from));
};
// Lag with the highest normalised autocorrelation in [lo, hi].
function period(a, from, len, lo, hi) {
  let best = 0,
    lag = 0;
  for (let L = lo; L <= hi; L++) {
    let s = 0,
      e1 = 0,
      e2 = 0;
    for (let i = from; i < from + len; i++) {
      s += a[i] * a[i + L];
      e1 += a[i] * a[i];
      e2 += a[i + L] * a[i + L];
    }
    const c = s / Math.sqrt(e1 * e2 || 1);
    if (c > best) [best, lag] = [c, L];
  }
  return lag;
}

test('K-1 Karplus–Strong: deterministic, period rate/freq ± 2 %, decays (last 100 ms < first 100 ms / 4)', () => {
  const a = ksSamples(220, 48000, 1, 7),
    b = ksSamples(220, 48000, 1, 7);
  assert.equal(a.length, 48000);
  assert.deepEqual(a, b, 'same seed → same samples');
  assert.notDeepEqual(ksSamples(220, 48000, 1, 8), a, 'other seed → other burst');
  const p = period(a, 4800, 4800, 150, 300),
    want = 48000 / 220;
  assert.ok(Math.abs(p - want) / want <= 0.02, `period ${p} vs ${want.toFixed(1)}`);
  const first = rms(a, 0, 4800),
    last = rms(a, a.length - 4800, a.length);
  assert.ok(last < first / 4, `rms ${first.toFixed(3)} → ${last.toFixed(4)}`);
  for (const x of a) assert.ok(Number.isFinite(x) && Math.abs(x) <= 1);
  // Fractional tuning keeps high notes in tune too (D6 at 24 kHz: 20.4 samples per period).
  const hi = ksSamples(1174.66, 24000, 0.5, 1),
    ph = period(hi, 1200, 2400, 15, 30);
  assert.ok(Math.abs(ph - 24000 / 1174.66) <= 1, `high period ${ph}`);
});
