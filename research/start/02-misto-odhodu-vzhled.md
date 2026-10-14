# Místo odhodu: vzhled, měřítko a záběry (art director)

> **Schváleno 14. 10. 2026** (`research/bonusy/06-rozhodnuti.md`, „Začátek hodu, místo odhodu a kamera“ body 1–7): koncept 2 Podkrovní dílna v řezu, polodetail 16 m, pás výhledu (a), barvy dítěte a zábradlí (a), vše podle doporučení. **Závazné znění je v bibli** `research/design/05-styl-papir.md` (kap. 3.1 M-1–M-4, kap. 9 S-1–S-7, kap. 16.1 rozpory) a v katalogu `research/design/11-katalog-ctvrt1.md` (skupina G2b, karty H1–H6, rozpočet místa 1). Tento dokument zůstává jako zdůvodnění a náčrty; koncepty 1 a 3 jsou zamítnuté. Napsal art-director 14. 10. 2026. Navazuje na bibli Papírového města `research/design/05-styl-papir.md` (dál jen „bible“), stíny `08`, přechody `09`, katalog `10` a `11` a menu `07-menu.md`. Souběžně píše game designer `research/start/01-zacatek-a-kamera.md` (dál „01“), kde je mechanika, sekvence startu a kamera podle rychlosti. Tady je jen vzhled: odkud se hází, co je kolem dítěte, měřítko a kompozice záběrů.
>
> **Ověření:** náčrty jsou spočítané v Node se skutečnou kamerou hry (`pose.project`, `geometry.follow` + `sideCamera`, fov 20°) a se skutečným rozložením místa 0–1 (`cityChunk`). Jde o kompozici a měřítko, ne o render: chybí stíny, vlákna, život a pohyb. Prohlížeč jsem nepoužil (okno sdílí uživatel), proto je **vzhled ve hře NOT ASSESSED**. Totéž platí pro kontrasty v pixelech a pro výkon.

**Obrázky** (`research/design/img/start/`, vznikají příkazem `node research/design/img/start/start.mjs`):

| Soubor | Co ukazuje |
|---|---|
| `dnes.png` | dnešní Dílna v klidovém záběru (šířka 244 m), výřez s měřítkem dítěte proti člověku a záběr letu |
| `koncept-1-terasa.png`, `koncept-2-podkrovi.png`, `koncept-3-vyhlidka.png` | každý koncept v 6 záběrech: zblízka při míření, oddálení po výhozu (let, šířka 120 m) a hlavní menu, vždy 16 : 9 a na výšku telefonu (375 × 667) |
| `zaber.png` | jak široký má být záběr při míření: 8 m, 16 m (doporučuji) a 55 m (návrh z 01) |
| `vyhled.png` | co je za dítětem při míření, když střed místa 1 zůstane jako dnes, a když se u startu sníží |

---

## 0. Shrnutí

1. **Dnešní začátek nemá jedno měřítko.** Dítě je 11,75 m vysoké (stejně jako dům Dílny), dveře 4,2 × 6 m, přístavek je 7,25 m vysoký jen kvůli tomu, aby ruka byla ve 16 m. Kamera je při míření **dvakrát širší** (244 m) než za letu (120 m), takže dítě i vlaštovka jsou drobné (na telefonu má vlaštovka 10 px). Uživatel chce opak.
2. **Návrh měřítka:** svět, Dílna i dítě mají skutečné míry (dítě 1,2 m, dveře 1,1 × 2,2 m). **Jedinou výjimkou zůstává vlaštovka.** V ruce má 0,5 m (velká hračka), během oddálení plynule roste na dnešních 7,75 m. Na obrazovce to nejde poznat, protože kamera se oddaluje rychleji, než vlaštovka roste. Vlaštovka je podle bible P1 jediná *nakreslená* věc, takže se její velikost smí řídit obrazovkou a ne světem.
3. **Tři koncepty místa odhodu:** 1 Terasa na střeše, **2 Podkrovní dílna v řezu (doporučuji)**, 3 Vyhlídka na kopci. Koncept 2 je „domeček pro panenky“: podkroví Dílny nemá přední stěnu, takže hráč vidí dovnitř (stůl, police s papíry, nástěnka s pohlednicemi). Dítě stojí na pavlači u půdních dveří, nad ním je trám s kladkou. Tím splňuje i herní návrh z 01 (balkon podkroví, hák jeřábu Crane Lift, menu v pokoji) a menu nepotřebuje druhou kameru uvnitř pokoje.
4. **Záběr při míření je polodetail 16 m** (na výšku telefonu 7 m), kamera mírně zespodu (sklon −8°), aby za dítětem bylo nebe a slunce. Dítě má 96 px (telefon 64 px), vlaštovka v ruce 40 px (telefon 27 px). Šířka 55 m z 01 by dítě zmenšila na 28 px (telefon ~9 px), viz `zaber.png` a BLOCKED 2.
5. **Pás výhledu:** za dítětem dnes stojí domy středu místa 1 vysoké až 38 m a zakrývají slunce (`vyhled.png`). Navrhuji je do 150 m od startu snížit na ≤ 13 m. Hráč se pak při míření dívá přes střechy (čtvrť se jmenuje Střechy za úsvitu) a míří ke slunci (P3).

