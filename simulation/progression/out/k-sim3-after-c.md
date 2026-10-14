# Simulátor progrese: k-sim3-after-c

Spuštěno 2026-10-14T21:12:41.186Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"bots":{"modelPick":{"wind":"next"}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|realistic|auto|preview | 100 % | 29 / 13.4 | 24 / 12.6 | 8 / 5.4 | 21 / 13.5 | 78 / 43.5 | 18.1 · 24.6 · 30.8 · 33.3 | 35.0 / 41.4 | 95 % |
| average|realistic|auto|better | 100 % | 31 / 14.3 | 25 / 13.1 | 20 / 12.3 | 17 / 12.0 | 83 / 45.5 | 18.3 · 22.5 · 28.3 · 33.5 | 34.7 / 44.4 | 96 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|realistic|auto|preview | 2 / 5 / 5 | 5 / 11 | 42 | 76 % | 42 % | 14 % | 0 % | – |
| average|realistic|auto|better | 2 / 8 / 8 | 7 / 12 | 28 | 74 % | 34 % | 13 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|realistic|auto|preview | 2044 / 4132 / 2385 / 6892 | 1850 / 3613 / 2183 / 6175 | workshop 1120, paper 4820, atlas 6680, pocket 300, model 900 | 2244 |
| average|realistic|auto|better | 2222 / 4275 / 4555 / 5379 | 1955 / 3845 / 4490 / 4930 | workshop 1120, paper 4820, atlas 7555, pocket 300, model 1425 | 1250 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|realistic|auto|preview | dart: 33 % · 108 · 984 · 239; glider: 42 % · 169 · 1593 · 307; hawk: 25 % · 361 · 3514 · 539 · 100 % (59); needle: 0 % · 341 · 3315 · 619 · 25 % (77) |
| average|realistic|auto|better | dart: 45 % · 129 · 1197 · 276; glider: 32 % · 189 · 1797 · 344; hawk: 21 % · 349 · 3392 · 520 · 100 % (65); kite: 1 % · 183 · 1735 · 339 · 75 % (67); needle: 1 % · 293 · 2835 · 557 · 25 % (74) |

Paper Crane v kampani (tah v letech / přes nové místo): average|realistic|auto|preview 1.0 % / 33 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 31 | 25–35 | OK |
| Hody D2 (průměrný) | 25 | 20–30 | OK |
| Hody D3 (průměrný) | 20 | 20–30 | OK |
| Hody D4 (průměrný) | 17 | 20–30 | FAIL |
| Minuty D1 (průměrný) | 14.3 | 12–18 | OK |
| Minuty D2 (průměrný) | 13.1 | 10–16 | OK |
| Minuty D3 (průměrný) | 12.3 | 12–18 | OK |
| Minuty D4 (průměrný) | 12.0 | 14–20 | FAIL |
| Minuty celkem (průměrný) | 45.5 | 50–75 | FAIL |
| Let medián D1 [s] | 18.3 | ≤ 22 | OK |
| Let medián D2 [s] | 22.5 | ≤ 27 | OK |
| Let medián D3 [s] | 28.3 | ≤ 30 | OK |
| Let medián D4 [s] | 33.5 | ≤ 35 | OK |
| Let P90 [s] | 34.7 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 8 (max 8, P90 8) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 7 / 12 | ≤ 8 / ≤ 14 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.0 % / – | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 34 % | 30 %–70 % | OK |
| První kapsa (hod) | 28 | 20–40 | OK |
| Koupené úrovně v cíli | 74 % | 60 %–85 % | OK |
| Žádný let > 60 s (skutečný) | 44.4 | ≤ 60 | OK |
