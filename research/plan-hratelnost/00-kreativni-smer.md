# Kreativní směr: proč tohle hrát 90 minut (kreativní ředitel)

**15. 10. 2026.** Odpověď na poznámky tvůrce z hraní (`research/playtest/2026-10-15-poznamky-tvurce.md`, výklad N1–N10 v `2026-10-15-vyhodnoceni.md`, rozhodnutí na konci `research/bonusy/06-rozhodnuti.md`). Souběžně píše game designer `01-game-design.md` (QTE podle rychlosti, role událostí, tok odemykání, revize obsahu), product designer `02-ux.md` a art director `03-art.md`. V době psaní ještě neexistovaly, tento dokument na ně nenavazuje a nic v nich nemění.

**Konvence:** návrh česky, herní texty EN / CS. Pracnost hrubě **malá / střední / velká**. Čísla, ceny a četnosti nechávám game designerovi a balance-analyst. Nic tady není změřené: **všechny odhady jsou NOT ASSESSED**.

---

## 0. Shrnutí na jednu stranu

**Diagnóza.** Tvůrce napsal: „Čekal bych, že si skoro každý hod něco otevřu, ne pořád dokola házet a sledovat to samé.“ Klíčové slovo je **sledovat**. Plán 05 počítá „okamžiky novinky“ a slibuje jeden každé ~3 hody. Většina z nich je ale **ohlášení**: řádek ve výsledku („Past the Grain Silo.“), razítko na křídle, jméno kousku, pasivní bonus „+X %“ nebo další položka fronty („Also new: Mailbag“). Simulace je započítá, hráč je přehlédne. Při letu, tedy ve chvíli, kdy hráč hru opravdu **sleduje**, se mění málo: stejné město, stejný holub, stejný poryv, jen o kus dál. **Hra potřebuje novinky, které jsou vidět ve vzduchu, ne v menu.**

**Hlavní lákadlo (doporučuji):**
> **Hodíš papírovou vlaštovku z podkroví a papírové město se před ní rozkládá jako vystřihovánka. Každý hod o kus dál, až ke slunci.**

**Tři nejsilnější směry (§5):**
1. **Vystřihovánkové město** (§2 S1): za hranicí rekordu leží město složené naplocho. Když nad ním vlaštovka poprvé proletí, budovy se před ní vztyčí. Každý rekord je doslova kus nového světa.
2. **Události s tváří a scény na jedno použití** (§3 U1–U3): poryv i pára mají ve městě viditelný zdroj, místní ptáci si hráče pamatují a každé místo má jednu jednorázovou scénu, kterou hráč ukáže kamarádovi (velryba v zálivu, průlet oknem, závod s vlakem).
3. **Dopad jako pointa** (§2 S3): po dopadu kamera na chvíli ukáže, kdo vlaštovku našel. Nejčastější okamžik hry tak dostane humor a kontext.

**Co bych škrtl nebo odložil (§4):** kousky jako systém (kromě Over the Line jako okamžiku ve vzduchu), razítka R1–R7, zastávky jako pouhé popisky (nahradit vztyčením dominanty), Předpověď trasy. Podpisové skiny nepočítat jako novinky.

**Volby pro uživatele:** 5× `BLOCKED` v §6.

---

## 1. Hlavní lákadlo hry

### 1.1 Doporučené
> **„Hodíš papírovou vlaštovku z podkroví a papírové město se před ní rozkládá jako vystřihovánka. Každý hod o kus dál, až ke slunci.“**
> (EN pro pitch: *Throw a paper plane from your attic and watch a paper city pop up beneath it, one throw further each time, all the way to the sun.*)

**Proč tohle 90 minut:** zvědavost je podle KB jediný prediktor dobrovolné doby hraní (P3, Kao 2024). Nejsilnější otázka hry je „co je za tím?“. Dnes na ni odpovídá Atlas v menu. Tady na ni odpovídá **svět přímo pod vlaštovkou**. Postup není číslo ani pohlednice, ale kus města, který před chvílí neexistoval. Sedí to k papíru (vystřihovánka, pop-up kniha), k dítěti (svět, který si samo „dodělává“) i k cestě za sluncem.

### 1.2 Alternativy

