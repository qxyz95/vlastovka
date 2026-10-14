# Plán hratelnosti: art (postavička, první záběr, život čtvrti, jediný styl)

> **NÁVRH** (art-director, 15. 10. 2026). Závazné až po schválení uživatelem (orchestrátor zapíše do `research/bonusy/06-rozhodnuti.md`).
> **Rozhodnuto 15. 10. 2026** (06, „Plán hratelnosti, odpovědi na otázky“ body 13–15): postavička **varianta C** (kap. 1 přepsaná pro C), kouř **papírový, jen daleko od místa odhodu** (kap. 3.3, dávka H5), **úvodní záběr A** s nápisem „Throw it“ nahoře v nebi nad hřebenem (kap. 2). Dávky H1, H2 a H5 jsou tím připravené k implementaci (kap. 6). Ostatní (kap. 3.1–3.2 kromě kouře, 4) zůstává návrhem.
> Podklad: poznámky tvůrce `research/playtest/2026-10-15-poznamky-tvurce.md`, výklad N1–N10 `2026-10-15-vyhodnoceni.md`, rozhodnutí 06 „Poznámky tvůrce z hraní“ body 1 a 3. Bible `research/design/05-styl-papir.md` (dál „bible“), katalog `research/design/11-katalog-ctvrt1.md` (dál „katalog“), místo odhodu `research/start/02-misto-odhodu-vzhled.md`.
> Náčrty: `research/design/img/hratelnost/` (skript `hratelnost.mjs`, Node bez závislostí, stejná kamera a město jako hra). Prohlížeč jsem nepoužil, vzhled ve hře je **NOT ASSESSED**.

## 0. Shrnutí

| # | Co | Návrh | Pro koho |
|---|---|---|---|
| N5 | Plastická postavička | **Rozhodnuto: oblá figurka C** jako papírový model z mnoha dílků: tuhé díly s 6–16 stěnami, každá stěna jeden tón, natočená ke kameře ve ¾ pohledu, **630 △** (LOD 1: 130), 1 draw call, bez obrysu. Stejná výška 1,2 m, stejné barvy. | game-dev (dávka H2) |
| N6 | První záběr | **Úvodní záběr 30 m** (telefon 18 m): dům s dílnou v řezu vlevo, dítě vpravo od středu, nápis „Throw it“ nahoře v nebi nad hřebenem. Po dotyku 0,6 s jízda na záběr míření 16 m. Nahrazuje záběr menu 28 m. **Rozhodnuto (A).** | game-dev (dávka H1), product-designer (text) |
| N6 | Kouř | **Rozhodnuto: papírový kouř** (malé průsvitné krémové obláčky) jen na komínech ≥ 200 m od ruky, nikdy za dítětem. Cyber kouř `life3d` pryč (H0). | game-dev (H0, dávka H5) |
| P2 | Zbytky starého stylu | Celá vrstva „život čtvrti“ (`life.js`, `life3d.js`) se dnes kreslí v cyber stylu i v papíru. Převést na papírové modely z katalogu, škrtnout drony, robota Bolts, reklamy a cyber kouř. | game-dev |
| N7 | Jediný styl | Seznam, co smazat a co přepnout, aby zůstal jen papír (kap. 4). Hlavní bod: přepínač a odkaz „NEON CITY“ vlevo nahoře. | game-dev, product-designer |

---

## 1. Plastická postavička z papíru (N5)

> **Rozhodnuto 15. 10. 2026 (06, „Plán hratelnosti“ bod 13): varianta C, oblá figurka s mnoha stěnami** (`img/hratelnost/postavicka-varianty.png`, poslední řádek), ne doporučená A. Kap. 1.3–1.8 jsou přepsané pro C a pro dávku **H2** (kap. 6). Kap. 1.1–1.2 zůstávají jako podklad rozhodnutí.
> Náčrty pro C: `img/hratelnost/postavicka-c.png` (náčrt × verze pro hru × LOD 1 na velikostech ze hry), `postavicka-c-pozy.png` (7 póz), `uvod-c.png` (úvod a míření s C). Generuje je `hratelnost.mjs` (konec souboru, `VAR.CH`, `VAR.C1`); tvar, klouby, pózy i stínování v náčrtu jsou předlohou pro hru.

### 1.1 Co je dnes
`src/render3d/models/kid.js` + `kid-rig.js`: dítě je z **plochých karet** čelem ke kameře (49 △ v póze míření, strop `tris [80, 20, 0]`), jeden dynamický buffer = 1 draw call, pózu skládá CPU (záklon, couvnutí, dýchání, ruka jako proužek od ramene k dlani). Ze strany vypadá jako výstřižek: tělo je „zepředu“, obličej z profilu. Uživatel chce objem a víc stran (Tearaway, Paper Mario 3D), ne klasický 3D model (06 bod 3).

### 1.2 Tři varianty tvaru (`img/hratelnost/postavicka-varianty.png`)
Stejná výška 1,2 m, barvy (bible kap. 9.4), klouby i póza míření. Řádky: velký náhled, 96 px (desktop při míření), 64 px (telefon), 64 px v šedi (test bible kap. 6).

| | A Skládaná loutka | B Vrstvená karta 2,5D | **C Oblá figurka (zvoleno)** |
|---|---|---|---|
| Tvar | díly jako složené papírové krabičky a ruličky, 4–8 stěn | dnešní karty + tloušťka 2 cm a řezaná hrana, natočení jen ±15° | 8–16 stěn, zaoblená hlava, tělo, čepice-kornout |
| △ (náčrt) | 182 (LOD 1: 52) | 196 | 904 → **630 ve hře** (kap. 1.3), LOD 1 **130** |
| Objem, „víc stran“ | ano | ne, jen hrana | ano, nejvíc |
| Papír (P2) | ostré přehyby | plochá | jako papírový model z mnoha dílků (papercraft), viz 1.5 |

**Proč C funguje jako papír:** každá stěna má jeden plochý tón (bez hladkého stínování), takže figurka vypadá jako **papírový model slepený z mnoha dílků** (papercraft, „Pepakura“), ne jako plast. To drží materiál (kap. 1.5): ploché stěny, vlákno papíru, žádný lesk ani přechod uvnitř stěny. Riziko „hračka z plastu“ (z původní otázky) se hlídá právě tím.

### 1.3 Díly varianty C (LOD H, dávka H2)

Každý díl je **„soustružený“ hranol** (lathe): prstence `[y, rx, rz, dx]` kolem osy dílu (y podél dílu, rx = poloměr ve směru pohledu dítěte +x, rz = do boku, dx = posun osy), `n` stěn po obvodu, úhel prvního vrcholu `π/n`. Prstenec s poloměrem 0 je **pól** (vějíř trojúhelníků, žádné víčko). Víčka jen tam, kde jsou vidět (sloupec „víčka“). Hodnoty jsou z `hratelnost.mjs` `VAR.CH`, △ z generátoru.