---

## 1. Čím se dnešní začátek nelíbí

Obrázek: `dnes.png`. Čísla jsou z kódu (`workshop.js`, `models/workshop.js`, `pose.js`, `geometry.js cityChunk(0)`).

| # | Problém | Dnes | Proč to vadí |
|---|---|---|---|
| D1 | **Dítě je obr** | 47 px 2D postavičky × `S = 0,25 m` = **11,75 m**; člověk na ulici má 1,7 m (11 karta 7) | dítě je 7× větší než dospělí kolem a stejně vysoké jako dům. V diorámatu z papíru (P2) to vypadá jako chyba, ne jako stylizace. |
| D2 | **Dílna má dvě měřítka** | dům 24 × 12 m s okny podle světa, ale dveře P3 4,2 × 6 m, okno dílny 11,4 × 4,8 m, přístavek 7,25 m vysoký | dveře musely narůst k obřímu dítěti (K4 BLOCKED). Okno a dveře pak vedle řadových domů s okny 1,2 × 1,4 m působí jako jiná stavebnice. |
| D3 | **Kamera je při míření nejdál** | `REST.width` 243,8 m, za letu 120 m | při výhozu se kamera přibližuje, ne oddaluje. Dítě a vlaštovka zabírají zlomek obrazu (bible kap. 9: vlaštovka na telefonu 10 px). |
| D4 | **Nic neříká „odtud se hází“** | dítě stojí na plochém tyrkysovém kvádru vedle domu, v levém dolním rohu | hod je jediný okamžik plné kontroly hráče (01 §1.1 a). Místo nemá hranu, výšku ani výhled. Kompozici nese panorama, ne hráč. |
| D5 | **Čitelnost u ruky** | zábradlí, rám okna a provázky jsou grafitové `#2a2622`, čepice dítěte čistě bílá `#ffffff` | bible kap. 6 bod 2: v pásu letu nesmí být nic „bílé + grafit“ kromě vlaštovky. Zblízka by to bylo vedle vlaštovky. |
| D6 | **Hořčicová pláštěnka** | `PAPIR.workshop.shirt #e2a43a` | hořčicová je podle bible jen hodnota (mince). U praporků už rozhodnuto nahradit `#f2b65a` (06, katalog čtvrti 1 bod 3). |
| D7 | **Ruka a fyzika nesedí** | ruka ve 16 m, fyzika vyhazuje z 12 m (zjištění 01) | dnes to skrývá posun kamery při výhozu. Nové místo se staví tak, aby ruka byla ve **12 m** (všechny náčrty). |

---

## 2. Jedno měřítko světa

Pravidla (návrh doplnění do bible kap. 3 a 11 kap. 1.1):

- **M-1 Svět, Dílna i dítě mají skutečné míry** podle 11 kap. 1.1: patro 3 m, přízemí 3,5 m, okno 1,2 × 1,4 m, dveře 1,1 × 2,2 m, člověk 1,7 m, **dítě 1,2 m** (model `person` × 0,7). Výjimky „dílenské okno 11 m“ a „dveře P3“ končí. **P2.**
- **M-2 Vlaštovka je jediná výjimka a její velikost se řídí obrazovkou.** V ruce má **0,5 m** (A4 šipka má ~0,3 m, tohle je „velká hračka“ ×1,5). Při oddálení roste podle šířky záběru `W`: `L(W) = 0,5 · (W / 16)^1,36`, tedy 0,5 m při 16 m a 7,75 m při 120 m (dnešní `PLANE_SCALE`). Nad šířkou letu platí pravidlo z 01 §3.7 (na telefonu vždy ≥ 24 px). Na obrazovce vlaštovka během oddálení roste ze 40 na 83 px (1280 px šířky), takže „nabírá sílu“, a nikdy není vedle dítěte velká, protože je v tu chvíli metry daleko. Fyzika a QTE se nemění (vlaštovka je pro fyziku bod, kruh QTE je v UI vrstvě). **P1.**
- **M-3 Ruka dítěte je ve výšce výhozu fyziky** (dnes 12 m, 01 §1.5). Podlaha pod dítětem je tedy 10,6 m (ruka 1,4 m nad chodidly při nápřahu). Kdyby uživatel zvolil vyšší místo, koncepty se jen zvednou o patro, kompozice se nemění.
- **M-4 Hrdina zblízka má víc detailu.** V polodetailu je 80 px na metr (desktop) a 54 px/m (telefon na výšku), tedy 12× víc než ulice za letu (6,9 px/m, 11 kap. 1.2). Pro dioráma startu proto platí **LOD H** (hrdina): nejmenší detail 0,03 m (rám okna, klika, tužky na stole, řez papíru na hraně střechy). Domy ulice do ~150 m od startu jsou v záběru zblízka asi 6× zvětšené (42 px/m), takže tam patří plný LOD 0 včetně rámů a parapetů (`windowCut`).

