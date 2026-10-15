// Dílna (M2, C4): stromy Power 3 / Folds 3 a žebříček čtyř papírů (Paper 12), detail uzlu (teď → po koupi, cena, Koupit),
// náhled „≈ +X m“ z přehrání hodu (workshop-preview.js), Undo poslední koupě a volba modelu. Nad gear.js, texty jen přes t().
// Ceny, počty úrovní a otevírání papíru jen z gear.js / progression-numbers.js; spec research/obsah/02-ux-dilna.md.
import { t, num, unit, pct } from './i18n.js';
import {
  BRANCHES,
  branchStatus,
  buyUndoable,
  canUndo,
  maxLevel,
  paperOpen,
  priceOf,
  undoBuy,
} from './gear.js';
import { PROGRESSION as P } from './progression-numbers.js';
import { ROUTE } from './scenes.js';
import { NUMBERS } from './atlas-numbers.js';
import { opensPaper } from './atlas.js';
import { previewGain } from './workshop-preview.js';

const W = P.workshop,
  PER = W.paper.perTier,
  pace = level => 1 + W.paper.steps.slice(0, level).reduce((a, b) => a + b, 0);
export const nodeLevels = id => Array.from({ length: maxLevel(id) }, (_, i) => i + 1);
const kindOf = level => NUMBERS.paper.kinds[Math.floor((Math.max(1, level) - 1) / PER)];
// Místo, které druh papíru otevře (první místo s opensPaper === druh); kraft+ až doletem, copy je od začátku.
const placeOfKind = kind => {
  for (let i = 0; i < P.route.places; i++) if (opensPaper(i) === kind) return i;
  return null;
};
const placeName = i => t('place.' + ROUTE[i].kind);
// Žebřík papírů: 4 druhy po PER úrovních. state: done (koupeno), active (rozdělaný), waits (otevřený, čeká na předchozí),
// locked (místo, které druh otevře, ještě nebylo nalezeno; place = jeho index).
export function paperLadder(p) {
  const level = p.levels?.paper ?? 0,
    open = paperOpen(p.best ?? 0);
  return NUMBERS.paper.kinds.slice(0, Math.ceil(maxLevel('paper') / PER)).map((kind, k) => {
    const from = k * PER,
      to = from + PER,
      state = level >= to ? 'done' : open < to ? 'locked' : level >= from ? 'active' : 'waits';
    return {
      kind,
      state,
      done: Math.max(0, Math.min(PER, level - from)),
      total: PER,
      place: state === 'locked' ? placeOfKind(kind) : null,
      levels: Array.from({ length: PER }, (_, i) => from + i + 1),
    };
  });
}
// Text účinku větve: čísla z progression-numbers, takže sledují ladění. Paper = rychlost letu (tempo π), od → do úrovně.
export function effectText(id, from, to = from + 1) {
  const plus = x => '+' + pct(x);
  if (id === 'power') return t('branch.power.effect', { speed: plus(W.power.step) });
  if (id === 'folds')
    return t('branch.fold.effect', {
      steady: plus(W.folds.steady),
      window: plus(W.folds.window),
      qte: plus(W.folds.push),
    });
  const top = maxLevel('paper');
  return t('branch.paper.effectSpeed', {
    from: num(pace(Math.min(from, top)), 2),
    to: num(pace(Math.min(to, top)), 2),
  });
}
// Hodnota větve na dané úrovni (Power, Folds); Paper nese číslo v effectText.
const valueAt = (id, level) => '+' + pct((id === 'power' ? W.power.step : W.folds.window) * level);
const statusKey = (s, l) =>
  l <= s.level
    ? 'node.owned'
    : l > s.level + 1 || s.next?.reason === 'later'
      ? 'node.locked'
      : s.next?.reason === 'coins'
        ? 'node.poor'
        : 'node.available';

