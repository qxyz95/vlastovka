// Časové osy letů jako surový materiál pro hudbu (research/hudba/02-casova-osa.md). Jen čte a měří, nic nezapisuje do repa.
// Výstup (Markdown) jde na stdout. Použití: node simulation/hudba/timeline.mjs   (~20 s, deterministické)
// Stádium kampaně = kit hráče z kampaní simulátoru (stejné kampaně jako mc-plna: seed 1, id 0..K-1, profil average) v dané minutě;
// let = stejná mechanika jako ve hře (src/flight.js přes boty simulátoru), pevný krok DT=1/60, seedované streamy.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { P } from '../progression/params.mjs';
import { campaign, equip } from '../progression/campaign.mjs';
import { fly, bestAngle, stream, gauss } from '../progression/model.mjs';
import { botsFor } from '../progression/abilities.mjs';

const K = 10, // kampaní na strategii
  STRATEGIES = ['balanced', 'paper-first'],
  PROFILE = 'average',
  STAGES = [
    { id: 'rané', minute: 10 },
    { id: 'střední', minute: 45 },
    { id: 'pozdní', minute: 80 },
  ],
  TABLE_FLIGHTS = 6, // letů v tabulce událostí na stádium
  SAMPLE = 200; // letů na stádium pro souhrny
const D = P.route.place * P.route.perDistrict,
  r1 = v => (v == null || !Number.isFinite(v) ? '–' : v.toFixed(1)),
  r2 = v => (v == null || !Number.isFinite(v) ? '–' : v.toFixed(2)),
  q = (arr, p) => {
    if (!arr.length) return NaN;
    const s = [...arr].sort((a, b) => a - b),
      i = (s.length - 1) * p,
      lo = Math.floor(i);
    return s[lo] + (s[Math.min(s.length - 1, lo + 1)] - s[lo]) * (i - lo);
  },
  lowMedian = arr => [...arr].sort((a, b) => a - b)[(arr.length - 1) >> 1];
const out = [];
const log = (...a) => out.push(a.join(' '));

// --- kit hráče v dané minutě z kampaně ---
const startsOf = R => {
  const s = [];
  let cum = 0,
    dd = 0;
  for (const [d, real] of R.flights) {
    if (d > dd) {
      cum += P.time.districtCard * (d - dd);
      dd = d;
    }
    s.push(cum);
    cum += real + P.time.ui;
  }
  return { starts: s, total: cum };
};
function kitAt(R, minute) {
  const { starts, total } = startsOf(R);
  let n = 1;
  for (let i = 0; i < starts.length; i++) if (starts[i] <= minute * 60) n = i + 1;
  const finishedBefore = total <= minute * 60;
  if (finishedBefore) n = R.throws;
  const bs = R.buys.filter(b => b.throw <= n - 1),
    best = Math.max(0, ...R.flights.slice(0, n - 1).map(f => f[3])),
    cnt = id => bs.filter(b => b.id === id).length,
    atlas = {},
    places = Math.min(P.route.places, Math.floor(best / P.route.place) + 1);
  for (let k = 1; k <= places; k++) {
    const b = P.atlas.bonuses[k - 1];
    if (!P.atlas.unlevelled.includes(b)) atlas[b] = 1 + cnt('atlas:' + b);
  }
  return {
    n,
    finishedBefore,
    best,
    district: Math.min(3, Math.floor(best / D)),
    power: cnt('power'),
    folds: cnt('folds'),
    paper: cnt('paper'),
    pockets: cnt('pocket1') + cnt('pocket2'),
    atlas,
    glider: best >= P.atlas.gliderAt,
  };
}
function stageKit(runs, minute) {
  const ks = runs.map(R => kitAt(R, minute)),
    med = f => lowMedian(ks.map(f)),
    bonuses = [...new Set(ks.flatMap(k => Object.keys(k.atlas)))],
    atlas = {};
  for (const b of bonuses) {
    const v = lowMedian(ks.map(k => k.atlas[b] ?? 0));
    if (v) atlas[b] = v;
  }
  const district = med(k => k.district),
    pockets = med(k => k.pockets),
    base = {
      power: med(k => k.power),
      folds: med(k => k.folds),
      paper: med(k => k.paper),
      atlas,
      slots: equip(pockets, district, P.bots.pocketAuto[PROFILE] ?? [], []),
    };
  return {
    kit: base,
    n: med(k => k.n),
    nRange: [Math.min(...ks.map(k => k.n)), Math.max(...ks.map(k => k.n))],
    district,
    pockets,
    glider: ks.filter(k => k.glider).length / ks.length > 0.5,
    finished: ks.filter(k => k.finishedBefore).length,
    count: ks.length,
  };
}

