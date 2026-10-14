# Review návrhů bonusů a vylepšení (karty D, B, DQ, SV, E)

**Založeno 13. 10. 2026.** Nezávislé kritické review karet v `01–05`. Karty jsem nepsal. Rozhodnutí uživatele v `06-rozhodnuti.md` mají přednost před vším v kartách, a podle nich je review i postavené.

**Podklady:** `CLAUDE.md`, `00-zadani.md`, `06-rozhodnuti.md`, všech pět souborů karet, `src/config.js`, `core.js`, `events.js`, `scenes.js`, `throw.js`, `storage.js`, část `ui.js` a rejstřík `research/kb/README.md` (P1–P15). Kód hry ani soubory v `simulation/` jsem neměnil ani nespouštěl.

**Metoda:**
1. Každou kartu jsem posoudil v pěti bodech zadání: zábava, soulad s `06`, zařazení, překryvy a rizika.
2. Zábavu hodnotím 1–5 podle toho, zda hráč změnu **ucítí a bude ji chtít dělat**, ne podle toho, zda je „optimální“. 1 = nuda nebo administrativa, 3 = užitečné, ale tiché, 5 = moment, o kterém hráč bude vyprávět. Pomlčka znamená nástroj pro Monte Carlo, který hráč nikdy neuvidí.
3. Levná tvrzení jsem ověřil vlastní sondou ve scratchpadu (import `src/`, pasivní let bez QTE, síla 0,75, nejlepší úhel podle `bestAngle`):

| Sonda | Výsledek | Souhlasí s kartami? |
|---|---|---|
| Šipka / kluzák, úrovně 0 | 177 m / 177 m, let 12,7 s / 20,1 s | ano (`01 §0`) |
| Šipka / kluzák, úrovně 3/3/3 | 377 m / 406 m, let 26 s / 45 s | ano |
| Šipka / kluzák, úrovně 5/5/5 | 587 m / 649 m, let 41 s / **72 s** | ano, délka letu je skutečný problém |
| Kluzák 5/5/5 + start o 20 m výš (Patro 5 / Římsa) | 865 m, let **99 s** | ano (`01 §0`: 92 s) |
| Šipka s `ideal` +10° | 177 → 237 m (+34 %) | ano (`02` tab. C), `ideal` nahoru opravdu nedávat |
| Nejlepší úhel šipky | 25° při `ideal` 18° | ano, šipka už dnes platí strmostní penalizaci |

Dále ověřeno v kódu: stisk v pruhu poryvu příliš brzy se dnes vyhodnotí jako minutí (`events.js`, `grade`), takže DQ-18 řeší skutečnou past. HUD už dnes po 500 m ukazuje hranici dalšího místa číslem (`ui.js`), SV03 tedy jen doplní název a větu. Déšť už dnes padá podle čtvrtí, nejvíc v docích (`atmosphereAt`, `rain=[0,.85,.15,.45]`), což je levný základ pro DQ-09.

**Počet karet:** v souborech je **100 karet** (D 18, B 22, DQ 18, SV 23, E 19), ne přes 110. Zbylé nadpisy jsou úvodní oddíly.

---

## 1. Verdikt na kartu

Zkratky v zařazení: **Dílna** = trvalé vylepšení základů. **Atlas-perm** = bonus, který odemkne dolet na místo a mince zvyšují jeho úroveň, platí pořád. **Atlas-slot** = speciální bonus do slotu (silný nebo s kompromisem). **jiné** = základ hry, událost, místo, UX, asistence, ekonomika, kosmetika. **MC** = jen nástroj pro Monte Carlo.

### 1.1 Dílna (D)

