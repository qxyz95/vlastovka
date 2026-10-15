# Stav projektu

Aktualizuje se po každé větší práci (orchestrátor nebo agent, který práci dokončil). U každého údaje je datum.
Poslední úprava: 15. 10. 2026 večer (orchestrátor před compactem: sezení „pokračuj podle plánu hratelnosti“).

## Právě teď (15. 10. 2026 večer) — JAK NAVÁZAT
**Hotové a sloučené dnes (větev `f3-3d-prototypy`, 396 testů zelených):** U0 jeden styl v UI, R0+H0 render bez cyberu, QS2 práh QTE 8 m (i v tutoriálu), U1 texty EN/CS podle bible kap. 12, H2 postavička C (`models/kid.js`, `kid-rig.js`), H1 úvodní záběr (`render3d/intro.js`, nápis „Throw it“ v nebi), U2 `src/settings.js`, U3 `src/screens.js` (automat obrazovek, obrazovka `chapter`), U4 `src/reveal.js`, T1 `src/result.js` (throwDiff, nextGoal, chapterTrigger, airFocus, throwReasons). Prettier zaveden (`npm run format`), úklid dokumentů (`docs/zdroje.md`, `archiv/`), prototypy 3d/styly/papers v `archiv/`.
**Design dnes:** `research/plan-hratelnost/04-chut-hrat-dal.md` (ředitel, podle KB), `05-karty-mechanik.md` (K1–K9, dávky T1–T9), `06-pejsek.md` (pejsek nálezce, dávka H6). Rozhodnutí v `research/bonusy/06-rozhodnuti.md` (bloky z 15. 10.).
**Běží:** agent **U5 Kostra přes celou obrazovku** (worktree, Opus, soubor průběhu `runs/2026-10-15-u5-kostra.md`).
**Domluvené pořadí do předání uživateli k hraní (uživatel chce odkaz, až bude vše ready):**
1. Po U5: zkontrolovat diff, sloučit, `npm test`, smoke test.
2. Orchestrátor sám: **dev tlačítko „+1000 mincí“** za `?dev=1` (čistý modul s testem, háček v `ui.js`, i18n EN/CS). Jen mince — Atlas a místa si uživatel odemkne doletem (nechce tlačítko na rekord).
3. **QA tester** (Sonnet) podle kontrolního seznamu (menu, míření, hod, QTE, výsledek, Dílna, Atlas, EN/CS, klávesnice, dotyk, reduced motion, 360 px i desktop); kritické chyby opravit game-devem a přetestovat.
4. **Art review** úvodu, postavičky C a nové obrazovky.
5. Spustit `npm start` a dát uživateli odkaz http://127.0.0.1:4173 + seznam známých drobností a na co se zaměřit. (Port 4173 byl uvolněn; `kompas.server` na 8770 nevypínat.)
**Čeká na uživatele (nespěchá, po hraní):** pejsek — roztomilý moment A/B/C, barva A/B/C, přiblížení kamery u krátké verze A/B/C (`06-pejsek.md` BLOCKED, doporučení vždy A).
**Další dávky po hraní:** U6 výzva a vstupy, U7 + T2 karta výsledku (14 i18n klíčů z reportu T1 v `runs/2026-10-15-t1-vysledek.md`), T5 konec kapitoly, T8 log `?playtest=1`, H5 papírový kouř, H6 pejsek, T3/T4 vlajka a páska rekordu, B1 Atlas (texty Atlasu jsou zastaralé cyber — přepsat; bonusy projde game-designer znovu).
**Pravidla práce:** max 2 souběžní agenti, model podle úkolu (Opus návrh a složitá logika, Sonnet dávky se specifikací s přesnými řádky zdrojů), orchestrátor čte diff a sám spouští testy (`.claude/rules/orchestrace.md`).

## Verze a hotové části
**Verze 0.6.1 (13. 10. 2026).** Proběhlo review kódu, obsahu a mechanik. Opravené:
- Úspěšný holub už nezkracuje stoupání (`vy=max(.4,vy)`).
- HUD a `#scene-label` nechytají klepnutí (`pointer-events:none`).
- Mezerník na jiném tlačítku nespustí hod.
- Poškozený save se zálohuje do `just-throw-it-v1-corrupt`, NaN dolet se neuloží.
- Příběhy míst se zobrazují v `#journey-story` (za letu aktuální místo, jinak nejvzdálenější). Štítek scény ukazuje čtvrť a místo.
- **0.6:** arkádový model letu (klouzavost, ideální úhel modelu), sdílený strom vylepšení (save v3 s migrací), odlišné role šipky a kluzáku, širší okna QTE, stisk ve varování se ignoruje, kratší mezery, časovací kruh ve scéně a klepnutí do scény. Viz README „Verze 0.6“.
- **0.6.1:** přehyby posílené (účinek QTE +12 %/úr., odpuštění síly 15 %), po hodu nápověda úhlu (`bestAngle`, `angleHint` v `core.js`), ceny přeladěné Monte Carlem.
- Texty sjednocené: Dílna (ne Hangár), Bonusy (ne Bonus tree), intro odpovídá trase předměstí → doky → jádro. Čísla v českém formátu (`num()` v `ui.js`, nově `num()` v `i18n.js` podle jazyka). Po 500 m ukazuje HUD hranici dalšího místa.

