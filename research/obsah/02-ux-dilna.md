# Dílna: vlaštovky za mince a za postup, Vzhled (skiny) — UX a toky

**14. 10. 2026, product-designer.** Stav: **návrh k odsouhlasení** (otevřené volby v §16 jako `BLOCKED`). Maketa: `prototype-dilna.html` (jeden soubor, falešná data, `src/` beze změny, v prohlížeči **NOT ASSESSED**).

Zadání uživatele: „rozšířit naší dílnu o další vlaštovky které budou zamčené a půjdou odemknout za mince … a různé skiny vlaštovek které by byly odemykatelné za progress ve hře.“

Tento dokument řeší **UX a toky obecně pro N modelů a M vzhledů**. Konkrétní modely a vzhledy navrhuje game designer (`research/obsah/01-game-design.md`), vzhled art-director (`03`), ceny a podmínky balance-analyst (`04`). Kde tu stojí jméno, cena nebo podmínka, je **zástupná** (6 modelů, 15 vzhledů, ceny v tisících podle 06 „Mince rostou rychleji než lineárně“). Čísla ladí `simulation/progression/`, do kódu se nepíšou napevno.

Odkazy: `06` = `research/bonusy/06-rozhodnuti.md` (závazné), `07-menu` = `research/design/07-menu.md`, `bible` = `research/design/05-styl-papir.md`, `papíry` = `research/design/01-papiry.md`, `P1–P15` = `research/kb/README.md`, `02 §…` / `07 N…` / `08 N…` = bloky KB.

---

## 0. Shrnutí

1. **Tři vrstvy vlaštovky, každá s jednou rolí:** *model* (tvar a let, mění čísla), *papír* (žebřík rychlosti z větve Paper, mění čísla, 06 kolo 2 bod 3) a *vzhled* (jen podoba, **nikdy nemění čísla**). Hráč tak vždy ví, co mu přidává dolet (P7). Jak se vzhled kreslí přes papír, je volba B2.
2. **Dílna dostane tři záložky: Vlaštovky · Vylepšení · Vzhled.** Záložky se odkrývají postupně (06 menu B1, 07 N5): Vylepšení hned, Vlaštovky s druhým modelem, Vzhled s prvním odemčeným vzhledem. Hlavní menu zůstává se čtyřmi tlačítky (06 „Struktura menu“).
3. **Přínos je vidět předem:** detail modelu ukazuje srovnání „v ruce → tenhle“ (rychlost, klouzavost, události, nejlepší úhel se šipkou a textem), dvě dráhy letu v malém grafu (čárkovaně teď, plně nový) a odhad klidného hodu „~412 m → ~468 m“, výslovně označený jako odhad.
4. **Koupě modelu má jeden potvrzovací list** s „Mince: 9 240 → 840“ (koupě je drahá a nevratná, mobil = nechtěné klepnutí). Po koupi jde model rovnou do ruky a vlaštovka se „přeloží“ (stejná animace jako u papíru, 06 papíry bod 4).
5. **Vzhledy se nesbírají, nosí se.** Žádné počítadlo „7/15“, žádná odměna za kompletaci (06 13. 10. „sběratelství ne“, 08 N7–N8). Zamčený vzhled je **tužková skica** (sedí do bible: jediná nakreslená věc je vlaštovka) s podmínkou napsanou přímo, bez otazníků a odpočtů.
6. **Podmínky vzhledů = běžná cesta hrou** (místa, čtvrti, finále, pár dovednostních okamžiků). Žádné řady „hoď 500×“ (02 §2.8 grinding, 08 N8). Pomoc s časováním v Nastavení odemykání nikdy neblokuje.
7. **Na Výsledku nejvýš jeden řádek novinky** se jménem, malým náhledem a tlačítkem „Nasadit“ (06 menu bod 3, zadání „nejvýš jeden banner“). Víc novinek najednou = jeden řádek + „+1 další novinka v Dílně“. Dílna v menu **tečku nemá** (07-menu §2.1, P13).

---

## 1. Pojmy a vrstvy

| Vrstva | Co mění | Jak se získá | Kde se volí | Mění dolet? |
|---|---|---|---|---|
| **Model** (Dart, Glider, …) | tvar vlaštovky, fyzika (`MODELS`: rychlost, klouzavost, odpor, nejlepší úhel, síla událostí) | od začátku / za postup (Glider u 1. místa, 08 Atlas) / **za mince** (nové) | Dílna › Vlaštovky | **ano**, srovnání povinné |
| **Papír** (Copy → Kraft → Washi → …) | materiál, obrys, tvar stopy, rychlost (žebřík) | úrovně větve Paper za mince, druh se otevře na 3. místě čtvrti (06) | Dílna › Vylepšení (větev Paper) | ano, „teď → po koupi“ už je (07-menu §2.7) |
| **Vzhled** (skin) | jen podoba: potisk, barevné akcenty, ozdoba stopy (volba B2) | **jen za postup** ve hře, nikdy za mince | Dílna › Vzhled | **nikdy**, píše se to v UI |

Pravidla:
- **Vylepšení i papír platí pro všechny modely** (dnešní `core.js`: „Upgrades are shared by both models“). Koupě modelu tedy nikdy nezahodí předchozí investici. Ukazuje se to větou `planes.shared` v detailu (P7, 02 §2.7 bod 2 „přestat nic nestojí“).
- **Vzhled je nezávislý na modelu** (doporučení B5 A): jedna volba platí na každý model. Art-director musí každý vzhled navrhnout tak, aby seděl na všechny siluety (potisk přes společné UV, papíry §2 „UV vlaštovky“).
- **Vzhled nesmí rozbít čitelnost letu:** obrys vlaštovky ≥ 2,6 px a nejsilnější, dvojí hrana ≥ 3 : 1 v každé čtvrti, nic bílého s grafitem ve stopě navíc (bible kap. 6 a 13). Kontrolu dělá art-director, UX jen hlídá, že žádný vzhled není výhoda ani nevýhoda.
- **Proč vzhled ne za mince:** zadání („za progress“), a mince mají jasnou roli síly (P12 „mince jako důsledek výkonu“). Druhý odbyt mincí na kosmetiku by mince rozdělil na „sílu nebo parádu“ a vytvořil tlak volby, který hra nepotřebuje (02 §4.3 bod 6).

---

## 2. Stavový model položek

### 2.1 Model (vlaštovka)

```
  skrytý ──(přiblíží se podmínka)──► zamčený: postup ──(splněno)──► vlastněný ──(Letět s ní)──► V RUCE
     │                                                                ▲    ▲                         │
     └──(je v nabídce)──► zamčený: mince ──(Koupit + potvrdit)────────┘    └──────(jiný model do ruky)┘
                            ├─ na mince nestačí  („chybí 1 150 ◈“)
                            └─ stačí             (tlačítko Koupit aktivní)
```

