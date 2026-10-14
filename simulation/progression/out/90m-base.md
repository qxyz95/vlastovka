# Simulátor progrese: 90m-base

Spuštěno 2026-10-14T20:36:13.080Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 36 / 15.7 | 23 / 13.1 | 15 / 9.3 | 14 / 9.5 | 86 / 47.7 | 18.1 · 26.8 · 29.3 · 34.4 | 35.1 / 78.9 | 91 % |
| average|realistic|auto|preview | 100 % | 29 / 13.4 | 24 / 12.9 | 14 / 9.1 | 11 / 7.7 | 78 / 42.1 | 18.9 · 24.5 · 29.1 · 34.4 | 34.6 / 77.0 | 98 % |
| expert|realistic|auto|preview | 100 % | 21 / 10.5 | 21 / 12.6 | 12 / 7.9 | 3 / 2.3 | 58 / 33.1 | 22.6 · 27.1 · 29.3 · 38.8 | 34.6 / 63.2 | 94 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 8 / 6 | 6 / 12 | 41 | 72 % | 58 % | 12 % | 0 % | – |
| average|realistic|auto|preview | 1 / 6 / 5 | 6 / 11 | 41 | 70 % | 59 % | 14 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 5 / 4 | 5 / 10 | 36 | 61 % | 72 % | 11 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2335 / 4140 / 5182 / 6434 | 2029 / 3905 / 4620 / 5696 | workshop 1120, paper 5640, atlas 6435, pocket 300, model 583, mailbag 2170 | 1800 |
| average|realistic|auto|preview | 2059 / 4459 / 4539 / 5641 | 1752 / 4225 / 3920 / 5186 | workshop 1120, paper 5207, atlas 5720, mailbag 2155, pocket 300, model 580 | 1498 |
| expert|realistic|auto|preview | 1600 / 4000 / 4125 / 2001 | 1296 / 3639 / 3793 / 1748 | paper 3468, workshop 1114, atlas 3603, pocket 300, mailbag 1438, model 552 | 1147 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 16 % · 84 · 719 · 205; glider: 57 % · 146 · 1260 · 278; hawk: 24 % · 421 · 3321 · 630 · 98 % (67); kite: 2 % · 407 · 3141 · 480 · 20 % (74) |
| average|realistic|auto|preview | dart: 25 % · 128 · 1106 · 283; glider: 56 % · 175 · 1497 · 323; kite: 1 % · 421 · 3301 · 497 · 13 % (66); hawk: 18 % · 451 · 3554 · 667 · 97 % (62); needle: 0 % · 457 · 3429 · 962 · 2 % (82) |
| expert|realistic|auto|preview | dart: 15 % · 141 · 1231 · 296; glider: 71 % · 170 · 1482 · 298; hawk: 12 % · 422 · 3481 · 607 · 95 % (51); kite: 2 % · 392 · 3134 · 468 · 15 % (52); needle: 0 % · 647 · 4888 · 1021 · 2 % (64) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 0.5 % / 12 % · average|realistic|auto|preview 0.3 % / 13 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2400 / 18092 | 1.151 | 3.0 / 1.3 / 1.3 / 1.7 | 100 % (44) · 29 · 100 % · 54 % — 100 % (63) · 29 · 50 % · ∞ — 97 % (75) · 24 · 2 % · ∞ |
| average|realistic|auto|preview | 2123 / 16698 | 1.143 | 2.3 / 1.4 / 1.2 / 1.7 | 100 % (39) · 29 · 100 % · 60 % — 100 % (58) · 27 · 30 % · ∞ — 95 % (68) · 23 · 0 % · ∞ |
| expert|realistic|auto|preview | 1113 / 11725 | 1.101 | 2.2 / 1.0 / 1.3 / 1.1 | 100 % (31) · 27 · 93 % · 81 % — 82 % (46) · 30 · 4 % · ∞ — 32 % (59) · 21 · 0 % · ∞ |

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 29 | 34–46 | FAIL |
| Hody D2 (průměrný) | 24 | 36–48 | FAIL |
| Hody D3 (průměrný) | 14 | 37–49 | FAIL |
| Hody D4 (průměrný) | 11 | 36–48 | FAIL |
| Minuty D1 (průměrný) | 13.4 | 14–20 | FAIL |
| Minuty D2 (průměrný) | 12.9 | 18–24 | FAIL |
| Minuty D3 (průměrný) | 9.1 | 21–27 | FAIL |
| Minuty D4 (průměrný) | 7.7 | 23–29 | FAIL |
| Minuty celkem (průměrný) | 42.1 | 82–98 | FAIL |
| Let medián D1 [s] | 18.9 | ≤ 22 | OK |
| Let medián D2 [s] | 24.5 | ≤ 27 | OK |
| Let medián D3 [s] | 29.1 | ≤ 30 | OK |
| Let medián D4 [s] | 34.4 | ≤ 35 | OK |
| Let P90 [s] | 34.6 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 1 / 5 (max 6, P90 5) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 11 | ≤ 11 / ≤ 17 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.3 % / 13 % | – | – |
| Strop E zasažen (lety) | 14 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 59 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 70 % | 60 %–85 % | OK |
| Hody celkem (průměrný) | 78 | 150–185 | FAIL |
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 14 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
| Sucho bez nákupu ani novinky P90 | 3 | ≤ 5 | OK |
| Poryv + holub mezi QTE D1 (bez variant) | 94 % | ≤ 95 % | OK |
| Poryv + holub mezi QTE D2 (bez variant) | 78 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D3 (bez variant) | 68 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D4 (bez variant) | 55 % | ≤ 60 % | OK |
| Hody mezi nákupy medián D1–D4 / P90 | 3 / 2 / 2 / 2 / 4 | ≤ 1 / 2 / 2 / 2 / ≤ 4 | FAIL |
| Mezi zastávkami (zastávky v simulátoru nejsou) | – | 05 §7.2 | NOT ASSESSED |
| Fronta novinek (není v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Varianty událostí: přínos a první setkání (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Délka letu: varianty, vír a lampiony (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Kousky (05 §4.6, běh bez --tricks) | – | brána 6 z 8 | NOT ASSESSED |
| Žádný let > 60 s (skutečný) | 78.9 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 102) | 100 % | OK |
| Slabý / průměrný (minuty) | 1.13 | ≤ 1.35 | OK |
| Expert / průměrný (hody) | 0.74 | ≥ 0.69 | OK |
| Expert / slabý (hody) | 0.67 | 0.6–0.75 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (weak) | 1.15 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (weak, medián; vráceno) | ∞ (2 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.14 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (expert) | 1.10 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (expert, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
