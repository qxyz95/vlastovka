// Pure audio logic, no Web Audio: mix targets, track choice, quantisation, ducking, scales and seeded patterns.
// audio.js, sfx.js and src/music/* build on it; tests run it in Node.
import { random } from './random.js';
import { SECTION_METERS, SCREEN_METERS, DISTRICTS } from './scenes.js';
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
// Combo tones rise on degrees 1-2-3-5-6-8 of the district mode (Lantern City: F, not F#), then stay on the octave.
const COMBO_DEGREES = [0, 1, 2, 4, 5, 7];
export const comboNote = (n, octave = 5, mode = 'ionian') =>
  scaleNote(KEY, mode, COMBO_DEGREES[clamp(Math.round(n) - 1, 0, 5)], octave);
// One day "after the sun" (research/hudba/03 B.3, C.2): one tonic D, one sharp less per district, sunrise again in the finale.
// One theme "Throw" (1-5-6-4-3-2: up a fifth, hang at the top, glide down, no landing) varied per district.
export const ARC = [
  {
    id: 'violet',
    name: 'Sunrise Roofs',
    mood: 'morning, a waking street',
    mode: 'lydian',
    motif: [0, 4, 5, 3, 2, 1],
    rhythm: [1, 1, 3, 1, 1, 1],
  },
  {
    id: 'moon',
    name: 'Bright Harbor',
    mood: 'bright noon by the sea, rocking',
    mode: 'ionian',
    motif: [0, 4, 5, 3, 2, 1],
    rhythm: [1, 2, 2, 1, 1, 1],
  },
  {
    id: 'sunset',
    name: 'Golden Fields',
    mood: 'golden afternoon, windmills',
    mode: 'mixolydian',
    motif: [0, 4, 6, 5, 3, 1],
    rhythm: [1, 1, 1, 1, 2, 2],
  },
  {
    id: 'core',
    name: 'Lantern City',
    mood: 'evening with paper lanterns, the one warm minor',
    mode: 'dorian',
    motif: [0, 4, 5, 3, 2, 1],
    rhythm: [1, 2, 1, 2, 1, 1],
  },
  {
    id: 'finale',
    name: 'Delivered',
    mood: 'sunrise beyond the goal, resolved',
    mode: 'lydian',
    motif: [0, 4, 5, 3, 1, 0],
    rhythm: [1, 1, 2, 1, 1, 2],
  },
];
// Speed relative to cruise from which the groove layer joins even without a hit.
export const FAST = 1.3;
// Intensity map (research/hudba/03 E.2) as data: level 0–3, layer gains L0–L3, music filter (Hz or 'speed'), how layers enter.
export const INTENSITY = {
  workshop: { level: 1, layers: [0.6, 0, 0, 0], filter: 2400, enter: 'bar', theme: 'piano' },
  aim: { level: 2, layers: [0.8, 0.6, 0, 0], filter: 7000, enter: 'bar' },
  throw: { level: 2, layers: [0.8, 0.85, 0, 0], filter: 'speed', enter: 'beat' },
  calm: { level: 3, layers: [0.8, 0.85, 0.8, 0.7], filter: 'speed', enter: 'beat' },
  warning: { level: 1, layers: [0.56, 0.85, 0.096, 0], filter: 1800, enter: 'now' },
  window: { level: 1, layers: [0.56, 0.85, 0.096, 0], filter: 1800, enter: 'now', mask: true },
  effect: { level: 3, layers: [0.8, 0.85, 0.8, 0.7], filter: 1800, enter: 'beat' },
  miss: { level: 2, layers: [0.8, 0.85, 0.8, 0], filter: 1800, enter: 'beat' },
  boundaryNew: { level: null, switch: 'calm bar', stinger: true },
  boundaryRevisit: { level: null, switch: null, stinger: false },
  landing: { level: 1, layers: [0.75, 0, 0, 0], filter: 3500, enter: 'bar', duckDb: -3 },
  result: { level: 1, layers: [0.75, 0, 0, 0], filter: 3500, enter: 'bar', theme: 'piano' },
  finale: { level: 3, layers: [0.8, 0.85, 0, 0.8], filter: 18000, cue: 'finale', enter: 'bar' },
};
// The whole music is low-passed from the warning to the end of the effect + MUSIC_HOLD (E.3/1): no pumping inside one event.
export const MUSIC_FILTER = 1800,
  MUSIC_HOLD = 0.3,
  MUSIC_OPEN = 20000;
