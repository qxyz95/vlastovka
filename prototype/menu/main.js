// Prototyp struktury obrazovek (research/design/07-menu.md). Falešná hra, nesahá do src/.
// Obrazovka (menu | aim | flight | result) + zásobník panelů (<dialog>: pause, settings, confirm, workshop, atlas).
import { makeT, makeFormat, PLACES, DISTRICTS } from './texts.js';
import { createScene } from './scene.js';
const $ = id => document.getElementById(id),
  Q = new URLSearchParams(location.search),
  VERSION = '0.9-menu';
const SCEN = {
  first: {
    label: 'první spuštění (0 hodů)',
    coins: 0,
    best: 0,
    attempts: 0,
    levels: { power: 0, paper: 0, fold: 0 },
    model: 'dart',
    atlasNew: false,
  },
  early: {
    label: 'začátek (180 m, nové místo)',
    coins: 120,
    best: 180,
    attempts: 6,
    levels: { power: 1, paper: 0, fold: 0 },
    model: 'dart',
    atlasNew: true,
  },
  mid: {
    label: 'uprostřed (1 360 m)',
    coins: 1240,
    best: 1360,
    attempts: 40,
    levels: { power: 3, paper: 2, fold: 2 },
    model: 'glider',
    atlasNew: false,
  },
  broke: {
    label: 'prázdná peněženka',
    coins: 0,
    best: 300,
    attempts: 10,
    levels: { power: 1, paper: 1, fold: 0 },
    model: 'dart',
    atlasNew: false,
  },
  long: {
    label: 'nejdelší čísla (4 876 m, 98 765 ◈)',
    coins: 98765,
    best: 4876,
    attempts: 150,
    levels: { power: 5, paper: 4, fold: 4 },
    model: 'glider',
    atlasNew: true,
  },
  delivered: {
    label: 'dohráno (Delivered)',
    coins: 22400,
    best: 4950,
    attempts: 160,
    levels: { power: 5, paper: 5, fold: 5 },
    model: 'glider',
    atlasNew: false,
    delivered: true,
  },
  loading: {
    label: 'načítání (1,6 s)',
    coins: 1240,
    best: 1360,
    attempts: 40,
    levels: { power: 3, paper: 2, fold: 2 },
    model: 'glider',
    atlasNew: false,
    loading: true,
  },
  error: {
    label: 'chyba načtení',
    coins: 0,
    best: 0,
    attempts: 0,
    levels: { power: 0, paper: 0, fold: 0 },
    model: 'dart',
    error: true,
  },
};
const opt = {
  scenario: SCEN[Q.get('scenario')] ? Q.get('scenario') : 'mid',
  skin: Q.get('skin') === 'paper' ? 'paper' : 'neon',
  first: ['all', 'direct'].includes(Q.get('first')) ? Q.get('first') : 'reveal',
  leave: ['discard', 'hide'].includes(Q.get('leave')) ? Q.get('leave') : 'count',
  goal: Q.get('goal') !== '0',
  assist: Q.has('assist') && Q.get('assist') !== '0',
};
const clone = s => JSON.parse(JSON.stringify(s));
let p = clone(SCEN[opt.scenario]);
const PRICES = [35, 105, 195, 300, 450],
  EFF = { power: 0.06, paper: 0.08, fold: 0.1 },
  BRANCHES = ['power', 'paper', 'fold'];

// --- nastavení (mimo „save“, jako jazyk ve hře) ---
const SKEY = 'proto-menu-settings',
  mq = matchMedia('(prefers-reduced-motion: reduce)');
const S = (() => {
  const d = {
    lang: 'en',
    motion: 'system',
    tbar: false,
    music: 60,
    sfx: 80,
    mute: false,
    wide: false,
  };
  try {
    const r = JSON.parse(localStorage.getItem(SKEY) ?? 'null');
    if (r && typeof r === 'object') for (const k in d) if (typeof r[k] === typeof d[k]) d[k] = r[k];
  } catch {}
  if (!['en', 'cs'].includes(d.lang)) d.lang = 'en';
  if (!['system', 'reduce', 'full'].includes(d.motion)) d.motion = 'system';
  return d;
})();
if (['en', 'cs'].includes(Q.get('lang'))) S.lang = Q.get('lang');
if (['system', 'reduce', 'full'].includes(Q.get('motion'))) S.motion = Q.get('motion');
const saveS = () => {
  try {
    localStorage.setItem(SKEY, JSON.stringify(S));
  } catch {}
};
const reduced = () => S.motion === 'reduce' || (S.motion === 'system' && mq.matches);
function applyMotion() {
  document.documentElement.dataset.motion = reduced() ? 'reduce' : 'full';
  for (const b of $('s-motion').querySelectorAll('[data-motion]'))
    b.setAttribute('aria-pressed', b.dataset.motion === S.motion);
  $('s-motion-now').textContent = t('settings.motionNow', {
    value: t(reduced() ? 'settings.motionReduce' : 'settings.motionFull'),
  });
}
mq.addEventListener?.('change', applyMotion);

