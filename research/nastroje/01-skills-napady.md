# Nástroje a skills: co si vzít (průzkum 14. 10. 2026)

Zadání: projít sedm zdrojů skills, agentů a MCP serverů, **nic neinstalovat**, jen zapsat nápady. Nainstalováno zůstává `frontend-design`, testuje se přes `claude-in-chrome`. Vše čteno přes GitHub (README, SKILL.md, definice agentů, reference). Citace jsou krátké, zbytek je shrnutí vlastními slovy. Čísla převzatá z cizích repozitářů jsou jejich výchozí hodnoty, ne naše rozhodnutí.

## Přehled

| Nástroj | Co přináší | Převzít hned (do čeho) | Instalovat kdy |
|---|---|---|---|
| `microsoft/playwright-mcp` (+ záznam `playwright` v `claude-plugins-official/external_plugins`) | Vlastní prohlížeč řízený přes strom přístupnosti, emulace zařízení (`--device "iPhone 15"`, `--mobile`), `--viewport-size`, screenshoty, trace a video (`--caps=devtools`), aserce (`--caps=testing`) | Matice viewportů a stavů do `game-dev.md` (ověřovat i s claude-in-chrome přes `resize_window`) | Když potřebujeme opakovatelné mobilní screenshoty nebo **viditelné okno** pro měření (náš známý problém se zakrytým oknem), nebo regresní screenshoty před releasem |
| `ChromeDevTools/chrome-devtools-mcp` | Performance trace s insighty, `emulate` (CPU throttling, síť, viewport s DPR a touch), heap snapshoty a jejich porovnání, Lighthouse audit přístupnosti, `evaluate_script` | Postup měření výkonu a úniku paměti (níže), napojit na `__r3d.bench` a `renderer.info` | Až budeme ladit zásek prvního hodu, únik paměti při obnově kontextu nebo simulovat slabší CPU (iGPU/iPhone). Pozor: oficiálně jen Chrome, ne Brave |
| `anthropics/skills`: `webapp-testing` | Postup „průzkum, pak akce“, čekat na ustálení, sbírat konzoli, pomocný skript pro server | Pravidlo „nejdřív snímek a DOM, pak selektory“ a „konzole bez chyb celý běh“ do `game-dev.md` | Spíš ne, je v Pythonu a Playwright (cizí závislost). Až bychom chtěli headless CI |
| `anthropics/skills`: `theme-factory`, `brand-guidelines`, `canvas-design`, `algorithmic-art` | Téma = paleta hex + dvojice písem + pravidla použití; výběr jen po potvrzení; filozofie designu před kresbou; seedovaná generativní grafika s parametry | Formát „style tile“ pro naši vizuální identitu (paleta čtvrtí, písma, pravidla) do výstupů `product-designer`; „finální průchod jen zjemňuje, nepřidává“ | Neinstalovat. Témata jsou obecná kancelářská. `canvas-design` jen pro plakát nebo key art |
| `CloudAI-X/threejs-skills` (10 skillů) | Přehledy API: základy, geometrie, materiály (vč. `MeshToonMaterial` + `gradientMap`), post-processing (`OutlinePass`, `HalftonePass`), interakce | Kontrolní seznam výkonu three.js (instancing, sdílené materiály, merge, dispose, pooling) do `game-dev.md` | Neinstalovat celé. Psané „pro r160+“, verzi nepinují, místy staré GLSL (`texture2D`, `gl_FragColor`) a pochybné WebGPU ukázky. Případně zkopírovat 1–2 soubory jako referenci, až budeme dělat nové shadery |
| `wshobson/agents`, plugin `ui-design` | 3 agenti (`ui-designer`, `accessibility-expert`, `design-system-architect`), 9 skills, 4 příkazy (`design-review`, `accessibility-audit`…) | Checklist přístupnosti (POUR), škála závažnosti, šablona design review, časování animací, stavy komponent | Neinstalovat. Je zaměřený na React/Tailwind a webové formuláře. Příkazy si vezmeme jako šablony |
| `majidmanzarpour/threejs-game-skills` | Director + 8 specialistů, hlavně `game-ui-designer`, `debug-profiler`, `qa-release`; inspektor plátna, bot playtest, evidence manifest | Triage černého plátna, metriky k baseline, pořadí optimalizací, matice viewport × stav, bot playtest se dvěma rychlostmi reakce, rozpočty renderu | Neinstalovat (Vite + TypeScript scaffold, API klíče pro generátory). Zvážit převzetí myšlenky inspektoru plátna jako vlastního skriptu bez závislostí |
| `Donchitos/Claude-Code-Game-Studios` | 49 agentů, 74 skills, 12 hooků; `balance-check`, `playtest-report`, `perf-profile`, game/economy/systems/ux designer, accessibility-specialist | Pravidlo „NOT ASSESSED místo odhadu“, verdikty balance-checku, šablona playtest reportu, dokumentace vzorců (proměnné, rozsahy, okrajové hodnoty), přístupnost QTE | Neinstalovat. Je to celá „studiová“ struktura s vlastními složkami a hooky, přebila by naše `CLAUDE.md`. Brát jednotlivé šablony |

