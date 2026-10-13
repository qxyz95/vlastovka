# Blok 3 — Progrese a ekonomika žánru „launch & upgrade“

- **Blok:** 3 z 9 (viz [00-temata.md](../00-temata.md))
- **Datum rešerše:** 13. 10. 2026
- **Stav:** první verze rešerše, po ověřovacím kole 13. 10. 2026 (změny viz oddíl „Ověřovací kolo 13. 10. 2026“ na konci). Nejde o doporučení, jen o podklad.
- **Navazuje na:** [KB zabavnost a motivace.md](<../../KB zabavnost a motivace.md>) (K1 „vidím, v čem se zlepšuji“, K2 „moje volba něco mění“, K7 „vracím se k jiné výzvě“; oddíl 4 o 500 m). Teorii sebeurčení (SDT) a GameFlow zde neopakujeme.
- **Herní data:** [src/config.js](../../src/config.js) (verze 0.6.1), [simulation/MONTE-CARLO.md](../../simulation/MONTE-CARLO.md).

Štítky: **V** výzkumný poznatek · **H** heuristika / praxe oboru · **N** naše hypotéza. Čísla v hranatých závorkách odkazují do registru zdrojů (oddíl 6).

---

## 1. Klíčová zjištění v kostce

1. **V — Motivace roste s blízkostí cíle a po jeho dosažení prudce klesá.** V terénní studii kavárenského věrnostního programu se intervaly mezi nákupy zkracovaly o 20 % od prvního k poslednímu razítku; po získání odměny aktivita „resetuje“ na nižší úroveň a riziko odchodu je nejvyšší právě těsně po cíli (na webu s hodnocením písní 17 % všech ukončení návštěv připadlo na okamžik hned po dosažení odměny) [9]. Pro nás: okamžik 500 m je zároveň nejrizikovější okamžik celé hry.
2. **V — Iluze náskoku urychluje dokončení.** Karta na 12 razítek se 2 razítky „zdarma“ byla dokončena v průměru za 12,7 dne proti 15,6 dne u běžné karty na 10 razítek (≈ 20 % rychleji) [9]; Nunes a Drèze popisují stejný „efekt obdarovaného pokroku“ [10]: v terénním experimentu v myčce (300 karet) dokončilo kartu „10 razítek, 2 předem“ 34 % zákazníků proti 19 % u karty „8 razítek, 0 předem“ (ověřeno v plném textu). Podle jejich třetí studie (hypotetické scénáře) ale funguje stejně dobře *jakékoli* zdůvodnění náskoku, i zjevně účelové.
3. **H — Kanonická ekonomika inkrementálních her: cena roste exponenciálně (typicky ×1,07–1,15 za kus), výnos lineárně, a skoky multiplikátorů dočasně vrací hráče „před křivku“** [1][4][5]. Naše hra je jiný případ: krátký strom 3 × 5 úrovní s polynomiální cenou (≈ 35 · n^1,55) a pevným koncem. Idle matematiku tedy nelze převzít, jen její princip „rytmu stěn a průlomů“.
4. **H — Žánr „launch & upgrade“ má téměř vždy konečný příběhový cíl a po něm „něco navíc“.** Learn to Fly 1: 6 000 stop, pak lze pokračovat [18]; Learn 2 Fly: příběh + Classic + Arcade s pevným rozpočtem + bonusový obchod přenášený mezi hrami [19]; Learn to Fly 3: příběh do vesmíru + Payload + Classic + Sandbox, 100+ dílů [20][21]; Burrito Bison Revenge: po posledním zdi nekonečná úroveň bez tření [23]. Prázdný konec (LtF1 „smutný“ konec, BB Revenge „ani poplácání po zádech“) recenze a hráči opakovaně kritizují [18][23].
5. **H — Délka „hlavního cíle“ v žánru je desítky hodů.** Hráči LtF1 hlásí 11–89 „dní“ (1 den = 1 hod), většinou 14–35 [18]; Learn 2 Fly příběh 15–87 dní [19]. To se překrývá s naším Monte Carlo (průměrný hráč 23 hodů, P10–P90 15–33). Délka sama tedy není problém; problém je, co následuje.
6. **H — Vertikální progrese (rostoucí čísla) zamlžuje, zda se zlepšil hráč, nebo postava** [14]; Schreiber formalizuje vnímanou obtížnost jako (výzva dovednosti + výzva síly) − (dovednost hráče + síla postavy), takže dovednost a vylepšení jsou zaměnitelné [12]. V launch hrách si hráči stěžují, že výsledek „je hlavně štěstí“ [22][23] a že optimální strategie degeneruje („prostě leť rovně nahoru“) [20].
7. **H — Smysluplná volba vyžaduje, aby žádná možnost nebyla zjevně lepší, aby měla důsledky a aby hráč tušil, co způsobí** [16][17]. Naše simulace ukazuje přesně opačné riziko: „přehyby napřed“ je o 60–100 % pomalejší strategie a rovnoměrný nákup vítězí [lokálně MONTE-CARLO.md].
8. **H — Prestiž (reset za trvalý bonus) je v inkrementálních hrách standardní odpověď na „konec křivky“;** výnos prestiže se volí jako odmocnina či nižší mocnina výdělku, takže zdvojnásobit bonus vyžaduje 3–4× (AdVenture Capitalist), ~8× (Cookie Clicker) až ~128× (Egg, Inc.) výkonu předchozího běhu [3]. Pravidlo palce: hráč resetuje, když by získal +50 až +200 % prestižní měny [4]. Výzkum přínosu prestiže pro hráče jsme nenašli.
9. **V/H — Idle hry jsou samostatná kategorie (66 her v taxonomii, CHI 2018):** posouvají hráče „od hraní k plánování“ a odměňují čekání [6]; návrháři je popisují jako původně parodii na grind [7]; novější kritika upozorňuje, že touha po neustálém pokroku se snadno zpeněží [8]. Pro aktivní dovednostní hru jsou relevantní jen částečně.

---

## 2. Podrobné sekce

### 2.1 Žánr „launch & upgrade“: co se dá ověřit

Žánr vznikl ve flashových portálech kolem roku 2008–2012. Jeho smyčka je stejná všude: **vystřel → (částečně) ovládej let → získej peníze podle doletu/výšky/rychlosti → kup vylepšení → znovu**. Autorské postmortemy jsou vzácné. Juicy Beast měli na Casual Connect 2011 přednášku „Burrito Bison Postmortem – Designing for Two Markets at Once“ (Yowan Langlais a Dominique Lemire-Nault; název a video ověřeny na tiskové stránce studia [28]). Obsah jsme neověřili, protože k videu není přepis. Hlavním zdrojem jsou proto dobové recenze (JayIsGames, GamesBeat), obchodní stránky a komentáře hráčů. **Hodnocení kvality:** recenze jsou H nízké až střední kvality. Komentáře hráčů jsou anekdoty, ale opakující se vzorce (stížnost na konec, na štěstí, na grind) považujeme za užitečný signál.

#### Srovnávací tabulka

