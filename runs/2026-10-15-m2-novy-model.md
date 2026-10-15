# M2 Hra na novém modelu letu (15. 10. 2026, game-dev Opus)

Zadání: hra létá na `src/flight.js` (`createFlightModel(PROGRESSION)`) místo staré fyziky; kit z Dílny/Atlasu, nová Dílna 3/12/3, save v5 s vrácením mincí, `completed` = 4 876 m.

## Hotové kroky
1. Průzkum, sonda plné výbavy přes simulátor (expert/average, 60 hodů): medián 4,7–7,5 km, čas 19–31 s → kritérium splnitelné bez ladění.
2. `src/gear.js` (BRANCHES s i18n klíčem, branchStatus, buy, paperOpen, kitOf, NEW_EVENT_TYPES), `config.js` (bez PRICES/UPGRADE/BRANCHES/parameters, NEW_EVENTS=false), `flight.js` + `realTime`.
3. `core.js` adaptér (GAME, gameFlight, flightFor, createFlight kompat., step = step+updateEvents+realTime+maxT, advance s warp, eventInput, feedbackOf, reward, settle s FINISH), `events.js` (TIMING, activeEvent, windows kompat., zones(e), eventProgress, eventStats).
4. Save v5 (`storage.js` decodeSave: refund LEGACY_PRICES, v2 oba stromy), `load()` vrací `refund`.
5. `reveal.coinLine` přes gear, `result.throwFacts`, `workshop-ui.js` (mountWorkshop), `ui.js` přepojené.
6. `render3d/frame.js` adaptér `floorHeld` (událost čekající pod 8 m nevidí kamera).
7. Opravené testy: render3d-* (eventInput z core, golden S4 → shoda s/bez planFrame), audio-mix, i18n (BRANCHES.key, PENDING_M2 klíče), u5, reveal (nové ceny), storage-atlas (v5), progression audit (wind {x:0}), events.test.js přepsaný.

8. `tests/core.test.js` přepsaný (Dílna, papír, kitOf, settle, determinismus, eventInput, advance, shoda hra × fly, plná výbava, bestAngle), `tests/storage.test.js` migrace v1–v5, `tests/result.test.js` throwFacts, nový `tests/workshop-ui.test.js`.
9. Simulátor `m2-check` × `a1-after`: JSON bez name/date/seconds SHODNÝ (36 424 znaků). `npm run format`, `npm test` 434/434.
10. Smoke v prohlížeči (port 4191, `?timer`, skryté okno): prázdný save → tutoriál (poryv, holub) a 2 další hody, výsledek, Dílna (+1000, Power 1, Paper 1), migrace v4 → v5 (vráceno 3 165 ◈, hláška zatím klíč `save.refund`), pozdní save (plná výbava, Glider): 5 749 m, let 31,4 s, zeď 28,8 s, „The horizon is yours!“. Konzole bez chyb. Server vypnut, záložka zavřena.

## Rozpracovaný krok
- žádný (commit)

## Změněné soubory
- nové: src/gear.js, src/workshop-ui.js
- src/config.js, core.js, events.js, flight.js (realTime), storage.js, reveal.js, result.js, ui.js, render3d/frame.js
- tests: helpers/auto-input.js, events, i18n, reveal, storage-atlas, u5-kostra, progression, audio-mix(beze změny), render3d-{camera,camera-speed,plane-size,launch-site,ui}
- runs/2026-10-15-m2-novy-model.md

## Měření
- Plná výbava (Dílna max, Atlas max, bez kapes, hod 0,95 na bestAngle, 90 % zásahů ±0,05 s, hody 20–59, API hry):
  - Glider jen poryv+holub: dolet p10/med/p90 5 335 / 6 615 / 7 425 m, skutečný čas 28,6 / 31,4 / 33,3 s, max 34,2 s
  - Glider všechny události: 6 110 / 8 134 / 9 459 m, 28,4 / 33,3 / 38,6 s, max 47,1 s
  - Dart jen poryv+holub: 5 220 / 6 153 / 6 885 m, 24,0 / 25,9 / 28,9 s, max 35,6 s
  - Dart všechny: 5 975 / 7 424 / 8 851 m, 25,6 / 28,8 / 34,2 s, max 35,3 s
- Simulátor: `simulation/progression/out/m2-check.{json,md}` = `a1-after` (bez name/date/seconds).
