import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mixTargets,
  comboAfter,
  trackFor,
  boundaryCue,
  nextBoundary,
  duck,
  duckPoints,
  scaleNote,
  inScale,
  comboNote,
  hz,
  MODES,
  ARC,
  ROUTE_METERS,
  qteCenter,
  createTickPlanner,
  audioSettings,
  AUDIO_DEFAULTS,
  rngFor,
  euclid,
  FAST,
  MUSIC_FILTER,
  MUSIC_HOLD,
  INTENSITY,
  silenceMask,
  inMask,
  masked,
  switchAllowed,
  boundaryPlan,
  fatigue,
  duckPlan,
  duckValue,
  eventCentres,
  audioState,
  KEY,
} from '../src/audio-mix.js';
import { TRACKS, TRACK_IDS } from '../src/music/index.js';
import { VOICE_NAMES } from '../src/music/synth.js';
import { phrase, swing, near, chord } from '../src/music/compose.js';
import { blindMap, summary } from '../prototype/music/blind.js';
import { createFlight, step, eventInput, activeEvent } from '../src/core.js';
import { windows, TIMING } from '../src/events.js';
import { SECTION_METERS, SCREEN_METERS } from '../src/scenes.js';
import { createAudio } from '../src/audio.js';
import { createSfx } from '../src/sfx.js';
import { fakeContext } from './helpers/fake-audio.js';

