# Začátek hodu a kamera podle rychlosti (game design)

**14. 10. 2026, game designer.** Zadání uživatele (06, „Stíny, přechody a modely“ bod 3 a K4): přepracovat celý začátek hodu (odkud se hází, okolí hráče, Dílna) a kameru, která je na začátku hodu přiblížená a při zrychlení se vzdaluje. Otázka uživatele: *„Dává to smysl a je to mechanika, která bude fungovat?“*

Souběžně art-director píše vzhled místa odhodu (`02-misto-odhodu-vzhled.md`). Tady je jen herní stránka: co místo dělá pro hru, pořadí a délky, pravidla kamery, čísla a měření. Vzhled (materiály, barvy, modely) nechávám jemu.

Zkratky: `06` = rozhodnutí uživatele, `P1–P15` = zásady `research/kb/README.md`, `08 §` = `research/bonusy/08-navrh-kolo2.md`, `07-menu` = `research/design/07-menu.md`, bible = `research/design/05-styl-papir.md`, `obsah/01` = `research/obsah/01-game-design.md`. Všechna čísla jsou **zástupná**.

## 0. Shrnutí a verdikt

**Verdikt: funguje, ale za podmínek.** Přiblížení při výhozu a oddálení s rychlostí je osvědčený způsob, jak ukázat rychlost (hráč ji vidí, ne jen čte; 06 „čísla mají být vidět“). V téhle hře to ale bude fungovat jen tehdy, když se splní sedm podmínek (§3.6). Tři hlavní:

1. **Kamera se nesmí řídit absolutní rychlostí.** Musí sledovat rychlost **nad cestovní rychlostí výbavy** (přebytek). Jinak se raný hráč neoddálí nikdy a pozdní hráč bude oddálený pořád.
2. **Oddálení podle tempa π (08 §2.5, schválené) a oddálení podle rychlosti musí být jeden vzorec.** Dnes by se sčítaly.
3. **Na telefonu se vlaštovka při oddálení nesmí zmenšit pod 24 px.** Už dnes má jen 24 px (bible kap. 3).

**Co jsem zjistil v kódu (dnes je to obráceně):**
- Klidový záběr Dílny (`pose.js REST`) je **244 m** široký, záběr letu (`frame.js CAMERA.width`) jen **120 m**. Při výhozu se proto kamera **přibližuje**, ne oddaluje. Vlaštovka v Dílně má na telefonu ~10 px (bible kap. 9).
- `speedZoom` začíná u 24 m/s a bere `f.vx`. Dart vyhodí nejvýš 22 m/s (vodorovně ~21) a pak zpomalí na `cruise 11`. **Raný hráč oddálení neuvidí vůbec.** S Power 5 je to asi +1 %. Naplno by se projevilo až v novém systému s tempem π (vx do ~100 m/s), a tam by se násobilo s `tempoZoom`. Dnes se tempoZoom nepoužívá (`frame.js` posílá `k:1` napevno).
- Fyzika vyhazuje z výšky **12 m** (`core.js createFlight`), ruka dítěte je ale na **16 m** (`pose.js HAND`). Rozdíl dnes schovává posun kamery `dy` při výhozu.

**Doporučení v jedné větě:** házet z **balkonu podkroví Dílny** (koncept A, §1) ve výšce, která odpovídá fyzice (12 m, beze změny balancu). Hod začne v těsném záběru na dítě a vlaštovku. Po puštění se kamera za 1 s oddálí do záběru letu a dál dýchá podle **přebytku rychlosti**: po výhozu, po zdařené události, po raketě. Během QTE stojí. Desátý hod nesmí přidat ani zlomek sekundy čekání.

## 1. Odkud se hází: tři koncepty

### 1.1 Co místo odhodu musí splnit (měřítka)
| # | Měřítko | Proč |
|---|---|---|
| a | **Pocit z hodu:** výška a otevřený prostor před dítětem, „skok do prázdna“ | hod je jediný okamžik plné kontroly hráče (P7) |
| b | **Čitelnost míření:** šipka, síla a vítr jsou vidět, nic před vlaštovkou nezakrývá oblouk | 06: vítr ukázaný před hodem |
| c | **Příběh:** dítě, Dílna jako domov, „Diorama za úsvitu“, cesta za sluncem (bible P3) | text místa 1 už zní „Out of the Workshop window and over a waking street.“ (bible kap. 12) |
| d | **Menu ve scéně** (07-menu §2.1): Házet = plynulý pohyb kamery, ne střih | 07-menu §6: menu → míření 600 ms |
| e | **První místo trasy** „Workshop & First Roofs“: hned pod vlaštovkou jsou střechy místa 1 | první dojem z města |
| f | **Fyzika a balanc:** výška výhozu `y0` mění dobu letu i dolet | §1.5 |
| g | **Růst s postupem:** Crane Lift (Atlas místo 6, A06) zvedá start o +1,5 m za úroveň (`params.mjs atlas.crane`) a místo to musí umět ukázat | 06: kosmetika a změny za objevy |

