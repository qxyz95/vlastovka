# Just Throw It: kontext projektu

Webová arkáda o házení papírové vlaštovky (neonové město). Dnes česky, **rozhodnuto 13. 10. 2026: celá hra bude v angličtině** (překlad zatím neproběhl, nové herní texty psát anglicky; dokumenty zůstávají česky). Vanilla JS, ES moduly, bez závislostí.
Repozitář: https://github.com/qxyz95/vlastovka (větev `main`). Commity jako `qxyz95 <qxyz95@users.noreply.github.com>`.

## Spuštění a ověření
- `npm start` spustí http://127.0.0.1:4173 (nespouštět přes `file://`).
- `npm test` spustí `node --test`, bez instalace (Node 24).
- `npm run simulate` / `node simulation/qte-balance.mjs` **přepisují reporty v `simulation/`**. Pro průzkum spouštět jinde nebo vlastním skriptem.

## Architektura
- **Logika (čisté funkce, bez DOM):** `config.js` (parametry, ceny, modely, efekty vylepšení), `core.js` (arkádový let, nákup, odměna, bot `simulate`), `events.js` (QTE poryv a holub, `TIMING`, `windows(f)`), `throw.js` (úhel a síla hodu), `scenes.js` (trasa 16 míst × ~305 m, čtvrti), `storage.js` (validace a ukládání do localStorage), `random.js` (seedovaný RNG).
- **Renderer (od 14. 10. 2026, fáze a4–a6): 3D je výchozí.** `ui.js` vybere renderer při startu: `src/render3d/index.js` (three.js), nebo 2D `render.js` při `?render=2d`, bez WebGL2 nebo když 3D selže při vytvoření kontextu. Oba mají `render(canvas,f,model,time,visual)` a `view(f)`; `visual` navíc nese `state`, `aim {angle,held,charge}` a `best`. 2D zůstává jen do fáze f plánu 3D (pak bez WebGL jen hláška). V `.scene` leží `#scene3d` (WebGL, `pointer-events:none`) pod průhlednou UI vrstvou `#game`, která drží všechny vstupy; `body[data-render]` = `3d`/`2d`, přepínač stylů je jen ve 2D. Mířidla kreslí `ui-layer.drawAim` v obou režimech z `view(null)` (inline overlay v `ui.js` zrušen). Ladění: `?perf=1` (panel ms/snímek), `?timer` (smyčka přes MessageChannel, běží i ve skrytém okně), `window.__r3d` (`advance`, `snapshot`, `bench`, `lose`, `restore`). Výkon a screenshoty: `reports/3d/perf.md`, `reports/3d/a5/`.
- **`src/render3d/` (3D):** čisté `frame.js` (`planFrame` s režisérem kamery z `camera.js` přes `prev.director`, „zadržení dechu“ `mood.hold` při QTE), `camera.js`, `pose.js`, `mood.js`, `comic.js`, `fx-map.js`, `ui-layer.js`, `palette.js` (i barvy města a holuba), `events-view.js`, `life.js`, `geometry.js`; three.js `scene.js`, `city.js`, `plane.js` (3D stopa; 2D stopa z `juice` se nekreslí), `workshop.js`, `companion3d.js` (holub-kurýr nesoucí vlaštovku při `f.carry`, pára z ventilace při poryvu, v každé čtvrti), `life3d.js` (dočasně život Violet Suburbs, FALLBACK(D1)), `toon.js`. `index.js`: `view(f)` = krok režiséra z posledního plánu (= `plan.view`), ztráta kontextu (UI a hra běží dál, pod nimi gradient z `mood` a silueta vlaštovky, obnova postaví scénu znovu), předehřátí míst 2–5 a `renderer.compile` v Dílně, Dílna a výsledek 30 fps, skrytá záložka nekreslí.
- **Prezentace 2D (do smazání):** `render.js`, `route-render.js`, `backgrounds.js`, `atmosphere.js`, `decorations.js` vykreslují canvas 640×360. `ui.js` obsahuje stavový automat (workshop → aim → flight → result), vstupy a HUD.
- **Vizuální styly (`themes.js`):** `cyber` (výchozí, pixelové SVG nebe), `paper` (papírová koláž), `blueprint` (technický výkres, jen obrysy), `dusk` (plochý soumrak). Téma mění jen nebe, palety a způsob malby (`box`/`tri`/`paint`); geometrie trasy a rychlosti paralaxy (nebe .035, vzdálené město .28, popředí 1) jsou společné. Hladká témata kreslí canvas ve 2× rozlišení (`render.js` přepíná `canvas.width`). Volba: přepínač v navigaci, `?styl=<id>`, uloženo v `localStorage['just-throw-it-theme']` (mimo save). `background-preview.html` má výběr stylu.
- **Komiksový prototyp `verse` (14. 10. 2026, fáze A grafického rozboru, jen náhled):** `src/themes-verse.js` (importuje ho jen `background-preview.html`, není v `THEMES`, hra ani `?styl=` v `index.html` ho nevidí). Techniky: `mode:'ink'` ve štětcích (výplň + obrys v obrazovkových px), stínová strana budov jedním tónem s půltónem (hák `theme.shade` v `building()`), posterizovaná obloha 4 pásy + půltónové přechody, statické vrstvy (obloha, slunce, mraky, hřeben) jako memoizované 2× sprity, „on twos“ přes hák `theme.frame` (v `render.js` jen prostředí, kamera a vlaštovka plynulé), misregistrace `theme.misregister` jen u vlaštovky, rychlostní čáry v `overlay(c,{f,env,reduced})`. Náhled `?perf=1` měří ms/snímek (`src/perf.js`, tlačítko Benchmark). Testy `tests/verse.test.js`. `setTheme` přijímá i objekt tématu.
- **3D prototyp (14. 10. 2026, jen zkouška dalšího stylu, nic nenahrazuje):** `prototype-3d.html` + `prototype/3d/` (`geometry.js` čisté funkce bez three.js: vlaštovka, kvádry/jehlany, `cityChunk(screen)` podle `ROUTE`, kamera `follow` = `render.view` v metrech; `toon.js` toon rampa, obrys inverted hull vlastním shaderem, půltón/posterizace; `main.js` varianty (a) 3D vlaštovka nad 2D renderem a (b) 3D město 2,5D). three.js r170 vendorováno ve `vendor/three/` (MIT, import map, bez npm). Testy `tests/render3d-*.test.js`. 2D vlaštovku skrývá kopie tématu cyber s průhlednými barvami (`src/` beze změny).
- **Převod na 3D (plán `research/3d/01-plan-prevodu.md`), fáze 0 hotová 14. 10. 2026:** `src/render3d/` (čisté: `geometry.js` s `cityChunk(index)` v lokálních souřadnicích + `chunkOffset(screen)`, `camera.js` z `director.js`, `life.js`, `districts/<id>-layout.js` zvláštnosti míst; three.js: `toon.js`, `life3d.js`; kostry s vlastníky R1–R4 a smlouvami `view(f)`, `plan`, `ctx`, `frameCtx` v `index.js`; registr `districts/index.js`). Prototyp `prototype/3d/main.js` importuje odtud, autopilot je v `tests/helpers/auto-input.js`. `index.html` má import map a `#scene3d`. Fáze a1–a6 hotové 14. 10. 2026 (3D výchozí, viz Renderer výše). Testy `tests/render3d-*.test.js` vč. strážního testu čistoty.
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

## Známé problémy 3D (14. 10. 2026, po a6)
- Výkon ve viditelném okně a zásek prvního hodu neověřeny (automatizovaný prohlížeč měl zakryté okno), `__r3d.bench` ~5–6 ms/snímek na RTX 3060. Měření na Radeon iGPU a iPhonu chybí.
- Život jen ve Violet Suburbs (`life3d.js`, FALLBACK(D1)); ostatní čtvrti jsou hrubé z `cityChunk` (fáze b). Název místa z režiséra (`camera.title/alpha`) se zatím nikde nezobrazuje.
- Holub je proti vlaštovce malý a při nesení ho částečně kryje kruh výsledku QTE. Pára má toon odstín podle nálady (ne čistě bílá).
- Texty v UI vrstvě (mířidla, štítky) jsou anglicky, zbytek UI česky.

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
