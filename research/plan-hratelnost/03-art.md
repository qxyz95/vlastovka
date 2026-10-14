# Plán hratelnosti: art (postavička, první záběr, život čtvrti, jediný styl)

> **NÁVRH** (art-director, 15. 10. 2026). Závazné až po schválení uživatelem (orchestrátor zapíše do `research/bonusy/06-rozhodnuti.md`).
> Podklad: poznámky tvůrce `research/playtest/2026-10-15-poznamky-tvurce.md`, výklad N1–N10 `2026-10-15-vyhodnoceni.md`, rozhodnutí 06 „Poznámky tvůrce z hraní“ body 1 a 3. Bible `research/design/05-styl-papir.md` (dál „bible“), katalog `research/design/11-katalog-ctvrt1.md` (dál „katalog“), místo odhodu `research/start/02-misto-odhodu-vzhled.md`.
> Náčrty: `research/design/img/hratelnost/` (skript `hratelnost.mjs`, Node bez závislostí, stejná kamera a město jako hra). Prohlížeč jsem nepoužil, vzhled ve hře je **NOT ASSESSED**.

## 0. Shrnutí

| # | Co | Návrh | Pro koho |
|---|---|---|---|
| N5 | Plastická postavička | **Skládaná loutka z papíru**: tuhé díly (hranoly o 4–8 stěnách), natočená ke kameře ve ¾ pohledu, ~180 △, 1 draw call, bez obrysu. Stejná výška 1,2 m, stejné barvy. | game-dev (model + rig) |
| N6 | První záběr | **Úvodní záběr 30 m** (telefon 18 m): dům s dílnou v řezu vlevo, dítě vpravo od středu, výzva textem nahoře v nebi. Po dotyku 0,6 s jízda na záběr míření 16 m. Nahrazuje záběr menu 28 m. | game-dev (kamera), product-designer (text) |
| N6 | Kouř za dítětem | Kouř z komínů **v papírovém stylu úplně škrtnout**. | game-dev |
| P2 | Zbytky starého stylu | Celá vrstva „život čtvrti“ (`life.js`, `life3d.js`) se dnes kreslí v cyber stylu i v papíru. Převést na papírové modely z katalogu, škrtnout drony, robota Bolts, reklamy a kouř. | game-dev |
| N7 | Jediný styl | Seznam, co smazat a co přepnout, aby zůstal jen papír (kap. 4). Hlavní bod: přepínač a odkaz „NEON CITY“ vlevo nahoře. | game-dev, product-designer |

---

## 1. Plastická postavička z papíru (N5)

### 1.1 Co je dnes
`src/render3d/models/kid.js` + `kid-rig.js`: dítě je z **plochých karet** čelem ke kameře (49 △ v póze míření, strop `tris [80, 20, 0]`), jeden dynamický buffer = 1 draw call, pózu skládá CPU (záklon, couvnutí, dýchání, ruka jako proužek od ramene k dlani). Ze strany vypadá jako výstřižek: tělo je „zepředu“, obličej z profilu. Uživatel chce objem a víc stran (Tearaway, Paper Mario 3D), ne klasický 3D model (06 bod 3).

### 1.2 Tři varianty tvaru (`img/hratelnost/postavicka-varianty.png`)
Stejná výška 1,2 m, barvy (bible kap. 9.4), klouby i póza míření. Řádky: velký náhled, 96 px (desktop při míření), 64 px (telefon), 64 px v šedi (test bible kap. 6).

