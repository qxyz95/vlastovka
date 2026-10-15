// Nové události ve scéně a jejich QTE (čisté, bez three.js a DOM). Spec research/atlas/05-art-udalosti.md (C2a), rozhodnutí 06 15. 10.
// (ventilace jen u Steam Hop, poryv jen proužky; větší kruh QTE pro všechny události, na mobilu poloměr ≥ 30 CSS px).
// qteRing(e,f) → model kruhu z e.w běžící události (zóny, průběh open→close, pecky, zarážky); ringZoom(r,cssWidth) → zvětšení kruhu.
// Polohy 3D objektů (m, svět) z kotvy uložené při prvním snímku události (companion3d.js): steamHead, columnSpan, thermalScrap, lanternPose,
// starPose, stardust. Výtrysk burstOf(f) (vEff = vx + burstLeft·cruise jako flight.js) a kombo comboOf(f), comboLinks.
import { zones as holdZones, eventProgress } from '../events.js';
import { GAME } from '../core.js';
import { PROGRESSION as P } from '../progression-numbers.js';
import { onTwos } from './life.js';

const clamp01 = v => Math.max(0, Math.min(1, v)),
  smooth = v => {
    const u = clamp01(v);
    return u * u * (3 - 2 * u);
  },
  DEG = Math.PI / 180,
  HIT = new Set(['success', 'perfect']);
export const isHit = g => HIT.has(g);

// ── Kruh QTE (kap. 0.1). Poloměr v logických px × zoom; na šířce cssWidth má kruh aspoň RING_MIN CSS px (360 px: z = 1,57–1,90).
export const RING_MIN = 30,
  RING_WARN_ALPHA = 0.5,
  PULSE = 0.1;
export const ringZoom = (r, cssWidth = 640) =>
  Math.max(1, RING_MIN / ((r > 0 ? r : 30) * ((cssWidth > 0 ? cssWidth : 640) / 640)));
// Nová událost (a poryv) má zóny z e.w: podíl obvodu (x − open) / (close − open), plující střed se nehýbe. Holub zůstává na délce držení (events.zones).
// Pára: dvě zóny, pecky = výsledky obláčků, next = očekávaná pecka, pulse = zóna, jejíž střed právě nastal (±PULSE/2), gap = řez mezi zónami.
// Termika: stopa „half“ (sloup), zarážky na hranách jádra. Lampion: zarážka kontaktu ve 12 h. Hvězda: jen perfekt (only). Dvojice (termika,
// lampion úr. 3): dvě pecky, první = výsledek prvního kusu.
export function qteRing(e, f) {
  if (!e) return null;
  const q = { type: e.type, phase: e.phase, result: e.result ?? null, held: e.heldAt != null },
    w = e.w;
  if (e.type === 'bird' || !w || !(w.close - w.open > 0))
    return { ...q, progress: f ? eventProgress(f, e) : 0, zones: [holdZones(e)] };
  const len = w.close - w.open,
    fr = x => (x - w.open) / len,
    cut = (m, h) => [clamp01(m - h / len), clamp01(m + h / len)],
    cs = Array.isArray(w.c) ? w.c : [w.c],
    t = f?.t ?? w.open;
  q.progress = clamp01((t - w.open) / len);
  q.zones = cs.map(c => ({
    success: cut(fr(c), w.s),
    perfect: w.p > 0 ? cut(fr(c), w.p) : null,
  }));
  if (e.type === 'star') q.only = 'perfect';
  if (e.type === 'thermal') {
    q.track = 'half';
    q.stops = [...q.zones[0].success];
  }
  if (e.type === 'drone') q.contact = true;
  if (e.type === 'steam') {
    q.pegs = [0, 1].map(i => e.puffs?.[i] ?? null);
    q.next = e.result ? -1 : (e.puff ?? 0);
    q.pulse = e.phase === 'interaction' ? cs.findIndex(c => Math.abs(t - c) <= PULSE / 2) : -1;
    q.gap = (fr(cs[0]) + fr(cs[1])) / 2;
  }
  if ((e.type === 'thermal' || e.type === 'drone') && f?.events) {
    const i = f.events.indexOf(e),
      prev = f.events[i - 1],
      next = f.events[i + 1];
    if (e.follow && prev?.type === e.type) {
      q.pegs = [prev.result, e.result];
      q.next = e.result ? -1 : 1;
    } else if (next?.follow && next.type === e.type) {
      q.pegs = [e.result, null];
      q.next = e.result ? 1 : 0;
    }
  }
  return q;
}

