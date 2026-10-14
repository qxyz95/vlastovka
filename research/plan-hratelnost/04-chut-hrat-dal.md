# Chuť hrát dál: „ještě jeden hod“ podle výzkumu, bez temných vzorců (kreativní ředitel)

**15. 10. 2026.** Zadání uživatele: hra má táhnout ke hraní („ještě jeden hod“, „ještě kousek dál“, chuť se vrátit), a to z vnitřní motivace, ne přes FOMO, denní odměny, grind nebo čekání. Doplněno: **návrh musí stát na vědeckých poznatcích z KB (`research/kb/01–09`), ne na zjednodušeném popisu.** Navazuje na `00-kreativni-smer.md` a `01-game-design.md`. Rozhodnutí 06 z 15. 10. (vystřihovánkové město, novinka skoro v každém hodu, QTE podle síly letu, Spropitné, 4 vlaštovky, nález jiným dítětem na konci, kousky odložené, ~90 min) jsou daná; kde jim výzkum odporuje, je to v §8 jako `BLOCKED`.

**Konvence.** Opora ve tvaru `01 §2.1` nebo `08 [10]` (blok KB, oddíl nebo registr), nové zdroje `D1–D6` (§9). Štítky **V** výzkum · **H** heuristika oboru · **N** naše hypotéza. U N vždy „jak ověřit“ (měření podle `09 §2.10, §2.12, §4.1`). Cena **S** do půl dne, **M** 1–2 dny, **L** 3+ dní. Čísla nechávám game designerovi a balance-analyst. **Nic se nehrálo ani neměřilo: všechny odhady jsou NOT ASSESSED.**

---

## 0. Co říká výzkum (na co optimalizujeme a proč)

**Tři různé věci, které se nesmí plést** (KB je rozlišuje výslovně):
1. **Hlášená zábava (enjoyment).** Spolehlivě ji předpovídá kompetence a autonomie [V, `01 §1` bod 1, `01 [1][3]`]. Na chování se ale přenáší slabě: uspokojení potřeb jen slabě souvisí s délkou sezení a dobou do návratu [V, `01 [8]` Ballou 2026, preprint A−], v Animal Crossing r = 0,07 [V/sek., `01 [9]`].
2. **Dobrovolné pokračování v sezení (engagement).** Ve velkém preregistrovaném experimentu byla **zvědavost jediným významným prediktorem dobrovolné doby hraní**, hlášená zábava ji nepředpovídala [V, A/PT, `01 [26]` Kao 2024, n = 1 699]. Zvědavost zvyšovala **zpětná vazba vázaná na úspěch**, ne náhodné obměny efektů [V, `01 §1` bod 6, `01 N6`]. Autoři to čtou jako „chtění“ (očekávání) proti „líbení“ (prožitek po akci) [`01 §3` bod 4].
3. **Návrat (retence).** U krátké webové hry se ~90 % hráčů nevrátí vůbec a rozhoduje prvních pár her [V, B, `09 §2.1` Axon, 854 tis. hráčů]. Paměťový Zeigarnikův efekt („nedokončené táhne zpět“) se v metaanalýze nepotvrdil, robustní je jen Ovsiankina: přerušený úkol se **obnoví, když je okamžitá příležitost** (~67 %) [V, `08 §3.4` [9]]. Pro návrat přes dny KB **nemá dobrou oporu** (mezera, viz §9).

**Na co tedy optimalizujeme:** na **dobrovolné pokračování, které hráč umí zdůvodnit věcí ve hře a nelituje ho**. Měřítka (`02 §4.4`, `09 §4.1`, `01 N10`): křivka přežití po hodech, dobrovolné hody po velkém cíli, kontext posledního hodu před odchodem, otázka „Proč pokračuješ?“ a otázka na lítost „Hrál/a jsi déle, než jsi chtěl/a?“, miniPXI s položkou Curiosity. Úspěch = víc dobrovolných hodů **bez** nárůstu lítosti. Délka hraní sama zábavu nedokazuje [V, `09 §2.12`, `02 [13]` Mekler 2017].

**Co táhne k dalšímu hodu (síla důkazů):**
| Páka | Co víme | Síla |
|---|---|---|
| Blízká, uzavíratelná mezera („co je kousek dál“) | zvědavost roste s tím, co už vím, a sílí u zavření mezery; lidé se jí vyhnou, když je šance malá nebo čekání dlouhé | V, teorie + malé lab. studie (`08 §3.5` [10][11]) |
| Blízký cíl se zpětnou vazbou uvnitř vzdáleného rámce | samotný vzdálený cíl může být horší než žádný | V (`08 §3.1` [1]) |
| Gradient cíle | úsilí roste s blízkostí; **po odměně reset a nejvyšší odchod** (17 % ukončení hned po odměně) | V, terén, spotřebitelé (`03 §2.3` [9]) |
| Konec po skoku ve skóre | ukončení nejlépe předpoví **změna proti minulé hře**, po velkém zlepšení se končí častěji | V, B, jedna hra (`09 §2.1` Z3) |
| Úspěšnost u nováčků | nováčci hráli déle, když bylo snazší | V (`04 §1` bod 2 [2]) |
| Střední novost, napětí těsné hry | střední novost optimální, moc i málo škodí; napětí v těsné hře pomáhá; volená obtížnost motivuje | V, AB, vzdělávací hra, > 20 000 sezení (D1) |
| Srovnání se sebou (ghost) | závod s vlastními minulými výkony zvýšil vnitřní motivaci a flow proti hře bez soupeře | V, AB, exergame (D5) |
| Směrová zpětná vazba | „moc krátce / moc daleko“ učí, binární ne | V (`04 §1` bod 7 [23]) |
| Humor | mění vnímání postavy, **ne dokončování ani množství hraní** | V, n = 11 804 dětí (`08 [22]`) |
| Body, úrovně, čísla | zvyšují **množství** aktivity, ne vnitřní motivaci ani kompetenci | V (`02 [13]`, `03 [27]`) |
| Uzavření sezení | dobrý odchod je spojen s uzavřením a vlastní volbou | V/H, rozhovory n = 16 + dotazník n = 111, preprint (D3); `09 §2.3` H |