## 1. Playwright MCP (`microsoft/playwright-mcp`) a plugin `playwright`

**Obsah.** MCP server s vlastním prohlížečem. Výchozí režim čte strom přístupnosti (bez obrázků), `--caps=vision` přidá klikání na souřadnice (pro canvas hru potřeba). Screenshoty (PNG/JPEG, celá stránka), emulace zařízení `--device` nebo obecné `--mobile`, `--viewport-size`, `--isolated` (profil v paměti, čistý localStorage), `--storage-state` (načíst připravený save). Volitelné skupiny `--caps`: `testing` (aserce `browser_verify_*`, generátor lokátorů), `devtools` (trace, video), `pdf`, `storage`, `network`. Plugin v `anthropics/claude-plugins-official/external_plugins/playwright` je jen `.mcp.json`, který spouští `npx @playwright/mcp@latest`.

**Zafixování verze.** `@latest` je přesně to, co nechceme. Při instalaci použít pevnou verzi, např. `claude mcp add playwright -- npx @playwright/mcp@<verze>` (číslo vybrat z npm v den instalace a zapsat do `CLAUDE.md`), a nepoužívat plugin z marketplace, protože jeho `.mcp.json` má `@latest`. Profil leží v `%USERPROFILE%\AppData\Local\ms-playwright\mcp-...`, pro testy raději `--isolated`.

**Převzít hned.**
- Ověřovat podle **matice viewport × stav**: 360×640 (malý telefon), 390×844 (iPhone), 768×1024, 1280×720, 1920×1080 × stavy Dílna, míření, let, QTE poryv, QTE holub, výsledek, Atlas. S claude-in-chrome přes `resize_window`.
- Testovat i s **čistým profilem** (prázdný save) a s **připraveným savem** (pozdní hra), nejen s tím, co v prohlížeči zrovna je.

**Nepřevzít.** Výchozí režim „bez obrázků“ nám u canvas hry nic neřekne, HUD v DOM ano.

**Spouštěč instalace.** (a) Potřebujeme měřit ve **viditelném okně** a claude-in-chrome dál dává `document.hidden = true` (viz `reports/3d/perf.md`); (b) chceme sadu mobilních screenshotů opakovaně před každým milníkem; (c) WebKit emulace jako náhrada za iPhone (jen hrubá, výkon neřeší).

## 2. Chrome DevTools MCP (`ChromeDevTools/chrome-devtools-mcp`)

**Obsah.** 59 nástrojů. Pro nás podstatné: `performance_start_trace` / `stop` / `analyze_insight` (zaměřené na načítání a Core Web Vitals, ne na FPS ve hře), `emulate` (CPU throttling, síť, viewport ve tvaru `šířkaxvýškaxDPR,mobile,touch`, barevné schéma; každé volání přepíše předchozí nastavení), `take_heapsnapshot` a s `--memoryDebugging=true` porovnání dvou snapshotů, zadržující cesty, odpojené DOM uzly. `lighthouse_audit` (přístupnost, bez výkonu), `list_console_messages` se stack trace, `evaluate_script`, screencast (experimentální). Telemetrie je **zapnutá ve výchozím stavu** (vypnout `--no-usage-statistics`), trace URL může jít do CrUX (`--no-performance-crux`). Oficiálně jen Google Chrome, my měříme v Brave.

