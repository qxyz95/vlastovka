# G2b: modely místa odhodu (podkrovní dílna v řezu)

**Zadání:** vyrobit modely katalogu H1–H6 (`kid`, `workshop-attic`, `workshop-interior`, `loft-balcony`, `hoist-beam`, `retaining-wall`) a díl `cutRoof` ve stylu G1/G2, testy, katalog s pohledem na celé dioráma v záběru míření 16 m; `workshop` (K4) označit jako nahrazený. Prohlížeč ne, commit ve worktree.

## Hotové kroky
- [x] Podklady: CLAUDE.md, orchestrace, render3d.md, 06 (Začátek hodu), bible 05 kap. 3.1, 9, 17, katalog 11 kap. 1.1–1.4, 3.7, 4.2–4.3, 02 kap. 2–5, náčrt `start.mjs` conceptB (souřadnice)
- [x] Díly `cutout`, `strip`, `cutRoof` (parts.js); rozvržení `launch-site.js` (LAUNCH, DIORAMA, AIM_SHOT, MENU_SHOT)
- [x] Modely kid, workshop-attic, workshop-interior, loft-balcony, hoist-beam, retaining-wall; registr (ACTIVE_MODELS, diorama, dioramaShadow), workshop.replacedBy
- [x] Testy: 6 nových v tests/render3d-models.test.js + upravený registr; npm test 289/289
- [x] Katalog: pohledy „Dioráma: míření 16 m“ a „Dioráma: menu 28 m“, LOD H v tabulce, „(nahrazeno)“ v seznamu; matematika kamery ověřena v Node (ruka na 0,38; 0,60, šířka 16 m)

## Rozpracovaný krok
- commit a report

## Změněné soubory
- src/render3d/models/{parts,index,workshop}.js, nové kid.js, workshop-attic.js, workshop-interior.js, loft-balcony.js, hoist-beam.js, retaining-wall.js, launch-site.js
- tests/render3d-models.test.js, prototype/katalog/main.js, runs/2026-10-14-g2b-podkrovi.md

## Měření (cardTriangles, test „G2b stropy“)
- kid 53 / 17 / 0 (strop 80 / 20 / 0); workshop-attic 150 / 0 / 11 (230 / 0 / 20); workshop-interior 165 (200); loft-balcony 44 (55); hoist-beam 32, s hákem 42 (60); retaining-wall 86 / 0 / 4 (95 / 0 / 4)
- dioráma LOD H 530 △ výchozí, 540 nejbohatší (strop součtu 720), LOD 2 15 △; stín H2 + H6 5 △, dítě 3 △
- vzhled v prohlížeči NOT ASSESSED (okno sdílí uživatel)
