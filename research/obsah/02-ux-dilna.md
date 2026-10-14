# Dílna: vlaštovky za mince, Vzhled (potisky a razítka), rychlá volba Sail — UX a toky

**14. 10. 2026, product-designer, kolo 2.** Stav: **upraveno podle rozhodnutí uživatele** (06, 14. 10., „Odemykatelný obsah: vlaštovky za mince a skiny“, body 1–8). Otevřené volby B1–B6 z kola 1 jsou rozhodnuté (§16). Maketa: `prototype-dilna.html` (jeden soubor, falešná data, `src/` beze změny, v prohlížeči **NOT ASSESSED**).

Zadání uživatele: „rozšířit naší dílnu o další vlaštovky které budou zamčené a půjdou odemknout za mince … a různé skiny vlaštovek které by byly odemykatelné za progress ve hře.“

Tento dokument řeší **UX a toky**. Modely a podmínky navrhuje game designer (`research/obsah/01-game-design.md`), vzhled art-director (`03-vzhled-modelu-a-skinu.md`), ceny balance-analyst (`04-ekonomika.md`). Jména, ceny a podmínky tady jsou **zástupné** (převzaté z 01, ceny 400–2 000 ◈). Čísla ladí `simulation/progression/`, do kódu se nepíšou napevno.

Odkazy: `06` = `research/bonusy/06-rozhodnuti.md` (závazné; „06 obsah N“ = bod N rozhodnutí 14. 10. o odemykatelném obsahu), `07-menu` = `research/design/07-menu.md`, `bible` = `research/design/05-styl-papir.md`, `papíry` = `research/design/01-papiry.md`, `03` = `research/obsah/03-vzhled-modelu-a-skinu.md`, `P1–P15` = `research/kb/README.md`, `02 §…` / `07 N…` / `08 N…` = bloky KB.

### Co se změnilo proti kolu 1
| Bylo | Je | Proč |
|---|---|---|
| Klepnutí na kartu = jen náhled, pak tlačítko „Letět s touhle“ (`planes.use`) | **Klepnutí na vlastněnou vlaštovku ji rovnou dá do ruky.** `planes.use` zrušeno | 06 obsah 6: uživatel nechápal rozdíl mezi „Letět s touhle“ a „Hodit“ |
| Vzhled: klepnutí = zkouška, pak „Nasadit“ | **Klepnutí na odemčený potisk / razítko ho rovnou nasadí** (stejný princip) | 06 obsah 6 platí obecně: jedna akce pro jednu věc, změna je zdarma a vratná |
| 6 zástupných modelů s cenami v tisících | 7 modelů z 01: Dart, Glider (zdarma, 100 m), Hawk, Kite, Skimmer, Sail, Needle, **dvojí klíč** (dolet na místo, pak mince) | 06 obsah 1, 4 |
| 3 vrstvy (model, papír, vzhled) | **Vrstvy podle 03 §2.1:** model, papír, potisk (+ ozdoba), razítko; obrys, stín a stopa beze změny | 06 obsah 7, 03 |
| Vzhled přes papír = volba B2 | **Potisk přes papír**, jeden pro všechny vlaštovky | 06 obsah 7 |
| Rychlá volba Sail = BLOCKED v 01 | **Specifikace prvku na obrazovce míření** (§8) | 06 obsah 5 |
| B1–B6 otevřené | rozhodnuté, přepínače z makety odstraněné | 06 obsah 5, 7 |

---

## 0. Shrnutí

1. **Jedna akce pro jednu věc.** Klepnutí na vlastněnou vlaštovku = je v ruce. Klepnutí na zamčenou = ukáže srovnání a jediné tlačítko „Koupit“. Dole je vždy jedno „Hodit“. Totéž ve Vzhledu: klepnutí na odemčený potisk = nasazený. Nikde neexistují dvě tlačítka, která by dělala „vezmi a leť“ (06 obsah 6).
2. **Vrstvy vlaštovky** (03 §2.1): *model* (tvar a let, mění čísla) → *papír* (žebřík rychlosti z Vylepšení, mění čísla) → *potisk* se svou ozdobou (jen podoba) → *razítko* (jen podoba). Obrys, stín, velikost a stopa se kosmetikou nemění nikdy. Hráč tak vždy ví, co mu přidává dolet (P7).
3. **Dílna má tři záložky: Vlaštovky · Vylepšení · Vzhled**, odkrývají se postupně (06 menu B1, 07 N5). Hlavní menu zůstává se čtyřmi tlačítky.
4. **Vlaštovky:** vlastněné + **2 nejbližší zamčené plně s cenou**, další jako **silueta** „Otevře se dál na trase“ (06 obsah 5). Zamčená má **dvojí klíč**: nejdřív doletět na místo, pak koupit (06 obsah 1). Glider je zdarma na 100 m, Night Owl se do finále neukazuje vůbec (06 obsah 4).
5. **Přínos je vidět předem:** srovnání „v ruce → tahle“ (pruhy se šipkou a textem), **dvě dráhy** v malém grafu a **odhad doletu**, bez zkušebního hodu (06 obsah 5).
6. **Koupě s potvrzovacím listem** „Mince: 1 240 → 540“; koupená vlaštovka jde **rovnou do ruky** s animací přeložení (06 obsah 5).
7. **Vzhled = potisk přes papír, jeden pro všechny vlaštovky, plus jedno razítko nebo žádné.** Bez počítadla, bez odměny za sadu (06 obsah 7). Zamčený kus je tužková skica s podmínkou napsanou celou.
8. **Rychlá volba Sail při míření:** malý čip u ukazatele větru, jen když fouká do zad a Sail je koupená (06 obsah 5, §8).
9. **Na Výsledku nejvýš jeden řádek novinky**, Dílna v menu tečku nemá (07-menu §2.1, P13).

---

## 1. Vrstvy vlaštovky

Sjednoceno s 03 §2.1 a 01 §3.1.

| # | Vrstva | Co mění | Jak se získá | Kde se volí | Mění dolet? |
|---|---|---|---|---|---|
| 1 | **Model** (Dart, Glider, Hawk, …) | silueta, přehyby, let (`MODELS`) | Dart od začátku, Glider zdarma na 100 m, ostatní dolet na místo + mince | Dílna › Vlaštovky, rychlá volba Sail při míření | **ano**, srovnání povinné |
| 2 | **Papír** (Copy → Kraft → Washi → stříbrná fólie) | tón listu, vlákna, tvar stopy, rychlost | úrovně větve Paper za mince | Dílna › Vylepšení (automaticky nejvyšší druh) | ano, „teď → po koupi“ (07-menu §2.7) |
| 3 | **Potisk** (skin) + jeho **ozdoba** | kresba přes papír (≤ 30 % plochy), jedna drobnost (mašle, barva přehybu, lem) | jen postup: suvenýry čtvrtí, finále, podpisové za první trik modelu | Dílna › Vzhled › Potisky | **nikdy** |
| 4 | **Razítko** | malá nálepka na pravém křídle | první perfekt typu události, hvězda, finále (7 kusů) | Dílna › Vzhled › Razítka (jedno nebo žádné) | **nikdy** |
| — | Obrys, stín, velikost, **stopa** | — | — | nikde | — |

Pravidla:
- **Vylepšení i papír platí pro všechny modely** (`core.js`: „Upgrades are shared“). Koupě modelu nikdy nezahodí předchozí investici; říká to `planes.shared` (P7, 02 §2.7 bod 2).
- **Potisk a razítko platí pro všechny vlaštovky** (06 obsah 7). Změna modelu je nesundá. Art-director kreslí potisk do UV půdorysu listu, který mají všechny modely (03 §4.2).
- **Potisk leží na papíru, papír nenahrazuje** (06 obsah 7). Tón papíru (rychlost) je vidět i pod potiskem; v Dílně to říká blok „Na tvé vlaštovce“ (§6.1).
- **Stopa je bez kosmetiky** (06 obsah 7, 03 §2.4). Barvu dává čtvrť, tvar papír.
- **Lampionový potisk ve čtvrti 4 jemně svítí** (06 obsah 7, 03 S6). V UI se to neoznačuje jako výhoda; popis potisku to zmíní jen jako vlastnost („In Lantern City it glows a little.“).
- **Proč kosmetika ne za mince:** zadání („za progress“), 06 obsah 7, mince mají jasnou roli síly (P12). Druhý odbyt mincí by vytvořil tlak volby „síla nebo paráda“ (02 §4.3 bod 6).