// ── Data události pro 3D (plan.evs): jen typy s objektem ve scéně. Poryv nemá 3D (rozhodnutí 06: jen proužky), holub má life.companion.
export const SCENE_EVENTS = Object.freeze(['steam', 'thermal', 'drone', 'star']);
export function eventScene(e) {
  if (!e?.w || !SCENE_EVENTS.includes(e.type)) return null;
  const w = e.w;
  return {
    type: e.type,
    key: `${e.type}:${e.i}:${e.at}`,
    phase: e.phase,
    result: e.result ?? null,
    resolvedAt: e.resolvedAt ?? null,
    follow: !!e.follow,
    w: { open: w.open, close: w.close, c: w.c, s: w.s, p: w.p, col: w.col ?? 0 },
    puffs: e.puffs ? [...e.puffs] : null,
  };
}
// Místo, kde bude vlaštovka v čase target (kotva při prvním snímku události, pak stojí): X + vx · (target − t).
export const anchorX = (X, vx, target, t) => X + vx * Math.max(0, target - t);

// ── Pára (kap. 1.1): výtrysk vystřelí lead s před svým středem, hlava je v c[i] přesně 1 m pod vlaštovkou (top = Y), po středu stoupá
// dál `after` s a zmenší se k 0; zásah = obláčky × bloom a pruh se utrhne; minutí = hlava stojí 4 m pod vlaštovkou a splaskne za collapse s.
// Reduced motion: od začátku interakce stojí v plné výšce, zásah = × bloom, minutí = zmizí. null = výtrysk není vidět.
export const STEAM_FX = Object.freeze({
  lead: 0.5,
  after: 0.3,
  below: 1,
  miss: 4,
  collapse: 0.25,
  grate: 1.62,
  bloom: 1.3,
  rise: 3,
  puffs: Object.freeze([0.8, 1.1, 1.3]),
  jet: Object.freeze([1.2, 0.6]),
  z: -1.2,
});
export function steamHead(w, i, t, top, grade = null, reduced = false) {
  const F = STEAM_FX,
    c = w.c[i],
    base = F.grate,
    peak = Math.max(base + 1, top - F.below),
    low = Math.max(base, top - F.miss),
    hit = isHit(grade);
  if (reduced) {
    if (t < w.open || grade === 'miss') return null;
    return { y: peak, size: hit ? F.bloom : 1, from: base };
  }
  if (t < c - F.lead) return null;
  if (t <= c) {
    const y = base + (peak - base) * ((t - (c - F.lead)) / F.lead);
    return { y: grade === 'miss' ? Math.min(y, low) : y, size: 1, from: base };
  }
  if (grade === 'miss') {
    const k = (t - c) / F.collapse;
    return k >= 1 ? null : { y: Math.min(peak, low), size: 1 - k, from: base };
  }
  const a = (t - c) / F.after;
  if (a >= 1) return null;
  return {
    y: peak + a * F.rise,
    size: (1 - smooth(a)) * (hit ? F.bloom : 1),
    from: hit ? base + (peak - base) * a : base,
  };
}
// Mřížka „dýchá“: 0,35 → 1 podle blízkosti nejbližšího středu (0,6 s).
export const grateAlpha = (w, t) =>
  0.35 + 0.65 * Math.max(0, ...w.c.map(c => clamp01(1 - Math.abs(t - c) / 0.6)));

// ── Termika (kap. 2.1): sloup = časové okno v prostoru (šířka 2·col·vx, jádro 2·s·vx při varování), stužky po okrajích do Y + above,
// tělo průsvitné, 10 útržků jen v šířce jádra stoupá rise m/s ve smyčce loop s (v pásu kolem výšky letu, aby byly v záběru).
export const THERMAL_FX = Object.freeze({
  above: 25,
  ribbon: 0.5,
  segs: 12,
  amp: 0.8,
  period: 14,
  scraps: 10,
  rise: 6,
  loop: 4,
  below: 18,
  scrap: Object.freeze([0.8, 0.5]),
  orbit: 4,
  orbitT: 0.6,
  fade: 0.5,
  stretch: 1.2,
  z: -3,
});
export const columnSpan = (w, vx) => ({ width: 2 * (w.col ?? 0) * vx, core: 2 * w.s * vx });
// Vodorovné vlnění stužky k (0 levá, 1 pravá) ve výšce y; čas on twos, reduced = rovná.
export const ribbonWave = (k, y, t, reduced = false) =>
  reduced
    ? 0
    : THERMAL_FX.amp * Math.sin((y / THERMAL_FX.period) * Math.PI * 2 + 0.9 * t * 6 + k * 2.1);
