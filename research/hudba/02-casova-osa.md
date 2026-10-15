# Hudba, krok 2: časová osa typických letů (surový materiál)

Stav: 15. 10. 2026. Měřeno na současné mechanice (`src/flight.js`, čísla `simulation/progression/params.mjs`), kód hry se nezměnil. Výstup generuje `simulation/hudba/timeline.mjs` (sekce A–E níže jsou jeho doslovný výstup, viz sekce F). Navazuje na `01-vyzkum-a-plan.md`.

## Jak číst a co z toho plyne pro hudbu (shrnutí)
- **Let trvá 17–31 s letového času** (medián 18 s rané, 27 s střední a pozdní stádium). Hráč ho skutečně prožije o ~8 % kratší (medián 0,91–0,93), protože klidné klouzání běží 1,4× rychleji; **události (varování, okno, účinek) se nezrychlují**, zrychlují se jen volné úseky mezi nimi (`flight.js` `realTime`).
- **Stavba letu je pravidelná:** 1. varování vždy v 1,5 s po výhozu, okno QTE se otevírá 0,8 s po začátku varování (termika 2,0 s), poryv/hvězda/dron mají okno 1,2 s, holub drží ≤ 1,2 s, účinek ≥ 1 s po vyhodnocení, pak klid 3 s (první tři události) nebo 4–7 s (další). Hudba může být vázaná na tuto mřížku.
- **Hráč nic nemačká zhruba 56–57 % času letu** (mimo událost od začátku varování po konec účinku); v samotném okně QTE je jen 18–22 % času.
- **Událostí za let 3–4 (rozsah 2–5), akcí hráče 4–8** (holub = 2 akce, pára = 2 akce, Rocket = 1). Typický rozestup mezi akcemi 1,7–5 s, ale P10 je 0,4–0,8 s (pára, holub: stisk a puštění).
- **Hranice čtvrtí** se přecházejí uprostřed letu: od středního stádia 100 % letů přejde aspoň 1, medián 2 hranice (D1→D2 kolem 9–13 s, D2→D3 kolem 17–24 s). V rané fázi (dolet ~700 m) žádná.

## A. Stádia kampaně a vybavení

Reference: 20 kampaní profilu average (balanced 10, paper-first 10; seed 1, id 0–9, tytéž jako prvních 10 kampaní každé skupiny v mc-plna). Průměrná délka kampaně: 54.5 min, rozsah 42.1–64.0 min.

| Stádium | minuta | hod č. (medián, rozsah) | čtvrť (medián) | kampaní už dohráno | vybavení (medián po složkách) |
|---|---:|---|---:|---:|---|
| rané | 10 | 26 (23–28) | D1 | 0 z 20 | Power 1/3, Folds 0/3, Paper 3/12, kapsy 0 (–), Atlas chain1 pinwheel1; Glider ano |
| střední | 45 | 88 (80–104) | D3 | 4 z 20 | Power 3/3, Folds 2/3, Paper 8/12, kapsy 1 (rocket), Atlas chain1 pinwheel3 steam3 tape1 crane2 skip1 gull1 momentum1 thermal1 echo1 star1; Glider ano |
| pozdní | 80 | 107 (80–135) | D4 | 20 z 20 | Power 3/3, Folds 2/3, Paper 9/12, kapsy 1 (rocket), Atlas chain2 pinwheel3 steam3 tape1 crane2 skip1 gull1 momentum1 thermal1 echo1 star1 drone1 paperCrane1 onAir1; Glider ano |

## B. Tabulky událostí (čas letu v sekundách, t = 0 výhoz)

Sloupce: varování = začátek varování, okno od/do = otevření a zavření okna QTE (holub: okno do = stisk + 1,2 s), střed = ideální okamžik (perfekt), stisk = čas stisku/puštění bota, výsledek, účinek do = konec účinku události. `*` u typu = událost přivolaná Whistle.

### rané stádium (minuta 10; Power 1/3, Folds 0/3, Paper 3/12, kapsy 0 (–), Atlas chain1 pinwheel1)

