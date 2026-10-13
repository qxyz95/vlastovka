# Blok 4 — Obtížnost, selhání a učení

**Datum rešerše:** 13. 10. 2026 · **Stav:** první verze bloku, prošla ověřovacím kolem 13. 10. 2026 (změny viz poslední oddíl) · **Navazuje na:** `KB zabavnost a motivace.md` (K1 „Vidím, v čem se zlepšuji“, K3 „Výzva je čitelná“, S2 GameFlow, S3 Burgers 2015). Tyto zdroje zde neopakujeme. Jdeme hlouběji do toho, jak obtížnost, selhání a zpětná vazba ovlivňují prožitek a učení.

**Štítky:** **V** výzkumný poznatek · **H** heuristika nebo praxe oboru · **N** naše hypotéza pro Just Throw It. Čísla zdrojů [n] odkazují na registr v oddílu 6. U každého zdroje uvádíme, co jsme skutečně ověřili: plný text, abstrakt, nebo jen sekundární zdroj.

---

## 1. Klíčová zjištění v kostce

1. **V — „Pravidlo 85 %“ je matematický výsledek pro určitý typ strojového učení, ne empirické pravidlo pro hráče.** Wilson a kol. [1] odvodili, že při binární klasifikaci a učení gradientním sestupem je učení nejrychlejší při chybovosti zhruba 15,87 %. Autoři sami píší, že ne každý model má takové optimum. Napojení na lidskou angažovanost formulují jako budoucí test. Do herního balancu proto nepatří jako cílová hodnota, nanejvýš jako jedna z hypotéz.
2. **V — U začátečníků byla delší dobrovolná hra spojená s *vyšší* úspěšností, ne se střední výzvou.** Ve dvou online experimentech (přibližně 10 000 hráčů a 69 642 sezení, ne unikátních hráčů) [2] hráli lidé tím déle, čím byla hra snazší. Nejzábavnější podmínky ale vedly k nejpomalejšímu učení. Šachisté v jiné studii naopak nejvíc oceňovali vyrovnané a těsné partie [3]. Optimální obtížnost tedy závisí na publiku, na míře expertízy a na tom, co měříme: dobu hraní, potěšení, nebo učení.
3. **V — Rovnováha výzvy a dovednosti s flow souvisí, ale jen středně silně.** Ukazuje to meta-analýza 28 studií [4]. V herním experimentu [5] vyšla „vyvážená“ podmínka nejlépe v zájmu a pozitivním afektu. „Nuda“ ale přinesla nejnižší negativní afekt a pocit kompetence srovnatelný s rovnováhou (číselně vyšší, rozdíl nevýznamný). Přetížení zkušení hráči hodnotili lépe než nudu.
4. **V — Skryté přizpůsobení obtížnosti (DDA) v malých studiích zlepšilo pohlcení a hráči ho nepoznali [8].** Samotné *tvrzení*, že hra se přizpůsobuje, ale zvýšilo pohlcení i tam, kde žádná adaptace nebyla [9]. DDA může také vyvolat přehnanou sebedůvěru, a to proti náhodně volené obtížnosti [10]. Ruční volba obtížnosti zvýšila vnímanou autonomii, ostatní míry prožitku se ale nezměnily. Preferenci ruční volby hráči vyjadřovali v rozhovorech, v pořadí podmínek však rozdíl nebyl významný [11]. Novější přehled výsledky DDA označuje za smíšené [12].
5. **V/H — Selhání hráčům vadí, ale je zdrojem hloubky. Hráči chtějí cítit, že za neúspěch mohou sami.** V Juulově malé studii [13] hodnotili hru nejlépe ti, kdo několik životů ztratili a pak hru dohráli. Kdo vinu přisoudil hře, hodnotil ji hůř. Kasuální publikum podle Juula neodrazuje samotné selhání, ale *ztráta postupu*.
6. **V — Tvrzení, že méně častá zpětná vazba vede k lepšímu učení (guidance hypothesis), je slabší, než učebnice naznačují.** Klasické nálezy [19][20] ukazují, že stoprocentní zpětná vazba po každém pokusu může zhoršit výkon, jakmile zpětná vazba zmizí. Meta-analýza 40 studií [22] ale našla jen slabý celkový efekt, a to hlavně v laboratorních úlohách a při velmi dlouhém tréninku.
7. **V — Hrubá směrová zpětná vazba („moc daleko“, „moc krátce“) pomáhá učení, čistá informace „trefa/minul“ v jedné studii nepomohla vůbec.** St. Germain a kol. [23] (N = 228) zjistili, že přesná i „stupňovaná“ (směrová) zpětná vazba vedla ke zlepšení, binární ne. Jde přesně o formát naší nápovědy „Zkus o kus plošeji“.
8. **V — Přínos samořízené zpětné vazby a „motivačního pilíře“ OPTIMAL teorie se po korekci publikačního zkreslení zmenšil téměř na nulu.** Naivní odhad g = 0,44 klesl po korekci na zhruba 0,11 [24]. Reanalýza odhaduje průměrnou statistickou sílu původních studií na asi 6 % [25]. Velká předregistrovaná studie žádnou výhodu samořízení nenašla [23].
9. **V — Zpětná vazba po *dobrých* pokusech zvyšuje dojem, že se člověk učí, i když se skutečné učení nezmění.** Ukázal to experiment s hodem na terč [29]. Pro hru jde o dvousečnou zbraň: pocit zlepšení se dá posílit, ale snadno také přifouknout.
10. **N — Pro Just Throw It z toho plyne:** nápověda úhlu má hlásit odchylku (směr a hrubou nebo i přesnou velikost), ne předepisovat ideální hodnotu. Časem by měla ustupovat, nebo ji hráč může vypnout. Úspěch musí být přičitatelný hráči. Přehyby jako odpouštějící mechanika mají být viditelné, ne skryté. Selhání má zůstat levné a informativní. Podrobnosti jsou v oddílu 5.

---

## 2. Podrobné sekce

### 2.1 Flow kanál a rovnováha výzvy a dovednosti

**Teoretický rámec.** Flow v Csikszentmihalyiho pojetí nastává, když výzva odpovídá dovednosti a cíle i odezva jsou jasné. Herní design z toho převzal „flow kanál“: obtížnost má stoupat spolu s dovedností. Je to užitečná metafora, ne kvantitativní model.

**V — Meta-analýza [4]: Fong, Zaleski a Leach (online 2014, tisk 2015), *Journal of Positive Psychology*.** Shrnuje 28 studií. Vztah rovnováhy výzvy a dovednosti k flow je *střední*, k vnitřní motivaci slabší. Slabší korelace autoři našli v individualistických kulturách, v práci a ve vzdělávání, u metody experience sampling a u měření stavového flow. Jasné cíle a pocit kontroly se ukázaly jako stejně robustní předpoklady flow jako samotná rovnováha.
*Síla důkazu:* střední, jde o meta-analýzu korelačních dat. *Omezení:* korelace nejsou kauzalita. Ověřili jsme jen abstrakt, velikosti efektů nemáme. *Přenositelnost:* podporuje to, že u nás jsou jasný cíl (další místo, rekord) a kontrola (úhel, síla) stejně důležité jako ladění obtížnosti.

**V — Experiment se třemi úrovněmi výzvy [5]: Klarkowski a kol. 2016, CHI.** Ve studii mělo 45 zkušených hráčů (sebehodnocení herní zkušenosti 6,1/7) Left 4 Dead 2 upravený do tří režimů: nuda, rovnováha a přetížení. Každý režim hráli 10 minut, uspořádání bylo uvnitř subjektů. Rovnováha měla nejvyšší zájem a potěšení podle IMI (5,5 vs. 3,49 nuda a 4,99 přetížení), nejvyšší pozitivní afekt, autonomii i prezenci. Nuda ale měla *nejnižší* negativní afekt a pocit kompetence srovnatelný s rovnováhou nebo vyšší (5,13 vs. 4,90, rozdíl nevýznamný). Přetížení bylo hodnoceno lépe než nuda.
*Omezení:* přetížení se hrálo vždy jako poslední, takže se mísí únava a pořadí. Šlo o žánr se soubojem. Vzorek byl malý a velmi zkušený. Autoři sami upozorňují, že u kasuálních hráčů jiné studie nacházejí preferenci nízké výzvy. *Přenositelnost:* střední. Ukazuje, že kompetence a potěšení jsou různé veličiny. Hra, která maximalizuje pocit „zvládám to“, nemusí být ta nejzábavnější.

**V — Šachová studie [3]: Abuhamdeh a Csikszentmihalyi 2012, *PSPB*.** V internetovém šachu souvisela vnímaná výzva s potěšením. Hry proti silnějším soupeřům a těsné partie byly příjemnější než jednostranné. Experience sampling v běžném životě ukázal, že vztah výzvy a potěšení moderuje typ motivace a to, zda činnost směřuje k cíli. Lomas a kol. [2] citují z této práce, že největší potěšení přicházelo při pravděpodobnosti výhry kolem 20 %. *Ověřovací kolo (plný text [2]):* Lomas údaj definuje jako soupeře s ratingem asi o 262 bodů vyšším. Jde tedy o pravděpodobnost výhry *odvozenou z rozdílu ratingu*, ne o pozorovanou úspěšnost. „Těsná partie“ znamená malý rozdíl v hodnotě sebraných figur na konci hry a potěšení zvyšovala bez ohledu na rozdíl ratingu a na to, kdo vyhrál. Oba nálezy tedy platí současně: silnější soupeř *a* těsný průběh. Plný text PSPB 2012 jsme nezískali (uzavřený přístup), definici známe jen z [2].
*Omezení:* šachisté si soupeře volili sami, předem znali jeho hodnocení a hráli o status. V originále jsme ověřili jen abstrakt. *Přenositelnost:* nízká až střední. Šachisté jsou expertní, sebevybraný vzorek.

