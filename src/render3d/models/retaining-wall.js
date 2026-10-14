// Opěrná zeď se schody (karta H6 v research/design/11-katalog-ctvrt1.md kap. 3.7): nízká kamenná zeď, na které stojí dům dítěte nad ulicí místa 1,
// spáry jako tenké karty, 7 schodů dolů do ulice na pravém konci (před zdí, sestupují po směru hodu). Barva D1.ground.near, spáry mix(zeď, side, .3).
// Souřadnice: x na střed zdi, y = 0 ulice, čelo zdi z = 0 (terasa před domem je 3 m hluboká, zeď sahá pod dům).
import { palette, mix } from '../palette.js';
import { LOD_LAYER } from './scale.js';
import { block, panel } from './parts.js';
import { LAUNCH } from './launch-site.js';

const W = LAUNCH.wallW,
  H = LAUNCH.wall,
  X0 = -W / 2;
// zeď 31 × 1,1 × 12 m, 11 spár 1,6 × 0,06 m po 2,8 m ve dvou řadách, 7 schodů 0,35 m (stupeň 0,157 m) hloubky 1,5 m.
export const WALL = Object.freeze({
  w: W,
  h: H,
  d: 12,
  joints: 11,
  joint: Object.freeze({ w: 1.6, h: 0.06, step: 2.8, rows: Object.freeze([0.35, 0.75]) }),
  steps: 7,
  tread: 0.35,
  stepD: 1.5,
});
const C = () => {
  const P = palette('papir'),
    wall = P.city.districts[0].ground.near;
  return { wall, joint: mix(wall, P.city.side, 0.3) };
};

function build(lod) {
  const c = C(),
    J = WALL.joint;
  if (lod === 2)
    return [block({ x: X0, w: W, h: H, d: WALL.d, color: c.wall, shape: 'lista', part: 'wall' })];
  const out = [block({ x: X0, w: W, h: H, d: WALL.d, color: c.wall, part: 'wall' })];
  for (let i = 0; i < WALL.joints; i++)
    out.push(
      panel({
        x: X0 + 0.6 + i * J.step,
        w: J.w,
        y: J.rows[i % 2],
        h: J.h,
        front: 0.02,
        color: c.joint,
        part: 'joint',
      }),
    );
  const sx = -X0 - WALL.steps * WALL.tread;
  for (let i = 0; i < WALL.steps; i++)
    out.push(
      block({
        x: sx + i * WALL.tread,
        w: WALL.tread,
        h: (H * (WALL.steps - i)) / WALL.steps,
        front: WALL.stepD,
        d: WALL.stepD,
        color: c.wall,
        part: 'stair',
      }),
    );
  return out;
}
// Stínový proxy (11 kap. 4.2: H2 + H6 ≤ 11 △): čelo zdi, 2 △ (schody pod 1,1 m stín nemění).
const shadow = () => [
  panel({ x: X0, w: W, h: H, front: -WALL.d / 2, color: C().wall, part: 'shadow' }),
];
export default Object.freeze({
  id: 'retaining-wall',
  name: 'Opěrná zeď se schody',
  district: 0,
  layers: LOD_LAYER,
  hero: true,
  prototype:
    'Kamenná opěrná zeď s terasou a schody do ulice (svažité ulice Malé Strany), na které stojí dům dítěte.',
  purpose:
    'Podnož místa odhodu: zvedá dům dítěte nad ulici místa 1 (podlaha pavlače 10,6 m) a vede z ní schody dolů do ulice.',
  params: Object.freeze({}),
  size: Object.freeze({ w: W, h: H, d: WALL.d + WALL.stepD }),
  // Strop 11 kap. 3.7: [95, 0, 4] (LOD 2 zeď jako lista).
  tris: Object.freeze([95, 0, 4]),
  lod: Object.freeze([() => build(0), () => [], () => build(2)]),
  shadow,
});