| seed (hod č.) | model | co | t / varování | okno od | okno do | střed | stisk | výsledek | účinek do |
|---:|---|---|---:|---:|---:|---|---|---|---:|
| 26 | dart | výhoz | 0.00 | | | | | | |
| 26 | dart | gust | 1.52 | 2.32 | 3.52 | 3.11 | 2.97 | success | 3.97 |
| 26 | dart | bird | 6.98 | 7.78 | 9.57 | 9.20 | 8.37 / 9.32 | success | 10.32 |
| 26 | dart | bird | 13.32 | 14.12 | 15.75 | 15.19 | 14.55 / 15.47 | miss | 16.47 |
| 26 | dart | dopad | 18.94 | | | | | dolet 885 m; celkem 18.94 s letu = 17.70 s skutečně | |
| 27 | glider | výhoz | 0.00 | | | | | | |
| 27 | glider | bird | 1.52 | 2.32 | 4.25 | 3.97 | 3.05 / 4.20 | success | 5.20 |
| 27 | glider | bird | 8.22 | 9.02 | 10.67 | 10.33 | 9.47 / 10.55 | success | 11.55 |
| 27 | glider | gust | 14.55 | 15.35 | 16.55 | 16.13 | 16.13 | perfect | 17.13 |
| 27 | glider | dopad | 20.43 | | | | | dolet 729 m; celkem 20.43 s letu = 18.57 s skutečně | |
| 28 | dart | výhoz | 0.00 | | | | | | |
| 28 | dart | gust | 1.52 | 2.32 | 3.52 | 2.96 | 3.03 | perfect | 4.03 |
| 28 | dart | bird | 7.05 | 7.85 | 9.67 | 9.16 | 8.47 / 9.32 | success | 10.32 |
| 28 | dart | bird | 13.32 | 14.12 | 15.53 | 15.23 | 14.33 / 15.30 | perfect | 16.40 |
| 28 | dart | dopad | 19.72 | | | | | dolet 945 m; celkem 19.72 s letu = 18.24 s skutečně | |
| 29 | glider | výhoz | 0.00 | | | | | | |
| 29 | glider | gust | 1.52 | 2.32 | 3.52 | 2.93 | 2.92 | perfect | 3.92 |
| 29 | glider | gust | 6.93 | 7.73 | 8.93 | 8.31 | 8.33 | perfect | 9.33 |
| 29 | glider | bird | 12.33 | 13.13 | 14.70 | 14.33 | 13.50 / 14.50 | success | 15.50 |
| 29 | glider | dopad | 21.05 | | | | | dolet 768 m; celkem 21.05 s letu = 18.98 s skutečně | |
| 30 | dart | výhoz | 0.00 | | | | | | |
| 30 | dart | bird | 1.52 | 2.32 | 3.52 | 2.94 | 2.32 / 3.33 | miss | 4.33 |
| 30 | dart | bird | 7.35 | 8.15 | 9.75 | 9.45 | 8.55 / 9.47 | perfect | 10.57 |
| 30 | dart | gust | 13.57 | 14.37 | 15.57 | 14.79 | 15.05 | success | 16.05 |
| 30 | dart | dopad | 16.73 | | | | | dolet 697 m; celkem 16.73 s letu = 15.62 s skutečně | |
| 31 | glider | výhoz | 0.00 | | | | | | |
| 31 | glider | bird | 1.52 | 2.32 | 3.80 | 3.26 | 2.60 / 3.42 | success | 4.42 |
| 31 | glider | gust | 7.43 | 8.23 | 9.43 | 9.01 | 9.15 | success | 10.15 |
| 31 | glider | bird | 13.15 | 13.95 | 15.75 | 15.27 | 14.55 / 15.57 | miss | 16.57 |
| 31 | glider | dopad | 18.39 | | | | | dolet 688 m; celkem 18.39 s letu = 17.15 s skutečně | |

