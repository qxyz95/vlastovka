# Plán obsahu na dvě hodiny (game design)

**Založeno 14. 10. 2026** (game designer). Odpověď na rozhodnutí 06 „Oprava cílové délky hry“. Uživatel doslova: „Nemíříme jenom na 60 minut. Délka hry by byla ideální na 2 hodiny. Ale to by musela být dostatečně zábavná a hráč by musel chtít objevovat co dál půjde ve hře s bonusama a eventama dokázat.“

**Podklady:** `06-rozhodnuti.md` (přednost), `research/obsah/01-game-design.md` (modely, Mailbag, skiny, razítka, polička), `08-navrh-kolo2.md` (Atlas, kapsy, události, §10.2), `12-ladeni2.md` (dnešní čísla), `13-rippleloop.md` (3. kolo: násobek čtvrti, strom, Boost taps, Throw again), `04-svet-cile-sbirky.md` (co bylo zamítnuto), `research/atlas/01-navrh-atlasu.md`, bible `research/design/05-styl-papir.md` (názvy čtvrtí a míst), KB P1–P15 (hlavně bloky 02, 03, 08).

**Konvence:** návrh je česky, herní texty anglicky s českým ekvivalentem (EN / CS). Čísla jsou zástupná, ověřuje je balance-analyst v `simulation/progression/`. Pracnost: **S** do půl dne, **M** 1–2 dny, **L** 3–5 dní, **XL** víc. Rozpad: data / logika / 3D / UI / texty. Odhady pracnosti a délky jsou NOT ASSESSED, nic z toho není změřené.

---

## 0. Shrnutí

1. **Dvě hodiny jen zdražením by byly grind.** Dnes průměrný hráč dohraje za 49–52 min a ~93–96 hodů. Dvě hodiny jsou ~210–230 hodů. Se stejným obsahem by velký objev přišel jednou za 5–6 hodů místo dnešních ~2,5, mezi místy by bylo ~13 hodů a v D3–D4 sucha přes 15 hodů. To je přesně to, co P13 a uživatel nechtějí.
2. **Potřeba:** na ~220 hodů aspoň **60 velkých objevů** (jeden za 3–4 hody), dnes jich je ~40. Tedy **+20–30 nových objevů** a k tomu drobnosti mezi nimi. Nákupy ve stromě (3. kolo) plní čas mezi objevy, ale samy objevem nejsou.
3. **Doporučená struktura (BLOCKED 1):** **den ~85–90 min** na stávajících 16 místech, zahuštěný obsahem, a **Night Route ~30 min** jako druhé dějství s jiným cílem (rozsvítit město), odemčená uzlem ve stromě po finále (06). Kdo skončí po „Delivered.“, má hotovou hru za ~1,5 h. Kdo chce dál, má ~2 h. Pátou čtvrť nedoporučuji, je nejdražší (3D) a zrychlila by pozdní lety.
4. **Jádro nového obsahu (co dá nejvíc za nejmíň práce):**
   - **Orientační body (ZB1):** 16 zastávek v polovině míst. Zkrátí čekání mezi „něčím novým“ na polovinu a nesou drobný obsah.
   - **Kousky (TR):** hra pozná a pojmenuje kombinace bonusů, událostí a modelů („Steam Organ“, „Harbor Relay“). Kousek se zapíše na rub pohlednice v Atlasu a nití spojí dvě místa. **Tohle je odpověď na „co dál půjde dokázat s bonusy a eventy“.** Staví skoro jen na hotovém obsahu.
   - **Zvěsti postav (CU1):** postava napoví legendární kousek čtvrti, až na něj hráč má všechno potřebné. Bez seznamu úkolů.
   - **Hejno (EV1):** první varianta holuba, která mění rytmus (drž, pusť, drž). Proti okoukání poryvů a holubů.
5. **Rozšíření:** Prachový vír (volba rychlost / výška uvnitř události), Husí klín (let ve výškovém pásu bez QTE), Lampiony, Přemet (nová aktivní schopnost), Předpověď trasy (vidět první události před hodem), Ladění píšťalky, zahlédnutí dalších čtvrtí, řádek rekordů.
6. **Později:** Night Route (lucerna, noční události, Night Owl, Night Mail).
7. **Nová pásma pro 08 §10.2** (§7): den 150–180 hodů / 78–95 min, noc 45–65 hodů / 25–35 min, nové metriky „sucho bez objevu“ (P90 ≤ 6) a „mezi zastávkami“ (P90 ≤ 10).
8. **Pořadí dávek (§8):** A zastávky a zvědavost → B kousky → C svěží události → **playtest jako brána** (opravdu hráči chtějí hrát déle?) → D 3. kolo ekonomiky přepočtené na den ~87 min → E styl → F noc. Celkem odhadem 50–70 agentodnů (NOT ASSESSED).

---

## 1. Upřímný rozbor

### 1.1 Kolik jsou dvě hodiny v hodech
- Dnes (F5, SKILLS průměrný, realistický nákup): **96 hodů / 52 min**, tedy ~32 s na hod včetně ~8 s UI. Start F5: 93 / 49 min. Let je v D4 ~29 s a uživatel schválil, že poslední lety mají ~30 s (06, 08 §11 bod 1). **Delšími lety se tedy prodlužovat nesmí.**
- S „Throw again“ (06, RippleLoop bod 4) klesne UI na ~5–6 s. Průměrný hod pak trvá ~26 s v D1 až ~35 s v D4.
- **120 min ≈ 210–230 hodů.** Den ~87 min ≈ 165 hodů, noc ~30 min ≈ 55 hodů.

### 1.2 Co dnes hráče posouvá (inventář novinek)
Počítám „velký objev“ = věc, která hráči ukáže něco kvalitativně nového (místo, sloveso, schopnost, model). Nákup úrovně a drobnosti (hláška, razítko) jsou zvlášť.

| Druh | Kusů | Odkud |
|---|---:|---|
| Místa s bonusem (vč. Glider na 100 m) | 16 | 08 §4 |
| Nové druhy papíru | 3 | 06 (3. místo čtvrti) |
| Karty čtvrti a finále | 4 | 08 §8.2, §8.4 |
| Kapsy a první nasazení speciálů | 2 + 6 | 08 §5 |
| Modely k prodeji / koupené | 5 | 01 §2 |
| První setkání s novou událostí (pára, termika, dron, hvězda) | 4 | 08 §4 |
| **Velké objevy celkem** | **~40** | |
| Drobnosti: hlášky postav 12, skiny 10, razítka 7, Mailbag 3, vtipy o dopadu 12, místní holubi a poryvy 8, gagy 5 | ~57 | 08 §7–8, 01 §3 |

Na 96 hodů je to velký objev zhruba **každých 2,4 hodu**, ale nerovnoměrně: D1 je hustá, D3–D4 řidší a novinky se shlukují na kartách čtvrtí. Proto dnes sucho P90 9–11 (cíl ≤ 8, 12-ladeni2 §5.1).

### 1.3 Dvě hodiny se stejným obsahem
Kdyby se 2 h dosáhly jen zdražením (ceny ×~2,3, stejný obsah):

| | Dnes (52 min) | 2 h jen zdražením (odhad) |
|---|---:|---:|
| Hodů celkem | 96 | ~220 |
| Velký objev | každé ~2,4 hodu | každých ~5,5 hodu |
| Mezi místy (medián) | ~5–6 | ~13 |
| Sucho bez objevu v D3–D4 (P90) | ~9 | ~18–22 |
| Poryvy a holubi za hru | ~300 QTE | ~650 QTE |
| Hodů na jednu čtvrť | 20–30 | 50–60 |

**To je grind** (P13, KB 02 §2.7): hráč by házel znovu, protože strom je drahý, ne protože ho něco láká. Loewenstein (KB 08 [10], P3): zvědavost slábne, když rozuzlení přijde až po dlouhém čekání. Kivetz (KB 03): úsilí roste s podílem zbývající vzdálenosti. Při 13 hodech na místo je podíl po každém hodu malý. A ~650 poryvů a holubů se stejným slovesem je hlavní riziko okoukání (Kidd & Hayden, KB 08 N6).

### 1.4 Kolik nového je potřeba
- Cíl ze zadání: **něco nového každých ~3–5 hodů.** Na 220 hodů je to 45–70 velkých objevů. Beru střed **~60** (den ~45, noc ~15).
- Dnes ~40, z toho Night Owl a skin Night Mail patří až do noci. **Chybí ~20–30 velkých objevů** a k nim drobnosti, které vyplní mezery.
- **Rozmanitost letu:** v D3–D4 má být v letu aspoň jedna událost, která není poryv ani holub, a v D2 a později aspoň jedna varianta, která mění rytmus nebo nabízí volbu.

