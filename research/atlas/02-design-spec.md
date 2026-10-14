> **ZASTARALÉ (15. 10. 2026):** vzhled pohlednic (tištěný komiks, tuš 2,5 px, půltón, indigové tokeny, posterizované nebe); platí `research/design/05-styl-papir.md` kap. 10 (pohlednice jako fotky dioramatu přilepené páskou). Struktura, toky a texty Atlasu platí (`research/atlas/01-navrh-atlasu.md`, `03-texty.md`). Nečíst jako zadání vzhledu.

# Atlas: design spec (A1)

**14. 10. 2026, product-designer.** Navazuje na `01-navrh-atlasu.md` (závazný). Prototyp: `prototype-atlas.html` + `prototype/atlas/` (falešná data, `src/` beze změny). Texty: `03-texty.md` (generováno z `prototype/atlas/content.js`). Odkazy: `06` = rozhodnutí, `08` = návrh 2. kola, `P1–P15` = `research/kb/README.md`, svět = `research/svet/01-zivy-svet.md`.

## 0. Shrnutí
- **Atlas je sbírka komiksových pohlednic z trasy.** Každé místo je tištěná pohlednice: tuš 2,5 px, posterizované nebe v barvách čtvrti (svět §2.2), stínová strana v půltónu. Odemčení = pohlednice se „dotiskne“ přes siluetu (jediný výrazný pohyb celé obrazovky, P1, P2).
- **Jedna výrazná věc, zbytek tichý.** Odvaha je utracená na pohlednice a na nápis čtvrti na kartě čtvrti (tiskový posun barvy). Hlavička, kapsy a detail jsou střídmé panely na noční fialové.
- **Rozvržení:** mobil na výšku = svislá trasa, 2 × 2 pohlednice na čtvrť, detail jako bottom sheet. Mobil na šířku a desktop = dva sloupce (mapa | detail), čtvrť = řádek 4 pohlednic, trasa čte zleva doprava jako let.
- **Doporučení z §9 jsou výchozí a přepínatelná** v panelu prototypu i v URL (oddíl 13).
- **Všechna čísla jsou PROVISIONAL** (`params.mjs` po F5). UI čte `maxLevel` a ceny z modulu čísel, prototyp umí přepnout na 12 úrovní a ceny ×100 (oddíl 14).

## 1. Estetický směr a proč
| Volba | Rozhodnutí | Proč |
|---|---|---|
| Motiv | pohlednice z cesty (rámeček, bílý vnitřní okraj, tvrdý stín v barvě čtvrti) | sbírají se zážitky, ne inventář (01 §2.1, KB 08 N7); svět §6.5 fáze 2 použije tentýž rám pro snímky ze 3D |
| Podklad | noční indigo `#1b1444`, panely `#251c57` / `#30256d` | navazuje na neonové město, ne „černá s jedním akcentem“ |
| Barva čtvrti | jen grafika (obrysy, tečky úrovní, čára trasy, stín pohlednice), nikdy text | čtvrti mají kontrast textu nejistý (magenta 4,26 : 1), grafice stačí 3 : 1 |
| Tvar místo barvy | každá čtvrť má jiný vzor půltónu (tečky / šikmý déšť / vodorovné pásy slunce / mřížka neonu), číslo čtvrti v odznaku | barvoslepost (07 A5), stav nikdy jen barvou (07 A4) |
| Písmo | `Bahnschrift Condensed` → `Avenir Next Condensed` → `Roboto Condensed` → `Arial Narrow` (nadpisy, jména, ceny, tlačítka); `Bahnschrift` / `Segoe UI` / systémové (text) | bez závislostí a stahování; zúžené tučné písmo = nápisy na pohlednicích a komiksové titulky; jedna rodina na Windows |
| Pohyb | jen při změně stavu (tisk pohlednice, tečka úrovně, mince, sheet) | P2 juice s optimem, KB 02 §4.3 bod 10 |