test('mix states: workshop bed only, aim adds the pulse, flight adds groove after a hit or at speed', () => {
  const L = s => mixTargets(s).layers;
  assert.deepEqual(
    L({ screen: 'workshop' }).map(v => v > 0),
    [true, false, false, false],
  );
  assert.deepEqual(
    L({ screen: 'result' }).map(v => v > 0),
    [true, false, false, false],
  );
  assert.deepEqual(
    L({ screen: 'aim' }).map(v => v > 0),
    [true, true, false, false],
  );
  assert.equal(L({ screen: 'flight', speed: 1 })[2], 0);
  assert.ok(L({ screen: 'flight', speed: 1, hits: 1 })[2] > 0);
  assert.ok(L({ screen: 'flight', speed: FAST + 0.1 })[2] > 0);
  assert.ok(
    mixTargets({ screen: 'flight', speed: 1.6 }).filter >
      mixTargets({ screen: 'flight', speed: 1 }).filter,
    'speed opens the filter',
  );
  assert.ok(mixTargets({ screen: 'workshop' }).filter < mixTargets({ screen: 'flight' }).filter);
  assert.ok(
    mixTargets({ screen: 'flight', height: 100 }).reverb >
      mixTargets({ screen: 'flight', height: 0 }).reverb,
  );
});
test('warning and window thin the mix: pad low-passed, drums almost gone, bass pulse kept, nothing added', () => {
  const base = mixTargets({ screen: 'flight', hits: 2, combo: 3 }),
    warn = mixTargets({ screen: 'flight', hits: 2, combo: 3, event: 'warning' }),
    win = mixTargets({ screen: 'flight', hits: 2, combo: 3, event: 'window' });
  for (const m of [warn, win]) {
    assert.ok(m.urgent);
    assert.ok(m.padFilter < base.padFilter);
    assert.ok(m.layers[2] < base.layers[2] * 0.2);
    assert.equal(m.layers[1], base.layers[1]);
    m.layers.forEach((v, i) => assert.ok(v <= base.layers[i]));
  }
  assert.equal(mixTargets({ screen: 'flight', hits: 2, event: 'effect' }).urgent, false);
  assert.equal(
    mixTargets({ screen: 'aim', event: 'warning' }).urgent,
    false,
    'only a flight thins',
  );
  const calm = mixTargets({ screen: 'flight', hits: 2, combo: 3, calm: true });
  assert.ok(calm.layers[2] < base.layers[2] && calm.layers[3] < base.layers[3]);
});
test('combo layer only from consecutive successes; octave from combo 3; a miss resets', () => {
  let c = 0;
  for (const r of ['success', 'perfect']) c = comboAfter(c, r);
  assert.equal(c, 2);
  assert.equal(comboAfter(c, 'interrupted'), 2);
  assert.equal(comboAfter(c, 'miss'), 0);
  assert.equal(mixTargets({ screen: 'flight', combo: 1 }).layers[3], 0);
  assert.ok(mixTargets({ screen: 'flight', combo: 2 }).layers[3] > 0);
  assert.equal(mixTargets({ screen: 'flight', combo: 2 }).octave, false);
  assert.equal(mixTargets({ screen: 'flight', combo: 3 }).octave, true);
  assert.equal(mixTargets({ screen: 'aim', combo: 5 }).layers[3], 0, 'no lead outside the flight');
});
test('quantisation to the next beat or bar', () => {
  assert.equal(nextBoundary(0, 120, 0, 1), 0);
  assert.ok(Math.abs(nextBoundary(0.1, 120, 0, 1) - 0.5) < 1e-9);
  assert.ok(Math.abs(nextBoundary(0.5, 120, 0, 1) - 0.5) < 1e-9, 'on the grid stays');
  assert.ok(Math.abs(nextBoundary(2.1, 120, 0, 4) - 4) < 1e-9);
  assert.ok(Math.abs(nextBoundary(10.3, 100, 10, 1) - 10.6) < 1e-9);
  assert.equal(nextBoundary(3, 100, 5, 4), 5, 'before the start → start');
});
test('track choice follows the frontier, not the plane, and is stable', () => {
  assert.deepEqual(trackFor({ best: 0 }), {
    direction: 'E',
    district: 0,
    place: 0,
    finale: false,
    id: 'E0',
  });
  assert.equal(trackFor({ best: SECTION_METERS - 1 }).district, 0);
  assert.equal(trackFor({ best: SECTION_METERS }).district, 1);
  assert.equal(trackFor({ best: SECTION_METERS * 3.5 }, 'E').id, 'E3');
  assert.equal(trackFor({ best: ROUTE_METERS }).finale, true);
  assert.equal(trackFor({ best: 1e9 }).district, 3);
  assert.equal(trackFor({ best: NaN }).district, 0);
  assert.equal(trackFor({ best: -5 }).district, 0);
  // Same frontier → same track whatever the plane does.
  for (let x = 0; x < ROUTE_METERS; x += 97) assert.equal(trackFor({ best: 1500, x }).id, 'E1');
  assert.equal(boundaryCue(100, 200, 0), null);
  assert.deepEqual(boundaryCue(SECTION_METERS - 1, SECTION_METERS + 1, 500), {
    district: 1,
    type: 'new',
  });
  assert.deepEqual(boundaryCue(SECTION_METERS - 1, SECTION_METERS + 1, 3000), {
    district: 1,
    type: 'revisit',
  });
  assert.equal(boundaryCue(ROUTE_METERS - 1, ROUTE_METERS + 1, 0).district, 4, 'finale');
});
test('scale notes: tonic D, modes, octaves, pentatonic combo 1-2-3-5-6-8', () => {
  assert.equal(scaleNote('D', 'ionian', 0), 62);
  assert.equal(scaleNote('D', 'dorian', 2), 65);
  assert.equal(scaleNote('D', 'lydian', 3), 68);
  assert.equal(scaleNote('D', 'aeolian', 7), 74);
  assert.equal(scaleNote('D', 'aeolian', -1), 60);
  assert.equal(scaleNote('D', 'ionian', 0, 2), 38);
  assert.ok(Math.abs(hz(69) - 440) < 1e-9);
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6, 9].map(n => comboNote(n) - comboNote(1)),
    [0, 2, 4, 7, 9, 12, 12],
  );
  for (const mode of Object.keys(MODES))
    for (let d = -10; d < 20; d++) assert.ok(inScale(scaleNote('D', mode, d), 'D', mode));
  assert.equal(inScale(63, 'D', 'ionian'), false);
});
test('ducking envelope: dips to the target dB, returns to unity', () => {
  const at = 5,
    o = { db: -6, attack: 0.02, hold: 0.2, release: 0.3 };
  assert.equal(duck(4.9, at, o), 1);
  assert.ok(Math.abs(duck(5.1, at, o) - 10 ** (-6 / 20)) < 1e-9);
  assert.equal(duck(5.6, at, o), 1);
  assert.ok(duck(5.35, at, o) > duck(5.1, at, o) && duck(5.35, at, o) < 1, 'release ramps back');
  const pts = duckPoints(at, o);
  assert.equal(pts.length, 4);
  pts.reduce((a, b) => {
    assert.ok(b[0] > a[0]);
    return b;
  });
  assert.equal(pts[0][1], 1);
  assert.equal(pts.at(-1)[1], 1);
});
test('seeded generators are deterministic', () => {
  const a = rngFor(1, 'A', 2),
    b = rngFor(1, 'A', 2),
    c = rngFor(2, 'A', 2),
    x = [a(), a(), a()];
  assert.deepEqual(x, [b(), b(), b()]);
  assert.notDeepEqual(x, [c(), c(), c()]);
  assert.deepEqual(euclid(3, 8).map(Number), [1, 0, 0, 1, 0, 0, 1, 0]);
  assert.equal(euclid(5, 16).filter(Boolean).length, 5);
  assert.equal(swing(0.5, 0.62), 0.62);
  assert.equal(swing(1, 0.62), 1);
  assert.ok(Math.abs(swing(0.25, 0.6, 0.5) - 0.3) < 1e-9);
  assert.equal(swing(0.5, 0.6, 0.5), 0.5);
  assert.deepEqual(phrase(13), { p: 1, pos: 5, section: 'B', cycle: 0, first: false, last: false });
  assert.deepEqual(near(chord('dorian', 0, 4, 3), 60), [57, 60, 62, 65]);
  for (const id of TRACK_IDS)
    for (let d = 0; d < 4; d++)
      assert.deepEqual(
        TRACKS[id].bar(37, d, { seed: 5, density: 0.5 }),
        TRACKS[id].bar(37, d, { seed: 5, density: 0.5 }),
        id + d,
      );
});
test('three candidates × four districts: valid events, notes in the district mode, every layer used, BPM in range', () => {
  assert.deepEqual(TRACK_IDS, ['B', 'E', 'G']);
  for (const id of TRACK_IDS) {
    const t = TRACKS[id];
    assert.equal(t.districts.length, 4, id);
    for (let d = 0; d < 4; d++) {
      const dd = t.districts[d],
        used = new Set();
      assert.ok(dd.bpm >= 55 && dd.bpm <= 140, id + d);
      assert.ok(MODES[dd.mode], id + d);
      for (let i = 0; i < 48; i++)
        for (const e of t.bar(i, d, { seed: 1, density: 0.8 })) {
          assert.ok(VOICE_NAMES.includes(e.i), `${id}${d} voice ${e.i}`);
          assert.ok([0, 1, 2, 3].includes(e.l));
          assert.ok(e.b >= 0 && e.b < 4, `${id}${d} beat ${e.b}`);
          assert.ok(e.d > 0 && e.v > 0 && e.v <= 1.2, `${id}${d} ${e.i}`);
          for (const n of [e.n, ...(e.o?.notes ?? [])])
            if (n != null)
              assert.ok(inScale(n, 'D', dd.mode), `${id}${d} ${e.i} ${n} not in D ${dd.mode}`);
          used.add(e.l);
        }
      assert.equal(used.size, 4, `${id}${d} uses all layers`);
    }
  }
});
test('loop length: at least 2 minutes of non-repeating material per district, no phrase repeats back to back', () => {
  for (const id of TRACK_IDS)
    for (let d = 0; d < 4; d++) {
      const t = TRACKS[id],
        bars = Math.ceil(180 / ((4 * 60) / t.districts[d].bpm)),
        sig = [];
      for (let p = 0; p * 8 < bars; p++) {
        let s = '';
        for (let i = p * 8; i < p * 8 + 8; i++)
          s += JSON.stringify(t.bar(i, d, { seed: 1, density: 0.5 }));
        sig.push(s);
      }
      sig.forEach((s, i) => i && assert.notEqual(s, sig[i - 1], `${id}${d} phrase ${i}`));
      const secs = (new Set(sig).size * 8 * 4 * 60) / t.districts[d].bpm;
      assert.ok(secs >= 120, `${id}${d}: ${secs.toFixed(0)} s unique`);
    }
});
test('QTE tick planned on the window centre with a fake audio clock, re-planned after a hitstop, cancelled on resolve', () => {
  const f = createFlight('dart', { power: 0, paper: 0, fold: 0 }, 1),
    w = windows(f),
    ctx = { currentTime: 10, outputLatency: 0.02 },
    played = [],
    cancelled = [];
  const planner = createTickPlanner((when, e) => {
    played.push(when);
    return { cancel: () => cancelled.push(when) };
  });
  while (!activeEvent(f)) step(f);
  const e = activeEvent(f);
  assert.equal(e.type, 'gust');
  assert.equal(e.phase, 'warning');
  const center = qteCenter(e, w);
  assert.equal(
    center,
    e.w.c,
    'the exact centre of the running event (floating centre, real start)',
  );
  assert.ok(Math.abs(center - ((e.start ?? e.at) + TIMING.gustCenter + e.off)) < 1e-9);
  const when = planner.update(ctx, f.t, e, w);
  assert.ok(
    Math.abs(when - (10 + center - f.t - 0.02)) < 1e-9,
    'not quantised, latency compensated',
  );
  ctx.currentTime += 0.005;
  assert.equal(planner.update(ctx, f.t + 0.005, e, w), when, 'small jitter keeps the plan');
  assert.equal(played.length, 1);
  ctx.currentTime += 0.1;
  const later = planner.update(ctx, f.t + 0.005, e, w);
  assert.ok(Math.abs(later - when - 0.1) < 1e-9, 'hitstop (flight time frozen) shifts the tick');
  assert.deepEqual(cancelled, [when]);
  assert.equal(played.length, 2);
  assert.ok(
    Math.abs(planner.update(ctx, f.t + 0.005, e, w, 0.03) - later - 0.03) < 1e-9,
    'calibration offset',
  );
  while (e.phase !== 'interaction') step(f);
  eventInput(f, 'down');
  assert.ok(e.result);
  assert.equal(planner.update(ctx, f.t, e, w), null);
  assert.equal(cancelled.length, 3, 'resolved early → pending tick cancelled');
  const bird = { type: 'bird', at: 0, heldAt: null, phase: 'interaction', result: null };
  assert.equal(qteCenter(bird, w), null, 'pigeon: tick only once held');
  bird.heldAt = 3;
  assert.ok(Math.abs(qteCenter(bird, w) - (3 + TIMING.birdCenter)) < 1e-9);
});
test('audio settings: defaults music 60 %, effects 80 %, invalid values ignored, ranges clamped', () => {
  assert.deepEqual(audioSettings(null), AUDIO_DEFAULTS);
  assert.equal(AUDIO_DEFAULTS.music, 0.6);
  assert.equal(AUDIO_DEFAULTS.sfx, 0.8);
  assert.equal(AUDIO_DEFAULTS.muted, false);
  assert.deepEqual(
    audioSettings({ music: 2, sfx: -1, tick: 'no', latency: 5, master: NaN, muted: true, x: 1 }),
    { ...AUDIO_DEFAULTS, music: 1, sfx: 0, latency: 0.3, muted: true },
  );
  assert.deepEqual(audioSettings('garbage'), AUDIO_DEFAULTS);
});
test('every district has a 4–6 note leitmotif filling one bar', () => {
  for (const a of ARC) {
    assert.ok(a.motif.length >= 4 && a.motif.length <= 6, a.id);
    assert.equal(
      a.rhythm.reduce((s, x) => s + x, 0),
      8,
      a.id,
    );
  }
});
test('blind mode: X1–X3 is a stable permutation of B, E and Diorama per session, summary averages by direction', () => {
  const m = blindMap(7);
  assert.deepEqual(Object.keys(m), ['X1', 'X2', 'X3']);
  assert.deepEqual(Object.values(m).sort(), TRACK_IDS);
  assert.deepEqual(blindMap(7), m);
  const s = summary({
    ratings: [
      { dir: 'B', scores: { mood: 4, fatigue: 2 } },
      { dir: 'B', scores: { mood: 2, fatigue: 4 } },
      { dir: 'E', scores: { mood: 5 } },
    ],
    fatigue: [{ dir: 'B', minute: 10, score: 3 }],
    qte: { B: { n: 4, hit: 3, perfect: 1 } },
  });
  assert.deepEqual(s.B.scores, { mood: 3, fatigue: 3 });
  assert.equal(s.B.n, 2);
  assert.equal(s.E.scores.mood, 5);
  assert.equal(s.B.fatigue[10], 3);
  assert.equal(s.B.perfectRate, 0.25);
});
test('registry holds B, E and Diorama (G); neon voices are gone from the synth', () => {
  assert.deepEqual(Object.keys(TRACKS), ['B', 'E', 'G']);
  assert.deepEqual(TRACK_IDS, ['B', 'E', 'G']);
  for (const v of ['pulse', 'chiparp', 'cnoise', 'ckick', 'brass', 'scratch'])
    assert.ok(!VOICE_NAMES.includes(v), v);
  for (const v of ['vinyl', 'rain', 'sax']) assert.ok(VOICE_NAMES.includes(v), v + ' is used by B');
});

