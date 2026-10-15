// 2D UI vrstva nad 3D scénou (canvas #game, logická šířka 640 přes setTransform, výška podle poměru stran). Čisté vůči kontextu: dostane ctx 2D, testy s falešným ctx.
// Vlastní R2. QTE kruh 1:1 z render.js, štítky událostí (dřív atmosphere.js), částice, popupy a záblesk (dřív fx-render.js), rychlostní čáry
// (themes-verse.js), mířidla (dřív natvrdo v ui.js), uiScale pro mobil. Barvy jen z palette.js.
// plan = {t, view:{cam,px,py,ground,k}, fx:fxMap(...), ui:{qte, aim:{angle(°),held,charge}, labels:[eventView(e,t)], reduced, uiScale}}.
import { activeEvent } from '../events.js';
import { PAPIR } from './palette.js';
import { eventView } from './events-view.js';
import { fxMap, gustStrips, scrapAngle, scrapTone, SCRAP } from './fx-map.js';
import { t } from '../i18n.js';
import {
  ringZoom,
  RING_WARN_ALPHA,
  BURST_UI,
  burstDash,
  COMBO_UI,
  comboLinks,
  effectiveVx,
} from './event-fx.js';
// Papír (P3, bible 05 kap. 7, 8, 11): QTE mezikruží krémové se stínem zvednutého papíru, štítky a popupy jako natočené papírové štítky,
// mířidla grafitová na krémové kartě, rychlostní čáry tenké grafitové, jiskry jako útržky papíru, poryv jako proužky.
const TAU = Math.PI * 2,
  AIM_VIEW = { cam: 0, px: 148, py: 258, ground: 300, k: 1 },
  DEG = Math.PI / 180;