| Díl | n | Prstence `[y, rx, rz, dx]` (m, od kloubu dílu) | Víčka | △ | Barva |
|---|---|---|---|---|---|
| hlava | 16 | pól 0; [.035, .12, .11]; [.09, .16, .15]; [.155, .17, .16]; [.22, .16, .15]; [.275, .12, .11]; pól .31 | – | 160 | kůže `#f3d2b4` |
| vlasy | 10 | [.10, .11, .15, −.07]; [.22, .12, .15, −.06]; [.31, .07, .09, −.04] | – (přední půlka je uvnitř hlavy) | 40 | `pencil700 #4a4038` |
| oči 2× | – | destička 0,04 × 0,04 m na x = .165, y = .15, z = ±.055 | – | 4 | `pencil700` |
| čepice | 12 | [−.045, .175, .165]; [.025, .16, .15]; [.115, .10, .09]; pól .195 (kornout) | – | 60 | `kraft #c9a57c` |
| proužek čepice | 12 | [−.06, .18, .17]; [−.015, .18, .17] (prstenec bez víček) | – | 24 | `tomato #d9472b` |
| pláštěnka | 16 | [−.06, .15, .26]; [.10, .15, .25]; [.30, .13, .21]; [.46, .11, .16]; pól .53 (ramena skloněná ke krku) | spodní | 126 | `#f2b65a` |
| ruka 2× | 8 | [−.5, .045, .045]; [−.25, .05, .05]; [0, .055, .055] | – (rameno v pláštěnce, konec v dlani) | 2 × 32 | jako pláštěnka |
| dlaň 2× | 6 | pól −.06; [−.01, .055, .05]; pól .06 | – | 2 × 12 | kůže |
| noha 2× | 8 | [−.41, .055, .055]; [−.2, .062, .062]; [0, .065, .065] | – | 2 × 32 | `#3d4f7a` |
| bota 2× | 6 | [−.06, .10, .06, .04]; [−.02, .10, .065, .04]; [.02, .07, .05, .02] | obě | 2 × 32 | `pencil700` |
| **celkem** | | | | **630** | |

**Úpravy proti náčrtu C** (to, co náčrt ukázal, `postavicka-c.png` vlevo nahoře × vedle):
- **Obličej musí být vidět.** V náčrtu C zakrýval proužek čepice oči. Hlava je větší (⌀ 0,34 m místo 0,31, „hlavičková“ proporce jako Tearaway), **čepice sedí výš**: proužek začíná 0,03 m nad očima (hlava y 0,195), oči jsou na stěně přivrácené ke kameře.
- **Póly místo víček** a žádná víčka uvnitř jiných dílů: stejný obrys za 630 △ místo 904 (−30 %). Dlaně a boty mají 6 stěn místo 8 (na 96 px mají 9 px, rozdíl není vidět).
- **Ramena bez vodorovné plochy:** pláštěnka končí pólem v krku (sklon ramen 25–35°), aby horní plocha nedostala světlý „řez“ jako hrana karty a ramena vedle vlaštovky nezbělela (P1).

**LOD 1** (dítě < 48 px: úvodní záběr na telefonu 25–37 px, oddálení po výhozu): hlava 8 stěn (2 prstence + póly), vlasy 6, čepice 8 (kornout + proužek), pláštěnka 8, ruce a nohy 4 stěny bez víček, **bez dlaní, bot a očí: 130 △** (`VAR.C1`). **LOD 2:** 0 (za letu dítě není vidět). Stínový proxy beze změny (≤ 4 △, katalog 11 kap. 4.2).
Přepínání: LOD 1 pod **44 px**, zpět LOD H nad **52 px** výšky dítěte na obrazovce (hystereze, aby při jízdě úvod → míření nepřeblikávalo). Úvod na desktopu (51 px) kreslí LOD H, úvod na telefonu LOD 1, míření vždy LOD H (64–96 px).

### 1.4 Kostra a klouby (tuhé díly, bez skinningu)
Papírová loutka s nýtky (Tearaway): každý díl je tuhý, klouby schovává překryv oblých dílů (u C líp než u A, koule a ruličky do sebe zapadnou). Souřadnice jako `kid.js`: chodidla v počátku, dítě hledí na +x (směr hodu), kamera na +z, y nahoru. Rotace: `yaw(a)` kolem y (natočení ke kameře), `rz(a)` kolem z (záklon, švih ruky v rovině boku), `rx(a)` kolem x (odtažení do boku).

| Kloub | Rodič | Poloha kloubu v rodiči (m) | Rotace dílu |
|---|---|---|---|
| kořen (chodidla) | svět | `KID_AT` − `back`·x − `drop`·y | `yaw(yaw) · rz(lean)` |
| noha P / L | kořen | [0, .46, ±.08] | `rz(legR / legL)` |
| bota | noha | [0, −.42, 0] | – |
| trup (pláštěnka) | kořen | [0, .44, 0] | – (dýchání: +`bob` po y) |
| hlava (+ vlasy, oči) | trup | [.01, .47, 0] | `yaw(head[0]) · rz(head[1])` |
| čepice (+ proužek) | hlava | [−.01, .255, 0] | – |
| ruka T (vzdálená, hází) | trup | [0, .41, −.2] | `rx(armT[1]) · rz(armT[0])` |
| ruka F (blízká, ukazuje) | trup | [0, .41, +.2] | `rx(−armF[1]) · rz(armF[0])` |
| dlaň | ruka | [0, −.55, 0] | – |

**Hází vzdálenější ruka (T).** Kdyby házela ruka blíž ke kameře, šla by v míření přes obličej. T jde za hlavou nahoru k bodu výhozu, F **ukazuje směr hodu** (hráč vidí, kam míří, i na postavičce).

### 1.5 Technika (pro game-deva, dávka H2)
- **Smlouva `kidRig()` / `poseKid()` zůstává** (jeden předem alokovaný buffer, CPU skládá pózu, žádná alokace za snímek, vrací `rig.last` = rameno a dlaň). Mění se obsah: místo karet tuhé díly z tab. 1.3, každý díl má v `base` své vrcholy v souřadnicích dílu a za snímek dostane matici 3 × 3 + posun z kostry (1.4).
- **Ploché stěny:** geometrie bez indexů, každý trojúhelník má **normálu stěny** (stejnou pro 3 vrcholy). Normály se za snímek otáčejí stejnou maticí jako díl (dnes se nepočítají, karty mají +z). Za snímek se přepočítá jen aktivní LOD: ~1 900 vrcholů × (poloha + normála), pod 0,1 ms.
- **Jeden buffer, dva LOD, jeden draw call:** pořadí `[LOD H][praporek H5][LOD 1]`. `geometry.setDrawRange` vybere „LOD H + praporek“, nebo „praporek + LOD 1“. Praporek tedy zůstává v tomtéž draw callu jako dnes.
- **Materiál `kidMaterial`** (nový, odvozený z `paperMaterial` v `paper.js`): dnešní papírový materiál stínuje binárně (normála ke kameře `n.z > 0,5` = plná barva, jinak bok), takže by oblé tělo zepředu splynulo v jednu plochu a mnoho stěn by nebylo vidět. Pro dítě (a praporek ve stejném bufferu) platí **rampa po stěnách** z náčrtu (`hratelnost.mjs` `shade()`), jeden tón na stěnu:
  - horní plochy `n.y > 0,75`: `mix(barva, cut #fffaf0, .25)` (ne 0,55 jako hrana karty, jinak temeno a ramena zbělají vedle vlaštovky);
  - spodní `n.y < −0,6`: `mix(barva, side #5b4f7a, .42)`;
  - ostatní: `u = smoothstep(.5, .95, n.z)`, `k = max(0, .32·(1 − u) − .08·max(0, n·L))`; `k < .02` → `mix(barva, cut, .03)`, jinak `mix(barva, side, k)`. `L` = směr ke slunci `[.62, .5, .6]` (bible kap. 4).
  - vlákno papíru (`fiber`) a opar jako `paperMaterial`, příjem stínu z masky ne (`recv 0`). Žádná toon rampa, žádný lesk.
