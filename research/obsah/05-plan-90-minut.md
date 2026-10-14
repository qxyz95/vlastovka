# Plán obsahu na 90 minut (game design)

**Založeno 14. 10. 2026** jako plán na 2 hodiny (`05-plan-dvou-hodin.md`), **přepracováno 14. 10. 2026** na 90 minut podle rozhodnutí 06 „Cílová délka hry opravena na ~90 minut“ a „Kousky (triky)“. Uživatel: „Hra má dávat 90 minut dopamin a pak to máš dohrát.“

## Změny 14. 10.
- **Cíl ~90 min do „Delivered.“**, ne 2 h. Kdo dohraje, má hotovou hru. **Noční trasa se nestaví:** z plánu vypadla NR1 Night Route, EV5 Ohňostroj, EV6 Paprsek majáku, Night Owl (01 M6), skin K11, razítko R12 a vše, co bylo jen kvůli druhému dějství (zahlédnutí ohňostroje, noční uzly, „Mailbag III na noc“).
- **Nový rozbor (§1):** 90 min ≈ **165–170 hodů**. Nepočítám už položky, ale **okamžiky novinky** (hody, ve kterých přijde něco nového). Dnešní a schválený obsah jich dá ~37–40, potřeba je **45–55**. Závěr: **přidat málo, ale cíleně**, hlavně do D2–D4.
- **Opakování událostí (§1.4):** za hru ~520 QTE, z toho ~420 poryvů a holubů. Odpověď jsou **varianty událostí podle čtvrti** (§3, nová karta VA1), ne nové systémy. Schváleno v 06.
- **Kousky (§4):** schválené v **odlehčené verzi** (8 kousků + 5 kousků modelů, které už jsou v 01 jako podpisové skiny), jméno ve výsledku, nápověda „Pairs well with“, bez seznamu, bez odměny v mincích. **Staví se až po ověření simulací** (§4.6, prahy „vzácné / samozřejmé“). Plná verze (21 kousků, rub pohlednice, nitě, zvěsti, +1 kombo) jde do „později“.
- **Zastávky (ZB1) v odlehčené podobě:** jen D2–D4, pojmenované dominanty z katalogu místo 16 nových modelů (BLOCKED 1).
- **Vyřazeno nebo odloženo** (kvůli kratší hře, §6): Husí klín (EV3), Přemet (BN1), Ladění píšťalky (BN3), zvěsti postav (CU1), rub pohlednice a nitě (CU2), kousky 5, 8, 13, 16 a Harbor Relay až po Hejnu.
- **Pásma pro 08 §10.2 přepočtená** na 90 min (§7), zadání pro balance-analyst včetně ověření kousků.
- **Pracnost** klesla z ~50–70 na **~25–33 agentodnů** (§8). Osa 90 min je promítnutá do `01-game-design.md` §5 a §6.1.

**Podklady:** `06-rozhodnuti.md` (přednost), `01-game-design.md` (modely, Mailbag, skiny, razítka, polička), `08-navrh-kolo2.md` (Atlas, kapsy, události, §10.2), `12-ladeni2.md` (dnešní čísla), `13-rippleloop.md` (3. kolo), `04-svet-cile-sbirky.md` (zamítnuté), `research/atlas/01-navrh-atlasu.md`, bible `research/design/05-styl-papir.md`, KB P1–P15 (bloky 02, 03, 08).

**Konvence:** návrh česky, herní texty EN / CS. Čísla jsou zástupná, ověřuje je balance-analyst v `simulation/progression/`. Pracnost **S** do půl dne, **M** 1–2 dny, **L** 3–5 dní. Rozpad data / logika / 3D / UI / texty. **Všechny odhady délky, četnosti a pracnosti jsou NOT ASSESSED**, nic z toho není změřené.

---

## 0. Shrnutí

1. **90 minut nese hlavně ekonomika, obsah je má naplnit.** Dnes průměrný hráč dohraje za ~52 min a ~96 hodů. Na 90 min je potřeba ~70 hodů navíc. Ty přidá 3. kolo progrese (incremental strom, ceny v tisících, schváleno v 06). Úkol obsahu: aby těch 70 hodů navíc nebylo prázdných.
2. **Kolik nového:** dnes a se schválenými novinkami (5 vlaštovek, Mailbag, skiny, razítka, podkrovní dílna, Boost taps) přijde něco nového zhruba v každém 4.–5. hodu, ale **nerovnoměrně**: hodně v D1 a na prvním místě každé čtvrti, málo v D3–D4. Cíl je **jedna novinka každé ~3 hody** a nákup mezi nimi.
3. **Minimum, které 90 min unese bez grindu** (jádro, ~13–18 dní):
   - **Fronta novinek s prioritami** (rozprostře to, co dnes přijde naráz na kartě čtvrti).
   - **Řádek rekordů a těsnosti** („37 m short of the Lighthouse“, „Longest combo ×9“).
   - **Varianty událostí podle čtvrti:** racek, mořský vánek, prachový vír, skřivan, průvan, papírový holub. Stejné tlačítko, jiný vzhled a jedna změna v rytmu.
   - **Hejno** (tři ptáci za sebou: drž, pusť, drž).
   - **Zastávky v půlce místa** v D2–D4 (12 pojmenovaných dominant).
4. **Kousky (schváleno, odlehčeně):** hra pozná a ve výsledku pojmenuje šikovnou kombinaci („Pigeon Express: caught a pigeon, then rode the gust.“). 8 kousků + 5 kousků modelů. **Nejdřív simulace změří, jak často se stanou samy.** Staví se jen ty, které nejsou ani vzácné (< 1 % letů), ani samozřejmé (> 25 % letů).
5. **Rozšíření** (~10–12 dní): kousky (po ověření), Předpověď trasy, Lampiony, zahlédnutí další čtvrti.
6. **Nová pásma 08 §10.2** (§7): den **150–185 hodů, 82–98 min (cíl 90)**, sucho bez novinky P90 ≤ 6, mezi zastávkami P90 ≤ 10.
7. **Pořadí:** A rozprostření a rekordy → B varianty událostí a Hejno → C zastávky (s Papírovým městem) → ověření kousků v simulaci → D kousky → **playtest**. Ekonomika 3. kola souběžně podle 13.

---

## 1. Rozbor 90 minut