### 1.5 Co délku nesmí nést
- **Zdražení bez obsahu** (viz 1.3). Ceny se zvednou jen tolik, kolik unese hustota objevů. Měří simulace (§7).
- **Delší lety:** ~30 s na konci je rozhodnuté.
- **Pomalejší π a míň rychlosti:** uživatel chce silnou vlaštovku v pozdní hře (06, varianta B).
- **Náhoda, odpočty, denní věci, reset a prestige:** zakázané (06, P13).
- **Povinné výzvy:** zamítnuté (06 B16, SV06, SV13). Nic z nového obsahu není podmínkou postupu, postup dál nese dolet a mince.

---

## 2. Struktura dvou hodin: rozšířit trasu, nebo zahustit?

| Varianta | Co | Plus | Minus | Pracnost |
|---|---|---|---|---|
| **A. Den na 2 h** | 16 míst, ~220 hodů ve dne, noc jako bonus navíc | jedna trasa, nic nového ve 3D navíc | ~14 hodů na místo i se zastávkami, stejné město 2 h, nejvíc nákupů a cenového tlaku | M (obsah) + ladění |
| **B. Den ~87 min + noc ~30 min (doporučeno)** | den zahuštěný (zastávky, kousky, varianty událostí), po finále uzel **Night Route** s jiným cílem | den má ~10 hodů na místo, noc dá nový pohled na stejné město (osvětlení místo nových modelů), pokračuje „cesta za sluncem“ z bible (ráno → poledne → zlatá → lampiony → **noc**), Mailbag III, Night Owl a Night Mail už v plánu jsou | noc je velký kus práce a závisí na Papírovém městě pro všech 16 míst | M (den) + L–XL (noc) |
| **C. Pátá čtvrť** | 20 míst, nová stavebnice | nové místo je nejsilnější objev | nová paleta, katalog, postava, brána, papír, π ještě vyšší (lety > 200 m/s, čitelnost kamery), XL ve 3D | XL |
| **D. Zahuštění bez noci** | jako A, ale den jen ~90 min a hra končí | nejméně práce | nesplní 2 h | M |

**Doporučení: B.** Den dostane obsah, který je potřeba tak jako tak (sucho, okoukání událostí, „co dál jde dokázat“). Noc přidá ~30 min s novým cílem a staví na geometrii, která už bude hotová. 06 platí: Night Route se otevírá uzlem ve stromě po finále, ne sama. Kdo po finále skončí, má celou hru. Volba je BLOCKED 1 (§9).

**Proč ne pátá čtvrť teď:** nejdražší (3D XL) a pozdní lety by musely být ještě rychlejší. Nechávám ji jako nápad na později, až playtest ukáže, že 16 míst nestačí.

---

## 3. Mapa obsahu na dvě hodiny

**Cílová osa** (průměrný hráč SKILLS, realistický nákup, Throw again, varianta B): D1 0–39 hodů / 0–17 min, D2 39–80 / 17–38 min, D3 80–123 / 38–61 min, D4 123–165 / 61–86 min, finále ~165 / ~87 min, noc ~165–220 / ~87–118 min. Hody po místech jsou rozvržení, **ne měření**. Tučně je nový obsah z tohoto dokumentu, ostatní je z 01, 08, Atlasu a 3. kola. „½“ = orientační bod v polovině místa (ZB1).

### Fáze 1: 0–15 min, „naučit se létat“ (Střechy za úsvitu, místa 1–4)
Cíl fáze: slovesa tap, hold, tap-tap, první nákupy, první kousek. Hráč se dozví, že hra pojmenovává, co udělal.

| Místo | ~hod / min | Existující | Nové |
|---|---|---|---|
| 1 Workshop & First Roofs | 1 / 0 | Power, Paper, Glider (100 m), Boost tap 1 (3. kolo) | **kousek Pigeon Express** je možný od 1. letu |
| 1½ | ~3 / 1 | | **zastávka**, razítko Gust / Pigeon tiše |
| 2 Market under the Bunting | ~6 / 2,5 | Crowd Chain | **řádek „Pairs well with“** na kartě (CU3) |
| 2½ | ~10 / 4 | | **zastávka**, hláška Bolts 1 |
| 3 Gardens at the Edge | ~14 / 6 | Pinwheel, světlý Kraft | |
| 3½ | ~19 / 8 | | **zastávka**, **zvěst Bolts** (Pigeon Express, jen pokud ho hráč ještě nemá) |
| 4 Railway to the River | ~25 / 11 | Steam Hop, Hawk k prodeji | **kousek Kettle Song** |
| 4½ | ~32 / 14 | | **zastávka**, **zahlédnutí: hejno racků nad řekou** (CU4) |

Velkých objevů ve fázi: ~14 (dnes ~10).

### Fáze 2: 15–40 min, „najít svůj styl“ (konec D1, Slunný přístav, místa 5–8)
Cíl fáze: kapsy, první modely, první varianta události, kousky z kombinací.

| Místo | ~hod / min | Existující | Nové |
|---|---|---|---|
| 5 Warehouses by the Water (karta D2) | ~39 / 17 | Packing Tape, Dive, Calm Sky, 1. kapsa, K1, Mailbag I, koupě Hawka | **kousek Tape Save** |
| 5½ | ~44 / 19 | | **zastávka**, **uzel Předpověď trasy** (BN2) ve stromě |
| 6 Crane Forest | ~49 / 22 | Crane Lift, Kite k prodeji | **událost Hejno** (EV1), **kousek Crane Hook Dive** |
| 6½ | ~54 / 24 | | **zastávka**, hláška Marge 2 |
| 7 Bridge over the Bay | ~59 / 27 | Stone Skip, Washi, koupě Kite | **kousek Skipping Stones** (se Skimmerem později) |
| 7½ | ~65 / 29 | | **zastávka**, podpisový skin K6 (Hawk) podle hraní |
| 8 Lighthouse at the Pier's End | ~70 / 32 | Gull Escort, Skimmer k prodeji | **zvěst Marge** (Harbor Relay) |
| 8½ | ~75 / 35 | | **zastávka**, **zahlédnutí: prachový vír na zlatých polích** |

Velkých objevů ve fázi: ~18.

### Fáze 3: 40–80 min, „co ještě jde dokázat“ (Zlatá pole a většina Města lampionů, místa 9–15)
Cíl fáze: nejvíc kousků, volba uvnitř události, let bez QTE, druhá kapsa. Tady dnes bylo sucho, proto je tu nejvíc nového.

| Místo | ~hod / min | Existující | Nové |
|---|---|---|---|
| 9 Fields beyond the Bay (karta D3) | ~80 / 38 | Momentum, Whistle, Rocket, 2. kapsa, K2, Mailbag II, koupě Skimmeru | **speciál Přemet / Loop** (BN1) v kapsách |
| 9½ | ~85 / 40 | | **zastávka**, **událost Prachový vír** (EV2) začíná |
| 10 Windmill Ridge | ~91 / 44 | Thermal, Sail k prodeji | **událost Husí klín** (EV3), **kousek Goose Slot** |
| 10½ | ~96 / 46 | | **zastávka**, **uzel Ladění píšťalky** (BN3) |
| 11 Mountain Saddle | ~102 / 50 | Echo, stříbrná fólie, koupě Sailu | **kousek Steam Organ** (pára + Echo), **kousek Corkscrew** (Přemet ve víru) |
| 11½ | ~107 / 52 | | **zastávka**, **zvěst Stella** (Wish) |
| 12 Observatory above the Valley | ~113 / 55 | Shooting Star | **kousek Wish** |
| 12½ | ~118 / 58 | | **zastávka**, **zahlédnutí: lampiony stoupají nad Městem lampionů** |
| 13 Gates of the Lantern City (karta D4) | ~123 / 61 | Ad Drone, K3, Mailbag III, uzly automatiky | **událost Lampiony** (EV4) |
| 13½ | ~128 / 64 | | **zastávka**, **kousek Drone Ping-Pong** |
| 14 Sky Terraces | ~133 / 67 | Paper Crane, Needle k prodeji | **kousek Crane Catch** |
| 14½ | ~139 / 70 | | **zastávka**, hláška Zippy 2 |
| 15 Clock Tower | ~144 / 73 | On Air, koupě Needle | **zvěst Zippy** (Live from the Tower) |
| 15½ | ~150 / 76 | | **zastávka**, **kousek All the Verbs** (průřezový) |

