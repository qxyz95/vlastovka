// Detektory kousků (research/obsah/05-plan-90-minut.md §4.5, ověření §4.6). Jen měření v simulátoru, ve hře nejsou.
// Kousek = čistá podmínka nad záznamem jednoho letu (f po fly: události s result / resolvedAt / comboBefore, echoes se src, stats.rocketT,
// stats.maxY, stats.skips, w, kit). has(kit) = hráč má v tomto letu přísady. intent = politika bota se záměrem (05 §4.6), null = simulátor
// nemá páku, záměr je NOT ASSESSED. cls = třída (05 §4.5): volba / dovednost / pestrost. cap(f) = strop výskytu (událost, bez níž kousek
// nejde, nastala bez ohledu na známky). note = kde simulátor kousek nemodeluje věrně. Katalog v2 (05 §4.6.2), Steam Organ vyřazen.
import { P } from './params.mjs';
import { lv } from './model.mjs';

const done = f =>
  f.events
    .filter(e => e.result && e.result !== 'interrupted')
    .sort((a, b) => a.resolvedAt - b.resolvedAt);
const regular = f => done(f).filter(e => e.type !== 'star');
const ok = e => P.tricks.ok.includes(e.result);
const hasModel = id => kit => (kit.model ?? 'dart') === id;
// nejkratší interval mezi vyhodnocením a vyhodnocením hned následující běžné události (pár a → b, obě perfekt), nebo null
const pairGap = (seq, ta, tb) => {
  let g = null;
  for (let i = 1; i < seq.length; i++) {
    const a = seq[i - 1],
      b = seq[i];
    if (a.type === ta && a.result === 'perfect' && b.type === tb && b.result === 'perfect') {
      const d = b.resolvedAt - a.resolvedAt;
      if (g == null || d < g) g = d;
    }
  }
  return g;
};
const pairSeen = (seq, ta, tb) =>
  seq.some((b, i) => i > 0 && seq[i - 1].type === ta && b.type === tb);
// Whistle Stop: přivolaná událost perfektně a předchozí běžná událost perfektně; časy od konce jejího účinku (doneAt) do pískání
const whistleGaps = f => {
  const s = done(f),
    out = [];
  for (const e of s) {
    if (!e.whistled || e.result !== 'perfect' || e.whistledAt == null) continue;
    const p = s.filter(x => x !== e && x.type !== 'star' && x.resolvedAt <= e.resolvedAt).at(-1);
    if (p?.result === 'perfect' && p.doneAt != null) out.push(e.whistledAt - p.doneAt);
  }
  return out;
};
const minOf = v => (v.length ? Math.min(...v) : null);