| | **A Skládaná loutka (doporučuji)** | B Vrstvená karta 2,5D | C Oblá figurka |
|---|---|---|---|
| Tvar | díly jako složené papírové krabičky a ruličky: hlava osmiboký hranol se zkosením, pláštěnka šestiboký komolý jehlan s přehybem vpředu, ruce a nohy čtyřboké ruličky, čepice „lodička“ | dnešní karty + tloušťka 2 cm a řezaná hrana, natočení jen ±15° | 8–16 stěn, zaoblená hlava a tělo |
| △ (náčrt) | **182** (LOD 1: 52) | 196 (dá se srazit na ~120) | 904 |
| Objem, „víc stran“ | ano: 2–3 tóny na každém dílu, z ¾ je vidět bok i čelo | ne, jen hrana | ano |
| Papír (P2) | ano: čisté geometrické stěny jako Monument Valley, ostré přehyby | ano, ale plochá | spíš plast nebo hlína |
| Telefon 64 px | čte se jako „dítě v pláštěnce“, objem nese světlé čelo a tmavší bok pláštěnky | čte se nejlíp (velký obličej), ale je plochá | jako A, tvar se slévá |
| Riziko | obličej zakrývá čepice (viz 1.4) | nesplní zadání | rozpočet, „hračka z plastu“ |

**Proč A:** splní zadání (objem a víc stran) a zůstane papírem. Stěny jsou ploché, každou stínuje papírový materiál jedním tónem, takže přehyby vypadají jako složený papír, ne jako zaoblený 3D model. Rozpočet je stejný jako u B a pětina C.

### 1.3 Díly varianty A (LOD H)

| Díl | Tvar | Rozměry (m) | △ | Barva (bible 9.4, beze změny) |
|---|---|---|---|---|
| hlava | osmiboký hranol, horní hrana zkosená | ⌀ 0,30 → **0,34** (viz 1.4), výška 0,29 | 44 | kůže `#f3d2b4` |
| vlasy | čtyřboká „stříška“ vzadu na hlavě | 0,14 × 0,17 | 12 | `pencil700 #4a4038` |
| oči | 2 destičky na přední stěně hlavy | 0,036 | 4 | `pencil700` |
| čepice | lodička z novin: 2 trojúhelníkové stěny, hřbet podél směru pohledu (z boku trojúhelník jako dnes) + páska | 0,40 × 0,25 | 12 | `kraft #c9a57c` + proužek `tomato #d9472b` |
| pláštěnka | šestiboký komolý jehlan, hrana vpředu = přehyb, spodní víčko (kamera je při míření níž) | šířka 0,52 → 0,34, hloubka 0,30 → 0,22, výška 0,52 | 20 | `#f2b65a` |
| ruce 2× | čtyřboká rulička | 0,1 × 0,55 | 24 | jako pláštěnka |
| dlaně 2× | osmistěn | ⌀ 0,12 | 16 | kůže |
| nohy 2× | čtyřboká rulička | 0,12 × 0,45 | 24 | `#3d4f7a` |
| boty 2× | klínek | 0,2 × 0,06 | 24 | `pencil700` |
| **celkem** | | | **~180** | |

**LOD 1** (menu, oddálení po výhozu, dítě < 48 px): hlava šestiboká bez zkosení, trup čtyřboký, ruce a nohy trojboké bez víček, bez dlaní, bot, vlasů a očí: **52 △**. **LOD 2:** 0 (za letu dítě není vidět). Stínový proxy beze změny (≤ 4 △, katalog 4.2).

**Rozpočet:** strop `tris` z `[80, 20, 0]` na **`[220, 60, 0]`** (+20 % rezerva). Místo odhodu má strop 1 200 △ včetně dítěte (katalog karta 5), dioráma ~565, s dítětem ~785. **Draw calls beze změny: 1** (dítě a praporek v jednom dynamickém bufferu, jako dnes), proxy stínu v masce. Vertexů ~550 (bez indexů), přepočet za snímek je zanedbatelný.

### 1.4 Úpravy proti náčrtu (co náčrt ukázal)
- **Obličej musí být vidět.** V náčrtu zakrývá obličej čepice a v míření i paže. Proto: hlava ⌀ 0,34 m (o 13 % větší, „hlavičková“ proporce jako Tearaway), čepice sedí výš (páska nad očima, ne přes ně), oko na stěně přivrácené ke kameře.
- **Hází vzdálenější ruka.** Kdyby házela ruka blíž ke kameře, šla by v míření přes obličej. Vzdálená ruka jde za hlavou nahoru k bodu výhozu (vlaštovka je pořád před vším, P1), blízká ruka **ukazuje směr hodu** (hráč vidí, kam míří, i na postavičce). V klidu drží vlaštovku obě ruce před hrudí.
- **Natočení ke kameře (yaw):** klid 43°, míření a nabíjení 32°, výhoz 14° (trup se při švihu stočí za hodem), mávání 52°, sed 34°, u stolu 29°. Bez natočení by byl z boku vidět jen profil a objem by se ztratil.

