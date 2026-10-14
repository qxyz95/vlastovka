# Ladění progrese po změnách pravidel ze 14. 10. (fáze F5)

**14. 10. 2026.** Fáze F5 z `11-plan-implementace.md`: po zapracování šesti rozhodnutí ze 14. 10. (`06-rozhodnuti.md`) přeladit čísla simulátoru `simulation/progression/` proti cílům `08` §10.2 se změnami měření podle 06 (Paper Crane, Shooting Star a Packing Tape mají vlastní metriky, sucho = P90). Postup jako v F3 (`10-ladeni.md`): měnila se **jen čísla v `params.mjs`**, mechaniky, kód simulátoru ani hra ne. Reference je realistický nákupčí, hlídají se obě sady profilů (SKILLS a „šum ×2“). Výsledky a tabulky jsou v `simulation/progression/REPORT.md`, surová data v `simulation/progression/out/f5-*.{md,json}`, sada F3 v `out/params-f3.json`, sada F5 v `out/f5-params.json` (= výchozí `params.mjs`).

## Shrnutí

- **Délky čtvrtí jsou v cíli v obou sadách.** Průměrný hráč SKILLS 30 / 23 / 20 / 23 hodů (13,3 / 12,1 / 12,8 / 14,3 min), celkem **96 hodů / 52 min**. „Šum ×2“ 34 / 27 / 25 / 28 hodů, **113 / 60 min**. Na startu F5 (pravidla 14. 10. s čísly F3) byla D3 14 a D4 18 hodů a hra 49 min. Druhý seed: 94 hodů / 50,7 min.
- **„Paper napřed“ už hru neprotahuje o desítky hodů.** Na startu F5 šetřil v D1 na Kraft (1 210 ◈) a byl pomalejší o 45 % (průměrný SKILLS, 160 hodů). Teď je pomalejší o 18 % (130 hodů), ve „šum ×2“ o 8 %. Pomohl levný a slabší Kraft, samotné zlevnění první úrovně nestačilo (viz část 3).
- **Let zůstal:** medián D4 29,3 / 28,0 s, P90 všech letů 32,5 / 31,4 s, nejdelší let 59,1 / 56,8 s (cíl ≤ 60).
- **Kapsy:** žádná volba nedominuje (nejlepší a druhá se liší o 0–2 %), nejlepší je pět různých speciálů, jen Cushion nikde. Viz část 4.
- **Nesplněno:** sucho P90 (9 / 11, cíl ≤ 8), bonusy Atlasu pára, Ad Drone a Pinwheel pod 3 % (v obou sadách), Packing Tape u slabého SKILLS (1,9 %), ve „šum ×2“ navíc Crowd Chain a hraniční Gull Escort, poměr expert / průměrný 0,69 a expert / slabý 0,58 ve „šum ×2“, „mezi místy“ P90 15, první kapsa 42. hod a 89 % koupených úrovní ve „šum ×2“, vysoké vybrání Dive −2,3 % v SKILLS. Rozbor a návrhy jsou v části 5.

## 1. Výchozí stav po změnách pravidel (`out/f5-start-*`)

Šest rozhodnutí ze 14. 10. s čísly F3 (průměrný hráč, realistický nákup):

| | SKILLS | „šum ×2“ |
|---|---|---|
| Hody D1 / D2 / D3 / D4 | 30 / 30 / **14** / **18** | 34 / **33** / **18** / 28 |
| Celkem | 93 hodů / **49,4 min** | 113 / 59,1 min |
| Paper napřed (průměrný) | o 45 % pomalejší (D1 66 hodů) | o 25 % pomalejší |
| Nejdelší let | **60,1 s** | 56,5 s |

Otevření papíru na 3. místě čtvrti odstranilo „zeď“ z F3, ale realistický hráč pak došel do cíle s Kraftem a jednou úrovní Washi. Washi a Neon Foil skoro nekupoval a D3 a D4 přeletěl hlavně díky Atlasu a rozptylu rekordu. „Paper napřed“ se změnil v „jen papír“: papír je teď v nabídce skoro pořád, takže strategie celou D1 šetřila na tři úrovně Kraftu a nekupovala Power, Folds ani Atlas.

## 2. Tabulka změn čísel proti F3

