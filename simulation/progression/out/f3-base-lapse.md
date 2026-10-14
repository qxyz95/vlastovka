# Simulátor progrese: f3-base-lapse

Spuštěno 2026-10-13T20:40:50.550Z, 150 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"lapse":0.12},"average":{"lapse":0.07},"good":{"lapse":0.04},"expert":{"lapse":0.02},"weakAssist":{"lapse":0.12}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 175 | 217 | 256 | 286 | 14.6 / 13.7 | 15 |
| po Power 1 | 1.00 | 210 | 265 | 308 | 343 | 17.4 / 16.2 | 16 |
| po Paper 1 | 1.62 | 283 | 352 | 415 | 464 | 14.6 / 13.7 | 24 |
| střed D1 | 1.62 | 455 | 548 | 622 | 679 | 20.2 / 18.5 | 27 |
| konec D1 | 2.86 | 1184 | 1307 | 1400 | 1475 | 23.3 / 21.4 | 56 |
| konec D2 | 4.96 | 2297 | 2509 | 2684 | 2824 | 25.8 / 23.5 | 98 |
| konec D3 | 6.94 | 3531 | 3959 | 4296 | 4540 | 25.7 / 23.6 | 154 |
| střed D4 | 7.58 | 4435 | 5054 | 5535 | 5940 | 29.1 / 27.0 | 175 |
| plná výbava | 8.86 | 5401 | 6170 | 6864 | 7304 | 29.0 / 26.4 | 215 |
| plná bez Atlasu | 8.86 | 3598 | 3992 | 4270 | 4471 | 24.6 / 22.5 | 163 |
| plná, kluzák | 8.86 | 5976 | 6770 | 7501 | 8053 | 33.1 / 30.0 | 199 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 38 / 16.2 | 32 / 17.7 | 21 / 12.3 | 31 / 18.6 | 123 / 64.9 | 17.2 · 25.7 · 26.8 · 26.9 | 30.9 / 44.5 | 79 % |
| weak|paper-first|auto|better | 100 % | 41 / 15.2 | 33 / 16.8 | 30 / 15.8 | 27 / 14.1 | 129 / 61.8 | 13.6 · 22.6 · 24.4 · 24.8 | 27.8 / 37.0 | 78 % |
| weak|atlas-first|auto|better | 100 % | 43 / 17.9 | 33 / 18.2 | 30 / 17.8 | 30 / 17.7 | 135 / 71.5 | 17.2 · 25.7 · 26.9 · 27.0 | 31.2 / 47.3 | 79 % |
| average|realistic|auto|better | 100 % | 30 / 13.6 | 32 / 16.5 | 18 / 10.9 | 23 / 13.7 | 103 / 55.2 | 18.2 · 23.2 · 27.5 · 28.3 | 31.2 / 50.7 | 90 % |
| average|paper-first|auto|better | 100 % | 32 / 12.8 | 32 / 16.1 | 28 / 15.6 | 24 / 13.4 | 118 / 58.3 | 15.5 · 22.1 · 25.3 · 25.3 | 28.2 / 37.5 | 89 % |
| average|atlas-first|auto|better | 100 % | 35 / 15.5 | 34 / 17.9 | 21 / 13.5 | 26 / 16.3 | 118 / 63.3 | 18.1 · 23.4 · 27.9 · 28.3 | 31.8 / 46.7 | 90 % |
| good|realistic|auto|better | 100 % | 26 / 11.9 | 32 / 16.5 | 19 / 10.7 | 15 / 8.7 | 90 / 47.8 | 18.9 · 23.6 · 24.8 · 27.1 | 30.6 / 50.0 | 86 % |
| good|paper-first|auto|better | 100 % | 27 / 11.3 | 32 / 16.2 | 29 / 16.4 | 22 / 12.4 | 109 / 55.5 | 16.4 · 23.0 · 25.1 · 25.5 | 28.4 / 38.4 | 94 % |
| good|atlas-first|auto|better | 100 % | 31 / 13.9 | 34 / 18.1 | 22 / 12.5 | 18 / 10.7 | 105 / 56.2 | 18.8 · 23.9 · 24.9 · 27.6 | 31.1 / 52.0 | 87 % |
| expert|realistic|auto|better | 100 % | 22 / 10.5 | 26 / 14.0 | 16 / 9.7 | 11 / 6.9 | 75 / 41.4 | 19.8 · 24.7 · 26.7 · 29.4 | 31.8 / 50.9 | 89 % |
| expert|paper-first|auto|better | 100 % | 23 / 9.8 | 30 / 15.7 | 27 / 15.3 | 22 / 12.7 | 101 / 52.3 | 17.1 · 23.7 · 25.4 · 26.2 | 28.8 / 43.0 | 97 % |
| expert|atlas-first|auto|better | 100 % | 27 / 12.3 | 30 / 16.8 | 23 / 13.6 | 17 / 10.9 | 94 / 52.7 | 19.4 · 25.0 · 27.1 · 30.4 | 33.2 / 56.7 | 90 % |

