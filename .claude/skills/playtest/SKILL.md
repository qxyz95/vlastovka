---
name: playtest
description: Připraví hráčský test Just Throw It (scénář, otázky, co sledovat, šablona reportu, log ?playtest=1 pokud existuje) podle KB 09 §4.1 a Atlasu §8, nebo vyhodnotí dodaný report či poznámky z testu a rozdělí nálezy na design / balanc / chyby / polish.
when_to_use: „připrav playtest“, „chystám test s hráči“, „vyhodnoť playtest“, uživatel nadiktuje, co viděl u hráče.
argument-hint: "[pripravit | vyhodnotit <soubor nebo text poznámek>]"
arguments: rezim
---

# Playtest

Režim: `$rezim` (celé argumenty: `$ARGUMENTS`). Bez argumentu se zeptej v odpovědi, jestli jde o přípravu, nebo vyhodnocení; když je přiložen report nebo poznámky, jde o vyhodnocení.

Zdroje: `research/kb/09-retence-mereni.md` §2.8–2.12 a §4.1 (kola, miniPXI, log, vyhodnocení), `research/atlas/01-navrh-atlasu.md` §8 (Atlas), `KB zabavnost a motivace.md` §6 (scénář 20–25 min, otázky, rozhodovací pravidla). Šablona: [sablona-reportu.md](sablona-reportu.md).

## Režim `pripravit`
1. **Build:** `git rev-parse --short HEAD` a `git status --short`. Necommitnuté změny zapiš do přípravy (test pak neběží na známé verzi).
2. **Log:** zjisti, jestli hra umí `?playtest=1` (`grep -rn "playtest" src/ index.html`). Pokud ano, popiš zapnutí, klíč v localStorage a stažení a smazání záznamu. Pokud ne, napiš „log ve hře není, sleduje se ručně“ a navrhni orchestrátorovi úkol pro game-deva (KB 09 §4.1: `session_start`, `attempt_index`, `record_set`, `delta_prev`, `rolling_median5`, `last_state_before_exit`, Atlas události z §8). Sám ho neimplementuj.
3. **Kolo a vzorek:** kolo A 5–6 lidí (aspoň 2 na dotyku, 2 na klávesnici, RITE: opravují se jen zjevné problémy porozumění a ovládání, balanc se mezi účastníky nemění), kolo B 5–6 lidí na zmrazené verzi.
4. **Profily:** čerstvý save v izolovaném profilu prohlížeče (nikdy nemazat hráčův save), připravený save po 500 m a na vstupu do další čtvrti.
5. **Souhlas:** krátký text pro účastníka (co se zaznamenává, nic neodchází ze zařízení, záznam stáhne moderátor, test jde kdykoli ukončit).
6. **Scénář a otázky:** vypiš z šablony oddíl 3 (časové fáze), 9 (Atlas, jen pokud je ve hře) a 10 (otázky po hraní). Při QTE nežádat přemýšlení nahlas, ptát se po letu.
7. **Co sledovat:** první dojem v 5 minutách, kde potřeboval pomoc, čas od neúspěchu k dalšímu hodu, rozhodnutí v Dílně a Atlasu, stav při odchodu, mobilní mimo-klepnutí a přiblížení.
8. **Výstup:** soubor `research/playtest/<YYYY-MM-DD>-priprava.md` (build, log, kolo, profily, souhlas, scénář, otázky) a prázdné kopie šablony `research/playtest/<YYYY-MM-DD>-P<n>.md` pro každého účastníka.

## Režim `vyhodnotit`
1. Načti dodané reporty (soubory nebo text). Nadiktované poznámky přepiš do šablony, prázdná pole označ **NOT ASSESSED**. Nic nedomýšlej.
2. Pokud je k dispozici log JSON, spočti: křivku přežití (aktivní po k-tém hodu), čas a hody do prvního nákupu, stav při odchodu, podíl konců do 2 hodů po rekordu, plateau podle `rolling_median5`.
3. **Pravidla, ne průměry** (KB 09 §2.11, stará KB §6): opakovaný problém u 2 a více lidí = oprava a další test; jednotlivý = sledovat. Technická chyba, ztráta postupu nebo nečitelný vstup se řeší před interpretací motivace. Delší hraní samo zábavu nedokazuje. miniPXI jen popisně (medián a rozpětí), Immersion a Mastery neinterpretovat, rozdíl půl bodu je šum.
4. **Atlas** (§8): porozumění pravidlu ≥ 8 z 10, zvědavost (jmenuje teaserové místo), různé pořadí nákupů s důvodem, srozumitelnost čísel, nutkavost a FOMO (úspěch = víc dobrovolného pokračování bez nárůstu lítosti), zastávky jako legitimní konec.
5. **Rozděl nálezy:** design → otázka pro uživatele (`BLOCKED:` s doporučením), balanc → `/balance-check`, chyby → oprava s testem (pro game-deva), polish → backlog.
6. **Výstup:** `research/playtest/<YYYY-MM-DD>-vyhodnoceni.md` se souhrnem, tabulkou opakovaných problémů (problém, u kolika lidí, závažnost H/M/L, kam patří), top 3 prioritami a NOT ASSESSED body. Hráčská data bez identifikátorů.