| Hra (rok, autor) | Cíl / konec | Vylepšení (počet, typ) | Délka do cíle | Co po cíli | Kritika (zdroj) |
|---|---|---|---|---|---|
| **Learn to Fly** (2009, Light Bringer Games) [18] | dolet 6 000 stop; hra počítá „dny“ (1 den = 1 hod) a na konci hodnotí jejich počet | 6 kategorií: výška rampy, akcelerace, odpor vzduchu, kluzák, rakety, palivo; peníze za výšku a dolet, čas letu násobí odměnu 1–3× | recenzent 17 dní, hráči 11–89, většinou 14–35 | lze „pokračovat“; achievementy odemykají vyšší rampy a vyplácejí peníze | „smutný“ konec (náraz do ledovce), povinné nákupy, „chci jen létat, překáží mi UI“, nepamatuje si postup |
| **Learn 2 Fly** (2011, Light Bringer) [19][26] | příběh: prorazit ledovou stěnu; tajný alternativní konec (přeletět zeď) | rampa (délka, výška), palivo; sáňky, kluzáky, boostery, náklad; bonusový obchod za body z výzev, **přenáší se mezi hrami**; větvené cesty vylepšení | hráči 15–87 dní příběhu | Classic (co nejdál), **Arcade se 3 pevnými rozpočty** (nejlepší skóre za daný budget), medaile včetně 8 tajných | vágní nápovědy k medailím; plný bonusový obchod vyžaduje grind |
| **Learn to Fly 3** (2016, Light Bringer; F2P na Steamu) [20][21] | příběh: dostat se do vesmíru (recenze JIG uvádí Měsíc) | 100+ dílů: 24 stupňů, 18 odpalovačů, 24 boostů, 23 těl, každý vícekrát vylepšitelný; materiálové sloty, hmotnost | „mnoho hodin“; 94 % kladných z ~9 300 recenzí (Steam) | Payload, Classic, Sandbox (změna fyzikálních konstant), balíčky odemčení, karty | „velmi grindy“; přehlcení volbami; dominantní strategie „leť rovně nahoru“ |
| **Burrito Bison** (2011, Juicy Beast) [22] | utéct z Candylandu přes poslední zeď | power-upy a vylepšení za peníze z rozdrcených postaviček; omezený body-slam dobíjený během letu | neuvedeno | — | „trvá dlouho, než máš pocit, že se někam dostáváš“; grind a opakování, vyvažované aktivním klikáním; hráči chtějí ukazatel vzdálenosti a nekonečný režim |
| **Burrito Bison Revenge** (2012, Juicy Beast) [23] | trezor, pak „End of Candyland“ betonová zeď; bossové | rakety, auta, body-slamy, achievementy; „na vylepšení všeho je potřeba asi 5 milionů“ (komentář) | hráč s rekordem ~10 000 km/h „ještě není v polovině“ | po zdi nekonečná úroveň bez tření, rekordy dál počítají | „launch hry příliš závisí na štěstí“; po 100 % „ani poplácání po zádech“; bossové ztěžují dokonalé odpaly |
| **Toss the Turtle** (2009) [24][25] | jen překonávání vlastního rekordu | dělo, jetpack, zbraně s omezenou municí; odměna po každém hodu | neuvedeno | — | pozitivní recenze („učí 2D balistiku“) |
| **Learn to Fly 2 (Coolmath)** [26] | prorazit ledovou stěnu | sáňky, kluzáky, trysky; nejlepší „omega“ položky za skryté body | — | — | — |

**Neověřeno:** Kitten Cannon (podle paměti bez vylepšení, čistě štěstí a překážky), Hamster Cannon a Flappy Golf. Pro tyto hry jsme nenašli ověřitelný zdroj a nevyvozujeme z nich nic. Vydavatele Learn to Fly (Armor Games / Nitrome) si zdroje odporují a nechali jsme ho neuvedený.

#### Vzorce napříč žánrem (H)

- **Konečný příběhový cíl je norma** (6 000 stop, zeď, vesmír, útěk). Čistě nekonečné hry bez cíle (Toss the Turtle) existují, ale série, které měly pokračování, cíl mají.
- **Druhý díl skoro vždy přidává režimy po cíli.** Learn 2 Fly má Arcade s pevným rozpočtem, LtF3 Payload a Sandbox, BB Revenge nekonečnou úroveň. Hráči v komentářích k BB1 nekonečný režim přímo žádají [22].
- **Meta-vrstva přenášená mezi hrami** (bonusový obchod LtF2, karty a balíčky LtF3) je žánrový předchůdce prestiže.
- **Explicitní měřítko výkonu na konci** (LtF1: počet dní a hláška „chvály nebo posměchu“) dává hráči důvod hrát znovu lépe. Komentáře pod recenzí jsou plné porovnávání počtu dní [18][19]. Jde o skóre efektivity, ne doletu.
- **Opakované stížnosti:** (a) konec bez oslavy, (b) pocit, že rozhoduje štěstí, ne hráč, (c) grind na plný obchod, (d) degenerovaná optimální strategie.
- **Vrstvení odměn:** odměna nejen za dolet, ale i za výšku, rychlost, čas letu (LtF1 násobitel 1–3×) nebo trefu objektů (sněhulák v LtF2) [18][26]. Vícerozměrná odměna dává hráči víc „os“, na kterých se může zlepšit.

### 2.2 Matematika cen a odměn

#### Inkrementální / idle model (H, Pecorella 2016–2017)

Anthony Pecorella (Kongregate, producent AdVenture Capitalist mobile) popsal kanonický model [1][2][3][4]:

- **Cena:** `cena_n = cena_základ × r^vlastněno`. AdVenture Capitalist (stánek s limonádou): r = 1,07, základ ≈ 3,74, 10. kus stojí 7,87 [1]. Cookie Clicker: r = 1,15, tedy zhruba dvojnásobná cena každých 5 budov [5].
- **Výnos:** lineární v počtu kusů (1,67/s na stánek) × multiplikátory [1].
- **Dynamika:** exponenciála „nakonec dožene a daleko předežene“ jakýkoli polynom. Zpočátku výnos předbíhá ceny a hráč nakupuje plynule, později se čekání na další nákup „neúnosně prodlužuje“. **Multiplikátory** (stánek ×2 při 25 a 50 kusech) dočasně vrací výnos nad ceny [1]. Výsledkem je rytmus stěn a průlomů.
- **Volba:** při stejném rozvrhu multiplikátorů obvykle dominuje nejnovější generátor, a tím mizí smysluplná volba. Řešením je různé načasování multiplikátorů, aby priorita přecházela mezi generátory [1]. Pokud vždy vyhrává nejvyšší tier, je balanc podle Pecorelly „asi špatně“ [4].
- **Varianta s odvozenými generátory** (každý tier vyrábí nižší tier) dává polynomy x^n/n!, které se blíží e^x. Problém „bezvýznamnosti“ nižších nákupů řeší ceny podle *koupených* kusů a bonusy za nákup [2].
- **Tabulkové modely** jsou podle Pecorelly jen hrubý vodítko, protože nezachytí chování hráče, například spěch přes milníky [3].