| Co | F3 | F5 | Proč |
|---|---|---|---|
| Kraft Paper (ceny) | 1 210 / 1 600 / 1 980 | **500 / 800 / 1 100** | Kraft se otevírá na 610 m (dřív 1 219 m) při příjmu ~70 ◈ za hod. Při ceně 1 210 šetřil „Paper napřed“ celou D1. |
| Kraft Paper (kroky π) | .70 / .70 / .70 | **.45 / .45 / .45** | levný Kraft nesmí hráče přenést přes D2 a D3. π po Kraftu 4,21 (F3 4,96). |
| Washi (ceny) | 3 360 / 4 080 / 4 800 | **2 800 / 3 600 / 4 400** | Washi teď nese D3 a D4 a má se kupovat |
| Washi (kroky) | .66 ×3 | **.70 ×3** | π po Washi 6,31 (F3 6,94) |
| Neon Foil (ceny) | 2 640 / 3 190 / 3 740 | **3 200 / 3 800 / 4 400** | otevírá se už v D3 (3 048 m), delší D4 |
| Neon Foil (kroky) | .64 ×3 | **.85 ×3** | celkové π plné výbavy zůstává **8,86**, takže se nemění rychlost ani délka letu na konci |
| Folds: okna | +20 % | **+25 %** | pomáhá nepřesným, zmenšuje rozdíl SKILLS proti „šum ×2“ |
| Atlas úr. 2 / 3, čtvrť D3 | 600 / 1 200 | **500 / 1 000** | „Atlas napřed“ u experta 22–29 % (cíl ≤ 20 %). Levnější Atlas zaplatily dražší Washi a Neon. |
| Atlas úr. 2 / 3, čtvrť D4 | 480 / 960 | **500 / 1 000** | sjednocení s D3 |
| Momentum | krok .008 / .018 / .028, strop .08 / .18 / .25 | **.004 / .014 / .022, strop .04 / .12 / .18** | úr. 1 zdarma na začátku D3 a úr. 2–3 zkracovaly D3 a D4. Na úr. 3 dává 5,5 % (F3 8,5 %). |
| Echo | .25 / .50 / .75 | **.10 / .40 / .50** | perfekt termiky (rozhodnutí 3) přidal Echu práci. Zkracovalo D3 a zvýhodňovalo přesné hráče. Úr. 3 6,8 % (F3 7,0 %). |
| Crowd Chain úr. 3 | krok .17 × 5 | **.21 × 5** | 3,1 % → 3,6 % (SKILLS) |
| Gull Escort úr. 3 (push) | .20 | **.22** | hraniční 3 % |
| Packing Tape | .30 / .45 / .60 | **.30 / .50 / .75** | slabý SKILLS 2,1 → 1,9 % (nezměnilo se, viz 5.3), slabý „šum ×2“ 7,6 % |
| Dive: strop střemhlavu `maxSink` | 3 (výchozí 14. 10.) | **2,2** | pády slabého „šum ×2“ 17 % → 11 % (cíl ≤ 15) |
| Dive: konverze vybrání / nízký průlet | .40 / .78 | **.36 / .74** | vysoké vybrání ±2 % |
| Dive: zrychlení střemhlavu `accel` | 2,4 | **2,2** | se stropem 2,2 a 2,4 byl Dive nejlepší kapsou u všech 8 kombinací profilu a sady a expert s ním na plné výbavě létal 32 s místo 29 s (nejdelší let 64 s). Viz část 4. |

Beze změny zůstaly: Copy Paper, Power, ceny Folds, Atlas D1 a D2, kapsy (300 / 5 040), všechny události včetně páry a dronu, Whistle, Calm Sky, Sharp Edge, Paper Rocket, Cushion, odměna `10 + dolet/10`, zrychlení klouzání a hodnoty přidané 14. 10. (`openAtPlace 3`, perfekt termiky ±0,08 s, Whistle okno ×0,8).

## 3. Průběh iterací

Iterace běžely ladicími skripty ve scratchpadu relace (`it.mjs`, `tune.mjs`, `atlas.mjs`, `ab.mjs`, `d4.mjs`, `fl.mjs`) s n = 50–60 kampaněmi na skupinu, finální běhy s n = 200 (pevné výbavy 200 letů na buňku, matice kapes 100 kampaní na buňku).