**Hranice etiky** (pracovní test „engagement, ne compulsion“, `02 §2.7`, N): hráč umí říct proč, přestat nic nestojí, odměna je předvídatelná z výkonu, smyčka má zastávky, pokračování je aktivní volba a nezvýhodněná proti odchodu, funguje i pro slabšího hráče. Seznam „ne“ `02 §4.3` platí celý.

---

## 1. Diagnóza: kdy a proč hráč přestane

Měřítko: **má hráč v okamžiku, kdy by mohl hrát dál, konkrétní věc ve hře, na kterou je zvědavý nebo kterou chce zlepšit?** (`02 §2.7` bod 1).

| Kdy | Co hra dnes umí / plán | Proč by přestal | Opora |
|---|---|---|---|
| **Hody 1–5** | 3D město, poryv a holub, starý strom 3 × 5, výsledek „★ New best!“, tlačítko Again | Pro většinu webových hráčů **je tohle celá hra** [V, `09 N1`]. Dva druhy událostí se stejnými texty: percepční novost s opakováním vyprchává [V, `08 [13]`]. Koupě Power 1 v dalším letu necítí, takže volba nepodporuje autonomii [V/N, `01 N3`, `01 [3]`]. Nevidí, kam letí. | `09 §1`, `08 N6`, `01 N3` |
| **15 min** (~hod 20–25) | Stará hra: cíl 500 m („Goal reached“), mince bez užitku. Plán: Atlas, místa, nákup v 17 z 20 hodů (01 §4.3) | **Reset po odměně** u každého velkého cíle [V, `03 §2.3`], u slepého konce navíc „elder game“ [H, `03 [12]`]. V plánu nové riziko: nákupy každý hod zvýší **počet** hodů, ne chuť [V, `02 [13]`], a když nejsou cítit, hráč nevidí svůj podíl [H, `03 [12][14]`]. | `03 N1`, `03 N8` |
| **45 min** (D2–D3) | Plán: vystřihovánka, události čtvrtí, místa po ~305 m, lety ~28 s | **Zvyk na vztyčení** (percepční novost vyprchá, `08 [13]`, `08 §4` bod 7). Daleko od dalšího místa slábne gradient [V, `03 [9]`], sbírka daleko od dokončení táhne méně [V, `08 [19]`]. Lety bez rekordu: hráč v půlce letu ví, že to nepřekoná, zbytek je čekání (nejistota výsledku zmizela, `01 N6`). | `03 N3`, `08 N6` |
| **Zítra** | Save drží postup | Výzkum **neslibuje**, že by nedokončená věc táhla zpět přes dny [V, `08 §3.4`]. Rozumně podložené je jen: odejít s pocitem uzavření (D3, `09 §2.3`) a po návratu mít **hned** příležitost pokračovat (Ovsiankina). Hra dnes nekončí kapitolou ani po návratu neukáže, kde hráč přestal. | `08 N4`, `09 N2` |

**Tři místa, kde smyčka „hod → výsledek → další hod“ ztrácí tah:**
1. **Hned po velké odměně** (rekord se vztyčením, nové místo): podle `03 [9]` a `09 Z3` je to **nejpravděpodobnější bod odchodu**. To je v pořádku, pokud hráč odchází spokojený (`09 N2`), ale návrh nesmí počítat s tím, že velký moment sám táhne dál. Táhne **další blízká mezera** ukázaná v tu chvíli (`03 N1`, `08 N1`).
2. **Výsledek bez informace:** čísla bez příčiny a bez dalšího cíle. Chybí blízký cíl se zpětnou vazbou [V, `08 [1]`] a informace, co hráč zlepšil [V, `01 [11]` informační zpětná vazba d ≈ +0,33].
3. **Let bez naděje na rekord:** nejistota zmizela, ale let trvá dál. Napětí těsné hry pomáhá (D1), takže dobrý let má zůstat **nejistý až do konce**.

---

## 2. Tři vrstvy tahu

Formát: **co hráč uvidí** · proč táhne (opora) · cena · riziko · jak ověřit (u N).

### (a) Okamžik ve vzduchu: napětí, překvapení, pocit z hodu

**A1 — Páska rekordu / Record Ribbon** (nové, doplněk vystřihovánky)
- **Uvidí:** hranice mezi vztyčeným a plochým městem je papírová páska přes ulice. Když ji vlaštovka protne, páska praskne a teprve pak se začne vztyčovat.
- **Proč:** napětí „doletím, nedoletím“ trvá až do konce letu [V, D1 napětí těsné hry]; pravdivé, bez úpravy výsledku [V, `02 §4.3` bod 3, `04 [17]`]. Blízký viditelný cíl uvnitř letu [V, `08 [1]`]. Odezva jen při skutečném úspěchu [V, `01 [26]`].
- **Cena S.** **Riziko:** v D1 padá rekord skoro každý hod a páska zevšední (`08 [13]`) → tenká v D1, široká u hranice místa. **Ověřit (N):** podíl letů, kdy hráč při přiblížení k pásce udělá další zásah (log), otázka „Věděl jsi v letu, jestli to bude rekord?“.