**V — Online experimenty s výukovou hrou [2]: Lomas, Patel, Forlizzi a Koedinger 2013, CHI.** Ve hře Battleship Numberline hráči odhadují polohu čísla na číselné ose. Experiment 1 měl design 2 × 3 a přibližně 10 000 hráčů. Větší, tedy snazší cíl měl úspěšnost 63 % proti 29 % a vedl k o 34 % více pokusům a o 18 % delšímu hraní. Experiment 2 měl 69 642 sezení a mnohofaktorový design. Opět platilo, že čím snazší, tím delší hraní. Kvadratický průběh („obrácené U“) nevyšel. Nejkratší časové limity byly nejvíce demotivujícím faktorem ze všech. Snazší podmínky ale vedly k nejpomalejšímu učení.
Autoři navrhují čtyři hypotézy. (a) *Effectance*: úspěch motivuje, ale jen pokud ho hráč připíše své kompetenci, ne tomu, že hra je lehká. Proto doporučují zvyšovat úspěšnost spíš lepší výukou a informativnější odezvou než zvětšováním cílů. (b) *Expertíza*: vyhledávání výzvy přichází až s určitou dovedností. (c) *Feedforward*: říct hráči předem, jak těžký úkol je, aby si úspěchu cenil. (d) *Těsná hra*.
*Omezení podle autorů:* nejsnazší podmínka v experimentu 1 měla úspěšnost pod 70 %, takže pravou stranu obráceného U nemuseli zachytit. Délka hraní nemusí odpovídat potěšení. Hráči hru opouštěli a znovu spouštěli, což znamená samovýběr podmínky. Publikum tvořily děti ve školní platformě. *Přenositelnost:* vysoká v jednom bodě. Naše publikum zahrnuje začátečníky a měříme podobné veličiny (ochota hrát dál). Výuková matematická hra ale není dovednostní arkáda.

**Shrnutí sekce.** Obrácené U mezi výzvou a potěšením má podporu u expertů a v korelačních datech. U začátečníků a v metrice „jak dlouho hrají“ vítězí spíš vyšší úspěšnost. Nejrobustnější společný jmenovatel je **vnímaná kompetence spolu s jasnými cíli a kontrolou**, nikoli konkrétní procento.

### 2.2 „Pravidlo 85 %“ a optimální míra úspěchu

**V — Wilson, Shenhav, Straccia a Cohen 2019, *Nature Communications* [1].** Autoři analyticky odvodili, že při binární klasifikaci s gaussovským šumem a učení stochastickým gradientním sestupem je optimální tréninková chybovost asi 15,87 %, tedy přesnost zhruba 85 %. Pokud se obtížnost průběžně udržuje v tomto bodě, učení se může zrychlit exponenciálně oproti pevné obtížnosti. Výsledek ověřili *jen simulacemi*: na perceptronu, na dvouvrstvé síti (MNIST) a na biologicky inspirovaném modelu percepčního učení opic (Law a Gold). Nová data od lidí v práci nejsou.
Omezení podle autorů:
- Ne všechny modely mají optimum obtížnosti. Bayesovský učící se systém například na pořadí pokusů nezávisí.
- Při jiném rozložení šumu (Laplaceovo, Cauchyho) se optimum posouvá.
- Úlohy s více kategoriemi a dávkové učení zůstávají otevřené.
- Napojení na subjektivní angažovanost je formulováno jako budoucí test.

*Proč to nepřenášet přímo:*
1. Náš hod není binární klasifikace. Výsledkem je spojitá vzdálenost a úspěch si hráč definuje sám (rekord, další místo).
2. Pravidlo optimalizuje *rychlost učení*. Lomas a kol. [2] ukazují, že maximum učení a maximum angažovanosti se mohou rozcházet.
3. Psychofyzikální „staircase“ procedury cílí na 80–85 % z jiných důvodů: kvůli měření prahu.

*Co z toho lze vzít (H/N):* jako horní orientační pás pro **QTE**, kde úspěch binární je („zasáhl, nebo ne“). Případný cíl úspěšnosti QTE by se měl testovat v pásmu, ne v jednom bodě. A měl by se měřit zvlášť pro začátečníky a pokročilé.

**V — Starší modely motivace k výkonu,** citované v [2] a samostatně neověřené, předpovídaly optimum mnohem níž: Atkinson kolem 50 %, Shapira 25–40 %. Rozpětí odhadů „optimální úspěšnosti“ v literatuře tedy sahá zhruba od 20 % do přes 90 %. Je to silný argument proti jakémukoli jedinému číslu.

### 2.3 Dynamické přizpůsobení obtížnosti (DDA)

**H/technické — Hunicke a Chapman (Hamlet) [6] a Hunicke 2005 [7].** Hamlet v enginu Half-Life sledoval inventář hráče (zdraví, munici) a pravděpodobnostně odhadoval, kdy hráč selže. Zasahoval reaktivně (přesnost a poškození nepřátel, kteří už útočí) nebo proaktivně (vlastnosti nepřátel před objevením). Autoři varují, že proaktivní zásahy se hůř vyhodnocují a mohou vést ke „spirále“ dalších korekcí. Hodnocení s hráči v textu, který jsme ověřili, jen *plánují* (srdeční tep, dvě nastavení). Krátký příspěvek z ACE 2005 [7] jsme ověřili jen bibliograficky přes citace. *Hodnota pro nás:* koncepční rozlišení reaktivní a proaktivní adaptace. Empirický důkaz účinnosti z toho neplyne.

**V — Denisova a Cairns 2015, CHI PLAY [8].** Studie měla 42 účastníků v designu mezi subjekty (20 kontrola, 22 adaptace) a 90sekundovou střílečku. Časovač se podle výkonu nenápadně zrychloval nebo zpomaloval (faktor 1,4, celkem 72–108 s). Adaptivní skupina hlásila vyšší pohlcení (IEQ, F(1,40) = 7,41, p = 0,010, η²p ≈ 0,16), hlavně kognitivní zapojení a kontrolu. **Žádný účastník změnu nezaznamenal** a vnímaná výzva se mezi skupinami nelišila.
*Omezení podle autorů:* jedno krátké sezení, jeden typ hry. Při opakovaném hraní mohou hráči adaptaci odhalit a cítit se „ošizení“. Manipulace s časem byla vybrána právě proto, že ji lidé špatně vnímají.

**V — Denisova a Cairns 2019, *Entertainment Computing* [9].** Dvě studie: 120 účastníků s rychlou střílečkou a 60 účastníků s asi dvacetiminutovou levelovou hrou, kde se upravovalo zdraví, útok a dosah nepřátel. Hráči, kteří *očekávali* adaptaci, se cítili pohlcenější a hru si víc užili, **bez ohledu na to, zda adaptace skutečně existovala**. Informace o adaptaci nesnížila pohlcení, které adaptace sama přinesla. Podrobnější popis adaptace vedl k vyššímu pohlcení než pouhá zmínka. Efekt přetrval i při delším hraní.
*Důsledky:* (a) Placebo efekt komplikuje hodnocení. Při playtestu je nutné neutrální zadání. (b) Transparentnost o adaptaci prožitku nemusí škodit. *Omezení:* měřilo se pohlcení, ne pocit zásluhy na výkonu.

**V — Constant a Levieux 2019, CHI [10].** Hráči ve třech hrách (logické, motorické a smyslové obtížnosti) sázeli na vlastní úspěch, aby se změřila jejich sebedůvěra. Obtížnost byla buď náhodná, nebo řízená DDA. DDA vedla k **vysoké míře přehnané sebedůvěry**. Autoři naznačují, že právě toto posílení sebedůvěry může být součástí pozitivního vlivu DDA. Jde ale o jejich hypotézu, ne o měřený výsledek. Ověřovací kolo: abstrakt a autoři potvrzeni z metadat záznamu (Semantic Scholar, DBLP). Plný text je v ACM za paywallem, otevřenou kopii jsme nenašli, velikost vzorku a velikost efektu proto stále nemáme. Pozor na srovnání: kontrolou byla *náhodná* obtížnost, ne pevná, ručně volená ani transparentně ohlášená. *Pro nás:* DDA může vytvářet pocit „jsem dobrý“, který se nekryje se skutečnou dovedností. U hry, jejímž slibem je „zvládnout přesný hod“, je to riziko.

**V — Smeddinck a kol. 2016, CHI [11].** Ve dvou studiích (40 účastníků s THYFTHYF a upravená hra fl0w) porovnávali volbu obtížnosti v menu, volbu zabudovanou do hry a automatické přizpůsobení. Způsob úpravy ovlivnil **vnímanou autonomii**, ostatní míry prožitku se nezměnily, jak autoři čekali. Automatická adaptace celkový prožitek výrazně nezměnila. *Ověřovací kolo (plný text):* studie 1 měla 40 účastníků, studie 2 (fl0w) jen 18. Abstrakt sice říká, že „většina hráčů vyjadřuje preferenci ruční volby“, ale opírá se o rozhovory. **Pořadí preferovaných podmínek se v žádné studii významně nelišilo** (Friedmanův test, ve studii 2 p = 0,18; vestavěná volba proti automatické jen trend p = 0,08). Ve studii 1 se 9 účastníků vyjádřilo o DDA pozitivně a 6 negativně. Vestavěná volba ve fl0w zvýšila námahu a frustraci (TLX). Tvrzení „hráči preferují ruční volbu“ je proto slabší, než jsme uváděli. Pevněji stojí jen nález o autonomii.