| Stav | Karta (vizuál) | Text | Tlačítko v detailu |
|---|---|---|---|
| **V ruce** | plný náhled, rám grafit 3 px, štítek ✓ „V ruce“ | `planes.inHand` | žádné (zakázané „V ruce“ s ✓) |
| **Vlastněný** | plný náhled | `planes.ready` | „Letět s ní“ (`planes.use`) |
| **Zamčený: mince, stačí** | plný náhled, cena hořčicovou ikonou + `mustard-800` | `{price} ◈` | „Koupit za {price} ◈“ (`planes.buy`) |
| **Zamčený: mince, nestačí** | stejně jako výše (nic se neschovává, nic nebliká) | `{price} ◈` | zakázané „Koupit…“ + řádek „Chybí 1 150 mincí.“ (`detail.missing`) |
| **Zamčený: postup** | tužková skica (obrys, bez výplně), ikona praporku trasy | „Otevře se u místa {place}“ | žádné, podmínka v detailu |
| **Skrytý** (volba B3) | siluetka bez detailu, ikona praporku | „Otevře se dál na trase“ | žádné, detail jen jedna věta bez čísel |

- **Cena se ukazuje stejně, ať mince stačí, nebo ne.** Žádné zvýraznění „můžeš koupit!“, žádný puls (02 §4.3 bod 6 „návnady v rozhodovacích momentech“, 06 Atlas bod 4 „nikdy kvůli možnosti koupě“).
- **Stav nikdy jen barvou:** ✓ + text, ikona mince + číslo, ikona praporku + text, skica vs. barva (1.4.1).

### 2.2 Vzhled

| Stav | Políčko | Text | Akce |
|---|---|---|---|
| **Nasazený** | barevný náhled, rám grafit 3 px, ✓ | „Nasazeno“ | – |
| **Odemčený, ještě neviděný** | barevný náhled + páskový štítek „NOVÉ“ | jméno | „Nasadit“ |
| **Odemčený** | barevný náhled | jméno | „Nasadit“ |
| **Zamčený** | **tužková skica** vlaštovky (grafitová linka `pencil`, bez barvy), malý zámek | jméno + „Jak ho získat: Doleť k místu Maják na konci mola.“ | žádná; „Prohlédnout“ ukáže skicu větší |

- Štítek „NOVÉ“ zmizí, jakmile hráč políčko uvidí v záložce Vzhled (stačí otevřít záložku, nemusí klepnout). **Neviděný vzhled nedává tečku na tlačítko Dílny** (07-menu §2.1): novinku už oznámil Výsledek (§7).
- **Podmínka je vždy celá vidět.** Žádné „???“ ani tajné podmínky: nejistota má být ve hře (kam doletím), ne v tom, co se po mně chce (P3 výhrada „nejistotu nese obsah“, 02 §2.7 bod 3).
- **Zamčené vzhledy se ukazují všechny**, protože nejsou síla a podmínky jsou zároveň náhled toho, co hra nabízí (08 N8 „signifikátor popisuje možnost hry“). Pořadí: nasazený, odemčené (nejnovější první), zamčené podle toho, jak blízko po trase jsou.

---

## 3. Dávkování (co hráč vidí kdy)

Navazuje na 06 menu B1 (Dílna se objeví po 1. hodu, Atlas po 1. místě) a 07 N5 / P14.

| Okamžik (zástupné) | Dílna ukazuje | Proč |
|---|---|---|
| před 1. hodem | Dílna v menu není (06 B1) | nic ke koupi, nic k volbě |
| po 1. hodu | **jen obsah záložky Vylepšení, lišta záložek skrytá** | jedna věc; strom je hlavní smyčka |
| Glider se odemkne (Atlas, 1. místo, 100 m) **nebo** se objeví první model za mince | lišta záložek: **Vlaštovky · Vylepšení**; Vlaštovky ukazují vlastněné + nejbližší zamčené (B3) | druhý model = první skutečná volba |
| první odemčený vzhled | třetí záložka **Vzhled** | žádný prázdný šatník s jedním políčkem „Čistý papír“ |
| další čtvrti | v Vlaštovkách se odkrývají další skryté modely (B3) | blízký cíl, ne celá mapa (P3, Loewenstein) |
| po finále (Delivered) | vše beze změny; zbývající modely za mince dál koupitelné | mince mají po konci smysl, bez nového tlaku (02 N6) |

**Kdy se objeví model za mince** (nejdřív) určí game designer a balance-analyst. UX požadavek: první model za mince má být v nabídce **dřív, než na něj hráč má**, aby šlo vidět cíl a cenu (blízký cíl, P6), ale ne dřív, než hráč pochopil strom (doporučení: po první koupené úrovni nebo po 1. místě).

---

## 4. Dílna: rozložení

Dílna je panel `<dialog id="workshop">` podle 07-menu §2.7 (mobil přes celou obrazovku, desktop modál ≤ 1080 px). Za ním je 3D scéna Dílny: dítě drží vlaštovku (bible kap. 9).

### 4.1 Mobil na výšku (360 × 740)

```
┌──────────────────────────────┐
│ [✕]  Workshop       [9,240 ◈]│  hlavička 56 px, mince vpravo (tabular-nums)
│──────────────────────────────│
│  ╱▔▔▔╲   náhled vlaštovky    │  „okno“ 30 % výšky: 3D záběr na ruku dítěte
│ ✈  (model + vzhled)          │  (fallback: statický obrázek modelu, §9)
│──────────────────────────────│
│ Planes │ Upgrades │ Looks ·NEW│  záložky 48 px, podtržení páskou
│──────────────────────────────│
│ ◀ [Dart✓][Glider][Needle][?] ▶│  karty 120 × 132, vodorovně scroll-snap
│                              │  (scroll jen uvnitř pásu, ne stránky)
│ Needle                 2,400 ◈│  detail zvolené karty
│ Fast and flat. Loves Power.  │
│ Launch speed ▓▓▓▓▓▓░ ▲ +12 % │
│ Glide        ▓▓▓░░░░ ▼ −8 %  │
│ Events       ▓▓▓▓░░░  same   │
│ Best angle   22° (now 25°)   │
│  ┌ dráhy: - - Dart  ── Needle┐│  graf 100 % × 96 px
│  └───────────────────────────┘│
│ Calm throw: ~412 m → ~446 m  │
│ Estimate: full power, …      │  14 px, pencil-700
│ Upgrades and paper work for  │
│ every plane.                 │
│──────────────────────────────│
│ [   Buy for 2,400 ◈        ] │  přilepený pás akce 56 px
│ [ Throw it ↗ ]               │  (07-menu: „Házet“ v panelu zůstává)
└──────────────────────────────┘
```

