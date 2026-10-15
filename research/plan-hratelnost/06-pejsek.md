# Pejsek: papírový pes místo nálezce

> **NÁVRH** (art-director, 15. 10. 2026). Závazné až po schválení uživatelem (orchestrátor zapíše do `research/bonusy/06-rozhodnuti.md`).
> Zadání: 06, blok „Pejsek místo nálezce“ (15. 10.). Malý papírový pejsek zvedne vlaštovku ze země, udělá krátkou roztomilou animaci a uteče ze záběru doprava. Velká scéna ve finále, občas krátká verze při dopadu, souběžně s kartou výsledku, nikdy neblokuje další hod (K1). Nahrazuje „druhé dítě chytí vlaštovku“ v K9 (`05-karty-mechanik.md`).
> Podklad: bible `research/design/05-styl-papir.md` (dál „bible“) kap. 3, 6, 7, 9.4, 13; technika postavičky C `03-art.md` kap. 1 a kód `src/render3d/models/kid.js`, `kid-rig.js`, `paper.js kidMaterial`; kamera přistání `camera.js LANDING`, `frame.js cameraFor`, `pose.aimWidth`; karta výsledku `02-ux.md` §4.2.
> Náčrty: `research/design/img/hratelnost/pejsek.png` (tvar, velikosti, šeď, záběry ve hře s kartou, barvy na zemi 4 čtvrtí), `pejsek-pozy.png` (klíčové pózy). Generuje je `hratelnost.mjs` (konec souboru, `DOG`, `DPOSE`): `ONLY=pejsek node research/design/img/hratelnost/hratelnost.mjs`. Prohlížeč jsem nepoužil, **vzhled ve hře je NOT ASSESSED**.

## 0. Shrnutí

| Co | Návrh |
|---|---|
| Pes | Malý voříšek tvaru teriéra, **0,6 m** vysoký (se špičkou ucha), 0,65 m dlouhý. Velká hlava, krátké nohy, vztyčené trojúhelníkové uši (skládaný papír), ocas nahoru. **Krémový s tmavýma ušima, tlapkami a špičkou ocasu, rajčatový obojek** (stejný proužek jako čepice dítěte: pes patří do jeho světa). |
| Technika | Stejná jako postavička C: tuhé „soustružené“ díly, jeden tón na stěnu, `kidMaterial`, bez obrysu. **LOD H 388 △, LOD 1 100 △**, 1 draw call, jen když je pes vidět. |
| Finále | ~6 s: příchod zleva, čuchnutí, zvednutí vlaštovky do tlamy, roztomilý moment (varianta A/B/C), útěk doprava. Karta „Delivered.“ až po útěku, dotyk ji ukáže hned. |
| Krátká verze | 1,45 s při dopadu (např. nový rekord), souběžně s kartou výsledku: vběhne, chňapne, poskočí, uteče. Podržet = hod platí od první chvíle. |
| Kamera | Po dopadu je dnes záběr 102 m a pes by měl **8 px**. Pes potřebuje přiblížení: krátká verze **10 m** (telefon 5 m), finále **8 m** (telefon 3,6 m). Vlaštovka se tím podle M-2 zmenší na 0,5 m (velikost hračky v ruce dítěte). |

---

## 1. Pes

### 1.1 Silueta a proporce (`pejsek.png`, první řádek)
- **Tvar teriéra-voříška, ne konkrétní plemeno.** Rozhoduje silueta na 25 px: obdélník trupu na čtyřech sloupcích, velká kulatá hlava vpředu nahoře, **dva tmavé trojúhelníky uší** (nejčitelnější znak „pes“, i v šedi) a čárka ocasu nahoru. Proporce „hlavičková“ jako dítě C (hlava ⌀ 0,22 m proti trupu 0,21 m vysokému): roztomilost dělá velká hlava a krátké nohy (P2, Tearaway).
- **Měřítko (M-1, bible 3.1):** skutečné míry. Kohoutek 0,37 m, hlava nahoře 0,53 m, ucho 0,6 m, délka 0,65 m. Dítě 1,2 m je dvakrát vyšší. Vlaštovka v tlamě 0,5 m (M-2, viz kap. 3): pes nese hračku „skoro velkou jako on“, to je záměr a vtip.
- **Vlaštovku drží za zadní třetinu**, nos vlaštovky míří po směru čenichu a lehce nahoru. Tak nezakryje psovi oči ani uši (náčrt, póza 3) a vypadá to, jako by ji „vezl“.