**V/přehled — Guo, Thawonmas a Ren 2024, *Entertainment Computing* [12].** Podle sekundárního popisu abstraktu označují výsledky DDA za „smíšené“ a kritizují přílišné opírání DDA výzkumu o teorii flow. Navrhují DDA podle cílů hráče. Plný text jsme neověřili.

**Shrnutí sekce.** Skrytá DDA v krátkých laboratorních studiích pohlcení spíš zlepšuje a hráči ji často nepoznají. Ruční volba ale podporuje autonomii, očekávání adaptace působí samo o sobě a DDA může přifouknout sebedůvěru. Pro hru postavenou na pocitu vlastního zlepšení je hlavní otázkou *přičitatelnost*, ne pohlcení. Tu zatím přímo neměřila žádná ze studií.

### 2.4 Selhání, paradox selhání a opakování

**V/H — Juul 2009, „Fear of Failing?“ [13].** Prototyp kombinoval Pac-Mana a hada a existoval ve dvou verzích trestu: ztráta energie a ztráta života. Offline test měl 9 testerů, online test 85 hráčů z autorova blogu, převážně mužů. Hráči, kteří ztratili několik životů a pak hru dohráli, ji hodnotili *nejlépe*. Kdo dohrál bez ztráty, hodnotil hůř. Kdo vinu přičítal hře („moc těžké“), hodnotil hůř než ti, kdo ji přičítali vlastní chybě (p < 0,016). Juul z toho vyvozuje, že selhání *přidává obsah*, protože nutí hráče přehodnotit strategii, a že hráči „clearly prefer feeling responsible for failing“. Rozlišuje tresty energií, životem, koncem hry a **ztrátou postupu (setback)**. Kasuální hry podle něj nechrání hráče před odpovědností, ale před nutností opakovat úseky.
*Omezení:* malý sebevybraný vzorek a korelační data o přisouzení viny. Kauzalita může být i obrácená: kdo hraje dobře, hodnotí lépe a viní sebe. *Přenositelnost:* vysoká na úrovni principu. U nás chybí setback trest (každý hod je nový pokus), což odpovídá Juulově doporučení.

**H — Juul 2013, *The Art of Failure* [14].** Kniha formuluje *paradox selhání*: selhání nemáme rádi, a přesto vyhledáváme hry, kde selháváme. Selhání ve hře podle Juula ukazuje na nedostatek *hráče*, ne postavy, a hra pak nabízí cestu ho překonat zlepšením. Ověřili jsme popis od autora a sekundární shrnutí. Plný text kniha nemáme, jde o teoreticko-esejistické dílo (H).

**V — Petralito a kol. 2017, CHI [15].** Průzkum mezi 95 hráči Dark Souls III krátce po vydání. Pozitivní zážitky z náročných sezení souvisely hlavně s momenty úspěchu a *učení*. Tyto momenty umožnily negativní události: obtížnost a smrt postavy. Ověřen abstrakt. *Omezení:* sebevybraní fanoušci extrémně těžké hry a retrospektivní výpovědi. *Přenositelnost:* nízká na úrovni publika, střední na úrovni mechanismu („selhal jsem, pochopil jsem proč, zvládl jsem to“).

**H — Celeste a Assist Mode [33].** Podle sekundárního zdroje (Wikipedie) původně „Cheat Mode“, přejmenovaný, protože název byl příliš odsuzující. Nabízí zpomalení hry, neomezené dashe nebo nesmrtelnost a je volitelný a nenápadný. Tým chtěl, aby hra byla „difficult yet fair“, a používal skryté odpouštěcí mechaniky typu coyote time. *Hodnota:* ukázka transparentní, hráčem zvolené pomoci jako alternativy ke skryté DDA. Empirická data o účinku nemáme.

**Neověřeno:** konkrétní parametry „God Mode“ v Hades (narůstající odolnost po každé smrti). Stránky nešly načíst a parametry neuvádíme.

### 2.5 Near-miss: těsné nezdary ve hrách s dovedností a s náhodou

**V — Clark a kol. 2009, *Neuron* [16].** Studie se zjednodušeným hracím automatem: behaviorální experiment se 40 studenty a fMRI s 15 účastníky. Těsné nezdary byly *méně příjemné* než úplné minutí, ale *zvýšily touhu hrát dál*. Efekt se objevil jen tehdy, když měl hráč **osobní kontrolu** nad nastavením sázky. Když volbu provedl počítač, touhu hrát naopak snižovaly. Aktivovaly se oblasti spojené s výhrou.
*Přenositelnost:* v hazardu je těsný nezdar zavádějící, protože výsledek je náhodný. **V dovednostní hře je těsný nezdar skutečná informace** („byl jsem blízko, příště to dám“). Mechanismus, kdy vnímaná kontrola zesiluje motivační účinek těsného nezdaru, je pro nás relevantní. Etické hranice umělých near-miss řeší blok 2.

**V — Finserås a kol. (online 2019, tisk 2021), *International Journal of Mental Health and Addiction* [17].** 40 účastníků hrálo opakovaně proti avatarům ve čtyřech scénářích: velká a malá prohra, malá a velká výhra. Prohry vyvolaly víc frustrace a lítosti než výhry a vyhrané hry hráči hodnotili lépe. Těsná prohra působila *víc nudně a méně vzrušujícím dojmem* než výhra s velkým náskokem. *Ověřovací kolo (plný text, open access Springer):* šlo o cyklistický závod Full Cycle upravený tak, že výsledek byl předem daný: prohra nebo výhra o ~10 s, nebo o ~0,5 s. Hráčovy volby výsledek neovlivnily. **Nutkání pokračovat (vizuální analogová škála 0–10) se mezi scénáři významně nelišilo. Hypotéza, že těsná prohra zvýší nutkání hrát, se nepotvrdila.** Autoři to staví proti studii s Candy Crush (Larche a kol. 2017), kde těsný nezdar zvýšil nutkání pokračovat i frustraci. Tu jsme sami neověřili.
*Omezení:* malý vzorek a laboratorní souboj s avatarem. Bez kontroly manipulace po experimentu. Hráč výsledek ve skutečnosti neřídil, takže chyběla právě osobní kontrola, na které podle [16] near-miss efekt závisí. *Shrnutí:* že by těsný nezdar sám o sobě motivoval k opakování, je silněji doloženo v hazardu za podmínky osobní kontroly než v dovednostních hrách. Tam jsou data řídká a nejednoznačná.

### 2.6 Frustrace a její role

**H — Gilleade a Dix 2004, ACE [18].** Konceptuální článek o frustraci jako vstupu pro adaptivní hry („affective gaming“). Empirické vyhodnocení neobsahuje, jen zmiňuje probíhající práci na detekci frustrace. Ověřen abstrakt.

**Syntéza z výše uvedených studií (V, nepřímo).** Frustrace a negativní afekt jsou součástí vyvážené výzvy. V [5] měla rovnováha *vyšší* negativní afekt než nuda, a přesto nejvyšší potěšení. Negativní události v [15] umožňují zážitky úspěchu. Frustrace se mění v negativní prožitek, když (a) hráč přisoudí příčinu hře, ne sobě [13], (b) přetížení bere smysluplné volby a kontrolu (autonomie byla v přetížení v [5] nízká a účastníci popisovali „lack of control“), nebo (c) chybí jasná cesta ke zlepšení (Lomas: velmi krátké časové limity nejvíc odrazovaly [2]).

**H — Pracovní rozlišení:** *produktivní frustrace* („vím, co jsem pokazil, a chci to zkusit znovu“) proti *bezmocné frustraci* („nevím proč“ nebo „hra mě podvedla“). Nejde o validovaný konstrukt, ale o praktický nástroj pro playtest. Navazuje na rozlišení „nevšiml si, nepochopil, věděl, ale netrefil“ v K3 stávající KB.

### 2.7 Dovednost proti náhodě a přičitatelnost

Přímou empirickou studii o tom, jak poměr dovednosti a náhody v jednoduché arkádě ovlivňuje motivaci, se v této rešerši ověřit nepodařilo. Klasická práce Langerové o iluzi kontroly zůstala **neověřená**.

**Ověřovací kolo — Depping a Mandryk 2017 [34]:** vyšla na CHI 2017 (ne CHI PLAY), s. 1040–1052. Podle metadat (Crossref, Unpaywall) a výňatku z abstraktu jde o **konceptualizaci připisování příčin hráčem a vývoj a validaci škály**, ne o experiment, který by ukazoval, že připisování úspěchu sobě zlepšuje prožitek. Plný text je uzavřený. Pro P7, 03 N8 a naši N4 to znamená, že tato práce není empirickou oporou tvrzení. Je kandidátem na *měřicí nástroj* do playtestu (otázka „proč hod dopadl lépe“ by šla nahradit validovanou škálou). Znění položek a licenci jsme neověřili.