**Převzít hned: postup měření výkonu 3D** (do `game-dev.md` a `reports/3d/perf.md`):
1. Pevný scénář: seed, místo, délka letu, rozlišení plátna, DPR, post-proces zap/vyp, viditelné okno (`document.hidden === false`, jinak měření neplatí).
2. Baseline: `__r3d.bench(n)` (avg, P95, CPU) + `renderer.info` (calls, triangles, geometries, textures) + `performance.memory.usedJSHeapSize`, pokud je.
3. Jedna změna, znovu stejný scénář, tabulka před/po.
4. Slabší zařízení: CPU throttling 4× a 6× jako hrubý zástupce iPhonu nebo iGPU (GPU tím nezpomalíme, výsledek je jen orientační).
5. **Test úniku:** heap a `renderer.info.memory` po načtení, po 10 hodech, po `__r3d.lose()` + `restore()` a po přepnutí všech čtvrtí. Čísla geometrií a textur se musí vrátit na stejnou hodnotu.

**Spouštěč instalace.** Zásek prvního hodu, podezření na únik paměti (rostoucí `geometries`/`textures`), nebo potřeba trace, kde přesně padá čas (kompilace shaderů, GC). Spustit s `--isolated`, `--no-usage-statistics`, `--no-performance-crux` a pevnou verzí `chrome-devtools-mcp@<verze>`. Měřit v Chrome, ne v Brave.

## 3. `anthropics/skills`

Repo má 19 skills. Relevantní:
- **`webapp-testing`** (Python + Playwright): rozhodovací strom statická stránka / server neběží / server běží, „průzkum, pak akce“ (snímek a DOM, teprve potom selektory), čekat na ustálení stránky, pomocné skripty spouštět jako černou skříňku přes `--help`, sbírat konzoli. **Převzít:** princip průzkumu před akcí a sběr konzole po celou dobu běhu. **Nepřevzít:** Python a Playwright jako závislost.
- **`theme-factory`**: 10 hotových témat (paleta hex + písmo nadpisů a textu), téma se použije **až po výslovném potvrzení** uživatele, vlastní téma se nejdřív ukáže ke schválení, kontrola kontrastu. **Převzít:** formát a pravidlo „ukázat, nechat vybrat, pak aplikovat“, hodí se k volbě vizuálního stylu nebo palety čtvrti. Témata sama nesedí k neonovému komiksu.
- **`brand-guidelines`**: brand jako pevná paleta (hlavní + akcenty), dvě písma s náhradami, pravidla podle velikosti a pořadí akcentů. **Převzít:** vytvořit podobný krátký **`research/design/brand.md`** (paleta čtvrtí z `palette.js`, písma, kdy jaký akcent, tón textů).
- **`canvas-design`**: nejdřív krátká „filozofie“ vizuálního hnutí, pak jedna stránka; text minimální, nic se nesmí překrývat ani ořezávat; poslední průchod **jen zjemňuje, nic nepřidává**. **Převzít** to poslední pravidlo do review mockupů. Vhodné pro key art nebo plakát, ne pro UI.
- **`algorithmic-art`**: seedovaná náhodnost, málo parametrů, UI s posuvníky a „další seed“. Pro nás myšlenka **náhledu se seedem a posuvníky** pro generátor města (`cityChunk`) nebo vítr, jako rozšíření `background-preview.html`.
- **`frontend-design`** už máme.

**Spouštěč instalace.** `theme-factory` a `brand-guidelines` nikdy (vlastní brand.md stačí). `canvas-design` jen pokud budeme chtít statický key art.

## 4. `CloudAI-X/threejs-skills`

**Obsah.** Deset referenčních skills: fundamentals, geometry, materials, lighting, textures, animation, loaders, shaders, postprocessing, interaction. MIT.

