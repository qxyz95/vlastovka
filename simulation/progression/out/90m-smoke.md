# Simulátor progrese: 90m-smoke

Spuštěno 2026-10-14T20:33:05.138Z, 20 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 36 / 15.6 | 23 / 13.5 | 18 / 11.3 | 14 / 9.9 | 86 / 48.1 | 17.9 · 27.0 · 28.6 · 34.9 | 35.1 / 78.9 | 91 % |
| average|realistic|auto|preview | 100 % | 28 / 13.3 | 24 / 12.9 | 12 / 8.2 | 15 / 10.9 | 78 / 42.2 | 18.8 · 24.3 · 29.3 · 34.1 | 35.4 / 77.0 | 97 % |
| expert|realistic|auto|preview | 100 % | 21 / 11.3 | 22 / 12.9 | 13 / 8.4 | 5 / 3.9 | 62 / 35.6 | 23.3 · 27.3 · 29.3 · 38.2 | 35.3 / 52.5 | 94 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 8 / 6 | 7 / 12 | 43 | 72 % | 65 % | 12 % | 0 % | – |
| average|realistic|auto|preview | 2 / 6 / 5 | 6 / 11 | 41 | 70 % | 52 % | 13 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 4 / 4 | 5 / 10 | 36 | 63 % | 75 % | 13 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2278 / 4117 / 5600 / 6197 | 1984 / 3810 / 5025 / 5375 | workshop 1120, paper 5660, atlas 6188, pocket 300, model 725, mailbag 2200 | 1914 |
| average|realistic|auto|preview | 2013 / 4372 / 3824 / 6898 | 1707 / 4185 / 3399 / 6086 | workshop 1120, paper 5240, atlas 5846, mailbag 2200, pocket 300, model 670 | 1643 |
| expert|realistic|auto|preview | 1627 / 4049 / 4405 / 2211 | 1287 / 3691 / 4120 / 1785 | paper 3505, workshop 1120, atlas 3807, pocket 300, mailbag 1535, model 615 | 1200 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 15 % · 89 · 754 · 217; glider: 62 % · 156 · 1341 · 295; hawk: 19 % · 439 · 3427 · 656 · 95 % (70); kite: 5 % · 400 · 3082 · 474 · 35 % (72) |
| average|realistic|auto|preview | dart: 25 % · 128 · 1105 · 282; glider: 51 % · 167 · 1428 · 312; kite: 3 % · 448 · 3458 · 517 · 20 % (66); hawk: 21 % · 436 · 3471 · 646 · 95 % (62); needle: 0 % · 457 · 3429 · 962 · 5 % (82) |
| expert|realistic|auto|preview | dart: 14 % · 147 · 1277 · 306; glider: 73 % · 176 · 1528 · 304; hawk: 12 % · 432 · 3543 · 619 · 90 % (53); needle: 0 % · 647 · 4888 · 1021 · 5 % (64); kite: 1 % · 371 · 3154 · 448 · 15 % (59) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 0.5 % / 22 % · average|realistic|auto|preview 0.3 % / 20 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2447 / 18192 | 1.154 | 3.0 / 1.3 / 1.3 / 1.7 | 100 % (44) · 30 · 100 % · 53 % — 100 % (62) · 30 · 55 % · 100 % — 100 % (76) · 22 · 0 % · ∞ |
| average|realistic|auto|preview | 2211 / 17106 | 1.146 | 2.4 / 1.4 / 1.3 / 1.6 | 100 % (38) · 31 · 100 % · 58 % — 100 % (60) · 27 · 30 % · ∞ — 100 % (68) · 23 · 0 % · ∞ |
| expert|realistic|auto|preview | 1188 / 12292 | 1.105 | 2.5 / 0.9 / 1.3 / 1.2 | 100 % (31) · 26 · 100 % · 74 % — 90 % (46) · 29 · 0 % · ∞ — 35 % (61) · 20 · 0 % · ∞ |

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 28 | 34–46 | FAIL |
| Hody D2 (průměrný) | 24 | 36–48 | FAIL |
| Hody D3 (průměrný) | 12 | 37–49 | FAIL |
| Hody D4 (průměrný) | 15 | 36–48 | FAIL |
| Minuty D1 (průměrný) | 13.3 | 14–20 | FAIL |
| Minuty D2 (průměrný) | 12.9 | 18–24 | FAIL |
| Minuty D3 (průměrný) | 8.2 | 21–27 | FAIL |
| Minuty D4 (průměrný) | 10.9 | 23–29 | FAIL |
| Minuty celkem (průměrný) | 42.2 | 82–98 | FAIL |
| Let medián D1 [s] | 18.8 | ≤ 22 | OK |
| Let medián D2 [s] | 24.3 | ≤ 27 | OK |
| Let medián D3 [s] | 29.3 | ≤ 30 | OK |
| Let medián D4 [s] | 34.1 | ≤ 35 | OK |
| Let P90 [s] | 35.4 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 5 (max 6, P90 5) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 11 | ≤ 11 / ≤ 17 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.3 % / 20 % | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 52 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 70 % | 60 %–85 % | OK |
| Hody celkem (průměrný) | 78 | 150–185 | FAIL |
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 15 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
| Sucho bez nákupu ani novinky P90 | 4 | ≤ 5 | OK |
| Poryv + holub mezi QTE D1 (bez variant) | 94 % | ≤ 95 % | OK |
| Poryv + holub mezi QTE D2 (bez variant) | 78 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D3 (bez variant) | 72 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D4 (bez variant) | 55 % | ≤ 60 % | OK |
| Hody mezi nákupy medián D1–D4 / P90 | 3 / 2 / 2 / 2 / 5 | ≤ 1 / 2 / 2 / 2 / ≤ 4 | FAIL |
| Mezi zastávkami (zastávky v simulátoru nejsou) | – | 05 §7.2 | NOT ASSESSED |
| Fronta novinek (není v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Varianty událostí: přínos a první setkání (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Délka letu: varianty, vír a lampiony (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Kousky (05 §4.6, běh bez --tricks) | – | brána 6 z 8 | NOT ASSESSED |
| Žádný let > 60 s (skutečný) | 78.9 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 97) | 100 % | OK |
| Slabý / průměrný (minuty) | 1.14 | ≤ 1.35 | OK |
| Expert / průměrný (hody) | 0.79 | ≥ 0.69 | OK |
| Expert / slabý (hody) | 0.72 | 0.6–0.75 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (weak) | 1.15 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (weak, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.15 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (expert) | 1.10 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (expert, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