| ID | Název | Verdikt | Zařazení | Zábava | Proč |
|---|---|---|---|:-:|---|
| D01 | Náhled „s další úrovní doletíš sem“ | Upravit (hlavní karta náhledu, přebírá E10, D16, náhled z B02) | jiné (UX Dílny a Atlasu) | 3 | Dobrá čitelnost volby, ale ukázat jedno číslo a hranici místa, ne další panel. |
| D02 | Rozpis zásluhy ve výsledku | Sloučit s DQ-16 | jiné (výsledek) | 2 | Třetí verze téhož rozpisu, ponechat jednu. |
| D03 | Vyvážení (odpuštění síly) | Ponechat | Dílna | 2 | Tichá pomoc, ale levně opraví past „přehyby napřed“ (46 proti 28 hodům). |
| D04 | Křidélka (okna a účinek QTE) | Upravit (rozšíření viditelné na kruhu, společný strop oken s asistencemi) | Dílna | 3 | Hráč rozdíl uvidí na zelené výseči, to je dobré; bez stropu se okna nasčítají. |
| D05 | Vyšší patro (výškový start) | Ponechat (přebírá B08) | Atlas-perm (odemknout na Tržnici / střechách) | 4 | Vidět ve scéně při každém hodu a synergie „výška × papír“ je čitelná. Hlídat délku letu (sonda 99 s). |
| D06 | Aerodynamika nosu (odpor) | Vyřadit | – | 1 | Karta sama přiznává slabou páku, hráč nic necítí. |
| D07 | Výbava modelu (špička, křídla) | Vyřadit (překryv s B03/B04) | – | 2 | Další „+8 %“, rozmělňuje mince a vrací se k oddělenému stromu, který 0.6 zrušila. |
| D08 | Nový model Sokol | Upravit (jediný nový model v první vlně) | jiné (model odemčený v Atlasu) | 4 | Nový model je skutečně „jiný let“ a odměna za místo. Překrývá se s B06, jedno z nich stačí jako „bonus pro šikovné“. |
| D09 | Nový model Albatros | Vyřadit (zatím) | – | 2 | Lety 90–100 s a nízký podíl dovednosti, tedy přesně to, co nechceme zesilovat. |
| D10 | Stabilizátor proti větru | Vyřadit | – | 1 | „Méně špatně“ není zábava. Jen obrana proti problému, který zavádí jiná karta. |
| D11 | Nový model Střela | Vyřadit (vrátit, až bude vítr a ověřený Sokol) | – | 3 | Zajímavý plochý hod, ale bez větru nemá roli. |
| D12 | Mistrovské efekty na 5. úrovni | Upravit (Švih přesunout do DQ-04, zbytek jako kvalitativní „korunka“ 5. úrovně) | Dílna | 4 | Dobrý lék na „jen větší číslo“: vrchol větve mění chování, ne jen procenta. |
| D13 | Cenové křivky podle role větve | Ponechat jako nástroj (přebírá E18) | MC | – | Nutné pro ladění, hráč nevidí. |
| D14 | Přestavba vlaštovky (vrácení mincí) | Upravit (stačí vrácení poslední úrovně) | Dílna | 3 | Pojistka proti lítosti. Po rozdělení přehybů je méně potřeba a plné vrácení láká k přeskládávání před každým hodem. |
| D15 | Mistrovské úrovně 6–7 | Vyřadit | – | 2 | Hlavní zdroj inflace síly. Růst po 500 m má nést Atlas, ne další procenta v Dílně. |
| D16 | Diagnóza z posledních hodů | Sloučit s D01 | jiné | 3 | Dobrá myšlenka „víc ti dá úhel než koupě“, ale jako jedna věta v náhledu, ne vlastní systém. |
| D17 | Zkušební hod s další úrovní | Upravit (jen pro slotové bonusy, přebírá zkoušku z B02) | Atlas-slot (UX) | 4 | Zkusit si něco nového v ruce je zábava. U úrovně Dílny (+12 %) je zkouška zbytečná, u slotu s kompromisem dává smysl. |
| D18 | Kapitolový strop úrovní | Sloučit s E06 | Dílna | 2 | Stejná myšlenka jako E06, E06 je jednodušší. |

### 1.2 Sloty a výbava (B)

| ID | Název | Verdikt | Zařazení | Zábava | Proč |
|---|---|---|---|:-:|---|
| B01 | Stránka Bonusy: tři sloty | Upravit (zásadně) | Atlas-slot | 3 | **Odporuje `06`:** sloty otvírá po metrech (100 / 305 / 500 m). Podle `06` je 1. slot za mince a sloty jsou jen pro pár speciálních bonusů. |
| B02 | Karta bonusu: náhled a zkouška | Sloučit (náhled do D01, zkouška do D17) | jiné | 3 | Užitečné, ale duplicitní. |
| B03 | Zátěž ve špičce | Sloučit s B04 | Atlas-slot | 2 | Samostatně +3–8 % a kluzáku škodí. Jako jedna strana páru „těžký / lehký papír“ ujde. |
| B04 | Hedvábný papír | Upravit (jeden slotový předmět „Papír na míru“: těžký / lehký) | Atlas-slot | 3 | Změna dráhy je vidět, ale efekt +5–9 % je na hraně toho, co hráč cítí. Prodlužuje let. |
| B05 | Ocasní ploška (širší okna) | Sloučit s DQ-13 | jiné (asistence) | 2 | Pomoc slabšímu hráči patří do asistencí zdarma, ne do slotu, který si kupuje. |
| B06 | Ostrá hrana (užší okna, silnější zásah) | Ponechat | Atlas-slot | 4 | Skutečný kompromis „risk za odměnu“, který dobrý hráč ucítí. Strop počtu událostí kvůli pozdní dominanci (+25 %). |
| B07 | Pružinový katapult (pevná síla) | Upravit (jen jako asistence bez slotu) | jiné (asistence) | 2 | Bere hráči jedinou dovednost hodu. Jako slotový bonus je smutná volba „vzdej se“. |
| B08 | Římsa (výš, ale strop síly) | Sloučit s D05 | Atlas-perm | 3 | Stejná páka jako Patro. Dvě výšky startu jsou zbytečné. |
| B09 | Expresní hrot (kratší let) | Vyřadit | – | 2 | Prodává řešení problému (dlouhé lety), který má hra opravit zdarma pro všechny. |
| B10 | Lamely (jen kluzák) | Vyřadit | – | 2 | Malý efekt, snižuje podíl dovednosti, překrývá se s Albatrosem. |
| B11 | Klidný let / Rušná obloha | Upravit (jeden slotový „styl letu“) | Atlas-slot | 3 | Mění rytmus letu, což hráč cítí víc než procenta. Rozhodnout, zda stačí jedna varianta. |
| B12 | Vábnička (víc holubů / poryvů) | Vyřadit | – | 1 | ±2 %, karta sama čeká vyřazení. |
| B13 | Pokladnička (mince místo metrů) | Vyřadit | – | 1 | Administrativa: obětovat let pro mince. Mince se stávají cílem, ne prostředkem. |
| B14 | Kategorie a viditelné synergie | Vyřadit | – | 2 | S 3–5 slotovými bonusy nejsou kategorie potřeba. Synergii stačí ukázat v náhledu. |
| B15 | Sestavy a volba při míření | Vyřadit | – | 1 | Pro 1–2 sloty zbytečné a míření zahltí. |
| B16 | Ohlášený cíl | Vyřadit (`06`) | – | 2 | Vyřazeno uživatelem. |
| B17 | Rezervní arch (zrušení hodu) | Upravit (globální funkce zdarma, nebo tlačítko „přeskočit let“) | jiné (UX) | 3 | Řeší skutečnou frustraci, ale jako jednorázový náboj ve slotu je to účetnictví. |
| B18 | Plachetka (citlivost na vítr) | Vyřadit (vrátit jako slot, pokud bude vítr) | Atlas-slot (podmíněně) | 3 | „Fouká do zad, beru plachetku“ je hezké, ale celé stojí na větru. |
| B19 | Dopis v kapse (zakázka zabírá slot) | Vyřadit | – | 1 | Pravidlo navíc, které slot jen blokuje. |
| B20 | Katalog a odemykání bonusů | Upravit (přepsat na mapu „místo → bonus“) | Atlas | 2 | **Odporuje `06`:** odemyká za mince, volbou zdarma a za metry. Podle `06` odemyká místo, mince jen zvyšují úroveň. |
| B21 | Rozpis bonusů ve výsledku | Sloučit s DQ-16 | jiné | 3 | Jedna řádka v hlavním rozpisu. |
| B22 | Matice výhodnosti | Ponechat jako nástroj | MC | – | Dobré kritérium proti dominanci pro Monte Carlo. |