// --- texty ---
let t = makeT('en'),
  F = makeFormat('en');
function applyLang(l) {
  S.lang = l;
  t = makeT(l);
  F = makeFormat(l);
  document.documentElement.lang = l;
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-aria]'))
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const b of $('s-lang').querySelectorAll('[data-lang]'))
    b.setAttribute('aria-pressed', b.dataset.lang === l);
  $('s-version').textContent = t('footer.version', { version: VERSION });
  applyMotion();
  renderSound();
  renderAll(true);
}
const coinsText = n => t('menu.coins', { count: F.num(n), n });

// --- scéna a stav hry ---
const scene = createScene($('scene'));
let screen = 'menu',
  panels = [],
  lost = false,
  lostAt = 0,
  menuCam = 0;
let angle = 15,
  held = null,
  heldTime = 0,
  hintOn = false,
  fl = null,
  banner = null,
  bannerQ = [],
  result = null;
const kpm = () => Math.max(4, innerWidth / 90);
const placeIdx = x => {
  let i = 0;
  for (let j = 0; j < PLACES.length; j++) if (PLACES[j][0] <= x) i = j;
  return i;
};
const nextPlace = x => PLACES.find(([s]) => s > x) ?? null;
const district = x => Math.min(3, Math.floor(placeIdx(x) / 4));
const chargeAt = h => (1 - Math.cos((h * 2 * Math.PI) / 1.6)) / 2;

// --- obrazovky ---
function go(next, { focus = true } = {}) {
  screen = next;
  document.body.dataset.screen = next;
  $('menu').hidden = next !== 'menu';
  $('hud').hidden = !(next === 'aim' || next === 'flight');
  $('result').hidden = next !== 'result';
  for (const id of ['menu', 'hud']) {
    $(id).classList.remove('enter');
    void $(id).offsetWidth;
    $(id).classList.add('enter');
  }
  renderAll();
  sync();
  if (focus) {
    const f = { menu: visibleMenu()[0], aim: $('act'), flight: $('act'), result: $('r-again') }[
      next
    ];
    f?.focus({ preventScroll: true });
  }
}
function visibleMenu() {
  return [...$('m-nav').querySelectorAll('button')].filter(b => !b.hidden && !b.disabled);
}
function goMenu() {
  closeAll();
  fl = null;
  result = null;
  go('menu');
}
function startAim() {
  closeAll();
  fl = null;
  result = null;
  held = null;
  heldTime = 0;
  banner = null;
  bannerQ = [];
  hintOn = p.attempts === 0;
  go('aim');
}

// --- panely (zásobník) a historie (systémové zpět) ---
const ALLOWED = {
  pause: ['aim', 'flight'],
  workshop: ['menu', 'result', 'atlas'],
  atlas: ['menu', 'result', 'workshop'],
  settings: ['menu', 'pause'],
  confirm: ['settings'],
};
const top = () => panels.at(-1);
function openPanel(name, { opener = document.activeElement, away = false } = {}) {
  const base = top()?.name ?? screen;
  if (!ALLOWED[name].includes(base)) return;
  if (base === 'atlas' || base === 'workshop') {
    if (base === name) return;
    const prev = panels.pop();
    $(prev.name).close();
    opener = prev.opener;
  } // Atlas ↔ Dílna se vymění, nevrství
  if (name === 'pause') {
    held = null;
    heldTime = 0;
    $('p-away').hidden = !away;
  }
  if (name === 'atlas' && p.atlasNew) {
    p.atlasNew = false;
  }
  panels.push({ name, opener });
  renderPanel(name);
  $(name).showModal();
  const f = {
    pause: $('p-resume'),
    settings: $('s-lang').querySelector('[aria-pressed=true]'),
    confirm: $('c-keep'),
    workshop: $('w-branches').querySelector('button:not(:disabled)') ?? $('w-throw'),
    atlas: $('at-close'),
  }[name];
  f?.focus();
  renderAll();
  sync();
}
function closeTop({ restore = true } = {}) {
  const pnl = panels.pop();
  if (!pnl) return;
  $(pnl.name).close();
  if (restore) {
    const o = pnl.opener;
    if (o && o.isConnected && !o.closest('[hidden]') && o.offsetParent !== null)
      o.focus({ preventScroll: true });
    else
      ({ menu: visibleMenu()[0], aim: $('act'), flight: $('act'), result: $('r-again') })[
        screen
      ]?.focus();
  }
  renderAll();
  sync();
}
function closeAll() {
  while (panels.length) {
    const pnl = panels.pop();
    $(pnl.name).close();
  }
}
function back() {
  if (panels.length) closeTop();
  else if (screen === 'aim' || screen === 'flight') openPanel('pause', { opener: $('act') });
  else if (screen === 'result') goMenu();
}
let entries = 0,
  ignore = 0;