### 1.2 Koncept A: Balkon podkroví Dílny (doporučuji)
- **Popis:** v podkroví Dílny je pokoj dítěte s pracovním stolem. Z jeho okna vede malý dřevěný balkon nebo plošina se zábradlím nad ulicí. Dítě vyjde oknem na balkon a hází doprava nad střechy místa 1. Za zády má teplé okno (domov), před sebou ranní město a slunce na obzoru.
- **Pocit z hodu:** výška a prázdný prostor před balkonem. Zábradlí je hrana, za kterou to „padá“, takže puštění působí jako odvaha. Těsný záběr přes rameno dítěte a otevřený výhled dopředu.
- **Čitelnost míření:** dobrá. Před dítětem nic není, zábradlí je níž než ruka. Vítr ukazuje **větrný rukáv nebo praporek na zábradlí** (diegeticky, vedle šipky v UI). Pinwheel (Atlas místo 3, přehazuje vítr) může být **papírový větrník připíchnutý na zábradlí**: kde se vítr ukazuje, tam se i mění.
- **Příběh:** Dílna je domov a hod začíná doma. Navazuje na text místa 1 („z okna dílny“). Odpovídá bibli kap. 9: Dílna je jediné místo s teplým oknem ve dne.
- **Menu:** záběr na osvětlené okno podkroví s dítětem u stolu (skládá vlaštovku). „Házet“ = kamera se za 0,5 s posune z okna na balkon a dítě vykročí. Jeden prostor, žádný střih.
- **První místo:** balkon je na konci Dílny, střechy místa 1 začínají pod ním. První poryv (t = 1,5 s, `events.js`) přijde asi 30 m za balkonem, už nad střechami.
- **Fyzika:** balkon se postaví tak, aby ruka byla ve **12 m** (= `y0`). Dnešních 16 m se sníží. Balanc beze změny.
- **Růst:** Crane Lift = jeřábnice Marge (08 A06) přistaví nad balkon **hák s plošinou**. Úrovně 1–3 zvednou plošinu o 1,5 / 3 / 4,5 m nad balkon a hráč výšku vidí. Ze všech konceptů má A pro jeřáb nejpřirozenější místo.
- **Rizika:** balkon nesmí zakrýt dítě ani vlaštovku zábradlím (art). Těsný záběr ukazuje detail Dílny (LOD 0, rozpočet místa 0).

### 1.3 Koncept B: Okno podkroví
- **Popis:** dítě hází přímo z otevřeného okna podkroví. Kamera je v menu uvnitř pokoje a dívá se přes rameno dítěte ven. Při míření přejde ven před fasádu a dívá se z boku.
- **Pocit z hodu:** intimní, „pouštím vlaštovku z domova do světa“. Rám okna dělá z výhledu obraz (diorama v rámu). Méně výšky a prázdna než u A.
- **Čitelnost míření:** horší. Z boku zakrývá rám okna ruku a začátek oblouku, a kamera uvnitř pokoje nevidí šipku z boku. Míření se buď kreslí z pohledu zevnitř (jiná projekce než `cameraView`, hodně práce), nebo kamera stejně vyjde ven a kouzlo okna zmizí.
- **Příběh:** nejsilnější, přesně odpovídá textu místa 1.
- **Menu:** výborné (pokoj, stůl, ranní světlo).
- **Fyzika:** výška okna podkroví ~12 m, balanc beze změny.
- **Růst:** Crane Lift nemá kam. Okno je pevné, jeřáb by musel dítě vyzvednout z okna, což vypadá nepřirozeně.
- **Rizika:** dvojí kamera (uvnitř a venku), zakrytí míření, slabá vazba na Crane Lift.

### 1.4 Koncept C: Hrana nad městem (násep, stará hradba nebo sráz za Dílnou)
- **Popis:** Dílna stojí na vyvýšené zahradě na hraně staré hradby. Dítě stojí na hraně (nebo na lavičce u zábradlí hradby) a město leží pod ním.
- **Pocit z hodu:** nejvíc prostoru a výhledu, „celá trasa přede mnou až ke slunci“.
- **Čitelnost míření:** nejlepší, před dítětem je jen nebe.
- **Příběh:** cesta za sluncem je vidět nejlíp. Dílna je ale za zády a ze záběru při míření zmizí, takže domov vidíme méně.
- **Menu:** široký výhled na trasu, hodí se k 07-menu („živé město“).
- **Fyzika:** hradba musí mít korunu asi 10–11 m nad ulicí, aby ruka byla ve 12 m. **Kopec nebo vysoká věž by znamenaly vyšší `y0`, a to mění balanc** (§1.5). Dílna by se v `cityChunk(0)` přestavěla do terénu (nový model hradby).
- **Růst:** jeřáb na hradbě je možný, ale nevypráví nic navíc.
- **Rizika:** nejvíc nové geometrie (hradba, terén), Dílna v záběru míření chybí.

**Zamítnutý koncept D: Věž** (vodárna, hodinová věž). Soupeří s dominantami čtvrti 1 (06 K3: Hodinová věž, vodárna místa 4), je příliš vysoko (balanc, §1.5) a ztrácí domov.

### 1.5 Mění výška výhozu let? Ano, hodně
Výška `y0 = 12` (`core.js`, `params.mjs physics.y0`) je **rozpočet doby letu**. Plachtění klesá rychlostí `vx/glide`. Pro Dart při cestovní rychlosti je to 11 / 3,2 ≈ 3,4 m/s a s tempem π se klesání nemění (08 §2.2, závěr 3). Každý metr výšky navíc proto přidá:
- **dobu letu** asi +0,3 s na metr, a to v každé fázi hry,
- **dolet** asi `glide·π` metrů na metr: na začátku ~3 m, na konci (π ≈ 8,9, glide ×π) ~28 m na metr.

