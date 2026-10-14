# Simulátor progrese: f3-base-x2

Spuštěno 2026-10-13T20:01:59.514Z, 200 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | weakAssist dolet | auto dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 167 | 206 | 243 | 278 | 185 | 188 | 14.0 / 13.2 | 14 |
| po Power 1 | 1.00 | 200 | 250 | 293 | 335 | 222 | 229 | 16.4 / 15.5 | 15 |
| po Paper 1 | 1.62 | 271 | 334 | 393 | 451 | 300 | 305 | 14.0 / 13.2 | 23 |
| střed D1 | 1.62 | 429 | 523 | 600 | 668 | 485 | 486 | 19.4 / 17.9 | 27 |
| konec D1 | 2.86 | 1151 | 1284 | 1385 | 1475 | 1264 | 1242 | 23.6 / 21.6 | 55 |
| konec D2 | 4.96 | 2231 | 2450 | 2632 | 2800 | 2422 | 2347 | 25.6 / 23.4 | 96 |
| konec D3 | 6.94 | 3423 | 3813 | 4149 | 4486 | 3793 | 3586 | 25.8 / 23.7 | 149 |
| střed D4 | 7.58 | 4184 | 4763 | 5225 | 5802 | 4707 | 4348 | 28.2 / 25.8 | 169 |
| plná výbava | 8.86 | 5030 | 5839 | 6415 | 7166 | 5802 | 5323 | 28.2 / 25.8 | 206 |
| plná bez Atlasu | 8.86 | 3430 | 3880 | 4177 | 4444 | 3831 | 3750 | 24.3 / 22.3 | 162 |
| plná, kluzák | 8.86 | 5572 | 6376 | 7038 | 7872 | 6510 | 6100 | 33.2 / 30.0 | 188 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 36 / 19.6 | 26 / 15.1 | 34 / 19.6 | 140 / 72.3 | 16.7 · 25.1 · 26.2 · 26.5 | 30.1 / 46.5 | 68 % |
| weak|balanced|auto|better | 100 % | 40 / 15.7 | 32 / 17.5 | 24 / 13.7 | 28 / 15.8 | 125 / 62.9 | 15.8 · 24.3 · 25.6 · 26.3 | 29.3 / 41.9 | 67 % |
| weak|paper-first|auto|better | 100 % | 44 / 16.3 | 34 / 17.3 | 32 / 16.8 | 28 / 14.9 | 138 / 65.8 | 13.2 · 22.9 · 24.6 · 24.8 | 27.8 / 37.1 | 66 % |
| weak|atlas-first|auto|better | 100 % | 46 / 18.9 | 36 / 19.7 | 30 / 17.0 | 34 / 19.3 | 146 / 75.7 | 16.6 · 25.1 · 26.5 · 26.6 | 30.3 / 47.3 | 68 % |
| average|realistic|auto|better | 100 % | 34 / 14.7 | 34 / 17.8 | 18 / 10.9 | 30 / 18.1 | 118 / 62.1 | 17.7 · 23.0 · 27.0 · 27.6 | 30.6 / 46.5 | 82 % |
| average|balanced|auto|better | 100 % | 32 / 13.5 | 31 / 15.9 | 20 / 11.3 | 22 / 12.6 | 102 / 52.9 | 17.1 · 23.2 · 26.2 · 26.9 | 29.6 / 46.4 | 82 % |
| average|paper-first|auto|better | 100 % | 35 / 13.7 | 33 / 16.8 | 29 / 16.3 | 25 / 13.8 | 123 / 60.5 | 14.6 · 22.2 · 25.1 · 25.4 | 28.1 / 36.8 | 80 % |
| average|atlas-first|auto|better | 100 % | 38 / 16.6 | 36 / 18.7 | 26 / 15.7 | 26 / 15.4 | 127 / 67.5 | 17.7 · 23.1 · 27.3 · 27.8 | 30.9 / 47.9 | 82 % |
| good|realistic|auto|better | 100 % | 28 / 12.6 | 36 / 18.4 | 23 / 12.5 | 22 / 12.5 | 109 / 56.6 | 18.6 · 22.6 · 23.3 · 25.0 | 29.6 / 50.5 | 87 % |
| good|balanced|auto|better | 100 % | 26 / 11.5 | 28 / 14.4 | 24 / 12.8 | 21 / 11.7 | 99 / 50.9 | 17.9 · 23.5 · 24.2 · 24.8 | 29.6 / 48.6 | 88 % |
| good|paper-first|auto|better | 100 % | 29 / 11.9 | 31 / 16.0 | 31 / 16.7 | 26 / 13.8 | 115 / 58.5 | 16.1 · 23.0 · 25.1 · 25.4 | 28.5 / 39.5 | 90 % |
| good|atlas-first|auto|better | 100 % | 32 / 14.5 | 36 / 19.2 | 26 / 14.5 | 24 / 13.6 | 119 / 61.8 | 18.5 · 23.1 · 23.3 · 25.2 | 29.8 / 52.7 | 87 % |
| expert|realistic|auto|better | 100 % | 23 / 10.6 | 29 / 15.6 | 19 / 11.2 | 14 / 8.7 | 84 / 46.0 | 19.5 · 24.2 · 25.6 · 27.9 | 31.3 / 53.4 | 91 % |
| expert|balanced|auto|better | 100 % | 22 / 9.9 | 23 / 12.7 | 19 / 10.6 | 14 / 8.7 | 78 / 42.1 | 18.9 · 24.7 · 26.0 · 27.8 | 31.1 / 50.1 | 94 % |
| expert|paper-first|auto|better | 100 % | 24 / 10.0 | 31 / 16.1 | 27 / 15.4 | 22 / 13.0 | 103 / 54.0 | 16.9 · 23.5 · 25.4 · 26.4 | 29.1 / 41.5 | 98 % |
| expert|atlas-first|auto|better | 100 % | 27 / 12.8 | 33 / 18.1 | 23 / 13.1 | 19 / 11.3 | 101 / 54.9 | 19.3 · 24.8 · 25.7 · 28.2 | 32.1 / 52.3 | 92 % |
| weakAssist|realistic|auto|better | 100 % | 36 / 17.6 | 30 / 18.6 | 20 / 13.4 | 28 / 19.1 | 114 / 69.4 | 20.8 · 30.3 · 32.1 · 32.7 | 37.1 / 56.5 | 88 % |
| weakAssist|balanced|auto|better | 100 % | 33 / 15.4 | 26 / 16.1 | 19 / 12.0 | 24 / 16.0 | 102 / 59.4 | 19.9 · 29.4 · 31.0 · 32.1 | 35.7 / 54.7 | 88 % |
| weakAssist|paper-first|auto|better | 100 % | 38 / 16.0 | 32 / 18.5 | 29 / 17.9 | 26 / 16.1 | 124 / 68.3 | 16.4 · 26.6 · 29.4 · 29.8 | 33.2 / 43.6 | 88 % |
| weakAssist|atlas-first|auto|better | 100 % | 40 / 19.1 | 33 / 20.5 | 26 / 17.7 | 29 / 19.8 | 126 / 76.1 | 20.8 · 30.2 · 32.4 · 33.0 | 37.5 / 55.9 | 89 % |
| auto|realistic|auto|better | 100 % | 35 / 15.2 | 36 / 18.5 | 19 / 11.4 | 33 / 19.8 | 124 / 64.4 | 17.5 · 22.8 · 26.7 · 27.4 | 30.6 / 45.3 | 100 % |
| auto|balanced|auto|better | 100 % | 33 / 13.6 | 31 / 15.8 | 20 / 11.2 | 22 / 13.0 | 105 / 53.2 | 16.7 · 23.0 · 26.0 · 26.9 | 29.5 / 43.7 | 100 % |
| auto|paper-first|auto|better | 100 % | 37 / 14.1 | 33 / 16.6 | 29 / 16.1 | 26 / 14.2 | 125 / 60.7 | 14.4 · 21.9 · 24.9 · 25.6 | 27.8 / 37.8 | 100 % |
| auto|atlas-first|auto|better | 100 % | 39 / 16.8 | 36 / 18.6 | 27 / 15.6 | 33 / 19.4 | 135 / 70.0 | 17.3 · 22.9 · 27.0 · 27.7 | 30.9 / 46.7 | 100 % |

