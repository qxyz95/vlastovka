# Just Throw It — realizační checklist

Revize podle internetové rešerše z 11. 10. 2026. Výzkumný základ, zdroje a omezení: [KB vlaštovky](<KB vlastovky.md>). Označení K1–K7 odkazují na poznatky v KB, H1–H3 na naše herní a technická rozhodnutí. Při rozporu s původním rozborem platí tento aktualizovaný plán a KB.

**Stav k 11. 10. 2026:** Vytvořen první hratelný prototyp 0.1.0: jádro, dílna, talentový strom, QTE, výsledky a lokální ukládání. Proběhly automatické kontroly jádra a počáteční dávka 3 600 průchodů; viz [README](README.md) a [protokol](simulation/REPORT.md). Tempo zatím neodpovídá cíli, grafika je pracovní a skutečný telefon ani hráčské průchody nejsou ověřené. Nezaškrtnuté body níže zůstávají původním přijímacím checklistem, nikoli tvrzením o absenci implementace. „Dokončeno“ u etap označuje podmínku přijetí.

## Cíl a výchozí rozhodnutí

Vytvořit český webový prototyp s automatickým letem, dvěma modely vlaštovky, třemi větvemi vylepšení a dvěma QTE. Cílová délka postupu je 10–15 minut.

Použít JavaScript, Canvas 640 × 360 a lokální ukládání. Herní jádro sdílet mezi prohlížečem a dávkovou simulací. Pracovní cíl 500 m a ekonomické hodnoty převzít z podkladu; upravovat je podle měření.

Jde o fyzikou inspirovanou arkádu. Cíl 500 m, délka postupu, ceny, úrovně upgradů i účinky QTE jsou herní návrhy, nikoli výsledky aerodynamického výzkumu (KB H1).

## Pořadí realizace

### 0. KB a fyzikální kontrakt

- [ ] Před implementací převzít kontrakt z KB H2: světové x doprava, y vzhůru, zem y = 0; herní metry, sekundy, m/s, kg a N. Převod na pixely patří pouze do renderu.
- [ ] Oddělit ověřené vztahy od efektivních koeficientů a arkádových parametrů; laděné hodnoty zapisovat s verzí pravidel (KB K1–K7, H1).
- [ ] Definovat interní stav polohy, rychlosti vůči zemi, odvozené vzdušné rychlosti a režimu běžný let / nesení; konfiguraci modelu, větru a vnějších impulsů (KB K2–K3, H2).
- [ ] Měřit dolet rozdílem světových x souřadnic při vypuštění a dopadu, nezávisle na kameře. Veřejné API nevytvářet (herní rozhodnutí H2).

**Dokončeno:** Herní jádro a dávková simulace mohou používat stejná pravidla, jednotky a konfiguraci bez odlišných interpretací.

### 1. Základ projektu a simulace letu

- [ ] Připravit spustitelný webový základ a návod ke spuštění přes lokální HTTP server.
- [ ] Oddělit herní pravidla, konfiguraci, vykreslování, rozhraní a dávkovou simulaci.
- [ ] Implementovat pevný krok 1/60 s, seedovanou náhodnost, pohyb a dopad.
- [ ] Počítat síly z `v_air = v_ground − v_wind`: vztlak kolmo na vzdušnou rychlost, odpor proti ní a tíhu dolů. Při nulové rychlosti přeskočit normalizaci a nastavit aerodynamické síly na nulu (KB K1–K3).
- [ ] Použít efektivní koeficienty stabilně seřízených modelů bez plné rotační dynamiky, deformací a CFD; základní prostředí má nulový vítr (herní zjednodušení H2).
- [ ] Přidat šipku a kluzák s rozdílnou rychlostí, odporem a vztlakem.
- [ ] Zavést tři větve vylepšení s pěti úrovněmi.
- [ ] Síla hodu mění pouze počáteční rychlost; kvalita papíru stylizovaně snižuje ztráty při zachování hmotnosti; přehyby a vyvážení zlepšují efektivní klouzavost v omezeném rozsahu. Netvrdit, že těžší papír vždy letí dál (KB K1, K5–K6; herní mapování H2).

