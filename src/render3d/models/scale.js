// Měřítko světa katalogu modelů (čisté). Zdroj: research/design/10-katalog-modelu.md kap. 2 „Jedno měřítko pro celý svět“, metry.
// Patro 3 m, dveře 2,2 m (šířka 1,1 m = běžné vchodové dveře), okno 1,2 × 1,4 m, člověk 1,7 m, vlaštovka 7,75 m (= plane.js PLANE_SCALE, hrdina schválně velký).
// Parapet okna 0,9 m nad podlahou patra (běžná stavební výška), takže okna v patrech leží přesně nad sebou.
export const SCALE = Object.freeze({
  floor: 3,
  door: Object.freeze({ w: 1.1, h: 2.2 }),
  win: Object.freeze({ w: 1.2, h: 1.4 }),
  sill: 0.9,
  person: 1.7,
  plane: 7.75,
});
// LOD podle hloubky (kap. 2): 0 ulice = plný detail, 1 střed = okna a střechy, 2 dálka = jen silueta.
export const LOD_LAYER = Object.freeze(['near', 'mid', 'far']);
// Hloubka karty podle vrstvy (= paper-cards CARD_D, bible 05 kap. 3).
export const CARD_DEPTH = Object.freeze({ near: 4, mid: 6, far: 12 });