**Revize plánu proti šablonám:** původně jsem měl nad každou čtvrtí verzálkový štítek a pohyb „vyjetí“ každé sekce. Obojí vypuštěno: štítek nic nenese (jméno čtvrti je nadpis) a plošné animace odporují P1. Barevný stín nadpisu čtvrti jsem po screenshotu zrušil (u zlaté Red Horizon rozmazával písmo), tiskový posun zůstal jen na kartě čtvrti.

## 2. Wireframy

### 2.1 Mobil na výšku (375 × 667, cíl 360–430)
```
┌───────────────────────────────┐  atlas-top (nescrolluje)
│ [✕] Atlas The route   [820 ◈] │  48 px
│ [← Workshop ] [ Throw ↗     ] │  48 px, stejná váha
│ Next: Lighthouse … · 123 m …  (i)│
│ Fly farther to find places…   │  věta pravidla, po 3. otevření jen (i)
│ [Pocket 1  TAP Cushion][P2…]  │  kapsy 52 px
├───────────────────────────────┤  atlas-map (scroll)
│▌[1] Violet Suburbs   4/4 found│  svislá čára trasy v barvě čtvrti
│▌┌──────────┐ ┌──────────┐     │
│▌│ pohlednice│ │ pohlednice│   │  2 × 2, šířka ≥ 150 px, 4 : 3
│▌│ Name      │ │ Name      │   │
│▌│ ◆ Bonus   │ │ ◆ Bonus   │   │
│▌│ ●●○ Level2│ │ ●●● Max   │   │
│▌└──────────┘ └──────────┘     │
│▌[Autopilot: gusts and birds On]│  uzly (jen při volbě Q5 = Atlas)
│▌(Bolts) „hláška“ „hláška“     │  patička postavy, jen zazněné
│ ┆[3] Red Horizon            │  rámec: silueta panoramatu + věta
└───────────────────────────────┘
Detail = bottom sheet do 85 % výšky: úchyt (táhnout dolů = zavřít) + ✕,
pohlednice ≤ 30vh, text scrolluje, pruh s tlačítkem koupě je vždy dole (07 N10).
```

### 2.2 Mobil na šířku (932 × 430)
```
┌──────────────────────────────────────────────────────────────┐
│ [✕] Atlas                         [6,400 ◈][← Workshop][Throw ↗]│
│ Next: Gates … · 237 m …   (i)  │ [Pocket 1 HOLD Dive][Pocket 2 · Open pocket · 5,040 ◈] │
├──────────────────────────────────────┬───────────────────────┤
│ [3] Red Horizon 4/4                  │ pohlednice (≤ 38vh)    │
│ [pc][pc][pc][pc]   4 v řádku, ~130 px │ Shooting Star          │
│ …                                    │ … (scroll)             │
│                                      │ [Level up · 500 ◈]     │
└──────────────────────────────────────┴───────────────────────┘
```
Hlavička se na nízké výšce stáhne do dvou řádků (cíl a kapsy vedle sebe, věta pravidla jen pod „i“). Mapa i detail scrollují samostatně.

### 2.3 Desktop (1280 × 800)
```
┌ dialog max 1280 px, rám 3 px, tvrdý stín magenta ───────────────────────┐
│ [✕] Atlas The route                       [22,400 ◈][← Workshop][Throw ↗] │
│ Next / Delivered…                                                  (i)    │
│ [Pocket 1][Pocket 2]   (max 640 px)                                       │
├───────────────────────────────────────────────────┬──────────────────────┤
│ [1] Violet Suburbs 4/4  ─ ─ ─ čára trasy za kartami │ detail 400 px        │
│ [pc 1][pc 2][pc 3][pc 4]   řádek = čtvrť, sloupce   │ smyčka 3 snímků      │
│ [uzel][uzel]               = místa 1–4              │ jméno, štítky, účinek │
│ (postava) bublina bublina bublina                   │ náhled, More          │
│ [2] Moon Docks …                                    │ [Level up · 170 ◈]   │
└───────────────────────────────────────────────────┴──────────────────────┘
```
Bez vybrané karty ukazuje panel prázdný stav `empty.detail`.