### 1.2 Barvy (jen tokeny, žádný nový hex)
| Část | Barva | Token |
|---|---|---|
| trup, hlava, nohy, čenich | `#fbf6ec` | `PT.cream` |
| uši, tlapky, nos, oči, špička ocasu | `#4a4038` | `PT.pencil700` (jako boty a oči dítěte) |
| obojek | `#d9472b` | `PT.tomato` (jako proužek čepice dítěte) |

**Proč krémový (změřeno z hex, WCAG poměr proti zemi ulice `ground.near` čtvrtí 1 / 2 / 3 / 4):**

| Varianta | 1 `#dcc29b` | 2 `#c8a079` | 3 `#b8863b` | 4 `#1d2b4d` (finále) |
|---|---|---|---|---|
| **A krém (návrh)** tělo | 1,59 | 2,23 | 2,99 | **12,95** |
| A uši `pencil700` | 5,88 | 4,21 | 3,13 | 1,38 |
| B kraft `#c9a57c` | 1,34 | **1,05** | 1,41 | 6,08 |
| C tužka `#6b6158` | 3,52 | 2,52 | 1,87 | 2,31 |

Krém vychází nejlíp celkově a hlavně ve finále (čtvrť 4, noc). Ve čtvrti 1 nese siluetu kombinace krémového těla a tmavých uší, tlapek a stínu pod psem (proxy, kap. 1.4). Kraft by zmizel v hliněných ulicích 2–3, tužka v noci. Řádky „A / B / C“ v `pejsek.png`. Pes **není bílý s grafitem** (bible 6 bod 2): je krémový bez obrysu a stojí na zemi, ne v pásu letu.

### 1.3 Díly a prstence (LOD H, `hratelnost.mjs DOG.H`)
Stejný díl jako u dítěte: `lathe(rings, n)` z `models/parts.js`, prstence `[y, rx, rz, dx]` podél osy dílu, poloměr 0 = pól (vějíř), víčka jen kde jsou vidět. Díly „podél x“ jsou otočené `rz(−π/2)` (osa dílu → nos psa, `rx` → svisle, `rz` → do boku). Souřadnice psa: chodidla y = 0, nos na +x (směr útěku), kamera na +z.

| Díl | n | Prstence (m) | Víčka | △ | Barva |
|---|---|---|---|---|---|
| trup (podél x) | 10 | pól −.24; [−.2, .08, .075]; [−.1, .1, .095]; [.07, .105, .1]; [.18, .095, .09]; pól .24 | – | 80 | krém |
| noha 4× | 6 | [−.135, .032, .032]; [0, .038, .038] | – | 4 × 12 | krém |
| tlapka 4× | 6 | [−.17, .04, .035, .014]; [−.135, .033, .033] | spodní | 4 × 16 | `pencil700` |
| krk + obojek (krk skloněný −0,3) | 8 + 10 | krk [−.06, .065, .06]; [.05, .055, .05] · obojek [−.025, .071, .066]; [.01, .069, .064] | – | 16 + 20 | krém, `tomato` |
| hlava | 10 | pól 0; [.035, .08, .085]; [.095, .108, .108]; [.155, .105, .103]; [.2, .066, .07]; pól .225 | – | 80 | krém |
| čenich (podél x, v hlavě [.06, .08]) | 8 | [0, .055, .055]; [.06, .046, .05]; [.1, .034, .038]; pól .12 | – | 40 | krém |
| nos (v hlavě [.165, .085]) | 6 | [0, .022, .026]; pól .024 | – | 6 | `pencil700` |
| ucho 2× | – | stan (skládaný trojúhelník) šíře 0,09, výška 0,11, tloušťka 0,02; v hlavě [−.01, .19, ±.055], `rx(±.35)·rz(.15)` | – | 2 × 6 | `pencil700` |
| oko 2× | – | destička 0,032 m na x = .106, y = .14, z = ±.045 | – | 2 × 2 | `pencil700` |
| ocas | 6 | [0, .024, .024]; [.08, .017, .017] + špička [.08, .017]; pól .13 | – | 12 + 6 | krém, `pencil700` |
| **celkem** | | | | **388** | |

