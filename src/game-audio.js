// Game audio (music plan step 4): the one place where the game drives the Diorama music and the effects. ui.js calls
// frame(input) once per frame after the physics, so every effect starts in the same frame as its visual feedback (juice).
// The AudioContext is created on the first gesture and never while the sound is off; without Web Audio the game stays silent.
// ?audio=debug: small overlay (intensity, layers, mask, district, LUFS-M, underruns); ?audio=rec: recording of the master
// bus (16-bit PCM WAV from an AudioWorklet + webm from MediaRecorder) with an event log, all downloaded on stop.
import { createAudio, bindLifecycle, loadAudioSettings, saveAudioSettings } from './audio.js';
import { createSfx } from './sfx.js';
import {
  audioState,
  audioScreen,
  audioSettings,
  trackFor,
  boundaryPlan,
  createTickPlanner,
  phaseOf,
  intensityOf,
} from './audio-mix.js';
import { blockPowers } from './audio-loudness.js';
import { resultFx } from './juice.js';
import { activeEvent } from './core.js';
import { windows } from './events.js';
import { routeAt } from './scenes.js';
import { HOLD_MIN_MS } from './screens.js';
import { TRACKS } from './music/index.js';
import { t, pct } from './i18n.js';

export const GAME_TRACK = 'G'; // Diorama; B and E stay in the prototype only (06, 15. 10.)
const SEED = 1,
  SOUND = { perfect: 'perfect', success: 'success', partial: 'success', miss: 'miss' },
  WATER = ['bridge', 'lighthouse'],
  GESTURES = ['pointerdown', 'keydown', 'touchend'],
  NOISY_CUES = ['charge', 'wind'];
