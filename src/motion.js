// Motion toolkit, pure and dependency-free: Penner easings, frame-rate independent damping,
// springs (D. Holden, "Spring-It-On"), 1D gradient noise and one shared wind signal.
export const clamp01 = t => Math.max(0, Math.min(1, t));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = {
  linear: t => t,
  inQuad: t => t * t,
  outQuad: t => 1 - (1 - t) * (1 - t),
  inOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  outCubic: t => 1 - (1 - t) ** 3,
  inOutCubic: t => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
  outBack: t => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
  outElastic: t =>
    t <= 0 ? 0 : t >= 1 ? 1 : 2 ** (-10 * t) * Math.sin(((t * 10 - 0.75) * 2 * Math.PI) / 3) + 1,
  outBounce: t => {
    const n = 7.5625,
      d = 2.75;
    return t < 1 / d
      ? n * t * t
      : t < 2 / d
        ? n * (t -= 1.5 / d) * t + 0.75
        : t < 2.5 / d
          ? n * (t -= 2.25 / d) * t + 0.9375
          : n * (t -= 2.625 / d) * t + 0.984375;
  },
};
export const tween = (from, to, t, fn = ease.outCubic) => from + (to - from) * fn(clamp01(t));
// Move x towards goal so that half the distance is covered every `halflife` seconds, at any frame rate.
export function damp(x, goal, halflife, dt) {
  return halflife <= 0 ? goal : goal + (x - goal) * Math.exp((-Math.LN2 * dt) / halflife);
}
// Critically damped spring: no overshoot, settles in a few half-lives. s={x,v} is updated in place.
export function spring(s, goal, halflife, dt) {
  const y = (2 * Math.LN2) / Math.max(1e-5, halflife),
    j0 = s.x - goal,
    j1 = s.v + j0 * y,
    e = Math.exp(-y * dt);
  s.x = e * (j0 + j1 * dt) + goal;
  s.v = e * (s.v - j1 * y * dt);
  return s;
}
// Under-damped spring for wobble (squash & stretch). Sub-stepped so it stays stable on slow frames.
export function wobble(s, goal, stiffness, damping, dt) {
  for (let left = Math.min(dt, 0.1); left > 1e-9; left -= 1 / 240) {
    const h = Math.min(left, 1 / 240);
    s.v += (-stiffness * (s.x - goal) - damping * s.v) * h;
    s.x += s.v * h;
  }
  return s;
}
const hash = n => {
  let x = Math.imul(n | 0, 0x27d4eb2d) ^ 0x165667b1;
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
};
// 1D gradient noise in about [-1,1]; smooth (quintic fade), deterministic for (x, seed).
export function noise1(x, seed = 0) {
  const i = Math.floor(x),
    f = x - i,
    g0 = hash(i * 7919 + seed * 104729) * 2 - 1,
    g1 = hash((i + 1) * 7919 + seed * 104729) * 2 - 1,
    u = f * f * f * (f * (f * 6 - 15) + 10);
  return 2 * lerp(g0 * f, g1 * (f - 1), u);
}
export function fbm(x, seed = 0, octaves = 3) {
  let sum = 0,
    amp = 1,
    norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise1(x * 2 ** o, seed + o * 31);
    norm += amp;
    amp *= 0.5;
  }
  return sum / norm;
}
// Shared wind. drift(t) is how far the air has moved (always increasing); wind(t) is its speed,
// about 1 on average, between ~0.3 (calm) and ~1.7 (gust). Everything that moves in the wind
// (clouds, smoke, rain, trees, flags, turbines) reads these, so gusts sweep the whole scene at once.
export const drift = t => t * 0.8 + 2.4 * fbm(t * 0.08, 5);
export const wind = t => (drift(t + 0.05) - drift(t - 0.05)) / 0.08;
// Lean of a plant/flag at world x: the gust arrives later further right, plus small flutter. About ±1.
export const sway = (t, x = 0) => wind(t - x / 300) - 1 + 0.3 * noise1(t * 1.6 + x * 0.07, 3);
