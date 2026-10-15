// Web Audio instruments and the bus graph for the procedural music and effects.
// Presentation only: nothing touches Web Audio at import time, so tests can read VOICE_NAMES in Node.
import { hz } from '../audio-mix.js';
import { ksSamples } from './ks.js';
const lcg = seed => {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 1073741823.5 - 1;
};
export function noiseBuffer(ctx, sec = 2, seed = 12345) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate),
    d = b.getChannelData(0),
    r = lcg(seed);
  for (let i = 0; i < d.length; i++) d[i] = r();
  return b;
}
// Vinyl: faint hiss with sparse crackles.
function crackleBuffer(ctx, sec = 4) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate),
    d = b.getChannelData(0),
    r = lcg(99);
  for (let i = 0; i < d.length; i++) d[i] = r() * 0.015;
  for (let i = 0; i < d.length; i++)
    if (r() > 0.9994) {
      const a = r() * 0.7;
      for (let k = 0; k < 24 && i + k < d.length; k++)
        d[i + k] += a * Math.exp(-k / 3) * (k % 2 ? -1 : 1);
    }
  return b;
}
// Generated reverb impulse: decaying stereo noise that darkens over time, short pre-delay.
export function impulse(ctx, sec = 3, decay = 3, pre = 0.015) {
  const r = ctx.sampleRate,
    n = Math.floor(r * sec),
    b = ctx.createBuffer(2, n, r);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c),
      w = lcg(c ? 777 : 4242);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      lp += (w() - lp) * (0.08 + 0.8 * (1 - t) ** 2);
      d[i] = i < pre * r ? 0 : lp * (1 - t) ** decay;
    }
  }
  return b;
}
// Nodes of the voice being built; disconnected once all its sources have ended (otherwise automated filters keep costing CPU).
let cur = null;
const reg = n => {
    cur?.nodes.push(n);
    return n;
  },
  src = n => {
    cur?.src.push(n);
    return n;
  };
