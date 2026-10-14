# Simulátor progrese: výsledky fáze F5 (ladění po změnách pravidel ze 14. 10.)

**14. 10. 2026.** Výsledky sady F5 (výchozí `params.mjs`, snímek `out/f5-params.json`) proti cílům `08` §10.2 se změnami měření podle `06` (Paper Crane, Shooting Star a Packing Tape vlastní metriky, sucho = P90 maxim kampaní) a citlivost §10.3. Mechaniky jsou podle rozhodnutí 14. 10. (papír na 3. místě čtvrti, perfekt termiky, strop střemhlavu, užší okno po Whistle). Postup, tabulka změn čísel proti F3 a návrhy k rozhodnutí uživatele jsou v `research/bonusy/12-ladeni2.md`. Sada F3 je v `out/params-f3.json`, výchozí stav po změnách pravidel s čísly F3 v `out/f5-start-*`. Výsledky F3 jsou na konci souboru jako historie. Tabulky generuje skript z `out/f5-*.json`.

## Běhy
| Soubor (`out/`) | Co | Kampaní |
|---|---|---:|
| `f5-start-skills`, `f5-start-x2` | výchozí stav: pravidla 14. 10. + čísla F3 | 2 × 4 800 |
| `f5-base-skills` | 6 profilů × realistic / balanced / paper-first / atlas-first, SKILLS, + sondy (křivka, speciály, Atlas, hvězda) po 200 letech | 4 800 |
| `f5-base-x2` | totéž, sada „šum ×2“ | 4 800 |
| `f5-pockets-skills`, `f5-pockets-x2` | matice kapes: 4 profily × 7 voleb, realistic | 2 × 2 800 |
| `f5-base-lapse` | informativní sada „výpadek pozornosti“, 4 profily × 3 strategie | 1 200 |
| `f5-seed2-skills` | průměrný, druhý seed (stabilita mediánů) | 200 |
| `f5-sens-skills`, `f5-sens-x2` | citlivost §10.3, přepínače 14. 10. a model nákupčího, průměrný a slabý | 2 × 3 360 |

Reprodukce: `node simulation/progression/run.mjs --profiles weak,average,good,expert,weakAssist,auto --strategies realistic,balanced,paper-first,atlas-first --n 200 --probe-n 200 --out f5-base-skills` (pro „šum ×2“ přidat `--profileset x2`; matice kapes `--profiles weak,average,good,expert --strategies realistic --pockets none,cushion,sharp,dive,calm,whistle,rocket --n 100 --no-probes`; citlivost `--profiles weak,average --strategies realistic --n 80 --no-probes --sensitivity`). Výsledky jsou deterministické podle seedu. Pozn.: `f5-sens-*`, `f5-seed2-skills` doběhly s `dive.accel 2,4` (před poslední změnou), týká se to jen Dive, který průměrný ani slabý hráč v kampani nenosí.

**Referenční hráč:** profily `SKILLS` (základ) a povinná sada „šum ×2“ (šum časování QTE ×2). Nákup: realistický nákupčí (náhled U1 s chybou odhadu σ 0,5, trpělivost 6 hodů, papír s váhou 1,25). Optimální nákupčí (`balanced`) je pro srovnání ve sloupci „optimální nákup“.

## Hlavní výsledky
- **Délka hry:** průměrný 96 hodů / 52 min (SKILLS) a 113 / 60 min („šum ×2“), všechny čtvrti v pásmu 20–30 hodů a v minutových pásmech (SKILLS 30 / 23 / 20 / 23, „šum ×2“ 34 / 27 / 25 / 28). Slabý 111 / 60 a 134 / 70, expert 72 / 40 a 78 / 44. Všechny kampaně došly do cíle, nejdelší za 169 hodů (limit 250).
- **Let:** medián v D4 29,3 / 28,0 s, P90 všech letů 32,5 / 31,4 s, nejdelší let 59,1 / 56,8 s.
- **Šikovnost:** slabý / průměrný 1,16 / 1,19, expert / průměrný 0,75 / 0,69, expert / slabý 0,65 / 0,58.
- **Strategie:** „Paper napřed“ je pomalejší o 0–48 % (na startu F5 o 15–67 %), „Atlas napřed“ pomalejší o 4–20 %. Optimální nákup je rychlejší o 6–16 %.
- **Kapsy:** nejlepší a druhá volba se liší o 0–2 %. Nejlepší jsou Sharp Edge (4×), Dive, Paper Rocket, Calm Sky a Whistle (po 1×), Cushion nikde.
- **Nesplněno:** sucho P90, pára, Ad Drone a Pinwheel pod 3 %, Packing Tape u slabého SKILLS, ve „šum ×2“ Crowd Chain, Gull Escort (hrana), poměry experta, mezi místy P90, první kapsa a koupené úrovně, v SKILLS vysoké vybrání Dive (−2,3 %). Rozbor a návrhy v `12-ladeni2.md` §5.

## Tabulky

### Křivka: dolet a délka letu podle výbavy (styl 08 §2.4), SKILLS

200 letů na buňku, hod č. 20 (plující střed i švih zapnuté), úhel = nejlepší pasivní + chyba profilu, bez kapes. „Skutečný“ = se zrychlením klouzání 1,4×.

| Výbava | π | slabý | průměrný | dobrý | expert | let průměrný sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1,0 | 182 | 224 | 259 | 287 | 14,9 / 13,9 | 15 |
| po Power 1 | 1,0 | 219 | 273 | 313 | 345 | 17,6 / 16,4 | 16 |
| po Paper 1 | 1,6 | 295 | 362 | 419 | 464 | 14,9 / 13,9 | 24 |
| střed D1 | 1,6 | 478 | 566 | 631 | 683 | 20,6 / 18,9 | 28 |
| konec D1 | 2,9 | 1263 | 1372 | 1436 | 1493 | 24,3 / 22,4 | 57 |
| konec D2 | 4,2 | 2049 | 2217 | 2325 | 2418 | 26,8 / 24,4 | 85 |
| konec D3 | 6,3 | 3475 | 3811 | 4047 | 4215 | 26,6 / 24,4 | 145 |
| střed D4 | 7,2 | 4446 | 4942 | 5342 | 5625 | 29,3 / 27,4 | 168 |
| plná výbava | 8,9 | 5735 | 6467 | 6998 | 7397 | 29,2 / 27,0 | 221 |
| plná bez Atlasu | 8,9 | 3821 | 4151 | 4340 | 4496 | 25,5 / 23,2 | 166 |
| plná, kluzák | 8,9 | 6473 | 7145 | 7658 | 8093 | 34,1 / 31,3 | 206 |

### Křivka: dolet a délka letu podle výbavy (styl 08 §2.4), „šum ×2“

200 letů na buňku, hod č. 20 (plující střed i švih zapnuté), úhel = nejlepší pasivní + chyba profilu, bez kapes. „Skutečný“ = se zrychlením klouzání 1,4×.

| Výbava | π | slabý | průměrný | dobrý | expert | let průměrný sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1,0 | 167 | 206 | 243 | 278 | 14,0 / 13,2 | 14 |
| po Power 1 | 1,0 | 200 | 250 | 293 | 335 | 16,4 / 15,5 | 15 |
| po Paper 1 | 1,6 | 271 | 334 | 393 | 451 | 14,0 / 13,2 | 23 |
| střed D1 | 1,6 | 430 | 525 | 602 | 669 | 19,5 / 17,9 | 27 |
| konec D1 | 2,9 | 1161 | 1294 | 1392 | 1480 | 23,7 / 21,7 | 55 |
| konec D2 | 4,2 | 1912 | 2101 | 2242 | 2389 | 25,9 / 23,6 | 82 |
| konec D3 | 6,3 | 3150 | 3523 | 3831 | 4150 | 26,0 / 24,0 | 136 |
| střed D4 | 7,2 | 4008 | 4536 | 4950 | 5481 | 28,5 / 26,1 | 159 |
| plná výbava | 8,9 | 5106 | 5846 | 6444 | 7179 | 28,5 / 25,9 | 207 |
| plná bez Atlasu | 8,9 | 3460 | 3916 | 4198 | 4459 | 24,4 / 22,4 | 162 |
| plná, kluzák | 8,9 | 5701 | 6408 | 7074 | 7798 | 33,5 / 30,4 | 189 |

### Hody a minuty na čtvrť (styl 08 §2.6), SKILLS

