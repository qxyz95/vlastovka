import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import {
  qteRing,
  ringZoom,
  RING_MIN,
  eventScene,
  anchorX,
  steamHead,
  STEAM_FX,
  columnSpan,
  lanternPose,
  lanternBase,
  LANTERN_FX,
  starPose,
  STAR_FX,
  burstOf,
  effectiveVx,
  comboOf,
  comboLinks,
  burstDash,
} from '../src/render3d/event-fx.js';
import { drawQte, drawUi, drawCombo, drawBurst, QTE_BASE } from '../src/render3d/ui-layer.js';
import { EVENT_VIEWS } from '../src/render3d/events-view.js';
import { PAPIR as P, PAPER_TOKENS as PT } from '../src/render3d/palette.js';
import { zones as eventZones, activeEvent } from '../src/events.js';
import { gameFlight, step, eventInput, bestAngle, GAME } from '../src/core.js';
import { planFrame } from '../src/render3d/frame.js';
import { fxMap } from '../src/render3d/fx-map.js';
import {
  MODELS,
  EVENT_MODELS,
  modelById,
  buildModel,
  modelTriangles,
} from '../src/render3d/models/index.js';
import { starOutline } from '../src/render3d/models/shooting-star.js';
import { PROGRESSION } from '../src/progression-numbers.js';

