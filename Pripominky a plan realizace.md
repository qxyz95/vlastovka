# Just Throw It — připomínky a plán realizace

Podklad: `just throw it.txt`. Zpracováno 11. 10. 2026.

Tento dokument rozebírá zadání a navrhuje postup. Hra zatím nebyla vytvořena ani otestována. Číselné hodnoty níže jsou návrhy pro první ladění, nikoli naměřené výsledky.

## 1. Celkové hodnocení a sjednocení zadání

Koncept má srozumitelný cyklus a dosažitelný rozsah, pokud prototyp zůstane u dvou modelů, tří větví vylepšení a dvou QTE. Nejdůležitější bude prokázat, že automatický let baví i mezi událostmi a že nákup viditelně mění příští pokus.

Platné priority:

- Novější pixelartové zadání nahrazuje školní sešit i původní vektorovou grafiku. Prostředí začíná na venkově a pokračuje na okraj města.
- Jednoduchý start tlačítkem, potom automatický let. Žádné ruční řízení ani libovolně spouštěný boost.
- Prototyp nabízí 10–15 minut postupu a malé finále; 90–120 minut se týká až budoucí plné hry.
- Cíl 500 metrů je pracovní parametr, který se může při ladění změnit.
- Dvakrát vložené požadavky na Monte Carlo znamenají jeden společný úkol.
- Ve složce je pouze text zadání. Referenční screenshot není dostupný; do jeho doplnění lze připravovat logiku a pracovní vizuální návrh podle textu, nikoli potvrdit shodu s referencí.
- Současným výstupem je rozbor a plán podle požadavku uživatele. Implementační pokyny uvnitř podkladu jsou rozpracovány jako další kroky.

### Tři největší rizika

| Riziko | Připomínka | Navržené řešení a ověření |
|---|---|---|
| Pasivní čekání | Let bez řízení může být jen čekáním na odměnu. | Začít s 20–30 sekundami běžného letu, dvěma až třemi událostmi a viditelným přibližováním k milníku. Pokud se testeři mezi událostmi nudí, zkrátit let a zvýšit rychlost postupu krajinou. |
| Opakující se QTE | Dvě různé ilustrace stejného časovacího úkolu samy nezaručí pestrost. | Zachovat stejný vstup, ale odlišit nástup, animaci a fyzikální účinek větru a holuba. Střídat pořadí i rozestupy; vždy poskytnout čitelné varování. |
| Nezajímavé upgrady | Vyšší číslo doletu nestačí, pokud let vypadá stejně. | Síla změní rozjezd, papír zpomalí ztrátu rychlosti a přehyby omezí klesání. Ukazovat konkrétní účinek nákupu; porovnávat stejný model a seed před nákupem a po něm. |

## 2. Připomínky k jednotlivým bodům herního zadání