**LOD 1 (100 △, `DOG.L1`):** trup 6 stěn (2 prstence + póly), nohy 4 stěny bez tlapek, krk 4, hlava 6, čenich 4 (kužel), uši jen přední trojúhelník, ocas 4 stěny tmavý; bez obojku, nosu a očí. Na 25 px je silueta stejná (`pejsek.png`, „25 px LOD 1“ a „25 šedá“).
**Přepínání** stejné jako u dítěte, v px na metr: LOD 1 pod **36,7 px/m**, LOD H nad **43,3 px/m** (`KID_LOD` 44 / 52 px ÷ 1,2 m). Záběry psa (kap. 3) jsou všechny nad 43 px/m → LOD H; LOD 1 jen během jízdy kamery z 102 m dolů. **LOD 2:** 0 (pes mimo záběr se nekreslí).

### 1.4 Kostra, materiál, rozpočet
| Kloub | Rodič | Poloha v rodiči (m) | Rotace |
|---|---|---|---|
| kořen | svět | bod dopadu + posun běhu po x | `yaw(yaw)` |
| trup | kořen | [0, .2 + lift, 0] | `rz(pitch)` |
| noha PB / PV / ZB / ZV | trup | [±.15 / −.16, −.03, ±.06] | `rz(legs[i])` (+ = dopředu) |
| krk (+ obojek) | trup | [.19, .06, 0] | `yaw(head0)·rz(head1)·rx(head2)` |
| hlava (+ čenich, nos, uši, oči) | krk | [.02, .04, 0] | – |
| tlama (bod vlaštovky) | hlava | [.17, .06, 0] | vlaštovka po směru +x hlavy |
| ocas | trup | [−.23, .06, 0] | `rz(tail0)·rx(tail1)` (zdvih, vrtění) |

- **Materiál: sdílet `kidMaterial`** (rampa po stěnách, vlákna, opar, bez lesku a obrysu, `paper.js`). Je to stejná technika „papírový model z dílků“; druhý materiál by jen rozdělil vzhled. Bible kap. 3 výjimku rozšiřuje z „dítě“ na „dítě a pes“ (upraveno).
- **1 draw call:** vlastní předem alokovaný buffer `[LOD H][LOD 1]`, `setDrawRange` jako `kid-rig.js`, CPU skládá pózu bez alokace za snímek (~1 500 vrcholů, pod 0,1 ms). Mesh je v scéně jen během scény psa (`visible = false` jinak), takže **mimo scénu 0 DC**.
- **Stínový proxy:** elipsa pod psem 0,66 × 0,26 m, `shade #3b3560` alfa 0,28 (bible kap. 5), ≤ 8 △, v tomtéž bufferu.
- **Rozpočet:** strop `tris [470, 120, 0]` (+20 %). Místo dopadu má dnes rezervu (≤ 14 DC, 15 tis. △ na místo, `render3d.md`); +1 DC a +0,4 tis. △ jen po dopadu. Měřit `perf-check`.

---

## 2. Animace (`pejsek-pozy.png`)

Všechny pózy a posun psa běží **„on twos“ (12 fps)**, jako prostředí (bible 7); kamera jede plynule. Mezi klíčovými pózami lineární míchání úhlů, sampl na 1/12 s. Úhly v rad (tabulka `DPOSE` v `hratelnost.mjs` je předloha).