Realistický nákup, kapsy podle profilu, 200 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 36 / 15,6 | 22 / 12,2 | 28 / 16,4 | 25 / 15,2 | **111 / 59,6 min** (127 / 151) | 140 / 63,8 | 124 / 66,4 | 102 / 53,4 |
| průměrný | 30 / 13,3 | 23 / 12,1 | 20 / 12,8 | 23 / 14,3 | **96 / 52,0 min** (109 / 119) | 130 / 61,5 | 109 / 59,8 | 86 / 45,9 |
| dobrý | 25 / 11,6 | 23 / 12,5 | 19 / 11,4 | 15 / 9,8 | **82 / 45,2 min** (95 / 119) | 122 / 59,9 | 93 / 50,9 | 78 / 42,4 |
| expert | 22 / 10,3 | 19 / 10,4 | 17 / 10,6 | 13 / 8,6 | **72 / 40,1 min** (80 / 93) | 120 / 59,2 | 85 / 48,1 | 67 / 37,0 |
| slabý + asistence (DQ-13) | 33 / 16,2 | 19 / 12,2 | 23 / 15,7 | 23 / 16,4 | **96 / 58,8 min** (111 / 131) | 137 / 72,0 | 111 / 68,0 | 87 / 51,8 |
| automatické QTE (DQ-14) | 36 / 15,2 | 27 / 13,8 | 29 / 17,0 | 33 / 19,8 | **125 / 66,1 min** (137 / 149) | 142 / 65,9 | 135 / 71,6 | 108 / 55,5 |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 17,5 / 25,6 / 27,4 / 27,9 | 32,0 / 48,2 | 91 % | 2 / 14 (8) | 8 / 15 | 39 | 89 % | 60 % | 13 % | – |
| průměrný | 18,4 / 23,6 / 28,3 / 29,3 | 32,5 / 45,4 | 97 % | 2 / 11 (7) | 7 / 13 | 38 | 85 % | 55 % | 17 % | – |
| dobrý | 19,1 / 23,7 / 27,5 / 30,1 | 33,4 / 59,1 | 92 % | 2 / 11 (5) | 6 / 12 | 35 | 78 % | 48 % | 13 % | 0 % |
| expert | 19,7 / 25,1 / 28,5 / 31,7 | 34,9 / 53,8 | 93 % | 1 / 8 (4) | 5 / 11 | 33 | 74 % | 46 % | 15 % | 0 % |
| slabý + asistence (DQ-13) | 21,3 / 30,2 / 33,0 / 34,4 | 38,1 / 56,1 | 98 % | 2 / 11 (6) | 7 / 13 | 36 | 85 % | 62 % | 21 % | – |
| automatické QTE (DQ-14) | 17,5 / 23,0 / 26,9 / 27,7 | 31,2 / 44,5 | 100 % | 2 / 14 (10) | 9 / 18 | 42 | 91 % | 61 % | 6 % | – |

### Hody a minuty na čtvrť (styl 08 §2.6), „šum ×2“

Realistický nákup, kapsy podle profilu, 200 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 42 / 17,4 | 28 / 15,5 | 30 / 17,2 | 32 / 18,5 | **134 / 70,2 min** (149 / 169) | 149 / 67,6 | 140 / 73,0 | 121 / 61,0 |
| průměrný | 34 / 14,8 | 27 / 13,9 | 25 / 14,9 | 28 / 16,4 | **113 / 60,3 min** (131 / 170) | 139 / 65,3 | 121 / 64,8 | 102 / 53,2 |
| dobrý | 28 / 12,6 | 27 / 14,2 | 25 / 14,0 | 21 / 12,8 | **98 / 52,8 min** (117 / 132) | 128 / 61,8 | 107 / 58,2 | 90 / 47,8 |
| expert | 23 / 10,7 | 21 / 11,7 | 18 / 11,0 | 15 / 9,5 | **78 / 44,1 min** (92 / 100) | 123 / 60,4 | 90 / 51,3 | 74 / 40,7 |
| slabý + asistence (DQ-13) | 36 / 17,5 | 22 / 13,8 | 25 / 17,3 | 27 / 19,0 | **111 / 68,3 min** (129 / 162) | 142 / 73,7 | 120 / 72,8 | 99 / 57,6 |
| automatické QTE (DQ-14) | 36 / 15,2 | 27 / 13,8 | 29 / 17,0 | 32 / 19,2 | **124 / 66,4 min** (137 / 149) | 142 / 65,9 | 135 / 71,8 | 108 / 55,4 |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 16,7 / 25,1 / 26,8 / 26,9 | 30,8 / 48,0 | 70 % | 2 / 14 (11) | 10 / 18 | 44 | 91 % | 60 % | 5 % | – |
| průměrný | 17,8 / 23,3 / 27,5 / 28,0 | 31,4 / 46,4 | 84 % | 2 / 14 (9) | 8 / 15 | 42 | 89 % | 55 % | 10 % | – |
| dobrý | 18,7 / 23,5 / 25,9 / 28,2 | 31,7 / 51,1 | 87 % | 2 / 13 (8) | 7 / 16 | 39 | 85 % | 50 % | 8 % | 3 % |
| expert | 19,6 / 24,6 / 28,2 / 30,6 | 34,2 / 55,5 | 92 % | 1 / 10 (5) | 6 / 12 | 34 | 76 % | 46 % | 13 % | 0 % |
| slabý + asistence (DQ-13) | 20,9 / 30,0 / 32,5 / 33,3 | 37,8 / 56,8 | 89 % | 2 / 13 (8) | 8 / 15 | 39 | 87 % | 61 % | 14 % | – |
| automatické QTE (DQ-14) | 17,5 / 23,1 / 26,8 / 27,7 | 31,2 / 45,4 | 100 % | 2 / 14 (10) | 8 / 18 | 43 | 91 % | 61 % | 6 % | – |

### Hody a minuty na čtvrť (styl 08 §2.6), výpadek pozornosti (informativně)

Realistický nákup, kapsy podle profilu, 100 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 38 / 15,8 | 25 / 13,9 | 28 / 16,7 | 28 / 16,7 | **120 / 64,0 min** (134 / 145) | 145 / 66,4 | 129 / 68,5 | – |
| průměrný | 30 / 13,6 | 25 / 13,2 | 21 / 12,7 | 25 / 15,7 | **99 / 54,3 min** (113 / 136) | 133 / 63,1 | 111 / 60,1 | – |
| dobrý | 26 / 11,9 | 25 / 13,0 | 20 / 11,8 | 16 / 10,3 | **86 / 46,9 min** (98 / 119) | 123 / 59,0 | 95 / 52,0 | – |
| expert | 22 / 10,4 | 19 / 11,0 | 17 / 10,1 | 13 / 8,9 | **73 / 40,7 min** (82 / 90) | 121 / 60,2 | 85 / 48,4 | – |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 17,4 / 25,4 / 27,2 / 27,4 | 31,5 / 47,1 | 80 % | 2 / 13 (10) | 9 / 16 | 40 | 89 % | 61 % | 9 % | – |
| průměrný | 18,3 / 23,6 / 28,1 / 28,9 | 32,1 / 47,0 | 90 % | 2 / 11 (7) | 7 / 13 | 40 | 85 % | 55 % | 14 % | – |
| dobrý | 18,9 / 23,9 / 26,9 / 29,7 | 32,5 / 52,1 | 88 % | 2 / 10 (6) | 6 / 13 | 36 | 80 % | 46 % | 12 % | 0 % |
| expert | 19,7 / 25,2 / 28,2 / 31,1 | 34,7 / 49,6 | 92 % | 1 / 8 (4) | 5 / 11 | 36 | 74 % | 47 % | 15 % | 0 % |

**Stabilita:** druhý seed (200 kampaní, průměrný SKILLS): 30 / 22 / 22 / 20 hodů, celkem 94 / 50,7 min (P90 105), proti prvnímu seedu 30 / 23 / 20 / 23, 96 / 52,0 min.

### Kapsy (matice B22): minuty do cíle podle speciálu v 1. kapse

Realistický nákup, 100 kampaní na buňku. Do 2. kapsy jde záložní Cushion / Sharp Edge jen při kladném náhledu. Tučně nejlepší.

**SKILLS**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 65,0 | 64,8 | 59,8 | **59,0 (3 %)** | 61,4 | 59,6 | 59,1 |
| průměrný | 56,6 | 54,7 | **50,5** | 51,3 (1 %) | 52,5 | 50,9 | 53,1 |
| dobrý | 51,3 | 48,6 | **43,9** | 45,2 (0 %) | 47,5 | 44,7 | 47,5 |
| expert | 46,0 | 44,2 | **38,2** | 40,3 (0 %) | 42,8 | 38,3 | 41,8 |

**„šum ×2“**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 75,0 | 74,1 | 70,8 | 71,1 (9 %) | 71,1 | 73,7 | **69,6** |
| průměrný | 65,8 | 63,7 | 61,7 | 61,4 (6 %) | **59,9** | 60,1 | 60,6 |
| dobrý | 55,9 | 55,0 | **50,6** | 52,8 (2 %) | 53,1 | 51,1 | 52,8 |
| expert | 48,5 | 47,8 | 42,6 | 45,2 (0 %) | 46,2 | **42,2** | 44,7 |

### Speciály na výbavě „konec D3“ (zisk doletu, SKILLS)

| Profil | Cushion | Sharp | Calm | Dive (pády) | Whistle | Rocket | Dive vysoké vybrání |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 4,6 % | 3,6 % | 2,6 % | -5,2 % (6 %) | 7,1 % | 9,3 % | -2,1 % |
| průměrný | 5,2 % | 6,5 % | 4,0 % | -5,3 % (2 %) | 8,3 % | 8,6 % | -2,3 % |
| dobrý | 5,9 % | 8,4 % | 4,7 % | -3,9 % (0 %) | 9,4 % | 8,1 % | -2,9 % |
| expert | 6,1 % | 10,7 % | 5,1 % | -3,0 % (0 %) | 11,0 % | 7,9 % | -3,4 % |
| slabý + asistence (DQ-13) | 5,8 % | 8,0 % | 4,6 % | -2,1 % (3 %) | 9,6 % | 8,8 % | -0,1 % |
| automatické QTE (DQ-14) | 4,5 % | 7,4 % | 1,3 % | -2,9 % (7 %) | 4,3 % | 10,1 % | -0,9 % |

### Speciály na výbavě „konec D3“ (zisk doletu, „šum ×2“)