**Omezení a přenositelnost:** jde o hry bez konce, s miliony kusů a dlouhými sezeními. Naše hra má 15 nákupů celkem a cíl za ~12 minut. Přenosný je princip: **tempo je poměr růstu příjmu k růstu ceny** a pocit pokroku vzniká ze střídání „dražší čekání → skok“.

#### Křivky cen pro malé stromy (H, Schreiber 2010)

Ian Schreiber v kurzu *Game Balance Concepts* [13]:

- **Trojúhelníková řada** (1, 3, 6, 10, 15; diference rostou lineárně) je „docela dobrý první odhad rostoucích cen“. Když roste cena úrovně trojúhelníkově a odměna lineárně, výsledný poměr je zhruba konstantní.
- **Exponenciála** („když k jedné hodnotě přičteš, druhou vynásob“) roste „opravdu rychle“ a je s ní nutné zacházet „velmi, velmi opatrně“.
- **Když odměny rostou pomaleji než ceny, rané úrovně přicházejí rychle a pozdější pomaleji**, což je podle autora „obvykle to, co chcete“. Prakticky: zvolit cílový čas na úroveň a dopočítat odměny zpětně.
- Ceny mají smysl jen relativně k příjmu v daném okamžiku (250 zlatých jsou jinde drobné, jinde majetek).

#### Naše čísla v tomto rámci (fakta z kódu)

- Ceny `[35, 105, 195, 300, 420]`: poměry sousedních úrovní 3,0 / 1,86 / 1,54 / 1,40. Relativně k první úrovni 1 / 3 / 5,6 / 8,6 / 12, tedy blízko **mocninné funkci ≈ 35 · n^1,55**. Do 3. úrovně je to téměř trojúhelníková řada (1, 3, 6), potom plošší (trojúhelníková by dala 10 a 15). Není to exponenciála.
- Celý strom stojí 3 × 1 055 = **3 165 mincí**. Odměna `10 + ⌊dolet/10⌋` dává 20 mincí za 100 m a 60 za 500 m.
- Efekty jsou aditivní za úroveň (síla +12 %, papír +20 %), ale **dolet roste v kombinaci nadlineárně** (síla × papír se násobí): šipka se vším na úrovni 0–5 dosáhne 219 / 286 / 369 / 468 / 587 / 731 m. Odměna je lineární v doletu, takže **příjem roste s vylepšeními rychleji než lineárně**. Ekonomika má kladnou zpětnou vazbu a ceny ji tlumí jen polynomem.
- Simulace: na 500 m stačí zhruba úroveň 3–4 ve všech větvích [MONTE-CARLO.md]. Úroveň 3 všude stojí 1 005 mincí, úroveň 4 všude **1 905** ((35 + 105 + 195 + 300) × 3; v první verzi chybně 1 920). **Odhad (N, nepřepočítáno pro 0.6.1):** při dosažení 500 m má hráč koupenou zhruba třetinu až tři pětiny hodnoty stromu (1 005 / 3 165 ≈ 32 %, 1 905 / 3 165 ≈ 60 %; první verze uváděla „třetinu až polovinu“). Zbytek stromu i budoucí mince nemají cíl.

### 2.3 Gradient cíle, obdarovaný pokrok a „reset po odměně“

**Kivetz, Urminsky a Zheng (2006), Journal of Marketing Research 43(1), 39–58 — V** [9]. Terénní experimenty a analýza zákaznických dat:

- **Kavárna („10 káv = 1 zdarma“):** interval mezi nákupy klesl o 0,7 dne (**20 %**) od prvního k poslednímu razítku. Kartu zákazníci dokončili za 24,6 dne místo 29,4, které by trvala bez zrychlení. Akcelerace přetrvala po kontrole sezónnosti, zvyku i heterogenity zákazníků. Výrazně zrychlovala největší skupina (58 %), u menších skupin (7 % a 6 %) byl efekt téměř nulový.
- **Iluzorní pokrok:** karta 12 razítek se 2 předtištěnými se dokončila za 12,7 dne, kontrola na 10 razítek za 15,6 dne (mediány 10 vs. 15 dní; p < 0,05).
- **Hodnocení písní za certifikáty:** blíž k odměně častější návštěvy, víc hodnocení na návštěvu a delší vytrvání. **17 % všech ukončení návštěv** nastalo hned po získání odměny, kdy byl hráč nejdál od dalšího cíle. Při 50 nastřádaných hodnoceních to bylo jen 0,2 %.
- **Retence:** kdo víc zrychloval k první odměně, rychleji se vrátil a spíš získal druhou. **Po odměně aktivita „resetuje“ na nižší úroveň** a pak znovu zrychluje k další odměně. Autoři doporučují oslovit zákazníka hned po získání odměny.
- **Model:** úsilí je funkcí *podílu* zbývající vzdálenosti k cíli (psychologická vzdálenost), ne absolutní vzdálenosti.

*Omezení:* spotřebitelské chování (koupě kávy, hodnocení písní), ne hra. Sebevýběr do programu, jedna univerzita, mírné efekty. Autoři sami uvádějí, že zrychlení lze částečně vysvětlit i racionálně (poslední jednotka úsilí odstraní větší podíl zbývající vzdálenosti). *Přenositelnost:* struktura „sbírám k prahu, pak odměna“ je velmi blízká hře s milníky 100/250/500 m. Nejsilnější přenositelný poznatek je **pokles po dosažení cíle a vyšší odchod v tom okamžiku**.

**Nunes a Drèze (2006), Journal of Consumer Research 32(4), 504–512 — V** [10]. „Endowed progress effect“: lidé s umělým náskokem k cíli vytrvají déle a dokončí častěji a rychleji. Ověřeno z plného textu (archivovaná autorská kopie, viz registr):

- **Studie 1 (terén, myčka):** v dubnu 2004 bylo náhodně rozdáno 300 věrnostních karet. Polovina: 10 razítek potřeba, 2 už nalepená („součást dnešní akce“). Druhá polovina: 8 razítek, žádné předem. Obě skupiny tedy potřebovaly 8 skutečných nákupů. Kartu uplatnilo **34 % proti 19 %** (χ²(1) = 8,1, p < 0,01), celkem 80 uplatněných karet. Obdarovaní měli mezi návštěvami v průměru o 2,9 dne kratší odstupy a odstup se s každým dalším mytím zkracoval o 0,5 dne (gradient cíle). Karty platily 9 měsíců, všechny uplatněné byly uplatněny do 17. 9. 2004.
- **Studie 2 (scénáře, 146 studentů):** rozhoduje *relativní* pokrok (třetina vs. šestina), ne peněžní hodnota daru. Autoři sami uvádějí omezení: hypotetické hodnocení, ne skutečná vytrvalost.
- **Studie 3 (scénáře, 240 zákazníků vinotéky, design 2 × 4):** efekt je silnější, když se pokrok počítá v **bodech** než v nákupech. Při počítání v nákupech se objevil **jen tehdy, když byl náskok nějak zdůvodněn**. **Účelové zdůvodnění fungovalo stejně dobře jako realistické** (podle historie nákupů). Autoři to shrnují tak, že pomáhá „any reason“.

