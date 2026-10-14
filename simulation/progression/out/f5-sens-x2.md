# Simulátor progrese: f5-sens-x2

Spuštěno 2026-10-14T12:06:08.383Z, 80 kampaní na skupinu, seed 1. Parametry přepsané: `{"profiles":{"weak":{"qte":0.44},"average":{"qte":0.28},"good":{"qte":0.18},"expert":{"qte":0.1},"weakAssist":{"qte":0.44},"auto":{"qte":0.44}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 42 / 17.4 | 28 / 15.5 | 30 / 17.3 | 31 / 18.2 | 134 / 69.2 | 16.8 · 25.0 · 26.8 · 27.0 | 30.9 / 48.0 | 70 % |
| average|realistic|auto|better | 100 % | 34 / 14.8 | 27 / 14.0 | 25 / 15.1 | 28 / 16.7 | 113 / 60.8 | 17.8 · 23.3 · 27.8 · 28.0 | 31.5 / 46.4 | 84 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 13 / 12 | 10 / 18 | 44 | 91 % | 60 % | 5 % | 0 % | – |
| average|realistic|auto|better | 2 / 14 / 11 | 8 / 15 | 42 | 89 % | 56 % | 10 % | 0 % | – |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 0.9 % / 3 % · average|realistic|auto|better 1.1 % / 3 %

## Citlivost (08 §10.3, průměrný a slabý, realistic)

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 129 / 69.4 | 36 / 34 / 28 / 33 | 31.7 / 47.0 | 151 / 79.7 (174) | 5185 / 26.1 |
| krok papíru ×1,1 | 96 / 51.2 | 31 / 22 / 22 / 22 | 31.2 / 44.0 | 119 / 61.9 (144) | 6217 / 26.1 |
| zrychlení klouzání 1,0 | 113 / 65.1 | 34 / 27 / 25 / 28 | 34.5 / 49.4 | 134 / 74.1 (164) | 5704 / 28.6 |
| zrychlení klouzání 1,4 | 113 / 60.8 | 34 / 27 / 25 / 28 | 31.5 / 46.4 | 134 / 69.2 (164) | 5704 / 26.1 |
| ceny ×0,8 | 88 / 46.4 | 27 / 22 / 20 / 18 | 31.4 / 45.1 | 107 / 56.6 (134) | 5704 / 26.1 |
| ceny ×1,25 | 142 / 75.5 | 42 / 33 / 32 / 36 | 31.6 / 46.9 | 168 / 87.3 (203) | 5704 / 26.1 |
| Shooting Star ×0,5 | 113 / 60.7 | 34 / 27 / 26 / 26 | 31.5 / 45.6 | 134 / 69.8 (164) | 5689 / 26.1 |
| Shooting Star ×2 | 110 / 59.7 | 34 / 27 / 25 / 26 | 31.6 / 46.4 | 136 / 70.9 (164) | 5725 / 26.2 |
| rozestup událostí ×0,8 | 104 / 56.5 | 32 / 24 / 23 / 25 | 32.7 / 47.6 | 127 / 67.0 (150) | 6001 / 26.8 |
| rozestup událostí ×1,25 | 118 / 62.4 | 35 / 28 / 27 / 30 | 30.6 / 42.4 | 143 / 73.4 (165) | 5440 / 25.2 |
| readNoise 0 | 110 / 59.2 | 33 / 27 / 26 / 27 | 31.7 / 49.4 | 133 / 69.3 (164) | 5758 / 26.2 |
| readNoise 0,4 | 111 / 59.5 | 35 / 27 / 26 / 25 | 31.3 / 45.3 | 136 / 70.6 (154) | 5610 / 25.9 |
| push sond (scaleWithPace=false) | 125 / 69.1 | 35 / 33 / 28 / 29 | 32.4 / 47.9 | 146 / 78.0 (171) | 5354 / 27.0 |
| nákupčí: trpělivost 3 | 119 / 63.5 | 36 / 28 / 24 / 30 | 31.7 / 49.7 | 137 / 71.9 (168) | 5704 / 26.1 |
| nákupčí: trpělivost 10 | 107 / 56.7 | 34 / 26 / 25 / 22 | 31.1 / 44.8 | 128 / 65.9 (145) | 5704 / 26.1 |
| nákupčí: chyba odhadu 0,25 | 110 / 59.0 | 33 / 25 / 26 / 27 | 31.4 / 45.6 | 135 / 70.8 (164) | 5704 / 26.1 |
| nákupčí: chyba odhadu 0,8 | 114 / 61.3 | 35 / 27 / 26 / 26 | 31.6 / 44.7 | 136 / 71.3 (164) | 5704 / 26.1 |
| nákupčí: bez preference papíru | 110 / 59.5 | 34 / 27 / 26 / 28 | 31.5 / 44.7 | 136 / 70.4 (164) | 5704 / 26.1 |
| papír na hranici čtvrti (openAtPlace 5) | 111 / 59.6 | 34 / 26 / 25 / 27 | 31.5 / 49.2 | 134 / 69.6 (164) | 5704 / 26.1 |
| termika bez perfektu (thermal.perfect 0) | 117 / 63.0 | 34 / 27 / 27 / 28 | 31.5 / 44.7 | 138 / 72.5 (151) | 5571 / 26.1 |
| Dive bez stropu (dive.maxSink null) | 113 / 60.8 | 34 / 27 / 25 / 28 | 31.5 / 46.4 | 134 / 69.2 (164) | 5704 / 26.1 |
| Whistle plné okno (whistle.window 1) | 113 / 60.8 | 34 / 27 / 25 / 28 | 31.5 / 46.4 | 134 / 69.2 (164) | 5704 / 26.1 |

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 34 | 25–35 | OK |
| Hody D2 (průměrný) | 27 | 20–30 | OK |
| Hody D3 (průměrný) | 25 | 20–30 | OK |
| Hody D4 (průměrný) | 28 | 20–30 | OK |
| Minuty D1 (průměrný) | 14.8 | 12–18 | OK |
| Minuty D2 (průměrný) | 14.0 | 10–16 | OK |
| Minuty D3 (průměrný) | 15.1 | 12–18 | OK |
| Minuty D4 (průměrný) | 16.7 | 14–20 | OK |
| Minuty celkem (průměrný) | 60.8 | 50–75 | OK |
| Let medián D1 [s] | 17.8 | ≤ 22 | OK |
| Let medián D2 [s] | 23.3 | ≤ 27 | OK |
| Let medián D3 [s] | 27.8 | ≤ 30 | OK |
| Let medián D4 [s] | 28.0 | ≤ 35 | OK |
| Let P90 [s] | 31.5 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 11 (max 14, P90 11) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 8 / 15 | ≤ 8 / ≤ 14 | FAIL |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 3 % | – | – |
| Strop E zasažen (lety) | 10 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 56 % | 30 %–70 % | OK |
| První kapsa (hod) | 42 | 20–40 | FAIL |
| Koupené úrovně v cíli | 89 % | 60 %–85 % | FAIL |
| Žádný let > 60 s (skutečný) | 48.0 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 164) | 100 % | OK |
| Slabý / průměrný (hody) | 1.19 | ≤ 1.4 | OK |
