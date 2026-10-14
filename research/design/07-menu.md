# Struktura obrazovek a menu: design spec

**14. 10. 2026, product-designer.** Podklad: rozhodnutí 06 „Struktura menu jako ve hrách (14. 10.)“ (závazné), Atlas `research/atlas/01-navrh-atlasu.md` a `02-design-spec.md`, KB 07 (onboarding, UX), KB README P1–P15. Maketa: `prototype-menu.html` + `prototype/menu/` (falešná data, `src/` beze změny). Vzhled je jen hrubý na dnešních tokenech `style.css`, protože se mění na styl B „Papírové město“ (`04-nove-smery.md`, bible `05-styl-papir.md` vzniká). **Rozložení na stylu nezávisí:** prototyp přepne vzhled přes `?skin=paper` jen výměnou sémantických tokenů.

Odkazy: `06` = rozhodnutí uživatele, `P1–P15` = `research/kb/README.md`, `07 N…/A…` = `research/kb/07-onboarding-ux.md`, `Atlas §…` = `research/atlas/02-design-spec.md`.

## 0. Shrnutí
- **Hra má pět obrazovek a tři panely.** Obrazovky (jedna vždy): Hlavní menu, Míření, Let, Výsledek (+ načítání). Panely nad nimi (zásobník `<dialog>`): Dílna, Atlas, Nastavení, Pauza, Potvrzení. Scéna 3D běží pod vším a nikdy se nepřenačítá.
- **Hlavní menu = název + živé město + čtyři tlačítka** (Házet, Dílna, Atlas, Nastavení), mince malým údajem vpravo nahoře (06 bod 1). Hlavička, odkazy „01 / Workshop“, přepínač stylu, EN/CS a úvodní text z hlavní obrazovky mizí (06 bod 4).
- **Za hry jen scéna a malý HUD:** vlevo nahoře dolet, vpravo nahoře mince a pauza, dole v rozích ovládání (06 bod 2). Text pod scénou (`#journey-story`, `.intro`, `#event-help`, časovací pruh) zmizí nebo se přesune (tabulka v §9).
- **Výsledek = karta nad scénou:** dolet, rekord, mince, jedna věta příčiny, „Hodit znovu“ jako hlavní tlačítko, Dílna a Atlas vedle sebe, malá ikonka Menu (06 bod 3, 06 „Throw again přímo z výsledku“).
- **Nastavení** mimo save hry (jako dnes jazyk): jazyk, zvuk, pohyb, pomoc s časováním, smazání postupu, verze.
- **Save hry se nemění.** Nové nastavení má vlastní klíč v `localStorage`.
- Otevřené volby jsou v §15 jako `BLOCKED`, prototyp je umí přepnout v URL.

## 1. Mapa obrazovek a toky

```
                ┌────────── Nastavení ◄──────────┐ (panel, z menu i z pauzy)
                │                                 │
  Načítání ──► HLAVNÍ MENU ──Házet──► MÍŘENÍ ──pustit──► LET ──přistání──► VÝSLEDEK
                │  │  ▲                  │  ▲              │  ▲                │ │ │ │
                │  │  │                  Esc/❚❚            Esc/❚❚              │ │ │ └─ ⌂ Menu ──► HLAVNÍ MENU
          Dílna │  │ Atlas             PAUZA ─────────── PAUZA                 │ │ └─ Atlas (panel)
          (panel) (panel)              │ Pokračovat → zpět                     │ └─ Dílna (panel)
                │  │                   │ Nastavení → panel                     └─ Hodit znovu ──► MÍŘENÍ
                └──┴─ Házet ↗ ─────────│ Menu → HLAVNÍ MENU (z letu: hod doletí a započte se, §15 B2)
```

| Odkud | Akce | Kam | Poznámka |
|---|---|---|---|
| Menu | Házet | Míření | hlavní tlačítko, výchozí fokus |
| Menu | Dílna / Atlas / Nastavení | panel nad menu | zavření vrací fokus na tlačítko, které panel otevřelo |
| Dílna, Atlas | „Házet ↗“ v panelu | Míření | panel se zavře, obrazovka pod ním se nahradí |
| Atlas | „← Dílna“ (Atlas §2) | Dílna | panel se vymění, nevrství se |
| Míření | ❚❚ / Esc / systémové zpět | Pauza | nabíjení se zruší (`cancelHold`) |
| Míření | pustit (myš, dotyk, mezerník) | Let | |
| Let | ❚❚ / Esc / systémové zpět / skrytí karty | Pauza | fyzika i čas QTE stojí (běží na čase letu), držení se zruší (`flightCancel`) |
| Let | přistání | Výsledek | po dnešních 850 ms (reduced 300 ms) |
| Pauza | Pokračovat / Esc | zpět | 1 snímek bez fyziky, žádný skok `elapsed` (`last=0`) |
| Pauza | Menu | Menu | z letu podle §15 B2 |
| Výsledek | Hodit znovu / Enter (výchozí fokus) | Míření | jedno klepnutí (07 N10) |
| Výsledek | Dílna / Atlas | panel nad výsledkem | po zavření panelu je výsledek pořád vidět |
| Výsledek | ⌂ / Esc / systémové zpět | Menu | výsledek je uložený, nic se neztratí |

**Proč zásobník panelů a ne další obrazovky:** hráč se z Dílny vrací tam, odkud přišel (menu nebo výsledek), a „Házet“ je vždy jeden krok (07 §2.5 GAG „rychlý start bez vrstev menu“, 07 Z4 „neztěžuj nový pokus“). Atlas je panel už podle 06 (K Atlasu bod 1).

## 2. Obrazovky

### 2.1 Hlavní menu
Účel: krátký „titulní“ okamžik a rozcestí. Jedna výrazná věc = název hry (P1 „jedna výrazná věc na obrazovku“, bible pilíř 4).

```
Mobil na výšku 360 × 740                 Desktop 1280 × 800
┌──────────────────────────────┐        ┌─────────────────────────────────────────────────┐
│                     [1,240 ◈]│        │                                        [1,240 ◈] │
│                              │        │  JUST                                            │
│   JUST                       │        │  THROW IT          (živé město, vlaštovka krouží │
│   THROW IT                   │        │                     v pravé dvou třetinách)      │
│                              │        │  [ Házet ↗              ]                        │
│     (živé město, scéna       │        │  [ Dílna                ]                        │
│      prosvítá celou plochou) │        │  [ Atlas  •             ]                        │
│                              │        │  [ Nastavení            ]                        │
│  [ Házet ↗                 ] │ 56 px  │  Trasa dokončena. Dál už jen pro radost.         │
│  [ Dílna                   ] │ 48 px  │                                                  │
│  [ Atlas •                 ] │ 48 px  └─────────────────────────────────────────────────┘
│  [ Nastavení               ] │ 48 px  sloupec 320–360 px vlevo, 8vw od kraje
└──────────────────────────────┘        Mobil na šířku 932 × 430: název vlevo nahoře
tlačítka dole v dosahu palce                 menší (clamp), tlačítka sloupec vlevo dole,
(07 §2.7), mince vpravo nahoře               nic se nescrolluje
```

