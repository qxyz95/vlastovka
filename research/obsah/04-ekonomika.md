# Ekonomika mincí pro nové modely a skiny (výchozí rozbor)

**14. 10. 2026, balance-analyst.** Podklad pro zadání „další vlaštovky za mince a odemykatelný obsah“. Navazuje na návrh game designera `01-game-design.md` (modely Hawk, Kite, Skimmer, Sail, Needle). Ten dokument neměním, jen ho tady měřím. `params.mjs` se neměnil (sada F5). Průběh je v `runs/2026-10-14-obsah-balanc.md`.

**Vstupy.** FOUND: `simulation/progression/params.mjs` (F5, `targets`), 08 §10.2, 06 (rozhodnutí do 14. 10.), `12-ladeni2.md`, `out/f5-base-x2.md`, `out/f5-sens-x2.md`, `research/obsah/01-game-design.md`. ABSENT: hratelná verze modelů a jejich nových polí (`perfectK`, `liftK`, `ground`, `windK`, `droneBurst`), model chování hráče u kosmetiky.

**Běhy** (realistický nákupčí = reference, sada „šum ×2“ povinná, SKILLS doplňková):

| Běh | Příkaz (zkráceně) | Výstup |
|---|---|---|
| základ x2 | `run.mjs --profileset x2 --profiles weak,average,expert --strategies realistic --n 100 --no-probes --raw` | `out/obs-econ-x2.md` |
| základ SKILLS | totéž s `--profileset skills` | `out/obs-econ-skills.md` |
| citlivost statistik | x2, n 60, `--set models.dart.X` + `models.glider.X` | `out/obs-mod-base`, `-cruise5`, `-cruise10`, `-glide5`, `-speed5`, `-qte10`, `-trade5`, `-ideal4` |
| volba modelu | x2, n 60, `--models dart` / `glider` | `out/obs-mod-onlydart`, `-onlyglider` |
| „daň“ v mincích | x2, n 60, `--set pockets.prices=[1300,5040]` / `[2300,5040]` | `out/obs-tax-pocket1300`, `-pocket2300` |
| modely z 01 v místě kluzáku | x2, n 60, `--set models.glider={…}` | `out/obs-mod-hawk-as-glider`, `-needle-as-glider`, `-kite-as-glider` |
| sonda modelů na pevné výbavě | skript ve scratchpadu (čte simulátor, 120 letů na buňku) | jen tabulka v §3.2 |

Rozbor příjmů a výdajů je z `--raw` dat (příjem z doletu každého hodu, koupě s číslem hodu).

---

## 0. Shrnutí

1. **Mince nikde nepřebývají.** Průměrný hráč („šum ×2“) vydělá za kampaň ~24 000 ◈ a utratí ~22 700 ◈. Po nákupu mu zůstane medián 130–900 ◈, v cíli ~1 400 ◈. Nabídka je pořád dražší než příjem: v cíli zůstává **nekoupených 20 000–30 000 ◈ katalogu**, hlavně Neon Foil (úrovně 10–12 si v kampani nekoupí skoro nikdo) a 2. kapsa (5 040 ◈, nekoupí ji nikdo). **Každá mince za model tedy chybí na zrychlení.**
2. **Cena v mincích = hody navíc.** Příjem za hod roste s místem z ~33 ◈ (místo 1) na ~420 ◈ (místo 16) a skoro nezávisí na šikovnosti. Útrata, která nic nepřinese, prodlouží hru zhruba o `cena / příjem za hod`, v měření až o 1,4násobek (zpozdí i další nákupy). +1 000 ◈ v D3 = +5 hodů, +2 000 ◈ = +8 hodů a D3 vyjde 35 hodů (cíl ≤ 30).
3. **Rezerva v cílech je malá** (průměrný, „šum ×2“): D1 1 hod, D2 3, D3 5, D4 2. Ceny z `01` (400 / 700 / 1 000 / 1 400 / 2 000 = 5 500 ◈) jsou ~23 hodů příjmu a ~24 % útrat kampaně, ne 10 %. Kdyby modely nic nepřinesly, je to stejné jako „ceny ×1,25“ (všechny čtvrti nad cílem). Kdyby přinesly hodně, hra se zkrátí.
4. **Statistiky modelu mají v simulátoru velmi různou páku.** +5 % `speed` zkrátí hru o 14 %, +4° `ideal` o 23 %, +10 % `qte` o 9 %, +5 % `glide` o 4,5 %, +5 % `cruise` o 2 %. Základní čísla z `01` (bez nových polí) dávají: **Hawk +25–34 % doletu** (kvůli `ideal 34°`), v kampani −29 % hodů a D2 15 hodů (CRITICAL). **Needle** +26 % mincí za minutu, expert o 19 % méně hodů. **Kite** let P90 38 s a nejdelší 57 s, ještě před `liftK`.
5. **Skiny za postup ekonomiku nemění** (nic nestojí). Jen v simulátoru nejsou jako „novinka“, takže jejich vliv na sucho je NOT ASSESSED.
6. **Simulátor zatím umí jen Dart a Glider** s pevným pravidlem volby. Na modely za mince chybí katalog modelů s místem a cenou, nákup modelu jako nabídka, volba modelu podle větru a situace a odměna v `params.mjs`. Návrh je v §4.

