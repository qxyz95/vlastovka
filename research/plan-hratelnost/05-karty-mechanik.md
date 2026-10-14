# Karty mechanik „chuti hrát dál“ (game designer)

**15. 10. 2026.** Realizační karty z návrhu kreativního ředitele `04-chut-hrat-dal.md`, upravené podle rozhodnutí 06 z 15. 10. („Plán hratelnosti, odpovědi…“ body 1–15 a „Chuť hrát dál…“ body 1–5). Sjednocuje i můj dřívější návrh `01-game-design.md`. Pro product-designera, art-directora, game-deva a narrative-writera.

**Konvence.** Opora `08 [1]` = blok KB a zdroj, `08 §3.4` = oddíl, `08 N3` = hypotéza bloku; zdroje doplněné v 04 §9 píšu jménem (např. „Lomas 2017, 04 §9“), protože **D1–D4 jsou tu čtvrti** a **T1–T9 dávky**. Štítky **V** výzkum · **H** heuristika oboru · **N** naše hypotéza (u N vždy „ověřit:“). Cena **S** do půl dne · **M** 1–2 dny · **L** 3+ dní. **Všechna čísla jsou zástupná** (ladí je balance-analyst až po schválení obsahu, 06 15. 10.). Nic se nehrálo ani neměřilo: odhady účinku, výkonu a pracnosti jsou **NOT ASSESSED**.

**Co platí (06, 15. 10.):** cíl je „skoro každý hod **důvod** hodit znovu“, koupě a novinky střídměji · na výsledku **jeden čip** na nejbližší koupi, výběr dál v Dílně · **žádná tužková stopa** v letu · druhé dítě (nálezce) **až ve finále** · vystřihovánka se rozkládá **v každé čtvrti jinak** · podržet kdekoli = hod (z titulu i výsledku) · vztyčení po budovách · QS1 · Spropitné · 4 nové vlaštovky · kousky odložené · razítka pryč, zastávky nahradí vztyčení dominanty · předpověď událostí až jako odemčení · ~90 min · ve vzduchu nejvýš jedna výrazná věc najednou.

---

## 1. Smyčka jednoho hodu a sezení

Měřítko každé fáze (`02 §2.7` bod 1, N): **umí hráč v tu chvíli říct, proč hodí znovu, věcí ve hře?** Druhy důvodů v celém dokumentu: **R** rekord (závod s nejlepším) · **M** rozdíl proti minule (závod s minulým) · **C** blízký cíl na dohled · **N** novinka ve vzduchu nebo ve světě · **K** koupě · **P** nové místo (velký moment).

| Fáze | Co hráč vidí | Kde vzniká důvod | Karta | Opora |
|---|---|---|---|---|
| **Titul / míření** | podkroví, dítě drží vlaštovku, nápis „Throw it“ v nebi; podržet kdekoli | okamžitá příležitost pokračovat (žádný krok navíc) | K1 | `08 §3.4` [9] V |
| **Výhoz a stoupání** | kamera se oddálí podle přebytku rychlosti, první událost (→) | dobrý výhoz se hned zúročí (QS1, SK1 slot 1) | 01 QS1 | `01 [26]` V, P1 |
| **Let nad vztyčeným městem** | stojící město, které hráč „postavil“; události s rolí | výkon v událostech (síla podle letu) | 01 QS1, SK1 | P1 V |
| **Přiblížení k rekordu** | papírová **páska rekordu** přes ulice, za ní ploché archy; vlajka dalšího místa | napětí „doletím, nedoletím“ do konce letu | K5 | Lomas 2017 (04 §9) V, `08 [1]` V |
| **Za rekordem** | budovy se vztyčují před vlaštovkou, každá čtvrť jinak (D2 mola, D3 koberec, D4 lampiony) | kus světa, který před chvílí nebyl; v D2–D4 i informace pro hru | K5–K8 | `08 [13]` V, `08 [10]` V/teorie |
| **Dopad** | kamera zůstane u místa dopadu a natočí se k vlajce dalšího místa „Gardens · 86 m“ | blízká, uzavíratelná mezera | K3 | `08 [1][10]` V, `03 N1` |
| **Výsledek** | dolet a rekord · **rozdíl proti minule s příčinou** · jedna novinka z fronty · **čip nejbližší koupě** · další cíl | učební cíl na další hod; koupě bez cesty do Dílny | K2, K4 | `02 [12]` V, `04 [23]` V |
| **Dílna (volitelně)** | strom, vlaštovky, náhled „Now → after“ | volba stylu, cíl, na který se šetří | `research/obsah/02` | `01 N3` N |
| **Hranice čtvrti** | klidný pohled zpět na celou čtvrť, slunce se posune, karta nové čtvrti; „Keep throwing“ a „Menu“ stejně velké | uzavření a vlastní volba: dobré místo odejít | K9 | `03 N1`, `08 N11` H/N, Alexandrovsky 2024 (04 §9) V/H |
| **Finále** | druhé dítě na konci města chytí vlaštovku, beze slov; „Delivered.“ a souhrn | konec hry | K9 | `02 §2.7` bod 4 N |

**Pravidlo jedné výrazné věci ve vzduchu (bible, 06).** Čistá funkce `airFocus(state)` vrátí jedinou věc, která smí mít zvukový akcent, pohyb kamery nebo titulek. Pořadí: aktivní QTE (varování a okno) > první setkání s událostí > nové místo (banner) > prasknutí pásky rekordu > vztyčení dominanty > běžné vztyčování (budovy, mola, lampiony) > posun konce koberce D3. Ostatní běží „potichu“: bez zvukového akcentu, menší amplituda, žádná reakce kamery. Nic se neodkládá ani nepřesouvá (pravdivost, P10), jen se tlumí. Test: pro každou dvojici souběžných věcí vrátí vyšší prioritu; při `reduced` nikdy pohyb kamery. Opora: juice má optimum `05` Kao 2020 (P2, V jen z abstraktu), efekty nesmí přehlušit zpětnou vazbu zásahu `01 [26]` V. Cena S (logika) + napojení v rendereru S.

---

## 2. Karty mechanik

### K1 — Bez prodlevy / Already Folded (04 B1) · jádro · **S**
- **Cíl pro hráče:** chci to zkusit znovu hned, dokud vím, co udělat jinak.
- **Pravidla:** (1) Na výsledku i na titulu: **podržet kdekoli mimo ovládací prvky = nabíjení**, puštění = hod. Ovládací prvky (Throw again, Dílna, Atlas, ☰, čip K4) držení nikdy nespustí. (2) Prvních **400 ms** po zobrazení karty se vstup ignoruje (ťuknutí z konce letu nesmí hodit). (3) Při stisku se karta odsune (150 ms) a kamera **přestřihne** na míření (z místa dopadu je to stovky metrů, jízda by zdržela); nabíjení běží od stisku. (4) Dítě v podkroví po dopadu už drží další složenou vlaštovku (art). (5) „Throw again“ / Enter / mezerník zůstávají (02-ux U7). Nic se nespouští samo.
- **Stavy:** `result.locked` (0–400 ms) → `result.ready` → stisk mimo prvky → `aim.charging` → puštění ≥ 150 ms → `flight`; puštění < 150 ms → `aim` (krátké ťuknutí, U6).
- **Zástupná čísla:** zámek 400 ms, práh hodu 150 ms (02-ux §9.2), odsun karty 150 ms.
- **Co uvidí:** žádnou novou grafiku kromě vlaštovky v ruce dítěte; „Throw again“ **nepulzuje ani nebliká** (`02 §4.3` bod 6).
- **Texty:** nové nejsou (výzva a nápověda z U6).
- **Závislosti:** U3 (automat obrazovek: `result` → `aim` bez titulu), U6 (držení kdekoli), U7 (karta). Je to **zpřesnění U6/U7**, ne nová dávka.
- **Test přijetí:** čistá `resultInput(msSinceShown, target, heldMs)` → `ignore | charge | throw | tap | control`; případy: 399 ms ignore, stisk na čipu = control, stisk na kartě mimo prvky = charge. Prohlížeč: dotyk, myš, klávesnice; omylový hod při čtení karty (5 pokusů), reduced motion = střih.
- **Opora:** Ovsiankina, obnovení přerušeného úkolu **při okamžité příležitosti** ~67 %, `08 §3.4` [9] **V** (meta-analýza, laboratorní úkoly v minutách). Pokračování jako aktivní volba bez autoplay `02 §2.7` bod 5 (N, ICO H).
- **Riziko / okraje:** omylový hod při čtení (zámek + práh); hráč, který chce odejít, nesmí být tlačen (Menu dosažitelné, nic neodpočítává). **Zneužití:** žádné, hod se počítá stejně. **Náhled:** nápověda výzvy z U6 („Hold anywhere“) ustoupí po 3 hodech.
- **Ověřit (N):** doba dopad → další stisk, podíl hodů do 5 s; lítost (`02 §4.4`) nesmí vzrůst proti verzi s tlačítkem.

