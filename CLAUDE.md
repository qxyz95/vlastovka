# Just Throw It

Webová arkáda o házení papírové vlaštovky nad 3D městem (16 míst ve 4 čtvrtích). Jediný vizuální styl je **Papírové město** (neonový cyber styl a přepínač `?styl=` jsou smazané, U0 a R0, 15. 10.). Cílová délka kampaně ~90 min. Vanilla JS, ES moduly, bez npm závislostí a bez build kroku. three.js r170 je vendorovaný ve `vendor/three/` a načítá se přes import map.
Hra je anglicky s přepínáním EN/CS (`src/i18n.js`, slovníky `src/locales/`, výchozí EN). Dokumenty a komunikace s uživatelem jsou česky.
Repozitář: https://github.com/qxyz95/vlastovka (větev `main`).

## Příkazy
- `npm start`: http://127.0.0.1:4173. Nespouštět přes `file://`.
- `npm test`: `node --test`, bez instalace (Node 24). Musí projít po každé změně.
- `npm run format`: Prettier 3.3.3 přes `npx` (JS a CSS; dokumenty, HTML, vendor a archiv ne).
- Ladění 3D: `?render=2d` (záloha 2D), `?perf=1` (ms/snímek), `?timer` (smyčka běží i ve skrytém okně), `window.__r3d` (`advance`, `snapshot`, `bench`, `lose`, `restore`). Jazyk: `?lang=en|cs`.
- Simulátor progrese: `node simulation/progression/run.mjs ... --out <jméno>` (výstup do `simulation/progression/out/`).
- Monte Carlo se současnou hrou (stejná mechanika `src/flight.js`): `npm run sim:mc` (300 kampaní na skupinu, ~15 min na 16 jádrech, `out/mc-plna.md`), rychlá `npm run sim:mc:rychla` (~1,5 min, `out/mc-rychla.md`). Spouští uživatel lokálně.
- **IMPORTANT: Nespouštět `npm run simulate`, `node simulation/run.mjs`, `monte-carlo.mjs` ani `qte-balance.mjs`.** Přepisují reporty v `simulation/` (zakázáno i v `.claude/settings.json`).

## Pravidla kódu
- Formátování dělá **Prettier** (`npm run format`, kontrola `npm run format:check`; přes `npx`, bez závislostí, konfigurace `.prettierrc.json`). Před commitem kódu spustit `npm run format`. Statické testy, které čtou zdrojáky, porovnávají přes `tests/helpers/compact.js`. Komentáře jen tam, kde nejsou zřejmé. Identifikátory anglicky.
- Logika jsou čisté funkce bez DOM (`config.js`, `core.js`, `events.js`, `throw.js`, `scenes.js`, `storage.js`, `random.js`, `atlas*.js`). Simulace i testy importují `src/` přímo, proto do logiky nemíchat DOM ani three.js.
- Každá změna chování má test v `tests/`.
- Fyzika je deterministická: pevný krok `DT=1/60`, seedovaný RNG. Seed letu = `attempts+1`, tutoriálové události jen pro seed 1.
- Každý hráčský text jde přes klíče i18n v EN i CS, ne napevno.
- Save: změna struktury = migrace a validace v `storage.js` s testem. Poškozený save se nesmí ztratit.
- Přístupnost: `prefers-reduced-motion`, klávesnice, dotykové cíle aspoň 44 px.

## Gotchy
- Renderer: výchozí je 3D (`src/render3d/index.js`), 2D `render.js` (a `themes.js`) je záloha jen pro `?render=2d` do fáze f plánu 3D. Oba mají `render(canvas,f,model,time,visual)` a `view(f)`.
- Vstupy drží průhledná UI vrstva `#game` nad `#scene3d` (`pointer-events:none`). Mířidla kreslí `render3d/ui-layer.drawAim` v obou režimech.
- Hitstop zastaví jen akumulátor fyziky, časování QTE běží na čase letu.
- Laditelná čísla nového systému jsou jen v `simulation/progression/params.mjs` (do `src/` je přenáší `src/atlas-numbers.js`). Nový systém (Atlas, papíry) zatím není ve hře.
- Offline audio benchmark ve skrytém okně je nespolehlivý, zátěž měřit výpadky (`playbackStats`) v reálném čase.

## Spolupráce a git
- Orchestrace, role agentů, soubory průběhu a souběh: `.claude/rules/orchestrace.md`.
- Rozhodnutí uživatele v `research/bonusy/06-rozhodnuti.md` jsou závazná a mají přednost před návrhy.
- Commity jako `qxyz95 <qxyz95@users.noreply.github.com>`, formát `<oblast>: <co>`, malé a tematické, po prošlém `npm test`. Push a merge jen na pokyn uživatele.

## Dokumenty (čti podle potřeby)
- **`docs/zdroje.md`: mapa platnosti dokumentů (platný / podklad / překonaný / mrtvý).** Jako zadání čti jen platné dokumenty a dokumenty ze zadání; dokument s hlavičkou `ZASTARALÉ` není zadání; při rozporu `BLOCKED`.
- `docs/architektura.md`: podrobná architektura (logika, renderer 3D a 2D, `src/render3d/`, styly, animace, game feel, hudba, prototypy).
- `docs/stav.md`: stav s daty, hotové části, známé problémy, rozpracované práce. Aktualizovat po větší práci.
- `.claude/rules/*.md`: pravidla pro části projektu (simulace, render3d, Atlas, i18n, save), načtou se podle cesty.
- **Aktuální směr (15. 10.), čti před prací na obsahu nebo vzhledu:** plán hratelnosti `research/plan-hratelnost/README.md` (dávky a pořadí, návrhy 00–03), stylová bible Papírového města `research/design/05-styl-papir.md`, katalog modelů `research/design/10-katalog-modelu.md` a `11-katalog-ctvrt1.md` (kód `src/render3d/models/`, stránka `prototype-katalog.html`), menu `research/design/07-menu.md`, obsah (vlaštovky za mince, skiny, Poštovní brašna, plán 90 min) `research/obsah/01–05`, začátek hodu a kamera `research/start/01–02`. Co právě běží a jak navázat: `docs/stav.md` a soubory průběhu `runs/`.
- Plány: 3D `research/3d/01-plan-prevodu.md`, Atlas `research/atlas/01-navrh-atlasu.md`, progrese `research/bonusy/08-navrh-kolo2.md` a `11-plan-implementace.md`, hudba `research/hudba/01-vyzkum-a-plan.md`.
- Research designu: `research/kb/README.md` (zásady P1–P15, bloky `research/kb/01–09`). Starší podklady: `KB vlastovky.md`, `KB zabavnost a motivace.md`, historie verzí v `README.md`; mrtvé dokumenty v `archiv/`.
