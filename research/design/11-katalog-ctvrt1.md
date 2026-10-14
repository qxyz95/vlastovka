# Katalog modelů, čtvrť 1 „Střechy za úsvitu“: karty objektů (K2)

> **Schváleno 14. 10. 2026 (dominanty a), drobnosti (a), praporky (a); viz 06-rozhodnuti.md.** Napsal art-director 14. 10. 2026 jako zadání pro game-deva (krok K3 v `10-katalog-modelu.md`). Závazné podklady: bible `05-styl-papir.md` (schválená), stíny `08-stiny.md` a rozhodnutí v `research/bonusy/06-rozhodnuti.md` (blok „Stíny, přechody a modely“: modely v kódu, **hodně detailu všude**, rozpočty na místo dál platí). Prohlížeč jsem nepoužil (okno sdílí uživatel), **vzhled v záběru hry je NOT ASSESSED**. Čísla rozložení jsou změřená z kódu (`cityChunk`, `placeCards`, `lifeCards`, `suburbLife`), trojúhelníky nových modelů jsou **odhad** podle vzorců v kap. 1.3.

> **Doplněno 14. 10. 2026 podle rozhodnutí uživatele** (06, „Začátek hodu, místo odhodu a kamera“ a „Odemykatelný obsah“): jedno měřítko i pro dítě a místo odhodu (kap. 1.1, 1.2), karta 5 `workshop` nahrazena skupinou **G2b Místo odhodu** (karty H1–H6, kap. 3.7, rozpočet kap. 4), nová skupina **V Vlaštovky** (karty siluet V1–V5, kap. 3.8). Pravidla: bible 05 kap. 3.1, 9 a 17.

Skici: `img/katalog/meritko.svg` (všechny hlavní objekty vedle sebe v jednom měřítku) a `img/katalog/dum-radovy-lod.svg` (řadový dům v LOD 0, 1 a 2).

**Navazuje na K1** (`src/render3d/models/`: `index.js` registr, `scale.js`, `parts.js` díly `block`, `gableRoof`, `cornice`, `windowCut`, `door`, `balcony`, `chimney`, `downpipe`, `oculus`; vzor `house-row.js`). Karty používají jména dílů z `parts.js`; co chybí, je v kap. 1.3 jako **nový díl** pro game-deva. **Nejdůležitější zjištění rozpočtu je v kap. 4.0:** dnešní díly kreslí každý lem a parapet jako plný kvádr (8 △), proto má `house-row` 245–773 △ a 28 domů trhu by samo zabralo ~12,7 tis. △. Navrhuji „ploché“ varianty dílů (kap. 1.3), které stejný vzhled nakreslí za ~40 % trojúhelníků.

---

## 1. Společná pravidla pro všechny karty

### 1.1 Měřítko (jedno pro celý svět)
| Míra | Hodnota | Poznámka |
|---|---|---|
| patro | 3,0 m | |
| přízemí | 3,0 m (jako `house-row`), 3,5 m jen u hal, nádraží a domu dítěte (H2) | |
| okno | 1,2 × 1,4 m, parapet 0,9 m nad podlahou patra | |
| dveře | 1,1 × 2,2 m, schod 0,2 m | |
| člověk | 1,7 m | dnes `lifeCards` 2,0 m (trup 1,3 + hlava nad ním), rozpor R2 |
| **dítě** | **1,2 m** (`person` × 0,7) | schváleno 14. 10. (M-1); dnes `workshop.js` 47 px × `S = 0,25` = 11,75 m, rozpor R-S1 |
| zábradlí | 0,95 m, madlo + sloupky po 0,5 m | pavlač H4 |
| ruka dítěte (výhoz) | 12 m nad zemí, podlaha pavlače 10,6 m | M-3, výška výhozu fyziky; dnes `HAND` 16 m, rozpor R-S7 |
| vlaštovka | za letu 7,75 m (+15 % na úzké scéně), **v ruce 0,5 m**, při oddálení plynule roste | jediná výjimka, řídí se obrazovkou (bible 05 kap. 3.1, M-2) |
| výška domu | `patra · 3` (+ střecha), jako `house-row` | dnes `cityChunk` dává výšky spojitě (8–22 m), rozpor R1 |
| osa okna | 2,4 m, okraj fasády 0,7 m (`house-row` `BAY`, `MARGIN`) | šířka domu = `osy · 2,4 + 1,4` |

### 1.2 Kolik detailu je vůbec vidět (pixely na metr)
Odhad z geometrie kamery (fov 20°, šířka záběru za letu ~170 m odvozená z velikosti vlaštovky 58 px na desktopu a 21 px na telefonu z bible 05 kap. 3). **Neměřeno v pixelech**, ověří K1 přepínačem „v záběru hry“.

| Vrstva (z přední hrany) | desktop 1280 | telefon 375 | Nejmenší detail (≥ 2 px na desktopu) | LOD |
|---|---|---|---|---|
| ulice (−17 až −26 m) | ~6,9 px/m | ~2,5 px/m | 0,3 m | **LOD 0** |
| střed (−97 až −110 m) | ~5,3 px/m | ~1,9 px/m | 0,4 m | **LOD 1** |
| dálka (−350 až −380 m) | ~3,1 px/m | ~1,1 px/m | 0,7 m | **LOD 2** |
| ~~Dílna v klidovém záběru~~ | ~~~5 px/m (šířka 244 m)~~ | | | zrušeno 14. 10. (R-S2) |
| **místo odhodu při míření** (polodetail 16 m, telefon na výšku 7 m) | **80 px/m** | **54 px/m** | **0,03 m** | **LOD H** (hrdina, M-4): rámy, kliky, tužky, řez papíru |
| ulice do ~150 m od startu při míření | ~42 px/m | ~28 px/m (odvozeno poměrem 54/80) | 0,05 m | plný LOD 0 včetně rámů a parapetů (`windowCut`) |
| místo odhodu v menu (šířka 25–43 m) | 30–50 px/m | NOT ASSESSED (šířka menu na telefonu dává 07-menu) | 0,05 m | LOD H |

Z toho plyne: **„hodně detailu všude“ znamená různý druh detailu podle vrstvy**, ne stejné drobnosti všude. Rám okna 0,15 m je i na desktopu pod 1 px, proto se nemodeluje. Ve středu je okno 1,2 × 1,4 m pořád 6 × 7 px, takže okna tam patří. V dálce nese detail **členitá silueta** (štíty, komíny, věžičky, nádrže), ne okna.

Pravidla:
- **D-1** Žádný prvek tenčí než nejmenší detail vrstvy (tabulka výše). Tenké věci (provázek, šňůra, kolejnice) mají aspoň 0,06 m a kreslí se jako jedna linka bez bočních stěn.
- **D-2** Detail ve středu a dálce je **tónový**: odstín stěny (`mix` ≤ 0,35 k řezu nebo k boku), ne kontrastní barva. Hloubku dál dělá opar (P3), čitelnost vlaštovky má přednost (P1).
- **D-3** Detail, který zakrývá jiný objekt (přízemí za stánky, pata domu za živým plotem), generátor vynechá a použije LOD 1 té části.
- **D-4** Kvalita 0 (slabý telefon, bible 05 kap. 5) posune ulici a střed o jeden LOD hrubší. Silueta se nemění.

### 1.3 Stavebnice: díly K1 a co v nich změnit
Modely se skládají z karet ve formátu `paper-cards` (`cardVertices`: čelo, horní řez, 2 boky; bez zad a dna). Díly z `src/render3d/models/parts.js` dnes skládají **každý detail z plného kvádru `block` (8 △)**, i lem okna hluboký 7 cm nebo sloupek zábradlí 4 cm. Boky takové karty jsou na ulici široké 0,05–1 px (kap. 1.2), takže je nikdo nevidí, ale stojí 6 △ z 8.

**Návrh pro game-deva (K3, bez změny vzhledu):** dvě nové hodnoty tvaru karty v `paper-cards.js` (`cardVertices` a `cardTriangles`) a jejich použití v `parts.js`:

| Tvar karty | Co kreslí | △ | Použít pro (`part`) |
|---|---|---|---|
| `box` (dnes) | čelo, horní řez, 2 boky | 8 | tělo domu, komín, stánek, kmen, kvádry hlubší než 0,3 m |
| **`panel`** (nový) | jen čelo | 2 | `window` (tabulka), `frame`, `door`, `shutter`, `downpipe`, `oculus`, cedule, prádlo, zábradlí jako jedna karta |
| **`lista`** (nový) | čelo + horní řez (světlá hrana papíru zůstane) | 4 | `sill`, `cornice`, `stringcourse`, `plinth`, `step`, `canopy`, `flowerbox`, `lintel`, deska `balcony`, pult |
| `gable` (dnes) | štít + 2 plochy + 2 lemy okapu | 9 | `gableRoof` |
| `pyr` (dnes) | jehlan | 5 | věžička, stříška |
| `disc` s `d ≤ 0,1` | **jen čelo** (n △ místo 3n) | n | `flower`, `oculus`, hlava, kolo, jablko |
| `disc` (dnes) | čelo + hrana | 3n | koruna stromu, balón, mrak |
| `flag` (dnes) | trojúhelník | 1 | praporek, lambrekýn, květ |

Pravidlo v `cardVertices`: `box` s `d ≤ 0,15 m` se automaticky kreslí jako `panel` (nebo `lista`, když `part` je v seznamu výše). Tak se nemusí měnit každý díl zvlášť.

**Změřeno na `house-row` (K1, všech 30 variant, `cardTriangles`):**

| LOD | dnes (min–max, průměr) | s `panel` / `lista` | úspora |
|---|---|---|---|
| 0 | 245–773, ⌀ 488 | 111–285, ⌀ 189 | −61 % |
| 1 | 57–121, ⌀ 85 | 33–49, ⌀ 40 | −53 % |
| 2 | 25 | 25 (návrh níže 13) | |

Dnes na výchozí variantě (3 patra, 3 osy) nejvíc stojí sloupky zábradlí (72 △), rámy oken (72), příčky (64), parapety (64), tabulky (56), kytky (36) a kulaté okénko (36).

**Další úpravy dílů podle pravidla D-1** (detail pod ~1 px nekreslit):
- `windowCut`: příčka 0,06 m (0,4 px na desktopu) v LOD 0 vynechat; ponechat jen v LOD H místa odhodu (G2b, záběr míření 80 px/m).
- `door`: klika 0,1 m (bod pod 1 px) vynechat.
- `balcony`: sloupky 0,04 m → zábradlí jako **jedna karta `panel`** v barvě zábradlí s výškou 0,95 m + madlo `lista` (papírový výřez místo prutů). Z 72 △ na 6.
- `downpipe`: šířku zvětšit z 0,12 na 0,2 m (dlouhá svislá linka, čte se), tvar `panel`.
- `chimney`: OK (8 + 4 + 8). V LOD 2 jen tělo jako `lista` (4).
- `gableRoof` v LOD 2: bez lemů okapu (5 △ místo 9).

**Nové díly** (karty v kap. 3 na ně odkazují):

| Díl | Co | △ LOD 0 / 1 |
|---|---|---|
| `eaveRoof` | střecha okapem ke kameře (2 sklony + 2 boční štíty), varianta pultová | 6 / 6 |
| `steppedGable` | čelo se stupňovitým nebo zvonovým štítem (jedna vystřižená karta) | 6–12 / 6 |
| `dormer` | vikýř: `box` + malý `gableRoof` + `windowCut` | 21 / 5 |
| `shopfront` | výloha (`panel` rám + `panel` sklo) + markýza (`lista` + lambrekýn z `flag`) + vývěsní štít (`lista`) | 17 / 4 |
| `awning` | pruhovaná markýza stánku (střídané `panel`) s lambrekýnem | 12–21 / 4 |
| `plate` | kotouč jen čelem (`disc` s `d ≤ 0,1`) | n |
| `cylinderSide` | válec viděný z boku: `box` + 2 půlkotouče po stranách (nádrž, sud, kotel) | 16 / 8 |
| `truss` | příhradová karta: pásy a diagonály jako `lista` | 4 na prut |

**Stínový proxy:** maska stínů na zem (`08-stiny.md` kap. 6) nepotřebuje detail, jen tvar. Navrhuji, aby registr modelu měl k `lod:[…]` ještě `shadow(params)` = obrys z karet `panel` (stěna + štít + komín, **≤ 7 △**). Generátor ho sloučí do jedné geometrie masky na místo. Bez toho by maska kreslila LOD 2 (25 △ na dům) a na trhu by stála ~2 tis. △.

Model je funkce `(params, lod) → karty` v souřadnicích `parts.js` (x na střed, y = 0 zem, čelo v z = 0), hloubka karty `CARD_DEPTH` podle vrstvy.

### 1.4 Barvy
Jen z palety `PAPIR` (`src/render3d/palette.js`): tokeny `PAPER_TOKENS` (zkratka `PT`), karty čtvrti 1 `PAPIR.city.districts[0]` (zkratka `D1`: `near`, `mid`, `far`, `roof`, `trees`, `trunk`, `window`, `hedge`, `glass`, `glassRoof`, `ground`), život `PAPIR.life` (`life.*`). Odvozené barvy detailu jsou **funkce `tones(wall)` v `parts.js`** (K1) a platí pro všechny modely; nové hexy nevznikají:

| Detail | `tones` | Vzorec | Příklad na `#e8735a` |
|---|---|---|---|
| rám okna, zárubeň (světlá karta pod výřezem) | `frame` | `mix(stěna, city.cut #fffaf0, .55)` | ~`#f5bba9` |
| římsa, kordon, parapet | `trim` | `mix(stěna, city.cut, .3)` | `#ef9c87` |
| výřez okna (tmavý) | `pane` | `mix(stěna, D1.window #3d4f7a, .6)` | `#815d6d` |
| dveře | `door` | `mix(stěna, D1.window, .75)` | `#685872` |
| sokl | `plinth` | `mix(stěna, city.side #5b4f7a, .25)` | ~`#c56a65` |
| okapová roura, stín pod římsou | `shade` | `mix(stěna, city.side, .45)` | |
| okenice, markýza, truhlík | — | jiná barva z `D1.near` než stěna (jako `house-row`) | `#9cc3a6` |

Zakázáno na objektech: `PT.mustard #e2a43a` („hořčicová jen hodnota“, bez výjimky: pláštěnka dítěte je od 14. 10. `#f2b65a`, bible kap. 9.4), grafit `PT.graphite` výš než 8 m nad zemí (P1), bílá `PT.paper` (patří vlaštovce).

### 1.5 Varianty (aby město nebylo z kopií)
- Každý model má **seed** ze světového x (jako dnes `hash`), takže místo je pořád stejné (determinismus).
- **V-1** Dva sousední objekty stejného typu se liší aspoň ve **2 ze 4**: výška, barva stěny, typ střechy, typ přízemí.
- **V-2** Stejná kombinace (typ + barva + střecha + výška) se v jednom místě opakuje nejvýš 2×.
- **V-3** Varianty jsou parametry jednoho modelu, ne kopie souborů.

---

## 2. Seznam objektů

| # | id | Objekt | Vrstva | Místa | Skupina K3 |
|---|---|---|---|---|---|
| 1 | `house-row` | řadový městský dům | ulice, střed | 1, 2, 4 | G1 |
| 2 | `house-gable` | úzký dům se štítem do ulice | ulice, střed | 1, 2 | G1 |
| 3 | `far-skyline` | vzdálené město (blok siluet) | dálka | 1–4 | G1 |
| 4 | `chimney` | komín s kouřem | střecha | 1–4 | G1 |
| 5 | ~~`workshop`~~ | ~~Dílna PAPER LAB~~ → **nahrazeno H1–H6** (14. 10.) | | | ~~G2~~ |
| 6 | `corner-turret` | nárožní dům s věžičkou (dominanta 1) | ulice | 1 | G2 |
| 7 | `person` | člověk, 3 postoje | ulice, střecha | 1–4 | G2 |
| 8 | `street-lamp` | pouliční lampa | chodník | 1–4 | G2 |
| 9 | `stall` | stánek trhu (trojice pod markýzou) | ulice | 2 | G3 |
| 10 | `bunting` | girlanda s praporky | ulice | 2 | G3 |
| 11 | `market-hall` | tržní hala s lucernou (dominanta 2) | ulice | 2 | G3 |
| 12 | `antenna` | televizní anténa | střecha | 2 | G3 |
| 13 | `laundry` | šňůra s prádlem | fasáda | 1, 2 | G3 |
| 14 | `tree-round` | listnatý strom | ulice, střed | 1–4 | G4 |
| 15 | `tree-poplar` | topol / štíhlý strom | ulice, střed | 3, 4 | G4 |
| 16 | `hedge-fence` | živý plot a laťkový plot | ulice | 3, 4 | G4 |
| 17 | `car` | auto (hatchback, dodávka) | silnice | 1–4 | G4 |
| 18 | `cottage` | rodinný domek se zahradou | ulice, střed | 3 | G4 |
| 19 | `greenhouse` | skleník (dominanta 3) | ulice | 3 | G5 |
| 20 | `pinwheel` | zahradní větrník | ulice | 3 | G5 |
| 21 | `garden-shed` | zahradní kůlna | ulice | 3 | G5 |
| 22 | `garden-bed` | záhon, truhlík, keř | ulice | 1–3 | G5 |
| 23 | `bench` | lavička | chodník | 1–3 | G5 |
| 24 | `track` | trať: lože, pražce, koleje | ulice | 4 | G6 |
| 25 | `train` | parní lokomotiva a vagony | ulice | 4 | G6 |
| 26 | `platform` | nástupiště s přístřeškem | ulice | 4 | G6 |
| 27 | `station` | nádražní budova | ulice | 4 | G6 |
| 28 | `water-tower` | železniční vodárna (dominanta 4) | ulice | 4 | G6 |
| 29 | `rail-shed` | skladiště a dílna u trati | ulice | 4 | G6 |
| 30 | `tunnel-hill` | kopec s portálem tunelu | ulice | 3/4 | G7 |
| 31 | `rail-bridge` | železniční most přes kanál (brána 1 → 2) | ulice | 4/5 | G7 |
| 32 | `roof-tank` | vodní nádrž na střeše | střecha | 1, 2 | G7 |
| 33 | `street-kit` | drobnosti ulice (schránka, popelnice, cedule, hydrant) | chodník | 1, 2, 4 | G7 |
| 34 | `signal` | železniční návěstidlo | ulice | 4 | G7 |
| 35 | `balloon` | horkovzdušný balón | nebe | čtvrť | G7 |
| 36 | `cloud` | mrak ze tří kotoučů | nebe | čtvrť | G7 |
| 37 | `flock` | hejno ptáků | vzduch, střed | čtvrť | G7 |
| 38 | `pigeon` | origami holub (událost) | pás letu | události | G7 |
| H1 | `kid` | dítě, hrdina startu | místo odhodu (LOD H) | 1 | **G2b** |
| H2 | `workshop-attic` | dům dítěte s podkrovím v řezu | ulice (LOD H) | 1 | **G2b** |
| H3 | `workshop-interior` | dílna v podkroví (stůl, police, nástěnka) | ulice (LOD H) | 1 | **G2b** |
| H4 | `loft-balcony` | pavlač s půdními dveřmi | ulice (LOD H) | 1 | **G2b** |
| H5 | `hoist-beam` | trám s kladkou (hák Crane Lift, praporek větru) | ulice (LOD H) | 1 | **G2b** |
| H6 | `retaining-wall` | opěrná zeď se schody | ulice (LOD H) | 1 | **G2b** |
| V1–V5 | `plane-hawk`, `plane-kite`, `plane-skimmer`, `plane-sail`, `plane-needle` | nové vlaštovky za mince | hráč | všechna | **V** |

Vynechávám (do rozhodnutí product-designera, bible 05 kap. 12): dron s balíčkem, robot Bolts, reklamní billboard. Kostel a radnice z návrhu 10 kap. 5 nahrazuje dominanta podle místa (otázka v kap. 6).

---

## 3. Karty objektů

Formát: **předobraz a účel · kde a kolik · rozměry · papírová konstrukce · LOD 0 / 1 / 2 (△) · barvy · varianty · silueta v 25 % šedi**. Počty „kolik“ jsou z dnešního rozložení (`cityChunk` 0–3 a `suburbLife`).

### 3.1 Budovy

#### 1 `house-row` řadový městský dům (existuje v K1, úpravy)
- **Předobraz a účel:** řadové domy evropského města (Nyhavn, Vršovice, Gent v pastelech). Tvoří ulici a střed: objekt, který je v každém snímku letu nejvíc vidět.
- **Kde a kolik:** ulice místa 1 (18 bloků, w 9–16 m, h 8–21 m), místa 2 (29 bloků, w 6–10, h 6–14), místa 4 (5 z 11); střed všech míst (6–14 bloků, w 9–22 m, h 10–38 m).
- **Generátor (K5):** **jeden blok `cityChunk` = jeden dům**: `bays = clamp(round((w − 1,4) / 2,4), 2, 6)`, `floors = clamp(round(h / 3), 2, 7)` v ulici a `3–12` ve středu. Dva domy na blok by přidaly ~56 △ na každý další dům (štít, komín, sokl), bez přínosu.
- **Parametry (rozšířit K1):** `floors` 2–7 (ulice) / 3–12 (střed) (dnes 2–4), `bays` 2–6 (dnes 2–3), `color` 0–7, `roof` 0–2, `seed`; nové: `roofType` (`gable` štít ke kameře 70 % / `eave` okapem ke kameře / `flat` s atikou), `ground` (`flat` byt / `shop` výloha / `gate` průjezd), `dormers` 0–2.
- **Papír:** tělo je karta; okno je **podložený výřez** (`windowCut`: světlejší karta `frame` a na ní tmavá tabulka `pane`), římsa a kordon jsou přeložený proužek (`cornice` jako `lista`), střecha přeložená karta přes štít (`gableRoof`).
- **LOD 0 (ulice), díly:** `block` tělo, `gableRoof` / `eaveRoof`, `chimney`, sokl a `cornice` (`lista`), kordony mezi patry, `windowCut` (rám, tabulka, parapet; okenice u 60 %, truhlík u 30 % oken pater; bez příčky), `door` se stříškou (bez kliky), `balcony` (zábradlí jako jedna karta) u 60 % domů od 3 pater, `downpipe` 0,2 m, `oculus` ve štítu ≥ 2,4 m (n 6, jen čelo), nově `shopfront` v přízemí u ⅓ domů v místech 1 a 2, `dormer` 0–2 u `eave` střech.
  **△ s `panel` / `lista`:** 2 osy × 2 patra ≈ 128, 3 × 3 ≈ 211, 3 × 4 ≈ 256 (změřeno, kap. 1.3), bez příček a s plochým zábradlím o ~17 % méně. Hustota pro rozpočet: **≈ 56 + 1,6 △ na m² čela**.
- **LOD 1 (střed):** `block`, `gableRoof`, `chimney` bez hlavy, `door` jen křídlo, `windowCut` jen tabulka (`panel`, 2 △), `cornice` pod střechou. **≈ 25 + 0,28 △ na m² čela** (15 × 25 m ≈ 130; dnes ⌀ 85 pro malé varianty, s `panel` ⌀ 40).
- **LOD 2 (dálka, kvalita 0 ve středu):** tělo `lista` 4 + `gableRoof` bez lemů 5 + komín `lista` 4 = **13 △**. **Stín:** obrys `panel` ≤ 7 △.
- **Barvy:** stěna `D1.near` (ulice) / `D1.mid` (střed), střecha `D1.roof`, detail `tones(wall)` (kap. 1.4), okenice jiná barva z `D1.near`, výloha `D1.glass`.
- **Varianty:** 5 šířek × 6 výšek × 8 barev × 3 barvy střechy × 3 typy střechy × 3 přízemí + okenice, truhlíky, balkon, vikýře: tisíce kombinací; pravidla V-1 a V-2.
- **Silueta:** obdélník se štítem a komínem; poznat „dům“ do 1 s i bez oken.

#### 2 `house-gable` úzký dům se štítem do ulice
- **Předobraz a účel:** úzké štítové domy (Amsterdam, Lübeck, Telč). Rozbíjí linii řadovek, dává ulici rytmus a vysokou siluetu proti nebi.
- **Kde a kolik:** ~⅓ bloků ulice užších než 10 m v místech 1 a 2 (dnes trh 29 bloků w 6–10 m), ~⅕ středu.
- **Rozměry:** šířka 5–8 m (2 osy), přízemí + 2–4 patra, štít 4–6 m (stupňovitý nebo zvonový).
- **Papír:** čelo je **jedna vystřižená karta** se stupňovitým nebo zvonovým obrysem štítu (tvar jako výřez, ne kvádr + střecha), střecha za ní je vidět jen jako okraj.
- **LOD 0:** tělo 8, štít-výřez 6–10 (stupně jako `lista`), okna 12 (2 na patro + 1 v štítu), dveře 10, kladka pod vrcholem štítu (`lista` 4, předobraz: kladkový trám amsterdamských domů), sokl 4, kordon 4. **≈ 120–170 △.**
- **LOD 1:** tělo + štít 12, okna výřez 2. **≈ 40 △.**
- **LOD 2:** obrys štítu 8. **≈ 8 △.**
- **Barvy:** jako `house-row`; štít může mít světlejší lem `mix(stěna, cut, .3)`.
- **Varianty:** stupňovitý / zvonový / prostý trojúhelník; 2–4 patra; obchod v přízemí.
- **Silueta:** vysoký úzký obdélník se schodkovým vrcholem, nejčitelnější tvar čtvrti.

