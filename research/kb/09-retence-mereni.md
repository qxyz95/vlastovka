# Blok 9: Retence, sociální prvky a měření

**Blok:** 9 z `research/00-temata.md`. **Rešerše provedena:** 13. 10. 2026. **Stav:** první verze, ověřovací kolo proběhlo 13. 10. 2026 (viz poslední sekce).
**Navazuje na:** `KB zabavnost a motivace.md`, sekce 6 (první hráčský test) a 7 (kandidátní metriky a slovník událostí). Tyto sekce zde neopakuji. Dodávám k nim důkazní základ, volbu dotazníku, statistické limity a konkrétní lokální logování.
**Štítky:** **V** výzkumný poznatek · **H** heuristika nebo praxe oboru · **N** naše hypotéza pro Just Throw It. Odkazy [Z#] míří do registru zdrojů v sekci 6.
**Omezení rešerše:** Během práce došel sdílený limit vyhledávání. Proto zůstala neověřená témata „ghost“ (souboj s vlastním záznamem), Wordle z empirického pohledu, plný text PENS validace (Johnson et al. 2018) a plné texty některých studií, u nichž jsem měl jen abstrakt. Vše takové je v textu označené.

---

## 1. Klíčová zjištění v kostce

1. **V** — U kasuální webové hry většina hráčů odejde velmi brzy. V datech hry Axon (přes 854 tisíc hráčů, prohlížeč, jeden hráč) odehrálo 92 % lidí méně než 8 her a asi 90 % mělo jen jednu session [Z3]. Délky celkového hraní mají typický tvar s dlouhým chvostem (Weibullovo rozdělení) [Z4]. Pro nás z toho plyne, že plán „23 hodů v první hře“ je u skutečného webového publika spíš výjimka než pravidlo. Rozhoduje prvních pět hodů.
2. **V** — Hráči kasuální hry častěji končí session hned po výrazném zlepšení skóre. Ve stejných datech Axonu předpovídala ukončení nejlépe změna skóre oproti předchozí hře [Z3]. Konec po osobním rekordu je tedy přirozený bod zastavení a nemusí znamenat neúspěch hry. *Síla důkazu (po ověřovacím kole):* observační data jedné hry, recenzí prošla jen krátká posterová verze (ICWSM 2017). Zjištění 1 a 2 berte jako dobře zdokumentovaný případ, ne jako replikovaný obecný jev.
3. **V** — Žebříčky spolehlivě zvyšují **množství** výkonu, protože fungují jako implicitní obtížný cíl [Z10, Z11]. Vnitřní motivaci ani pocit kompetence ale v kontrolovaných experimentech průkazně nezvyšují [Z11]. Účinek polohy v žebříčku je nekonzistentní: vysoká pozice může vést k pohodlnosti, nízká ke zvýšenému úsilí, a ani jedno nevypadá jako vnitřní motivace [Z14]. Meta-analýza gamifikace ve vzdělávání neprokázala rozdíl mezi typy herních prvků a studenti uváděli úzkost a závist [Z12].
4. **V** — Série („streaky“) působí obousměrně. Neporušená série zvyšuje další zapojení, ale zvýrazněná přerušená série zapojení snižuje, a to nezávisle na skutečném chování. Efekt je silnější, když si člověk přerušení přičítá sám, a slabší, když jde sérii „opravit“ [Z7]. Hraní na schůzku („playing by appointment“) je v literatuře zařazené mezi časové temné vzorce [Z8, Z9].
5. **V** — Hráčské typologie mají slabou psychometrickou oporu. Bartle je neformální syntéza diskuse asi 30 hráčů jednoho MUDu [Z17]. Yee na vzorku asi 3 000 hráčů ukázal, že motivace se navzájem nevylučují (korelace hlavních složek r < 0,10) [Z18]. BrainHex neprošel psychometrickou kontrolou dobře [Z20]. Nejlépe validovaná je Hexad-12, ale ta je určená pro gamifikaci, ne pro hry [Z21]. Pro designová rozhodnutí u malé hry jsou typologie spíš slovník než nástroj.
6. **V** — Dotazníky prožitku mají rozdílnou kvalitu. Původní sedmifaktorovou strukturu GEQ nepodpořila validace na N = 633 a review 73 studií našlo chaotické citování [Z29, Z30]. Nejlépe zdokumentovaný otevřený nástroj je PXI (33 položek, 11 konstruktů; validace na 529 lidech) [Z32]. Jeho krátká verze miniPXI má smíšenou reliabilitu: položka Enjoyment je nejstabilnější, Immersion nejméně [Z33, Z34]. Česká verze žádného z nich zřejmě validovaná není; nepodařilo se to ověřit.
7. **H/V** — Pro malý tým funguje opakované testování s malými skupinami. Pět uživatelů najde v průměru hodně problémů, ale rozptyl je velký: náhodné pětice našly 55–99 % problémů, desítky nejméně asi 80 % [Z26, Z27]. RITE (oprava po každém účastníkovi) pochází z herního prostředí, nemá však jasné pravidlo zastavení [Z25].
8. **V/H** — A/B test v malém vzorku nemá statistickou sílu. Pro středně velký rozdíl (d = 0,5) mezi dvěma skupinami je potřeba asi 64 lidí na skupinu. Při srovnání uvnitř téhož hráče stačí asi 34 lidí, při velkém efektu (d = 0,8) asi 15 (vlastní výpočet, sekce 3.8). Kvalitativní test s 5–8 lidmi rozdíl v číslech nedokáže. Dokáže najít problémy.
9. **H** — Oborové benchmarky retence (D1 kolem 20–27 %, D7 kolem 3–8 % u mobilních her v letech 2022–2024) [Z5, Z6] pocházejí z jiného kontextu: mobilní instalace, placená akvizice, reklama. Na webovou hru bez backendu se přenášejí jen omezeně a bez serveru je stejně nezměříme.
10. **N** — Vlaštovky mají deterministický seed. Díky tomu umíme levně a bez backendu udělat souboj s vlastním nejlepším hodem (ghost) a sdílitelný textový výsledek na způsob Wordle. Obojí podporuje srovnání se sebou samým a neohrožuje dobrovolnost hraní. Jde o hypotézu, kterou je potřeba otestovat.

---

## 2. Podrobné sekce

### 2.1 Délka session, „ještě jeden pokus“ a kasuální hráči

**Juul, *A Casual Revolution* (2010)** [Z1] je kniha opřená o průzkum mezi zhruba 200 hráči stahovacích kasuálních her, hloubkové rozhovory a analýzu designu. Ověřeno z kapitoly 1. Ústřední myšlenka zní, že kasuální hra je **flexibilní** k času a nárokům hráče, kdežto hardcore hra klade „nepodmíněné“ požadavky. Juul zároveň ukazuje, že předpoklad „kasuální hráč hraje krátce a zřídka“ často neplatí. Mnoho respondentů hrálo dlouho a jejich zvyklosti měnily spíš životní okolnosti (děti, práce, důchod) než typ hráče. Pět designových rysů (fikce, snadné naučení, přerušitelnost, „akorát“ obtížnost, juiciness) jsem ověřil jen přes recenzi [Z2]. Kapitolu 2, kde jsou popsané, jsem neotevřel. *Síla důkazu:* H až slabé V (deskriptivní, nereprezentativní vzorek, starší trh stahovacích her). *Přenositelnost:* vysoká na úrovni principu. Hra musí jít kdykoli přerušit a musí dávat smysl jak po 3 minutách, tak po 30.

**Agarwal, Burghardt & Lerman (2017), „On Quitting“** [Z3] zpracovává observační data z kasuální jednohráčové webové hry Axon: 3 miliony her a více než 854 tisíc hráčů v roce 2012 (data Stafford & Dewar). Session definují jako sled her bez pauzy dvou hodin a víc. Výsledky:
- 92 % hráčů odehrálo méně než 8 her a asi 90 % mělo jedinou session. Přes 90 % sessions trvalo méně než hodinu.
- Pravděpodobnost ukončení session nejlépe vysvětluje **změna skóre oproti předchozí hře**. Hráči častěji končí po velkém skokovém zlepšení. Autoři to dávají do souvislosti s efektem vrcholu a konce (peak-end).
- Úspěšnější hráči méně často končí po horším výsledku.

*Omezení:* jde o jednu hru, identifikátor zařízení nemusí odpovídat jednomu člověku, data jsou observační a o prožitku hráčů nic neříkají. *Stav publikace ověřen 13. 10. 2026:* text na arXivu (jediná verze z 14. 3. 2017) je podle poznámky autorů „dlouhá verze posterového příspěvku ve sborníku 11. konference AAAI ICWSM“. Recenzí tedy prošel jen krátký posterový příspěvek, ne tato dlouhá verze s podrobnými analýzami. Jiné časopisecké vydání jsem nenašel. *Přenositelnost:* velmi vysoká, protože Axon je jako my krátká jednohráčová hra v prohlížeči.

**Bauckhage et al. (2012)** [Z4] analyzovali telemetrii přes 250 tisíc hráčů pěti akčních her. Celkový čas hraní dobře popisuje Weibullovo rozdělení. Ze začátku hraní tak lze předpovídat, kdy hráč skončí. *Omezení:* velké konzolové a PC hry, ne kasuální. *Přenositelnost:* metodická. Odchody je lepší modelovat jako křivku přežití (podíl hráčů, kteří jsou ještě ve hře po k-tém hodu), ne jako průměr.

**Průmyslové benchmarky (H)** [Z5, Z6]:
- *GameAnalytics 2025* (data za rok 2024, 11 600 her, iOS a Android): horní čtvrtina her má D1 retenci 26,5–27,7 %, medián D7 je 3,4–3,9 %, 75 % projektů má D28 pod 3 %. Medián délky session je 5–6 minut, medián denního herního času 22 minut, v průměru asi 4 sessions denně. Arkády mají nejlepší D1, ale slabou dlouhodobou retenci.
- *Tenjin a GameAnalytics, hypercasual Q3 2022:* medián D1 je 25 % na iOS a 19 % na Androidu, D7 6 % na iOS a 3 % na Androidu. Horní 2 % her mají D1 51 % na iOS a 42 % na Androidu.

*Omezení:* údaje z oborových reportů (převzaté přes newsletter GameDev Reports, primární PDF jsem neotevřel), mobilní instalace s placenou akvizicí, čísla se rok od roku mění. *Přenositelnost:* nízká. Užitečné je jen řádové vodítko: většina hráčů se druhý den nevrátí ani u úspěšných her a typická mobilní session trvá kolem 5 minut.

### 2.2 Návratové mechaniky a jejich etika

**Silverman & Barasch (2023), *Journal of Consumer Research*** [Z7] provedli sedm studií o záznamech chování se zvýrazněnými sériemi. Neporušená série zvyšuje další zapojení oproti sérii přerušené. Efekt závisí jen na tom, jak záznam chování zobrazuje, ne na chování samotném: lidé berou udržení série jako cíl sám o sobě. Rozdíl roste, když si přerušení přičítají sami, a klesá, když lze sérii „opravit“. *Síla:* V (série experimentů v prestižním časopise). *Omezení:* spotřebitelské kontexty, ne hry. Studie nic neříkají o dlouhodobém blahu ani o pocitu nátlaku. *Přenositelnost:* střední. Série je silná páka, a proto je zároveň riziková. Hráč, který o sérii přijde, může odejít úplně.

**Zagal, Björk & Lewis (2013)** [Z8] definují „temné vzorce herního designu“. Jde o prvky, které tvůrce používá záměrně a které hráčům přinášejí negativní zážitky proti jejich zájmu a pravděpodobně bez jejich souhlasu. Vzorce řadí do tří kategorií: časové, peněžní a vzorce sociálního kapitálu. Mezi časové patří grinding a hraní na schůzku. Definici jsem ověřil přes abstrakt a citující práce. Plný text ověřily bloky 02 a 08 (uzavřeno v ověřovacím kole 13. 10. 2026, rozpor R13). Kritika z DiGRA 2020 namítá, že rámec nemá výslovné etické ukotvení. **Niknejad et al. (2024)** [Z9] prošli crowdsourcované hodnocení 1 496 mobilních her na webu darkpatterns.games. Hraní na schůzku definují jako nutnost vracet se denně kvůli úkolům a denní odměny řadí mezi časové vzorce. Časových vzorců bylo v „temných“ hrách v průměru 22,1 na hru, ve „zdravých“ 4,9. *Omezení:* hodnocení od dobrovolníků, ano/ne bez transparentní agregace, explorativní statistika.

**Kdy je návratová mechanika nátlaková (syntéza, H):** Nátlak vzniká, když (a) nevrácení se něco **stojí** (ztráta série, propadlá odměna, sociální ostuda), (b) časování určuje hra, a ne hráč, a (c) hráč nemá možnost se z toho bez ztráty vyvázat. Oproti tomu informace o novém obsahu, nevypršující výzva nebo připomenutí osobního rekordu nic nestojí. To odpovídá pravidlům 8 v `KB zabavnost a motivace.md` (žádný trest za vynechaný den, výzvy nevyprší).

### 2.3 Zdravé ukončení session (natural stopping points)

**V (nepřímo):** Empirickou studii věnovanou přímo „přirozeným bodům zastavení“ se mi pro vyčerpaný limit hledání najít nepodařilo. Z ověřených zdrojů plyne:
- Hráči kasuální hry končí často po vrcholu (velké zlepšení) [Z3]. Vhodné místo pro zastavení je tedy výsledková obrazovka po rekordu nebo po splnění cíle.
- Přerušitelnost patří k rysům kasuálního designu [Z1, Z2].
- Peak-end: Agarwal et al. se na něj odvolávají, ale přímo ho netestují [Z3].

**H:** Dobrý bod zastavení (a) uzavírá rozdělanou věc, takže hráč neodchází uprostřed nákupu nebo letu, (b) shrnuje, co se změnilo, (c) ukazuje, co bude příště, ale bez časového tlaku, a (d) automaticky ukládá. Opačný vzorec (cliffhanger s časovačem, „odměna vyprší“) je nátlakový.

### 2.4 Sociální srovnání a žebříčky

**Landers, Bauer & Callan (2017), *Computers in Human Behavior* 71** [Z10] použili brainstormingovou úlohu s náhodným přiřazením do čtyř podmínek klasického stanovení cílů (udělej, co můžeš / snadný / obtížný / nemožný) nebo do podmínky se žebříčkem se stejnými hodnotami. Samotný žebříček přivedl lidi na úroveň výkonu jako obtížné a nemožné cíle. Účastníci si implicitně stanovili cíl u vrcholu žebříčku a závazek k cíli se choval jako u explicitních cílů. *Velikost vzorku stránka neuvádí* (znovu ověřeno 13. 10. 2026 na záznamu University of Minnesota, N stále neznámé). Článek vyšel online 2015 (DOI 10.1016/j.chb.2015.08.008), ročník 2017. Replikace z roku 2025 (Kratochvíl et al., *Learning and Individual Differences*, DOI 10.1016/j.lindif.2025.102708, dvě studie s dvanáctiminutovou úlohou) podle názvu a záznamu ukázala, že účinek žebříčku se liší pro kvantitu, kvalitu a vnímaný výkon. Znám ji jen ze záznamu, text jsem neotevřel.

**Mekler, Brühlmann, Tuch & Opwis (2017), *CHB* 71** [Z11] provedli online experiment 4 × 2 mezi subjekty s 273 účastníky (anotace obrázků): body, úrovně, žebříček a kontrolní podmínka bez herních prvků, křížené s kauzální orientací účastníka (autonomní / kontrolovaná). Herní prvky **neovlivnily** kompetenci ani vnitřní motivaci, ale zvýšily počet tagů, nejvíc úrovně a žebříček. Autoři je interpretují jako vnější pobídky, které působí na kvantitu výkonu. *Omezení:* nehra, ženská převaha ve vzorku, jedna session.

**Bai, Hew & Huang (2020), *Educational Research Review* 33** [Z12] je meta-analýza 30 intervencí z 24 studií (3 202 účastníků) a kvalitativní syntéza 32 studií. Gamifikace měla celkově střední efekt na výsledky učení (g = 0,504). **Typ prvku ani počet prvků efekt nemoderovaly.** Studentům se líbila zpětná vazba a uznání, vadila jim nadbytečnost a úzkost či závist. *Přenositelnost:* nízká (vzdělávání, ne zábava), ale varování před sociálním srovnáním je obecné.

**Pozice v žebříčku:**
- *Na & Han (2023), Internet Research* [Z14]: 111 vysokoškoláků, manipulovaná pozice (1.–2. vs. 9.–10.) po 5 kol. Vysoká pozice vedla k pohodlnosti: méně času na úlohu a snaha udržet pozici snadnou cestou. Nízká pozice zvýšila úsilí. Zábava se mezi skupinami nelišila a v počtu dobrovolných kol navíc nebyl rozdíl. Autoři tvrdí, že ani jedna motivace nebyla vnitřní.
- *Bai, Hew, Sailer & Jia (2021), Computers & Education* [Z13]: dva kvaziexperimenty v online kurzech (N = 24 s absolutním žebříčkem, N = 26 s relativním, kde účastník vidí jen sousedy). Hypotéza zněla, že u absolutního žebříčku budou mít vnitřní motivaci vyšší ti nahoře, u relativního stejnou všichni. Podle záznamu výsledků (abstrakt přes vyhledávač) se to potvrdilo. *Velmi slabý důkaz:* malé vzorky, chybí randomizace, typ žebříčku je smíchaný s kurzem a vyučujícím.
- *Butler (2013), LNCS 8029* [Z15]: podle citujících prací manipuloval pořadí ve střílečce. Pořadí nekorelovalo se zábavou a hráči na nižších pozicích (podle jiného shrnutí hráči na krajích) hru častěji opakovali. **Neověřeno**, plný text jsem nečetl a citující práce se rozcházejí.

*Syntéza (V):* Žebříček je účinný nástroj pro **kvantitu** a pro implicitní cíl. Vnitřní motivaci nepřidává a jeho dopad závisí na pozici a typu žebříčku. Relativní žebříčky (sousedé) a žebříčky po úrovních (tiers) se navrhují jako zmírnění demotivace dole. Opora je zatím slabá.

### 2.5 Ghost, osobní rekord a srovnání se sebou samým

**Neověřeno.** Cílené hledání studií o „ghost“ soupeři a o časovém srovnání (se sebou v minulosti) proti sociálnímu srovnání jsem nestihl. Nepřímé ověřené opory:
- Ukončení session nejlépe predikuje změna oproti **vlastní** předchozí hře, ne oproti vlastnímu průměru [Z3]. Hráči tedy své výsledky srovnávají s nedávnou minulostí.
- Žebříček funguje přes stanovení cíle [Z10]. Osobní rekord je cíl, který si hráč nastavuje sám, a nese menší riziko demotivace ze spodních pozic [Z13, Z14].

**N:** Ghost vlastního nejlepšího hodu (průhledná vlaštovka) je pro nás levný, protože let je deterministický podle seedu. Zobrazuje „konkrétní cíl k překonání“ bez sociálního srovnání. Riziko: při měnícím se seedu a QTE nejsou pokusy srovnatelné podmínky (viz metrika „Zlepšení“ v KB sekci 7).

### 2.6 Sdílení výsledku (Wordle-like)

**H:** Holdier (2022, Prindle Post) [Z16] je filozofický esej, ne empirie. Argumentuje, že přitažlivost Wordle spočívá ve sdílení zážitku. Mřížka emoji je čitelný záznam boje bez prozrazení odpovědi a C. Thi Nguyen ji popisuje jako „stálý proud malých společenství“. Podvádění je v tomto pohledu „sebepodkopávající“. Empirickou studii motivace ke sdílení u Wordle jsem nenašel. Výsledky hledání obsahovaly jen publicistiku a jednu nedůvěryhodnou stránku s „63 %“, kterou vědomě necituji.

**N:** Sdílení funguje, když (a) mají všichni stejnou výzvu (denní seed), (b) výsledek něco vypráví (průběh, ne jen číslo), (c) neprozrazuje obsah, (d) je čitelný pro zasvěcené a pro ostatní je pozvánkou. Bez backendu stačí Web Share API nebo schránka. Napětí s pravidlem „výzvy neexpirují“ popisuje sekce 3.

### 2.7 Hráčské typologie a kvalita jejich evidence

| Model | Původ | Evidence | Hodnocení |
|---|---|---|---|
| **Bartle (1996)** [Z17] | Shrnutí diskuse asi 30 zkušených hráčů jednoho britského MUDu (1989–1990). Autor sám uvádí, že nejde o rigorózní studii a že typy jsou stereotypy. | Žádná psychometrie. | **H**, historický slovník |
| **Yee (2006)** [Z18] | Faktorová analýza 40 položek, asi 3 000 hráčů MMORPG. 10 podsložek ve 3 složkách: výkon, sociální, imerze (55 % rozptylu). | Ukázal, že motivace se **nevylučují** (r < 0,10 mezi složkami), na rozdíl od Bartlova předpokladu. Věk vysvětluje výkonovou motivaci lépe než pohlaví. | **V**, ale jen pro MMO |
| **Quantic Foundry** [Z23] | 12 motivací v 6 párech, faktorová analýza. Podle firmy přes 1,25 milionu respondentů (2019), novější stránky uvádějí přes 1,75 až 2 miliony. | Dobrovolný online profil s vlastním výběrem respondentů, metodika komerční a v recenzi nepublikovaná. | **H** (užitečné pro audienční reporty, ne pro validitu) |
| **BrainHex** | Nacke et al., neurobiologicky inspirovaný. | Busch et al. (2016) [Z20] na dvou vzorcích (n = 592 a 243): psychometrické vlastnosti „by bylo třeba zlepšit“, doporučují revizi. Pozdější práce z dat přes 50 tisíc lidí odvodila jen tři rysy (podle záznamu vyhledávání, neověřeno). | Slabé |
| **Hexad** | Marczewski, pro gamifikaci. | Validace v angličtině a španělštině (Tondello et al. 2019, IJHCS 127) [Z22], jen abstrakt přes vyhledávač. Hexad-12 (Krath et al. 2023) [Z21]: EFA n = 882, CFA n = 1 101, lepší fit a reliabilita než původních 24 položek. | Nejlepší psychometrie, ale konstrukt „uživatel gamifikace“, ne hráč |
| **Meta-syntéza** | Hamari & Tuunanen (2014) [Z19]: typologie se dají shrnout do 7 dimenzí (intenzita, výkon, objevování, sociabilita, dominance, imerze, demografie ve hře). | Kvalitativní syntéza. | Užitečná mapa |

*Syntéza (V/H):* Kategorizace hráčů do „typů“ nemá dobrou oporu. Motivace jsou spojité, korelované a závislé na kontextu. Pro 5–8 testerů je přiřazování typů bezcenné, protože není s čím srovnávat. Lepší je zeptat se otevřeně, co hráče na hře táhne, a sledovat jeho chování.

### 2.8 Metody playtestingu pro malý tým

**Rámec:** *Games User Research* (Drachen, Mirza-Babaei & Nacke, eds., OUP 2018) [Z24] je hlavní příručka oboru. Ověřil jsem obsah (kapitoly o procesu, metodách, průzkumech od Brühlmanna a Meklera, analytice), ne jednotlivá doporučení.

**Kolik testerů:**
- *Nielsen (2000)* [Z26], H: model N(1 − (1 − L)^n) s L ≈ 31 % dává asi 85 % problémů při 5 uživatelích. Nielsen doporučuje spíš tři kola po pěti s úpravami mezi nimi než jedno velké kolo. Při více skupinách uživatelů radí 3–4 lidi na skupinu.
- *Faulkner (2003), Behavior Research Methods* [Z27], V: 60 uživatelů a převzorkování (100 náhodných skupin pro každou velikost). Náhodné pětice našly 55–99 % problémů, v průměru 85 % (SD 9,3). Minimum u desítek bylo asi 80 % a u dvacítek 95 %. *Plný text ověřen 13. 10. 2026.* Omezení: jediná úloha (vyplnění týdenního výkazu v webové aplikaci), problémy počítané jako „odchylky uživatele“, ne hra.
- *Vlastní výpočet podle Nielsenova modelu:* problém, na který narazí jen 10 % hráčů (L = 0,1), objeví 5 testerů s pravděpodobností 41 %, 8 testerů s 57 % a 12 testerů se 72 %. Vzácné problémy (konkrétní zařízení, dotyk) malý vzorek snadno mine.

**RITE** (Medlock et al. 2002, Microsoft Game Studios, Age of Empires II) [Z25], H: problém se opraví hned, jakmile se objeví, i po jediném účastníkovi. Podle shrnutí Lewise a Saura (MeasuringU 2020) prošlo případovou studií 10 účastníků s úpravami a dalších 6 bez nutnosti změn (verifikace). Kritika: chybí pravidlo zastavení, verifikace se často vynechává, srovnání s klasickým testováním neexistuje a metoda vyžaduje vývojáře k dispozici. Pro nás je vhodná, protože autor hry je zároveň vývojář.

**Krug, *Rocket Surgery Made Easy* (2009)** [Z28], H: tři uživatelé jedno dopoledne měsíčně, debrief u oběda a dohoda, co opravit. Ověřeno jen přes sekundární zdroje. Kniha je psaná pro weby, ne pro hry.

**Think-aloud ve hrách (H/V):** Obecná HCI literatura (van den Haak et al., Alhadreti & Mayhew, ze shrnutí ve vyhledávání) uvádí, že souběžné přemýšlení nahlas zpomaluje výkon, hlavně u složitých úloh. Retrospektivní varianta ruší méně, ale opírá se o paměť; pomáhá videozáznam. Herně specifické srovnání jsem neověřil. To potvrzuje volbu v KB sekci 6: během QTE nemluvit, ptát se až po letu.

### 2.9 Dotazníky prožitku a jejich validita

| Nástroj | Rozsah | Validita (ověřeno) | Pro nás |
|---|---|---|---|
| **GEQ** | Core modul 33 položek, 7 faktorů (+ další moduly) | Law, Brühlmann & Mekler (2018) [Z29]: review 73 studií našlo nekonzistentní reportování a zavádějící citace; validace na N = 633 **nepodpořila** 7faktorovou strukturu. Brühlmann & Schmid (2015) [Z30]: N = 447, dvě hry, GEQ neplní požadavky konzistence a invariance. V test-retestu [Z34] ale měl dobrou stabilitu (ICC 0,75–0,85). | Nedoporučuji jako hlavní nástroj |
| **PENS** | Spokojenost potřeb SDT (kompetence, autonomie, příbuznost, intuitivní ovládání, imerze) | Brühlmann & Schmid (2015): faktorová struktura konzistentní a invariantní napříč hrami [Z30]. Johnson, Gardner & Perry (2018, IJHCS 118) [Z31]: validace existuje, **abstrakt jsem neověřil**. Test-retest [Z34]: slabší až střední (ICC 0,47–0,73), kompetence nejnižší. Licence: neověřeno. | Možný, ale licence je nejasná |
| **PXI** | 33 položek, 11 konstruktů ve 2 vrstvách (funkční: audiovizuální přitažlivost, výzva, snadnost ovládání, jasnost cílů, zpětná vazba o postupu; psychosociální: autonomie, zvědavost, imerze, mistrovství, smysl) a Enjoyment | Vanden Abeele et al. (2020) [Z32]: položky od 64 expertů, 5 studií, 529 účastníků, podpora dvouúrovňové struktury, konvergentní a diskriminační validity i invariance. Test-retest převážně střední až dobrý (0,57–0,88), zvědavost hraniční. Otevřená škála. | **Nejvhodnější plná verze** |
| **miniPXI** | 11 položek (1 na konstrukt) | Haider et al. (2022) [Z33]: 15 expertů a 628 hráčů, reliabilita 0,51–0,83 (průměr 0,68), validita potvrzena pro 9 z 11 konstruktů. Haider et al. (2024) [Z34]: test-retest se 100 hráči, 4 webové hry, 3 týdny. Enjoyment ICC 0,70 (nejlepší), Immersion 0,37 (špatná), Challenge 0,42, Mastery 0,45. Doporučení: hodí se pro srovnání iterací, imerzi a mistrovství neměřit jedinou položkou. | **Prakticky nejlepší volba pro krátký test** |
| **UPEQ** | 21 položek, 3 subškály SDT | Azadvar & Canossa (2018) [Z35]: korelace s imerzí, zábavou a zapojením; subškály predikovaly herní čas a útratu (Ubisoft/Massive). Kayser, Perrig & Brühlmann (2021) [Z36]: N = 369 hráčů LoL, **slabiny 3faktorového modelu**, navrhují 6–7 faktorů. | Spíš ne (zaměřené na multiplayer a příbuznost) |
| **IMI** | 45 položek v 7 subškálách, modulární; interest/enjoyment má 7 položek | Web SDT [Z37]: subškály lze vybírat a položky přizpůsobit úloze. Self-report koreluje s chováním jen asi 0,4 a autoři doporučují vlastní faktorovou analýzu. McAuley et al. (1989) podporují validitu (plný text neotevřen). | Interest/enjoyment jako doplněk |

*Napříč nástroji (V):* Ve srovnání test-retest [Z34] byla vícepoložková měřítka stabilnější než jednopoložková. Jedna položka „doporučil bys hru“ (NPS) a položka „ocenění“ byly stabilní (ICC asi 0,79), ale podle autorů nemusí zachycovat prožitek. **Klíčové omezení pro nás:** žádný z nástrojů nemá ověřenou validovanou českou verzi (jen jsem ji nedohledal). Vlastní překlad je proto pracovní nástroj. Při malém N jsou čísla jen popisná a tak je třeba je i prezentovat.

### 2.10 Telemetrie, soukromí a hra bez backendu

**Co měřit:** Slovník událostí a metrik už existuje (KB sekce 7). Výzkum k němu dodává tři metodická pravidla:
1. **Křivka přežití místo průměrů** [Z4]: podíl hráčů, kteří jsou ještě aktivní po k-tém hodu nebo minutě. Průměrná délka session skryje, že většina odejde brzy [Z3].
2. **Session podle pauzy:** Agarwal et al. použili hranici 2 hodin a výsledky se při 6 hodinách nezměnily [Z3]. Pro nás N: session = pauza ≥ 30 minut nebo zavření stránky.
3. **Kontext ukončení** [Z3]: zapsat, co se stalo v posledním pokusu před odchodem (rekord? zhoršení? nákup? splnění cíle?). Tím odlišíme odchod po vrcholu od odchodu z frustrace.

**Právní rámec (H, ne právní rada):** Pokyny EDPB 2/2023 k technickému rozsahu čl. 5(3) směrnice ePrivacy (verze 2.0, přijata 7. 10. 2024) [Z38] uvádějí:
- „Uložení“ zahrnuje i ukládání instruované softwarem (protokoly typu úložiště prohlížeče) bez ohledu na dobu trvání (body 35–37).
- Jakmile jsou lokálně vytvořené informace zpřístupněny dál, například odeslány po síti, jde o „získání přístupu“ i v případě, že vznikly lokálně (bod 53).

Čl. 5(3) [Z39] vyžaduje souhlas uživatele poté, co dostal „jasné a úplné informace“ (mimo jiné o účelu zpracování). Výjimky jsou dvě: uložení nebo přístup výhradně za účelem přenosu komunikace po síti a uložení nebo přístup „nezbytně nutné“ k poskytnutí služby informační společnosti, o kterou uživatel výslovně požádal. *Znění ověřeno 13. 10. 2026* přes legislation.gov.uk (text směrnice ve znění 2009/136/ES, jak ho převzalo britské právo k 31. 12. 2020). EUR-Lex se znovu nenačetl. Znění článku se od roku 2009 neměnilo (podle vlastní znalosti, neověřeno v EUR-Lexu). **Interpretace pro nás (N, k ověření):**
- Uložení postupu hry je zjevně nezbytné.
- Lokální diagnostický log ke hraní nutný není. Rozumné je ho zapínat jen v testovacím režimu (např. `?playtest=1`) se srozumitelnou informací a nikdy ho automaticky neodesílat.
- Data v playtestu sbírat s informovaným souhlasem účastníka a exportovat ručně (tlačítko „Stáhnout záznam“), bez identifikátorů.

### 2.11 A/B testování v malém vzorku a statistická síla

Vlastní výpočet (normální aproximace, oboustranné α = 0,05, síla 0,8; t-test dává o 1–2 osoby víc):
- **Mezi skupinami:** d = 0,2 vyžaduje asi 393 lidí na skupinu, d = 0,5 asi 63–64, d = 0,8 asi 25–26.
- **Uvnitř hráče (párově, střídání pořadí):** dz = 0,5 asi 32–34 lidí, dz = 0,8 asi 13–15.
- **Přesnost podílu:** u binárního výsledku (např. „vrátil se druhý den“) je 95% interval při p = 0,5 a n = 8 zhruba ±35 procentních bodů, při n = 12 ±28.

*Závěr (V/H):* S 5–8 lidmi nelze A/B testem prokázat nic kromě obrovských a nápadných efektů. Spolehlivý je jen kvalitativní signál, tedy opakovaný problém u více lidí. To odpovídá pracovním pravidlům v KB sekci 6. Hodnoty dotazníku u malého N jsou nestabilní (miniPXI ICC 0,4–0,7 [Z34]), takže rozdíl půl bodu mezi dvěma verzemi je šum.

### 2.12 Jak poznat „zábavu“ z dat (plateau, quit points)

**V:**
- Odchody mají dlouhý chvost a dají se predikovat z raného hraní [Z4].
- Konec session souvisí se změnou výkonu oproti poslední hře [Z3].
- Self-report koreluje s volným chováním jen středně, asi 0,4 [Z37].
- Herní prvky mohou zvýšit kvantitu chování bez vlivu na vnitřní motivaci [Z11]. **Delší hraní tedy samo o sobě nedokazuje zábavu.** KB to už říká a výzkum to podporuje.

**H, operacionalizace pro nás:**
- *Plateau:* klouzavý medián doletu přes posledních 5 hodů se nemění, ani když se mění úrovně nebo hráč nakupuje. Pokud plateau přetrvává a hráč pokračuje, jde o kandidáta na nudu nebo grind. Pokud hráč skončí, jde o kandidáta na quit point.
- *Quit point:* poslední stav před odchodem. Odchod v dílně bez možnosti koupit něco užitečného, odchod po sérii neúspěšných QTE a odchod po rekordu znamenají něco jiného.
- *Triangulace:* chování (log), sebehodnocení (miniPXI Enjoyment a otevřená otázka) a pozorování moderátora. Žádný zdroj sám nestačí.

---

## 3. Rozpory a otevřené otázky

1. **Denní výzva vs. „výzvy neexpirují“.** Sdílení na způsob Wordle stojí na společné výzvě dne [Z16], tedy na časovém prvku. KB pravidla zakazují vypršení. *Možné řešení (N):* denní seed je k dispozici i zpětně (archiv) a nemá série ani odměny za den. Jestli pak sdílení ztratí kouzlo, nevím.
2. **Série: motivace, nebo nátlak?** Silverman & Barasch ukazují, že série zvyšují zapojení [Z7]. Temné vzorce varují před hraním na schůzku [Z8, Z9]. Hranici mezi „pomáhá vytvořit zvyk“ a „trestá vynechání“ výzkum v kontextu her nekvantifikuje.
3. **Žebříček: pomáhá, nebo škodí?** Kvantita výkonu roste [Z10, Z11], ale vnitřní motivace ne a účinek se mezi pozicemi liší [Z13, Z14]. Butlerova data o opakování hry podle pozice citující práce popisují nekonzistentně [Z15].
4. **GEQ: nestabilní struktura, ale vysoká test-retest stabilita.** Faktorová struktura neobstála [Z29, Z30], přesto měl GEQ v test-retestu nejvyšší ICC [Z34]. Stabilní měření nemusí být validní.
5. **Typický kasuální hráč neexistuje.** Juul ukazuje, že „kasuální“ hráči často hrají dlouho [Z1]. Data Axonu ukazují, že většina webových hráčů odchází po několika hrách [Z3]. Obojí může platit pro různé populace: věrné hráče stahovacích her a náhodné webové návštěvníky.
6. **Otevřené a neověřené:** empirie ghost soupeřů; motivace ke sdílení (Wordle); plný text Johnson et al. 2018 (PENS); licence PENS; existence české validace PXI nebo IMI; Butler 2013; Juulových pět rysů z primárního textu. (Znění čl. 5(3) ověřeno v ověřovacím kole přes legislation.gov.uk, EUR-Lex stále nepřístupný.)
7. **Přenositelnost benchmarků:** D1 a D7 z mobilu [Z5, Z6] nejsou cílová hodnota pro webovou hru bez instalace. Bez backendu je navíc nezměříme. Návrat budeme znát jen z výpovědí testerů.

---

## 4. Relevance pro Just Throw It — kandidátní implikace (N)

*Nejde o finální doporučení. Jsou to hypotézy k ověření a navazují na backlog v KB sekci 5.*

**N1 — Prvních pět hodů je celá hra pro většinu webových návštěvníků.** Data z Axonu [Z3] ukazují, že rozhodují první minuty, ne 23. hod. Simulace (23 hodů, kolem 12 minut) popisuje hráče, který zůstane. Křivka přežití v testu ukáže, kolik lidí se k prvnímu nákupu vůbec dostane.

**N2 — Výsledková obrazovka po rekordu je přirozený bod zastavení a měla by tak fungovat.** Postup se automaticky uloží, obrazovka shrne, co se zlepšilo, a ukáže příští cíl. Žádný časovač, žádné „ještě dnes“. Odchod po rekordu [Z3] logovat jako samostatnou kategorii a nepočítat ho jako selhání.

**N3 — Srovnání se sebou samým před srovnáním s ostatními.** Lokální „deska osobních rekordů“ a volitelný ghost nejlepšího hodu, deterministický podle seedu. Globální žebříček vyžaduje backend, KB ho zatím vylučuje a výzkum neslibuje zisk vnitřní motivace [Z11].

**N4 — Sdílení jako textová mřížka, ne jako výzva k soutěži.** Například řádek emoji se čtvrtěmi, kterými vlaštovka proletěla, a dolet. Sdílí se přes Web Share API nebo schránku, bez backendu. Testovat až po vyřešení základní smyčky.

**N5 — Žádné denní odměny ani série.** Silverman & Barasch [Z7] ukazují, že přerušená série odrazuje. Pokud někdy vznikne „návratový“ prvek, má to být nevypršující obsah nebo denní seed s archivem a bez trestu (viz rozpor 1).

**N6 — Typologie nepoužívat k segmentaci testerů.** Místo toho otevřená otázka „Co tě na hrách obvykle baví a co tě odradí?“ a záznam herní zkušenosti (začátečník, příležitostný, zkušený), jak už navrhuje KB.

### 4.1 Konkrétní návrh testu s malým vzorkem

Rozšiřuje scénář z KB sekce 6. Nemění ho.

**Vzorek a kola (podle RITE a Krugova přístupu):**
- **Kolo A:** 5–6 lidí (alespoň 2 na dotyku, 2 na klávesnici). Po každém účastníkovi rychlý debrief. Opravují se jen zjevné problémy s porozuměním a ovládáním, které by zamaskovaly všechno ostatní (RITE). Herní balanc a ekonomika se mezi účastníky nemění.
- **Kolo B:** po opravách dalších 5–6 lidí na **zmrazené verzi** (verifikace). Problém nalezený u 2 a více lidí se opraví do dalšího cyklu.
- Celkem 10–12 lidí ve 2–3 týdnech. Faulkner ukazuje, že teprve kolem 10 lidí se spodní hranice nalezených problémů blíží 80 % [Z27].

**Dotazník (po hraní, kolem 3 minut):**
- **miniPXI** (11 položek, škála −3 až +3) [Z33, Z34] v pracovním českém překladu, označeném jako nevalidovaný.
- Pro srovnání kol A a B porovnávat jen **Enjoyment** a funkční konstrukty (Clarity of Goals, Progress Feedback, Ease of Control, Challenge), protože jsou relativně stabilní. Immersion a Mastery z jediné položky neinterpretovat [Z34].
- K tomu 1 otevřená otázka ke každé nejnižší a nejvyšší odpovědi („Proč?“).
- Pracovní škály 1–7 z KB sekce 6 nahradit miniPXI, nebo je ponechat a výslovně označit jako ad hoc. Obojí najednou dotazník zbytečně prodlužuje.
- GEQ ani UPEQ nepoužívat (viz sekce 2.9). PENS jen při vyjasněné licenci.

**Lokální logování (jen v režimu `?playtest=1`, bez sítě):**
- Události ze slovníku v KB sekci 7 plus doplnění:
  - `session_start` s časem, zařízením a typem vstupu,
  - `attempt_index` u každého hodu,
  - `record_set` (true/false a rozdíl oproti předchozímu nejlepšímu),
  - `delta_prev` (dolet minus dolet předchozího hodu) [Z3],
  - `rolling_median5` (klouzavý medián doletu přes 5 hodů),
  - `last_state_before_exit` (zapsaný při `visibilitychange` nebo `pagehide`, s příznakem „neúplné“).
- Ukládat do samostatného klíče v localStorage odděleného od savu (např. `just-throw-it-playtest-log`) s omezenou velikostí. Tlačítko **„Stáhnout záznam (JSON)“** a **„Smazat záznam“**.
- Účastník dostane krátký informovaný souhlas: co se zaznamenává, že nic neodchází ze zařízení a že záznam stáhne moderátor. Bez jmen, e-mailů a otisků zařízení.

**Vyhodnocení:**
- Křivka přežití (počet aktivních účastníků po hodu k) a čas do prvního nákupu.
- Rozložení „stavu při odchodu“.
- Podíl session ukončených do 2 hodů po rekordu.
- Plateau podle `rolling_median5`.
- Popisné hodnoty miniPXI (medián a rozpětí, bez p-hodnot).
- Seznam opakovaných problémů s počtem lidí.
- Rozhodovat pravidly z KB sekce 6, ne podle průměrů.

**Návrat (D1/D7) bez backendu:** Testerům s jejich souhlasem napsat po 1 a 7 dnech jedinou otázku: „Hrál/a jsi znovu? Proč ano/ne?“ Volitelně požádat o export záznamu z jejich zařízení. Výsledek interpretovat jako příběhy, ne jako míru retence (u n = 12 je interval ±28 procentních bodů).

**Co z testu nevyvozovat:** srovnání s mobilními benchmarky D1 a D7, „vítěznou“ variantu A/B, rozložení hráčských typů ani validní české skóre prožitku.

---

## 5. Registr zdrojů

Hodnocení kvality: **A** recenzovaná empirie nebo meta-analýza s ověřeným abstraktem či textem · **B** recenzovaná práce s menším nebo specifickým vzorkem, případně jen částečně ověřená · **C** oborová praxe, kniha, report, esej · **N!** neověřeno (jen sekundární zmínka).

| # | Zdroj | Typ / vzorek | Kvalita a poznámka |
|---|---|---|---|
| Z1 | Juul, J. (2010). *A Casual Revolution: Reinventing Video Games and Their Players.* MIT Press. Kap. 1: https://jesperjuul.net/casualrevolution/casual_revolution_chapter1.pdf | Kniha; průzkum asi 200 hráčů + rozhovory | C/B; ověřena kap. 1 |
| Z2 | Jeffries, L. B. (2010, 2. 2.). Recenze *A Casual Revolution*. PopMatters. https://popmatters.com/120029-jesper-juuls-new-book-a-casual-revolution-2496158014.html | Recenze | C; jen pro výčet pěti rysů |
| Z3 | Agarwal, T., Burghardt, K., & Lerman, K. (2017). *On Quitting: Performance and Practice in Online Game Play.* arXiv:1703.04696. https://arxiv.org/abs/1703.04696 | Observační; přes 854 tisíc hráčů, přes 3 miliony her (Axon) | **B** (sníženo z A/B); plný text přečten. Recenzní stav ověřen 13. 10. 2026: dlouhá verze posteru z AAAI ICWSM 2017, recenzován jen poster |
| Z4 | Bauckhage, C., Kersting, K., Sifa, R., Thurau, C., Drachen, A., & Canossa, A. (2012). How players lose interest in playing a game. *IEEE CIG 2012*, 139–146. https://doi.org/10.1109/CIG.2012.6374148 | Telemetrie; přes 250 tisíc hráčů, 5 her | A; ověřen abstrakt |
| Z5 | GameAnalytics (2025). *Mobile Gaming Benchmarks 2025* (přes GameDev Reports, 17. 2. 2025). https://gamedevreports.substack.com/p/gameanalytics-mobile-gaming-benchmarks | Oborový report; 11 600 aplikací | C; data 2024, primární PDF neotevřeno |
| Z6 | Tenjin & GameAnalytics (2022). *Hypercasual Benchmark Q3 2022* (přes GameDev Reports, 11. 10. 2022). https://gamedevreports.substack.com/p/tenjin-and-gameanalytics-hypercasual | Oborový report | C; starší data |
| Z7 | Silverman, J., & Barasch, A. (2023). On or Off Track: How (Broken) Streaks Affect Consumer Decisions. *Journal of Consumer Research*, 49(6), 1095–1117. https://doi.org/10.1093/jcr/ucac029 ; záznam https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb | 7 experimentů | A; ověřen abstrakt |
| Z8 | Zagal, J. P., Björk, S., & Lewis, C. (2013). Dark Patterns in the Design of Games. *FDG 2013.* https://research.chalmers.se/en/publication/177148 | Konceptuální | C (sjednoceno s 02 [17] a 08 [27]: normativní, bez empirie); v tomto bloku ověřen abstrakt a definice, kategorie přes Z9. Plný text ověřen v blocích 02 a 08 |
| Z9 | Niknejad, S., Mildner, T., Zargham, N., Putze, S., & Malaka, R. (2024). Level Up or Game Over: Exploring How Dark Patterns Shape Mobile Games. *MUM '24.* https://arxiv.org/abs/2412.05039 | Crowdsourcovaná data; 1 496 her | B |
| Z10 | Landers, R. N., Bauer, K. N., & Callan, R. C. (2017). Gamification of task performance with leaderboards: A goal setting experiment. *Computers in Human Behavior*, 71, 508–515. https://experts.umn.edu/en/publications/gamification-of-task-performance-with-leaderboards-a-goal-setting/ ; DOI 10.1016/j.chb.2015.08.008 (online 2015) | Randomizovaný experiment | A; N neověřeno ani 13. 10. 2026 |
| Z11 | Mekler, E. D., Brühlmann, F., Tuch, A. N., & Opwis, K. (2017). Towards understanding the effects of individual gamification elements on intrinsic motivation and performance. *CHB*, 71, 525–534. https://doi.org/10.1016/j.chb.2015.08.048 (online 2015, ročník 71 z roku 2017) | Experiment 4 × 2 (prvky × kauzální orientace); N = 273 | B (sjednoceno s 01 a 02: neherní úloha, jedno sezení); plný text. Design podle plného textu (02 [13], 03 [27]) |
| Z12 | Bai, S., Hew, K. F., & Huang, B. (2020). Does gamification improve student learning outcome? *Educational Research Review*, 33, 100322. https://doi.org/10.1016/j.edurev.2020.100322 | Meta-analýza; 30 intervencí, 3 202 účastníků + 32 kvalitativních studií | A |
| Z13 | Bai, S., Hew, K. F., Sailer, M., & Jia, C. (2021). From top to bottom: How positions on different types of leaderboard may affect… *Computers & Education*, 173, 104297. https://doi.org/10.1016/j.compedu.2021.104297 | 2 kvaziexperimenty; N = 24 a 26 | B/C; slabý design |
| Z14 | Na, K., & Han, K. (2023). How leaderboard positions shape our motivation. *Internet Research*, 33(7). https://doi.org/10.1108/INTR-12-2021-0897 | Experiment; N = 111 | B |
| Z15 | Butler, C. (2013). The Effect of Leaderboard Ranking on Players' Perception of Gaming Fun. *OCSC 2013, LNCS 8029*, 129–136. https://doi.org/10.1007/978-3-642-39371-6_15 | Experiment | N!; jen citující práce |
| Z16 | Holdier, A. G. (2022, 26. 1.). Why Don't People Cheat at Wordle? *The Prindle Post.* http://www.prindleinstitute.org/2022/01/why-dont-people-cheat-at-wordle/ | Esej | C |
| Z17 | Bartle, R. (1996). Hearts, Clubs, Diamonds, Spades: Players Who Suit MUDs. https://mud.co.uk/richard/hcds.htm | Esej; diskuse asi 30 hráčů | C |
| Z18 | Yee, N. (2006). Motivations for Play in Online Games. *CyberPsychology & Behavior*, 9(6), 772–775. | Průzkum, PCA; asi 3 000 hráčů | A; plný text (číslo 6 neověřeno) |
| Z19 | Hamari, J., & Tuunanen, J. (2014). Player Types: A Meta-synthesis. *ToDiGRA*, 1(2). https://doi.org/10.26503/todigra.v1i2.13 | Kvalitativní syntéza | B |
| Z20 | Busch, M., Mattheiss, E., Orji, R., Fröhlich, P., Lankes, M., & Tscheligi, M. (2016). Player Type Models: Towards Empirical Validation. *CHI EA '16*, 1835–1841. https://doi.org/10.1145/2851581.2892399 | 2 online studie; n = 592 a 243 | B; jen abstrakt |
| Z21 | Krath, J., Altmeyer, M., Tondello, G. F., & Nacke, L. E. (2023). Hexad-12. *CHI '23.* https://doi.org/10.1145/3544548.3580968 | EFA n = 882, CFA n = 1 101 | A |
| Z22 | Tondello, G. F., Mora, A., Marczewski, A., & Nacke, L. E. (2019). Empirical validation of the Gamification User Types Hexad scale in English and Spanish. *IJHCS*, 127, 95–111. | Validace | B; jen výsledek vyhledávání |
| Z23 | Quantic Foundry (2019). *Gamer Motivation Model Reference.* https://quanticfoundry.com/wp-content/uploads/2019/04/Gamer-Motivation-Model-Reference.pdf | Komerční; přes 1,25 milionu respondentů s vlastním výběrem | C |
| Z24 | Drachen, A., Mirza-Babaei, P., & Nacke, L. E. (eds.) (2018). *Games User Research.* Oxford University Press. https://www.sdu.dk/en/forskning/sdumetaverselab/books/game_user_research | Odborná kniha | C; ověřen jen obsah |
| Z25 | Medlock, M. C., Wixon, D., Terrano, M., Romero, R., & Fulton, B. (2002). Using the RITE method to improve products. *UPA 2002.* Shrnutí: Lewis, J., & Sauro, J. (2020). Ten Things to Know about the RITE Method. https://measuringu.com/rite-method/ | Případová studie | C; originál neotevřen |
| Z26 | Nielsen, J. (2000). Why You Only Need to Test with 5 Users. NN/g. https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ | Praxe a model | C |
| Z27 | Faulkner, L. (2003). Beyond the five-user assumption. *Behavior Research Methods, Instruments, & Computers*, 35(3), 379–383. https://doi.org/10.3758/BF03195514 | Převzorkování; 60 uživatelů, jedna webová úloha | A/B; plný text ověřen 13. 10. 2026 (Springer PDF) |
| Z28 | Krug, S. (2009). *Rocket Surgery Made Easy.* New Riders. | Praktická kniha | C; jen sekundární popisy |
| Z29 | Law, E. L.-C., Brühlmann, F., & Mekler, E. D. (2018). Systematic Review and Validation of the Game Experience Questionnaire (GEQ). *CHI PLAY '18*, 257–270. https://doi.org/10.1145/3242671.3242683 | Review 73 studií + validace N = 633 | A |
| Z30 | Brühlmann, F., & Schmid, G.-M. (2015). How to Measure the Game Experience? *CHI EA '15.* https://doi.org/10.1145/2702613.2732831 | N = 447, 2 hry | B |
| Z31 | Johnson, D., Gardner, M. J., & Perry, R. (2018). Validation of two game experience scales: PENS and GEQ. *IJHCS*, 118, 38–46. https://doi.org/10.1016/j.ijhcs.2018.05.003 | Validace | N!; ověřena jen bibliografie |
| Z32 | Vanden Abeele, V., Spiel, K., Nacke, L., Johnson, D., & Gerling, K. (2020). Development and validation of the player experience inventory. *IJHCS*, 135, 102370. https://doi.org/10.1016/j.ijhcs.2019.102370 | 64 expertů, 5 studií, N = 529 | A |
| Z33 | Haider, A., Harteveld, C., Johnson, D., Birk, M. V., Mandryk, R. L., Seif El-Nasr, M., Nacke, L. E., Gerling, K., & Vanden Abeele, V. (2022). miniPXI. *PACM HCI 6 (CHI PLAY).* https://doi.org/10.1145/3549507 | 15 expertů, 628 hráčů | A |
| Z34 | Haider, A., Wallner, G., Gerling, K., & Vanden Abeele, V. (2024). An Investigation of the Test-Retest Reliability of the miniPXI. arXiv:2407.19516. https://arxiv.org/abs/2407.19516 | Test-retest; N = 100, 4 hry, odstup 3 týdny | A; místo publikace ověřeno 13. 10. 2026: *Proc. ACM HCI* 8 (CHI PLAY), čl. 293, říjen 2024, DOI 10.1145/3677058 |
| Z35 | Azadvar, A., & Canossa, A. (2018). UPEQ: Ubisoft Perceived Experience Questionnaire. *FDG '18.* https://doi.org/10.1145/3235765.3235780 | 2 validační studie + telemetrie | B |
| Z36 | Kayser, D., Perrig, S. A. C., & Brühlmann, F. (2021). Measuring players' experience of need satisfaction… factor structure of the UPEQ. *CHI PLAY '21 EA.* https://doi.org/10.1145/3450337.3483499 | N = 369 | B |
| Z37 | Center for Self-Determination Theory. *Intrinsic Motivation Inventory.* https://selfdeterminationtheory.org/intrinsic-motivation-inventory/ ; McAuley, E., Duncan, T., & Tammen, V. V. (1989). *Research Quarterly for Exercise and Sport*, 60(1), 48–58. | Dokumentace nástroje; validace | C/B; McAuley neotevřen |
| Z38 | EDPB (2024). *Guidelines 2/2023 on Technical Scope of Art. 5(3) of ePrivacy Directive*, v2.0, přijato 7. 10. 2024. https://www.edpb.europa.eu/system/files/documents/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf | Regulatorní pokyny | C (autoritativní výklad, ne zákon) |
| Z39 | Směrnice 2002/58/ES (ePrivacy), čl. 5(3), ve znění 2009/136/ES. https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32002L0058 ; ověřeno přes https://www.legislation.gov.uk/eudr/2002/58/article/5 | Právní předpis | B (znění ověřeno 13. 10. 2026 přes oficiální britskou kopii textu EU k 31. 12. 2020; EUR-Lex se nenačetl) |

Celkem 39 položek. Dvě jsou neověřené (N!: Z15, Z31). Z39 bylo ověřeno v ověřovacím kole. Z22 a Z28 jsou ověřené jen ze sekundárních zdrojů.

---

## Ověřovací kolo 13. 10. 2026

Ověřeno: Agarwal et al. 2017 [Z3] (stav publikace), Faulkner 2003 [Z27] (plný text), Haider et al. 2024 [Z34] (místo publikace a základní parametry), čl. 5(3) ePrivacy [Z39] (znění), Landers et al. 2017 [Z10] (záznam, N nenalezeno), replikace Kratochvíl et al. 2025 (záznam). Uzavřeno podle jiných bloků: Zagal et al. 2013 [Z8] (R13), Mekler et al. 2017 [Z11] (R14).

Změny:
- **Agarwal 2017 [Z3] (oslabeno):** arXiv text je dlouhá verze posteru z AAAI ICWSM 2017. Recenzí prošel jen poster. Hodnocení A/B sníženo na B a ke klíčovým zjištěním 1–2 doplněna výhrada. Obsah tvrzení se nemění, N1 a N2 zůstávají, ale jejich opora je jedna observační studie jedné hry.
- **Faulkner 2003 [Z27]:** čísla potvrzena plným textem, doplněn průměr 85 % (SD 9,3) a omezení na jednu webovou úlohu.
- **Haider 2024 [Z34]:** místo publikace potvrzeno (CHI PLAY 2024, PACM HCI 8).
- **Čl. 5(3) [Z39]:** znění ověřeno včetně obou výjimek. N! změněno na B. Interpretace pro playtest (log jen v testovacím režimu, s informací a souhlasem) zůstává.
- **Landers 2017 [Z10]:** doplněno DOI a rok online vydání. Replikace z roku 2025 upřesněna (časopis, DOI). N původní studie stále neověřeno.
- **Zagal 2013 [Z8] a Mekler 2017 [Z11]:** stav sjednocen s bloky 02 a 08.
- **Sjednocení (README §3.4, 13. 10. 2026):** Zagal [Z8] hodnocení B → C (R33). Mekler [Z11] zápis designu 2 × 4 → 4 × 2 podle plného textu (výslovně „4 × 2 between-subject“) a hodnocení A → B shodně s 01 a 02 (R26).
- Rozpor R-N7 (nástroj do playtestu): blok 1 v N10 přijal miniPXI jako hlavní nástroj. Návrh v §4.1 tohoto bloku se nemění. Kao et al. 2024 (blok 1 a 5) navíc ukazuje, že dobrovolnou dobu hraní předpovídala zvědavost, ne hlášená zábava. Položka Curiosity v miniPXI je proto užitečná, i když má hraniční test-retest reliabilitu [Z32].

Zůstává neověřeno: Silverman & Barasch 2023 [Z7] jen v abstraktu, N u Landers 2017, Medlock 2002 (RITE) v originále, Butler 2013, Johnson et al. 2018 a licence PENS, česká validace miniPXI, PXI, IMI nebo BANGS.