**Velikosti v záběrech** (spočteno z kamery hry, desktop 1280 × 720 přes celé okno podle 07-menu §12, telefon 375 × 667):

| Záběr | Šířka záběru | Dítě 1,2 m | Vlaštovka | Poznámka |
|---|---|---|---|---|
| Dnes, klid | 244 m | 62 px / telefon ~18 px | 41 px / telefon 10 px (bible) | dítě 11,75 m |
| **Míření (polodetail)** | **16 m**, telefon na výšku **7 m** | **96 px / 64 px** | **40 px / 27 px** (0,5 m) | sklon −8°, ruka na (0,38; 0,60) obrazu, na výšku (0,40; 0,62) |
| Detail (varianta) | 8 m / 3,4 m | 190 px / 130 px | 56 px / 39 px (0,35 m) | intimní, ale málo prostoru pro mířidla |
| W_aim z 01 | 55 m / 45 m | 28 px / ~10 px | 180 px (7,75 m) | dítě nečitelné, nebo zase obr |
| Let | 120 m / 70 m (náčrt) | – | 83 px / 41 px | dnešní kamera letu |
| Menu | 25–43 m (výška 14–24 m) | 36–62 px | v letu po křivce | koncept 2: šířka 28 m, dítě 54 px |

---

## 3. Společná pravidla místa odhodu (platí pro každý koncept)

**Kompozice ve třech záběrech, jedna scéna.** Místo odhodu je malé dioráma, které hráč vidí ve třech vzdálenostech. Kamera mezi nimi jen jede, nikdy nestřihá (kromě „Throw again“ a reduced motion, 01 §2.3 a §3.8).

| Záběr | Co je v obraze | Pravidla |
|---|---|---|
| **Menu** (ustavující) | celý domek / místo, dítě, slunce, kus města; UI na desktopu vlevo (sloupec 27 % šířky), na telefonu dole (~40 % výšky) | dítě a dílna v **pravých dvou třetinách** (desktop) nebo v pásu 25–60 % výšky (telefon), nikdy pod tlačítky. Vlaštovka krouží po křivce (07-menu §6). Sklon kamery +2°. |
| **Míření** (polodetail) | dítě od kolen nahoru, vlaštovka v ruce, hrana (zábradlí), kus Dílny vlevo, nebe a slunce vpravo nahoře, střechy dole | **za vlaštovkou je vždy nebe** (P1: obrys grafit × nebe 6,7–12 : 1, bible kap. 2.4, změřeno z hex). Mířidla směřují ke slunci (P3 „za sluncem“). Kamera mírně zespodu (−8°), aby se dítě nekreslilo proti fasádám. HUD v rozích (07-menu §2.2) nezakrývá dítě ani oblouk mířidel. |
| **Oddálení** (po výhozu) | místo odhodu zmizí vlevo, otevře se ulice, vlaštovka drží místo v obraze | sklon se během oddálení vrací z −8° na +6°; vlaštovka roste podle M-2; stopa začíná přesně v ruce. Délky a křivka jsou v 01 §2 a §3. |

