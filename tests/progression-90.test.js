// Simulátor progrese na 90 min: Mailbag (01 §2.11), náhled přehráním (01 §2.10), detektory kousků (05 §4.6), cíle t90 (05 §7.2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { P, setParams, MODEL_SETS, TARGET_SETS } from '../simulation/progression/params.mjs';
import {
  campaign,
  reward,
  coinReward,
  mailbagM,
  replayModel,
  windSwitch,
} from '../simulation/progression/campaign.mjs';
import {
  checks,
  summarize,
  trickTable,
  trickSummary,
  args,
} from '../simulation/progression/run.mjs';
import { createFlight, fly } from '../simulation/progression/model.mjs';
import { throwOnce, lineRocketBot, rocketBot } from '../simulation/progression/abilities.mjs';
import {
  TRICKS,
  trickById,
  detectTricks,
  intentTricks,
} from '../simulation/progression/tricks.mjs';

setParams();
const full = {
  power: 3,
  folds: 3,
  paper: 6,
  atlas: {
    chain: 2,
    steam: 2,
    thermal: 2,
    drone: 2,
    skip: 3,
    pinwheel: 1,
    tape: 2,
    echo: 1,
    star: 1,
  },
  slots: [],
};
const sameRun = (a, b) =>
  assert.deepEqual(
    { t: a.throws, r: a.real, c: a.coins, b: a.buys.map(x => x.id), f: a.flights },
    { t: b.throws, r: b.real, c: b.coins, b: b.buys.map(x => x.id), f: b.flights },
  );

test('mailbag: off by default, coin reward with basket M and cap', () => {
  assert.equal(P.economy.mailbag.on, false);
  assert.deepEqual(P.economy.mailbag.levels, [0.1, 0.1, 0.1]);
  assert.deepEqual(P.economy.mailbag.unlockPlace, [5, 9, 13]);
  assert.equal(mailbagM(0), 0);
  assert.ok(Math.abs(mailbagM(3) - 0.3) < 1e-12);
  for (let x = 0; x < 6000; x += 7.3) assert.equal(coinReward(x, 0), reward(x));
  assert.equal(coinReward(1300, 0.1), 154);
  assert.equal(coinReward(1300, 0.3), 182);
  assert.equal(coinReward(0, 0.3), 13); // 01 §2.11: hod 0 m = 13 ◈
  assert.equal(coinReward(1300, 0.9), Math.floor(140 * 1.5)); // strop koše M +50 %
  const R = campaign({ profile: 'average', strategy: 'realistic', seed: 1, id: 0 });
  assert.ok(!R.buys.some(b => b.kind === 'mailbag'));
  assert.deepEqual(R.econ.mailbag, [0, 0, 0, 0]);
});

test('mailbag: levels open by place in order, bonus accounting, no-mailbag / mailbag-first', () => {
  setParams({ economy: { mailbag: { on: true } } });
  try {
    const spec = { profile: 'average', seed: 1, id: 1 },
      mf = campaign({ ...spec, strategy: 'mailbag-first' }),
      nm = campaign({ ...spec, strategy: 'no-mailbag' }),
      re = campaign({ ...spec, strategy: 'realistic' });
    assert.ok(!nm.buys.some(b => b.kind === 'mailbag'));
    const mb = mf.buys.filter(b => b.kind === 'mailbag');
    assert.deepEqual(
      mb.map(b => b.id),
      ['mailbag1', 'mailbag2', 'mailbag3'].slice(0, mb.length),
    );
    assert.ok(mb.length >= 1);
    // úroveň k až po rekordu na začátek místa unlockPlace[k]
    mb.forEach((b, k) =>
      assert.ok(
        Math.max(...mf.flights.slice(0, b.throw).map(f => f[3])) >=
          (P.economy.mailbag.unlockPlace[k] - 1) * P.route.place - 1,
        b.id,
      ),
    );
    for (const R of [mf, re]) {
      const inc = R.econ.income.reduce((a, b) => a + b, 0),
        sp = R.econ.spend.reduce((a, b) => a + b, 0);
      assert.equal(inc - sp, R.coins);
      const bonus = R.econ.mailbag.reduce((a, b) => a + b, 0),
        base = R.flights.reduce((a, f) => a + reward(f[3]), 0);
      // flights[3] je zaokrouhlený dolet; bonus = příjem − základní odměny, takže součet sedí do zaokrouhlení
      assert.ok(Math.abs(inc - bonus - base) <= R.throws, `${inc} ${bonus} ${base}`);
      assert.ok(Math.abs(R.mailbag.reduce((a, e) => a + e.earned, 0) - bonus) < 1e-6);
    }
    // bez koupě Mailbagu je realistic shodná s no-mailbag (stejná náhoda)
    if (!re.buys.some(b => b.kind === 'mailbag')) sameRun(re, nm);
    const S = summarize([mf, re, nm]);
    assert.ok(S.mailbag && S.mailbag.levels.length === 3);
    assert.ok(S.mailbag.incomeRatio >= 1);
  } finally {
    setParams();
  }
});