**Verze.** README říká, že obsah byl ověřen proti dokumentaci **r160 a novější**; v souborech verze napevno není. Používají `outputColorSpace` (r152+), většinou cesty `three/examples/jsm/...`, v post-processingu `three/addons/...`. Našemu r170 to zhruba odpovídá, ale: shadery používají GLSL 1 (`texture2D`, `gl_FragColor`), WebGPU ukázky vypadají nespolehlivě, výběr „mobil“ podle user agenta je křehký, README odkazuje na jiné repo ke klonování (nesoulad, neklonovat). `onBeforeCompile` chybí, toon/posterizace jako post-proces chybí.

**Převzít hned** (checklist do `game-dev.md`, většinu už děláme):
- Opakované objekty přes `InstancedMesh`, statické kusy města slučovat (`mergeGeometries`), materiály sdílet přes cache.
- Pooling místo vytváření a mazání (částice, stopa, pára).
- Správné bounding boxy kvůli frustum cullingu, `LOD` pro vzdálené kusy.
- `dispose` geometrie, materiálu (i pole), textur, render targetů; `renderer.dispose()` jen při úplném zrušení.
- Každý post-proces průchod = celá obrazovka; blur/bloom v nižším rozlišení; `pass.enabled` místo přestavby composeru.
- Toon rampa přes `gradientMap` s `NearestFilter` (máme vlastní `toon.js`, dobré jako kontrola).

**Spouštěč instalace.** Nikdy celé. Až začneme psát nové shadery nebo post-proces (fáze b), zkopírovat `threejs-shaders` a `threejs-postprocessing` jako referenci a opravit na GLSL3/r170.

## 5. `wshobson/agents`, plugin `ui-design`

**Obsah.** Agenti `ui-designer` (komponenty, layout, tokeny, stavy, mobile-first), `accessibility-expert` (WCAG 2.1/2.2, nástroje axe, Lighthouse, čtečky), `design-system-architect` (tokeny ve třech vrstvách primitivní → sémantické → komponentové, theming přes CSS proměnné, dark a high-contrast téma). 9 skills (design-system-patterns, accessibility-compliance, responsive-design, mobile-ios/android, interaction-design, visual-design-foundations…). Příkazy `design-review`, `accessibility-audit`, `create-component`, `design-system-setup`, které ukládají stav do `.ui-design/`.

**Převzít hned.**
- **Stavy každého ovládacího prvku:** výchozí, hover, stisk, focus, zakázaný, chyba; pro každou obrazovku prázdný, načítání a chybový stav (u nás např. Atlas bez objevených míst, ztráta WebGL kontextu).
- **Mřížka mezer** na bázi 4 nebo 8 px, typografie přes `clamp()`.
- **Tokeny ve třech vrstvách** pro spec: primitivní (`--neon-violet-500`), sémantické (`--color-reward`, `--color-danger`), komponentové (`--qte-ring-ok`). Odpovídá našemu požadavku na „tokeny barev a velikostí“ ve specu.
- **Časování animací** (skill interaction-design): mikro zpětná vazba 100–150 ms, malé přechody 200–300 ms, modály 300–500 ms; vstup ease-out, odchod ease-in; animovat jen `transform` a `opacity`; **animace nikdy neblokuje vstup** a dlouhou jde přerušit; reduced motion = trvání ~0.
- **Šablona design review:** závažnost Critical / Major / Minor / Suggestion, u každé položky místo, problém, dopad, doporučení, před/po; sekce „co je dobré a nechat“ a seřazené další kroky.
- **Audit přístupnosti po POUR** se závažností Critical / Serious / Moderate / Minor a odhadem pracnosti (do 1 h / 1–4 h / víc). Kontrast 4,5:1 text, 3:1 velký text a prvky UI. Reflow na 320 px. Kontrola: obsah blikající víc než 3× za sekundu, ovládání bez pohybu a bez tažení, `lang` atribut, žádný kladný `tabindex`, klikací `div` bez role, oznámení stavových zpráv (`aria-live`).

**Nepřevzít.** Ukládání stavu do `.ui-design/` a interaktivní dotazník po otázkách, React/Tailwind/Storybook, VPAT/ACR, čtečky obrazovky jako povinný test (u akční canvas hry neúměrné; HUD a menu ale musí mít popisky).

