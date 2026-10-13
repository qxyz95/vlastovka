# Monte Carlo simulace progrese hráče (verze 0.6)

Pravidla 0.6.0 (arkádový let, sdílený strom, širší QTE), 13. 10. 2026. Skript je `simulation/monte-carlo.mjs`, agregovaná data jsou v `simulation/monte-carlo.json`.

Spuštění: `node simulation/monte-carlo.mjs 250 1000 2,4`. Argumenty jsou počet běhů na kombinaci strategií, počet běhů na scénář a profil a násobky cen pro sken. Skript přepisuje jen `monte-carlo.json`, tabulky tiskne na stdout.

Poslední běh: **108 000 kampaní za 102 s** (15 worker vláken).

## Aktualizace 0.6.1 (13. 10. 2026): aktuální stav hry

Změny oproti zbytku tohoto dokumentu: přehyby navíc +12 % účinku poryvů a holubů za úroveň a odpuštění síly +15 % (dřív +10 %), ceny `[35, 105, 195, 300, 420]` (dřív návrh A 25–300). Běh: 100 000 kampaní, 113 s. Zbytek dokumentu popisuje stav před touto úpravou.

| Profil (mix: 4 nákupní strategie × učící úhel × 3 modely) | Hody do 500 m P50 (P10–P90) | Minuty P50 (P10–P90) | Softlock |
|---|---:|---:|---:|
| slabý | 31 (21–42) | 15,1 (10,9–20,5) | 0 % |
| průměrný | 23 (15–33) | 11,9 (8,4–17,4) | 0 % |
| dobrý | 18 (12–27) | 10,0 (6,6–15,1) | 0 % |
| expert | 15 (12–23) | 8,3 (5,9–12,7) | 0 % |

- Nákup (průměrný hráč, všechny strategie úhlu a modelu): rovnoměrně 28 hodů, síla napřed 37, papír napřed 45, přehyby napřed 46. Papír a přehyby už jsou vyrovnané, specializace do jedné větve je pomalejší než vyvážený nákup.
- Marginální dolet na úrovni 5 (šipka / kluzák): síla 437 / 449 m, papír 325 / 440 m, přehyby 307 / 365 m (dřív 256 / 272 m).
- Modely: šipka 37 hodů / 15,4 min, kluzák 39 / 20,1 min (průměrný hráč, všechny strategie). Kluzák má delší lety, ani jeden model nedominuje.
- Ve hře se po každém hodu zobrazuje nápověda úhlu (`angleHint`), která hráče vede k učící strategii; pevný úhel 15° by znamenal zhruba dvojnásobek hodů.

## Metodika

**Kampaň:**
- Začíná `fresh()` a končí při `best ≥ 500 m`.
- Limit je 300 hodů. Kdo ho vyčerpá, počítá se jako softlock.
- Mezi hody hráč nakupuje do sdíleného stromu `p.levels`.

**Hod** probíhá stejně jako ve hře:
- `throwSettings(úhel, síla)` → `createFlight(model, p.levels, attempts+1, vítr 0, launch)`.
- Multiplikátor a „steady“ z přehybů počítá `createFlight`, simulace do nich nezasahuje.
- Fyzika krokuje po 1/60 s, hod končí `settle()`.
- Seed letu, a tím i pořadí událostí, je stejný jako ve hře, včetně tutoriálu pro seed 1.

**QTE** se ovládají přes `eventInput` jako šum časování. Okna i jejich rozšíření přehyby bere hra sama z `windows(f)`.
- *Poryv:* stisk v `at + 1,4 s + bias + N(0, σ)`.
- *Holub:* stisk v `at + 0,8 + reakce + N(0, 1,2σ)`, držení `0,75 s + bias + N(0, σ)`.
- Stisk ve varování hra ignoruje. Hráč pak klepne znovu o 0,25 s později.
- Každý hráč má vlastní systematický bias ~ N(0, σ/2).

**Profily dovednosti:**

