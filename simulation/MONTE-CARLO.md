# Monte Carlo simulace progrese hráče

Pravidla 0.4.0, 13. 10. 2026. Skript `simulation/monte-carlo.mjs`, surová agregovaná data jsou v `simulation/monte-carlo.json`.
Spuštění: `node simulation/monte-carlo.mjs 250 1000` (250 běhů na kombinaci strategií, 1000 běhů na profil a scénář). Výsledek: **84 000 kampaní za 66 s** (15 worker vláken, 16 jader). Skript přepisuje jen `monte-carlo.json`, tabulky tiskne na stdout.

## Metodika

- **Kampaň** začíná `fresh()` a končí při `best ≥ 500 m`, nejpozději po 300 hodech. Kdo nedojde do 300 hodů, počítá se jako softlock.
- **Hod** odpovídá hře: `throwSettings(úhel, síla)` → `createFlight(model, levels, attempts+1, vítr 0, launch)` → krokování `step()` po 1/60 s → `settle()`. Seed letu (a tím pořadí událostí) je stejný jako ve hře, tedy `attempts+1`, včetně tutoriálu pro seed 1.
- **QTE** se ovládají přes `eventInput` jako šum časování vůči oknům v `events.js`. Poryv: stisk v `at + 1,4 s + bias + N(0, σ)`. Okno je ±0,06 s pro perfektní a ±0,2 s pro úspěch, stisk ve varování znamená minutí. Holub: stisk v `at + 0,8 + reakce + N(0, 1,2σ)`, držení `0,75 s + bias + N(0, σ)`. Každý hráč má vlastní systematický bias ~ N(0, σ/2).
- **Síla** je N(μ, σ) oříznutá na [0, 1]. **Úhel** je strategie + N(0, σ_úhel); `throwSettings` ho ořízne na 5–40°.
- **Profily dovednosti:**

| Profil | Síla μ / σ | Šum úhlu | Šum QTE σ | Reakce na holuba |
|---|---|---|---|---|
| slabý | 0,50 / 0,12 | 5° | 0,22 s | 0,45 s |
| průměrný | 0,70 / 0,10 | 3,5° | 0,14 s | 0,35 s |
| dobrý | 0,85 / 0,07 | 2,5° | 0,09 s | 0,30 s |
| expert | 0,95 / 0,04 | 1,5° | 0,05 s | 0,25 s |

- **Strategie nákupu** (po každém hodu nakupuje, dokud může):
  - *síla*: šetří na sílu do úrovně 5, pak doplňuje rovnoměrně.
  - *rovnoměrně*: nejnižší úroveň, při shodě síla → papír → přehyby.
  - *nejlevnější*: nejlevnější další úroveň, při shodě přehyby → papír → síla. Protože ceník je pro všechny větve stejný, od *rovnoměrně* se liší jen pořadím.
  - *náhodně*: náhodná větev z těch, na které hráč má.
- **Strategie úhlu:** pevně 15°, pevně 25°, nebo *učící*. Učící začne na 20°, pak hraje úhel s nejlepším posledním doletem a s pravděpodobností 35 % (po 5 hodech 15 %) zkusí sousední úhel ±5°.
- **Model:** *šipka* celou hru, nebo *kluzák*, kdy hráč přepne hned po odemčení (100 m) a dál kupuje jen kluzákův strom.
- **Čas** = součet doby letů + 8 s na hod (míření a dílna).
- **RNG hráče** je vlastní (FNV-1a → splitmix32 → xoshiro128**), klíčovaný profilem, strategií a indexem běhu. Nepřekrývá se s `random(seed)` hry ani s `random(seed+991)` ze `simulate()`. Scénáře citlivosti používají stejné hráče (common random numbers), takže rozdíly mezi scénáři nejsou šum výběru.
- **Citlivost:** `PRICES` se přepisuje jen v paměti workeru. Odměnu násobí skript po `settle()` (`floor(odměna × k)`). `config.js` zůstal beze změny. Scénáře citlivosti losují pro každého hráče jednu z 24 kombinací strategií rovnoměrně.

