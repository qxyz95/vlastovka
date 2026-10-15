// C2b: vstupy nových událostí (pára, termika, lampion, hvězda), první setkání, popupy half/partial, hlášení komba.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  fresh,
  kitOf,
  gameFlight,
  step,
  eventInput,
  activeEvent,
  feedbackOf,
  FINISH,
} from '../src/core.js';
import { NEW_EVENT_TYPES } from '../src/gear.js';
import { maxLevelOf } from '../src/atlas.js';
import { PROGRESSION as P } from '../src/progression-numbers.js';
import {
  createFx,
  fxEvent,
  resultFx,
  isFirstMeet,
  meetScale,
  MEET_SLOW,
  comboNews,
  COMBO_SAY,
} from '../src/juice.js';
import { eventView, EVENT_VIEWS } from '../src/render3d/events-view.js';
import { qteCenter } from '../src/audio-mix.js';
import { windows } from '../src/events.js';
import { setLang, setStrict, t, has } from '../src/i18n.js';
import { compact } from './helpers/compact.js';
import * as SIM from '../simulation/progression/model.mjs';

setStrict(true);
setLang('en');
const fullKit = n => {
  const p = { ...fresh(), attempts: n - 1, best: FINISH, model: 'glider' };
  p.levels = { power: 3, paper: 12, folds: 3 };
  for (const id of P.atlas.bonuses) p.atlas.levels[id] = maxLevelOf(id) - 1;
  return kitOf(p);
};
const ctx = n => ({ key: 'game', n, angle: 26, charge: 0.9, exact: true });
// Hra (core.step) a simulátor (model.mjs step + updateEvents) v lockstepu; ve stejném kroku stejné vstupy.
// pick(e) -> časy stisků v události; vrací {e, res: [[hra, simulátor], …], g, s} pro první událost typu type (u dvojice i follow).
function drive(type, pick, { follow = false, warn = false } = {}) {
  for (let n = 1; n < 400; n++) {
    const kit = fullKit(n),
      g = gameFlight(kit, n, 26, 0.9),
      s = SIM.createFlight(kit, { ...ctx(n), profile: 'scripted' }),
      res = [];
    let target = null,
      times = null;
    while (!g.landed && g.t < P.physics.maxT) {
      const e = activeEvent(g);
      if (!target && e?.type === type && (!follow || e.follow) && e.phase === 'warning') {
        target = e;
        times = pick(e);
        if (warn) res.push([eventInput(g, 'down'), SIM.press(s)]);
      }
      if (target && e === target && times.length && g.t >= times[0] - 1e-9 && !e.result) {
        times.shift();
        res.push([eventInput(g, 'down'), SIM.press(s)]);
      }
      if (target && target.phase === 'done') return { e: target, res, g, s };
      step(g);
      SIM.step(s);
      SIM.updateEvents(s);
    }
  }
  throw new Error('no ' + type);
}
const same = r => {
  for (const [a, b] of r.res) assert.equal(a, b);
  assert.ok(Math.abs(r.g.x - r.s.x) <= 1e-9 && Math.abs(r.g.vx - r.s.vx) <= 1e-9);
  assert.equal(r.g.combo, r.s.combo);
  return r.e.result;
};

test('new events are in the game once found; every input type plays like press() of the simulator', () => {
  assert.ok(NEW_EVENT_TYPES.every(id => kitOf({ ...fresh(), best: FINISH }).atlas[id] >= 1));
  // pára: dva ťuky, každý ve svém okně; jeden ťuk = partial (½); stisk ve varování nic nestojí
  assert.ok(['success', 'perfect'].includes(same(drive('steam', e => [...e.w.c], { warn: true }))));
  assert.equal(same(drive('steam', e => [e.w.c[0]])), 'partial');
  assert.equal(same(drive('steam', e => [e.w.c[1]])), 'partial');
  // termika: jeden ťuk; v jádru úspěch/perfekt, jinde ve sloupci half
  assert.ok(['success', 'perfect'].includes(same(drive('thermal', e => [e.w.c]))));
  assert.equal(same(drive('thermal', e => [e.w.c + (e.w.s + e.w.col) / 2])), 'half');
  // lampion: ťuk před kontaktem; druhý kus dvojice má štítek Again! ve varování
  assert.ok(['success', 'perfect'].includes(same(drive('drone', e => [e.w.c]))));
  assert.equal(same(drive('drone', e => [e.w.close + 1])), 'miss');
  const pair = drive('drone', e => [e.w.c], { follow: true });
  assert.ok(['success', 'perfect'].includes(same(pair)));
  // hvězda: ťuk, každý zásah je perfekt
  assert.equal(same(drive('star', e => [e.w.c])), 'perfect');
  assert.equal(same(drive('star', e => [e.w.c + e.w.s + 0.2])), 'miss');
});

