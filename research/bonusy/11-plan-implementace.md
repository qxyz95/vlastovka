# Plán implementace rozhodnutí ze 14. 10. 2026

**Založeno 14. 10. 2026.** Zapracování šesti rozhodnutí k návrhům z ladění F3 (`06-rozhodnuti.md`, blok 14. 10.; podklady `10-ladeni.md` §5) do simulátoru `simulation/progression/`. **Hra (`src/`) se nemění**, platí zásady `09-plan-overeni.md`: stávající `simulation/*.mjs` a jejich reporty se nespouštějí, výstupy jen do `simulation/progression/out/`, necommitovat.

## Parametry (připravené v `params.mjs`, výchozí = rozhodnutí)
| Rozhodnutí | Parametr | Výchozí | Původní chování |
|---|---|---|---|
| 1 papír na 3. místě | `workshop.paper.openAtPlace` | 3 | 5 = hranice další čtvrti |
| 3 perfekt termiky | `events.thermal.perfect` | ±0,08 s kolem středu jádra | 0 = termika bez perfektu |
| 4 strop střemhlavu | `specials.dive.maxSink` | 3 × běžné klesání `vx/glide` | `null` = bez stropu |
| 5 užší okno po Whistle | `specials.whistle.window` | ×0,8 okna přivolané události | 1 |
| 6 sucho P90 | `targets.droughtStat` | `'p90'` | `'max'` |

Každá změna musí mít přepínač na původní chování, aby šla porovnat v citlivosti.

## Fáze a role
| # | Úkol | Kdo | Soubory (vlastník) | Testy |
|---|---|---|---|---|
| I1 | Mechaniky za letu: perfekt termiky (3), strop střemhlavu (4), užší okno přivolané události (5) | agent „mechanika“ | `model.mjs`, `abilities.mjs` | `tests/progression-mechanics.test.js` |
| I2 | Kampaň a měření: otevření papíru na 3. místě (1), nové metriky Paper Crane / Shooting Star / Packing Tape (2), sucho P90 (6), řádky citlivosti s přepínači 1, 3, 4, 5 | agent „kampaň“ | `campaign.mjs`, `run.mjs` | `tests/progression-campaign.test.js` |
| I3 | Integrace: `npm test`, kontrola, že přepínače vrací chování F3 | hlavní konverzace | – | celé `npm test` |
| F5 | Přeladění čísel na nové mechaniky (stejný postup jako F3) a nový `REPORT.md` / `12-ladeni2.md` | agent „ladič“ | `params.mjs` | – |

I1 a I2 běží souběžně, protože mají oddělené soubory. `params.mjs` a `tests/progression.test.js` mezi tím nemění nikdo. F5 začne až po I3.

## Upřesnění k jednotlivým bodům
1. **Papír:** druh k+1 (k = 1…3) je v nabídce, když rekord ≥ začátek místa `(k−1)·4 + openAtPlace` (místa číslovaná 1–16 jako `atlas.bonuses`). Při `openAtPlace = 5` totéž jako dnes (hranice čtvrti). Kapsa 2 a speciály dál podle čtvrti.
2. **Metriky:** Paper Crane = podíl letů s tahem a podíl tahů, které přenesly přes hranici dosud neobjeveného místa (v kampani); Shooting Star = průměrný zisk doletu v letech, kde hvězda přišla (sonda: stejný hod s hvězdou a bez ní); Packing Tape = zisk na úr. 3 u slabého profilu. V `checks` nahradí obecné 3–15 % pro tyto tři bonusy (cíle: Crane bez cíle, jen hlášení; hvězda zisk v letu ≥ 3 %; Tape u slabého 3–15 %).
3. **Perfekt termiky:** klepnutí do `perfect·windowK` od středu jádra = `perfect` (kombo +2, Echo, `push.perfect`), jinak jádro = `success` jako dnes.
4. **Strop střemhlavu:** při drženém Dive `vy ≥ −maxSink·max(0, vx − vítr)/glide`.
5. **Whistle:** událost přivolaná pískáním má okna (úspěch i perfekt, u páry obláčky, u termiky jádro i perfekt, u dronu okno) ×`window`.
6. **Sucho:** `summarize` hlásí P90 maxima sucha kampaní (`droughtMaxP90`), `checks` porovnává podle `targets.droughtStat`.