### 2.4 Další obrazovky
```
Výběr kapsy (dialog; mobil = vycentrovaná karta)     Karta čtvrti (po prvním příletu)
┌ Pocket 1: Pick a special      [✕] ┐               ┌───────────────────────┐
│ Active  · One active ability…     │               │ ╱ pohlednice −2° ╲     │
│ [TAP Cushion  … ✓ In this pocket] │               │  MOON DOCKS (tisk)     │
│ [HOLD Dive    …]                  │               │ You flew all the way…  │
│ More in Red Horizon               │               │ (Marge) „Mind the hooks…“│
│ Passive · Sharp Edge and Calm…    │               │ ▌New in your pockets: …│
│ [PASSIVE Sharp Edge …]            │               │ Progress saved. Nothing…│
│ [PASSIVE Calm Sky ⊘ Doesn't mix…] │               │ [Keep flying][Open Atlas][Done for now] │
│ Swapping is free between throws.  │               └───────────────────────┘
│ [Empty this pocket]               │
└───────────────────────────────────┘
Delivered. (souhrn)
┌───────────────────────────────────┐
│ Delivered.  (velký zlatý nápis)    │
│ Every place on the route, found…   │
│ [16 pohlednic 4 × 4]               │
│ [Throws to the finish][Longest]    │
│ [Most places/throw][Best combo]    │
│ Last words from the route: 4 × postava + 3. hláška │
│ [Done] [Keep flying]               │
└───────────────────────────────────┘
```

## 3. Tokeny
**Barvy** (`prototype/atlas/atlas.css` `:root`):

| Token | Hodnota | Použití |
|---|---|---|
| `--night` | `#1b1444` | podklad dialogu |
| `--plate` / `--plate2` | `#251c57` / `#30256d` | panely, detail / pohlednice, tlačítka |
| `--ink` | `#120a2a` | tuš: obrysy, tvrdé stíny, text na světlém |
| `--text` / `--dim` / `--mute` | `#f5f1ff` / `#c9c0f0` / `#a79cd8` | text / vedlejší / zakázané a rámečky |
| `--coin` | `#ffd166` | mince, cena, „Next“, nálepka New, tlačítko koupě |
| `--focus` | `#fff27a` | obrys fokusu 3 px, odsazení 3 px |
| `--ok` | `#7dffcf` | stav „On“ u uzlu |
| `--d0…--d3` | `#ff6fb5` `#5cc8ff` `#ffc35a` `#ff4f9e` | trasa čtvrtí (svět §2.2), jen grafika |
| Palety pohlednic | `PAL` v `prototype/atlas/art.js` | nebe, tělo, stín, akcent, okna, mlha: přesně tabulka svět §2.2 |

**Typografie:** nadpis Atlasu 32 px, nadpis čtvrti 30 px (desktop 36), jméno bonusu v detailu 30 px, jméno místa na pohlednici 16 px, bonus 15 px, tlačítka 18 px (malá 16), ceny ≥ 16 px, text 16 px, meta 13–14 px, nic informačního pod 12 px (07 A1). Čísla `tabular-nums`.

**Rozměry:** okraj 16 px (`--gut`), dotykové cíle ≥ 48 px (malé ovládání 44 px), mezera ≥ 8 px (07 A9), rádius 6 px (karty, tlačítka), 12–14 px jen dialogy a sheet, rám pohlednice 3 px + vnitřní bílý okraj 2 px (inset 4 px), tvrdý stín 4 px.

