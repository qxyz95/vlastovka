---
paths:
  - "src/atlas*.js"
  - "prototype/atlas/**"
  - "prototype-atlas.html"
---

# Atlas

- **Obsah, čísla a logika jsou oddělené:** ID, klíče a struktura v `atlas-content.js`, texty v `src/locales/*.js` (`atlas.*`, jména z `district.*` a `place.<kind>`), čísla jen v `atlas-numbers.js` (odvozené z `progression-numbers.js`), čisté funkce v `atlas.js` a `atlas-text.js` (`logic.js`). Do logiky ani UI nepsat ceny, úrovně ani vzdálenosti napevno.
- Čísla jsou `PROVISIONAL` kopie `simulation/progression/params.mjs`, dokud je C1 nenahradí laděnou sadou s testem shody.
- **Žádné pevné 3 úrovně:** počet úrovní číst z `maxLevelOf`, ceny z `nextCost` (`null` = maximum nebo zatím neladěno). 3. kolo progrese může změnit počet úrovní i řády cen.
- ID bonusů jsou stabilní a shodné s `params.mjs` `atlas.bonuses`. Objev místa se odvozuje z `p.best`, neukládá se. Stav je v `p.atlas` (save v4, změny přes `.claude/rules/save.md`).
- Texty EN i CS přes `t()`, čísla přes `num`/`unit`/`pct` (jazykový formát), jednotky s mezerou („86 m“, „+13 %“), jedna měna ◈. Strážní test hlídá zastaralá kyber slova (`tests/atlas-i18n.test.js`).
- **Zakázané formulace** (`FORBIDDEN` v `atlas-text.js`, testy procházejí všechny texty Atlasu a postav): „last chance“, „hurry“, „don't lose“, „streak“, „daily“, „limited“, „only now“, „miss out“, „come back“. Nový text musí projít `tests/atlas-text.test.js`.
- **Proti nutkavosti (KB P13, 02):** žádné FOMO, odpočty, falešné téměř-výhry, puntíky bez obsahu, seznamy úkolů, los. Odměna předvídatelná z výkonu, přínos vidět předem (hodnota teď → po koupi). Hra má přirozený konec, karta čtvrti a souhrn jsou legitimní zastávka.
- Přístupnost: text ≥ 12 px (ceny, názvy, tlačítka ≥ 16 px), kontrast ≥ 4,5 : 1, stav nikdy jen barvou, `aria-live="polite"` pro objevy a úrovně, dotykové cíle ≥ 44 px.
- Prototyp nesahá do `src/`. Návrh a fáze: `research/atlas/01-navrh-atlasu.md`.