### střední stádium (minuta 45; Power 3/3, Folds 2/3, Paper 8/12, kapsy 1 (rocket), Atlas chain1 pinwheel3 steam3 tape1 crane2 skip1 gull1 momentum1 thermal1 echo1 star1)

| seed (hod č.) | model | co | t / varování | okno od | okno do | střed | stisk | výsledek | účinek do |
|---:|---|---|---:|---:|---:|---|---|---|---:|
| 88 | dart | výhoz | 0.00 | | | | | | |
| 88 | dart | gust | 1.52 | 2.32 | 3.52 | 2.75 | 3.05 | success | 4.05 |
| 88 | dart | bird | 7.07 | 7.87 | 9.45 | 9.15 | 8.25 / 9.47 | miss | 10.47 |
| 88 | dart | hranice D1→D2 | 11.23 | | | | | | |
| 88 | dart | thermal | 13.47 | 15.47 | 16.77 | 16.12 | 16.43 | success | 17.43 |
| 88 | dart | hranice D2→D3 | 21.67 | | | | | | |
| 88 | dart | thermal | 22.85 | 24.85 | 26.15 | 25.50 | 25.77 | success | 26.77 |
| 88 | dart | dopad | 29.45 | | | | | dolet 2989 m; celkem 29.45 s letu = 27.17 s skutečně | |
| 89 | glider | výhoz | 0.00 | | | | | | |
| 89 | glider | bird | 1.52 | 2.32 | 3.62 | 3.32 | 2.42 / 3.60 | success | 4.70 |
| 89 | glider | gust | 7.72 | 8.52 | 9.72 | 9.06 | 8.90 | success | 9.90 |
| 89 | glider | hranice D1→D2 | 11.93 | | | | | | |
| 89 | glider | gust | 12.90 | 13.70 | 14.90 | 14.37 | 14.55 | success | 15.55 |
| 89 | glider | bird | 20.35 | 21.15 | 22.52 | 22.07 | 21.32 / 22.03 | perfect | 23.55 |
| 89 | glider | hranice D2→D3 | 24.15 | | | | | | |
| 89 | glider | dopad | 28.71 | | | | | dolet 2852 m; celkem 28.71 s letu = 25.66 s skutečně | |
| 90 | dart | výhoz | 0.00 | | | | | | |
| 90 | dart | bird | 1.52 | 2.32 | 4.03 | 3.68 | 2.83 / 3.78 | perfect | 5.10 |
| 90 | dart | gust | 8.12 | 8.92 | 10.12 | 9.39 | 9.53 | perfect | 10.53 |
| 90 | dart | hranice D1→D2 | 10.08 | | | | | | |
| 90 | dart | bird | 13.53 | 14.33 | 15.87 | 15.35 | 14.67 / 15.63 | success | 16.63 |
| 90 | dart | hranice D2→D3 | 20.58 | | | | | | |
| 90 | dart | thermal | 20.90 | 22.90 | 24.20 | 23.55 | 23.55 | perfect | 24.55 |
| 90 | dart | dopad | 29.58 | | | | | dolet 3204 m; celkem 29.58 s letu = 27.64 s skutečně | |
| 91 | glider | výhoz | 0.00 | | | | | | |
| 91 | glider | gust | 1.52 | 2.32 | 3.52 | 3.04 | 2.90 | perfect | 3.90 |
| 91 | glider | bird | 6.92 | 7.72 | 9.10 | 8.50 | 7.90 / 8.55 | perfect | 10.07 |
| 91 | glider | hranice D1→D2 | 12.55 | | | | | | |
| 91 | glider | gust | 13.08 | 13.88 | 15.08 | 14.45 | 14.70 | success | 15.70 |
| 91 | glider | gust | 20.77 | 21.57 | 22.77 | 21.95 | 21.90 | perfect | 22.90 |
| 91 | glider | hranice D2→D3 | 24.10 | | | | | | |
| 91 | glider | dopad | 30.43 | | | | | dolet 2987 m; celkem 30.43 s letu = 27.19 s skutečně | |
| 92 | dart | výhoz | 0.00 | | | | | | |
| 92 | dart | thermal | 1.52 | 3.52 | 4.82 | 4.17 | 4.13 | perfect | 5.13 |
| 92 | dart | thermal | 8.15 | 10.15 | 11.45 | 10.80 | 10.65 | success | 11.65 |
| 92 | dart | hranice D1→D2 | 9.30 | | | | | | |
| 92 | dart | gust | 14.65 | 15.45 | 16.65 | 16.26 | 16.55 | success | 17.55 |
| 92 | dart | hranice D2→D3 | 17.83 | | | | | | |
| 92 | dart | dopad | 22.94 | | | | | dolet 3014 m; celkem 22.94 s letu = 20.86 s skutečně | |
| 93 | glider | výhoz | 0.00 | | | | | | |
| 93 | glider | gust | 1.52 | 2.32 | 3.52 | 2.90 | 3.27 | success | 4.27 |
| 93 | glider | thermal | 7.28 | 9.28 | 10.58 | 9.93 | 9.93 | perfect | 10.93 |
| 93 | glider | hranice D1→D2 | 12.95 | | | | | | |
| 93 | glider | gust | 13.93 | 14.73 | 15.93 | 15.28 | 15.15 | perfect | 16.15 |
| 93 | glider | thermal | 22.70 | 24.70 | 26.00 | 25.35 | 25.68 | success | 26.68 |
| 93 | glider | hranice D2→D3 | 23.48 | | | | | | |
| 93 | glider | dopad | 28.26 | | | | | dolet 2922 m; celkem 28.26 s letu = 25.67 s skutečně | |

