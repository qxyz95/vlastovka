// A fake AudioContext for Node tests of audio.js: records parameter automation (set / linear ramp / target) and
// the start times of sources, nothing is rendered.
export function fakeParam(init = 0) {
  let ev = [];
  const p = {
    value: init,
    get events() {
      return ev;
    },
    setValueAtTime(v, t) {
      ev.push({ k: 'set', t, v });
      return p;
    },
    linearRampToValueAtTime(v, t) {
      ev.push({ k: 'ramp', t, v });
      return p;
    },
    exponentialRampToValueAtTime(v, t) {
      ev.push({ k: 'ramp', t, v });
      return p;
    },
    setTargetAtTime(v, t, tc) {
      ev.push({ k: 'target', t, v, tc });
      return p;
    },
    cancelScheduledValues(t) {
      ev = ev.filter(e => e.t < t);
      return p;
    },
    // Value of the automation at time x (Web Audio semantics for set, linear ramp and target).
    valueAt(x) {
      let val = init,
        at = 0,
        tg = null;
      const cur = t => (tg ? tg.v + (val - tg.v) * Math.exp(-(t - at) / tg.tc) : val);
      for (const e of [...ev].sort((a, b) => a.t - b.t)) {
        if (e.k === 'ramp') {
          const v0 = cur(at);
          if (x < e.t) return v0 + ((e.v - v0) * (x - at)) / Math.max(1e-12, e.t - at);
          val = e.v;
          at = e.t;
          tg = null;
          continue;
        }
        if (e.t > x) break;
        val = cur(e.t);
        at = e.t;
        if (e.k === 'set') {
          val = e.v;
          tg = null;
        } else tg = { v: e.v, tc: e.tc };
      }
      return cur(x);
    },
  };
  return p;
}
const node = (extra = {}) => ({ connect() {}, disconnect() {}, ...extra });
export function fakeContext(rate = 48000) {
  const starts = [];
  const source = extra =>
    node({
      onended: null,
      start(t = 0) {
        starts.push({ t, kind: extra.kind });
      },
      stop() {},
      ...extra,
    });
  const ctx = {
    currentTime: 0,
    sampleRate: rate,
    state: 'running',
    starts,
    createGain: () => node({ gain: fakeParam(1) }),
    createBiquadFilter: () =>
      node({ type: 'lowpass', frequency: fakeParam(350), Q: fakeParam(1), gain: fakeParam(0) }),
    createConvolver: () => node({ buffer: null }),
    createDelay: () => node({ delayTime: fakeParam(0) }),
    createDynamicsCompressor: () =>
      node({
        threshold: fakeParam(-24),
        knee: fakeParam(30),
        ratio: fakeParam(12),
        attack: fakeParam(0.003),
        release: fakeParam(0.25),
        reduction: 0,
      }),
    createAnalyser: () => node({ fftSize: 2048 }),
    createBuffer(ch, length, sampleRate) {
      const data = Array.from({ length: ch }, () => new Float32Array(length));
      return {
        numberOfChannels: ch,
        length,
        sampleRate,
        duration: length / sampleRate,
        getChannelData: c => data[c],
      };
    },
    createOscillator: () =>
      source({ kind: 'osc', type: 'sine', frequency: fakeParam(440), detune: fakeParam(0) }),
    createBufferSource: () =>
      source({ kind: 'buffer', buffer: null, loop: false, playbackRate: fakeParam(1) }),
    destination: node(),
  };
  return ctx;
}