### 1.3 Dovednost a QTE (DQ)

| ID | Název | Verdikt | Zařazení | Zábava | Proč |
|---|---|---|---|:-:|---|
| DQ-01 | Plující střed okna | Ponechat | jiné (základ letu) | 4 | Opravuje známý problém (QTE jdou odměřit naslepo) a „Perfektní“ zase něco znamená. Náběh je rozumný. |
| DQ-02 | Ladička (tik, předznamenání, odchylka) | Upravit (odchylka „pozdě o 0,07 s“ a tik zdarma pro všechny) | jiné (UX, zvuk) | 3 | Zpětná vazba o odchylce nemá být za mince. Hra zatím nemá zvuk. |
| DQ-03 | Řetěz (kombo v jednom letu) | Ponechat | Atlas-perm (nebo základ) | 5 | Dá dlouhému letu oblouk a napětí, hráč to cítí hned. Úrovně mohou zvedat strop řetězu. |
| DQ-04 | Perfektní vypuštění (Švih) | Upravit (zóna ±80–100 ms místo ±60, přebírá Švih z D12) | jiné (základ hodu) | 4 | Dá hodu mistrovství. ±60 ms je na hraně latence telefonů. |
| DQ-05 | Druhý nádech (přetažené nabití) | Upravit (až po ověření Švihu) | Atlas-slot | 3 | Pěkné riziko v ruce, ale těžko se vysvětluje a hrozí, že bude buď zbytečný, nebo povinný. |
| DQ-06 | Termika (nová událost) | Ponechat (přebírá SV08) | Atlas-perm (událost) | 4 | Nový typ vstupu a viditelný sloup ve scéně. Pozor: držení je podobné holubovi. |
| DQ-07 | Reklamní dron (odraz) | Ponechat | Atlas-perm (událost) | 4 | Srozumitelné „odraz se od něčeho“ a humor. Náročnost L. |
| DQ-08 | Parní dvojtakt u vlaku | Ponechat | Atlas-perm (událost, Železnice) | 4 | Událost vázaná na místo je ideální odměna Atlasu. Dvě klepnutí musí pokrýt asistence. |
| DQ-09 | Bouřkový pilot | Upravit (déšť jako vlastnost doků, ne volitelná výzva) | jiné (místo) | 3 | Volitelná výzva podle `06` nestačí. Déšť v docích už ve hře padá, ať tedy i něco dělá. |
| DQ-10 | Vítr a korouhvička | Ponechat (rozhodne uživatel), korouhvička zdarma | jiné (základ) | 4 | Nejlevnější cesta k různým hodům. Úhel přestane být jednou naučenou hodnotou. |
| DQ-11 | Střemhlav a vybrání | Ponechat (pozdější vlna, L) | Atlas-slot | 5 | Jediná karta, která dá hráči řízení letu a „wow“ nízký průlet. Otázka pro uživatele (jedno tlačítko). |
| DQ-12 | Přízemní polštář | Ponechat | Atlas-perm | 4 | Konec letu přestane být pasivní: „záchrana na poslední chvíli“ před hranicí místa. |
| DQ-13 | Pohodlné časování (asistence) | Ponechat (přebírá B05) | jiné (asistence) | 3 | Správně zdarma, bez slotu a bez trestu. |
| DQ-14 | Automatické QTE a holub klepnutím | Ponechat (přebírá asistenční část B07) | jiné (asistence) | 3 | Přístupnost, bez dopadu na balanc pro ostatní. |
| DQ-15 | Kalibrace prstu | Ponechat (až s DQ-01 a DQ-04) | jiné | 2 | Nutná pro férovost úzkých oken, sama nebaví. |
| DQ-16 | Rozpis zásluhy | Upravit (hlavní karta rozpisu, přebírá D02, B21, SV20; jedna řádka, detail na klepnutí) | jiné (výsledek) | 3 | „Bylo to mnou?“ je dobrá otázka, ale tři verze rozpisu musí být jedna. |
| DQ-17 | Pilotní zkoušky (odemykání za dovednost) | Vyřadit | – | 2 | **Odporuje `06`:** odemykat má dolet na místo. Nápady na zkoušky se hodí do SV13. |
| DQ-18 | Odpuštění předčasného stisku | Ponechat | jiné (základ) | 3 | Odstraní skutečnou past (ověřeno v `events.js`), hráč ji nepozná, jen přestane být naštvaný. |