**Verdikt základu (F5 beze změny): CONCERNS.** Neplní se známé odchylky z `12-ladeni2.md`, z nichž většinu 06 přijalo nebo posunulo. **Verdikt modelů z `01` s dnešními čísly: CRITICAL** (Hawk zkracuje hru pod cíle). Jde ale o zástupná čísla a nová pole nejsou změřená.

---

## 1. Příjem a výdaje dnes (sada F5)

### 1.1 Vzorec odměny

| | |
|---|---|
| Vzorec | `odměna = 10 + floor(max(0, dolet) / 10)` za hod |
| Kde | **napevno v `campaign.mjs`** (řádek s `st.lastReward`), ne v `params.mjs`. Porušuje pravidlo „čísla jen v params“, viz BLOCKED 1 |
| Proměnné | `10` = základ za hod (bez cesty v params, rozumně 0–20), `1/10` = mince za metr (bez cesty, 0,05–0,2), dolet v m |
| Rozsah | zdola omezený (≥ 10 ◈ i při doletu 0), shora neomezený, lineární v doletu. Záporný dolet ořízne `max(0, …)` |
| Příklad | dolet 1 300 m (konec D1) → 10 + 130 = **140 ◈**. Dolet 4 200 m (D4) → **430 ◈** |
| Zpětná vazba | **záměrná:** silnější vlaštovka vydělá víc, takže ceny můžou růst s čtvrtí. Rozhodnutí 06 (14. 10.): mince mají ve 3. kole růst rychleji než lineárně (násobitel podle čtvrti, „+X % mincí“). Ceny modelů proto definuji relativně k příjmu (§2.3), aby přepočet šel pravidlem |

### 1.2 Příjem po čtvrtích (medián kampaně, realistický nákup)

„◈/hod“ je průměrný příjem za hod v době, kdy je rekord v dané čtvrti.

| Sada / profil | hody D1 / D2 / D3 / D4 | příjem D1 / D2 / D3 / D4 [◈] | ◈/hod D1 / D2 / D3 / D4 | celkem příjem (P10–P90) | výdaj | zůstatek v cíli (P90) |
|---|---|---|---|---|---|---|
| x2 slabý | 42 / 28 / 30 / 31 | 2 632 / 5 128 / 8 246 / 10 884 | 63 / 179 / 273 / 340 | 26 863 (19 904–31 941) | 24 170 | 1 465 (3 831) |
| **x2 průměrný** | 34 / 27 / 25 / 28 | 2 263 / 4 808 / 6 962 / 10 004 | 67 / 181 / 284 / 359 | **24 198** (18 596–29 805) | **22 670** | **1 383** (4 009) |
| x2 expert | 23 / 21 / 18 / 15 | 1 722 / 3 945 / 5 077 / 5 461 | 75 / 187 / 275 / 354 | 16 577 (12 811–21 048) | 14 770 | 1 117 (2 803) |
| SKILLS slabý | 36 / 22 / 29 / 24 | 2 367 / 3 976 / 7 826 / 8 521 | 65 / 181 / 276 / 355 | 22 955 | 20 570 | 1 229 (3 092) |
| SKILLS průměrný | 30 / 23 / 20 / 23 | 2 062 / 4 293 / 5 956 / 8 653 | 70 / 184 / 298 / 373 | 20 926 | 18 570 | 1 231 (3 229) |
| SKILLS expert | 22 / 19 / 17 / 14 | 1 626 / 3 506 / 4 647 / 4 847 | 76 / 186 / 276 / 357 | 14 457 | 13 270 | 1 296 (2 606) |

**Po místech** (x2 průměrný, ◈/hod v době, kdy je rekord na místě k): 33 · 56 · 85 · 112 | 144 · 171 · 196 · 220 | 268 · 284 · 297 · 319 | 347 · 365 · 400 · 415. Slabý i expert mají na stejném místě skoro stejný příjem za hod (±10 %), liší se jen počtem hodů.

**Čtení:**
- Příjem za hod je dán místem, ne hráčem. **Pevná cena v mincích proto stojí každého hráče zhruba stejný počet hodů.** Slabý a průměrný hráč mají víc hodů, takže v cíli utratí víc. Expert utratí ~15 000 ◈ a v cíli mu chybí víc úrovní.
- Celkový příjem expertu je o třetinu nižší. Model za vysokou cenu ho tedy omezí víc než ostatní (podíl útrat).

### 1.3 Výdaje po čtvrtích (průměr ◈ na kampaň, x2 průměrný)

| Čtvrť | Dílna (Power, Folds) | Papír | Atlas | Kapsy | Zůstatek při vstupu do čtvrti (med) | Zůstatek po nákupu med / P90 maxima |
|---|---:|---:|---:|---:|---:|---:|
| D1 | 844 | 925 | 94 | 96 | 0 | 136 / 514 |
| D2 | 277 | 2 547 | 1 616 | 177 | 282 | 329 / 1 097 |
| D3 | 0 | 1 896 | 4 784 | 27 | 448 | 493 / 2 765 |
| D4 | 0 | 3 942 | 5 105 | 0 | 908 | 815 / 4 346 |

### 1.4 Katalog: co je v nabídce a co se nekoupí