| | Lákadlo jednou větou | Proč by to hráč chtěl | Riziko |
|---|---|---|---|
| **B** | „Začneš se zmačkaným papírem, skončíš u papírového tryskáče, který přeletí město za dvacet sekund.“ | čistá radost z růstu, incremental fantazie (06: víc k incrementalu, čísla vidět) | bez světa je to tabulka; potřebuje A jako obraz |
| **C** | „Celé město sleduje jednu dětskou vlaštovku.“ | humor a vřelost: holubi, rybáři, kočky, noviny, všichni reagují | bez růstu je to sbírka vtipů, rychle se vyčerpá |
| **D** | „Každý hod je závod s tužkovým stínem tvého nejlepšího hodu.“ | dovednost a napětí v každém letu, srovnání jen se sebou (P13 v pořádku) | úzké, nese jen část hry |
| **E** *(šílený)* | „Vlaštovka je dopis slunci. Celé město ho pomáhá doručit.“ | emoce a smysl slova „Delivered.“ | blíží se zamítnutému příběhu (06, 13. 10.: příběh ne); jen jako beze slov pointa finále, viz BLOCKED 5 |

**Jak to skládám:** **A je to, co hráč vidí, B je motor, proč to roste, C je chuť.** Doporučuji A jako lákadlo a B a C jako jeho podporu. D je levný doplněk (§2 S2).

---

## 2. „Skoro každý hod něco přinese“: šest různých cest

Každá cesta odpovídá na otázku „co uvidím **v tomhle** hodu, co jsem ještě neviděl?“ jinak. Žádná není seznam úkolů ani grind (P13).

### S1 — Vystřihovánkové město / Pop-up City
- **Princip:** všechno za hranicí hráčova rekordu leží **složené naplocho** (budovy jako nevystřižené archy na zemi, v pastelu bez stínu). Když se vlaštovka poprvé přiblíží, budovy se **vztyčí** jako pop-up kniha (0,3–0,5 s, šustnutí papíru), vždy kus **před** vlaštovkou, aby to hráč viděl. Co se jednou vztyčilo, zůstane stát.
- **Okamžik:** „Hodíš, vlaštovka minulý rekord přeletí o 40 m a pod ní se jedna po druhé zvednou střechy tržnice, poslední s praporky. Hráč se usměje, protože tohle město ‚postavil‘ on.“
- **Proč by to hráč chtěl:** každý rekord je vidět ve světě, ne jen v číslech (P1: odměna podle výkonu). Ploché archy v dálce jsou zároveň zahlédnutí: „tam něco je, ještě to nestojí“ (P3).
- **Proč skoro každý hod:** v incremental ekonomice padá rekord často. Když nepadne, hráč aspoň vidí, kde vztyčené město končí, a to je pravdivá těsnost bez textu (P10).
- **Nejlevnější verze:** vztyčovat po **blocích** (~50 m), ne po budovách: jeden údaj v shaderu nebo měřítko Y celého bloku. Bez nových modelů, jen animace a zvuk. **Pracnost střední** (render3d, pozor na sloučenou geometrii a LOD). Dominanty míst (věž, maják, mlýn) se vztyčují samostatně a pomaleji. To je náhrada zastávek (§4).
- **Vazby:** bible kap. 1 (diorama, papírové karty) to přímo nese. **Okraje:** reduced motion = prolnutí místo vztyčení. Vztyčení nesmí přebít vlaštovku (bible S-6, P1): děje se dole a vpředu, bez záblesků.

### S2 — Tužkový stín / Pencil Ghost
- **Princip:** vedle vlaštovky letí **tužková skica** tvého nejlepšího hodu (průsvitná, grafitové čáry, bez výplně). Když ji předletíš, skica se zmačká a spadne. Když ne, doletí kus před tebe a zamává křídlem.
- **Okamžik:** „Poslední vteřiny letu, vlaštovka klesá, tužkový stín je o metr před ní. Hráč klepne na poryv, vlaštovka ho přeskočí a skica se zmačká do kuličky. Hráč nahlas řekne ‚ha!‘.“
- **Proč by to hráč chtěl:** každý let dostane malé drama a blízký cíl, který není úkol (P6). Srovnání jen se sebou (P13 v pořádku). Spojuje se se S1: tam, kde stín končí, začíná složené město.
- **Nejlevnější verze:** uložit ~2 vzorky za sekundu z nejlepšího letu (x, y), přehrát s interpolací. **Pracnost malá** (save potřebuje migraci a validaci podle pravidel `storage.js`). Varianta bez save: stín jen z minulého hodu.
- **Riziko:** s rychlejší výbavou stín rychle zastará; to je ale v pořádku, pocit „předletěl jsem se“ je odměna.

