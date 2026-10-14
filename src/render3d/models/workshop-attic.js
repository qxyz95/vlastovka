// Dům dítěte s podkrovím v řezu (karta H2 v research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9.1): úzký krémový měšťanský dům
// (Amsterdam, Malá Strana) s rajčatovou střechou; podkroví je rozříznuté jako domeček pro panenky (přední stěna chybí, řez střechy cutRoof).
// Nahrazuje Dílnu PAPER LAB (model K4 workshop). Souřadnice: x na střed domu, y = 0 pata domu (stojí na opěrné zdi H6), čelo z = 0.
// Interiér podkroví je H3, pavlač s půdními dveřmi H4, trám s kladkou H5. Nápis PAPER LAB zůstává texturou (karta jen cedulka a podtržení).
import { palette, mix, PAPER_TOKENS as T } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import {
  tones,
  block,
  lista,
  panel,
  windowCut,
  door,
  shopfront,
  cutRoof,
  cutout,
  outline,
  CUT_ROOF,
} from './parts.js';
import { LAUNCH } from './launch-site.js';

const H = LAUNCH.house,
  W = H.x1 - H.x0,
  X0 = -W / 2,
  FL = H.ground + H.floors * 3,
  KNEE = FL + H.knee,
  RIDGE = KNEE + H.rise,
  BAYS = 4,
  BAY = 2.95,
  bayX = i => X0 + 1.6 + i * BAY;
// Cedulka PAPER LAB 5,6 × 0,6 m nad okny 2. patra, těsně pod podlahou podkroví (mezi nadpražím okna 8,94 m a podlahou 9,5 m; náčrt 0,8 m by
// zakryl okna), podtržení 2,8 m. Vchod vlevo, výloha ve středu přízemí, schránka vpravo.
export const ATTIC = Object.freeze({
  w: W,
  floor: FL,
  knee: KNEE,
  ridge: RIDGE,
  sign: Object.freeze({ x: 0, y: 8.98, w: 5.6, h: 0.6, front: 0.12 }),
  door: X0 + 1.75,
  shop: Object.freeze([X0 + 4.6, X0 + 8]),
  loftDoor: Object.freeze({ y: 2.1 }),
});
const C = () => {
  const P = palette('papir'),
    D = P.city.districts[0],
    wall = P.workshop.wall;
  return {
    wall,
    roof: T.tomato,
    cut: mix(T.tomato, P.city.cut, 0.55),
    core: P.city.cut,
    navy: D.window,
    warm: P.city.warm,
    card: T.card,
    floor: T.kraft,
    side: P.city.side,
    t: tones(wall),
  };
};