Z ověřených zdrojů plyne:
- **V:** Hráči preferují pocit odpovědnosti za selhání [13].
- **V:** Motivační účinek těsného nezdaru závisí na osobní kontrole [16].
- **V/H:** Úspěch zvyšuje motivaci hlavně tehdy, když ho hráč připíše své kompetenci [2], což je hypotéza autorů.
- **V:** DDA může přifouknout sebedůvěru [10]. Zpětná vazba po dobrých pokusech zvyšuje dojem učení bez skutečného učení [29].

**H/N — Důsledek:** Náhodu ve výsledku (u nás seedovaný rozptyl a QTE) má hráč vnímat jako *podmínku*, na kterou reaguje, ne jako *příčinu* výsledku. Rozpis výsledku má oddělit, co udělal hráč (úhel, síla, zásahy), od toho, co přidala hra (vylepšení, odpuštění).

### 2.8 Motorické učení: znalost výsledku (KR) a výkonu (KP)

**Pojmy.** *KR (knowledge of results):* informace o výsledku vzhledem k cíli, například „dolet 312 m, o 20 m kratší než rekord“. *KP (knowledge of performance):* informace o provedení pohybu, například „úhel 38°, síla 74 %“. Výsledková obrazovka Just Throw It už dnes dává obojí: vzdálenost je KR, úhel a síla jsou KP.

**Typy KR podle informační hodnoty** [23], terminologie podle Lufta, citovaná v [23]:
- *chybová:* velikost a směr chyby, „-42 cm“,
- *stupňovaná (graded):* hrubě směr nebo velikost, „moc daleko“,
- *binární:* „trefa / minul“.

**V — St. Germain a kol. 2023, *Psychonomic Bulletin & Review* [23].** Dva experimenty, celkem N = 228. Úloha byla rychlý pohyb loktem s prostorovým cílem (40°) a časovým cílem (225 ms). Chybová i stupňovaná KR („too short/too far“, „too fast/too slow“) vedly ke zlepšení a k učení, které přetrvalo do retenčního testu. **Při binární KR se výkon oproti pre-testu nezlepšil vůbec.** Druh KR ovlivnil také vnímanou kompetenci. Autoři v tom vidí oddělitelnou motivační a informační roli zpětné vazby.
*Omezení:* laboratorní úloha bez vizuální kontroly končetiny, 72 tréninkových pokusů a mladí dospělí. *Přenositelnost:* vysoká na úrovni formátu nápovědy. „Zkus o kus plošeji“ je stupňovaná KR se směrem i hrubou velikostí („o kus“ proti „mnohem“), tedy ve formátu, který v této studii fungoval.

**V — Zhou, Shao a Wang 2021, systematický přehled [32].** 23 studií o zpětné vazbě v tělesné výchově. Pochvala spojená s informací měla střední důkazy výhody oproti samotné pochvale. Důkazy o frekvenci zpětné vazby jsou řídké. Kvalita studií byla převážně nízká: 15 z 23 mělo nízké hodnocení PEDro a 18 z 23 nebylo randomizovaných. *Přenositelnost:* nízká, jde o jiný kontext. Podporuje ale kombinaci „pochvala a konkrétní informace“ místo prázdného „Skvělé!“.

### 2.9 Hypotéza vedení (guidance hypothesis) a frekvence zpětné vazby

**V — Salmoni, Schmidt a Walter 1984, *Psychological Bulletin* 95, 355–386 [19].** Klíčový přehled, ze kterého vychází hypotéza vedení: častá a snadno použitelná zpětná vazba zlepšuje výkon během tréninku. Učící se na ni ale může spoléhat, zanedbává vlastní vnitřní zpětnou vazbu a nevybuduje si vnitřní detekci chyb. Po odebrání zpětné vazby pak podává horší výkon. Klíčový metodický přínos přehledu: rozlišovat *výkon během tréninku* od *učení*, které se měří v retenčním testu bez zpětné vazby. Původní text jsme neotevřeli, citaci a obsah jsme ověřili ze sekundárních zdrojů [21][22]. Ověřovací kolo doplnilo z referencí [21] ročník, číslo a DOI (95(3), 10.1037/0033-2909.95.3.355). Originál zůstává neotevřený.

**V — Winstein a Schmidt 1990 [20].** Zpětná vazba po 50 % pokusů vedla k lepší retenci než po 100 % pokusů, přestože výkon během tréninku byl horší. Šlo o sekvenční prostorově-časové úlohy. Studii jsme ověřili jen sekundárně přes Reid a Swafford 2020 [21]. Ti uvádějí, že efekt byl replikován „široce, i když ne univerzálně“. *Ověřovací kolo:* citace podle [21] je *J. Exp. Psychol.: Learning, Memory, and Cognition* 16(4), 677–691. Marschall a kol. [22] (plný text) ji uvádějí mezi studiemi, kde **experiment 1 neukázal škodlivost plné zpětné vazby pro učení**. Efekt tedy nebyl konzistentní ani uvnitř této klíčové práce. **Údaj „33 %“ zůstává neověřený.** Reid a Swafford také upozorňují, že lidské studie mívají jen asi 20–30 tréninkových pokusů.

**V — Marschall, Bund a Wiemeyer 2007, meta-analýza [22].** 40 studií, model náhodných efektů. „Efekt obrácení“ (menší frekvence zhorší trénink a zlepší učení) se projevil **jen jako slabý globální efekt**. Moderátorová analýza ho našla jen u laboratorních úloh, při učení parametrů pohybu a při velmi rozsáhlém tréninku. Celkově podle autorů redukovaná frekvence zpětné vazby nemá jiný účinek než plná, i když tento závěr zčásti stojí na vote-countingu. Autoři z toho dělají „zproštění viny“: není nutné dávat zpětnou vazbu po každém pokusu, ale ani to zjevně neškodí.
*Ověřovací kolo (plný text):* autoři publikační zkreslení přímo testovali. Ze 43 studií, které nešlo zahrnout kvůli chybějícím statistikám, efekt obrácení potvrdily jen 4 a 39 ne. Mezi zahrnutými to bylo 14 : 11 (pro fázi tréninku). K tomu počítali fail-safe N. Redukce zpětné vazby se ve studiích pohybovala nejčastěji mezi 33 a 66 % a nad 66 % nebyla žádná studie. Jen 12 studií uvádělo úplné výsledky a jen 2 velikosti efektu.
*Omezení:* starší meta-analýza (sběr 2001) bez moderních modelů korekce zkreslení (PET-PEESE, výběrové modely). Původní formulace „bez korekcí“ byla nepřesná: zkreslení autoři doložili vote-countingem a fail-safe N.

**Přenositelnost celé sekce.** Pozor na zásadní rozdíl: v motorickém učení je cílem výkon *bez* zpětné vazby (retence a přenos). Ve hře zpětná vazba nikdy nezmizí. Pro nás je relevantní hlavně (a) **riziko závislosti**: když hráč jen poslouchá nápovědu, nenaučí se „číst“ let, a (b) **přičitatelnost**: zlepšení podle nápovědy může působit jako zásluha hry. Učení parametru (úhel, síla) je přitom přesně ten typ úlohy, kde moderátorová analýza [22] efekt obrácení našla.

### 2.10 Samořízená zpětná vazba, OPTIMAL teorie a replikační krize

**Teorie — Wulf a Lewthwaite 2016, *Psychonomic Bulletin & Review* 23(5), 1382–1414 [27].** OPTIMAL teorie tvrdí, že učení podporují tři faktory: *posílená očekávání* úspěchu, *autonomie* (například volba, kdy dostat zpětnou vazbu) a *vnější fokus pozornosti* (na účinek pohybu, ne na tělo). Spojují je s dopaminovou odpovědí a s „pevnějším propojením cílů a akcí“. Ověřen abstrakt.

**V — Původní nálezy.** Chiviacowsky a Wulf 2007 [28]: hod sáčkem nedominantní rukou. Skupina, která dostávala KR po třech *nejlepších* pokusech z každého bloku, měla lepší retenci než skupina s KR po třech nejhorších, přestože se výkon během tréninku nelišil. Autoři to vykládají motivační funkcí zpětné vazby. Ověřen abstrakt.

**V — Replikace a korekce:**
- **Carter, Smith a Ste-Marie 2016, *Human Movement Science* [29].** N = 40, hod míčkem na terč, design 2 × 2 (dobré nebo špatné pokusy, s vědomím manipulace nebo bez). Rozdíl v učení ani výkonu se neobjevil. **Zpětná vazba po dobrých pokusech ale výrazně zvýšila odhad vlastního učení (judgments of learning)**, a to i u účastníků, kteří o manipulaci věděli. Ověřen plný text.
- **McKay, Yantha, Hussien, Carter a Ste-Marie 2022, *Meta-Psychology* [24].** Předregistrovaná meta-analýza samořízené praxe s otevřenými daty. Naivní model dal g = 0,44 (k = 52, N = 2061). Přínos ale ukazovaly jen *publikované* studie. Model korigující selektivní publikování odhadl g ≈ 0,11 (95% CI 0,05–0,18). P-curve nenaznačila průkaznou hodnotu, citlivostní analýzy konvergovaly k triviálně malým efektům. Závěr autorů: přínos je malý a „není v současnosti odlišitelný od nuly“. Ověřen plný text abstraktu.
- **McKay, Bacelar, Parma, Miller a Carter 2022, preprint [25].** Robustní bayesovská reanalýza dvou meta-analýz (samořízená praxe a posílená očekávání). Zkreslení podle ní efekty podstatně nafouklo, skutečné efekty jsou malé, nejisté a možná nulové. **Odhadovaná průměrná statistická síla původních studií je asi 6 %.** Motivační pilíř OPTIMAL teorie podle autorů literatura dostatečně nepodporuje. Jde o preprint, ověřen abstrakt.
- **Bacelar a kol. 2022 [26],** meta-analýza posílených očekávání: původně g ≈ 0,54, ale už autoři upozorňovali na metodické problémy. Ověřeno jen sekundárně.
- **St. Germain a kol. 2023 [23],** N = 228, předregistrovaný přístup s výpočtem síly. **Žádná výhoda samořízené zpětné vazby.** Volba nezvýšila vnímanou autonomii, kompetenci ani vnitřní motivaci a nezlepšila odhad vlastních chyb.