- **Bez obrysu** (P1: obrys má jen vlaštovka).
- **Vlaštovka v ruce se nesmí schovat za dítě.** Dítě je teď 3D a vzdálená ruka drží vlaštovku za hlavou; čepice je v míření 4 cm od ocasu vlaštovky. Návrh: během držení (klid, míření, nabíjení) mají materiály vlaštovky `depthTest: false` (`renderOrder 2` už ji kreslí po dítěti), po výhozu zpět `true`. P1.
- **Bod výhozu (M-3) a ruka:** v póze míření se celé dítě posune (jednou, ne každý snímek) tak, aby **střed dlaně ruky T byl přesně v `LAUNCH.hand` (12 m)**. Při nabíjení a v klidu je dlaň tam, kde hra kreslí vlaštovku (`hand` = poloha vlaštovky, jako dnes): ruka T se v rameni natočí na dlaň (`rz` z `atan2`, odtažení `rx` z pózy), délka ruky je pevná 0,55 m. Rozdíl mezi koncem ruky a vlaštovkou do 5 cm schová dlaň (⌀ 0,11 m). Ruka se nenatahuje a dítě nesmí klouzat po pavlači (chodidla se hýbou jen o `back` z `kidPose`).
- Model pro katalog (`models/kid.js`): díl `lathe(rings, n, {bot, top})` jako nový díl v `models/parts.js` (předloha `latheP` v `hratelnost.mjs`), aby šla postavička ukázat i na stránce katalogu. Pózy v katalogu statické (7 póz z 1.7).

### 1.6 Čitelnost (spočteno z hex, WCAG poměr)
Barvy se nemění (bible kap. 9.4), tóny stěn z rampy 1.5. Bok pláštěnky má `mix(#f2b65a, #5b4f7a, .32)` ≈ `#c29564`.

| Část | proti nebi u ruky (`#a6d0e8` / `#d8e9ea`) |
|---|---|
| pláštěnka čelo `#f2b65a` | 1,10 / 1,44 (dnes jediný tón) |
| **pláštěnka bok ≈ `#c29564`** | **1,65 / 2,16** (nové díky objemu) |
| nohy `#3d4f7a` | 4,93 / 6,45 |
| vlasy `#4a4038` | 6,15 / 8,05 |
| obrys vlaštovky grafit | 6,7–12,2 (bible 9.3) |

Objem dítěti pomáhá: tmavší boky po obvodu zvedají kontrast siluety o ~0,5–0,7. Pořád zůstává pod obrysem vlaštovky (hierarchie bible kap. 6 platí). U C je tmavý okraj po celém obvodu (16 stěn), proto se dítě v šedi na 64 px čte jako kompaktní tvar (`postavicka-c.png`, „64 px šedá“): vlaštovka první, dítě druhé. **Ve hře NOT ASSESSED** (art-review po H2).

### 1.7 Pózy (`img/hratelnost/postavicka-c-pozy.png`)
Úhly v radiánech (tabulka `POSE` v `hratelnost.mjs`, stejná pro A i C). `yaw` = natočení ke kameře (bez něj by z boku byl vidět jen profil a objem by se ztratil).

| Póza | Kdy (`kidPose.phase`) | yaw | lean / back / drop | head [yaw, kývnutí] | armT [rz, rx] | armF [rz, rx] | legR / legL | Pohyb | Reduced motion |
|---|---|---|---|---|---|---|---|---|---|
| klid | úvodní záběr, návrat z Dílny a Atlasu (`rest` mimo panel Dílny) | .75 | – | [.25, 0] | [1.25, −.15] | [1.2, −.25] | 0 / 0 | dýchání ±1 cm on twos; obě dlaně před hrudí, vlaštovka mezi nimi | stojí |
| míření | `aim` | .55 | – | [−.1, .1] | na dlaň (náčrt 2.71), rx .1 | [1.95, .05] | .16 / −.12 | ruka F sleduje úhel mířidel | ruka F sleduje úhel (je to informace) |
| nabíjení | `charge`, mísí se z míření podle `charge` | .55 | záklon a couvnutí z `kidPose` (lean, back) jako dnes | [−.1, .14] | na dlaň (náčrt −2.5), rx .15 | [1.65, .05] | .22 / −.2 | chvění nad 90 % jako dnes | bez chvění |
| výhoz | `throw`, `swing` 0 → 1 za 0,3 s (`KID_THROW`) | .55 → .25 | předklon .07 | [0, −.05] | [1.9, .1] | [−.6, .15] | .38 / −.28 (výpad) | švih ease, trup se stočí za hodem | švih zůstane (zpětná vazba), bez výpadu |
| mávání | `wave` | .9 | – | [−.35, .1] | [.1, .12] | [2.75 ± .35, .55] | 0 / 0 | ruka F mává on twos (dnes `arm`) | ruka nahoře bez mávání |
| sed | menu, pokud zůstane | .6 | drop .36 | [.3, 0] | [−.45, .2] | [.55, .2] | 1.5 / 1.45 | – | stojí |
| u stolu | panel Dílny (`rest` + `state='workshop'`) | .5 | lean −.1 | [0, −.4] | [1.1, .05] | [1.25, .05] | 0 / 0 | – | stojí |

Přechody mezi pózami: úhly se mísí lineárně (míření → nabíjení podle `charge`, míření → výhoz podle `ease(swing)`), jinak střih. Při jízdě úvod → míření (kap. 2.3) přejde klid do míření **za 0,2 s kolem poloviny jízdy** (vlaštovka z obou dlaní do dlaně T). Reduced motion a Calm camera: střih.

