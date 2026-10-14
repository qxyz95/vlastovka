# Simulátor progrese: obs-tax-pocket1300

Spuštěno 2026-10-14T18:30:30.290Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"pockets":{"prices":[1300,5040]}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 17.4 | 31 / 16.5 | 35 / 20.6 | 34 / 19.2 | 139 / 72.4 | 16.9 · 24.7 · 26.6 · 27.1 | 30.6 / 43.1 | 70 % |
| average|realistic|auto|better | 100 % | 33 / 14.4 | 26 / 14.1 | 31 / 18.3 | 27 / 16.5 | 116 / 63.6 | 17.8 · 24.9 · 27.4 · 28.2 | 31.8 / 49.2 | 85 % |
| expert|realistic|auto|better | 100 % | 23 / 10.5 | 18 / 10.3 | 23 / 14.2 | 21 / 13.1 | 83 / 47.7 | 19.4 · 25.7 · 29.4 · 30.6 | 34.5 / 48.8 | 97 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 10 / 19 | 76 | 89 % | 63 % | 6 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 11 | 8 / 17 | 70 | 89 % | 57 % | 11 % | 0 % | – |
| expert|realistic|auto|better | 2 / 9 / 8 | 5 / 12 | 63 | 80 % | 45 % | 21 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 0.8 % / 7 % · average|realistic|auto|better 1.0 % / 0 % · expert|realistic|auto|better 0.7 % / 3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 33 | 25–35 | OK |
| Hody D2 (průměrný) | 26 | 20–30 | OK |
| Hody D3 (průměrný) | 31 | 20–30 | FAIL |
| Hody D4 (průměrný) | 27 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.4 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 18.3 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 16.5 | 14–20 | OK |
| Minuty celkem (průměrný) | 63.6 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 24.9 | ≤ 27 | OK |
| Let medián D3 [s] | 27.4 | ≤ 30 | OK |
| Let medián D4 [s] | 28.2 | ≤ 35 | OK |
| Let P90 [s] | 31.8 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 12, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 17 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.0 % / 0 % | – | – |
| Strop E zasažen (lety) | 11 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 57 % | 30 %–70 % | OK |
| První kapsa (hod) | 70 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 49.2 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 168) | 100 % | OK |
| Slabý / průměrný (hody) | 1.20 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.72 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.60 | 0.6–0.75 | FAIL |
