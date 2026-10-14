# Orchestrace a práce agentů

Platí pro hlavní konverzaci i všechny subagenty (zavedeno 14. 10. 2026).

## Role
- **Hlavní konverzace = orchestrátor.** Rozděluje práci, předává rozhodnutí uživateli a zapisuje je do `research/bonusy/06-rozhodnuti.md`, integruje výsledky a commituje.
- **Subagent** pracuje jen na zadaných souborech. **S uživatelem nemluví a nic za něj nerozhoduje.** Když potřebuje rozhodnutí, napíše do reportu řádek `BLOCKED: <otázka s příkladem a doporučením>` a skončí. Orchestrátor otázku předá uživateli a odpověď pošle zpět přes SendMessage.
- Vlastní agenti: `.claude/agents/creative-director.md`, `game-designer.md`, `product-designer.md`, `art-director.md`, `game-dev.md`, `balance-analyst.md`, `qa-tester.md`, `narrative-writer.md`, `audio-designer.md`. Skilly: `smoke-test` (po každém sloučení), `predani` (před koncem sezení), `novy-model`, `fun-check`, `playtest`, `art-review`, `a11y-audit`, `perf-check`, `balance-check`, `release`.
- **Co agent čte:** jen dokumenty ze zadání, `docs/stav.md` a rozhodnutí `research/bonusy/06-rozhodnuti.md`. Dokument s hlavičkou `ZASTARALÉ` ani podklad podle `docs/zdroje.md` nepoužívá jako zadání. Při rozporu napíše `BLOCKED`.
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

## Modely a dohled (zavedeno 15. 10. 2026)
Šetří týdenní limit. Model se volí podle úkolu, ne podle role (parametr `model` u Agent).
- **Opus:** návrhy, kreativní a herní design, složitá logika (fyzika, QTE, progrese), architektura, volba mezi variantami. Orchestrátor vždy.
- **Sonnet:** dávky s hotovou specifikací (UI dávky, texty EN/CS, mazání větví), testy, úklid dokumentů, QA podle kontrolního seznamu.
- **Haiku:** jen hledání v kódu (Explore), přesuny souborů, jednoduché statické kontroly.
- Nejvýš **2 souběžní agenti**. Malé úpravy dělá orchestrátor sám bez agenta. Snímky v prohlížeči jen na konci dávky nebo u vizuální změny.

Dohled orchestrátora nad každým agentem (hlavně Sonnet/Haiku):
1. Zadání obsahuje **kritéria přijetí** a test, který je ověří, a seznam povolených souborů.
2. Orchestrátor čte **skutečný rozdíl** (`git diff`), ne jen report: nic navíc, nic chybějícího, žádné cizí soubory.
3. Orchestrátor sám spustí `npm test`, u vizuální změny udělá jeden snímek. „Ověřeno“ bez důkazu neplatí.
4. **Eskalace:** při neúspěchu jedna oprava se zpětnou vazbou, pak převezme Opus. Typ práce, u kterého levnější model selhal, se zapíše sem do seznamu níže.
5. Nic se nesloučí bez kontroly orchestrátora.

Selhání levnějších modelů (typ práce → přidělit Opusu): zatím žádné. Zkušební dávky: úklid dokumentů a U1 na Sonnetu.

## Git
- Commit po každé dokončené a ověřené fázi (prošlé `npm test`), malý a tematický. Formát: `<oblast>: <co>`, autor viz `CLAUDE.md`.
- Push a merge do `main` jen na pokyn uživatele (skill `/release`).

- Dokument, který přestane platit, dostane hlavičku `ZASTARALÉ (datum): co neplatí; platí <odkaz>` a řádek v `docs/zdroje.md`. Úplně mrtvý se přesune `git mv` do `archiv/`, pokud na něj neodkazuje kód nebo test.
- Zkušenost se Sonnetem: úklid dokumentů 15. 10. prošel kontrolou bez oprav.
- Zkušenost se Sonnetem: U1 texty 15. 10. prošly technicky, ale místo hotových vět z bible napsal vlastní; po jedné opravě v pořádku. **Pro Sonnet uváděj v zadání přesné řádky / sekce dokumentu, ze kterých má text nebo hodnoty převzít doslova, a dej to i do kritérií přijetí.**

## Report subagenta
Krátce: změněné soubory, co je hotové, výsledek testů, co bylo ověřeno a co ne (neověřené označ „NOT ASSESSED“, neodhaduj), otevřené body a případně řádky `BLOCKED:`.