*Oprava proti první verzi:* první verze z abstraktu vyvozovala, že náskok bez zdůvodnění „může působit jako trik“ a že záleží na tom, *jak* je zdůvodněn. Plný text ukazuje, že záleží na tom, *zda* zdůvodnění existuje, ne na jeho pravdivosti nebo věrohodnosti. Pravdivost zdůvodnění je tedy naše **etická** volba (blok 02), ne podmínka účinku. *Přenositelnost:* behaviorální je jen studie 1, a to ve spotřebitelském kontextu. Studie 2 a 3 měří jen postoje. Pro nás se nabízí pro první cíl (100 m, odemčení kluzáku) a pro nové etapy po 500 m.

### 2.4 Pocit pokroku: vertikální vs. horizontální, dovednost vs. síla

- **Game Developer Staff (2014) — H** [15]: progrese = jasné cíle a *viditelná vzdálenost k nim*. **Vertikální** progrese se měří *měřítkem* (statistiky), **horizontální** *možnostmi* (nové nástroje a jejich chytré použití). Riziko vertikální progrese: nuda, když se nemění, *jak* hraju. Riziko horizontální: možnosti bez kontextu, které působí zbytečně.
- **Fischer (2014) — H** [14]: taxonomie *explicitní statický* (úrovně, mise), *explicitní trvalý* (horizontální/vertikální), *grind* a *implicitní* (dovednost hráče). Tvrdí, že horizontální progrese je obecně poutavější a že vertikální je „v mnoha případech horší alternativou“. Grind často bývá optimální strategie a přenáší ladění obtížnosti na hráče. U vertikální progrese **„je těžké poznat, zda se zlepšil hráč, nebo avatar“**. *Kvalita:* autorský blog, argumentace bez dat. Tvrzení o vyšší poutavosti je názor.
- **Schreiber (2010), Level 7 — H** [12]: *vnímaná obtížnost = (výzva dovednosti + výzva síly) − (dovednost hráče + síla postavy)*. Dovednost hráče roste sama, takže hra „musí v nějakém smyslu těžknout“. Odměny navázané na záměrnou akci hráče působí smysluplněji než libovolné. Příliš málo odměn demotivuje, příliš mnoho velkých v krátkém čase ztrácí účinek. Přechody mezi úrovněmi mají být rozložené na mírně rostoucí křivce, aby byl začátek rychlý. Hry bez konce mají „elder game“, kde progrese ztrácí smysl, a přechod do něj způsobuje odchod hráčů („treadmill“).
- **Žánrové svědectví (H, anekdotické):** v launch hrách se hráči ptají, zda rozhoduje dovednost, nebo štěstí. „Zdá se, že je to hlavně štěstí“ [22], „launch hry na mě příliš závisí na štěstí“ [23]. U LtF3 recenze a komentáře hlásí, že optimální strategie je „prostě namířit rovně nahoru“ [20]. Toss the Turtle naopak recenzent chválí jako hru, která „nenápadně učí elementární fyziku“ (ideální úhel 45°) [24]. Vztah mezi úhlem a výsledkem byl tedy pro hráče čitelný.
- **Mekler, Brühlmann, Tuch a Opwis (2017), Computers in Human Behavior 71, 525–534 — V** [27]. Online experiment 4 × 2 (body / žebříček / levely / bez prvků × kauzální orientace), n = 273, úloha anotace obrázků (nehra). Body, levely a žebříček zvýšily **počet** tagů (d ≈ 0,35–0,44), ale ne jejich kvalitu, vnitřní motivaci ani pocit kompetence. Ověřeno z plného textu v ověřovacím kole, shodně s blokem 02 [13]. *Pro nás:* vertikální čísla (body, úrovně) zvyšují kvantitu aktivity, ne nutně prožitek. Podporuje opatrnost u N8.

**Syntéza (H):** v launch & upgrade hrách je pokrok převážně vertikální (dolet, rychlost). Žánr ho zpestřuje horizontálními prvky: novými díly s jiným chováním (rakety, kluzáky, body-slam), režimy a výzvami. Pocit zásluhy hráče podporují mechaniky, kde dovednost viditelně mění výsledek (body-slam a dobíjení v BB [22], řízení náklonu v LtF [18]), a skóre efektivity (počet dní v LtF1).

### 2.5 Smysluplné volby ve stromech vylepšení

- **Sid Meier, GDC 2012 „Interesting Decisions“ — H** [16]: vrací se ke své formulaci z GDC 1989, že hra je „série zajímavých rozhodnutí“. Podle anotace v GDC Vault přednáška rozebírá, které typy rozhodnutí jsou zajímavé, jak je přidávat, roli tempa a **informace a zpětnou vazbu, kterou hráč k rozhodnutí potřebuje**. Konkrétní kritéria z přednášky jsme **neověřili** (video jsme neviděli). Jediný nalezený rozbor uvádí čtyři vlastnosti (trade-off, situační, osobní, trvalé), jde ale o neověřený sekundární popis a nepoužíváme ho.
- **Compton (2019) — H** [17] shrnuje běžný výklad: volba musí (1) mít důsledky, nebo je hráč aspoň musí vnímat, (2) být předvídatelná, aby hráč tušil, co způsobí, (3) být nezřejmá, tedy žádná možnost nesmí být jasně lepší. Kdy volbu *nedávat*: když vede k paralýze nebo když se jedna možnost volí téměř vždy. Pak je volba jen tření.
- **Pecorella** [1][4]: v idle hrách volbu zabíjí dominantní generátor. Řešením je střídání priority.
- **Žánr:** Learn 2 Fly chválí recenze za větvené cesty vylepšení a možnost zkoušet různé sestavy [19]. LtF3 má přes 100 dílů s hmotností a sloty, recenze ho přesto kritizuje za přehlcení a dominantní strategii [20]. Víc možností tedy samo nevytváří zajímavou volbu.

**Naše data (fakta ze simulace):** rovnoměrný nákup je nejrychlejší strategie (28 hodů; jde o průměr přes všechny strategie úhlu v tabulce nákupů, ne o hlavní scénář „průměrný hráč 23 hodů“). „Přehyby napřed“ stojí 46 hodů, „papír napřed“ 45 a „síla napřed“ 37 [MONTE-CARLO.md, 0.6.1]. Protože se síla a papír násobí, vyplácí se vyvážený nákup. Strom tak spíš testuje, zda hráč *neudělá chybu*, než aby nabízel rovnocenné cesty. Podle kritérií [17] je volba „kam dřív“ částečně zřejmá (rovnoměrně) a přehyby mají těžko předvídatelný účinek (odpuštění a okna QTE, ne dolet).

### 2.6 Prestiž, restart s bonusem a meta-progrese

