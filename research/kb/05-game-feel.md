# Blok 5 — Game feel a „juice“

**Rešerše: 13. 10. 2026. Stav: po ověřovacím kole 13. 10. 2026 a sjednocení s ostatními bloky (README §3.4). Žádná doporučení zde nejsou finální.** Podrobnosti ověření jsou v poslední sekci.

Navazuje na princip **K6 „Úspěch je cítit přímo při akci“** v `KB zabavnost a motivace.md`. K6 stojí na rámci GameFlow (kontrola a odezva) a výslovně odmítá zdůvodnění „dopaminovou dávkou“. Tento blok jde o úroveň níž: **co přesně víme o účinku efektů, jak velké mají být a kde škodí.**

Štítky: **V** výzkumný poznatek (u studií uvádím vzorek) · **H** heuristika nebo praxe oboru (přednášky, knihy, kód her) · **N** naše hypotéza pro Just Throw It. Čísla v hranatých závorkách odkazují na registr zdrojů v oddílu 6.

**Omezení rešerše:** Plné texty Hicks et al. 2019 [10] a Kao 2020 [12] nebyly dostupné (paywall, ochrana proti stahování). Plný text Kao et al. 2024 [13] byl dohledán v ověřovacím kole 13. 10. 2026 (repozitář Imperial College). Vycházím z ověřených abstraktů a ze shrnutí v jiných recenzovaných pracích. Kapacita webového vyhledávání se během práce vyčerpala, proto některé dílčí údaje zůstaly neověřené. Takové údaje jsou v textu výslovně označené.

---

## 1. Klíčová zjištění v kostce

1. **V — Juice má optimum, ne „čím víc, tím líp“.** Ve dosud největší studii (N = 3 018, čtyři úrovně) dopadly varianty *žádný* i *extrémní* juice významně hůř než *střední* a *vysoký*, a to v prožitku, vnitřní motivaci, herní době i výkonu [12]. Ve studii z roku 2024 (n = 1 699) zesílení, které se spouštělo i při minutí a přehlušilo zpětnou vazbu zásahu, **snížilo** efektanci a kompetenci oproti standardní zpětné vazbě. Zábavu ani dobu hraní přímo nezměnilo [13].
2. **V — Nejspolehlivější efekt je estetický, ne kompetence.** Vizuální ozdoby zvyšují vizuální přitažlivost. Pocit kompetence ovlivňují „jen za specifických okolností“ [10]. Podle shrnutí v [13] neměly vliv na použitelnost ani výkon a zvědavost, kompetenci a imerzi zvýšily jen v jedné ze tří her. Dekorace, se kterou hráč nemůže interagovat, zlepšuje jen povrchový dojem [14]. Ve studii Juul & Begy (N = 46) hodnotili hráči šťavnatou verzi výš, ale skórovali hůř. Ani jeden rozdíl nebyl statisticky významný [8].
3. **V — Efekt musí záviset na úspěchu.** Zpětná vazba spouštěná jen při úspěšném zásahu zvýšila všechny tři měřené motivy: kompetenci (0,45), efektanci (0,26) i zvědavost (0,29). Dobrovolná doba hraní byla nejdelší v podmínce vázané na úspěch bez variability (10,2 min proti 6,2 min u standardu). Náhodné střídání variant efektů zvědavost nezvýšilo. Autoři z toho vyvozují, že předpokladem dobrého „game feelu“ je **čitelné spojení akce a výsledku a odstupňovaný úspěch** [13] (plný text ověřen).
4. **V — Zvuk je pravděpodobně silný kanál, ale důkazy jsou slabší, než se zdálo.** Zapnutý zvuk měl ve střílečce významný hlavní efekt na všechny dimenze dotazníku GEQ [19]. Abstrakt neuvádí velikost vzorku ani směr efektu u napětí a negativního afektu a GEQ má podle validace z roku 2018 nespolehlivou strukturu (blok 9). Plný text zůstal i po druhém pokusu nedostupný. Sekundární shrnutí naznačují obvyklý směr (se zvukem lepší pozitivní a nižší negativní dimenze), ale jejich původ se nepodařilo dohledat. Bez zvuku hráči dosahovali nejhoršího výkonu v Zeldě (n = 20) [20]. Šťavnaté zvuky zvýšily prezenci (imerze a smyslová věrnost) [18]. Hudba zvyšuje požitek přes pozitivní emoce [21]. Just Throw It zatím zvuk nemá, a v tom je pravděpodobně jeho největší mezera v game feelu (**N**, opora střední).
5. **V — Odezva má měřitelné prahy.** U dotykového tlačítka hráči hodnotí kvalitu znatelně hůř, když je vizuální odezva zpožděná o 100–150 ms a zvuková nebo hmatová o 70–100 ms. Doporučené rozsahy, ve kterých odezvu vnímá jako současnou se stiskem aspoň 75 % pokusů, jsou 30–85 ms (obraz), 20–70 ms (zvuk) a 5–50 ms (hmat) [22]. Při tažení lidé rozpoznají zlepšení i pod 10 ms [23].
6. **H — Hitstop, kamera a soulad zvuku s obrazem** jsou podle analýzy recenzí akčních her trojice prvků, bez kterých „pocit zásahu“ selhává [16]. Konkrétní délky v hrách se pohybují od 10–20 ms (Nuclear Throne [5]) přes 7–10 snímků (Guilty Gear [16]) až po strop 30 snímků (Smash Bros. [29]).
7. **V/H — Haptika na mobilu pomáhá, ale na webu je nedostupná pro iOS.** Jakákoli vibrační ozdoba zlepšila hráčský prožitek oproti žádné (n = 38). Nízká a vysoká intenzita se přitom téměř nelišily [15]. Vibration API ale nepodporuje Safari na iOS ani aktuální Firefox pro Android [31c].
8. **H — Přístupnost je tvrdá hranice:** nejvýš 3 záblesky za sekundu (WCAG 2.3.1, úroveň A) [30a]. Pohyb vyvolaný interakcí včetně **paralaxy** má jít vypnout (2.3.3, AAA) [30b]. Žádná podstatná informace nesmí být jen ve zvuku. Vibrace, zvuk a otřesy mají mít vlastní přepínače [32].
9. **N — Pro Just Throw It** bude rozhodující, aby efekty **rozlišovaly kvalitu** hodu a QTE (perfektní, dobré, minuté), a ne jen přidávaly lesk ke každé akci. Zvuk, odstupňovaný hitstop při perfektním QTE a směrový otřes při dopadu jsou kandidáti s nejlepším poměrem důkazů a nákladů.

---

## 2. Podrobné sekce

### 2.1 Co je game feel a juice (rámce)

- **H — Swink (2008), *Game Feel*** [1]: game feel je „real-time control of virtual objects in a simulated space, with interactions emphasized by polish“. Má tedy tři složky: řízení v reálném čase, simulovaný prostor a polish. Tato definice je ověřena citací v [2]. Swink podle [2] vyjmenovává pět prožitků: estetický pocit kontroly, radost z učení a mistrovství, rozšíření smyslů, rozšíření identity a interakci s jedinečnou fyzikální realitou.
  - *Omezení pro nás:* Swinkovo jádro je **průběžné řízení**. Let v Just Throw It je automatický, takže Swinkův „real-time control“ splňuje jen míření, nabití a QTE. Ostatní je čistý polish a simulovaný prostor. Game feel u nás proto ponesou hlavně okamžiky vstupu (**N**).
  - Hodnoty „odezva ≤ 100 ms je pohodlná“ a „cyklus vnímání, rozhodnutí a reakce ≈ 240 ms“ se Swinkovi běžně připisují. Odvozují se od Model Human Processor (Card, Moran, Newell: ~100 + 70 + 70 ms). **V originále knihy jsem je neověřil.** Mám je jen ze sekundárních univerzitních slajdů, které Swinka citují (s. 34 n.).
