# Just Throw It — první hratelný prototyp

Česká lokální webová hra bez instalačních závislostí. Implementace podle `Plan realizace.md` a fyzikálního kontraktu v KB. Pracovní grafika, pravidla 0.1.0.

## Spuštění

V této složce spusť s nainstalovaným Node.js:

```powershell
npm start
```

Otevři http://127.0.0.1:4173. Server ukončíš Ctrl+C. HTML neotvírej přímo přes file:// — hra používá ES moduly. Server naslouchá pouze na tomto počítači.

## Hraní

Vyber model a stiskni **Hodit vlaštovku**. Let je automatický. Při poryvu nebo setkání s holubem klepni na **Zasáhnout** nebo použij mezerník: zelená zóna znamená úspěch, světlý střed perfektní zásah. Předčasný vstup spotřebuje jediný pokus, nečinnost nemá trest. Po dopadu dostaneš mince. V dílně vyber uzel talentového stromu a potvrď samostatným tlačítkem Koupit. Kluzák se odemkne při 100 m, finále při 500 m. Po finále lze pokračovat.

Postup se ukládá v prohlížeči po nákupu, změně modelu a dopadu. Opuštěný let se neodměňuje. Skrytá záložka pozastaví čas. Tlačítko Smazat postup vyžaduje potvrzení. Všechna tlačítka jsou dostupná klávesnicí; Tab přepíná fokus, Enter aktivuje.

## Struktura

- `src/config.js`: verzované arkádové parametry, ceny a modely.
- `src/core.js`: deterministický let, síly, QTE, nákupy a jednorázové odměny.
- `src/storage.js`: validace lokálního postupu a ošetření nedostupného úložiště.
- `src/render.js`: pracovní Canvas 640 × 360, krajina a modely.
- `src/ui.js`: dílna, pevný krok 1/60 s, vstupy a obrazovky.
- `simulation/run.mjs`: průchody používající totožné jádro.
- `tests/core.test.js`: automatické kontroly.

## Ověření

```powershell
npm test
npm run simulate
```

Dávka používá 100 seedů × 4 QTE profily × 3 nákupní × 3 modelové strategie = 3 600 průchodů. Výstupy jsou `simulation/REPORT.md` a `simulation/initial-results.json`. Jiný počet seedů: `node simulation/run.mjs 1000`. Pozor: přepíše předchozí report. Aktuální první dávka není závěrečná analýza etapy 6.

Fyzika používá herní metry, sekundy, kg a N; osa Y vzhůru. Gravitační zrychlení 1,8 m/s² i účinné plochy jsou arkádové hodnoty, nikoli kalibrace skutečného papíru. Integrátor explicitního středu má kontrolovanou relativní odchylku doletu pod 0,1 % mezi krokem 1/60 a 1/120 s u testovaných jednotlivých větví. Pasivní energie při kontrolách základního a maximálního stavu nesmí růst o více než 10⁻⁶ J za krok. Při dopadu se interpoluje poloha, rychlost i čas k zemi. Energie se uměle neořezává.

## Stav a další práce

Implementované jsou základy etap 0–4 a počáteční dávka 4a. Checklist původního plánu není plošně označen za dokončený: ne všechny přijímací podmínky jsou ověřené.

- Cíl je dosažitelný i bez QTE. V první dávce nejsou nedokončené průchody.
- **Balanc ještě neodpovídá cíli 10–15 minut.** Mediány podle strategie a QTE vycházejí přibližně 1,9–9,4 minuty s odhadovanou režií UI. QTE příliš urychlují postup; jejich přínos je nutné naladit párovými lety.
- Počáteční let trvá asi 8 s; některé naplánované události se před dopadem nestihnou. Dalším krokem je upravit rozvržení QTE a tempo bez vynuceného prodlužování čekání.
- Grafika je pracovní. Kamera zatím přímo sleduje model, chybí dotažená animace hodu, finální assety a orientační odměna v HUD.
- Responzivní CSS je připravené; skutečný telefon, dotykové časování, úplné hráčské průchody a zábavnost zatím nejsou ověřené.
- Plná analýza 1 000 seedů na kombinaci, citlivost na režii UI, párové přínosy QTE a srovnání ekonomické výhodnosti modelů zbývají.

Priorita další iterace: naladit QTE a tempo; ověřit mobil a ukládání v hraničních situacích; teprve potom dokončovat grafiku.

## Změna 0.2 — dovednostní hod a výsledkové okno

Nový požadavek uživatele nahrazuje původní rozhodnutí o automatickém hodu. Každý pokus nyní začíná mířením (5–40°) a podržením myši, dotyku nebo mezerníku. Síla cyklicky roste a klesá, první vrchol je po 1,15 s. Puštění nastaví rychlost v rozsahu 70–110 % rychlosti konstrukce. Šipky nebo posuvník mění úhel. Ztráta fokusu, skrytí záložky a zrušený dotyk nabíjení zruší bez hodu.