## 4. Stavy pohlednice (01 §3.2)
| Stav | Vzhled | Text na kartě | aria-label |
|---|---|---|---|
| `frame` | jen sekce čtvrti: silueta panoramatu (tuš na nebi čtvrti s jejím vzorem), čára trasy čárkovaná | jméno čtvrti + `district.*.frame` | `{district}, not reached yet` |
| `unknown` | tmavá karta s tečkovým vzorem, velké „???“, stín bez barvy | `???` | `Undiscovered place` (tlačítko `aria-disabled`, kvůli šipkové mřížce) |
| `teaser` | silueta dominanty v tuši, čárkovaný rám v barvě čtvrti, vlajka „Next“ | jméno, `{m} past your best` (zlatě), bonus šedě (nebo `???` při Q2 = skrytý) | jméno + vzdálenost + bonus |
| `found` | barevná pohlednice, nálepka „New“ (natočená, zlatá), dokud karta nebyla otevřena | jméno, ◆ bonus, ●○○ `Level 1` | `{place}. {bonus}, Level 1 of 3. New.` |
| `level` | totéž, tečky doplněné | ●●○ `Level 2` | `Level n of max` |
| `max` | trvalá neonová záře v barvě čtvrti (bez blikání), vnitřní rám v barvě čtvrti, korunka | ●●● 👑 `Max level` | `…, Max level` |
| model (Glider) | `found` bez teček | `Model` | bez úrovně |
| Encore | `found`; před finále „Finish the route to open.“, po finále razítko „Delivered“ | | |
| > 5 úrovní | tečky nahradí proužek + `Level 4 of 12` | | |

Značka rekordu: pod nejvzdálenější nalezenou kartou malá vlaštovka a `Your best: 2,010 m`.

## 5. Detail karty (pořadí podle 07 N9, 01 §3.3)
1. Pohlednice: smyčka 3 snímků (vlaštovka vlevo, střed s rychlostními čarami, vpravo s komiksovou hvězdou), 420 ms na snímek, jen u otevřené karty. Reduced motion: statický 1. snímek.
2. `{place} · {district} n/4`, jméno bonusu (h3, dostane fokus).
3. Štítky: sloveso jako razítko (bílé, verzálky, −2°) + „pro koho“ jako obrysové štítky.
4. Věta „chci“ (`bonus.*.pitch`).
5. Účinek: blok `Now · Level 2` (čísla zlatě) a čárkovaný blok `Level 3` (celá věta s novými čísly, žádné „→“ uprostřed věty, protože šablony mají víc tokenů).
6. Náhled U1 `On your last throw` (01 §3.3 bod 5, přepínač „ještě není“ → `preview.none`).
7. `Also opens: {paper} in the Workshop →` (místa 3, 7, 11).
8. Příběh místa.
9. `All levels` (sbalené): tabulka všech úrovní s účinkem a cenou, aktuální zlatě, poznámka „Numbers are provisional“.
10. Pruh dole (vždy vidět): `Level up · 170 ◈` / neaktivní `120 ◈ to go` / `Max level` / po koupi navíc `Undo · until your next throw`.

Teaser detail: silueta, čtvrť, jméno, teaser, vzdálenost, tmavý box s „?“ a `{bonus} · {pitch}` (bez čísel), nic ke koupi.

## 6. Kapsy a výběr (01 §3.5)
- Kapsa 1 je vidět od 100 m jako cíl: zlatý čárkovaný rámeček `Open pocket · 300 ◈`, nebo šedý `236 ◈ to go`. Kapsa 2 se objeví až v Red Horizon. Kapsa po kapse 2 se neukazuje.
- Vlastněná kapsa: `Pocket 1` + razítko slovesa + jméno, prázdná je čárkovaná: `Empty. Tap to pick a special.`
- Výběr: dvě skupiny s pravidlem jednou větou. Nedostupné volby jsou zašedlé **s důvodem** (`⊘ Doesn't mix with Sharp Edge in Pocket 2.`), ne skryté (P8). Speciály dalších čtvrtí se neukazují, jen `More in Red Horizon` (08 N2). Výměna zdarma, bez potvrzení, toast `Swapped Cushion for Dive.`
- Koupě kapsy hned otevře výběr (01 §4.4).