### pozdní stádium (minuta 80; Power 3/3, Folds 2/3, Paper 9/12, kapsy 1 (rocket), Atlas chain2 pinwheel3 steam3 tape1 crane2 skip1 gull1 momentum1 thermal1 echo1 star1 drone1 paperCrane1 onAir1)

| seed (hod č.) | model | co | t / varování | okno od | okno do | střed | stisk | výsledek | účinek do |
|---:|---|---|---:|---:|---:|---|---|---|---:|
| 107 | dart | výhoz | 0.00 | | | | | | |
| 107 | dart | gust | 1.52 | 2.32 | 3.52 | 2.77 | 2.82 | perfect | 3.82 |
| 107 | dart | steam | 6.83 | 7.63 | 9.01 | 8.13 / 8.63 | 8.25 / 8.98 | success | 9.98 |
| 107 | dart | hranice D1→D2 | 10.37 | | | | | | |
| 107 | dart | steam | 12.98 | 13.78 | 15.12 | 14.28 / 14.74 | 14.67 / 14.72 | partial | 15.72 |
| 107 | dart | hranice D2→D3 | 17.67 | | | | | | |
| 107 | dart | drone | 20.52 | 21.32 | 22.52 | 22.40 | 22.52 | perfect | 23.52 |
| 107 | dart | dopad | 27.87 | | | | | dolet 3474 m; celkem 27.87 s letu = 25.64 s skutečně | |
| 108 | glider | výhoz | 0.00 | | | | | | |
| 108 | glider | steam | 1.52 | 2.32 | 3.67 | 2.82 / 3.30 | 2.85 / 3.37 | perfect | 4.37 |
| 108 | glider | thermal | 7.38 | 9.38 | 10.68 | 10.03 | 10.42 | half | 11.42 |
| 108 | glider | hranice D1→D2 | 9.77 | | | | | | |
| 108 | glider | thermal | 14.42 | 16.42 | 17.72 | 17.07 | 17.15 | perfect | 18.15 |
| 108 | glider | hranice D2→D3 | 17.90 | | | | | | |
| 108 | glider | gust | 22.77 | 23.57 | 24.77 | 24.14 | 24.42 | success | 25.42 |
| 108 | glider | hranice D3→D4 | 25.50 | | | | | | |
| 108 | glider | dopad | 28.29 | | | | | dolet 4016 m; celkem 28.29 s letu = 25.89 s skutečně | |
| 109 | dart | výhoz | 0.00 | | | | | | |
| 109 | dart | drone | 1.52 | 2.32 | 3.52 | 3.40 | 3.48 | perfect | 4.48 |
| 109 | dart | thermal | 7.50 | 9.50 | 10.80 | 10.15 | 10.43 | success | 11.43 |
| 109 | dart | hranice D1→D2 | 8.25 | | | | | | |
| 109 | dart | gust | 14.43 | 15.23 | 16.43 | 15.75 | 15.70 | perfect | 16.70 |
| 109 | dart | hranice D2→D3 | 15.92 | | | | | | |
| 109 | dart | dopad | 22.63 | | | | | dolet 3465 m; celkem 22.63 s letu = 20.89 s skutečně | |
| 110 | glider | výhoz | 0.00 | | | | | | |
| 110 | glider | gust | 1.52 | 2.32 | 3.52 | 2.82 | 2.78 | perfect | 3.78 |
| 110 | glider | thermal | 6.80 | 8.80 | 10.10 | 9.45 | 9.30 | success | 10.30 |
| 110 | glider | hranice D1→D2 | 11.00 | | | | | | |
| 110 | glider | bird | 13.30 | 14.10 | 15.45 | 14.86 | 14.25 / 14.93 | perfect | 16.45 |
| 110 | glider | hranice D2→D3 | 18.97 | | | | | | |
| 110 | glider | gust | 23.32 | 24.12 | 25.32 | 24.60 | 24.80 | success | 25.80 |
| 110 | glider | hranice D3→D4 | 29.48 | | | | | | |
| 110 | glider | dopad | 30.70 | | | | | dolet 3783 m; celkem 30.70 s letu = 27.33 s skutečně | |
| 111 | dart | výhoz | 0.00 | | | | | | |
| 111 | dart | drone | 1.52 | 2.32 | 3.52 | 3.40 | 3.53 | miss | 4.53 |
| 111 | dart | bird | 7.55 | 8.35 | 10.07 | 9.60 | 8.87 / 9.58 | perfect | 10.90 |
| 111 | dart | hranice D1→D2 | 10.42 | | | | | | |
| 111 | dart | bird | 13.92 | 14.72 | 16.00 | 15.50 | 14.80 / 15.58 | perfect | 16.90 |
| 111 | dart | hranice D2→D3 | 20.12 | | | | | | |
| 111 | dart | steam | 22.87 | 23.67 | 25.00 | 24.17 / 24.62 | 24.52 / 24.65 | success | 25.65 |
| 111 | dart | dopad | 29.88 | | | | | dolet 3352 m; celkem 29.88 s letu = 27.37 s skutečně | |
| 112 | glider | výhoz | 0.00 | | | | | | |
| 112 | glider | bird | 1.52 | 2.32 | 3.55 | 2.99 | 2.35 / 3.15 | success | 4.25 |
| 112 | glider | drone | 7.27 | 8.07 | 9.27 | 9.15 | 9.17 | perfect | 10.17 |
| 112 | glider | hranice D1→D2 | 11.65 | | | | | | |
| 112 | glider | bird | 13.17 | 13.97 | 15.65 | 15.16 | 14.45 / 15.10 | perfect | 16.62 |
| 112 | glider | hranice D2→D3 | 20.57 | | | | | | |
| 112 | glider | drone | 22.35 | 23.15 | 24.35 | 24.23 | 24.37 | miss | 25.37 |
| 112 | glider | dopad | 27.98 | | | | | dolet 3203 m; celkem 27.98 s letu = 25.40 s skutečně | |