### K2 — Rozdíl proti minule / What Changed (04 B3, bez tužkové stopy) · jádro (BLOCKED 2) · **S–M**
**Rozhodnutí v kartě: řádek zůstává, ale jen ve výsledku.** Uživatel zamítl stopu v letu (06 bod 3), řádek ve výsledku je jiné médium: nic nepřidává do vzduchu. Výzkumná opora pro řádek je **jiná než pro stopu**: pro stopu mluvil ghost ve VR (D5), pro řádek mluví informační zpětná vazba a směrová KR. Bez řádku by „závod s minulým výkonem“ z rozhodnutí 06 bod 1 neměl ve hře žádného nosiče.
- **Cíl:** po každém hodu vím, co bylo jinak, a mám jeden učební cíl na další hod.
- **Pravidla:** jeden řádek pod doletem (nahrazuje řádek 2 „jedna příčina“ v 02-ux §4.2): `±Δ m vs last · příčina` nebo jen příčina.
  1. `Δ = dolet − dolet minulého hodu` (nepočítá se u hodu 1 a po zrušeném hodu se bere poslední dokončený).
  2. **Příčiny jen z dat, která se opravdu změnila**, nejvýš dvě, v pořadí: (a) **výbava** od minula (koupě, papír, jiná vlaštovka) · (b) **zásahy**: počet zásahů nebo perfektů se liší o ≥ 1 · (c) **výhoz**: kategorie síly nebo úhlu se změnila (`angleHint`, „released early / late“, „a bit steeper“) · (d) **vítr**: změna o ≥ 1 m/s („tailwind“ / „headwind“; hráčův podíl to není, ale je to pravda).
  3. Řádek **netvrdí příčinnost** („kvůli“), jen vedle sebe staví rozdíl a co se změnilo. Žádné procento podílu.
  4. **Mlčet** o Δ, když `|Δ| < max(5 m, 4 % minulého doletu)`; pak zůstane jen směrová nápověda výhozu, je-li (dnešní `angleHint`). Když není ani ta, řádek odpadne.
  5. Při rekordu je řádek 1 „★ +31 m over your best“ a řádek 2 rozdíl proti minule **jen když se liší výbava** (jinak by dva řádky říkaly totéž).
- **Stavy:** `silent | hint | diff | diff+cause`.
- **Zástupná čísla:** práh 5 m / 4 %, nejvýš 2 příčiny, nejvýš ~6 slov.
- **Co uvidí:** jeden řádek textu, + v tyrkysové a − v grafitu (ne červená, není to trest), ikona příčiny (sponka = výbava, terč = zásahy, ruka = výhoz, praporek = vítr), tvar + text (P15).
- **Texty (návrh):** `result.diff.up` „+{m} m vs last“ / „+{m} m oproti minule“ · `result.diff.down` „{m} m short of last“ / „o {m} m kratší než minule“ · `result.cause.gear` „{item}“ · `result.cause.hits` „{n} hits“ / „{n} zásahy“ (plurály) · `result.cause.perfects` „{n} perfect“ / „{n}× perfektně“ · `result.cause.early` „released early“ / „puštěno brzy“ · `result.cause.late` „released late“ / „puštěno pozdě“ · `result.cause.tail` „tailwind“ / „vítr do zad“ · `result.cause.head` „headwind“ / „vítr proti“.
- **Závislosti:** U7 (karta), data letu `outcome` (zásahy, perfekty, výbava, vítr), U1 (klíče). Narrative doladí znění.
- **Test přijetí:** čistá `throwDiff(prev, cur)` → `{kind, delta, causes[]}`; případy: hod 1 → `silent|hint`; |Δ| pod prahem → bez Δ; koupě + o 2 zásahy víc → `[gear, hits]` v tomto pořadí; stejná výbava a stejné zásahy → nikdy příčina „gear“; zrušený hod se nepočítá. Prohlížeč: EN/CS délka na 360 px, čtečka čte řádek jako jednu větu.
- **Opora:** pozitivní informační zpětná vazba zvýšila volné chování d ≈ +0,33, `02 [12]` **V** (meta-analýza, mimo hry); směrová KR učí, binární ne, `04 §1` bod 7 [23] **V** (jedna preregistrovaná studie, n = 228); ukončení předpovídá změna proti **minulé** hře, hráči se srovnávají s nedávnou minulostí, `09 §2.5` [Z3] **V/B** (observační, jedna hra). Jedna srozumitelná příčina na neúspěch `04 N7` **N**; oddělení podílu hráče a vlaštovky `03 N8`, `04 N4` **N** (experimentální opora oslabena, P7).
- **Riziko:** zpětná vazba po dobrých pokusech přifukuje dojem učení `04 §1` bod 9 [29] **V** → jen pravdivé změny, žádná pochvala navíc. Text ve výsledku se nečte → ikona + číslo. Kombinace zásahů a výbavy může mást („lepší výbava, ale −20 m“): ukázat obojí je pravda a učí. **Zneužití:** žádné, nic nedává.
- **Ověřit (N):** umí hráč po hodu říct, proč letěl dál nebo kratší (`02 §4.4` srozumitelnost; škála atribuce `04 [34]` jen jako nástroj); oslovit 5–8 lidí kvalitativně (`09 §2.11`).

