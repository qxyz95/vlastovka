# Plán převodu 3D komiksového města do hry

**14. 10. 2026.** Plán agenta Plan podle rozhodnutí v `research/bonusy/06-rozhodnuti.md` („3D nahradí 2D“, 2D se smaže, až bude 3D ve hře hratelné). Odhady: **S** do 1 dne, **M** 2–4 dny, **L** 1–2 týdny práce agenta. Logika (`config`, `core`, `events`, `throw`, `scenes`, `storage`, `random`, `motion`, `juice`) a simulátor se nemění.

## Klíčová zjištění z kódu
1. `ui.js` volá vykreslování jen přes `render($('game'),shown,model,time,{decorations,reduced,qte,fx,charge,clock})`, `view(shown)` a mířicí overlay s pevnými souřadnicemi `148,258`. Kamera v klidu proto musí promítnout vlaštovku přesně na (148, 258).
2. `juice.stepFx` ukládá částice ve „světových px“ (`cam+px`). Ve 3D musí `cam` zůstat v pevné jednotce 2,1 px/m nezávislé na zoomu (smlouva níže).
3. `tests/events.test.js` importuje `createDecorations`/`stepDecorations` z `decorations.js`. Soubor zůstává, smaže se jen `drawDecorations`.
4. `scenes.js` se nemění. `moodAt` bude v `src/render3d/mood.js`.
5. Prototyp `prototype/3d/main.js` (varianta a) importuje 2D `render.js`. Varianta (a) se musí vyřadit před smazáním 2D.
6. Testované moduly nesmí importovat `three` ani DOM (Node nemá `node_modules`). Hlídá to strážní test.
7. `simulation/progression/` a `tests/progression*` nejsou v gitu. Pravidlo „nesahat“.
8. Riziko střetu s hudbou je jen v `ui.js` a `index.html`.
9. three.js r170 má 691 kB (~170 kB gzip). `server.mjs` zná jen html, js, css a svg.

## 1. Architektura
- **„Plán snímku“:** čistá `planFrame()` spočítá kameru, pózy, náladu, místa a obsah UI. Aplikace s three.js ho zapíše do scény. Rozhraní jde testovat v Node.
- **Čisté moduly `src/render3d/`:**
  - `geometry.js` (z prototypu; `cityChunk(index)` v lokálních souřadnicích kvůli keši),
  - `camera.js` (z `director.js` + režisér),
  - `life.js`, `mood.js` (16 klíčových snímků + úsvit),
  - `pose.js` (dítě a vlaštovka, vzorce 1:1 z `render.js`),
  - `fx-map.js` (otřes kamery, záblesk, rychlostní čáry, částice),
  - `comic.js` (půltón, pásy oblohy, palety z `themes-verse.js`),
  - `palette.js`, `events-view.js` (pohled pro každý typ události),
  - `quality.js` (stupně kvality, LOD),
  - `frame.js` (`planFrame`),
  - `districts/<id>-layout.js` (4×),
  - `src/settings.js` (Calm camera, Screen shake, Flashing lights, Speed lines, kvalita; klíč `just-throw-it-display`).
- **Moduly s three.js:**
  - `index.js` (`render`/`view` se stejnou signaturou, líná inicializace, resize, ztráta kontextu, `?perf=1`, `window.__r3d`),
  - `scene.js`, `city.js` (keš a stream nejvýš 1 místa za snímek, prewarm v Dílně), `plane.js`, `workshop.js`, `life3d.js`, `toon.js`,
  - `districts/<id>.js` (4×), `districts/index.js` (registr, vlastní integrátor),
  - `ui-layer.js` (2D UI: QTE kruh 1:1 z `render.js`, štítky, částice, popupy, záblesk, rychlostní čáry, mířidla, `uiScale` pro mobil; testy s falešným ctx).
- **Smlouva `view(f)`:**
  - vrací `{cam,px,py,ground,k}` v logických px 640×360,
  - `cam = X·2,1 − px`, `k` = poměr měřítka,
  - UI vrstva kreslí částice jako `sx = px + (wx−cam−px)·k`,
  - `view(null)` = (148, 258) ±2 px.
- **Dva canvasy v `.scene`:**
  - `#scene3d` (WebGL, `pointer-events:none`),
  - `#game` (průhledná 2D UI vrstva, drží všechny posluchače, logické souřadnice 640×360 přes `setTransform`; otřes uvnitř `save/restore`).
- **Napojení `ui.js`:**
  1. přepínatelný import (3D výchozí, `?render=2d` nebo bez WebGL → 2D, do fáze f),
  2. `visual.state` (později `paper`, `settings`),
  3. `148,258` nahradit `view(null)`, později přesunout overlay do `ui-layer.drawAim`,
  4. ve fázi f odstranit přepínač stylů a smazat klíč `just-throw-it-theme`.
