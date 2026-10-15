// Karplus–Strong plucked string computed in JS (no Web Audio): a DelayNode in a feedback loop cannot go below
// 128 samples, so the string is rendered once into a buffer and played back (research/hudba/03 B.2).
import { random } from '../random.js';
// freq Hz, rate samples/s, sec length, seed of the noise burst. t60: seconds to −60 dB, bright 0–1: burst low-pass.
export function ksSamples(
  freq,
  rate = 48000,
  sec = 1.5,
  seed = 1,
  { t60 = 1.1, bright = 0.55 } = {},
) {
  const n = Math.max(1, Math.floor(rate * sec)),
    y = new Float32Array(n),
    // Loop delay = N + ½ (averaging) + allpass fraction = one period; the fraction stays in [0.1, 1.1) for stability.
    D = rate / freq - 0.5,
    N = Math.max(2, Math.floor(D - 0.1)),
    frac = D - N,
    C = (1 - frac) / (1 + frac),
    rho = 10 ** (-3 / (t60 * freq)),
    r = random(seed),
    k = 0.15 + 0.85 * bright;
  let lp = 0,
    mean = 0;
  const burst = new Float32Array(N);
  for (let i = 0; i < N; i++) mean += burst[i] = lp += k * (2 * r() - 1 - lp);
  mean /= N;
  let v1 = 0,
    a1 = 0,
    peak = 0;
  for (let i = 0; i < n; i++) {
    const v = i >= N ? 0.5 * (y[i - N] + (i > N ? y[i - N - 1] : 0)) : 0,
      a = C * v + v1 - C * a1;
    v1 = v;
    a1 = a;
    y[i] = (i < N ? burst[i] - mean : 0) + rho * a;
    peak = Math.max(peak, Math.abs(y[i]));
  }
  const fade = Math.min(n, Math.floor(rate * 0.01)),
    g = peak > 0 ? 1 / peak : 0;
  for (let i = 0; i < n; i++) y[i] *= g * (i >= n - fade ? (n - i) / fade : 1);
  return y;
}