**Spouštěč instalace.** Žádný. Kdyby UI hry (menu, Atlas, Dílna) narostlo do desítek komponent, zvážit jen skill `accessibility-compliance`.

## 6. `majidmanzarpour/threejs-game-skills`

**Obsah.** Director (rozcestník) + gameplay-systems, aaa-graphics-builder, game-ui-designer, debug-profiler, qa-release a tři generátory assetů přes cizí API (Tripo, Gemini, ElevenLabs). Scaffold je Vite + TypeScript, verze three.js v README není. MIT.

**Director, převzít:**
- „Rozsah podle slov uživatele“: malá oprava HUD zůstane malou opravou, plný průchod jen na výslovné přání. **Ověření škálovat podle změny.**
- Před snímáním **deklarovat**, které dvojice viewport × stav se budou snímat; neúspěšné stavy se z deklarace nesmí vyškrtnout, aby běh prošel.
- U větší práce průběžná poznámka (záměr, rozhodnutí, hotovo, vady, další krok). U nás to dělá `CLAUDE.md` a `research/`, takže jen připomínka.

**game-ui-designer, převzít:**
- Priorita informací v HUD: stav (síla, úhel, QTE) → cíl (vzdálenost, další místo) → okamžitá zpětná vazba → ozdoba.
- Zóny: cíl a postup vlevo nahoře, mince a pauza vpravo nahoře, dotykové ovládání v dolních rozích, bannery nahoře uprostřed; **nikdy víc velkých bannerů najednou přes dráhu letu**.
- Stabilní rozměry: **číslice s pevnou šířkou** (`font-variant-numeric: tabular-nums`), pevné sloty pro ikony, testovat s nejdelšími hodnotami (dolet 4 876 m, velké mince, nejdelší anglický název místa).
- Pointer: ošetřit `pointercancel`, ztrátu capture, `blur` a `visibilitychange`, jinak „zaseknuté“ držení síly. `touch-action` jen na herní ploše.
- Dotykové ovládání musí **opravdu vyvolat herní akci**, nestačí, že vypadá stisknuté. Debug UI jen za parametrem (`?perf=1` už máme).

**debug-profiler, převzít:**
- Triage černého plátna: plátno má nenulovou CSS velikost, drawing buffer odpovídá DPR, kontext vznikl, **běží právě jedna smyčka rAF**, kamera (aspect, near/far) míří správně, žádná CSS vrstva plátno nezakrývá, resize aktualizuje renderer, kameru, composer i CSS.
- Třídy úzkého hrdla: CPU, draw calls, fragment (overdraw, post, vysoké DPR), vertex (trojúhelníky, stíny), paměť, síť.
- Pořadí optimalizací podle přínosu: instancing → sdílené zdroje → pooly → culling → LOD → **strop DPR / adaptivní kvalita** → levnější stíny → méně post průchodů → atlasy → žádné alokace a čtení layoutu ve snímku → explicitní dispose.
- Mobil: po rotaci zachovat plátno a HUD, odemknutí zvuku gestem, desktopový vstup funguje i po přidání dotyku.

**qa-release, převzít:**
- **Snímat aktivní hru**, ne titulní nebo nečinnou obrazovku; screenshot sám neověřuje herní změnu.
- **Inspektor plátna** (jejich skript je Node + Playwright + pngjs): ořízne snímek na plátno, kontroluje „není prázdné“ (dost neprůhledných pixelů a rozptyl barev), počítá metriky (počet barevných košů, hustota hran, jas a kontrast) a porovná `renderer.info` s **výchozími rozpočty: desktop 300 calls / 750 tis. trojúhelníků / 300 geometrií / 60 textur, mobil 150 / 300 tis. / 200 / 40**. Upozorňuje, že bez GPU (SwiftShader) jsou FPS neplatné. Naše cíle d1 (≤ 120 calls) jsou přísnější, dobře.
- **Bot playtest se dvěma rychlostmi reakce** (0 ms a 300 ms) a metrikami: snímky běží, vstup hýbe, cíl se plní, žádná okna softlocku, prohra se dá zopakovat, konzole čistá. U nás obdoba: `tests/helpers/auto-input.js` + `simulate` s profily hráčů.
- Časté chyby releasu: testován dev server místo buildu, chybná base path na statickém hostingu, viditelné debug UI, staré reporty vydávané za nové.

