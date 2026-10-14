// Dílna v podkroví (karta H3 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.1): výloha postupu a pozadí panelu Dílny.
// Stůl s lampou, stohy papíru, kelímek s tužkami a řezačka; police s rolemi papírů (přibývají s druhy papíru), nástěnka s pohlednicemi míst
// Atlasu (přibývají s místy), provázek s hotovými barevnými vlaštovkami bez obrysu (S-6). Zvolenou vlaštovku na stole kreslí plane.js.
// Vše o tón tmavší a méně syté než fasáda (ve stínu střechy): barva = mix(token, city.side, .2). Stav (role, pohlednice) se čte ze savu při změně, ne za snímek.
// Souřadnice: x na střed domu (jako H2), y = 0 podlaha podkroví, z = 0 líc domu (zadní stěna podkroví v LAUNCH.house.back).
import { palette, mix, PAPER_TOKENS as T } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { block, lista, panel, cutout, strip } from './parts.js';
import { LAUNCH } from './launch-site.js';

const H = LAUNCH.house,
  X0 = -(H.x1 - H.x0) / 2,
  BACK = H.back,
  DIM = 0.2;
// Role papírů v pořadí žebříku (bible 17.3: Copy, Kraft, Washi, Stříbrná fólie) z tokenů: bílá patří vlaštovce (Copy krémová), fólie sklem čtvrti (úsvit #cfe2ec).
export const ROLLS = Object.freeze(['copy', 'kraft', 'washi', 'foil']),
  CARDS = 16;
export const DESK = Object.freeze({ x: X0 + 0.8, w: 3.4, h: 0.8, d: 0.8, front: -2.4 }),
  BOARD = Object.freeze({ x: X0 + 4.6, w: 2.6, y: 0.9, h: 1.6 }),
  SHELF = Object.freeze({ x: X0 + 0.6, w: 3, y: 1.7 });
const C = () => {
  const P = palette('papir'),
    D = P.city.districts,
    dim = c => mix(c, P.city.side, DIM);
  return {
    dim,
    desk: dim(T.kraftDark),
    lamp: dim(T.teal),
    cup: dim(T.teal),
    board: dim(T.kraft),
    card: dim(T.cream),
    shelf: dim(T.kraftDark),
    pencil: dim(T.pencil),
    cutter: dim(T.card),
    rolls: [T.cream, T.kraft, T.card, D[0].glass].map(dim),
    pastel: P.life.pastel.map(dim),
    place: i => dim(D[i >> 2].near[(i % 4) % D[i >> 2].near.length]),
    near: D[0].near.map(dim),
  };
};