- **Náhledové okno** nahoře: na Vlaštovkách a Vzhledu ukazuje **zvolenou** (ne nasazenou) položku na ruce dítěte, tedy „zkouška“ bez nasazení. Na Vylepšení ukazuje vlaštovku v ruce (papír se mění po koupi, 06 papíry bod 4). Na výšce ≤ 640 px se okno zmenší na 22 % a na šířku je vlevo (§4.3).
- **Pás akce dole** má vždy jen jednu hlavní akci podle zvolené položky (Koupit / Letět s ní / Nasadit) a pod ní „Házet ↗“ jako vedlejší. Když zvolená položka nemá akci (v ruce, zamčená postupem), hlavní tlačítko zmizí a „Házet ↗“ se stane hlavním. Tím je „Házet“ vždy jedno klepnutí (07 Z4).
- **Karty modelů**: 120 × 132 px (cíl celý), mezera 8 px, `scroll-snap-type:x mandatory`, okraj 16 px, poslední karta vykukuje (je vidět, že pás pokračuje). Šipky ◀ ▶ jen pro `pointer:fine`.
- Na 320 px: karty 104 × 124, detail jedním sloupcem, pruhy statistik na celou šířku pod názvem řádku.

### 4.2 Desktop (≥ 1024 × 600)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [✕ Back]  Workshop                                        [9,240 ◈] │
├────────────────────────────┬────────────────────────────────────────┤
│                            │ Planes │ Upgrades │ Looks               │
│   3D: dítě s vlaštovkou    │ ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐   │  mřížka 3 × 2
│   (zvolená položka,        │ │Dart││Glid││Need││Broa││ ?  ││ ?  │   │
│    pomalu se otáčí)        │ └────┘└────┘└────┘└────┘└────┘└────┘   │
│                            │ Needle · 2,400 ◈                       │
│                            │ srovnání + graf drah (vedle sebe)      │
│                            │ odhad + poznámka                       │
│                            │ [Buy for 2,400 ◈]   [Throw it ↗]       │
└────────────────────────────┴────────────────────────────────────────┘
  levý sloupec 40 %, pravý 60 % (max 640 px)
```

### 4.3 Mobil na šířku (932 × 430)
Náhled vlevo 35 %, záložky a obsah vpravo, pás akce přilepený dole v pravém sloupci. Karty modelů v jednom řádku, detail roluje uvnitř pravého sloupce. Nic se nescrolluje vodorovně mimo pás karet.

### 4.4 Záložky
- `role="tablist"` / `tab` / `tabpanel`, šipky ←→ přepínají, Home/End. Aktivní záložka: tučný text + podtržení páskou `tape` 4 px (ne jen barva).
- **Kam se Dílna otevře:** z menu na poslední záložce, kde hráč byl; z Výsledku tlačítkem „Dílna“ na Vylepšení (hlavní smyčka); z řádku novinky na Výsledku (§7) rovnou na danou položku.
- Štítek „NOVÉ“ na záložce jen tehdy, když je uvnitř neviděná položka (stejné pravidlo jako tečka Atlasu, 06 Atlas bod 4). Nikdy za „můžeš koupit“.

---

## 5. Vlaštovky: výběr, srovnání, koupě

### 5.1 Srovnání „v ruce → zvolená“ (přínos vidět předem)
Zobrazí se, kdykoli je zvolená jiná karta než model v ruce. Když je zvolený model v ruce, ukáže se jen jeho profil (stejné pruhy, bez šipek).

| Řádek | Zdroj (pro game-deva) | Zobrazení |
|---|---|---|
| Rychlost výhozu | `MODELS[m].speed` × vylepšení hráče | pruh 0–100 % pevné škály přes všechny modely (ne relativní k tomuhle páru), číslo m/s v `aria`, šipka ▲/▼ + „+12 %“ / „−8 %“ / „stejné“ |
| Klouzavost (doba ve vzduchu) | `glide`, `drag` | totéž; text „~16 s ve vzduchu“ u vybrané, pokud to simulace umí (08 §2 „Speed / Airtime“) |
| Síla událostí | `qte` | totéž, „+15 %“ |
| Nejlepší úhel | `ideal` | číslo „22° (teď 25°)“ + věta „S touhle miř o kousek níž.“ (zpětná vazba pro míření, P7) |
| **Odhad klidného hodu** | nová čistá funkce `previewThrow(model, levels)` (plná síla, nejlepší úhel, bez větru a událostí, seed bez událostí) | „Klidný hod s tvými vylepšeními: ~412 m → ~446 m“ + poznámka `planes.estimateNote` |
| **Graf drah** | stejná funkce vrací ~40 bodů (x, y) | SVG: model v ruce **čárkovaně** `pencil`, zvolený **plně** `graphite` 2,6 px s malou vlaštovkou na konci; legenda textem; osa x se značkou nejbližšího místa trasy (P6) |

Pravidla:
- **Poctivě i dolů.** Když je zvolený model v něčem horší, šipka ▼ je vidět stejně výrazně jako ▲. Model, který je „jiný, ne lepší“, musí jako jiný vypadat (P8 smysluplná volba, 02 §2.7 bod 3).
- **Odhad je odhad.** Vždy `~`, vždy poznámka pod ním. Pozdní hra stojí na událostech a bonusech, které odhad nezahrnuje; poznámka to říká. Nikdy neukazovat odhad „hodů do koupě“ (stará KB K5, rozpor R-N6 zůstává otevřený).
- **Pevná škála pruhů** (maximum = nejlepší model v hodnotě), aby se hodnoty daly porovnat i mezi kartami bez šipek.
- **Graf se kreslí 600 ms ease-out** (vlaštovka po dráze), přerušitelné, reduced motion = hned celý.

### 5.2 Tok koupě

```
karta (zamčená: mince) ─klepnutí─► detail se srovnáním
   │
   └─[Koupit za 2 400 ◈]─► POTVRZOVACÍ LIST (malý panel nad Dílnou)
         „Koupit Needle?“
         Mince: 9 240 → 6 840
         [Koupit za 2 400 ◈]   (hlavní)
         [Teď ne]              (výchozí fokus, Esc)
              │
              ├─ potvrzeno ─► save ─ok─► přeložení vlaštovky v náhledu 750 ms
              │                          karta = „V ruce ✓“, mince odečtené (číslo odpočítá 300 ms)
              │                          aria-live: „Needle je v ruce.“
              │                          pás akce: [Házet ↗] hlavní
              │                 └─chyba ukládání─► nic se neodečte, zpráva buy.failed, list zůstane
              └─ zrušeno ─► zpět na detail, fokus na „Koupit…“
