# Odhad: předělání codebase novým týmem (15. 10. 2026)

Jen čtení a měření, nic nebylo změněno. Odhady jsou hrubé (rozpětí), "člověkoden" = zkušený JS/three.js vývojář, který projekt nezná. Co nebylo změřeno, je označeno NOT ASSESSED.

## 1. Rozsah (změřeno)

| Oblast | Soubory JS | Řádky | Znaky |
|---|---|---|---|
| `src/*.js` (logika + 2D + UI + audio) | 31 | 1 807 | 150 k |
| `src/render3d/*.js` (včetně `districts/`) | ~26 | ~2 030 | ~208 k |
| `src/render3d/models/` | ~13 | 1 345 | 123 k |
| `src/music/` + locales | 9 + 2 | ~900 | ~25 k locales |
| `tests/` | 44 | 3 785 | 343 k |
| `simulation/` (bez `out/`) | ~15 | 1 453 | 145 k |
| HTML + `style.css` | 9 + 1 | 1 606 | 151 k |

- Celkem JS: ~11 000 řádků, ~1,03 MB. Průměr ~95 znaků na řádek, 156 řádků v `src/` má přes 200 znaků, nejdelší má 800 (`src/ui.js:56`). Je to zhruba 25 000 "normálních" řádků po zformátování.
- Největší: `tests/render3d-models.test.js` (435 ř.), `simulation/progression/run.mjs` (345), `render3d/paper.js` (212), `ui.js` (178 ř., ale 19,7 k znaků), `atlas.js` (182), `route-render.js` (155).
- Testy: `npm test` = 321 testů, všechny prošly, 37 s. Testy mají víc kódu než hra (343 k vs. ~480 k znaků `src/`), což je silná stránka.
- Velikost je malá. Projekt je spíš "hustý" než "velký".

## 2. Kvalita (konkrétně)

**Silné stránky**
- Logika je opravdu čistá: grep na `document.`/`window.` v `core, config, throw, events, scenes, storage` nenašel nic. Simulace i testy importují `src/` přímo. Deterministická fyzika (`DT=1/60`, seed) je přesně to, co se při přepisu nejhůř reprodukuje, a zde je to hotové a otestované.
- Žádné npm závislosti ani build, tedy žádný dependency rot. 44 testovacích souborů, `render3d-purity.test.js` hlídá oddělení.
- Dokumentace (CLAUDE.md, `docs/`, `.claude/rules/`, `runs/`) je nadstandardní, nový tým se zorientuje rychle.

**Slabiny**
- **Čitelnost:** one-linery, 156 řádků >200 znaků. `src/ui.js:50-58` skládá celé DOM stromy v jednom řádku (`createElement` řetězce, magická čísla `100`, `250`, `500` přímo v `ui.js:50`). Bez formátovače a lintu se to dá číst jen s úsilím.
- **`src/ui.js`:** modul s top-level mutabilním stavem (`ui.js:16-21`, `66`, `107`, `144`: `mode`, `render`, `fx`, `prev`, `landedAt`, `inputOwner`, `milestoneQueue`, `banner`, `angle`, `held`, `outcome`, `zoneKind`...), načítá renderer přes top-level `await import` (`ui.js:17`), míchá vstup, HUD, Dílnu, výsledek, události a smyčku. Žádný automat obrazovek, stav je v rozptýlených proměnných. Test na něj prakticky není (DOM); testuje se okolí.
- **Duplikace:**
  - 2D `render.js` + `themes.js` + `themes-verse.js` + `backgrounds.js` + `route-render.js` + `fx-render.js` vs. `render3d/` (stejné rozhraní `render/view`). Cíl: smazat ve fázi f (`docs/stav.md`). Odhad podílu ~600-800 řádků a řada testů (`themes.test.js`, `verse.test.js`, `u0-styl.test.js`) NOT ASSESSED přesně.
  - `src/atlas-numbers.js` je výslovně PROVISIONAL kopie `simulation/progression/params.mjs` (`atlas-numbers.js:1-2`) s ručně udržovaným pořadím ID, bez testu parity (ten je slíbený "krok C1"). Riziko tichého rozchodu simulace a hry.
  - Časování QTE a magická čísla jsou duplikovaná v `simulate` (`docs/stav.md`, "Kód").
  - Starý `simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs` (nesmí se spouštět) a zastaralý `REPORT.md` jsou de facto mrtvá větev.