// --- let se záznamem ---
const KEY = 'hudba|' + PROFILE;
const bias = (P.profiles[PROFILE].qte / 2) * gauss(stream(KEY, 'bias'));
function recordFlight(kit, n) {
  const model = kit.model,
    k1 = { ...kit },
    angle = bestAngle(k1, Math.round(P.profiles[PROFILE].mu * 20) / 20),
    ctx = { key: KEY, n, profile: PROFILE, bias, angle },
    rec = { acts: [], dive: [], cross: [], marks: [] };
  let dv = false,
    cu = false,
    wh = 0,
    ro = 0,
    lastK = 0,
    tick = 0;
  const recorder = f => {
    const t = f.t;
    for (const e of f.events) {
      if (e.phase !== 'waiting' && e._w == null) e._w = t;
      if (e.type === 'steam' && e.puff > (e._pc ?? 0)) {
        (e._pt ??= []).push(t);
        e._pc = e.puff;
      }
    }
    if (f.dive && !dv) rec.acts.push({ t, what: 'dive↓' });
    if (!f.dive && dv) rec.acts.push({ t, what: 'dive↑' });
    dv = !!f.dive;
    if (f.abil.cushion && !cu) rec.acts.push({ t, what: 'cushion' });
    cu = !!f.abil.cushion;
    if ((f.abil.whistle ?? 0) > wh) rec.acts.push({ t, what: 'whistle' });
    wh = f.abil.whistle ?? 0;
    for (; ro < (f.abil.rocket ?? 0); ro++) rec.acts.push({ t, what: 'rocket' });
    const kk = Math.floor(f.x / D);
    for (; lastK < kk; ) rec.cross.push({ k: ++lastK, t });
    if (tick++ % 6 === 0) rec.marks.push([t, f.real]);
  };
  const f = fly({ ...kit, model }, ctx, [...botsFor({ ...kit, model }), recorder]);
  const kk = Math.floor(f.x / D);
  for (; lastK < kk; ) rec.cross.push({ k: ++lastK, t: f.t }); // hranice přejitá v posledním kroku
  rec.marks.push([f.t, f.real]);
  const T = f.t,
    evs = f.events
      .filter(e => e._w != null)
      .map(e => {
        const w = e.w,
          interrupted = e.result === 'interrupted' || !e.result,
          taps = interrupted
            ? []
            : e.type === 'bird'
              ? [e.heldAt, e.resolvedAt].filter(v => v != null)
              : e.type === 'steam'
                ? (e._pt ?? [])
                : e.result === 'miss' && e.resolvedAt > w.close + 1 / 60 + 1e-6
                  ? []
                  : [e.resolvedAt];
        return {
          type: e.type + (e.whistled ? '*' : ''),
          warn: e._w,
          open: w.open,
          close: e.type === 'bird' && e.heldAt != null ? e.heldAt + P.events.timing.bar : w.close,
          ctr: Array.isArray(w.c)
            ? w.c
            : e.type === 'bird'
              ? e.heldAt != null
                ? [e.heldAt + w.c]
                : []
              : [w.c],
          taps,
          result: interrupted ? 'přerušeno' : e.result,
          end: Math.min(T, e.doneAt ?? T),
          resolved: e.resolvedAt,
        };
      });
  return { f, n, model, evs, rec, T, real: f.real, x: f.x, angle };
}

// --- metriky letu ---
function metrics(F) {
  const { evs, rec, T } = F,
    span = evs.reduce((a, e) => a + Math.max(0, e.end - e.warn), 0),
    win = evs.reduce((a, e) => a + Math.max(0, Math.min(e.close, T) - e.open), 0);
  let hold = 0,
    d0 = null;
  for (const a of rec.acts) {
    if (a.what === 'dive↓') d0 = a.t;
    if (a.what === 'dive↑' && d0 != null) {
      hold += a.t - d0;
      d0 = null;
    }
  }
  if (d0 != null) hold += T - d0;
  const acts = [...evs.flatMap(e => e.taps.map(t => ({ t, what: e.type }))), ...rec.acts].sort(
    (a, b) => a.t - b.t,
  );
  const gaps = acts.slice(1).map((a, i) => a.t - acts[i].t),
    calm = evs.slice(1).map((e, i) => e.warn - evs[i].end);
  return {
    T,
    real: F.real,
    n: evs.length,
    resolved: evs.filter(e => e.result !== 'přerušeno').length,
    span,
    win,
    hold,
    free: T - span,
    hands: T - span - hold,
    acts: acts.length,
    first: acts.length ? acts[0].t : null,
    gaps,
    calm,
    firstEv: evs.length ? evs[0].warn : null,
    lastEnd: evs.length ? T - evs.at(-1).end : null,
    x: F.x,
    places: Math.floor(F.x / P.route.place),
    cross: rec.cross.length,
    firstCross: rec.cross[0]?.t ?? null,
    types: evs.map(e => e.type.replace('*', '')),
  };
}