const frac = v => v - Math.floor(v),
  h1 = i => frac(Math.sin(i * 127.1 + 31.7) * 43758.5453);
// Útržek i: o = {x (střed sloupu), core (šířka jádra m), X, Y (vlaštovka), grade, age (s od vyhodnocení), reduced} → {x, y, rot, s}.
export function thermalScrap(i, t, o) {
  const F = THERMAL_FX,
    n = F.scraps,
    span = F.rise * F.loop,
    y0 = Math.max(0, o.Y - F.below),
    x = o.x + (h1(i) - 0.5) * o.core * 0.8,
    hit = isHit(o.grade),
    age = o.age ?? Infinity;
  if (o.reduced) {
    const y = y0 + ((i + 0.5) / n) * span + (hit ? 2 : 0);
    return o.grade === 'miss' ? null : { x, y, rot: h1(i + 7) * Math.PI, s: 1 };
  }
  const k = hit && age < 1.5 ? 2 : o.grade === 'half' && age < 0.4 ? 1.5 : 1,
    T = onTwos(t),
    y = y0 + frac((T * F.rise * k) / span + i / n) * span,
    rot = h1(i + 7) * Math.PI + T * Math.PI * k;
  if (o.grade === 'miss') return age >= F.fade ? null : { x, y, rot, s: 1 - age / F.fade };
  if (hit && i < 6 && age < F.orbitT + 0.6) {
    const a = (i / 6) * Math.PI * 2 + (age / F.orbitT) * Math.PI * 2,
      up = Math.max(0, age - F.orbitT) * 25;
    return { x: o.X + Math.cos(a) * F.orbit, y: o.Y + Math.sin(a) * F.orbit + up, rot, s: 1 };
  }
  return { x, y, rot, s: 1 };
}
// Výška stužek a alfa těla: zásah natáhne nahoru o 20 %, minutí za fade s ztratí výšku shora a tělo zprůhlední.
export function columnLook(Y, grade, age, reduced = false) {
  const F = THERMAL_FX,
    top = Y + F.above;
  if (grade === 'miss') {
    const k = reduced ? 1 : clamp01((age ?? 0) / F.fade);
    return { top: top * (1 - k), body: 1 - k };
  }
  return {
    top: isHit(grade)
      ? top * (reduced ? F.stretch : 1 + (F.stretch - 1) * smooth((age ?? 0) / 0.3))
      : top,
    body: 1,
  };
}

// ── Sky Lantern (kap. 3.1): lampion se stáčí do dráhy. Základ = bod, kde bude vlaštovka v close podle současné rychlosti (X + vx·Δ, Y + vy·Δ),
// takže se odhad plynule zpřesňuje a kontakt nosu s pláštěm nastane přesně v close (střed lampionu ahead m před a lift m nad vlaštovkou);
// po kontaktu nebo vyhodnocení základ stojí (drží ho companion3d). Pevná kotva z varování by při stoupání a zpomalení minula o 7–8 m. Zásah = odraz (náklon 25°, +2 m, −3 m po x za 0,4 s,
// tlumené houpání), perfekt navíc otočka kolem svislé osy 0,5 s; minutí = zhoupne se o 10° a odplouvá nahoru 1 m/s, za 1 s zmizí.
export const LANTERN_FX = Object.freeze({
  ahead: 5.5,
  lift: 1.7,
  z: 0.8,
  sway: 4 * DEG,
  swayHz: 1.2,
  bob: 0.3,
  bobHz: 0.5,
  tilt: 25 * DEG,
  up: 2,
  back: -3,
  hitT: 0.4,
  spinT: 0.5,
  missTilt: 10 * DEG,
  missRise: 1,
  missT: 1,
  pairScale: 0.9,
  pairYaw: 0.6,
  lodPx: 20,
});
export function lanternBase(X, Y, vx, vy, close, t) {
  const d = Math.max(0, close - t);
  return { x: X + vx * d + LANTERN_FX.ahead, y: Y + vy * d + LANTERN_FX.lift };
}
export function lanternPose(base, ev, t, reduced = false) {
  const L = LANTERN_FX,
    T = reduced ? 0 : onTwos(t),
    pose = {
      x: base.x,
      y: base.y,
      z: L.z,
      roll: reduced ? 0 : L.sway * Math.sin(T * Math.PI * 2 * L.swayHz),
      yaw: ev.follow ? L.pairYaw : 0,
      scale: ev.follow ? L.pairScale : 1,
      alpha: 1,
    };
  if (!reduced) pose.y += L.bob * Math.sin(T * Math.PI * 2 * L.bobHz);
  const g = ev.result,
    age = ev.resolvedAt != null ? t - ev.resolvedAt : 0;
  if (!g) return pose;
  if (isHit(g)) {
    const u = reduced ? 1 : smooth(age / L.hitT),
      d = Math.max(0, age - L.hitT);
    pose.roll =
      -L.tilt * u + (reduced ? 0 : 8 * DEG * Math.sin(d * Math.PI * 4) * Math.exp(-3 * d));
    if (!reduced) {
      pose.x += L.back * u;
      pose.y += L.up * u;
      if (g === 'perfect') pose.yaw += Math.PI * 2 * smooth(age / L.spinT);
    }
    return pose;
  }
  if (reduced) return null;
  if (age >= L.missT) return null;
  pose.roll = L.missTilt * Math.sin(Math.min(age, 0.5) * Math.PI * 2);
  pose.y += L.missRise * age;
  pose.alpha = 1 - age / L.missT;
  return pose;
}
// LOD 1, když je lampion (4,4 m) na obrazovce menší než lodPx CSS px; zpět na LOD 0 až nad 1,2 × lodPx (hystereze).
export function lanternLod(pxPerM, prev = 0) {
  const px = pxPerM * 4.4;
  return prev ? (px > LANTERN_FX.lodPx * 1.2 ? 0 : 1) : px < LANTERN_FX.lodPx ? 1 : 0;
}