## 7. Uzly (06, 14. 10.; Q5)
- **Autopilot** jako uzel pod čtvrtí, kde se událost objevuje: gusts and birds a steam (Suburbs), thermals a shooting stars (Horizon), drones (Core). Ukáže se až po nalezení místa, které událost přináší. Čárkovaný rámeček s cenou, po odemčení plný s přepínačem `On / Off` (zdarma). V detailu věta `Regular hits only. No perfects, no combo, no Echo.` (06: automatika zvládá jen běžný zásah).
- **Night Route** v detailu karty Encore po finále: `Fly the whole route again, after dark.` + `Optional. The route is finished either way.` Po odemčení přepínač `Day / Night` (noční varianty pohlednic).
- Q5 = Dílna: uzly zmizí, pod cílem věta `Autopilot is set up in the Workshop.`

## 8. Karta čtvrti a souhrn
- Karta čtvrti (01 §4.5): pohlednice prvního místa čtvrti natočená −2°, přes ni jméno čtvrti verzálkami s tiskovým posunem (barva čtvrti + tuš). Věta příletu, portrét a 1. hláška postavy, nové speciály, u Red Horizon cena kapsy 2, `Progress saved. Nothing here runs out.` Tři **stejná** tlačítka. `Done for now` vede na klidnou obrazovku `Saved. The route will be right here.`
- Delivered (01 §4.6): zlatý nápis, 16 pohlednic, 4 čísla (hody do cíle, nejdelší hod, nejvíc míst jedním hodem, nejlepší kombo), poslední hláška každé postavy, `Done` / `Keep flying` stejně. Znovu otevřít z karty Encore (`See the summary`).
- **Odchylka:** 01 píše `Keep playing`, používám `Keep flying` všude (stejná akce = stejné jméno, karta čtvrti i souhrn).

## 9. Pohyb
| Moment | Pohyb | Délka | Reduced motion |
|---|---|---|---|
| Nalezené místo (poprvé v Atlasu) | barevná vrstva se „dotiskne“ zleva přes siluetu, 6 skoků (komiks „on twos“), pak nálepka New vyskočí | 480 ms + 220 ms | okamžitě barevná, bez nálepkové animace |
| Koupě úrovně | nová tečka 0,2 → 1,25 → 1; mince v peněžence dopočítají (ease-out) | 260 ms; 400 ms | bez pohybu, čísla se jen přepíšou |
| Sheet (mobil) | vyjede zdola, scrim se ztmaví | 240 ms | prolnutí 150 ms |
| Karta čtvrti | pohlednice spadne a dorovná natočení, tiskový posun nápisu se srovná | 380 ms | bez pohybu |
| Toast | vyjede o 12 px | 150 ms | prolnutí 150 ms |
| Smyčka 3 snímků | 420 ms na snímek | stále, jen otevřená karta | statický 1. snímek |
| Otevření Atlasu, procházení | nic | – | – |
Žádné blikání, neonová záře `max` svítí trvale (07 A7, svět §1.5). Vše animuje jen `transform`, `opacity` a `clip-path`. Reduced motion = `prefers-reduced-motion` nebo herní nastavení (prototyp: atribut `data-motion` na `<html>`). Posun mapy bez `smooth`.

## 10. Přístupnost a klávesnice
- `<dialog>` přes `showModal()` drží fokus, Esc zavře nejdřív sheet, pak Atlas. Po zavření fokus zpět na tlačítko Atlas (07 A8). Systémové zpět (`popstate`) zavře sheet, pak Atlas; `#atlas/<placeId>` při otevřeném sheetu.
- Mapa: roving tabindex (jedna karta v pořadí Tab), šipky ←→ po kartách, ↑↓ o počet sloupců (2 nebo 4, čte se z CSS mřížky), Home/End, Enter otevře detail a fokus jde na jméno bonusu. Výchozí fokus: první novinka, jinak teaser.
- Posun mapy při fokusu jen uvnitř mapy (ne `scrollIntoView`, ten na šířku posouval celý dialog a schovával hlavičku: nalezeno a opraveno při ověření).
- `aria-live="polite"`: toasty (`Crane Lift · Level 2`), řádek výsledku. Peněženka `aria-label="820 coins"`. Tečka na tlačítku mění jeho jméno na `Atlas, something new`.
- Stav nikdy jen barvou: tečky + text úrovně, korunka + `Max level`, teaser vs. neznámé = silueta vs. `???` + rám čárkovaný vs. plný.
- `forced-colors` zachová rámy a tečky.