Velkých objevů ve fázi: ~28.

### Fáze 4: 80–120 min, „finále a noc“ (místo 16, finále, Night Route)
| Místo | ~hod / min | Existující | Nové |
|---|---|---|---|
| 16 Rooftop Harbor | ~155 / 79 | Encore | |
| 16½ | ~160 / 83 | | **zastávka**, **zahlédnutí: první hvězdy a ohňostroj nad přístavem** (předzvěst noci) |
| Finále | ~165 / 87 | „Delivered.“, souhrn, K4, K5, R7, polička, **uzel Night Route** | rovnocenná tlačítka Done / Keep playing |
| Noc 1–4 | ~166–180 / 87–95 | Night Owl (M6) k prodeji, Mailbag III se vrací | **lucerna**, rozsvícení míst 1–6, **Paprsek majáku** (EV6) |
| Noc 5–8 | ~180–200 / 95–106 | | místa 7–11, **Ohňostroj** (EV5), noční zvěsti |
| Noc 9–16 | ~200–220 / 106–118 | | místa 12–16, **rozsvícené město**, „Night Mail delivered.“, K11, R12, souhrn noci |

Velkých objevů v noci: ~15 (lucerna, 2 nové události, noční lampiony, Night Owl, noční uzly stromu, kousky noci, zahlédnutí, noční pohlednice po čtvrtích, závěr).

### Čtení mapy
- **Zastávky dělí každé místo na dvě půlky po ~5 hodech.** Na každé zastávce je jedna věc z fronty drobností: hláška, zvěst, razítko, zahlédnutí, podpisový skin, nový uzel. Karty čtvrti zůstanou velký okamžik, ale už nenesou všechno naráz.
- **Jedna novinka za hod (U3) platí dál.** Fronta (`p.atlas.pending`) má teď víc položek, proto dostávají priority a tiché položky (razítka, hlášky) se neohlašují, když čeká velký objev.
- **Kousky nejsou v ose napevno.** Zapsané jsou tam, kde je hráč může poprvé udělat. Kdy je opravdu udělá, záleží na něm. Simulace měří, jak často se stanou samy (§7).
- **Modely a Mailbag zůstávají podle 01 §2.8** (místa odemčení 4, 6, 8, 10, 14), jen se posunou na delší osu. Cena `k × R` se přepočte automaticky.

---

## 4. Smyčka zvědavosti: jak hráč tuší, co dál jde dokázat

Zásady: P3 (zvědavost nese obsah, ne náhoda), P6 (blízký cíl ve vzdáleném rámci), Loewenstein (napovídat, jen když je rozuzlení na dosah), 08 N7 a N8 (sbírka bez povinnosti a bez počítadel), 06 Atlas bod 4 (tečka jen u nové věci).

**Pět vrstev, od nejtišší:**
1. **„Pairs well with“ (CU3):** karta bonusu, kapsy a modelu jmenuje 1–2 partnery („Pairs well with: Echo, Thermal“). Neříká, co z toho vznikne. Signál, že kombinace existují.
2. **Pojmenování po činu (TR0):** první kousek se stane většině hráčů sám v D1 (Pigeon Express). Hráč se tak naučí, že hra pozná a pojmenuje, co udělal. Další kousky hledá sám.
3. **Zahlédnutí (CU4):** z konce čtvrti je v dálce vidět událost další čtvrti (hejno nad řekou, vír na polích, lampiony nad městem, ohňostroj nad přístavem). Bez textu, bez odměny. Odpovídá pravidlu Atlasu „vzdálené jen jako rámec“ (08 N2).
4. **Zvěsti postav (CU1):** jedna zvěst na čtvrť, až má hráč všechny přísady legendárního kousku. Zazní jednou, pak je k přečtení v Atlasu u postavy.
5. **Rub pohlednice (CU2):** v Atlasu se pohlednice dá otočit. Na rubu jsou kousky, které hráč udělal s bonusem tohoto místa, a tužková skica **jen** u kousku, o kterém zazněla zvěst. Kousky, které spojují dvě místa, natáhnou mezi pohlednicemi nit. Síť nití je mapa hráčových objevů.

**Co smyčka nedělá:** žádný počet „7/21“, žádné procento, žádný seznam chybějících kousků, žádná tečka kvůli neudělanému kousku, žádné „You're so close!“. Pravdivý řádek „Harbor Relay: 2 of 3 gulls.“ se ukáže jen u kousku se zvěstí, jen jednou a jen jako informace o tomto letu (P10).

**Proč to není zamítnutá „výzva“ (06 B16, SV13):** výzva byla ohlášená předem, s podmínkou a odměnou v mincích, a hráč ji plnil kvůli odměně. Kousek se pozná až po činu, nic nestojí, nic neodemyká na trase a jeho odměna je v samotném letu (kombo, podívaná). Zvěst je příběh postavy, ne zadání. Otevřená volba, jak moc napovídat, je BLOCKED 2.

---

## 5. Karty nového obsahu

Nezdvojuji 01 (modely M1–M6, Mailbag E1, skiny K0–K11, razítka R1–R7, polička C1, rádio C2), Atlas (pohlednice, teaser, kapsy, karta čtvrti) ani 08 (16 bonusů, 6 speciálů, události, postavy). Karty na ně navazují.

### 5.1 Zastávky a zvědavost

#### ZB1 — Orientační body / Landmarks (16 zastávek)
- **Cíl:** zkrátit čekání na „něco nového“ na polovinu bez nových bonusů a bez nafouknutí Atlasu.
- **Pravidlo:** v polovině každého místa stojí pojmenovaná dominanta (příklady: D1 Kite Hill / Kopec draků, Laundry Lane / Ulička s prádlem, Old Tram Depot / Stará vozovna, Water Tower / Vodárna; jména a modely navrhne art-director podle katalogu). První přelet: krátké bliknutí jména jako u místa (08 §2.5), ve výsledku jeden řádek a malá nálepka na čáře trasy v Atlasu (ne pohlednice). Zastávka **nedává bonus**, nese jednu položku z fronty drobností (hláška, zvěst, razítko, zahlédnutí, uzel). Nová „nejdelší vzdálenost v místě“ (06, F5 bod 1) se ukazuje vůči zastávce: „Past the Water Tower.“
- **Proč je to zábavné:** blízký cíl (P6, Locke & Latham). Půlka místa je cítit jako postup. Environmentální vyprávění (KB 08, Jenkins).
- **Vazba:** 06 F5 bod 1 (drobná novinka mezi místy, schváleno), Atlas §3.2 (místa zůstávají 16), 08 §2.5.
- **Zástupná čísla:** poloha 0,5 šířky místa. Jedna položka z fronty na zastávku, prázdná zastávka jen se jménem je přípustná nejvýš 4× za den.
- **Okraje a zneužití:** při ~160 m/s proletí hráč zastávku za ~1 s. Bliknutí se nesmí s místem překrývat (rozestup ≥ 0,8 s, jinak se sloučí do jednoho řádku výsledku). Přelet více zastávek naráz: ohlásí se nejvzdálenější, ostatní tiše v Atlasu. Save: odvozené z `p.best`, nic nového se neukládá.
- **Náhled:** teaser místa v Atlasu ukazuje i jméno zastávky („Next: Water Tower · 120 m past your best“). Nejbližší cíl tak je vždy blíž.
- **Pracnost:** data S / logika S / 3D **M–L** (16 dominant, v rozpočtu místa, ve 3D se staví s dávkami Papírového města) / UI S / texty S. **Priorita: jádro.**
- **Riziko:** bez obsahu by zastávka byla prázdná značka. Proto pravidlo o frontě.