### 1.1 Kolik je 90 minut v hodech
- Dnes (F5, SKILLS průměrný, realistický nákup): **96 hodů / 52 min**, ~32 s na hod včetně ~8 s mezi hody. Poslední lety mají ~30 s a to je rozhodnuté (06, 08 §11 bod 1): **délku nesmí nést delší lety.**
- S „Throw again“ (06, RippleLoop bod 4) klesne čas mezi hody na ~5–6 s. Hod pak trvá ~25 s v D1 až ~37 s v D4.
- **90 min ≈ 165–170 hodů:** D1 ~40 hodů / 17 min, D2 ~42 / 21, D3 ~43 / 24, D4 ~42 / 26, finále ~167. hod / ~88 min, souhrn → ~90 min.
- Na 16 míst to je **~10 hodů na místo** (dnes ~6).

### 1.2 Co dnes přináší novinky
Nepočítám položky, ale **okamžiky novinky**: hody, ve kterých hráč dostane něco kvalitativně nového (místo, sloveso, model, schopnost, první setkání). Pět věcí na jedné kartě čtvrti je pro hráče jeden okamžik, ne pět.

| Okamžik | Kolikrát | Poznámka |
|---|---:|---|
| Nové místo (s ním papír, karta čtvrti, kapsy, odemčení modelu, suvenýr, úroveň Mailbagu) | 16 | shluky: místa 5, 9, 13 nesou 4–6 věcí naráz |
| První setkání s místní událostí (pára, termika, dron, hvězda) | 4 | obvykle 1–3 hody po místě |
| První nasazení speciálu z kapsy | ~4 | hráč vyzkouší 3–4 ze 6 |
| Koupě vlaštovky (Hawk, Kite, Skimmer, Sail, Needle) | 5 | mezi místy, dobře rozložené |
| Podpisový skin K6–K10 (první trik modelu) | 5 | pár hodů po koupi |
| 3. kolo: Boost taps, první uzel automatiky | ~2 | |
| Finále | 1 | |
| **Celkem** | **~37–40** | jeden za ~4,3 hodu |
| Drobnosti (nepočítají se do sucha): hlášky postav 12, razítka 7, vtipy o dopadu 12, gagy 5, nákupy úrovní a uzlů | ~40 + nákupy | nákupy 3. kola ~každé 1–2 hody |

**Rozložení je horší než průměr.** D1 má na 40 hodů ~12 okamžiků (každý ~3. hod), D3 a D4 jen ~8–9 na ~43 hodů (každý ~5. hod), a z toho polovina přijde na prvním místě čtvrti. Proto už dnes sucho P90 9–11 (cíl ≤ 8, 12-ladeni2 §5.1). Na 90 min by se v D3–D4 natáhlo na ~12–15 hodů.

### 1.3 Kolik je potřeba
- „Dopamin každých pár hodů“ = **novinka (A) každé ~3 hody** a **nákup (B) mezi nimi** (strom 3. kola, ≤ 2 hody). Na 165 hodů to je **45–55 okamžiků**.
- **Chybí ~10–15 okamžiků**, skoro všechny v D2–D4, a k tomu rozprostřít dnešní shluky.
- Kolik dá minimum z §0 bod 3:
  - fronta s prioritami rozdělí karty čtvrtí (místo 5 věcí naráz pět hodů po sobě): **+6–8** okamžiků bez nového obsahu,
  - varianty událostí po čtvrtích a Hejno (první setkání): **+7**,
  - zastávky D2–D4: **+12**,
  - celkem **~62–67**, tedy jedna novinka každých ~2,5–2,7 hodu. Rezerva je záměrná: část zastávek bude nést jen jméno.
- Kousky přidají dalších ~6–9 okamžiků (průměrný hráč najde 40–75 % z 13), ale **nejsou potřeba k dosažení cíle**. Jsou odpověď na „co dál jde dokázat“, ne výplň.

### 1.4 Kolikrát hráč zažije tutéž událost
Odhad (NOT ASSESSED): ~2,5 QTE na let v D1, ~3,6 v D4.

| Čtvrť | Hodů | QTE | Z toho poryv + holub (bez variant) | S variantami (§3) |
|---|---:|---:|---:|---:|
| D1 Střechy za úsvitu | 40 | ~100 | ~95 | ~95 (učí se základ) |
| D2 Slunný přístav | 42 | ~125 | ~110 | ~70 + ~40 variant |
| D3 Zlatá pole | 43 | ~140 | ~110 | ~70 + ~40 variant |
| D4 Město lampionů | 42 | ~150 | ~105 | ~70 + ~35 variant |
| **Celkem** | **167** | **~515** | **~420 (~210 každý)** | **~305 + ~115** |

- **Sloveso se opakovat smí.** Poryv (klepni) a holub (drž, pusť) jsou jádro hry jako skok v plošinovce. Okoukat se nesmí **vzhled, rytmus a kontext**: 210 stejných holubů za 90 min je ~2,3 za minutu bez proměny.
- **Co s tím (schváleno v 06):** v každé čtvrti od D2 má poryv i holub **místní tvář** se stejným tlačítkem a jednou změnou rytmu (§3). Hráč tak každých ~20 minut dostane „stejné, ale jinak“. To je levnější a srozumitelnější než nové systémy (Kidd & Hayden, KB 08 N6: novost uvnitř známého rámce).
- Kdo je QTE unavený, má automatiku ve stromě (06). Varianty ji nesmí rozbít: automatika chytí i variantu běžným zásahem.

### 1.5 Málo, nebo hodně? (upřímně)
**Málo nového systému, středně obsahu.** Dnešní plán (08, 01, 3. kolo) už má skoro dost věcí. Problém je, že přicházejí **naráz** a že se **okouká let**. Jediný nový „systém“ v jádru je fronta s prioritami (malá). Zbytek jsou data, texty a modely do hotových systémů. Kousky jsou jediná opravdu nová mechanika a jsou schválené jako rozšíření s ověřením.

Kdyby se 90 min dosáhlo jen zdražením bez minima z §0 bod 3: sucho v D3–D4 P90 ~12–15, mezi místy medián ~10, ~420 stejných poryvů a holubů. To je grind (P13, KB 02 §2.7).

### 1.6 Co délku nesmí nést
- **Zdražení bez obsahu:** ceny se zvednou jen tolik, kolik unese hustota novinek. Měří simulace (§7).
- **Delší lety, pomalejší π, slabší vlaštovka:** rozhodnuto (06).
- **Náhoda, odpočty, denní věci, reset, prestige:** zakázané (06, P13).
- **Povinné výzvy:** zamítnuté (06 B16, SV06, SV13). Nic nového není podmínkou postupu.