| Skupina | sucho med/max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 12 | 9 / 16 | 38 | 87 % | 60 % | 4 % | 0 % | – |
| weak|paper-first|auto|better | 4 / 17 | 9 / 19 | 70 | 43 % | 58 % | 0 % | 0 % | – |
| weak|atlas-first|auto|better | 3 / 12 | 10 / 18 | 44 | 89 % | 60 % | 4 % | 0 % | – |
| average|realistic|auto|better | 2 / 10 | 7 / 14 | 34 | 83 % | 56 % | 6 % | 0 % | – |
| average|paper-first|auto|better | 4 / 16 | 8 / 17 | 64 | 41 % | 56 % | 0 % | 0 % | – |
| average|atlas-first|auto|better | 2 / 10 | 9 / 17 | 42 | 87 % | 55 % | 7 % | 0 % | – |
| good|realistic|auto|better | 2 / 11 | 7 / 14 | 33 | 76 % | 39 % | 3 % | 0 % | 2 % |
| good|paper-first|auto|better | 4 / 17 | 7 / 16 | 58 | 37 % | 52 % | 0 % | 0 % | 1 % |
| good|atlas-first|auto|better | 2 / 11 | 8 / 16 | 40 | 83 % | 41 % | 3 % | 0 % | 2 % |
| expert|realistic|auto|better | 2 / 8 | 6 / 12 | 30 | 70 % | 40 % | 3 % | 0 % | 0 % |
| expert|paper-first|auto|better | 4 / 16 | 7 / 15 | 53 | 35 % | 50 % | 0 % | 0 % | 0 % |
| expert|atlas-first|auto|better | 2 / 8 | 7 / 15 | 41 | 80 % | 40 % | 5 % | 0 % | 0 % |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3531 | 4.5 % | 4.1 % | 3.1 % | -2.8 % (15 %) | 6.7 % | 10.8 % | 1.8 % |
| average | 3959 | 4.8 % | 5.9 % | 3.3 % | -3.3 % (9 %) | 7.1 % | 9.5 % | 1.2 % |
| good | 4296 | 5.2 % | 6.7 % | 3.1 % | -2.9 % (3 %) | 7.3 % | 8.6 % | -1.7 % |
| expert | 4540 | 5.2 % | 8.5 % | 3.1 % | 1.4 % (0 %) | 9.0 % | 8.1 % | -2.5 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.8 % · pinwheel 2.7 % · steam 0.8 % · tape 2.6 % · crane 4.2 % · skip 4.2 % (37 % letů) · gull 3.4 % · momentum 8.3 % · thermal -0.2 % · echo 6.2 % · star 0.5 % (11 % letů) · drone 2.5 % · paperCrane 0.0 % (10 % letů) · onAir 4.0 %

Slabý: chain 2.1 % · pinwheel 3.4 % · steam 1.0 % · tape 5.2 % · crane 4.6 % · skip 3.6 % (27 %) · gull 3.1 % · momentum 9.1 % · thermal 1.7 % · echo 4.2 % · star 0.4 % (11 %) · drone 2.3 % · paperCrane 0.0 % (8 %) · onAir 3.6 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 30 | 25–35 | OK |
| Hody D2 (průměrný) | 32 | 20–30 | FAIL |
| Hody D3 (průměrný) | 18 | 20–30 | FAIL |
| Hody D4 (průměrný) | 23 | 20–30 | OK |
| Minuty D1 (průměrný) | 13.6 | 12–18 | OK |
| Minuty D2 (průměrný) | 16.5 | 10–16 | FAIL |
| Minuty D3 (průměrný) | 10.9 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 13.7 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 55.2 | 50–75 | OK |
| Let medián D1 [s] | 18.2 | ≤ 22 | OK |
| Let medián D2 [s] | 23.2 | ≤ 27 | OK |
| Let medián D3 [s] | 27.5 | ≤ 30 | OK |
| Let medián D4 [s] | 28.3 | ≤ 35 | OK |
| Let P90 [s] | 31.2 | ≤ 45 | OK |
| Sucho medián / max | 2 / 10 | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 7 / 14 | ≤ 8 / ≤ 14 | OK |
| Strop E zasažen (lety) | 6 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 34 | 20–40 | OK |
| Koupené úrovně v cíli | 83 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 56.7 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 156) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.73 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.61 | 0.6–0.75 | OK |
| Paper napřed rychlejší o (weak) | 5 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (weak) | 10 % | ≤ 20 % | OK |
| Paper napřed rychlejší o (average) | -6 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (average) | 15 % | ≤ 20 % | OK |
| Paper napřed rychlejší o (good) | -16 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (good) | 17 % | ≤ 20 % | OK |
| Paper napřed rychlejší o (expert) | -27 % | ≤ 10 % | OK |
| Atlas napřed pomalejší o (expert) | 27 % | ≤ 20 % | FAIL |
| Dive pády (weak) | 15 % | ≤ 15 % | OK |
| Dive vysoké vybrání (průměrný) | 1.2 % | ±2 % | OK |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 2.8 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 0.8 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas crane na úr. 3 | 4.2 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 4.2 % (v 37 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 3.4 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 8.3 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | -0.2 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 6.2 % | 3 %–15 % | OK |
| Atlas star na úr. 3 | 0.5 % (v 11 % letů) | 3 %–15 % | FAIL |
| Atlas drone na úr. 3 | 2.5 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 | 0.0 % (v 10 % letů) | 3 %–15 % | FAIL |
| Atlas onAir na úr. 3 | 4.0 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 37 % | 30 %–50 % | OK |
