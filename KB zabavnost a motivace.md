# Just Throw It — knowledge base zábavnosti a motivace hráče

**Rešerše a audit: 12. 10. 2026. Stav: návrhový podklad, nikoli implementované mechaniky nebo výsledky hráčského testu.**

Určeno pro široké publikum: začátečníky i hráče, kteří chtějí zvládnout přesný hod. Cílem je dobrovolná chuť dát si další pokus, protože hráč rozumí výsledku, zlepšuje se a objevuje cestu. Nejprve ověříme krátkou hru kolem 10–15 minut; teprve potom rozšíříme obsah pro návraty v dalších dnech. Délka je pracovní produktový cíl, nikoli vědecky stanovené optimum.

## Obsah

- [1. Jak číst důkazy](#dukazy)
- [2. Audit současné hry](#audit)
- [3. Sedm principů pro Vlaštovky](#principy)
- [4. Propojení 500 metrů s celou cestou](#cesta)
- [5. Prioritizovaný backlog a experimenty](#backlog)
- [6. První hráčský test](#test)
- [7. Měření a rozhodování](#mereni)
- [8. Pravidla a dokončení dokumentu](#pravidla)
- [9. Zdroje](#zdroje)

<a id="dukazy"></a>
## 1. Jak číst důkazy

Používáme tři odlišné štítky:

- **V — výzkumný poznatek:** výsledek konkrétní studie, vždy s omezením přenosu do naší hry.
- **H — návrhářská heuristika:** užitečný způsob posuzování návrhu, nikoli záruka účinku.
- **N — naše hypotéza:** konkrétní mechanika, text, parametr nebo experiment pro Vlaštovky. Zůstává neověřená do testu.

### Výchozí evidence

**V / S1 — motivace a zvládnutí hry.** Ve čtyřech studiích souvisely vnímané kompetence a autonomie se zábavností a preferencí hraní; v průzkumu MMO hráčů byla relevantní také sounáležitost. Autonomie zde znamená pocit dobrovolnosti, kompetence pocit účinného zvládání. Jde o různé hry, krátké experimenty a také korelační data, nikoli důkaz, že přidání tlačítka volby nebo odznaku způsobí dlouhodobý návrat. Pro singleplayer z toho nevyvozujeme nutnost multiplayeru. [Ryan, Rigby a Przybylski, 2006](https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf), abstrakt a studie 1–4.

**H / S2 — GameFlow.** Model organizuje návrhářská kritéria zábavnosti kolem soustředění, výzvy, dovednosti, kontroly, cílů, odezvy, ponoření a sociální interakce. Použijeme ho jako kontrolní rámec, ne jako vzorec pro správnou obtížnost. Dostupný abstrakt a bibliografický záznam nepostačují k tvrzení o univerzální účinnosti ani optimálním procentu úspěchu QTE. [Sweetser a Wyeth, 2005](https://doi.org/10.1145/1077246.1077253). Přímé načtení plného textu při této rešerši selhalo; detaily experimentální validace zde nepřebíráme.

**V / S3 — zpětná vazba.** Experiment v brain-training hře s 157 účastníky ukázal rozdíly mezi typy a vyzněním odezvy. Pozitivní odezva podporovala vnímanou kompetenci a autonomii; negativní mohla zvýšit okamžité opakování při nižší kompetenci. Důležité omezení: budoucí hraní zahrnovalo deklarované záměry, nikoli prokázanou dlouhodobou retenci. Výsledek neopravňuje ponižovat hráče ani tvrdit, že každý rekordní ukazatel zvyšuje motivaci. [Burgers a kol., 2015](https://christianburgers.wordpress.com/wp-content/uploads/2016/08/burgers-eden-van-engelenburg-buningh-2015.pdf), abstrakt a diskuse na str. 100–101.

**V / S4 — limity teoretických zkratek.** Kritická práce upozorňuje na problematické a zjednodušující používání teorie sebeurčení v herním HCI výzkumu. Proto budeme zaznamenávat, co návrh skutečně mění a co měříme, místo obecného tvrzení „tohle podporuje dopamin“. Jde o kritické zhodnocení výzkumné praxe, ne o nový experiment s naší hrou. [Tyack a Mekler, 2024](https://arxiv.org/abs/2405.12639).

Veškeré herní návrhy níže jsou **N**, i když mají inspiraci v S1–S4. Číselné cíle a hranice jsou naše pracovní volby. Zlepšení klikání na „Znovu“ samo o sobě není důkaz zábavnosti.

<a id="audit"></a>
## 2. Audit současné hry

Zdrojem těchto faktů je implementace, nikoli výzkumné články. Prioritu má aktuální kód; historické dokumenty popisují i již změněná pravidla.

| Oblast | Ověřený stav | Důsledek pro návrh |
|---|---|---|
| Hod | Úhel 5–40°, cyklické nabíjení s prvním vrcholem za 1,15 s; rychlost 70–110 % konstrukce. [throw.js](src/throw.js) | Je co zvládat. Výsledek musí objasnit sílu a časování, nepřisuzovat každý dolet úhlu. |
| Modely a upgrady | Šipka a kluzák mají vlastní tři větve. Síla zvyšuje rychlost; papír i přehyby snižují stejný koeficient odporu, jinými procenty. [config.js](src/config.js) | Počet větví není počet skutečně odlišných strategií. Před přidáváním dalších ověřit, zda hráči chápou a cítí rozdíl. |
| QTE | První tři začínají přibližně v 0,8 / 3,15 / 5,5 s; seed přidává malý posun. Další vznikají po vzdálenostních branách 180 m s odstupem. [core.js](src/core.js) | Rychlost mění hustotu událostí; stejná vzdálenost neznamená stejný čas na odpočinek. |
| Časování QTE | Okno má 2 s, varování 0,8 s; úspěch je kolem středu 1,4 s v rozsahu ±0,2 s, perfektní zásah ±0,06 s. Předčasný vstup spotřebuje pokus. [core.js](src/core.js) | Hlásit příčinu chyby; nejprve vyzkoušet klávesnici i dotyk. Žádná univerzální psychologická „správná šířka“ okna. |
| Účinek QTE | Poryv přičítá rychlost. Holub ji nastaví na 15 nebo 19,5 m/s a spustí nesení. Minutí nedává bonus. [core.js](src/core.js) | Nastavení rychlosti holubem může rychlejší let zpomalit. Pozitivní název události není záruka pozitivního čistého přínosu; nutné párové simulace. |
| Odezva | Úspěch/perfektní/minutí, síla hodu a výsledkové statistiky existují. Chybí časová odchylka a příčina „brzy / pozdě“. [ui.js](src/ui.js) | Doplnit vysvětlení skutečné akce, ne obecnou radu po každém letu. |
| Opakování | Výsledek nabízí Znovu, Vylepšení, Dílna; Znovu už vede přímo na míření a dostává fokus. [ui.js](src/ui.js) | Nevyvíjet znovu existující restart; měřit prodlevu a odstraňovat prokázané překážky. |
| Ekonomika | Odměna 10 + celá část doletu/10, ceny úrovní 10/30/55/85/120, kluzák od 100 m. [core.js](src/core.js), [config.js](src/config.js) | První nákup pokryje základní odměna. Další tempo a výhody větví potřebují aktuální ověření. |
| Cíle | HUD používá 100/250/500 m, poté stále 500 m. Dokončení i načítání postupu pracují s hranicí 500 m. [ui.js](src/ui.js), [storage.js](src/storage.js) | Po prvním cíli chybí navazující motivace a správně pojmenované dokončení etapy. |
| Cesta | 16 míst, 4 na biom; cca 305 m na obrazovku, 1 219 m na biom, 4 876 m na okruh. Místa a popisy už existují. [scenes.js](src/scenes.js) | Nový atlas může využít hotové definice. Není potřeba znovu vyrábět systém trasy. |
| Uložení | Ukládá mince, úrovně modelů, rekord, pokusy a dokončení; nikoli atlas nebo historii srovnatelných pokusů. [storage.js](src/storage.js), [core.js](src/core.js) | Atlas, výzvy a rekordy konfigurací později vyžadují rozšíření a migraci uložení. |
| Atmosféra | Hejna, déšť a stopy existují, nemění fyziku. [atmosphere.js](src/atmosphere.js) | Změna počasí sama není nová herní situace. Vizuální překvapení nesmí zamaskovat QTE. |

**Historický balanc:** [simulation/REPORT.md](simulation/REPORT.md) popisuje verzi 0.1.0 a simulovaný čas s odhadnutou režií. Neověřuje dnešní hod, rozšířené QTE, novou trasu ani skutečnou zábavnost. Ani nynější technické testy nejsou hráčský test. Verze v konfiguračním souboru a jednotlivé části README nejsou spolehlivým souhrnem všech pozdějších změn; tento audit je datovaný snímek kódu.

<a id="principy"></a>
## 3. Sedm principů pro Vlaštovky

### K1 — Vidím, v čem se zlepšuji

**Poznatek:** V/S1 spojuje kompetenci se zábavností; V/S3 upozorňuje, že více okamžitého opakování nemusí znamenat lepší prožitek.

**Zdroj a omezení:** S1 a S3 v [evidenci](#dukazy); konkrétní texty ani časování naší arkády nezkoumaly.

**Využití:** Oddělit dobrou konstrukci od přesného ovládání. Nový rekord po nákupu je úspěch postupu, ale nemusí být důkaz lepšího hodu.

**Konkrétní návrh:** B01–B03. Po QTE zobrazit „Příliš brzy — počkej na střed“ / „Příliš pozdě — příště o chvíli dřív“ / „Bez zásahu“. Po letu nejvýše jednu radu založenou na pozorované akci. Slabou sílu komentovat jako „Uvolnil jsi na 42 %; zkus blíž vrcholu“, nikoli automaticky jako pozdní uvolnění. Rekord porovnávat i uvnitř stejné konfigurace a přiznat rozdílné podmínky.

**Ověření:** Hráč vlastními slovy vysvětlí chybu a v příštích pokusech zkusí odpovídající změnu. Sledujeme pocit kontroly i frustraci; samotný delší dolet nestačí.

**Priorita:** P0, etapa 1. Riziko: množství čísel nebo rada založená na domněnce. Žádné automatické tvrzení „vyšší úhel = delší dolet“.

### K2 — Moje volba skutečně něco mění

**Poznatek:** V/S1 dává důvod zkoumat pocit autonomie; počet voleb sám o sobě není doloženou cestou k němu.

**Zdroj a omezení:** S1; naše dvě konstrukce ani talentový strom nejsou experimentálně ověřené.

**Využití:** Vysvětlit rozdíl šipky a kluzáku pomocí hráčského cíle. Dvě téměř stejné větve odporu mohou působit jako účetnictví.

**Konkrétní návrh:** B07. Ověřit profil „rychlý pokus“ proti „delší plachtění“. V prototypu jednoho rozlišení nahradit účinek přehybů odolností vůči nepřesné síle hodu; papír ponechat pro odpor. Vysvětlit před nákupem měněný účinek bez slibu pevného počtu metrů. Žádná změna stávajících zakoupených úrovní bez samostatného migračního návrhu.

**Ověření:** Po vyzkoušení obou variant hráč dokáže vybrat model a zdůvodnit volbu. Simulace kontroluje, zda jeden model nedominuje současně v doletu i výdělku za celý cyklus.

**Priorita:** P1, etapa 2. Riziko: příliš mnoho voleb před pochopením hodu; další větve zatím nepřidávat.

### K3 — Výzva je čitelná a má rytmus

**Poznatek:** H/S2 nabízí výzvu, kontrolu a odezvu jako oblasti návrhové kontroly.

**Zdroj a omezení:** S2; nejde o důkaz pevného ideálního intervalu QTE ani cílové úspěšnosti.

**Využití:** Hráč sleduje vlaštovku a zároveň časovací pruh pod scénou. V rychlém letu může být náročné přesouvat pozornost.

**Konkrétní návrh:** B06. První QTE vyzkoušet v dobrovolném opakovatelném tréninku, potom nechat hráče létat. Nejprve testovat čitelnější varování při nezměněném časovém okně; až samostatně testovat delší mezeru mezi pozdními QTE. Přesun indikátoru do scény je další izolovaný experiment, ne souběžná změna všech tří věcí.

**Ověření:** Oddělit „nevšiml si“, „nepochopil“ a „věděl, ale netrefil“. Zkontrolovat pomalé i rychlé modely a mobil. Nezvyšovat obtížnost skrytě podle předchozích úspěchů.

**Priorita:** P0 pro srozumitelnost, P1 pro rytmus. Riziko: nekonečný tutoriál nebo naopak příliš mnoho výzev bez prostoru sledovat krajinu.

### K4 — Chci vidět, co je za dalším místem

**Poznatek:** N — hypotéza pro naši souvislou trasu: konkrétní příslib dalšího místa může dát letu osobní smysl. Nejde o samostatně ověřený výsledek těchto čtyř zdrojů.

**Zdroj a omezení:** Lokální [definice trasy](src/scenes.js); S4 je metodická připomínka, proč vlastní hypotézu neoznačit za univerzální psychologický zákon.

**Využití:** Dílna, maják, pole a observatoř už mají polohu a krátký příběh. Vzdálený cíl však může být pro první pokusy nedosažitelný.

**Konkrétní návrh:** B05 a B09. Ukázat nejbližší neobjevené místo s jeho skutečnou vzdáleností. V prvních pokusech doplnit malé příběhové detaily uvnitř první obrazovky, bez zkracování čtyř obrazovek na biom. První návštěvu ocenit kartou místa; hotovostní bonus zatím nepřidávat.

**Ověření:** Před dalším hodem se zeptat „Kam se chceš dostat?“; po letu „Čeho nového sis všiml?“. Testovat připomenutí cíle zvlášť od změny krajiny.

**Priorita:** P0 pro cíl, P1 pro objevy. Riziko: vizuální slib obsahu, který běžný postup nikdy neumožní navštívit.

### K5 — Každý pokus může mít malý smysluplný cíl

**Poznatek:** H/S2 poskytuje jasné cíle jako hledisko hodnocení. N — pro nás bude užitečnější jeden čitelný cíl než několik současných ukazatelů.

**Zdroj a omezení:** S2; délka cyklu, ceny a pořadí našich milníků nejsou výsledkem tohoto modelu.

**Využití:** Hráč může trénovat sílu hodu, blížit se k místu nebo šetřit na vylepšení. Po 500 m současný HUD nenabízí další cíl.

**Konkrétní návrh:** B05, B08 a B10. Zobrazit jeden aktivní cíl; hráč si může vybrat vzdálenost, dovednost nebo objev. V dílně ukázat, kolik mincí zbývá do zvoleného nákupu; neuvádět garantovaný počet zbývajících hodů. Dovednostní cíle nesmějí blokovat základní postup.

**Ověření:** Hráč před hodem dovede pojmenovat svůj cíl a po něm rozpozná posun. Kontrolovat hráče s nulovou úspěšností QTE i šetření bez nákupů.

**Priorita:** P0/P1. Riziko: grind maskovaný barevným pruhem; více pokusů do nákupu není samo o sobě více obsahu.

### K6 — Úspěch je cítit přímo při akci

**Poznatek:** H/S2 zahrnuje kontrolu a odezvu. N — konkrétní kombinaci animace a zvuku musíme ověřit, ne zdůvodňovat domnělou „dopaminovou dávkou“.

**Zdroj a omezení:** S2 a lokální render; nemáme důkaz optimální hlasitosti, délky efektu nebo vlivu otřesů obrazovky.

**Využití:** Perfektní zásah má už herní efekt, ale hráč jej potřebuje spojit s vlastní akcí a změnou letu.

**Konkrétní návrh:** B04. Nejprve krátké zvýraznění vlaštovky a rozlišitelná ikona při zásahu, bez blokování dalšího vstupu. Zvuk přidat až jako samostatný test, s vypnutím. Zachovat rozlišení úspěchu symbolem a textem i bez barvy, zvuku a pohybových efektů.

**Ověření:** Hráč správně pozná výsledek bez čtení dlouhého panelu; míra chyb v následujícím QTE se nezhorší. Kontrola ztišení a omezeného pohybu.

**Priorita:** P1, po opravě vysvětlení. Riziko: oslava skryje další výzvu nebo pozitivně označí pomoc holuba, která ve skutečnosti poškodila let.

### K7 — Vracím se k jiné výzvě, ne k povinnosti

**Poznatek:** N — pro tuto hru navrhujeme opakovatelný obsah a experimentování; S1 je obecná inspirace pro dobrovolnou volbu, ne důkaz návratů po týdnu.

**Zdroj a omezení:** S1 a S4; dlouhodobé návraty naší cílové skupiny zatím neměříme.

**Využití:** Seedy letu existují; atlas, kosmetika a pevné výzvy nikoli. Výzva musí nabídnout jiný cíl než další automatické zvýšení statistiky.

**Konkrétní návrh:** B10–B13. Trvalé úkoly typu „dva perfektní zásahy v jednom letu“, pokus s předem danou konstrukcí a atlas 16 míst. Kosmetické sklady papíru nebo barevné stopy získávat za viditelné podmínky, bez náhodných balíčků. Při návratu připomenout zvolený cíl, ne počet vynechaných dnů.

**Ověření:** Dobrovolně dostupný odkaz na hru po testu; po týdnu se při předem dohodnutém rozhovoru ptát na návrat a jeho důvod. Návrat kvůli připomínce nezaměňovat za spontánní návrat.

**Priorita:** P2, etapa 3, až po ověření krátkého cyklu. Riziko: sbírka vyplněná opakováním stejné akce bez nové dovednosti.

<a id="cesta"></a>
## 4. Propojení 500 metrů s celou cestou

**Fakt:** `640 / 2,1 ≈ 304,76 m` na obrazovku. První biom končí asi v 1 219 m, okruh v 4 876 m. Současných 500 m je přibližně 1,64 obrazovky, tedy stále tržnice v prvním biomu. Většina trasy se do stávajícího cíle nevejde.

**Návrh hierarchie cílů:**

| Horizont | Cíl a zobrazení | Pravidlo |
|---|---|---|
| Příští akce | Přesnější uvolnění nebo načasování jednoho QTE | Jedna volitelná rada; neporovnávat cenu konstrukce s dovedností. |
| Příští pokus | Další existující milník 100/250/500 m, poté nejbližší nové místo; alternativně zvolená dovednost | Jeden hlavní cíl. Po jeho dosažení nabídnout další, nevynucovat pokračování. |
| Krátká hra | 500 m jako dokončení úvodní etapy | Jasné zakončení s možností skončit spokojeně; nezrušit dosažené dokončení starým hráčům. |
| Delší postup | Objevit přístav, krajinu, metropoli a všech 16 míst | Atlas se sbírá napříč pokusy, návštěva místa ale vyžaduje skutečné dosažení dané souřadnice v letu. |
| Mistrovství | Vlastní rekord a pevné výzvy | Dosažení celé trasy v jednom letu je volitelná výzva, ne podmínka vstupu do dalších aktivit. |

Návrh nemění první biom na čtyři rychle se přepínající obrázky. Blízké objevy mohou být drobnosti uvnitř stávajících míst: nápis dílny, holub na střeše nebo výjezd vlaku. Doporučený první prototyp zkoumá tři takové detaily v prvních 100 m, každý výrazně odlišný; rozestupy i čitelnost ověřit s hráči.

**Podmínka před slibováním celé trasy:** Na aktuální fyzice ověřit dosažitelnost hranic biomů pro několik konstrukcí a profilů QTE. Pokud je konec při konečných upgradech nedostupný nebo vyžaduje únavně dlouhý let, vyzkoušet samostatné tréninkové starty v již odemčených biomech. Takové starty oddělit od rekordu letu z dílny. Neprodlužovat automaticky čas plachtění. Jde o následný experiment, nikoli již schválenou změnu pravidel.

Pozdější změna dokončení vyžaduje oddělit „úvod hotov“ a „atlas hotov“ také v načítání uložení: současný `decode()` dokončení přepočítává z rekordu 500 m. Tato KB žádné uložení nemigruje.

<a id="backlog"></a>
## 5. Prioritizovaný backlog a experimenty

**P0:** nejprve vysvětlit a ověřit základ; **P1:** další krátký herní postup; **P2:** návraty po ověření základu. Náročnost **S/M/L** je relativní rozsah proti ostatním položkám, nikoli závazný odhad dnů. Veškeré přínosy jsou hypotézy. Každý řádek je samostatný experiment proti zmrazené současné verzi.

| ID / etapa / priorita | Návrh a očekávaný přínos | Náročnost a závislosti | Riziko nudy/frustrace | Experiment a rozhodovací signál |
|---|---|---|---|---|
| B00 / 1 / P0 | Audit účinku holuba: odstranit nesoulad mezi „pomocí“ a zpomalením, pokud se potvrdí škoda | M; párové lety se stejným seedem, konstrukcí a hodem | Pocit nespravedlivého výsledku po správném zásahu | Porovnat zásah s vynecháním pro rychlé i pomalé lety. Zaznamenat okamžitou rychlost i čistý dolet; změnu bonusu testovat odděleně od odezvy. |
| B01 / 1 / P0 | „Brzy / pozdě / bez zásahu“ usnadní opravu časování | S; záznam času vstupu a expirace QTE | Zahlcení přesnými milisekundami | Prototyp pouze s novým textem; hráč správně vysvětlí chybu a zkusí odpovídající opravu. |
| B02 / 1 / P0 | Jedna pravdivá rada po letu propojí akci s učením | S; B01, údaje o hodu | Opakovaná nebo chybná rada | Pořadí prototypu: slabá síla → poslední minuté QTE → žádná rada, pokud není opora. Porovnat porozumění a dobrovolné použití rady; nezměnit současně bonusy. |
| B03 / 1 / P0 | Rozdíl proti rekordu stejného modelu a úrovní oddělí konstrukci a výkon | M; historie konfigurace v budoucím uložení | Rekord za jiných podmínek působí nedosažitelně | Ukázat „rekord této konstrukce“ s upozorněním na jiné události; ptát se, čemu hráč připisuje změnu. Přesné srovnání patří do B12. |
| B04 / 1 / P1 | Krátká odezva zásahu zdůrazní účinek, udrží pozornost ve scéně | S pro obraz, M pro zvuk; B00 | Efekt překryje QTE nebo obtěžuje | A/B nejprve bez/s obrazovým zvýrazněním; následně odděleně zvuk. Kontrola rozpoznání výsledku i dalšího zásahu. |
| B05 / 1 / P0 | Jeden navazující cíl odstraní slepý konec po 500 m | M; definice míst a hierarchie z oddílu 4 | Cíl je příliš vzdálený; několik ukazatelů soutěží o pozornost | Změnit pouze cíl v HUD/výsledku. Před pokusem zaznamenat, kam hráč chce letět, a po něm, zda rozumí posunu. |
| B06 / 1–2 / P0 | Čitelnější první QTE a volitelný trénink sníží nepochopení | M; B01; klávesnice a dotyk | Trénink zdrží zkušené, hráč jen odkliká instrukci | Nejprve testovat varování, potom trénink; samostatně rytmus pozdějších výzev. Oddělit nepostřehnutí od motorické chyby. |
| B07 / 2 / P1 | Zřetelnější modely a jedna odlišná větev posílí experimentování | L; aktuální simulace a budoucí migrace nákupů | Dominantní volba nebo znehodnocení starých nákupů | Oddělený prototyp větve přehybů z K2. Hráč zdůvodní strategii; simulace prověří dominanci. Staré nákupy během testu nepřepisovat. |
| B08 / 2 / P1 | Tempo odměn nabídne další volbu bez čekání a grindu | M; aktuální baseline, čas celého cyklu | Levné vše odstraní volbu, drahé vše vytvoří opakování bez obsahu | Měřit skutečný čas do dostupnosti nákupu i čas jeho provedení. Otestovat jednu změnu ceny; zachovat první dostupný nákup i při nule QTE. |
| B09 / 2 / P1 | Blízké objevy a karta první návštěvy dají cestě drobné cíle | M; definice míst, později uložení objevů | Hráč si dekorace nevšimne nebo efekt zakryje let | Nejprve jeden nový detail ve startovním úseku, pak karta. Po letu nechat hráče popsat novinku; nabídku opakování nevnucovat. |
| B10 / 2–3 / P1 | Trvalé volitelné dovednostní úkoly nabídnou různé způsoby úspěchu | M; jednoznačné vyhodnocení hodu/QTE | Úkol motivuje úmyslně hrát hůř nebo působí jako povinnost | Tři prototypové úkoly: silný hod, dva perfektní zásahy, nové místo. Bez dodatečných mincí; sledovat volbu a důvod, nikoli jen splnění. |
| B11 / 3 / P2 | Atlas 16 míst zviditelní dlouhodobé objevování | M; B05/B09, migrované uložení; ověřená dosažitelnost | Seznam prázdných polí místo zajímavého světa | Ukázat atlas až po prvním objevu. V návratovém rozhovoru zjistit, zda si hráč vybral konkrétní další místo. |
| B12 / 3 / P2 | Pevná výzva umožní férově zkoušet lepší provedení | L; fixovaný seed, vítr, model, úrovně, výchozí stav a verze fyziky | Tentýž seed mylně působí jako totožný průběh navzdory jinému letu | Nabídnout jednu nepovinnou výzvu. Nechat hráče měnit hod a QTE; ověřit determinismus při stejných vstupech. Porovnávat jen stejnou verzi výzvy. |
| B13 / 3 / P2 | Kosmetika za mistrovství dá dosaženému cíli osobní výraz | M; B10, výběr vzhledu a uložení | Sběr převáží nad hrou nebo zhorší čitelnost | Jedna varianta papíru za viditelný úkol, bez změny síly. Ptát se, zda je zajímavá sama hra i bez odměny; kontrolovat kontrast. |
| B14 / 1 / P0 | Zachovat rychlé Znovu a odstranit jen pozorované tření | S; stávající přímý přechod na míření | Automatický restart vezme možnost zvolit nákup nebo skončit | Měřit čas kliknutí Znovu → připravené míření a zbytečné kroky. Pokud problém není, neimplementovat novou obrazovku ani časovač. |

**Doporučené pořadí práce:** Zaznamenat baseline a B00; poté postupně B01, B02, B05 a kontrola B14. B06 jen podle zjištěných problémů. Teprve potom B04 a B07–B10; B11–B13 až po úspěšném krátkém cyklu. Nepřidávat všechny návrhy současně, jinak nepoznáme příčinu výsledku.

Každý experiment uzavřít záznamem: verze, změna, hypotéza, účastníci/podmínky, pozorování, náklady a rozhodnutí **ponechat / upravit / zahodit / nedostatek dat**. Negativní zjištění ponechat v historii.

<a id="test"></a>
## 6. První hráčský test

### Vzorek a příprava

Pozvat 5–8 dospělých: začátečníky, příležitostné a zkušenější hráče. Zahrnout alespoň dva testy dotykem a dva klávesnicí/myší, jsou-li zařízení dostupná. To je malý kvalitativní vzorek pro odhalení potíží, ne reprezentativní průzkum ani důkaz statistického zlepšení. Dětskou použitelnost z něj nevyvozovat.

Použít izolovaný testovací profil s čerstvým postupem; nemažte hráčovo existující uložení. Připravit rovněž profil po 500 m a na vstupu do dalšího biomu. Pokročilé profily slouží k hodnocení orientace v cílech, ne jako důkaz, že se tam hráč přirozeně dostane.

Zaznamenat sestavení, zařízení a variantu. Moderátor může použít anonymní ID účastníka a ruční poznámky. Test lze kdykoli ukončit; délka není výkon hráče. Bez automatického nahrávání a analytiky.

### Scénář přibližně 20–25 minut

| Fáze | Zadání moderátora | Co pozorovat |
|---|---|---|
| 0–2 min | „Vyzkoušej hru tak, jak bys ji otevřel sám.“ | První očekávání, nalezení hodu, pochopení držení a uvolnění. |
| 2–7 min | Nechat první 3–5 pokusů; neradit s načasováním. Po dopadu: „Co se stalo?“ | Rozlišení síly a úhlu, všimnutí QTE, oprava chyby, kam se dívá. Pokud uvázne, pomoci a pomoc zapsat. |
| 7–12 min | „Co bys chtěl zkusit dál?“ | Vlastní cíl, rozhodnutí o nákupu, důvod opakování, čas v dílně vs. čekání. |
| 12–16 min | Nabídnout profil po 500 m a krátce další biom; vysvětlit, že jde o připravený profil. | Pochopení navazujícího cíle, zájem o místo, zapamatovatelnost trasy. |
| 16–20 min | Pokud existuje jediná změněná varianta, nechat 2–3 srovnatelné pokusy. | Rozdíl v porozumění a prožitku; nemíchat novou fyziku s novým textem. |
| Závěr | „Můžeš skončit, nebo si ještě zahrát.“ Potom krátký rozhovor. | Volba bez pobízení, důvod ukončení; ani pokračování kvůli zdvořilosti nepovažovat automaticky za motivaci. |

Při načasovaných akcích nepožadovat soustavné přemýšlení nahlas; výpověď získat po letu. Pro první seznámení použít stejnou baseline; ve srovnávací části střídat pořadí A/B a B/A. Učení nezmizí pouhým střídáním, proto rozdíl nepovažovat za čistý kauzální odhad.

### Otázky po hraní

1. Co jsi mohl ovlivnit a co podle tebe bylo náhodné?
2. Podle čeho jsi poznal dobrý hod nebo dobrou reakci?
3. Co bys změnil při dalším pokusu?
4. Kdy ses nudil, čekal nebo cítil nespravedlnost?
5. Které místo si pamatuješ a kam bys chtěl letět?
6. Proč bys pokračoval, případně proč chceš skončit?

Doplnit vlastní pracovní škály 1–7: zábavnost, pocit kontroly, přiměřenost výzvy a frustrace. Neoznačovat je za validovanou škálu PENS ani diagnostický nástroj. Přidat volnou větu vysvětlení; průměr bez příběhu může skrýt opačné zkušenosti.

### Pracovní rozhodovací pravidla

Opakované nepochopení stejné akce u dvou lidí je důvod k opravě a dalšímu testu, nikoli odhad procenta všech hráčů. Za užitečný kvalitativní signál považovat, když více účastníků po změně přesněji vysvětlí akci, upraví ji a nepřibude jiná opakující se frustrace. Změnu nepovažovat za úspěšnou jen kvůli delšímu sezení. Technická chyba, ztráta postupu nebo nečitelný vstup musí být vyřešeny před interpretací motivace.

<a id="mereni"></a>
## 7. Měření a rozhodování

### Kandidátní metriky

| Metrika | Definice | Omezení interpretace |
|---|---|---|
| Doba letu | Vypuštění → dopad v aktivním herním čase | Delší může znamenat zajímavý let i pasivní čekání. |
| Celý cyklus | Začátek míření → začátek dalšího míření, rozpad na míření, let, výsledek a dílnu | Nedokončené cykly vykázat zvlášť; neskrývat je vyřazením. Pauzu a skrytou kartu oddělit. |
| Opakování | Volba Znovu mezi dokončenými pokusy s dostupným výsledkem | Ovlivňuje nákup i instrukce moderátora; není přímou mírou zábavy. |
| QTE | Úspěch/perfektní/brzy/pozdě/bez vstupu, podle typu a zařízení | Událost utnutá dopadem před koncem okna je zvláštní kategorie, ne plnohodnotné minutí. |
| První upgrade | Aktivní čas a počet pokusů do dostupnosti; zvlášť do skutečného nákupu | Šetření není automaticky problém ekonomiky. |
| Objevení | První skutečný průlet souřadnicí místa; počet různých míst | Samotné vykreslení vzdáleného objektu ani náhled v atlasu není návštěva. |
| Zlepšení | Chyba časování/síla, případně rekord při stejné konfiguraci a verzi | Rozdílné QTE a hod nejsou čistě srovnatelné podmínky. |
| Návrat | Dobrovolné hraní v následném období plus hráčem uvedený důvod | Bez historie či rozhovoru návrat neznáme; z místního identifikátoru nelze odvodit počet unikátních lidí. |
| Zkušenost | Zábavnost, kontrola, frustrace a otevřený komentář | Pracovní škály, citlivé na kontext; hodnotit vedle chování. |

### Kandidátní události pro budoucí implementaci

Následující je slovník, **žádný sběr se tímto dokumentem nezavádí**. Začít ručním testem; pozdější lokální diagnostiku navrhnout zvlášť, bez serverového odesílání v této etapě.

| Událost | Okamžik | Minimální smysluplný obsah |
|---|---|---|
| `aim_started` | Zobrazení připraveného míření | ID pokusu v testu, model, úrovně, verze sestavení. |
| `throw_released` | Vypuštění | Úhel, síla, délka držení, typ vstupu, seed. |
| `qte_presented` | Skutečně zobrazené aktivní okno | ID a typ QTE, herní čas, vzdálenost. |
| `qte_resolved` | Vstup, expirace nebo dopad | Výsledek, důvod, odchylka od středu; odlišit přerušení a žádný vstup. |
| `flight_landed` | Jednorázové vyhodnocení dopadu | Dolet, čas, odměna, příznak rekordu. |
| `result_action` | Znovu / Vylepšení / Dílna | Volba a čas od výsledku. Neodvozovat důvod z volby bez dotazu. |
| `upgrade_available` / `upgrade_bought` | První dostupnost / skutečný nákup konkrétní úrovně | Větev, model, úroveň, cena, číslo pokusu; dostupnost neduplikovat každý frame. |
| `place_discovered` | První průlet hranicí dosud nenavštíveného místa | Stabilní ID místa, vzdálenost, režim letu; další okruh nevytváří první návštěvu. |
| `goal_selected` / `goal_completed` | Výběr / splnění | ID cíle, režim; odlišit automatický návrh od hráčovy volby. |
| `visibility_changed` | Skrytí a návrat | Změna stavu a relativní čas pro odečtení pauzy. |

Žádná jména, e-maily ani otisky zařízení nejsou pro tato rozhodnutí potřeba. `session_end` z uzavření stránky není spolehlivý signál; přerušené relace označit jako neúplné. Ztracená data nepřevádět na nuly.

### Experimenty ve větším vzorku

Před sběrem určit jednu primární metriku podle hypotézy, minimální prakticky zajímavý efekt, baseline, potřebnou velikost vzorku a dobu testu. Velikost odvodit z variability a zvoleného statistického návrhu, ne z libovolného počtu hráčů. Při A/B přidělovat variantu hráči, ne každý pokus; pokusy stejného hráče nejsou nezávislá pozorování. Zafixovat verzi hry, ceny a sledované období. Nezastavovat experiment při prvním příznivém výsledku. Při nedostatku dat přiznat nejistotu.

Technické kontroly budoucích mechanik: hraniční časování QTE, jediná odměna, přerušené okno, výpočet rekordu před aktualizací, první návštěva jen jednou, zachování starých nákupů při migraci, deterministická výzva, pauza a ztišení. Až implementace tyto kontroly splní, interpretovat výsledky hráčského testu.

<a id="pravidla"></a>
## 8. Pravidla a dokončení dokumentu

- Udržet dobrovolnost: žádná energie, čekací časovače, mikrotransakce ani trest za vynechaný den. Výzvy a odměny neexpirují.
- Nepoužívat umělé těsné prohry, falešné rekordy ani skryté zhoršení výsledku k vynucení dalšího pokusu. Překvapení vytvářet obsahem, ne zatajovanými šancemi placené odměny.
- Odměňovat konkrétní dosažení a objev. Nepřidávat náhodný finanční výnos jako náhradu za zajímavý hod.
- Zachovat možnost skončit po úspěchu. Úvodní finále nemusí vždy okamžitě vyvolat další požadavek.
- Multiplayer, globální žebříčky, cloudové účty a monetizace nejsou součástí prvních etap. Zvážit je až při konkrétní hráčské potřebě.

**Co tento dokument dodává:** datovaný audit, oddělené důkazy a hypotézy, sedm principů, návrh hierarchie cílů, backlog s přínosy/riziky/experimenty, scénář testu a slovník měření. **Co nedodává:** novou fyziku, nasazené mechaniky, analytiku, migrovaná data ani potvrzení zábavnosti od hráčů.

Při změně kódu aktualizovat audit a označit příslušné návrhy jako experimentované nebo implementované; nikdy ne automaticky jako ověřené. Záznam z hráčského testu doplnit datem, verzí a rozhodnutím. Toto KB doplňuje [původní fyzikální KB](<KB vlastovky.md>); nenahrazuje její fyzikální kontrakt.

<a id="zdroje"></a>
## 9. Zdroje

Všechny zdroje ověřovány 12. 10. 2026; rok u zdroje je rok publikace, ne datum procházení.

| ID | Bibliografie a přístup | Použití a rozsah ověření |
|---|---|---|
| S1 | Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). *The Motivational Pull of Video Games: A Self-Determination Theory Approach.* Motivation and Emotion. [DOI](https://doi.org/10.1007/s11031-006-9051-8), [plný text na University of Rochester](https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf). | Abstrakt, vymezení pojmů a metody studií; inspirace pro K1, K2, K7. Nepotvrzuje naše parametry. |
| S2 | Sweetser, P., & Wyeth, P. (2005). *GameFlow: A Model for Evaluating Player Enjoyment in Games.* Computers in Entertainment, 3(3). [Záznam vydavatele / DOI](https://doi.org/10.1145/1077246.1077253), [alternativní PDF](https://www.valuesatplay.org/wp-content/uploads/2007/09/sweetser.pdf). | V této rešerši dostupný indexovaný abstrakt/záznam; načtení plných textů selhalo. Použito pouze jako rámec pro K3, K5, K6, nikoli důkaz účinku mechanik. |
| S3 | Burgers, C., Eden, A., van Engelenburg, M. D., & Buningh, S. (2015). *How feedback boosts motivation and play in a brain-training game.* Computers in Human Behavior, 48, 94–103. [DOI](https://doi.org/10.1016/j.chb.2015.01.038), [autorská kopie](https://christianburgers.wordpress.com/wp-content/uploads/2016/08/burgers-eden-van-engelenburg-buningh-2015.pdf). | Experiment, výsledky a limity diskuse; K1 a oddělení okamžitého opakování od prožitku. |
| S4 | Tyack, A., & Mekler, E. D. (2024). *Self-Determination Theory and HCI Games Research: Unfulfilled Promises and Unquestioned Paradigms.* [Preprint a abstrakt](https://arxiv.org/abs/2405.12639), [navazující publikace](https://doi.org/10.1145/3673230). | Ověřený abstrakt a publikační metadata; metodická opatrnost. Nepřebíráme neověřené podrobnosti plného rozboru. |

Lokální zdroje auditu jsou přímo propojené v [oddílu 2](#audit). Výzkumné souhrny jsou stručné parafráze; návrhy a testovací postupy jsou vlastní pracovní návrh pro tento projekt.
