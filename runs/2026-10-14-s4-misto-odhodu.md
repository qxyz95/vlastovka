# S4: místo odhodu ve hře (podkrovní dílna v řezu, styl papír)

**Zadání:** zapojit dioráma H1–H6 (`models/`, `launch-site.js`) do hry ve stylu papír místo Dílny PAPER LAB; ruka 12 m, záběr míření, pás výhledu S-1, barvy 06 bod 6; cyber beze změny.
Smí: `src/render3d/*`, `tests/render3d-*.test.js`, tento soubor. Prohlížeč ne.

## Hotové kroky
- [x] Podklady (CLAUDE.md, orchestrace, render3d.md, 06, start/01 §2, start/02, bible 3.1 a 9, katalog 3.7 a 4.2, runs g2b + kamera-start); baseline npm test 304/304
- [x] Golden lety z HEAD 4df47a7 (8 letů, autopilot) do testu
- [x] Ruka podle stylu (`pose.handOf`, `PAPER_HAND` = 12 m), klidový sklon −8° v papíru (`restPitch`), režisér: klidová výška z `y`, sklon prolne na +6° s oddálením výhozu; `launchLift` v papíru 0
- [x] Pás výhledu S-1 (`geometry.viewCap`, `cityChunk(i,{view})`, střechy v `placeCards`), život čtvrti na snížených střechách, auta schovaná v rozsahu zdi (jen papír)
- [x] Dioráma H2–H6 sloučené do ulice '0s', vrhač ulice s proxy H2 + H6 + dítě (`city.paperLayers` nearShadow)
- [x] Dítě H1 + praporek: `models/kid-rig.js` (CPU póza do předalokovaného bufferu, 1 DC), cedulka PAPER LAB textura na kartě H2, vlaštovka v ruce ve 12 m (`workshop.js` papír přepsán, cyber beze změny)
- [x] Paleta `PAPIR.workshop`: pláštěnka #f2b65a, čepice kraft + capBand, zábradlí/rámy/dveře/nohy #3d4f7a, klika krémová, provázky tužkou; kid.js a loft-balcony čtou z ní
- [x] Starý K4 `models/workshop.js` smazán (nic ho nepoužívá), testy upraveny
- [x] Testy: nový `tests/render3d-launch-site.test.js` (10), upravené models + paper-hero; npm test 312/312
- [x] Cyber ověřen proti HEAD: 341 plánů snímků, cityChunk 0–3 a 16, suburbLife, karty místa 2 shodné (skript scratchpad/cyber.mjs)

## Rozpracovaný krok
- nic (commity 2367d9c, 052a8bd)

## Další kroky (orchestrátor)
- prohlížeč ?styl=papir: vzhled míření, výhozu a oddálení, art-review, perf-check (DC, P95), test úniku; BLOCKED otázky z reportu; docs/stav.md

## Technická rozhodnutí
- Ruka podle stylu místo globálních 12 m: cyber Dílna (přístavek, ruka 16 m) musí zůstat beze změny, proto `launchLift` zůstává jen pro cyber (a pro budoucí f.d.y0 Crane Lift); v papíru je 0.
- Hand na obrazovce zůstává (148, 258) (smlouva view(null), mířicí panel ui-layer); AIM_SHOT.at (0,38; 0,60) viz BLOCKED v reportu.
- Dítě + praporek = jedna dynamická geometrie s CPU pózou (bez shaderu sway, bez změny sdíleného papírového materiálu).
- Auta v pruzích LANES (z −4,6 / −7,2) by projížděla opěrnou zdí H6 → v papíru se v rozsahu zdi nekreslí (`life.behindLaunch`).
- `cityChunk(index,{view})` aplikuje strop až po vygenerování (pořadí RNG, šířky, polohy beze změny).

## Změněné soubory
- src/render3d/{pose,camera,frame,index,geometry,paper-cards,city,life,life3d,scene,workshop,palette}.js
- src/render3d/models/{index,kid,loft-balcony}.js, nový models/kid-rig.js, smazaný models/workshop.js
- tests/render3d-models.test.js, tests/render3d-paper-hero.test.js, nový tests/render3d-launch-site.test.js
- runs/2026-10-14-s4-misto-odhodu.md

## Měření (Node, scratchpad/probe4.mjs; test „place 1 budget“)
- Místo 1 papír '0s': 4 DC (zem, dálka, střed, ulice + dioráma) + 3 vrhače masky, 1 227 △ (maska 736 △); místo odhodu 2 DC (dítě + praporek, cedulka), 57 △ → 9 DC vlastních (+ 5 sdílených = 14), 1 284 △
- Dřív (HEAD): místo 7 DC + papírová Dílna 11 (5 meshů + 5 vrhačů + cedulka) = 18 DC
- Ulice '0s' 818 △ (bez diorámatu '0r' 365), vrhač ulice 351 △ (proxy místo detailu)
- Prohlížeč (vzhled, px, výkon, P95) NOT ASSESSED