---

## 2. Mapa obsahu na 90 minut

**Osa** (průměrný hráč SKILLS, realistický nákup, Throw again, 3. kolo): rozvržení, **ne měření**. Tučně nový obsah z tohoto dokumentu. „½“ = zastávka v půlce místa (ZB1, jen D2–D4). Novinky z karet čtvrtí se podle fronty (FN1) rozkládají do následujících hodů.

| Místo | ~hod / min | Existující (01, 08, 3. kolo) | Nové |
|---|---|---|---|
| 1 Workshop & First Roofs | 1 / 0 | Power, Paper, Glider (100 m), Boost taps | |
| 2 Market | ~7 / 2,5 | Crowd Chain, karty Hawk a Kite v Dílně | |
| 3 Gardens | ~16 / 6,5 | Pinwheel, světlý Kraft | **kousek Pigeon Express** možný (D1) |
| 4 Railway | ~27 / 11,5 | Steam Hop, Hawk k prodeji | **kousek Kettle Song** |
| 5 Warehouses (karta D2) | ~40 / 17 | Packing Tape, Dive, Calm Sky, 1. kapsa, K1, Mailbag I | **fronta rozloží kartu do ~4 hodů**, **mořský vánek** |
| 5½ | ~45 / 19,5 | koupě Hawka | **zastávka** |
| 6 Crane Forest | ~50 / 22 | Crane Lift, Kite k prodeji | **racek**, **Hejno** |
| 6½ | ~55 / 24,5 | | **zastávka**, kousek Tape Save |
| 7 Bridge | ~61 / 27,5 | Stone Skip, Washi, koupě Kite | |
| 7½ | ~66 / 30 | K6 Hawk | **zastávka** |
| 8 Lighthouse | ~71 / 32,5 | Gull Escort, Skimmer k prodeji | (rezerva: kousek Harbor Relay) |
| 8½ | ~76 / 35 | | **zastávka**, **zahlédnutí víru na polích** |
| 9 Fields (karta D3) | ~82 / 38 | Momentum, Whistle, Rocket, 2. kapsa, K2, Mailbag II, koupě Skimmeru | **prachový vír**, kousek Over the Line (s Rocketem) |
| 9½ | ~87 / 41 | K8 Skimmer | **zastávka** |
| 10 Windmill Ridge | ~93 / 44 | Thermal, Sail k prodeji | **skřivan** |
| 10½ | ~98 / 47 | | **zastávka** |
| 11 Mountain Saddle | ~104 / 50 | Echo, stříbrná fólie, koupě Sailu | kousek Steam Organ |
| 11½ | ~109 / 53 | K7, K9 | **zastávka** |
| 12 Observatory | ~115 / 56 | Shooting Star | kousek Wish |
| 12½ | ~120 / 59 | | **zastávka**, **zahlédnutí lampionů nad městem** |
| 13 Gates (karta D4) | ~125 / 62 | Ad Drone, K3, Mailbag III, uzly automatiky | **průvan**, **Lampiony** (rozšíření) |
| 13½ | ~130 / 65 | | **zastávka**, kousek Drone Ping-Pong |
| 14 Sky Terraces | ~135 / 68 | Paper Crane, Needle k prodeji | **papírový holub** |
| 14½ | ~140 / 71,5 | | **zastávka**, kousek All the Verbs |
| 15 Clock Tower | ~146 / 75 | On Air, koupě Needle | |
| 15½ | ~151 / 78 | K10 Needle | **zastávka** |
| 16 Rooftop Harbor | ~156 / 81 | Encore | |
| 16½ | ~161 / 84,5 | | **zastávka** (poslední, výhled na cíl trasy) |
| Finále | ~167 / ~88 | „Delivered.“, souhrn, K4, K5, R7, polička | souhrn po dohrání (06) + **řádek rekordů celé hry** |

**Čtení mapy:**
- **D1 zastávky nemá:** je hustá sama (učení, první nákupy, Glider, Hawk). Zastávka by tu byla šum.
- **Každá čtvrť od D2 má 2 místní varianty** (poryv a holub) a D2 navíc Hejno. První setkání je novinka, pak jsou varianty součástí letu.
- **Kousky nejsou v ose napevno.** Zapsané jsou tam, kde je hráč může poprvé udělat. Kdy je udělá, záleží na něm.
- **Modely a Mailbag zůstávají podle 01 §2.8** (místa 4, 6, 8, 10, 14), jen se posunou na delší osu. Cena `k × R` se přepočte sama.

---

## 3. Varianty událostí podle čtvrti

### VA1 — Místní tváře událostí / Local events
- **Cíl:** proti okoukání (§1.4) bez nového systému. Schváleno v 06 jako přednostní cesta.
- **Pravidlo:**
  1. Od D2 má každá čtvrť **místní poryv a místního holuba**. **Stejné tlačítko** jako základ (Z6), jiný model a zvuk, **jedna změna** v časování nebo v tom, co událost dá.
  2. Ve své čtvrti nahradí ~35 % poryvů a holubů (zástupně). Jinde se nevyskytuje (místní identita). V D1 zůstává jen základ (učení).
  3. **Pravidlo 06 F3 bod 4:** varianta má pro každý profil očekávaný přínos ≥ základní události. Dolet se kvůli ní nesmí zhoršit.
  4. **První setkání** podle U3: zpomalení, jedna věta, širší okno. Je to novinka (A) ve frontě.
  5. Automatika chytí variantu běžným zásahem, „Širší okna časování“ platí stejně.

| Čtvrť | Varianta poryvu | Změna | Varianta holuba | Změna |
|---|---|---|---|---|
| D2 Slunný přístav | **Sea Breeze / Mořský vánek** (pěna a solná mlha) | delší pruh (1,5 s místo 1,2), push víc nahoru (×1,3) a méně dopředu (×0,85) | **Gull / Racek** | drží déle (1,1 s místo 0,8), střed později (0,95 s); + **Hejno** (EV1) |
| D3 Zlatá pole | **Dust Devil / Prachový vír** (EV2) | po chycení volba: dřív = rychlost, později = výška | **Skylark / Skřivan** | při držení stoupá (+1,5 m), vodorovně slabší |
| D4 Město lampionů | **Street Draft / Průvan mezi věžemi** (papírky a letáky) | kratší varování (0,5 s místo 0,8), push ×1,25 | **Paper Pigeon / Papírový holub** | kratší držení (0,6 s), ale tlačí dopředu ×1,2 |