**Shrnutí sekce.** Pro herní design z toho plyne, že **volba nad zpětnou vazbou pravděpodobně nezrychlí učení**. Neznamená to ale, že volba je bezcenná. Hráči ruční volbu preferují a podporuje autonomii [11]. To jsou odlišné cíle. Dopaminová rétorika OPTIMAL teorie by v našich dokumentech neměla sloužit jako zdůvodnění (srov. S4 ve stávající KB).

### 2.11 Variabilita tréninku a učení hodu

**V — Raviv, Lupyan a Green 2022, *Trends in Cognitive Sciences* [30].** Přehled více než 150 studií z několika oborů včetně motorického učení. Variabilita vstupů obvykle ztěžuje počáteční učení, ale zlepšuje zobecnění. „Variabilita“ přitom zahrnuje nejméně čtyři odlišné druhy, které nebyly přímo srovnány, a přínos závisí na tom, zda je variabilita pro úlohu relevantní. *Ověřovací kolo (autorský rukopis, eprints Glasgow):* čtyři druhy jsou počet příkladů, jejich odlišnost, rozmanitost kontextu a rozvrh (prokládání, rozestupy). Žádná studie je přímo nesrovnala. Začátečníci a děti mají z nízké variability v počátcích prospěch, příliš brzká variabilita je může zahltit („starting small“). U zkušenějších je tomu naopak. Přehled se týká *učení a zobecnění*, ne předvídatelnosti časového signálu ani memorování. Pro stálý střed QTE (N10) je proto oporou jen nepřímou.

**V — Caballero, Barbado, Peláez a Moreno 2024, PeerJ [31].** 63 analyzovaných dospělých, podhozy tenisovým míčkem na terč na zdi, 8 tréninků během 2 týdnů a retence až po 1 měsíci. Variabilita byla dána rozptylem pozic terče (konstantní, nízká, střední, vysoká). Zlepšily se všechny tréninkové skupiny a rozdíly mezi nimi nebyly statisticky významné. Největší efekt a „reziduální učení“ měla *nízká* variabilita. Předpokládané obrácené U se nepotvrdilo. Název studie zní „More is not better“.
*Omezení:* malé skupiny (10–15), libovolně zvolené úrovně variability a nesrovnalosti v reportování (65 vs. 63 osob, p = 0,29 vs. 0,029). *Přenositelnost:* střední. Jde o hod na cíl, ale v reálném motorickém prostoru.

**V (ze sekundárních shrnutí, neověřeno v originále):** Výhody proměnlivé praxe u hodu se podle starších studií ukazovaly spíš u dětí než u dospělých a mohou po týdnech mizet.

**Učení úhlu a síly hodu.** Specifickou studii o tom, jak lidé ve hře nebo v realitě učí *úhel vypuštění* projektilu, se nám ověřit nepodařilo ani v ověřovacím kole. Jediný nalezený kandidát, Zhu, Dapena a Bingham 2009 (učení hodu na dálku, úhel a rychlost vypuštění jako dvě řízené proměnné), nešel stáhnout (odkaz vrací 404). Biomechanické práce ukazují jen to, že optimální úhel jednotlivce se kvůli kompromisu mezi rychlostí a úhlem liší od teoretické hodnoty. To platí pro reálný hod, ne pro naši arkádovou fyziku. Ověřené studie hodu na terč [28][29][31] se týkají přesnosti, ne volby úhlu. **N:** Náš úkol je kombinace volby parametru (úhel, rozhodnutí) a časování (síla, motorika). Literatura o učení parametrů [22] a o KR [23] je proto relevantnější než biomechanika.

---

## 3. Rozpory a otevřené otázky

1. **Optimální úspěšnost:** 85 % [1] (simulace, rychlost učení) × co nejvyšší úspěšnost pro angažovanost začátečníků [2] × přibližně 20 % pro potěšení šachistů [3, přes 2] × 50 % podle Atkinsona [přes 2]. Rozpor se z velké části vysvětluje tím, *co* se maximalizuje (učení, doba hraní, potěšení) a *kdo* hraje (začátečník nebo expert). Pro dovednostní arkádu se spojitým výsledkem chybí přímá data.
2. **Učení × angažovanost:** Lomas [2] našel obrácený vztah. Snazší hra udrží hráče déle, ale učí pomaleji. Hra, jejímž cílem je „zvládnout přesný hod“, tento konflikt musí nějak vyřešit, například tak, že lehký začátek postupně přejde v náročnější.
3. **Skrytá × transparentní adaptace:** Skrytá DDA zlepšila pohlcení [8]. Očekávaná DDA ho zlepšila taky [9]. DDA přifukuje sebedůvěru oproti náhodné obtížnosti [10]. Ruční volba zvyšuje vnímanou autonomii, preference v pořadí ale nebyla významná [11]. Přímo nebylo měřeno, zda skrytá adaptace snižuje pocit *vlastní* zásluhy po jejím odhalení. Riziko „short changed“ zmiňují autoři [8] jen jako hypotézu.
4. **Pocit zlepšení × skutečné zlepšení:** Zpětná vazba po dobrých pokusech zvyšuje subjektivní dojem učení bez rozdílu v učení [29]. DDA zvyšuje sebedůvěru [10]. Kde končí legitimní zvýraznění pokroku a začíná klam? Otevřená etická otázka, navazuje na blok 2.
5. **Hypotéza vedení ve hře:** Je u hry, kde zpětná vazba nikdy nezmizí, „závislost na nápovědě“ vůbec problém? Nebo je problémem jen pro pocit vlastní zásluhy? Literatura to neřeší. Data o retenci se nevztahují přímo na prožitek.
6. **Near-miss v dovednostních hrách:** Motivační efekt je robustní v hazardu s osobní kontrolou [16]. V soutěžní videohře vedla těsná prohra spíš k nudě a menšímu vzrušení než velká výhra a nutkání pokračovat nezvýšila [17]. Výsledek tam ale byl předem daný, takže chyběla skutečná kontrola. Opačný nález z Candy Crush (Larche 2017) známe jen z citace v [17]. Jak působí „těsně pod rekordem“ v sólové arkádě, kde výsledek hráč opravdu řídí, nevíme. Rozpor R-I1 (blok 02 proti 04): formulace bloku 04 platí. Dovednostní data jsou řídká a jediná ověřená studie efekt nenašla.
7. **Replikační stav motorického učení:** Velká část populárních doporučení (samořízení, motivace „dobrými pokusy“, posílená očekávání) má po korekci zkreslení slabou oporu [23–25]. Robustnější se zdá samotná **informační hodnota** zpětné vazby (směrová vs. binární [23]), ale i ta stojí na jedné předregistrované studii.
8. **Neověřené a chybějící (stav po ověřovacím kole):** Keller a Bless 2008 (flow v Tetrisu), Langer 1975 (iluze kontroly), parametry God Mode v Hades, studie o učení úhlu vypuštění, plné texty Abuhamdeh 2012, Constant 2019 a Salmoni 1984 a údaj „33 %“ u Winstein a Schmidt 1990. Zohaib 2018 [35] je ověřen jen abstraktem: jde o přehled technických přístupů k DDA bez nového důkazu o prožitku. Depping a Mandryk 2017 [34] je škála, ne experiment (viz 2.7).

---

## 4. Relevance pro Just Throw It — kandidátní implikace (N)

Vše níže je **N**: hypotézy k testu, ne rozhodnutí. Odkazy na mechaniky vycházejí z `README.md` a `CLAUDE.md` k verzi 0.6.1.

**N1 — Nápověda úhlu: hlásit odchylku, nepředepisovat ideální hodnotu.** *(Přeformulováno v ověřovacím kole, původně „směrová a hrubá, nikdy číselná“. Viz rozpor R-N3.)* Současná nápověda („Úhel sedí“, „Zkus o kus plošeji“, „Zkus mnohem strměji“) je stupňovaná KR. Tento formát v [23] fungoval, binární ne. Ke zlepšení a učení ale vedla i *chybová* KR s přesným číslem. Zákaz čísel jako takových tedy z evidence neplyne. Rozhodující je rozdíl mezi:
- **hlášením odchylky** od toho, co hráč udělal („o 6° strměji, než by bylo ideální“, „pustil jsi 0,3 s po vrcholu“). To je KR a s evidencí [23] je v souladu, stejně jako návrhy 02 N2, 06 N3 a 07 N9;
- **předepsáním ideální hodnoty** („ideální úhel 23°“, tedy přímé zobrazení `bestAngle`). Hráč by pak jen opisoval a zlepšení by patřilo hře (riziko podle [19][2]). Tato část původní N1 platí dál, opora je ale hypotéza vedení, kterou [22] hodnotí jako slabou.