| Profil | Cushion | Sharp | Calm | Dive (pády) | Whistle | Rocket | Dive vysoké vybrání |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 3,3 % | 1,5 % | 1,5 % | -4,1 % (11 %) | 4,5 % | 10,4 % | -0,9 % |
| průměrný | 3,9 % | 3,3 % | 2,6 % | -7,0 % (11 %) | 5,9 % | 9,2 % | -1,6 % |
| dobrý | 4,7 % | 5,1 % | 2,6 % | -6,4 % (3 %) | 7,0 % | 8,4 % | -2,5 % |
| expert | 5,8 % | 7,7 % | 3,9 % | -5,4 % (0 %) | 9,1 % | 7,8 % | -3,9 % |
| slabý + asistence (DQ-13) | 4,3 % | 4,3 % | 2,5 % | -5,0 % (8 %) | 7,5 % | 9,2 % | -1,7 % |
| automatické QTE (DQ-14) | 3,0 % | 7,4 % | 1,3 % | -4,2 % (14 %) | 4,3 % | 10,1 % | -1,1 % |

### Atlas na úr. 3 (plná výbava s bonusem proti bez něj)

| Bonus | průměrný SKILLS | slabý SKILLS | průměrný „šum ×2“ | slabý „šum ×2“ |
|---|---:|---:|---:|---:|
| chain | 3,6 % | 3,2 % | 2,7 % | 1,2 % |
| pinwheel | 2,5 % | 2,7 % | 2,6 % | 2,6 % |
| steam | 0,4 % | 0,0 % | -0,0 % | -1,1 % |
| tape | 1,1 % | 1,9 % | 3,8 % | 7,6 % |
| crane | 3,6 % | 3,8 % | 4,1 % | 3,7 % |
| skip | 5,7 % (47 % letů) | 4,6 % (34 % letů) | 3,9 % (31 % letů) | 2,5 % (19 % letů) |
| gull | 3,3 % | 3,0 % | 3,0 % | 2,6 % |
| momentum | 5,5 % | 5,1 % | 6,0 % | 5,6 % |
| thermal | 3,4 % | 3,4 % | 4,5 % | 3,5 % |
| echo | 6,8 % | 4,4 % | 4,1 % | 2,1 % |
| star | 0,3 % (10 % letů) | 0,1 % (10 % letů) | 0,2 % (10 % letů) | -0,2 % (10 % letů) |
| drone | 0,8 % | -1,1 % | 0,2 % | -1,1 % |
| paperCrane | 0,0 % (12 % letů) | 0,0 % (4 % letů) | 0,0 % (7 % letů) | 0,0 % (8 % letů) |
| onAir | 5,3 % | 3,7 % | 3,8 % | 2,3 % |

## Cíle 08 §10.2 v obou sadách

Hodnoty pro průměrného hráče (realistický nákup), pokud není uvedeno jinak. Kapsy z matice B22.

| Metrika | Cíl | SKILLS | | „šum ×2“ | |
|---|---|---|---|---|---|
| Hody D1 (průměrný) | 25–35 | 30 | OK | 34 | OK |
| Hody D2 (průměrný) | 20–30 | 23 | OK | 27 | OK |
| Hody D3 (průměrný) | 20–30 | 20 | OK | 25 | OK |
| Hody D4 (průměrný) | 20–30 | 23 | OK | 28 | OK |
| Minuty D1 (průměrný) | 12–18 | 13.3 | OK | 14.8 | OK |
| Minuty D2 (průměrný) | 10–16 | 12.1 | OK | 13.9 | OK |
| Minuty D3 (průměrný) | 12–18 | 12.8 | OK | 14.9 | OK |
| Minuty D4 (průměrný) | 14–20 | 14.3 | OK | 16.4 | OK |
| Minuty celkem (průměrný) | 50–75 | 52.0 | OK | 60.3 | OK |
| Let medián D1 [s] | ≤ 22 | 18.4 | OK | 17.8 | OK |
| Let medián D2 [s] | ≤ 27 | 23.6 | OK | 23.3 | OK |
| Let medián D3 [s] | ≤ 30 | 28.3 | OK | 27.5 | OK |
| Let medián D4 [s] | ≤ 35 | 29.3 | OK | 28.0 | OK |
| Let P90 [s] | ≤ 45 | 32.5 | OK | 31.4 | OK |
| Sucho medián / P90 max kampaní | ≤ 4 / ≤ 8 | 2 / 9 (max 11, P90 9) | **FAIL** | 2 / 11 (max 14, P90 11) | **FAIL** |
| Mezi místy medián / P90 | ≤ 8 / ≤ 14 | 7 / 13 | OK | 8 / 15 | **FAIL** |
| Strop E zasažen (lety) | ≤ 20 % | 17 % | OK | 10 % | OK |
| Strop β zasažen (lety) | ≤ 25 % | 0 % | OK | 0 % | OK |
| Podíl kluzáku | 30 %–70 % | 55 % | OK | 55 % | OK |
| První kapsa (hod) | 20–40 | 38 | OK | 42 | **FAIL** |
| Koupené úrovně v cíli | 60 %–85 % | 85 % | OK | 89 % | **FAIL** |
| Žádný let > 60 s (skutečný) | ≤ 60 | 59.1 | OK | 56.8 | OK |
| Slabý: cíl do 250 hodů | 100 % | 100 % (max 151) | OK | 100 % (max 169) | OK |
| Slabý / průměrný (hody) | ≤ 1.4 | 1.16 | OK | 1.19 | OK |
| Expert / průměrný (hody) | ≥ 0.7 | 0.75 | OK | 0.69 | **FAIL** |
| Expert / slabý (hody) | 0.6–0.75 | 0.65 | OK | 0.58 | **FAIL** |
| Paper napřed rychlejší o (weak) | ≤ 10 % | -7 % | OK | 4 % | OK |
| Atlas napřed pomalejší o (weak) | ≤ 20 % | 11 % | OK | 4 % | OK |
| Paper napřed rychlejší o (average) | ≤ 10 % | -18 % | OK | -8 % | OK |
| Atlas napřed pomalejší o (average) | ≤ 20 % | 15 % | OK | 7 % | OK |
| Paper napřed rychlejší o (good) | ≤ 10 % | -33 % | OK | -17 % | OK |
| Atlas napřed pomalejší o (good) | ≤ 20 % | 13 % | OK | 10 % | OK |
| Paper napřed rychlejší o (expert) | ≤ 10 % | -48 % | OK | -37 % | OK |
| Atlas napřed pomalejší o (expert) | ≤ 20 % | 20 % | OK | 16 % | OK |
| Paper napřed rychlejší o (weakAssist) | ≤ 10 % | -22 % | OK | -8 % | OK |
| Atlas napřed pomalejší o (weakAssist) | ≤ 20 % | 16 % | OK | 7 % | OK |
| Paper napřed rychlejší o (auto) | ≤ 10 % | 0 % | OK | 1 % | OK |
| Atlas napřed pomalejší o (auto) | ≤ 20 % | 8 % | OK | 8 % | OK |
| Dive pády (weak) | ≤ 15 % | 6 % | OK | 11 % | OK |
| Dive vysoké vybrání (průměrný) | ±2 % | -2.3 % | **FAIL** | -1.6 % | OK |
| Dive pády (expert) | ≤ 3 % | 0 % | OK | 0 % | OK |
| Atlas chain na úr. 3 | 3 %–15 % | 3.6 % | OK | 2.7 % | **FAIL** |
| Atlas pinwheel na úr. 3 | 3 %–15 % | 2.5 % | **FAIL** | 2.6 % | **FAIL** |
| Atlas steam na úr. 3 | 3 %–15 % | 0.4 % | **FAIL** | -0.0 % | **FAIL** |
| Atlas crane na úr. 3 | 3 %–15 % | 3.6 % | OK | 4.1 % | OK |
| Atlas skip na úr. 3 | 3 %–15 % | 5.7 % (v 47 % letů) | OK | 3.9 % (v 31 % letů) | OK |
| Atlas gull na úr. 3 | 3 %–15 % | 3.3 % | OK | 3.0 % | **FAIL** |
| Atlas momentum na úr. 3 | 3 %–15 % | 5.5 % | OK | 6.0 % | OK |
| Atlas thermal na úr. 3 | 3 %–15 % | 3.4 % | OK | 4.5 % | OK |
| Atlas echo na úr. 3 | 3 %–15 % | 6.8 % | OK | 4.1 % | OK |
| Atlas drone na úr. 3 | 3 %–15 % | 0.8 % | **FAIL** | 0.2 % | **FAIL** |
| Atlas onAir na úr. 3 | 3 %–15 % | 5.3 % | OK | 3.8 % | OK |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | ≥ 3 % | 4.0 % (200 letů) | OK | 4.0 % (200 letů) | OK |
| Packing Tape úr. 3 (slabý, plná) | 3 %–15 % | 1.9 % | **FAIL** | 7.6 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 30 %–50 % | 47 % | OK | 31 % | OK |
| Kapsy weak: nejlepší dive vs. rocket | ≤ 8 % | 0 % | OK | 2 % | OK |
| Kapsy average: nejlepší sharp vs. whistle | ≤ 8 % | 1 % | OK | 0 % | OK |
| Kapsy good: nejlepší sharp vs. whistle | ≤ 8 % | 2 % | OK | 1 % | OK |
| Kapsy expert: nejlepší sharp vs. whistle | ≤ 8 % | 0 % | OK | 1 % | OK |
| Kapsy: nejlepší aspoň v jednom profilu | všechny | dive, sharp (nikde: rocket, whistle, calm, cushion) | **FAIL** | rocket, calm, sharp, whistle (nikde: dive, cushion) | **FAIL** |

Souhrn: SKILLS 53 OK / 7 FAIL, „šum ×2“ 48 OK / 12 FAIL.

