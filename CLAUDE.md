# Just Throw It: kontext projektu

Webová arkáda o házení papírové vlaštovky (neonové město). Dnes česky, **rozhodnuto 13. 10. 2026: celá hra bude v angličtině** (překlad zatím neproběhl, nové herní texty psát anglicky; dokumenty zůstávají česky). Vanilla JS, ES moduly, bez závislostí.
Repozitář: https://github.com/qxyz95/vlastovka (větev `main`). Commity jako `qxyz95 <qxyz95@users.noreply.github.com>`.

## Spuštění a ověření
- `npm start` spustí http://127.0.0.1:4173 (nespouštět přes `file://`).
- `npm test` spustí `node --test`, bez instalace (Node 24).
- `npm run simulate` / `node simulation/qte-balance.mjs` **přepisují reporty v `simulation/`**. Pro průzkum spouštět jinde nebo vlastním skriptem.

## Architektura
- **Logika (čisté funkce, bez DOM):** `config.js` (parametry, ceny, modely, efekty vylepšení), `core.js` (arkádový let, nákup, odměna, bot `simulate`), `events.js` (QTE poryv a holub, `TIMING`, `windows(f)`), `throw.js` (úhel a síla hodu), `scenes.js` (trasa 16 míst × ~305 m, čtvrti), `storage.js` (validace a ukládání do localStorage), `random.js` (seedovaný RNG).
- **Prezentace:** `render.js`, `route-render.js`, `backgrounds.js`, `atmosphere.js`, `decorations.js` vykreslují canvas 640×360. `ui.js` obsahuje stavový automat (workshop → aim → flight → result), vstupy a HUD.
- **Vizuální styly (`themes.js`):** `cyber` (výchozí, pixelové SVG nebe), `paper` (papírová koláž), `blueprint` (technický výkres, jen obrysy), `dusk` (plochý soumrak). Téma mění jen nebe, palety a způsob malby (`box`/`tri`/`paint`); geometrie trasy a rychlosti paralaxy (nebe .035, vzdálené město .28, popředí 1) jsou společné. Hladká témata kreslí canvas ve 2× rozlišení (`render.js` přepíná `canvas.width`). Volba: přepínač v navigaci, `?styl=<id>`, uloženo v `localStorage['just-throw-it-theme']` (mimo save). `background-preview.html` má výběr stylu.
- **Komiksový prototyp `verse` (14. 10. 2026, fáze A grafického rozboru, jen náhled):** `src/themes-verse.js` (importuje ho jen `background-preview.html`, není v `THEMES`, hra ani `?styl=` v `index.html` ho nevidí). Techniky: `mode:'ink'` ve štětcích (výplň + obrys v obrazovkových px), stínová strana budov jedním tónem s půltónem (hák `theme.shade` v `building()`), posterizovaná obloha 4 pásy + půltónové přechody, statické vrstvy (obloha, slunce, mraky, hřeben) jako memoizované 2× sprity, „on twos“ přes hák `theme.frame` (v `render.js` jen prostředí, kamera a vlaštovka plynulé), misregistrace `theme.misregister` jen u vlaštovky, rychlostní čáry v `overlay(c,{f,env,reduced})`. Náhled `?perf=1` měří ms/snímek (`src/perf.js`, tlačítko Benchmark). Testy `tests/verse.test.js`. `setTheme` přijímá i objekt tématu.
- **3D prototyp (14. 10. 2026, jen zkouška dalšího stylu, nic nenahrazuje):** `prototype-3d.html` + `prototype/3d/` (`geometry.js` čisté funkce bez three.js: vlaštovka, kvádry/jehlany, `cityChunk(screen)` podle `ROUTE`, kamera `follow` = `render.view` v metrech; `toon.js` toon rampa, obrys inverted hull vlastním shaderem, půltón/posterizace; `main.js` varianty (a) 3D vlaštovka nad 2D renderem a (b) 3D město 2,5D). three.js r170 vendorováno ve `vendor/three/` (MIT, import map, bez npm). Testy `tests/prototype3d.test.js`. 2D vlaštovku skrývá kopie tématu cyber s průhlednými barvami (`src/` beze změny).
- **Hudební prototyp (14. 10. 2026, F1+F3 z `research/hudba/01-vyzkum-a-plan.md`, hra zvuk zatím nenačítá):** `src/audio-mix.js` (čisté: `mixTargets` vrstvy L0–L3 + filtry, `trackFor`/`boundaryCue` podle nejdelšího doletu, `nextBoundary`, `duck`, `scaleNote`/`comboNote`, `createTickPlanner` tik QTE na přesném čase středu okna, `audioSettings`, `rngFor`/`euclid`), `src/audio.js` (AudioContext, busy, plánovač s předstihem, suspend, `localStorage['just-throw-it-audio']`, offline `benchmark`), `src/sfx.js`, `src/music/` (`synth.js` nástroje a graf, `compose.js`, směry A–F, `index.js`; generátory taktů jsou čisté a testované). `prototype-music.html` + `prototype/music/` (Auto flight, slepý režim, únavový test, vlastní soubor; `?timer` = smyčka přes setTimeout pro automatické ověření ve skrytém okně). Testy `tests/audio-mix.test.js`. Offline benchmark ve skrytém okně je nespolehlivý, zátěž ověřovat výpadky (`playbackStats`) v reálném čase.
- **Animace prostředí:** `ambient.js` (hvězdy a padající hvězda podle `theme.night`, hejno a déšť z `atmosphereAt`), animace míst v `drawPlace` (`route-render.js`, každé ze 16 míst má vlastní: kouř, vlak, jeřáby, maják, reflektory…), oblohy v `themes.js` dostávají `time`. Barvy efektů jsou v `theme.fx`. Při reduced motion `render.js` předává `anim=0`, takže prostředí zamrzne a herní zpětná vazba zůstane.
- **Pohyb a game feel (priorita 1 z `reports/Vylepšení animací a nástroje zdarma.md`):** `motion.js` (čisté: Pennerovy easingy, `damp`/`spring` nezávislé na fps, `wobble`, šum `noise1`/`fbm`, sdílený vítr `drift`/`wind`/`sway`, který řídí mraky, déšť, kouř, stromy, vlajky i turbíny). `juice.js` (čistý stav jednoho hodu: trauma → otřes, hitstop, squash & stretch, pružinová rotace letadla, stopa, pool částic ve `Float32Array`, popupy; `fxEvent` pro throw/perfect/success/miss/boost/milestone/land). `fx-render.js` je kreslí. `ui.js` interpoluje vykreslení mezi kroky fyziky, hitstop zastaví jen akumulátor (časování QTE běží na čase letu) a po dopadu čeká 850 ms (300 ms při reduced motion) před výsledkem. Reduced motion vypne otřes, záblesk a pohyb popupů. `render.view(f)` vrací kameru a pozici letadla.
- Fyzika krokuje pevně po `DT=1/60` a je deterministická podle seedu. Seed letu = `attempts+1`, tutoriálové události jen pro seed 1.
- Dokumenty: `KB vlastovky.md`, `KB zabavnost a motivace.md` (backlog B00–B14, K1–K7), `Plan realizace.md`. README obsahuje historii verzí.
- Research designu a psychologie her (13. 10. 2026): `research/00-temata.md`, 9 bloků v `research/kb/01–09`, rejstřík, rozpory a fronta neověřeného v `research/kb/README.md`. Štítky V/H/N. Shrnutí a doporučení zatím nevznikla.
- Návrhy bonusů a vylepšení (13. 10. 2026): `research/bonusy/`: zadání `00`, pět pohledů `01–05` (karty D, B, DQ, SV, E, přes 110 karet), rozhodnutí uživatele `06-rozhodnuti.md` (mají přednost před kartami). Postup v kolech (review → mezery → rozhodnutí → 2. kolo → užší výběr → Monte Carlo). Nespěchat. Review `07`, ucelený návrh systému `08-navrh-kolo2.md` (Workshop s papíry Copy/Kraft/Washi/Neon Foil, Atlas 16 míst = 16 trvalých bonusů, 2 Pockets se 6 speciálními bonusy, vítr, plující QTE, kombo, postavy), plán ověření `09`, výsledky ladění `10-ladeni.md`.
- **Simulátor nového systému** `simulation/progression/` (params/model/abilities/campaign/run.mjs, `README.md`, `AUDIT.md`, `REPORT.md`, výstupy `out/`, testy `tests/progression.test.js`). Nezávislý na `src/`, nový systém zatím **není ve hře**. Laditelná čísla jen v `params.mjs` (původní z 08 v `out/params-08.json`). Stav 13. 10. 2026: délka hry průměrný 98–118 hodů / 53–62 min, slabý 115–140, expert 75–84; lety ~28 s. 15–19 z 61 cílů nesplněno. 14. 10. 2026: 6 změn z `10-ladeni.md` §5 přijato (`06`, plán `11-plan-implementace.md`) a zapracováno do simulátoru s testy (přepínače zpět v `params.mjs`). **Výsledky v `REPORT.md` pro novou verzi neplatí, čeká přeladění F5** (známý problém: strategie „Paper napřed“ se zasekne na ceně Kraftu).

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

- **Styly, animace prostředí a game feel (13. 10. 2026, nad 0.6.1, bez nového čísla verze):** 3 alternativní vizuální styly k porovnání, animace míst a oblohy, juice (otřes, hitstop, částice, popupy). Bez změny mechaniky a balancu. Barvy QTE kruhu, mířicí overlay v `ui.js` a texty („NEONOVÉ MĚSTO“, „Prořízni noc“) zůstávají kyberpunkové ve všech stylech.

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
