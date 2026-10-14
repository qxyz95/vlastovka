> **ZASTARALÉ (15. 10. 2026):** plán implementace bible 02 (rozpory R1–R18, dávky G0–G4 pro cyber/komiks); bible 02 je překonaná; platí `research/design/05-styl-papir.md`. Hotové dávky G0–G4 zůstávají jen jako historie. Nečíst jako zadání.

# Stylová bible: plán implementace

Art-director, 14. 10. 2026. Převádí rozpory R1–R18 ze schválené bible `research/design/02-styl.md` (kap. 11) na úkoly. Cílové hodnoty jsou z bible. Bible má přednost; když úkol a bible nesouhlasí, platí bible a úkol se opraví.

**Pořadí priorit:** (1) čitelnost vlaštovky a stopy, (2) tuš, půltón a barvy města, (3) jedno UI, (4) úklid barev v živých prvcích a Atlasu.

**Vlastníci:** game-dev = `src/render3d/` (včetně `palette.js`, `mood.js`, `comic.js`) a testy k nim; product-designer = `style.css`, `index.html`, `bonus.html`, `prototype/atlas/`. Art-director kód nepíše, dělá art-review hotových dávek.

**Společné pro všechny úkoly:** `npm test` projde, ke každé změně chování test v `tests/` (CLAUDE.md), hráčské texty jen přes i18n, rozpočty z `.claude/rules/render3d.md` (≤ 120 draw calls, na místo ≤ 14 draw calls a ≤ 15 tis. trojúhelníků, desktop P95 ≤ 16,7 ms). Snímky pro art-review: 375 × 667, 932 × 430 a 1280 × 800, všechny 4 čtvrti, Dílna, let, událost, výsledek. Kontrasty se **měří z pixelů snímku** (WCAG), ne z hex v kódu. Snímky ze skrytého okna jsou pro plynulost NOT ASSESSED.

---

## 1. Úkoly podle priority