```

- **Proč list a ne rovnou:** koupě modelu je největší jednorázový výdaj ve hře (zástupně tisíce až desítky tisíc ◈) a nedá se vrátit. Nechtěné klepnutí na telefonu by bylo frustrující (P13 bez trestu). Vylepšení ve stromu potvrzení nemají (malé kroky, dnešní chování); rozdíl je zdůvodněný cenou a nevratností. Volba B4.
- **Výchozí fokus na „Teď ne“**, Esc = Teď ne. Hlavní tlačítko „Koupit“ je vizuálně hlavní (rajčatové), ale fokus nedostane, aby Enter dvakrát rychle za sebou nic nekoupil.
- **Po koupi model rovnou do ruky** (volba B6 A): hráč ho kupuje, aby s ním letěl; vrátit se ke starému je jedno klepnutí zdarma.
- **Mince po koupi** se v hlavičce odečtou krátkým odpočtem (300 ms, reduced: hned). Žádný zvuk „ztráty“; zvuk přeložení papíru (P11, vizuální protějšek je animace).
- **Bez slev, bez časových nabídek, bez „poslední šance“** (02 §4.3 bod 7). Cena se nikdy nemění podle chování hráče.

### 5.3 Změna modelu v ruce
„Letět s ní“ → karta dostane ✓, náhled přeloží vlaštovku (300 ms, ne celých 750, není to novinka), pás akce ukáže „Házet ↗“ jako hlavní. Uloží se hned (`p.model`). **Mezi hody kdykoli, za letu nikdy** (Dílna je panel jen nad menu a výsledkem, 07-menu §5).

---

## 6. Vzhled (skiny)

### 6.1 Rozložení záložky Vzhled

```
┌──────────────────────────────┐
│ Looks change only how the    │  věta nahoře, 14 px (vždy, ne jen poprvé)
│ plane looks, never how it    │
│ flies.                       │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐  │  mřížka: auto-fill minmax(76px,1fr)
│ │ ✈✓ │ │ ✈  │ │ ✎  │ │ ✎  │  │  políčko ≥ 76 × 92 (cíl celé políčko)
│ │Plain│ │Air-│ │Kite│ │Lan-│  │  ✎ = tužková skica (zamčeno)
│ └────┘ └NEW─┘ └────┘ └────┘  │
│ …                            │
│ Airmail                      │  detail zvolené položky
│ Red-and-blue edge, a stamp   │
│ on the wing.                 │
│ Fits every plane.            │
│ [ Wear ]                     │
│ — nebo u zamčené —           │
│ Kite  🔒                      │
│ How to get it: Fly to the    │
│ Lighthouse at the Pier's End.│
└──────────────────────────────┘
```

- **Výběr políčka = zkouška v náhledovém okně** (§4.1), nic se neukládá. „Nasadit“ uloží. Zavření Dílny bez nasazení vrátí v náhledu nasazený vzhled.
- **Zamčené políčko jde zvolit** a v náhledu ukáže tužkovou skicu vzhledu na aktuálním modelu (zvědavost na obsah, P3), ale nic se nenasadí.
- **Žádné počítadlo** „7 / 15“, žádný procentní pruh sbírky, žádná odměna za všechny (volba B1, 06 13. 10. „sběratelství ne“, 08 N7 riziko povinnosti).
- **Výchozí vzhled** „Čistý papír“ je vždy odemčený a vždy první. Před prvním odemčeným vzhledem záložka Vzhled neexistuje (§3), takže prázdný stav „jen jeden vzhled“ hráč nikdy nevidí.

### 6.2 Typy podmínek (obecné šablony textu)

| Typ | Příklad (zástupný) | Šablona | Etická poznámka |
|---|---|---|---|
| místo | Doleť k místu Maják na konci mola. | `looks.howPlace` | běžný postup, každý hráč |
| čtvrť | Doleť do čtvrti Zlatá pole. | `looks.howDistrict` | běžný postup |
| finále | Doruč zásilku na konec trasy. | `looks.howRoute` | jednou, na konci |
| model | Hoď jednou vlaštovkou Needle. | `looks.howPlane` | ukazuje možnost hry (08 N8) |
| dovednost | Zvládni perfektně holuba. | `looks.howPerfect` | jen pár kusů; **širší okna z Nastavení platí** (bez trestu, 07 A13) |
| dolet | Doleť 1 000 m jedním hodem. | `looks.howDistance` | jen hodnoty, které padnou při běžném postupu |

**Nepoužívat:** počty hodů nebo opakování („hoď 100×“, „10 perfektů“), časové podmínky („tento týden“), série („5 dní v řadě“), podmínky dosažitelné jen grindem nebo jen šikovným hráčem u většiny vzhledů (02 §4.3 body 4–5, 08 N7–N8, Zagal grinding). Návrh pro game designera: ≥ 2/3 vzhledů za běžný postup trasou, ≤ 1/3 za „okamžik“ (dovednost, model, zvláštní událost).

### 6.3 Retroaktivní odemčení
Hráč s existujícím save už podmínky splnil (místa, finále). Při načtení se vyhodnotí a vzhledy se tiše odemknou se štítkem „NOVÉ“. **Na Výsledku se neohlašují** (nejsou výsledkem hodu, P1). V záložce Vzhled jednou věta „Cestou sis už vysloužil 4 vzhledy.“ (`looks.retro`, bez rodu: „Cestou už máš 4 vzhledy.“) a zmizí po prvním zobrazení.

---

## 7. Oznámení odemčení na Výsledku

Karta Výsledku podle 07-menu §2.5 má **jeden řádek novinky** (dnes „New place: …“). Nové typy novinek se do něj řadí, nepřidávají další bannery.

**Priorita (zobrazí se jen nejvyšší):**
1. nové místo / nová čtvrť (07-menu, Atlas)
2. nový druh papíru (papíry §0 bod 4)
3. nový model odemčený postupem („Nová vlaštovka: Glider“)
4. nový model **v nabídce** za mince („Needle je teď v Dílně“)
5. nový vzhled („Nový vzhled: Airmail“)

```
│ ▌New look: Airmail     [✈] [ Wear ] │  náhled 40 × 40, tlačítko 44 px (vedlejší, krémové)
│  +1 more new thing in the Workshop   │  jen když je víc novinek, 14 px
```

- **„Nasadit“ přímo z Výsledku** (jen u vzhledu a modelu odemčeného postupem) nasadí bez otevření Dílny a změní se na „Nasazeno ✓“. Je vedlejší (krémové), menší než „Hodit znovu“, takže nesoupeří s hlavní akcí (02 §4.3 bod 6 platí oběma směry: ani pokračování, ani novinka nemá být návnadou).
- Klepnutí na jméno / náhled otevře Dílnu přímo na položce.
- **Intenzita oslavy podle hodnoty** (P1, 02 N3): vzhled = řádek s malou papírovou animací štítku (250 ms), žádný konfety přes obrazovku. Nové místo / čtvrť má dál větší moment (Atlas).
- **Model za mince „v nabídce“** se oznamuje bez ceny a bez „kup si“: jen že existuje (P6 blízký cíl). Cena je v Dílně.
- Řádek nikdy neříká „Skoro!“ ani „Zbývá 40 m do nového vzhledu“. Pravdivou těsnost k místu už nese řádek „Další: …“ (06 F5 bod 1); vzhled se k místu váže sám.
- Novinka, kterou hráč na Výsledku přeskočil (rovnou „Hodit znovu“), **se znovu neohlašuje** a nezanikne: má štítek „NOVÉ“ v Dílně.

---

## 8. Stavy prvků

| Prvek | Výchozí | Hover (`pointer:fine`) | Stisk | Focus | Zakázaný | Chyba |
|---|---|---|---|---|---|---|
| Karta modelu | `--card` krém, stín zvednutí, náhled | stín `--lift-hi`, posun −2 px | posun +2 px, stín 1 px (100 ms) | obrys `cobalt` 3 px, odsazení 3 px | – (zamčená karta je pořád volitelná, jen bez akce) | – |
| Karta zvolená (ne v ruce) | rám `graphite` 2 px přerušovaný | | | | | |
| Karta v ruce | rám `graphite` 3 px plný + štítek ✓ „V ruce“ | | | | | |
| Políčko vzhledu | jako karta, menší | | | | | |
| Záložka | text `--dim`, bez podtržení | text `--text` | – | obrys | skrytá, ne zakázaná (§3) | – |
| Záložka aktivní | text `--text` tučně + páska 4 px | | | | | |
| Hlavní tlačítko (Koupit, Letět s ní, Nasadit) | `tomato-600`, krémový text, spodní hrana 4 px `tomato-700` | světlejší výplň | posun 3 px, hrana 1 px | obrys | `--btn-disabled-*`, bez hrany, `aria-disabled` a **důvod textem vedle** („Chybí 1 150 mincí.“) | – |
| Vedlejší (Teď ne, Nasadit na Výsledku, Házet) | krém, hrana `--line` | | | | | |
| Potvrzovací list | krémová karta, páska nahoře | | | fokus „Teď ne“ | – | `buy.failed` v `role="alert"` nad tlačítky, ikona ⚠ + text |
| Pruh statistiky | výplň `graphite`, stopa `card`, šipka ▲▼ + text | – | – | – | – | – |
| Graf drah | čárkovaná `pencil` / plná `graphite` + legenda | – | – | – | „Náhled teď nejde zobrazit“ (§9) | – |

---

## 9. Prázdné, načítací a chybové stavy

| Situace | Co hráč vidí |
|---|---|
| **Dílna bez peněz** | vše viditelné s cenami, Koupit zakázané s „Chybí N mincí.“; nad stromem dnešní `workshop.empty` jen při 0 ◈. Žádné „Získej mince!“ (07-menu §8 bod 5) |
| **Jen výchozí model** (před Gliderem a nabídkou) | lišta záložek skrytá, Dílna = Vylepšení (§3) |
| **Všechny modely koupené** | karty bez cen, žádné „vše hotovo!“ oslavy navíc. Mince po konci: viz §11 bod 9 |
| **Všechny vzhledy odemčené** | nic zvláštního, žádné počítadlo, žádná odměna |
| **Načítání náhledu** (3D model / geometrie se staví) | v okně náhledu statická silueta modelu (SVG z dat karty), bez spinneru; srovnání a tlačítka fungují hned |
| **Ztráta WebGL kontextu** | náhledové okno ukáže statickou siluetu + chip „Překresluji město…“ (07-menu §8 bod 4); Dílna funguje celá, koupě i volby jdou. Graf drah je SVG v DOM, na WebGL nezávisí |
| **3D vůbec nejde** | okno náhledu = statický obrázek; zbytek beze změny |
| **Uložení koupě selže** (`save` vrátí varování) | koupě se **nepočítá**: mince se neodečtou, model zůstane zamčený, v listu `buy.failed`. Postup se neztratí (pravidlo `storage.js`) |
| **Neznámý model / vzhled v save** (starší / novější verze, poškození) | model → `dart`, vzhled → `plain`; poznámka přes dnešní `#warning` mechanismus jen při skutečném poškození. Vlastněné položky se nemažou (validace v `storage.js`) |
| **Graf drah nejde spočítat** | místo grafu věta `planes.previewOff`, čísla srovnání zůstanou |