---

## 2. Stavový model položek

### 2.1 Model (vlaštovka)

```
 silueta ──(stane se jednou ze 2 nejbližších)──► zamčená: místo nedosažené ──(doletí na místo)──► zamčená: k prodeji
                                                                                                    │
                                              ┌──────────────(Koupit + potvrdit)────────────────────┘
                                              ▼
                                         V RUCE ◄──(klepnutí na kartu)── vlastněná
                                              └──(klepnutí na jinou vlastněnou / volba Sail při míření)──► vlastněná
 Glider: zamčená „Zdarma u místa …“ ──(100 m)──► vlastněná (do ruky ne automaticky, viz §7)
```

| Stav | Karta (vizuál) | Text na kartě | Klepnutí na kartu | Pás akce dole |
|---|---|---|---|---|
| **V ruce** | plný náhled (model + potisk na tónu papíru), rám grafit 3 px, páskový štítek „✓ V ruce“ nahoře | `planes.inHand` | nic se nemění (detail ukáže profil) | [Hodit] |
| **Vlastněná** | plný náhled, bez rámu | `planes.owned` „Tvoje“ | **vezme ji do ruky** (přeložení 300 ms, `planes.inHandDone`) | [Hodit] |
| **Zamčená: k prodeji** (místo dosažené) | plný náhled bez potisku (čistý papír), cena hořčicovou ikonou + `mustard-800` | `{price} ◈` | ukáže srovnání a odhad | [Koupit za {price} ◈] + [Hodit]; když mince nestačí, Koupit zakázané + „Chybí 160 mincí.“ |
| **Zamčená: místo nedosažené** | tužková skica (jen přehyby, bez výplně, 03 M7), cena + praporek | `{price} ◈` a ⚑ `planes.lockedShort` | ukáže srovnání a odhad | [Koupit…] **zakázané** + „Nejdřív doleť k místu Crane Forest, pak ji koupíš.“ (`planes.needPlace`) + [Hodit] |
| **Silueta** (třetí a další zamčená) | plná šedá silueta bez detailu (`pencil` 40 %), bez jména a ceny | `planes.hiddenName`, ⚑ `planes.lockedShort` | ukáže jednu větu `planes.lockedLater` | [Hodit] |
| **Glider před 100 m** | tužková skica | ⚑ `planes.freeShort` „Zdarma“ | ukáže srovnání, `planes.freeAt` | [Hodit] (nic ke koupi) |
| **Night Owl** do finále | **karta neexistuje** | – | – | – |

- **Cena se ukazuje stejně, ať mince stačí, nebo ne.** Žádné „můžeš koupit!“, žádný puls (02 §4.3 bod 6, 06 Atlas bod 4).
- **Dvojí klíč, ukazuje se vždy jen první nesplněný:** místo nedosažené → věta o místě (mince se nekomentují); místo dosažené → případně „Chybí N mincí“. Žádný seznam úkolů (P13).
- **Pořadí karet je pevné podle katalogu** (Dart, Glider, Hawk, Kite, Skimmer, Sail, Needle). Po koupi nic neskáče, mění se jen stav karty.
- **Kolik siluet:** všechny zbývající modely kromě Night Owl (nejvýš 3). Silueta neprozrazuje jméno ani cenu, jen „ještě něco je na trase“ (P3, 06 obsah 5).
- **Stav nikdy jen barvou:** ✓ + text, ikona mince + číslo, ⚑ + text, skica vs. plný náhled vs. silueta (WCAG 1.4.1).

### 2.2 Potisk a razítko

| Stav | Políčko | Klepnutí | Text |
|---|---|---|---|
| **Nasazený** | barevný náhled, rám grafit 3 px, ✓ | nic | „✓ Nasazeno“ |
| **Odemčený, neviděný** | barevný náhled + páskový štítek „NOVÉ“ | **nasadí** (přeložení 300 ms, `looks.woreDone`) | jméno |
| **Odemčený** | barevný náhled | **nasadí** | jméno |
| **Zamčený** | tužková skica (`pencil`, bez barvy), malý zámek | ukáže detail s podmínkou a skicu v náhledu; nic se nenasadí | jméno + „Jak ho získat: …“ |
| **Bez razítka** (jen v Razítkách) | čisté křídlo, text „Bez razítka“ | sundá razítko | `stamps.none` |

- Štítek „NOVÉ“ zmizí, jakmile hráč políčko uvidí (stačí otevřít záložku Vzhled). Neviděná položka **nedává tečku** na tlačítko Dílny (07-menu §2.1).
- **Podmínka je vždy celá vidět.** Žádné „???“ ani tajné podmínky (P3, 02 §2.7 bod 3).
- **Zamčené potisky a razítka se ukazují všechny**: nejsou síla a jejich podmínky ukazují, co hra nabízí (08 N8). Pořadí: nasazený, odemčené (nejnovější první), zamčené podle vzdálenosti na trase. Night Mail (K11, Night Route) se do odemčení Night Route neukazuje.
- **Bez počítadla** „7 / 11“, bez procentního pruhu, bez odměny za všechny (06 obsah 7, 08 N7).

---

## 3. Dávkování (co hráč vidí kdy)

Navazuje na 06 menu B1 (Dílna po 1. hodu) a 07 N5 / P14. Místa a pořadí podle 01 §2.8 (zástupné).

| Okamžik | Dílna ukazuje | Proč |
|---|---|---|
| před 1. hodem | Dílna v menu není (06 B1) | nic ke koupi |
| po 1. hodu | **jen Vylepšení, lišta záložek skrytá** | jedna věc; strom je hlavní smyčka |
| Glider na 100 m | lišta **Vlaštovky · Vylepšení**; Vlaštovky: Dart, Glider, 2 nejbližší (Hawk, Kite) plně, zbytek siluety | druhý model = první skutečná volba |
| místo 4 (Hawk k prodeji) | Hawk přejde ze skici do plného náhledu s aktivní cenou; řádek na Výsledku `result.planeForSale` | dvojí klíč: místo otevře, mince rozhodnou |
| první odemčený potisk nebo razítko | třetí záložka **Vzhled** | žádný prázdný šatník |
| koupě modelu | další silueta se změní na plnou kartu | vždy 2 blízké cíle (P6) |
| po finále | beze změny; zbylé modely dál koupitelné; Night Owl až s Night Route | žádný nový tlak po konci (02 N6) |

Razítka R1 a R2 (první perfekt poryvu a holuba) přijdou dřív než Dílna se Vzhledem: ohlásí se až po odemčení Dílny a jen řádkem (01 §3.3). Pokud je razítko první kosmetika, s ním se odkryje záložka Vzhled.

---

## 4. Dílna: rozložení

Dílna je panel `<dialog id="workshop">` podle 07-menu §2.7 (mobil přes celou obrazovku, desktop modál ≤ 1080 px). Za ním je 3D scéna Dílny: dítě drží vlaštovku (bible kap. 9).

### 4.1 Mobil na výšku (360 × 740)

