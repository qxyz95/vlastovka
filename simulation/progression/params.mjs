// Všechna laditelná čísla nového systému progrese (návrh research/bonusy/08-navrh-kolo2.md).
// Logika v model/abilities/campaign čte jen odsud. run.mjs umí přepsat cokoli přes --params file.json nebo --set a.b=c.
// Výchozí hodnoty = sada doladěná ve fázi F5 (research/bonusy/12-ladeni2.md), F3 je v out/params-f3.json (10-ladeni.md). Původní čísla z 08 jsou v out/params-08.json
// a u změněných položek v komentáři „08:“.
import { DT, GRAVITY, STEEP_PENALTY, MODELS } from '../../src/config.js';
import { TIMING } from '../../src/events.js';
import { SCREEN_METERS, ROUTE } from '../../src/scenes.js';

const DEFAULTS = {
  // Trasa: 16 míst po šířce obrazovky (~304,8 m), 4 čtvrti po 4 místech. Cíl = konec 16. místa (4 876 m).
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
  time: { ui: 8, districtCard: 4 },
  // Profily = dnešní SKILLS z simulation/monte-carlo.mjs. qte = šum časování [s], bias ~ N(0,qte/2) na kampaň.
  profiles: {
    weak: { mu: 0.5, sigma: 0.12, angle: 5, qte: 0.22, react: 0.45 },
    average: { mu: 0.7, sigma: 0.1, angle: 3.5, qte: 0.14, react: 0.35 },
    good: { mu: 0.85, sigma: 0.07, angle: 2.5, qte: 0.09, react: 0.3 },
    expert: { mu: 0.95, sigma: 0.04, angle: 1.5, qte: 0.05, react: 0.25 },
    weakAssist: {
      mu: 0.5,
      sigma: 0.12,
      angle: 5,
      qte: 0.22,
      react: 0.45,
      assist: { window: 1.4, noise: 0.6, slow: 0.6 },
    }, // DQ-13
    auto: { mu: 0.5, sigma: 0.12, angle: 5, qte: 0.22, react: 0.45, auto: true }, // DQ-14
  },
  bots: {
    dive: { minY: 25, target: 5, maxUses: 3 },
    cushion: { target: 0.6 },
    rocket: { margin: 0.08, endY: 2.5 },
    whistle: { combo: 2 }, // dive 08/DQ-11: cíl 3,5 m, jednou za let (sim. F1)
    previewThrows: 1,
    modelExplore: 0.15,
    angleStart: 20,
    angleStep: [3, 6],
    pocketAuto: {
      weak: ['rocket', 'cushion'],
      average: ['rocket', 'calm'],
      good: ['dive', 'sharp'],
      expert: ['dive', 'sharp'],
      weakAssist: ['rocket', 'cushion'],
      auto: ['rocket', 'calm'],
    },
    pocketFallback: ['cushion', 'sharp'],
    fallbackThrows: 3, // záloha se nasadí jen při kladném náhledu na posledních hodech (F3)
    // realistický nákupčí (F3): odhad přínosu na minci s log-normální chybou, netrpělivost (nečeká na cíl déle než patience hodů)
    // preference viditelného: papír mění vzhled vlaštovky a má největší náhled, hráč mu dá o čtvrtinu větší váhu
    realistic: {
      noise: 0.5,
      patience: 6,
      kind: { workshop: 1, paper: 1.25, atlas: 1, pocket: 1, model: 1, mailbag: 1 },
    },
    // volba modelu 'preview' (náhled v Dílně, 01 §2.10); noise = log-normální chyba odhadu (0 = hráč náhledu věří přesně).
    // mode 'replay' (01 §2.10 bod 2): odhad z přehrání posledních `throws` hodů se současnou výbavou a stejnými výsledky QTE (perfekt / zásah /
    // minutí u každé události), úhel hodu posunutý o rozdíl ideálů, medián poměru doletu proti modelu v ruce. wind 'same' = vítr původního
    // hodu (01: „stejný seed, stejný vítr“), 'next' = známý vítr příštího hodu. mode 'passive' = náhled do 14. 10. (pasivní let bez událostí
    // s úhlem záměru modelu, silou mu a známým větrem).
    // wind 'both' (01 §2.10 bod 7): koupě a model v ruce podle 'same', na jeden hod model s windK ≠ 1 (Sail, Needle), když přehrání s větrem
    // příštího hodu dá aspoň o switchGain víc než model v ruce a |vítr| ≥ switchWind (řádek „This throw“ se ukáže jen od tohoto větru).
    modelPick: {
      noise: 0,
      mode: 'replay',
      throws: 5,
      wind: 'same',
      switchGain: 0.05,
      switchWind: 0.08,
    },
  },
  // fallback = čím se řídí paper-/atlas-/models-first a no-models mimo svou prioritu; no-models modely nekupuje, models-first šetří na model hned po odemčení
  // no-mailbag Mailbag nekupuje, mailbag-first šetří na další úroveň Mailbagu hned po jejím otevření (01 §2.11 „Mailbag napřed“)
  campaign: {
    maxThrows: 400,
    strategies: [
      'balanced',
      'realistic',
      'paper-first',
      'atlas-first',
      'cheapest',
      'random',
      'no-models',
      'models-first',
      'no-mailbag',
      'mailbag-first',
    ],
    fallback: 'realistic',
  },
  // Kousky (05 §4.5, ověření §4.6): podmínky detektorů jen v simulátoru (tricks.mjs), ve hře nejsou. Okna v s simulovaného času letu:
  // pigeonWindow puštění perfektního holuba → klepnutí perfektního poryvu, droneWindow mezi vyhodnocením dvou perfektních dronů,
  // lineWindow Paper Rocket před dopadem. ok = výsledky, které se počítají jako „úspěšně“ (All the Verbs, Needle).
  // v2 (05 §4.5, §4.6.2): Pigeon Express a Drone Ping-Pong = sousední běžné události (okno 99 = „hned další“ bez sekund), droneLevel = úroveň
  // Gates (drony) pro přísadu Drone Ping-Pong, whistleGap = pískání do tolika s od konce účinku (doneAt) předchozí perfektní události (Whistle Stop).
  tricks: {
    pigeonWindow: 1.5,
    droneWindow: 2,
    lineWindow: 1,
    wishCombo: 5,
    hawkRun: 3,
    kiteY: 40,
    sailWind: 0.08,
    needleDrones: 2,
    skimmerSkips: 2,
    ok: ['success', 'perfect'],
    droneLevel: 3,
    whistleGap: 1,
  },
  // Výbavy pro tabulku křivky (08 §2.4). atlas: úroveň každého bonusu; '*' = všechny odemčené na danou úroveň.
  curve: [
    { name: '1. hod (nic)', power: 0, folds: 0, paper: 0, atlas: {} },
    { name: 'po Power 1', power: 1, folds: 0, paper: 0, atlas: {} },
    { name: 'po Paper 1', power: 0, folds: 0, paper: 1, atlas: {} },
    { name: 'střed D1', power: 2, folds: 1, paper: 1, atlas: { chain: 1 } },
    { name: 'konec D1', power: 3, folds: 3, paper: 3, atlas: { chain: 2, pinwheel: 1, steam: 1 } },
    {
      name: 'konec D2',
      power: 3,
      folds: 3,
      paper: 6,
      atlas: { chain: 2, pinwheel: 1, steam: 2, tape: 2, crane: 2, skip: 2, gull: 2 },
    },
    {
      name: 'konec D3',
      power: 3,
      folds: 3,
      paper: 9,
      atlas: {
        chain: 3,
        pinwheel: 2,
        steam: 2,
        tape: 2,
        crane: 2,
        skip: 2,
        gull: 2,
        momentum: 2,
        thermal: 2,
        echo: 2,
        star: 1,
      },
    },
    {
      name: 'střed D4',
      power: 3,
      folds: 3,
      paper: 10,
      atlas: { '*': 3, encore: 0, paperCrane: 0, onAir: 0 },
    },
    { name: 'plná výbava', power: 3, folds: 3, paper: 12, atlas: { '*': 3 } },
    { name: 'plná bez Atlasu', power: 3, folds: 3, paper: 12, atlas: {} },
    { name: 'plná, kluzák', model: 'glider', power: 3, folds: 3, paper: 12, atlas: { '*': 3 } },
  ],
  // Cíle 08 §10.2 (run.mjs je porovná a označí OK/FAIL).
  targets: {
    throwsPerDistrict: [
      [25, 35],
      [20, 30],
      [20, 30],
      [20, 30],
    ],
    minutesPerDistrict: [
      [12, 18],
      [10, 16],
      [12, 18],
      [14, 20],
    ],
    totalMinutes: [50, 75],
    weakFinishWithin: 250,
    weakVsAverage: 1.4,
    expertVsAverage: 0.7,
    expertVsWeak: [0.6, 0.75],
    flightMedian: [22, 27, 30, 35],
    flightP90: 45,
    flightMax: 60,
    droughtMedian: 4,
    droughtMax: 8,
    droughtStat: 'p90',
    placeGapMedian: 8,
    placeGapP90: 14,
    pocketSpread: 0.08,
    diveCrash: { weak: 0.15, expert: 0.03 },
    diveHigh: 0.02,
    paperFirst: 0.1,
    atlasFirst: 0.2,
    atlasBonus: [0.03, 0.15],
    capE: 0.2,
    capBeta: 0.25,
    gliderShare: [0.3, 0.7],
    firstPocket: [20, 40],
    levelsBought: [0.6, 0.85],
    skipRate: [0.3, 0.5], // 06, oprava 3: Stone Skip na úr. 3 zhruba ve 30–50 % letů
    reference: 'realistic', // referenční nákupčí pro délku hry, kapsy a srovnání strategií (F3, AUDIT #37)
    // Mailbag (01 §2.11, §6.1 B10 a B17): příjem s Mailbagem ≤ income× bez něj, hody na další koupi ≥ toGo× běhu bez něj, „Mailbag napřed“
    // nejvýš o first rychlejší než reference, úroveň III vrácená do finále do payback podílu zbývajících hodů. Jen když běh Mailbag má.
    mailbag: { income: 1.2, toGo: 0.85, first: 0.08, payback: 0.7 },
    // Kousky (05 §4.6), jen když běh detekuje kousky: výskyt bez záměru (vzácný < rare, zdravý healthy, samozřejmý > obvious), se záměrem
    // ≥ intentMin a ≥ intentRatio× (< chance× = náhoda), 1. provedení medián v first (> firstRare nebo nikdy u > never kampaní = vzácný,
    // ≤ firstObvious = samozřejmý), expert / slabý ≤ expertWeak (> expertWeakRare = jen test perfektnosti); kousky modelů: hody s modelem
    // do 1. provedení medián ≤ model[0], P90 ≤ model[1] (01 §6.1 bod 15). Systém: 1. kousek do firstTrick (medián průměrného), nalezeno
    // found (průměrný) / ≥ foundWeak (slabý) z 13, korelace > corr = tentýž čin, brána gate zdravých z 8.
    tricks: {
      rare: 0.01,
      healthy: [0.02, 0.2],
      obvious: 0.25,
      intentMin: 0.08,
      intentRatio: 1.5,
      chance: 1.2,
      first: [3, 25],
      firstRare: 40,
      firstObvious: 1,
      never: 0.5,
      expertWeak: 4,
      expertWeakRare: 5,
      model: [5, 15],
      firstTrick: 15,
      found: [0.4, 0.75],
      foundWeak: 0.25,
      corr: 0.8,
      gate: 6,
      // v2 (05 §4.6, doplněno 14. 10.): výskyt v žádné čtvrti s přísadami > obvious (aspoň districtMin letů ve čtvrti), φ vypsat pro dvojice nad corrList;
      // gateBy 'class' (rozhodnutí uživatele 14. 10., konec 06) = podle třídy: dovednost zdravou četností a poměrem expert / slabý (≥ skillEW
      // zdravý, < skillChance náhoda), pestrost jen četností, volba záměrem; 'intent' = záměr u všech kousků (brána 1. běhu).
      // Postavit: při ≥ gate zdravých systém, při gateMin..gate−1 jen zdravé + kousky modelů, pod gateMin §4.7 (jen kousky modelů).
      districtMin: 30,
      corrList: 0.5,
      gateBy: 'class',
      skillEW: 1.3,
      skillChance: 1,
      gateMin: 4,
    },
  },
};