| # | Rozpor | Úkol | Vlastník | Soubory | Cíl (bible) | Ověření |
|---|---|---|---|---|---|---|
| U1 | R8 | Vlaštovka bílá, tónování světlem čtvrti ≤ 20 % | game-dev | `palette.js` (`plane.fill #ffffff`), `plane.js` (materiál) | kap. 4, 5.1: výplň po osvětlení svítivost ≥ 80 % bílé ve všech čtvrtích | z pixelů: výplň × nebe v Horizon a Core ≥ 1,5 a obrys × nebe ≥ 9 : 1; v Docks výplň × pozadí ≥ 7 : 1; šedý test kap. 5 projde ve všech 4 čtvrtích |
| U2 | R1 (vlaštovka) | Obrys vlaštovky `ink #15101f`, ≥ 2,6 px × DPR na všech kvalitách | game-dev | `palette.js` (`plane.outline`), `scene.js` (`planeHull`) | kap. 3, tabulka obrysů | test: `palette.plane.outline === INK`; snímek: obrys souvislý i na telefonu |
| U3 | R9 | Stopa s tušovým lemem ≥ 1 CSS px na obou okrajích, jádro v barvě čtvrti | game-dev | `plane.js` (`makeTrail`), `palette.js` (token `trailEdge = ink`) | kap. 5.2: lem × světlé nebe ≥ 9 : 1, jádro × lem ≥ 6 : 1, šířka stopy ≥ 2 CSS px i v oddálené kameře | z pixelů v Horizon a Core: stopa dohledatelná v šedi; test geometrie lemu |
| U4 | R18 | Obzor Neon Core do tyrkysové | game-dev | `mood.js` (klíče 12–15: 3. pás `#2aa99c`, 4. pás `#7ff0d8`), `comic.js` (`VERSE[3]`) | kap. 2.3 | test `render3d-mood`: klíče 12–15 bez limetkové (`#cce65a`, `#d2ee48`, `#c4dc74`, `#e8d070` pryč); snímek Core bez zelené plochy |
| U5 | R11 | Rychlostní čáry vynechají pás ±24 logických px kolem vlaštovky | game-dev | `fx-map.js` (`speedLines` dostane polohu vlaštovky), `ui-layer.js` (předání) | kap. 6 | test `fx-map`: žádná čára neprotne obdélník vlaštovky; počet čar dál podle rychlosti (40 m/s, 6–24) |
| U6 | kap. 5.5 | Pod QTE kruhem tmavý disk `ink` 60 % alfa | game-dev | `ui-layer.js` | kap. 5.5: stopa kruhu × podklad ≥ 3 : 1 | z pixelů ve Suburbs (dnes 1,67) |
| U7 | R3 | Perfekt magenta všude, zlatá jen hodnota | game-dev | `palette.js` (`popup.perfect`, `qte.perfect`, `qte.result.perfect` → `magenta #ff4f9e`; `particles[1]` perfekt jiskra → magenta; `popup.milestone` a mince zůstávají `gold #ffd166`) | kap. 2.2 | test palety: perfekt = magenta ve všech klíčích; art-review události s perfektem |
| U8 | R10 | Půltón jen ve stínech budov | game-dev | `toon.js` (`postPass`: maska místo globálního prahu `shade .42`), `scene.js` (zápis masky z materiálu budov) | kap. 3: tečky jen na stínové straně budov a ve vrženém stínu na budovách, perioda 5 px × DPR (střední kvalita 6); obloha, zem, vlaštovka, stopa, postavy, QTE bez teček | snímek všech 4 čtvrtí: v oblasti nebe 0 teček (porovnat se snímkem bez post-procesu); `perf-check` před a po (P95 ≤ 16,7 ms, telefon ≥ 30 fps) |
| U9 | R1 (město) | Jedna tuš `#15101f` pro obrysy města, Dílny a živých prvků | game-dev | `comic.js` (`outline.color = INK` místo `mix(INK,'#07051a',.5)`), `toon.js` (výchozí `color` = `INK` z `comic.js`) | kap. 2.1 | test: `comicLook().outline.color === INK`; grep v `src/render3d/`: `#07051a` a `#0b1935` nikde |
| U10 | R7 | Tloušťka obrysu na jednom místě | game-dev | `comic.js`, `scene.js` | kap. 3: budovy 2,5, drobnosti 1,7, vlaštovka ≥ 2,6 (× DPR) | test: `comicLook` vrací tloušťky, které `scene.js` použije (nebo `comicLook` číslo nevrací vůbec) |
| U11 | R6 | Budovy bez zelené (Docks modré podle palety, Suburbs pastelové bez tyrkysově zelené) | game-dev | `scene.js` (`cityColors`), případně `palette.js` (`city.biomes`) | kap. 2.3: Docks stěny k `#215a8c`, žádný odstín s G výrazně nad R a B v budovách | z pixelů: odstín (hue) budov v Docks 200–230°, ve Suburbs 260–340°; art-review |
| U12 | R4 | `VERSE` sladit s `mood.js` (nebo odstranit, pokud nic nečte) | game-dev | `comic.js` | kap. 2.3 | test: `VERSE[i].sky` = `MOOD_KEYS` středu čtvrti, nebo `VERSE` neexistuje a `comicLook` bez něj projde |
| U13 | R15 | Jedno `PLANE_SCALE = 7,75` | game-dev | `plane.js` (export 7,75), `scene.js` (import místo lokální konstanty) | kap. 3 | test: `scene.js` nemá vlastní konstantu (grep), velikost vlaštovky ve snímku beze změny |
| U14 | R2, R14 | Barvy živých prvků, Dílny, nebe a holuba z `palette.js` | game-dev | `palette.js` (nové tokeny: `sky.moon`, `sky.sun`, `sky.stars`, `life.*`, `workshop.*`, `steam`), `life3d.js`, `workshop.js`, `companion3d.js`, `scene.js` (měsíc `#ffe3f4`, slunce, hvězdy) | kap. 2.1: azurová = `cyan #5cf2ff` (odchylky jen `mix` v kódu), magenta = `magenta #ff4f9e` | test: v `life3d.js`, `workshop.js`, `companion3d.js`, `scene.js` žádný hex literál (grep `#[0-9a-f]{6}`), nebo jen přes import z `palette.js` |
| U15 | kap. 5.3 | Kouř z komínů a pára šedofialové, svítivost aspoň o 40 % nižší než vlaštovka | game-dev | `palette.js` (`steam`), `life3d.js`, `companion3d.js` | kap. 5.3 | z pixelů ve Suburbs: kouř ≤ 60 % svítivosti vlaštovky; art-review |
| U16 | kap. 3 (obrysy) | Dílna: obrysy 2,5 / 1,7 místo 2,4 / 2,2 / 1,6 | game-dev | `workshop.js` | kap. 3 | snímek Dílny 1280 × 800 a 375 × 667 |
| U17 | kap. 3 (detail) | Vzdálené řady: okna bez barevných variant, max. 1 barva | game-dev | `toon.js` (`windowTexture` varianta pro dálku) nebo `scene.js` | kap. 3 | art-review: panorama Core a Suburbs „tišší“ než ulice; draw calls beze změny |
| U18 | R13 (3D) | Cedule a popupy bez monospace (zúžené bezpatkové) | game-dev | `toon.js` (`signTexture`), `palette.js` (`popup.font` = `--display` stack), `ui-layer.js` | kap. 7 | grep `monospace` v `src/render3d/` = 0; snímek popupu a cedulí |
| U19 | R12, R13 | UI hry na tokenech Atlasu | product-designer | `style.css`, `index.html`, `bonus.html` | kap. 7: tokeny Atlasu (`--night #1b1444` … `--shadow`), `--ink #15101f`, `--display`/`--body`, bez monospace; `theme-color` = `#1b1444`; zelené zbytky (`#10272b`, `#203b3e`, `#f2ce87`) pryč | `a11y-audit` (text ≥ 4,5 : 1, grafika ≥ 3 : 1, cíle ≥ 44 px); art-review výsledku, Dílny a míření na 3 šířkách |
| U20 | R12 (kanvas) | Mířicí panel a štítky ve scéně na tokenech UI | game-dev | `palette.js` (`aim.panel` → `plate #251c57`, `aim.text` → `text #f5f1ff`, `aim.arrow` → `focus #fff27a`, `label` → `night`/`text`) | kap. 7 | snímek míření (`desktop-mireni.jpg` dnes zelený) |
| U21 | R16 | HUD: popisky ≥ 10 px `--dim`, čísla `--text`, mince `gold` | product-designer | `style.css` | kap. 7 | snímek 375 × 667; `a11y-audit` |
| U22 | R1, R5, R18 (Atlas) | Atlas: tuš `#15101f`, barvy čtvrtí z `mood.js` (pohlednice místa i = `MOOD_KEYS[i]`), Core obzor tyrkysový | product-designer | `prototype/atlas/art.js`, `prototype/atlas/atlas.css` | kap. 2.3, 7; vzor čtvrti v nebi (`ht-0…3`) odstranit, půltón jen ve stínech (rozhodnutí 14. 10.) | art-review 16 pohlednic; kontrast tuš × nejsvětlejší pás ≥ 9 : 1 |
| — | R17 | (jen informace: prototyp Atlasu 14. 10. nešel spustit) | product-designer | `prototype/atlas/content.js` | | není stylový úkol |