Celý katalog F5 stojí **45 010 ◈**: Power 560, Folds 560, papír 25 620 (Copy 1 020, Kraft 2 400, Washi 10 800, Neon Foil 11 400), Atlas 12 930 (D1 390, D2 2 040, D3 6 000, D4 4 500), kapsy 5 340. Nabídka otevřená do konce čtvrti (kumulativně) je **5 230 / 18 070 / 40 510 / 45 010 ◈**, příjem průměrného x2 kumulativně **2 263 / 7 071 / 14 033 / 24 037 ◈**. Nabídka je tedy v každé čtvrti 2–3× větší než příjem. **Přebytek mincí bez možnosti utratit nevzniká nikde v kampani.**

V cíli zůstává nekoupené (průměr na kampaň):

| | papír koupen po úrovních 1–12 (podíl kampaní) | chybějící úrovně Atlasu | 2. kapsa | nekoupený katalog [◈] |
|---|---|---:|---:|---:|
| x2 slabý | 100 ×6 / 100 / 82 / 39 / 12 / 2 / 0 % | 1,5 | 0 % | 20 542 |
| x2 průměrný | 100 ×6 / 98 / 62 / 17 / 4 / 1 / 0 % | 1,6 | 0 % | 22 680 |
| x2 expert | 100 ×6 / 57 / 0 / 0 / 0 / 0 / 0 % | 4,9 | 0 % | 29 894 |
| SKILLS průměrný | 100 ×6 / 100 / 29 / 0 / 0 / 0 / 0 % | 2,5 | 0 % | 25 736 |

**Nálezy mimo zadání (pro orchestrátora, bez cíle v §10.2):**
- **Neon Foil se v kampani skoro nekupuje** (úroveň 10: 1–4 %). Hráč tak nejspíš neuvidí jeho vzhled (01-papiry: „duhová fólie“), dokud nedohraje. Pro art a skiny je to podstatné: Neon Foil je dnes v praxi obsah po finále.
- **2. kapsa (5 040 ◈) se nekoupí nikdy** (0 % ve všech 6 skupinách). Jde o věc, která se nevyplatí koupit. Realistický nákupčí v náhledu nevidí, že by se mu vyplatila víc než papír nebo Atlas.
- Obojí znamená, že konečný katalog „po finále“ už existuje: ~20–30 000 ◈ na Night Route (06: mince dál platí).

---

## 2. Kam vložit cenu modelu

### 2.1 Rezerva v cílech 08 §10.2 (průměrný hráč)

Rezerva = kolik hodů lze přidat, než čtvrť přeteče horní hranici (hody i minuty, platí přísnější). Převod na mince = rezerva × ◈/hod (bez násobku 1,4 z §2.2).

| Čtvrť | x2: hody (cíl) | x2: minuty (cíl) | **rezerva x2** | ≈ ◈ x2 | SKILLS: hody / minuty | rezerva SKILLS | ≈ ◈ SKILLS |
|---|---|---|---:|---:|---|---:|---:|
| D1 | 34 (25–35) | 14,8 (12–18) | **1 hod** | ~70 | 30 / 13,3 | 5 | ~350 |
| D2 | 27 (20–30) | 13,9 (10–16) | **3 hody** | ~540 | 23 / 12,3 | 7 | ~1 300 |
| D3 | 25 (20–30) | 14,9 (12–18) | **5 hodů** | ~1 400 | 20 / 12,7 | 10 | ~3 000 |
| D4 | 28 (20–30) | 16,8 (14–20) | **2 hody** | ~720 | 23 / 15,0 | 7 | ~2 600 |
| celkem | 113 hodů | 61,0 (50–75) | 14 min | | 96 / 52,1 | 23 min | |

Spodní hranice: SKILLS D3 má 20 hodů (cíl ≥ 20). **Model, který zrychlí, nesmí v SKILLS ubrat z D3 ani hod**, x2 má dole rezervu 5 hodů.

### 2.2 Měření „daně“: útrata bez účinku

Simulátor neumí nákup bez účinku (§4). Nejbližší náhrada: zdražit 1. kapsu, kterou si koupí 100 % hráčů (koupě se tím posune z ~42. na 70.–89. hod, tedy do D3).

| Běh (x2, n 60) | slabý hody | průměrný hody (D1–D4) | expert | odhad `cena / ◈ za hod` |
|---|---:|---|---:|---:|
| základ | 134 | 111 (34 / 27 / 25 / 27) | 79 | – |
| kapsa +1 000 ◈ | 139 (+5) | 116 (33 / 26 / **31** / 27) (+5) | 83 (+4) | +3,5 |
| kapsa +2 000 ◈ | 142 (+8) | 119 (33 / 26 / **35** / 26) (+8) | 84 (+5) | +7 |

Souhlasí to s citlivostí cen z F5 (`out/f5-sens-x2.md`): ceny ×1,25 (≈ +5 700 ◈ útrat) = +29 hodů, tedy **~200 ◈ na hod** napříč kampaní. Pravidlo pro odhad: **útrata bez účinku v místě k prodlouží hru o 1,0–1,4 × cena / (◈/hod na místě k)**. Útrata soustředěná do jedné čtvrti ji přeplní dřív, než se projeví v celkovém čase (D3 31 a 35 hodů).

### 2.3 Ceny z `01-game-design.md` proti příjmu

