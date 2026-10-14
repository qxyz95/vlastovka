# Audit věrnosti simulátoru progrese (fáze F2)

**13. 10. 2026.** Nezávislá kontrola `simulation/progression/` (F1) proti `research/bonusy/08-navrh-kolo2.md` a `06-rozhodnuti.md` podle plánu `09-plan-overeni.md`. Kód jsem prošel řádek po řádku, porovnal se `src/core.js`, `src/events.js`, `src/config.js`, `simulation/monte-carlo.mjs`, a znovu jsem spustil sondy autora 08 ve scratchpadu (`camp2.mjs`, `sim3.mjs`, `final3.mjs`). Vlastní ověřovací skripty jsou tamtéž (`audit-*.mjs`). `src/` ani stávající `simulation/*.mjs` jsem neměnil ani nespouštěl.

## Shrnutí
- **Simulátor je až na tři drobné chyby věrný vzorcům a pravidlům 08.** Pasivní let při π = 1 se shoduje se hrou na 1e-9 (nový test). Platí i „π násobí dolet, ne dobu letu“ (§2.1 závěr 3, nový test).
- **Opravené chyby (3):** přepínač `push.scaleWithPace=false` nemodeloval sondy, předčasný stisk u termiky nedával okraj jádra, cache `bestAngle` nereagovala na změnu fyziky. Ke každé je test. Výchozí výsledky se tím prakticky nemění (průměrný hráč 58 hodů / 31,4 min, předtím 58 / 31,5).
- **Délka hry (58 proti 113 hodům) není chyba simulátoru.** Čísla v 08 §2.6 přesně reprodukuje `camp2.mjs` s cenami 08 (140 / 113 / 95 hodů, 79 / 70 / 62 min). Sonda ale byla mnohem jednodušší než návrh. Oba nálezy stavitele platí, vysvětlují však jen asi čtvrtinu rozdílu: push sond +10 % hodů, šum ×2 (zásah 64 / 79 %) +19 %, dohromady +24 %. Zbytek dělají věci, které sonda neměla: kapsy, zrychlení 1,4×, kluzák, vítr, Pinwheel, Paper Crane, chytrý nákup.
- **Doporučení:** `scaleWithPace = true` (vzorec 08). Profily `SKILLS` nechat jako základ (08 §10.1 bod 7) a přidat k nim povinnou robustní sadu „šum ×2“. Délku hry má F3 doladit čísly (kroky a ceny papíru), ne návratem k sondám.
- **Pět věcí, které rozhodnou F3 nebo uživatel, protože jde o chybu nebo nejasnost v samotném 08** (§5): Dive převádí push událostí na výšku, Paper Crane v D4 táhne skoro vždy, Stone Skip se odrazí vždy, Shooting Star nahrazuje událost (bonus vychází záporně), Packing Tape na úr. 3 dá víc než poloviční zásah páry nebo termiky.

## 1. Tabulka odchylek

Verdikty: **shoda**; **výklad** (08 věc neurčuje, volba je rozumná); **08** (chyba nebo nejasnost v samotném návrhu, simulátor ji věrně přebírá); **chyba sim.** (opraveno v F2).