test('preview replay: forced QTE grades, ideal shift, current model estimate 1', () => {
  // stejný hod s vynucenými výsledky jiného letu: události vyhodnocené v obou letech mají stejné výsledky
  const ctx = { key: 'pr|3', n: 20, profile: 'weak', angle: 18 },
    a = throwOnce({ ...full, model: 'dart' }, ctx);
  const grades = Object.fromEntries(
    a.events.filter(e => e.result && e.result !== 'interrupted').map(e => [e.i, e.result]),
  );
  const b = throwOnce({ ...full, model: 'glider' }, { ...ctx, angle: 30, grades });
  for (const e of b.events)
    if (e.result && grades[e.i] && e.result !== 'interrupted') assert.equal(e.result, grades[e.i]);
  // přehrání vlastních výsledků se stejným modelem = původní let
  assert.equal(throwOnce({ ...full, model: 'dart' }, { ...ctx, grades }).x, a.x);
  const hist = [1, 2, 3, 4, 5, 6].map(n => ({
      key: 'pr',
      n,
      profile: 'average',
      bias: 0,
      angle: 18,
    })),
    meta = hist.map(h => {
      const f = throwOnce({ ...full, model: 'dart' }, h);
      return {
        model: 'dart',
        grades: Object.fromEntries(
          f.events.filter(e => e.result && e.result !== 'interrupted').map(e => [e.i, e.result]),
        ),
      };
    });
  const r = replayModel(full, ['dart', 'glider'], {
    hist,
    meta,
    cur: 'dart',
    key: 'pr',
    n: 7,
    profile: 'average',
  });
  assert.equal(r.est.dart, 1);
  assert.ok(r.est.glider > 0);
  assert.equal(r.model, r.est.glider > 1 ? 'glider' : 'dart');
  assert.deepEqual(
    replayModel(full, ['dart', 'glider'], {
      hist: [],
      meta: [],
      cur: 'dart',
      key: 'pr',
      n: 1,
      profile: 'average',
    }),
    { model: 'dart', est: { dart: 1 } },
  );
  // úhel posunutý o rozdíl ideálů: glider z hodu Dartem na 18° letí na 30°
  const f = throwOnce(
    { ...full, model: 'glider' },
    {
      ...hist[0],
      angle: 18 + P.models.glider.ideal - P.models.dart.ideal,
      grades: meta[0].grades,
      exact: true,
    },
  );
  assert.ok(Math.abs(f.angle - 30) < 1);
});

test('preview replay: campaign uses replay by default, passive mode stays available', () => {
  setParams(MODEL_SETS.obsah01);
  try {
    const spec = { profile: 'average', strategy: 'realistic', model: 'preview', seed: 1, id: 0 },
      rep = campaign(spec);
    setParams({ ...MODEL_SETS.obsah01, bots: { modelPick: { mode: 'passive' } } });
    const pas = campaign(spec);
    assert.ok((rep.byModel.glider?.throws ?? 0) > 0, 'replay volí i Glider');
    assert.notDeepEqual(rep.flights, pas.flights);
  } finally {
    setParams();
  }
});

// syntetický let pro detektory: události {type,i,result,resolvedAt,comboBefore}
const ev = (type, result, t, extra = {}) => ({
  type,
  i: extra.i ?? Math.round(t * 10),
  result,
  resolvedAt: t,
  comboBefore: extra.combo ?? 0,
  phase: 'done',
  doneAt: t + 1,
  ...(extra.wAt != null ? { whistled: true, whistledAt: extra.wAt } : {}),
});
const fake = (events, o = {}) => ({
  events,
  echoes: o.echoes ?? [],
  stats: { skips: 0, maxY: 12, ...o.stats },
  kit: o.kit ?? full,
  w: o.w ?? 0,
  t: o.t ?? 20,
  x: o.x ?? 1000,
});
const hit = (id, f, replay) => trickById[id].detect(f, replay);