---

## 10. Pohyb

| Přechod | Pohyb | Délka | Reduced motion |
|---|---|---|---|
| Přepnutí záložky | obsah prolnutí + posun 8 px ve směru záložky | 200 ms ease-out / 120 ms ease-in | jen prolnutí ≈ 0 |
| Výběr karty | stisk 100 ms, detail prolnutí | 150 ms | hned |
| Graf drah | vlaštovka po dráze | 600 ms ease-out, přerušitelné dalším výběrem | celá dráha hned |
| Potvrzovací list | zdola 16 px + opacity, scrim 200 ms | 280 ms / 200 ms | ≈ 0 |
| Přeložení po koupi | vlaštovka se rozloží na papír a složí do nového tvaru (náhledové okno) | 750 ms, klepnutí ji dokončí | výměna prolnutím 0 ms |
| Změna modelu / vzhledu bez koupě | krátké přeložení | 300 ms | hned |
| Mince v hlavičce po koupi | odpočet čísla | 300 ms | hned |
| Řádek novinky na Výsledku | papírový štítek „dopadne“ (scale .96 → 1, rotace −1,5°) | 250 ms | bez pohybu |

Animuje se jen `transform` a `opacity`. **Žádná animace neblokuje vstup:** během přeložení jde zavřít Dílnu, házet, vybrat jinou kartu (animace skočí na konec). Nic v Dílně v klidu nepulzuje ani nebliká.

---

## 11. Okrajové případy a možné zneužití

1. **Dvojité klepnutí na „Koupit“:** první otevře list, druhé dopadne na scrim (nic). V listu je fokus na „Teď ne“. Koupě je idempotentní (game-dev: `buyModel` vrátí false, když už je vlastněný).
2. **Mince přesně na cenu:** povolit (≥). Po koupi 0 ◈, Dílna normálně, žádné varování.
3. **Koupě během animace přeložení předchozí koupě:** animace skočí na konec, nový list se otevře. Stav se mění hned, ne po animaci.
4. **Přepnutí jazyka v otevřené Dílně:** jména modelů a vzhledů jsou klíče (`model.<id>`, `look.<id>`), přepíšou se hned; šířka karet počítá s delší češtinou.
5. **Model zamčený postupem zvolený přes URL / devtools** (`p.model='needle'` v save): validace v `storage.js` vrátí `dart` (jako dnes `glider && best<100`).
6. **Reset postupu** (Nastavení): maže vlastněné modely i odemčené vzhledy (jsou postup). Text `confirm.body` doplnit o „vlaštovky, vzhledy“ (klíč `confirm.bodyLooks`, §14).
7. **Pomoc s časováním** (širší okna, 06 menu B4) a **automatika QTE** (Atlas): podmínky „perfektně“ platí stejně. Pozor: automatika podle 06 zvládá jen běžný zásah, **bez perfektu**, takže vzhled za perfekt hráč s automatikou nezíská, dokud ji nevypne. Doporučení: podmínky „perfektně …“ splnitelné i ručně v Nastavení „Širší okna“ (bez trestu) a jen u ≤ 2 vzhledů.
8. **Zneužití „odhadu“:** hráč může porovnávat odhady a koupit „nejlepší“ model. Není to zneužití, je to informace (P7). Riziko je jen v balancu: když je jeden model jasně nejlepší, volba ztrácí smysl (P8). Úkol pro balance-analysta (`04`), UX to zviditelní poctivě.
9. **Po finále:** mince dál přibývají a modely za mince zůstávají jako dobrovolný cíl. **Nevymýšlet nové propady jen kvůli retenci** (02 N6). Když hráč koupil vše, mince se prostě sčítají; nic se nenabízí.
10. **Starý save bez nových polí:** migrace (game-dev): `owned:['dart', …glider pokud best≥100]`, `look:'plain'`, `looks:[]` + retroaktivní vyhodnocení (§6.3), `seen:[]`. Poškozený save se neztratí.
11. **Vzhled odemčený během letu** (dolet k místu): vyhodnotí se při přistání, oznámí na Výsledku. Na letící vlaštovce se nic nemění (žádné přebarvení za letu).
12. **Dva vzhledy v jednom hodu** (např. místo + čtvrť): řádek ukáže první podle §7, „+1 další novinka“. Oba mají „NOVÉ“ v Dílně.
13. **Úzký displej 320 px s CS:** nejdelší jméno + „Otevře se u místa Observatoř nad údolím“ musí zalomit na 2 řádky v detailu, na kartě jen ikona praporku a zkrácené „Na trase“ (`planes.lockedShort`).
14. **Hráč nikdy neotevře Vzhled:** nic se neztrácí, štítek „NOVÉ“ čeká, žádné připomínky.

