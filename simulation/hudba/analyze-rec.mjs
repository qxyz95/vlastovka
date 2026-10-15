// Analysis of a recording from the game (?audio=rec): the WAV of the master bus (16-bit PCM from the AudioWorklet)
// and the JSON event log. No dependencies. Usage:
//   node simulation/hudba/analyze-rec.mjs jti-….wav [jti-….json] [--click 0.25] [--align ms] [--json] [--out report.md]
// Measures: integrated loudness (src/audio-loudness.js, BS.1770), sample peak, clicks (sample jump over a threshold, also
// outside ±60 ms of logged effects), dropouts (digital silence inside sound, lost chunks, underruns from the log),
// ticks inside silence masks, and the share of perfects among resolved QTE.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { lufs, blockPowers, samplePeak } from '../../src/audio-loudness.js';

// RIFF/WAVE: PCM 16/24/32-bit integer or 32-bit float, any channel count → {rate, channels: Float32Array[]}.
export function parseWav(buf) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE')
    throw new Error('not a RIFF/WAVE file');
  let fmt = null,
    data = null;
  for (let o = 12; o + 8 <= b.length; ) {
    const id = b.toString('ascii', o, o + 4);
    let size = b.readUInt32LE(o + 4);
    if (id === 'data' && (size === 0 || o + 8 + size > b.length)) size = b.length - o - 8; // streamed header
    if (id === 'fmt ')
      fmt = {
        format: b.readUInt16LE(o + 8),
        channels: b.readUInt16LE(o + 10),
        rate: b.readUInt32LE(o + 12),
        bits: b.readUInt16LE(o + 22),
      };
    else if (id === 'data') data = { at: o + 8, size };
    o += 8 + size + (size & 1);
  }
  if (!fmt || !data) throw new Error('missing fmt or data chunk');
  const { channels: n, bits, format } = fmt,
    step = (bits / 8) * n,
    frames = Math.floor(data.size / step),
    out = Array.from({ length: n }, () => new Float32Array(frames)),
    float = format === 3;
  for (let i = 0; i < frames; i++)
    for (let c = 0; c < n; c++) {
      const o = data.at + i * step + (c * bits) / 8;
      out[c][i] =
        float && bits === 32
          ? b.readFloatLE(o)
          : bits === 16
            ? b.readInt16LE(o) / 32768
            : bits === 24
              ? b.readIntLE(o, 3) / 8388608
              : bits === 32
                ? b.readInt32LE(o) / 2147483648
                : (b.readUInt8(o) - 128) / 128;
    }
  return { rate: fmt.rate, channels: out };
}

// Integrated loudness of a long recording in chunks (lufs() would hold two Float64 copies of 15 min per channel):
// each chunk is filtered with `pre` s of warm-up whose blocks are dropped, then the same gating as lufs().
const toLufs = z => (z > 0 ? -0.691 + 10 * Math.log10(z) : -Infinity);
export function lufsLong(channels, rate, chunk = 60, pre = 1) {
  const len = channels[0]?.length ?? 0;
  if (len <= (chunk + pre) * rate) return lufs(channels, rate);
  const seg = Math.round(rate * 0.1),
    per = Math.round(chunk / 0.1) * seg,
    warm = Math.round(pre / 0.1) * seg,
    z = [];
  for (let s = 0; s < len; s += per) {
    const a = Math.max(0, s - warm),
      b = Math.min(len, s + per + 3 * seg),
      bl = blockPowers(
        channels.map(ch => ch.subarray(a, b)),
        rate,
      ),
      skip = (s - a) / seg;
    for (let j = skip; j < bl.length && j - skip < per / seg; j++) z.push(bl[j]);
  }
  const mean = x => x.reduce((q, v) => q + v, 0) / x.length,
    abs = z.filter(x => toLufs(x) > -70);
  if (!abs.length) return -Infinity;
  const rel = toLufs(mean(abs)) - 10;
  return toLufs(mean(abs.filter(x => toLufs(x) > rel)));
}

const SFX = [
  'tick',
  'success',
  'perfect',
  'miss',
  'land',
  'throw',
  'boost',
  'stinger',
  'jingle',
  'finale',
];
const db = x => (x > 0 ? 20 * Math.log10(x) : -Infinity);
function rms(channels, a, b) {
  let s = 0,
    n = 0;
  for (const ch of channels)
    for (let i = Math.max(0, a); i < Math.min(ch.length, b); i++) {
      s += ch[i] * ch[i];
      n++;
    }
  return n ? Math.sqrt(s / n) : 0;
}
const median = a => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

