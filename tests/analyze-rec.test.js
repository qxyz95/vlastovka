// Analyzer of game recordings (?audio=rec): WAV written like game-audio.js writes it, a synthetic event log.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseWav,
  analyze,
  lufsLong,
  report,
  estimateAlign,
} from '../simulation/hudba/analyze-rec.mjs';
import { wavHeader } from '../src/game-audio.js';
import { lufs } from '../src/audio-loudness.js';

const RATE = 48000;
// Interleaved 16-bit stereo like the recording worklet, behind the same header.
function wav(L, R = L) {
  const pcm = new Int16Array(L.length * 2),
    q = v => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
  for (let i = 0; i < L.length; i++) {
    pcm[2 * i] = q(L[i]);
    pcm[2 * i + 1] = q(R[i]);
  }
  return Buffer.concat([Buffer.from(wavHeader(L.length, RATE)), Buffer.from(pcm.buffer)]);
}
const sine = (sec, dbfs, f = 1000) => {
  const a = 10 ** (dbfs / 20);
  return Float32Array.from(
    { length: Math.round(sec * RATE) },
    (_, i) => a * Math.sin((2 * Math.PI * f * i) / RATE),
  );
};

test('parseWav reads back what the recorder writes (16-bit stereo), float WAV too', () => {
  const x = sine(0.1, -6),
    w = parseWav(wav(x));
  assert.equal(w.rate, RATE);
  assert.equal(w.channels.length, 2);
  assert.equal(w.channels[0].length, x.length);
  assert.ok(Math.max(...x.map((v, i) => Math.abs(v - w.channels[1][i]))) < 1e-4);
  const f = Buffer.concat([
    Buffer.from(wavHeader(3, RATE, 1, 32)),
    Buffer.from(new Float32Array([0.5, -0.25, 1]).buffer),
  ]);
  assert.deepEqual([...parseWav(f).channels[0]], [0.5, -0.25, 1]);
  assert.throws(() => parseWav(Buffer.from('nope, not a wav file at all......')), /RIFF/);
});
test('loudness: a 1 kHz sine at −23 dBFS in both channels is −23 LUFS; the chunked version equals lufs()', () => {
  const x = sine(20, -23),
    w = parseWav(wav(x));
  assert.ok(Math.abs(analyze(w).lufs + 23) < 0.1, String(analyze(w).lufs));
  const y = sine(30, -20, 440);
  for (let i = 10 * RATE; i < 14 * RATE; i++) y[i] *= 0.1; // a quiet part, so the gating matters
  assert.ok(Math.abs(lufsLong([y, y], RATE, 5, 1) - lufs([y, y], RATE)) < 0.01);
});
test('clicks, dropouts, ticks in masks and the share of perfects from a synthetic recording', () => {
  const x = sine(20, -23);
  x[5 * RATE] = 0.6; // a click in the music
  x[10 * RATE] = 0.6; // the tick itself (a logged effect)
  x.fill(0, 8 * RATE, 8 * RATE + 0.02 * RATE); // 20 ms digital silence = dropout
  const log = {
    meta: { baseLatency: 0.01, outputLatency: 0.03 },
    events: [
      { type: 'stats', underruns: 0, underrunMs: 0 },
      { type: 'cue', name: 'mask', at: 9.88, until: 10.12 },
      { type: 'cue', name: 'tick', id: 1, at: 10 },
      { type: 'cue', name: 'tick', id: 2, at: 15 },
      { type: 'cue', name: 'tick', id: 3, at: 16 },
      { type: 'uncue', id: 3 },
      { type: 'press' },
      { type: 'press' },
      ...['perfect', 'perfect', 'perfect', 'success', 'miss'].map((result, k) => ({
        type: 'hit',
        result,
        off: [0.01, -0.01, 0.02, 0.05, null][k],
      })),
      { type: 'gap', expected: 1, got: 2 },
      { type: 'stats', underruns: 2, underrunMs: 21.3 },
    ],
  };
  const r = analyze(parseWav(wav(x)), log);
  assert.equal(r.clicks.count, 2);
  assert.equal(r.clicks.outsideEffects, 1);
  assert.ok(Math.abs(r.clicks.first[0].t - 5) < 0.001);
  assert.equal(r.dropouts.silences, 1);
  assert.ok(Math.abs(r.dropouts.first[0].ms - 20) < 0.1);
  assert.equal(r.dropouts.gaps, 1);
  assert.equal(r.dropouts.underruns, 2);
  assert.equal(r.ticks.count, 2, 'cancelled tick does not count');
  assert.equal(r.ticks.inMask, 1);
  assert.deepEqual(r.ticks.outside, [15]);
  assert.ok(Math.abs(r.ticks.maskQuietDb) < 0.5, 'same sine inside and before the mask');
  assert.equal(r.hits.perfect, 3);
  assert.equal(r.hits.perfectShare, 0.6);
  assert.equal(r.hits.offsetMedianMs, 15);
  assert.equal(r.presses, 2);
  const md = report(r, 'x.wav');
  assert.match(md, /Tiky v maskách ticha \| 1 \/ 2/);
  assert.match(md, /perfekty 60 %/);
  // A clean recording: nothing reported.
  const c = analyze(parseWav(wav(sine(3, -20))), { events: [] });
  assert.deepEqual(
    [c.clicks.count, c.dropouts.silences, c.ticks.count, c.hits.perfectShare],
    [0, 0, 0, null],
  );
});
test('alignment of the WAV against the log is estimated from the tick onsets (or given by hand)', () => {
  const x = sine(6, -30);
  for (const at of [2, 4]) {
    const s = Math.round((at - 0.015) * RATE); // the recorder delivers the tick 15 ms early
    for (let i = 0; i < 0.04 * RATE; i++) x[s + i] += 0.5 * Math.sin(i / 3) * Math.exp(-i / 400);
  }
  const ticks = [2, 4].map((at, id) => ({ type: 'cue', name: 'tick', id, at })),
    est = estimateAlign([x, x], RATE, [2, 4]);
  assert.equal(est.from, 2);
  assert.ok(Math.abs(est.align + 0.015) < 0.0015, String(est.align));
  const r = analyze(parseWav(wav(x)), { events: ticks });
  assert.ok(Math.abs(r.align.ms + 15) < 1.5, String(r.align.ms));
  assert.equal(r.ticks.count, 2);
  assert.equal(analyze(parseWav(wav(x)), { events: ticks }, { align: 0 }).align.from, 'manual');
});