// ?audio=debug,rec (or ?audio=debug&audio=rec) → {debug, rec}.
export function audioFlags(search = '') {
  const v = new URLSearchParams(search)
    .getAll('audio')
    .flatMap(x => x.split(','))
    .map(x => x.trim());
  return { debug: v.includes('debug'), rec: v.includes('rec') };
}
// Sound is wanted when not muted and at least one bus is audible: only then a context is created.
export const wantsSound = s => !s.muted && (s.music > 0 || s.sfx > 0);
// 44-byte header of a PCM WAV (16-bit integer or 32-bit float), little endian.
export function wavHeader(frames, rate, channels = 2, bits = 16) {
  const b = new DataView(new ArrayBuffer(44)),
    bytes = frames * channels * (bits / 8),
    str = (o, s) => [...s].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  b.setUint32(4, 36 + bytes, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  b.setUint32(16, 16, true);
  b.setUint16(20, bits === 32 ? 3 : 1, true);
  b.setUint16(22, channels, true);
  b.setUint32(24, rate, true);
  b.setUint32(28, (rate * channels * bits) / 8, true);
  b.setUint16(32, (channels * bits) / 8, true);
  b.setUint16(34, bits, true);
  str(36, 'data');
  b.setUint32(40, bytes, true);
  return b.buffer;
}
// Recording processor (audio thread): interleaved 16-bit stereo in chunks of 8192 frames with a running frame index,
// so the main thread can detect a lost chunk. An idle input still counts as silence (the timeline stays exact).
const WORKLET = `class JtiRec extends AudioWorkletProcessor{constructor(){super();this.n=0;this.b=new Int16Array(16384);this.i=0;this.t0=null;this.on=true;this.port.onmessage=e=>{if(e.data==='stop'){this.flush();this.on=false}}}
flush(){if(!this.i)return;const d=this.b.slice(0,this.i);this.port.postMessage({at:this.n,t0:this.t0,d},[d.buffer]);this.n+=this.i/2;this.i=0}
process(inp){if(!this.on)return false;if(this.t0===null)this.t0=currentTime;const x=inp[0],L=x&&x[0],R=x&&(x[1]||x[0]);const q=v=>Math.max(-32768,Math.min(32767,Math.round(v*32767)));for(let k=0;k<128;k++){this.b[this.i++]=L?q(L[k]):0;this.b[this.i++]=R?q(R[k]):0}if(this.i>=this.b.length)this.flush();return true}}
registerProcessor('jti-rec',JtiRec)`;

// opts (all injectable for tests): search, storage-free settings via audio.js, makeAudio(), makeSfx(audio), win, doc,
// els = {music, sfx, mute, musicOut, sfxOut} of the Settings panel, now() (ms clock for the overlay throttle).
export function createGameAudio(opts = {}) {
  const win = opts.win ?? globalThis,
    doc = opts.doc ?? globalThis.document,
    flags = audioFlags(opts.search ?? globalThis.location?.search ?? ''),
    makeAudio = opts.makeAudio ?? (() => createAudio({ autoUnlock: false })),
    makeSfx = opts.makeSfx ?? createSfx,
    clock = opts.now ?? (() => performance.now()),
    els = opts.els ?? {},
    TRACK = TRACKS[GAME_TRACK];
  let settings = opts.settings ? audioSettings(opts.settings) : loadAudioSettings(),
    audio = null,
    sfx = null,
    planner = null,
    failed = false,
    rec = null,
    overlay = null,
    shownAt = -Infinity;
  // Director memory: the flight being voiced, resolved events already sounded, the landing, the frontier at the throw.
  const D = {
    f: null,
    seen: new Set(),
    centres: new Set(),
    landed: false,
    prevX: 0,
    v: 0,
    distStart: 0,
    completed: null,
    charging: false,
    wind: false,
    scr: null,
    resultOf: null,
    bestAtThrow: 0,
    st: null,
  };
  const log = (type, data = {}) => rec?.log(type, data);
  function ensure() {
    if (audio || failed || !wantsSound(settings)) return audio;
    try {
      audio = makeAudio();
      sfx = makeSfx(audio);
    } catch (e) {
      failed = true; // no Web Audio: the game is fully playable without sound
      audio = sfx = null;
      console.warn('Audio unavailable', e);
      return null;
    }
    bindLifecycle(audio, { win, doc });
    planner = createTickPlanner(when => (audio.settings.tick ? sfx.tick(when) : null));
    audio.on((type, info) => {
      if (type === 'cue' && !NOISY_CUES.includes(info.name)) {
        const { id, name, when, ...rest } = info;
        log('cue', { name, at: rec?.at(when), ...rest });
      } else if (type === 'uncue') log('uncue', info);
      else if (type === 'switch')
        log('district', { district: info.district, stinger: info.stinger });
      else if (type === 'sleep' || type === 'wake' || type === 'state')
        log(type, { why: info ?? null, state: audio.ctx.state });
    });
    if (flags.rec) rec = createRecorder(audio, win, doc);
    if (flags.debug) meter = createMeter(audio);
    for (const g of GESTURES) win.removeEventListener?.(g, onGesture, true);
    return audio;
  }
  function onGesture() {
    if (!audio && ensure()) audio.unlock();
  }
  for (const g of GESTURES) win.addEventListener?.(g, onGesture, true);
  // Presses for the recording log (the same gestures the game reads; key only Space/Enter).
  if (flags.rec)
    for (const g of ['pointerdown', 'keydown'])
      win.addEventListener?.(
        g,
        e => {
          if (g === 'keydown' && (e.repeat || !['Space', 'Enter'].includes(e.code))) return;
          log('press', { input: g === 'keydown' ? 'key' : e.pointerType || 'pointer' });
        },
        true,
      );
  let meter = null;

  function set(patch) {
    const before = settings;
    settings = audioSettings({ ...settings, ...patch });
    if (audio) audio.setSettings(settings);
    else saveAudioSettings(settings);
    if (!audio && wantsSound(settings) && !wantsSound(before) && ensure()) audio.unlock();
    log('volume', { music: settings.music, sfx: settings.sfx, muted: settings.muted });
    refresh();
    return settings;
  }
  // Settings panel: two sliders (0–100 %, step 5) and Mute all; muted disables the sliders and says "Muted".
  function refresh() {
    const { music, sfx: fx, mute, musicOut, sfxOut } = els;
    if (!music) return;
    for (const [el, out, v] of [
      [music, musicOut, settings.music],
      [fx, sfxOut, settings.sfx],
    ]) {
      const val = String(Math.round(v * 100));
      if (el.value !== val) el.value = val;
      el.disabled = settings.muted;
      const text = settings.muted ? t('settings.muted') : pct(v);
      if (out && out.textContent !== text) out.textContent = text;
      el.setAttribute('aria-valuetext', text);
    }
    mute.checked = settings.muted;
  }
  if (els.music) {
    els.music.addEventListener('input', () => set({ music: Number(els.music.value) / 100 }));
    els.sfx.addEventListener('input', () => set({ sfx: Number(els.sfx.value) / 100 }));
    els.mute.addEventListener('change', () => set({ muted: els.mute.checked }));
    refresh();
  }

  // One call per frame. i = {screen, title, panels, f, acc, best, completed, held, heldMs, charge, reduced}.
  function frame(i) {
    D.completed ??= !!i.completed;
    if (!audio) return showDebug(null);
    const now = audio.ctx.currentTime,
      f = i.screen === 'flight' ? i.f : null,
      panels = i.panels ?? [],
      paused = !!f && panels.length > 0;
    audio.reducedMotion = !!i.reduced;
    // Throw: the new flight object appears in the frame of fxEvent('throw').
    if (f && f !== D.f) {
      Object.assign(D, { f, seen: new Set(), centres: new Set(), landed: false, prevX: f.x, v: 0 });
      D.bestAtThrow = i.best ?? 0; // settle() raises best only at the Result
      D.distStart = trackFor({ best: i.best }).district;
      sfx.chargeStop();
      D.charging = false;
      sfx.throw(f.launch?.power ?? 0.8);
    }
    const charging = i.screen === 'home' && !!i.held && i.heldMs >= HOLD_MIN_MS && !panels.length;
    if (charging) sfx.charge(i.charge ?? 0);
    else if (D.charging) sfx.chargeStop();
    D.charging = charging;
    const ft = f ? f.t + (f.landed ? 0 : (i.acc ?? 0)) : 0;
    if (f && !paused) voiceFlight(f, ft, now);
    else {
      planner.clear(audio.ctx);
      if (D.wind) sfx.wind(0);
      D.wind = false;
    }
    // Result card: the full jingle of a newly reached district, or the finale once (03 E.2, E.4/5).
    const card = i.screen === 'result' || i.screen === 'chapter';
    if (card && D.f && D.resultOf !== D.f) {
      D.resultOf = D.f;
      if (i.completed && !D.completed) audio.playCue('finale', TRACK);
      else {
        const d = trackFor({ best: i.best }).district;
        if (d > D.distStart) sfx.jingle(d);
      }
    }
    D.completed = !!i.completed;
    if (!f && !card) D.f = null;
    // Track and place follow the frontier (06); in flight a new district switches in calm via boundaryPlan.
    const reach = trackFor({ best: Math.max(i.best ?? 0, f ? f.x : 0) }),
      target = audio.pending?.district ?? audio.district;
    if (!audio.track || (!f && trackFor({ best: i.best }).district !== target))
      audio.play(TRACK, trackFor({ best: i.best }).district, SEED);
    const scr = audioScreen({
        screen: i.screen,
        title: i.title,
        panels,
        landed: !!f?.landed,
        finale: audio.cueing?.name === 'finale',
      }),
      st = audioState(
        f ? { ...f, t: ft } : null,
        {
          best: i.best,
          combo: f?.combo ?? 0,
          prevX: D.prevX,
          calm: settings.calm,
          reducedMotion: i.reduced,
        },
        scr,
      );
    if (paused) st.centres = [];
    st.place = reach.district === audio.district ? reach.place : 3;
    if (scr !== D.scr) log('screen', { screen: scr, district: audio.district, place: st.place });
    D.scr = scr;
    if (rec && f) logCentres(f, st, now);
    D.st = st;
    audio.update(st);
    rec?.step();
    showDebug(st);
  }
  function voiceFlight(f, ft, now) {
    for (const e of f.events) {
      const k = SOUND[resultFx(e.result)];
      if (!k || D.seen.has(e)) continue;
      D.seen.add(e);
      const combo = Math.max(1, f.combo ?? 0);
      if (k === 'perfect') sfx.perfect(combo);
      else if (k === 'success') sfx.success(combo);
      else sfx.miss();
      if (e.type === 'gust' && e.result !== 'miss') sfx.boost();
      log('hit', { event: e.type, result: e.result, combo: f.combo ?? 0, off: offset(e) });
    }
    if (!f.landed) {
      // Beyond the frontier at the throw = 'new' (switch in calm + stinger), below it 'revisit' (the music does nothing).
      const plan = boundaryPlan(D.prevX, f.x, D.bestAtThrow, {
        held: !!audio.mix.held,
        stingers: audio.stingers,
      });
      // The finale cue belongs to the Result (E.4/6: the music ends in the district of the landing).
      if (plan && plan.district < 4)
        audio.play(TRACK, plan.district, SEED, { calmOnly: true, stinger: plan.stinger });
      D.prevX = f.x;
      D.v = Math.hypot(f.vx, f.vy);
      const w = Math.max(0, Math.min(1, (f.vx / (f.cruise || 1) - 0.8) / 1.6));
      sfx.wind(w);
      D.wind = true;
      planner.update(audio.ctx, ft, activeEvent(f), windows(f), settings.latency);
    } else if (!D.landed) {
      D.landed = true;
      planner.clear(audio.ctx);
      sfx.wind(0);
      D.wind = false;
      sfx.land(D.v, WATER.includes(routeAt(f.x).kind) ? 'water' : 'roof');
      audio.duck(now, { db: -3, hold: 0.15, release: 0.15 });
    }
  }
  // Offset of a press from the nearest centre of the event (flight s, + = late), for the recording log.
  function offset(e) {
    const c = e.w?.c,
      at = e.resolvedAt;
    if (at == null || c == null) return null;
    const offs = (Array.isArray(c) ? c : [c])
      .map(x => at - (e.type === 'bird' ? (e.heldAt ?? 0) + x : x))
      .sort((a, b) => Math.abs(a) - Math.abs(b));
    return Math.round(offs[0] * 1000) / 1000;
  }
  function logCentres(f, st, now) {
    st.centres.forEach((c, k) => {
      const key = f.events.findIndex(e => e === activeEvent(f)) + ':' + c.toFixed(3);
      if (D.centres.has(key)) return;
      D.centres.add(key);
      log('centre', { at: rec.at(now + (c - st.flightT)) });
    });
  }

  // ---------- ?audio=debug ----------
  function showDebug(st) {
    if (!flags.debug || !doc?.body) return;
    const n = clock();
    if (n - shownAt < 250) return;
    shownAt = n;
    if (!overlay) {
      overlay = doc.createElement('pre');
      overlay.className = 'audio-debug';
      overlay.setAttribute('aria-hidden', 'true');
      doc.body.append(overlay);
    }
    overlay.textContent = debugText(st);
  }
  function debugText(st) {
    if (!audio)
      return failed
        ? 'audio: unavailable'
        : wantsSound(settings)
          ? 'audio: waiting for the first tap'
          : 'audio: off (muted, no context)';
    const s = audio.stats(),
      m = audio.mix,
      ms = x => (x * 1000).toFixed(0),
      d = TRACK.districts[audio.district],
      now = audio.ctx.currentTime,
      inMask = audio.mask.find(([a, b]) => now >= a && now <= b),
      next = audio.mask.find(([a]) => a > now),
      L = m.layers.map((v, l) => `L${l} ${v.toFixed(2)}`).join(' '),
      lu = meter?.read();
    return [
      `audio ${s.state} · ${s.rate / 1000} kHz · base ${ms(s.base)} ms · out ${ms(s.output)} ms`,
      st
        ? `${st.screen} · ${st.event}${st.eventType ? ' ' + st.eventType : ''} · ${phaseOf(st)} · intensity ${intensityOf(st)}`
        : '–',
      `${L} · filter ${Math.round(Math.min(m.filter, m.musicFilter ?? Infinity))} Hz${m.held ? ' held' : ''}`,
      `mask ${inMask ? 'ON' : 'off'}${next ? ` · next in ${(next[0] - now).toFixed(2)} s` : ''} · dropped ${s.dropped}`,
      `district ${audio.district + 1} ${d?.name ?? ''} · place ${audio.place + 1}${audio.pending ? ' · switch pending' : ''}${audio.cueing ? ' · ' + audio.cueing.name : ''}${audio.resting() ? ' · rest' : ''}${audio.bedOnly ? ' · bed only' : ''}`,
      `LUFS-M ${lu == null || !Number.isFinite(lu) ? '–' : lu.toFixed(1)} · lim ${(s.limiter ?? 0).toFixed(1)} dB · voices ${s.voices}/${s.peak}`,
      `underruns ${s.underruns ?? 'n/a'}${s.underrunMs != null ? ` (${s.underrunMs.toFixed(0)} ms)` : ''} · sched ${s.schedMax.toFixed(1)} ms (max ${s.schedMaxAll.toFixed(1)}) · spikes ${s.spikes.length}`,
      rec ? rec.status() : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
  const api = {
    get engine() {
      return audio;
    },
    get sfx() {
      return sfx;
    },
    get settings() {
      return settings;
    },
    get state() {
      return D.st;
    },
    get rec() {
      return rec;
    },
    set,
    refresh,
    frame,
    flags,
    stats: () => audio?.stats() ?? null,
  };
  return api;
}

// Momentary loudness (BS.1770, 400 ms) of the master output, read a few times per second for the debug overlay.
function createMeter(audio) {
  const ctx = audio.ctx;
  if (!ctx.createChannelSplitter) return null;
  const split = ctx.createChannelSplitter(2),
    an = [ctx.createAnalyser(), ctx.createAnalyser()],
    n = Math.min(32768, 2 ** Math.ceil(Math.log2(ctx.sampleRate * 0.4))),
    bufs = an.map(() => new Float32Array(n)),
    len = Math.round(ctx.sampleRate * 0.4);
  audio.g.lim.connect(split);
  an.forEach((a, k) => {
    a.fftSize = n;
    split.connect(a, k);
  });
  return {
    read() {
      an.forEach((a, k) => a.getFloatTimeDomainData(bufs[k]));
      const z = blockPowers(
        bufs.map(b => b.subarray(Math.max(0, n - len))),
        ctx.sampleRate,
      )[0];
      return z > 0 ? -0.691 + 10 * Math.log10(z) : -Infinity;
    },
  };
}

// ---------- ?audio=rec ----------
const MAX_REC_MIN = 30; // memory cap (~10 MB per minute of 16-bit stereo)
function createRecorder(audio, win, doc) {
  const ctx = audio.ctx,
    events = [],
    parts = [],
    pending = [],
    webm = [];
  let node = null,
    t0 = null,
    frames = 0,
    gaps = 0,
    started = performance.now(),
    stopped = false,
    statsAt = 0,
    mr = null,
    btn = null,
    error = null;
  const r = {
    // Audio time → seconds of the recording (frame 0 of the WAV = t0).
    at: when => (when == null || t0 == null ? null : Math.round((when - t0) * 10000) / 10000),
    log(type, data = {}) {
      if (stopped) return;
      events.push({
        t: r.at(ctx.currentTime),
        wall: Math.round(performance.now() - started),
        type,
        ...data,
      });
    },
    status: () =>
      error
        ? 'rec error: ' + error
        : `REC ${(frames / ctx.sampleRate).toFixed(0)} s · ${events.length} events · gaps ${gaps}`,
    step() {
      const n = performance.now();
      if (n - statsAt < 10000) return;
      statsAt = n;
      const s = audio.stats();
      r.log('stats', {
        base: s.base,
        output: s.output,
        underruns: s.underruns,
        underrunMs: s.underrunMs,
        schedMax: s.schedMax,
        limiter: s.limiter,
        voices: s.voices,
      });
      if (frames / ctx.sampleRate > MAX_REC_MIN * 60) r.stop();
    },
    async stop() {
      if (stopped) return;
      r.log('stop');
      stopped = true;
      node?.port.postMessage('stop');
      if (mr && mr.state !== 'inactive') {
        const done = new Promise(res => (mr.onstop = res));
        mr.stop();
        await done;
      }
      await new Promise(res => setTimeout(res, 300)); // the last PCM chunk
      flushParts();
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19),
        meta = {
          rate: ctx.sampleRate,
          channels: 2,
          frames,
          gaps,
          baseLatency: ctx.baseLatency ?? null,
          outputLatency: ctx.outputLatency ?? null,
          userAgent: globalThis.navigator?.userAgent ?? '',
          settings: audio.settings,
          start: new Date(Date.now() - (performance.now() - started)).toISOString(),
        };
      save(
        new Blob([wavHeader(frames, ctx.sampleRate), ...parts], { type: 'audio/wav' }),
        `jti-${stamp}.wav`,
      );
      save(
        new Blob([JSON.stringify({ meta, events }, null, 1)], { type: 'application/json' }),
        `jti-${stamp}.json`,
      );
      if (webm.length)
        save(new Blob(webm, { type: webm[0].type || 'audio/webm' }), `jti-${stamp}.webm`);
      if (btn) btn.textContent = 'saved ✓';
    },
  };
  const flushParts = () => {
    if (pending.length) parts.push(new Blob(pending.splice(0)));
  };
  function save(blob, name) {
    const a = doc.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    doc.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }
  (async () => {
    try {
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'text/javascript' }));
      await ctx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);
      node = new AudioWorkletNode(ctx, 'jti-rec', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        channelCount: 2,
        channelCountMode: 'explicit',
      });
      node.port.onmessage = ({ data }) => {
        if (t0 === null) {
          t0 = data.t0;
          r.log('start', {
            baseLatency: ctx.baseLatency ?? null,
            outputLatency: ctx.outputLatency ?? null,
          });
        }
        if (data.at !== frames) {
          gaps++;
          r.log('gap', { expected: frames, got: data.at });
        }
        pending.push(data.d);
        frames = data.at + data.d.length / 2;
        if (pending.length >= 32) flushParts(); // Blob parts leave the JS heap
      };
      const sink = ctx.createGain();
      sink.gain.value = 0;
      audio.g.lim.connect(node);
      node.connect(sink);
      sink.connect(ctx.destination);
    } catch (e) {
      error = 'PCM ' + (e?.message ?? e);
    }
    try {
      if (globalThis.MediaRecorder && ctx.createMediaStreamDestination) {
        const dest = ctx.createMediaStreamDestination();
        audio.g.lim.connect(dest);
        mr = new MediaRecorder(dest.stream);
        mr.ondataavailable = e => e.data.size && webm.push(e.data);
        mr.start(1000);
      }
    } catch {}
  })();
  btn = doc.createElement('button');
  btn.type = 'button';
  btn.className = 'audio-rec';
  btn.textContent = '■ stop rec & save';
  btn.onclick = () => r.stop();
  doc.body.append(btn);
  win.__audioRec = r;
  return r;
}
