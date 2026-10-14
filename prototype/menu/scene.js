// Zástupné pozadí prototypu: 2D canvas místo 3D scény (jen kvůli čitelnosti HUD nad pohyblivým městem a rozložení).
// Paralaxa 3 vrstev; reduced motion = všechny vrstvy stejnou rychlostí, menu bez pohybu.
const PAL = {
  neon: [
    ['#1b1444', '#5a2c7a', '#2c1f5c', '#241a4d', '#15101f', '#ff6fb5'],
    ['#0f1d40', '#2a5a86', '#1d2f5c', '#16244a', '#0d1326', '#5cc8ff'],
    ['#2a1440', '#c8553d', '#4a2040', '#35183a', '#1a0d22', '#ffc35a'],
    ['#120a2a', '#3b1060', '#2a0f4a', '#1e0b38', '#0c0618', '#ff4f9e'],
  ],
  paper: [
    ['#f3d9c6', '#f9efe2', '#d9b9a8', '#e8cdb8', '#c98f73', '#7a5c4f'],
    ['#9cc9d6', '#e6f1ee', '#8fb2bd', '#c9d8d6', '#6f8f99', '#3d5a63'],
    ['#e9a447', '#f6d79a', '#c96f4a', '#e3b073', '#b0603d', '#6b3a24'],
    ['#c9d3e8', '#f2efe6', '#9aa6c4', '#b9c2d8', '#7d86a6', '#3f4660'],
  ],
};
const INK = { neon: '#15101f', paper: '#2b2725' },
  QTE = {
    neon: { ok: '#5cf2ff', pf: '#ff4f9e', track: '#15101f', needle: '#f5f1ff' },
    paper: { ok: '#2f7d74', pf: '#d9573f', track: '#fbf4e4', needle: '#2b2725' },
  };