### 1.8 Rozpočet a co změnit po schválení (bible, katalog)
- **Rozpočet dítěte:** LOD H **630 △**, LOD 1 **130 △**, LOD 2 0. Strop `tris` z `[80, 20, 0]` na **`[760, 160, 0]`** (+20 % rezerva). **Draw calls beze změny: 1** (dítě + praporek). Vertexů v bufferu (630 + 130) × 3 + praporek ≈ 2 300.
- **Rozpočet místa odhodu:** skupina G2b (katalog 11 kap. 3.7, souhrn) měla strop ≤ 720 △ s dítětem 80. S dítětem C: ~615–635 − 70 + 630 ≈ **1 180–1 200 △**, strop G2b **≤ 1 400**. Je to 1 % rozpočtu místa (15 tis. △, `render3d.md`), draw calls se nemění. Měřit `perf-check` po H2.
- **Bible** `05-styl-papir.md` kap. 9.4: upraveno v tomto kroku (varianta C, rampa po stěnách, hází vzdálená ruka, LOD).
- **Katalog** `11-katalog-ctvrt1.md` karta H1 a souhrn G2b (není v mé sadě souborů, upraví orchestrátor nebo game-dev v H2): „Papír“ → oblá figurka z tab. 1.3; LOD H ~630, LOD 1 ~130; strop `[760, 160, 0]`; souhrn G2b ≤ 1 400; „Rozměry“ hlava ⌀ 0,34 m.
- `person` (lidé ve městě) zůstává plochý (katalog karta 7, 20 △ instancovaný). Hrdina je jediná plastická postava. Rozdíl je záměr: hráčova postava je nejblíž kameře (80 px/m), lidé ve městě mají 4–10 px.

---

## 2. První záběr: dům s dílnou (N6)

### 2.1 Dnes
Hra po načtení ukazuje rovnou **záběr míření** (16 m, `AIM_SHOT`): dveře, zábradlí, trám a dítě 96 px. Dům s dílnou v řezu (koncept 2, schválený 14. 10.) je vidět jen v náčrtu menu (28 m), který ve hře zatím není. Na screenshotu 223830 a na `uvod-zaber.png` (1) je za dítětem kouř.

> **Rozhodnuto 15. 10. 2026 (06 bod 15): varianta A.** Úvodní záběr na dům s dílnou, přiblížení 0,6 s po prvním dotyku, úvod po spuštění a po návratu z Dílny nebo Atlasu, ne po „Hodit znovu“. **Nápis „Throw it“ nahoře v nebi nad hřebenem.** S postavičkou C: `img/hratelnost/uvod-c.png`. Dávka **H1** (kap. 6).

### 2.2 Úvodní záběr (`img/hratelnost/uvod-zaber.png`, s postavičkou C `uvod-c.png`)
Nová konstanta v `launch-site.js` (návrh, stejný tvar jako `MENU_SHOT`):

`INTRO_SHOT = {width: 30, portraitWidth: 18, landWidth: 30, pitch: 2, fov: 20, at: [.64, .66], portraitAt: [.80, .62], landAt: [.66, .64], planeInHand: .5}`

Polohy spočtené kamerou hry (`anchored` = `restCamera`, fov 20°), podíl šířky a výšky obrazu:

| Zařízení | Šířka | Dům (střecha vlevo → dveře pavlače) | Hřeben | Stůl v dílně | Dítě | Dítě px | Místo pro text |
|---|---|---|---|---|---|---|---|
| desktop 16 : 9 | 30 m | 0,11 → 0,54 | 0,31 shora | 0,20 | 0,63 | 51 | střed, 0,08–0,28 shora (nebe nad hřebenem) |
| telefon na šířku 932 × 430 | 30 m | 0,13 → 0,56 | 0,21 | 0,22 | 0,65 | 37 | střed, 0,04–0,18 |
| telefon na výšku 375 × 667 | 18 m | (střecha vlevo uříznutá) → 0,64 | 0,44 | 0,06 | 0,78 | 25 | střed, 0,12–0,32 |

**Kompozice:** dům s dílnou v řezu (stůl, police s rolemi, nástěnka s pohlednicemi, vlaštovky na provázku) zabírá levou polovinu, dítě stojí na pavlači vpravo od středu a dívá se k hráči (póza klid), vpravo od něj je nebe se sluncem a směr hodu. Text výzvy „Throw it / Hold and release“ (N9, rozložení vlastní product-designer) patří **do nebe nad hřebenem, vodorovně na střed**. Na střed obrazovky svisle ne, tam je podkroví s dílnou. **Nic nesmí zakrýt** obdélník dítěte a vlaštovky (desktop 0,56–0,70 × 0,50–0,82, v náčrtu rajčatově). Mince malé vpravo nahoře (N8).

**Nápis** (rozhodnutí 15): „Throw it“ a pod ním menší „Hold and release“ (texty a klíče i18n EN + CS vlastní product-designer, N9), písmo `--display`, grafit `#2a2622` přímo na nebi bez podkladu (grafit × nebe nahoře `#78b4dc` 6,7 : 1, × `#a6d0e8` 9,2 : 1, z hex). Vodorovně na střed, svisle v pásu „Místo pro text“ z tabulky. **S prvním stiskem nápis zmizí** (prolnutí 0,2 s, reduced motion hned), takže při míření v nebi nic grafitového nekonkuruje vlaštovce (bible kap. 6 bod 2).

**Proč ne širší záběr míření:** aby byl dům celý v záběru a ruka zůstala na 0,38, musel by mít záběr ~43 m. Dítě by mělo 36 px a vlaštovka 15 px, míření by ztratilo čitelnost (M-2, P1). Proto dva záběry: nejdřív ustavující, pak blízký.

**Vztah k záběrům 16 m a 28 m:**
- `AIM_SHOT` 16 m (sklon −8°) zůstává beze změny pro míření, nabíjení i Throw again.
- `MENU_SHOT` 28 m s rukou na 0,85 počítal s menu ve sloupci vlevo (07-menu). Podle N8 hra okolí stránky nemá, proto **úvodní záběr = záběr menu** (jedna konstanta, ne dvě). Kdyby product-designer menu se sloupcem tlačítek ponechal, platí pro menu dnešní `MENU_SHOT` a pro úvod `INTRO_SHOT`. Mají stejný sklon, takže přechod mezi nimi je jen posun.