Pásmo „Úhel sedí“ funguje jako bandwidth KR: v toleranci hra mlčí o korekci a potvrzuje. Zda je lepší hrubá, nebo přesná odchylka, z literatury nevyplývá a patří do testu.

**N2 — Postupné ustupování nápovědy (fading).** Při 100% nápovědě po každém hodu hrozí, že hráč spoléhá na vedení [19][20]. Efekt je slabý a závisí na kontextu [22], ale u učení parametrů se objevuje. Testovat variantu, kdy nápověda po několika hodech v toleranci přestane chodit automaticky a objeví se znovu, až se hráč opakovaně netrefí. *(Ověřovací kolo, rozpor R-N2 s 07 N2:)* Trvalé tlačítko „Poradit?“ z návrhu vypouštíme. V Refraction obecné tlačítko nápovědy snížilo počet dokončených úrovní o 12 % a dobu hraní o 15 % (07 [Z1]). Samořízení nezrychluje učení [23][24]. Argument „hráči preferují volbu“ [11] po přečtení plného textu oslabil (pořadí preferencí nebylo významné, robustní je jen autonomie). Ustupující nápověda spouštěná chybou je se 07 N2 v souladu. Ruční vyžádání nechat nanejvýš jako testovanou variantu, ne výchozí návrh.

**N3 — KR místo předpisu, kde to jde.** Kromě textové nápovědy zvážit vizuální KR: stopu minulé dráhy (ghost) vedle současné, nebo vyznačení „kde by dopadl o 5° plošší hod“ až po několika pokusech. Hráč tak sám vidí *příčinu*, což podporuje vnitřní detekci chyb a přičitatelnost [19][2]. Ověřit, že mobilní obrazovka zůstane čitelná (blok 7).

**N4 — Přičitatelnost ve výsledkovém rozpisu.** Přehyby odpouštějí nepřesnou sílu (15 % za úroveň) a rozšiřují okna QTE. Je to odpouštěcí mechanika a hráč ji kupuje vědomě, tedy transparentní pomoc, ne skrytá DDA. Ve výsledcích oddělit „tvůj hod“ (úhel, síla, zásahy) od „bonusu vylepšení“. Hráč tak vidí, co je jeho zásluha [10][13]. Kritérium testu: hráči v rozhovoru správně popíšou, proč hod dopadl lépe.

**N5 — Žádná skrytá adaptace QTE ani síly.** Stávající KB už říká „nezvyšovat obtížnost skrytě“. Výzkum ukazuje, že skrytá DDA by mohla zvýšit pohlcení [8]. U hry se slibem „zvládni přesný hod“ ale hrozí přifouknutá sebedůvěra [10] a pocit ošizení po odhalení [8]. Opora [10] je jen abstrakt a srovnává DDA s náhodnou, ne s pevnou obtížností. Pocit ošizení je v [8] hypotéza autorů. N5 je proto spíš hodnotová volba (přičitatelnost) než závěr z dat. Pokud vůbec adaptovat, pak transparentně a s volbou hráče, například nabídkou „širší okno“ po sérii nezdarů [11][33]. Při playtestu ji popisovat neutrálně kvůli placebu [9].

**N6 — Úspěšnost QTE měřit v pásmech, ne cílit na 85 %.** Pracovně zaznamenávat úspěšnost poryvu a holuba zvlášť pro první minuty a pro pozdější hru. Orientační pás pro test je kolem 70–90 % u začátečníků v prvních QTE. Vychází z [1] jako horní kotvy a z [2] (začátečníci preferují vysokou úspěšnost). Je to naše volba, ne výzkumný parametr. Velmi krátká okna nejvíc odrazovala [2], takže nezužovat okna jako první krok obtížnosti.

**N7 — Selhání levné a informativní.** Krátký let bez trestu a okamžité „Znovu“ odpovídají Juulovu doporučení vyhnout se ztrátě postupu [13]. Doplnit, aby každé selhání neslo *jednu* srozumitelnou příčinu: úhel, síla, nebo zmeškaná událost. Hráč pak přisoudí neúspěch sobě a ví, co změnit [13][2]. Rozlišovat v playtestu produktivní a bezmocnou frustraci (2.6).

**N8 — „Těsně pod rekordem“ jen pravdivě.** Údaj „o 12 m od rekordu“ nebo „do dalšího místa chybělo 40 m“ je v dovednostní hře skutečná informace. Za podmínky kontroly může motivovat [16]. Nikdy ho však nefabrikovat ani nenafukovat (blok 2). Testovat, zda podporuje opakování, nebo spíš frustraci [17]. Jediná ověřená videoherní studie [17] zvýšení nutkání pokračovat nenašla. Neočekávat proto od zobrazení těsnosti retenční efekt. Jeho hodnota je hlavně informační (KR).

**N9 — Zvýrazňovat skutečný pokrok, ne vybrané dobré pokusy.** Zpětná vazba jen po dobrých pokusech zvyšuje *dojem* učení bez skutečného učení [29]. Zobrazovat proto trend (průměr posledních pěti hodů nebo rekord za sezení) z úplných dat. Neschovávat špatné hody a nepoužívat výběr, který klame. Pochvalu spojovat s konkrétní informací („Rekord! Úhel i síla v pásmu“) [32].

**N10 — Začátek lehký, náročnost přidávat novými podmínkami, ne zúžením oken.** Lomasova hypotéza expertízy [2] a nálezy o nudě a přetížení [5] naznačují: první hody by měly mít vysokou úspěšnost a jasné „mám to“. Výzvu přidávat novou proměnnou, ne trestem. Kandidát je vítr, dnes vždy nulový: s nízkou variabilitou podle [31] a jen s malým rozptylem. Nápověda úhlu pak musí vítr zohlednit, jinak bude lhát. ~~Na to, že stejný střed okna QTE lze naučit nazpaměť (známý problém), aplikovat totéž: malou, ne velkou variabilitu [30][31].~~ *Ověřovací kolo (rozpor R-N1 s 06 N4):* [30][31] se týkají variability *cílů* při učení hodu, ne předvídatelnosti časového signálu. Pro střed QTE nejsou přímou oporou. Měřítkem „malé“ a „velké“ variability u QTE má být přesnost odměřování intervalu. Podle Wearden 1991 (blok 06, plný text) má lidská produkce intervalu bez počítání variační koeficient 0,10–0,16, takže kolem 0,6 s je SD asi 60–100 ms. Posun středu o ±150–250 ms je **malý vůči délce pruhu (1,2 s)**, ale **velký vůči přesnosti odměřování** (asi 2–4 SD). Proto znemožní memorovat perfektní zásah a běžný úspěch většinou ponechá. Obě implikace jsou tedy slučitelné: variabilitu přidávat postupně (nejdřív stálý střed, potom posuny), v duchu „starting small“ [30]. Výpočty jsou v 06 §3.4.

**N11 — Feedforward u volitelných výzev.** Lomas navrhuje říct hráči předem, jak těžký úkol je [2]. U milníků a míst zvážit značku obtížnosti („těžký úsek: maják“), aby si hráč úspěchu cenil. Navazuje na blok 8.

**Návrh měření pro playtest (N):**
- úspěšnost QTE podle pořadí události a minuty hry,
- počet hodů do prvního „Úhel sedí“ a stabilita úhlu po něm (učí se, nebo opisuje?),
- podíl hodů, kdy hráč změnil úhel po nápovědě ve směru nápovědy,
- otázka po hraní: „Proč byl tvůj nejlepší hod lepší než ostatní?“ (přičitatelnost; správná odpověď zmíní úhel nebo sílu, ne „hra mi pomohla“). Kandidát na standardizované měření je škála připisování příčin [34], obsah položek je zatím neověřený,
- srovnání varianty se stálou nápovědou a s ustupující nápovědou, s neutrálním popisem.

---

## 5. Co tento blok neřeší

- Přesná časová okna QTE, dotyková latence a mechanika nabíjení síly → blok 6.
- Etika near-miss a náhodných odměn → blok 2.
- Podoba výsledkové obrazovky a onboarding → blok 7.
- Juice a vnímaná kompetence z odezvy → blok 5.

---

## 6. Registr zdrojů

Kvalita: **A** recenzovaná studie nebo meta-analýza s ověřeným plným textem · **B** recenzovaná práce s ověřeným abstraktem · **C** preprint, sekundární ověření nebo malý vzorek · **H** heuristika, kniha nebo esej. „Ověřeno“ říká, co jsme 13. 10. 2026 skutečně otevřeli. *Sjednocení (README §3.4):* u studií citovaných i v jiných blocích je písmeno sjednocené napříč KB podle kvality důkazu, ne jen podle úrovně ověření. Recenzovaný laboratorní experiment s malým vzorkem je **B**, s předem daným výsledkem a bez kontroly manipulace **B−** (Klarkowski [5], Clark [16], Finserås [17]).

