# Simulátor progrese (fáze F1, audit F2 v `AUDIT.md`, ladění F3 a F5 v `REPORT.md`)

Monte Carlo model návrhu `research/bonusy/08-navrh-kolo2.md` (Workshop + Atlas + Pockets) podle plánu `09-plan-overeni.md`. Hra se nemění. Ze `src/` se importuje jen to, co zůstává: `random.js`, `TIMING`, `DT`, `GRAVITY`, `STEEP_PENALTY`, dnešní Dart z `MODELS`, `throwSettings`, trasa (`SCREEN_METERS`, `ROUTE`). Výstupy jdou jen do `out/`. Založeno 13. 10. 2026.

## Soubory
- `params.mjs`: **všechna laditelná čísla** (ceny, kroky papíru, síla bonusů, stropy košů, váhy a okna událostí, vítr, schopnosti, zrychlení, čas UI, profily, boti, výbavy křivky, cíle §10.2). `setParams(over)` je přepíše na místě, `parseSet('a.b=1')`.
- `model.mjs`: let 1.0 (π, β, výtrysky, push E se stropem, S, `y0`, vítr se střihem, švih), rozvrh a vyhodnocení událostí (gust, bird, steam, thermal, drone, star, plující střed, odpuštění předčasného stisku, pravidlo pod 8 m), kombo a bonusy Atlasu za letu (Crowd Chain, Packing Tape, Gull Escort, Echo, Momentum, On Air, Stone Skip, Paper Crane, Pinwheel, Crane Lift, Shooting Star), mechanika schopností, QTE bot hráče, skutečný čas se zrychlením klouzání, `bestAngle`.
- `abilities.mjs`: boti Dive, Cushion, Whistle, Paper Rocket s chybou časování podle profilu. `throwOnce(kit,ctx)` = hod s boty podle nasazených kapes.
- `campaign.mjs`: kampaň po místech až do 4 876 m: odemykání, druhy papíru po čtvrtích, kapsy 600 / 3 500, speciály po čtvrtích, strategie `balanced` / `paper-first` / `atlas-first` / `cheapest` / `random`, volba kapes, volba modelu, učení úhlu, měření času.
- `run.mjs`: CLI, paralelní workery, souhrny, křivka, sondy, citlivost, OK/FAIL proti cílům.
- Testy: `tests/progression.test.js`, `tests/progression-campaign.test.js` (běží v `npm test`).

## Spuštění
```
node simulation/progression/run.mjs --n 20 --out smoke
node simulation/progression/run.mjs --profiles weak,average,good,expert,weakAssist,auto --strategies balanced,paper-first,atlas-first,cheapest,random --n 200 --out base
node simulation/progression/run.mjs --profiles average --pockets cushion,sharp,dive,calm,whistle,rocket --n 200 --out pockets   # matice B22
node simulation/progression/run.mjs --params tuning.json --set warp.factor=1 --sensitivity --out sens
node simulation/progression/run.mjs --profileset x2 --strategies realistic,paper-first,atlas-first --n 200 --out base-x2   # sada „šum ×2“
```
`--profileset skills|x2|lapse` vybere sadu profilů (`PROFILE_SETS` v `params.mjs`): `skills` = SKILLS beze změny, `x2` = šum časování ×2 (povinně hlídaná sada), `lapse` = SKILLS + výpadek pozornosti (informativně).
Přepínače: `--profiles`, `--strategies`, `--pockets` (čárkou varianty, `+` spojuje kapsy: `dive+sharp`; `auto` = podle profilu z `bots.pocketAuto`, `none` = bez kapes), `--models better|dart|glider`, `--n` kampaní na skupinu, `--seed`, `--params soubor.json` (hluboké sloučení, pole se nahrazují), `--set cesta=hodnota` (opakovatelné), `--sensitivity` (varianty 08 §10.3), `--no-probes`, `--probe-n` letů na buňku sond, `--workers`, `--raw` (do JSON i surové kampaně), `--out` jméno výstupu. Výstup: `out/<jméno>.md` a `.json`.