const expected = () => (screen === 'menu' ? 0 : 1) + panels.length;
function sync() {
  const want = expected();
  if (entries < want) {
    while (entries < want) {
      history.pushState({ jti: entries + 1 }, '');
      entries++;
    }
  } else if (entries > want) {
    const n = entries - want;
    entries = want;
    ignore++;
    history.go(-n);
  }
}
addEventListener('popstate', () => {
  if (ignore > 0) {
    ignore--;
    return;
  }
  entries = Math.max(0, entries - 1);
  back();
  sync();
});
for (const id of Object.keys(ALLOWED)) {
  const d = $(id);
  d.addEventListener('cancel', e => {
    e.preventDefault();
    back();
  });
  d.addEventListener('close', () => {
    const i = panels.findIndex(x => x.name === id);
    if (i >= 0) {
      panels.splice(i);
      renderAll();
      sync();
    }
  });
} // zavření prohlížečem mimo náš tok

// --- render ---
// Panely (Dílna, Atlas) se překreslují jen při otevření, nákupu a změně jazyka, jinak by ztratily fokus.
function renderAll(withPanels = false) {
  renderMenu();
  renderHud();
  if (screen === 'result') renderResult();
  if (withPanels) for (const x of panels) renderPanel(x.name);
}
function renderMenu() {
  $('m-coins').textContent = F.num(p.coins);
  $('m-wallet').setAttribute('aria-label', coinsText(p.coins));
  $('m-wallet').setAttribute('role', 'img');
  const reveal = opt.first !== 'all';
  $('m-workshop').hidden = reveal && p.attempts === 0;
  $('m-atlas').hidden = reveal && p.best < 100;
  $('m-atlas-dot').hidden = !p.atlasNew;
  $('r-atlas-dot').hidden = !p.atlasNew;
  for (const b of [$('m-atlas'), $('r-atlas')])
    p.atlasNew ? b.setAttribute('aria-label', t('menu.atlasNew')) : b.removeAttribute('aria-label');
  $('m-delivered').hidden = !p.delivered;
}
function renderHud() {
  const x = fl ? fl.x : 0;
  $('h-dist').textContent = F.m(Math.floor(x));
  const np = nextPlace(screen === 'flight' ? x : p.best);
  $('h-next').hidden = !opt.goal;
  $('h-next').textContent = np
    ? t('hud.next', { place: np[1], distance: F.m(np[0]) })
    : t('hud.bestLine', { distance: F.m(Math.floor(p.best)) });
  $('h-coins').textContent = F.num(p.coins);
  $('h-wallet').setAttribute('aria-label', coinsText(p.coins));
  $('h-wallet').setAttribute('role', 'img');
  $('h-plus').textContent = fl && screen === 'flight' ? '+' + F.num(fl.coins) : '';
  $('angle-ctl').hidden = screen !== 'aim';
  $('a-val').textContent = F.deg(angle);
  $('a-val').setAttribute('aria-label', t('aim.angleValue', { angle: F.deg(angle) }));
  $('aim-hint').hidden = !(screen === 'aim' && hintOn);
  const act = $('act');
  let lbl,
    dis = false;
  if (screen === 'aim') {
    const h = held !== null;
    lbl = h ? t('aim.letGo') : t('aim.holdShort');
    act.style.setProperty('--charge', h ? chargeAt(heldTime) : 0);
    act.toggleAttribute('data-hot', h);
  } else {
    const e = fl?.ev,
      live = e && !e.result && fl.t >= e.warn && fl.t <= e.end;
    lbl = t(live ? 'flight.btnTap' : 'flight.btnIdle');
    dis = !live;
    act.style.setProperty('--charge', 0);
    act.toggleAttribute('data-hot', !!live);
  }
  if ($('act-lbl').textContent !== lbl) $('act-lbl').textContent = lbl;
  act.setAttribute('aria-disabled', dis);
  const b = $('banner');
  if (banner && screen === 'flight') {
    b.hidden = false;
    if (b.textContent !== banner.text) b.textContent = banner.text;
    b.dataset.kind = banner.kind ?? '';
  } else b.hidden = true;
  const e = fl?.ev,
    showBar = S.tbar && screen === 'flight' && e && fl.t >= e.warn && fl.t < e.end + 0.6;
  $('tbar').hidden = !showBar;
  if (showBar) {
    const z = zones();
    $('tb-ok').style.cssText = `left:${z.ok[0] * 100}%;width:${(z.ok[1] - z.ok[0]) * 100}%`;
    $('tb-pf').style.cssText = `left:${z.pf[0] * 100}%;width:${(z.pf[1] - z.pf[0]) * 100}%`;
    $('tb-n').style.left = Math.max(0, Math.min(1, (fl.t - e.start) / e.len)) * 100 + '%';
  }
  $('p-menu').hidden = opt.leave === 'hide' && screen === 'flight';
  $('p-leave').textContent =
    screen === 'flight' && opt.leave !== 'hide'
      ? t(opt.leave === 'count' ? 'pause.leaveCounts' : 'pause.leaveDiscard')
      : '';
  $('p-leave').hidden = !$('p-leave').textContent;
}

