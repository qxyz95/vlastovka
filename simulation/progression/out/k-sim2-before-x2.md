# Simulátor progrese: k-sim2-before-x2

Spuštěno 2026-10-14T19:30:26.934Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Křivka (08 §2.4)

| Výbava | π | average dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 205 | 14.0 / 13.0 | 14 |
| po Power 1 | 1.00 | 255 | 17.2 / 15.9 | 15 |
| po Paper 1 | 1.62 | 332 | 14.0 / 13.0 | 23 |
| střed D1 | 1.62 | 536 | 20.7 / 18.7 | 27 |
| konec D1 | 2.86 | 1241 | 23.6 / 21.5 | 54 |
| konec D2 | 4.21 | 2038 | 26.4 / 23.9 | 80 |
| konec D3 | 6.31 | 3389 | 26.7 / 24.4 | 132 |
| střed D4 | 7.16 | 4310 | 28.8 / 26.0 | 157 |
| plná výbava | 8.86 | 5682 | 29.9 / 26.9 | 197 |
| plná bez Atlasu | 8.86 | 3961 | 26.2 / 23.6 | 161 |
| plná, kluzák | 8.86 | 6230 | 35.3 / 32.7 | 178 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|balanced|auto|better | 100 % | 33 / 13.6 | 33 / 18.3 | 21 / 12.0 | 18 / 10.7 | 94 / 47.7 | 17.6 · 23.8 · 26.0 · 26.9 | 29.4 / 39.2 | 82 % |
| average|balanced|auto|dart | 100 % | 29 / 11.9 | 33 / 16.1 | 22 / 11.4 | 25 / 13.7 | 106 / 51.9 | 16.4 · 21.4 · 24.0 · 23.9 | 26.7 / 34.8 | 83 % |
| average|balanced|auto|glider | 100 % | 33 / 15.0 | 25 / 14.0 | 22 / 13.8 | 21 / 12.6 | 104 / 57.0 | 19.0 · 25.7 · 28.8 · 28.7 | 31.3 / 40.5 | 83 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|balanced|auto|better | 2 / 12 / 12 | 8 / 12 | 49 | 70 % | 61 % | 5 % | 0 % | – |
| average|balanced|auto|dart | 2 / 12 / 12 | 8 / 14 | 52 | 70 % | 0 % | 4 % | 0 % | – |
| average|balanced|auto|glider | 2 / 12 / 12 | 8 / 13 | 50 | 70 % | 99 % | 6 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|balanced|auto|better | 2031 / 5756 / 5608 / 7176 | 1742 / 4793 / 6028 / 6110 | paper 12387, workshop 1120, atlas 4867, pocket 300 | 2474 |
| average|balanced|auto|dart | 1970 / 5812 / 5992 / 9060 | 1732 / 4478 / 6945 / 7415 | workshop 1120, paper 14653, atlas 4497, pocket 300 | 2069 |
| average|balanced|auto|glider | 2160 / 4614 / 5893 / 7283 | 1833 / 4203 / 4945 / 6620 | paper 10487, workshop 1120, atlas 4855, pocket 1140 | 2848 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|balanced|auto|better | dart: 41 % · 195 · 1855 · 412; glider: 59 % · 210 · 2008 · 388 |
| average|balanced|auto|dart | dart: 100 % · 210 · 2010 · 434 |
| average|balanced|auto|glider | dart: 1 % · 34 · 243 · 90; glider: 99 % · 205 · 1951 · 372 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| average | 3389 | 4.2 % | 4.5 % | -1.0 % | -7.3 % (13 %) | 1.7 % | 9.4 % | -4.0 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.7 % · pinwheel 2.6 % · steam 2.0 % · tape 5.1 % · crane 5.1 % · skip 6.1 % (50 % letů) · gull 3.7 % · momentum 7.2 % · thermal 5.5 % · echo 4.8 % · star 0.2 % (20 % letů) · drone 3.7 % · paperCrane 0.0 % (10 % letů) · onAir 6.0 %

Shooting Star úr. 3 v letech s hvězdou: 2.2 % (10 letů, hvězda v rozvrhu 17 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): average|balanced|auto|better 0.5 % / 0 % · average|balanced|auto|dart 0.6 % / 0 % · average|balanced|auto|glider 0.2 % / 0 %

Slabý: chain 1.4 % · pinwheel 1.7 % · steam 2.5 % · tape 7.9 % · crane 1.3 % · skip 4.0 % (30 %) · gull 2.4 % · momentum 4.0 % · thermal 6.3 % · echo 2.6 % · star -1.6 % (20 %) · drone 0.9 % · paperCrane 0.0 % (10 %) · onAir 2.0 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 40.5 | ≤ 60 | OK |
| Dive vysoké vybrání (průměrný) | -4.0 % | ±2 % | FAIL |
| Atlas chain na úr. 3 | 2.7 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 2.0 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 5.1 % | – | – |
| Atlas crane na úr. 3 | 5.1 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 6.1 % (v 50 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 3.7 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 7.2 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 5.5 % | 3 %–15 % | OK |
| Atlas echo na úr. 3 | 4.8 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.2 % (v 20 % letů) | – | – |
| Atlas drone na úr. 3 | 3.7 % | 3 %–15 % | OK |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 10 % letů) | – | – |
| Atlas onAir na úr. 3 | 6.0 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 10 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 2.2 % (10 letů) | ≥ 3 % | FAIL |
| Packing Tape úr. 3 (slabý, plná) | 7.9 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 50 % | 30 %–50 % | OK |