export const TRICKS = [
  {
    id: 'pigeonExpress',
    name: 'Pigeon Express',
    cls: 'dovednost',
    from: 1,
    has: () => true,
    intent: { pocket: 'whistle' },
    cap: f => pairSeen(regular(f), 'bird', 'gust'),
    diag: f => pairGap(regular(f), 'bird', 'gust'),
    detect: f => {
      const g = pairGap(regular(f), 'bird', 'gust');
      return g != null && g <= P.tricks.pigeonWindow + 1e-9;
    },
    note: 'holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv',
  },
  {
    id: 'kettleSong',
    name: 'Kettle Song',
    cls: 'volba',
    from: 4,
    has: kit => lv(kit, 'steam') > 0 && (kit.slots ?? []).includes('sharp'),
    intent: { pocket: 'sharp', second: true },
    detect: f => done(f).some(e => e.type === 'steam' && e.result === 'perfect'),
    note: 'pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy',
  },
  {
    id: 'overTheLine',
    name: 'Over the Line',
    cls: 'volba',
    from: 1,
    has: kit => (kit.slots ?? []).includes('rocket'),
    intent: { pocket: 'rocket' },
    replay: true,
    detect: (f, replay) => {
      const T = f.stats.touchT ?? [f.t],
        ts = (f.stats.rocketT ?? []).filter(t =>
          T.some(c => c >= t - 1e-9 && c - t <= P.tricks.lineWindow + 1e-9),
        );
      if (!ts.length || !replay) return false;
      const x0 = replay({ rocket: { offAfter: ts[0] } }).x,
        pl = P.route.place;
      return Math.floor(f.x / pl) > Math.floor(x0 / pl);
    },
    note: 'jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet',
  },
  {
    id: 'tapeSave',
    name: 'Tape Save',
    cls: 'dovednost',
    from: 5,
    has: kit => lv(kit, 'tape') > 0,
    intent: null,
    detect: f => {
      const s = regular(f);
      for (let i = 1; i < s.length; i++)
        if (s[i - 1].result === 'miss' && s[i].result === 'perfect') return true;
      return false;
    },
    note: 'záměr: hráč si minutí nevybírá, simulátor nemá páku',
  },
  {
    id: 'whistleStop',
    name: 'Whistle Stop',
    cls: 'volba',
    from: 9,
    has: kit => (kit.slots ?? []).includes('whistle'),
    intent: { pocket: 'whistle' },
    cap: f => done(f).some(e => e.whistled),
    diag: f => minOf(whistleGaps(f)),
    detect: f => whistleGaps(f).some(g => g <= P.tricks.whistleGap + 1e-9),
    note: 'přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí',
  },
  {
    id: 'wish',
    name: 'Wish',
    cls: 'dovednost',
    from: 12,
    has: kit => lv(kit, 'star') > 0,
    intent: null,
    cap: f => done(f).some(e => e.type === 'star'),
    detect: f =>
      done(f).some(
        e => e.type === 'star' && e.result !== 'miss' && e.comboBefore >= P.tricks.wishCombo,
      ),
    note: 'kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou',
  },
  {
    id: 'dronePingPong',
    name: 'Drone Ping-Pong',
    cls: 'dovednost',
    from: 13,
    has: kit => lv(kit, 'drone') >= P.tricks.droneLevel,
    intent: { pocket: 'whistle' },
    cap: f => pairSeen(regular(f), 'drone', 'drone'),
    diag: f => pairGap(regular(f), 'drone', 'drone'),
    detect: f => {
      const g = pairGap(regular(f), 'drone', 'drone');
      return g != null && g <= P.tricks.droneWindow + 1e-9;
    },
    note: 'dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů',
  },
  {
    id: 'allTheVerbs',
    name: 'All the Verbs',
    cls: 'pestrost',
    from: 13,
    has: kit => lv(kit, 'steam') > 0 && (lv(kit, 'thermal') > 0 || lv(kit, 'drone') > 0),
    intent: null,
    detect: f => {
      const s = done(f).filter(ok),
        t = new Set(s.map(e => e.type));
      return (
        (t.has('gust') || t.has('star')) &&
        t.has('bird') &&
        t.has('steam') &&
        (t.has('thermal') || t.has('drone'))
      );
    },
    note: 'tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku',
  },
  // kousky modelů = podmínky podpisových skinů K6–K10 (01 §3.2)
  {
    id: 'hawkFeather',
    cls: 'volba',
    name: 'Hawk: 3 perfekty za sebou',
    model: 'hawk',
    has: hasModel('hawk'),
    intent: { model: 'hawk' },
    detect: f => {
      let run = 0;
      for (const e of regular(f)) {
        run = e.result === 'perfect' ? run + 1 : 0;
        if (run >= P.tricks.hawkRun) return true;
      }
      return false;
    },
    note: 'hvězda řadu nepřerušuje ani nepočítá',
  },
  {
    id: 'kiteTail',
    cls: 'volba',
    name: 'Kite: perfekt termiky nebo 40 m',
    model: 'kite',
    has: hasModel('kite'),
    intent: { model: 'kite' },
    detect: f =>
      f.stats.maxY >= P.tricks.kiteY ||
      done(f).some(e => e.type === 'thermal' && e.result === 'perfect'),
  },
  {
    id: 'skimmerRipples',
    cls: 'volba',
    name: 'Skimmer: dvojitý odraz',
    model: 'skimmer',
    has: hasModel('skimmer'),
    intent: { model: 'skimmer' },
    detect: f => f.stats.skips >= P.tricks.skimmerSkips,
  },
  {
    id: 'sailStripes',
    cls: 'volba',
    name: 'Sail: zadní vítr',
    model: 'sail',
    has: hasModel('sail'),
    intent: { model: 'sail', wind: true },
    detect: f => f.w >= P.tricks.sailWind - 1e-9,
  },
  {
    id: 'needleThread',
    cls: 'volba',
    name: 'Needle: drony (needleDrones)',
    model: 'needle',
    has: hasModel('needle'),
    intent: { model: 'needle' },
    detect: f => done(f).filter(e => e.type === 'drone' && ok(e)).length >= P.tricks.needleDrones,
  },
];
export const trickById = Object.fromEntries(TRICKS.map(t => [t.id, t]));
// --intents all = kousky třídy volba (05 §4.6.2: Over the Line, Kettle Song, Whistle Stop a kousky modelů); boti dovednosti jdou jen jmenovitě
export const intentTricks = () => TRICKS.filter(t => t.intent && t.cls === 'volba').map(t => t.id);

// Kousky jednoho letu: bitové masky přísad, provedení a stropu (pořadí TRICKS) a diagnostika intervalů.
// replay(bot) = stejný hod s přepsanými boty (protifaktický let Over the Line), volá se jen při výstřelu v posledním okně.
export function detectTricks(f, replay) {
  let ing = 0,
    hit = 0,
    cap = 0;
  const diag = {};
  TRICKS.forEach((t, i) => {
    if (!t.has(f.kit)) return;
    ing |= 1 << i;
    if (t.detect(f, replay)) hit |= 1 << i;
    if (t.cap?.(f)) cap |= 1 << i;
    if (t.diag) {
      const g = t.diag(f);
      if (g != null) diag[t.id] = g;
    }
  });
  return { ing, hit, cap, diag };
}
