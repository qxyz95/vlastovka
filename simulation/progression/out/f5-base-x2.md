# Simulátor progrese: f5-base-x2

Spuštěno 2026-10-14T12:49:21.764Z, 200 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | weakAssist dolet | auto dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 167 | 206 | 243 | 278 | 185 | 188 | 14.0 / 13.2 | 14 |
| po Power 1 | 1.00 | 200 | 250 | 293 | 335 | 222 | 229 | 16.4 / 15.5 | 15 |
| po Paper 1 | 1.62 | 271 | 334 | 393 | 451 | 300 | 305 | 14.0 / 13.2 | 23 |
| střed D1 | 1.62 | 430 | 525 | 602 | 669 | 487 | 486 | 19.5 / 17.9 | 27 |
| konec D1 | 2.86 | 1161 | 1294 | 1392 | 1480 | 1269 | 1242 | 23.7 / 21.7 | 55 |
| konec D2 | 4.21 | 1912 | 2101 | 2242 | 2389 | 2069 | 1992 | 25.9 / 23.6 | 82 |
| konec D3 | 6.31 | 3150 | 3523 | 3831 | 4150 | 3533 | 3227 | 26.0 / 24.0 | 136 |
| střed D4 | 7.16 | 4008 | 4536 | 4950 | 5481 | 4502 | 4033 | 28.5 / 26.1 | 159 |
| plná výbava | 8.86 | 5106 | 5846 | 6444 | 7179 | 5850 | 5254 | 28.5 / 25.9 | 207 |
| plná bez Atlasu | 8.86 | 3460 | 3916 | 4198 | 4459 | 3849 | 3750 | 24.4 / 22.4 | 162 |
| plná, kluzák | 8.86 | 5701 | 6408 | 7074 | 7798 | 6592 | 5936 | 33.5 / 30.4 | 189 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 28 / 15.5 | 30 / 17.2 | 32 / 18.5 | 134 / 70.2 | 16.7 · 25.1 · 26.8 · 26.9 | 30.8 / 48.0 | 70 % |
| weak|balanced|auto|better | 100 % | 39 / 15.7 | 30 / 16.4 | 28 / 15.8 | 24 / 13.8 | 121 / 61.0 | 15.9 · 24.4 · 25.9 · 26.4 | 29.6 / 44.4 | 69 % |
| weak|paper-first|auto|better | 100 % | 63 / 22.9 | 28 / 14.2 | 34 / 17.9 | 20 / 10.9 | 149 / 67.6 | 13.4 · 22.3 · 23.6 · 24.3 | 26.9 / 36.5 | 66 % |
| weak|atlas-first|auto|better | 100 % | 46 / 18.8 | 33 / 18.0 | 30 / 17.6 | 31 / 18.0 | 140 / 73.0 | 16.6 · 25.2 · 26.8 · 27.0 | 30.8 / 48.0 | 70 % |
| average|realistic|auto|better | 100 % | 34 / 14.8 | 27 / 13.9 | 25 / 14.9 | 28 / 16.4 | 113 / 60.3 | 17.8 · 23.3 · 27.5 · 28.0 | 31.4 / 46.4 | 84 % |
| average|balanced|auto|better | 100 % | 32 / 13.3 | 25 / 13.4 | 22 / 12.8 | 22 / 13.1 | 102 / 53.2 | 17.1 · 23.6 · 26.6 · 27.4 | 30.2 / 46.3 | 83 % |
| average|paper-first|auto|better | 100 % | 56 / 21.0 | 27 / 13.6 | 35 / 18.9 | 21 / 11.4 | 139 / 65.3 | 14.4 · 22.0 · 24.0 · 24.7 | 27.1 / 36.7 | 79 % |
| average|atlas-first|auto|better | 100 % | 38 / 16.3 | 31 / 16.5 | 25 / 14.7 | 28 / 16.9 | 121 / 64.8 | 17.6 · 23.7 · 27.6 · 28.2 | 31.5 / 48.2 | 83 % |
| good|realistic|auto|better | 100 % | 28 / 12.6 | 27 / 14.2 | 25 / 14.0 | 21 / 12.8 | 98 / 52.8 | 18.7 · 23.5 · 25.9 · 28.2 | 31.7 / 51.1 | 87 % |
| good|balanced|auto|better | 100 % | 26 / 11.5 | 23 / 12.5 | 25 / 14.1 | 17 / 10.1 | 90 / 47.8 | 17.9 · 23.8 · 25.3 · 27.6 | 30.7 / 48.8 | 88 % |
| good|paper-first|auto|better | 100 % | 49 / 19.5 | 25 / 12.7 | 36 / 19.1 | 19 / 10.2 | 128 / 61.8 | 16.0 · 22.2 · 24.0 · 24.8 | 27.4 / 41.6 | 89 % |
| good|atlas-first|auto|better | 100 % | 32 / 14.4 | 30 / 16.4 | 22 / 12.7 | 22 / 13.3 | 107 / 58.2 | 18.4 · 24.2 · 26.5 · 28.4 | 32.1 / 49.4 | 87 % |
| expert|realistic|auto|better | 100 % | 23 / 10.7 | 21 / 11.7 | 18 / 11.0 | 15 / 9.5 | 78 / 44.1 | 19.6 · 24.6 · 28.2 · 30.6 | 34.2 / 55.5 | 92 % |
| expert|balanced|auto|better | 100 % | 22 / 9.9 | 20 / 10.8 | 19 / 11.3 | 13 / 8.1 | 74 / 40.7 | 18.9 · 25.0 · 27.3 · 29.6 | 32.5 / 49.9 | 93 % |
| expert|paper-first|auto|better | 100 % | 38 / 16.0 | 27 / 14.1 | 35 / 19.0 | 19 / 10.3 | 123 / 60.4 | 16.9 · 22.9 · 24.4 · 24.8 | 27.5 / 42.4 | 97 % |
| expert|atlas-first|auto|better | 100 % | 27 / 12.6 | 26 / 14.9 | 19 / 11.7 | 17 / 11.5 | 90 / 51.3 | 19.3 · 25.7 · 28.9 · 31.0 | 34.8 / 54.0 | 93 % |
| weakAssist|realistic|auto|better | 100 % | 36 / 17.5 | 22 / 13.8 | 25 / 17.3 | 27 / 19.0 | 111 / 68.3 | 20.9 · 30.0 · 32.5 · 33.3 | 37.8 / 56.8 | 89 % |
| weakAssist|balanced|auto|better | 100 % | 33 / 15.2 | 22 / 13.5 | 23 / 15.2 | 21 / 14.1 | 99 / 57.6 | 19.9 · 29.3 · 31.4 · 32.4 | 36.1 / 51.6 | 89 % |
| weakAssist|paper-first|auto|better | 100 % | 58 / 24.1 | 28 / 15.8 | 36 / 20.9 | 20 / 12.4 | 142 / 73.7 | 16.7 · 25.5 · 27.8 · 28.8 | 31.8 / 44.0 | 87 % |
| weakAssist|atlas-first|auto|better | 100 % | 40 / 19.0 | 28 / 17.9 | 24 / 16.4 | 30 / 21.0 | 120 / 72.8 | 20.6 · 30.0 · 32.7 · 33.6 | 37.9 / 55.8 | 89 % |
| auto|realistic|auto|better | 100 % | 36 / 15.2 | 27 / 13.8 | 29 / 17.0 | 32 / 19.2 | 124 / 66.4 | 17.5 · 23.1 · 26.8 · 27.7 | 31.2 / 45.4 | 100 % |
| auto|balanced|auto|better | 100 % | 33 / 13.7 | 27 / 14.2 | 25 / 14.1 | 22 / 13.0 | 108 / 55.4 | 16.7 · 23.3 · 26.1 · 26.7 | 29.7 / 45.6 | 100 % |
| auto|paper-first|auto|better | 100 % | 56 / 21.3 | 27 / 13.8 | 36 / 19.5 | 21 / 11.3 | 142 / 65.9 | 14.7 · 21.7 · 23.9 · 24.6 | 26.6 / 35.8 | 100 % |
| auto|atlas-first|auto|better | 100 % | 39 / 16.8 | 33 / 17.1 | 31 / 18.0 | 33 / 19.8 | 135 / 71.8 | 17.3 · 23.5 · 26.9 · 27.7 | 31.3 / 46.1 | 100 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 12 | 10 / 18 | 44 | 91 % | 60 % | 5 % | 0 % | – |
| weak|balanced|auto|better | 3 / 15 / 13 | 9 / 16 | 46 | 72 % | 58 % | 3 % | 0 % | – |
| weak|paper-first|auto|better | 5 / 22 / 18 | 11 / 22 | 118 | 46 % | 59 % | 0 % | 0 % | – |
| weak|atlas-first|auto|better | 3 / 14 / 12 | 10 / 18 | 51 | 91 % | 61 % | 6 % | 0 % | – |
| average|realistic|auto|better | 2 / 14 / 11 | 8 / 15 | 42 | 89 % | 55 % | 10 % | 0 % | – |
| average|balanced|auto|better | 3 / 15 / 12 | 7 / 14 | 48 | 70 % | 55 % | 7 % | 0 % | – |
| average|paper-first|auto|better | 5 / 21 / 18 | 9 / 20 | 135 | 43 % | 54 % | 0 % | 0 % | – |
| average|atlas-first|auto|better | 2 / 14 / 11 | 9 / 17 | 53 | 89 % | 55 % | 11 % | 0 % | – |
| good|realistic|auto|better | 2 / 13 / 11 | 7 / 16 | 39 | 85 % | 50 % | 8 % | 0 % | 3 % |
| good|balanced|auto|better | 2 / 20 / 13 | 7 / 14 | 46 | 70 % | 46 % | 7 % | 0 % | 3 % |
| good|paper-first|auto|better | 5 / 20 / 17 | 9 / 20 | 102 | 41 % | 52 % | 0 % | 0 % | 2 % |
| good|atlas-first|auto|better | 2 / 13 / 11 | 8 / 16 | 48 | 87 % | 49 % | 10 % | 0 % | 3 % |
| expert|realistic|auto|better | 1 / 10 / 8 | 6 / 12 | 34 | 76 % | 46 % | 13 % | 0 % | 0 % |
| expert|balanced|auto|better | 2 / 20 / 11 | 5 / 11 | 40 | 65 % | 47 % | 11 % | 0 % | 0 % |
| expert|paper-first|auto|better | 5 / 19 / 16 | 8 / 17 | 94 | 37 % | 50 % | 0 % | 0 % | 0 % |
| expert|atlas-first|auto|better | 2 / 11 / 7 | 7 / 14 | 47 | 83 % | 50 % | 15 % | 0 % | 0 % |
| weakAssist|realistic|auto|better | 2 / 13 / 11 | 8 / 15 | 39 | 87 % | 61 % | 14 % | 0 % | – |
| weakAssist|balanced|auto|better | 2 / 15 / 12 | 8 / 13 | 42 | 70 % | 61 % | 10 % | 0 % | – |
| weakAssist|paper-first|auto|better | 5 / 21 / 17 | 10 / 21 | 115 | 41 % | 60 % | 0 % | 0 % | – |
| weakAssist|atlas-first|auto|better | 2 / 14 / 11 | 9 / 16 | 50 | 89 % | 62 % | 16 % | 0 % | – |
| auto|realistic|auto|better | 2 / 14 / 12 | 8 / 18 | 43 | 91 % | 61 % | 6 % | 0 % | – |
| auto|balanced|auto|better | 3 / 14 / 13 | 8 / 14 | 50 | 65 % | 60 % | 3 % | 0 % | – |
| auto|paper-first|auto|better | 5 / 21 / 17 | 10 / 20 | 135 | 43 % | 60 % | 0 % | 0 % | – |
| auto|atlas-first|auto|better | 2 / 13 / 12 | 10 / 19 | 56 | 91 % | 61 % | 7 % | 0 % | – |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3150 | 3.3 % | 1.5 % | 1.5 % | -4.1 % (11 %) | 4.5 % | 10.4 % | -0.9 % |
| average | 3523 | 3.9 % | 3.3 % | 2.6 % | -7.0 % (11 %) | 5.9 % | 9.2 % | -1.6 % |
| good | 3831 | 4.7 % | 5.1 % | 2.6 % | -6.4 % (3 %) | 7.0 % | 8.4 % | -2.5 % |
| expert | 4150 | 5.8 % | 7.7 % | 3.9 % | -5.4 % (0 %) | 9.1 % | 7.8 % | -3.9 % |
| weakAssist | 3533 | 4.3 % | 4.3 % | 2.5 % | -5.0 % (8 %) | 7.5 % | 9.2 % | -1.7 % |
| auto | 3227 | 3.0 % | 7.4 % | 1.3 % | -4.2 % (14 %) | 4.3 % | 10.1 % | -1.1 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.7 % · pinwheel 2.6 % · steam -0.0 % · tape 3.8 % · crane 4.1 % · skip 3.9 % (31 % letů) · gull 3.0 % · momentum 6.0 % · thermal 4.5 % · echo 4.1 % · star 0.2 % (10 % letů) · drone 0.2 % · paperCrane 0.0 % (7 % letů) · onAir 3.8 %