- **Pecorella, Part III (2017) — H** [3]. Prestiž vrací růst do zvladatelných čísel a vytváří efekt „šplhání po žebříku“. Vzorce prestižní měny (p = celková prestiž, c = výdělek):
  - Realm Grinder (max. výdělek): zdvojnásobení prestiže vyžaduje ~4× výdělek předchozího běhu; reset ve stejném bodě nedá nic.
  - AdVenture Capitalist: p = 150 · √(c_celoživotní / 10¹⁵); zdvojnásobení ~3–4×.
  - Cookie Clicker: p = ∛(c / 10¹²); zdvojnásobení ~8×.
  - Egg, Inc. (jen tento běh): Δp = (c / 10⁶)^0,14; zdvojnásobení ~128×.
  - Doporučení: dát resetům *proměnlivý* rytmus (rychlé a pomalé úseky) a hledat, co je na hře zábavné (nové funkce, achievementy, optimalizace smyčky), a stavět kolem toho.
- **Pecorella, GDC Europe 2016 — H** [4]: prestiž je obdoba „New Game+“ a lze ji vnořovat. Pravidlo palce: reset při zisku +50 až +200 % aktuální prestižní měny. Rychlé cykly hrozí přílišnou prestiží, pomalé únavou, proměnlivé se těžko navrhují. Průzkum Quantic Foundry u tří idle her: hlavní motivace „Completion“ a „Power“ (čísla jen ze slajdů, metodiku jsme neověřili).
- **Alharthi a kol. (2018) — V (kvalitativní taxonomie)** [6]: NG+ mechaniky běžně nahrazují „game over“. Čím víc resetů, tím rychlejší a bohatší další hra. Bonusy za návrat přímo ovlivňují výkon, na rozdíl od achievementů.
- **Žánrový předchůdce:** bonusový obchod Learn 2 Fly přenášený mezi hrami [19]; karty a balíčky odemčení v LtF3 [20].

*Omezení:* žádný z nalezených zdrojů neměří, zda prestiž zvyšuje zábavu nebo retenci. Jde o praxi návrhářů a popis her. U krátké arkády hrozí, že reset bude působit jako *ztráta* hotového postupu (averzi ke ztrátě řeší blok 2).

### 2.7 Konec hry a co po hlavním cíli

| Řešení | Příklad (zdroj) | Poznámka |
|---|---|---|
| Pokračovat stejně dál | LtF1 „continue“ po 6 000 stopách [18] | levné; hráči přesto konec kritizují jako smutný |
| Nekonečná úroveň / volný let | BB Revenge po poslední zdi [23]; hráči BB1 ho žádají [22] | rekordy dál počítají; hrozí „treadmill“ [12] |
| Režim s omezeným rozpočtem | Learn 2 Fly Arcade, 3 rozpočty [19] | mění otázku z „jak daleko“ na „jak efektivně“; horizontální výzva |
| Skóre efektivity hlavního cíle | LtF1 počet dní + hodnocení [18] | dává důvod hrát znovu; komentáře plné porovnávání |
| Nové cíle a režimy | LtF3 Payload, Sandbox [21]; medaile LtF2 [19] | nejbohatší, ale nejdražší na obsah |
| Meta-obchod / prestiž | LtF2 bonusový obchod [19]; idle prestiž [3][4] | vyžaduje nový zdroj odměn |
| Oslava dokončení | chybí v BB Revenge („ani poplácání po zádech“) [23] | nejlevnější a kritizovaná, když chybí |

Výzkumně se k tomu váže **reset po odměně** [9]: hned po cíli motivace padá a hráč nejspíš odejde. Schreiber označuje přechod do „elder game“ za hlavní okamžik odchodu [12]. **H:** nejde jen o to, zda po cíli něco *je*, ale zda je to hráči ukázáno *v okamžiku dosažení cíle*.

### 2.8 Idle a inkrementální hry: kontext a etická poznámka

- **Alharthi a kol. (2018), CHI — V/kvalitativní** [6]: 66 idle her a 10 kontrolních her, zakotvená teorie. Idle hry nemají game over, akce stojí zdroje, jejichž cena roste s každou interakcí, a čekání je součástí hry. „Hrát příliš pozorně idle hru znamená hrát ji špatně.“ Hry s jedním zdrojem (Cookie Clicker, Clicker Heroes) mají vyšší interaktivitu a rychlejší progresi. Shoda hodnotitelů byla podstatná (vážené κ 0,70 a 0,75). *Omezení:* popisná studie, neměří prožitek hráčů.
- **Spiel a kol. (2019), CHI PLAY — V/kvalitativní** [7]: rozhovory se 6 návrháři populárních idle her, tematická analýza. Žánr začal jako vtip a komentář ke grindu. Autoři popisují „eticky nabité“ praktiky péče o hráče. *Omezení:* N = 6.
- **Buergi (2024), Replay — teoretická esej** [8]: idle hry slibují stálý pocit růstu i v nepřítomnosti, což vede k častým návratům a k prodeji zrychlení. Riziko vykořisťování netrpělivosti.

*Přenositelnost:* Just Throw It je aktivní dovednostní hra bez monetizace. Z idle her přebíráme jen matematiku tempa a myšlenku prestiže, ne mechaniku čekání ani offline výnos. Etické hranice (nátlak na návrat) patří do bloku 2.

---

## 3. Rozpory a otevřené otázky

1. **Horizontální vs. vertikální.** Fischer [14] tvrdí, že horizontální progrese je poutavější. Žánr launch & upgrade je přitom převážně vertikální a populární (LtF3 94 % kladných recenzí [21]). Rozpor je spíš v kontextu: v krátké arkádě může vertikální růst doletu *být* hlavní radostí. Nenašli jsme studii, která by to rozhodla.
2. **Štěstí vs. dovednost.** Hráči launch her si stěžují na štěstí [22][23], zároveň je náhoda zdrojem překvapení. Kolik variance je „zábavná“, zdroje neříkají (blok 4 a 6).
3. **Iluze pokroku: motivace, nebo manipulace?** Endowed progress funguje [9][10]. Plný text Nunese a Drèze ukazuje, že účinku stačí *jakékoli* zdůvodnění, i účelové. Data tedy hranici mezi přívětivým začátkem a trikem nevedou, spíš ukazují, že trik funguje. Hranice je čistě etická (blok 2: pravdivost, žádný falešný „dar“).
4. **Grind jako vlastnost, nebo vada.** Komentátor BB Revenge nazývá dlouhou investici „vlastností, ne chybou“ [23], Schreiber grind kritizuje jako umělé prodlužování [12]. Odpověď záleží na cílové skupině.
5. **Prestiž v krátké hře.** Všechny ověřené zdroje k prestiži jsou z her bez konce. Pro hru s 12minutovým hlavním cílem nemáme doklad, že restart s bonusem zabaví víc než nové cíle.
6. **Přenos z marketingu.** Gradient cíle a obdarovaný pokrok jsou doloženy u spotřebitelů (káva, myčka, hodnocení písní), ne ve hrách s dovedností. V naší hře se pokrok nesbírá po stejných jednotkách: dolet kolísá a může i klesnout.
7. **Neověřeno:** obsah přednášky Burrito Bison Postmortem (Casual Connect 2011; ověřen jen název, autoři a existence videa), konkrétní Meierova kritéria (GDC 2012; ověřena jen anotace), data o Kitten Cannon, Hamster Cannon a Flappy Golf. Plný text Nunes & Drèze a výsledky Mekler a kol. (2017) jsou od ověřovacího kola ověřené. Dále analýzy Erica Guana a jiné rozbory Cookie Clickeru: po vyčerpání vyhledávacího limitu jsme je nedohledali a necitujeme je.

