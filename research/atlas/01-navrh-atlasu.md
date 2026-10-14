# Návrh stránky Atlas pro Just Throw It

**Založeno 14. 10. 2026** (Plan agent). Podklad pro product designera a vývojáře. Odkazy: `06` znamená `research/bonusy/06-rozhodnuti.md`, `08 §x` návrh 2. kola, `P1–P15` průřezové zásady v `research/kb/README.md` a `02 N3` implikaci N3 v bloku KB 02. Herní texty jsou anglicky (06).

## 0. Shrnutí
- **Atlas bude celoobrazovkový `<dialog id="atlas">` přímo v `index.html`, ne samostatná stránka.** Z `bonus.html` se stane přesměrování na `./#atlas`. Důvody: stav hry `p` žije v paměti `ui.js`, okamžik odemčení navazuje přímo na výsledek hodu a 3D kontext by se při přechodu na jinou stránku stavěl znovu, se zásekem hlavně na mobilu.
- **Je to mapa trasy: 16 pohlednic ve 4 čtvrtích.** Nahoře jsou kapsy (Pockets), ve hlavičce jedna měna ◈ a nad mapou vždy jen jeden aktivní cíl: „Next: Gardens at the Edge · 86 m past your best“ (P6, 08 N1, N3).
- **Pravidlo stačí jedna věta:** „Fly farther to find places. Every place gives your plane a bonus. Coins level it up.“ (06).
- **Obsah, čísla a logika jsou oddělené.** Texty a ID v `src/atlas-content.js`, čisté funkce v `src/atlas.js`, čísla v samostatném modulu, který naplní až F5 a 3. kolo progrese. UI nesmí počítat s pevnými „3 úrovněmi“, protože 3. kolo (posun k incrementalu) může počet úrovní i řády cen změnit.
- **Hned může začít:** designer (prototyp a texty), logika s testy, save v4. **Čeká na F5 a 3. kolo:** ceny, hodnoty účinků, kapsy, násobitel mincí, uzel automatiky QTE a uzel Night Route. **Čeká na implementaci nového modelu letu v `src/`:** účinky bonusů v letu a náhled U1.

---

## 1. Účel Atlasu v herní smyčce

**Smyčka:** Workshop → míření → let → výsledek → (Atlas) → Workshop / další hod. Atlas je druhá dílna. Workshop staví vlaštovku (Power, Paper, Folds) a Atlas ukazuje, co hráč našel ve světě a jak to vylepšit.

**Kdy ho hráč otevře:**
1. **Po hodu, který něco objevil.** Ve výsledku je jedna řádka „Found: Market under the Antennas → **Crowd Chain**“. Tlačítko **Atlas** má stejnou váhu jako Znovu a Dílna (02 §4.3 bod 6, 08 U4).
2. **Z Dílny**, když chce utratit mince nebo vyměnit kapsu. V Dílně jsou dvě záložky: Workshop | Atlas.
3. **Z karty čtvrti** po prvním příletu do čtvrti (08 U2, §8.2).
4. **Z navigace** (`02 / Atlas`, dnešní odkaz Bonusy) a přes odkaz `#atlas`.

**Co hráči dá:**
- **Kompetenci:** vidí, co jeho vlaštovka umí a o kolik („Misses still count 30 % → 45 %“).
- **Autonomii:** volí, co vylepší a co dá do kapes (P8, 01 N3).
- **Zvědavost:** jedno blízké neobjevené místo s jednou větou teaseru (P3, 08 N1).
- **Rámec:** vzdálené čtvrti jsou vidět jen jako siluety (P6, 08 N2).
- **Radost z čísel:** čísla jsou vidět (06, 14. 10. bod 5).

**Co ho táhne dál:**
- další místo („214 m past your best“),
- další úroveň („120 ◈ to go“),
- nové sloveso v letu (Steam Hop: tap-tap),
- druhá kapsa,
- finále.

**Co ho netáhne:** časovače, denní odměny, série ani „ztratíš…“ (P13).

---

## 2. Mapování na KB

### 2.1 Zásady P1–P15

| Zásada | Jak ji Atlas splňuje |
|---|---|
| **P1** zpětná vazba podle výkonu | Síla oslavy odpovídá skutečné události: nové místo > koupě úrovně > prohlížení (to nemá žádnou). Hranice čtvrti a finále jsou největší. Otevření Atlasu nic neoslavuje. |
| **P2** juice s optimem | Animace jen při změně stavu (pohlednice se „rozsvítí“, úroveň se doplní), do ~600 ms, klepnutím přeskočitelné. Žádné stálé třpytky v mřížce. |
| **P3** zvědavost a nejistý výsledek | Teaser jen u nejbližšího místa: věta, která slibuje rozuzlení, ne výčet detailů. Vzdálené čtvrti mají jen název a náladu. Novinky nese obsah (nové sloveso, nové místo), ne náhoda (výhrada P3 o náhodné variabilitě). |
| **P4** měřit trojím způsobem | Oddíl 8: log, miniPXI s položkou Curiosity a rozhovor. |
| **P5** kritické body odchodu | Hranice čtvrti a finále jsou přirozené zastávky. Karta čtvrti i souhrn po dohrání mají rovnocenná tlačítka „Keep flying“ / „Done for now“ (02 N6, 08 N11, 09 N2). Postup se ukládá automaticky. |
| **P6** blízké cíle ve vzdáleném rámci | Nahoře je jen jeden aktivní cíl. Počet „2/4 Moon Docks“ se ukazuje jen u dosažených čtvrtí (08 N7). Celkové procento ani „16/16“ nikde není. |
| **P7** přičitatelnost | Každá karta říká přesně, co bonus dělá, s čísly. Náhled je jen pravdivý přepočet. Rozpis „You / Plane / Wind & luck“ patří do výsledku (08 U4), Atlas ho nezdvojuje. U Shooting Star a Paper Crane je napsáno, že je výsledek přizná. |
| **P8** čitelnost volby | Každá karta má štítek „pro koho“ (Helps when you miss / Rewards perfects / Every throw / Long flights) a náhled. Volba mezi úrovněmi tak není naslepo, na rozdíl od dnešních přehybů. |
| **P9** QTE se stálým středem | Atlasu se netýká. Jen smyčka tří snímků u událostí ukazuje sloveso. |
| **P10** pravdivá těsnost | Vzdálenosti se počítají z rekordu („86 m past your best“). Žádné „SO CLOSE!“ a žádná zvýrazněná „skoro“ stylizace. |
| **P11** zvuk ne jako jediná informace | Případný zvuk odemčení je jen doplněk. Vše je vidět. |
| **P12** mince jako informace | Mince jsou odměna za lety a utrácí se na jednom místě. Za otevření Atlasu ani za dokončení čtvrti nejsou žádné mince (02 N9). Ceny jsou vidět předem. |
| **P13** dobrovolnost | Nic nevyprší a neubývá. Výměna kapes je zdarma. Poslední koupi lze vrátit až do dalšího hodu (08 Pravidla Dílny). Bez notifikací. Hra má konec („Delivered.“) a Night Route je dobrovolný uzel (06). |
| **P14** nováček a zkušený hráč | Odkrývá se postupně (viz 3.4). Podrobná čísla jsou „More“ na klepnutí. Nápověda je jedna věta, která po třech otevřeních zmizí (07 N1, N2). |
| **P15** přístupnost a mobil | Celé je to HTML (žádný text v canvasu, 07 N8), cíle ≥ 44 px, kontrast ≥ 4,5 : 1, reduced motion. Podrobně v oddílu 5. |

