// C3 Kapsy a schopnosti: jedno tlačítko Z6 (událost > schopnost), Dive při začátku události, výlučnost kapes, stav čipu
// a shoda hra × simulátor (fly z simulation/progression/model.mjs) pro Dive + Sharp, Rocket a Whistle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh,
  kitOf,
  flightFor,
  advance,
  activeEvent,
  flightInput,
  abilityState,
  pocketsOf,
  GAME,
  GAME_KEY,
  FINISH,
} from '../src/core.js';
import { PROGRESSION as P } from '../src/progression-numbers.js';
import { canEquip, equip } from '../src/atlas.js';
import { sanitizeAtlas } from '../src/storage.js';
import { random } from '../src/random.js';
import { t, setLang, setStrict } from '../src/i18n.js';
import {
  fly as simFly,
  press as simPress,
  release as simRelease,
  startDive as simDive,
  pullUp as simPullUp,
  cushion as simCushion,
  whistle as simWhistle,
  rocket as simRocket,
} from '../simulation/progression/model.mjs';

import { readFileSync } from 'node:fs';
import { abilityNews, createFx, fxEvent } from '../src/juice.js';
import { abilityFx, burstOf } from '../src/render3d/event-fx.js';
import { drawAbility } from '../src/render3d/ui-layer.js';
import { planFrame } from '../src/render3d/frame.js';
import { PAPIR } from '../src/render3d/palette.js';
import { PIXELS_PER_METER as PPM } from '../src/scenes.js';
import { compact } from './helpers/compact.js';

setStrict(true);
const withPockets = (slots, o = {}) => {
  const p = { ...fresh(), best: FINISH, attempts: 9, ...o };
  p.atlas = { ...p.atlas, pockets: { owned: 2, slots } };
  return p;
};
const flightWith = (slots, n = 10, angle = 24, charge = 0.9) =>
  flightFor(withPockets(slots, { attempts: n - 1 }), angle, charge);
const run = (f, until) => {
  let acc = 0;
  while (!f.landed && !until(f)) ({ acc } = advance(f, acc, 1 / 60));
  return f;
};

test('Z6: during warning and interaction the button belongs to the event, otherwise to the pocket ability', () => {
  const f = flightWith(['rocket']);
  run(f, g => activeEvent(g)?.phase === 'warning');
  assert.ok(activeEvent(f), 'an event started');
  assert.deepEqual(
    flightInput(f, 'down'),
    { to: 'event', res: null },
    'press in warning is ignored',
  );
  assert.equal(f.abil.rocket ?? 0, 0, 'no rocket while the event owns the button');
  run(f, g => activeEvent(g)?.phase === 'interaction');
  const r = flightInput(f, 'down');
  assert.equal(r.to, 'event');
  assert.equal(f.abil.rocket ?? 0, 0);
  // 0,3 s po vyhodnocení tlačítko pořád patří události
  run(f, g => !!g.lastEv?.result);
  assert.deepEqual(flightInput(f, 'down'), { to: null });
  run(f, g => GAME.canAct(g));
  const a = flightInput(f, 'down');
  assert.deepEqual(a, { to: 'ability', id: 'rocket', res: true });
  assert.equal(f.burst.tag, 'rocket');
  assert.equal(abilityState(f).left, P.specials.rocket.charges - 1);
});

test('Z6: Dive is a hold (release or lost pointer = pull-up) and pulls up by itself when an event starts', () => {
  const f = flightWith(['dive', 'sharp']);
  run(f, g => g.vy < 0 && GAME.canAct(g) && g.y > 20);
  assert.deepEqual(flightInput(f, 'down'), { to: 'ability', id: 'dive', res: true });
  assert.equal(abilityState(f).state, 'diving');
  const t0 = f.t,
    vx0 = f.vx;
  run(f, g => g.t > t0 + 0.3);
  assert.ok(f.vx > vx0, 'diving gains speed');
  assert.deepEqual(flightInput(f, 'cancel'), { to: 'ability', id: 'dive', res: true });
  assert.equal(f.dive, null, 'lost pointer pulls up, the hold never sticks');
  // držení až do začátku další události: událost počká nejvýš waitMax, pak se vlaštovka sama vybere
  const h = flightWith(['dive', 'sharp']);
  run(h, g => GAME.canAct(g) && g.events.some(e => e.phase === 'waiting' && e.at - g.t < 1));
  assert.equal(flightInput(h, 'down').id, 'dive');
  const next = h.events.find(e => e.phase === 'waiting');
  run(h, g => next.phase !== 'waiting' || !g.dive);
  assert.equal(h.dive, null, 'Dive ended');
  assert.notEqual(next.phase, 'waiting', 'the event started and ended the Dive');
  assert.ok(h.t <= next.at + P.specials.dive.waitMax + 2 / 60, 'waited at most waitMax');
  assert.equal(h.stats.dive.crash, 0);
  // puštění po automatickém vybrání už schopnost nespustí ani nevybere znovu
  assert.notEqual(flightInput(h, 'up').to, 'ability');
});

