# Přechody mezi pozadími (místy a čtvrtěmi): rešerše a doporučený postup

> **NÁVRH, ke schválení uživatelem.** Napsal art-director 14. 10. 2026 na otázku uživatele: „Jak se řeší přechod mezi jednotlivými backgrounds? Jak to řeší jiné hry?“ Platí pro nový styl B (Papírové město, `05-styl-papir.md`), ale princip platí pro jakýkoli styl. Agenty jsem spustit nemohl (nemám k tomu nástroj), rešerši jsem udělal sám přes WebSearch.

## 1. Shrnutí

Hry, které působí jako jeden souvislý svět, nemají jeden trik. Kombinují čtyři vrstvy přechodu. Doporučuji všechny čtyři:

1. **Barva a světlo se mění plynule** po celé délce místa, ne na hranici (Alto: denní doba se prolíná; u nás `moodAt` se `smooth`, to už máme).
2. **Stavebnice se prolínají.** Posledních ~150 m čtvrti se domy obou čtvrtí míchají a nových přibývá. **Dálka se mění dřív než ulice**: na obzoru je další čtvrť vidět o místo dopředu, je to „slib“, kam letím.
3. **Brána na hranici.** Ručně navržený kus, který patří oběma světům a zakryje šev: most z předměstí do přístavu, maják na konci mola, horské sedlo, městská brána. Herní design tomu říká *airlock*.
4. **Událost ohlásí změnu.** Název čtvrti, krátké oddálení kamery, změna stopy a hudby. Záběr „District“ v `camera.js` už existuje.

**Čemu se vyhnout:**
- průhledné prolínání dvou sad domů (vypadá jako duchové),
- střih uprostřed obrazovky (šev, kde končí jedna „tapeta“ a začíná druhá),
- změna barvy skokem kolem vlaštovky (bible 02 i 05: kontrast kolem vlaštovky se nemění skokem).

## 2. Rešerše

