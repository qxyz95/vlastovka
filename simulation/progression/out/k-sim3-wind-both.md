# Simulátor progrese: k-sim3-wind-both

Spuštěno 2026-10-14T21:00:08.239Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}},"bots":{"modelPick":{"wind":"both"}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 17 / 12.6 | 85 / 45.5 | 17.8 · 26.5 · 30.5 · 33.4 | 35.3 / 44.9 | 92 % |
| average|realistic|auto|preview | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 13 / 8.4 | 78 / 41.9 | 18.3 · 24.3 · 29.1 · 33.8 | 34.0 / 77.0 | 97 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 6 / 6 | 7 / 13 | 42 | 72 % | 47 % | 11 % | 0 % | – |
| average|realistic|auto|preview | 2 / 5 / 5 | 6 / 12 | 41 | 70 % | 62 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2265 / 3980 / 4360 / 7588 | 1975 / 3675 / 4010 / 6320 | workshop 1120, paper 5753, atlas 6040, pocket 300, model 567, mailbag 2200 | 2340 |
| average|realistic|auto|preview | 1925 / 4368 / 4991 / 5119 | 1618 / 4160 / 4297 / 4458 | workshop 1120, paper 5287, atlas 5177, mailbag 2200, pocket 300, model 450 | 1756 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 18 % · 100 · 856 · 240; glider: 50 % · 127 · 1111 · 251; hawk: 32 % · 418 · 3300 · 620 · 100 % (67) |
| average|realistic|auto|preview | dart: 28 % · 127 · 1086 · 278; glider: 54 % · 177 · 1528 · 327; hawk: 16 % · 462 · 3574 · 689 · 83 % (64); kite: 2 % · 387 · 3080 · 450 · 17 % (60) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 1.2 % / 17 %

Náhled s větrem „both“ (01 §2.10 bod 7), hody s modelem jen na jeden hod: weak|realistic|auto|preview 0.0 % · average|realistic|auto|preview 0.0 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2464 / 18193 | 1.156 | 3.1 / 1.4 / 1.2 / 1.6 | 100 % (44) · 29 · 100 % · 56 % — 100 % (64) · 30 · 50 % · ∞ — 100 % (75) · 27 · 0 % · ∞ |
| average|realistic|auto|preview | 2065 / 16402 | 1.141 | 2.6 / 1.4 / 1.4 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (60) · 31 · 33 % · ∞ — 100 % (68) · 24 · 0 % · ∞ |

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 28 | 34–46 | FAIL |
| Hody D2 (průměrný) | 25 | 36–48 | FAIL |
| Hody D3 (průměrný) | 19 | 37–49 | FAIL |
| Hody D4 (průměrný) | 13 | 36–48 | FAIL |
| Minuty D1 (průměrný) | 12.9 | 14–20 | FAIL |
| Minuty D2 (průměrný) | 13.7 | 18–24 | FAIL |
| Minuty D3 (průměrný) | 12.1 | 21–27 | FAIL |
| Minuty D4 (průměrný) | 8.4 | 23–29 | FAIL |
| Minuty celkem (průměrný) | 41.9 | 82–98 | FAIL |
| Let medián D1 [s] | 18.3 | ≤ 22 | OK |
| Let medián D2 [s] | 24.3 | ≤ 27 | OK |
| Let medián D3 [s] | 29.1 | ≤ 30 | OK |
| Let medián D4 [s] | 33.8 | ≤ 35 | OK |
| Let P90 [s] | 34.0 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 5 (max 5, P90 5) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 12 | ≤ 11 / ≤ 17 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.0 % / – | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 62 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 70 % | 60 %–85 % | OK |
| Hody celkem (průměrný) | 78 | 150–185 | FAIL |
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 16 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
| Sucho bez nákupu ani novinky P90 | 4 | ≤ 5 | OK |
| Poryv + holub mezi QTE D1 (bez variant) | 94 % | ≤ 95 % | OK |
| Poryv + holub mezi QTE D2 (bez variant) | 79 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D3 (bez variant) | 71 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D4 (bez variant) | 53 % | ≤ 60 % | OK |
| Hody mezi nákupy medián D1–D4 / P90 | 3 / 2 / 2 / 2 / 5 | ≤ 1 / 2 / 2 / 2 / ≤ 4 | FAIL |
| Mezi zastávkami (zastávky v simulátoru nejsou) | – | 05 §7.2 | NOT ASSESSED |
| Fronta novinek (není v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Varianty událostí: přínos a první setkání (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Délka letu: varianty, vír a lampiony (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Kousky (05 §4.6, běh bez --tricks) | – | brána 6 z 8 | NOT ASSESSED |
| Žádný let > 60 s (skutečný) | 77.0 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 96) | 100 % | OK |
| Slabý / průměrný (minuty) | 1.09 | ≤ 1.35 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (weak) | 1.16 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (weak, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.14 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