### 2.1 Klíčové pózy (klouby)
| Póza | yaw | pitch / lift | head [yaw, kývnutí, náklon] | tail [zdvih, vrtění] | legs [PB, PV, ZB, ZV] |
|---|---|---|---|---|---|
| stoj | .5 | 0 / 0 | [.2, −.2, 0] | [.45, 0] | 0, 0, 0, 0 |
| klus (2 fáze, nohy prohozené) | .3 | 0 / .015 | [0, −.35, 0] | [.6, ±.3] | .4, −.3, −.3, .4 |
| čuch | .45 | −.25 / −.02 | [.1, −1.7, 0] | [.3, .25] | .3, .25, −.25, −.2 |
| drží (zvednutí) | .6 | .06 / 0 | [.3, −.15, 0] | [.35, .3] | .05, −.05, 0, 0 |
| A sed, hlava na stranu | .85 | .6 / −.085 | [.6, −.6, .4] | [1.45, ±.55] | −.6, −.55, 1.5, 1.45 |
| B úklon | .55 | −.42 / −.05 | [.45, .3, 0] | [.1, ±.55] | 1.05, 1, .15, .1 |
| B poskok | .55 | .18 / .13 | [.35, −.3, 0] | [.5, −.45] | .75, .55, −.75, −.55 |
| C předání | 1.3 | −.15 / −.01 | [0, −.8, −.15] | [.6, ±.5] | .15, .1, −.1, −.05 |
| cval (útěk) | .12 | .06 / .05 | [0, −.45, 0] | [.15, 0] | .85, .6, −.85, −.6 (2 fáze) |

### 2.2 Finále (místo 16, čtvrť 4), ~6 s od dopadu
| # | Čas (s) | Co | Pózy |
|---|---|---|---|
| 0 | 0–1,2 | dopad (hitstop 0,12 s), kamera jede ze 102 m na 8 m, bod dopadu na (0,3; 0,6) | – |
| 1 | 0,9–2,1 | **příchod** zleva klusem (2 kroky/s), zastaví u vlaštovky | klus ⇄ klus' → stoj |
| 2 | 2,1–2,7 | **čuchnutí**: hlava k vlaštovce, 2 čuchy (kývnutí ±0,1) | čuch |
| 3 | 2,7–3,1 | **zvednutí**: hlava nahoru, vlaštovka v tlamě, ocas škubne | drží |
| 4 | 3,1–4,9 | **roztomilý moment** (varianta, `BLOCKED 1`) | A / B / C níže |
| 5 | 4,9–5,9 | **útěk doprava**: otočí se (yaw .6 → .12 za 0,2 s), cval, za 1 s ze záběru. Kamera stojí, nesleduje | cval ⇄ cval' |
| 6 | 6,0 | karta „Delivered.“ a souhrn (K9) | – |

**Varianty momentu 4 (1,8 s):**
- **A Hlava na stranu (doporučuji):** sedne si, podívá se do kamery, nakloní hlavu (0,4 rad) a dvakrát zavrtí ocasem. Nejčitelnější i na 45 px, klidný konec hry (K9: „uzavření bez tlaku“), a jako statická póza funguje i pro reduced motion.
- **B Úklon a poskok:** předníma nohama k zemi („pojď si hrát“), pak dva poskoky na místě. Nejvíc energie, ale ve statické póze se ztratí.
- **C Předání bez slov:** otočí se ke kameře, nabídne vlaštovku hráči (sklopí hlavu), pak si to rozmyslí a uteče s ní. Nejvíc příběhu (vtip „tahle je moje“), ale nejvíc póz a nejtěžší na čitelnost (pes čelem, vlaštovka zkrácená).

**Neblokuje:** dotyk kamkoli scénu přeskočí na kartu (pes střihem pryč); podržet = hod (K1) platí od dopadu. Karta „Delivered.“ se nečeká, jen se neukáže dřív, než hráč chce.

### 2.3 Krátká verze při dopadu (1,45 s, souběžně s kartou)
Start 0,25 s po dopadu, karta výsledku najede současně (`dialog-in`). Pes **vběhne z levého okraje volné plochy** (není vidět, odkud přišel, nečeká se na něj).

| Čas (s) | Co | Pózy |
|---|---|---|
| 0–0,4 | klus k vlaštovce | klus ⇄ klus' |
| 0,4–0,65 | chňapne v pohybu (hlava dolů a nahoru, nezastaví) | čuch → drží |
| 0,65–0,95 | jeden poskok s vlaštovkou | poskok |
| 0,95–1,45 | cval doprava, zmizí za kartou (desktop) nebo z okraje (telefon) | cval |

