import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import {
  PAPIR,
  PLANE_PAPER,
  PLANE_PAPER_IDS,
  PAPER_TOKENS,
  multiply,
} from '../src/render3d/palette.js';
import { paperKindOf, planFrame } from '../src/render3d/frame.js';
import { NUMBERS } from '../src/atlas-numbers.js';
import { PROGRESSION } from '../src/progression-numbers.js';
import { maxLevel } from '../src/gear.js';
import { planeShape } from '../src/render3d/geometry.js';

// G1: druhy papíru na vlaštovce (bible 05 kap. 17.3). plane.js a workshop.js jsou three.js moduly: 'three' → vendor jako import map.
const THREE_URL = new URL('../vendor/three/three.module.min.js', import.meta.url).href;
registerHooks({
  resolve: (spec, ctx, next) =>
    spec === 'three' ? { url: THREE_URL, shortCircuit: true } : next(spec, ctx),
});
globalThis.document ??= {
  createElement: () => ({
    width: 0,
    height: 0,
    getContext: () => new Proxy({}, { get: () => () => {}, set: () => true }),
  }),
};
const THREE = await import('three');
const { createPlane, outlineScale, planeMaterial } = await import('../src/render3d/plane.js');
const { createWorkshop } = await import('../src/render3d/workshop.js');
const ctx = () => ({ planeHull: new THREE.MeshBasicMaterial(), palette: PAPIR });
const lum = h => {
  const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  return Math.max(...c);
};

test('G1: paper kind from the Paper level (0 → copy, 1–3 copy, 4–6 kraft, 7–9 washi, 10–12 foil) matches gear.js tiers', () => {
  const per = PROGRESSION.workshop.paper.perTier;
  assert.equal(per, 3);
  assert.equal(maxLevel('paper'), 12);
  assert.deepEqual(NUMBERS.paper.kinds, ['copy', 'kraft', 'washi', 'neon']);
  assert.deepEqual(PLANE_PAPER_IDS, NUMBERS.paper.kinds, 'renderer ids = game paper kinds');
  const want = [
    'copy',
    'copy',
    'copy',
    'copy',
    'kraft',
    'kraft',
    'kraft',
    'washi',
    'washi',
    'washi',
    'neon',
    'neon',
    'neon',
  ];
  for (let l = 0; l <= 12; l++) assert.equal(paperKindOf(l), want[l], `level ${l}`);
  assert.equal(paperKindOf(99), 'neon');
  for (const v of [undefined, null, -3, NaN, 'gold', {}]) assert.equal(paperKindOf(v), 'copy');
  for (const k of PLANE_PAPER_IDS) assert.equal(paperKindOf(k), k, 'preview: kind id directly');
});

test('G1: planFrame passes the kind to the flying plane and the plane in hand', () => {
  assert.equal(planFrame({ visual: { state: 'aim' } }).hand.paper, 'copy');
  assert.equal(planFrame({ visual: { state: 'aim', paper: 8 } }).hand.paper, 'washi');
  assert.equal(planFrame({ visual: { state: 'workshop', paper: 'kraft' } }).hand.paper, 'kraft');
  const f = { x: 40, y: 20, vx: 20, vy: 0, t: 1, landed: false, events: [] };
  assert.equal(planFrame({ f, visual: { state: 'flight', paper: 12 } }).plane.paper, 'neon');
});

test('G1: bible 17.3 tokens: sheet tones, under = sheet × planeUnder, graphite outline 2.6 (Kraft 2.9), L ≥ 0.69, no role colours', () => {
  const B = { copy: '#ffffff', kraft: '#ead7b5', washi: '#fbe8cc', neon: '#e9edf2' };
  const ROLE = [PAPER_TOKENS.tomato, PAPER_TOKENS.mustard, PAPER_TOKENS.teal, PAPER_TOKENS.cobalt];
  for (const [k, P] of Object.entries(PLANE_PAPER)) {
    assert.equal(P.fill, B[k], k);
    assert.equal(P.under, multiply(P.fill, '#cdd3e3'), k);
    assert.ok(lum(P.fill) >= 0.69, k);
    assert.equal(P.outlinePx, k === 'kraft' ? 2.9 : 2.6, k);
    for (const c of [...P.pattern, P.crease]) assert.ok(!ROLE.includes(c), `${k} ${c}`);
  }
  assert.equal(PLANE_PAPER.copy.under, PAPIR.plane.under, 'copy = today’s plane');
  assert.deepEqual(PLANE_PAPER.copy.pattern.slice(0, 2), ['#7f9ed6', '#b5503c']);
  assert.deepEqual(PLANE_PAPER.kraft.pattern, ['#9c7a55', '#b5503c', '#3d4f7a']);
  assert.equal(PLANE_PAPER.kraft.crease, PAPER_TOKENS.kraftDark);
  assert.ok(PLANE_PAPER.kraft.dash, 'Kraft crease is a dashed stitch');
  assert.equal(PLANE_PAPER.washi.pattern[0], '#3d4f7a');
  assert.deepEqual(PLANE_PAPER.neon.pattern, ['#cfe2ec', '#ffe0e8', '#fff0b0']);
  assert.ok(Math.abs(outlineScale('kraft') - 2.9 / 2.6) < 1e-9);
  assert.equal(outlineScale('washi'), 1);
});

