# Simulátor progrese: obs-mod-trade5

Spuštěno 2026-10-14T18:26:41.753Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"dart":{"cruise":11.55,"glide":3.04},"glider":{"cruise":11.55,"glide":3.8}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 43 / 17.2 | 30 / 16.0 | 30 / 17.2 | 30 / 17.3 | 136 / 69.2 | 16.2 · 24.0 · 25.7 · 26.0 | 29.4 / 43.6 | 70 % |
| average|realistic|auto|better | 100 % | 34 / 14.8 | 27 / 13.5 | 25 / 14.9 | 27 / 16.2 | 116 / 60.2 | 17.3 · 22.4 · 26.6 · 26.7 | 30.1 / 44.3 | 85 % |
| expert|realistic|auto|better | 100 % | 23 / 10.7 | 24 / 13.0 | 19 / 11.2 | 13 / 8.5 | 79 / 42.9 | 18.7 · 23.6 · 26.7 · 29.1 | 32.0 / 51.9 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 13 | 10 / 19 | 44 | 91 % | 58 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 12 | 8 / 16 | 40 | 89 % | 53 % | 9 % | 0 % | – |
| expert|realistic|auto|better | 1 / 10 / 8 | 6 / 12 | 34 | 78 % | 46 % | 12 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.1 % / 1 % · average|realistic|auto|better 1.1 % / 5 % · expert|realistic|auto|better 0.6 % / 7 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 27 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.5 | 10–16 | OK |
| Minuty D3 (průměrný) | 14.9 | 12–18 | OK |
| Minuty D4 (průměrný) | 16.2 | 14–20 | OK |
| Minuty celkem (průměrný) | 60.2 | 50–75 | OK |
| Let medián D1 [s] | 17.3 | ≤ 22 | OK |
| Let medián D2 [s] | 22.4 | ≤ 27 | OK |
| Let medián D3 [s] | 26.6 | ≤ 30 | OK |
| Let medián D4 [s] | 26.7 | ≤ 35 | OK |
| Let P90 [s] | 30.1 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 12 (max 12, P90 12) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 5 % | – | – |
| Strop E zasažen (lety) | 9 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 53 % | 30 %–70 % | OK |
| První kapsa (hod) | 40 | 20–40 | OK |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 51.9 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 161) | 100 % | OK |
| Slabý / průměrný (hody) | 1.17 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.68 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.58 | 0.6–0.75 | FAIL |
