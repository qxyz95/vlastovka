import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compact } from './helpers/compact.js';
import { registerHooks } from 'node:module';
import { ID, PLACE_W } from '../src/render3d/paper-cards.js';
import { qualityPreset } from '../src/render3d/quality.js';
import { moodAt, PAPER_KEYS } from '../src/render3d/mood.js';
import { SCREEN_METERS } from '../src/scenes.js';

// P1 Scéna Papírového města (spec research/design/06-papir-ctvrt1.md kap. 3–5, stíny 08-stiny.md S2–S3): three.js moduly se v Node jen importují
// (vendor/three přes hook místo import map) a kontrolují bez GPU: materiály, maska stínů, místa, nebe, post, kvalita a měření.
const dir = new URL('../src/render3d/', import.meta.url),
  src = n => compact(readFileSync(new URL(n, dir), 'utf8'));
registerHooks({
  resolve: (s, c, next) =>
    s === 'three'
      ? {
          url: new URL('../vendor/three/three.module.min.js', import.meta.url).href,
          shortCircuit: true,
        }
      : next(s, c),
});
const THREE = await import('three'),
  paper = await import('../src/render3d/paper.js'),
  cityMod = await import('../src/render3d/city.js'),
  sceneMod = await import('../src/render3d/scene.js');
const index = await import('../src/render3d/index.js');

const meshes = g => {
  const out = [];
  g.traverse(o => {
    if (o.isMesh) out.push(o);
  });
  return out;
};
const tris = m =>
  (m.geometry.index ? m.geometry.index.count : m.geometry.getAttribute('position').count) / 3;

test('paperMaterial: sdílené uniformy (opar, světlo, maska), zem přijímá stín, pata podle vrstvy, bez stencilu, opar po stínu', () => {
  const kit = paper.paperKit(),
    g = kit.material(ID.ground, { cutK: 0, fiber: 0.05 }),
    n = kit.material(ID.near),
    m = kit.material(ID.mid),
    f = kit.material(ID.far);
  assert.equal(kit.material(ID.near), n, 'keš');
  assert.notEqual(kit.material(ID.near, { haze: 0.5 }), n);
  for (const k of [
    'hazeLow',
    'hazeHigh',
    'L',
    'hz',
    'tMask',
    'res',
    'tint',
    'k',
    'maskOn',
    'aoOn',
    'fiberOn',
    'cut',
    'side',
  ])
    assert.equal(g.uniforms[k], n.uniforms[k], k);
  assert.deepEqual(
    [g, n, m, f].map(x => x.uniforms.recv.value),
    [1, 0, 0, 0],
  );
  assert.deepEqual(
    [g, n, m, f].map(x => x.uniforms.aoH.value),
    [0, 1.4, 2.8, 6],
  );
  for (const x of [g, n, m, f]) assert.ok(!x.stencilWrite && x.vertexColors && !x.transparent);
  const fs = n.fragmentShader;
  assert.ok(fs.indexOf('texture2D(tMask') < fs.indexOf('float h=hz.z'), 'stín před oparem (S-5)');
  // tint = #5d64a8 v lineárním RGB
  assert.equal(n.uniforms.tint.value.getHexString(), '5d64a8');
  // nálada: opar a světlo z plan.mood (čtvrť 1 ráno = světlo zezadu), síla stínu podle čtvrti
  kit.applyMood(moodAt(1.5 * SCREEN_METERS, 0));
  assert.equal(n.uniforms.hazeLow.value.getHexString(), PAPER_KEYS[1].haze.low.slice(1));
  assert.ok(n.uniforms.L.value.z < 0 && n.uniforms.L.value.x > 0);
  assert.equal(n.uniforms.k.value, 0.62);
  kit.applyMood(moodAt(9.5 * SCREEN_METERS, 0));
  assert.equal(n.uniforms.k.value, 0.8);
  kit.dispose();
});

