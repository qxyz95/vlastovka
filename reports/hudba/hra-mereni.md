# Měření hudby a efektů ve hře (krok 4 hudby)

**15. 10. 2026, game-dev.** Větev `worktree-agent-af4cc4b91e40e27ef`, commity `bd406e3` až `cb4ef30`. Diorama (G) a efekty z `src/sfx.js` jdou do hry přes `src/game-audio.js` (jedno volání `gameAudio.frame()` ve smyčce snímků `ui.js`).

## Prostředí a omezení
- **Claude in Chrome nebylo dostupné** (`list_connected_browsers` vrátil prázdný seznam). Měřilo se v **headless Chromiu 151** (Playwright `chromium-1234`, `--headless=new`, ANGLE D3D11) přes CDP na uživatelově notebooku (Windows 11), server worktree `PORT=4187 node server.mjs`. Skripty: scratchpad sezení (`cdp.mjs`, `measure.mjs`, `long.mjs`, `first.mjs`, `rec.mjs`, `align.mjs`, `matrix.mjs`, `hide.mjs`), nejsou v repu.
- `document.hidden === false` ve všech bězích, ale **nejde o viditelné okno na obrazovce**. Headless rAF běží bez vsync (~137 snímků/s, průměr 7,2–7,6 ms), takže ms/snímek nejsou srovnatelné s 60Hz displejem. **Čísla jsou informativní, splnění rozpočtů ve viditelném okně je NOT ASSESSED.**
- Zvuk nešel do skutečného výstupního zařízení: `baseLatency` 10 ms, `outputLatency` 40 ms nebo 208 ms (mění se mezi spuštěními headless). Poslech (cvaknutí, hlasitost na sluchátkách) je NOT ASSESSED.
- Gesto: skutečné klepnutí přes CDP `Input.dispatchMouseEvent` (bez přepínače autoplay). Kontext vznikl až po klepnutí a hned běžel (`running`).
- Scénář: 1280 × 720 CSS px, DPR 1, post-proces zapnutý, prázdný save (nový profil prohlížeče při každém běhu), první hod seed 1 (tutoriál), bot tiskne mezerník podle `__audio.state.centres` (perfekty) nebo s pevným zpožděním.

## Čas snímku se zvukem a bez zvuku
Bez zvuku = `just-throw-it-audio` `{muted: true}`, takže AudioContext vůbec nevznikne. Se zvukem = výchozí 60 / 80 %. Bot, 4 hody, 42,6 s, stejný scénář (`measure.mjs`, běh 2).

| Metrika (headless, bez vsync) | Bez zvuku | Se zvukem |
|---|---|---|
| snímků | 5 637 | 5 701 |
| interval rAF průměr / P95 / P99 | 7,55 / 13,8 / 20,8 ms | 7,46 / 13,8 / 20,8 ms |
| nejdelší snímek | 48,7 ms | 69,3 ms |
| snímků > 33,4 ms | 7 | 4 |
| long tasks | 0 | 1 (50 ms při vstupu na výsledek) |
| `__r3d.bench(240)` 3× avg (ms) | 8,37 / 7,01 / 7,13 | 7,22 / 6,72 / 7,83 |
| `bench` P95 (ms) | 17,4 / 17,0 / 16,7 | 16,5 / 16,4 / 16,8 |
| `bench` CPU avg (ms) | 1,79 / 1,55 / 1,47 | 1,53 / 1,49 / 1,63 |
| draw calls / trojúhelníky | 45 / 36 345 | 45 / 36 345 |
| `renderer.info.memory` (geometrie / textury) | 37 / 6 | 37 / 6 |

- První běh téhož skriptu dal se zvukem `bench` avg 12,3 / 10,5 / 10,3 ms proti 8,6 / 8,0 / 7,5 bez zvuku; druhý běh rozdíl neukázal (viz tabulka). Headless GPU čas kolísá víc než rozdíl, **vliv zvuku na GPU čas proto z těchto dat nejde určit** (NOT ASSESSED ve viditelném okně).
- Snímky 40–70 ms při vstupu na výsledek jsou i bez zvuku (41 a 49 ms ve stejné chvíli), tedy práce karty výsledku (`settle`, `persist`, Atlas), ne zvuk.
- **Cena zvuku na hlavním vlákně** (obal kolem `__audio.frame`, 4 hody, `cost.mjs`): let průměr 0,05 ms, P95 0,1 ms, max 1,3 ms na snímek; Domov 0,05 ms, výsledek 0,03 ms.
- **Zásek prvního hodu** (prázdný save, 4 běhy střídavě): se zvukem long task 102 a 103 ms a nejdelší snímek 153 a 97 ms, bez zvuku 100 a 118 ms a 146 a 118 ms. Uvnitř `gameAudio.frame` žádné volání > 3 ms. Zásek je známý zásek 3D (`docs/stav.md`), zvuk ho nezpůsobuje.

