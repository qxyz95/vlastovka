# Art review U5 (úvod, postavička C, nová obrazovka) — 15. 10. 2026

Zadání: art review před předáním k hraní (větev `f3-3d-prototypy`, HEAD 3292ccd). Měřítko: bible `research/design/05-styl-papir.md` (schválená), `research/plan-hratelnost/03-art.md` kap. 1–2, `02-ux.md` §1.3–1.5 a §6. Kód se neměnil.

## Hotové kroky
1. Přečtena bible (kap. 1, 2, 6–10), 03-art kap. 1.6–2.4 a dávky, 02-ux §1.3–1.5 a §6, stav, run U5.
2. Prohlížeč: server 4192, vlastní záložka, `?timer`, iframy 360×740 + 1280×800, pak 375×667 (CS) + 932×430, pak 2560×1277 (velikost okna orchestrátora) a 1280×800 `?dev=1`. Úvod, míření (držení), hod → výsledek, Dílna (desktop i mobil), Menu, Nastavení, Atlas (jen DOM). 8 snímků (1 celý, 7 výřezů), detaily z DOM (`getComputedStyle`) a z kódu (`ui-layer.js drawIntro/drawAim`).
3. Úklid: záložka zavřena, server 4192 zastaven (Stop-Process jen pro port 4192).

## Rozpracovaný krok
- žádný

## Jak bylo měřeno
- Okno bylo skryté (`document.hidden = true`), ale s `?timer` se scéna kreslila a snímky šly pořídit, vzhled je tedy hodnocen. Reduced motion **NOT ASSESSED** (nešlo emulovat).
- Velikost písma na plátně (nápis úvodu, panel mířidel) není v DOM: spočtena z kódu. Plátno UI má logickou šířku 640, kreslí se se škálou `s = šířka CSS / 640`; nápověda navíc s `uiScale = clamp(576/šířka, 1, 2)`.
  - `drawIntro` (`src/render3d/ui-layer.js` ř. 348–368, `INTRO_TITLE = {size: 36, sub: 13}`): „Throw it“ má 36·s px a nápověda 13·s·uiScale px.
  - Výsledné velikosti v CSS px:

    | Šířka okna | „Throw it“ | Nápověda |
    |---|---|---|
    | 360 | 20 | 11,7 |
    | 375 | 21 | 12 |
    | 932 | 52 | 19 |
    | 1280 | 72 | 26 |
    | 2560 | 144 | 52 |

    Token `--prompt-size` je `clamp(32px, 9vw, 72px)` a `--prompt-hint-size` je `clamp(15px, 3.8vw, 18px)` (02-ux §6, `style.css` ř. 123–125).
  - `drawAim` (ř. 403): popisek panelu je napevno `bold 13px` logických, tedy na 360 px jen 7,3 CSS px.
- Velikost dítěte odhadnutá ze snímků (± 15 %):

  | Záběr | Zjištěno | Spec 03-art |
  |---|---|---|
  | úvod, desktop | ~60 px | 51 |
  | úvod, 375 na výšku | ~29 px | 25 |
  | úvod, 932 na šířku | ~26 px | 37 |
  | míření, desktop | ~91 px | 64–96 |
  | míření, 360 na výšku | ~62 px | – |

## Nálezy

### A. Patří do této opravy (před hraním)

