# Odemykatelný obsah: modely, násobič mincí, skiny a co dál (game design)

**Založeno 14. 10. 2026** (game designer), **revize 14. 10. 2026** podle rozhodnutí uživatele (06, „Odemykatelný obsah…“, body 1–8). Odpověď na zadání uživatele: „rozšířit naší dílnu o další vlaštovky které budou zamčené a půjdou odemknout za mince. A zároveň by to chtělo vymyslet další kontent ve hře aby ve hře bylo dostatek odemykatelnýho kontentu a různé skiny vlaštovek které by byly odemykatelné za progress ve hře.“

## Změny 14. 10. (osa 90 min)
- **Cílová délka ~90 min** do „Delivered.“ (06 „Cílová délka hry opravena na ~90 minut“), bez umělého natahování. Nahrazuje cíl ~60 min níže. **Noční trasa se nestaví**, Night Owl (M6), K11 a obsah po finále jsou odložené.
- **§5 a §6.1 přepočtené na osu 90 min** (~167 hodů) podle `research/obsah/05-plan-90-minut.md` §2 a §7. Sloupce „kdy“ v §2.8 a §3.2 posunuté na novou osu.
- **BLOCKED 1 a 4 (§7) překonané:** délku nese 3. kolo ekonomiky a hustota obsahu z plánu 05, pásma hodů jsou v 05 §7.2.
- **Mailbag III** se bez noci musí zaplatit do finále (05 BLOCKED 2).

## Změny 14. 10. (revize)
- **Statistiky modelů znovu (06 bod 2, §2.1):** každý nový model je **o něco lepší celkově** (+3–5 % doletu bez událostí, Needle místo doletu +10 % mincí za minutu) a **výrazně lepší ve své specialitě** (+15–25 % jen v jeho situaci), s jednou slabinou, kde je horší než Dart nebo Glider. Statistiky se rozdělují podle páky z `04-ekonomika.md` §3.1: obecný přínos nesou `glide` a `cruise`, nikdy `speed` a `ideal`. **Hawk už nemá ideal 34°**, ale 18° jako Dart.
- **Ceny dražší a pravidlem** `cena = k × R(místo)`, k roste s pořadím 4 → 6 (Hawk 450, Kite 770, Skimmer 1 100, Sail 1 560, Needle 2 190 ◈, celkem ~6 100 ◈). Nové pravidlo „dražší smí být o něco lepší, ale nikdy ve všech situacích“ nahrazuje 04 §3.3 bod 8.
- **Nová karta E1 Mailbag / Poštovní brašna** (06 bod 3, §2.11): koupený násobič „+X % mincí z každého hodu“, 3 úrovně v Dílně, odemykané příchodem do čtvrti, s viditelnou návratností a stropem, aby příjem nerostl rychleji než ceny.
- **Cíl ~60 min (§5, §6.1):** křivka obsahu přepočtená na cílovou osu 60 min (průměrný hráč, sada SKILLS). Zadání simulace s pořadím pák. Upozornění: férové modely kampaň samy neprodlouží, viz BLOCKED 1.
- **Výklad polí pro simulátor rozhodnut (§2.9):** `perfectK`, `missK`, `ground`, úhel náhledu a odhad doletu v náhledu (odpověď na dotaz game-deva).
- **Rozhodnutí 4–8 promítnuta:** Glider zdarma, Night Owl po finále (bod 4); Dílna ukazuje 2 nejbližší zamčené modely plně s cenou, náhled dvou drah a odhad doletu, **bez zkušebního hodu**, koupě s potvrzením rovnou do ruky, rychlá volba Sail (bod 5); klepnutí na vlastněnou vlaštovku ji dá do ruky, bez „Letět s touhle“ (bod 6); skiny jen za postup, jeden skin pro všechny vlaštovky, lampionový skin svítí, 7 razítek (bod 7); papíry pro Papírové město (světlý Kraft, stříbrná fólie místo Neon Foil, grafitový obrys) (bod 8). Původní BLOCKED 1–5 jsou vyřešené (§7).

**Souběžně:** UX Dílny product-designer (`02-ux-dilna.md`), vzhled art-director (`03-vzhled-modelu-a-skinu.md`), ekonomika balance-analyst (`04-ekonomika.md`, simulátor `simulation/progression/`, `--modelset`). Tento dokument dává **pravidla, identitu, rozpočet statistik a pořadí**. Čísla jsou zástupná.

**Podklady:** `06-rozhodnuti.md` (přednost), `08-navrh-kolo2.md`, `04-svet-cile-sbirky.md`, `07-review.md`, `01-vylepseni-dilna.md`, `13-rippleloop.md`, `research/atlas/01-navrh-atlasu.md`, `research/design/07-menu.md`, `01-papiry.md`, `05-styl-papir.md`, `research/obsah/02–04`, `simulation/progression/params.mjs` a `README.md`, KB P1–P15.

**Herní texty** jsou anglicky s českým ekvivalentem pro i18n (EN / CS), návrh je česky.

---

## 0. Shrnutí

1. **Pět nových modelů za mince** (Dart a Glider zůstávají): **Hawk** (perfekty), **Kite** (výška z událostí), **Skimmer** (nízký let a konec letu), **Sail** (vítr), **Needle** (krátké rychlé lety). Každý je o něco lepší celkově, výrazně lepší ve své situaci a v jedné situaci horší. Žádný není „o 10 % lepší Dart“.
2. **Dvojí klíč:** doletem na své místo se model odemkne, pak se koupí za mince. Cena je 4–6 hodů příjmu v místě odemčení, roste s pořadím: model je cíl, na který se šetří.
3. **Před koupí náhled:** dvě dráhy (aktuální a vybraný model) a odhad doletu z hráčových posledních hodů, včetně jeho událostí a větru. Bez zkušebního hodu.
4. **Mailbag / Poštovní brašna:** jediná koupená investice do mincí, +10 / +20 / +30 % z každého hodu, úroveň se otevře s každou novou čtvrtí (D2–D4). Ukazuje „teď → po koupi“ a návratnost v hodech. Strop všech „+X % mincí“ je +50 %.
5. **Skiny = potisk přes papír**, jeden skin pro všechny vlaštovky, jen za postup: 4 suvenýry (K1–K4), finále (K5), 5 podpisových za první trik modelu (K6–K10) a 7 razítek. Bez počítadla. Stopa bez kosmetiky.
6. **Další obsah:** Polička suvenýrů, Rádio (po hudbě), obsah po finále (Night Owl, Night Mail).
7. **Cílová délka ~90 min** (dnes SKILLS 52 min, x2 61 min; 06 „opraveno na ~90 minut“). Ceny modelů, které hráči vrátí, co stály, kampaň samy neprodlouží. Délku nese 3. kolo ekonomiky, hustotu novinek plán `05-plan-90-minut.md`.

---

## 1. Pravidla, která platí pro všechno níže

- **Rozhodnutí 06 mají přednost.** Skiny jsou schválené jako památka na čtvrť, finále nebo trik, bez katalogu s procenty a bez stránky sbírky (06 bod 7).
- **Volitelné výzvy nejsou žádoucí, pokud nebaví samy** (06, B16, SV13). Skin ani razítko se neodemyká umělou podmínkou, jen tím, co se v běžné hře stane samo.
- **Etika (P13, KB 02 §4.3):** nic nevyprší, nic není limitované, žádná náhoda za mince, žádný odpočet, žádný výdělek offline, žádná tečka na Dílně kvůli možnosti koupě (07-menu §2.1, 06 Atlas bod 4). Nic se nekupuje za skutečné peníze.
- **Jedna měna** ◈. Za mince jsou nové jen **modely** a **Mailbag**. Skiny a razítka se za mince nekupují.
- **Jedna novinka za hod (U3)** platí pro modely, Mailbag, skiny i razítka. Razítka se hlásí nejtišeji (řádek ve výsledku).
- **Sdílený strom:** vylepšení Dílny a Atlasu platí pro všechny modely. Modely se liší chováním, ne výbavou. Mailbag platí bez ohledu na model.
- **Model se mění zdarma mezi hody**, za letu nikdy. **Koupě s potvrzením, koupený model jde rovnou do ruky** (06 bod 5). Doporučuji, aby potvrzení u modelů nahradilo obecné „vrátit poslední koupi“ (koupě modelu je velká a vědomá). Rozhoduje product-designer v 02.

