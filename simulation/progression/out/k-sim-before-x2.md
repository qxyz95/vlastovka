# Simulátor progrese: k-sim-before-x2

Spuštěno 2026-10-14T18:43:53.510Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|realistic|auto|better | 100 % | 34 / 15.7 | 28 / 14.4 | 22 / 13.5 | 29 / 17.4 | 113 / 61.1 | 18.0 · 23.5 · 28.8 · 27.7 | 32.2 / 40.9 | 82 % |
| average|realistic|auto|dart | 100 % | 36 / 15.3 | 26 / 12.8 | 22 / 12.4 | 33 / 19.0 | 139 / 69.9 | 17.2 · 21.5 · 25.9 · 25.5 | 28.6 / 37.8 | 82 % |
| average|realistic|auto|glider | 100 % | 34 / 16.1 | 30 / 16.5 | 21 / 12.8 | 29 / 18.3 | 111 / 64.3 | 20.3 · 24.9 · 29.5 · 29.1 | 33.2 / 41.7 | 82 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|realistic|auto|better | 2 / 12 / 12 | 8 / 15 | 44 | 89 % | 56 % | 9 % | 0 % | – |
| average|realistic|auto|dart | 2 / 12 / 12 | 8 / 15 | 38 | 93 % | 0 % | 7 % | 0 % | – |
| average|realistic|auto|glider | 2 / 11 / 11 | 7 / 13 | 47 | 89 % | 99 % | 10 % | 0 % | – |

Paper Crane v kampani (tah v letech / přes nové místo): average|realistic|auto|better 0.9 % / 17 % · average|realistic|auto|dart 1.4 % / 10 % · average|realistic|auto|glider 1.2 % / 13 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 28 | 20–30 | OK |
| Hody D3 (průměrný) | 22 | 20–30 | OK |
| Hody D4 (průměrný) | 29 | 20–30 | OK |
| Minuty D1 (průměrný) | 15.7 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.4 | 10–16 | OK |
| Minuty D3 (průměrný) | 13.5 | 12–18 | OK |
| Minuty D4 (průměrný) | 17.4 | 14–20 | OK |
| Minuty celkem (průměrný) | 61.1 | 50–75 | OK |
| Let medián D1 [s] | 18.0 | ≤ 22 | OK |
| Let medián D2 [s] | 23.5 | ≤ 27 | OK |
| Let medián D3 [s] | 28.8 | ≤ 30 | OK |
| Let medián D4 [s] | 27.7 | ≤ 35 | OK |
| Let P90 [s] | 32.2 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 12 (max 12, P90 12) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.9 % / 17 % | – | – |
| Strop E zasažen (lety) | 9 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 44 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 41.7 | ≤ 60 | OK |