## Citlivost (08 §10.3)

Realistický nákup, 80 kampaní na variantu a profil. Výchozí sada ve stejném běhu = řádek „zrychlení klouzání 1,4“.

**SKILLS**

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 109 / 60,3 | 32 / 27 / 26 / 23 | 32,6 / 45,3 | 129 / 70,0 (149) | 5792 / 26,3 |
| krok papíru ×1,1 | 84 / 45,8 | 28 / 18 / 15 / 22 | 32,4 / 45,5 | 96 / 51,1 (125) | 6931 / 26,2 |
| zrychlení klouzání 1,0 | 96 / 56,0 | 30 / 23 / 21 / 23 | 35,5 / 49,6 | 110 / 62,9 (135) | 6362 / 29,0 |
| zrychlení klouzání 1,4 | 96 / 52,1 | 30 / 23 / 21 / 23 | 32,7 / 45,4 | 110 / 58,8 (135) | 6362 / 26,3 |
| ceny ×0,8 | 76 / 41,3 | 24 / 19 / 18 / 15 | 32,4 / 46,6 | 89 / 47,7 (111) | 6362 / 26,3 |
| ceny ×1,25 | 119 / 64,8 | 38 / 27 / 26 / 27 | 32,6 / 47,7 | 142 / 76,0 (172) | 6362 / 26,3 |
| Shooting Star ×0,5 | 97 / 52,9 | 30 / 23 / 21 / 24 | 32,7 / 45,4 | 110 / 58,8 (135) | 6352 / 26,3 |
| Shooting Star ×2 | 95 / 51,6 | 30 / 23 / 20 / 23 | 32,7 / 45,4 | 110 / 59,2 (135) | 6391 / 26,7 |
| rozestup událostí ×0,8 | 87 / 48,1 | 28 / 19 / 17 / 22 | 34,1 / 45,5 | 103 / 55,9 (144) | 6693 / 27,8 |
| rozestup událostí ×1,25 | 105 / 56,6 | 31 / 24 / 25 / 24 | 31,5 / 47,2 | 120 / 64,4 (144) | 6024 / 25,4 |
| readNoise 0 | 94 / 51,2 | 29 / 23 / 23 / 20 | 32,7 / 47,3 | 111 / 59,1 (135) | 6408 / 26,3 |
| readNoise 0,4 | 97 / 52,7 | 30 / 23 / 25 / 22 | 32,3 / 43,2 | 113 / 60,9 (135) | 6279 / 26,3 |
| push sond (scaleWithPace=false) | 109 / 61,1 | 31 / 26 / 27 / 25 | 33,1 / 50,0 | 125 / 68,6 (148) | 5816 / 27,1 |
| nákupčí: trpělivost 3 | 104 / 56,9 | 32 / 23 / 21 / 29 | 32,9 / 49,2 | 115 / 62,2 (144) | 6362 / 26,3 |
| nákupčí: trpělivost 10 | 91 / 48,8 | 30 / 23 / 20 / 17 | 32,1 / 44,7 | 107 / 57,1 (134) | 6362 / 26,3 |
| nákupčí: chyba odhadu 0,25 | 94 / 51,3 | 29 / 22 / 22 / 23 | 32,5 / 45,6 | 110 / 58,5 (135) | 6362 / 26,3 |
| nákupčí: chyba odhadu 0,8 | 97 / 53,1 | 30 / 24 / 21 / 22 | 32,5 / 47,3 | 114 / 61,7 (135) | 6362 / 26,3 |
| nákupčí: bez preference papíru | 96 / 52,5 | 30 / 24 / 20 / 23 | 32,5 / 45,6 | 110 / 58,8 (135) | 6362 / 26,3 |
| papír na hranici čtvrti (openAtPlace 5) | 95 / 52,0 | 30 / 23 / 20 / 23 | 32,6 / 45,5 | 110 / 58,5 (135) | 6362 / 26,3 |
| termika bez perfektu (thermal.perfect 0) | 104 / 57,1 | 30 / 23 / 25 / 25 | 32,6 / 49,2 | 118 / 63,1 (141) | 6178 / 26,2 |
| Dive bez stropu (dive.maxSink null) | 96 / 52,1 | 30 / 23 / 21 / 23 | 32,7 / 45,4 | 110 / 58,8 (135) | 6362 / 26,3 |
| Whistle plné okno (whistle.window 1) | 96 / 52,1 | 30 / 23 / 21 / 23 | 32,7 / 45,4 | 110 / 58,8 (135) | 6362 / 26,3 |

**„šum ×2“**

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 129 / 69,4 | 36 / 34 / 28 / 33 | 31,7 / 47,0 | 151 / 79,7 (174) | 5185 / 26,1 |
| krok papíru ×1,1 | 96 / 51,2 | 31 / 22 / 22 / 22 | 31,2 / 44,0 | 119 / 61,9 (144) | 6217 / 26,1 |
| zrychlení klouzání 1,0 | 113 / 65,1 | 34 / 27 / 25 / 28 | 34,5 / 49,4 | 134 / 74,1 (164) | 5704 / 28,6 |
| zrychlení klouzání 1,4 | 113 / 60,8 | 34 / 27 / 25 / 28 | 31,5 / 46,4 | 134 / 69,2 (164) | 5704 / 26,1 |
| ceny ×0,8 | 88 / 46,4 | 27 / 22 / 20 / 18 | 31,4 / 45,1 | 107 / 56,6 (134) | 5704 / 26,1 |
| ceny ×1,25 | 142 / 75,5 | 42 / 33 / 32 / 36 | 31,6 / 46,9 | 168 / 87,3 (203) | 5704 / 26,1 |
| Shooting Star ×0,5 | 113 / 60,7 | 34 / 27 / 26 / 26 | 31,5 / 45,6 | 134 / 69,8 (164) | 5689 / 26,1 |
| Shooting Star ×2 | 110 / 59,7 | 34 / 27 / 25 / 26 | 31,6 / 46,4 | 136 / 70,9 (164) | 5725 / 26,2 |
| rozestup událostí ×0,8 | 104 / 56,5 | 32 / 24 / 23 / 25 | 32,7 / 47,6 | 127 / 67,0 (150) | 6001 / 26,8 |
| rozestup událostí ×1,25 | 118 / 62,4 | 35 / 28 / 27 / 30 | 30,6 / 42,4 | 143 / 73,4 (165) | 5440 / 25,2 |
| readNoise 0 | 110 / 59,2 | 33 / 27 / 26 / 27 | 31,7 / 49,4 | 133 / 69,3 (164) | 5758 / 26,2 |
| readNoise 0,4 | 111 / 59,5 | 35 / 27 / 26 / 25 | 31,3 / 45,3 | 136 / 70,6 (154) | 5610 / 25,9 |
| push sond (scaleWithPace=false) | 125 / 69,1 | 35 / 33 / 28 / 29 | 32,4 / 47,9 | 146 / 78,0 (171) | 5354 / 27,0 |
| nákupčí: trpělivost 3 | 119 / 63,5 | 36 / 28 / 24 / 30 | 31,7 / 49,7 | 137 / 71,9 (168) | 5704 / 26,1 |
| nákupčí: trpělivost 10 | 107 / 56,7 | 34 / 26 / 25 / 22 | 31,1 / 44,8 | 128 / 65,9 (145) | 5704 / 26,1 |
| nákupčí: chyba odhadu 0,25 | 110 / 59,0 | 33 / 25 / 26 / 27 | 31,4 / 45,6 | 135 / 70,8 (164) | 5704 / 26,1 |
| nákupčí: chyba odhadu 0,8 | 114 / 61,3 | 35 / 27 / 26 / 26 | 31,6 / 44,7 | 136 / 71,3 (164) | 5704 / 26,1 |
| nákupčí: bez preference papíru | 110 / 59,5 | 34 / 27 / 26 / 28 | 31,5 / 44,7 | 136 / 70,4 (164) | 5704 / 26,1 |
| papír na hranici čtvrti (openAtPlace 5) | 111 / 59,6 | 34 / 26 / 25 / 27 | 31,5 / 49,2 | 134 / 69,6 (164) | 5704 / 26,1 |
| termika bez perfektu (thermal.perfect 0) | 117 / 63,0 | 34 / 27 / 27 / 28 | 31,5 / 44,7 | 138 / 72,5 (151) | 5571 / 26,1 |
| Dive bez stropu (dive.maxSink null) | 113 / 60,8 | 34 / 27 / 25 / 28 | 31,5 / 46,4 | 134 / 69,2 (164) | 5704 / 26,1 |
| Whistle plné okno (whistle.window 1) | 113 / 60,8 | 34 / 27 / 25 / 28 | 31,5 / 46,4 | 134 / 69,2 (164) | 5704 / 26,1 |


## Poznámky k čtení
- **Shooting Star** (úr. 3, plná výbava, průměrný): v letech, kde hvězda v rozvrhu přišla, dává +4,0 % doletu v obou sadách (cíl ≥ 3 %). Průměr přes všechny lety je 0,2–0,3 %.
- **Paper Crane** (úr. 3, plná výbava): tah v 12 % (SKILLS) a 7 % („šum ×2“) letů. V kampani tahá v ~1 % letů, jen hlášení.
- **Dive se škáluje s výbavou:** na výbavě „konec D3“ je ztrátový (−2 až −7 %), na plné výbavě experta přidává +10 až +19 % doletu a 2–3 s letu. Proto je v kampani srovnatelný s ostatními kapsami, i když sonda na „konec D3“ vychází záporně. Viz `12-ladeni2.md` §5.5.
- **Strop E** se v kampani zasáhne v 10–17 % letů průměrného hráče (cíl ≤ 20 %), strop β nikdy.


