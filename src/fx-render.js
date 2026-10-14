// Draws the game-feel layer kept in juice.js: trail, particles, pop-up texts and the perfect flash.
import { theme, box } from './themes.js';
import { ease, clamp01 } from './motion.js';
import { FX, STRIDE } from './juice.js';
const FONTS = {
  cyber: 'monospace',
  paper: 'Georgia,serif',
  blueprint: 'monospace',
  dusk: '"Segoe UI",sans-serif',
};
// Ribbon through the last flight points: thin and transparent at the tail, full at the plane.
export function drawTrail(c, fx, cam, px, py) {
  const t = theme(),
    pts = fx.trail;
  if (pts.length < 2) return;
  c.save();
  c.lineCap = 'round';
  for (let i = 1; i < pts.length; i++) {
    const k = i / pts.length;
    c.globalAlpha = k * 0.55;
    c.strokeStyle = t.mode === 'line' ? t.ink(t.trail[0]) : t.trail[i % 4 < 2 ? 0 : 1];
    c.lineWidth = 1 + k * 3;
    c.beginPath();
    c.moveTo(pts[i - 1][0] - cam, pts[i - 1][1]);
    c.lineTo(
      i === pts.length - 1 ? px - 8 : pts[i][0] - cam,
      i === pts.length - 1 ? py : pts[i][1],
    );
    c.stroke();
  }
  c.restore();
}
export function drawParticles(c, fx, cam) {
  // Line themes outline particles only; box() would fill them with the paper colour and hide the scene behind.
  const t = theme(),
    dot = (color, x, y, r) => {
      if (t.mode === 'line') {
        c.strokeStyle = t.ink(color);
        c.lineWidth = 1;
        c.strokeRect(x, y, r, r);
      } else box(c, color, x, y, r, r);
    },
    colors = [t.fx.smoke, '#ffd166', t.plane.crease[0], t.mode === 'line' ? '#ffffff' : t.trail[0]];
  c.save();
  for (let o = 0; o < fx.parts.length; o += STRIDE) {
    const age = fx.parts[o + 4],
      life = fx.parts[o + 5];
    if (age >= life) continue;
    const k = fx.parts[o + 7],
      x = fx.parts[o] - cam,
      y = fx.parts[o + 1],
      left = 1 - age / life,
      s = fx.parts[o + 6];
    c.globalAlpha = k === 0 ? left * 0.8 : left;
    if (k === 3) {
      c.fillStyle = colors[3];
      c.fillRect(Math.round(x), Math.round(y), s, 1);
    } else if (k === 0) {
      const r = s * (1 + age * 1.5);
      dot(colors[0], x - r / 2, y - r / 2, r);
    } else {
      const r = s * left + 1;
      dot(colors[k], x - r / 2, y - r / 2, r);
    }
  }
  c.restore();
}
// Pop-ups follow the plane: scale in with outBack, rise with outCubic, fade at the end.
export function drawPopups(c, fx, px, py, reduced) {
  const t = theme(),
    dark = t.id === 'paper' ? '#5a2f1f' : '#141c32';
  c.save();
  c.textAlign = 'center';
  c.lineJoin = 'round';
  fx.popups.forEach((p, i) => {
    const k = p.age / FX.popupLife,
      big = p.style === 'perfect' || p.style === 'land',
      scale = reduced ? 1 : ease.outBack(clamp01(p.age / 0.25)),
      rise = reduced ? 0 : ease.outCubic(k) * 26;
    const color = {
      perfect: '#ffd166',
      success: t.mode === 'line' ? '#ffffff' : t.plane.crease[0],
      miss: '#cfd3e0',
      milestone: '#ffd166',
      land: '#ffffff',
    }[p.style];
    c.globalAlpha = clamp01((1 - k) / 0.3);
    c.font = `bold ${Math.round((big ? 17 : 13) * scale)}px ${FONTS[t.id] ?? 'monospace'}`;
    const x = Math.max(70, Math.min(570, px + (p.style === 'land' ? 0 : 20))),
      y = py - (p.style === 'land' ? 40 : 30) - rise - i * 16;
    c.strokeStyle = dark;
    c.lineWidth = 4;
    c.strokeText(p.text, x, y);
    c.fillStyle = color;
    c.fillText(p.text, x, y);
  });
  c.restore();
}
// Single soft flash on a perfect hit (≤ 1 per event, far below WCAG's 3 flashes/s).
export function drawFlash(c, fx, reduced) {
  if (reduced || fx.flash <= 0) return;
  c.save();
  c.globalAlpha = (fx.flash / 0.12) * 0.18;
  c.fillStyle = '#ffffff';
  c.fillRect(-20, -20, 680, 400);
  c.restore();
}