- **H/V — Pichlmair & Johansen (2021)** [2]: přehled více než 200 akademických i praktických zdrojů. Game feel dělí na tři záměry: **fyzikálnost** (ladění, „tuning“), **zesílení** (juicing) a **podporu** (zjednodušení, „streamlining“: coyote time, buffer vstupu). Pro nás jsou užitečné tyto body:
  - Nabíjení akce řadí mezi **„spring-locked modes“**, tedy režimy držené stiskem (Angry Birds, SSX Tricky). Ty podle autorů slouží k vytvoření **anticipace**.
  - Uvádí konkrétní odpuštění vstupu: Mario si pamatuje stisk skoku 1–2 snímky, Braid 0,23 s. Disc Room aktivuje smrtící hitboxy se zpožděním až 50 ms.
  - Hitstop je podle nich „možná nejlépe prozkoumaný jev“ v oblasti vizualizace zásahu. Přesto je to převážně praxe, ne experiment.
  - Otřes kamery: místo náhodného pohybu doporučují **easing ve významově smysluplném směru**, protože ten nese víc informace.
  - *Kvalita:* recenzovaný přehled (IEEE Transactions on Games). Je to taxonomie, ne syntéza účinků.
- **H — Hicks, Dickinson, Holopainen & Gerling (2018)** [9]: rámec šťavnatého designu z dotazníku mezi 17 vývojáři, zpřesněný analýzou Candy Crush a Downwell. Klíčové otázky rámce:
  - *Feedback Coherence*: odpovídá zpětná vazba důležitosti události?
  - *Focus of Attention*
  - *Overwhelming*: zahlcuje nebo rozptyluje hra příliš velkým množstvím zpětné vazby?
  - Citace vývojáře: „Juice should be used to direct the players attention, not divide it.“
  - *Omezení:* malý vzorek, názory praktiků, žádné měření účinku.
- **H — Jonasson & Purho (2012), „Juice It or Lose It“** [3]: GDC Europe, Independent Games Summit. Autoři živě „vyšťavňují“ klon Breakoutu: tweening, natahování a smršťování objektů, částice, zvuky. Je to nejvlivnější praktická ukázka a kulturní původ pojmu. *Neměří nic.* Protipól představuje Folmer Kelly (2014), „Don't Juice It or Lose It“ [7]: polish může stát imerzi a víc pozornosti má dostat kontext.
- **H — Nijman (2013), „The Art of Screenshake“** [4]: přednáška na INDIGO Classes 2013 s demem střílečky, ve které postupně přidává zhruba 30 triků. Podle osnovy z komentáře, tedy sekundárně, jde mimo jiné o tyto triky: větší střely, záblesk u hlavně, odhoz nepřítele, **permanence** (trosky zůstávají), lerp kamery, otřes, odhoz hráče a **„sleep“** (krátká pauza při zásahu). Úplný seznam jsem neověřil.

### 2.2 Empirické studie juice — co vyšlo a co ne

| Studie | Vzorek a design | Výsledek | Co nevyšlo nebo vyšlo negativně |
|---|---|---|---|
| Juul & Begy 2016 [8] (poster FDG/DiGRA) | N = 46 studentů, 6 min, match-3, základní × šťavnatá verze (delší částice, víc zvuků) | Kvalita: 3,74 × 3,26 (p = 0,20) | Skóre 40 340 × 49 682 v neprospěch juice (p = 0,12). Snadnost ovládání beze změny (4,43 × 4,57). Pocit „chytrosti“ 3,05 × 2,83 (p = 0,44). **Žádná hypotéza se nepotvrdila.** |
| Hicks et al. 2019a [10] (CHI PLAY) | 40 hráčů (Cuber, Dungeon Descent) + 32 (Quake 3), uvnitř osob | Vizuální ozdoby zvyšují vizuální přitažlivost ve všech hrách | Kompetenci a další aspekty ovlivňují „jen za specifických okolností“. Podle shrnutí v [13]: bez vlivu na použitelnost a výkon, zvědavost, kompetence a imerze jen v jedné ze tří her |
| Hicks et al. 2019b [11] (IEEE CoG) | juice × gamifikace, několik žánrů | Podle shrnutí v [17]: zvýšil pocit smyslu a zvědavost. Kombinace vizuálního a zvukového juice byla lepší než základ. | Neovlivnil výkon ani chování. *Plný text neověřen.* |
| Kao 2020 [12] (Entertainment Computing) | **N = 3 018**, akční RPG, mezi osobami, úrovně None / Medium / High / Extreme (abstrakt; Kao 2024 nejnižší úroveň nazývá „low“) | Střední a vysoký juice: vyšší prožitek, vnitřní motivace, herní doba i výkon | **Žádný i extrémní juice významně horší** ve všech měřítkách |
| Kao et al. 2024 [13] (CHI, předregistrováno, plný text) | **n = 1 699**, akční RPG, mezi osobami, standard + zesílené 2×2: závislost na úspěchu × variabilita | Závislost na úspěchu zvýšila kompetenci (0,45), efektanci (0,26) i zvědavost (0,29). Zvědavost byla nejsilnějším prediktorem požitku a jediným prediktorem dobrovolné herní doby. Variabilita mírně zvýšila zábavu (0,11). | **Zesílení bez vazby na úspěch** (efekty i při máchnutí do prázdna, přehlušující zásah) snížilo efektanci (−0,19) a kompetenci (−0,43) proti standardu. Variabilita nezvýšila zvědavost. Hlášená zábava nepředpovídala dobu hraní. |
| Meiners et al. 2025 [14] (FDG), „lushness“ | n = 31, 2D plošinovka, 4 úrovně neinteraktivní dekorace | Vyšší audiovizuální přitažlivost a atraktivita | Žádný rozdíl v kompetenci ani kognitivní zátěži |
| Singhal & Schneider 2021 [15] (CHI), haptika | n = 38 (within), Breakout na telefonu, haptika žádná / nízká / vysoká × vizuál nízký / vysoký | Jakákoli haptika zlepšila PXI, požitek i hmatový prožitek | Nízká a vysoká haptika se nelišily, s výjimkou expresivity |
| Smets & van der Spek 2021 [18] (ICEC), zvuk | n = 61 (between, podle [17]), side-scroller | Šťavnaté zvuky (vrstvení, změna výšky tónu, dozvuk, delší trvání) zvýšily prezenci, konkrétně imerzi a smyslovou věrnost (abstrakt ověřen; „střední efekt“ a n podle [17]). Cena za nejlepší příspěvek ICEC 2021. | Podle [17] mohl účinek způsobit jen „víc zvuku“, ne šťavnatost. *Plný text neotevřen (403).* |

**Síla důkazu:** Kao 2020 a Kao et al. 2024 jsou velké online experimenty a ten druhý je předregistrovaný. Pro otázku „kolik“ jsou to nejsilnější data. Slabiny jsou tyto:
1. Obě studie používají **jeden žánr** (akční RPG) a jednu konkrétní implementaci efektů. Co „extrémní“ v Kao 2020 přesně obsahovalo, zůstává neověřené (plný text vrací 403). U Kao 2024 je podmínka známá: viz §3 bod 2.
2. Herní relace jsou krátké a online, takže efekty novosti mohou převažovat.
3. Juul & Begy je výslovně „preliminary“ poster s malým vzorkem a nevýznamnými výsledky.

**Přenositelnost:** Akční RPG má desítky zásahů za minutu. Just Throw It má na jeden pokus jen několik klíčových okamžiků (nabití, vypuštění, QTE, dopad, výplata). *Opraveno v ověřovacím kole (rozpor R7):* QTE není „1–3“. Podle `events.js` může let mít až 10 událostí (první v 1,5 s, další po 3 s, od čtvrté po 4–7 s) a Monte Carlo 0.6.1 uvádí průměrně asi 3 události na hod. Dlouhé lety jich mají víc. Riziko „extrému“ u nás tedy nevzniká hustotou efektů, ale jejich **délkou a intenzitou** v jednom okamžiku a tím, že **zakrývají informaci** (výsledek QTE, vzdálenost, mince) (**N**).