```
┌──────────────────────────────┐
│ [✕]  Your Workshop  [1,240 ◈]│  hlavička 56 px, mince vpravo (tabular-nums)
│──────────────────────────────│
│     náhled: vlaštovka v ruce │  „okno“ 30 % výšky: model + papír + potisk + razítko
│     dítěte                   │  (fallback: statický obrázek, §10)
│──────────────────────────────│
│ Planes │ Upgrades │ Looks NEW │  záložky 48 px, podtržení páskou
│──────────────────────────────│
│ Tap a plane you own to take  │  14 px, pencil-700 (vždy, ne jen poprvé)
│ it.                          │
│ [✓V ruce][Tvoje][400◈][⚑700◈][▒]▶│ karty 120 × 132, scroll-snap
│                              │
│ Kite                   700 ◈ │  detail karty, na kterou hráč klepl
│ Rides every updraft…         │
│ ⚑ Fly to Crane Forest first, │
│   then you can buy it.       │
│ Launch speed ▓▓▓▓░░ ▼ −29 %  │
│ Glide        ▓▓▓▓▓▓ ▲ +44 %  │
│ Event boost  ▓▓▓▓▓░ ▲ +10 %  │
│ Best angle   40° (now 18°)   │
│  ┌ dráhy: - - Dart  ── Kite ┐│  graf 100 % × 96 px
│  └──────────────────────────┘│
│ Calm throw: ~412 m → ~446 m  │
│ Estimate: full power, …      │
│──────────────────────────────│
│ Fly to Crane Forest first, … │  důvod zákazu (jen když je Koupit zakázané)
│ [   Buy for 700 ◈          ] │  jen u zamčené k prodeji / s nedosaženým místem
│ [ Throw it ↗ ]               │  vždy, jediné „Hodit“
└──────────────────────────────┘
```

- **Pás akce dole má nejvýš dvě tlačítka a nikdy dvě se stejným významem:** u zamčené „Koupit“ (hlavní) + „Hodit“ (vedlejší); jinak jen „Hodit“ (hlavní). Žádné „Letět s touhle“, „Použít“ ani „Nasadit“: výběr dělá klepnutí na kartu (06 obsah 6). „Hodit“ je tak vždy jedno klepnutí (07 Z4).
- **Náhledové okno** ukazuje vlaštovku **v ruce** s jejím potiskem a razítkem na tónu aktuálního papíru. Výjimka: když hráč klepne na zamčenou kartu, okno ukáže **ji** (skicu, nebo plný náhled u k prodeji, čistý papír), s malým štítkem „Náhled“ (`workshop.previewOnly`), aby nebylo nejasné, co je v ruce. Klepnutí na vlastněnou / zavření Dílny vrátí okno k ruce.
- **Věta nad kartami** `planes.tapHint` je vždy vidět. Bez ní by nový hráč nevěděl, že klepnutí rovnou mění vlaštovku (objevitelnost nového chování).
- **Karty:** 120 × 132 px (cíl celý), mezera 8 px, `scroll-snap-type:x mandatory`, okraj 16 px, poslední karta vykukuje. Šipky ◀ ▶ jen pro `pointer:fine`.
- Na 320 px: karty 104 × 124, detail jedním sloupcem, pruhy na celou šířku.

### 4.2 Desktop (≥ 1024 × 600)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [✕ Back]  Your Workshop                                   [1,240 ◈] │
├────────────────────────────┬────────────────────────────────────────┤
│                            │ Planes │ Upgrades │ Looks               │
│   3D: dítě s vlaštovkou    │ Tap a plane you own to take it.        │
│   v ruce (pomalu se otáčí) │ ┌────┐┌────┐┌────┐┌────┐ (mřížka 4 × 2)│
│                            │ │Dart││Glid││Hawk││Kite│               │
│                            │ └────┘└────┘└────┘└────┘               │
│                            │ Kite · 700 ◈                           │
│                            │ srovnání │ graf drah + odhad           │
│                            │ [Buy for 700 ◈]   [Throw it ↗]         │
└────────────────────────────┴────────────────────────────────────────┘
```

### 4.3 Mobil na šířku (932 × 430)
Náhled vlevo 35 %, záložky a obsah vpravo, pás akce přilepený dole v pravém sloupci. Karty v jednom řádku. Nic se nescrolluje vodorovně mimo pás karet.

### 4.4 Záložky
- `role="tablist"` / `tab` / `tabpanel`, šipky ←→, Home/End. Aktivní: tučně + páska `tape` 4 px (ne jen barva).
- **Kam se Dílna otevře:** z menu na poslední záložce; z Výsledku tlačítkem „Dílna“ na Vylepšení; z řádku novinky (§7) rovnou na danou položku.
- Štítek „NOVÉ“ na záložce jen při neviděné položce. Nikdy za „můžeš koupit“.

---

## 5. Vlaštovky: výběr, srovnání, koupě

### 5.1 Výběr = klepnutí (06 obsah 6)

```
klepnutí na vlastněnou kartu ─► S.inHand = id, uloží se hned (p.model)
                                ├─ karta: štítek „✓ V ruce“ se přesune (150 ms, štítek „dopadne“)
                                ├─ náhled: vlaštovka se přeloží do nového tvaru (300 ms)
                                ├─ detail: profil vlaštovky v ruce (bez šipek)
                                └─ aria-live: „Kite je v ruce.“ (planes.inHandDone)
klepnutí na zamčenou kartu ───► jen detail se srovnáním + náhled zamčené („Náhled“), nic se neukládá
klepnutí na kartu v ruce ─────► nic (detail jejího profilu)
```

- **Vratné a zdarma:** zpět je jedno klepnutí na předchozí kartu. Proto bez potvrzení a bez „Zpět“.
- **Mezi hody kdykoli, za letu nikdy** (Dílna je panel nad menu a výsledkem, 07-menu §5). Při míření jen rychlá volba Sail (§8).
- **Srovnání mezi vlastněnými** se dělá přímo: klepnu, uvidím profil a odhad, klepnu zpět. Detail vlaštovky v ruce ukazuje odhad `planes.estimateOwn` a v grafu **i čárkovanou dráhu předchozí vlaštovky v ruce**, dokud hráč Dílnu nezavře (`planes.previewLabelPrev`). Tím je vidět, co výměna udělala, bez dalšího tlačítka.

### 5.2 Srovnání „v ruce → tahle“ (přínos vidět předem, 06 obsah 5)
Zobrazí se u zamčené karty (porovnává s vlaštovkou v ruce).

| Řádek | Zdroj (pro game-deva) | Zobrazení |
|---|---|---|
| Rychlost výhozu | `MODELS[m].speed` × vylepšení | pruh na **pevné škále** přes všechny modely, značka modelu v ruce, šipka ▲/▼ + „+12 %“ / „−8 %“ / „stejné“ |
| Klouzavost | `glide`, `drag` | totéž |
| Síla událostí | `qte` | totéž |
| Nejlepší úhel | `ideal` | „40° (teď 18°)“ + „S touhle miř výš.“ |
| **Specialita** | nová pole 01 §2.9 (`perfectK`, `liftK`, `windK`, …) | jedna věta „Loves: …“ z 01 (`model.<id>.loves`), u Hawka i pravdivá věta o automatice („Auto-hits don't count as perfect.“) |
| **Odhad klidného hodu** | čistá funkce `previewThrow(model, levels)` (plná síla, nejlepší úhel, bez větru a událostí) | „Klidný hod s tvými vylepšeními: ~412 m → ~446 m“ + `planes.estimateNote` |
| **Graf dvou drah** | stejná funkce, ~40 bodů | SVG: v ruce **čárkovaně** `pencil`, zvolená **plně** `graphite` 2,6 px s malou vlaštovkou; legenda textem; značka nejbližšího místa trasy (P6) |

Pravidla:
- **Poctivě i dolů** (P8, 02 §2.7 bod 3). ▼ je stejně výrazná jako ▲. Nové modely jsou „o něco lepší celkově a výrazně ve specialitě“ (06 obsah 2), ale kde jsou horší, je to vidět.
- **Odhad je odhad.** Vždy `~` a poznámka. Specialita (vítr, termika, perfekty) v klidném odhadu **není**, proto ji nese věta „Loves: …“. Nikdy „hodů do koupě“.
- **Bez zkušebního hodu** (06 obsah 5).
- **Graf se kreslí 600 ms ease-out**, přerušitelné, reduced motion = celý hned.
- Pro Sail navíc tři varianty dráhy (protivítr / klid / zadní vítr) je návrh 01 §2.5. V UI: přepínač `[Klid | Do zad]` nad grafem jen u Sail (2 segmenty, 44 px). **Zástupné, rozhodne game-dev podle ceny implementace**; bez něj se specialita Sail ukáže jen větou.

### 5.3 Tok koupě (06 obsah 5: s potvrzením, rovnou do ruky)

```
karta (zamčená, k prodeji) ─klepnutí─► detail se srovnáním
   └─[Koupit za 700 ◈]─► POTVRZOVACÍ LIST
         „Koupit vlaštovku Kite?“
         Mince: 1 240 → 540
         Půjde rovnou do ruky.            (buy.toHand)
         [Koupit za 700 ◈]   (hlavní)
         [Teď ne]            (výchozí fokus, Esc)
              ├─ potvrzeno ─► save ─ok─► karta = „✓ V ruce“, mince odečtené (odpočet 300 ms)
              │                          náhled: přeložení 750 ms (klepnutí ho dokončí)
              │                          aria-live: „Kite je v ruce.“
              │                          další silueta → plná karta (§3)
              │                          pás akce: [Hodit] hlavní
              │                 └─chyba ukládání─► nic se neodečte, buy.failed v listu, list zůstane
              └─ zrušeno ─► zpět na detail, fokus na „Koupit…“