## C. Souhrny za stádium (200 letů na stádium, hody č. 26 / 88 / 107 a dál)

| Ukazatel | rané | střední | pozdní |
|---|---:|---:|---:|
| délka letu, medián [s letu] | 18.1 | 27.5 | 27.7 |
| délka letu, P10–P90 [s letu] | 13.9–21.3 | 21.8–31.4 | 21.8–31.9 |
| délka letu skutečně (se zrychlením klouzání), medián [s] | 16.8 | 25.2 | 25.3 |
| skutečný / letový čas, medián | 0.93 | 0.92 | 0.91 |
| dolet, medián [m] | 712 | 3019 | 3488 |
| průměrná rychlost, medián [m/s] | 39.4 | 113.1 | 129.7 |
| míst přejitých za let (hranice po 304,8 m), medián | 2 | 9 | 11 |
| podíl letů, kde se přejde hranice čtvrti (1 219 m) | 0 % | 100 % | 100 % |
| hranic čtvrtí za let, medián | 0 | 2 | 2 |
| QTE začatých za let: medián (min–max) | 3 (2–4) | 4 (3–5) | 4 (2–5) |
| QTE dokončených za let, medián | 3 | 4 | 4 |
| podíl času v události (varování až konec účinku), medián | 44 % | 43 % | 43 % |
| podíl času v okně QTE (otevření až zavření), medián | 22 % | 19 % | 18 % |
| podíl času mimo událost, medián (P10–P90) | 56 % (49–62) | 57 % (51–62) | 57 % (51–62) |
| z toho bez držení Dive (nic se nemačká), medián | 56 % | 57 % | 57 % |
| akcí hráče za let (stisky QTE + schopnosti), medián | 4 | 8 | 7 |
| 1. varování po výhozu, medián [s] | 1.5 | 1.5 | 1.5 |
| rozestup mezi akcemi: medián [s] | 5.0 | 1.7 | 2.2 |
| rozestup mezi akcemi: P10–P90 [s] | 0.8–5.7 | 0.4–6.2 | 0.4–6.4 |
| klid mezi událostmi (konec účinku do dalšího varování): medián [s] | 3.0 | 3.0 | 3.0 |
| klid mezi událostmi: P10–P90 [s] | 3.0–3.0 | 3.0–5.3 | 3.0–5.5 |
| poslední konec události do dopadu, medián [s] | 3.2 | 4.6 | 4.4 |
| podíl událostí podle typu | bird 53 %, gust 47 % | bird 32 %, gust 30 %, steam 18 %, thermal 18 %, star 2 % | gust 26 %, bird 25 %, steam 16 %, thermal 16 %, drone 15 %, star 2 % |