test('tricks: detectors on synthetic flights', () => {
  assert.equal(TRICKS.length, 13);
  assert.deepEqual(intentTricks(), [
    'kettleSong',
    'overTheLine',
    'whistleStop',
    'hawkFeather',
    'kiteTail',
    'skimmerRipples',
    'sailStripes',
    'needleThread',
  ]);
  assert.ok(!trickById.steamOrgan);
  assert.deepEqual(
    TRICKS.filter(t => !t.model).map(t => t.cls),
    ['dovednost', 'volba', 'volba', 'dovednost', 'volba', 'dovednost', 'dovednost', 'pestrost'],
  );
  assert.ok(hit('pigeonExpress', fake([ev('bird', 'perfect', 3), ev('gust', 'perfect', 4.4)])));
  assert.ok(!hit('pigeonExpress', fake([ev('bird', 'perfect', 3), ev('gust', 'perfect', 4.6)])));
  assert.ok(!hit('pigeonExpress', fake([ev('bird', 'success', 3), ev('gust', 'perfect', 4)])));
  assert.ok(
    !hit(
      'pigeonExpress',
      fake([ev('bird', 'perfect', 3), ev('steam', 'perfect', 3.5), ev('gust', 'perfect', 4)]),
    ),
  );
  // v2: „hned další událost“ s oknem 99 (05 §4.6.2)
  setParams({ tricks: { pigeonWindow: 99, droneWindow: 99 } });
  try {
    assert.ok(
      hit(
        'pigeonExpress',
        fake([ev('bird', 'perfect', 3), ev('star', 'miss', 5), ev('gust', 'perfect', 9)]),
      ),
    );
    assert.ok(
      !hit(
        'pigeonExpress',
        fake([ev('bird', 'perfect', 3), ev('steam', 'perfect', 5), ev('gust', 'perfect', 9)]),
      ),
    );
    assert.ok(hit('dronePingPong', fake([ev('drone', 'perfect', 3), ev('drone', 'perfect', 8)])));
    assert.ok(
      !hit(
        'dronePingPong',
        fake([ev('drone', 'perfect', 3), ev('gust', 'perfect', 5), ev('drone', 'perfect', 8)]),
      ),
    );
  } finally {
    setParams();
  }
  assert.ok(trickById.dronePingPong.cap(fake([ev('drone', 'miss', 3), ev('drone', 'success', 5)])));
  assert.ok(
    !trickById.dronePingPong.cap(
      fake([ev('drone', 'miss', 3), ev('gust', 'success', 5), ev('drone', 'perfect', 8)]),
    ),
  );
  assert.ok(!trickById.dronePingPong.has({ atlas: { drone: 2 } }));
  assert.ok(trickById.dronePingPong.has({ atlas: { drone: 3 } }));
  assert.ok(trickById.wish.cap(fake([ev('star', 'miss', 3)])));
  assert.ok(!trickById.wish.cap(fake([ev('gust', 'perfect', 3)])));
  // Whistle Stop: přivolaná perfektně, předchozí běžná perfektně, pískání do whistleGap od konce jejího účinku (doneAt = resolvedAt + 1 v ev)
  assert.ok(
    hit('whistleStop', fake([ev('gust', 'perfect', 3), ev('bird', 'perfect', 5, { wAt: 4.9 })])),
  );
  assert.ok(
    hit(
      'whistleStop',
      fake([
        ev('gust', 'perfect', 3),
        ev('star', 'perfect', 4.8),
        ev('bird', 'perfect', 6, { wAt: 4.9 }),
      ]),
    ),
  );
  assert.ok(
    !hit('whistleStop', fake([ev('gust', 'perfect', 3), ev('bird', 'perfect', 6, { wAt: 5.1 })])),
  );
  assert.ok(
    !hit('whistleStop', fake([ev('gust', 'success', 3), ev('bird', 'perfect', 5, { wAt: 4.2 })])),
  );
  assert.ok(
    !hit('whistleStop', fake([ev('gust', 'perfect', 3), ev('bird', 'success', 5, { wAt: 4.2 })])),
  );
  assert.ok(!hit('whistleStop', fake([ev('gust', 'perfect', 3), ev('bird', 'perfect', 5)])));
  assert.equal(
    trickById.whistleStop.diag(
      fake([ev('gust', 'perfect', 3), ev('bird', 'perfect', 5, { wAt: 4.5 })]),
    ),
    0.5,
  );
  setParams({ tricks: { whistleGap: 99 } });
  try {
    assert.ok(
      hit('whistleStop', fake([ev('gust', 'perfect', 3), ev('bird', 'perfect', 9, { wAt: 8 })])),
    );
  } finally {
    setParams();
  }
  assert.ok(trickById.whistleStop.has({ slots: ['whistle'] }));
  assert.ok(!trickById.whistleStop.has({ slots: ['rocket'] }));
  assert.ok(trickById.kettleSong.has({ atlas: { steam: 1 }, slots: ['sharp'] }));
  assert.ok(!trickById.kettleSong.has({ atlas: { steam: 1 }, slots: ['calm'] }));
  assert.ok(hit('kettleSong', fake([ev('steam', 'perfect', 3)])));
  assert.ok(!hit('kettleSong', fake([ev('steam', 'success', 3)])));
  assert.ok(
    hit(
      'tapeSave',
      fake([ev('gust', 'miss', 3), ev('star', 'perfect', 4), ev('bird', 'perfect', 6)]),
    ),
  );
  assert.ok(!hit('tapeSave', fake([ev('gust', 'miss', 3), ev('bird', 'success', 6)])));
  assert.ok(hit('wish', fake([ev('star', 'perfect', 5, { combo: 5 })])));
  assert.ok(!hit('wish', fake([ev('star', 'perfect', 5, { combo: 4 })])));
  assert.ok(!hit('wish', fake([ev('star', 'miss', 5, { combo: 9 })])));
  assert.ok(hit('dronePingPong', fake([ev('drone', 'perfect', 3), ev('drone', 'perfect', 5)])));
  assert.ok(!hit('dronePingPong', fake([ev('drone', 'perfect', 3), ev('drone', 'perfect', 5.2)])));
  assert.ok(
    !hit(
      'dronePingPong',
      fake([ev('drone', 'perfect', 3), ev('star', 'perfect', 3.5), ev('drone', 'perfect', 5.5)]),
    ),
  );
  const verbs = [
    ev('gust', 'success', 2),
    ev('bird', 'perfect', 5),
    ev('steam', 'success', 9),
    ev('drone', 'success', 13),
  ];
  assert.ok(hit('allTheVerbs', fake(verbs)));
  assert.ok(!hit('allTheVerbs', fake(verbs.slice(0, 3))));
  assert.ok(!hit('allTheVerbs', fake([...verbs.slice(0, 2), ev('steam', 'partial', 9), verbs[3]])));
  const hawk = { ...full, model: 'hawk' };
  assert.ok(
    hit(
      'hawkFeather',
      fake(
        [
          ev('gust', 'perfect', 1),
          ev('bird', 'perfect', 2),
          ev('star', 'miss', 2.5),
          ev('gust', 'perfect', 3),
        ],
        { kit: hawk },
      ),
    ),
  );
  assert.ok(
    !hit(
      'hawkFeather',
      fake(
        [
          ev('gust', 'perfect', 1),
          ev('bird', 'success', 2),
          ev('gust', 'perfect', 3),
          ev('gust', 'perfect', 4),
        ],
        { kit: hawk },
      ),
    ),
  );
  assert.ok(hit('kiteTail', fake([], { stats: { maxY: 41 } })));
  assert.ok(hit('kiteTail', fake([ev('thermal', 'perfect', 3)])));
  assert.ok(!hit('kiteTail', fake([ev('thermal', 'success', 3)])));
  assert.ok(hit('skimmerRipples', fake([], { stats: { skips: 2 } })));
  assert.ok(!hit('skimmerRipples', fake([], { stats: { skips: 1 } })));
  assert.ok(hit('sailStripes', fake([], { w: 0.08 })));
  assert.ok(!hit('sailStripes', fake([], { w: 0.04 })));
  assert.ok(hit('needleThread', fake([ev('drone', 'success', 3), ev('drone', 'perfect', 8)])));
  assert.ok(!hit('needleThread', fake([ev('drone', 'success', 3), ev('drone', 'miss', 8)])));
  // Over the Line: výstřel do 1 s před dotykem země a bez něj by let skončil před hranicí místa
  const pl = P.route.place,
    otl = (fire, touch, x0) =>
      hit(
        'overTheLine',
        fake([], { x: pl + 5, stats: { rocketT: [fire], touchT: [touch] } }),
        () => ({ x: x0 }),
      );
  assert.ok(otl(9.5, 10, pl - 5));
  assert.ok(!otl(9.5, 10, pl + 1));
  assert.ok(!otl(8.5, 10, pl - 5));
  // přísady a model v ruce
  assert.ok(!trickById.kettleSong.has({ atlas: {} }));
  assert.ok(trickById.overTheLine.has({ slots: ['rocket'] }));
  assert.ok(!trickById.hawkFeather.has(full));
  const D = detectTricks(fake([ev('steam', 'perfect', 3)], { kit: { ...full, slots: ['sharp'] } }));
  assert.ok((D.hit >> 1) & 1);
  assert.equal(D.cap, 0);
  assert.equal((D.ing >> TRICKS.findIndex(t => t.id === 'hawkFeather')) & 1, 0);
});