```

- **Proč list:** největší jednorázový výdaj a nevratný; nechtěné klepnutí na telefonu by bylo frustrující (06 obsah 5, P13).
- **Výchozí fokus na „Teď ne“**, Esc = Teď ne. Enter dvakrát rychle nic nekoupí.
- **Věta „Půjde rovnou do ruky.“** v listu: hráč ví předem, co se stane (žádné překvapení), a ví, že staré vlaštovky zůstávají („vrátíš se klepnutím“ je v `planes.tapHint`).
- **Bez slev, časových nabídek a „poslední šance“** (02 §4.3 bod 7). Cena se nemění podle chování.
- **Vrácení koupě** (01 §1 „poslední koupi lze vrátit do dalšího hodu“) v rozhodnutí 06 není. UX ho nepřidává; když ho game designer zavede, patří jako vedlejší odkaz do detailu koupené vlaštovky, ne do pásu akce (jinak by tam byly opět dvě akce).

---

## 6. Vzhled (potisky a razítka)

### 6.1 Rozložení záložky Vzhled

```
┌──────────────────────────────┐
│ Tap to wear. Prints and      │  věta nahoře, 14 px (vždy)
│ stamps never change how the  │
│ plane flies.                 │
│ ┌ On your plane ───────────┐ │  blok vrstev (P7), 14 px
│ │ Plane: Hawk              │ │
│ │ Paper: Washi (Upgrades)  │ │
│ │ Print: Harbor Chart      │ │
│ │ Stamp: Gust              │ │
│ └──────────────────────────┘ │
│ PRINTS                       │  nadpis sekce
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │  mřížka auto-fill minmax(76px,1fr)
│ │ ✈✓ │ │ ✈  │ │ ✎  │ │ ✎  │  │  políčko ≥ 76 × 92
│ └────┘ └NEW─┘ └────┘ └────┘  │
│ STAMPS                       │
│ [none][ ◎ ][ ✎ ][ ✎ ] …      │  políčka ≥ 64 × 76
│                              │
│ Harbor Chart                 │  detail naposledy klepnuté položky
│ Depth lines and an anchor.   │
│ Fits every plane.            │
│ — nebo u zamčené —           │
│ Kite Tail 🔒                  │
│ How to get it: First perfect │
│ thermal with the Kite.       │
└──────────────────────────────┘
pás akce: [Throw it ↗] (jediné tlačítko)
```

- **Klepnutí na odemčené políčko = nasadit** (uloží se hned, přeložení 300 ms, `looks.woreDone`). Žádné „Nasadit“ v pásu akce. Vratné jedním klepnutím.
- **Zamčené políčko jde zvolit:** náhled ukáže tužkovou skicu potisku na vlaštovce v ruce se štítkem „Náhled“, detail podmínku. Nic se nenasadí.
- **Blok „Na tvé vlaštovce“** vysvětluje vrstvy bez tutoriálu: co je model, co papír (a že je z Vylepšení), co potisk a razítko. Papír tu nejde měnit (je to nejvyšší koupený druh, 01 §3.1); řádek je odkaz „Paper: Washi (Upgrades)“ → přepne na záložku Vylepšení.
- **Výchozí potisk** „Čistý“ (K0) je vždy odemčený a první v pořadí odemčených. Razítka mají vždy „Bez razítka“. Před první kosmetikou záložka Vzhled neexistuje (§3).
- **Retroaktivní odemčení** (§6.3) jednou věta nahoře.

### 6.2 Typy podmínek (šablony)

| Typ | Příklad (zástupný, 01 §3.2–3.3) | Šablona | Etická poznámka |
|---|---|---|---|
| suvenýr čtvrti | Reach Bright Harbor. | `looks.howDistrict` | běžný postup |
| finále | Deliver at the end of the route. | `looks.howRoute` | jednou |
| podpis modelu | First perfect thermal with the Kite. | `look.<id>.how` (text na míru, dodá game designer) | učí trik modelu (01 §3.2), během pár hodů |
| razítko: perfekt | First perfect gust. | `stamps.howPerfect` | širší okna z Nastavení platí (07 A13) |
| razítko: hvězda | Catch a shooting star. | `stamps.howStar` | |
| razítko: finále | Deliver at the end of the route. | `looks.howRoute` | |

**Nepoužívat:** počty („hoď 100×“), časové podmínky, série dní, podmínky jen pro grind (02 §4.3 body 4–5, 08 N7–N8). 06 obsah 7: suvenýry čtvrtí, finále, podpisové, 7 razítek.

### 6.3 Retroaktivní odemčení
Existující save: suvenýry čtvrtí a finále se dopočítají z `best`/Atlasu a tiše odemknou se štítkem „NOVÉ“ (razítka a podpisové potisky se dopočítat nedají, 01 §5). **Na Výsledku se neohlašují** (P1). Ve Vzhledu jednou věta `looks.retro` a zmizí.

---

## 7. Oznámení na Výsledku

Karta Výsledku (07-menu §2.5) má **jeden řádek novinky**. **Jedna novinka za hod** (01 U3): když se jich sejde víc, další se ohlásí po dalším hodu; v řádku se nehromadí.

**Priorita (zobrazí se nejvyšší, ostatní čekají na další hod):**
1. nové místo / nová čtvrť (Atlas)
2. nový druh papíru
3. Glider zdarma („Nová vlaštovka: Glider“)
4. model **k prodeji** (místo dosažené: „Vlaštovku Kite teď koupíš v Dílně“)
5. nový potisk
6. nové razítko (nejtišší)

```
│ ▌New print: Harbor Chart  [✈] [ Wear it ] │  náhled 40 × 40, tlačítko 44 px (vedlejší, krémové)
```

- **Akce v řádku je jen u věcí, které jsou hned k použití:** potisk / razítko „Nasadit“ (`result.wear`), Glider „Vzít do ruky“ (`result.takeIt`). Po klepnutí se změní na „✓ Nasazeno“ / „✓ V ruce“ (zakázané). Je to jiná věc než „Hodit znovu“, takže se dvě akce nepletou; tlačítko je vedlejší a menší (02 §4.3 bod 6).
- **Model k prodeji nemá v řádku „Koupit“** ani cenu: koupě patří do Dílny se srovnáním a potvrzením. Klepnutí na řádek otevře Dílnu na té kartě.
- **Žádné „Skoro!“**, žádné „zbývá 40 m do potisku“. Pravdivou těsnost nese řádek „Další: …“ (06 F5 bod 1).
- Novinka přeskočená na Výsledku se znovu neohlašuje a nezanikne: má „NOVÉ“ v Dílně.
- **Intenzita podle hodnoty** (P1): potisk a razítko = řádek s papírovým štítkem (250 ms), bez konfet.
- Pozn.: dřívější `result.alsoNew` („+1 další novinka“) **odpadá**, protože platí fronta „jedna novinka za hod“ (01 §1).

---

## 8. Rychlá volba Sail při míření (06 obsah 5)

**Účel:** když fouká do zad, hráč nemusí kvůli větru do Dílny (tření, ne volba, 01 BLOCKED 5). Čip nic nedoporučuje silou, jen nabízí a říká pravdivý odhad.

### 8.1 Kdy se ukáže
| Podmínka | Čip |
|---|---|
| Sail koupená, v ruce jiný model, vítr **do zad ≥ Light** (`w ≥ +0,04`, 08 Z3) | „**Sail** do ruky · ≈ +9 % v tomhle větru“ |
| Sail v ruce, vítr **proti ≥ Light** | „**{předchozí model}** do ruky · ≈ +6 % v tomhle větru“ (zrcadlo: poctivé, Sail v protivětru prodělává 2,5×) |
| Calm, slabý vítr, Sail nekoupená, nebo by výměna nic nepřinesla (odhad < +2 %) | žádný čip |
| během nabíjení, za letu, v pauze, v tutoriálu (seed 1–3) | žádný čip |

„Předchozí model“ = poslední jiný model v ruce (uloží se při výměně).

### 8.2 Umístění a vzhled
```
┌──────────────────────────────────┐
│ Next: Crane Forest  120 m   [◈][II]│  cíl vlevo nahoře, mince a pauza vpravo
│ ⇢ Tailwind ≈ +4 %               │  ukazatel větru (08 Z3) pod cílem
│ [≋ Sail in hand · ≈ +9 % here ] │  čip hned pod ukazatelem, ≥ 44 px vysoký
│                                  │
│         (míření, dítě, mířidlo)  │
│                                  │
│  [dotyk]                [dotyk]  │  dolní rohy = dotyk hodu
└──────────────────────────────────┘
```
- **Zóna „cíl“ vlevo nahoře** (zadání HUD), pod ukazatelem větru, protože čip je odpověď na vítr. Mimo dolní rohy (palec pro hod) a mimo dráhu letu.
- Krémová karta, grafitový obrys 2 px, ikonka siluety Sail (ne text-only), text 16 px `--display`, číslo `tabular-nums`. Max šířka `min(100% − 24px, 320px)`, dvouřádkové zalomení povolené. Rámeček nebliká, nepulzuje, objeví se prolnutím 200 ms ease-out spolu s ukazatelem větru.
- **Ne hořčicová ani rajčatová** (hodnota a perfekt mají role, bible 2.2). Procenta v textu, ne barvou.

### 8.3 Chování
- **Klepnutí = výměna hned** (stejný princip jako v Dílně, 06 obsah 6): dítě v ruce vlaštovku přeloží (300 ms), `aria-live` „Sail je v ruce.“, uloží se `p.model`. Čip se **promění na zpáteční** („Dart do ruky · ≈ −9 % v tomhle větru“), takže výměnu jde vrátit stejným místem. Je to stále jeden prvek, ne dvě akce.
- **Klepnutí na čip nesmí začít hod:** `pointerdown` se nepropaguje do `#game`; hod začne jen mimo čip. Během nabíjení se čip skryje (opacity 120 ms) a nejde na něj klepnout.
- **Nové míření (další hod) se vyhodnotí znovu**: nový vítr = nová nabídka nebo nic. Čip si nepamatuje „odmítnuto“ a nikdy nevyskakuje opakovaně v jednom míření.
- **Odhad** = `previewThrow` s větrem tohoto hodu, oba modely, stejný úhel a plná síla. Vždy `≈`. Když vyjde mezi −2 % a +2 %, čip se neukáže.