### 1.5 Technika (pro game-deva)
- **Tuhé díly s klouby, bez skinningu** (papírová loutka s nýtky, Tearaway): kořen v chodidlech (natočení, záklon, couvnutí, sed), trup v kyčli, hlava v krku (natočení, kývnutí), ruce v ramenou (švih v rovině boku + odtažení), nohy v kyčlích, čepice, vlasy a oči na hlavě, dlaně a boty na konci končetin. Klouby schovává překryv dílů.
- `kidRig` / `poseKid` zůstává smlouvou: CPU skládá pózu do předem alokovaného bufferu, **normály se otáčejí s díly** (dnes se nepočítají, karty mají normálu +z), žádná alokace za snímek.
- **Bod výhozu (M-3):** v pózách s vlaštovkou v ruce (míření, nabíjení) se celé dítě posune tak, aby dlaň vzdálené ruky byla přesně v `LAUNCH.hand` (12 m). Ruka se nenatahuje.
- **Stínování po stěnách** papírovým materiálem (bible kap. 3), plošně, bez přechodu uvnitř stěny: stěna ke kameře = barva dílu (+3 %), boky až `mix(barva, #5b4f7a, .32)`, přivrácené ke slunci o 0,08 světlejší, horní plochy `mix(barva, #fffaf0, .25)` (ne 0,55 jako hrana karet, jinak by temeno a ramena zbělela vedle vlaštovky), spodní `mix(barva, side, .42)`. Funkce `shade()` v `hratelnost.mjs` je předloha.
- **Bez obrysu** (P1: obrys má jen vlaštovka). Žádná toon rampa.

### 1.6 Čitelnost (spočteno z hex, WCAG poměr)
| Část | proti nebi u ruky (`#a6d0e8` / `#d8e9ea`) |
|---|---|
| pláštěnka čelo `#f2b65a` | 1,10 / 1,44 (dnes jediný tón) |
| **pláštěnka bok `#c59764`** | **1,60 / 2,10** (nové díky objemu) |
| nohy `#3d4f7a` | 4,93 / 6,45 |
| vlasy `#4a4038` | 6,15 / 8,05 |
| obrys vlaštovky grafit | 6,7–12,2 (bible 9.3) |

Objem dítěti pomáhá: tmavší bok zvedá kontrast siluety o ~0,5–0,7. Pořád zůstává pod obrysem vlaštovky (hierarchie bible kap. 6 platí). Vlasy jsou tmavé a jsou blízko vlaštovky, proto zůstávají **vzadu na hlavě**, dál od ruky. Test v šedi na 64 px (náčrt): vlaštovka je první, dítě druhé. Ve hře **NOT ASSESSED**.

### 1.7 Pózy (`img/hratelnost/postavicka-pozy.png`)
| Póza | Kdy | Co dělá | Pohyb (reduced motion) |
|---|---|---|---|
| klid | úvodní záběr, Dílna | stojí natočené k hráči, vlaštovka v obou rukou před hrudí | dýchání ±1 cm on twos (stojí) |
| míření | držení úhlu | vzdálená ruka nahoře s vlaštovkou (12 m), blízká ukazuje směr, hlava mírně vzhůru | ruka blízká sleduje úhel (zůstává, je to informace) |
| nabíjení | držení | záklon 0,08 rad a couvnutí jako dnes `kidPose`, ruka s vlaštovkou dozadu, blízká vpřed na cíl, pokrčení | totéž bez chvění |
| výhoz | 0,3 s po puštění (`KID_THROW`) | švih ruky, trup se stočí za hodem, výpad přední nohou | švih zůstane (je to zpětná vazba), bez výpadu |
| mávání | po výhozu | otočí se k hráči, blízká ruka mává on twos | ruka nahoře bez mávání |
| sed | menu, pokud zůstane | sedí na pavlači, nohy přes okraj | stojí |
| u stolu | panel Dílny | předklon nad stolem, ruce na desce, hlava dolů | stojí |