### S3 — Kdo ji našel / Who Found It
- **Princip:** dopad je nejčastější okamžik hry (jednou za hod). Dnes končí let a hned výsledek. Nově kamera na **~1 s** ukáže místo dopadu a **kdo vlaštovku našel**: pekařka, kočka, rybář, dítě na balkoně, strážník, kráva. Jedna suchá věta, každá jen jednou (navazuje na vtipy o dopadu z 08 §8.1, ty jsou dnes jen text).
- **Okamžik:** „Vlaštovka zapadne do zahrady za tržnicí. Kamera se zastaví u kocoura na plotě, ten ji opatrně dotkne tlapou. *‚The cat has claimed it. You may visit.‘* Hráč se zasměje a hned hází znovu, aby viděl, kdo bude příště.“
- **Proč by to hráč chtěl:** humor (suchý a laskavý, 06), konec letu není prázdný a každé místo má lidi. Hráč dostane důvod přistát **jinde**, ne jen dál.
- **Kolik:** 3–4 nálezci na místo × 16 = 50–60 vinět. Je to obsah, který se píše, ne programuje.
- **Nejlevnější verze:** jen text a malá ikonka nálezce na kartě výsledku (pracnost **malá**). Plná verze: papírová postavička `person` v póze u vlaštovky (**střední**, sdílí modely z katalogu). Při „Throw again“ se vineta dá přeskočit klepnutím.
- **Okraje:** nález se netýká mincí ani bonusů (P12). Neopakovat: po vyčerpání nálezců místa už jen dopad bez věty.

### S4 — Ranní noviny / Morning Paper
- **Princip:** dítě skládá vlaštovky z městských novin. Po významném hodu (rekord, nové místo, první scéna z §3) vyjde **titulek** o hráčově hodu, jako výstřižek na kartě výsledku nebo na nástěnce v podkroví: *„LOCAL PLANE REACHES MARKET. PIGEON UNIMPRESSED.“* / *„VLAŠTOVKA DOLETĚLA NA TRH. HOLUB NEOHROMEN.“*
- **Okamžik:** „Po prvním přeletu mostu se na stole v dílně objeví noviny s titulkem *‚GULLS DEMAND EXPLANATION‘*. Hráč si ho vyfotí.“
- **Proč by to hráč chtěl:** výkon pojmenovaný konkrétně a vtipně (P1, KB pochvala s informací). Vlaštovka z novin, které o ní píšou, je malá smyčka ze světa papíru.
- **Nejlevnější verze:** šablony titulků z dat letu (místo, událost, rekord), jen při novém rekordu nebo prvním čemkoli. **Pracnost malá** (texty EN/CS, i18n). Nástěnka v podkroví: výstřižky přibývají (art, malá).
- **Riziko:** šablony se okoukají. Proto jen u prvních věcí a nanejvýš ~25 titulků za hru.

### S5 — Dílna jako řemeslo / Real Paper-Plane Tricks
- **Princip:** vylepšení nejsou abstraktní „Power 3“, ale **skutečné triky, které děti s vlaštovkami dělají**, a jsou na vlaštovce vidět: kancelářská sponka na špičce, ohnuté zadní klapky, ostřejší přehyby přejeté nehtem, kousek lepicí pásky, delší špička. Koupě = 1,5 s u stolu v podkroví, kde dítě trik provede.
- **Okamžik:** „Koupíš Power 2. Dítě nasadí na špičku sponku, vlaštovka v ruce ji má i při míření. Při dalším hodu letí znatelně rovněji a hráč ví proč.“
- **Proč by to hráč chtěl:** nákup, který je **vidět** a dává smysl i dítěti (P7: hráč ví, co pomohlo). Sedí k tomu, že tvůrce chce na začátku Power, Paper a Folds (N4).
- **Nejlevnější verze:** 4–6 drobných dílů na modelu vlaštovky (sponka, páska, klapky), žádná animace u stolu. **Pracnost malá až střední.** Pozor na bibli: díly nesmí rozbít siluetu ani obrys (bible kap. 17, rozhodne art director).

### S6 — Rychlostní stupně / Speed Tiers *(nejodvážnější)*
- **Princip:** rychlost vlaštovky má **pojmenované stupně** a každý mění, jak let vypadá a jak na něj město reaguje: *Breeze → Swift → Paper Jet → Comet*. Na stupni Paper Jet za vlaštovkou vlají papírové proužky, na Comet za ní při průletu vlaje prádlo, lidem odlétají klobouky a holubi se rozprchnou. Poprvé dosažený stupeň = krátký titulek ve vzduchu.
- **Okamžik:** „V Zlatých polích poprvé dosáhneš stupně Comet. Za vlaštovkou se ohne celé obilné pole jako vlna. Hráč to chce zažít znovu.“
- **Proč by to hráč chtěl:** incremental radost z čísla, které roste (06: čísla vidět), převedená do obrazu. A přímo se pojí s N1: když QTE zesilují rychlost, rychlost se musí **cítit**.
- **Nejlevnější verze:** 4 prahy, změna stopy a zvuku, štítek poprvé. **Pracnost malá.** Reakce světa (klobouky, prádlo, obilí) jsou **střední**, stačí je přidat jen u pár typů objektů.
- **Riziko:** efekty nesmí zakrýt vlaštovku (P1, P2 optimum juice). Stupně musí plynout ze skutečné rychlosti, ne z nákupu (P1).