- **Proč je to zábavné:** „stejné, ale jinak“ udrží slovesa svěží a dává čtvrti charakter (bible 05: každá čtvrť má svou náladu). Vánek a skřivan hrají s Kite (výška), průvan a papírový holub s Needle (rychlost), vír nabízí volbu. Varianty tak **posilují volbu vlaštovky** (zásada „model je styl hry“).
- **Vazba:** 06 (varianty po čtvrtích, místní holubi SV18), 08 §7.2 (dnes jen texty, teď i rytmus), P3, KB 08 N6.
- **Okraje:** změna časování nesmí být past pro slabého hráče: okna úspěchu stejně široká, mění se jen střed a délka. Varianty se liší tvarem a pohybem, ne jen barvou (P15). Hawk `missK` se u Hejna počítá na každého ptáka (náhled to řekne).
- **Zneužití:** žádné, varianta nedává mince ani nic neodemyká.
- **Náhled:** „Locals“ v Atlasu u čtvrti ukazuje siluetu varianty po prvním setkání; zahlédnutí (CU4) předem; s Předpovědí trasy (BN2) ikona varianty při míření.
- **Zástupná čísla:** podíl 0,35, časování a násobky v tabulce. Měří simulace (§7).
- **Pracnost:** data S / logika **S–M** (`events.js` typ s variantou podle čtvrti, tabulka parametrů, simulátor) / 3D **M** (4 nové modely: racek, skřivan, papírový holub, vizuál vánku a průvanu; vír v EV2) / UI S / texty S (6 vět prvního setkání EN + CS). **3–5 dní. Priorita: jádro.**

### EV1 — Hejno / Flock (beze změny z kola 1, jen D2–D4)
- Tři ptáci za sebou (D2 racci, D3 skřivani, D4 papíroví holubi): drž, pusť na značce, do 0,4 s chyť dalšího. Úspěch +1 kombo, perfekt +2. Minutí hejno ukončí, zisk zůstane. Push každého ptáka 0,6× holuba, výšku dává jen první. Nejvýš 1 za let, ~25 % holubů od místa 6.
- **Proč:** první událost s rytmem ze tří kroků, vrchol pro Crowd Chain a Gull Escort.
- **Okraje:** automatika chytí všechny běžným zásahem. Únava z QTE: max 1 za let.
- **Pracnost:** data S / logika M / 3D M (sdílí modely s VA1) / UI S / texty S. **3–4 dny. Priorita: jádro.**

### EV2 — Prachový vír / Dust Devil (varianta poryvu D3, z kola 1)
- První klepnutí vír chytí, na kruhu pak dva oblouky: **dřív = rychlost** (push ×1,4), **později = výška** (×1,5). Bez druhého klepnutí neutrální výstup.
- **Proč:** jediná událost s volbou uvnitř (P8): před hranicí místa výška, s Needle rychlost.
- **Okraje:** automatika jen chytí, výstup neutrální. Oblouky odlišené tvarem a ikonou.
- **Pracnost:** data S / logika M / 3D M / UI **M** / texty S. **3–4 dny.** Je to místní poryv D3 z VA1, **priorita: jádro** (bez něj D3 nemá místní poryv; levnější náhrada viz §8 pozn.).

### EV4 — Lampiony / Lantern Rise (D4, z kola 1)
- „Tap in place“, když je lampion v kruhu: 1,2 s jemné stoupání. Do rozvrhu navíc (06 F5 bod 2), ~1 za let v D4.
- **Proč:** klidný kontrast k průvanu a dronům, obraz Města lampionů.
- **Okraje:** hlídat medián letu D4 ≤ 35 s.
- **Pracnost:** S / S / M / S / S. **2 dny. Priorita: rozšíření.**

---

## 4. Kousky (triky), odlehčená verze — schváleno

Uživatel 14. 10. (06): triky **ano v odlehčené verzi**, pojmenování šikovné kombinace, žádný seznam úkolů. **Staví se až po levném ověření simulací**, jen když kombinace nejsou ani vzácné, ani samozřejmé.

### 4.1 Co to je (jednoduše)
Kousek je **pojmenovaná šikovná kombinace v jednom letu**. Hra si všimne, že hráč udělal něco zajímavého, a řekne mu, jak se tomu říká. Nic se předem nezadává.

Příklady:
- **Pigeon Express / Holubí expres:** chytíš holuba perfektně, pustíš ho a hned do 1,5 s trefíš perfektně poryv. Ve výsledku: „Trick: Pigeon Express — caught a pigeon, then rode the gust.“
- **Steam Organ / Parní varhany:** máš v kapse Echo, trefíš perfektně všechny tři obláčky páry a Echo je zopakuje. Bonus ze dvou různých čtvrtí hraje spolu.
- **Over the Line / Přes čáru:** let by skončil kousek před hranicí místa, ale v poslední sekundě ho Boost tap nebo Paper Rocket přenese přes ni. Hra to pozná přepočtem (bez tahu by nedoletěl).

Podpisové skiny K6–K10 z 01 (např. „první let s Hawkem se 3 perfekty za sebou“) jsou **už schválené kousky modelů**. Odlehčená verze je jen zahrne pod stejné jméno a stejný řádek ve výsledku.

### 4.2 Proč by to mohlo bavit
- **Hra ocení, co udělal hráč** (P1, P7): ne „koupil jsi +10 %“, ale „tohle jsi zvládl ty“. Pojmenovaný trik je odměna sám o sobě (Tony Hawk, Burnout).
- **Druhá osa vedle doletu:** strom a mince říkají „dál“, kousky „jak“. Dávají důvod zkoušet jiné kapsy a vlaštovky, i když nejsou nejlepší na dolet (horizontální růst, KB 03 N6).
- **Odpověď na zadání uživatele** „co dál půjde s bonusy a eventy dokázat“ a stojí skoro jen na hotovém obsahu.

