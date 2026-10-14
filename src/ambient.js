// Ambient life that does not belong to one place: stars, shooting stars, the flock and rain.
// Purely visual; values come from atmosphereAt() so they blend between districts.
import { atmosphereAt, districtAt } from './scenes.js';
import { theme } from './themes.js';
import { wind, drift } from './motion.js';
const noise = n => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const ink = color => {
  const t = theme();
  return t.mode === 'line' ? t.ink(color) : color;
};
// Behind the far city: twinkling stars, a shooting star every 9 s, a passing V-flock.
export function drawSkyLife(c, distance, time) {
  const t = theme(),
    fx = t.fx,
    d = districtAt(distance),
    night = t.night[d.index] * (1 - d.blend) + t.night[d.next] * d.blend;
  c.save();
  if (night > 0) {
    c.fillStyle = fx.star;
    for (let i = 0; i < 26; i++) {
      const a = 0.5 + 0.5 * Math.sin(time * (1.2 + noise(i) * 2.5) + i * 7);
      if (a < 0.2) continue;
      c.globalAlpha = a * night;
      const s = a > 0.92 ? 3 : 2;
      c.fillRect(Math.round(noise(i * 5) * 640), Math.round(12 + noise(i * 11) * 140), s, s);
    }
    const k = (time % 9) / 1.1;
    if (k < 1) {
      const x = 560 - k * 300,
        y = 26 + k * 80;
      c.globalAlpha = night * Math.sin(k * Math.PI);
      c.strokeStyle = fx.star;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 46, y - 12);
      c.stroke();
      c.fillRect(Math.round(x - 1), Math.round(y - 1), 3, 3);
    }
  }
  const flock = atmosphereAt(distance, time).flock;
  if (flock) {
    c.globalAlpha = flock.alpha;
    c.strokeStyle = ink(fx.bird);
    c.lineWidth = 1.6;
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      const x = flock.x + i * 15,
        y = flock.y + Math.abs(i - 2) * 7,
        w = Math.sin(time * 11 + i * 1.3) * 3;
      c.moveTo(x - 5, y - 2 - w);
      c.lineTo(x, y);
      c.lineTo(x + 5, y - 2 - w);
    }
    c.stroke();
  }
  c.restore();
}
// In front of the city, behind the plane: rain slanted and carried by the shared wind.
export function drawRain(c, distance, time) {
  const rain = atmosphereAt(distance, time).rain;
  if (rain < 0.05) return;
  c.save();
  c.strokeStyle = ink(theme().fx.rain);
  c.lineWidth = 1;
  c.globalAlpha = 0.25 + 0.35 * rain;
  c.beginPath();
  const w = wind(time),
    dx = drift(time) * 60;
  for (let i = 0, n = Math.round(90 * rain); i < n; i++) {
    const x = ((((noise(i) * 720 + dx) % 720) + 720) % 720) - 40,
      y = ((noise(i * 3) * 400 + time * (420 + noise(i * 7) * 120)) % 400) - 20;
    c.moveTo(x, y);
    c.lineTo(x + w * 5, y + 12);
  }
  c.stroke();
  c.restore();
}