### 1.4 Svět, cíle a sbírky (SV)

| ID | Název | Verdikt | Zařazení | Zábava | Proč |
|---|---|---|---|:-:|---|
| SV01 | Atlas 16 míst (pohlednice) | Upravit (= stránka Bonusy z `06`: pohlednice + bonus místa + jeho úroveň) | Atlas | 4 | Přesně odpovídá `06`, jen chybí bonusy. Přebírá E05, SV19, SV23. |
| SV02 | Nálezné za objev místa | Ponechat (přebírá E03) | jiné (ekonomika) | 3 | Mince za nové místo jsou pochopitelné. Nižší částka než E03, protože místo už dává bonus. |
| SV03 | Nejbližší místo jako cíl (teaser) | Ponechat | jiné | 4 | Levné, vtipné, vyvolá zvědavost. Číslo v HUD už existuje, chybí název a věta. |
| SV04 | Kapitoly po čtvrtích | Ponechat (přebírá E08, E14, E17) | jiné | 3 | Dobrý konec po 500 m a rovnocenné „pokračovat / pro dnešek stačí“. |
| SV05 | Poštovní štafeta (startovní schránky) | Ponechat | jiné (páteř Atlasu) | 4 | **Bez ní Atlas nefunguje**: z Dílny i s plným stromem doletí hráč jen do 4.–5. místa. Otázka pro uživatele. |
| SV22 | Schránka za poštovné | Vyřadit | – | 1 | Další spotřeba mincí, která soupeří s úrovněmi bonusů. Placení za checkpoint nebaví. |
| SV07 | Přístavní vítr v docích | Upravit (část DQ-10, místní vítr) | jiné (místo) | 3 | Malý stálý vítr hráč skoro necítí. Musí být vidět a výrazný. |
| SV08 | Termika nad Větrným hřebenem | Sloučit s DQ-06 | Atlas-perm | 4 | Stejný jev. Hřeben je dobré místo, kde se termika poprvé objeví. |
| SV09 | Odraz na mostě | Ponechat | jiné (místo) | 5 | Překvapení a druhá šance. Nejlepší „wow“ za nejmenší cenu. |
| SV10 | Padavý vítr v Horském sedle | Upravit (mírněji, s nápovědou úhlu) | jiné (místo) | 3 | Dobrá hádanka místa, ale hrozí zeď pro slabšího hráče. |
| SV11 | Známky ve vzduchu | Upravit (velký dosah, nebo jen se Střemhlavem) | jiné (sbírka) | 2 | Bez řízení letu je trefit bod o poloměru 3 m loterie úhlu, tedy grind. |
| SV12 | Ztracené dopisy (příběh) | Upravit (dopis za dosažení místa, ne za přesný průlet) | jiné (příběh) | 4 | Příběh dává trase emoce a důvod dojít na konec. Sbírání přes přesný průlet by ho zamklo. |
| SV06 | Poštovní zakázky (přistání v okně) | Upravit (přebírá E13, konečný seznam s postavami) | jiné (cíl) | 3 | Přesné přistání je jiná dovednost (jako golf). Pozor: pozdě trvá pokus 60–90 s. |
| SV13 | Výzvy místa | Upravit (přebírá E12, nechat 3–4 vázané na zábavné vlastnosti míst) | jiné | 3 | Podle `06` jen ty, které baví samy (odraz na mostě, tři sloupy termiky), ne „bez pomoci 305 m“. |
| SV23 | Poštovní pas | Vyřadit | – | 2 | Překryv s Atlasem. |
| SV14 | Šuplík s papíry (vzory) | Ponechat (přebírá E19) | kosmetika | 3 | Vztah k vlastní vlaštovce. Náklad: každý vzor ve 4 stylech. |
| SV15 | Barevná stopa čtvrti | Ponechat | kosmetika | 3 | Levná trofej, kterou hráč nese v každém hodu. |
| SV16 | Razítka na křídle | Vyřadit | – | 2 | Stojí na zakázkách a výzvách, které se zmenšují. Vzory (SV14) stačí. |
| SV17 | Postavy z dekorací | Ponechat | jiné (obsah) | 4 | Humor a jména dělají ze světa místo, kam se chce hráč vracet. |
| SV18 | Texty událostí podle čtvrti | Ponechat | jiné (obsah) | 4 | Velmi levné a přímo řeší „stejné texty a málo humoru“. |
| SV19 | Dalekohled v Observatoři | Ponechat (část Atlasu) | jiné | 3 | Hezký moment „vidím cíl“, levný. |
| SV20 | Kronika letu ve výsledku | Sloučit s DQ-16 | jiné | 3 | Pás proletěných míst ano, ale v jednom výsledku s rozpisem. |
| SV21 | Zpáteční pošta (noční okruh) | Vyřadit (odložit na dobu po dokončení trasy) | – | 3 | Obsah po konci, který zatím neexistuje. L. |

### 1.5 Ekonomika a meta (E)