### 1.8 Co změnit v bibli a katalogu po schválení
- Bible kap. 9.4 „Dítě“: věta „hlava kotouč, pláštěnka lichoběžník…“ → skládaná loutka (tab. 1.3), ¾ natočení, hází vzdálená ruka, stínování po stěnách.
- Katalog karta H1: strop `[220, 60, 0]`, LOD H ~180, LOD 1 ~52.
- `person` (lidé ve městě) zůstává plochý (katalog karta 7, 20 △ instancovaný). Hrdina je jediná plastická postava. Rozdíl je záměr: hráčova postava je nejblíž kameře (80 px/m), lidé ve městě mají 4–10 px.

---

## 2. První záběr: dům s dílnou (N6)

### 2.1 Dnes
Hra po načtení ukazuje rovnou **záběr míření** (16 m, `AIM_SHOT`): dveře, zábradlí, trám a dítě 96 px. Dům s dílnou v řezu (koncept 2, schválený 14. 10.) je vidět jen v náčrtu menu (28 m), který ve hře zatím není. Na screenshotu 223830 a na `uvod-zaber.png` (1) je za dítětem kouř.

### 2.2 Návrh: úvodní záběr (`img/hratelnost/uvod-zaber.png`)
Nová konstanta v `launch-site.js` (návrh, stejný tvar jako `MENU_SHOT`):

`INTRO_SHOT = {width: 30, portraitWidth: 18, landWidth: 30, pitch: 2, fov: 20, at: [.64, .66], portraitAt: [.80, .62], landAt: [.66, .64], planeInHand: .5}`

Polohy spočtené kamerou hry (`anchored` = `restCamera`, fov 20°), podíl šířky a výšky obrazu:

| Zařízení | Šířka | Dům (střecha vlevo → dveře pavlače) | Hřeben | Stůl v dílně | Dítě | Dítě px | Místo pro text |
|---|---|---|---|---|---|---|---|
| desktop 16 : 9 | 30 m | 0,11 → 0,54 | 0,31 shora | 0,20 | 0,63 | 51 | střed, 0,08–0,28 shora (nebe nad hřebenem) |
| telefon na šířku 932 × 430 | 30 m | 0,13 → 0,56 | 0,21 | 0,22 | 0,65 | 37 | střed, 0,04–0,18 |
| telefon na výšku 375 × 667 | 18 m | (střecha vlevo uříznutá) → 0,64 | 0,44 | 0,06 | 0,78 | 25 | střed, 0,12–0,32 |

**Kompozice:** dům s dílnou v řezu (stůl, police s rolemi, nástěnka s pohlednicemi, vlaštovky na provázku) zabírá levou polovinu, dítě stojí na pavlači vpravo od středu a dívá se k hráči (póza klid), vpravo od něj je nebe se sluncem a směr hodu. Text výzvy „Throw it / Hold and release“ (N9, rozložení vlastní product-designer) patří **do nebe nad hřebenem, vodorovně na střed**. Na střed obrazovky svisle ne, tam je podkroví s dílnou. **Nic nesmí zakrýt** obdélník dítěte a vlaštovky (desktop 0,56–0,70 × 0,50–0,82, v náčrtu rajčatově). Mince malé vpravo nahoře (N8).

**Proč ne širší záběr míření:** aby byl dům celý v záběru a ruka zůstala na 0,38, musel by mít záběr ~43 m. Dítě by mělo 36 px a vlaštovka 15 px, míření by ztratilo čitelnost (M-2, P1). Proto dva záběry: nejdřív ustavující, pak blízký.

