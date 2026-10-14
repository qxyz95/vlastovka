// Vzhled papíru pro scénu (čisté). Vlastní R4. Bible 05 kap. 3–4: bez půltónu, posterizace, toon rampy a obrysů světa; obrys má jen
// vlaštovka (grafit 2,6 px na všech kvalitách). comicLook(quality) → plan.comic {quality,ramp,outline,worldOutline}: scene.js z něj nastaví
// toon rampu a tloušťky obrysů objektů, které ještě nejsou z papírových karet (život čtvrti, holub; obrysy světa mají tloušťku 0).
import { PAPER_TOKENS } from './palette.js';
// Stupně kvality: 0 nízká, 1 střední, 2 vysoká. Přijímá i 'low'|'mid'|'high' a objekt {level}.
const Q = { low: 0, mid: 1, medium: 1, high: 2 };
const qLevel = q => {
  const v =
    typeof q === 'string'
      ? Q[q]
      : typeof q === 'number'
        ? q
        : q?.level != null
          ? qLevel(q.level)
          : 2;
  return Math.max(0, Math.min(2, Math.round(v ?? 2)));
};
// Obrysy v px obrazovky × DPR: building a detail = obrysy světa (v papíru žádné), plane = razítko vlaštovky.
export const PAPER_OUTLINE = Object.freeze({
  color: PAPER_TOKENS.graphite,
  building: 0,
  detail: 0,
  plane: 2.6,
});
export const comicLook = (quality = 2) => ({
  quality: qLevel(quality),
  ramp: [255, 255, 255],
  outline: PAPER_OUTLINE,
  worldOutline: false,
});