// ---------- Diorama (research/hudba/03 F.3) ----------
const close = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;
test('T-1 every ARC theme: 4–6 notes in one bar, leaps up 4 degrees, peak after the first note, ends below the peak, only the finale lands on 0', () => {
  for (const a of ARC) {
    const m = a.motif,
      top = Math.max(...m),
      at = m.indexOf(top);
    assert.ok(m.length >= 4 && m.length <= 6, a.id);
    assert.equal(
      a.rhythm.reduce((s, x) => s + x, 0),
      8,
      a.id,
    );
    assert.equal(m[1] - m[0], 4, a.id + ' first interval');
    assert.ok(at > 0, a.id + ' peak after the first note');
    assert.ok(m.at(-1) < top, a.id + ' ends below the peak');
    assert.equal(m.at(-1) === 0, a.id === 'finale', a.id + ' landing on the tonic');
  }
});
test('T-2 modes of the day: lydian, ionian, mixolydian, dorian, lydian on the tonic D', () => {
  assert.equal(KEY, 'D');
  assert.deepEqual(
    ARC.map(a => a.mode),
    ['lydian', 'ionian', 'mixolydian', 'dorian', 'lydian'],
  );
  assert.deepEqual(
    ARC.map(a => a.id),
    ['violet', 'moon', 'sunset', 'core', 'finale'],
    'ids stay',
  );
  assert.deepEqual(
    ARC.map(a => a.name),
    ['Sunrise Roofs', 'Bright Harbor', 'Golden Fields', 'Lantern City', 'Delivered'],
  );
  for (const a of ARC) assert.ok(!/neon|moon|night|second sunset/i.test(a.name + a.mood), a.id);
});
test('T-8 comboNote(n, 5, mode) stays in the mode and never falls; Lantern City combo uses F', () => {
  for (const mode of ['lydian', 'ionian', 'mixolydian', 'dorian']) {
    let prev = -Infinity;
    for (let n = 1; n <= 8; n++) {
      const x = comboNote(n, 5, mode);
      assert.ok(inScale(x, 'D', mode), `${mode} ${n}`);
      assert.ok(x >= prev, `${mode} ${n} rises`);
      prev = x;
    }
    assert.equal(comboNote(6, 5, mode) - comboNote(1, 5, mode), 12, mode + ' ends on the octave');
  }
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map(n => comboNote(n, 5, 'dorian') % 12),
    [2, 4, 5, 9, 11, 2],
    'D E F A B D',
  );
});
test('M-1 warning and window: lead silent, whole music at 1.8 kHz; effect: layers back, filter still 1.8 kHz', () => {
  const s = { screen: 'flight', hits: 2, combo: 3, speed: 1.2 },
    calm = mixTargets(s);
  assert.ok(calm.musicFilter > 10000, 'open in calm flight');
  assert.equal(MUSIC_FILTER, 1800);
  for (const event of ['warning', 'window']) {
    const m = mixTargets({ ...s, event });
    assert.equal(m.layers[3], 0, event);
    assert.equal(m.musicFilter, 1800);
    m.layers.forEach((v, i) => assert.ok(close(v, INTENSITY[event].layers[i]), `${event} L${i}`));
  }
  const fx = mixTargets({ ...s, event: 'effect' });
  assert.deepEqual(fx.layers, calm.layers);
  assert.equal(fx.musicFilter, 1800);
  assert.equal(fx.urgent, false);
  assert.ok(mixTargets({ screen: 'aim', event: 'warning' }).musicFilter > 1800, 'only a flight');
  assert.deepEqual(mixTargets({ screen: 'workshop' }).layers, INTENSITY.workshop.layers);
  assert.deepEqual(mixTargets({ screen: 'result' }).layers, INTENSITY.result.layers);
  assert.deepEqual(mixTargets({ screen: 'aim' }).layers, INTENSITY.aim.layers);
});
test('M-2 hysteresis: a steam event (warning → window → window → effect) never opens the filter before effectEnd + 0.3 s', () => {
  const effectEnd = 3.1,
    phase = t => (t < 0.8 ? 'warning' : t < 2.5 ? 'window' : t < effectEnd ? 'effect' : 'none');
  let opened = null;
  for (let t = 0; t < 5; t += 1 / 60) {
    const ev = phase(t),
      m = mixTargets({
        screen: 'flight',
        event: ev,
        flightT: t,
        effectEnd: ev === 'effect' || ev === 'none' ? effectEnd : null,
        hits: 1,
      });
    if (t < effectEnd + MUSIC_HOLD - 1e-9) assert.ok(m.musicFilter <= 1800, `t ${t.toFixed(3)}`);
    else if (opened === null && m.musicFilter > 1800) opened = t;
  }
  assert.ok(
    opened !== null && opened < effectEnd + MUSIC_HOLD + 0.02,
    'opens right after the hold',
  );
});
test('M-3 silence mask: ±120 ms, masks closer than 0.4 s merge, edges count', () => {
  const m = silenceMask([8.63, 8.13]);
  assert.equal(m.length, 1);
  assert.ok(close(m[0][0], 8.01) && close(m[0][1], 8.75), JSON.stringify(m));
  const two = silenceMask([2.0, 3.0]);
  assert.equal(two.length, 2);
  assert.ok(close(two[0][1], 2.12) && close(two[1][0], 2.88));
  assert.ok(inMask(m[0][0], m) && inMask(m[0][1], m), 'edges are inside');
  assert.ok(!inMask(m[0][0] - 0.001, m) && !inMask(m[0][1] + 0.001, m));
  assert.ok(!inMask(2.5, two) && inMask(2.95, two));
  assert.deepEqual(silenceMask([]), []);
  assert.deepEqual(silenceMask([NaN, null]), []);
  assert.ok(masked({ l: 1, t: 2 }, two) && masked({ l: 2, t: 2.1 }, two));
  assert.ok(!masked({ l: 0, t: 2 }, two) && !masked({ l: 3, t: 2 }, two));
  assert.ok(!masked({ l: 1, t: 2.5 }, two));
});
test('M-4 boundaryPlan: revisit → null, new in an event → defer, new in calm → stinger at most once per flight', () => {
  const S = SECTION_METERS;
  assert.equal(boundaryPlan(S - 1, S + 1, 5000), null, 'known district: nothing');
  assert.equal(boundaryPlan(100, 200, 0), null);
  const ev = boundaryPlan(S - 1, S + 1, 100, { held: true });
  assert.equal(ev.type, 'new');
  assert.equal(ev.defer, true);
  const calm = boundaryPlan(S - 1, S + 1, 100, { held: false, stingers: 0 });
  assert.equal(calm.defer, false);
  assert.equal(calm.stinger, true);
  assert.equal(calm.district, 1);
  assert.equal(boundaryPlan(2 * S - 1, 2 * S + 1, 100, { stingers: 1 }).stinger, false);
  let stingers = 0;
  for (let x = 0; x < 3 * S; x += 7)
    if (boundaryPlan(x, x + 7, 0, { stingers })?.stinger) stingers++;
  assert.equal(stingers, 1, 'a flight over two new boundaries: one stinger');
});
test('M-5 switchAllowed: never in an event, never when the bar starts < 0.5 s before the next warning', () => {
  assert.equal(switchAllowed({ t: 10, barTime: 10.5, urgent: true }), false);
  assert.equal(switchAllowed({ t: 10, barTime: 10.5, calmUntil: 10.9 }), false);
  assert.equal(switchAllowed({ t: 10, barTime: 10.5, calmUntil: 11.0 }), true);
  assert.equal(switchAllowed({ t: 10, barTime: 10.5 }), true, 'no warning planned');
  assert.equal(switchAllowed({ t: 10, barTime: 9.9 }), false, 'never into the past');
});
test('M-6 fatigue: 12 min in one district → the next Workshop visit rests 45–60 s; every 3rd Result visit is bed only', () => {
  assert.equal(fatigue({ screen: 'workshop', minutesInDistrict: 11.9 }).rest, 0);
  for (let seed = 1; seed < 40; seed++) {
    const r = fatigue({ screen: 'workshop', minutesInDistrict: 12, seed }).rest;
    assert.ok(r >= 45 && r <= 60, `${seed}: ${r}`);
  }
  assert.ok(fatigue({ screen: 'atlas', minutesInDistrict: 20 }).rest >= 45);
  assert.equal(fatigue({ screen: 'flight', minutesInDistrict: 30 }).rest, 0, 'never in flight');
  assert.equal(fatigue({ screen: 'result', minutesInDistrict: 30 }).rest, 0);
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].map(visits => fatigue({ screen: 'result', visits }).bedOnly),
    [false, false, true, false, false, true],
  );
  assert.equal(fatigue({ screen: 'flight', visits: 3 }).bedOnly, false);
});
test('M-7 trackFor: place 0–3 on the 304.8 m boundaries, district unchanged', () => {
  assert.ok(Math.abs(SCREEN_METERS - 304.8) < 0.05);
  for (let d = 0; d < 4; d++)
    for (let p = 0; p < 4; p++) {
      const at = d * SECTION_METERS + p * SCREEN_METERS,
        tr = trackFor({ best: at });
      assert.deepEqual([tr.district, tr.place], [d, p], `${d}/${p}`);
      if (at > 0)
        assert.equal(trackFor({ best: at - 0.01 }).place, (p + 3) % 4, `before ${d}/${p}`);
    }
  assert.equal(trackFor({ best: ROUTE_METERS }).place, 3);
  assert.equal(trackFor({ best: ROUTE_METERS }).finale, true);
  assert.equal(trackFor({ best: SECTION_METERS * 2.6 }).district, 2);
});
test('steam: two centres, the planner ticks the second puff after the first one played', () => {
  const e = { type: 'steam', phase: 'interaction', result: null, puff: 0, w: { c: [5, 5.5] } };
  assert.deepEqual(eventCentres(e), [5, 5.5]);
  assert.equal(qteCenter(e, windows(null)), 5);
  const ctx = { currentTime: 100 },
    played = [],
    planner = createTickPlanner(when => {
      played.push(when);
      return { cancel() {} };
    });
  planner.update(ctx, 4, e, windows(null));
  assert.deepEqual(played, [101]);
  ctx.currentTime = 101.1;
  e.puff = 1;
  planner.update(ctx, 5.1, e, windows(null));
  assert.ok(close(played[1], 101.5), JSON.stringify(played));
  assert.deepEqual(eventCentres({ ...e, result: 'success' }), []);
  const bird = { type: 'bird', phase: 'interaction', heldAt: null, w: { c: 0.8 } };
  assert.deepEqual(eventCentres(bird), []);
  assert.deepEqual(eventCentres({ ...bird, heldAt: 2 }), [2.8]);
});
test('audioState: one state object per frame from a real flight', () => {
  const f = createFlight('dart', { power: 0, paper: 0, fold: 0 }, 1),
    s0 = audioState(f, { best: 700 }, 'flight');
  assert.equal(s0.event, 'none');
  assert.deepEqual(s0.centres, []);
  assert.equal(s0.best, 700);
  while (!activeEvent(f)) step(f);
  const s1 = audioState(f, {}, 'flight'),
    e = activeEvent(f);
  assert.equal(s1.event, 'warning');
  assert.equal(s1.eventType, e.type);
  assert.deepEqual(s1.centres, [e.w.c]);
  assert.ok(close(s1.speed, f.vx / f.cruise));
  while (e.phase !== 'interaction') step(f);
  assert.equal(audioState(f).event, 'window');
  while (!e.result) {
    step(f);
    if (f.t >= e.w.c) eventInput(f, 'down');
  }
  const s2 = audioState(f);
  assert.equal(s2.event, 'effect');
  assert.equal(s2.effectEnd, e.doneAt);
  assert.equal(audioState(f, {}, 'result').event, 'none');
});
test('duckPlan: a duck during a running duck continues from its value, keeps the deeper level and the later hold', () => {
  const a = duckPlan(null, 10, { db: -4, hold: 0.2 }).state;
  assert.equal(a.v0, 1);
  const b = duckPlan(a, 10.1, { db: -4, hold: 0.2 });
  assert.ok(close(b.state.v0, 10 ** (-4 / 20)), 'no jump back to 1');
  assert.ok(b.state.holdEnd > a.holdEnd);
  const j = duckPlan(null, 0, { db: -5, attack: 0.1, hold: 2, release: 0.6 }).state,
    p = duckPlan(j, 1, { db: -4, hold: 0.2 }).state;
  assert.equal(p.db, -5, 'deeper wins');
  assert.equal(p.holdEnd, j.holdEnd, 'the jingle hold is kept');
  for (let t = 1; t < p.holdEnd; t += 0.01) assert.ok(duckValue(p, t) < 1 - 1e-6);
  assert.equal(duckPlan(a, 11, {}).state.v0, 1, 'after the end: a fresh duck');
});

