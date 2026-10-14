# Odemykatelný obsah: modely, skiny a co dál (game design)

**Založeno 14. 10. 2026** (game designer). Odpověď na zadání uživatele: „rozšířit naší dílnu o další vlaštovky které budou zamčené a půjdou odemknout za mince. A zároveň by to chtělo vymyslet další kontent ve hře aby ve hře bylo dostatek odemykatelnýho kontentu a různé skiny vlaštovek které by byly odemykatelné za progress ve hře.“

**Souběžně:** UX Dílny řeší product-designer, vzhled skinů a modelů art-director, ekonomiku balance-analyst. Tento dokument dává **pravidla, identitu a pořadí**. Čísla jsou zástupná, vzhled a obrazovky jen naznačené.

**Podklady:** `06-rozhodnuti.md` (přednost), `08-navrh-kolo2.md` (Dílna W1–W3, Atlas A01–A16, kapsy S1–S6, události §7), `04-svet-cile-sbirky.md` (SV14–SV16), `07-review.md` (verdikty SV14–SV16, E19), `01-vylepseni-dilna.md` (D08 Sokol, D09 Albatros, D11 Střela), `research/atlas/01-navrh-atlasu.md`, `research/design/07-menu.md`, `01-papiry.md`, `05-styl-papir.md`, `simulation/progression/params.mjs` a výstup `out/f5-start-skills.md` (časová osa), KB P1–P15.

**Herní texty** jsou anglicky s českým ekvivalentem pro i18n (EN / CS), návrh je česky.

---

## 0. Shrnutí

1. **Pět nových modelů za mince** (Dart a Glider zůstávají): **Hawk** (perfekty a kombo), **Kite** (výška z událostí), **Skimmer** (nízký let a konec letu), **Sail** (vítr), **Needle** (krátké rychlé lety). Každý je postavený na jedné ose, kde je nejlepší, a jinde je horší. Žádný model není „lepší Dart“.
2. **Model se odemyká dvojím klíčem:** objeví se doletem na své místo (Atlas, silueta je vidět předem) a koupí se za mince. Cena je zhruba 4–5 hodů příjmu v době odemčení, takže koupě je volba stylu, ne zeď.
3. **Před koupí hráč model vyzkouší očima:** v Dílně se jeho oblouk přehraje nad obloukem posledního hodu (stejný úhel a síla), s čísly Speed / Airtime a jednou větou „Loves: tailwind“. Volitelně jeden zkušební hod zdarma.
4. **Skin = potisk na papíře, ne jiný papír.** Druh papíru (Copy → Kraft → Washi → Neon Foil) dál určuje materiál, obrys a tvar stopy, protože nese rychlost (W2). Skin je kresba grafitem a jedna drobnost (stuha, razítko) přes papír. Tím se pravidlo „barvu stopy dává čtvrť, tvar dává papír“ (01-papiry) nerozbije.
5. **Skiny za postup, ne za grind:** 4 suvenýry čtvrtí (s postavou čtvrti), 1 za finále, 5 „podpisových“ za první předvedení triku každého nového modelu. Navíc **razítka** (malá nálepka na křídle) za první perfekt každého typu události. Bez počitadel „7/12“, bez upozornění na chybějící kusy.
6. **Další obsah navíc k Atlasu:** **Polička suvenýrů** v okně Dílny (živá scéna hlavního menu), **Rádio** (výběr hudby čtvrti v menu, až bude hudba ve hře) a obsah po finále pro Night Route (noční model a skin, později).
7. **Křivka:** Atlas dává věc na každém místě, nové věci z tohoto návrhu padají hlavně do **dlouhé D2** (dnes 30 hodů / 16 min) a do přestávek mezi místy. Pravidlo „jedna novinka za hod“ (U3) platí i pro ně.

Otevřené volby jsou v §7 jako `BLOCKED:`.

---

## 1. Pravidla, která platí pro všechno níže

- **Rozhodnutí 06 mají přednost.** Zvlášť: „Příběh a sběratelství: ne. Stačí Atlas“ (13. 10.), SV14 (šuplík vzorů) a E19 (vzory za mince) byly v 08 vyřazené („vzhled nese druh papíru“). **Nové zadání uživatele skiny výslovně chce**, takže je vracím, ale v podobě, která není sbírka navíc: skin je **památka na čin nebo místo** a sedí u něj v Atlasu, žádný katalog s procenty (viz §7, BLOCKED 1).
- **Volitelné výzvy nejsou žádoucí, pokud nebaví samy** (06, B16, SV13). Proto žádný skin za umělou podmínku („doleť 500 m bez QTE“). Odemyká to, co se v běžné hře stane samo: příchod do čtvrti, finále, první perfekt, první předvedení triku modelu, který si hráč koupil.
- **Etika (P13, KB 02 §4.3):** nic nevyprší, nic není limitované, žádná náhoda za mince, žádný odpočet, žádná tečka na Dílně kvůli možnosti koupě (07-menu §2.1). Model ani skin se nekupují za skutečné peníze.
- **Jedna měna** ◈. Modely jsou jediná nová položka za mince. Skiny a razítka se za mince **nekupují** (kosmetika za výkon, ne za grind).
- **Jedna novinka za hod (U3)** platí pro modely, skiny i razítka. Když se jich sejde víc, další se ohlásí po dalším hodu. Razítka se hlásí nejtišeji (jeden řádek ve výsledku).
- **Sdílený strom:** všechna vylepšení Dílny a Atlasu platí pro všechny modely (rozhodnutí 0.6, `core.js`). Modely se neliší výbavou, jen chováním.
- **Model se mění zdarma mezi hody** (jako kapsy). Poslední koupi modelu lze vrátit do dalšího hodu (pravidlo Dílny z 08).

---

## 2. Nové modely vlaštovek (za mince)

### 2.1 Mapa modelů: každý má svou osu

Dnešní čísla: Dart `speed 20, glide 3.2, cruise 11, ideal 18°, qte 1`, Glider (přeladěný v 08/F5) `14, 4.0, 11, 30°, 1.15`. Všechna čísla níže jsou **zástupná** a ladí je balance-analyst. Nové pole = nové pravidlo v modelu letu (§2.9).