## D. Čas mimo let (z kampaní simulátoru)

Simulátor má jednu konstantu `time.ui` = 8 s na hod (míření + výsledek + Dílna dohromady, nerozdělené) a `time.districtCard` = 4 s za kartu čtvrti. V 20 referenčních kampaních: 2182 hodů, celkem 1090.2 min, z toho mimo let 294.9 min (27 %), v letu 795.3 min; průměrně 30.0 s na hod včetně letu.


## E. Čas ve čtvrtích podle mc-plna (z `simulation/progression/out/mc-plna.json`, 300 kampaní na skupinu)

Soubor: mc-plna, 2026-10-15T10:59:56.925Z, n = 300, seed 1. Čtvrť = nejvzdálenější dosažený dolet (rekord) po hranicích 1 219,2 m; hody a minuty jsou medián kampaní skupiny pro tu čtvrť (rozdíl mezi dosažením hranic, `summarize` v run.mjs; minuty včetně 8 s UI na hod a 4 s karty čtvrti).

| Skupina | hody D1 / D2 / D3 / D4 | minuty D1 / D2 / D3 / D4 | celkem hody / minuty | dokončeno |
|---|---|---|---|---:|
| weak|balanced|auto|better | 34 / 22 / 23 / 22 | 13.8 / 12.3 / 13.3 / 13.0 | 102 / 53.3 | 100 % |
| weak|balanced|dive+sharp|better | 34 / 26 / 32 / 24 | 13.8 / 13.2 / 17.6 / 13.5 | 116 / 58.9 | 100 % |
| weak|balanced|calm+cushion|better | 34 / 25 / 26 / 22 | 13.8 / 13.1 / 14.3 / 12.5 | 109 / 55.0 | 100 % |
| weak|paper-first|auto|better | 58 / 25 / 34 / 20 | 21.7 / 12.6 / 18.1 / 10.8 | 140 / 63.6 | 100 % |
| weak|paper-first|dive+sharp|better | 58 / 27 / 38 / 21 | 21.7 / 13.4 / 19.4 / 11.3 | 144 / 65.8 | 100 % |
| weak|paper-first|calm+cushion|better | 58 / 25 / 37 / 21 | 21.7 / 12.6 / 19.3 / 11.2 | 143 / 65.4 | 100 % |
| average|balanced|auto|better | 28 / 21 / 19 / 17 | 12.0 / 11.3 / 11.6 / 10.5 | 86 / 45.8 | 100 % |
| average|balanced|dive+sharp|better | 28 / 22 / 25 / 19 | 12.0 / 12.0 / 14.5 / 11.1 | 95 / 50.2 | 100 % |
| average|balanced|calm+cushion|better | 28 / 21 / 22 / 18 | 12.0 / 11.3 / 12.8 / 10.5 | 90 / 46.7 | 100 % |
| average|paper-first|auto|better | 52 / 24 / 34 / 19 | 20.2 / 12.1 / 18.4 / 10.7 | 130 / 61.8 | 100 % |
| average|paper-first|dive+sharp|better | 52 / 26 / 36 / 20 | 20.2 / 13.3 / 19.0 / 10.7 | 134 / 63.4 | 100 % |
| average|paper-first|calm+cushion|better | 52 / 24 / 35 / 20 | 20.2 / 12.1 / 18.5 / 11.0 | 130 / 62.1 | 100 % |
| good|balanced|auto|better | 24 / 20 / 21 / 14 | 10.8 / 11.1 / 12.8 / 9.1 | 80 / 43.7 | 100 % |
| good|balanced|dive+sharp|better | 24 / 20 / 21 / 14 | 10.8 / 11.1 / 12.8 / 9.1 | 80 / 43.7 | 100 % |
| good|balanced|calm+cushion|better | 24 / 20 / 20 / 17 | 10.8 / 10.8 / 11.6 / 9.8 | 80 / 42.8 | 100 % |
| good|paper-first|auto|better | 46 / 24 / 36 / 19 | 18.7 / 12.4 / 19.1 / 10.2 | 125 / 60.8 | 100 % |
| good|paper-first|dive+sharp|better | 46 / 24 / 36 / 19 | 18.7 / 12.4 / 19.1 / 10.2 | 125 / 60.8 | 100 % |
| good|paper-first|calm+cushion|better | 46 / 23 / 35 / 18 | 18.7 / 11.6 / 18.6 / 10.2 | 121 / 58.7 | 100 % |
| expert|balanced|auto|better | 21 / 17 / 19 / 12 | 9.8 / 9.3 / 11.8 / 8.1 | 71 / 39.9 | 100 % |
| expert|balanced|dive+sharp|better | 21 / 17 / 19 / 12 | 9.8 / 9.3 / 11.8 / 8.1 | 71 / 39.9 | 100 % |
| expert|balanced|calm+cushion|better | 21 / 17 / 18 / 14 | 9.8 / 9.7 / 10.8 / 8.6 | 72 / 39.4 | 100 % |
| expert|paper-first|auto|better | 36 / 26 / 36 / 19 | 15.1 / 13.5 / 19.6 / 10.1 | 121 / 59.7 | 100 % |
| expert|paper-first|dive+sharp|better | 36 / 26 / 36 / 19 | 15.1 / 13.5 / 19.6 / 10.1 | 121 / 59.7 | 100 % |
| expert|paper-first|calm+cushion|better | 36 / 26 / 35 / 18 | 15.1 / 13.2 / 19.2 / 10.1 | 119 / 59.3 | 100 % |
| **průměr mediánů přes 24 skupin** | 37 / 23 / 29 / 18 | 15.3 / 12.0 / 16.0 / 10.4 | 107.3 / 53.6 | |

