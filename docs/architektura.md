# Architektura Just Throw It

Podrobný popis kódu. Pravidla jsou v `CLAUDE.md` a `.claude/rules/`, stav a známé problémy v `docs/stav.md`.

## Logika (čisté funkce, bez DOM)
- `config.js`: parametry, ceny, modely, efekty vylepšení.
- `core.js`: arkádový let, nákup, odměna, bot `simulate`, `fresh()` (výchozí save), `bestAngle`/`angleHint` (nápověda úhlu po hodu).
- `events.js`: QTE poryv a holub, `TIMING`, `windows(f)`.
- `throw.js`: úhel a síla hodu.
- `scenes.js`: trasa 16 míst × ~305 m (`SCREEN_METERS`), čtvrti, `districtAt`, `routeAt`.
- `storage.js`: validace a ukládání do localStorage, migrace (dnes save v4), záloha poškozeného save do `just-throw-it-v1-corrupt`.
- `random.js`: seedovaný RNG.
- `i18n.js` + `locales/en.js`, `locales/cs.js`: `t(key,params)`, plurály přes `Intl.PluralRules`, čísla podle jazyka (`num`, `unit`, `pct`). Volba `?lang=`, pak `localStorage['just-throw-it-lang']` (mimo save), jinak EN. Chybějící klíč: fallback na EN, pak klíč; `setStrict(true)` v testech vyhodí chybu.
- Atlas: `atlas-content.js` (ID a anglické texty), `atlas-numbers.js` (laditelná čísla, zatím `PROVISIONAL` kopie `params.mjs`), `atlas.js` (čisté funkce, stav v `p.atlas`, objev se odvozuje z `p.best`), `atlas-text.js` (formát a šablony, seznam `FORBIDDEN`). Návrh `research/atlas/01-navrh-atlasu.md`.
- Fyzika krokuje pevně po `DT=1/60` a je deterministická podle seedu. Seed letu = `attempts+1`, tutoriálové události jen pro seed 1.

## Renderer (od 14. 10. 2026, fáze a4–a6): 3D je výchozí
- `ui.js` vybere renderer při startu: `src/render3d/index.js` (three.js), nebo 2D `render.js` při `?render=2d`, bez WebGL2 nebo když 3D selže při vytvoření kontextu. Oba mají `render(canvas,f,model,time,visual)` a `view(f)`; `visual` navíc nese `state`, `aim {angle,held,charge}` a `best`.
- 2D zůstává jen do fáze f plánu 3D (pak bez WebGL jen hláška).
- V `.scene` leží `#scene3d` (WebGL, `pointer-events:none`) pod průhlednou UI vrstvou `#game`, která drží všechny vstupy. `body[data-render]` = `3d`/`2d`. Přepínač stylů ani `?styl=` neexistuje: jediný styl je Papírové město (U0 a R0, 15. 10. 2026; `ui.js` jen maže starý klíč `just-throw-it-theme`).
- Mířidla kreslí `ui-layer.drawAim` v obou režimech z `view(null)` (inline overlay v `ui.js` zrušen).
- Ladění: `?perf=1` (panel ms/snímek), `?timer` (smyčka přes MessageChannel, běží i ve skrytém okně), `window.__r3d` (`advance`, `snapshot`, `bench`, `lose`, `restore`).
- Výkon a screenshoty: `reports/3d/perf.md`, `reports/3d/a5/`.
- `ui.js` obsahuje stavový automat (workshop → aim → flight → result), vstupy a HUD.

## `src/render3d/` (3D)
- **Čisté moduly:** `frame.js` (`planFrame` s režisérem kamery z `camera.js` přes `prev.director`, „zadržení dechu“ `mood.hold` při QTE), `camera.js` (z `director.js`), `pose.js`, `mood.js`, `comic.js`, `fx-map.js`, `ui-layer.js`, `palette.js` (i barvy města a holuba), `events-view.js`, `life.js`, `geometry.js` (`cityChunk(index)` v lokálních souřadnicích + `chunkOffset(screen)`), `districts/<id>-layout.js` (zvláštnosti míst, registr `districts/index.js`).
- **three.js moduly:** `scene.js`, `city.js`, `plane.js` (3D stopa; 2D stopa z `juice` se nekreslí), `workshop.js`, `companion3d.js` (holub-kurýr nesoucí vlaštovku při `f.carry`, pára z ventilace při poryvu, v každé čtvrti), `life3d.js` (dočasně život Violet Suburbs, FALLBACK(D1)), `toon.js`.
- **`index.js`:** smlouvy `view(f)`, `plan`, `ctx`, `frameCtx`, kostry s vlastníky R1–R4. `view(f)` = krok režiséra z posledního plánu (= `plan.view`). Ztráta kontextu: UI a hra běží dál, pod nimi gradient z `mood` a silueta vlaštovky, obnova postaví scénu znovu. Předehřátí míst 2–5 a `renderer.compile` v Dílně, Dílna a výsledek 30 fps, skrytá záložka nekreslí.
- Plán převodu `research/3d/01-plan-prevodu.md` (fáze 0, a1–a6 hotové 14. 10. 2026). `index.html` má import map a `#scene3d`. Testy `tests/render3d-*.test.js` vč. strážního testu čistoty (`render3d-purity.test.js`). Autopilot pro testy je v `tests/helpers/auto-input.js`.