### 2.3 Přechod úvod → míření (`img/hratelnost/uvod-prechod.png`)
- **Spouštěč:** první stisk (pointerdown, mezerník, Enter). **Vstup se přijímá hned** (07-menu §6, 01 §2.1): nabíjení běží už během jízdy, mířidla se kreslí od promítnuté polohy ruky v každém snímku. Úvod sám neodjíždí. Tvůrce chce dům vidět, automatický odjezd po 1–2 s by ho schoval dřív, než ho hráč stihne vidět.
- **Jízda 600 ms**, ease in-out: šířka logaritmicky 30 → 16 m (zoom působí rovnoměrně), kotva ruky lineárně (0,64; 0,66) → (0,38; 0,60), sklon +2° → −8°. Dítě přejde z klidu do míření v půlce jízdy (vlaštovka z obou rukou do vzdálené ruky). Vlaštovka zůstává 0,5 m (M-2).
- **Kdy je úvod vidět:** po načtení hry a po zavření Dílny, Atlasu nebo menu. **Throw again** jde rovnou do míření střihem pod kartou výsledku (01 §2.3), úvod se neopakuje.
- **Reduced motion a Calm camera:** střih (nebo prolnutí 0,2 s) místo jízdy. Úvod stojí, dítě nedýchá.
- **Dítě v úvodu:** do dávky H2 dnešní ploché dítě ve fázi `rest`; po H2 póza klid z kap. 1.7 (LOD H na desktopu 51 px, LOD 1 na telefonu 25–37 px, přepnutí s hysterezí 44/52 px podle kap. 1.3). Klid → míření za 0,2 s kolem poloviny jízdy.
- Úvod kreslí dioráma, dítě a první dvě místa. Rozpočet místa 1 platí (14 DC), měřit `perf-check` po dávce.

### 2.4 Za dítětem nebe, kouř jen daleko
Bible S-6 dovolovala kouř „za dítětem, matný, alfa ≤ 0,6, menší než vlaštovka“. Ve hře je kouř úplně jiný (kap. 3): neprůhledné fialové low-poly koule velké 3–7 m z vrstvy `life3d`. **Rozhodnuto (06 bod 14) a zapsáno do bible S-6:** v pásu výhledu místa odhodu nic nestoupá ani nelétá (kouř, balóny, ptáci, drony); papírový kouř jen na komínech ≥ 200 m od ruky (kap. 3.3), takže ho úvod, míření ani oddálení po výhozu neukáže. Za dítětem je jen nebe, slunce, mraky výš než hřeben a střechy pod pásem S-1.

---

## 3. Kouř a život čtvrti: co zůstalo ze starého stylu (N6, P2)

### 3.1 Diagnóza
`src/render3d/life.js` (`const K = CYBER.life`) a `src/render3d/life3d.js` (`const K = CYBER.life`, `MeshToonMaterial`, obrysové obaly `hull` a `thinHull`, kouř `toon(CYBER.steam)`) **berou barvy a materiály vždy z cyber stylu**, i když hra běží s `?styl=papir`. `PAPIR.life` v `palette.js` existuje, ale tyto dva soubory ho nečtou. Papír z nich mění jen to, že schová auta v místě odhodu a sníží střechy (S-1). Odtud jsou všechny cizí prvky na screenshotu 223830 (`img/hratelnost/zbytky-stareho-stylu.png`):

| # | Co je vidět | Odkud | Proč nesedí | Návrh | Priorita |
|---|---|---|---|---|---|
| 1 | **kouř**: šedofialové low-poly koule 3–7 m | `life3d` komíny (5 obláčků na komín) + lokomotiva + pára tržnice, `CYBER.steam` | toon, neprůhledný, větší než vlaštovka, za dítětem (N6) | **cyber kouř škrtnout v papíru úplně** (komíny i lokomotiva, H0). Nový papírový kouř jen daleko od místa odhodu: kap. 3.3, dávka H5 (rozhodnutí 06 bod 14). Páru z ventilace u události „gust“ řeší `companion3d` (už má `PAPIR.companion.steam` krém), ta zůstává. | **P0** |
| 2 | **balón**: růžový ikosaedr s obrysem nad dítětem | `life3d` balóny, `CYBER.life.pastel` | obrys (P1), cyber magenta, v pásu výhledu | papírový balón (katalog karta 35: kotouč + pruhy, z ≤ −170, nikdy v pásu výhledu místa 1) | P1 |
| 3 | **mraky**: růžové zploštělé elipsoidy | `life3d` mraky, `CYBER.life.cloud #ffd0e6` | růžové, toon; papír má mraky ze 3 krémových kotoučů (`paper-cards` / `lifeCards`) | škrtnout z `life3d`, mraky kreslí jen papírová obloha | **P0** |
| 4 | **lidé na střechách**: kvádry 2,0 m s obrysem | `life3d` (`PS = 1,3`), oblečení `CYBER` (magenta, azur) | obrys, 2 m místo 1,7 (M-1), větší než dítě | papírový `person` (katalog karta 7, model existuje, `models/person.js`), instancovaný, 1 DC. V místě 1 ne na střechách v pásu S-1 přímo za dítětem. | P1 |
| 5 | **komíny**: fialové kvádry | `life.js` `L.static`, `CYBER.life.chimney #7a4f86`, toon + obrys | fialová, obrys, zapuštěné ve štítu (rozpor R5) | komín jako díl domu (`parts.chimney`, `PAPIR.life.chimney #9a4a3a`, katalog karta 4); ¼ z nich kouří podle kap. 3.3 | P1 |
| 6 | **dítě**: ploché karty | `kid.js` | N5 | kap. 1 | P1 |
| – | auta, vlak, okna, žárovky, antény s červeným světlem, prádlo, praporky, větrníky, ptáci | `life3d`, `CYBER.life` | toon a obrysy, cyber barvy (okna `#ff9ed2`, světla `BEACON`) | převést na papírové modely z katalogu (prádlo 13, praporky 10, anténa 12, auto 17, vlak 25, hejno 37) a barvy `PAPIR.life`. Okna, která se rozsvítí za vlaštovkou, jen teplé sklo `PAPER_WARM` (bible 4) | P2 |
| – | drony s balíčkem, robot Bolts, otočná reklama (FOLD & FLY, NOODLES 24H) | `life3d` | čistý cyber (neon, reklamy), bible je nemá | **škrtnout** ze scény. Hlášky Bolts zvážit v UI (product-designer) | P1 |
| – | holub „Cyber Pigeon“ v `life3d` | skrytý (`comp = null`), kreslí ho `companion3d` | mrtvý kód | smazat z `life3d` | P2 |

### 3.2 Pořadí (pro game-deva)
1. **P0 (hned, malé, dávka H0):** v papíru nevytvářet cyber kouř komínů a lokomotivy ani růžové mraky `life3d`. Je to podmínka v `createLife` a v `update`, nic nového se nekreslí. Test: `tests/render3d-living-colors.test.js` dnes hlídá `CYBER.steam`, upravit.
2. **P1:** škrtnout drony, robota a reklamu v papíru. Lidé a komíny z papírových modelů. Balón z katalogu mimo pás výhledu.
3. **P2:** zbytek života (auta, vlak, prádlo, praporky, okna, ptáci) na papírové modely. Zároveň zmizí poslední `toon` a obrysy ve scéně. Tím se uzavře rozpor „Co bible ani prototyp nemají, zůstává z CYBER“ (`palette.js` ř. 99).
4. **Papírový kouř:** samostatná dávka H5 (kap. 3.3), jde hned po H0.

### 3.3 Papírový kouř (dávka H5)

