// Místo odhodu G2b (research/design/11-katalog-ctvrt1.md kap. 3.7, bible 05 kap. 9): rozvržení diorámatu „podkrovní dílna v řezu“ (čisté).
// Souřadnice světa místa 1 (x od startu města, y zem, čelo ulice z ≈ +1,2), převzaté z náčrtu research/design/img/start/start.mjs conceptB.
// Modely H1–H6 mají vlastní souřadnice (x na střed, y = 0 pata, čelo z = 0); DIORAMA je posune na místo (index.js diorama). Hra je zapojí v dávce S4.
import { PLANE_OFFSET } from '../geometry.js';
import { KID } from './kid.js';

// Ruka dítěte ve výšce výhozu fyziky (core.js y 12 m, M-3), x jako vlaštovka v klidu (PLANE_OFFSET); podlaha pavlače a podkroví 10,6 m.
export const LAUNCH = Object.freeze({
  hand: Object.freeze({ x: PLANE_OFFSET, y: 12, z: 0 }),
  floor: 10.6,
  wall: 1.1,
  front: 1.2,
  // dům 12 × 8 m (x 55,5–67,5), přízemí 3,5 + 2 patra × 3 m, podkroví: nadezdívka 2,3 m, střecha 4,6 m; pavlač končí u ruky (x 71,6).
  house: Object.freeze({
    x0: 55.5,
    x1: 67.5,
    d: 8,
    ground: 3.5,
    floors: 2,
    knee: 2.3,
    rise: 4.6,
    back: -6.2,
  }),
  deckEnd: 71.6,
  deckFront: 1,
  // opěrná zeď 31 × 1,1 m od x 44, čelo 3 m před domem; dítě stojí na pavlači za zábradlím (z podle dlaně, DIORAMA), trám 9 m od vrcholu štítu.
  wallX: 44,
  wallW: 31,
  wallFront: 4.2,
  beam: Object.freeze({ len: 9, y: 5.8, front: 0.35 }),
});
const H = LAUNCH.house,
  HX = (H.x0 + H.x1) / 2;
// Umístění modelů (posun place): id, poloha počátku modelu ve světě.
export const DIORAMA = Object.freeze(
  [
    { id: 'retaining-wall', at: { x: LAUNCH.wallX + LAUNCH.wallW / 2, y: 0, z: LAUNCH.wallFront } },
    { id: 'workshop-attic', at: { x: HX, y: LAUNCH.wall, z: LAUNCH.front } },
    { id: 'workshop-interior', at: { x: HX, y: LAUNCH.floor, z: LAUNCH.front } },
    {
      id: 'loft-balcony',
      at: { x: (H.x1 + LAUNCH.deckEnd) / 2, y: LAUNCH.floor, z: LAUNCH.deckFront },
    },
    {
      id: 'hoist-beam',
      at: { x: HX + LAUNCH.beam.len / 2, y: LAUNCH.floor, z: LAUNCH.beam.front },
    },
    // dítě C (03-art kap. 1.5): v póze míření je dlaň ruky T přesně v LAUNCH.hand (posun celého dítěte jednou, chodidla na podlaze pavlače)
    {
      id: 'kid',
      at: { x: LAUNCH.hand.x - KID.aimPalm[0], y: LAUNCH.floor, z: LAUNCH.hand.z - KID.aimPalm[2] },
    },
  ].map(o => Object.freeze({ ...o, at: Object.freeze(o.at) })),
);
// Záběr míření (bible 05 kap. 9.2): šířka 16 m (telefon na výšku 7 m), sklon −8° (kamera mírně zespodu), ruka na (0,38; 0,60) obrazu.
export const AIM_SHOT = Object.freeze({
  width: 16,
  portraitWidth: 7,
  pitch: -8,
  fov: 20,
  at: Object.freeze([0.38, 0.6]),
  portraitAt: Object.freeze([0.4, 0.62]),
  planeInHand: 0.5,
});
// Záběr menu (bible 05 kap. 9.2, náčrt koncept-2-podkrovi.png): šířka 28 m (pásmo 25–43 m), sklon +2°, ruka na (0,85; 0,60), na výšku šířka 11,2 m, ruka (0,62; 0,50).
export const MENU_SHOT = Object.freeze({
  width: 28,
  portraitWidth: 11.2,
  pitch: 2,
  fov: 20,
  at: Object.freeze([0.85, 0.6]),
  portraitAt: Object.freeze([0.62, 0.5]),
  planeInHand: 0.5,
});
// Úvodní záběr (03-art kap. 2.2, bible 05 kap. 9.2 „Úvod“, rozhodnutí 06 bod 15): dům s dílnou v řezu vlevo, dítě vpravo od středu, sklon +2°.
// Desktop 30 m s rukou na (0,64; 0,66), telefon na šířku 30 m (0,66; 0,64), na výšku 18 m (0,80; 0,62). text = svislý pás nápisu v nebi nad hřebenem.
export const INTRO_SHOT = Object.freeze({
  width: 30,
  portraitWidth: 18,
  landWidth: 30,
  pitch: 2,
  fov: 20,
  at: Object.freeze([0.64, 0.66]),
  portraitAt: Object.freeze([0.8, 0.62]),
  landAt: Object.freeze([0.66, 0.64]),
  planeInHand: 0.5,
  text: Object.freeze([0.08, 0.28]),
  portraitText: Object.freeze([0.12, 0.32]),
  landText: Object.freeze([0.06, 0.2]),
});
