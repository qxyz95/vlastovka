# Simulátor progrese: obs-mod-cruise10

Spuštěno 2026-10-14T18:27:38.876Z, 60 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}},"models":{"dart":{"cruise":12.1},"glider":{"cruise":12.1}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 41 / 17.1 | 28 / 14.6 | 32 / 17.8 | 30 / 16.9 | 129 / 65.4 | 16.6 · 24.2 · 25.8 · 25.9 | 29.5 / 42.2 | 70 % |
| average|realistic|auto|better | 100 % | 32 / 14.3 | 26 / 13.5 | 25 / 14.6 | 24 / 13.8 | 107 / 55.9 | 17.5 · 22.9 · 26.8 · 26.9 | 30.3 / 44.5 | 85 % |
| expert|realistic|auto|better | 100 % | 22 / 10.3 | 21 / 11.4 | 17 / 10.2 | 15 / 9.5 | 77 / 43.0 | 18.9 · 23.7 · 26.4 · 29.1 | 32.2 / 48.6 | 92 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 14 / 12 | 9 / 17 | 43 | 91 % | 61 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 11 / 10 | 8 / 15 | 42 | 87 % | 58 % | 10 % | 0 % | – |
| expert|realistic|auto|better | 1 / 9 / 8 | 6 / 12 | 34 | 76 % | 43 % | 12 % | 0 % | 0 % |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.3 % / 1 % · average|realistic|auto|better 1.1 % / 0 % · expert|realistic|auto|better 0.8 % / 3 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 32 | 25–35 | OK |
| Hody D2 (průměrný) | 26 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 24 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.3 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.5 | 10–16 | OK |
| Minuty D3 (průměrný) | 14.6 | 12–18 | OK |
| Minuty D4 (průměrný) | 13.8 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 55.9 | 50–75 | OK |
| Let medián D1 [s] | 17.5 | ≤ 22 | OK |
| Let medián D2 [s] | 22.9 | ≤ 27 | OK |
| Let medián D3 [s] | 26.8 | ≤ 30 | OK |
| Let medián D4 [s] | 26.9 | ≤ 35 | OK |
| Let P90 [s] | 30.3 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 10 (max 11, P90 10) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 0 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 58 % | 30 %–70 % | OK |
| První kapsa (hod) | 42 | 20–40 | FAIL |
| Koupené úrovně v cíli | 87 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 48.6 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 164) | 100 % | OK |
| Slabý / průměrný (hody) | 1.21 | ≤ 1.4 | OK |
| Expert / průměrný (hody) | 0.72 | ≥ 0.7 | OK |
| Expert / slabý (hody) | 0.60 | 0.6–0.75 | FAIL |
