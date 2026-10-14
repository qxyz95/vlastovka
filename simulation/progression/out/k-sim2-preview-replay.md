# Simulátor progrese: k-sim2-preview-replay

Spuštěno 2026-10-14T19:49:31.888Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 39 / 16.3 | 25 / 13.2 | 23 / 14.4 | 18 / 12.4 | 99 / 53.9 | 17.6 · 25.1 · 29.2 · 29.9 | 34.5 / 68.7 | 92 % |
| average|realistic|auto|preview | 100 % | 29 / 13.5 | 25 / 12.8 | 8 / 5.4 | 21 / 13.5 | 78 / 43.9 | 18.3 · 24.2 · 30.8 · 33.1 | 34.6 / 41.2 | 96 % |
| expert|realistic|auto|better | 100 % | 20 / 9.2 | 29 / 16.0 | 23 / 14.1 | 12 / 10.0 | 76 / 43.4 | 19.1 · 23.4 · 29.5 · 34.5 | 35.8 / 62.9 | 90 % |
| weak|realistic|auto|preview | 100 % | 39 / 16.1 | 24 / 13.9 | 14 / 8.2 | 18 / 13.4 | 92 / 51.8 | 17.6 · 26.6 · 27.6 · 34.4 | 36.8 / 70.8 | 91 % |
| expert|realistic|auto|preview | 100 % | 21 / 10.4 | 22 / 12.9 | 15 / 10.1 | 8 / 5.4 | 63 / 36.9 | 23.0 · 27.0 · 29.2 · 38.4 | 36.6 / 46.0 | 94 % |
| average|realistic|auto|better | 100 % | 31 / 14.3 | 25 / 13.1 | 20 / 12.3 | 17 / 12.0 | 83 / 45.5 | 18.3 · 22.5 · 28.3 · 33.5 | 34.7 / 44.4 | 96 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 8 / 8 | 8 / 16 | 44 | 78 % | 47 % | 13 % | 0 % | – |
| average|realistic|auto|preview | 2 / 5 / 5 | 5 / 12 | 42 | 76 % | 42 % | 13 % | 0 % | – |
| expert|realistic|auto|better | 1 / 4 / 4 | 5 / 13 | 30 | 72 % | 43 % | 15 % | 0 % | 0 % |
| weak|realistic|auto|preview | 1 / 7 / 7 | 7 / 12 | 42 | 78 % | 62 % | 13 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 4 / 4 | 5 / 9 | 35 | 65 % | 81 % | 11 % | 0 % | 0 % |
| average|realistic|auto|better | 2 / 8 / 8 | 7 / 12 | 28 | 74 % | 34 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|better | 2373 / 4090 / 5638 / 6032 | 2078 / 3890 / 4728 / 6075 | workshop 1120, paper 4820, atlas 8680, pocket 300, model 1850 | 1102 |
| average|realistic|auto|preview | 2006 / 4171 / 2394 / 6970 | 1720 / 3743 / 2373 / 6935 | workshop 1120, paper 5520, atlas 6930, pocket 300, model 900 | 821 |
| expert|realistic|auto|better | 1411 / 4499 / 5055 / 4523 | 1133 / 4083 / 4720 / 3960 | paper 3420, workshop 1120, atlas 6305, pocket 300, model 2750 | 1730 |
| weak|realistic|auto|preview | 2412 / 4143 / 3460 / 6214 | 2145 / 3718 / 3405 / 5403 | workshop 1120, paper 4820, atlas 7680, pocket 300, model 750 | 1575 |
| expert|realistic|auto|preview | 1545 / 3710 / 4074 / 2360 | 1280 / 3105 / 4008 / 1753 | paper 3145, workshop 1120, atlas 4930, pocket 300, model 650 | 1638 |
| average|realistic|auto|better | 2222 / 4275 / 4555 / 5379 | 1955 / 3845 / 4490 / 4930 | workshop 1120, paper 4820, atlas 7555, pocket 300, model 1425 | 1250 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|better | dart: 28 % · 102 · 926 · 243; glider: 52 % · 182 · 1720 · 331; hawk: 13 % · 314 · 3045 · 487 · 100 % (72); kite: 6 % · 308 · 2983 · 387 · 100 % (75); needle: 1 % · 256 · 2469 · 541 · 25 % (92); skimmer: 1 % · 136 · 1261 · 327 · 25 % (54) |
| average|realistic|auto|preview | dart: 31 % · 110 · 1001 · 244; glider: 43 % · 165 · 1560 · 300; hawk: 25 % · 365 · 3557 · 545 · 100 % (59); needle: 0 % · 341 · 3315 · 619 · 25 % (77) |
| expert|realistic|auto|better | dart: 48 % · 153 · 1440 · 308; glider: 39 % · 220 · 2109 · 368; hawk: 5 % · 335 · 3257 · 499 · 100 % (53); kite: 4 % · 361 · 3513 · 424 · 50 % (64); needle: 4 % · 414 · 4046 · 699 · 75 % (69); skimmer: 1 % · 288 · 2787 · 470 · 50 % (68) |
| weak|realistic|auto|preview | dart: 16 % · 74 · 645 · 188; glider: 58 % · 141 · 1310 · 270; hawk: 19 % · 357 · 3478 · 540 · 100 % (69); kite: 7 % · 322 · 3127 · 390 · 50 % (74) |
| expert|realistic|auto|preview | dart: 15 % · 157 · 1471 · 318; glider: 73 % · 164 · 1543 · 284; hawk: 12 % · 396 · 3863 · 545 · 100 % (58) |
| average|realistic|auto|better | dart: 45 % · 129 · 1197 · 276; glider: 32 % · 189 · 1797 · 344; hawk: 21 % · 349 · 3392 · 520 · 100 % (65); kite: 1 % · 183 · 1735 · 339 · 75 % (67); needle: 1 % · 293 · 2835 · 557 · 25 % (74) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 0.5 % / 0 % · average|realistic|auto|preview 1.3 % / 25 % · expert|realistic|auto|better 0.3 % / 100 % · weak|realistic|auto|preview 1.1 % / 0 %

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
| Žádný let > 60 s (skutečný) | 70.8 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 100) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.92 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.77 | 0.6–0.75 | FAIL |
