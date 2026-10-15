import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INTRO_SHOT, LAUNCH } from '../src/render3d/models/launch-site.js';
import {
  INTRO,
  INTRO_FROM,
  introAfter,
  introPress,
  introProgress,
  introDone,
  introVariant,
  introShot,
  introTitleAlpha,
  introIdle,
} from '../src/render3d/intro.js';
import { restCamera, project, HAND, aimWidth, REST as AIM } from '../src/render3d/pose.js';
import { planFrame } from '../src/render3d/frame.js';
import { drawIntro, drawUi } from '../src/render3d/ui-layer.js';
import { PAPIR } from '../src/render3d/palette.js';
import { setLang } from '../src/i18n.js';
import en from '../src/locales/en.js';
import cs from '../src/locales/cs.js';

// H1 Úvodní záběr (research/plan-hratelnost/03-art.md kap. 2 a 6).
const near = (a, b, eps) => Math.abs(a - b) <= eps;
const VARIANTS = [
  ['desktop', 16 / 9, INTRO_SHOT.width, INTRO_SHOT.at, INTRO_SHOT.text],
  ['telefon na šířku', 932 / 430, INTRO_SHOT.landWidth, INTRO_SHOT.landAt, INTRO_SHOT.landText],
  [
    'telefon na výšku',
    375 / 667,
    INTRO_SHOT.portraitWidth,
    INTRO_SHOT.portraitAt,
    INTRO_SHOT.portraitText,
  ],
];
const H = LAUNCH.house,
  RIDGE = [
    (H.x0 + H.x1) / 2,
    LAUNCH.wall + H.ground + H.floors * 3 + H.knee + H.rise,
    LAUNCH.front,
  ];

test('INTRO_SHOT: 30 m (na výšku 18 m), sklon +2°, vlaštovka v ruce 0,5 m', () => {
  assert.deepEqual(
    [INTRO_SHOT.width, INTRO_SHOT.portraitWidth, INTRO_SHOT.landWidth, INTRO_SHOT.pitch],
    [30, 18, 30, 2],
  );
  assert.deepEqual([...INTRO_SHOT.at], [0.64, 0.66]);
  assert.deepEqual([...INTRO_SHOT.portraitAt], [0.8, 0.62]);
  assert.deepEqual([...INTRO_SHOT.landAt], [0.66, 0.64]);
  assert.equal(INTRO_SHOT.planeInHand, 0.5);
  assert.equal(INTRO_SHOT.fov, 20);
});

test('INTRO_SHOT promítne ruku na at ± 1 % (desktop, na šířku, na výšku); nápis leží v nebi nad hřebenem', () => {
  for (const [name, aspect, width, at, text] of VARIANTS) {
    const v = introVariant(aspect);
    assert.equal(v.width, width, name);
    assert.deepEqual(v.at, at, name);
    const cam = restCamera(aspect, width, { pitch: INTRO_SHOT.pitch, at }),
      [sx, sy] = project(cam, [HAND.x, HAND.y, HAND.z], aspect);
    assert.ok(near(sx / 640, at[0], 0.01) && near(sy / 360, at[1], 0.01), `${name}: ${sx}, ${sy}`);
    assert.ok(near(cam.width, width, 1e-9), name);
    // hřeben střechy pod pásem nápisu, ruka (dítě) pod ním a mimo něj
    const [, ry] = project(cam, RIDGE, aspect);
    assert.ok(ry / 360 > text[1], `${name}: hřeben ${(ry / 360).toFixed(2)} pod pásem ${text[1]}`);
    assert.ok(at[1] - 0.16 > text[1], `${name}: pás nápisu nad dítětem`);
  }
});