// --- míření ---
function setAngle(a) {
  angle = Math.max(5, Math.min(40, Math.round(a)));
  renderHud();
}
function begin(src) {
  if (screen !== 'aim' || held !== null || panels.length) return;
  held = src;
  heldTime = 0;
  hintOn = false;
  renderHud();
}
function release(src) {
  if (screen !== 'aim' || held !== src) return;
  const power = chargeAt(heldTime);
  held = null;
  launch(power);
}
function cancelHold() {
  if (held !== null) {
    held = null;
    heldTime = 0;
    renderHud();
  }
}
function aimFromPointer(e) {
  const k = kpm(),
    camX = (-0.3 * innerWidth) / k,
    [hx, hy] = scene.toScreen(0, 2, camX);
  setAngle((Math.atan2(hy - e.clientY, Math.max(1, e.clientX - hx)) * 180) / Math.PI);
}

// --- let (falešná fyzika: jen kvůli toku obrazovek) ---
function zones() {
  return S.wide && opt.assist
    ? { ok: [0.32, 0.83], pf: [0.48, 0.66] }
    : { ok: [0.4, 0.75], pf: [0.52, 0.62] };
}
function launch(power) {
  const lv = p.levels,
    af = Math.max(0.4, 1 - Math.abs(angle - 18) / 40),
    scale = 1 + p.best / 900;
  const D0 =
      (220 + power * 520) *
      af *
      (1 + 0.06 * (lv.power + lv.paper)) *
      (p.model === 'glider' ? 1.1 : 1) *
      scale,
    T = Math.min(9, 4 + D0 / 500);
  fl = {
    t: 0,
    T,
    D0,
    D: D0,
    bonus: 0,
    tHit: 0,
    H: 16 + angle * 1.1 + power * 18,
    angle,
    power,
    x: 0,
    y: 2,
    trail: [],
    coins: 10,
    prevBest: p.best,
    seen: new Set(),
    mile: new Set(),
    ev: { warn: 1.2, start: 1.6, len: 1.2, end: 2.8, result: null, shownUntil: 0 },
  };
  go('flight');
}
function posAt(t) {
  const u = Math.min(1, t / fl.T),
    D = fl.D0 * (1 + fl.bonus * Math.max(0, Math.min(1, (t - fl.tHit) / 0.6))),
    v = Math.pow(u, 0.7);
  return [D * (1 - Math.pow(1 - u, 1.7)), fl.H * 4 * v * (1 - v) + 2 * (1 - u)];
}
function flightPress() {
  if (screen !== 'flight' || panels.length) return;
  const e = fl.ev;
  if (e.result || fl.t < e.start || fl.t > e.end) return;
  const q = (fl.t - e.start) / e.len,
    z = zones();
  e.result =
    q >= z.pf[0] && q <= z.pf[1] ? 'perfect' : q >= z.ok[0] && q <= z.ok[1] ? 'success' : 'miss';
  resolve();
}
function resolve() {
  const e = fl.ev;
  fl.bonus = e.result === 'perfect' ? 0.15 : e.result === 'success' ? 0.08 : 0;
  fl.tHit = fl.t;
  e.shownUntil = fl.t + 0.6;
  const text = t(
    e.result === 'perfect' ? 'proto.perfect' : e.result === 'success' ? 'proto.hit' : 'proto.miss',
  );
  banner = {
    text: (e.result === 'perfect' ? '★ ' : e.result === 'success' ? '✓ ' : '✕ ') + text,
    kind: e.result,
    until: fl.t + 0.9,
  };
  say(text);
}
function stepFlight(dt) {
  fl.t += dt;
  const e = fl.ev;
  if (!e.result && fl.t > e.end) {
    e.result = 'miss';
    resolve();
  }
  if (!e.result && fl.t >= e.warn && (!banner || banner.kind !== 'event')) {
    banner = { text: t('proto.gust'), kind: 'event', until: e.end };
    say(t('proto.gust'));
  }
  const [x, y] = posAt(fl.t);
  fl.x = x;
  fl.y = y;
  fl.trail.push([x, y]);
  if (fl.trail.length > 70) fl.trail.shift();
  fl.coins = 10 + Math.floor(x / 10);
  for (const [s, name] of PLACES)
    if (s > 0 && x >= s && !fl.seen.has(s)) {
      fl.seen.add(s);
      const i = PLACES.findIndex(q => q[0] === s);
      bannerQ.push(i % 4 === 0 ? DISTRICTS[i / 4] + ' · ' + name : name);
    }
  for (const m of [100, 250, 500, 1000, 2000, 3000, 4000])
    if (x >= m && !fl.mile.has(m)) {
      fl.mile.add(m);
      if (m > fl.prevBest) bannerQ.push(t('proto.milestone', { distance: F.m(m) }));
    }
  if (banner && fl.t >= banner.until) banner = null;
  if (!banner && bannerQ.length && !(fl.t >= e.warn && fl.t < e.end)) {
    const text = bannerQ.shift();
    banner = { text, kind: 'info', until: fl.t + 1.5 };
    say(text);
  }
  if (fl.t >= fl.T + (reduced() ? 0.3 : 0.85)) finish();
}
function settle() {
  const D = fl.D0 * (1 + fl.bonus),
    prev = p.best,
    earned = 10 + Math.floor(D / 10);
  const news = PLACES.filter(([s]) => s > 0 && s > prev && s <= D).map(([, n]) => n);
  if (news.length) p.atlasNew = true;
  p.best = Math.max(p.best, D);
  p.coins += earned;
  p.attempts++;
  if (p.best >= 4910) p.delivered = true;
  return {
    D,
    prev,
    earned,
    news,
    glider: prev < 100 && D >= 100,
    record: D > prev,
    T: fl.T,
    power: fl.power,
    angle: fl.angle,
    hits: fl.ev.result && fl.ev.result !== 'miss' ? 1 : 0,
    perfect: fl.ev.result === 'perfect' ? 1 : 0,
  };
}
function finish() {
  result = settle();
  result.shown = reduced() ? 1 : 0;
  result.t0 = performance.now();
  go('result');
  say(
    [
      t(result.record && result.prev > 0 ? 'result.titleRecord' : 'result.title'),
      F.m(result.D, 1),
      t('result.coinsLabel', { count: F.num(result.earned), n: result.earned }),
    ].join('. '),
  );
}
function leaveToMenu() {
  if (screen === 'flight' && opt.leave === 'count') {
    if (!fl.ev.result) fl.ev.result = 'miss';
    const r = settle();
    goMenu();
    toast(t('status.counted', { distance: F.m(r.D, 1), count: F.num(r.earned) }));
  } else goMenu();
}

