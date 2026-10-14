# Simulátor progrese: f3-sens-x2

Spuštěno 2026-10-13T20:59:04.689Z, 100 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 35 / 19.2 | 26 / 14.9 | 34 / 19.3 | 141 / 72.8 | 16.7 · 25.2 · 26.3 · 26.5 | 30.1 / 46.5 | 68 % |
| average|realistic|auto|better | 100 % | 34 / 14.8 | 34 / 17.7 | 18 / 10.8 | 29 / 17.1 | 116 / 61.7 | 17.8 · 23.1 · 27.2 · 27.7 | 30.6 / 46.5 | 82 % |

| Skupina | sucho med/max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 | 10 / 19 | 43 | 89 % | 59 % | 1 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 | 8 / 16 | 39 | 87 % | 56 % | 3 % | 0 % | – |

## Citlivost (08 §10.3, průměrný a slabý, realistic)

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 134 / 71.7 | 37 / 42 / 24 / 33 | 30.8 / 47.5 | 160 / 83.9 (193) | 5144 / 25.9 |
| krok papíru ×1,1 | 100 / 52.6 | 32 / 30 / 15 / 23 | 30.1 / 46.0 | 122 / 63.1 (169) | 6169 / 25.8 |
| zrychlení klouzání 1,0 | 116 / 66.2 | 34 / 34 / 18 / 29 | 33.7 / 49.4 | 141 / 77.9 (176) | 5657 / 28.4 |
| zrychlení klouzání 1,4 | 116 / 61.7 | 34 / 34 / 18 / 29 | 30.6 / 46.5 | 141 / 72.8 (176) | 5657 / 25.8 |
| ceny ×0,8 | 90 / 48.2 | 28 / 27 / 15 / 24 | 30.6 / 46.4 | 112 / 58.3 (149) | 5657 / 25.8 |
| ceny ×1,25 | 148 / 78.2 | 44 / 43 / 24 / 36 | 30.6 / 47.6 | 176 / 91.8 (225) | 5657 / 25.8 |
| Shooting Star ×0,5 | 117 / 61.6 | 34 / 34 / 18 / 29 | 30.5 / 45.6 | 142 / 73.2 (176) | 5634 / 25.8 |
| Shooting Star ×2 | 116 / 61.4 | 34 / 34 / 18 / 29 | 30.6 / 46.5 | 141 / 72.1 (176) | 5671 / 25.8 |
| rozestup událostí ×0,8 | 106 / 57.4 | 33 / 31 / 17 / 26 | 31.6 / 49.1 | 133 / 69.0 (176) | 5918 / 26.9 |
| rozestup událostí ×1,25 | 124 / 64.6 | 35 / 36 / 21 / 31 | 29.8 / 44.0 | 147 / 75.4 (183) | 5433 / 24.3 |
| readNoise 0 | 113 / 60.2 | 34 / 34 / 19 / 30 | 30.6 / 44.7 | 138 / 72.0 (190) | 5704 / 25.8 |
| readNoise 0,4 | 117 / 61.9 | 35 / 34 / 19 / 28 | 30.4 / 44.9 | 143 / 73.4 (186) | 5524 / 25.7 |
| push sond (scaleWithPace=false) | 128 / 69.5 | 35 / 41 / 22 / 32 | 31.9 / 47.5 | 151 / 80.9 (181) | 5279 / 25.6 |
| nákupčí: trpělivost 3 | 122 / 64.6 | 36 / 36 / 18 / 31 | 30.6 / 43.0 | 144 / 74.4 (183) | 5657 / 25.8 |
| nákupčí: trpělivost 10 | 110 / 57.2 | 34 / 32 / 19 / 27 | 30.3 / 45.2 | 133 / 67.7 (183) | 5657 / 25.8 |
| nákupčí: chyba odhadu 0,25 | 115 / 59.9 | 33 / 34 / 18 / 31 | 30.5 / 45.4 | 142 / 72.7 (180) | 5657 / 25.8 |
| nákupčí: chyba odhadu 0,8 | 118 / 62.0 | 35 / 34 / 19 / 31 | 30.5 / 45.3 | 141 / 73.0 (184) | 5657 / 25.8 |
| nákupčí: bez preference papíru | 118 / 62.6 | 34 / 32 / 20 / 31 | 30.5 / 46.9 | 143 / 74.4 (183) | 5657 / 25.8 |

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 34 | 20–30 | FAIL |
| Hody D3 (průměrný) | 18 | 20–30 | FAIL |
| Hody D4 (průměrný) | 29 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 17.7 | 10–16 | FAIL |
| Minuty D3 (průměrný) | 10.8 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 17.1 | 14–20 | OK |
| Minuty celkem (průměrný) | 61.7 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 23.1 | ≤ 27 | OK |
| Let medián D3 [s] | 27.2 | ≤ 30 | OK |
| Let medián D4 [s] | 27.7 | ≤ 35 | OK |
| Let P90 [s] | 30.6 | ≤ 45 | OK |
| Sucho medián / max | 2 / 12 | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Strop E zasažen (lety) | 3 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 39 | 20–40 | OK |
| Koupené úrovně v cíli | 87 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 46.5 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 176) | 100 % | OK |
| Slabý / průměrný (hody) | 1.22 | ≤ 1.4 | OK |