### 8.4 Okrajové případy a zneužití
1. **Pinwheel** (přehození větru) změní vítr během míření → čip se přepočítá a případně zmizí / objeví (bez animace navíc, jen prolnutí).
2. **Pinwheel úr. 3 (`noHeadwind`)**: zpáteční čip v protivětru se nikdy neukáže (protivítr není). Dominance „Sail + Pinwheel 3“ je věc balancu (01 §2.5), UX ji neschovává.
3. **Rychlé klepání na čip** (Sail ↔ Dart): každé klepnutí přepne, animace skočí na konec. Žádný limit.
4. **Hráč klepne na čip a hned hází**: hod letí s novým modelem (stav se mění hned, ne po animaci).
5. **Reduced motion**: bez přeložení, výměna prolnutím 0 ms; text a zvuk přehybu zůstanou.
6. **Klávesnice**: čip je `<button>` v pořadí Tab po ukazateli větru; Enter / mezerník přepne. **Mezerník na fokusovaném čipu nesmí spustit hod** (handler hodu ignoruje událost, jejíž cíl je čip). Žádná jednoznaková zkratka (WCAG 2.1.4).
7. **Tutoriál a první hody**: čip se neukáže před koupí Sail, tedy nejdřív v D3.

---

## 9. Stavy prvků

| Prvek | Výchozí | Hover (`pointer:fine`) | Stisk | Focus | Zakázaný | Chyba |
|---|---|---|---|---|---|---|
| Karta modelu | `--card` krém, stín zvednutí | stín `--lift-hi`, posun −2 px | posun +2 px (100 ms) | obrys `cobalt` 3 px, odsazení 3 px | – (zamčená je klepnutelná, ukáže detail) | – |
| Karta v ruce | rám `graphite` 3 px + páskový štítek „✓ V ruce“ | jako výchozí | – | | | |
| Karta zamčená prohlížená | rám `graphite` 2 px **přerušovaný** | | | | | |
| Karta silueta | výplň `pencil` 40 %, bez jména | | | | | |
| Políčko potisku / razítka | jako karta, menší; nasazené = rám 3 px + ✓ | | | | | |
| Záložka | text `--dim` | text `--text` | – | obrys | skrytá, ne zakázaná (§3) | – |
| Hlavní tlačítko (Koupit, Hodit) | `tomato-600`, krémový text, spodní hrana 4 px | světlejší výplň | posun 3 px | obrys | `--btn-disabled-*`, `aria-disabled`, **důvod textem nad tlačítkem** | – |
| Vedlejší (Hodit vedle Koupit, Teď ne, Nasadit na Výsledku) | krém, hrana `--line` | bílá | posun 3 px | obrys | | |
| Potvrzovací list | krémová karta, páska nahoře | | | fokus „Teď ne“ | – | `buy.failed` v `role="alert"`, ⚠ + text |
| Čip Sail (míření) | krém, obrys grafit 2 px, ikona siluety | stín zvednutí | posun 2 px | obrys `cobalt` 3 px | skrytý během nabíjení (ne zakázaný) | – |
| Graf drah | čárkovaná `pencil` / plná `graphite` + legenda | – | – | – | – | `planes.previewOff` (§10) |

---

## 10. Prázdné, načítací a chybové stavy

| Situace | Co hráč vidí |
|---|---|
| **Dílna bez peněz** | vše s cenami, Koupit zakázané s „Chybí N mincí.“; při 0 ◈ nad stromem `workshop.empty`. Žádné „Získej mince!“ |
| **Jen Dart** | lišta záložek skrytá, Dílna = Vylepšení |
| **Všechny modely koupené** | karty bez cen, žádná oslava navíc, žádné siluety |
| **Vše odemčené ve Vzhledu** | nic zvláštního, žádné počítadlo |
| **Načítání náhledu** | statická silueta modelu (SVG), bez spinneru; karty a tlačítka fungují hned |
| **Ztráta WebGL kontextu** | náhled = statická silueta + čip „Překresluji město…“ (07-menu §8 bod 4); výměna, nasazení i koupě fungují; graf je SVG v DOM |
| **3D nejde vůbec** | statický obrázek, zbytek beze změny |
| **Uložení koupě selže** | koupě se nepočítá: mince zůstanou, model zamčený, `buy.failed` v listu |
| **Uložení výměny / nasazení selže** | volba platí do konce sezení (hra s ní hází), varování přes dnešní `#warning` jednou za sezení; nic se neztrácí |
| **Neznámý model / potisk / razítko v save** | model → `dart`, potisk → `plain`, razítko → žádné; vlastněné se nemažou (validace `storage.js`) |
| **Graf nejde spočítat** | věta `planes.previewOff`, čísla zůstanou |

---

## 11. Pohyb