---

## Historie: výsledky fáze F3 (13. 10. 2026)

*Platí pro sadu F3 (`out/params-f3.json`) a mechaniky před rozhodnutím 14. 10. Pro F5 už neplatí, ponecháno pro srovnání.*

**13. 10. 2026.** Finální výsledky doladěné sady (výchozí `params.mjs`) proti cílům `08` §10.2 a citlivost §10.3. Postup, změny čísel proti 08, výklad oprav 1–5 a návrhy k rozhodnutí uživatele jsou v `research/bonusy/10-ladeni.md`. Původní parametry 08 jsou v `out/params-08.json`. Tento soubor generuje skript z `out/f3-*.json`.

### Běhy
| Soubor (`out/`) | Co | Kampaní |
|---|---|---:|
| `f3-base-skills` | 6 profilů × realistic / balanced / paper-first / atlas-first, SKILLS, + sondy (křivka, speciály, Atlas) po 200 letech | 4 800 |
| `f3-base-x2` | totéž, sada „šum ×2“ | 4 800 |
| `f3-pockets-skills`, `f3-pockets-x2` | matice kapes: 4 profily × 7 voleb, realistic | 2 × 4 200 |
| `f3-base-lapse` | informativní sada „výpadek pozornosti“, 4 profily × 3 strategie | 1 800 |
| `f3-seed2-skills` | průměrný, druhý seed (stabilita mediánů) | 200 |
| `f3-sens-skills`, `f3-sens-x2` | citlivost §10.3 + model nákupčího, průměrný a slabý | 2 × 3 600 |

Reprodukce: `node simulation/progression/run.mjs --profiles weak,average,good,expert,weakAssist,auto --strategies realistic,balanced,paper-first,atlas-first --n 200 --probe-n 200 --out f3-base-skills` (pro „šum ×2“ přidat `--profileset x2`; matice kapes `--strategies realistic --pockets none,cushion,sharp,dive,calm,whistle,rocket --n 150 --no-probes`; citlivost `--profiles weak,average --strategies realistic --n 100 --no-probes --sensitivity`). Výsledky jsou deterministické podle seedu.

**Referenční hráč:** profily `SKILLS` (základ) a povinná sada „šum ×2“ (šum časování QTE ×2, zásah průměrného 82 % místo 97 %). Nákup: realistický nákupčí (náhled U1 s chybou odhadu σ 0,5, trpělivost 6 hodů, papír s váhou 1,25). Optimální nákupčí (`balanced`) je pro srovnání ve sloupci „optimální nákup“.

### Hlavní výsledky
- **Délka hry:** průměrný 98 hodů / 53 min (SKILLS) a 118 / 62 min („šum ×2“). Cíl 08 byl ~113 hodů a 50–75 min, F2 začínal na 58 hodech / 31 min. Slabý 115 / 62 a 140 / 72, expert 75 / 41 a 84 / 46. Všech ~19 800 kampaní finálních běhů došlo do cíle, nejdelší za 207 hodů (limit 250).
- **Let:** medián v D4 28,5 / 27,6 s, P90 všech letů 31,6 / 30,6 s. Poslední hody tedy trvají ~28–30 s, jak chce 06.
- **Šikovnost:** slabý / průměrný 1,17 / 1,19, expert / průměrný 0,77 / 0,71, expert / slabý 0,65 / 0,60.
- **Strategie:** „Paper napřed“ je proti realistickému nákupu nanejvýš o 9 % rychlejší (u lepších hráčů pomalejší), „Atlas napřed“ je pomalejší o 5–23 %. Optimální nákup je rychlejší o 7–17 %.
- **Kapsy:** nejlepší a druhá volba se liší o 0–7 % (cíl ≤ 8 %). Nejlepší je Whistle (6 z 8), u slabého Sharp Edge a Paper Rocket.
- **Nesplněno:** rozložení D2 / D3 (D3 krátká), sucho max, část bonusů Atlasu < 3 %, pády Dive ve „šum ×2“, „každý speciál nejlepší aspoň jednou“, „Atlas napřed“ u experta SKILLS a několik okrajových hodnot. Rozbor a návrhy jsou v `10-ladeni.md` §5.

### Tabulky

#### Křivka: dolet a délka letu podle výbavy (styl 08 §2.4), SKILLS

200 letů na buňku, hod č. 20 (plující střed i švih zapnuté), úhel = nejlepší pasivní + chyba profilu, bez kapes. „Skutečný“ = se zrychlením klouzání 1,4×.

| Výbava | π | slabý | průměrný | dobrý | expert | let průměrný sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1,0 | 182 | 224 | 259 | 287 | 14,9 / 13,9 | 15 |
| po Power 1 | 1,0 | 219 | 273 | 313 | 345 | 17,6 / 16,4 | 16 |
| po Paper 1 | 1,6 | 295 | 362 | 419 | 464 | 14,9 / 13,9 | 24 |
| střed D1 | 1,6 | 475 | 565 | 630 | 682 | 20,6 / 18,9 | 28 |
| konec D1 | 2,9 | 1253 | 1366 | 1433 | 1492 | 24,4 / 22,4 | 57 |
| konec D2 | 5,0 | 2396 | 2598 | 2732 | 2847 | 26,6 / 24,4 | 99 |
| konec D3 | 6,9 | 3732 | 4112 | 4381 | 4576 | 26,4 / 24,1 | 157 |
| střed D4 | 7,6 | 4663 | 5218 | 5653 | 5976 | 29,5 / 27,7 | 178 |
| plná výbava | 8,9 | 5722 | 6440 | 7045 | 7394 | 29,6 / 27,0 | 220 |
| plná bez Atlasu | 8,9 | 3794 | 4130 | 4331 | 4494 | 25,4 / 23,1 | 165 |
| plná, kluzák | 8,9 | 6391 | 7129 | 7727 | 8160 | 34,3 / 31,1 | 204 |

#### Křivka: dolet a délka letu podle výbavy (styl 08 §2.4), „šum ×2“

200 letů na buňku, hod č. 20 (plující střed i švih zapnuté), úhel = nejlepší pasivní + chyba profilu, bez kapes. „Skutečný“ = se zrychlením klouzání 1,4×.

| Výbava | π | slabý | průměrný | dobrý | expert | let průměrný sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1,0 | 167 | 206 | 243 | 278 | 14,0 / 13,2 | 14 |
| po Power 1 | 1,0 | 200 | 250 | 293 | 335 | 16,4 / 15,5 | 15 |
| po Paper 1 | 1,6 | 271 | 334 | 393 | 451 | 14,0 / 13,2 | 23 |
| střed D1 | 1,6 | 429 | 523 | 600 | 668 | 19,4 / 17,9 | 27 |
| konec D1 | 2,9 | 1151 | 1284 | 1385 | 1475 | 23,6 / 21,6 | 55 |
| konec D2 | 5,0 | 2231 | 2450 | 2632 | 2800 | 25,6 / 23,4 | 96 |
| konec D3 | 6,9 | 3423 | 3813 | 4149 | 4486 | 25,8 / 23,7 | 149 |
| střed D4 | 7,6 | 4184 | 4763 | 5225 | 5802 | 28,2 / 25,8 | 169 |
| plná výbava | 8,9 | 5030 | 5839 | 6415 | 7166 | 28,2 / 25,8 | 206 |
| plná bez Atlasu | 8,9 | 3430 | 3880 | 4177 | 4444 | 24,3 / 22,3 | 162 |
| plná, kluzák | 8,9 | 5572 | 6376 | 7038 | 7872 | 33,2 / 30,0 | 188 |

#### Hody a minuty na čtvrť (styl 08 §2.6), SKILLS

Realistický nákup, kapsy podle profilu, 200 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 36 / 15,6 | 29 / 16,5 | 21 / 12,0 | 30 / 17,6 | **115 / 61,5 min** (133 / 163) | 126 / 60,4 | 128 / 68,1 | 104 / 53,5 |
| průměrný | 30 / 13,4 | 30 / 15,9 | 16 / 9,9 | 22 / 13,9 | **98 / 52,8 min** (111 / 139) | 116 / 57,5 | 114 / 61,6 | 89 / 46,7 |
| dobrý | 26 / 11,8 | 31 / 16,6 | 18 / 10,2 | 13 / 7,9 | **88 / 46,7 min** (101 / 129) | 108 / 55,2 | 103 / 55,4 | 82 / 43,6 |
| expert | 22 / 10,3 | 25 / 13,9 | 17 / 10,2 | 11 / 6,6 | **75 / 41,1 min** (85 / 92) | 101 / 52,8 | 92 / 50,6 | 70 / 38,3 |
| slabý + asistence (DQ-13) | 33 / 16,2 | 25 / 16,2 | 19 / 13,2 | 20 / 14,0 | **96 / 59,0 min** (111 / 133) | 117 / 64,3 | 115 / 70,9 | 89 / 52,5 |
| automatické QTE (DQ-14) | 35 / 15,2 | 36 / 18,3 | 21 / 11,9 | 32 / 18,9 | **123 / 64,0 min** (135 / 151) | 125 / 60,8 | 135 / 70,0 | 105 / 53,1 |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 17,4 / 25,9 / 27,1 / 27,5 | 31,3 / 44,9 | 89 % | 2 / 12 (8) | 8 / 15 | 37 | 85 % | 60 % | 6 % | – |
| průměrný | 18,4 / 23,5 / 27,7 / 28,5 | 31,6 / 46,9 | 97 % | 2 / 11 (7) | 7 / 13 | 37 | 80 % | 53 % | 7 % | – |
| dobrý | 19,1 / 23,8 / 25,1 / 27,6 | 30,8 / 53,7 | 90 % | 2 / 11 (6) | 6 / 14 | 32 | 76 % | 40 % | 3 % | 2 % |
| expert | 19,7 / 24,8 / 26,9 / 29,9 | 31,8 / 53,6 | 91 % | 2 / 8 (6) | 6 / 12 | 30 | 70 % | 38 % | 4 % | 0 % |
| slabý + asistence (DQ-13) | 21,3 / 30,8 / 32,6 / 33,5 | 37,5 / 59,1 | 98 % | 2 / 11 (6) | 7 / 13 | 35 | 80 % | 63 % | 10 % | – |
| automatické QTE (DQ-14) | 17,5 / 22,7 / 26,7 / 27,5 | 30,6 / 45,3 | 100 % | 2 / 12 (9) | 9 / 17 | 40 | 87 % | 59 % | 2 % | – |

