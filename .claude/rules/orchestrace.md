# Orchestrace a práce agentů

Platí pro hlavní konverzaci i všechny subagenty (zavedeno 14. 10. 2026).

## Role
- **Hlavní konverzace = orchestrátor.** Rozděluje práci, předává rozhodnutí uživateli a zapisuje je do `research/bonusy/06-rozhodnuti.md`, integruje výsledky a commituje.
- **Subagent** pracuje jen na zadaných souborech. **S uživatelem nemluví a nic za něj nerozhoduje.** Když potřebuje rozhodnutí, napíše do reportu řádek `BLOCKED: <otázka s příkladem a doporučením>` a skončí. Orchestrátor otázku předá uživateli a odpověď pošle zpět přes SendMessage.
- Vlastní agenti: `.claude/agents/game-designer.md`, `product-designer.md`, `art-director.md`, `game-dev.md`, `balance-analyst.md`.
- **Balance-analyst se spouští až tehdy, když je uživatel spokojený s obsahem a mechanikami** (rozhodnutí 06, 15. 10.). Dokud se obsah nebo jádro hry mění, čísla se neladí.

## Odolnost proti přerušení (limit, pád)
- Každý subagent, který pracuje déle než pár minut, si vede **soubor průběhu `runs/<YYYY-MM-DD>-<úkol>.md`**: zadání v jedné větě, hotové kroky, rozpracovaný krok, další kroky, změněné soubory a výsledky měření s cestou k výstupům. Aktualizuje ho po každém dokončeném kroku.
- Výsledky (návrhy, reporty, rozbory) se vždy ukládají **do souboru v repu**, ne jen do závěrečné zprávy.
- Při navazování po přerušení nový agent nejdřív přečte soubor průběhu a pokračuje od rozpracovaného kroku. Hotové kroky nepočítá znovu.
- Dlouhé dávkové běhy (ladění simulací, mnoho agentů) se spouštějí jako **workflow**, protože se při limitu pozastaví a po obnovení pokračují.

## Souběh
- Každý soubor má v jedné chvíli jednoho vlastníka. Zadání vždy uvádí, které soubory agent smí měnit a které jsou cizí.
- Programující agenti v nových dávkách běží v **git worktree** (`isolation: worktree`, `worktree.baseRef: head`). Orchestrátor jejich větve slučuje.
- Před úpravou souboru, se kterým může pracovat i někdo jiný, ho vždy znovu načti.

## Git
- Commit po každé dokončené a ověřené fázi (prošlé `npm test`), malý a tematický. Formát: `<oblast>: <co>`, autor viz `CLAUDE.md`.
- Push a merge do `main` jen na pokyn uživatele (skill `/release`).

## Report subagenta
Krátce: změněné soubory, co je hotové, výsledek testů, co bylo ověřeno a co ne (neověřené označ „NOT ASSESSED“, neodhaduj), otevřené body a případně řádky `BLOCKED:`.