// Target gains of layers L0 bed, L1 pulse, L2 groove, L3 lead, plus filters, from the game state.
// state: {screen workshop|aim|flight|result, event none|warning|window|effect, combo, hits (this flight), speed (vx/cruise),
// height (m), calm, flightT, effectEnd}. musicFilter caps the whole music (MUSIC_OPEN = no cap).
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
  const flight = screen === 'flight',
    urgent = flight && (ev === 'warning' || ev === 'window'),
    held =
      flight &&
      (ev !== 'none' ||
        (s.effectEnd != null && s.flightT != null && s.flightT < s.effectEnd + MUSIC_HOLD));
  if (screen === 'workshop' || screen === 'atlas') {
    L[0] = INTENSITY.workshop.layers[0];
    filter = padFilter = INTENSITY.workshop.filter;
  } else if (screen === 'result') {
    L[0] = INTENSITY.result.layers[0];
    filter = padFilter = INTENSITY.result.filter;
  } else if (screen === 'aim') {
    [L[0], L[1]] = INTENSITY.aim.layers;
    filter = INTENSITY.aim.filter;
  } else if (screen === 'finale') {
    INTENSITY.finale.layers.forEach((v, l) => (L[l] = v));
    filter = INTENSITY.finale.filter;
  } else if (flight) {
    const c = INTENSITY.calm.layers;
    L[0] = c[0];
    L[1] = c[1];
    L[2] = hits > 0 || speed >= FAST ? c[2] : 0;
    L[3] = combo >= 2 ? c[3] : 0;
    octave = combo >= 3;
    filter = clamp(4500 * 2 ** ((speed - 1) * 2), 2500, 18000);
  }
  // Warning and window: thin out at once (pad low-passed, drums almost gone, lead silent), bass pulse stays. Never add.
  if (urgent) {
    L[0] *= 0.7;
    padFilter = 650;
    L[2] *= 0.12;
    L[3] = 0;
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
    musicFilter: held ? MUSIC_FILTER : MUSIC_OPEN,
    reverb: 0.25 + 0.35 * clamp01((s.height ?? 0) / 120),
    octave,
    urgent,
    held,
  };
}
// Audio screen (03 E.2) from the game's screen machine (screens.js {screen, title, panels}): the main menu, Settings and
// Workshop play the Workshop intensity, the Atlas its own visit (fatigue), Pause keeps the frozen flight, a landed flight
// already fades to the Result, and a running finale cue replaces the Result.
const MENU_PANELS = ['menu', 'settings', 'confirm'];
export function audioScreen({
  screen,
  title = false,
  panels = [],
  landed = false,
  finale = false,
} = {}) {
  const top = panels.at(-1);
  if (top === 'workshop' || top === 'atlas') return top;
  if (screen === 'flight') return landed ? 'result' : 'flight';
  if (screen === 'result' || screen === 'chapter') return finale ? 'finale' : 'result';
  if (screen === 'home') return title || MENU_PANELS.includes(top) ? 'workshop' : 'aim';
  return 'workshop';
}
// Row of the intensity map (INTENSITY key) for a state of audioState(); flight without an event is 'throw' until the groove
// joins (first hit or FAST), then 'calm'. intensityOf → level 0–3 (calm: 2, from combo 2 with the lead 3).
export function phaseOf(s = {}) {
  const sc = s.screen ?? 'workshop';
  if (sc === 'atlas') return 'workshop';
  if (sc !== 'flight') return INTENSITY[sc] ? sc : 'workshop';
  const ev = s.event ?? 'none';
  if (ev === 'warning' || ev === 'window' || ev === 'effect') return ev;
  return (s.hits ?? 0) > 0 || (s.speed ?? 1) >= FAST ? 'calm' : 'throw';
}
export function intensityOf(s = {}) {
  const k = phaseOf(s);
  return k === 'calm' ? ((s.combo ?? 0) >= 2 ? 3 : 2) : INTENSITY[k].level;
}
// Combo counts consecutive successes; a miss resets it, an interrupted event leaves it alone.
export const comboAfter = (c, r) =>
  r === 'success' || r === 'perfect' ? c + 1 : r === 'miss' ? 0 : c;