> **Rozhodnuto 15. 10. 2026 (06 bod 14): papírový kouř**, varianta B z otázky v kap. 7: malé průsvitné papírové obláčky, jen daleko od místa odhodu. Cyber kouř `life3d` pryč (H0 platí). Náčrt `img/hratelnost/kour-papir.png` (1 dnes × 2 návrh při letu 120 m, 3 telefon na šířku, 4 detail velikosti proti vlaštovce, 5 míření bez kouře).

**Proč takhle (P1, P2, P3):** kouř říká „je ráno, topí se, tady se bydlí“ (katalog karta 4), ale nesmí soupeřit s vlaštovkou ani stát za dítětem. Proto je plochý (papírový výstřižek jako všechno v diorámatu), krémový (ne bílý, bílá patří vlaštovce), poloprůhledný, malý a jen tam, kam se hráč dívá za letu, ne při míření.

| | Hodnota | Proč / kontrola |
|---|---|---|
| **Tvar** | plochý **kotouč o 8 stěnách** (6 △), čelem ke kameře (rovina xy, jako karty města), každý obláček natočený o pevný náhodný úhel 0–π (seed z x komínu a indexu obláčku), aby osmiúhelníky nebyly stejné. Bez obrysu, bez řezané hrany, bez vláken. | P2: výstřižek z papíru. Koule a ikosaedry (dnes) jsou 3D hmota, ne papír. |
| **Barva** | `PAPIR.steam` = `PT.cream #fbf6ec` (klíč už existuje, čte ho `companion3d`). Nikdy `#ffffff`. Opar podle hloubky jako vrstva, ve které komín stojí (bible kap. 4). | P1: bílá + grafit jen vlaštovka. Krém × nebe 1,2–1,5 : 1, × fasády středu 1,4–1,6 : 1 (z hex): kouř je vidět jako světlejší skvrna, ne jako hrana. |
| **Průhlednost** | alfa **0,5** konstantní (bible: ≤ 0,6), `transparent`, `depthWrite: false`, `renderOrder 0` (pod stopou 1 a vlaštovkou 2). Vznik a zánik se dělá **velikostí**, ne alfou (instancovaný mesh má jednu alfu). | Stopa a vlaštovka se kreslí vždy přes kouř. |
| **Velikost** | ⌀ **0,8 m** při vzniku → **2,2 m** na konci života; nástup 0,25 s, zánik posledních 0,5 s (smoothstep velikosti k 0). | Za letu (120 m na 1280 px) ≤ 24 px, vlaštovka 83 px: **obláček je nejvýš ⅓ vlaštovky** na obrazovce. Na telefonu poměr stejný (obojí se škáluje se záběrem). |
| **Počet** | kouří **¼ komínů** (deterministicky: `hash(x komínu, seed místa) < 0,25`, ráno se netopí všude; katalog karta 4), **5 obláčků na komín**. Kapacita instancí 64 pro celé město. | Dnes v místech 1–2: 3 kouřící komíny z 16 (x 341, 431, 524 m), 15 obláčků. |
| **Kde** | jen komíny s **x ≥ `LAUNCH.hand.x` + 200 m** a jen ve vrstvách ulice a střed (z > −200 m), nikdy dálka. | Pás výhledu S-1 je 150 m, +50 m rezerva. Při oddálení po výhozu (1,2 s, záběr ~120 m kolem vlaštovky, která je < 40 m od ruky) kamera končí na x ≈ 170 m: **v úvodu, míření ani oddálení není vidět žádný kouř** (`kour-papir.png` 5). |
| **Kdy** | vždy, ve všech čtvrtích stejně (čtvrť 4 večer: stejný krém, opar ho ztlumí). Při zadržení dechu u události (`breath`) se kouř ztlumí s pozadím, pokud jde o stejný uniform; jinak zůstane (je malý a za vlaštovkou). | Jedno pravidlo bez výjimek. |
| **Pohyb** | stoupá **1,3 m/s**, unáší ho vítr **0,9 m/s ve směru praporku H5** (+x, po směru letu), vlnění ±0,15 m (`sin(1,7·věk + i)`); život **3,2 s**, 5 obláčků rozfázovaných o ⅕ života + fáze komínu (hash). Sloupek je ~4,5 m vysoký. Natočení obláčku se nemění. Poloha se počítá **„on twos“** (`onTwos(t)` z `life.js`, 12 kreseb/s). | Stop-motion papíru jako zbytek prostředí (bible kap. 7). Funkce `puff()` v `life.js` už to umí, mění se jen čísla (`life 3.2`, `windX .9`, stoupání 1,3 místo 1,9, poloměr 0,4 → 1,1 m). |
| **Reduced motion** | obláčky **stojí** (věk pevný podle indexu, sloupek 5 obláčků zamrzne), nemizí. | Bible kap. 7 „prostředí zamrzne“; kouř nenese informaci, nic se neztratí. |
| **Kvalita 0** (slabý telefon, bible kap. 5) | kouř vypnutý. | První věc, kterou jde ubrat. |
| **Rozpočet** | **1 draw call pro celé město** (jeden `InstancedMesh`, sdílený napříč místy jako dnes `life3d`), ≤ 64 × 6 = **384 △** (dnes by to bylo 90 △), matice jen pro aktuální místo ± 1, žádná alokace za snímek. | Rozpočet místa 15 tis. △ / 14 DC (render3d.md): +1 DC na čtvrť, ne na místo. |

**Pro game-deva (dávka H5):**
1. Čistá funkce v `life.js` (bez three.js): `smokeSources(chimneys, {fromX, share = .25, seed})` → komíny, které kouří (filtr x, podíl, deterministicky). Do dávky H4 bere `suburbLife().chimneys` (dnešní polohy, `y + h` = vršek komína). Po H4 bere vršky komínů z modelů domů (`parts.chimney`, karta 4), rozhraní se nemění.
2. `puff(i, n, t, life, phase, windX)` rozšířit o stoupání a velikost (nebo nová `paperPuff`), ať vrací `{dx, dy, s}` v metrech pro čísla z tabulky. Reduced: `t` pevné.
3. Ve vrstvě života papíru (dnes `life3d.js`, po H3 papírový modul života) jeden `InstancedMesh(CircleGeometry(1, 8), MeshBasicMaterial({color: PAPIR.steam, transparent: true, opacity: .5, depthWrite: false}))`, bez stínu, bez obrysu, opar jako vrstva (nebo `paperMaterial` s alfou, rozhodne game-dev podle toho, co je levnější).
4. **Testy** (`tests/`): `smokeSources` nevrátí komín s x < `LAUNCH.hand.x` + 200; podíl na 400 komínech 0,25 ± 0,05; deterministické pro stejný seed; poloměr obláčku ≤ 1,1 m; barva `PAPIR.steam` ≠ `#ffffff`; alfa ≤ 0,6; reduced → poloha nezávislá na `t`. `tests/render3d-living-colors.test.js` přestane hlídat `CYBER.steam` (už v H0).
5. **Ověření:** art-review snímky letu nad místy 1 a 2 na 1280 × 800, 932 × 430, 375 × 667; test v šedi na 25 % (vlaštovka první); úvod a míření bez kouře; `perf-check` (+1 DC).