**Nepřevzít.** Vite/TS scaffold, generátory assetů s API klíči, vizuální „scorecard“ s prahy 2,3 (subjektivní), Python validátor evidence.

**Spouštěč.** Instalovat ne. Až budeme chtít automatickou kontrolu „plátno není černé“ na všech viewportech, napsat vlastní malý skript nad claude-in-chrome nebo budoucím Playwright MCP (čtení pixelů přes `__r3d.snapshot`).

## 7. `Donchitos/Claude-Code-Game-Studios`

**Obsah.** Šablona „herního studia“: 49 agentů ve třech úrovních (ředitelé, vedoucí, specialisté + enginy Godot/Unity/Unreal), 74 skills jako příkazy, 13 pravidel podle cest, 39 šablon dokumentů, `project.yaml` jako zdroj pravdy. MIT.

**Hooky a skripty (jen popis, nespouštěno).** 14 bash skriptů v `.claude/hooks/`: kontrola commitu a pushe (varování při pushi do chráněné větve), kontrola názvů assetů a datových souborů, připomínka testů po úpravě skillu, životní cyklus relace (start, stop, před a po /compact), logování agentů, toast na Windows. `detect-gaps.sh` při startu relace jen čte projekt a radí: chybí design dokumenty k velkému množství kódu, prototypy bez README, architektura bez rozhodnutí, systém s 5+ soubory bez design dokumentu. Nikdy nic nemění a nikdy neblokuje. Pro nás je zajímavá jen myšlenka „při startu upozornit na mezeru“ (máme `kontext-hlidac`).

**`balance-check`, převzít** (vedle našeho Monte Carla v `simulation/progression/`):
- Na začátku vypsat vstupy jako **FOUND / ABSENT**. Co chybí, je **„NOT ASSESSED – NO DATA“**, nikdy odhad. Hodnota bez cílového rozsahu se **nehodnotí**, jen se zapíše „bez cíle“.
- Kontroly ekonomiky: přítoky a odtoky mincí, akumulace v čase, nekonečné smyčky, položky, které se nikdy nevyplatí koupit. Progrese: mrtvé zóny, skoky síly, brány proti očekávané síle, strategie, které přeskočí nebo rozbijí tempo (u nás „Paper napřed“ zaseknutá na Kraftu).
- **Verdikty v pořadí, první shoda vyhrává:** CRITICAL (degenerovaná strategie, nedohratelná progrese, smyčka bez odtoku) → CONCERNS (odchylky laditelné čísly) → NOT ASSESSED → HEALTHY.
- Report: zdroje dat, souhrn, tabulka odchylek (položka, cíl, skutečnost, problém), degenerované strategie, progrese, doporučení s prioritou a dopadem.
- Cyklus: opravit nejvyšší prioritu, **znovu pustit kontroly**, hledat nově vzniklé odchylky.

**`playtest-report`, převzít** šablonu (viz návrh níže): informace o sezení (datum, build, délka, hráč, zařízení, vstup), zaměření testu, **první dojem v prvních 5 minutách** (pochopil cíl a ovládání?), co fungovalo, třecí body se závažností H/M/L, zmatení, momenty radosti, **chyby zvlášť** (pád, propad fps, softlock nepatří do třecích bodů), zpětná vazba k funkcím, čísla (hody, čas na místo, objevené a přehlédnuté funkce), celkové hodnocení (chuť hrát znovu, obtížnost, tempo), **top 3 priority**. Nálezy rozdělit: design → rozhodnutí, balanc → balance-check, chyby → oprava s testem, polish → backlog.