Příklad: kopec, ze kterého by se házelo z 30 m (+18 m), by na začátku přidal asi +5 s letu a +58 m, na konci +500 m na každý hod. Tím by se rozbil rozpočet doby letu (08 §2.2: 15 s na začátku) i cena Crane Lift (+1,5 m za úroveň by proti +18 m zadarmo nic neznamenala). Navíc události nezačínají pod 8 m (`params eventMinY`), takže výška mění i počet událostí.

**Doporučení:** fyzika zůstane `y0 = 12 m` a místo odhodu se postaví tak, aby ruka byla ve 12 m. Pak balance-analyst nic nepřepočítává. Pokud uživatel zvolí vyšší místo, je potřeba nové kolo simulace (§5.2).

### 1.6 Srovnání
| | A Balkon | B Okno | C Hrana |
|---|---|---|---|
| Pocit z hodu | ●●○ výška a hrana | ●○○ intimní | ●●● prostor |
| Čitelnost míření | ●●● | ●○○ rám zakrývá | ●●● |
| Domov a příběh | ●●● | ●●● | ●●○ Dílna za zády |
| Plynulý přechod z menu | ●●● okno → balkon | ●●○ dvě kamery | ●●○ |
| Crane Lift | ●●● hák nad balkonem | ●○○ | ●●○ |
| Balanc beze změny | ano (12 m) | ano | ano jen s nízkou hradbou |
| Pracnost (art + kód) | M | L | L |

**Doporučuji A** a z B si vzít menu (pokoj s oknem). Viz BLOCKED 1 v §7.

## 2. Sekvence začátku hodu

### 2.1 Zásady
- **Žádné čekání navíc.** Fyzika startuje v tom snímku, kdy hráč pustí (jako dnes). Všechno ostatní běží souběžně s hrou. Vstup se přijímá od prvního snímku, i když kamera ještě jede (07-menu §6: animace nikdy neblokuje vstup).
- **Dlouhá verze jen jednou.** Delší úvod (dítě vyjde z pokoje) jen při prvním hodu po spuštění stránky. Opakovaný hod (Throw again) má nejkratší cestu.
- **Zpětná vazba podle výkonu (P1, P2).** Síla hodu a perfektní nabití jsou vidět a slyšet (rozdílný výhoz), ale nepřidávají čas.

### 2.2 Časová osa: první hod v sezení (z menu)
| Fáze | Čas | Dítě | Vlaštovka | Kamera | Zvuk a juice | Přeskočení |
|---|---|---|---|---|---|---|
| 0 Menu | – | u stolu za oknem, skládá a zkouší vlaštovku | na stole | **záběr na okno** (W ≈ 70 m, pomalé plutí ±1 %), reduced = stojí | ranní ulice, ptáci | – |
| 1 Házet → balkon | 0,5 s | vstane, vyjde oknem na balkon | v ruce | posun z okna na **záběr míření** (W_aim ≈ 55 m) | dřevo balkonu, okno | klepnutí / držení = hned záběr míření, držení se započítá |
| 2 Míření (táhne) | hráč | ruka sleduje úhel, dítě se nakloní | nos podle úhlu | **stojí** (míření potřebuje klid) | jemné „cvaknutí“ po 5° | – |
| 3 Nabíjení (drží) | 0–1,15 s (`chargeAt`) | couvne a zakloní se (dnes `kidPose`) | stažení, nad 90 % chvění (dnes `planePose`) | **přisunutí o 0 → 6 %** podle síly | papír se napíná, tón stoupá se silou; v pásmu perfekt (≥ 0,93) tik a světlá linka | – |
| 4 Puštění | 0 s, fyzika hned | švih paží, pak mávání (dnes) | odlétá z ruky | **opoždění 0,1 s** (vlaštovka vyletí ze středu záběru doprava), pak dohání | „fíí“ podle síly; **perfekt: zástava 70 ms** + puk papíru (hitstop stojí jen akumulátor fyziky) | – |
| 5 Oddálení výhozu | 0–1,0 s | zůstane na balkonu a mává, zmenšuje se | let | **W_aim → W_let** (ease-out), posun vlaštovky z px ~200 zpět na 148 | vítr zesílí podle přebytku rychlosti | – |
| 6 Plný let | od ~1,0 s | mimo záběr | let | režisér letu (§3) | – | – |

**První událost je v t = 1,5 s** (`events.js`, varování 0,8 s). Oddálení výhozu proto **musí skončit do 1,2 s**. Pak zámek QTE nezastaví kameru v půli cesty. Dnešní `LAUNCH.dur = 1,2` to splňuje.

### 2.3 Opakovaný hod (Throw again z výsledku)
| Fáze | Čas | Co se děje |
|---|---|---|
| Klepnutí na „Throw again“ | 0 s | karta výsledku sjede (07-menu 320 ms), **pod ní se hned přepne scéna**: střih na záběr míření (papírový „přeložený list“ 0,2 s, reduced = střih). Kamera nemůže letět 5 km zpět, střih pod kartou je čistý. |
| Dítě | 0 s | už stojí na balkonu s novou vlaštovkou. **Žádné skládání** (06: animace výměny papíru jen v Dílně po koupi). |
| Vstup | od 0 s | držení funguje hned, i když karta ještě sjíždí |
| Úhel | – | zůstává z minulého hodu (dnes), hráč jen podrží a pustí |

**Rozpočet desátého hodu:** z klepnutí na „Throw again“ do možnosti držet **≤ 0,25 s**. Mezi puštěním a startem fyziky 0 snímků. Navíc jen 70 ms zástava při perfektním hodu.