// --- běh ---
const t0 = Date.now();
const runs = STRATEGIES.flatMap(s =>
  Array.from({ length: K }, (_, id) =>
    campaign({ profile: PROFILE, strategy: s, pockets: 'auto', model: 'better', seed: 1, id }),
  ),
);
const kitLine = k =>
  `Power ${k.kit.power}/3, Folds ${k.kit.folds}/3, Paper ${k.kit.paper}/12, kapsy ${k.pockets} (${k.kit.slots.join('+') || '–'}), Atlas ${
    Object.entries(k.kit.atlas)
      .map(([b, l]) => b + l)
      .join(' ') || '–'
  }`;

log('## A. Stádia kampaně a vybavení');
log('');
log(
  `Reference: ${runs.length} kampaní profilu ${PROFILE} (${STRATEGIES.map(s => s + ' ' + K).join(', ')}; seed 1, id 0–${K - 1}, tytéž jako prvních ${K} kampaní každé skupiny v mc-plna). Průměrná délka kampaně: ${r1(runs.reduce((a, R) => a + R.minutes, 0) / runs.length)} min, rozsah ${r1(Math.min(...runs.map(R => R.minutes)))}–${r1(Math.max(...runs.map(R => R.minutes)))} min.`,
);
log('');
log(
  '| Stádium | minuta | hod č. (medián, rozsah) | čtvrť (medián) | kampaní už dohráno | vybavení (medián po složkách) |',
);
log('|---|---:|---|---:|---:|---|');
const stages = STAGES.map(S => ({ ...S, ...stageKit(runs, S.minute) }));
for (const S of stages)
  log(
    `| ${S.id} | ${S.minute} | ${S.n} (${S.nRange[0]}–${S.nRange[1]}) | D${S.district + 1} | ${S.finished} z ${S.count} | ${kitLine(S)}; Glider ${S.glider ? 'ano' : 'ne'} |`,
  );

// lety stádia: model střídavě Dart / Glider (podíl hodů s Gliderem v mc-plna ~52 %), n = hod č. stádia + j
const results = {};
for (const S of stages) {
  const list = [];
  for (let j = 0; j < SAMPLE; j++) {
    const n = Math.max(2, S.n + j),
      model = S.glider && j % 2 === 1 ? 'glider' : 'dart';
    list.push(recordFlight({ ...S.kit, model }, n));
  }
  results[S.id] = list;
}

log('');
log('## B. Tabulky událostí (čas letu v sekundách, t = 0 výhoz)');
log('');
log(
  'Sloupce: varování = začátek varování, okno od/do = otevření a zavření okna QTE (holub: okno do = stisk + 1,2 s), střed = ideální okamžik (perfekt), stisk = čas stisku/puštění bota, výsledek, účinek do = konec účinku události. `*` u typu = událost přivolaná Whistle.',
);
for (const S of stages) {
  log('');
  log(`### ${S.id} stádium (minuta ${S.minute}; ${kitLine(S)})`);
  log('');
  log(
    '| seed (hod č.) | model | co | t / varování | okno od | okno do | střed | stisk | výsledek | účinek do |',
  );
  log('|---:|---|---|---:|---:|---:|---|---|---|---:|');
  for (const F of results[S.id].slice(0, TABLE_FLIGHTS)) {
    const pre = `${F.n} | ${F.model}`;
    log(`| ${pre} | výhoz | 0.00 | | | | | | |`);
    const rows = [
      ...F.evs.map(e => ({ t: e.warn, e })),
      ...F.rec.cross.map(c => ({ t: c.t, c })),
    ].sort((a, b) => a.t - b.t);
    for (const r of rows) {
      if (r.e) {
        const e = r.e;
        log(
          `| ${pre} | ${e.type} | ${r2(e.warn)} | ${r2(e.open)} | ${r2(e.close)} | ${e.ctr.map(r2).join(' / ') || '–'} | ${e.taps.map(r2).join(' / ') || '–'} | ${e.result} | ${r2(e.end)} |`,
        );
      } else
        log(
          `| ${pre} | hranice ${r.c.k < 4 ? `D${r.c.k}→D${r.c.k + 1}` : 'cíl (4 876 m)'} | ${r2(r.c.t)} | | | | | | |`,
        );
    }
    log(
      `| ${pre} | dopad | ${r2(F.T)} | | | | | dolet ${Math.round(F.x)} m; celkem ${r2(F.T)} s letu = ${r2(F.real)} s skutečně | |`,
    );
  }
}