test('Z6: Cushion only below 6 m and once; Whistle calls the next event once and only from 8 m up', () => {
  const c = flightWith(['cushion']);
  run(c, g => GAME.canAct(g) && g.y > 10);
  assert.equal(abilityState(c).state, 'high');
  assert.equal(flightInput(c, 'down').res, false, 'too high: nothing used');
  run(c, g => g.y < 3 && g.vy < 0 && GAME.canAct(g));
  assert.deepEqual(flightInput(c, 'down'), { to: 'ability', id: 'cushion', res: true });
  assert.deepEqual(abilityState(c), { id: 'cushion', state: 'used', left: 0 });
  assert.equal(flightInput(c, 'down').res, false);

  const w = flightWith(['whistle', 'calm']);
  run(w, g => abilityState(g).state === 'ready');
  const next = w.events.find(e => e.phase === 'waiting'),
    at = next.at;
  assert.deepEqual(flightInput(w, 'down'), { to: 'ability', id: 'whistle', res: true });
  assert.ok(next.whistled && next.at < at);
  assert.equal(abilityState(w).state, 'used');
  const low = flightWith(['whistle']);
  run(low, g => g.y < P.specials.whistle.minY - 1 && GAME.canAct(g));
  if (!low.landed) {
    assert.equal(flightInput(low, 'down').res, false, 'below 8 m the call would never start');
    assert.equal(low.abil.whistle ?? 0, 0);
  }
});

test('pockets: only one active ability, Sharp Edge × Calm Sky exclusive (Atlas equip and save validation)', () => {
  const p = withPockets([null, null]);
  assert.ok(equip(p, 0, 'dive'));
  assert.equal(canEquip(p, 1, 'rocket').reason, 'active');
  assert.ok(equip(p, 1, 'sharp'));
  assert.equal(canEquip(p, 0, 'calm').reason, 'exclusive');
  assert.deepEqual(pocketsOf(p), [
    { id: 'dive', active: true },
    { id: 'sharp', active: false },
  ]);
  const bad = sanitizeAtlas(withPockets(['rocket', 'whistle']).atlas);
  assert.deepEqual(bad.atlas.pockets.slots.filter(Boolean), ['rocket']);
  assert.ok(bad.lossy);
  const both = sanitizeAtlas(withPockets(['sharp', 'calm']).atlas);
  assert.deepEqual(both.atlas.pockets.slots.filter(Boolean), ['sharp']);
  assert.equal(GAME.derive(kitOf(p)).active, 'dive');
  assert.equal(GAME.derive(kitOf(withPockets(['sharp', null]))).active, null);
  assert.equal(abilityState(flightFor(withPockets(['sharp', null]), 20, 0.8)), null);
});