---

## 4. Relevance pro Just Throw It — kandidátní implikace (N)

*Vše níže jsou hypotézy k ověření simulací nebo hráčským testem, ne doporučení.*

**N1 — Okamžik 500 m je kritický bod odchodu.** Podle [9] po dosažení cíle aktivita resetuje a odchod je nejvyšší. Dnes po 500 m chybí cíl, oslava i využití mincí. *Hypotéza (přeformulováno v ověřovacím kole):* na výsledkové obrazovce 500 m nejdřív **oslava a „konec kapitoly“** s možností spokojeně skončit (N11; blok 02 N6, blok 08 N11), teprve potom **jeden blízký** další cíl (nejbližší místo trasy, Zahrady ~110 m za cílem). Ne celá mapa ani vzdálený cíl: podle Loewensteina (1994, blok 08 [10], ověřeno plným textem) se lidé zvědavosti nevystavují, když je šance ji uspokojit malá nebo čekání dlouhé. *Proč přeformulováno:* původní znění („jinak hráč pravděpodobně skončí“) bralo odchod jen jako problém. Kivetzovo doporučení „oslovit zákazníka hned po odměně“ je retenční logika marketingu, ne zjištění o prožitku, a je v napětí s kritérii bloku 02 §2.7. Odchod po dokončeném cíli je legitimní konec (blok 09 N2). Měřit proto **dvojicí** ukazatelů: podíl hráčů, kteří po 500 m hodí ještě aspoň jednou, *a* odpověď na otázku „Hrál/a jsi déle, než jsi chtěl/a?“ (blok 02 §4.4). Úspěchem je vyšší dobrovolné pokračování bez nárůstu lítosti.

**N2 — Zbytek stromu a mince po 500 m.** Celý strom stojí 3 165 mincí, k 500 m stačí úroveň 3–4 všude (1 005–1 905 mincí; v první verzi chybně 1 920). *Hypotéza:* zbývající úrovně 4–5 jsou přirozený motor další etapy (trasa 4,9 km, 16 míst). Simulace už navrhovala variantu D s dražšími úrovněmi 4–5 „pokud mají úrovně 4–5 a mince sloužit i po 500 m“. Alternativně: mince → horizontální odemčení (třetí model, kosmetika) místo dalšího vertikálního růstu, podle [14][15].

**N3 — Etapové cíle podle psychologické vzdálenosti.** Kivetzův model pracuje s *podílem* zbývající vzdálenosti [9]. Milníky 100/250/500 m (poměry 2,5× a 2×) jsou rozumně rozložené. Po 500 m by další milníky na trase (např. místa po ~305 m, biomy po ~1 219 m) měly mít podobný poměrový rytmus, ne konstantní absolutní krok. Ověřit simulací: kolik hodů mezi milníky v každé etapě.

**N4 — Obdarovaný pokrok při přechodu do další etapy.** Podle [9][10] může nová etapa začít s viditelně „započítaným“ pokrokem (např. ukazatel cesty k dalšímu biomu, na kterém je už 500 m z 1 219 m uražených). Pro účinek podle [10] stačí, že náskok má *nějaké* zdůvodnění. Pravdivost zdůvodnění účinek nezvyšuje (studie 3), je to naše etická podmínka: metry hráč opravdu uletěl, takže nejde o vyrobený „dar“. Ukazatel v metrech je navíc blíž „bodům“ než „nákupům“, u kterých byl efekt v [10] slabší. Neprezentovat jako dar zdarma. *Oprava:* první verze tvrdila, že pravdivé zdůvodnění „podle [10] efekt podporuje“. Plný text to nepotvrdil.

**N5 — Skóre efektivity jako důvod hrát znovu.** LtF1 počítá dny do cíle a hodnotí je [18]. Hráči to sdílejí. *Hypotéza:* „500 m za X hodů“ s osobním rekordem dává smysl dalšímu hraní bez nového obsahu a přímo odměňuje dovednost (úhel, síla, QTE), ne nákupy. Riziko: tlak na dokonalost, takže hodnocení vlídné, ne posměšné.

**N6 — Režim s pevným rozpočtem (horizontální výzva).** Analogie Learn 2 Fly Arcade [19]: „máš 300 mincí, postav vlaštovku a doleť co nejdál“. Využije existující strom a udělá z volby větví skutečnou volbu, protože s malým rozpočtem nelze koupit vše rovnoměrně. Malý vývojový náklad, protože fyzika i strom už existují.

**N7 — Volby ve stromu: přehyby jako jiná osa, ne horší dolet.** Simulace: přehyby napřed 46 hodů proti 28 při rovnoměrném nákupu. Podle [17] je volba nezajímavá, když je jedna možnost zřejmě lepší nebo když hráč nepředvídá důsledek. *Hypotéza:* přehyby budou „zajímavé“ jen tehdy, když bude jejich přínos vidět (např. výsledek ukáže „přehyby ti zachránily X m“) a když budou situačně nejlepší (slabší hráč, náročné QTE). Ověřit, zda hráči v testu volbě rozumějí.

**N8 — Zásluha dovednosti vs. vylepšení.** Schreiberova rovnice [12] a Fischerova poznámka [14] říkají, že vertikální růst zakrývá zlepšení hráče. Simulace: úhel rozhoduje zhruba dvojnásobně (pevných 15° = 46 hodů proti 24), upgrady zvednou dolet z ~219 na 731 m. *Hypotéza:* výsledková obrazovka by měla oddělit podíl hráče („perfektní síla +X m, QTE +Y m“) od podílu vlaštovky. Tím se posílí K1 bez nového obsahu. Žánrové stížnosti na „štěstí“ [22][23] naznačují, že bez tohoto rozlišení hráč připíše výsledek náhodě. *Pozor (sjednocení s 04 [34]):* Depping & Mandryk 2017 je vývoj škály atribuce, ne experiment. Experimentální opora pro „připsání úspěchu sobě zlepšuje prožitek“ tedy chybí. Škála je jen kandidátem na měřicí nástroj v testu N8.

**N9 — Tempo nákupů.** Ceny ≈ 35 · n^1,55 a příjem rostoucí nadlineárně s vylepšeními dávají kladnou zpětnou vazbu. Podle [13] je žádoucí, aby rané úrovně přišly rychle a pozdější pomaleji. První nákup (35) stojí přibližně 1–2 hody, poslední (420) přibližně 5–8 hodů při 500 m (60 mincí za hod). *Hypotéza:* tento poměr je v souladu se Schreiberovou heuristikou. Pro etapu po 500 m by ale ceny nad úroveň 5 (pokud vzniknou) měly růst rychleji než příjem, jinak hráč „uteče křivce“. Ověřit simulací pro trasu > 500 m.