## Zátěž zvuku (`audio.stats()`, `playbackStats`)
Bot, 36 hodů, 6 min 38 s se zvukem (`long.mjs`):

| Měřítko | Cíl (03 F.5) | Naměřeno (headless) | Verdikt |
|---|---|---|---|
| `underruns` přírůstek | 0 | 0 | headless splněno; viditelné okno NOT ASSESSED |
| `underrunMs` | 0 | 0 | headless splněno; viditelné okno NOT ASSESSED |
| pomalé průchody plánovače > 5 ms (`spikes`) | žádný | 0 záznamů za celý běh | headless splněno |
| `schedMax` (posledních 5 s) | < 5 ms | 0,3 ms (v kratších bězích 2,6–4,3 ms) | headless splněno |
| špička hlasů `peak` | ≤ 48 | 23 | splněno |
| cache KS | ≤ 8 MB | 0 B (ve čtvrti 1 se KS nepředehřívá) | splněno pro čtvrť 1, čtvrti 2–4 ve hře NOT ASSESSED |
| redukce limiteru | ≤ 2 dB | ~0 dB v okamžiku čtení | jen bodové čtení |
| zahozené noty v maskách ticha (`dropped`) | – | 36 | – |
| konzole | bez chyb | bez chyb (jen 404 `favicon.ico`) | splněno |

## Ztráta a obnova WebGL (`__r3d.lose()` / `restore()`)
Se zvukem, Domov po 4 hodech, 8 s ztráty a 8 s po obnově:
- Hudba hrála dál: během ztráty 3 nové takty, po obnově další 3, `ctx.state` po celou dobu `running`, žádná výjimka. `__r3d.lost` po obnově `false`.
- Konzole: `THREE.WebGLRenderer: Context Lost/Restored` a 188 varování `WebGL: INVALID_OPERATION: delete…: object does not belong to this context` z `three.module.min.js`. **Stejná varování (150) jsou i bez zvuku** (`lose.mjs`, ztlumeno, kontext nevznikl), patří rendereru, ne zvuku.
- `renderer.info.memory` po obnově 31 / 5 proti 37 / 6 před ztrátou (bez zvuku 28 / 5 proti 29 / 6). Počty se nevracejí na stejnou hodnotu; jde o renderer (mimo zadání), předávám k `perf-check` rendereru.

## Životní cyklus (v prohlížeči)
- Bez klepnutí: `__audio.engine` je `null`, AudioContext neexistuje, překryv píše „waiting for the first tap“.
- Ztlumeno v nastavení a obnovení stránky: volba přežije (`localStorage['just-throw-it-audio']`), po klepnutí do hry kontext **nevznikne**. Zrušení ztlumení v Nastavení (klik) kontext vytvoří a hraje G.
- Skrytá karta (druhá záložka přes `Target.activateTarget`): `visibilitychange` → `suspended`, master v okamžiku uspání 0,003 (−50 dB); návrat → `running`.
- Ztlumení z klávesnice (Tab na „Ztlumit vše“, mezerník): `suspended`, posuvníky zakázané, výstup „Ztlumeno“. Šipka vpravo na posuvníku Hudba: 60 → 70 %.
- iOS `interrupted`: jen testy na falešném kontextu (`tests/game-audio.test.js`), **na iPhonu NOT ASSESSED**.
- `?render=2d` + emulace `prefers-reduced-motion: reduce`: hod, let a výsledek bez chyb, zvuk běží, dopad má `deep: false` (bez hlubokého dunění).

## Záznam `?audio=rec` a analyzátor
Záznam 91 s (8 hodů, bot podle středů), soubory `.wav` (16bit PCM z AudioWorkletu), `.json` (log) a `.webm` (MediaRecorder) se stáhly po klepnutí na „stop rec & save“. Rozbor `node simulation/hudba/analyze-rec.mjs jti-….wav`:

