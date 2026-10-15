// Atlas panel UI (B1a, research/atlas/01-navrh-atlasu.md §3–5, bible 05 kap. 10). The first half is pure view-model functions (no DOM,
// tested in tests/atlas-ui.test.js), the second half renders them into the <dialog id="atlas"> with mountAtlas(dialog, api).
// All player text goes through t() and atlas-text.js; logic, prices and levels come from atlas.js / atlas-numbers.js.
import * as CONTENT from './atlas-content.js';
import { NUMBERS } from './atlas-numbers.js';
import * as A from './atlas.js';
import * as X from './atlas-text.js';
import { altKey, imageUrl, silhouette } from './atlas-postcards.js';
import { t } from './i18n.js';

// Paper tones of the districts (CSS tokens in style.css: tomato, teal, mustard, cobalt); decoration only, the name always carries identity.
export const TONES = ['tomato', 'teal', 'mustard', 'cobalt'];
const titleOf = (d, c) => t(`atlas.district.${c.DISTRICTS[d].id}.title`);
const meters = m => X.fmtMeters(Math.max(1, Math.ceil(m)));

// --- view model (pure) ---
export function cardModel(st, c = CONTENT) {
  if (st.state === 'teaser')
    return {
      index: st.index,
      kind: 'teaser',
      interactive: true,
      name: st.name,
      status: t('atlas.label.next'),
      distance: t('atlas.teaser.distance', { m: meters(st.metersToGo) }),
      aria: `${st.name}, ${t('atlas.label.next')}, ${t('atlas.teaser.distance', { m: meters(st.metersToGo) })}`,
    };
  if (st.state === 'unknown')
    return {
      index: st.index,
      kind: 'unknown',
      interactive: false,
      name: t('atlas.card.unknown'),
      aria: t('atlas.card.unknownAria'),
    };
  const levelled = st.maxLevel > 1,
    status = [
      st.isNew && t('atlas.label.new'),
      st.state === 'max'
        ? t('atlas.label.maxCrown')
        : levelled && t('atlas.label.level', { n: st.level }),
    ]
      .filter(Boolean)
      .join(' · ');
  return {
    index: st.index,
    kind: st.state,
    interactive: true,
    name: st.name,
    bonusName: st.bonusName,
    status,
    isNew: !!st.isNew,
    postcard: postcardOf(st.index, c),
    dots: levelled ? { level: st.level, max: st.maxLevel } : null,
    aria: [st.name, st.bonusName, status].filter(Boolean).join(', '),
  };
}
// Postcard of a found place: 3D screenshot (district 1) with alt text, else the paper silhouette of the landmark (decorative).
export function postcardOf(index, c = CONTENT) {
  const pl = c.PLACES[index],
    src = imageUrl(pl.id);
  return { kind: pl.kind, image: src, alt: src ? t(altKey(pl.id)) : null };
}
// Four districts; an unreached one shows only its title and mood sentence (guard 08 N2) plus the teaser card if the next place is there.
export function districtsModel(p, c = CONTENT, n = NUMBERS) {
  const sts = A.placeStates(p, c, n),
    reached = A.reachedDistrict(p.best, n),
    sum = A.districtSummary(p, c, n);
  return c.DISTRICTS.map((d, i) => {
    const own = sts.filter(s => s.district === i),
      title = titleOf(i, c);
    return {
      index: i,
      id: d.id,
      tone: TONES[i],
      title,
      reached: i <= reached,
      frame: i > reached ? d.frame : null,
      frameAria: i > reached ? t('atlas.card.frameAria', { district: title }) : null,
      count:
        i <= reached ? t('atlas.label.found', { found: sum[i].found, total: sum[i].total }) : null,
      cards: own.filter(s => s.state !== 'frame').map(s => cardModel(s, c)),
    };
  });
}
export function undoModel(p, c = CONTENT, n = NUMBERS) {
  const u = p.atlas?.undo;
  if (!u || A.levelOf(p, u.id, c, n) !== u.level) return null;
  return { id: u.id, price: u.price, label: t('atlas.button.undo') };
}
// Detail of a found place or the teaser; null for unknown / hidden places.
export function detailModel(p, index, c = CONTENT, n = NUMBERS) {
  const st = A.placeStates(p, c, n)[index];
  if (!st || st.state === 'unknown' || st.state === 'frame') return null;
  const pl = c.PLACES[index],
    b = c.BONUSES[pl.bonus],
    d = {
      index,
      kind: st.state === 'teaser' ? 'teaser' : 'found',
      title: pl.name,
      placeOf: t('atlas.label.placeOf', {
        district: titleOf(st.district, c),
        n: (index % n.route.perDistrict) + 1,
      }),
      bonus: pl.bonus,
      tone: TONES[st.district],
      postcard: st.state === 'teaser' ? null : postcardOf(index, c),
      bonusName: b.name,
      verb: b.verb,
      tags: b.tags.map(id => c.TAGS[id]),
    };
  if (st.state === 'teaser')
    return {
      ...d,
      teaser: pl.teaser,
      pitch: X.teaserBonusLine(pl.bonus, c),
      distance: t('atlas.teaser.distance', { m: meters(st.metersToGo) }),
    };
  const s = A.upgradeStatus(p, pl.bonus, c, n),
    fx = X.effectChange(pl.bonus, st.level, c, n),
    done = A.isFinished(p, n);
  return {
    ...d,
    story: pl.story,
    level: st.level,
    maxLevel: st.maxLevel,
    levelText: st.maxLevel > 1 ? t('atlas.label.levelOf', { n: st.level, max: st.maxLevel }) : null,
    pitch: pl.bonus === 'encore' && done ? t('atlas.bonus.encore.pitchDone') : b.line,
    now: fx.now,
    next: fx.next,
    nextLabel: fx.next ? t('atlas.label.nextLevel', { n: st.level + 1 }) : null,
    notes: [
      b.workshop && t('atlas.card.gliderNote'),
      pl.bonus === 'encore' && !done && t('atlas.card.encoreLocked'),
    ].filter(Boolean),
    paperLink: st.paper ? t('atlas.button.paperLink', { paper: c.PAPERS[st.paper] }) : null,
    buy: buyModel(s, st.level),
    undo: undoModel(p, c, n)?.id === pl.bonus ? undoModel(p, c, n) : null,
  };
}
// Price line of upgradeStatus(): buy / missing coins (disabled, says how many) / max / nothing (no levels, price not tuned yet).
export function buyModel(s, level) {
  if (s.reason === 'max') return { kind: 'max', label: X.priceLine(s) };
  if (s.reason === 'coins')
    return { kind: 'missing', label: X.priceLine(s), missing: s.missing, price: s.price, level };
  if (s.ok) return { kind: 'buy', label: X.priceLine(s), price: s.price, level };
  return null;
}
export function pocketsModel(p, c = CONTENT, n = NUMBERS) {
  const st = A.pocketStatus(p, n),
    slots = p.atlas?.pockets?.slots ?? [],
    next = st.next;
  return {
    owned: Array.from({ length: st.owned }, (_, i) => {
      const id = slots[i] ?? null,
        name = id ? c.SPECIALS[id]?.name : null;
      return {
        slot: i,
        n: i + 1,
        id,
        name,
        title: t('atlas.pocket.name', { n: i + 1 }),
        text: name ?? t('atlas.pocket.empty'),
        aria: t('atlas.pocket.aria', { n: i + 1, content: name ?? t('atlas.pocket.empty') }),
      };
    }),
    next:
      next && next.visible
        ? {
            n: next.n,
            ok: next.ok,
            line: X.pocketLine(st, c),
            label: next.ok
              ? t('atlas.button.openPocket', { price: X.fmtCoins(next.price) })
              : t('atlas.button.toGo', { price: X.fmtCoins(next.missing) }),
          }
        : null,
  };
}
// Picker for one pocket: unlocked specials in two groups, blocked ones greyed out with the reason; later ones only as "More in <district>".
export function pickerModel(p, slot, c = CONTENT, n = NUMBERS) {
  const v = A.specialsView(p, slot, c, n),
    cur = p.atlas?.pockets?.slots?.[slot] ?? null,
    row = r => ({
      id: r.id,
      name: c.SPECIALS[r.id].name,
      tradeoff: c.SPECIALS[r.id].tradeoff,
      verb: c.SPECIALS[r.id].verb,
      ok: r.ok,
      equipped: r.id === cur,
      reason: r.ok ? null : X.reasonLine(r, r.id, c),
    }),
    pair = n.pockets.exclusive[0];
  return {
    slot,
    n: slot + 1,
    title: t('atlas.pocket.name', { n: slot + 1 }),
    current: cur,
    active: v.active.map(row),
    passive: v.passive.map(row),
    activeRule: t('atlas.pocket.activeRule'),
    passiveRule: pair
      ? t('atlas.pocket.passiveRule', { a: c.SPECIALS[pair[0]].name, b: c.SPECIALS[pair[1]].name })
      : null,
    moreIn: v.moreIn != null ? t('atlas.pocket.moreIn', { district: titleOf(v.moreIn, c) }) : null,
    emptyLabel: cur ? t('atlas.button.emptyPocket') : null,
  };
}
// Nodes outside the places: hidden and later-wave nodes never appear, and a node without a tuned price is skipped (no "Coming soon").
export function nodesModel(p, c = CONTENT, n = NUMBERS) {
  return A.nodeStates(p, c, n)
    .filter(x => x.state !== 'soon')
    .map(x => ({
      id: x.id,
      name: c.NODES[x.id].name,
      line: c.NODES[x.id].line,
      owned: x.state === 'owned',
      ok: x.ok,
      label:
        x.state === 'owned'
          ? t('atlas.label.owned')
          : x.ok
            ? t('atlas.button.unlock', { price: X.fmtCoins(x.price) })
            : t('atlas.button.toGo', { price: X.fmtCoins(Math.max(0, x.price - (p.coins || 0))) }),
    }));
}
export function atlasModel(p, c = CONTENT, n = NUMBERS) {
  return {
    wallet: { text: X.fmtCoins(p.coins || 0), aria: X.coinsLabel(p.coins || 0) },
    goal: X.goalLine(A.nextGoal(p, c, n), c),
    rule: t('atlas.rule'),
    showRule: A.showHint(p),
    districts: districtsModel(p, c, n),
    pockets: pocketsModel(p, c, n),
    nodes: nodesModel(p, c, n),
    undo: undoModel(p, c, n),
  };
}
// Order of keyboard navigation: interactive cards district by district; Up/Down jump to the same position in the neighbouring district.
export function stepCard(model, from, key) {
  const rows = model.districts.map(d => d.cards.filter(x => x.interactive).map(x => x.index)),
    flat = rows.flat(),
    i = flat.indexOf(from);
  if (i < 0) return flat[0] ?? null;
  if (key === 'ArrowRight') return flat[Math.min(flat.length - 1, i + 1)];
  if (key === 'ArrowLeft') return flat[Math.max(0, i - 1)];
  if (key === 'Home') return flat[0];
  if (key === 'End') return flat[flat.length - 1];
  const r = rows.findIndex(x => x.includes(from)),
    pos = rows[r].indexOf(from),
    dir = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  if (!dir) return from;
  for (let k = r + dir; k >= 0 && k < rows.length; k += dir)
    if (rows[k].length) return rows[k][Math.min(pos, rows[k].length - 1)];
  return from;
}

