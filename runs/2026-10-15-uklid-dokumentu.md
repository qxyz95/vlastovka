# Úklid dokumentace (15. 10. 2026)

Zadání: zařadit všechny `.md` (platný / podklad / překonaný / mrtvý), vytvořit `docs/zdroje.md`, hlavičky `ZASTARALÉ`, přesunout mrtvé do `archiv/`, opravit zmínky o cyber stylu v platných dokumentech. Kód se nemění.

## Hotové kroky
1. Zařazení všech `.md` (224 souborů v gitu) hotové, tabulka v `docs/zdroje.md`.
2. Přesun `git mv` do `archiv/`: `Plan realizace.md`, `Pripominky a plan realizace.md`, `simulation/BROWSER-CHECK.md` (do `archiv/simulation/`). Odkazy opraveny v `README.md`, `KB vlastovky.md`, `docs/architektura.md`, `archiv/Plan realizace.md` (relativní odkazy).
3. Hlavičky `ZASTARALÉ` na 18 dokumentech (viz `docs/zdroje.md`).
4. Opravy zmínek: `docs/architektura.md` (přepínač stylů, `?styl=`), `docs/stav.md`, `.claude/rules/i18n.md`, `.claude/agents/art-director.md`, `.claude/agents/product-designer.md`.

## Ponecháno záměrně
- `simulation/REPORT.md`, `MONTE-CARLO.md`, `QTE-BALANCE.md` se nepřesouvají: zapisují je skripty (`run.mjs`, `monte-carlo.mjs`, `qte-balance.mjs`), jen hlavička.
- `CLAUDE.md` a `.claude/rules/orchestrace.md` neměněny; návrh znění je v reportu orchestrátorovi (CLAUDE.md dál odkazuje na `Plan realizace.md` a popisuje cyber jako výchozí).

## Ověření
Viz commit. `npm test` a kontrola odkazů na přesunuté soubory v závěrečné zprávě.