**Proč může juice škodit (V, s výhradami):**
- Juul & Begy odkazují na teorii kognitivní zátěže (*split attention*, redundance): nadbytečná zpětná vazba dělí pozornost [8].
- Kao et al. navrhují oslabení pocitu kontroly: když efekt přichází bez ohledu na kvalitu akce, nespojuje se s ní [13]. V plném textu výslovně odmítají vysvětlení kognitivní zátěží (Juul) a nabízejí dvě jiná: efekt za pouhou akci „zlevní“ úspěch a přehlušená zpětná vazba brání hráči spojit výsledek se svou akcí (*outcome binding*).
- Zvukoví designéři zmiňují **únavu z opakování**: „you can over juice“ [17].

### 2.3 Hitstop / hit pause / freeze frame

- **Pojmy (H, [2]):** *hitstop* zastaví jen zúčastněné objekty. *Freeze frame* zastaví celou hru. *Slow motion* hru zpomalí, například Holedown místo zastavení zpomalí na „téměř nulu“ na několik snímků. *Bullet time* je zpomalení držené hráčem, nastupuje a odeznívá podle ADSR obálky (Swink).
- **Parametry z praxe (H):**
  - Nuclear Throne: hra „zamrzne asi na 10–20 ms pokaždé, když něco zasáhnete“. Rozhovor s Nijmanem (RPS 2013), převzato z [5]. Citace u Armitage znovu ověřena 13. 10. 2026.
  - Guilty Gear Xrd: lehký úder 7 snímků, těžký kolem 10 snímků. Dragon Ball FighterZ: u nabíjeného ultimátního útoku až celá sekunda [16].
  - Super Smash Bros. Ultimate: hitlag = ⌊(poškození × 0,65 + 6) × modifikátory⌋ snímků. Zásah za 15 % dává asi 15 snímků (~250 ms při 60 fps), strop je 30 snímků [29]. Elektrické útoky ×1,5.
  - Sakurai [28]: hitstop zdůrazňuje sílu úderu a délka roste s poškozením. Postava během něj **vibruje**, a to amplitudou, která v průběhu zmrazení klesá. Na zemi se vibruje do stran, ve vzduchu nahoru a dolů. Intenzitu vibrace upravuje podle vzdálenosti kamery. Hitbox zůstává na místě, vibruje jen obraz. Hitstop navíc úmyslně zkracuje, aby nezvýhodnil třetího hráče.
- **V (slabé, korelační):** Lin et al. 2022 [16] natrénovali NLP model na 5 000 ručně anotovaných komentářích ze Steamu (z celkem 281 720 čínských komentářů k 96 hrám) a porovnali 8 nejlépe a 8 nejhůř hodnocených akčních her. Hry bez hitstopu (Sacred Citadel, Draw Slasher) byly hodnoceny jako „měkké“. *Omezení:* jde o korelaci na malém počtu her, ne experiment. Konferenční příspěvek má 6 stran.
- **Přenositelnost:** hitstop je navržen pro **zásah**. U nás odpovídá perfektnímu QTE (odražení holuba, proražení poryvu) a dopadu. Hitstop během QTE sekvence ale musí pozastavit i časovač dalších oken, jinak změní obtížnost (**N**, souvisí s blokem 6).

### 2.4 Otřes obrazovky, kamera, zoom a lookahead

- **H — Nijman / Nuclear Throne [5]:** jeden výstřel pistolí obsahuje zvuk, nábojnici (2–4 px/snímek při 30 fps a rozlišení 320×240), **odhoz kamery o 6 px** proti směru míření, „přičíst 4 k otřesu“ s rychlým útlumem, zákluz zbraně 2 a první snímek střely jako kruh (falešný záblesk). Při zásahu následuje zvuk podle materiálu, odhoz nepřítele asi 3 px/snímek a zmrazení 10–20 ms. *Hodnota:* vzácně konkrétní rozbor z jedné hry. Pixely jsou vázané na rozlišení 320×240. U nás (640×360) by odpovídající odhoz byl zhruba dvojnásobný (**N**, prostý přepočet měřítka).
- **H — Eiserloh (GDC 2016), „Juicing Your Cameras With Math“** [6]: téma (rámování, vyhlazený pohyb kamery, otřes) je ověřeno popisem na GDC Vault. Model **„trauma“** (hodnota 0–1, otřes ~ trauma² nebo trauma³, plynulý šum místo náhody, lineární útlum) znám jen z implementací, které se na talk odvolávají (Bevy, Unity, Godot). *Přesné vzorce v přednášce jsem neověřil.* Princip „kvadrát traumatu“ dává malým událostem téměř žádný otřes a velkým silný, což je v souladu s *Feedback Coherence* [9].
- **H — směr otřesu nese informaci** [2], [16], [28]: Guilty Gear třese svisle při pádu na zem a vodorovně při vodorovném seknutí. Sakurai třese na zemi do stran a ve vzduchu svisle.
- **H/V — kamera jako jeden ze tří klíčových prvků „impact feel“** [16]: v plynulém přiblížení k důležité události (nabíjení „Spirit Bomb“) následovaném rychlým oddálením.
- **Kinetóza a otřes:** WCAG 2.3.3 [30b] a MDN [31a] jmenují **posun a škálování velkých ploch a paralaxu** jako spouštěče vestibulárních potíží (závratě, nevolnost, bolest hlavy). Game Accessibility Guidelines [32] doporučují možnost vypnout pohyb pozadí a vyhnout se náhlým nečekaným pohybům. **Empirickou studii o otřesu obrazovky a kinetóze u 2D her na monitoru nebo mobilu jsem nenašel.** Výzkum kinetózy se týká hlavně VR. Hranice amplitudy a frekvence otřesu pro 2D proto zůstávají otevřené.
- **Lookahead (H):** kamera předbíhá ve směru pohybu, aby hráč viděl, co přichází. Pro automatický let je to spíš otázka kompozice než řízení. Konkrétní ověřený zdroj s parametry nemám, proto jde o **N**.

### 2.5 Animační principy: anticipace, squash & stretch, easing

- **H — Jonasson & Purho [3]:** tweening, natažení a smrštění objektů jsou nejlevnější cestou k „živosti“.
- **V/H — Singhal & Schneider [15]** převzali animační principy do haptiky. U **anticipace, inscenace (staging), dobíhání pohybu (follow-through) a nadsázky** vysoká haptická ozdoba posílila vizuální podnět. Mezi principy pro haptiku patří **přesná synchronizace** s obrazem, **kódování energie** (pohybu) objektu a **variace intenzity a ostrosti** pro různé události. *To je jediný empirický doklad k animačním principům, který jsem našel, a týká se haptiky, ne obrazu.*
- **H — Hicks et al. 2018 [9]:** „If you're going at max speed the ball deforms slightly.“ Deformace kóduje rychlost, tedy herní stav, a není to jen ozdoba.
- **H — Easing [2]:** lerp a easingové funkce jsou technickým základem dynamické kinematografie i otřesu. Konkrétní doporučené délky easingu pro hry jsem z ověřeného zdroje nezískal. Běžné UI konvence (zhruba 100–500 ms) jsem v této rešerši neověřil.
- **12 principů animace** (Thomas & Johnston, převod do počítačové animace u Lassetera 1987) uvádím jen jako známý kontext. **Původní zdroje jsem v této rešerši neotevřel.**
- **Lin et al. [16]:** One Finger Death Punch (nejlépe hodnocená z 44 her) přepíná pózy **bez interpolace**. Postava okamžitě skočí do nové pózy a směr pohybu nese efekt útoku. Ostré snímky tedy mohou působit úderněji než plynulý easing.

### 2.6 Částice, záblesky a permanence

