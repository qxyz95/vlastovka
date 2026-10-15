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
import { readFileSync, readdirSync } from 'node:fs';
import { compact } from './helpers/compact.js';
import { PANELS } from '../src/screens.js';
import en from '../src/locales/en.js';
import cs from '../src/locales/cs.js';

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

// ── Statické kontroly kostry (02-ux §1.1 co zmizí, §1.4 HUD, §1.5, §5.3) ──
const raw = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const stripJs = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;{}),])\/\/.*$/gm, '$1');
const html = raw('index.html'),
  css = compact(raw('style.css')),
  ui = stripJs(raw('src/ui.js'));

test('U5 §1.1: z index.html zmizela okolní stránka, zůstala hra přes celé okno', () => {
  for (const s of [
    '<header',
    '<footer',
    'page-nav',
    'class="intro"',
    'journey-story',
    'scene-label',
    'milestone-banner',
    'id="paused"',
    'id="launch"',
    'id="upgrades"',
    'id="cancel-aim"',
    'charge-track',
    'aim.title',
    'aim.eyebrow',
    'flight.eyebrow',
    'class="scene"',
  ])
    assert.ok(!html.includes(s), s);
  assert.match(html, /<meta name="viewport" content="[^"]*viewport-fit=cover/);
  assert.match(html, /<canvas id="scene3d"/);
  assert.match(html, /<canvas id="game"/);
  // HUD jen dolet a mince + ☰/❚❚ s klávesou Esc (§1.4)
  assert.match(html, /id="hud-distance"/);
  assert.match(html, /id="hud-coins"/);
  assert.match(html, /<button id="menu-btn"[^>]*aria-keyshortcuts="Escape"/);
  assert.match(html, /<div id="banner" role="status"/);
  assert.match(html, /<section id="result"[^>]*role="dialog"/);
  for (const id of PANELS) assert.match(html, new RegExp(`<dialog id="${id}"`), id);
  assert.match(html, /<noscript>/);
  // vstupy hodu zatím beze změny (U6): tlačítko Hold zůstává v rohu
  assert.match(html, /<button id="hold"/);
  assert.match(html, /<button id="action"/);
  // jazyk patří do Nastavení
  assert.match(html, /<dialog id="settings"[\s\S]*id="lang-picker"[\s\S]*<\/dialog>/);
  assert.ok(!/confirm\(/.test(ui), 'mazání postupu bez window.confirm()');
});

test('U5 §1.5: celé okno, bezpečné okraje, dotyk jen na herní ploše, tokeny §6', () => {
  assert.match(css, /html,body\{height:100%;overflow:hidden;overscroll-behavior:none;?\}/);
  assert.match(css, /#app\{position:fixed;inset:0;height:100vh;height:100dvh;/);
  assert.match(css, /#game\{touch-action:none;/);
  assert.match(css, /dialog\.panel\{[^}]*touch-action:pan-y/);
  assert.match(css, /--hud-inset-t:max\(12px,env\(safe-area-inset-top\)\)/);
  for (const k of [
    '--surface-hud',
    '--color-new',
    '--color-danger',
    '--prompt-fg',
    '--prompt-halo',
    '--prompt-size',
    '--prompt-size-calm',
    '--prompt-hint-size',
    '--prompt-anchor-y',
    '--hud-chip-bg',
    '--hud-chip-fg',
    '--hud-distance-size',
    '--hud-coins-fg',
    '--gain-row-bg',
    '--gain-row-mark',
    '--title-size',
    '--t-fast',
    '--t-mid',
    '--t-panel',
  ])
    assert.ok(css.includes(k + ':'), k);
  for (const s of ['.page-nav', '.brand', '.wallet', '#journey-story', 'footer{', '.scene{'])
    assert.ok(!css.includes(s), s);
});

test('U5: ui.js řídí obrazovky a panely přes screens.js (žádné vlastní příznaky obrazovek)', () => {
  assert.match(
    ui,
    /import \{ initialState, transition, loopRuns, PANELS \} from '\.\/screens\.js';/,
  );
  assert.match(ui, /let S = initialState\(\);/);
  assert.match(ui, /S = transition\(S, e\);/);
  assert.ok(!/\bstate = '(workshop|aim|flight|result)'/.test(ui), 'starý příznak state');
  assert.ok(!/function show\(next\)/.test(ui), 'starý přepínač show()');
  assert.ok(!/function workshop\(/.test(ui), 'Dílna je panel, ne obrazovka');
  // herní smyčka jen při loopRuns, Esc = back, systémové zpět, auto-pauza, přistání a Hodit znovu jako události
  assert.match(ui, /const runs = loopRuns\(S\)/);
  assert.match(ui, /go\(\{ type: 'back' \}\)/);
  assert.match(ui, /addEventListener\('popstate'/);
  assert.match(ui, /go\(\{ type: 'hidden' \}\)/);
  assert.match(ui, /go\(\{ type: 'landed', t: now, chapter: false \}\)/);
  assert.match(ui, /go\(\{ type: 'cancelThrow' \}\)/);
  assert.match(ui, /go\(\{ type: 'resetProgress' \}\)/);
  assert.match(ui, /go\(\{ type: 'press', t: performance\.now\(\) \}\)/);
  assert.match(ui, /go\(\{ type: 'release', heldMs \}\)/);
  // odkrývání, nastavení pohybu a skutečný poměr plátna
  assert.match(ui, /import \{ reveal, coinLine \} from '\.\/reveal\.js';/);
  assert.match(ui, /reducedMotion\(settings, systemReduce\.matches\)/);
  assert.match(ui, /aspect: gameSize\.width \/ gameSize\.height/);
  assert.match(ui, /aimAngleAt\(/);
});

test('U5 §5.3: klíče zmizelých prvků jsou pryč z obou slovníků a nikde se nečtou', () => {
  const gone = [
    'nav.label',
    'nav.workshop',
    'nav.atlas',
    'intro.eyebrow',
    'intro.title',
    'intro.line1',
    'intro.line2',
    'workshop.eyebrow',
    'hud.best',
    'hud.milestone',
    'scene.aim',
    'footer.confirm',
    'result.upgrades',
  ];
  for (const d of [en, cs]) for (const k of gone) assert.ok(!(k in d), k);
  const srcs = [
    ...readdirSync(new URL('../src/', import.meta.url), { recursive: true })
      .filter(f => f.endsWith('.js') && !f.startsWith('locales'))
      .map(f => raw('src/' + f)),
    html,
    raw('bonus.html'),
  ];
  for (const s of srcs)
    for (const k of gone) assert.ok(!s.includes(`'${k}'`) && !s.includes(`"${k}"`), k);
  // bonus.html jen přesměruje na Atlas ve hře
  assert.match(raw('bonus.html'), /location\.replace\('\.\/'\+location\.search\+'#atlas'\)/);
});
