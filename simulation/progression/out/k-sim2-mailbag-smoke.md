# Simulátor progrese: k-sim2-mailbag-smoke

Spuštěno 2026-10-14T19:43:37.124Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 39 / 16.1 | 25 / 14.6 | 15 / 9.0 | 19 / 12.6 | 88 / 47.9 | 17.6 · 26.6 · 28.6 · 32.6 | 34.3 / 43.6 | 91 % |
| average|realistic|auto|preview | 100 % | 29 / 13.5 | 25 / 13.7 | 16 / 9.7 | 18 / 12.3 | 78 / 41.9 | 18.3 · 24.3 · 28.9 · 33.9 | 34.4 / 77.0 | 96 % |
| expert|no-mailbag|auto|preview | 100 % | 21 / 10.4 | 22 / 12.9 | 15 / 10.1 | 8 / 5.4 | 63 / 36.9 | 23.0 · 27.0 · 29.2 · 38.4 | 36.6 / 46.0 | 94 % |
| average|no-mailbag|auto|preview | 100 % | 29 / 13.5 | 25 / 12.8 | 8 / 5.4 | 21 / 13.5 | 78 / 43.9 | 18.3 · 24.2 · 30.8 · 33.1 | 34.6 / 41.2 | 96 % |
| expert|mailbag-first|auto|preview | 100 % | 21 / 10.4 | 25 / 14.7 | 11 / 6.9 | 6 / 4.4 | 62 / 36.1 | 23.0 · 27.3 · 30.7 · 37.7 | 36.0 / 47.0 | 95 % |
| weak|no-mailbag|auto|preview | 100 % | 39 / 16.1 | 24 / 13.9 | 14 / 8.2 | 18 / 13.4 | 92 / 51.8 | 17.6 · 26.6 · 27.6 · 34.4 | 36.8 / 70.8 | 91 % |
| average|mailbag-first|auto|preview | 100 % | 29 / 13.5 | 25 / 14.5 | 16 / 9.6 | 13 / 12.8 | 78 / 46.6 | 18.3 · 25.4 · 29.8 · 36.0 | 40.9 / 62.8 | 97 % |
| weak|mailbag-first|auto|preview | 100 % | 39 / 16.1 | 24 / 14.0 | 15 / 9.0 | 14 / 9.2 | 87 / 45.7 | 17.6 · 26.5 · 28.1 · 33.3 | 33.8 / 43.1 | 91 % |
| expert|realistic|auto|preview | 100 % | 21 / 10.4 | 22 / 12.9 | 18 / 11.5 | 9 / 6.4 | 63 / 36.7 | 23.0 · 27.4 · 30.3 · 36.6 | 36.3 / 43.2 | 94 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 6 / 6 | 7 / 14 | 45 | 74 % | 61 % | 11 % | 0 % | – |
| average|realistic|auto|preview | 1 / 4 / 4 | 6 / 12 | 41 | 70 % | 48 % | 12 % | 0 % | – |
| expert|no-mailbag|auto|preview | 1 / 4 / 4 | 5 / 9 | 35 | 65 % | 81 % | 11 % | 0 % | 0 % |
| average|no-mailbag|auto|preview | 2 / 5 / 5 | 5 / 12 | 42 | 76 % | 42 % | 13 % | 0 % | – |
| expert|mailbag-first|auto|preview | 1 / 4 / 4 | 5 / 11 | 45 | 65 % | 79 % | 14 % | 0 % | 0 % |
| weak|no-mailbag|auto|preview | 1 / 7 / 7 | 7 / 12 | 42 | 78 % | 62 % | 13 % | 0 % | – |
| average|mailbag-first|auto|preview | 2 / 5 / 5 | 7 / 11 | 47 | 70 % | 47 % | 13 % | 0 % | – |
| weak|mailbag-first|auto|preview | 2 / 5 / 5 | 7 / 14 | 45 | 72 % | 69 % | 12 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 4 / 4 | 5 / 9 | 35 | 65 % | 81 % | 12 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2412 / 4356 / 4365 / 7412 | 2145 / 4103 / 3778 / 5945 | workshop 1120, paper 5520, atlas 6180, pocket 300, model 650, mailbag 2200 | 2784 |
| average|realistic|auto|preview | 2006 / 4566 / 4206 / 5761 | 1720 / 4368 / 3685 / 4938 | workshop 1120, paper 5520, atlas 5095, pocket 300, mailbag 2200, model 475 | 1643 |
| expert|no-mailbag|auto|preview | 1545 / 3710 / 4074 / 2360 | 1280 / 3105 / 4008 / 1753 | workshop 1120, paper 3145, atlas 4930, pocket 300, model 650 | 1638 |
| average|no-mailbag|auto|preview | 2006 / 4171 / 2394 / 6970 | 1720 / 3743 / 2373 / 6935 | workshop 1120, paper 5520, atlas 6930, pocket 300, model 900 | 821 |
| expert|mailbag-first|auto|preview | 1545 / 3973 / 3899 / 3478 | 1280 / 3658 / 3655 / 3105 | paper 4120, workshop 1120, atlas 4008, mailbag 1750, pocket 300, model 400 | 1297 |
| weak|no-mailbag|auto|preview | 2412 / 4143 / 3460 / 6214 | 2145 / 3718 / 3405 / 5403 | workshop 1120, paper 4820, atlas 7680, pocket 300, model 750 | 1575 |
| average|mailbag-first|auto|preview | 2006 / 4583 / 4675 / 5844 | 1720 / 4283 / 4108 / 5155 | workshop 1120, paper 6420, atlas 4675, mailbag 2200, pocket 300, model 550 | 1780 |
| weak|mailbag-first|auto|preview | 2412 / 4557 / 4753 / 6631 | 2145 / 4260 / 3893 / 5873 | workshop 1120, paper 6220, atlas 5680, pocket 300, mailbag 2200, model 650 | 2295 |
| expert|realistic|auto|preview | 1545 / 3787 / 4387 / 2590 | 1280 / 3505 / 3870 / 2433 | paper 3145, workshop 1120, atlas 4173, pocket 300, mailbag 1550, model 800 | 1200 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 19 % · 107 · 900 · 255; glider: 54 % · 138 · 1198 · 268; hawk: 27 % · 428 · 3323 · 639 · 100 % (70) |
| average|realistic|auto|preview | dart: 33 % · 127 · 1081 · 278; glider: 44 % · 162 · 1421 · 303; hawk: 19 % · 460 · 3572 · 682 · 75 % (64); kite: 3 % · 387 · 3080 · 450 · 25 % (60) |
| expert|no-mailbag|auto|preview | dart: 15 % · 157 · 1471 · 318; glider: 73 % · 164 · 1543 · 284; hawk: 12 % · 396 · 3863 · 545 · 100 % (58) |
| average|no-mailbag|auto|preview | dart: 31 % · 110 · 1001 · 244; glider: 43 % · 165 · 1560 · 300; hawk: 25 % · 365 · 3557 · 545 · 100 % (59); needle: 0 % · 341 · 3315 · 619 · 25 % (77) |
| expert|mailbag-first|auto|preview | dart: 14 % · 166 · 1425 · 337; glider: 66 % · 158 · 1350 · 279; hawk: 20 % · 455 · 3543 · 643 · 100 % (52) |
| weak|no-mailbag|auto|preview | dart: 16 % · 74 · 645 · 188; glider: 58 % · 141 · 1310 · 270; hawk: 19 % · 357 · 3478 · 540 · 100 % (69); kite: 7 % · 322 · 3127 · 390 · 50 % (74) |
| average|mailbag-first|auto|preview | dart: 28 % · 113 · 947 · 250; glider: 46 % · 163 · 1396 · 303; kite: 14 % · 407 · 3202 · 458 · 50 % (59); hawk: 12 % · 486 · 3707 · 726 · 50 % (65) |
| weak|mailbag-first|auto|preview | dart: 15 % · 65 · 556 · 168; glider: 62 % · 157 · 1334 · 301; hawk: 23 % · 452 · 3476 · 675 · 100 % (70) |
| expert|realistic|auto|preview | dart: 11 % · 130 · 1173 · 275; glider: 76 % · 187 · 1611 · 321; hawk: 12 % · 400 · 3438 · 575 · 75 % (53); needle: 0 % · 647 · 4888 · 1021 · 25 % (64) |