**Klíčové implikace z bloků:**
- **01 N1, 02 N1:** koupě se formuluje jako „Spend what you earned flying“, ne „Earn more!“.
- **02 N10:** jen formulace zisku a pokroku. Kontroluje to test zakázaných slov (6.4).
- **03 N8:** hodnoty bonusů jsou označené jako „Plane“, aby nezakrývaly hráče.
- **07 N5:** odkrývat postupně, ale cíl musí být vidět (první kapsa s cenou).
- **07 A18:** prázdná stránka Bonusy přestane být slepou uličkou.
- **08 N1, N2, N7:** sbírka se zřetelnou strukturou bez povinnosti. Sbírají se zážitky (pohlednice), ne inventář.
- **09 §2.3:** dobrý bod zastavení uzavírá rozdělanou věc, shrne změny, ukáže příště bez tlaku a uloží.

### 2.2 Test „engagement, ne compulsion“ (02 §2.7)
1. **Hráč umí říct, proč pokračuje:** chce vidět další místo nebo nové sloveso.
2. **Přestat nic nestojí:** nic nepropadá.
3. **Odměna je předvídatelná z výkonu:** místo odemyká dolet a úroveň má pevnou cenu. Žádný los.
4. **Smyčka má konec:** 16 míst, finále a souhrn.
5. **Pokračování je aktivní volba:** z Atlasu se nikdy nehází samo a tlačítko Throw není výraznější než Back.
6. **Funguje i pro hráče, kterým se nedaří:** Packing Tape a asistence. Atlas neukazuje „neúspěchy“.

### 2.3 Seznam „čemu se vyhnout“ (02 §4.3)

| # | Zákaz | Jak se mu Atlas vyhne |
|---|---|---|
| 1 | náhodná výše odměny | Žádné truhly ani „mystery“ bonusy. Bonus místa je předem známý, jakmile je místo teaserem. |
| 2 | kupovatelná měna, vícevrstvá měna | Jen ◈. Kapsy se platí ◈, žádné žetony ani razítka. |
| 3 | vyrobený near-miss | Vzdálenosti jen z rekordu. Žádné „skoro“ animace u teaseru. Paper Crane pomáhá jen pravdivě a vždy to přizná. |
| 4 | série, denní odměny, schůzky, expirace | Nic z toho neexistuje. Kombo se mezi lety nepřenáší (08 Z5), proto se mu neříká „streak“. |
| 5 | hrozba ztráty | Undo, výměna zdarma, nic nedegraduje. |
| 6 | návnady v rozhodovacích momentech | Tlačítka Back to Workshop / Throw / Done for now jsou stejně velká a stejně barevná. Nic nebliká. |
| 7 | vymyšlený časový tlak | Žádné slevy ani „only now“. |
| 8 | parasociální tlak postav | Hlášky postav nikdy nepřemlouvají k hraní (08 §7 je tak psané). V Atlasu je to kontrolované testem textů. |
| 9 | fiktivní žebříčky | Nic se se nikým nesrovnává. |
| 10 | oslava nezávislá na výsledku | Při otevření ani při procházení Atlasu se nic neslaví. Oslava jen při skutečném nálezu. |
| 11 | „dopaminová dávka“ | V dokumentech ani v kódu se tak neargumentuje. |

**Žádný checklist (08 N7, N8; 07 review §4.4):**
- žádné „Max all 28 levels“, žádný počítač maximálních úrovní, žádné procento dokončení,
- za dokončenou čtvrť ani za všechny úrovně 3 žádná odměna,
- korunka na úrovni 3 jen změní vzhled pohlednice (informace),
- hlášky postav a vtipy o dopadu se ukazují jen ty odemčené, **bez počtu „2/3“**,
- místa se odemykají jen doletem a postupně, takže sbírka nikdy nemůže být podmínkou postupu.

**Tečka na tlačítku Atlas** se ukáže jen při nové věci, kterou hráč ještě neviděl. **Nikdy kvůli tomu, že si může něco koupit** (to by bylo připomínání).

---

## 3. Informační architektura a obrazovky

