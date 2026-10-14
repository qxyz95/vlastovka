# Simulátor progrese: k-sim3-before-b

Spuštěno 2026-10-14T20:42:36.229Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 178 | 226 | 16.6 / 15.6 | 15 |
| po Power 1 | 1.00 | 217 | 279 | 18.6 / 17.3 | 16 |
| po Paper 1 | 1.62 | 288 | 366 | 16.6 / 15.6 | 24 |
| střed D1 | 1.62 | 492 | 581 | 21.5 / 19.9 | 27 |
| konec D1 | 2.86 | 1232 | 1358 | 23.5 / 21.6 | 56 |
| konec D2 | 4.21 | 2003 | 2217 | 27.2 / 25.2 | 82 |
| konec D3 | 6.31 | 3388 | 3702 | 27.7 / 25.4 | 141 |
| střed D4 | 7.16 | 4407 | 4808 | 29.6 / 28.2 | 165 |
| plná výbava | 8.86 | 5718 | 6190 | 30.1 / 27.0 | 215 |
| plná bez Atlasu | 8.86 | 3928 | 4345 | 27.2 / 24.4 | 164 |
| plná, kluzák | 8.86 | 6208 | 6859 | 35.0 / 32.4 | 197 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 40 / 17.1 | 25 / 13.7 | 26 / 15.0 | 30 / 18.4 | 120 / 64.0 | 17.8 · 25.9 · 27.7 · 27.4 | 31.6 / 41.3 | 91 % |
| weak|balanced|auto|better | 100 % | 39 / 16.3 | 22 / 12.4 | 28 / 16.0 | 24 / 13.4 | 103 / 53.6 | 17.2 · 25.5 · 26.1 · 26.8 | 30.7 / 38.5 | 91 % |
| average|realistic|auto|better | 100 % | 31 / 13.8 | 26 / 13.4 | 27 / 16.6 | 30 / 18.8 | 104 / 57.4 | 17.9 · 23.7 · 28.6 · 29.1 | 32.3 / 41.6 | 96 % |
| average|balanced|auto|better | 100 % | 28 / 12.8 | 21 / 10.8 | 25 / 15.3 | 20 / 12.4 | 99 / 52.0 | 17.6 · 23.6 · 28.6 · 28.0 | 31.9 / 38.6 | 96 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 10 / 10 | 8 / 15 | 41 | 89 % | 61 % | 15 % | 0 % | – |
| weak|balanced|auto|better | 3 / 12 / 12 | 8 / 15 | 40 | 72 % | 64 % | 10 % | 0 % | – |
| average|realistic|auto|better | 2 / 9 / 9 | 6 / 13 | 42 | 91 % | 53 % | 17 % | 0 % | – |
| average|balanced|auto|better | 3 / 11 / 11 | 6 / 14 | 42 | 72 % | 54 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|better | 2563 / 4320 / 6852 / 9822 | 2273 / 4125 / 6273 / 9325 | workshop 1120, paper 8020, atlas 12555, pocket 300 | 1801 |
| weak|balanced|auto|better | 2480 / 4000 / 6781 / 6803 | 2120 / 3435 / 6415 / 5508 | paper 9820, workshop 1120, atlas 4978, pocket 1560 | 3097 |
| average|realistic|auto|better | 2151 / 3854 / 7464 / 8548 | 1860 / 3573 / 7263 / 8300 | workshop 1120, paper 8020, atlas 11555, pocket 300 | 997 |
| average|balanced|auto|better | 2026 / 3390 / 7386 / 8354 | 1663 / 3343 / 5738 / 8248 | paper 12820, workshop 1120, atlas 4750, pocket 300 | 2636 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|better | dart: 42 % · 178 · 1682 · 371; glider: 58 % · 224 · 2143 · 395 |
| weak|balanced|auto|better | dart: 39 % · 180 · 1701 · 388; glider: 61 % · 208 · 1987 · 380 |
| average|realistic|auto|better | dart: 51 % · 178 · 1686 · 365; glider: 49 % · 268 · 2581 · 452 |
| average|balanced|auto|better | dart: 48 % · 199 · 1895 · 408; glider: 52 % · 250 · 2407 · 436 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3388 | 5.9 % | 4.0 % | -1.3 % | -4.1 % (14 %) | 4.2 % | 9.4 % | -5.1 % |
| average | 3702 | 5.9 % | 3.4 % | 1.1 % | -7.5 % (8 %) | 6.7 % | 8.6 % | -4.1 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 3.7 % · pinwheel 1.5 % · steam 1.2 % · tape 1.9 % · crane 3.6 % · skip 6.4 % (50 % letů) · gull 4.0 % · momentum 3.8 % · thermal 2.2 % · echo 5.6 % · star 0.9 % (20 % letů) · drone 2.0 % · paperCrane 0.0 % (0 % letů) · onAir 3.6 %

Shooting Star úr. 3 v letech s hvězdou: 5.0 % (10 letů, hvězda v rozvrhu 17 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.3 % / 0 % · weak|balanced|auto|better 0.2 % / 0 % · average|realistic|auto|better 1.5 % / 0 %

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
| Žádný let > 60 s (skutečný) | 41.6 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 125) | 100 % | OK |
| Slabý / průměrný (hody) | 1.15 | ≤ 1.4 | OK |
| Optimální nákup rychlejší o (weak, info) | 16 % | – | – |
| Optimální nákup rychlejší o (average, info) | 9 % | – | – |
| Dive pády (weak) | 14 % | ≤ 15 % | OK |
| Dive vysoké vybrání (průměrný) | -4.1 % | ±2 % | FAIL |
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
