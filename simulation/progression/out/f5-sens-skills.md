# Simulátor progrese: f5-sens-skills

Spuštěno 2026-10-14T11:35:53.697Z, 80 kampaní na skupinu, seed 1. Parametry přepsané: `{}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|better | 100 % | 36 / 15.5 | 22 / 12.0 | 28 / 16.3 | 24 / 14.9 | 110 / 58.8 | 17.6 · 25.5 · 27.4 · 28.0 | 32.0 / 48.2 | 91 % |
| average|realistic|auto|better | 100 % | 30 / 13.2 | 23 / 12.2 | 21 / 12.7 | 23 / 14.8 | 96 / 52.1 | 18.4 · 23.6 · 28.3 · 29.4 | 32.7 / 45.4 | 97 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|better | 2 / 12 / 10 | 8 / 15 | 40 | 87 % | 60 % | 14 % | 0 % | – |
| average|realistic|auto|better | 2 / 9 / 9 | 7 / 13 | 39 | 85 % | 55 % | 18 % | 0 % | – |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|better 1.0 % / 8 % · average|realistic|auto|better 1.1 % / 2 %

## Citlivost (08 §10.3, průměrný a slabý, realistic)

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 109 / 60.3 | 32 / 27 / 26 / 23 | 32.6 / 45.3 | 129 / 70.0 (149) | 5792 / 26.3 |
| krok papíru ×1,1 | 84 / 45.8 | 28 / 18 / 15 / 22 | 32.4 / 45.5 | 96 / 51.1 (125) | 6931 / 26.2 |
| zrychlení klouzání 1,0 | 96 / 56.0 | 30 / 23 / 21 / 23 | 35.5 / 49.6 | 110 / 62.9 (135) | 6362 / 29.0 |
| zrychlení klouzání 1,4 | 96 / 52.1 | 30 / 23 / 21 / 23 | 32.7 / 45.4 | 110 / 58.8 (135) | 6362 / 26.3 |
| ceny ×0,8 | 76 / 41.3 | 24 / 19 / 18 / 15 | 32.4 / 46.6 | 89 / 47.7 (111) | 6362 / 26.3 |
| ceny ×1,25 | 119 / 64.8 | 38 / 27 / 26 / 27 | 32.6 / 47.7 | 142 / 76.0 (172) | 6362 / 26.3 |
| Shooting Star ×0,5 | 97 / 52.9 | 30 / 23 / 21 / 24 | 32.7 / 45.4 | 110 / 58.8 (135) | 6352 / 26.3 |
| Shooting Star ×2 | 95 / 51.6 | 30 / 23 / 20 / 23 | 32.7 / 45.4 | 110 / 59.2 (135) | 6391 / 26.7 |
| rozestup událostí ×0,8 | 87 / 48.1 | 28 / 19 / 17 / 22 | 34.1 / 45.5 | 103 / 55.9 (144) | 6693 / 27.8 |
| rozestup událostí ×1,25 | 105 / 56.6 | 31 / 24 / 25 / 24 | 31.5 / 47.2 | 120 / 64.4 (144) | 6024 / 25.4 |
| readNoise 0 | 94 / 51.2 | 29 / 23 / 23 / 20 | 32.7 / 47.3 | 111 / 59.1 (135) | 6408 / 26.3 |
| readNoise 0,4 | 97 / 52.7 | 30 / 23 / 25 / 22 | 32.3 / 43.2 | 113 / 60.9 (135) | 6279 / 26.3 |
| push sond (scaleWithPace=false) | 109 / 61.1 | 31 / 26 / 27 / 25 | 33.1 / 50.0 | 125 / 68.6 (148) | 5816 / 27.1 |
| nákupčí: trpělivost 3 | 104 / 56.9 | 32 / 23 / 21 / 29 | 32.9 / 49.2 | 115 / 62.2 (144) | 6362 / 26.3 |
| nákupčí: trpělivost 10 | 91 / 48.8 | 30 / 23 / 20 / 17 | 32.1 / 44.7 | 107 / 57.1 (134) | 6362 / 26.3 |
| nákupčí: chyba odhadu 0,25 | 94 / 51.3 | 29 / 22 / 22 / 23 | 32.5 / 45.6 | 110 / 58.5 (135) | 6362 / 26.3 |
| nákupčí: chyba odhadu 0,8 | 97 / 53.1 | 30 / 24 / 21 / 22 | 32.5 / 47.3 | 114 / 61.7 (135) | 6362 / 26.3 |
| nákupčí: bez preference papíru | 96 / 52.5 | 30 / 24 / 20 / 23 | 32.5 / 45.6 | 110 / 58.8 (135) | 6362 / 26.3 |
| papír na hranici čtvrti (openAtPlace 5) | 95 / 52.0 | 30 / 23 / 20 / 23 | 32.6 / 45.5 | 110 / 58.5 (135) | 6362 / 26.3 |
| termika bez perfektu (thermal.perfect 0) | 104 / 57.1 | 30 / 23 / 25 / 25 | 32.6 / 49.2 | 118 / 63.1 (141) | 6178 / 26.2 |
| Dive bez stropu (dive.maxSink null) | 96 / 52.1 | 30 / 23 / 21 / 23 | 32.7 / 45.4 | 110 / 58.8 (135) | 6362 / 26.3 |
| Whistle plné okno (whistle.window 1) | 96 / 52.1 | 30 / 23 / 21 / 23 | 32.7 / 45.4 | 110 / 58.8 (135) | 6362 / 26.3 |

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 30 | 25–35 | OK |
| Hody D2 (průměrný) | 23 | 20–30 | OK |
| Hody D3 (průměrný) | 21 | 20–30 | OK |
| Hody D4 (průměrný) | 23 | 20–30 | OK |
| Minuty D1 (průměrný) | 13.2 | 12–18 | OK |
| Minuty D2 (průměrný) | 12.2 | 10–16 | OK |
| Minuty D3 (průměrný) | 12.7 | 12–18 | OK |
| Minuty D4 (průměrný) | 14.8 | 14–20 | OK |
| Minuty celkem (průměrný) | 52.1 | 50–75 | OK |
| Let medián D1 [s] | 18.4 | ≤ 22 | OK |
| Let medián D2 [s] | 23.6 | ≤ 27 | OK |
| Let medián D3 [s] | 28.3 | ≤ 30 | OK |
| Let medián D4 [s] | 29.4 | ≤ 35 | OK |
| Let P90 [s] | 32.7 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 9 (max 9, P90 9) | ≤ 4 / ≤ 8 | FAIL |
| Mezi místy medián / P90 | 7 / 13 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 1.1 % / 2 % | – | – |
| Strop E zasažen (lety) | 18 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 55 % | 30 %–70 % | OK |
| První kapsa (hod) | 39 | 20–40 | OK |
| Koupené úrovně v cíli | 85 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 48.2 | ≤ 60 | OK |
| Slabý: cíl do 250 hodů | 100 % (max 135) | 100 % | OK |
| Slabý / průměrný (hody) | 1.15 | ≤ 1.4 | OK |