| Přechod | Pohyb | Délka | Reduced motion |
|---|---|---|---|
| Přepnutí záložky | prolnutí + posun 8 px | 200 ms ease-out / 120 ms ease-in | jen prolnutí ≈ 0 |
| Klepnutí na kartu | stisk 100 ms | 100 ms | hned |
| **Vzít do ruky** (karta, čip Sail) | štítek „✓ V ruce“ dopadne na novou kartu (scale .9 → 1, rotace −2°); vlaštovka v náhledu se zúží a rozloží do nového tvaru | štítek 150 ms, přeložení 300 ms ease-out | výměna prolnutím 0 ms, štítek hned |
| Nasazení potisku / razítka | krátké přeložení | 300 ms | hned |
| Graf drah | vlaštovka po dráze | 600 ms ease-out, přerušitelné | celá dráha hned |
| Potvrzovací list | zdola 16 px + opacity, scrim 200 ms | 280 ms / 200 ms | ≈ 0 |
| Přeložení po koupi | rozloží se na list a složí do nového tvaru | 750 ms, klepnutí dokončí | prolnutí 0 ms |
| Mince po koupi | odpočet čísla | 300 ms | hned |
| Řádek novinky na Výsledku | štítek „dopadne“ | 250 ms | bez pohybu |
| Čip Sail | prolnutí | 200 ms ease-out / 120 ms ease-in | hned |

Jen `transform` a `opacity`. **Žádná animace neblokuje vstup:** během přeložení jde zavřít Dílnu, házet, klepnout na jinou kartu (animace skočí na konec). Nic v klidu nepulzuje ani nebliká.

---

## 12. Okrajové případy a možné zneužití

1. **Nechtěná výměna klepnutím při rolování pásu karet:** tap se počítá jen při posunu prstu < 8 px (rozlišení tap vs. scroll, standardní `click`). Výměna je vratná jedním klepnutím a nic nestojí.
2. **Šipky v pásu karet:** jen posouvají fokus, **nevymění** vlaštovku (jinak by procházení klávesnicí měnilo ruku). Enter / mezerník = klepnutí.
3. **Dvojité klepnutí na „Koupit“:** první otevře list, druhé dopadne na scrim. `buyModel` je idempotentní (vrátí false, když už je vlastněný).
4. **Mince přesně na cenu:** povolit (≥), po koupi 0 ◈.
5. **Koupě během animace:** animace skočí na konec, stav se mění hned.
6. **Místo dosažené za letu, kdy hráč má mince:** model je k prodeji až po přistání; oznámí se na Výsledku (§7, priorita 4).
7. **Přepnutí jazyka v otevřené Dílně:** jména jsou klíče, přepíšou se hned; karty počítají s delší češtinou.
8. **Model zamčený v save** (`p.model='kite'` bez koupě): validace vrátí `dart`.
9. **Reset postupu:** maže vlastněné modely, potisky i razítka (`confirm.bodyLooks`).
10. **Pomoc s časováním a automatika QTE:** podpisové potisky a razítka za perfekt automatika nedá (06: automatika = běžný zásah). „Širší okna“ perfekt umožňují bez trestu (07 A13). Hawk s automatikou: detail to říká pravdivě (01 M1).
11. **Zneužití odhadu:** porovnat a koupit „nejlepší“ je informace, ne zneužití (P7). Riziko je dominance jednoho modelu (P8) → balance (`04`).
12. **Po finále:** modely zůstávají dobrovolný cíl, žádné nové propady kvůli retenci (02 N6).
13. **Starý save:** migrace (game-dev, 01 §5): `p.models` (koupené), `p.look {skin, stamp}`, `p.cosmetics`, retroaktivní suvenýry a finále.
14. **Kosmetika odemčená za letu:** vyhodnotí se při přistání; na letící vlaštovce se nic nemění.
15. **Dvě novinky v jednom hodu:** fronta, druhá po dalším hodu (01 U3); obě mají „NOVÉ“ v Dílně hned.
16. **Úzký displej 320 px s CS:** „Nejdřív doleť k místu Observatoř nad údolím, pak ji koupíš.“ zalomí na 2–3 řádky v detailu i nad tlačítkem; na kartě jen ⚑ „Na trase“.
17. **Hráč nikdy neotevře Vzhled:** nic se neztrácí, „NOVÉ“ čeká, žádné připomínky.
18. **Výměna modelu nesundá potisk ani razítko** (jeden vzhled pro všechny, 06 obsah 7). Hawk má úzká křídla: razítko se zmenší (03 §4.2), UI nic neřeší.

---

## 13. Přístupnost

| Bod | Řešení | WCAG / KB |
|---|---|---|
| Struktura | záložky `tablist`; pás karet `<ul role="list">` s `<button>`. **Vlastněné karty mají `aria-pressed`** (`true` = v ruce, přepínač „mít v ruce“); zamčené a siluety **bez `aria-pressed`**, s `aria-controls` na detail (otevírají detail, nic nepřepínají). Políčka potisků a razítek stejně (`aria-pressed` = nasazeno). Detail `aria-live="polite"` jen při změně prohlížené položky | 4.1.2, 1.3.1 |
| Popisky | `aria-label` karty = jméno + stav: „Kite, v ruce“ / „Hawk, tvoje“ / „Kite, 700 mincí, nejdřív doleť k místu Crane Forest“ / „Neznámá vlaštovka, otevře se dál na trase“ (`planes.cardAria`) | 1.1.1, 2.4.6 |
| Klávesnice | Tab: záložky → pás karet (jeden tab stop, roving tabindex 0/−1, **šipky jen přesouvají fokus**) → detail → pás akce. Enter / mezerník = klepnutí. Esc zavře list, pak Dílnu. Žádný kladný `tabindex` | 2.1.1, 2.4.3 |
| Fokus | `cobalt` 3 px + odsazení, nikdy zakrytý přilepeným pásem (`scroll-padding-bottom`) | 2.4.7, 2.4.11 |
| Dotykové cíle | karty 120 × 132, políčka potisků ≥ 76 × 92, razítek ≥ 64 × 76, záložky 48 px, tlačítka 48–56 px, ✕ 44 × 44, čip Sail ≥ 44 px, mezery ≥ 8 px | 2.5.8 |
| Tažení | pás karet roluje tažením, ale každá karta je dosažitelná klepnutím / šipkami | 2.5.7 |
| Barva | stav vždy tvar + text (✓ V ruce, ikona mince + cena, ⚑ + text, zámek, skica vs. plný náhled vs. silueta, ▲▼ + „+12 %“) | 1.4.1 |
| Kontrast | text `graphite` × `cream` 13,9; popisky `pencil-700` × `cream`; cena `mustard-800` × `cream` 5,5; skica `pencil` × `cream` 5,6 (grafika ≥ 3 : 1); štítky `graphite` × `tape` ~12 : 1 (z hex, v pixelech **NOT ASSESSED**); čip Sail nad 3D scénou: krémová karta s obrysem, text uvnitř karty (nezávisí na nebi) | 1.4.3, 1.4.11 |
| Náhled a graf | 3D okno je `aria-hidden`; vše podstatné v DOM. Graf `role="img"` + `aria-label` + odhad textem | 1.1.1 |
| Stavové zprávy | „Kite je v ruce.“, „Nasazeno: Harbor Chart.“, chyba koupě `role="alert"`; u čipu Sail totéž „Sail je v ruce.“ | 4.1.3 |
| Čip Sail a hod | čip je `<button>`; mezerník na něm hod nespustí; žádná jednoznaková zkratka | 2.1.1, 2.1.4 |
| Pohyb | §11, Nastavení „Pohyb“ přebíjí systém | 2.3.3 |
| Jazyk | jména přes i18n, `lang` podle volby | 3.1.1 |
| Zvětšení textu | 200 %: karty rostou do výšky, stránka bez vodorovného posunu | 1.4.4, 1.4.10 |

---

## 14. Etika: kontrola proti KB