**Dokončeno:** Oba modely bezpečně dopadnou, stejný seed a vstupy reprodukují let a každá větev prokazatelně ovlivňuje příslušnou vlastnost.

### 2. Hratelný cyklus s pracovní grafikou

- [ ] Implementovat dílnu → hod → automatický let → výsledek → dílnu.
- [ ] Přidat výběr modelu, nákupy a vysvětlení jejich účinků.
- [ ] Nákup upgradů v dílně prezentovat jako talentový strom: propojené uzly s ikonami, cenami a postupným odemykáním. Požadavek uživatele z 11. 10. 2026; přiložený screenshot slouží jako reference principu a přehlednosti stromu.
- [ ] Pro prototyp zobrazit tři stávající větve — Síla hodu, Kvalita papíru, Přehyby a vyvážení — každou jako pět navazujících uzlů. Další uzel vyžaduje předchozí zakoupenou úroveň ve stejné větvi; mezi větvemi může hráč volně vybírat. Zachovat společné upgrady pro oba modely a stávající ceny.
- [ ] Odlišit zakoupené, dostupné a zamčené uzly i nedostatek mincí. Výběr uzlu zobrazí český název, konkrétní účinek, cenu a podmínku odemčení; samostatné tlačítko „Koupit“ provede nákup. Detail musí fungovat klepnutím i klávesnicí, nejen najetím myši.
- [ ] Připsat odměnu právě jednou: výchozí hodnota `10 + floor(dolet / 10)`.
- [ ] Použít výchozí ceny úrovní `10, 30, 55, 85, 120` mincí.
- [ ] Odemknout kluzák při 100 m; zobrazovat milníky 100, 250 a 500 m.
- [ ] Po dosažení cíle a dopadu zobrazit finále a umožnit další hraní.

**Dokončeno:** Hráč zvládne opakované pokusy, po prvním letu bez QTE koupí první upgrade a může postupovat až k finále.

### 3. Události a ovládání

- [ ] Přidat větrný poryv a krátké nesení holubem jako změny simulovaného pohybu.
- [ ] Poryv aplikovat jednou jako omezený impuls, bez současného druhého účinku fyzikálního větru. Nesení má vlastní rychlost a konečnou dobu; po vypuštění navazuje běžný let. Obě události označit v dokumentaci jako arkádovou vnější pomoc (KB K3, H1–H2).
- [ ] Naplánovat obvykle 2–3 nepřekrývající se události za let.
- [ ] Přidat varování a výsledky chyba, úspěch a perfektní zásah.
- [ ] Sjednotit dotyk, myš a mezerník na jednu akci; povolit nejvýše jeden pokus na událost.
- [ ] Při chybě nebo nečinnosti pokračovat bez bonusu.
- [ ] Pozastavit simulaci i QTE při skrytí záložky.

**Dokončeno:** Události skutečně mění trajektorii, nepřičítají vzdálenost přímo a opakované vstupy nezpůsobují vícenásobný bonus.

### 4. Ukládání a spolehlivost

- [ ] Ukládat verzi dat, mince, upgrady, odemčené a vybraný model, rekord a dokončení.
- [ ] Ukládat po nákupech a vyhodnocení letu.
- [ ] Po obnovení během letu vrátit hráče do dílny bez odměny za opuštěný pokus.
- [ ] Ošetřit poškozená, nepodporovaná a nedostupná uložená data bez pádu hry.
- [ ] Oddělit návrat do dílny od potvrzovaného smazání postupu.

**Dokončeno:** Obnovení stránky zachovává platný postup, neduplikuje odměny a při nedostupném ukládání informuje hráče.