### 4.3 Rizika a jak je odlehčená verze tlumí
| Riziko | Proč hrozí | Odlehčená verze |
|---|---|---|
| **Hráč si nevšimne** | za letu je rychlost a QTE, štítek zmizí | hlavní pojmenování je **ve výsledku** (klidná chvíle), za letu jen krátký štítek bez zastavení; první kousek se stane většině sama v D1 (Pigeon Express), takže se hráč naučí, že hra pojmenovává |
| **Působí jako seznam achievementů** | počty „7/13“, šedé ikony nesplněných | **žádný seznam, žádný počet**; v Atlasu u bonusu jen řádek kousků, které hráč **už udělal** |
| **Složitá detekce** | každý kousek je podmínka nad letem | jen 8 kousků, jen z hotových událostí, každý čistá funkce nad záznamem letu s testem; nic, co potřebuje novou mechaniku |
| **Málo kombinací** | dnes 2 základní události + 4 místní | kousky staví na místních událostech, kapsách a modelech; s variantami (§3) je kombinací víc; rezerva 4 kousků přijde s Hejnem a vírem |
| **Kousek „zadarmo“** | stane se pořád sám | ověření §4.6: > 25 % letů = vlastnost výbavy, ne kousek, podmínka se zpřísní nebo vyřadí |
| **Nedosažitelný** | stane se skoro nikdy | ověření §4.6: < 1 % bez záměru a < 8 % se záměrem = uvolnit nebo vyřadit |
| **Tlak „musím mít všechny“** | sběratelský pud | žádná odměna za počet, žádný skin za „všechny kousky“ (P13) |
| **Zkracuje hru** | kdyby dával kombo nebo mince | v odlehčené verzi **nedává nic** kromě jména |

### 4.4 TL0 — Pravidla odlehčené verze / Tricks (light)
1. **Kousek = pevná podmínka nad záznamem jednoho letu** (čistá funkce bez DOM, např. `src/tricks.js`, deterministicky ze seedu a vstupů, test pro každý kousek).
2. **Poprvé:** za letu krátký tušový štítek se jménem (0,6 s, let se nezastavuje, reduced motion jen text). Ve výsledku jeden řádek se jménem a jednou větou, co hráč udělal. Ve frontě novinek (FN1) je to **novinka A** s prioritou hned za kartou čtvrti a finále (je to hráčův výkon, P1).
3. **Znovu:** jen štítek za letu, žádný řádek ve výsledku, **žádná odměna**.
4. **Zápis:** v Atlasu na kartě bonusu (a v Dílně na kartě modelu) řádek „Tricks: Steam Organ“ jen s kousky, které hráč už udělal. Nesplněné se neukazují.
5. **Nápověda „Pairs well with“ (CU3):** karta bonusu, speciálu a modelu jmenuje 1–2 partnery („Pairs well with: Echo“). Neříká, co z toho vznikne. Neznámý partner jako „???“ s ikonou čtvrti. Navazuje na „Loves:“ u modelů (01 §2.10).
6. **Nic neodemyká, není podmínkou postupu.** Výjimka: kousky modelů dál dávají podpisový skin K6–K10 (už schváleno v 01).
7. **Automatika** dává jen běžný zásah, kousky s perfektem s ní nejdou. Karta to řekne („Needs perfect hits.“). „Širší okna časování“ perfekty umožní.
8. **Save:** `p.tricks` (pole ID s číslem hodu prvního provedení), migrace s prázdným polem, poškozený save se neztrácí.

### 4.5 Katalog: 8 kousků + 5 kousků modelů
„Samo“ = odhad výskytu bez záměru v letech, kdy má hráč přísady (NOT ASSESSED, změří §4.6).

| # | Kousek (EN / CS) | Podmínka (jeden let) | Bonus / karta | Od | Samo |
|---|---|---|---|---|---:|
| 1 | **Pigeon Express** / Holubí expres | perfektní holub, pak perfektní poryv do 1,5 s po puštění | First Roofs | 1 | ~8 % |
| 2 | **Kettle Song** / Píseň konvice | všechny obláčky páry perfektně | Railway | 4 | ~12 % |
| 3 | **Over the Line** / Přes čáru | Boost tap nebo Paper Rocket v poslední sekundě přenese přes hranici místa (bez něj by let skončil před ní) | Gardens / Rocket | 1 | ~4 % |
| 4 | **Tape Save** / Zalepeno | minutí zachráněné Packing Tape, další událost perfektně | Warehouses | 5 | ~6 % |
| 5 | **Steam Organ** / Parní varhany | Echo zopakuje všechny 3 perfektní obláčky páry | Railway + Saddle | 11 | ~5 % |
| 6 | **Wish** / Přání | chycená padající hvězda při kombu ≥ 5 | Observatory | 12 | ~3 % |
| 7 | **Drone Ping-Pong** / Pinčes | dva perfektní drony do 2 s | Gates | 13 | ~4 % |
| 8 | **All the Verbs** / Všechna slovesa | v jednom letu úspěšně tap, hold, tap-tap a tap in place | Encore | 13 | ~6 % |
| M1–M5 | kousky modelů (= podmínky skinů K6–K10 v 01 §3.2) | Hawk 3 perfekty za sebou, Kite perfekt termiky, Skimmer dvojitý odraz, Sail zadní vítr, Needle 2 drony | karta modelu | po koupi | 01 §6.1 bod 15 |

**Rezerva** (až po své události, stejné ověření): Harbor Relay (celé Hejno perfektně s Gull Escort), Dust Devil Dive (vír na rychlost a hned Dive), Skylark Climb (skřivan + termika nad 30 m), Whistle Storm (3 přivolané události perfektně).

**Cíl:** průměrný hráč do finále najde **40–75 %** z 13, ne všechny. Kdo chce, má co hledat, kdo ne, o nic nepřijde.

### 4.6 Ověření před stavbou (zadání pro balance-analyst)
**Princip:** detektory kousků se nejdřív napíšou **jen do simulátoru** jako měření nad záznamem letu, bez UI a bez změny `src/`. Hra se nemění. Když simulátor záznam letu nebo některou událost neumí, doplní je game-dev v `simulation/progression/` (ne balance-analyst). Kousek, jehož událost simulátor nemá (vír, Hejno), je NOT ASSESSED a čeká.

**Dva boti** na profilech slabý / průměrný / expert, sada SKILLS, realistický nákup, kampaň 90 min:
- **bez záměru:** hraje jako dnes, kousky jen detekujeme,
- **se záměrem:** jednoduchá politika pro každý kousek (např. Steam Organ: Echo v kapse, když má hráč Steam Hop; Over the Line: Boost tap, jen když bez něj nepřeletí hranici; Pigeon Express: po holubovi čeká na poryv).

**Co měřit pro každý kousek** (jen v letech, kdy má hráč přísady):