| # | Závažnost | Co je špatně | Pravidlo | Návrh opravy |
|---|---|---|---|---|
| A1 | **MUSÍ před hraním** | **Úvod 1280×800: nápověda „Hold the mouse anywhere. Move to aim. Let go.“ leží přes titul JUST THROW IT.** Titul `#title h1` má 112 px a box 12–572 × 68–274 px. Nápověda je na plátně na y ≈ 202 px, má 26 px a šířku ~760 px (x 260–1020). Druhý řádek „THROW IT“ ji přeškrtává. Navíc dva velké nápisy (titul 112 px a „Throw it“ 72 px) soupeří o pozornost. | bible kap. 1 P4 (jeden vrchol pozornosti), kap. 9.2 Úvod („nic nezakryje“), 02-ux §1.3 (titul vlevo nahoře, výzva uprostřed v 28 %) | (1) Na plátně brát velikost z tokenů v CSS px, ne ze šířky: v `drawIntro` přepočítat `size = clamp(32, 0.09·cssW, 72) / s` a `sub = clamp(15, 0.038·cssW, 18) / s` (cssW = šířka plátna v CSS px, s = cssW/640). Tím nápověda na desktopu klesne na 18 px a ~420 px šířky. (2) Zmenšit desktopový titul: `--title-size: clamp(44px, 6.5vw, 88px)` (`style.css` ř. 132; na 1280 je to 83 px, box ~12–420 × 68–220). Kontrola: obdélník nápovědy a titulu se nesmí protínat na 1280×800, 1440×900 ani 1920×1080. Test: čistá funkce velikosti nápisu (cssW → px) s mezemi 32/72 a 15/18. |
| A2 | **MUSÍ před hraním** | **Velké okno (2560×1277, okno orchestrátora i uživatele, DPR 1,5): nápis úvodu má 144 px a nápověda 52 px, ale UI zůstává v pevných px.** Dílna je 880×496 px (34 % šířky) a písmo v ní má 13–28 px. Čipy HUD mají 25,6 px. Vedle obřího nápisu na plátně působí UI drobně, na zmenšeném snímku 1568 px má popisek 13 px jen ~8 px. Tohle je nález orchestrátora „drobné písmo v Dílně“. Písmo samo není pod normou, rozbité je měřítko: plátno roste se šířkou okna, UI ne. | bible kap. 8 (jeden systém tokenů), P4 | (1) Oprava A1 srovná plátno s tokeny (strop 72/18 px). (2) Na velkých oknech zvětšit kontejnery UI jedním krokem, ne každé písmo zvlášť: `@media (min-width: 1700px) and (min-height: 1000px) { :is(dialog.panel, #result, .hud, #title, .corner) { zoom: 1.25 } }` a `@media (min-width: 2200px) and (min-height: 1200px) { … { zoom: 1.5 } }`. `zoom` nedávat na `html` ani na `#game` (souřadnice mířidel). Ověřit klik na uzly Dílny a pozici `#result` (vpravo 420 px · 1,5). Alternativa bez `zoom`: `dialog.wide { width: min(1100px, …) }` a +2 px u `.model > span`, `.node small`, `.eyebrow`, `p` v panelech. |
| A3 | **MUSÍ před hraním** | **Telefon na výšku (360 / 375): výzva „Throw it“ má jen 20–21 px a nápověda 11,7–12 px.** Je menší než titul JUST THROW IT (32,4–33,8 px). Hierarchie je obrácená: hlavní pokyn hry je nejmenší text na obrazovce. | 02-ux §6 (`--prompt-size` ≥ 32 px, nápověda ≥ 15 px), bible kap. 8, P4 | Opraví stejná funkce jako A1 (minimum 32 / 15 px). Titul na výšku zmenšit na `#title h1 { font-size: clamp(24px, 7.5vw, 30px) }` (`style.css` ř. 1134), aby výzva byla největší. |
| A4 | **MĚLO BY** | **Na šířku 932×430 je „Throw it“ (52 px) nalepený na horní hraně** v řádku HUD mezi titulem a čipem mincí (y ~13–55 px) a nápověda sedí těsně nad hřebenem střechy. | 03-art kap. 2.2 (pás textu na šířku 0,04–0,18 výšky), kap. 9.2 | S A1 klesne nápis na 32–38 px. Pás `INTRO_SHOT.text` (`models/launch-site.js` ř. 87) rozdělit podle orientace jako u `at` / `landAt`: `landText: [0.06, 0.20]`, aby horní okraj nápisu ležel pod řádkem HUD (≥ 60 px). |
| A5 | **MĚLO BY** | **Postavička C v míření (desktop ~91 px): rajčatový proužek čepice sedí ve výšce očí a oči nejsou vidět.** Působí to jako páska přes oči. | 03-art kap. 1.3 („obličej musí být vidět, proužek 0,03 m nad očima“), H2 kontrolní bod „oči vidět v míření na 96 i 64 px“ | Na `prototype-katalog.html` ověřit pózu míření na 96 a 64 px. Návrh: kloub čepice `[−.01, .255, 0]` → `[−.01, .285, 0]` (`kid-rig.js`), nebo oči větší a níž: `plateX(0.165, 0.13, ±0.055, 0.03)` (`kid.js` ř. 207–208). Vlastník H2 (game-dev). |
| A6 | **MĚLO BY** | **Lidé na sousedních střechách v úvodu a míření** (krabicoví, růžový a bílý/krémový) jsou na obrazovce větší než dítě (~60 px proti ~60/91 px), přestože jsou dál. Bílá postava stojí v pásu výhledu za pavlačí. | bible kap. 3.1 M-1 (jedno měřítko), kap. 6 bod 7 („kolem ruky nic bílého“), S-6 | Rychlá oprava před hraním: v místě odhodu (`cityChunk(0)`, do ~60 m od ruky) lidi na střechy nesázet a bílou z barev `person` tam vynechat. Měřítko lidí (1,6–1,8 m) srovnat s dítětem 1,2 m. Plné řešení je H4. |
| A7 | **POZDĚJI** (malé, klidně hned) | Panel Dílny na mobilu má šedý systémový posuvník. | bible kap. 8 (papír na stole) | `dialog.panel, #result { scrollbar-width: thin; scrollbar-color: var(--kraft-400) transparent; }` |

### B. Už naplánované v dávkách (nezadávat znovu, jen ověřit při dávce)