## Prezentace 2D (do smazání ve fázi f)
- `render.js`, `route-render.js`, `backgrounds.js`, `atmosphere.js`, `decorations.js` vykreslují canvas 640×360.
- `render.view(f)` vrací kameru a pozici letadla.

## Vizuální styly 2D (`themes.js`, jen záloha `?render=2d` do smazání ve fázi f)
- Ve hře žádný přepínač stylů není; vzhled 3D hry určuje jen bible `research/design/05-styl-papir.md`. Níže je popis staré 2D zálohy.
- `cyber` (pixelové SVG nebe), `paper` (papírová koláž), `blueprint` (technický výkres, jen obrysy), `dusk` (plochý soumrak).
- Téma mění jen nebe, palety a způsob malby (`box`/`tri`/`paint`). Geometrie trasy a rychlosti paralaxy (nebe .035, vzdálené město .28, popředí 1) jsou společné.
- Hladká témata kreslí canvas ve 2× rozlišení (`render.js` přepíná `canvas.width`).
- Volba stylu ve hře zrušena (U0); `background-preview.html` má vlastní výběr stylu. `setTheme` přijímá i objekt tématu.
- Barvy QTE kruhu, mířicí overlay a texty („NEONOVÉ MĚSTO“, „Prořízni noc“) zůstávají kyberpunkové ve všech stylech.

### Komiksový prototyp `verse` (14. 10. 2026, fáze A grafického rozboru, jen náhled)
- `src/themes-verse.js` importuje jen `background-preview.html`. Není v `THEMES`, hra ho nevidí.
- Techniky: `mode:'ink'` ve štětcích (výplň + obrys v obrazovkových px), stínová strana budov jedním tónem s půltónem (hák `theme.shade` v `building()`), posterizovaná obloha 4 pásy + půltónové přechody, statické vrstvy (obloha, slunce, mraky, hřeben) jako memoizované 2× sprity, „on twos“ přes hák `theme.frame` (v `render.js` jen prostředí, kamera a vlaštovka plynulé), misregistrace `theme.misregister` jen u vlaštovky, rychlostní čáry v `overlay(c,{f,env,reduced})`.
- Náhled `?perf=1` měří ms/snímek (`src/perf.js`, tlačítko Benchmark). Testy `tests/verse.test.js`.

## Animace prostředí (2D)
- `ambient.js`: hvězdy a padající hvězda podle `theme.night`, hejno a déšť z `atmosphereAt`.
- Animace míst v `drawPlace` (`route-render.js`), každé ze 16 míst má vlastní: kouř, vlak, jeřáby, maják, reflektory…
- Oblohy v `themes.js` dostávají `time`. Barvy efektů jsou v `theme.fx`.
- Při reduced motion `render.js` předává `anim=0`, takže prostředí zamrzne a herní zpětná vazba zůstane.

## Pohyb a game feel
Priorita 1 z `reports/Vylepšení animací a nástroje zdarma.md`.
- `motion.js` (čisté): Pennerovy easingy, `damp`/`spring` nezávislé na fps, `wobble`, šum `noise1`/`fbm`, sdílený vítr `drift`/`wind`/`sway`, který řídí mraky, déšť, kouř, stromy, vlajky i turbíny.
- `juice.js` (čistý stav jednoho hodu): trauma → otřes, hitstop, squash & stretch, pružinová rotace letadla, stopa, pool částic ve `Float32Array`, popupy; `fxEvent` pro throw/perfect/success/miss/boost/milestone/land.
- `fx-render.js` je kreslí (2D).
- `ui.js` interpoluje vykreslení mezi kroky fyziky. Hitstop zastaví jen akumulátor (časování QTE běží na čase letu). Po dopadu čeká 850 ms (300 ms při reduced motion) před výsledkem.
- Reduced motion vypne otřes, záblesk a pohyb popupů.

