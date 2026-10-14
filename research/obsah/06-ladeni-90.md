# Ladění čísel na 90 min, 1. kolo (balance-analyst)

**15. 10. 2026.** Zadání 05 §7.3 (statistiky a ceny vlaštovek, Mailbag, měřítko cen). **Kolo je přerušené** pokynem orchestrátora: uživatel mění jádro QTE (účinek podle rychlosti vlaštovky, role událostí), což změní délky letů i celou křivku. Proto se **`params.mjs` neměnil**. Tady je základna a co ukázaly první páky, pro další kolo po nové mechanice. Průběh je v `runs/2026-10-15-ladeni-90.md`.

**Vstupy.** FOUND: `params.mjs` (F5 + Mailbag, `MODEL_SETS.obsah01` = zástupná čísla z 1. verze 01, Hawk ideal 34°), `TARGET_SETS.t90`, 05 §7.2–7.3, 01 §2.1 / §2.8 / §2.11 / §6.1 (revize: Hawk 18°, ceny 450 / 770 / 1 100 / 1 560 / 2 190), 06 (90 min bez natahování, Mailbag III do finále, Needle stejný dolet a kratší let), 04-ekonomika. ABSENT: `economy.priceScale` a 3. kolo ekonomiky (násobek čtvrti), zastávky, fronta novinek, varianty událostí, Hejno, vír.

## 1. Běhy

Všechny SKILLS (reference 05 §7.2), `--modelset obsah01 --mailbag --targets t90 --models preview --no-probes --workers 4`, n 60, seed 1.

| Běh | Navíc | Výstup |
|---|---|---|
| kouřový | n 20 | `out/90m-smoke.md` |
| základna | weak, average, expert × realistic | `out/90m-base.md` |
| základna, strategie | average × realistic, no-models, models-first, no-mailbag, mailbag-first | `out/90m-base-strat.md` |
| modely c3 | `--params out/90m-models-c3.json`, weak, average, expert × realistic | `out/90m-m3.md` |
| modely c3, strategie | totéž, average × no-models, models-first, no-mailbag, mailbag-first | `out/90m-m3-strat.md` |
| sonda modelů | skript `out/90m-probe-models.mjs.txt` (pevná výbava, 150 letů na buňku, CRN), jen výpis | tabulky v §3 |

Sada x2 (povinně hlídaná) se v tomto kole **nespustila** (přerušeno) → NOT ASSESSED.

## 2. Základna (dnešní stav, `out/90m-base*.md`)

| Metrika 05 §7.2 | Cíl | Hodnota (průměrný) | Verdikt |
|---|---|---|---|
| Hody D1 / D2 / D3 / D4 | 34–46 / 36–48 / 37–49 / 36–48 | 29 / 24 / 14 / 11 | CONCERNS |
| Hody celkem | 150–185 | 78 | CONCERNS |
| Minuty D1 / D2 / D3 / D4 | 14–20 / 18–24 / 21–27 / 23–29 | 13,4 / 12,9 / 9,1 / 7,7 | CONCERNS |
| Minuty celkem | 82–98 | **42,1** | CONCERNS |
| Slabý do 250 hodů / slabý ÷ průměrný (min) | 100 % / ≤ 1,35 | 100 % (max 97) / 1,13 | HEALTHY |
| Expert ÷ průměrný (hody) | ≥ 0,69 | 0,74 | HEALTHY |
| Let medián D1–D4 | ≤ 22 / 27 / 30 / 35 s | 18,9 / 24,5 / 29,1 / 34,4 | HEALTHY |
| Let P90 / max | ≤ 45 / ≤ 60 s | 34,6 / **77–79** | **CRITICAL** (Hawk 34° a Kite 40° z obsah01) |
| Sucho bez novinky A med / P90 / P90 max | ≤ 3 / 6 / 12 | 4 / 9 / 14 | CONCERNS |
| Sucho bez nákupu ani novinky P90 | ≤ 5 | 3 | HEALTHY |
| Mezi místy med / P90 | ≤ 11 / 17 | 6 / 11 | HEALTHY |
| Poryv + holub mezi QTE D1 / D2 / D3 / D4 | ≤ 95 / 60 / 60 / 60 % | 94 / 78 / 68 / 55 % | CONCERNS (varianty v simulátoru nejsou) |
| Hody mezi nákupy med D1–D4 / P90 | ≤ 1 / 2 / 2 / 2, ≤ 4 | 3 / 2 / 2 / 2, 4 | CONCERNS (D1) |
| Mailbag: příjem ÷ bez (téže kampaň) | ≤ 1,2 | 1,10–1,15 | HEALTHY |
| Mailbag: příjem ÷ běh no-mailbag | ≤ 1,2 | 1,23 | CONCERNS (zkreslené: kampaň s Mailbagem je delší) |
| Mailbag napřed rychlejší o | ≤ 8 % | 0 % | HEALTHY |
| Mailbag III vrácen do finále | ≤ 70 % zbývajících hodů | 0–2 % kampaní vráceno | CONCERNS |
| První kapsa | 20–40 (08) | 41 | bez cíle v t90 (FAIL proti 08, o 1 hod) |
| Zastávky, fronta novinek, varianty událostí, kousky | 05 §7.2 | – | NOT ASSESSED (v simulátoru nejsou, kousky se neladí) |