| Metrika | **Vzácné** (vyřadit nebo uvolnit) | **Zdravé** | **Samozřejmé** (zpřísnit nebo vyřadit) |
|---|---|---|---|
| Výskyt bez záměru, průměrný hráč | < 1 % letů | **2–20 %** | > 25 % letů |
| Výskyt se záměrem, průměrný hráč | < 8 % | **≥ 8 %** a ≥ 1,5× výskytu bez záměru | záměr nic nemění (< 1,2×) = náhoda, ne dovednost |
| Hodů od získání přísad do 1. provedení bez záměru (medián) | > 40 nebo nenastane do finále u > 50 % kampaní | **3–25** | ≤ 1 (stane se hned při prvním letu) |
| Poměr výskytu expert / slabý | > 5× (jen test perfektnosti) | **≤ 4×** | – |

**Za celý systém:**
- 1. kousek (kromě kousků modelů) do 15. hodu v mediánu průměrného hráče (aby se hráč naučil, že hra pojmenovává).
- Průměrný hráč bez záměru do finále najde 40–75 % z 13, slabý ≥ 25 %.
- Dva kousky s korelací výskytu > 0,8 jsou tentýž čin, jeden se vyřadí.
- Kontrola, že kousky nemění délku (v odlehčené verzi nic nedávají, má vyjít 0 %; jinak chyba v měření).

**Brána:** systém se staví, když **aspoň 6 z 8** kousků vyjde zdravě (případně po jedné úpravě podmínky, např. okno 1,5 s → 2 s). Kousky mimo pásmo se nestaví. Pokud méně než 6, platí §4.7.

**Odhad práce:** game-dev ~1–2 dny (záznam letu a detektory v simulátoru), balance-analyst ~1 den (běhy a tabulka). Výstup `simulation/progression/out/90m-tricks.{md,json}`.

**Co simulace neověří (jen playtest, P4):** jestli si hráči pojmenování všimnou a jestli je potěší. Levný test v playtestu: hráče se po hře zeptat „Pamatuješ si nějaký kousek, který hra pojmenovala? Zkoušel jsi ho znovu?“ (skill `playtest`).

### 4.7 Když ověření neprojde: co hráči dá „co dál dokázat“ bez kousků
- **Podpisové skiny K6–K10** zůstávají (schválené, nezávislé na kouscích).
- **Řádek rekordů (RK1):** měřitelné osobní cíle „Best: 7 places in one throw“, „Longest combo ×9“.
- **Varianty událostí a Hejno (§3):** novost v letu.
- **„Loves:“ a „Pairs well with“** na kartách jako nápověda k sestavám bez jmen kousků.
- Ztráta: hra neocení konkrétní kombinaci jménem a slabší důvod experimentovat s kapsami.

---

## 5. Další karty

### FN1 — Fronta novinek s prioritami / Discovery queue (jádro)
- **Cíl:** rozprostřít shluky (karta čtvrti nese 4–6 věcí naráz) do následujících hodů.
- **Pravidlo:** jedna ohlášená novinka za hod (U3 platí). Pořadí: finále > karta čtvrti > nový kousek > nové místo > první setkání s událostí nebo variantou > zastávka > koupě a podpisový skin > rekord > tiché (razítko, hláška). Karta čtvrti ohlásí jen čtvrť a kapsu, suvenýr, Mailbag a nový papír přijdou v dalších hodech po jednom („Also new: …“). Tiché položky se neohlašují, když čeká velká.
- **Okraje:** fronta nesmí držet novinku déle než 3 hody (jinak se ohlásí řádkem „Also new“). Save: `p.atlas.pending` existuje, přibude priorita.
- **Pracnost:** S / S / – / S / –. **1 den.**

### RK1 — Řádek rekordů a těsnosti / Best line (jádro)
- **Pravidlo:** ve výsledku nejvýš jeden řádek, jen při novém osobním rekordu („Best: 7 places in one throw“, „Highest: 41 m“, „Longest combo ×9“, „Farthest in Windmill Ridge“) nebo pravdivá těsnost („37 m short of the Lighthouse“, 06 F5 bod 1). Ve finálním souhrnu rekordy celé hry (06: souhrn po dohrání ano).
- **Proč:** pravdivá zpětná vazba podle výkonu (P1), drobnost mezi místy (schváleno v 06).
- **Okraje:** není to obrazovka statistik (06: zatím ne). Tichá kategorie, nepočítá se do sucha.
- **Pracnost:** S / S / – / S / S. **1 den.**