---

## 12. Přístupnost

| Bod | Řešení | WCAG / KB |
|---|---|---|
| Struktura | záložky `tablist`; karty modelů a políčka vzhledů jako `<button aria-pressed>` uvnitř `role="list"` / `listitem` (výběr k náhledu) — stav „v ruce / nasazeno“ v `aria-label` a viditelně textem; detail `aria-live="polite"` jen při změně zvolené položky | 4.1.2, 1.3.1 |
| Klávesnice | Tab: záložky → pás karet (jeden tab stop, šipky ←→ mezi kartami, roving tabindex 0/−1) → detail → pás akce. Enter / mezerník vybere. Esc zavře list, pak Dílnu. Žádný kladný `tabindex` | 2.1.1, 2.4.3 |
| Fokus | `cobalt` 3 px + odsazení, nikdy zakrytý přilepeným pásem akce (`scroll-padding-bottom` = výška pásu) | 2.4.7, 2.4.11 |
| Dotykové cíle | karty 120 × 132, políčka ≥ 76 × 92, záložky 48 px, tlačítka 48–56 px, ✕ 44 × 44, mezery ≥ 8 px | 2.5.8 |
| Tažení | pás karet roluje tažením, ale **každá karta je dosažitelná i klepnutím / šipkami** (◀ ▶ na desktopu, klávesnice); žádná akce jen tažením | 2.5.7 |
| Barva | stavy vždy tvar + text (✓ V ruce, ikona mince + cena, zámek + „Jak ho získat“, skica vs. barva, ▲▼ + „+12 %“). Graf drah: čárkovaná vs. plná + legenda textem | 1.4.1 |
| Kontrast | text na kartách `graphite` × `cream` 13,9; popisky `pencil` × `cream` 5,6; cena `mustard-800` × `cream` 5,5; **tužková skica `pencil` × `cream` 5,6 (grafika ≥ 3 : 1 OK)**; páska „NOVÉ“ `graphite` × `tape` — výpočet z hex ~12 : 1 (NOT ASSESSED v pixelech); šipka ▼ `graphite` (ne červená) | 1.4.3, 1.4.11 |
| Náhled a graf | 3D okno je `aria-hidden` ozdoba; veškerá informace je v DOM (srovnání, odhad). Graf SVG má `role="img"` + `aria-label` z `planes.previewLabel` + odhad textem | 1.1.1 |
| Stavové zprávy | „Needle je v ruce.“, „Nasazeno: Airmail.“, chyba koupě `role="alert"` | 4.1.3 |
| Pohyb | §10, Nastavení „Pohyb“ (07-menu) přebíjí systém | 2.3.3 |
| Jazyk | jména vzhledů a modelů přes i18n, `lang` podle volby | 3.1.1 |
| Zvětšení textu | 200 %: karty rostou do výšky, pás karet zůstane vodorovný uvnitř sebe, stránka bez vodorovného posunu | 1.4.4, 1.4.10 |

---

## 13. Etika: kontrola proti KB

| Kritérium | Jak to návrh plní |
|---|---|
| 02 §2.7 test „engagement, ne compulsion“ 1–6 | 1: hráč ví, proč kupuje (srovnání). 2: nic nepropadá, vylepšení platí pro všechny modely. 3: ceny a podmínky pevné a známé. 4: modely i vzhledy jsou konečné, po finále nic nového nepřibývá. 5: koupě je aktivní volba s potvrzením, „Teď ne“ má fokus. 6: podmínky vzhledů většinou za běžný postup |
| 02 §4.3 seznam „ne“ | žádná náhoda (žádné truhly s vzhledy), žádné časové nabídky, žádné streaks, žádná oslava nezávislá na hodnotě, žádné „skoro“ |
| P13 / 06 Atlas bod 4 | žádný puntík za možnost koupě, Dílna bez tečky, štítek „NOVÉ“ jen u skutečné neviděné věci |
| 06 13. 10. „sběratelství ne“ | vzhledy bez počítadla, bez kompletace, bez odměny za sadu; jsou to ozdoby za cestu, ne sbírka |
| P7 přičitatelnost | tři vrstvy s jasnou rolí; vzhled nikdy nemění čísla a říká to |
| P6 / P3 blízký cíl, zvědavost | nejbližší zamčený model s cenou, skrytě jen „dál na trase“; zamčené vzhledy jako skica s podmínkou |
| 08 N8 | podmínky „ukazují možnosti hry“, bez řad 10/100/1000 |

---

## 14. Texty (obecné prvky)

Výchozí jazyk EN. Plurály EN `{one,other}`, CS `{one,few,many,other}`, vybírá `count`. Čísla přes `num` / `unit`. Jména konkrétních modelů a vzhledů dodá game designer jako `model.<id>`, `model.<id>.desc`, `look.<id>`, `look.<id>.desc` (vzor dnešních `model.dart`). Texty bez rodu hráče. CS terminologie: Dílna, vlaštovka (= model), vzhled (= skin), mince, místo, čtvrť.

**Poznámka k CS a jménům:** jména modelů a vzhledů se v CS nebudou skloňovat, proto šablony stavějí jméno za dvojtečku nebo za slovo „vlaštovka / vzhled“ („Koupit vlaštovku Needle?“, „Nový vzhled: Airmail“).

