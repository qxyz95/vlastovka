# C1 Zapojení Atlasu (15. 10. 2026)
Zadání: Atlas (mountAtlas) zapojit do ui.js: onChange/onNav, novinka na kartě výsledku, clearUndo, tečka, přeskočení renderu.

Hotovo: reveal.js (`resultNovelty`, `atlasDot`), ui.js (mountAtlas, onNav, novinka v `#result-extra`, clearUndo ve startFlight, tečka přes `data-notice` + aria-label, přeskok renderu při otevřeném Atlasu s `redraw` příznakem), style.css (tečka na konci), tests/c1-atlas.test.js (6 testů). npm test 465 zelených.
Prohlížeč (server 4191, ?timer): hod z uloženého save s best 300 -> karta s novinkou (EN/CS), tečka "Atlas, New/Nové", koupě Crowd Chain v Atlasu + Undo, clearUndo po hodu, další karta "Found: Market under the Bunting -> Crowd Chain", nav Atlas->Dílna, Dílna->Atlas, Atlas->Throw, Esc.
Změněné soubory: src/ui.js, src/reveal.js, style.css, tests/c1-atlas.test.js.