Determinismus: klíč kampaně = `seed|profil|id`, takže strategie i kapsy se srovnávají na stejné náhodě (CRN). Streamy jsou oddělené a pojmenované: `launch` (síla, úhel), `wind`, `events` (rozvrh), `plan` (šum hráče pro každou událost zvlášť), `dive`/`cushion`/`rocket` (chyba schopnosti), `campaign` (náhodná strategie, zkoušení modelu), `bias`. Náhled koupě (U1) proto přehrává stejný hod se stejným šumem.

## Co je modelováno
- **Let:** dnešní arkádová fyzika (relaxace k `cruise`, strop klesání `vx/glide`) s π na výhozu, `cruise` i `glide`, β na `cruise` a `glide`, Power .14, Folds (odpuštění .25, okna +15 %, push +20 %), přeladěný Glider, `y0 = 12 + 2·CraneLift`, vítr `w·cruise·π·min(1,y/25)` s vahami 1-2-3-3-3-2-1, švih ×1,05 od 4. hodu.
- **Události:** směs gust 2 / bird 2 / steam 1 / thermal 1 / drone 1 (nové jen po odemčení), žádné 3 stejné za sebou, rozestupy jako dnes (×1,6 Calm Sky), plující střed s náběhem hodů 3–15, odpuštění 0,12 s, vodorovný push `1,5·π·(1+E)·perfekt·S·typ`, svislá část pevně × `model.qte`.
- **Atlas:** všech 14 bonusů s úrovněmi + Glider (100 m) + Encore (bez účinku). Úr. 1 zdarma doletem na začátek místa, úr. 2–3 za ceny čtvrti.
- **Kapsy:** 2 sloty, max 1 aktivní, Sharp Edge × Calm Sky, výměna zdarma (bot nasadí podle plánu kapes, jinak záloha `cushion`, `sharp`).
- **Čas:** simulovaný let, skutečný (klidné klouzání 1,4× s náběhem 0,3 s, ne při držení Dive), +8 s UI na hod, +4 s za kartu čtvrti (3 karty: D2, D3, D4). Asistence DQ-13 počítá zpomalení 0,6× ve varování a interakci.
- **Profily:** dnešní `SKILLS` (`weak`, `average`, `good`, `expert`) + `weakAssist` (DQ-13: okna ×1,4, šum ×0,6, zpomalení) a `auto` (DQ-14: každá událost úspěch ve středu, nikdy perfekt).

## Zjednodušení
- Hráč neřeší U3 (zpomalení a širší okno při prvním setkání s událostí), kalibraci (DQ-15) ani „Undo“.
- Učení úhlu: hráč dostane po hodu nápovědu jako dnes `angleHint` (do 3° sedí, jinak krok 3°, nad 8° krok 6°) proti pasivnímu `bestAngle` s mřížkou 1° a sílou zaokrouhlenou na 0,05. Nezačíná náhodným hledáním.
- Volba modelu „better“: porovná poslední dolety obou modelů, s pravděpodobností 15 % zkusí druhý (jako dnešní MC).
- Strategie `balanced` vybírá nejvyšší náhled U1 na minci: přehraje poslední hod (`bots.previewThrows`) s danou koupí. Na nejlepší volbu šetří (E09 „to go“) a cíl přepočítá až po koupi nebo změně nabídky. Náhled jednoho hodu je šumivý, hlavně u bonusů událostí.
- `paper-first` a `atlas-first`: když je papír / úroveň Atlasu v nabídce, šetří na ni (Atlas nejlevnější první), jinak se chovají jako `balanced` (sonda `camp2` padala na „nejlevnější“).
- Novinka pro metriku sucha = nové místo, odemčení Glideru nebo koupě po hodu. „Úrovně v cíli“ = koupené placené úrovně Dílny a Atlasu ze 46 (bez kapes).
- Cap letu 180 s simulovaného času (`timeout` ve statistice). Žádná sonda ho nezasáhla.

