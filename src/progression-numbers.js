// Čísla nového systému progrese pro hru (mechanika letu src/flight.js, Dílna, Atlas, kapsy, ekonomika).
// PROVISIONAL: kopie sekcí route…warp z DEFAULTS v simulation/progression/params.mjs (stav F5, 15. 10. 2026). Test shody
// tests/progression-numbers.test.js hlídá, že se každé číslo rovná params.mjs; ladí se jen tam, sem se přenáší. Boti, kampaň, kousky,
// křivka a cíle simulátoru (profiles, bots, campaign, tricks, curve, targets, time) sem nepatří. Komentáře „08:“, „F3:“ = historie z params.mjs.
import { DT, GRAVITY, STEEP_PENALTY, MODELS } from './config.js';
import { TIMING } from './events.js';
import { SCREEN_METERS, ROUTE } from './scenes.js';

export const PROVISIONAL = true;
const freeze = o => {
  for (const v of Object.values(o)) if (v && typeof v === 'object') freeze(v);
  return Object.freeze(o);
};
export const PROGRESSION = freeze({
  route: {
    place: SCREEN_METERS,
    places: ROUTE.length,
    perDistrict: 4,
    finish: SCREEN_METERS * ROUTE.length,
  },
  physics: {
    dt: DT,
    gravity: GRAVITY,
    steepPenalty: STEEP_PENALTY,
    y0: 12,
    maxT: 180,
    eventMinY: 8,
  },
  // Dart beze změny z dnešního config.js, Glider přeladěný podle 08 (Pravidla Dílny).
  // Katalog modelů. Dart od začátku, Glider zdarma z Atlasu (atlas.gliderAt). Model s `price` je za mince: v nabídce od rekordu na začátek
  // místa `unlockPlace` (1–16), koupě = nabídka kind:'model'. Výchozí katalog = dnešní stav (žádný model za mince), návrh 01 je v MODEL_SETS.
  // Volitelná pole chování (research/obsah/01-game-design.md §2.9), chybějící = neutrální: perfectK (násobek vodorovného pushe při perfektu
  // místo push.perfect), missK (minutí ubere tento podíl vx), liftK (svislá část poryvu, páry a termiky ×), pushK (vodorovný push ×),
  // ground {below, glide} (pod `below` m klouzavost ×glide), skip (odrazů Stone Skip navíc, jen s bonusem), windK (vítr ×),
  // droneBurst (zásah dronu bez svislé části, push dronu ×droneBurst).
  models: {
    dart: { ...MODELS.dart },
    glider: { speed: 14, glide: 4, drag: 0.12, cruise: 11, ideal: 30, qte: 1.15 },
  },
  economy: {
    reward: { base: 10, perMeter: 0.1 }, // odměna za hod = base + floor(max(0, dolet)·perMeter)
    // Mailbag / Poštovní brašna (01 §2.11): koupený násobič „+X % mincí“, úroveň k v nabídce od rekordu na začátek místa unlockPlace[k] (příchod
    // do čtvrti 2/3/4), jen popořadě. Odměna = floor(základní odměna·(1 + min(M, capM))), M = koš všech „+X % mincí“ (dnes jen Mailbag).
    // on:false = Mailbag v nabídce není (výchozí, výsledky jako dřív), zapíná run.mjs --mailbag. Ceny zástupné z 01: round50(ΔM·R·H), H = horizont návratnosti v hodech.
    mailbag: {
      on: false,
      levels: [0.1, 0.1, 0.1],
      prices: [500, 800, 900],
      unlockPlace: [5, 9, 13],
      H: [30, 30, 26],
      capM: 0.5,
    },
  },
  workshop: {
    power: { prices: [50, 160, 350], step: 0.14 }, // 08: ceny 40/120/260
    folds: { prices: [50, 160, 350], steady: 0.3, window: 0.25, push: 0.2 }, // 08: 40/120/260, steady .25, window .15; F3 window .20
    // π = 1 + Σ steps; 4 druhy papíru po 3 úrovních, druh k se otevře prvním doletem do čtvrti k.
    // 08: ceny 100/180/300 | 650/900/1150 | 1900/2400/2900 | 3500/4100/4700, kroky .65 | .80 | .75 | .85 (π 10,15)
    // F5: Kraft levný a slabší (D1 bez „šetření na Kraft“), Washi a Neon silnější a dražší; F3: ceny 180/320/520 | 1210/1600/1980 | 3360/4080/4800 | 2640/3190/3740, kroky .62 | .70 | .66 | .64
    paper: {
      prices: [180, 320, 520, 500, 800, 1100, 2800, 3600, 4400, 3200, 3800, 4400],
      steps: [0.62, 0.62, 0.62, 0.45, 0.45, 0.45, 0.7, 0.7, 0.7, 0.85, 0.85, 0.85],
      perTier: 3,
      openAtPlace: 3,
    }, // rozhodnutí 14. 10. (06): druh k+1 se otevře doletem na 3. místo čtvrti k (1–4); 5 = hranice další čtvrti jako v 08 // π 2,86 / 4,21 / 6,31 / 8,86 (F3: 2,86 / 4,96 / 6,94 / 8,86)
  },
  atlas: {
    // pořadí = místa 1..16; glider a encore nemají úrovně
    bonuses: [
      'glider',
      'chain',
      'pinwheel',
      'steam',
      'tape',
      'crane',
      'skip',
      'gull',
      'momentum',
      'thermal',
      'echo',
      'star',
      'drone',
      'paperCrane',
      'onAir',
      'encore',
    ],
    unlevelled: ['glider', 'encore'],
    gliderAt: 100,
    prices: [
      [40, 90],
      [170, 340],
      [500, 1000],
      [500, 1000],
    ], // [úr. 2, úr. 3] podle čtvrti místa; 08: 50/100, 200/400, 450/900, 750/1500; F3: D3 600/1200, D4 480/960
    crane: 1.5, // y0 +1,5 m za úroveň (08: 2)
    gull: { carry: [0.2, 0.35, 0.5], push: [0.1, 0.15, 0.22] }, // F3: push úr. 3 .20
    tape: [0.3, 0.5, 0.75], // 08: .25/.40/.55; F3: .30/.45/.60 (úr. 3 teď víc než částečný zásah, kvůli slabému SKILLS)
    skip: { keep: [0.3, 0.45, 0.45], bounces: [1, 1, 2], vy: 3.0, minVx: 1.75, chainVx: 0.5 }, // minVx: první dotek (08: .5, oprava 3 z F2); vy 08: 2,2
    momentum: { step: [0.004, 0.014, 0.022], cap: [0.04, 0.12, 0.18] }, // 08: .02/.03/.04, strop .30/.35/.40; F3: .008/.018/.028, strop .08/.18/.25
    onAir: { beta: [0.1, 0.15, 0.2], combo: 3 }, // 08: .08/.12/.16
    echo: { share: [0.1, 0.4, 0.5], delay: 0.6 }, // 08: .4/.6/.8; F3: .25/.5/.75 (perfekt termiky přidal Echu)
    paperCrane: { reach: [0.03, 0.05, 0.08] }, // podíl šířky místa (oprava 2 z F2): 9 / 15 / 24 m
    pinwheel: {
      rerolls: [1, 2, 3], // 08: 1/2/2
      noHeadwind: [false, false, true],
    },
    chain: [
      { step: 0.1, max: 4 },
      { step: 0.13, max: 5 },
      { step: 0.21, max: 5 },
    ], // 08: .08×4, .10×4, .12×5; F3 úr. 3 .17
  },
  combo: { step: 0.05, max: 3, success: 1, perfect: 2, partial: 1, star: 2 },
  caps: { E: 2.0, beta: 0.5 }, // 08: E 1,5 (s čísly 08 nedosažitelný strop; pojistka, oprava 5 z F2)
  push: { base: 1.5, perfect: 1.25, scaleWithPace: true },
  events: {
    timing: { ...TIMING },
    maxEvents: 12,
    firstAt: 1.5,
    earlyGap: 3,
    earlyCount: 3,
    gapMin: 4,
    gapSpread: 3,
    gapScale: 1,
    effectMin: 1,
    retry: 0.25,
    earlyGrace: 0.12,
    weights: { gust: 2, bird: 2, steam: 1, thermal: 1, drone: 1 }, // steam/thermal/drone jen po odemčení v Atlasu
    gust: { dvy: 2, push: 1 },
    bird: { carry: 0.8, carryPerfect: 1.1, minVx: 10, minVy: 0.4, push: 1 },
    // nové události: silnější než v 08, aby ve směsi nesnižovaly dolet (06, oprava 4 obecně); 08 v komentáři
    steam: {
      firstPuff: 1.3,
      gapMin: 0.45,
      gapMax: 0.6,
      window: 0.9,
      lift: 1.6,
      pushFull: 2.4,
      pushPartial: 0.6,
      levelPush: 0.7,
      burst: { amp: 0.3, dur: 2, shape: 'flat' },
    }, // 08: window .6, lift 1, full 1.5, partial 0, level .3, burst .15
    thermal: {
      warning: 2,
      column: 0.65,
      core: 0.25,
      perfect: 0.08,
      /* perfect: ± s kolem středu jádra (rozhodnutí 14. 10.) */ dvy: 3.7,
      push: 3.0,
      half: 0.6,
      levelPush: 0.7,
      secondChance: 0.4,
      followGap: 0.3,
    }, // 08: core .175, dvy 3, push 1, half .5, level .3
    drone: { lead: 0.12, dvy: 3, push: 2.2, levelWindow: 1.3, pairChance: 0.5, followGap: 0.2 }, // 08: dvy 2,5, push 1,3, pair .35
    star: {
      chance: [0.08, 0.12, 0.16],
      window: 2,
      slotMin: 1,
      slotMax: 3,
      gap: 0.5,
      after: 0.5,
      burst: { amp: 1, dur: 4, shape: 'linear' },
    }, // 08: Starburst +40 %, slotMax 4 (sim.)
    floating: { gust: 0.25, birdMin: 0.6, birdMax: 0.95, rampFrom: 3, rampTo: 15, readNoise: 0.15 },
  },
  wind: {
    values: [-0.12, -0.08, -0.04, 0, 0.04, 0.08, 0.12],
    weights: [1, 2, 3, 3, 3, 2, 1],
    shear: 25,
  },
  swing: { zone: 0.09, peak: 1.15, gain: 1.05, fromThrow: 4 },
  pockets: {
    prices: [300, 5040], // 08: 600 / 3 500
    secondFromDistrict: 2,
    unlock: { cushion: 0, sharp: 0, dive: 1, calm: 1, whistle: 2, rocket: 2 },
    active: ['dive', 'cushion', 'whistle', 'rocket'],
    exclusive: [['sharp', 'calm']],
  },
  specials: {
    sharp: { window: 0.75, S: 1.45 },
    calm: { gap: 1.6, S: 1.6 }, // 08: sharp S 1,3, calm S 1,5
    // fromDiveOnly = oprava 1 z F2; 08: conv .45, lowConv .60, pásmo nízkého průletu 2–5 m
    dive: {
      maxSink: 2.2,
      /* F5 (výchozí 14. 10.: 3) */ /* strop rychlosti střemhlavu = násobek běžného klesání vx/glide (rozhodnutí 14. 10.), null = bez stropu */ fromDiveOnly: true,
      gravity: 3,
      accel: 2.2,
      conv: 0.36,
      lowConv: 0.74,
      /* F3: accel 2.4, conv .40, lowConv .78 */ low: [2, 7],
      keep: 0.6,
      waitMax: 2,
      lowBurst: { amp: 0.2, dur: 3, shape: 'flat' },
    },
    cushion: { maxY: 6, perfectY: 1, midY: 2.5, perfectT: 1.6, midT: 1.2, glide: 1.4, glideT: 1.5 },
    whistle: { uses: 1, minY: 8, window: 0.8 }, // 08: 3× za let; window = okna přivolané události (rozhodnutí 14. 10.)
    rocket: { charges: 2, amp: 1.4, tau: 1.5 }, // 08: amp 1 (vx += cruise)
  },
  warp: { factor: 1.4, ramp: 0.3, lookahead: 1 },
});