**A2 — Tužková stopa minulého hodu / Last Throw Sketch** (varianta S2 z 00, změněná)
- **Uvidí:** tenká grafitová čára dráhy **minulého** hodu s křížkem v místě dopadu. Vlaštovka ji dohání, nebo za ní zaostává.
- **Proč:** závod s vlastními minulými výkony zvýšil vnitřní motivaci a flow [V, AB, D5]. Hráči své výsledky srovnávají právě s **minulou hrou** [V, `09 Z3`]. Srovnání se sebou nemá rizika žebříčku [V, `09 §2.4`, `09 N3`]. Proč minulý, ne nejlepší: minulý hod je skoro vždy blízko, takže závod je těsný (D1) a rozdíl dělá právě poslední koupě nebo zásah, tedy je vidět podíl hráče i vlaštovky [N, `03 N8`]. Nejlepší hod se v incrementalu po koupi předletí snadno.
- **Cena S** (~2 vzorky/s v paměti, **bez změny save**). **Riziko:** nepořádek na obrazovce (bible S-6) → jen čára, žádný duch vlaštovky. Výhrada `09 §2.5`: pokusy nemají stejné podmínky (vítr, seed); pro „minulý hod“ to nevadí, je to pocit, ne měření. **Ověřit (N):** test s / bez stopy uvnitř hráče (`09 §2.11`: ~15–34 lidí na střední efekt; s 5–8 jen kvalitativně).

**A3 — Rychlost má jméno a svět ji cítí / Speed Tiers** (S6 z 00, navázané na QS1)
- **Uvidí:** poprvé, kdy síla letu přeskočí práh, se změní stopa (proužky papíru, pak třásně) a pod vlaštovkou reaguje svět (prádlo, holubi, v D3 vlna v obilí). Poprvé krátký titulek *Swift / Paper Jet / Comet*.
- **Proč:** odezva roste se skutečným výkonem [V, `01 [26]`, `02 N3`], novost obsahu místo náhody [V, `02 N4`]. Čísla jsou vidět (06), ale převedená do obrazu, což přidává informaci, ne jen kvantitu [V, `02 [13]` varuje před čistými čísly].
- **Cena S** (stupně, stopa) / **M** (reakce světa, 3–4 typy objektů). **Riziko:** juice má optimum [V/AB, `05` Kao 2020, README P2] → efekty nesmí zakrýt vlaštovku. **Ověřit (N):** pozná hráč stupeň bez titulku?

**A4 — Vystřihovánka se mění po čtvrtích / Four Ways to Pop** (nové, proti zvyku)
- **Uvidí:** D1 střechy se zvednou jako stránky pop-up knihy, D2 lodím se rozvinou plachty, D3 se pole rozvine jako koberec, D4 se lampiony nafouknou a rozsvítí.
- **Proč:** percepční novost s opakováním klesá [V, `08 [13]`], střední novost je optimum [V, AB, D1], nejistotu má nést obsah [V, `01 N6`]. Nová čtvrť = nová mezera „jak se rozloží přístav“, vhledového typu [V/teorie, `08 [10]`].
- **Cena M–L** (nejlevněji: jeden pant u země, mění se osa a zvuk). **Riziko:** výkon a práce art; nejmenší verze D1 + D3. **Ověřit (N):** otázka po hraní „Pamatuješ si, jak se rozkládala která čtvrť?“ (vybavení vinět, `08 §5` testy).

**A5 *(šílený)* — Rodící se město fouká / Pop-up Updraft**
- **Uvidí:** první vztyčení dominanty odfoukne vzduch a vlaštovku jemně nadzvedne. Objevování světa pomáhá objevovat dál.
- **Proč:** novinka je zároveň mechanika [N]. **Riziko:** zesiluje už silné (Matoušův efekt) a mění dolet; v kontextu `03 [9]` může prodloužit sérii rekordů a tím i reset po nich. **Cena S.** Jen jako experiment game designera, **ne do top 5**.

### (b) Mezi hody: proč hned znovu

**B1 — Nulové tření / Already Folded** (zpřesnění rozhodnutého „Throw again“)
- **Uvidí:** po dopadu dítě už drží další složenou vlaštovku, karta výsledku je přes scénu, **podržet kdekoli = další hod** (06, UX B). Dílna, Atlas a Menu jsou stejně dostupné, nic neodpočítává.
- **Proč:** Ovsiankina: přerušený úkol se obnoví, **když je okamžitá příležitost** [V, `08 §3.4`]. Chuť „teď to trefím“ je nejsilnější hned po dopadu. Etika: pokračování je aktivní volba (podržení), ne autoplay, a není vizuálně silnější než odchod [V/H, `02 §4.3` bod 6, `02 §2.7` bod 5, ICO `02 [21]`]. B14 staré KB to podporuje (`README §5.2`).
- **Cena S.** **Riziko:** omylový hod při čtení → zpoždění 0,3 s. **Ověřit (N):** doba dopad → další hod a podíl hodů spuštěných do 5 s; lítost (`02 §4.4`) nesmí vzrůst.