## Výsledky: aktuální ceny 10/30/55/85/120, odměna 10 + dolet/10

Základní faktoriál: 4 profily × 24 strategií × 250 běhů = 24 000 kampaní. Hodnoty jsou medián (P10–P90).

| Profil | Softlock | Hody do 100 m | Min do 100 m | Hody do 500 m | Min do 500 m |
|---|---:|---:|---:|---:|---:|
| slabý | 0 % | 1 (1–1) | 0,3 (0,3–0,5) | 15 (12–22) | 6,4 (4,6–9,7) |
| průměrný | 0 % | 1 (1–1) | 0,4 (0,3–0,5) | 8 (6–12) | 3,9 (2,8–6,2) |
| dobrý | 0 % | 1 (1–1) | 0,5 (0,4–0,5) | 6 (5–8) | 3,1 (2,3–3,9) |
| expert | 0 % | 1 (1–1) | 0,5 (0,5–0,5) | 5 (3–7) | 2,7 (1,6–3,7) |

| Profil | Mince na konci | Vyděláno | Nákupů | Šipka síla/papír/přehyby (Ø úroveň) | Kluzák síla/papír/přehyby | QTE úspěch | z toho perfekt | QTE na hod |
|---|---:|---:|---:|---|---|---:|---:|---:|
| slabý | 112 | 630 | 12,1 | 2,5 / 2,0 / 1,9 | 2,2 / 1,8 / 1,7 | 58 % | 18 % | 2,7 |
| průměrný | 103 | 410 | 9,3 | 2,2 / 1,5 / 1,4 | 1,8 / 1,2 / 1,2 | 81 % | 29 % | 2,8 |
| dobrý | 95 | 310 | 8,0 | 2,0 / 1,3 / 1,3 | 1,5 / 0,9 / 0,9 | 96 % | 44 % | 3,0 |
| expert | 86 | 260 | 7,3 | 1,9 / 1,2 / 1,2 | 1,3 / 0,8 / 0,8 | 100 % | 70 % | 3,1 |

Úrovně kluzáku jsou průměr přes všechny běhy, tedy i přes ty, kdo kluzák nehráli. První nákup přijde vždy po 1. hodu a kluzák se odemkne 1. hodem (100 m dá i slabý hod).

### Vliv strategií: medián hodů do 500 m (softlock je všude 0 %)

| Strategie nákupu | slabý | průměrný | dobrý | expert |
|---|---:|---:|---:|---:|
| síla | 12 | 7 | 6 | 4 |
| rovnoměrně | 15 | 7 | 6 | 5 |
| nejlevnější | 19 | 12 | 7 | 6 |
| náhodně | 17 | 10 | 7 | 6 |

| Úhel | slabý | průměrný | dobrý | expert |
|---|---:|---:|---:|---:|
| 15° | 15 | 9 | 6 | 6 |
| 25° | 15 | 8 | 6 | 4 |
| učící | 15 | 8 | 6 | 5 |

| Model | slabý | průměrný | dobrý | expert |
|---|---:|---:|---:|---:|
| šipka | 14 | 7 | 6 | 4 |
| kluzák | 16 | 10 | 7 | 6 |

### Marginální vliv větví

Průměrný hod (síla 0,7, úhel 20°, bez QTE, průměr 40 seedů), dolet v metrech na úrovních 0–5:

| Model | Větev | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---:|---:|---:|---:|---:|---:|
| šipka | jen síla | 176 | 220 | 271 | 331 | 398 | 472 |
| šipka | jen papír | 176 | 178 | 179 | 180 | 181 | 182 |
| šipka | jen přehyby | 176 | 177 | 179 | 180 | 181 | 182 |
| šipka | vše | 176 | 223 | 282 | 357 | 453 | 571 |
| kluzák | jen síla | 155 | 195 | 244 | 301 | 361 | 421 |
| kluzák | jen papír | 155 | 156 | 157 | 158 | 159 | 160 |
| kluzák | jen přehyby | 155 | 156 | 157 | 157 | 158 | 159 |
| kluzák | vše | 155 | 199 | 256 | 328 | 413 | 507 |

