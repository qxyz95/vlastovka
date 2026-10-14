> **ZASTARALÉ (15. 10. 2026):** celý report (pravidla 0.4.0, `qte-balance.mjs`); QTE se přepracovává podle `research/plan-hratelnost/01-game-design.md` a `research/bonusy/06-rozhodnuti.md` (15. 10.). Skript, který ho zapisuje, se nespouští. Nečíst jako zadání.

# Párové lety — živé město

Pravidla 0.4.0. 1 000 seedů pro každý model, úroveň 0/2/5 a variantu pomoci. 18 000 párů; stejná konfigurace a seed v obou letech. Standardní úhel a rychlost konstrukce; dovednost úvodního hodu není v tomto měření měněna. Úspěšnost QTE 60 %, z úspěchů 25 % perfektních. Test jedné události ignoruje vstupy druhého typu, plánovač zůstává stejný.

Souhrnný medián obou typů: **20.25 %**. Cíl 20–40 % je posuzován pro rovnoměrně zastoupenou sadu šesti konstrukcí, ne jako garance každého letu.

| Model | Úrovně všech větví | Pomoc | P10 % | Medián % | P90 % |
|---|---:|---|---:|---:|---:|
| dart | 0 | both | 0 | 15.13 | 54.28 |
| dart | 0 | gust | 0 | 0 | 16.37 |
| dart | 0 | bird | 0 | 0 | 27.77 |
| dart | 2 | both | 0 | 19.74 | 46.73 |
| dart | 2 | gust | 0 | 3.51 | 25.14 |
| dart | 2 | bird | 0 | 4.01 | 39.07 |
| dart | 5 | both | -9.05 | 17.13 | 60.51 |
| dart | 5 | gust | 0 | 21.11 | 57.79 |
| dart | 5 | bird | -25.01 | 0 | 20.96 |
| glider | 0 | both | 0 | 21 | 53.68 |
| glider | 0 | gust | 0 | 1.55 | 26.73 |
| glider | 0 | bird | 0 | 9.74 | 32.73 |
| glider | 2 | both | -6.94 | 25.44 | 70.62 |
| glider | 2 | gust | 0 | 11.46 | 44.12 |
| glider | 2 | bird | -10.38 | 0 | 25.01 |
| glider | 5 | both | -7.81 | 31.9 | 191.26 |
| glider | 5 | gust | 0 | 21.62 | 50.5 |
| glider | 5 | bird | -11.55 | 0 | 32.99 |

Výrazné rozdíly v horním decilu jsou nelineární odezva fyziky na impuls a nesení. Nejde o důkaz zábavnosti ani potvrzení tempa celého průchodu. Skutečný telefon a hráčské hodnocení zůstávají neověřené.

Poznámka k záporným hodnotám: úspěšné nesení nastaví podle schváleného plánu vy na +0,4 m/s. Při stoupání může tímto odebrat vertikální rychlost a zkrátit dolet. Neúspěch ani nečinnost nemají tento účinek; jejich shodu s pasivním letem ověřuje unit test. Nejde o skrytý postih za chybu, ale o omezení navrženého bonusu.