// --- DOM ---
// Children may be nested arrays and falsy placeholders (cond && node); text values are never 0 or ''.
const clean = kids =>
  kids.flat(Infinity).filter(x => x != null && x !== false && x !== 0 && x !== '');
const fill = (el, ...kids) => el.replaceChildren(...clean(kids));
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...clean(kids));
  return el;
};
const SVGNS = 'http://www.w3.org/2000/svg';
// Postcard picture: lazy <img> with a silhouette fallback if the file is missing; silhouettes are decorative (the card carries the name).
function postcardEl(pc) {
  const sil = () => {
    const d = silhouette(pc.kind),
      svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', d.viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    svg.setAttribute('class', 'atlas-pc');
    svg.setAttribute('aria-hidden', 'true');
    for (const sh of d.shapes) {
      const e = document.createElementNS(SVGNS, sh.tag);
      for (const [k, v] of Object.entries(sh.attrs)) e.setAttribute(k, v);
      e.setAttribute('class', `atlas-pc-${sh.tone}`);
      svg.append(e);
    }
    return svg;
  };
  if (!pc.image) return sil();
  const img = h('img', {
    class: 'atlas-pc-img',
    src: pc.image,
    alt: pc.alt,
    width: 480,
    height: 300,
    loading: 'lazy',
    decoding: 'async',
  });
  img.addEventListener('error', () => img.replaceWith(sil()), { once: true });
  return img;
}
const dots = ({ level, max }) =>
  h(
    'span',
    { class: 'atlas-dots', 'aria-hidden': 'true' },
    '●'.repeat(level) + '○'.repeat(max - level),
  );