### Srovnání

| Směr | Co nového v hodu | Kolik hodů pokryje | Pracnost (nejlevnější) | Sedí k |
|---|---|---|---|---|
| S1 Vystřihovánkové město | kus světa | každý rekord | střední | papír, cesta, P3 |
| S2 Tužkový stín | drama letu | každý hod | malá | dovednost, P6 |
| S3 Kdo ji našel | vtip a lidé | každý hod (do vyčerpání) | malá | humor, místa |
| S4 Ranní noviny | pojmenovaný výkon | významné hody | malá | humor, P1 |
| S5 Dílna jako řemeslo | viditelná koupě | každá koupě | malá–střední | N4, P7 |
| S6 Rychlostní stupně | nový pocit z letu | ~4–6× za hru + reakce světa | malá | incremental, N1 |

---

## 3. Události, které nejsou „pořád to samé“

Role událostí (mince, dolet, rychlost) a jejich výskyt navrhuje game designer. Tady jde o to, aby události byly **zážitek**: měly původ, charakter a sem tam překvapily. Plán 05 VA1 (místní varianty) je správný směr, ale je příliš nesmělý: „jiný model a jedna změna v rytmu“ (např. střed holuba 0,95 s místo 0,8 s) hráč nepozná. Pozná, **kdo** to je a **proč** se to děje.

### U1 — Událost má zdroj ve městě
- **Princip:** žádný poryv „z ničeho“. Poryv je prádlo, které se utrhne ze šňůry, větrák pekárny, projíždějící tramvaj, komín parníku. Pára je konvice v okně, u které stojí babička a zamává. Termika stoupá z rozpálené střechy skleníku. Dron je papírový drak s reklamní stužkou, kterého někdo pouští ze střechy.
- **Okamžik:** „Varování poryvu: dole se ze šňůry utrhne prostěradlo a vznese se. Klepneš, vlaštovka ho chytne a vyletí nahoru. Prostěradlo se lehce vlní za ní.“
- **Proč:** událost je kousek života města, ne kruh na obrazovce. Hráč čte svět, aby věděl, co přijde (lepší než naučený časovač, P9).
- **Nejlevnější verze:** zdroj = jeden objekt v blízkosti události (prádlo, okno, komín) z katalogu čtvrti, zobrazený s varováním. **Pracnost střední** (art: 2–3 zdroje na čtvrť). Mechanika se nemění.

### U2 — Tvorové s pamětí / Locals Who Remember
- **Princip:** místní holub, racek, skřivan a papírový holub (VA1) mají **tři okamžiky za hru**: první setkání, ~10. setkání a ~25. setkání. Racek nejdřív vlaštovku nese a ryba mu přitom málem vypadne. Podesáté přivede kamaráda. Pak čeká na zábradlí majáku, když kolem proletíš, a zasalutuje křídlem.
- **Okamžik:** „Desátý racek. Místo jednoho přiletí dva, hádají se o rybu a nakonec tě nesou oba. *‚Gary brought Steve.‘*“
- **Proč:** stejné sloveso, ale vztah se vyvíjí. To je „stejné, ale jinak“ (KB 08 N6), které je opravdu poznat. Postavy a místní holubi jsou schválené (06: SV17, SV18).
- **Nejlevnější verze:** počítadlo setkání na variantu a jiná hláška nebo pár póz v okamžicích 1 / 10 / 25. **Pracnost malá až střední.** Pozor: počítadlo je skryté, nikde se neukazuje číslo (P13).

### U3 — Scény na jedno použití / Once-in-a-Game Moments
- **Princip:** každé místo má **jednu jedinečnou scénu**, která se stane **jednou za hru**, zaručeně každému hráči (podle polohy a výšky, ne podle náhody). Žádná odměna nebo jen malá, je to zážitek. Je to jádro „momentů, které hráč ukáže kamarádovi“.
- **Návrh 16 scén** (výběr, art a game designer doladí):