- **three.js:** vendorovaná ve `vendor/three/`, import map v `index.html`, MIME `.json .png .webp .woff2` v `server.mjs`.

## 2. Fáze
| Fáze | Obsah | Odhad | Hotovo, když |
|---|---|---|---|
| **0 Příprava** (integrátor) | přesun čistých modulů z prototypu do `src/render3d/`, přejmenování testů, rozdělení míst do `districts/*-layout.js`, registr se stuby, rozhraní v `index.js`, strážní test čistoty, import map a `#scene3d`, MIME | S–M | `npm test` OK, logika beze změny, prototyp běží |
| **a1 Jádro scény** | `scene`, `city`, `plane`, `frame`, `index` | M | kontraktní test `planFrame`, let nad Suburbs s `?render=3d` |
| **a2 UI vrstva** | `ui-layer`, `fx-map` | M | testy s falešným ctx, kruh a popupy na stejném místě jako ve 2D |
| **a3 Dílna a dítě** | `workshop`, `pose` | M | `view(null)` = (148, 258), šipka z vlaštovky, testy póz |
| **a4 Efekty ve 3D** | otřes, squash, rotace, 3D stopa, holub s nákladem, pára | S–M | parita úhlu vlaštovky s 2D |
| **a5 Integrace** | `ui.js`, `index.html`, `style.css`, 3D výchozí | S | celá smyčka myší, dotykem i klávesnicí, testy logiky beze změny |
| **a6 Robustnost** | ztráta a obnova kontextu, fallback, prewarm | S | `loseContext/restoreContext` bez pádu |
| **b0 Hrubé čtvrti** | všech 16 míst z `cityChunk` | S | minimum pro bránu smazání 2D |
| **b-docks / b-horizon / b-core** | plné čtvrti podle katalogu `research/svet/01-zivy-svet.md`, převod časování animací z `route-render.js` | 3× L | screenshoty míst, nejvýš 14 draw calls a 15 tis. trojúhelníků na místo |
| **b-suburbs** | doplnit na katalog (dav, Pinwheel, pára) | M | dtto |
| **c1 Nálada** | `mood.js`: oblouk „za sluncem“, posterizovaná obloha, „zadržení dechu“ při události | M | spojitost barev, screenshoty hranic |
| **c2 Kamera** | stavy Follow, Vista, Place intro, District, Landing; zámek při QTE; Calm camera | M | testy zámku a bez skoků |
| **d1 Výkon** | automatická kvalita s hysterezí, atlas cedulí, LOD podle tempa, 30 fps v Dílně a výsledku | M | desktop P95 ≤ 16,7 ms, CPU ≤ 6 ms, ≤ 120 draw calls |
| **d2 Přístupnost** | panel nastavení, reduced motion (prostředí 25 %, bez zoomu a otřesu), blikání ≤ 1 Hz | S–M | testy `validateDisplay` |
| **d3 Mobil** | DPR ≤ 1,5, bez stínů, `uiScale` | S | telefon ≥ 30 fps |
| **e Papíry a události** | `paperLook` (Copy, Kraft, Washi, Neon Foil), herci pára, termika, dron, hvězda, `drawQte` podle typu | M | každý typ má pohled, neznámý nespadne |
| **f Odstranění 2D** (samostatný commit) | smazat `render.js`, `route-render.js`, `backgrounds.js`, `ambient.js`, `atmosphere.js` (2D části), `fx-render.js`, `themes.js`, `themes-verse.js`, `assets/backgrounds/`, `scripts/build-backgrounds.mjs`, `background-preview.html`, `tests/themes.test.js` (rozdělit `verse.test.js`); upravit `decorations.js`, `ui.js`, `index.html`, `style.css`, `CLAUDE.md`, `README.md`; zachovat `scenes.js`, `perf.js`, `motion.js`, `juice.js` | S–M | brána níže |
| **g Úklid prototypů** | smazat `prototype-3d.html`, `prototype/3d/` | S | žádný import z `prototype/` |

**Brána pro smazání 2D:**
- hotové fáze 0, a1–a6 a b0,
- 3D výchozí několik dní bez regresí,
- ošetřená ztráta kontextu a rozhodnutý prohlížeč bez WebGL,
- výkon podle d1,
- převedené nebo vědomě vypuštěné animace míst,
- přesunuté čisté pomocníky z témat,
- vyřazená varianta (a).

**Kritická cesta:** 0 → a1 → a4 → a5 → a6 → b0 → brána → f → g. Fáze a1 ∥ a2 ∥ a3 jdou po 0 souběžně. Fáze c, d a e běží souběžně po a1.

