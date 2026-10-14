# Plán ověření návrhu 2. kola Monte Carlem

**Založeno 13. 10. 2026.** Předmět: `08-navrh-kolo2.md` (systém Workshop + Atlas + Pockets) s rozhodnutími v `06-rozhodnuti.md`. Cíl: ověřit a doladit čísla proti cílovým metrikám v `08` §10.2 dřív, než se cokoli zapracuje do hry.

## Zásady
- **Hra se zatím nemění.** Nový model letu a obsah žijí jen v simulátoru `simulation/progression/` (čisté ES moduly, importují z `src/` jen to, co se nemění: RNG, `TIMING`, trasa). Do `src/` se přenese až po schválení výsledků.
- Stávající `simulation/*.mjs` a jejich reporty se nespouštějí ani nepřepisují.
- Výstupy simulátoru jdou jen do `simulation/progression/out/`.
- Oddělené RNG streamy (hráč / let / události), deterministické podle seedu.
- Testy simulátoru v `tests/progression.test.js` (běží v `npm test`).
- Ladí se jen čísla. Změny mechanik nebo vyřazení prvku se zapíšou jako návrh a rozhodne uživatel.

## Fáze

| # | Fáze | Kdo | Výstup | Závisí na |
|---|---|---|---|---|
| F1 | **Stavba simulátoru:** model letu 1.0 (§2.3), obsah (Workshop, 16 bonusů Atlasu, 6 speciálních, kapsy, události, vítr, plující QTE, kombo), profily hráčů, boti schopností, nákupní strategie, kampaň po místech, měření času | agent „stavitel“ | `simulation/progression/*.mjs`, testy, krátký `README.md` s odchylkami od 08 | — |
| F2 | **Nezávislá kontrola věrnosti:** porovnat simulátor s 08 řádek po řádku, hledat chyby a zjednodušení, která by zkreslila výsledky. Opravit chyby s testem. Sporná místa zapsat. | agent „auditor“ | `simulation/progression/AUDIT.md`, opravy | F1 |
| F3 | **Základní běh a ladění:** plná Monte Carlo kampaň (profily × strategie × volby kapes), srovnání s cíli §10.2, citlivost §10.3. Pak ladění čísel (ceny, kroky papíru, síla bonusů), dokud cíle nesedí. Každá iterace se zapíše. | agent „ladič“ | `simulation/progression/REPORT.md`, `research/bonusy/10-ladeni.md` (co se změnilo a proč, finální tabulky) | F2 |
| F4 | **Shrnutí pro uživatele:** výsledky, co se nepodařilo splnit, návrhy změn mechanik k rozhodnutí, seznam věcí jen pro playtest (čitelnost 160 m/s, zábavnost schopností, humor) | hlavní konverzace | zpráva + aktualizace `06`, `CLAUDE.md` | F3 |

F1 → F2 → F3 běží za sebou, protože každá fáze stojí na předchozí. Paralelní stavba by vedla ke konfliktům v týchž souborech.

## Co Monte Carlo neověří (jen playtest)
Čitelnost scény při ~160 m/s a oddálení kamery, pocit ze zrychlení klouzání 1,4×, zábavnost a srozumitelnost schopností za letu, humor postav, velký moment na hranici čtvrti.