**`perf-profile`, převzít:** rozpočty patří do jednoho souboru; metrika bez rozpočtu je NOT ASSESSED, ne „prošlo“; každé doporučení má odhad přínosu a riziko; statická analýza najde kandidáty, potvrdí je až měření na cílovém zařízení. Report: tabulka rozpočet / skutečnost / OK–OVER, top 5 úzkých hrdel, regrese od minula.

**Game-design agenti, převzít:**
- `game-designer`: postup otázky → 2–4 možnosti s klady a zápory a doporučením → koncept po sekcích → souhlas. Každá mechanika patří do smyčky (30 s hod, 5–15 min čtvrť, celá hra). Ke každé mechanice okrajové případy a degenerované strategie (zdravé mistrovství vs. zneužití). Ladicí knoflíky typu **pocit / křivka / brána**, nikdy napevno v kódu (u nás `params.mjs` a `config.js`).
- `systems-designer`: každý vzorec má název, **tabulku proměnných s rozsahy**, rozsah výstupu (ořezaný, omezený, neomezený, co dá minimum a maximum, nesmyslné hodnoty jako dělení nulou), a příklad s čísly. Zpětné vazby označit jako záměrné nebo k utlumení.
- `economy-designer`: pro každou měnu přítok, kapacita odtoku (i vyčerpatelné, např. konečný katalog Dílny) a projekce přebytku. Otevřená otázka odtoku = návrh není vyvážený.
- `accessibility-specialist`: **každé QTE má mít možnost přeskočit nebo automaticky splnit**, nastavitelná doba držení, volitelně zpomalení hry; nespoléhat jen na barvu (tvar, ikona, text); text aspoň 18 px při 1080p; žádné povinné současné stisky; pauza kdykoli. Neověřené = NOT ASSESSED, ne prošlo.
- `ux-designer`: krátká cesta od spuštění ke hře a **od neúspěchu k dalšímu pokusu**; každá akce má zpětnou vazbu vizuálně i zvukem; postupné odhalování.

**Nepřevzít.** Celou hierarchii agentů, sprinty, `project.yaml`, hooky na commity (máme vlastní pravidla), engine specialisty, live-ops a community manager (hra má přirozený konec, žádné live-ops, KB P13).

**Spouštěč instalace.** Žádný. Šablony brát jednotlivě.

## Návrhy úprav našich agentů (soubory jsem neměnil)

### `product-designer.md`
- Do „Zásady návrhu“: **stavy každého prvku** (výchozí, hover, stisk, focus, zakázaný) a pro každou obrazovku prázdný a chybový stav (Atlas bez míst, Dílna bez peněz, ztráta WebGL).
- Do zásad HUD: priorita informací stav → cíl → zpětná vazba → ozdoba; zóny obrazovky; **max. jeden velký banner přes dráhu letu**; číslice s pevnou šířkou; navrhovat s nejdelšími hodnotami (anglické názvy míst, dolet 4 876 m).
- Do přístupnosti: kontrast 4,5:1 text a **3:1 prvky UI** (kruh QTE, mířidla), **informace nikdy jen barvou** (úspěch/neúspěch QTE i tvarem nebo ikonou), reflow na 320 px, bez blikání víc než 3× za sekundu, **možnost usnadnit QTE** (širší okno nebo auto-splnění) jako nastavení bez trestu, pauza kdykoli.
- Do pohybu: časová škála animací UI (100–150 / 200–300 / 300–500 ms), vstup ease-out, odchod ease-in; animace neblokuje vstup a jde přerušit.
- Do výstupů: **tokeny ve třech vrstvách** (primitivní, sémantické, komponentové) a odkaz na `research/design/brand.md` (založit: paleta čtvrtí, písma, tón textů).
- Do výstupů: **design review v jednotné šabloně** (Critical/Major/Minor/Suggestion, místo, problém, dopad, doporučení, co nechat).
- Do postupu: u otevřených rozhodnutí 2–4 možnosti s doporučením; **vizuální volby (paleta, styl) ukázat a aplikovat až po potvrzení**; poslední průchod mockupu jen zjemňuje.
- Do postupu: ke každé nové mechanice v UI zapsat okrajové případy a možné zneužití.

