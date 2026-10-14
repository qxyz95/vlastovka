---
name: predani
description: Předání kontextu Just Throw It po větší práci nebo před koncem sezení - aktualizuje docs/stav.md (hotové, rozpracované, další kroky, jak navázat), zkontroluje CLAUDE.md a odkazy rolí na aktuální dokumenty, ověří commity a necommitnuté soubory, aby nový Claude nebo agent měl vždy aktuální kontext celé hry.
when_to_use: „udělej předání“, „ulož stav“, po větší práci, před limitem nebo koncem sezení, když uživatel chce spustit nového Clauda.
argument-hint: "[poznámka, např. co je hlavní další krok]"
---

# Předání

Poznámka: `$ARGUMENTS`.

## Postup
1. **Git:** `git status --short`, `git log --oneline -20`, `git branch --show-current`. Necommitnuté soubory projdi: patří-li k hotové práci, commitni je tematicky (po `npm test`, autor `qxyz95`, poslední řádek `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`); cizí soubory uživatele (např. screenshoty) necommituj a zmiň je. Nepushuj bez pokynu.
2. **Běžící agenti:** pro každého rozpracovaného agenta nebo worktree (`git worktree list`, větve `worktree-agent-*` s commity navíc) zapiš, kde je soubor průběhu `runs/…` a co zbývá. Hotovou větev nesloučenou s hlavní větví zmiň.
3. **`docs/stav.md`:** oddíl „Rozpracované práce“ přepiš na aktuální stav s datem: co je hotové (s commity), co běží, otevřené otázky pro uživatele (krátce, s odkazem), další kroky v pořadí, jak navázat. Staré a už neplatné body smaž nebo přesuň do historie.
4. **`CLAUDE.md`:** zkontroluj úvod a oddíl „Dokumenty“: odpovídá aktuálnímu směru (styl, délka hry, hlavní návrhy)? Oprav jen nepravdivé nebo chybějící odkazy, nepřidávej detaily, které patří do `docs/stav.md`.
5. **Role a skilly:** `grep` v `.claude/agents/` a `.claude/skills/` na odkazy na neplatné dokumenty (např. stará bible) a oprav je.
6. **Rozhodnutí:** jsou všechna rozhodnutí uživatele z tohoto sezení zapsaná v `research/bonusy/06-rozhodnuti.md`? Chybějící doplň (doslovná slova uživatele, kde jde o směr).
7. Commit `docs: předání …` a krátká zpráva uživateli: co je uložené, co běží, čím začít v novém sezení.