| Model | Osa (kde je nejlepší) | Oblouk / úhel | Doba letu | Události | Typ hráče | Místo odemčení |
|---|---|---|---|---|---|---|
| **Dart** (od začátku) | univerzál, rychlé hody | plochý, 18° | krátká | běžné | každý, nováček | – |
| **Glider** (Atlas A01, zdarma) | delší lety, víc událostí | vysoký, 30° | delší | o něco silnější | klidný hráč | 100 m |
| **Hawk** | perfekty a kombo | strmý, 34° | střední | perfekt silný, minutí bolí | šikovný v QTE | 4 Railway to the River |
| **Kite** | výška z událostí | velmi strmý, 40° | dlouhá | svislá část silná, vodorovná slabá | rád „plave“, termiky | 6 Crane Forest |
| **Skimmer** | nízký let, konec letu | velmi plochý, 10° | krátká, dlouhý konec | méně událostí (nízko nezačínají) | rád dotahuje dopad, Cushion | 8 Lighthouse at the Pier's End |
| **Sail** | vítr | střední, 26° | střední | slabší | taktik, čte vítr před hodem | 10 Wind Ridge |
| **Needle** | krátké a rychlé lety | velmi plochý, 12° | nejkratší | dron ho vystřelí dopředu | chce rychlé hody, málo klepání | 14 Sky Terraces |
| *(později)* **Night Owl** | Night Route | – | – | – | po dohrání | Night Route |

Proč tahle místa: každý model přijde **po nebo spolu s** bonusem Atlasu, se kterým hraje nejlépe (Hawk po Crowd Chain na 2, Kite spolu s Crane Lift na 6, Skimmer po Stone Skip na 7, Sail po Pinwheel, ve „Wind Ridge“ spolu s Thermal, Needle po Ad Drone na 13). Odemčený model je cíl na mince, ne okamžitá věc, takže se s bonusem místa nepere: ohlásí se řádkem a koupí se, až na něj hráč našetří. Nový model tak hned ukáže nový způsob, jak využít to, co hráč právě našel. Místa 3, 7 a 11 (nový papír) a 1, 5, 9, 13 (karta čtvrti) jsou záměrně volná, aby se novinky nehromadily. Dvě nové věci v D2, protože D2 je nejdelší čtvrť (§5).