### 3.1 Struktura Atlasu (shora dolů)
1. **Hlavička:** `ATLAS · THE ROUTE`, peněženka `1,240 ◈` (`aria-label="1,240 coins"`), tlačítka `← Workshop` a `Throw ↗` (stejná váha), zavírací ✕ a Esc.
2. **Aktivní cíl** (jeden řádek): `Next: Gardens at the Edge · 86 m past your best`. Po dohrání: `Delivered. The Workshop is yours.`
3. **Kapsy:** dva rámečky slotů. Viz 3.5.
4. **Trasa:** 4 sekce čtvrtí, v každé 4 pohlednice. Na trase je značka rekordu (ikonka vlaštovky) a čára trasy v barvách čtvrtí podle `research/svet/01-zivy-svet.md` §2.2: Suburbs růžová, Docks azurová, Horizon zlatá, Core magenta.
5. **Patička čtvrti** (jen u dosažených): postava čtvrti a její odemčené hlášky.
6. **Detail karty:** na mobilu bottom sheet, na desktopu pravý panel podobný dnešnímu `#detail`.

### 3.2 Stavy místa

Objevení se odvozuje z `p.best` a neukládá se. Glider se odemyká na 100 m.

| Stav | Kdy | Co je vidět |
|---|---|---|
| `frame` (rámec) | místa v ještě nedosažených čtvrtích, kromě teaseru | Jen sekce čtvrti: název, jedna věta nálady („Moon Docks — somewhere past the railway.“), tmavá silueta panoramatu. Žádná jména míst, bonusy ani počty (08 N2). |
| `unknown` | v dosažené čtvrti, za teaserem | Tmavá silueta pohlednice, „???“. |
| `teaser` | přesně jedno, nejbližší neobjevené místo | Silueta s rozpoznatelnou dominantou (komín, jeřáb…), jméno, jedna věta teaseru, `86 m past your best`, ikona bonusu ve stínu a jeho jméno s jednou větou bez čísel („**Pinwheel** · Spin the wind before you throw.“). To je „chci“ (otázka 2 v oddílu 9). |
| `found` (úroveň 1, zdarma) | rekord ≥ začátek místa | Barevná pohlednice, štítek „New“, dokud karta nebyla otevřena, bonus na úrovni 1. |
| `level n` (2…max) | koupeno | Ukazatel úrovní (tečky ●●○) a hodnota účinku. |
| `max` | nejvyšší úroveň | Korunka: pohlednice dostane neonový rám čtvrti. Jen vzhled, žádná odměna. |
| bez úrovní | Glider (model) | `found` s odkazem „Choose it in the Workshop →“. |
| Encore | Rooftop Harbor | Před finále „Finish the route to open“. Po finále uzel **Night Route** k odemčení ve stromu za ◈ (06, 14. 10. bod 2). |

Místa, která otevírají papír (3. místo čtvrti: Gardens → Kraft, Bridge → Washi, Saddle → Neon Foil; 06, 14. 10.), mají na kartě navíc řádek „Also opens: **Kraft Paper** in the Workshop →“.

### 3.3 Karta místa a bonusu (detail)

Pořadí odpovídá hierarchii z 07 N9.
1. **Pohlednice:** na desktopu smyčka tří snímků „jak to vypadá“ (08 §8.5), na mobilu jen při otevřené kartě. Při reduced motion statický první snímek.
2. **Hlavička:** `MARKET UNDER THE ANTENNAS · Violet Suburbs 2/4` a jméno bonusu **Crowd Chain**.
3. **Štítky:**
   - sloveso: `TAP` / `HOLD` / `TAP-TAP` / `TAP IN PLACE` / `PASSIVE` / `BEFORE THROW` / `LANDING`,
   - pro koho: `Combos`, `Helps when you miss`, `Rewards perfects`, `Every throw`, `Long flights`.
4. **Účinek s čísly:** šablona s hodnotou, teď → další úroveň. Příklad: „Each combo step adds **+10 %** push (max ×4) → **+13 %** (max ×5)“. Čísla dodá modul čísel.
5. **Náhled „chci a potřebuju“ (U1), jen pravdivý.** Podle druhu bonusu:
   - Bonusy na dolet: „≈ +38 m on your last throw · past Wind Ridge“ (přepočet posledního hodu, funkce z jádra progrese).
   - Bonusy s jiným měřítkem (06, 14. 10. bod 2):
     - Paper Crane: „Would have tugged you past 1 more place in your last 10 throws“,
     - Shooting Star: „When it appears: ≈ +4 % that flight“,
     - Packing Tape: „You missed 2 events last flight → would have kept ≈ +24 m“.
   - Hráčův vlastní důvod se ukáže jen tehdy, když opravdu platí z historie, nikdy vymyšleně.
   - Dokud náhled neexistuje (před implementací modelu), jen kvalitativní věta.
6. **Cena a tlačítko:**
   - `Level up · 170 ◈`, když na ni hráč má,
   - jinak neaktivní `120 ◈ to go` (cíl nákupu bez odhadu hodů, 08 E09, rozpor R-N6),
   - `Max level` na nejvyšší úrovni,
   - po koupi `Undo · until your next throw`.
7. **Příběh místa:** jedna věta (překlad `story` ze `src/scenes.js`).
8. **More** (sbalené): přesné hodnoty všech úrovní a interakce se stropy (koše E a β z 08 §2.7). Pro zkušené (P14).

### 3.4 Co se ukáže hned a co postupně (onboarding a dávkování)

| Kdy | Co přibude |
|---|---|
| před 100 m | Tlačítko Atlas není vidět (stará KB B11: „ukázat atlas až po prvním objevu“). Odkaz `#atlas` ukáže jen první čtvrť a teaser First Roofs. |
| 100 m (Glider) | Výsledek: „Found: First Roofs → **Glider** (Atlas)“. Tlačítko Atlas se objeví s tečkou. **První otevření** viz 4.2. |
| od prvního otevření | Kapsa 1 je vidět jako jeden cíl s cenou (08 §5.1). Kapsa 2 zatím není. |
| nová čtvrť | Sekce čtvrti se z `frame` změní na 4 karty. Karta čtvrti, nové speciály v kapsách. |
| Red Horizon | Kapsa 2 se objeví s cenou. |
| finále | Souhrn, Encore, uzel Night Route. |

