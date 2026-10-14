# Simulátor progrese: obs-mod-hawk-as-glider

Spuštěno 2026-10-14T18:33:01.530Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"glider":{"speed":17,"glide":3,"cruise":11,"ideal":34,"qte":1,"drag":0.12}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 32 / 14.3 | 18 / 10.7 | 24 / 15.0 | 24 / 16.3 | 95 / 55.1 | 18.6 · 29.6 · 31.3 · 32.1 | 35.6 / 47.2 | 69 % |
| average|realistic|auto|better | 100 % | 26 / 12.1 | 15 / 9.2 | 17 / 11.2 | 22 / 14.9 | 79 / 46.7 | 19.6 · 28.9 · 32.5 · 33.7 | 36.6 / 50.4 | 84 % |
| expert|realistic|auto|better | 100 % | 19 / 9.2 | 13 / 8.1 | 12 / 7.8 | 11 / 8.0 | 57 / 33.8 | 19.4 · 28.2 · 32.7 · 35.8 | 38.4 / 52.4 | 91 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 10 / 9 | 7 / 13 | 42 | 85 % | 78 % | 7 % | 0 % | – |
| average|realistic|auto|better | 1 / 8 / 7 | 5 / 11 | 37 | 78 % | 76 % | 12 % | 0 % | – |
| expert|realistic|auto|better | 1 / 6 / 4 | 4 / 9 | 27 | 67 % | 66 % | 12 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 0.9 % / 5 % · average|realistic|auto|better 0.9 % / 7 % · expert|realistic|auto|better 0.4 % / 0 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 26 | 25–35 | OK |
| Hody D2 (průměrný) | 15 | 20–30 | FAIL |
| Hody D3 (průměrný) | 17 | 20–30 | FAIL |
| Hody D4 (průměrný) | 22 | 20–30 | OK |
| Minuty D1 (průměrný) | 12.1 | 12–18 | OK |
| Minuty D2 (průměrný) | 9.2 | 10–16 | FAIL |
| Minuty D3 (průměrný) | 11.2 | 12–18 | FAIL |
| Minuty D4 (průměrný) | 14.9 | 14–20 | OK |
| Minuty celkem (průměrný) | 46.7 | 50–75 | FAIL |
| Let medián D1 [s] | 19.6 | ≤ 22 | OK |
| Let medián D2 [s] | 28.9 | ≤ 27 | FAIL |
| Let medián D3 [s] | 32.5 | ≤ 30 | FAIL |
| Let medián D4 [s] | 33.7 | ≤ 35 | OK |
| Let P90 [s] | 36.6 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 1 / 7 (max 8, P90 7) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 5 / 11 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.9 % / 7 % | – | – |
| Strop E zasažen (lety) | 12 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 76 % | 30 %–70 % | FAIL |
| První kapsa (hod) | 37 | 20–40 | OK |
| Koupené úrovně v cíli | 78 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 52.4 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 124) | 100 % | OK |
| Slabý / průměrný (hody) | 1.20 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.72 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.60 | 0.6–0.75 | OK |