test('tricks: detection does not change the campaign, intent changes pockets and bots', () => {
  const spec = { profile: 'average', strategy: 'realistic', seed: 1, id: 2 },
    a = campaign(spec),
    b = campaign({ ...spec, tricks: true });
  sameRun(a, b);
  assert.equal(b.tricks.flights.length, b.throws);
  assert.ok(!a.tricks);
  const c = campaign({ ...spec, intent: 'overTheLine' });
  assert.equal(c.intent, 'overTheLine');
  assert.ok(c.tricks);
  assert.ok((c.slotsUsed.rocket ?? 0) >= (b.slotsUsed.rocket ?? 0));
  assert.throws(() => campaign({ ...spec, intent: 'nope' }));
  // protifaktický let: od offAfter oba boti rakety nestřílí
  const kit = { ...full, slots: ['rocket'] },
    ctx = { key: 'ol|1', n: 20, profile: 'average', angle: 18 },
    f = throwOnce(kit, ctx);
  assert.ok(f.stats.rocketT?.length > 0);
  assert.equal(
    throwOnce(kit, { ...ctx, bot: { rocket: { offAfter: 0 } } }).stats.rocketT,
    undefined,
  );
  assert.equal(
    throwOnce(kit, { ...ctx, intent: 'overTheLine', bot: { rocket: { offAfter: 0 } } }).stats
      .rocketT,
    undefined,
  );
  assert.ok(typeof lineRocketBot === 'function' && typeof rocketBot === 'function');
});