| Profil | Síla μ / σ (oříznuto 0–1) | Šum úhlu | Šum QTE σ | Reakce na holuba |
|---|---|---|---|---|
| slabý | 0,50 / 0,12 | 5° | 0,22 s | 0,45 s |
| průměrný | 0,70 / 0,10 | 3,5° | 0,14 s | 0,35 s |
| dobrý | 0,85 / 0,07 | 2,5° | 0,09 s | 0,30 s |
| expert | 0,95 / 0,04 | 1,5° | 0,05 s | 0,25 s |

**Strategie:**
- **Nákup:**
  - *síla*: síla do úrovně 5, pak rovnoměrně;
  - *rovnoměrně*: nejnižší úroveň, při shodě síla → papír → přehyby;
  - *nejlevnější*: nejlevnější úroveň, při shodě přehyby → papír → síla;
  - *náhodně*: náhodná dostupná větev;
  - *papír* a *přehyby* jsou kontrolní strategie s danou větví napřed. Testují, zda větev není past.
- **Úhel:**
  - *15° pevně*;
  - *učící*: pro každý model zvlášť si pamatuje poslední dolet na úhlech po 5°. Hraje nejlepší úhel a s pravděpodobností 35 %, po 5 hodech 15 %, zkusí sousední.
- **Model:**
  - *šipka* celou hru;
  - *kluzák* hned po odemčení na 100 m;
  - *lepší*: po odemčení zkusí kluzák, pak hraje model s lepším posledním doletem a v 15 % hodů zkusí druhý.

**Měření a scénáře:**
- Čas = doba letů + 8 s na hod (míření a dílna).
- RNG hráče je vlastní (FNV-1a → splitmix32 → xoshiro128**) a nezávislý na `random(seed)` hry.
- Scénáře používají stejné hráče (common random numbers).
- **Faktoriál**: 4 profily × 36 strategií × 250 běhů, zvlášť pro aktuální ceny a pro návrh.
- **Scénáře cen** používají realistický mix: 4 nákupní strategie × učící úhel × 3 modely, 1000 hráčů na profil.
- Ceny se přepisují jen v paměti workeru a `config.js` se nemění. Odměna se násobí po `settle()`.

## Výsledky při aktuálních cenách 10/30/55/85/120

Realistický mix strategií. Hodnoty jsou medián (P10–P90).

| Profil | Hody do 500 m | Minuty do 500 m | Softlock |
|---|---:|---:|---:|
| slabý | 15 (12–20) | 7,7 (5,6–10,5) | 0 % |
| průměrný | 12 (8–16) | 6,0 (4,3–9,1) | 0 % |
| dobrý | 9 (7–14) | 4,9 (3,7–8,0) | 0 % |
| expert | 8 (7–12) | 4,4 (3,5–7,6) | 0 % |

- 100 m dá každý profil 1. hodem, takže se kluzák odemkne hned.
- Hod trvá i s dílnou průměrně 29–32 s.
- Úspěšnost QTE je 82 / 96 / 100 / 100 % a perfektních zásahů 40 / 58 / 79 / 97 %. Na jeden hod připadají asi 3 události.
- Bez QTE vychází průměrný hráč na 22 hodů místo 12 a slabý na 26 místo 15. QTE tedy ušetří asi 45 % hodů.

## Sken cen (realistický mix, 1000 hráčů na profil)

Buňka: hody P50 (P10–P90) / minuty P50 (P10–P90). Softlock je ve všech řádcích 0 %.

| Scénář | slabý | průměrný | dobrý | expert |
|---|---|---|---|---|
| aktuální ×1 | 15 (12–20) / 7,7 (5,6–10,5) | 12 (8–16) / 6,0 (4,3–9,1) | 9 (7–14) / 4,9 | 8 (7–12) / 4,4 |
| ceny ×2 | 25 (19–32) / 12,5 (9,7–16,2) | 18 (14–25) / 9,8 (7,5–13,4) | 15 (12–21) / 8,3 | 13 (9–19) / 7,3 |
| odměna ÷2 | 26 (19–32) / 12,6 (9,7–16,3) | 19 (14–25) / 9,7 (7,6–13,6) | 15 (12–21) / 8,4 | 14 (9–19) / 7,4 |
| **A: 25/75/140/215/300 (×2,5)** | **29 (21–39) / 15,0 (11,7–19,3)** | **23 (16–29) / 11,7 (9,0–15,6)** | 18 (12–24) / 9,7 | 15 (12–21) / 8,7 |
| D: 20/70/150/250/400 | 32 (21–41) / 16,0 (11,8–20,6) | 24 (15–31) / 12,2 (8,8–16,2) | 18 (12–26) / 10,1 | 15 (11–23) / 8,6 |
| ceny ×3 | 35 (25–45) / 17,5 (13,8–22,5) | 26 (18–32) / 13,1 (9,9–17,2) | 21 (14–27) / 11,0 | 18 (14–24) / 9,8 |
| ceny ×4 | 45 (32–54) / 22,4 (17,1–27,2) | 32 (23–41) / 16,7 (12,3–21,4) | 27 (18–33) / 14,1 | 21 (17–29) / 11,6 |

