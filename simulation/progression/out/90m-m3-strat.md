# Simulátor progrese: 90m-m3-strat

Spuštěno 2026-10-14T20:55:34.553Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":20,"glide":3.35,"drag":0.12,"cruise":12,"ideal":18,"qte":1.05,"perfectK":1.7,"missK":0.08,"unlockPlace":4,"price":450},"kite":{"speed":14,"glide":4.1,"drag":0.12,"cruise":11,"ideal":30,"qte":1.15,"liftK":1.2,"pushK":0.8,"unlockPlace":6,"price":770},"skimmer":{"speed":20,"glide":3.1,"drag":0.12,"cruise":12,"ideal":18,"qte":1.05,"ground":{"below":6,"glide":1.8},"skip":1,"unlockPlace":8,"price":1100},"sail":{"speed":14,"glide":4.15,"drag":0.12,"cruise":11,"ideal":30,"qte":1.1,"windK":3,"unlockPlace":10,"price":1560},"needle":{"speed":20,"glide":3.05,"drag":0.09,"cruise":14,"ideal":16,"qte":1,"windK":0.4,"droneBurst":3,"unlockPlace":14,"price":2190}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|no-models|auto|preview | 100 % | 29 / 13.1 | 24 / 13.2 | 21 / 12.7 | 18 / 11.6 | 90 / 50.8 | 18.9 · 24.5 · 29.2 · 30.4 | 33.0 / 45.0 | 98 % |
| average|models-first|auto|preview | 100 % | 33 / 15.1 | 30 / 16.4 | 25 / 15.5 | 22 / 14.1 | 108 / 59.4 | 18.7 · 23.6 · 29.2 · 30.7 | 33.7 / 45.7 | 98 % |
| average|no-mailbag|auto|preview | 100 % | 29 / 13.4 | 22 / 11.4 | 15 / 9.0 | 28 / 17.3 | 94 / 50.8 | 18.9 · 23.8 · 27.0 · 29.0 | 32.2 / 48.5 | 97 % |
| average|mailbag-first|auto|preview | 100 % | 29 / 13.4 | 25 / 12.9 | 17 / 10.2 | 19 / 12.1 | 90 / 48.2 | 18.9 · 24.1 · 27.0 · 28.6 | 31.1 / 44.0 | 98 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|no-models|auto|preview | 2 / 8 / 7 | 7 / 13 | 42 | 80 % | 77 % | 17 % | 0 % | – |
| average|models-first|auto|preview | 2 / 7 / 6 | 8 / 15 | 53 | 74 % | 17 % | 15 % | 0 % | – |
| average|no-mailbag|auto|preview | 2 / 9 / 8 | 6 / 13 | 39 | 80 % | 41 % | 16 % | 0 % | – |
| average|mailbag-first|auto|preview | 2 / 7 / 6 | 7 / 12 | 45 | 76 % | 46 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|no-models|auto|preview | 2015 / 4669 / 6594 / 8853 | 1720 / 4347 / 5949 / 8063 | workshop 1120, paper 8080, pocket 300, atlas 8394, mailbag 2185 | 1848 |
| average|models-first|auto|preview | 2408 / 5381 / 7907 / 9924 | 2090 / 5032 / 7254 / 8973 | workshop 1120, paper 6527, model 5888, atlas 7359, mailbag 2155, pocket 300 | 2210 |
| average|no-mailbag|auto|preview | 2059 / 3914 / 4822 / 9355 | 1752 / 3578 / 4502 / 8924 | workshop 1120, paper 6120, atlas 9247, pocket 300, model 1969 | 1201 |
| average|mailbag-first|auto|preview | 2059 / 4512 / 6401 / 8581 | 1752 / 4177 / 5895 / 7853 | workshop 1120, paper 6720, atlas 7521, mailbag 2170, model 1845, pocket 300 | 1743 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|no-models|auto|preview | dart: 25 % · 164 · 1381 · 349; glider: 75 % · 272 · 2191 · 469 |
| average|models-first|auto|preview | dart: 10 % · 61 · 511 · 148; hawk: 26 % · 238 · 2005 · 472 · 100 % (25); glider: 18 % · 88 · 764 · 179; kite: 24 % · 290 · 2403 · 461 · 100 % (41); skimmer: 3 % · 304 · 2501 · 548 · 100 % (56); sail: 18 % · 407 · 3194 · 641 · 100 % (71); needle: 0 % · 404 · 3064 · 801 · 92 % (96) |
| average|no-mailbag|auto|preview | dart: 16 % · 88 · 785 · 204; glider: 41 % · 162 · 1523 · 299; hawk: 33 % · 301 · 2912 · 539 · 100 % (42); kite: 9 % · 347 · 3373 · 528 · 75 % (76); skimmer: 1 % · 315 · 3052 · 527 · 60 % (79); sail: 0 % · 346 · 3368 · 537 · 2 % (70) |
| average|mailbag-first|auto|preview | dart: 16 % · 88 · 749 · 205; glider: 46 % · 183 · 1505 · 338; hawk: 34 % · 364 · 2879 · 653 · 100 % (45); skimmer: 1 % · 412 · 3151 · 690 · 65 % (75); kite: 3 % · 452 · 3456 · 688 · 27 % (78); needle: 0 % · 416 · 3104 · 790 · 22 % (85) |

Paper Crane v kampani (tah v letech / přes nové místo): average|no-models|auto|preview 0.4 % / 10 % · average|models-first|auto|preview 0.4 % / 7 % · average|no-mailbag|auto|preview 0.9 % / 10 % · average|mailbag-first|auto|preview 0.5 % / 4 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| average|no-models|auto|preview | 3287 / 22131 | 1.173 | 2.3 / 1.3 / 1.4 / 1.8 | 100 % (38) · 28 · 100 % · 44 % — 100 % (57) · 30 · 95 % · 78 % — 98 % (73) · 24 · 17 % · ∞ |
| average|models-first|auto|preview | 3544 / 25620 | 1.159 | 2.7 / 1.9 / 1.3 / 2.0 | 100 % (49) · 28 · 100 % · 40 % — 100 % (71) · 31 · 95 % · 74 % — 95 % (90) · 26 · 16 % · ∞ |
| average|no-mailbag|auto|preview | 0 / 20150 | 1.000 | 2.3 / 1.4 / 1.4 / 2.4 | 0 % (–) · – · – · – — 0 % (–) · – · – · – — 0 % (–) · – · – · – |
| average|mailbag-first|auto|preview | 3375 / 21553 | 1.184 | 2.3 / 1.4 / 1.3 / 1.9 | 100 % (32) · 37 · 100 % · 46 % — 100 % (54) · 31 · 92 % · 74 % — 97 % (70) · 23 · 19 % · ∞ |

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 48.5 | ≤ 60 | OK |
