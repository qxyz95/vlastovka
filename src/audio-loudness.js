// Loudness by ITU-R BS.1770-5 (EBU Tech 3341 "EBU Mode"): K-weighting, 400 ms blocks with 75 % overlap,
// absolute gate −70 LUFS, relative gate −10 LU. Pure (no Web Audio): channels are Float32Arrays, L/R weight 1.
// Biquad of the K-filter: stage 1 high shelf (head), stage 2 high pass (RLB). Analog prototype fitted to the
// 48 kHz coefficients of BS.1770-5 Tables 1–2 (tests check the match), so any sample rate gets the same response.
export function kFilter(rate) {
  let K = Math.tan((Math.PI * 1681.974450955533) / rate);
  const Q1 = 0.7071752369554196,
    Vh = 10 ** (3.999843853973347 / 20),
    Vb = Vh ** 0.4996667741545416,
    a0 = 1 + K / Q1 + K * K,
    shelf = {
      b: [
        (Vh + (Vb * K) / Q1 + K * K) / a0,
        (2 * (K * K - Vh)) / a0,
        (Vh - (Vb * K) / Q1 + K * K) / a0,
      ],
      a: [1, (2 * (K * K - 1)) / a0, (1 - K / Q1 + K * K) / a0],
    };
  K = Math.tan((Math.PI * 38.13547087602444) / rate);
  const Q2 = 0.5003270373238773,
    h0 = 1 + K / Q2 + K * K;
  return [shelf, { b: [1, -2, 1], a: [1, (2 * (K * K - 1)) / h0, (1 - K / Q2 + K * K) / h0] }];
}
function biquad(x, { b, a }) {
  const y = new Float64Array(x.length);
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    x2 = x1;
    x1 = x[i];
    y2 = y1;
    y1 = y[i] = v;
  }
  return y;
}
const toLufs = z => (z > 0 ? -0.691 + 10 * Math.log10(z) : -Infinity);
// Mean square of 400 ms blocks every 100 ms (summed over channels), K-weighted; incomplete blocks at the end are dropped.
export function blockPowers(channels, rate) {
  const seg = Math.round(rate * 0.1),
    n = Math.floor(channels[0].length / seg),
    sums = new Float64Array(n),
    [s1, s2] = kFilter(rate);
  for (const ch of channels) {
    const y = biquad(biquad(ch, s1), s2);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = j * seg; i < (j + 1) * seg; i++) s += y[i] * y[i];
      sums[j] += s;
    }
  }
  const out = new Float64Array(Math.max(0, n - 3));
  for (let j = 0; j < out.length; j++)
    out[j] = (sums[j] + sums[j + 1] + sums[j + 2] + sums[j + 3]) / (4 * seg);
  return out;
}
// Integrated (gated) loudness in LUFS; −Infinity for silence or less than 400 ms.
export function lufs(channels, rate) {
  const z = blockPowers(channels, rate),
    mean = a => a.reduce((s, x) => s + x, 0) / a.length,
    abs = [...z].filter(x => toLufs(x) > -70);
  if (!abs.length) return -Infinity;
  const rel = toLufs(mean(abs)) - 10,
    gated = abs.filter(x => toLufs(x) > rel);
  return toLufs(mean(gated));
}
// Momentary loudness (400 ms, ungated) of every block; block j starts at j × 100 ms.
export const momentary = (channels, rate) => Array.from(blockPowers(channels, rate), toLufs);
// Momentary loudness of the block centred nearest to time t (s); `m` = a precomputed momentary() series.
export function momentaryAt(channels, rate, t, m = momentary(channels, rate)) {
  return m[Math.max(0, Math.min(m.length - 1, Math.round((t - 0.2) / 0.1)))] ?? -Infinity;
}
// Highest absolute sample in dBFS.
export function samplePeak(channels) {
  let p = 0;
  for (const ch of channels) for (const x of ch) p = Math.max(p, Math.abs(x));
  return p > 0 ? 20 * Math.log10(p) : -Infinity;
}