| Krok | Co se měnilo | Výsledek (průměrný SKILLS / „šum ×2“, hody D1–D4) | Poučení |
|---|---|---|---|
| s0 | start F5 | 30/30/14/19 · 34/32/18/27 | Washi skoro nikdo nekupuje |
| s1–s6 | jen ceny (Kraft 700–800, Atlas D3 900, Washi ×0,75, Neon levnější) | D2 se zkrátí, D3 zůstává 13–16 | cenami samotnými se D3 neprodlouží |
| t1–t7 | slabší úr. 1 Momentum a Echo, kroky Kraftu | D3 15–16 | |
| w1–w4 | levnější Kraft, Washi i Neon | hra 76–81 hodů, „Atlas napřed“ +40–55 % | |
| x1–x4 | Atlas D3 1 200 | D4 23–25, ale „Atlas napřed“ +35–55 % | dražší Atlas trestá „Atlas napřed“ |
| z1–a4 | **kroky přesunuty z Kraftu do Washi a Neonu** (.45 / .80–.90) | 30/23/18–22/19–22 | teprve slabší Kraft prodlouží D3 a D4 a zkrátí D2 ve „šum ×2“ |
| b1–d5 | Folds okna .25, Echo, Washi a Neon ceny | „Paper napřed“ jen −11 až −25 % | |
| e–l | push perfekt, termika, kroky Washi | jemné posuny, D4 SKILLS 18–20 | |
| K1af–K1d | Chain, Tape, Gull, Momentum úr. 2–3, Washi a Neon dražší, Atlas D3–D4 500 / 1 000 | **K1c: 30/23/22/24 · 33/27/26/27**, „Atlas napřed“ +14 / +8 % | levnější Atlas a dražší papír vyrovnají obě strategie „napřed“ |
| Dive | `maxSink` 2,2–2,3, konverze .33–.36 | pády slabého „šum ×2“ 11–13 % | |
| finále 1 | plný běh | Dive nejlepší kapsou všude (o 1–4 %), nejdelší let 64 s | Dive se škáluje s π (`accel·π`): na výbavě „konec D3“ −2 %, na plné výbavě +19 % |
| finále 2 | `dive.accel` 2,4 → 2,2 | viz části 4 a 5 | při 2,0 je Dive na „konec D3“ −6 až −8 %, tedy nepoužitelný |

**Zlevnění první úrovně Kraftu (kandidát ze zadání):** Kraft 700 / 1 300 / 1 900 se stejnými kroky zkrátil „Paper napřed“ jen ze 160 na 151 hodů a realistickému hráči zkrátil D2 na 22 hodů (hra 46 min). Strategie totiž šetří i na 2. a 3. úroveň, protože papír je v nabídce skoro pořád. Pomohla až kombinace levného a slabšího Kraftu se silnějším Washi a Neon Foil.

## 4. Kapsy (matice B22, minuty do cíle, realistický nákup)

Realistický nákup, 100 kampaní na buňku. Do 2. kapsy jde záložní Cushion / Sharp Edge jen při kladném náhledu. Tučně nejlepší.

**SKILLS**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 65,0 | 64,8 | 59,8 | **59,0 (3 %)** | 61,4 | 59,6 | 59,1 |
| průměrný | 56,6 | 54,7 | **50,5** | 51,3 (1 %) | 52,5 | 50,9 | 53,1 |
| dobrý | 51,3 | 48,6 | **43,9** | 45,2 (0 %) | 47,5 | 44,7 | 47,5 |
| expert | 46,0 | 44,2 | **38,2** | 40,3 (0 %) | 42,8 | 38,3 | 41,8 |

**„šum ×2“**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 75,0 | 74,1 | 70,8 | 71,1 (9 %) | 71,1 | 73,7 | **69,6** |
| průměrný | 65,8 | 63,7 | 61,7 | 61,4 (6 %) | **59,9** | 60,1 | 60,6 |
| dobrý | 55,9 | 55,0 | **50,6** | 52,8 (2 %) | 53,1 | 51,1 | 52,8 |
| expert | 48,5 | 47,8 | 42,6 | 45,2 (0 %) | 46,2 | **42,2** | 44,7 |

Nejlepší a druhá volba se liší o 0–2 % (cíl ≤ 8 %, OK). Nejlepší je Sharp Edge (4 z 8), Dive (slabý SKILLS), Paper Rocket (slabý „šum ×2“), Calm Sky (průměrný „šum ×2“) a Whistle (expert „šum ×2“). **Cushion není nejlepší nikde** (o 3–8 % za nejlepší), takže kontrola „každý nejlepší aspoň jednou“ formálně neprochází v žádné sadě, přes obě sady dohromady chybí jen Cushion. Cushion je pojistka proti tvrdému dopadu a ve výchozích kapsách slabého hráče zůstává jako záloha. Návrh: přijmout, případně hodnotit Cushion v situaci „první hody v D1“.

## 5. Splněné a nesplněné cíle

Úplná tabulka v `simulation/progression/REPORT.md` (oddíl „Cíle 08 §10.2 v obou sadách“). Souhrn: **SKILLS 53 OK / 7 FAIL, „šum ×2“ 48 OK / 12 FAIL** (F3: 46 / 15 a 42 / 19).