// ── Padající hvězda (kap. 4.1): přímka zprava shora 30° pod vodorovnou, 60 m/s vůči vlaštovce, protne bod 2 m nad trupem přesně v w.c.
// Zásah = rozpad (hvězda zmizí, hvězdičky výtrysku), minutí = letí dál a za fade s zmizí. Reduced motion: stojí v bodě setkání, nerotuje.
export const STAR_FX = Object.freeze({
  speed: 60,
  angle: 30 * DEG,
  above: 2,
  spin: 1,
  fade: 0.6,
  r: 1.6,
  inner: 0.4,
  depth: 0.15,
  tail: Object.freeze([9, 7, 5]),
  tailW: 0.6,
  segs: 6,
  dust: 6,
  dustR: 0.4,
  z: 0.5,
});
export function starPose(w, t, X, Y, grade = null, resolvedAt = null, reduced = false) {
  const S = STAR_FX;
  if (grade && grade !== 'miss') return null;
  if (reduced) return grade ? null : { x: X, y: Y + S.above, spin: 0, alpha: 1 };
  const d = S.speed * (w.c - t),
    pose = {
      x: X + Math.cos(S.angle) * d,
      y: Y + S.above + Math.sin(S.angle) * d,
      spin: -Math.PI * 2 * S.spin * onTwos(t),
      alpha: 1,
    };
  if (grade === 'miss') {
    const k = (t - Math.max(w.c, resolvedAt ?? w.c)) / S.fade;
    if (k >= 1) return null;
    pose.alpha = 1 - clamp01(k);
  }
  return pose;
}
// Hvězdičky výtrysku za vlaštovkou: k = burstLeft / amp (mizí lineárně jako výtrysk), reduced = bez pohybu.
export function stardust(i, age, k, X, Y, reduced = false) {
  if (!(k > 0)) return null;
  const wob = reduced ? 0 : Math.sin(i * 2.1 + onTwos(age) * 3) * 0.8;
  return {
    x: X - 5 - i * 2.4 - (reduced ? 0 : (onTwos(age) * 1.5) % 2),
    y: Y + Math.sin(i * 1.7) * 1.4 + wob,
    s: k,
    spin: reduced ? 0 : onTwos(age) * (i % 2 ? 2 : -2),
  };
}

// ── Výtrysk (kap. 5): f.burst zvyšuje f.x, ne f.vx; rychlostní čáry a tah dostanou vEff = vx + burstLeft · cruise.
export const burstLeftOf = f => (f?.burst && !f.landed ? GAME.burstLeft(f) : 0);
export const effectiveVx = f => (f ? f.vx + burstLeftOf(f) * (f.cruise ?? 0) : 0);
export function burstOf(f) {
  const left = burstLeftOf(f);
  if (!(left > 0)) return null;
  return {
    left,
    amp: f.burst.amp,
    k: clamp01(left / (f.burst.amp || 1)),
    tag: f.burst.tag,
    age: f.t - f.burst.t0,
  };
}
// Tah tužkou za ocasem (UI vrstva): 3 čárky délky 8 + 40·k log. px po 6 px, pára navíc obláček každých 0,25 s.
export const BURST_UI = Object.freeze({ n: 3, base: 8, grow: 40, gap: 6, puff: 0.25, puffR: 3 });
export const burstDash = k => BURST_UI.base + BURST_UI.grow * clamp01(k);