| ID | Název | Verdikt | Zařazení | Zábava | Proč |
|---|---|---|---|:-:|---|
| E01 | Účtenka hodu a startovné | Upravit (přebírá E02 a E04; startovné neměnit) | jiné (ekonomika) | 2 | Snížit startovné z 10 na 5 s minimem 20 hráč nepochopí. Stačí přidat 1–2 čitelné řádky. |
| E02 | Rekordní prémie | Sloučit s E01 | jiné | 3 | Rekord už sám těší. Malá prémie ok, ale jen jako řádek účtenky. |
| E03 | Objevné za nové místo | Sloučit s SV02 | jiné | 3 | Duplikát. Místo už odemyká bonus, dvojí velká odměna by zrychlila strom. |
| E04 | Prémie za perfektní zásah | Sloučit s E01 (jen spolu s DQ-01) | jiné | 3 | Bez plujícího středu odměňuje odměřování naslepo. |
| E05 | Atlas razítek | Sloučit s SV01 (bez prahů pro sloty) | Atlas | 2 | **Odporuje `06`:** sloty otvírá razítky. Podle `06` je 1. slot za mince. |
| E06 | Kapitolová Dílna (úrovně 4–5 po 500 m) | Ponechat (přebírá D18) | Dílna | 3 | Jednoduché, opraví „strom 3 165 při potřebě úrovně 3“ a dá po 500 m hned další krok. |
| E07 | Aerodynamika (kratší lety) | Vyřadit (nahradit zrychlením zdarma) | – | 2 | Karta sama říká, že s tlačítkem zrychlení zdarma ztrácí smysl. Platit za kratší čekání nebaví. |
| E08 | Etapy trasy s poměrovým rytmem | Sloučit s SV04 | jiné | 3 | Stejné kapitoly. |
| E09 | Cíl nákupu („chybí 53 ◈“) | Ponechat (jednoduše) | jiné (UX) | 2 | Užitečné, ale tiché. Bez odhadu počtu hodů je to správně. |
| E10 | Předpověď přehráním posledního hodu | Sloučit s D01 | jiné | 3 | Konkrétnější výpočet než D01, sloučit do jednoho náhledu. |
| E11 | Konstruktér (režim s rozpočtem) | Vyřadit | – | 2 | Volitelný režim, který podle vlastního zjištění vyhrává vždy kluzák. Spíš úloha než zábava. |
| E12 | Výzvy s omezením | Sloučit s SV13 | jiné | 2 | „Skromná vlaštovka“ nebo „přesně 495–505 m“ jsou checklist. Ponechat jen zábavné. |
| E13 | Zakázky (doruč do zóny) | Sloučit s SV06 | jiné | 3 | Nekonečný seznam podle E13 je horší než konečný s postavami. |
| E14 | Konec kapitoly a pohlednice | Sloučit s SV04 | jiné | 3 | Rovnocenná tlačítka a pohlednice převzít, pohlednice = karta v Atlasu. |
| E15 | Započítaný pokrok (poctivý náskok) | Ponechat (malé) | jiné | 2 | Neviditelné, ale levné. 10 ◈ na startu urychlí první nákup. |
| E16 | Nový arch papíru (prestiž) | Vyřadit | – | 1 | Reset působí jako ztráta a do krátké hry se nehodí. Hráč ho nebude dělat rád. |
| E17 | Deník kampaně (skóre efektivity) | Sloučit s SV04 (souhrn kapitoly) | jiné | 2 | Bez prestiže nemá druhý běh, „Rorýs za 21 hodů“ je jen řádek souhrnu. |
| E18 | Alternativní cenové křivky | Sloučit s D13 | MC | – | Stejné téma. |
| E19 | Vzory a stopy za mince | Sloučit s SV14 | kosmetika | 2 | Kosmetika za objevy je hodnotnější než za mince. Pár kousků za mince jako přiznaný konec mincí. |

### 1.6 Souhrn verdiktů

| Verdikt | Počet | Karty |
|---|---:|---|
| Ponechat | 30 | D03, D05, D13, B06, B22, DQ-01, DQ-03, DQ-06, DQ-07, DQ-08, DQ-10, DQ-11, DQ-12, DQ-13, DQ-14, DQ-15, DQ-18, SV02, SV03, SV04, SV05, SV09, SV14, SV15, SV17, SV18, SV19, E06, E09, E15 |
| Upravit | 25 | D01, D04, D08, D12, D14, D17, B01, B04, B07, B11, B17, B20, DQ-02, DQ-04, DQ-05, DQ-09, DQ-16, SV01, SV06, SV07, SV10, SV11, SV12, SV13, E01 |
| Sloučit | 22 | D02, D16, D18, B02, B03, B05, B08, B21, SV08, SV20, E02, E03, E04, E05, E08, E10, E12, E13, E14, E17, E18, E19 |
| Vyřadit | 23 | D06, D07, D09, D10, D11, D15, B09, B10, B12, B13, B14, B15, B16, B18, B19, DQ-17, SV16, SV21, SV22, SV23, E07, E11, E16 |
| **Celkem** | **100** | |

Podle zařazení (jen ponechané a upravené): **Dílna 5** (D03, D04, D12, D14, E06; ceny D13 jako nástroj), **Atlas-perm 6** (D05, DQ-03, DQ-06 se SV08, DQ-07, DQ-08, DQ-12), **Atlas-slot 5 bonusů** (B04, B06, B11, DQ-05, DQ-11; k tomu systém slotů B01 a zkouška D17). Zbytek je základ hry, místa, UX, asistence, ekonomika a kosmetika.