| # | Položka | 08 | Simulátor | Verdikt | Akce |
|---|---|---|---|---|---|
| 1 | Tempo π | `1+Σ paperStep`, kroky .65/.80/.75/.85 | `pace()`, π = 2,95 / 5,35 / 7,60 / 10,15 | shoda | – |
| 2 | Výhoz | `speed·(1+.14·Power)·(.7+.4·steady)·steep`, `vx·π`, `vy` bez π | totéž, švih ×1,05 od 4. hodu | shoda | test shody se hrou při π=1, test škálování π |
| 3 | `cruise`, `glide` | `·π·(1+β)`, klesání `(vx−vítr)/glide` | totéž | shoda | – |
| 4 | `y0`, `steady`, okna | `12+2·Crane`, `.25·Folds`, `TIMING·(1+.15·Folds)·(Sharp .75)` | totéž; asistence DQ-13 okna ×1,4, šum ×0,6, zpomalení 0,6 | shoda; čísla asistence = výklad | – |
| 5 | Svislý účinek | „jako dnes“ (poryv 2, holub .8/1.1 s) × `model.qte`, neškáluje se | totéž; perfekt poryvu ×1,25 jako dnes; nové události také × `qte` | shoda / výklad | – |
| 6 | Push `Δvx` | `1,5·π·(1+E)·perfekt·S` pro každou událost | podle vzorce, i holub | shoda se vzorcem; **08:** sondy počítaly jinak (§3.1) | přepínač opraven (chyba sim. 1) |
| 7 | Koš E | Folds .2 + Combo + Gull (holub) + úroveň typu, strop 1,5 | totéž; maximum je přesně 1,5, takže strop nikdy neomezí | **08:** strop je s čísly 08 bez účinku. V sondě byly v koši i Echo, Sharp a paušál za typy | F3: snížit strop nebo jej vypustit |
| 8 | Koš β | `min(.5, Momentum·místa + OnAir)` | totéž, místa = `floor(x/305)` | shoda | – |
| 9 | Výtrysky | Starburst, Rocket, Low Pass, samy doznívají, nový přepíše starý | samostatná vodorovná složka `amp·cruise·tvar` mimo relaxaci a klesání; přidán výtrysk páry úr. 3 | výklad | – |
| 10 | Vítr | `w·model.cruise·π·min(1,y/25)`, sada a váhy 1-2-3-3-3-2-1 | totéž (bez β) | shoda | – |
| 11 | Odměna | `10 + floor(dolet/10)` | totéž | shoda | – |
| 12 | Směs událostí | gust 2, bird 2, steam/thermal/drone 1 po odemčení | totéž, žádné 3 stejné za sebou, tutoriál v 1. hodu | shoda | – |
| 13 | Rozvrh | dnes 10 událostí, první v 1,5 s, mezery 3 s a 4–7 s | 12 událostí (kvůli Whistle a dvojicím), jinak jako hra | výklad | – |
| 14 | Plující střed (Z4) | poryv ±0,25 s, holub 0,6–0,95 s, náběh hodů 3–15 | totéž. Bot zná posunutý střed přesně, obtížnost = šum +15 % (`readNoise`, číslo simulátoru) | výklad | F3: citlivost `readNoise` |
| 15 | Odpuštění 0,12 s | stisk do 0,12 s před oknem = okraj okna | poryv, pára, dron, hvězda, puštění holuba OK; **termika: klauzule neměla účinek** (dávala „half“, které padlo i bez ní) | chyba sim. 2 | opraveno, test |
| 16 | Pod 8 m | události nezačínají | čekající událost začne, až bude ≥ 8 m | shoda | – |
| 17 | Steam Hop | 2 obláčky po 0,45–0,6 s, 1 zásah = malý zdvih, oba = push ×1,5; úr. 2 push +30 %, úr. 3 výtrysk +15 % / 2 s | okna obláčků = poryv ×0,6 (08 neuvádí), 1 zásah = zdvih bez pushe; úr. 2 jako +0,3 v E | výklad | F3: šířka oken páry |
| 18 | Thermal | varování 2 s, sloup ~1,3 s, jádro 0,35 s, `Δvy +3`, mimo jádro polovina; úr. 3 40 % druhý sloup | totéž; termika nemá perfekt, takže nespouští Echo | výklad | – |
| 19 | Ad Drone | klepnutí těsně před dotykem, `Δvy 2,5`, push ×1,3; úr. 2 okno +30 %, úr. 3 „občas“ dvojice | dotyk 2 s po začátku, střed 0,12 s před dotykem, okno poryvu, dvojice 35 % | výklad | – |
| 20 | Shooting Star | „jednou za let s pravd. 8/12/16 % přeletí“, Starburst +40 % / 4 s, kombo +2 | **nahradí** jednu z událostí 2.–5.; Starburst (≈0,8 s letu `cruise`) je slabší než poryv, který nahradí | **08 nejasné** (rozvrh hvězdy). Výklad mění znaménko bonusu: úr. 3 = −0,3 % | F3/uživatel: hvězda navíc s krátkou mezerou, nebo silnější Starburst |
| 21 | Kombo (Z5) | úspěch +1, perfekt +2, minutí 0, +5 % / krok, max 3 | totéž; E bere kombo **před** zásahem; částečná pára a termika +1 | shoda / výklad | – |
| 22 | Crowd Chain | 8 %×4 / 10 %×4 / 12 %×5 | totéž | shoda | – |
| 23 | Atlas odemykání a ceny | rekord ≥ začátek místa = úr. 1 zdarma, ceny po čtvrtích, 28 úrovní za 15 000 | totéž (součty ověřeny, Dílna 23 620) | shoda | – |
| 24 | Pinwheel | přetočení 1× / 2× / bez protivětru | bot přetočí vždy při w < 0 | shoda | – |
| 25 | Packing Tape | minutí = 25/40/55 % běžného zásahu, kombo se nuluje | totéž, včetně svislé části, bez komba | shoda; **08:** na úr. 3 dá minutí víc než částečná pára (zdvih 1, push 0) nebo poloviční termika (50 %) | F3: `pushPartial` páry ≥ podíl Tape, polovina termiky ≥ 55 % |
| 26 | Crane Lift, Gull Escort, Momentum, Echo, On Air | čísla karet | totéž | shoda | – |
| 27 | Stone Skip | odraz, když `vx > ½·cruise` | totéž, platí i po pádu ze střemhlavu | shoda; **08:** podmínka platí při klouzání vždy, odraz je ve 100 % letů | F3/uživatel: přísnější podmínka (např. jen voda nebo rychlost nad `cruise`) |
| 28 | Paper Crane | tah přes hranici, když chybí do 3/5/8 % **doletu** | totéž, 1× za let | shoda; **08:** při 4–5 km je 8 % doletu víc než šířka místa (305 m). Výbava D4 má tah v 54 % letů (úr. 1) a ve 100 % (úr. 3), průměrně 150 m | uživatel: počítat z šířky místa, ne z doletu |
| 29 | Glider | speed 14, glide 4, cruise 11, ideal 30, qte 1,15, od 100 m | totéž | shoda | – |
| 30 | Kapsy | 600 / 3 500 (od Red Horizon), max 1 aktivní, Sharp × Calm, výměna zdarma | totéž | shoda | – |
| 31 | Dive | držení: g×3, bez stropu klesání, `vx += 2,4·π·dt`; puštění: `vy = max(vy,0)+.45·(vx−cruise)/π`, `vx = cruise+.6·(vx−cruise)`; Low Pass 2–5 m: .60 a +20 % / 3 s | totéž | shoda; **08:** vzorec bere celý přebytek `vx − cruise`, tedy i push z událostí (§5) | uživatel/F3: přebytek počítat od začátku střemhlavu |
| 32 | Dive bot | DQ-11: po vrcholu > 25 m, pustí v 3,5 m s chybou `N(0,σ)·|vy|` | totéž; ponoří se jen 1× za let (08: bez omezení) | shoda / zjednodušení | – |
| 33 | Cushion, Whistle, Paper Rocket, Sharp Edge, Calm Sky | čísla a politiky botů z karet | totéž. Whistle se dá použít až po skončení fáze efektu (≥ 1 s), ne už 0,3 s po vyhodnocení | shoda / konzervativní výklad | – |
| 34 | Plnění kapes | 08 §5.3 typické volby | `pocketAuto` + záloha `cushion`, `sharp`: slabý dostane do 2. kapsy Sharp (−0,5 %), průměrný Calm (−2 %) | výklad (politika bota) | F3: zálohu nasadit jen při kladném náhledu |
| 35 | Zrychlení (Z2) | 1,4× bez události, další nezačne do 1 s, klesá, náběh 0,3 s | totéž, ne při Dive | shoda | – |
| 36 | Čas | let + 8 s UI + 4 s za kartu čtvrti | totéž (karta se započte do čtvrti, kterou hráč opouští). U3 (zpomalení u nové události) chybí | shoda / zjednodušení | – |
| 37 | Vyvážený nákup | „nejlevnější vzhledem k přínosu“, sonda: cena / (3 u papíru, jinak 1) | nejvyšší náhled U1 na minci (přehraje poslední hod) a šetří na něj | výklad. Důsledek: vyvážený hráč nakupuje skoro optimálně, takže „Paper napřed“ nemůže být rychlejší a kontrola §10.2 nic nehlídá | F3: přidat realistického „vyváženého“ (např. podle sondy) jako referenci |
| 38 | Paper / Atlas napřed | kontrolní strategie | šetří na papír, resp. nejlevnější úroveň Atlasu, jinak `balanced` | výklad | – |
| 39 | Metrika sucha | „hodů bez nového místa ani koupě“ | medián jen z nenulových sérií; novinka = místo, Glider, koupě | výklad (přísnější) | – |
| 40 | První kapsa | medián | medián jen z kampaní, které kapsu koupily | výklad | hlásit i podíl kampaní bez kapsy |
| 41 | Atlas na úr. 3 | 3–15 % doletu | plná výbava s bonusem a bez něj, jen průměrný hráč, bias 0 | výklad | – |
| 42 | Strop E/β „zasažen“ | podíl letů | `raw > strop` (strop skutečně omezil) | výklad | – |
| 43 | Profily | „dnešní SKILLS + asistence“ (§10.1 bod 7); sondy 08: zásah 40 / 70 / 90 % | `SKILLS` beze změny, zásah 88 / 96 / 96–98 / 96–100 % | shoda s §10.1; **08:** vnitřní rozpor (cíle odvozené ze sond s jinými profily) | §3.2 |
| 44 | RNG | oddělené streamy | `launch`, `wind`, `events`, `plan`, schopnosti, `campaign`, `bias`. CRN napříč strategiemi drží: náhled i výbava nemění náhodu hodu | shoda | – |
| 45 | Cache `bestAngle` | – | klíč neobsahoval `P.physics` ani `P.atlas.crane`, takže po `setParams` v témže procesu vracel staré úhly | chyba sim. 3 | opraveno, test |