// --- výsledek ---
function renderResult() {
  if (!result) return;
  const r = result,
    k = Math.min(1, r.shown ?? 1);
  $('r-title').textContent = t(r.record && r.prev > 0 ? 'result.titleRecord' : 'result.title');
  $('r-dist').textContent = F.m(r.D * k, 1);
  $('r-sub').textContent =
    r.prev <= 0
      ? ''
      : r.record
        ? t('result.overBest', { distance: F.m(r.D - r.prev, 1) })
        : t('result.bestLine', { distance: F.m(p.best, 1) });
  $('r-sub').classList.toggle('rec', r.record);
  $('r-coins').textContent = '+' + F.num(Math.round(r.earned * k)) + ' ◈';
  $('r-coins').setAttribute(
    'aria-label',
    t('result.coinsLabel', { count: F.num(r.earned), n: r.earned }),
  );
  $('r-break').textContent = t('result.breakdown', { base: 10, distance: F.num(r.earned - 10) });
  $('r-hint').textContent = t(
    r.power < 0.45 ? 'proto.hint.weak' : r.angle > 30 ? 'proto.hint.steep' : 'proto.hint.fine',
  );
  const news = [
    ...r.news.map(n => t('result.newPlace', { place: n })),
    r.glider ? t('result.gliderUnlocked') : '',
  ].filter(Boolean);
  $('r-news').hidden = !news.length;
  $('r-news').textContent = news.join(' · ');
  const np = nextPlace(p.best);
  $('r-next').textContent = np
    ? t('result.next', { place: np[1], distance: F.m(np[0] - p.best) })
    : t('menu.delivered');
  $('r-time').textContent = F.s(r.T);
  $('r-power').textContent = F.pct(r.power);
  $('r-angle').textContent = F.deg(r.angle);
  $('r-events').textContent = t('result.eventsLine', {
    hits: r.hits,
    total: 1,
    perfect: r.perfect,
  });
}
const skipCount = () => {
  if (result && result.shown < 1) {
    result.shown = 1;
    renderResult();
  }
};
$('result').addEventListener('pointerdown', skipCount);