**Pravidla dávkování:**
- **Jedna novinka za hod ve výsledku** (08 U3). Pořadí: finále > karta čtvrti > nový bonus > nový papír > hláška postavy. Ostatní čekají ve frontě `p.atlas.pending` a ohlásí se po dalších hodech.
- **Atlas sám ukazuje všechno nalezené** se štítkem „New“: hráč se rozhodl podívat, nic se mu nemá tajit. Fronta platí jen pro ohlášení ve výsledku a pro první setkání v letu (to patří implementaci nového modelu).
- **Nápověda je jedna věta pod hlavičkou** (pravidlo z 1.). Po třetím otevření se sbalí na ikonu „i“. Žádný blokující tutoriál ani obecné tlačítko „?“ (07 N2).

### 3.5 Kapsy (Pockets)
- **Dva rámečky.** Zamčená kapsa: `Pocket 1 · 300 ◈` (cena podle F3, dodá F5).
- **Klepnutí na kapsu otevře výběr speciálů.** Seznam ve dvou skupinách:
  - **Active** (Dive, Cushion, Whistle, Paper Rocket): „One active ability at a time“,
  - **Passive** (Sharp Edge, Calm Sky): „Sharp Edge and Calm Sky don't mix“.
- Zakázané kombinace jsou zašedlé **s důvodem**, ne skryté (P8).
- U každého speciálu je kompromis jednou větou („Narrower windows, stronger hits“) a sloveso.
- **Speciály z dalších čtvrtí** se neukazují. Jen řádek „More in Moon Docks“ (08 N2).
- **Výměna je zdarma** mezi hody, bez potvrzování.
- **Při prvním nasazení** se při míření ukáže jedna věta nápovědy (08 §7.3, §8.5).
- **Mimo Atlas:** nasazené kapsy jsou vidět v Dílně a při míření jako malé čipy, ťuknutím otevřou Atlas na kapsách.

### 3.6 Postavy čtvrti
- **Patička dosažené čtvrti:** portrét (silueta s jedním akcentem, svět §5.1), jméno a role („Bolts — retired delivery robot“).
- **Hlášky:** odemčené hlášky v pořadí, kdy zazněly (08 §7.1). Bez počtu zbývajících.
- **Holubi a poryvy čtvrti** (08 §7.2) jako malé „Locals“ ikony s jejich jménem (Cyber Pigeon, Courier Gull…). Podporuje 06 („postavy a místní holubi ano“).

### 3.7 Vazba na Dílnu
- **Dvě záložky** v jednom prostoru.
- **Řádky typu „Also opens…“** vedou z Atlasu do Dílny.
- **Zamčený druh papíru** v Dílně ukazuje „Opens at Gardens at the Edge →“ s odkazem na kartu v Atlasu (08 W2 upravené rozhodnutím 06, 14. 10.).

### 3.8 Jedna měna a čitelná čísla
- **Jen ◈** a jen `Intl.NumberFormat('en-US')`: `1,240 ◈`, `10,000 ◈`.
- **Od 1 000 000 kompaktně** (`1.2M ◈`), protože 3. kolo může přinést ceny v desetitisících (06, 14. 10. bod 3).
- **Jednotky s mezerou:** „86 m“, „+13 %“ (07 A17).
- **Násobitel mincí**, pokud ho 3. kolo zavede: v hlavičce čtvrti „Coins ×1.6 here“. Viditelné číslo bez nutkání (06, 14. 10. bod 5).

---

## 4. Klíčové momenty

1. **Objevení místa (odemčení bonusu)**
   - **Za letu:** jen krátké bliknutí názvu místa (08 §2.5). Let se nezastavuje.
   - **Ve výsledku:** jedna řádka (nahradí řádku teaseru v U4): „Found: **Gardens at the Edge** → Pinwheel · Kraft Paper is in the Workshop“.
   - **V Atlasu:** pohlednice se ze siluety „vybarví“ (komiksový tisk, 400–600 ms, s reduced motion okamžitě) a teaser se posune na další místo.
   - Síla oslavy je vázaná na skutečný nález (P1).
2. **První otevření Atlasu**
   - Otevře se na Violet Suburbs. Karta Glider je otevřená v detailu, teaser Market je vidět.
   - Pod hlavičkou je věta pravidla a kapsa 1 s cenou je jediný další cíl. Ostatní čtvrti jsou rámec.
   - Žádné prohlídky ani šipky „klikni sem“ (07 N1, N2).
3. **Koupě úrovně**
   - Mince ubydou z peněženky (krátká animace čísla), tečka úrovně se doplní, hodnota „teď“ se přepíše na novou.
   - Toast: „Crowd Chain · Level 2“ a nabídka Undo.
   - Skromně: koupě je informace, ne výhra (02 N3).
4. **Odemčení (koupě) kapsy**
   - Rámeček se otevře a hned nabídne výběr („Pick a special“).
   - Po nasazení ukáže první let jednu větu nápovědy. To je jediná nápověda.
5. **Hranice čtvrti**
   - **Za letu:** neonový název čtvrti a jiná barva stopy (08 §8.2, svět §1.3). Let se nezastavuje (svět R6).
   - **Po dopadu poprvé:** karta čtvrti: pohlednice čtvrti, první hláška postavy, „New in your pockets: **Dive**“, u Red Horizon i „Pocket 2 is open“.
   - **Tři rovnocenná tlačítka:** `Keep flying` / `Open Atlas` / `Done for now`. Je to přirozený bod zastavení (09 §2.3, P5).
   - Papír se už na hranici neotevírá (06, 14. 10.), takže karta čtvrti nenese „zeď“.