// Offset of the recording against the log (s, − = the sound comes earlier in the WAV than the logged audio time),
// estimated from the onsets of the ticks (scheduled ahead, so their audio time is exact, and +9 LU over the music):
// the first 1 ms block inside [at − 80 ms, at + 40 ms] louder than 4× the median of the 60 ms before it. Median over ticks.
export function estimateAlign(channels, rate, times) {
  const ms = Math.round(rate / 1000),
    found = [];
  for (const at of times) {
    const s0 = Math.round((at - 0.08) * rate),
      env = [];
    for (let k = 0; k < 120; k++) env.push(rms(channels, s0 + k * ms, s0 + (k + 1) * ms));
    const base = median(
      Array.from({ length: 60 }, (_, k) => rms(channels, s0 - (60 - k) * ms, s0 - (59 - k) * ms)),
    );
    const k = env.findIndex(v => v > 4 * Math.max(base, 1e-5));
    if (k >= 0) found.push((s0 + k * ms) / rate - at);
  }
  return found.length ? { align: median(found), from: found.length } : { align: null, from: 0 };
}

// o = {click: jump threshold (full scale 1), near: s around logged effects, minGap: s of digital silence = dropout}
export function analyze({ rate, channels }, log = { events: [] }, o = {}) {
  const click = o.click ?? 0.25,
    near = o.near ?? 0.06,
    minGap = o.minGap ?? 0.005,
    raw = log.events ?? [],
    len = channels[0]?.length ?? 0,
    cancelled = new Set(raw.filter(e => e.type === 'uncue').map(e => e.id)),
    tickTimes = raw
      .filter(e => e.type === 'cue' && e.name === 'tick' && e.at != null && !cancelled.has(e.id))
      .map(e => e.at),
    est =
      o.align != null
        ? { align: o.align, from: 'manual' }
        : estimateAlign(channels, rate, tickTimes),
    sh = x => (x == null ? x : x + (est.align ?? 0)),
    ev = raw.map(e => ({ ...e, at: sh(e.at), until: sh(e.until), t: sh(e.t) })),
    cues = ev.filter(e => e.type === 'cue' && e.at != null),
    sfxAt = cues.filter(e => SFX.includes(e.name)).map(e => e.at);
  // Clicks: |x[n] − x[n−1]| over the threshold in any channel; one per 10 ms.
  const clicks = [];
  let last = -Infinity;
  for (let i = 1; i < len; i++) {
    let j = 0;
    for (const ch of channels) j = Math.max(j, Math.abs(ch[i] - ch[i - 1]));
    if (j > click && i - last > rate * 0.01) {
      clicks.push({ t: i / rate, jump: j });
      last = i;
    }
  }
  const outside = clicks.filter(c => !sfxAt.some(t => Math.abs(t - c.t) <= near));
  // Dropouts: runs of exact digital zero ≥ minGap with sound (> −60 dBFS) in the 50 ms on both sides.
  const zeros = [],
    win = Math.round(rate * 0.05);
  for (let i = 0, start = -1; i <= len; i++) {
    const z = i < len && channels.every(ch => ch[i] === 0);
    if (z && start < 0) start = i;
    else if (!z && start >= 0) {
      if (
        i - start >= minGap * rate &&
        db(rms(channels, start - win, start)) > -60 &&
        db(rms(channels, i, i + win)) > -60
      )
        zeros.push({ t: start / rate, ms: ((i - start) / rate) * 1000 });
      start = -1;
    }
  }
  const stats = ev.filter(e => e.type === 'stats' && e.underruns != null),
    underruns = stats.length ? stats.at(-1).underruns - stats[0].underruns : null,
    underrunMs = stats.length ? stats.at(-1).underrunMs - stats[0].underrunMs : null;
  // Ticks (not cancelled) and silence masks: each tick inside some mask; how quiet the mask is before the tick.
  const ticks = cues.filter(e => e.name === 'tick' && !cancelled.has(e.id)),
    masks = cues.filter(e => e.name === 'mask' && e.until != null).map(e => [e.at, e.until]),
    inMask = t => masks.find(([a, b]) => t >= a - 1e-3 && t <= b + 1e-3),
    quiet = [],
    outsideTicks = [];
  for (const k of ticks) {
    const m = inMask(k.at);
    if (!m) {
      outsideTicks.push(k.at);
      continue;
    }
    const a = Math.round(m[0] * rate),
      b = Math.round((k.at - 0.005) * rate);
    if (b - a > rate * 0.03 && a - rate >= 0) {
      const before = rms(channels, a - rate, a),
        inside = rms(channels, a, b);
      if (before > 0 && inside > 0) quiet.push(db(inside) - db(before));
    }
  }
  const hits = ev.filter(e => e.type === 'hit'),
    count = r => hits.filter(h => h.result === r).length,
    offs = hits.map(h => h.off).filter(Number.isFinite);
  return {
    seconds: len / rate,
    rate,
    align: { ms: est.align == null ? null : est.align * 1000, from: est.from },
    lufs: lufsLong(channels, rate),
    peak: samplePeak(channels),
    clicks: {
      threshold: click,
      count: clicks.length,
      outsideEffects: outside.length,
      first: outside.slice(0, 20),
    },
    dropouts: {
      silences: zeros.length,
      first: zeros.slice(0, 20),
      gaps: ev.filter(e => e.type === 'gap').length,
      underruns,
      underrunMs,
    },
    ticks: {
      count: ticks.length,
      cancelled: cancelled.size,
      inMask: ticks.length - outsideTicks.length,
      outside: outsideTicks.slice(0, 20),
      maskQuietDb: median(quiet),
    },
    hits: {
      count: hits.length,
      perfect: count('perfect'),
      success: hits.filter(h => ['success', 'partial', 'half'].includes(h.result)).length,
      miss: count('miss'),
      perfectShare: hits.length ? count('perfect') / hits.length : null,
      offsetMedianMs: offs.length ? median(offs) * 1000 : null,
    },
    presses: ev.filter(e => e.type === 'press').length,
    latency: log.meta ? { base: log.meta.baseLatency, output: log.meta.outputLatency } : null,
  };
}