// api = { getSave(): live save object p, persist(): write it to storage, onChange?(info): after every change (HUD dot, wallet),
//         onNav?(target 'workshop' | 'throw'), content?, numbers? }. Returns { refresh(), destroy() }.
export function mountAtlas(dialog, api) {
  const c = api.content ?? CONTENT,
    n = api.numbers ?? NUMBERS;
  const main =
      dialog.querySelector('.atlas-main') ?? dialog.appendChild(h('div', { class: 'atlas-main' })),
    sheet =
      dialog.querySelector('.atlas-sheet') ??
      dialog.appendChild(h('section', { class: 'atlas-sheet', hidden: true })),
    live =
      dialog.querySelector('.atlas-live') ??
      dialog.appendChild(
        h('p', { class: 'sr-only atlas-live', role: 'status', 'aria-live': 'polite' }),
      ),
    wallet = dialog.querySelector('#atlas-wallet');
  const ui = { sheet: null, focus: null, ruleOpen: false, note: null, back: null };
  const p = () => api.getSave();
  const done = info => {
    api.persist();
    api.onChange?.(info);
  };
  const say = msg => {
    live.textContent = '';
    queueMicrotask(() => (live.textContent = msg));
    ui.note = msg;
  };
  const focusKey = key => dialog.querySelector(`[data-fk="${key}"]`);

  function cardEl(card) {
    const label = h('span', { class: 'atlas-name' }, card.name);
    const body = [
      card.postcard
        ? h('span', { class: 'atlas-pic atlas-has-pc' }, postcardEl(card.postcard))
        : h('span', { class: 'atlas-pic', 'aria-hidden': 'true' }),
      label,
      card.bonusName && h('span', { class: 'atlas-bonus' }, card.bonusName),
      card.distance && h('span', { class: 'atlas-dist' }, card.distance),
      (card.status || card.dots) &&
        h('span', { class: 'atlas-status' }, card.status, card.dots && dots(card.dots)),
    ];
    const attrs = {
      class: `atlas-card atlas-${card.kind === 'max' ? 'level atlas-top-level' : card.kind}`,
      'data-sil': card.index % 4,
    };
    if (!card.interactive)
      return h('div', { ...attrs, role: 'img', 'aria-label': card.aria }, ...body.slice(0, 2));
    return h(
      'button',
      {
        ...attrs,
        type: 'button',
        'data-fk': `card:${card.index}`,
        'data-index': card.index,
        tabindex: ui.focus === card.index ? '0' : '-1',
        'aria-label': card.aria,
        'aria-expanded':
          ui.sheet?.type === 'place' && ui.sheet.index === card.index ? 'true' : 'false',
        onclick: () => openPlace(card.index),
      },
      ...body,
    );
  }
  function districtEl(d) {
    return h(
      'section',
      {
        class: 'atlas-district',
        'data-tone': d.tone,
        'data-reached': d.reached,
        'aria-labelledby': `atlas-d${d.index}`,
      },
      h(
        'h3',
        { id: `atlas-d${d.index}`, class: 'atlas-dtitle' },
        d.title,
        d.count && h('span', { class: 'atlas-count' }, d.count),
      ),
      d.frame && h('p', { class: 'atlas-frame' }, d.frame),
      d.frame &&
        !d.cards.length &&
        h('div', { class: 'atlas-skyline', role: 'img', 'aria-label': d.frameAria }),
      d.cards.length && h('div', { class: 'atlas-cards' }, d.cards.map(cardEl)),
    );
  }
  function pocketsEl(m) {
    if (!m.pockets.owned.length && !m.pockets.next) return null;
    const slotBtn = s =>
      h(
        'button',
        {
          type: 'button',
          class: `atlas-slot${s.id ? ' atlas-filled' : ''}`,
          'data-fk': `pocket:${s.slot}`,
          'aria-label': s.aria,
          'aria-expanded':
            ui.sheet?.type === 'pocket' && ui.sheet.slot === s.slot ? 'true' : 'false',
          onclick: () => openPocket(s.slot),
        },
        h('span', { class: 'atlas-slot-title' }, s.title),
        h('span', { class: 'atlas-slot-text' }, s.text),
      );
    const nx = m.pockets.next;
    return h(
      'section',
      { class: 'atlas-pockets', 'aria-labelledby': 'atlas-pockets-title' },
      h('h3', { id: 'atlas-pockets-title', class: 'atlas-subhead' }, t('atlas.label.pockets')),
      h(
        'div',
        { class: 'atlas-slots' },
        m.pockets.owned.map(slotBtn),
        nx &&
          h(
            'div',
            { class: 'atlas-slot atlas-locked' },
            h('span', { class: 'atlas-slot-title' }, nx.line),
            h(
              'button',
              { type: 'button', 'data-fk': 'pocket-buy', disabled: !nx.ok, onclick: buyPocket },
              nx.label,
            ),
          ),
      ),
    );
  }
  function render() {
    const m = atlasModel(p(), c, n),
      active = document.activeElement,
      keep = active && dialog.contains(active) ? active.dataset.fk : null,
      top = dialog.scrollTop;
    if (
      ui.focus == null ||
      !m.districts.some(d => d.cards.some(x => x.index === ui.focus && x.interactive))
    )
      ui.focus =
        m.districts.flatMap(d => d.cards).find(x => x.kind === 'teaser')?.index ??
        stepCard(m, -1, 'Home');
    if (wallet)
      wallet.replaceChildren(
        h('span', { 'aria-hidden': 'true' }, m.wallet.text),
        h('span', { class: 'sr-only' }, m.wallet.aria),
      );
    fill(
      main,
      h(
        'div',
        { class: 'atlas-top' },
        m.showRule || ui.ruleOpen
          ? h('p', { class: 'atlas-rule' }, m.rule)
          : h(
              'button',
              {
                type: 'button',
                class: 'quiet',
                'data-fk': 'rule',
                'aria-expanded': 'false',
                onclick: () => ((ui.ruleOpen = true), render()),
              },
              t('atlas.ruleButton'),
            ),
        h('p', { class: 'atlas-goal' }, m.goal),
      ),
      pocketsEl(m),
      h(
        'div',
        { class: 'atlas-route', role: 'group', 'aria-label': t('atlas.subtitle') },
        m.districts.map(districtEl),
      ),
      m.nodes.length &&
        h(
          'section',
          { class: 'atlas-nodes', 'aria-labelledby': 'atlas-nodes-title' },
          h('h3', { id: 'atlas-nodes-title', class: 'atlas-subhead' }, t('atlas.ui.nodes')),
          m.nodes.map(x =>
            h(
              'div',
              { class: 'atlas-node' },
              h('div', {}, h('strong', {}, x.name), h('p', {}, x.line)),
              h(
                'button',
                {
                  type: 'button',
                  'data-fk': `node:${x.id}`,
                  disabled: x.owned || !x.ok,
                  onclick: () => buyNode(x.id),
                },
                x.label,
              ),
            ),
          ),
        ),
      api.onNav &&
        h(
          'nav',
          { class: 'atlas-foot' },
          h(
            'button',
            { type: 'button', onclick: () => api.onNav('workshop') },
            t('atlas.button.workshop'),
          ),
          h(
            'button',
            { type: 'button', onclick: () => api.onNav('throw') },
            t('atlas.button.throw'),
          ),
        ),
    );
    renderSheet();
    const target = keep && focusKey(keep);
    if (target && !target.disabled) target.focus({ preventScroll: true });
    else if (keep && ui.sheet)
      sheet.querySelector('[data-sheet-title]')?.focus({ preventScroll: true });
    dialog.scrollTop = top;
  }
  function renderSheet() {
    const s = ui.sheet;
    sheet.hidden = !s;
    if (!s) return void fill(sheet);
    const close = h(
      'button',
      {
        type: 'button',
        class: 'icon',
        'data-fk': 'sheet-close',
        'aria-label': t('atlas.button.closeCard'),
        onclick: closeSheet,
      },
      '×',
    );
    const note = ui.note && h('p', { class: 'atlas-note', 'aria-hidden': 'true' }, ui.note);
    if (s.type === 'place') {
      const d = detailModel(p(), s.index, c, n);
      if (!d) return void ((ui.sheet = null), (sheet.hidden = true));
      const b = d.buy;
      sheet.setAttribute('aria-labelledby', 'atlas-sheet-title');
      fill(
        sheet,
        h(
          'div',
          { class: 'atlas-sheet-head' },
          h(
            'div',
            {},
            h('h3', { id: 'atlas-sheet-title', 'data-sheet-title': '', tabindex: '-1' }, d.title),
            h('p', { class: 'atlas-placeof' }, d.placeOf),
          ),
          close,
        ),
        h(
          'p',
          { class: 'atlas-bonusline' },
          h('strong', {}, d.bonusName),
          d.levelText && h('span', {}, ` · ${d.levelText}`),
        ),
        d.postcard &&
          h(
            'div',
            { class: 'atlas-pic atlas-pc-big', 'data-tone': d.tone },
            postcardEl(d.postcard),
          ),
        d.kind === 'teaser'
          ? [
              h('p', {}, d.teaser),
              h('p', { class: 'atlas-pitch' }, d.pitch),
              h('p', { class: 'atlas-dist' }, d.distance),
            ]
          : [
              h(
                'p',
                { class: 'atlas-chips' },
                h('span', { class: 'atlas-chip' }, d.verb),
                d.tags.map(x => h('span', { class: 'atlas-chip' }, x)),
              ),
              h('p', { class: 'atlas-pitch' }, d.pitch),
              d.now &&
                h('p', { class: 'atlas-fx' }, h('b', {}, `${t('atlas.label.now')}: `), d.now),
              d.next &&
                h('p', { class: 'atlas-fx atlas-fx-next' }, h('b', {}, `${d.nextLabel}: `), d.next),
              d.notes.map(x => h('p', { class: 'atlas-small' }, x)),
              h('p', { class: 'atlas-small' }, d.story),
              api.onNav &&
                d.paperLink &&
                h(
                  'button',
                  { type: 'button', class: 'quiet', onclick: () => api.onNav('workshop') },
                  d.paperLink,
                ),
              api.onNav &&
                d.bonus === 'glider' &&
                h(
                  'button',
                  { type: 'button', class: 'quiet', onclick: () => api.onNav('workshop') },
                  t('atlas.button.workshopLink'),
                ),
              note,
              (b || d.undo) &&
                h(
                  'div',
                  { class: 'atlas-buyrow' },
                  b && b.kind === 'max' && h('p', { class: 'atlas-maxline' }, b.label),
                  b &&
                    b.kind !== 'max' &&
                    h(
                      'button',
                      {
                        type: 'button',
                        class: b.kind === 'buy' ? 'atlas-buy' : '',
                        'data-fk': 'buy',
                        disabled: b.kind !== 'buy',
                        onclick: () => buy(d.bonus),
                      },
                      b.label,
                    ),
                  d.undo &&
                    h('button', { type: 'button', 'data-fk': 'undo', onclick: undo }, d.undo.label),
                ),
            ],
      );
      return;
    }
    const pk = pickerModel(p(), s.slot, c, n),
      group = (rows, rule) =>
        rows.length
          ? [
              h('p', { class: 'atlas-small' }, rule),
              h(
                'ul',
                { class: 'atlas-list' },
                rows.map(r =>
                  h(
                    'li',
                    {},
                    h(
                      'button',
                      {
                        type: 'button',
                        class: 'atlas-pick',
                        'data-fk': `special:${r.id}`,
                        'aria-pressed': String(r.equipped),
                        'aria-disabled': r.ok ? null : 'true',
                        onclick: () => r.ok && equip(s.slot, r.id),
                      },
                      h('strong', {}, r.name, ' ', h('span', { class: 'atlas-verb' }, r.verb)),
                      h('span', {}, r.tradeoff),
                      (r.reason || r.equipped) &&
                        h(
                          'span',
                          { class: 'atlas-reason' },
                          r.equipped ? t('atlas.reason.equipped') : r.reason,
                        ),
                    ),
                  ),
                ),
              ),
            ]
          : null;
    sheet.setAttribute('aria-labelledby', 'atlas-sheet-title');
    fill(
      sheet,
      h(
        'div',
        { class: 'atlas-sheet-head' },
        h(
          'div',
          {},
          h('h3', { id: 'atlas-sheet-title', 'data-sheet-title': '', tabindex: '-1' }, pk.title),
          h('p', { class: 'atlas-placeof' }, t('atlas.pocket.pick')),
        ),
        close,
      ),
      group(pk.active, h('b', {}, t('atlas.pocket.active'), ' · ', pk.activeRule)),
      group(
        pk.passive,
        h('b', {}, t('atlas.pocket.passive'), pk.passiveRule && ` · ${pk.passiveRule}`),
      ),
      pk.moreIn && h('p', { class: 'atlas-small' }, pk.moreIn),
      note,
      h('p', { class: 'atlas-small' }, t('atlas.pocket.swapFree')),
      pk.emptyLabel &&
        h(
          'button',
          { type: 'button', 'data-fk': 'special:none', onclick: () => equip(s.slot, null) },
          pk.emptyLabel,
        ),
    );
  }

  function openPlace(index) {
    const d = detailModel(p(), index, c, n);
    if (!d) return;
    ui.back = `card:${index}`;
    ui.sheet = { type: 'place', index };
    ui.focus = index;
    ui.note = null;
    if (d.kind === 'found' && !(p().atlas?.seen ?? []).includes(d.bonus)) {
      A.markSeen(p(), d.bonus);
      done({ type: 'seen', id: d.bonus });
    }
    render();
    sheet.querySelector('[data-sheet-title]')?.focus({ preventScroll: true });
    sheet.scrollIntoView?.({ block: 'nearest' });
  }
  function openPocket(slot) {
    const sp = pickerModel(p(), slot, c, n);
    ui.back = `pocket:${slot}`;
    ui.sheet = { type: 'pocket', slot };
    ui.note = null;
    let seen = false;
    for (const r of [...sp.active, ...sp.passive])
      if (!(p().atlas?.seen ?? []).includes(r.id)) A.markSeen(p(), r.id), (seen = true);
    if (seen) done({ type: 'seen' });
    render();
    sheet.querySelector('[data-sheet-title]')?.focus({ preventScroll: true });
  }
  function closeSheet() {
    const back = ui.back;
    ui.sheet = null;
    ui.note = null;
    render();
    (back && focusKey(back))?.focus();
  }
  function buy(id) {
    const before = A.levelOf(p(), id, c, n);
    if (!A.upgrade(p(), id, c, n)) return;
    say(X.levelToast(id, before + 1, c));
    done({ type: 'buy', id, level: before + 1 });
    render();
  }
  function undo() {
    const u = undoModel(p(), c, n);
    if (!u || !A.undoLast(p(), c, n)) return;
    say(t('atlas.toast.undone', { price: X.fmtCoins(u.price) }));
    done({ type: 'undo', id: u.id });
    render();
  }
  function buyPocket() {
    if (!A.buyPocket(p(), n)) return;
    const owned = p().atlas.pockets.owned;
    say(t('atlas.toast.pocketOpen', { n: owned }));
    done({ type: 'pocket', n: owned });
    openPocket(owned - 1);
  }
  function equip(slot, id) {
    if (!A.equip(p(), slot, id, c, n)) return;
    say(
      id
        ? t('atlas.toast.equipped', { special: c.SPECIALS[id].name, n: slot + 1 })
        : t('atlas.toast.emptied', { n: slot + 1 }),
    );
    done({ type: 'equip', slot, id });
    render();
  }
  function buyNode(id) {
    if (!A.buyNode(p(), id, c, n)) return;
    say(t('atlas.toast.unlocked', { node: c.NODES[id].name }));
    done({ type: 'node', id });
    render();
  }

  main.addEventListener('keydown', e => {
    if (!e.target.classList?.contains('atlas-card') || !e.target.dataset.index) return;
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = stepCard(atlasModel(p(), c, n), +e.target.dataset.index, e.key);
    if (next == null) return;
    ui.focus = next;
    for (const el of main.querySelectorAll('.atlas-card[data-index]'))
      el.tabIndex = +el.dataset.index === next ? 0 : -1;
    focusKey(`card:${next}`)?.focus();
  });
  // Esc closes the open detail first, only the next one closes the dialog (capture, before the game's own handler).
  dialog.addEventListener(
    'keydown',
    e => {
      if (e.key !== 'Escape' || !ui.sheet) return;
      e.preventDefault();
      e.stopPropagation();
      closeSheet();
    },
    true,
  );
  dialog.addEventListener(
    'cancel',
    e => {
      if (!ui.sheet) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      closeSheet();
    },
    true,
  );
  // Opening: fresh render, the first three opens show the rule sentence (hint counter), first ever open shows the first place.
  let wasOpen = dialog.open;
  const opened = () => {
    ui.sheet = null;
    ui.note = null;
    ui.ruleOpen = false;
    // wide screens only: on a phone the sheet would cover the map
    const first =
      !(p().atlas?.hintOpens > 0) &&
      A.foundCount(p().best, n) > 0 &&
      !!globalThis.matchMedia?.('(min-width: 720px)').matches;
    if (first) ui.sheet = { type: 'place', index: 0 };
    ui.back = first ? 'card:0' : null;
    if (first) A.markSeen(p(), c.PLACES[0].bonus);
    render();
    (focusKey(`card:${ui.focus}`) ?? dialog.querySelector('.icon'))?.focus({ preventScroll: true });
    for (const x of nodesModel(p(), c, n)) A.markSeen(p(), x.id);
    A.openAtlas(p());
    done({ type: 'open' });
  };
  const obs = new MutationObserver(() => {
    if (dialog.open && !wasOpen) opened();
    wasOpen = dialog.open;
  });
  obs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  if (dialog.open) opened();
  else render();
  return { refresh: render, destroy: () => obs.disconnect() };
}