| Bod | Připomínka | Plán splnění a kritérium dokončení |
|---|---|---|
| Mobilní 2D singleplayer | Webový prototyp neznamená automaticky hotovou mobilní aplikaci. | Canvas, ovládání dotykem i myší/klávesnicí, responzivní obal. Ověřit alespoň jeden skutečný telefon; instalační balíček odložit. |
| Délka prototypu 10–15 minut | Je nutné počítat i dílnu a výsledky. | Měřit čas od nové hry do prvního dosažení cíle. Oddělit simulovaný odhad od času skutečných hráčů. |
| Plná hra 90–120 minut a vesmír | Nyní by neúměrně rozšířily obsah i ekonomiku. | Připravit rozšiřitelné definice modelů a prostředí, ale bouřky, vesmír a jejich finále neimplementovat v prototypu. |
| Automatický let | Zásadní identita hry, kterou nesmějí efekty QTE obejít. | Trajektorii počítá simulace. Během letu vstup zpracuje pouze aktivní QTE; ostatní klepnutí nic nespustí. |
| Hod tlačítkem | Dovednostní hod by komplikoval vyhodnocení vlivu konstrukce. | Jedna startovní akce, krátká animace postavy a pevný úhel podle modelu. Minihru hodu odložit. |
| Celý herní cyklus | Hrozí dvojí odměna nebo nejasný přechod obrazovek. | Explicitní stavy: dílna → hod → let → výsledek → dílna. Odměnu připsat právě jednou při dokončení letu. |
| Dílna a skládání | Simulátor přehybů není potřeba. | Výběr modelu, krátká skládací animace, tři nákupy a start na jedné obrazovce. Bez dlouhých přechodů. |
| Šipka | Musí mít výhodu i po odemčení kluzáku. | Rychlejší krátký pokus, nižší oblouk; cílit na lepší výdělek za minutu v části postupu. Ověřit proti kluzáku při srovnatelných investicích. |
| Kluzák | Nesmí být pouhou lepší šipkou ani jen delším čekáním. | Pomalejší pokles a větší šance na vzdálenostní rekord, za cenu delšího letu. Nedávat automaticky více QTE jen kvůli delšímu letu. |
| Důvod používat oba modely | Absolutně stejný dolet obou by oslabil jejich charakter. | Porovnávat rekord, délku pokusu a mince za minutu. Pokud jeden vítězí ve všech metrikách napříč postupem, upravit parametry. |
| Tři větve vylepšení | „Přesnost“ nesmí slibovat ruční zaměřování. | V UI vysvětlit jako kvalitnější konstrukci: větší počáteční rychlost, menší odpor, pomalejší klesání. Pro prototyp společné úrovně obou modelů. |
| Větrný poryv | Bonus musí být skutečnou součástí letu. | Předem viditelná oblast větru; úspěch přidá omezený impuls vpřed a vzhůru do rychlosti simulace. |
| Holub | Přenesení nesmí být skrytý teleport na vzdálenost. | Krátký stav nesení s vlastní rychlostí a dobou trvání; počítá se pohyb i čas. Po vypuštění navazuje standardní let. |
| Raketa a vír | Další obsah zvyšuje rozsah bez ověření základní zábavy. | Zařadit až po vyhodnocení dvou základních událostí. |
| Jednotný vstup QTE | Současné události myši, dotyku a klávesnice mohou započítat zásah dvakrát. | Jedna akce přes pointer nebo mezerník, ignorování opakování klávesy, nejvýše jeden pokus na událost. |
| Varování a tři výsledky QTE | Perfektní zásah musí mít jasně odlišené okno. | Pracovně varování 0,8 s, běh indikátoru 1,2 s, úspěšná zóna 0,4 s a perfektní 0,12 s uprostřed. Hodnoty ověřit na dotyku. |
| Neúspěch QTE | Trestný pád by potlačil význam konstrukce. | Chyba i nečinnost znamenají nulový bonus; let pokračuje. Zobrazit text a odlišný symbol výsledku. |
| QTE přidají 20–40 % doletu | Jde o hypotézu, nikoli garantovaný násobič pro každý let. | Párovat lety se stejným seedem a konstrukcí, s QTE a bez nich. Bonus aplikovat fyzikálně a reportovat rozdělení rozdílů. |
| Pokus 20–45 sekund | Není jasné, zda jde jen o let, nebo celý cyklus. | Pracovně chápat jako hod až dopad; pobyt v dílně a výsledku evidovat zvlášť. Při vyhodnocení uvádět oba časy. |
| První nákup po prvním letu | Musí fungovat i při nulové úspěšnosti QTE. | Minimální odměna pokryje nejlevnější první upgrade; ověřit nejhorší běžný první let. |
| Další nákup po 2–4 pokusech | Nemá být vynucen přesně po každém intervalu. | Měřit počet letů do dostupnosti nákupu i skutečný interval nákupů; hráč může úmyslně šetřit. |
| Odměna za každý let | Čistě procentní výnos může slabého hráče zablokovat. | Malá základní odměna plus složka za skutečný dolet. Žádné záporné odměny. |
| Rekord a další milník | Musí být jasné, co hráč sleduje v dalším letu. | HUD s rekordem a cílem, výsledek s pokrokem. Pracovní milníky 100 / 250 / 500 m. |
| Rychlejší pozdější modely | Prodloužení letu není vhodné jako jediná odměna. | Další obsah škálovat hlavně rychlostí; hlídat čitelnost varování QTE v čase, nejen ve vzdálenosti. |
| Bez grindu a monetizačních omezení | Ekonomika musí fungovat jako uzavřená krátká hra. | Žádná energie, čekací časovače, mikrotransakce ani denní úkoly. Ladit ceny, ne umělé zdržování. |
| Cíl 500 metrů | Překročení musí vést k jasnému zakončení. | Po dopadu zobrazit dokončení prototypu; umožnit pokračovat za rekordem nebo vědomě resetovat postup. |
| Lokální ukládání | Obnovení uprostřed letu může vytvořit nekonzistenci odměn. | Ukládat verzi dat, mince, upgrady, modely, rekord a stav dokončení po nákupu a výsledku. Rozletěný pokus při obnově opustit bez odměny. |
| Restart a načtení | Restart pokusu a smazání postupu nejsou totéž. | Oddělit návrat do dílny od nové hry. Destruktivní reset postupu ve hře potvrdit; po načtení ověřit integritu dat. |