test('ve hře: úvod před stiskem drží ruku na INTRO_SHOT.at (16 : 9), 30 m, sklon +2°, dítě v klidu, bez mířidel', () => {
  const p = planFrame({
    state: 'aim',
    visual: { state: 'aim', cssWidth: 1280, intro: { since: null }, aim: { angle: 15 } },
  });
  assert.ok(
    near(p.view.px / 640, INTRO_SHOT.at[0], 0.01) && near(p.view.py / 360, INTRO_SHOT.at[1], 0.01),
  );
  assert.ok(near(p.camera.width, 30, 1e-6));
  assert.equal(p.camera.pitch, 2);
  assert.equal(p.kid.phase, 'idle');
  assert.equal(p.kid.idle, 1);
  assert.equal(p.ui.aim, null);
  assert.equal(p.ui.intro.alpha, 1);
  assert.deepEqual(p.ui.intro.band, INTRO_SHOT.text);
  // vlaštovka v ruce stejně velká jako při míření (0,5 m), ne podle šířky 30 m
  const aim = planFrame({ state: 'aim', visual: { state: 'aim', cssWidth: 1280 } });
  assert.equal(p.hand.scale, aim.hand.scale);
});

test('průběh jízdy je čistý: u = 0 úvod, u = 1 míření; šířka logaritmicky, kotva a sklon lineárně, ease in-out', () => {
  const aim = { width: 16, pitch: -8, at: [148 / 640, 258 / 360] };
  for (const [name, aspect] of VARIANTS) {
    const v = introVariant(aspect),
      a = introShot(0, { aspect, aim }),
      b = introShot(1, { aspect, aim });
    assert.deepEqual([a.width, a.at, a.pitch], [v.width, [...v.at], 2], name);
    assert.ok(near(b.width, 16, 1e-9) && near(b.pitch, -8, 1e-9), name);
    assert.ok(near(b.at[0], aim.at[0], 1e-12) && near(b.at[1], aim.at[1], 1e-12), name);
  }
  // ease(0,5) = 0,5: geometrický průměr šířek, aritmetický průměr kotvy a sklonu
  const m = introShot(0.5, { aim });
  assert.ok(near(m.width, Math.sqrt(30 * 16), 1e-9));
  assert.ok(near(m.pitch, -3, 1e-9));
  assert.ok(near(m.at[0], (0.64 + aim.at[0]) / 2, 1e-12));
  // ease in-out: pomalý rozjezd i dojezd, šířka klesá monotónně
  const W = Array.from({ length: 61 }, (_, i) => introShot(i / 60, { aim }).width);
  assert.ok(W.every((w, i) => !i || w <= W[i - 1]));
  assert.ok(W[0] - W[1] < (W[30] - W[31]) / 4 && W[59] - W[60] < (W[30] - W[31]) / 4);
  // stejný vstup = stejný výstup
  assert.deepEqual(introShot(0.37, { aim }), introShot(0.37, { aim }));
  assert.equal(INTRO.dur, 0.6);
  assert.equal(introProgress(null), 0);
  assert.equal(introProgress(0.3), 0.5);
  assert.equal(introProgress(0.6), 1);
  assert.equal(introProgress(5), 1);
});

test('jízda ve hře plynule dojede do záběru míření a míření pak navazuje bez skoku', () => {
  const vis = (since, extra = {}) => ({
      state: 'aim',
      cssWidth: 1280,
      clock: 10 + (since ?? 0),
      intro: since === undefined ? null : { since },
      ...extra,
    }),
    aim = planFrame({ state: 'aim', visual: vis(undefined, { clock: 11 }) });
  let prev = planFrame({ state: 'aim', visual: vis(null) });
  const widths = [prev.camera.width];
  for (let i = 0; i <= 36; i++) {
    prev = planFrame({ state: 'aim', visual: vis(i / 60), prev });
    widths.push(prev.camera.width);
  }
  assert.ok(
    widths.every((w, i) => !i || w <= widths[i - 1] + 1e-9),
    'šířka jen klesá',
  );
  assert.ok(near(prev.camera.width, aim.camera.width, 1e-6));
  assert.ok(near(prev.view.px, 148, 0.01) && near(prev.view.py, 258, 0.01));
  assert.equal(prev.camera.pitch, AIM.pitch);
  assert.equal(prev.kid.phase, 'aim');
  assert.equal(prev.ui.intro, null, 'po dojetí nápis ani úvod nejsou');
  const next = planFrame({ state: 'aim', visual: vis(undefined, { clock: 10.7 }), prev });
  assert.ok(near(next.camera.width, prev.camera.width, 1e-9) && near(next.view.px, 148, 1e-6));
});

