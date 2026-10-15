// Audio engine (presentation): AudioContext unlocked on the first gesture, master/music/sfx buses, look-ahead scheduler
// ("A Tale of Two Clocks"), layer mixing from audio-mix.js, suspend while the tab is hidden, settings in localStorage.
// The game does not load it yet; only prototype-music.html uses it. One state object per frame: audio.update(state) (03 F.2).
import {
  mixTargets,
  audioSettings,
  nextBoundary,
  level,
  silenceMask,
  masked,
  switchAllowed,
  fatigue,
  duckPlan,
  DUCK,
} from './audio-mix.js';
import { createGraph, playVoice, roomImpulse, ksBytes, ksPrewarm } from './music/synth.js';
export const AUDIO_KEY = 'just-throw-it-audio';
export function loadAudioSettings() {
  try {
    return audioSettings(JSON.parse(localStorage.getItem(AUDIO_KEY) ?? 'null'));
  } catch {
    return audioSettings(null);
  }
}
export function saveAudioSettings(s) {
  try {
    localStorage.setItem(AUDIO_KEY, JSON.stringify(audioSettings(s)));
  } catch {}
}
const LOOK = 0.12,
  AHEAD = 0.3,
  PUMP_MS = 25,
  BEATS = 4,
  DEFAULT_ROOM = 3.4,
  REST_BED = 0.35;