| Skupina | sucho med/max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 | 10 / 18 | 43 | 89 % | 59 % | 2 % | 0 % | – |
| weak|balanced|auto|better | 3 / 15 | 10 / 16 | 43 | 70 % | 59 % | 1 % | 0 % | – |
| weak|paper-first|auto|better | 4 / 17 | 10 / 20 | 72 | 50 % | 58 % | 0 % | 0 % | – |
| weak|atlas-first|auto|better | 3 / 14 | 11 / 19 | 48 | 89 % | 59 % | 2 % | 0 % | – |
| average|realistic|auto|better | 2 / 13 | 8 / 17 | 39 | 87 % | 55 % | 3 % | 0 % | – |
| average|balanced|auto|better | 3 / 16 | 8 / 14 | 52 | 70 % | 53 % | 2 % | 0 % | – |
| average|paper-first|auto|better | 4 / 18 | 8 / 18 | 66 | 43 % | 54 % | 0 % | 0 % | – |
| average|atlas-first|auto|better | 2 / 13 | 9 / 18 | 44 | 89 % | 54 % | 4 % | 0 % | – |
| good|realistic|auto|better | 2 / 13 | 8 / 18 | 36 | 83 % | 38 % | 2 % | 0 % | 10 % |
| good|balanced|auto|better | 3 / 18 | 7 / 15 | 49 | 65 % | 42 % | 1 % | 0 % | 9 % |
| good|paper-first|auto|better | 4 / 16 | 8 / 17 | 60 | 39 % | 50 % | 0 % | 0 % | 8 % |
| good|atlas-first|auto|better | 2 / 13 | 9 / 19 | 43 | 85 % | 40 % | 2 % | 0 % | 10 % |
| expert|realistic|auto|better | 2 / 9 | 6 / 14 | 31 | 74 % | 41 % | 3 % | 0 % | 2 % |
| expert|balanced|auto|better | 2 / 16 | 6 / 12 | 44 | 61 % | 42 % | 2 % | 0 % | 2 % |
| expert|paper-first|auto|better | 4 / 16 | 7 / 15 | 55 | 35 % | 50 % | 0 % | 0 % | 2 % |
| expert|atlas-first|auto|better | 2 / 11 | 7 / 16 | 42 | 83 % | 40 % | 4 % | 0 % | 2 % |
| weakAssist|realistic|auto|better | 2 / 13 | 9 / 15 | 38 | 85 % | 61 % | 6 % | 0 % | – |
| weakAssist|balanced|auto|better | 2 / 13 | 8 / 13 | 40 | 67 % | 62 % | 3 % | 0 % | – |
| weakAssist|paper-first|auto|better | 4 / 18 | 9 / 19 | 68 | 41 % | 60 % | 0 % | 0 % | – |
| weakAssist|atlas-first|auto|better | 2 / 14 | 10 / 17 | 46 | 87 % | 62 % | 7 % | 0 % | – |
| auto|realistic|auto|better | 2 / 12 | 9 / 17 | 41 | 87 % | 60 % | 2 % | 0 % | – |
| auto|balanced|auto|better | 3 / 14 | 8 / 14 | 54 | 63 % | 59 % | 1 % | 0 % | – |
| auto|paper-first|auto|better | 4 / 17 | 8 / 19 | 67 | 43 % | 62 % | 0 % | 0 % | – |
| auto|atlas-first|auto|better | 3 / 12 | 10 / 18 | 46 | 89 % | 61 % | 2 % | 0 % | – |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3423 | 3.3 % | 1.7 % | 1.6 % | -5.3 % (19 %) | 4.2 % | 11.1 % | -2.1 % |
| average | 3813 | 3.9 % | 3.5 % | 2.2 % | -7.6 % (22 %) | 6.3 % | 9.9 % | -0.7 % |
| good | 4149 | 4.2 % | 4.4 % | 2.1 % | -7.9 % (12 %) | 6.8 % | 8.9 % | -1.8 % |
| expert | 4486 | 5.0 % | 6.8 % | 2.4 % | -4.5 % (3 %) | 8.5 % | 8.3 % | -3.0 % |
| weakAssist | 3793 | 4.2 % | 4.9 % | 2.6 % | -5.2 % (17 %) | 7.7 % | 9.9 % | 0.0 % |
| auto | 3586 | 3.1 % | 7.2 % | 1.1 % | -6.4 % (23 %) | 4.2 % | 10.5 % | -2.0 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.2 % · pinwheel 2.7 % · steam 1.0 % · tape 3.1 % · crane 4.8 % · skip 3.2 % (26 % letů) · gull 2.7 % · momentum 9.2 % · thermal 2.6 % · echo 4.0 % · star 0.4 % (10 % letů) · drone 1.9 % · paperCrane 0.0 % (8 % letů) · onAir 4.4 %

