# Katalog 3D modelů: postup „nejdřív hezký objekt, pak do hry“

> **NÁVRH, ke schválení uživatelem.** Napsal art-director 14. 10. 2026 na podnět uživatele: „Správný postup, abychom vše pořád nemuseli ladit, by bylo vytvořit si tyto 3D objekty detailně jednotlivě a pak je přidávat do hry. Ty 3D modely by měly být více detailní a hlavně musí dávat smysl.“

## 1. Odpověď: ano, dává to smysl

Takhle pracuje většina her. Dnes se město skládá z kvádrů a jehlanů přímo v generátoru (`geometry.cityChunk`, `districts/*-layout.js`, v papíru `placeCards`). Každý objekt vzniká „mimochodem“ při stavbě celého místa. Proto se pořád ladí celek a jednotlivé věci nedávají smysl: domy bez dveří, okna mimo patra, větrník z tyčí, sklad jako krabice.

Navrhuji **katalog modelů**:
1. Každý objekt (dům, stánek, jeřáb, strom, lampa, vlak, Dílna, dítě…) se navrhne **samostatně** na vlastní stránce.
2. Ukáže se **v záběru hry** (stejná kamera a velikost jako za letu) i zblízka.
3. Projde kontrolou a **schválíš ho**.
4. Teprve potom ho generátor města používá. Generátor už jen rozmisťuje schválené objekty, nic nevymýšlí.

Výhoda: objekt se ladí jednou, v klidu a zblízka. Ve hře se pak ladí jen rozmístění. Nová čtvrť = nová sada schválených objektů.

## 2. Pravidla „musí dávat smysl“

- **Má skutečný předobraz a účel.** Dům má dveře u země, okna v patrech nad sebou, komín na střeše, schod ke dveřím. Stánek má pult, stříšku a zboží. Jeřáb má věž, výložník, protizávaží, lano a háček.
- **Jedno měřítko pro celý svět:** patro 3 m, dveře 2,2 m, okno 1,2 × 1,4 m, člověk 1,7 m, vlaštovka 7,75 m (herní měřítko, hrdina je schválně velký). Nic „mezi“.
- **Detail podle hloubky, ne všude stejně:**
  - **ulice:** plný detail (rámy oken, římsy, okapy, dveře, cedule, květináče),
  - **střed:** okna a střechy,
  - **dálka:** jen silueta.

  Každý model má tyto 3 verze (LOD) a generátor si vezme podle vrstvy.
- **Papírový styl (bible 05):** detail je výřez a přeložená hrana kartonu, ne textura. Tvary čisté (Monument Valley), nedokonalost nese materiál.
- **Silueta čitelná v malém:** zmenšit na 25 % a převést do šedi, objekt poznat do 1 s (bible 02 kap. 8, platí dál).
- **Rozpočet:** na místo nejvýš 14 draw calls a 15 tis. trojúhelníků (`.claude/rules/render3d.md`). Proto se modely ve hře slučují do jedné geometrie na vrstvu a místo (jako dnes karty). Opakované drobnosti (lidé, lampy, květináče) se kreslí přes instancing.

## 3. Jak modely vyrábět

| Možnost | Plus | Minus | Verdikt |
|---|---|---|---|
| **A Modely v kódu** (JS funkce skládá model z dílů: karta, výřez, sedlová střecha, válec; parametry jako počet pater a barva) | bez nových nástrojů a závislostí; deterministické; testovatelné v Node; agenti je umí psát; jeden styl automaticky; varianty jedním parametrem | ručně modelovaný „organický“ tvar (dítě, holub) je těžší | **doporučuji pro město** |
| B Blender → glTF | volnost tvaru, ruční detail | potřebuje modeláře (agenti Blender neovládají), `GLTFLoader` do `vendor/` (nová závislost, rozhodnutí), další formát a převody | jen pro pár hrdinů, pokud bude člověk-modelář |
| C Generovat jako dnes (kvádry v generátoru) | nic nového | přesně to, co nefunguje | ne |

## 4. Postup pro jeden objekt (kontrolní seznam)

1. **Karta objektu** (2–3 řádky): jméno, kde stojí (čtvrť, vrstva), k čemu je, předobraz (odkaz na referenci), rozměry, barvy z palety.
2. **Model** v katalogu: 3 LOD, varianty (např. 2–4 patra, 3 barvy).
3. **Kontrola** (art-review): smysl (kap. 2), silueta v šedi na 25 %, měřítko vedle člověka a vlaštovky, paleta, trojúhelníky.
4. **Schválení uživatelem**: snímek objektu zblízka a v záběru hry.
5. **Do hry:** generátor rozmisťuje jen schválené objekty; test, že místo drží rozpočet.

## 5. Navržený první balík (čtvrť 1 „Střechy za úsvitu“)

Dům řadový (2–4 patra), dům se štítem, kostel nebo radnice (dominanta), Dílna, stánek trhu, girlanda s vlaječkami, strom (2 druhy), lampa, lavička, plot, auto, vlak a nástupiště, vodárna, šňůra s prádlem, komín s kouřem, balón, člověk (3 postoje), holub. Celkem asi 20 objektů.

## 6. Plán

| Krok | Kdo | Co |
|---|---|---|
| K0 | uživatel | schválit postup (otázky níže) |
| K1 | game-dev | stránka katalogu `prototype-katalog.html`: objekt na otočném podstavci, přepínač „zblízka / v záběru hry / na 25 % v šedi“, počet trojúhelníků. Čistý modul `src/render3d/models/` (jeden soubor na objekt, funkce vrací karty nebo vrcholy, LOD 0–2) |
| K2 | art-director | karty objektů pro balík čtvrti 1, kontrola každého modelu |
| K3 | game-dev | modely podle karet (po 3–5 objektech), každý se snímkem do `research/design/img/katalog/` |
| K4 | uživatel | schvalování po skupinách |
| K5 | game-dev | generátor místa (`paper-cards.js` / `cityChunk`) skládá jen z katalogu; testy rozpočtu na místo |

Souvisí s plánem `06-papir-ctvrt1.md`. Doporučuji katalog zařadit **před** dávku P2 (doplňky a život čtvrti 1), protože P2 by jinak objekty znovu vymýšlela v generátoru.

## 7. Otázky pro uživatele

1. **Modely v kódu (A), nebo Blender (B)?** Doporučuji A pro celé město. B jen pro pár hrdinů (dítě, holub, Dílna), a jen pokud se najde člověk, který bude v Blenderu modelovat.
2. **Kolik detailu?** (a) jako papírová diorama: výřezy a přehyby, čisté tvary, (b) hodně drobností (okenice, květináče, cedule na každém domě). Doporučuji (a) v ulici s několika drobnostmi na dům a (b) jen u dominant.
3. **Pořadí:** (a) katalog před dávkou P2, (b) až po první hratelné čtvrti. Doporučuji (a).