### 4a. První kontrola fyziky a balancu před finální grafikou

- [ ] Se stejným jádrem provést menší dávku simulovaných průchodů: 100 seedů na každý QTE profil 0/25/60/90 % pro každou kombinaci tří nákupních a tří modelových strategií. Jde o pracovní rozsah kontroly, nikoli závěrečný důkaz vyvážení (herní rozhodnutí H3).
- [ ] Prověřit délku letů, první nákup bez QTE, účinky všech úrovní upgradů a dosažitelnost cíle. Uvést nedokončené běhy a použít limit 100 pokusů (KB K4, H3).
- [ ] Opravit blokující chyby fyziky a ekonomiky a zopakovat dotčené kontroly před dokončením vizuálu. Plnou Monte Carlo analýzu ponechat v etapě 6.

**Dokončeno:** Existuje protokol počáteční kontroly s konfigurací a seedy; modely bezpečně dopadají a žádná zjištěná chyba neblokuje postup. Odhad tempa je oddělený od dosud neověřené zábavnosti.

### 5. Vizuál a mobilní rozhraní

**Vstupní podmínka:** Dokončit kontrolu 4a před tvorbou finální grafiky. Podobu modelů opřít o KB K7; použít vlastní siluety a assety.

- [ ] Vytvořit soudržnou pixelartovou sadu pro venkovský start, postavu, oba modely a události.
- [ ] Přidat plynulou kameru, paralaxu a jednoduchý přechod na okraj města.
- [ ] Dokončit dílnu, stručné výsledky a HUD s doletem, rekordem a orientační odměnou.
- [ ] Talentový strom zasadit do vlastní pixelartové dílny s vlastními ikonami a českými popisy. Použít běžný princip propojených uzlů podle dodané reference; konkrétní rozložení přizpůsobit našim třem větvím. Na mobilu zachovat čitelné ceny, dosažitelné uzly a detail vybraného upgradu.
- [ ] Ověřit českou diakritiku, kontrast vlaštovky a rozlišení výsledků QTE také textem nebo symbolem.
- [ ] Zachovat poměr stran, vypnout vyhlazování a přizpůsobit dotykové plochy telefonu.

**Dokončeno:** Hra je čitelná a ovladatelná na desktopu i skutečném telefonu. Shodu s chybějící referencí neoznačovat za ověřenou.

### 6. Vyvážení a předání

- [ ] Spustit Monte Carlo nad stejnými pravidly jako ve hře.
- [ ] Porovnat QTE profily 0/25/60/90 %, tři nákupní strategie a tři strategie volby modelu z podkladu.
- [ ] Pro každou kombinaci provést alespoň 1 000 průchodů s limitem 100 pokusů.
- [ ] Reportovat P10, medián, P90, podíl nedokončení, intervaly nákupů a čas do cíle; oddělit simulovaný let od odhadované režie UI.
- [ ] Profil 0 % úspěšnosti QTE reportovat samostatně. Výdělek za minutu počítat za celý cyklus včetně hodu, letu, dílny, výsledku a nákupů; animace nezapočítávat dvakrát (herní metriky KB H3).
- [ ] Párovými lety změřit přínos QTE a rozdíly mezi modely.
- [ ] Odehrát celé průchody na desktopu a telefonu; doladit tempo, ceny a čitelnost.
- [ ] Předat návod, výsledky kontrol, známá omezení a doporučené další kroky.

**Dokončeno:** Nejsou známé chyby blokující dohrání. Výsledky dokládají dosažitelnost cíle i pro slabý QTE profil; odchylky od cílových 10–15 minut jsou výslovně uvedeny.

## Povinné ověření

Fyzikální kontroly, balanc a hráčské hodnocení vést jako tři odlišné druhy důkazů (KB H3).