**B2 — Další cíl ve světě / Next Stop in View** (obraz k rozhodnutému „cíli ve výsledku“)
- **Uvidí:** po dopadu kamera ~1 s ukáže **ploché archy dalšího místa** se zapíchnutou vlajkou „Gardens · 86 m“. Po dosažení místa ukáže vztyčenou dominantu a teprve pak další archy.
- **Proč:** blízký cíl se zpětnou vazbou o průběhu [V, `08 [1]`], vždy jen jeden aktivní [N, `08 N3`]. Mezera blízká a uzavíratelná [V/teorie, `08 [10]`, `08 N1`]. **Hlavně v okamžiku po odměně**, kdy hrozí reset [V, `03 [9]`]: `03 N1` doporučuje přesně „oslava → jeden blízký cíl“. Plochý arch je vhledová mezera: víš, že tam něco je, nevíš co (`08 [10]`).
- **Cena S–M.** **Riziko:** zdržuje restart → přeskočitelné podržením. **Ověřit (N):** `08 §5` test „nejbližší místo vs. celá mapa“ (počet dalších hodů), Ovsiankina po nedoletu těsně před místem (`08 §5`).

**B3 — Rozdíl proti minule a jeho příčina / What Made the Difference** (nové, k A2)
- **Uvidí:** jeden řádek ve výsledku: **„+34 m · paperclip“**, **„+12 m · 3 perfect hits“**, **„−20 m · released early“**.
- **Proč:** informační zpětná vazba posiluje vnitřní motivaci (d ≈ +0,33) [V, `01 [11]`, `02 N8`]. Směrová informace o hodu učí [V, `04 [23]`]. Hráč má hned **učební cíl** na další hod [V, `08 [1]`, `08 N3`]. Oddělit podíl hráče a vlaštovky navrhují `03 N8` a `04 N4` (N; experimentální opora chybí, `README §6` mezera 5). Navazuje na `angleHint`.
- **Cena S–M.** **Riziko:** zpětná vazba po dobrých pokusech přifukuje dojem učení [V, `04 §1` bod 9] → jen pravdivé příčiny (koupě od minula, počet zásahů, síla a úhel), jinak mlčet. **Ověřit (N):** umí hráč po hodu říct, proč letěl dál nebo kratší (`02 §4.4`, škála atribuce `04 [34]`).

**B4 — Kdo ji našel, levně / Who Found It** (S3 z 00, nerozhodnuto)
- **Uvidí:** ikonka a suchá věta, kdo vlaštovku našel, každá jen jednou.
- **Proč a proti:** zvědavost „kdo příště“ [N]. Ale humor **nemění chování** [V, `08 [22]`] a opakovaný vtip vyprchá [N, `08 §3.9`]. Je to koření prožitku, ne tah.
- **Cena S.** **Doporučení:** nízká priorita, nanejvýš ~30 vět za hru. **Ověřit (N):** jen prožitek (otázka po hraní), ne metriky návratu (`08 N10`).

### (c) Přes sezení: proč se vrátit

Upozornění: tady je opora **nejslabší** (`08 §3.4`, `09 §2.3`, `README §6` mezera 14). Návrhy jsou levné a eticky čisté, ale jejich účinek na návrat je hypotéza.

**C1 — Okno na konci města / The Far Window** (nové, staví na rozhodnutém finále)
- **Uvidí:** od prvního záběru je pod sluncem na obzoru drobné svítící okno se siluetou druhého dítěte. S každou čtvrtí je blíž a čitelnější; ve finále mu vlaštovku doručíš.
- **Proč:** vzdálený cíl funguje jen jako **rámec** pro blízké kroky [V, `08 [1]`, `08 N2`]. Proto jen tiché okno, žádný aktivní cíl „doleť tam“. Fikční rámec zvyšuje účinek cílů [V, nepřímo, `08 [3]` moderátor fikce]. Beze slov (06: příběh ne).
- **Cena S.** **Riziko:** Loewenstein: vzdálená mezera bez šance na zavření netvoří zvědavost a může frustrovat [V/teorie, `08 [10]`] → okno se **mění po čtvrtích**, aby se hráč viditelně přibližoval. **Ověřit (N):** „Kam myslíš, že letíš?“ po 5 a 30 minutách.

**C2 — Návrat do rozdělané práce / Where You Left Off**
- **Uvidí:** úvodní záběr (rozhodnutý A) skončí pohledem z pavlače na hranu vztyčeného města a pásku rekordu. Na stole leží, co přibylo minule.
- **Proč:** Ovsiankina platí pro **okamžitou** příležitost [V, `08 §3.4`]: ve chvíli spuštění je příležitost okamžitá, proto pokračování ukázat hned. Paměťový Zeigarnik ne [V, `08 [9]`], takže **nepřipomínat mimo hru** (`08 N4`, `02 §4.3` bod 4).
- **Cena S.** **Ověřit (N):** doba od spuštění k prvnímu hodu u vracejícího se hráče.

**C3 — Konec kapitoly / Chapter Close**
- **Uvidí:** po posledním místě čtvrti krátký klidný záběr: čtvrť stojí celá, slunce se posune, karta čtvrti; „Házet dál“ a „Menu“ stejně velké.
- **Proč:** shoda bloků 02 N6, 03 N1, 08 N11 a 09 N2: **oslava a konec kapitoly, pak jeden blízký cíl bez tlaku** [H/N, sjednoceno `README R-N4`]. Dobrý odchod souvisí s uzavřením a vlastní volbou [V/H, D3]. Konec na vrcholu ovlivňuje, jak si hráč obtížnost pamatuje; ochota hrát znovu jen smíšeně ve směru hypotézy [V, AB, D2]. Prázdný konec žánr kritizuje [H, `03 §2.7`, `03 N11`].
- **Cena S.** **Ověřit (N):** dobrovolné hody po kapitole a lítost (`03 N1`: úspěch = víc pokračování bez víc lítosti).

