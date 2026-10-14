# Mapa platnosti dokumentů

Jako **zadání** čti jen dokumenty v kategorii „platný“; **podklad** je zdroj myšlenek a historie, nikdy ne zadání; **překonaný** má nahoře hlavičku `ZASTARALÉ` a **mrtvý** leží v `archiv/` (historie je i v gitu). **Rozhodnutí uživatele v `research/bonusy/06-rozhodnuti.md` mají přednost před čímkoli jiným**; při rozporu dvou dokumentů napiš `BLOCKED` místo hádání. Stav 15. 10. 2026 (úklid dokumentace); při větší změně tabulku aktualizuj.

Kategorie: **platný** = aktuální zadání nebo pravidla · **podklad** = research, historie, měření · **překonaný** = část nebo celek odporuje rozhodnutím nebo kódu (hlavička `ZASTARALÉ` říká co) · **mrtvý** = v `archiv/`.

## Kořen, docs, assety, reporty

| Dokument | Kategorie | Čím je nahrazený / k čemu slouží |
|---|---|---|
| `CLAUDE.md` | platný | Pravidla projektu a rozcestník. |
| `README.md` | překonaný | Popis prototypu 0.1.0; platí `CLAUDE.md`, `docs/`. Užitečná jen historie verzí. |
| `KB vlastovky.md` | podklad | Fyzika papírové vlaštovky (K1–K7); fyzika hry je arkádová, KB je zdroj myšlenek. |
| `KB zabavnost a motivace.md` | podklad | Zásady zábavy a motivace (K1–K7, B00–B14); hlubší verze v `research/kb/`. |
| `docs/architektura.md` | platný | Podrobná architektura kódu (sekce o 2D záloze označené jako záloha). |
| `docs/stav.md` | platný | Stav projektu s daty, známé problémy, jak navázat. |
| `docs/zdroje.md` | platný | Tento soubor. |
| `assets/backgrounds/README.md` | překonaný | 2D cyberpunkové SVG; platí bible 05. |
| `vendor/three/README.md` | platný | Verze a původ vendorovaného three.js. |
| `reports/3d/kamera-start.md` | podklad | Metriky kamery S1–S3 z Node (14. 10.), prohlížeč NOT ASSESSED. |
| `reports/3d/perf.md` | podklad | Měření výkonu 3D (14. 10.), jedno zařízení. |
| `reports/Vylepšení animací a nástroje zdarma.md` | překonaný | Shrnutí 2D/4 styly; platí jen obecné techniky game feel. |
| `archiv/Plan realizace.md` | mrtvý | Checklist prototypu 0.1.0 (11. 10.); nahradily ho `docs/stav.md` a `research/`. |
| `archiv/Pripominky a plan realizace.md` | mrtvý | Rozbor původního zadání (11. 10.); nahrazeno rozhodnutími 06. |
| `archiv/simulation/BROWSER-CHECK.md` | mrtvý | Kontrola prohlížeče pravidel 0.1.0 a 0.4. |

## `.claude/` (pravidla pro agenty)

| Dokument | Kategorie | Čím je nahrazený / k čemu slouží |
|---|---|---|
| `.claude/rules/orchestrace.md` | platný | Role, soubory průběhu, souběh, git. |
| `.claude/rules/atlas.md`, `i18n.md`, `render3d.md`, `save.md`, `simulace.md` | platný | Pravidla podle cesty (Atlas, překlady, 3D, save, simulace). |
| `.claude/agents/*.md` (9 rolí: art-director, audio-designer, balance-analyst, creative-director, game-designer, game-dev, narrative-writer, product-designer, qa-tester) | platný | Definice agentů. |
| `.claude/skills/*/SKILL.md` (a11y-audit, art-review, balance-check, fun-check, novy-model, perf-check, playtest, predani, release, smoke-test) a `.claude/skills/playtest/sablona-reportu.md` | platný | Postupy skillů. |

## `research/`