**Styly, animace prostředí a game feel (13. 10. 2026, nad 0.6.1, bez nového čísla verze):** 3 alternativní vizuální styly k porovnání, animace míst a oblohy, juice (otřes, hitstop, částice, popupy). Bez změny mechaniky a balancu.

**Research (13. 10. 2026):** KB designu a psychologie her (`research/kb/`). Shrnutí a doporučení z KB zatím nevznikla. Návrhy bonusů `research/bonusy/01–10`.

**14. 10. 2026:** komiksový 2D prototyp `verse` (jen náhled), 3D prototyp, hudební prototyp (F1+F3), 3D převod fáze 0 a a1–a6 (3D výchozí ve hře).

## Rozpracované práce
### Papírové město, obsah a hratelnost (stav 15. 10. 2026)
- **Ve hře (jediný styl, od U0 a R0 15. 10. 2026 bez přepínače a `?styl=`):** papírové město (P0, P1, P3, P4), kamera startu S1–S3 (šířka podle přebytku rychlosti, vlaštovka roste s oddálením), **místo odhodu S4** (podkrovní dílna v řezu, dítě 1,2 m, ruka 12 m, nižší domy za startem). Cyber větve a palety jsou z kódu pryč; 2D záloha `?render=2d` (`themes.js`, `render.js`) zatím zůstává. Katalog modelů G1, G2, G2b, G3 (`src/render3d/models/`, `prototype-katalog.html`).
- **Simulátor** (`simulation/progression/`): vlaštovky za mince (`--modelset obsah01`), Mailbag, náhled z posledních 5 hodů, detektory kousků v2, cíle `--targets t90`. Výchozí rozbor 90 min: `research/obsah/06-ladeni-90.md` (hra dnes ~42–48 min, obsahu zhruba polovina).
- **Rozhodnutí (06):** 5 vlaštovek za mince, Poštovní brašna, skiny za postup, cíl **~90 min** bez natahování, kousky jen zdravé po ověření; po poznámkách tvůrce 15. 10.: **jediný styl papír, hra přes celou obrazovku, výzva uprostřed, plastická papírová postavička, skoro každý hod novinka, QTE podle rychlosti a role událostí, balance-analyst až po schválení obsahu**.
- **Plán hratelnosti:** uživatel odpověděl na 15 otázek (06, 15. 10.). Souhrn `research/plan-hratelnost/README.md` (návrhy 00 kreativní, 01 game design, 02 UX, 03 art), dávky podle pořadí v README.
- **Mapa dokumentů (15. 10. 2026):** `docs/zdroje.md` říká, který dokument je zadání, podklad nebo překonaný (hlavička `ZASTARALÉ`); mrtvé dokumenty jsou v `archiv/`.
- **Nic neběží.** Dev server `npm start` byl zastaven kvůli paměti, spustit ručně. Necommitnuté screenshoty uživatele v kořeni repa (`Snímek obrazovky 2026-10-14 *.png`) jsou jeho, necommitovat.
- Role a skilly: `.claude/rules/orchestrace.md` (nově creative-director, qa-tester, narrative-writer, audio-designer; skilly smoke-test, predani, novy-model, fun-check).

### Progrese a simulátor (F5)
- Simulátor nového systému `simulation/progression/`, nový systém zatím **není ve hře**.
- Stav 13. 10. 2026 (F3): délka hry průměrný 98–118 hodů / 53–62 min, slabý 115–140, expert 75–84; lety ~28 s. 15–19 z 61 cílů nesplněno.
- 14. 10. 2026: 6 změn z `10-ladeni.md` §5 přijato (`06`, plán `11-plan-implementace.md`) a zapracováno do simulátoru s testy (přepínače zpět v `params.mjs`).
- **Výsledky v `REPORT.md` pro novou verzi neplatí, čeká přeladění F5** (první výstup `out/f5-base-skills.*`). Známý problém: strategie „Paper napřed“ se zasekne na ceně Kraftu.

