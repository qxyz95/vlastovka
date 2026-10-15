# A2: obsah a texty Atlasu přes i18n (15. 10. 2026)

Zadání: všechny hráčské texty Atlasu do klíčů `atlas.*` v `src/locales/en.js` a `cs.js`, `atlas-content.js` jen ID, klíče a struktura (živé gettery přes `t()`), `atlas-text.js` čísla přes `num`/`unit`; zastaralé kyber výrazy nahradit podle 06; testy; hlavička `03-texty.md`.

## Hotové kroky (vše)
- 285 klíčů `atlas.*` v EN i CS (generováno z 03-texty.md + ruční: teasery, věty čtvrtí, postavy Otto/Wick, místní, Sky Lantern, Chimes, Silver Foil).
- `atlas-content.js`, `atlas-text.js` přepsány; `atlas.js`: `nodeStates` přeskočí `hidden`/`wave>1`, `nextGoal` nespadne za posledním místem.
- Testy: `tests/atlas-i18n.test.js` nový, `atlas-text.test.js` a `atlas.test.js` upraveny.
- Hlavička `03-texty.md`, řádek v `docs/zdroje.md`.
- `npm run format`, `npm test`: 428/428.

## Změněné soubory
src/atlas-content.js, src/atlas-text.js, src/atlas.js, src/locales/en.js, src/locales/cs.js, tests/atlas-i18n.test.js (nový), tests/atlas-text.test.js, tests/atlas.test.js, research/atlas/03-texty.md, docs/zdroje.md, tento soubor.
