# three.js (vendorováno)

- Verze: **r170** (`three@0.170.0`), soubor `build/three.module.min.js` beze změn.
- Zdroj: https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js (staženo 14. 10. 2026), licence z https://cdn.jsdelivr.net/npm/three@0.170.0/LICENSE.
- SHA-256: `08fd7545d13d2c7fb65ab691530a802dafefd638596501854f267d0fb13c39e7`
- Licence MIT, viz `LICENSE`. Používá ji hra (`src/render3d/`, import map `"three"` v `index.html`) a `archiv/prototype-3d.html`. Testy ne (čisté moduly `src/render3d/` three.js neimportují, hlídá `tests/render3d-purity.test.js`). Addony nejsou potřeba (obrys inverted hull a post-process jsou vlastní shadery v `src/render3d/toon.js`).
