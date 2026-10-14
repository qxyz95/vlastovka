# Simulátor progrese: obs-mod-ideal4

Spuštěno 2026-10-14T18:35:47.933Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"dart":{"ideal":22},"glider":{"ideal":34}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 35 / 15.2 | 21 / 12.3 | 26 / 16.4 | 27 / 17.4 | 110 / 62.9 | 18.3 · 27.8 · 29.9 · 30.4 | 34.1 / 49.1 | 70 % |
| average|realistic|auto|better | 100 % | 28 / 12.8 | 19 / 10.4 | 18 / 11.3 | 23 / 15.0 | 86 / 50.7 | 19.6 · 26.7 · 30.6 · 32.0 | 34.9 / 49.2 | 84 % |
| expert|realistic|auto|better | 100 % | 19 / 9.4 | 15 / 9.1 | 14 / 9.0 | 12 / 8.4 | 61 / 37.0 | 22.6 · 28.3 · 30.8 · 35.2 | 36.7 / 53.7 | 93 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 11 / 10 | 7 / 14 | 41 | 87 % | 60 % | 7 % | 0 % | – |
| average|realistic|auto|better | 1 / 10 / 8 | 6 / 12 | 39 | 83 % | 51 % | 12 % | 0 % | – |
| expert|realistic|auto|better | 1 / 7 / 6 | 4 / 8 | 29 | 70 % | 38 % | 14 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.2 % / 4 % · average|realistic|auto|better 0.7 % / 0 % · expert|realistic|auto|better 0.5 % / 11 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 28 | 25–35 | OK |
| Hody D2 (průměrný) | 19 | 20–30 | FAIL |
| Hody D3 (průměrný) | 18 | 20–30 | FAIL |
| Hody D4 (průměrný) | 23 | 20–30 | OK |
| Minuty D1 (průměrný) | 12.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 10.4 | 10–16 | OK |
| Minuty D3 (průměrný) | 11.3 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 15.0 | 14–20 | OK |
| Minuty celkem (průměrný) | 50.7 | 50–75 | OK |
| Let medián D1 [s] | 19.6 | ≤ 22 | OK |
| Let medián D2 [s] | 26.7 | ≤ 27 | OK |
| Let medián D3 [s] | 30.6 | ≤ 30 | FAIL |
| Let medián D4 [s] | 32.0 | ≤ 35 | OK |
| Let P90 [s] | 34.9 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 1 / 8 (max 10, P90 8) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 12 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.7 % / 0 % | – | – |
| Strop E zasažen (lety) | 12 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 51 % | 30 %–70 % | OK |
| První kapsa (hod) | 39 | 20–40 | OK |
| Koupené úrovně v cíli | 83 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 53.7 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 135) | 100 % | OK |
| Slabý / průměrný (hody) | 1.28 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.71 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.55 | 0.6–0.75 | FAIL |
