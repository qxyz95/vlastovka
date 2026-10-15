// Opravná dávka F2 „Art review Atlasu a událostí“: B1–B18 z runs/2026-10-16-art-review-atlas.md kap. A (runs/2026-10-16-f2-art-opravy.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { compact } from './helpers/compact.js';
import {
  LANTERN_FX,
  lanternBase,
  lanternPose,
  STEAM_FX,
  THERMAL_FX,
  COMBO_UI,
  comboZoom,
  bellZoom,
} from '../src/render3d/event-fx.js';
import { drawUi, drawPopups, introTextSize, uiScale } from '../src/render3d/ui-layer.js';
import { PAPIR as P, PAPER_TOKENS as PT, mix } from '../src/render3d/palette.js';
import { TONES } from '../src/atlas-ui.js';
import { SHAPES } from '../src/atlas-postcards.js';

registerHooks({
  resolve: (s, c, next) =>
    s === 'three'
      ? {
          url: new URL('../vendor/three/three.module.min.js', import.meta.url).href,
          shortCircuit: true,
        }
      : next(s, c),
});
const raw = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8'),
  css = compact(raw('style.css'));
// WCAG kontrast z hex
const lin = v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4),
  lum = h => {
    const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  contrast = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };
// Plátno, které zaznamená volání, styl v okamžiku volání a měřítko (scale) pro zvoneček.
function fakeCtx(width = 640, clientWidth = width, clientHeight) {
  const ops = [],
    stack = [],
    st = { fillStyle: '#000', strokeStyle: '#000', lineWidth: 1, globalAlpha: 1, font: '10px x' };
  const rec =
    name =>
    (...args) =>
      ops.push({ name, args, style: { ...st } });
  const c = {
    canvas: { width, height: (width * 9) / 16, clientWidth, clientHeight },
    ops,
    save: () => stack.push({ ...st }),
    restore: () => Object.assign(st, stack.pop() ?? {}),
    setLineDash: () => {},
    measureText: t => ({ width: String(t).length * 6 }),
    getTransform: () => ({ a: 1, b: 0 }),
  };
  for (const n of [
    'beginPath',
    'arc',
    'ellipse',
    'stroke',
    'fill',
    'fillRect',
    'moveTo',
    'lineTo',
    'closePath',
    'fillText',
    'clearRect',
    'setTransform',
    'translate',
    'rotate',
    'scale',
  ])
    c[n] = rec(n);
  for (const k of Object.keys(st))
    Object.defineProperty(c, k, { get: () => st[k], set: v => (st[k] = v) });
  return c;
}
const fontPx = f => Number(/(\d+(?:\.\d+)?)px/.exec(f)[1]);

test('B1: lampion v kontaktu uvnitř volného středu kruhu (|lanX − X| ≤ 3,6 m) a za vlaštovkou (z < 0)', () => {
  assert.equal(LANTERN_FX.ahead, 3.5);
  assert.equal(LANTERN_FX.z, -0.8);
  const close = 5,
    X = 100 + 50 * close,
    base = lanternBase(X, 30 + 4 * close, 50, 4, close, close),
    pose = lanternPose(base, { result: null, follow: false, resolvedAt: null }, close, true);
  assert.ok(Math.abs(base.x - X) <= 3.6, `lanX − X = ${base.x - X}`);
  assert.ok(pose.z < 0);
  // záře je ještě dál za lampionem (companion3d: pose.z − 1)
  assert.ok(
    compact(raw('src/render3d/companion3d.js')).includes(
      'glow.position.set(pose.x,pose.y,pose.z - 1)',
    ),
  );
});