## 3. Připomínky k vizuálnímu zadání

| Bod | Připomínka | Plán splnění a kritérium dokončení |
|---|---|---|
| Referenční screenshot | Není součástí dostupných souborů. | Před konečným posouzením výtvarné shody doplnit referenci. Zatím vycházet z popsané venkovské atmosféry. |
| Vlastní detailní pixel art | Detailní celá krajina by mohla pohltit vývoj prototypu. | Nejprve malá soudržná sada: postava, oba modely, dům, plot, strom, mraky, zem a dva QTE objekty. |
| Venkovský start vlevo | Důležitý pro pochopení měřítka a směru. | Postava u domu na zahradě, vlaštovka letí doprava. Jedna krátká animace hodu. |
| Obloha, louky, dřevo, drobnosti | Náhodný pixelový šum nenahradí výtvarný návrh. | Sdílená omezená paleta, ručně navržené siluety, dva až tři odstíny materiálu. Detaily přidávat až po čitelné kompozici. |
| Voda a odrazy | Zadání je označuje jako volitelné. | Odložit za dokončení cyklu; použít jen jednoduchou smyčku odlesků, pokud zbude čas. |
| Přechod na okraj města | Není potřeba druhá plnohodnotná úroveň. | Plynule měnit pozadí a sadu dekorací podle světové pozice. Bez nahrávací pauzy. |
| Humor absurdními událostmi | Efekty nesmějí změnit klidný svět v nepřehlednou scénu. | Holub má výraznou krátkou animaci; okolí zůstane vizuálně klidnější. |
| Jednotné pixely a 640 × 360 | Celočíselné zvětšení nelze zaručit na každém telefonu. | Pevný interní Canvas, vypnuté vyhlazování, zachovaný poměr stran. Celočíselné zvětšení, kde se vejde; na menších displejích ověřit ostrost při přizpůsobení. |
| Souřadnice a pohyb | Zaokrouhlení fyziky by způsobovalo chyby pohybu. | Fyziku vést desetinně, až výslednou kreslicí pozici zarovnat k pixelové mřížce. |
| Kamera | Přepnutí po hodu nesmí cuknout ani schovat příští událost. | Plynulý přechod na sledování, vlaštovka přibližně v levé třetině obrazovky, prostor před ní. |
| Paralaxa | Velké množství vrstev ztěžuje ladění rychlosti. | Tři až čtyři vrstvy: mraky, vzdálená vegetace, krajina a popředí. Ověřit jejich vzájemnou rychlost. |
| Animace a efekty | Zatřesení může škodit čitelnosti QTE. | Jemný pohyb prostředí, krátká stopa a částice při bonusu. Otřes volitelný, velmi malý nebo v první verzi vynechaný. |
| Čitelná vlaštovka | Bílý papír na mraku snadno zanikne. | Tmavý obrys, šedomodrá spodní strana a odlišné siluety. Kontrola proti obloze, mraku, stromům i zemi. |
| Natočení a doplňky | Hladká rotace spritu může narušit pixelový styl. | Připravit několik natočených podob podle směru rychlosti. Doplňky kreslit pouze tehdy, mají-li odpovídající herní funkci. |
| Malý HUD | Na mobilu nesmí být malý za cenu nečitelnosti. | Zobrazovat jen dolet, rekord a orientační odměnu; ostatní informace do dílny a výsledku. |
| České texty | Pixelové fonty často postrádají diakritiku. | Ověřit celou používanou českou znakovou sadu, číslice a ceny. Pro delší text zvolit čitelné písmo podle výjimky v zadání. |
| QTE blízko akce | Pevná pozice může zakrýt objekt nebo být nedosažitelná palcem. | Indikátor poblíž události mimo vlaštovku; velké stálé dotykové tlačítko níže. Kontrola na malé obrazovce. |
| Stav nejen barvou | Barevná změna nemusí být dostatečná. | Kombinovat barvu, tvar značky a krátký text „Minuto / Úspěch / Perfektní“. |
| Dílna jako pracovní stůl | Dekorace nesmějí zpomalit nákup. | Dominantní náhled modelu, vedle cena a konkrétní změna vlastnosti; jasný stav zamčeného modelu a nedostatku mincí. |
| Stručný výsledek | Dlouhé sčítání odměn prodlouží hru uměle. | Vzdálenost, odměna, rekord, milník a okamžitě dostupná další akce. |
| Funkční cyklus před prostředím | Rozumná priorita, která chrání rozsah. | Dokončit hratelnou smyčku s provizorní grafikou, potom jednu dotaženou úvodní scénu a teprve pak městský úsek. |

