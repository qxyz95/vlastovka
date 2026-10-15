// Pohled hry na události letu. Rozvrh, okna a účinky jsou v src/flight.js (M2); tady jsou jen časy pro vzhled a čtení stavu.
// Timing in seconds. Gust: tap relative to event start (warning .8 s, then 1.2 s bar). Bird: hold length.
// The half-widths of a running event are in e.w (flight.js windowsOf: folds, Sharp Edge, floating centre).
export const TIMING = {
  warning: 0.8,
  bar: 1.2,
  gustCenter: 1.4,
  gustSuccess: 0.28,
  gustPerfect: 0.1,
  birdCenter: 0.75,
  birdSuccess: 0.25,
  birdPerfect: 0.1,
  maxEvents: 10,
};
const ACTIVE = ['warning', 'interaction', 'effect'],
  HIT = ['success', 'perfect', 'partial', 'half'];
export function activeEvent(f) {
  return f && !f.landed ? (f.events.find(e => ACTIVE.includes(e.phase)) ?? null) : null;
}
// Výchozí okna bez plujícího středu (tvar pro audio-mix.qteCenter): poloviční šířky × f.d.windowK (Folds, Sharp Edge).
// Přesná okna běžící události jsou v e.w.
export function windows(f) {
  const k = f?.d?.windowK ?? 1;
  return {
    gust: {
      center: TIMING.gustCenter,
      success: TIMING.gustSuccess * k,
      perfect: TIMING.gustPerfect * k,
    },
    bird: {
      center: TIMING.birdCenter,
      success: TIMING.birdSuccess * k,
      perfect: TIMING.birdPerfect * k,
    },
  };
}
// Bar position of a running event's success/perfect windows, as fractions of the bar (gust: from the end of the warning, bird: hold length).
export function zones(e) {
  const w = e?.w;
  if (!w) return { success: [0, 0], perfect: [0, 0] };
  const len =
      Number.isFinite(w.close - w.open) && e.type !== 'bird' ? w.close - w.open : TIMING.bar,
    c = (e.type === 'bird' ? w.c : (Array.isArray(w.c) ? w.c[e.puff ?? 0] : w.c) - w.open) / len,
    s = w.s / len,
    p = w.p / len;
  return { success: [c - s, c + s], perfect: [c - p, c + p] };
}
export function eventProgress(f, e) {
  const w = e.w,
    v =
      e.type === 'bird'
        ? e.heldAt === null
          ? 0
          : (f.t - e.heldAt) / TIMING.bar
        : w
          ? (f.t - w.open) / (w.close - w.open)
          : (f.t - e.at - TIMING.warning) / TIMING.bar;
  return Math.max(0, Math.min(1, v));
}
export function eventStats(f) {
  const done = f.events.filter(e => e.result === 'miss' || HIT.includes(e.result));
  return {
    completed: done.length,
    hits: done.filter(e => e.result !== 'miss').length,
    perfect: done.filter(e => e.result === 'perfect').length,
  };
}
