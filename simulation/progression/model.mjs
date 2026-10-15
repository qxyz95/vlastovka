// Simulátor letu: mechanika (model letu 1.0 podle 08 §2.3) je v src/flight.js, společná pro hru i simulátor (dávka A1).
// Tady jsou jen boti: plán stisků při začátku události, QTE bot (playerEvents), skutečný čas (realTime) a celý hod s nimi.
// Boti schopností jsou v abilities.mjs.
import { hash, stream, gauss, clip, lv, createFlightModel } from '../../src/flight.js';
import { P } from './params.mjs';

// plán hráče pro událost: vlastní stream (stejný šum při přehrání s jinou výbavou)
function planEvent(f, e) {
  const r = stream(f.key, 'plan', f.n, e.i),
    sk = f.sk,
    ns = f.assist?.noise ?? 1,
    sd = sk.qte * ns,
    b = f.bias,
    n1 = gauss(r),
    n2 = gauss(r),
    fl = 1 + P.events.floating.readNoise * f.ramp,
    w = e.w;
  e.plan = {
    k: 0,
    press:
      e.type === 'bird'
        ? [w.open + Math.max(-0.5, sk.react * ns + sd * 1.2 * n2)]
        : e.type === 'steam'
          ? [w.c[0] + b + sd * n1, w.c[1] + b + sd * n2]
          : [w.c + b + sd * (e.type === 'gust' ? fl : 1) * n1],
    hold: e.type === 'bird' ? w.c + b + sd * fl * n1 : 0,
  };
  // výpadek pozornosti (F3): s pravděpodobností lapse hráč na událost nezareaguje vůbec (los až za šumem, CRN drží)
  if (r() < (sk.lapse ?? 0)) e.plan.press = [];
}
const M = createFlightModel(P, { onEventStart: planEvent });
export const {
  pace,
  derive,
  createEvents,
  setBurst,
  createFlight,
  activeEvent,
  effect,
  press,
  release,
  updateEvents,
  canAct,
  startDive,
  pullUp,
  cushion,
  whistle,
  rocket,
  burstLeft,
  step,
  bestAngle,
} = M;
const { resolve } = M;
export { hash, stream, gauss, clip, lv };

// QTE bot: stiskne podle plánu, stisk ve varování hra ignoruje → zkusí znovu za retry. Auto (DQ-14) dá úspěch ve středu.
export function playerEvents(f) {
  const e = activeEvent(f);
  if (!e || e.result || e.phase === 'effect') return;
  const pl = e.plan,
    t = f.t;
  if (f.auto) {
    if (e.phase !== 'interaction') return;
    if (e.type === 'bird') {
      if (e.heldAt === null) press(f);
      else if (t >= e.heldAt + e.w.c) resolve(f, e, 'success');
      return;
    }
    const c = e.type === 'steam' ? e.w.c[1] : e.w.c;
    if (t >= c) e.type === 'star' ? resolve(f, e, 'perfect') : resolve(f, e, 'success');
    return;
  }
  if (e.type === 'bird' && e.heldAt !== null) {
    if (t >= e.heldAt + pl.hold) release(f);
    return;
  }
  if (pl.k < pl.press.length && t >= pl.press[pl.k]) {
    if (press(f) === null && !e.result && e.phase !== 'interaction')
      pl.press[pl.k] += P.events.retry;
    else pl.k++;
  }
}

// Skutečný čas: klidné klouzání (žádná událost, další nezačne do 1 s, vlaštovka klesá) běží warp×, náběh ramp s.
function realTime(f) {
  const W = P.warp,
    dt = P.physics.dt,
    e = activeEvent(f),
    next = f.events.find(x => x.phase === 'waiting');
  const calm = !e && !f.dive && f.vy < 0 && (!next || next.at > f.t + W.lookahead),
    target = calm ? W.factor : 1,
    rate = ((W.factor - 1) / W.ramp) * dt;
  f.warp = target > f.warp ? Math.min(target, f.warp + rate) : Math.max(target, f.warp - rate);
  const slow =
    f.assist?.slow && e && (e.phase === 'warning' || e.phase === 'interaction') ? f.assist.slow : 1;
  f.real += dt / f.warp / slow;
}
// Celý hod. bots = funkce (f)=>void volané každý krok před fyzikou (schopnosti).
export const fly = (kit, ctx, bots = []) => M.fly(kit, ctx, [playerEvents, ...bots], [realTime]);