Ceny ×2 a odměna ÷2 dávají prakticky stejný výsledek. Počet hodů roste s cenou méně než lineárně: ×3 dává asi 2,2× hodů.

Návrh A koupí průměrnému hráči na cestě k 500 m v průměru úrovně síla 3,6, papír 2,7 a přehyby 2,5. Vydělá ~945 mincí a na konci mu zbude ~130.

## Strategie a modely (faktoriál, návrh A)

Hody / minuty do 500 m P50. Softlock je všude 0 %.

**Úhel:**

| Úhel | slabý | průměrný | dobrý | expert |
|---|---:|---:|---:|---:|
| 15° pevně | 52 / 22,0 | 46 / 20,3 | 45 / 19,7 | 45 / 20,4 |
| učící | 33 / 16,5 | 24 / 13,1 | 20 / 11,1 | 18 / 9,7 |

**Nákup** (průměr přes oba úhly a všechny modely):

| Nákup | slabý | průměrný | dobrý | expert |
|---|---:|---:|---:|---:|
| síla | 37 / 15,8 | 29 / 13,1 | 26 / 11,7 | 24 / 11,2 |
| rovnoměrně | 35 / 16,4 | 28 / 13,3 | 27 / 12,1 | 27 / 12,3 |
| nejlevnější | 41 / 19,0 | 34 / 15,5 | 31 / 14,6 | 35 / 14,8 |
| náhodně | 39 / 17,7 | 31 / 14,6 | 28 / 12,8 | 28 / 13,6 |
| papír napřed | 45 / 20,1 | 35 / 17,1 | 34 / 15,7 | 31 / 15,2 |
| přehyby napřed | 52 / 21,2 | 46 / 19,2 | 45 / 18,2 | 45 / 17,8 |

**Průměrný hráč s učícím úhlem, model × nákup:**

| Nákup | šipka | kluzák | lepší z obou |
|---|---:|---:|---:|
| síla | 23 / 10,5 | 24 / 13,8 | 24 / 11,5 |
| rovnoměrně | 19 / 9,9 | 18 / 11,3 | 19 / 10,2 |
| nejlevnější | 24 / 11,7 | 21 / 12,5 | 23 / 11,9 |
| náhodně | 23 / 11,1 | 20 / 11,9 | 23 / 11,9 |
| papír napřed | 30 / 14,4 | 24 / 15,3 | 28 / 15,0 |
| přehyby napřed | 38 / 16,4 | 35 / 18,8 | 39 / 17,5 |

**Model v realistickém mixu, návrh A:**

| Hráč | šipka | kluzák | lepší |
|---|---|---|---|
| průměrný | 23 / 10,9 | 21 / 12,6 | 23 / 11,7 |
| slabý | 32 / 14,7 | 27 / 15,5 | 29 / 14,7 |

## Marginální vliv větví

Průměrný hráč s QTE, nejlepší úhel z mřížky 15–40°, průměr 200 hodů. Dolet v metrech na úrovni 0–5:

| Model | Větev | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---:|---:|---:|---:|---:|---:|
| šipka | jen síla | 219 | 259 | 299 | 342 | 389 | 437 |
| šipka | jen papír | 219 | 240 | 259 | 280 | 301 | 325 |
| šipka | jen přehyby | 219 | 225 | 231 | 236 | 241 | 246 |
| šipka | vše | 219 | 286 | 369 | 468 | 587 | 731 |
| kluzák | jen síla | 234 | 272 | 311 | 354 | 399 | 449 |
| kluzák | jen papír | 234 | 273 | 312 | 353 | 395 | 440 |
| kluzák | jen přehyby | 234 | 240 | 246 | 251 | 256 | 261 |
| kluzák | vše | 234 | 321 | 436 | 574 | 746 | 918 |

Síla a papír se násobí, takže kombinace je výrazně silnější než součet. Na 500 m stačí zhruba úroveň 3–4 ve všem.

## Závěry

1. **Při aktuálních cenách je hra stále krátká.** Průměrný hráč dojde k 500 m za 12 hodů (6 min), cíl je 15–25 hodů a 10–15 min.
2. **Softlock nenastal** v žádném scénáři, ani u slabého hráče bez QTE. Rozdíl mezi slabým a průměrným hráčem se proti 0.4 zmenšil (29 proti 23 hodům při návrhu A). Pomáhají přehyby („steady“) a širší okna.
3. **Úhel teď rozhoduje.** Pevných 15° stojí proti učící strategii zhruba dvojnásobek hodů (46 proti 24 u průměrného hráče). Hráč, který ideální úhel nenajde, je nejpomalejší skupina, i když stále bez softlocku.
4. **Kluzák není ani past, ani dominantní.** S učícím úhlem potřebuje o 1–5 hodů méně než šipka, ale lety jsou delší, takže v minutách vychází o ~1–2 min hůř. „Lepší z obou“ je mezi nimi. S pevnými 15° je kluzák horší, protože jeho ideál je vysoko.
5. **Papír není past, přehyby napřed ano.**
   - Papír napřed je u kluzáku srovnatelný (24 hodů, stejně jako síla), u šipky pomalejší (30 proti 19–23).
   - Přehyby napřed stojí 35–39 hodů proti 18–24, protože přidají jen ~6 m za úroveň. Jejich hodnota je v odpuštění chyb a v oknech QTE, což se do doletu promítá málo.
   - Rovnoměrný nákup je nejlepší strategie, takže strom jako celek funguje.
6. **QTE ušetří asi 45 % hodů.** Při jakékoli změně oken nebo `HELP` je potřeba simulaci zopakovat.

## Doporučení

- **`PRICES = [25, 75, 140, 215, 300]`** (×2,5), **odměna beze změny** `10 + floor(dolet/10)`.

| Profil | Hody P50 (P10–P90) | Minuty P50 (P10–P90) | Softlock |
|---|---:|---:|---:|
| průměrný | 23 (16–29) | 11,7 (9,0–15,6) | 0 % |
| slabý | 29 (21–39) | 15,0 (11,7–19,3) | 0 % |
| dobrý | 18 | 9,7 | 0 % |
| expert | 15 | 8,7 | 0 % |

  Průměrný hráč je v cíli a slabý se vejde do 25 min i na P90.
- Alternativa se strmějším koncem je **D: `[20, 70, 150, 250, 400]`**: průměrný hráč 24 hodů / 12,2 min, slabý 32 / 16,0. Hodí se, pokud mají úrovně 4–5 a mince sloužit i po 500 m.
- **Přehyby posílit**, aby nebyly pastí. Například `UPGRADE.steady` 0,1 → 0,15, nebo k přehybům přidat malý bonus ke klouzavosti. Pak simulaci zopakovat.
- **Napovědět ideální úhel** (značka nebo text v míření), protože hráč s pevným úhlem hraje dvakrát déle.

## Omezení

- Šum časování QTE je model, ne měření na dotyku. Úspěšnost 82–100 % je spíš optimistická. Kdyby byla nižší, hra se prodlouží, nejvýš ale na úroveň řádku „bez QTE“.
- Čas 8 s na hod je odhad bez pauz a čtení textů. Vítr je nulový stejně jako v `ui.js`. Odemčení kluzáku na 100 m je převzaté z `ui.js`.
- Učící hráč zkoumá úhly po 5°. Skutečný hráč může najít ideál rychleji, s nápovědou, nebo pomaleji.
