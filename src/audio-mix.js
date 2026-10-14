// Pure audio logic, no Web Audio: mix targets, track choice, quantisation, ducking, scales and seeded patterns.
// audio.js, sfx.js and src/music/* build on it; tests run it in Node.
import { random } from './random.js';
import { SECTION_METERS, DISTRICTS } from './scenes.js';
export const KEY = 'D';
const PC = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};
export const MODES = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  majorPent: [0, 2, 4, 7, 9],
  minorPent: [0, 3, 5, 7, 10],
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  clamp01 = v => clamp(v, 0, 1);
// MIDI note of a scale degree (0 = tonic, negative and >7 wrap octaves); octave 4 → D4 = 62.
export function scaleNote(key = KEY, mode = 'ionian', degree = 0, octave = 4) {
  const s = MODES[mode],
    n = s.length,
    o = Math.floor(degree / n);
  return 12 * (octave + 1) + PC[key] + 12 * o + s[degree - o * n];
}
export const hz = m => 440 * 2 ** ((m - 69) / 12);
export function inScale(m, key = KEY, mode = 'ionian') {
  return MODES[mode].includes((((m - PC[key]) % 12) + 12) % 12);
}
// Combo tones rise 1-2-3-5-6-8 (D major pentatonic), then stay on the octave.
export const comboNote = (n, octave = 5) =>
  scaleNote(KEY, 'majorPent', clamp(Math.round(n) - 1, 0, 5), octave);
// Mood arc "after the sun": one tonic, the mode and colour change. Leitmotif = degrees + rhythm in eighths (sum 8).
export const ARC = [
  {
    id: 'violet',
    name: 'Violet Suburbs',
    mood: 'dusk, warm and intimate',
    mode: 'lydian',
    motif: [0, 1, 2, 4, 3],
    rhythm: [1, 1, 2, 1, 3],
  },
  {
    id: 'moon',
    name: 'Moon Docks',
    mood: 'space and minor',
    mode: 'aeolian',
    motif: [4, 2, 3, 1, 0],
    rhythm: [2, 1, 1, 2, 2],
  },
  {
    id: 'sunset',
    name: 'Red Horizon',
    mood: 'second sunset, opening up',
    mode: 'mixolydian',
    motif: [0, 4, 6, 7, 4],
    rhythm: [1, 1, 1, 3, 2],
  },
  {
    id: 'core',
    name: 'Neon Core',
    mood: 'neon night, full groove',
    mode: 'dorian',
    motif: [0, 2, 3, 5, 4],
    rhythm: [1, 1, 1, 1, 4],
  },
  {
    id: 'finale',
    name: 'Dawn',
    mood: 'resolution',
    mode: 'ionian',
    motif: [0, 4, 7, 9, 8],
    rhythm: [1, 1, 2, 2, 2],
  },
];
// Speed relative to cruise from which the groove layer joins even without a hit.
export const FAST = 1.3;
// Target gains of layers L0 bed, L1 pulse, L2 groove, L3 lead, plus filters, from the game state.
// state: {screen workshop|aim|flight|result, event none|warning|window|effect, combo, hits (this flight), speed (vx/cruise), height (m), calm}
export function mixTargets(s = {}) {
  const screen = s.screen ?? 'workshop',
    ev = s.event ?? 'none',
    combo = s.combo ?? 0,
    speed = s.speed ?? 1,
    hits = s.hits ?? 0,
    L = [0, 0, 0, 0];
  let filter = 18000,
    padFilter = 6000,
    octave = false;
  const urgent = screen === 'flight' && (ev === 'warning' || ev === 'window');
  if (screen === 'workshop') {
    L[0] = 0.6;
    filter = 2400;
    padFilter = 2400;
  } else if (screen === 'result') {
    L[0] = 0.75;
    filter = 3500;
    padFilter = 3500;
  } else if (screen === 'aim') {
    L[0] = 0.8;
    L[1] = 0.6;
    filter = 7000;
  } else if (screen === 'flight') {
    L[0] = 0.8;
    L[1] = 0.85;
    L[2] = hits > 0 || speed >= FAST ? 0.8 : 0;
    L[3] = combo >= 2 ? 0.7 : 0;
    octave = combo >= 3;
    filter = clamp(4500 * 2 ** ((speed - 1) * 2), 2500, 18000);
  }
  // Warning and window: thin out (pad low-passed, drums almost gone, lead quiet), bass pulse stays. Never add.
  if (urgent) {
    L[0] *= 0.7;
    padFilter = 650;
    L[2] *= 0.12;
    L[3] *= 0.35;
  }
  if (s.calm) {
    L[2] *= 0.5;
    L[3] *= 0.6;
    filter = Math.min(filter, 5000);
  }
  return {
    layers: L,
    filter,
    padFilter,
    reverb: 0.25 + 0.35 * clamp01((s.height ?? 0) / 120),
    octave,
    urgent,
  };
}
// Combo counts consecutive successes; a miss resets it, an interrupted event leaves it alone.
export const comboAfter = (c, r) =>
  r === 'success' || r === 'perfect' ? c + 1 : r === 'miss' ? 0 : c;
