// Město: keš míst podle indexu (cityChunk je lokální), skupina posunutá o chunkOffset(screen), stream nejvýš 1 nového místa za snímek,
// prewarm v Dílně, volání districts[i].build/update. Vlastní R1.
// createCity(ctx) → {group,buildChunk(index,screen),stream(plan),prewarm(indices),update(frameCtx),dispose(),stats()}.
// ctx = {scene,materials,ramp,hull,mood(),reduced}. Místo = karty (paper-cards.js) ve 4 sloučených meshích země, dálka, střed, ulice
// s paperMaterial(id) + stíny na zem (materials.paper.shadows, vyměnitelný blok v paper.js); žádný obrys, záře, cedule ani okna z textury.
import * as THREE from 'three';
import { cityChunk, placeIndex, chunkOffset } from './geometry.js';
import { districtOf } from './districts/index.js';
import { placeCards, groundCards, hills, PLACE_W, ID } from './paper-cards.js';
import { cardGeometry } from './paper.js';
import { launchStatic, launchShadow } from './models/index.js';

// Klíč keše: index místa; u indexu 0 zvlášť první obrazovka (Dílna + zem doleva) a další okruhy (bez Dílny).
export const chunkKey = (index, screen) =>
  index === 0 ? (screen === 0 ? '0s' : '0r') : String(index);

// Karty jednoho papírového místa po vrstvách (lokální x). opts = districts/*-layout.js paper {farH,roofs}; extra = karty čtvrti (district.cards).
// Klíč '0s' (místo odhodu): zem a kopce i 600 m doleva. Kopce z jedné řady od HILLS_FROM (navazují přes hranice míst).
// '0s' je navíc místo odhodu (S4): pás výhledu S-1 (cityChunk view), dioráma H2–H6 sloučené do ulice a nearShadow = vrhač ulice bez diorámatu
// s proxy H2 + H6 a dítěte (11 kap. 4.2: 0 draw calls navíc). site = parametry modelů diorámatu ({id: {…}}).
export const HILLS_FROM = -1000;
export function paperLayers(index, key = String(index), { opts, extra = [], site = {} } = {}) {
  const launch = key === '0s',
    c = cityChunk(index, { view: launch }),
    x0 = chunkOffset(index),
    left = launch ? -600 : 0,
    own = h => {
      const m = h.x + h.w / 2 - x0;
      return m >= left && m < PLACE_W;
    };
  const cards = [
    ...placeCards(c, 'papir', opts ?? {}),
    ...extra,
    ...hills(HILLS_FROM, x0 + PLACE_W + 400, 'papir', c.biome)
      .filter(own)
      .map(h => ({ ...h, x: h.x - x0 })),
  ];
  const ground = groundCards('papir', c.biome).map(g =>
      left ? { ...g, x: g.x + left, w: g.w - left } : g,
    ),
    near = cards.filter(b => b.layer === 'near');
  return {
    ground,
    far: cards.filter(b => b.layer === 'far'),
    mid: cards.filter(b => b.layer === 'mid'),
    near: launch ? [...near, ...launchStatic(site)] : near,
    ...(launch ? { nearShadow: [...near, ...launchShadow(site)] } : {}),
  };
}
// Meshe papírového místa: země (id 8), dálka (1), střed (2), ulice (4); vrstvy karet vrhají stín na zem (kit.shadows.cast, sdílí geometrii,
// vrstva masky; layers.nearShadow = vlastní geometrie vrhače ulice, místo odhodu). kit = paper.paperKit(). Vrací {group,geos}.
export function buildPaperPlace(layers, kit) {
  const g = new THREE.Group(),
    geos = [],
    add = (list, id, o) => {
      if (!list.length) return;
      const geo = cardGeometry(list),
        m = new THREE.Mesh(geo, kit.material(id, o));
      m.userData.layer = id;
      geos.push(geo);
      g.add(m);
      return m;
    };
  add(layers.ground, ID.ground, { cutK: 0, fiber: 0.05 });
  for (const L of ['far', 'mid', 'near']) {
    const m = add(layers[L], ID[L]);
    if (!m) continue;
    if (L === 'near' && layers.nearShadow) {
      const geo = cardGeometry(layers.nearShadow);
      geos.push(geo);
      g.add(kit.shadows.cast({ geometry: geo }));
    } else g.add(kit.shadows.cast(m));
  }
  return { group: g, geos };
}
export function createCity(ctx) {
  const M = ctx.materials,
    group = new THREE.Group(),
    cache = new Map(),
    live = new Map();
  // Sestaví místo jednou pro daný klíč: karty po vrstvách se stíny a volitelná skupina čtvrti (blok staré Dílny shop z cityChunk(0) se nekreslí).
  function buildChunk(index, screen = index) {
    index = placeIndex(index);
    const key = chunkKey(index, screen);
    if (cache.has(key)) return cache.get(key);
    const d = districtOf(index),
      c0 = cityChunk(index),
      c = { ...c0, screen, blocks: c0.blocks.filter(b => !b.shop) };
    const { group: g, geos } = buildPaperPlace(
      paperLayers(index, key, { opts: d.layout?.paper, extra: d.cards?.(c) ?? [] }),
      M.paper,
    );
    const dg = d.build(c, {
      scene: ctx.scene,
      materials: M,
      ramp: ctx.ramp,
      hull: ctx.hull,
      mood: ctx.mood(),
      reduced: ctx.reduced,
    });
    if (dg) g.add(dg);
    const e = { key, group: g, geos, district: d, dg, screen: null };
    cache.set(key, e);
    return e;
  }
  // Připojí místa z plan.places (seřazená od středu záběru); nové sestaví nejvýš jedno za snímek, z keše bez omezení. Ostatní odpojí (zůstávají v keši).
  function stream(plan) {
    let built = 0;
    const need = new Set(plan.places.map(p => p.screen));
    for (const [s, e] of live)
      if (!need.has(s)) {
        group.remove(e.group);
        e.screen = null;
        live.delete(s);
      }
    for (const p of plan.places) {
      if (live.has(p.screen)) continue;
      const key = chunkKey(p.index, p.screen);
      let e = cache.get(key);
      if (!e) {
        if (built >= 1) continue;
        e = buildChunk(p.index, p.screen);
        built++;
      }
      if (e.screen != null) continue; // stejný index na dvou obrazovkách naráz (nenastane, místa se opakují po 16)
      e.group.position.x = p.x0;
      e.screen = p.screen;
      group.add(e.group);
      live.set(p.screen, e);
    }
    return built;
  }
  const prewarm = (indices = [0, 1, 2]) => indices.forEach(i => buildChunk(i, i));
  function update(frameCtx) {
    for (const e of live.values()) if (e.dg) e.district.update(e.dg, frameCtx);
  }
  function dispose() {
    for (const e of cache.values()) {
      group.remove(e.group);
      e.geos.forEach(g => g.dispose());
      e.group.traverse(o => {
        if (o.geometry && !e.geos.includes(o.geometry)) o.geometry.dispose();
      });
    }
    cache.clear();
    live.clear();
  }
  return {
    group,
    buildChunk,
    stream,
    prewarm,
    update,
    dispose,
    stats: () => ({ cached: cache.size, live: live.size, screens: [...live.keys()] }),
  };
}