### ZB1 lite — Zastávky v půlce místa / Landmarks (jádro, D2–D4)
- **Cíl:** blízký cíl (P6) tam, kde jsou místa nejdál od sebe.
- **Pravidlo:** v půlce každého místa D2–D4 (12×) dostane jméno **jedna dominanta, která už je v katalogu čtvrti** (Lighthouse Keeper's House, Grain Silo, Lantern Bridge…; jména a výběr navrhne art-director). První přelet: krátké bliknutí jména jako u místa, ve výsledku řádek, v Atlasu malá nálepka na čáře trasy (ne pohlednice). **Nedává bonus**, nese jednu položku z fronty (FN1). Teaser v Atlasu: „Next: Grain Silo · 120 m past your best“.
- **Okraje:** při ~160 m/s se proletí za ~1 s, rozestup od bliknutí místa ≥ 0,8 s, jinak se sloučí. Víc zastávek v jednom letu: ohlásí se nejvzdálenější. Save: odvozené z `p.best`.
- **Pracnost:** data S / logika S / 3D **S–M** (zvýraznit a pojmenovat existující model, ne nový; staví se s dávkami Papírového města) / UI S / texty S. **2–3 dny.** Volba 3D je BLOCKED 1.

### BN2 — Předpověď trasy / Route Forecast (rozšíření, uzel stromu od D2)
- Při míření ikony prvních dvou událostí letu ze seedu (pravda, ne odhad), včetně varianty. Rozhodnutí před hodem („vánek a racek, beru Kite“).
- **Zneužití:** zrušený hod se nezapočítá a `attempts` se nezvýší, předpověď zůstane stejná, přehazovat nejde. Tutoriál (seed 1) mimo.
- **Pracnost:** S / S / – / M / S. **1–2 dny.**

### CU4 — Zahlédnutí / Sightings (rozšíření, 3 scény)
- Z konce čtvrti je v dálce vidět událost další: racci nad řekou (4), vír na polích (8½), lampiony nad městem (12½). Bez textu, jen v prvních třech letech. Ohňostroj (byl pro noc) vypadl.
- **Okraje:** jen v pozadí, mimo QTE, reduced motion staticky.
- **Pracnost:** S / S / M (sdílí modely s VA1, EV4) / – / –. **2 dny.**

### Kosmetika
Razítka legend R8–R11 vypadla se zvěstmi (plná verze kousků). Žádný skin ani razítko za počet kousků.

---

## 6. Co se vyřadilo a co se mění jinde

### 6.1 Vyřazeno nebo odloženo
| Položka | Důvod | Kam |
|---|---|---|
| NR1 Night Route, EV5 Ohňostroj, EV6 Paprsek majáku | noc se nestaví (06) | později, až po playtestu 90 min |
| Night Owl (01 M6), K11, R12 | patří jen k noci | později; uzel Night Route v Atlasu zatím skrytý |
| EV3 Husí klín | byl pro rozmanitost na 2 h, 90 min ho nepotřebuje | nápad na později |
| BN1 Přemet, BN3 Ladění píšťalky | nová mechanika pro šikovné, nad rámec minima | později |
| CU1 Zvěsti, CU2 rub pohlednice a nitě, R8–R11 | patří k plné verzi kousků | později, po playtestu odlehčené verze |
| Kousky 5, 8, 13, 16 kola 1, „+1 kombo za opakování“ | nová mechanika nebo vliv na délku | později |
| Zastávky v D1 | D1 je hustá sama | – |

### 6.2 Změny v dalších dokumentech
| Dokument | Co se mění | Kdo |
|---|---|---|
| `01-game-design.md` §5, §6.1 | osa 90 min (hotovo v tomto kole) | game designer |
| `01` §2.11 Mailbag | Mailbag III na místě 13 se musí vrátit **do finále** (noc není), viz BLOCKED 2 | balance-analyst |
| `08-navrh-kolo2.md` §10.2 | nová pásma §7 | orchestrátor / balance-analyst |
| `08` §7.2 | místní holubi a poryvy mají kromě textů i rytmus (VA1) | – |
| Atlas `01-navrh-atlasu.md` §3.3, §3.4 | řádek „Tricks:“ na kartě bonusu, nálepky zastávek, priority fronty FN1 | product-designer |
| 3. kolo progrese (13) | ceny škálované na 90 min, BN2 jako uzel, Boost taps jako přísada Over the Line | balance-analyst, game designer |

---

## 7. Cílová pásma pro 08 §10.2 a zadání pro balance-analyst

### 7.1 Definice
- **Novinka (A):** nové místo, zastávka, první setkání s událostí nebo variantou, první nasazení speciálu, koupě vlaštovky, podpisový skin, nový kousek, finále. **Počítá se hod, ne položka** (dvě novinky v jednom hodu = jeden okamžik).
- **Nákup (B):** úroveň nebo uzel jen s čísly, úroveň Mailbagu.
- **Tiché (C):** razítko, hláška, vtip, gag, rekord. Do sucha se nepočítají.

### 7.2 Pásma (průměrný hráč SKILLS, realistický nákup, Throw again, 3. kolo)

| Metrika | Dnes (08 §10.2, 06) | **Nově (90 min)** |
|---|---|---|
| Hody na čtvrť (medián) | D1 25–35, D2–D4 20–30 | **D1 34–46, D2 36–48, D3 37–49, D4 36–48; celkem 150–185 (cíl ~167)** |
| Minuty na čtvrť | D1 12–18, D2 10–16, D3 12–18, D4 14–20; celkem 50–75 | **D1 14–20, D2 18–24, D3 21–27, D4 23–29; celkem 82–98 (cíl 90)** |
| Slabý hráč | 100 % do 250 hodů, ≤ 1,4× | **100 % do 250 hodů, ≤ 1,35× minut průměrného** |
| Expert | ≥ 0,7× (0,69 přijato) | ≥ 0,69× (beze změny) |
| Délka letu | medián D1 ≤ 22, D2 ≤ 27, D3 ≤ 30, D4 ≤ 35 s; P90 ≤ 45; max ≤ 60 | beze změny; varianty, vír a lampiony hlídat zvlášť |
| **Sucho bez novinky (A)** | – | **medián ≤ 3, P90 ≤ 6, max (P90 kampaní) ≤ 12** |
| Sucho bez nákupu ani novinky | P90 ≤ 8 | **P90 ≤ 5** (strom 3. kola) |
| Mezi místy | medián ≤ 8, P90 ≤ 14 („šum ×2“ ≤ 16) | **medián ≤ 11, P90 ≤ 17** |
| **Mezi zastávkami** (místo nebo zastávka, D2–D4) | – | **medián ≤ 6, P90 ≤ 10** |
| **Fronta novinek** | – | čekání novinky na ohlášení P90 ≤ 3 hody; nikdy 2 ohlášení v jednom výsledku |
| **Opakování událostí** | – | podíl základního poryvu + holuba mezi QTE: D1 ≤ 95 %, D2–D4 ≤ 60 %; v každé čtvrti D2–D4 první setkání s oběma variantami do 10. hodu ve čtvrti (medián) |
| **Varianty událostí** | – | očekávaný přínos varianty ≥ základní u každého profilu (06 F3 bod 4); doletová ztráta 0 |
| **Kousky** | – | ověření §4.6 (prahy vzácné / zdravé / samozřejmé, brána 6 z 8) |
| Hody mezi nákupy (13 §6.4) | – | D1 medián ≤ 1, D2–D4 ≤ 2, P90 ≤ 4 |
| Mailbag III | – | návratnost do finále (≤ 70 % zbývajících hodů D4), jinak BLOCKED 2 |

### 7.3 Zadání pro balance-analyst (`simulation/progression/`)
Spouštět jen `node simulation/progression/run.mjs ... --out 90m-<jméno>`. **Nespouštět** `npm run simulate`, `simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs`.

1. **Základna „90 min jen zdražením“:** dnešní obsah, jedno měřítko cen tak, aby kampaň vyšla na ~90 min. Změřit sucho bez novinky (po hodech, ne položkách), mezi místy, počty poryvů a holubů. Potvrdí, nebo vyvrátí odhad §1.2–1.4.
2. **Osa obsahu jako data:** `params.mjs` `content.schedule` = položky `{id, cat: 'A'|'B'|'C', trigger: place|landmark|buy|trick|first-event|first-variant}`. Zastávky = `start + 0,5·šířka` místa v D2–D4. Fronta FN1 s prioritami z §5.
3. **Ekonomika na 90 min:** 3. kolo (`M_čtvrť`, strom, Boost taps), pokud už je v simulátoru, jinak dnešní strom a jedno měřítko cen (odhad ×1,6–1,9, NOT ASSESSED). Ceny modelů a Mailbagu přes `k × R` (01).
4. **Varianty událostí (VA1, EV1, EV2):** podíl, časování a násobky z §3, ověřit pravidlo „varianta ≥ základní“ pro všechny profily a metriku opakování.
5. **Kousky:** §4.6 (výstup `90m-tricks`). Mechaniky, které simulátor neumí, doplní game-dev.
6. **Citlivost:** ceny ×0,85 / ×1,15, podíl variant 0,25 / 0,45, Hejno 0,15 / 0,35, vír 0,2 / 0,4, Mailbag III cena ×0,7.
7. **Výstup:** tabulka §7.2 s verdikty (CRITICAL / CONCERNS / NOT ASSESSED / HEALTHY), `out/90m-*.{md,json}`.

**Co simulace neověří (jen playtest, P4):** jestli 90 min uteče, nebo se táhne (otázka „Hrál jsi déle, než jsi chtěl?“, P13), jestli si hráči všimnou variant a kousků, jestli zastávky působí jako postup.

---

## 8. Pracnost a pořadí dávek

### 8.1 Souhrnná tabulka (doporučené pořadí)

| Pořadí | Položka | Priorita | Pracnost (data / logika / 3D / UI / texty) | Odhad dní | Závisí na |
|---:|---|---|---|---:|---|
| A1 | FN1 Fronta novinek s prioritami | **jádro** | S / S / – / S / – | 1 | Atlas `pending` |
| A2 | RK1 Řádek rekordů a těsnosti | **jádro** | S / S / – / S / S | 1 | – |
| B1 | VA1 Místní varianty (vánek, racek, skřivan, průvan, papírový holub) | **jádro** | S / S–M / M / S / S | 3–5 | `events.js`, simulátor, katalog čtvrtí |
| B2 | EV1 Hejno | **jádro** | S / M / M / S / S | 3–4 | B1 (modely ptáků) |
| B3 | EV2 Prachový vír (místní poryv D3) | **jádro** | S / M / M / M / S | 3–4 | B1 |
| C1 | ZB1 lite Zastávky D2–D4 | **jádro** | S / S / S–M / S / S | 2–3 | Papírové město D2–D4, BLOCKED 1 |
| V | **Ověření kousků v simulaci** (§4.6) | brána | – | 2–3 (game-dev + balance-analyst) | záznam letu v simulátoru, B1–B3 pro rezervu |
| D1 | TL0 Kousky lite + CU3 Pairs well with | rozšíření (schválené) | S / M / S / S / S | 3–4 | V (≥ 6 z 8 zdravých) |
| D2 | Kousky 1–8 (jen ty, které prošly) | rozšíření | S / S / – / – / S | 2 | D1 |
| E1 | BN2 Předpověď trasy | rozšíření | S / S / – / M / S | 1–2 | seed, míření |
| E2 | EV4 Lampiony | rozšíření | S / S / M / S / S | 2 | Papírové město D4 |
| E3 | CU4 Zahlédnutí (3 scény) | rozšíření | S / S / M / – / – | 2 | B1, B3, E2 |
| – | **Playtest** (90 min) | ověření | – | – | A–D |
| – | 3. kolo ekonomiky na 90 min | jádro (jinde, 13) | – | – | F5 |

**Celkem:** jádro (A, B, C) **~13–18 dní**, ověření ~2–3 dny, rozšíření (D, E) **~10–12 dní**. **Dohromady ~25–33 agentodnů** bez ladění a playtestu (dřív 50–70). NOT ASSESSED, hrubý odhad. Simulace navíc ~3–5 dní balance-analysta.

**Pozn. k B3:** pokud bude potřeba šetřit, místní poryv D3 může být zatím jen „Harvest Gust / Žňový poryv“ s jednou změnou parametru (S–M, 1–2 dny) a vír s volbou přijde později. Doporučuji vír, protože je to jediná událost s volbou.

### 8.2 Proč takové pořadí
1. **A je skoro zadarmo** a sám zmenší sucho (rozprostře karty čtvrtí).
2. **B řeší okoukání** (schválená přednost 06) a dává 7 nových prvních setkání v D2–D4, kde je sucho největší. Hejno a vír sdílejí modely a logiku s VA1.
3. **C zastávky** se staví s dávkami Papírového města po čtvrtích, proto až po B (logika je malá, 3D jde s čtvrtěmi).
4. **V ověření kousků** běží v simulátoru souběžně s C (nemění hru). Teprve podle výsledku **D kousky**.
5. **E** jen pokud playtest nebo simulace ukáže sucho nebo okoukání v D4.
6. **Playtest** po A–D: odpoví na to, co simulace neumí (táhne se to? všimnou si kousků?).

---

## 9. Otevřené volby

Vyřešeno v 06 (14. 10.): struktura (90 min bez noci, dřív BLOCKED 1), kousky ano v odlehčené verzi po ověření (dřív BLOCKED 2 a 3), cíl noci (dřív BLOCKED 4, noc se nestaví).

BLOCKED: **Zastávky v půlce místa: jak moc je stavět?** Zastávka je pojmenovaná budova v půlce cesty mezi dvěma místy, aby hráč cítil postup i mezi nimi (příklad: „Past the Grain Silo.“ ve výsledku). (a) 16 nových dominant ve 3D (nejvíc práce, 3D M–L); (b) **jen D2–D4 a pojmenovat budovu, která už v katalogu čtvrti je** (3D S–M); (c) žádné zastávky, jen řádek těsnosti „37 m short of …“. **Doporučení: (b).** D1 je hustá sama, a pojmenovat existující budovu je skoro zadarmo; (c) by D3–D4 nechalo s mezerami ~10 hodů mezi místy.

BLOCKED: **Poštovní brašna (Mailbag) III bez noci.** Třetí úroveň se otevírá na místě 13 a měla se zaplatit i v noci. Bez noci má na návratnost jen ~40 hodů do finále (příklad: stojí 900 ◈, vrátí se třeba až za 45 hodů, tedy po konci hry, a koupit ji by byla past). (a) **nechat a zlevnit tak, aby se vrátila do finále** (simulace ověří); (b) jen 2 úrovně (D2 a D3); (c) posunout III do D3. **Doporučení: (a)**, zachová „velký okamžik“ karty D4 a hráč, který ji koupí, nebude potrestán.