test('t90 targets: 05 §7.2 bands, NOT ASSESSED rows only with the set', () => {
  const T = TARGET_SETS.t90.targets;
  assert.deepEqual(T.throwsPerDistrict, [
    [34, 46],
    [36, 48],
    [37, 49],
    [36, 48],
  ]);
  assert.deepEqual(T.minutesPerDistrict, [
    [14, 20],
    [18, 24],
    [21, 27],
    [23, 29],
  ]);
  assert.deepEqual(T.totalMinutes, [82, 98]);
  assert.deepEqual(T.totalThrows, [150, 185]);
  assert.equal(T.weakVsAverage, 1.35);
  assert.equal(T.expertVsAverage, 0.69);
  assert.deepEqual(T.droughtA, { median: 3, p90: 6, maxP90: 12 });
  assert.equal(T.droughtP90, 5);
  assert.equal(T.placeGapMedian, 11);
  assert.equal(T.placeGapP90, 17);
  const rs = [0, 1].map(id => campaign({ profile: 'average', strategy: 'realistic', seed: 1, id })),
    W = [0, 1].map(id => campaign({ profile: 'weak', strategy: 'realistic', seed: 1, id }));
  const G = {
    'average|realistic|auto|better': summarize(rs),
    'weak|realistic|auto|better': summarize(W),
  };
  const def = checks(G, null);
  assert.ok(!def.some(c => c.ok === 'na'));
  assert.ok(def.some(c => c.name === 'Slabý / průměrný (hody)'));
  setParams(TARGET_SETS.t90);
  try {
    const c = checks(G, null);
    assert.ok(c.filter(x => x.ok === 'na').length >= 4);
    assert.ok(c.some(x => x.name === 'Slabý / průměrný (minuty)'));
    assert.ok(c.some(x => x.name.startsWith('Sucho bez novinky A')));
    assert.ok(c.some(x => x.name === 'Hody celkem (průměrný)'));
    // targets.model 'preview' bez skupiny preview → reference better
    assert.ok(c.some(x => x.name === 'Hody D1 (průměrný)'));
  } finally {
    setParams();
  }
  const S = summarize(rs);
  assert.equal(S.repeat.length, 4);
  assert.ok(S.repeat[0] > 0.9);
  assert.ok(S.droughtA.median != null);
});

