# Kamera startu a letu (S1, S3, S2): soubor průběhu

**Zadání:** kamera letu podle přebytku rychlosti a tempa π (S1), velikost vlaštovky podle šířky záběru (S3), záběr míření ~16 m a oddálení výhozu (S2); metriky do `reports/3d/kamera-start.md`.
Spec: `research/start/01-zacatek-a-kamera.md` §2–§4, `02-misto-odhodu-vzhled.md` M-1..M-4, rozhodnutí 06 „Začátek hodu, místo odhodu a kamera“.
Smí: `src/render3d/camera.js`, `frame.js`, `pose.js`, `plane.js`, `index.js` (předání), `tests/render3d-*.test.js`, report, tento soubor.

## Hotové kroky
- S1 kamera letu (commit d3a3ca3): `EXCESS`, `EASE`, `excessOf/excessZoom/launchEase` v camera.js, `paceOf/cruiseOf/calmOf` ve frame.js, test `tests/render3d-camera-speed.test.js`.
- S3 velikost vlaštovky: `PLANE_SIZE`, `planeLength`, `planeSizeScale` ve frame.js, plane.js měřítko v obou stylech + stopa úměrně; test `tests/render3d-plane-size.test.js`.

## Rozpracováno
- S2 záběr míření 16 m / 7 m, přisunutí při nabíjení, posun vlaštovky z ruky (HAND.y 16 → fyzika 12) při výhozu

## Další kroky
- metriky (Node skript ve scratchpadu) + `reports/3d/kamera-start.md`, report

## Změněné soubory
- src/render3d/camera.js, frame.js, plane.js; tests/render3d-camera.test.js, render3d-frame.test.js, render3d-paper-frame.test.js, render3d-paper-hero.test.js, render3d-plane.test.js, render3d-camera-speed.test.js (nový), render3d-plane-size.test.js (nový)

## Měření
-
