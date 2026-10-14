# Simulátor progrese: obs-mod-needle-as-glider

Spuštěno 2026-10-14T18:33:44.629Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"glider":{"speed":24,"glide":2.6,"cruise":14,"ideal":12,"qte":0.9,"drag":0.08}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 14.8 | 29 / 12.9 | 32 / 15.9 | 38 / 19.5 | 139 / 62.3 | 13.0 · 19.1 · 21.9 · 22.0 | 25.4 / 38.7 | 70 % |
| average|realistic|auto|better | 100 % | 33 / 12.9 | 23 / 10.5 | 24 / 12.6 | 32 / 17.4 | 113 / 53.3 | 15.2 · 19.3 · 23.3 · 23.7 | 26.5 / 37.3 | 85 % |
| expert|realistic|auto|better | 100 % | 21 / 8.7 | 14 / 7.1 | 14 / 7.7 | 13 / 8.2 | 64 / 31.9 | 16.9 · 21.3 · 24.2 · 27.4 | 29.5 / 42.3 | 90 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 13 | 10 / 20 | 42 | 91 % | 57 % | 2 % | 0 % | – |
| average|realistic|auto|better | 2 / 12 / 11 | 8 / 16 | 37 | 89 % | 56 % | 6 % | 0 % | – |
| expert|realistic|auto|better | 1 / 8 / 7 | 5 / 9 | 24 | 70 % | 66 % | 6 % | 0 % | 2 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.5 % / 2 % · average|realistic|auto|better 1.1 % / 4 % · expert|realistic|auto|better 0.9 % / 3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 33 | 25–35 | OK |
| Hody D2 (průměrný) | 23 | 20–30 | OK |
| Hody D3 (průměrný) | 24 | 20–30 | OK |
| Hody D4 (průměrný) | 32 | 20–30 | FAIL |
| Minuty D1 (průměrný) | 12.9 | 12–18 | OK |
| Minuty D2 (průměrný) | 10.5 | 10–16 | OK |
| Minuty D3 (průměrný) | 12.6 | 12–18 | OK |
| Minuty D4 (průměrný) | 17.4 | 14–20 | OK |
| Minuty celkem (průměrný) | 53.3 | 50–75 | OK |
| Let medián D1 [s] | 15.2 | ≤ 22 | OK |
| Let medián D2 [s] | 19.3 | ≤ 27 | OK |
| Let medián D3 [s] | 23.3 | ≤ 30 | OK |
| Let medián D4 [s] | 23.7 | ≤ 35 | OK |
| Let P90 [s] | 26.5 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 12, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 16 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 4 % | – | – |
| Strop E zasažen (lety) | 6 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 37 | 20–40 | OK |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 42.3 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 164) | 100 % | OK |
| Slabý / průměrný (hody) | 1.23 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.57 | ≥ 0.7 | FAIL |
| Expert / slabý (hody) | 0.46 | 0.6–0.75 | FAIL |