// C2a: nové události ve scéně (research/atlas/05-art-udalosti.md, rozhodnutí 06 15. 10.). Kruh QTE z e.w, mobilní poloměr ≥ 30 CSS px,
// polohy 3D objektů (kontakt ve středu okna), výtrysk v rychlostních čarách, řetěz komba, modely a rozpočet DC / △ (three.js přes hook).
registerHooks({
  resolve: (s, c, next) =>
    s === 'three'
      ? {
          url: new URL('../vendor/three/three.module.min.js', import.meta.url).href,
          shortCircuit: true,
        }
      : next(s, c),
});
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
const KIT = (atlas = {}) => ({
  model: 'dart',
  power: 3,
  folds: 3,
  paper: 3,
  atlas: { steam: 3, thermal: 3, drone: 3, star: 3, ...atlas },
  slots: [],
});
// Let s plnou výbavou, kde jsou všechny běžné události typu `type`; přetočí se na začátek varování první z nich.
function flightAt(type, { atlas, phase = 'warning', seed = 5 } = {}) {
  const kit = KIT(atlas),
    f = gameFlight(kit, seed, bestAngle(kit, 0.9), 0.9);
  for (const e of f.events) if (!e.extra) e.type = type;
  for (let i = 0; i < 60 * 30 && !f.landed; i++) {
    const e = activeEvent(f);
    if (e && e.type === type && e.phase === phase) return { f, e };
    step(f);
  }
  throw new Error('no ' + type);
}
function fakeCtx(width = 640) {
  const ops = [],
    stack = [],
    st = {
      fillStyle: '#000',
      strokeStyle: '#000',
      lineWidth: 1,
      globalAlpha: 1,
      font: '10px x',
      dash: [],
    };
  const rec =
    name =>
    (...args) =>
      ops.push({ name, args, style: { ...st, dash: [...st.dash] } });
  const c = {
    canvas: { width, height: (width * 9) / 16 },
    ops,
    save: () => stack.push({ ...st, dash: [...st.dash] }),
    restore: () => Object.assign(st, stack.pop() ?? {}),
    setLineDash: d => (st.dash = [...d]),
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
    if (k !== 'dash') Object.defineProperty(c, k, { get: () => st[k], set: v => (st[k] = v) });
  return c;
}
const strokes = c => {
  const out = [];
  let last = null;
  for (const o of c.ops) {
    if (o.name === 'arc' || o.name === 'ellipse') last = o;
    if (o.name === 'stroke' && last) {
      out.push({ ...last, style: o.style });
      last = null;
    }
  }
  return out;
};
const view = { cam: 0, px: 148, py: 200, ground: 300, k: 1 };

test('C2a kruh: zóny z e.w konkrétní události (plující střed), průběh open → close, pára dvě zóny, hvězda jen perfekt', () => {
  for (const type of ['gust', 'steam', 'thermal', 'drone', 'star']) {
    const { f, e } = flightAt(type),
      w = e.w,
      len = w.close - w.open,
      q = qteRing(e, f),
      cs = Array.isArray(w.c) ? w.c : [w.c];
    assert.equal(q.zones.length, cs.length, type);
    cs.forEach((c, i) => {
      const m = (c - w.open) / len;
      assert.ok(near(q.zones[i].success[0], Math.max(0, m - w.s / len)), `${type} success`);
      assert.ok(near(q.zones[i].success[1], Math.min(1, m + w.s / len)), `${type} success`);
      if (w.p > 0) assert.ok(near((q.zones[i].perfect[0] + q.zones[i].perfect[1]) / 2, m, 0.2));
    });
    // průběh: 0 na začátku interakce, 1 v close
    assert.equal(qteRing(e, { ...f, t: w.open }).progress, 0);
    assert.equal(qteRing(e, { ...f, t: w.close }).progress, 1);
    assert.ok(near(qteRing(e, { ...f, t: w.open + len / 2 }).progress, 0.5));
    if (type === 'gust') assert.deepEqual(q.zones[0], eventZones(e), 'poryv = events.zones');
  }
  const st = flightAt('steam'),
    sq = qteRing(st.e, st.f);
  assert.deepEqual(sq.pegs, [null, null]);
  assert.equal(sq.next, 0);
  assert.ok(sq.gap > sq.zones[0].success[0] && sq.gap < sq.zones[1].success[1]);
  const star = flightAt('star');
  assert.equal(qteRing(star.e, star.f).only, 'perfect');
  const th = flightAt('thermal');
  assert.equal(qteRing(th.e, th.f).track, 'half');
  assert.deepEqual(qteRing(th.e, th.f).stops, qteRing(th.e, th.f).zones[0].success);
  const dr = flightAt('drone'),
    dq = qteRing(dr.e, dr.f);
  assert.ok(dq.contact && dq.zones[0].success[1] === 1, 'úspěch lampionu končí kontaktem ve 12 h');
  // plující střed: zóny poryvu se mezi hody liší (e.off), dřív windows(f).gust ne
  const gusts = [3, 9, 15, 21].map(seed => {
    const { f, e } = flightAt('gust', { seed: seed + 10 });
    return qteRing(e, f).zones[0].success[0].toFixed(3);
  });
  assert.ok(new Set(gusts).size > 1, 'plující střed vidět na kruhu');
});

test('C2a kruh: pára ťuk-ťuk = pecky podle výsledku obláčků, dvojice termiky / lampionu má dvě pecky', () => {
  const { f, e } = flightAt('steam', { phase: 'interaction' });
  while (f.t < e.w.c[0]) step(f);
  eventInput(f, 'down', 'auto');
  const q = qteRing(e, f);
  assert.ok(['perfect', 'success'].includes(q.pegs[0]));
  assert.equal(q.pegs[1], null);
  assert.equal(q.next, 1);
  // pulz zóny v okamžiku středu (±0,05 s)
  assert.equal(qteRing(e, { ...f, t: e.w.c[1] }).pulse, 1);
  // dvojice: druhý lampion (follow) ukazuje výsledek prvního
  const g = { ...flightAt('drone') },
    i = g.f.events.indexOf(g.e),
    twin = { ...g.e, follow: true, result: null };
  g.f.events.splice(i + 1, 0, twin);
  assert.deepEqual(qteRing(g.e, g.f).pegs, [null, null]);
  g.e.result = 'perfect';
  assert.deepEqual(qteRing(twin, g.f).pegs, ['perfect', null]);
  assert.equal(qteRing(twin, g.f).next, 1);
});

test('C2a kruh: na 360 px poloměr ≥ 30 CSS px pro všechny události, vnitřní hrana mezikruží ≥ 20 px, desktop beze změny', () => {
  for (const [type, v] of Object.entries(EVENT_VIEWS)) {
    const r = v.ring.r;
    for (const css of [360, 375, 390]) {
      const z = ringZoom(r, css),
        s = css / 640;
      assert.ok(r * z * s >= RING_MIN - 1e-9, `${type} ${css}: ${r * z * s}`);
      assert.ok((r - QTE_BASE) * z * s >= 20 - 1e-9, `${type} vnitřní hrana`);
    }
    assert.equal(ringZoom(r, 1280), 1, `${type} desktop beze změny`);
    assert.equal(ringZoom(r, 1920), 1);
  }
  // drawUi zvětší kruh podle ui.cssWidth (plan.ui.cssWidth z planFrame)
  const { f, e } = flightAt('steam', { phase: 'interaction' }),
    q = qteRing(e, f);
  for (const css of [360, 1280]) {
    const c = fakeCtx(css);
    drawUi(c, { view, ui: { qte: q, cssWidth: css } });
    const R = Math.max(...strokes(c).map(a => a.args[2]));
    assert.ok(near(R, 32 * ringZoom(32, css)), `${css}: ${R}`);
  }
});

test('C2a kruh: varování ukazuje zóny v alfě 0,5 pod čárkovaným kruhem; reduced motion bez blikání; stav ne jen barvou', () => {
  const { f, e } = flightAt('star'),
    q = qteRing(e, f);
  assert.equal(q.phase, 'warning');
  const c = fakeCtx();
  drawQte(c, q, view, 0.3, false);
  const a = strokes(c),
    perf = a.filter(o => o.style.strokeStyle === P.qte.perfect),
    dash = a.find(o => o.style.dash.length);
  assert.ok(perf.length >= 1 && perf.every(o => near(o.style.globalAlpha, 0.5)), 'zóna alfa .5');
  assert.ok(!a.some(o => o.style.strokeStyle === P.qte.success), 'hvězda: žádná tyrkysová');
  assert.ok(dash && a.indexOf(dash) > a.indexOf(perf[0]), 'čárkovaný kruh nad zónami');
  const r = fakeCtx();
  drawQte(r, q, view, 0.3, true);
  assert.ok(near(strokes(r).find(o => o.style.dash.length).style.globalAlpha, 0.8));
  // interakce: stopa 6, úspěch 9, perfekt 11 + hvězda; termika stopa kraftDark (half) a zarážky jádra
  const th = flightAt('thermal', { phase: 'interaction' }),
    t = fakeCtx();
  drawQte(t, qteRing(th.e, th.f), view, 0, false);
  const w = Object.fromEntries(strokes(t).map(o => [o.style.strokeStyle, o.style.lineWidth]));
  assert.equal(w[P.qte.half], 6);
  assert.equal(P.qte.half, PT.kraftDark);
  assert.equal(w[P.qte.success], 9);
  assert.equal(w[P.qte.perfect], 11);
  assert.equal(t.ops.filter(o => o.name === 'lineTo' && o.style).length >= 2, true);
  // výsledek half / partial má vlastní barvu (popup nese text, C2b)
  assert.equal(P.qte.result.half, PT.kraftDark);
  assert.equal(P.qte.result.partial, PT.kraftDark);
});

test('C2a polohy: hlava páry v c[i] 1 m pod vlaštovkou, sloup = 2·col·vx, kontakt lampionu v close, hvězda protne vlaštovku ve w.c', () => {
  const { e } = flightAt('steam'),
    w = e.w,
    Y = 40;
  for (const i of [0, 1]) {
    assert.ok(near(steamHead(w, i, w.c[i], Y).y, Y - STEAM_FX.below), 'hlava u vlaštovky v c');
    assert.equal(steamHead(w, i, w.c[i] - STEAM_FX.lead - 0.01, Y), null, 'před výtryskem nic');
    assert.ok(steamHead(w, i, w.c[i] - 0.2, Y).y < Y - 1);
  }
  const miss = steamHead(w, 0, w.c[0], Y, 'miss');
  assert.ok(miss.y <= Y - STEAM_FX.miss + 1e-9, 'minutí: hlava 4 m pod vlaštovkou');
  assert.ok(
    steamHead(w, 0, w.c[0] + 0.1, Y, 'success').size > steamHead(w, 0, w.c[0] + 0.1, Y).size,
  );
  assert.equal(steamHead(w, 0, w.open, Y, 'success', true).y, Y - 1, 'reduced: plná výška');
  // reálná kotva: vlaštovka ve středu okna je nad ventilací
  const s2 = flightAt('steam'),
    X0 = s2.f.x,
    vent = anchorX(X0, s2.f.vx, s2.e.w.c[0], s2.f.t);
  assert.ok(near(vent, X0 + s2.f.vx * (s2.e.w.c[0] - s2.f.t)));
  const th = flightAt('thermal').e.w,
    span = columnSpan(th, 60);
  assert.ok(near(span.width, 2 * 0.65 * 60) && near(span.core, 2 * th.s * 60));
  // lampion: odhad z rychlosti, v close přesně ahead před a lift nad vlaštovkou; při rovnoměrném pohybu stojí
  const dr = flightAt('drone'),
    ev = eventScene(dr.e),
    close = ev.w.close,
    at = t => lanternBase(100 + 50 * t, 30 + 4 * t, 50, 4, close, t);
  assert.deepEqual(at(close), {
    x: 100 + 50 * close + LANTERN_FX.ahead,
    y: 30 + 4 * close + LANTERN_FX.lift,
  });
  assert.ok(near(at(close - 1.5).x, at(close).x) && near(at(close - 1.5).y, at(close).y));
  const base = at(close),
    pc = lanternPose(base, ev, close, true);
  assert.ok(near(pc.x, base.x) && near(pc.y, base.y));
  const hit = lanternPose(base, { ...ev, result: 'perfect', resolvedAt: close }, close + 0.4);
  assert.ok(hit.roll < -0.3 && hit.y > pc.y + 1, 'odraz: náklon a nahoru');
  assert.equal(lanternPose(base, { ...ev, result: 'miss', resolvedAt: 1 }, 1, true), null);
  // hvězda
  const sw = flightAt('star').e.w,
    sp = starPose(sw, sw.c, 200, 50);
  assert.ok(near(sp.x, 200) && near(sp.y, 50 + STAR_FX.above));
  const before = starPose(sw, sw.c - 0.5, 200, 50);
  assert.ok(before.x > 200 && before.y > 52, 'přilétá zprava shora');
  assert.equal(starPose(sw, sw.c, 200, 50, 'perfect', sw.c), null, 'zásah = rozpad');
  assert.ok(starPose(sw, sw.c + 0.3, 200, 50, 'miss', sw.c).alpha < 1);
  assert.deepEqual(starPose(sw, sw.c - 0.5, 200, 50, null, null, true), {
    x: 200,
    y: 52,
    spin: 0,
    alpha: 1,
  });
});

test('C2a výtrysk: rychlostní čáry a tah vidí vEff = vx + burstLeft · cruise', () => {
  const { f } = flightAt('star');
  assert.equal(burstOf(f), null);
  assert.equal(effectiveVx(f), f.vx);
  const g = structuredClone(f);
  g.vx = 45;
  g.burst = { ...PROGRESSION.events.star.burst, t0: g.t, tag: 'star' };
  const b = burstOf(g);
  assert.ok(near(b.left, GAME.burstLeft(g)) && near(b.k, 1));
  assert.ok(near(effectiveVx(g), 45 + b.left * g.cruise));
  const without = fxMap(null, view, { vx: 45, flying: true, frame: 1 }).speedLines.length,
    withB = fxMap(null, view, { vx: effectiveVx(g), flying: true, frame: 1 }).speedLines.length;
  assert.ok(withB > without, `${withB} > ${without}`);
  // planFrame posílá vEff do rychlostních čar a ui.burst s ocasem
  const plain = { ...g, burst: null },
    pa = planFrame({ f: plain, time: g.t, visual: { clock: g.t } }),
    pb = planFrame({ f: g, time: g.t, visual: { clock: g.t } });
  assert.ok(pb.fx.speedLines.length > pa.fx.speedLines.length);
  assert.ok(pb.ui.burst && pb.ui.burst.tail > 0 && pa.ui.burst === null);
  assert.equal(pb.burst.tag, 'star');
  // tah: 3 čárky délky 8 + 40·k, reduced = stojí (bez obláčků)
  for (const reduced of [false, true]) {
    const c = fakeCtx();
    drawBurst(c, { ...b, tag: 'steam', tail: 20 }, view, 0, reduced);
    const moves = c.ops.filter(o => o.name === 'moveTo'),
      lines = c.ops.filter(o => o.name === 'lineTo');
    assert.equal(moves.length, 3);
    assert.ok(near(moves[1].args[0] - lines[1].args[0], burstDash(1)));
    assert.ok(
      moves.every(m => m.args[0] < view.px - 20),
      'za ocasem, ne před nosem',
    );
    assert.equal(c.ops.filter(o => o.name === 'arc').length, reduced ? 0 : 3);
  }
});

test('C2a kombo: očka = strop podle Crowd Chain (3 / 4 / 5 / 5), číslo ×N vždy, Chimes zvoneček od komba 3', () => {
  for (const [chain, max] of [
    [0, 3],
    [1, 4],
    [2, 5],
    [3, 5],
  ]) {
    const { f } = flightAt('gust', { atlas: chain ? { chain } : {} });
    assert.equal(f.comboSpec.max, max);
    f.combo = 2;
    const cb = comboOf(f),
      c = fakeCtx();
    drawCombo(c, cb);
    const links = c.ops.filter(o => o.name === 'ellipse');
    assert.equal(links.length, max, `chain ${chain}`);
    const filled = strokes(c).filter(
      o => o.name === 'ellipse' && o.style.strokeStyle === P.combo.link,
    );
    assert.equal(filled.length, 2);
    assert.ok(c.ops.some(o => o.name === 'fillText' && o.args[0] === '×2'));
  }
  assert.equal(
    comboLinks(5, 7, 600, 40).filter(l => l.filled).length,
    5,
    'nad stropem roste jen číslo',
  );
  const { f } = flightAt('gust', { atlas: { onAir: 1 } });
  f.combo = 0;
  assert.equal(comboOf(f), null, 'bez komba a bez Crowd Chain nic');
  f.combo = 2;
  assert.equal(comboOf(f).chimes, false);
  f.combo = 3;
  const bell = fakeCtx();
  drawCombo(bell, comboOf(f));
  assert.ok(
    bell.ops.some(o => o.name === 'fill' && o.style.fillStyle === P.combo.bell),
    'zvoneček',
  );
  // planFrame: řetěz jen s kotvou z ui.js (visual.combo), C2b ho zapne
  assert.equal(planFrame({ f, time: f.t, visual: {} }).ui.combo, null);
  const pl = planFrame({ f, time: f.t, visual: { combo: { x: 600, y: 30 } } });
  assert.equal(pl.ui.combo.n, 3);
  assert.deepEqual(pl.ui.comboAnchor, { x: 600, y: 30 });
});

test('C2a modely: lampion, termika, hvězda v registru, stropy △ a LOD, barvy bez rolí, čtyřcípá hvězda', () => {
  assert.deepEqual(EVENT_MODELS, ['sky-lantern', 'thermal', 'shooting-star']);
  const caps = { 'sky-lantern': [72, 30], thermal: [70, 36], 'shooting-star': [68, 26] };
  for (const id of EVENT_MODELS) {
    const m = modelById(id);
    assert.ok(MODELS.includes(m));
    for (const variant of ['day', 'night']) {
      const n = [0, 1, 2].map(l => modelTriangles(m, l, { variant }));
      assert.deepEqual(n, [...caps[id], 0], id);
      for (const card of buildModel(m, 0, { variant }))
        assert.ok(
          ![PT.tomato, PT.teal, PT.mustard, PT.cobalt, PT.paper, PT.graphite].includes(card.color),
          `${id} ${card.part} ${card.color}`,
        );
    }
  }
  const K = P.companion;
  const lan = v => buildModel('sky-lantern', 0, { variant: v }).map(c => c.color);
  assert.ok(lan('day').includes(K.lantern.day) && lan('day').includes(K.lantern.dayRib));
  assert.ok(lan('night').includes(K.lantern.night));
  assert.equal(K.lantern.day, '#b5503c');
  assert.equal(K.lantern.night, '#f2c14e');
  assert.equal(K.star.day, '#3d4f7a');
  assert.equal(K.star.night, PT.cream);
  assert.equal(starOutline().length, 8, 'čtyřcípá: 4 cípy + 4 rohy');
  assert.ok(buildModel('shooting-star', 0).some(c => c.color === K.star.day));
});

test('C2a 3D: každá událost nejvýš +4 DC a +400 △ současně, poryv bez ventilace, lampion svítí jen ve čtvrti 4, dispose', async () => {
  const THREE = await import('three'),
    { createCompanion } = await import('../src/render3d/companion3d.js'),
    { toonRamp, outlineMaterial } = await import('../src/render3d/toon.js'),
    { paperKit } = await import('../src/render3d/paper.js');
  const kit = paperKit(),
    comp = createCompanion({
      ramp: toonRamp(),
      hull: outlineMaterial({ color: '#000000' }),
      palette: P,
      paper: kit,
    });
  const count = () => {
    let calls = 0,
      tris = 0;
    comp.group.traverseVisible(o => {
      if (!o.isMesh) return;
      calls++;
      const g = o.geometry,
        n = (g.index ? g.index.count : g.attributes.position.count) / 3;
      tris += n * (o.isInstancedMesh ? o.count : 1);
    });
    return { calls, tris };
  };
  for (const type of ['gust', 'steam', 'thermal', 'drone', 'star'])
    for (const district of [0, 3]) {
      const { f, e } = flightAt(type, { phase: 'interaction' }),
        evs = eventScene(e),
        star = { ...PROGRESSION.events.star.burst, k: 1, left: 1, age: 0.5, tag: 'star' };
      for (const dt of [0, 0.3, 0.6]) {
        comp.update({
          t: f.t + dt,
          X: f.x,
          Y: f.y,
          vx: f.vx,
          evs,
          burst: star,
          district,
          pxPerM: 6,
        });
        const n = count();
        assert.ok(n.calls <= 4, `${type} čtvrť ${district + 1}: ${n.calls} DC`);
        assert.ok(n.tris <= 400, `${type}: ${n.tris} △`);
      }
      if (type === 'gust') assert.equal(comp.vent.visible, false, 'poryv bez ventilace');
      if (type === 'steam') assert.ok(comp.vent.visible && comp.steam.visible);
      if (type === 'drone') {
        const lit = comp.lantern.children[0].material.toneMapped === false;
        assert.equal(lit, district === 3, 'svítí jen ve čtvrti 4');
        assert.equal(comp.glow.visible, district === 3);
      }
    }
  comp.update({ t: 0, X: 0, Y: 30 });
  assert.equal(count().calls, 0, 'mimo událost 0 DC');
  assert.doesNotThrow(() => comp.dispose());
  kit.dispose();
  void THREE;
});