test('warning press returns null and is not punished; feedback keys exist for half and partial', () => {
  const r = drive('thermal', e => [e.w.c], { warn: true });
  assert.deepEqual(r.res[0], [null, null]);
  assert.ok(['success', 'perfect'].includes(r.e.result));
  for (const k of ['half', 'partial', 'success', 'perfect', 'miss'])
    assert.ok(has('feedback.' + k));
  const h = drive('thermal', e => [e.w.c + (e.w.s + e.w.col) / 2]);
  assert.equal(h.e.result, 'half');
});

test('event views: thermal is one tap, steam two, the second of a pair says Again!', () => {
  for (const type of NEW_EVENT_TYPES) assert.equal(EVENT_VIEWS[type].verb, 'tap', type);
  assert.equal(EVENT_VIEWS.thermal.caption, '↑ TAP');
  assert.equal(EVENT_VIEWS.steam.caption, '↓↓ TAP TAP');
  const e = { type: 'drone', phase: 'warning', at: 0, result: null };
  assert.equal(eventView(e).label, t('event.warning'));
  assert.equal(eventView({ ...e, follow: true }).label, '↻ AGAIN!');
  assert.equal(eventView({ ...e, follow: true, phase: 'interaction' }).label, '↓ TAP');
  setLang('cs');
  assert.equal(eventView({ ...e, follow: true }).label, '↻ ZNOVU!');
  assert.equal(EVENT_VIEWS.thermal.caption, '↑ KLEPNI');
  setLang('en');
});

test('first meeting: only new types, once, slowed 0.5× in the warning only; reduced motion keeps only the sentence', () => {
  const met = [],
    e = { type: 'steam', phase: 'warning' };
  assert.equal(isFirstMeet({ type: 'gust' }, met, NEW_EVENT_TYPES), false);
  assert.equal(isFirstMeet(e, met, NEW_EVENT_TYPES), true);
  met.push(e.type);
  assert.equal(isFirstMeet({ type: 'steam', phase: 'warning' }, met, NEW_EVENT_TYPES), false);
  assert.equal(meetScale(e, e, false), MEET_SLOW);
  assert.equal(MEET_SLOW, 0.5);
  assert.equal(meetScale(e, e, true), 1);
  assert.equal(meetScale({ ...e, phase: 'interaction' }, e, false), 1);
  assert.equal(meetScale({ ...e }, e, false), 1, 'another event');
  for (const type of NEW_EVENT_TYPES) {
    setLang('en');
    const en = t('hint.' + type);
    setLang('cs');
    assert.ok(en && t('hint.' + type) && en !== t('hint.' + type), type);
  }
  setLang('en');
});

test('popups: half and partial show ½ without hitstop; success keeps its hitstop', () => {
  assert.equal(resultFx('half'), 'partial');
  assert.equal(resultFx('partial'), 'partial');
  assert.equal(resultFx('perfect'), 'perfect');
  assert.equal(resultFx('interrupted'), null);
  assert.equal(resultFx(null), null);
  const fx = createFx();
  fxEvent(fx, 'partial');
  assert.equal(fx.hitstop, 0);
  assert.equal(fx.trauma, 0);
  assert.deepEqual(
    fx.popups.map(p => [p.text, p.style]),
    [['½', 'half']],
  );
  fxEvent(fx, 'success');
  assert.ok(fx.hitstop > 0);
});

test('combo for screen readers: only changes of ×N and the break, at most once per 2 s', () => {
  let s = { n: 0, at: -Infinity },
    r;
  r = comboNews(s, 0, 0);
  assert.equal(r.say, null);
  r = comboNews(s, 1, 1);
  assert.deepEqual(r.say, { key: 'qte.combo', n: 1 });
  s = r.s;
  assert.equal(comboNews(s, 3, 1 + COMBO_SAY - 0.1).say, null, 'too soon');
  r = comboNews(s, 3, 1 + COMBO_SAY);
  assert.deepEqual(r.say, { key: 'qte.combo', n: 3 });
  s = r.s;
  assert.equal(comboNews(s, 3, 10).say, null, 'no change');
  assert.deepEqual(comboNews(s, 0, 10).say, { key: 'qte.comboBroken', n: 0 });
  assert.equal(t('qte.combo', { n: 3 }), 'Combo ×3');
});

test('audio: new event types do not break the QTE tick (no tick, no throw)', () => {
  for (const type of NEW_EVENT_TYPES)
    assert.equal(qteCenter({ type, result: null, heldAt: null, at: 1 }, windows(null)), null);
});

test('ui.js: first meeting slows the loop, half/partial feedback, combo anchor and aria-live', () => {
  const ui = compact(readFileSync(new URL('../src/ui.js', import.meta.url), 'utf8'));
  for (const s of [
    'advance(f,acc,elapsed*meetScale(ev,meet,reduced),frozen,onStep)',
    'isFirstMeet(ev,met,NEW_EVENT_TYPES)',
    'const kind=resultFx(e.result)',
    'combo:comboAnchor??true',
    "comboLive.setAttribute('aria-live','polite')",
    "t('hint.'+e.type)",
  ])
    assert.ok(ui.includes(compact(s)), s);
  assert.ok(feedbackOf({ lastEv: { resolvedAt: 0, result: 'half' }, t: 0.5 }) === 'feedback.half');
});
