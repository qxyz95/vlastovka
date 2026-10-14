# Simulátor progrese: obs-tax-pocket2300

Spuštěno 2026-10-14T18:31:13.955Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"pockets":{"prices":[2300,5040]}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 17.4 | 31 / 16.3 | 36 / 21.3 | 36 / 20.7 | 142 / 74.4 | 16.9 · 24.6 · 26.5 · 27.1 | 30.7 / 45.4 | 70 % |
| average|realistic|auto|better | 100 % | 33 / 14.4 | 26 / 14.1 | 35 / 21.1 | 26 / 15.8 | 119 / 64.4 | 17.8 · 24.9 · 27.3 · 28.0 | 31.7 / 44.3 | 85 % |
| expert|realistic|auto|better | 100 % | 23 / 10.5 | 18 / 10.3 | 21 / 13.4 | 21 / 13.6 | 84 / 48.4 | 19.4 · 25.7 · 29.4 · 30.6 | 34.4 / 50.3 | 98 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 10 / 20 | 104 | 91 % | 63 % | 6 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 11 | 8 / 19 | 89 | 89 % | 56 % | 12 % | 0 % | – |
| expert|realistic|auto|better | 1 / 10 / 8 | 6 / 12 | 69 | 80 % | 47 % | 23 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.0 % / 7 % · average|realistic|auto|better 1.0 % / 1 % · expert|realistic|auto|better 0.7 % / 0 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 33 | 25–35 | OK |
| Hody D2 (průměrný) | 26 | 20–30 | OK |
| Hody D3 (průměrný) | 35 | 20–30 | FAIL |
| Hody D4 (průměrný) | 26 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.4 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 21.1 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 15.8 | 14–20 | OK |
| Minuty celkem (průměrný) | 64.4 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 24.9 | ≤ 27 | OK |
| Let medián D3 [s] | 27.3 | ≤ 30 | OK |
| Let medián D4 [s] | 28.0 | ≤ 35 | OK |
| Let P90 [s] | 31.7 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 12, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 19 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.0 % / 1 % | – | – |
| Strop E zasažen (lety) | 12 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 89 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 50.3 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 168) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.71 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.59 | 0.6–0.75 | FAIL |
