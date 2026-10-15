// Blind comparison (research/hudba/03 F.6): pure helpers (tested in tests/audio-mix.test.js). Ratings live in
// localStorage, never in the repo.
import { rngFor, ARC } from '../../src/audio-mix.js';
import { deg } from '../../src/music/compose.js';
export const DIRS = ['B', 'E', 'G'];
export const BLIND_KEY = 'just-throw-it-music-blind';
// Candidates are levelled to the same integrated loudness, otherwise the louder one wins (03 F.4).
export const TARGET_LUFS = -22;
// Criteria rated by ear: block 1 of 03 F.6 (mood, keep, qte) plus the older ones from 01 §6.
export const CRITERIA = [
  { id: 'mood', label: 'Ladí k rannímu papírovému městu' },
  { id: 'keep', label: 'Nechal bys ji zapnutou?' },
  { id: 'qte', label: 'Neruší tě při QTE (5 = vůbec)' },
  { id: 'fatigue', label: 'Neunavuje (5 = vůbec)' },
  { id: 'districts', label: 'Čtvrti jsou rozlišitelné' },
  { id: 'combo', label: 'Je slyšet kombo i klid' },
];
const shuffle = (a, r) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export function blindMap(seed) {
  const a = shuffle([...DIRS], rngFor('blind', seed));
  return Object.fromEntries(a.map((d, i) => ['X' + (i + 1), d]));
}
// Trim in dB of a candidate in a district (0 before levelling).
export const trimFor = (store, id, d) => store?.trims?.[id + d] ?? 0;
// Block 2: the four districts of Diorama in a seeded order.
export const quizOrder = seed => shuffle([0, 1, 2, 3], rngFor('quiz', seed));
// Block 4: the theme in Golden Fields (mixolydian), the same theme backwards and a foreign motif of the same length and
// rhythm, all on the music box, in a seeded order. Notes {b beats, d beats, n MIDI}.
export const FOREIGN = [2, 1, 3, 0, 4, 2];
export function motifQuiz(seed) {
  const a = ARC[2],
    line = (degrees, rhythm) => {
      let pos = 0;
      return degrees.map((x, k) => {
        const n = { b: pos / 2, d: (rhythm[k] / 2) * 0.92, n: deg(a.mode, x, 5) };
        pos += rhythm[k];
        return n;
      });
    },
    items = [
      { kind: 'theme', notes: line(a.motif, a.rhythm) },
      { kind: 'retro', notes: line([...a.motif].reverse(), [...a.rhythm].reverse()) },
      { kind: 'foreign', notes: line(FOREIGN, a.rhythm) },
    ];
  return { items: shuffle(items, rngFor('motif', seed)) };
}
export const emptyStore = (seed = Date.now() % 100000) => ({
  version: 1,
  seed,
  map: blindMap(seed),
  ratings: [],
  fatigue: [],
  qte: {},
  trims: {},
  quiz: [],
  motif: [],
});
export function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(BLIND_KEY) ?? 'null');
    if (
      s &&
      s.version === 1 &&
      s.map &&
      Array.isArray(s.ratings) &&
      Array.isArray(s.fatigue) &&
      s.qte
    ) {
      // Sessions from the two-candidate prototype get a new three-way shuffle; their ratings stay.
      if (Object.keys(s.map).length !== DIRS.length) s.map = blindMap(s.seed);
      return s;
    }
  } catch {}
  return emptyStore();
}
export function saveStore(s) {
  try {
    localStorage.setItem(BLIND_KEY, JSON.stringify(s));
  } catch {}
}
// Per direction: average of each criterion, fatigue by minute, QTE perfect rate of the player's own inputs.
export function summary(store) {
  const out = {};
  const get = d =>
    (out[d] ??= { n: 0, scores: {}, fatigue: {}, perfectRate: null, hitRate: null, _s: {} });
  for (const r of store.ratings) {
    const o = get(r.dir);
    o.n++;
    for (const [k, v] of Object.entries(r.scores ?? {})) (o._s[k] ??= []).push(v);
  }
  for (const f of store.fatigue) get(f.dir).fatigue[f.minute] = f.score;
  for (const [d, q] of Object.entries(store.qte ?? {}))
    if (q.n) {
      const o = get(d);
      o.perfectRate = q.perfect / q.n;
      o.hitRate = q.hit / q.n;
      o.qteN = q.n;
    }
  for (const o of Object.values(out)) {
    for (const [k, a] of Object.entries(o._s))
      o.scores[k] = a.reduce((s, x) => s + x, 0) / a.length;
    delete o._s;
  }
  return out;
}
