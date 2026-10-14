# Simulátor progrese: k-sim2-before-mod

Spuštěno 2026-10-14T19:30:39.769Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|realistic|auto|better | 100 % | 31 / 14.3 | 25 / 13.1 | 20 / 12.3 | 17 / 12.0 | 83 / 45.5 | 18.3 · 22.5 · 28.3 · 33.5 | 34.7 / 44.4 | 96 % |
| expert|realistic|auto|better | 100 % | 20 / 9.2 | 29 / 16.0 | 23 / 14.1 | 12 / 10.0 | 76 / 43.4 | 19.1 · 23.4 · 29.5 · 34.5 | 35.8 / 62.9 | 90 % |
| expert|no-models|auto|better | 100 % | 20 / 9.2 | 20 / 11.2 | 19 / 12.7 | 13 / 8.2 | 69 / 40.4 | 18.9 · 26.2 · 29.2 · 30.8 | 35.0 / 44.9 | 96 % |
| average|no-models|auto|better | 100 % | 31 / 13.8 | 26 / 13.4 | 27 / 16.6 | 30 / 18.8 | 104 / 57.4 | 17.9 · 23.7 · 28.6 · 29.1 | 32.3 / 41.6 | 96 % |
| expert|models-first|auto|better | 100 % | 25 / 11.1 | 22 / 15.0 | 21 / 14.3 | 19 / 13.1 | 75 / 45.1 | 19.1 · 25.6 · 32.7 · 35.2 | 40.3 / 61.1 | 95 % |
| average|models-first|auto|better | 100 % | 31 / 14.1 | 24 / 13.6 | 22 / 15.1 | 19 / 13.1 | 93 / 53.2 | 18.3 · 24.3 · 31.4 · 34.6 | 36.3 / 43.9 | 97 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|realistic|auto|better | 2 / 8 / 8 | 7 / 12 | 28 | 74 % | 34 % | 13 % | 0 % | – |
| expert|realistic|auto|better | 1 / 4 / 4 | 5 / 13 | 30 | 72 % | 43 % | 15 % | 0 % | 0 % |
| expert|no-models|auto|better | 1 / 5 / 5 | 5 / 10 | 44 | 76 % | 58 % | 16 % | 0 % | 0 % |
| average|no-models|auto|better | 2 / 9 / 9 | 6 / 13 | 42 | 91 % | 53 % | 17 % | 0 % | – |
| expert|models-first|auto|better | 1 / 5 / 5 | 5 / 14 | 56 | 61 % | 21 % | 11 % | 0 % | 0 % |
| average|models-first|auto|better | 2 / 4 / 4 | 8 / 11 | 38 | 72 % | 15 % | 12 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|realistic|auto|better | 2222 / 4275 / 4555 / 5379 | 1955 / 3845 / 4490 / 4930 | workshop 1120, paper 4820, atlas 7555, pocket 300, model 1425 | 1250 |
| expert|realistic|auto|better | 1411 / 4499 / 5055 / 4523 | 1133 / 4083 / 4720 / 3960 | workshop 1120, paper 3420, atlas 6305, pocket 300, model 2750 | 1730 |
| expert|no-models|auto|better | 1384 / 3554 / 5237 / 3666 | 1203 / 3075 / 4738 / 3410 | paper 4120, workshop 1120, atlas 6885, pocket 300 | 1575 |
| average|no-models|auto|better | 2151 / 3854 / 7464 / 8548 | 1860 / 3573 / 7263 / 8300 | workshop 1120, paper 8020, atlas 11555, pocket 300 | 997 |
| expert|models-first|auto|better | 1734 / 4299 / 3736 / 5755 | 1428 / 3983 / 3778 / 5568 | paper 4120, workshop 1120, model 5500, atlas 3715, pocket 300 | 790 |
| average|models-first|auto|better | 2344 / 3686 / 5804 / 5647 | 2030 / 3523 / 5630 / 4665 | workshop 1120, paper 3420, model 5000, atlas 6008, pocket 300 | 1995 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|realistic|auto|better | dart: 45 % · 129 · 1197 · 276; glider: 32 % · 189 · 1797 · 344; hawk: 21 % · 349 · 3392 · 520 · 100 % (65); kite: 1 % · 183 · 1735 · 339 · 75 % (67); needle: 1 % · 293 · 2835 · 557 · 25 % (74) |
| expert|realistic|auto|better | dart: 48 % · 153 · 1440 · 308; glider: 39 % · 220 · 2109 · 368; hawk: 5 % · 335 · 3257 · 499 · 100 % (53); kite: 4 % · 361 · 3513 · 424 · 50 % (64); needle: 4 % · 414 · 4046 · 699 · 75 % (69); skimmer: 1 % · 288 · 2787 · 470 · 50 % (68) |
| expert|no-models|auto|better | dart: 52 % · 185 · 1754 · 353; glider: 48 % · 227 · 2173 · 374 |
| average|no-models|auto|better | dart: 51 % · 178 · 1686 · 365; glider: 49 % · 268 · 2581 · 452 |
| expert|models-first|auto|better | dart: 37 % · 119 · 1097 · 246; glider: 21 % · 163 · 1535 · 289; hawk: 22 % · 309 · 2990 · 441 · 100 % (18); kite: 9 % · 248 · 2389 · 306 · 100 % (32); skimmer: 3 % · 199 · 1899 · 415 · 100 % (48); sail: 1 % · 177 · 1672 · 376 · 100 % (55); needle: 7 % · 349 · 3396 · 623 · 100 % (72) |
| average|models-first|auto|better | dart: 28 % · 84 · 744 · 193; glider: 18 % · 164 · 1543 · 309; hawk: 46 % · 277 · 2678 · 425 · 100 % (23); kite: 2 % · 120 · 1104 · 240 · 100 % (39); skimmer: 3 % · 167 · 1570 · 341 · 100 % (49); sail: 2 % · 220 · 2105 · 397 · 100 % (60); needle: 1 % · 294 · 2842 · 585 · 75 % (77) |

Paper Crane v kampani (tah v letech / přes nové místo): expert|realistic|auto|better 0.3 % / 100 % · expert|no-models|auto|better 0.7 % / 0 % · average|no-models|auto|better 1.5 % / 0 % · expert|models-first|auto|better 0.6 % / 50 % · average|models-first|auto|better 1.7 % / 17 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 31 | 25–35 | OK |
| Hody D2 (průměrný) | 25 | 20–30 | OK |
| Hody D3 (průměrný) | 20 | 20–30 | OK |
| Hody D4 (průměrný) | 17 | 20–30 | FAIL |
| Minuty D1 (průměrný) | 14.3 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 12.3 | 12–18 | OK |
| Minuty D4 (průměrný) | 12.0 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 45.5 | 50–75 | FAIL |
| Let medián D1 [s] | 18.3 | ≤ 22 | OK |
| Let medián D2 [s] | 22.5 | ≤ 27 | OK |
| Let medián D3 [s] | 28.3 | ≤ 30 | OK |
| Let medián D4 [s] | 33.5 | ≤ 35 | OK |
| Let P90 [s] | 34.7 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 8 (max 8, P90 8) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 7 / 12 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.0 % / – | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 34 % | 30 %–70 % | OK |
| První kapsa (hod) | 28 | 20–40 | OK |
| Koupené úrovně v cíli | 74 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 62.9 | ≤ 60 | FAIL |
| Expert / průměrný (hody) | 0.92 | ≥ 0.7 | OK |
