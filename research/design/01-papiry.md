> **ZASTARALÉ (15. 10. 2026):** komiksový vzhled papírů (3D komiksové město) a Neon Foil; platí `research/design/05-styl-papir.md` kap. 17 (papíry pro Papírové město, stříbrná fólie místo Neon Foil, světlý Kraft) a rozhodnutí 06 (14. 10., „Odemykatelný obsah“ bod 8). Pořadí a role papírů Copy → Kraft → Washi → fólie platí. Nečíst jako zadání vzhledu.

# Design: čtyři druhy papíru (Copy → Kraft → Washi → Neon Foil)

Autor: product-designer, 14. 10. 2026. Stav: **návrh k odsouhlasení**. Prototyp: `archiv/prototype-papers.html` + `archiv/prototype/papers/` (spuštění `npm start`, http://127.0.0.1:4173/prototype-papers.html, pro automat `?timer`).

Vychází z: `research/bonusy/08-navrh-kolo2.md` (W2 Paper, §8.2, §8.5), `research/bonusy/06-rozhodnuti.md` (14. 10.: další druh se otevře doletem na 3. místo čtvrti; 3D komiksové město; čísla mají být vidět; bez nutkavých prvků), `research/svet/01-zivy-svet.md` §2 (cesta za sluncem, palety a barva stopy podle čtvrti), KB P1, P2, P3, P7, P11, P13, P15, bloky 05 §4, 07 N1/N8, 08 N1.

**Čísla (rychlosti, ceny, dolety) jsou zástupná.** Ladí je `simulation/progression/`. Prototyp počítá náhled jen ilustračně (`papers.js` → `speedAt`, `preview`).

---

## 0. Shrnutí

1. **Jedno pravidlo, které drží celý systém pohromadě: barvu stopy dává čtvrť, tvar dává papír.** Čtvrť dál mění barvu stopy (svet §2.2: růžová, azurová, zlatá, magenta; 08 §8.2). Papír mění *materiál vlaštovky, vzor, obrys, tvar stopy, tvar částic a kresbu rychlostních čar*. Oba signály se tak nepřou a hráč z jednoho pohledu pozná „kde jsem“ i „z čeho letím“.
2. **Každý papír se liší i bez barvy** (vzor, tloušťka a počet obrysů, tvar stopy, tvar částic, ikona v UI). Ověřeno přepínačem „Kontrola bez barev“ v prototypu.
3. **Rozdíl je cítit:** jiná pružina protažení po hodu (lehký třepot / pevný / měkký / ostrý s odleskem), jiná kresba rychlostních čar. Počet čar dál řídí rychlost (`fx-map.speedLines`), papír mění jen kresbu.
4. **Odemčení je klidné:** karta ve výsledku po letu, který poprvé dosáhl 3. místa čtvrti, s novým papírem na vlaštovce v detailu. V Dílně náhled „teď → po koupi“ a po koupi „přeložení“ vlaštovky do nového papíru (0,75 s). Žádný odpočet, puntík ani tlak.

## 1. Přehled papírů

Odemčení podle 06 (14. 10.): Kraft na **Gardens at the Edge** (3. místo Violet Suburbs), Washi na **Bridge over the Bay** (3. místo Moon Docks), Neon Foil na **Mountain Saddle** (3. místo Red Horizon). Papír proto ladím ke čtvrti, ve které se otevře, ale musí fungovat i ve všech dalších.

| | **Copy Paper** (úr. 1–3) | **Kraft Paper** (4–6) | **Washi** (7–9) | **Neon Foil** (10–12) |
|---|---|---|---|---|
| Otevře se | od začátku | Gardens at the Edge | Bridge over the Bay | Mountain Saddle |
| Ladí s | fialovým soumrakem: bílá svítí proti levanduli | soumrak a zahrady: teplá hnědá jako doplněk k fialové | měsíční noc nad zálivem: krémový papír prosvítá jako lampion, vlny seigaiha = záliv | druhý západ slunce a příchod do Neon Core: fólie odráží západ i neony |
| Toon tóny (světlo / střed / stín) | `#ffffff` / `#dcdcf4` / `#958dc8` | `#e6b077` / `#c08550` / `#74463a` | `#fbe8cc` / `#e8cba6` / `#a98f8c` | podklad `#ffffff` / `#d8d4ff` / `#6a4fa0`, přes něj 4 pruhy fólie |
| Vzor | modré kancelářské linky po délce + červená okrajová linka u ocasu | krátká vlákna ve 2 tónech, **airmail lem** (červeno-modré šipky) na odtokové hraně, poštovní razítko | **seigaiha** (vlnky) jemně indigem + dlouhá vlákna kozo | jemné šikmé rýhy hologramu, třpytivé body; barva z úhlu pohledu |
| Zvláštnost materiálu | nic, čistý komiks | hrubší, sytější tón | slabá vnitřní záře (`glow .1`) | duha posterizovaná na 4 pruhy `#ff4f9e` `#ffe14d` `#4a22c8` `#5cf2ff` podle úhlu pohledu, tvrdý bílý odlesk |
| Obrys | inkoust `#15101f`, 2,2 px | tmavě hnědý `#2a160e`, **2,9 px** (pevný papír) | indigo `#2b2a55`, **2,0 px** (jemný) | inkoust 2,2 px **+ druhý magentový obrys 4,6 px** (neonová nálepka) |
| Přehyby | modrá plná čára | **čárkovaná** hnědá (steh) | bílá jemná | bílá |
| Stopa (tvar) | 1 páska, 0,34 m | **provázek**: 2 tenké pásky se kroutí kolem sebe | **měkká**: široký průsvitný pás + užší jádro | **kometa**: zužující se pás s duhovými úseky + bílé jádro |
| Částice | čtverečky papíru (vločky) | vlákna (čárky) | lístky, pomalu stoupají | 4cípé hvězdičky, mihotají |
| Rychlostní čáry | tenké rovné „linky“, každá 4. modrá | tlusté s **čárkovaným** světlým středem (steh) | málo, **štětcové** zúžené tahy | **rozdvojené** azurová + magenta (chromatický posun) |
| Pružina po hodu (`motion.wobble`) | tuhost 320, tlumení 11, protažení 1,22: lehký třepot | 260 / 22 / 1,14: pevný, skoro bez dokmitu | 140 / 13 / 1,10: měkký, pomalý | 420 / 18 / 1,18: ostrý + záblesk odlesku na vlaštovce |
| Korunka (3. úroveň druhu) | **Ruled contrails**: dvě modré linky z konců křídel (viz §6 ot. 1) | **Sea spray**: kapky tříště za ocasem (08 W2) | **Paper lantern**: vlaštovka svítí zevnitř, teplá aura (08 W2) | **Neon comet**: delší kometa a tiché „pop“ hvězdiček při průletu místem (08 W2) |
| Ikona v UI | list s linkami | balík s provázkem | vlnky | čtyřcípá hvězda |

Data a vzory jsou v `archiv/prototype/papers/papers.js` (`PAPERS`, `paintPattern`), shader v `archiv/prototype/papers/main.js`.

## 2. Vzhled na 3D vlaštovce (toon)

- **Tóny natvrdo, ne násobením.** Každý papír má vlastní 3 tóny rampy (světlo / střed / stín). Stín Copy míří do levandule (soumrak), Kraft do čokoládové, Washi do šedorůžové. Půltónové tečky jen v nejtmavším pásu (jako `toon.postPass`, ale v materiálu, aby šly i bez post-procesu).
- **Světlo čtvrti:** tón se lehce tónuje barvou hlavního světla čtvrti (svet §2.2: `#ffb38a`, `#cfe3ff`, `#ff8a3d`, `#5cf2ff`), obrysová hrana (rim) barvou doplňku čtvrti. Papír tak „sedí“ ve scéně, ale zůstane poznat.
- **UV vlaštovky:** `planeShape` uv nemá. Prototyp je dopočítá z pozice (u = délka od ocasu k nosu, v = rozpětí, kýl podle výšky). Pro hru doporučuji uv přidat přímo do `geometry.planeShape` (vlastník R1).
- **Vzory jsou hrubé schválně:** na mobilu je vlaštovka ~30–60 px. Vzor má fungovat zblízka (Dílna, výsledek) a zdálky se má slít do průměrného tónu (mipmapy). Rozpoznání za letu proto nesou **tón, obrys a stopa**, ne vzor (§4).
- **Foil je jediný papír, který se mění pohybem** (barva podle úhlu pohledu). Při omezeném pohybu se nemění v čase, jen podle natočení vlaštovky.

## 3. Rozdíl má být cítit

**Pocit z hodu (KB 05 §4.2):** ve snímku vypuštění protažení vlaštovky a odhoz kamery (1,6 m, rychlý útlum), pak pružina podle papíru (tabulka §1). Efekt vypuštění zůstává **menší** než efekt perfektního QTE a dopadu (P1, P2). U Foil krátký bílý záblesk **na vlaštovce** (lokálně, ne přes obrazovku, ≤ 1×/hod, 05 §4.4).

**Rychlost:** Paper je žebřík rychlosti (08 W2), takže nejsilnější pocit dává sama rychlost: město ubíhá rychleji a přibývá rychlostních čar (`fx-map.speedLineCount`: pod 40 m/s žádné, pak 6–24). Papír mění **jen kresbu** čar (§1), ne jejich počet ani práh, aby čáry dál poctivě ukazovaly rychlost (P7). Washi má čar méně (×0,6), protože jeho tahy jsou širší.

**Zvuk (jen poznámka pro hudební plán, `research/hudba/01-vyzkum-a-plan.md`):** šustnutí při hodu a barva větru podle papíru. Copy suché vysoké „fsst“, tenký vítr. Kraft nižší papírové „thup“, plnější šum. Washi měkké vydechnuté „whff“, nad vodou tichý zvonivý alikvot. Foil kovové zachřestění a třpyt, u korunky tiché „pop“ při průletu místem. Zvuk nesmí nést jedinou informaci (P11): každý zvuk má vizuální protějšek výše.

## 4. Čitelnost za vysoké rychlosti a na mobilu

Kontrast výplně proti obloze (WCAG poměr, střední tón papíru proti hornímu / spodnímu pásu oblohy čtvrti):

| | Suburbs | Docks | Horizon | Core |
|---|---|---|---|---|
| Copy | 5,5 / 1,4 | 6,3 / 2,6 | 2,7 / 1,2 | 7,5 / 2,1 |
| Kraft | 2,4 / 1,6 | 2,7 / 1,1 | 1,1 / 2,0 | 3,2 / 1,1 |
| Washi | 4,8 / 1,2 | 5,5 / 2,2 | 2,3 / 1,0 | 6,5 / 1,9 |
| Foil (žlutý pruh / fialový) | 5,7 / 1,5 · 1,2 / 4,6 | 6,6 / 2,6 · 1,0 / 2,6 | 2,8 / 1,2 · 2,5 / 5,6 | 7,7 / 2,2 · 1,1 / 3,1 |

Závěr: proti světlému obzoru (růžový soumrak, zlatý západ) má **každý** papír výplň pod 1,5 : 1. Čitelnost proto nese **inkoustový obrys** (proti světlému obzoru 9,7–11,7 : 1) a stopa. Pravidla:
- **Obrys nejméně 2 px na všech papírech a kvalitách** (dnes `comicLook` při nízké kvalitě 1,6, pro vlaštovku držet ≥ 2). Washi proto 2,0 místo původně zamýšlených 1,6.
- **Kraft je nejtmavší papír a v Docks a Core splývá s tmavou oblohou** (1,1). Světlé vzory ho zdálky nezachrání (slijí se do tónu). Drží ho tlustší obrys a světlejší rim čtvrti. Pokud playtest ukáže problém, zesvětlit střední tón Kraftu (`#c08550` → `#cc935e`).
- **Stopa je hlavní ukazatel polohy na mobilu.** Šířka stopy v px nesmí klesnout pod ~2 CSS px ani v oddálené kameře (konec trasy, 08 §2.5). Doporučení pro hru: šířku stopy škálovat podle zoomu kamery.
- Velikost vlaštovky jako ve hře lze v prototypu zapnout („Velikost jako ve hře“) a posoudit čitelnost všech papírů na všech čtvrtích.

## 5. Odemčení a výměna papíru

### 5.1 Tok
1. **Za letu:** nic navíc. Let doletí na 3. místo čtvrti normálně (název místa jako u každého místa). Max. jedna novinka za hod (08 §8.5 U3), a novinkou tohoto hodu je samo nové místo.
2. **Výsledek po letu (poprvé):** pod výsledkem jedna karta. Vlaštovka v detailu (záběr Dílny) už je v novém papíru a pomalu se otáčí, popisek „Preview: Kraft Paper, not bought yet“. Karta má dvě rovnocenná tlačítka. „Throw again“ je stejně výrazné jako cesta do Dílny (06: Throw again přímo z výsledku). Hráč, který chce házet, není nucen nic kupovat.
3. **Dílna:** dlaždice papíru se ze siluety („Unknown paper · Opens at Gardens at the Edge“) změní na vzorek se jménem. **Bez puntíku a bez animace upozornění** (P13). Stav „Ready to fold“ jen u druhu, který je opravdu na řadě. Pozdější otevřené druhy mají „After Kraft Paper“.
4. **Náhled koupě (hodnota teď → po koupi, U1):** Speed `38 → 41 m/s`, Last throw `640 m → ≈ 691 m` (+ „past <place>“, když náhled přeletí další místo), Airtime `same` (papír nemění dobu letu, 08 W2). U 3. úrovně druhu i řádek s korunkou. Když mince chybí, tlačítko ukáže cíl „Kraft Paper 4 · 210 ◈ to go“ (E09), bez odhadu hodů.
5. **Koupě prvního stupně nového druhu = výměna:** vlaštovka v Dílně se „přeloží“: nový papír přejede od nosu k ocasu po bílé čáře přehybu (0,75 s, ease-out). Potom zpráva „Folded in Kraft Paper.“ a odkaz „Undo last purchase“ (08 Pravidla Dílny). Další úrovně téhož druhu vzhled nemění, jen zpráva „Upgraded to Kraft Paper 5.“. 3. úroveň přidá korunku („Upgraded to Kraft Paper 6. Sea spray added.“).
6. **Další hod:** nový papír je vidět hned při míření i za letu (08 §8.2 bod 3).

### 5.2 Herní texty (anglicky)
| Kde | Text |
|---|---|
| Hlavička větve | **Paper** · „Faster paper, same airtime.“ |
| Zamčená dlaždice | „Unknown paper“ / „Opens at {place}“ |
| Stav dlaždice | „Ready to fold“ · „Level {n} of 3“ · „All 3 levels“ · „After {previous paper}“ |
| Karta ve výsledku | **{Paper}** / „New in the Workshop. {line}“ / tlačítka „Open Workshop“, „Throw again“ |
| Popisky papírů (line) | Copy: „Plain office paper. Light and quick to fold.“ · Kraft: „Parcel paper. Sturdy fibres, an airmail edge.“ · Washi: „Long fibres, light shines through. Glows a little at night.“ · Foil: „Holographic foil. Throws the city lights back.“ |
| Náhled | „Speed“, „Last throw“, „Airtime: same“, „past {place}“, „Level 3: {crown}“ |
| Tlačítko | „Fold in {Paper} · {price} ◈“ (1. úroveň druhu) · „Upgrade to {Paper} {n} · {price} ◈“ · „{Paper} {n} · {missing} ◈ to go“ (nedostatek mincí) |
| Po koupi | „Folded in {Paper}.“ · „Upgraded to {Paper} {n}.“ · „… {crown} added.“ · „Undo last purchase“ → „Purchase undone.“ |
| Konec žebříku | „Every paper folded. The Workshop is yours.“ |
| Detail v Dílně | „Preview: {Paper}, not bought yet“ · „{Paper}, level {n} of 3“ |

### 5.3 Co záměrně chybí (P13)
Žádný odpočet, „limited“, pulzující tlačítko koupě, červený puntík ani počítadlo novinek. Karta odemčení se ukáže jednou. Zamčený druh je silueta s místem, kde se otevře (blízký cíl a zvědavost, P3, P6, 08 N1), ne seznam úkolů.

## 6. Přístupnost

- **Omezený pohyb** (`prefers-reduced-motion` + přepínač v nastavení): bez protažení, odhozu kamery a záblesku, bez rychlostních čar (jako `fx-map`), bez částic, vzdálená řada města stojí, Foil nemění barvu v čase, otáčení v Dílně se zastaví ve 3/4 pohledu, výměna papíru je okamžitá (zpráva „Folded in…“ zůstává). Stopa zůstává (statická informace o dráze). Zpětná vazba tedy zůstane, zmizí jen pohyb.
- **Rozlišení bez barvy:** vzor (linky / vlákna a airmail / vlnky / rýhy), obrys (normální / tlustý / tenký / dvojitý), přehyby (plná / čárkovaná), tvar stopy (linka / provázek / měkký pás / kometa), tvar částic, ikona a jméno v UI. Foil střídá světlé a tmavé pruhy, aby se lišil jasem, ne jen barvou. Kontrola v prototypu: „Kontrola bez barev (šedá)“.
- **Ovládání:** dlaždice papírů jsou tlačítka (klávesnice, viditelný focus, cíl ≥ 44 px), stav úrovní má textovou alternativu („Level 1 of 3“) vedle teček.
- **Kontrast UI:** texty Dílny na `#151034` (muted `#b9b3e0` ≈ 9 : 1, zlatá `#ffd27a` ≈ 12 : 1).

## 7. Poznámky k implementaci (pro game-dev, nic z toho prototyp v `src/` nemění)

- **`palette.js` (R2):** přidat `papers` (tóny, obrys, přehyby, stopa, částice, styl čar, pružina) a barvu stopy podle čtvrti (`trail` dnes jen 2 barvy kyber). Data jsou v `archiv/prototype/papers/papers.js` připravená k přenesení.
- **`plane.js` (R1):** materiál vlaštovky z `MeshToonMaterial` na vlastní shader (`archiv/prototype/papers/main.js` → `VS/FS`): 3 tóny, vzor, půltón ve stínu, foil, glow, `clipLo/clipHi/edge` pro výměnu. Druhý obrys pro Foil. Stopa podle `papers[i].trail.ribbons` (víc pásků, kroucení, zúžení, duhové úseky). `setModel` rozšířit na `setPaper`.
- **`fx-map.js` / `ui-layer.js`:** `speedLines` beze změny, styl kresby předat z palety papíru. Částice z `juice.js` dostanou druh podle papíru (dnes 0–3 prach/jiskry).
- **`workshop.js` (R3):** vlaštovka v ruce dítěte ve stejném materiálu, výměna „přeložením“ v Dílně.
- **Výkon:** prototyp ~1 ms CPU/snímek (desktop, 4 výřezy). Na iPhonu neměřeno (NOT ASSESSED).

## 8. Otevřené otázky (pro uživatele)

1. **Korunka Copy Paper:** 08 W2 má „rychlostní čáry“, jenže ty už dnes ukazuje každý rychlý let (`fx-map`). Navrhuji místo nich „Ruled contrails“ (dvě modré linky z konců křídel). Souhlas?
2. **Airmail lem a razítko na Kraftu:** odkazuje na doručení zásilky (finále „Delivered.“). Ponechat, nebo je to příliš „pošta“ pro papírovou vlaštovku?
3. **Washi vzor vlny (seigaiha):** japonský motiv vln k zálivu. Ponechat, nebo neutrální vlákna bez vzoru?
4. **Výměna papíru:** jen v Dílně po koupi (návrh), nebo i krátké „přeložení“ na startu dalšího hodu?
