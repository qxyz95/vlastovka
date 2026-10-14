# Simulátor progrese: obs-mod-base

Spuštěno 2026-10-14T18:22:04.997Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 28 / 15.6 | 30 / 17.3 | 30 / 18.0 | 134 / 69.2 | 17.0 · 25.1 · 26.8 · 27.0 | 30.8 / 44.9 | 70 % |
| average|realistic|auto|better | 100 % | 34 / 14.5 | 27 / 14.0 | 25 / 15.1 | 27 / 16.4 | 111 / 60.3 | 17.8 · 23.4 · 27.9 · 28.1 | 31.7 / 46.4 | 85 % |
| expert|realistic|auto|better | 100 % | 23 / 10.5 | 21 / 11.8 | 19 / 11.4 | 14 / 9.4 | 79 / 43.5 | 19.4 · 24.7 · 28.5 · 30.9 | 34.5 / 53.7 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 10 / 17 | 44 | 91 % | 62 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 11 | 8 / 15 | 44 | 89 % | 56 % | 10 % | 0 % | – |
| expert|realistic|auto|better | 1 / 8 / 8 | 6 / 12 | 34 | 76 % | 48 % | 13 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.0 % / 3 % · average|realistic|auto|better 1.0 % / 4 % · expert|realistic|auto|better 0.7 % / 3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 27 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.5 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.0 | 10–16 | OK |
| Minuty D3 (průměrný) | 15.1 | 12–18 | OK |
| Minuty D4 (průměrný) | 16.4 | 14–20 | OK |
| Minuty celkem (průměrný) | 60.3 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 23.4 | ≤ 27 | OK |
| Let medián D3 [s] | 27.9 | ≤ 30 | OK |
| Let medián D4 [s] | 28.1 | ≤ 35 | OK |
| Let P90 [s] | 31.7 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 12, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.0 % / 4 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 44 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 53.7 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 164) | 100 % | OK |
| Slabý / průměrný (hody) | 1.21 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.71 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.59 | 0.6–0.75 | FAIL |