// Shoda hra × simulátor (kritérium C3): hra = smyčka snímků advance s nepravidelnými snímky a vstupy přes flightInput,
// simulátor = fly() s botem, který ve stejném kroku zavolá stejné funkce modelu (press/release, startDive/pullUp, rocket, whistle).
function scripted(slots, n, angle, charge, seed) {
  const p = withPockets(slots, { attempts: n - 1, levels: { power: 2, paper: 6, folds: 1 } }),
    kit = kitOf(p),
    f = flightFor(p, angle, charge),
    r = random(seed),
    log = [];
  let acc = 0,
    k = 0,
    diveUntil = null;
  const input = kind => {
    const res = flightInput(f, kind);
    if (res.to === 'ability' && res.res !== false)
      log.push([k, kind === 'down' ? res.id : 'pullUp']);
    else if (res.to === 'event') log.push([k, kind]);
    return res;
  };
  while (!f.landed) {
    const e = activeEvent(f),
      st = abilityState(f);
    if (e && !e.result && e.phase === 'interaction') {
      const c = e.type === 'steam' ? e.w.c[e.puff] : e.w.c,
        off = (r() - 0.5) * 0.2;
      if (e.type !== 'bird' && f.t >= c + off) input('down');
      if (e.type === 'bird' && e.heldAt === null && r() < 0.3) input('down');
      if (e.type === 'bird' && e.heldAt !== null && f.t - e.heldAt >= e.w.c + off) input('up');
    } else if (st) {
      if (st.id === 'dive') {
        if (f.dive && (f.y <= diveUntil || r() < 0.002)) input('up');
        else if (!f.dive && st.state === 'ready' && f.vy < 0 && f.y > 18 && r() < 0.05) {
          diveUntil = 3 + 6 * r();
          input('down');
        }
      } else if (st.state === 'ready' && r() < 0.01) input('down');
    }
    ({ acc } = advance(f, acc, 0.004 + 0.05 * r(), r() < 0.02, (g, w) => w === 'after' && k++));
  }
  const fns = {
    down: simPress,
    up: simRelease,
    dive: simDive,
    pullUp: simPullUp,
    cushion: simCushion,
    whistle: simWhistle,
    rocket: simRocket,
  };
  let i = 0;
  const replay = g => {
    for (const [at, kind] of log) if (at === i) fns[kind](g);
    i++;
  };
  const s = simFly(kit, { key: GAME_KEY, n, profile: 'scripted', angle, charge, exact: true }, [
    replay,
  ]);
  return { f, s, log };
}
test('C3: flights with pocket abilities match the simulator fly() to 1e-9 (Dive + Sharp, Rocket, Whistle)', () => {
  const used = { dive: 0, pullUp: 0, rocket: 0, whistle: 0 };
  for (const [slots, seeds] of [
    [
      ['dive', 'sharp'],
      [1, 2, 3, 4],
    ],
    [
      ['rocket', null],
      [5, 6, 7],
    ],
    [
      ['whistle', 'calm'],
      [8, 9, 10],
    ],
    [['cushion', 'sharp'], [11]],
  ])
    for (const seed of seeds) {
      const n = 10 + seed,
        { f, s, log } = scripted(slots, n, 22 + (seed % 6), 0.85, seed * 31 + 7);
      for (const [, kind] of log) if (kind in used) used[kind]++;
      assert.ok(Math.abs(f.x - s.x) <= 1e-9, `${slots} #${seed}: x ${f.x} vs ${s.x}`);
      assert.ok(Math.abs(f.t - s.t) <= 1e-9 && Math.abs(f.real - s.real) <= 1e-9);
      assert.deepEqual(
        f.events.map(e => [e.result, !!e.whistled]),
        s.events.map(e => [e.result, !!e.whistled]),
      );
      assert.deepEqual(f.stats.dive, s.stats.dive);
      assert.equal(f.stats.rocket, s.stats.rocket);
      assert.equal(f.stats.whistle, s.stats.whistle);
    }
  for (const [k, v] of Object.entries(used)) assert.ok(v > 0, `${k} used in some flight`);
});

test('C3: chip texts exist in EN and CS (names, states, hints, popups)', () => {
  for (const lang of ['en', 'cs']) {
    setLang(lang);
    for (const id of ['dive', 'cushion', 'whistle', 'rocket', 'sharp', 'calm']) {
      assert.ok(t('ability.hint.' + id, { count: 2 }).length > 4);
    }
    for (const s of ['ready', 'diving', 'used', 'wait', 'high'])
      assert.ok(t('ability.state.' + s, { count: 1 }));
    assert.match(t('ability.state.left', { count: 2 }), /2/);
    assert.match(t('ability.hint.rocket', { count: 2 }), /2/);
    for (const k of ['ability.chip', 'ability.live', 'ability.passive', 'popup.lowPass'])
      assert.ok(t(k, { name: 'X', state: 'Y', count: 1 }));
  }
  setLang('en');
  assert.equal(t('ability.state.left', { count: 1 }), '1 left');
  setLang('cs');
  assert.equal(t('ability.state.left', { count: 2 }), 'zbývají 2');
  setLang('en');
});