## 11. Změřené kontrasty (WCAG 2.x, výpočet relativní luminance)
| Popředí | Pozadí | Poměr |
|---|---|---|
| text `#f5f1ff` | night / plate / plate2 | 15,37 / 13,68 / 11,74 |
| dim `#c9c0f0` | night / plate / plate2 | 9,98 / 8,88 / 7,62 |
| mute `#a79cd8` (zakázané volby) | plate / plate2 | 6,07 / 5,21 |
| coin `#ffd166` | night / plate / plate2 / ink | 11,84 / 10,54 / 9,04 / 13,21 |
| ink `#120a2a` | coin (tlačítko koupě, New) / text (sloveso, toast) / bublina `#fffdf4` | 13,21 / 17,15 / 18,69 |
| ok `#7dffcf` | plate | 12,35 |
| focus `#fff27a` | night / plate2 | 14,82 / 11,32 |
| ink | odznak čtvrti d0 / d1 / d2 / d3 | 7,43 / 10,12 / 11,98 / 6,23 |
| barva čtvrti d0 / d1 / d2 / d3 (jen grafika) | plate2 | 5,09 / 6,93 / 8,20 / **4,26** |
Všechen text ≥ 4,5 : 1. Magenta Neon Core (4,26) proto nikdy nenese text, jako grafika splňuje 3 : 1 (WCAG 1.4.11). Text na pohlednicích není: jména a čísla jsou v plném panelu pod obrázkem (07 A2).

## 12. Texty
Kompletní sada v `03-texty.md` (329 řádků: 16 jmen + teaserů + příběhů, 4 věty rámce, postavy a hlášky, místní, 16 bonusů s větou „chci“ a šablonou účinku, speciály, uzly, štítky, tlačítka, náhledy, prázdné stavy, toasty, výsledek, karta čtvrti, Delivered). Teaser slibuje rozuzlení, ne výčet („Hawks circle over the ridge without flapping once. How?“). Kontroly: délka ≤ 90 (max 73), zakázané formulace, hodnota pro každý token na každé úrovni (3 i 12 úrovní).

**Čeština (14. 10. 2026, rozhodnutí 06 „Atlas A1, čeština“).** `content.js` má slovníky `TEXTS.en` / `TEXTS.cs` s plochými i18n klíči (= ID v `03-texty.md`, stejné parametry, plurály přes `count`), struktury čtou texty gettery. Prototyp přepíná `?lang=cs` (výchozí EN) i přepínačem „Jazyk hry“ v ovládání; nastaví `<html lang>` a titulek, statické texty HTML jdou přes `data-i18n` / `data-i18n-aria`. Čísla podle jazyka (CS `1 240 m`, `+1,4 %`, `1,2 mil. ◈`), seznamy přes `Intl.ListFormat`. Z `main.js` zmizely napevno psané hodnoty: práh 100 m (`placeStart(0)`), spojka „ and “, „16 places“, „New best“, tučné „Next:“ přes regex (teď `goal.label` + `goal.next`), dolet 4910 (`FINISH`), zpoždění Echa 0.6 s (`{delay}` z `numbers.js`). Pravidla češtiny (bez rodu hráče, jména v 1. pádě, terminologie podle `cs.js`) jsou v hlavičce `03-texty.md`. Tabulku generuje `node prototype/atlas/gen-texty.mjs` (logika a kontroly v `texty.js`, kontroluje i zakázané formulace v CS). Ověřeno v Chrome na 320, 360, 375, 932 × 430 a 1280 × 800 v EN i CS: nic nepřetéká.