const rgba = (h, a) =>
  `rgba(${[1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;
// Stín zvednutého papíru {color,alpha,blur,dx,dy} v logických px; shadow* canvasu jsou v px zařízení, proto × měřítko transformace.
export function lift(c, sh) {
  const m = c.getTransform?.(),
    k = m ? Math.hypot(m.a, m.b) : 1;
  c.shadowColor = rgba(sh.color, sh.alpha);
  c.shadowBlur = sh.blur * k;
  c.shadowOffsetX = sh.dx * k;
  c.shadowOffsetY = sh.dy * k;
}
// ── Převod souřadnic (U5, 02-ux §1.5). Smlouva view() a plan dává polohy v logických 640 × 360 jako podíl šířky a výšky plátna
// (px/640, py/360), i když plátno přes celé okno nemá 16 : 9. UI vrstva kreslí rovnoměrně: šířka 640, výška 640 / poměr stran.
export const VIEW = Object.freeze({ w: 640, h: 360, aspect: 16 / 9 });
export const layerHeight = (aspect = VIEW.aspect) => VIEW.w / (aspect > 0 ? aspect : VIEW.aspect);
// Logické (640 × 360) → CSS px plátna {width, height} a zpět.
export const viewToCss = ({ px, py }, { width, height }) => ({
  x: (px / VIEW.w) * width,
  y: (py / VIEW.h) * height,
});
export const cssToView = ({ x, y }, { width, height }) => ({
  px: width > 0 ? (x * VIEW.w) / width : 0,
  py: height > 0 ? (y * VIEW.h) / height : 0,
});
// Úhel míření (°) z bodu ukazatele {x,y} v CSS px plátna k vlaštovce view, ve skutečných (rovnoměrných) px, omezený na [min, max].
export function aimAngleAt(point, view, size, [min, max] = [5, 40]) {
  const o = viewToCss(view, size),
    a = (Math.atan2(o.y - point.y, Math.max(1, point.x - o.x)) * 180) / Math.PI;
  return Math.max(min, Math.min(max, a));
}
// Písmo na úzké obrazovce: 10px text v 640 logických px má na 360 css px jen 5,6 px; zvětší se, aby měl aspoň ~9 css px (strop 2×).
export const uiScale = cssWidth => (cssWidth > 0 ? Math.min(2, Math.max(1, 576 / cssWidth)) : 1);
// Otřes (shakeCamera: x,y v logických px, roll v rad) kolem středu plátna, vždy uvnitř save/restore.
export function withShake(c, sh, draw) {
  c.save();
  try {
    if (sh && (sh.x || sh.y || sh.roll)) {
      c.translate(320 + sh.x, 180 + sh.y);
      c.rotate(sh.roll || 0);
      c.translate(-320, -180);
    }
    draw();
  } finally {
    c.restore();
  }
}
// Plátno UI vrstvy dostane výšku podle poměru stran kamery (index.js nastavuje jen šířku podle DPR); vrací logickou výšku.
export function fitLayer(canvas, aspect = VIEW.aspect) {
  if (!canvas?.width) return VIEW.h;
  const h = Math.max(1, Math.round(canvas.width / (aspect > 0 ? aspect : VIEW.aspect)));
  if (canvas.height !== h) canvas.height = h;
  return (VIEW.w * canvas.height) / canvas.width;
}
// Kotva řetězu komba: z ui.js {x, y} v CSS px plátna (pravý konec a střed řetězu; C2b: pod #hud-dist), jinak COMBO_UI.at. Logické px rovnoměrně (× 640 / šířka).
export const comboAt = (anchor, cssWidth = 640) =>
  anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y)
    ? { x: (anchor.x * VIEW.w) / (cssWidth || 640), y: (anchor.y * VIEW.w) / (cssWidth || 640) }
    : COMBO_UI.at;
export function drawUi(c, plan = {}, visual = {}) {
  const lh = fitLayer(c.canvas, plan.camera?.aspect ?? visual.aspect ?? VIEW.aspect),
    s = (c.canvas?.width || 640) / 640,
    ui = plan.ui ?? {},
    v = plan.view ?? AIM_VIEW,
    fx = plan.fx ?? {},
    reduced = ui.reduced ?? visual.reduced ?? false,
    t = plan.t ?? 0,
    p = PAPIR,
    scale = ui.uiScale ?? 1,
    css = ui.cssWidth ?? visual.cssWidth ?? 640;
  // Vše kolem vlaštovky (částice, popupy, štítky, QTE, mířidla) má odsazení v rovnoměrných px: posune se jen kotva v y.
  const dy = (v.py ?? 0) * (lh / VIEW.h - 1);
  c.setTransform(s, 0, 0, s, 0, 0);
  try {
    if (ui.clear !== false) c.clearRect(0, 0, 640, lh);
    if (dy) c.translate(0, dy);
    withShake(c, fx.shake, () => {
      if (!reduced) drawSpeedLines(c, fx.speedLines, p);
      drawParticles(c, fx.particles, p, reduced);
      drawPopups(c, fx.popups, v, p, scale);
      for (const l of ui.labels ?? []) drawLabel(c, l, v, p, scale);
      if (ui.burst) drawBurst(c, ui.burst, v, t, reduced, p);
      if (ui.qte)
        drawQte(c, ui.qte, v, t, reduced, p, ringZoom(eventView(ui.qte.type).ring.r, css));
    });
    if (ui.aim) drawAim(c, ui.aim, v, p);
    if (dy) c.translate(0, -dy);
    if (ui.combo) drawCombo(c, ui.combo, comboAt(ui.comboAnchor, css), t, reduced, p, scale);
    if (!reduced) drawFlash(c, fx.flash, p, lh);
    if (ui.intro) {
      const cw = visual.cssWidth ?? c.canvas?.clientWidth ?? 640;
      drawIntro(c, ui.intro, p, cw, lh, uiZoom(cw, c.canvas?.clientHeight ?? 360));
    }
  } finally {
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
}
// Pohodlné sestavení plánu UI přímo z ui.js (než ho bude dávat planFrame): stejné vstupy, jaké dnes dostává render.js.
export function uiFrame({
  f = null,
  view = AIM_VIEW,
  fx = null,
  qte = null,
  aim = null,
  reduced = false,
  settings = {},
  clock = 0,
  t = 0,
  cssWidth = 640,
  metersPerPx,
} = {}) {
  const e = activeEvent(f);
  return {
    t,
    view,
    fx: fxMap(fx, view, {
      reduced,
      clock,
      settings,
      metersPerPx,
      vx: effectiveVx(f),
      frame: t,
      flying: !!f && !f.landed,
    }),
    ui: { qte, aim, labels: e ? [eventView(e, f.t)] : [], reduced, uiScale: uiScale(cssWidth) },
  };
}
// Tmavý podklad kruhu QTE (bible kap. 5.5: ink 60 % alfa) jako mezikruží ±QTE_BASE px kolem kruhu: střed zůstává volný, vlaštovka pod ním neztmavne (S1).
export const QTE_BASE = 9;
// Poloměr papírové hvězdy perfektu (px); tloušťky oblouků jsou v palette.qte.width (6 / 9 / 11).
export const QTE_STAR = 8;
// Pěticípá hvězda vystřižená z papíru (bible 05 kap. 7, 11), vnitřní poloměr 0,45; edge = světlý řez okolo (odliší ji od oblouku stejné barvy).
export function star(c, x, y, r, color, edge) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      q = i % 2 ? r * 0.45 : r;
    c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * q, y + Math.sin(a) * q);
  }
  c.closePath();
  if (edge) {
    c.strokeStyle = edge;
    c.lineWidth = 3;
    c.lineJoin = 'round';
    c.stroke();
  }
  c.fillStyle = color;
  c.fill();
}
// Časovací kruh kolem vlaštovky: krémové mezikruží, stopa, oblouk úspěchu, perfekt s hvězdou, bod průběhu; varování čárkovaně, výsledek jednou barvou.
// C2a (05-art-udalosti kap. 0.1–4.2): zoom zvětší celý kruh (event-fx.ringZoom: na mobilu poloměr ≥ 30 CSS px); q.zones je pole zón (pára dvě)
// nebo starý tvar {success, perfect}; ve varování se zóny kreslí v alfě 0,5 pod čárkovaným kruhem (kromě holuba, jeho zóny jsou na délce držení).
// Stav ne jen barvou: tloušťky 6 / 9 / 11, hvězda perfektu, pecky (tvar podle výsledku), zarážky jádra termiky a kontaktu lampionu.
export function drawQte(c, q, view = AIM_VIEW, time = 0, reduced = false, p = PAPIR, zoom = 1) {
  const k = p.qte,
    z = zoom > 0 ? zoom : 1,
    W = k.width,
    ring = eventView(q.type).ring,
    R = ring.r * z,
    px = view.px,
    py = view.py,
    start = -Math.PI / 2,
    at = x => start + x * TAU,
    Z = Array.isArray(q.zones) ? q.zones : q.zones ? [q.zones] : [],
    arc = (from, to, color, width) => {
      c.beginPath();
      c.arc(px, py, R, at(from), at(to));
      c.strokeStyle = color;
      c.lineWidth = width * z;
      c.stroke();
    },
    radial = (x, inner, outer, color, width) => {
      const a = at(x);
      c.beginPath();
      c.moveTo(px + Math.cos(a) * (R - inner * z), py + Math.sin(a) * (R - inner * z));
      c.lineTo(px + Math.cos(a) * (R + outer * z), py + Math.sin(a) * (R + outer * z));
      c.strokeStyle = color;
      c.lineWidth = width * z;
      c.stroke();
    };
  const zonesOf = () => {
    Z.forEach((zn, i) => {
      if (!zn?.success && !zn?.perfect) return;
      const pulse = !reduced && q.pulse === i ? 2 : 0;
      if (!q.only && zn.success) arc(zn.success[0], zn.success[1], k.success, W.success + pulse);
      if (zn.perfect) {
        arc(zn.perfect[0], zn.perfect[1], k.perfect, W.perfect + (q.only ? pulse : 0));
        // perfekt se od úspěchu liší i tvarem, rajčatová hvězda uprostřed perfektní výseče na kruhu (střed kruhu patří vlaštovce)
        const m = at((zn.perfect[0] + zn.perfect[1]) / 2);
        star(c, px + Math.cos(m) * R, py + Math.sin(m) * R, QTE_STAR * z, k.perfect, k.disc);
      }
    });
    // pára: krémový řez kartonu mezi zónami (při širokých oknech se slijí)
    if (q.gap != null) radial(q.gap, 7, 7, k.disc, 2);
  };
  const marks = () => {
    for (const x of q.stops ?? []) radial(x, 5, 5, k.stop, 2);
    if (q.contact) radial(0, 7, 7, k.contact, 3);
  };
  c.save();
  if (q.phase === 'warning' || q.result || Z.length) {
    const ga = c.globalAlpha;
    if (k.shadow) {
      c.save();
      lift(c, k.shadow);
    }
    c.globalAlpha = ga * k.discAlpha;
    c.fillStyle = k.disc;
    c.beginPath();
    c.arc(px, py, R + QTE_BASE * z, 0, TAU);
    c.arc(px, py, Math.max(0, R - QTE_BASE * z), 0, TAU, true);
    c.fill();
    c.globalAlpha = ga;
    if (k.shadow) c.restore();
  }
  if (q.type === 'gust' && !q.result) {
    c.save();
    c.lineCap = c.lineJoin = 'round';
    for (const [color, w] of [
      [k.gustEdge, 4],
      [k.gust, 2],
    ]) {
      c.strokeStyle = color;
      c.lineWidth = w;
      c.beginPath();
      for (const s of gustStrips(px, py, time, reduced))
        s.forEach(([x, y], j) => (j ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.stroke();
    }
    c.restore();
  }
  if (q.type === 'bird' && !q.held && !q.result) {
    const bob = reduced ? 0 : Math.sin(time * 8) * 3;
    c.fillStyle = k.bird.body;
    c.fillRect(px + 34, py - 36 + bob, 14, 8);
    c.fillStyle = k.bird.wing;
    c.fillRect(px + 30, py - 40 - bob, 8, 4);
    c.fillRect(px + 44, py - 40 - bob, 8, 4);
    c.fillStyle = k.bird.beak;
    c.fillRect(px + 48, py - 33 + bob, 4, 2);
  }
  if (q.phase === 'warning') {
    const ga = c.globalAlpha;
    if (q.type !== 'bird' && Z.length) {
      c.globalAlpha = ga * RING_WARN_ALPHA;
      zonesOf();
      c.globalAlpha = ga;
      marks();
    }
    c.globalAlpha = ga * (reduced ? 0.8 : 0.5 + 0.4 * Math.sin(time * 12));
    c.setLineDash([6 * z, 6 * z]);
    arc(0, 1, k.warning, 3);
    c.setLineDash([]);
    c.globalAlpha = ga;
  } else if (q.result) arc(0, 1, k.result[q.result] ?? k.result.other, 5);
  else if (Z.length) {
    arc(0, 1, q.track === 'half' ? k.half : k.track, W.track);
    zonesOf();
    marks();
    const a = at(q.progress ?? 0),
      x = px + Math.cos(a) * R,
      y = py + Math.sin(a) * R,
      d = 5 * z;
    c.fillStyle = k.dot;
    if (ring.marker === 'dot') {
      c.beginPath();
      c.arc(x, y, 4.5 * z, 0, TAU);
      c.fill();
    } else if (ring.marker === 'diamond') {
      c.beginPath();
      c.moveTo(x, y - d);
      c.lineTo(x + d, y);
      c.lineTo(x, y + d);
      c.lineTo(x - d, y);
      c.closePath();
      c.fill();
    } else c.fillRect(Math.round(x - 4 * z), Math.round(y - 4 * z), 8 * z, 8 * z);
  }
  if (q.pegs) drawPegs(c, q, px, py - R - (QTE_BASE + 9.5) * z, z, p, q.contact ? 9 * z : 0);
  c.restore();
}
// Pecky = počet stisků / kusů v řadě (kap. 1.2): terčík ⌀ 7 px vně kruhu ve 12 h. Prázdná = krém s grafitovým lemem (očekávaná o 1,5 px silnější),
// perfekt = rajčatová hvězdička, úspěch = plný terčík teal, half/partial = plný kraftDark, minutí = prázdný kroužek miss.
export const PEG = Object.freeze({ r: 3.5, gap: 10, edge: 1.5 });
export function drawPegs(c, q, cx, cy, z = 1, p = PAPIR, shift = 0) {
  const k = p.qte,
    n = q.pegs.length,
    r = PEG.r * z;
  q.pegs.forEach((g, i) => {
    const x = cx + shift + (i - (n - 1) / 2) * PEG.gap * z;
    if (g === 'perfect') return star(c, x, cy, r * 1.3, k.perfect, k.disc);
    c.beginPath();
    c.arc(x, cy, r, 0, TAU);
    if (g === 'success' || g === 'half' || g === 'partial') {
      c.fillStyle = g === 'success' ? k.success : k.half;
      c.fill();
    } else if (g === 'miss') {
      c.strokeStyle = k.track;
      c.lineWidth = PEG.edge * z;
      c.stroke();
    } else {
      c.fillStyle = k.peg;
      c.fill();
      c.strokeStyle = k.pegEdge;
      c.lineWidth = (PEG.edge + (q.next === i ? 1.5 : 0)) * z;
      c.stroke();
    }
  });
}
// Výtrysk (kap. 5): 3 vodorovné čárky tužkou za ocasem (délka podle síly, on twos), pára navíc krémové obláčky po 0,25 s.
// b = event-fx.burstOf + tail (log. px od středu vlaštovky k ocasu). Reduced motion: čárky stojí, mění se jen délka.
export function drawBurst(c, b, view = AIM_VIEW, time = 0, reduced = false, p = PAPIR) {
  if (!b || !(b.k > 0)) return;
  const B = BURST_UI,
    x0 = view.px - (b.tail ?? 18) - 2,
    len = burstDash(b.k),
    j = reduced ? 0 : (Math.floor(time * 12) % 2) * 2;
  c.save();
  c.strokeStyle = p.burst.line;
  c.lineCap = 'round';
  c.lineWidth = 1;
  c.beginPath();
  for (let i = 0; i < B.n; i++) {
    const y = view.py + (i - (B.n - 1) / 2) * B.gap,
      x = x0 - (i === 1 ? 0 : 3) - j;
    c.moveTo(x, y);
    c.lineTo(x - len, y);
  }
  c.stroke();
  if (b.tag === 'steam' && !reduced) {
    c.fillStyle = p.burst.puff;
    for (let i = 0; i < 3; i++) {
      const a = ((b.age ?? 0) % B.puff) / B.puff + i;
      c.globalAlpha = 0.5 * (1 - a / 3);
      c.beginPath();
      c.arc(x0 - 4 - a * 14, view.py + 2, B.puffR, 0, TAU);
      c.fill();
    }
  }
  c.restore();
}
// Papírový řetěz komba (kap. 6.1–6.2) vpravo nahoře: očka = strop comboSpec.max, vyplněná teal, prázdná čárkovaná miss, vlevo štítek ×N
// (číslo vždy). Nové očko zacvakne (1,3 → 1 za 0,15 s), přetržení = očka padají 0,4 s; Chimes = zvoneček na konci při kombu ≥ 3.
// at = {x (pravý konec), y (střed)} v logických px, s = uiScale. Reduced motion: bez měřítka, pádu a houpání.
export function drawCombo(c, cb, at = COMBO_UI.at, time = 0, reduced = false, p = PAPIR, s = 1) {
  if (!cb) return;
  const C = COMBO_UI,
    K = p.combo,
    broke = cb.broke && !reduced,
    links = comboLinks(cb.max, broke ? cb.broke : cb.n, at.x, at.y, s),
    fall = broke ? Math.min(1, cb.age / C.fall) : 0,
    last = Math.min(cb.n, cb.max) - 1;
  c.save();
  c.lineJoin = 'round';
  links.forEach((l, i) => {
    let rx = C.rx * s,
      ry = C.ry * s,
      y = l.y;
    c.globalAlpha = 1;
    if (broke && l.filled) {
      y += 40 * fall * fall;
      c.globalAlpha = 1 - fall;
    }
    if (!reduced && !broke && i === last && cb.n > cb.before && cb.age < C.snap) {
      const g = C.pop - (C.pop - 1) * (cb.age / C.snap);
      rx *= g;
      ry *= g;
    }
    c.beginPath();
    c.ellipse(l.x, y, rx, ry, 0, 0, TAU);
    if (l.filled) {
      c.setLineDash([]);
      c.strokeStyle = broke && i % 2 ? K.tag : K.link;
      c.lineWidth = C.width * s;
    } else {
      c.setLineDash([2 * s, 2 * s]);
      c.strokeStyle = K.empty;
      c.lineWidth = C.empty * s;
    }
    c.stroke();
  });
  c.setLineDash([]);
  c.globalAlpha = 1;
  // štítek s číslem vlevo od řetězu
  const txt = '×' + (cb.broke ? 0 : cb.n),
    fs = Math.round(C.font * s),
    x1 = links[0].x - C.rx * s - 4 * s;
  c.font = `bold ${fs}px ${p.popup.font}`;
  const w = c.measureText(txt).width + 6 * s;
  c.fillStyle = K.tag;
  c.fillRect(x1 - w, at.y - fs * 0.65, w, fs * 1.3);
  c.fillStyle = K.text;
  c.textAlign = 'right';
  c.textBaseline = 'middle';
  c.fillText(txt, x1 - 3 * s, at.y);
  if (cb.chimes) {
    const end = links[links.length - 1],
      [bw, bh] = C.bell,
      u = cb.ring * C.hz,
      a = reduced || !(u < C.cycles) ? 0 : C.swing * Math.sin(u * TAU) * (1 - u / C.cycles);
    c.translate(end.x, end.y + C.ry * s);
    c.rotate(a);
    c.scale(s, s);
    c.fillStyle = K.bell;
    c.beginPath();
    c.moveTo(-bw / 2 + 2, 0);
    c.lineTo(bw / 2 - 2, 0);
    c.lineTo(bw / 2, bh);
    c.lineTo(-bw / 2, bh);
    c.closePath();
    c.fill();
    c.fillStyle = K.bellCut;
    c.fillRect(-bw / 2, bh - 1, bw, 1);
    c.fillStyle = K.clapper;
    c.beginPath();
    c.arc(0, bh + 1, 1, 0, TAU);
    c.fill();
  }
  c.restore();
}
// Štítek události: přilétá zprava k vlaštovce jako v atmosphere.js (x = px + max(55, 190 − 68·age)).
export function drawLabel(c, l, view, p = PAPIR, scale = 1) {
  if (!l?.label) return;
  const x = view.px + Math.max(55, 190 - (l.age ?? 0) * 68),
    y = Math.max(88, Math.min(245, view.py - 12));
  c.save();
  c.font = `bold ${Math.round(10 * scale)}px ${p.popup.font}`;
  const w = c.measureText(l.label).width + 12 * scale,
    h = 19 * scale,
    lx = Math.round(Math.min(625 - w, x - 10));
  // grafitová páska natočená o label.tilt (°) kolem středu štítku
  if (p.label.tilt) {
    const cx = lx + w / 2,
      cy = y - 20 - h / 2;
    c.translate(cx, cy);
    c.rotate(p.label.tilt * DEG);
    c.translate(-cx, -cy);
  }
  c.fillStyle = p.label.bg;
  c.fillRect(lx, Math.round(y - 20 - h), w, h);
  c.fillStyle = p.label.text;
  c.fillText(l.label, lx + 6 * scale, y - 20 - 6 * scale);
  c.restore();
}
// Částice z fxMap (už v obrazovkových px): prach jako čtverečky, větrná čárka 1 px vysoká, jiskry (1 perfekt, 2 úspěch, 4 hodnota)
// jako natočené útržky (fx-map scrapAngle), úspěch střídá barvu role a krém (bible 05 kap. 7).
export function drawParticles(c, list = [], p = PAPIR, reduced = false) {
  if (!list?.length) return;
  c.save();
  for (const q of list) {
    c.globalAlpha = q.alpha;
    c.fillStyle = p.particles[q.kind] ?? p.particles[0];
    if (q.kind === 1 || q.kind === 2 || q.kind === 4) {
      const w = q.size * SCRAP.grow,
        h = w * SCRAP.ratio;
      if (q.kind === 2 && scrapTone(q)) c.fillStyle = p.particles[0];
      c.save();
      c.translate(q.x, q.y);
      c.rotate(scrapAngle(q, reduced));
      c.fillRect(-w / 2, -h / 2, w, h);
      c.restore();
    } else if (q.kind === 3) c.fillRect(Math.round(q.x), Math.round(q.y), q.size, 1);
    else c.fillRect(q.x - q.size / 2, q.y - q.size / 2, q.size, q.size);
  }
  c.restore();
}
// Popupy sledují vlaštovku (px+20, py−30, land nad ní); rise/scale počítá fxMap (reduced = bez pohybu).
export function drawPopups(c, list = [], view = AIM_VIEW, p = PAPIR, scale = 1) {
  if (!list?.length) return;
  c.save();
  c.textAlign = 'center';
  c.lineJoin = 'round';
  // krémový štítek se stínem zvednutí, natočený střídavě o ±popup.tilt (°), text v barvě role bez obrysu
  c.textBaseline = 'middle';
  for (const q of list) {
    const big = q.style === 'perfect' || q.style === 'land',
      land = q.style === 'land',
      fs = Math.round((big ? 17 : 13) * q.scale * scale);
    c.globalAlpha = q.alpha;
    c.font = `bold ${fs}px ${p.popup.font}`;
    const x = Math.max(70, Math.min(570, view.px + (land ? 0 : 20))),
      y = view.py - (land ? 40 : 30) - q.rise - q.i * 16 * scale - fs * 0.35,
      w = c.measureText(q.text).width + fs * 0.8,
      h = fs * 1.3;
    c.save();
    c.translate(x, y);
    c.rotate((q.i % 2 ? 1 : -1) * (p.popup.tilt ?? 0) * DEG);
    if (p.qte.shadow) lift(c, p.qte.shadow);
    c.fillStyle = p.popup.bg;
    c.fillRect(-w / 2, -h / 2, w, h);
    c.restore();
    c.save();
    c.translate(x, y);
    c.rotate((q.i % 2 ? 1 : -1) * (p.popup.tilt ?? 0) * DEG);
    c.fillStyle = p.popup[q.style] ?? p.popup.land;
    c.fillText(q.text, 0, 0);
    c.restore();
  }
  c.restore();
}
export function drawFlash(c, alpha, p = PAPIR, lh = VIEW.h) {
  if (!(alpha > 0)) return;
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = p.flash;
  c.fillRect(-20, -20, 680, lh + 40);
  c.restore();
}
// Rychlostní čáry [x,y,délka] (fxMap.speedLines): tenké grafitové čárky tužkou (speed.width px, alfa speed.alpha).
export function drawSpeedLines(c, lines = [], p = PAPIR) {
  if (!lines?.length) return;
  c.save();
  c.strokeStyle = p.speed.line;
  c.lineCap = 'round';
  c.globalAlpha = p.speed.alpha;
  c.lineWidth = p.speed.width;
  c.beginPath();
  for (const [x, y, len] of lines) {
    c.moveTo(x, y);
    c.lineTo(x - len, y);
  }
  c.stroke();
  c.restore();
}
// Nápis úvodu (H1, 03-art kap. 2.2, bible 05 kap. 9.2): „Throw it“ a pod ním nápověda, grafit bez podkladu nahoře v nebi nad hřebenem,
// vodorovně na střed, svisle v pásu band (podíl výšky, intro.js / launch-site INTRO_SHOT.text). intro = {alpha, band, touch}.
export const INTRO_TITLE = Object.freeze({ size: 36, sub: 13, at: 0.42, subAt: 0.86 });
// Velikosti nápisu úvodu z tokenů 02-ux §6 v CSS px s horní mezí (--prompt-size clamp(32, 9vw, 72), --prompt-hint-size clamp(15, 3.8vw, 18)),
// vydělené škálou plátna (CSS px na logický px = cssWidth / 640) → logické px pro c.font.
const clampPx = (lo, v, hi) => Math.max(lo, Math.min(hi, v));
// Krok zvětšení UI pro velká okna, stejný jako zoom v style.css (art review A2): nápis v plátně roste se stejným krokem jako titul a panely.
export const uiZoom = (cssWidth = 640, cssHeight = 360) =>
  cssWidth >= 2200 && cssHeight >= 1200 ? 1.5 : cssWidth >= 1700 && cssHeight >= 1000 ? 1.25 : 1;
export function introTextSize(cssWidth = 640, scale = cssWidth / 640, zoom = 1) {
  const w = cssWidth > 0 ? cssWidth : 640,
    k = scale > 0 ? scale : 1,
    z = zoom > 0 ? zoom : 1,
    cssSize = clampPx(32, 0.09 * w, 72) * z,
    cssSub = clampPx(15, 0.038 * w, 18) * z;
  return { size: cssSize / k, sub: cssSub / k, cssSize, cssSub };
}
export function drawIntro(c, intro, p = PAPIR, cssWidth = 640, lh = VIEW.h, zoom = 1) {
  if (!(intro?.alpha > 0)) return;
  const [y0, y1] = (intro.band ?? [0.08, 0.28]).map(v => v * lh),
    k = INTRO_TITLE,
    sz = introTextSize(cssWidth, cssWidth / 640, zoom);
  c.save();
  c.globalAlpha = Math.min(1, intro.alpha);
  c.fillStyle = p.aim.text;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `bold ${sz.size}px ${p.popup.font}`;
  c.fillText(t('prompt.throw'), 320, y0 + (y1 - y0) * k.at);
  c.font = `600 ${sz.sub}px ${p.popup.font}`;
  c.fillText(
    t(intro.touch ? 'prompt.hintTouch' : 'prompt.hintMouse'),
    320,
    y0 + (y1 - y0) * k.subAt,
  );
  c.restore();
}
// Mířidla (dřív natvrdo v ui.js na 148,258): čárkovaná šipka z vlaštovky pod úhlem, delší s nabitím, panel s pokynem a lišta síly.
// aim = {angle (°), held, charge 0–1}; view = view(null), takže šipka vychází z promítnuté vlaštovky.
export function drawAim(c, aim, view = AIM_VIEW, p = PAPIR) {
  const k = p.aim,
    charge = aim.held ? (aim.charge ?? 0) : 0,
    a = ((aim.angle ?? 15) * Math.PI) / 180,
    len = 65 + charge * 45;
  c.save();
  c.translate(view.px, view.py);
  c.rotate(-a);
  c.strokeStyle = k.arrow;
  c.lineWidth = 3;
  c.setLineDash([7, 5]);
  c.beginPath();
  c.moveTo(12, 0);
  c.lineTo(len, 0);
  c.stroke();
  c.setLineDash([]);
  c.beginPath();
  c.moveTo(len - 10, -6);
  c.lineTo(len, 0);
  c.lineTo(len - 10, 6);
  c.stroke();
  c.restore();
  // panel je krémová karta se stínem zvednutého papíru (bible 05 kap. 8)
  c.save();
  lift(c, p.qte.shadow);
  c.fillStyle = k.panel;
  c.fillRect(205, 168, 265, 37);
  c.fillRect(205, 211, 265, 14);
  c.restore();
  c.save();
  c.fillStyle = k.panel;
  c.fillRect(205, 168, 265, 37);
  c.fillStyle = k.text;
  c.font = `bold 13px ${p.popup.font}`;
  c.fillText(t(aim.held ? 'aim.panelHeld' : 'aim.panelIdle'), 220, 191);
  c.fillStyle = k.panel;
  c.fillRect(205, 211, 265, 14);
  c.fillStyle = k.bar;
  c.fillRect(207, 213, 261 * charge, 10);
  c.strokeStyle = k.cap;
  c.lineWidth = 1;
  c.strokeRect(449, 212, 19, 12);
  c.restore();
}
