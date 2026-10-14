# Simulátor progrese: modely za mince (game-dev)

**Zadání:** připravit `simulation/progression/` na modely za mince (odměna v params, katalog modelů s `unlockPlace`/`price`, nabídka `kind:'model'`, volba modelu před hodem, strategie `no-models`/`models-first`, nová pole z 01 §2, ekonomika ve výstupu) beze změny dnešních výsledků.

## Hotové kroky
1. Baseline před změnou (HEAD 222b013): `out/k-sim-before.{md,json}` (weak/average/expert/auto × realistic/balanced/paper-first/random, n 4, probe-n 10, --raw), `out/k-sim-before-x2.{md,json}` (x2, average, models better/glider/dart, n 6, --raw).
2. `params.economy.reward = {base:10, perMeter:.1}`, `reward(x)` v `campaign.mjs` (dělení `1/perMeter` = bitově stejné jako `floor(x/10)`).
3. Katalog v `params.models` (`price`, `unlockPlace`), nabídka `kind:'model'`, výchozí katalog jen dart/glider. `MODEL_SETS.obsah01` (01 §2.2–2.6) přes `--modelset obsah01`.
4. Volba modelu `better` zobecněná na N modelů (pro 2 přesně dnešní), nová `preview` (`previewModel`), strategie `no-models` / `models-first`.
5. Pole modelu v `model.mjs`: `perfectK`, `missK`, `liftK`, `pushK`, `ground`, `skip`, `windK`, `droneBurst` (neutrální, když chybí).
6. Ekonomika ve výstupu: `R.econ`, `R.byModel`, `economy()` v `run.mjs`, sekce „Ekonomika“ v `.md`, `groups.*.econ` v `.json`.
7. Testy `tests/progression-models.test.js` (8 testů), `npm test` 283/283.
8. Porovnání `out/k-sim-after*.json` proti `k-sim-before*.json` (skript ve scratchpadu `cmp.mjs`, ignoruje date/seconds a nové klíče): 41 620 + 12 477 hodnot, jediný rozdíl = jméno běhu. `.md` shodné až na jméno, datum a nové sekce.
9. Ověřovací běh s modely: `out/k-sim-modely-smoke.{md,json}` (obsah01, average/expert × realistic/no-models/models-first × better/preview, n 4, bez sond) — jen důkaz, že to běží, ne balanc.
10. README simulátoru.

## Rozpracováno
nic, zbývá commit

## Změněné soubory
- `simulation/progression/params.mjs`, `campaign.mjs`, `model.mjs`, `run.mjs`, `README.md`
- `tests/progression-models.test.js` (nový)
- `simulation/progression/out/k-sim-*` (ověřovací běhy)