const G = (ctx, v = 1, ...to) => {
  const n = reg(ctx.createGain());
  n.gain.value = v;
  for (const t of to) n.connect(t);
  return n;
};
const F = (ctx, type, f, q = 0.7, ...to) => {
  const n = reg(ctx.createBiquadFilter());
  n.type = type;
  n.frequency.value = f;
  n.Q.value = q;
  for (const t of to) n.connect(t);
  return n;
};
// Buses: layers L0–L3 (gain → low-pass) → music low-pass → duck → music → master → limiter.
// Reverb and echo sends are taken after each layer's gain, so a silent layer leaves no tail.
export function createGraph(ctx) {
  const lim = ctx.createDynamicsCompressor();
  lim.threshold.value = -8;
  lim.knee.value = 6;
  lim.ratio.value = 10;
  lim.attack.value = 0.003;
  lim.release.value = 0.2;
  lim.connect(ctx.destination);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  lim.connect(analyser);
  const master = G(ctx, 1, lim),
    music = G(ctx, 0.36, master),
    sfx = G(ctx, 0.64, master),
    trim = G(ctx, 1, music), // per-track loudness trim (blind comparison at equal LUFS)
    duck = G(ctx, 1, trim),
    lp = F(ctx, 'lowpass', 18000, 0.6, duck);
  const verb = ctx.createConvolver(),
    impulses = new Map([[3.4, impulse(ctx, 3.4, 3)]]);
  verb.buffer = impulses.get(3.4);
  const verbOut = G(ctx, 0.3, lp);
  verb.connect(verbOut);
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.45;
  const dlp = F(ctx, 'lowpass', 2600, 0.7),
    fb = G(ctx, 0.38, delay);
  delay.connect(dlp);
  dlp.connect(fb);
  dlp.connect(G(ctx, 0.8, lp));
  const layers = [0, 1, 2, 3].map(() => {
    const f = F(ctx, 'lowpass', 18000, 0.5, lp),
      gain = G(ctx, 0, f),
      verbSend = G(ctx, 0.2, verb),
      echoSend = G(ctx, 0, delay);
    f.connect(verbSend);
    f.connect(echoSend);
    return { gain, lp: f, verbSend, echoSend };
  });
  const sfxVerb = ctx.createConvolver();
  sfxVerb.buffer = impulse(ctx, 1.8, 3.5);
  sfxVerb.connect(G(ctx, 0.6, sfx));
  const sfxVerbIn = G(ctx, 1, sfxVerb);
  const sfxDelay = ctx.createDelay(2);
  sfxDelay.delayTime.value = 0.4;
  const sfb = G(ctx, 0.32, sfxDelay);
  sfxDelay.connect(sfb);
  sfxDelay.connect(sfx);
  const sfxEchoIn = G(ctx, 1, sfxDelay);
  const sfxIn = G(ctx, 1, sfx, G(ctx, 0.15, sfxVerb));
  return {
    ctx,
    lim,
    analyser,
    master,
    music,
    sfx,
    trim,
    duck,
    lp,
    verb,
    impulses,
    verbOut,
    delay,
    layers,
    sfxIn,
    sfxVerbIn,
    sfxEchoIn,
    sfxDelay,
    noise: noiseBuffer(ctx),
    crackle: crackleBuffer(ctx),
    waves: {},
    ks: new Map(), // Karplus–Strong buffers by MIDI note, built lazily (sample rate is fixed per graph)
    crumples: new Map(),
  };
}
// Room reverb of a district (03 B.3): one impulse per length, cached; swapped only when the district changes.
export function roomImpulse(g, sec = 3.4) {
  const k = Math.round(sec * 10) / 10;
  if (!g.impulses.has(k)) g.impulses.set(k, impulse(g.ctx, k, k < 2 ? 4 : 3));
  return g.impulses.get(k);
}
// Bytes held by the KS cache (float32 mono).
export const ksBytes = g => [...g.ks.values()].reduce((s, b) => s + b.length * 4, 0);
function ksBuffer(g, n, o = {}) {
  const key = `${n}|${o.t60 ?? 1.1}`;
  if (!g.ks.has(key)) {
    const rate = g.ctx.sampleRate,
      data = ksSamples(hz(n), rate, 1.5, n, { t60: o.t60 ?? 1.1, bright: o.bright ?? 0.55 }),
      b = g.ctx.createBuffer(1, data.length, rate);
    b.getChannelData(0).set(data);
    g.ks.set(key, b);
  }
  return g.ks.get(key);
}
// Crumpled paper: 20–60 tiny resonant clicks (1–4 ms, 1–6 kHz) at seeded times, denser at the start (Cirio et al. 2016).
function crumpleBuffer(g, seed) {
  const k = seed % 8;
  if (g.crumples.has(k)) return g.crumples.get(k);
  const rate = g.ctx.sampleRate,
    len = Math.floor(rate * 0.45),
    b = g.ctx.createBuffer(1, len, rate),
    d = b.getChannelData(0),
    r0 = lcg(k * 7919 + 11),
    u = () => (r0() + 1) / 2,
    n = 20 + Math.floor(u() * 41);
  for (let j = 0; j < n; j++) {
    const at = Math.floor(u() ** 1.6 * 0.38 * rate),
      L = Math.floor((0.001 + 0.003 * u()) * rate),
      w = (2 * Math.PI * 1000 * 6 ** u()) / rate,
      R = 0.92,
      c1 = 2 * R * Math.cos(w),
      c2 = -R * R,
      a = 0.3 + 0.7 * u();
    let y1 = 0,
      y2 = 0;
    for (let i = 0; i < L * 3 && at + i < len; i++) {
      const x = i < L ? r0() * a * (1 - i / L) : 0,
        y = x + c1 * y1 + c2 * y2;
      d[at + i] += y * 0.25;
      y2 = y1;
      y1 = y;
    }
  }
  let p = 0;
  for (const x of d) p = Math.max(p, Math.abs(x));
  if (p > 0) for (let i = 0; i < len; i++) d[i] /= p;
  g.crumples.set(k, b);
  return b;
}
// Building blocks.
function osc(g, type, f, t, end, to, det = 0) {
  const o = src(g.ctx.createOscillator());
  if (typeof type === 'string') o.type = type;
  else o.setPeriodicWave(type);
  o.frequency.setValueAtTime(f, t);
  if (det) o.detune.value = det;
  o.connect(to);
  o.start(t);
  o.stop(end + 0.05);
  return o;
}
function noise(g, t, end, to, rate = 1, buf = g.noise) {
  const s = src(g.ctx.createBufferSource());
  s.buffer = buf;
  s.loop = true;
  s.playbackRate.value = rate;
  s.connect(to);
  s.start(t, (t * 7.31) % Math.max(0.001, buf.duration - 0.01));
  s.stop(end + 0.05);
  return s;
}
const filt = (g, type, f, q, to) => (to ? F(g.ctx, type, f, q, to) : F(g.ctx, type, f, q));
const amp = (g, out) => G(g.ctx, 0, out);
function adsr(p, t, a, d, s, r, peak, dur) {
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + a);
  p.setTargetAtTime(peak * s, t + a, Math.max(0.001, d / 3));
  const off = t + Math.max(dur, a);
  p.setTargetAtTime(0, off, Math.max(0.001, r / 4));
  return off + r;
}
function perc(p, t, peak, dec) {
  p.setValueAtTime(0, t);
  p.linearRampToValueAtTime(peak, t + 0.002);
  p.setTargetAtTime(0, t + 0.002, dec);
  return t + 0.002 + dec * 6;
}
function vibrato(g, t, end, depth, rate, targets, delay = 0.3) {
  const l = src(g.ctx.createOscillator());
  l.frequency.value = rate;
  const lg = reg(g.ctx.createGain());
  lg.gain.setValueAtTime(0, t);
  lg.gain.linearRampToValueAtTime(depth, t + delay);
  l.connect(lg);
  for (const x of targets) lg.connect(x.detune);
  l.start(t);
  l.stop(end + 0.05);
}
// FM pair: modulator index falls from i0 to i1 (× frequency) with time constant tc.
function fm(g, t, end, f, ratio, i0, i1, tc, to) {
  const c = g.ctx,
    car = src(c.createOscillator()),
    mod = src(c.createOscillator()),
    mg = reg(c.createGain());
  car.frequency.value = f;
  mod.frequency.value = f * ratio;
  mg.gain.setValueAtTime(f * i0, t);
  mg.gain.setTargetAtTime(f * i1, t, tc);
  mod.connect(mg);
  mg.connect(car.frequency);
  car.connect(to);
  car.start(t);
  mod.start(t);
  car.stop(end + 0.05);
  mod.stop(end + 0.05);
  return car;
}
const FORMANTS = {
  a: [
    [730, 1],
    [1090, 0.5],
    [2440, 0.25],
  ],
  o: [
    [450, 1],
    [800, 0.45],
    [2830, 0.15],
  ],
  u: [
    [325, 1],
    [700, 0.3],
    [2530, 0.1],
  ],
};
// Voices: (graph, event, start, duration in s, destination, options) → end time.
const V = {
  pad(g, e, t, dur, out, o) {
    const f = hz(e.n),
      a = o.a ?? 0.6,
      cut = o.cut ?? 1500,
      fl = filt(g, 'lowpass', cut * 0.5, 0.6),
      A = amp(g, out);
    fl.frequency.setValueAtTime(cut * 0.5, t);
    fl.frequency.linearRampToValueAtTime(cut, t + a * 1.5);
    fl.connect(A);
    const end = adsr(A.gain, t, a, 1, 0.85, o.r ?? 1.2, e.v * 0.065, dur);
    for (const det of [-9, 8]) osc(g, o.wave ?? 'sawtooth', f, t, end, fl, det);
    return end;
  },
  bass(g, e, t, dur, out, o) {
    const f = hz(e.n),
      cut = o.cut ?? 700,
      fl = filt(g, 'lowpass', cut * 3.5, o.q ?? 3),
      A = amp(g, out);
    fl.frequency.setValueAtTime(cut * 3.5, t);
    fl.frequency.setTargetAtTime(cut, t, o.env ?? 0.06);
    fl.connect(A);
    const end = adsr(A.gain, t, 0.004, 0.15, 0.7, 0.06, e.v * 0.2, dur);
    osc(g, 'sawtooth', f, t, end, fl);
    osc(g, 'sine', f, t, end, A);
    return end;
  },
  sub(g, e, t, dur, out, o) {
    const A = amp(g, out),
      end = adsr(A.gain, t, o.a ?? 0.02, 0.3, 1, o.r ?? 0.2, e.v * 0.3, dur);
    osc(g, 'sine', hz(e.n), t, end, A);
    return end;
  },
  upright(g, e, t, dur, out) {
    const f = hz(e.n),
      fl = filt(g, 'lowpass', 700, 1, out),
      A = amp(g, fl);
    A.gain.setValueAtTime(0, t);
    A.gain.linearRampToValueAtTime(e.v * 0.32, t + 0.006);
    A.gain.setTargetAtTime(e.v * 0.12, t + 0.006, 0.12);
    A.gain.setTargetAtTime(0, t + dur, 0.05);
    const end = t + dur + 0.25;
    osc(g, 'triangle', f, t, end, A);
    osc(g, 'sine', f, t, end, A);
    return end;
  },
  pluck(g, e, t, dur, out, o) {
    const f = hz(e.n),
      fl = filt(g, 'lowpass', o.cut ?? 4500, o.q ?? 2),
      A = amp(g, out);
    fl.frequency.setValueAtTime(o.cut ?? 4500, t);
    fl.frequency.setTargetAtTime(o.floor ?? 500, t, o.dec ?? 0.08);
    fl.connect(A);
    const end = adsr(A.gain, t, 0.003, o.len ?? 0.3, 0, 0.12, e.v * 0.09, dur);
    osc(g, o.wave ?? 'sawtooth', f, t, end, fl);
    osc(g, 'square', f, t, end, fl, 7);
    return end;
  },
  bell(g, e, t, dur, out, o) {
    const dec = o.dec ?? 1.6,
      A = amp(g, out),
      end = t + Math.max(dur, dec * 1.5);
    perc(A.gain, t, e.v * (o.lvl ?? 0.11), dec / 4);
    fm(g, t, end, hz(e.n), o.ratio ?? 3.5, o.index ?? 2.2, (o.index ?? 2.2) * 0.08, dec / 3, A);
    return end;
  },
  glock(g, e, t, dur, out, o) {
    return V.bell(g, e, t, dur, out, { ratio: 3, index: 1.2, dec: 0.8, lvl: 0.09, ...o });
  },
  epiano(g, e, t, dur, out, o) {
    const f = hz(e.n),
      A = amp(g, out),
      end = t + dur + 0.6;
    A.gain.setValueAtTime(0, t);
    A.gain.linearRampToValueAtTime(e.v * 0.12, t + 0.004);
    A.gain.setTargetAtTime(e.v * 0.05, t + 0.004, 0.5);
    A.gain.setTargetAtTime(0, t + dur, 0.12);
    fm(g, t, end, f, 1, o.index ?? 1.6, 0.25, 0.25, A);
    fm(g, t, t + 0.3, f, 14, 0.4, 0, 0.03, A);
    return end;
  },
  // o.felt: felt piano (03 B.2), dull hammer: low-passed ~1.2 kHz, lower FM index, slower attack, a soft 90 Hz thump.
  piano(g, e, t, dur, out, o) {
    const f = hz(e.n),
      felt = !!o.felt,
      dec = o.dec ?? (felt ? 1.1 : 0.9),
      att = felt ? 0.007 : 0.003,
      A = amp(g, felt ? filt(g, 'lowpass', o.cut ?? 1200, 0.5, out) : out),
      end = t + Math.min(dur + 0.6, dec * 5);
    A.gain.setValueAtTime(0, t);
    A.gain.linearRampToValueAtTime(e.v * (felt ? 0.16 : 0.12), t + att);
    A.gain.setTargetAtTime(0, t + att, dec);
    A.gain.setTargetAtTime(0, t + dur, 0.12);
    fm(g, t, end, f, 1, felt ? 1.2 : 2.5, 0.3, 0.15, A);
    const tri = G(g.ctx, 0.35, A);
    osc(g, 'triangle', f, t, end, tri);
    if (felt) {
      const T = amp(g, out);
      perc(T.gain, t, e.v * 0.06, 0.01);
      osc(g, 'sine', 90, t, t + 0.06, T);
    }
    return end;
  },
  // Music box: a steel tine, sine with two inharmonic partials (~3×, ~5.4×) dying faster, the click of the cylinder pin.
  musicbox(g, e, t, dur, out, o) {
    const f = hz(e.n),
      dec = o.dec ?? 0.9,
      A = amp(g, out),
      end = t + dec * 2.4;
    perc(A.gain, t, e.v * (o.lvl ?? 0.13), dec / 3);
    osc(g, 'sine', f, t, end, A);
    for (const [k, w, s] of [
      [3, 0.3, 0.35],
      [5.4, 0.16, 0.18],
    ])
      if (f * k < 14000) {
        const P = G(g.ctx, 0, A);
        perc(P.gain, t, w, (dec * s) / 3);
        osc(g, 'sine', f * k, t, t + dec * s * 2.4, P);
      }
    const C = amp(g, out);
    perc(C.gain, t, e.v * 0.04, 0.0015);
    noise(g, t, t + 0.02, filt(g, 'bandpass', 4200, 2, C));
    return end;
  },
  // Plucked string (nylon guitar / harp): Karplus–Strong rendered in JS (ks.js), cached per note.
  ks(g, e, t, dur, out, o) {
    const b = ksBuffer(g, e.n, o),
      A = amp(g, out),
      s = src(g.ctx.createBufferSource()),
      end = Math.min(t + b.duration, t + dur + 0.6);
    s.buffer = b;
    A.gain.setValueAtTime(e.v * (o.lvl ?? 0.2), t);
    A.gain.setTargetAtTime(0, end - 0.15, 0.04);
    s.connect(A);
    s.start(t);
    s.stop(end + 0.02);
    return end;
  },
  // Flute / ocarina: sine + 15 % triangle, breath noise (band-pass at 2f) mostly on the attack, delayed 5 Hz vibrato.
  flute(g, e, t, dur, out, o) {
    const f = hz(e.n),
      peak = e.v * (o.lvl ?? 0.12),
      A = amp(g, out),
      end = adsr(A.gain, t, o.a ?? 0.06, 0.2, 0.85, o.r ?? 0.12, peak, dur),
      s = osc(g, 'sine', f, t, end, A),
      tr = osc(g, 'triangle', f, t, end, G(g.ctx, 0.15, A));
    vibrato(g, t, end, 8, 5, [s, tr], 0.35);
    const B = amp(g, out);
    B.gain.setValueAtTime(0, t);
    B.gain.linearRampToValueAtTime(peak * 0.3, t + 0.06);
    B.gain.setTargetAtTime(peak * 0.1, t + 0.06, 0.08);
    B.gain.setTargetAtTime(0, t + dur, 0.05);
    noise(g, t, end, filt(g, 'bandpass', Math.min(2 * f, 9000), 4, B));
    return end;
  },
  // "Whispered paper": noise ringing on the chord tones through narrow band-passes, slow attack (no saw).
  paperpad(g, e, t, dur, out, o) {
    const A = amp(g, out),
      end = adsr(A.gain, t, o.a ?? 1.5, 1, 0.9, o.r ?? 1.5, e.v * (o.lvl ?? 1.4), dur),
      bus = G(g.ctx, 1);
    noise(g, t, end, bus);
    for (const n of (o.notes ?? [e.n]).slice(0, 4))
      bus.connect(filt(g, 'bandpass', hz(n), o.q ?? 30, A));
    return end;
  },
  // Finger on a shoe box: soft sine thump + a short cardboard knock (~350 Hz).
  box(g, e, t, dur, out) {
    const A = amp(g, out),
      x = osc(g, 'sine', 75, t, t + 0.6, A);
    x.frequency.exponentialRampToValueAtTime(48, t + 0.1);
    perc(A.gain, t, e.v * 0.4, 0.1);
    const C = amp(g, out);
    perc(C.gain, t, e.v * 0.5, 0.008);
    noise(g, t, t + 0.06, filt(g, 'bandpass', 350, 1.5, C));
    return t + 0.65;
  },
  // Flat hand on a sheet of paper: band-passed noise, double hit (0 and 9 ms), 40 ms decay, no tone.
  page(g, e, t, dur, out) {
    const A = amp(g, out),
      p = A.gain,
      pk = e.v * 0.28;
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(pk * 0.7, t + 0.001);
    p.setTargetAtTime(0, t + 0.001, 0.003);
    p.setValueAtTime(pk, t + 0.009);
    p.setTargetAtTime(0, t + 0.009, 0.013);
    noise(g, t, t + 0.15, filt(g, 'bandpass', 1800, 0.9, A));
    return t + 0.15;
  },
  // Brush on paper: 20 ms attack, 3–4.5 kHz (above 5 kHz belongs to the plane's wind).
  brush(g, e, t, dur, out) {
    const A = amp(g, out),
      p = A.gain;
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(e.v * 0.08, t + 0.02);
    p.setTargetAtTime(0, t + 0.02, 0.03);
    noise(g, t, t + 0.2, filt(g, 'bandpass', 3700, 2.5, A));
    return t + 0.2;
  },
  // Pencil tap on the table: 5 ms, 2.2 kHz, quiet (never inside a QTE window: audio.js drops it there).
  pencil(g, e, t, dur, out) {
    const A = amp(g, out),
      end = perc(A.gain, t, e.v * 0.07, 0.0025);
    osc(g, 'triangle', 2200, t, end, A);
    noise(g, t, end, filt(g, 'bandpass', 3000, 2, A));
    return end;
  },
  crumple(g, e, t, dur, out, o) {
    const b = crumpleBuffer(g, o.seed ?? 1),
      A = G(g.ctx, e.v * (o.lvl ?? 0.3), out),
      s = src(g.ctx.createBufferSource());
    s.buffer = b;
    s.connect(A);
    s.start(t);
    return t + b.duration;
  },
  lead(g, e, t, dur, out, o) {
    const f = hz(e.n),
      fl = filt(g, 'lowpass', o.cut ?? 2600, o.q ?? 1.5),
      A = amp(g, out);
    fl.connect(A);
    const end = adsr(A.gain, t, o.a ?? 0.015, 0.3, 0.75, o.r ?? 0.18, e.v * 0.07, dur);
    vibrato(
      g,
      t,
      end,
      o.vib ?? 9,
      5.2,
      [-6, 6].map(d => osc(g, o.wave ?? 'sawtooth', f, t, end, fl, d)),
    );
    return end;
  },
  sax(g, e, t, dur, out, o) {
    const f = hz(e.n),
      lp = filt(g, 'lowpass', 2800, 0.7),
      bp = filt(g, 'bandpass', 1100, 1.2, lp),
      A = amp(g, out);
    lp.connect(A);
    const end = adsr(A.gain, t, 0.06, 0.2, 0.8, 0.15, e.v * 0.16, dur);
    vibrato(g, t, end, 14, 5, [osc(g, 'sawtooth', f, t, end, bp)], 0.25);
    const br = G(g.ctx, e.v * 0.01, A);
    noise(g, t, end, filt(g, 'bandpass', 2000, 1, br));
    return end;
  },
  tri(g, e, t, dur, out) {
    const A = amp(g, out),
      end = adsr(A.gain, t, 0.002, 0.1, 0.9, 0.02, e.v * 0.24, dur);
    osc(g, 'triangle', hz(e.n), t, end, A);
    return end;
  },
  kick(g, e, t, dur, out, o) {
    const A = amp(g, out),
      x = osc(g, 'sine', o.f0 ?? 140, t, t + 0.5, A);
    x.frequency.exponentialRampToValueAtTime(o.f1 ?? 44, t + 0.12);
    perc(A.gain, t, e.v * 0.8, o.dec ?? 0.09);
    const C = amp(g, out);
    perc(C.gain, t, e.v * 0.07, 0.004);
    noise(g, t, t + 0.03, filt(g, 'highpass', 3000, 0.7, C));
    return t + 0.6;
  },
  felt(g, e, t, dur, out) {
    const A = amp(g, out),
      x = osc(g, 'sine', 75, t, t + 0.6, A);
    x.frequency.exponentialRampToValueAtTime(48, t + 0.1);
    perc(A.gain, t, e.v * 0.4, 0.11);
    return t + 0.7;
  },
  snare(g, e, t, dur, out, o) {
    const A = amp(g, out),
      B = amp(g, out);
    noise(g, t, t + 0.45, filt(g, 'bandpass', o.tone ?? 1900, 0.8, A));
    let end;
    if (o.gate) {
      A.gain.setValueAtTime(e.v * 0.3, t);
      A.gain.linearRampToValueAtTime(e.v * 0.16, t + 0.2);
      A.gain.setValueAtTime(0, t + 0.21);
      end = t + 0.25;
    } else end = perc(A.gain, t, e.v * 0.32, o.dec ?? 0.05);
    const x = osc(g, 'triangle', 190, t, t + 0.15, B);
    x.frequency.exponentialRampToValueAtTime(155, t + 0.05);
    perc(B.gain, t, e.v * 0.22, 0.03);
    return end;
  },
  clap(g, e, t, dur, out) {
    const A = amp(g, out),
      p = A.gain;
    p.setValueAtTime(0, t);
    for (const k of [0, 0.011, 0.022]) {
      p.setValueAtTime(e.v * 0.3, t + k);
      p.setTargetAtTime(0, t + k, 0.004);
    }
    p.setValueAtTime(e.v * 0.3, t + 0.033);
    p.setTargetAtTime(0, t + 0.033, 0.05);
    noise(g, t, t + 0.4, filt(g, 'bandpass', 1300, 1.2, A));
    return t + 0.4;
  },
  hat(g, e, t, dur, out, o) {
    const A = amp(g, out),
      end = perc(A.gain, t, e.v * 0.11, o.open ? 0.09 : 0.018);
    noise(g, t, end, filt(g, 'highpass', 7500, 0.7, A));
    return end;
  },
  shaker(g, e, t, dur, out) {
    const A = amp(g, out),
      p = A.gain;
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(e.v * 0.07, t + 0.012);
    p.setTargetAtTime(0, t + 0.012, 0.025);
    noise(g, t, t + 0.18, filt(g, 'bandpass', 5500, 1.5, A));
    return t + 0.18;
  },
  rim(g, e, t, dur, out) {
    const A = amp(g, out),
      end = perc(A.gain, t, e.v * 0.13, 0.012);
    osc(g, 'triangle', 1700, t, end, A);
    noise(g, t, end, filt(g, 'bandpass', 3000, 2, A));
    return end;
  },
  tom(g, e, t, dur, out) {
    const f = hz(e.n ?? 50),
      A = amp(g, out),
      x = osc(g, 'sine', f * 1.6, t, t + 0.4, A);
    x.frequency.exponentialRampToValueAtTime(f, t + 0.12);
    perc(A.gain, t, e.v * 0.45, 0.1);
    return t + 0.6;
  },
  crash(g, e, t, dur, out) {
    const A = amp(g, out),
      end = perc(A.gain, t, e.v * 0.09, 1.1 / 3);
    noise(g, t, end, filt(g, 'highpass', 5000, 0.5, A));
    return end;
  },
  vinyl(g, e, t, dur, out) {
    const A = amp(g, out),
      end = adsr(A.gain, t, 0.5, 0.1, 1, 0.5, e.v * 0.6, dur);
    noise(g, t, end, A, 1, g.crackle);
    const H = G(g.ctx, e.v * 0.006, A);
    noise(g, t, end, filt(g, 'lowpass', 2500, 0.5, H));
    return end;
  },
  // Wind and the city as filtered noise; the band wanders slowly (seeded per event).
  air(g, e, t, dur, out, o) {
    const A = amp(g, out),
      bp = filt(g, 'bandpass', 500, 0.8, A),
      r = lcg(1 + ((o.seed ?? 1) % 1000)),
      end = adsr(A.gain, t, 2.5, 1, 1, 2.5, e.v * 0.07, dur);
    for (let k = 0, tt = t; tt < end; k++, tt += 1.3)
      bp.frequency.linearRampToValueAtTime(420 + 260 * r(), tt);
    noise(g, t, end, bp);
    const R = G(g.ctx, 0.6, A);
    noise(g, t, end, filt(g, 'lowpass', 180, 0.7, R), 0.5);
    return end;
  },
  rain(g, e, t, dur, out) {
    const A = amp(g, out),
      end = adsr(A.gain, t, 1.5, 0.5, 1, 1.5, e.v * 0.035, dur);
    noise(g, t, end, filt(g, 'bandpass', 3200, 0.4, A), 1.3);
    return end;
  },
  // o.reed: harmonium (reeds), extra odd harmonics, 80 ms attack, 5.5 Hz tremolo; the band's only warm drone.
  organ(g, e, t, dur, out, o) {
    const f = hz(e.n),
      reed = !!o.reed,
      A = amp(g, out),
      end = adsr(A.gain, t, reed ? 0.08 : 0.004, 0.1, 0.9, reed ? 0.3 : 0.05, e.v * 0.045, dur);
    let to = A;
    if (reed) {
      to = G(g.ctx, 0.85, A);
      osc(g, 'sine', 5.5, t, end, G(g.ctx, 0.15, to.gain));
    }
    (reed
      ? [
          [1, 1],
          [2, 0.45],
          [3, 0.4],
          [4, 0.12],
          [5, 0.2],
        ]
      : [
          [1, 1],
          [2, 0.6],
          [3, 0.35],
          [4, 0.2],
        ]
    ).forEach(([k, w]) => osc(g, 'sine', f * k, t, end, G(g.ctx, w, to)));
    return end;
  },
  choir(g, e, t, dur, out, o) {
    const f = hz(e.n),
      A = amp(g, out),
      end = adsr(A.gain, t, o.a ?? 0.9, 1, 0.9, o.r ?? 1.2, e.v * 0.1, dur),
      src = G(g.ctx, 1);
    for (const [fr, w] of FORMANTS[o.vowel ?? 'a'])
      src.connect(filt(g, 'bandpass', fr, 8, G(g.ctx, w, A)));
    vibrato(
      g,
      t,
      end,
      7,
      4.5,
      [-8, 8].map(d => osc(g, 'sawtooth', f, t, end, src, d)),
      0.6,
    );
    return end;
  },
  // Effects.
  wood(g, e, t, dur, out) {
    const A = amp(g, out),
      end = perc(A.gain, t, e.v * 0.5, 0.022);
    osc(g, 'sine', hz(e.n), t, end, A);
    osc(g, 'triangle', hz(e.n) * 2.76, t, end, G(g.ctx, 0.3, A));
    const C = amp(g, out);
    perc(C.gain, t, e.v * 0.25, 0.006);
    noise(g, t, t + 0.04, filt(g, 'bandpass', 2600, 3, C));
    return end;
  },
  whoosh(g, e, t, dur, out, o) {
    const A = amp(g, out),
      bp = filt(g, 'bandpass', o.f0 ?? 400, 1.2, A);
    bp.frequency.setValueAtTime(o.f0 ?? 400, t);
    bp.frequency.exponentialRampToValueAtTime(o.f1 ?? 2400, t + dur);
    const end = adsr(A.gain, t, dur * 0.45, 0.2, 0.4, 0.15, e.v * 0.25, dur);
    noise(g, t, end, bp);
    return end;
  },
  flop(g, e, t, dur, out, o) {
    const A = amp(g, out);
    perc(A.gain, t, e.v * 0.5, 0.06);
    noise(g, t, t + 0.4, filt(g, 'lowpass', 700, 0.8, A));
    // The deep thud (< 120 Hz) belongs to the screen shake: off with calm audio or reduced motion (o.deep false).
    if (o.deep !== false) {
      const B = amp(g, out),
        x = osc(g, 'sine', 110, t, t + 0.4, B);
      x.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      perc(B.gain, t, e.v * 0.6, 0.06);
    }
    if (o.water) {
      const W = amp(g, out);
      perc(W.gain, t + 0.02, e.v * 0.18, 0.09);
      noise(g, t, t + 0.7, filt(g, 'highpass', 2500, 0.6, W));
    }
    return t + 0.7;
  },
};
export const VOICE_NAMES = Object.keys(V);
// e = {i voice, n MIDI note, d beats, v velocity, o options}; spb = seconds per beat (1 → d in seconds).
export function playVoice(g, e, t, spb, out) {
  const f = V[e.i];
  if (!f) return t;
  cur = { nodes: [], src: [] };
  let end;
  try {
    end = f(g, e, t, Math.max(0.02, (e.d ?? 0.25) * spb), out, e.o ?? {});
  } finally {
    const c = cur;
    cur = null;
    let left = c.src.length;
    const done = () => {
      if (--left > 0) return;
      for (const n of [...c.src, ...c.nodes]) n.disconnect();
    };
    for (const s of c.src) s.onended = done;
  }
  return end;
}