const f1 = (x, d = 1) => (x == null || !Number.isFinite(x) ? '–' : x.toFixed(d));
export function report(r, name = 'záznam') {
  const pctS = x => (x == null ? '–' : (x * 100).toFixed(0) + ' %');
  return [
    `# Rozbor záznamu ${name}`,
    '',
    '| Měřítko | Hodnota |',
    '|---|---|',
    `| Délka | ${f1(r.seconds / 60)} min (${r.rate} Hz) |`,
    `| Posun záznamu proti logu | ${f1(r.align.ms, 0)} ms (z ${r.align.from} tiků; − = zvuk ve WAV dřív) |`,
    `| Integrovaná hlasitost | ${f1(r.lufs)} LUFS |`,
    `| Vzorkový vrchol | ${f1(r.peak)} dBFS |`,
    `| Cvaknutí (skok > ${r.clicks.threshold}) | ${r.clicks.count}, mimo efekty ${r.clicks.outsideEffects} |`,
    `| Výpadky: digitální ticho uvnitř zvuku | ${r.dropouts.silences} |`,
    `| Výpadky: ztracené bloky záznamu | ${r.dropouts.gaps} |`,
    `| Výpadky: underruns (playbackStats) | ${r.dropouts.underruns ?? 'n/a'}${r.dropouts.underrunMs != null ? ` (${f1(r.dropouts.underrunMs, 0)} ms)` : ''} |`,
    `| Tiky v maskách ticha | ${r.ticks.inMask} / ${r.ticks.count} (zrušené ${r.ticks.cancelled}) |`,
    `| Maska před tikem proti 1 s před maskou (medián) | ${f1(r.ticks.maskQuietDb)} dB |`,
    `| QTE: perfekt / úspěch / minutí | ${r.hits.perfect} / ${r.hits.success} / ${r.hits.miss} (perfekty ${pctS(r.hits.perfectShare)}) |`,
    `| Medián odchylky stisku od středu | ${f1(r.hits.offsetMedianMs, 0)} ms (+ = pozdě) |`,
    `| Stisky | ${r.presses} |`,
    `| Latence base / output | ${r.latency ? `${f1(r.latency.base * 1000, 0)} / ${f1(r.latency.output * 1000, 0)} ms` : '–'} |`,
    '',
    r.clicks.first.length
      ? 'Cvaknutí mimo efekty (s): ' + r.clicks.first.map(c => f1(c.t, 2)).join(', ')
      : 'Cvaknutí mimo efekty: žádné.',
    r.dropouts.first.length
      ? 'Digitální ticho (s, ms): ' +
        r.dropouts.first.map(z => `${f1(z.t, 2)} (${f1(z.ms, 0)})`).join(', ')
      : 'Digitální ticho uvnitř zvuku: žádné.',
    r.ticks.outside.length
      ? 'Tiky mimo masku (s): ' + r.ticks.outside.map(t => f1(t, 2)).join(', ')
      : '',
    '',
  ].join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2),
    opt = k => {
      const i = args.indexOf(k);
      return i >= 0 ? args.splice(i, 2)[1] : null;
    },
    click = opt('--click'),
    align = opt('--align'),
    out = opt('--out'),
    json = args.includes('--json'),
    files = args.filter(a => !a.startsWith('--'));
  const wav = files.find(f => /\.wav$/i.test(f)),
    logFile = files.find(f => /\.json$/i.test(f)) ?? wav?.replace(/\.wav$/i, '.json');
  if (!wav) {
    console.error(
      'usage: node simulation/hudba/analyze-rec.mjs rec.wav [rec.json] [--click 0.25] [--align ms] [--json] [--out report.md]',
    );
    process.exit(2);
  }
  let log = { events: [] };
  try {
    log = JSON.parse(readFileSync(logFile, 'utf8'));
  } catch {
    console.error(`(no event log ${logFile}: ticks, masks and QTE are not assessed)`);
  }
  const r = analyze(parseWav(readFileSync(wav)), log, {
    ...(click && { click: Number(click) }),
    ...(align && { align: Number(align) / 1000 }),
  });
  const text = json ? JSON.stringify(r, null, 1) : report(r, wav.split(/[\\/]/).pop());
  if (out) writeFileSync(out, text);
  console.log(text);
}