## 2. Opravené chyby simulátoru

1. **`push.scaleWithPace=false` nemodeloval sondy.** README tvrdí, že sondy měly „základ bez π, π-násobek jen u přírůstku z E“, ale `false` vypnul π u celého pushe včetně E. Tím se v pozdní hře znehodnotily Folds, kombo i bonusy Atlasu, a varianta tak neodpovídala ničemu z 08. Nově: `Δvx = 1,5·((scale ? π : 1) + π·E)·…`. Výchozí `true` zůstává beze změny. Test `push modes`. Jediný zbývající rozdíl proti sondám je, že holub má push i ve variantě `false`.
2. **Termika: předčasný stisk před jádrem.** Klauzule odpuštění (Z4) byla ve větvi „half“, kde nic neměnila, protože taková chvíle leží vždy uvnitř sloupu. Teď dá úspěch (okraj jádra), stejně jako u ostatních událostí. Test `early tap before the thermal core`.
3. **Cache `bestAngle`.** Klíč teď nese i `P.physics` a `P.atlas.crane`. Bez opravy by citlivost na `y0`, gravitaci nebo `steepPenalty` v jednom procesu počítala se starými úhly. Test `best-angle cache follows changed physics`.

Nové kontrolní testy bez opravy: shoda pasivního letu se hrou při π = 1 a škálování doletu přes π beze změny doby letu. `npm test`: 47/47.