| Dokument | Kategorie | Čím je nahrazený / k čemu slouží |
|---|---|---|
| `research/bonusy/06-rozhodnuti.md` | platný | **Závazná rozhodnutí uživatele**, přednost před vším. |
| `research/bonusy/08-navrh-kolo2.md` | platný | Ucelený návrh progrese (Workshop, Atlas, Pockets); 06 ho přebíjí. |
| `research/bonusy/11-plan-implementace.md` | podklad | Plán zapracování rozhodnutí z 14. 10. do simulátoru (hotovo). |
| `research/bonusy/00-zadani.md`, `01`–`05` | podklad | Karty 1. kola (100+ nápadů); skládá je 08, rozhoduje 06. |
| `research/bonusy/07-review.md` | podklad | Review karet 1. kola. |
| `research/bonusy/09-plan-overeni.md` | podklad | Plán ověření Monte Carlem (F1–F3), hotovo. |
| `research/bonusy/10-ladeni.md`, `12-ladeni2.md` | podklad | Výsledky ladění F3 a F5; čísla se mění ladícím kolem po schválení obsahu. |
| `research/bonusy/13-rippleloop.md` | podklad | Rozbor hry RippleLoop; závěry v 06. |
| `research/design/05-styl-papir.md` | platný | **Stylová bible, jediný zdroj pravdy o vzhledu.** |
| `research/design/07-menu.md` | překonaný (část) | Struktura obrazovek platí; přepínač stylů a pozadí menu ne. |
| `research/design/08-stiny.md` | platný | Stíny Papírového města (schváleno 14. 10.). |
| `research/design/09-prechody-ctvrti.md` | platný | Přechody mezi čtvrtěmi (schváleno 14. 10.). |
| `research/design/10-katalog-modelu.md` | platný | Postup „nejdřív hezký objekt“ a zásady katalogu. |
| `research/design/11-katalog-ctvrt1.md` | překonaný (část) | Karty objektů čtvrti 1; karta Dílny a model `workshop` nahrazené podkrovní dílnou. |
| `research/design/01-papiry.md` | překonaný (část) | Druhy papíru; vzhled podle bible 05 kap. 17. |
| `research/design/02-styl.md` | překonaný | Bible cyber/komiks; nahrazena `05-styl-papir.md`. |
| `research/design/03-styl-implementace.md` | překonaný | Plán implementace bible 02. |
| `research/design/04-nove-smery.md` | podklad | Průzkum nových směrů; vybrán směr B (Papírové město). |
| `research/design/06-papir-ctvrt1.md` | překonaný | Plán dávek P0–P4 za `?styl=papir` (hotovo, příznak zrušen). |
| `research/obsah/01-game-design.md` | platný | Vlaštovky za mince, Mailbag, skiny (game design). |
| `research/obsah/02-ux-dilna.md` | platný | UX Dílny a Vzhledu. |
| `research/obsah/03-vzhled-modelu-a-skinu.md` | platný | Vzhled modelů a skinů (závazné znění v bibli 05 kap. 17). |
| `research/obsah/04-ekonomika.md` | podklad | Výchozí rozbor ekonomiky; čísla před změnou QTE. |
| `research/obsah/05-plan-90-minut.md` | překonaný (část) | Plán 90 min; kousky, razítka a zastávky odloženy nebo nahrazeny. |
| `research/obsah/06-ladeni-90.md` | podklad | 1. kolo ladění na 90 min (přerušeno kvůli změně QTE). |
| `research/start/01-zacatek-a-kamera.md` | platný | Začátek hodu a kamera podle rychlosti. |
| `research/start/02-misto-odhodu-vzhled.md` | platný | Místo odhodu (podkrovní dílna); závazné znění v bibli 05. |
| `research/plan-hratelnost/README.md`, `00`–`03` | platný | Aktuální směr po poznámkách tvůrce (15. 10.), odpovědi v 06. |
| `research/atlas/01-navrh-atlasu.md` | platný | Návrh Atlasu (panel ve hře, logika, `p.atlas`). |
| `research/atlas/02-design-spec.md` | překonaný (část) | Spec Atlasu; vzhled pohlednic podle bible 05 kap. 10. |
| `research/atlas/03-texty.md` | platný | Texty Atlasu EN a CS (generováno z prototypu). |
| `research/3d/01-plan-prevodu.md` | překonaný (část) | Plán 3D převodu; „komiksový“ vzhled neplatí, postup po fázích ano. |
| `research/svet/01-zivy-svet.md` | překonaný (část) | Živý svět; vizuál neplatí, nápady na život a humor ano. |
| `research/hudba/01-vyzkum-a-plan.md` | podklad | Plán hudby (rozpočet 0, generování v kódu); hra zvuk zatím nenačítá. |
| `research/nastroje/01-skills-napady.md` | podklad | Průzkum nástrojů a skills. |
| `research/00-temata.md` | podklad | Seznam témat research KB. |
| `research/kb/README.md`, `01`–`09` | podklad | Zásady P1–P15 a bloky research designu a psychologie her. |
| `research/playtest/2026-10-15-poznamky-tvurce.md`, `2026-10-15-vyhodnoceni.md` | podklad | Doslovné poznámky tvůrce z hraní a jejich výklad; zadáním jsou až rozhodnutí v 06. |
| `research_notes/Vylepšení animací a nástroje zdarma/knihovny-js.md` | podklad | Srovnání JS knihoven (2D éra). |
| `research_notes/Vylepšení animací a nástroje zdarma/nastroje-tvorba-assetu.md` | podklad | Nástroje zdarma pro 2D assety. |
| `research_notes/Vylepšení animací a nástroje zdarma/styly-a-reference.md` | překonaný | Techniky pro 4 styly na Canvas 2D. |
| `research_notes/Vylepšení animací a nástroje zdarma/techniky-animace-canvas.md` | překonaný | Canvas 2D animace; obecné techniky jsou v `motion.js`, `juice.js`. |

## `simulation/` a `runs/`

| Dokument | Kategorie | Čím je nahrazený / k čemu slouží |
|---|---|---|
| `simulation/progression/README.md` | platný | Spuštění a přepínače simulátoru progrese. |
| `simulation/progression/AUDIT.md` | podklad | Audit věrnosti simulátoru (F2). |
| `simulation/progression/REPORT.md` | podklad | Výsledky F5; pro novou mechaniku neplatí, čeká přeladění. |
| `simulation/progression/out/*.md` (73 souborů) | podklad | Generované výstupy běhů simulátoru; nečíst jako zadání. |
| `simulation/REPORT.md` | překonaný | Starý simulátor 0.1.0 (zapisuje ho skript, nepřesouvat). |
| `simulation/MONTE-CARLO.md` | překonaný | Starý simulátor 0.6 (zapisuje ho skript, nepřesouvat). |
| `simulation/QTE-BALANCE.md` | překonaný | Starý simulátor 0.4.0 (zapisuje ho skript, nepřesouvat). |
| `runs/README.md` | platný | Popis souborů průběhu. |
| `runs/*.md` (ostatní soubory průběhu agentů) | podklad | Záznamy práce agentů s daty; kontext, ne zadání. |