#### Hody a minuty na čtvrť (styl 08 §2.6), „šum ×2“

Realistický nákup, kapsy podle profilu, 200 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 42 / 17,4 | 36 / 19,6 | 26 / 15,1 | 34 / 19,6 | **140 / 72,3 min** (155 / 184) | 138 / 65,8 | 146 / 75,7 | 125 / 62,9 |
| průměrný | 34 / 14,7 | 34 / 17,8 | 18 / 10,9 | 30 / 18,1 | **118 / 62,1 min** (135 / 173) | 123 / 60,5 | 127 / 67,5 | 102 / 52,9 |
| dobrý | 28 / 12,6 | 36 / 18,4 | 23 / 12,5 | 22 / 12,5 | **109 / 56,6 min** (129 / 161) | 115 / 58,5 | 119 / 61,8 | 99 / 50,9 |
| expert | 23 / 10,6 | 29 / 15,6 | 19 / 11,2 | 14 / 8,7 | **84 / 46,0 min** (100 / 114) | 103 / 54,0 | 101 / 54,9 | 78 / 42,1 |
| slabý + asistence (DQ-13) | 36 / 17,6 | 30 / 18,6 | 20 / 13,4 | 28 / 19,1 | **114 / 69,4 min** (137 / 165) | 124 / 68,3 | 126 / 76,1 | 102 / 59,4 |
| automatické QTE (DQ-14) | 35 / 15,2 | 36 / 18,5 | 19 / 11,4 | 33 / 19,8 | **124 / 64,4 min** (136 / 151) | 125 / 60,7 | 135 / 70,0 | 105 / 53,2 |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 16,7 / 25,1 / 26,2 / 26,5 | 30,1 / 46,5 | 68 % | 2 / 14 (10) | 10 / 18 | 43 | 89 % | 59 % | 2 % | – |
| průměrný | 17,7 / 23,0 / 27,0 / 27,6 | 30,6 / 46,5 | 82 % | 2 / 13 (8) | 8 / 17 | 39 | 87 % | 55 % | 3 % | – |
| dobrý | 18,6 / 22,6 / 23,3 / 25,0 | 29,6 / 50,5 | 87 % | 2 / 13 (8) | 8 / 18 | 36 | 83 % | 38 % | 2 % | 10 % |
| expert | 19,5 / 24,2 / 25,6 / 27,9 | 31,3 / 53,4 | 91 % | 2 / 9 (6) | 6 / 14 | 31 | 74 % | 41 % | 3 % | 2 % |
| slabý + asistence (DQ-13) | 20,8 / 30,3 / 32,1 / 32,7 | 37,1 / 56,5 | 88 % | 2 / 13 (7) | 9 / 15 | 38 | 85 % | 61 % | 6 % | – |
| automatické QTE (DQ-14) | 17,5 / 22,8 / 26,7 / 27,4 | 30,6 / 45,3 | 100 % | 2 / 12 (9) | 9 / 17 | 41 | 87 % | 60 % | 2 % | – |

#### Hody a minuty na čtvrť (styl 08 §2.6), výpadek pozornosti (informativně)

Realistický nákup, kapsy podle profilu, 150 kampaní na řádek. Medián, minuty = skutečný čas vč. 8 s UI na hod a karet čtvrtí.

| Profil | D1 | D2 | D3 | D4 | Celkem (P90 / max hodů) | Paper napřed | Atlas napřed | optimální nákup |
|---|---|---|---|---|---|---|---|---|
| slabý | 38 / 16,2 | 32 / 17,7 | 21 / 12,3 | 31 / 18,6 | **123 / 64,9 min** (140 / 156) | 129 / 61,8 | 135 / 71,5 | – |
| průměrný | 30 / 13,6 | 32 / 16,5 | 18 / 10,9 | 23 / 13,7 | **103 / 55,2 min** (116 / 139) | 118 / 58,3 | 118 / 63,3 | – |
| dobrý | 26 / 11,9 | 32 / 16,5 | 19 / 10,7 | 15 / 8,7 | **90 / 47,8 min** (108 / 127) | 109 / 55,5 | 105 / 56,2 | – |
| expert | 22 / 10,5 | 26 / 14,0 | 16 / 9,7 | 11 / 6,9 | **75 / 41,4 min** (87 / 101) | 101 / 52,3 | 94 / 52,7 | – |

| Profil | let medián D1 / D2 / D3 / D4 [s] | P90 / max [s] | zásah QTE | sucho medián / max (medián max) | mezi místy medián / P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | Dive pády |
|---|---|---|---:|---|---|---:|---:|---:|---:|---:|
| slabý | 17,2 / 25,7 / 26,8 / 26,9 | 30,9 / 44,5 | 79 % | 2 / 12 (8) | 9 / 16 | 38 | 87 % | 60 % | 4 % | – |
| průměrný | 18,2 / 23,2 / 27,5 / 28,3 | 31,2 / 50,7 | 90 % | 2 / 10 (7) | 7 / 14 | 34 | 83 % | 56 % | 6 % | – |
| dobrý | 18,9 / 23,6 / 24,8 / 27,1 | 30,6 / 50,0 | 86 % | 2 / 11 (7) | 7 / 14 | 33 | 76 % | 39 % | 3 % | 2 % |
| expert | 19,8 / 24,7 / 26,7 / 29,4 | 31,8 / 50,9 | 89 % | 2 / 8 (6) | 6 / 12 | 30 | 70 % | 40 % | 3 % | 0 % |

**Stabilita:** druhý seed (200 kampaní, průměrný SKILLS): 30 / 31 / 16 / 21 hodů, celkem 98 / 52,2 min (P90 110), proti prvnímu seedu 30 / 30 / 16 / 22, 98 / 52,8 min.

#### Kapsy (matice B22): minuty do cíle podle speciálu v 1. kapse

Realistický nákup, 150 kampaní na buňku. Do 2. kapsy jde záložní Cushion / Sharp Edge jen při kladném náhledu. Tučně nejlepší.

**SKILLS**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 65,2 | 65,2 | **61,4** | 65,9 (12 %) | 64,0 | 61,7 | 61,5 |
| průměrný | 57,0 | 54,3 | 52,7 | 55,4 (7 %) | 55,0 | **51,2** | 53,1 |
| dobrý | 50,8 | 49,1 | 44,8 | 46,5 (2 %) | 48,7 | **41,9** | 45,5 |
| expert | 45,2 | 42,9 | 39,2 | 41,6 (0 %) | 45,6 | **38,8** | 41,5 |

**„šum ×2“**

| Profil | žádná | Cushion | Sharp Edge | Dive (pády) | Calm Sky | Whistle | Paper Rocket |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 77,0 | 78,2 | 75,7 | 79,8 (20 %) | 74,5 | 75,0 | **72,2** |
| průměrný | 67,5 | 66,3 | 62,4 | 66,3 (16 %) | 64,3 | **61,8** | 62,2 |
| dobrý | 58,8 | 56,5 | 52,3 | 58,1 (10 %) | 56,3 | **51,5** | 53,2 |
| expert | 49,6 | 47,9 | 43,7 | 45,5 (2 %) | 48,7 | **41,3** | 44,3 |

#### Speciály na výbavě „konec D3“ (zisk doletu, SKILLS)

| Profil | Cushion | Sharp | Calm | Dive (pády) | Whistle | Rocket | Dive vysoké vybrání |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 4,6 % | 3,8 % | 2,4 % | -4,8 % (14 %) | 7,3 % | 10,1 % | -0,5 % |
| průměrný | 4,8 % | 6,1 % | 2,8 % | -4,5 % (8 %) | 8,0 % | 9,1 % | -0,1 % |
| dobrý | 5,2 % | 7,2 % | 3,1 % | -2,7 % (3 %) | 8,5 % | 8,4 % | -2,3 % |
| expert | 5,3 % | 8,9 % | 3,1 % | 0,6 % (0 %) | 9,6 % | 8,1 % | -3,5 % |
| slabý + asistence (DQ-13) | 5,4 % | 7,6 % | 3,5 % | -2,2 % (7 %) | 9,1 % | 9,3 % | 1,9 % |
| automatické QTE (DQ-14) | 4,8 % | 7,2 % | 1,1 % | -3,9 % (15 %) | 4,2 % | 10,5 % | -0,8 % |

#### Speciály na výbavě „konec D3“ (zisk doletu, „šum ×2“)