Po dopadu se otevře modální výsledkové okno inspirované dodaným screenshotem: postup k 500 m, vzdálenost, čas, síla a úhel hodu, zvládnuté události, rekord, rozpis mincí a celková odměna. Znovu vrací rovnou na míření; Vylepšení otevře talentový strom; Dílna vrací hlavní výběr. Escape zavře výsledek do dílny. Neimplementované odrazy ani fiktivní násobič skóre se nezobrazují.

Tři nepřekrývající se letové události nově začínají přibližně v 0,8 / 3,15 / 5,5 s (se seedovaným posunem); krátký slabý hod nemusí stihnout všechny. První dávka balancu v REPORT.md patří k verzi 0.1 a po této změně není aktuálním důkazem tempa. Dávkový skript zatím používá standardní hod, nikoli profily dovednosti při vypuštění.

## Změna 0.3 — jednotlivé modely a Neon District (12. 10. 2026)

Každý model má nyní vlastní Sílu hodu, Kvalitu papíru a Přehyby a vyvážení. Peněženka, rekord a odemčení zůstávají společné. Uložení verze 2 obsahuje úrovně pod `levels.dart` a `levels.glider`. Starší uložení verze 1 se migruje zkopírováním dosavadních společných úrovní do obou modelů, bez odebrání mincí nebo nákupů. Následné nákupy jsou nezávislé.

Samostatná stránka `bonus.html` je přístupná navigací Bonus tree. Zatím neobsahuje bonusy ani nákupy; jejich návrh čeká na další zadání uživatele. Hra má vlastní procedurální pixelovou scénu nočního města, neonovou paletu a upravené panely. Nový směr nahrazuje původní venkovskou atmosféru.

Testy zahrnují oddělené nákupy, zachování po načtení a migraci staršího uložení. Starý report balancu 0.1 se nevztahuje na nový postup; simulátor již používá oddělené úrovně vybraných modelů. Dovednostní hod a výsledkové okno z verze 0.2 zůstávají součástí hry.

## Pozadí — čtyři čtvrti

Připraveno 12 vlastních lokálních SVG pixelových vrstev v `assets/backgrounds`: fialové předměstí, měsíční doky, rudý horizont a neonové jádro. Každá má oblohu, vzdálené panorama a bližší budovy. Žádné cizí obrázky ani externí požadavky. Generátor: `node scripts/build-backgrounds.mjs`.

`src/backgrounds.js` načítá assety jednou, opakuje vrstvy a posouvá je podle kamery rychlostí 0,035 / 0,19 / 0,48. Popředí hry se posouvá rychleji. Po 180 m následuje další čtvrť, posledních 45 m úseku se obrazy prolínají. Po čtvrté čtvrti se prostředí cyklicky vrací. Název lokality je v HUD pod scénou. Náhled všech čtvrtí: `/background-preview.html`. Herní fyzika a ekonomika se nemění.

## Dynamické scény a dlouhé lety (0.4)

Neonový styl a čtyři lokality zůstávají zachované. Úsek má 180 m, posledních 60 m používá hladkou křivku smoothstep. Všechny vrstvy mají společnou souřadnici kamery a různé rychlosti; při výměně lokality se jejich posun neresetuje. Obloha se neposouvá s výškou a nezanechává prázdný pruh. Základní pravidla a délky jsou v `src/scenes.js`.

První tři QTE zůstávají úvodem hry. Další se generují při překročení vzdálenostní brány (násobky 180 m), nejdříve 1,5 s po konci předchozího okna. Při přeskočení více bran vzniká pouze jedna výzva. Střídá se poryv a pomoc holuba, ovládání zůstává stejné. Zásahy mohou změnit dolet i ekonomický balanc; starší simulační reporty tento režim nehodnotí.

`src/atmosphere.js` kreslí opakující se hejna, déšť podle lokality, vzdušné stopy podle rychlosti a značky aktivních QTE. Vizuální události neovlivňují fyziku. Používají čas letu, takže při skrytí záložky i po dopadu stojí. Počet kreslených prvků je omezený a nezávisí na vzdálenosti.

`background-preview.html` nabízí animovaný náhled, posuvník 0–10 000 m, tři rychlosti a pauzu. Automatické testy ověřují kontinuitu přechodů až do 18 km, směr a opakování vrstev a opakované QTE včetně přeskočených bran a přistání. Hra nadále končí fyzickým dopadem; náhled umožňuje kontrolovat dlouhé vzdálenosti bez vylepšení modelu.

## Souvislá cesta (0.5)

Nahrazuje střídání celoplošných městských bitmap z 0.4. Každý biom nyní obsahuje čtyři fyzické úseky o šířce 640 světových pixelů (cca 305 m), tedy celkem cca 1 219 m. Cesta má 16 míst: dílna → tržnice → zahrady → železnice; skladiště → jeřáby → most → maják; pole → elektrárny → horské sedlo → observatoř; brána města → terasy → vysílač → střešní přístav. Po cca 4 876 m začíná další okruh trasy.

