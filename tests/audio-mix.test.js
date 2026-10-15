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
} from '../src/audio-mix.js';
import { TRACKS, TRACK_IDS } from '../src/music/index.js';
import { VOICE_NAMES } from '../src/music/synth.js';
import { phrase, swing, near, chord } from '../src/music/compose.js';
import { blindMap, summary } from '../prototype/music/blind.js';
import { createFlight, step, eventInput, activeEvent } from '../src/core.js';
import { windows, TIMING } from '../src/events.js';
import { SECTION_METERS } from '../src/scenes.js';

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
  assert.deepEqual(trackFor({ best: 0 }), { direction: 'E', district: 0, finale: false, id: 'E0' });
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
test('two directions × four districts: valid events, notes in the district mode, every layer used, BPM in range', () => {
  assert.deepEqual(TRACK_IDS, ['B', 'E']);
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
  assert.ok(Math.abs(center - (e.at + TIMING.gustCenter)) < 1e-9);
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
test('blind mode: X1–X2 is a stable permutation of B and E per session, summary averages by direction', () => {
  const m = blindMap(7);
  assert.deepEqual(Object.keys(m), ['X1', 'X2']);
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
test('registry holds only B and E; neon voices are gone from the synth', () => {
  assert.deepEqual(Object.keys(TRACKS), ['B', 'E']);
  assert.deepEqual(TRACK_IDS, ['B', 'E']);
  for (const v of ['pulse', 'chiparp', 'cnoise', 'ckick', 'brass', 'scratch'])
    assert.ok(!VOICE_NAMES.includes(v), v);
  for (const v of ['vinyl', 'rain', 'sax']) assert.ok(VOICE_NAMES.includes(v), v + ' is used by B');
});