function build(p, lod) {
  const c = C(),
    roof = cutRoof({ x: X0, w: W, y: KNEE, h: H.rise, front: 0.15, roof: c.roof, cut: c.cut, lod });
  // zadní stěna a štít podkroví jedním vystřiženým čelem v kartonu (mírně ve stínu)
  const back = cutout(
    [
      [X0, FL],
      [-X0, FL],
      [-X0, KNEE],
      [0, RIDGE],
      [X0, KNEE],
    ],
    { front: H.back, color: mix(c.card, c.side, 0.1), part: 'atticBack' },
  );
  if (lod === 2)
    return [block({ x: X0, w: W, h: FL, d: H.d, color: c.wall, shape: 'lista' }), back, ...roof];
  const out = [
    block({ x: X0, w: W, h: FL, d: H.d, color: c.wall }),
    panel({ x: X0 - 0.2, w: W + 0.4, h: 0.5, front: 0.05, color: c.t.plinth, part: 'plinth' }),
    back,
    ...roof,
  ];
  // řez podkroví: podlaha (kraft, světlý horní řez), nadezdívky v řezu (krémové s linkou jádra), nad půdními dveřmi jen překlad
  const kz = 0.05,
    ld = ATTIC.loftDoor.y;
  out.push(
    lista({
      x: X0,
      w: W,
      y: FL - 0.2,
      h: 0.2,
      front: 0.02,
      d: 0.02 - H.back,
      color: c.floor,
      part: 'atticFloor',
    }),
    panel({ x: X0 - 0.2, w: 0.45, y: FL, h: H.knee, front: kz, color: c.wall, part: 'knee' }),
    panel({
      x: X0 - 0.2,
      w: 0.06,
      y: FL,
      h: H.knee,
      front: kz + 0.01,
      color: c.core,
      part: 'knee',
    }),
    panel({
      x: -X0 - 0.25,
      w: 0.45,
      y: FL + ld,
      h: H.knee - ld,
      front: kz,
      color: c.wall,
      part: 'knee',
    }),
    panel({
      x: -X0 + 0.14,
      w: 0.06,
      y: FL + ld,
      h: H.knee - ld,
      front: kz + 0.01,
      color: c.core,
      part: 'knee',
    }),
  );
  // okna pater: 4 osy × 2 patra, rámy tmavomodré (ne grafit, S-2), teplé sklo (S-4), příčka (LOD H, 80 px/m)
  const wt = { ...c.t, frame: c.navy, pane: c.warm };
  for (let f = 0; f < H.floors; f++)
    for (let i = 0; i < BAYS; i++)
      out.push(...windowCut({ cx: bayX(i), y: H.ground + f * 3 + 0.9, t: wt, lod, mullion: !lod }));
  // přízemí: dveře 1,1 × 2,2 m se stříškou, výloha s teplým sklem a rajčatovou markýzou, poštovní schránka
  out.push(
    ...door({ cx: ATTIC.door, t: { ...c.t, door: c.navy }, lod, canopy: c.roof }),
    ...shopfront({
      x0: ATTIC.shop[0],
      x1: ATTIC.shop[1],
      t: { ...c.t, frame: c.navy },
      glass: c.warm,
      awning: c.roof,
      lod,
    }),
    lista({
      x: -X0 - 1.4,
      w: 0.45,
      y: 1,
      h: 0.55,
      front: 0.3,
      d: 0.3,
      color: T.tomato,
      part: 'mailbox',
    }),
  );
  // cedulka PAPER LAB (kartonová karta, rajčatové podtržení; nápis = textura ve hře)
  const S = ATTIC.sign;
  out.push(
    panel({
      x: S.x - S.w / 2,
      w: S.w,
      y: S.y,
      h: S.h,
      front: S.front,
      color: c.card,
      part: 'sign',
    }),
    panel({
      x: S.x - 1.4,
      w: 2.8,
      y: S.y + 0.08,
      h: 0.06,
      front: S.front + 0.01,
      color: c.roof,
      part: 'sign',
    }),
  );
  return out;
}
// Stínový proxy (11 kap. 4.2: H2 + H6 ≤ 11 △): dům se štítem jako jeden obrys, 5 bodů = 3 △.
const shadow = () => [
  outline(
    [
      [X0, 0],
      [-X0, 0],
      [-X0, KNEE],
      [0, RIDGE],
      [X0, KNEE],
    ],
    { z: -H.d / 2, color: C().wall },
  ),
];
export default Object.freeze({
  id: 'workshop-attic',
  name: 'Dům dítěte s podkrovím v řezu',
  district: 0,
  layers: LOD_LAYER,
  hero: true,
  prototype:
    'Úzký měšťanský dům s podkrovní dílnou (Amsterdam, Malá Strana) na opěrné zdi; podkroví rozříznuté jako domeček pro panenky.',
  purpose:
    'Domov a místo odhodu místa 1 (koncept 2): pozadí menu, míření a Dílny; nahrazuje Dílnu PAPER LAB (K4 workshop).',
  params: Object.freeze({}),
  // Přízemí 3,5 m + 2 patra (okna pater ve 4,4 a 7,4 m nad patou).
  ground: H.ground,
  // Od přesahu střechy po přesah, výška po hřeben střechy v řezu, hloubka od zad domu po markýzu.
  size: Object.freeze({ w: W + 2 * CUT_ROOF.ov, h: RIDGE + CUT_ROOF.t, d: H.d + 1 }),
  // Strop 11 kap. 3.7: [230 LOD H, 0, 20 dálka a stín].
  tris: Object.freeze([230, 0, 20]),
  lod: Object.freeze([p => build(p, 0), () => [], p => build(p, 2)]),
  shadow,
});