test('B3: kombo na 360 px má štítek ×N ≥ 13 CSS px, zvoneček ≥ 14 × 16 CSS px a leží na krémovém štítku', () => {
  for (const cssW of [360, 390, 640, 1280]) {
    const k = cssW / 640,
      s = uiScale(cssW) * comboZoom(cssW, uiScale(cssW)),
      c = fakeCtx(cssW * 2, cssW),
      combo = { n: 3, max: 5, owned: true, age: 9, before: 3, broke: 0, chimes: true, ring: 9 };
    drawUi(c, { ui: { combo, comboAnchor: { x: cssW - 12, y: 40 }, cssWidth: cssW } });
    const text = c.ops.find(o => o.name === 'fillText' && o.args[0] === '×3');
    assert.ok(fontPx(text.style.font) * k >= 13 - 1e-9, `${cssW}: ${fontPx(text.style.font) * k}`);
    const sc = c.ops.find(o => o.name === 'scale').args[0];
    assert.ok(COMBO_UI.bell[0] * sc * k >= 14 - 1e-9, `${cssW}: zvoneček šířka`);
    assert.ok(COMBO_UI.bell[1] * sc * k >= 16 - 1e-9, `${cssW}: zvoneček výška`);
    // krémový podklad (alfa 0,9) se kreslí před očky
    const back = c.ops.findIndex(o => o.name === 'fillRect' && o.style.fillStyle === P.combo.tag),
      link = c.ops.findIndex(o => o.name === 'ellipse');
    assert.ok(back >= 0 && back < link);
    assert.equal(c.ops[back].style.globalAlpha, COMBO_UI.backAlpha);
    if (cssW === 360) assert.ok(Math.abs(s / uiScale(360) - 1.313) < 0.01, `× ${s / 1.6}`);
  }
  assert.equal(comboZoom(1280, 1), 1, 'desktop beze změny');
  assert.equal(bellZoom(1280, 1), 1);
  // očka (teal) na krému drží ≥ 3 : 1 (grafika)
  assert.ok(contrast(P.combo.link, P.combo.tag) >= 3);
});

test('B5–B6, B9: polštář z pásky, pás Dive bez grafitu, popup ½ ve velikosti big', () => {
  assert.equal(P.ability.pillow, PT.tape);
  assert.equal(P.ability.pillowEdge, PT.kraftDark);
  const ui = compact(raw('src/render3d/ui-layer.js'));
  assert.ok(!/kind==='lowPass'[^}]*q\.dot/.test(ui), 'lowPass bez q.dot');
  const c = fakeCtx(),
    list = [
      { style: 'half', text: '½', alpha: 1, scale: 1, rise: 0, i: 0 },
      { style: 'perfect', text: 'Perfect', alpha: 1, scale: 1, rise: 0, i: 1 },
    ];
  drawPopups(c, list, { px: 200, py: 200 }, P, 1.6);
  const [half, perf] = c.ops.filter(o => o.name === 'fillText').map(o => fontPx(o.style.font));
  assert.equal(half, perf);
  assert.ok(half * (360 / 640) >= 15, `½ na 360 px: ${half * 0.5625}`);
  assert.ok(contrast(P.qte.half, P.popup.bg) >= 3, 'velký text ≥ 3 : 1');
});