log('');
log(
  `## C. Souhrny za stádium (${SAMPLE} letů na stádium, hody č. ${stages.map(s => s.n).join(' / ')} a dál)`,
);
log('');
const cell = (v, f = r1) => f(v);
const agg = {};
for (const S of stages) {
  const M = results[S.id].map(metrics),
    all = (k, f = x => x) => M.map(m => f(m[k])).filter(v => v != null && Number.isFinite(v));
  const gaps = M.flatMap(m => m.gaps),
    calm = M.flatMap(m => m.calm),
    types = {};
  for (const m of M) for (const t of m.types) types[t] = (types[t] ?? 0) + 1;
  const nT = M.reduce((a, m) => a + m.n, 0);
  agg[S.id] = {
    T: q(all('T'), 0.5),
    Tp10: q(all('T'), 0.1),
    Tp90: q(all('T'), 0.9),
    real: q(all('real'), 0.5),
    ratio: q(
      M.map(m => m.real / m.T),
      0.5,
    ),
    n: q(all('n'), 0.5),
    nMean: nT / M.length,
    nMin: Math.min(...all('n')),
    nMax: Math.max(...all('n')),
    resolved: q(all('resolved'), 0.5),
    span: q(
      M.map(m => m.span / m.T),
      0.5,
    ),
    win: q(
      M.map(m => m.win / m.T),
      0.5,
    ),
    free: q(
      M.map(m => m.free / m.T),
      0.5,
    ),
    freeP10: q(
      M.map(m => m.free / m.T),
      0.1,
    ),
    freeP90: q(
      M.map(m => m.free / m.T),
      0.9,
    ),
    hands: q(
      M.map(m => m.hands / m.T),
      0.5,
    ),
    freeAll: M.reduce((a, m) => a + m.free, 0) / M.reduce((a, m) => a + m.T, 0),
    firstEv: q(all('firstEv'), 0.5),
    first: q(all('first'), 0.5),
    lastEnd: q(all('lastEnd'), 0.5),
    gapMed: q(gaps, 0.5),
    gapP10: q(gaps, 0.1),
    gapP90: q(gaps, 0.9),
    calmMed: q(calm, 0.5),
    calmP10: q(calm, 0.1),
    calmP90: q(calm, 0.9),
    acts: q(all('acts'), 0.5),
    x: q(all('x'), 0.5),
    places: q(all('places'), 0.5),
    speed: q(
      M.map(m => m.x / m.T),
      0.5,
    ),
    crossShare: M.filter(m => m.cross > 0).length / M.length,
    crossMed: q(all('cross'), 0.5),
    firstCross: q(all('firstCross'), 0.5),
    types: Object.entries(types)
      .sort((a, b) => b[1] - a[1])
      .map(([t, c]) => `${t} ${Math.round((100 * c) / nT)} %`)
      .join(', '),
  };
}
const row = (label, f) => log(`| ${label} | ${stages.map(S => f(agg[S.id])).join(' | ')} |`);
log(`| Ukazatel | ${stages.map(S => S.id).join(' | ')} |`);
log(`|---|${stages.map(() => '---:').join('|')}|`);
row('délka letu, medián [s letu]', a => r1(a.T));
row('délka letu, P10–P90 [s letu]', a => `${r1(a.Tp10)}–${r1(a.Tp90)}`);
row('délka letu skutečně (se zrychlením klouzání), medián [s]', a => r1(a.real));
row('skutečný / letový čas, medián', a => r2(a.ratio));
row('dolet, medián [m]', a => String(Math.round(a.x)));
row('průměrná rychlost, medián [m/s]', a => r1(a.speed));
row('míst přejitých za let (hranice po 304,8 m), medián', a => String(a.places));
row(
  'podíl letů, kde se přejde hranice čtvrti (1 219 m)',
  a => Math.round(a.crossShare * 100) + ' %',
);
row('hranic čtvrtí za let, medián', a => String(a.crossMed));
row('QTE začatých za let: medián (min–max)', a => `${a.n} (${a.nMin}–${a.nMax})`);
row('QTE dokončených za let, medián', a => String(a.resolved));
row(
  'podíl času v události (varování až konec účinku), medián',
  a => Math.round(a.span * 100) + ' %',
);
row('podíl času v okně QTE (otevření až zavření), medián', a => Math.round(a.win * 100) + ' %');
row(
  'podíl času mimo událost, medián (P10–P90)',
  a =>
    `${Math.round(a.free * 100)} % (${Math.round(a.freeP10 * 100)}–${Math.round(a.freeP90 * 100)})`,
);
row('z toho bez držení Dive (nic se nemačká), medián', a => Math.round(a.hands * 100) + ' %');
row('akcí hráče za let (stisky QTE + schopnosti), medián', a => String(a.acts));
row('1. varování po výhozu, medián [s]', a => r1(a.firstEv));
row('rozestup mezi akcemi: medián [s]', a => r1(a.gapMed));
row('rozestup mezi akcemi: P10–P90 [s]', a => `${r1(a.gapP10)}–${r1(a.gapP90)}`);
row('klid mezi událostmi (konec účinku do dalšího varování): medián [s]', a => r1(a.calmMed));
row('klid mezi událostmi: P10–P90 [s]', a => `${r1(a.calmP10)}–${r1(a.calmP90)}`);
row('poslední konec události do dopadu, medián [s]', a => r1(a.lastEnd));
row('podíl událostí podle typu', a => a.types);

