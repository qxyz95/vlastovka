# Vyhodnocení: poznámky tvůrce z hraní (15. 10. 2026)

Zdroj: `2026-10-15-poznamky-tvurce.md` (doslovné poznámky). Hrál jeden člověk, tvůrce hry, bez logu (`?playtest=1` není). Podle pravidel KB 09 §2.11 jde o **jednotlivý nález**, ne o opakovaný problém. Poznámky ale píše tvůrce, takže nejsou data o hráčích, ale **zadání směru**. Proto je bereme jako podklad pro návrh, ne jako důkaz. Ověří je až playtest s cizími lidmi.

Build: větev `f3-3d-prototypy`. Stav po S4 (místo odhodu v papíru) a G3 (modely trhu), kolem commitu `9d9ce57`.

## Výklad poznámek (orchestrátor; kde si nejsem jistý, je to označené)

| # | Poznámka (zkráceně) | Jak ji chápu | Druh | Komu |
|---|---|---|---|---|
| N1 | Účinek QTE má záviset na rychlosti vlaštovky. Když skoro u země stihnu QTE, doletím ještě daleko. | Dnes QTE dává pevný „push“ (`push.perfect` × π). Proto i pomalá vlaštovka těsně nad zemí udělá velký skok. Uživatel chce, aby QTE **zesilovalo to, co vlaštovka má**: rychlá letí dál, pomalou u země QTE nezachrání. Mělo by to platit hlavně pro záchranu na konci letu. | design + balanc | game-designer, balance-analyst |
| N2 | Změnit náhodnost výskytu QTE. Rozdělit QTE podle účinku: mince, vzdálenost, rychlost a další. | Každý typ události má mít **jasnou roli** (třeba holub = mince, poryv = výška a dolet, dron = rychlost). Rozvrh nemá být „pořád totéž dokola“, ale promyšlená skladba, z níž hráč pozná, co přichází a proč. | design | game-designer |
| N3 | Čekal bych, že si každé kolo něco otevřu, ne pořád dokola házet a sledovat to samé. | **Nejistý výklad:** „kolo“ = jeden hod, nebo sezení? Beru to jako „skoro každý hod přinese novinku nebo koupi“. Odpovídá to plánu 90 min (novinka každých ~3–4 hody), uživatel ale cítí, že dnes to tak není. Dnešní hra má nový systém (Atlas, papíry, kapsy) teprve v simulátoru, ve hře je jen starý strom Power/Paper/Folds. | design (progrese) | game-designer, balance-analyst |
| N4 | Nejdřív Power, Paper a Folds, pak splnit vzdálenost a otevřít Atlas. | Pořadí odemykání: na začátku jen základní vylepšení, Atlas se otevře **dosažením vzdálenosti**. Je blízko rozhodnutí B1 (menu odkrývá Atlas po prvním místě). Je potřeba sladit a zapojit nový systém do hry. | design | game-designer, product-designer |
| N5 | Hlavní postava má být 3D. | **Nejistý výklad:** dítě je dnes z plochých papírových karet (styl dioráma). Možnosti: (a) plastická postavička z papíru (objem, víc stran, jako Tearaway nebo Paper Mario 3D), (b) skutečný 3D model mimo papírový styl. Předpokládám (a), protože jsi schválil Papírové město. Ověřit u uživatele. | art | art-director |
| N6 | První záběr kamery má zachytit i jeho dům s dílnou. Za postavičkou nemá být kouř z komína, překáží. | Záběr při míření (16 m) ukazuje jen pavlač. Uživatel chce úvodní záběr širší, aby byl vidět dům s dílnou (jako náčrt menu 28 m). Kouř z komínů (`life3d`, starý styl, velké fialové chuchvalce) za dítětem pryč, P2. | art + kamera | art-director, game-dev |
| N7 | Jen papírový styl. Pryč s Neon City a přepínačem stylů. | Papír se stane **jediným stylem** (výchozím), cyber a přepínač se odstraní. Je v souladu s rozhodnutím „Papírové město nahradí cyber“. | rozhodnutí → implementace | game-dev, product-designer |
| N8 | Okolí obrazovky (jazyk, rozcestník Workshop/Atlas, panel Dílny dole) pryč, hra přes celou plochu. | Hra na celou obrazovku. Jazyk, Dílna a Atlas jdou do menu (07-menu: hlavní menu, pauza, Nastavení). Totéž už je rozhodnuté v 06 (struktura menu), teď to má vyšší prioritu. | UI | product-designer, game-dev |
| N9 | Tlačítko „Throw it“ nemusí být samostatné, stačí text uprostřed obrazovky. | V klidu stačí výzva uprostřed scény („Podrž a pusť“ / „Throw it“), žádné tlačítko v panelu. | UI | product-designer |
| N10 | Na 90 minut je potřeba další obsah. Agenti mají kriticky zhodnotit, co do hry patří a co ne. | Kritická revize plánu obsahu (05) a obsahu 01: co škrtnout, co přidat, s ohledem na N1–N3. | design | všichni |

## Druhy nálezů
- **Design (otázky pro uživatele po návrhu rolí):** N1, N2, N3, N4, N10.
- **Balanc (`/balance-check` po návrhu):** N1 (účinek QTE podle rychlosti mění délku letů a celou křivku), N3 (tempo novinek).
- **Chyby:** žádná technická chyba nenahlášena.
- **Vzhled a UI (implementace podle už rozhodnutých směrů):** N5, N6, N7, N8, N9.

## Top 3 priority (návrh orchestrátora, potvrdí společný plán)
1. **Jeden styl a hra přes celou obrazovku** (N7, N8, N9). Je rozhodnuté, hodně to zlepší první dojem a odblokuje menu.
2. **QTE podle rychlosti a role událostí** (N1, N2). Mění to jádro hry, proto potřebuje návrh a simulaci před kódem.
3. **Každý hod něco přinese** (N3, N4, N10). Nový systém progrese ve hře, pořadí odemykání a kritická revize obsahu.

## NOT ASSESSED
- Chování jiných hráčů (jediný tester = tvůrce), log, miniPXI, telefon.
- Upřesněno uživatelem 15. 10.: N3 „kolo“ = **skoro každý hod** přinese novinku nebo koupi; N5 = **plastická postavička z papíru** (objem, víc stran, papírový styl), ne klasický 3D model.