### 2.2 Karta M1 — Hawk (Sokol)
- **Cíl:** dát šikovnému hráči model, kde se perfekty a kombo vyplatí víc, než kolik stojí minutí.
- **Pravidlo:** `speed 17, glide 3.0, cruise 11, ideal 34°, qte 1.0`, nové pole `perfectK 1.6` (perfekt dá push ×1,6 místo ×1,25) a `missK 0.06` (minutí sebere 6 % vodorovné rychlosti, vlaštovka viditelně zakolísá). Pasivně (bez událostí) letí asi o 8 % kratší než Dart.
- **Proč je to zábavné:** perfekt je s Hawkem cítit a slyšet, kombo s Crowd Chain roste rychleji. Šikovnost je znát, aniž by slabší hráč přišel o cokoli, protože Dart a Glider zůstávají (06: šikovnost středně, P7 přičitatelnost).
- **Typ hráče, čtvrť:** expert a „sběratel komba“. Nejlíp v D1–D2, kde je událostí hodně a hráč se je učí. S kapsou **Sharp Edge** nebo **Whistle** tvoří čistý styl „risk za odměnu“.
- **Odemčení:** místo 4 Railway to the River. Cena **400 ◈** (≈ 4 hody příjmu v té fázi).
- **Okraje a zneužití:** s automatikou QTE (Atlas) Hawk nikdy nedá perfekt (06: automatika jen běžný zásah), takže je pro „auto“ hráče horší. Náhled to musí říct pravdivě („Auto-hits don't count as perfect“). S Echem a Gull Escort se push násobí: **koš E (strop 2,0) platí i pro `perfectK`**, aby se nevytvořil únik ze stropu.
- **Náhled:** oblouk je kratší než u Dartu, vedle něj věta „Perfect hits push much harder. Misses cost speed.“ a odhad z hráčových dat: „Your last 10 throws: 4 perfects → ≈ +6 %“ (D16 / U1).
- **Vychází z:** D08 Sokol (vráceno po MC, jak 08 §9 navrhl).
- **Pracnost:** data S, logika S (`perfectK`, `missK` v `resolve`), 3D model M (ostrá silueta s dlouhými úzkými křídly), UI S, texty S.

### 2.3 Karta M2 — Kite (Drak)
- **Cíl:** model, který staví na výšce. Hráč „chytá“ události kvůli stoupání, ne kvůli rychlosti.
- **Pravidlo:** `speed 12, glide 4.6, cruise 8, ideal 40°, qte 1.1`, nové pole `liftK 1.6` (svislá část událostí ×1,6: poryv, pára, termika) a `pushK 0.6` (vodorovný push ×0,6). Startuje hodně strmě, nad městem visí déle a pomaleji.
- **Proč je to zábavné:** jiný obraz letu (vysoko nad střechami, vidí víc města), termika v D3 s ním je „vrchol“ letu. Volba pro hráče, kterého baví klidný let a výhled (P14).
- **Typ hráče, čtvrť:** klidný hráč, nejlíp s **Crane Lift** (výška startu, místo 6) a **Thermal** (místo 10). Kombinace s Calm Sky dává „vyhlídkový“ let.
- **Odemčení:** místo 6 Crane Forest. Cena **700 ◈**.
- **Okraje a zneužití:** **riziko délky letu.** Výška = doba ve vzduchu a 06 chce krátké lety. Kite proto platí nízkou rychlostí (`cruise 8`): dolet podobný Glideru, ale let delší. Simulace musí potvrdit, že medián letu Kite je nejvýš o 15 % delší než Glider a žádný let > 60 s. Když ne, snížit `liftK`, ne zvyšovat rychlost. Zrychlení klouzání (Z2) mu pomáhá, při reduced motion je vypnuté, tam bude let znatelně delší: náhled musí ukázat airtime.
- **Náhled:** nejvyšší oblouk v Dílně, číslo Airtime výrazně vyšší, věta „Rides every updraft. Slow, high, scenic.“
- **Vychází z:** D09 Albatros (role „klidný plachtař“), přestavěno na svislé události, aby to nebyl jen „víc glide“.
- **Pracnost:** data S, logika S (`liftK`, `pushK` v `resolve`), 3D M (široká křídla, krátké tělo), UI S, texty S.

### 2.4 Karta M3 — Skimmer (Žabka)
- **Cíl:** model pro konec letu. Letí nízko nad střechami a vodou a dopad umí natáhnout.
- **Pravidlo:** `speed 21, glide 2.8, cruise 12, ideal 10°, qte 0.9`, nové pole `ground {below 6 m, glide ×1.7}` (přízemní efekt: pod 6 m klesá pomaleji) a `skip +1` (Stone Skip má s ním o jeden odraz víc). Protože pod 8 m události nezačínají (Z6 bod 4), Skimmer jich zažije **méně**.
- **Proč je to zábavné:** úplně jiný let, nízký průlet nad městem, voda v D2 a odrazy. Dává smysl kapsám **Cushion** a **Dive** (Low Pass) a bonusu **Packing Tape**: hráč, který rád „dotahuje“ dopad, dostane celý styl na tom postavený.
- **Typ hráče, čtvrť:** hráč, kterého baví konec letu a málo klepání. Nejlíp v D2 (Bridge, Lighthouse, voda).
- **Odemčení:** místo 8 Lighthouse at the Pier's End (po Stone Skip na 7). Cena **1 000 ◈**.
- **Okraje a zneužití:** přízemní efekt + Cushion (klesání 0 na 1,6 s) + odrazy nesmí dát „nekonečné klouzání“. Pravidla: přízemní efekt jen násobí klouzavost (nevypíná klesání), Cushion a odraz 1× za let jako dnes. Simulace hlídá nejdelší let a podíl doletu získaný pod 6 m. Kolize se zemí: Skimmer startuje nízko, první hody s ním můžou skončit brzy, náhled to musí ukázat pravdivě.
- **Náhled:** nejplošší oblouk s dlouhým „ocasem“ nad zemí, věta „Loves flying low. Skips one more time.“
- **Vychází z:** nový nápad, navazuje na A07 Stone Skip, S2 Cushion, S1 Low Pass.
- **Pracnost:** data S, logika S–M (přízemní efekt v `integrate`, `skip` v odrazu), 3D M (nízký široký „tupý“ tvar), UI S, texty S.

### 2.5 Karta M4 — Sail (Plachta)
- **Cíl:** udělat z větru (Z3, ukázaný před hodem) skutečnou volbu před hodem.
- **Pravidlo:** `speed 15, glide 4.2, cruise 10, ideal 26°, qte 0.9`, nové pole `windK 2.5` (vítr na Sail působí 2,5× víc, **oběma směry**). Při bezvětří je asi o 5 % kratší než Glider, v plném zadním větru (+0,12) o ~20 % delší, v protivětru o tolik horší.
- **Proč je to zábavné:** hráč čte ukazatel větru a rozhoduje: „Tailwind. Beru Sail.“ Situační, předvídatelná volba (D11, Compton). Dává smysl bonusu **Pinwheel** (přehození větru): Pinwheel + Sail = hráč si „počká na vítr“.
- **Typ hráče, čtvrť:** taktik. Nejlíp v D3 (Golden Fields, Wind Ridge), ale vítr fouká všude stejně (08 Z3), takže se hodí kdekoli.
- **Odemčení:** místo 10 Wind Ridge. Cena **1 400 ◈**.
- **Okraje a zneužití:** **Pinwheel úr. 3 ruší protivítr** (`noHeadwind`). Se Sail by to byl jistý bonus +10–20 % v každém hodu, což je dominance. Doporučení: Sail s Pinwheel úr. 3 ano, ale simulace musí ukázat, že „Sail + Pinwheel 3“ není nejlepší sestava u všech profilů. Pokud je, `windK` u Sail při `noHeadwind` snížit, nebo Pinwheel 3 dá „slabý protivítr“ místo bezvětří (rozhodne balance-analyst s orchestrátorem). Přepínání modelu podle větru stojí hráče jedno klepnutí v Dílně: na obrazovce míření nabídnout **jen** malé tlačítko „Sail ↺“, když je model odemčený a fouká víc než lehce (product-designer). Žádná výzva „změň model!“.
- **Náhled:** oblouk ve třech variantách (protivítr / klid / zadní vítr) a věta „Wind matters twice as much. Both ways.“
- **Vychází z:** D10 a D11 (vítr a „model podle větru“), Z3.
- **Pracnost:** data S, logika S (`windK` v `integrate`, vítr už má simulátor), 3D M (vysoká „plachta“ kýlu), UI S–M (rychlá volba u míření), texty S.

### 2.6 Karta M5 — Needle (Jehla)
- **Cíl:** model pro hráče, který chce krátké hody. Méně času ve vzduchu, méně klepání, stejný postup za minutu.
- **Pravidlo:** `speed 24, glide 2.6, cruise 14, ideal 12°, qte 0.9, drag 0.08`, nové pole `windK 0.4` (vítr ho skoro nebere) a `droneBurst` (zásah Ad Drone ho nevyhodí nahoru, ale vystřelí dopředu: push ×1,5, bez svislé složky). Dolet asi 85–90 % Dartu, **doba letu asi o 25–30 % kratší**.
- **Proč je to zábavné:** v D4 je let 28–31 s (F5). Needle dá hráči „rychlou“ variantu: přes celé město za 20 s, ostré průlety mezi drony. Jiný rytmus, ne lepší číslo.
- **Typ hráče, čtvrť:** hráč s málo časem, nebo kterého unavují dlouhé lety (P14). Nejlíp v D4 (drony, rychlost).
- **Odemčení:** místo 14 Sky Terraces (po Ad Drone na 13). Cena **2 000 ◈**.
- **Okraje a zneužití:** mince jsou z doletu za hod, ne za minutu. Kratší let s 85–90 % doletu znamená **víc mincí za minutu**. Simulace musí změřit mince a nová místa za skutečnou minutu: Needle smí být nejvýš o 10 % lepší než nejlepší jiný model, jinak snížit dolet. Hod s Needle stále trvá aspoň 8 s UI, takže výhoda je omezená.
- **Náhled:** nejkratší oblouk s číslem Airtime výrazně nižším, věta „Short, sharp flights. Ignores the wind.“
- **Vychází z:** D11 Střela (plochý úhel, odolnost proti větru), nové pravidlo s dronem.
- **Pracnost:** data S, logika S (`droneBurst` v události dronu), 3D M (úzká jehla), UI S, texty S.

### 2.7 Karta M6 — Night Owl (Sova), později
- **Cíl:** důvod si Night Route (06: dobrovolné druhé kolo po odemčení) zahrát jinak než ve dne.
- **Pravidlo (náčrt):** model jen pro Night Route, „vidí“ události dřív (delší varování), světlo luceren v D4 mu dává malý vztlak. Detaily až s návrhem Night Route.
- **Odemčení:** uzel Night Route v Atlasu, model za mince po prvním nočním letu.
- **Priorita:** nápad na později. **Pracnost:** M–L (závisí na Night Route).

### 2.8 Pořadí, ceny a závislosti

| # | Model | Viditelný v Dílně | Koupit lze | Cena (zástupná) | ≈ hodů příjmu | Synergie |
|---|---|---|---|---:|---:|---|
| – | Dart | od začátku | – | 0 | – | – |
| – | Glider | silueta od 1. hodu | 100 m, zdarma (A01) | 0 | – | Calm Sky |
| 1 | Hawk | silueta po objevení místa 2 | doletem na 4 | 400 | 4 | Crowd Chain, Sharp Edge, Whistle |
| 2 | Kite | silueta po místě 5 | doletem na 6 | 700 | 4–5 | Crane Lift, Thermal, Calm Sky |
| 3 | Skimmer | silueta po místě 7 | doletem na 8 | 1 000 | 4–5 | Stone Skip, Cushion, Dive, Packing Tape |
| 4 | Sail | silueta po místě 9 | doletem na 10 | 1 400 | 4–5 | Pinwheel |
| 5 | Needle | silueta po místě 13 | doletem na 14 | 2 000 | 5 | Ad Drone, Paper Rocket |

- **Proč dvojí klíč (místo + mince):** místo dává modelu příběh a správný okamžik (hráč už zná synergii), mince z něj dělají vlastní volbu (zadání uživatele). Viditelná silueta s místem odpovídá teaseru Atlasu (06: teaser předem, bez čísel).
- **Silueta se ukazuje jen o jedno místo napřed**, ne všech 5 modelů od začátku: blízký cíl (P6), ne katalog.
- **Pravidlo ceny:** ≈ 4–5 hodů průměrného příjmu v době odemčení. Když 3. kolo zrychlí mince (06: násobitel podle čtvrti), ceny se přepočtou stejným pravidlem, ne ručně.
- **Celkem 5 500 ◈**, asi 10 % všech útrat kampaně (Dílna ~30 000 ◈ podle `params.mjs`). Hráč, který model nekoupí, dojde do cíle stejně.

### 2.9 Co to znamená pro model letu
Nová pole v `MODELS` (a v `params.mjs` pro simulátor): `perfectK`, `missK` (Hawk), `liftK`, `pushK` (Kite), `ground`, `skip` (Skimmer), `windK` (Sail, Needle), `droneBurst` (Needle). Každé je **jedno místo v kódu** (`resolve`, `integrate`, odraz, událost dronu). Pravidla:
- Všechno, co násobí push, jde do **koše E** se stropem (08 §2.7).
- `liftK` patří do koše **doba ve vzduchu** a hlídá se mediánem letu.
- `windK` násobí `w`, ne rychlost, takže se nesčítá s tempem π.
- Model **nikdy nemění** tempo π (Paper) ani ceny: progrese je pro všechny modely stejná.

### 2.10 Jak hráč pozná model předem (náhled letu)
1. **Oblouk v Dílně (jádro).** Po výběru modelu se přes záběr Dílny nakreslí dva oblouky: plný = aktuální model, čárkovaný = vybraný. Oba z **posledního hodu hráče** (stejný úhel, síla, vítr, výbava), pasivně bez událostí. Fyzika je deterministická, takže je to levné a pravdivé (stejný princip jako náhled U1 a `bestAngle`).
2. **Dvě čísla a jedna věta:** `Speed 46 m/s · Airtime 19 s` (08 §2.2) a „Loves: …“ s ikonou události nebo větru. U Hawka navíc odhad z vlastních perfektů.
3. **Smyčka 3 snímků** jako u karet Atlasu (08 §8.5): podpisový moment modelu (Hawk perfekt, Kite termika, Skimmer odraz, Sail zadní vítr, Needle dron).
4. **Zkušební hod (rozšíření, BLOCKED 4):** jeden hod s odemčeným nekoupeným modelem zdarma. Počítá se normálně (mince, rekord). Jeden na model, takže to není půjčovna.
5. **Pravdivě i pro slabé:** náhled nesmí lhát ve prospěch koupě. Pokud by nový model hráči podle jeho dat dal méně, náhled to ukáže („For your throws: ≈ −4 %“).

---

## 3. Skiny a další kosmetika za postup

### 3.1 Tři vrstvy vzhledu vlaštovky (rozlišení)

| Vrstva | Co mění | Odkud | Volí hráč? |
|---|---|---|---|
| **Papír** (existuje, W2) | materiál, tóny, obrys, tvar stopy, částice, rychlostní čáry | Dílna, žebřík rychlosti | ne, je to nejvyšší koupený druh |
| **Skin** (nové) | **potisk** grafitem a barvou přes papír (vzor, kresba) + jedna drobnost (stuha na ocase, štítek) | postup: čtvrti, finále, triky modelů | ano, jeden |
| **Razítko** (nové) | malá nálepka na křídle (ikona) | první perfekt každého typu události, finále | ano, jedno, nebo žádné |
| *Stopa* | barvu dává čtvrť, tvar papír (01-papiry) | automaticky | ne, **zůstává bez kosmetiky** |
| *Model* | tvar (silueta) | Dílna za mince | ano |

**Proč skin jako potisk, ne jiný papír:** druh papíru nese informaci o rychlosti (hráč z pohledu pozná „z čeho letím“, 01-papiry §0). Kdyby skin papír přebarvil, informace by zmizela. Potisk zachová tón papíru a obrys, takže čitelnost vlaštovky (bible P1, kontrast ≥ 3 : 1) se nezmění. Stopu nechávám bez kosmetiky: má dvě funkce (čtvrť, papír) a třetí by ji přetížila. Rozhodnutí potvrzuje uživatel (BLOCKED 2).

**Pravidla pro vzhled (pro art-directora):** potisk pokrývá nejvýš ~30 % plochy, nikdy neruší obrys a přehyby, funguje ve všech 4 papírech a na všech 7 modelech (jeden UV rozvrh na model, potisk kreslený kódem jako `paintPattern` v `prototype/papers/`). Zdálky se slije do tónu papíru (vzory jsou čitelné v Dílně, menu a výsledku, ne za letu na telefonu).

### 3.2 Katalog skinů

| # | Skin (EN / CS) | Odemkne | Kdy (průměrný hráč) | Motiv (pro art-directora) |
|---|---|---|---|---|
| K0 | **Plain** / Čistý | od začátku | – | bez potisku |
| K1 | **Sunrise Postcard** / Pohled ze střech | první přelet do 2. čtvrti (Sunrise Roofs dokončena) | ~30. hod, 13 min | střechy a komíny grafitem, malá kresba postavy čtvrti 1 v rohu křídla |
| K2 | **Harbor Chart** / Přístavní mapa | první přelet do 3. čtvrti | ~60. hod, 29 min | linky mapy, kotva, postava čtvrti 2 |
| K3 | **Field Almanac** / Polní kalendář | první přelet do 4. čtvrti | ~74. hod, 38 min | klasy, větrník, hvězdy, postava čtvrti 3 |
| K4 | **Lantern Night** / Lampionová noc | finále („Delivered.“) | ~93. hod, 49 min | ornament lampionů, postava čtvrti 4 |
| K5 | **Airmail Delivered** / Doručeno | finále, spolu s K4 (ohlásí se po dalším hodu) | ~94. hod | poštovní razítko „Delivered“ přes celé křídlo, stuha na ocase |
| K6 | **Hawk Feather** / Sokolí pero | první let s Hawkem s 3 perfekty za sebou | pár hodů po koupi | peří tahy |
| K7 | **Kite Tail** / Drakův ocas | první perfekt termiky s Kite, nebo výška 40 m s Kite | po koupi, v D3 | mašle na ocase |
| K8 | **Skimmer Ripples** / Kruhy na vodě | první dvojitý odraz se Skimmerem | po koupi v D2 | soustředné kruhy |
| K9 | **Sail Stripes** / Plachtové pruhy | první let se Sail v plném zadním větru (+0,12) | po koupi, ~1 z 8 hodů | námořnické pruhy |
| K10 | **Needle Thread** / Nit | první průlet Needle skrz 2 drony v jednom letu | po koupi v D4 | stehy po délce |
| K11 | *(později)* **Night Mail** / Noční pošta | dokončená Night Route | po dohrání | hvězdná mapa, svítící okraj |

- **Suvenýry čtvrtí (K1–K4)** přicházejí spolu s **3. hláškou postavy** čtvrti (08 §7.1: „3 = první přelet do další čtvrti“). Postava „dá“ hráči suvenýr na cestu. Je to nejsilnější vazba na místo a nevzniká nový spouštěč. Na Kartě čtvrti (U2) jeden řádek „Souvenir from Sunrise Roofs: Sunrise Postcard“.
- **Podpisové skiny modelů (K6–K10)** jsou důvod nový model vyzkoušet a zároveň **učí jeho trik**: podmínka je přesně to, v čem je model dobrý. Všechny se stanou v běžném hraní s daným modelem během několika hodů (simulace ověří, §6). Nejsou to výzvy navíc: hráč nic nevolí ani nesází.
- **Žádný skin za počet** („100 perfektů“, „50 hodů“). Žádný za rekord v číslech mimo trasu.

### 3.3 Razítka (malá nálepka na křídle)

| # | Razítko (EN) | Odemkne |
|---|---|---|
| R1 | **Gust** | první perfektní poryv |
| R2 | **Pigeon** (podle čtvrti: Cyber Pigeon…) | první perfektní holub |
| R3 | **Steam** | první perfektní Steam Hop (všechny obláčky) |
| R4 | **Thermal** | první perfekt termiky (střed jádra, 06) |
| R5 | **Drone** | první perfektní Ad Drone |
| R6 | **Shooting Star** | první chycená padající hvězda |
| R7 | **Delivered** | finále |

- **Proč:** perfekt je hlavní dovednostní okamžik hry (P1, P7). Razítko je tichá památka na první, ne počitadlo. Navazuje na SV16 (razítka na křídle), které review vyřadilo jen proto, že stálo na zakázkách a výzvách (zamítnutých). Tady stojí na události, kterou hráč potká v každém letu.
- **Okraj:** první perfekty poryvu a holuba přijdou v prvních hodech, kdy je novinek nejvíc. Razítka R1 a R2 se proto **ohlásí až po odemčení Dílny** (07-menu B1: Dílna po 1. hodu) a jen řádkem ve výsledku, nikdy přes obrazovku. Hráč s automatikou QTE perfekty nemá (06), takže razítka nezíská. To je pravdivé (razítko = vlastní perfekt), ale jde o přístupnost: „Širší okna časování“ z Nastavení (07-menu B4) perfekt **umožňují**, takže hráč se slabší motorikou cestu má.
- **Priorita:** rozšíření (levné, ale není jádro).

### 3.4 Kde hráč skiny vidí a vybírá
- **Dílna, záložka „Look“ / „Vzhled“** (product-designer): model, skin, razítko na jednom místě, náhled vlaštovky zblízka v aktuálním papíru.
- **Zamčený skin:** silueta s jednou větou, kde se získá („From the Sunrise Roofs postman, when you reach Bright Harbor“). Bez počtu „3/11“ (stejně jako hlášky postav v Atlasu, 06).
- **Atlas:** u každé čtvrti malá ikona suvenýru (K1–K4), klepnutí otevře Vzhled. Žádná samostatná stránka sbírky.
- **Hlavní menu:** vlaštovka, která krouží nad městem (07-menu §2.1), nese hráčův model, papír, skin a razítko. To je místo, kde se kosmetika ukáže bez vychloubání.

### 3.5 Co se z SV14–SV16 převzalo a co ne

| Karta | Původně | Stav po 06/08 | Teď |
|---|---|---|---|
| SV14 Šuplík s papíry | vzory za sady známek a dopisy, volitelně za mince | vyřazeno (sbírka; vzhled nese papír) | **vráceno jako skin = potisk** za čtvrti, finále a triky modelů; bez známek a dopisů (SV11, SV12 zamítnuté); **ne za mince** |
| SV15 Barevná stopa čtvrti | odemykaná barva, volí hráč | barvu stopy dává čtvrť automaticky (01-papiry) | **beze změny**, stopa zůstává bez kosmetiky |
| SV16 Razítka na křídle | za zakázky a výzvy | vyřazeno | **vráceno** za první perfekt typu události (jiný zdroj) |
| E19 Vzory za mince | přiznaný sink | sloučeno do SV14 | **ne**: mince mají modely, kosmetika je za výkon |

---

## 4. Další odemykatelný obsah (mimo Atlas a vylepšení)

Atlas už dává věc na každém místě (16 bonusů, kapsy, papíry, postavy, Night Route). Nové věci proto **nesmějí přidávat sílu** (to je Atlas a Dílna) a mají být vidět mimo let.

### 4.1 Karta C1 — Polička suvenýrů (Workshop Shelf)
- **Cíl:** domov hráče se mění s jeho cestou.
- **Pravidlo:** na parapetu okna Dílny (záběr hlavního menu a Dílny) přibude **drobný 3D předmět** z každé dokončené čtvrti a z finále: větrník (Sunrise Roofs), maják v lahvi (Bright Harbor), snop klasů (Golden Fields), lampion (Lantern City), poštovní schránka s nápisem „Delivered“ (finále). Spouštěč stejný jako suvenýr K1–K4 (jedna oslava, dvě podoby).
- **Proč je to zábavné:** paměťová kotva (08 §3.7), pamětní, ne výkonová odměna. Hráč ji vidí při každém návratu do menu, bez čísla.
- **Okraje:** nic neodemyká, nic se nedá „dosbírat navíc“. Reduced motion: předměty stojí.
- **Pracnost:** 3D S–M (modely z katalogu čtvrtí, `research/design/10-katalog-modelu.md`, zmenšené), data S, UI 0. **Priorita:** rozšíření.

### 4.2 Karta C2 — Rádio v Dílně (Workshop Radio)
- **Cíl:** hudba čtvrtí jako odměna za cestu.
- **Pravidlo:** v Nastavení (nebo malé rádio na poličce) jde vybrat skladbu hlavního menu z čtvrtí, kam hráč už doletěl. Výchozí = nejvzdálenější čtvrť (06: skladba podle postupu).
- **Proč:** levné rozšíření hudby generované v kódu (06: rozpočet 0). Hráč si nechá „svou“ čtvrť.
- **Okraje:** závisí na tom, že hudba bude ve hře (dnes není, `docs/stav.md`). Žádné skladby za mince.
- **Pracnost:** S (UI přepínač, hudba už je per čtvrť). **Priorita:** později (po hudbě).

### 4.3 Karta C3 — Obsah po finále (Night Route)
- **Cíl:** naplnit dobrovolné druhé kolo (06: Night Route až po odemčení v Atlasu) vlastními věcmi.
- **Pravidlo:** Night Owl (M6), skin Night Mail (K11), noční varianty razítek podle čtvrti. Nic nového do denní trasy.
- **Pracnost:** závisí na Night Route (M–L). **Priorita:** později.

### 4.4 Co záměrně nenavrhuji
- **Další zdroje mincí, výzvy, zakázky, známky, dopisy:** zamítnuté (06, 08 §9).
- **Kosmetika stopy:** stopa už nese čtvrť a papír (01-papiry).
- **Kosmetika za mince, „obchod“ po dohrání:** možná později jako přiznaný sink (E19), ale uživatel chce kosmetiku za postup. Nenavrhuji teď.
- **Sezónní, denní nebo časově omezené věci:** P13.
- **Letka / Wingmen:** 06 (RippleLoop) říká nanejvýš pozdní bonus. Patří do Atlasu ve 3. kole, ne sem.

---

## 5. Křivka obsahu

**Časová osa:** průměrný hráč, realistický nákup, F5 (`simulation/progression/out/f5-start-skills.md`): D1 30 hodů / 13 min, D2 30 / 16, D3 14 / 9, D4 18 / 11, celkem **93 hodů / ~49 min**. Hody u míst jsou **odhad rozdělením rovnoměrně po místech uvnitř čtvrti**, ne měření (NOT ASSESSED po místech). 3. kolo progrese a rozhodnutí o ~2 h hry (06) osu posunou. Tučně je obsah z tohoto návrhu.

| Místo | ~hod / min | Atlas a Dílna (existující návrh) | Nový obsah |
|---|---|---|---|
| 1 Workshop & First Roofs | 1–5 / 0–2 | Power 1, Paper 1, Glider (100 m) | razítka Gust, Pigeon (až po odemčení Dílny, tiše) |
| 2 Market | ~6 / 3 | Crowd Chain | **silueta Hawk** |
| 3 Gardens | ~13 / 6 | Pinwheel, **Kraft** | – |
| 4 Railway | ~20 / 9 | Steam Hop | **Hawk (400 ◈)**, razítko Steam |
| 5 Warehouses (D2) | ~30 / 13 | Karta čtvrti, Packing Tape, Dive, Calm Sky, 1. kapsa (~37. hod) | **skin K1 Sunrise Postcard, polička: větrník**, silueta Kite |
| 6 Crane Forest | ~37 / 17 | Crane Lift | **Kite (700 ◈)** |
| 7 Bridge | ~45 / 21 | Stone Skip, **Washi** | silueta Skimmer |
| 8 Lighthouse | ~52 / 25 | Gull Escort | **Skimmer (1 000 ◈)**, podpisové skiny K6–K8 podle modelu |
| 9 Fields (D3) | ~60 / 29 | Karta čtvrti, Momentum, Whistle, Rocket, 2. kapsa | **skin K2 Harbor Chart, polička: maják**, silueta Sail |
| 10 Wind Ridge | ~64 / 31 | Thermal | **Sail (1 400 ◈)**, razítko Thermal |
| 11 Saddle | ~68 / 34 | Echo, **Neon Foil** | – |
| 12 Observatory | ~71 / 36 | Shooting Star | razítko Star |
| 13 Gates (D4) | ~74 / 38 | Karta čtvrti, Ad Drone | **skin K3 Field Almanac, polička: klasy**, silueta Needle, razítko Drone |
| 14 Sky Terraces | ~79 / 41 | Paper Crane | **Needle (2 000 ◈)** |
| 15 Broadcast Tower | ~84 / 44 | On Air | podpisové skiny K9–K10 |
| 16 Rooftop Harbor | ~89 / 47 | Encore | – |
| Finále | ~93 / 49 | „Delivered.“, souhrn, uzel Night Route | **skin K4 + K5, razítko Delivered, polička: lampion a schránka** |
| Po dohrání | – | Night Route (za ◈) | Night Owl, Night Mail (později) |

**Čtení:**
- **Žádné místo není hluché:** každé dává bonus Atlasu. Mezery jsou **mezi** místy (F5: medián 7, P90 13 hodů). Do nich padají koupě modelů (cíl na mince mezi místy, jako 1. kapsa) a podpisové skiny (stanou se v letu, kdykoli).
- **D1 je hustá už teď** (Power, Paper, Folds, Glider, 3 bonusy, Kraft). Proto v D1 jen Hawk na jejím konci a razítka tiše.
- **D2 je nejdelší** (30 hodů, 16 min) a měla mezi místy nejvíc „sucha“. Dostává dva modely (Kite, Skimmer) a první suvenýr. To je hlavní přínos tohoto návrhu ke křivce.
- **D3 a D4 jsou krátké** (14 a 18 hodů). Sail a Needle tam jsou spíš nová chuť než cíl. Pokud 3. kolo hru prodlouží, jejich role vzroste.
- **Finále** dává tři kosmetické věci naráz. Jednu novinku za hod: K4 ve finále, K5 a razítko po dalším hodu, polička vidět hned v menu (bez ohlášení).

---

## 6. Předávky

### 6.1 Co musí změřit simulace (balance-analyst)
Do `simulation/progression/` (nové modely jako parametry + pravidla v `model.mjs`, nová strategie volby modelu):
1. **Identita modelů:** pro každý profil (weak, average, good, expert, weakAssist, auto) a čtvrť dolet, doba letu, mince za skutečnou minutu a nová místa za minutu pro všech 7 modelů na stejné výbavě. **Cíl:** každý nový model je nejlepší aspoň v jednom profilu nebo situaci (vítr, čtvrť, kapsa) a v žádné situaci není o > 10 % lepší než druhý nejlepší. Žádný model není nejlepší pro všechny profily.
2. **Podíl modelů** u strategie „better“ (volí nejlepší model před hodem): žádný model > 50 % hodů napříč profily, Dart a Glider dál ≥ 15 %.
3. **Délka letu:** Kite medián ≤ 1,15× Glider, žádný let > 60 s (i bez zrychlení klouzání pro reduced motion: hlásit zvlášť). Needle: mince za minutu ≤ 1,10× nejlepšího jiného modelu.
4. **Cena modelu jako zpoždění:** o kolik hodů posune cíl koupě modelu ihned po odemčení (cíl ≤ 2 hody, nebo se do konce kampaně vrátí). „Nekupovat modely“ nesmí být o > 5 % rychlejší než „koupit hned a používat podle situace“.
5. **Synergie a strop E:** Hawk + Sharp Edge + Echo + Gull Escort (zasažení stropu E ≤ 20 % letů), Sail + Pinwheel 3 (není dominantní), Skimmer + Cushion + Stone Skip + Packing Tape (nejdelší let, podíl doletu pod 6 m).
6. **Hawk a automatika:** profil `auto` s Hawkem musí být horší než s Dartem (pravdivý náhled).
7. **Kdy přijdou podpisové skiny K6–K10** po koupi modelu (medián a P90 hodů s tím modelem; cíl medián ≤ 5, P90 ≤ 15), a razítka R1–R6 (hod, kdy padne první perfekt, podle profilu). Když je skin pro slabého hráče nad 15 hodů, podmínku zmírnit.
8. **Citlivost:** ceny modelů ×0,5 / ×2, `windK` 2 / 3, `liftK` 1,4 / 1,8, `perfectK` 1,4 / 1,8.

### 6.2 Co potřebuje UX (product-designer)
- Dílna: výběr modelu pro 7 modelů na mobilu 360 px, stavy **skrytý / silueta s místem / k prodeji s cenou / koupený / nasazený**, cíl nákupu „Hawk · 120 ◈ to go“ (E09), vrácení koupě do dalšího hodu.
- Náhled letu (§2.10): dva oblouky přes scénu Dílny, Speed / Airtime, „Loves: …“, smyčka 3 snímků, zkušební hod (pokud schválen).
- Záložka „Look“ / „Vzhled“: model, skin, razítko, zamčené kusy se siluetou a jednou větou, **bez počtu**.
- Výsledek a Karta čtvrti: řádek suvenýru, ohlášení skinu nebo razítka (fronta, jedna novinka za hod).
- Míření: malá rychlá volba Sail, když fouká (jen pokud ji orchestrátor schválí, BLOCKED 5).
- Atlas: ikona suvenýru u čtvrti a odkaz do Vzhledu, řádky „Also opens: Hawk in the Workshop“.
- Texty EN + CS přes i18n: 5 jmen modelů, 5 vět „Loves“, 11 skinů, 7 razítek, podmínky.
- Save: `p.models` (koupené), `p.look {skin, stamp}`, `p.cosmetics` (odemčené), migrace v4 → v5 s dopočtem suvenýrů a skinu finále z `best`/Atlasu (razítka se dopočítat nedají, dají se při dalším perfektu). Poškozený save se nesmí ztratit (pravidlo projektu).

### 6.3 Co potřebuje art (art-director)
- **5 nových siluet modelů** odlišných od Dartu a Glideru i na telefonu (~21–25 px): Hawk (dlouhá úzká křídla), Kite (široká křídla, krátké tělo, mašle), Skimmer (nízký tupý tvar), Sail (vysoký kýl), Needle (úzká jehla). Obrys a čitelnost podle bible P1. Každý model s UV pro potisk.
- **Potisky K1–K10** jako kresba kódem (jako `paintPattern`), čitelné ve 4 papírech, pokrytí ≤ 30 %, bez zásahu do obrysu.
- **7 ikon razítek** (rozlišitelné bez barvy).
- **5 předmětů na poličku** (z katalogu čtvrtí, zmenšené).
- Pravidlo „skin = potisk, papír = materiál“ zapsat do bible, pokud ho uživatel schválí.

---

## 7. Otevřené volby

BLOCKED: **Skiny a „sběratelství ne“ (06, 13. 10.).** Dřív jsi řekl „žádné sbírky navíc, stačí Atlas“, teď chceš skiny za postup. Návrh: 11 skinů a 7 razítek **bez počitadla a bez stránky sbírky**, každý je památka na čtvrť, finále nebo trik modelu a sedí u své čtvrti v Atlasu. Možnosti: (a) takhle, (b) jen suvenýry čtvrtí a finále (5 skinů, bez podpisových a razítek), (c) víc skinů včetně „výkonových“ (např. za 1 000 perfektů). **Doporučení: (a).** (c) je grind, kterému se KB vyhýbá (08 N8).

BLOCKED: **Co skin mění na vlaštovce.** (a) **Potisk přes papír**: tón, obrys a stopa zůstávají podle druhu papíru, skin přidá kresbu a drobnost (stuhu, štítek). (b) Skin nahradí celý vzhled a papír pozná hráč jen podle stopy. (c) Hráč si zvolí, jestli chce vidět papír, nebo skin. **Doporučení: (a)**, protože papír ukazuje rychlost a (b) by ji schoval.

BLOCKED: **Glider zůstává zdarma?** Dnes se Glider odemyká zdarma na 100 m (Atlas A01). (a) Zůstává zdarma, nové modely za mince. (b) I Glider za mince (malá cena, např. 60 ◈). **Doporučení: (a)**: první model zdarma učí pravidlo „místo dá věc“ a dává volbu stylu hned na začátku.

BLOCKED: **Zkušební hod.** (a) Jen náhled oblouku a čísel v Dílně. (b) Navíc jeden hod s nekoupeným modelem zdarma (počítá se normálně). **Doporučení: (b)** jako rozšíření až po jádru; jádro je náhled (a). Pozn.: zkušební hod zavádí jeden řádek v savu na model.

BLOCKED: **Rychlá volba Sail při míření.** Když fouká, ukázat při míření malé tlačítko „Sail ↺“? (a) Ano, jen pro Sail a jen při větru ≥ „Light“, (b) ne, model jen v Dílně. **Doporučení: (a)**, jinak se bude hráč kvůli větru vracet do Dílny před každým hodem (tření, ne volba). Tlačítko nic nedoporučuje, jen nabízí.

---

## 8. Souhrnná tabulka (doporučené pořadí)

Pracnost: S do půl dne, M 1–2 dny, L víc. Rozpad: data / logika / 3D / UI / texty.

| Pořadí | Položka | Druh | Priorita | Pracnost (data / logika / 3D / UI / texty) | Závisí na |
|---:|---|---|---|---|---|
| 1 | Systém modelů za mince (stavy v Dílně, save v5, místo + cena, vrácení koupě) | systém | **jádro** | M (S / S / – / M / S) | nový model letu v `src/`, menu M3 |
| 2 | Náhled letu modelu (dva oblouky, Speed / Airtime, Loves) | UX | **jádro** | M (– / S / – / M / S) | 1 |
| 3 | M1 Hawk | model | **jádro** | M (S / S / M / S / S) | 1, kombo Z5 |
| 4 | M3 Skimmer | model | **jádro** | M (S / S–M / M / S / S) | 1, Stone Skip |
| 5 | M4 Sail | model | **jádro** | M (S / S / M / S–M / S) | 1, vítr Z3, Pinwheel |
| 6 | Vrstva skinu (potisk) + záložka Vzhled | systém | **jádro** | M (S / S / M / M / S) | rozhodnutí BLOCKED 1–2 |
| 7 | Suvenýry čtvrtí K1–K4 + K5 finále | skin | **jádro** | M (S / S / M / S / S) | 6, Karta čtvrti U2, postavy |
| 8 | M2 Kite | model | rozšíření | M (S / S / M / S / S) | 1, Crane Lift, Thermal |
| 9 | M5 Needle | model | rozšíření | M (S / S / M / S / S) | 1, Ad Drone |
| 10 | Podpisové skiny K6–K10 | skin | rozšíření | M (S / S / M / S / S) | 6, modely |
| 11 | Razítka R1–R7 | kosmetika | rozšíření | S (S / S / S / S / S) | 6 |
| 12 | Zkušební hod | UX | rozšíření | S (S / S / – / S / S) | 1, BLOCKED 4 |
| 13 | Polička suvenýrů C1 | obsah | rozšíření | S–M (S / – / S–M / – / –) | menu se živou scénou (M4) |
| 14 | Rádio C2 | obsah | později | S | hudba ve hře |
| 15 | Night Owl M6, Night Mail K11 (C3) | model, skin | později | M–L | Night Route |

**Proč jádro takhle:** tři modely (Hawk, Skimmer, Sail) pokrývají tři různé osy (perfekty, konec letu, vítr) a tři čtvrti, a k nim jen jednoduchá pravidla v kódu. S nimi a se suvenýry čtvrtí má hráč novou věc v každé čtvrti. Kite a Needle prohlubují D2 a D4, ale jsou rizikovější pro délku letu a mince za minutu, takže přijdou po prvním měření.
