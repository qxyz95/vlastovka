import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lufs, kFilter, momentary, momentaryAt, samplePeak } from '../src/audio-loudness.js';

// Reference values from the primary sources, checked 15. 10. 2026:
// ITU-R BS.1770-5 (11/2023) Annex 1 Tables 1–2 (K-filter at 48 kHz), gating 400 ms / 75 % / −70 LKFS / −10 LU:
//   https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-5-202311-I!!PDF-E.pdf
// EBU Tech 3341 (V4, 11/2023) Table 1, test cases 1, 2 and 4:
//   https://tech.ebu.ch/docs/tech/tech3341.pdf
//   #1 stereo sine 1000 Hz, −23.0 dBFS per-channel peak, in phase, 20 s → I = −23.0 ± 0.1 LUFS
//   #2 as #1 at −33.0 dBFS → −33.0 ± 0.1 LUFS
//   #4 10 s −72, 10 s −36, 60 s −23, 10 s −36, 10 s −72 dBFS → I = −23.0 ± 0.1 LUFS
const RATE = 48000;
function tone(parts, rate = RATE) {
  const n = parts.reduce((s, [sec]) => s + Math.round(sec * rate), 0),
    x = new Float32Array(n);
  let i = 0;
  for (const [sec, db] of parts)
    for (
      let k = 0, m = Math.round(sec * rate), a = db == null ? 0 : 10 ** (db / 20);
      k < m;
      k++, i++
    )
      x[i] = a * Math.sin((2 * Math.PI * 1000 * i) / rate);
  return [x, x.slice()];
}

test('K-filter at 48 kHz matches BS.1770-5 Tables 1 and 2', () => {
  const [s1, s2] = kFilter(48000),
    near = (x, y) => assert.ok(Math.abs(x - y) < 1e-8, `${x} vs ${y}`);
  [1.53512485958697, -2.69169618940638, 1.19839281085285].forEach((v, i) => near(s1.b[i], v));
  [1, -1.69065929318241, 0.73248077421585].forEach((v, i) => near(s1.a[i], v));
  [1, -2, 1].forEach((v, i) => near(s2.b[i], v));
  [1, -1.99004745483398, 0.99007225036621].forEach((v, i) => near(s2.a[i], v));
});
test('L-1 stereo 1 kHz sine at −23 dBFS gives −23.0 ± 0.1 LUFS (EBU Tech 3341 case 1), also at 44.1 kHz', () => {
  const l = lufs(tone([[20, -23]]), RATE);
  assert.ok(Math.abs(l + 23) <= 0.1, `${l}`);
  const l2 = lufs(tone([[20, -33]]), RATE);
  assert.ok(Math.abs(l2 + 33) <= 0.1, `case 2: ${l2}`);
  const l44 = lufs(tone([[20, -23]], 44100), 44100);
  assert.ok(Math.abs(l44 + 23) <= 0.1, `44.1 kHz: ${l44}`);
  const m = momentary(tone([[5, -23]]), RATE);
  assert.ok(
    m.every(v => Math.abs(v + 23) <= 0.1),
    'momentary of a steady tone',
  );
});
test('L-2 gating: silence is −Infinity, a 1 s sine is not dragged down by 10 s of silence', () => {
  assert.equal(lufs([new Float32Array(RATE * 5), new Float32Array(RATE * 5)], RATE), -Infinity);
  assert.equal(lufs([new Float32Array(100)], RATE), -Infinity, 'shorter than one block');
  const alone = lufs(tone([[1, -20]]), RATE),
    padded = lufs(
      tone([
        [1, -20],
        [10, null],
      ]),
      RATE,
    ),
    padded1 = lufs(
      tone([
        [1, -20],
        [1, null],
      ]),
      RATE,
    );
  // Without the gate 10 s of silence would cost 10·log10(11) ≈ 10.4 LU. The gate leaves only the three blocks that
  // straddle the end of the tone (75/50/25 % of it, all above −10 LU): exactly 10·log10(8.5/10) ≈ −0.71 LU.
  assert.ok(alone - padded < 0.75 && alone - padded > 0.65, `${alone} vs ${padded}`);
  assert.ok(Math.abs(padded - padded1) < 1e-9, 'the length of the silence does not matter');
  const long = lufs(tone([[10, -20]]), RATE),
    longPadded = lufs(
      tone([
        [10, -20],
        [10, null],
      ]),
      RATE,
    );
  assert.ok(long - longPadded < 0.5, `10 s tone + 10 s silence: ${long - longPadded} LU`);
  const c4 = lufs(
    tone([
      [10, -72],
      [10, -36],
      [60, -23],
      [10, -36],
      [10, -72],
    ]),
    RATE,
  );
  assert.ok(Math.abs(c4 + 23) <= 0.1, `EBU case 4: ${c4}`);
});
test('momentaryAt and samplePeak', () => {
  const ch = tone([
    [2, null],
    [2, -20],
  ]);
  assert.equal(momentaryAt(ch, RATE, 0.5), -Infinity);
  assert.ok(Math.abs(momentaryAt(ch, RATE, 3) + 20) < 0.2);
  assert.ok(Math.abs(samplePeak(ch) + 20) < 0.01);
  assert.equal(samplePeak([new Float32Array(10)]), -Infinity);
});