## 3. Hlavní nálezy stavitele

### 3.1 Push × π: co myslí 08 a co dělaly sondy
- **08 §2.3** říká výslovně `Δvx = 1,5·π·(1+E)·perfekt·S` pro každý zásah. **Sondy** (`sim3.mjs`, ze kterého vychází `final3` i `camp2`) to tak nepočítaly. Poryv dával dnešní `HELP.gustX = 1,5 · qte · perfekt` bez π. Holub dával jen držení výšky a `vx = max(10, vx)`, tedy žádný push. Navíc se přičítalo `1,5·π·pool·perfekt`, kde `pool` = Folds + kombo + Echo + Gull + paušál +0,1 za každý nový typ události + Sharp 0,4. Nové události ve směsi vůbec nebyly. Nález 1 stavitele tedy platí.
- **§2.6 reprodukují sondy přesně**, ale jen s cenami 08 (ve výchozím nastavení `camp2.mjs` má dražší ceny a dá 141 hodů). Spuštěno: `PB=[40,120,260] NP=[ceny 08] AB=[50,200,450,750] STRAT=value N=8` → 140 / 113 / 95 hodů a 79 / 70 / 62 min, shodně s tabulkou. Sonda ale měla: jen šipku, žádné kapsy, žádné zrychlení klouzání (minuty jsou simulovaný čas), žádný vítr, Pinwheel, hvězdu ani Paper Crane, zásah jako pravděpodobnost (40 / 70 / 90 %, perfekt 10 / 30 / 55 %), přesně nejlepší úhel bez učení a nákup podle `cena / (papír 3, jinak 1)`.
- **Rozklad rozdílu** (simulátor, `balanced`, 20 kampaní, `audit-decomp*.mjs`):