## 4. Návrh prvního modelu letu a ekonomiky

### Fyzika a architektura

Použít jednoduchý webový základ s Canvasem a JavaScriptem bez nutných runtime závislostí. Herní pravidla oddělit od vykreslování a vstupů: `core` pro fyziku a progresi, `content` pro laditelné parametry, `render` pro scénu, `ui` pro obrazovky, `simulation` pro dávkové pokusy. Konkrétní souborovou strukturu určit při implementaci.

- Stav letu obsahuje světovou pozici `x, y`, rychlost `vx, vy`, čas, model a aktuální událost.
- Simulace běží pevným krokem, například 1/60 s, nezávisle na snímkové frekvenci vykreslování.
- Na rychlost působí gravitace, odpor závislý na rychlosti a omezený vztlak modelu. Vztlak klesá při malé dopředné rychlosti, aby vlaštovka nemohla nekonečně viset.
- Šipka má větší počáteční rychlost a menší vztlak; kluzák menší rychlost a lepší poměr vztlaku k odporu. Přesné koeficienty určit měřením prvních letů.
- Síla hodu zvyšuje počáteční rychlost, papír snižuje odpor a přehyby zlepšují omezený vztlak. Každá větev má strop, aby se let nestal nekonečným.
- Události mění rychlost nebo dočasný stav letu. Vzdálenost se nikdy nepřičítá přímo jako odměna QTE.
- Dopad nastane při kontaktu se zemí. Dolet je rozdíl skutečné vodorovné světové pozice od místa vypuštění; kamera ani animace jej neurčují.
- Náhodné události používají seed. Kosmetické částice mají vlastní generátor, aby jejich počet neměnil herní výsledky.
- Při skrytí záložky pozastavit herní čas i QTE. Nenahrazovat dlouhou pauzu jedním velkým krokem fyziky.

### Výchozí ekonomika pro ladění

| Parametr | Pracovní návrh | Co ověřit |
|---|---|---|
| Odměna | `10 + floor(dolet_v_metrech / 10)` mincí | Dostatek na první nákup i bez QTE; žádný dvojí zápis odměny. |
| Větve | 3 společné větve, každá 5 úrovní | Zda jde o dost smysluplných rozhodnutí na 10–15 minut. |
| Ceny úrovní jedné větve | 10, 30, 55, 85, 120 mincí | Levné první nákupy mohou přijít rychleji než za dva pokusy; později sledovat cílové intervaly. |
| Nárůst účinku | Zpočátku přibližně 5–10 % příslušného parametru na úroveň | Nejde o stejný procentní nárůst doletu; účinky se kombinují nelineárně. |
| Odemčení kluzáku | Dosažení 100 m, bez dalšího poplatku | Slabý hráč jej získá včas a má čas vyzkoušet oba modely. |
| Milníky | 100, 250 a 500 m | Pocit postupu a dosažitelnost finále. Zpočátku bez bonusových mincí kvůli jednoduššímu ladění. |
| QTE za let | Obvykle 2–3, nikdy současně | Dostatek aktivity, ale bez převahy QTE nad konstrukcí. |

Ceny a fyziku ladit společně. Nelze předem tvrdit, že uvedené hodnoty zajistí 500 metrů za 10–15 minut. Pokud je slabý hráč blokovaný, nejdříve upravit základní dolet, výnos a ceny; nezvyšovat závislost na perfektních QTE.

## 5. Monte Carlo a ověření postupu