test('kvalita: vlákna, maska a ztmavení paty podle quality.js; setQuality jen při změně', () => {
  const kit = paper.paperKit(),
    u = kit.uniforms;
  assert.equal(kit.setQuality(2), true);
  assert.equal(kit.setQuality(2), false);
  assert.equal(u.fiberOn.value, 1);
  assert.equal(u.aoOn.value, 1);
  kit.setQuality(0);
  assert.equal(u.fiberOn.value, 0);
  assert.equal(u.maskOn.value, 0);
  assert.equal(u.aoOn.value, 1);
  assert.equal(kit.quality, 0);
  kit.dispose();
});

// Náhradní renderer: zaznamená průchody masky (cíl, scéna, vrstvy kamery) bez GPU.
function fakeRenderer() {
  const log = [],
    clear = new THREE.Color(0.3, 0.2, 0.1);
  let alpha = 1,
    target = null;
  return {
    log,
    setRenderTarget(t) {
      target = t;
    },
    getClearColor(c) {
      return c.copy(clear);
    },
    getClearAlpha() {
      return alpha;
    },
    setClearColor(c, a) {
      clear.set(c);
      alpha = a;
    },
    render(scene, camera) {
      log.push({ target, layers: camera.layers.mask, bg: scene.background });
    },
    get alpha() {
      return alpha;
    },
    get clear() {
      return clear;
    },
  };
}
test('maska stínů: vrhače ve vrstvě masky, průchody podle kvality (1/3 + 2 rozmazání, 1/4 + 1, 0 = bez masky), kamera a nebe obnovené', () => {
  const kit = paper.paperKit(),
    sh = kit.shadows,
    u = kit.uniforms,
    geo = new THREE.BoxGeometry(2, 8, 1),
    card = new THREE.Mesh(geo, kit.material(ID.near)),
    c = sh.cast(card);
  assert.equal(c.geometry, geo);
  assert.ok(c.layers.isEnabled(paper.MASK_LAYER) && !c.layers.isEnabled(0));
  assert.equal(c.frustumCulled, false);
  const camera = new THREE.PerspectiveCamera(),
    hidden = new THREE.Layers();
  hidden.set(0);
  assert.ok(!c.layers.test(hidden), 'hlavní kamera vrhač nevidí');
  const p = sh.castPlane(geo);
  assert.equal(p.material.uniforms.isPlane.value, 1);
  assert.equal(c.material.uniforms.isPlane.value, 0);
  assert.equal(c.material.blendEquation, THREE.MaxEquation);
  const scene = new THREE.Scene(),
    bg = new THREE.Texture();
  scene.background = bg;
  scene.add(card, c);
  sh.resize(1200, 675);
  for (const [level, w, h, passes] of [
    [2, 400, 225, 3],
    [1, 300, 169, 2],
  ]) {
    kit.setQuality(level);
    const r = fakeRenderer();
    assert.equal(sh.render(r, scene, camera), passes);
    assert.equal(r.log.length, passes);
    assert.equal(r.log[0].target, sh.targets[0]);
    assert.equal(r.log[0].layers, 1 << paper.MASK_LAYER);
    assert.equal(r.log[0].bg, null, 'maska bez nebe');
    assert.equal(camera.layers.mask, 1);
    assert.equal(scene.background, bg);
    assert.equal(r.alpha, 1);
    assert.equal(r.clear.r, 0.3);
    assert.deepEqual([sh.targets[0].width, sh.targets[0].height], [w, h]);
    assert.equal(u.maskOn.value, 1);
    assert.ok(u.tMask.value);
    assert.deepEqual([u.res.value.x, u.res.value.y], [1200, 675]);
  }
  kit.setQuality(0);
  const r = fakeRenderer();
  assert.equal(sh.render(r, scene, camera), 0);
  assert.equal(r.log.length, 0);
  assert.equal(u.maskOn.value, 0);
  kit.dispose();
  assert.equal(u.tMask.value, null);
  geo.dispose();
});

