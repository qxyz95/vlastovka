---
paths:
  - "src/storage.js"
  - "src/core.js"
---

# Save

- Každá změna struktury save = nové číslo verze, migrace ze všech starších verzí a validace v `storage.js`, s testem v `tests/storage*.test.js`. Dnes save v4 (`p.atlas`), načítá v1–v4.
- `fresh()` v `core.js` je výchozí save a musí odpovídat nejnovější verzi.
- **Poškozený save se nesmí ztratit:** před přepsáním se zálohuje do `just-throw-it-v1-corrupt`. Neplatné hodnoty (NaN, záporné, nesmyslné typy) se neuloží.
- Do save nepatří odvoditelné údaje (objev míst z `p.best`) ani nastavení mimo hru (jazyk, styl, zvuk mají vlastní klíče v localStorage).
- `core.js` je čistá logika bez DOM. Na `core.js` může pracovat víc agentů (`fresh()` vs. model letu), před úpravou ho znovu načti a změnu koordinuj přes orchestrátora.
