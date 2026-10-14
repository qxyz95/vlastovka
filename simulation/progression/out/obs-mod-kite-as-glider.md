# Simulátor progrese: obs-mod-kite-as-glider

Spuštěno 2026-10-14T18:34:40.407Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"glider":{"speed":12,"glide":4.6,"cruise":8,"ideal":40,"qte":1.1,"drag":0.12}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 18.7 | 29 / 18.2 | 30 / 19.5 | 35 / 23.3 | 136 / 78.7 | 18.0 · 29.7 · 31.4 · 31.7 | 37.5 / 53.8 | 70 % |
| average|realistic|auto|better | 100 % | 34 / 15.6 | 25 / 14.0 | 25 / 16.6 | 28 / 19.1 | 111 / 65.5 | 18.2 · 25.9 · 32.1 · 32.5 | 38.2 / 54.3 | 85 % |
| expert|realistic|auto|better | 100 % | 24 / 11.1 | 22 / 12.8 | 19 / 12.4 | 16 / 11.7 | 82 / 49.1 | 19.4 · 25.3 · 31.5 · 34.9 | 39.0 / 56.9 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 12 | 10 / 18 | 46 | 91 % | 60 % | 7 % | 0 % | – |
| average|realistic|auto|better | 2 / 13 / 10 | 8 / 16 | 43 | 89 % | 51 % | 13 % | 0 % | – |
| expert|realistic|auto|better | 1 / 9 / 8 | 6 / 12 | 34 | 80 % | 45 % | 16 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.3 % / 2 % · average|realistic|auto|better 1.1 % / 5 % · expert|realistic|auto|better 0.7 % / 0 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 25 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 28 | 20–30 | OK |
| Minuty D1 (průměrný) | 15.6 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.0 | 10–16 | OK |
| Minuty D3 (průměrný) | 16.6 | 12–18 | OK |
| Minuty D4 (průměrný) | 19.1 | 14–20 | OK |
| Minuty celkem (průměrný) | 65.5 | 50–75 | OK |
| Let medián D1 [s] | 18.2 | ≤ 22 | OK |
| Let medián D2 [s] | 25.9 | ≤ 27 | OK |
| Let medián D3 [s] | 32.1 | ≤ 30 | FAIL |
| Let medián D4 [s] | 32.5 | ≤ 35 | OK |
| Let P90 [s] | 38.2 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 10 (max 13, P90 10) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 5 % | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 51 % | 30 %–70 % | OK |
| První kapsa (hod) | 43 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 56.9 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 167) | 100 % | OK |
| Slabý / průměrný (hody) | 1.23 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.74 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.60 | 0.6–0.75 | OK |