- **Název** „JUST THROW IT“ se nepřekládá (značka). Je to jediné místo s názvem (06 bod 1). `<h1>`.
- **Tlačítka** jsou `<button>` v `<nav aria-label="Main menu">`, pořadí Házet → Dílna → Atlas → Nastavení. Šířka na mobilu 100 % (max 360 px), výška 56 / 48 px, mezera 8 px.
- **Mince** vpravo nahoře: `1,240 ◈` (`tabular-nums`), `aria-label="1,240 coins"` (plurál). Bez tlačítka, bez animace v klidu (P12, mince jako informace).
- **Tečka na Atlasu** jen při nové, dosud neviděné věci (06 Atlas bod 4). Tvar + text v `aria-label` („Atlas, something new“), nikdy kvůli možnosti koupě. **Dílna tečku nemá** (P13).
- **Řádek pod tlačítky** jen po dohrání (Delivered): „Route complete. Fly for fun.“ Žádná výzva ani počet (P13, přirozený konec, 02 N6).
- **Scéna:** živé 3D město ve čtvrti nejvzdálenějšího místa, kamera pomalu pluje, vlaštovka občas proletí (nová kamera „menu“ v render3d, dávka M4). Reduced motion: statický záběr.
- **Prázdný stav (nový hráč, `attempts=0`):** viz §8 bod 1 a §15 B1 (doporučení: jen Házet a Nastavení, Dílna se objeví po 1. hodu, Atlas po 1. místě).
- **Načítací stav:** statické HTML menu se ukáže hned, tlačítka jsou `disabled` s textem „Unfolding the city…“ pod nimi (`role="status"`), dokud `ui.js` nenaváže obsluhu. Pozadí: barva podkladu, žádný spinner.
- **Chybový stav:** modul se nenačte (síť, starý prohlížeč) → po 8 s nebo při `error` na `<script type="module">` text „The game didn't load. Reload the page; your progress is safe.“ + tlačítko „Reload“. `<noscript>` dvojjazyčně napevno (jediná výjimka z i18n, JS neběží).

### 2.2 Hra: míření
```
┌──────────────────────────────────┐
│ 0 m                [1,240◈][❚❚] │  vlevo cíl, vpravo mince + pauza (44 px)
│ Next: Lighthouse Steps · 86 m    │  řádek cíle (§15 B3)
│        ┌ Drag to aim, hold… ┐    │  jen 1. hod (tutoriál), zmizí při prvním vstupu
│                                  │
│      ↗ (mířidla ve scéně)        │
│                                  │
│ [▼] 15° [▲]          [  Hold  ]  │  dole v rozích: úhel vlevo, Podrž vpravo
└──────────────────────────────────┘  Podrž 64 × 64 (mobil) / 72 × 56 s klávesou „Space“ (desktop)
```
- Míření tažením ve scéně zůstává hlavní (dnešní `aimPointer`). **Alternativa k tažení** (WCAG 2.5.7): tlačítka ▼ ▲ (44 × 44, krok 1°, podržení opakuje po 400 ms / 80 ms) a šipky na klávesnici. Dnešní `<input type="range">` mizí z viditelného UI; když je potřeba, zůstane jako vizuálně skrytý pro čtečky (`aria-valuetext="15°"`).
- **Nabití** ukazuje výplň uvnitř tlačítka Podrž (zleva doprava) a mířidla ve scéně. Dnešní samostatný pruh `.charge-track` mizí. Text tlačítka: „Hold“ → při držení „Let go!“ a síla v `aria-live` jen při puštění (ne každý snímek).
- **Zpět do Dílny** (`aim.cancel`) mizí, nahrazuje ho pauza → Menu (06 bod 2: pauza má Pokračovat, Nastavení, Menu).
- Text nápovědy `aim.intro` + `aim.controls` mizí. Učí se konáním (07 N1): v 1. hodu krátká bublina `aim.hint`, zmizí po prvním stisku. Popis kláves je v `aria-describedby` tlačítka Podrž.

### 2.3 Hra: let (HUD)
```
┌──────────────────────────────────┐
│ 4,876 m            [1,240◈][❚❚] │
│ Next: Rooftop Harbor · 124 m  +48│  „+48“ = mince tohoto hodu, u peněženky
│         ┌ Moon Docks ┐           │  banner nahoře uprostřed (nejvýš jeden)
│                                  │
│        ◯ (kruh QTE u vlaštovky)  │
│                     ✈            │
│                        [  Tap  ] │  akční tlačítko na místě Podrž
└──────────────────────────────────┘
```
- **Priority (zadání HUD):** stav (kruh QTE ve scéně, akční tlačítko) → cíl (dolet, další místo) → okamžitá zpětná vazba (banner) → ozdoba. Číslice `tabular-nums`, navrženo pro `4,876 m` / `4 876 m` a delší z EN/CS.
- **Dolet** vlevo nahoře 28–36 px (`clamp`), řádek cíle pod ním 14–16 px. Pod `max-width:650px` už ne 8 px jako dnes (07 A1): minimum 14 px.
- **Mince** vpravo nahoře: peněženka + během letu malý údaj „+48“ (dnešní `hud.reward`), který přičítá jen při změně (07 N7). Po přistání se nesčítá s animací v HUD, to dělá Výsledek.
- **Pauza** ❚❚ 44 × 44 vpravo nahoře, `aria-label="Pause"`, `aria-keyshortcuts="Escape"`.
- **Banner nahoře uprostřed, nejvýš jeden** (zadání HUD): pořadí přednosti událost > nová čtvrť / místo > milník. Dnešní `#milestone-banner` a zvýraznění `#scene-label` se slučují do jednoho prvku `#banner` (`role="status"`). Během aktivní události se milník nezobrazí (už dnes, `updateFlightUI`).
- **Akční tlačítko** je na stejném místě jako Podrž (svalová paměť). Mimo událost je zakázané se štítkem „Gliding“, při události „Tap“ / „Hold“ / „Let go“. Celá scéna je stále dotykový cíl (dnešní `pointerdown` na `#game`).
- **Časovací pruh** pod scénou mizí (kruh je ve scéně, 07 N6). Vrací se jako volba v Nastavení „Timing bar“ (pomoc bez postihu, §2.6), umístěný nad akčním tlačítkem.
- **Popis události** (`#event-help`) přestává být viditelný odstavec: krátká výzva je v banneru („Gust! Tap“), plný text jde do vizuálně skrytého `aria-live="polite"`.
- **Příběh místa** (`#journey-story`) za letu mizí: jméno místa je v banneru při vstupu, věta příběhu patří do Atlasu a do Výsledku (§9).

### 2.4 Pauza (panel)
```
┌──────────────────────────┐
│ Paused                   │
│ [ Continue             ] │  hlavní, výchozí fokus
│ [ Settings             ] │
│ [ Main menu            ] │
│ The throw lands on its   │  jen za letu (§15 B2)
│ own and counts.          │
└──────────────────────────┘
```
- Otevírá: ❚❚, Esc, systémové zpět, **automaticky** při skrytí karty (`visibilitychange`) nebo ztrátě fokusu okna za míření / letu. Dnešní text `#paused` se nahrazuje tímto panelem (po návratu na kartu zůstane otevřený, hráč pokračuje sám, nic mu neuteče). Při automatickém otevření řádek „Paused while the game was hidden.“
- Scéna pod scrimem stojí (poslední snímek), žádný rozmazaný efekt (výkon).
- Esc v pauze = Pokračovat. Esc v Nastavení otevřeném z pauzy = zpět do pauzy.
- Z míření je Menu bez poznámky (nic se neztrácí).