Definice pořadí, popisů a měřítka je v `src/scenes.js`. `src/route-render.js` vykresluje deterministické úseky ve světových souřadnicích: vzdálený horizont má pomalejší paralaxu, dominanty a povrch ubíhají rychlostí kamery. Sousední úseky mohou být současně viditelné; žádný landmark se na hranici obrazovky nevymění. U konce biomu se mění pouze osvětlení oblohy, další krajina přichází zprava. Generují se pouze viditelné úseky, nikoli obří textura celé trasy.

Hra ukazuje aktuální místo, pořadí 1/4–4/4 a krátký příběhový popis. Náhled navíc umožňuje přejít na kterékoli ze 16 míst a ukazuje postup biomem. Fyzika, ceny a podmínka fyzického dopadu zůstávají stejné; délka trasy není zárukou, že ji základní model dokončí jedním hodem.

## Verze 0.4 — živé město a dvě QTE

Implementovaný schválený plán: hlavní akcí zůstává hod, následují nejvýše 6 časovaných příležitostí. První začíná v 1,5 s; další dvě 3 s po skončení předchozího výsledku/účinku; pozdější mají seedovaný rozestup 10–14 s. Starší neomezený plánovač podle vzdálenosti byl nahrazen. Trasa a její 16 úseků zůstávají zachované.

Ventilace používá klepnutí/mezerník. Kyberholub vyžaduje stisk a puštění (úspěch 0,55–0,95 s, perfektní 0,69–0,81 s). Varování trvá 0,8 s. Předčasný vstup spotřebuje pokus; chyba a nečinnost nezmění fyziku. Výsledek přerušený dopadem se nepočítá jako chyba. Opakovaný vstup a druhý prst jsou ignorovány. Skrytí záložky pozastaví čas; rozdržený vstup se zruší bez bonusu.

Osm dekorací má samostatný seedovaný plánovač podle čtvrti: reklama, robot s krabicí, nákladní vznášedlo, reflektor, vlak, pára, reklamní dron a hologram. Dekorace nezačínají během QTE a nevstupují do fyziky. Vykreslování dekorací vynechává ochrannou oblast 80 × 50 pixelů kolem vlaštovky. Při `prefers-reduced-motion` jsou vypnuté dekorace a částice, zachované nezbytné časování QTE.

HUD ukazuje průběžnou odměnu, zvýrazňuje změnu čtvrti a postupně zobrazuje milníky mimo QTE. Výsledky zobrazují úspěšné / dokončené příležitosti a ★ počet perfektních. Během letu je úvodní text skrytý a ovládání je přímo pod plátnem.

Ověření: `npm test` — 18 unit testů. `node simulation/qte-balance.mjs` — 18 000 párových porovnání, viz `simulation/QTE-BALANCE.md`. Souhrnný medián přínosu obou QTE 20,25 %. Nejde o záruku pro každou konfiguraci: nastavení holuba na svislou rychlost +0,4 m/s může u některých stoupajících konstrukcí dolet zkrátit; záporné percentily jsou v reportu zachované. Parametry z plánu nebyly kvůli tomu potichu změněny.

Prohlížeč: ověřený běh hry a aktivace letových událostí; na 360 × 780 a 390 × 844 px bez horizontálního přetečení, tlačítko QTE 48 px, panel viditelný pod scénou. Opraveno resetování odměny a bannerů při návratu do dílny. Fyzický telefon a uživatelské hodnocení srozumitelnosti nebyly provedeny.

## Verze 0.6 — arkádový let, sdílená vylepšení, shovívavé QTE (13. 10. 2026)

- **Let:** místo aerodynamiky (vztlak/odpor) jednoduchý arkádový model. Balistické stoupání, pak klouzání, při kterém klesání nepřekročí rychlost / klouzavost. Každý model má ideální úhel; strmější hod ho přibrzdí, takže úhel je skutečné rozhodnutí (šipka ~25°, kluzák ~35°).
- **Vylepšení mění jednu čitelnou věc:** síla = rychlost výhozu (+12 %/úr.), papír = klouzavost (+20 %/úr.), přehyby = odpouští nepřesnou sílu (+10 % chybějící síly/úr.) a rozšiřují okna událostí (+10 %/úr.).
- **Sdílený strom:** vylepšení platí pro obě vlaštovky. Starší uložení se převede, z každé větve se ponechá vyšší úroveň (save verze 3).
- **Modely:** šipka (rychlá, nejvíc jí dá síla), kluzák (pomalejší, dlouhé klouzání, nejvíc mu dá papír a z poryvů a holubů získá o 15 % víc).
- **QTE:** širší okna (poryv ±0,28 s, perfektní ±0,10 s; holub 0,50–1,00 s, perfektní 0,65–0,85 s), stisk během varování se ignoruje, mezery mezi událostmi 4–7 s (max. 10 událostí). Časovací kruh se kreslí přímo u vlaštovky a klepnout lze kamkoli do scény.
- `PORT=4174 npm start` spustí server na jiném portu.
