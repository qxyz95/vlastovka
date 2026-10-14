# Simulátor progrese: 90m-base-strat

Spuštěno 2026-10-14T20:42:12.827Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|realistic|auto|preview | 100 % | 29 / 13.4 | 24 / 12.9 | 14 / 9.1 | 11 / 7.7 | 78 / 42.1 | 18.9 · 24.5 · 29.1 · 34.4 | 34.6 / 77.0 | 98 % |
| average|no-models|auto|preview | 100 % | 29 / 13.1 | 24 / 13.2 | 21 / 12.7 | 18 / 11.6 | 90 / 50.8 | 18.9 · 24.5 · 29.2 · 30.4 | 33.0 / 45.0 | 98 % |
| average|models-first|auto|preview | 100 % | 30 / 13.5 | 19 / 11.9 | 17 / 14.8 | 19 / 15.6 | 86 / 57.9 | 18.6 · 31.0 · 43.4 · 40.3 | 52.8 / 74.6 | 98 % |
| average|no-mailbag|auto|preview | 100 % | 29 / 13.4 | 22 / 11.9 | 12 / 7.4 | 9 / 6.9 | 72 / 39.7 | 18.9 · 24.4 · 30.1 · 35.0 | 35.1 / 74.6 | 97 % |
| average|mailbag-first|auto|preview | 100 % | 29 / 13.4 | 24 / 12.7 | 14 / 9.2 | 11 / 7.6 | 78 / 43.2 | 18.9 · 24.4 · 29.1 · 33.4 | 34.3 / 77.1 | 98 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|realistic|auto|preview | 1 / 6 / 5 | 6 / 11 | 41 | 70 % | 59 % | 14 % | 0 % | – |
| average|no-models|auto|preview | 2 / 8 / 7 | 7 / 13 | 42 | 80 % | 77 % | 17 % | 0 % | – |
| average|models-first|auto|preview | 1 / 6 / 5 | 7 / 12 | 52 | 65 % | 17 % | 15 % | 0 % | – |
| average|no-mailbag|auto|preview | 1 / 6 / 5 | 6 / 11 | 39 | 70 % | 48 % | 15 % | 0 % | – |
| average|mailbag-first|auto|preview | 1 / 7 / 5 | 6 / 11 | 44 | 70 % | 57 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|realistic|auto|preview | 2059 / 4459 / 4539 / 5641 | 1752 / 4225 / 3920 / 5186 | workshop 1120, paper 5207, atlas 5720, mailbag 2155, pocket 300, model 580 | 1498 |
| average|no-models|auto|preview | 2015 / 4669 / 6594 / 8853 | 1720 / 4347 / 5949 / 8063 | workshop 1120, paper 8080, pocket 300, atlas 8394, mailbag 2185 | 1848 |
| average|models-first|auto|preview | 2069 / 3277 / 5403 / 8900 | 1731 / 2980 / 5130 / 8280 | workshop 1120, paper 4587, model 5300, atlas 4674, mailbag 2140, pocket 300 | 1254 |
| average|no-mailbag|auto|preview | 2059 / 3929 / 3434 / 4135 | 1752 / 3627 / 3236 / 3631 | workshop 1120, paper 4353, atlas 5853, pocket 300, model 620 | 1007 |
| average|mailbag-first|auto|preview | 2059 / 4363 / 5007 / 5692 | 1752 / 4078 / 4430 / 5120 | workshop 1120, paper 5527, atlas 5714, mailbag 2125, pocket 300, model 593 | 1558 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|realistic|auto|preview | dart: 25 % · 128 · 1106 · 283; glider: 56 % · 175 · 1497 · 323; kite: 1 % · 421 · 3301 · 497 · 13 % (66); hawk: 18 % · 451 · 3554 · 667 · 97 % (62); needle: 0 % · 457 · 3429 · 962 · 2 % (82) |
| average|no-models|auto|preview | dart: 25 % · 164 · 1381 · 349; glider: 75 % · 272 · 2191 · 469 |
| average|models-first|auto|preview | dart: 12 % · 60 · 505 · 146; hawk: 33 % · 272 · 2287 · 434 · 100 % (24); kite: 38 % · 324 · 2708 · 361 · 100 % (36); glider: 16 % · 62 · 525 · 134 |
| average|no-mailbag|auto|preview | dart: 26 % · 119 · 1092 · 263; glider: 50 % · 142 · 1322 · 267; hawk: 21 % · 351 · 3415 · 525 · 100 % (59); kite: 4 % · 345 · 3357 · 399 · 27 % (65); needle: 0 % · 341 · 3315 · 619 · 2 % (77) |
| average|mailbag-first|auto|preview | dart: 24 % · 130 · 1103 · 287; glider: 58 % · 184 · 1529 · 338; kite: 2 % · 407 · 3183 · 474 · 10 % (68); hawk: 16 % · 457 · 3533 · 681 · 93 % (63); needle: 0 % · 445 · 3332 · 940 · 7 % (87) |

Paper Crane v kampani (tah v letech / přes nové místo): average|realistic|auto|preview 0.3 % / 13 % · average|no-models|auto|preview 0.4 % / 10 % · average|models-first|auto|preview 0.5 % / 8 % · average|no-mailbag|auto|preview 0.4 % / 22 % · average|mailbag-first|auto|preview 0.4 % / 10 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| average|realistic|auto|preview | 2123 / 16698 | 1.143 | 2.3 / 1.4 / 1.2 / 1.7 | 100 % (39) · 29 · 100 % · 60 % — 100 % (58) · 27 · 30 % · ∞ — 95 % (68) · 23 · 0 % · ∞ |
| average|no-models|auto|preview | 3287 / 22131 | 1.173 | 2.3 / 1.3 / 1.4 / 1.8 | 100 % (38) · 28 · 100 % · 44 % — 100 % (57) · 30 · 95 % · 78 % — 98 % (73) · 24 · 17 % · ∞ |
| average|models-first|auto|preview | 2342 / 19649 | 1.133 | 2.6 / 2.4 / 1.4 / 1.2 | 100 % (51) · 22 · 100 % · 53 % — 100 % (64) · 26 · 43 % · ∞ — 93 % (75) · 25 · 5 % · ∞ |
| average|no-mailbag|auto|preview | 0 / 13557 | 1.000 | 2.3 / 1.2 / 1.4 / 1.4 | 0 % (–) · – · – · – — 0 % (–) · – · – · – — 0 % (–) · – · – · – |
| average|mailbag-first|auto|preview | 2465 / 17121 | 1.166 | 2.3 / 1.4 / 1.2 / 1.6 | 100 % (32) · 37 · 100 % · 58 % — 100 % (53) · 30 · 53 % · 100 % — 92 % (66) · 23 · 2 % · ∞ |

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
| Žádný let > 60 s (skutečný) | 77.1 | ≤ 60 | FAIL |
| Mailbag: příjem kampaně / bez Mailbagu (average, proti no-mailbag) | 1.23 | ≤ 1.2 | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.14 | ≤ 1.2 | OK |
| Mailbag: hody na další koupi / bez Mailbagu D1–D4 (average) | 1.00 / 1.15 / 0.89 / 1.18 | ≥ 0.85 | OK |
| Mailbag napřed rychlejší o (average, hody) | 0 % | ≤ 8 % | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