// --- čas mimo let ---
log('');
log('## D. Čas mimo let (z kampaní simulátoru)');
log('');
const tot = runs.reduce((a, R) => a + R.real, 0),
  thr = runs.reduce((a, R) => a + R.throws, 0),
  cards = runs.reduce(
    (a, R) => a + (R.minutes * 60 - R.flights.reduce((s, f) => s + f[1] + P.time.ui, 0)),
    0,
  );
log(
  `Simulátor má jednu konstantu \`time.ui\` = ${P.time.ui} s na hod (míření + výsledek + Dílna dohromady, nerozdělené) a \`time.districtCard\` = ${P.time.districtCard} s za kartu čtvrti. V ${runs.length} referenčních kampaních: ${thr} hodů, celkem ${r1(tot / 60)} min, z toho mimo let ${r1((thr * P.time.ui + cards) / 60)} min (${Math.round(((thr * P.time.ui + cards) / tot) * 100)} %), v letu ${r1((tot - thr * P.time.ui - cards) / 60)} min; průměrně ${r1(tot / thr)} s na hod včetně letu.`,
);
log('');
// --- mc-plna ---
log('');
log(
  '## E. Čas ve čtvrtích podle mc-plna (z `simulation/progression/out/mc-plna.json`, 300 kampaní na skupinu)',
);
log('');
const here = dirname(fileURLToPath(import.meta.url)),
  mc = JSON.parse(readFileSync(join(here, '../progression/out/mc-plna.json'), 'utf8'));
log(
  `Soubor: ${mc.name}, ${mc.date}, n = ${mc.n}, seed ${mc.seed}. Čtvrť = nejvzdálenější dosažený dolet (rekord) po hranicích 1 219,2 m; hody a minuty jsou medián kampaní skupiny pro tu čtvrť (rozdíl mezi dosažením hranic, \`summarize\` v run.mjs; minuty včetně ${P.time.ui} s UI na hod a ${P.time.districtCard} s karty čtvrti).`,
);
log('');
log(
  '| Skupina | hody D1 / D2 / D3 / D4 | minuty D1 / D2 / D3 / D4 | celkem hody / minuty | dokončeno |',
);
log('|---|---|---|---|---:|');
const sum = [0, 0, 0, 0],
  summ = [0, 0, 0, 0];
let ng = 0;
for (const [g, v] of Object.entries(mc.groups)) {
  log(
    `| ${g} | ${v.district.map(d => d.throws).join(' / ')} | ${v.district.map(d => r1(d.minutes)).join(' / ')} | ${v.throws} / ${r1(v.minutes)} | ${Math.round(v.doneRate * 100)} % |`,
  );
  v.district.forEach((d, i) => {
    sum[i] += d.throws;
    summ[i] += d.minutes;
  });
  ng++;
}
log(
  `| **průměr mediánů přes ${ng} skupin** | ${sum.map(s => Math.round(s / ng)).join(' / ')} | ${summ.map(s => r1(s / ng)).join(' / ')} | ${r1(sum.reduce((a, b) => a + b, 0) / ng)} / ${r1(summ.reduce((a, b) => a + b, 0) / ng)} | |`,
);

console.log(out.join('\n'));
console.error(`čas běhu ${((Date.now() - t0) / 1000).toFixed(1)} s`);