#### 3 `far-skyline` vzdálené město
- **Předobraz a účel:** panorama starého města za ranním oparem (Alto's Odyssey, bible P3). Dává hloubku a říká „město pokračuje“.
- **Kde a kolik:** dálka, 8–11 bloků na místo (w 12–34 m, výška dnes 15–61 m po × 0,42).
- **Rozměry:** blok se dělí na **2–4 budovy** různé výšky (rozdíl ≥ 3 m), na horní hraně 1–3 prvky siluety: štít, komín, věžička s jehlanem, nádrž, kopule (půl `disc`).
- **Papír:** jedna karta 12 m hluboká s vystřiženou členitou horní hranou.
- **LOD 2 (jediný, dálka):** 2–4 × lista 4 + střechy 2–4 × 9 + prvky siluety 3 × 5 = **≈ 40 △.**
- **LOD 1:** nepoužívá se (dálka je vždy LOD 2).
- **Barvy:** `D1.far` (3), střechy `mix(stěna, D1.roof[0], .25)` (jako dnes), žádná okna (bible kap. 3).
- **Varianty:** počet budov, pořadí výšek, prvek siluety; dvě sousední „věže“ nikdy stejně vysoké.
- **Silueta:** členitá horní hrana; kontrast proti nebi < 1,5 : 1 (bible kap. 6.4), proto **detail jen tvarem**.

#### 5 ~~`workshop` Dílna PAPER LAB~~ (nahrazeno 14. 10.)
Uživatel schválil místo odhodu „podkrovní dílna v řezu“ (06, „Začátek hodu, místo odhodu a kamera“ bod 1). Dílna 24 × 12 m s přístavkem, dílenským oknem 11,4 × 4,8 m a dítětem 11,75 m končí, stejně jako model K4 `workshop` (`src/render3d/models/workshop.js`). Platí karty **H1 `kid`, H2 `workshop-attic`, H3 `workshop-interior`, H4 `loft-balcony`, H5 `hoist-beam`, H6 `retaining-wall`** ve skupině **G2b** (kap. 3.7) a bible 05 kap. 9. Nápad „pohlednice z Atlasu na okně“ přešel do nástěnky H3.

#### 6 `corner-turret` nárožní dům s věžičkou (dominanta místa 1)
- **Předobraz a účel:** secesní nárožní dům s věžičkou a praporkem (Vinohrady, Budapešť). Dominanta „Dílny a prvních střech“: první výrazná silueta po vzletu a obrázek pro teaser v Atlasu.
- **Kde a kolik:** 1× v ulici místa 1, za Dílnou (x ~120–150 m), místo jednoho bloku `house-row`.
- **Rozměry:** 14 m, přízemí + 4 patra (16 m), věžička na rohu ⌀ 4 m, výška 16 + 5 + jehlan 4 m, praporek 1 × 0,7 m.
- **Papír:** věžička je **složený šestiboký hranol** (3 viditelné stěny `panel` + horní řez) s jehlanem, arkýř pod ní jako vystouplá karta.
- **LOD 0:** dům jako `house-row` 4 patra (~260) + arkýř 3 patra (box 8 + okna 3 × 12) + věžička 10 + jehlan 5 + praporek 1 + balkony s květinami 2 × 17 + hodiny ne (patří místu 15). **≈ 450 △.**
- **LOD 1:** tělo, okna, věžička, jehlan **≈ 120 △**. **LOD 2:** **≈ 25 △**.
- **Barvy:** stěna `#f0a27a` (`D1.near[6]`), věžička a střecha `#3d4f7a`, arkýř `mix(stěna, cut, .3)`, praporek `PT.tomato` (malý, ve výšce 25 m, pod pásem letu).
- **Varianty:** jen zrcadlení podle strany; jedinečný v čtvrti.
- **Silueta:** jediný kulatý prvek s jehlanem ve frontě štítů; do 1 s.

#### 11 `market-hall` tržní hala s lucernou (dominanta místa 2)
- **Předobraz a účel:** otevřená tržní hala s cihlovými štíty a větrací lucernou na hřebeni (Holešovice, Les Halles v malém). Lucerna je **zdroj páry pro událost „poryv od tržnice“ (MARKET VENT)**: hráč vidí, odkud poryv přichází.
- **Kde a kolik:** 1× v ulici místa 2, nejširší střecha místa (dnes tam Bolts zametá).
- **Rozměry:** 30 × 12 m, lucerna 8 × 2,5 m na hřebeni, vjezd s obloukem 5 × 4,5 m, štít 7 m.
- **Papír:** štít je velká karta s vystřiženým **půlkruhovým oknem** (paprskové příčky jako výřezy), lucerna je malá karta s lamelami (`lista` × 4).
- **LOD 0:** tělo 8, štít 9, oblouk vjezdu (`disc 8` polovina čelo 4 + rám 6), půlkruhové okno 16, lucerna 8 + 9 + lamely 16, boční okna 6 × 12, cedule „MARKET“ (panel 2, text texturou? ne: **cedule bez textu**, piktogram jablka z `disc`) 10, sokl 4, okapové roury 4, bedny se zbožím u vchodu 4 × 8. **≈ 700 △.**
- **LOD 1:** **≈ 150 △**, **LOD 2:** **≈ 25 △**.
- **Barvy:** stěna `#f4ece0` (`D1.near[3]`), štít a střecha `D1.roof[1] #b5503c` (cihla), lucerna `D1.roof[0]`, pára `PT.cream` alfa ≤ 0,6 (bible kap. 6.2).
- **Silueta:** široký štít s lucernou a obloukem.

#### 18 `cottage` rodinný domek se zahradou
- **Předobraz a účel:** přízemní a patrové domky zahradní čtvrti (Ořechovka, anglické cottages). Přechod z města do zahrad.
- **Kde a kolik:** ulice místa 3 (5 bloků, w 6–10, h 6–7), střed místa 3 (6 bloků).
- **Rozměry:** 7–10 m, přízemí + podkroví (3 + 2,5 m), střecha 4–5 m, vchod se stříškou.
- **Papír:** jako `house-row`, ale nižší a s velkou střechou; stříška nad vchodem přeložená karta.
- **LOD 0:** tělo 8, střecha 13 (`gable` nebo `eave`), vikýř 21, okna 3–4 × 16 (s okenicemi), dveře se stříškou 16, komín (zvlášť), truhlíky 2 × 7, popínavá růže (3 `disc 6` jen čelo 18), branka a plotek před domem (viz `hedge-fence`). **≈ 200 △.**
- **LOD 1:** **≈ 50 △**, **LOD 2:** **≈ 15 △**.
- **Barvy:** stěna `D1.near` světlé (`#f4ece0`, `#f2b65a`, `#9cc3a6`, `#e98fa0`), střecha `D1.roof`, růže `D1.near[4]` na listech `D1.trees[1]`.
- **Varianty:** střecha štítem / okapem, vikýř ano/ne, barva okenic, růže ano/ne.
- **Silueta:** nízký dům s velkou střechou a komínem.

#### 19 `greenhouse` skleník (dominanta místa 3)
- **Předobraz a účel:** viktoriánský skleník (Kew, Fata Morgana Troja v malém). Dominanta „Zahrad na okraji“; dnes je tam malý skleník 14 × 5 m (`placeCards`, x 150).
- **Kde a kolik:** 1× ulice místa 3, x ~140–175 m, z −24.
- **Rozměry:** 26 m × 9 m, střední lodě s lucernou 6 × 3 m, dvě boční křídla 7 m vysoká.
- **Papír:** **rám z krémových proužků přes světle modrou průsvitnou kartu** (sklo `D1.glass`), příčle jako výřezy ve světlejší kartě (stejná technika jako okno, jen větší).
- **LOD 0:** 3 lodě × (tělo 8 + `gable` 9) + příčle 3 × 6 polí × 2 + lucerna 17 + rostliny uvnitř (5 `disc 8` jen čelo, za sklem) 40 + dveře 10 + sokl 4 + květináče u vchodu 4 × 8. **≈ 800 △.**
- **LOD 1:** **≈ 120 △**, **LOD 2:** **≈ 25 △**.
- **Barvy:** sklo `D1.glass #cfe2ec`, střechy `D1.glassRoof #9fc3cf`, příčle `PAPIR.city.cut #fffaf0` (krémová, ne bílá), sokl `D1.trunk`, rostliny `D1.trees`.
- **Silueta:** tři štíty se špičkou uprostřed, nejsvětlejší objekt místa 3 (pozor: pod pásem letu, ne bílý).

#### 27 `station` nádražní budova
- **Předobraz a účel:** malé nádraží regionální trati (rakousko-uherské typové nádraží). Říká „tady je železnice“, je cílem lidí na nástupišti.
- **Kde a kolik:** 1× místo 4 za nástupištěm (x ~1095–1125 m, z −20).
- **Rozměry:** 18 × 7,5 m (přízemí 3,5 + patro 3 + římsa), střecha `eave`, markýza nad nástupištěm 12 m.
- **LOD 0:** `house-row` 4 osy (~180) + nápis „STATION“ jako vystřižená cedule bez textu (piktogram kola, `disc 8` 24) + hodiny ne (místo 15) + lavička a kufr pod markýzou + kovové konzoly markýzy 4 × 4. **≈ 350 △.**
- **LOD 1/2:** **≈ 70 / 15 △**.
- **Barvy:** stěna `#f2b65a`, sokl a nároží `mix(stěna, side, .3)`, střecha `#3d4f7a`, markýza `#5aa6a0`.

#### 28 `water-tower` železniční vodárna (dominanta místa 4)
- **Předobraz a účel:** vodárna pro parní lokomotivy (cihlový dřík a nádrž nahoře, typická pro nádraží v Česku). Dominanta „Železnice k řece“, logicky souvisí s parním vlakem.
- **Kde a kolik:** 1× místo 4, u kolejí (x ~1040 m, z −20).
- **Rozměry:** dřík 4 × 12 m, nádrž ⌀ 6 m × 4 m, stříška jehlan 2,5 m, výpusť (rameno) 2 m.
- **Papír:** dřík karta s úzkými okny-výřezy, nádrž = karta s půlkruhovými boky (válec viděný z boku) a přeloženým pásem obruče, stříška jehlan.
- **LOD 0:** dřík 8 + sokl 4 + dveře 10 + okna 3 × 4 + cihlové pruhy 4 × `lista` 16 + nádrž 8 + boky 2 × půl `disc 8` 8 + pás 8 + lávka a zábradlí 16 + stříška 5 + rameno výpusti a potrubí 16 + žebřík 2 + korouhvička 3 = **≈ 170 △**.
- **LOD 1/2:** **≈ 50 / 15 △**.
- **Barvy:** dřík `D1.roof[1] #b5503c`, nádrž `life.tanks.body #9fb7d9`, stříška `#3d4f7a`, rameno `PT.pencil`.
- **Silueta:** „hřib“ na sloupu, nejvyšší bod místa 4 (20 m, pod pásem letu).

#### 29 `rail-shed` skladiště a dílna u trati
- **Předobraz a účel:** cihlová skladiště s rampou a výtopna se zubatou střechou. Předznamenává sklady přístavu (čtvrť 2), takže přechod na mostě nebude skok.
- **Kde a kolik:** ulice místa 4 (6 z 11 bloků, w 12–19, h 6–11).
- **Rozměry:** 12–19 m, výška 6–11 m (přízemí 4,5 + patro), rampa 1,2 m, vrata 3,5 × 4 m.
- **LOD 0:** tělo 8, zubatá střecha 3–4 × `eave` (6) nebo `gable`, vrata 2 + 4 prkna, rampa `lista` 4, okna 4–6 × 12, nápis jako barevný pruh 4, bedny a sudy na rampě 4 × 8, okapy 4. **≈ 220 △.**
- **LOD 1/2:** **≈ 60 / 15 △**.
- **Barvy:** stěny `D1.roof[1] #b5503c` (cihla), `#f4ece0`, `#9cc3a6`; vrata `#3d4f7a` nebo `#5aa6a0`.

### 3.2 Střechy a fasády

#### 4 `chimney` komín s kouřem
- **Předobraz a účel:** zděný komín s hlavicí a nástavci. Říká „tady se bydlí, je ráno, topí se“; kouř ukazuje vítr.
- **Kde a kolik:** dnes 15 / 20 / 2 / 12 v místech 1–4 (`suburbLife.chimneys`), 0–2 na dům.
- **Rozměry:** 0,8 × 0,8 m (velký 1,4 m), **horní hrana ≥ 1 m nad hřebenem** nebo 1,2–2,5 m nad plochou střechou, hlavice 1,1 m × 0,3 m, 1–3 nástavce ⌀ 0,3 m.
- **Díl:** `chimney` z `parts.js` (K1), součást modelu domu, ne samostatný objekt generátoru. Hlava jako `lista`.
- **LOD 0:** dřík `block` 8 + hlava `lista` 4 + nástavec `block` 8 = **20 △** (K1 dnes 24). **LOD 1:** dřík 8. **LOD 2:** `lista` 4.
- **Kouř:** krémové obláčky `PT.cream`, alfa ≤ 0,6, menší než vlaštovka (bible kap. 6.2), instancovaný kotouč `disc 8` jen čelo, „on twos“; reduced motion: zamrzne. Kouří jen ¼ komínů (ráno se netopí všude).
- **Barvy:** `life.chimney #9a4a3a`, hlavice `mix(chimney, cut, .3)`.
- **Varianty:** 1–3 nástavce, velký dvojitý.
- **Rozpor R5:** `suburbLife` staví komín na `y = b.h` (vršek kvádru), takže u domu se štítem je zapuštěný ve střeše. Díl `chimney` (K1) to už řeší přes `roofAt`; v K5 se komíny ze `suburbLife` nahradí komíny modelů domů (dnes 15 / 20 / 2 / 12, model dává 1 na dům, druhý u ⅓ domů).

#### 12 `antenna` televizní anténa
- **Předobraz a účel:** anténa Yagi na střeše. Hustota antén říká „hustě obydlený střed s trhem“.
- **Kde a kolik:** 23 v místě 2 (`suburbLife.antennas`), výška 4–9 m (ulice), 8–16 m (střed).
- **Rozměry:** stožár 0,1 m → **kreslit 0,25 m** (D-1), ráhno 2,4 m, prvky 3–5 × 1–1,6 m.
- **LOD 0:** stožár `panel` 2 + ráhno 2 + 4 prvky × 2 + kotevní lanko 2 = **≈ 14 △**. **LOD 1:** 6 △. **LOD 2:** —.
- **Barvy:** `life.mast` = `PT.pencil`.
- **Pozor (P1):** nejvyšší anténa sahá do ~30 m. Tužková šedá, ne grafit; nesmí být delší než 1/3 výšky vlaštovky v záběru, aby nevznikla „druhá čára“.

#### 13 `laundry` šňůra s prádlem
- **Předobraz a účel:** prádlo mezi okny / balkony (Neapol, Lisabon, Praha-Žižkov dvory). Ráno, lidé jsou doma, život.
- **Kde a kolik:** 5 v místě 1, 4 v místě 2 (`suburbLife.laundry`) na domech ≥ 8 m.
- **Rozměry:** šňůra mezi dvěma okny stejného patra, **ve výšce parapetu** (rozpor R6: dnes 45–65 % výšky domu, mimo patra), kusy prádla 0,5–1,1 m (košile, ručník, ponožky 0,3 m jen LOD 0).
- **LOD 0:** šňůra linka 2 + 2 konzoly `lista` 8 + 5–8 kusů (`panel` 2, trička jako tvar z 2 `panel`) = **≈ 40 △**. **LOD 1:** 15 △.
- **Pohyb:** kusy se houpou ve vertex shaderu (atribut `sway`, bez vlastního draw callu), reduced motion: stojí.
- **Barvy:** šňůra `life.line` (`PT.pencil`), prádlo `life.people.cloth`.

#### 32 `roof-tank` vodní nádrž na střeše
- **Předobraz a účel:** dřevěná nádrž na nohách (New York, ale v papíru pastelová). Dává střechám místa 1 a 2 siluetu.
- **Kde a kolik:** 4 / 3 / 0 / 1 (`suburbLife.tanks`).
- **Rozměry:** ⌀ 2,6 m × 2,6 m, nohy 0,9 m, stříška 1,2 m.
- **Papír:** válec viděný z boku = karta (`box`), obruče jako přeložené proužky.
- **LOD 0:** nádrž `box` 8 + obruče 2 × `lista` 8 + 4 nohy × `panel` 8 + stříška `pyr` 5 + žebřík 2 = **≈ 31 △**. **LOD 1:** 15. **LOD 2:** 5.
- **Barvy:** `life.tanks.body #9fb7d9`, nohy `PT.pencil`, stříška `life.tanks.roof` (`PT.tomato`).

### 3.3 Ulice a trh

#### 7 `person` člověk
- **Předobraz a účel:** papírová postavička (Tearaway: hlava kotouč, tělo lichoběžník). Lidé reagují na vlaštovku (`pose.js`: turn, wave, point, jump, cheer), jsou hlavní „odměna pohledem“.
- **Kde a kolik:** 19 / 90 (z toho 70 dav na trhu) / 13 / 26 v místech 1–4.
- **Rozměry:** **1,7 m**: hlava ⌀ 0,45 m, trup 0,75 m (lichoběžník 0,55 → 0,4 m), nohy 0,8 m, ruce 0,65 m. Dítě 1,2 m (stejný model × 0,7).
- **Postoje (3):** stojí, jde (nohy rozkročené, on twos), sedí (lavička, nástupiště). Reakce mění ruce a otočení (`pose.js` beze změny).
- **LOD 0:** hlava `disc 8` jen čelo 8 + vlasy/čepice `flag` nebo půlkotouč 2 + trup `panel` lichoběžník 2 + ruce 2 × `panel` 4 + nohy 2 × `panel` 4 = **20 △**. **LOD 1 (dav za stánky, střed):** 10 △ (hlava `disc 6`, trup, nohy jako jeden díl).
- **Instancing:** jeden instancovaný mesh pro celou čtvrť (atributy: barva oblečení, kůže, postoj, póza), 1 draw call.
- **Barvy:** `life.people.cloth` (6), kůže `life.people.skin` (4), vlasy `PT.pencil` / `D1.trunk` / `PT.kraft`.
- **Varianty:** 6 × 4 × 3 barvy + 3 postoje + 4 doplňky (taška, deštník zavřený, klobouk, batoh: +2 △).
- **Silueta:** kolečko na lichoběžníku; na telefonu 4 px, čte se jako „lidé“ jen v davu. **Rozpor R2:** dnes 2,0 m.

#### 8 `street-lamp` pouliční lampa
- **Předobraz a účel:** litinová lampa s lucernou (pražská lampa „s košíkem“ v jednoduchém tvaru). Ráno nesvítí, večer (čtvrť 4) přechází v lampiony; tady je to rytmus ulice.
- **Kde a kolik:** každých 30–45 m na chodníku **před domy (z ≈ −17)**, 7 na místo; v trhu místo nich girlandy. Dnes `cityChunk.lamps` stojí v popředí z = +9 a papírový režim je nekreslí (`placeCards` je nečte).
- **Rozměry:** sloup 4,5 m × 0,25 m, patka 0,5 m, rameno 0,8 m, lucerna 0,6 × 0,9 m.
- **LOD 0:** sloup `panel` 2 + patka `lista` 4 + rameno 2 + lucerna box 8 + stříška `flag` 1 + sklo `panel` 2 + ozdoba 2 = **≈ 21 △**. **LOD 1:** 8.
- **Barvy:** `D1.window #3d4f7a` (tmavomodrá litina), sklo `PAPIR.city.warm` jen večer, ráno `D1.glass`.
- **Varianty:** jednoramenná / dvouramenná, s květinovým košem (+7).

#### 9 `stall` stánek trhu
- **Předobraz a účel:** trhové stánky s pruhovanou markýzou (Náplavka, provensálský trh). Srdce místa 2, dav kolem.
- **Kde a kolik:** 19 v místě 2 (`suburbLife.stalls`, w 7 m, rozestup 9–12 m).
- **Rozměry:** dnešní stánek 7 m je jako tři stánky vedle sebe, proto **model = trojice 2,3 m stánků pod jednou markýzou** (rozložení zůstává). Pult 0,95 m, sloupky 2,4 m, markýza sklon 0,5 m s lambrekýnem 0,3 m.
- **Papír:** pult karta, markýza přeložená karta s pruhy (pruhy = střídané `panel`), lambrekýn = řada `flag` (zoubky).
- **LOD 0:** pult 8 + 4 sloupky × `panel` 8 + markýza 3 × 2 pruhy × 2 = 12 + lambrekýn 9 `flag` 9 + zboží (bedny `lista` 3 × 4 + 9 jablek/dýní `disc 6` jen čelo 54 → **místo nich 3 kopečky `flag` 3 × 3**) 21 + prodavač (`person` zvlášť) + cedulka s cenou `panel` 2 = **≈ 70 △**. **LOD 1:** 20.
- **Barvy:** pult `life.stall.base` (`PT.card`), sloupky `life.stall.post`, pruhy `life.stall.stripes` + `PT.cream`, zboží `D1.near` (rajčata `PT.tomato`, hrušky `#a8c48a`, dýně `#f0a27a`).
- **Varianty:** 4 barvy pruhů, 3 druhy zboží (ovoce, květiny, chléb `PT.kraft`), markýza rovná / zvlněná.

#### 10 `bunting` girlanda s praporky
- **Předobraz a účel:** praporky přes náměstí při trhu. Ohraničují náměstí shora, pohyb ve větru ukazuje vítr.
- **Kde a kolik:** 2 v místě 2 (`suburbLife.bunting`, y 6,8 a 8,4 m, přes ~200 m), mezi lampami nebo štíty.
- **Rozměry:** praporek dnes 1,1 × 1,2 m (herní velikost, skutečný 0,3 m by byl pod 2 px), rozestup 1,5 m, provázek s průvěsem 0,8 m (dnes rovný).
- **LOD 0:** provázek jako 8 úseků linky s průvěsem 8 + praporky 1 △ každý (~130) = **≈ 140 △ na girlandu**. **LOD 1:** každý druhý praporek.
- **Pohyb:** kmitání ve vertex shaderu (`sway`), reduced motion: stojí.
- **Barvy:** `life.bunting`: `PT.tomato`, ~~`PT.mustard`~~ (rozpor R3, navrhuji `#f2b65a` z `D1.near`), `PT.teal`, `PT.cream`, `#7f9ed6`.
- **Výška:** 6,8–8,4 m, pod pásem letu; krémové praporky nesmí sousedit s grafitem (P1).

#### 23 `bench` lavička
- **Předobraz a účel:** parková lavička s opěradlem. Místo, kde lidé sedí a dívají se nahoru.
- **Kde a kolik:** 4–6 na místo 1–3 (u zahrad, nástupiště, pod lampami).
- **Rozměry:** 1,8 m, sedák 0,45 m, opěradlo 0,85 m.
- **LOD 0:** sedák `lista` 4 + opěradlo 2 × `panel` 4 + nohy 2 × `panel` 4 = **12 △** (+ sedící `person`). **LOD 1:** 4.
- **Barvy:** prkna `PT.kraft`, nohy `#3d4f7a`.

#### 33 `street-kit` drobnosti ulice
- **Předobraz a účel:** poštovní schránka, popelnice, hydrant, směrovka, sloupek s plakáty, kytka v kořenáči. Dávají ulici „žité“ měřítko u země.
- **Kde a kolik:** 8–12 na místo (1, 2, 4), u dveří a nároží; ne před stánky.
- **Rozměry:** schránka 0,5 × 0,8 m na sloupku 1 m, popelnice 0,6 × 1 m, hydrant 0,3 × 0,7 m (**kreslit 0,4**), plakátový sloup ⌀ 1 m × 2,6 m, kořenáč 0,8 m.
- **LOD 0:** 6–16 △ každý (plakátový sloup `box` 8 + kopule půl `disc 8` 4 + plakáty 3 × `panel` 6 = 18). **LOD 1:** jen plakátový sloup (8).
- **Barvy:** schránka `PT.tomato` (jediná malá rajčatová tečka ulice; pod pásem letu), popelnice `#5aa6a0`, hydrant `#e8735a`, plakáty `PT.cream` / `PT.card` s pruhem barvy čtvrti.

#### 17 `car` auto
- **Předobraz a účel:** malé evropské auto (Fiat 500, Trabant, Citroën 2CV) a dodávka. Pohyb ve dvou pruzích, „ráno se jezdí do práce“.
- **Kde a kolik:** 70 aut ve dvou pruzích (z −4,6 a −7,2) přes čtvrť, ~14 v záběru místa.
- **Rozměry:** **4,2 × 1,5 m** (dnes `lifeCards` 2,25 m vysoké, rozpor R4), kola ⌀ 0,6 m; dodávka 5 × 2,1 m.
- **LOD 0:** karoserie se zaoblenou kabinou (tělo box 8 + kabina lichoběžník `gable`-like 9) + okna 2 × `panel` 4 + kola 2 × `disc 8` jen čelo 16 + světla 2 × `panel` 4 + nárazníky `lista` 8 = **≈ 50 △** (dodávka 45).
- **Instancing:** jeden mesh na typ pro čtvrť (2 DC), pozice `carX(c,t)`.
- **Barvy:** karoserie `D1.near`, okna `mix(barva, D1.window, .6)`, kola `PT.graphite` (u země, malé), světla `PT.cream`.
- **Varianty:** 2 tvary × 8 barev, střešní nosič s kufrem (+8), dodávka s nápisem-pruhem.

### 3.4 Zeleň a zahrady

#### 14 `tree-round` listnatý strom
- **Předobraz a účel:** lípa a jabloň jako papírové kotouče na kmeni (bible kap. 3). Zahrady, ulice, střed.
- **Kde a kolik:** 14 v ulici místa 3 (dnes `pyramid` tone 4), ~19 ve středu místa 3 (`placeCards` zahrady), 2–4 v ulici míst 1, 2, 4 (nové, v mezerách mezi domy).
- **Rozměry:** výška 6–11 m, koruna ⌀ 4–7 m ze **2–3 překrývajících se kotoučů** různé barvy (světlejší vpředu), kmen 0,5 m, 1–2 větve.
- **LOD 0:** kmen `box` 8 + větev `panel` 2 + 3 kotouče `disc 10` s hranou 90 = **100 △**; jabloň + 5 jablek `disc 4` jen čelo 20. **LOD 1:** kmen + 2 kotouče `disc 8` = **≈ 50 △**. **LOD 2:** 1 kotouč `disc 6` jen čelo 6.
- **Barvy:** `D1.trees` (4, dva na strom), kmen `D1.trunk`, jablka `PT.tomato`.
- **Varianty:** 1–3 kotouče, velikost, jabloň, rozkvetlá (kotouč `#e98fa0`).
- **Silueta:** „lízátko“ z kotoučů; v dálce jen kolečko.

#### 15 `tree-poplar` topol
- **Předobraz a účel:** štíhlé topoly podél tratě a cest (rovina u řeky). Svislý kontrapunkt k vodorovné trati.
- **Kde a kolik:** místa 3 a 4, řady po 3–6 kusech (střed i ulice), ~10 na místo.
- **Rozměry:** výška 10–16 m, koruna 2,5–3,5 m široká, protáhlý ovál.
- **LOD 0:** kmen 8 + koruna `disc 10` protažená (scale y 3) 30 + světlejší přední polovina `disc 6` jen čelo 6 = **44 △**. **LOD 1:** 20. **LOD 2:** 6.
- **Barvy:** `D1.trees[1] #5f9e86`, `#7fb08a`.

#### 16 `hedge-fence` živý plot a laťkový plot
- **Předobraz a účel:** stříhaný živý plot a bílý laťkový plot předzahrádek. Odděluje zahrady od chodníku, dává ulici místa 3 linii.
- **Kde a kolik:** živý plot ~15 úseků (dnes `placeCards`, h 1,4–2,4, z −20), laťkový plot 10–15 polí po 2,5 m.
- **Rozměry:** živý plot 1,2–1,8 m, laťky 1 m s mezerou 0,1 m → **kreslit laťky 0,3 m s mezerou 0,2 m** (D-1), branka 1 m.
- **LOD 0:** živý plot `box` 8 + zaoblený vršek 3 `flag` 3 = 11; pole plotu = 2 příčky `lista` 8 + 5 laťek se špičkou (`panel` + `flag` = 3) 15 = **23 △**. **LOD 1:** plot jako jeden `panel` se zubatým horním okrajem 8.
- **Barvy:** živý plot `D1.hedge`, laťky `PAPIR.city.cut` (krém, ne bílá) nebo `#9cc3a6`.

#### 20 `pinwheel` zahradní větrník
- **Předobraz a účel:** dětský papírový větrník zapíchnutý v záhonu. Souvisí s bonusem **Pinwheel (A03)**, točí se ve větru.
- **Kde a kolik:** 14 v místě 3 (`suburbLife.pinwheels`, y 2,6 m).
- **Rozměry:** tyč 2,2 m × 0,12 m (**kreslit 0,2**), vrtule ⌀ 1,2 m (herní velikost, skutečný 0,3 m, otázka v kap. 6), 4 lopatky stočené do středu.
- **LOD 0:** tyč `panel` 2 + 4 lopatky × 2 `flag` (přehyb = dvě barvy) 8 + středový špendlík `disc 4` 4 = **14 △**. **LOD 1:** 6.
- **Instancing:** 1 DC pro čtvrť (rotace instance), on twos; reduced motion: stojí.
- **Barvy:** lopatky dvojice z `life.balloons` (vnější strana sytá, přeložená strana `mix(barva, cut, .4)`), tyč `life.pole`.

#### 21 `garden-shed` zahradní kůlna
- **Předobraz a účel:** dřevěná kůlna s pultovou střechou a nářadím. Zahrada je „pracovní“, ne park.
- **Kde a kolik:** 2–3 v místě 3 (za domky).
- **Rozměry:** 3 × 2,4 m, pultová střecha, dveře 0,9 × 2 m, sud na dešťovku ⌀ 0,7 m.
- **LOD 0:** tělo 8 + střecha `eave` 6 + prkna 4 × `panel` 8 + dveře 4 + okénko 4 + sud `box` 8 + 2 obruče `lista` 8 + hrábě opřené `panel` 2 = **≈ 48 △**. **LOD 1:** 16.
- **Barvy:** `PT.kraft`, `D1.trunk`, střecha `D1.roof[0]`, sud `#5aa6a0`.

#### 22 `garden-bed` záhon, truhlík, keř
- **Předobraz a účel:** zeleninové záhony, kytky, keře u plotů. „Hodně detailu všude“ u země, kde je hodně místa a málo △.
- **Kde a kolik:** 20 záhonů v místě 3, 6–10 keřů v místech 1, 2, 4 u nároží.
- **Rozměry:** záhon 3 × 0,4 m s řadou rostlin 0,4–0,6 m; keř ⌀ 1,2–2 m.
- **LOD 0:** záhon `lista` 4 + 4 rostliny `flag` 4 + 2 květy `disc 4` jen čelo 8 = **16 △**; keř 2 `disc 8` jen čelo 16. **LOD 1:** záhon = jen `lista`.
- **Barvy:** hlína `D1.trunk`, listy `D1.trees`, květy `D1.near[4]`, `#f2b65a`, `PT.tomato`.

### 3.5 Železnice

#### 24 `track` trať
- **Předobraz a účel:** jednokolejná trať na štěrkovém loži. Vede vlak z tunelu k řece (`TRACK`, z −15) a odstavná kolej (z −9).
- **Rozměry:** lože 3,2 m × 0,3 m, pražce 2,6 × 0,25 m po 0,6 m → **kreslit každý 2., 0,3 m široký, po 1,2 m**, kolejnice 0,15 m → linka 0,1 m.
- **LOD 0 (na 100 m):** lože `lista` 4 + 2 kolejnice `lista` 8 + 83 pražců × `panel` 2 = **≈ 180 △ / 100 m**. **LOD 1:** bez pražců 12.
- **Barvy:** lože `life.rail.bed` (`D1.trunk`), pražce `mix(trunk, side, .3)`, kolejnice `PT.pencil` (dnes `life.rail.track` z CYBER, rozpor R7).

#### 25 `train` parní lokomotiva a vagony
- **Předobraz a účel:** malá parní lokomotiva (řada 310 „Kafemlejnek“) a dvounápravové osobní vozy. Kouř z komína je nejživější pohyb místa 4.
- **Kde a kolik:** jedoucí vlak `TRACK` (lokomotiva + 5 vozů po 12 m) a 5 odstavených vozů (`suburbs-layout extras`, 20 × 4,5 m, z −9).
- **Rozměry:** lokomotiva 9 × 3,8 m (komín 1 m, kabina 2,4 m), vůz 12 × 3,6 m, okna 0,9 × 0,9 m po 1,5 m, kola ⌀ 1 m (lokomotiva 1,3 m).
- **LOD 0:** lokomotiva: kotel jako kvádr se zaoblenou horní hranou (`box` + 2 × `lista`) 16 + kouřová komora 8 + komín s nástavcem 12 + dóm 6 + kabina box 8 + střecha `lista` 4 + 3 kola `disc 8` jen čelo 24 + ojnice `panel` 2 + nárazník `lista` 4 + lampa 2 = **≈ 90 △**; vůz: tělo 8 + oblá střecha 3 × `lista` 12 + 7 oken × 4 28 + dveře 4 + 2 kola 16 + nárazníky 4 = **≈ 72 △**. Odstavený vůz 20 m (dnešní rozměr) = **dva vozy 10 m spřažené**.
- **Kouř:** jako `chimney`, větší obláčky ⌀ 1,5–3 m, alfa ≤ 0,6.
- **Barvy:** lokomotiva `#3d4f7a`, nárazník a kola `PT.tomato` / `PT.graphite`, vozy `#e8735a`, `#5aa6a0`, `#7f9ed6`, okna `mix(barva, window, .6)`, střechy `PT.pencil`.
- **Varianty:** barva vozu, nákladní vůz (kryté, plošina s bednami) u odstavené koleje.

#### 26 `platform` nástupiště s přístřeškem
- **Předobraz a účel:** nástupiště s ocelovým přístřeškem. Lidé čekají (12 postav, `suburbLife`), hráč chápe „stanice“.
- **Kde a kolik:** 1× místo 4 (x 1094–1172 m, z −11,9; dnes kvádr 78 × 0,8 m).
- **Rozměry:** 78 × 2,6 m × 0,8 m, hrana bílým pruhem 0,3 m (`PT.cream`), přístřešek 24 m na 4 sloupech 3 m, cedule stanice 3 × 0,6 m (bez textu, piktogram).
- **LOD 0:** deska 8 + pruh 2 + přístřešek `eave` 6 + 4 sloupy × `panel` 8 + konzoly 8 + 2 lavičky 24 + cedule 4 + 2 lampy 42 + hodiny ne = **≈ 110 △**. **LOD 1:** 25.
- **Barvy:** `life.platform` (`PT.card`), přístřešek `#5aa6a0`, sloupy `#3d4f7a`.

#### 30 `tunnel-hill` kopec s portálem tunelu
- **Předobraz a účel:** travnatý kopec s kamenným portálem (dnes jehlan 36 × 16 m + kvádr 22 × 9 m, `lifeCards`). Odkud vlak přijíždí; hranice mezi zahradami a tratí.
- **Rozměry:** kopec 40 × 16 m ze 3 překrývajících se zaoblených karet (ne jehlan), portál 8 × 6 m s obloukem 5 × 5,4 m, nad ním 3 stromy.
- **LOD 0:** 3 kopce `disc 12` horní polovina s hranou 54 + portál box 8 + oblouk (`disc 8` půl čelo 4 + černý otvor `PT.graphite` 6) + kvádry obložení 6 × `panel` 12 + 3 `tree-round` LOD 1 = **≈ 240 △**. **LOD 1/2:** 60 / 15.
- **Barvy:** kopec `life.pyramid #a8c48a`, `D1.trees`, portál `life.tunnel.wall` → navrhuji `D1.mid[3] #f0d59e` (kámen) místo zelené, otvor `life.tunnel.mouth` (`PT.graphite`, u země, smí).

#### 31 `rail-bridge` železniční most přes kanál (brána 1 → 2)
- **Předobraz a účel:** ocelový příhradový most (most přes Vltavu u Výtoně v malém). **Brána mezi čtvrtěmi** podle `09-prechody-ctvrti.md` (rozhodnutí 2): z jedné strany poslední domky a prádlo, z druhé první sklady a jeřáb; šev ulice leží pod mostem.
- **Kde a kolik:** 1× na hranici míst 4 a 5 (x ~1180–1260 m), závisí na kroku T3 plánu přechodů.
- **Rozměry:** 80 m, 3 pole, příhrada 6 m vysoká, pilíře 4 × 8 m, voda pod mostem.
- **Papír:** příhrada je **jedna karta s vystřiženými trojúhelníky** (ne pruty): tak se vejde do △ a je čistě papírová.
- **LOD 0:** příhrada 3 pole × (pásy 2 × `lista` + 4 diagonály `lista`) 72 + mostovka 8 + 3 pilíře 24 + zábradlí 4 + voda `panel` 2 + odlesky 6 `panel` 12 + nýty ne = **≈ 130 △ na stranu; s detaily (lampy, cedule, schody k vodě) ≈ 400 △.**
- **LOD 1/2:** 60 / 20.
- **Barvy:** příhrada `#3d4f7a` (stejná jako lokomotiva a lampy: „železo“), pilíře `D1.mid[3]`, voda `PAPIR.city.districts[1].sea #2c6e9b` smíchaná s nebem 0,4 (ranní voda).

#### 34 `signal` návěstidlo
- **Předobraz a účel:** mechanické návěstidlo s ramenem (semafor). Drobnost, kterou fanoušci vlaků poznají; rameno se zvedne před vlakem.
- **Kde a kolik:** 2–3 v místě 4.
- **Rozměry:** stožár 6 m × 0,25 m, rameno 1,6 × 0,3 m, žebřík.
- **LOD 0:** stožár 2 + rameno 2 + terč `disc 6` 6 + žebřík 4 + lampa 4 = **≈ 18 △**. **LOD 1:** 4.
- **Barvy:** stožár `PT.pencil`, rameno `PT.tomato` s `PT.cream` pruhem.

### 3.6 Vzduch

#### 35 `balloon` horkovzdušný balón
- **Předobraz a účel:** papírové balóny v dálce (Alto). Pomalý pohyb na obloze, hloubka nad městem.
- **Kde a kolik:** 8 přes čtvrť (`suburbLife.balloons`, z −170 až −280, y 55–130).
- **Rozměry:** obal ⌀ 10–16 m (dnes r 5–8), koš 1,8 × 1,4 m, lana 2,4 m.
- **LOD 1 (jediný):** obal `disc 16` s hranou 48 + 4 svislé pruhy `panel` 8 + koš `box` 8 + 2 lana `panel` 4 = **≈ 68 △**.
- **Barvy:** `life.balloons` + `PT.cream` pruhy, koš `life.basket`.
- **Pravidlo P1:** výš než pás letu nebo za ním (z ≤ −170), nikdy bílý.

#### 36 `cloud` mrak
- **Předobraz a účel:** papírové mraky ze tří kotoučů (bible kap. 3, dnes `lifeCards`). Obloha.
- **Kde a kolik:** 14 přes čtvrť (y 110–230 m, z −520 až −760).
- **LOD 2 (jediný):** 3 × `disc 24` s hranou = **216 △** → navrhuji `disc 16` (144 △), rozdíl na 3 px/m nevidět.
- **Barvy:** `life.cloud #fffaf0`.

#### 37 `flock` hejno ptáků
- **Předobraz a účel:** hejno v klínu (`birdAt`). Život nad střechami.
- **Kde a kolik:** 4 hejna × 7–11 ptáků (z −70 až −150, y 28–60 m: **v pásu letu, ale za vlaštovkou**).
- **Rozměry:** pták 0,8 m rozpětí.
- **LOD 1:** 2 `flag` (křídla) = **2 △**, instancovaný.
- **Barva:** `mix(PT.pencil, nebe, .4)` (rozpor R8: dnes `fx.bird = PT.pencil`, v pásu letu je to „druhá čára“, P1).

#### 38 `pigeon` origami holub (událost)
- **Předobraz a účel:** holub s bagetou (událost „bird“, `companion3d.js`). Letí vedle vlaštovky, proto **herní velikost** jako vlaštovka.
- **Rozměry:** 2,5 m rozpětí (≈ ⅓ vlaštovky), bageta 1,2 m.
- **Papír:** **skládaný origami holub**: tělo ze 4 trojúhelníků, křídla 2 × 2 trojúhelníky s přehybem, hlava 1, zobák 1, ocas 2; bageta `box` 8 + 3 zářezy `panel` 6.
- **LOD 0 (jediný):** **≈ 30 △**.
- **Barvy:** `PAPIR.companion` (`body #b6c9e4`, `head #cfe2ec`, `wing #a7bdd6`, `tail #7f9ed6`, `beak #f0a27a`, `eye PT.graphite` jen tečka), bageta `PT.kraft`.
- **P1:** šedomodrý, bez obrysu, menší než vlaštovka; nikdy bílý s grafitem.

### 3.7 Místo odhodu: skupina G2b (schváleno 14. 10.)

Koncept 2 „podkrovní dílna v řezu“ (06, „Začátek hodu“ bod 1; bible 05 kap. 9). Náčrty `img/start/koncept-2-podkrovi.png` (míření, oddálení, menu), měřítko `img/start/zaber.png`. Všechny karty jsou v **LOD H** (nejmenší detail 0,03 m, M-4) a ve skutečném měřítku (M-1). Trojúhelníky jsou **odhad** podle vzorců kap. 1.3. Barvy jen z tokenů (bible 05 kap. 9.5), pravidla S-1 až S-7 (bible 05 kap. 9.3). Souřadnice: x od startu města, čelo ulice z ≈ +1,2.

#### H1 `kid` dítě, hrdina startu
- **Předobraz a účel:** dítě, které vlaštovky skládá a hází. Hráčova postava, vidět zblízka při každém hodu, v menu a u stolu Dílny.
- **Kde a kolik:** 1×, na pavlači H4, ruka při nápřahu v 12 m (x ≈ 71,6).
- **Rozměry:** **1,2 m** (`person` × 0,7): hlava ⌀ 0,3 m, pláštěnka 0,5 m, nohy 0,45 m, ruka 0,5 m.
- **Papír:** jako `person` (hlava kotouč, trup lichoběžník), navíc skládaná čepice (trojúhelník s proužkem), vlasy kotouč za hlavou, oko tečka. Bez obrysu.
- **Pózy:** míření (ruka s vlaštovkou nahoře vpředu), nabíjení (záklon a couvnutí jako dnes `kidPose`), hod (švih), mávání po hodu, v menu mávání nebo sezení na pavlači, u stolu (panel Dílny).
- **LOD H:** ~70 △ (dnes 49). **LOD 0** (oddálení, menu z dálky): 20 △ jako `person`. **LOD 2:** 0.
- **Barvy:** pláštěnka `D1.near[1] #f2b65a`, čepice `PT.kraft #c9a57c` + proužek `PT.tomato`, nohy `D1.window #3d4f7a`, boty a oko `PT.pencil700`, kůže `life.people.skin[0]`.
- **Silueta:** postavička s trojúhelníkem na hlavě a zdviženou rukou, čitelná od 60 px. Kontrast proti nebi je nízký (bible 05 kap. 9.4), proto snímek v šedi při art-review.

#### H2 `workshop-attic` dům dítěte s podkrovím v řezu
- **Předobraz a účel:** úzký měšťanský dům s podkrovní dílnou (Amsterdam, Malá Strana). Domov a pozadí menu.
- **Kde a kolik:** 1×, místo 1, x 55,5–67,5 m, čelo z +1,2; pavlač H4 končí u ruky (x 71,6). Nahrazuje dnešní Dílnu (x 20–44 m) a přístavek.
- **Rozměry:** 12 × 8 m, na zdi H6 1,1 m: přízemí 3,5 m + 2 patra × 3 m, podkroví: nadezdívka 2,3 m + střecha 4,6 m (podlaha podkroví 10,6 m).
- **Papír:** tělo karta, okna `windowCut` (příčky smí, LOD H), dveře se stříškou, výloha v přízemí (`shopfront`), cedulka PAPER LAB pod podkrovím (karta + textura). **Řez podkroví:** zadní stěna a štít `panel` v `PT.card`, podlaha `lista` v kraftu, nadezdívka v řezu (krémová se světlou hranou), střecha jako dvě silné rajčatové `lista` se světlým jádrem řezu: **nový díl `cutRoof`** (8 △).
- **LOD H/0:** tělo a řez ~40, okna 8 × 12 ≈ 100, přízemí (dveře, výloha, schránka) ~40, cedulka 6, střecha v řezu 16 ≈ **200 △** bez interiéru. **LOD 1:** 0 (jen ulice). **LOD 2 (stínový proxy, dálka):** dům + štít ≈ 20 △, proxy do masky ≤ 7 △.
- **Barvy:** stěna `PT.cream` (`PAPIR.workshop.wall`), střecha `PT.tomato`, řez `mix(tomato, city.cut, .55)`, rámy oken a dveře `#3d4f7a` (ne grafit), sklo podkroví a oken `PAPER_WARM #ffe2a8` (jediné teplé světlo ve dne, S-4).
- **Varianty:** žádné (jedinečný). Mění se postupem jen interiér (H3) a hák (H5).
- **Silueta:** vysoký dům s červeným štítem a „otevřenou“ střechou; v 25 % šedi dům s tmavým otvorem nahoře.

#### H3 `workshop-interior` dílna v podkroví
- **Účel:** výloha postupu a pozadí panelu Dílny.
- **Obsah:** stůl 3,4 × 0,8 m (`box` 8 + nohy 2 × `panel`), lampa (rameno `panel`, stínítko `flag`), stohy papíru 3 × `panel`, kelímek s tužkami, řezačka; **police s rolemi papírů** (4 role = Copy, Kraft, Washi, Stříbrná fólie, `disc 10` jen čelo, přibývají s druhy papíru); **nástěnka s pohlednicemi** (kraftová deska, 16 míst Atlasu jako krémové kartičky s barevným obrázkem, `panel` 2 + 2, přibývají s místy); provázek s hotovými vlaštovkami (`flag`, barevné, **bez obrysu a ne bílé**, S-6); zvolená vlaštovka na stole (`plane.js`, jediná bílá s obrysem, celý potisk).
- **△:** stůl a lampa ~30, papíry a kelímek ~20, police ~50, nástěnka ~70, provázek ~10 ≈ **180 △**. LOD 1 a 2: 0 (za oddálení se interiér neukazuje, stačí stín střechy).
- **Barvy:** deska stolu `PT.kraftDark`, kelímek `PT.teal`, nástěnka `PT.kraft`, kartičky `PT.cream`; vše `mix(barva, city.side, .2)` (interiér o tón tmavší a méně sytý než fasáda, je ve stínu střechy), aby dítě a vlaštovka zůstaly první, co oko najde.
- **Stavy:** počet rolí 1–4, počet pohlednic 0–16. Stav čte model z uložené hry, ne za snímek (stavba při změně).

#### H4 `loft-balcony` pavlač s půdními dveřmi
- **Rozměry:** deska 4 × 2,4 × 0,2 m na dvou konzolách, zábradlí 0,95 m (sloupky po 0,5 m, madlo), půdní dveře 0,95 × 2,05 m otevřené ke kameře, klika.
- **△:** deska 8, konzoly 4, zábradlí 9 × 2 + 2 = 20, dveře a rám 6, klika 8 ≈ **46 △** (LOD H; zábradlí tu jde po sloupcích, protože je zblízka 80 px/m, výjimka z D-1 a `balcony`).
- **Barvy:** deska `PT.kraftDark #9c7a55`, zábradlí a dveře `#3d4f7a` (S-2), klika `PT.cream` (ne hořčicová).
- **Silueta:** vodorovná hrana s řídkým hřebenem sloupků; za vlaštovkou při míření je nebe, ne zábradlí (ruka je 1,4 m nad deskou, madlo 0,95 m).

#### H5 `hoist-beam` trám s kladkou
- **Účel:** místo pro hák Crane Lift (01 §1, úrovně zvedají plošinu nad pavlač) a ukazatel větru.
- **Rozměry:** trám 9 × 0,3 m z vrcholu štítu přes pavlač, kladka ⌀ 0,45 m, lano, košík papírů 0,65 × 0,45 m; praporek větru na konci trámu (páska 0,8 m). Varianty: **hák s plošinou Crane Lift úr. 1–3** (plošina 1,5 / 3 / 4,5 m nad pavlačí).
- **△:** trám 8, kladka 12, lano 2, košík 8, praporek 2 ≈ **32 △**, hák s plošinou +20.
- **Barvy:** trám a košík `PT.kraftDark`, lano `PT.pencil`, praporek `PT.tape #efe0a8`. Nic bílého s grafitem, vše matné (S-6).
- **Pohyb:** praporek vlaje podle větru „on twos“ (atribut `sway`, bez vlastního DC); reduced motion: natočený bez vlání (S-7).

#### H6 `retaining-wall` opěrná zeď se schody
- **Rozměry:** zeď 31 × 1,1 m se spárami, 7 schodů dolů do ulice.
- **△:** zeď 8, spáry 11 × 2, schody 7 × 8 ≈ **86 △**. **LOD 2:** zeď jako `lista` 4.
- **Barvy:** `D1.ground.near #dcc29b` (návrh 02 měl `#d9bf98`; sjednoceno na existující barvu, žádný nový hex), spáry `mix(zeď, city.side, .3)`.

**Souhrn G2b:**

| | △ (LOD H) | Strop `tris:[0, 1, 2]` (H = LOD 0 místa odhodu) |
|---|---|---|
| H1 `kid` | ~70 | [80, 20, 0] (H / oddálení) |
| H2 `workshop-attic` | ~200 | [230, 0, 20] |
| H3 `workshop-interior` | ~180 | [200, 0, 0] |
| H4 `loft-balcony` | ~46 | [55, 0, 0] |
| H5 `hoist-beam` | ~32 (+20 hák) | [60, 0, 0] |
| H6 `retaining-wall` | ~86 | [95, 0, 4] |
| **Celkem** | **~615–635** | **≤ 720** (dřív `workshop` [1 000, 0, 30]) |

Kontrola (art-review, kap. 5): snímek míření na 375 × 667, 932 × 430 a 1280 × 800; za vlaštovkou nebe; kolem ruky nic bílého ani grafitového; dítě v šedi na 25 %; menu s domkem v pravých dvou třetinách.

### 3.8 Vlaštovky: skupina V (zadání pro budoucí dávku)

Schváleno 14. 10. (06, „Odemykatelný obsah“ bod 1: siluety podle `img/obsah/siluety.png`). Pravidla M1–M8 a skiny: bible 05 kap. 17. Tvary jsou v `img/obsah/siluety.mjs` (objekt `M`, konvence jako `geometry.planeShape`: nos +x, délka 1, y nahoru, z rozpětí; uvedená je polovina, zrcadlí se podle z). **Herní statistiky ladí simulace** (06 bod 2, `research/obsah/04-ekonomika.md`), karty určují jen vzhled.

**Společné pro V1–V5:**
- **Rozpočet ≤ 12 △** na model (obrys razítkem 8 kopií ≤ 96 △); draw calls beze změny (výplň, obrys, přehyb, stopa, stín do masky).
- **Délka** jako Dart (`PLANE_SCALE 7,75` × `plan.plane.scale`), v ruce 0,5 m (M-2).
- **Barvy:** horní plochy = papír (bible 17.3), spodní papír × `#cdd3e3`, **svislé plochy natočené ke kameře jako horní papír** (M6, změna `planeColors`), obrys grafit 2,6 px (Kraft 2,9), přehyby tužkou podle modelu (M7).
- **UV** = půdorys listu (u ocas → nos, v rozpětí) pro potisk; razítko ve středu křídla.
- **Kontrola (M8):** `node research/design/img/obsah/siluety.mjs` po úpravě tvaru → IoU ≤ 0,75 proti všem modelům, plocha 0,75–1,4 × Dart, opsaná kružnice ≤ 0,75 délky; pak snímek ve hře (24 px na telefonu rovně, stoupání, střemhlav) a v ruce dítěte.
- **Zamčený vzhled v Dílně:** 2 nejbližší plně s cenou, další jako silueta (06 bod 5); art navrhuje tužkovou skicu přehybů (bible 17.6).

#### V1 `plane-hawk` Hawk / Sokol
- **Předobraz:** skládaná „stíhačka“ s odděleným křídlem. **Podpis:** „letadýlko“, dlouhá úzká šípová křídla, mezi trupem a křídlem je vidět nebe (osa E).
- **Tvar (polovina):** trup `[.55,0,0] [-.45,0,0] [.1,.02,.05]`; křídlo 2 trojúhelníky `[.18,.02,.04] [-.08,.02,.04] [-.36,.07,.6]` a `[.18,.02,.04] [-.36,.07,.6] [-.24,.07,.62]`; kýl `[.55,0,0] [-.45,-.1,.012] [-.45,0,0]`. Křídla 0,62 do strany, šíp 0,4.
- **△:** 8. **Plocha / Dart:** 1,01. **Nejbližší IoU:** Dart 0,70.
- **Přehyby:** dvě linky po náběžné hraně křídla. **Podpisový skin:** K6 Hawk Feather.
- **Riziko:** úzké křídlo; mezera mezi křídlem a trupem musí na 24 px zůstat ≥ 7 px, jinak podpis zmizí. Razítko se na křídle zmenší (v = 0,7).

#### V2 `plane-kite` Kite / Drak
- **Předobraz:** široký „hang glider“ s vytaženými konci. **Podpis:** vysoký lichoběžník, konce křídel nahoře (osy A, D, F).
- **Tvar (polovina):** `[.3,0,.06] [-.45,0,0] [-.45,.3,.56]`, `[.3,0,.06] [-.45,.3,.56] [-.05,.3,.58]`, nos `[.3,0,0] [.3,0,.06] [-.45,0,0]`, kýl `[.3,0,0] [-.45,-.05,.012] [-.45,0,0]`. Rozpětí 0,58, vzepětí +0,3, tupý nos 0,3.
- **△:** 8. **Plocha / Dart:** 1,34 (nejbližší horní mez 1,4). **Nejbližší IoU:** Glider 0,72.
- **Přehyby:** přehyb vzepětí podél trupu. **Podpisový skin:** K7 Kite Tail (mašle ≤ 0,4 délky, sloučené do výplně).
- **Riziko:** největší plocha, hlídat M4 (kruh QTE) a „nic většího než vlaštovka“ vůči kruhu.

#### V3 `plane-skimmer` Skimmer / Žabka
- **Předobraz:** plochá „žába“ s ohnutými konci dolů. **Podpis:** plochá tupá deska, konce křídel dolů, masa vpředu dole (osy C, D, F).
- **Tvar (polovina):** `[.42,0,.13] [-.45,0,0] [-.4,-.2,.4]`, `[.42,0,.13] [-.4,-.2,.4] [.1,-.16,.4]`, nos `[.42,0,0] [.42,0,.13] [-.45,0,0]`, kýl `[.42,0,0] [-.45,-.02,.012] [-.45,0,0]`. Useknutý nos šíře 0,26, konce −0,2, bez výrazného kýlu.
- **△:** 8. **Plocha / Dart:** 1,14. **Nejbližší IoU:** Glider 0,75 (na hranici).
- **Přehyby:** zlom konců křídel. **Podpisový skin:** K8 Skimmer Ripples.
- **Riziko:** proti Glideru na hranici prahu; kdyby IoU po úpravě vzrostlo, prohloubit konce dolů (−0,24), ne zvětšit plochu.

#### V4 `plane-sail` Sail / Plachta
- **Předobraz:** šipka s jedním přehybem nahoru jako plachta. **Podpis:** trojúhelníková plachta nahoru uprostřed (osa B).
- **Tvar (polovina):** křídlo `[.55,0,0] [-.45,0,0] [-.49,.05,.3]`, kýl `[.55,0,0] [-.45,-.08,.012] [-.45,0,0]`, plachta `[.15,0,.01] [-.45,0,.01] [-.4,.52,.01]` (dvojitá vrstva 1 cm od středu, M5). Výška plachty 0,52 délky.
- **△:** 6. **Plocha / Dart:** 1,14. **Opsaná kružnice:** 0,74 (hranice M4).
- **Barvy:** plachta jako horní papír (M6), jinak by byla šedomodrá. **Podpisový skin:** K9 Sail Stripes (pruhy viditelné i za letu).
- **Riziko:** plachta je svislá plocha, bez M6 vypadá jako spodek; rychlá volba Sail při míření (06 bod 5) potřebuje siluetu čitelnou i v ruce (0,5 m, 40 px).

#### V5 `plane-needle` Needle / Jehla
- **Předobraz:** úzká šipka se zahnutým ocáskem. **Podpis:** tenká jehla, malá ploutvička dolů u ocasu (osy A, C).
- **Tvar (polovina):** křídlo `[.55,0,0] [-.45,0,0] [-.47,.03,.16]`, kýl `[.55,0,0] [-.45,-.05,.012] [-.45,0,0]`, ploutvička `[-.3,0,.012] [-.47,0,.012] [-.47,-.16,.012]`. Rozpětí 0,16.
- **△:** 6. **Plocha / Dart:** 0,75 (dolní mez M3). **Nejbližší IoU:** Dart 0,75.
- **Přehyby:** jedna dlouhá linka. **Podpisový skin:** K10 Needle Thread (přehyb cihlovou nití).
- **Riziko:** nejmenší plocha, na telefonu ji drží obrys; nezmenšovat.

| | V1 Hawk | V2 Kite | V3 Skimmer | V4 Sail | V5 Needle |
|---|---|---|---|---|---|
| △ (strop 12) | 8 | 8 | 8 | 6 | 6 |
| Plocha / Dart (0,75–1,4) | 1,01 | 1,34 | 1,14 | 1,14 | 0,75 |
| Nejbližší IoU (≤ 0,75) | Dart 0,70 | Glider 0,72 | Glider 0,75 | ≤ 0,70 | Dart 0,75 |
| Hlavní osa podpisu | E | A, D | C, D, F | B | A, C |

---

## 4. Rozpočet míst 1–4

Pravidla: **ulice LOD 0, střed LOD 1, dálka LOD 2**, místo odhodu LOD H (G2b), dominanty LOD 0. Statické objekty jedné vrstvy jsou **jedna sloučená geometrie** (jako dnes karty), opakované a pohyblivé drobnosti **instancované a sdílené pro celou čtvrť**. Maska stínů na zem kreslí **stínové proxy ≤ 7 △** (kap. 1.3). Obloha, mraky a balóny patří čtvrti, ne místu. Limit: **≤ 15 tis. △ a ≤ 14 DC na místo** včetně masky.

### 4.0 Domy rozhodují: tři scénáře
Domy v ulici a ve středu jsou 60–70 % všech trojúhelníků. Plocha čel (součet šířka × výška bloků `cityChunk`, změřeno): ulice 2 924 / 2 336 / 279 / 1 426 m², střed 6 668 / 6 044 / 1 659 / 3 065 m² v místech 1–4. Trojúhelníky domů podle hustoty `house-row` (kap. 3, karta 1):

| Scénář | Místo 1 | Místo 2 Trh | Místo 3 | Místo 4 | Verdikt |
|---|---|---|---|---|---|
| **A K1 dnes** (všechny díly `block`, domy trhu po ~455 △) | ulice ~18 tis. + střed ~8,8 tis. | ulice ~15 tis. + střed ~8,0 tis. | ~4,5 tis. | ~14 tis. | **nevejde se**, místa 1, 2 a 4 jsou přes limit už bez života |
| B Smíchat LOD: v ulici jen přízemí a 1. patro v LOD 0, výš LOD 1 | ~9 tis. | ~8 tis. | ~3 tis. | ~6 tis. | vejde se těsně, ale horní patra ulice (nejblíž pásu letu) jsou chudá, proti „hodně detailu všude“ |
| **C `panel` / `lista` + D-1 + 1 dům na blok** (kap. 1.3) | ulice 5,7 + střed 2,2 tis. | ulice 5,4 (4,6 s D-3) + střed 2,0 tis. | 0,7 + 0,6 tis. | 2,9 + 1,1 tis. | **doporučuji:** stejný vzhled, plný detail ve všech patrech |

Scénář C nemění, co je vidět (boky karet tenčích než 15 cm mají v záběru pod 1 px), proto to není změna vzhledu ke schválení. Ověří se v katalogu (K1) přepínačem „zblízka / v záběru hry“: snímek před a po musí být v záběru hry stejný. **Kdyby C nešlo** (např. kvůli materiálu), platí B a je to otázka pro uživatele (méně detailu v horních patrech ulice).

### 4.1 Trojúhelníky podle scénáře C (tis. △, odhad z kap. 3, počty z dnešního rozložení)

| Položka | LOD | Místo 1 Střechy | Místo 2 Trh | Místo 3 Zahrady | Místo 4 Železnice |
|---|---|---|---|---|---|
| domy v ulici (`house-row`, `house-gable`, `cottage`, `rail-shed`, vč. komínů) | 0 | 18 domů 5,7 | 29 domů 4,6 ¹ | 5 domků 0,75 | 11 budov 2,9 |
| dominanty | 0 / H | místo odhodu G2b 0,63 ⁴ + věžička 0,35 | hala 0,5 | skleník 0,6 | vodárna + nádraží 0,42 |
| domy ve středu (vč. komínů) | 1 | 14 → 2,2 | 13 → 2,0 | 6 → 0,6 | 10 → 1,1 |
| dálka (`far-skyline`) | 2 | 11 → 0,44 | 10 → 0,40 | 8 → 0,32 | 8 → 0,32 |
| nádrže, antény, prádlo | 0 | 0,32 | 0,53 | | 0,03 |
| stánky (19 × 50), girlandy (2 × 140) | 0 | | 1,23 | | |
| stromy ulice / střed, keře | 0 / 1 | 0,40 | 0,20 | 1,40 + 0,95 | topoly 0,44 |
| ploty, záhony, kůlny, větrníky, lavičky | 0 | | | 1,21 | |
| trať, vlaky (jedoucí 540 + odstavené 720), nástupiště, návěstidla, most (½) | 0 | | | tunel 0,24 ² | 1,40 + 1,26 + 0,37 = 3,03 |
| lampy, lavičky, drobnosti ulice | 0 | 0,29 | 0,15 | 0,15 | 0,27 |
| **lidé** (instancovaní, 20 / 10 △) | 0 / 1 | 19 → 0,38 | 20 + 70 v davu → 1,10 ³ | 13 → 0,26 | 26 → 0,52 |
| **auta** (instancovaná, ~14 v místě × 50) | 0 | 0,70 | 0,70 | 0,70 | 0,70 |
| země | | 0,02 | 0,02 | 0,02 | 0,02 |
| maska stínů (proxy ≤ 7 △) | | ~45 → 0,30 | ~65 → 0,45 | ~60 → 0,42 | ~45 → 0,32 |
| **Součet** | | **≈ 11,7** ⁴ | **≈ 11,9** (12,7 bez D-3) | **≈ 7,6** | **≈ 10,1** |
| Rezerva do 15 | | 3,3 | 3,1 | 7,4 | 4,9 |
| Dnes (karty + život, bez stínů) | | 3,15 | 6,91 | 3,79 | 2,02 |

¹ Na trhu je přízemí domů za stánky schované, pravidlo D-3 (přízemí v LOD 1) ušetří ~0,8 tis. ² Tunel stojí na hranici míst 3 a 4 (dnes x 636–678, v místě 3). ³ Dav 70 lidí za stánky v LOD 1. ⁴ 14. 10.: Dílna PAPER LAB (strop 1,0 tis.) nahrazena diorámatem G2b (H1–H6 ≈ 0,62–0,64 tis., kap. 3.7). Pás výhledu S-1 (střed do 150 m za startem ≤ 13 m) navíc ubere část domů středu místa 1; nepočítáno, rezerva je proto spíš větší.

**Závěr: „hodně detailu všude“ se do 15 tis. △ vejde ve všech čtyřech místech, ale jen se scénářem C.** Nejtěsněji místa 1 a 2 (rezerva ~3 tis.). Rezervu místa 3 (7 tis.) použít na zahrady (víc stromů, záhonů, ovocné stromy), přesouvat ji nejde (rozpočet je na místo).

**Kdyby místo 1 nebo 2 v K5 přeteklo** (změřeno `cardTriangles` z generátoru), postup v tomto pořadí, silueta se nemění: (1) dav za stánky jen trupy (−0,35), (2) truhlíky jen v 1. patře (−0,3), (3) stánky ve druhé řadě LOD 1 (−0,5), (4) girlanda každý druhý praporek (−0,13), (5) ve středu domy vyšší než 8 pater bez kordonů (−0,2).

### 4.2 Draw calls

| Kreslení | Místo 1 | Místo 2 | Místo 3 | Místo 4 | Poznámka |
|---|---|---|---|---|---|
| země | 1 | 1 | 1 | 1 | |
| dálka (sloučená) | 1 | 1 | 1 | 1 | |
| střed (sloučený) | 1 | 1 | 1 | 1 | |
| ulice (sloučená: domy, dominanta, stánky, prádlo, ploty, trať…) | 1 | 1 | 1 | 1 | prádlo a praporky se houpou ve vertex shaderu (atribut `sway`), bez vlastního DC |
| maska stínů (proxy, sloučená) | 1 | 1 | 1 | 1 | `08-stiny.md` kap. 6 |
| ~~Dílna (vlastní mesh, `workshop.js`)~~ | ~~1~~ | | | | nahrazeno G2b (řádky níže) |
| místo odhodu: dioráma H2–H6 | 0 | | | | **sloučené do ulice místa 1** (stejný `paperMaterial`, stencil ulice, LOD H jen jako hustší geometrie) |
| místo odhodu: stín diorámatu | 0 | | | | proxy H2 + H6 (≤ 11 △) **sloučený do masky stínů** místa 1 |
| dítě H1 | 1–2 | | | | tělo + ruka (nápřah ve vertex shaderu → 1) |
| stín dítěte | 0 | | | | proxy stojícího dítěte (≤ 4 △) v masce; pózy stín nemění (dítě se hýbe o desítky cm) |
| cedulka PAPER LAB (textura) | 1 | | | | 0, když se nápis složí z dílů jako piktogram (bez textury, ~50 △) |
| jedoucí vlak (instancované vozy) | | | | 1 | |
| sdílené pro čtvrť: lidé, auta (2 tvary), kouř, větrníky | 5 | | | | počítá se jednou na scénu |
| **Na místo** | **7–8** | **5** | **5** | **6** | **i se všemi sdílenými ≤ 13 (místo 1), limit 14** |

**Místo odhodu a strop 14 DC (návrh, 14. 10.).** Kdyby se dioráma kreslilo jako samostatné meshe (dioráma + stín, cedulka, dítě 2 + stín, k tomu vlaštovka), mělo by místo 1 ~17 DC (`research/start/02-misto-odhodu-vzhled.md` kap. 5.1), tedy nad stropem. **Navrhuji variantu A, sloučení:** statické dioráma H2–H6 patří do sloučené geometrie ulice místa 1 a jeho stínový proxy i proxy dítěte do masky stínů místa 1 (žádná výjimka z pravidel, vzhled se nemění). Místo 1 pak má 7–8 DC (země, dálka, střed, ulice, maska, dítě 1–2, cedulka 0–1) a se sdílenými pro čtvrť 12–13, pod stropem 14. Vlaštovka v ruce je hráč a počítá se do scény (≤ 120 DC), ne do místa, jako dnes. **Varianta B jen kdyby A nešlo** (např. interiér potřebuje vlastní materiál): výjimka „místo odhodu ≤ 17 DC, dokud je dioráma v záběru“; po oddálení ho ořízne frustum culling. B mění pravidlo v `.claude/rules/render3d.md`, a proto by šla k rozhodnutí uživateli jako `BLOCKED`. Změří game-dev (`perf-check`) po dávce S4, dnes NOT ASSESSED.

Jeden papírový shader pro všechny vrstvy (bible kap. 3), instancované meshe jeho variantou s instancováním. Žádné nové textury (nápisy jsou piktogramy z dílů).

### 4.3 Navržené stropy `tris:[LOD 0, LOD 1, LOD 2]` pro registr
Strop platí pro **nejbohatší variantu** při použití `panel` / `lista` (scénář C). Test v K3: `modelTriangles(m, lod, nejbohatší params) ≤ tris[lod]`; test v K5: součet místa ≤ 15 tis. včetně masky. `0` = v té vrstvě se nekreslí.

| Model | Strop | Typická varianta | Poznámka |
|---|---|---|---|
| `house-row` | **[600, 130, 13]** | 3 osy × 3 patra ≈ 175 / 40 / 13 | nejbohatší 6 os × 7 pater; místo K1 [800, 160, 40] |
| `house-gable` | [220, 45, 10] | 150 / 35 / 8 | |
| `cottage` | [180, 50, 13] | 150 / 40 / 13 | |
| `rail-shed` | [250, 60, 13] | 220 / 50 / 13 | |
| `far-skyline` | [0, 0, 50] | — / — / 40 | |
| ~~`workshop`~~ | ~~[1 000, 0, 30]~~ | | nahrazeno G2b |
| `kid` (H1) | [80, 20, 0] | jedinečná | LOD H / oddálení |
| `workshop-attic` (H2) | [230, 0, 20] | jedinečná | příčky oken smí (LOD H) |
| `workshop-interior` (H3) | [200, 0, 0] | jedinečná | nejbohatší stav: 4 role, 16 pohlednic |
| `loft-balcony` (H4) | [55, 0, 0] | jedinečná | |
| `hoist-beam` (H5) | [60, 0, 0] | jedinečná | s hákem Crane Lift úr. 3 |
| `retaining-wall` (H6) | [95, 0, 4] | jedinečná | |
| vlaštovky V1–V5 | ≤ 12 | 6–8 | razítkový obrys 8 kopií navíc |
| `corner-turret` | [350, 100, 20] | jedinečná | |
| `market-hall` | [550, 150, 25] | jedinečná | |
| `greenhouse` | [650, 120, 25] | jedinečná | |
| `station` | [300, 70, 15] | jedinečná | |
| `water-tower` | [180, 50, 15] | jedinečná | |
| `rail-bridge` | [400, 60, 20] | jedinečná | |
| `tunnel-hill` | [240, 60, 15] | jedinečná | |
| `chimney` (díl v domě) | [20, 8, 4] | | |
| `antenna` | [14, 6, 0] | | |
| `laundry` | [40, 15, 0] | | |
| `roof-tank` | [31, 15, 5] | | |
| `person` | [20, 10, 0] | | instancovaný |
| `street-lamp` | [21, 8, 0] | | |
| `stall` (trojice) | [60, 20, 6] | 50 | |
| `bunting` (na 200 m) | [150, 75, 0] | | |
| `bench`, `street-kit`, `signal`, `garden-bed` | [18, 8, 0] | 12–16 | |
| `car` | [50, 20, 0] | | instancovaný |
| `tree-round` | [110, 50, 6] | 100 / 45 / 6 | |
| `tree-poplar` | [44, 20, 6] | | |
| `hedge-fence` (pole 2,5 m) | [23, 8, 0] | | |
| `pinwheel` | [14, 6, 0] | | instancovaný |
| `garden-shed` | [50, 16, 6] | | |
| `track` (na 100 m) | [180, 12, 0] | | |
| `train` lokomotiva / vůz | [90, 30, 6] / [72, 24, 6] | | instancovaný |
| `platform` | [110, 25, 6] | | |
| `balloon` | [0, 68, 0] | | jen nebe |
| `cloud` | [0, 0, 144] | | `disc 16` místo 24 |
| `flock` (pták) | [0, 2, 0] | | instancovaný |
| `pigeon` | [30, 0, 0] | | jen v události |
| stínový proxy (každý model) | ≤ 7 | | nový výstup `shadow(params)` |

---

## 5. Pořadí výroby v K3

Nejdřív to, co je v záběru nejvíc (plocha obrazu × počet snímků). Každá skupina = jedna dávka game-deva se snímky do `img/katalog/` a jedním schválením uživatelem (K4).

| Skupina | Objekty | Proč teď |
|---|---|---|
| **G0 Díly** | `panel` / `lista` v `cardVertices` a `cardTriangles`, úpravy `windowCut`, `door`, `balcony`, `downpipe` (D-1), nové díly `eaveRoof`, `steppedGable`, `dormer`, `shopfront`, výstup `shadow(params)` | bez toho se domy nevejdou (kap. 4.0); ověřit snímkem „v záběru hry“ před a po, že se vzhled nezměnil |
| **G1 Hmota města** | `house-row` (rozšířit parametry, R14), `house-gable`, `far-skyline`, `chimney` (díl) | jsou v každém snímku letu, ~60 % plochy města; ověří stavebnici, barvy detailu (kap. 1.4) a varianty |
| **G2 Start hodu** | `corner-turret`, `person`, `street-lamp` (~~`workshop`~~ → G2b) | místo 1 vidí hráč před každým hodem; lidé jsou nejčastější „odměna pohledem“ |
| **G2b Místo odhodu** (14. 10.) | H1 `kid`, H2 `workshop-attic`, H3 `workshop-interior`, H4 `loft-balcony`, H5 `hoist-beam`, H6 `retaining-wall`, nový díl `cutRoof` | pořadí 06 bod 7: po dávkách kamery S1, S3, S2 a před stavbou místa odhodu S4; v katalogu nejdřív hezký objekt zblízka (LOD H, 80 px/m), pak záběr míření |
| **G3 Trh** | `stall`, `bunting`, `market-hall`, `antenna`, `laundry` | nejhustší místo a nejtěsnější rozpočet, změřit brzy |
| **G4 Zeleň a pohyb** | `tree-round`, `tree-poplar`, `hedge-fence`, `car`, `cottage` | stromy a auta jsou ve všech místech |
| **G5 Zahrady** | `greenhouse`, `pinwheel`, `garden-shed`, `garden-bed`, `bench` | místo 3 má nejvíc rezervy, tady se ukáže „hodně detailu“ |
| **G6 Železnice** | `track`, `train`, `platform`, `station`, `water-tower`, `rail-shed` | celé místo 4 najednou (6 objektů, `rail-shed` je varianta `house-row`) |
| **V Vlaštovky** (14. 10.) | V1 Hawk, V2 Kite, V3 Skimmer, V4 Sail, V5 Needle (kap. 3.8) | budoucí dávka s Dílnou a obchodem; nezávisí na městě, potřebuje UV a M6 v `planeShape` / `planeColors` |
| **G7 Brána, vzduch, drobnosti** | `tunnel-hill`, `rail-bridge`, `roof-tank`, `street-kit`, `signal`, `balloon`, `cloud`, `flock`, `pigeon` | menší plocha v záběru; most čeká na T3 plánu přechodů; holub patří k událostem (P3 bible) |

Kontrola každého modelu (art-review, 10 kap. 4): smysl (předobraz, dveře u země, okna v patrech), silueta v šedi na 25 %, měřítko vedle `person` a vlaštovky (`img/katalog/meritko.svg`), paleta jen z kap. 1.4, △ podle karty ±20 %.

---

## 6. Rozpory a otevřené body

### 6.1 Rozpory kód × karty (návrh, co platí)
| # | Kde | Dnes | Karta | Návrh |
|---|---|---|---|---|
| R1 | `cityChunk` výšky domů | spojité 6–22 m (ulice), 10–40 m (střed) | `přízemí + n · 3 + 0,5` | generátor v K5 zaokrouhlí výšku na patra (±1,5 m, rozložení se téměř nezmění) |
| R2 | `lifeCards` člověk | 2,0 m (trup 1,3 + hlava) | 1,7 m | platí karta |
| R3 | `palette.js PAPIR.life.bunting` | obsahuje `PT.mustard #e2a43a` | „hořčicová jen hodnota“ (bible kap. 2.2) | nahradit `#f2b65a`; **BLOCKED** (změna barvy, kterou hra už má) |
| R4 | `lifeCards` auto | 2,25 m vysoké, kabina krémový kvádr | 1,5 m, okna jako výřez | platí karta |
| R5 | `suburbLife.chimneys` | `y = b.h`, ve štítové střeše zapuštěný | komín stojí na sklonu (K1 `chimney` + `roofAt` už umí) | v K5 komíny jen z modelů domů |
| R6 | `suburbLife.laundry` | výška 45–65 % domu, mimo patra | ve výšce parapetu mezi okny | kotvy z modelu domu |
| R7 | `PAPIR.life.rail` | kolejnice z `CYBER.life.rail` | `PT.pencil` | platí karta |
| R8 | `PAPIR.fx.bird` | `PT.pencil` v pásu letu | `mix(pencil, nebe, .4)` | platí karta (P1) |
| R9 | `paper-cards.placeCards` okna | patro 4,2 m, okno 1,3 × 1,8 (ulice), 1,6 × 2,2 (střed), náhodně 55 % oken | patro 3 m, okno 1,2 × 1,4 všude, všechna patra (K1 `windowCut` už tak) | platí karta, v K5 okna jen z modelů |
| R10 | `cityChunk.lamps` | z = +9 (popředí), v papíru se nekreslí | chodník z ≈ −17, 7 na místo | platí karta; popředí zůstane prázdné (P1) |
| R11 | `suburbs-layout` vagony | 20 m dlouhé | 2 spřažené vozy po 10 m | platí karta (rozložení stejné) |
| R12 | `stall` | 7 m široký stánek | trojice 2,3 m | platí karta (rozložení stejné) |
| R14 | K1 `house-row` parametry | `floors` 2–4, `bays` 2–3 (šířka 6,2 nebo 8,6 m) | bloky `cityChunk` mají 6–16 m a 6–38 m | `floors` 2–7 (ulice) / 3–12 (střed), `bays` 2–6, 1 blok = 1 dům |
| R15 | K1 `parts.js` | každý detail je `block` (8 △), `house-row` 245–773 △ | `panel` 2 / `lista` 4 (kap. 1.3), změřeno 111–285 △ | scénář C (kap. 4.0) |
| R16 | K1 `house-row.tris` | [800, 160, 40] | [600, 130, 13] pro 6 os × 7 pater | kap. 4.3 |
| R17 | K1 detail pod 1 px | příčka okna 0,06 m, klika 0,1 m, sloupky zábradlí 0,04 m, svod 0,12 m | D-1 | příčky, kliky a sloupky zábradlí jen v LOD H místa odhodu (G2b), jinde zábradlí jako 1 karta, svod 0,2 m |
| R-S1–R-S9 | místo odhodu (Dílna, kamera, měřítko, barvy dítěte, pás výhledu) | | | **vyřešeno 14. 10.** podle 06, tabulka v bible 05 kap. 16.1; v kódu dávky S1–S5 |
| R13 | bible P3 „hloubku dělá opar, ne detail“ × rozhodnutí „hodně detailu všude“ | | detail ve středu a dálce tónový a siluetou (D-2) | doplnit do bible 05 kap. 3 po schválení |

### 6.2 BLOCKED (otázky pro uživatele)

BLOCKED: **Dominanty míst 1–4.** Návrh 10 měl „kostel nebo radnice“. Navrhuji místo toho dominanty, které vyprávějí místo: 1 nárožní dům s věžičkou (vedle Dílny), 2 tržní hala s lucernou, ze které jde pára události „poryv od tržnice“, 3 velký skleník, 4 železniční vodárna a nádraží. Kostel s věží by soupeřil s Hodinovou věží (místo 15), radnice by byla nudný kvádr. Možnosti: (a) dominanty podle kap. 3 (doporučuji), (b) přidat kostelík do místa 1 místo nárožního domu, (c) jiný nápad uživatele. Skica měřítka: `img/katalog/meritko.svg`.

BLOCKED: **Drobnosti ve skutečné, nebo herní velikosti?** Praporek ve skutečnosti 0,3 m je na telefonu necelý 1 px, dnes ho hra kreslí 1,1 m. Totéž větrník (0,3 → 1,2 m) a holub (0,3 → 2,5 m). Možnosti: (a) herní velikost jen pro věci, které hráč potřebuje vidět (holub v události, větrník kvůli bonusu Pinwheel) a ozdoby (praporky) ve zvětšené velikosti 0,8 m, (b) všechno skutečně, (c) všechno herně jako dnes. Doporučuji (a): „jedno měřítko“ z 10 platí pro stavby, lidi a auta, výjimky jsou jmenovitě v kartách.

BLOCKED: **Žlutá na praporcích.** Paleta má mezi praporky hořčicovou `#e2a43a`, kterou bible vyhradila pro mince („hořčicová jen hodnota“). Možnosti: (a) nahradit světlejší oranžovožlutou `#f2b65a` z domů čtvrti (doporučuji, rozdíl je malý, pravidlo zůstane čisté), (b) nechat a pravidlo zmírnit na „hořčicová v UI jen hodnota“.

### 6.3 Otevřené body (bez rozhodnutí uživatele)
- **Px/m (kap. 1.2) jsou spočítané, ne změřené.** K1 má přepínač „v záběru hry“: změřit velikost okna v px na 1280 a 375 a upravit tabulku D-1.
- **Telefon:** kvalita 0 posune LOD (D-4); výkon s novými modely NOT ASSESSED (telefon nebyl k dispozici ani pro bibli).
- **Rozhraní K1:** tvary `panel` / `lista`, nové díly a stínový proxy (kap. 1.3) jsou návrh pro game-deva; scénář C v kap. 4.0 na nich stojí. Úsporu jsem spočítal na `house-row` z K1 (`cardTriangles` všech 30 variant, skript mimo repo), vzhled v záběru hry je NOT ASSESSED.
- **Stránka katalogu** `prototype-katalog.html` jsem neotevřel (zákaz prohlížeče), karty jsou psané z kódu K1.
- **Večer (čtvrť 4) a lampy:** `street-lamp` má ráno sklo `D1.glass`; večerní svit patří lampionům čtvrti 4 (bible kap. 4), ne čtvrti 1.
- **Dílna roste s postupem:** schváleno jako součást konceptu 2 (nástěnka pohlednic a role papírů v H3, hák v H5). Které stavy kdy přibývají, dává game design a product-designer.
