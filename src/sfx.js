// Procedural sound effects in D (research/hudba/01 §7). Each one emits a cue with its audio time, so the page can show it too.
import { KEY, scaleNote, comboNote, ARC, hz } from './audio-mix.js';
import { playVoice } from './music/synth.js';
import { deg, chord, near } from './music/compose.js';
export function createSfx(audio) {
  const { ctx, g } = audio,
    now = () => ctx.currentTime;
  const v = (e, t, dest = g.sfxIn) => {
    const end = playVoice(g, e, t, 1, dest);
    audio.voice(end);
    return end;
  };
  let wind = null,
    charge = null;
  // Combo tones follow the mode of the playing district (Lantern City dorian: F, not F#).
  const mode = () =>
      audio.track?.districts?.[audio.district]?.mode ?? ARC[audio.district ?? 0]?.mode ?? 'ionian',
    reduced = () => !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const s = {
    // Any voice on the effects bus (e.d in seconds); used by the prototype's leitmotif test.
    note: (e, t = now()) => v(e, t),
    // QTE tick: wooden click on the 5th (A), at the exact audio time of the window centre; cancellable.
    tick(when = now()) {
      const gate = ctx.createGain();
      gate.connect(g.sfxIn);
      v(
        { i: 'wood', n: scaleNote(KEY, 'ionian', 4, 5), d: 0.05, v: 1.27, o: { dec: 0.04 } },
        when,
        gate,
      );
      const id = audio.cue('tick', when);
      return {
        when,
        cancel() {
          gate.gain.setValueAtTime(0, now());
          setTimeout(() => gate.disconnect(), 300);
          audio.uncue(id);
        },
      };
    },
    // Success: the combo tone (1-2-3-5-6-8 of D major pentatonic) with a soft pluck under it.
    success(combo = 1, t = now()) {
      const n = comboNote(combo, 5, mode());
      v({ i: 'bell', n, d: 0.4, v: 0.7, o: { dec: 0.9, index: 1.5 } }, t);
      v({ i: 'pluck', n: n - 12, d: 0.15, v: 0.5, o: { cut: 3000, dec: 0.06 } }, t);
      audio.cue('success', t, { combo, note: n });
      if (combo >= 2) audio.cue('combo', t, { combo });
    },
    // Perfect: combo tone + its octave, glitter, dotted-eighth echo, music ducked −4 dB.
    perfect(combo = 1, t = now()) {
      const n = comboNote(combo, 5, mode());
      v({ i: 'bell', n, d: 0.5, v: 1.2, o: { dec: 1.2 } }, t);
      v({ i: 'bell', n: n + 12, d: 0.5, v: 0.8, o: { dec: 1.4 } }, t + 0.01, g.sfxEchoIn);
      v({ i: 'bell', n: n + 12, d: 0.5, v: 0.6, o: { dec: 1.2 } }, t + 0.01);
      [0, 2, 5, 7].forEach((k, i) =>
        v(
          { i: 'glock', n: scaleNote(KEY, mode(), k, 6), d: 0.2, v: 0.45 },
          t + 0.05 + i * 0.035,
          g.sfxVerbIn,
        ),
      );
      audio.duck(t, { db: -4, hold: 0.2 });
      audio.cue('perfect', t, { combo, note: n });
      if (combo >= 2) audio.cue('combo', t, { combo });
    },
    // Miss: one quiet, muffled low tone. No sad trombone.
    miss(t = now()) {
      v({ i: 'felt', d: 0.2, v: 0.4 }, t);
      v(
        {
          i: 'pluck',
          n: scaleNote(KEY, 'majorPent', 0, 3),
          d: 0.2,
          v: 0.35,
          o: { cut: 500, floor: 200, dec: 0.05, wave: 'triangle' },
        },
        t,
      );
      audio.cue('miss', t);
    },
    // District jingle (2–3 s): the leitmotif that also seeds the district's music, over its chord; music ducks.
    jingle(d = 0, { short = false, t } = {}) {
      const a = ARC[Math.min(d, ARC.length - 1)],
        m = a.mode,
        start = t ?? (audio.track ? audio.nextBeat(1) : now()),
        step = short ? 0.14 : 0.2;
      let pos = 0;
      a.motif.forEach((x, i) => {
        v(
          { i: 'bell', n: deg(m, x, 5), d: 0.6, v: 0.75, o: { dec: 1.6 } },
          start + pos * step,
          g.sfxVerbIn,
        );
        v({ i: 'bell', n: deg(m, x, 5), d: 0.5, v: 0.4, o: { dec: 1.6 } }, start + pos * step);
        pos += a.rhythm[i];
      });
      if (!short)
        for (const n of near(chord(m, 0, 3, 4, [1]), 62))
          v({ i: 'pad', n, d: 2.2, v: 0.7, o: { a: 0.15, r: 1.2, cut: 2200 } }, start);
      audio.duck(start, { db: -5, attack: 0.1, hold: short ? 0.9 : 2, release: 0.6 });
      audio.cue('jingle', start, { district: d, short });
    },
    // Stinger of a new district in flight (03 E.4/4, ≤ 1 s): crumpled paper, then the head of the theme on the music box
    // in the new mode. Only together with the switch, never inside an event.
    stinger(d = 0, t = now()) {
      const a = ARC[Math.min(d, ARC.length - 1)];
      v({ i: 'crumple', d: 0.4, v: 0.6, o: { seed: d + 3 } }, t);
      let pos = 0;
      a.motif.slice(0, 3).forEach((x, i) => {
        v(
          { i: 'musicbox', n: deg(a.mode, x, 5), d: 0.3, v: 0.6, o: { dec: 0.6 } },
          t + 0.18 + pos * 0.11,
        );
        pos += a.rhythm[i];
      });
      audio.cue('stinger', t, { district: d });
    },
    // Landing "flop" by speed; water places get a splash.
    land(speed = 10, surface = 'roof', t = now()) {
      const k = Math.min(1, speed / 30);
      const deep = !(audio.settings?.calm || reduced());
      v({ i: 'flop', d: 0.3, v: 0.5 + 0.5 * k, o: { water: surface === 'water', deep } }, t);
      audio.cue('land', t, { speed, surface, deep });
    },
    throw(power = 0.8, t = now()) {
      v({ i: 'whoosh', d: 0.35, v: 0.5 + 0.5 * power, o: { f0: 350, f1: 1800 + 1500 * power } }, t);
      audio.cue('throw', t, { power });
    },
    boost(t = now()) {
      v({ i: 'whoosh', d: 0.25, v: 0.5, o: { f0: 700, f1: 3200 } }, t);
      audio.cue('boost', t);
    },
    // Wind: continuous filtered noise following speed (0–1); level is shown as a meter.
    wind(level = 0) {
      const t = now();
      if (!wind) {
        const bp = ctx.createBiquadFilter(),
          gn = ctx.createGain(),
          src = ctx.createBufferSource();
        bp.type = 'bandpass';
        bp.Q.value = 0.7;
        gn.gain.value = 0;
        src.buffer = g.noise;
        src.loop = true;
        src.connect(bp);
        bp.connect(gn);
        gn.connect(g.sfxIn);
        src.start();
        wind = { bp, gn, level: 0 };
      }
      if (Math.abs(level - wind.level) < 0.01) return;
      wind.level = level;
      wind.gn.gain.setTargetAtTime(0.1 * level * level, t, 0.3);
      wind.bp.frequency.setTargetAtTime(300 + 1200 * level, t, 0.3);
      audio.cue('wind', t, { level });
    },
    // Throw charge: a tone that follows the power meter (D4 → D5), stops on release.
    charge(p = 0) {
      const t = now(),
        f = hz(scaleNote(KEY, 'ionian', 0, 4)) * 2 ** Math.max(0, Math.min(1, p));
      if (!charge) {
        const o = ctx.createOscillator(),
          gn = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        gn.gain.value = 0;
        o.connect(gn);
        gn.connect(g.sfxIn);
        o.start();
        gn.gain.setTargetAtTime(0.05, t, 0.05);
        charge = { o, gn };
      }
      charge.o.frequency.setTargetAtTime(f, t, 0.02);
      audio.cue('charge', t, { level: p });
    },
    chargeStop() {
      if (!charge) return;
      const t = now(),
        c = charge;
      charge = null;
      c.gn.gain.setTargetAtTime(0, t, 0.03);
      c.o.stop(t + 0.2);
      audio.cue('charge', t, { level: 0 });
    },
  };
  audio.on?.((type, info) => {
    if (type === 'switch' && info.stinger) s.stinger(info.district, info.when);
  });
  return s;
}
