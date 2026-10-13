# Just Throw It: kontext projektu

Česká webová arkáda o házení papírové vlaštovky (neonové město). Vanilla JS, ES moduly, bez závislostí.
Repozitář: https://github.com/qxyz95/vlastovka (větev `main`). Commity jako `qxyz95 <qxyz95@users.noreply.github.com>`.

## Spuštění a ověření
- `npm start` spustí http://127.0.0.1:4173 (nespouštět přes `file://`).
- `npm test` spustí `node --test`, bez instalace (Node 24).
- `npm run simulate` / `node simulation/qte-balance.mjs` **přepisují reporty v `simulation/`**. Pro průzkum spouštět jinde nebo vlastním skriptem.

## Architektura
- **Logika (čisté funkce, bez DOM):** `config.js` (parametry, ceny, modely, efekty vylepšení), `core.js` (arkádový let, nákup, odměna, bot `simulate`), `events.js` (QTE poryv a holub, `TIMING`, `windows(f)`), `throw.js` (úhel a síla hodu), `scenes.js` (trasa 16 míst × ~305 m, čtvrti), `storage.js` (validace a ukládání do localStorage), `random.js` (seedovaný RNG).
- **Prezentace:** `render.js`, `route-render.js`, `backgrounds.js`, `atmosphere.js`, `decorations.js` vykreslují canvas 640×360. `ui.js` obsahuje stavový automat (workshop → aim → flight → result), vstupy a HUD.
- Fyzika krokuje pevně po `DT=1/60` a je deterministická podle seedu. Seed letu = `attempts+1`, tutoriálové události jen pro seed 1.
- Dokumenty: `KB vlastovky.md`, `KB zabavnost a motivace.md` (backlog B01–B10, K1–K7), `Plan realizace.md`. README obsahuje historii verzí.

## Pravidla
- Kód je psaný hutně (one-linery). Úpravy dělat ve stejném stylu, dokud se nerozhodne o formátování.
- Simulace i testy importují `src/` přímo. Logiku nemíchat s DOM.
- Každá oprava chování by měla mít test v `tests/`.

## Stav (13. 10. 2026, verze 0.6.1)
Proběhlo review kódu, obsahu a mechanik. Opravené:
- Úspěšný holub už nezkracuje stoupání (`vy=max(.4,vy)`).
- HUD a `#scene-label` nechytají klepnutí (`pointer-events:none`).
- Mezerník na jiném tlačítku nespustí hod.
- Poškozený save se zálohuje do `just-throw-it-v1-corrupt`, NaN dolet se neuloží.
- Příběhy míst se zobrazují v `#journey-story` (za letu aktuální místo, jinak nejvzdálenější). Štítek scény ukazuje čtvrť a místo.
- **0.6:** arkádový model letu (klouzavost, ideální úhel modelu), sdílený strom vylepšení (save v3 s migrací), odlišné role šipky a kluzáku, širší okna QTE, stisk ve varování se ignoruje, kratší mezery, časovací kruh ve scéně a klepnutí do scény. Viz README „Verze 0.6“.
- **0.6.1:** přehyby posílené (účinek QTE +12 %/úr., odpuštění síly 15 %), po hodu nápověda úhlu (`bestAngle`, `angleHint` v `core.js`), ceny přeladěné Monte Carlem.
- Texty sjednocené: Dílna (ne Hangár), Bonusy (ne Bonus tree), intro odpovídá trase předměstí → doky → jádro. Čísla v českém formátu (`num()` v `ui.js`). Po 500 m ukazuje HUD hranici dalšího místa.

## Známé problémy (z review 13. 10. 2026)
**Mechaniky / balanc**
- Ekonomika 0.6.1: ceny `[35,105,195,300,420]`, odměna 10 + dolet/10. Podle `simulation/MONTE-CARLO.md` (sekce Aktualizace 0.6.1, `node simulation/monte-carlo.mjs`, ~2 min) průměrný hráč 23 hodů / ~12 min, slabý 31 / ~15 min, bez softlocku. Specializace do jedné větve je pomalejší než vyvážený nákup (záměr).
- QTE mají pořád stejný střed okna (dá se naučit nazpaměť).
- Vítr je vždy nulový (`ui.js`). Po 500 m nic nenavazuje a mince nemají využití.
- `simulation/REPORT.md` je zastaralý (verze 0.1.0).

**Obsah**
- Cíl 500 m pokryje jen 2 ze 16 míst.
- Nápisy kreslené ve scéně zůstaly anglicky („PAPER LAB“ apod.), záměrně jako neonové reklamy.
- Jen 2 typy událostí se stejnými texty a málo humoru. `bonus.html` je prázdná stránka v navigaci.

**Kód**
- Render smyčka běží pořád a v každém snímku přepisuje DOM. Texty v canvasu jsou na mobilu nečitelné.
- `#paused` se nikdy reálně nezobrazí. Reduced motion je jen částečné. `background-preview.html` přetáčí na 10 000 m místo 4 876 m.
- Mrtvé assety `*-far.svg` a `*-near.svg` a staré zelené téma v `style.css`.
- Magická čísla mimo config (odemčení 100, cíl 500, časování QTE duplikované v `simulate`). Křehké mapování profilu v `simulate`, RNG streamy simulace se překrývají.