- **U6:**
  - Rohový panel `#aim` („Throw angle 15°“ + „Hold and release · Space“, 300 × 151 px na 932, 240 × 160 na 375) na mobilu i na šířku ořezává zábradlí pavlače.
  - Tlačítko Settings / Nastavení vlevo dole na titulu (dočasné).
  - **Pozor:** na plátně je ještě panel „RELEASE AT PEAK POWER“ s lištou síly (`ui-layer.js drawAim`, ř. 392–414). Má pevné souřadnice 205–470 × 168 a písmo 13 px logických, takže na 360 px jen **7,3 CSS px**, na 1280 px 26 px verzálkami. U6 maže klíče `aim.panelIdle/panelHeld`, ale `ui-layer.js` nemá v seznamu souborů (02-ux §8). Doporučení: přidat `src/render3d/ui-layer.js` do U6, nebo panel na plátně smazat zároveň s klíči.
- **U7:**
  - Karta výsledku je obsahově přeplněná. Řádek „Strong throw · Try much steeper · ★ New best! · Glider unlocked!“ má 4 sdělení v jedné větě 16 px. Rozpis „Throw 10 ◈ + distance 14 ◈“ má 14 px `pencil`.
  - Rozměry karty jsou podle specu a vzhledově sedí: desktop vpravo 420 × 716 px od y 72, vzdálenost 56 px, na mobilu zdola.
- **U8 / S2 (záběr domova a na výšku):**
  - Na výšku 360×740 je ruka v míření na x ≈ 0,18 šířky, spec je 0,40 (bible 9.2) a dům je uříznutý.
  - Dílna je dialog uprostřed (880 px) nad kartou výsledku. Bible 9.2 chce panel vpravo / dole se záběrem stolu 5 m.
- **H4:** krabicoví lidé obecně, tmavé hejno ptáků v nebi (vidět za Dílnou vlevo nahoře; bible kap. 6 bod 2: v pásu letu nic grafitového).
- **B1:** Atlas je zatím zástupný („The Atlas is on its way“, ◇ 72 px `warm-grey`). Vzhled pohlednic **NOT ASSESSED**.

### C. Co je dobré a nechat
- Úvodní kompozice na desktopu odpovídá 03-art kap. 2.2: dům v řezu vlevo, dítě na pavlači vpravo od středu, slunce vpravo, nápis v nebi nad hřebenem. Za dítětem není kouř.
- Paleta UI je čistě z tokenů. Grafit × krém 13,9, `pencil-600` × krém 5,6 (popisky `dt`, eyebrow), `mustard-800` × krém 5,5 (mince, „Total“), krém × `tomato-600` 4,8 (hlavní tlačítka 18 px tučně), zamčené uzly `pencil-700` × krém 9,4. Všechny změřené dvojice splňují WCAG AA. Písmo `--display` (Trebuchet) a `--body` (Segoe UI) sedí, `--hand` je jen v titulku výsledku („Throw complete!“, 36 px).
- HUD: krémové čipy natočené ±1°, vzdálenost vlevo nahoře, mince vpravo, ☰ 48 × 48. Na prvním hodu ukazuje „0 m“ podle §1.4.
- Menu: krémová karta 400 px uprostřed, tlačítka 48 px. Nastavení: 400 × 565 px, všechny cíle ≥ 44 px, danger s ⚠. Tlačítko „+1000 coins (dev)“ je jen s `?dev=1`.
- Dílna: karty s páskou, zamčené uzly obrysem tužkou, `#buy` hořčicová, písmo 13–28 px na 1280. Na mobilu panel zdola od y 89 (HUD zůstává vidět) a roluje.
- Postavička C v míření: objem čitelný, vlaštovka se kreslí přes ruku, zábradlí tmavomodré, pláštěnka `#f2b65a`, čepice kraft.

### D. Rozpory kód × spec
1. `drawIntro` škáluje nápis se šířkou plátna, tokeny `--prompt-size` / `--prompt-hint-size` v 02-ux §6 jsou v CSS px s horní mezí. Platí spec (A1–A3).
2. `INTRO_SHOT.text` je jeden pás `[0.08, 0.28]`. 03-art kap. 2.2 má různé pásy pro desktop, na šířku a na výšku. Platí 03-art (A4).
3. Oči postavičky C nejsou v míření vidět (03-art kap. 1.3 a H2). Platí 03-art (A5).

### E. NOT ASSESSED
- Reduced motion (úvod střihem, dítě nedýchá).
- Čtvrti 2–4, let s událostí a QTE, banner.
- Čitelnost dítěte v šedi (bible kap. 16.2).
- Atlas s obsahem.
- Skutečný telefon (dotyk; nápověda „Hold the mouse…“ se v iframu ukazuje myší varianta).
- Výkon (`perf-check`).
- Póza výhozu a mávání.
- Konzole: jediná výjimka `ui.js:691 setHidden` vznikla nejspíš na hostitelské stránce, kterou jsem přepsal `document.write` (běžela dál smyčka hry bez DOM). Jako chyba hry neověřeno.
