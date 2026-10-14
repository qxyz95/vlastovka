# Simulátor progrese: k-sim-before

Spuštěno 2026-10-14T18:43:45.607Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | expert dolet | auto dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 178 | 226 | 293 | 188 | 16.6 / 15.6 | 15 |
| po Power 1 | 1.00 | 217 | 279 | 352 | 235 | 18.6 / 17.3 | 16 |
| po Paper 1 | 1.62 | 288 | 366 | 475 | 305 | 16.6 / 15.6 | 24 |
| střed D1 | 1.62 | 492 | 581 | 711 | 506 | 21.5 / 19.9 | 27 |
| konec D1 | 2.86 | 1232 | 1358 | 1456 | 1230 | 23.5 / 21.6 | 56 |
| konec D2 | 4.21 | 2003 | 2217 | 2358 | 1982 | 27.2 / 25.2 | 82 |
| konec D3 | 6.31 | 3388 | 3702 | 3957 | 3155 | 27.7 / 25.4 | 141 |
| střed D4 | 7.16 | 4407 | 4808 | 5532 | 4008 | 29.6 / 28.2 | 165 |
| plná výbava | 8.86 | 5718 | 6190 | 6963 | 5135 | 30.1 / 27.0 | 215 |
| plná bez Atlasu | 8.86 | 3928 | 4345 | 4657 | 3940 | 27.2 / 24.4 | 164 |
| plná, kluzák | 8.86 | 6208 | 6859 | 7474 | 5685 | 35.0 / 32.4 | 197 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 40 / 17.1 | 25 / 13.7 | 26 / 15.0 | 30 / 18.4 | 120 / 64.0 | 17.8 · 25.9 · 27.7 · 27.4 | 31.6 / 41.3 | 91 % |
| weak|random|auto|better | 100 % | 46 / 20.8 | 30 / 16.8 | 29 / 17.5 | 37 / 22.4 | 136 / 74.7 | 18.9 · 26.3 · 27.7 · 28.4 | 32.5 / 39.9 | 91 % |
| average|random|auto|better | 100 % | 41 / 19.3 | 26 / 13.2 | 21 / 12.3 | 33 / 20.6 | 117 / 63.5 | 19.0 · 22.7 · 27.3 · 28.3 | 32.0 / 41.2 | 97 % |
| expert|random|auto|better | 100 % | 33 / 16.0 | 27 / 14.0 | 16 / 10.0 | 12 / 7.6 | 84 / 48.0 | 21.3 · 24.1 · 29.9 · 30.8 | 33.8 / 45.5 | 91 % |
| auto|random|auto|better | 100 % | 45 / 21.4 | 40 / 20.2 | 26 / 15.7 | 36 / 21.6 | 141 / 76.0 | 19.1 · 23.4 · 27.3 · 26.9 | 31.4 / 43.6 | 100 % |
| average|realistic|auto|better | 100 % | 31 / 13.8 | 26 / 13.4 | 27 / 16.6 | 30 / 18.8 | 104 / 57.4 | 17.9 · 23.7 · 28.6 · 29.1 | 32.3 / 41.6 | 96 % |
| expert|realistic|auto|better | 100 % | 20 / 9.2 | 20 / 11.2 | 19 / 12.7 | 13 / 8.2 | 69 / 40.4 | 18.9 · 26.2 · 29.2 · 30.8 | 35.0 / 44.9 | 96 % |
| auto|realistic|auto|better | 100 % | 38 / 16.4 | 23 / 11.7 | 35 / 20.7 | 30 / 16.8 | 124 / 65.4 | 16.9 · 23.0 · 26.6 · 26.9 | 30.9 / 43.2 | 100 % |
| weak|balanced|auto|better | 100 % | 39 / 16.3 | 22 / 12.4 | 28 / 16.0 | 24 / 13.4 | 103 / 53.6 | 17.2 · 25.5 · 26.1 · 26.8 | 30.7 / 38.5 | 91 % |
| average|balanced|auto|better | 100 % | 28 / 12.8 | 21 / 10.8 | 25 / 15.3 | 20 / 12.4 | 99 / 52.0 | 17.6 · 23.6 · 28.6 · 28.0 | 31.9 / 38.6 | 96 % |
| expert|balanced|auto|better | 100 % | 21 / 9.9 | 15 / 8.9 | 27 / 14.5 | 11 / 7.0 | 76 / 41.9 | 19.2 · 26.3 · 27.5 · 30.3 | 34.6 / 42.5 | 93 % |
| auto|balanced|auto|better | 100 % | 33 / 13.7 | 22 / 12.0 | 30 / 16.9 | 21 / 12.8 | 104 / 53.8 | 16.1 · 24.9 · 25.5 · 27.2 | 29.8 / 39.0 | 100 % |
| weak|paper-first|auto|better | 100 % | 62 / 22.5 | 22 / 10.8 | 49 / 25.0 | 17 / 8.9 | 145 / 64.2 | 13.7 · 22.3 · 23.1 · 22.7 | 26.7 / 30.1 | 88 % |
| average|paper-first|auto|better | 100 % | 53 / 20.5 | 29 / 14.6 | 32 / 17.6 | 23 / 11.5 | 132 / 60.9 | 15.3 · 23.3 · 25.0 · 23.9 | 27.8 / 32.1 | 95 % |
| expert|paper-first|auto|better | 100 % | 37 / 15.5 | 23 / 12.3 | 46 / 24.3 | 17 / 8.5 | 121 / 59.8 | 17.1 · 23.4 · 25.2 · 24.5 | 27.7 / 37.5 | 99 % |
| auto|paper-first|auto|better | 100 % | 57 / 21.1 | 38 / 17.9 | 39 / 20.4 | 24 / 12.3 | 145 / 67.3 | 14.8 · 22.0 · 23.0 · 23.0 | 26.1 / 33.5 | 100 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 10 / 10 | 8 / 15 | 41 | 89 % | 61 % | 15 % | 0 % | – |
| weak|random|auto|better | 2 / 10 / 10 | 10 / 19 | 28 | 91 % | 60 % | 17 % | 0 % | – |
| average|random|auto|better | 2 / 9 / 9 | 9 / 19 | 30 | 89 % | 48 % | 19 % | 0 % | – |
| expert|random|auto|better | 2 / 4 / 4 | 7 / 14 | 25 | 78 % | 51 % | 15 % | 0 % | 0 % |
| auto|random|auto|better | 3 / 11 / 11 | 10 / 22 | 27 | 91 % | 72 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 9 / 9 | 6 / 13 | 42 | 91 % | 53 % | 17 % | 0 % | – |
| expert|realistic|auto|better | 1 / 5 / 5 | 5 / 10 | 44 | 76 % | 58 % | 16 % | 0 % | 0 % |
| auto|realistic|auto|better | 2 / 11 / 11 | 9 / 23 | 31 | 91 % | 64 % | 7 % | 0 % | – |
| weak|balanced|auto|better | 3 / 12 / 12 | 8 / 15 | 40 | 72 % | 64 % | 10 % | 0 % | – |
| average|balanced|auto|better | 3 / 11 / 11 | 6 / 14 | 42 | 72 % | 54 % | 13 % | 0 % | – |
| expert|balanced|auto|better | 2 / 11 / 11 | 5 / 9 | 39 | 63 % | 55 % | 15 % | 0 % | 0 % |
| auto|balanced|auto|better | 2 / 12 / 12 | 8 / 13 | 55 | 65 % | 63 % | 4 % | 0 % | – |
| weak|paper-first|auto|better | 5 / 15 / 15 | 9 / 19 | 116 | 39 % | 58 % | 0 % | 0 % | – |
| average|paper-first|auto|better | 5 / 18 / 18 | 8 / 17 | 134 | 39 % | 56 % | 0 % | 0 % | – |
| expert|paper-first|auto|better | 4 / 15 / 15 | 8 / 17 | 91 | 35 % | 53 % | 0 % | 0 % | 0 % |
| auto|paper-first|auto|better | 5 / 16 / 16 | 11 / 19 | 143 | 43 % | 61 % | 0 % | 0 % | – |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3388 | 5.9 % | 4.0 % | -1.3 % | -4.1 % (14 %) | 4.2 % | 9.4 % | -5.1 % |
| average | 3702 | 5.9 % | 3.4 % | 1.1 % | -7.5 % (8 %) | 6.7 % | 8.6 % | -4.1 % |
| expert | 3957 | 6.6 % | 12.3 % | 3.1 % | -2.0 % (0 %) | 11.0 % | 11.3 % | -5.4 % |
| auto | 3155 | 5.0 % | 5.9 % | 0.9 % | -6.7 % (17 %) | 2.5 % | 10.1 % | -1.6 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 3.7 % · pinwheel 1.5 % · steam 1.2 % · tape 1.9 % · crane 3.6 % · skip 6.4 % (50 % letů) · gull 4.0 % · momentum 3.8 % · thermal 2.2 % · echo 5.6 % · star 0.9 % (20 % letů) · drone 2.0 % · paperCrane 0.0 % (0 % letů) · onAir 3.6 %