- **Nekryje kartu:** karta je DOM nad plátnem, pes je vždy pod ní. Na desktopu vbíhá za kartu („schová se za papír“), to je v pořádku.
- **Neblokuje vstup:** nic se nečeká, „Throw again“ i podržet fungují od první chvíle; při začátku míření pes zmizí střihem.
- **Nebere pozornost výsledku:** bez zvuku navíc kromě jednoho tichého štěknutí (audio-designer), bez textu, bez reakce UI.
- **Dnešní karta** (`dialog#result` uprostřed se `::backdrop`) by psa zakryla a ztlumila. Krátká verze potřebuje rozložení U7 (`02-ux.md` §4.2: telefon zdola, desktop vpravo 420 px, na šířku vpravo).

### 2.4 Reduced motion a Calm camera
- **Finále:** kamera **střihem** na 8 m, pes **stojí s vlaštovkou v tlamě** v póze A (sed, hlava na stranu) 2 s, pak střih na kartu. Bez klusu, cvalu a vrtění. Informace „vlaštovku našel pejsek“ zůstane.
- **Krátká verze: vypnutá.** Nenese žádnou informaci (všechno je na kartě), je to čistá ozdoba (bible 7: „pohyb pryč, informace zůstane“).

---

## 3. Kamera a záběr (`pejsek.png`, řádky 2–4)

**Proč přiblížení:** po dopadu dnes kamera drží 102 m (`LANDING.zoom 0,85` × 120 m) a vlaštovka je na (148/640; 0,83). Pes 0,6 m by měl na 1280 px **8 px** (řádek „Dnes po dopadu“). Bez přiblížení pes neexistuje.

| Záběr | Šířka | 1280 × 800 | 375 × 667 | 932 × 430 | Kde je pes | Vlaštovka |
|---|---|---|---|---|---|---|
| dnes po dopadu | 102 m | 8 px | – | – | – | 6,2 m |
| **krátká verze** | **10 m** (telefon **5 m**) | **77 px** | **45 px** | **56 px** | bod dopadu na (0,3; 0,64), telefon (0,3; 0,27) nad kartou, na šířku (0,15; 0,6) vlevo od karty | **0,5 m** |
| **finále** | **8 m** (telefon 3,6 m) | **96 px** | 64 px | ~70 px | (0,3; 0,6), karta až po útěku | 0,5 m |

- **Jízda kamery:** šířka logaritmicky ze 102 m na cíl za **0,7 s** (krátká) / **1,2 s** (finále), ease-out, bez natočení, sklon letu 6° beze změny. Stejný druh pohybu jako úvod → míření (H1). Reduced motion / Calm camera: střih.
- **Telefon na výšku:** karta zdola zabírá ~58 % výšky, pes proto běží v horním pásu (bod dopadu na 27 % výšky). Ověřit s reálnou výškou karty U7.
- **Vlaštovka:** M-2 (`frame.planeLength`) by pod 16 m vlaštovku dál zmenšovala (10 m → 0,26 m). Pro záběry psa **spodní mez 0,5 m** (`max(REST.hand, L(W))`), stejná velikost jako v ruce dítěte. Obrys 2,6 px grafit zůstává (P1).
- **Krátká verze 16 m (jako míření) nestačí:** pes by měl 48 px na desktopu a 32 px na telefonu, ve velkém prázdném záběru se ztratí (ověřeno náčrtem při psaní). Proto 10 m.
- **`airFocus` (05 §1):** pes je na zemi až po dopadu, ve vzduchu s ničím nesoupeří. Po dopadu platí stejná zásada „jedna výrazná věc“: **K9 záběr zpět a karta čtvrti mají přednost**, pes se při nich nehraje (ani krátká verze). Finále je výjimka: pes je tam hlavní věc a záběr zpět se nehraje. Pes nikdy během QTE, za letu ani při úvodu.
- **Kdy „občas“** (06: návrh art-director + game-designer): z pohledu obrazu stačí, aby to nebylo pořád (vtip se omrzí) a aby to něco značilo. Návrh: **nový rekord** (páska rekordu prasknutá) a nejvýš jednou za 3 hody, nikdy první hod (tutoriál) ani při K9. Výslednou podmínku navrhne game-designer jako čistou funkci (`dogCue`), tady jen omezení obrazu.