test('vstup se přijímá hned: stisk spustí jízdu i nabíjení, mířidla se kreslí od promítnuté ruky', () => {
  assert.deepEqual(introPress({ pressed: null }, 4), { pressed: 4 });
  assert.deepEqual(introPress({ pressed: 4 }, 9), { pressed: 4 }, 'další stisk jízdu neposouvá');
  assert.equal(introPress(null, 4), null);
  const p = planFrame({
    state: 'aim',
    visual: {
      state: 'aim',
      cssWidth: 1280,
      intro: { since: 0 },
      charge: 0.4,
      aim: { angle: 20, held: true, charge: 0.4 },
    },
  });
  assert.equal(p.kid.phase, 'charge');
  assert.equal(p.kid.charge, 0.4);
  assert.deepEqual(p.ui.aim, { angle: 20, held: true, charge: 0.4 });
  assert.ok(near(p.camera.width, 30, 1e-6), 'jízda začíná z úvodu');
  assert.ok(near(p.view.px / 640, 0.64, 0.01), 'view(null) = promítnutá ruka, mířidla z ní');
  assert.equal(introDone({ pressed: 1 }, 1.3), false);
  assert.equal(introDone({ pressed: 1 }, 1.6), true);
  assert.equal(introDone({ pressed: null }, 99), false, 'úvod sám neodjíždí');
});

test('dítě: klid → míření za 0,2 s kolem poloviny jízdy', () => {
  assert.equal(introIdle(0), 1);
  assert.equal(introIdle(0.3), 1);
  assert.equal(introIdle(0.5), 0.5);
  assert.equal(introIdle(0.7), 0);
  assert.equal(introIdle(1), 0);
  const half = INTRO.kid / INTRO.dur / 2;
  assert.ok(introIdle(0.5 - half + 1e-3) < 1 && introIdle(0.5 + half - 1e-3) > 0);
});

test('reduced motion a Calm camera: hned u = 1 (střih), nápis zmizí hned', () => {
  assert.equal(introProgress(0, true), 1);
  assert.equal(introTitleAlpha(0, true), 0);
  assert.equal(introTitleAlpha(null, true), 1, 'před stiskem nápis stojí i s reduced motion');
  assert.equal(introTitleAlpha(0), 1);
  assert.ok(near(introTitleAlpha(0.1), 0.5, 1e-12));
  assert.equal(introTitleAlpha(INTRO.fade), 0);
  assert.equal(introDone({ pressed: 2 }, 2, true), true);
  for (const extra of [{ reduced: true }, { settings: { calm: true } }]) {
    const base = { state: 'aim', cssWidth: 1280, clock: 3, ...extra },
      cut = planFrame({ state: 'aim', visual: { ...base, intro: { since: 0 } } }),
      aim = planFrame({ state: 'aim', visual: base });
    assert.deepEqual(cut.camera.position, aim.camera.position);
    assert.equal(cut.ui.intro, null);
    assert.equal(cut.kid.idle, 0);
  }
  // úvod s reduced motion stojí: dítě nedýchá (kidPose bez času)
  const r = planFrame({
    state: 'aim',
    visual: { state: 'aim', reduced: true, clock: 7, intro: { since: null } },
  });
  assert.equal(r.kid.phase, 'idle');
  assert.equal(r.kid.bob, 0);
});