Slabý: chain 1.0 % · pinwheel 2.8 % · steam -0.3 % · tape 6.8 % · crane 4.2 % · skip 1.8 % (14 %) · gull 2.3 % · momentum 8.4 % · thermal 2.0 % · echo 1.8 % · star -0.1 % (10 %) · drone -0.0 % · paperCrane 0.0 % (8 %) · onAir 2.1 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 34 | 20–30 | FAIL |
| Hody D3 (průměrný) | 18 | 20–30 | FAIL |
| Hody D4 (průměrný) | 30 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.7 | 12–18 | OK |
| Minuty D2 (průměrný) | 17.8 | 10–16 | FAIL |
| Minuty D3 (průměrný) | 10.9 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 18.1 | 14–20 | OK |
| Minuty celkem (průměrný) | 62.1 | 50–75 | OK |
| Let medián D1 [s] | 17.7 | ≤ 22 | OK |
| Let medián D2 [s] | 23.0 | ≤ 27 | OK |
| Let medián D3 [s] | 27.0 | ≤ 30 | OK |
| Let medián D4 [s] | 27.6 | ≤ 35 | OK |
| Let P90 [s] | 30.6 | ≤ 45 | OK |
| Sucho medián / max | 2 / 13 | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 17 | ≤ 8 / ≤ 14 | FAIL |
| Strop E zasažen (lety) | 3 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 55 % | 30 %–70 % | OK |
| První kapsa (hod) | 39 | 20–40 | OK |
| Koupené úrovně v cíli | 87 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 56.5 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 184) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.71 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.60 | 0.6–0.75 | OK |
| Paper napřed rychlejší o (weak) | 9 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weak) | 5 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weak, info) | 13 % | – | – |
| Paper napřed rychlejší o (average) | 3 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (average) | 9 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (average, info) | 15 % | – | – |
| Paper napřed rychlejší o (good) | -3 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (good) | 9 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (good, info) | 10 % | – | – |
| Paper napřed rychlejší o (expert) | -18 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (expert) | 19 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (expert, info) | 8 % | – | – |
| Paper napřed rychlejší o (weakAssist) | 2 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weakAssist) | 10 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (weakAssist, info) | 14 % | – | – |
| Paper napřed rychlejší o (auto) | 6 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (auto) | 9 % | ≤ 20 % | OK |
| Optimální nákup rychlejší o (auto, info) | 17 % | – | – |
| Dive pády (weak) | 19 % | ≤ 15 % | FAIL |
| Dive vysoké vybrání (průměrný) | -0.7 % | ±2 % | OK |
| Dive pády (expert) | 3 % | ≤ 3 % | FAIL |
| Atlas chain na úr. 3 | 2.2 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 1.0 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 | 3.1 % | 3 %–15 % | OK |
| Atlas crane na úr. 3 | 4.8 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 3.2 % (v 26 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas momentum na úr. 3 | 9.2 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 4.0 % | 3 %–15 % | OK |
| Atlas star na úr. 3 | 0.4 % (v 10 % letů) | 3 %–15 % | FAIL |
| Atlas drone na úr. 3 | 1.9 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 | 0.0 % (v 8 % letů) | 3 %–15 % | FAIL |
| Atlas onAir na úr. 3 | 4.4 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 26 % | 30 %–50 % | FAIL |
