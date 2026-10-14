// Frame-time statistics for the preview's ?perf=1 overlay. Pure, so it is unit-tested.
export function frameStats(samples) {
  const n = samples.length;
  if (!n) return { n: 0, avg: 0, p95: 0 };
  const s = [...samples].sort((a, b) => a - b);
  return { n, avg: s.reduce((a, b) => a + b, 0) / n, p95: s[Math.max(0, Math.ceil(n * 0.95) - 1)] };
}
// Fixed-size ring of the latest samples (old ones fall out, so a theme switch settles within one window).
export function ring(size = 240) {
  const a = [];
  return {
    push(v) {
      a.push(v);
      if (a.length > size) a.shift();
    },
    clear() {
      a.length = 0;
    },
    get values() {
      return a;
    },
  };
}
