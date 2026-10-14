---
paths:
  - "simulation/**"
---

# Simulace

- **Nespouštět starý simulátor 0.x:** `npm run simulate`, `node simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs`. Přepisují `simulation/REPORT.md`, `MONTE-CARLO.md`, `QTE-BALANCE.md` a JSON (zakázáno i v `.claude/settings.json`). Pro průzkum psát vlastní skript jinde.
- Nový systém se ladí jen v `simulation/progression/`. Je nezávislý na `src/`, nový systém zatím není ve hře.
- **Laditelná čísla jen v `simulation/progression/params.mjs`.** Žádná čísla napevno v `model.mjs`, `abilities.mjs`, `campaign.mjs`. Přepínače zpět pro přijaté změny zůstávají v `params.mjs`.
- Výstupy běhů vždy do `simulation/progression/out/` přes `--out <jméno>`, nepřepisovat cizí výstupy (např. `out/params-08.json`, `f3-*`).
- Determinismus: klíč kampaně `seed|profil|id`, pojmenované oddělené RNG streamy. Nový zdroj náhody = nový pojmenovaný stream.
- Změna modelu = test v `tests/progression*.test.js`. `params.mjs` a `tests/progression.test.js` mění v jedné chvíli jen jeden vlastník (viz `research/bonusy/11-plan-implementace.md`).
- Po změně `params.mjs` hlídat parity s `src/atlas-numbers.js` (dnes `PROVISIONAL` kopie, test shody přijde v C1).
- Dlouhé dávky ladění spouštět jako workflow a vést soubor průběhu v `runs/` (`.claude/rules/orchestrace.md`).