**Další pravidla:**
- **S-1 Pás výhledu.** Do ~150 m za startem nesmí střed (vrstva −110 m) přesahovat výšku ruky + 1 m (dnes 18–38 m, návrh ≤ 13 m) a ulice do ~60 m před dítětem výšku ruky − 1 m (≤ 11 m). Dál výšky plynule rostou k dnešním. Bez toho je za dítětem zeď domů (`vyhled.png`). Mění to rozložení místa 1 (`districts/suburbs-layout.js` / `cityChunk(0)`), ne fyziku. **P3, P1.**
- **S-2 Hrana.** Dítě stojí u viditelné hrany (zábradlí, okraj pavlače, okraj vyhlídky). Hrana je tmavomodrá `#3d4f7a` (barva oken a litiny), nikdy grafit. **P1.**
- **S-3 Dítě není bílé ani hořčicové:** pláštěnka `#f2b65a`, čepice skládaná z kraftového papíru `#c9a57c` s rajčatovým proužkem, nohy `#3d4f7a`, bez obrysu. Vlaštovka je vedle něj jediná bílá věc s grafitem. **P1, „hořčicová jen hodnota“.**
- **S-4 Domov je jediné teplé světlo ve dne** (bible kap. 9): teplé sklo `#ffe2a8` jen na Dílně. Dílna zůstává krémová s rajčatovou střechou, aby ji hráč poznal i v novém tvaru.
- **S-5 Ráno vždy.** Místo odhodu je za úsvitu ve všech fázích hry (P3: cesta za sluncem začíná doma). Postup hry se ukazuje věcmi v diorámatu (pohlednice na nástěnce, role papírů na polici, hák jeřábu), ne změnou denní doby. K BLOCKED 2 v 01 proto z pohledu vzhledu doporučuji variantu (a), ne (c).
- **S-6 Nic v pásu letu nepřebije vlaštovku.** Trám s kladkou, košík, praporek větru a kouř z komína jsou nad nebo za dítětem, matné (kraft, krém s alfou ≤ 0,6), menší než vlaštovka na obrazovce. Praporek větru (01) je proužek pásky `#efe0a8`, ne bílý.
- **S-7 Reduced motion:** dioráma stojí (žádný kouř, praporek, krouživá vlaštovka v menu). Přechody podle 01 §3.8 (střih nebo prolnutí 0,2 s). Informace (směr větru) zůstává jako natočený praporek bez vlání.

---

## 4. Tři koncepty

### 4.1 Koncept 1: Terasa na střeše (`koncept-1-terasa.png`)
- **Myšlenka:** Dílna je tyrkysová kůlna na ploché střeše starého krémového domu (přízemí 3,5 m + 2 vysoká patra po 3,55 m = terasa v 10,6 m). Dítě stojí na bedně u zábradlí mezi květináči, za ním komín s obláčkem a šňůra se sušícími se barevnými papíry.
- **Zblízka:** dítě u zábradlí proti nebi, vlevo komín a šňůra s papíry, dole hrana střechy. Čisté, ale obecné: střecha by mohla být kdekoli.
- **Oddálení:** dům je jeden z řady, plynule navazuje na ulici. Start se ztrácí v městě.
- **Menu:** terasa se dobře čte, kůlna je ale malá a schovaná za tlačítky (desktop).
- **Plus:** nejmenší změna proti dnešku, nejlevnější (~660 △), sedí ke jménu Střechy za úsvitu. **Minus:** málo „domova“, Dílna je přístřešek, panel Dílny nemá kam najet (stůl je uvnitř kůlny).

### 4.2 Koncept 2: Podkrovní dílna v řezu (`koncept-2-podkrovi.png`), doporučuji
- **Myšlenka:** úzký krémový dům s rajčatovou sedlovou střechou na nízké opěrné zdi nad ulicí (zeď 1,1 m + přízemí 3,5 m + 2 patra = podlaha podkroví 10,6 m). **Podkroví je rozříznuté jako domeček pro panenky:** přední stěna chybí a řez střechy ukazuje světlé jádro kartonu (P2: „tohle je papír“). Uvnitř je dílna: stůl s lampou a stohy papíru, police s rolemi papírů, nástěnka s pohlednicemi z Atlasu, hotové vlaštovky na provázku. Z boku podkroví vedou půdní dveře na **pavlač** s tmavomodrým zábradlím. Nad ní trčí **trám s kladkou** a košíkem papírů (předobraz: amsterdamské domy s kladkou, které už jsou v katalogu u `house-gable`).
- **Zblízka (míření):** dítě na pavlači, vlevo otevřené tmavomodré dveře a hrana střechy, nad ním trám s lanem, vpravo nebe, slunce a střechy pod pavlačí. Je jasné, kde dítě je a že stojí vysoko nad ulicí.
- **Oddálení:** pavlač a dům zůstávají na levém okraji, dům je výrazný (červený štít v řezu), pod ním ulice. Start je i z dálky poznat.
- **Menu:** nejsilnější obraz ze všech tří: celý domek v řezu, dílna uvnitř, dítě na pavlači, slunce. Na desktopu stojí dům v pravé polovině, tlačítka nezakrývají nic důležitého. Na telefonu je domek v pásu nad tlačítky.
- **Vazba na 01:** odpovídá konceptu A z 01 (balkon podkroví, hák jeřábu Crane Lift nad balkonem: hák visí z trámu a jeho úrovně zvedají plošinu nad pavlač) a menu podle B z 01 („pokoj v podkroví“). Řez řeší menu bez kamery uvnitř pokoje: menu, míření i Dílna jsou jedna boční kamera, jen jinak blízko.
- **Panel Dílny (01 §2.4):** kamera najede na stůl v řezu (šířka ~5 m), panel je vpravo (desktop) nebo dole (telefon). Na stole leží zvolená vlaštovka s potiskem.
- **Postup ve hře je vidět doma:** pohlednice na nástěnce přibývají s místy Atlasu (návrh z 11 karta 5), role papírů na polici s druhy papíru (Copy, Kraft, Washi, Neon Foil), hák jeřábu s úrovněmi Crane Lift.
- **Plus:** příběh „z dílny oknem do světa“ (sedí k textu místa 1 „Out of the Workshop window“), nejvíc P2 (papírové dioráma), jedno místo pro menu, míření i Dílnu. **Minus:** nejvíc modelování (interiér) a řez střechy je nový díl.