test('tricks: verdict table follows 05 §4.6 thresholds', () => {
  const per = (rate, first, never, extra = {}) => ({
    flights: 200,
    rate,
    campaigns: 4,
    first,
    never,
    firstIng: 3,
    firstIngP90: 9,
    ...extra,
  });
  const grp = o => ({
    tricks: {
      per: Object.fromEntries(TRICKS.map(t => [t.id, o[t.id] ?? per(0.1, 10, 0)])),
      firstTrick: 5,
      found: 0.5,
      corrHigh: [],
    },
  });
  const G = {
    'average|realistic|auto|better': grp({ kettleSong: per(0.3, 5, 0), wish: per(0.005, 50, 0.8) }),
    'weak|realistic|auto|better': grp({}),
    'expert|realistic|auto|better': grp({}),
    'average|realistic|auto|better|i:overTheLine': grp({ overTheLine: per(0.2, 5, 0) }),
    'average|realistic|auto|better|i:pigeonExpress': grp({ pigeonExpress: per(0.11, 5, 0) }),
  };
  const X = trickTable(G),
    row = id => X.rows.find(r => r.id === id);
  assert.equal(row('overTheLine').verdict, 'HEALTHY');
  assert.equal(row('pigeonExpress').vIntent, 'náhoda');
  assert.equal(row('pigeonExpress').verdictIntent, 'CONCERNS');
  assert.equal(row('kettleSong').vRate, 'samozřejmý');
  assert.equal(row('kettleSong').verdict, 'CRITICAL');
  assert.equal(row('wish').vRate, 'vzácný');
  assert.equal(row('tapeSave').verdictIntent, 'HEALTHY (záměr NOT ASSESSED)');
  assert.equal(row('hawkFeather').verdict, 'HEALTHY');
  assert.equal(X.gate.of, 8);
  assert.equal(X.gate.strict, 1);
  assert.equal(X.gate.byClass, 2); // Over the Line záměrem, All the Verbs četností
  // v2: třídy (dovednost expert / slabý ≥ 1,3×, pestrost jen četností) jako volba gateBy, čtvrť nad 25 % = samozřejmý
  assert.equal(row('allTheVerbs').verdictClass, 'HEALTHY');
  assert.equal(row('allTheVerbs').verdictIntent, 'HEALTHY (záměr NOT ASSESSED)');
  assert.equal(row('tapeSave').vSkill, 'hraniční');
  assert.equal(row('tapeSave').verdictClass, 'CONCERNS');
  assert.equal(X.gate.by, 'class');
  assert.equal(row('tapeSave').verdict, row('tapeSave').verdictClass);
  assert.equal(X.gate.build.mode, '4.7');
  assert.deepEqual(X.gate.build.tricks, []);
  assert.equal(X.gate.build.models.length, 5);
  const G2 = {
    ...G,
    'average|realistic|auto|better|i:whistleStop': grp({ whistleStop: per(0.2, 5, 0) }),
    'expert|realistic|auto|better': grp({
      tapeSave: per(0.14, 10, 0),
      pigeonExpress: per(0.09, 10, 0),
    }),
    'average|realistic|auto|better': grp({
      kettleSong: per(0.3, 5, 0),
      wish: per(0.005, 50, 0.8),
      dronePingPong: per(0.1, 10, 0, { byD: [null, null, 0.3, 0.1], dMax: 0.3 }),
    }),
  };
  try {
    const Y = trickTable(G2),
      rw = id => Y.rows.find(r => r.id === id);
    assert.equal(Y.gate.by, 'class');
    assert.equal(rw('tapeSave').vSkill, 'zdravý');
    assert.equal(rw('tapeSave').verdict, 'HEALTHY');
    assert.equal(rw('pigeonExpress').vSkill, 'náhoda');
    assert.equal(rw('pigeonExpress').verdict, 'CONCERNS');
    assert.equal(rw('dronePingPong').vDist, 'samozřejmý');
    assert.equal(rw('dronePingPong').verdict, 'CRITICAL');
    assert.equal(rw('overTheLine').verdict, 'HEALTHY');
    assert.equal(Y.gate.byClass, Y.rows.filter(r => !r.model && r.verdict === 'HEALTHY').length);
    assert.deepEqual(Y.gate.build.healthy, [
      'overTheLine',
      'tapeSave',
      'whistleStop',
      'allTheVerbs',
    ]);
    assert.equal(Y.gate.build.mode, 'healthy+models');
    assert.deepEqual(Y.gate.build.tricks, Y.gate.build.healthy);
  } finally {
    setParams();
  }
  setParams({ targets: { tricks: { gateBy: 'intent' } } });
  try {
    const Z = trickTable(G2);
    assert.equal(Z.rows.find(r => r.id === 'tapeSave').verdict, 'HEALTHY (záměr NOT ASSESSED)');
  } finally {
    setParams();
  }
});