---

## 4. Dávka pro game-deva: **H6 Pejsek** (po schválení BLOCKED 1–3; závisí na H2, U7, T5)

| Krok | Soubory | Co |
|---|---|---|
| 1 Model | nový `src/render3d/models/dog.js` (+ registr `models/index.js`) | díly tab. 1.3 (LOD H 388, LOD 1 100 △) přes `lathe` z `parts.js` a stan uší; klouby 1.4; pózy 2.1 jako `DOG_POSES`; čistý, bez three.js (jako `kid.js`) |
| 2 Rig | nový `src/render3d/models/dog-rig.js` | buffer `[H][L1][stín]`, normály za snímek, `dogLod(pxPerM, prev)` 36,7 / 43,3, `poseDog(rig, pose, t)` bez alokace, bod tlamy pro vlaštovku |
| 3 Scéna | `src/render3d/index.js` nebo nový `dog-scene.js`, `workshop.js` (sdílet `kidMaterial` a uniformy) | časová osa 2.2 / 2.3 (čistá funkce `dogTimeline(kind, t, reduced)` → póza, poloha, vlaštovka v tlamě ano/ne), on twos, skrytí mimo scénu |
| 4 Kamera | `src/render3d/camera.js` (stav `dog`), `frame.js` (`planeLength` spodní mez při záběru psa) | šířky a kotvy kap. 3, jízda 0,7 / 1,2 s, střih při `calm` |
| 5 Napojení | `src/ui.js` (přeskočení dotykem, vstup hned), T5 finále | krátká verze jen když logika vrátí `dogCue`; při K9 nikdy |

**Testy (`tests/`):** `render3d-dog.test.js`: △ LOD H ≤ 470, LOD 1 ≤ 120; všechny barvy z `PAPER_TOKENS`; `dogLod` hystereze; `dogTimeline` krátká verze ≤ 1,45 s a vrací `null` při `reduced`; finále při `reduced` = jedna statická póza; bod tlamy v tlamě (vzdálenost od čenichu < 3 cm) ve všech pózách s vlaštovkou; `poseDog` nealokuje (stejný buffer). Kamera: stav `dog` dává pro 1280 / 375 / 932 px psa ≥ 45 px; `planeLength` v záběru psa ≥ 0,5 m.
**Ověření v prohlížeči:** 375 × 667, 932 × 430, 1280 × 800; krátká verze i finále, čtvrtě 1 a 4; snímek do šedi na 25 % (bible 6): vlaštovka první, pes druhý; podržet během psa = hod; reduced motion; `perf-check` (+1 DC jen během scény). Pak `art-review`.

## 5. BLOCKED

- `BLOCKED: Jaký roztomilý moment má pejsek ve finále? Obrázek research/design/img/hratelnost/pejsek-pozy.png, druhý řádek. A) sedne si a nakloní hlavu ke kameře, zavrtí ocasem (klidné, čitelné i na telefonu, funguje i bez animací); B) úklon „pojď si hrát“ a dva poskoky (nejvíc energie); C) nabídne vlaštovku hráči a pak si to rozmyslí a uteče s ní (vtip, nejvíc práce a hůř čitelné). Doporučuji A.`
- `BLOCKED: Jakou barvu má pejsek? Obrázek pejsek.png, dva spodní řádky (pes na zemi všech 4 čtvrtí). A) krémový s tmavýma ušima a rajčatovým obojkem (vidět ve všech čtvrtích, hlavně v noční čtvrti 4, kde je finále); B) hnědý kraftový (víc „karton“, ale v hliněných ulicích čtvrtí 2 a 3 zmizí); C) šedohnědý tužkový (v noci zmizí). Doporučuji A.`
- `BLOCKED: Krátká verze při dopadu potřebuje přiblížit kameru (dnes by byl pes 8 px). Obrázek pejsek.png, řádky 2–3. A) přiblížit na 10 m jen když pes přiběhne (např. nový rekord), hráč na chvilku nevidí celé město kolem dopadu, informace je na kartě; B) krátkou verzi nedělat, pes jen ve finále; C) přiblížit méně (16 m), pes je malý (48 px desktop, 32 px telefon). Doporučuji A.`