const set = (p, v, t, tc = 0.05) => {
  p.cancelScheduledValues(t);
  p.setValueAtTime(p.value, t);
  p.setTargetAtTime(v, t, tc);
};
export function createAudio({ ctx, autoUnlock = true, autoStart = true } = {}) {
  const AC = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  ctx ??= new AC({ latencyHint: 'interactive' });
  const g = createGraph(ctx),
    listeners = new Set(),
    ms = [];
  let settings = loadAudioSettings(),
    unlocked = false,
    timer = null,
    cueId = 0,
    lastPump = null;
  const a = {
    ctx,
    g,
    get settings() {
      return settings;
    },
    track: null,
    district: 0,
    seed: 1,
    bar: 0,
    barTime: 0,
    barStart: 0,
    spb: 0.6,
    density: 0.5,
    place: 3,
    bedOnly: false,
    queue: [],
    ends: [],
    peak: 0,
    mix: { ...mixTargets({}), layers: [0, 0, 0, 0] },
    pending: null,
    file: null,
    state: null,
    screen: null,
    centres: [], // QTE centres in audio time
    mask: [], // silence mask in audio time
    calmUntil: Infinity,
    duckState: null,
    restUntil: 0,
    distSec: 0, // music time in the current district (fatigue)
    visits: {},
    stingers: 0,
    cueing: null,
    dropped: 0,
    spikes: [],
  };
  const emit = (type, info) => {
    for (const f of listeners) f(type, info);
  };
  a.on = f => {
    listeners.add(f);
    return () => listeners.delete(f);
  };
  // Visual equivalents: every sound announces itself with the audio time it will be heard at.
  a.cue = (name, when = ctx.currentTime, info = {}) => {
    const id = ++cueId;
    emit('cue', { id, name, when, ...info });
    return id;
  };
  a.uncue = id => emit('uncue', { id });
  const applyVolumes = () => {
    const t = ctx.currentTime,
      s = settings;
    set(g.master.gain, s.muted ? 0 : level(s.master), t);
    set(g.music.gain, level(s.music), t);
    set(g.sfx.gain, level(s.sfx), t);
  };
  a.setSettings = patch => {
    settings = audioSettings({ ...settings, ...patch });
    saveAudioSettings(settings);
    applyVolumes();
    emit('settings', settings);
    return settings;
  };
  applyVolumes();
  a.unlock = () => {
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch {}
    unlocked = true;
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    emit('unlock');
  };
  if (autoUnlock && globalThis.addEventListener) {
    for (const t of ['pointerdown', 'keydown', 'touchend'])
      addEventListener(t, a.unlock, { capture: true, passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx.suspend();
      else if (unlocked) ctx.resume();
    });
  }
  a.unlocked = () => unlocked && ctx.state === 'running';
  // Loudness trim of the music (blind comparison at equal LUFS), in dB.
  a.setTrim = db => set(g.trim.gain, 10 ** (db / 20), ctx.currentTime, 0.1);
  const room = sec => {
    const b = roomImpulse(g, sec);
    if (g.verb.buffer !== b) g.verb.buffer = b;
  };
  // Layer balance of the playing district (diorama layerDb), multiplied into every layer target.
  const trimL = l => 10 ** ((a.track?.districts[a.district]?.layerDb?.[l] ?? 0) / 20);
  const applyDistrict = t => {
    const d = a.track.districts[a.district];
    a.spb = 60 / d.bpm;
    g.layers.forEach((L, l) => {
      set(L.verbSend.gain, d.verb?.[l] ?? 0.2, t, 0.3);
      set(L.echoSend.gain, d.echo?.[l] ?? 0, t, 0.3);
      if (a.mix.layers[l] > 0) set(L.gain.gain, a.mix.layers[l] * trimL(l), t, 0.3);
    });
    g.delay.delayTime.setTargetAtTime(0.75 * a.spb, t, 0.2);
    g.sfxDelay.delayTime.setTargetAtTime(0.75 * a.spb, t, 0.2);
    // The room of the district (only on a switch, the buffer is cached). Setting a convolver buffer costs ~10 ms of main
    // thread (measured), so it runs in its own task after the scheduler pump, not inside it.
    const sec = d.verbSec ?? DEFAULT_ROOM;
    setTimeout(() => room(sec), 0);
  };
  // Start or switch music; a running track changes on the next bar line. o.calmOnly: in flight only on a bar that
  // switchAllowed() accepts (03 E.4), o.stinger: crumple + theme head with the switch.
  a.play = (track, district = 0, seed = a.seed, o = {}) => {
    a.stopFile();
    if (!a.track) {
      a.track = track;
      a.district = district;
      a.seed = seed;
      a.bar = 0;
      a.barTime = ctx.currentTime + 0.08;
      a.distSec = 0;
      applyDistrict(ctx.currentTime);
    } else if (track !== a.track || district !== a.district || seed !== a.seed) {
      // A repeated request for the same target keeps a stinger that is already waiting for calm.
      const same = a.pending?.track === track && a.pending?.district === district;
      a.pending = {
        track,
        district,
        seed,
        calmOnly: !!o.calmOnly,
        stinger: !!o.stinger || (same && a.pending.stinger),
      };
    } else a.pending = null;
    // Room impulse and string buffers are built here, not in the scheduler (keeps schedMax low).
    roomImpulse(g, track.districts[district]?.verbSec ?? DEFAULT_ROOM);
    ksPrewarm(g, track.ksNotes?.(district));
    emit('track', { track, district });
  };
  a.stop = () => {
    a.track = null;
    a.pending = null;
    a.cueing = null;
    a.queue.length = 0;
    for (const L of g.layers) set(L.gain.gain, 0, ctx.currentTime, 0.3);
    a.mix = { ...a.mix, layers: [0, 0, 0, 0] };
  };
  a.bpm = () => 60 / a.spb;
  a.nextBeat = (unit = 1) => nextBoundary(ctx.currentTime, a.bpm(), a.barStart, unit);
  a.resting = () => a.restUntil > ctx.currentTime;
  // Fatigue rest (03 E.5): the band leaves for `sec` s (fade 2 s), only the wind through the window stays.
  a.rest = sec => {
    const t = ctx.currentTime;
    a.restUntil = t + sec;
    a.distSec = 0;
    g.layers.forEach((L, l) => set(L.gain.gain, l ? 0 : REST_BED * trimL(0), t, 0.6));
    a.mix = { ...a.mix, layers: [REST_BED, 0, 0, 0] };
    a.cue('rest', t, { sec });
  };
  // Mix from the game state: thinning (warning/window) is immediate, everything else fades in on the next beat
  // (after a rest on the next bar). The whole music is capped by musicFilter: attack 40 ms, release 0.4 s (03 E.3/1).
  a.setMix = state => {
    const m = mixTargets({ ...state, calm: settings.calm }),
      t = ctx.currentTime,
      resting = a.resting(),
      back = !resting && a.mix.rested,
      beat = a.track ? a.nextBeat(back ? 4 : 1) : t;
    a.density = Math.min(1, Math.max(0, ((state.speed ?? 1) - 0.6) / 1.4));
    if (resting) m.layers = [REST_BED, 0, 0, 0];
    m.rested = resting;
    m.layers.forEach((v, l) => {
      if (Math.abs(v - a.mix.layers[l]) < 1e-3) return;
      const p = g.layers[l].gain.gain,
        down = v < a.mix.layers[l];
      p.cancelScheduledValues(t);
      p.setValueAtTime(p.value, t);
      p.setTargetAtTime(
        v * trimL(l),
        (down || m.urgent) && !back ? t : beat,
        m.urgent ? 0.04 : 0.2,
      );
    });
    const rel = (x, y) => Math.abs(x - y) / y > 0.04,
      f = Math.min(m.filter, m.musicFilter),
      f0 = Math.min(a.mix.filter, a.mix.musicFilter ?? Infinity);
    if (rel(f, f0) || a.mix.held !== m.held)
      set(
        g.lp.frequency,
        f,
        t,
        m.held && !a.mix.held ? 0.04 / 3 : a.mix.held && !m.held ? 0.4 / 3 : 0.25,
      );
    if (rel(m.padFilter, a.mix.padFilter))
      g.layers[0].lp.frequency.setTargetAtTime(m.padFilter, t, m.urgent ? 0.04 : 0.3);
    if (Math.abs(m.reverb - a.mix.reverb) > 0.02) g.verbOut.gain.setTargetAtTime(m.reverb, t, 0.5);
    a.mix = m;
    return m;
  };
  // One state per frame (03 F.2): QTE centres → silence mask in audio time (re-planned every frame, so a hitstop moves it),
  // calm window for a pending switch, screen visits for fatigue, then the mix.
  a.update = (s = {}) => {
    const now = ctx.currentTime,
      toCtx = c => now + (c - (s.flightT ?? 0));
    a.state = s;
    a.centres = (s.centres ?? []).map(toCtx);
    const mask = silenceMask(a.centres);
    for (const [x, y] of mask)
      if (!a.mask.some(([p, q]) => Math.abs(p - x) < 0.03 && Math.abs(q - y) < 0.03))
        a.cue('mask', x, { until: y });
    a.mask = mask;
    a.calmUntil = Number.isFinite(s.calmUntil) ? toCtx(s.calmUntil) : Infinity;
    if (s.place != null) a.place = s.place;
    if (s.screen !== a.screen) {
      if (s.screen === 'flight') a.stingers = 0;
      if (s.screen) {
        const v = (a.visits[s.screen] = (a.visits[s.screen] ?? 0) + 1),
          f = fatigue({
            screen: s.screen,
            minutesInDistrict: a.distSec / 60,
            visits: v,
            seed: a.seed + v,
          });
        a.bedOnly = f.bedOnly;
        if (f.rest && a.track && !a.resting()) a.rest(f.rest);
      }
      a.screen = s.screen;
    }
    return a.setMix(s);
  };
  // Ducks merge (03 E.3/3): a planned centre right after this one (steam) extends the hold instead of a second dip.
  a.duck = (when = ctx.currentTime, o = {}) => {
    const c = { ...DUCK, ...o },
      span = c.attack + c.hold + c.release + 0.4,
      next = a.centres.find(x => x > when + 0.05 && x < when + span);
    if (next != null) c.hold = Math.max(c.hold, next - when + 0.1);
    const { state, points } = duckPlan(a.duckState, when, c),
      p = g.duck.gain;
    if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(when);
    else p.cancelScheduledValues(when);
    for (const [k, at, v] of points)
      if (k === 'set') p.setValueAtTime(v, at);
      else p.linearRampToValueAtTime(v, at);
    a.duckState = state;
    a.cue('duck', when, { db: state.db });
  };
  // Voice bookkeeping for the load meter.
  a.voice = end => {
    a.ends.push(end);
  };
  const play = e => {
    const L = g.layers[e.l],
      spb = e.spb ?? a.spb;
    a.ends.push(playVoice(g, e, e.t, spb, L.gain));
    if (e.l === 3 && a.mix.octave && e.n != null && e.o?.part !== 'double')
      a.ends.push(playVoice(g, { ...e, n: e.n + 12, v: e.v * 0.4 }, e.t, spb, L.gain));
  };
  const canSwitch = at => {
    const p = a.pending;
    if (!p || !p.calmOnly || a.state?.screen !== 'flight') return !!p;
    return switchAllowed({
      t: ctx.currentTime,
      calmUntil: a.calmUntil,
      barTime: at,
      urgent: !!a.mix.held,
    });
  };
  // Finale and other cues of a track (diorama.cue): scheduled once, the bar generator pauses until they end.
  a.playCue = (name, track = a.track) => {
    const evs = track?.cue?.(name, { seed: a.seed }) ?? [];
    if (!evs.length) return null;
    const spb = 60 / (track.finale?.bpm ?? 72),
      start = a.track ? a.nextBeat(4) : ctx.currentTime + 0.1;
    a.cueing = { name, until: start + Math.max(...evs.map(e => e.b + e.d)) * spb };
    room(track.finale?.verbSec ?? DEFAULT_ROOM);
    for (const e of evs) a.queue.push({ ...e, t: start + e.b * spb, spb });
    a.queue.sort((x, y) => x.t - y.t);
    a.cue(name, start);
    return start;
  };
  function pump() {
    const t0 = performance.now(),
      now = ctx.currentTime;
    let nb = 0,
      np = 0;
    if (a.track && ctx.state === 'running') {
      if (lastPump !== null && !a.resting()) a.distSec += Math.max(0, now - lastPump);
      lastPump = now;
      if (a.barTime < now) a.barTime = now + 0.05; // after a stall, never schedule into the past
      let added = false;
      while (a.barTime < now + AHEAD) {
        if (a.cueing) {
          if (a.barTime < a.cueing.until) {
            a.barTime = a.cueing.until;
            continue;
          }
          a.cueing = null;
          const sec = a.track.districts[a.district].verbSec ?? DEFAULT_ROOM;
          setTimeout(() => room(sec), 0);
        }
        if (a.pending && canSwitch(a.barTime)) {
          const p = a.pending;
          a.pending = null;
          if (p.district !== a.district || p.track !== a.track) a.distSec = 0;
          a.track = p.track;
          a.district = p.district;
          a.seed = p.seed;
          applyDistrict(a.barTime);
          const stinger = p.stinger && a.stingers < 1;
          if (stinger) a.stingers++;
          // Listeners (the stinger) run in their own task: the bar line is still >= 50 ms ahead.
          const info = { track: p.track, district: p.district, when: a.barTime, stinger };
          setTimeout(() => emit('switch', info), 0);
          a.cue('switch', a.barTime, { district: p.district, stinger });
        }
        const evs = a.track.bar(a.bar, a.district, {
          seed: a.seed,
          density: a.density,
          place: a.place,
          bedOnly: a.bedOnly,
        });
        for (const e of evs) a.queue.push({ ...e, t: a.barTime + e.b * a.spb });
        emit('bar', { bar: a.bar, when: a.barTime, spb: a.spb });
        a.barStart = a.barTime;
        a.barTime += BEATS * a.spb;
        a.bar++;
        added = true;
        nb++;
      }
      if (added) a.queue.sort((x, y) => x.t - y.t);
      const resting = a.resting();
      while (a.queue.length && a.queue[0].t < now + LOOK) {
        const e = a.queue.shift();
        if (e.t < now - 0.02) continue;
        // Silence mask: checked when the note leaves the queue, so centres planned later (pigeon) still count.
        if (masked(e, a.mask) || (e.i === 'pencil' && a.mix.held) || (resting && e.i !== 'air')) {
          a.dropped++;
          continue;
        }
        if (a.mix.layers[e.l] < 0.001 && g.layers[e.l].gain.gain.value < 0.001) continue;
        play(e);
        np++;
      }
    } else lastPump = null;
    a.ends = a.ends.filter(x => x > now);
    a.peak = Math.max(a.peak, a.ends.length);
    const took = performance.now() - t0;
    ms.push(took);
    // Slow pumps (> 5 ms, 03 F.5) with what they did, for the load report.
    if (took > 5) a.spikes = [...a.spikes.slice(-9), { ms: took, at: now, bars: nb, played: np }];
    if (ms.length > 200) ms.shift();
  }
  a.pump = pump;
  a.start = () => {
    if (!timer) timer = setInterval(pump, PUMP_MS);
  };
  a.halt = () => {
    clearInterval(timer);
    timer = null;
  };
  let schedMaxAll = 0;
  a.stats = () => {
    const max = Math.max(0, ...ms);
    schedMaxAll = Math.max(schedMaxAll, max);
    return {
      voices: a.ends.filter(x => x > ctx.currentTime).length,
      peak: a.peak,
      schedAvg: ms.reduce((s, x) => s + x, 0) / Math.max(1, ms.length),
      schedMax: max,
      schedMaxAll,
      queue: a.queue.length,
      dropped: a.dropped,
      spikes: a.spikes.slice(),
      ksBytes: ksBytes(g),
      ksBuffers: g.ks.size,
      limiter: g.lim.reduction ?? null,
      state: ctx.state,
      base: ctx.baseLatency ?? 0,
      output: ctx.outputLatency ?? 0,
      rate: ctx.sampleRate,
      underruns: ctx.playbackStats?.underrunEvents ?? null,
      underrunMs: ctx.playbackStats ? ctx.playbackStats.underrunDuration * 1000 : null,
    };
  };
  // Own file (drag & drop) for comparison: decoded in memory only, looped through the same filter and ducking.
  a.playFile = async (buf, name = 'file') => {
    const b = await ctx.decodeAudioData(buf);
    a.stop();
    a.stopFile();
    const s = ctx.createBufferSource(),
      gn = ctx.createGain();
    s.buffer = b;
    s.loop = true;
    gn.gain.value = 0.9;
    s.connect(gn);
    gn.connect(g.lp);
    s.start();
    a.file = { s, gn, name, duration: b.duration };
    emit('file', a.file);
    return a.file;
  };
  a.stopFile = () => {
    if (a.file) {
      try {
        a.file.s.stop();
      } catch {}
      a.file.gn.disconnect();
      a.file = null;
    }
  };
  if (autoStart) a.start();
  return a;
}
// Offline render of `sec` seconds of a track in a fixed mix state with the default settings (music 60 %, effects 80 %,
// master 100 %), through the full graph incl. the limiter. For loudness (LUFS) of the content, not for CPU load.
// o = {state (mixTargets state), layers (override), place, density, seed, rate, music, sfx (bus on/off), centres (s, for the mask), extra(api)}.
// extra receives {ctx, g, track, district, settings, voice(), cue(), duck()} so sfx.js can schedule effects into the render.
export async function renderOffline(track, district = 0, sec = 60, o = {}) {
  const rate = o.rate ?? 48000,
    ctx = new OfflineAudioContext(2, Math.floor(rate * sec), rate),
    g = createGraph(ctx),
    d = track.districts[district],
    spb = 60 / d.bpm,
    m = mixTargets({ screen: 'flight', combo: 3, hits: 3, speed: 1.2, ...o.state }),
    st = audioSettings(null),
    mask = silenceMask(o.centres ?? []);
  if (o.layers) m.layers = o.layers; // diagnostics: one layer at a time
  g.master.gain.value = level(st.master);
  g.music.gain.value = o.music === false ? 0 : level(st.music);
  g.sfx.gain.value = o.sfx === false ? 0 : level(st.sfx);
  g.lp.frequency.value = Math.min(m.filter, m.musicFilter);
  g.layers[0].lp.frequency.value = m.padFilter;
  g.verbOut.gain.value = m.reverb;
  g.verb.buffer = roomImpulse(g, d.verbSec ?? DEFAULT_ROOM);
  g.layers.forEach((L, l) => {
    L.gain.gain.value = m.layers[l] * 10 ** ((d.layerDb?.[l] ?? 0) / 20);
    L.verbSend.gain.value = d.verb?.[l] ?? 0.2;
    L.echoSend.gain.value = d.echo?.[l] ?? 0;
  });
  g.delay.delayTime.value = g.sfxDelay.delayTime.value = 0.75 * spb;
  let duckState = null;
  const api = {
    ctx,
    g,
    track,
    district,
    settings: st,
    voice() {},
    cue() {},
    duck(when, x = {}) {
      const { state, points } = duckPlan(duckState, when, x),
        p = g.duck.gain;
      p.cancelScheduledValues(when);
      for (const [k, at, v] of points)
        if (k === 'set') p.setValueAtTime(v, at);
        else p.linearRampToValueAtTime(v, at);
      duckState = state;
    },
  };
  for (let bar = 0, t = 0; t < sec; bar++, t += BEATS * spb)
    for (const e of track.bar(bar, district, {
      seed: o.seed ?? 1,
      density: o.density ?? 0.7,
      place: o.place ?? 3,
    })) {
      const at = t + e.b * spb;
      if (at >= sec || m.layers[e.l] < 0.001 || masked({ ...e, t: at }, mask)) continue;
      playVoice(g, e, at, spb, g.layers[e.l].gain);
    }
  o.extra?.(api);
  return ctx.startRendering();
}
// CPU check: renders `sec` seconds of a direction with all layers open in an OfflineAudioContext.
export async function benchmark(track, district = 0, sec = 8, rate = 44100) {
  const ctx = new OfflineAudioContext(2, Math.floor(rate * sec), rate),
    g = createGraph(ctx),
    d = track.districts[district],
    spb = 60 / d.bpm,
    spans = [];
  g.layers.forEach((L, l) => {
    L.gain.gain.value = [0.8, 0.85, 0.8, 0.7][l];
    L.verbSend.gain.value = d.verb?.[l] ?? 0.2;
    L.echoSend.gain.value = d.echo?.[l] ?? 0;
  });
  g.delay.delayTime.value = 0.75 * spb;
  const t0 = performance.now();
  let events = 0;
  for (let bar = 0, t = 0; t < sec; bar++, t += BEATS * spb)
    for (const e of track.bar(bar, district, { seed: 1, density: 0.7 })) {
      const at = t + e.b * spb;
      if (at >= sec) continue;
      spans.push([at, playVoice(g, e, at, spb, g.layers[e.l].gain)]);
      events++;
    }
  const schedule = performance.now() - t0,
    t1 = performance.now();
  await ctx.startRendering();
  const ms = performance.now() - t1;
  const marks = spans
    .flatMap(([s, e]) => [
      [s, 1],
      [e, -1],
    ])
    .sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  let cur = 0,
    peak = 0;
  for (const [, k] of marks) {
    cur += k;
    peak = Math.max(peak, cur);
  }
  return { id: track.id, district, sec, ms, schedule, factor: (sec * 1000) / ms, peak, events };
}