### 2.5 Výsledek
```
Mobil (karta zdola, scéna s přistálou vlaštovkou nad ní)     Desktop: stejná karta vpravo, 420 px
┌──────────────────────────────┐
│ New best!                [⌂] │  ⌂ 44 × 44, aria-label „Main menu“
│ 812.4 m                      │  40–56 px
│ +31.0 m over your best       │  nebo „Best: 1,204 m“
│ +48 ◈   Throw 10 ◈ + distance 38 ◈ │
│ Strong throw. A bit steeper next time. │  jedna příčina (07 N9 bod 2)
│ ▌New place: Lighthouse Steps │  jen když přibylo (07 N9 hierarchie)
│ Next: Rooftop Harbor · 124 m │
│ ▸ Throw details              │  <details>, sbalené
│ [ Throw again ↻            ] │  56 px, výchozí fokus, Enter
│ [ Workshop ] [ Atlas •     ] │  48 px, půl na půl
└──────────────────────────────┘
```
- **Hierarchie podle 07 N9:** 1) dolet a změna proti rekordu, 2) jedna příčina, 3) mince, 4) podrobnosti sbalené (čas, síla, úhel, události). Rozpis mincí zůstává (P7 přičitatelnost), ale malým písmem vedle součtu.
- **Události** srozumitelně (07 N11): „Events: 2 of 3 · perfect 1“.
- **Tlačítka vždy bez rolování:** karta má `max-height: 88dvh`, obsah nad tlačítky roluje, pás tlačítek je přilepený dole (07 N10).
- **Dílna / Atlas** otevřou panel nad výsledkem. Tečka u Atlasu podle 06.
- **Dnešní** `Upgrades` (`result.upgrades`) a `Workshop` se slučují do jednoho „Workshop“ (Dílna otevře rovnou strom, když je co koupit, jinak nahoře). Dnešní pruh `result-progress` k 500 m nahrazuje řádek „Next: …“ (Atlas `nextGoal`; do zavedení Atlasu milník 100 / 250 / 500 m).
- **Animace:** karta vyjede 320 ms ease-out, dolet a mince dopočítají za 480 ms. **Tlačítka fungují od prvního snímku**, klepnutí kamkoli na kartu dopočítání dokončí. Reduced motion: vše hned.
- Esc / systémové zpět = Menu (dnes Esc vede do Dílny).

### 2.6 Nastavení (panel)
```
┌ Settings                         [✕] ┐   mobil: celá obrazovka, desktop: 560 px
│ Language       [ EN | CS ]           │   segment, lang="en"/"cs", aria-pressed
│ Sound          Music  ━━━━●──  60 %  │   jen když je zvuk ve hře (§4)
│                Sound effects ━━━●─   │
│                [ ] Mute all          │
│ Motion         [Like device|Reduced|Full]  Now: reduced
│                Fewer camera moves, no shake or parallax. Feedback stays.
│ Timing help    [ ] Timing bar under the scene
│                (návrh) [ ] Wider timing windows  (§15 B4)
│ Progress       [ Reset progress ]    │   tlačítko v barvě chyby, otevře Potvrzení
│                Coins, upgrades, places and best distance. Settings stay.
│ PROTOTYPE 0.x · Arcade flight · Saved on this device.
└──────────────────────────────────────┘
```
- Změna se projeví **hned** (jazyk přepíše texty bez reloadu, dnešní `applyLang`), bez tlačítka Uložit. Potvrzení „Saved on this device.“ je statická věta, ne toast.
- Otevírá se z menu a z pauzy. Za letu jen přes pauzu, tedy nikdy nad běžící hrou.
- **Smazání postupu** (dnešní `#reset` v patičce s `confirm()`) se přesouvá sem a dostává vlastní panel Potvrzení (§2.8): `confirm()` nejde stylovat, přeložit tlačítka ani ovládat konzistentně.
- **Verze** (dnešní `#version` v patičce) je jen tady.
- **Přepínač vizuálního stylu** (2D motivy) z UI mizí bez náhrady; zůstává URL `?styl=` pro ladění, 2D je jen záloha do fáze f plánu 3D.

### 2.7 Dílna a Atlas (panely)
- **Dílna:** dnešní `<section id="workshop">` (modely Šipka / Kluzák, strom, detail) se přesouvá do `<dialog id="workshop">`. Mobil: celá obrazovka, vyjede zprava 320 ms; desktop ≥ 1024 px: modál max 1080 px. Hlavička: [✕ Back] „Workshop“ [mince]; dole přilepený pás „Throw it ↗“ (dnešní `#launch`).
- **Přínos předem:** detail uzlu má řádek „Now X → after Y“ (zadání „hodnota teď → po koupi“, 06 kolo 2). Dnešní `effectText` dává jen „+N % per level“; řádek teď/po koupi doplní game-dev z `UPGRADE` (do Atlasu stačí procenta za úroveň × úroveň).
- **Prázdná peněženka:** strom se ukáže celý s cenami, tlačítko koupě zakázané s textem „N coins short.“ (dnešní `detail.missing`); nad stromem jednou věta „No coins yet. Every throw earns some, even a short one.“ (bez výzvy k hraní navíc, P13).
- **Atlas:** beze změny podle Atlas spec (A1, B1). Mění se jen vstupy: z menu a z výsledku (ne z `page-nav`), zavření vrací na obrazovku pod ním. Tlačítka „← Workshop“ a „Throw ↗“ v hlavičce Atlasu zůstávají. `bonus.html` dál přesměruje na `./#atlas` (06), `#atlas` v URL otevře menu s Atlasem nahoře.

### 2.8 Potvrzení (malý panel)
„Start over?“ / text / [Keep my progress] (výchozí fokus) / [Delete progress] (barva chyby, ikona ⚠ + text, ne jen barva). Esc = ponechat. Po smazání: Menu ve stavu prvního spuštění, toast „Progress deleted.“

## 3. Stavy prvků

| Prvek | Výchozí | Hover (pointer:fine) | Stisk | Focus | Zakázaný | Chyba |
|---|---|---|---|---|---|---|
| Hlavní tlačítko (Házet, Hodit znovu, Continue) | plná výplň `--btn-primary-bg`, rám 3 px tuš, tvrdý stín 4 px | světlejší výplň | posun 3 px dolů-doprava, stín 1 px (100 ms) | obrys 3 px `--focus`, odsazení 3 px | `--btn-disabled-*`, bez stínu, `aria-disabled` + důvod v textu | – |
| Vedlejší tlačítko (Dílna, Atlas, Settings) | `--btn-bg` | `--btn-bg-hover` | jako výše | jako výše | jako výše | – |
| Ikonové (❚❚, ⌂, ✕, ▼▲) | 44 × 44, poloprůhledný podklad HUD | podklad plný | posun | obrys | – | – |
| Segment (EN/CS, Motion) | rám, zvolený plný + ✓ (ne jen barva) | | | | | |
| Přepínač (checkbox) | nativní `input` stylovaný, 24 px + popisek klikací přes `label` (cíl ≥ 44 px) | | | | | |
| Posuvník hlasitosti | stopa 6 px, jezdec 28 px, cíl 44 px výšky | | | | ztlumeno: zakázaný + text „Muted“ | |
| Akční tlačítko za letu | zakázané „Gliding“ | – | posun + výplň | obrys | mimo událost | – |
| Smazat postup | rám a text `--color-danger` + ⚠ | | | | | |