- **Mrtvý kód a artefakty:** `bonus.html` prázdná, mrtvé `*-far.svg`/`*-near.svg`, staré zelené téma v `style.css`, `background-preview.html`, 5 prototypových HTML (`prototype-dilna.html` 778 ř. / 74 k s inline kódem), `prototype/`, `archiv/`, `research_notes/`. Prototypy duplikují logiku (NOT ASSESSED jak moc).
- **Globální stav:** viz `ui.js`; v renderu3d moduly drží stav v modulových proměnných (NOT ASSESSED detailně).
- **Nástroje:** žádný formátovač, linter, typy/JSDoc, CI (`.github` neexistuje), `package.json` má 3 skripty. Žádný bundling (záměrně), takže produkční build/minifikace také chybí.
- **Křehkost testů:** velké render3d testy (`render3d-models.test.js` 435 ř., `paper-hero`, `paper-scene`) pravděpodobně kontrolují konkrétní počty trojúhelníků/barvy a při změně stylu se budou lámat (NOT ASSESSED, nečteno). Soubory `progression-*` testují simulátor, ne hru.
- **i18n:** 25 k znaků slovníků, pokrytí funguje, v UI vrstvě zůstávají anglické texty (`docs/stav.md`).

## 3. Odhady pracnosti

Předpoklady: rozsah výše, žádné změny obsahu během práce (to je nerealistické, viz doporučení), stejný repozitář a testy jako síť.

| Scénář | Člověkodny (zkušený vývojář) | S AI agenty jako dnes | Pozn. |
|---|---|---|---|
| **A Úklid** | **12-20** (Prettier+lint 1, smazání 2D a mrtvého 3-5, rozdělení `ui.js` 3-5, sjednocení čísel + test parity 2-3, JSDoc/`checkJs` v logice 3-5) | **~3-6 dní kalendářně** (~1-3 dny práce agentů + revize) | Formátování celé báze je jeden velký diff, dělat ho jako samostatný commit |
| **B Refaktor architektury** | **A + 25-40 = 40-60** (vrstvy stav/pravidla/prezentace/renderer 10-15, automat obrazovek a nový vstupní tok 6-10, sjednocení configu 4-6, nové testy 6-10, ladění regresí 5-10) | **~10-20 dní kalendářně** | Hlavní náklad je ověřování v prohlížeči (agenti ho dělají špatně a pomalu, `smoke-test`) |
| **C Přepis od nuly (TS + Vite)** | **90-150** (logika+testy portovat 15-25, 3D renderer a ~13 modelů 30-50, UI/Dílna/Atlas 20-30, audio+hudba 10-15, simulátor 8-12, ladění vizuální shody a game feelu 15-25) | **~25-45 dní kalendářně** | Rozpětí vysoké, protože "stejný vzhled a pocit" je nejhůř měřitelné |

Všechna čísla jsou odhad z rozsahu a zkušenosti, ne měření (NOT ASSESSED jako empirie).

### Rizika, ztráty, zisky, vyplatí se

**A Úklid**
- Rizika: nízká. Regrese ve fyzice nehrozí (logiku se jen formátuje), 321 testů je síť. Smazání 2D: pozor na `?render=2d` jako jedinou zálohu při ztrátě WebGL kontextu (CLAUDE.md, `ui.js:16-17`); bez ní je fallback jen chybová hláška.
- Ztratí se: 2D záloha, komiksový prototyp `verse`, "hustý" styl (rozhodnutí uživatele "dokud se nerozhodne o formátování" se tím uzavírá).
- Získá se: čitelnost, diff-friendly historie, ochrana před rozchodem simulace a hry, méně kódu pro agenty (menší kontext = levnější a přesnější).
- Vyplatí se: **ano, většina i teď.** Smazání 2D je už naplánované (fáze f). Rozdělení `ui.js` je lepší dělat, dokud mechaniky nejsou ustálené, jen pokud se UI zrovna nepřepisuje (menu U0, Atlas).

