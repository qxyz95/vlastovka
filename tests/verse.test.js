import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  onTwos,
  dotRadius,
  dotSpacing,
  halftoneDots,
  skyBands,
  shadeTone,
  speedLines,
  VERSE,
  SKY_EDGES,
  INK,
  verse,
} from '../src/themes-verse.js';
import { THEME_IDS, THEMES, setTheme, theme, pickTheme, paint } from '../src/themes.js';
import { frameStats, ring } from '../src/perf.js';
const lum = h => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  return 0.3 * r + 0.59 * g + 0.11 * b;
};

test('on twos: environment animation holds each drawing for 1/12 s', () => {
  assert.equal(onTwos(0), 0);
  assert.equal(onTwos(1 / 12 - 1e-6), 0);
  assert.equal(onTwos(1 / 12), 1 / 12);
  assert.equal(onTwos(1.0), 1);
  const held = new Set(Array.from({ length: 60 }, (_, i) => onTwos(i / 60)));
  assert.equal(held.size, 12, '60 fps frames → 12 drawings per second');
  assert.equal(verse.frame(0.49), onTwos(0.49));
});
test('halftone: spacing ≥ 4 logical px, radius grows with coverage and dots never touch', () => {
  assert.ok(dotSpacing() >= 4);
  const r = [0.1, 0.25, 0.4, 0.6, 0.9].map(k => dotRadius(k));
  for (let i = 1; i < r.length; i++) assert.ok(r[i] >= r[i - 1]);
  assert.ok(r.at(-1) < dotSpacing() / 2, 'capped below touching');
  assert.equal(dotRadius(0), 0);
  assert.equal(dotRadius(-1), 0);
  const dots = halftoneDots(0.3);
  assert.equal(dots.length, 5);
  for (const [x, y] of dots) {
    assert.ok(x >= 0 && x <= 6 && y >= 0 && y <= 6);
  }
  // Coverage of the tile matches the request (2 whole dots per tile).
  const [, , rr] = dots[0];
  assert.ok(Math.abs((2 * Math.PI * rr * rr) / 36 - 0.3) < 1e-9);
});
test('posterized sky: 4 flat bands top → horizon, halftone strips between them with rising coverage', () => {
  for (const v of VERSE) {
    const bands = skyBands(v.sky, SKY_EDGES),
      flat = bands.filter(b => !b.dot),
      dots = bands.filter(b => b.dot);
    assert.equal(flat.length, 4);
    assert.equal(dots.length, 9);
    assert.equal(flat[0].y, 0);
    assert.equal(flat.at(-1).y + flat.at(-1).h, 360);
    for (let i = 0; i < 3; i++) {
      const strip = dots.slice(i * 3, i * 3 + 3);
      assert.deepEqual(
        strip.map(b => b.dot),
        Array(3).fill(v.sky[i + 1]),
      );
      assert.ok(strip[0].k < strip[1].k && strip[1].k < strip[2].k);
      assert.equal(strip[2].y + strip[2].h, SKY_EDGES[i + 1]);
    }
  }
});
test('palette: four districts, valid colours, one hard shadow tone darker than the body', () => {
  const hex = /^#[0-9a-f]{6}$/;
  assert.equal(VERSE.length, 4);
  for (const v of VERSE) {
    for (const c of [...v.sky, ...v.biome, v.far, v.ground, v.sun]) assert.match(c, hex);
    assert.ok(lum(shadeTone(v.biome[1])) < lum(v.biome[1]));
  }
  assert.equal(verse.biomes.length, 4);
  assert.equal(verse.ground.length, 4);
  assert.equal(verse.plane.crease.length, 2);
  assert.equal(verse.kid.length, 4);
  assert.equal(verse.mode, 'ink');
  assert.equal(verse.line, INK);
  assert.ok(
    verse.misregister.every(([dx, dy]) => Math.hypot(dx, dy) <= 1.2),
    '≤ ~2 screen px at 2×',
  );
});
test('speed lines: none when slow, more and longer when fast, stable within one drawing', () => {
  assert.deepEqual(speedLines(15, 1), []);
  const mid = speedLines(80, 1),
    fast = speedLines(150, 1);
  assert.ok(fast.length > mid.length && mid.length > 0);
  const avg = a => a.reduce((s, l) => s + l[2], 0) / a.length;
  assert.ok(avg(fast) > avg(mid));
  assert.deepEqual(speedLines(150, onTwos(1.01)), speedLines(150, onTwos(1.07)));
  for (const [, y] of fast) assert.ok(y >= 0 && y <= 360);
});
test('verse stays out of the game: not in THEMES, ?styl=verse falls back, object themes work only via setTheme', () => {
  assert.deepEqual(THEME_IDS, ['cyber', 'paper', 'blueprint', 'dusk']);
  assert.ok(!('verse' in THEMES));
  assert.equal(pickTheme('verse', null), 'cyber');
  assert.equal(setTheme('verse').id, 'cyber');
  assert.equal(setTheme(verse).id, 'verse');
  assert.equal(theme(), verse);
  setTheme('cyber');
});
test('ink brush: fill plus outline in screen px; tiny shapes stay flat; other modes unchanged', () => {
  const mock = () => {
    const calls = [],
      c = new Proxy(
        { getTransform: () => ({ a: 2 }) },
        {
          get: (o, k) => (k in o ? o[k] : (...a) => calls.push(k)),
          set: (o, k, v) => (calls.push(k + '=' + v), (o[k] = v), true),
        },
      );
    return { c, calls };
  };
  setTheme(verse);
  let { c, calls } = mock();
  paint(c, '#ff0000', () => {}, 1000);
  assert.ok(calls.includes('fill') && calls.includes('stroke'));
  assert.equal(c.lineWidth, verse.lineWidth / 2);
  ({ c, calls } = mock());
  paint(c, '#ff0000', () => {}, 10);
  assert.ok(!calls.includes('stroke'));
  setTheme('dusk');
  ({ c, calls } = mock());
  paint(c, '#ff0000', () => {}, 1000);
  assert.ok(!calls.includes('stroke'));
  setTheme('cyber');
});
test('perf stats: average and nearest-rank P95; ring keeps the latest samples', () => {
  assert.deepEqual(frameStats([]), { n: 0, avg: 0, p95: 0 });
  const s = frameStats(Array.from({ length: 100 }, (_, i) => i + 1));
  assert.equal(s.avg, 50.5);
  assert.equal(s.p95, 95);
  const r = ring(3);
  [1, 2, 3, 4].forEach(v => r.push(v));
  assert.deepEqual(r.values, [2, 3, 4]);
  r.clear();
  assert.equal(r.values.length, 0);
});