| klíč | EN | CS |
|---|---|---|
| `workshop.tabPlanes` | Planes | Vlaštovky |
| `workshop.tabUpgrades` | Upgrades | Vylepšení |
| `workshop.tabLooks` | Looks | Vzhled |
| `workshop.tabsLabel` | Workshop sections | Části Dílny |
| `workshop.newTag` | New | Nové |
| `workshop.tabNewAria` | {tab}, something new inside | {tab}, je tu něco nového |
| `workshop.previewAria` | Your plane in the kid's hand | Tvoje vlaštovka v ruce dítěte |
| `planes.listLabel` | Planes | Vlaštovky |
| `planes.inHand` | In hand | V ruce |
| `planes.ready` | Ready | Připravená |
| `planes.use` | Fly with this one | Letět s touhle |
| `planes.buy` | Buy for {price} ◈ | Koupit za {price} ◈ |
| `planes.lockedPlace` | Opens at {place} | Otevře se u místa {place} |
| `planes.lockedShort` | On the route | Na trase |
| `planes.lockedLater` | Opens later on the route | Otevře se dál na trase |
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
| `planes.aimHigher` | Aim a little higher with this one. | S touhle miř o kousek výš. |
| `planes.aimLower` | Aim a little lower with this one. | S touhle miř o kousek níž. |
| `planes.estimate` | Calm throw with your upgrades: ~{now} → ~{after} | Klidný hod s tvými vylepšeními: ~{now} → ~{after} |
| `planes.estimateOwn` | Calm throw with your upgrades: ~{now} | Klidný hod s tvými vylepšeními: ~{now} |
| `planes.estimateNote` | Estimate: full power, best angle, no wind or events. | Odhad: plná síla, nejlepší úhel, bez větru a událostí. |
| `planes.previewLabel` | Flight path: {current} dashed, {other} solid | Dráha letu: {current} čárkovaně, {other} plnou čarou |
| `planes.previewOff` | The flight preview can't be drawn right now. The numbers above still hold. | Náhled letu teď nejde nakreslit. Čísla výše platí. |
| `planes.shared` | Your upgrades and paper work for every plane. | Vylepšení i papír platí pro každou vlaštovku. |
| `planes.inHandDone` | {name} is in your hand. | Vlaštovka {name} je v ruce. |
| `buy.title` | Buy the {name}? | Koupit vlaštovku {name}? |
| `buy.coins` | Coins: {now} → {after} | Mince: {now} → {after} |
| `buy.confirm` | Buy for {price} ◈ | Koupit za {price} ◈ |
| `buy.cancel` | Not now | Teď ne |
| `buy.failed` | The purchase couldn't be saved, so no coins were spent. Try again. | Nákup se nepodařilo uložit, mince zůstaly. Zkus to znovu. |
| `looks.listLabel` | Looks | Vzhledy |
| `looks.note` | Looks change only how the plane looks, never how it flies. | Vzhled mění jen to, jak vlaštovka vypadá, ne jak letí. |
| `looks.fitsAll` | Fits every plane. | Sedí na každou vlaštovku. |
| `looks.wearing` | Wearing | Nasazeno |
| `looks.wear` | Wear | Nasadit |
| `looks.woreDone` | Wearing: {name} | Nasazeno: {name} |
| `looks.lockedAria` | {name}, not yet. {how} | {name}, zatím ne. {how} |
| `looks.how` | How to get it: {how} | Jak ho získat: {how} |
| `looks.howPlace` | Fly to {place}. | Doleť k místu {place}. |
| `looks.howDistrict` | Reach {district}. | Doleť do čtvrti {district}. |
| `looks.howRoute` | Deliver at the end of the route. | Doruč zásilku na konec trasy. |
| `looks.howPlane` | Throw the {plane} once. | Hoď jednou vlaštovkou {plane}. |
| `looks.howPerfect` | Get a perfect on the {event} event. | Zvládni perfektně událost {event}. |
| `looks.howDistance` | Fly {distance} in one throw. | Doleť {distance} jedním hodem. |
| `looks.retro` | one: `You already earned {count} look on the way.` · other: `You already earned {count} looks on the way.` | one: `Cestou už máš {count} vzhled.` · few: `Cestou už máš {count} vzhledy.` · many: `Cestou už máš {count} vzhledů.` · other: `Cestou už máš {count} vzhledů.` |
| `look.plain` | Plain Paper | Čistý papír |
| `look.plain.desc` | Just the paper and a good fold. | Jen papír a dobrý přehyb. |
| `result.newPlane` | New plane: {name} | Nová vlaštovka: {name} |
| `result.planeInShop` | {name} is now in the Workshop | Vlaštovka {name} je teď v Dílně |
| `result.newLook` | New look: {name} | Nový vzhled: {name} |
| `result.wear` | Wear it | Nasadit |
| `result.worn` | Wearing ✓ | Nasazeno ✓ |
| `result.useIt` | Fly with it | Letět s ní |
| `result.alsoNew` | one: `+{count} more new thing in the Workshop` · other: `+{count} more new things in the Workshop` | one: `+{count} další novinka v Dílně` · few: `+{count} další novinky v Dílně` · many: `+{count} dalších novinek v Dílně` · other: `+{count} dalších novinek v Dílně` |
| `confirm.bodyLooks` | This deletes coins, upgrades, planes, looks, places and your best distance. It can't be undone. | Smaže mince, vylepšení, vlaštovky, vzhledy, místa i rekord. Nejde to vrátit. |

**Použité beze změny:** `detail.missing` (Chybí N mincí), `workshop.empty`, `workshop.launch`, `workshop.title`, `workshop.preview` (07-menu), `menu.coins` (aria peněženky), `model.dart`, `model.glider` a jejich `.desc`. `model.glider.locked` nahradí obecné `planes.lockedPlace`.
**Ke smazání po zavedení:** `workshop.upgrades` („Upgrades · for both planes“) a `workshop.note` (nahrazuje `planes.shared`), `result.gliderUnlocked` (nahrazuje `result.newPlane`).

---

## 15. Tokeny (tři vrstvy, papírová bible)

Primitivní a rolové tokeny jsou v bibli kap. 2.1 a 8; Dílna přidává jen komponentové a jednu roli.

| Vrstva | Token | Hodnota | Poznámka |
|---|---|---|---|
| role | `--color-new` | `var(--tape-200)` (`#efe0a8`) s textem `--ink` | **ne hořčicová**: hořčicová je jen hodnota (bible 2.2, 06 K1 bod 3). 07-menu měl `--color-new: var(--coin)` pro starý styl, tady se mění |
| role | `--color-locked` | `var(--pencil-500)` (`#6b6158`) | tužková skica a text podmínky |
| komponenta | `--wk-card-w`, `--wk-card-h` | `120px`, `132px` (≤ 340 px: `104px`, `124px`) | |
| komponenta | `--wk-card-bg` | `var(--card)` | |
| komponenta | `--wk-card-held-border` | `3px solid var(--ink)` | v ruce / nasazeno |
| komponenta | `--wk-card-picked-border` | `2px dashed var(--ink)` | zvolená k náhledu |
| komponenta | `--wk-sketch-stroke` | `var(--color-locked)` | |
| komponenta | `--wk-tag-new-bg`, `--wk-tag-new-fg` | `var(--color-new)`, `var(--ink)` | štítek „NOVÉ“, natočený −2° (bible kap. 8) |
| komponenta | `--wk-price-fg` | `var(--color-reward-text)` (`mustard-800`) | cena |
| komponenta | `--wk-stat-fill`, `--wk-stat-track` | `var(--ink)`, `var(--desk)` | pruh statistiky |
| komponenta | `--wk-path-now`, `--wk-path-new` | `var(--dim)` čárkovaná 1,5 px, `var(--ink)` plná 2,6 px | graf drah |
| komponenta | `--wk-tab-mark` | `var(--tape)` 4 px | podtržení záložky |
| komponenta | `--wk-preview-h` | `clamp(140px, 30dvh, 260px)` | náhledové okno na mobilu |
| komponenta | `--wk-action-h` | `56px` + `env(safe-area-inset-bottom)` | přilepený pás |