// --- panely: obsah ---
function renderPanel(name) {
  if (name === 'workshop') {
    $('w-coins').textContent = F.num(p.coins);
    $('w-empty').hidden = p.coins > 0;
    $('w-models').replaceChildren(
      ...['dart', 'glider'].map(m => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn model';
        b.setAttribute('aria-pressed', p.model === m);
        const locked = m === 'glider' && p.best < 100;
        b.disabled = locked;
        b.innerHTML = `<strong>${m === 'dart' ? '➤' : '▱'} ${t('model.' + m)}</strong><span>${locked ? t('model.glider.locked', { distance: F.m(100) }) : t('model.' + m + '.desc')}</span>`;
        b.onclick = () => {
          p.model = m;
          renderPanel('workshop');
          $('w-models').querySelectorAll('button')[m === 'dart' ? 0 : 1].focus();
        };
        return b;
      }),
    );
    $('w-branches').replaceChildren(
      ...BRANCHES.map(id => {
        const L = p.levels[id],
          el = document.createElement('div');
        el.className = 'branch';
        const h = document.createElement('h3');
        h.textContent = t('branch.' + id);
        const pips = document.createElement('p');
        pips.className = 'pips';
        pips.innerHTML =
          [0, 1, 2, 3, 4].map(i => `<i class="${i < L ? 'on' : ''}"></i>`).join('') +
          ` <span>${L} / 5</span>`;
        const pv = document.createElement('p');
        pv.className = 'preview';
        const now = '+' + F.pct(L * EFF[id]),
          after = '+' + F.pct((L + 1) * EFF[id]);
        pv.innerHTML =
          `${t('branch.' + id + '.what')}: ` +
          (L < 5
            ? t('workshop.preview', { now: `<span>${now}</span>`, after: `<b>${after}</b>` })
            : `<b>${now}</b>`);
        const buy = document.createElement('button');
        buy.type = 'button';
        buy.className = 'btn primary';
        const price = PRICES[L];
        buy.textContent = L >= 5 ? t('detail.max') : t('detail.buy', { price: F.num(price) });
        buy.disabled = L >= 5 || p.coins < price;
        const short = document.createElement('p');
        short.className = 'short';
        short.textContent =
          L < 5 && p.coins < price
            ? t('detail.missing', { count: F.num(price - p.coins), n: price - p.coins })
            : '';
        buy.onclick = () => {
          if (p.coins < price || L >= 5) return;
          p.coins -= price;
          p.levels[id]++;
          renderPanel('workshop');
          renderAll();
          say(t('branch.' + id) + ' · ' + (L + 1) + ' / 5');
          const again = $('w-branches')
            .querySelectorAll('.branch')
            [BRANCHES.indexOf(id)].querySelector('button');
          (again.disabled ? $('w-throw') : again).focus();
        };
        el.append(h, pips, pv, buy, short);
        return el;
      }),
    );
  }
  if (name === 'atlas') {
    $('at-coins').textContent = F.num(p.coins);
    const found = p.best >= 100 ? PLACES.filter(([s]) => s <= p.best).length : 0;
    $('at-found').textContent = found ? t('atlas.found', { found }) : t('atlas.empty');
    const np = nextPlace(p.best),
      cols = ['var(--pink-300)', 'var(--sky-300)', 'var(--amber-300)', 'var(--magenta-400)'];
    $('at-grid').replaceChildren(
      ...PLACES.map(([s, n], i) => {
        const d = document.createElement('div'),
          isF = found && s <= p.best,
          isN = np && np[0] === s && p.best >= 0;
        d.className = 'pc' + (isF ? '' : isN ? ' next' : ' unknown');
        d.style.setProperty('--dc', isF ? cols[Math.floor(i / 4)] : 'transparent');
        d.innerHTML = isF
          ? `<small>${DISTRICTS[Math.floor(i / 4)]}</small><b>${n}</b>`
          : isN
            ? `<small>${F.m(s)}</small><b>${n}</b>`
            : '<b aria-hidden="true">???</b><span class="sr-only">?</span>';
        return d;
      }),
    );
  }
}

// --- vstupy ---
const tap = $('tap');
tap.addEventListener('pointerdown', e => {
  if (panels.length || e.button !== 0) return;
  e.preventDefault();
  if (screen === 'aim') {
    aimFromPointer(e);
    try {
      tap.setPointerCapture(e.pointerId);
    } catch {}
    begin(e.pointerId);
  } else if (screen === 'flight') flightPress();
});
tap.addEventListener('pointermove', e => {
  if (screen === 'aim' && !panels.length && (held === null || held === e.pointerId))
    aimFromPointer(e);
});
tap.addEventListener('pointerup', e => release(e.pointerId));
tap.addEventListener('pointercancel', cancelHold);
const act = $('act');
act.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  e.preventDefault();
  if (screen === 'aim') {
    try {
      act.setPointerCapture(e.pointerId);
    } catch {}
    begin(e.pointerId);
  } else flightPress();
});
act.addEventListener('pointerup', e => release(e.pointerId));
act.addEventListener('pointercancel', cancelHold);
act.addEventListener('lostpointercapture', e => {
  if (held === e.pointerId) cancelHold();
});
for (const [id, d] of [
  ['a-down', -1],
  ['a-up', 1],
]) {
  let rep = null,
    tm = null;
  const b = $(id),
    stop = () => {
      clearTimeout(tm);
      clearInterval(rep);
      tm = rep = null;
    };
  b.addEventListener('click', e => {
    if (e.detail === 0) setAngle(angle + d);
  }); // klávesnice
  b.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    setAngle(angle + d);
    tm = setTimeout(() => {
      rep = setInterval(() => setAngle(angle + d), 80);
    }, 400);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, stop);
}
const otherButton = e =>
  (e.target instanceof HTMLButtonElement ||
    e.target instanceof HTMLInputElement ||
    (e.target instanceof HTMLElement && e.target.tagName === 'SUMMARY')) &&
  e.target !== act;