test('B7, B8, B10: záře lampionu měkký kotouč 16 segmentů ⌀ 8,8 m, tělo termiky bez tvrdé hrany, pára se stínem papíru', async () => {
  const { createCompanion, EVENT_TRIS } = await import('../src/render3d/companion3d.js'),
    { toonRamp, outlineMaterial } = await import('../src/render3d/toon.js'),
    { paperKit } = await import('../src/render3d/paper.js');
  const kit = paperKit(),
    comp = createCompanion({
      ramp: toonRamp(),
      hull: outlineMaterial({ color: '#000000' }),
      palette: P,
      paper: kit,
    });
  // záře
  const g = comp.glow.geometry,
    col = g.attributes.color;
  assert.equal(g.parameters.segments, 16);
  assert.equal(col.itemSize, 4);
  assert.ok(Math.abs(col.getW(0) - P.companion.lantern.glowCore) < 1e-6);
  assert.equal(P.companion.lantern.glowCore, 0.3);
  for (let i = 1; i < col.count; i++) assert.equal(col.getW(i), 0);
  assert.equal(P.companion.lantern.glow, mix('#f2c14e', '#fffaf0', 0.3));
  const evs = {
    type: 'drone',
    key: 'drone:0:1',
    phase: 'interaction',
    result: null,
    resolvedAt: null,
    follow: false,
    w: { open: 1, close: 3, c: 2.9, s: 0.28, p: 0.1, col: 0 },
  };
  comp.update({ t: 3, X: 100, Y: 30, vx: 50, evs, district: 3, pxPerM: 6 });
  assert.ok(comp.glow.visible && Math.abs(comp.glow.scale.x - 4.4) < 1e-9, 'poloměr 4,4 m');
  assert.ok(comp.glow.position.z < comp.lantern.position.z && comp.lantern.position.z < 0);
  // termika
  const th = {
    type: 'thermal',
    key: 'thermal:0:1',
    phase: 'interaction',
    result: null,
    resolvedAt: null,
    follow: false,
    w: { open: 1, close: 3, c: 2, s: 0.2, p: 0.08, col: 0.6 },
  };
  comp.update({ t: 2, X: 100, Y: 30, vx: 50, evs: th, district: 0 });
  const tp = comp.thermal.geometry.attributes.position,
    ta = comp.thermal.geometry.attributes.color,
    body = Array.from({ length: 12 }, (_, i) => ({ x: tp.getX(i), y: tp.getY(i), a: ta.getW(i) })),
    top = Math.max(...body.map(v => v.y)),
    ribbonX = [12, 12 + 6 * THERMAL_FX.segs].map(i => tp.getX(i) + THERMAL_FX.ribbon / 2);
  assert.ok(
    body.filter(v => v.y === top).every(v => v.a === 0),
    'nahoře alfa 0',
  );
  assert.ok(
    body.filter(v => v.y === 0).every(v => Math.abs(v.a - 0.22) < 1e-6),
    'dole 0,22',
  );
  assert.ok(
    Math.min(...body.map(v => v.x)) >= ribbonX[0] - THERMAL_FX.ribbon + THERMAL_FX.inset - 1,
    'užší než stužky',
  );
  assert.equal(THERMAL_FX.inset, 0.5);
  // pára: spodní polovina obláčků ve stínu, pruh 2,0 → 1,0 m
  assert.deepEqual([...STEAM_FX.jet], [2.0, 1.0]);
  assert.equal(P.companion.steamShade, mix(PT.cream, '#5b4f7a', 0.25));
  const sc = comp.steam.geometry.attributes.color,
    tones = new Set(Array.from({ length: sc.count }, (_, i) => sc.getX(i).toFixed(4)));
  assert.equal(tones.size, 2, 'krém a stín');
  assert.equal(comp.steam.material.opacity, P.companion.steamAlpha);
  assert.ok(EVENT_TRIS.drone <= 100 && EVENT_TRIS.thermal <= 100);
  comp.dispose();
  kit.dispose();
});

