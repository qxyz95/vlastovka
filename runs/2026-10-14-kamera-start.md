# Kamera startu a letu (S1, S3, S2): soubor průběhu

**Zadání:** kamera letu podle přebytku rychlosti a tempa π (S1), velikost vlaštovky podle šířky záběru (S3), záběr míření ~16 m a oddálení výhozu (S2); metriky do `reports/3d/kamera-start.md`.
Spec: `research/start/01-zacatek-a-kamera.md` §2–§4, `02-misto-odhodu-vzhled.md` M-1..M-4, rozhodnutí 06 „Začátek hodu, místo odhodu a kamera“.
Smí: `src/render3d/camera.js`, `frame.js`, `pose.js`, `plane.js`, `index.js` (předání), `tests/render3d-*.test.js`, report, tento soubor.

## Hotové kroky
- S1 kamera letu (commit d3a3ca3): `EXCESS`, `EASE`, `excessOf/excessZoom/launchEase` v camera.js, `paceOf/cruiseOf/calmOf` ve frame.js, test `tests/render3d-camera-speed.test.js`.
- S3 velikost vlaštovky (commit 71d9c11): `PLANE_SIZE`, `planeLength`, `planeSizeScale` ve frame.js, plane.js měřítko v obou stylech + stopa úměrně; test `tests/render3d-plane-size.test.js`.
- S2 záběr míření a výhoz (commit 393d103): `pose.REST` 16 m / `aimWidth` (≥ 27 px v ruce, min 7 m), přisunutí 6 %, `frame.launchLift`, klid přes `prev`, `index.view(null)` z klidového plánu; test `tests/render3d-camera-aim.test.js`.
- Metriky: `reports/3d/kamera-start.md` (skript ve scratchpadu, plné znění v příloze reportu).

## Rozpracováno
- nic

## Další kroky
- orchestrátor: prohlížeč (vzhled, px, výkon), `workshop.js:133` měřítko vlaštovky v ruce i v cyber stylu, BLOCKED otázky z reportu

## Změněné soubory
- src/render3d/camera.js, frame.js, plane.js, pose.js, index.js
- tests/render3d-camera.test.js, render3d-frame.test.js, render3d-paper-frame.test.js, render3d-paper-hero.test.js, render3d-plane.test.js, render3d-pose.test.js
- nové: tests/render3d-camera-speed.test.js, render3d-plane-size.test.js, render3d-camera-aim.test.js, reports/3d/kamera-start.md

## Měření
- `reports/3d/kamera-start.md`: bezpečná zóna 100 %, zámek Δ 0, výhoz končí 1,2 s, W při 1. varování ≥ 1,027·W_let·T, raný Dart max W/W_let 1,342, na W_max ≤ 4,8 %; změny směru se zásahy 2–4 / 10 s (CONCERNS).