| Profil | Cushion | Sharp | Calm | Dive (pády) | Whistle | Rocket | Dive vysoké vybrání |
|---|---:|---:|---:|---:|---:|---:|---:|
| slabý | 3,3 % | 1,7 % | 1,6 % | -5,3 % (19 %) | 4,2 % | 11,1 % | -2,1 % |
| průměrný | 3,9 % | 3,5 % | 2,2 % | -7,6 % (22 %) | 6,3 % | 9,9 % | -0,7 % |
| dobrý | 4,2 % | 4,4 % | 2,1 % | -7,9 % (12 %) | 6,8 % | 8,9 % | -1,8 % |
| expert | 5,0 % | 6,8 % | 2,4 % | -4,5 % (3 %) | 8,5 % | 8,3 % | -3,0 % |
| slabý + asistence (DQ-13) | 4,2 % | 4,9 % | 2,6 % | -5,2 % (17 %) | 7,7 % | 9,9 % | 0,0 % |
| automatické QTE (DQ-14) | 3,1 % | 7,2 % | 1,1 % | -6,4 % (23 %) | 4,2 % | 10,5 % | -2,0 % |

#### Atlas na úr. 3 (plná výbava s bonusem proti bez něj)

| Bonus | průměrný SKILLS | slabý SKILLS | průměrný „šum ×2“ | slabý „šum ×2“ |
|---|---:|---:|---:|---:|
| chain | 3,5 % | 2,7 % | 2,2 % | 1,0 % |
| pinwheel | 2,9 % | 2,9 % | 2,7 % | 2,8 % |
| steam | 1,2 % | 1,2 % | 1,0 % | -0,3 % |
| tape | 0,8 % | 2,1 % | 3,1 % | 6,8 % |
| crane | 4,1 % | 4,6 % | 4,8 % | 4,2 % |
| skip | 4,8 % (41 % letů) | 3,9 % (30 % letů) | 3,2 % (26 % letů) | 1,8 % (14 % letů) |
| gull | 3,3 % | 3,2 % | 2,7 % | 2,3 % |
| momentum | 8,5 % | 8,8 % | 9,2 % | 8,4 % |
| thermal | -0,2 % | 1,7 % | 2,6 % | 2,0 % |
| echo | 7,0 % | 4,7 % | 4,0 % | 1,8 % |
| star | 0,4 % (10 % letů) | 0,3 % (10 % letů) | 0,4 % (10 % letů) | -0,1 % (10 % letů) |
| drone | 2,6 % | 1,7 % | 1,9 % | -0,0 % |
| paperCrane | 0,0 % (7 % letů) | 0,0 % (7 % letů) | 0,0 % (8 % letů) | 0,0 % (8 % letů) |
| onAir | 5,2 % | 4,5 % | 4,4 % | 2,1 % |

### Cíle 08 §10.2 v obou sadách

Hodnoty pro průměrného hráče (realistický nákup), pokud není uvedeno jinak. Kapsy z matice B22.

| Metrika | Cíl | SKILLS | | „šum ×2“ | |
|---|---|---|---|---|---|
| Hody D1 (průměrný) | 25–35 | 30 | OK | 34 | OK |
| Hody D2 (průměrný) | 20–30 | 30 | OK | 34 | **FAIL** |
| Hody D3 (průměrný) | 20–30 | 16 | **FAIL** | 18 | **FAIL** |
| Hody D4 (průměrný) | 20–30 | 22 | OK | 30 | OK |
| Minuty D1 (průměrný) | 12–18 | 13.4 | OK | 14.7 | OK |
| Minuty D2 (průměrný) | 10–16 | 15.9 | OK | 17.8 | **FAIL** |
| Minuty D3 (průměrný) | 12–18 | 9.9 | **FAIL** | 10.9 | **FAIL** |
| Minuty D4 (průměrný) | 14–20 | 13.9 | **FAIL** | 18.1 | OK |
| Minuty celkem (průměrný) | 50–75 | 52.8 | OK | 62.1 | OK |
| Let medián D1 [s] | ≤ 22 | 18.4 | OK | 17.7 | OK |
| Let medián D2 [s] | ≤ 27 | 23.5 | OK | 23.0 | OK |
| Let medián D3 [s] | ≤ 30 | 27.7 | OK | 27.0 | OK |
| Let medián D4 [s] | ≤ 35 | 28.5 | OK | 27.6 | OK |
| Let P90 [s] | ≤ 45 | 31.6 | OK | 30.6 | OK |
| Sucho medián / max | ≤ 4 / ≤ 8 | 2 / 11 | **FAIL** | 2 / 13 | **FAIL** |
| Mezi místy medián / P90 | ≤ 8 / ≤ 14 | 7 / 13 | OK | 8 / 17 | **FAIL** |
| Strop E zasažen (lety) | ≤ 20 % | 7 % | OK | 3 % | OK |
| Strop β zasažen (lety) | ≤ 25 % | 0 % | OK | 0 % | OK |
| Podíl kluzáku | 30 %–70 % | 53 % | OK | 55 % | OK |
| První kapsa (hod) | 20–40 | 37 | OK | 39 | OK |
| Koupené úrovně v cíli | 60 %–85 % | 80 % | OK | 87 % | **FAIL** |
| Žádný let > 60 s (skutečný) | ≤ 60 | 60.5 | **FAIL** | 56.5 | OK |
| Slabý: cíl do 250 hodů | 100 % | 100 % (max 163) | OK | 100 % (max 184) | OK |
| Slabý / průměrný (hody) | ≤ 1.4 | 1.17 | OK | 1.19 | OK |
| Expert / průměrný (hody) | ≥ 0.7 | 0.77 | OK | 0.71 | OK |
| Expert / slabý (hody) | 0.6–0.75 | 0.65 | OK | 0.60 | OK |
| Paper napřed rychlejší o (weak) | ≤ 10 % | 2 % | OK | 9 % | OK |
| Atlas napřed pomalejší o (weak) | ≤ 20 % | 11 % | OK | 5 % | OK |
| Paper napřed rychlejší o (average) | ≤ 10 % | -9 % | OK | 3 % | OK |
| Atlas napřed pomalejší o (average) | ≤ 20 % | 17 % | OK | 9 % | OK |
| Paper napřed rychlejší o (good) | ≤ 10 % | -18 % | OK | -3 % | OK |
| Atlas napřed pomalejší o (good) | ≤ 20 % | 19 % | OK | 9 % | OK |
| Paper napřed rychlejší o (expert) | ≤ 10 % | -28 % | OK | -18 % | OK |
| Atlas napřed pomalejší o (expert) | ≤ 20 % | 23 % | **FAIL** | 19 % | OK |
| Paper napřed rychlejší o (weakAssist) | ≤ 10 % | -9 % | OK | 2 % | OK |
| Atlas napřed pomalejší o (weakAssist) | ≤ 20 % | 20 % | **FAIL** | 10 % | OK |
| Paper napřed rychlejší o (auto) | ≤ 10 % | 5 % | OK | 6 % | OK |
| Atlas napřed pomalejší o (auto) | ≤ 20 % | 9 % | OK | 9 % | OK |
| Dive pády (weak) | ≤ 15 % | 14 % | OK | 19 % | **FAIL** |
| Dive vysoké vybrání (průměrný) | ±2 % | -0.1 % | OK | -0.7 % | OK |
| Dive pády (expert) | ≤ 3 % | 0 % | OK | 3 % | **FAIL** |
| Atlas chain na úr. 3 | 3 %–15 % | 3.5 % | OK | 2.2 % | **FAIL** |
| Atlas pinwheel na úr. 3 | 3 %–15 % | 2.9 % | **FAIL** | 2.7 % | **FAIL** |
| Atlas steam na úr. 3 | 3 %–15 % | 1.2 % | **FAIL** | 1.0 % | **FAIL** |
| Atlas tape na úr. 3 | 3 %–15 % | 0.8 % | **FAIL** | 3.1 % | OK |
| Atlas crane na úr. 3 | 3 %–15 % | 4.1 % | OK | 4.8 % | OK |
| Atlas skip na úr. 3 | 3 %–15 % | 4.8 % (v 41 % letů) | OK | 3.2 % (v 26 % letů) | OK |
| Atlas gull na úr. 3 | 3 %–15 % | 3.3 % | OK | 2.7 % | **FAIL** |
| Atlas momentum na úr. 3 | 3 %–15 % | 8.5 % | OK | 9.2 % | OK |
| Atlas thermal na úr. 3 | 3 %–15 % | -0.2 % | **FAIL** | 2.6 % | **FAIL** |
| Atlas echo na úr. 3 | 3 %–15 % | 7.0 % | OK | 4.0 % | OK |
| Atlas star na úr. 3 | 3 %–15 % | 0.4 % (v 10 % letů) | **FAIL** | 0.4 % (v 10 % letů) | **FAIL** |
| Atlas drone na úr. 3 | 3 %–15 % | 2.6 % | **FAIL** | 1.9 % | **FAIL** |
| Atlas paperCrane na úr. 3 | 3 %–15 % | 0.0 % (v 7 % letů) | **FAIL** | 0.0 % (v 8 % letů) | **FAIL** |
| Atlas onAir na úr. 3 | 3 %–15 % | 5.2 % | OK | 4.4 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 30 %–50 % | 41 % | OK | 26 % | **FAIL** |
| Kapsy weak: nejlepší sharp vs. rocket | ≤ 8 % | 0 % | OK | 3 % | OK |
| Kapsy average: nejlepší whistle vs. sharp | ≤ 8 % | 3 % | OK | 1 % | OK |
| Kapsy good: nejlepší whistle vs. sharp | ≤ 8 % | 7 % | OK | 2 % | OK |
| Kapsy expert: nejlepší whistle vs. sharp | ≤ 8 % | 1 % | OK | 6 % | OK |
| Kapsy: nejlepší aspoň v jednom profilu | všechny | sharp, whistle (nikde: rocket, calm, cushion, dive) | **FAIL** | rocket, whistle (nikde: calm, sharp, cushion, dive) | **FAIL** |