| # | Zdroj | Typ | Ověřeno | Kvalita |
|---|---|---|---|---|
| 1 | Wilson, R. C., Shenhav, A., Straccia, M., & Cohen, J. D. (2019). The Eighty Five Percent Rule for optimal learning. *Nature Communications*, 10, 4646. https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579 · DOI 10.1038/s41467-019-12552-4 | teoretická analýza a simulace, bez lidských dat | plný text (PMC) | A (pro tvrzení o modelu), C (pro přenos na lidi) |
| 2 | Lomas, D., Patel, K., Forlizzi, J. L., & Koedinger, K. R. (2013). Optimizing challenge in an educational game using large-scale design experiments. *CHI 2013*, 89–98. https://www.stat.cmu.edu/~brian/463-663/project-part-one/Optimizing%20Challenge.pdf · DOI 10.1145/2470654.2470668 | 2 online RCT, ~10 000 a 69 642 sezení | plný text | A |
| 3 | Abuhamdeh, S., & Csikszentmihalyi, M. (2012). The importance of challenge for the enjoyment of intrinsically motivated, goal-directed activities. *PSPB*, 38(3), 317–330. https://scholar.usuhs.edu/en/publications/the-importance-of-challenge-for-the-enjoyment-of-intrinsically-mo/ · DOI 10.1177/0146167211427147 | observační studie (šachy) a ESM | abstrakt; údaj „~20 %“ jen přes [2] (ověřovací kolo 13. 10. 2026: definice v [2] ověřena, rozdíl ratingu ~262 bodů; originál uzavřený, PDF nenalezeno) | B |
| 4 | Fong, C. J., Zaleski, D. J., & Leach, J. K. (2015; online 2014). The challenge–skill balance and antecedents of flow: A meta-analytic investigation. *Journal of Positive Psychology*, 10(5), 425–446. https://www.instituteofcoaching.org/resources/challenge%E2%80%93skill-balance-and-antecedents-flow-meta-analytic-investigation | meta-analýza 28 studií | abstrakt | B |
| 5 | Klarkowski, M., Johnson, D., Wyeth, P., McEwan, M., Phillips, C., & Smith, S. (2016). Operationalising and evaluating sub-optimal and optimal play experiences through challenge-skill manipulation. *CHI 2016*, 5583–5594. https://www.cs.mcgill.ca/~jeromew/data/COMP766/CHI2016/p5583-klarkowski.pdf · DOI 10.1145/2858036.2858563 | experiment uvnitř subjektů, n = 45 | plný text | B (malý vzorek; sjednoceno s 01 [22]) |
| 6 | Hunicke, R., & Chapman, V. (2004). AI for Dynamic Difficulty Adjustment in Games. https://users.cs.northwestern.edu/~hunicke/pubs/Hamlet.pdf | technický/koncepční článek; místo publikace (pravděpodobně workshop AAAI) neověřeno | plný text | H |
| 7 | Hunicke, R. (2005). The case for dynamic difficulty adjustment in games. *ACE 2005*, 429–433 (stránkování se v citacích liší). | krátký článek | jen bibliograficky | H/C |
| 8 | Denisova, A., & Cairns, P. (2015). Adaptation in digital games: The effect of challenge adjustment on player performance and experience. *CHI PLAY '15*, 97–101. https://www-users.york.ac.uk/~pc530/pubs/Denisova_CHIPLAY15.pdf · DOI 10.1145/2793107.2793141 | experiment mezi subjekty, n = 42 | plný text | A (malý vzorek) |
| 9 | Denisova, A., & Cairns, P. (2019). Player experience and deceptive expectations of difficulty adaptation in digital games. *Entertainment Computing*, 29, 56–68. https://www-users.york.ac.uk/~pc530/pubs/Denisova_EntCom19.pdf · DOI 10.1016/j.entcom.2018.12.001 | 2 experimenty, n = 120 a 60 | plný text (závěry, metody) | A |
| 10 | Constant, T., & Levieux, G. (2019). Dynamic difficulty adjustment impact on players' confidence. *CHI 2019*. DOI 10.1145/3290605.3300693 | experiment, 3 hry, DDA proti náhodné obtížnosti | abstrakt ověřen 13. 10. 2026 (Semantic Scholar, DBLP conf/chi/ConstantL19); plný text uzavřený (ACM 403), n neověřeno | B |
| 11 | Smeddinck, J. D., Mandryk, R. L., Birk, M. V., Gerling, K. M., Barsilowski, D., & Malaka, R. (2016). How to present game difficulty choices? Exploring the impact on player experience. *CHI 2016*, 5595–5607. https://www.cs.mcgill.ca/~jeromew/data/COMP766/CHI2016/p5595-smeddinck.pdf | 2 experimenty (n = 40 a n = 18) | plný text, ověřeno 13. 10. 2026; preference v pořadí nevýznamná | B (malé vzorky) |
| 12 | Guo, Z., Thawonmas, R., & Ren, X. (2024). Rethinking dynamic difficulty adjustment for video game design. *Entertainment Computing*, 50, 100663. https://www.universityxp.com/research/2026/5/11/rethinking-dynamic-difficulty-adjustment-for-video-game-design | přehled/koncept | jen sekundární popis abstraktu | C |
| 13 | Juul, J. (2009). Fear of Failing? The Many Meanings of Difficulty in Video Games. In M. J. P. Wolf & B. Perron (Eds.), *The Video Game Theory Reader 2* (pp. 237–252). Routledge. https://jesperjuul.net/text/fearoffailing/ | esej a malá hráčská studie (n = 9 + 85) | plný text | C/H |
| 14 | Juul, J. (2013). *The Art of Failure: An Essay on the Pain of Playing Video Games*. MIT Press. https://www.jesperjuul.net/artoffailure | kniha (esej) | popis autora a sekundární shrnutí | H |
| 15 | Petralito, S., Brühlmann, F., Iten, G., Mekler, E. D., & Opwis, K. (2017). A good reason to die: How avatar death and high challenges enable positive experiences. *CHI 2017*, 5087–5097. DOI 10.1145/3025453.3026047 | průzkum, n = 95 | abstrakt | B |
| 16 | Clark, L., Lawrence, A. J., Astley-Jones, F., & Gray, N. (2009). Gambling near-misses enhance motivation to gamble and recruit win-related brain circuitry. *Neuron*, 61(3), 481–490. https://pmc.ncbi.nlm.nih.gov/articles/PMC2658737/ | experiment (n = 40) a fMRI (n = 15) | plný text (PMC) | B (malé vzorky; sjednoceno s 02 [5]) |
| 17 | Finserås, T. R., Krossbakken, E., Pallesen, S., Mentzoni, R., King, D. L., Griffiths, M. D., & Molde, H. (2021; online 2019). Near miss in a video game: An experimental study. *International Journal of Mental Health and Addiction*, 19(2), 418–428. https://bora.uib.no/bora-xmlui/handle/1956/23601 · DOI 10.1007/s11469-019-00070-9 (open access: https://link.springer.com/content/pdf/10.1007/s11469-019-00070-9.pdf) | experiment uvnitř subjektů, n = 40, předem daný výsledek | plný text, ověřeno 13. 10. 2026 | B− (malý vzorek, předem daný výsledek, bez kontroly manipulace; sjednoceno s 02 [31]) |
| 18 | Gilleade, K. M., & Dix, A. (2004). Using frustration in the design of adaptive videogames. *ACE 2004*, 228–232. https://alandix.com/academic/papers/ACE2004-frustration · DOI 10.1145/1067343.1067372 | koncepční článek | abstrakt | H |
| 19 | Salmoni, A. W., Schmidt, R. A., & Walter, C. B. (1984). Knowledge of results and motor learning: A review and critical reappraisal. *Psychological Bulletin*, 95(3), 355–386. DOI 10.1037/0033-2909.95.3.355 | přehled | jen sekundárně (citace a popis v [21], [22] a dalších); bibliografie ověřena z referencí [21] 13. 10. 2026 | C (klasika, neotevřeno) |
| 20 | Winstein, C. J., & Schmidt, R. A. (1990). Reduced frequency of knowledge of results enhances motor skill learning. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 16(4), 677–691. DOI 10.1037/0278-7393.16.4.677 | experiment | jen sekundárně přes [21] a [22] (plné texty, 13. 10. 2026); bibliografie ověřena, „33 %“ neověřeno | C |
| 21 | Reid, A. K., & Swafford, P. G. B. (2020). Reduced frequency of knowledge of results enhances acquisition of skills in rats as in humans. *Frontiers in Psychology*, 11, 846. https://pmc.ncbi.nlm.nih.gov/articles/PMC7205416 | experiment (potkani) a přehled úvodu | plný text (PDF Frontiers, 13. 10. 2026) | B |
| 22 | Marschall, F., Bund, A., & Wiemeyer, J. (2007). Does frequent augmented feedback really degrade learning? A meta-analysis. *E-Journal Bewegung und Training*, 1, 75–86 (stránkování neověřeno). https://orbilu.uni.lu/bitstream/10993/4589/1/Publikation_Marschall_Bund_Wiemeyer_2007_EJournal%20Bewegung%20und%20Training.PDF | meta-analýza 40 studií, vote-counting 43 nezařazených | plný text (PDF), ověřeno 13. 10. 2026 | B |
| 23 | St. Germain, L., McKay, B., Poskus, A., Williams, A., Leshchyshen, O., Feldman, S., Cashaback, J. G. A., & Carter, M. J. (2023). Exercising choice over feedback schedules during practice is not advantageous for motor learning. *Psychonomic Bulletin & Review*, 30, 621–633. https://raw.githubusercontent.com/cartermaclab/carterlab-papers/main/2023_st-germain-etal_exercising-choice-over-feedback-schedules-during-practice-is-not-advantageous-for-motor-learning.pdf · DOI 10.3758/s13423-022-02170-5 | 2 experimenty, N = 228, a priori síla | plný text | A |
| 24 | McKay, B., Yantha, Z. D., Hussien, J., Carter, M. J., & Ste-Marie, D. M. (2022). Meta-analytic findings of the self-controlled motor learning literature: Underpowered, biased, and lacking evidential value. *Meta-Psychology*, 6, MP.2021.2803. https://raw.githubusercontent.com/cartermaclab/carterlab-papers/main/2022_mckay-etal_meta-analytic-findings-of-the-self-controlled-motor-learning-literature-underpowered-biased-and-lacking-evidential-value.pdf · DOI 10.15626/MP.2021.2803 | předregistrovaná meta-analýza, k = 52 | plný text | A |
| 25 | McKay, B., Bacelar, M., Parma, J. O., Miller, M. W., & Carter, M. J. (2022). The combination of reporting bias and underpowered study designs has substantially exaggerated the motor learning benefits of self-controlled practice and enhanced expectancies… (preprint). https://doi.org/10.31234/osf.io/3nhtc · https://experts.mcmaster.ca/scholarly-works/2423459 | bayesovská reanalýza | abstrakt | C (preprint; případná časopisecká verze neověřena) |
| 26 | Bacelar, M. F. B., Parma, J. O., Murrah, W. M., & Miller, M. W. (2022). Meta-analyzing enhanced expectancies on motor learning: Positive effects but methodological concerns. *International Review of Sport and Exercise Psychology*. https://etd.auburn.edu/handle/10415/8796 | meta-analýza | jen sekundárně (disertace, [25]) | C |
| 27 | Wulf, G., & Lewthwaite, R. (2016). Optimizing performance through intrinsic motivation and attention for learning: The OPTIMAL theory of motor learning. *Psychonomic Bulletin & Review*, 23(5), 1382–1414. https://oasis.library.unlv.edu/kns_fac_articles/123 · DOI 10.3758/s13423-015-0999-9 | teorie/přehled | abstrakt | B (teorie; empirická opora viz [23–25]) |
| 28 | Chiviacowsky, S., & Wulf, G. (2007). Feedback after good trials enhances learning. *Research Quarterly for Exercise and Sport*, 78(2), 40–47. https://www.sponet.de/sponet/Record/4012854 · DOI 10.1080/02701367.2007.10599402 | experiment (hod sáčkem) | abstrakt | B (replikace viz [29]) |
| 29 | Carter, M. J., Smith, V., & Ste-Marie, D. M. (2016). Judgments of learning are significantly higher following feedback on relatively good versus relatively poor trials despite no actual learning differences. *Human Movement Science*, 45, 63–70. https://raw.githubusercontent.com/cartermaclab/carterlab-papers/main/2016_carter-etal_judgments-of-learning-are-significantly-higher-following-feedback-on-relatively-good-versus-relatively-poor-trials-despite-no.pdf | experiment 2 × 2, N = 40, hod na terč | plný text | A (malý vzorek) |
| 30 | Raviv, L., Lupyan, G., & Green, S. C. (2022). How variability shapes learning and generalization. *Trends in Cognitive Sciences*, 26(6), 462–483. https://eprints.gla.ac.uk/272070 · DOI 10.1016/j.tics.2022.03.007 | přehled >150 studií | plný text (autorský rukopis https://eprints.gla.ac.uk/272070/2/272070.pdf), ověřeno 13. 10. 2026 | B (přehled, ne meta-analýza) |
| 31 | Caballero, C., Barbado, D., Peláez, M., & Moreno, F. J. (2024). Applying different levels of practice variability for motor learning: More is not better. *PeerJ*, 12, e17575. https://pmc.ncbi.nlm.nih.gov/articles/PMC11212619/ | RCT, n = 63, hod na terč | plný text (PMC) | B (malé skupiny, nesrovnalosti v reportu) |
| 32 | Zhou, Y., Shao, W. D., & Wang, L. (2021). Effects of feedback on students' motor skill learning in physical education: A systematic review. *IJERPH*. https://pmc.ncbi.nlm.nih.gov/articles/PMC8296044/ | systematický přehled 23 studií | plný text (souhrn) | B (nízká kvalita primárních studií) |
| 33 | Celeste (video game) — Assist Mode. Wikipedie. https://en.wikipedia.org/wiki/Celeste_(video_game) | praxe oboru, sekundární zdroj | stránka | H |
| 34 | Depping, A. E., & Mandryk, R. L. (2017). Why is this happening to me? How player attribution can broaden our understanding of player experience. *CHI 2017*, 1040–1052. DOI 10.1145/3025453.3025648 | konceptualizace a validace škály | metadata (Crossref, Unpaywall: uzavřeno) a výňatek abstraktu, 13. 10. 2026 | B (nástroj, ne důkaz účinku) |
| 35 | Zohaib, M. (2018). Dynamic difficulty adjustment (DDA) in computer games: A review. *Advances in Human-Computer Interaction*, 2018, 5681652. DOI 10.1155/2018/5681652 | přehled technických přístupů | abstrakt (Crossref), 13. 10. 2026 | C (pro prožitek bez nové evidence) |