### K3 — Další cíl ve světě / Next Stop in View (04 B2) · jádro · **S–M**
- **Cíl:** vidím, kam to příště dotáhnu, a je to kousek.
- **Pravidla:** (1) Nad začátkem dalšího nedosaženého místa stojí ve světě **papírová vlajka** na tyčce (jeden model, název místa na praporku). Je vidět vždy, i v letu (malá, bez pohybu, není to „výrazná věc“). (2) Po dopadu kamera zůstane u místa dopadu a **0,8 s se natočí** tak, aby vlajka byla v záběru; pod kartou výsledku zůstane tento záběr. (3) Řádek 5 karty: „Gardens at the Edge · 86 m“ (už v 02-ux). (4) **Po dosažení místa** se nejdřív vztyčí dominanta (K5), vlajka se přestěhuje na další místo až v dalším hodu (oslava a pak jeden cíl, `03 N1`). (5) Natočení **nic neblokuje**: stisk kdekoli ho přeruší (K1). (6) Jen jeden aktivní cíl: vlajka místa, ne vlajky všech míst (`08 N3`).
- **Stavy:** `landed` → `panToFlag` (0,8 s, přerušitelné) → `result`. Po novém místě: `landed` → `dominantRise` → `result` (vlajka stará do dalšího hodu).
- **Zástupná čísla:** natočení 0,8 s, vlajka výška ~6 m (čitelná z 200 m), natočit jen když je vlajka do 400 m od dopadu, jinak bez pohybu.
- **Co uvidí:** art: vlajka z kraftu s tušovým písmem, praporek `#f2b65a` (ne hořčicová, ta je jen pro hodnotu, 06 14. 10.). Product: pořadí karta × natočení.
- **Texty:** `world.flag` „{place}“ (na praporku jen jméno, metry jen na kartě), `result.next` existuje v 02-ux.
- **Závislosti:** Atlas data míst (`atlas-numbers.js`), U7, kamera (`render3d`), K5 pro dominanty.
- **Test přijetí:** čistá `nextGoal(p)` → `{placeIndex, x, metersLeft}` (konec trasy → `null`); `shouldPan(landX, flagX)`; prohlížeč: vlajka čitelná na 375 × 667 z dopadu 300 m před ní, přerušení stiskem.
- **Opora:** blízký cíl + zpětná vazba vůči cíli, samotný vzdálený cíl horší, `08 §3.1` [1] **V**; zvědavost roste u zavírání mezery a lidé se jí vyhnou, když je šance malá, `08 §3.5` [10] **V/teorie** (plný text); reset a nejvyšší odchod hned po odměně `03 §2.3` [9] **V** (17 % ukončení, spotřebitelé); sekvence „oslava → jeden blízký cíl“ `03 N1`, `08 N11` **H/N**.
- **Riziko:** natočení kamery po každém hodu omrzí → jen když se vlajka nevejde do záběru dopadu; `reduced` = bez natočení. Vlajka nesmí působit jako úkol (žádný odpočet, žádné „Almost!“, P10).
- **Ověřit (N):** test „nejbližší místo vs. celá mapa“ (`08 §5`): počet dalších hodů; okamžitý hod po nedoletu těsně před vlajkou (Ovsiankina, `08 §5`).

### K4 — Čip nejbližší koupě / Quick Buy Chip (06 bod 2) · jádro · **S–M**
**Pozor:** rozhodnutí 06 (15. 10., bod 2) mění 02-ux §4.2–4.3 („řádek mincí“, „koupě v řádku nikdy“). Čip **nahrazuje řádek mincí**.
- **Cíl:** koupit další krok jedním klepnutím a hned hodit; větší volby dělám v Dílně.
- **Pravidla:** (1) Na kartě výsledku **jeden čip**: další úroveň **jedné** větve Dílny (Power / Paper / Folds, později uzly stromu 3. kola a Mailbag). **Nikdy** vlaštovka, papír další čtvrti ani bonus Atlasu (to jsou volby stylu a cíle, na které se šetří; zůstávají v Dílně a Atlasu). (2) Která větev: **podle BLOCKED 1**, doporučeno pokračovat ve větvi, kterou hráč naposledy koupil (výchozí Power; po dokončení větve nejlevnější jiná). (3) Má-li hráč dost: čip „Power 2 · 35 ◈“, klepnutí = koupě **bez potvrzení**. Po koupi čip ukáže „Bought Power 2 · Undo“ a **Vrátit** platí do začátku dalšího hodu (plná náhrada). (4) Nemá-li dost: čip neaktivní, jen informace „Power 2 · 12 ◈ to go“ (bez animace). (5) Vše koupeno nebo nic k mání → čip odpadne. (6) Čip nemá tečku, nepulzuje, není větší než Dílna (`02 §4.3` bod 6). (7) Klepnutí na čip nikdy nespustí hod (K1).
- **Stavy:** `hidden | short(coins) | ready(item, price) | bought(item, undoable)` → při stisku pro hod `bought` → `committed`.
- **Zástupná čísla:** Vrátit do dalšího hodu; čip výška 48 px.
- **Co uvidí:** product: čip v kartě místo řádku mincí, náhled účinku „+8 % launch speed“ jako druhý řádek čipu jen při prvním zobrazení dané větve. Art: animace koupě jen v Dílně (06 papíry bod 4), na čipu jen změna stavu.
- **Texty:** `chip.ready` „{item} · {price} ◈“ · `chip.short` „{item} · {coins} ◈ to go“ / „{item} · chybí {coins} ◈“ · `chip.bought` „Bought {item}“ / „Koupeno: {item}“ · `chip.undo` „Undo“ / „Vrátit“ · `aria` „Buy {item} for {price} coins“ / „Koupit {item} za {price} mincí“.
- **Závislosti:** U4 (`coinLine` v `src/reveal.js` se rozšíří na `nextBuy`), U7 (karta), `buy()` v `core.js`, save: poslední koupená větev = nové pole `p.lastBranch` → migrace a validace (`storage.js`, `.claude/rules/save.md`). Ve variantě (b) z BLOCKED 1 pole netřeba a save se nemění.
- **Test přijetí:** čistá `nextBuy(p, prices)` → stav čipu; případy: hod 0 → `hidden`, dost mincí → `ready`, málo → `short` s rozdílem, poslední větev dokončena → jiná, vše koupeno → `hidden`; `undoBuy(p, receipt)` vrátí save bit po bitu; Vrátit po startu dalšího hodu → zamítnuto. Prohlížeč: klepnutí na čip neodstartuje hod; Undo; čtečka.
- **Opora:** chuť pokračovat je nejsilnější hned po dopadu, cesta do Dílny ji oddálí (`08 §3.4` [9] **V**, Ovsiankina); koupě zvyšují **počet** úkonů, ne vnitřní motivaci `02 [13]` **V** (Mekler, n = 273, neherní úloha) → proto jen jeden čip, žádná oslava koupě a žádné vlaštovky; volba podpoří autonomii, jen když je cítit `01 N3` **N**.
- **Riziko:** čip utrácí mince, na které hráč šetří (Hawk) → Vrátit a pravidlo „nikdy vlaštovka“; nutkavé klikání → žádná odměnová animace; čip „vybírá za hráče“ (02-ux §9 zápory) → BLOCKED 1. **Zneužití:** Vrátit + zrušený hod nejde použít k „vyzkoušení“ úrovně (Vrátit končí stiskem pro hod). **Náhled:** „+8 % launch speed“ při prvním zobrazení větve.
- **Simulace má změřit:** strategie „jen čip“ proti „optimální nákup v Dílně“: rozdíl délky kampaně ≤ 5 % hodů (jinak je čip past); podíl hodů s koupí (cíl „střídměji“: v D1 asi každý 2. hod, ne 17 z 20 jako 01 §4.3).