### 2.4 Dílna (panel) a místo odhodu
Uživatel chce změnit „celý začátek i s dílnou“. Herní návrh: **panel Dílny se otevírá nad pokojem v podkroví**. 3D kamera za panelem najede na stůl dítěte a vlaštovka na stole ukazuje zvolený model, papír a potisk. Koupě papíru přehraje výměnu papíru právě na stole (06). Na desktopu zabírá panel pravou část obrazovky a stůl je vidět vlevo. Na telefonu je panel vysunutý zdola do ~60 % výšky a stůl je nad ním.
- **Proč:** obsah/01 a 03 říkají, že potisk a přehyby jsou naplno vidět jen zblízka (v Dílně, při míření, v menu). Stůl je přirozená vitrína, a Dílna tak nevypadá jako aplikace (06 Struktura menu).
- **Navazuje na:** `research/obsah/02-ux-dilna.md` (vlastník product-designer). Rozložení panelu zde neřeším, jen kameru za ním.
- **Pracnost:** M (záběr „stůl“ v režisérovi, model stolu = art, změna rozložení panelu = UX). Priorita: rozšíření, až po A.

### 2.5 Okrajové případy
1. **Hráč drží už během posunu menu → balkon:** záběr skočí na míření a nabíjení běží. Zrychlit posun kamery není chyba.
2. **Puštění při síle 0** (`throwSettings` drží min. 0,7× rychlosti): oddálení výhozu proběhne vždy, jen bez přebytku (§3.3). Slabý hod nesmí vypadat jako chyba kamery.
3. **Velmi krátký let** (dopad před 1,5 s, strmý hod do země): když fyzika předpoví dopad do 1 s (y < 3 m a klesá), oddálení se zastaví a rovnou začne záběr dopadu. Kamera se nesmí oddálit a hned zase přiblížit.
4. **Pauza během oddálení výhozu:** stav režiséra se drží v `plan.director`, po Pokračovat se pokračuje bez skoku (dnešní chování).
5. **Změna orientace nebo okna za letu:** šířky jsou v metrech, přepočet na px je v každém snímku.
6. **Tutoriál (seed 1):** první hod ever má úvod z §2.2 vždy celý (0,5 s), bublina `aim.hint` až v záběru míření.
7. **Zneužití:** žádné, kamera je jen vzhled. Při oddálení je vidět dál dopředu, ale to platí pro rychlý let, který si hráč vydobyl. Událost se tím neohlásí dřív (varování je pevně 0,8 s).

## 3. Kamera podle rychlosti

### 3.1 Dnešní stav (čteno z `src/render3d/camera.js`, `frame.js`, `pose.js`, `config.js`)
| Prvek | Dnes | Důsledek |
|---|---|---|
| Klid (Dílna, míření) | `POSE_REST.width` = 640 / 2,1 / 1,25 ≈ **244 m** | vlaštovka v Dílně ~10 px na telefonu |
| Let | `CAMERA.width` = **120 m** (zoom 1) | vlaštovka ~24 px na telefonu |
| Přechod při výhozu | `toward` z 2,03 na 1, rychlost ≤ 0,8 ln/s, asi 0,9 s | **kamera se při hodu přibližuje** |
| `speedZoom(v)` | 1 + 0,45·smooth((v − 24)/90), `v = f.vx` | Dart vyhodí vodorovně ≤ 21 m/s → **0 %**. Power 5 (35 m/s) → ~1 %. Naplno až při vx ~114 m/s (nový systém, π ≈ 10) |
| `tempoZoom(k)` | clamp(1 − 0,035·(π − 1), 0,7, 1) (08 §2.5, schváleno) | dnes `k:1` napevno; s π by se násobil se speedZoom (stejná příčina dvakrát) |
| `ZOOM_RANGE` | [0,8; 1,5] na součin stavu a speedZoom | tempo je mimo mez, takže celkem až 120 × 1,5 / 0,7 = 257 m |
| Zámek QTE | od varování do 0,3 s po výsledku stojí zoom, px a natočení | správně, zachovat |
| Vista, district, intro, landing | 1,1 / až 1,5 / punch 0,87 / 0,85 | zachovat, násobí se |

**Odpověď na otázku z zadání:** ano, raný hráč dnes oddálení podle rychlosti nevidí vůbec. Jediné viditelné „oddálení“ je vista (+10 %) v klidných úsecích.

### 3.2 Pozor na fyziku: vlaštovka po hodu zpomaluje
Vlaštovka je nejrychlejší **hned po výhozu** a pak se rychlost blíží k `cruise` (doznívání `drag 0,12`, časová konstanta ~8 s). Zrychluje jen při výhozu, po zdařené události (push), při Dive, po raketě a ve výtryscích (Shooting Star, pára). „Oddálit se při zrychlení“ tedy v praxi znamená:
1. **Velké oddálení při výhozu** (to je hlavní moment, který uživatel popisuje),
2. **pomalé přiblížení**, jak let zvolna zpomaluje,
3. **krátké „vydechnutí“ (oddálení) po každém zrychlení:** zdařený poryv, holub, raketa, hvězda.

Bod 3 je dobrá zpráva pro P1: oddálení přijde **jen po zásahu** a po perfektu víc. Kamera se tak stává odměnou za výkon, ne ozdobou.

### 3.3 Navržená křivka
Šířka záběru W (m v hloubce letu) je součin čtyř činitelů:

```
W = W_let · T(π) · (1 + A · ease(s / S_full)) · M_stav          omezeno [W_min, W_max]

W_let   = 120 m                     dnešní CAMERA.width
T(π)    = 1 / tempoZoom(π)          tempo výbavy (08 §2.5): 1 → 1,38 při π 8,9
s       = max(0, (vx − c) / c)      přebytek rychlosti, c = cruise·π·(1+β) aktuální výbavy (f.p.cruise)
A       = 0,35                      nejvyšší oddálení z přebytku
S_full  = 0,8                       přebytek, při kterém je oddálení plné
ease    = smooth (jako dnes)
M_stav  = vista 1,1 / district ≤ 1,5 / intro punch / landing 0,85 (dnes)
```
**Výhoz** jde zvlášť: z `W_aim` na W podle vzorce přes ease-out za `LAUNCH.dur` (1,0–1,2 s).

`speedZoom` (absolutní) se tímto vzorcem **nahrazuje**. `tempoZoom` zůstává jako T(π), ale počítá se z výbavy (`f.p`), ne z `k` zvenku.

**Proč přebytek a ne absolutní rychlost:** π násobí cestovní rychlost i výhoz stejně (08 §2.2), takže přebytek po výhozu je ve všech fázích hry stejný (~0,7 u Dartu). Každý hod tak má stejně velké „nadechnutí“. Pocit rostoucí rychlosti nese T(π) (víc města v záběru, ubíhá rychleji) a rychlostní čáry. Kamera nikdy neskončí trvale na mezi.

**Tlumení a meze:**
| Parametr | Hodnota | Proč |
|---|---|---|
| Oddálení: poločas / strop rychlosti | 0,25 s / 0,8 ln/s (dnešní `ZOOM_RATE`) | výhoz a raketa mají být cítit hned |
| Přiblížení: poločas / strop rychlosti | 1,2 s / 0,25 ln/s | pomalý návrat, žádné „pumpování“ |
| Mrtvé pásmo | změna cíle < 5 % se ignoruje | drobné výkyvy větru nedýchají |
| Hystereze směru | změna směru (ven ↔ dovnitř) nejdřív za 0,6 s | proti kolísání |
| W_min / W_max za letu | 0,8·W_let·T / 1,5·W_let·T | dnešní `ZOOM_RANGE`, jen vztažený k T(π) |
| W_aim | 55 m (telefon na výšku 45 m) | vlaštovka 52–64 px na telefonu |
| W_menu | 70 m (okno a balkon) | |

### 3.4 Co kamera dělá v jednotlivých situacích
| Situace | Chování |
|---|---|
| **QTE zámek** (varování → 0,3 s po výsledku) | stojí jako dnes. Push z události přijde ve fázi `effect`, takže **oddálení po zásahu začne 0,3 s po výsledku** („vydechnutí“ po úspěchu). |
| **Blíží se událost** (`nextEventIn` < 0,8 s) | oddálení nezačíná (stihlo by se jen zpola). Přiblížení může pokračovat. |
| **Zpomalení** (vx → c) | pomalé přiblížení zpět k W_let·T, v klidu případně vista (+10 %) |
| **Zdařený poryv nebo holub** | Dart: push 1,5·π → s ≈ 0,14 → +5 až 6 %, perfekt (×1,25) +7 %, Hawk (perfekt ×1,6) ~+10 %. Minutí = nic. |
| **Raketa, Shooting Star** | s ≥ 1 → plné oddálení +35 % |
| **Dive (střemhlav)** | **oddálení z přebytku zamčené na +10 %** a kamera drží zem v záběru. Pás Low Pass 2–5 m nad zemí musí zůstat silný. Po vybrání normálně. |
| **Vysoký let** (Kite, termika) | výšku řeší dnešní zvedání kamery (`followPy`, vlaštovka nad 190 px). Oddálení podle výšky nenavrhuji, pokud playtest neukáže, že se ztrácí zem. Pak volitelně +≤ 20 % nad 60 m. |
| **Dopad** | dnešní `LANDING` (0,85), přiblížení z aktuální W. Pravidlo z §2.5 bod 3 pro krátké lety. |
| **Hranice čtvrti, intro místa** | dnes, násobí se. District se při velkém přebytku zkrátí, aby W nepřekročilo W_max. |

### 3.5 Nové modely (obsah/01)
Přebytek po výhozu závisí na poměru `speed·cos(ideal)` / `cruise`. Každý model tak dostane vlastní „dech“ kamery, a ten podporuje jeho styl:
| Model | výhoz vx / cruise | s po výhozu | Oddálení po výhozu | Charakter kamery |
|---|---|---|---|---|
| Dart | 19 / 11 | 0,73 | +34 % | výrazný nádech, pomalý návrat |
| Glider (params) | 12,1 / 11 | 0,10 | +2 % | klidná, blízká, plachtění |
| Hawk M1 | 14 / 11 | 0,27 | +10 % | malý nádech, velké „vydechnutí“ po perfektu |
| Kite M2 | 9,2 / 8 | 0,15 | +4 % | blízko, kamera stoupá s výškou |
| Skimmer M3 | 20,7 / 12 | 0,72 | +33 % | velký nádech nízko nad zemí (hlídat zem v záběru jako u Dive) |
| Sail M4 | 13,5 / 10 | 0,35 | +14 % | se zadním větrem víc (vx je rychlost vůči zemi) |
| Needle M5 | 23,5 / 14 | 0,68 | +32 % | rychlý, `droneBurst` dá plné oddálení |

Žádný model nevypadá jako „Dart s jinou kamerou“. Glider a Kite jsou záměrně blízké a klidné. **Náhled modelu** v Dílně (obsah/01 §2.10, oblouk letu) může ukázat i to, jak se kamera chová (malá animace záběru). Je to nápad na později, ne nutnost.

