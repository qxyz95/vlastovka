---
name: smoke-test
description: Rychlá kontrola Just Throw It po sloučení nebo změně - npm test, načtení hry v prohlížeči, konzole bez chyb, jeden hod s QTE, výsledek, Dílna, snímky a krátký zápis. Používá ho orchestrátor a qa-tester; ve sdíleném okně Chrome jen ve vyhrazené záložce.
when_to_use: „zkontroluj, že to běží“, „smoke test“, po každém git merge větve agenta, před předáním změny uživateli.
argument-hint: "[oblast nebo URL, např. index.html, prototype-katalog.html; volitelně co se změnilo]"
---

# Smoke test

Cíl: `$ARGUMENTS` (bez argumentu hra `index.html`).

## Pravidla
- **Okno Chrome sdílí uživatel.** Pracuj jen v záložce, kterou určil orchestrátor (nebo kterou uživatel dovolil), nevytvářej nové záložky, neměň velikost okna. `document.hidden === true` → vzhled a výkon jsou NOT ASSESSED.
- Dev server (`npm start`, port 4173): když neběží, **nespouštěj ho bez dovolení** (systému dřív docházela paměť) a napiš to.
- Nemaž hráčův save. Čistý start jen v izolovaném profilu nebo přes parametr hry, pokud existuje.

## Postup
1. `npm test` (musí projít; jinak konec a výpis selhaných testů). `git log --oneline -5`.
2. Načti cíl s `?lang=cs` (a jednou `?lang=en`). Konzole: jen chyby (`read_console_messages`, `onlyErrors`). Každá chyba = nález.
3. Hra: snímek klidu (míření). Hod (podrž a pusť ve scéně, `left_click_drag` s malým posunem), snímek za letu, počkej na QTE a klepni, snímek výsledku. Otevři a zavři Dílnu. U prototypů projdi hlavní ovládací prvky.
4. Volitelně `window.__r3d.bench()` (draw calls, △, ms) a porovnej s rozpočty v `.claude/rules/render3d.md`.
5. Snímky ulož (`save_to_disk`) a uveď cesty.

## Výstup
Krátký zápis (v odpovědi, nebo do `reports/qa/<YYYY-MM-DD>-smoke.md`, když volá qa-tester): build, co prošlo, nálezy (závažnost, postup k zopakování), čísla z benche, cesty ke snímkům, NOT ASSESSED.