**N10 — Prestiž zatím ne.** Všechny doklady k prestiži jsou z nekonečných idle her [3][4][6]. Pro 12minutový hlavní cíl je pravděpodobně levnější a čitelnější N2–N6. Prestiž zvážit až po vzniku dlouhé trasy, a to jako *volitelný* restart (např. „nový okruh“ s trvalým bonusem), nikdy jako povinný reset.

**N11 — Oslava cíle.** Kritika chybějícího „poplácání po zádech“ [23] a smutného konce [18] je nejlevněji řešitelná vada žánru. Dokončení 500 m (`p.completed`) by mělo mít vlastní okamžik, ne jen další hod. Navazuje na blok 5 (game feel) a K6.

---

## 5. Registr zdrojů

Ověřováno 13. 10. 2026. Kvalita: ●●● recenzovaná studie · ●● odborný text / talk praktika s daty · ● recenze, obchodní stránka, komentáře.

| # | Zdroj | Typ | Štítek / kvalita | Co jsme ověřili, omezení |
|---|---|---|---|---|
| 1 | Pecorella, A. (2016, 13. 10.). *The Math of Idle Games, Part I.* Kongregate Dev Blog / Game Developer. https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i | blog praktika (producent AdVenture Capitalist) | H ●● | vzorec ceny, r = 1,07, multiplikátory, dominance generátorů; hry bez konce |
| 2 | Pecorella, A. (2016, 14. 12.). *The Math of Idle Games, Part II.* https://www.gamedeveloper.com/disciplines/the-math-of-idle-games-part-ii | blog praktika | H ●● | odvozené generátory, relevance nákupů |
| 3 | Pecorella, A. (2017, 1. 2.). *The Math of Idle Games, Part III.* https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii | blog praktika | H ●● | vzorce prestiže 4 her; bez dat o hráčích |
| 4 | Pecorella, A. (2016). *Quest for Progress: The Math and Design of Idle Games.* GDC Europe 2016, slajdy. https://www.slideshare.net/slideshow/quest-for-progress-gdc-europe-2016/65405507 | GDC talk (jen slajdy) | H ●● | pravidlo resetu +50–200 %, Quantic Foundry; mluvené slovo neověřeno |
| 5 | Cookie Clicker Wiki. *Buildings.* https://cookieclicker.wiki.gg/wiki/Buildings | komunitní wiki | H ● | cena × 1,15 za kus; komunitní zdroj, vzorec konzistentní s [3] |
| 6 | Alharthi, S. A., Alsaedi, O., Toups Dugas, P. O., Tanenbaum, T. J., & Hammer, J. (2018). *Playing to Wait: A Taxonomy of Idle Games.* CHI 2018. DOI 10.1145/3173574.3174195. PDF: https://par.nsf.gov/servlets/purl/10061230 | recenzovaná konference, kvalitativní | V ●●● | plný text (abstrakt, metoda, diskuse); popis her, ne měření hráčů |
| 7 | Spiel, K., Alharthi, S. A., Cen, A. J., Hammer, J., Nacke, L. E., Toups Dugas, P. O., & Tanenbaum, T. J. (2019). *„It Started as a Joke“: On the Design of Idle Games.* CHI PLAY '19, 495–508. DOI 10.1145/3311350.3347180. https://par.nsf.gov/biblio/10174274 | recenzovaná konference, rozhovory (N = 6) | V ●●● | jen abstrakt a metoda; malý vzorek |
| 8 | Buergi, J. (2024). *Idle Games: A Cozy Genre Turned Exploitative.* Replay 12(1), 73–86. https://www.czasopisma.uni.lodz.pl/Replay/article/view/23588 | časopisecká esej | H ●● | abstrakt; teoretická argumentace |
| 9 | Kivetz, R., Urminsky, O., & Zheng, Y. (2006). *The Goal-Gradient Hypothesis Resurrected.* Journal of Marketing Research 43(1), 39–58. DOI 10.1509/jmkr.43.1.39. PDF: https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf | recenzované terénní experimenty | V ●●● | plný text (čísla 20 %, 12,7 vs. 15,6 dne, 17 % ukončení, reset po odměně); spotřebitelský kontext |
| 10 | Nunes, J. C., & Drèze, X. (2006). *The Endowed Progress Effect: How Artificial Advancement Increases Effort.* Journal of Consumer Research 32(4), 504–512. DOI 10.1086/500480. https://ideas.repec.org/a/oup/jconrs/v32y2006i4p504-512.html · plný text (archiv autorské kopie): http://web.archive.org/web/20260105212707/http://msbfile03.usc.edu/digitalmeasures/jnunes/intellcont/Endowed%20Progress%20Effect-1.pdf | 1 terénní experiment (300 karet) + 2 scénářové studie (146 studentů, 240 zákazníků) | V ●●● | **ověřeno plným textem 13. 10. 2026**: 34 % vs. 19 %, χ²(1) = 8,1; −2,9 dne mezi návštěvami; účelové zdůvodnění funguje stejně jako realistické. Studie 2–3 měří jen postoje |
| 11 | Coglode. *Endowed Progress Effect.* https://www.coglode.com/nuggets/endowed-progress-effect | sekundární shrnutí | ● | čísla 300 karet, 9 měsíců, 34 % vs. 19 % **potvrzena v primárním zdroji [10]** (13. 10. 2026); není už potřeba ho citovat |
| 12 | Schreiber, I. (2010). *Level 7: Advancement, Progression and Pacing.* Game Balance Concepts. https://gamebalanceconcepts.wordpress.com/2010/08/18/level-7-advancement-progression-and-pacing/ | učební text (vyučující game designu) | H ●● | vzorec vnímané obtížnosti, elder game, treadmill, grind |
| 13 | Schreiber, I. (2010). *Level 2: Numeric Relationships.* https://gamebalanceconcepts.wordpress.com/2010/07/14/level-2-numeric-relationships/ | učební text | H ●● | trojúhelníkové a exponenciální křivky, tempo úrovní |
| 14 | Fischer, F. (2014, 17. 11.). *Dissecting Progress.* Game Developer (blog). https://www.gamedeveloper.com/design/dissecting-progress | blog návrháře | H ● | taxonomie progrese; názorové, bez dat |
| 15 | Game Developer Staff (2014, 24. 2.). *The Fundamentals of Game Progression.* https://www.gamedeveloper.com/design/the-fundamentals-of-game-progression | článek | H ● | definice horizontální a vertikální progrese |
| 16 | Meier, S. (2012). *Interesting Decisions.* GDC 2012. GDC Vault: https://www.gdcvault.com/play/1015756/Interesting · zmínka: https://gamedeveloper.com/design/video-sid-meier-explores-interesting-decisions-in-gameplay | GDC talk | H ●● | název, teze a anotace (typy rozhodnutí, tempo, informace a zpětná vazba) ověřeny 13. 10. 2026; konkrétní kritéria neověřena (video neviděno) |
| 17 | Compton, C. (2019, 18. 11.). *Designing Interesting Decisions in Games (And When Not To).* https://www.gamedeveloper.com/design/designing-interesting-decisions-in-games-and-when-not-to- | blog návrháře | H ● | kritéria důsledek, předvídatelnost, nezřejmost |
| 18 | FunnyMan (2009, 18. 5.). *Learn to Fly — review.* JayIsGames. https://jayisgames.com/review/learn-to-fly.php | recenze + komentáře | H ● | 6 vylepšení, 6 000 stop, dny 11–89, kritika konce; anekdoty |
| 19 | joye (2011, 16. 6.). *Learn 2 Fly — review.* JayIsGames. https://jayisgames.com/review/learn-2-fly.php | recenze + komentáře | H ● | režimy Story, Classic, Arcade, bonusový obchod, 15–87 dní |
| 20 | Dora (2016, 20. 2.). *Learn to Fly 3 — review.* JayIsGames. https://jayisgames.com/review/learn-to-fly-3.php | recenze + komentáře | H ● | grind, přehlcení, „leť rovně nahoru“ |
| 21 | Steam. *Learn to Fly 3* (Light Bringer Games, 19. 2. 2016). https://store.steampowered.com/app/589870/Learn_to_Fly_3/ | obchodní stránka | ● | 100+ dílů (24/18/24/23), režimy, 94 % z ~9 300 recenzí (stav k 13. 10. 2026) |
| 22 | Mike (2011, 22. 2.). *Burrito Bison — review.* JayIsGames. https://jayisgames.com/review/burrito-bison.php | recenze + komentáře | H ● | grind, „hlavně štěstí“, žádost o nekonečný režim |
| 23 | Tricky (2012, 1. 2.). *Burrito Bison Revenge — review.* JayIsGames. https://jayisgames.com/review/burrito-bison-revenge.php | recenze + komentáře | H ● | konec, nekonečná úroveň, „5 milionů“ (komentář), „ani poplácání po zádech“ |
| 24 | GamesBeat (2010, 25. 2.). *Toss the Turtle – Violent Depictions of the 2-d Physics.* https://gamesbeat.com/toss-the-turtle-violent-depictions-of-the-2-d-physics/ | recenze | H ● | smyčka, obchod, učení balistiky |
| 25 | CrazyGames. *Toss the Turtle.* https://www.crazygames.com/game/toss-the-turtle | herní portál | ● | rok 2009, cíl = vlastní rekord |
| 26 | Coolmath Games. *Learn to Fly 2.* https://www.coolmathgames.com/0-learn-to-fly-2 | herní portál | ● | ledová stěna, omega položky |
| 27 | Mekler, E. D., Brühlmann, F., Tuch, A. N., & Opwis, K. (2017). *Towards understanding the effects of individual gamification elements on intrinsic motivation and performance.* Computers in Human Behavior 71, 525–534 (online 2015). DOI 10.1016/j.chb.2015.08.048 · PDF: https://glassmanlab.seas.harvard.edu/annotated_works/mekler17.pdf | online experiment 4 × 2, n = 273 | V ●●● | **ověřeno plným textem 13. 10. 2026** (metoda a výsledky); neherní úloha, jedno sezení |
| 28 | Juicy Beast. *Press* (video „Casual Connect 2011: Burrito Bison Postmortem – Designing for Two Markets at Once“, Y. Langlais a D. Lemire-Nault). https://juicybeast.com/press/ · https://www.youtube.com/watch?v=4LzhXjSls-c | přednáška (video) | H ●● | jen název, autoři a existence záznamu; obsah neověřen |