Focus je viditelný vždy při klávesnici (`:focus-visible`), nikdy nezakrytý HUD (WCAG 2.4.11).

## 4. Nastavení: co dnes existuje a kam se napojí

| Volba | Dnes | Úložiště | Napojení |
|---|---|---|---|
| Jazyk EN/CS | ✓ `applyLang`, přepínač v `page-nav` | `localStorage['just-throw-it-lang']` (mimo save) | přepínač se přesune do Nastavení, logika beze změny |
| Hudba, zvuky, ztlumit | modul `src/audio.js` hotový (`master`, `music`, `sfx`, `muted`, `tick`, `calm`, `latency`), **hra ho nenačítá** | `localStorage['just-throw-it-audio']` přes `loadAudioSettings` / `saveAudioSettings` | sekce Sound se ukáže, až hra načte audio (plán hudby). Do té doby skrytá, žádné mrtvé ovládání. `tick`, `calm`, `latency` zatím ne do UI (pokročilé, kalibrace latence je samostatná práce, P15) |
| Omezení pohybu | jen `matchMedia('(prefers-reduced-motion)')` v `ui.js` | nový klíč `localStorage['just-throw-it-settings']` `{motion:'system'|'reduce'|'full', timingBar:false}` | nový čistý modul `src/settings.js` (validace jako `audioSettings`), `ui.js` místo `reduced.matches` volá `reducedMotion()` = volba nebo systém. Předává se do renderu (`visual.reduced`) i do CSS (`<html data-motion="reduce">`) |
| Časovací pruh | HTML pruh existuje (`.timing`), dnes vždy vidět za letu | `settings.timingBar` | jen zobrazení existujícího prvku na novém místě |
| Širší okna časování | neexistuje | (návrh) `settings.assist` | **změna herní logiky** (`events.js` okna), §15 B4 |
| Smazat postup | `#reset` + `confirm()` v patičce | save hry | panel Potvrzení, volá dnešní `fresh()` + `persist()`. **Nastavení se nemaže** |
| Vizuální styl (2D) | `#theme-picker` | `just-throw-it-theme` | z UI pryč, URL `?styl=` zůstane |

**Save:** struktura save hry se nemění, migrace není potřeba. Nastavení jsou zařízení, ne postup: patří mimo save stejně jako jazyk a zvuk (pravidlo `.claude/rules/i18n.md`). Poškozená hodnota nastavení → výchozí hodnoty, save se nedotkne.

## 5. Dopad na `ui.js` (stavový automat)

Dnes: `state ∈ workshop | aim | flight | result` (result = otevřený `<dialog id="result">`), `show(next)` přepíná tři `<section>`.

Nově dvě vrstvy:
1. **Obrazovka** `screen ∈ loading | menu | aim | flight | result` (vždy právě jedna). `workshop` jako obrazovka zaniká.
2. **Zásobník panelů** `panels: ('workshop'|'atlas'|'settings'|'pause'|'confirm')[]`, nativní `<dialog>.showModal()` (top layer drží fokus, Esc vyvolá `cancel`).

Pravidla (čistá funkce v novém `src/screens.js`, testovatelná bez DOM):
- `pause` jen nad `aim` a `flight`; `workshop` a `atlas` jen nad `menu` a `result`; `settings` nad `menu` nebo nad `pause`; `confirm` jen nad `settings`.
- Herní smyčka běží (fyzika, nabíjení), jen když `panels.length===0` a `screen ∈ {aim, flight}`. Render běží vždy (menu kamera, scéna pod panely; s otevřenou pauzou stačí poslední snímek, šetří baterii).
- `back()` (Esc, systémové zpět, ✕): zavře horní panel; bez panelu: `aim`/`flight` → otevře `pause`; `result` → `menu`; `menu` → nic (systémové zpět opustí stránku).
- Vstupy hodu (`pointerdown` na `#game`, mezerník) se ignorují, když je otevřený panel. Dnešní `otherButton()` zůstává.
- Render dostává `state: screen` (`'menu'` nový, `'paused'` není potřeba, render dostane stejný `f` a `time` zamrzne).
- **Systémové zpět:** při otevření panelu `history.pushState({panel})`, `popstate` volá `back()`. Při `aim`/`flight` jeden záznam navíc, aby zpět otevřelo pauzu a neopustilo hru (stejný vzor jako Atlas §10).

Dotčené funkce: `show`, `prepare` (už nescrolluje stránku `scrollIntoView smooth`, 07 A6 ✗ se tím řeší), `workshop()` → `openPanel('workshop',{focusTree})`, `finish()` → `screen='result'` + karta (dnešní `<dialog id="result">` se mění na nemodální kartu `<section>` nad scénou, aby šly nad ní otevřít panely; fokus se přesune na „Throw again“), `visibilitychange` → `openPanel('pause',{auto:true})`, patička `#reset` → Nastavení.

## 6. Pohyb

| Přechod | Pohyb | Délka | Reduced motion |
|---|---|---|---|
| Menu → Míření | tlačítka a název odjedou dolů / zmizí (ease-in), HUD se objeví (ease-out), kamera sjede z menu záběru na start | 200 ms + 240 ms; kamera 600 ms | prolnutí 0 ms, kamera skočí |
| Panel Dílna / Atlas (mobil) | vyjede zprava 24 px + opacity | 320 ms ease-out / 240 ms ease-in | prolnutí ≈ 0 |
| Panel (desktop), Nastavení, Pauza | scale .96 → 1 + opacity, scrim 200 ms | 280 ms / 200 ms | ≈ 0 |
| Karta výsledku | vyjede zdola 24 px | 320 ms ease-out | ≈ 0 |
| Dopočítání doletu a mincí | čísla | 480 ms, přerušitelné klepnutím | hned |
| Banner | vyjede 8 px + opacity, drží 1,5 s (dnešní hodnota) | 150 ms / 150 ms | jen opacity |
| Stisk tlačítka | posun 3 px, stín | 100 ms | beze změny (není to pohyb scény) |
| Vlaštovka v menu | let po křivce každých ~12 s | – | vypnuto |

Animuje se jen `transform` a `opacity`. **Animace nikdy neblokuje vstup:** tlačítka panelu fungují od prvního snímku, dvojité klepnutí na „Házet“ nespustí dva hody (stav se mění hned, ne po animaci).

## 7. Přístupnost