// Sady profilů (AUDIT F2 §3.2): skills = SKILLS beze změny (základ ladění), x2 = šum časování ×2 (povinně hlídaná robustní sada),
// lapse = SKILLS + výpadek pozornosti (hráč na událost vůbec nezareaguje), jen informativně.
const qte2 = k =>
  Object.fromEntries(
    Object.entries(DEFAULTS.profiles).map(([p, v]) => [p, { qte: +(v.qte * k).toFixed(3) }]),
  );
export const PROFILE_SETS = {
  skills: {},
  x2: { profiles: qte2(2) },
  lapse: {
    profiles: {
      weak: { lapse: 0.12 },
      average: { lapse: 0.07 },
      good: { lapse: 0.04 },
      expert: { lapse: 0.02 },
      weakAssist: { lapse: 0.12 },
    },
  },
};
// Sady cílů (run.mjs --targets). t90 = pásma kampaně na 90 min z research/obsah/05-plan-90-minut.md §7.2 (průměrný SKILLS, realistic,
// volba modelu preview podle 01 §6.1). Klíče, které výchozí cíle nemají, hodnotí checks jen s touto sadou; metriky, které simulátor
// neumí (zastávky, varianty událostí, fronta novinek), vypíše jako NOT ASSESSED (notAssessed).
// droughtA = sucho bez novinky (A) z toho, co simulátor zná: nové místo, Glider, koupě modelu, první setkání s typem události, první nasazení
// speciálu, nový kousek (s --tricks); droughtP90 = P90 sucha bez nákupu ani novinky; repeat = podíl poryvu + holuba mezi QTE po čtvrtích;
// buyGap = hody mezi nákupy (medián po čtvrtích, P90).
export const TARGET_SETS = {
  default: {},
  t90: {
    targets: {
      throwsPerDistrict: [
        [34, 46],
        [36, 48],
        [37, 49],
        [36, 48],
      ],
      minutesPerDistrict: [
        [14, 20],
        [18, 24],
        [21, 27],
        [23, 29],
      ],
      totalMinutes: [82, 98],
      totalThrows: [150, 185],
      weakFinishWithin: 250,
      weakVsAverage: 1.35,
      weakVsAverageStat: 'minutes',
      expertVsAverage: 0.69,
      droughtA: { median: 3, p90: 6, maxP90: 12 },
      droughtP90: 5,
      placeGapMedian: 11,
      placeGapP90: 17,
      repeat: [0.95, 0.6, 0.6, 0.6],
      buyGap: { median: [1, 2, 2, 2], p90: 4 },
      model: 'preview',
      notAssessed: true,
    },
  },
};
// Sady modelů za mince (run.mjs --modelset). obsah01 = zástupná čísla z research/obsah/01-game-design.md §2.2–2.6 a §2.8.
// drag 01 uvádí jen u Needle, ostatní mají .12 jako Dart a Glider (stejně jako sonda 04 §3.2).
export const MODEL_SETS = {
  none: {},
  obsah01: {
    models: {
      hawk: {
        speed: 17,
        glide: 3.0,
        drag: 0.12,
        cruise: 11,
        ideal: 34,
        qte: 1.0,
        perfectK: 1.6,
        missK: 0.06,
        unlockPlace: 4,
        price: 400,
      },
      kite: {
        speed: 12,
        glide: 4.6,
        drag: 0.12,
        cruise: 8,
        ideal: 40,
        qte: 1.1,
        liftK: 1.6,
        pushK: 0.6,
        unlockPlace: 6,
        price: 700,
      },
      skimmer: {
        speed: 21,
        glide: 2.8,
        drag: 0.12,
        cruise: 12,
        ideal: 10,
        qte: 0.9,
        ground: { below: 6, glide: 1.7 },
        skip: 1,
        unlockPlace: 8,
        price: 1000,
      },
      sail: {
        speed: 15,
        glide: 4.2,
        drag: 0.12,
        cruise: 10,
        ideal: 26,
        qte: 0.9,
        windK: 2.5,
        unlockPlace: 10,
        price: 1400,
      },
      needle: {
        speed: 24,
        glide: 2.6,
        drag: 0.08,
        cruise: 14,
        ideal: 12,
        qte: 0.9,
        windK: 0.4,
        droneBurst: 1.5,
        unlockPlace: 14,
        price: 2000,
      },
    },
  },
};

const clone = o => JSON.parse(JSON.stringify(o));
export let P = clone(DEFAULTS);
export const defaults = () => clone(DEFAULTS);
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
export function merge(target, src) {
  for (const [k, v] of Object.entries(src))
    isObj(v) && isObj(target[k]) ? merge(target[k], v) : (target[k] = clone(v));
  return target;
}
// Přepíše parametry na místě (sdílený objekt P vidí všechny moduly). reset=true začne od výchozích.
export function setParams(over = {}, reset = true) {
  if (reset) {
    for (const k of Object.keys(P)) delete P[k];
    Object.assign(P, clone(DEFAULTS));
  }
  merge(P, over);
  return P;
}
// "a.b.c=1.2" → {a:{b:{c:1.2}}}; hodnota se čte jako JSON, jinak jako text.
export function parseSet(s) {
  const [path, raw] = s.split('=');
  let v;
  try {
    v = JSON.parse(raw);
  } catch {
    v = raw;
  }
  const o = {};
  path.split('.').reduce((a, k, i, ks) => (a[k] = i === ks.length - 1 ? v : {}), o);
  return o;
}