Shooting Star úr. 3 v letech s hvězdou: 5.0 % (10 letů, hvězda v rozvrhu 17 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.3 % / 0 % · weak|random|auto|better 1.9 % / 0 % · average|random|auto|better 1.1 % / 20 % · expert|random|auto|better 0.9 % / 0 % · auto|random|auto|better 2.1 % / 0 % · average|realistic|auto|better 1.5 % / 0 % · expert|realistic|auto|better 0.7 % / 0 % · auto|realistic|auto|better 1.4 % / 0 % · weak|balanced|auto|better 0.2 % / 0 % · auto|balanced|auto|better 1.0 % / 0 % · weak|paper-first|auto|better 0.2 % / 0 % · average|paper-first|auto|better 0.8 % / 25 % · auto|paper-first|auto|better 0.2 % / 0 %

Slabý: chain 3.1 % · pinwheel 1.6 % · steam 2.8 % · tape 3.8 % · crane 5.2 % · skip 6.8 % (50 %) · gull 3.8 % · momentum 4.3 % · thermal 6.2 % · echo 4.7 % · star 0.8 % (20 %) · drone 3.2 % · paperCrane 0.0 % (10 %) · onAir 4.3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 31 | 25–35 | OK |
| Hody D2 (průměrný) | 26 | 20–30 | OK |
| Hody D3 (průměrný) | 27 | 20–30 | OK |
| Hody D4 (průměrný) | 30 | 20–30 | OK |
| Minuty D1 (průměrný) | 13.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.4 | 10–16 | OK |
| Minuty D3 (průměrný) | 16.6 | 12–18 | OK |
| Minuty D4 (průměrný) | 18.8 | 14–20 | OK |
| Minuty celkem (průměrný) | 57.4 | 50–75 | OK |
| Let medián D1 [s] | 17.9 | ≤ 22 | OK |
| Let medián D2 [s] | 23.7 | ≤ 27 | OK |
| Let medián D3 [s] | 28.6 | ≤ 30 | OK |
| Let medián D4 [s] | 29.1 | ≤ 35 | OK |
| Let P90 [s] | 32.3 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 9 (max 9, P90 9) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 6 / 13 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.5 % / 0 % | – | – |
| Strop E zasažen (lety) | 17 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 53 % | 30 %–70 % | OK |
| První kapsa (hod) | 42 | 20–40 | FAIL |
| Koupené úrovně v cíli | 91 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 45.5 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 125) | 100 % | OK |
| Slabý / průměrný (hody) | 1.15 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.66 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.57 | 0.6–0.75 | FAIL |
| Paper napřed rychlejší o (weak) | -0 % | ≤ 10 % | OK |
| Optimální nákup rychlejší o (weak, info) | 16 % | – | – |
| Paper napřed rychlejší o (average) | -6 % | ≤ 10 % | OK |
| Optimální nákup rychlejší o (average, info) | 9 % | – | – |
| Paper napřed rychlejší o (expert) | -48 % | ≤ 10 % | OK |
| Optimální nákup rychlejší o (expert, info) | -4 % | – | – |
| Paper napřed rychlejší o (auto) | -3 % | ≤ 10 % | OK |
| Optimální nákup rychlejší o (auto, info) | 18 % | – | – |
| Dive pády (weak) | 14 % | ≤ 15 % | OK |
| Dive vysoké vybrání (průměrný) | -4.1 % | ±2 % | FAIL |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 3.7 % | 3 %–15 % | OK |
| Atlas pinwheel na úr. 3 | 1.5 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 1.2 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 1.9 % | – | – |
| Atlas crane na úr. 3 | 3.6 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 6.4 % (v 50 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 4.0 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 3.8 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 2.2 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 5.6 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.9 % (v 20 % letů) | – | – |
| Atlas drone na úr. 3 | 2.0 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas onAir na úr. 3 | 3.6 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 0 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 5.0 % (10 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 3.8 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 50 % | 30 %–50 % | OK |
