// Atlas content: ids, keys and structure, no tunable numbers (research/atlas/01-navrh-atlasu.md §6.2). Ids are stable and match params.mjs.
// Player texts live in src/locales/{en,cs}.js under `atlas.*`; district and place names come from `district.*` and `place.<kind>`.
// Text properties are live getters over t(), so a language switch needs no rebuild; they are never stored in state or save.
// Effect templates: bonus.effect = [{key, if}], one sentence per key `atlas.bonus.<id>.effect.<n>`, shown when `if` is empty or the level value is truthy (atlas-text.js).
import { t, getLang } from './i18n.js';

const live = (base, keys) => {
  for (const [prop, key] of Object.entries(keys))
    Object.defineProperty(base, prop, { get: () => t(key), enumerable: true });
  return base;
};
// District names are uppercase HUD labels in district.*; in sentences they read as "Sunrise roofs".
const sentence = s => s.charAt(0) + s.slice(1).toLocaleLowerCase(getLang());

const D = (id, color, characterId) => {
  const ch = `atlas.character.${characterId}`,
    d = `atlas.district.${id}`;
  const character = live({ id: characterId }, { name: `${ch}.name`, role: `${ch}.role` });
  Object.defineProperty(character, 'lines', {
    get: () => [1, 2, 3].map(n => t(`${ch}.line${n}`)),
    enumerable: true,
  });
  const district = live({ id, color, character }, { frame: `${d}.frame` });
  Object.defineProperty(district, 'locals', {
    value: live({}, { bird: `${d}.bird`, gust: `${d}.gust` }),
    enumerable: true,
  });
  return Object.defineProperty(district, 'name', {
    get: () => sentence(t(`district.${id}`)),
    enumerable: true,
  });
};
// Colors are palette ids for the UI, not player text. Character ids (bolts, zippy) stay for the save; their names are in locales.
export const DISTRICTS = [
  D('violet', 'pink', 'bolts'),
  D('moon', 'azure', 'marge'),
  D('sunset', 'gold', 'stella'),
  D('core', 'magenta', 'zippy'),
];

// index = position on the route (scenes.js ROUTE), district = index/4. kind = key in ROUTE (place.<kind> and place.<kind>.story in locales).
// Which place opens a paper is a number (atlas-numbers paper.openAtPlace).
const P = (id, kind, bonus) =>
  live(
    { id, kind, bonus },
    {
      name: `place.${kind}`,
      story: `place.${kind}.story`,
      teaser: `atlas.place.${id}.teaser`,
    },
  );
export const PLACES = [
  P('roofs', 'roofs', 'glider'),
  P('market', 'market', 'chain'),
  P('gardens', 'garden', 'pinwheel'),
  P('railway', 'rail', 'steam'),
  P('warehouses', 'warehouse', 'tape'),
  P('cranes', 'cranes', 'crane'),
  P('bridge', 'bridge', 'skip'),
  P('lighthouse', 'lighthouse', 'gull'),
  P('fields', 'fields', 'momentum'),
  P('ridge', 'turbines', 'thermal'),
  P('saddle', 'peaks', 'echo'),
  P('observatory', 'observatory', 'star'),
  P('gates', 'gate', 'drone'),
  P('terraces', 'terraces', 'paperCrane'),
  P('tower', 'tower', 'onAir'),
  P('harbor', 'port', 'encore'),
];

// kind: model | event | event-mod | rescue | start | speed | wind | finale. verb = id of atlas.verb.*; line = one sentence without numbers (teaser, list).
// effect = [{key, if}] sentences filled from atlas-numbers values; null = no levels.
const B = (id, kind, verb, tags, conds, extra = {}) =>
  live(
    {
      id,
      kind,
      verbId: verb,
      tags,
      effect: conds
        ? conds.map((cond, i) => ({ key: `atlas.bonus.${id}.effect.${i}`, if: cond }))
        : null,
      art: null,
      ...extra,
    },
    { name: `atlas.bonus.${id}.name`, line: `atlas.bonus.${id}.pitch`, verb: `atlas.verb.${verb}` },
  );
export const BONUSES = {
  glider: B('glider', 'model', 'model', ['style'], null, { workshop: true }),
  chain: B('chain', 'event-mod', 'tap', ['combos'], [null]),
  pinwheel: B('pinwheel', 'wind', 'before', ['every'], [null, 'noHeadwind']),
  steam: B('steam', 'event', 'taptap', ['every'], [null, 'push', 'burst']),
  tape: B('tape', 'rescue', 'passive', ['misses'], [null, null]),
  crane: B('crane', 'start', 'before', ['every'], [null]),
  skip: B('skip', 'rescue', 'landing', ['every'], [null]),
  gull: B('gull', 'event-mod', 'hold', ['every'], [null]),
  momentum: B('momentum', 'speed', 'passive', ['long'], [null]),
  thermal: B('thermal', 'event', 'tapPlace', ['perfects'], [null, 'push', 'second']),
  echo: B('echo', 'event-mod', 'passive', ['perfects'], [null]),
  star: B('star', 'event', 'tap', ['perfects'], [null, null], { admits: true }),
  drone: B('drone', 'event', 'tap', ['every'], [null, 'wider', 'pair']),
  paperCrane: B('paperCrane', 'rescue', 'passive', ['misses'], [null, null], { admits: true }),
  onAir: B('onAir', 'speed', 'passive', ['combos'], [null]),
  encore: B('encore', 'finale', 'finale', ['style'], null),
};

export const TAGS = live(
  {},
  Object.fromEntries(
    ['combos', 'misses', 'perfects', 'every', 'long', 'style'].map(id => [id, `atlas.tag.${id}`]),
  ),
);

const S = (id, active, verb) =>
  live(
    { id, active, verbId: verb },
    {
      name: `atlas.special.${id}.name`,
      verb: `atlas.verb.${verb}`,
      tradeoff: `atlas.special.${id}.tradeoff`,
      hint: `atlas.special.${id}.hint`,
    },
  );
export const SPECIALS = {
  cushion: S('cushion', true, 'tap'),
  sharp: S('sharp', false, 'passive'),
  dive: S('dive', true, 'hold'),
  calm: S('calm', false, 'passive'),
  whistle: S('whistle', true, 'tap'),
  rocket: S('rocket', true, 'tap'),
};

export const PAPERS = live(
  {},
  Object.fromEntries(['copy', 'kraft', 'washi', 'neon'].map(id => [id, `atlas.paper.${id}`])),
);

// Nodes not bound to a place (placeId optional). requires: 'finished' | {found:placeId} | null.
// hidden = never shown (no price, no "Coming soon"); wave = release wave of the node (2 = later, not shown yet). nodeStates() skips both.
// A hidden node has no player text yet (no keys), so nothing of it can leak into the UI.
const N = (id, requires, placeId, flags) =>
  live(
    { id, requires, placeId, ...flags },
    flags.hidden ? {} : { name: `atlas.node.${id}.name`, line: `atlas.node.${id}.pitch` },
  );
export const NODES = {
  nightRoute: N('nightRoute', 'finished', 'harbor', { hidden: true }),
  autoQte: N('autoQte', null, null, { wave: 2 }),
};