Samotný papír nebo přehyby přidají asi 1,2 m za úroveň. Ve spojení s plnou silou dají dohromady asi +100 m (472 → 571), protože odpor roste s druhou mocninou rychlosti.

## Citlivost a kandidáti

Náhodný mix strategií, 1000 hráčů na profil, stejní hráči ve všech řádcích. Formát buňky: hody do 500 m P50 (P10–P90) / minuty P50. Softlock je ve všech řádcích s QTE 0 %.

| Scénář | slabý | průměrný | dobrý | expert |
|---|---|---|---|---|
| aktuální (×1) | 15 (11–21) / 6,3 | 8 (6–12) / 3,8 | 6 (5–8) / 3,1 | 6 (3–7) / 2,8 |
| ceny ×2 | 24 (16–42) / 10,4 | 13 (9–19) / 6,0 | 7 (6–12) / 3,7 | 7 (6–9) / 3,3 |
| ceny ×3 | 39 (21–53) / 16,2 | 16 (12–27) / 7,4 | 12 (7–14) / 5,7 | 7 (6–12) / 3,8 |
| odměna ÷2 | 26 (16–42) / 10,5 | 13 (9–19) / 6,0 | 7 (6–12) / 3,7 | 7 (6–9) / 3,3 |
| ceny ×2 + odměna ÷2 | 49 (28–65) / 20,5 | 21 (13–35) / 9,2 | 12 (7–18) / 6,1 | 12 (7–14) / 5,7 |
| ceny ×4 | 47 (28–65) / 20,3 | 21 (13–35) / 9,2 | 12 (7–18) / 6,1 | 12 (7–13) / 5,5 |
| **ceny ×5 = 50/150/275/425/600** | 54 (38–77) / 22,7 | **23 (15–43) / 11,1** | 14 (12–21) / 6,5 | 12 (7–15) / 6,1 |
| ceny ×6 | 63 (45–89) / 25,7 | 29 (16–49) / 13,3 | 15 (12–23) / 7,2 | 12 (7–19) / 6,3 |
| 40/120/240/400/600 | 51 (29–68) / 21,5 | 21 (14–38) / 9,4 | 12 (7–18) / 6,1 | 12 (7–13) / 5,6 |
| 30/120/260/420/600 | 51 (29–72) / 21,7 | 21 (14–39) / 9,3 | 12 (7–17) / 6,0 | 8 (6–12) / 4,0 |
| ceny ×5, odměna ÷2 | 93 (60–143) / 38,9 | 49 (27–68) / 22,1 | 23 (14–46) / 11,8 | 15 (12–29) / 7,3 |
| ceny ×5 + spodní mez síly 0,8 | 45 (27–63) / 19,8 | 21 (13–35) / 9,4 | 12 (12–19) / 6,3 | 12 (7–15) / 6,0 |
| aktuální + spodní mez síly 0,8 | 12 (7–17) / 5,6 | 7 (6–12) / 3,4 | 6 (4–7) / 3,0 | 5 (3–7) / 2,6 |
| aktuální, bez QTE | 30 (19–60) / 12,3 | 18 (11–25) / 7,7 | 14 (9–19) / 6,1 | 11 (8–16) / 5,3 |
| ceny ×5, bez QTE | 113 (68–155) / 45,4 | 69 (42–100) / 29,7 | 54 (36–75) / 24,4 | 46 (25–65) / 21,8 |

„Spodní mez síly 0,8“ znamená lokálně přepsaný `launch.multiplier = 0,8 + 0,3 × síla` místo `0,7 + 0,4 × síla`. Řádky „bez QTE“ jsou zátěžový test: hráč nikdy nestiskne a softlock je tam 0,1 % u slabého.

## Závěry