| Místo | Scéna (EN název) | Co se stane |
|---|---|---|
| 1 Dílna | *The Cat Watches* | kocour na střeše dílny otáčí hlavou za vlaštovkou a pak skočí za ní (dopadne zpět, nic se mu nestane) |
| 2 Trh | *Bunting Snap* | vlaštovka přetrhne šňůru praporků a ty ji kus cesty vlají jako ocas |
| 3 Zahrady | *Sprinkler Rainbow* | průlet zalévací clonou, za vlaštovkou na 2 s duha |
| 4 Železnice | *Race the Train* | vlak se rozjede pod vlaštovkou, strojvůdce zatroubí a chvíli jedou spolu |
| 6 Jeřáby | *Crane Handshake* | jeřábnice Marge pootočí ramenem, vlaštovka sklouzne po laně |
| 7 Most | *The Whale* | v zálivu se vynoří papírová velryba a vystříkne, gejzír vlaštovku vynese (**wow**) |
| 8 Maják | *Gone Fishing* | rybář na konci mola nahodí prut, vlasec proletí těsně pod vlaštovkou a rybář se omluvně smekne (světlo majáku ne: svítí se jen v D4, 06) |
| 9 Pole | *Field Wave* | obilí se vlní pod vlaštovkou jako moře |
| 10 Větrníky | *Windmill Loop* | lopatky mlýna vlaštovku jemně „přehodí“ přes vrchol |
| 12 Observatoř | *Stella's Telescope* | dalekohled se natočí, Stella zamává, na kartě výsledku je „fotka“ z dalekohledu |
| 13 Brány | *Through the Window* | vlaštovka proletí otevřeným oknem domu skrz pokoj, rodina u snídaně zvedne hlavy, ven druhým oknem (**wow**) |
| 15 Hodinová věž | *Clock Strikes* | věž odbije přesně při průletu, ze zvonice vyletí hejno |
| 16 Střešní přístav | *Lantern Trail* | lampiony se rozsvěcují jeden po druhém podél tvé dráhy |
| ostatní | | rezerva pro art directora |

- **Okamžik:** „Přelétáš most a z vody vyjede papírová velryba. Než pochopíš, co se děje, gejzír vlaštovku vynese o dvacet metrů výš. Hráč zastaví hru, aby to ukázal kamarádovi.“
- **Proč:** jedinečnost je to, co se pamatuje a sdílí. Deterministické umístění = férové (P13: žádná náhoda za odměnu) a game designer s nimi může počítat jako s **novinkou ve vzduchu**, kterou zažije každý.
- **Nejlevnější verze:** 6 scén místo 16, každá z existujících modelů plus jedna animace (praporky, duha, kocour, vlak, lampiony, hejno). **Pracnost střední** (každá scéna malá, ale je jich hodně). Velryba a okno jsou **velké**, stojí za to.
- **Pozor:** scéna, která mění dolet (velryba, mlýn), musí být malá a jednorázová, aby nerozbila balanc. Rozhodne game designer.

### U4 — Neúspěch je vtip, ne trest
- **Princip:** minuté QTE a nízký let mají komickou, čitelnou odezvu ve světě: holub odletí i s bagetou a ještě se ohlédne, vlaštovka u země ťukne do komína a trochu se zmuchlá. Navazuje na N1: když QTE pomalou vlaštovku u země nezachrání, má to být **legrační**, ne frustrující.
- **Okamžik:** „Vlaštovka je pomalá, metr nad zemí. Klepneš na poryv, ale nic. Vlaštovka zavadí o anténu, otočí se a dopadne do misky s nudlemi. *‚The noodles were fine.‘*“
- **Nejlevnější verze:** texty z 08 §8.1 a §7.2 převzít do 3D jako krátké animace tvorů. **Pracnost malá až střední.**

### U5 — Rychlost mění město (pokračování S6)
- **Princip:** čím rychleji letíš, tím víc město reaguje: klobouky, prádlo, holubi na náměstí, hladina zálivu. Žádná nová událost, jen svět, který „cítí“ tvou rychlost.
- **Proč:** v pozdní hře letí vlaštovka 5 km za desítky sekund (06, 13. 10.). Bez reakce světa je to jen rychlejší posun kulis.

### Momenty, které hráč ukáže kamarádovi
1. Velryba v zálivu, která tě vystřelí nahoru.
2. Průlet oknem skrz pokoj s rodinou u snídaně.
3. Závod s vlakem, který na tebe zatroubí.
4. První stupeň Comet: obilné pole se za tebou vlní jako moře.
5. Město, které se pod tebou poprvé vztyčí z plochých archů.
6. Racek, který přivedl kamaráda.
7. Finále: všechna vztyčená místa se rozsvítí a tužkový stín naposledy zamává (s BLOCKED 5).

---

## 4. Kritika současného obsahu (`research/obsah/01–05`)

Upřímně: dokumenty jsou poctivé a správně hlídají etiku a balanc. Problém není v tom, že by byly špatně, ale v tom, **co měří**. Počítají ohlášení a položky. Hráč počítá, co uvidí a co ho překvapí. Následující hodnocení je z pohledu „bude to hráče bavit?“, ne „je to správně navržené?“.

