# A1 Jádro letu ve src (15. 10. 2026, game-dev Opus)

Zadání: mechaniku letu ze `simulation/progression/model.mjs` přesunout do čistého `src/flight.js` (P zvenku), čísla do `src/progression-numbers.js`, `model.mjs` si nechá boty; výstupy simulátoru před/po bajtově shodné.

## Hotové kroky
1. Baseline před změnou: `a1-before` (`--profiles weak,average,expert --n 3 --probe-n 6 --tricks --workers 1`, 13 s) a `a1-before-int` (`--profiles average,expert --pockets auto,dive+sharp,calm+cushion --n 2 --probe-n 4 --intents all --modelset obsah01 --models better --workers 4`, 71 s; pokrývá boty kapes, záměry kousků a modely obsahu 01).
2. `src/flight.js`: `createFlightModel(P, hooks)` (mechanika beze změny kódu, jen obalená továrnou); plán stisků bota přes `hooks.onEventStart`. `model.mjs`: jen `planEvent`, `playerEvents`, `realTime`, `fly` s boty + re-export původních exportů. `tests/progression*` prošly beze změny (50/50).
3. `src/progression-numbers.js`: `PROGRESSION` (zmrazená kopie sekcí route…warp z DEFAULTS) + `PROVISIONAL`. `src/atlas-numbers.js` odvozen z `PROGRESSION`, API i hodnoty beze změny (JSON `PROVISIONAL` před/po řetězcově shodný, 2 367 znaků; drone `wider` = `levelWindow − 1` zaokrouhleno na 1e-9).
4. `createFlight`: `P.profiles?.[…] ?? {}`, aby šel let s čísly hry bez profilů botů (hra předá `charge`, `angle`, `exact:true`). Pro platné profily beze změny.
5. Testy `tests/flight.test.js` (5) a `tests/progression-numbers.test.js` (2).
6. Po finálních změnách znovu `a1-after`, `a1-after-int`; `--set events.gust.dvy=3` → `a1-after-set`.
7. `npm run format`, `npm test`: 424/424.

## Rozpracovaný krok
- žádný (hotovo, commit 6d043b4)

## Změněné soubory
- nové: `src/flight.js`, `src/progression-numbers.js`, `tests/flight.test.js`, `tests/progression-numbers.test.js`
- `simulation/progression/model.mjs`, `src/atlas-numbers.js`
- výstupy `simulation/progression/out/a1-{before,after}{,-int}.{json,md}`, `a1-after-set.{json,md}`

## Měření
- `a1-before` × `a1-after`: JSON bez `name`/`date`/`seconds` SHODNÝ, MD se liší jen nadpisem (jméno běhu) a řádkem „Spuštěno <ISO čas>“. Surový diff JSON: přesně 3 řádky (`name`, `date`, `seconds`).
- `a1-before-int` × `a1-after-int`: totéž, 27 496 řádků JSON, liší se jen `name`, `date`, `seconds`.
- `--set events.gust.dvy=3` (`a1-after-set`): výstup se liší (2 640 řádků), např. average|balanced: hodů 93 → 83, minut 50,3 → 45,4; expert 76 → 61.