## F. Metodika, omezení a spuštění

**Spuštění:** `node simulation/hudba/timeline.mjs > vystup.md` (Markdown na stdout, na stderr čas běhu). Naměřeno ~12 s na tomto stroji (limit zadání 2 min). Skript nic nezapisuje do repa, jen čte `simulation/progression/out/mc-plna.json`. Dva běhy za sebou dávají bajt po bajtu stejný výstup (ověřeno `cmp`).

**Postup:**
1. 20 kampaní hráče `average` (strategie `balanced` a `paper-first` po 10, `auto` kapsy, model `better`, seed 1, id 0–9; tytéž kampaně jako prvních 10 v každé skupině mc-plna) se spustí funkcí `campaign()` z `simulation/progression/campaign.mjs`.
2. Z `R.flights` (čas hodů) a `R.buys` (nákupy) se zrekonstruuje vybavení v dané minutě (čas = skutečný čas letu + 8 s UI na hod + 4 s karta čtvrti, stejně jako v `campaign.mjs`); stádiu se dá medián po složkách (Power, Folds, Paper, kapsy, každý bonus Atlasu).
3. Pro každé stádium 200 letů (tabulka B ukazuje prvních 6): hod číslo `n` = medián hodu v dané minutě + j (seed hry = pořadí hodu, tutoriálové události jen pro hod 1), model střídavě Dart/Glider (v mc-plna hraje Glider ~52 % hodů), úhel = nejlepší pasivní úhel (`bestAngle`, hráč, který se z nápovědy naučil), síla a šum QTE profilu `average`, boti schopností podle kapes. Záznamník se napojí jako další bot před krokem fyziky, takže let se nezmění.
4. Časy jsou **čas letu** (fyzika po `DT = 1/60`); zrychlení klouzání se promítne jen do sloupce „skutečně“ u dopadu a do řádků „skutečný / letový čas“.