| Model | místo | cena 01 | ◈/hod x2 průměrný | hodů příjmu | čtvrť (rezerva x2) |
|---|---:|---:|---:|---:|---|
| Hawk | 4 | 400 | 112 | 3,6 | konec D1 / D2 (1 / 3) |
| Kite | 6 | 700 | 171 | 4,1 | D2 (3) |
| Skimmer | 8 | 1 000 | 220 | 4,5 | D2 (3) |
| Sail | 10 | 1 400 | 284 | 4,9 | D3 (5) |
| Needle | 14 | 2 000 | 365 | 5,5 | D4 (2) |
| **celkem** | | **5 500** | | **≈ 23 hodů** | rezerva celkem 11 hodů |

- **5 500 ◈ je ~24 % útrat průměrného x2 hráče (22 700 ◈), ~30 % SKILLS (18 600 ◈) a ~37 % experta**, ne 10 %. Odhad „Dílna ~30 000 ◈“ v `01` §2.8 počítá s celým katalogem, který si nikdo v kampani nekoupí (§1.4).
- **D2 dostává dva modely (1 700 ◈ ≈ 8–9 hodů) při rezervě 3 hody.** Časová osa v `01` §5 vychází z `out/f5-start-skills.md` (D2 30 hodů, D3 14, D4 18), tedy ze stavu **před** laděním F5. Dnes je D2 nejkratší čtvrť v SKILLS (23) a D3 a D4 mají 20–28 hodů. Teze „D2 je nejdelší, dejme do ní obsah“ už neplatí.
- Kritérium `01` §6.1 bod 4 („koupě posune cíl nejvýš o 2 hody“) je v rozporu s pravidlem ceny „4–5 hodů příjmu“: model bez účinku posune cíl o 4–6 hodů. Platí jedno z dvojice: buď cena ≤ 2 hody příjmu, nebo model musí za zbytek kampaně vrátit, co stál (pak ale zrychluje, viz §3).

### 2.4 Kam cenu vložit: tři možnosti

| Možnost | Co | Vliv na §10.2 | Riziko |
|---|---|---|---|
| **A. Malá cena v kampani** | cena = **k × ◈/hod na místě odemčení**, k = 1,5–2 | 5 modelů ≈ 9 hodů, D2 2 modely ≈ 3,5 hodu (na hraně) | koupě je „symbolická“, model musí být čistě boční (§3) |
| **B. Rozpočtově neutrální** | cena 3–5 hodů jako v 01, ale **stejná suma se ubere z katalogu stejné čtvrti** (např. Kraft / Washi / Atlas úr. 3) | délka beze změny, pokud modely nezrychlují | nutné přeladění F5 (strategie „Paper napřed“, „Atlas napřed“), workflow |
| **C. Za cílem** | modely (nebo část) se kupují po finále / v Night Route | žádný | 06 chce modely jako obsah kampaně (zadání), Night Route není hotová |

Možnost A, zástupná pásma (x2 průměrný, k = 1,5–2,0, zaokrouhleno na 10):

| Model | místo | ◈/hod | **pásmo A** | pro srovnání 01 |
|---|---:|---:|---:|---:|
| Hawk | 4 | 112 | **170–220** | 400 |
| Kite | 6 | 171 | **260–340** | 700 |
| Skimmer | 8 | 220 | **330–440** | 1 000 |
| Sail | 10 | 284 | **430–570** | 1 400 |
| Needle | 14 | 365 | **550–730** | 2 000 |
| celkem | | | **1 740–2 300** (≈ 8–10 hodů) | 5 500 |

Doporučuji **B pro kampaň a C pro Night Owl**, A jako nouzovou variantu, pokud se nechce přeladit F5. Ceny i pásma jsou zástupná. Ve 3. kole (06: rychlejší růst mincí) se přepočtou stejným pravidlem `k × ◈/hod`.

**Vzorec ceny modelu (návrh):**

| | |
|---|---|
| Vzorec | `cena(model) = round10(k · R(místo))`, `R(místo)` = medián příjmu za hod průměrného hráče x2, když je rekord na místě odemčení |
| Proměnné | `k` (návrh `economy.modelPriceK`, dnes neexistuje), rozumně 1,5–2 (A) nebo 3–5 (B, s odečtem z katalogu). `R` se měří simulátorem (§1.2), ne ručně |
| Rozsah | omezený zdola i shora: R je 33–415 ◈ (místa 1–16), takže cena 50–2 100 ◈ pro k ≤ 5. k = 0 dá model zdarma |
| Příklad | Sail, místo 10, R = 284, k = 2 → **570 ◈** ≈ 2 hody příjmu |
| Zpětná vazba | žádná, pokud se R měří na základu bez modelů. Když se R měří s modely, které zrychlují, ceny rostou s jejich silou (**k utlumení**: R brát vždy ze základu) |

### 2.5 Kde jsou v kampani hluchá místa