## 13. Přepínače otevřených otázek (01 §9)
| Otázka | Výchozí (doporučení) | Alternativa | URL |
|---|---|---|---|
| Q1 Atlas | panel `<dialog>` nad výsledkem | samostatná stránka (bez dialogu) | `mode=page` |
| Q2 bonus u teaseru | jméno + věta bez čísel | `???` + „You find out what it gives when you get there.“ | `teaser=hidden` |
| Q3 hlášky | jen zazněné, bez počtu | v Atlasu nejsou | `lines=hidden` |
| Q4 tečka | jen novinka | i „můžeš koupit“ (pro srovnání, nedoporučeno) | `dot=affordable` |
| Q5 automatika | uzly v Atlasu | věta „Autopilot is set up in the Workshop.“ | `autopilot=workshop` |
Další: `scenario=empty|first|suburbs|docks|horizon|core|delivered`, `long` (12 úrovní), `incremental` (ceny ×100, formát `1.2M ◈`), `coinmult` („Coins ×1.6 here“), `preview=none`, `motion=reduce|full`.

## 14. Co je zástupné
- Ceny a hodnoty: kopie `params.mjs` (F5) v `prototype/atlas/numbers.js`; u Steam Hop, Thermal a Ad Drone hodnoty úrovní 2–3 z karet 08 (params mají jiné jednotky). Ceny uzlů (autopilot 400–4 000 ◈, Night Route 20 000 ◈) a násobitel mincí jsou vymyšlené jen pro prototyp, dodá 3. kolo.
- Náhled U1 je falešný přepočet. Skutečný dodá `previewThrow` z jádra nového modelu letu; do té doby `preview.none`.
- Pohlednice jsou zástupné SVG (fáze 1, 01 §6.5); 3D snímky dodá plán světa F9/F10. Rám, vnitřní okraj a tvrdý stín platí i pro ně.
- Hlášky postav v prototypu odvozuje z `best` (`linesHeard`), ve hře z `p.atlas.lines`.

## 15. Předání vývoji (B1)
- `prototype/atlas/content.js` → `src/atlas-content.js` (struktura `PLACES`, `BONUSES` s `effect`/`units`, `SPECIALS`, `NODES`, `DISTRICTS`, `UI`); CS překlad přes i18n.
- `prototype/atlas/logic.js` = vzor rozhraní `src/atlas.js` a `src/atlas-text.js` (`placeStates`, `nextGoal`, `upgrade`, `undoLast`, `canEquip` s důvodem, `visibleNodes`, `discoveries`, `noveltyLine`, `atlasNotice`, `effectLine` vrací úseky text/číslo, aby šla čísla zvýraznit).
- `prototype/atlas/atlas.css` → sekce `.atlas-*` ve `style.css`; `art.js` → zástupné pohlednice, dokud nejsou snímky.
- Zlomy: dva sloupce od 760 px nebo na šířku s výškou ≤ 560 px; desktopový modál od 1024 × 600.

## 16. Ověření (Chrome, 14. 10. 2026)
- Screenshoty 375 × 667 (první otevření se sheetem Glideru, Moon Docks, výběr kapsy, karta čtvrti Moon Docks a Neon Core, Delivered, prázdný Atlas pod 100 m), 932 × 430 (Red Horizon, Moon Docks s 12 úrovněmi, cenami ×100 a násobitelem), 1280 × 800 (Delivered + Encore, Moon Docks + teaser). Vykresleno v iframech dané velikosti, okno prohlížeče sdílí jiní agenti.
- Konzole bez chyb (jediná výjimka byla od neexistujícího scénáře v URL, opraveno na záložní scénář).
- Klávesnice: Enter na tlačítku Atlas, šipky →↑← po mřížce 4 sloupců, Enter otevře detail a fokus přejde na jméno; Esc / zavření vrací fokus na tlačítko Atlas. Koupě a Undo (820 → 650 → 820 ◈, toast, aria-label karty se změní).
- Reduced motion: `data-motion="reduce"`, smyčka 3 snímků stojí, bez tisku a animace mincí.
- NOT ASSESSED: skutečný dotyk a tažení sheetu na telefonu, VoiceOver/NVDA, iPhone Safari (`dvh`, safe-area), simulace barvosleposti (vzory a tvary jsou navržené, ale neprošly simulátorem).