6. **Konec trasy a souhrn po dohrání**
   - **Finále:** viz 08 §8.4, poté obrazovka **Delivered.**
   - **Souhrn** (06, 14. 10. bod 4: souhrn ano, osobní statistiky zatím ne): 16 rozsvícených pohlednic, poslední věta každé postavy a 3–4 čísla, která vyprávějí cestu: hody do cíle, nejdelší hod, nejvíc míst jedním hodem, nejlepší kombo.
   - **Rovnocenná tlačítka:** `Done` / `Keep playing`.
   - V Atlasu pak zůstane razítko „Delivered“ na trase a souhrn jde znovu otevřít z karty Encore.
7. **Night Route ve stromu**
   - Po finále se na kartě Encore otevře uzel **Night Route** („Fly the whole route again, after dark.“) s cenou v ◈ (cenu dodá 3. kolo).
   - Neodemyká se automaticky (06). Koupě je dobrovolná volba bez tlaku. Text nesmí naznačovat, že hra „není hotová“.
   - Po odemčení přepínač zobrazení Day / Night (noční varianty pohlednic). Obsah noci určí 3. kolo.
   - Datový model musí umět uzly nevázané na místo, aby šly přidat bez přestavby (viz 6.2).

---

## 5. Mobil a desktop

**Mobil (portrét, ~360–430 CSS px):**
- **Atlas zabírá celou obrazovku.** Hlavička a kapsy jsou připnuté nahoře, čtvrti se posouvají svisle a trasa vede shora dolů (svislá čára s rekordem vlevo).
- **Karty 2 × 2 na čtvrť**, pohlednice v poměru 4 : 3, šířka ≥ 150 px.
- **Detail jako bottom sheet do 85 % výšky.** Tlačítko koupě je dole v dosahu palce a vždy vidět bez rolování (07 N10).
- **Zavírání:** tažením dolů, ✕ nebo systémovým „zpět“ (`popstate`).

**Mobil (na šířku):** dva sloupce, vlevo mapa a vpravo detail, jako na desktopu, ale s menšími pohlednicemi.

**Desktop:**
- **Mřížka 4 × 4:** řádky jsou čtvrti, sloupce místa 1–4, takže trasa čte zleva doprava jako let.
- **Pravý panel** s detailem (vzor dnešního `.upgrade-layout` + `#detail`), kapsy nad mřížkou.

**Ovládání a přístupnost:**
- **Dotykové cíle ≥ 44 × 44 CSS px** s mezerou ≥ 8 px (07 A9, R-N8: XAG 15 mm je přísnější varianta, zvolit při návrhu).
- **Text:** nic informačního pod 12 CSS px, ceny, názvy a tlačítka ≥ 16 px (07 A1).
- **Kontrast:** text ≥ 4,5 : 1 i na pohlednicích (podklad pod textem, ne text přímo na obrázku, 07 A2). Stav (zamčeno, dostupné, maximum) nikdy jen barvou: i ikonou a textem (07 A4).
- **Barvoslepost:** paleta čtvrtí projde simulací (07 A5). Teaser a zamčené místo se liší tvarem (silueta oproti „???“), ne jen tónem.
- **Reduced motion** (systémové i herní nastavení, 07 A6): bez rozkládání a vybarvování, bez smyček snímků, bez animace mincí. Změna stavu jen prolnutím ≤ 150 ms. Plynulé posouvání `scrollIntoView` bez `smooth`.
- **Blikání:** žádné. Neonový rám korunky svítí trvale (07 A7, svět §1.5).
- **Klávesnice:**
  - mřížka s roving tabindex a šipkami, Enter otevře kartu, Esc zavře,
  - `<dialog>` drží fokus a po zavření ho vrátí na tlačítko Atlas (07 A8),
  - `aria-live="polite"` pro „Found…“ a „Level 2“, ◈ s popiskem (07 A15).
- **Výkon:**
  - pohlednice jako `webp` s `loading="lazy"`, snímky smyčky se načtou až při otevření karty,
  - Atlas překresluje DOM jen při změně, nikdy ve smyčce snímků (známý problém „render smyčka přepisuje DOM“ v `CLAUDE.md`),
  - pod otevřeným Atlasem se 3D nekreslí (6.1).

---

## 6. Technický návrh

### 6.1 Panel v `index.html`, ne samostatná stránka
- **`<dialog id="atlas">`** (fullscreen na mobilu, velký modál na desktopu). Vzor je dnešní `#result`: zachytávání fokusu, Esc, inertní pozadí.
- **Stavový automat v `src/ui.js` se nemění.** Atlas není herní stav, je to překryv, který jde otevřít jen ve stavech `workshop` a `result`. Z výsledku se nejdřív zavře `#result`, potom se otevře Atlas a po zavření se vrací do `workshop`. Během `aim` a `flight` otevřít nejde.
- **3D renderer:**
  - když je Atlas otevřený, `frame()` v `ui.js` přeskočí volání `render()` (3D drží poslední snímek, šetří GPU a baterii),
  - `src/render3d/` se měnit nemusí,
  - Dílna už dnes běží na 30 fps a předehřívá místa 2–5, to zůstane.
- **Směrování:**
  - `#atlas` a `#atlas/<placeId>` přes `history.pushState`, `popstate` zavře Atlas,
  - `bonus.html` bude jen `location.replace('./#atlas')` s `<noscript>` odkazem,
  - v navigaci `02 / Atlas` (07 A18 vyřešeno).
- **Proč ne samostatná stránka:**
  - znovu by se vytvářel WebGL kontext (na mobilu pomalé, ztráta předehřátí),
  - moment odemčení by se roztrhl přes načtení stránky,
  - stav by se musel synchronizovat přes localStorage.
  
  Samostatná stránka by vyhrála jen při sdíleném odkazu na Atlas bez hry. To pokryje `#atlas`.

### 6.2 Datový model: oddělit obsah od čísel