**Verdikt základny: CRITICAL** (let 77–79 s se starými statistikami Hawka a Kite, Hawk zkracuje D3–D4 na 14 a 11 hodů). Bez toho CONCERNS: kampaň je **42 min / 78 hodů, tedy asi poloviční** proti cíli 90 min.

Další nálezy základny:
- **Mailbag zpomaluje:** `no-mailbag` 72 hodů / 39,7 min proti `realistic` 78 / 42,1. Úroveň III (900 ◈ v D4) se vrátí v 0 % kampaní, úroveň II jen v 30 %. Investice se při dnešní délce D4 (11 hodů) nestihne zaplatit.
- **Hawk 34° dominuje:** koupí ho 97 % kampaní (medián 62. hod), `no-models` je o 13 % hodů pomalejší než `realistic`.

## 3. Páka 1: statistiky modelů podle rozpočtu 01 §2.1

### 3.1 Revize 01 beze změny (sonda, průměrný, „vs lepší“ = lepší z Dartu a Glideru)
Revidovaná čísla z 01 §2.1 nedrží rozpočet: Kite +20–22 % s událostmi (let 33–39 s, 1,27× Glider), Skimmer −10 až −16 %, Sail −7 % (v zadním větru jen −2 až −6 %), Needle −6 až −20 % doletu. Hawk +0–2 %.

### 3.2 Kandidát c3 (`out/90m-models-c3.json`)

| Model | speed / glide / cruise / ideal / qte | Pole | Změna proti 01 |
|---|---|---|---|
| Hawk | 20 / 3,35 / 12 / 18 / 1,05 | perfectK 1,7, missK 0,08 | glide, cruise, qte, perfectK na strop 1,7, missK |
| Kite | 14 / 4,1 / 11 / 30 / 1,15 | liftK 1,2, pushK 0,8 | glide 4,2 → 4,1, liftK 1,5 → 1,2 |
| Skimmer | 20 / 3,1 / 12 / 18 / 1,05 | ground {6 m, ×1,8}, skip +1 | glide, ideal 16 → 18, qte, ground 1,6 → 1,8 |
| Sail | 14 / 4,15 / 11 / 30 / 1,1 | windK 3 | statistiky Glideru, windK 2,5 → 3 |
| Needle | 20 / 3,05 / 14 / 16 / 1,0, drag 0,09 | windK 0,4, droneBurst 3 | glide, cruise, qte, droneBurst 1,5 → 3 |

Sonda c3 (průměrný; pasivně / s událostmi proti lepšímu z D/G; skutečný let):