Souhrn: SKILLS 46 OK / 15 FAIL, „šum ×2“ 42 OK / 19 FAIL.

### Citlivost (08 §10.3)

Realistický nákup, 100 kampaní na variantu a profil. Výchozí sada ve stejném běhu = řádek „zrychlení klouzání 1,4“.

**SKILLS**

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 114 / 61,6 | 32 / 34 / 21 / 25 | 31,9 / 53,6 | 135 / 72,4 (176) | 5742 / 26,4 |
| krok papíru ×1,1 | 83 / 43,5 | 28 / 26 / 13 / 17 | 31,0 / 46,7 | 100 / 52,8 (137) | 6881 / 26,4 |
| zrychlení klouzání 1,0 | 100 / 57,7 | 30 / 30 / 17 / 23 | 34,6 / 50,9 | 115 / 65,8 (154) | 6311 / 29,1 |
| zrychlení klouzání 1,4 | 100 / 53,5 | 30 / 30 / 17 / 23 | 31,6 / 46,6 | 115 / 61,5 (154) | 6311 / 26,4 |
| ceny ×0,8 | 78 / 41,8 | 24 / 23 / 13 / 18 | 31,4 / 45,5 | 93 / 48,9 (119) | 6311 / 26,4 |
| ceny ×1,25 | 119 / 64,3 | 37 / 40 / 21 / 24 | 31,6 / 45,3 | 147 / 78,7 (188) | 6311 / 26,4 |
| Shooting Star ×0,5 | 100 / 53,5 | 30 / 30 / 17 / 23 | 31,6 / 46,6 | 116 / 61,8 (146) | 6301 / 26,4 |
| Shooting Star ×2 | 98 / 52,6 | 30 / 30 / 17 / 22 | 31,6 / 46,2 | 115 / 61,2 (146) | 6353 / 26,6 |
| rozestup událostí ×0,8 | 87 / 47,8 | 28 / 27 / 14 / 17 | 32,7 / 47,2 | 106 / 57,6 (141) | 6596 / 28,2 |
| rozestup událostí ×1,25 | 106 / 56,0 | 31 / 32 / 18 / 24 | 30,6 / 48,0 | 126 / 66,0 (145) | 6007 / 25,7 |
| readNoise 0 | 97 / 53,0 | 30 / 30 / 15 / 23 | 31,7 / 44,8 | 114 / 60,8 (154) | 6377 / 26,4 |
| readNoise 0,4 | 101 / 53,6 | 31 / 31 / 16 / 23 | 31,4 / 46,5 | 118 / 62,5 (144) | 6159 / 26,1 |
| push sond (scaleWithPace=false) | 112 / 61,9 | 32 / 33 / 19 / 29 | 32,7 / 49,2 | 129 / 71,4 (149) | 5765 / 26,6 |
| nákupčí: trpělivost 3 | 103 / 54,8 | 32 / 33 / 18 / 22 | 31,5 / 50,6 | 119 / 63,8 (154) | 6311 / 26,4 |
| nákupčí: trpělivost 10 | 95 / 50,8 | 30 / 28 / 16 / 21 | 31,4 / 45,6 | 111 / 58,3 (135) | 6311 / 26,4 |
| nákupčí: chyba odhadu 0,25 | 96 / 51,6 | 30 / 29 / 16 / 23 | 31,6 / 45,2 | 116 / 61,6 (154) | 6311 / 26,4 |
| nákupčí: chyba odhadu 0,8 | 98 / 52,9 | 31 / 30 / 17 / 21 | 31,6 / 46,9 | 117 / 62,8 (154) | 6311 / 26,4 |
| nákupčí: bez preference papíru | 99 / 53,4 | 30 / 31 / 16 / 22 | 31,7 / 44,8 | 116 / 62,5 (144) | 6311 / 26,4 |

**„šum ×2“**

| Varianta | průměrný hody / min | průměrný D1–D4 | let P90 / max [s] | slabý hody / min (max) | plná výbava průměrný [m] / let [s] |
|---|---|---|---|---|---|
| krok papíru ×0,9 | 134 / 71,7 | 37 / 42 / 24 / 33 | 30,8 / 47,5 | 160 / 83,9 (193) | 5144 / 25,9 |
| krok papíru ×1,1 | 100 / 52,6 | 32 / 30 / 15 / 23 | 30,1 / 46,0 | 122 / 63,1 (169) | 6169 / 25,8 |
| zrychlení klouzání 1,0 | 116 / 66,2 | 34 / 34 / 18 / 29 | 33,7 / 49,4 | 141 / 77,9 (176) | 5657 / 28,4 |
| zrychlení klouzání 1,4 | 116 / 61,7 | 34 / 34 / 18 / 29 | 30,6 / 46,5 | 141 / 72,8 (176) | 5657 / 25,8 |
| ceny ×0,8 | 90 / 48,2 | 28 / 27 / 15 / 24 | 30,6 / 46,4 | 112 / 58,3 (149) | 5657 / 25,8 |
| ceny ×1,25 | 148 / 78,2 | 44 / 43 / 24 / 36 | 30,6 / 47,6 | 176 / 91,8 (225) | 5657 / 25,8 |
| Shooting Star ×0,5 | 117 / 61,6 | 34 / 34 / 18 / 29 | 30,5 / 45,6 | 142 / 73,2 (176) | 5634 / 25,8 |
| Shooting Star ×2 | 116 / 61,4 | 34 / 34 / 18 / 29 | 30,6 / 46,5 | 141 / 72,1 (176) | 5671 / 25,8 |
| rozestup událostí ×0,8 | 106 / 57,4 | 33 / 31 / 17 / 26 | 31,6 / 49,1 | 133 / 69,0 (176) | 5918 / 26,9 |
| rozestup událostí ×1,25 | 124 / 64,6 | 35 / 36 / 21 / 31 | 29,8 / 44,0 | 147 / 75,4 (183) | 5433 / 24,3 |
| readNoise 0 | 113 / 60,2 | 34 / 34 / 19 / 30 | 30,6 / 44,7 | 138 / 72,0 (190) | 5704 / 25,8 |
| readNoise 0,4 | 117 / 61,9 | 35 / 34 / 19 / 28 | 30,4 / 44,9 | 143 / 73,4 (186) | 5524 / 25,7 |
| push sond (scaleWithPace=false) | 128 / 69,5 | 35 / 41 / 22 / 32 | 31,9 / 47,5 | 151 / 80,9 (181) | 5279 / 25,6 |
| nákupčí: trpělivost 3 | 122 / 64,6 | 36 / 36 / 18 / 31 | 30,6 / 43,0 | 144 / 74,4 (183) | 5657 / 25,8 |
| nákupčí: trpělivost 10 | 110 / 57,2 | 34 / 32 / 19 / 27 | 30,3 / 45,2 | 133 / 67,7 (183) | 5657 / 25,8 |
| nákupčí: chyba odhadu 0,25 | 115 / 59,9 | 33 / 34 / 18 / 31 | 30,5 / 45,4 | 142 / 72,7 (180) | 5657 / 25,8 |
| nákupčí: chyba odhadu 0,8 | 118 / 62,0 | 35 / 34 / 19 / 31 | 30,5 / 45,3 | 141 / 73,0 (184) | 5657 / 25,8 |
| nákupčí: bez preference papíru | 118 / 62,6 | 34 / 32 / 20 / 31 | 30,5 / 46,9 | 143 / 74,4 (183) | 5657 / 25,8 |


### Poznámky k čtení
- **Model nákupčího:** ve všech variantách (trpělivost 3 a 10, chyba odhadu 0,25 a 0,8, bez preference papíru) je „Paper napřed“ nejvýš o 5 % rychlejší než realistický nákup (slabý, trpělivost 3), u průměrného pomalejší o 5–14 %. „Atlas napřed“ je pomalejší o 7–19 %. Délka hry se mění o −3 až +5 %. Kontroly strategií na zvoleném modelu nákupčího nestojí.
- **Rozptyl:** P90 hodů je o 13–14 % nad mediánem (průměrný 111 / 135 hodů), maximum o 40–50 %. Druhý seed mění medián o méně než 1 hod.
- **Nejdelší let 60,5 s** (SKILLS) je u slabého s asistencí DQ-13, která při událostech zpomaluje čas 0,6×. Bez asistence je nejdelší let 59,7 s (expert, Atlas napřed), simulovaný čas nejvýš 61 s, takže limit 60 s je na hraně.
- **Strop E** se v kampani zasáhne ve 2–10 % letů, na plné výbavě průměrného hráče asi ve třetině. Strop β (0,5) teď plná výbava nedosáhne (Momentum 0,25 + On Air 0,20) a zůstává jen pojistkou.
- **Nové události v okamžiku odemčení** (sonda ve scratchpadu, 250 letů): pára +1 %, termika 0 až +1,6 %, Ad Drone −1,1 až +2,7 %, hvězda +0,1 až +0,3 %. Na úr. 3 pára +2,4 až +3,5 %, termika +2,2 až +5,4 %, dron +0,4 až +5,1 %. Dolet tedy vytlačením nesnižují. Na plné výbavě vycházejí slabší, protože Echo a Gull Escort na úr. 3 posilují poryv a holuba.