**`src/atlas-content.js`** (obsah, anglicky, bez laditelných čísel):
```js
export const PLACES=[{id:'roofs',index:0,district:0,name:'Workshop & First Roofs',teaser:'…',story:'…',bonus:'glider',opensPaper:null}, …16]
export const BONUSES={glider:{name:'Glider',kind:'model',verb:'MODEL',tags:['style'],levelled:false,effect:null,art:'glider'},
 chain:{name:'Crowd Chain',kind:'event-mod',verb:'TAP',tags:['combos'],levelled:true,effect:'Each combo step adds {step} push (max ×{max})',art:'chain'}, …}
export const SPECIALS={dive:{name:'Dive',active:true,tradeoff:'Trade height for speed',hint:'DIVE · Hold to dive, let go to pull up'}, …}
export const DISTRICTS=[{id:'violet',name:'Violet Suburbs',frame:'…',character:{id:'bolts',name:'Bolts',role:'…',lines:['…','…','…']},locals:{bird:'Cyber Pigeon',gust:'Market Vent'}}, …]
export const NODES={encore:{…}, nightRoute:{name:'Night Route',requires:'finished',placeId:'harbor'}}
```
- **ID jsou stabilní řetězce** (stejné jako `atlas.bonuses` v `simulation/progression/params.mjs`: `chain`, `pinwheel`, `steam`, …), nikdy indexy. Obsah se ve 3. kole ještě může změnit.
- **`NODES`** jsou uzly nevázané na místo, nebo vázané volitelně: Night Route, budoucí automatika QTE (06, 14. 10.: „automatika ve stromu bonusů“), případně bonusy „+X % mincí“.

**Čísla:** samostatný modul (`src/progression-numbers.js` nebo podobný), struktura:
```js
{atlas:{maxLevel:{chain:3,…}, prices:{chain:[null,40,90]}, values:{chain:[{step:.10,max:4},…]}},
 pockets:{prices:[300,5040], secondFromDistrict:2, unlock:{…}, exclusive:[['sharp','calm']], oneActive:true},
 paper:{openAtPlace:3}, gliderAt:100, coinMultiplier:null, nodes:{nightRoute:{price:null}}}
```
- **Do dokončení F5 je hodnota `PROVISIONAL`** a odpovídá dnešnímu `params.mjs`.
- **`params.mjs` patří agentovi F5 a nikdo jiný ho teď nemění** (`11-plan-implementace.md`).
- **Po F5:** jeden integrační krok, kdy simulátor bere čísla ze `src/` (doporučení 08 §10.1: hra a simulace mají sdílet kód), nebo test hlídá shodu (viz 6.4).
- **UI čte `maxLevel` a ceny z modulu**, nikdy pevně 3 úrovně ani pevné řády cen.

**Save v4** (`src/storage.js`, výchozí hodnota v `fresh()` v `src/core.js`):
```js
p.version=4
p.atlas={levels:{chain:1},        // jen KOUPENÉ úrovně navíc (0…max−1); úroveň 1 = objeveno, odvozeno z p.best
 seen:['glider','chain'],         // otevřené karty (štítek New, tečka na tlačítku)
 pending:['pinwheel'],            // fronta ohlášení ve výsledku (1 za hod)
 lines:{bolts:2},                 // kolik hlášek postavy zaznělo
 pockets:{owned:1,slots:['cushion',null]},
 nodes:{nightRoute:false}, finished:false, hintOpens:0,
 undo:null}                       // {id,level,price} do dalšího hodu
```
- **Objevení se neukládá**, odvozuje se z `p.best`, takže nemůže vzniknout nesoulad.
- **Migrace v3 → v4:** prázdný `atlas`. Pro hráče s rekordem nad více místy jedno souhrnné ohlášení „Your past flights found 3 places“ jako jediná novinka. Přemapování dnešních 5 úrovní Dílny na nové 3/12/3 patří implementaci progrese, ne Atlasu.
- **Validace:** neznámá ID se zahodí (dopředná kompatibilita, obsah se ještě mění), úrovně se oříznou na `maxLevel`, sloty projdou pravidly (jedna aktivní, výlučné dvojice).
- **Zálohování poškozeného savu:** jako dnes (`just-throw-it-v1-corrupt`).

### 6.3 Čisté funkce bez DOM (`src/atlas.js`)
- `placeStates(p, content, numbers)` → pole 16 stavů (`frame` / `unknown` / `teaser` / `found` / `level` / `max`). Teaser je vždy nejvýš jeden.
- `nextGoal(p)` → `{placeId, metersToGo}` nebo `{delivered:true}`.
- `levelOf(p,id)`, `nextCost(id,level)`, `canUpgrade(p,id)`, `upgrade(p,id)` (vzor `buy` v `core.js`), `undoLast(p)`, `clearUndo(p)` (volá se při hodu).
- `buyPocket(p)`, `canEquip(p,slot,id)` → `{ok, reason}` s důvodem pro UI, `equip(p,slot,id)`.
- `discoveries(prevBest,best,p)` → novinky, `queueNovelties(p,list)`, `takeNovelty(p)` (jedna za hod, s prioritou ze 3.4).
- `districtSummary(p)` → počty jen pro dosažené čtvrti.
- `atlasNotice(p)` → je tečka na tlačítku? (jen neviděné novinky, nikdy dostupnost koupě).

**Texty a formát** (`src/atlas-text.js`, čisté):
- `fmtCoins`, `fmtMeters`, `fmtPct` přes `Intl` en-US, kompaktně od 1 M,
- `effectLine(bonus, values, level)` (dosazení do šablony), `teaserLine(place, metersToGo)`, `noveltyLine(n)`.

**Náhled U1:** Atlas ho jen zobrazuje. Funkce `previewThrow(p, change, lastFlight)` patří do jádra nového modelu letu (`src/core.js` po implementaci 08 §2.3). Atlas je na ni připravený, a dokud chybí, ukazuje jen kvalitativní větu.