**C4 — Podkroví jako deník cesty** (z 00 a 01 C1, povýšit)
- **Uvidí:** nástěnka pohlednic, polička suvenýrů, sponky a pásky na stole přibývají s cestou; za menu je tahle scéna (06).
- **Proč:** struktura sbírky motivuje blízko dokončení [V, `08 [19][20]`]; pokrok jako místo, ne inventář (`08 N7`). Není to sbírka navíc (06 ji zamítla), jen Atlas a koupě ukázané ve světě. **Riziko:** sbírka nesmí být povinnost [V, `08 [5]`]. **Cena M.**

---

## 3. Prvních 30 hodů: proč hodím znovu

Podle 01 §4.3 (průměrný hráč, zástupná čísla). **DÍRA** = důvod chybí nebo je jen „mám na koupi“ (zvyšuje kvantitu, ne chuť, `02 [13]`).

| Hod | Co se stalo | Proč hodím znovu | Opora |
|---|---|---|---|
| 1 | tutoriál, poryv, holub, Dílna | „Město se pod tím zvedalo.“ Úspěch je skoro jistý: nováčci hrají déle při vyšší úspěšnosti. | `04 [2]`, `01 N7` |
| 2–3 | Power 1, Folds 1, Glider; páska praská | „Předletím svou čáru?“ (A2) a „+18 m · paperclip“ (B3). | D5, `01 [11]` |
| 4–6 | Paper 1–2, Power 2; Market na dohled | Vlajka „Market · 50 m“ nad plochými archy (B2). | `08 [1][10]` |
| 7 | **Market**, Atlas, pohlednice | Velký moment = **nejvyšší riziko odchodu** (reset po odměně). Hned ukázat další archy (B2) a nechat odejít spokojeného. | `03 [9]`, `09 Z3` |
| 8 | první Spropitné | „Trefím obálku líp?“ Slabé, ale výkonové. | `01 [11]` |
| 9–12 | uzly stromu, malé rekordy | **DÍRA (malá).** Vztyčení podesáté stejné. Drží A2 + B3 a první *Swift* (A3). | `08 [13]` |
| 13–17 | uzly, cesta ke Gardens (110 m) | **DÍRA (střední).** Daleko od místa slábne gradient. Kandidáti: scéna na jedno použití (00 U3, *Sprinkler Rainbow*), vlajka Gardens. | `03 [9]` |
| 18–20 | **Gardens**, Pinwheel, Kraft | „Jak poletí Kraft?“ Koupě vidět na vlaštovce. Opět bod odchodu → B2. | `03 N1` |
| 21–24 | Kraft, cesta k Railway (914 m) | **DÍRA (střední).** Nejdelší úsek D1. Kandidáti: *Paper Jet* (A3), *Race the Train* (U3), pára zaručeně v dalším letu (SK1). | `08 N6` |
| 25–27 | **Railway**, pára | „Co je za vodárnou?“ | `08 [10]` |
| 28–30 | brána, **konec kapitoly** (C3) | Přirozené místo odejít. Kdo zůstane: „Přístav se rozkládá jinak“ (A4). | D2, D3, `09 N2` |

**Čtení:** silné hody mají **blízkou mezeru** nebo **vlastní výkon k porovnání**. Díry jsou tam, kde je jen koupě uzlu. Plán „nákup skoro každý hod“ díry nezaplní, protože čísla zvedají kvantitu, ne zvědavost (`02 [13]`, `01 [26]`). Zaplní je A2 + B3 (vlastní výkon), A3 (obraz rychlosti) a obsah ve vzduchu (00 U3).

---

## 4. Kritika dosavadního plánu (00, 01) z pohledu výzkumu

| Prvek | Co říká výzkum | Co s tím |
|---|---|---|
| **„Novinka nebo koupě skoro každý hod“** (06, 01 §4.3: koupě v 17 z 20) | Body a úrovně zvedají **počet** úkonů, ne vnitřní motivaci [V, `02 [13]`]. **Střední** novost je optimum, příliš mnoho novosti motivaci snižuje [V, AB, D1]. Odměny navázané na pouhé zapojení podkopávají motivaci nejvíc [V, `01 [11]`]. | Cílem má být „**důvod** skoro každý hod“ (mezera nebo vlastní výkon), novinky ve střední dávce. Rozpor s 06 → `BLOCKED 1`. |
| **Velké momenty jako hlavní tah** (vztyčení, nové místo, 00 §1) | Po odměně reset a nejvyšší odchod [V, `03 [9]`], konec po skoku ve skóre [V, B, `09 Z3`]. | Velký moment je vrchol a možný konec. Tah musí nést **co následuje po něm** (B2, C3). Plán to dnes neříká. |
| **Kdo ji našel, Ranní noviny, hlášky** (00 S3, S4) | Humor nemění dokončování ani množství hraní [V, `08 [22]`]. | Škrtnout noviny, nálezce jen jako levné koření (B4). |
| **Paměť tvorů 1 / 10 / 25** (00 U2) | Skryté počítadlo, hráč 10. setkání nepozná; opora jen N. | Nechat první setkání, zbytek škrtnout. |
| **Ikony rolí → ↑ × ◈ a skladba letu** (01 §3) | Čitelnost dovednosti pomáhá kompetenci [V, `01 N4`]; jako tah nepůsobí. | Ponechat jako čitelnost, nepočítat jako lákadlo. |
| **Předpověď událostí** (01 PL1, 06: až jako odemčení) | Zvědavost je nejvyšší při **střední** jistotě [V, `08 [11]`]; úplná předpověď nejistotu snižuje. | Rozhodnutí „až v progresi“ je v souladu. Při návrhu ukazovat **roli**, ne časy (01 to tak má). |
| **Spropitné** (EM1) | Výkonově podmíněná, deterministická odměna je v pořádku [V, `02 §1` bod 10]. | Ponechat; ať je vidět (obálka do brašny). |
| **QS1 (slabé QTE u země)** | Správně: odstraňuje nefér záchranu, P1. Ale konec letu tím ztratí nejistotu (`01 N6`). | Naplnit pásku (A1) a stopou (A2), ne událostmi. |
| **Vystřihovánka jedním pohybem** (00 S1, moje) | Habituace [V, `08 [13]`]. | A4, `BLOCKED 5`. |
| **Návrat přes dny** (00, 01 obecně) | Paměťový Zeigarnik se nepotvrdil [V, `08 [9]`]; o návratu webových hráčů rozhoduje prvních pár her [V, B, `09 Z3`]. | Neinvestovat do „návratových“ mechanik; investovat do **prvních 5 hodů** a do uzavření sezení. |