| Varianta | slabý | průměrný | expert | plná výbava, průměrný |
|---|---|---|---|---|
| A výchozí (vzorec, SKILLS, kapsy auto) | 74 h / 37 min | **58 h / 31 min** | 48 h / 27 min | 6 872 m |
| B push sond | 78 / 42 | 64 / 36 | 55 / 32 | 6 545 m |
| C SKILLS, šum QTE ×2 (zásah 64 / 79 / 96 %) | 81 / 42 | 69 / 37 | 53 / 30 | 6 453 m |
| D = B + C | 88 / 46 | 72 / 40 | 56 / 34 | 6 171 m |
| E = D bez kapes, zrychlení 1,0 | 95 / 55 | 78 / 46 | 55 / 35 | – |
| F = E jen šipka | 102 / 55 | 81 / 45 | 58 / 35 | – |
| G = F bez větru, Pinwheelu, hvězdy, Paper Crane, švihu, 10 událostí | 111 / 59 | **84 / 47** | 62 / 38 | – |
| sonda 08 (`camp2`) | 140 / 79 | **113 / 70** | 95 / 62 | 5 432 m (`final3`) |

- **Závěr:** Push sond prodlouží hru asi o 10 % hodů a o 5 % zkrátí dolet plné výbavy. Hlavní páka to tedy není. Zbylých ~30 hodů mezi G a sondou dělá model zásahu (40 % u slabého) a hloupější nákup v sondě. Čísla §2.4 a §2.6 jsou tedy výstup zjednodušené sondy, ne vlastnost návrhu. Cíle §10.2 platí dál jako designové cíle a F3 je má splnit laděním.
- **Doporučení `scaleWithPace = true`.** (1) Je to výslovný vzorec 08 a §10.1 ho chce v simulátoru. (2) π je čisté zrychlení vodorovného pohybu. S π-pushem má událost ve všech fázích stejnou relativní váhu, takže šikovnost a bonusy událostí platí „středně“ po celou hru. S pushem sond klesne základ v D4 na ~1 % `cruise` (1,5 proti 110 m/s) a událost má cenu jen přes E, což je zvláštní pobídka: bonusy by násobily něco, co samo nic nedělá. (3) Sondy přitom daly holubovi push nulový, což vzorci odporuje. (4) Rozdíl ve výsledku je malý. Délku hry má dorovnat Paper (kroky a ceny), ne push. Variantu `false` nechat jen jako citlivost.

### 3.2 Profily dovednosti
- **`SKILLS`** (`monte-carlo.mjs`, `MONTE-CARLO.md`) jsou model čistého šumu časování: poryv `N(bias, σ)` kolem středu, holub reakce + výdrž, bias `N(0, σ/2)` na hráče. Ve hře 0.6.1 dávaly zásah 82 / 96 / 100 / 100 % a samo `MONTE-CARLO.md` je označuje za „spíš optimistické“. V simulátoru 08 jsou okna navíc širší (Folds +15 %/úr., odpuštění 0,12 s), takže zásah stoupne. Plující střed přidá jen +15 % šumu, protože bot zná posunutý střed přesně.
- **Naměřený zásah v simulátoru** (`audit-hits.mjs`, n = 20, 300 letů; „zásah“ zahrnuje i částečnou páru a poloviční termiku):