| Splněno v obou sadách | Nesplněno |
|---|---|
| hody i minuty D1–D4 a celkem, medián letu D1–D4, P90 a max letu, slabý do 250 hodů, slabý / průměrný, Paper napřed, Atlas napřed (všech 6 profilů), optimální nákup (info), strop E a β, podíl kluzáku, pády Dive, Crane Lift, Stone Skip (hodnota i 30–50 % letů), Momentum, Termika, Echo, On Air, Shooting Star v letu s hvězdou, rozpětí kapes ≤ 8 % | **obě sady:** sucho P90 (9 / 11), pára, Ad Drone, Pinwheel, „každá kapsa nejlepší“ (chybí Cushion). **Jen SKILLS:** vysoké vybrání Dive −2,3 %, Packing Tape u slabého 1,9 %. **Jen „šum ×2“:** mezi místy P90 15, první kapsa 42, koupené úrovně 89 %, expert / průměrný 0,69, expert / slabý 0,58, Crowd Chain 2,7 %, Gull Escort 3,0 % (zaokrouhleno pod hranicí) |

### 5.1 Sucho P90 9 (SKILLS) a 11 („šum ×2“), cíl ≤ 8; medián 2 OK
Nejdelší sucha jsou v D3 a D4, kdy hráč šetří na Washi a Neon Foil (2 800–4 400 ◈) a nové místo (305 m) při doletu 3–4 km padne jen občas. Levnější papír sucha zkrátí, ale zkrátí i D3 a D4 (iterace w1–w4: sucho P90 6–7, hra 76–81 hodů / 40–43 min). Čísly se nedá splnit sucho a délka čtvrtí zároveň. **Návrh (mechanika):** v D3 a D4 drobná novinka mezi místy, např. pravdivá těsnost U4 („37 m short of …“) nebo dílčí odměna za nový nejdelší let v rámci místa. Druhá možnost: připustit P90 ≤ 10 a hlídat dál „mezi místy“.

### 5.2 Mezi místy P90 15, první kapsa 42. hod a 89 % koupených úrovní („šum ×2“)
Všechny tři vycházejí z toho, že nepřesný hráč je o ~18 % pomalejší, ale ceny jsou pro obě sady stejné: déle šetří, a proto koupí víc úrovní a první kapsu později. V SKILLS jsou všechny tři v cíli (13, 38, 85 %). Navrhuji přijmout, případně posunout pásma pro „šum ×2“ (P90 ≤ 16, první kapsa ≤ 45, úrovně ≤ 90 %).

### 5.3 Bonusy Atlasu pod 3 %
| Bonus | průměrný SKILLS | průměrný „šum ×2“ | slabý SKILLS / „šum ×2“ |
|---|---:|---:|---:|
| Pára (Steam Hop) | 0,4 % | 0,0 % | 0,0 / −1,1 % |
| Ad Drone | 0,8 % | 0,2 % | −1,1 / −1,1 % |
| Pinwheel | 2,5 % | 2,6 % | 2,7 / 2,6 % |
| Crowd Chain | 3,6 % | **2,7 %** | 3,2 / 1,2 % |
| Gull Escort | 3,3 % | **3,0 %** | 3,0 / 2,6 % |
| Packing Tape (měří se u slabého) | – | – | **1,9** / 7,6 % |

Ostatní (Crane Lift, Stone Skip 47 / 31 % letů, Momentum, Termika, Echo, On Air) jsou 3,4–6,8 %, žádný nad 15 %. Shooting Star dává v letu s hvězdou +4,0 % (cíl ≥ 3 % OK), Paper Crane tahá v 7–12 % letů na plné výbavě (jen hlášení).
- **Pára a Ad Drone:** jde o rovnici s nulovým součtem. Nová událost ve směsi nahrazuje jiné události, takže dá zisk jen tehdy, když je výrazně silnější než průměr směsi. Perfekt termiky (rozhodnutí 3) termiku posílil (−0,2 → 3,4 %) a pára s dronem tím klesly z 1,2 / 2,6 % (F3) na ~0 %. Zkouška: silnější pára (push 3,2) a dron (push 3,0) je zvedly na 1,1 / 1,3 %, ale termiku stáhly na 1,6 %. Všechny tři nad 3 % by chtěly události asi dvakrát silnější než poryv a delší lety. **Návrh (mechanika):** páru a dron přidávat do rozvrhu **navíc** jako Shooting Star (ne vahou do směsi), nebo je měřit jako Shooting Star ziskem v letu, kde se objeví.
- **Pinwheel:** strop je daný slabým větrem (±12 %, rozhodnutí 06). Navrhuji přijmout jako v F3.
- **Crowd Chain a Gull Escort ve „šum ×2“:** oba se vážou na kombo a zásahy, takže nepřesnému hráči dávají méně. Silnější úr. 3 by v SKILLS dál zkracovala hru. Navrhuji přijmout (rozdíl je záměr dovednostních bonusů).
- **Packing Tape u slabého SKILLS (1,9 %):** slabý SKILLS trefuje ~91 % událostí, takže páska skoro nemá co zachraňovat. Ani .75 na úr. 3 (víc než částečný zásah) to nezměnilo. Ve „šum ×2“ dává slabému 7,6 %. **Návrh:** měřit Packing Tape v sadě „šum ×2“ (nebo „výpadek pozornosti“), pro kterou je určená.