- **Sucho P90 11 (x2) / 9 (SKILLS), cíl ≤ 8** je v D3 a D4, kdy hráč šetří na Washi a Neon. Koupě je v simulátoru „novinka“. Levný model (pásmo A) v D3 a D4 by sucho přerušil a stál málo hodů. Odemčení Sail (místo 10) a Needle (14) proto leží na dobrém místě. Model v D2 (Kite, Skimmer) sucho nezlepší, tam sucho není problém.
- **Mezi místy P90 15 (x2)** se v kampani modely nezmění, protože jejich odemčení je vázané na místo.
- **D1 je plná** (x2 34 z 35 hodů): v D1 žádná cena. Hawk na místě 4 je na hraně D1 a D2. Bezpečnější je cena splatná až po hranici D1, nebo Hawk na místě 5.
- **Skiny a razítka za postup** nic nestojí a ekonomiku nemění. Pokud padnou do sucha (podpisový skin, razítko za první perfekt), můžou být tou „drobnou novinkou“, kterou 06 (k F5, bod 1) chce pro D3 a D4. Simulátor je dnes jako novinku nepočítá: **NOT ASSESSED**.

---

## 3. Riziko: model, který zkrátí kampaň

### 3.1 Páka jednotlivých statistik (citlivost)

x2, n 60, změna u Dartu i Glideru zároveň (jako by nový model nahradil oba), průměrný hráč:

| Změna | hody (D1–D4) | Δ hodů | minuty | let P90 / max [s] | expert hody |
|---|---|---:|---:|---|---:|
| základ | 111 (34 / 27 / 25 / 27) | – | 60,3 | 31,7 / 53,7 | 79 |
| `cruise` +5 % | 109 | −2 % | 57,9 | 30,9 / 49,1 | 78 |
| `cruise` +10 % | 107 | −4 % | 55,9 | 30,3 / 48,6 | 77 |
| `glide` +5 % | 106 | −4,5 % | 57,8 | 32,3 / 51,4 | 75 |
| `qte` +10 % | 101 | −9 % | 56,4 | 32,8 / 53,9 | 70 |
| **`speed` +5 %** | **95** (30 / 22 / 23 / 22) | **−14 %** | 52,8 | 33,2 / 54,4 | 67 |
| **`ideal` +4°** | **86** (28 / 19 / 18 / 23) | **−23 %** | 50,7 | 34,9 / 53,7 | 61 |
| `cruise` +5 %, `glide` −5 % | 116 | +4,5 % | 60,2 | 30,1 / 51,9 | 79 |
| jen Dart (bez volby) | 120 | +8 % | 60,0 | 28,7 / 48,0 | 83 |
| jen Glider | 108 | −3 % | 60,9 | 32,8 / 55,6 | 76 |

Rozptyl n 60 je asi ±3 hody. Čtení:
- **`speed` a `ideal` jsou nejsilnější páky.** Obě zvyšují start (vyšší oblouk) a tím dobu letu. Delší let znamená víc událostí a push událostí škáluje s π. Výška = čas = dolet.
- `ideal` není „statistika“, kterou hráč vidí. Je to práh, nad kterým se strmý hod trestá (`steepPenalty`). Model s vyšším `ideal` dostane silnější strmý hod zadarmo.
- `cruise` a `glide` mají páku malou. Výměna „rychlost za klouzavost“ 1 : 1 není neutrální: −5 % `glide` stojí víc než +5 % `cruise`.
- **Druhý model sám o sobě zrychlí hru o ~8 %** (jen Dart 120 hodů, s volbou 111). Každý další boční model přidá volbu, a tedy zisk navíc, i když je „stejně silný“ (hráč si bere maximum, viz §3.3).

### 3.2 Modely z `01` jen se základními statistikami (bez nových polí)

**Sonda na pevné výbavě** (x2, 120 letů, nejlepší úhel). Dolet proti Dartu, skutečná délka letu, mince za minutu `(10 + x/10) / ((let + 8 s) / 60)`, průměrný hráč:

| Model | konec D1 | konec D2 | konec D3 | plná výbava |
|---|---|---|---|---|
| Dart | 1 282 m / 21,5 s / 281 | 2 080 / 23,4 / 417 | 3 482 / 24,1 / 670 | 5 786 / 25,9 / 1 042 |
| Glider | +3 % / 25,8 s / 252 | +3 % / 27,4 / 379 | +5 % / 27,8 / 627 | +9 % / 30,2 / 1 010 |
| **Hawk** | **+28 %** / 30,7 s / 269 | **+26 %** / 32,4 / 404 | **+27 %** / 32,0 / 680 | **+31 %** / 35,1 / 1 072 |
| Kite | +3 % / **31,3 s** / 216 | +4 % / 33,5 / 327 | +6 % / 33,1 / 553 | +13 % / **37,3** / 878 |
| Skimmer | −27 % / 14,6 s / 276 | −25 % / 16,9 / 399 | −27 % / 17,2 / 626 | −29 % / 18,8 / 949 |
| Sail | −5 % / 24,2 s / 245 | −5 % / 26,1 / 365 | −5 % / 26,4 / 597 | −2 % / 28,1 / 954 |
| **Needle** | +6 % / 16,7 s / **354** | +9 % / 19,4 / **517** | +5 % / 19,8 / **814** | +3 % / 22,1 / **1 201** |

Slabý a expert vycházejí podobně (Hawk +25–34 %, Needle ◈/min +23–26 %).

**Kampaň** (x2, n 60): model z `01` místo Glideru od 100 m, volba „better“:

| Běh | slabý | průměrný hody / min (D1–D4) | expert | let P90 / max | Verdikt |
|---|---:|---|---:|---|---|
| základ | 134 | 111 / 60,3 (34 / 27 / 25 / 27) | 79 | 31,7 / 53,7 | – |
| Hawk | 95 | **79 / 46,7** (26 / **15** / **17** / 22) | 57 | 36,6 / 52,4 | **CRITICAL:** celkem < 50 min, D2 a D3 < 20 hodů |
| Needle | 139 | 113 / **53,3** (33 / 23 / 24 / 32) | **64** | 26,5 / 42,3 | CONCERNS: −12 % minut, expert −19 % hodů, D4 32 |
| Kite | 136 | 111 / **65,5** (34 / 25 / 25 / 28) | 82 | **38,2 / 56,9** | CONCERNS: +9 % minut, nejdelší let 57 s (bez `liftK`) |

Skimmer a Sail bez svých polí (`ground`, `skip`, `windK`) jsou slabší než Dart a v kampani by je bot nevolil, proto jsem je v kampani neměřil. **Nová pole jsou NOT ASSESSED** (v simulátoru nejsou).

### 3.3 Omezení, která musí game design respektovat

1. **Rozpočet statistik podle páky, ne 1 : 1.** Pro hrubé síto (linearizace z §3.1, změna hodů průměrného x2 na +1 % statistiky):
   `Δhody % ≈ −2,9·Δspeed% − 0,9·Δglide% − 0,9·Δqte% − 0,4·Δcruise% − 5,7·Δideal[°]`
   Nový model má mít součet **0 ± 2 %** proti modelu, který nahrazuje. Síto je hrubé (Hawk vychází −42 %, změřeno −29 %). Rozhoduje kampaň v simulátoru.
2. **`ideal` a `speed` drží nový model na úrovni Dartu (18–22°, ≤ 20).** Strmý a pomalý model (Hawk 34°, Kite 40°) potřebuje mnohem silnější trest než `speed` −15 %. Jinak získá výšku, čas a události zadarmo.
3. **Výhoda jen situační a jen tam, kde ji hráč nemůže mít pořád.** Hráč si model volí před každým hodem a vítr vidí předem. Výhoda vázaná na vítr (Sail) se tedy vybere vždy, když fouká zadní vítr (40 % hodů podle vah větru). Pravidlo: **nejlepší model pro každý hod (maximum přes všechny vlastněné modely) smí dát nejvýš +5 % doletu proti nejlepšímu z Dartu a Glideru**, měřeno simulátorem s volbou modelu (§4). Dnešní dva modely dávají ~8 % proti samotnému Dartu.
4. **Doba letu:** model nesmí zvednout medián letu čtvrti nad cíl (D4 ≤ 35 s), P90 nad 45 s ani jeden let nad 60 s. Kite má už se základními čísly nejdelší let 57 s a P90 38 s (`liftK` přidá). Hlídat i bez zrychlení klouzání (reduced motion, `--set warp.factor=1`).
5. **Mince za minutu:** odměna je za dolet, ne za čas. Kratší let se stejným doletem zvedá mince i místa za minutu (Needle +26 %). Pravidlo z `01` (≤ 1,10× nejlepšího jiného modelu) platí. Dnešní čísla Needle ho porušují už bez `droneBurst`.
6. **Šikovnost středně (06):** poměr expert / průměrný je v x2 na hraně (0,70, přijato 0,69). Modely, které víc odměňují perfekt (Hawk `perfectK`) nebo zkracují lety (Needle: expert −19 % hodů), ho posunou pod hranici. **Žádný model nesmí zvětšit rozdíl expert / slabý.** Výhoda za šikovnost musí být vyvážená trestem za minutí (`missK`) tak, aby průměrný hráč s modelem nebyl rychlejší.
7. **Koše:** všechno, co násobí push, jde pod strop E (už v `01`). `liftK` pod dobu letu. `windK` násobí vítr, takže Sail + Pinwheel úr. 3 (bez protivětru) = jistý zadní vítr: zakázat kombinaci, nebo `windK` u Sail při `noHeadwind` snížit (už v `01`, měřit).
8. **Cena a síla nezávisle:** dražší model nesmí být silnější. Kdyby byl, kupuje se jako další úroveň papíru a přebírá roli Dílny („Paper napřed“ by měl soupeře „Model napřed“, kontrola ≤ 10 %).

---

## 4. Co chybí v simulátoru (návrh rozšíření, mechaniky neměním)