### 4.1 Silné (ponechat a posílit)
| Prvek | Proč je silný | Co posílit |
|---|---|---|
| **Atlas jako trasa 16 míst** | blízký cíl uvnitř velké cesty (P6), jasná osa hry | ať je ve světě (S1), ne jen v menu |
| **Podkrovní dílna a nástěnka pohlednic** | domov, který se mění s cestou, je silný a vřelý | přidat výstřižky novin (S4), sponky a klapky na stole (S5) |
| **Polička suvenýrů (C1)** | levná a dojemná | povýšit z „rozšíření“ na jádro |
| **Postavy čtvrtí a jejich hlášky** | tón je výborný (*„Statistically, you're a comet. Emotionally, you're a sheet of A4.“*) | dát jim místo ve světě (Marge v jeřábu, Stella u dalekohledu), ne jen text ve výsledku |
| **Vtipy o dopadu (08 §8.1)** | nejčastější okamžik hry dostane pointu | převést do 3D (S3) |
| **Hejno (EV1)** | první událost s rytmem ze tří kroků | ponechat |
| **Prachový vír (EV2)** | jediná událost s volbou uvnitř | ponechat, nešetřit ho na „Harvest Gust“ |
| **Lampiony (EV4)** | nejkrásnější obraz D4 | povýšit na jádro (spolu s *Lantern Trail*) |
| **Zahlédnutí (CU4)** | levná zvědavost (P3) | povýšit na jádro, spojit se složeným městem (S1) |
| **Over the Line** | jediný kousek s dramatem ve vzduchu (poslední sekunda, hranice) | udělat z něj okamžik letu se zpomalením, ne jméno ve výsledku |
| **Finále „Delivered.“, rozsvícení 16 míst** | silný konec | dát slovu „Delivered“ adresáta (BLOCKED 5) |
| **5 nových vlaštovek** | nová silueta je vidět | každá potřebuje **viditelný podpis za letu** (Skimmer skáče po střechách, Kite má vlající ocas, Needle nechává rychlostní čáry), jinak je to „+4 %“ v jiném tvaru |

### 4.2 Výplň nebo nuda (předělat nebo škrtnout)
| Prvek | Proč to nebaví | Co s tím |
|---|---|---|
| **Zastávky v půlce místa (ZB1 lite)** | „Past the Grain Silo.“ je popisek. Simulace ho počítá jako novinku, hráč ho přehlédne. 12 z ~62 „okamžiků novinky“ v plánu 05 jsou tyhle popisky. | **nahradit vztyčením dominanty** v S1 (silo se zvedne před vlaštovkou jako první). Stejné místo v ose, ale je to obraz. |
| **Kousky (TL0, 8 + 5)** | Jméno na kartě výsledku po letu není dopamin. Game designer sám píše, že „kombinace“ jsou jen pořadí z rozvrhu a hráč má čtyři páky (05 §4.6.3). Na ověření už padly dny simulací a další jsou v plánu. Je to **správné, ne zábavné**. | **odložit celý systém** po playtestu; Over the Line ponechat jako okamžik ve vzduchu (BLOCKED 3) |
| **Razítka R1–R7** | nálepka na křídle vlaštovky, která má v letu pár desítek pixelů. Odemyká se tiše řádkem ve výsledku. Hráč nepostrádá. | **škrtnout**. Památku na první perfekt převezme U2 (tvorové si tě pamatují). |
| **Podpisové skiny K6–K10 jako novinky** | potisk ≤ 30 % plochy, za letu skoro neviditelný | ponechat jako drobnost, ale **nepočítat** do novinek. Podpis modelu má být v letu (viz 4.1). |
| **Fronta novinek (FN1) jako zdroj novinek** | rozložit kartu čtvrti do pěti hodů je dobré instalatérství, ale „Also new: Mailbag I“ není zážitek. Dělá z jednoho okamžiku pět slabších. | ponechat jako techniku, ale **nepočítat** rozložená ohlášení jako novinky |
| **Pasivní bonusy Atlasu** (Crowd Chain, Momentum, Echo, Gull Escort, On Air) | 08 §4.1 slibuje „viditelný projev ve scéně“, ale v kartách je hlavně číslo | každý potřebuje **jeden viditelný projev** (Gull Escort: racci letí vedle; Echo: tužková ozvěna události; Momentum: proužky papíru za vlaštovkou). Bez něj škrtnout. |
| **Varianty událostí (VA1) v dnešní podobě** | „jiný model + jedna změna v rytmu“ (0,95 s místo 0,8 s) hráč nerozliší | změnu rytmu nechat, ale přidat původ (U1) a paměť (U2) |
| **Předpověď trasy (BN2)** | meta pro optimalizátory, v 90min hře bez druhého kola málo užitku | **odložit** |
| **Mailbag** | čisté číslo | jako nákup v pořádku (incremental), ale nepočítat jako novinku. Bylo by hezké, kdyby byl vidět (brašna u dítěte se plní). |