- **H [2], [4]:** jednorázové částice zesilují výsledek akce. Bílý záblesk sprite na 1–2 snímky zdůrazní zásah (Nijman). **Permanence**, tedy stopy a trosky, které zůstávají, vytváří kontinuitu v čase (Samurai Gunn: stopa meče, kouř, trajektorie).
- **V — dekorace nestačí:** lushness [14] zvýšila přitažlivost, ale ne kompetenci. Částice spojené s výsledkem akce jsou juice, plošné ozdoby pozadí jsou „lushness“ (**H/V**).
- **Hranice (WCAG 2.3.1, úroveň A) [30a]:** nejvýš **3 záblesky za 1 s**, nebo plocha pod prahem. Obecný záblesk je změna relativního jasu ≥ 10 % maxima, kdy tmavší stav má jas < 0,80. Prahová plocha je 0,006 sr v 10° zorného pole, hrubě **341 × 256 px na obrazovce 1024 × 768**. Pro **sytě červenou** platí přísnější „red flash“: R/(R+G+B) ≥ 0,8. Neonová paleta s rychlými bílými nebo červenými záblesky přes celou obrazovku je proto riziková (**N**).

### 2.7 Zvuk: prožitek, výkon a procedurální zvuk na webu

- **V — Nacke, Grimshaw & Lindley 2010** [19]: modifikace rychlé střílečky, zvuk zap./vyp. × hudba zap./vyp. **Zvuk měl významný hlavní efekt na všechny dimenze GEQ** (imerze, napětí, kompetence, flow, negativní i pozitivní afekt, výzva). Interakce zvuku a hudby se projevila u napětí a flow. Fyziologická měření (EDA, EMG) nevykázala žádný hlavní ani interakční efekt. Abstrakt znovu ověřen 13. 10. 2026 (repozitář University of Bolton). *Velikost vzorku ani směr efektu u jednotlivých dimenzí abstrakt neuvádí.* Původní formulace „zvuk zlepšil všechny dimenze“ proto byla silnější, než abstrakt dovoluje: u napětí a negativního afektu není jasné, zda „zlepšení“ znamená nárůst, nebo pokles. GEQ má navíc podle Law et al. 2018 nepotvrzenou faktorovou strukturu (blok 9). Jeden žánr, plný text nedostupný. *Druhý pokus 13. 10. 2026 (sjednocovací kolo, V4):* plný text dál nedostupný (OUP i ScienceDirect za paywallem, repozitář Bolton bez plného textu, ResearchGate 403), n zůstává neznámé. Shrnutí ve výsledcích vyhledávání uvádějí, že se zapnutým zvukem byly pozitivní dimenze hodnoceny výš a negativní níž (napětí v tomto výčtu chybí). Jedno z nich mluví jen o pěti významných dimenzích (imerze, kompetence, pozitivní a negativní afekt, výzva), což odporuje abstraktu („všechny“). Citovaný text se nepodařilo přiřadit ke konkrétní práci, proto jde jen o neověřenou sekundární indicii, ne o ověření směru.
- **V — Tan, Baxa & Spackman 2010** [20]: n = 20, Zelda: Twilight Princess, 5 dní. **Výkon byl nejhorší bez zvuku**, lepší se zvukem z ovladače a ještě lepší se zvukem z ovladače i obrazovky. Překvapivě nejlepší byl s **nesouvisející hudbou**. *Omezení:* malý vzorek a složitá hra.
- **V — Klimmt et al. 2019** [21]: N = 68 (Assassin's Creed IV) a N = 59 (Alien: Isolation), jen mladí muži. Hudba zvyšuje požitek **nepřímo přes pozitivní emoce**. Zprostředkování přes prostorovou přítomnost nebo identifikaci s postavou se neprokázalo.
- **V/H — „juicy audio“ [17]:** rozhovory s 12 zvukovými designéry, tedy kvalitativní kvalitní studie (CHI PLAY 2024). Šťavnatost zvuku má tři faktory: **zdůraznění/zesílení, soudržnost s obrazem a synestezie**. Technicky jde o **plné frekvenční spektrum, silné basy a obálku s „ocasem“** (dozvuk). Šťavnaté zvuky se nesmí používat příliš často, jinak vzniká **únava z opakování**: „you have to make sure that there's no ear fatigue“. Proto je potřeba **variace** a „tiché momenty“, aby vynikly ty velké.
- **H [16]:** **soulad zvuku a obrazu**. Zpoždění mezi obrazem a zvukem zásahu působí nepřirozeně. To je jeden ze tří klíčových faktorů „impact feel“.
- **H [16]:** u často opakovaných akcí se střídá několik variant zvuku náhodně.
- **Mobilní realita (neověřeno):** citovaný údaj Appington/Amplify z roku 2013 říká, že ~73 % mobilních hráčů hraje s hlasitostí ≥ 10 %. Zbytek je fakticky ztlumen. **Původní zdroj se nepodařilo otevřít (403) a data jsou 13 let stará.** Pro nás z toho plyne, že **zvuk nesmí nést jedinou informaci** (GAG [32]: „Ensure no essential information is conveyed by sounds alone“).
- **Web Audio (technická fakta) [31d]:** `AudioContext` vytvořený mimo uživatelské gesto startuje ve stavu `suspended` a musí se spustit (`resume()`) až po interakci uživatele. Pro krátké zvuky se hodí buffery, pro procedurální zvuk `OscillatorNode` nebo vlastní buffer. U nás by gesto „podrž a pusť“ při prvním hodu přirozeně odemklo zvuk (**N**).
- **GAG [32]:** samostatné ovládání hlasitosti efektů a hudby (Basic). Zvuky klíčových událostí mají být navzájem odlišné.

### 2.8 Haptika (vibrace) na mobilu

- **V — Singhal & Schneider 2021** [15]: viz 2.2. Jakákoli vibrační ozdoba zlepšila prožitek a **nízká stačila**. Doporučuje se přesná synchronizace s obrazem a odlišné vzory pro různé události. *Omezení:* šlo o nativní aplikaci s kvalitním aktuátorem (desítky ms, různá ostrost). Webové `navigator.vibrate` umí jen zapnout a vypnout motor na zadanou dobu, bez řízení intenzity a ostrosti.
- **V — Kaaresoja et al. 2014** [22]: hmatová odezva na dotyk má přijít **do 5–50 ms**. Kvalita citelně klesá při 70–100 ms. Pozdní vibrace tedy působí hůř než žádná (**N**, extrapolace).
- **Technika (fakta) [31b], [31c]:**
  - `navigator.vibrate(ms | [vibrace, pauza, …])` vyžaduje **sticky activation**, tedy aspoň jednu předchozí interakci.
  - Specifikace stanoví maximální délku vzoru 10 položek a maximální trvání 10 000 ms. Prohlížeč smí vibrace omezit.
  - Podle caniuse k 13. 10. 2026 vibrace **nefungují v Safari na iOS** (žádná verze) ani ve Firefoxu pro Android. Fungují v Chrome pro Android a Samsung Internet.
  - Haptika proto může být jen **bonusová vrstva** pro část androidových hráčů, nikdy nositel informace.
- **GAG [32]:** přepínač nebo posuvník pro haptiku (Basic).

### 2.9 Vnímaná odezva a latence

| Zdroj | Úloha | Zjištění |
|---|---|---|
| Kaaresoja, Brewster & Lantz 2014 [22] (ACM TAP) | Stisk virtuálního tlačítka na mobilu, zpoždění 0–300 ms | Bod subjektivní současnosti: hmat ~5 ms, zvuk ~19 ms, obraz ~32 ms. Kvalita klesá u hmatu a zvuku při 70–100 ms, u obrazu při 100–150 ms. Při 300 ms jsou všechny modality horší. Doporučení (práh 75 % vnímané současnosti): **hmat 5–50 ms, zvuk 20–70 ms, obraz 30–85 ms**. Počet účastníků abstrakt neuvádí. |
| Ng et al. 2012 [23] (UIST) | Přímé dotykové tažení, zpoždění od ~1 ms | Běžné dotykové systémy mají 50–200 ms. Uživatelé silně preferují nižší latenci a znatelné zlepšení pokračuje **pod 10 ms**. |
| Deber et al. 2015 [24] (CHI) | Ťukání a tažení, přímý a nepřímý dotyk | Významný vliv typu úlohy i zařízení: ťukání snese víc než tažení. Rozlišitelný rozdíl latence (JND) na dotykovém displeji **69 ms při ťukání a 11 ms při tažení**, na touchpadu 96 a 55 ms. Zlepšení už o 8,3 ms je znatelné v širokém rozsahu výchozích latencí. *Čísla potvrzena plným textem v bloku 6 [3]* (N = 14 praváků, adaptivní schodová metoda). Jde o rozdíl mezi dvěma latencemi, ne o absolutní práh, a o *vnímání zpoždění odezvy*, ne o přesnost časování stisku. |
| Friston, Karlström & Steed 2016 [25] (IEEE TVCG) | Míření a vedení kurzoru | Výkon začíná trpět od **~16 ms** a efekt je nelineární |
| Long & Gutwin 2018 [26] (CHI PLAY) | Herní „atomy“ s různou rychlostí | Dřívější studie uvádějí prahy **50–500 ms**. Citlivost závisí na časových nárocích úlohy, rychlejší hry trpí dřív. Předpovědní model fungoval. |
| Halbhuber et al. 2023 [27b] (PACM HCI) | Střílečka, N = 36, tři perspektivy | Latence zhoršuje výkon i prožitek nezávisle na perspektivě |
| Raaen & Eg 2015 [27] (HCII) | Kliknutí mění směr rotace disku | Medián nastaveného „okamžitého“ zpoždění ~40 ms. Střed rozlišení okamžité × zpožděné ~148 ms. *Údaje ze shrnutí ve výsledcích vyhledávání, plný text neověřen.* |

**Přenositelnost:** Nabití a puštění u nás funguje jako **ťukání nebo uvolnění**, ne jako tažení. Prahy z [22] (obraz < ~85 ms) jsou proto nejrelevantnější. Webový řetězec (dotyková událost, `requestAnimationFrame`, kompozice, displej) sám spotřebuje desítky ms. Rezerva pro „zpoždění kvůli efektu“ (například hitstop před vizuálním potvrzením) je tedy malá. Potvrzení vstupu musí přijít **v nejbližším vykresleném snímku** a hitstop může nastat až po něm (**N**). QTE okna jsou citlivá na latenci podle [26]. Navazuje na blok 6.

### 2.10 Oslava úspěchu bez zahlcení

- **V:** Extrémní juice škodí [12]. Zesílení bez vazby na úspěch škodí [13]. Šťavnatost může snížit výkon (trend, nevýznamný) [8].
- **H:** Zpětná vazba má odpovídat důležitosti události (*Feedback Coherence*) [9] a má směrovat pozornost, ne ji dělit [9]. Šťavnaté zvuky potřebují tiché chvíle a variace [17].
- **H — Juul o Peggle [8]:** závěrečná sekvence Peggle („Ode to Joy“) oslavuje, i když hráč už ví, že vyhrál. To je typický příklad redundantní oslavy. Funguje jako vzácný vrchol, ne jako reakce na každý tah (**N**).
- **N:** Oslava má být odstupňovaná (běžný hod < osobní rekord < nové místo) a **přeskočitelná klepnutím**, protože se opakuje každý pokus. Nesmí zakrýt informaci, ze které se hráč učí (K1 v existující KB: „vidím, v čem se zlepšuji“).

### 2.11 Přístupnost

- **WCAG 2.3.1 (A)** [30a]: maximálně 3 záblesky za sekundu, nebo plocha pod prahem. U červené platí přísnější „red flash“.
- **WCAG 2.3.3 (AAA)** [30b]: pohybovou animaci vyvolanou interakcí jde vypnout, pokud není nezbytná. Paralaxa je výslovně uvedena. Technikou je C39 (`prefers-reduced-motion`) a SCR40 pro JS.
- **MDN** [31a]: `prefers-reduced-motion: reduce` vyjadřuje přání odstranit, omezit nebo nahradit pohybové animace. Spouštěči jsou škálování a posun velkých objektů.
- **GAG** [32]: vyhnout se blikání a opakujícím se vzorům (Basic). Možnost vypnout pohyb pozadí (Intermediate). Přepínač haptiky (Basic). Oddělená hlasitost (Basic). Žádná podstatná informace jen zvukem (Basic). Odlišné zvuky pro klíčové události.
- **Stav hry:** Při reduced motion se prostředí zastaví (`anim=0`) a herní zpětná vazba zůstává. Podle `CLAUDE.md` je ale reduced motion „jen částečné“. Paralaxa letu je přesně typ pohybu, který 2.3.3 jmenuje.

---

## 3. Rozpory a otevřené otázky

1. **Zlepšuje juice výkon, nebo ho zhoršuje?** U Kao 2020 [12] střední a vysoký juice výkon zlepšil. U Juul & Begy [8] trend ukazoval na horší výkon. U Hicks 2019b [11] podle shrnutí [17] neměl na výkon vliv. Pravděpodobně záleží na tom, zda efekty nesou informaci o stavu (pomáhají), nebo jen dělí pozornost (škodí). To je ale zatím **interpretace, ne test**.
2. **„Zesílení“ škodilo (Kao 2024) × „vysoký juice“ pomohl (Kao 2020).** *Vyřešeno plným textem Kao 2024 (rozpor R-I2).* Podmínka „zesílení“ v roce 2024 nebyla „víc juice“, ale juice **oddělený od úspěchu**: přehnané efekty zásahu se spouštěly i při máchnutí do prázdna, takže efekt akce přehlušil zpětnou vazbu zásahu a zabití. Proti ní stála standardní zpětná vazba, která byla na zásah vázaná (zvuk zásahu, zmizení nepřítele). Studie tedy netestovala množství efektů, ale ztrátu vazby efektu na výsledek. Autoři sami uvádějí, že podmínka porušila zásady jednoznačnosti a koherence zpětné vazby (Hicks 2018 [9]). Kao 2020 naproti tomu měnil celkovou intenzitu, pravděpodobně při zachované vazbě na akce (detaily „extrémní“ úrovně stále neověřeny). Obě zjištění si tedy neodporují. Závěr: **odstupňování podle úspěchu je robustnější než celková síla efektů** a efekt samotné akce nesmí přebít efekt úspěchu.
3. **Kde přesně je hranice „extrému“?** Žádná studie ji neudává v parametrech (délka, amplituda, počet částic). Úrovně jsou vždy relativní k jedné hře.
4. **Otřes a kinetóza ve 2D:** Hranice jsou známé jen z doporučení přístupnosti a z VR výzkumu. Pro 2D na mobilu chybí data.
5. **Krátkodobé × dlouhodobé:** Všechny studie trvaly minuty. Únava z efektů po desítkách pokusů (typické pro náš smyčkový žánr) není změřena. Opírá se o ni jen výpověď zvukových designérů [17].
6. **Hitstop mimo bojové hry:** Účinek hitstopu na „pocit zásahu“ dokládá jen korelace u bojových her [16]. U QTE v letové arkádě je to analogie.
7. **Zvuk vypnutý u části mobilních hráčů:** Aktuální spolehlivá data chybí a údaj z roku 2013 je neověřený. Zvuk může být nejsilnější kanál [19], [20] a zároveň chybět velké části publika.
8. **Haptika na webu:** Je výzkumně podpořená [15], ale technicky omezená na Android. Webové `vibrate` bez řízení intenzity neodpovídá podmínkám studie.
9. **Swinkovy prahy 100 ms / 240 ms** jsou v oboru rozšířené, ale v originále je nemám ověřené. Empirické prahy [22]–[27] se pohybují od jednotek ms (tažení) po ~150 ms (ťukání a hodnocení kvality).

---

## 4. Relevance pro Just Throw It — kandidátní implikace (N)

Vše v tomto oddílu je **N**: kandidáti k prototypu a hráčskému testu, ne doporučení. Společné principy:
- **(a)** efekt má odstupňovat kvalitu výkonu [13], [9]. Po ověření [13] silnější opora: efekt samotného vstupu (nabití, vypuštění) má být slabší než efekt úspěchu a nesmí ho překrýt. Autoři navrhují (netestováno) intenzitu úměrnou obtížnosti dosaženého výsledku;
- **(b)** potvrzení vstupu přichází v nejbližším snímku [22];
- **(c)** každý kanál (otřes, zvuk, vibrace) má přepínač a reduced motion má náhradu, ne jen vypnutí [30], [32];
- **(d)** informace nikdy jen ve zvuku nebo vibraci [32];
- **(e)** celá oslava je přeskočitelná.

### 4.1 Nabíjení (podržení, cyklický ukazatel síly)
- Nabíjení je „spring-locked mode“, jehož úkolem je **anticipace** [2]. Kandidáti:
  - mírné stlačení vlaštovky nebo ruky úměrné síle (squash);
  - jemné přiblížení kamery o jednotky procent;
  - **tón, jehož výška sleduje ukazatel síly** (Web Audio oscilátor, procedurálně).
- Cyklický ukazatel tím dostane druhý kanál. Hráč může časovat i sluchem, ale vizuál zůstává primární [32].
- Riziko: neustále znějící tón unavuje [17]. Zvážit tichou obálku a krátký „tik“ v nejvyšším bodě.

### 4.2 Vypuštění
- V **tomtéž snímku** jako uvolnění:
  - protažení vlaštovky (stretch) ve směru hodu;
  - odhoz kamery proti směru hodu. Nuclear Throne používá 6 px při 320×240 [5], u nás tedy zhruba 10–12 px (měřítko), s rychlým útlumem;
  - „švih“ s výškou nebo hlasitostí podle síly.
- Zvážit odstupňování podle přesnosti nabití: silný hod znamená výraznější efekt (*Feedback Coherence* [9]).
- Vypuštění je obdoba „máchnutí mečem“ v Kao 2024 [13]: akce, ne úspěch. Jeho efekt má zůstat menší než efekt perfektního QTE a dopadu, jinak hrozí „zlevnění“ úspěchu, které ve studii snížilo kompetenci.
- **Hitstop až po vizuálním potvrzení, ne před ním** [22].

### 4.3 Let a pocit rychlosti
- Rychlost nese paralaxa. Kandidáti:
  - rychlostní čáry nebo stopa vlaštovky (permanence [2]);
  - mírné oddálení kamery při vysoké rychlosti;
  - posun vlaštovky z centra proti směru letu, aby bylo vidět víc dopředu (lookahead, **N** bez ověřeného parametru);
  - šum větru, jehož hlasitost a výška tónu sledují rychlost.
- **Reduced motion:** paralaxa je výslovný vestibulární spouštěč [30b]. Kandidáti jsou výrazně zpomalené nebo zastavené vzdálené vrstvy a rychlost vyjádřená číslem nebo čárami. To navazuje na známý problém „reduced motion jen částečné“.

### 4.4 QTE a perfektní zásah
- Odstupňování: **perfektní, dobré a minuté** musí vypadat i znít jinak [13], [16]. Kandidát pro perfektní zásah:
  - krátké zmrazení nebo zpomalení zhruba 3–5 snímků (~50–80 ms). Pásmo leží mezi Nuclear Throne (10–20 ms) a lehkým úderem v Guilty Gear (7 snímků) [5], [16];
  - bílý záblesk vlaštovky na 1–2 snímky, **lokální, ne přes celou obrazovku**, a nejvýš 3× za sekundu [30a];
  - vyšší a „plnější“ zvuk s basem a dozvukem [17];
  - krátká vibrace 10–20 ms na Androidu [15], [22].
- Dobrý zásah dostane jen část těchto prvků. Minutí dostane neutrální, ne trestající signál.
- **Hitstop musí pozastavit i časování dalších QTE oken**, jinak změní balanc (blok 6, `simulation/QTE-BALANCE.md`).
- Časovací kruh: při perfektním zásahu vlna rozšiřující se z kruhu (částice). Sakurai: vibrace s klesající amplitudou [28].

### 4.5 Dopad
- Otřes úměrný dopadové rychlosti (model traumatu: malé dopady téměř nic, velké znatelně [6], **neověřeno v originále**). Otřes **svisle**, protože jde o dopad na zem [16], [28], s rychlým útlumem.
- Prach nebo jiskry, krátký hutný „žuchnutí“ zvuk.
- Při reduced motion nahradit otřes krátkým lokálním zábleskem nebo zvukem.
- Zvážit, zda dopad nemá být spíš tichý a krátký, aby vynikla výplata. Šťavnatý zvuk potřebuje tiché momenty [17].

### 4.6 Výplata mincí
- Mince letí k počítadlu (permanence a směrování pozornosti [9]). Hodnota se načítá tweenem a tikání stoupá ve výšce tónu, **s variacemi**, aby neunavovalo [16], [17]. Náhodné variace zvuku mají podle [13] nanejvýš malý vliv na zábavu (0,11) a zvědavost nezvyšují. Jsou tedy prevence únavy, ne zdroj motivace.
- **Klepnutí přeskočí na konečný stav.**
- Velikost oslavy podle významu: běžný pokus je krátký. Osobní rekord nebo nové místo dostane vrchol à la Peggle [8], ale vzácně.
- Hlídat, aby oslava nepřekryla údaje, ze kterých se hráč učí (vzdálenost, výsledek QTE, nápověda úhlu: K1).
- Mince zatím nemají využití. Oslava mince nezhodnotí, když za nimi není smysl (blok 3). Juice nenahrazuje progresi [14].

### 4.7 Co měřit v prvním testu (kandidáti)
- Varianty A/B na úrovni hráče:
  - bez zvuku × se zvukem;
  - efekty vázané na úspěch × efekty stejné pro každou akci (nižší priorita: tento kontrast už s velkým vzorkem otestoval Kao 2024 [13]);
  - „střední“ × „extrémní“ intenzita.
- Měřit:
  - porozumění („podle čeho jsi poznal dobrý zásah?“, otázka 2 v existující KB);
  - přesnost QTE (výkon může juice snížit [8]);
  - subjektivní hodnocení včetně zvědavosti, ne jen zábavy, a počet dobrovolných hodů. V [13] dobu hraní předpovídala zvědavost, ne hlášená zábava;
  - nevolnost a nepohodlí u paralaxy a otřesu.

---

## 5. Registr zdrojů

Hodnocení: **A** recenzovaný experiment s dostatečným vzorkem · **B** recenzovaná menší nebo kvalitativní studie či přehled · **C** praxe oboru (přednáška, kniha, kód hry) · **D** technická dokumentace nebo norma · **neověřeno** = původní zdroj jsem neotevřel nebo údaj nemám z primárního zdroje.

1. **Swink, S. (2008/2009).** *Game Feel: A Game Designer's Guide to Virtual Sensation.* Morgan Kaufmann. Kniha, **C**. Definice ověřena citací v [2] a [8]. Prahy 100/240 ms jen sekundárně (slajdy Univ. Bayreuth „GxD 07 Interfaces“, https://medienwissenschaft.uni-bayreuth.de/wp-content/uploads/GxD-07-Interfaces.pdf), **neověřeno v originále**.
2. **Pichlmair, M., & Johansen, M. (2021).** Designing Game Feel: A Survey. *IEEE Transactions on Games.* DOI 10.1109/TG.2021.3072241. Preprint https://arxiv.org/abs/2011.09201. Přehled >200 zdrojů, **B** (taxonomie, ne metaanalýza).
3. **Jonasson, M., & Purho, P. (2012).** Juice It or Lose It. GDC Europe, Independent Games Summit. https://www.gdcvault.com/play/1016487/Juice-It-or-Lose. Přednáška, **C** (vlivná ukázka, bez měření).
4. **Nijman, J. W. (2013).** The Art of Screenshake. INDIGO Classes 2013. https://www.youtube.com/watch?v=AJdEqssNZ-U. Přednáška, **C**. Seznam triků jen z osnovy třetí strany, **částečně neověřeno**.
5. **Smith, G. (2013).** Interview: Jan Willem Nijman on Nuclear Throne's feel. *Rock Paper Shotgun*, 21. 10. 2013. Ověřeno přes citaci: Armitage, T. (2013), *Making Game „Feel“*, https://infovore.org/?p=5275. Konkrétní parametry hry, **C**. Originál RPS nešel otevřít. Citace u Armitage (10–20 ms, odhoz 6 px, „add 4 to the screenshake“, nábojnice 2–4 px/snímek při 30 fps a 320×240) znovu ověřena 13. 10. 2026.
6. **Eiserloh, S. (2016).** Math for Game Programmers: Juicing Your Cameras With Math. GDC 2016. https://www.gdcvault.com/play/1023557/Math-for-Game-Programmers-Juicing. **C**. Téma ověřeno, model „trauma“ jen z implementací (např. https://bevy.org/examples/camera/2d-screen-shake/), **neověřeno v originále**.
7. **Kelly, F. (2014).** Don't Juice It or Lose It. GDC Europe, IGS. Zpráva: https://www.gamedeveloper.com/design/video-indies-resist-the-urge-to-juice-it-or-lose-it-. **C** (protiargument, jen zpráva o přednášce).
8. **Juul, J., & Begy, J. S. (2016).** Good Feedback for bad Players? A preliminary Study of „juicy“ Interface feedback. Proc. 1st joint FDG/DiGRA, Dundee. https://www.jesperjuul.net/text/juiciness.pdf. Poster, N = 46, **B−** (malý vzorek, nevýznamné výsledky, autoři sami: „preliminary“). Plný text přečten.
9. **Hicks, K., Dickinson, P., Holopainen, J., & Gerling, K. (2018).** Good Game Feel: An Empirically Grounded Framework for Juicy Design. DiGRA 2018. DOI 10.26503/dl.v2018i1.936. https://dl.digra.org/index.php/dl/article/download/936/936. Dotazník 17 vývojářů a analýza 2 her, **B**. Plný text přečten.
10. **Hicks, K., Gerling, K., Dickinson, P., & Vanden Abeele, V. (2019).** Juicy Game Design: Understanding the Impact of Visual Embellishments on Player Experience. CHI PLAY '19, 185–197. DOI 10.1145/3311350.3347171. Experimenty n = 40 a n = 32, **B**. Ověřen abstrakt (znovu 13. 10. 2026) a podrobné shrnutí výsledků v plném textu [13]. Plný text nedostupný (ACM 403, záznam v repozitáři KU Leuven bez souboru).
11. **Hicks, K., Gerling, K., Richardson, G., Pike, T., Burman, O., & Dickinson, P. (2019).** Understanding the effects of gamification and juiciness on players. IEEE CoG 2019. **B**, **neověřeno** (jen shrnutí v [17]).
12. **Kao, D. (2020).** The effects of juiciness in an action RPG. *Entertainment Computing* 34, 100359. DOI 10.1016/j.entcom.2020.100359. Online experiment N = 3 018, **A** (jeden žánr). Ověřen abstrakt (znovu 13. 10. 2026 přes záznam Semantic Scholar, licence CC BY) a sekundární shrnutí [2], [13], [16], [17]. Plný text na ScienceDirect vrací 403. Obsah úrovně „extrémní“ neověřen.
13. **Kao, D., Ballou, N., Gerling, K., Breitsohl, H., & Deterding, S. (2024).** How does Juicy Game Feedback Motivate? Testing Curiosity, Competence, and Effectance. CHI '24. DOI 10.1145/3613904.3642656. Předregistrovaný experiment n = 1 699, **A**. **Plný text ověřen 13. 10. 2026**: https://spiral.imperial.ac.uk/bitstreams/c6f924d7-1d28-43e6-809f-d317846940c2/download. Hodnocení A sjednoceno s blokem 1 (rozpor R21).
14. **Meiners, A.-L., Rich, D. (Damian), Hicks, K., Alexandrovsky, D., & Gerling, K. (2025).** Lushness in Game Design: The Role of Non-Interactive Visual Embellishments in Player Experience. FDG 2025. DOI 10.1145/3723498.3723720. n = 31, **B−** (sjednoceno s 02 [27]). Ověřen abstrakt, jména autorů ověřena v repozitáři Staffordshire (02 [27]).
15. **Singhal, T., & Schneider, O. (2021).** Juicy Haptic Design: Vibrotactile Embellishments Can Improve Player Experience in Games. CHI '21. DOI 10.1145/3411764.3445463. Projektová stránka https://uwaterloo.ca/haptic-experience-lab/projects/juicy-haptic-design-vibrotactile-embellishments-can-improve. n = 38 (within), **B**. Ověřen abstrakt a projektová stránka.
16. **Lin, Z., Duan, H., Wen, Z. A., & Cai, W. (2022).** What Features Influence Impact Feel? A Study of Impact Feedback in Action Games. IEEE GEM 2022. DOI 10.1109/GEM56474.2022.10017782. https://arxiv.org/abs/2208.06155. Korelační NLP analýza a srovnání 8 + 8 her, **B−**. Plný text přečten.
17. **Hicks, K., Rogers, K., Gerling, K., & Nacke, L. E. (2024).** Juicy Audio: Audio Designers' Conceptualization of the Term in Video Games. *Proc. ACM HCI* 8 (CHI PLAY). DOI 10.1145/3677084. https://eprints.staffs.ac.uk/8527/1/3677084.pdf. Rozhovory s 12 designéry, **B** (kvalitativní). Plný text přečten.
18. **Smets, J., & van der Spek, E. D. (2021).** That Sound's Juicy! Exploring Juicy Audio Effects in Video Games. ICEC 2021 (LNCS). DOI 10.1007/978-3-030-89394-1_24. n = 61, **B**. Abstrakt ověřen 13. 10. 2026 (https://research.tue.nl/en/publications/that-sounds-juicy-exploring-juicy-audio-effects-in-video-games/), plný text vrátil 403. Velikost vzorku a „střední efekt“ jen ze shrnutí v [17].
19. **Nacke, L. E., Grimshaw, M. N., & Lindley, C. A. (2010).** More than a feeling: Measurement of sonic user experience and psychophysiology in a first-person shooter game. *Interacting with Computers* 22(5). DOI 10.1016/j.intcom.2010.04.005. Experiment 2×2, **B−** (sníženo z B: neznámé n, směr efektů z abstraktu nejasný, nástroj GEQ s nepotvrzenou strukturou). Abstrakt znovu ověřen 13. 10. 2026 (https://ub-ir.bolton.ac.uk/esploro/outputs/journalArticle/More-than-a-feeling-Measurement-of/999710108841), plný text v repozitáři není, velikost vzorku neověřena. Druhý pokus (sjednocovací kolo): s. 336–343, plný text nedostupný (OUP, ScienceDirect, ResearchGate), směr efektů jen z nepřiřazených sekundárních shrnutí (pozitivní dimenze výš, negativní níž), n neznámé. Hodnocení B− beze změny.
20. **Tan, S.-L., Baxa, J., & Spackman, M. P. (2010).** Effects of Built-in Audio versus Unrelated Background Music on Performance in an Adventure Role-Playing Game. *IJGCMS* 2(3). DOI 10.4018/jgcms.2010070101. n = 20, **B−**. Ověřen abstrakt.
21. **Klimmt, C., Possler, D., May, N., Auge, H., Wanjek, L., & Wolf, A.-L. (2019, online 2018).** Effects of soundtrack music on the video game experience. *Media Psychology.* DOI 10.1080/15213269.2018.1507827. N = 68 + 59, **B** (jen mladí muži). Ověřen abstrakt.
22. **Kaaresoja, T., Brewster, S., & Lantz, V. (2014).** Towards the temporally perfect virtual button: touch-feedback simultaneity and perceived quality in mobile touchscreen press interactions. *ACM Trans. Applied Perception* 11(2), čl. 9. DOI 10.1145/2611387. https://eprints.gla.ac.uk/104653. **A−** (vzorek neověřen). Ověřen abstrakt s doporučenými rozsahy (znovu 13. 10. 2026, doplněny body subjektivní současnosti). Plný text v Enlighten není.
23. **Ng, A., Lepinski, J., Wigdor, D., Sanders, S., & Dietz, P. (2012).** Designing for low-latency direct-touch input. UIST '12. DOI 10.1145/2380116.2380174. **B**. Ověřen abstrakt.
24. **Deber, J., Jota, R., Forlines, C., & Wigdor, D. (2015).** How Much Faster is Fast Enough? User Perception of Latency & Latency Improvements in Direct and Indirect Touch. CHI '15. DOI 10.1145/2702123.2702300. **B**. Plný text ověřen v bloku 6 [3]: N = 14, JND 69 / 11 ms přímý dotyk, 96 / 55 ms touchpad potvrzeny. Měří vnímání zpoždění, ne přesnost časování.
25. **Friston, S., Karlström, P., & Steed, A. (2016).** The Effects of Low Latency on Pointing and Steering Tasks. *IEEE TVCG.* DOI 10.1109/TVCG.2015.2446467. **B**. Ověřen abstrakt.
26. **Long, M., & Gutwin, C. (2018).** Characterizing and Modeling the Effects of Local Latency on Game Performance and Experience. CHI PLAY '18. DOI 10.1145/3242671.3242678. **B**. Ověřen abstrakt.
27. **Raaen, K., & Eg, R. (2015).** Instantaneous Human-Computer Interactions: Button Causes and Screen Effects. HCI International 2015 (LNCS). DOI 10.1007/978-3-319-21006-3_47. **B**, číselné údaje **neověřeny** (jen shrnutí ve výsledcích vyhledávání).
    - **27b. Halbhuber, D., Schauhuber, P., Schwind, V., & Henze, N. (2023).** The Effects of Latency and In-Game Perspective on Player Performance and Game Experience. *Proc. ACM HCI* (CHI PLAY). DOI 10.1145/3611070. N = 36, **B**. Ověřen abstrakt.
28. **Sakurai, M. (2015).** Sloupek ve Famitsu č. 490 o hitstopu. Fanouškovský překlad: Source Gaming, https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/. **C** (autorita žánru, neoficiální překlad).
29. **SmashWiki: Hitlag.** https://www.ssbwiki.com/Hitlag. Komunitně zjištěné vzorce z kódu her, **C**.
30. **W3C (2023), WCAG 2.2 Understanding:**
    - (a) SC 2.3.1 Three Flashes or Below Threshold, https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html;
    - (b) SC 2.3.3 Animation from Interactions, https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html.
    - Norma, **D**.
31. **Technická dokumentace, D:**
    - (a) MDN, prefers-reduced-motion, https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion;
    - (b) MDN, Vibration API, https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API, a W3C Vibration API (specifikace), https://w3c.github.io/vibration/;
    - (c) caniuse, Vibration API, https://caniuse.com/vibration (stav ke 13. 10. 2026);
    - (d) MDN, Web Audio API best practices, https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices, a MDN, Autoplay guide, https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay.
32. **Game Accessibility Guidelines** (Ellis et al., průběžně aktualizováno). https://gameaccessibilityguidelines.com/full-list/. Oborová doporučení, **C/D**.
33. **Appington / Amplify (2013)**, údaj „73 % mobilních hráčů hraje s hlasitostí ≥ 10 %“. Zprávy TouchArcade a Destructoid (https://toucharcade.com/2013/11/05/73-of-mobile-gamers-play-with-the-sound-on/) vrátily 403. **Neověřeno**, uvedeno jen jako upozornění.

**Počet zdrojů:** 33 položek (34 včetně 27b). Z toho 22 akademických prací (6 s přečteným plným textem po ověřovacím kole, ostatní jen abstrakt) a 11 praxe nebo dokumentace.

---

## Ověřovací kolo 13. 10. 2026

Ověřeno: Kao et al. 2024 [13] (plný text), Kao 2020 [12] (abstrakt přes záznam s DOI), Hicks et al. 2019 [10] (abstrakt a shrnutí v plném textu [13]), Nacke et al. 2010 [19] (abstrakt v repozitáři), Kaaresoja et al. 2014 [22] (abstrakt v repozitáři), Smets & van der Spek 2021 [18] (abstrakt), Deber et al. 2015 [24] (čísla sekundárně, později plný text v 06 [3]), Smith/Armitage [5] (citace). Kód: počet QTE na let v `events.js` a `simulation/MONTE-CARLO.md`.

Změny:
- **Rozpor Kao 2020 × Kao 2024 vyřešen (R-I2, §3 bod 2):** „zesílení“ v roce 2024 znamenalo efekty oddělené od úspěchu, které přehlušily zásah, ne „víc juice“. Upraveno klíčové zjištění 1, tabulka v §2.2 a princip (a). Do §4.2 přidáno, že efekt vypuštění má zůstat slabší než efekt úspěchu.
- **Kao 2024:** doplněny koeficienty, doby hraní (6,2 proti 10,2 min) a nález, že náhodná variabilita nezvýšila zvědavost (§2.2, §4.6). Hlášená zábava dobu hraní nepředpovídala, proto se v testu (§4.7) má měřit i zvědavost a počet dobrovolných hodů. Hodnocení A sjednoceno s blokem 1 (R21).
- **Nacke 2010 (oslabeno):** „zvuk zlepšil všechny dimenze GEQ“ změněno na „významný hlavní efekt“, protože abstrakt neuvádí směr ani n a GEQ má nepotvrzenou strukturu. Hodnocení B → B−. Klíčové zjištění 4 přeformulováno: zvuk zůstává pravděpodobně největší mezerou, ale opora je střední.
- **Kaaresoja 2014:** potvrzeno. Doplněny body subjektivní současnosti a význam doporučených rozsahů (práh 75 %). n stále neznámé.
- **Hicks 2019:** doplněno ze shrnutí v [13]: bez vlivu na výkon a použitelnost, zvědavost, kompetence a imerze jen v jedné ze tří her.
- **Deber 2015 (R22):** čísla JND doplněna a označena jako sekundární. *Sjednocení (R24):* plný text ověřil blok 6 [3] (N = 14), čísla potvrzena. Úroveň ověření v §2.9 a registru převzata z 06.
- **Počet QTE (R7):** „1–3 QTE“ opraveno: až 10 událostí na let, průměrně asi 3.
- **Kao 2020:** úrovně None / Medium / High / Extreme potvrzeny v abstraktu. Obsah „extrémní“ úrovně zůstává neověřený.

**Doplněk (sjednocovací kolo 13. 10. 2026):** Nacke 2010 (V4) podruhé: plný text nedostupný, n neznámé, směr jen z nepřiřazených sekundárních shrnutí (viz §2.7 a registr [19]). Meiners [14] opraven na „Rich“ a B− (R23), Deber [24] převzal stav plného textu z 06 [3] (R24), hlavička sjednocena (R36).

Zůstává neověřeno: plné texty Kao 2020, Hicks 2019, Nacke 2010 (n a směr efektů; dostupné jen přes knihovní přístup), Kaaresoja 2014 (n), Smets 2021 (n a velikost efektu), Tan 2010 a Singhal & Schneider 2021 jen v abstraktu, Appington 2013, Swinkovy prahy.

Poznámka mimo rozsah ověření: podle aktuálního `CLAUDE.md` mezitím v kódu vznikly `juice.js` a `fx-render.js` (hitstop 50 / 90 / 120 ms pro úspěch / perfektní zásah / dopad, otřes podle traumatu, squash & stretch). Zvuk a vibrace v kódu stále nejsou. Části §4 jsou tedy už zčásti realizované. Blok tím neaktualizuji, jen upozorňuji.