test('B2: barvy čtvrtí v Atlasu = denní doby (06, 16. 10.), žádná barva role, obrys max úrovně grafitový', () => {
  assert.deepEqual(TONES, ['morning', 'noon', 'afternoon', 'evening']);
  const want = {
    1: ['#3d4f7a', '#f2b65a'],
    2: ['#2c6e9b', '#e8b03e'],
    3: ['#7a3b2e', '#e0533a'],
    4: ['#1d2b4d', '#f2c14e'],
  };
  for (const [n, [main, accent]] of Object.entries(want)) {
    assert.ok(css.includes(`--district-${n}:${main};`), `--district-${n}`);
    assert.ok(css.includes(`--district-${n}-accent:${accent};`), `--district-${n}-accent`);
    // okraj čtvrti (6 px) proti krému a kartě ≥ 3 : 1, dokonce ≥ 4,5 : 1
    assert.ok(contrast(main, '#fbf6ec') >= 4.5 && contrast(main, '#f4ecdc') >= 4.5, `${n}`);
    // silueta (vrstva main = tone 70 % + grafit) proti pozadí obrázku (tone 28 % + karta) ≥ 3 : 1; akcent je ozdoba (karta nese jméno)
    assert.ok(contrast(mix(main, '#2a2622', 0.3), mix(main, '#f4ecdc', 0.72)) >= 3, `${n} silueta`);
  }
  const rules = css.match(/[^}]*\[data-tone[^{]*\{[^}]*\}/g) ?? [];
  assert.ok(rules.length >= 3);
  for (const r of rules)
    assert.ok(!/tomato|teal|mustard|cobalt/.test(r) && /--district-[1-4]/.test(r), r);
  assert.ok(
    /\.atlas-district,\.atlas-pc-big\{--tone:var\(--district-1\);--pc-accent:var\(--district-1-accent\)/.test(
      css,
    ),
  );
  assert.ok(css.includes('.atlas-card.atlas-top-level{outline:3px solid var(--ink);'));
});

test('B4, B11–B17: ikony kapes, vystřižený papír pohlednic, siluety, Atlas na šířku, Dílna', () => {
  const ui = compact(raw('src/ui.js'));
  assert.ok(ui.includes("sharp:'◣',calm:'◠'"));
  assert.ok(!/POCKET_ICON=\{[^}]*[◆≈]/.test(ui));
  // B11
  assert.ok(css.includes('.atlas-pc-light{--pc-c:var(--cream-50);}'));
  assert.ok(
    /\.atlas-pc:is\(\.atlas-pc-main,\.atlas-pc-accent\):not\(\[fill\]\)\{[^}]*paint-order:stroke;[^}]*drop-shadow\(-1px 1px 0/.test(
      css,
    ),
  );
  // B12
  const has = (k, tag, attrs) =>
    SHAPES[k].some(s => s.tag === tag && Object.entries(attrs).every(([a, v]) => s.attrs[a] === v));
  assert.ok(has('fields', 'rect', { x: 106, y: 30, width: 16, height: 40 }), 'silo');
  assert.ok(has('fields', 'path', { d: 'M106 30A8 8 0 0 1 122 30Z' }), 'kopule sila');
  assert.ok(has('port', 'rect', { x: 61, y: 18 }), 'stožár');
  assert.equal(
    SHAPES.port.filter(s => s.tag === 'circle' && s.attrs.r === 2).length,
    4,
    'lampiony',
  );
  assert.equal(
    SHAPES.terraces.filter(s => s.tag === 'circle' && s.attrs.r === 5).length,
    3,
    'stromy',
  );
  // B13
  assert.ok(
    css.includes(
      '(orientation:landscape){.atlas-sheet{position:fixed;inset:0 0 0 auto;width:46%;max-height:none;',
    ),
  );
  // B14
  assert.ok(compact(raw('src/workshop-ui.js')).includes("swatch=el('span',null,'kind-swatch')"));
  for (const k of ['copy', 'washi', 'neon'])
    assert.ok(css.includes(`.kind[data-kind="${k}"].kind-swatch{`), k);
  assert.ok(css.includes('.kind.active::before{'));
  // B15, B17
  assert.ok(/\.preview\{[^}]*border-left:6px solid var\(--ink\);/.test(css));
  assert.ok(css.includes('.pocket-active{box-shadow:inset 0 -2px 0 var(--ink);}'));
});

test('B16: „Throw it“ na šířku bere i výšku (932 × 430 → 52 / 18 px), desktop beze změny', () => {
  const land = introTextSize(932, 932 / 640, 1, 430);
  assert.ok(Math.abs(land.cssSize - 51.6) < 1e-9 && land.cssSub === 18);
  assert.equal(introTextSize(1280, 2, 1, 800).cssSize, 72);
  assert.equal(introTextSize(1280, 2, 1, 800).cssSub, 18);
  assert.equal(introTextSize(932).cssSize, 72, 'bez výšky jako dřív');
  // drawUi předá clientHeight plátna
  const c = fakeCtx(932, 932, 430);
  drawUi(c, { ui: { intro: { alpha: 1, band: [0.06, 0.2] } } }, { cssWidth: 932 });
  const title = c.ops.find(o => o.name === 'fillText');
  assert.ok(Math.abs(fontPx(title.style.font) * (932 / 640) - 51.6) < 1e-6);
});

test('B18: Washi seigaiha silnější (0,28) a větší buňka (0,085), list průměrně L ≥ 0,69', () => {
  const src = raw('src/render3d/plane.js');
  assert.ok(src.includes('vec2 p=vec2(s,x)/.085;') && src.includes('pA,.28*(1.-far)'));
  // čára seigaihy pokrývá 2 · 0,035 z periody 1/3; v ní list × mix(1, pA, 0,28)
  const L = h => lum(h),
    fill = '#fbe8cc',
    pA = '#3d4f7a',
    rgb = h => [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255)),
    m = rgb(pA).map(v => 1 - 0.28 * (1 - v)),
    lf = rgb(fill),
    line = 0.2126 * lf[0] * m[0] + 0.7152 * lf[1] * m[1] + 0.0722 * lf[2] * m[2],
    cover = (2 * 0.035) / (1 / 3),
    avg = L(fill) * (1 - cover) + line * cover;
  assert.ok(avg >= 0.69, `L ${avg.toFixed(3)}`);
});