---|---:|---|
| Ponechat | 33 | D03, D05, D13, B06, B22, DQ-01, DQ-03, DQ-06, DQ-07, DQ-08, DQ-10, DQ-11, DQ-12, DQ-13, DQ-14, DQ-15, DQ-18, SV02, SV03, SV04, SV05, SV09, SV14, SV15, SV17, SV18, SV19, E06, E09, E15 a hlavní karty skupin D01→viz Upravit |
| Upravit | 25 | D01, D04, D08, D12, D14, D17, B01, B04, B07, B11, B17, B20, DQ-02, DQ-04, DQ-05, DQ-09, DQ-16, SV01, SV07, SV10, SV11, SV12, SV06, SV13, E01 |
| Sloučit | 23 | D02, D16, D18, B02, B03, B05, B08, B21, SV08, SV20, E02, E03, E04, E05, E08, E10, E12, E13, E14, E17, E18, E19 a D07→viz Vyřadit |
| Vyřadit | 22 | D06, D07, D09, D10, D11, D15, B09, B10, B12, B13, B14, B15, B16, B18, B19, DQ-17, SV22, SV23, SV16, SV21, E07, E11, E16 |

*Přesný součet: Ponechat 30, Upravit 25, Sloučit 22, Vyřadit 23 = 100.* (Řádek „Ponechat“ výše omylem vyjmenovává i poznámku; platí čísla v této větě.)

---

## 2. Sloučené skupiny duplicit

| # | Téma | Ponechat | Sloučit do ní | Poznámka |
|---:|---|---|---|---|
| 1 | Náhled přínosu před koupí | **D01** | E10 (výpočet přehráním), D16 (jedna věta diagnózy), B02 (náhled) | Jeden náhled pro Dílnu i Atlas: „+31 m → přes hranici Tržnice“. |
| 2 | Zkouška nanečisto | **D17** | B02 (zkouška) | Jen pro slotové bonusy. |
| 3 | Rozpis výsledku „ty / vlaštovka / události“ | **DQ-16** | D02, B21, SV20, zobrazení účtenky z E01 | Jedna řádka, detail na klepnutí. Výsledek má dnes už i nápovědu úhlu. |
| 4 | Dílna po kapitolách | **E06** | D18 | D15 (úrovně 6–7) vyřazeno. |
| 5 | Cenové křivky | **D13** | E18 | Jen pro Monte Carlo. |
| 6 | Atlas jako stránka Bonusy | **SV01** | E05, SV23, SV19, mapování z B20 | Razítka nepotřebujeme jako druhou měnu, místo je samo „razítkem“. |
| 7 | Kapitoly a konec kapitoly | **SV04** | E08, E14, E17 | Rovnocenná tlačítka, pohlednice, souhrn. |
| 8 | Mince za objev místa | **SV02** | E03 | Nižší částka (20 + 5·i). |
| 9 | Odměny za výkon | **E01** | E02, E04 | Bez snížení startovného. E04 jen s DQ-01. |
| 10 | Zakázky | **SV06** | E13 | B19 vyřazeno. |
| 11 | Výzvy | **SV13** | E12 | DQ-17 a E11 vyřazeny. Jen 3–4 zábavné. |
| 12 | Kosmetika | **SV14** | E19 | SV16 vyřazeno, SV15 zůstává zvlášť. |
| 13 | Vyšší start | **D05** | B08 | Jedna výška startu. |
| 14 | Vítr | **DQ-10** | SV07, SV10 (místní varianty) | D10 a B18 vyřazeny, D11 odložena. |
| 15 | Termika | **DQ-06** | SV08 | Poprvé se objeví na Větrném hřebeni. |
| 16 | Asistence | **DQ-13, DQ-14** | B05, B07 (asistenční pevná síla) | Asistence vždy zdarma a bez slotu. |
| 17 | Švih (perfektní vypuštění) | **DQ-04** | Švih z D12 | D12 si nechá jen korunky Papíru (a Patra). |
| 18 | Papír s kompromisem | **B04** | B03, D07 | Jeden slotový předmět „těžký / lehký papír“. |
| 19 | Dlouhé lety | zrychlení klouzání zdarma (nová věc, ne karta) | E07, B09 | Obě karty vyřadit, problém řešit pro všechny. |
| 20 | Pasivní plachtění bez dovednosti | – | D09, B10 | Obě vyřadit. |

Dva překryvy nechávám vědomě: **Sokol (D08) a Ostrá hrana (B06)** odměňují stejného hráče (šikovného v událostech). Pro první vlnu stačí jedno z nich. **Křidélka (D04) a Ostrá hrana (B06)** sahají na stejná okna z opačných stran. Okna mají mít jeden společný strop pro Dílnu, sloty i asistence.

---

## 3. Nejsilnější nápady

1. **Poštovní štafeta (SV05).** Bez ní je Atlas prázdný (viz 4.1). Mění 4,9 km na řadu blízkých kroků a nevyžaduje nafouknutá čísla.
2. **Atlas trasy (SV01) s pohlednicemi.** Přesně to, co uživatel chce. Místo je zároveň trofej, odemčení a příběh.
3. **Řetěz (DQ-03).** Nejlepší poměr zábavy a náročnosti. Dlouhý let dostane napětí a každý další zásah něco znamená.
4. **Odraz na mostě (SV09).** Překvapení, druhá šance a vlastní malý cíl. Malá práce.
5. **Teaser nejbližšího místa (SV03).** Zvědavost je podle KB (P3) nejsilnější motor dobrovolného hraní. Číslo v HUD už je, stačí věta.
6. **Plující střed QTE (DQ-01) + odpuštění předčasného stisku (DQ-18).** Opravuje dva skutečné problémy událostí, bez nových tlačítek.
7. **Přízemní polštář (DQ-12).** Konec letu se stane momentem dovednosti („doklouzal jsem do Zahrad o 4 m“). Ideální Atlas-perm.
8. **Vyšší patro (D05).** Hráč vidí, že startuje výš, a chápe „výška × papír“ bez čísel.
9. **Události vázané na místa (DQ-08 pára, DQ-06 termika, DQ-07 dron).** Nejlepší obsah pro Atlas: místo neodemkne „+5 %“, ale nový zážitek.
10. **Střemhlav a vybrání (DQ-11).** Jediné skutečné řízení letu a „wow“ nízký průlet. Drahé, ale z celé sady má nejvyšší strop zábavy.
11. **Švih (DQ-04) + korunky 5. úrovně (D12).** Odměna za kvalitu hodu a vrchol větve, který mění chování místo procent.
12. **Rozdělení přehybů na Vyvážení a Křidélka (D03 + D04).** Levná oprava pasti 46 proti 28 hodům, Dílna zůstane srozumitelná.
13. **Postavy a texty podle čtvrti (SV17 + SV18).** Humor a svět za velmi málo práce.
14. **Příběh ztracených dopisů (SV12, upravený).** Důvod dojít na konec trasy, který není číslo.
15. **Ostrá hrana (B06).** Vzor toho, jak má vypadat slotový bonus: kompromis, který hráč ucítí v ruce.
16. **Vítr (DQ-10).** Nejlevnější cesta k tomu, aby žádné dva hody nebyly stejné. Závisí na rozhodnutí uživatele.