test('tricks v2: summary by district, cap, share and φ list', () => {
  const i = id => TRICKS.findIndex(t => t.id === id),
    b = id => 1 << i(id),
    pe = b('pigeonExpress'),
    ts = b('tapeSave');
  // 40 letů v D1 (pigeon 10 ×, s dvojicí 20 ×), 40 v D2 (pigeon 2 ×); tape jen v D2 a vždy s pigeon
  const fl = [
    ...Array.from({ length: 40 }, (_, k) => [pe, k < 10 ? pe : 0, 'dart', 0, k < 20 ? pe : 0]),
    ...Array.from({ length: 40 }, (_, k) => [pe | ts, k < 2 ? pe | ts : 0, 'dart', 1, 0]),
  ];
  const R = {
    tricks: {
      flights: fl,
      first: { pigeonExpress: { ing: 1, ingN: 1, hit: 1, hitN: 1 } },
      diag: {},
    },
    throws: 80,
  };
  const S = trickSummary([R]),
    pp = S.per.pigeonExpress;
  assert.deepEqual(
    pp.byD.map(v => (v == null ? null : +v.toFixed(3))),
    [0.25, 0.05, null, null],
  );
  assert.equal(pp.dMax, 0.25);
  assert.equal(pp.cap, 0.25);
  assert.equal(pp.share, 1);
  assert.equal(S.per.tapeSave.share, 0.5);
  assert.equal(S.per.tapeSave.cap, undefined);
  const c = S.corr.find(x => x.a === 'pigeonExpress' && x.b === 'tapeSave');
  assert.ok(c && Math.abs(c.phi - 1) < 1e-9);
  assert.ok(S.corr.every((x, k) => !k || S.corr[k - 1].phi >= x.phi));
});

