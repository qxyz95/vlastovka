# Předání do nové session (14. 10. 2026)

Stará session běžela ze složky `C:\Users\micha\chatVlastovky` (o úroveň výš než repo). Nová session běží z `C:\Users\micha\chatVlastovky\Just Throw it`, takže se načte `.claude/` (agenti, skills, rules, settings).

> **POZOR (aktualizace):** F5 a A1 stále běží ve staré session `chatvlastovky-93`. Nespouštět jejich náhradu. Stará session sem zapíše „HOTOVO“, až doběhnou. Překlad EN/CS je hotový. **A1: HOTOVO. F5: HOTOVO** (176/176 testů). Stará session `chatvlastovky-93` už nic nespouští, všechno je v souborech.

## Stav při předání
Hotovo, ale **necommitováno** (větev `f3-3d-prototypy`):
- simulátor progrese `simulation/progression/` (F1–F3, změny ze 14. 10.) + testy `tests/progression*.test.js`
- research `research/bonusy/02, 06, 07–13`, `research/atlas/01`, `research/design/01-papiry.md`, `research/nastroje/01`
- Atlas: `src/atlas*.js`, testy `tests/atlas*.test.js`; save v4 `src/storage.js`, `fresh()` v `src/core.js`, `tests/storage-atlas.test.js`
- prototyp papírů `prototype-papers.html`, `prototype/papers/`
- nastavení: `CLAUDE.md` (zkrácený), `docs/`, `.claude/agents`, `.claude/skills`, `.claude/rules`, `.claude/settings.json`, `.gitignore`, `runs/`

Běželo ve staré session (zkontroluj, zda doběhlo — výstupy v souborech):
- **F5** přeladění simulátoru → `simulation/progression/REPORT.md`, `research/bonusy/12-ladeni2.md`, `out/f5-*`
- **A1** prototyp Atlasu → `prototype-atlas.html`, `prototype/atlas/`, `research/atlas/02-design-spec.md`, `03-texty.md`
- **Překlad EN/CS** → `src/i18n.js`, `src/locales/`, `tests/i18n.test.js`, průběh `runs/2026-10-14-i18n.md`

## Další kroky (pořadí)
1. Ověřit, že F5, A1 a překlad doběhly (soubory výše, `npm test` celé zelené). Nedokončené navázat podle souborů průběhu v `runs/`.
2. Spustit `/fewer-permission-prompts`.
3. Commity po tématech přes `/release` (bez push, push jen na pokyn).
4. Předat uživateli výsledky F5, A1 a překladu; texty A1 přenést do `src/atlas-content.js` (přes i18n), napojit Atlas na i18n.
   Překlad doběhl (174/174 testů). Navazující drobnosti: `storage.js` má vracet klíče `storage.corruptBackup|unavailable|saveFailed` místo českých hlášek a `ui.js` je přeloží přes `t()`; hlášky postav v `render3d/life.js` (`BOLTS`, `EVENT_TEXT`) převést na i18n; Atlas na i18n podle návrhu v `runs/2026-10-14-i18n.md`; NOT ASSESSED: 3D štítky v CS a reduced motion.
5. Pak 3. kolo progrese (incremental: `06` bloky 14. 10. a `13-rippleloop.md`), B1 = UI Atlasu ve hře.

## Otevřené otázky pro uživatele: ZODPOVĚZENO 14. 10. (zapsáno v 06-rozhodnuti.md)
- **A1 (prototyp Atlasu):**
  1. kapsy na mobilu rolují s mapou (doporučeno),
  2. Autopilot jako 5 samostatných uzlů po čtvrtích (doporučeno),
  3. účinek jako dvě věty „Now · Level 2“ / „Level 3“ (doporučeno),
  4. „Progress saved. Nothing here runs out.“ ponechat (doporučeno).
  Uživatel zatím neodpověděl.
- **F5 (`research/bonusy/12-ladeni2.md` §5 a §7):**
  - drobná novinka mezi místy v D3–D4, nebo cíl sucha P90 ≤ 10,
  - pára a dron jako události navíc (jako Shooting Star),
  - Packing Tape měřit v sadě šum ×2,
  - Dive nezávislý na π,
  - posunout pásma pro šum ×2.
- **Úklid:** v `src/atlas-numbers.js` zastaralý komentář „before F5“ (hodnoty už odpovídají F5). Druhý F5 agent z nové session skončil jako BLOCKED (`runs/2026-10-14-f5-ladeni.md`), lze uzavřít.
