# Běh: nové vizuální směry (art-director)

**Zadání:** průzkum úplně nové vizuální identity (4 odlišné směry + A0 dnešek), prototyp `prototype-styly.html`, snímky, dokument `research/design/04-nove-smery.md`, otázky BLOCKED pro uživatele. Bible 02 se nemění.

## Hotové kroky
- [x] 1. Soubor průběhu založen.
- [x] 2. Kontext (bible 02, palette.js, mood.js, geometry.js, toon.js, plane.js, 06) a rešerše (Alto, Tearaway, Monument Valley, riso, Sayonara, Mini Metro, Gris, cestovní plakáty, Hasui, A Short Hike, Old Man's Journey).
- [x] 3. 4 směry: B Papírové město, C Cestovní plakát, D Risograf, E Protisvětlo (+ A0 dnešek). Data v `prototype/styly/styles.js`.
- [x] 5. Měření: kontrast vlaštovky z vykresleného snímku (`__styly.measure()`, 5 časů letu × 4 čtvrti × 5 stylů), QTE a UI analyticky (scratchpad qte.mjs, ui.mjs), draw calls a trojúhelníky (renderer.info). Snímky 35 ks v `research/design/img/smery/`. Riso: obrys vlaštovky přepnut na černou (federální modrá nedržela 3 : 1); QTE barvy C, D, E upraveny na ≥ 3 : 1.
- [x] 6. `research/design/04-nove-smery.md` napsán (rešerše, 4 směry, srovnání, doporučení C, otázky). `npm test` 213/213 (src beze změny).
- [x] 4. Prototyp: `prototype-styly.html`, `prototype/styly/{main.js,city.js,styles.js,ui.css}`. Běží v Chrome bez chyb (okno viditelné), přepínač 5 stylů × 4 čtvrti × výsledek/let/událost × 3 velikosti, pohlednice z render targetu.

## Rozpracovaný krok
- (žádný, hotovo)

## Další kroky
- čeká na rozhodnutí uživatele (BLOCKED v reportu).

## Změněné soubory
- runs/2026-10-14-nove-smery.md, prototype-styly.html, prototype/styly/{main.js,city.js,styles.js,ui.css}, research/design/04-nove-smery.md, research/design/img/smery/ (35 png)