| Profil | D1 (Folds 1) | D3 | plná výbava | perfekt (D1 / plná) |
|---|---:|---:|---:|---:|
| slabý | 79 % | 91 % | 88 % | 33 / 29 % |
| průměrný | 95 % | 98 % | 96 % | 50 / 44 % |
| dobrý | 100 % | 100 % | 98 % | 69 / 59 % |
| expert | 100 % | 100 % | 100 % | 94 / 75 % |

  Kalibrace průměrného (šum σ → zásah D1 / plná): 0,20 → 85 / 91 %, 0,25 → 76 / 86 %, 0,30 → 70 / 82 %, 0,40 → 56 / 73 %, 0,60 → 38 / 58 %.
- **Profily sond 40 / 70 / 90 %** nejsou kalibrace. Jsou to předpoklady převzaté z botu `core.simulate` (pravděpodobnost zásahu). 40 % u slabého by při oknech ±0,28 s chtělo σ ≈ 0,6 s, tedy téměř náhodné klepání. Takový hráč by hru nehrál, a to 06 („slabší hráč musí dojít do cíle“) nemyslí.
- **Realističnost:** čistý motorický šum u viditelného cíle bývá u lidí desítky milisekund, takže σ 0,14–0,22 s je spíš štědré k chybám. Skutečná minutí ale přicházejí hlavně z nepozornosti, nepochopení (držení holuba), latence dotyku a ze čtení plujícího středu. To `SKILLS` nemodelují vůbec. Pravda je proto někde mezi: průměrný hráč spíš 80–90 % než 96 %.
- **Doporučení pro F3:**
  1. Základ ladění = `SKILLS` (08 §10.1 bod 7, jediné profily navázané na skutečná okna).
  2. Povinná **robustní sada „šum ×2“** (`profiles.*.qte` ×2: 0,44 / 0,28 / 0,18 / 0,10 → zásah 64 / 79 / 89 / 96 %; běh `out/smoke-f2-hard.md` má navíc push sond, čísla Whistle, Dive a Tape níž jsou z něj). Tvrdé cíle §10.2 (slabý do 250 hodů, slabý ≤ 1,4× průměrného, žádný let > 60 s, pády Dive, sucho max ≤ 8) musí platit v obou sadách. Pásma délky (hody a minuty na čtvrť) ladit tak, aby `SKILLS` byly v dolní polovině a „šum ×2“ v horní polovině pásma. Rozdíl mezi sadami je ~20 % hodů, takže se to vejde.
  3. Zvážit (návrh, ne oprava) parametr „výpadek pozornosti“: pravděpodobnost, že hráč na událost nezareaguje vůbec. Šum ×2 totiž zhoršuje i boty schopností (Dive v „šum ×2“ padá u průměrného ve 28 % a vychází −6 %), což je možná přehnané.
- **Na profilech závisí i další nálezy stavitele:** Whistle +15–22 % (SKILLS) klesne při šumu ×2 na +5 / +10 / +14 / +18 %, takže riziko pro slabého (08 S3) se objeví až s horšími profily. Packing Tape přidá 0,4 % (SKILLS) proti 2,6 % (šum ×2).