| Bod | Řešení | WCAG / KB |
|---|---|---|
| Klávesnice | celé menu Tab / Shift+Tab, Enter / mezerník; ↑↓ v nav menu posouvají fokus (pohodlí, Tab funguje taky); Esc = zpět (§5) | 2.1.1, 07 A8 |
| Bez jednoklávesových zkratek písmeny | žádné „W = Dílna“ (2.1.4 by vyžadovalo možnost vypnout). Mezerník je herní ovládání jen v míření a letu, nad tlačítkem panelu aktivuje tlačítko | 2.1.4 |
| Fokus | při změně obrazovky na hlavní akci (Házet / Podrž / Hodit znovu / Continue), po zavření panelu na tlačítko, které ho otevřelo; panely přes `showModal` (fokus uvnitř). Žádný kladný `tabindex` | 2.4.3, 2.4.7, 2.4.11 |
| Dotykové cíle | hlavní 56 px, ostatní 48 px, ikonová 44 × 44, mezera ≥ 8 px; v rozích odsazení ≥ 12 px + `env(safe-area-inset-*)` (rohy jsou nejhorší, 07 Z25) | 2.5.8, 07 A9 |
| Tažení | míření má tlačítka ▼▲ a šipky | 2.5.7, 07 A10 |
| Stavové zprávy | jeden vizuálně skrytý `aria-live="polite"` pro: banner (místo, milník), výsledek události, „Paused“, toasty; dolet se **neohlašuje** každý snímek (jen ve výsledku) | 4.1.3 |
| Informace ne jen barvou | tečka Atlasu = tvar + text v názvu, zvolený segment ✓, Smazat ⚠ + text, výsledek QTE text v banneru | 1.4.1, 07 A4 |
| Kontrast | text ≥ 4,5 : 1, velký text a prvky UI ≥ 3 : 1. **HUD nad pohyblivou scénou má vždy podklad** (`--hud-bg`), ne text přímo na nebi (07 A2). Hodnoty pro dnešní tokeny Atlas §11; pro styl B změří art-director | 1.4.3, 1.4.11 |
| Velikost textu | nic informačního pod 14 px na mobilu (dnes HUD 8 px, štítek 7 px), dolet ≥ 28 px; text ve scéně má DOM ekvivalent (banner, aria) | 07 A1, N8 |
| Jazyk | `<html lang>` podle volby, tlačítka EN/CS mají vlastní `lang` | 3.1.1, 3.1.2 |
| Reduced motion | volba v Nastavení (Like device / Reduced / Full) přebíjí systém, platí pro CSS i render (otřes, paralaxa, kamera menu) | 2.3.3, 07 A6 |
| Pauza kdykoli | ❚❚, Esc, systémové zpět, automaticky při skrytí | 2.2.2, GAG |
| Orientace | na výšku i na šířku, nic se nezamyká | 1.3.4, 07 A11 |
| Pomoc s časováním | časovací pruh (hned), širší okna (§15 B4) | 07 A13 |
| `forced-colors` | rámy tlačítek a obrys fokusu zůstanou (`border`, ne jen `box-shadow`) | – |

## 8. Okrajové případy a možné zneužití

1. **První spuštění** (`attempts=0`): menu se ukáže (titulní okamžik, přístup k jazyku), ale jen Házet + Nastavení (§15 B1). Jedno klepnutí → míření s bublinou `aim.hint` → tutoriálový let (seed 1). Alternativa „rovnou míření bez menu“ je v prototypu `?first=direct`.
2. **Uprostřed letu do Menu:** podle §15 B2. Doporučení: hod se dopočítá (`while(!f.landed) step(f)`, nevyřízené události jako minutí) a započte, v menu toast „Throw counted: 812 m · +48 ◈“. **Zneužití:** žádné, dopočet bez vstupu je vždy horší nebo stejný než dohrát. Varianta „zahodit“ nemění seed (`attempts` se nezvýší), takže nejde „přetáčet“ události, ale tutoriál by se opakoval.
3. **Skrytá karta / telefonát:** automatická pauza, čas letu stojí. Po návratu panel zůstane (žádný odpočet „3, 2, 1“, P13 bez tlaku; hráč sám klepne Continue).
4. **Ztráta WebGL kontextu** (render3d už umí `webglcontextlost` / `restored`): UI je DOM, takže menu i panely fungují dál. Za ≥ 1 s ztráty chip nahoře uprostřed „Redrawing the city…“ (`role="status"`), za letu automatická pauza (hráč nehraje naslepo). Po obnovení „The city is back.“ na 2 s. Když se 3D nespustí vůbec, hra přejde na 2D (dnešní `fallback2d`) a jednou ukáže „3D isn't available here…“ v menu.
5. **Prázdná peněženka:** Dílna se otevře normálně (§2.7), nic se neskrývá. Žádné „Get coins!“.
6. **Konec hry (Delivered):** menu má řádek „Route complete. Fly for fun.“; „Házet“ zůstává hlavní. Atlas ukáže souhrn podle Atlas spec. Žádný nový tlak ani počítadlo.
7. **Poškozený save** (`loaded.warning`): dnešní `#warning` → poznámka v menu nad tlačítky (`role="status"`), zavíratelná ✕. Save se neztratí (pravidlo `storage.js`).
8. **Rychlé dvojí klepnutí** na Házet / Hodit znovu: stav se změní při prvním, druhé dopadne na scénu v míření a nic neudělá (míření začíná až `pointerdown` na scéně nebo Podrž). Ověřit, že `pointerup` z menu nespustí `release`.
9. **Esc během držení** (nabíjení nebo holub): pauza zruší držení (`cancelHold`, `flightCancel`), po Continue se musí stisknout znovu. **Zneužití:** pauza těsně před oknem QTE nedá výhodu, čas letu stojí a okno se po Continue nepřesune.
10. **Přepnutí jazyka v pauze:** texty HUD a banneru se přepíšou hned (`applyLang` + `refresh`), let pokračuje beze změny.
11. **Smazání postupu z pauzy** (Settings nad Pause): po potvrzení let skončí bez započtení a hra jde do menu ve stavu prvního spuštění.
12. **`#atlas` v URL** před prvním hodem: Atlas se otevře nad menu s prázdným stavem (Atlas spec, `scenario=empty`).
13. **Velmi úzká obrazovka 320 px:** menu bez vodorovného posunu, tlačítka 100 % šířky, HUD: dolet nahoře vlevo zkrátí řádek cíle na `…` (`text-overflow`), mince + pauza nikdy nepřetečou.
14. **Nízká výška na šířku (≤ 430 px):** karta výsledku vedle sebe dva sloupce (čísla | tlačítka), aby „Throw again“ byl vidět bez rolování.

## 9. Co se stane s dnešními prvky