| Měřítko | Hodnota |
|---|---|
| Posun záznamu proti logu | −15 ms (z 8 tiků) |
| Integrovaná hlasitost celé směsi (míření, let, výsledek, efekty) | −24,1 LUFS |
| Vzorkový vrchol | −2,8 dBFS |
| Cvaknutí (skok > 0,25) | 0 |
| Výpadky (digitální ticho / ztracené bloky / underruns) | 0 / 0 / 0 |
| Tiky v maskách ticha | 8 / 8 (1 zrušený po hitstopu) |
| Maska před tikem proti 1 s před maskou | +0,1 dB (medián) |
| QTE perfekt / úspěch / minutí | 7 / 0 / 1 (perfekty 88 %, bot) |

- **Posun −15 ms ověřen nezávisle:** 5 pípnutí naplánovaných dopředu na přesný čas (`align.mjs`) má ve WAV začátek vždy přesně 15 ms před zalogovaným časem. Analyzátor posun odhaduje z tiků a vše srovná (`--align ms` ho nastaví ručně).
- **Zjištění:** maska ticha zahazuje jen začátky not L1/L2, plocha L0 hraje dál, takže hladina 0,1 s před tikem je stejná jako v sekundě před maskou (už ztenčené varování). Hladinu samotného tiku nad hudbou z tohoto záznamu oddělit nejde (bot trefuje střed, perfekt zazní do 50 ms po tiku); platí offline měření z kroku 3 (+11,3 LU), ve hře NOT ASSESSED.
- **Oprava v kroku 4:** maska ticha se dřív počítala bez výstupní latence, kdežto tik se plánuje o `outputLatency` dřív. Při 208 ms (headless, Bluetooth) by tik padl mimo masku. Teď mají maska i tik stejné mapování (test v `tests/game-audio.test.js`).

## Nastavení zvuku (UI)
Panel Nastavení, sekce Zvuk, šířky 360 / 390 / 768 / 1280 / 1920 × EN / CS, snímky ve scratchpadu sezení (`shots/settings-*.png`), bez vodorovného přetečení panelu:
- posuvník: řádek 67 px (1920: 84 px, UI zoom), vstup 44 px (55 px), „Ztlumit vše“ 44 px (55 px). Cíl 44 px splněn.
- texty: EN „Sound · Music 60% · Sound effects 80% · Mute all“, CS „Zvuk · Hudba 60 % · Zvukové efekty 80 % · Ztlumit vše“ (`pct` podle jazyka). Ztlumeno: posuvníky zakázané, místo procent „Muted“ / „Ztlumeno“ (07-menu §3).
- Art review (bible 05, kap. 8): stopa `--ink` 6 px, jezdec 28 px krémový s tušovým rámem, zaškrtávátko `accent-color: --ink` jako přepínače Pohybu; žádná nová barva ani písmo. Ladicí překryv `?audio=debug` je monospace (bible kap. 8 monospace zakazuje), ale je jen pro vývoj a hráč ho bez parametru nevidí. Žádný nález Critical ani Major. Samostatný report v `reports/art/` nevznikl (mimo povolené soubory).

## NOT ASSESSED
- Viditelné okno na referenčním notebooku (čas snímku na 60Hz displeji, `playbackStats` se skutečným výstupem).
- iPhone 15 Pro (Safari): odemčení, `interrupted`, uspání na pozadí, záznam (`AudioWorklet` + `MediaRecorder` na iOS).
- Poslech: cvaknutí při uspání a probuzení, hlasitost tiku a perfektu proti hudbě na reproduktorech.
- Čtvrti 2–4 a finále ve hře (stinger, znělka na kartě, cue finále): jen testy na falešném kontextu, v prohlížeči jen čtvrť 1.
- Dotyk na skutečném zařízení (posuvníky, Ztlumit vše).
- Matice viewport × stav pro let, QTE a výsledek: snímky jen 1280 × 720 (let, výsledek, 2D výsledek); 360–1920 jen panel Nastavení.

## Jak měření zopakovat ve viditelném okně
1. `npm start`, otevřít `http://127.0.0.1:4173/?perf=1&audio=debug`, klepnout do scény.
2. Hrát 10 min, překryv `?audio=debug` ukazuje underruns, `sched` a spikes živě. V konzoli na konci `__audio.stats()` (hlavně `underruns`, `underrunMs`, `spikes`, `peak`).
3. Totéž s ztlumeným zvukem (Nastavení → Ztlumit vše → obnovit stránku) a porovnat panel `?perf=1` a `__r3d.bench(240)`.
4. Záznam a rozbor: `reports/hudba/zaznam-hrani.md`.
