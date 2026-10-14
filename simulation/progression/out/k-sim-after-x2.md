# Simulátor progrese: k-sim-after-x2

Spuštěno 2026-10-14T18:50:43.416Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|realistic|auto|better | 100 % | 34 / 15.7 | 28 / 14.4 | 22 / 13.5 | 29 / 17.4 | 113 / 61.1 | 18.0 · 23.5 · 28.8 · 27.7 | 32.2 / 40.9 | 82 % |
| average|realistic|auto|dart | 100 % | 36 / 15.3 | 26 / 12.8 | 22 / 12.4 | 33 / 19.0 | 139 / 69.9 | 17.2 · 21.5 · 25.9 · 25.5 | 28.6 / 37.8 | 82 % |
| average|realistic|auto|glider | 100 % | 34 / 16.1 | 30 / 16.5 | 21 / 12.8 | 29 / 18.3 | 111 / 64.3 | 20.3 · 24.9 · 29.5 · 29.1 | 33.2 / 41.7 | 82 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|realistic|auto|better | 2 / 12 / 12 | 8 / 15 | 44 | 89 % | 56 % | 9 % | 0 % | – |
| average|realistic|auto|dart | 2 / 12 / 12 | 8 / 15 | 38 | 93 % | 0 % | 7 % | 0 % | – |
| average|realistic|auto|glider | 2 / 11 / 11 | 7 / 13 | 47 | 89 % | 99 % | 10 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|realistic|auto|better | 2417 / 4893 / 6099 / 10940 | 2158 / 4602 / 5793 / 10367 | workshop 1120, paper 9487, atlas 12013, pocket 300 | 986 |
| average|realistic|auto|dart | 2593 / 5055 / 6664 / 11388 | 2317 / 4938 / 5548 / 10983 | workshop 1120, paper 11353, atlas 11013, pocket 300 | 1756 |
| average|realistic|auto|glider | 2314 / 4832 / 6233 / 9836 | 2050 / 4322 / 6265 / 9383 | workshop 1120, paper 8753, atlas 11847, pocket 300 | 1135 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|realistic|auto|better | dart: 43 % · 183 · 1734 · 379; glider: 57 % · 233 · 2234 · 407 |
| average|realistic|auto|dart | dart: 100 % · 214 · 2044 · 427 |
| average|realistic|auto|glider | dart: 1 % · 34 · 243 · 90; glider: 99 % · 212 · 2022 · 377 |

Paper Crane v kampani (tah v letech / přes nové místo): average|realistic|auto|better 0.9 % / 17 % · average|realistic|auto|dart 1.4 % / 10 % · average|realistic|auto|glider 1.2 % / 13 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 28 | 20–30 | OK |
| Hody D3 (průměrný) | 22 | 20–30 | OK |
| Hody D4 (průměrný) | 29 | 20–30 | OK |
| Minuty D1 (průměrný) | 15.7 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.4 | 10–16 | OK |
| Minuty D3 (průměrný) | 13.5 | 12–18 | OK |
| Minuty D4 (průměrný) | 17.4 | 14–20 | OK |
| Minuty celkem (průměrný) | 61.1 | 50–75 | OK |
| Let medián D1 [s] | 18.0 | ≤ 22 | OK |
| Let medián D2 [s] | 23.5 | ≤ 27 | OK |
| Let medián D3 [s] | 28.8 | ≤ 30 | OK |
| Let medián D4 [s] | 27.7 | ≤ 35 | OK |
| Let P90 [s] | 32.2 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 12 (max 12, P90 12) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.9 % / 17 % | – | – |
| Strop E zasažen (lety) | 9 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 44 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 41.7 | ≤ 60 | OK |