### 4.3 Co chybí úplně
- **Novinka ve vzduchu** jako metrika. Plán 05 měří „hody bez ohlášené novinky“. Navrhuji game designerovi doplnit **„hody, ve kterých hráč za letu uvidí něco poprvé“** (vztyčení, scéna, nový tvor, stupeň rychlosti). Jen to odpovídá na „sledovat furt to samé“.
- **Obraz rychlosti.** N1 dělá z rychlosti hlavní veličinu letu, ale hra ji ukazuje jen číslem a šířkou kamery (S6, U5).
- **Humor ve světě.** Všechen humor je dnes text ve výsledku. Ve 3D chybí jediný vtip, který by šel vidět (S3, U4).

---

## 5. Doporučení: 2–3 nejsilnější směry

### 5.1 Pořadí
1. **Vystřihovánkové město (S1)** spolu se zahlédnutím (CU4) a vztyčením dominant místo zastávek. Je to lákadlo hry a odpověď na „každý hod něco otevřu“ přímo ve světě. Nahrazuje 12 zastávek a dává novinku při každém rekordu.
2. **Události s tváří (U1, U2) a scény na jedno použití (U3)**, začít šesti levnými scénami a velrybou. Odpověď na „pořád to samé“ a zdroj momentů ke sdílení.
3. **Kdo ji našel (S3)**, nejdřív jako text a ikonka, pak 3D. Nejlevnější cesta, jak dát humor každému hodu.

**Levné doplňky, pokud zbude kapacita:** Tužkový stín (S2), Rychlostní stupně (S6, hodí se k N1), Dílna jako řemeslo (S5, hodí se k N4). Ranní noviny (S4) jen jako rozšíření.

**Proč ne víc:** tři směry pokryjí tři chvíle každého hodu: **let** (vztyčení, scény), **událost** (tvář, paměť) a **dopad** (nálezce). Víc by se tříštilo.

### 5.2 Předávka pro game designera (co dotáhnout)
1. **Vztyčení jako novinka v ose 90 min:** kolik metrů nového města průměrný hráč za hod vztyčí v D1–D4 a kde budou hody bez rekordu (tam pomůže S3 nebo U3). Dominanty místo zastávek: 12 nebo 16 (i D1?).
2. **Metrika „poprvé ve vzduchu“** (§4.3) vedle sucha bez novinky. Rozdělit novinky na *ve vzduchu* / *na kartě* / *v menu*.
3. **Scény U3:** umístění (místo, výška, rychlost), jestli mění dolet (velryba, mlýn, vlak) a o kolik nejvýš, aby nerozbily balanc. Deterministicky, jednou za hru, ve vztahu k rozvrhu QTE (scéna nesmí kolidovat s událostí).
4. **Paměť tvorů U2:** prahy setkání (1 / ~10 / ~25) podle toho, kolik variant hráč reálně potká.
5. **Pojit role událostí se zdroji (U1):** když je holub „na mince“ a poryv „na dolet“, zdroj ve městě to má prozradit (pekárna = mince?, tramvaj = rychlost?).
6. **N1 a obraz rychlosti:** pokud QTE zesilují rychlost, navrhnout prahy stupňů S6 a jak je hráč pozná.
7. **Kousky:** podle BLOCKED 3. Over the Line převést na okamžik ve vzduchu.
8. **Revize 01 a 05:** škrty z §4.2 promítnout podle rozhodnutí uživatele.

### 5.3 Předávka pro art directora (co nakreslit)
1. **Složené město a vztyčení:** jak vypadá blok před vztyčením (ploché archy, pastel bez stínu, nebo tužková skica na bílém papíře), animace pop-up (pant u země, 0,3–0,5 s, lehký překmit), zvuk šustnutí. Kontrola, že vztyčení nepřebije vlaštovku (S-6, P1).
2. **Zdroje událostí (U1):** 2–3 na čtvrť (šňůra s prádlem, větrák pekárny, konvice v okně s babičkou, komín parníku, rozpálená střecha skleníku, papírový drak).
3. **Tvorové a jejich pózy (U2):** racek s rybou, dva racci, salutující racek; holub s bagetou, který se ohlíží.
4. **Scény U3:** prvních 6 levných (praporky, duha, kocour, vlak, hejno ze zvonice, lampiony) a dvě velké (papírová velryba, průlet oknem s pokojem v řezu, navazuje na řez podkroví).
5. **Nálezci (S3):** sada papírových postaviček v pózách (pekařka, rybář, kocour, dítě na balkoně, kráva) z modelu `person` a katalogu.
6. **Volitelně:** tužkový stín (S2) a viditelné triky na vlaštovce (S5: sponka, páska, klapky) proti siluetě a obrysu z bible kap. 17.

