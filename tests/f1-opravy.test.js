// Opravná dávka „F1 před hraním“: art review A1–A5, A7 a QA N-1, N-2, N-4 (runs/2026-10-15-f1-opravy.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compact } from './helpers/compact.js';
import { introTextSize } from '../src/render3d/ui-layer.js';
import { introVariant } from '../src/render3d/intro.js';
import { INTRO_SHOT } from '../src/render3d/models/launch-site.js';
import { RIG } from '../src/render3d/models/kid.js';
import en from '../src/locales/en.js';

const raw = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8'),
  css = compact(raw('style.css')),
  clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v));

// Zoom velkých oken podle style.css (A2): 1,5 od 2200 × 1200, 1,25 od 1700 × 1000.
const zoomOf = (w, h) => (w >= 2200 && h >= 1200 ? 1.5 : w >= 1700 && h >= 1000 ? 1.25 : 1);
// Titul v CSS px: levý horní roh (inset 12 + 56 dolů), h1 max 5em, dva řádky po 0,92.
function titleRect(w, h) {
  const portrait = w <= 650 || (h > w && w <= 900),
    land = h <= 500 && w > h,
    size = portrait
      ? clamp(24, 0.075 * w, 30)
      : land
        ? clamp(32, 0.09 * h, 56)
        : clamp(44, 0.065 * w, 88),
    z = zoomOf(w, h);
  return {
    x0: 12 * z,
    y0: 68 * z,
    x1: 12 * z + 5 * size * z,
    y1: 68 * z + 2 * 0.92 * size * z,
    size,
  };
}
// Nápis úvodu na plátně v CSS px (odhad šířky znaku 0,55 em, nápověda 0,5 em, výška řádku = velikost).
function introRects(w, h) {
  const sz = introTextSize(w),
    [b0, b1] = introVariant(w / h).text,
    y0 = b0 * h,
    y1 = b1 * h,
    box = (cy, size, text, em = 0.55) => ({
      x0: w / 2 - (text.length * em * size) / 2,
      x1: w / 2 + (text.length * em * size) / 2,
      y0: cy - size / 2,
      y1: cy + size / 2,
    });
  return {
    sz,
    title: box(y0 + (y1 - y0) * 0.42, sz.cssSize, en['prompt.throw']),
    hint: box(y0 + (y1 - y0) * 0.86, sz.cssSub, en['prompt.hintMouse'], 0.5),
  };
}
const overlap = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('A1/A3: introTextSize drží tokeny 32–72 a 15–18 CSS px (360, 1280, 2560) a dělí je škálou plátna', () => {
  for (const [w, size, sub] of [
    [360, 32.4, 15],
    [1280, 72, 18],
    [2560, 72, 18],
  ]) {
    const r = introTextSize(w),
      k = w / 640;
    assert.ok(Math.abs(r.cssSize - size) < 1e-9, `Throw it ${w}`);
    assert.equal(r.cssSub, sub, `nápověda ${w}`);
    assert.ok(
      Math.abs(r.size * k - size) < 1e-9 && Math.abs(r.sub * k - sub) < 1e-9,
      `logické ${w}`,
    );
  }
  assert.equal(introTextSize(0).cssSize, introTextSize(640).cssSize, 'neplatná šířka = 640');
  assert.equal(introTextSize(932).cssSize, 72);
  // mezilehlé: 9vw a 3,8vw
  assert.ok(Math.abs(introTextSize(500).cssSize - 45) < 1e-9);
  assert.ok(Math.abs(introTextSize(500).cssSub - 19) > 0 && introTextSize(500).cssSub === 18);
});

test('A1/A3: nápověda se nepřekrývá s titulem (1280×800, 1440×900, 1920×1080); na 360×740 je „Throw it“ ≥ 32 px a větší než titul', () => {
  for (const [w, h] of [
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1277],
  ]) {
    const { title, hint } = introRects(w, h),
      t = titleRect(w, h);
    assert.ok(!overlap(hint, t), `nápověda × titul ${w}×${h}`);
    assert.ok(!overlap(title, t), `Throw it × titul ${w}×${h}`);
  }
  const p = introRects(360, 740);
  assert.ok(p.sz.cssSize >= 32 && p.sz.cssSize > titleRect(360, 740).size);
  assert.ok(p.sz.cssSub >= 15);
});