function build(p) {
  const c = C(),
    out = [],
    dz = DESK.front,
    top = DESK.h;
  // stůl: deska (kvádr 3,4 × 0,8 m) na dvou nohách
  out.push(
    block({
      x: DESK.x,
      w: DESK.w,
      y: top - 0.08,
      h: 0.08,
      front: dz,
      d: DESK.d,
      color: c.desk,
      part: 'desk',
    }),
    ...[DESK.x + 0.05, DESK.x + DESK.w - 0.13].map(x =>
      panel({ x, w: 0.08, h: top - 0.08, front: dz - 0.05, color: c.desk, part: 'desk' }),
    ),
  );
  // lampa na pravém konci stolu: patka, dvě ramena, stínítko (trojúhelník), teal ve stínu
  const lx = DESK.x + DESK.w - 0.6,
    lz = dz - 0.4;
  out.push(
    panel({ x: lx - 0.15, w: 0.3, y: top, h: 0.05, front: lz, color: c.lamp, part: 'lamp' }),
    strip([lx, top + 0.04], [lx - 0.25, top + 0.65], 0.05, {
      front: lz,
      color: c.lamp,
      part: 'lamp',
    }),
    strip([lx - 0.25, top + 0.65], [lx + 0.05, top + 0.9], 0.05, {
      front: lz,
      color: c.lamp,
      part: 'lamp',
    }),
    cutout(
      [
        [lx - 0.12, top + 0.68],
        [lx + 0.32, top + 0.78],
        [lx + 0.02, top + 1.02],
      ],
      { front: lz + 0.01, color: c.lamp, part: 'lamp' },
    ),
  );
  // stohy papíru (3 barvy), kelímek se 3 tužkami, řezačka (deska a nůž)
  out.push(
    ...[0, 1, 2].map(i =>
      panel({
        x: DESK.x + 1.8,
        w: 0.9,
        y: top + i * 0.16,
        h: 0.16,
        front: dz - 0.3,
        color: c.near[[4, 1, 5][i]],
        part: 'papers',
      }),
    ),
    panel({ x: DESK.x + 0.3, w: 0.2, y: top, h: 0.25, front: dz - 0.2, color: c.cup, part: 'cup' }),
    ...[0, 1, 2].map(i =>
      panel({
        x: DESK.x + 0.33 + i * 0.06,
        w: 0.03,
        y: top + 0.15,
        h: 0.28 - i * 0.04,
        front: dz - 0.25,
        color: c.pastel[i * 2],
        part: 'pencils',
      }),
    ),
    panel({
      x: DESK.x + 0.7,
      w: 0.8,
      y: top,
      h: 0.04,
      front: dz - 0.3,
      color: c.cutter,
      part: 'cutter',
    }),
    strip([DESK.x + 0.75, top + 0.06], [DESK.x + 1.45, top + 0.25], 0.03, {
      front: dz - 0.29,
      color: c.pencil,
      part: 'cutter',
    }),
  );
  // police s rolemi papírů na zadní stěně (role = kotouč jen čelem s dutinkou)
  out.push(
    lista({
      x: SHELF.x,
      w: SHELF.w,
      y: SHELF.y,
      h: 0.1,
      front: BACK + 0.4,
      d: 0.38,
      color: c.shelf,
      part: 'shelf',
    }),
  );
  for (let i = 0; i < p.rolls; i++) {
    const x = SHELF.x + 0.4 + i * 0.7;
    out.push(
      {
        shape: 'disc',
        x,
        y: SHELF.y + 0.27,
        r: 0.17,
        n: 10,
        z: BACK + 0.2,
        d: 0.04,
        color: c.rolls[i],
        part: 'roll',
      },
      {
        shape: 'disc',
        x,
        y: SHELF.y + 0.27,
        r: 0.06,
        n: 6,
        z: BACK + 0.24,
        d: 0.04,
        color: c.shelf,
        part: 'roll',
      },
    );
  }
  // nástěnka: kraftová deska, pohlednice 4 × 4 (řádek = čtvrť Atlasu shora, sloupec = místo), krémová kartička s obrázkem v barvě místa
  out.push(
    panel({
      x: BOARD.x,
      w: BOARD.w,
      y: BOARD.y,
      h: BOARD.h,
      front: BACK + 0.05,
      color: c.board,
      part: 'board',
    }),
  );
  for (let i = 0; i < p.cards; i++) {
    const cx = BOARD.x + 0.05 + (i % 4) * 0.65,
      cy = BOARD.y + BOARD.h - 0.43 - (i >> 2) * 0.4;
    out.push(
      panel({
        x: cx,
        w: 0.55,
        y: cy,
        h: 0.34,
        front: BACK + 0.07,
        color: c.card,
        part: 'postcard',
      }),
      panel({
        x: cx + 0.04,
        w: 0.47,
        y: cy + 0.1,
        h: 0.2,
        front: BACK + 0.08,
        color: c.place(i),
        part: 'postcard',
      }),
    );
  }
  // provázek pod střechou s hotovými vlaštovkami (barevné, bez obrysu, ne bílé)
  const sz = -3.5,
    a = [X0 + 1.5, 3.3],
    b = [-X0 - 1.5, 3.25],
    y = x => a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
  out.push(strip(a, b, 0.025, { front: sz, color: c.pencil, part: 'string' }));
  [
    [-3, c.near[1]],
    [-1, c.near[2]],
    [1.2, c.board],
    [3.2, c.near[4]],
  ].forEach(([x, col]) => {
    const t = y(x);
    out.push(
      cutout(
        [
          [x + 0.5, t - 0.2],
          [x + 0.1, t - 0.12],
          [x, t - 0.04],
          [x + 0.08, t - 0.3],
        ],
        { front: sz + 0.01, color: col, part: 'planes' },
      ),
    );
  });
  return out;
}
const Pp = (values, def) => Object.freeze({ values: Object.freeze(values), default: def });
export default Object.freeze({
  id: 'workshop-interior',
  name: 'Dílna v podkroví',
  district: 0,
  layers: LOD_LAYER,
  hero: true,
  prototype:
    'Dětská dílna v podkroví: stůl s lampou a stohy papíru, police s rolemi papírů, nástěnka s pohlednicemi, vlaštovky na provázku.',
  purpose:
    'Výloha postupu (role přibývají s druhy papíru, pohlednice s místy Atlasu) a pozadí panelu Dílny (kamera najede na stůl, ~5 m).',
  // rolls 1–4 druhy papíru, cards 0–16 pohlednic; výchozí = nejbohatší stav (katalog a strop).
  params: Object.freeze({
    rolls: Pp([1, 2, 3, 4], 4),
    cards: Pp(
      Array.from({ length: CARDS + 1 }, (_, i) => i),
      CARDS,
    ),
  }),
  size: Object.freeze({ w: 9.9, h: 3.31, d: 3.8 }),
  // Strop 11 kap. 3.7: [200, 0, 0] (za oddálení se interiér neukazuje, stín nemá).
  tris: Object.freeze([200, 0, 0]),
  lod: Object.freeze([p => build(p), () => [], () => []]),
  shadow: () => [],
});