addEventListener('keydown', e => {
  if (e.key === 'Escape' && !panels.length) {
    e.preventDefault();
    back();
    return;
  }
  if (panels.length) return;
  if (screen === 'menu' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    const v = visibleMenu(),
      i = v.indexOf(document.activeElement);
    if (i >= 0) {
      e.preventDefault();
      v[(i + (e.key === 'ArrowDown' ? 1 : v.length - 1)) % v.length].focus();
    }
    return;
  }
  if (screen === 'result') skipCount();
  if (screen === 'aim' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    setAngle(angle + (['ArrowUp', 'ArrowRight'].includes(e.key) ? 1 : -1));
    return;
  }
  if (
    (e.code === 'Space' || (e.key === 'Enter' && e.target === act)) &&
    (screen === 'aim' || screen === 'flight') &&
    !otherButton(e)
  ) {
    e.preventDefault();
    if (e.repeat) return;
    screen === 'aim' ? begin('key') : flightPress();
  }
});
addEventListener('keyup', e => {
  if ((e.code === 'Space' || e.key === 'Enter') && screen === 'aim' && held === 'key') {
    e.preventDefault();
    release('key');
  }
});
addEventListener('blur', () => cancelHold());
function autoPause() {
  if ((screen === 'aim' || screen === 'flight') && !panels.length)
    openPanel('pause', { opener: $('act'), away: true });
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) autoPause();
});

// --- tlačítka ---
$('m-play').onclick = startAim;
$('m-workshop').onclick = () => openPanel('workshop', { opener: $('m-workshop') });
$('m-atlas').onclick = () => openPanel('atlas', { opener: $('m-atlas') });
$('m-settings').onclick = () => openPanel('settings', { opener: $('m-settings') });
$('m-warning-close').onclick = () => {
  $('m-warning').hidden = true;
  visibleMenu()[0]?.focus();
};
$('m-reload').onclick = () => location.reload();
// Po pauze jde fokus na hlavní herní tlačítko (ne na ❚❚), aby mezerník znovu neotevřel pauzu.
$('h-pause').onclick = () => openPanel('pause', { opener: $('act') });
$('p-resume').onclick = () => closeTop();
$('p-settings').onclick = () => openPanel('settings', { opener: $('p-settings') });
$('p-menu').onclick = leaveToMenu;
$('s-close').onclick = () => closeTop();
for (const b of $('s-lang').querySelectorAll('[data-lang]'))
  b.onclick = () => {
    applyLang(b.dataset.lang);
    saveS();
  };
for (const b of $('s-motion').querySelectorAll('[data-motion]'))
  b.onclick = () => {
    S.motion = b.dataset.motion;
    applyMotion();
    saveS();
  };
for (const id of ['music', 'sfx']) {
  const r = $('s-' + id);
  r.value = S[id];
  r.oninput = () => {
    S[id] = +r.value;
    renderSound();
    saveS();
  };
}
function renderSound() {
  for (const id of ['music', 'sfx']) {
    $('s-' + id).disabled = S.mute;
    $('s-' + id + '-v').textContent = S.mute ? t('settings.muted') : F.pct(S[id] / 100);
    $('s-' + id).setAttribute('aria-valuetext', S.mute ? t('settings.muted') : F.pct(S[id] / 100));
  }
  $('s-mute').checked = S.mute;
}
$('s-mute').onchange = () => {
  S.mute = $('s-mute').checked;
  renderSound();
  saveS();
};
$('s-tbar').checked = S.tbar;
$('s-tbar').onchange = () => {
  S.tbar = $('s-tbar').checked;
  saveS();
};
$('s-wide').checked = S.wide;
$('s-wide').onchange = () => {
  S.wide = $('s-wide').checked;
  saveS();
};
$('s-reset').onclick = () => openPanel('confirm', { opener: $('s-reset') });
$('c-keep').onclick = () => closeTop();
$('c-delete').onclick = () => {
  p = clone(SCEN.first);
  closeAll();
  fl = null;
  result = null;
  go('menu');
  toast(t('confirm.done'));
};
$('w-close').onclick = () => closeTop();
$('w-throw').onclick = startAim;
$('at-close').onclick = () => closeTop();
$('at-throw').onclick = startAim;
$('at-workshop').onclick = () => openPanel('workshop');
$('r-again').onclick = startAim;
$('r-workshop').onclick = () => openPanel('workshop', { opener: $('r-workshop') });
$('r-atlas').onclick = () => openPanel('atlas', { opener: $('r-atlas') });
$('r-menu').onclick = goMenu;

// --- stavové zprávy ---
let toastTm = 0,
  chipTm = 0;
function toast(text, ms = 2800) {
  const el = $('toast');
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toastTm);
  toastTm = setTimeout(() => {
    el.hidden = true;
  }, ms);
}
function chip(text, ms = 0) {
  const el = $('status-chip');
  clearTimeout(chipTm);
  if (!text) {
    el.hidden = true;
    return;
  }
  el.textContent = text;
  el.hidden = false;
  if (ms)
    chipTm = setTimeout(() => {
      el.hidden = true;
    }, ms);
}
function say(text) {
  const el = $('live');
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = text;
  });
}