test('C3 chip state: Rocket counts down, Dive is unlimited, the state is text for every phase', () => {
  const f = flightWith(['rocket']);
  assert.deepEqual(abilityState(f), { id: 'rocket', state: 'ready', left: 2 });
  run(f, g => GAME.canAct(g) && g.t > 0.5);
  flightInput(f, 'down');
  const t1 = f.t;
  run(f, g => GAME.canAct(g) && g.t > t1 + 0.1);
  flightInput(f, 'down');
  assert.deepEqual(abilityState(f), { id: 'rocket', state: 'used', left: 0 });
  assert.equal(flightInput(f, 'down').res, false);
  const d = flightWith(['dive']);
  assert.equal(abilityState(d).left, null);
  run(d, g => activeEvent(g)?.phase === 'warning');
  assert.equal(abilityState(d).state, 'wait');
});

// Efekty ve scéně (UI vrstva, 0 draw calls): pás nízkého průletu při Dive, pásma a polštář Cushion, výtrysk Rocket z C2a.
const fakeCtx = () => {
  const ops = [],
    st = { fillStyle: '', globalAlpha: 1 };
  const c = new Proxy(st, {
    get: (o, k) =>
      k === 'ops'
        ? ops
        : k === 'createLinearGradient'
          ? (...args) => ({
              args,
              stops: [],
              addColorStop(at, color) {
                this.stops.push([at, color]);
              },
            })
          : k in o
            ? o[k]
            : (...args) => ops.push({ name: k, args, fill: o.fillStyle }),
    set: (o, k, v) => ((o[k] = v), true),
  });
  return c;
};
test('C3 scene: Dive shows the low-pass band, Cushion the height bands and then the pillow, Rocket reuses the burst trail', () => {
  const view = { px: 200, py: 150, ground: 300, k: 0.5 },
    m = view.k * PPM,
    d = flightWith(['dive']);
  run(d, g => g.vy < 0 && GAME.canAct(g) && g.y > 15);
  flightInput(d, 'down');
  const a = abilityFx(d, view, PPM),
    [lo, hi] = P.specials.dive.low;
  assert.equal(a.kind, 'lowPass');
  assert.ok(Math.abs(a.bottom - (view.ground - lo * m)) < 1e-9 && a.top < a.bottom);
  assert.equal(a.in, false);
  const c = fakeCtx();
  drawAbility(c, a, view);
  const fills = c.ops.filter(o => o.name === 'fillRect');
  assert.equal(fills.length, 1);
  // F2 B6: pás jen před vlaštovkou (px − 40 … px + 260), konce zeslabené gradientem tyrkysové (role úspěchu), čáry bez grafitu
  const [x0, , w] = fills[0].args,
    rgb = [1, 3, 5].map(i => parseInt(PAPIR.qte.success.slice(i, i + 2), 16)).join(',');
  assert.deepEqual([x0, x0 + w], [view.px - 40, view.px + 260]);
  assert.deepEqual(
    fills[0].fill.stops.map(([, col]) => col),
    [0, 1, 1, 0].map(a => `rgba(${rgb},${a})`),
  );
  assert.ok(Math.abs(fills[0].fill.stops[1][0] * 300 - 30) < 1e-9, 'fade 30 px');
  assert.ok(planFrame({ f: d, visual: { cssWidth: 640 } }).ui.ability?.kind === 'lowPass');

  const cu = flightWith(['cushion']);
  assert.equal(abilityFx(cu, view, PPM), null, 'high up: nothing under the plane');
  run(cu, g => g.y < 4 && g.vy < 0 && GAME.canAct(g));
  const guide = abilityFx(cu, view, PPM);
  assert.equal(guide.kind, 'cushion');
  assert.deepEqual(
    guide.bands.map(b => b[2]),
    ['perfect', 'success', 'track'],
  );
  flightInput(cu, 'down');
  const pillow = abilityFx(cu, view, PPM);
  assert.equal(pillow.kind, 'pillow');
  assert.ok(pillow.k > 0.9);
  const c2 = fakeCtx();
  drawAbility(c2, pillow, view);
  const el = c2.ops.filter(o => o.name === 'ellipse');
  assert.equal(el.length, 1);
  // F2 B5: polštář z pásky (ne bílý), kraftový čárkovaný obrys [3, 2], 4 px pod vlaštovkou
  assert.equal(el[0].args[1], pillow.y + 4);
  assert.equal(c2.ops.find(o => o.name === 'fill').fill, PAPIR.ability.pillow);
  assert.equal(PAPIR.ability.pillow, '#efe0a8');
  assert.equal(PAPIR.ability.pillowEdge, '#9c7a55');
  assert.ok(c2.ops.some(o => o.name === 'setLineDash' && o.args[0].join() === '3,2'));

  const r = flightWith(['rocket']);
  run(r, g => GAME.canAct(g) && g.t > 0.5);
  flightInput(r, 'down');
  assert.equal(burstOf(r).tag, 'rocket');
  assert.ok(planFrame({ f: r, visual: { cssWidth: 640 } }).ui.burst.k > 0.9);
});