---

## 4. Jediný styl (N7): co znamená odstranit cyber pro vzhled

Rozhodnutí 06 bod 1: jediný styl je Papírové město. Co uživatel viděl: odkaz **„JUST THROW IT / NEON CITY“** vlevo nahoře (`index.html` ř. 4, `href="./"`) načte stránku bez `?styl=papir`, a hra se tak vrátí do výchozího cyber stylu (`ui.js` ř. 38). Pravděpodobná příčina, v prohlížeči neověřeno.

### 4.1 Seznam pro game-deva (vzhled; UI rozložení řeší product-designer podle N8)
| Oblast | Dnes | Po změně |
|---|---|---|
| Přepnutí | `ui.js` `STYLE = ?styl=papir ? 'papir' : 'cyber'`, `body[data-styl]` | papír vždy, parametr `?styl` ignorovat (nebo nechat jen pro ladění do smazání cyber), `theme-color` = `desk` |
| Značka | `brand.sub` = „NEON CITY“ (EN i CS), odkaz `./` | podtitul bez „neon“ (text vlastní product-designer, i18n EN + CS), odkaz nesmí měnit styl |
| Texty s „neon“ | `meta.title`, úvodní věty („Cut through the night… to the neon core“), Atlas („neon city“, `atlas-content.js`), názvy čtvrtí | projít s product-designerem, názvy čtvrtí platí sada C (bible kap. 12) |
| Paleta | `palette.js`: `CYBER`, `palette(id)` vrací pro neznámé id cyber, `PAPIR` přebírá `...CYBER.life`, `car`, `rail` | výchozí a jediná `PAPIR`, vlastní klíče bez spreadu z `CYBER`. `CYBER` smazat, až ho nic nečte |
| Materiály a post-proces | `toon.js` (rampy, obrysy), `comic.js` (půltón, posterizace), `mood.js` (cyber nálady, neon) | v papíru se nepoužívají (bible kap. 15); smazat, až nic nečte (kromě razítkového obrysu vlaštovky `stampOutlineMaterial` – přesunout do `plane.js` nebo `paper.js`) |
| Město | `city.js` + `districts/*.js` (cyber toon) vs `paper.js` + `paper-cards.js` | jen papír |
| Život | `life.js`, `life3d.js` | kap. 3 |
| Dílna | `workshop.js` (stará Dílna PAPER LAB, `CYBER.workshop`, obrysy 2,5 / 1,7) | nahrazena místem odhodu G2b, smazat |
| Kamera a pózy | `pose.js` `HAND` 16 m a `REST.pitch` 6° pro cyber, `frame.launchLift` (převod 16 → 12 m) | jen `PAPER_HAND` (12 m) a `AIM_SHOT`, převod výhozu není potřeba |
| Vlaštovka | `plane.js` cyber větev (magenta a azurový přehyb) | jen papír (bible kap. 17) |
| UI styly | `style.css`: výchozí tmavé tokeny Atlasu (indigo), papír jen pod `body[data-styl=papir]` (~100 pravidel) | papírové tokeny na `:root`, tmavé smazat. `color-scheme: light`, `meta theme-color` v `index.html` |
| 2D záloha | `render.js` + `themes.js` (cyber pixel, paper collage, blueprint, dusk), `?render=2d` | **neměnit bez rozhodnutí**: CLAUDE.md drží 2D zálohu do fáze f plánu 3D. Je to jen záloha, hráč ji nevidí |
| Prototypy | `prototype/3d/`, `prototype/styly/` (srovnání 5 směrů), `prototype/atlas/art.js`, `prototype/menu/` | `prototype/3d/` se maže ve fázi g (render3d.md). Srovnání směrů zachovat jako archiv. Atlas a menu převést na papírové tokeny, až se budou dál používat |
| Hudba | `src/music/a-neon-glide.js` aj. | mimo vzhled, nerozhoduji (jen jméno skladby) |
| Testy | `render3d-living-colors`, `render3d-palette`, `render3d-mood`, `render3d-ink`, `themes` aj. čtou `CYBER` | upravit s mazáním, ne předem |

### 4.2 Dokumenty
- Bible `05-styl-papir.md`: hlavička „pro styl `?styl=papir`; do přepnutí celé hry platí 02 pro výchozí styl“ → „jediný styl hry“. Kap. 15 „Co se ruší“ doplnit o `life3d` cyber, drony, robota, reklamy a kouř.
- `02-styl.md` a `03-styl-implementace.md`: označit „archiv, neplatí“ (nemazat, jsou v nich zdůvodnění převzatých pravidel S1 a S4).
- `docs/architektura.md` (styly): přepsat po implementaci (game-dev).

---

## 5. Rozpory kód × bible (návrh, co platí)
| # | Kód | Bible / katalog | Návrh |
|---|---|---|---|
| R-H1 | `life.js`, `life3d.js` čtou `CYBER.life` i v papíru | bible kap. 3 a 15: žádné obrysy, toon ani neon; katalog karty 4, 7, 35–37 | platí bible, kap. 3 |
| R-H2 | lidé 2,0 m (`PS 1,3`) | M-1: člověk 1,7 m, dítě 1,2 m | platí bible (už zapsáno jako R2 v katalogu) |
| R-H3 | kouř `CYBER.steam`, 3–7 m, neprůhledný, i za dítětem | S-6 (upraveno 15. 10.): papírový kouř jen ≥ 200 m od ruky, krém, alfa 0,5, ≤ ⅓ vlaštovky | **rozhodnuto (06 bod 14):** cyber kouř pryč (H0), papírový kouř H5 (kap. 3.3) |
| R-H4 | hra začíná záběrem míření 16 m | bible 9.2: menu 28 m je ustavující záběr | **rozhodnuto (06 bod 15):** úvodní záběr 30 m (kap. 2), dávka H1 |
| R-H5 | dítě z plochých karet (`kid.js`), strop `[80, 20, 0]` | bible 9.4 (upraveno 15. 10.): oblá figurka C, 630 △ | **rozhodnuto (06 bod 13):** varianta C (kap. 1), dávka H2; katalog karta H1 a souhrn G2b upravit (kap. 1.8) |

## 6. Dávky pro game-deva

Pozor na jména: **dávky H0–H5** (tady) nejsou **karty H1–H6** katalogu 11 (modely místa odhodu). Dávka H2 mění kartu H1 `kid`.