test('úvod po načtení a po Dílně, Atlasu nebo menu; „Hodit znovu“ ho přeskočí', () => {
  for (const from of ['load', 'workshop', 'atlas', 'menu'])
    assert.deepEqual(introAfter(from), { pressed: null }, from);
  assert.deepEqual([...INTRO_FROM], ['load', 'workshop', 'atlas', 'menu']);
  assert.equal(introAfter('throwAgain'), null);
  assert.equal(introAfter(undefined), null);
  // ui.js přes screens.js (U5): Hodit znovu = událost 'throwAgain' → Domov bez úvodu; načtení ('loaded') a smazání postupu
  // s úvodem; zavření panelu zpět na Domov = úvod podle zavřeného panelu (Dílna, Atlas, Menu).
  const ui = readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8');
  assert.match(ui, /\$\('retry'\)\.onclick = \(\) => go\(\{ type: 'throwAgain' \}\)/);
  assert.match(ui, /function prepare\(from = 'throwAgain'\)/);
  assert.match(
    ui,
    /prepare\(e\.type === 'loaded' \|\| e\.type === 'resetProgress' \? 'load' : 'throwAgain'\)/,
  );
  assert.match(ui, /intro = introAfter\(was\.panels\.at\(-1\)\) \?\? intro/);
  assert.match(ui, /\r?\ngo\(\{ type: 'loaded' \}\);\r?\n/);
  // úvod jen při míření: Dílna ani let ho nekreslí
  const w = planFrame({ state: 'workshop', visual: { state: 'workshop', intro: { since: null } } });
  assert.equal(w.ui.intro, null);
});

test('nápis má klíče v EN i CS a kreslí se grafitově na střed v pásu nad hřebenem', () => {
  for (const k of ['prompt.throw', 'prompt.hintTouch', 'prompt.hintMouse'])
    assert.ok(en[k] && cs[k] && en[k] !== cs[k], k);
  const ctx = () => {
    const texts = [];
    let st = {};
    return {
      texts,
      canvas: { width: 1280 },
      save() {},
      restore() {},
      setTransform() {},
      clearRect() {},
      fillText(s, x, y) {
        texts.push({ s, x, y, ...st, color: this.fillStyle, alpha: this.globalAlpha });
      },
      set font(f) {
        st = { ...st, font: f };
      },
      get font() {
        return st.font;
      },
    };
  };
  for (const [lang, D] of [
    ['en', en],
    ['cs', cs],
  ]) {
    setLang(lang);
    for (const touch of [false, true]) {
      const c = ctx();
      drawIntro(c, { alpha: 1, band: INTRO_SHOT.text, touch });
      assert.deepEqual(
        c.texts.map(x => x.s),
        [D['prompt.throw'], D[touch ? 'prompt.hintTouch' : 'prompt.hintMouse']],
      );
      for (const x of c.texts) {
        assert.equal(x.x, 320);
        assert.equal(x.color, PAPIR.aim.text);
        assert.ok(x.y >= INTRO_SHOT.text[0] * 360 && x.y <= INTRO_SHOT.text[1] * 360);
      }
    }
  }
  setLang('en');
  const c = ctx();
  drawIntro(c, { alpha: 0, band: INTRO_SHOT.text });
  assert.equal(c.texts.length, 0, 'po zmizení nic');
  // drawUi kreslí nápis z plan.ui.intro, bez něj ne
  const a = ctx(),
    b = ctx();
  drawUi(a, { ui: { intro: { alpha: 1, band: INTRO_SHOT.text } } });
  drawUi(b, { ui: {} });
  assert.equal(a.texts[0].s, en['prompt.throw']);
  assert.equal(b.texts.length, 0);
});

test('úvod v aimWidth: cíl jízdy je živý záběr míření (i s přisunutím při nabíjení)', () => {
  const p = planFrame({
    state: 'aim',
    visual: { state: 'aim', cssWidth: 640, intro: { since: 0.6 - 1e-9 }, charge: 1 },
  });
  assert.ok(near(p.camera.width, aimWidth(640) * (1 - AIM.push), 1e-3));
});