| Dnes (`index.html`) | Nově | Klíče i18n |
|---|---|---|
| `<header>` logo „JUST THROW IT“ + „NEON CITY“ | název jen v menu (`<h1>`), „NEON CITY“ zmizí (styl B mění téma) | `brand.sub` → smazat |
| peněženka v hlavičce | menu vpravo nahoře + HUD | `wallet.label` použít v `aria-label` (plurál `menu.coins`) |
| `nav.page-nav` „01 / Workshop“, „02 / Atlas“ | tlačítka menu | `nav.label`, `nav.workshop`, `nav.atlas` → smazat |
| přepínač stylu | pryč z UI | `nav.style`, `nav.styleLabel`, `theme.*` zůstanou pro `?styl=`, nebo smazat s 2D (fáze f) |
| EN/CS v navigaci | Nastavení | `nav.lang` → `settings.language` (nebo ponechat `nav.lang`) |
| `.intro` (eyebrow, „Paper past the horizon.“, 2 řádky) | pryč (06 bod 4). Věta zůstává jen v `<title>` | `intro.*` → smazat; `meta.title` zůstává |
| `#journey-story` (příběh místa pod scénou) | za letu pryč; ve Výsledku řádek „New place: …“ a příběh v Atlasu | `story.line`, `story.farthest` → smazat, až Atlas B1 nese příběhy |
| `#scene-label` (čtvrť / „AIM AND HOLD…“) | banner při vstupu do čtvrti; v míření bublina 1. hodu | `scene.aim` → nahradit `aim.hint` |
| HUD 4 položky (DISTANCE, BEST, NEXT MILESTONE, REWARD) | dolet + řádek cíle + mince „+48“ | `hud.distance` (aria), `hud.best` → `hud.bestLine`, `hud.milestone` → `hud.next`, `hud.reward` → aria |
| `#milestone-banner` | jeden `#banner` | `banner.*` beze změny |
| `#paused` | panel Pauza | `scene.paused` = titulek pauzy |
| `#warning` | poznámka v menu | `translateMessage` beze změny |
| `section#workshop` | panel Dílna | `workshop.eyebrow` → smazat (číslování „01 /“ patřilo navigaci) |
| `section#flight` (eyebrow, titulek, akce, pruh, help) | akční tlačítko v rohu, banner, volitelný pruh, aria-live | `flight.eyebrow`, `flight.title` → smazat; `flight.tap/hold/release` → krátké `flight.btn*` |
| `section#aim` (eyebrow, titulek, intro, range, pruh nabití, Hold, Back, controls) | ▼ 15° ▲, Podrž s výplní, bublina 1. hodu | `aim.eyebrow`, `aim.title`, `aim.intro`, `aim.cancel`, `aim.panelIdle/Held` → smazat; `aim.controls` → `aria-describedby` |
| `<dialog id="result">` (6 statistik, pruh k 500 m, Again / Upgrades / Workshop) | karta Výsledek (§2.5) | `result.upgrades` → smazat; `result.retry` → `result.again` |
| `<footer>` verze + Reset progress | Nastavení | `footer.version`, `footer.reset` zůstávají, `footer.confirm` → `confirm.*` |

## 10. Texty (nové klíče)

Výchozí jazyk EN. Plurály: EN `{one,other}`, CS `{one,few,many,other}` (vybírá `count`). Čísla přes `num` / `unit` z `i18n.js`. „◈“ je symbol mince, ve čtečce `aria-label` s plurálem. Název hry se nepřekládá. Terminologie CS podle `cs.js`: Dílna, Atlas, mince, rekord, dolet, hod.

| klíč | EN | CS |
|---|---|---|
| `menu.label` | Main menu | Hlavní menu |
| `menu.play` | Throw | Házet |
| `menu.workshop` | Workshop | Dílna |
| `menu.atlas` | Atlas | Atlas |
| `menu.atlasNew` | Atlas, something new | Atlas, je tu něco nového |
| `menu.settings` | Settings | Nastavení |
| `menu.coins` | one: `{count} coin` · other: `{count} coins` | one: `{count} mince` · few: `{count} mince` · many: `{count} mince` · other: `{count} mincí` |
| `menu.loading` | Unfolding the city… | Rozkládám město… |
| `menu.delivered` | Route complete. Fly for fun. | Trasa dokončena. Dál už jen pro radost. |
| `menu.loadError` | The game didn't load. Reload the page; your progress is safe. | Hra se nenačetla. Načti stránku znovu, postup zůstal uložený. |
| `menu.reload` | Reload | Načíst znovu |
| `menu.dismiss` | Close note | Zavřít upozornění |
| `hud.pause` | Pause | Pauza |
| `hud.next` | Next: {place} · {distance} | Další: {place} · {distance} |
| `hud.bestLine` | Best {distance} | Rekord {distance} |
| `hud.throwCoins` | one: `+{count} coin this throw` · other: `+{count} coins this throw` | one: `+{count} mince za tento hod` · few: `+{count} mince za tento hod` · many: `+{count} mince za tento hod` · other: `+{count} mincí za tento hod` |
| `aim.hint` | Drag to aim. Hold, then let go. | Táhni a zamiř. Podrž a pusť. |
| `aim.angleDown` | Lower angle | Nižší úhel |
| `aim.angleUp` | Higher angle | Vyšší úhel |
| `aim.angleValue` | Angle {angle} | Úhel {angle} |
| `aim.holdShort` | Hold | Podrž |
| `aim.letGo` | Let go! | Pusť! |
| `aim.keys` | Arrows change the angle. Hold Space to charge, release to throw. | Šipky mění úhel. Podrž mezerník a pusť. |
| `flight.btnIdle` | Gliding | Plachtí |
| `flight.btnTap` | Tap | Klepni |
| `flight.btnHold` | Hold | Podrž |
| `flight.btnRelease` | Let go | Pusť |
| `pause.resume` | Continue | Pokračovat |
| `pause.menu` | Main menu | Hlavní menu |
| `pause.leaveCounts` | The throw lands on its own and counts. | Hod doletí sám a započítá se. |
| `pause.leaveDiscard` | This throw won't count. | Tento hod se nezapočítá. |
| `pause.away` | Paused while the game was hidden. | Pozastaveno, hra byla skrytá. |
| `settings.title` | Settings | Nastavení |
| `settings.close` | Close settings | Zavřít nastavení |
| `settings.language` | Language | Jazyk |
| `settings.sound` | Sound | Zvuk |
| `settings.music` | Music | Hudba |
| `settings.sfx` | Sound effects | Zvukové efekty |
| `settings.mute` | Mute all | Ztlumit vše |
| `settings.muted` | Muted | Ztlumeno |
| `settings.motion` | Motion | Pohyb |
| `settings.motionSystem` | Like device | Podle zařízení |
| `settings.motionReduce` | Reduced | Omezený |
| `settings.motionFull` | Full | Plný |
| `settings.motionNow` | Now: {value} | Teď: {value} |
| `settings.motionHelp` | Fewer camera moves, no shake or parallax. Feedback stays. | Méně pohybu kamery, bez otřesů a paralaxy. Zpětná vazba zůstane. |
| `settings.assist` | Timing help | Pomoc s časováním |
| `settings.timingBar` | Timing bar under the scene | Časovací pruh pod scénou |
| `settings.timingBarHelp` | A second, larger view of each timing window. | Druhý, větší pohled na okno časování. |
| `settings.wideWindows` | Wider timing windows | Širší okna časování |
| `settings.wideWindowsHelp` | No penalty. Coins and places stay the same. | Bez postihu. Mince i místa zůstávají stejné. |
| `settings.progress` | Progress | Postup |
| `settings.resetHelp` | Coins, upgrades, places and best distance. Settings stay. | Mince, vylepšení, místa a rekord. Nastavení zůstane. |
| `settings.saved` | Saved on this device. | Uloženo v tomto zařízení. |
| `confirm.title` | Start over? | Začít znovu? |
| `confirm.body` | This deletes coins, upgrades, places and your best distance. It can't be undone. | Smaže mince, vylepšení, místa i rekord. Nejde to vrátit. |
| `confirm.keep` | Keep my progress | Nechat postup |
| `confirm.delete` | Delete progress | Smazat postup |
| `confirm.done` | Progress deleted. | Postup smazán. |
| `result.titleRecord` | New best! | Nový rekord! |
| `result.overBest` | +{distance} over your best | o {distance} dál než rekord |
| `result.bestLine` | Best: {distance} | Rekord: {distance} |
| `result.coinsLabel` | one: `{count} coin earned` · other: `{count} coins earned` | one: `získána {count} mince` · few: `získány {count} mince` · many: `získáno {count} mince` · other: `získáno {count} mincí` |
| `result.newPlace` | New place: {place} | Nové místo: {place} |
| `result.next` | Next: {place} · {distance} to go | Další: {place} · zbývá {distance} |
| `result.details` | Throw details | Podrobnosti hodu |
| `result.eventsLine` | {hits} of {total} · perfect {perfect} | {hits} z {total} · perfektně {perfect} |
| `result.again` | Throw again | Hodit znovu |
| `result.atlas` | Atlas | Atlas |
| `result.menu` | Main menu | Hlavní menu |
| `status.glLost` | Redrawing the city… | Překresluji město… |
| `status.glBack` | The city is back. | Město je zpět. |
| `status.glFlat` | 3D isn't available here, so the city is drawn flat. Everything else works. | 3D tu nejde spustit, město je proto nakreslené naplocho. Vše ostatní funguje. |
| `status.counted` | Throw counted: {distance} · +{count} ◈ | Hod započítán: {distance} · +{count} ◈ |
| `workshop.empty` | No coins yet. Every throw earns some, even a short one. | Zatím žádné mince. Každý hod nějaké přinese, i ten krátký. |
| `workshop.preview` | Now {now} → after {after} | Teď {now} → po koupi {after} |
| `workshop.back` | Back | Zpět |
| `branch.power.what` | Launch speed | Rychlost výhozu |
| `branch.paper.what` | Glide | Klouzavost |
| `branch.fold.what` | Event windows | Okna událostí |
| `detail.max` | Max level | Nejvyšší úroveň |

