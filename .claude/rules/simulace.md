---
paths:
  - "simulation/**"
---

# Simulace

- **Nespouštět starý simulátor 0.x:** `npm run simulate`, `node simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs`. Přepisují `simulation/REPORT.md`, `MONTE-CARLO.md`, `QTE-BALANCE.md` a JSON (zakázáno i v `.claude/settings.json`). Pro průzkum psát vlastní skript jinde.
- Nový systém se ladí jen v `simulation/progression/`. **Mechanika letu je od 15. 10. (A1) společná pro hru i simulátor v `src/flight.js`** (čistý modul, `createFlightModel(P)`); `model.mjs` drží jen boty. Změna mechaniky = změna `src/flight.js` s testem a ověřením shody výstupů simulátoru před/po.
- **Laditelná čísla jen v `simulation/progression/params.mjs`.** Žádná čísla napevno v `model.mjs`, `abilities.mjs`, `campaign.mjs`. Přepínače zpět pro přijaté změny zůstávají v `params.mjs`.
- Výstupy běhů vždy do `simulation/progression/out/` přes `--out <jméno>`, nepřepisovat cizí výstupy (např. `out/params-08.json`, `f3-*`).
- Determinismus: klíč kampaně `seed|profil|id`, pojmenované oddělené RNG streamy. Nový zdroj náhody = nový pojmenovaný stream.
- Změna modelu = test v `tests/progression*.test.js`. `params.mjs` a `tests/progression.test.js` mění v jedné chvíli jen jeden vlastník (viz `research/bonusy/11-plan-implementace.md`).
- Po změně `params.mjs` srovnat `src/progression-numbers.js` (PROVISIONAL kopie pro hru, `atlas-numbers.js` se z ní odvozuje); shodu hlídá `tests/progression-numbers.test.js`.
- Dlouhé dávky ladění spouštět jako workflow a vést soubor průběhu v `runs/` (`.claude/rules/orchestrace.md`).