Typografie: jména modelů a ceny `--display` tučně, `tabular-nums`; popisy `--body` 15–16 px; poznámky 14 px; `--hand` jen jedna řádka (např. podpis vzhledu na detailu), nikdy cena ani podmínka.

---

## 16. Otevřené volby

**B1 Počítadlo vzhledů.** A) žádné „7 / 15“ ani sada; B) počítadlo bez odměny; C) počítadlo + odměna za všechny. **Doporučení A**: 06 13. 10. „sbírky navíc ne“, 08 N7 (sbírka vede k pocitu povinnosti); vzhledy jsou ozdoba za cestu. Maketa `?counter=1` ukáže B.

**B2 Jak se vzhled kreslí přes papír.** Papír už mění vzhled vlaštovky (papíry: materiál, vzor, obrys, stopa). A) **vzhled = potisk a akcenty nad papírem** (papír zůstává poznat podle materiálu a stopy, vzhled přidá např. lem, razítko, barevné špičky); B) vzhled papír vizuálně nahradí (papír zůstane jen v číslech); C) vzhled mění jen stopu a drobnou ozdobu, vlaštovka zůstává. **Doporučení A**: zachová schválenou identitu papírů (06 papíry 1–4) i přičitatelnost (P7), vzhled je pořád vidět zblízka (Dílna, výsledek). B je pro hráče jednodušší, ale ruší práci na papírech; C je nejlevnější, ale vzhled za letu skoro nebude vidět. Rozhoduje spolu s art-directorem (`03`).

**B3 Kolik zamčených modelů ukázat.** A) všechny s cenou a podmínkou; B) vlastněné + nejbližší 2 zamčené plně, další jako silueta „Otevře se dál na trase“; C) jen nejbližší jeden. **Doporučení B**: blízký cíl a cena vidět předem (P6, „chci a potřebuju“), ale ne celý katalog naráz (07 N5, P3 Loewenstein). Maketa `?reveal=all|near|next`.

**B4 Potvrzení koupě modelu.** A) potvrzovací list s „Mince: 9 240 → 6 840“; B) bez potvrzení, s tlačítkem „Vrátit“ na pár sekund; C) podržet tlačítko pro koupi. **Doporučení A**: nejjasnější a bez časového tlaku. B má odpočet (P13) a C je horší pro motoriku (07 A13, WCAG 2.5.1 alternativa nutná). Maketa `?confirm=0` ukáže koupi bez listu.

**B5 Vzhled pro všechny modely, nebo zvlášť.** A) jedna volba vzhledu platí pro každý model; B) každý model si pamatuje svůj vzhled; C) vzhledy jen pro konkrétní model. **Doporučení A**: méně voleb, vzhled se nezamkne koupí jiného modelu. Cena: art-director navrhuje vzhledy jako potisk na společné UV (6 modelů × 15 vzhledů musí sedět). C by znásobil práci a vytvořil „kup model, abys měl vzhled“.

**B6 Po koupi rovnou do ruky.** A) ano; B) ne, hráč zvolí „Letět s ní“. **Doporučení A**: kupuje se, aby se s tím letělo, vrátit je jedno klepnutí. Maketa `?autouse=0`.

---

## 17. Napojení na kód (pro game-deva, orientačně)

| Dávka | Obsah | Soubory |
|---|---|---|
| D1 Data | seznam modelů a vzhledů jako čistá data (id, podmínka odemčení / cena z `params.mjs` přes `atlas-numbers.js`); čisté funkce `planeState(p,id)`, `lookState(p,id)`, `unlockedLooks(p)`, `previewThrow(model,levels)` (body dráhy + dolet, bez událostí) | nový `src/wardrobe.js` (bez DOM), testy |
| D2 Save | migrace verze: `owned`, `look`, `looks`, `seen`; validace (neznámé id → výchozí, vlastněné se nemažou); retroaktivní odemčení | `src/storage.js`, testy |
| D3 Koupě | `buyPlane(p,id)` (idempotentní, ≥ cena, vrací false bez změny) | `src/core.js` nebo `wardrobe.js`, testy |
| D4 Texty | §14 do `en.js` / `cs.js` | `src/locales/*` |
| D5 UI | záložky, karty, detail, list, Vzhled, řádek novinky ve Výsledku | `index.html`, `style.css`, `src/ui.js` (po M3b z 07-menu) |
| D6 Render | model a vzhled na vlaštovce (Dílna, let), náhledové okno = kamera na ruku dítěte, přeložení | `src/render3d/*` (podle `03` art-directora) |

D5 závisí na novém menu (07-menu M3b), protože Dílna je tam panel.

## 18. Co je zástupné
- Jména modelů (Needle, Broadwing, Kite, Comet), vzhledů (Airmail, Lantern, Blueprint, …), ceny (2 400 – 60 000 ◈), podmínky a statistiky v maketě i v textu. Dodají `01`, `04` a simulátor.
- Odhad klidného hodu a dráhy v maketě jsou spočítané hrubým vzorcem, ne fyzikou hry.
- Náhled vlaštovky v maketě je 2D SVG (ne 3D scéna).

## 19. Ověření
**Maketa `prototype-dilna.html`: NOT ASSESSED** (prohlížeč nepoužit podle zadání). K ověření orchestrátorem: šířky 320 / 360 / 375 × 667, 932 × 430, 1280 × 800; EN i CS (`?lang=cs`, delší texty v kartách a detailu); scénáře `?scenario=start|early|mid|broke|late|delivered` (výchozí `mid`), volby `?reveal=near|all|next` (B3), `?confirm=0` (B4), `?autouse=0` (B6), `?counter=1` (B1), `?savefail=1` (chyba uložení koupě), v panelu makety i Výsledek s novinkou a ztráta WebGL; klávesnice (záložky šipkami, pás karet šipkami, Esc v listu a v Dílně); reduced motion (`?motion=reduce` nebo systém); kontrast pásky „NOVÉ“ a tužkové skici v pixelech; žádný vodorovný posun stránky.