// ---------- audio.js with a fake AudioContext (D-1…D-3) ----------
const testTrack = evs => ({
  id: 'T',
  districts: [{ bpm: 60, mode: 'ionian' }],
  bar: i => (i === 0 ? evs.map(e => ({ d: 0.2, n: 62, v: 0.5, i: 'sub', ...e })) : []),
});
function engine() {
  const ctx = fakeContext(),
    a = createAudio({ ctx, autoUnlock: false, autoStart: false });
  return { ctx, a };
}
// Pump the scheduler every 25 ms like the real timer; st(t) gives the state for audio time t.
function run(ctx, a, until, st) {
  for (
    ;
    ctx.currentTime <= until;
    ctx.currentTime = Math.round((ctx.currentTime + 0.025) * 1000) / 1000
  ) {
    if (st) a.update(st(ctx.currentTime));
    a.pump();
  }
}
const started = (ctx, t) => ctx.starts.some(s => Math.abs(s.t - t) < 1e-6);
test('D-1 notes of L1/L2 inside the silence mask are not played, L0 notes are', () => {
  const { ctx, a } = engine();
  // Bar starts at 0.08 s, 1 beat = 1 s; the QTE centre is at audio time 0.6 → mask [0.48, 0.72].
  a.play(
    testTrack([
      { b: 0.5, l: 0 },
      { b: 0.52, l: 1 },
      { b: 0.54, l: 2 },
      { b: 2, l: 1 },
    ]),
  );
  const st = t => ({ screen: 'flight', event: 'window', centres: [0.6], flightT: t, hits: 1 });
  run(ctx, a, 3, st);
  assert.ok(
    close(a.mask[0][0], 0.48, 1e-6) && close(a.mask[0][1], 0.72, 1e-6),
    JSON.stringify(a.mask),
  );
  assert.ok(started(ctx, 0.58), 'L0 bed note inside the mask plays');
  assert.ok(!started(ctx, 0.6), 'L1 inside the mask dropped');
  assert.ok(!started(ctx, 0.62), 'L2 inside the mask dropped');
  assert.ok(started(ctx, 2.08), 'L1 outside the mask plays');
  assert.equal(a.dropped, 2);
});
test('D-2 a centre re-planned after a hitstop moves the mask', () => {
  const { ctx, a } = engine();
  a.play(
    testTrack([
      { b: 0.87, l: 1 },
      { b: 1.22, l: 1 },
    ]),
  );
  // Centre at flight time 1.0; a hitstop freezes flight time from audio 0.2 to 0.5 → the centre is heard at 1.3.
  const flightT = t => (t < 0.2 ? t : t < 0.5 ? 0.2 : t - 0.3);
  run(ctx, a, 2, t => ({ screen: 'flight', event: 'window', centres: [1.0], flightT: flightT(t) }));
  assert.ok(close(a.mask[0][0], 1.18, 1e-6), JSON.stringify(a.mask));
  assert.ok(started(ctx, 0.95), 'the old mask position no longer silences');
  assert.ok(!started(ctx, 1.3), 'the moved mask silences the note at the new centre');
});
test('D-3 ducks 0.5 s apart (steam) never rise to 1 between them and never go below −4 dB; overlapping ducks do not jump', () => {
  const g4 = 10 ** (-4 / 20);
  {
    const { ctx, a } = engine();
    ctx.currentTime = 9.9;
    a.update({ screen: 'flight', event: 'window', centres: [10, 10.5], flightT: 9.9 });
    ctx.currentTime = 10;
    a.duck(10, { db: -4, hold: 0.2 });
    ctx.currentTime = 10.5;
    a.update({ screen: 'flight', event: 'window', centres: [10.5], flightT: 10.5 });
    a.duck(10.5, { db: -4, hold: 0.2 });
    const p = a.g.duck.gain;
    for (let t = 10; t < 12; t += 0.005) {
      const v = p.valueAt(t);
      assert.ok(v >= g4 - 1e-9, `t ${t.toFixed(3)}: ${v}`);
      if (t > 10.02 && t < 10.7) assert.ok(v < 1 - 1e-6, `back to 1 at ${t.toFixed(3)}`);
    }
    assert.ok(close(p.valueAt(12), 1), 'released after the second');
  }
  {
    // A duck that starts while another holds (jingle + perfect) continues from the held level: no jump to 1.
    const { a } = engine();
    a.duck(0, { db: -4, hold: 1 });
    a.duck(0.5, { db: -4, hold: 0.2 });
    const p = a.g.duck.gain;
    for (let t = 0.02; t < 1.0; t += 0.005) {
      const v = p.valueAt(t);
      assert.ok(v < 1 - 1e-6 && v >= g4 - 1e-9, `t ${t.toFixed(3)}: ${v}`);
    }
  }
});
test('a new district waits for calm: no switch in an event or < 0.5 s before the next warning, stinger once', () => {
  const { ctx, a } = engine(),
    A = testTrack([]),
    B = testTrack([]),
    switches = [];
  a.on((type, info) => type === 'switch' && switches.push(info));
  a.play(A);
  a.update({ screen: 'flight', event: 'warning', flightT: 0 });
  a.play(B, 0, 1, { calmOnly: true, stinger: true });
  run(ctx, a, 9, t => ({
    screen: 'flight',
    event: t < 4.5 ? 'warning' : 'none',
    flightT: t,
    calmUntil: 30,
  }));
  assert.equal(switches.length, 1);
  assert.ok(switches[0].when >= 4.5, `switched at ${switches[0].when}`);
  assert.equal(switches[0].stinger, true);
  a.play(A, 0, 1, { calmOnly: true, stinger: true });
  run(ctx, a, 17, t => ({ screen: 'flight', flightT: t, calmUntil: 30 }));
  assert.equal(switches.length, 2);
  assert.equal(switches[1].stinger, false, 'one stinger per flight');
});
test('fatigue in the engine: after 12 min in one district the next Workshop visit rests, only wind plays', () => {
  const { ctx, a } = engine(),
    cues = [];
  a.on((type, info) => type === 'cue' && cues.push(info.name));
  a.play({
    id: 'T',
    districts: [{ bpm: 60 }],
    bar: () => [
      { b: 0, d: 4, n: null, i: 'air', l: 0, v: 0.5 },
      { b: 1, d: 0.2, n: 62, i: 'sub', l: 0, v: 0.5 },
    ],
  });
  a.update({ screen: 'flight' });
  a.distSec = 12 * 60;
  ctx.currentTime = 100;
  a.update({ screen: 'workshop' });
  assert.ok(a.resting(), 'rest started');
  assert.ok(cues.includes('rest'));
  const before = ctx.starts.length;
  run(ctx, a, 106, () => ({ screen: 'workshop' }));
  const kinds = ctx.starts.slice(before).map(s => s.kind);
  assert.ok(kinds.length > 0 && kinds.every(k => k === 'buffer'), 'only the wind (noise) plays');
});
test('sfx: combo tones in the district mode, no deep landing thud with calm audio, stinger with a switch', () => {
  const { ctx, a } = engine(),
    sfx = createSfx(a),
    cues = [];
  a.on((type, info) => type === 'cue' && cues.push(info));
  a.play(TRACKS.G, 3);
  sfx.success(3);
  sfx.perfect(3);
  const notes = cues
    .filter(c => c.name === 'success' || c.name === 'perfect')
    .map(c => c.note % 12);
  assert.deepEqual(notes, [5, 5], 'Lantern City (dorian): the 3rd combo tone is F');
  a.play(TRACKS.G, 0);
  ctx.currentTime = 1;
  a.pump();
  sfx.success(3);
  assert.equal(cues.findLast(c => c.name === 'success').note % 12, 6, 'Sunrise Roofs (lydian): F#');
  sfx.land(20);
  assert.equal(cues.at(-1).deep, true);
  a.setSettings({ calm: true });
  sfx.land(20);
  assert.equal(cues.at(-1).deep, false, 'calm audio: the < 120 Hz thud is off');
  a.setSettings({ calm: false });
  a.play(TRACKS.G, 1, 1, { calmOnly: true, stinger: true });
  a.update({ screen: 'flight', flightT: 0 });
  run(ctx, a, 12, t => ({ screen: 'flight', flightT: t }));
  assert.ok(
    cues.some(c => c.name === 'stinger' && c.district === 1),
    'stinger played with the switch',
  );
});