### K5 — Vystřihovánka D1 a páska rekordu / Pop-up City & Record Ribbon (00 S1, 04 A1, A4) · jádro · **L**
- **Cíl:** každý rekord je kus města, který jsem postavil; v letu vidím, kde začíná nové.
- **Pravidla (základ pro všechny čtvrti):** (1) **Hranice = `p.best`** (nejdelší dolet). Budovy s `x < best` stojí, za ní leží **naplocho** (archy bez stínu). Stav se odvozuje z `p.best`, **save se nemění**. (2) V letu se budova za hranicí vztyčí, když `flight.x ≥ x_budovy − lead`, `lead = 1,2 s × vx` (vždy kus **před** vlaštovkou, aby to hráč viděl). Co se vztyčí, zůstane (protože roste `best`). (3) **Dominanta místa** (tržní hala, skleník, vodárna…) se vztyčuje sama a pomaleji, když vlaštovka dosáhne začátku místa; nahrazuje zastávky (06 bod 4). (4) **Páska rekordu:** papírová páska přes ulice v `x = best`; protnutí = prasknutí (zvuk, dva cáry odletí) a teprve pak se začne vztyčovat. Tenká v běžném letu, **široká**, když je do dalšího místa méně než 15 % trasy místa (silnější okamžik u blízkého cíle). (5) Hod, který rekord nepřekoná, nic nevztyčí; páska zůstane a ukazuje pravdivou těsnost bez textu (P10). (6) **D1 způsob:** střechy se zvednou jako stránky pop-up knihy (pant u země, osa kolmo k ulici), `0,35 s`, šustnutí. (7) Za rekordem nejsou žádné události navíc ani méně (rozvrh SK1 se nemění).
- **Stavy budovy:** `flat` → `rising` (0,35 s; dominanta 0,8 s) → `standing`. Pásky: `intact` → `torn` (v letu) → nová páska v novém `best` od dalšího hodu.
- **Zástupná čísla:** lead 1,2 s, vztyčení 0,35 s / dominanta 0,8 s, široká páska < 15 % místa, prvních ~120 m za startem stojí vždy (první záběr nesmí být prázdný).
- **Co uvidí (art):** ploché archy v barvách čtvrti, bledší, bez stínu, s tušovými linkami přehybů („vystřihni a slož“); páska z kraftu nebo z pruhu papíru s tečkovanou linkou střihu. Product: nic v HUD. Reduced motion: prolnutí ploché → stojící (150 ms), páska bez cárů.
- **Texty:** žádné.
- **Závislosti:** render3d: sloučená geometrie po blocích (`geometry.cityChunk`) potřebuje atribut `x` budovy a uniformy `frontier`, `flightX`, čas → vztyčení ve vertex shaderu bez rozbití slučování (game-dev s art-directorem); LOD; `perf-check` (06 bod 2: dražší varianta, výkon ověřit). Katalog modelů D1 (G1–G3).
- **Test přijetí:** čistá `buildingState(xB, best, flightX, vx, t)` → `{state, u}`; `ribbon(best, nextPlaceX, placeLen)` → `{x, wide}`; případy: budova za hranicí před průletem `flat`, po průletu `standing` při dalším `best`; hod bez rekordu nevztyčí nic. Prohlížeč: `__r3d.snapshot` hranice, `perf-check` místa 2 a 4 (draw calls beze změny, čas snímku), art-review 375 × 667 a 1280 × 800: vztyčení nepřebije vlaštovku (bible S-6).
- **Opora:** odměna vázaná na skutečný výkon zvyšuje zvědavost, náhodné obměny ne, `01 [26]` **V** (Kao 2024, n = 1 699); napětí těsné hry motivuje, Lomas 2017 (04 §9) **V** (> 20 000 sezení, vzdělávací hra, jen abstrakt); blízký viditelný cíl `08 [1]` **V**; ploché archy jako vhledová mezera „tam něco je“, `08 [10]` **V/teorie**. Že vztyčení samo táhne další hod: **N**.
- **Riziko:** v D1 padá rekord skoro každý hod → páska zevšední (`08 [13]` **V**) → tenká, široká jen u blízkého místa; zvyk na vztyčení řeší K6–K8. Výkon (L). Ploché archy nesmí vypadat jako chyba načítání → přehyby a tušové linky.
- **Ověřit (N):** „Věděl jsi v letu, jestli to bude rekord?“; podíl letů s dalším zásahem v posledních 3 s před páskou (log).

### K6 — D2 Slunný přístav: mola a plachty / Piers Unfurl · jádro · **M**
- **Cíl:** dlouhé místo se dělí na malé kusy, které dokončuji jeden po druhém.
- **Pravidla:** (1) Každé místo D2 má **3–4 mola** (úseky ~75–100 m) s lodí. Molo za hranicí leží naplocho jako ostatní. (2) Při průletu se plachty lodi **rozvinou postupně** po délce mola; když hod skončí uprostřed mola, loď zůstane **napůl rozvinutá** (stav z `p.best`, save beze změny). (3) Molo dokončené celé = plně rozvinutá loď s praporky, krátký „flap“ zvuk (jediná výrazná věc, když není QTE). (4) Budovy na břehu se vztyčují jako v D1.
- **Proč herně:** rozdělí místo 305 m na viditelné dílčí cíle uvnitř letu; „loď je napůl“ je pravdivá, vidět bez textu a zavře se dalším hodem. Řeší sucho mezi místy (06 F5 bod 1: drobná novinka mezi místy) bez popisku.
- **Zástupná čísla:** 3–4 mola na místo, rozvinutí po délce mola lineárně s `best`.
- **Co uvidí:** art: loď s plachtou z papíru, přehyb plachty; stav napůl = plachta do poloviny stěžně. Reduced: bez rozvinování, jen stav.
- **Závislosti:** K5 (shader hranice), katalog D2 (lodě, mola), přechody čtvrtí `09-prechody-ctvrti`.
- **Test přijetí:** čistá `pierState(x0, x1, best)` → `flat | partial(u) | full`; prohlížeč: art-review stavu napůl na 360 px.
- **Opora:** gradient cíle, úsilí roste s podílem zbývající vzdálenosti, `03 §2.3` [9] **V** (terén, spotřebitelé); blízké dílčí cíle uvnitř vzdáleného `08 §3.1` [1] **V**; poměrový rytmus milníků `03 N3` **N**; efekt struktury slábne daleko od dokončení `08 [19][20]` **V**.
- **Riziko:** napůl rozvinutá loď jako „nedokončený úkol“ tlačí (P13) → žádné počítadlo, žádný text, nic nepropadá. **Ověřit (N):** hody mezi novinkami v D2 v logu; „Všiml sis lodí?“ po hraní.

### K7 — D3 Zlatá pole: koberec ukáže dopad / The Wheat Unrolls · jádro (BLOCKED 3) · **M**
- **Cíl:** nad poli vidím, kam bych doklouzal sám, a že můj zásah to posunul.
- **Pravidla:** (1) Za hranicí leží pole jako srolovaný pruh. V letu se před vlaštovkou **rozvinuje koberec obilí až do místa, kam by vlaštovka doletěla bez dalších událostí** (pravdivá předpověď z deterministické fyziky, stejný vítr, žádné QTE). (2) Předpověď se přepočítá při každém vyhodnocení události (zásah i minutí), při volbě v prachovém víru (EV2) a nejvýš 2× za sekundu; koberec konec plynule posune (vpřed po zásahu, nazpět při ztrátě rychlosti). (3) Koberec se kreslí **jen za hranicí** (nad stojícími poli nic); když předpověď končí před páskou, koberec není a hráč ví, že bez zásahu rekord nebude. (4) Po dopadu se rozvinuté pole stává stojícím jako v D1. (5) Platí jen nad D3 (identita čtvrti).
- **Proč herně:** výsledek zásahu je okamžitě vidět jako metry (P1, P7), prachový vír (⇄) má viditelný důsledek volby, a QS1 dostane obraz (slabý zásah u země koberec skoro neposune). Je to **feedforward**, ne náhoda.
- **Zástupná čísla:** přepočet max 2 Hz, posun konce koberce tlumený 0,3 s.
- **Co uvidí:** art: rozvinutý pruh obilí s tušovou hranou na konci (žádná šipka ani číslo); hrana se nesmí plést s páskou (jiná barva a tvar). Reduced: hrana skočí bez animace.
- **Texty:** jednou po prvním letu nad D3, řádek zisku: `d3.wheat.hint` „The wheat unrolls to where you’d land on your own.“ / „Obilí se rozvine tam, kam bys doletěl/a sám/sama.“ (narrative upraví rod; v EN bez rodu).
- **Závislosti:** `predictLanding(flight)` v logice (`core.js` nebo `throw.js`): klon letu a krokování `step()` bez událostí do dopadu; K5; katalog D3; 01 QS1 (síla zásahu).
- **Test přijetí:** `predictLanding` = skutečný dopad **přesně** u letu, ve kterém už žádná událost nepřijde (determinismus); čistá funkce nemění vstupní let; strop kroků (P90 letu × 60). Prohlížeč: `perf-check` (přepočet ≤ 1 ms/snímek průměrně), art-review čitelnosti hrany.
- **Opora:** odezva podle skutečného výsledku zásahu zvyšuje kompetenci a zvědavost `01 [26]` **V**, `01 N5` **N**; KR místo předpisu, vizuálně ukázaná příčina `04 N3` **N**; střední nejistota je optimum zvědavosti `08 [11]` **V** (kvíz, malé n) → koberec ukazuje jen „bez pomoci“, nejistota zůstává v tom, co přidají zásahy.
- **Riziko:** sníží napětí posledních sekund (výsledek známý dřív) → pod 8 m už události nejsou ani dnes (QS2), takže konec je jistý tak jako tak; v D3 se navíc ukáže dřív. **Ověřit (N):** otázka „Pomohlo ti pole, nebo kazilo napětí?“; podíl zásahů v D3 proti D2 (log). Zneužití: žádné, je to pravdivá informace.