| Model | konec D1 | konec D2 | konec D3 | plná výbava | Situace (průměrný, s událostmi) |
|---|---|---|---|---|---|
| Hawk | +3 / +4 %, 21,6 s | +3 / +5 % | +3 / +6 % | +4 / +3 % | expert +5–8 %, slabý −1 až +2 %, auto 0 až −7 % |
| Kite | −2 / +6 %, 29,5 s | −1 / +6 % | 0 / +4 % | +2 / +5 %, 34,7 s | let 1,10–1,12× Glider; specialita není situační (viz BLOCKED 1) |
| Skimmer | +4 / +1 % | +4 / +2 % | +4 / +2 % | +4 / −3 % | se Stone Skip +3–7 % |
| Sail | +2 / +2 % | +3 / +3 % | +4 / +2 % | +11 / +5 % | zadní vítr +7–10 %, protivítr −8 až −9 % |
| Needle | −4 / −5 %, 18,2 s | −4 / −4 % | −5 / −7 % | −6 / −10 %, 22,7 s | proti Dartu −1 až −2 % doletu, let −16 až −17 %, ◈/min +10–13 % |

Kampaň c3 (`out/90m-m3*.md`):

| Metrika | Cíl | Základna | c3 | Verdikt c3 |
|---|---|---|---|---|
| Hody / min průměrný | 150–185 / 82–98 | 78 / 42,1 | 90 / 48,3 | CONCERNS (délka) |
| Let max | ≤ 60 s | 77 | 44–48 | HEALTHY (CRITICAL odstraněn) |
| Let medián D4 | ≤ 35 s | 34,4 | 28,2 | HEALTHY |
| `no-models` ÷ `realistic` | – | 90 ÷ 78 | 90 ÷ 90 | modely neutrální k délce (záměr 01 §2.8) |
| Férovost: `no-models` nejvýš o 5 % rychlejší než `models-first` | ≤ 5 % | – | 90 ÷ 108 = **17 %** | CONCERNS (modely jsou na svou sílu drahé, hlavně pozdní) |
| Podíl modelů po koupi (average) | žádný > 45 %, koupený ≥ 10 % | Hawk 18 % | Hawk 34 %, Kite 3 %, Skimmer 1 %, Sail 0 %, Needle 0 % | CONCERNS: Skimmer, Sail a Needle jsou v kampani past (bot je volí jen podle doletu) |
| Expert ÷ průměrný, slabý ÷ průměrný | ≥ 0,69, ≤ 1,35 | 0,74 / 1,13 | 0,76 / 1,21 | HEALTHY |
| Sucho A P90 max kampaní | ≤ 12 | 14 | 18 | CONCERNS |
| Mailbag III vrácen | ≤ 70 % zbývajících hodů | 0 % kampaní | 23 % kampaní | CONCERNS |
| `no-mailbag` ÷ `realistic` (hody) | – | 72 ÷ 78 | 94 ÷ 90 | Mailbag už mírně pomáhá |

**Rozpory v rozpočtu 01 §2.1, které čísla nevyřeší:**
1. **SKILLS průměrný má ≥ 40 % perfektů v 87–93 % letů**, takže „situace Hawka“ je u něj skoro každý let. +15–20 % ve specialitě by porušilo strop realizovaného zisku (D2 ≤ +7 %). Hawk proto nese identitu přes profil (expert víc, auto méně), ne přes situaci.
2. **Kite `liftK` násobí i poryv**, který je téměř v každém letu. Specialita „termika a pára“ je tak obecný přínos (BLOCKED 1).
3. **Sail + Pinwheel úr. 3:** v plné výbavě je zadní vítr v 73 % letů a Sail je nejlepší model u všech profilů (+5–10 %). Pravidlo 01 „windK 1,8 s Pinwheel 3“ simulátor nemá (BLOCKED 2).
4. **Volba modelu `preview` hodnotí jen dolet.** Needle (kratší let, stejný dolet) bot nikdy nevezme, jeho přínos ◈/min se v kampani neprojeví (NOT ASSESSED).

## 4. Páky, které zbývají (nezměřeno, přerušeno)