---

## 6. Volby pro uživatele

BLOCKED 1: **Co je hlavní lákadlo hry?** Podle toho se rozhoduje, co se staví nejdřív. (a) **„Město se pod vlaštovkou rozkládá“**: každý rekord vztyčí kus papírového města (příklad: přeletíš rekord a pod tebou se zvednou střechy tržnice); (b) „z papíru tryskáč“: radost z rychlosti a čísel, svět je kulisa; (c) „celé město sleduje tvou vlaštovku“: humor a lidé, kteří reagují; (d) „závod se svým stínem“: dovednost v každém hodu. **Doporučení: (a)**, s (b) a (c) jako podporou. Jen (a) ukazuje postup přímo ve světě, a právě to v poznámkách chybělo.

BLOCKED 2: **Vystřihovánkové město: jak moc?** (a) **všechno za rekordem leží naplocho a vztyčí se, když nad tím poprvé proletíš** (příklad: z dílny vidíš v dálce ploché archy, po rekordu stojí); (b) vztyčí se jen dominanta nového místa (maják, mlýn), ostatní město stojí jako dnes; (c) nic, město je celé vidět od začátku. **Doporučení: (a)**, v nejlevnější verzi po blocích ~50 m. (b) je levnější, ale novinka by byla jen u míst, ne u každého rekordu. Výkon 3D ověří game-dev.

BLOCKED 3: **Kousky (pojmenované kombinace) ještě stavět?** Schválené 14. 10. v odlehčené verzi, ale po poznámkách z hraní vidím nový důvod: jméno na kartě po letu nepřinese pocit „něco jsem otevřel“ a ověření stojí dny simulací. (a) **odložit celý systém po playtestu, Over the Line udělat jako okamžik ve vzduchu** (příklad: poslední sekunda, zpomalení, vlaštovka přepadne přes čáru místa, nápis OVER THE LINE); (b) stavět podle plánu 05 po ověření; (c) zrušit úplně. **Doporučení: (a).** Ušetřený čas jde do scén U3, které hráč uvidí určitě.

BLOCKED 4: **Škrtnout drobnosti, které hráč nevidí?** Razítka na křídle (R1–R7), zastávky jako pouhé popisky („Past the Grain Silo.“) a Předpověď trasy. (a) **razítka škrtnout, zastávky nahradit vztyčením dominanty, Předpověď odložit**; (b) nechat vše podle plánu 05; (c) škrtnout jen razítka. **Doporučení: (a).** Ušetří práci a nic z toho hráč nepostrádá, protože místo toho dostane věci, které uvidí.

BLOCKED 5: **Komu se vlaštovka na konci „doručí“?** Finále dnes říká „Delivered.“, ale komu, to hra neříká. Příběh v textech byl zamítnut (06, 13. 10.), proto jen beze slov. (a) **jinému dítěti na druhém konci města**: jeho cizí vlaštovka s tebou občas závodí (gag z 08 §8.3, třikrát za hru) a na střeše Střešního přístavu tvou vlaštovku chytí a pošle zpátky svou (příklad: finále, dítě na střeše zamává a hodí ti vlaštovku, ta přistane v podkroví na stole); (b) slunci: vlaštovka zmizí ve světle a nástěnka v podkroví se rozzáří; (c) nikomu, zůstane nápis „Delivered.“ jako dnes. **Doporučení: (a).** Je to beze slov, stojí na jednom gagu, který už v plánu je, a dává 90 minutám pointu, kterou si hráč zapamatuje.

---

## 7. NOT ASSESSED
- Jestli složené město a vztyčení unese výkon 3D na telefonu (iPhone 15 Pro) a jak se snese se sloučenou geometrií a LOD.
- Jak často průměrný hráč v nové ekonomice překoná rekord (na tom stojí S1).
- Jestli scény U3 a nálezci S3 hráče baví i napodruhé (jen playtest; otázka do playtestu: „Pamatuješ si něco, co se ve hře stalo jen jednou? Ukázal bys to někomu?“).
- Souběžné návrhy `01-game-design.md`, `02-ux.md`, `03-art.md` jsem nečetl (v době psaní neexistovaly). Možné kolize: S5 s návrhem Dílny, S6 s N1, S3 s kartou výsledku a „Throw again“.