## Odchylky a výklady (kde je 08 nejasné)
1. **Push u základní události škáluje s π** přesně podle vzorce §2.3 (`Δvx = 1,5·π·(1+E)…`). Sondy `sim3/final3` měly základní push poryvu 1,5 bez π a holub žádný push, π-násobek měl jen přírůstek z E. Proto jsou dolety v pozdní hře vyšší než v tabulce §2.4 (plná výbava ~6,9 km místo 5,4). Přepínač `push.scaleWithPace`: `true` = vzorec, `false` = varianta sond (základ 1,5 bez π, přírůstek z E × π; opraveno v F2, dřív `false` vypnul π i u E). Holub má push i ve variantě `false` (sondy ho neměly). Viz `AUDIT.md`.
2. **Push platí pro všechny typy událostí** (i holub). Holub navíc drží výšku (`carry`) a `vx = max(10, vx)` jako dnes.
3. **Kombo v E** se bere ze stavu *před* zásahem (pátý zásah dostane bonus za předchozí čtyři). Pára jedním obláčkem a termika mimo jádro dají kombo +1, hvězda +2, minutí nuluje.
4. **Steam Hop:** obláček 1 v 1,3 s od začátku (0,5 s po varování), obláček 2 o 0,45–0,6 s později, okna = okna poryvu × 0,6 (08 je neuvádí). Jeden zásah = jen zdvih 1·qte bez pushe, oba = zdvih 2·qte a push ×1,5, oba perfektní = perfekt. Úr. 2: E +0,30, úr. 3: výtrysk +15 % na 2 s po dvou perfektních.
5. **Thermal:** varování 2 s, sloup ±0,65 s kolem jádra, jádro ±0,175 s × okna Folds/Sharp (sloup se neškáluje). Jádro = úspěch (Δvy 3, push ×1), sloup = poloviční účinek. Termika nemá perfekt, takže nespouští Echo. Úr. 3: 40 % šance na druhý sloup 0,3 s po prvním.
6. **Ad Drone:** dotyk 2 s po začátku, střed okna 0,12 s před dotykem, okna poryvu (úr. 2 ×1,3), po dotyku = minutí. Úr. 3: 35 % šance na druhý dron (0,2 s po prvním). Výška dronu se nemodeluje.
7. **Shooting Star:** jednou za let s pravděpodobností úrovně, zabere jedno z míst 2.–5. ve frontě událostí. Okno = 2× perfektní okno poryvu (±0,2 s), každý zásah = Starburst (+40 % `cruise` lineárně doznívající 4 s) a kombo +2. Packing Tape se na hvězdu nevztahuje.
8. **Výtrysky** jsou zvláštní vodorovná složka `amp·cruise·tvar(věk)` mimo relaxaci a mimo klesání (tvar `exp` τ pro Paper Rocket, `linear` pro Starburst, `flat` pro Low Pass a páru). Nový výtrysk přepíše starý. β naopak mění `cruise` a `glide` přímo podle vzorce, takže se do rychlosti promítá pomalu (drag 0,12).
9. **Packing Tape** dá při minutí podíl účinku běžného úspěchu včetně svislé části, push bez komba (kombo se nuluje).
10. **Pinwheel:** bot přetočí pokaždé, když padne protivítr (úr. 1: 1×, úr. 2: 2×, úr. 3: 2× a nový los jen z nezáporných).
11. **Stone Skip** platí pro každý dopad včetně pádu ze střemhlavu. Úr. 3 = dva odrazy s ×0,45. Podmínka `vx > 0,5·cruise` (aktuální `cruise` s β).
12. **Paper Crane** se uplatní jednou za let na konečném dopadu: když chybí do další hranice místa ≤ 3 / 5 / 8 % doletu, přenese vlaštovku 1 cm za hranici. Platí i za cílem trasy.
13. **Momentum** počítá místa přeletěná v tomto letu jako `floor(x/305)`. On Air platí, dokud kombo ≥ 3.
14. **Švih:** zóna ±90 ms kolem vrcholu 1,15 s = `charge ≥ chargeAt(1,06)` ≈ 0,985. Síla hodu je normální rozdělení oříznuté na [0, 1], takže hod „na doraz“ se počítá jako švih (expert ~20 %, průměrný < 1 %).
15. **Odpuštění předčasného stisku** podle 08 Z4 (stisk do 0,12 s před oknem = okraj okna = úspěch), ne podle původní DQ-18 (ignorování). U holuba platí pro předčasné puštění.
16. **Dive:** bot se ponoří jednou za let po vrcholu nad 25 m a pustí v cílové výšce 3,5 m s chybou `ε·|vy|`, `ε ~ N(bias, qte)` (DQ-11). Událost čeká na držený Dive nejvýš 2 s, pak se vlaštovka sama vybere. Low Pass místo „řetěz +1“ z DQ-11 dává podle 08 výtrysk +20 % na 3 s.
17. **Cushion** (DQ-12): bot klepne v 0,6 m s chybou `ε·|vy|`. Pásma 0–1 / 1–2,5 / 2,5–6 m. Klesání 0 = `vy` se drží na 0 bez gravitace.
18. **Whistle:** bot píská, když nic neběží, kombo ≥ 2 a výška ≥ 8 m. Další událost začne hned (běžné varování 0,8 s).
19. **Paper Rocket:** vystřelí, když odhad dopadu `x + y·glide` končí do 8 % před hranicí místa, jinak nízko nad zemí (2,5 m × zbývající náboje + chyba). Výtrysk `vx += cruise` s τ 1,5 s.
20. **Klidné klouzání** pro zrychlení: žádná událost (ani efekt), další nezačne do 1 s, vlaštovka klesá a nedrží Dive.
21. **Hranice čtvrtí a míst:** místo k začíná v `(k−1)·304,76 m`, čtvrť d v `d·1 219 m`. Druhý druh papíru se otevře rekordem ≥ 1 219 m (první dolet do Moon Docks), kapsa 2 a Whistle/Rocket od Red Horizon.
22. **Rozvrh událostí** se generuje dopředu pro 12 událostí (dnes 10), aby se vešly Whistle, druhá termika a dvojice dronů.