### 4.3 Koncept 3: Vyhlídka na kopci (`koncept-3-vyhlidka.png`)
- **Myšlenka:** město začíná pod travnatým kopcem z vrstev papíru s třásněmi trávy. Na hřebeni stojí malá krémová chaloupka Dílny (cedulka na provázcích, kolo, schránka), strom, lavička a dřevěná vyhlídka s dalekohledem. Dítě hází ze zábradlí vyhlídky, z kopce vedou schody dolů do ulice.
- **Zblízka:** dítě na vyhlídce, tráva a dřevo, hodně nebe. Dílna v záběru není (je 15 m vlevo), takže zblízka chybí „domov“.
- **Oddálení:** kopec se svažuje k prvním domům, vlaštovka „sjíždí“ do města. Nejlepší pocit odletu.
- **Menu:** široký výhled na trasu (Alto's Odyssey), ale dítě i chaloupka jsou malé a velkou plochu zabírá tráva.
- **Plus:** nejvíc prostoru a klidu. **Minus:** Dílna je za zády, kopec je nová velká stavba v ulici místa 1 (x 0–100 m), jeřáb nemá přirozené místo, je to nejdál od „Střech“.

### 4.4 Srovnání

| | 1 Terasa | **2 Podkroví v řezu** | 3 Vyhlídka |
|---|---|---|---|
| Hrana a výška při míření | ●●○ | ●●● pavlač nad ulicí | ●●○ |
| Domov a Dílna v záběru zblízka | ●○○ | ●●● | ○○○ |
| Menu jako obraz | ●●○ | ●●● | ●●○ |
| Panel Dílny ve scéně | ●○○ | ●●● stůl v řezu | ●○○ |
| Vazba na 01 (balkon, jeřáb, menu) | ●○○ | ●●● | ●○○ |
| Papírové dioráma (P2) | ●●○ | ●●● | ●●○ |
| Práce (modely) a △ diorámatu | ●●● ~660 △ | ●○○ nejvíc dílů (interiér), ~550 △ | ●●○ ~600 △ |

Věž (vodárna, hodiny) jsem vyřadil: vodárna je dominanta místa 4 a hodinová věž místa 15 (06, katalog čtvrti 1 bod 1). Okno bez balkonu (01 B) zakrývá mířidla rámem; koncept 2 z něj bere jen pokoj.

---

## 5. Modely navíc pro katalog (karty ve formátu 11 kap. 3)

Trojúhelníky jsou **odhad** podle vzorců 11 kap. 1.3 (`box` 8, `panel` 2, `lista` 4, `gable` 9, `disc` n). Pro koncept 2 jsou karty plné, pro 1 a 3 jen souhrn.

#### H1 `kid` dítě, hrdina startu (všechny koncepty)
- **Předobraz a účel:** dítě, které vlaštovky skládá a hází. Je to hráčova postava, vidět ji zblízka při každém hodu.
- **Rozměry:** 1,2 m (model `person` × 0,7), hlava ⌀ 0,3 m, pláštěnka 0,5 m, nohy 0,45 m, ruka 0,5 m.
- **Papír:** jako `person` (hlava kotouč, trup lichoběžník), navíc skládaná čepice (trojúhelník s proužkem), vlasy kotouč za hlavou, oko tečka `pencil-700`, boty.
- **Pózy:** míření (ruka s vlaštovkou nahoře vpředu), nabíjení (záklon a couvnutí jako dnes `kidPose`), hod (švih), mávání po hodu, v menu mávání / sezení na pavlači, u stolu (panel Dílny).
- **LOD H:** ~70 △ (dnes 49). **LOD 0** (menu, oddálení): 20 △ jako `person`.
- **Barvy:** pláštěnka `#f2b65a`, čepice `#c9a57c` + proužek `tomato`, nohy `#3d4f7a`, boty `pencil-700`, kůže `life.people.skin[0]`.
- **Silueta:** postavička s trojúhelníkem na hlavě a zdviženou rukou, čitelná na telefonu od 60 px.

#### H2 `workshop-attic` Dílna, dům s podkrovím v řezu (koncept 2)
- **Předobraz a účel:** úzký měšťanský dům s podkrovní dílnou (Amsterdam, Malá Strana). Domov a pozadí menu.
- **Kde:** jen místo 1, x 55,5–67,5 m, čelo z +1,2 (pavlač končí u ruky x 71,6).
- **Rozměry:** 12 × 8 m, přízemí 3,5 m + 2 patra × 3 m na zdi 1,1 m, podkroví: nadezdívka 2,3 m + střecha 4,6 m.
- **Papír:** tělo karta, okna `windowCut`, dveře se stříškou, výloha v přízemí, cedulka PAPER LAB pod podkrovím (karta + textura jako dnes). **Řez podkroví:** zadní stěna a štít jako `panel` v `card #f4ecdc` mírně do stínu, podlaha `lista` v kraftu, nadezdívka v řezu (krémová stěna se světlou hranou), střecha jako dvě silné rajčatové `lista` se světlým jádrem řezu (**nový díl `cutRoof`**, 8 △).
- **LOD H/0:** tělo a řez ~40, okna 8 × 12 ≈ 100, přízemí (dveře, výloha, schránka) ~40, cedulka 6, střecha v řezu 16 ≈ **200 △** bez interiéru. **LOD 2 (stín, dálka):** dům + štít ≈ 20 △.
- **Barvy:** stěna `PAPIR.workshop.wall`, střecha `roof` (tomato), rámy oken a dveře `#3d4f7a` (ne grafit), sklo dílny `#ffe2a8`.
- **Silueta:** vysoký dům s červeným štítem a „otevřenou“ střechou; v 25 % šedi se čte jako dům s tmavým otvorem nahoře.

#### H3 `workshop-interior` dílna v podkroví (koncept 2)
- **Účel:** výloha postupu a pozadí panelu Dílny.
- **Obsah:** stůl 3,4 × 0,8 m (`box` 8 + nohy 2 × `panel`), lampa (rameno `panel`, stínítko `flag`), stohy papíru 3 × `panel`, kelímek s tužkami, řezačka, **police s rolemi papírů** (4 role = 4 druhy papíru, `disc 10` jen čelo, přibývají), **nástěnka s pohlednicemi** (kraftová deska, 16 míst Atlasu jako krémové karty s barevným obrázkem, `panel` 2 + 2, přibývají), provázek s hotovými vlaštovkami (`flag`, barevné, **bez obrysu a ne bílé**), zvolená vlaštovka na stole (plane.js, jediná bílá s obrysem).
- **△:** stůl a lampa ~30, papíry a kelímek ~20, police s rolemi ~50, nástěnka ~70, provázek ~10 ≈ **180 △**.
- **Pravidlo:** interiér je o tón tmavší a méně sytý než fasáda (je ve stínu střechy), aby dítě a vlaštovka zůstaly první, co oko najde (bible kap. 6).

#### H4 `loft-balcony` pavlač s půdními dveřmi (koncept 2)
- **Rozměry:** deska 4 × 2,4 × 0,2 m na dvou konzolách, zábradlí 0,95 m (sloupky po 0,5 m, madlo), půdní dveře 0,95 × 2,05 m otevřené ke kameře, klika.
- **△:** deska 8, konzoly 4, zábradlí 9 × 2 + 2 = 20, dveře a rám 6, klika 8 ≈ **46 △**.
- **Barvy:** deska kraft `#9c7a55`, zábradlí a dveře `#3d4f7a`, klika krémová (ne hořčicová).

#### H5 `hoist-beam` trám s kladkou (koncept 2, místo pro Crane Lift z 01)
- **Rozměry:** trám 9 × 0,3 m z vrcholu štítu přes pavlač, kladka ⌀ 0,45 m, lano, košík papírů 0,65 × 0,45 m; praporek větru na konci trámu (páska `#efe0a8`, 0,8 m). Varianty: **hák s plošinou Crane Lift úr. 1–3** (plošina 1,5 / 3 / 4,5 m nad pavlačí, 01).
- **△:** trám 8, kladka 12, lano 2, košík 8, praporek 2 ≈ **32 △**, hák s plošinou +20.
- **Pravidlo S-6:** nic z toho není bílé s grafitem; košík a hák jsou matné kraftové.

#### H6 `retaining-wall` opěrná zeď se schody (koncept 2)
- **Rozměry:** zeď 31 × 1,1 m z kamene `#d9bf98` se spárami (`panel`), 7 schodů dolů do ulice.
- **△:** zeď 8, spáry 11 × 2, schody 7 × 8 ≈ **86 △**.

#### Koncept 1 a 3 (souhrn)
| Model | Obsah | △ |
|---|---|---|
| `roof-terrace` (1) | dům 15,5 × 10,6 m (okna, vchod), plochá střecha s lištou, kůlna Dílny s pultovou střechou, oknem a cedulkou, komín, 3 květináče, šňůra s papíry, bedna, zábradlí | ~660 |
| `lookout-hill` (3) | 2 karty kopce, horní plocha, třásně trávy (~180 trojúhelníků), schody | ~290 |
| `lookout-deck` (3) | podlaha, zábradlí, dalekohled na sloupku, lavička | ~60 |
| `workshop-cottage` (3) | chaloupka se štítem, dílenské okno se stolem, dveře, cedulka, komín, kolo, schránka, strom | ~250 |

### 5.1 Rozpočet (koncept 2)

| | △ | Draw calls |
|---|---|---|
| Dioráma (H2 + H3 + H4 + H5 + H6), jedna sloučená geometrie `paperMaterial(ID.near)` | ~545 (+20 hák) | 1 + 1 stín |
| Cedulka PAPER LAB (textura) | 2 | 1 |
| Dítě H1 | ~70 | dnes 4 skupiny × (mesh + stín) = 8; **cíl 2** (tělo + ruka, dýchání a záklon ve vertex shaderu nebo sloučené skupiny) + 1 stínový proxy |
| Vlaštovka v ruce (plane.js) | 4–6 | 3 + 1 stín (jako dnes) |
| **Celkem** | **~620–650** (strop 11 karta 5: 1 200 včetně dítěte) | **~10** (dnes ~15) |

Rozpočet místa (14 DC, 15 tis. △, `.claude/rules/render3d.md`) se počítá s Dílnou. Místo 1 má dnes ulici, střed, dálku a 3 stíny = 7 DC, s diorámatem ~17 DC, tedy **nad stropem 14**. Navrhuji výjimku pro místo 0 („hrdina startu“, scéna ≤ 120 DC platí), nebo sloučit stín diorámatu do stínu ulice. Rozhodne game-dev s měřením (`perf-check`), NOT ASSESSED.

---

## 6. Rozpory kód × bible × tento návrh

**Vyřešeno 14. 10.** podle 06 (body 1–6); tabulka s tím, co platí a na kterou dávku kód čeká, je v bibli 05 kap. 16.1. Sloupec „Návrh“ níže je teď platné znění.

| # | Kde | Dnes | Návrh |
|---|---|---|---|
| R-S1 | bible 05 kap. 9, 11 karta 5, `models/workshop.js` (K4), `workshop.js workshopCards` | Dílna 24 × 12 m s přístavkem, dítě `S = 0,25` | po schválení konceptu nová karta (kap. 5), K4 model se nahradí |
| R-S2 | bible kap. 9 „kamera Dílny zůstává `restCamera`“, 11 kap. 1.2 „Dílna ~5 px/m“ | klid 244 m | míření polodetail 16 m (80 px/m), menu 25–43 m |
| R-S3 | 11 kap. 1.1 „vlaštovka 7,75 m, jediná výjimka“ | stálá velikost | M-2: v ruce 0,5 m, roste s šířkou záběru |
| R-S4 | `PAPIR.workshop.rail`, `frame`, `string` | grafit `#2a2622` | `#3d4f7a`, provázky `pencil` (S-2, bible kap. 6) |
| R-S5 | `PAPIR.workshop.visor`, `shirt` | bílá, hořčicová | kraft `#c9a57c`, `#f2b65a` (S-3) |
| R-S6 | 07-menu §2.1 | menu = nejvzdálenější čtvrť | menu = dioráma startu (BLOCKED 2 v 01, doporučuji a) |
| R-S7 | `pose.js HAND` × `core.js` y0 | 16 m × 12 m | ruka 12 m (M-3, 01 §1.5) |
| R-S8 | `cityChunk(0)` střed | 17–38 m hned za startem | pás výhledu S-1 |
| R-S9 | 01 §3.3 W_aim | 55 m (telefon 45 m) | 16 m (telefon 7 m), BLOCKED 2 níže |

---

## 7. Doporučení

1. **Koncept 2 Podkrovní dílna v řezu** s polodetailem 16 m při míření, kamerou mírně zespodu a vlaštovkou podle M-2.
2. Pravidla jednoho měřítka (M-1 až M-4) a společná pravidla (S-1 až S-7) zapsat do bible 05 (kap. 3, 6, 9) a 11 (kap. 1.1, 1.2) po schválení. **Splněno 14. 10.** (bible 05 kap. 3.1, 6, 9; katalog 11 kap. 1.1, 1.2, 3.7, 4).
3. Pořadí pro game-deva (navazuje na dávky S1–S5 z 01): (a) pás výhledu v rozložení místa 1 a barvy dítěte a zábradlí (malé, hned viditelné), (b) dítě H1 ve skutečném měřítku a velikost vlaštovky M-2 spolu s kamerou S1–S3 z 01, (c) modely H2–H6 přes katalog (`prototype/katalog`, nejdřív hezký objekt, 10), (d) menu a panel Dílny nad řezem.
4. Před stavbou ověřit v prohlížeči (art-review): polodetail na 375 × 667, 932 × 430 a 1280 × 800, kontrast obrysu vlaštovky z pixelů na pozadí slunce a mraků, čitelnost dítěte na telefonu, výkon místa 0.

## 8. Otevřené volby (rozhodnuto 14. 10.)

Všechny čtyři otázky uživatel rozhodl podle doporučení: koncept 2, polodetail 16 m (a), pás výhledu (a), barvy dítěte a zábradlí (a). Otázky zůstávají níže kvůli dohledatelnosti, už se nepředávají.

Rozhodnuto (dříve BLOCKED): **Jak má vypadat místo, odkud se hází?** Obrázky `research/design/img/start/koncept-1-terasa.png`, `koncept-2-podkrovi.png`, `koncept-3-vyhlidka.png`. (1) **Terasa na střeše**: dítě u zábradlí na ploché střeše, Dílna je kůlna vedle. Nejlevnější, ale obecné. (2) **Podkrovní dílna v řezu**: domeček bez přední stěny podkroví, uvnitř dílna se stolem a nástěnkou pohlednic, dítě hází z pavlače u půdních dveří, nad ním trám s kladkou (místo pro hák jeřábu). (3) **Vyhlídka na kopci**: chaloupka a dřevěná vyhlídka nad městem, největší výhled, ale Dílna je za zády. **Doporučuji 2**: je nejvíc „papírové dioráma“, menu, míření i Dílna jsou jedna scéna a sedí k balkonu a jeřábu z návrhu game designera.

Rozhodnuto (dříve BLOCKED): **Jak blízko má být kamera při míření a jak velké dítě?** Obrázek `research/design/img/start/zaber.png`. (a) **Polodetail 16 m**: dítě ve skutečné velikosti 1,2 m má na monitoru 96 px a na telefonu 64 px, vlaštovka v ruce 0,5 m (40 / 27 px) a po výhozu plynule naroste na dnešní velikost. (b) **55 m** podle game designera: vidět víc města, ale dítě má jen 28 px (telefon ~10 px), nebo by muselo zase být obr jako dnes. (c) **Detail 8 m**: dítě velké, ale málo místa pro mířidla. **Doporučuji (a)**; game designer by v 01 upravil `W_aim` na 16 m (telefon 7 m).

Rozhodnuto (dříve BLOCKED): **Smí se snížit domy hned za startem?** Obrázek `research/design/img/start/vyhled.png`. Za dítětem dnes stojí domy až 38 m vysoké a zakrývají nebe i slunce. (a) **Do 150 m od startu domy ve středu nejvýš 13 m**, dál postupně jako dnes: dítě se dívá přes střechy ke slunci. (b) Nechat: za dítětem bude zeď domů. (c) Házet z vyššího místa: mění délku letů a chce nové kolo simulace (01 §1.5). **Doporučuji (a).**

Rozhodnuto (dříve BLOCKED): **Barvy dítěte a zábradlí** (mění dnešní vzhled). (a) **Pláštěnka světle oranžová `#f2b65a`** místo hořčicové (hořčicová patří jen mincím, stejně jako u praporků), **čepice z hnědého kraftového papíru** místo bílé (bílá je jen vlaštovka) a **zábradlí tmavomodré** místo černého (černá čára je jen vlaštovka a její stopa). (b) Nechat jako dnes. **Doporučuji (a)**, zblízka by bílá čepice a černé zábradlí stály hned vedle vlaštovky.