test('tricks v2: intent bots (Kettle Song second pocket, Whistle Stop after perfect)', () => {
  const spec = { profile: 'average', strategy: 'realistic', seed: 1, id: 3 },
    k = campaign({ ...spec, intent: 'kettleSong' });
  assert.equal(k.intent, 'kettleSong');
  assert.ok(!(k.slotsUsed.calm > 0));
  assert.ok((k.slotsUsed.sharp ?? 0) <= (k.slotsUsed.rocket ?? 0)); // Sharp Edge až ve druhé kapse, první zůstává výchozí
  // Whistle Stop: záměr píská jen po perfektu běžné události
  const kit = { ...full, slots: ['whistle'] };
  let n0 = 0;
  for (let n = 1; n <= 30; n++) {
    const f = throwOnce(kit, {
        key: 'wsb|1',
        n,
        profile: 'weak',
        angle: 18,
        intent: 'whistleStop',
      }),
      w = f.events.find(e => e.whistled);
    if (!w) continue;
    n0++;
    const p = f.events
      .filter(e => e.result && e.type !== 'star' && e !== w && e.resolvedAt <= w.whistledAt)
      .sort((a, b) => a.resolvedAt - b.resolvedAt)
      .at(-1);
    assert.equal(p.result, 'perfect');
    assert.ok(w.whistledAt >= p.doneAt - 1e-9);
  }
  assert.ok(n0 > 0);
  // kapsa ze záměru s běžnými boty (výskyt „bez záměru“ Whistle Stop): Whistle v kapse, ale bez bota se záměrem
  const wb = campaign({ ...spec, id: 4, intent: 'whistleStop', intentBase: true }),
    wi = campaign({ ...spec, id: 4, intent: 'whistleStop' });
  assert.equal(wb.intentBase, true);
  assert.equal(wi.intentBase, undefined);
  assert.ok(wb.slotsUsed.whistle > 0);
  const per = (fl, rate) => ({
    flights: fl,
    rate,
    campaigns: 4,
    first: 5,
    never: 0,
    firstIng: 3,
    firstIngP90: 9,
  });
  const grp = o => ({
    tricks: {
      per: Object.fromEntries(TRICKS.map(t => [t.id, o[t.id] ?? per(200, 0.1)])),
      firstTrick: 5,
      found: 0.5,
      corrHigh: [],
    },
  });
  const G = {};
  for (const p of ['weak', 'average', 'expert']) {
    G[p + '|realistic|auto|better'] = grp({ whistleStop: per(0, null), kettleSong: per(0, null) });
    G[p + '|realistic|auto|better|i:whistleStop|base'] = grp({ whistleStop: per(100, 0.04) });
    G[p + '|realistic|auto|better|i:whistleStop'] = grp({ whistleStop: per(100, 0.12) });
    G[p + '|realistic|auto|better|i:kettleSong'] = grp({ kettleSong: per(100, 0.15) });
  }
  const X = trickTable(G),
    r = id => X.rows.find(x => x.id === id);
  assert.equal(r('whistleStop').rate, 0.04);
  assert.equal(r('whistleStop').baseFrom, 'kapsa');
  assert.ok(Math.abs(r('whistleStop').ratio - 3) < 1e-9);
  assert.equal(r('whistleStop').vIntent, 'zdravý');
  assert.equal(r('kettleSong').rate, 0.15);
  assert.equal(r('kettleSong').ratio, 1);
  assert.equal(r('kettleSong').vIntent, 'náhoda');
  assert.equal(r('pigeonExpress').baseFrom, '');
});

test('preview wind both: hand by same, one-throw switch only for windK models, no switch = same', () => {
  setParams(MODEL_SETS.obsah01);
  try {
    const spec = { profile: 'average', strategy: 'realistic', model: 'preview', seed: 1, id: 0 },
      same = campaign(spec);
    assert.equal(same.windSwitch, undefined);
    setParams({ ...MODEL_SETS.obsah01, bots: { modelPick: { wind: 'both', switchGain: 99 } } });
    const nos = campaign(spec);
    sameRun(same, nos);
    assert.equal(nos.windSwitch, 0);
    setParams({
      ...MODEL_SETS.obsah01,
      bots: { modelPick: { wind: 'both', switchGain: -1, switchWind: 0 } },
    });
    const hist = [1, 2, 3, 4, 5].map(n => ({
        key: 'wb',
        n,
        profile: 'average',
        bias: 0,
        angle: 18,
      })),
      meta = hist.map(h => ({ model: 'dart', grades: {} }));
    const m = windSwitch(full, ['dart', 'glider', 'hawk', 'sail', 'needle'], {
      hist,
      meta,
      cur: 'dart',
      key: 'wb',
      n: 6,
      profile: 'average',
    });
    assert.ok(['sail', 'needle'].includes(m));
    assert.equal(
      windSwitch(full, ['dart', 'glider', 'hawk'], {
        hist,
        meta,
        cur: 'dart',
        key: 'wb',
        n: 6,
        profile: 'average',
      }),
      null,
    );
    assert.equal(
      windSwitch(full, ['dart', 'sail'], {
        hist: [],
        meta: [],
        cur: 'dart',
        key: 'wb',
        n: 6,
        profile: 'average',
      }),
      null,
    );
    setParams({ ...MODEL_SETS.obsah01, bots: { modelPick: { wind: 'both' } } });
    const both = campaign({ ...spec, id: 1 });
    assert.ok(both.windSwitch >= 0 && both.windSwitch <= both.throws);
  } finally {
    setParams();
  }
});

test('cli: --set can be repeated', () => {
  const a = args([
    '--n',
    '4',
    '--set',
    'tricks.pigeonWindow=99',
    '--set',
    'tricks.droneWindow=99',
    '--tricks',
    '--set',
    'tricks.wishCombo=3',
  ]);
  assert.deepEqual(a.set, [
    'tricks.pigeonWindow=99',
    'tricks.droneWindow=99',
    'tricks.wishCombo=3',
  ]);
  assert.equal(a.n, '4');
  assert.equal(a.tricks, true);
});