## Nálezy z F1 (pro F3, nic se neladilo)
- **Strop E (+150 %) je nedosažitelný:** maximum je Folds 0,6 + kombo 0,6 (Crowd Chain 3) + vlastní úroveň 0,3 = 1,5. Strop β (+50 %) se v plné výbavě zasáhne téměř v každém letu (Momentum 3 až 0,40 + On Air 0,16), v kampaních ale málo, protože plná výbava přichází až na konci.
- **Dive podle vzorce 08 přidává i při vysokém vybrání** (pasivní let bez událostí, výbava D3: vybrání ve 20 m +10 %, nízký průlet +15 %). Konverze `.45·(vx−cruise)/π` plus ponechaných 60 % přebytku, který doznívá pomalu (drag 0,12), je výhodnější než klouzání stejnou výškou.
- **Steam Hop a Thermal na úr. 3 dolet nepřidávají** (−1 až −2 %), protože ve směsi nahrazují poryvy a holuby a jejich poloviční výsledky mají menší push.
- Kouřový běh viz `out/smoke.md`. Hra vychází asi o polovinu kratší než cíl (průměrný ~58 hodů / 32 min místo 113 / 50–75 min). Příčiny: bod 1 výše (push × π) a profily `SKILLS`, které trefují 88–96 % událostí, zatímco sondy 08 počítaly se 40 / 70 / 90 %.