**DOM** (`src/atlas-ui.js`):
- vykreslení dialogu, karet, sheetu a kapes, zpracování událostí, volá jen funkce z `atlas.js`,
- `ui.js` dostane jen háčky: tlačítko, otevřít/zavřít, po `finish()` zavolat `discoveries` a `takeNovelty` a zapsat řádku do výsledku, při hodu `clearUndo`, v `frame()` přeskočit render.
- CSS je samostatná sekce `.atlas-*` ve `style.css`.

### 6.4 Testy (pravidlo projektu: každé chování má test v `tests/`)
- **`tests/atlas.test.js`:**
  - odvození stavů z rekordu (hranice místa přesně na `n·SCREEN_METERS`, Glider na 100 m),
  - teaser je vždy nejvýš jeden a za ním se nic neprozradí (strážní test 08 N2: jména míst z nedosažených čtvrtí ve výstupu `placeStates` nejsou),
  - ceny a koupě, nedostatek mincí, maximum, undo a jeho zrušení hodem,
  - kapsy: jedna aktivní, výlučnost Sharp Edge × Calm Sky, výměna zdarma, kapsa 2 až od Red Horizon,
  - fronta novinek: jedna za hod, priorita,
  - papír na 3. místě čtvrti (`openAtPlace`),
  - Night Route jen po dohrání,
  - `atlasNotice` nereaguje na dostupnost koupě.
- **`tests/atlas-text.test.js`:**
  - každá šablona má hodnotu pro každou úroveň, formát čísel (`1,240 ◈`, `1.2M ◈`, „86 m“),
  - **test zakázaných formulací** ve všech herních textech Atlasu a postav: `last chance`, `hurry`, `don't lose`, `streak`, `daily`, `limited`, `only now`, `miss out`, `come back` (02 N10, §4.3 body 4–8; strukturální kontrola podle Wang 2026, 02 §2.7),
  - kontrola obsahu: 16 míst, každé s teaserem ≤ 90 znaků a bonusem, ID shodná s `params.mjs` (`atlas.bonuses`).
- **`tests/storage.test.js` rozšířit:** migrace v3 → v4, sanitace neznámých ID, oříznutí úrovní, neplatné sloty, poškozený `atlas` → záloha.
- **Po F5: test shody čísel** `src/` ↔ `simulation/progression/params.mjs` (dokud se nesloučí), aby Atlas neukazoval jiná čísla, než simulátor ověřil.

### 6.5 Grafika pohlednic (3D komiksové město, 06)
- **Fáze 1:** zástupné SVG siluety podle `kind` míst (dominanta, obrys, půltón v barvě čtvrti).
- **Fáze 2:** deterministické snímky z 3D (`render3d-preview.html` / `window.__r3d.snapshot` s pevnou kamerou na místo, seed 1) s komiksovým rámem, uložené jako `assets/atlas/<placeId>[-1..3].webp`.
  - Znovu se vygenerují, když se změní město (fáze b a F5–F7 plánu světa).
  - Silueta neobjeveného místa vznikne posterizací téhož snímku do jednoho tónu.
  - Karta čtvrti a souhrn použijí stejný sklad (svět F10, R3 „pohlednice letu“).

---

## 7. Rozdělení práce pro agenty

**Hned (souběžně, bez konfliktů souborů):**

| # | Kdo | Co | Soubory (vlastník) |
|---|---|---|---|
| A1 | **product designer** | Wireframy mobil (portrét a na šířku) a desktop. Vizuální jazyk: komiksová pohlednice, půltón, obrys, palety čtvrtí ze světa §2.2. Všechny stavy karty z 3.2, karta čtvrti, souhrn Delivered, výběr kapsy. Specifikace pohybu včetně reduced motion. Změřené kontrasty. **Kompletní sada anglických textů:** 16 teaserů (věta, která slibuje rozuzlení), 4 věty rámce čtvrtí, šablony účinků, štítky, tlačítka, prázdné stavy, toasty. **Klikací prototyp s falešnými daty.** | nové `prototype-atlas.html` + `prototype/atlas/` (vzor `prototype-3d.html`), `src/` beze změny |
| A2 | **vývojář „logika Atlasu“** | `atlas-content.js` (struktura a dočasné texty, finální dodá A1), `atlas.js`, `atlas-text.js`, čísla jako fixture `PROVISIONAL` z dnešního `params.mjs`, testy z 6.4 | `src/atlas-content.js`, `src/atlas.js`, `src/atlas-text.js`, `tests/atlas*.test.js` |
| A3 | **vývojář „save“** | save v4, migrace, sanitace, výchozí `fresh()` | `src/storage.js`, `fresh()` v `src/core.js` (jen tento řádek), `tests/storage.test.js` |

- **Konflikt na `src/core.js`:** A3 mění jen `fresh()`. Jiná práce na jádru (nový model letu) musí běžet později nebo se koordinovat přes hlavní konverzaci.
- **`params.mjs` nemění nikdo kromě agenta F5.**

**Po schválení prototypu A1 (sekvenčně, jeden vlastník `ui.js`):**

| # | Kdo | Co | Soubory |
|---|---|---|---|
| B1 | **vývojář „UI Atlasu“** | dialog, mřížka, sheet, kapsy, směrování `#atlas`, přesměrování `bonus.html`, háčky v `ui.js`, CSS, zástupné SVG pohlednice | `src/atlas-ui.js`, `index.html`, `bonus.html`, `style.css` (sekce `.atlas-*`), `src/ui.js` (jen háčky) |
| B2 | **hlavní konverzace** | integrace a `npm test`, ruční ověření na mobilu (iPhone 15 Pro) a desktopu | – |

**Co musí počkat:**
- **Na F5 a 3. kolo progrese:**
  - ceny úrovní a kapes,
  - hodnoty účinků a `maxLevel` (možná víc než 3),
  - násobitel mincí,
  - uzel automatiky QTE a jeho umístění,
  - cena a obsah Night Route.

  Pak **C1 „čísla“**: modul čísel ze `src/`, test shody se simulátorem, odstranění `PROVISIONAL`.