### K8 — D4 Město lampionů: lampiony podle rychlosti / Lanterns Catch Your Speed · jádro (lehká verze) · **M**
- **Cíl:** v poslední čtvrti vidím, jak rychlá je moje vlaštovka, celou ulicí.
- **Pravidla:** (1) D4 je večer; za hranicí je ulice tmavá a lampiony splasklé. (2) Vztyčení: lampiony se **nafouknou a rozsvítí**, když vlaštovka prolétne, a **jas a výška** odpovídají **stupni rychlosti** v okamžiku průletu (3 stupně z přebytku rychlosti nad cestovní rychlostí výbavy, stejná veličina jako šířka kamery, 06 kamera bod 3). (3) **Lehká verze (jádro):** v dalších letech lampiony nad stojící částí reagují živě na současnou rychlost (rozzáří se při průletu), nic se neukládá. **Rozšíření:** pamatovat nejvyšší stupeň za každé z 4 míst D4 (`p.lanternTier[4]`, migrace save) a podle něj nechat místo svítit trvale. (4) Svítí jen D4 (06 Washi úr. 3: jedno pravidlo pro všechno, co svítí).
- **Proč herně:** rychlost je v pozdní hře hlavní růst (06 13. 10. varianta B: silná, rychlá vlaštovka), tady je vidět ve světě, ne v čísle (06 14. 10. bod 5: čísla vidět, ale ne zakrýt podíl hráče); dobrý výhoz a série zásahů rozzáří víc (P1).
- **Zástupná čísla:** stupně `vx / cruise` ≥ 1,15 / 1,35 / 1,6.
- **Co uvidí:** art: papírový lampion splasklý → nafouknutý; 3 úrovně jasu tvarem i světlem (P15); jen jemná záře podle bible (lampionový skin svítí taky, hlídat jednu výraznou věc). Reduced: bez nafukování, jen jas.
- **Závislosti:** K5, katalog D4, Lampiony EV4 (sdílí model, ne mechaniku), 04 A3 stupně rychlosti (titulky nejsou součástí).
- **Test přijetí:** čistá `speedTier(vx, cruise)`; prohlížeč: `perf-check` světel (instancované, bez dalších světel ve scéně), art-review 375 × 667.
- **Opora:** intenzita odezvy roste se skutečným výkonem `02 N3`, `01 N5` **N** s oporou `01 [26]` **V**; čísla jen kvantita `02 [13]` **V** → převod do obrazu; percepční novost klesá s opakováním `08 [13]` **V** → nový způsob ve 4. čtvrti.
- **Riziko:** rozšíření s pamětí může působit jako „dosvítit všechno“ (sbírka, kterou 06 13. 10. nechce) → proto jádrem je živá verze. **Ověřit (N):** „Pamatuješ si, jak se rozkládala která čtvrť?“ (`08 §5`).

### K9 — Konec kapitoly a finále / Chapter Close & Delivered (04 C3; C2 odloženo) · jádro · **S–M**
- **Cíl:** po čtvrti mám pocit hotového a můžu odejít spokojený; kdo chce, má hned další malou mezeru.
- **Pravidla:** (1) Spouští se **prvním překročením hranice čtvrti** (místa 5, 9, 13), tedy ve chvíli, kdy předchozí čtvrť stojí celá. Rozšiřuje existující kartu čtvrti (06 14. 10. bod 1), nepřidává nový okamžik. (2) Po dopadu: **klidný záběr zpět** na celou čtvrť (2,5 s, přeskočitelný), slunce se posune o krok (cesta za sluncem), pak karta nové čtvrti. (3) Karta: „{district} stands.“, jedna věta nové čtvrti, **„Keep throwing“ a „Menu“ stejně velké**, nic neodpočítává; podržet kdekoli funguje (K1), ale pod kartou je nápis o uložení „Progress saved.“. (4) Fronta novinek: karta má přednost (FN1), jiné novinky čekají. (5) **Finále (místo 16):** druhé dítě na druhém konci města **chytí vlaštovku**, beze slov (06 bod 4: až ve finále), „Delivered.“ a souhrn po dohrání (06 14. 10. bod 4); Menu a „Fly for fun“ stejně velké. (6) Každá kapitola jen jednou.
- **Stavy:** `landed` → `lookBack` (2,5 s) → `chapterCard` → `aim` / `menu`.
- **Co uvidí:** art: záběr čtvrti (kamera vysoko, celé místo 1–4 v záběru), posun slunce; model druhého dítěte = postavička C s jinými barvami (H2), póza chycení. Product: karta.
- **Texty:** `chapter.done` „{district} stands.“ / „{district} stojí.“ · `chapter.keep` „Keep throwing“ / „Házet dál“ · `chapter.menu` „Menu“ · `chapter.saved` „Progress saved.“ / „Postup je uložený.“ · finále existuje (`Delivered.`).
- **Závislosti:** U3 (nová obrazovka `chapter`), Atlas (hranice čtvrtí), K5, H2 (postavička C), FN1.
- **Test přijetí:** čistá `chapterTrigger(prevBest, best)` → index čtvrti nebo `null` (jen poprvé, i když hod přeletí dvě hranice: ukáže se jen vyšší); screens test `chapter` → `aim` i `menu`. Prohlížeč: záběr na 375 × 667, přeskočení.
- **Opora:** reset a nejvyšší odchod po odměně `03 [9]` **V**; konec po skoku ve skóre `09 [Z3]` **V/B**; odchod s uzavřením a vlastní volbou, Alexandrovsky 2024 (04 §9) **V/H** (preprint, n = 16 + 111); shoda bloků „oslava a konec kapitoly → jeden blízký cíl bez tlaku“ `02 N6`, `03 N1`, `08 N11`, `09 N2` **H/N**; konec ovlivňuje paměť zážitku, Gutwin 2016 (04 §9) **V** (ochota hrát znovu jen smíšeně).
- **Riziko:** přeruší rozjetou sérii → přeskočitelné a jen 3× + finále. **C2 „Návrat do rozdělané práce“ odkládám:** okamžitou příležitost při spuštění už dává K1 (podržet kdekoli z titulu), z podkroví hranice vidět není a změna úvodního záběru H1 (rozhodnuto 06 bod 15) by šla proti rozhodnutí. **Ověřit:** dobrovolné hody po kapitole + lítost (`03 N1`: úspěch = víc pokračování bez víc lítosti).