const rnd = (i, s) => {
  let h = (i * 374761393 + s * 668265263) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
export function createScene(canvas) {
  const c = canvas.getContext('2d');
  let W = 0,
    H = 0,
    dpr = 1;
  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  resize();
  addEventListener('resize', resize);
  const k = () => Math.max(4, W / 90); // px na metr
  const ground = () => H * 0.8,
    ky = () => Math.min(k(), (H * 0.55) / 60);
  const toScreen = (x, y, camX) => [(x - camX) * k(), ground() - y * ky()];
  function layer(camX, par, seg, minH, maxH, minW, maxW, fill, ink, win, seed, outline) {
    const kk = k(),
      off = camX * par,
      start = Math.floor(off / seg) - 2,
      end = start + Math.ceil(W / kk / seg) + 4,
      g = ground();
    for (let i = start; i < end; i++) {
      const w = minW + rnd(i, seed) * (maxW - minW),
        h = minH + rnd(i, seed + 7) * (maxH - minH),
        x = (i * seg - off) * kk,
        top = g - h * kk * 0.9;
      c.fillStyle = fill;
      c.fillRect(x, top, w * kk, g - top + 2);
      if (outline) {
        c.strokeStyle = ink;
        c.lineWidth = 2;
        c.strokeRect(x + 1, top + 1, w * kk - 2, g - top);
      }
      if (win) {
        c.fillStyle = win;
        const cols = Math.max(1, Math.floor(w / 4)),
          rows = Math.max(1, Math.floor(h / 6));
        for (let a = 0; a < cols; a++)
          for (let b = 0; b < rows; b++)
            if (rnd(i * 31 + a * 7 + b, seed + 3) > 0.55)
              c.fillRect(x + (a * 4 + 1.4) * kk, top + (b * 6 + 2) * kk * 0.9, 1.2 * kk, 1.6 * kk);
      }
    }
  }
  function hills(camX, par, fill, seed) {
    const kk = k(),
      off = camX * par,
      seg = 60,
      start = Math.floor(off / seg) - 2,
      end = start + Math.ceil(W / kk / seg) + 4,
      g = ground();
    c.fillStyle = fill;
    c.beginPath();
    c.moveTo(-10, g);
    for (let i = start; i < end; i++) {
      const x = (i * seg - off) * kk,
        h = (20 + rnd(i, seed) * 30) * kk * 0.9;
      c.lineTo(x, g);
      c.lineTo(x + seg * kk * 0.5, g - h);
      c.lineTo(x + seg * kk, g);
    }
    c.lineTo(W + 10, g);
    c.closePath();
    c.fill();
  }
  function plane(px, py, ang, ink) {
    c.save();
    c.translate(px, py);
    c.rotate(ang);
    c.fillStyle = '#ffffff';
    c.strokeStyle = ink;
    c.lineWidth = 2;
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(18, 0);
    c.lineTo(-15, -8);
    c.lineTo(-8, 0);
    c.lineTo(-15, 7);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
  }
  function ring(px, py, r, q) {
    const R = 30,
      a0 = -Math.PI / 2,
      arc = (f0, f1, col, w) => {
        c.beginPath();
        c.arc(px, py, R, a0 + f0 * 2 * Math.PI, a0 + f1 * 2 * Math.PI);
        c.strokeStyle = col;
        c.lineWidth = w;
        c.stroke();
      };
    c.beginPath();
    c.arc(px, py, R + 7, 0, 7);
    c.fillStyle = q.track;
    c.globalAlpha = 0.88;
    c.fill();
    c.globalAlpha = 1;
    arc(0, 1, q.needle + '55', 6);
    arc(r.ok[0], r.ok[1], q.ok, 8);
    arc(r.pf[0], r.pf[1], q.pf, 12);
    // hvězda u perfektní zóny (tvar, ne jen barva)
    const am = a0 + (r.pf[0] + r.pf[1]) * Math.PI;
    c.fillStyle = q.pf;
    c.font = 'bold 14px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('★', px + Math.cos(am) * (R + 16), py + Math.sin(am) * (R + 16));
    if (r.active) {
      const an = a0 + r.p * 2 * Math.PI;
      c.beginPath();
      c.arc(px + Math.cos(an) * R, py + Math.sin(an) * R, 6, 0, 7);
      c.fillStyle = q.needle;
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = q.track;
      c.stroke();
    }
    if (r.result) {
      c.fillStyle = r.result === 'miss' ? q.needle : r.result === 'perfect' ? q.pf : q.ok;
      c.font = 'bold 22px sans-serif';
      c.fillText(r.result === 'miss' ? '✕' : r.result === 'perfect' ? '★' : '✓', px, py);
    }
  }
  return {
    toScreen,
    draw(v) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const skin = v.skin === 'paper' ? 'paper' : 'neon',
        P = PAL[skin][v.district ?? 0],
        ink = INK[skin];
      if (v.lost) {
        const g = c.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, ink);
        g.addColorStop(1, P[0]);
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        return;
      }
      const g = c.createLinearGradient(0, 0, 0, H * 0.8);
      g.addColorStop(0, P[0]);
      g.addColorStop(1, P[1]);
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.beginPath();
      c.arc(W * 0.76, H * 0.24, Math.min(W, H) * 0.09, 0, 7);
      c.fillStyle = skin === 'paper' ? '#fff6e0' : '#ffe9f4';
      c.globalAlpha = skin === 'paper' ? 0.9 : 0.75;
      c.fill();
      c.globalAlpha = 1;
      const cam = v.camX,
        flat = v.reduced;
      hills(cam, flat ? 1 : 0.2, P[2], 11);
      layer(
        cam,
        flat ? 1 : 0.5,
        14,
        12,
        34,
        7,
        13,
        P[3],
        ink,
        skin === 'paper' ? null : P[5] + 'aa',
        23,
        skin === 'neon',
      );
      layer(cam, 1, 9, 4, 11, 5, 9, P[4], ink, skin === 'paper' ? P[5] : null, 41, skin === 'neon');
      c.fillStyle = P[4];
      c.fillRect(0, ground(), W, H - ground());
      if (v.trail?.length > 1) {
        c.save();
        c.setLineDash([6, 6]);
        c.strokeStyle = skin === 'paper' ? ink + '99' : '#ffffffaa';
        c.lineWidth = 2;
        c.beginPath();
        v.trail.forEach(([x, y], i) => {
          const [sx, sy] = toScreen(x, y, cam);
          i ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
        });
        c.stroke();
        c.restore();
      }
      if (v.aim) {
        const [hx, hy] = toScreen(0, v.plane.y, cam),
          len = 60 + v.aim.charge * 90,
          a = (-v.aim.angle * Math.PI) / 180;
        c.save();
        c.setLineDash([8, 7]);
        c.lineWidth = 3 + v.aim.charge * 3;
        c.strokeStyle = skin === 'paper' ? ink : '#f5f1ff';
        c.beginPath();
        c.moveTo(hx, hy);
        c.lineTo(hx + Math.cos(a) * len, hy + Math.sin(a) * len);
        c.stroke();
        c.restore();
        c.beginPath();
        c.arc(hx, hy, len, a - 0.05, a + 0.05);
        c.strokeStyle = QTE[skin].pf;
        c.lineWidth = 6;
        c.stroke();
      }
      if (v.plane?.visible) {
        const [px, py] = v.plane.screen ?? toScreen(v.plane.x, v.plane.y, cam);
        plane(px, py, v.plane.angle, ink);
        if (v.ring) ring(px, py - 64, v.ring, QTE[skin]);
      }
    },
  };
}