test('papírové místo: zem + 3 vrstvy karet + 3 vrhače, rozpočet ≤ 14 draw calls a ≤ 15 tis. △ hlavního průchodu na každém z 16 míst', t => {
  const kit = paper.paperKit();
  let maxCalls = 0,
    maxTris = 0;
  for (let i = 0; i < 16; i++) {
    const { group, geos } = cityMod.buildPaperPlace(cityMod.paperLayers(i), kit),
      all = meshes(group),
      main = all.filter(m => m.layers.isEnabled(0)),
      mask = all.filter(m => m.layers.isEnabled(paper.MASK_LAYER));
    const tri = main.reduce((s, m) => s + tris(m), 0);
    maxCalls = Math.max(maxCalls, main.length);
    maxTris = Math.max(maxTris, tri);
    assert.ok(main.length <= 14 && tri <= 15000, `místo ${i}: ${main.length} DC, ${tri} △`);
    assert.equal(main[0].userData.layer, ID.ground);
    assert.equal(mask.length, main.length - 1, 'vrhá každá vrstva kromě země');
    for (const m of mask)
      assert.ok(
        main.some(x => x.geometry === m.geometry),
        'sdílená geometrie',
      );
    for (const m of main) assert.ok(m.geometry.boundingSphere, 'bounding sphere pro culling');
    t.diagnostic(`místo ${i}: ${main.length} DC (+${mask.length} do masky), ${tri} △`);
    geos.forEach(g => g.dispose());
  }
  t.diagnostic(`max ${maxCalls} DC, ${maxTris} △`);
  kit.dispose();
});

test('paperLayers: místa jen v lokálních x, kopce navazují přes hranice míst, Dílna (0s) má zem i kopce 600 m doleva', () => {
  const a = cityMod.paperLayers(0, '0r'),
    b = cityMod.paperLayers(0, '0s'),
    c = cityMod.paperLayers(1);
  const gx = l => Math.min(...l.ground.map(g => g.x));
  assert.equal(gx(a), -1);
  assert.equal(gx(b), -601);
  assert.ok(b.far.length > a.far.length, 'kopce vlevo od Dílny');
  // kopec patří právě jednomu místu (podle středu)
  const world = (l, i) =>
    l.far.filter(h => h.shape === 'pyr' && h.z === -560).map(h => +(h.x + i * PLACE_W).toFixed(3));
  const ha = world(a, 0),
    hc = world(c, 1);
  assert.ok(ha.length && hc.length);
  for (const x of hc) assert.ok(!ha.includes(x));
  assert.deepEqual(cityMod.paperLayers(5), cityMod.paperLayers(5), 'deterministické');
});

test('createCity: keš míst, materiály z kitu, dispose uvolní geometrie (R0: jediná cesta, bez style)', () => {
  const kit = paper.paperKit(),
    ctx = { scene: new THREE.Scene(), materials: { paper: kit }, mood: () => ({}), reduced: false };
  const city = cityMod.createCity(ctx),
    e = city.buildChunk(2, 2);
  assert.equal(city.buildChunk(2, 2), e);
  for (const m of meshes(e.group))
    assert.ok(
      m.material === kit.shadows.materials.card || 'recv' in m.material.uniforms,
      'materiál z kitu',
    );
  assert.ok(meshes(e.group).every(m => !m.material.stencilWrite));
  let disposed = 0;
  for (const g of e.geos) g.addEventListener('dispose', () => disposed++);
  city.dispose();
  assert.equal(disposed, e.geos.length);
  kit.dispose();
  // místo odhodu (0s) bez bloku staré Dílny (shop) a bez cedulí
  const k2 = paper.paperKit(),
    c2 = cityMod.createCity({ ...ctx, materials: { paper: k2 } }),
    e0 = c2.buildChunk(0, 0);
  assert.ok(meshes(e0.group).length > 0);
  c2.dispose();
  k2.dispose();
});

