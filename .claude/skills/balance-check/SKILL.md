---
name: balance-check
description: Spustí simulátor progrese simulation/progression/run.mjs, přečte výsledky v out/ a vypíše tabulku cílů 08 §10.2 s verdikty CRITICAL / CONCERNS / NOT ASSESSED / HEALTHY. Použij po změně params.mjs, při ladění balancu, ekonomiky mincí nebo délky hry.
when_to_use: „zkontroluj balanc“, „pusť simulaci“, „jak vychází délka hry“, po úpravě čísel v params.mjs.
argument-hint: "[přepínače run.mjs, např. --n 200 --profileset x2 --out f5-x]"
allowed-tools:
  - Bash(node simulation/progression/run.mjs *)
  - Bash(npm test*)
---

# Balance check

Argumenty: `$ARGUMENTS`

## Pravidla
- Spouštěj **jen** `node simulation/progression/run.mjs`. Nikdy `npm run simulate`, `node simulation/run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs` (přepisují reporty).
- Výstup jde jen do `simulation/progression/out/<jméno>.md` a `.json`. Existující výstup nepřepisuj, zvol nové jméno.
- Nic neodhaduj. Co nebylo spočteno, je **NOT ASSESSED – NO DATA**. Metrika bez cíle (`–`) se nehodnotí, jen se zapíše „bez cíle“.
- Mechaniky ani soubory mimo `params.mjs` neměň. Návrh změny mechaniky = řádek `BLOCKED:`.

## Postup
1. **Vstupy FOUND / ABSENT:** `simulation/progression/params.mjs` (sekce `targets`), tabulka `research/bonusy/08-navrh-kolo2.md` §10.2, rozhodnutí `research/bonusy/06-rozhodnuti.md`, poslední výstup `simulation/progression/out/f5-*.md` pro srovnání. Vypiš je jako seznam.
2. **Sestav příkaz** (přepínače viz `simulation/progression/README.md`, sekce Spuštění):
   - Bez argumentů: `node simulation/progression/run.mjs --profileset x2 --strategies realistic,paper-first,atlas-first --n 100 --out check-<YYYY-MM-DD>`. Sada `x2` je povinně hlídaná.
   - S argumenty: použij `$ARGUMENTS`. Když chybí `--out`, doplň `--out check-<YYYY-MM-DD>`; když jméno v `out/` už existuje, přidej `-2`, `-3`…
   - Kapsy (cíl ≤ 8 %) jen s maticí: `--strategies realistic --pockets none,cushion,sharp,dive,calm,whistle,rocket --n 150 --no-probes`. Citlivost: `--profiles weak,average --strategies realistic --n 100 --no-probes --sensitivity`.
3. **Spusť.** `--n 200` trvá ~8–9 min, `--n 100` ~4 min, `--n 20` ~40 s. Delší běh pusť na pozadí (`run_in_background`) a počkej na dokončení.
4. **Přečti** `out/<jméno>.json` (pole `checks`: `name`, `value`, `goal`, `ok`; `ok: null` = bez cíle) a pro kontext `out/<jméno>.md` (sekce Křivka, Kampaně, Atlas na úr. 3).
5. **Tabulka cílů 08 §10.2.** Pro každý řádek §10.2 jeden nebo víc řádků z `checks`:

   | Metrika (08 §10.2) | Cíl | Hodnota | Verdikt | Poznámka |
   |---|---|---|---|---|

   Verdikt řádku: `ok: true` → HEALTHY; `ok: false` → CONCERNS (odchylka laditelná čísly) nebo CRITICAL (viz níže); řádek §10.2 bez odpovídající kontroly v `checks` (např. Kapsy bez matice) → NOT ASSESSED.
6. **Celkový verdikt** (první shoda vyhrává):
   - **CRITICAL:** slabý nedojde do cíle do 250 hodů, degenerovaná strategie (Paper napřed > 10 % rychlejší nebo zaseknutá kampaň), smyčka bez odtoku mincí, let > 60 s u většiny běhů.
   - **CONCERNS:** aspoň jeden FAIL laditelný čísly.
   - **NOT ASSESSED:** chybí data pro podstatnou část §10.2.
   - **HEALTHY:** všechny hodnocené cíle OK.
7. **Doporučení:** nejvýš 3 podle priority, u každého cesta v `params.mjs`, navržená hodnota, očekávaný dopad a riziko. Ověřit se dá rychle přes `--set cesta=hodnota` se stejným seedem.
8. Pokud jsi změnil `params.mjs`, spusť `npm test` a celý balance-check znovu se stejnými přepínači. Hlídej nově vzniklé odchylky.
9. **Výstup:** příkaz, cesta k `out/<jméno>.md`, tabulka, celkový verdikt, doporučení, NOT ASSESSED body. Při delší práci zapiš průběh do `runs/<YYYY-MM-DD>-balance.md`.
