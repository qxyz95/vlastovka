# Simulátor progrese: k-sim2-preview-passive

Spuštěno 2026-10-14T19:49:39.108Z, 4 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"bots":{"modelPick":{"mode":"passive"}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 39 / 16.3 | 24 / 12.4 | 37 / 20.8 | 45 / 24.5 | 145 / 73.2 | 16.5 · 22.8 · 25.0 · 25.0 | 29.1 / 35.2 | 92 % |
| average|realistic|auto|preview | 100 % | 28 / 12.5 | 25 / 12.5 | 30 / 17.1 | 39 / 21.6 | 111 / 58.4 | 17.6 · 21.4 · 26.0 · 26.3 | 29.9 / 36.2 | 97 % |
| expert|realistic|auto|preview | 100 % | 24 / 11.0 | 24 / 12.1 | 20 / 11.5 | 18 / 11.4 | 85 / 46.3 | 19.4 · 23.9 · 26.2 · 27.7 | 30.6 / 40.1 | 93 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 11 / 11 | 9 / 25 | 43 | 91 % | 0 % | 11 % | 0 % | – |
| average|realistic|auto|preview | 2 / 9 / 9 | 7 / 20 | 34 | 89 % | 0 % | 16 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 7 / 7 | 6 / 11 | 48 | 80 % | 0 % | 14 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2553 / 4548 / 9409 / 13294 | 2273 / 4310 / 8338 / 13100 | workshop 1120, paper 8920, atlas 12180, pocket 300, model 5500 | 2111 |
| average|realistic|auto|preview | 2082 / 4342 / 5955 / 13137 | 1915 / 3968 / 5738 / 13000 | workshop 1120, paper 8220, atlas 11180, pocket 300, model 3800 | 733 |
| expert|realistic|auto|preview | 1716 / 4030 / 6285 / 7299 | 1485 / 3785 / 5050 / 7700 | paper 4120, workshop 1120, atlas 8555, pocket 300, model 3925 | 1234 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 94 % · 203 · 1937 · 406; needle: 6 % · 351 · 3418 · 711 · 100 % (128) |
| average|realistic|auto|preview | dart: 92 % · 211 · 2018 · 410; needle: 8 % · 390 · 3800 · 753 · 75 % (96) |
| expert|realistic|auto|preview | dart: 88 % · 203 · 1936 · 381; needle: 12 % · 380 · 3705 · 670 · 100 % (80) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 1.4 % / 0 % · average|realistic|auto|preview 1.6 % / 0 % · expert|realistic|auto|preview 0.9 % / 0 %

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 40.1 | ≤ 60 | OK |