| Zdroj | Jak to řeší | Co si beru |
|---|---|---|
| **Alto's Odyssey** ([TouchArcade](https://toucharcade.com/2018/02/23/toucharcade-game-of-the-week-altos-odyssey/), [Wikipedia](https://en.wikipedia.org/wiki/Alto%27s_Odyssey)) | denní doba a počasí se mění plynule během jízdy; biomy se střídají přirozeně, recenze to popisuje jako „natural“. Technicky obvyklé řešení: klíčové snímky hodnot (barvy, světla) a lineární prolínání mezi nimi (analogie: [Minecraft Vibrant Visuals](https://minecraft.wiki/w/Vibrant_Visuals/Configurations)) | vrstva 1: máme (`moodAt`, v papíru `skyAt`) |
| **Airlocky v MMO** ([Kill Ten Rats: Airlocks](https://www.killtenrats.com/2009/09/11/airlocks/)) | přechod mezi zónami vede úzkým místem: tunel, soutěska, most. Šev je za zatáčkou nebo za skálou, hráč výměnu kulis nevidí. Krátký most funguje, dlouhý šev prozradí | vrstva 3: brána na každé hranici |
| **Source engine: landmarky** ([TWHL wiki](https://twhl.info/wiki/view/406)) | plynulý přechod mezi mapami stojí na společném orientačním bodu, který je v obou mapách na stejném místě | brána je v obou čtvrtích (dům předměstí stojí u mola, jeřáb je vidět z posledních střech) |
| **Plynulé biomy v procedurálních hrách** ([itch.io devlog: Smooth transitions between biomes](https://itch.io/devlog/544546/smooth-transitions-between-biomes.amp)) | každé místo má váhy více biomů, ne jeden biom; přechod = váhy se posouvají | vrstva 2: váha čtvrti podle vzdálenosti, generátor míchá stavebnice |
| **Jetpack Joyride** ([iCulture o aktualizaci](https://www.iculture.nl/apps/jetpack-joyride-voor-de-ipad-krijgt-nieuwe-missies-en-omgeving/)) | laboratoř je výchozí pozadí, jiné prostředí (les) občas „proletí“ za ní jako kusy | občasný kus další čtvrti v pozadí dřív, než do ní doletím |
| **Zóny v lineárních hrách** ([Irrlicht fórum: world/zone/scene](https://irrlicht.sourceforge.io/forum/viewtopic.php?p=146715), [UEFN: kamery side-scrolleru](https://dev.epicgames.com/documentation/fortnite/tmnt-cameras-and-controls-in-unreal-editor-for-fortnite)) | textury, světlo a prvky se drží napříč hranicí, přechod nesmí přerušit hru; kamera mění záběr plynule (ease-in-out) | vrstva 4: kamera se oddálí jen mimo QTE (už v `camera.js`) |
| **Ori and the Will of the Wisps** ([TheGamer: rozhovor o grafice](https://www.thegamer.com/ori-and-the-will-of-the-wisps-art-interview/), [CGM](https://www.cgmagonline.com/interviews/blending-art-and-music-with-ori-and-the-will-of-the-wisps)) | každý biom má vlastní paletu, tvarosloví a zvuk; vrstvy paralaxy zůstávají při přechodu plynulé | každá čtvrť má vlastní stavebnici (tvar) + paletu (barva) + hudbu |
| **Gris** ([GameRevolution](https://www.gamerevolution.com/preview/431593-gris-is-a-gorgeous-colorful-game-that-ironically-isnt-very-gray-preview)) | nová čtvrť = nová barva ve světě, změna je zároveň odměna | hranice čtvrti jako malá odměna (karta čtvrti v Atlasu, rozhodnutí 06) |

Konkrétní technické postupy Alto, Jetpack Joyride a Ori jsem z veřejných zdrojů nedohledal (žádná přednáška ani rozbor). Uvádím, co je z her vidět a co píší recenze. **Neověřeno.**

## 3. Jak je to u nás dnes

- **Barva:** `src/render3d/mood.js` má 17 klíčových nálad (střed každého místa) a mezi nimi plynulý přechod (`smooth`). V papíru totéž s `skyAt` (`06-papir-ctvrt1.md`, `paper-mood.js`). Vrstva 1 je hotová.
- **Stavebnice:** `geometry.cityChunk(index)` staví každé místo (305 m) zvlášť podle rozložení čtvrti (`districts/*-layout.js`). Na hranici místa končí jedna sada a začíná druhá, a to ve všech hloubkách naráz (ulice, střed i dálka). V papíru stejně (`placeCards(i)`). **Vrstva 2 chybí.** Hranice čtvrti je šev ve všech vrstvách.
- **Brány:** svět (`research/svet/01-zivy-svet.md`) je už plánuje: vlak přejede most do doků (místo 4), mlha u majáku odhalí slunce (místo 8), poslední paprsek a neon brány (místo 13). V geometrii jsou zatím jen dominanty míst, ne přechodové kusy. **Vrstva 3 je navržená, nepostavená.**
- **Událost:** záběr „District“ (oddálení 1,5 s, název čtvrti, změna stopy) v `camera.js`. **Vrstva 4 je hotová.**

Hranici čtvrti ve hře jsem vizuálně neprocházel (prototyp B má jen čtvrť 1). **NOT ASSESSED.**

## 4. Doporučený postup (pro papírový styl)

### 4.1 Pravidla (návrh do bible 05)
- **P-1 Barva nikdy na hranici.** Nálada se posouvá celým místem (už platí).
- **P-2 Dálka jde napřed.** Dálka (z ≈ −357) ukazuje další čtvrť už od 3. místa čtvrti, střed od poloviny 4. místa, ulice až v posledních ~80 m. Hráč vidí jeřáby přístavu na obzoru, ještě když letí nad střechami.
- **P-3 Míchání, ne prolínání.** V pásu přechodu se karty vybírají ze stavebnic obou čtvrtí podle váhy `w(x)` (0 → 1). Karta je vždy celá a neprůhledná, nikdy poloprůhledná.
- **P-4 Brána zakryje šev ulice.** Na každé hranici je ručně navržený kus široký 60–120 m, který obsahuje prvky obou čtvrtí. Šev ulice leží uvnitř brány:

| Hranice | Brána (návrh) | Proč funguje |
|---|---|---|
| 1 → 2 (Střechy za úsvitu → Slunný přístav) | železniční most přes kanál: z jedné strany poslední domky a prádlo, z druhé první sklady a jeřáb | most je „airlock“, pod ním se mění zem z dlažby na vodu |
| 2 → 3 (Slunný přístav → Zlatá pole) | maják na konci mola, za ním pobřežní louka | maják je dominanta vidět z obou stran |
| 3 → 4 (Zlatá pole → Město lampionů) | horské sedlo s tunelem nebo bránou, slunce zapadne za hřeben | tunel skryje výměnu, západ změní světlo |
| 4 → finále | poslední věž a otevřené nebe za ní | „za obzor“ |

- **P-5 Papírový bonus (volitelně):** na hranici čtvrti přeletí těsně před kamerou papírový mrak nebo kulisa (jako v divadle) a zakryje na ~0,5 s polovinu obrazu. Jen mimo QTE, s reduced motion bez pohybu (jen přechod barvy).

### 4.2 Plán implementace (game-dev, po dávkách P0–P4)

| Krok | Soubory | Co | Test |
|---|---|---|---|
| T1 Váhy | `src/render3d/geometry.js` nebo nový čistý `transition.js` | `districtWeight(x, layer)`: váha další čtvrti 0–1 s posunem podle vrstvy (dálka −1 místo, střed −0,5, ulice −80 m), `smooth` | `tests/render3d-transition.test.js`: váha monotónní, 0 uprostřed čtvrti, 1 za hranicí, dálka dřív než ulice |
| T2 Míchání stavebnic | `cityChunk` / `paper-cards.js`, `districts/*-layout.js` | pro každou kartu v pásu přechodu deterministicky (seed z x) vybrat stavebnici podle `w(x)`. Rozložení obou čtvrtí má stejné „sloty“ (šířky, hloubky), takže jdou střídat | test: stejný seed = stejné město; v pásu jsou karty obou čtvrtí; mimo pás jen jedné |
| T3 Brány | `districts/gates-layout.js` (nový, čistý) + kreslení v `city.js` | 3 přechodové kusy podle tabulky; šev ulice uvnitř brány | snímky pásu hranice (8 záběrů za sebou) ve 3 velikostech |
| T4 Kamera a název | `camera.js` (už je) | ověřit, že oddálení „District“ ukáže bránu celou | ruční průlet |
| T5 Kontrola | prototyp: nástroj „pás hranice“ (panorama z 8 snímků) | art review každé hranice: žádný šev, žádný skok kontrastu kolem vlaštovky | art-review |

Rozpočet: přechodový pás nepřidává karty (jen mění, ze které stavebnice jsou). Brána ≈ 1 místo dominanty (do 14 DC a 15 tis. △ na místo). Výkon beze změny.

## 5. Otázky pro uživatele

1. **Líbí se ti „dálka jde napřed“** (na obzoru je vidět další čtvrť dřív, než do ní doletíš)? (a) ano, (b) ne, každá čtvrť je překvapení až na hranici. Doporučuji (a).
2. **Brány podle tabulky v kap. 4.1** (most, maják, sedlo s tunelem, poslední věž)? (a) ano, (b) jiné nápady, (c) bez bran, stačí míchání. Doporučuji (a).
3. **Papírový mrak přes obraz na hranici čtvrti** (kap. 4.1, P-5)? (a) ano, (b) ne. Doporučuji zkusit v prototypu, rozhodnout po zahrání.