| Požadavek | Připomínka | Postup splnění |
|---|---|---|
| Stejná pravidla jako ve hře | Samostatný zjednodušený model by dal zavádějící výsledky. | Simulační skript volá stejný krok letu, nákupy, odměny a odemykání jako webová hra. |
| Opakovatelné seedy | Nestačí seedovat pouze rozmístění událostí. | Seedovat také rozhodování simulovaného hráče. Uložit seed, verzi pravidel a konfiguraci každého běhu. |
| Tři úrovně QTE | Je potřeba definovat i podíl perfektních zásahů. | Slabý: 25 % úspěšných zásahů, střední: 60 %, silný: 90 %. Z nich pracovně 10 / 25 / 50 % perfektních. Přidat kontrolní profil s 0 % úspěšnosti. |
| Strategie nákupů | Jedna optimální strategie nemusí reprezentovat reálné hráče. | Porovnat nejlevnější dostupný upgrade, vyvážené úrovně a přednost síly hodu. U každé přesně určit chování při nedostatku mincí a shodné ceně. |
| Volba modelů | Pouhé srovnání nákupů neodhalí dominanci modelu. | Porovnat setrvání u šipky, přechod na kluzák po odemčení a střídání. Navíc párové lety se stejnými upgrady a seedem. |
| Rozsah simulace | Velký počet běhů neopraví chybné předpoklady. | Začít kontrolními běhy, potom alespoň 1 000 průchodů na kombinaci profilu a strategie; reportovat přesný počet. |
| Metriky | Průměr skryje hráče, kteří uvíznou. | P10, medián a P90 doletu pro konkrétní konfigurace, pokusů do odemčení, intervalů nákupů a času do cíle. Přidat podíl nedokončení. |
| Čas v dílně a výsledku | Simulace nezná rychlost skutečného rozhodování. | Pracovně 8 s v dílně + 3 s na výsledku za cyklus, dalších 5 s při nákupu. Přičíst skutečnou délku simulovaného letu a nezapočítat animaci hodu dvakrát. |
| Citlivost časového odhadu | Jeden pevný čas UI by mohl vytvořit falešný dojem přesnosti. | Porovnat režii 6 / 11 / 20 s za cyklus, nákupní přirážku uvést odděleně. Po testování nahradit odhady měřením. |
| Slabí hráči a konec simulace | Nekonečný běh může skrýt zablokovanou ekonomiku. | Pracovní limit 100 pokusů; nedokončené běhy reportovat samostatně. Percentily dokončivších označit, neprezentovat je jako výsledek všech hráčů. |
| Ruční hraní | Statistiky nedokážou ověřit zábavu a čitelnost. | Zahrát celé průchody na desktopu i telefonu a sledovat chvíle nudy, pochopení nákupů a chyby načasování. |

Poměr přínosu QTE počítat jako `(dolet s QTE / dolet bez QTE − 1) × 100` u párovaných letů se stejnou konfigurací. Sleduje se hypotéza 20–40 %, nikoli automatické přepsání výsledku na požadované číslo.

## 6. Postup realizace podle šesti hlavních bodů zdrojového zadání

### 1 — Zhodnotit koncept a rizika

**Připomínka:** Zadání je obsahově dostatečné, ale míchá prototyp, plnou hru a dvě vizuální verze.

**Postup:** Použít sjednocení a tři rizika z tohoto dokumentu, stanovit hranice prototypu a evidovat chybějící screenshot.

**Splněno, když:** Existuje jedno platné zadání bez grafických rozporů a seznam věcí mimo první verzi. Analytická část je tímto dokumentem připravena.

### 2 — Vymezit rozsah, fyziku, odměny a ceny

**Připomínka:** Největší závislost je mezi délkou letu, výnosem a cenami; nelze je ladit odděleně.

**Postup:** Implementovat čisté herní jádro, dva modely, tři větve a konfigurovatelnou ekonomiku. Nejprve měřit lety bez QTE, následně přidat události.

**Splněno, když:** Dolet plyne z pohybu, oba modely bezpečně dopadnou, každý upgrade má ověřitelný efekt a seed reprodukuje stejný průběh.

### 3 — Vytvořit spustitelný prototyp

**Připomínka:** Ve složce není existující kód ani projektový základ.

**Postup:** Založit malou webovou hru s Canvasem, vstupy a provizorní scénou. Připravit spuštění přes lokální HTTP server a srozumitelný návod bez zbytečného sestavování projektu.

**Splněno, když:** Hru lze podle návodu otevřít a odstartovat let; obraz se přizpůsobí desktopu i telefonu.

### 4 — Dokončit celý cyklus

**Připomínka:** Nejprve musí fungovat postup, až potom rozšiřování prostředí.

**Postup:** Dílna → hod → automatický let → QTE → dopad → odměna; nákupy, odemčení kluzáku, rekord, milníky, konec prototypu a ukládání. Poté dotažená venkovská scéna a jednoduchý okraj města.

**Splněno, když:** Z nové hry se dá dojít k finále, koupit všechny typy vylepšení, použít oba modely a pokračovat po obnovení stránky.

### 5 — Ověřit funkce, vizuál a vyvážení