| Dávka | Stav | Obsah | Závisí na |
|---|---|---|---|
| **H0** | připraveno (06 bod 14) | cyber kouř a růžové mraky z `life3d` v papíru pryč; drony, robot, reklama v papíru pryč. Bez nového kreslení (kap. 3.2 bod 1). | – |
| **H1 Úvodní záběr** | **připraveno (06 bod 15)** | viz níže | – |
| **H2 Postavička C** | **připraveno (06 bod 13)** | viz níže | – (H1 a H2 jdou souběžně, sdílí jen pózu klid) |
| **H3 Jediný styl** | návrh | kap. 4.1 (přepínač, značka, palety, CSS tokeny, mazání cyber modulů) s product-designerem (N8) | – |
| **H4 Život čtvrti v papíru** | návrh | P1 a P2 z kap. 3.2 (lidé, komíny, balóny, prádlo, auta, vlak, okna) | H0 |
| **H5 Papírový kouř** | **připraveno (06 bod 14)** | kap. 3.3 | H0 |

### H1 Úvodní záběr (kap. 2)
- **Soubory:** `models/launch-site.js` (`INTRO_SHOT`, kap. 2.2), režisér kamery (`pose.js` / `frame.js`, podle toho, kde dnes žije `AIM_SHOT`), stav hry „úvod“ (`ui.js` / `main.js`), texty `src/locales/` (EN + CS, klíče a znění od product-designera).
- **Chování:** úvod po načtení a po zavření Dílny, Atlasu nebo menu; první stisk (pointerdown, mezerník, Enter) spustí jízdu 600 ms do `AIM_SHOT` a zároveň nabíjení (vstup se přijímá hned); „Hodit znovu“ jde rovnou do míření. Jízda: šířka logaritmicky 30 → 16 m, kotva ruky lineárně, sklon +2° → −8°, ease in-out (kap. 2.3). Nápis nahoře v nebi, s prvním stiskem zmizí za 0,2 s (kap. 2.2).
- **Dítě:** do H2 ploché dítě ve fázi `rest`, po H2 póza klid (kap. 1.7).
- **Reduced motion a Calm camera:** střih místo jízdy, nápis zmizí hned, dítě nedýchá.
- **Testy:** `INTRO_SHOT` promítne ruku na `at` (desktop, na šířku, na výšku) ± 1 %; funkce průběhu jízdy je čistá (`u` → šířka, kotva, sklon) a v `u = 0 / 1` dává úvod / míření; reduced → hned `u = 1`; „Hodit znovu“ úvod přeskočí; nápis má klíče v EN i CS.
- **Ověření:** art-review 375 × 667, 932 × 430, 1280 × 800 (úvod, polovina jízdy, míření); nápis nezakrývá dítě ani vlaštovku; `perf-check` úvodu.

### H2 Postavička C (kap. 1)
- **Soubory:** `models/kid.js` (díly tab. 1.3, LOD H a 1, statické pózy pro katalog), `models/kid-rig.js` (kostra 1.4, pózy 1.7, normály, dva LOD v jednom bufferu), `models/parts.js` (nový díl `lathe`), `paper.js` (`kidMaterial`, kap. 1.5), `workshop.js` (materiál dítěte, `setDrawRange` podle LOD, `depthTest` vlaštovky při držení), `pose.js` jen pokud je potřeba rozlišit klid × u stolu.
- **Kontrolní body:** LOD H 630 △ a LOD 1 130 △ (± 5 %); 1 draw call dítě + praporek; dlaň ruky T v míření přesně v `LAUNCH.hand`; obličej (oči) vidět v míření na 96 i 64 px; vlaštovku v ruce nic nezakryje; žádný obrys; žádná alokace za snímek.
- **Testy:** strop `tris` `[760, 160, 0]` (`buildModel('kid', lod)`); v míření |dlaň T − `LAUNCH.hand`| < 1 mm; při `charge` 0 → 1 |dlaň T − vlaštovka| ≤ 0,05 m a chodidla se hýbou jen o `back`; normály po `poseKid` mají délku 1 a míří ven z dílu; `poseKid` s `reduced` nezávisí na čase; barvy jen z tokenů (bible 9.4); `poseKid` nealokuje (stejné pole na výstupu).
- **Katalog:** karta H1 a souhrn G2b podle kap. 1.8 (strop G2b ≤ 1 400 △), stránka `prototype-katalog.html` ukáže 7 póz.
- **Ověření:** art-review 375 × 667, 932 × 430, 1280 × 800: míření, nabíjení, výhoz, mávání, úvod (LOD H i LOD 1); snímek v šedi na 25 % (vlaštovka první, dítě druhé); `perf-check` místa 0.

### H5 Papírový kouř (kap. 3.3)
Celé zadání včetně testů je v kap. 3.3. Jde hned po H0, nečeká na H4 (do té doby bere polohy komínů ze `suburbLife`).

---

## 7. Otázky pro uživatele

Všechny tři otázky jsou rozhodnuté (06, „Plán hratelnosti, odpovědi na otázky“, 15. 10. 2026). Původní znění pro dohledání:

- ~~Jakou podobu má mít hlavní postavička? (A) skládaná loutka, (B) plochá s tloušťkou, (C) oblá figurka s mnoha stěnami. Doporučeno A.~~ **Rozhodnuto C** (bod 13), kap. 1.
- ~~Smí v papírovém městě zůstat kouř z komínů? (A) úplně pryč, (B) malé průsvitné papírové obláčky jen daleko od místa odhodu, (C) jako dnes. Doporučeno A.~~ **Rozhodnuto B** (bod 14), kap. 3.3.
- ~~Co má hra ukázat jako první? (A) úvodní záběr na dům s dílnou a nápisem „Throw it“ v nebi, (B) úvod se sám po 2 s přiblíží, (C) jako dnes. Doporučeno A.~~ **Rozhodnuto A, nápis „Throw it“ nahoře v nebi nad hřebenem** (bod 15), kap. 2.

Nové otázky pro uživatele z této úpravy nejsou.

## 8. Ověření
- Náčrty: Node, kamera a rozložení města jako ve hře (`geometry.cityChunk`, `follow`, fov 20°), koncept 2 místa odhodu převzatý ze `start/start.mjs`. Trojúhelníky postaviček jsou spočtené generátorem náčrtu (C ve hře: 630 / 130 △ přesně podle tab. 1.3, bez víček, která náčrt měl navíc).
- Kouř (15. 10.): komíny v náčrtu jsou z `cityChunk` podle stejného pravidla jako `city()` náčrtu (každý 3. dům ulice), ne ze `suburbLife`; počet kouřících komínů ve hře se proto může lišit. Poměr velikosti obláček × vlaštovka a „žádný kouř při míření“ platí bez ohledu na to.
- Kontrasty: z hex hodnot (WCAG), ne z pixelů hry.
- **NOT ASSESSED:** vzhled ve hře včetně postavičky C a kouře (prohlížeč jsem nepoužil), skutečné stínování `kidMaterial` (náčrt používá stejnou rampu, ale ne shader hry), výkon (draw calls, čas snímku), čitelnost na skutečném telefonu, správnost příčiny „NEON CITY“ (vyčteno z kódu).