---

## 2. Dávky

Soubory se mezi souběžnými dávkami nepřekrývají. **G0 musí být první**, protože všechny ostatní dávky jen čtou nové tokeny z `palette.js` a `mood.js`. Potom mohou G1, G2, G3, P1 a P2 běžet souběžně (git worktree, `.claude/rules/orchestrace.md`).

| Dávka | Vlastník | Úkoly | Smí měnit | Nesmí (cizí) | Priorita |
|---|---|---|---|---|---|
| **G0 Tokeny** | game-dev | U4 (část `mood.js`), U7, datová část U1, U2, U3, U14, U15, U18, U20: všechny nové a změněné tokeny | `src/render3d/palette.js`, `src/render3d/mood.js`, `tests/render3d-mood.test.js`, nový `tests/render3d-palette.test.js` | ostatní `src/render3d/*` | 1 |
| **G1 Čitelnost letu** | game-dev | U1, U3, U5, U6, U13 (`plane.js`), U18 (`ui-layer.js` část) | `src/render3d/plane.js`, `fx-map.js`, `ui-layer.js` + jejich testy | `palette.js`, `mood.js`, `scene.js`, `toon.js`, `comic.js` | 1 |
| **G2 Tuš a půltón** | game-dev | U2 (`scene.js` hull), U4 (`comic.VERSE[3]`), U8, U9, U10, U11, U12, U13 (`scene.js` import), U17, U18 (`toon.js` část) | `src/render3d/scene.js`, `toon.js`, `comic.js` + jejich testy | `palette.js`, `mood.js`, `plane.js`, `ui-layer.js` | 2 |
| **G3 Živé prvky a Dílna** | game-dev | U14, U15 (spotřeba tokenů), U16 | `src/render3d/life3d.js`, `workshop.js`, `companion3d.js` + jejich testy | ostatní `src/render3d/*` | 4 |
| **P1 Jedno UI** | product-designer | U19, U21 | `style.css`, `index.html`, `bonus.html` | `src/`, `prototype/` | 3 |
| **P2 Atlas** | product-designer | U22 | `prototype/atlas/art.js`, `prototype/atlas/atlas.css` (+ `content.js` jen kvůli R17) | `src/` (`mood.js` jen čte) | 4 |