## 3. Vlastnictví souborů
| Agent | Vlastní | Čeká na |
|---|---|---|
| Integrátor | `src/ui.js`, `index.html`, `style.css`, `server.mjs`, `render3d/index.js`, `render3d/districts/index.js`, `CLAUDE.md`, `README.md`; fáze 0, a5, a6, f, g | – |
| R1 Jádro | `scene`, `city`, `plane`, `frame`, `geometry`, `toon` + testy | 0 |
| R2 UI vrstva | `ui-layer`, `fx-map`, `palette`, `events-view` + testy | 0 |
| R3 Dílna | `workshop`, `pose` + testy | 0 |
| R4 Nálada | `mood`, `comic` + testy (aplikaci dělá R1) | 0 |
| R5 Kamera | `camera` + testy | 0 |
| D1–D4 Čtvrti | `districts/<id>.js`, `<id>-layout.js` + testy (Suburbs i `life`, `life3d`) | a1 |
| P Výkon | `quality`, `src/settings.js`, `render3d-preview.html` + testy | a1 |
| E Papíry a události | `plane-looks.js`, `events-view.js` po R2 | a2, a4 |

**Pravidla:**
- Jen R1 mění `scene.js`. Čtvrti nesahají do `geometry.js` ani do registru.
- Hudební agent vlastní `src/audio*`, `sfx`, `music/`. Commity do `ui.js` jdou po jednom.
- Nikdo nesahá na `simulation/`. Spouští se jen cílené testy, pád `tests/progression*` se nahlásí.

## 4. Testy
- **Node:**
  - geometrie,
  - kontrakt `planFrame` (`view(null)`, projekce, vzorec částic, `planFrame` nemutuje vstup),
  - determinismus (renderer neovlivní fyziku),
  - kamera (zámek při QTE, žádné skoky, Calm),
  - nálada (spojitost, rozsahy, déšť z `atmosphereAt`),
  - pózy (parita s 2D), efekty (reduced = nula),
  - UI vrstva (falešný ctx),
  - čistota importů,
  - kvalita a nastavení.
- **Prohlížeč:**
  - deterministické screenshoty (`?seed=1`, `__r3d.advance`, `__r3d.snapshot`) pro každou fázi do `reports/3d/<fáze>/`,
  - výkon `?perf=1` a `__r3d.bench(240)` do `reports/3d/perf.md`.
- **Logika beze změny:** `git diff --exit-code` nad `config`, `core`, `events`, `throw`, `scenes`, `storage`, `random`, `motion`, `juice` a jejich testy. Celé `npm test` před commitem.

## 5. Rizika
| Riziko | Ošetření |
|---|---|
| Výkon na slabých zařízeních | automatická kvalita, strop DPR, stíny jen na desktopu, atlas a instancing, keš a prewarm, 30 fps mimo let, měřit od a1 |
| Ztráta WebGL kontextu | UI vrstva a hra běží dál, pod nimi gradient z `moodAt`, obnova postaví scénu znovu |
| Čitelnost QTE | kruh na UI vrstvě nad scénou, zámek kamery, tlumené pozadí, vlaštovka jediný bílý objekt |
| Velikost | procedurální geometrie i textury, gzip nebo brotli při nasazení |
| Starší save | save v3 beze změny, téma mimo save, nové nastavení s validací |
| Kinetóza a blikání | Calm camera, rotace ≤ 3°, ≤ 1 Hz |
| Střety souborů | vlastnictví podle §3 |
| Písmo na mobilu | `uiScale`, nadpisy míst v DOM |

## 6. Otázky k rozhodnutí (s doporučením)
1. **Prohlížeč bez WebGL** po smazání 2D: (A) jen hláška, nebo (B) malý nouzový režim. *Doporučeno A.*
2. **Brána pro smazání 2D:** hrubé 3D všech míst (b0), nebo plné čtvrti (b)? *Doporučeno b0.*
3. **Referenční slabá zařízení** pro kritérium výkonu: jaký notebook, telefon, případně Steam Deck?
4. **Výchozí render po fázi a5:** hned 3D, nebo zatím za `?render=3d`? *Doporučeno hned 3D.*

## 7. Rozhodnutí uživatele (14. 10.)
1. Bez WebGL jen hláška. 2. 2D se smaže po b0 (hrubé 3D všech 16 míst). 3. Referenční zařízení:
   - **notebook ASUS ROG Strix G513IM:** AMD Ryzen 7 4800H, NVIDIA GeForce RTX 3060 Laptop + integrovaná Radeon, 16 GB RAM, displej 1920×1080 (zjištěno z Windows). Pozor, prohlížeč může běžet na integrované grafice, proto měřit na obou (v nastavení Windows „Grafika“ nebo v prohlížeči `chrome://gpu`),
   - **telefon iPhone 15 Pro** (Safari, WebGL2, ProMotion 120 Hz; cíl stabilních 60 fps).
4. 3D výchozí hned po a5.