---

## 2. Nové modely vlaštovek a násobič mincí (za mince)

### 2.1 Rozpočet statistik (nové)

**Co uživatel chce (06 bod 2):** nový model je o něco lepší celkově, výrazně lepší ve své specialitě a dražší. **Co říká měření (04 §3):** `speed` a `ideal` jsou nejsilnější páky (+5 % `speed` = −14 % hodů, +4° `ideal` = −23 %), `glide` a `cruise` slabé (−4,5 % a −2 %). Strmý model dostane výšku, čas a události zadarmo (Hawk 34° = −29 % hodů, CRITICAL).

**Pravidla rozpočtu (nahrazují 04 §3.3 body 2, 3 a 8):**

1. **Obecný přínos** = dolet bez událostí, průměr přes rozložení větru, průměrný hráč, stejná výbava, proti **lepšímu z Dartu a Glideru** (sonda 04 §3.2). Nese ho jen `glide` a `cruise` (a u Skimmeru `ground`). Cíl roste s pořadím: **Hawk +3 %, Kite +3 %, Skimmer +4 %, Sail +5 %** (v bezvětří), **Needle 0 až −3 % doletu, ale +10 % mincí za minutu**.
2. **`speed` ≤ 20 a `ideal` nikdy strmější než model, ze kterého vychází** (Dart 18° při `speed` 20, Glider 30° při `speed` 14). Žádný nový model nemá vyšší úhel při stejné nebo vyšší rychlosti.
3. **Specialita** = nové pole modelu, které působí jen v jedné situaci. Cíl: v té situaci **+15–25 %** doletu proti lepšímu z Dartu a Glideru, nikdy nad +30 %. Situace nastává v **20–40 % hodů**, ne ve všech.
4. **Slabina:** každý model má aspoň jednu běžnou situaci, kde je **o ≥ 5 % horší** než lepší z Dartu a Glideru. Hráč, který bere model vždy, dopadne hůř než ten, kdo volí.
5. **Pořadí smí přidávat sílu jen v obecném přínosu**, a to nejvýš o ~1 procentní bod na model. Specialita s pořadím neroste. Dražší model tak je o něco lepší, ale nikdy nejlepší ve všech situacích.
6. **Realizovaný zisk volby** (nejlepší vlastněný model pro daný hod, s náhledem, proti lepšímu z Dartu a Glideru, průměr přes hody po koupi): D2 ≤ +7 %, D3 ≤ +9 %, D4 ≤ +10 %. Je to strop, který měří simulace. Nahrazuje 04 §3.3 bod 3 (+5 %), protože uživatel chce modely znatelně lepší.

**Rozpočet po modelech** (zástupná čísla, start pro simulaci; „síto“ = 04 §3.3 vzorec, změna hodů proti modelu, ze kterého vychází, kdyby ho nahradil ve všech hodech; síto přestřeluje asi 1,4×):

| Model | Vychází z | Základní statistiky `speed / glide / cruise / ideal / qte` | Síto | Obecný přínos (cíl) | Specialita: pole → situace (cíl) | Slabina (cíl) |
|---|---|---|---:|---|---|---|
| Dart | – | 20 / 3,2 / 11 / 18° / 1,0 | – | – | – | – |
| Glider | – | 14 / 4,0 / 11 / 30° / 1,15 | – | – | – | – |
| **Hawk** | Dart | 20 / **3,3** / **11,5** / 18° / 1,0 | −4,5 % | +3 % | `perfectK 1,6`, `missK 0,06` → hráč s ≥ 40 % perfektů (+15–20 %) | auto a slabý hráč s častým minutím (−5 %) |
| **Kite** | Glider | 14 / **4,2** / 11 / 30° / 1,15 | −4,5 % | +3 % | `liftK 1,5`, `pushK 0,8` → let s termikou, párou nebo Crane Lift (+15–20 %) | lety s ptáky a drony (vodorovný push ×0,8), D4 (−5 %) |
| **Skimmer** | Dart | 20 / **3,0** / **12** / **16°** / 0,95 | +7 % bez `ground` | +4 % (nese `ground`) | `ground {6 m, ×1,6}`, `skip +1` → konec letu s Stone Skip, Cushion nebo Packing Tape, voda D2 (+18–25 %) | lety bohaté na události (nízko méně událostí), D1 a D4 (−5 %) |
| **Sail** | Glider | **15** / **4,1** / **10,5** / **26°** / 0,95 | ladit | +5 % v bezvětří | `windK 2,5` → zadní vítr ≥ +0,08 (+15–25 %) | protivítr (−10 až −15 %) |
| **Needle** | Dart | 20 / **2,9** / **13,5** / **16°** / 0,9, `drag 0,09` | ladit | dolet 0 až −3 %, let −20 %, ◈/min +10 % | `droneBurst 1,5`, `windK 0,4` → let se 2+ drony v D4 (+15 %), silný protivítr (bez ztráty) | zadní vítr (nebere ho), lety s poryvy a párou (`qte 0,9`) |

**Proč takhle:**
- **Hawk zkrocený (06 bod 2):** ideal 18° jako Dart, takže nedostane výšku zadarmo. „Znatelně lepší“ nese `perfectK`: šikovný hráč to cítí v každém perfektu, slabý to vidí v náhledu pravdivě. Obecný přínos +3 % je malá částka přes `glide` a `cruise`.
- **Kite** zůstává na přímce Glideru (30°, 14), ne 40°. Výška přichází jen z událostí (`liftK`), takže vyhlídkový let je odměna za termiku, ne vlastnost každého hodu. Hlídá se doba letu.
- **Skimmer** má plošší úhel (16°), který by ho bez `ground` zpomalil o ~7 %. Přízemní efekt působí na konci každého letu, takže je to jeho obecný přínos; odrazy a Cushion jsou specialita.
- **Sail** je situační z podstaty: v bezvětří o kousek lepší než Glider, v zadním větru výrazně, v protivětru horší. Rychlá volba Sail při míření (06 bod 5) z toho dělá rozhodnutí před hodem.
- **Needle** je jediný, jehož „celkově lepší“ není dolet, ale čas: kratší let při skoro stejném doletu. Kdyby měl i +5 % doletu, dával by +25 % mincí za minutu a zkracoval hru (04: +26 % už se starými čísly). Pokud uživatel chce i u Needle vyšší dolet, viz BLOCKED 3.