1. **Hra je dnes 2–4× krátká.** Průměrný hráč dojde k 500 m za 8 hodů (3,9 min), dobrý za 6 (3,1 min). Cíl 10–15 min nesplní žádný profil.
2. **Softlock nehrozí.** Ani slabý hráč (síla 0,5) neuvízl v žádném z 6 000 běhů. Pomáhá rozptyl síly (občas hodí 0,65 a víc) a hlavně QTE: holub a poryv dávají velkou část doletu. Údaj v `CLAUDE.md` „strop ~451 m“ platí jen pro let bez QTE s konstantní silou.
3. **QTE jsou nejsilnější páka ekonomiky.** Bez QTE se počet hodů zhruba zdvojnásobí, při ceně ×5 až ztrojnásobí. Ladit ceny bez ladění QTE nejde, protože každá změna oken nebo bonusů (`HELP`) posune celé tempo.
4. **Ceny a odměna jsou zaměnitelné.** Ceny ×2 i odměna ÷2 dávají stejný medián (13 hodů u průměrného hráče). Tempo roste méně než lineárně s cenou: ×3 dá jen ~2× hodů, protože delší lety vydělají víc.
5. **Rozhoduje síla.** Papír a přehyby samy dávají ~1 % za úroveň. Strategie „nejlevnější“, která je kupuje první, je nejpomalejší (12 vs 7 hodů u průměrného hráče). Strom je fakticky jedna volba.
6. **Kluzák je past.** Strategie „přepnout na kluzák“ je pomalejší u všech profilů (průměrný 10 vs 7 hodů), protože hráč začíná nový strom od nuly a kluzák má nižší dolet na stejné úrovni. Odemkne se už 1. hodem, takže nefunguje jako milník.
7. **Úhel téměř nerozhoduje.** Pevných 15°, 25° i učící strategie dávají ±1 hod. Optimum se s úrovní posouvá k nižším úhlům: na max úrovni má šipka optimum 15–20°, kluzák 5°.
8. **Rozdíl mezi slabým a průměrným hráčem roste s cenou** (×1: 15 vs 8, ×5: 54 vs 23). Slabý hráč potřebuje skoro plný strom, kdežto průměrný dojde se dvěma až třemi úrovněmi síly a QTE.

## Doporučení

- **Ceny: `PRICES = [50, 150, 275, 425, 600]`** (aktuální ×5), **odměna beze změny** (`10 + floor(dolet/10)`).
  - Průměrný hráč: medián 23 hodů / 11,1 min (P10–P90: 15–43 hodů).
  - Dobrý hráč: 14 hodů / 6,5 min. Expert: 12 hodů / 6,1 min.
  - Slabý hráč: 54 hodů / 22,7 min, softlock 0 %. Hru dohraje, ale trvá mu to dvakrát déle.
  - Pokud má být tempo blíž 12–13 min, použijte ×6 (`[60, 180, 330, 510, 720]`: 29 hodů / 13,3 min).
- **Pro slabého hráče** přidat spodní mez síly: `multiplier = 0.8 + 0.3*power` v `throwSettings`. Při cenách ×5 zkrátí slabému hráči kampaň z 54 na 45 hodů (−3 min), průměrného téměř nezmění (23 → 21) a nikoho nezablokuje. Zvážit i odměnu za nový rekord, která dohánění dál zrychlí.
- **Odměnu nedělit**, pokud se ceny násobí ×5: kombinace dává 49 hodů / 22 min u průměrného hráče.
- **Mimo ceník (doporučeno, nesimulováno jako návrh):**
  - zvýšit efekt papíru a přehybů, aby větve byly skutečná volba;
  - posílit kluzák nebo mu sdílet úrovně se šipkou;
  - odemknout kluzák později (např. 250 m);
  - přeladění cen spojit se změnou QTE (širší okno poryvu), protože obojí míří na stejné tempo.

## Omezení

- Šum časování je model, ne měření skutečného hráče na dotyku. Úspěšnost QTE 58–100 % je spíš optimistická, hlavně pro mobil.
- Čas 8 s na hod je odhad. Nepočítá s pauzami, čtením textů ani tutoriálem.
- Vítr je nulový stejně jako v `ui.js`. Hráč nemění model za hry (jen jednou při odemčení kluzáku) a nikdy nehraje šipku po přepnutí.
- Kvantily zahrnují nedokončené běhy jako 300 hodů. Při 0 % softlocku to výsledky neovlivňuje.