// root = <dialog id="workshop"> (#tree, #detail, #dart, #glider, #glider-description, #workshop-coins, #workshop-live);
// getSave() vrací save, onChange() po koupi, vrácení nebo změně modelu (ui.js uloží a obnoví zbytek obrazovky),
// getLastThrow() vrací throwRecord posledního doletěného hodu nebo null. -> {refresh(), focusPicked()}
export function mountWorkshop(root, { getSave, onChange, getLastThrow = () => null }) {
  const q = sel => root.querySelector(sel),
    el = (tag, text, cls) => {
      const e = document.createElement(tag);
      if (text != null) e.textContent = text;
      if (cls) e.className = cls;
      return e;
    },
    say = msg => {
      const live = q('#workshop-live');
      if (live) live.textContent = msg;
    };
  let pick = null, // vybraný uzel {id, level}
    undo = null, // poslední koupě (jen v paměti, platí do dalšího hodu)
    memo = { key: '', value: null };
  for (const m of ['dart', 'glider'])
    q('#' + m).onclick = () => {
      const p = getSave();
      if (m === 'glider' && p.best < NUMBERS.gliderAt) return;
      p.model = m;
      onChange();
    };
  const nextPick = (p, id) => {
    const s = branchStatus(p, id);
    return { id, level: s.next?.level ?? s.max };
  };
  function node(b, s, l, tabbable) {
    const owned = l <= s.level,
      status = statusKey(s, l),
      locked = status === 'node.locked',
      isPick = pick.id === b.id && pick.level === l,
      btn = el(
        'button',
        null,
        'node' + (owned ? ' owned' : locked ? ' locked' : status === 'node.poor' ? ' poor' : ''),
      ),
      name =
        b.id === 'paper'
          ? `${t('branch.paper')}, ${t('atlas.paper.' + kindOf(l))}`
          : t('branch.' + b.key);
    btn.type = 'button';
    btn.dataset.level = String(l);
    btn.tabIndex = tabbable ? 0 : -1;
    if (isPick) btn.classList.add('picked');
    btn.setAttribute('aria-pressed', isPick);
    btn.setAttribute('aria-label', t('node.aria', { branch: name, level: l, status: t(status) }));
    btn.append(
      `${owned ? '✓' : locked ? '·' : b.icon} ${l}`,
      el('small', owned ? t('node.done') : num(priceOf(b.id, l)) + ' ◈'),
    );
    btn.onclick = () => {
      pick = { id: b.id, level: l };
      refresh();
      focusPicked();
    };
    return btn;
  }
  function branchRow(p, b) {
    const s = branchStatus(p, b.id),
      row = el('div', null, 'branch'),
      stop = pick.id === b.id ? pick.level : Math.min(s.level + 1, s.max),
      nodes = (levels, cls = 'nodes') => {
        const box = el('div', null, cls);
        for (const l of levels) box.append(node(b, s, l, l === stop));
        return box;
      };
    row.dataset.branch = b.id;
    row.append(
      el(
        'div',
        `${b.icon}  ${t('branch.' + b.key)} · ${t('workshop.levelOf', { level: s.level, max: s.max })}`,
        'branch-label',
      ),
    );
    if (b.id !== 'paper') {
      row.append(nodes(nodeLevels(b.id)));
      return row;
    }
    const ladder = el('ol', null, 'ladder');
    ladder.setAttribute('aria-label', t('workshop.paperLadder'));
    for (const k of paperLadder(p)) {
      const li = el('li', null, 'kind ' + k.state),
        state =
          k.state === 'done'
            ? t('workshop.kindDone')
            : k.state === 'locked'
              ? '⚑ ' +
                (k.place == null
                  ? t('node.locked')
                  : t('workshop.opensAt', { place: placeName(k.place) }))
              : k.state === 'waits'
                ? t('workshop.kindWaits')
                : t('workshop.kindProgress', { done: k.done, total: k.total });
      li.dataset.kind = k.kind;
      // vzorek papíru před jménem (F2 B14, bible kap. 17: papír se pozná podle tónu), jen ozdoba, jméno nese text
      const head = el('div', null, 'kind-head'),
        swatch = el('span', null, 'kind-swatch');
      swatch.setAttribute('aria-hidden', 'true');
      head.append(
        swatch,
        el('strong', t('atlas.paper.' + k.kind)),
        el('span', state, 'kind-state'),
      );
      li.append(head, nodes(k.levels, 'nodes kind-nodes'));
      ladder.append(li);
    }
    row.append(ladder);
    return row;
  }
  function preview(p, id, level) {
    const last = getLastThrow(),
      key = [
        id,
        level,
        p.attempts,
        p.model,
        JSON.stringify(p.levels),
        p.best,
        JSON.stringify(p.atlas?.levels),
        JSON.stringify(last),
      ].join('|');
    if (memo.key !== key) memo = { key, value: previewGain(p, id, level, last) };
    const g = memo.value;
    if (!g) return null;
    const box = el('div', null, 'preview'),
      m = x => unit(Math.round(x), 'm');
    box.append(
      el(
        'strong',
        Math.round(g.gain) >= 1
          ? t('workshop.preview.' + (g.mode === 'replay' ? 'replay' : 'calm'), {
              gain: m(g.gain),
              now: m(g.now),
              after: m(g.after),
            })
          : t('workshop.preview.same'),
      ),
      el(
        'small',
        t(g.mode === 'replay' ? 'workshop.preview.noteReplay' : 'workshop.preview.noteCalm'),
      ),
    );
    return box;
  }
  function refresh() {
    const p = getSave(),
      gliderOpen = p.best >= NUMBERS.gliderAt;
    for (const m of ['dart', 'glider']) {
      q('#' + m).classList.toggle('selected', p.model === m);
      q('#' + m).setAttribute('aria-pressed', p.model === m);
    }
    q('#glider').disabled = !gliderOpen;
    q('#glider-description').textContent = gliderOpen
      ? t('model.glider.desc')
      : t('model.glider.locked', { distance: unit(NUMBERS.gliderAt, 'm') });
    const wallet = q('#workshop-coins');
    if (wallet) {
      wallet.textContent = '◈ ' + num(p.coins);
      wallet.setAttribute('aria-label', t('menu.coins', { count: p.coins }));
    }
    if (!canUndo(p, undo)) undo = null;
    if (!pick || !BRANCHES.some(b => b.id === pick.id)) pick = nextPick(p, 'power');
    pick.level = Math.max(1, Math.min(pick.level, maxLevel(pick.id)));
    q('#tree').replaceChildren(...BRANCHES.map(b => branchRow(p, b)));
    detail(p);
  }
  function detail(p) {
    const { id, level } = pick,
      b = BRANCHES.find(x => x.id === id),
      s = branchStatus(p, id),
      n = s.next,
      owned = level <= s.level,
      isNext = n?.level === level,
      from = owned ? level - 1 : s.level,
      buyBtn = el('button', null);
    buyBtn.id = 'buy';
    buyBtn.type = 'button';
    buyBtn.disabled = !(isNext && n.ok);
    buyBtn.textContent = owned
      ? t('detail.bought')
      : !isNext
        ? t('workshop.buyFirst', { level: s.level + 1 })
        : n.reason === 'later'
          ? t('workshop.opensAt', { place: placeName(n.place) })
          : n.reason === 'coins'
            ? t('workshop.toGo', { count: num(n.missing) })
            : t('detail.buy', { price: num(n.price) });
    buyBtn.onclick = () => {
      const rec = buyUndoable(getSave(), id);
      if (!rec) return;
      undo = rec;
      pick = nextPick(getSave(), id);
      say(t('workshop.bought', { branch: t('branch.' + b.key), level }));
      onChange();
      focusPicked();
    };
    const label = t('workshop.value.' + id);
    const lines = [
      el('span', t('detail.eyebrow', { level }), 'eyebrow'),
      el(
        'h3',
        b.icon +
          ' ' +
          t('branch.' + b.key) +
          (id === 'paper' ? ' · ' + t('atlas.paper.' + kindOf(level)) : ''),
      ),
      el('p', effectText(id, from, level)),
    ];
    if (id !== 'paper')
      lines.push(
        el(
          'p',
          owned
            ? t('workshop.nowOnly', { label, now: valueAt(id, level) })
            : t('workshop.nowAfter', {
                label,
                now: valueAt(id, s.level),
                after: valueAt(id, level),
              }),
          'value',
        ),
      );
    const box = isNext ? preview(p, id, level) : null;
    if (box) lines.push(box);
    lines.push(
      el(
        'p',
        owned
          ? t('detail.owned')
          : !isNext
            ? t('detail.locked', { level: s.level + 1 })
            : n.reason === 'later'
              ? t('workshop.paperLater', { place: placeName(n.place) })
              : t('detail.price', { price: num(n.price) }) +
                ' · ' +
                (n.reason === 'coins'
                  ? t('detail.missing', { count: n.missing })
                  : t('detail.ready')),
      ),
      buyBtn,
    );
    if (undo) {
      const u = el(
        'button',
        t('workshop.undo', {
          branch: t('branch.' + BRANCHES.find(x => x.id === undo.id).key),
          level: undo.level,
        }),
        'quiet',
      );
      u.id = 'undo';
      u.type = 'button';
      u.onclick = () => {
        const rec = undo;
        if (!undoBuy(getSave(), rec)) return refresh();
        undo = null;
        pick = { id: rec.id, level: rec.level };
        say(t('workshop.undone', { price: num(rec.price) }));
        onChange();
        focusPicked();
      };
      lines.push(u);
    }
    q('#detail').replaceChildren(...lines);
  }
  // Šipky mezi uzly jedné větve jen přesouvají fokus (výběr dělá Enter / mezerník), jeden tab stop na větev.
  q('#tree').onkeydown = e => {
    const cur = e.target?.closest?.('.node');
    if (!cur) return;
    const all = [...cur.closest('.branch').querySelectorAll('.node')],
      i = all.indexOf(cur),
      to = {
        ArrowRight: i + 1,
        ArrowDown: i + 1,
        ArrowLeft: i - 1,
        ArrowUp: i - 1,
        Home: 0,
        End: all.length - 1,
      }[e.key];
    if (to == null) return;
    e.preventDefault();
    all[Math.max(0, Math.min(all.length - 1, to))].focus();
  };
  function focusPicked() {
    q(`#tree [data-branch="${pick?.id}"] .picked`)?.focus();
  }
  return { refresh, focusPicked };
}