### 2.2 Karta M1 — Hawk (Sokol)
- **Cíl:** model, kde se perfekty vyplatí víc, než kolik stojí minutí.
- **Pravidlo:** statistiky z §2.1. Perfekt dá vodorovný push ×1,6 místo ×1,25 (`perfectK`), minutí běžné události sebere 6 % vodorovné rychlosti (`missK`), vlaštovka viditelně zakolísá.
- **Proč je to zábavné:** perfekt je s Hawkem cítit a slyšet, kombo s Crowd Chain roste rychleji. Šikovnost je znát, slabší hráč o nic nepřijde, Dart a Glider zůstávají (06: šikovnost středně, P7).
- **Typ hráče, čtvrť:** expert a sběratel komba, nejlíp D1–D2. S kapsou Sharp Edge nebo Whistle čistý styl „risk za odměnu“.
- **Odemčení:** místo 4 Railway to the River. Cena **450 ◈** (k = 4). Kupuje se v praxi na začátku D2. Pokud simulace ukáže přeplnění D1 (x2 > 35 hodů), přesunout na místo 5.
- **Okraje a zneužití:** s automatikou QTE Hawk nikdy nedá perfekt (06), náhled to řekne („Auto-hits don't count as perfect.“). `perfectK` je mimo strop E (§2.9), proto má vlastní hlídání: podíl letů nad stropem E a nejdelší let s Echem a Gull Escort.
- **Náhled:** dráha stejně dlouhá jako u Dartu, odhad z hráčových hodů („For your throws: ≈ +12 %“), věta „Perfect hits push much harder. Misses cost speed.“
- **Pracnost:** data S, logika S, 3D M (silueta „letadýlko“ podle `siluety.png`), UI S, texty S.

### 2.3 Karta M2 — Kite (Drak)
- **Cíl:** model, který staví na výšce z událostí.
- **Pravidlo:** statistiky z §2.1. Svislá část poryvu, páry a termiky ×1,5 (`liftK`), vodorovný push ×0,8 (`pushK`).
- **Proč je to zábavné:** jiný obraz letu (vysoko nad střechami), termika v D3 je vrchol letu (P14). Volba pro klidného hráče.
- **Typ hráče, čtvrť:** klidný hráč, s Crane Lift (místo 6), Thermal (10) a Calm Sky.
- **Odemčení:** místo 6 Crane Forest. Cena **770 ◈** (k = 4,5).
- **Okraje a zneužití:** **délka letu.** Medián letu Kite ≤ 1,15× Glider, P90 ≤ 45 s, žádný let > 60 s, i bez zrychlení klouzání (reduced motion hlásit zvlášť). Když ne, snížit `liftK`, ne zvyšovat rychlost.
- **Náhled:** nejvyšší dráha, Airtime výrazně vyšší, věta „Rides every updraft. Slow, high, scenic.“
- **Pracnost:** data S, logika S, 3D M (vysoký lichoběžník), UI S, texty S.

### 2.4 Karta M3 — Skimmer (Žabka)
- **Cíl:** model pro konec letu, nízko nad střechami a vodou.
- **Pravidlo:** statistiky z §2.1. Pod 6 m klesá pomaleji (`ground`: klouzavost ×1,6 v běžném klesání), se Stone Skip o jeden odraz víc (`skip +1`). Pod 8 m události nezačínají (Z6), takže jich zažije méně.
- **Proč je to zábavné:** nízký průlet, voda v D2, odrazy. Dává smysl Cushion, Dive a Packing Tape.
- **Odemčení:** místo 8 Lighthouse at the Pier's End. Cena **1 100 ◈** (k = 5). Kupuje se v praxi na začátku D3.
- **Okraje a zneužití:** přízemní efekt jen násobí klouzavost, nevypíná klesání. Cushion a odraz 1× za let jako dnes. Hlídat nejdelší let a podíl doletu pod 6 m. První hody mohou skončit brzy, náhled to ukáže pravdivě.
- **Náhled:** nejplošší dráha s dlouhým ocasem nad zemí, věta „Loves flying low. Skips one more time.“
- **Pracnost:** data S, logika S–M, 3D M (plochá tupá deska), UI S, texty S.

### 2.5 Karta M4 — Sail (Plachta)
- **Cíl:** vítr (Z3, vidět před hodem) jako skutečná volba před hodem.
- **Pravidlo:** statistiky z §2.1. Vítr působí 2,5× víc oběma směry (`windK`). S Pinwheel úr. 3 (bez protivětru) `windK` 1,8, aby kombinace nebyla jistý bonus v každém hodu.
- **Proč je to zábavné:** hráč čte vítr a rozhoduje „Tailwind. Beru Sail.“ (D11). Pinwheel + Sail = počkat si na vítr.
- **Odemčení:** místo 10 Wind Ridge. Cena **1 560 ◈** (k = 5,5).
- **Okraje a zneužití:** Sail + Pinwheel 3 nesmí být nejlepší sestava u všech profilů. **Rychlá volba Sail při míření je schválená** (06 bod 5): malé tlačítko „Sail ↺“, jen když je Sail koupený a fouká víc než lehce. Nic nedoporučuje, jen nabízí.
- **Náhled:** dráha ve třech variantách (protivítr / klid / zadní vítr), věta „Wind matters twice as much. Both ways.“
- **Pracnost:** data S, logika S, 3D M (plachta), UI S–M (rychlá volba), texty S.

### 2.6 Karta M5 — Needle (Jehla)
- **Cíl:** model pro hráče, který chce krátké hody: méně času ve vzduchu, víc postupu za minutu.
- **Pravidlo:** statistiky z §2.1. Vítr ho skoro nebere (`windK 0,4`), dron ho nevyhodí nahoru, ale vystřelí dopředu (`droneBurst 1,5`, bez svislé části). Dolet 97–100 % Dartu, doba letu asi −20 %.
- **Proč je to zábavné:** přes D4 za 20 s, ostré průlety mezi drony. Jiný rytmus (P14).
- **Odemčení:** místo 14 Sky Terraces. Cena **2 190 ◈** (k = 6), nejdražší.
- **Okraje a zneužití:** mince jsou za dolet, ne za minutu. Needle smí mít nejvýš **+10–12 % mincí za minutu** proti nejlepšímu jinému modelu, jinak snížit dolet. Expert s Needle nesmí ubrat víc hodů než průměrný (poměr expert / slabý).
- **Náhled:** nejkratší dráha, Airtime výrazně nižší, věta „Short, sharp flights. Ignores the wind.“
- **Pracnost:** data S, logika S, 3D M (tenká jehla), UI S, texty S.

### 2.7 Karta M6 — Night Owl (Sova), po finále
- **Cíl:** důvod hrát Night Route jinak než ve dne. **Až po finále** (06 bod 4).
- **Pravidlo (náčrt):** jen pro Night Route, delší varování událostí, světlo luceren dává malý vztlak. Detaily s návrhem Night Route.
- **Odemčení:** uzel Night Route v Atlasu, model za mince po prvním nočním letu. Cena po finále (z nekoupeného katalogu, 04 §1.4).
- **Priorita:** později. **Pracnost:** M–L. **Odloženo 14. 10.:** noční trasa se zatím nestaví (06, cíl 90 min).

### 2.8 Pořadí, ceny a viditelnost

**Viditelnost v Dílně (06 bod 5):** vlastněné modely, **2 nejbližší zamčené plně s cenou a místem**, další jako silueta („Opens further along the route“). Zamčený model se ukazuje i před dosažením místa: karta s cenou a řádkem „Reach Crane Forest, then 770 ◈“.

| # | Model | Místo odemčení | R(místo) [◈/hod] | k | **Cena (zástupná)** | Kdy se koupí (cíl, osa §5) | Synergie |
|---|---|---:|---:|---:|---:|---|---|
| – | Dart | od začátku | – | – | 0 | – | – |
| – | Glider | 100 m (A01), zdarma | – | – | 0 | ~2. hod | Calm Sky |
| 1 | Hawk | 4 | 112 | 4 | **450** | ~hod 40–46 (začátek D2) | Crowd Chain, Sharp Edge, Whistle |
| 2 | Kite | 6 | 171 | 4,5 | **770** | ~hod 58–62 | Crane Lift, Thermal, Calm Sky |
| 3 | Skimmer | 8 | 220 | 5 | **1 100** | ~hod 80–86 (začátek D3) | Stone Skip, Cushion, Dive, Packing Tape |
| 4 | Sail | 10 | 284 | 5,5 | **1 560** | ~hod 100–105 | Pinwheel |
| 5 | Needle | 14 | 365 | 6 | **2 190** | ~hod 143–148 | Ad Drone, Paper Rocket |
| | **celkem** | | | | **~6 070** | ≈ 24 hodů příjmu | |

- **Pravidlo ceny:** `cena = round10(k × R(místo))`, R = medián příjmu za hod průměrného hráče, když má rekord na místě odemčení, **měřený bez modelů a bez Mailbagu** (04 §2.4, utlumení zpětné vazby). Ve 3. kole (násobitel čtvrti) se R přepočte a ceny s ním, ne ručně.
- **k roste s pořadím** (4 → 6): model je cíl, na který se šetří (06 bod 2), a dražší model je o něco lepší celkově (§2.1 bod 5).
- **Férovost koupě:** model musí hráči za zbytek kampaně zhruba vrátit, co stál. Kritérium: strategie `no-models` nesmí být o víc než 5 % hodů rychlejší než `models-first`. Proto ceny modelů kampaň **samy o sobě** neprodlouží o 8–11 minut (BLOCKED 1).
- R(místo) je z `04` §1.2 (x2 průměrný). Pro SKILLS je R o ~3–5 % vyšší, ceny se zaokrouhlí stejně.

### 2.9 Co to znamená pro model letu (výklad polí, rozhodnuto)

Nová pole v `MODELS` a v `params.mjs`. Chybějící pole = neutrální (1 / 0). Rozhodnutí na dotaz game-deva (14. 10.), simulátor je už většinou implementuje takto:

| Pole | Rozhodnutí | Proč |
|---|---|---|
| `perfectK` (Hawk) | **Jen vodorovný push** při perfektu (nahrazuje `push.perfect`). Svislá část poryvu nebo dronu beze změny (tu nese `qte`, u Kite `liftK`). **Mimo strop E**: násobí push po stropu, nesčítá se do E. Hlídá se vlastní metrikou (podíl letů, kdy by push s `perfectK` přesáhl strop E ×1,6, nejdelší let s Echem a Gull Escort) a rozsahem `perfectK` ≤ 1,7. | Kdyby šel do E, Hawk by ztratil identitu přesně v pozdní hře, kdy má hráč nejvíc bonusů. Strop E hlídá hromadění bonusů, ne identitu modelu. Svislá část by Hawka posunula k výšce, což je osa Kite. |
| `missK` (Hawk) | **Jen běžné události** (poryv, pták, pára, termika, dron), **ne Shooting Star**. Podíl z **`vx`** (vodorovná rychlost vůči zemi). Odpuštění předčasného stisku platí, minutí = mimo okno nebo bez stisku. | Hvězda je bonus navíc, minutí bonusu nemá trestat. `vx` je jednoduché, předvídatelné a vidět (zakolísání). Rychlost vůči vzduchu by trest míchala s větrem a Sail. |
| `ground` (Skimmer) | **Jen běžné klesání**, ne ve střemhlavu (Dive) a ne během Cushion (tam je klesání 0). Po vytažení ze střemhlavu platí znovu. | Dive má vlastní zrychlení a strop odvozený od `cruise` bez π (06, F5 bod 3). Přízemní efekt ve střemhlavu by z Dive + Skimmer udělal nekonečné klouzání. |
| `skip` (Skimmer) | Odraz navíc **jen s bonusem Stone Skip**, s jeho podmínkou `vx > 0,5·cruise` a koeficientem posledního odrazu. | Skimmer prohlubuje bonus místa, nevytváří vlastní. |
| `liftK`, `pushK` (Kite) | `liftK` svislá část poryvu, páry, termiky (a Crane Lift ne, to je výška startu). `pushK` vodorovný push všech událostí. Mimo E jako `perfectK`. `liftK` patří do koše **doba ve vzduchu**. | |
| `windK` (Sail, Needle) | Násobí vítr `w`, ne rychlost, nesčítá se s π. Sail s Pinwheel úr. 3 `windK 1,8`. | |
| `droneBurst` (Needle) | Dron bez svislé části, vodorovný push dronu ×1,5. Mimo E. | |

- Model **nikdy nemění** tempo π ani ceny. Mailbag (§2.11) nemění let.
- Všechny násobiče pushe z modelu jsou v simulátoru vidět zvlášť (podíl zisku z `perfectK`, `pushK`, `droneBurst`), aby šlo poznat, kdy specialita přeroste rozpočet §2.1.

### 2.10 Jak hráč pozná model předem (náhled, rozhodnuto)

Podle 06 bod 5: **náhled dvou drah a odhad doletu, bez zkušebního hodu.**

1. **Dvě dráhy přes scénu Dílny:** plná = model v ruce, čárkovaná = vybraný. Obě pasivní (bez událostí), se **známým větrem** příštího hodu (včetně Pinwheel) a se silou posledního hodu. **Úhel:** úhel posledního hodu **posunutý o rozdíl ideálů** obou modelů (hráč, který hází o 3° nad ideálem Dartu, uvidí Kite o 3° nad ideálem Kite). Tím se neznevýhodní model s jiným ideálem a zároveň se respektuje, jak hráč hází. Dráha ukazuje **tvar** (výška, délka letu), ne celé číslo.
2. **Odhad doletu je z přehrání posledních 5 hodů**, ne z pasivní dráhy: stejný seed letu, stejný vítr, **stejné výsledky QTE hráče** (perfekt / zásah / minutí u každé události), s vybraným modelem a posunutým úhlem. Výsledek „For your throws: ≈ +6 %“ (medián z 5). Pasivní dráha by podcenila modely, které těží z událostí (Glider, Hawk, Kite), a bot s `preview` by pak volil skoro vždy Dart (zjištění game-deva).
3. **Dvě čísla a jedna věta:** `Speed 46 m/s · Airtime 19 s` a „Loves: …“ s ikonou události nebo větru. Situační modely navíc druhý řádek: Sail „In tailwind ≈ +20 %“, Kite „With thermals ≈ +18 %“.
4. **Pravdivě i pro slabé:** pokud by model hráči podle jeho hodů dal méně, náhled to řekne („For your throws: ≈ −4 %“). U Hawka s automatikou „Auto-hits don't count as perfect.“
5. **Smyčka 3 snímků** podpisového momentu (jako karty Atlasu): rozšíření, ne jádro.
6. Hráč s méně než 5 hody s výbavou: odhad z dostupných hodů, při 0 hodech jen dráhy bez čísla.

### 2.11 Karta E1 — Mailbag / Poštovní brašna (násobič mincí, nové)

- **Cíl:** dát hráči viditelnou investici „+X % mincí z každého hodu“ (06 bod 3, plán 3. kola: násobitel čtvrti + bonusy +X % mincí, RippleLoop: hodnota teď → po koupi), bez toho, aby příjem utekl cenám.
- **Pravidlo:**
  - Řádek **Mailbag** v Dílně (vedle Power, Folds, Paper). 3 úrovně, **každá se otevře příchodem do další čtvrti** (D2 místo 5, D3 místo 9, D4 místo 13), oznámí ji Karta čtvrti řádkem „Also opens: Mailbag II in the Workshop“. Pošťák čtvrti dá hráči větší brašnu (příběhová vazba na „Delivered.“).
  - Úrovně (zástupné): **I +10 % za 500 ◈, II +20 % za 800 ◈, III +30 % za 900 ◈** (celkem 2 200 ◈).
  - Odměna za hod: `(10 + floor(dolet/10)) × násobek čtvrti × (1 + min(M, 0,5))`, zaokrouhleno dolů. M = součet všech „+X % mincí“ (koš M: Mailbag, mince za kombo z RippleLoop bod 3, budoucí uzly Atlasu). **Strop koše M je +50 %.** Násobek čtvrti (3. kolo) je zvlášť a promítá se do R, tedy do cen.
  - Cena úrovně: `round50(ΔM × R(místo otevření) × H)`, H = **horizont návratnosti v hodech**, zástupně 30 / 30 / 26 (I: 0,1 × 171 × 30 ≈ 500; II: 0,1 × 268 × 30 ≈ 800; III: 0,1 × 347 × 26 ≈ 900).
- **Návratnost (odhad, NOT ASSESSED):**

| Úroveň | Koupě (cíl, osa §5) | ◈ navíc za hod při koupi | Návratnost | Zisk do finále (čistý) |
|---|---|---:|---:|---:|
| I (+10 %) | ~hod 33–36 | ~17 | ~30 hodů (v D3) | ~+1 500 ◈ |
| II (+20 %) | ~hod 62–66 | ~27 | ~30 hodů (konec D4) | ~+500 ◈ |
| III (+30 %) | ~hod 87–90 | ~35 | ~26 hodů (**po finále**) | ~−150 ◈ (vrátí se v Night Route) |

  Úroveň III je **skutečná volba**: Needle teď, nebo investice, která se vrátí až po finále. Náhled to řekne pravdivě.
- **Proč je to zábavné:** číslo, které roste s každým hodem (06 směr žánru bod 5), a rozhodnutí „utratit teď, nebo investovat“. Každý hod po koupi ukáže malé „+24 ◈ Mailbag“ jako potvrzení, že investice pracuje.
- **Proti inflaci (příjem nesmí růst rychleji než ceny):**
  1. Úrovně jsou vázané na čtvrť, nedají se koupit dopředu.
  2. Strop koše M +50 %, Mailbag sám nejvýš +30 %.
  3. Ceny modelů, Dílny a Atlasu se počítají z R **bez** koše M. Majitel Mailbagu tedy platí za model o něco méně hodů, ale nejvýš 1/1,3.
  4. Metriky simulace: celkový příjem s Mailbagem ≤ 1,2× bez něj; „hody na další koupi“ (cena další koupě / ◈ za hod) nesmí v žádné čtvrti klesnout pod běh bez Mailbagu o víc než 15 %; strategie „Mailbag napřed“ nesmí být o víc než 8 % hodů rychlejší než `realistic`.
- **Vazba na ceny vlaštovek:** Mailbag I (D2) soupeří o mince s Kite a Skimmerem, III s Needle. Hráč, který investuje brzy, si modely koupí o pár hodů dřív. Je to záměr: dvě cesty (investovat, nebo hned letět jinak) s podobným výsledkem.
- **Viditelná čísla (06 směr žánru bod 5, RippleLoop):**
  - Dílna: „**Mailbag II** · Coins per throw: +10 % → **+20 %** · Your last throw: 284 ◈ → 310 ◈ · Pays back in ≈ 30 throws.“ / „**Brašna II** · Mince za hod: +10 % → **+20 %** · Poslední hod: 284 ◈ → 310 ◈ · Vrátí se za ≈ 30 hodů.“
  - Výsledek: hlavní řádek zůstává dolet a mince za dolet, pod ním malý řádek „+24 ◈ Mailbag“. Hráčův podíl (dolet) je vždy první (P7).
  - Ve čtvrti 4 u úrovně III navíc „Most of it pays back after the finale.“ (pravda bez odhadu zbytku kampaně).
- **Etika:** žádný výdělek offline nebo za čas, žádná náhoda, žádný odpočet, žádná tečka na Dílně. Nekupuje se za skutečné peníze. Hra má konec, proto ukazujeme návratnost v hodech a u III i to, že se vrátí až po finále.
- **Okraje a zneužití:**
  - Hod s doletem 0 dá `10 × 1,3 = 13 ◈` za ~8 s UI, skutečný hod v D4 ~400 ◈ za ~35 s. Spamování krátkých hodů se nevyplatí (hlídat ◈ za minutu u Needle s Mailbagem III).
  - Zrušený hod z pauzy (07-menu B2) se nepočítá, Mailbag nic nedá.
  - Koupě po finále: úroveň III zůstane v nabídce, platí v Night Route.
  - Save: `p.mailbag` (0–3), migrace s výchozí 0, poškozený save se neztrácí.
- **Náhled předem:** celý řádek Dílny (teď → po koupi, návratnost). Zamčená úroveň: „Opens in Golden Fields“, bez ceny dopředu (stejně jako teaser Atlasu bez čísel).
- **Zástupná čísla k ladění:** ΔM 0,10 / úroveň, H 30 / 30 / 26, strop M 0,5.
- **Pracnost:** data S, logika S (odměna v `core.js` a `params.economy.reward`), 3D 0 (volitelně brašna na háčku v Dílně, S), UI S (řádek Dílny, řádek výsledku), texty S. **Priorita: jádro** (06 bod 3).
- **Kde se kupuje:** doporučuji Dílnu, viz BLOCKED 2.

---

## 3. Skiny a další kosmetika za postup

### 3.1 Vrstvy vzhledu vlaštovky (sjednoceno s 03 §2.1, 06 body 7 a 8)

| Vrstva | Co mění | Odkud | Volí hráč? |
|---|---|---|---|
| **Model** | silueta, přehyby, let | Dílna za mince | ano |
| **Papír** (Copy → světlý Kraft → Washi → stříbrná fólie) | tón listu, vlákna, korunka, tvar stopy | žebřík rychlosti | ne, nejvyšší koupený |
| **Potisk (skin)** | kresba přes papír, ≤ 30 % plochy | postup | ano, **jeden pro všechny vlaštovky** |
| **Ozdoba** (součást skinu) | mašle, nit, lem, záře lampionu | se skinem | se skinem |
| **Razítko** | nálepka na pravém křídle | první perfekty, finále | ano, jedno nebo žádné |
| *Obrys, stín, velikost* | grafit 2,6 px | bible | **nikdy** |
| *Stopa* | barva podle čtvrti, tvar podle papíru | automaticky | **ne, bez kosmetiky** (06 bod 7) |

**Papíry pro Papírové město (06 bod 8):** světlý Kraft `#ead7b5`, místo Neon Foil **stříbrná fólie** (pracovní název „Silver Foil / Stříbrná fólie“, jméno potvrdí product-designer), obrys vždy grafit. Neon Foil (úr. 10–12) a 2. kapsa se přeladí ve 3. kole, spolu s Mailbagem, protože berou ze stejných mincí v D3 a D4.

**Viditelnost za letu na telefonu** se řeší až s telefonem na konci (06 bod 7). Skiny jsou naplno vidět v Dílně, při míření, ve výsledku a v hlavním menu (03 §2.5).

### 3.2 Katalog skinů (schválený, 06 bod 7)

| # | Skin (EN / CS) | Odemkne | Kdy (cílová osa §5) | Motiv (03 §3) |
|---|---|---|---|---|
| K0 | **Plain** / Čistý | od začátku | – | bez potisku |
| K1 | **Sunrise Postcard** / Pohled ze střech | první přelet do 2. čtvrti | ~hod 40, 17 min | střechy a komíny, postava čtvrti 1 |
| K2 | **Harbor Chart** / Přístavní mapa | první přelet do 3. čtvrti | ~hod 82, 38 min | vrstevnice, kotva |
| K3 | **Field Almanac** / Polní kalendář | první přelet do 4. čtvrti | ~hod 125, 62 min | klasy, větrník, hvězdičky |
| K4 | **Lantern Night** / Lampionová noc | finále („Delivered.“) | ~hod 167, 88 min | lampiony; **ve čtvrti 4 jemně svítí** (06 bod 7) |
| K5 | **Airmail Delivered** / Doručeno | finále, ohlásí se po dalším hodu | ~hod 168 | šipky letecké pošty, razítko |
| K6 | **Hawk Feather** / Sokolí pero | první let s Hawkem s 3 perfekty za sebou | pár hodů po koupi | tahy per |
| K7 | **Kite Tail** / Drakův ocas | první perfekt termiky s Kite, nebo výška 40 m s Kite | po koupi, D3 | kosočtverce, mašle |
| K8 | **Skimmer Ripples** / Kruhy na vodě | první dvojitý odraz se Skimmerem | po koupi | soustředné kruhy |
| K9 | **Sail Stripes** / Plachtové pruhy | první let se Sail v zadním větru ≥ +0,08 | po koupi, ~1 z 5 hodů | pruhy |
| K10 | **Needle Thread** / Nit | první průlet Needle 2 drony v jednom letu | po koupi, D4 | steh, cihlová nit |
| K11 | *(po finále)* **Night Mail** / Noční pošta | dokončená Night Route | po dohrání | souhvězdí |

- **Suvenýry čtvrtí (K1–K3)** přicházejí s 3. hláškou postavy čtvrti (08 §7.1). Řádek na Kartě čtvrti „Souvenir from Sunrise Roofs: Sunrise Postcard“.
- **Podpisové skiny (K6–K10)** učí trik modelu a stanou se v běžném hraní během několika hodů (simulace ověří). Podmínka K9 změněna z +0,12 na **+0,08**, aby seděla se situací Sail z §2.1.
- **Skiny N1–N4 z 03** (Ruled Notebook, Morning Paper, Asanoha, Daybreak) nejsou ve schváleném seznamu. Zůstávají jako rezerva art-directora, nezařazuji je.
- **Žádný skin za počet ani za mince.**

### 3.3 Razítka (schválená, 06 bod 7)

| # | Razítko (EN) | Odemkne |
|---|---|---|
| R1 | **Gust** | první perfektní poryv |
| R2 | **Pigeon** | první perfektní holub |
| R3 | **Steam** | první perfektní Steam Hop |
| R4 | **Thermal** | první perfekt termiky |
| R5 | **Drone** | první perfektní Ad Drone |
| R6 | **Shooting Star** | první chycená padající hvězda |
| R7 | **Delivered** | finále |

- Tichá památka na první perfekt, **bez počítadla**. R1 a R2 se ohlásí až po odemčení Dílny a jen řádkem ve výsledku.
- Hráč s automatikou perfekty nemá, takže razítka R1–R5 nezíská. „Širší okna časování“ z Nastavení perfekt umožňují (přístupnost).

### 3.4 Kde hráč skiny vidí a vybírá
- **Dílna, záložka „Look“ / „Vzhled“:** skin a razítko, náhled vlaštovky zblízka v aktuálním modelu a papíru. Klepnutí na odemčený skin ho rovnou nasadí (stejně jako model podle 06 bod 6).
- **Zamčený skin:** tužková skica s jednou větou, kde se získá. Bez počtu „3/11“.
- **Atlas:** ikona suvenýru u čtvrti, klepnutí otevře Vzhled. Žádná stránka sbírky.
- **Hlavní menu:** kroužící vlaštovka nese hráčův model, papír, skin a razítko.

### 3.5 Co se z SV14–SV16 převzalo
SV14 (šuplík vzorů) vrácen jako skin = potisk za postup, ne za mince. SV15 (barevná stopa) ne, stopa bez kosmetiky. SV16 (razítka) vrácena za první perfekt typu události. E19 (vzory za mince) ne.

---

## 4. Další odemykatelný obsah (mimo Atlas a vylepšení)

Nové věci tady **nepřidávají sílu** (to je Atlas, Dílna, modely a Mailbag) a jsou vidět mimo let.

### 4.1 Karta C1 — Polička suvenýrů (Workshop Shelf)
- **Cíl:** domov hráče se mění s jeho cestou.
- **Pravidlo:** na parapetu okna Dílny přibude drobný 3D předmět z každé dokončené čtvrti a z finále: větrník, maják v lahvi, snop klasů, lampion, schránka „Delivered“. Spouštěč stejný jako suvenýr K1–K4.
- **Proč:** paměťová kotva (08 §3.7), bez čísla. **Okraje:** nic neodemyká, reduced motion: předměty stojí.
- **Pracnost:** 3D S–M (z katalogu `10-katalog-modelu.md`), data S. Závisí na přepracování začátku hodu a Dílny (06, K4 bod 3). **Priorita:** rozšíření.

### 4.2 Karta C2 — Rádio v Dílně
- **Pravidlo:** výběr skladby hlavního menu z čtvrtí, kam hráč doletěl. Výchozí = nejvzdálenější čtvrť.
- **Pracnost:** S. **Priorita:** později (po hudbě).

### 4.3 Karta C3 — Obsah po finále (Night Route)
- Night Owl (M6), skin Night Mail (K11), noční varianty razítek. Mailbag III a nekoupený katalog dávají mincím smysl i po finále. **Priorita:** později. **Odloženo 14. 10.:** noc se nestaví (06), Mailbag III se musí zaplatit do finále.

### 4.4 Co záměrně nenavrhuji
Další zdroje mincí, výzvy, zakázky, známky, dopisy (zamítnuto). Kosmetika stopy (06 bod 7). Kosmetika za mince. Sezónní a denní věci (P13). Výdělek offline (RippleLoop: nepřevzít). Letka jen jako pozdní bonus Atlasu (06).

---

## 5. Křivka obsahu (cílová osa 90 min)

**Osa:** **cíl** průměrného hráče, sada SKILLS, realistický nákup, s modely, Mailbagem, Throw again a 3. kolem ekonomiky: D1 ~40 hodů / 17 min, D2 ~42 / 21, D3 ~43 / 24, D4 ~42 / 26, finále **~167 hodů / ~88 min**, se souhrnem **~90 min**. Dnes (04 §1.2) SKILLS 96 hodů / 52 min, x2 113 / 61. Hody po místech jsou rozvržení, **ne měření** (NOT ASSESSED). Osa platí, až simulace potvrdí cíl (05-plan-90-minut §7). Tučně obsah z tohoto návrhu. Nový obsah z plánu 05 (varianty událostí, Hejno, zastávky, kousky) je v `05-plan-90-minut.md` §2, tady jen modely, Mailbag a kosmetika.

| Místo | ~hod / min | Atlas a Dílna (existující) | Nový obsah |
|---|---|---|---|
| 1 Workshop & First Roofs | 1–5 / 0–2 | Power 1, Paper 1, Glider (100 m) | razítka Gust, Pigeon (tiše, po odemčení Dílny) |
| 2 Market | ~7 / 2,5 | Crowd Chain | karty Hawk a Kite v Dílně (2 nejbližší) |
| 3 Gardens | ~16 / 6,5 | Pinwheel, světlý Kraft | – |
| 4 Railway | ~27 / 11,5 | Steam Hop | **Hawk k prodeji (450 ◈)**, razítko Steam |
| 5 Warehouses (D2) | ~40 / 17 | Karta čtvrti, Packing Tape, Dive, Calm Sky, 1. kapsa | **skin K1, polička: větrník, Mailbag I (500 ◈)**, koupě Hawka (~hod 40–46) |
| 6 Crane Forest | ~50 / 22 | Crane Lift | **Kite k prodeji (770 ◈)** |
| 7 Bridge | ~61 / 27,5 | Stone Skip, Washi | koupě Kite (~hod 58–62) |
| 8 Lighthouse | ~71 / 32,5 | Gull Escort | **Skimmer k prodeji (1 100 ◈)**, podpisové K6–K7 |
| 9 Fields (D3) | ~82 / 38 | Karta čtvrti, Momentum, Whistle, Rocket, 2. kapsa | **skin K2, polička: maják, Mailbag II (800 ◈)**, koupě Skimmeru (~hod 80–86) |
| 10 Wind Ridge | ~93 / 44 | Thermal | **Sail k prodeji (1 560 ◈)**, razítko Thermal, K8 |
| 11 Saddle | ~104 / 50 | Echo, stříbrná fólie | koupě Sailu (~hod 100–105) |
| 12 Observatory | ~115 / 56 | Shooting Star | razítko Star, K9 |
| 13 Gates (D4) | ~125 / 62 | Karta čtvrti, Ad Drone | **skin K3, polička: klasy, Mailbag III (cena tak, aby se vrátila do finále, 05 BLOCKED 2)**, razítko Drone |
| 14 Sky Terraces | ~135 / 68 | Paper Crane | **Needle k prodeji (2 190 ◈)** |
| 15 Broadcast Tower | ~146 / 75 | On Air | koupě Needle (~hod 143–148), K10 |
| 16 Rooftop Harbor | ~156 / 81 | Encore | – |
| Finále | ~167 / 88 | „Delivered.“, souhrn po dohrání | **skin K4 + K5, razítko Delivered, polička: lampion a schránka** |
| Po dohrání | – | volné létání; Night Route se zatím nestaví (06) | Night Owl, Night Mail odloženy |

**Čtení:**
- **Koupě padají mezi místa** (cíl na mince mezi místy, jako 1. kapsa). Odemčení je na místě, koupě o 4–10 hodů později. Na ose 90 min je mezi místy ~10 hodů, takže koupě vlaštovky vyplní střed úseku (spolu se zastávkami z 05 v D2–D4).
- **Každá čtvrť D2–D4 dostane jednu úroveň Mailbagu a jeden suvenýr na svém prvním místě.** Fronta novinek (05 FN1) je ohlásí v dalších hodech po jednom, ne naráz s kartou čtvrti.
- **D1 zůstává bez koupě nového obsahu**: Hawk je k prodeji na místě 4, koupí se kolem přechodu do D2.
- **D2 má dva modely a Mailbag I**, Skimmer se kupuje až v D3.
- **D3 je nejbohatší na koupě** (Skimmer, Sail, Mailbag II), tam, kde bylo nejvíc sucha (04 §2.5).
- **D4** má Needle a Mailbag III. Bez noci musí obě koupě dávat smysl do finále (rychlejší lety teď; Mailbag III jen s návratností do konce hry).

---

## 6. Předávky

### 6.1 Co musí změřit a vyladit simulace (balance-analyst)

**Reference:** průměrný hráč, sada **SKILLS**, strategie `realistic`, volba modelu `preview` s odhadem z přehrání (§2.10 bod 2). Sada x2 jako kontrola. Modely z §2.1 jako nový `MODEL_SETS` (např. `obsah02`), Mailbag jako `params.economy.mailbag = {levels:[.1,.1,.1], unlockPlace:[5,9,13], H:[30,30,26], capM:.5}` a ceny modelů `price = k × R` s `R` z běhu bez modelů a bez Mailbagu.

**A. Výklad polí (rozhodnuto, §2.9):** `perfectK` jen vodorovný push, mimo E, rozsah ≤ 1,7. `missK` jen běžné události (ne hvězda), podíl z `vx`. `ground` jen běžné klesání, ne Dive, ne Cushion. Simulátor to dnes implementuje stejně, kromě **volby `preview`**: změnit z pasivního letu na **přehrání posledních 5 hodů se stejnými výsledky QTE** a úhlem posunutým o rozdíl ideálů (§2.10). Bez toho bot volí skoro vždy Dart a modely z událostí (Glider, Hawk, Kite) se podcení. Změna mechaniky simulátoru je pro game-dev.

**B. Cíle (verdikty jako 08 §10.2):**

| # | Metrika | Cíl |
|---|---|---|
| 1 | Délka kampaně SKILLS průměrný | **82–98 min** (cíl 90), ~150–185 hodů |
| 2 | Délka x2 průměrný | ≤ 105 min, každá čtvrť ≤ 30 min |
| 3 | Hody po čtvrtích SKILLS | D1 34–46, D2 36–48, D3 37–49, D4 36–48 (05-plan-90-minut §7.2) |
| 4 | Obecný přínos (sonda, pevná výbava, průměr větru) | Hawk +3, Kite +3, Skimmer +4, Sail +5 % (±1,5 p. b.); Needle dolet 0 až −3 %, ◈/min +8–12 % |
| 5 | Specialita v její situaci | +15–25 %, nikdy > +30 %; situace v 20–40 % hodů |
| 6 | Slabina | každý model aspoň v 1 běžné situaci ≤ −5 % |
| 7 | Realizovaný zisk volby (nejlepší vlastněný vs lepší z Dart/Glider) | D2 ≤ +7 %, D3 ≤ +9 %, D4 ≤ +10 % |
| 8 | Podíl modelů po jejich koupi | žádný > 45 % hodů; každý koupený ≥ 10 % hodů aspoň u 2 ze 3 profilů (není past) |
| 9 | Férovost koupě modelů | `no-models` nejvýš o 5 % hodů rychlejší než `models-first` |
| 10 | Mailbag proti inflaci | příjem kampaně ≤ 1,2× bez Mailbagu; „hody na další koupi“ v žádné čtvrti < 0,85× běhu bez Mailbagu; „Mailbag napřed“ ≤ 8 % rychlejší než `realistic` |
| 11 | Šikovnost | expert / průměrný ≥ 0,69 a expert / slabý se proti `no-models` nesmí zhoršit; slabý do 250 hodů 100 % |
| 12 | Délka letu | medián čtvrti ≤ 22 / 27 / 30 / 35 s, P90 ≤ 45, max ≤ 60; Kite medián ≤ 1,15× Glider; vše i s `warp.factor=1` (hlásit zvlášť) |
| 13 | Hawk | `auto` s Hawkem horší než s Dartem; strop E: podíl letů, kdy by push s `perfectK` přesáhl strop ×1,6, ≤ 20 % |
| 14 | Synergie | Sail + Pinwheel 3 není nejlepší sestava u všech profilů; Skimmer + Cushion + Stone Skip + Packing Tape: nejdelší let, podíl doletu pod 6 m |
| 15 | Podpisové skiny K6–K10 | medián ≤ 5, P90 ≤ 15 hodů s modelem po koupi |
| 16 | Sucho | bez novinky (A) P90 ≤ 6, bez nákupu ani novinky P90 ≤ 5; koupě modelu je novinka, úroveň Mailbagu nákup (05 §7.1) |
| 17 | Mailbag III bez noci | návratnost do finále (≤ 70 % zbývajících hodů D4) |

**C. Pořadí pák při ladění k 90 min** (od první):
1. **Statistiky na rozpočet §2.1** (body 4–7), na pevné výbavě, bez kampaně. Specialitu měnit až poslední.
2. **Mailbag:** `H` a `ΔM` tak, aby splnil bod 10.
3. **k modelů** (jedno měřítko pro všech 5) tak, aby platil bod 9.
4. **Délka:** zbytek do 82–98 min nese **3. kolo ekonomiky** (násobek čtvrti, strom, ceny v tisících, 06). Dokud není v simulátoru, jedno měřítko cen Dílny a Atlasu `economy.priceScale` (odhad ×1,6–1,9, NOT ASSESSED). Podmínka: zdražení jen tolik, kolik unese hustota novinek; když sucho (bod 16) nevyjde, přidává se obsah podle 05, ne levnější ceny.
5. **Citlivost:** k ×0,75 / ×1,25, `ΔM` 0,07 / 0,13, `windK` 2 / 3, `liftK` 1,3 / 1,7, `perfectK` 1,4 / 1,7, `ground.glide` 1,4 / 1,8.

**D. Hrubý odhad (NOT ASSESSED, jen pro orientaci):** modely ~6 070 ◈ ≈ 24 hodů příjmu; pokud se vrátí (bod 9), délka se nezmění. Mailbag čistě ~+1 900 ◈ do finále ≈ −6 až −9 hodů. Bez páky 4 by tedy kampaň SKILLS vyšla spíš **kolem 50 min**, tedy ~40 min a ~70 hodů pod cílem 90 min. Ty musí přijít z 3. kola. Malý běh game-deva (n 4) se starými čísly: 83 hodů / 45,5 min proti 87 bez modelů, tedy stejný směr.

### 6.2 Co potřebuje UX (product-designer)
- Dílna podle 06 body 5–6: vlastněné modely a **2 nejbližší zamčené plně s cenou a místem**, další jako silueta. **Klepnutí na vlastněnou vlaštovku ji dá do ruky**, tlačítko „Letět s touhle“ (`planes.use`, `result.useIt`) se ruší. U zamčené jen „Koupit“, dole vždy jedno „Hodit“. Koupě s potvrzením, koupený model rovnou do ruky. Cíl nákupu „Hawk · 120 ◈ to go“ (E09).
- Náhled §2.10: dvě dráhy, odhad z přehrání, Speed / Airtime, „Loves: …“, u situačních modelů druhý řádek. **Bez zkušebního hodu.**
- Rychlá volba „Sail ↺“ při míření (schválená).
- **Řádek Mailbag v Dílně** (teď → po koupi, poslední hod → po koupi, návratnost), zamčená úroveň „Opens in …“. Řádek „+24 ◈ Mailbag“ ve výsledku pod hlavním údajem.
- Záložka Vzhled: skin (jeden pro všechny vlaštovky), razítko, zamčené kusy jako skica s jednou větou, bez počtu.
- Karta čtvrti: řádek suvenýru a „Also opens: Mailbag II in the Workshop“.
- Texty EN + CS: 5 jmen modelů, věty „Loves“ a situační řádky, Mailbag (název, 3 úrovně, návratnost, „pays back after the finale“), 11 skinů, 7 razítek, podmínky.
- Save: `p.models`, `p.mailbag`, `p.look {skin, stamp}`, `p.cosmetics`, migrace s dopočtem suvenýrů a skinů finále z `best` a Atlasu.

### 6.3 Co potřebuje art (art-director)
- 5 siluet podle `siluety.png` (06 bod 1), s UV pro potisk.
- Potisky K1–K10, ozdoby, záře K4 jen ve čtvrti 4, 7 ikon razítek.
- Papíry pro Papírové město (06 bod 8): světlý Kraft, stříbrná fólie, grafitový obrys.
- 5 předmětů na poličku, volitelně brašna v Dílně.

---

## 7. Otevřené volby

**Vyřešeno 14. 10. (06 „Odemykatelný obsah“):** skiny za postup bez počítadla (bod 7), skin = potisk (bod 7), Glider zdarma (bod 4), zkušební hod ne (bod 5), rychlá volba Sail ano (bod 5).

*Překonáno 14. 10. (cíl 90 min, délku nese 3. kolo a hustota obsahu z 05, §6.1 C bod 4):* **Odkud vzít ~8–11 minut navíc do 60 min?** Modely jsou dražší, ale aby se vyplatily, musí hráči čas vrátit. Kampaň proto samy neprodlouží (odhad i s Mailbagem spíš ~50 min). Možnosti: (a) **mírně zdražit Dílnu a Atlas rovnoměrně** (např. ×1,12), do 3. kola, kde to převezme násobek čtvrti s cenami v tisících; (b) nechat modely kampaň prodlužovat: hráč, který je koupí, dohraje o pár minut později než ten, kdo je nekoupí; (c) delší hru nechat až na 3. kolo a teď cílit jen na „ne kratší než dnes“. **Doporučení: (a)**, protože koupě modelu má být radost, ne daň, a čísla se ve 3. kole stejně přepočítají.

BLOCKED: **Kde se kupuje násobič mincí?** (a) **Dílna**, řádek Mailbag vedle Power a Paper, úroveň se otevře s každou novou čtvrtí; (b) Atlas, uzel u Karty čtvrti (např. „Postman's Bag“ u místa 5, 9, 13); (c) obojí (Dílna 3 úrovně + drobné uzly v Atlasu, společný strop +50 %). **Doporučení: (a)** teď, (c) zvážit ve 3. kole. Dílna je místo pro „sílu za mince“, Atlas pro bonusy letu a událostí, a jeden řádek je nejsrozumitelnější.

BLOCKED: **Needle „celkově lepší“ v čase, ne v doletu?** Needle letí stejně daleko jako Dart, ale o pětinu kratší dobu (víc mincí za minutu). Kdyby měl i delší dolet, byl by nejlepší skoro všude a hru zkracoval. (a) Ano, Needle je lepší v čase; (b) Needle i +3 % doletu a delší let (méně „rychlý“); (c) Needle jen situační, bez obecného přínosu. **Doporučení: (a).**

*Překonáno 14. 10. (pásma pro 90 min v 05-plan-90-minut §7.2):* **Pásmo hodů po čtvrtích pro 60 min.** Dnes je cíl 20–30 hodů na čtvrť (D1 25–35), což při 60 min a delších pozdních letech nevychází. Návrh: D2–D4 22–32 hodů, minuty beze změny (celkem 50–75). (a) Posunout takhle; (b) nechat 20–30 a 60 min hledat delšími lety; (c) rozhodnout po prvním měření. **Doporučení: (a)**, hlavní cíl jsou minuty.

---

## 8. Souhrnná tabulka (doporučené pořadí)

Pracnost: S do půl dne, M 1–2 dny, L víc. Rozpad: data / logika / 3D / UI / texty.

| Pořadí | Položka | Druh | Priorita | Pracnost (data / logika / 3D / UI / texty) | Závisí na |
|---:|---|---|---|---|---|
| 1 | Systém modelů za mince (Dílna podle 06 body 5–6, save, místo + cena k×R, potvrzení koupě) | systém | **jádro** | M (S / S / – / M / S) | model letu v `src/`, menu |
| 2 | Náhled modelu (dvě dráhy, odhad z přehrání 5 hodů, Speed / Airtime, Loves) | UX | **jádro** | M (– / M / – / M / S) | 1, preview v simulátoru (§6.1 A) |
| 3 | **E1 Mailbag** (3 úrovně, koš M se stropem, řádek Dílny a výsledku) | ekonomika | **jádro** | S (S / S / – / S / S) | `economy.reward` v params, BLOCKED 2 |
| 4 | M1 Hawk | model | **jádro** | M (S / S / M / S / S) | 1, kombo Z5 |
| 5 | M3 Skimmer | model | **jádro** | M (S / S–M / M / S / S) | 1, Stone Skip |
| 6 | M4 Sail + rychlá volba | model | **jádro** | M (S / S / M / S–M / S) | 1, vítr Z3, Pinwheel |
| 7 | Vrstva skinu (potisk, jeden pro všechny) + záložka Vzhled | systém | **jádro** | M (S / S / M / M / S) | papíry pro Papírové město (06 bod 8) |
| 8 | Suvenýry K1–K3, K4 (záře ve čtvrti 4), K5 | skin | **jádro** | M (S / S / M / S / S) | 7, Karta čtvrti, postavy |
| 9 | M2 Kite | model | rozšíření | M (S / S / M / S / S) | 1, Crane Lift, Thermal, kontrola délky letu |
| 10 | M5 Needle | model | rozšíření | M (S / S / M / S / S) | 1, Ad Drone, BLOCKED 3 |
| 11 | Podpisové skiny K6–K10 | skin | rozšíření | M (S / S / M / S / S) | 7, modely |
| 12 | Razítka R1–R7 | kosmetika | rozšíření (schváleno) | S (S / S / S / S / S) | 7 |
| 13 | Polička suvenýrů C1 | obsah | rozšíření | S–M (S / – / S–M / – / –) | nový začátek hodu a Dílna |
| 14 | Rádio C2 | obsah | později | S | hudba ve hře |
| 15 | Night Owl M6, Night Mail K11 (C3) | model, skin | později | M–L | Night Route |

**Proč jádro takhle:** tři modely (Hawk, Skimmer, Sail) pokrývají tři osy (perfekty, konec letu, vítr) a tři čtvrti. Mailbag je levný a dává incrementalové „číslo, které roste“, které uživatel chce, a zároveň je to hlavní páka, kterou musí simulace hlídat proti inflaci. Kite a Needle jsou rizikovější pro délku letu a mince za minutu, přijdou po prvním měření. **Před implementací do `src/` musí simulace projít §6.1 B body 1–10.**