**Pozn. k ověření:** Během rešerše se vyčerpal sdílený limit webového vyhledávání. Zdroje 19, 20, 26 a sekce o učení úhlu vypuštění proto zůstaly u sekundárního ověření a položky v oddílu 3 bod 8 neověřené. Žádné DOI ani číslo zde není doplněno z paměti bez ověření. Kde údaj nesedí mezi zdroji (rok [4], stránkování [7], počet osob [31]), uvádíme obě varianty.

---

## Ověřovací kolo 13. 10. 2026

Ověřeno proti primárním textům nebo metadatům (fronta README §4: V7, V8, V9, S9–S14):
- **Finserås 2021 [17] (V8):** plný text. Nutkání pokračovat se mezi scénáři nelišilo, hypotéza o near-miss se nepotvrdila. Výsledek byl předem daný (bez kontroly hráče). Doplněno do 2.5, §3 bod 6 a N8. Kvalita B → A (malý vzorek). Rozpor R-I1 rozhodnut ve prospěch formulace bloku 04.
- **Constant a Levieux 2019 [10] (V9):** abstrakt ověřen, plný text uzavřený, n stále neznámé. Doplněno, že kontrolou byla náhodná obtížnost a že „posílení sebedůvěry jako součást přínosu DDA“ je hypotéza autorů. N5 označena spíš za hodnotovou volbu.
- **Abuhamdeh a Csikszentmihalyi 2012 [3] (V7, R3):** originál nedostupný. Z plného textu [2] ověřena definice „~20 %“ (rozdíl ratingu ~262 bodů) a „těsné partie“ (malý materiálový rozdíl, nezávisle na výsledku).
- **Smeddinck 2016 [11] (S12):** plný text. **Oslabeno:** „hráči častěji preferují ruční volbu“ stojí jen na rozhovorech, pořadí preferencí bylo v obou studiích nevýznamné. Robustní je jen efekt na autonomii. Opraveno v §1 bod 4, 2.3 a §3 bod 3.
- **Marschall 2007 [22] (S11):** plný text. **Opraveno** tvrzení „bez korekcí publikačního zkreslení“: autoři zkreslení doložili vote-countingem (39 ze 43 nezařazených studií efekt nepotvrdilo) a fail-safe N.
- **Winstein a Schmidt 1990 [20] (S10):** bibliografie ověřena (JEP:LMC 16(4), 677–691). Podle [22] experiment 1 škodlivost plné zpětné vazby neukázal. „33 %“ zůstává neověřeno.
- **Salmoni 1984 [19] (S9):** jen bibliografie a DOI z referencí [21], originál neotevřen.
- **Raviv 2022 [30] (S13):** plný text (autorský rukopis). Doplněn princip „starting small“ a upozornění, že nejde o předvídatelnost časového signálu.
- **Depping a Mandryk 2017 [34] (S14):** CHI 2017, jde o vývoj škály, ne o experiment. Jako opora P7 a N4 neslouží, jako měřicí nástroj ano. Přidáno do registru.
- **Zohaib 2018 [35] (nízká):** abstrakt, technický přehled. Přidáno do registru.
- **Lomas 2013 [2] (R19):** „~70 000 hráčů“ opraveno na 69 642 sezení.

Věcné změny implikací:
- **N1** přeformulována (R-N3): zakázat předepsání ideální hodnoty, ne hlášení odchylky. Přesná chybová KR v [23] také vedla k učení.
- **N2** (R-N2): vypuštěno trvalé tlačítko „Poradit?“, ruční vyžádání je jen testovaná varianta. Implikace je teď v souladu s 07 N2.
- **N10** (R-N1): opora [30][31] pro „malou variabilitu středu QTE“ přeškrtnuta jako nepřímá. „Malá vůči pruhu, velká vůči přesnosti odměřování“ je slučitelné s 06 N4.
- Klíčové zjištění 3: kompetence při nudě „nejvyšší“ → „srovnatelná, nevýznamně vyšší“ (R2).

**Sjednocení s ostatními bloky (README §3.4, 13. 10. 2026):** hodnocení Klarkowski [5] A → B (R30), Clark [16] A → B (R32), Finserås [17] A → B− (R31), shodně s bloky 01 a 02. Fakta beze změny.

Neověřeno: plné texty [3], [10], [19], [20]; Langer 1975; Keller a Bless 2008; God Mode v Hades; studie učení úhlu vypuštění (kandidát Zhu, Dapena a Bingham 2009 nešel stáhnout).