**Vztah k záběrům 16 m a 28 m:**
- `AIM_SHOT` 16 m (sklon −8°) zůstává beze změny pro míření, nabíjení i Throw again.
- `MENU_SHOT` 28 m s rukou na 0,85 počítal s menu ve sloupci vlevo (07-menu). Podle N8 hra okolí stránky nemá, proto **úvodní záběr = záběr menu** (jedna konstanta, ne dvě). Kdyby product-designer menu se sloupcem tlačítek ponechal, platí pro menu dnešní `MENU_SHOT` a pro úvod `INTRO_SHOT`. Mají stejný sklon, takže přechod mezi nimi je jen posun.

### 2.3 Přechod úvod → míření (`img/hratelnost/uvod-prechod.png`)
- **Spouštěč:** první stisk (pointerdown, mezerník, Enter). **Vstup se přijímá hned** (07-menu §6, 01 §2.1): nabíjení běží už během jízdy, mířidla se kreslí od promítnuté polohy ruky v každém snímku. Úvod sám neodjíždí. Tvůrce chce dům vidět, automatický odjezd po 1–2 s by ho schoval dřív, než ho hráč stihne vidět.
- **Jízda 600 ms**, ease in-out: šířka logaritmicky 30 → 16 m (zoom působí rovnoměrně), kotva ruky lineárně (0,64; 0,66) → (0,38; 0,60), sklon +2° → −8°. Dítě přejde z klidu do míření v půlce jízdy (vlaštovka z obou rukou do vzdálené ruky). Vlaštovka zůstává 0,5 m (M-2).
- **Kdy je úvod vidět:** po načtení hry a po zavření Dílny, Atlasu nebo menu. **Throw again** jde rovnou do míření střihem pod kartou výsledku (01 §2.3), úvod se neopakuje.
- **Reduced motion a Calm camera:** střih (nebo prolnutí 0,2 s) místo jízdy. Úvod stojí, dítě nedýchá.
- Úvod kreslí dioráma, dítě (LOD H, 51 px je pořád blízko) a první dvě místa. Rozpočet místa 1 platí (14 DC), měřit `perf-check` po dávce.

### 2.4 Za dítětem nebe, žádný kouř
Bible S-6 dovoluje kouř „za dítětem, matný, alfa ≤ 0,6, menší než vlaštovka“. Ve hře je kouř úplně jiný (kap. 3): neprůhledné fialové low-poly koule velké 3–7 m z vrstvy `life3d`. **Návrh: S-6 zúžit, „v pásu výhledu místa odhodu (do ~150 m za startem) nic nestoupá ani nelétá“** (kouř, balóny, ptáci, drony). Za dítětem je jen nebe, slunce, mraky výš než hřeben a střechy pod pásem S-1.

---

## 3. Kouř a život čtvrti: co zůstalo ze starého stylu (N6, P2)

### 3.1 Diagnóza
`src/render3d/life.js` (`const K = CYBER.life`) a `src/render3d/life3d.js` (`const K = CYBER.life`, `MeshToonMaterial`, obrysové obaly `hull` a `thinHull`, kouř `toon(CYBER.steam)`) **berou barvy a materiály vždy z cyber stylu**, i když hra běží s `?styl=papir`. `PAPIR.life` v `palette.js` existuje, ale tyto dva soubory ho nečtou. Papír z nich mění jen to, že schová auta v místě odhodu a sníží střechy (S-1). Odtud jsou všechny cizí prvky na screenshotu 223830 (`img/hratelnost/zbytky-stareho-stylu.png`):