Paper Crane v kampani (tah v letech / přes nové místo): average|no-mailbag|auto|preview 1.3 % / 25 % · weak|no-mailbag|auto|preview 1.1 % / 0 % · average|mailbag-first|auto|preview 0.3 % / 0 % · weak|mailbag-first|auto|preview 0.6 % / 0 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2591 / 18544 | 1.161 | 3.2 / 1.2 / 1.3 / 1.8 | 100 % (44) · 36 · 100 % · 56 % — 100 % (67) · 30 · 75 % · 100 % — 100 % (76) · 27 · 0 % · ∞ |
| average|realistic|auto|preview | 2139 / 16539 | 1.146 | 2.6 / 1.4 / 1.4 / 1.8 | 100 % (41) · 35 · 100 % · 69 % — 100 % (60) · 31 · 25 % · ∞ — 100 % (68) · 22 · 0 % · ∞ |
| expert|no-mailbag|auto|preview | 0 / 11688 | 1.000 | 2.4 / 0.9 / 1.4 / 1.2 | 0 % (–) · – · – · – — 0 % (–) · – · – · – — 0 % (–) · – · – · – |
| average|no-mailbag|auto|preview | 0 / 15541 | 1.000 | 2.6 / 1.2 / 1.3 / 1.4 | 0 % (–) · – · – · – — 0 % (–) · – · – · – — 0 % (–) · – · – · – |
| expert|mailbag-first|auto|preview | 1729 / 12895 | 1.149 | 2.4 / 0.9 / 1.1 / 0.9 | 100 % (22) · 43 · 100 % · 76 % — 100 % (47) · 28 · 25 % · ∞ — 50 % (57) · 26 · 0 % · ∞ |
| weak|no-mailbag|auto|preview | 0 / 16228 | 1.000 | 3.2 / 0.8 / 1.5 / 1.6 | 0 % (–) · – · – · – — 0 % (–) · – · – · – — 0 % (–) · – · – · – |
| average|mailbag-first|auto|preview | 2464 / 17108 | 1.167 | 2.6 / 1.4 / 1.2 / 1.1 | 100 % (32) · 37 · 100 % · 63 % — 100 % (56) · 30 · 50 % · ∞ — 100 % (68) · 23 · 0 % · ∞ |
| weak|mailbag-first|auto|preview | 2652 / 18353 | 1.169 | 3.2 / 0.8 / 1.3 / 1.6 | 100 % (39) · 38 · 100 % · 59 % — 100 % (62) · 29 · 50 % · ∞ — 100 % (76) · 23 · 0 % · ∞ |
| expert|realistic|auto|preview | 1133 / 12309 | 1.097 | 2.4 / 0.8 / 1.3 / 1.6 | 100 % (35) · 24 · 100 % · 82 % — 75 % (50) · 24 · 0 % · ∞ — 50 % (62) · 20 · 0 % · ∞ |

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 29 | 34–46 | FAIL |
| Hody D2 (průměrný) | 25 | 36–48 | FAIL |
| Hody D3 (průměrný) | 16 | 37–49 | FAIL |
| Hody D4 (průměrný) | 18 | 36–48 | FAIL |
| Minuty D1 (průměrný) | 13.5 | 14–20 | FAIL |
| Minuty D2 (průměrný) | 13.7 | 18–24 | FAIL |
| Minuty D3 (průměrný) | 9.7 | 21–27 | FAIL |
| Minuty D4 (průměrný) | 12.3 | 23–29 | FAIL |
| Minuty celkem (průměrný) | 41.9 | 82–98 | FAIL |
| Let medián D1 [s] | 18.3 | ≤ 22 | OK |
| Let medián D2 [s] | 24.3 | ≤ 27 | OK |
| Let medián D3 [s] | 28.9 | ≤ 30 | OK |
| Let medián D4 [s] | 33.9 | ≤ 35 | OK |
| Let P90 [s] | 34.4 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 1 / 4 (max 4, P90 4) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 12 | ≤ 11 / ≤ 17 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.0 % / – | – | – |
| Strop E zasažen (lety) | 12 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 48 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 70 % | 60 %–85 % | OK |
| Hody celkem (průměrný) | 78 | 150–185 | FAIL |
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 16 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
| Sucho bez nákupu ani novinky P90 | 4 | ≤ 5 | OK |
| Poryv + holub mezi QTE D1 (bez variant) | 93 % | ≤ 95 % | OK |
| Poryv + holub mezi QTE D2 (bez variant) | 80 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D3 (bez variant) | 70 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D4 (bez variant) | 51 % | ≤ 60 % | OK |
| Hody mezi nákupy medián D1–D4 / P90 | 3 / 2 / 2 / 2 / 5 | ≤ 1 / 2 / 2 / 2 / ≤ 4 | FAIL |
| Mezi zastávkami (zastávky v simulátoru nejsou) | – | 05 §7.2 | NOT ASSESSED |
| Fronta novinek (není v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Varianty událostí: přínos a první setkání (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Délka letu: varianty, vír a lampiony (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Kousky (05 §4.6, běh bez --tricks) | – | brána 6 z 8 | NOT ASSESSED |
| Žádný let > 60 s (skutečný) | 77.0 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 96) | 100 % | OK |
| Slabý / průměrný (minuty) | 1.14 | ≤ 1.35 | OK |
| Expert / průměrný (hody) | 0.81 | ≥ 0.69 | OK |
| Expert / slabý (hody) | 0.72 | 0.6–0.75 | OK |
| Mailbag: příjem kampaně / bez Mailbagu (weak, proti no-mailbag) | 1.14 | ≤ 1.2 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (weak) | 1.16 | ≤ 1.2 | OK |
| Mailbag: hody na další koupi / bez Mailbagu D1–D4 (weak) | 1.00 / 1.47 / 0.92 / 1.15 | ≥ 0.85 | OK |
| Mailbag napřed rychlejší o (weak, hody) | 1 % | ≤ 8 % | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (weak, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem kampaně / bez Mailbagu (average, proti no-mailbag) | 1.06 | ≤ 1.2 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.15 | ≤ 1.2 | OK |
| Mailbag: hody na další koupi / bez Mailbagu D1–D4 (average) | 1.00 / 1.12 / 1.13 / 1.32 | ≥ 0.85 | OK |
| Mailbag napřed rychlejší o (average, hody) | 0 % | ≤ 8 % | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem kampaně / bez Mailbagu (expert, proti no-mailbag) | 1.05 | ≤ 1.2 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (expert) | 1.10 | ≤ 1.2 | OK |
| Mailbag: hody na další koupi / bez Mailbagu D1–D4 (expert) | 1.00 / 0.93 / 0.92 / 1.26 | ≥ 0.85 | OK |
| Mailbag napřed rychlejší o (expert, hody) | 2 % | ≤ 8 % | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (expert, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