**Volba stádií (10., 45., 80. minuta):** v mc-plna (a ve 20 referenčních kampaních) končí kampaň průměrného hráče po 42–64 min (medián skupin 40–66 min). **80. minuta tedy v mc-plna nenastává**: všech 20 kampaní je v ní dohráno a pozdní stádium je výbava na konci kampaně (poslední hod). 45. minuta je u 4 z 20 kampaní po konci, jinak ve čtvrti D3 (hod 80–104). Pozdní a střední stádium se proto ve čtvrti, délce letu i počtu QTE téměř neliší (liší se druhem událostí: přibývá dron a páry). Pokud hra podle záměru trvá 90 min, vyšší minuty tomu v simulaci neodpovídají (viz `targets.totalMinutes` 82–98 v mc-plna; simulace je kratší).

**Co je a není změřeno:**
- Změřeno: časy varování, oken, středů, stisků bota, účinků, přechodů hranic čtvrtí a dopadu (rozlišení 1/60 s; čas přechodu hranice a stisku Dive/schopností se zapisuje při nejbližším kroku, tedy ≤ 1/60 s zpoždění).
- **Stisky jsou stisky bota profilu `average`** (šum časování 0,14 s, plán `planEvent` v `model.mjs`), ne lidského hráče; skutečné lidské časování je NOT ASSESSED (v repu není záznam hráčů).
- Vybavení je medián po složkách, ne vybavení jednoho skutečného hráče; kapsy se berou z `bots.pocketAuto.average` (Rocket, Calm), záložní kapsy `fallback` se neuvažují.
- Stádium „80. minuta“ je přesně konec kampaně (viz výše), nikoli mimo-kampaňový stav.
- Míření, výsledek a Dílna jako samostatné doby: NOT ASSESSED (simulátor má jen součet 8 s na hod, tato konstanta není změřená na lidech; ve hře existují jen zámky vstupu `LOCK_MS` 400 ms a práh hodu `HOLD_MIN_MS` 150 ms v `src/screens.js`, ne doby obrazovek).
- Neměřeny: Dive (bot hráče `average` ho nemá v kapse; držení ať se u profilů `good`/`expert` doměří zvlášť), QTE tutoriálové události hodu č. 1, nové kousky (Tricks).
- Hudební zvuky (stisk, zásah) ani audio smyčka nejsou součástí měření.