**B Refaktor architektury**
- Rizika: střední. Pohyb stavu mezi vrstvami ohrožuje determinismus (pořadí RNG, seed letu `attempts+1`, tutoriálové události jen pro seed 1) a save (`storage.js` migrace); vizuální shoda 3D se testuje špatně automaticky. Konflikt s paralelní prací na obsahu (jeden soubor = jeden vlastník, `orchestrace.md`) by blokoval ostatní.
- Ztratí se: 2-4 týdny rychlosti obsahu a mechanik.
- Získá se: testovatelné herní toky (dnes jsou v `ui.js` netestované), snadnější přidávání obrazovek (Atlas, Dílna, menu), jedna konfigurace.
- Vyplatí se: **teď ne.** Obsah a mechaniky se mění (Atlas "zatím není ve hře", progrese, 16 míst, katalog modelů G4-G7, chuť hrát dál). Vrstvy navržené teď by se po ustálení přepisovaly. Dělat po ustálení herní smyčky, ideálně jako součást úklidu `ui.js`.

**C Přepis od nuly**
- Rizika: vysoká. Přepsat deterministickou fyziku a RNG tak, aby seedy dávaly stejné lety, chce golden testy proti staré verzi; vizuální shoda toon/ink stylu, kamery-režiséra a game feelu se ověřuje jen okem; migrace savů. Aktuální směr (Papírové město, S1-S4, mnoho rozhodnutí v `research/bonusy/06-rozhodnuti.md`) je stále v pohybu, takže cíl se hýbe.
- Ztratí se: odladěný game feel, tichá znalost v kódu (hitstop, QTE časování), 321 testů nutno přepsat či portovat, 2-3 měsíce bez nového obsahu.
- Získá se: TypeScript, bundling/minifikace (rychlejší načtení), čistá struktura. Většinu z toho dá levněji A (+ `checkJs`).
- Vyplatí se: **ne.** Stávající kód je malý (~25 k formátovaných řádků), logika je čistá a přenositelná, takže hlavní slabiny (formátování, `ui.js`, duplikace) řeší A/B za zlomek ceny. Přepis dává smysl jen při změně platformy (např. nativní port, jiný engine), ne kvůli kvalitě.

## 4. Doporučení

1. **Teď, levně (1-3 dny):** zavést Prettier (s vysokým `printWidth` nebo rovnou standardním) + ESLint (`no-unused-vars`, `no-undef`) jako samostatný commit, plus GitHub Actions s `npm test`. Pozor: formátování zruší hustý styl, to je rozhodnutí uživatele (CLAUDE.md).
2. **Teď:** test parity `atlas-numbers.js` vs. `params.mjs` (slíbený krok C1). Je to nejlevnější ochrana proti tiché chybě balancu.
3. **Teď / brzy:** vynést magická čísla (`100`, `250`, `500`, odemčení glideru) z `ui.js` do `config.js`.
4. **Po ustálení obsahu:** smazat 2D (`render.js`, `themes*.js`, `backgrounds.js`, `route-render.js`, `fx-render.js`) a jejich testy, mrtvé SVG, `bonus.html`, staré téma, zastaralé `simulation/run.mjs` a spol.; přesunout prototypy a `archiv/` mimo hlavní strom (fáze f a g).
5. **Po ustálení:** rozdělit `ui.js` na `screens/` (vstup, HUD, Dílna, výsledek) s malým automatem obrazovek a stavovým objektem místo top-level proměnných; JSDoc + `// @ts-check` v čisté logice (`core, throw, events, scenes, storage`) bez TypeScriptu.
6. **Průběžně:** nové moduly psát rovnou formátované a s JSDoc; testy na chování, ne na přesné počty trojúhelníků (omezí křehkost render3d testů, NOT ASSESSED rozsah).
7. **Nedělat:** přepis od nuly, TypeScript+Vite migraci celé báze, velkou vrstvenou architekturu před ustálením mechanik, spouštění starých simulátorů (přepisují reporty).
8. **Případně později:** golden test determinismu (seed -> výsledek letu) jako pojistka před jakýmkoli větším zásahem, aby šla regrese fyziky poznat okamžitě.