| Kritérium | Jak to návrh plní |
|---|---|
| 02 §2.7 test 1–6 | 1: hráč ví, proč kupuje (srovnání, dvě dráhy). 2: nic nepropadá, vylepšení platí pro všechny. 3: ceny a podmínky pevné a známé. 4: konečný obsah. 5: koupě s potvrzením, „Teď ne“ má fokus. 6: kosmetika za běžný postup |
| 02 §4.3 seznam „ne“ | žádná náhoda, časové nabídky, streaks, oslava nezávislá na hodnotě, „skoro“ |
| P13 / 06 Atlas bod 4 | žádný puntík za možnost koupě, Dílna bez tečky, „NOVÉ“ jen u skutečné neviděné věci; čip Sail nepulzuje, nevyskakuje opakovaně, ukazuje i zpáteční směr |
| 06 obsah 7, 06 13. 10. „sběratelství ne“ | bez počítadla, bez kompletace, bez odměny za sadu |
| P7 přičitatelnost | vrstvy s jasnou rolí, blok „Na tvé vlaštovce“, kosmetika nikdy nemění čísla a říká to |
| P6 / P3 blízký cíl, zvědavost | 2 nejbližší modely s cenou, další jen silueta; zamčená kosmetika jako skica s podmínkou |
| 06 obsah 6 | jedna akce pro jednu věc: výběr klepnutím, jediné „Hodit“ |

---

## 15. Texty

Výchozí EN. Plurály EN `{one,other}`, CS `{one,few,many,other}`. Čísla přes `num` / `unit`. Jména modelů, potisků a razítek a jejich popisy dodá game designer jako `model.<id>`, `model.<id>.desc`, `model.<id>.loves`, `look.<id>`, `look.<id>.desc`, `look.<id>.how`, `stamp.<id>` (vzor `model.dart`). Bez rodu hráče. CS terminologie: Dílna, vlaštovka (= model), **v ruce**, vzhled (záložka), **potisk** (= skin), **razítko**, papír, mince, místo, čtvrť.

**CS a jména:** jména se neskloňují, šablony je dávají za dvojtečku, za slovo „vlaštovka / potisk“ nebo do 1. pádu („Kite do ruky“).

### 15.1 Nové a změněné klíče

| klíč | EN | CS |
|---|---|---|
| `workshop.tabPlanes` | Planes | Vlaštovky |
| `workshop.tabUpgrades` | Upgrades | Vylepšení |
| `workshop.tabLooks` | Looks | Vzhled |
| `workshop.tabsLabel` | Workshop sections | Části Dílny |
| `workshop.newTag` | New | Nové |
| `workshop.tabNewAria` | {tab}, something new inside | {tab}, je tu něco nového |
| `workshop.previewAria` | Your plane in the kid's hand | Tvoje vlaštovka v ruce dítěte |
| `workshop.previewOnly` | Preview | Náhled |
| `planes.listLabel` | Planes | Vlaštovky |
| `planes.tapHint` | Tap a plane you own to take it. | Klepnutím vezmeš svou vlaštovku do ruky. |
| `planes.inHand` | In hand | V ruce |
| `planes.owned` | Yours | Tvoje |
| `planes.buy` | Buy for {price} ◈ | Koupit za {price} ◈ |
| `planes.needPlace` | Fly to {place} first, then you can buy it. | Nejdřív doleť k místu {place}, pak ji koupíš. |
| `planes.freeAt` | Free when you reach {place}. | Zdarma, až doletíš k místu {place}. |
| `planes.freeShort` | Free | Zdarma |
| `planes.lockedShort` | On the route | Na trase |
| `planes.lockedLater` | Opens later on the route. | Otevře se dál na trase. |
| `planes.hiddenName` | Unknown plane | Neznámá vlaštovka |
| `planes.cardAria` | {name}, {status} | {name}, {status} |
| `planes.statSpeed` | Launch speed | Rychlost výhozu |
| `planes.statGlide` | Glide | Klouzavost |
| `planes.statEvents` | Event boost | Síla událostí |
| `planes.statAngle` | Best angle | Nejlepší úhel |
| `planes.angleNow` | {angle} (now {current}) | {angle} (teď {current}) |
| `planes.up` | {value} more | o {value} víc |
| `planes.down` | {value} less | o {value} míň |
| `planes.same` | same | stejné |
| `planes.aimHigher` | Aim higher with this one. | S touhle miř výš. |
| `planes.aimLower` | Aim lower with this one. | S touhle miř níž. |
| `planes.estimate` | Calm throw with your upgrades: ~{now} → ~{after} | Klidný hod s tvými vylepšeními: ~{now} → ~{after} |
| `planes.estimateOwn` | Calm throw with your upgrades: ~{now} | Klidný hod s tvými vylepšeními: ~{now} |
| `planes.estimateNote` | Estimate: full power, best angle, no wind or events. Its special trick isn't counted. | Odhad: plná síla, nejlepší úhel, bez větru a událostí. Specialita vlaštovky v něm není. |
| `planes.previewLabel` | Flight path: {current} dashed, {other} solid | Dráha letu: {current} čárkovaně, {other} plnou čarou |
| `planes.previewLabelPrev` | Flight path: {other} solid, before it {current} dashed | Dráha letu: {other} plnou čarou, předtím {current} čárkovaně |
| `planes.previewOff` | The flight preview can't be drawn right now. The numbers above still hold. | Náhled letu teď nejde nakreslit. Čísla výše platí. |
| `planes.shared` | Your upgrades and paper work for every plane. | Vylepšení i papír platí pro každou vlaštovku. |
| `planes.inHandDone` | {name} is in your hand. | {name} je v ruce. |
| `planes.autoNote` | Auto-hits don't count as perfect. | Automatický zásah se nepočítá jako perfektní. |
| `buy.title` | Buy the {name}? | Koupit vlaštovku {name}? |
| `buy.coins` | Coins: {now} → {after} | Mince: {now} → {after} |
| `buy.toHand` | It goes straight into your hand. | Půjde rovnou do ruky. |
| `buy.confirm` | Buy for {price} ◈ | Koupit za {price} ◈ |
| `buy.cancel` | Not now | Teď ne |
| `buy.failed` | The purchase couldn't be saved, so no coins were spent. Try again. | Nákup se nepodařilo uložit, mince zůstaly. Zkus to znovu. |
| `looks.note` | Tap to wear. Prints and stamps never change how the plane flies. | Klepnutím nasadíš. Potisk ani razítko nemění, jak vlaštovka letí. |
| `looks.layersTitle` | On your plane | Na tvé vlaštovce |
| `looks.layerPlane` | Plane: {name} | Vlaštovka: {name} |
| `looks.layerPaper` | Paper: {name} (Upgrades) | Papír: {name} (Vylepšení) |
| `looks.layerPrint` | Print: {name} | Potisk: {name} |
| `looks.layerStamp` | Stamp: {name} | Razítko: {name} |
| `looks.prints` | Prints | Potisky |
| `looks.stamps` | Stamps | Razítka |
| `looks.fitsAll` | Fits every plane. | Sedí na každou vlaštovku. |
| `looks.wearing` | Wearing | Nasazeno |
| `looks.woreDone` | Wearing: {name} | Nasazeno: {name} |
| `looks.lockedAria` | {name}, not yet. {how} | {name}, zatím ne. {how} |
| `looks.how` | How to get it: {how} | Jak ho získat: {how} |
| `looks.howDistrict` | Reach {district}. | Doleť do čtvrti {district}. |
| `looks.howRoute` | Deliver at the end of the route. | Doruč zásilku na konec trasy. |
| `looks.retro` | one: `You already earned {count} print on the way.` · other: `You already earned {count} prints on the way.` | one: `Cestou už máš {count} potisk.` · few: `Cestou už máš {count} potisky.` · many/other: `Cestou už máš {count} potisků.` |
| `stamps.none` | No stamp | Bez razítka |
| `stamps.howPerfect` | First perfect {event}. | První perfektní {event}. |
| `stamps.howStar` | Catch a shooting star. | Chyť padající hvězdu. |
| `look.plain` | Plain | Čistý |
| `look.plain.desc` | Just the paper and a good fold. | Jen papír a dobrý přehyb. |
| `result.newPlane` | New plane: {name} | Nová vlaštovka: {name} |
| `result.planeForSale` | You can now buy the {name} in the Workshop | Vlaštovku {name} teď koupíš v Dílně |
| `result.newLook` | New print: {name} | Nový potisk: {name} |
| `result.newStamp` | New stamp: {name} | Nové razítko: {name} |
| `result.wear` | Wear it | Nasadit |
| `result.worn` | ✓ Wearing | ✓ Nasazeno |
| `result.takeIt` | Take it | Vzít do ruky |
| `result.taken` | ✓ In hand | ✓ V ruce |
| `aim.swap` | {name} in hand | {name} do ruky |
| `aim.swapGain` | ≈ {value} in this wind | ≈ {value} v tomhle větru |
| `aim.swapAria` | Take the {name}. In this wind about {value}. | Vzít do ruky {name}. V tomhle větru asi {value}. |
| `confirm.bodyLooks` | This deletes coins, upgrades, planes, prints, stamps, places and your best distance. It can't be undone. | Smaže mince, vylepšení, vlaštovky, potisky, razítka, místa i rekord. Nejde to vrátit. |