#### CU1 — Zvěsti postav / Rumors
- **Cíl:** napovědět legendární kousek čtvrti tak, aby to byl příběh, ne úkol.
- **Pravidlo:** každá postava čtvrti (Bolts, Marge, Stella, Zippy; jména se mohou změnit s Papírovým městem) má navíc **zvěst** a **reakci**. Zvěst zazní na nejbližší zastávce nebo ve výsledku, **až má hráč všechny přísady** legendárního kousku a ještě ho neudělal. Reakce zazní jednou po prvním provedení. Obojí je pak k přečtení v Atlasu u postavy. Bez počtu.
  - Bolts: "Old trick from my delivery days: catch a pigeon, let go, then ride the next gust. We called it the express." / „Starý trik z doby, kdy jsem rozvážel: chytit holuba, pustit, a hned chytit poryv. Říkali jsme tomu expres.“ Reakce: "Express delivery. I'm logging it as weather again." / „Expresní doručení. Zase to zapíšu jako počasí.“
  - Marge: "Back in my day a whole flock carried a parcel over the bridge. Hold on, let go, hold on, they said." / „Za mých časů přenesla celá hejna balík přes most. Drž, pusť, drž, říkalo se.“ Reakce: "Well I never. The gulls remembered." / „No teda. Racci si to pamatovali.“
  - Stella: "They say if you catch a falling star mid-combo, it grants a wish. Statistically unlikely. Do it anyway." / „Říká se, že když chytíš padající hvězdu uprostřed komba, splní přání. Statisticky nepravděpodobné. Zkus to stejně.“ Reakce: "I made a note. Officially it was a satellite." / „Zapsala jsem si to. Oficiálně to byla družice.“
  - Zippy: "If you pass my tower live with a big combo, I'll put you on every screen. No ads. Promise." / „Když proletíš kolem mé věže živě a s velkým kombem, dám tě na všechny obrazovky. Bez reklam. Slibuju.“ Reakce: "Highest ratings in tower history. I'm crying. Drones can't cry." / „Nejvyšší sledovanost v historii věže. Brečím. Drony brečet neumějí.“
- **Proč je to zábavné:** zvědavost s rozuzlením na dosah (Loewenstein), humor postav (KB 08, Gagnon). Hráč ví, že něco existuje, ale ne přesně jak.
- **Vazba:** 06 (postavy ano, každá hláška jednou, bez přemlouvání), 08 §7.1, Atlas §3.6.
- **Okraje:** hráč, který kousek udělá dřív, zvěst neuslyší a dostane jen reakci. Zvěst nesmí přemlouvat k hraní (KB 02 §4.3 bod 8), proto žádné „come back“.
- **Pracnost:** data S / logika S (podmínka „má přísady, nemá kousek“) / 3D – / UI S (patička postavy v Atlasu existuje) / texty S (8 replik EN + CS). **Priorita: jádro.**

#### CU2 — Rub pohlednice a nitě / Postcard backs and threads
- **Cíl:** domov pro kousky uvnitř Atlasu (06: „Stačí Atlas“, žádná stránka sbírky).
- **Pravidlo:** detail karty v Atlasu má přepínač „Back“. Na rubu jsou tuší nakreslené kousky, které hráč udělal s bonusem tohoto místa (jméno, jedna věta, kdy poprvé). Tužková skica jen u kousku se zvěstí. Kousek, který spojuje bonusy dvou míst, natáhne na mapě trasy tenkou nit mezi jejich pohlednicemi (Steam Hop ↔ Echo). Kousky modelů (podpisové skiny K6–K10 v 01) jsou na kartě modelu v Dílně.
- **Proč je to zábavné:** síť nití je osobní mapa „co jsem s tímhle městem dokázal“, paměťová kotva (KB 08 §3.7). Kombinace jsou vidět jako vztahy mezi místy.
- **Vazba:** Atlas §3.3 (detail karty), §2.3 (žádný checklist).
- **Okraje:** žádné počty, na rubu pohlednice bez kousku je jen razítko místa a věta příběhu. Reduced motion: nitě bez animace. Mobil: rub se otáčí klepnutím, nitě jen na mapě trasy (na 360 px nejvýš 1 px, nesmí rušit čitelnost karet).
- **Pracnost:** data S / logika S / 3D – / UI **M** / texty S. **Priorita: jádro** (spolu s TR0).

#### CU3 — „Pairs well with“ / „Hodí se k“
- **Pravidlo:** jeden řádek na kartě bonusu, speciálu a modelu se jmény 1–2 partnerů, které spolu tvoří kousek. Jen jména, žádný popis kousku. Partner, kterého hráč ještě nezná, se ukáže jako „???“ s ikonou čtvrti.
- **Proč:** signifikátor možnosti (Hamari & Eranti, KB 08 N8) bez úkolu. Navazuje na „Loves:“ u modelů (01 §2.10).
- **Pracnost:** data S / UI S / texty S. **Priorita: jádro.**

#### CU4 — Zahlédnutí / Sightings
- **Pravidlo:** 4 krátké scény v dálce, každá jen při prvních třech letech přes danou zastávku: hejno racků nad řekou (4½), prachový vír na polích (8½), lampiony nad městem (12½), hvězdy a ohňostroj nad přístavem (16½, jen v podvečerní paletě). Bez textu a odměny. Rozšiřuje gagy 08 §8.3.
- **Proč:** předzvěst příští čtvrti (SV19, 08 N2). Hráč vidí, co ho čeká, dřív, než to umí.
- **Okraje:** nesmí soupeřit s vlaštovkou o pozornost (bible 05: jedna výrazná věc na obrazovku), jen v pozadí, mimo QTE. Reduced motion: statický obraz. Ohňostroj bez záblesků (WCAG 2.3.1).
- **Pracnost:** data S / logika S / 3D **M** (sdílí modely s EV1–EV5) / UI – / texty –. **Priorita: rozšíření.**

#### RK1 — Řádek rekordů / Personal best line
- **Pravidlo:** ve výsledku nejvýš jeden řádek, jen když hráč překoná vlastní rekord: „Best: 7 places in one throw“, „Highest: 41 m“, „Longest combo ×9“, „Farthest in Windmill Ridge“. Žádné srovnání s ostatními. V noci „Most places lit in one throw“.
- **Proč:** pravdivá zpětná vazba podle výkonu (P1), drobná novinka mezi místy (06 F5 bod 1). RippleLoop chválí souhrn s rekordy (13 §6.1).
- **Okraje:** 06 „osobní statistiky po finále zatím ne“: tohle není obrazovka statistik, jen řádek ve výsledku. Řadí se do fronty pod objevy.
- **Pracnost:** data S / logika S / UI S / texty S. **Priorita: jádro.**

### 5.2 Kousky (co dál jde dokázat)

#### TR0 — Systém kousků / Tricks
- **Cíl:** dát hráči důvod zkoušet kombinace bonusů, událostí a modelů. Přímá odpověď na „co dál půjde ve hře s bonusy a eventy dokázat“.
- **Pravidlo:**
  1. Kousek je pevná podmínka nad záznamem jednoho letu (čistá funkce bez DOM, např. `src/tricks.js`, deterministicky ze seedu a vstupů, test pro každý kousek).
  2. **Poprvé:** za letu krátký tušový štítek se jménem (0,8 s, let se nezastavuje, reduced motion jen text), ve výsledku „New trick: Steam Organ“ (fronta U3, kousek má po finále a kartě čtvrti nejvyšší prioritu, protože je to hráčův výkon, P1), zápis na rub pohlednice a nit (CU2).
  3. **Znovu:** malý štítek se jménem a **+1 krok komba** (jednou za let pro každý kousek, ve stropu komba). Kombo zvyšuje i mince (06 RippleLoop bod 3, malý účinek). Opakování kousku má tedy smysl, ale nedá mince přímo (BLOCKED 3).
  4. Kousek **nic neodemyká na trase** a není podmínkou postupu. Výjimky jen kosmetické: 4 legendární kousky dají razítko (R8–R11), kousky modelů dávají podpisový skin (už v 01).
- **Proč je to zábavné:** hráč skládá vlastní let, hra ocení konkrétní čin jménem (P1, Kao 2024 vazba na úspěch). Objevování kombinací je horizontální růst, který strom nevyřeší (KB 03 N6). Tony Hawk a Burnout fungují stejně: pojmenovaný trik je odměna sám o sobě.
- **Vazba:** 06 (žádné výzvy na objednávku, šikovnost středně, automatika jen běžný zásah), KB 08 N8 (achievementy střídmě), P7 (kousek je čin hráče, ne vylepšení).
- **Okraje a zneužití:**
  - **Automatika QTE** dává jen běžný zásah, takže kousky s perfektem nejdou. Karta to řekne („Needs perfect hits.“). „Širší okna časování“ v Nastavení perfekty umožní (přístupnost).
  - **Farmení komba** kouskem: jednou za let na kousek, kombo má strop.
  - **Kousek zadarmo:** pokud by se stal samovolně ve > 25 % letů, je to vlastnost výbavy, ne kousek. Simulace to hlídá (§7) a podmínka se zpřísní.
  - **Nedosažitelný kousek:** se záměrem musí jít v ≥ 5 % letů průměrného hráče, jinak se uvolní.
  - Save: `p.tricks` (pole ID s číslem hodu prvního provedení), migrace s prázdným polem, poškozený save se neztrácí.