| # | Co je vidět | Odkud | Proč nesedí | Návrh | Priorita |
|---|---|---|---|---|---|
| 1 | **kouř**: šedofialové low-poly koule 3–7 m | `life3d` komíny (5 obláčků na komín) + lokomotiva + pára tržnice, `CYBER.steam` | toon, neprůhledný, větší než vlaštovka, za dítětem (N6) | **škrtnout v papíru úplně** (komíny i lokomotiva). Páru z ventilace u události „gust“ řeší `companion3d` (už má `PAPIR.companion.steam` krém), ta zůstává. | **P0** |
| 2 | **balón**: růžový ikosaedr s obrysem nad dítětem | `life3d` balóny, `CYBER.life.pastel` | obrys (P1), cyber magenta, v pásu výhledu | papírový balón (katalog karta 35: kotouč + pruhy, z ≤ −170, nikdy v pásu výhledu místa 1) | P1 |
| 3 | **mraky**: růžové zploštělé elipsoidy | `life3d` mraky, `CYBER.life.cloud #ffd0e6` | růžové, toon; papír má mraky ze 3 krémových kotoučů (`paper-cards` / `lifeCards`) | škrtnout z `life3d`, mraky kreslí jen papírová obloha | **P0** |
| 4 | **lidé na střechách**: kvádry 2,0 m s obrysem | `life3d` (`PS = 1,3`), oblečení `CYBER` (magenta, azur) | obrys, 2 m místo 1,7 (M-1), větší než dítě | papírový `person` (katalog karta 7, model existuje, `models/person.js`), instancovaný, 1 DC. V místě 1 ne na střechách v pásu S-1 přímo za dítětem. | P1 |
| 5 | **komíny**: fialové kvádry | `life.js` `L.static`, `CYBER.life.chimney #7a4f86`, toon + obrys | fialová, obrys, zapuštěné ve štítu (rozpor R5) | komín jako díl domu (`parts.chimney`, `PAPIR.life.chimney #9a4a3a`, katalog karta 4), bez kouře | P1 |
| 6 | **dítě**: ploché karty | `kid.js` | N5 | kap. 1 | P1 |
| – | auta, vlak, okna, žárovky, antény s červeným světlem, prádlo, praporky, větrníky, ptáci | `life3d`, `CYBER.life` | toon a obrysy, cyber barvy (okna `#ff9ed2`, světla `BEACON`) | převést na papírové modely z katalogu (prádlo 13, praporky 10, anténa 12, auto 17, vlak 25, hejno 37) a barvy `PAPIR.life`. Okna, která se rozsvítí za vlaštovkou, jen teplé sklo `PAPER_WARM` (bible 4) | P2 |
| – | drony s balíčkem, robot Bolts, otočná reklama (FOLD & FLY, NOODLES 24H) | `life3d` | čistý cyber (neon, reklamy), bible je nemá | **škrtnout** ze scény. Hlášky Bolts zvážit v UI (product-designer) | P1 |
| – | holub „Cyber Pigeon“ v `life3d` | skrytý (`comp = null`), kreslí ho `companion3d` | mrtvý kód | smazat z `life3d` | P2 |

### 3.2 Pořadí (pro game-deva)
1. **P0 (hned, malé):** v papíru nevytvářet kouř komínů a lokomotivy ani růžové mraky `life3d`. Je to podmínka v `createLife` a v `update`, nic nového se nekreslí. Test: `tests/render3d-living-colors.test.js` dnes hlídá `CYBER.steam`, upravit.
2. **P1:** škrtnout drony, robota a reklamu v papíru. Lidé a komíny z papírových modelů. Balón z katalogu mimo pás výhledu.
3. **P2:** zbytek života (auta, vlak, prádlo, praporky, okna, ptáci) na papírové modely. Zároveň zmizí poslední `toon` a obrysy ve scéně. Tím se uzavře rozpor „Co bible ani prototyp nemají, zůstává z CYBER“ (`palette.js` ř. 99).

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
| R-H3 | kouř `CYBER.steam`, 3–7 m, neprůhledný | S-6: krém, alfa ≤ 0,6, menší než vlaštovka | **nové:** kouř v papíru škrtnout (kap. 2.4, BLOCKED 2) |
| R-H4 | hra začíná záběrem míření 16 m | bible 9.2: menu 28 m je ustavující záběr | nový úvodní záběr 30 m (kap. 2) |
| R-H5 | dítě z plochých karet (`kid.js`) | bible 9.4 „papírová postavička“ | po schválení skládaná loutka (kap. 1) |

