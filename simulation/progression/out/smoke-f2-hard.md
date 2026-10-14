# Simulátor progrese: smoke-f2-hard

Spuštěno 2026-10-13T16:27:05.252Z, 20 kampaní na skupinu, seed 1. Parametry přepsané: `{"push":{"scaleWithPace":false},"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 163 | 205 | 241 | 281 | 13.8 / 13.0 | 15 |
| po Power 1 | 1.00 | 196 | 248 | 293 | 338 | 15.8 / 15.2 | 15 |
| po Paper 1 | 1.65 | 265 | 333 | 391 | 453 | 13.9 / 13.1 | 23 |
| střed D1 | 1.65 | 417 | 517 | 601 | 675 | 19.0 / 17.6 | 27 |
| konec D1 | 2.95 | 1052 | 1190 | 1304 | 1402 | 22.7 / 21.0 | 52 |
| konec D2 | 5.35 | 2213 | 2440 | 2615 | 2809 | 28.2 / 25.5 | 87 |
| konec D3 | 7.60 | 3501 | 3902 | 4208 | 4558 | 29.4 / 26.8 | 134 |
| střed D4 | 8.45 | 4369 | 4841 | 5188 | 5647 | 32.9 / 30.4 | 147 |
| plná výbava | 10.15 | 5547 | 6161 | 6639 | 7289 | 33.2 / 30.6 | 186 |
| plná bez Atlasu | 10.15 | 3644 | 4172 | 4566 | 4902 | 24.5 / 22.3 | 170 |
| plná, kluzák | 10.15 | 5963 | 6634 | 7223 | 7985 | 40.2 / 36.6 | 165 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|balanced|auto|better | 100 % | 32 / 12.7 | 21 / 11.3 | 19 / 11.8 | 16 / 10.7 | 88 / 46.0 | 16.2 · 23.6 · 29.0 · 31.2 | 33.3 / 39.8 | 64 % |
| average|balanced|auto|better | 100 % | 23 / 10.3 | 20 / 11.1 | 14 / 8.9 | 15 / 10.2 | 71 / 39.9 | 17.4 · 25.7 · 30.3 · 31.9 | 33.8 / 41.5 | 79 % |
| good|balanced|auto|better | 100 % | 19 / 8.2 | 18 / 10.1 | 17 / 11.0 | 14 / 9.2 | 70 / 38.7 | 18.0 · 26.1 · 28.9 · 30.3 | 33.5 / 41.2 | 89 % |
| expert|balanced|auto|better | 100 % | 16 / 7.3 | 15 / 9.2 | 12 / 7.8 | 13 / 8.8 | 56 / 33.5 | 19.1 · 27.3 · 29.8 · 30.4 | 34.7 / 41.6 | 96 % |

| Skupina | sucho med/max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|balanced|auto|better | 2 / 19 | 6 / 11 | 45 | 63 % | 54 % | 0 % | 0 % | – |
| average|balanced|auto|better | 2 / 7 | 5 / 9 | 43 | 54 % | 58 % | 0 % | 0 % | – |
| good|balanced|auto|better | 2 / 8 | 5 / 8 | 44 | 57 % | 41 % | 0 % | 0 % | 15 % |
| expert|balanced|auto|better | 2 / 7 | 4 / 7 | 35 | 52 % | 48 % | 0 % | 0 % | 6 % |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3501 | 4.2 % | -2.3 % | -3.0 % | -2.0 % (22 %) | 5.0 % | 9.3 % | 2.5 % |
| average | 3902 | 5.1 % | -1.1 % | -3.3 % | -5.8 % (28 %) | 10.2 % | 8.4 % | 4.1 % |
| good | 4208 | 5.8 % | -0.5 % | -3.9 % | -8.4 % (23 %) | 13.6 % | 8.1 % | 3.4 % |
| expert | 4558 | 6.3 % | 0.6 % | -4.1 % | -8.3 % (12 %) | 17.5 % | 7.3 % | 1.7 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 0.3 % · pinwheel 1.8 % · steam -1.1 % · tape 2.6 % · crane 5.7 % · skip 6.4 % · gull 2.7 % · momentum 17.0 % · thermal -0.9 % · echo 0.8 % · star -0.3 % · drone -0.6 % · paperCrane 2.4 % · onAir 2.1 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 23 | 25–35 | FAIL |
| Hody D2 (průměrný) | 20 | 20–30 | OK |
| Hody D3 (průměrný) | 14 | 20–30 | FAIL |
| Hody D4 (průměrný) | 15 | 20–30 | FAIL |
| Minuty D1 (průměrný) | 10.3 | 12–18 | FAIL |
| Minuty D2 (průměrný) | 11.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 8.9 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 10.2 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 39.9 | 50–75 | FAIL |
| Let medián D1 [s] | 17.4 | ≤ 22 | OK |
| Let medián D2 [s] | 25.7 | ≤ 27 | OK |
| Let medián D3 [s] | 30.3 | ≤ 30 | FAIL |
| Let medián D4 [s] | 31.9 | ≤ 35 | OK |
| Let P90 [s] | 33.8 | ≤ 45 | OK |
| Sucho medián / max | 2 / 7 | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 5 / 9 | ≤ 8 / ≤ 14 | OK |
| Strop E zasažen (lety) | 0 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 58 % | 30 %–70 % | OK |
| První kapsa (hod) | 43 | 20–40 | FAIL |
| Koupené úrovně v cíli | 54 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 41.6 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 98) | 100 % | OK |
| Slabý / průměrný (hody) | 1.24 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.79 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.64 | 0.6–0.75 | OK |
| Dive pády (weak) | 22 % | ≤ 15 % | FAIL |
| Dive vysoké vybrání (průměrný) | 4.1 % | ±2 % | FAIL |
| Dive pády (expert) | 12 % | ≤ 3 % | FAIL |
| Atlas chain na úr. 3 | 0.3 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 1.8 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | -1.1 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas crane na úr. 3 | 5.7 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 6.4 % | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas momentum na úr. 3 | 17.0 % | 3 %–15 % | FAIL |
| Atlas thermal na úr. 3 | -0.9 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 0.8 % | 3 %–15 % | FAIL |
| Atlas star na úr. 3 | -0.3 % | 3 %–15 % | FAIL |
| Atlas drone na úr. 3 | -0.6 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 | 2.4 % | 3 %–15 % | FAIL |
| Atlas onAir na úr. 3 | 2.1 % | 3 %–15 % | FAIL |