Texty jsou bez rodu hráče (pravidlo `research/atlas/03-texty.md`).

**Jen v prototypu (do hry ne):** `proto.*` (zástupné texty událostí, nápovědy a milníku; ve hře je mají `events-view.js` a `throw.*`), `atlas.*` (zjednodušený Atlas; hra má texty z Atlas spec), `meta.title` prototypu.

**Použité beze změny:** `scene.paused` (titulek pauzy), `footer.reset` (tlačítko v Nastavení), `footer.version`, `result.title`, `result.goal`, `result.distance`, `result.time`, `result.power`, `result.angle`, `result.events`, `result.breakdown`, `result.workshop`, `result.gliderUnlocked`, `detail.missing`, `detail.buy`, `workshop.launch`, `banner.*`, `branch.*`, `model.*`. Prototyp má i krátké zástupné texty událostí („Gust! Tap“), ve hře je dodává `render3d/events-view.js`.

## 11. Tokeny (tři vrstvy)

Primitivní a sémantické tokeny jsou v `style.css` (P1), menu je přebírá. **Nové** (prototyp `prototype/menu/menu.css`):

| Vrstva | Token | Hodnota (dnešní styl) | Poznámka |
|---|---|---|---|
| sémantický | `--color-danger` | `#ff8a8a` (nový primitiv `--red-300`) | Smazat postup, chyby; na `--plate` ≈ 6,7 : 1 (výpočet z hex) |
| sémantický | `--color-new` | `var(--coin)` | tečka novinky (Atlas spec ji má zlatou) |
| sémantický | `--surface-hud` | `var(--hud-bg)` | podklad všech prvků HUD nad scénou |
| sémantický | `--scrim` | beze změny | pod panely |
| komponentový | `--menu-title-fg`, `--menu-title-shadow` | `var(--text)`, `var(--print-shift)` | jedna výrazná věc: tiskový posun názvu |
| komponentový | `--menu-btn-h`, `--menu-btn-primary-h` | 48 px, 56 px | |
| komponentový | `--hud-distance-size` | `clamp(28px, 6vw, 40px)` | |
| komponentový | `--hud-chip-bg`, `--hud-chip-fg` | `var(--surface-hud)`, `var(--text)` | dolet, mince, pauza, banner |
| komponentový | `--corner-btn-h`, `--corner-btn-w` | 64 × 104 px (mobil) / 56 × 132 px (desktop) | Podrž, akce |
| komponentový | `--result-w` | `min(100%, 420px)` | |
| komponentový | `--panel-w` | `min(100%, 1080px)` | Dílna, Atlas |
| komponentový | `--sheet-r` | `var(--r-dialog)` | |
| komponentový | `--dot-new` | `var(--color-new)` | |

Typografie: `--display` (zúžené, tučné) pro název, tlačítka a čísla, `--body` pro text. Velikosti přes `clamp()`: název `clamp(44px, 12vw, 112px)`, tlačítka 18–20 px, HUD dolet 28–40 px, text 15–16 px, nic informačního pod 14 px.

**Styl B:** prototyp `?skin=paper` mění jen sémantickou vrstvu (krém `#f6eedd` / karta `#fbf4e4`, grafit `#2b2725`, měkký stín místo tvrdého, hodnoty z `04-nove-smery.md` B). Finální hodnoty dodá bible `05-styl-papir.md`.

## 12. Mobil a desktop
- **Mobil na výšku (360–430):** menu sloupec dole, výsledek jako karta zdola, panely přes celou obrazovku. Reflow do 320 px bez vodorovného posunu.
- **Mobil na šířku (≤ 500 px výšky):** menu vlevo (název nad tlačítky, menší), výsledek dva sloupce, Dílna dva sloupce (Atlas spec zlom 760 px / výška ≤ 560 px).
- **Desktop (≥ 1024 × 600):** menu sloupec vlevo, scéna vpravo volná; výsledek karta vpravo 420 px (scéna s přistáním vlevo vidět); panely jako modál; na tlačítkách Podrž a akce štítek klávesy „Space“ (`@media (pointer:fine)`).
- Scéna (`#scene3d` + `#game`) je **přes celé okno** (`position:fixed; inset:0`), ne 16 : 9 v rámu. Dopad na render: kamera musí počítat s výškou na výšku (render3d už čte `canvas.clientWidth` × DPR; ověřit poměr stran, dávka M4).

## 13. Dávky pro game-deva (bez překryvu souborů)