### `game-dev.md`
- Do „Ověření“: **matice viewport × stav** (360, 390, 768, 1280, 1920 × Dílna, míření, let, QTE, výsledek), snímat aktivní hru, ne nečinný stav; předem napsat, co se bude snímat, a neúspěšné stavy nevyškrtávat.
- Do „Ověření“: test s **prázdným savem** i s **pozdním savem**; konzole bez chyb po celou dobu běhu, ne jen po načtení.
- Do „Ověření“: platí pravidlo **NOT ASSESSED** – co nebylo ověřeno (viditelné okno, iPhone, iGPU), napsat výslovně, nikdy „mělo by fungovat“.
- Nová sekce „Měření výkonu“: pevný scénář (seed, místo, rozlišení, DPR, post), `document.hidden === false`, baseline `__r3d.bench` + `renderer.info`, jedna změna, tabulka před/po do `reports/3d/perf.md`; třída úzkého hrdla (CPU / draw / fragment / vertex / paměť).
- Do „Výkon“: kontrolní seznam three.js (instancing, sdílené materiály, merge statických kusů, pooly, bounding boxy, dispose včetně render targetů, žádné alokace a čtení layoutu ve snímku, **strop DPR nebo adaptivní kvalita**); **test úniku** po `lose/restore` a po 10 hodech (`renderer.info.memory` se musí vrátit).
- Do „Přístupnost“ a vstupu: ošetřit `pointercancel`, `lostpointercapture`, `blur`, `visibilitychange` (žádné zaseknuté držení síly); `touch-action` jen na herní ploše; dotyk musí vyvolat herní akci, ne jen vzhled.
- Do triage chyb: kontrolní seznam černého plátna (velikost, drawing buffer × DPR, jediná smyčka rAF, kamera, překrytí CSS, resize všeho).

## Nápady na vlastní agenty a skills

1. **Skill `balance-check`** (lehký, bez instalace): spustí jen `simulation/progression/run.mjs` (ne reporty v `simulation/`), načte cíle z `params.mjs` a `10-ladeni.md`, vypíše vstupy FOUND/ABSENT, tabulku cíl / skutečnost, degenerované strategie (např. „Paper napřed“), verdikt CRITICAL / CONCERNS / NOT ASSESSED / HEALTHY a nejvýš 3 doporučení s dopadem. Po úpravě čísel opakovat a hlídat nové odchylky. Hodí se k přeladění F5.
2. **Agent `balance-analyst`** (jen pokud skill nestačí): čte a ladí jen `simulation/progression/params.mjs`, dokumentuje vzorce podle šablony systems-designeru (proměnné, rozsahy, okraje, příklad), hlídá přítoky a odtoky mincí. Nesmí měnit `src/`.
3. **Šablona `research/playtest/sablona.md` + skill `playtest`**: režim „prázdná šablona“ a režim „rozebrat poznámky“ (uživatel nadiktuje, co viděl u hráče, skill vyplní šablonu a rozdělí nálezy na design / balanc / chyby / polish). Důležité pole: první dojem v 5 minutách, čas od neúspěchu k dalšímu hodu, top 3 priority.
4. **Skill `perf-check`**: postup měření z bodu 2 nad claude-in-chrome (`javascript_tool` volá `__r3d.bench` a `stats()`), zapíše tabulku do `reports/3d/perf.md`, rozpočty vezme z jednoho místa (navrhuji tabulku v `reports/3d/perf.md`: P95 ≤ 16,7 ms, CPU ≤ 6 ms, ≤ 120 draw calls, a doplnit trojúhelníky, geometrie, textury), metriky bez rozpočtu označí NOT ASSESSED.
5. **Skill `a11y-audit`**: checklist POUR + herní body (QTE usnadnění, barva + tvar, reduced motion, pauza, dotykové cíle 44 px), závažnost Critical/Serious/Moderate/Minor a pracnost. Použitelný pro product-designera i game-deva.
6. **Malý pomocný test „plátno není černé“** (vlastní, bez závislostí): přes `__r3d.snapshot` přečíst pixely a kontrolovat počet barev a kontrast pro každé místo trasy. Inspirace inspektorem z `threejs-qa-release`, ale bez Playwrightu.