// --- smyčka ---
let last = 0;
function frame(now) {
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
  last = now;
  const rm = reduced();
  if (lost && lostAt && now - lostAt > 1000) {
    lostAt = 0;
    chip(t('status.glLost'));
    autoPause();
  }
  const running = !panels.length && !lost;
  if (screen === 'aim' && running && held !== null) {
    heldTime += dt;
    renderHud();
  }
  if (screen === 'flight' && running) {
    stepFlight(dt);
    if (screen === 'flight') renderHud();
  }
  if (screen === 'result' && result && result.shown < 1) {
    result.shown = Math.min(1, (now - result.t0) / 480);
    renderResult();
  }
  if (screen === 'menu' && !rm) menuCam += dt * 3;
  const W = innerWidth,
    H = innerHeight,
    k = kpm(),
    view = { skin: opt.skin, reduced: rm, lost };
  if (screen === 'menu') {
    view.camX = menuCam;
    view.district = district(p.best);
    const u = ((now / 1000) % 12) / 12;
    view.plane = rm
      ? { visible: true, screen: [W * 0.62, H * 0.4], angle: -0.08 }
      : {
          visible: u < 0.5,
          screen: [-40 + (W + 80) * (u / 0.5), H * 0.42 + Math.sin(u * 12) * H * 0.04],
          angle: -0.08 + Math.cos(u * 12) * 0.08,
        };
  } else if (screen === 'aim') {
    view.camX = (-0.3 * W) / k;
    view.district = 0;
    view.plane = { visible: true, x: 0, y: 2, angle: (-angle * Math.PI) / 180 };
    view.aim = { angle, charge: held !== null ? chargeAt(heldTime) : 0 };
  } else if (fl) {
    const camX = fl.x - (0.32 * W) / k,
      [x1, y1] = posAt(fl.t),
      [x2, y2] = posAt(fl.t + 0.05);
    view.camX = camX;
    view.district = district(fl.x);
    view.trail = fl.trail;
    view.plane = {
      visible: true,
      x: fl.x,
      y: fl.y,
      angle: Math.atan2(-(y2 - y1) * Math.min(k, (H * 0.55) / 60), Math.max(0.01, (x2 - x1) * k)),
    };
    const e = fl.ev;
    if (screen === 'flight' && fl.t >= e.warn && (fl.t <= e.end || fl.t < e.shownUntil)) {
      const z = zones();
      view.ring = {
        ...z,
        p: Math.max(0, (fl.t - e.start) / e.len),
        active: fl.t >= e.start && !e.result,
        result: e.result,
      };
    }
  } else {
    view.camX = 0;
    view.district = 0;
  }
  scene.draw(view);
  requestAnimationFrame(frame);
}

// --- ovládání prototypu ---
const sel = $('pc-scen');
for (const [id, s] of Object.entries(SCEN)) {
  const o = document.createElement('option');
  o.value = id;
  o.textContent = s.label;
  o.selected = id === opt.scenario;
  sel.append(o);
}
function setQ(k, v, reload = false) {
  const q = new URLSearchParams(location.search);
  v === null ? q.delete(k) : q.set(k, v);
  const url = location.pathname + '?' + q;
  reload ? location.assign(url) : history.replaceState(history.state, '', url);
  $('pc-url').textContent = '?' + q;
}
sel.onchange = () => setQ('scenario', sel.value, true);
for (const r of document.querySelectorAll('.proto input[type=radio]')) {
  const cur = { skin: opt.skin, first: opt.first, leave: opt.leave, goal: opt.goal ? '1' : '0' }[
    r.name
  ];
  r.checked = r.value === cur;
  r.onchange = () => {
    if (r.name === 'first') return setQ('first', r.value, true);
    opt[r.name] = r.name === 'goal' ? r.value === '1' : r.value;
    setQ(r.name, r.value);
    if (r.name === 'skin') document.body.dataset.skin = r.value;
    renderAll();
  };
}
$('pc-assist').checked = opt.assist;
$('pc-assist').onchange = () => {
  opt.assist = $('pc-assist').checked;
  setQ('assist', opt.assist ? '1' : null);
  $('s-wide-row').hidden = $('s-wide-h').hidden = !opt.assist;
};
$('pc-lose').onclick = () => {
  if (lost) return;
  lost = true;
  lostAt = performance.now();
};
$('pc-restore').onclick = () => {
  if (!lost) return;
  lost = false;
  lostAt = 0;
  chip(t('status.glBack'), 2000);
};
$('pc-warn').onclick = () => {
  $('m-warning').hidden = false;
};
$('pc-hide').onclick = autoPause;
$('pc-url').textContent = location.search || '?';

// --- start ---
document.body.dataset.skin = opt.skin;
$('s-wide-row').hidden = $('s-wide-h').hidden = !opt.assist;
applyLang(S.lang);
renderSound();
// Sekce Sound se ve hře ukáže, až hra načte audio (spec §4); prototyp ji ukazuje vždy.
if (p.error) {
  $('m-nav').hidden = true;
  $('m-status').hidden = true;
  $('m-error').hidden = false;
  $('m-reload').focus();
} else {
  const ready = () => {
    for (const b of $('m-nav').querySelectorAll('button')) b.disabled = false;
    $('m-status').textContent = '';
    $('m-status').removeAttribute('data-i18n');
    if (opt.first === 'direct' && p.attempts === 0) startAim();
    else {
      go('menu');
      if (location.hash === '#atlas') openPanel('atlas', { opener: $('m-atlas') });
    }
  };
  p.loading ? setTimeout(ready, 1600) : ready();
}
requestAnimationFrame(frame);