test('nebe: přechod podle skyAt, slunce se září; překreslí se jen při změně nad práh nebo velikosti, staré textury uvolní', () => {
  const calls = [];
  const ctx2d = {
    fillRect() {
      calls.push('rect');
    },
    beginPath() {},
    arc() {},
    fill() {
      calls.push('fill');
    },
    set fillStyle(v) {},
    set globalAlpha(v) {},
    createLinearGradient() {
      return {
        stops: [],
        addColorStop(o, c) {
          this.stops.push([o, c]);
          calls.push(['stop', o, c]);
        },
      };
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
  };
  const make = (w, h) => ({ width: w, height: h, getContext: () => ctx2d }),
    sky = paper.paperSky({ make }),
    m = moodAt(1.5 * SCREEN_METERS, 0);
  const t1 = sky.paint(m, 1280, 720);
  assert.equal(sky.draws, 1);
  assert.deepEqual(
    calls.filter(c => c[0] === 'stop').map(c => c[1]),
    m.skyAt,
  );
  assert.equal(t1.image.width, 1024);
  assert.equal(t1.image.height, 576);
  assert.equal(t1.colorSpace, THREE.SRGBColorSpace);
  assert.equal(sky.paint(m, 1280, 720), t1);
  assert.equal(sky.paint({ ...m }, 1280, 720), t1);
  assert.equal(sky.draws, 1, 'stejná nálada nekreslí');
  assert.equal(
    paper.skyDelta(m, {
      ...m,
      sky: [
        m.sky[0].replace(/..$/, v => (parseInt(v, 16) ^ 1).toString(16).padStart(2, '0')),
        ...m.sky.slice(1),
      ],
    }),
    1,
  );
  const far = moodAt(9.5 * SCREEN_METERS, 0);
  sky.paint(far, 1280, 720);
  assert.equal(sky.draws, 2);
  let gone = 0;
  t1.addEventListener('dispose', () => gone++);
  const t2 = sky.paint(far, 640, 360);
  assert.notEqual(t2, t1);
  assert.equal(gone, 1);
  assert.equal(sky.draws, 3);
  assert.ok(paper.skyDelta(null, m) === Infinity);
  sky.dispose();
  // večer bez slunce: jen přechod
  calls.length = 0;
  paper.drawSky(ctx2d, moodAt(13.5 * SCREEN_METERS, 0), 100, 50);
  assert.ok(!calls.includes('fill'));
});

test('post: tint a zrno podle bible (zrno vypíná kvalita 0), výstup neprůhledný, bez rozmazání', () => {
  const p = paper.paperPost();
  assert.equal(p.mat.uniforms.tint.value.getHexString(), 'fffaf2');
  assert.equal(p.mat.uniforms.grain.value, 0.035);
  assert.equal(p.mat.uniforms.vignette.value, 0.14);
  p.setGrain(false);
  assert.equal(p.mat.uniforms.grain.value, 0);
  p.setGrain(qualityPreset(2).grain);
  assert.equal(p.mat.uniforms.grain.value, 0.035);
  assert.ok(p.mat.fragmentShader.includes(',1.);}'));
  assert.ok(!/blur|bloom/i.test(p.mat.fragmentShader));
  p.dispose();
});

test('planeContrast: změněné pixely = vlaštovka, výplň a obrys proti okolí, okno bez změny neprojde', () => {
  const n = 9,
    mk = f => {
      const b = new Uint8Array(n * n * 4);
      for (let i = 0; i < n * n; i++) {
        const [r, g, bl] = f(i % n, Math.floor(i / n));
        b.set([r, g, bl, 255], i * 4);
      }
      return b;
    };
  const sky = [166, 208, 232],
    B = mk(() => sky),
    A = mk((x, y) =>
      x >= 3 && x <= 5 && y >= 3 && y <= 5
        ? x === 4 && y === 4
          ? [255, 255, 255]
          : [42, 38, 34]
        : sky,
    );
  const r = paper.planeContrast(A, B);
  assert.equal(r.px, 9);
  assert.equal(r.edge, '#2a2622');
  assert.equal(r.fill, '#ffffff');
  assert.equal(r.bg, '#a6d0e8');
  assert.ok(r.edgeVsBg >= 6 && r.fillVsBg < 2 && r.pass);
  assert.equal(paper.planeContrast(B, B).pass, false);
});

test('index: kvalita jen dolů podle P95 v letu, pokles až mimo let; Dílna a výsledek (30 fps) se neměří', () => {
  const q = index.qualityTracker(2);
  let now = 1000;
  for (let i = 0; i < 60; i++) q.frame((now += 50), 'flight'); // 3 s po 50 ms
  assert.equal(q.level, 2, 'za letu se nesnižuje');
  assert.ok(q.over >= 2);
  assert.equal(q.frame((now += 33), 'landed'), 1, 'po dopadu o stupeň dolů');
  for (let i = 0; i < 200; i++) q.frame((now += 34), 'workshop');
  assert.equal(q.level, 1, '30 fps v Dílně nesnižuje');
  for (let i = 0; i < 200; i++) q.frame((now += 16.7), 'aim');
  assert.equal(q.level, 1);
  for (let i = 0; i < 60; i++) q.frame((now += 50), 'aim');
  assert.equal(q.level, 0, 'při míření (mimo let) hned');
  for (let i = 0; i < 300; i++) q.frame((now += 60), 'aim');
  assert.equal(q.level, 0, 'nikdy pod 0, nikdy nahoru');
  const q2 = index.qualityTracker(2);
  for (let i = 0; i < 20; i++) q2.frame((now += 50), 'flight');
  q2.frame((now += 33), 'landed');
  assert.equal(q2.level, 2, '1 s nad mezí nestačí');
  assert.equal(q2.over, 0);
  assert.deepEqual(index.visualFor({ state: 'flight' }, 800, 1), {
    state: 'flight',
    cssWidth: 800,
    quality: 1,
  });
});

test('R0 jediný styl: scéna jen papír (bez stínových map, mlhy, hvězd a cyber post-procesu), index bez přepínání stylu', () => {
  const s = src('scene.js'),
    ix = src('index.js');
  assert.ok(
    s.includes(
      "new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'})",
    ),
    'papírový renderer (MSAA v render targetu)',
  );
  assert.ok(
    s.includes('new THREE.WebGLRenderTarget(4,4,{samples:4,depthBuffer:true})') &&
      s.includes('renderer.shadowMap.enabled=false'),
  );
  assert.ok(/createScene\(canvas,\{dpr=1\}=\{\}\)/.test(s));
  assert.ok(ix.includes('createScene(gl,{dpr:r.dpr()})'));
  for (const old of [
    'THREE.Fog',
    'postPass',
    'skyPainter',
    'buildingMaterial',
    'signTexture',
    'windowTexture',
    'castShadow=',
    'PointsMaterial',
    'cityColors',
  ])
    assert.ok(!s.includes(old), old);
  for (const n of [
    'scene.js',
    'index.js',
    'frame.js',
    'city.js',
    'plane.js',
    'workshop.js',
    'life3d.js',
    'ui-layer.js',
    'mood.js',
    'comic.js',
    'palette.js',
    'pose.js',
    'toon.js',
  ])
    assert.ok(!/style\s*===?\s*'(cyber|papir)'|CYBER|styleOf/.test(src(n)), n + ': větev stylu');
  // papír: žádné stínové mapy ani stencil, žádné hex barvy mimo palety (strážní test leftovers)
  assert.ok(!/stencil/i.test(src('paper.js') + src('city.js') + s));
});