// ── Kombo (kap. 6): řetěz s comboSpec.max očky (Crowd Chain úr. 0–3: 3 / 4 / 5 / 5), vyplněná = min(combo, max), číslo ×N vždy.
// Vidět za letu, když combo ≥ 1 nebo hráč vlastní Crowd Chain (a 0,4 s po přetržení kvůli rozpadu). Chimes: zvoneček při combo ≥ onAir.combo.
export const COMBO_UI = Object.freeze({
  rx: 5,
  ry: 3.5,
  step: 7,
  width: 2.5,
  empty: 1.5,
  snap: 0.15,
  pop: 1.3,
  fall: 0.4,
  bell: Object.freeze([9, 10]),
  swing: 15 * DEG,
  hz: 2,
  cycles: 2,
  font: 11,
  at: Object.freeze({ x: 628, y: 40 }),
});
export function comboOf(f) {
  if (!f || f.landed || !f.comboSpec) return null;
  const owned = (f.kit?.atlas?.chain ?? 0) > 0,
    last = f.lastEv ?? null,
    age = last?.resolvedAt != null ? f.t - last.resolvedAt : Infinity,
    before = last?.comboBefore ?? 0,
    broke = last && f.combo === 0 && before > 0 && age < COMBO_UI.fall ? before : 0,
    need = P.atlas.onAir.combo,
    chimes = (f.onAirB ?? 0) > 0 && f.combo >= need;
  if (f.combo < 1 && !owned && !broke) return null;
  return {
    n: f.combo,
    max: f.comboSpec.max,
    owned,
    age,
    before,
    broke,
    chimes,
    ring: chimes && before < need ? age : Infinity,
  };
}
// ── Schopnosti z kapes (C3) v UI vrstvě, 0 draw calls. Výšky z flight.js (specials) převedené na logické px přes view
// (ground = výška 0, k · ppm px na metr v hloubce vlaštovky). Rocket a nízký průlet Dive kreslí tah výtrysku (burstOf, tag rocket / lowPass).
// Dive: pás nízkého průletu nad zemí (specials.dive.low), in = vlaštovka v pásu (puštění dá výtrysk). Cushion: pásma výšky pod
// vlaštovkou, dokud je polštář k dispozici a vlaštovka je pod maxY + 1 m (perfekt / střed / vysoko); po klepnutí polštář pod vlaštovkou
// (k = zbývající podíl hoverT / glideT, doznívá).
export const ABILITY_UI = Object.freeze({ guideW: 36, pillowW: 22, pillowH: 5, bandAlpha: 0.18 });
export function abilityFx(f, view, ppm) {
  if (!f || f.landed || !view || !(view.k > 0)) return null;
  const S = P.specials,
    m = view.k * ppm,
    at = h => view.ground - h * m;
  if (f.dive) {
    const [lo, hi] = S.dive.low;
    return { kind: 'lowPass', top: at(hi), bottom: at(lo), in: f.y >= lo && f.y <= hi };
  }
  const C = S.cushion;
  if (f.hoverT > 0 || f.glideT > 0)
    return {
      kind: 'pillow',
      y: Math.min(view.ground, view.py + 6),
      k: clamp01(f.hoverT > 0 ? f.hoverT / C.perfectT : f.glideT / C.glideT),
    };
  if (f.d?.active === 'cushion' && !f.abil.cushion && f.y <= C.maxY + 1)
    return {
      kind: 'cushion',
      bands: [
        [at(C.perfectY), at(0), 'perfect'],
        [at(C.midY), at(C.perfectY), 'success'],
        [at(C.maxY), at(C.midY), 'track'],
      ],
    };
  return null;
}
// Očka řetězu: pravý konec v x (logické px), střed y; i = 0 vlevo. s = zvětšení UI (uiScale).
export function comboLinks(max, n, x, y, s = 1) {
  const C = COMBO_UI;
  return Array.from({ length: max }, (_, i) => ({
    x: x - C.rx * s - (max - 1 - i) * C.step * s,
    y,
    filled: i < Math.min(n, max),
  }));
}
