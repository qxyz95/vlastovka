# Simulátor progrese: obs-mod-qte10

Spuštěno 2026-10-14T18:25:50.607Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"dart":{"qte":1.1},"glider":{"qte":1.265}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 17.4 | 28 / 15.2 | 28 / 16.7 | 30 / 17.2 | 123 / 65.2 | 17.0 · 25.6 · 27.6 · 28.0 | 31.7 / 47.8 | 70 % |
| average|realistic|auto|better | 100 % | 32 / 14.3 | 24 / 13.1 | 24 / 14.6 | 23 / 14.0 | 101 / 56.4 | 18.1 · 24.1 · 28.4 · 29.4 | 32.8 / 49.7 | 85 % |
| expert|realistic|auto|better | 100 % | 21 / 10.1 | 18 / 10.3 | 15 / 9.3 | 14 / 9.3 | 70 / 39.9 | 19.8 · 25.3 · 29.3 · 32.0 | 35.8 / 53.9 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 9 / 18 | 45 | 89 % | 59 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 10 | 8 / 14 | 43 | 87 % | 56 % | 11 % | 0 % | – |
| expert|realistic|auto|better | 1 / 9 / 6 | 5 / 11 | 34 | 74 % | 46 % | 13 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 0.8 % / 5 % · average|realistic|auto|better 0.8 % / 2 % · expert|realistic|auto|better 0.6 % / 8 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 32 | 25–35 | OK |
| Hody D2 (průměrný) | 24 | 20–30 | OK |
| Hody D3 (průměrný) | 24 | 20–30 | OK |
| Hody D4 (průměrný) | 23 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.3 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 14.6 | 12–18 | OK |
| Minuty D4 (průměrný) | 14.0 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 56.4 | 50–75 | OK |
| Let medián D1 [s] | 18.1 | ≤ 22 | OK |
| Let medián D2 [s] | 24.1 | ≤ 27 | OK |
| Let medián D3 [s] | 28.4 | ≤ 30 | OK |
| Let medián D4 [s] | 29.4 | ≤ 35 | OK |
| Let P90 [s] | 32.8 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 10 (max 12, P90 10) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 14 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.8 % / 2 % | – | – |
| Strop E zasažen (lety) | 11 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 43 | 20–40 | FAIL |
| Koupené úrovně v cíli | 87 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 53.9 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 144) | 100 % | OK |
| Slabý / průměrný (hody) | 1.22 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.69 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.57 | 0.6–0.75 | FAIL |