### 5.4 Expert / průměrný 0,69 a expert / slabý 0,58 („šum ×2“); SKILLS 0,75 / 0,65 OK
Ve „šum ×2“ trefuje expert 92 % událostí, průměrný 84 %, slabý 70 %. Rozdíl dělá kombo, Echo, Stone Skip a Dive, tedy bonusy, které mají šikovnost odměňovat. Echo a Momentum jsou už oslabené a okna Folds rozšířená. Další oslabení by vzalo bonusům charakter. Je to o 0,01 / 0,02 pod hranicí, navrhuji přijmout.

### 5.5 Dive
Pády slabého 6 / 11 %, experta 0 / 0 % (OK). Vysoké vybrání −2,3 % (SKILLS, cíl ±2 %, „šum ×2“ −1,6 % OK). Hlavní nález: **zisk Dive roste s výbavou** (zrychlení `accel·π`): na výbavě „konec D3“ dává −2 až −7 %, na plné výbavě experta +10 až +19 % a let o 2–3 s delší. S `accel 2,4` byl proto v kampani nejlepší kapsou všude a nejdelší let měl 64 s. Hodnota 2,2 je kompromis. **Návrh (mechanika):** odvodit zrychlení a strop střemhlavu od `cruise` bez π (nebo π omezit), aby Dive měl v D2 i D4 podobnou cenu.

### 5.6 Splněno nově proti F3
D3 a D4 v obou sadách (F3 D3 16 / 18), minuty D2 ve „šum ×2“, „Atlas napřed“ u experta (20 / 16 %, F3 23 %) a u slabého s asistencí, nejdelší let ≤ 60 s v obou sadách, pády Dive ve „šum ×2“, Stone Skip ve „šum ×2“ (31 % letů), Packing Tape u slabého „šum ×2“, Shooting Star v letu s hvězdou, Crowd Chain v SKILLS.

## 6. Citlivost (stručně, plné tabulky v `REPORT.md`)
- Přepínače 14. 10. na chování F3 (průměrný SKILLS / „šum ×2“): papír na hranici čtvrti 95 / 111 hodů (beze změny, protože silný papír je teď až od Washi), termika bez perfektu 104 / 117 hodů (+8 / +4 %), Dive bez stropu a Whistle s plným oknem beze změny (průměrný a slabý nosí Rocket, Calm a Cushion).
- Ceny ×0,8 / ×1,25: 76 / 119 hodů, krok papíru ×0,9 / ×1,1: 109 / 84 hodů, rozestup událostí ×0,8 / ×1,25: 87 / 105 hodů. Hra je na ceny a krok papíru citlivá zhruba lineárně, jako v F3.
- Model nákupčího: trpělivost 3 / 10 = 104 / 91 hodů, chyba odhadu 0,25 / 0,8 = 94 / 97 hodů.

## 7. Návrhy pro uživatele (souhrn)
1. **Sucho v D3–D4:** přidat drobnou novinku mezi místy (např. U4 „37 m short of …“), nebo přijmout cíl P90 ≤ 10.
2. **Pára a Ad Drone:** přidávat do rozvrhu navíc jako Shooting Star, nebo je měřit ziskem v letu, kde se objeví. Ve směsi se třemi novými událostmi nemůžou všechny dát 3 %.
3. **Packing Tape** měřit v sadě „šum ×2“.
4. **Dive:** zrychlení a strop střemhlavu nezávislé na π, aby jeho síla nerostla s výbavou.
5. **Pásma pro „šum ×2“:** posunout „mezi místy“ P90, první kapsu a koupené úrovně, nebo přijmout. Expert / průměrný 0,69 přijmout.
6. **Strategie „Paper napřed“** je s papírem otevřeným na 3. místě strategie „jen papír“. Měří teď něco jiného než v F3 (hráč nekupuje Power ani Folds). Kontrola „≤ 10 % rychlejší“ dál platí a je splněná. Pro playtest stojí za ověření, jestli hráči papír opravdu takhle preferují.