## Změny ve fázi F3 (ladění, 13. 10. 2026)
Podrobně v `research/bonusy/10-ladeni.md`, výsledky v `REPORT.md`. Výchozí `params.mjs` je doladěná sada, čísla z 08 jsou v `out/params-08.json`.
- **Opravy mechanik 1–5 z `06`:** (1) Dive převádí při vybrání jen rychlost nabranou střemhlavem (`dive.gain`, doznívá stejně jako `vx`) a `vy` se vrací nejvýš na hodnotu ze začátku ponoření (`specials.dive.fromDiveOnly`); původní `max(vy,0)` dělalo z ťukání vznášení. (2) Paper Crane: dosah = podíl šířky místa (9 / 15 / 24 m). (3) Stone Skip: první odraz jen při efektivní vodorovné rychlosti (vč. výtrysku) nad `skip.minVx·cruise`, další odrazy úr. 3 s `chainVx`. (4) Shooting Star je událost navíc: vloží se před běžnou událost a běžný rozvrh po ní pokračuje od konce předchozí události (`star.gap`, `star.after`). (5) Strop E zůstává jako pojistka (2,0).
- **Hráč a boti:** výpadek pozornosti `profiles.*.lapse`; Dive bot až 3× za let (`bots.dive.maxUses`); Pinwheel bot přetáčí, když je nový los v průměru lepší; záložní speciál do kapsy jen při kladném náhledu (`bots.fallbackThrows`); náhled koupě kapsy ukáže hod s tím, co by do ní hráč nasadil.
- **Strategie `realistic`** (referenční nákupčí, `targets.reference`): náhled U1 vidí, ale přínos na minci odhaduje s log-normální chybou (`bots.realistic.noise`), na vybranou věc čeká nejvýš `patience` hodů, papíru dává váhu 1,25 (preference viditelného). `paper-first` a `atlas-first` se mimo svou prioritu řídí `campaign.fallback` (= `realistic`).
- **Metriky:** podíl letů se Stone Skip (`targets.skipRate`), zisk Atlasu i pro slabého, kontrola „každý speciál nejlepší aspoň jednou“, citlivost i na `readNoise`, push sond a model nákupčího.

## Rozhodnutí 14. 10. 2026: kampaň a měření (I2 z `research/bonusy/11-plan-implementace.md`)
- **Papír doletem na místo:** druh k+1 je v nabídce od rekordu ≥ začátek místa `(k−1)·perDistrict + workshop.paper.openAtPlace` (`paperTiers(best)` v `campaign.mjs`; 3 = Kraft od 610 m, 5 = hranice čtvrti jako v F3). Kapsa 2, speciály a karty čtvrtí dál podle čtvrti.
- **Metriky Atlasu:** Paper Crane jen hlášení (podíl letů s tahem v sondě, v kampani `craneTugRate` a `craneNewPlace` = podíl tahů, které přenesly rekord na dosud neobjevené místo). Shooting Star `starProbe`: stejný hod s hvězdou úr. 3 a bez ní jen v letech, kde je hvězda v rozvrhu, cíl `targets.starInFlight ?? 3 %`. Packing Tape u slabého, cíl `targets.tapeWeak ?? atlasBonus`. Ostatní bonusy 3–15 % u průměrného.
- **Sucho:** `summarize` hlásí `droughtMaxP90` (P90 maxim kampaní), `checks` porovnává maximum podle `targets.droughtStat` (`'p90'` / `'max'`).
- **Citlivost:** řádky s přepínači na chování F3 (`openAtPlace 5`, `thermal.perfect 0`, `dive.maxSink null`, `whistle.window 1`). Testy v `tests/progression-campaign.test.js`.

## Ladění F5 (14. 10. 2026)
Přeladění čísel po rozhodnutích 14. 10. Podrobně v `research/bonusy/12-ladeni2.md`, výsledky v `REPORT.md` (F3 tam zůstává jako historie). Výchozí `params.mjs` je sada F5 (snímek `out/f5-params.json`), sada F3 je v `out/params-f3.json`, výchozí stav po změnách pravidel s čísly F3 v `out/f5-start-*`.
- Kraft levný a slabší (500 / 800 / 1 100, krok .45), Washi .70 a Neon Foil .85 dražší (2 800–4 400 a 3 200–4 400). π plné výbavy zůstává 8,86.
- Atlas D3 a D4 500 / 1 000, slabší Momentum a Echo, Crowd Chain úr. 3 .21, Gull Escort .22, Packing Tape .30 / .50 / .75, Folds okna +25 %.
- Dive: `maxSink` 2,2, `accel` 2,2, konverze .36 / .74. Zisk Dive roste s π (na plné výbavě experta +10–19 %), viz 12 §5.5.