Shooting Star úr. 3 v letech s hvězdou: 4.0 % (200 letů, hvězda v rozvrhu 16 % klíčů, začala v 97 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.0 % / 2 % · weak|balanced|auto|better 0.4 % / 8 % · weak|paper-first|auto|better 0.3 % / 5 % · weak|atlas-first|auto|better 1.1 % / 3 % · average|realistic|auto|better 1.1 % / 4 % · average|balanced|auto|better 0.4 % / 5 % · average|paper-first|auto|better 0.3 % / 8 % · average|atlas-first|auto|better 1.1 % / 1 % · good|realistic|auto|better 0.9 % / 2 % · good|balanced|auto|better 0.4 % / 3 % · good|paper-first|auto|better 0.3 % / 5 % · good|atlas-first|auto|better 1.1 % / 2 % · expert|realistic|auto|better 0.6 % / 6 % · expert|balanced|auto|better 0.3 % / 12 % · expert|paper-first|auto|better 0.4 % / 9 % · expert|atlas-first|auto|better 0.9 % / 6 % · weakAssist|realistic|auto|better 1.0 % / 4 % · weakAssist|balanced|auto|better 0.4 % / 6 % · weakAssist|paper-first|auto|better 0.3 % / 5 % · weakAssist|atlas-first|auto|better 1.1 % / 5 % · auto|realistic|auto|better 1.2 % / 3 % · auto|balanced|auto|better 0.5 % / 4 % · auto|paper-first|auto|better 0.3 % / 6 % · auto|atlas-first|auto|better 1.3 % / 3 %

Slabý: chain 1.2 % · pinwheel 2.6 % · steam -1.1 % · tape 7.6 % · crane 3.7 % · skip 2.5 % (19 %) · gull 2.6 % · momentum 5.6 % · thermal 3.5 % · echo 2.1 % · star -0.2 % (10 %) · drone -1.1 % · paperCrane 0.0 % (8 %) · onAir 2.3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 28 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.9 | 10–16 | OK |
| Minuty D3 (průměrný) | 14.9 | 12–18 | OK |
| Minuty D4 (průměrný) | 16.4 | 14–20 | OK |
| Minuty celkem (průměrný) | 60.3 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 23.3 | ≤ 27 | OK |
| Let medián D3 [s] | 27.5 | ≤ 30 | OK |
| Let medián D4 [s] | 28.0 | ≤ 35 | OK |
| Let P90 [s] | 31.4 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 14, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 4 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 55 % | 30 %–70 % | OK |
| První kapsa (hod) | 42 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 56.8 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 169) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.69 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.58 | 0.6–0.75 | FAIL |
| Paper napřed rychlejší o (weak) | 4 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weak) | 4 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weak, info) | 13 % | – | – |
| Paper napřed rychlejší o (average) | -8 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (average) | 7 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (average, info) | 12 % | – | – |
| Paper napřed rychlejší o (good) | -17 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (good) | 10 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (good, info) | 10 % | – | – |
| Paper napřed rychlejší o (expert) | -37 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (expert) | 16 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (expert, info) | 8 % | – | – |
| Paper napřed rychlejší o (weakAssist) | -8 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weakAssist) | 7 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weakAssist, info) | 16 % | – | – |
| Paper napřed rychlejší o (auto) | 1 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (auto) | 8 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (auto, info) | 16 % | – | – |
| Dive pády (weak) | 11 % | ≤ 15 % | OK |
| Dive vysoké vybrání (průměrný) | -1.6 % | ±2 % | OK |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | -0.0 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 3.8 % | – | – |
| Atlas crane na úr. 3 | 4.1 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 3.9 % (v 31 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 3.0 % | 3 %–15 % | FAIL |
| Atlas momentum na úr. 3 | 6.0 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 4.5 % | 3 %–15 % | OK |
| Atlas echo na úr. 3 | 4.1 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.2 % (v 10 % letů) | – | – |
| Atlas drone na úr. 3 | 0.2 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 7 % letů) | – | – |
| Atlas onAir na úr. 3 | 3.8 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 7 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 4.0 % (200 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 7.6 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 31 % | 30 %–50 % | OK |