Poznámky ke hranicím:
- U13: G1 změní export `PLANE_SCALE` v `plane.js` na 7,75, G2 v `scene.js` lokální konstantu nahradí importem. Výsledek je správný v libovolném pořadí sloučení.
- U18: `palette.popup.font` mění G0, kreslení v `ui-layer.js` G1, `signTexture` v `toon.js` G2.
- U14 a U15: tokeny přidá G0, spotřebu v `scene.js` (měsíc, slunce, hvězdy) dělá G2, v `life3d.js`, `workshop.js` a `companion3d.js` G3.
- P1 nemaže 2D styly (`body[data-theme]`) v `style.css`. Ty zmizí v samostatném kroku spolu s 2D (06, 14. 10.).
- P2 může běžet až po dokončení rozpracované práce product-designera na `prototype/atlas/`.
- 2D záloha (`render.js`, `themes.js`, `themes-verse.js`) se neopravuje, protože se maže.

---

## 3. Ověření po dávce

1. `npm test` projde. Test ke každé změně chování je uvedený u úkolu.
2. Art-review (skill `art-review`) proti `02-styl.md`: snímky na 375 × 667, 932 × 430 a 1280 × 800, všechny 4 čtvrti, Dílna, let, událost s perfektem, výsledek. Nové snímky uložit do `research/design/img/` se jménem `po-<dávka>-…`.
3. Kontrasty z pixelů (kap. 2.4 a 5 bible). Povinné body: výplň a obrys vlaštovky, stopa v Horizon a Core, QTE kruh, text UI.
4. Šedý test (kap. 5): snímek do šedi, 25 %, vlaštovka a stopa nalezitelné jako první ve všech čtvrtích.
5. G2: `perf-check`, protože maska půltónu mění post-proces. Výsledek do `reports/3d/perf.md`.
6. P1: `a11y-audit`.
7. Měření ve viditelném okně. Ve skrytém okně jen funkční kontrola, vzhled a plynulost NOT ASSESSED.