**Připomínka:** Automatická simulace a skutečně odehraná hra jsou odlišné druhy důkazů.

**Postup:** Provést funkční scénáře níže, vizuální kontroly a Monte Carlo. Upravit parametry podle výsledků a zopakovat dotčené kontroly.

**Splněno, když:** Existuje protokol s prostředím, verzí, kroky, očekávaným a skutečným výsledkem; nejsou známé chyby blokující dokončení. Neověřené oblasti jsou výslovně uvedeny.

### 6 — Předat návod a další priority

**Připomínka:** „Hotovo“ musí odkazovat na konkrétní funkce a ověření.

**Postup:** Sepsat návod ke spuštění a ovládání, seznam dokončených funkcí, omezení, výsledky testů a tři doporučené další změny.

**Splněno, když:** Jiný člověk spustí hru podle návodu a rozpozná, co je implementované, otestované a zatím pouze plánované.

## 7. Kontrolní scénáře pro implementaci

- Nová hra: první let bez zásahu, platná odměna, dostupné první vylepšení.
- Fyzika: stejný seed a vstupy dávají stejný výsledek; změna vykreslovací frekvence nemění dolet.
- Upgrady: kontrola každé větve před nákupem a po něm se stejnými podmínkami; limity úrovní a nemožnost záporného zůstatku.
- QTE: chyba, úspěch, perfektní zásah, žádný vstup, předčasný vstup a opakovaný vstup; myš, dotyk i mezerník.
- Cyklus: několik úplných letů, připsání odměny právě jednou, rychlý návrat do dílny.
- Odemčení: dosažení prahu zpřístupní kluzák a zachová jeho dostupnost po načtení.
- Ukládání: obnova po nákupu, po výsledku a během letu; poškozená nebo starší data a nedostupné úložiště nezpůsobí pád hry. Při nedostupném ukládání zobrazit informaci hráči.
- Reset: potvrzená nová hra odstraní postup; zrušení potvrzení ho zachová.
- Finále: překročení cíle vede k jasnému výsledku, možnost dalšího letu funguje.
- Vizuál: čitelná vlaštovka proti obloze, mrakům a zemi; jednotné pixely; viditelné rozdíly modelů; QTE nezakrývá let; kamera přejde plynule.
- Mobil: ovládací plocha dosažitelná palcem, ceny a diakritika čitelné, zachovaný poměr stran; změna velikosti a návrat ze skryté záložky nerozbije QTE.
- Balanc: dokončitelnost při slabých QTE, první nákup po prvním letu, smysluplné nákupy obvykle po 2–4 pokusech a žádná jasná dominance modelu ve všech důležitých metrikách.

**Aktuální stav ověření:** Provedeno pouze přečtení zdrojového zadání a kontrola dostupných souborů. Žádný herní ani simulační test dosud neproběhl.

## 8. Pořadí práce a hranice rozsahu

1. Sjednotit specifikaci podle tohoto rozboru; doplnění screenshotu není překážkou práce na logice.
2. Vytvořit deterministické jádro a měřit let bez grafiky.
3. Dokončit hratelný cyklus s provizorní scénou, QTE, ekonomikou a uložením.
4. Ověřit základní funkce a opravit blokující chyby.
5. Dotáhnout jednu pixelartovou úvodní scénu, kameru, dílnu a výsledky.
6. Přidat jednoduchý přechod na okraj města.
7. Spustit Monte Carlo, ruční průchody a upravit balanc.
8. Dokončit mobilní kontrolu, návod a protokol výsledků.

Do první verze nezařazovat simulaci přehýbání, dovednostní hod, ruční řízení, volný boost, další modely, raketu, vír, bouřky, vesmír, cloudové účty ani monetizaci. Voda zůstává volitelná.

Kalendářní termíny zatím nestanovovat: není známá kapacita vývoje a grafika nemá dostupnou referenci. Práci řídit uvedenými milníky; časový odhad zpřesnit po funkčním cyklu.

### Tři další změny po ověřeném prototypu

1. **Zpřesnit tempo podle skutečných hráčů:** upravit dobu letů, časy QTE a nákupní intervaly podle pozorování, nejen simulace.
2. **Rozšířit smysluplná rozhodnutí:** přidat jeden nový model nebo konstrukční doplněk s jasnou výhodou i nevýhodou; ověřit, že neznehodnotí původní modely.
3. **Přidat další krátký úsek s novou událostí a finále:** postupně prověřit delší oblouk hry, než se začne vyrábět obsah na celých 90–120 minut.