### Atlas (A1–A3, pak B1 a C1)
Návrh `research/atlas/01-navrh-atlasu.md` §7.
- **A1** (product designer): wireframy, anglické texty, klikací prototyp `prototype-atlas.html` + `prototype/atlas/`. Stav 14. 10. 2026: `prototype/atlas/` existuje, `prototype-atlas.html` zatím ne.
- **A2** (logika): `src/atlas-content.js`, `src/atlas.js`, `src/atlas-text.js`, `src/atlas-numbers.js` (čísla `PROVISIONAL` = kopie `params.mjs` před F5), testy `tests/atlas*.test.js`. Texty dočasné, finální dodá A1.
- **A3** (save): save v4 s `p.atlas`, migrace v3 → v4 (`pastFlights`), test `tests/storage-atlas.test.js`.
- Další: **B1** UI Atlasu (`src/atlas-ui.js`, háčky v `ui.js`, `bonus.html` přesměrování) až s novým modelem letu; **C1** modul čísel ze simulátoru s testem shody, odstranění `PROVISIONAL`.

### Překlad EN/CS
- Rozhodnuto 13. 10. 2026: hra bude anglicky, 14. 10. 2026 rozšířeno o přepínač EN/CS (výchozí EN).
- Stav 14. 10. 2026 (`runs/2026-10-14-i18n.md`): hotové `src/i18n.js`, `src/locales/en.js`, `cs.js`, `config.js` a `scenes.js` přes `t()`. Rozpracované čisté moduly (events, throw, core `angleHint`, juice, atmosphere, render3d). Zbývá `ui.js`, `index.html` (dnes `lang="cs"`, `data-i18n`, přepínač), `bonus.html`, `tests/i18n.test.js`, ověření v prohlížeči.

### 3D převod
Plán `research/3d/01-plan-prevodu.md`. Hotovo 14. 10. 2026: fáze 0, a1–a6 (3D výchozí, `?render=2d` záloha, efekty, kamera-režisér, ztráta kontextu). Zbývá b0/b-* (čtvrti), c1/c2 (nálada a kamera), d1–d3 (výkon, přístupnost, mobil), e (papíry a události), f (smazání 2D), g (úklid prototypů).

### Hudba
Prototyp F1+F3 hotový 14. 10. 2026 (`research/hudba/01-vyzkum-a-plan.md`). Hra zvuk zatím nenačítá.

## Známé problémy 3D (14. 10. 2026, po a6)
- Výkon ve viditelném okně a zásek prvního hodu neověřeny (automatizovaný prohlížeč měl zakryté okno), `__r3d.bench` ~5–6 ms/snímek na RTX 3060. Měření na Radeon iGPU a iPhonu chybí.
- Život jen ve Violet Suburbs (`life3d.js`, FALLBACK(D1)); ostatní čtvrti jsou hrubé z `cityChunk` (fáze b). Název místa z režiséra (`camera.title/alpha`) se zatím nikde nezobrazuje.
- Holub je proti vlaštovce malý a při nesení ho částečně kryje kruh výsledku QTE. Pára má toon odstín podle nálady (ne čistě bílá).
- Texty v UI vrstvě (mířidla, štítky) jsou anglicky, zbytek UI česky (řeší překlad EN/CS).

## Známé problémy (z review 13. 10. 2026)
**Mechaniky / balanc**
- Ekonomika 0.6.1: ceny `[35,105,195,300,420]`, odměna 10 + dolet/10. Podle `simulation/MONTE-CARLO.md` (sekce Aktualizace 0.6.1, `node simulation/monte-carlo.mjs`, ~2 min, nespouštět, přepisuje report) průměrný hráč 23 hodů / ~12 min, slabý 31 / ~15 min, bez softlocku. Specializace do jedné větve je pomalejší než vyvážený nákup (záměr).
- QTE mají pořád stejný střed okna (dá se naučit nazpaměť).
- Vítr je vždy nulový (`ui.js`). Po 500 m nic nenavazuje a mince nemají využití.
- `simulation/REPORT.md` je zastaralý (verze 0.1.0).

**Obsah**
- Cíl 500 m pokryje jen 2 ze 16 míst.
- Nápisy kreslené ve scéně zůstaly anglicky („PAPER LAB“ apod.), záměrně jako neonové reklamy.
- Jen 2 typy událostí se stejnými texty a málo humoru. `bonus.html` je prázdná stránka v navigaci (řeší Atlas B1).

**Kód**
- Render smyčka běží pořád a v každém snímku přepisuje DOM. Texty v canvasu jsou na mobilu nečitelné.
- `#paused` se nikdy reálně nezobrazí. Reduced motion je jen částečné. `background-preview.html` přetáčí na 10 000 m místo 4 876 m.
- Mrtvé assety `*-far.svg` a `*-near.svg` a staré zelené téma v `style.css`.
- Magická čísla mimo config (odemčení 100, cíl 500, časování QTE duplikované v `simulate`). Křehké mapování profilu v `simulate`, RNG streamy simulace se překrývají.
