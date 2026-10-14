// Blind comparison: pure helpers (tested in tests/audio-mix.test.js). Ratings live in localStorage, never in the repo.
import { rngFor } from '../../src/audio-mix.js';
export const DIRS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const BLIND_KEY = 'just-throw-it-music-blind';
// Criteria from research/hudba/01 §6 that can be rated by ear (7 cost/licence and 8 CPU are measured).
export const CRITERIA = [
  { id: 'mood', label: 'Ladí s obloukem nálady (čtvrť, 3D komiks)' },
  { id: 'fatigue', label: 'Neunavuje (5 = vůbec)' },
  { id: 'qte', label: 'Neruší QTE (5 = vůbec)' },
  { id: 'districts', label: 'Čtvrti jsou rozlišitelné' },
  { id: 'combo', label: 'Je slyšet kombo i klid' },
  { id: 'keep', label: 'Nechal bys ji zapnutou?' },
];
export function blindMap(seed) {
  const r = rngFor('blind', seed),
    a = [...DIRS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return Object.fromEntries(a.map((d, i) => ['X' + (i + 1), d]));
}
export const emptyStore = (seed = Date.now() % 100000) => ({
  version: 1,
  seed,
  map: blindMap(seed),
  ratings: [],
  fatigue: [],
  qte: {},
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
    )
      return s;
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
