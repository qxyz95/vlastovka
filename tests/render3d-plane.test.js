import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { PAPIR } from '../src/render3d/palette.js';
import { PAPER_TRAIL } from '../src/render3d/paper-cards.js';

// plane.js is a three.js module: map the bare 'three' import to the vendored build (as the import map does in the browser).
const THREE_URL = new URL('../vendor/three/three.module.min.js', import.meta.url).href;
registerHooks({
  resolve: (spec, ctx, next) =>
    spec === 'three' ? { url: THREE_URL, shortCircuit: true } : next(spec, ctx),
});
const THREE = await import('three');
const { PLANE_SCALE, TRAIL, createPlane } = await import('../src/render3d/plane.js');
const ctx = () => ({
  planeHull: new THREE.MeshBasicMaterial(),
  palette: PAPIR,
  scale: PLANE_SCALE,
});

test('U13: one PLANE_SCALE = 7.75 m', () => {
  assert.equal(PLANE_SCALE, 7.75);
  assert.equal(createPlane(ctx()).current.root.scale.x, 7.75);
});

test('R0: one paper plane, no toon tint material, no shadow-map caster', () => {
  const p = createPlane(ctx()).current;
  assert.ok(p.mesh.material.isMeshBasicMaterial && p.mesh.material.vertexColors);
  assert.equal(p.mesh.castShadow, false);
  assert.equal(p.mesh.material.userData.paperTint, undefined);
});

test('U3: trail ribbon, two vertices per point (side ±1), graphite core, fixed buffers, reset on a new throw', () => {
  const pl = createPlane(ctx()),
    tr = pl.trail,
    geo = tr.mesh.geometry,
    buf = geo.attributes.position.array;
  assert.equal(tr.mesh.visible, false);
  assert.equal(geo.attributes.position.count, TRAIL.points * 2);
  assert.deepEqual([...geo.attributes.side.array.slice(0, 4)], [-1, 1, -1, 1]);
  assert.equal('#' + tr.uniforms.core.value.getHexString(), PAPIR.trail[0]);
  for (let i = 0; i < 20; i++)
    pl.apply({ x: i * 2, y: 30 + i * 0.5, angle: -0.1 }, { flying: true, trailColor: '#f6eedd' });
  assert.equal(tr.uniforms.core.value.getHexString(), 'f6eedd', 'mood.trail (district 4 cream)');
  assert.ok(tr.mesh.visible);
  assert.equal(tr.points.length, 20);
  assert.equal(geo.attributes.position.array, buf, 'no reallocation per frame');
  const n = tr.points.length - 1,
    a = geo.attributes.alpha.array,
    h = geo.attributes.halfW.array,
    d = geo.attributes.dir.array;
  assert.ok(Math.abs(a[n * 2] - PAPER_TRAIL.alpha) < 1e-6);
  assert.equal(a[0], 0);
  assert.ok(Math.abs(h[n * 2] - PAPER_TRAIL.half) < 1e-6);
  assert.ok(d[n * 6] > 0, 'tangent along the flight');
  const pos = geo.attributes.position.array;
  assert.equal(pos[n * 6], pos[n * 6 + 3]);
  assert.equal(pos[n * 6 + 1], pos[n * 6 + 4]);
  pl.apply({ x: 0, y: 30, angle: 0 }, { flying: true });
  assert.equal(tr.points.length, 1, 'jump back = new throw');
  assert.equal(tr.mesh.visible, false);
  assert.doesNotThrow(() => pl.dispose());
});

test('S3: plan.plane.scale sizes the plane and the trail width follows it', () => {
  const pl = createPlane(ctx());
  for (let i = 0; i < 5; i++)
    pl.apply({ x: i * 2, y: 30, angle: 0, scale: 0.25 }, { flying: true });
  assert.equal(pl.current.root.scale.x, PLANE_SCALE * 0.25);
  const h = pl.trail.mesh.geometry.attributes.halfW.array;
  assert.ok(Math.abs(h[4 * 2] - PAPER_TRAIL.half * 0.25) < 1e-6, 'trail head half width × scale');
  pl.apply({ x: 10, y: 30, angle: 0 }, { flying: true });
  assert.equal(pl.current.root.scale.x, PLANE_SCALE, 'missing scale = 1');
  pl.dispose();
});
