import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { PAPER_OUTLINE } from '../src/render3d/comic.js';
import { PAPIR, PAPER_TOKENS } from '../src/render3d/palette.js';

// Obrysy a barvy scény po R0 (jediný styl Papírové město). three.js moduly se v Node jen importují (vendor/three přes hook místo import map)
// a kontrolují bez GPU.
const dir = new URL('../src/render3d/', import.meta.url),
  src = n => readFileSync(new URL(n, dir), 'utf8');
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
  toon = await import('../src/render3d/toon.js'),
  scene = await import('../src/render3d/scene.js');

test('jeden grafit: staré tuše #07051a a #0b1935 nikde v src/render3d, obrys z comic.PAPER_OUTLINE', () => {
  const files = readdirSync(dir).filter(n => n.endsWith('.js'));
  for (const n of files)
    for (const old of ['#07051a', '#0b1935'])
      assert.ok(!src(n).toLowerCase().includes(old), `${n} obsahuje ${old}`);
  assert.equal(PAPER_OUTLINE.color, PAPIR.plane.outline);
  assert.equal(PAPER_OUTLINE.color, PAPER_TOKENS.graphite);
  const m = toon.outlineMaterial();
  assert.equal(m.uniforms.color.value.getHex(), new THREE.Color(PAPER_OUTLINE.color).getHex());
  assert.equal(m.uniforms.thickness.value, PAPER_OUTLINE.building);
  const st = toon.stampOutlineMaterial();
  assert.equal(st.uniforms.thickness.value, PAPER_OUTLINE.plane);
  // scene.js bere tloušťky jen z PAPER_OUTLINE (plan.comic.outline), žádná vlastní čísla
  const s = src('scene.js');
  assert.ok(!/thickness:\s*[\d.]/.test(s) && !/,\s*(2\.5|1\.7|2\.6)\)/.test(s));
  for (const k of ['building', 'detail', 'plane']) assert.ok(s.includes(`'${k}'`), k);
});

test('PLANE_SCALE: jediné číslo v plane.js, scene.js ho importuje', () => {
  const s = src('scene.js');
  assert.ok(!/const\s+PLANE_SCALE\s*=/.test(s));
  assert.match(s, /import \{[^}]*PLANE_SCALE[^}]*\} from '\.\/plane\.js'/);
});

test('scene.js bez ručních hex barev (světla z palette.js), monospace pryč z mých modulů', () => {
  assert.deepEqual(src('scene.js').match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) ?? [], []);
  for (const n of ['scene.js', 'toon.js', 'comic.js', 'index.js'])
    assert.ok(!src(n).includes('monospace'), n);
});

test('obrysy místa odhodu: userData.base (nebo původní tloušťka) × DPR při každém resize, bez kumulace', () => {
  const res = new THREE.Vector2(1280, 720),
    a = toon.outlineMaterial({ thickness: 2.2 }),
    b = toon.outlineMaterial({ thickness: 1.6 });
  b.userData.base = 1.7;
  for (const d of [2, 1.5, 1]) {
    scene.scaleOutline(a, res, d);
    scene.scaleOutline(b, res, d);
    assert.ok(
      Math.abs(a.uniforms.thickness.value - 2.2 * d) < 1e-9 &&
        Math.abs(b.uniforms.thickness.value - 1.7 * d) < 1e-9,
      `dpr ${d}`,
    );
  }
  assert.ok(a.uniforms.resolution.value.equals(res));
});