test('G1: same triangles and draw calls on every kind; switching repaints in place (no new geometry or material)', () => {
  const pl = createPlane(ctx()),
    p = pl.current,
    tris = planeShape('dart').triangles,
    geo = p.mesh.geometry,
    mat = p.mesh.material,
    shift0 = p.hull.geometry.attributes.shift.array[0],
    col = geo.attributes.color.array;
  assert.equal(geo.attributes.position.count, tris * 3);
  for (const k of PLANE_PAPER_IDS) {
    pl.apply({ x: 0, y: 0, angle: 0, paper: k });
    assert.equal(pl.current, p, 'same plane object');
    assert.equal(p.mesh.geometry, geo);
    assert.equal(p.mesh.material, mat);
    assert.equal(p.mesh.geometry.attributes.color.array, col);
    assert.equal(p.mesh.geometry.attributes.position.count, tris * 3, `${k}: △ unchanged`);
    assert.equal(
      p.roll.children.filter(o => o.isMesh || o.isLine).length,
      3,
      'fill, outline, crease',
    );
    assert.equal(mat.userData.paper.pKind.value, PLANE_PAPER_IDS.indexOf(k));
    const fill = new THREE.Color(PLANE_PAPER[k].fill);
    assert.ok(
      Math.abs(col[0] - fill.r) < 1e-6 ||
        Math.abs(col[0] - new THREE.Color(PLANE_PAPER[k].under).r) < 1e-6,
    );
    assert.equal(p.crease.material.color.getHexString(), PLANE_PAPER[k].crease.slice(1));
    const sh = p.hull.geometry.attributes.shift.array[0];
    assert.ok(Math.abs(sh - shift0 * outlineScale(k)) < 1e-6, `${k}: outline shift`);
    assert.equal(p.crease.material.gapSize > 0, k === 'kraft');
  }
  pl.apply({ x: 0, y: 0, angle: 0, paper: 'nonsense' });
  assert.equal(p.kind, 'copy');
  // model change keeps the kind
  pl.apply({ x: 0, y: 0, angle: 0, paper: 'washi' });
  pl.apply({ x: 0, y: 0, angle: 0, paper: 'washi', model: 'glider' });
  assert.equal(pl.current.kind, 'washi');
  assert.equal(pl.current.mesh.material.userData.paper.pKind.value, 2);
  assert.equal(
    pl.current.mesh.geometry.attributes.position.count,
    planeShape('glider').triangles * 3,
  );
});

test('G1: paper material is one MeshBasic with vertex colours; shader patch injects the pattern, no textures, no time uniform', () => {
  const m = planeMaterial('neon'),
    sh = {
      uniforms: {},
      vertexShader:
        '#include <common>\nvoid main() {\n#include <project_vertex>\n#include <fog_vertex>\n}',
      fragmentShader: 'void main() {\n#include <color_fragment>\n}',
    };
  assert.ok(m.isMeshBasicMaterial && m.vertexColors && !m.map);
  m.onBeforeCompile(sh);
  assert.match(sh.fragmentShader, /diffuseColor\.rgb=paperPattern\(diffuseColor\.rgb\)/);
  assert.match(sh.vertexShader, /vPL=position/);
  assert.equal(sh.uniforms.pKind, m.userData.paper.pKind, 'shared uniform objects');
  assert.ok(
    !/time/i.test(Object.keys(sh.uniforms).join()),
    'foil changes only with the view angle',
  );
  assert.ok(!/time/.test(sh.fragmentShader));
  m.dispose();
});

test('G1: the plane in hand (workshop.js) follows plan.hand.paper and keeps 2.6/2.9 px outline', () => {
  const w = createWorkshop(null, { model: 'dart' }),
    plane = w.userData.plane,
    meshes = [];
  plane.traverse(o => o.isMesh && !o.material.isShaderMaterial && meshes.push(o));
  const fill = meshes[0],
    hand = { dx: 0, dy: 0, angle: 0, squash: [1, 1], model: 'dart' };
  w.update(null, { ...hand, paper: 'kraft' });
  assert.equal(fill.material.userData.paper.pKind.value, 1);
  const kraft = new THREE.Color(PLANE_PAPER.kraft.fill);
  const col = fill.geometry.attributes.color.array;
  assert.ok([...col].some((v, i) => i % 3 === 0 && Math.abs(v - kraft.r) < 1e-6));
  w.update(null, { ...hand, paper: 'washi', model: 'glider' });
  assert.equal(fill.material.userData.paper.pKind.value, 2);
  const c2 = fill.geometry.attributes.color.array,
    washi = new THREE.Color(PLANE_PAPER.washi.fill);
  assert.ok(
    [...c2].some((v, i) => i % 3 === 0 && Math.abs(v - washi.r) < 1e-6),
    'new model repainted',
  );
  w.update(null, { ...hand });
  assert.equal(fill.material.userData.paper.pKind.value, 0, 'no paper → copy');
  w.dispose();
});