---

## 3. Rytmus důvodů: prvních 40 hodů

Průměrný hráč, místa po ~305 m (Market 305, Gardens 610, Railway 914, hranice D2 / Pier 1 219, místo 6 ~1 524), dolety podle 01 §4.3, koupě **střídměji** (zhruba každý 2. hod, 06 bod 1). Jedna ohlášená novinka za hod (FN1). **NOT ASSESSED**, simulace ověří. **DÍRA** = jediný důvod je koupě nebo nic.

| Hod | Hlavní důvod hodit znovu | Druh | Zdroj |
|---:|---|---|---|
| 1 | „Město se pod ní zvedalo“; Dílna otevřena | N | tutoriál, K5 |
| 2 | Power 1 z čipu; „+18 m vs last · Power 1“ | K, M | K4, K2 |
| 3 | páska rekordu kousek před dopadem; Glider („Take it“) | R, N | K5, FN1 |
| 4 | vlajka Market na dohled (~50 m) | C | K3 |
| 5 | Folds 1 z čipu; rekord | K, R | K4 |
| 6 | „12 m short of Market“, vlajka | C, M | K3, RK1 |
| 7 | **Market**: hala se vztyčí, Atlas; pak vlajka Gardens | P | K5, K3 |
| 8 | první Spropitné (◈) | N | SK1 bod 6 |
| 9 | Paper 1 z čipu | K, M | K4, K2 |
| 10 | „+3 hits“ v rozdílu, rekord | M, R | K2 |
| 11 | uzel stromu / Crowd Chain v Atlasu | K | Atlas |
| 12 | rekord, široká páska se blíží Gardens | R | K5 |
| 13–14 | **DÍRA (malá):** jen rozdíl proti minule a koupě | M, K | kandidát: 00 U3 scéna na jedno použití (*Sprinkler Rainbow*) |
| 15 | vlajka Gardens ~110 m | C | K3 |
| 16 | koupě, rekord | K, R | K4 |
| 17 | „20 m short of Gardens“ | C | K3 |
| 18 | **Gardens**: skleník se vztyčí, Pinwheel | P | K5 |
| 19 | světlý Kraft v Dílně (vidět na vlaštovce) | N, K | fronta |
| 20 | první přetočení větru (Pinwheel), rozdíl „Kraft“ | N, M | K2 |
| 21–24 | **DÍRA (střední):** nejdelší úsek D1 (610 → 914 m), jen K/R/M | K, R, M | kandidáti: 00 U3 *Race the Train* jednou; první předpověď událostí jako odemčení (06 bod 8) |
| 25 | vlajka Railway na dohled | C | K3 |
| 26 | koupě; rekord | K, R | K4 |
| 27 | **Railway**: vodárna se vztyčí | P | K5 |
| 28 | pára, první setkání | N | SK1 bod 6 |
| 29 | rozdíl „+2 perfect“ (pára = kombo) | M | K2 |
| 30 | široká páska, vlajka Bright Harbor | R, C | K5, K3 |
| 31 | **hranice D2 = konec kapitoly D1** (pohled zpět, slunce) | P | K9 |
| 32 | **mola a plachty** (nový způsob) | N | K6 |
| 33 | racek, první setkání | N | SK1 |
| 34 | loď napůl rozvinutá: dokončit molo | C | K6 |
| 35 | koupě (Kraft úr., uzel) | K | K4 |
| 36 | molo 2 celé, rekord | R, C | K6 |
| 37 | **DÍRA (malá):** jen K/M | K, M | kandidát: Hawk k prodeji (fronta) jako cíl, na který se šetří |
| 38 | molo 3, vlajka místa 6 | C | K6, K3 |
| 39 | koupě; „15 m short of …“ | K, C | K4 |
| 40 | **místo 6**: Hejno odemčeno | P | Atlas, SK1 |

**Čtení.** Ze 40 hodů je **K hlavním nebo jediným důvodem v ~8**, novinka (N) v ~9, velký moment (P) v 6, zbytek nese R / M / C. Díry: 13–14, 21–24, 37 (dohromady ~7 hodů, nejdelší 4 v řadě). Cíl „žádné sucho delší než 3 hody bez důvodu jiného než koupě“ (04 §5) tedy **D1 mezi Gardens a Railway nesplňuje**. Nejlevnější výplň: jedna scéna na jedno použití (00 U3) v úseku 21–24 nebo posun pravdivé těsnosti (RK1) do řádku zisku. Rozhodne simulace (§5) a playtest, ne já napevno.

---

## 4. Co škrtnout nebo odložit

| Položka (zdroj) | Verdikt | Důvod |
|---|---|---|
| Tužková stopa minulého / nejlepšího hodu (04 A2, 00 S2) | **zamítnuto 06** | nahrazuje ji řádek K2 ve výsledku a páska K5 v letu |
| Okno na konci města (04 C1) | **zamítnuto 06** (nálezce až ve finále) | finále v K9 |
| Ranní noviny (00 S4) | **škrtnout, potvrzuji** | humor mění vnímání, ne chování `08 [22]` V (n = 11 804) |
| Kdo ji našel po každém hodu (00 S3, 04 B4) | **škrtnout jako systém**; jediný nálezce je druhé dítě ve finále | totéž; 06 bod 4 |
| Paměť tvorů 10. a 25. setkání (00 U2) | **škrtnout, potvrzuji** | skryté počítadlo, hráč ho nepozná (fun-check otázka 1) |
| Pop-up Updraft (04 A5) | **škrtnout, potvrzuji** | mění dolet, zesiluje silné; po rekordu prodlužuje sérii a tím reset `03 [9]` |
| Návrat do rozdělané práce (04 C2) | **odložit** | K1 už dává okamžitou příležitost; mění rozhodnutý H1 |
| Podkroví jako deník (04 C4) | **odložit, zmenšit** na 3–4 předměty po playtestu | vidět jen v menu, ne ve vzduchu |
| Stupně rychlosti s titulky (04 A3, 00 S6) | **zúžit**: obraz rychlosti nese K8 v D4 a šířka kamery; titulky ne | titulky působí jako „systém“; čísla jen kvantita `02 [13]` |
| Předpověď letu zdarma od 2. hodu (01 PL1) | **změněno 06**: až jako odemčení v progresi | kandidát na výplň díry 21–24 |
| Plán letu (01 PL2) | **odložit po playtestu** (06 bod 8) | – |
| Razítka R1–R7 (01) | **zamítnuto 06** bod 4 | – |
| Zastávky ZB1 (01, obsah 05) | **zamítnuto 06**; nahrazuje vztyčení dominanty (K5) a mola (K6) | – |
| Metrika „hody bez nákupu“ (01 §6 C2) | **nahradit** „hody bez důvodu“ (§5) | nákupy zvedají kvantitu `02 [13]` |
| Cíl „B v ≥ 15 z prvních 20 hodů“ (01 §6 C3) | **zrušit**; nový cíl koupě v D1 ~každý 2. hod | 06 bod 1 |
| Rozporuji jen jedno: **04 A3 „první Swift kolem hodu 10“** | neplánovat | bez titulků nemá kde být vidět, v D1 by soupeřil s páskou o „jednu výraznou věc“ |

---

## 5. Měření: pokračuje hráč dobrovolně a nelituje?