test('C3 juice: low pass, rocket and whistle each give feedback once', () => {
  const seen = {};
  assert.deepEqual(abilityNews(seen, { dive: { low: 1 }, rocket: 2, whistle: 0 }), [
    'lowPass',
    'rocket',
    'rocket',
  ]);
  assert.deepEqual(abilityNews(seen, { dive: { low: 1 }, rocket: 2, whistle: 1 }), ['whistle']);
  assert.deepEqual(abilityNews(seen, { dive: { low: 1 }, rocket: 2, whistle: 1 }), []);
  const fx = createFx();
  fxEvent(fx, 'lowPass');
  fxEvent(fx, 'whistle');
  assert.deepEqual(
    fx.popups.map(p => p.style),
    ['success', 'note'],
  );
  assert.equal(fx.hitstop, 0, 'no hitstop for abilities');
});

test('C3 ui.js: one button routes through flightInput, release on cancel/blur, chip and live region in index.html', () => {
  const ui = compact(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8')),
    html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(!ui.includes('eventInput('), 'all flight input goes through the Z6 router');
  for (const k of ["flightInput(f,'down')", "flightInput(f,'up')", "flightInput(f,'cancel')"])
    assert.ok(ui.includes(k), k);
  assert.ok(
    ui.includes("window.addEventListener('blur',()=>{if(held)cancelHold();flightCancel();"),
  );
  for (const id of ['aim-pockets', 'pocket-list', 'pocket-hint', 'ability-chip', 'ability-live'])
    assert.ok(html.includes(`id="${id}"`), id);
  assert.match(html, /id="ability-live" class="sr-only" role="status" aria-live="polite"/);
  assert.ok(
    !/id="ability-chip"[^>]*aria-live/.test(html),
    'the chip itself is not live, only state changes are',
  );
});

test('C3 oprava: událost odložená drženým Dive má plné varování od skutečného začátku', async () => {
  const { gameFlight, step, flightInput } = await import('../src/core.js');
  const { fresh, kitOf } = await import('../src/gear.js').then(async g => ({
    ...g,
    fresh: (await import('../src/core.js')).fresh,
  }));
  let checked = 0;
  for (let n = 2; n <= 40; n++) {
    const p = fresh();
    p.best = 5000;
    p.levels = { power: 3, paper: 6, folds: 3 };
    p.atlas.pockets = { owned: 2, slots: ['dive', 'sharp'] };
    const f = gameFlight(kitOf(p), n, 24, 0.9);
    let holding = false;
    while (!f.landed && f.t < 6) {
      if (!holding && f.t >= 0.52) holding = flightInput(f, 'down').id === 'dive';
      step(f);
    }
    for (const e of f.events)
      if (e.start != null && e.start > e.at + 0.05) {
        checked++;
        assert.ok(e.w.open > e.start, 'okno se otevře až po varování od skutečného začátku');
        assert.notEqual(
          e.result === 'miss' && e.doneAt != null && e.doneAt <= e.start + 1e-6,
          true,
        );
      }
  }
  assert.ok(checked > 0, 'aspoň jedna událost byla odložená drženým Dive');
});