**Škrtl bych:** Ranní noviny (00 S4), paměť tvorů na 10. a 25. setkání (00 U2), Plán letu (01 PL2) natrvalo, pokud ho playtest nevyžádá, **metriku „hody bez nákupu“** jako cíl ladění (nahradit „hody bez důvodu“, §5), A5 updraft z hlavního plánu.

---

## 5. Top 5 doporučení (tah / cena)

| # | Co | Opora | Cena | Kdo dotáhne |
|---|---|---|---|---|
| 1 | **B1 Nulové tření:** podržet kdekoli na výsledku = hod, dítě už drží další vlaštovku, odchod stejně snadný | V `08 §3.4` (Ovsiankina), H/V `02 §2.7`, `02 [21]` | S | product (stav karty, zpoždění), game-dev |
| 2 | **A2 + B3 Stopa minulého hodu a příčina rozdílu** („+34 m · paperclip“) | V D5, V `09 Z3`, V `01 [11]`, V `04 [23]`; příčina N | S–M | game-designer (pravidla příčin, kdy mlčet), art (tužková čára), narrative (texty EN/CS) |
| 3 | **B2 Další cíl ve světě**, hlavně hned po velké odměně | V `08 [1][10]`, V `03 [9]`, `03 N1` | S–M | product (záběr, přeskočení), art (vlajka, ploché archy), game-designer (co ukázat po místě) |
| 4 | **C3 + C2 Konec kapitoly a návrat do rozdělané práce** | H/N sjednoceno `02 N6`, `03 N1`, `08 N11`, `09 N2`; V/H D3; V D2 | S | game-designer (kdy kapitola), art (záběr čtvrti), product (stejně velká tlačítka) |
| 5 | **A4 Vystřihovánka po čtvrtích** (+ A1 páska jako levný začátek) | V `08 [13]`, V D1 (střední novost, napětí) | M–L (páska S) | art (4 vzory), game-dev (`perf-check`) |

**Hned za nimi:** C1 okno na konci (S, slabší opora), A3 stupně rychlosti (S, k QS1), C4 podkroví (M).

### Předávka game designerovi
1. Pravidla B3: které příčiny, pořadí, prahy, kdy mlčet (`04 §1` bod 9: nepřifukovat).
2. **Metrika „hod s důvodem“** místo „hod s nákupem“: rekord, nové místo, první setkání ve vzduchu, nebo rozdíl proti minule nad prahem. Cíl: žádné sucho delší než ~3 hody bez důvodu (zástupně, ověří simulace).
3. Novinky v **střední dávce** (D1): kolik první-setkání na čtvrť, aby se nestřídaly každý hod.
4. Díry 13–17 a 21–24: scény U3 nebo jen A2/B3.
5. Stupně rychlosti A3 z Q, první *Swift* kolem hodu 10.
6. Playtest (`09 §4.1`): křivka přežití, kontext posledního hodu, „Proč pokračuješ?“, lítost, miniPXI Curiosity. Logovat zvlášť **odchod po rekordu nebo místě** (`09 N2`).

### Předávka art-directorovi
1. Páska rekordu (A1), tloušťka podle významu. 2. Tužková stopa (A2) pod vlaštovkou proti bibli S-6. 3. Vlajka a ploché archy dalšího místa (B2). 4. Záběr konce kapitoly (C3) s posunem slunce. 5. Čtyři způsoby rozkládání (A4). 6. Okno na konci (C1), 4 stavy, čitelné na 360 px.

---

## 6. Fun-check (skill `fun-check` na tento návrh, 15. 10.)

Je to názor, ne měření. Co ukáže jen playtest: NOT ASSESSED.

