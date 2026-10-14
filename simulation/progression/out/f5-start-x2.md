# Simulátor progrese: f5-start-x2

Spuštěno 2026-10-14T07:01:11.391Z, 200 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | weakAssist dolet | auto dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 167 | 206 | 243 | 278 | 185 | 188 | 14.0 / 13.2 | 14 |
| po Power 1 | 1.00 | 200 | 250 | 293 | 335 | 222 | 229 | 16.4 / 15.5 | 15 |
| po Paper 1 | 1.62 | 271 | 334 | 393 | 451 | 300 | 305 | 14.0 / 13.2 | 23 |
| střed D1 | 1.62 | 429 | 523 | 600 | 668 | 485 | 486 | 19.4 / 17.9 | 27 |
| konec D1 | 2.86 | 1151 | 1284 | 1385 | 1475 | 1264 | 1242 | 23.6 / 21.6 | 55 |
| konec D2 | 4.96 | 2231 | 2450 | 2632 | 2800 | 2422 | 2347 | 25.6 / 23.4 | 96 |
| konec D3 | 6.94 | 3467 | 3891 | 4270 | 4664 | 3910 | 3586 | 26.0 / 23.9 | 151 |
| střed D4 | 7.58 | 4268 | 4888 | 5400 | 6058 | 4879 | 4348 | 28.2 / 25.9 | 172 |
| plná výbava | 8.86 | 5127 | 5966 | 6610 | 7494 | 5984 | 5323 | 28.3 / 25.9 | 211 |
| plná bez Atlasu | 8.86 | 3430 | 3880 | 4177 | 4444 | 3831 | 3750 | 24.3 / 22.3 | 162 |
| plná, kluzák | 8.86 | 5718 | 6530 | 7264 | 8184 | 6730 | 6100 | 33.4 / 30.3 | 193 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 36 / 19.7 | 23 / 13.1 | 34 / 19.7 | 136 / 70.8 | 16.8 · 25.0 · 26.2 · 26.5 | 30.1 / 47.3 | 68 % |
| weak|balanced|auto|better | 100 % | 40 / 15.8 | 32 / 17.2 | 24 / 13.5 | 24 / 14.1 | 120 / 60.6 | 15.8 · 24.4 · 25.5 · 26.2 | 29.3 / 44.7 | 67 % |
| weak|paper-first|auto|better | 100 % | 79 / 28.7 | 38 / 17.5 | 41 / 20.7 | 20 / 10.0 | 178 / 77.2 | 13.6 · 19.2 · 21.9 · 22.6 | 24.9 / 35.8 | 62 % |
| weak|atlas-first|auto|better | 100 % | 46 / 19.1 | 36 / 19.8 | 27 / 14.9 | 32 / 18.4 | 141 / 73.0 | 16.6 · 25.1 · 26.5 · 26.6 | 30.3 / 47.3 | 68 % |
| average|realistic|auto|better | 100 % | 34 / 14.7 | 33 / 17.4 | 18 / 10.5 | 28 / 16.8 | 113 / 59.1 | 17.7 · 23.0 · 27.1 · 27.5 | 30.5 / 45.7 | 82 % |
| average|balanced|auto|better | 100 % | 32 / 13.5 | 31 / 15.9 | 17 / 10.0 | 22 / 12.8 | 101 / 51.5 | 17.1 · 23.2 · 26.1 · 26.9 | 29.5 / 44.7 | 81 % |
| average|paper-first|auto|better | 100 % | 69 / 26.2 | 34 / 15.4 | 40 / 20.6 | 21 / 10.4 | 167 / 73.9 | 14.6 · 19.3 · 21.8 · 23.1 | 25.1 / 35.6 | 76 % |
| average|atlas-first|auto|better | 100 % | 38 / 16.5 | 36 / 18.7 | 23 / 13.5 | 25 / 15.4 | 122 / 63.9 | 17.6 · 23.1 · 27.3 · 27.8 | 30.7 / 47.9 | 82 % |
| good|realistic|auto|better | 100 % | 28 / 12.6 | 35 / 18.5 | 19 / 10.5 | 15 / 9.0 | 98 / 50.9 | 18.6 · 23.1 · 24.3 · 26.0 | 29.8 / 51.0 | 86 % |
| good|balanced|auto|better | 100 % | 26 / 11.5 | 28 / 14.4 | 20 / 11.2 | 16 / 9.3 | 89 / 46.0 | 17.9 · 23.6 · 24.3 · 25.8 | 29.5 / 48.2 | 87 % |
| good|paper-first|auto|better | 100 % | 58 / 23.1 | 33 / 15.3 | 42 / 21.6 | 19 / 10.1 | 156 / 71.2 | 16.1 · 19.3 · 22.3 · 23.3 | 25.5 / 35.5 | 88 % |
| good|atlas-first|auto|better | 100 % | 32 / 14.5 | 36 / 19.2 | 22 / 12.4 | 16 / 9.1 | 108 / 56.3 | 18.5 · 23.3 · 24.4 · 26.6 | 30.0 / 53.2 | 86 % |
| expert|realistic|auto|better | 100 % | 23 / 10.6 | 28 / 15.2 | 17 / 10.1 | 9 / 6.0 | 77 / 41.7 | 19.5 · 24.6 · 26.0 · 28.9 | 31.2 / 50.9 | 91 % |
| expert|balanced|auto|better | 100 % | 22 / 9.9 | 23 / 12.7 | 15 / 8.6 | 11 / 6.6 | 72 / 38.6 | 18.9 · 24.8 · 26.0 · 28.6 | 31.1 / 53.1 | 94 % |
| expert|paper-first|auto|better | 100 % | 48 / 20.2 | 33 / 15.7 | 40 / 21.0 | 19 / 10.0 | 140 / 67.1 | 17.0 · 19.1 · 23.6 · 24.3 | 26.4 / 38.2 | 98 % |
| expert|atlas-first|auto|better | 100 % | 27 / 12.8 | 32 / 17.5 | 19 / 11.5 | 14 / 8.8 | 91 / 50.0 | 19.3 · 24.9 · 26.5 · 29.3 | 32.2 / 54.4 | 92 % |
| weakAssist|realistic|auto|better | 100 % | 36 / 17.7 | 30 / 18.7 | 17 / 11.2 | 27 / 18.1 | 109 / 65.5 | 20.9 · 30.2 · 31.9 · 32.7 | 36.9 / 56.5 | 88 % |
| weakAssist|balanced|auto|better | 100 % | 33 / 15.4 | 26 / 16.1 | 17 / 11.3 | 23 / 15.2 | 99 / 57.3 | 19.9 · 29.4 · 30.9 · 32.0 | 35.6 / 51.6 | 88 % |
| weakAssist|paper-first|auto|better | 100 % | 69 / 29.2 | 33 / 16.5 | 42 / 23.4 | 20 / 11.5 | 168 / 83.2 | 17.0 · 22.4 · 25.3 · 26.9 | 29.6 / 42.7 | 86 % |
| weakAssist|atlas-first|auto|better | 100 % | 40 / 19.2 | 33 / 20.4 | 22 / 14.6 | 29 / 19.7 | 121 / 73.2 | 20.8 · 30.3 · 32.4 · 33.3 | 37.5 / 56.4 | 88 % |
| auto|realistic|auto|better | 100 % | 35 / 15.2 | 36 / 18.5 | 20 / 11.7 | 33 / 19.6 | 124 / 64.4 | 17.5 · 22.8 · 26.6 · 27.5 | 30.5 / 45.2 | 100 % |
| auto|balanced|auto|better | 100 % | 33 / 13.6 | 31 / 15.8 | 20 / 11.2 | 23 / 13.1 | 105 / 53.2 | 16.7 · 23.0 · 26.0 · 26.9 | 29.5 / 43.7 | 100 % |
| auto|paper-first|auto|better | 100 % | 67 / 25.5 | 36 / 16.5 | 43 / 21.7 | 21 / 10.3 | 168 / 73.9 | 15.0 · 18.7 · 22.0 · 23.7 | 25.0 / 34.9 | 100 % |
| auto|atlas-first|auto|better | 100 % | 39 / 16.8 | 36 / 18.5 | 27 / 15.7 | 32 / 19.4 | 135 / 69.7 | 17.3 · 22.9 · 27.0 · 27.8 | 30.9 / 46.7 | 100 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 12 | 10 / 18 | 43 | 89 % | 58 % | 2 % | 0 % | – |
| weak|balanced|auto|better | 3 / 15 / 12 | 9 / 16 | 46 | 70 % | 59 % | 1 % | 0 % | – |
| weak|paper-first|auto|better | 6 / 26 / 22 | 14 / 27 | 169 | 46 % | 58 % | 0 % | 0 % | – |
| weak|atlas-first|auto|better | 3 / 14 / 11 | 11 / 19 | 48 | 89 % | 59 % | 2 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 9 | 8 / 16 | 39 | 85 % | 54 % | 3 % | 0 % | – |
| average|balanced|auto|better | 3 / 15 / 11 | 8 / 14 | 52 | 67 % | 53 % | 2 % | 0 % | – |
| average|paper-first|auto|better | 6 / 23 / 20 | 12 / 27 | 160 | 41 % | 53 % | 0 % | 0 % | – |
| average|atlas-first|auto|better | 2 / 13 / 10 | 9 / 17 | 44 | 87 % | 54 % | 4 % | 0 % | – |
| good|realistic|auto|better | 2 / 13 / 9 | 7 / 16 | 36 | 78 % | 43 % | 2 % | 0 % | 7 % |
| good|balanced|auto|better | 3 / 15 / 13 | 7 / 13 | 48 | 63 % | 44 % | 2 % | 0 % | 7 % |
| good|paper-first|auto|better | 6 / 23 / 18 | 11 / 24 | 153 | 41 % | 50 % | 0 % | 0 % | 4 % |
| good|atlas-first|auto|better | 2 / 13 / 9 | 8 / 17 | 42 | 80 % | 46 % | 2 % | 0 % | 6 % |
| expert|realistic|auto|better | 2 / 8 / 7 | 6 / 12 | 33 | 67 % | 41 % | 4 % | 0 % | 1 % |
| expert|balanced|auto|better | 2 / 16 / 9 | 6 / 11 | 43 | 61 % | 43 % | 2 % | 0 % | 1 % |
| expert|paper-first|auto|better | 5 / 20 / 18 | 10 / 22 | 139 | 37 % | 51 % | 0 % | 0 % | 0 % |
| expert|atlas-first|auto|better | 2 / 9 / 7 | 7 / 15 | 41 | 78 % | 42 % | 4 % | 0 % | 1 % |
| weakAssist|realistic|auto|better | 2 / 12 / 9 | 8 / 15 | 39 | 83 % | 60 % | 6 % | 0 % | – |
| weakAssist|balanced|auto|better | 2 / 14 / 11 | 8 / 13 | 40 | 67 % | 60 % | 3 % | 0 % | – |
| weakAssist|paper-first|auto|better | 6 / 23 / 21 | 12 / 26 | 163 | 41 % | 60 % | 0 % | 0 % | – |
| weakAssist|atlas-first|auto|better | 2 / 13 / 10 | 9 / 17 | 46 | 87 % | 63 % | 8 % | 0 % | – |
| auto|realistic|auto|better | 2 / 12 / 10 | 9 / 17 | 40 | 87 % | 60 % | 2 % | 0 % | – |
| auto|balanced|auto|better | 3 / 14 / 11 | 8 / 14 | 54 | 63 % | 59 % | 1 % | 0 % | – |
| auto|paper-first|auto|better | 6 / 27 / 21 | 12 / 25 | 162 | 43 % | 62 % | 0 % | 0 % | – |
| auto|atlas-first|auto|better | 3 / 12 / 10 | 10 / 19 | 46 | 89 % | 62 % | 2 % | 0 % | – |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3467 | 3.3 % | 1.4 % | 1.6 % | -4.8 % (17 %) | 4.2 % | 10.9 % | -1.2 % |
| average | 3891 | 4.1 % | 2.9 % | 2.5 % | -6.6 % (19 %) | 5.8 % | 9.6 % | -0.3 % |
| good | 4270 | 4.8 % | 4.1 % | 2.6 % | -6.9 % (11 %) | 7.1 % | 8.7 % | -0.7 % |
| expert | 4664 | 5.6 % | 6.8 % | 3.5 % | -3.3 % (2 %) | 8.8 % | 8.0 % | -1.8 % |
| weakAssist | 3910 | 4.2 % | 4.5 % | 2.7 % | -4.7 % (16 %) | 7.3 % | 9.4 % | 0.9 % |
| auto | 3586 | 3.1 % | 7.2 % | 1.1 % | -5.5 % (21 %) | 4.2 % | 10.5 % | -1.1 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.4 % · pinwheel 2.6 % · steam 0.1 % · tape 3.2 % · crane 4.7 % · skip 3.9 % (30 % letů) · gull 2.8 % · momentum 8.9 % · thermal 4.8 % · echo 5.4 % · star 0.2 % (10 % letů) · drone 0.2 % · paperCrane 0.0 % (9 % letů) · onAir 4.0 %