test('A1: titul na desktopu clamp(44px, 6.5vw, 88px), na výšku clamp(24px, 7.5vw, 30px)', () => {
  assert.ok(css.includes('--title-size:clamp(44px,6.5vw,88px)'));
  assert.ok(css.includes('#title h1{font-size:clamp(24px,7.5vw,30px)'));
});

test('A2: zoom 1,25 / 1,5 jen na UI kontejnery, ne na html ani #game', () => {
  const sel = ':is(dialog.panel,#result,.hud,#title,.corner){zoom:';
  assert.ok(css.includes('@media(min-width:1700px)and(min-height:1000px){' + sel + '1.25;}'));
  assert.ok(css.includes('@media(min-width:2200px)and(min-height:1200px){' + sel + '1.5;}'));
  assert.ok(!/(^|[}\s])(html|:root|#game|body)\{[^}]*zoom:/.test(css), 'zoom jen na kontejnerech');
  // zoom násobí vh/dvh, proto panel dělí max-height zoomem
  assert.ok(css.includes('max-height:calc((100dvh - 24px)/ 1.25)'));
  assert.ok(css.includes('max-height:calc((100dvh - 24px)/ 1.5)'));
});

test('A4: pás nápisu na šířku [0,06; 0,20] a nápis nekoliduje s HUD ani titulem na 932×430', () => {
  assert.deepEqual([...INTRO_SHOT.landText], [0.06, 0.2]);
  assert.deepEqual([...introVariant(932 / 430).text], [0.06, 0.2]);
  const { title, hint } = introRects(932, 430),
    t = titleRect(932, 430),
    hudLeft = { x0: 12, y0: 12, x1: 12 + 160, y1: 60 },
    hudRight = { x0: 932 - 12 - 200, y0: 12, x1: 920, y1: 60 };
  for (const r of [title, hint]) {
    assert.ok(!overlap(r, t) && !overlap(r, hudLeft) && !overlap(r, hudRight));
  }
  assert.ok(hint.y0 >= 60, 'nápověda pod řádkem HUD');
});

test('A5: čepice postavičky výš, aby oči byly vidět', () => {
  assert.deepEqual([...RIG.cap], [-0.01, 0.285, 0]);
});

test('A7/N-4: posuvník panelů v barvě kraftu, panel se vejde do okna a roluje', () => {
  const panel = css.slice(
      css.indexOf('dialog.panel{position:fixed'),
      css.indexOf('dialog.panel[open]'),
    ),
    result = css.slice(css.indexOf('#result{'), css.indexOf('#result[hidden]'));
  for (const b of [panel, result])
    assert.ok(b.includes('scrollbar-color:var(--kraft-400)transparent'), b.slice(0, 40));
  assert.ok(panel.includes('max-height:calc(100dvh - 24px)') && panel.includes('overflow:auto'));
});

test('N-2: karta výsledku na šířku nepřepíše top a začíná pod řádkem HUD', () => {
  assert.ok(css.includes('#result{top:calc(var(--hud-inset-t)+60px)'));
  const land = css.slice(css.indexOf('@media(max-height:500px)and(orientation:landscape)'));
  assert.ok(!/#result\{[^}]*top:/.test(land.slice(0, land.indexOf('@media(min-width:1700px)'))));
});

test('N-1: setPointerCapture na #hold a #action je v try/catch jako u #game', () => {
  const ui = compact(raw('src/ui.js'));
  for (const id of ['game', 'hold', 'action'])
    assert.ok(
      ui.includes(`try{$('${id}').setPointerCapture(e.pointerId);}catch{}`),
      `${id} bez try/catch`,
    );
  assert.ok(!ui.match(/[^{]\$\('(hold|action)'\)\.setPointerCapture/), 'holé volání');
});
