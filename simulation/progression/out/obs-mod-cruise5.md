# Simulátor progrese: obs-mod-cruise5

Spuštěno 2026-10-14T18:22:57.918Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"dart":{"cruise":11.55},"glider":{"cruise":11.55}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 17.2 | 29 / 15.5 | 31 / 17.6 | 32 / 18.5 | 134 / 69.2 | 16.7 · 24.5 · 26.3 · 26.4 | 30.1 / 44.0 | 70 % |
| average|realistic|auto|better | 100 % | 33 / 14.4 | 27 / 13.7 | 26 / 15.4 | 25 / 15.0 | 109 / 57.9 | 17.6 · 23.0 · 27.0 · 27.5 | 30.9 / 44.0 | 85 % |
| expert|realistic|auto|better | 100 % | 22 / 10.4 | 22 / 11.8 | 18 / 11.1 | 15 / 9.5 | 78 / 43.0 | 19.1 · 23.8 · 26.7 · 29.9 | 33.2 / 49.1 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 12 | 9 / 18 | 42 | 91 % | 61 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 11 | 8 / 16 | 41 | 87 % | 55 % | 10 % | 0 % | – |
| expert|realistic|auto|better | 1 / 8 / 7 | 6 / 12 | 32 | 76 % | 41 % | 12 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.4 % / 3 % · average|realistic|auto|better 1.1 % / 4 % · expert|realistic|auto|better 0.6 % / 7 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 33 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 26 | 20–30 | OK |
| Hody D4 (průměrný) | 25 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.4 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.7 | 10–16 | OK |
| Minuty D3 (průměrný) | 15.4 | 12–18 | OK |
| Minuty D4 (průměrný) | 15.0 | 14–20 | OK |
| Minuty celkem (průměrný) | 57.9 | 50–75 | OK |
| Let medián D1 [s] | 17.6 | ≤ 22 | OK |
| Let medián D2 [s] | 23.0 | ≤ 27 | OK |
| Let medián D3 [s] | 27.0 | ≤ 30 | OK |
| Let medián D4 [s] | 27.5 | ≤ 35 | OK |
| Let P90 [s] | 30.9 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 12, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 4 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 55 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 87 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 49.1 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 164) | 100 % | OK |
| Slabý / průměrný (hody) | 1.23 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.72 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.58 | 0.6–0.75 | FAIL |