| # | Chybí | Návrh | Dopad |
|---|---|---|---|
| 1 | **Odměna napevno v `campaign.mjs`** | `params.economy.reward = {base:10, perMeter:.1}`, později `districtMult:[…]` (3. kolo) | nutné pro 3. kolo i pro ceny `k × R` |
| 2 | **Jen dva modely** (Dart, Glider), odemčení kluzáku natvrdo na 100 m | katalog `params.models.<id> = {…statistiky, unlockPlace, price}`. Model je v nabídce od rekordu na `unlockPlace`, koupě je nabídka `kind:'model'` s náhledem U1 (přehrát poslední hody s modelem) | změří zpoždění koupě i zisk |
| 3 | **Volba modelu** porovná jen poslední dolet Dartu a Glideru (+15 % zkouška) | `bots.modelPick: 'last' | 'preview'`: před hodem známý vítr, hráč odhadne dolet každého vlastněného modelu (náhled s chybou jako u realistického nákupčího) a vezme nejlepší | situační výhody (Sail, Needle), kritérium §3.3 bod 3 |
| 4 | **Nová pole modelu** (`perfectK`, `missK`, `liftK`, `pushK`, `ground`, `skip`, `windK`, `droneBurst`) | v `model.mjs` (`resolve`, `integrate`, odraz, dron), výchozí hodnoty neutrální (1 / 0), testy v `tests/progression*.test.js` | bez toho jsou Hawk, Kite, Skimmer, Sail a Needle NOT ASSESSED |
| 5 | **Nákup bez účinku** (kosmetika, test daně) | `params.economy.sinks = [{id, place, price}]` jako nabídka bez účinku. Bot ji koupí podle pravidla `bots.cosmetic` (např. až má `price + rezerva`) | přímé měření §2.2 místo náhrady přes kapsu |
| 6 | **Novinky mimo místa a koupě** | `params.novelty`: počítat i odemčení siluety modelu, skin, razítko (s podmínkou, např. první perfekt typu události) | vliv skinů a razítek na sucho P90 |
| 7 | **Strategie** | `no-models` (modely nekupuje), `models-first` (koupí hned po odemčení), metriky podíl hodů po modelech, ◈ a místa za skutečnou minutu po modelech | kritéria `01` §6.1 body 1–4 |
| 8 | **Ekonomika ve výstupu** | do `summarize`: příjem a ◈/hod po čtvrtích a místech, výdaje po druzích, zůstatek, nekoupený katalog, podíl kampaní s koupí každé položky (dnes jen přes `--raw` a skript) | kontrola přebytků bez vlastních skriptů |
| 9 | **Po finále** (Night Route) | mimo rozsah, dokud Night Route nemá návrh | Night Owl NOT ASSESSED |

Body 1–4, 6 a 7 mění `campaign.mjs`, `model.mjs` a testy. To je změna mechaniky simulátoru, kterou jako balance-analyst nedělám (viz BLOCKED 2).

---

## 5. Cíle 08 §10.2 na základu (F5 beze změny)

`out/obs-econ-x2.md` (n 100) a `out/obs-econ-skills.md` (n 100), průměrný hráč, realistický nákup, bez kapsové matice a sond.

| Metrika (08 §10.2) | Cíl | x2 | SKILLS | Verdikt | Poznámka |
|---|---|---|---|---|---|
| Hody D1 / D2 / D3 / D4 | 25–35 / 20–30 ×3 | 34 / 27 / 25 / 28 | 30 / 23 / 20 / 23 | HEALTHY | x2 D1 na hraně, SKILLS D3 na spodní hranici |
| Minuty D1–D4 | 12–18 / 10–16 / 12–18 / 14–20 | 14,8 / 13,9 / 14,9 / 16,8 | 13,3 / 12,3 / 12,7 / 15,0 | HEALTHY | |
| Minuty celkem | 50–75 | 61,0 | 52,1 | HEALTHY | |
| Slabý do 250 hodů | 100 % | 100 % (max 169) | 100 % (max 141) | HEALTHY | |
| Slabý / průměrný | ≤ 1,4 | 1,19 | 1,16 | HEALTHY | |
| Expert / průměrný | ≥ 0,7 | 0,70 (FAIL o zaokrouhlení) | 0,74 | CONCERNS | 06: 0,69 přijato |
| Expert / slabý | 0,6–0,75 | 0,59 | 0,64 | CONCERNS | jen x2 |
| Let medián D1–D4 | ≤ 22 / 27 / 30 / 35 | 17,8 / 23,2 / 27,7 / 28,0 | 18,4 / 23,7 / 28,3 / 29,4 | HEALTHY | |
| Let P90 / max | ≤ 45 / ≤ 60 | 31,4 / 55,5 | 32,6 / 51,9 | HEALTHY | |
| Sucho medián / P90 | ≤ 4 / ≤ 8 | 2 / 11 | 2 / 9 | CONCERNS | 06: řeší 3. kolo drobnou novinkou |
| Mezi místy medián / P90 | ≤ 8 / ≤ 14 | 8 / 15 | 7 / 13 | HEALTHY dle 06 | 06 posunulo pro x2 na P90 ≤ 16, `targets` v params to zatím nemá |
| První kapsa | 20–40 | 42 | 39 | HEALTHY dle 06 | x2 posunuto na ≤ 45 |
| Mince v cíli (koupené úrovně) | 60–85 % | 89 % | 85 % | HEALTHY dle 06 | x2 posunuto na ≤ 90 % |
| Strop E / β | ≤ 20 % / ≤ 25 % | 10 % / 0 % | 17 % / 0 % | HEALTHY | |
| Podíl kluzáku | 30–70 % | 55 % | 55 % | HEALTHY | |
| Paper Crane v kampani | – | 1,1 % / 3 % | 1,0 % / 2 % | bez cíle | |
| Kapsy, Dive, strategie nákupu, Atlas | viz §10.2 | – | – | NOT ASSESSED | tento rozbor je nespouštěl, poslední data `out/f5-*` |