| Dávka | Obsah | Soubory (vlastník) | Závisí na | Test |
|---|---|---|---|---|
| **M1 Texty** | klíče z §10 do obou slovníků; zatím nic nemazat (staré klíče smaže M3) | `src/locales/en.js`, `src/locales/cs.js` | – | `tests/i18n.test.js` shoda |
| **M2 Nastavení** | čistý modul `src/settings.js`: `SETTINGS_KEY='just-throw-it-settings'`, `settingsFrom(raw)` validace, `loadSettings/saveSettings` (try/catch jako audio), `reducedMotion(settings, systemReduce)` | `src/settings.js`, `tests/settings.test.js` | – | poškozený JSON → výchozí, neznámé klíče zahodit |
| **M3a Automat obrazovek** | čistý `src/screens.js`: `createNav()`, `open(nav,panel)` s povolenými kombinacemi (§5), `back(nav)`, `go(nav,screen)`, `loopRuns(nav)` | `src/screens.js`, `tests/screens.test.js` | – | tabulka toků §1 jako test |
| **M4 Kamera menu** | render3d: `visual.state==='menu'` = klidný záběr čtvrti nejvzdálenějšího místa (`visual.best`), pomalý pohyb, vlaštovka občas proletí; reduced = statický; přechod menu → míření 600 ms; ověřit plné okno na výšku | `src/render3d/*` | – | `__r3d.snapshot` pro `state:'menu'` |
| **M3b Integrace UI** | `index.html` (nová kostra: `#menu`, `#hud`, rohová tlačítka, karta výsledku, `<dialog>` workshop / settings / pause / confirm, `noscript`), `style.css` (sekce menu, HUD, panely; scéna přes celé okno), `src/ui.js` (napojení M2, M3a, Esc / popstate, auto-pauza, dopočet letu §15 B2, focus, odstranění `.intro`, `page-nav`, patičky, `confirm()`), smazání starých klíčů ze slovníků | `index.html`, `style.css`, `src/ui.js`, `src/locales/*` (jen mazání) | M1, M2, M3a | `npm test`; ruční průchod §1 v Chrome 360 / 932 × 430 / 1280, EN i CS |
| **M5 Zvuk v Nastavení** | až hra načte `audio.js`: sekce Sound v panelu Nastavení | `src/ui.js`, `index.html` | M3b, plán hudby | – |
| **B1 Atlas** (stávající plán) | vstupy z menu a výsledku místo `page-nav` | `src/atlas-ui.js` + háček v `ui.js` | M3b | – |

M1, M2, M3a a M4 jdou souběžně (worktree), M3b po nich. Dávka M3b je velká; když je potřeba ji dělit, pak po souborech ne: rozdělit na **M3b-1** (kostra HTML + CSS + přepínání obrazovek a panelů, bez změny herních vstupů) a **M3b-2** (míření a let v rozích, auto-pauza, dopočet letu, výsledek jako karta), postupně, ne souběžně.

## 14. Co je zástupné
- Všechna čísla v prototypu (mince, dolety, ceny, jména míst „Next: …“) jsou vymyšlená. Délky animací jsou cílové hodnoty ze zadání, ladit po playtestu.
- Pozadí prototypu je zástupné 2D město v canvasu (ne 3D), jen aby šlo posoudit čitelnost HUD nad scénou a rozložení.
- Dílna a Atlas jsou v prototypu zjednodušené (struktura panelu, prázdný stav, náhled teď → po koupi). Plný Atlas je `prototype-atlas.html`.
- Vzhled je hrubý (tokeny P1); styl B dodá art-director.

### Poznámka pro M3b (historie)
 synchronizace zásobníku s `history` (počítadlo vlastních záznamů, `history.go(-n)` při zavření z UI, ignorovat vlastní `popstate`) je v prototypu `prototype/menu/main.js` funkce `sync()`. Rychlé otevření panelu dřív, než doběhne `history.go(-1)`, může počítadlo rozhodit o jeden záznam; ve hře přidat ochranu (čekat na `popstate`, než se pushne další záznam).

### Prototyp a ověření
`prototype-menu.html` + `prototype/menu/` (`texts.js` slovníky EN/CS s klíči z §10, `scene.js` zástupné 2D město, `main.js` automat obrazovek a panelů, `menu.css` tokeny ve třech vrstvách). Panel „Prototyp“ u levého okraje (česky, není součást hry).

| URL | Význam |
|---|---|
| `?scenario=first|early|mid|broke|long|delivered|loading|error` | falešný save; `long` = nejdelší čísla (4 876 m, 98 765 ◈) |
| `?lang=en|cs` | jazyk (jinak poslední volba v Nastavení, výchozí EN) |
| `?skin=paper` | náznak stylu B jen výměnou sémantických tokenů |
| `?first=reveal|all|direct` | B1 |
| `?leave=count|discard|hide` | B2 |
| `?goal=1|0` | B3 |
| `?assist=1` | B4: volba „Wider timing windows“ v Nastavení |
| `?motion=system|reduce|full` | omezení pohybu |
| `#atlas` | otevře Atlas nad menu |

Panel prototypu umí i ztrátu a obnovení WebGL, varování save a simulaci skrytí karty (automatická pauza). Nastavení prototypu se ukládá do `localStorage['proto-menu-settings']` (ne do klíčů hry).

**Ověření v prohlížeči: NOT ASSESSED** (zadání: prohlížeč nepoužívat, ověří orchestrátor). Kód nebyl spuštěn ani syntakticky zkontrolován nástrojem. K ověření: 320 / 360 / 375 × 667, 932 × 430, 1280 × 800, EN i CS, `scenario=long` (přetečení HUD), klávesnice (Tab, šipky v menu, Esc v každém stavu, mezerník v míření a letu), systémové zpět, reduced motion, `skin=paper`, kontrast HUD nad nejsvětlejším místem scény.

## 15. Otevřené volby
**B1 První spuštění.** A) menu se všemi čtyřmi tlačítky; B) menu jen s Házet + Nastavení, Dílna se objeví po 1. hodu (jsou mince), Atlas po 1. nalezeném místě; C) bez menu, rovnou míření (tutoriál), menu až po prvním výsledku. Doporučení **B**: titulní okamžik zůstane, hráč neotevře prázdnou Dílnu, novinky přicházejí postupně (07 N5, P14), hod je pořád na jedno klepnutí (GAG). C je nejrychlejší, ale první dojem je „hra bez menu“ a jazyk je schovaný. Prototyp: `?scenario=first` (B), `&first=all` (A), `&first=direct` (C).

**B2 Menu uprostřed letu.** A) hod doletí sám bez vstupu a započítá se (toast v menu); B) hod se zahodí a nezapočítá; C) za letu v pauze Menu není. Doporučení **A**: nic se neztrácí (P13 bez hrozby ztráty), nejde zneužít (dopočet bez QTE je horší), jednoduché (`step` do přistání). Prototyp: `?leave=count|discard|hide`.

**B3 Řádek cíle v HUD.** 06 bod 2 říká „malý HUD (vzdálenost, mince)“. A) jen dolet; B) dolet + malý řádek „Next: Lighthouse Steps · 86 m“. Doporučení **B**: blízký pojmenovaný cíl je hlavní tah hry (08 „Co táhne“, P6, P3) a dnes je v HUD taky („Next milestone“). Prototyp: `?goal=0|1`.

**B4 Širší okna časování jako nastavení.** Přístupnost žádá pomoc s QTE bez postihu (07 A13), Atlas má „automatiku QTE“ jako kupovaný uzel (06). A) jen časovací pruh (hotový prvek, žádná změna logiky); B) navíc „Wider timing windows“ (×1,5, bez vlivu na mince a místa) = změna `events.js`; C) B + volba „auto-splnění“. Doporučení **B**: pomoc pro hráče s motorickým omezením nemá být za mince; uzly v Atlasu zůstanou pohodlím pro ostatní (jiný účinek: automatika vs. širší okno). Prototyp: `?assist=1` ukáže volbu.