### 3.6 Podmínky, za kterých to funguje
1. Zoom ze **přebytku** nad cestovní rychlostí výbavy, ne z absolutní rychlosti (§3.3).
2. **Jeden vzorec** s tempem π (T(π) × přebytek), žádné dvojí oddálení.
3. **Vlaštovka ≥ 24 CSS px na telefonu** i při nejširším záběru (§3.7).
4. **Asymetrické tlumení, mrtvé pásmo, hystereze.** Oddálení rychle, přiblížení pomalu, bez pumpování.
5. **Zámek QTE platí** a oddálení výhozu skončí do 1,2 s (první událost v 1,5 s).
6. **Reduced motion a Calm camera:** bez dynamického zoomu (§3.8).
7. **Nula čekání navíc** (§2.3).

### 3.7 Rizika a ošetření
| Riziko | Kde | Ošetření | Jak ověřit |
|---|---|---|---|
| **Vlaštovka na telefonu malá** | W_max až 120·1,38·1,35 ≈ 224 m → 13 px | nad W_let·T se vlaštovka (a její obrys a stopa) zvětší tak, aby na šířce < 500 CSS px držela **≥ 24 px**. Na desktopu smí klesnout na 40 px. Kruh QTE je v UI vrstvě a nemění se. Alternativa: na úzké scéně strop W_max = 1,2·W_let·T (BLOCKED 3). | měření px vlaštovky (§4.2) |
| **Nevolnost** | rychlé a časté změny měřítka | strop 0,8 / 0,25 ln/s, hystereze 0,6 s, žádný zoom FOV (jen posun kamery), žádné kolísání; rychlostní čáry jen do 24 px od vlaštovky (bible) | změn směru zoomu / 10 s ≤ 1; otázka v playtestu |
| **Ztráta výhledu na událost** | těsný záběr při výhozu | oddálení výhozu skončí před první událostí; v zámku se nic nemění | 100 % seedů: W ≥ 0,9·W_let v čase prvního varování |
| **Malý výhled dopředu při míření** | W_aim 55 m | míření potřebuje úhel, sílu a vítr, ne trasu. Trasu ukazuje menu (výhled z okna) a Atlas. | playtest: „věděl jsem, kam mířím“ |
| **Výkon** | širší záběr = víc míst v `placesFor` | W_max 224 m < šířka místa 305 m → nejvýš +1 místo. Těsný záběr Dílny = LOD 0. | `perf-check` při W_max a W_aim |
| **Svislé místo na výšku telefonu** | poměr ~0,5 | W je vodorovná šířka, na výšku je vidět víc nebe. W_aim na výšku 45 m. Ověří M4 z 07-menu. | snímek 360 × 740 |
| **Rozpor ruky a fyziky** | ruka 16 m, `y0` 12 m | místo odhodu postavit na 12 m; `dy` při výhozu pak není potřeba | test `view(null)` + výhoz bez skoku |
| **Krátký let pumpuje** | dopad do 1,5 s | pravidlo §2.5 bod 3 | test na seedu se slabým strmým hodem |

### 3.8 Reduced motion a Calm camera
Pravidlo render3d: „Reduced motion: bez otřesu a zoomu, zpětná vazba zůstává.“
- **Bez dynamického zoomu:** W = W_let·T(π) po celý let (T se mění jen mezi hody, s výbavou).
- **Míření:** záběr W_aim zůstává (statický), výhoz = **prolnutí 0,2 s** na záběr letu místo jízdy kamery. Přechod menu → balkon je střih.
- **Zpětná vazba zůstává:** zvuk, záblesk perfektu, rychlostní čáry podle bible (vypnuté), stopa.
- **Calm camera** (`visual.settings.calm`) = totéž jako reduced pro kameru.

## 4. Dávky pro game-deva a co měřit

### 4.1 Dávky
| Dávka | Obsah | Soubory | Závisí na | Pracnost | Priorita |
|---|---|---|---|---|---|
| **S1 Kamera letu** | vzorec §3.3: přebytek z `f.p.cruise` místo `speedZoom`, T(π) z výbavy, asymetrické tlumení, mrtvé pásmo, hystereze, pravidla §3.4 (zámek, blízká událost, Dive, krátký let); `frame.js` předá režisérovi `c` a π | `src/render3d/camera.js`, `frame.js`, `tests/render3d-camera.test.js` | – (jde hned, nezávisí na místě odhodu) | S–M (data 0, 3D 0, UI 0, texty 0) | **jádro** |
| **S2 Záběr míření a výhoz** | `W_aim`, přisunutí při nabíjení 0–6 %, opoždění 0,1 s při puštění, oddálení výhozu ≤ 1,2 s, zástava 70 ms při perfektu; `REST` v `pose.js` z 244 m na W_aim při zachování smlouvy `view(null)` = (148, 258) | `camera.js`, `pose.js`, `frame.js`, testy | S1 | M | **jádro** |
| **S3 Velikost vlaštovky** | měřítko vlaštovky podle W na úzké scéně (≥ 24 px), navazuje na `planeScale` | `frame.js`, `plane.js`, test | S1, BLOCKED 3 | S | **jádro** |
| **S4 Místo odhodu** | geometrie podle konceptu (A: balkon, okno podkroví, praporek větru, hák Crane Lift), ruka na 12 m (`HAND`, `KID`), dnešní `dy` při výhozu pryč | `workshop.js`, `pose.js`, `geometry.js cityChunk(0)` | BLOCKED 1, návrh art-directora `02` | M–L (3D model, art) | **jádro** |
| **S5 Menu a Throw again** | záběr menu na okno (W_menu), posun 0,5 s na balkon, střih pod kartou výsledku, vstup od prvního snímku; navazuje na M4 a M3b z 07-menu | `camera.js` (stav `menu`), `ui.js` | S2, S4, BLOCKED 2 | M | rozšíření |
| **S6 Zvuk startu** | napínání papíru podle síly, tik perfektu, „fíí“ výhozu, vítr podle přebytku | `audio.js` | až hra načte audio (plán hudby) | S | rozšíření |
| **S7 Stůl za panelem Dílny** | záběr „stůl“ za panelem, vlaštovka ukazuje model, papír a potisk, výměna papíru na stole | `camera.js`, `workshop.js`, UX `02-ux-dilna` | S4 | M | nápad na později |