**Celkový verdikt základu: CONCERNS** (sucho P90 a poměry šikovnosti v x2, vše známé z F5 a předané do 3. kola). Žádný CRITICAL: slabý dojde do 169. hodu, žádná smyčka bez odtoku (katalog je v cíli z 45–66 % nekoupený).

---

## 6. Doporučení (podle priority)

1. **Ceny modelů definovat relativně, `cena = k × R(místo)`, a v kampani je platit rozpočtově neutrálně (možnost B).** Stejnou sumu ubrat z katalogu téže čtvrti (návrh: Kraft a Washi úr. 1, Atlas D2 a D3 úr. 3). Dopad: délka čtvrtí se nemění, pokud modely nezrychlují. Riziko: posun strategií „Paper napřed“ a „Atlas napřed“. Ověřit workflow během x2 + SKILLS, n 200, se strategiemi realistic, paper-first, atlas-first. **Bez rozšíření simulátoru (§4 body 2 a 5) to nejde změřit.** Do té doby jako zástupné ceny pásmo A (§2.4: 170–220 / 260–340 / 330–440 / 430–570 / 550–730 ◈).
2. **Přepsat základní statistiky modelů v `01` podle §3.3:** `ideal` ≤ 22°, `speed` ≤ Dart, rozpočet podle páky. Hawk a Kite bez strmého `ideal`, Needle s doletem tak, aby ◈/min ≤ 1,10× Dartu. Dopad: odstraní CRITICAL (Hawk −29 % hodů). Riziko: modely budou mít menší „osobnost“, osu musí nést nové pole (`perfectK`, `liftK`, `windK`), ne základní čísla.
3. **Rozšířit simulátor (§4 body 1–8) před laděním modelů.** Nejdřív body 1, 2, 3 a 7 (odměna v params, katalog modelů s cenou, volba modelu podle náhledu, strategie no-models / models-first). Dopad: změří kritéria `01` §6.1 a §3.3. Riziko: změna kampaně, testy a CRN se musí zachovat (nový RNG stream pro volbu modelu).

---

## 7. NOT ASSESSED

- Nová pole modelů (`perfectK`, `missK`, `liftK`, `pushK`, `ground`, `skip +1`, `windK`, `droneBurst`): simulátor je nemá. Hawk, Kite, Skimmer, Sail a Needle jsou změřené jen se základními statistikami.
- Kampaň s více než dvěma modely, koupě modelu a volba modelu podle větru.
- Vliv skinů a razítek na sucho (nejsou novinkou v simulátoru).
- Ochota hráče utrácet za kosmetiku (žádná data, v návrhu `01` se kosmetika za mince nekupuje).
- Night Route, Night Owl a ekonomika po finále.
- Kapsy, Dive, strategie nákupu a bonusy Atlasu v tomto rozboru (beze změny proti `out/f5-*`).
- Profily good, weakAssist a auto (běhy jen weak, average, expert).
- Délka letu modelů bez zrychlení klouzání (reduced motion).

## 8. Otevřené volby

BLOCKED 1: **Odměna za hod je napevno v `campaign.mjs`** (`10 + floor(dolet/10)`), ne v `params.mjs`. Návrh: `params.economy.reward = {base:10, perMeter:.1}` a v `campaign.mjs` číst odtud (beze změny chování, test `odměna(1 300 m) = 140`). Dopad: ceny modelů i 3. kolo (násobitel čtvrti) půjdou ladit čísly. Doporučení: zadat game-dev spolu s bodem 2. Změna `campaign.mjs` není v mé roli.

BLOCKED 2: **Rozšíření simulátoru o modely za mince (§4 body 2–7)** mění `campaign.mjs`, `model.mjs` a testy. Příklad: `models.hawk = {speed:20, glide:3.2, cruise:11, ideal:18, qte:1, perfectK:1.4, missK:.06, unlockPlace:4, price:200}`, nabídka `kind:'model'`, strategie `no-models` / `models-first`. Dopad: bez toho nejde ověřit žádné kritérium z `01` §6.1. Doporučení: zadat game-dev (vlastník `model.mjs`, `campaign.mjs`, `tests/progression*.test.js`), pak navazující ladění cen workflow.

BLOCKED 3: **Kam s cenou modelů:** (A) malá cena 1,5–2 hody příjmu bez zásahu do katalogu, (B) 3–5 hodů příjmu a stejná suma ubraná z katalogu čtvrti, (C) modely až po finále. Příklad: Sail na místě 10 za 570 ◈ (A), nebo za 1 400 ◈ s Washi úr. 1 o 830 ◈ levnějším (B). **Doporučení: B** pro modely v kampani, C pro Night Owl. Rozhoduje uživatel přes orchestrátora.

BLOCKED 4: **Neon Foil a 2. kapsa se v kampani nekupují** (Neon úr. 10 1–4 %, kapsa 2 0 %). Nejde o cíl §10.2, ale o „věci, které se nevyplatí koupit“ a o vzhled papíru, který hráč v kampani neuvidí. Možnosti: (a) přijmout jako obsah po finále, (b) přeladit (levnější Neon úr. 1 nebo kapsa 2 za ~2 000 ◈) v rámci 3. kola. **Doporučení: (b) v 3. kole**, spolu s rozpočtem modelů, protože obojí bere ze stejných mincí v D3 a D4.
