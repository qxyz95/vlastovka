// Dávka U5 „Kostra přes celou obrazovku“ (research/plan-hratelnost/02-ux.md §1.2–1.5, §5.3): převod souřadnic a poměr stran.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIEW,
  layerHeight,
  viewToCss,
  cssToView,
  aimAngleAt,
  fitLayer,
} from '../src/render3d/ui-layer.js';
import { planFrame, aspectOf, project, ASPECT, ASPECT_RANGE } from '../src/render3d/frame.js';
import { HAND } from '../src/render3d/pose.js';
import { createFlight, step } from '../src/core.js';

const SIZES = [
  [1280, 720],
  [1280, 800],
  [360, 740],
  [320, 568],
  [932, 430],
  [1920, 1080],
];
const near = (a, b, eps = 1e-9, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg}: ${a} vs ${b}`);

test('U5 §1.5: logické 640 × 360 ↔ CSS px plátna na různých velikostech (tam a zpět beze ztráty)', () => {
  for (const [width, height] of SIZES) {
    const size = { width, height };
    for (const [px, py] of [
      [0, 0],
      [148, 258],
      [320, 180],
      [640, 360],
    ]) {
      const c = viewToCss({ px, py }, size);
      near(c.x, (px / 640) * width, 1e-9, 'x');
      near(c.y, (py / 360) * height, 1e-9, 'y');
      const back = cssToView(c, size);
      near(back.px, px, 1e-9, `${width}×${height} px`);
      near(back.py, py, 1e-9, `${width}×${height} py`);
    }
  }
  assert.deepEqual(cssToView({ x: 5, y: 5 }, { width: 0, height: 0 }), { px: 0, py: 0 });
});

test('U5 §1.5: úhel míření se počítá ve skutečných px, na 16 : 9 stejně jako dřív', () => {
  const view = { px: 148, py: 258 };
  // dřívější vzorec v ui.js (správný jen pro 16 : 9)
  const old = (x, y) =>
    Math.max(5, Math.min(40, (Math.atan2(view.py - y, Math.max(1, x - view.px)) * 180) / Math.PI));
  for (const [x, y] of [
    [400, 150],
    [300, 250],
    [600, 10],
    [100, 300],
  ]) {
    const size = { width: 1280, height: 720 },
      c = viewToCss({ px: x, py: y }, size);
    near(aimAngleAt(c, view, size), old(x, y), 1e-9, `${x},${y}`);
  }
  for (const [width, height] of SIZES) {
    const size = { width, height },
      o = viewToCss(view, size);
    for (const deg of [10, 25, 35]) {
      const r = (deg * Math.PI) / 180,
        pt = { x: o.x + 100 * Math.cos(r), y: o.y - 100 * Math.sin(r) };
      near(aimAngleAt(pt, view, size), deg, 1e-9, `${width}×${height} ${deg}°`);
    }
    // mez 5–40°
    assert.equal(aimAngleAt({ x: o.x + 10, y: o.y + 50 }, view, size), 5);
    assert.equal(aimAngleAt({ x: o.x + 1, y: o.y - 500 }, view, size), 40);
  }
  // na výšku by starý vzorec (nerovnoměrný 640 × 360) dal jiný úhel
  const size = { width: 360, height: 740 },
    o = viewToCss(view, size),
    pt = { x: o.x + 100, y: o.y - 100 },
    p = cssToView(pt, size);
  assert.equal(aimAngleAt(pt, view, size), 40, '45° skutečných → strop 40°');
  assert.notEqual(Math.round(old(p.px, p.py)), 40);
});

test('U5 §1.5: UI vrstva má výšku podle poměru stran, na 16 : 9 beze změny (640 × 360)', () => {
  assert.equal(layerHeight(16 / 9), 360);
  assert.equal(layerHeight(0.5), 1280);
  assert.equal(layerHeight(0), 360);
  for (const [width, height] of SIZES) {
    const canvas = { width: 1280, height: 720 },
      lh = fitLayer(canvas, width / height);
    assert.equal(canvas.height, Math.round((1280 * height) / width));
    near(lh, (640 * canvas.height) / 1280, 1e-9, 'lh');
    near(lh / 640, height / width, 0.002, `${width}×${height} poměr`);
  }
  assert.equal(fitLayer(null), VIEW.h);
});

test('U5 §1.5: kamera počítá se skutečným poměrem stran; vlaštovka v ruce zůstane na (148, 258) logických', () => {
  assert.equal(aspectOf({}), ASPECT);
  assert.equal(aspectOf({ aspect: 'x' }), ASPECT);
  assert.equal(aspectOf({ aspect: 0.01 }), ASPECT_RANGE[0]);
  assert.equal(aspectOf({ aspect: 360 / 740 }), 360 / 740);
  for (const [width, height] of SIZES) {
    const aspect = width / height,
      visual = { state: 'aim', aspect, cssWidth: width, clock: 1 },
      plan = planFrame({ visual });
    near(plan.camera.aspect, aspect, 1e-12, 'camera.aspect');
    const [sx, sy] = project([HAND.x, HAND.y, HAND.z ?? 0], plan.camera);
    near(sx, 148, 2.5, `${width}×${height} ruka x`);
    near(sy, 258, 2.5, `${width}×${height} ruka y`);
    near(plan.view.px, 148, 2.5, `${width}×${height} view.px`);
  }
  // za letu: plan.view leží tam, kam kamera s týmž poměrem promítne vlaštovku
  for (const aspect of [360 / 740, 16 / 9, 932 / 430]) {
    const f = createFlight('dart', undefined, 1);
    let plan = null;
    for (let i = 0; i < 120; i++) {
      step(f);
      plan = planFrame({
        f,
        time: f.t,
        visual: { state: 'flight', aspect, cssWidth: 800, clock: f.t },
        prev: plan,
      });
    }
    const [sx, sy] = project([plan.X, plan.Y, 0], plan.camera);
    near(sx, plan.view.px, 1, `let ${aspect.toFixed(2)} x`);
    near(sy, plan.view.py, 1, `let ${aspect.toFixed(2)} y`);
  }
});