S1 jde dělat hned a samostatně. Opraví i dnešní stav, kdy raný hráč oddálení nevidí.

### 4.2 Co měřit
Většina jde změřit **v Node bez prohlížeče**, protože `camera.js` i `core.simulate` jsou čisté. Test projde režisérem stovky letů ze `simulate()` (různé seedy, modely, profily, π) a zaznamená metriky.

| Metrika | Cíl (zástupný) | Jak |
|---|---|---|
| % snímků s vlaštovkou v bezpečné zóně (log. px x 90–300, y 40–320) | ≥ 99 %, mimo obraz 0 | Node: `project` vlaštovky po každém kroku |
| Rychlost zoomu \|d ln W / dt\| | ven ≤ 0,8 / s, dovnitř ≤ 0,25 / s | Node |
| Změny směru zoomu za 10 s | ≤ 1 | Node |
| Změna W během zámku QTE | 0 | Node |
| W v čase prvního varování | ≥ 0,9·W_let·T ve 100 % seedů | Node |
| Viditelné oddálení v raném hodu (Dart, π 1) | max W / W_let ≥ 1,25 | Node, odpověď na dnešní „nic nevidím“ |
| Podíl času na W_max | ≤ 10 % letu i v pozdní fázi | Node, hlídá „trvale oddáleno“ |
| Délka vlaštovky v CSS px | telefon ≥ 24 (P5 snímků), desktop ≥ 40 | prohlížeč (orchestrátor / `art-review`), NOT ASSESSED zde |
| Throw again → možnost držet | ≤ 0,25 s; puštění → fyzika 0 snímků | test `ui` / ruční |
| Výkon při W_max a W_aim | rozpočty render3d | `perf-check` |
| Playtest | „cítil jsem rychlost“ (1–5), nevolnost ano/ne, „věděl jsem, kam mířím“, desátý hod „zdržuje“ ano/ne | `playtest` |

### 4.3 Pro balance-analysta
- **Při `y0 = 12 m` (doporučení) se balanc nemění.** Kamera je čistě vzhled, simulaci se nic nepřidává.
- **Když uživatel zvolí vyšší místo (C s kopcem nebo věž):** změřit medián a P90 doby letu proti rozpočtu 08 §2.2 (15 s na začátku, ≤ 35 s na konci), hod dokončení trasy po profilech, sucho P90, počet událostí za let (eventMinY 8 m) a hodnotu Crane Lift (zisk úrovně vůči výšce zdarma). Sady: `--set physics.y0=…` pro 14 / 18 / 24 m.
- Hlídat, aby `params.events.firstAt` neklesl pod `LAUNCH.dur + 0,2 s` (dnes 1,5 s), jinak oddálení výhozu koliduje s první událostí.

## 5. Karty (shrnutí ve formátu karet)

### Karta ST1 — Místo odhodu: balkon podkroví
- **Cíl:** hod začíná doma, ve výšce, s otevřeným prostorem před dítětem.
- **Pravidlo:** ruka dítěte ve 12 m (= fyzika), vítr ukázaný na zábradlí, Crane Lift jako hák nad balkonem (+1,5 m za úroveň), střechy místa 1 pod balkonem.
- **Proč je to zábavné:** hrana a prázdno dělají z puštění malou odvahu. Místo se mění s postupem (hák Marge, větrník Pinwheel), takže začátek hodu ukazuje, co hráč už objevil.
- **Vazba:** bible P1–P3 a kap. 9 (Dílna domov), 06 vítr ukázaný před hodem, 08 A06 Crane Lift, P7.
- **Čísla:** y0 12 m, W_aim 55 m, W_menu 70 m.
- **Pracnost:** M–L (3D model a art, pose/workshop). **Priorita:** jádro.
- **Rizika:** zábradlí zakryje ruku, detail Dílny zblízka (LOD).

### Karta ST2 — Sekvence startu bez čekání
- **Cíl:** výrazný začátek hodu, který desátý hod nezdržuje.
- **Pravidlo:** §2.2 a §2.3. Fyzika startuje při puštění, vstup se přijímá od prvního snímku, delší úvod jen jednou za sezení, zástava 70 ms jen při perfektu.
- **Proč je to zábavné:** nabíjení a puštění mají tělo (přisunutí kamery, napínání papíru, švih) a liší se podle výkonu (P1). Opakování zůstává na jedno klepnutí (07 N10).
- **Vazba:** P1, P2, P14 (nováček dostane úvod, zkušený rychlost), 06 Throw again z výsledku.
- **Pracnost:** M. **Priorita:** jádro (S2), rozšíření (S5, S6).
- **Rizika:** dvojí klepnutí z menu (07-menu §8 bod 8), přeskočení úvodu nesmí ztratit držení.

