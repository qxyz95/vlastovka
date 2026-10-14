# Simulátor progrese: obs-econ-x2

Spuštěno 2026-10-14T18:18:09.049Z, 100 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 28 / 15.7 | 30 / 17.3 | 31 / 18.2 | 134 / 69.6 | 16.8 · 25.1 · 26.8 · 26.9 | 30.8 / 48.0 | 69 % |
| average|realistic|auto|better | 100 % | 34 / 14.8 | 27 / 13.9 | 25 / 14.9 | 28 / 16.8 | 113 / 61.0 | 17.8 · 23.2 · 27.7 · 28.0 | 31.4 / 46.4 | 83 % |
| expert|realistic|auto|better | 100 % | 23 / 10.6 | 21 / 11.6 | 18 / 11.3 | 15 / 10.1 | 79 / 44.6 | 19.5 · 24.6 · 28.2 · 30.8 | 34.4 / 55.5 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 10 / 18 | 43 | 91 % | 60 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 14 / 11 | 8 / 15 | 42 | 89 % | 55 % | 10 % | 0 % | – |
| expert|realistic|auto|better | 1 / 9 / 8 | 6 / 12 | 35 | 78 % | 47 % | 13 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.1 % / 2 % · average|realistic|auto|better 1.1 % / 3 % · expert|realistic|auto|better 0.7 % / 4 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 28 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.9 | 10–16 | OK |
| Minuty D3 (průměrný) | 14.9 | 12–18 | OK |
| Minuty D4 (průměrný) | 16.8 | 14–20 | OK |
| Minuty celkem (průměrný) | 61.0 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 23.2 | ≤ 27 | OK |
| Let medián D3 [s] | 27.7 | ≤ 30 | OK |
| Let medián D4 [s] | 28.0 | ≤ 35 | OK |
| Let P90 [s] | 31.4 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 14, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 3 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 55 % | 30 %–70 % | OK |
| První kapsa (hod) | 42 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 55.5 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 169) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.70 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.59 | 0.6–0.75 | FAIL |