- **Náhled:** CU3 jmenuje partnery, CU1 napoví legendy, rub pohlednice ukáže skicu jen u zvěsti.
- **Pracnost systému:** data S / logika **M** (záznam letu, detektory, kombo) / 3D S (štítek) / UI M (štítek, výsledek, rub, nitě sdílí s CU2) / texty S. Každý další kousek: data a logika S (~0,25–0,5 dne včetně testu), texty S. **Priorita: jádro.**

#### TR1–TR16 — Katalog kousků (zástupné podmínky)
„Samo“ = odhad, v kolika % letů se kousek stane bez záměru, když hráč má přísady (NOT ASSESSED, změří simulace). L = legendární (se zvěstí a razítkem).

| # | Kousek (EN / CS) | Podmínka (jeden let) | Pohlednice / nit | Od | Samo | Proč zábavný |
|---|---|---|---|---|---:|---|
| 1 | **Pigeon Express** / Holubí expres (L) | perfektní holub, pak perfektní poryv do 1,5 s po puštění | First Roofs | 1 | ~8 % | první kousek, učí, že hra pojmenovává |
| 2 | **Kettle Song** / Píseň konvice | všechny obláčky páry perfektně | Railway | 4 | ~12 % | rytmus tap-tap |
| 3 | **Over the Line** / Přes čáru | Boost tap nebo Paper Rocket v poslední sekundě letu přenese přes hranici místa, bez něj by let skončil před ní (pravdivý přepočet) | Gardens | 1–5 | ~4 % | rozhodnutí kdy, „poslední tah přes čáru“ (08 S4) |
| 4 | **Tape Save** / Zalepeno | minutí zachráněné páskou, hned další událost perfektně | Warehouses | 5 | ~6 % | ocení návrat po chybě (slabší hráč, P14) |
| 5 | **Crane Hook Dive** / Z háku střemhlav | start z jeřábu a nízký průlet Dive do 8 s | Crane Forest ↔ Dive | 6 | ~2 % | spojí start a schopnost |
| 6 | **Skipping Stones** / Žabky | 3 odrazy od vody v jednom letu | Bridge | 7 (reálně se Skimmerem) | ~3 % | hraje s modelem Skimmer (01 M3) |
| 7 | **Harbor Relay** / Přístavní štafeta (L) | Hejno (EV1) celé perfektně s Gull Escort | Lighthouse ↔ Crane Forest | 8 | ~3 % | vrchol rytmu drž-pusť-drž |
| 8 | **Corkscrew** / Vývrtka | Přemet (BN1) uvnitř Prachového víru | Fields ↔ Saddle | 9½ | ~1 % (záměr) | podívaná, šikovnost |
| 9 | **Goose Slot** / Místo v klínu | celý Husí klín v pásu (EV3) | Windmill Ridge | 10 | ~10 % | odměna za plán před hodem |
| 10 | **Steam Organ** / Parní varhany | Echo zopakuje všechny 3 perfektní obláčky páry | Railway ↔ Saddle | 11 | ~5 % | kombinace bonusů ze dvou čtvrtí |
| 11 | **Wish** / Přání (L) | chycená padající hvězda při kombu ≥ 5 | Observatory | 12 | ~3 % | vzácné spojení štěstí a výkonu, přiznané |
| 12 | **Drone Ping-Pong** / Pinčes | dva perfektní drony do 2 s | Gates | 13 | ~4 % | ostrý rytmus D4 |
| 13 | **Crane Catch** / Jeřábek chytá | perfektní Cushion a pak Paper Crane přetáhne přes hranici místa | Sky Terraces ↔ Cushion | 14 | ~2 % | dvojitá záchrana na konci letu |
| 14 | **Live from the Tower** / Živě z věže (L) | On Air vysílá při průletu Clock Tower s kombem ≥ 8 | Clock Tower | 15 | ~3 % | finále komba nad dominantou |
| 15 | **All the Verbs** / Všechna slovesa | v jednom letu úspěšně tap, hold, tap-tap a tap in place | Encore (karta trasy) | 13 | ~6 % | průřez všemi událostmi |
| 16 | **Whistle Storm** / Bouře píšťalky | 3 přivolané události, všechny perfektně | kapsa Whistle | 9 | ~2 % (záměr) | risk za odměnu (06 F3 bod 5) |

Plus 5 kousků modelů (podpisové skiny K6–K10 z 01 §3.2), které se jen zapíšou stejným systémem. **Celkem 21.** Den má přísady pro všechny, cíl je, aby průměrný hráč do finále našel **40–75 %**, ne všechny.

### 5.3 Události a jejich varianty

Pravidla pro všechny: 06 F3 bod 4 a F5 bod 2 (nová událost nesmí snižovat dolet tím, že vytlačí jinou: varianta nahrazuje svou základní událost jen tehdy, když má pro každý profil očekávaný přínos ≥ základní; nová událost jde do rozvrhu navíc), Z6 jedno tlačítko, U3 první setkání (zpomalení, jedna věta, širší okno), pod 8 m nic nezačíná.

#### EV1 — Hejno / Flock (varianta holuba)
- **Cíl:** obnovit holuba ve střední hře novým rytmem.
- **Pravidlo:** od místa 6 je ~25 % holubů hejno tří ptáků za sebou (D2 racci, D3 holubi s mapou, D4 papíroví holubi). Drž, pusť na značce, do 0,4 s chyť dalšího. Každý pták má vlastní plující střed (Z4). Úspěch +1 komba, perfekt +2. Minutí hejno ukončí, ale zisk z předchozích zůstane. Push každého ptáka 0,6× holuba, výšku dává jen první (koš doba ve vzduchu). Nejvýš jedno hejno za let, v rozestupu událostí se počítá jako jedna.
- **Proč je to zábavné:** první událost s rytmem ze tří kroků, jackpot pro kombo (Crowd Chain, Gull Escort). Kousek Harbor Relay.
- **Vazba:** 06 (místní holubi ano, SV18), 08 §7.2.
- **Zástupná čísla:** podíl 0,25, push 0,6× na ptáka, mezera 0,4 s.
- **Okraje:** automatika chytí všechny tři běžným zásahem. Hawk `missK` platí na každého ptáka (riziko tří trestů, náhled to řekne). Únava z QTE: max 1 za let, ne v prvních 3 letech po odemčení dvakrát za sebou.
- **Náhled:** zahlédnutí 4½, „Locals“ v Atlasu D2 jako silueta hejna, první setkání „FLOCK · Hold, let go, hold again“ / „HEJNO · Drž, pusť, drž znovu“.
- **Pracnost:** data S / logika **M** (`events.js` nový typ s kroky, simulátor) / 3D M (model holuba ×3, formace) / UI S (kruh se třemi značkami) / texty S. **Priorita: jádro.**

#### EV2 — Prachový vír / Dust Devil (varianta poryvu, Zlatá pole)
- **Cíl:** první událost, kde hráč volí, co chce.
- **Pravidlo:** od 9½ je ~30 % poryvů v D3 vír. První klepnutí vír chytí (zásah / perfekt jako poryv). Vlaštovka se jednou otočí a na kruhu jsou dva oblouky s ikonou: **dřív = rychlost** (vodorovný push ×1,4 poryvu), **později = výška** (svislá část ×1,5, koš doba ve vzduchu). Bez druhého klepnutí neutrální výstup (běžný poryv).
- **Proč je to zábavné:** čtení situace: před hranicí místa výška, s Needle rychlost, s Kite výška. Rozhodnutí uvnitř události (P8, kritéria smysluplné volby).
- **Zástupná čísla:** podíl 0,30 v D3, 0,15 v D4, push ×1,4, výška ×1,5.
- **Okraje:** automatika jen chytí, výstup neutrální. Oblouky se liší tvarem a ikonou, ne jen barvou (P15). Hlídat strop délky letu (výška).
- **Náhled:** zahlédnutí 8½, první setkání „DUST DEVIL · Tap to catch. Tap again: early for speed, late for height.“ / „PRACHOVÝ VÍR · Klepni a chyť. Znovu: dřív pro rychlost, později pro výšku.“
- **Pracnost:** data S / logika M / 3D M (vír z plev a papírových klasů) / UI **M** (kruh se dvěma oblouky) / texty S. **Priorita: rozšíření** (první na řadě).

