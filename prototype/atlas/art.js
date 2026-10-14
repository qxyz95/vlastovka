// Zástupné komiksové pohlednice (fáze 1 z návrhu §6.5): SVG siluety podle kind, posterizované nebe, tuš, půltón jen na stínové straně dominanty.
// Fáze 2 je nahradí snímky z 3D (assets/atlas/<placeId>.webp). Barvy podle stylové bible research/design/02-styl.md (kap. 2.3, 3, 7):
// nebe, mlha, okna, slunce a měsíc pohlednice místa i = src/render3d/mood.js MOOD_KEYS[i] (opsané, prototyp neimportuje ze src/; Core 12–15 už s tyrkysovým obzorem z bible),
// stěny a zem = src/render3d/palette.js city (Docks podle svět §2.2, bible R6), stopa = mood.trail 2. místa čtvrti. Identitu čtvrti bez barvy nese název a silueta dominanty.
export const INK = '#15101f',
  PAPER = '#ffffff',
  GOLD = '#ffd166';
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => {
  const x = hex(a),
    y = hex(b);
  return (
    '#' +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * k)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
};
// místa 0–15 (pořadí = KINDS = src/scenes.js ROUTE): sky [4 pásy shora k obzoru], fog, win (svítící okna), moon / sun [barva, halo] jen když jsou v mood.js nad obzorem, stars = mood.night ≥ 0,6
const T = (sky, fog, win, o = {}) => ({ sky, fog, win, ...o });
const PLACE = [
  T(['#3a2a7a', '#7a4fb8', '#ff9ec4', '#ffc58a'], '#8a64b8', '#ffd27a'),
  T(['#35287a', '#7048b0', '#f08cc0', '#ffb88a'], '#8060b0', '#ffd27a'),
  T(['#302474', '#6242a8', '#de80c0', '#ffa09a'], '#7a5cb0', '#ffd27a'),
  T(['#24226e', '#3f4ca4', '#8a80d2', '#e090b8'], '#4a5a9a', '#ffc070', { moon: '#f4f8ff' }),
  T(['#16306a', '#1e5a96', '#4f96d0', '#94c8f0'], '#33608e', '#ffb347', {
    moon: '#f4f8ff',
    stars: 1,
  }),
  T(['#14306c', '#1e5c9a', '#5098d2', '#9ccef2'], '#32608e', '#ffb347', {
    moon: '#f4f8ff',
    stars: 1,
  }),
  T(['#143270', '#22609e', '#5c9cd4', '#a8d4f4'], '#3a6a98', '#ffb347', {
    moon: '#ffffff',
    stars: 1,
  }),
  T(['#1e3274', '#3c5eac', '#b48ab8', '#ffb478'], '#8a7aa8', '#ffb347', {
    moon: '#ffffff',
    sun: ['#ffe08a', '#ff9a50'],
  }),
  T(['#3e2c84', '#c8507a', '#ff9a4a', '#ffd27a'], '#e07a4a', '#ffd27a', {
    sun: ['#ffe89a', '#ff8a3d'],
  }),
  T(['#4a2884', '#e05a44', '#ffa048', '#ffd06a'], '#d86a4a', '#ffd27a', {
    sun: ['#ffe89a', '#ff7a3a'],
  }),
  T(['#4a2a8a', '#c8508a', '#ff8aa8', '#ffc0a0'], '#c8708a', '#ffd27a', {
    sun: ['#ffd0a0', '#ff6a8a'],
  }),
  T(['#2a226e', '#5a3a9e', '#b46aa8', '#ff9e8a'], '#7a5098', '#ffe0a0'),
  T(['#1c1c52', '#353c9e', '#2aa99c', '#7ff0d8'], '#33206a', '#ffe14d', { stars: 1 }),
  T(['#18184c', '#303a98', '#2aa99c', '#7ff0d8'], '#301e66', '#ffe14d', { stars: 1 }),
  T(['#141444', '#283a90', '#2aa99c', '#7ff0d8'], '#2c1c62', '#ffe14d', { stars: 1 }),
  T(['#1e2058', '#363e9c', '#2aa99c', '#7ff0d8'], '#3a2a70', '#ffe14d', { stars: 1 }),
];
// čtvrti: body = stěna dominanty, shade = tón 0 (ztmavení tuší), ground = zem, accent = protisvětlo (mood.rim), route = stopa (mood.trail), sky = 2. místo čtvrti (rám a portrét)
const DIST = [
  { id: 'violet', body: '#8f6ad8', ground: '#4b3778', accent: '#ff6fb5', route: '#ff8ccf' },
  { id: 'docks', body: '#215a8c', ground: '#10294a', accent: '#ffb347', route: '#5ce6ff' },
  { id: 'horizon', body: '#63384e', ground: '#342b38', accent: '#ffc35a', route: '#ffd23f' },
  { id: 'core', body: '#44214e', ground: '#101a2c', accent: '#5cf2ff', route: '#ff4f9e' },
];
export const PAL = DIST.map((p, d) => ({
  ...p,
  shade: mix(p.body, INK, 0.45),
  sky: PLACE[d * 4 + 1].sky,
}));
const R = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const P = (...pts) => 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
const house = (x, b, w, h) =>
  `M${x} ${b}V${b - h * 0.62}L${x + w / 2} ${b - h}L${x + w} ${b - h * 0.62}V${b}Z`;