| Položka | Verdikt | Proč | Nejlevnější lepší verze |
|---|---|---|---|
| A1 Páska rekordu | silné | vidět ve vzduchu, napětí do konce letu, pravdivé (P1, P10) | pruh papíru a praskání, bez nových budov |
| A2 Stopa minulého hodu | silné | důvod v každém hodu, srovnání se sebou (P6, P13 v pořádku) | jen čára a křížek, bez save |
| A3 Stupně rychlosti | OK | obraz místo čísla; titulky mohou působit jako „systém“ | nejdřív jen stopa, titulek jen poprvé |
| A4 Vystřihovánka po čtvrtích | silné, drahé | jediná odpověď na zvyk ve 45. min | D1 + D3 |
| A5 Updraft | riziko | mění balanc, zesiluje silné | experiment, ne plán |
| B1 Nulové tření | silné | největší tah za nejmenší cenu; pokračování aktivní, ne autoplay (P13) | zpoždění podržení 0,3 s |
| B2 Další cíl ve světě | silné | blízký cíl v obraze, hlavně po odměně (P5, P6) | vlajka bez pohybu kamery, když hráč spěchá |
| B3 Příčina rozdílu | OK až silné | informace, ne oslava (P1, P7); riziko: text ve výsledku se nečte | ikona + číslo, max 4 slova |
| B4 Kdo ji našel | výplň | humor nemění chování (`08 [22]`) | jen pokud zbude čas |
| C1 Okno na konci | OK | rámec cesty; na telefonu možná nečitelné (NOT ASSESSED) | 4 stavy světla |
| C2 Návrat do rozdělané práce | OK | Ovsiankina při spuštění; levné | jen cíl kamery |
| C3 Konec kapitoly | OK, eticky silné | zastávka bez tlaku (P5, P13); riziko: přeruší rozjetou sérii | 1 klepnutí, krátké |
| C4 Podkroví jako deník | OK | vidět jen v menu, ne ve vzduchu | 3–4 velké předměty |

**Jednota:** všechny prvky jsou papír, dítě nebo cesta za sluncem. **Hlavní riziko celého návrhu:** páska, stopa, stupně, vlajka a okno najednou porušují bibli „jedna výrazná věc na obrazovku“. Proto ve vzduchu nanejvýš jedna výrazná věc najednou: stopa A2 je tichá (tenká čára), páska A1 se zvýrazní až v posledních sekundách před ní, titulky A3 jen poprvé.
**Top 3 silné:** B1 nulové tření, A2 + B3 závod s minulým hodem a jeho příčina, B2 další cíl ve světě.
**Top 3 ke škrtnutí nebo předělání:** B4 nálezci (výplň), A5 updraft (riziko), C4 zmenšit na pár předmětů.
**Etika (P13):** bez FOMO, odpočtů, náhodných odměn a seznamů úkolů. Hlídat jen B1: podržení nesmí být vizuálně silnější než Dílna nebo Menu (`02 §4.3` bod 6). Nové `BLOCKED` fun-check nepřinesl, otázky jsou v §8.

---

## 7. Jak to celé ověřit (N → data)
Podle `09 §4.1` a `§2.11`: 5–8 testerů najde problémy, ne rozdíly v číslech. Proto: **kvalitativně** (pozorování, „Proč jsi hodil znovu?“ po každém 5. hodu, ne během QTE) + **lokální log** se souhlasem (`?playtest=1`, `09 §2.10`): doba dopad → hod, hody po velkém cíli, kontext odchodu, odchod do 5 hodů. Párové srovnání (stopa ano / ne) až s ~15–34 lidmi. Úspěch = víc dobrovolných hodů a konkrétní důvody ve hře, **bez** vyšší lítosti.

---

## 8. Volby pro uživatele

BLOCKED: **Výzkum odporuje doslovnému „skoro každý hod novinka nebo koupě“ (06, 15. 10.).** Body a nákupy zvyšují počet hodů, ne chuť hrát (Mekler 2017, `02 [13]`), a novinek má být střední množství, příliš mnoho motivaci snižuje (Lomas 2017, D1). (a) **přeformulovat na „skoro každý hod důvod hodit znovu“**: blízký cíl na dohled, závod s minulým hodem nebo novinka ve vzduchu; novinky a koupě střídměji, ale citelně (příklad: hod 10 bez koupě, ale „+12 m · 3 perfect hits“ a páska rekordu 20 m před tebou); (b) ponechat doslova, koupě a novinka skoro každý hod; (c) kombinace: v D1 koupě často (učení), od D2 jen „důvod“. **Doporučení: (a)**, jinak (c).

BLOCKED: **Kupovat jedním klepnutím přímo z výsledku?** Rozhodnuto bylo „ve výsledku jen řádek, kupuje se v Dílně“ (UX A). Nový důvod: plán počítá koupi skoro po každém hodu a cesta do Dílny po každém hodu oddálí další hod, přičemž chuť pokračovat je nejsilnější hned po dopadu (Ovsiankina, `08 §3.4`). (a) **na výsledku jeden čip „Buy Power ·2 · 35 ◈“ pro nejbližší koupi, výběr dál v Dílně**; (b) beze změny, ale koupě méně často a větší; (c) beze změny. **Doporučení: (a)**; při volbě (a) v předchozí otázce stačí i (b).

BLOCKED: **Čí tužkovou stopu vidět v letu?** (a) **minulého hodu** (závod je vždy těsný, ukáže, co udělala koupě, bez změny save; hráči se srovnávají právě s minulou hrou, `09 Z3`); (b) nejlepšího hodu (silnější „rekord“, ale po koupích se předletí snadno a potřebuje save); (c) žádnou. **Doporučení: (a).** Příklad: minule jsi dopadl u tržnice, čára končí křížkem nad stánky, teď ho přeletíš o 30 m.

BLOCKED: **Vidět druhé dítě od začátku?** (a) **ano, drobné svítící okno pod sluncem od prvního záběru, každou čtvrtí blíž**, ve finále mu vlaštovku doručíš; (b) až od 3. čtvrti; (c) jen ve finále jako překvapení. **Doporučení: (a)**: vzdálený rámec pomáhá jen s blízkými kroky (`08 [1]`), proto tiché a s viditelným přibližováním. (c) šetří překvapení, ale hráč 90 minut neví, kam letí.