#### EV3 — Husí klín / Goose V (let bez QTE)
- **Cíl:** chvíle letu, kde rozhoduje plán a poloha, ne reflex. Úleva od hustoty QTE (P14).
- **Pravidlo:** od místa 10 v ~30 % letů přeletí papírové husy ve výškovém pásu (ze seedu 12–30 m, ±3 m). Vlaštovka v pásu za nimi letí v závětří: menší odpor a výtrysk v koši krátkých výtrysků, nejvýš 3 s. Bez klepnutí. Do pásu se dostane úhlem a silou hodu, Dive (dolů), Crane Lift a termikou (nahoru), Kite (výš). Boost taps výšku nemění.
- **Proč je to zábavné:** cíl, na který se míří před hodem (jako vítr a Sail). Dává smysl Předpovědi trasy (BN2).
- **Zástupná čísla:** výskyt 0,30, pás ±3 m, odpor ×0,5, max 3 s.
- **Okraje:** slabý hráč pás často mine, je to jen bonus, nikdy trest. Nepočítá se do rozestupu QTE. Nesmí kolidovat s událostí v čase (počká).
- **Náhled:** husy jsou vidět od začátku letu jako siluety s tečkovaným pásem. S BN2 už při míření.
- **Pracnost:** data S / logika S–M / 3D M (husy, sdílí s EV1) / UI S / texty S. **Priorita: rozšíření.**

#### EV4 — Lampiony / Lantern Rise (Město lampionů)
- **Cíl:** v D4, kde drony tlačí dopředu, dát i výšku a svět lampionů do letu.
- **Pravidlo:** od místa 13 stoupají ze střech lampiony. „Tap in place“ ve chvíli, kdy je lampion v kruhu, vlaštovku zachytí. 1,2 s jemně stoupá, pak se pustí. Do rozvrhu navíc jako Shooting Star (06 F5 bod 2), ~1 za let v D4. Se skinem K4 lampion na chvíli rozsvítí i vlaštovku.
- **Proč je to zábavné:** klidný kontrast k dronům, krásný obraz (bible 05, lampiony nahrazují neon). Základ noci.
- **Okraje:** výška do koše doba ve vzduchu, hlídat medián letu D4 ≤ 35 s.
- **Pracnost:** data S / logika S (jako termika) / 3D M (lampion s provázkem) / UI S / texty S. **Priorita: rozšíření (pro noc jádro).**

#### EV5 — Ohňostroj / Fireworks (jen noc)
- **Pravidlo:** raketa stoupá, klepnutí při rozprsknutí v kruhu = tlaková vlna (push). Občas tři za sebou. Doplní lucernu (NR1).
- **Okraje:** **žádné záblesky víc než 3× za sekundu (WCAG 2.3.1)**, reduced motion jen měkká záře. Zvuk jen doplněk (P11).
- **Pracnost:** data S / logika S / 3D M / UI S / texty S. **Priorita: později.**

#### EV6 — Paprsek majáku / Lighthouse Beam (jen noc, Slunný přístav)
- **Pravidlo:** paprsek majáku se otáčí. Hold, dokud je vlaštovka v paprsku = bez klesání a lucerna se dobíjí. Pustit dřív, než paprsek odejde (pozdě = malé zakolísání).
- **Pracnost:** data S / logika S–M / 3D M (světelný kužel, výkon) / UI S / texty S. **Priorita: později.**

### 5.4 Bonusy, které mění hru

#### BN1 — Přemet / Loop (kapsa, aktivní, od D3)
- **Cíl:** další varianta aktivní schopnosti (06: „variant má být víc“), tentokrát pro šikovnost po perfektu.
- **Pravidlo:** klepnutí 0,3–1,0 s po perfektním zásahu = přemet (0,9 s). Push toho zásahu se zopakuje ×1 (mimo strop E jako `perfectK`, jednou za zásah). Přemet mimo toto okno stojí 1,5 m výšky a nic nedá. Nanejvýš jedna aktivní schopnost v kapsách (08 §5.1).
- **Proč je to zábavné:** navazuje na perfekt, viditelná figura, kousek Corkscrew. Pro Hawka přirozená volba.
- **Vazba:** Z6 (0,3 s po vyhodnocení patří tlačítko události, proto okno začíná až v 0,3 s), 06 (šikovnost středně).
- **Zástupná čísla:** okno 0,3–1,0 s, zopakování ×1, ztráta 1,5 m.
- **Okraje:** s automatikou nejde (nemá perfekty), karta to řekne. Echo + Přemet: Echo opakuje push, Přemet taky, obojí nejvýš jednou za zásah, hlídat strop. Kamera při přemetu nerotuje (kinetóza, P15).
- **Pracnost:** data S / logika M / 3D S (rotace modelu) / UI S / texty S. **Priorita: rozšíření.**

#### BN2 — Předpověď trasy / Route Forecast (uzel stromu, od D2)
- **Cíl:** plánovat hod (model, kapsu) podle toho, co přijde.
- **Pravidlo:** při míření se vedle větru ukážou ikony **prvních dvou událostí** letu a pás husí letky, pokud bude. Je to pravda ze seedu (`attempts+1`), ne odhad.
- **Proč je to zábavné:** rozhodnutí před hodem: „pára a termika, beru Kite“, „klín ve 20 m, hodím strměji“. Dává smysl rychlé volbě Sail (06) a Ladění píšťalky.
- **Okraje:** **přehazování seedu:** zrušený hod z pauzy se nezapočítá (07-menu B2), `attempts` se nezvýší, takže předpověď zůstane stejná. Nelze tedy „přehazovat“, dokud nepřijde dobrá předpověď. Tutoriálový seed 1 je mimo.
- **Pracnost:** data S / logika S / UI M / texty S. **Priorita: rozšíření** (levná, v dávce B).

#### BN3 — Ladění píšťalky / Whistle Tuning (uzel stromu za Whistle, od D3)
- **Pravidlo:** s Whistle klepnutí přivolá poryv, podržení holuba (nebo místní variantu). Okno přivolané události zůstává užší (06 F3 bod 5).
- **Proč:** nástroj na kousky. Hráč si rytmus letu skládá.
- **Okraje:** max 3× za let zůstává. Kolize s Boost taps: Whistle je v kapse, Boost taps mimo události, pravidlo Z6 (doplnit v 3. kole).
- **Pracnost:** data S / logika S / UI S / texty S. **Priorita: rozšíření.**

#### Poznámka k dalším bonusům
- **Boost taps, Autopilot (5 uzlů), Coins, Courier a Night Route** jsou ve 3. kole (06, 13 §6.3). Tady jen v ose. Boost taps jsou hlavní přísada kousku Over the Line.
- **Wingmen** (06: „nanejvýš pozdní bonus“): nápad na později, v noci by šlo o malé vlaštovky, které nesou světlo lucerny. Nenavrhuji teď.

### 5.5 Night Route jako druhé dějství

#### NR1 — Rozsviť město / Light the City
- **Cíl:** ~30 min s novým cílem, který stojí na zvládnutí událostí a bonusů, ne na doletu. Bez resetu výbavy (06: prestige ne).
- **Pravidlo:**
  1. **Odemčení:** uzel Night Route na kartě Encore po finále (06, Atlas §4 bod 7). Cena zástupně ~4 hody příjmu na konci dne, aby nebyl grind.
  2. **Lucerna:** na vlaštovce visí papírová lucerna. Na začátku letu svítí 10 s a ubývá 1 s za sekundu. Zásah +3 s, perfekt +5 s, minutí −2 s (s Packing Tape −1 s), automatika +3 s. Paprsek majáku, lampiony a ohňostroj ji dobíjí. Když dohoří, vlaštovka letí dál, jen už nerozsvěcuje.
  3. **Cíl:** místo se rozsvítí natrvalo, když ho vlaštovka přeletí s rozsvícenou lucernou. Plně vylepšená vlaštovka přeletí celou trasu za ~30 s, takže první místa se rozsvítí hned. Na vzdálená místa je potřeba lucernu udržet celý let. Rozhoduje přesnost, kombinace bonusů a noční uzly.
  4. **Noční uzly za mince:** větší lucerna, pomalejší knot, můry (perfekt přidá můru, která za 2 s přidá +1 s). Mailbag III se tu vrací (01 E1). Night Owl (01 M6) je model pro noc.
  5. **Konec:** všech 16 míst svítí → „Night Mail delivered.“ / „Noční pošta doručena.“, skin K11, razítko R12 Night Mail, souhrn noci. Pak už hra nic dalšího nenabízí, jen volné létání.