- [ ] Determinismus a nezávislost doletu na vykreslovací frekvenci.
- [ ] Správný směr sil, nulová vzdušná rychlost bez NaN a chování při protivětru i větru po směru letu za stejné počáteční rychlosti vůči zemi (KB K2–K3).
- [ ] V klidném vzduchu bez QTE kontrolovat energii `E = 0,5 × m × |v_ground|² + m × g × y`; simulace nesmí soustavně vytvářet energii. Porovnat numerický drift a dolet při krocích 1/60 a 1/120 s a uvést toleranci použitého integrátoru (KB K1–K2, H3).
- [ ] Bezpečný dopad obou modelů bez vnější pomoci a konečné trvání nesení; nepřipustit nekonečné visení (KB K1, H2).
- [ ] Účinek každého upgradu, stropy úrovní a zákaz nákupu bez peněz.
- [ ] Talentový strom: správné návaznosti uzlů, volba mezi větvemi, jednorázový nákup a odečet ceny, zobrazení účinku a důvodu zamčení, obnova zakoupených uzlů po načtení a ovládání dotykem i klávesnicí.
- [ ] Ověřit každou úroveň všech tří větví u obou modelů a mezní kombinace; nekontrolovat pouze základní a maximální stav (herní ověření H3).
- [ ] Všechny výsledky QTE včetně předčasného, opakovaného a chybějícího vstupu.
- [ ] Jednorázová odměna, odemčení modelu a finále.
- [ ] Obnova po nákupu, výsledku a během letu; poškozené úložiště a reset.
- [ ] Změna velikosti obrazovky, skrytí záložky a dotykové ovládání.
- [ ] Smysluplnost obou modelů podle doletu, délky pokusu a výdělku za minutu.

## Hranice a předpoklady

Nezařazovat ruční řízení, volný boost, simulaci přehýbání, další modely, raketu, vír, vesmír, účty ani monetizaci. Vodu odložit. Chybějící screenshot neblokuje funkční prototyp.

Reference talentového stromu byla dodána 11. 10. 2026. Poznámky o chybějící referenci se nadále vztahují k původnímu screenshotu prostředí hry, nikoli k nově dodané referenci nákupů.

Nezařazovat plnou rotační dynamiku, deformace papíru ani CFD. Rešerše není důkazem funkčnosti budoucí implementace. Obecné vztahy z KB nepoužívat jako tvrzení o přesných výkonech skutečných vlaštovek.

Etapy plnit v uvedeném pořadí. Kalendářní termíny stanovit až po změření práce na prvním funkčním cyklu. Simulační výsledky nenahrazují ověření zábavnosti skutečnými hráči.

## Aktualizace požadavku — 0.2

Uživatel následně změnil začátek kola na hlavní dovednostní událost „zamiř, podrž, pusť“. Toto má přednost před staršími body vylučujícími dovednostní hod. Implementované míření a načasování ovlivňuje počáteční úhel a rychlost. Po dopadu se zobrazuje modální výsledková tabulka podle dodané reference a volby Znovu / Vylepšení / Dílna. Detaily ovládání a omezení jsou v README, sekce 0.2.

## Aktualizace požadavku — 0.3 (12. 10. 2026)

Nová priorita: samostatná vylepšení každé vlaštovky, později samostatná stránka bonusového stromu. Konkrétní bonusy doplní uživatel v další zprávě. Vizuální směr se mění na cyberpunk pixel art. Toto nahrazuje dřívější požadavek společných upgradů a venkovské scény. Implementace a migrace uložení jsou popsané v README 0.3.

## Implementace letové obrazovky 0.4

Schválený plán „živé cyberpunkové město“ je implementovaný: časový plánovač s limitem šesti QTE, dva vstupy (klepnutí a držení/puštění), oddělené dekorace osmi typů, mobilní HUD a statistiky událostí. Podrobnosti, testy a známá omezení jsou v README 0.4 a simulation/QTE-BALANCE.md. Předchozí popis neomezených událostí podle vzdálenosti již neplatí.