Pozn. k `stamps.howPerfect`: `{event}` je jméno události v 1. pádu (Gust / Poryv). CS „První perfektní Poryv.“ je hraniční; game designer může dodat text na míru `stamp.<id>.how` („První perfektní poryv.“).

### 15.2 Zrušené klíče (z kola 1, do slovníků se nepřidávají)
`planes.use` (Letět s touhle), `planes.ready` (nahrazuje `planes.owned`), `planes.lockedPlace` (nahrazuje `planes.needPlace` / `planes.freeAt`), `looks.wear` (Nasadit v Dílně, klepnutí nasadí), `looks.listLabel` (nahrazují `looks.prints` / `looks.stamps`), `looks.howPlace`, `looks.howPlane`, `looks.howPerfect`, `looks.howDistance` (podmínky podle 01 jsou suvenýr, finále, podpis, razítko), `result.useIt` (nahrazuje `result.takeIt`), `result.planeInShop` (nahrazuje `result.planeForSale`), `result.alsoNew` (fronta jedné novinky).

**Použité beze změny:** `detail.missing`, `workshop.empty`, `workshop.launch`, `workshop.title`, `menu.coins`, `model.dart`, `model.glider` a `.desc`. **Ke smazání po zavedení:** `workshop.upgrades`, `workshop.note` (nahrazuje `planes.shared`), `result.gliderUnlocked` (nahrazuje `result.newPlane`), `model.glider.locked` (nahrazuje `planes.freeAt`).

---

## 16. Rozhodnuté volby (z kola 1)

| Volba | Rozhodnutí (06, 14. 10.) | Promítnuto |
|---|---|---|
| B1 Počítadlo vzhledů | **bez počítadla** (obsah 7) | §2.2, maketa bez `?counter` |
| B2 Vzhled přes papír | **potisk přes papír** (obsah 7) | §1, §6.1 blok vrstev |
| B3 Kolik zamčených modelů | **vlastněné + 2 nejbližší plně, další silueta** (obsah 5) | §2.1, maketa bez `?reveal` |
| B4 Potvrzení koupě | **s potvrzením** (obsah 5) | §5.3, maketa bez `?confirm` |
| B5 Vzhled pro všechny modely | **jeden pro všechny** (obsah 7) | §1, §12 bod 18 |
| B6 Po koupi do ruky | **ano** (obsah 5) | §5.3, maketa bez `?autouse` |
| — „Letět s touhle“ | **zrušeno, klepnutí = do ruky** (obsah 6) | §5.1, §6.1, §7 |
| — Rychlá volba Sail | **ano** (obsah 5) | §8 |

Otevřených voleb pro uživatele v tomto dokumentu není. Body k potvrzení orchestrátorem (návrhová rozhodnutí, ne vkus): zrcadlový zpáteční čip při protivětru (§8.1), přepínač drah u Sail (§5.2, podle ceny implementace), akce „Vzít do ruky“ / „Nasadit“ v řádku Výsledku (§7).

### 16.1 Budoucí bonus „násobič mincí“ (06 obsah 3) — jen poznámka pro game designera
Kde ukázat hodnotu „teď → po koupi“ (přínos vidět předem), detail mechaniky navrhne game designer:
- **Dílna › Vylepšení, uzel bonusu** (je to koupená investice jako ostatní): detail uzlu „Mince z hodu: +0 % → +10 %“ a pod tím na posledním hodu hráče „Tvůj poslední hod: 312 ◈ → ~343 ◈“ (`~`, stejná logika jako `planes.estimate`). Žádné „vrátí se ti za N hodů“ (02 §4.3, R-N6).
- **Výsledek, řádek mincí:** u přičtených mincí malý rozpad „+343 ◈ (včetně +31 ◈ z bonusu)“, aby hráč viděl, co bonus dělá (P7). Jen když je bonus koupený.
- **Kde ne:** hlavička Dílny ani HUD letu (peněženka zůstává jedno číslo); žádný „×1,1“ odznak u mincí za letu.
- Riziko pro balanc (06 obsah 3): příjem nesmí růst rychleji než ceny. To hlídá simulace (`04`).

---

## 17. Napojení na kód (pro game-deva, orientačně)

| Dávka | Obsah | Soubory |
|---|---|---|
| D1 Data | seznam modelů, potisků a razítek jako čistá data (id, místo odemčení, cena z `params.mjs` přes `atlas-numbers.js`); čisté funkce `planeState(p,id)` (`hand` / `owned` / `forSale` / `needPlace` / `free` / `hidden`), `lookState`, `stampState`, `previewThrow(model,levels,wind)` | nový `src/wardrobe.js` (bez DOM), testy |
| D2 Save | migrace (01 §5): `p.models`, `p.look {skin, stamp}`, `p.cosmetics`, `p.prevModel` (pro zpáteční čip), `seen`; validace; retroaktivní suvenýry | `src/storage.js`, testy |
| D3 Koupě a výměna | `buyPlane(p,id)` (idempotentní, ≥ cena, místo dosažené, po koupi `p.model=id`), `takePlane(p,id)` (jen vlastněný) | `src/core.js` nebo `wardrobe.js`, testy |
| D4 Texty | §15 do `en.js` / `cs.js` | `src/locales/*` |
| D5 UI | záložky, karty, detail, list, Vzhled, řádek Výsledku | `index.html`, `style.css`, `src/ui.js` (po M3b z 07-menu) |
| D6 Míření | čip Sail (§8), `pointerdown` mimo `#game` | `src/ui.js`, HUD |
| D7 Render | model, papír, potisk a razítko na vlaštovce, náhledové okno, přeložení | `src/render3d/*` (podle `03`) |

## 18. Co je zástupné
- Jména, ceny (400–2 000 ◈ z 01), místa odemčení, statistiky modelů, potisky a razítka v maketě i textu. Dodají `01`, `04` a simulátor.
- Odhad klidného hodu, dráhy a zisk v čipu Sail jsou v maketě spočítané hrubým vzorcem, ne fyzikou hry.
- Náhled vlaštovky v maketě je 2D SVG s jednou siluetou upravenou podle modelu (ne siluety z `03`).

## 19. Ověření
**Maketa `prototype-dilna.html`: NOT ASSESSED** (prohlížeč nepoužit podle zadání). K ověření orchestrátorem: šířky 320 / 360 / 375 × 667, 932 × 430, 1280 × 800; EN i CS (`?lang=cs`); scénáře `?scenario=start|early|mid|broke|late|delivered` (výchozí `mid`); `?view=aim&wind=tail|calm|head` (čip Sail: `?scenario=late&view=aim&wind=tail` nabídne Sail, `?scenario=delivered&view=aim&wind=head` nabídne návrat na Kite; `&hand=<id>` přepíše vlaštovku v ruce, jen vlastněnou); `?savefail=1`; v panelu makety Výsledek s novinkou a ztráta WebGL; klávesnice (šipky v pásu karet jen fokus, Enter vezme do ruky, Esc v listu a v Dílně); reduced motion (`?motion=reduce`); **kontrolní otázka 06 obsah 6: na žádné obrazovce nejsou dvě tlačítka pro „vzít a letět“**; kontrast štítků a skici v pixelech; žádný vodorovný posun.