## 4. Ostatní nálezy stavitele (ověřeno)
- **Strop E se nikdy nezasáhne:** pravda. S čísly 08 je maximum přesně 1,5 (Folds 0,6 + Chain 3 0,6 + vlastní úroveň 0,3), viz #7. **Strop β skoro vždy:** jen v plné výbavě (Momentum 3 0,40 + On Air 0,16). V kampani je to 0 %, protože On Air přijde až na 4 267 m. Metrika §10.2 (podíl letů kampaně) je splněna.
- **Dive vydělává i při vysokém vybrání:** pravda, ale z jiného důvodu, než tvrdí README. Pasivní let (výbava D3, bez událostí, `audit-dive.mjs`): vybrání ve 20 / 12 / 8 m dá +2 / −1 / −3 %, nízký průlet +5 %. To je správně neutrální, protože přebytek `vx` při omezeném klesání dolet z výšky nezvětší. S událostmi dá vybrání ve 12 m +11 %, s `push.base = 0` −0,8 %. Zisk tedy pochází z toho, že puštění převádí push událostí (je součástí `vx − cruise`) na výšku (`.45·ex/π`) a k tomu vynuluje záporné `vy`. Chyba je ve vzorci 08 (#31), ne v kódu.
- **Steam Hop a Thermal snižují dolet** (−1,2 / −1,5 % na úr. 3): pravda. Ve směsi nahrazují poryvy a holuby, termika navíc trvá déle (varování 2 s) a pára má úzká okna, přičemž částečný zásah nemá push. Holub je v pozdní hře nejsilnější událost (výdrž × rychlost). Jde o ladění F3 (#17, #18).
- **Atlas na úr. 3:** Chain 1 %, Tape 0,4 %, hvězda −0,3 %, dron 0,9 %, Momentum 15,7 %, Skip 7,7 %. Hvězda je záporná kvůli výkladu #20, Tape a Chain kvůli vysokému zásahu `SKILLS`.

## 5. Otázky pro F3 a uživatele
**Uživatel (mění mechaniku):**
1. **Dive:** počítat přebytek pro vybrání jen z rychlosti získané střemhlavem (od začátku Dive), ne z celého `vx − cruise`? Jinak Dive přidává i bez nízkého průletu a pravidlo §10.2 „vysoké vybrání ±2 %“ nejde splnit.
2. **Paper Crane:** dosah počítat ze šířky místa (např. 3 / 5 / 8 % z 305 m ≈ 9 / 15 / 24 m), ne z doletu? Dnes v D4 táhne ve 100 % letů (úr. 3).
3. **Stone Skip:** přísnější podmínka (dnes se odrazí ve 100 % letů)?
4. **Shooting Star:** má být navíc (krátká mezera, nevytlačí událost), nebo zůstat na místě jedné události a mít silnější Starburst?
5. **Strop E:** snížit (např. 1,0), nebo vypustit, když s čísly 08 nic neomezuje?

**F3 (jen čísla nebo boti):**
6. Profily: ladit na `SKILLS` a hlídat sadu „šum ×2“ (§3.2). Případně přidat výpadek pozornosti.
7. `scaleWithPace = true`, délku hry dorovnat kroky a cenami papíru (dnes 58 hodů / 31 min proti cíli 25–35 + 3× 20–30 hodů a 50–75 min).
8. Šířka oken páry (dnes ×0,6), `pushPartial` páry a polovina termiky proti Packing Tape (#25).
9. Realistický „vyvážený“ nákupčí jako reference pro kontrolu „Paper napřed ≤ 10 %“ (#37). Atlas napřed je o 60–85 % pomalejší, protože ceny Atlasu (15 000) šetření na papír brzdí.
10. Záloha kapes bez škodlivých voleb (#34), Dive bot vícekrát za let (#32), `readNoise` plujícího středu v citlivosti (#14).
11. Ve „šum ×2“ má slabý hráč sucho až 19 hodů (cíl ≤ 8).

## 6. Běhy a soubory
- `out/smoke-f2.md` / `.json`: kouřový běh po opravách, stejný rozsah jako F1 (6 profilů × balanced / paper-first / atlas-first × 20 kampaní + sondy). Proti F1 (`out/smoke.md`) jsou výsledky v rámci šumu stejné: průměrný 58 hodů / 31,4 min, slabý 74 / 37,1, expert 48 / 27,0. Cíle §10.2 dopadají stejně jako v F1: délka hry FAIL, délka letu OK, Atlas a Dive FAIL.
- `out/smoke-f2-hard.md` / `.json`: robustní sada „šum ×2“ + `scaleWithPace=false` (4 profily, balanced, 20 kampaní): průměrný 71 hodů / 39,9 min, slabý 88 / 46,0, expert 56 / 33,5.
- Ověřovací skripty ve scratchpadu relace: `audit-hits.mjs` (zásah a kalibrace), `audit-decomp.mjs` a `audit-decomp2.mjs` (rozklad délky hry), `audit-dive.mjs` a `audit-dive2.mjs` (Dive), `audit-crane.mjs` (Paper Crane a Stone Skip), `audit-steam.mjs` (vyhodnocení páry a termiky).