BLOCKED: **Rozkládat město v každé čtvrti jinak?** (a) **ano, 4 způsoby** (pop-up střechy, plachty a jeřáby, pole jako koberec, nafouknuté lampiony); (b) jen D1 a D3; (c) všude stejné vztyčení. **Doporučení: (a)**, při nedostatku práce (b). Opakovaný obraz ztrácí novost (`08 [13]`), a vystřihovánka je hlavní lákadlo hry.

---

## 9. Doplněné zdroje (rešerše 15. 10. 2026) a návrh doplnění KB

KB jsem neměnil. Navrhuji doplnit do bloků 08 a 09 (mezery `README §6` č. 6, 9, 14).

| ID | Zdroj | n, metoda | Co zjistili | Ověření | Návrh do KB |
|---|---|---|---|---|---|
| D1 | Lomas, D., Koedinger, K., Forlizzi, J. a kol. (2017). *Is Difficulty Overrated? The Effects of Choice, Novelty and Suspense on Intrinsic Motivation in Educational Games.* CHI 2017. DOI 10.1145/3025453.3025638 | 3 online experimenty, > 20 000 sezení (volba n = 10 472, novost n = 5 065, napětí n = 6 511), vzdělávací hra | Středně těžké úrovně motivovaly, jen když si je hráč zvolil (při přidělení vyhrály nejsnazší); **střední novost optimální**, moc i málo škodí; **napětí v těsné hře** prospívá. | abstrakt + tisková zpráva CMU; plný text neotevřen | 04 (k Lomas 2013), 08 §3.12 |
| D2 | Gutwin, C., Rooke, C., Cockburn, A., Mandryk, R. L., Lafreniere, B. (2016). *Peak-End Effects on Player Experience in Casual Games.* CHI 2016, s. 5608–5619. DOI 10.1145/2858036.2858419 | 2 experimenty, manipulace pořadí obtížnosti (Bejeweled-like, reakční hra, střelba), n neověřeno | Pamatovaná obtížnost silně ovlivněná koncem; zábava a **ochota hrát znovu smíšeně**, část významná ve směru hypotézy, nic proti. | abstrakt přes vyhledávání; PDF staženo, ale nečitelné | 09 §2.3 |
| D3 | Alexandrovsky, D., Gerling, K., Opp, M. S., Hahn, C. B., Birk, M. V., Alsheail, M. (2024). *Disengagement From Games: Characterizing the Experience and Process of Exiting Play Sessions.* arXiv 2406.00189 | rozhovory n = 16 + dotazník n = 111 | Odchod je proces; úspěšný odchod souvisí s **uzavřením a vlastní volbou** (podle sekundárního shrnutí); doporučují navrhovat odchod jako součást hry. | abstrakt (uzavření jen sekundárně); preprint, nerecenzováno | 09 §2.3 (mezera 14) |
| D4 | Alexandrovsky, D., Friehs, M. A., Birk, M. V., Yates, R. K., Mandryk, R. L. (2019). *Game Dynamics that Support Snacking, not Feasting.* CHI PLAY 2019, s. 573–588 | obsahová analýza + 2 studie, n neověřeno | Pro krátké pravidelné hraní mají potenciál **novost a čekání**. Čekání je pro nás zakázané (06, P13), novost ano. | záznam TU/e (abstrakt) | 09 §2.2 |
| D5 | Michael, A., Lutteroth, C. (2020). *Race Yourselves: A Longitudinal Exploration of Self-Competition Between Past, Present, and Future Performances in a VR Exergame.* CHI 2020 | 4týdenní longitudinální + průřezová studie, n neověřeno | Závod s vlastními minulými výkony (ghost) zlepšil výkon, **vnitřní motivaci a flow** proti hře bez soupeře. | záznam Univ. of Bath (abstrakt) | 09 §2.5 (mezera 14) |
| D6 | Zetian a kol. (2024), *Frontiers in Psychology* 10.3389/fpsyg.2024.1374649; disertace Leiden (CURIO, rok neověřen) | 5 experimentů s trailery; designový výzkum | Neúplná ukázka hry budí víc zájmu (informační mezera); mezery je třeba **zvýraznit**; vyvážená nejistota a struktura podporuje zvědavost. | jen shrnutí z vyhledávání; nepřímé (reklama, výuka) | 08 §3.5, jen jako H |

**Co stále chybí (doporučené další rešerše):** empirie launch & upgrade her a „ještě jeden pokus“ (nic recenzovaného nenalezeno), návrat přes dny u krátkých webových her bez notifikací, habituace na opakovanou odměnovou animaci ve hře, vliv délky prodlevy mezi pokusy na pokračování. Plné texty D1–D5 ověřit v dalším ověřovacím kole KB.

**Odkazy:** [Lomas 2017 (unpaywall)](https://unpaywall.org/10.1145%2F3025453.3025638), [CMU preview](https://hcii.cmu.edu/news/chi-preview-researchers-hcii-believe-difficulty-can-be-overrated-games), [Gutwin 2016](https://dx.doi.org/10.1145/2858036.2858419), [Alexandrovsky 2024](https://arxiv.org/abs/2406.00189), [Alexandrovsky 2019](https://research.tue.nl/en/publications/game-dynamics-that-support-snacking-not-feasting/), [Michael & Lutteroth 2020](https://researchportal.bath.ac.uk/en/publications/race-yourselves-a-longitudinal-exploration-of-self-competition-be/), [Zetian 2024](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1374649/full), [Agarwal 2017 On Quitting](https://arxiv.org/pdf/1703.04696).