**Úspěch = víc dobrovolných hodů a konkrétní důvody ve hře, bez nárůstu lítosti** (`02 §4.4`, `03 N1`, `01 N10`; délka sama zábavu nedokazuje `09 §2.12`, `02 [13]` V).

**A. Log `?playtest=1`** (lokální, bez sítě, se souhlasem a ručním exportem, `09 §2.10`, `09 §4.1`; ve hře dnes **neexistuje**, nová dávka T8). Na každý hod jeden záznam:
| Pole | Proč | Opora |
|---|---|---|
| `attempt`, `t`, `session` (pauza ≥ 30 min = nová) | křivka přežití po hodech | `09 §2.10` [Z4] |
| `dist`, `best`, `record`, `delta_prev`, `rolling_median5` | konec po skoku, plateau | `09 [Z3]` |
| `reasons` (R, M, C, N, K, P podle §1, počítá čistá `throwReasons()`) | „hody bez důvodu“, délka děr | 04 §5, N |
| `ms_land_to_press`, `press_where` (karta / tlačítko / titul) | tah po dopadu (K1) | `08 §3.4` |
| `chip` (`shown/ready/bought/undo`), `workshop_opened` | čip jako past nebo pomoc (K4) | `02 [13]` |
| `diff_kind`, `causes` | co hráč viděl v K2 | – |
| `airFocus_conflicts` (kolikrát se tlumila výrazná věc) | jedna výrazná věc | P2 |
| `chapter` (`keep/menu/skip`), hody po kapitole | dobrovolné pokračování po vrcholu | `03 N1` |
| `last_state_before_exit` (při `pagehide`) | kontext odchodu: po rekordu, místě, kapitole, koupi, nebo po sérii bez důvodu | `09 §2.10` bod 3, `09 N2` |

**Vyhodnocení (kvalitativně, 5–8 lidí najde problémy, ne rozdíly, `09 §2.11`):** křivka přežití po hodech; podíl odchodů po P / R / kapitole (dobré) proti odchodu po díře (špatné); medián `ms_land_to_press`; podíl hodů spuštěných z karty; Undo na čipu (> 10 % koupí = čip mate).

**B. Dotazník a rozhovor:** „Proč jsi hodil/a znovu?“ po každém ~5. hodu ústně, nikdy při QTE; po hraní „Hrál/a jsi déle, než jsi chtěl/a?“ (lítost, `02 §4.4`), miniPXI s položkou Curiosity (`09 §4.1`, `01 N10`), „Umíš říct, proč tvůj nejlepší hod doletěl dál?“ (K2), „Věděl/a jsi v letu, jestli to bude rekord?“ (K5), „Jak se rozkládala která čtvrť?“ (K6–K8).

**C. Simulátor (balance-analyst, až po schválení obsahu):** game-dev doplní `throwReasons()` do modelu (čistá funkce z `src/`), balance-analyst čte:
1. **Hody bez důvodu**: nejdelší řada hodů, kde je jediný důvod K nebo žádný; cíl P90 ≤ 3 (zástupně).
2. **Hustota novinek (N + P)** na 10 hodů po čtvrtích; pásmo 2–4 (střední novost je optimum, Lomas 2017 (04 §9) **V**; pásmo samo je naše volba **N**).
3. **Podíl hodů s koupí**: D1 ~50 %, dál méně (06 bod 1).
4. **Strategie „jen čip“** proti optimu: ≤ +5 % hodů kampaně (K4).
5. **Rekordy po čtvrtích** (jak často praská páska; když v D1 > 80 % hodů, zúžit širokou pásku jen na blízké místo).
6. **Délka nejdelšího úseku bez P** v hodech (01 §4.4); úsek Gardens → Railway (díra 21–24).

---

## 6. Dávky pro realizaci

Navazuje na **U0–U9** (02-ux §8) a **H0–H5** (03-art §6); nic z nich nezdvojuje, jen do některých přidává zpřesnění. Pořadí: **T1 → T2 → (T3 ∥ T4) → T5 → T8 → T6 → T7 → T9**. T8 (log) jde před první playtest, T6–T9 podle toho, jak rychle vzniká katalog čtvrtí D2–D4. Kód mění game-dev, ne já.

| Dávka | Obsah | Vlastník | Soubory | Závisí na |
|---|---|---|---|---|
| **T1 Logika výsledku** | `throwDiff` (K2), `nextBuy` + `undoBuy` (K4, rozšíření `coinLine` z **U4**), `resultInput` (K1), `nextGoal` (K3), `chapterTrigger` (K9), `airFocus` (§1), `throwReasons` (§5); testy | game-dev | `src/reveal.js` (U4), nový `src/result.js`, `tests/` | U4 |
| **T2 Karta výsledku a vstupy** | zpřesnění **U6/U7**: řádek 2 z `throwDiff`, čip místo řádku mincí, Undo, zámek 400 ms, držení kdekoli na kartě | product (spec) → game-dev; narrative (texty EN/CS) | `src/ui.js`, `index.html`, `style.css`, `src/locales/*` | U6, U7, T1 |
| **T3 Vlajka a natočení po dopadu** (K3) | model vlajky, `panToFlag` | art (karta katalogu) → game-dev | `src/render3d/models/`, kamera `render3d` | T1, data míst Atlasu |
| **T4 Hranice a páska** (K5, čtvrť D1) | vztyčení po budovách ve shaderu, ploché archy, páska, dominanty D1; `perf-check`, `art-review` | art + game-dev | `src/render3d/*`, testy render3d | katalog G1–G3, H0 |
| **T5 Konec kapitoly a finále** (K9) | obrazovka `chapter` (doplněk **U3**), záběr zpět, slunce, karta; druhé dítě (barvy postavičky C z **H2**), póza chycení | product + art → game-dev | `src/screens.js`, `ui.js`, `render3d`, `locales` | U3, T4, H2 |
| **T6 Mola D2** (K6) | lodě a mola v katalogu D2, `pierState` | art → game-dev | `render3d/models`, `render3d` | T4, katalog D2 |
| **T7 Koberec D3** (K7) | `predictLanding`, koberec, jednorázová věta | game-dev (logika), art (koberec) | `src/core.js` nebo `throw.js`, `render3d`, `locales` | T4, 01 QS1, BLOCKED 3 |
| **T8 Log `?playtest=1`** | log podle §5 A, souhlas, export a smazání | game-dev, product (text souhlasu) | nový `src/playtest-log.js`, háček v `ui.js` | T1 (`throwReasons`) |
| **T9 Lampiony D4** (K8) | `speedTier`, nafouknutí a jas; paměť po místech až po playtestu | art → game-dev | `render3d`, případně `storage.js` | T4, katalog D4 |

**Souběh:** T2, T5, T8 a U9 sahají na `ui.js`, jdou postupně (02-ux §8). T3, T4, T6, T7, T9 (render) nejdou souběžně s H4 ve stejných souborech `render3d`. Simulace (§5 C) až po schválení obsahu.

---

## 7. Souhrnná tabulka (doporučené pořadí)