- **Na implementaci nového modelu letu v `src/`** (08 §2.3, 11-plan): účinky bonusů v letu, `previewThrow` pro U1, první setkání s událostí (U3). Do té doby Atlas funguje jako mapa objevů a koupě úrovní se zobrazí jako „Coming soon“. Nejjednodušší je **pustit B1 do hry až s novým systémem**. Prototyp A1 a logika A2/A3 jsou hotové předem.
- **Na plán světa F9/F10:** snímky pohlednic ze 3D, karta čtvrti a finále ve 3D.

---

## 8. Jak ověřit, že Atlas baví (KB 09 §4.1, P4)

**Kola:** RITE, kolo A 5–6 lidí (aspoň 2 na dotyku), kolo B 5–6 lidí na zmrazené verzi.

**Lokální log** (`?playtest=1`, samostatný klíč, se souhlasem, 09 Z39):
- `atlas_open` (zdroj: výsledek / Dílna / navigace / karta čtvrti / novinka), `atlas_time`,
- `card_view` (id, stav), `upgrade` (id, úroveň, zobrazený náhled, hody od posledního nákupu), `undo`, `pocket_buy`, `pocket_equip`,
- `atlas_close → next_action` (hod / Dílna / odchod),
- `last_state_before_exit` včetně stavu „v Atlasu“ a „na kartě čtvrti“.

**Vyhodnocení (pravidla, ne průměry):**
1. **Porozumění pravidlu:** po 10 minutách převypráví „místo dá bonus, mince ho zvednou“ aspoň 8 z 10 hráčů. Jinak upravit větu pravidla a první otevření.
2. **Zvědavost:** otázka „Kam chceš doletět příště a proč?“. Jmenuje teaserové místo nebo jeho bonus? Test 08: nejbližší místo proti celé mapě.
3. **Smysl voleb (01 N3, P8):** různí hráči kupují úrovně v různém pořadí a umějí říct proč. Když všichni kupují totéž, náhledy nefungují nebo jedna volba dominuje.
4. **Srozumitelnost čísel:** „Co udělal bonus, který sis naposledy koupil?“. Odpověď má obsahovat směr a přibližnou velikost.
5. **Nutkavost a FOMO:**
   - „Hrál/a jsi déle, než jsi chtěl/a?“ (02 §4.4),
   - „Měl/a jsi někdy pocit, že o něco přijdeš, když přestaneš?“,
   - signál z logu: rychlé otevírání a zavírání bez koupě, koupě bez otevření karty.
   - **Úspěch = víc dobrovolného pokračování bez nárůstu lítosti** (03 N1).
6. **Zastávky:** podíl sezení ukončených na kartě čtvrti nebo po souhrnu. To je legitimní konec (09 N2), ne selhání.
7. **Mobil:** mimo-klepnutí, přiblížení stránky (signál malého textu), dosažitelnost tlačítka koupě bez rolování.

**Dotazník:** miniPXI s Enjoyment, Curiosity, Clarity of Goals a Progress Feedback. Nevalidovaný pracovní překlad (09).

---

## 9. Otázky pro uživatele (max. 5)

1. **Atlas jako panel ve hře, nebo samostatná stránka?** Doporučuji panel: klepneš na „Atlas“ ve výsledku a otevře se přes hru bez načítání, `bonus.html` jen přesměruje. Samostatná stránka by se pokaždé načítala znovu, i se 3D městem.
2. **Má hráč vidět bonus nejbližšího místa předem?** Například u teaseru „Gardens at the Edge · 86 m · **Pinwheel**: spin the wind before you throw“, nebo jen „???“ jako překvapení? Doporučuji předem jméno a jednu větu, bez čísel. Dává to důvod doletět.
3. **Hlášky postav a vtipy o dopadu k přečtení v Atlasu:** je to v pořádku, nebo už to je „sbírka“, kterou nechceš? Doporučuji ukazovat jen ty, které zazněly, bez počtu „2/3“.
4. **Tečka na tlačítku Atlas:** jen při nové věci (nové místo, nový speciál), nebo i když si můžeš něco koupit? Doporučuji jen novinky. Tečka „můžeš koupit“ by svítila skoro pořád a tlačila by.
5. **Kam patří automatika QTE** (rozhodnutí 14. 10.)? Jako karta v Atlasu (např. „Autopilot“ u čtvrti, kde se událost objeví), nebo jako přepínač v Dílně? Doporučuji Atlas, protože strom bonusů je Atlas, a stejně Night Route jako uzel u Rooftop Harbor.

---

### Kritické soubory pro implementaci
- `C:\Users\micha\chatVlastovky\Just Throw it\src\ui.js` (háčky: tlačítko, otevřít/zavřít, novinky po `finish()`, přeskočení renderu)
- `C:\Users\micha\chatVlastovky\Just Throw it\src\storage.js` (+ `fresh()` v `C:\Users\micha\chatVlastovky\Just Throw it\src\core.js`: save v4 a migrace)
- `C:\Users\micha\chatVlastovky\Just Throw it\index.html` a `C:\Users\micha\chatVlastovky\Just Throw it\bonus.html` (dialog `#atlas`, přesměrování)
- `C:\Users\micha\chatVlastovky\Just Throw it\simulation\progression\params.mjs` (zdroj ID a čísel, vlastní ho F5, jen číst)
- `C:\Users\micha\chatVlastovky\Just Throw it\src\scenes.js` (ROUTE, hranice míst, `SCREEN_METERS`, příběhy k překladu)

Nové soubory k založení: `src/atlas-content.js`, `src/atlas.js`, `src/atlas-text.js`, `src/atlas-ui.js`, modul čísel, `tests/atlas.test.js`, `tests/atlas-text.test.js`, `prototype-atlas.html` + `prototype/atlas/`.