## 6. Dávky pro game-deva (návrh pořadí)
1. **H0 (malé, hned po schválení):** kouř a růžové mraky z `life3d` v papíru pryč; drony, robot, reklama v papíru pryč. Bez nového kreslení.
2. **H1 Úvodní záběr:** `INTRO_SHOT`, režisér kamery (úvod → míření 600 ms, vstup hned, reduced = střih), dítě v klidu. Text výzvy podle product-designera (N9).
3. **H2 Plastická postavička:** model `kid` varianta A (LOD H a 1), rig s normálami, pózy kap. 1.7, test smlouvy ruky (M-3) a rozpočtu `tris`. Art-review na 375, 932 a 1280 px.
4. **H3 Jediný styl:** kap. 4.1 (přepínač, značka, palety, CSS tokeny, mazání cyber modulů) spolu s product-designerem (N8).
5. **H4 Život čtvrti v papíru:** P1 a P2 z kap. 3.2 (lidé, komíny, balóny, prádlo, auta, vlak, okna).

---

## 7. Otázky pro uživatele

BLOCKED: **Jakou podobu má mít hlavní postavička?** Obrázek `research/design/img/hratelnost/postavicka-varianty.png` (a pózy v `postavicka-pozy.png`). (A) **Skládaná loutka z papíru**: hlava, pláštěnka, ruce a nohy jsou jako složené papírové krabičky a ruličky, natočené napůl k tobě, je vidět čelo i bok. (B) Dnešní plochá postavička, jen s tloušťkou a hranou papíru. (C) Oblá figurka s mnoha stěnami, vypadá spíš jako plastová hračka. **Doporučuji A**: má objem jako Tearaway a pořád je to papír. Navíc přidám větší hlavu, aby byl vidět obličej, a dítě bude házet rukou za hlavou, zatímco druhou ukazuje, kam hází.

BLOCKED: **Smí v papírovém městě zůstat kouř z komínů?** Obrázek `research/design/img/hratelnost/zbytky-stareho-stylu.png` (čísla 1 a 5) a `uvod-zaber.png` (1 dnes × 2 návrh). (A) **Kouř úplně pryč** (doporučuji: klidnější nebe, nic nepřekáží vlaštovce a nic za postavičkou). (B) Kouř jen jako malé průsvitné papírové obláčky, a jen daleko od místa, odkud házíš. (C) Nechat jako dnes. Doporučuji A, komíny zůstanou bez kouře.

BLOCKED: **Co má hra ukázat jako první?** Obrázek `research/design/img/hratelnost/uvod-zaber.png` (2, 4, 6) a přechod `uvod-prechod.png`. (A) **Úvodní záběr na dům s dílnou** (vidíš podkroví se stolem a nástěnkou, postavičku na pavlači, nahoře v nebi nápis „Throw it“). Po prvním dotyku se kamera za 0,6 s přiblíží k postavičce a můžeš hned házet. Úvod se ukáže po spuštění a po návratu z Dílny nebo Atlasu, „Hodit znovu“ jde rovnou k házení. (B) Úvod se sám po 2 s přiblíží, i když nic neuděláš. (C) Jako dnes, hned záběr na pavlač. **Doporučuji A.** Nápis bude nahoře v nebi, ne přesně uprostřed obrazovky, protože uprostřed je dílna. Platí to i pro „Throw it“ z tvé poznámky?

## 8. Ověření
- Náčrty: Node, kamera a rozložení města jako ve hře (`geometry.cityChunk`, `follow`, fov 20°), koncept 2 místa odhodu převzatý ze `start/start.mjs`. Trojúhelníky postaviček jsou spočtené generátorem náčrtu. Ve hře by se lišily jen o víčka (±10 %).
- Kontrasty: z hex hodnot (WCAG), ne z pixelů hry.
- **NOT ASSESSED:** vzhled ve hře (prohlížeč jsem nepoužil), výkon (draw calls, čas snímku), čitelnost na skutečném telefonu, správnost příčiny „NEON CITY“ (vyčteno z kódu).