// Track follows the player's frontier (best distance), never the plane's position.
export const ROUTE_METERS = SECTION_METERS * DISTRICTS.length;
export function trackFor(progress = {}, direction = 'A') {
  const best = Math.max(0, Number(progress.best) || 0),
    finale = best >= ROUTE_METERS,
    district = Math.min(DISTRICTS.length - 1, Math.floor(best / SECTION_METERS));
  return { direction, district, finale, id: direction + (finale ? 'F' : district) };
}
// District boundary crossed between two flight positions: 'new' past the frontier (stinger + switch), 'revisit' = short jingle. District 4 = finale.
export function boundaryCue(prevX, x, best = 0) {
  const a = Math.floor(Math.max(0, prevX) / SECTION_METERS),
    b = Math.floor(Math.max(0, x) / SECTION_METERS);
  if (b <= a) return null;
  const d = Math.min(b, DISTRICTS.length);
  return { district: d, type: b * SECTION_METERS > best ? 'new' : 'revisit' };
}
// First grid point at or after `now` (unit in beats: 1 beat, 4 bar). Only ornaments and layer fades use it, never the QTE.
export function nextBoundary(now, bpm, start = 0, unit = 1) {
  const len = (unit * 60) / bpm;
  if (now <= start) return start;
  return start + Math.ceil((now - start) / len - 1e-9) * len;
}
// Ducking envelope (gain multiplier) under perfects and jingles: dB ramp down, hold, release.
export const DUCK = { db: -5, attack: 0.015, hold: 0.15, release: 0.25 };
export function duck(t, at, o = {}) {
  const { db, attack, hold, release } = { ...DUCK, ...o },
    x = t - at;
  let d;
  if (x < 0 || x >= attack + hold + release - 1e-9) d = 0;
  else if (x < attack) d = (db * x) / attack;
  else if (x < attack + hold) d = db;
  else d = db * (1 - (x - attack - hold) / release);
  return 10 ** (d / 20);
}
export function duckPoints(at, o = {}) {
  const { attack, hold, release } = { ...DUCK, ...o };
  return [0, attack, attack + hold, attack + hold + release].map(x => [
    at + x,
    duck(at + x, at, o),
  ]);
}
// QTE tick: the real flight time of the window centre (gust: from event start, pigeon: from the hold), never the beat.
export function qteCenter(e, w) {
  if (!e || e.result) return null;
  return e.type === 'gust'
    ? e.at + w.gust.center
    : e.heldAt !== null
      ? e.heldAt + w.bird.center
      : null;
}
export const tickTime = (ctxTime, flightT, center, latency = 0) =>
  ctxTime + (center - flightT) - latency;
// Keeps one tick planned for the active event; re-plans after a hitstop shifts flight time, cancels when the event resolves.
// play(when,event) → {cancel()}; ctx needs currentTime (and optionally outputLatency). offset = manual calibration (s, + = later).
export function createTickPlanner(play, { tolerance = 0.02, lock = 0.03 } = {}) {
  let cur = null;
  const drop = now => {
    if (cur && cur.when > now) cur.handle?.cancel?.();
    cur = null;
  };
  return {
    get planned() {
      return cur?.when ?? null;
    },
    update(ctx, flightT, e, w, offset = 0) {
      const now = ctx.currentTime,
        c = e && (e.phase === 'warning' || e.phase === 'interaction') ? qteCenter(e, w) : null;
      if (c === null) {
        drop(now);
        return null;
      }
      const when = tickTime(now, flightT, c, (ctx.outputLatency || 0) - offset);
      if (cur && cur.e === e) {
        if (Math.abs(cur.when - when) < tolerance || cur.when - now < lock) return cur.when;
        cur.handle?.cancel?.();
      } else drop(now);
      if (when < now) {
        cur = { e, when, handle: null };
        return null;
      }
      cur = { e, when, handle: play(when, e) };
      return when;
    },
    clear(ctx) {
      drop(ctx.currentTime);
    },
  };
}
// Settings in localStorage['just-throw-it-audio']; music 60 %, effects 80 % by default (decision 14. 10.).
export const AUDIO_DEFAULTS = {
  master: 1,
  music: 0.6,
  sfx: 0.8,
  tick: true,
  muted: false,
  calm: false,
  latency: 0,
};
export function audioSettings(raw) {
  const o = { ...AUDIO_DEFAULTS };
  if (raw && typeof raw === 'object')
    for (const k of Object.keys(o)) {
      const v = raw[k];
      if (typeof o[k] === 'number' && typeof v === 'number' && Number.isFinite(v))
        o[k] = k === 'latency' ? clamp(v, -0.3, 0.3) : clamp01(v);
      else if (typeof o[k] === 'boolean' && typeof v === 'boolean') o[k] = v;
    }
  return o;
}
export const level = v => v * v; // slider → gain, roughly perceptual
// Seeded randomness for the pattern generators: same keys → same stream.
export function hashKeys(...k) {
  let h = 2166136261;
  for (const ch of k.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export const rngFor = (...k) => random(hashKeys(...k));
export const pick = (r, a) => a[Math.floor(r() * a.length)];
export function euclid(k, n, rot = 0) {
  return Array.from({ length: n }, (_, i) => ((i + rot) * k) % n < k);
}
