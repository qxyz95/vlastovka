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

## Navázání (uživatel 14. 10.): „víc hra než aplikace“
Uživatel: výsledek = možnost (a) Házet znovu, Dílna, Atlas, malé Menu; styl na obrazovce (C Cestovní plakát) se mu líbí; „zamakat“.
- [ ] 8. Maketa obrazovek jako ve hře v prototypu (menu, hra s pauzou, pauza, nastavení EN/CS, výsledek (a), Atlas, Dílna placeholder), klikací průchod, styl C.
- [ ] 9. Snímky `img/smery/c-menu*.png` atd., kapitola v 04, report.
- [x] 8. Maketa menu v prototype-styly (srovnání, `?srovnani=1`): HTML už v commitu 95f6c6a, doplněno CSS a navigace. Pozor: směr B schválen, menu vlastní product-designer (`prototype-menu.html`, runs/2026-10-14-menu.md) → dál nerozvíjet.
- [ ] 9. ZRUŠENO (snímky menu) – nahrazeno požadavky uživatele níže.

## Navázání 2 (uživatel 14. 10.): research přechodů mezi pozadími a stínů
Uživatel: „jak se řeší přechod mezi jednotlivými backgrounds? … vyšli agenty“ a „stíny ve hře vypadají zvláštně … research … plán implementace“. Nemám nástroj na spouštění agentů → research dělám sám (WebSearch).
- [x] 10. Diagnóza stínů v prototypu B (`prototype-styly.html?shot=let&place=1&shadows=skyline|off|map-near&t=6&paused`).
- [ ] 11. `research/design/08-stiny.md` (research + plán implementace).
- [ ] 12. `research/design/09-prechody-ctvrti.md` (research přechodů + doporučení).
- [ ] 13. (volitelně) ukázka nových stínů v `prototype/styly/stiny.*`.
- [x] 11. `research/design/08-stiny.md` + ukázka `prototype/styly/stiny.js` (`prototype-styly.html?stiny`, režim „stíny na zem“), snímky `research/design/img/stiny/`. Měřeno: GPU 5,63 ms (zem) × 5,42 (siluety) × 5,75 (bez), kontrast vlaštovky beze změny (obrys 7,7–8,7).
- [x] 12. `research/design/09-prechody-ctvrti.md` (4 vrstvy přechodu, brány, plán T1–T5).
- [x] 13. Uživatel navíc: „modely detailně jednotlivě, pak do hry“ → `research/design/10-katalog-modelu.md` (katalog modelů v kódu, plán K0–K5).
- Hotovo, čeká na rozhodnutí uživatele (BLOCKED v reportu).
