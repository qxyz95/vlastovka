// Dílna (M2): stromy Power 3 / Paper 12 / Folds 3 a volba modelu, funkční minimum nad gear.js. Vzhled, žebřík papírů
// a náhled „≈ +X m“ dodá C4 (research/obsah/02-ux-dilna.md). Texty jen přes t(), ceny a úrovně z gear.js (progression-numbers.js).
import { t, num, unit, pct } from './i18n.js';
import { BRANCHES, branchStatus, buy, maxLevel, priceOf } from './gear.js';
import { PROGRESSION as P } from './progression-numbers.js';
import { ROUTE } from './scenes.js';
import { NUMBERS } from './atlas-numbers.js';

const W = P.workshop,
  pace = level => 1 + W.paper.steps.slice(0, level).reduce((a, b) => a + b, 0);
// Úrovně uzlů jedné řady: Power a Folds všechny, Paper jen druh papíru s příští úrovní (3 uzly místo 12).
export function nodeLevels(id, level) {
  const max = maxLevel(id);
  if (id !== 'paper') return Array.from({ length: max }, (_, i) => i + 1);
  const per = W.paper.perTier,
    from = Math.floor(Math.min(level, max - 1) / per) * per;
  return Array.from({ length: per }, (_, i) => from + i + 1);
}
// Text účinku větve: čísla z progression-numbers, takže sledují ladění. Paper = rychlost letu (tempo π), ne klouzavost.
export function effectText(id, level) {
  const plus = x => '+' + pct(x);
  if (id === 'power') return t('branch.power.effect', { speed: plus(W.power.step) });
  if (id === 'folds')
    return t('branch.fold.effect', {
      steady: plus(W.folds.steady),
      window: plus(W.folds.window),
      qte: plus(W.folds.push),
    });
  const to = Math.min(level + 1, maxLevel('paper'));
  return t('branch.paper.effectSpeed', { from: num(pace(level), 2), to: num(pace(to), 2) });
}
// root = <dialog id="workshop"> (#tree, #detail, #dart, #glider, #glider-description); getSave() vrací save,
// onChange() po koupi nebo změně modelu (ui.js uloží a obnoví zbytek obrazovky). -> {refresh(), focusPicked()}
export function mountWorkshop(root, { getSave, onChange }) {
  const q = sel => root.querySelector(sel),
    el = (tag, text, cls) => {
      const e = document.createElement(tag);
      if (text != null) e.textContent = text;
      if (cls) e.className = cls;
      return e;
    };
  let picked = 'power';
  for (const m of ['dart', 'glider'])
    q('#' + m).onclick = () => {
      const p = getSave();
      if (m === 'glider' && p.best < NUMBERS.gliderAt) return;
      p.model = m;
      onChange();
    };
  const statusKey = (s, l) =>
    l <= s.level
      ? 'node.owned'
      : l > s.level + 1 || s.next?.reason === 'later'
        ? 'node.locked'
        : s.next?.reason === 'coins'
          ? 'node.poor'
          : 'node.available';
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
    const rows = BRANCHES.map(b => {
      const s = branchStatus(p, b.id),
        row = el('div', null, 'branch'),
        nodes = el('div', null, 'nodes');
      row.dataset.branch = b.id;
      row.append(
        el(
          'div',
          `${b.icon}  ${t('branch.' + b.key)} · ${t('workshop.levelOf', { level: s.level, max: s.max })}`,
          'branch-label',
        ),
      );
      for (const l of nodeLevels(b.id, s.level)) {
        const owned = l <= s.level,
          locked = !owned && statusKey(s, l) === 'node.locked',
          node = el('button', null, 'node' + (owned ? ' owned' : locked ? ' locked' : ''));
        node.type = 'button';
        if (picked === b.id && l === (s.next?.level ?? s.level)) node.classList.add('picked');
        const small = el('small', owned ? t('node.done') : num(priceOf(b.id, l)) + ' ◈');
        node.append(`${owned ? '✓' : locked ? '·' : b.icon} ${l}`, small);
        node.setAttribute(
          'aria-label',
          t('node.aria', { branch: t('branch.' + b.key), level: l, status: t(statusKey(s, l)) }),
        );
        node.onclick = () => {
          picked = b.id;
          refresh();
          focusPicked();
        };
        nodes.append(node);
      }
      row.append(nodes);
      return row;
    });
    q('#tree').replaceChildren(...rows);
    const b = BRANCHES.find(x => x.id === picked),
      s = branchStatus(p, b.id),
      n = s.next,
      button = el('button', n ? t('detail.buy', { price: num(n.price) }) : t('detail.bought'));
    button.id = 'buy';
    button.type = 'button';
    button.disabled = !n?.ok;
    button.onclick = () => {
      if (buy(getSave(), b.id)) {
        onChange();
        focusPicked();
      }
    };
    q('#detail').replaceChildren(
      el('span', t('detail.eyebrow', { level: n?.level ?? s.level }), 'eyebrow'),
      el('h3', b.icon + ' ' + t('branch.' + b.key)),
      el('p', effectText(b.id, s.level)),
      el(
        'p',
        !n
          ? t('detail.owned')
          : n.reason === 'later'
            ? t('workshop.paperLater', { place: t('place.' + ROUTE[n.place].kind) })
            : t('detail.price', { price: num(n.price) }) +
              ' · ' +
              (n.reason === 'coins'
                ? t('detail.missing', { count: n.missing })
                : t('detail.ready')),
      ),
      button,
    );
  }
  function focusPicked() {
    q(`#tree [data-branch="${picked}"] .picked`)?.focus();
  }
  return { refresh, focusPicked };
}