---

## 4. Systémové problémy celého návrhu

### 4.1 Atlas stojí na místech, kam hráč nedoletí
Z Dílny doletí plně vylepšená vlaštovka pasivně 587 m (šipka) a 649 m (kluzák). S událostmi podle `05 §0.1` asi 1,1–1,4 km, tedy do 4.–5. místa ze 16. Pokud místo odemyká bonus (`06`), Atlas bez další změny odemkne jen **4–5 bonusů**. Možnosti jsou tři: štafeta (SV05), obrovský růst síly (rozbije čísla i délku letu), nebo Atlas jen s 5–6 místy. To je **nejdůležitější otevřené rozhodnutí** a ostatní karty o něm mlčí nebo předpokládají různé odpovědi.

### 4.2 Inflace síly v pozdní hře
Karty se testovaly jednotlivě, ale efekty se **násobí**: síla × papír × výška startu × účinek QTE (Křidélka) × řetěz (až +42 %) × slotový bonus (až +25 %) × korunky 5. úrovně. Pozdní kluzák s Ostrou hranou, Hedvábím a Patrem je podle karet samotných o +30 % a víc nad plánem. Výsledek: čísla ztratí smysl a hráč přestane rozlišovat, co mu co dalo. Doporučení:
- Dílnu ukončit na úrovni 5 (E06), žádné 6–7.
- Atlas-perm bonusy mají být hlavně **kvalitativní** (nová událost, nová schopnost, nová vlastnost místa) a jen málo procentní.
- Se štafetou je „vzdálenost od startu“ omezená sama, takže inflace nerozbije cíle. Bez štafety rozbije.
- Monte Carlo musí měřit **kombinace**, ne karty zvlášť (`B22` kritérium 4 je dobrý začátek).

### 4.3 Délka letu
Ověřeno: kluzák s plnou Dílnou letí 72 s bez událostí, s Patrem 99 s. Lety přes minutu jsou nuda a zároveň zdražují každý pokus o zakázku nebo výzvu. Tři karty to řeší placeně (E07, B09) nebo vůbec (D09). Řešení patří do základu hry zdarma: zrychlit klouzání po vrcholu, když nic neběží, nebo tlačítko přetočení. Bez toho je každá karta, která zvyšuje klouzavost nebo výšku, past.

### 4.4 Toho je moc
- 100 karet, 20 skupin duplicit, nejméně 7 nových zdrojů mincí (nálezné, objevné, rekord, perfekt, zakázky, výzvy, Konstruktér) a 6 nových způsobů, jak mince utratit (úrovně Atlasu, sloty, schránky, kosmetika, aerodynamika, Konstruktér). Navrhuji **jeden** hlavní způsob utrácení (Dílna, úrovně Atlasu, nákup slotu) a kosmetiku hlavně za objevy.
- Sbírek je šest (místa, známky, dopisy, razítka, pas, výzvy). To je přesně „checklist“, před kterým KB varuje (`08 N8`) a který `06` nechce. Atlas míst a dopisy stačí.
- Výsledková obrazovka by měla: rozpis, účtenku, kroniku, teaser, nápovědu úhlu, diagnózu, cíl nákupu a odchylku QTE. Na mobilu se to nevejde. Maximálně 3 řádky, zbytek na klepnutí.

### 4.5 Soubor 02 je postavený na jiném modelu, než zvolil uživatel
`02` počítá se 3 sloty po metrech, výměnou kdykoli, sestavami a katalogem 12–14 slotových bonusů. Podle `06` jsou sloty jen pro pár speciálních. Ze 22 karet B tak zbývají 3–4 slotové bonusy (B04, B06, B11, případně DQ-05 a DQ-11). Kategorie (B14), sestavy (B15) a matice pro 14 bonusů jsou pro tak malý katalog zbytečné.

### 4.6 Jedno tlačítko
DQ-05 (držet přes vrchol), DQ-06 (držet v termice), DQ-08 (dvě klepnutí), DQ-11 (držet = střemhlav), DQ-12 (klepnout u země) a dnešní holub (držet) používají stejné tlačítko. Každé zvlášť je čisté, dohromady je to šest významů stisku. Potřebné pravidlo: „probíhá-li událost, tlačítko patří jí, jinak schopnosti“. A nové schopnosti zavádět po jedné s krátkou ukázkou. Termika a holub se plést budou (obojí držení).