- **Proč je to zábavné:** stejné město v novém světle (bible: barva vypráví cestu za sluncem). Cíl přímo staví na tom, co hráč ve dne objevil (kousky a kombo dávají světlo). Každý rozsvícený pás města je viditelný postup.
- **Vazba:** 06 (Night Route dobrovolně, uzlem ve stromě, bez resetu, hra má konec), 08 §8.4, 04 SV21 (konečný okruh), P13 (lucerna je zdroj v jednom letu, ne série).
- **Zástupná čísla:** lucerna 10 s, úbytek 1/s, +3 / +5 / −2 s, cíl 45–65 hodů.
- **Okraje a zneužití:** slabý hráč s automatikou a širšími okny musí dojít (cíl ≤ 100 hodů). Calm Sky (méně událostí) má mít silnější dobití (+6 s), jinak by byl v noci past. Whistle přivolává víc dobíjení, hlídat, aby nebyl jediná volba. Ukazatel lucerny je u vlaštovky, ne v rohu (poučení z RippleLoop), tvarem a číslem, ne jen barvou.
- **Náhled:** karta Encore: „Fly the route after dark. Keep your lantern lit to light the city.“ / „Proleť trasu po setmění. Udrž lucernu, ať se město rozsvítí.“ Atlas má přepínač Day / Night (Atlas §4 bod 7), tmavé pohlednice se rozsvěcují.
- **Pracnost:** data M / logika M (lucerna, rozsvícení, save `p.night`) / 3D **L–XL** (noční osvětlení 16 míst, okna, lampiony, výkon na iPhonu) / UI M / texty M. **Priorita: později.** Závisí na Papírovém městě pro všech 16 míst a na 3. kole.
- **Volba:** cíl noci je BLOCKED 4.

### 5.6 Kosmetika navíc (malé)
| # | Co | Odemkne | Pracnost |
|---|---|---|---|
| R8–R11 | razítka legend: Express, Relay, Wish, Live | legendární kousky 1, 7, 11, 14 | S (ikony) |
| R12 | razítko Night Mail | konec noci | S |
| K11 | skin Night Mail (už v 01) | konec noci | – |

Žádný skin za počet kousků (P13, 01 §1).

---

## 6. Co se mění v dosavadních návrzích

| Dokument | Co se mění | Kdo |
|---|---|---|
| `01-game-design.md` §5 osa 60 min, §6.1 cíle | nahradí osa §3 tohoto dokumentu (den ~87 min). Pravidlo ceny modelů `k × R` platí dál, R se přepočte | game designer (po rozhodnutí BLOCKED 1) |
| `08-navrh-kolo2.md` §10.2 | nová pásma §7 | orchestrátor / balance-analyst |
| `08` §7.2 | holub a poryv mají v D2–D4 i mechanické varianty (EV1, EV2), ne jen texty | – |
| Atlas `01-navrh-atlasu.md` §3.3, §3.6 | rub pohlednice, nitě, zvěsti u postav, nálepky zastávek na trase | product-designer |
| 3. kolo progrese | ceny škálované na den ~87 min, uzly BN2, BN3, noční uzly, Boost taps jako přísada kousků | balance-analyst, game designer |
| Fronta novinek (Atlas §3.4) | priority: finále > karta čtvrti > nový kousek > nové místo > nová událost > zastávka a její položka > rekord > tiché | product-designer |

---

## 7. Cílová pásma pro 08 §10.2 a zadání pro balance-analyst

### 7.1 Definice
- **Objev (kategorie A):** nové místo, zastávka s položkou, první setkání s novou událostí nebo variantou, nový bonus, speciál, kapsa nebo uzel s novým chováním, model k prodeji nebo koupený, nový kousek, nový skin, zvěst.
- **Nákup (B):** úroveň nebo uzel jen s čísly.
- **Tiché (C):** razítko, hláška, vtip, gag, rekord. Do sucha se nepočítají.

### 7.2 Pásma (průměrný hráč SKILLS, realistický nákup, Throw again; varianta B)

| Metrika | Dnes (08 §10.2, 06) | **Nově** |
|---|---|---|
| Hody na čtvrť (medián) | D1 25–35, D2–D4 20–30 | **D1 34–44, D2 36–46, D3 37–47, D4 38–48**; den 150–180 |
| Minuty na čtvrť | D1 12–18, D2 10–16, D3 12–18, D4 14–20; celkem 50–75 | **D1 15–20, D2 18–24, D3 20–26, D4 22–28; den 78–95 (cíl 87)** |
| Night Route | – | **45–65 hodů, 25–35 min**; den + noc 105–130 min (cíl 120) |
| Slabý hráč | 100 % do 250 hodů, ≤ 1,4× | den 100 % do 260 hodů, ≤ 1,35× minut průměrného; noc s automatikou ≤ 100 hodů |
| Expert | ≥ 0,7× (sada „šum ×2“ 0,69 přijato) | den ≥ 0,69×; noc ≥ 0,6× (noc víc odměňuje přesnost, záměr) |
| Délka letu | medián D1 ≤ 22, D2 ≤ 27, D3 ≤ 30, D4 ≤ 35 s; P90 ≤ 45; max ≤ 60 | beze změny; noc medián ≤ 32 s; vír, lampiony a klín hlídat zvlášť |
| **Sucho bez objevu (A)** | – | **medián ≤ 3, P90 ≤ 6, max ≤ 12** (den i noc) |
| Sucho bez nákupu ani objevu | P90 ≤ 8 | **P90 ≤ 5** (strom 3. kola) |
| Mezi místy | medián ≤ 8, P90 ≤ 14 („šum ×2“ ≤ 16) | **medián ≤ 11, P90 ≤ 18** (den) |
| **Mezi zastávkami** (místo nebo orientační bod) | – | **medián ≤ 6, P90 ≤ 10** |
| **Fronta novinek** | – | čekání objevu na ohlášení P90 ≤ 3 hody; nikdy 2 ohlášení v jednom výsledku |
| **Rozmanitost událostí** | – | podíl poryv + holub mezi událostmi: D1 ≤ 80 %, D2 ≤ 65 %, D3 ≤ 50 %, D4 ≤ 45 %; v D3–D4 ≥ 70 % letů má ≥ 3 různé typy událostí |
| **Kousky** | – | 1. kousek do 15. hodu (medián); do finále průměrný najde 40–75 % kousků, na které měl přísady; žádný kousek samovolně ve > 25 % letů; se záměrem každý ≥ 5 % letů; legenda po zvěsti do 15 hodů u ≥ 60 % průměrných |
| Vliv kousků na délku | – | kampaň s kombem z kousků ≤ 3 % kratší než bez nich; expert / průměrný se nezhorší pod 0,69 |
| Varianty událostí | – | Hejno, vír: očekávaný přínos ≥ základní události u každého profilu (06 F3 bod 4) |
| Hody mezi nákupy (13 §6.4) | – | D1 medián ≤ 1, D2–D4 ≤ 2, P90 ≤ 4 |
| Noc | – | rozsvícená místa za hod (křivka), Calm Sky, Whistle a Dive nejsou jediná volba (rozdíl nejlepší a druhé kapsy ≤ 10 %), Mailbag III se v noci vrátí |

### 7.3 Zadání pro balance-analyst (`simulation/progression/`)
Pořadí kroků. Spouštět jen `node simulation/progression/run.mjs ... --out 2h-<jméno>`. **Nespouštět** `npm run simulate`, `simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs`.

1. **Základna „2 h jen zdražením“** (pro rozbor §1.3, má ukázat grind): dnešní obsah, jedno měřítko cen tak, aby den vyšel na ~87 min a celek na ~120 min. Změřit sucho bez objevu, mezi místy, podíl poryvů a holubů. Potvrdí, nebo vyvrátí odhad v §1.3.
2. **Osa obsahu jako data:** `params.mjs` `content.schedule` = seznam položek `{id, cat: 'A'|'B'|'C', trigger: place|landmark|buy|trick|first-event}`. Simulátor zapisuje objevy po hodech. Zastávky = `start + 0,5·šířka` místa. Fronta U3 s prioritami z §6.
3. **Ekonomika na den ~87 min:** s 3. kolem (`M_čtvrť`, strom, Boost taps), pokud už bude v simulátoru, jinak dnešní strom a jedno měřítko cen. Ceny modelů a Mailbagu přes `k × R` (01).
4. **Události:** EV1 (podíl, push, mezera), EV2 (dva výstupy, bot volí podle hranice místa), EV3 (pás, výskyt, bot míří úhlem s pravděpodobností podle profilu), EV4. Ověřit pravidlo „varianta ≥ základní událost“.
5. **Kousky:** detektory nad záznamem letu. Dva boti: **bez záměru** (přirozený výskyt) a **se záměrem** (politika pro každý kousek, např. Whistle při kombu ≥ 2, Over the Line podle hranice). Metriky z §7.2. Pokud simulátor mechaniku (Přemet, Ladění píšťalky) neumí, změnu mechaniky dělá game-dev, ne balance-analyst.
6. **Noc:** kampaň od plné výbavy, lucerna, rozsvícení, noční uzly, profily včetně slabého s automatikou.
7. **Citlivost:** ceny ×0,85 / ×1,15, podíl EV1 0,15 / 0,35, vír 0,2 / 0,4, lucerna start 8 / 12 s a úbytek 0,8 / 1,2, kousky +1 krok komba ano / ne.
8. **Výstup:** tabulka §7.2 s verdikty (CRITICAL / CONCERNS / NOT ASSESSED / HEALTHY), `out/2h-*.{md,json}`.