// Track follows the player's frontier (best distance), never the plane's position.
export const ROUTE_METERS = SECTION_METERS * DISTRICTS.length;
export function trackFor(progress = {}, direction = 'E') {
  const best = Math.max(0, Number(progress.best) || 0),
    finale = best >= ROUTE_METERS,
    district = Math.min(DISTRICTS.length - 1, Math.floor(best / SECTION_METERS)),
    // Place 0–3 inside the district (one place = one screen); the theme grows with it (03 C.2).
    place = finale
      ? 3
      : Math.min(3, Math.floor((best - district * SECTION_METERS) / SCREEN_METERS + 1e-9));
  return { direction, district, place, finale, id: direction + (finale ? 'F' : district) };
}
// District boundary crossed between two flight positions: 'new' past the frontier (stinger + switch), 'revisit' = short jingle. District 4 = finale.
export function boundaryCue(prevX, x, best = 0) {
  const a = Math.floor(Math.max(0, prevX) / SECTION_METERS),
    b = Math.floor(Math.max(0, x) / SECTION_METERS);
  if (b <= a) return null;
  const d = Math.min(b, DISTRICTS.length);
  return { district: d, type: b * SECTION_METERS > best ? 'new' : 'revisit' };
}
// Boundary plan for the music (03 E.4): a known district ('revisit') does nothing; a new one switches the track only in calm
// (defer while an event holds the mix) with at most one stinger per flight. o = {held (event or hold running), stingers (played this flight)}.
export function boundaryPlan(prevX, x, best = 0, { held = false, stingers = 0 } = {}) {
  const c = boundaryCue(prevX, x, best);
  if (!c || c.type !== 'new') return null;
  return { ...c, defer: !!held, stinger: stingers < 1 };
}
// A pending switch may start on a bar line only in calm, at least `lead` s before the next warning (calmUntil).
export function switchAllowed({
  t = 0,
  calmUntil = Infinity,
  barTime,
  urgent = false,
  lead = 0.5,
} = {}) {
  if (urgent || !(barTime >= t)) return false;
  return barTime <= calmUntil - lead;
}
// Silence mask around QTE centres (03 E.3/2): ±pad, masks closer than `merge` s merge into one. → sorted [from, to] intervals.
export function silenceMask(centres = [], { pad = 0.12, merge = 0.4 } = {}) {
  const out = [];
  for (const c of [...centres].filter(Number.isFinite).sort((a, b) => a - b)) {
    const last = out.at(-1);
    if (last && c - pad - last[1] < merge) last[1] = Math.max(last[1], c + pad);
    else out.push([c - pad, c + pad]);
  }
  return out;
}
export const inMask = (t, mask = []) => mask.some(([a, b]) => t >= a - 1e-9 && t <= b + 1e-9);
// Pulse and groove notes starting inside a mask are dropped; the bed (L0) and lead (L3, silent in events anyway) are not.
export const masked = (e, mask) => (e.l === 1 || e.l === 2) && inMask(e.t, mask);
// Fatigue (03 E.5): after REST_AFTER min of one district, the next Workshop/Atlas visit rests 45–60 s (wind only);
// every 3rd Result/Workshop visit plays the bed only, without the theme.
export const REST_AFTER = 12;
export function fatigue({ screen, minutesInDistrict = 0, visits = 0, seed = 1 } = {}) {
  const rest =
      (screen === 'workshop' || screen === 'atlas') && minutesInDistrict >= REST_AFTER
        ? 45 + Math.floor(rngFor('rest', seed)() * 16)
        : 0,
    bedOnly = (screen === 'result' || screen === 'workshop') && visits > 0 && visits % 3 === 0;
  return { rest, bedOnly };
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
// Ducks merge instead of pumping (03 E.3/3): a duck that starts while another runs continues from its current value,
// keeps the deeper level and the later hold end. prev/state = {at, v0, db, attackEnd, holdEnd, end}.
export function duckValue(st, t) {
  if (!st || t < st.at || t >= st.end) return 1;
  const g = 10 ** (st.db / 20);
  if (t < st.attackEnd) return st.v0 + ((g - st.v0) * (t - st.at)) / (st.attackEnd - st.at);
  if (t < st.holdEnd) return g;
  return g + ((1 - g) * (t - st.holdEnd)) / (st.end - st.holdEnd);
}
export function duckPlan(prev, at, o = {}) {
  const { db, attack, hold, release } = { ...DUCK, ...o },
    live = !!prev && at >= prev.at && at < prev.end,
    st = {
      at,
      v0: live ? duckValue(prev, at) : 1,
      db: live ? Math.min(prev.db, db) : db,
      attackEnd: at + attack,
    };
  st.holdEnd = Math.max(live ? prev.holdEnd : 0, st.attackEnd + hold);
  st.end = st.holdEnd + release;
  const g = 10 ** (st.db / 20);
  return {
    state: st,
    points: [
      ['set', at, st.v0],
      ['ramp', st.attackEnd, g],
      ['ramp', st.holdEnd, g],
      ['ramp', st.end, 1],
    ],
  };
}
// QTE tick: the real flight time of the window centre (gust: from event start, pigeon: from the hold), never the beat.
// A running event knows its exact centres in e.w (flight.js: floating centre, steam puffs); without e.w the default windows apply.
export function qteCenter(e, w) {
  if (!e || e.result) return null;
  if (e.w) return eventCentres(e)[0] ?? null;
  return e.type === 'gust'
    ? e.at + w.gust.center
    : e.type === 'bird' && e.heldAt != null
      ? e.heldAt + w.bird.center
      : null;
}
// All centres of a running, unresolved event: steam has two puffs, the pigeon's centre is known once held.
export function eventCentres(e) {
  if (!e?.w || e.result || e.phase === 'waiting' || e.phase === 'done') return [];
  if (e.type === 'bird') return e.heldAt != null ? [e.heldAt + e.w.c] : [];
  return Array.isArray(e.w.c) ? e.w.c.slice(e.puff ?? 0) : [e.w.c];
}
// One audio state object per frame (03 F.2) from a flight (flight.js) and the model {best, combo, prevX, calm, reducedMotion}.
const PHASE = { warning: 'warning', interaction: 'window', effect: 'effect' },
  HITS = ['success', 'perfect', 'partial', 'half'];
export function audioState(f, m = {}, screen = 'flight') {
  const live = screen === 'flight' && !!f && !f.landed,
    t = f?.t ?? 0,
    ev = live ? (f.events.find(e => PHASE[e.phase]) ?? null) : null,
    done = f ? f.events.filter(e => e.doneAt != null && e.result) : [],
    next = live ? f.events.find(e => e.phase === 'waiting') : null;
  return {
    screen,
    event: ev ? PHASE[ev.phase] : 'none',
    eventType: ev?.type ?? null,
    centres: live ? f.events.flatMap(eventCentres).filter(c => c > t) : [],
    flightT: t,
    effectEnd: done.length ? Math.max(...done.map(e => e.doneAt)) : null,
    calmUntil: next && Number.isFinite(next.at) ? (next.start ?? next.at) : Infinity,
    combo: m.combo ?? f?.combo ?? 0,
    hits: f ? f.events.filter(e => HITS.includes(e.result)).length : 0,
    speed: live ? f.vx / (f.cruise || 1) : 1,
    height: live ? f.y : 0,
    x: f?.x ?? 0,
    prevX: m.prevX ?? f?.x ?? 0,
    best: m.best ?? 0,
    calm: !!m.calm,
    reducedMotion: !!m.reducedMotion,
  };
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
        if (Math.abs(cur.when - when) < tolerance) return cur.when;
        // A tick about to sound stays; a played one (steam: first puff) lets the next centre be planned.
        if (cur.when > now) {
          if (cur.when - now < lock) return cur.when;
          cur.handle?.cancel?.();
        }
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
// Settings in localStorage['just-throw-it-audio'] (device settings, outside the game save); music 60 %, effects 80 % by default (decision 14. 10.).
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
      // A volume outside 0–1 is a damaged value → default (not a clamp to full volume); latency is clamped.
      if (typeof o[k] === 'number' && typeof v === 'number' && Number.isFinite(v)) {
        if (k === 'latency') o[k] = clamp(v, -0.3, 0.3);
        else if (v >= 0 && v <= 1) o[k] = v;
      } else if (typeof o[k] === 'boolean' && typeof v === 'boolean') o[k] = v;
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