| # | Karta | Priorita | Cena | Hlavní opora | Dávka |
|---:|---|---|---|---|---|
| 1 | K1 Bez prodlevy | jádro | S | `08 §3.4` V | T1, T2 |
| 2 | K4 Čip nejbližší koupě | jádro | S–M | `08 §3.4` V, `02 [13]` V (proti přehánění) | T1, T2 |
| 3 | K2 Rozdíl proti minule | jádro | S–M | `02 [12]` V, `04 [23]` V, `09 [Z3]` B | T1, T2 |
| 4 | K3 Další cíl ve světě | jádro | S–M | `08 [1]` V, `03 [9]` V | T3 |
| 5 | K5 Hranice, páska, pop-up D1 | jádro | L | `01 [26]` V, Lomas 2017 V | T4 |
| 6 | K9 Konec kapitoly a finále | jádro | S–M | `03 [9]` V, Alexandrovsky 2024 V/H, sjednocené H/N | T5 |
| – | Log `?playtest=1` | nutné před playtestem | S–M | `09 §4.1` | T8 |
| 7 | K6 Mola D2 | jádro | M | `03 [9]` V, `08 [1]` V | T6 |
| 8 | K7 Koberec D3 | jádro (BLOCKED 3) | M | `01 [26]` V, `04 N3` N | T7 |
| 9 | K8 Lampiony D4 (živé) | jádro, paměť = rozšíření | M | `08 [13]` V, `01 N5` N | T9 |

**Odhad celku:** T1–T5 a T8 ~8–12 dní, T6, T7, T9 ~5–7 dní bez modelů čtvrtí (ty jsou v katalogu). NOT ASSESSED.

---

## 8. Fun-check (skill `fun-check` na tento návrh, 15. 10.)

Názor, ne měření. Co ukáže jen playtest: **NOT ASSESSED**.

| Položka | Verdikt | Proč | Nejlevnější lepší verze |
|---|---|---|---|
| K1 Bez prodlevy | **silné** | největší tah za nejmenší cenu, hráč ho cítí každý hod; pokračování aktivní, ne autoplay (P13, `02 §2.7` bod 5) | jen zámek 400 ms a držení na kartě, bez nové grafiky |
| K2 Rozdíl proti minule | **OK** | je vidět ve výsledku, dává učební cíl (P1, P7); riziko, že se text nečte | ikona + číslo, příčina nejvýš 2 slova |
| K3 Další cíl ve světě | **silné** | blízký cíl v obraze, ne v HUD (P5, P6); hlavně po velké odměně | vlajka bez natočení kamery, natočit jen když není v záběru |
| K4 Čip koupě | **riziko** | rozhodnuto (06 bod 2), ale je to tlak na nákup v rozhodovacím okamžiku (`02 §4.3` bod 6, P13) a koupě zvyšují počet, ne chuť (`02 [13]`) | bez oslavy, bez pulzu, Vrátit, nikdy vlaštovky; měřit Undo a „jen čip“ v simulaci |
| K5 Hranice, páska, pop-up D1 | **silné, drahé** | lákadlo hry vidět ve vzduchu, pravdivé (P1, P3, P10) | nejdřív páska (S) a dominanty, po budovách hned po nich |
| K6 Mola D2 | **OK** | dílčí cíle vidět bez textu (P6); riziko „seznamu“ (napůl loď) | bez zvuku dokončení, jen stav |
| K7 Koberec D3 | **silné, ale riziko čitelnosti** | zásah je vidět jako metry (P1, P7), volba ve víru dostane důsledek; ve vzduchu je ale další prvek vedle pásky a události (bible, 06) | jen tušová hrana bez animace obilí, při QTE se nehýbe (`airFocus`) |
| K8 Lampiony D4 | **OK** | rychlost v obraze (06 čísla vidět); herní význam slabší než u D2 a D3 | živá verze bez paměti |
| K9 Konec kapitoly | **OK, eticky silné** | zastávka bez tlaku (P5, P13); může přerušit sérii | přeskočitelné, jen 3× + finále |
| Pravidlo jedné výrazné věci | **OK** | nutné, jinak K5–K8 a QTE soupeří (P2) | pořadí priorit, žádné odkládání |
| Log `?playtest=1` | **OK (nástroj)** | bez něj nejde ověřit „dobrovolně a bez lítosti“ (P4) | jen pole z §5 A, žádné grafy ve hře |
| Rytmus 40 hodů | **riziko** | díra 21–24 (4 hody jen koupě a rekord) porušuje cíl „≤ 3 hody bez důvodu“ | jedna scéna na jedno použití v úseku Gardens → Railway (BLOCKED 4) |

**Jednota:** všechny karty jsou papír (archy, páska, plachty, obilí, lampiony), dítě (vlaštovka v ruce, druhé dítě ve finále) nebo cesta za sluncem (posun slunce v K9). Žádný cizí systém, žádné počítadlo.
**Top 3 silné:** K1 bez prodlevy, K5 hranice a páska, K3 vlajka dalšího místa.
**Top 3 k předělání:** K4 čip (hlídat tlak na nákup měřením), K7 koberec (zúžit na hranu, ztišit při QTE), díra 21–24 v rytmu (výplň).
**Etika (P13):** bez FOMO, odpočtů, náhodných odměn a seznamů; čip a napůl rozvinuté lodě jsou jediná místa s rizikem tlaku, obě mají pojistku (Vrátit, žádné počítadlo).

---

## 9. Otevřené volby

Pořadí: BLOCKED 1 čip (K4), 2 řádek rozdílu (K2), 3 způsoby rozkládání (K6–K8), 4 díra v rytmu (§3). Karty jsou napsané podle doporučených variant.

BLOCKED: **Co nabídne čip koupě na výsledku?** Hra vybere jednu věc, kterou jde koupit jedním klepnutím. (a) **další úroveň větve, kterou jsi naposledy koupil/a v Dílně** (např. koupil/a jsi Paper 2 → čip „Paper 3 · 45 ◈“; na začátku Power); (b) vždy nejlevnější další úroveň; (c) cíl, který si v Dílně připneš. **Doporučení: (a)**: volba zůstává tvoje z Dílny, čip ji jen opakuje; (b) vybírá za hráče a tlačí k drobným koupím, (c) je další ovládání navíc. Ve všech variantách: nikdy vlaštovka, koupi jde vrátit do dalšího hodu.

BLOCKED: **Má ve výsledku zůstat řádek „rozdíl proti minule“?** Tužkovou stopu v letu jsi zamítl/a; tohle je jen jeden řádek po dopadu, např. „+34 m oproti minule · Power 2 · 4 zásahy“. (a) **ano, jen ve výsledku**, a jen když se něco opravdu změnilo; (b) ne, jen rekord a nápověda úhlu jako dnes; (c) jen u neúspěchu („puštěno brzy“). **Doporučení: (a)**: informační zpětná vazba má v KB nejlepší oporu (Deci, d ≈ +0,33) a bez ní závod s minulým výkonem nemá ve hře nosiče.

BLOCKED: **Mají způsoby rozkládání nést i herní informaci, ne jen vypadat jinak?** (a) **ano**: přístav po molech jako malé cíle (loď zůstane napůl, když nedoletíš), ve Zlatých polích se obilí rozvine až tam, kam bys sám doklouzal (zásah ho viditelně posune), v Městě lampionů se lampiony rozzáří podle rychlosti; (b) jen 4 různé animace bez informace; (c) informaci jen v polích (obilí), jinde animace. **Doporučení: (a)**; když se bojíš, že obilí prozradí konec letu moc brzy, pak (c) bez obilí, tedy jen mola a lampiony.

BLOCKED: **Čím zaplnit nejdelší úsek bez novinky (mezi Gardens a Railway, asi hody 21–24)?** (a) **jedna scéna na jedno použití** (např. vlak vyjede z nádraží a chvíli závodí s vlaštovkou, jen jednou za hru); (b) tady odemknout předpověď událostí při míření (06: „až jako odemčení“); (c) nic, nechat jen koupě a rekordy a počkat na playtest. **Doporučení: (a)**: je vidět ve vzduchu a nic nemění v balancu; (b) je dobrá, ale předpověď je informace, ne zážitek.