**Co simulace neověří (jen playtest, P4):** jestli hráči chtějí hrát dál po ~60 min, zvědavost (miniPXI položka Curiosity), jestli si všimnou kousků a zvěstí, jestli noc nepůsobí jako opakování a otázka „Hrál jsi déle, než jsi chtěl?“ (P13).

---

## 8. Pracnost a pořadí dávek

### 8.1 Souhrnná tabulka (doporučené pořadí)

| Pořadí | Položka | Druh | Priorita | Pracnost (data / logika / 3D / UI / texty) | Odhad dní | Závisí na |
|---:|---|---|---|---|---:|---|
| A1 | ZB1 Orientační body | zastávky | **jádro** | S / S / M–L / S / S | 3–6 (3D po čtvrtích) | katalog modelů, Papírové město |
| A2 | Fronta novinek s prioritami a kategoriemi | systém | **jádro** | S / S / – / S / – | 1 | Atlas `pending` |
| A3 | RK1 Řádek rekordů | výsledek | **jádro** | S / S / – / S / S | 1 | – |
| A4 | CU3 Pairs well with | Atlas, Dílna | **jádro** | S / – / – / S / S | 0,5 | – |
| A5 | CU1 Zvěsti postav | texty | **jádro** | S / S / – / S / S | 1 | postavy v Atlasu |
| B1 | TR0 Systém kousků + CU2 rub a nitě | systém | **jádro** | S / M / S / M / S | 4–6 | záznam letu, Atlas |
| B2 | Kousky 1–4, 6, 10–12, 14–16 (z hotového obsahu) | obsah | **jádro** | S / S / – / – / S | 3–4 | B1 |
| B3 | BN2 Předpověď trasy | uzel | rozšíření | S / S / – / M / S | 1–2 | seed, míření |
| C1 | EV1 Hejno + kousek 7 | událost | **jádro** | S / M / M / S / S | 3–4 | `events.js`, simulátor |
| C2 | EV2 Prachový vír | událost | rozšíření | S / M / M / M / S | 3–4 | – |
| C3 | EV3 Husí klín + kousek 9 | událost | rozšíření | S / S–M / M / S / S | 2–3 | EV1 (modely ptáků) |
| C4 | EV4 Lampiony | událost | rozšíření | S / S / M / S / S | 2 | Papírové město D4 |
| C5 | CU4 Zahlédnutí | svět | rozšíření | S / S / M / – / – | 2 | C1–C4 |
| – | **Playtest (brána)** | ověření | – | – | – | A–C |
| D | 3. kolo ekonomiky na den ~87 min | ekonomika | jádro (jinde) | – | (13, 3. kolo) | F5, BLOCKED 1 |
| E1 | BN1 Přemet + kousek 8 | kapsa | rozšíření | S / M / S / S / S | 2–3 | EV2 |
| E2 | BN3 Ladění píšťalky + kousek 16 | uzel | rozšíření | S / S / – / S / S | 1 | Whistle |
| E3 | Kousky 5, 13 | obsah | rozšíření | S / S / – / – / S | 1 | Dive, Cushion, Paper Crane |
| F1 | NR1 Night Route | dějství | později | M / M / L–XL / M / M | 12–18 | Papírové město 16 míst, 3. kolo |
| F2 | EV5 Ohňostroj, EV6 Paprsek | události | později | S / S–M / M / S / S | 4–5 | F1 |
| F3 | Night Owl (01 M6), K11, R8–R12 | model, kosmetika | později | M | 3–4 | F1 |

**Celkem:** jádro (A, B1–B2, C1) ~17–26 dní, rozšíření (B3, C2–C5, E) ~14–19 dní, noc (F) ~19–27 dní. **Dohromady ~50–70 agentodnů** bez ladění a playtestu (NOT ASSESSED, hrubý odhad). Simulace navíc ~5–8 dní balance-analysta.

### 8.2 Proč takové pořadí
1. **A „Zastávky a zvědavost“** je nejlevnější a řeší nejhorší problém (sucho mezi místy). Většina je data a texty. 3D zastávek se staví po čtvrtích spolu s Papírovým městem (D1 první).
2. **B „Kousky“** je jádro odpovědi na zadání a stojí skoro jen na hotovém obsahu (holub, poryv, pára, Echo, hvězda, drony, On Air). Malá 3D práce, hodně zábavy.
3. **C „Svěží události“** řeší okoukání ve střední a pozdní hře. Hejno první, protože sdílí model holuba.
4. **Brána: playtest** (KB 09 §4.1, skill `playtest`). Otázka: chtějí hráči po ~60 min dál a proč? Rozhodnutí 06 RippleLoop bod 7 („prodloužení na ~2 h až po playtestu“) tím platí dál. Pokud ne, zastavit u dne ~90 min (varianta D) a noc nestavět.
5. **D 3. kolo** nastaví ceny podle hustoty obsahu, ne naopak.
6. **E „Styl“** přidá hloubku pro šikovné.
7. **F „Noc“** jako poslední, protože je nejdražší a potřebuje celé Papírové město.

---

## 9. Otevřené volby

BLOCKED: **Jak poskládat dvě hodiny?** (A) celé 2 h ve dne na 16 místech, noc navíc jako bonus; (B) den ~1,5 h (do „Delivered.“) a pak Night Route ~30 min jako dobrovolné druhé dějství, které se otevře uzlem ve stromě (příklad: po finále koupíš „Night Route“ a letíš stejné město v noci s lucernou); (C) přidat pátou čtvrť a den natáhnout na 2 h; (D) zůstat u ~1,5 h bez noci. **Doporučení: (B).** Den nebude roztahaný (~10 hodů na místo), noc dá nový pohled na stejné město za cenu osvětlení místo nových modelů a hra má hotový konec už po 1,5 h pro toho, kdo chce skončit.

BLOCKED: **Jak moc napovídat kousky?** (a) vůbec, hra je pojmenuje až po provedení; (b) **zvěst postavy a tužková skica na rubu pohlednice jen u 4 legendárních kousků**, ostatní jen řádkem „Pairs well with: Echo“ (příklad: Marge řekne „Drž, pusť, drž, říkalo se“, a ty víš, že s hejnem jde něco udělat); (c) v Atlasu seznam všech kousků s podmínkami. **Doporučení: (b).** (c) by byl seznam úkolů, blízko zamítnutým výzvám (B16, SV13).

BLOCKED: **Co hráč dostane za kousek?** (a) jen jméno, zápis na rub pohlednice a nit (legendy navíc razítko); (b) totéž a každé další provedení kousku přidá +1 krok komba, takže se ho vyplatí dělat znovu (kombo zvedá i mince, jak jsi schválil u RippleLoop); (c) navíc mince za první provedení. **Doporučení: (b).** (c) by udělal z kousků úkoly za odměnu a přidal druhý zdroj mincí (08 §9 ho zamítlo).

BLOCKED: **Jaký cíl má noc?** (Platí, pokud se noc staví.) (a) **rozsvítit město:** místo se rozsvítí, když ho přeletíš s rozsvícenou lucernou, a lucernu udržuješ zásahy (příklad: perfektní holub přidá 5 s světla, minutí ubere 2 s); (b) stejná trasa v noci na dolet s jinými událostmi: plně vylepšená vlaštovka by ji přeletěla za pár hodů, takže by se musela oslabit, a to je skrytý reset; (c) jen volné létání v noci s rekordy, bez cíle. **Doporučení: (a).** Je to nový cíl postavený na tom, co hráč ve dne objevil, a má jasný konec.