### Karta ST3 — Kamera dýchá s rychlostí
- **Cíl:** rychlost je vidět. Výhoz a každé zrychlení otevřou záběr.
- **Pravidlo:** §3.3 (přebytek nad cestovní rychlostí × tempo π), §3.4 situace, §3.6 podmínky.
- **Proč je to zábavné:** oddálení po zásahu je odměna, kterou hráč vidí (P1), a každý model má vlastní dech kamery. Pozdní fáze je vidět jako širší, rychleji ubíhající město (06 „rychlé lety, kamera se oddálí“).
- **Vazba:** 06 kolo 2 bod 1, 06 čísla mají být vidět, P1, P2 (optimum juice: tlumení, strop), P15 (reduced motion, velikost na telefonu).
- **Čísla:** A 0,35, S_full 0,8, poločasy 0,25 / 1,2 s, strop 0,8 / 0,25 ln/s, mrtvé pásmo 5 %, hystereze 0,6 s.
- **Pracnost:** S–M (čistý `camera.js`, testy v Node). **Priorita:** jádro, jde jako první.
- **Rizika:** §3.7.

## 6. Souhrnná tabulka a doporučené pořadí
| Pořadí | Položka | Priorita | Pracnost | Závisí na | Proč tady |
|---|---|---|---|---|---|
| 1 | S1 Kamera letu (přebytek + tempo) | jádro | S–M | – | opraví dnešní „raný hráč nevidí oddálení“, měřitelné v Node |
| 2 | S3 Velikost vlaštovky při oddálení | jádro | S | S1, BLOCKED 3 | bez ní je S1 na telefonu horší než dnes |
| 3 | S2 Záběr míření a výhoz (blízko → daleko) | jádro | M | S1 | přímo to, co uživatel chce; vyřeší i 10 px v Dílně |
| 4 | S4 Místo odhodu (balkon) | jádro | M–L | BLOCKED 1, art 02 | ruka na 12 m, Crane Lift, vítr |
| 5 | S5 Menu na okno + Throw again pod kartou | rozšíření | M | S2, S4, BLOCKED 2, 07-menu M4 | plynulý vstup do hry |
| 6 | S6 Zvuk startu | rozšíření | S | audio ve hře | P11 |
| 7 | S7 Stůl za panelem Dílny | nápad na později | M | S4, UX | vitrína pro modely a potisky |

## 7. Otevřené volby

BLOCKED: **Odkud se hází?** (A) **Balkon podkroví Dílny**: dítě vyjde oknem na balkonek nad ulicí, hák jeřábu Marge ho později zvedá výš. (B) **Přímo z okna podkroví**: nejvíc „z domova“, ale rám okna zakrývá míření a jeřáb nemá kam. (C) **Hrana staré hradby** za Dílnou: největší výhled na trasu, Dílna je ale za zády a je to nejvíc nové stavby. **Doporučuji A** (menu převezme pokoj s oknem z B). Výška ruky ve všech variantách 12 m jako dnes, takže se nemění délka letů. Vyšší místo (kopec, věž) by prodloužilo každý let o ~0,3 s na metr a chtělo by nové kolo simulace.

BLOCKED: **Co je za hlavním menu?** (a) **Pokoj v podkroví s oknem** (dítě u stolu, za oknem ranní město). „Házet“ = kamera za 0,5 s sjede na balkon bez střihu. (b) **Nejvzdálenější čtvrť** podle dnešního návrhu menu (07-menu §2.1, kamera pluje nad městem). „Házet“ = přechod listem papíru do Dílny. (c) (a) a za oknem barva denní doby nejvzdálenější čtvrti (ráno, poledne, zlaté odpoledne, večer), aby byl postup vidět i doma. **Doporučuji (a)**: Házet je plynulé, menu se načte rychle (vykreslí jen místo 0–1) a domov je první, co hráč vidí. Variantu (c) by musel posoudit art-director (bible drží Dílnu za úsvitu).

BLOCKED: **Vlaštovka při oddálení na telefonu.** (a) **Vlaštovka se při oddálení zvětší** tak, aby měla vždy aspoň 24 px (město se zmenší, vlaštovka ne). (b) Na úzké obrazovce se kamera oddálí méně (strop +20 % místo +50 %). (c) Nic, vlaštovka se zmenší až na ~13 px. **Doporučuji (a)**: rychlost je vidět na městě a vlaštovka zůstane čitelná i s kruhem QTE. Vlaštovka je už dnes 7,75× větší než ve skutečném měřítku, takže další zvětšení nikoho nezarazí. (c) by porušila pravidlo „vlaštovka vždy vidět“ (bible P1).

## 8. Co je zástupné a co jsem neověřil
- Všechna čísla (W_aim 55 m, A 0,35, S_full 0,8, poločasy, 70 ms, 0,25 s) jsou zástupná. Ladí se testem v Node (§4.2) a playtestem.
- Velikosti v px (24 / 52 / 64 / 13 px) jsou přepočet z bible (24 px při 120 m) úměrou ke W, **NOT ASSESSED** v prohlížeči.
- Přebytky modelů v §3.5 jsou ruční výpočet `speed·cos(ideal)` / `cruise` při síle 0,75, bez větru a bez simulace.
- Vzhled balkonu, okna a háku: vlastník art-director (`02-misto-odhodu-vzhled.md`), tady jen herní požadavky.