## Hudba (prototyp, hra zvuk zatím nenačítá)
14. 10. 2026, F1+F3 z `research/hudba/01-vyzkum-a-plan.md`.
- `src/audio-mix.js` (čisté): `mixTargets` vrstvy L0–L3 + filtry, `trackFor`/`boundaryCue` podle nejdelšího doletu, `nextBoundary`, `duck`, `scaleNote`/`comboNote`, `createTickPlanner` (tik QTE na přesném čase středu okna), `audioSettings`, `rngFor`/`euclid`.
- `src/audio.js`: AudioContext, busy, plánovač s předstihem, suspend, `localStorage['just-throw-it-audio']`, offline `benchmark`.
- `src/sfx.js`, `src/music/` (`synth.js` nástroje a graf, `compose.js`, směry A–F, `index.js`; generátory taktů jsou čisté a testované).
- `prototype-music.html` + `prototype/music/`: Auto flight, slepý režim, únavový test, vlastní soubor; `?timer` = smyčka přes setTimeout pro automatické ověření ve skrytém okně.
- Testy `tests/audio-mix.test.js`. Offline benchmark ve skrytém okně je nespolehlivý, zátěž ověřovat výpadky (`playbackStats`) v reálném čase.

## Prototypy
- **3D prototyp** (14. 10. 2026, původně zkouška stylu): `archiv/prototype-3d.html` + `archiv/prototype/3d/` (`geometry.js` čisté funkce bez three.js: vlaštovka, kvádry/jehlany, `cityChunk(screen)` podle `ROUTE`, kamera `follow` = `render.view` v metrech; `toon.js` toon rampa, obrys inverted hull vlastním shaderem, půltón/posterizace; `main.js` varianty (a) 3D vlaštovka nad 2D renderem a (b) 3D město 2,5D). Dnes `archiv/prototype/3d/main.js` importuje z `src/render3d/`. 2D vlaštovku skrývá kopie tématu cyber s průhlednými barvami. Smaže se ve fázi g plánu 3D.
- **three.js r170** vendorováno ve `vendor/three/` (MIT, import map, bez npm).
- **Atlas:** `prototype/atlas/` (`content.js`, `logic.js`, `numbers.js`, `art.js`; zástupné SVG pohlednice), stránka `prototype-atlas.html` vzniká (fáze A1).
- Další: `archiv/prototype-papers.html` + `archiv/prototype/papers/`, `render3d-preview.html`.

## Simulátor progrese (`simulation/progression/`)
- `params.mjs`, `model.mjs`, `abilities.mjs`, `campaign.mjs`, `run.mjs`, `README.md` (spuštění a přepínače), `AUDIT.md`, `REPORT.md`, výstupy `out/`, testy `tests/progression*.test.js`.
- Nezávislý na `src/`. Laditelná čísla jen v `params.mjs` (původní z 08 v `out/params-08.json`).
- Starý simulátor 0.x: `simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs` s reporty `REPORT.md`, `MONTE-CARLO.md`, `QTE-BALANCE.md` (nespouštět, přepisují reporty).

## Dokumenty a research
- `KB vlastovky.md`, `KB zabavnost a motivace.md` (backlog B00–B14, K1–K7), `archiv/Plan realizace.md` (archiv). README obsahuje historii verzí.
- Research designu a psychologie her (13. 10. 2026): `research/00-temata.md`, 9 bloků v `research/kb/01–09`, rejstřík, rozpory a fronta neověřeného v `research/kb/README.md`. Štítky V/H/N.
- Návrhy bonusů a vylepšení (13. 10. 2026): `research/bonusy/`: zadání `00`, pět pohledů `01–05` (karty D, B, DQ, SV, E, přes 110 karet), rozhodnutí uživatele `06-rozhodnuti.md` (mají přednost před kartami), review `07`, ucelený návrh systému `08-navrh-kolo2.md` (Workshop s papíry Copy/Kraft/Washi/Neon Foil, Atlas 16 míst = 16 trvalých bonusů, 2 Pockets se 6 speciálními bonusy, vítr, plující QTE, kombo, postavy), plán ověření `09`, výsledky ladění `10-ladeni.md`, plán implementace `11-plan-implementace.md`. Postup v kolech (review → mezery → rozhodnutí → 2. kolo → užší výběr → Monte Carlo). Nespěchat.
- Živý svět `research/svet/01-zivy-svet.md`, 3D `research/3d/`, hudba `research/hudba/`, Atlas `research/atlas/`.