const C = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const G = 96; // horizont / zem
// každý druh: body (tělo dominanty), shade (stínová strana, půltón), lit (svítící okna / akcent), line (tenké čáry tuší)
const KINDS = {
  roofs: () => ({
    body:
      house(6, G, 30, 28) +
      house(38, G, 34, 40) +
      R(54, 40, 7, 14) +
      house(76, G, 28, 24) +
      house(108, G, 46, 52),
    shade: R(56, 58, 16, 38) + R(132, 64, 22, 32),
    lit: R(118, 66, 12, 10) + R(46, 70, 7, 7) + R(86, 80, 6, 6),
    line: 'M114 66h20M124 66v10',
  }),
  market: () => ({
    body:
      R(26, 26, 4, 46) +
      R(18, 34, 20, 3) +
      R(70, 14, 4, 58) +
      R(60, 22, 24, 3) +
      R(112, 30, 4, 42) +
      R(104, 38, 20, 3) +
      P([8, G], [14, 74], [48, 74], [54, G]) +
      P([56, G], [62, 72], [98, 72], [104, G]) +
      P([106, G], [112, 76], [146, 76], [152, G]),
    shade: P([36, G], [48, 74], [54, G]) + P([86, G], [98, 72], [104, G]),
    lit:
      C(20, 64, 3) +
      C(40, 60, 3) +
      C(60, 58, 3) +
      C(80, 57, 3) +
      C(100, 58, 3) +
      C(120, 61, 3) +
      C(140, 65, 3),
    line: 'M10 66Q40 54 70 58T150 66',
  }),
  garden: () => ({
    body:
      R(86, 46, 4, 50) +
      P([88, 46], [88, 22], [104, 40]) +
      P([88, 46], [112, 46], [96, 62]) +
      P([88, 46], [88, 70], [72, 52]) +
      P([88, 46], [64, 46], [80, 30]) +
      'M6 96q10-18 22 0q10-16 22 0Z' +
      'M112 96q10-16 20 0q8-14 20 0Z' +
      R(28, 74, 26, 22) +
      P([24, 74], [41, 62], [58, 74]),
    shade: P([88, 46], [112, 46], [96, 62]) + P([88, 46], [64, 46], [80, 30]) + R(44, 74, 10, 22),
    lit: R(34, 80, 8, 7),
    line: '',
  }),
  rail: () => ({
    body:
      R(30, 62, 70, 26) +
      R(92, 48, 26, 40) +
      R(42, 46, 10, 16) +
      R(100, 40, 26, 10) +
      R(118, 66, 30, 22),
    shade: R(30, 78, 118, 10) + R(92, 48, 8, 40),
    lit: R(100, 54, 12, 8) + R(124, 70, 8, 6) + R(136, 70, 8, 6),
    line: 'M0 96h160M20 90h120',
    circ: [
      [44, 90, 6],
      [64, 90, 6],
      [84, 90, 6],
      [110, 90, 6],
    ],
    puff: [
      [47, 34, 8],
      [60, 24, 6],
    ],
  }),
  warehouse: () => ({
    body: 'M4 96V56l20-12v12l20-12v12l20-12v12l20-12v12l20-12V96Z' + R(112, 70, 40, 26),
    shade: 'M84 96V56l20-12V96Z' + R(112, 84, 40, 12),
    lit: R(16, 70, 12, 10) + R(56, 70, 12, 10),
    line: 'M112 70l40 26M152 70l-40 26',
    text: [[132, 66, 'FRAGILE']],
  }),
  cranes: () => ({
    body:
      R(30, 30, 6, 66) +
      R(14, 26, 70, 5) +
      R(100, 18, 6, 78) +
      R(92, 14, 62, 5) +
      R(54, 62, 26, 14) +
      R(120, 70, 30, 16) +
      R(36, 32, 10, 8),
    shade: R(54, 70, 26, 6) + R(120, 80, 30, 6),
    lit: R(38, 33, 6, 5),
    line: 'M66 31v31M136 19v51',
  }),
  bridge: () => ({
    body: R(0, 76, 160, 6) + R(36, 30, 8, 66) + R(112, 30, 8, 66),
    shade: R(0, 82, 160, 4),
    lit: C(20, 72, 1.6) + C(56, 62, 1.6) + C(80, 58, 1.6) + C(104, 62, 1.6) + C(140, 72, 1.6),
    line: 'M0 72Q40 76 40 32Q78 70 116 32Q120 76 160 72M60 64v12M80 66v10M100 64v12',
    water: 1,
  }),
  lighthouse: () => ({
    body:
      P([70, G], [76, 36], [96, 36], [102, G]) +
      R(70, 28, 32, 8) +
      R(76, 16, 20, 12) +
      P([74, 16], [86, 6], [98, 16]) +
      R(104, 86, 56, 10),
    shade: P([88, G], [90, 36], [96, 36], [102, G]),
    lit: R(80, 19, 12, 8),
    beam: P([92, 22], [160, 4], [160, 40]),
    line: 'M76 56h20M74 74h24',
    water: 1,
  }),
  fields: () => ({
    body:
      R(96, 56, 40, 40) +
      P([92, 58], [116, 40], [140, 58]) +
      R(28, 40, 4, 40) +
      P([30, 40], [30, 22], [40, 34]) +
      P([30, 40], [48, 40], [38, 48]) +
      P([30, 40], [30, 58], [20, 46]) +
      P([30, 40], [12, 40], [22, 32]),
    shade: R(120, 58, 16, 38),
    lit: R(110, 74, 10, 10),
    line: 'M0 100h160M0 106h160M0 112h160',
    field: 1,
  }),
  turbines: () => ({
    body: R(34, 40, 3, 56) + R(84, 26, 4, 70) + R(130, 46, 3, 50) + P([30, 40], [40, 40], [36, 48]),
    shade: '',
    lit: C(35.5, 40, 2) + C(86, 26, 2.4) + C(131.5, 46, 2),
    line: 'M35.5 40l-14-22M35.5 40l26 2M35.5 40l-10 22M86 26l-16-26M86 26l30 4M86 26l-12 26M131.5 46l-12-20M131.5 46l22 2M131.5 46l-8 20',
    hill: 1,
  }),
  peaks: () => ({
    body: P([0, G], [48, 28], [86, 72], [112, 40], [160, G]),
    shade: P([48, 28], [86, 72], [64, G], [0, G]) + P([112, 40], [160, G], [132, G]),
    lit: P([48, 28], [40, 40], [48, 38], [56, 42]) + P([112, 40], [104, 52], [112, 50], [120, 54]),
    line: '',
    horn: 1,
  }),
  observatory: () => ({
    body: R(52, 62, 56, 34) + 'M52 62a28 28 0 0 1 56 0Z' + R(30, 80, 22, 16),
    shade: R(88, 62, 20, 34) + 'M80 34a28 28 0 0 1 28 28H80Z',
    lit: R(76, 36, 8, 26) + R(60, 74, 8, 8),
    line: 'M84 40l18-18',
    stars: [
      [20, 20],
      [40, 12],
      [128, 14],
      [146, 30],
      [118, 8],
    ],
  }),
  gate: () => ({
    body: 'M28 96V30h104v66h-24V58a28 28 0 0 0-56 0v38Z' + R(22, 24, 116, 8),
    shade: R(108, 32, 24, 64),
    lit: R(36, 38, 88, 8),
    line: '',
    text: [[80, 44.5, 'METROPOLIS']],
  }),
  terraces: () => ({
    body: R(8, 80, 144, 16) + R(24, 64, 112, 16) + R(42, 48, 76, 16) + R(60, 36, 40, 12),
    shade: R(120, 80, 32, 16) + R(112, 64, 24, 16) + R(100, 48, 18, 16),
    lit: R(16, 84, 8, 6) + R(34, 68, 8, 6) + R(52, 52, 8, 6) + R(72, 40, 8, 5),
    line: 'M8 28Q60 18 150 30M30 26v8M60 22v8M92 22v8M124 26v8',
    cranes: 1,
  }),
  tower: () => ({
    body:
      P([72, G], [78, 30], [82, 30], [88, G]) +
      R(76, 20, 8, 10) +
      R(78.5, 2, 3, 18) +
      R(4, 52, 30, 44) +
      R(126, 46, 30, 50),
    shade: P([80, 30], [82, 30], [88, G], [80, G]) + R(22, 52, 12, 44) + R(144, 46, 12, 50),
    lit: R(8, 58, 18, 14) + R(130, 52, 20, 16),
    line: '',
    rings: 1,
  }),
  port: () => ({
    body:
      'M16 40c0-12 24-18 56-18s52 6 52 18-20 18-52 18-56-6-56-18Z' +
      P([116, 40], [132, 28], [132, 52]) +
      R(128, 30, 4, 66) +
      R(0, 84, 160, 12) +
      R(54, 58, 26, 10) +
      R(70, 64, 18, 20) +
      'M70 64q9-8 18 0Z',
    shade: 'M16 40c0 12 24 18 56 18s52-6 52-18Z' + R(0, 90, 160, 6),
    lit: R(74, 68, 10, 4) + R(48, 86, 4, 4) + R(72, 86, 4, 4) + R(96, 86, 4, 4) + R(120, 86, 4, 4),
    line: 'M60 58v-4M84 58v-4',
    text: [[66, 42, 'THE SLOW ONE']],
  }),
};
const ORDER = Object.keys(KINDS);
const NIGHT = ['#0a0820', '#1a1450', '#2a2a70'];
const bands = (sky, h) => {
  const b = h / sky.length;
  return sky
    .map((c, i) => `<rect y="${i * b}" width="160" height="${b + 1}" fill="${c}"/>`)
    .join('');
};
const star = (x, y, c) => `<path d="M${x} ${y - 3}l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="${c}"/>`;
// mode: 'color' | 'silhouette' (teaser) ; frame 0–2: poloha vlaštovky pro smyčku tří snímků
export function postcard(kind, d, { mode = 'color', frame = -1, night = false, title = '' } = {}) {
  const p = PAL[d],
    q = PLACE[Math.max(0, ORDER.indexOf(kind))] ?? PLACE[d * 4 + 1],
    k = KINDS[kind](),
    sil = mode === 'silhouette';
  const sky = night ? NIGHT : q.sky,
    n = sky.length;
  let s = `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">`;
  if (title) s += `<title>${title}</title>`;
  // teaser: tušová silueta dominanty na ztlumeném nebi, bez vzoru (bible kap. 3, rozhodnutí 14. 10.)
  if (sil) {
    s += `<rect width="160" height="120" fill="${p.shade}"/><rect y="0" width="160" height="${G}" fill="${sky[n > 3 ? 1 : 0]}" opacity=".55"/>`;
    s += `<path d="${k.body}${k.circ ? k.circ.map(c => C(...c)).join('') : ''}" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect y="${G}" width="160" height="24" fill="${INK}"/>`;
    if (k.line) s += `<path d="${k.line}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
    return s + '</svg>';
  }
  // posterizované nebe: ostré pásy bez přechodového vzoru
  s += bands(sky, G);
  // slunce (3 kruhy: halo, kotouč, tuš) a měsíc
  if (!night && q.sun)
    s += `<circle cx="22" cy="${G - 24}" r="20" fill="${q.sun[1]}" opacity=".45"/><circle cx="22" cy="${G - 24}" r="13" fill="${q.sun[0]}" stroke="${INK}" stroke-width="2"/>`;
  // měsíc vlevo nahoře: dráha vlaštovky ve smyčce (frame 0–2) vede vpravo nahoru a bílý papír nesmí ležet na bílém měsíci (S1)
  if (night || (q.moon && !k.beam))
    s += `<circle cx="44" cy="20" r="11" fill="${night ? '#f4f8ff' : q.moon}" stroke="${INK}" stroke-width="2"/>`;
  if (k.stars || q.stars || night)
    for (const [x, y] of k.stars ?? [
      [14, 14],
      [74, 8],
      [110, 12],
      [142, 20],
    ])
      s += star(x, y, '#fff6c8');
  // vzdálená silueta města v barvě mlhy
  s += `<path d="M0 ${G}V80h12v-8h10v12h14v-16h8v10h16v-6h12v14h18v-10h10v6h14v-12h10v14h12v-8h12v16Z" fill="${q.fog}"/>`;
  if (k.beam) s += `<path d="${k.beam}" fill="${q.win}" opacity=".3"/>`;
  // zem: pole v protisvětle, voda z pásů nebe, jinak zem čtvrti
  s += `<rect y="${G}" width="160" height="${120 - G}" fill="${k.field ? mix(sky[n - 1], p.ground, 0.55) : k.water ? sky[1] : p.ground}" stroke="${INK}" stroke-width="2"/>`;
  if (k.water)
    s += `<path d="M8 104h22M50 110h30M100 104h26M130 114h20" stroke="${sky[2] ?? sky[n - 1]}" stroke-width="2"/>`;
  if (k.hill)
    s += `<path d="M0 ${G}Q60 70 160 ${G}Z" fill="${p.shade}" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<path d="${k.body}" fill="${p.body}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  // půltón jen na stínové straně dominanty
  if (k.shade)
    s += `<path d="${k.shade}" fill="${p.shade}"/><path d="${k.shade}" fill="url(#ht-ink)" opacity=".6"/>`;
  if (k.lit) s += `<path d="${k.lit}" fill="${q.win}" stroke="${INK}" stroke-width="1.2"/>`;
  if (k.circ)
    for (const c of k.circ)
      s += `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${p.accent}" stroke="${INK}" stroke-width="2"/>`;
  // pára pod jas papíru (bible kap. 5 bod 3)
  if (k.puff)
    for (const c of k.puff)
      s += `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${mix('#f3e6ff', q.fog, 0.4)}" stroke="${INK}" stroke-width="2"/>`;
  if (k.line)
    s += `<path d="${k.line}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  if (k.text)
    for (const [x, y, tx] of k.text)
      s += `<text x="${x}" y="${y}" font-size="6" font-weight="800" text-anchor="middle" fill="${INK}" font-family="Bahnschrift,Arial Narrow,sans-serif">${tx}</text>`;
  if (k.rings)
    s += `<path d="M66 18q14-8 28 0M60 12q20-12 40 0" fill="none" stroke="${p.accent}" stroke-width="2.5"/>`;
  if (k.cranes)
    for (const x of [30, 60, 92, 124])
      s += `<path d="M${x - 4} 38l4-4 4 4-4 2Z" fill="${PAPER}" stroke="${INK}" stroke-width="1"/>`;
  if (k.horn) s += `<path d="M100 92l40-8 4 6-6 2" fill="none" stroke="${INK}" stroke-width="3"/>`;
  // vlaštovka pro smyčku tří snímků (frame 0–2): papír s tuší, rychlostní čáry papír s tušovou linkou, za místem zlatá hvězda milníku
  if (frame >= 0) {
    const xs = [30, 74, 118],
      ys = [60, 46, 40],
      x = xs[frame],
      y = ys[frame];
    s += `<g transform="translate(${x} ${y}) rotate(${frame === 1 ? -14 : -4})"><path d="M-12 2L14 -2L-6 -8L-2 0Z" fill="${PAPER}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g>`;
    if (frame === 1) {
      const sl = `M${x - 24} ${y + 4}h10M${x - 26} ${y + 10}h8M${x - 22} ${y - 2}h6`;
      s += `<path d="${sl}" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="${sl}" stroke="${PAPER}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (frame === 2)
      s += `<g transform="translate(${x + 18} ${y - 12})"><path d="M0 -10l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="${GOLD}" stroke="${INK}" stroke-width="1.4"/></g>`;
  }
  return s + '</svg>';
}
// panorama čtvrti pro stav frame (tušová silueta na posterizovaném nebi 2. místa čtvrti, bez vzoru)
export function skyline(d) {
  const p = PAL[d];
  const shapes = [
    'M0 60V36h14l8-10 8 10h10v-8h6v8h18l10-12 10 12h14v-6h12v6h20l8-10 8 10h16v24Z',
    'M0 60V40h20v-16h4v16h26l4-20h4l4 20h30v-10h30v10h18V24h4v16h16v20Z',
    'M0 60l30-30 22 18 26-34 30 30 20-14 32 30Z',
    'M0 60V30h14V12h10v18h12V20h16v40h8V8h12v52h10V26h14v34h12V16h10v44h12V34h10v26Z',
  ];
  return `<svg viewBox="0 0 160 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">${bands(p.sky, 60)}<path d="${shapes[d]}" fill="${INK}"/></svg>`;
}
// sdílený vzor půltónu (vkládá se jednou do stránky): jen tuš, jen do stínu
export const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<pattern id="ht-ink" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${INK}"/></pattern>
</defs></svg>`;
// portrét postavy: tušová silueta na světlém pásu nebe čtvrti s jedním akcentem (svět §5.1)
export function portrait(d) {
  const p = PAL[d],
    ac = p.accent;
  const bodies = [
    'M14 44V26q0-8 8-8h8q8 0 8 8v18Z M20 10h12v8H20Z',
    'M12 44q0-16 14-16t14 16Z M18 18a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z',
    'M12 44q0-16 14-16t14 16Z M18 18a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z',
    'M8 24q18-10 36 0q-18 10-36 0Z M20 14h12v6H20Z',
  ];
  const acc = [
    'M23 13h2v2h-2ZM28 13h2v2h-2Z',
    'M16 30h20v4H16Z',
    'M30 12l8-6 2 3-8 5Z',
    'M14 24h4M34 24h4',
  ];
  return `<svg viewBox="0 0 52 48" aria-hidden="true" focusable="false"><rect width="52" height="48" fill="${p.sky[2]}"/><path d="${bodies[d]}" fill="${INK}"/><path d="${acc[d]}" fill="${ac}" stroke="${ac}" stroke-width="2"/></svg>`;
}