- **Měřítko cen Dílny a Atlasu:** simulátor nemá `economy.priceScale`. Ze základny c3 (48 min) vychází potřeba zhruba ×1,8–1,9 délky, což je horní okraj odhadu 05 (×1,6–1,9). Ekvivalent jedním číslem pro průzkum: `economy.reward.perMeter` a `base` ÷ s (zdraží vše včetně modelů a Mailbagu). Nespuštěno.
- **Mailbag:** úroveň III se nevrací ani v c3. Zlevnit III (H 26 → ~12–15, tj. ~450 ◈) se dá rozhodnout až po délce D4, protože návratnost závisí na počtu hodů v D4.
- **k modelů:** férovost (17 %) ukazuje, že ceny 01 jsou na sílu c3 vysoké. Zlevnit pozdní modely, nebo je posílit, až bude nová QTE.
- **Sucho bez novinky:** se zdražením poroste (víc hodů mezi novinkami). Bez zastávek, fronty a variant v simulátoru je tahle část cíle NOT ASSESSED a nesmí se dohánět levnějšími cenami (01 §6.1 C bod 4).

**Celkový verdikt kola: CRITICAL pro dnešní `obsah01`** (let 77–79 s), **CONCERNS pro kandidáta c3** (délka 48 min místo 82–98, férovost modelů, Mailbag III, sucho). Velká část 05 §7.2 je NOT ASSESSED (x2, zastávky, fronta, varianty, kousky, měřítko cen).

## 5. Doporučení pro další kolo (po nové mechanice QTE)

1. **Nejdřív přeměřit základnu s novou QTE** (stejné příkazy jako v §1 plus `--profileset x2`). Čísla c3 jsou laděná na dnešní push událostí. Po změně bude potřeba znovu pustit sondu `out/90m-probe-models.mjs.txt` a znovu doladit statistiky. Zachovat princip c3: obecný přínos přes `glide` a `cruise`, `ideal` ≤ 18–30 podle předlohy, perfectK ≤ 1,7.
2. **Přidat měřítko cen jako číslo v params** (game-dev, BLOCKED 3) a délku dohánět až po něm. Pořadí: délka → Mailbag → k modelů (Mailbag i férovost závisí na délce D3–D4).
3. **Volbu modelu v simulátoru doplnit o ◈/min** (nebo strategii „krátké lety“), jinak se Needle nedá ověřit.

## 6. Otevřené volby

BLOCKED 1: **Kite `liftK` platí i pro poryv**, takže specialita není situační (+4–6 % v každém letu). Návrh: `liftK` jen pro páru a termiku (poryv ×1). Příklad: Kite `liftK 1,6` jen na páru a termiku dá podle 01 +15–20 % v letech s nimi (65–85 % letů od D1 se Steam Hop, takže i tak častá situace). Dopad: Kite se odliší od Glideru. Doporučení: rozhodnout spolu s návrhem nové QTE (role událostí), změna `model.mjs` je pro game-dev.

BLOCKED 2: **Sail + Pinwheel úr. 3 je nejlepší sestava u všech profilů.** Návrh: v simulátoru (a ve hře) `windK` u Sail při `noHeadwind` snížit (01: 1,8), jako pole modelu `windKNoHead`. Dopad: splní 01 §6.1 bod 14. Doporučení: game-dev s další dávkou simulátoru.

BLOCKED 3: **Měřítko cen chybí jako jedno číslo.** Návrh: `economy.priceScale` (násobí ceny Dílny, Atlasu a kapes, modely a Mailbag zvlášť přes `k × R`), nebo rovnou násobek čtvrti 3. kola. Příklad: `priceScale 1,85` místo ručního přepisu 5 polí cen. Dopad: páka „délka“ podle 01 §6.1 C bod 4 jde ladit jedním číslem a citlivostí ×0,85 / ×1,15 (05 §7.3 bod 6). Doporučení: zadat game-dev spolu s úpravou QTE.

## 7. NOT ASSESSED
- Sada x2 a lapse (nespuštěno), profily good, weakAssist, auto v kampani (auto jen v sondě).
- Měřítko cen, citlivost 05 §7.3 bod 6, zlevněný Mailbag III, k modelů.
- Zastávky, fronta novinek, varianty událostí, Hejno, vír, lampiony; kousky (neladí se).
- Needle v kampani (bot ho nevolí, viz §3.2 bod 4), Sail s Pinwheel úr. 3 (`windK 1,8`).
- Délka letu bez zrychlení klouzání (`warp.factor=1`).