**Lokální zdroje:** [src/config.js](../../src/config.js) (ceny, efekty větví), [src/core.js](../../src/core.js) (odměna `10 + ⌊dolet/10⌋`, nákup), [simulation/MONTE-CARLO.md](../../simulation/MONTE-CARLO.md) (0.6.1: 23 hodů / 11,9 min u průměrného hráče; strategie nákupu; marginální dolet).

**Poznámka k metodě:** vyhledávací limit sezení se během rešerše vyčerpal. Několik zdrojů (Burrito Bison postmortem, analýzy Erica Guana, Kitten Cannon, Hamster Cannon, Flappy Golf) proto zůstalo nedohledaných. V ověřovacím kole 13. 10. 2026 se dohledala jen existence a autoři přednášky Burrito Bison [28]. Ostatní zůstávají otevřené. Depping & Mandryk o atribuci hráčů dohledal blok 04 [34]: CHI 2017, s. 1040–1052, DOI 10.1145/3025453.3025648, konceptualizace a validace škály, ne experiment (plný text uzavřený).

---

## Ověřovací kolo 13. 10. 2026

- **Oprava výpočtu (R1):** úroveň 4 ve všech větvích stojí **1 905** mincí, ne 1 920 (§2.2, N2). Ověřeno proti `src/config.js` (`PRICES = [35, 105, 195, 300, 420]`). Úroveň 3 (1 005) a celý strom (3 165) byly správně. Navazující odhad podílu koupeného stromu při 500 m opraven na „třetinu až tři pětiny“.
- **Nunes & Drèze 2006 [10] ověřeno plným textem.** Čísla z myčky (300 karet, 34 % vs. 19 %) platí, doplněny statistiky a odstupy mezi návštěvami. **Oslabeno / opraveno:** tvrzení, že záleží na tom, *jak* je náskok zdůvodněn a že pravdivé zdůvodnění efekt podporuje (§2.3, §3 bod 3, N4). Studie 3 ukázala, že účelové zdůvodnění funguje stejně jako realistické. Pravdivost je etická podmínka, ne podmínka účinku. Sekundární zdroj [11] už není potřeba.
- **Mekler a kol. 2017 [27] ověřeno plným textem** (4 × 2, n = 273): kvantita ano, vnitřní motivace a kompetence ne. Zařazeno do §2.4 (dříve „necitováno“).
- **Meier, GDC 2012 [16]:** ověřena anotace v GDC Vault (typy rozhodnutí, tempo, informace a zpětná vazba). Konkrétní kritéria zůstávají neověřená.
- **Burrito Bison Postmortem:** ověřen název, autoři a existence videa (nový registr [28]). Obsah neověřen.
- **R8:** u „28 hodů“ doplněno, že jde o průměr přes strategie úhlu, ne o hlavní scénář 23 hodů.
- **Rozpor R-N4 (co po 500 m):** N1 přeformulováno na sekvenci „oslava a konec kapitoly → jeden blízký cíl“ (shodně s 02 N6 a 08 N11) a měření doplněno o otázku na lítost. Kivetzovo „oslovit hned po odměně“ označeno jako marketingová retenční logika.
- **Sjednocení (README §3.4, 13. 10. 2026, R25):** Depping & Mandryk převzat stav z 04 [34] (škála, ne experiment), doplněno k N8.
- **Neověřeno zůstává:** analýzy Erica Guana, Kitten Cannon, Hamster Cannon, Flappy Golf, Spiel 2019 a Buergi 2024 dál jen v abstraktu.