### 4.7 Hodně karet je „optimální“, ne zábavných
Náhledy, diagnózy, matice, cenové křivky, cíl nákupu, poctivý náskok a kalibrace jsou užitečné nástroje, ale nejsou obsah. Při počítání „co hra nabídne“ je nezapočítávat. Skutečně nového obsahu (události, místa, schopnosti, příběh) je v sadě asi 15 karet.

### 4.8 Čísla v kartách nejsou srovnatelná
Každý soubor si postavil vlastní bota (`04` optimistický: 12 hodů do 500 m, `05`: 21, Monte Carlo: 23). Hypotézy jsou proto jen orientační a jejich součty neplatí. Monte Carlo musí běžet nad užším výběrem jedním simulátorem, jak `06` počítá.

### 4.9 Kluzák dominuje
`05` (E11) zjistil, že v každém rozpočtu vyhrává kluzák. Většina karet (Patro, Hedvábí, termika, Albatros) mu ještě pomáhá. Šipka potřebuje vlastní důvod existence, jinak je volba modelu zdánlivá.

---

## 5. Mezery (co v návrzích chybí)

- **Zvuk a hudba.** Podle KB (P11) pravděpodobně největší mezera ve feelu. Žádná karta ho neřeší, jen ho dvě karty potřebují.
- **Překvapení bez odměny.** Vzácné vtipné momenty ve scéně (kočka na střeše, která vlaštovku sleduje, UFO nad observatoří), které nic nedávají, jen pobaví. Dnes je všechno buď odměna, nebo kulisa.
- **Humor v neúspěchu.** Co se stane, když vlaštovka spadne: přistání do louže, na hlavu chodce, do koše. Pád je nejčastější okamžik hry a je teď nejnudnější.
- **Vztah k vlaštovce.** Jméno, stopy opotřebení (zmačkaný roh po nárazu, razítko z místa), vlaštovka jako postava. Vzory papíru jsou jen začátek.
- **„Wow“ momenty na hranicích čtvrtí.** Oddálení kamery, změna hudby, první pohled na moře. Přechod do nové čtvrti je dnes jen štítek.
- **Variabilita hodů.** Kromě větru nic. Denní doba, počasí, start z různých schránek a různé události podle místa by dělaly každý hod jiný.
- **Důvod vrátit se zítra** bez sérií a denních odměn: třeba nová věta postavy nebo pohlednice, která čeká. Zatím ho řeší jen kapitoly.
- **Konec hry.** Co přesně se stane ve Střešním přístavu (titulky, poslední dopis, „Dílna je tvoje“) a co pak (volné létání bez cílů pro odpočinek).
- **Učení nových věcí.** Jak Atlas představí nový bonus nebo událost hráči v letu (první setkání, jedna věta). Karty to zmiňují jen u termiky.
- **Mistrovství po dokončení.** Pro hráče, který vše má: styl, přesnost nebo vlastní rekordy na úsecích, ne další metry.

---

## 6. Otázky pro uživatele

1. **Jak se hráč dostane na vzdálená místa?** Trasa má 16 míst, ale i plně vylepšená vlaštovka z Dílny doletí jen asi na 5. místo (kolem 1,2 km). Když místo odemyká bonus, odemkne se jich jen pět.
   - *A: poštovní schránky.* Když doletíš do Zahrad, můžeš příště házet ze Zahrad. Podobně jako uložená pozice ve hře.
   - *B: vlaštovka zesílí tak, aby doletěla 5 km z Dílny.* Čísla budou obrovská a let potrvá několik minut.
   - *C: Atlas bude mít jen 5–6 míst* a zbytek trasy zůstane kulisou.

2. **Smí hra dlouhé lety zrychlit, a to zadarmo?** Dobře vylepšený kluzák dnes letí přes minutu (s vyšším startem skoro 100 s), většinou jen klouže. Například: po vrcholu, když se nic neděje, poběží let 2× rychleji, nebo bude tlačítko „přetočit“. Nebo mají dlouhé lety zůstat klidné?

3. **Má každý hod trochu jiný vítr?** Před hodem by byla vidět šipka větru (např. „slabě do zad“) a hráč by podle ní upravil úhel. Hod by tak nebyl pořád stejný. Nevýhoda: rekord může trochu pomoct štěstí (hra by ale ukázala, kolik metrů dal vítr).

4. **Smí vlaštovka za letu dělat něco i mimo poryvy a holuby?** Například podržením tlačítka se vlaštovka střemhlav ponoří a po puštění se nízko nad zemí zvedne a zrychlí. Nebo klepnutím těsně nad zemí ještě kus doklouže. Hra by byla aktivnější, ale tlačítko by mělo víc významů. Nebo má let zůstat „sleduj a reaguj na události“?

5. **Kolik má rozhodovat šikovnost?** Několik nápadů dělá z událostí víc dovednosti: kruh u poryvu by pokaždé dosedal trochu jinam, takže by nešel naučit nazpaměť, a série zásahů za sebou by let posilovala. Šikovný hráč by pak létal výrazně dál než ten, kdo jen kliká. Chceš to, nebo má hra zůstat hlavně pohodová?

6. **Chceš ve hře příběh a věci k sesbírání?** Například: po trase jsou čtyři ztracené dopisy paní Vlasty, která kdysi vedla dílnu. Postupně odhalí, že vlaštovka, kterou házíš, je její poslední nedoručený dopis. Nebo stačí Atlas míst s vtipnými větami a postavami (robot Šroubek, jeřábnice Máňa)?