Shooting Star úr. 3 v letech s hvězdou: 3.7 % (200 letů, hvězda v rozvrhu 16 % klíčů, začala v 96 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.1 % / 3 % · weak|balanced|auto|better 0.4 % / 5 % · weak|paper-first|auto|better 0.2 % / 7 % · weak|atlas-first|auto|better 1.2 % / 1 % · average|realistic|auto|better 1.0 % / 5 % · average|balanced|auto|better 0.4 % / 2 % · average|paper-first|auto|better 0.2 % / 12 % · average|atlas-first|auto|better 1.1 % / 5 % · good|realistic|auto|better 0.8 % / 1 % · good|balanced|auto|better 0.4 % / 5 % · good|paper-first|auto|better 0.2 % / 8 % · good|atlas-first|auto|better 0.8 % / 2 % · expert|realistic|auto|better 0.3 % / 6 % · expert|balanced|auto|better 0.4 % / 3 % · expert|paper-first|auto|better 0.3 % / 4 % · expert|atlas-first|auto|better 0.9 % / 3 % · weakAssist|realistic|auto|better 1.1 % / 3 % · weakAssist|balanced|auto|better 0.5 % / 7 % · weakAssist|paper-first|auto|better 0.2 % / 4 % · weakAssist|atlas-first|auto|better 1.3 % / 4 % · auto|realistic|auto|better 1.3 % / 3 % · auto|balanced|auto|better 0.4 % / 6 % · auto|paper-first|auto|better 0.3 % / 2 % · auto|atlas-first|auto|better 1.2 % / 7 %

Slabý: chain 1.0 % · pinwheel 2.6 % · steam -1.1 % · tape 7.0 % · crane 4.0 % · skip 2.3 % (17 %) · gull 2.3 % · momentum 7.8 % · thermal 4.0 % · echo 3.2 % · star -0.2 % (10 %) · drone -0.9 % · paperCrane 0.0 % (9 %) · onAir 2.2 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 33 | 20–30 | FAIL |
| Hody D3 (průměrný) | 18 | 20–30 | FAIL |
| Hody D4 (průměrný) | 28 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.7 | 12–18 | OK |
| Minuty D2 (průměrný) | 17.4 | 10–16 | FAIL |
| Minuty D3 (průměrný) | 10.5 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 16.8 | 14–20 | OK |
| Minuty celkem (průměrný) | 59.1 | 50–75 | OK |
| Let medián D1 [s] | 17.7 | ≤ 22 | OK |
| Let medián D2 [s] | 23.0 | ≤ 27 | OK |
| Let medián D3 [s] | 27.1 | ≤ 30 | OK |
| Let medián D4 [s] | 27.5 | ≤ 35 | OK |
| Let P90 [s] | 30.5 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 9 (max 12, P90 9) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.0 % / 5 % | – | – |
| Strop E zasažen (lety) | 3 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 54 % | 30 %–70 % | OK |
| První kapsa (hod) | 39 | 20–40 | OK |
| Koupené úrovně v cíli | 85 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 56.5 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 183) | 100 % | OK |
| Slabý / průměrný (hody) | 1.20 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.68 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.57 | 0.6–0.75 | FAIL |
| Paper napřed rychlejší o (weak) | -9 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weak) | 3 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weak, info) | 14 % | – | – |
| Paper napřed rychlejší o (average) | -25 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (average) | 8 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (average, info) | 13 % | – | – |
| Paper napřed rychlejší o (good) | -40 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (good) | 11 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (good, info) | 10 % | – | – |
| Paper napřed rychlejší o (expert) | -61 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (expert) | 20 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (expert, info) | 7 % | – | – |
| Paper napřed rychlejší o (weakAssist) | -27 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weakAssist) | 12 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weakAssist, info) | 13 % | – | – |
| Paper napřed rychlejší o (auto) | -15 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (auto) | 8 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (auto, info) | 17 % | – | – |
| Dive pády (weak) | 17 % | ≤ 15 % | FAIL |
| Dive vysoké vybrání (průměrný) | -0.3 % | ±2 % | OK |
| Dive pády (expert) | 2 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 2.4 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 0.1 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 3.2 % | – | – |
| Atlas crane na úr. 3 | 4.7 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 3.9 % (v 30 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 2.8 % | 3 %–15 % | FAIL |
| Atlas momentum na úr. 3 | 8.9 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 4.8 % | 3 %–15 % | OK |
| Atlas echo na úr. 3 | 5.4 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.2 % (v 10 % letů) | – | – |
| Atlas drone na úr. 3 | 0.2 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 9 % letů) | – | – |
| Atlas onAir na úr. 3 | 4.0 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 9 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 3.7 % (200 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 7.0 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 30 % | 30 %–50 % | OK |
