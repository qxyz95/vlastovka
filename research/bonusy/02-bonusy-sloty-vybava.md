# Bonusy 02 — Sloty, výbava a kompromisy (horizontální progrese)

**Založeno 13. 10. 2026** podle `00-zadani.md`. Jde o návrhy k simulaci, ne o rozhodnutí. Úhel pohledu: **stránka Bonusy** (`bonus.html`, dnes prázdná) jako místo, kde hráč volí výbavu s kompromisem, tedy ne „větší číslo“, ale „jiný let“. Sem patří sloty, kategorie, sestavy (loadouty), synergie, bonusy s nevýhodou, bonusy vázané na model, jednorázové bonusy a rozhodnutí před hodem. Vertikální úrovně řeší `01` (Dílna), dovednostní mechaniky `03` (DQ), svět a sbírky `04` (SV), mince a meta `05` (E). Kde se karta překrývá, odkazuji a přidávám jen horizontální rozměr.

**Podklady:** `src/config.js`, `core.js`, `events.js`, `throw.js` (verze 0.6.1), `simulation/monte-carlo.mjs` a `MONTE-CARLO.md`, KB `README` (P1–P15), bloky 01, 02, 03, 04 a 08, karty v `01`, `03`, `04` a `05`. Web nepoužit, kód hry ani `simulation/` se neměnily. Odkazy: `03 §2.5` = blok KB 03, oddíl 2.5; `03 N7` = implikace N7; `README P8` = průřezové zjištění. Štítky: **V** výzkum · **H** heuristika nebo praxe oboru · **N** naše hypotéza.

---

## 0. Výchozí fakta a vlastní sondy

### 0.1 Proč vůbec horizontální bonusy
- **Dnešní strom testuje chybu, ne vkus.** Síla a papír se násobí, takže vyhrává rovnoměrný nákup (28 hodů) a specializace je pomalejší (síla 37, papír 45, přehyby 46; `MONTE-CARLO.md`, `03 §2.5`). Volba „kam dřív“ je podle Comptona částečně zřejmá (`03 §2.5`, H) a přehyby mají těžko předvídatelný účinek (`README P8`, V/N).
- **Horizontální progrese se měří možnostmi, ne měřítkem.** Riziko vertikální je nuda, když se nemění, *jak* hraju. Riziko horizontální jsou možnosti bez kontextu (Game Developer Staff, `03 §2.4`, H). Fischer považuje horizontální progresi za poutavější a upozorňuje, že u vertikální „je těžké poznat, zda se zlepšil hráč, nebo avatar“ (`03 §2.4`, H, názor bez dat).
- **Víc možností samo nevytváří zajímavou volbu.** LtF3 má přes 100 dílů se sloty, a přesto ho recenze kritizují za přehlcení a dominantní strategii (`03 §2.5`, H). Proto tento soubor drží **malý katalog (≤ 14 bonusů), 2–3 sloty a pravidlo jedné kategorie** a ke každému bonusu požaduje situaci, ve které je nejlepší, i situaci, ve které škodí.
- **Volba podpoří autonomii, jen když hráč rozdíl cítí** (Peng 2012, `01 N3`, `README P8`, V). Každá karta proto ukazuje přínos i cenu předem na hráčově vlastním hodu (B02).

### 0.2 Sondy (vlastní skript, orientační čísla)
Skript ve scratchpadu (`perks.mjs`) kopíruje `createFlight` z `core.js` s upraveným objektem `p` z `parameters()`. Krokuje přes `step()` ze `src/`, události bere z `createEvents()` a QTE ovládá stejným šumem časování jako `flyOnce` v `monte-carlo.mjs` (profily slabý, průměrný, expert, bias hráče přelosovaný pro každý hod). Úhel je nejlepší z mřížky 1° při síle `mu` daného profilu, k tomu šum úhlu a síly profilu. Na buňku připadá 400 hodů (seedy 2–401). Stavy úrovní (síla/papír/přehyby): **raný** 0/0/0, **střední** 2/2/1 (kolem 250–350 m), **pozdní** 4/3/3 (kolem 500 m). Nejde o kampaň ani o náhradu Monte Carla, jen o nastřelení koeficientů v kartách.

**Tabulka A — změna průměrného doletu jedním bonusem, střední stav** (výchozí dolet bez bonusu: šipka 300 / 370 / 460 m, kluzák 361 / 446 / 564 m pro slabý / průměrný / expert):

| Bonus (karta) | Mechanika v sondě | Šipka sl. / prům. / exp. | Kluzák sl. / prům. / exp. | Poznámka |
|---|---|---|---|---|
| Zátěž ve špičce (B03) | speed ×1,10, glide ×0,82 | +3 / +4 / +4 % | −4 / −4 / −5 % | v raném stavu šipka +7–8 % |
| Hedvábný papír (B04) | speed ×0,90, glide ×1,25 | −2 / −2 / −2 % | +9 / +8 / +8 % | zrcadlo B03 |
| Ocasní ploška (B05) | window ×1,5, qte ×0,92 | +2 / 0 / −3 % | +5 / 0 / −5 % | úspěšnost QTE slabého 77 → 93 % |
| Ostrá hrana (B06) | window ×0,6, qte ×1,25 | −5 / −2 / +7 % | −3 / −1 / +15 % | úspěšnost slabého 76 → 52 %, v pozdním stavu expert +12 / +16 % |
| Pružinový katapult (B07) | síla pevně 0,85 | +21 / +7 / −5 % | +19 / +8 / −5 % | |
| *Asistence pevná síla 0,70* | síla pevně 0,70 | +10 / 0 / −11 % | +10 / 0 / −11 % | varianta bez slotu (B07) |
| Římsa (B08) | start +6 m, strop síly 0,75 | +8 / +7 / −2 % | +15 / +13 / +2 % | výška × klouzavost |
| Expresní hrot (B09, šipka) | ideal −4°, speed ×1,08, cruise ×1,3 | 0 / −3 / −2 % | — | **let 21 → 17 s, 25 → 20 s, 30 → 24 s** |
| Lamely (B10, kluzák) | glide ×1,2, qte ×0,75 | — | +5 / +4 / +1 % | raný stav +8 / +7 / +3 %, pozdní +1 / −2 / −4 % |
| Klidný let (B11) | max. 5 událostí, mezery ×1,8, účinek ×1,4 | +4 / +5 / +5 % | +8 / +9 / +8 % | pozdní kluzák +3 / −1 / −2 % |
| Rušná obloha (B11) | mezery ×0,55, účinek ×0,85 | 0 / +1 / +3 % | 0 / 0 / +1 % | pozdní kluzák −2 / −7 / −8 % |
| Vábnička: holubi (B12) | 75 % událostí holub | 0 / +1 / +1 % | −4 / −3 / −4 % | |
| Vábnička: poryvy (B12) | 75 % událostí poryv | 0 / −1 / −2 % | +3 / +4 / +3 % | |
| Pokladnička (B13) | speed ×0,93, mince ×1,25 | dolet −8 / −10 / −11 % | dolet −7 / −9 / −10 % | **mince za hod +18 / +15 / +14 %** |

**Tabulka B — dvojice bonusů (střední stav), součet proti skutečnosti:**

| Model, profil | A | B | Obě | Součet A + B | Vztah |
|---|---:|---:|---:|---:|---|
| kluzák, expert | Hedvábí +8,5 % | Ostrá hrana +14,6 % | **+28,7 %** | 23,1 % | **synergie +5,6 p.b.** (klouzavost násobí výšku z poryvů) |
| kluzák, slabý | Hedvábí +8,5 % | Římsa +15,6 % | **+27,9 %** | 24,1 % | **synergie +3,8 p.b.** (výška × klouzavost) |
| kluzák, slabý | Římsa +16,7 % | Katapult +19,1 % | +33,6 % | 35,8 % | antisynergie (obě řeší sílu) |
| šipka, slabý | Zátěž +3,2 % | Katapult +22,2 % | +23,8 % | 25,4 % | mírná antisynergie |
| šipka, expert | Zátěž +3,8 % | Ostrá hrana +6,9 % | +10,7 % | 10,7 % | nezávislé |
| kluzák, průměrný | Lamely +4,0 % | Hedvábí +8,2 % | +11,4 % | 12,2 % | slabě klesající výnos |
| šipka, průměrný | Zátěž +4,0 % | Hedvábí −0,9 % | −0,1 % | 3,1 % | navzájem se ruší |

**Tabulka C — negativní a strukturní nálezy:**

| Sonda | Výsledek | Důsledek |
|---|---|---|
| „Klapky“: ideal +10°, speed ×0,95 (šipka) | **+26 až +41 %** ve všech stavech a profilech | `ideal` šipky (18°) je silně vázající: nejlepší úhel je 25–26° a platí strmostní penalizaci. Zvednout `ideal` je skoro zadarmo. |
| „Hrot“: ideal +6°, glide ×0,85 (šipka) | +13 až +15 % všude | ani velká cena zvednutí `ideal` nevyváží, **`ideal` nahoru do bonusů nedávat** |
| Kluzák s `ideal` +8–10° | +1 až +4 % | kluzák naráží na `AIM_MAX` 40°, páka u něj nefunguje |
| Jeden poryv (vx +1,5, vy +2) v čase t = 1 s / ve vrcholu / v klouzání / u země | +47–84 m / +19–25 m / +6–10 m / +3–10 m | **poryv ve stoupání má 5–10× větší účinek než pozdě**. „Uložený poryv na později“ by byl triviální volbou („použij hned“), proto ho nenavrhuji. |
| Nesení holubem 0,8 s ve vrcholu / 3 m nad zemí | šipka +16–18 / +23–27 m, kluzák +13–14 / +16–17 m | holub je cennější nízko, poryv vysoko. Je to pozadí pro B12 a B11. |
| Vítr ±1,5 m/s, střední stav, citlivost na vítr ×1,6 (B18) | kluzák: zadní 354 → 382 m (+8 %), protivítr 265 → 240 m (−9 %); šipka +4 / −4 % | volba závislá na viditelné podmínce, jen pokud vítr vznikne (DQ-10) |
| Bonusy navázané na QTE (Ostrá hrana, Lamely, Rušná obloha) | jejich účinek roste nebo klesá s počtem událostí: pozdní kluzák má ~10 událostí na let | **výhodnost bonusu se mění s fází hry**, matice výhodnosti (B22) musí mít fáze |

### 0.3 Co z toho plyne pro celý návrh
1. **Kompromis funguje, když obě strany míří na jinou proměnnou.** Rychlost proti klouzavosti dělí modely (B03, B04), okno proti účinku dělí dovednost (B05, B06), síla proti stropu dělí profily (B07, B08), dolet proti času dělí motivace (B09). Nikdy nemodifikovat `ideal` šipky nahoru.
2. **Velikost:** správně zvolený bonus dá svému hráči +5–20 %, špatně zvolený −2 až −10 %. Dva správně zvolené sloty dají +15–30 %, tedy zhruba 1–2 úrovně Dílny (jedna úroveň síly je u šipky +17 %, `01 §0`). To je rozpočet, který musí Monte Carlo započítat do tempa k 500 m.
3. **Synergie vznikají samy z fyziky** (výška × klouzavost, klouzavost × poryv). Není nutné přidávat umělé „sady“ s bonusem navíc (B14).
4. **Bonusy pro slabší ruku jsou zároveň asistence.** Katapult a Římsa zvednou slabého hráče o 15–21 %. Hranici mezi slotovým bonusem a bezplatnou asistencí (DQ-13, DQ-14, pravidlo `03 §0.2` bod 4) řeší B07 a otevřená otázka 4.

### 0.4 Společná pravidla všech karet
- **Bonus se odemyká jednou a natrvalo, vybavuje se do slotu.** Nic nepropadá, nic se nespotřebovává za mince, žádné časovače (`02 §4.3` body 4, 5 a 7, `README P13`).
- **Výměna výbavy je zdarma** mezi hody na stránce Bonusy a rychlou volbou sestavy při míření (B15). Kompromis je tedy volba *pro tento hod*, ne past na celou hru (srov. D14).
- **Každý bonus má pravdivý náhled** na hráčově typickém hodu (B02) a po letu pravdivý rozpis (B21). Žádný náhodný efekt ani náhodná nabídka bonusů (`02 §4.3` bod 1, `05 §0.2`).
- **Asistence nezabírají slot** (DQ-13, DQ-14, DQ-15, pravidlo `03 §0.2` bod 4).
- **Implementační háček (společný):** bonus je datový záznam v `config.js`, např. `{id:'silk', cat:'paper', mods:{speed:.9, glide:1.25}, model:null}`. Nová čistá funkce `applyBonuses(p, slots)` se volá na konci `parameters(model, levels, slots=[])` a násobí pole `speed, glide, window, qte, cruise`. Pole mimo `parameters()` (výška startu `height`, úprava síly `charge`, úprava událostí `events`) dostane `createFlight` jako volitelný parametr. Save v4: `bonus:{owned:[], slots:[null,null,null], sets:[]}` s migrací z v3.
- **Společný nárok na simulátor:** `flyOnce` musí předat sloty do `createFlight`. Nová nákupní a výběrová strategie bonusů viz B22. Do té doby jde většinu karet měřit kopií `createFlight` jako v sondě.

---

## 1. Systém slotů a stránka Bonusy

### B01 — Stránka Bonusy: tři sloty a výbava mezi hody
- Typ: Systém
- Kde: Bonusy
- Mechanika: `bonus.html` dostane horní pás se **sloty** (vlaštovka uprostřed, sloty kolem ní jako „kapsy“ na křídle) a pod ním **katalog** odemčených i zamčených bonusů po kategoriích (B14). Algoritmus:
  1. `p.bonus.owned` obsahuje odemčené bonusy, `p.bonus.slots` je pole o délce podle odemčených slotů.
  2. Vybavení: klepnutí na bonus → do prvního volného slotu. Je-li ve slotech bonus stejné kategorie, nahradí ho (pravidlo B14). Odebrání klepnutím na slot.
  3. Bonus vázaný na model (B09, B10) se při letu jiným modelem ignoruje a slot je šedý s textem „platí jen pro Kluzák“.
  4. `createFlight` čte `p.bonus.slots` a předá je do `parameters()` (viz 0.4). Ve výsledku se ukládají ID bonusů použitých v letu.
  - **Počet slotů:** 1. slot po dosažení 100 m (spolu s Kluzákem, „druhá vlaštovka a první kapsa“), 2. slot po dosažení Tržnice (305 m, první nové místo), 3. slot po 500 m. Alternativa pro simulaci: sloty podle razítek (E05: 2 / 5 / 9 razítek).
  - Navigace: stránka zůstává „02 / Bonusy“. Výbava je vidět i v Dílně jako malý řádek pod modelem („Kapsy: Hedvábný papír, Ostrá hrana“).
- Úrovně a cena / podmínka odemčení: sloty zdarma za dosažené vzdálenosti (100 / 305 / 500 m). Bonusy viz B20.
- Proč je hra zábavnější: Dává hře druhou osu vedle vertikálních úrovní. Hráč volí, *jak* poletí, ne jen *jak daleko* (`03 §2.4`, H). Omezený počet slotů dělá z volby skutečné rozhodnutí s náklady příležitosti, protože nejde mít všechno (Compton: volba má důsledky a není zřejmá, `03 §2.5`, H). Odemykání slotů za místa trasy dává blízké dílčí cíle uvnitř cesty k 500 m (`README P6`, V). 3. slot po 500 m je jeden blízký nový cíl po oslavě konce kapitoly (`03 N1`, `08 N11`, H/N).
- Pocit „chci a potřebuju“: „Kluzák je jiný než šipka, ale obě letí pořád stejně.“ Slot je viditelná prázdná kapsa na vlastní vlaštovce. Při dosažení 100 m výsledek ukáže „Nová kapsa: vyber si, čím tvoje vlaštovka bude jiná“ a dva konkrétní bonusy s náhledem (B02, B20).
- Rizika a etika: Riziko přehlcení na začátku (`07`, `README P14`). Proto první slot až po 100 m a katalog s nejvýš 2 bonusy v tu chvíli (B20). Stránka nesmí být obchod s blikáním, „limitovanými“ bonusy nebo slevami (`02 §4.3` body 6 a 7). Sloty se nikdy neztrácejí ani „nezamykají“ zpět. Pozor na `README P5`: 3. slot po 500 m nesmí být jediné, co hráč po cíli uvidí. Nejdřív oslava, potom nabídka.
- Simulace: Nová logika (sloty v `campaign`, strategie výběru bonusů z B22). Měřit hody a minuty do 100 / 305 / 500 m s bonusy a bez nich po profilech a modelech, podíl hráčů, kteří mají při 500 m obsazené oba sloty, a rozdíl slabý × expert. *Hypotéza:* se dvěma sloty a strategií „nejlepší bonus podle náhledu“ klesne průměrný hráč z 23 na 19–21 hodů do 500 m a slabý z 31 na 25–28 (bonusy pro slabší ruku pomáhají víc). Poměr hodů slabý / expert klesne z ~2,1 na 1,7–1,9. Softlock 0 %. Pokud průměrný klesne pod 18 hodů, posunout 2. slot na 500 m.
- Náročnost implementace: M (logika S, stránka a save v4 M)

### B02 — Karta bonusu: náhled na tvém hodu a jedna zkouška zdarma
- Typ: Systém
- Kde: Bonusy
- Mechanika: Každý bonus v katalogu má kartu se třemi prvky:
  1. **Duch dráhy:** stejný výpočet jako D01 a E10. Medián síly a úhlu z posledních 5 hodů aktuálního modelu, pasivní let `createFlight` + `step` s `events=[]` pro současnou výbavu a pro výbavu s tímto bonusem. Dva oblouky a rozdíl v metrech. Pro bonusy, jejichž účinek pasivní let nezachytí (B05, B06, B11, B12, B10), se k pasivnímu letu přidá přehrání s hráčovými uloženými odchylkami QTE (D16): „Z tvých posledních 8 událostí by s Ostrou hranou 2 vyšly méně, zbylé o 25 % silněji: odhad +18 m.“
  2. **Kdy se hodí / kdy škodí:** dvě věty generované z matice výhodnosti (B22), např. „Pomáhá Kluzáku a hráči, který trefuje události. Šipce bere asi 2 %.“
  3. **Zkouška:** jeden normální hod se zamčeným bonusem zdarma (bez mincí, rekordu a `attempts`, scéna označená „ZKOUŠKA“). Navazuje na D17, rozdíl je v tom, že se zkouší *jiný let*, ne další úroveň.
- Úrovně a cena / podmínka odemčení: zdarma, od odemčení 1. slotu. Jedna zkouška na bonus.
- Proč je hra zábavnější: Volba musí být předvídatelná (Compton, `03 §2.5`, H) a informace k rozhodnutí je jádro „zajímavých rozhodnutí“ (Meier podle anotace, `03 §2.5`, H, neověřeno). Horizontální možnost bez kontextu působí zbytečně (`03 §2.4`, H). Karta dodá kontext z hráčových vlastních dat. Feedforward u volitelných výzev (`04 N11`, V/H).
- Pocit „chci a potřebuju“: Přesně ten, který zadání chce: hráč vidí *předem* na svém hodu, co bonus dá i co vezme. „Hedvábný papír: tvůj kluzák +34 m, tvoje šipka −6 m.“
- Rizika a etika: Odhad musí počítat s mediánem, ne s nejlepším hodem, a musí uvádět i ztrátu (`02 §4.3` bod 3). Žádné „skoro!“ ani „kup hned“. Po zkoušce jen neutrální „Odemknout / Zpět“ (`02 §4.3` bod 6). Pokud hráč nemá data (méně než 5 hodů modelem), karta to řekne a ukáže výchozí sílu 0,75.
- Simulace: Strategie „náhled“ v B22: bot vybere do slotů bonusy s největším odhadem podle stejného výpočtu (pasivní let + vlastní odchylky QTE). *Hypotéza:* „náhled“ bude do 5 % od orákula (výběr podle skutečného průměru 200 letů) a o 10–20 % lepší než náhodný výběr. Prožitek („rozumím, co bonus dělá“) jen playtest: test pozná po letu, co se změnilo? (`01 N3`). Nárok: nová logika (strategie), funkce náhledu je čistá.
- Náročnost implementace: M

---

## 2. Bonusy s kompromisem (jádro katalogu)

### B03 — Zátěž ve špičce
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Papír)
- Mechanika: `speed × 1,10`, `glide × 0,82`. Kancelářská sponka na nose: vlaštovka vyletí rychleji, ale hůř plachtí. Sonda: šipka +7–8 % v raném stavu, +3–4 % ve středním, +1–3 % v pozdním. Kluzák −2 až −6 % ve všech stavech. Vizuál: sponka na špičce, delší rovný úsek dráhy a strmější sestup.
- Úrovně a cena / podmínka odemčení: Nabídka při 100 m jako jedna ze dvou voleb zdarma (B20), jinak 120 ◈.
- Proč je hra zábavnější: Je to nejčistší kompromis „rychlost proti klouzavosti“, který dělí role modelů místo toho, aby je sjednocoval (`03 §2.4`, H). Volba je situační (patří k šipce) a osobní (hráč šipky), což jsou znaky smysluplné volby (`03 §2.5`, Compton, H). Doplňuje D07: tam je výbava modelu vertikální úroveň, tady je to volba s cenou.
- Pocit „chci a potřebuju“: „Mám rád šipku, ale přijde mi slabá.“ Náhled ukáže delší oblouk šipky a kratší oblouk kluzáku se stejným bonusem, takže hráč vidí obě strany.
- Rizika a etika: Výhoda šipky klesá s úrovněmi (glide ×0,82 škodí víc, když je papír vysoko). Hráč, který šipku vylepší, ho může odložit, a to je v pořádku. Text nesmí slibovat „víc doletu“ obecně, jen „rychlejší výhoz, kratší plachtění“.
- Simulace: Jen parametr (`speed`, `glide`). Měřit podíl hodů šipkou u strategie „lepší model“ s bonusem a bez něj a hody do 500 m u strategie „šipka“. *Hypotéza:* strategie „šipka + Zátěž“ zrychlí kampaň šipky o 1–2 hody a podíl šipky u „lepšího modelu“ stoupne o 10–20 p.b. Kluzák s Zátěží bude horší ve všech stavech, takže strategie B22 ho tam nedá.
- Náročnost implementace: S

### B04 — Hedvábný papír
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Papír)
- Mechanika: `speed × 0,90`, `glide × 1,25`. Tenký papír: pomalejší výhoz, delší klouzání. Sonda: kluzák +5 až +9 % ve všech stavech a profilech, šipka −5 až 0 %. Synergie s Římsou (B08) a s Ostrou hranou (B06), viz tabulka B. Prodlužuje let (kluzák střední stav 44 → 49 s).
- Úrovně a cena / podmínka odemčení: Druhá z voleb zdarma při 100 m (B20), jinak 120 ◈.
- Proč je hra zábavnější: Zrcadlo B03. Dvojice dává hráči při odemčení Kluzáku jasnou otázku: „Komu dám kapsu, šipce, nebo kluzáku?“ Je to rozhodnutí s osobním vkusem, ne s jedinou správnou odpovědí (`03 §2.5`, H; `01 N3`, V).
- Pocit „chci a potřebuju“: „Kluzák plachtí krásně, ale chci ho nechat letět ještě dál.“ Náhled ukáže delší klouzavou část a odhad v metrech (střední stav ~+35 m).
- Rizika a etika: **Délka letu.** Klouzavé bonusy prodlužují let v reálném čase (`01 §0`, `05 §0.1`: po 500 m ~60 s na hod). Karta proto uvádí i „let o ~5 s delší“. Synergie s Římsou a Papírem z Dílny se násobí, takže v pozdní fázi hlídat dominanci.
- Simulace: Jen parametr. Měřit dolet a sekundy letu na hod po stavech. *Hypotéza:* kluzák + Hedvábí bude nejlepší kombinace v ≥ 50 % situací s kluzákem, ale ne ve všech (Lamely v raném stavu u slabého, Ostrá hrana u experta jsou srovnatelné). P90 délky letu do 500 m zůstane pod 60 s. Pokud ne, snížit na glide ×1,2.
- Náročnost implementace: S

### B05 — Ocasní ploška (jistota)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Přehyb)
- Mechanika: `window × 1,5`, `qte × 0,92`. Okna poryvu a holuba jsou o polovinu širší, každý zásah dá o 8 % méně. Sonda: úspěšnost QTE slabého hráče 77 → 93 %, jeho dolet +2 až +5 %. Průměrný hráč 0 %, expert −2 až −5 %. Ve hře se rozšíření ukáže přímo na časovacím kruhu (širší zelená výseč), stejně jako navrhuje D04.
- Úrovně a cena / podmínka odemčení: 120 ◈, nabídne se po prvním letu, ve kterém hráč minul ≥ 2 události.
- Proč je hra zábavnější: Je to transparentní, hráčem zvolená pomoc, ne skrytá DDA (`04 N4`, `04 N5`, H/N). Úspěšnost slabého hráče se dostane do pásma 70–90 % pro začátečníky (`04 N6`, V/N), ale za cenu menšího výnosu, takže expert ji nevezme. Volba je situační podle dovednosti, což dnešním přehybům chybí (`README P8`).
- Pocit „chci a potřebuju“: „Holubi mi pořád utíkají.“ Karta ukáže na hráčových posledních událostech, kolik by jich vyšlo navíc („3 z 8“), a pravdivě i to, že každý zásah dá o 8 % méně.
- Rizika a etika: Nesčítat s dalším rozšířením oken bez stropu. Pokud vznikne D04 (Křidélka), součin oken omezit na ×1,8, jinak okno pokryje většinu pruhu a QTE ztratí smysl. Pozor na plující střed (DQ-01): širší okno snižuje tlak na čtení kruhu, ale to je u volitelné pomoci přijatelné. Nesmí být nutnost: kdo nechce, má asistence zdarma (DQ-13).
- Simulace: Jen parametr (`window`, `qte`), simulátor QTE už modeluje. Měřit úspěšnost QTE a dolet po profilech. *Hypotéza:* slabý +3–6 % doletu a −1 až −3 hody do 500 m, expert −3 až −5 %. Racionální volba se láme mezi slabým a průměrným hráčem. Ověřit spolu s DQ-18 (odpuštění předčasného stisku), které může přínos Plošky snížit.
- Náročnost implementace: S

### B06 — Ostrá hrana (na hraně)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Přehyb)
- Mechanika: `window × 0,6`, `qte × 1,25`. Ostře nalomený přehyb: užší okna, ale každý zásah dá o 25 % víc. Sonda: expert +5 až +25 % (roste s počtem událostí, pozdní kluzák +16–25 %), průměrný −2 až +5 %, slabý −1 až −5 % a jeho úspěšnost klesne ze 76 na 52 %. Časovací kruh ukazuje užší výseč s ostrým okrajem.
- Úrovně a cena / podmínka odemčení: 150 ◈, nebo zkouška „5 perfektních zásahů v jednom letu“ (navazuje na DQ-17).
- Proč je hra zábavnější: Volba riziko × odměna, kterou si dobrý hráč přidá sám místo užších oken pro všechny (`04 N10`, `README P14`, V/N). Odměna je vázaná na výkon (`README P1`, Kao 2024, V). Zvyšuje podíl zásluhy hráče na výsledku (`03 N8`, `README P7`). Je to horizontální obdoba DQ-09 (Bouřkový pilot): ten mění prostředí, Ostrá hrana mění samotnou vlaštovku a platí v každém letu.
- Pocit „chci a potřebuju“: Touha experta „trefuju skoro všechno a hra mi to nevrací“. Karta ukáže odhad z hráčových odchylek: „Z tvých posledních 10 událostí by v užším okně vyšlo 9, s Hranou bys letěl asi o 41 m dál.“ Slabšímu hráči ukáže stejně pravdivě opak.
- Rizika a etika: Riziko dominance v pozdní fázi u kluzáku a experta (+25 % je víc než úroveň Dílny). Proto matice B22 musí mít fáze a možný strop („účinek se počítá jen pro prvních 6 událostí letu“). Užší okno zvyšuje vliv latence zařízení (`README P15`), proto doporučit spolu s kalibrací (DQ-15). Neoznačovat slabšího hráče („na to nemáš“), karta mluví jen o číslech.
- Simulace: Jen parametr. Měřit dolet, úspěšnost a podíl perfektních zásahů po profilech a fázích, a jak se mění rozdíl slabý × expert. *Hypotéza:* expert +8–15 % a −2 až −4 hody do 500 m, slabý −3 až −5 %. Racionální volba se láme mezi průměrným a dobrým hráčem. Pozdní kluzák s Hranou a Hedvábím nesmí překročit +35 % proti stavu bez bonusu (tabulka B: +28,7 % ve středním stavu). Jinak strop na počet událostí.
- Náročnost implementace: S

### B07 — Pružinový katapult (pevná síla)
- Typ: Bonus (+ asistenční varianta)
- Kde: Bonusy (slot, kategorie Výhoz)
- Mechanika: Nabíjení síly se vypne a každý hod má sílu přesně **0,85** („Silný hod“). Úhel míří hráč dál. V UI se místo kosinového ukazatele zobrazí natažená pružina, hod jedním klepnutím. Sonda: slabý +19–21 %, průměrný +7–8 %, expert −5 %. **Asistenční varianta bez slotu** (nastavení, sekce Asistence): pevná síla 0,70, slabý +10 %, průměrný 0 %, expert −11 %.
- Úrovně a cena / podmínka odemčení: Slotový bonus 100 ◈ od 100 m. Asistence zdarma od začátku.
- Proč je hra zábavnější: Ukazatel síly je dnes slabá dovednost (perfektní síla ±198 ms, rozdíl 0,93 → 1,0 dělá +3,6 %; `README P8`, `03 §0.1`). Pro hráče, kterého nabíjení frustruje, je katapult volba „jistota místo stropu“: přijde o možnost perfektního hodu a o Švih (DQ-04), ale už nikdy nehodí slabě. Asistence bez slotu plní pravidlo přístupnosti „alternativa k přesnému časování“ (GAG, XAG, `README P15`, H).
- Pocit „chci a potřebuju“: „Pořád mi ujede síla a hod je k ničemu.“ Karta ukáže hráčovu průměrnou sílu z posledních 10 hodů („58 %“) a co by s pružinou bylo („vždy 85 %: +46 m“). Expertovi stejně pravdivě ukáže ztrátu.
- Rizika a etika: Riziko „povinného“ bonusu pro slabé hráče a snížení zásluhy. Proto existuje i bezplatná asistence a rozpis (B21) ukazuje „síla pružinou“ zvlášť. Hranice mezi bonusem a asistencí je otevřená otázka 4. Pokud vznikne D03 (Vyvážení), překrývá se: katapult je volba „pevně“, Vyvážení „odpuštění“. Nemají se sčítat (stejná kategorie Výhoz pro případnou slotovou verzi Vyvážení).
- Simulace: Jen parametr (síla v `flyOnce` pevně 0,85). Měřit hody do 500 m po profilech a vliv na rozdíl slabý × expert. *Hypotéza:* slabý −4 až −7 hodů (z 31), průměrný −1 až −2, expert ho nevezme. Poměr slabý / expert se sníží pod 1,8. Pokud slabý s katapultem předběhne průměrného bez něj, snížit na 0,80.
- Náročnost implementace: S

### B08 — Římsa (výš, ale bez rozběhu)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Výhoz)
- Mechanika: Start o **6 m výš** (`y = 12 + 6`, okenní římsa nad dílnou), ale síla je **omezená na 0,75**, protože se na římse nedá rozmáchnout (`charge = min(charge, 0,75)`). Sonda: kluzák slabý +15–20 %, průměrný +13–17 %, expert +2–5 %. Šipka slabý +8–15 %, průměrný +5–11 %, expert −2 %. Synergie s Hedvábím (tabulka B: +3,8 p.b.).
- Úrovně a cena / podmínka odemčení: 150 ◈, od Tržnice (305 m). Pokud vznikne D05 (Vyšší patro), Římsa se přidá k patru a strop síly zůstane.
- Proč je hra zábavnější: Je to horizontální podoba čitelné synergie „výška × klouzavost“ (`01 §0`, pravidlo 1). Kompromis je viditelný v ruce: hráč cítí, že nabití nad 75 % nic nepřidá, a vidí vyšší start. Situační volba podle modelu a dovednosti (`03 §2.5`, H).
- Pocit „chci a potřebuju“: „Kluzák v půlce letu nemá z čeho klouzat.“ Náhled ukáže oblouk z vyššího startu a zároveň čárku stropu na ukazateli síly. Hráč s perfektní silou vidí, že by přišel o 25 % síly.
- Rizika a etika: S Patrem (D05) a Hedvábím (B04) může být kluzák příliš silný a let příliš dlouhý. Hlídat kombinaci. Diegetická kresba římsy ve 4 vizuálních stylech (náklad). Strop síly nesmí působit jako trest: text „Z římsy se nedá rozmáchnout“, ne „síla −25 %“.
- Simulace: Nový parametr `height` (jedna řádka v `createFlight`, stejně jako D05) a strop síly v `flyOnce`. *Hypotéza:* kluzák + Římsa je pro slabého a průměrného hráče nejlepší volba kategorie Výhoz, pro experta ne (tam vyhraje prázdný slot nebo jiná kategorie). Hody do 500 m −1 až −3 u slabého. P90 délky letu do 500 m < 60 s.
- Náročnost implementace: S (logika), M (kresba římsy)

### B09 — Expresní hrot (jen Šipka): kratší let, skoro stejný dolet
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Model)
- Mechanika: Platí jen pro Šipku. `ideal − 4°`, `speed × 1,08`, `cruise × 1,3`. Plošší, rychlejší hod s rychlejším plachtěním. Sonda: dolet 0 až −6 %, **délka letu −20 až −25 %** (střední stav průměrného hráče 25 → 20 s, pozdní 40 → 31 s), průměrná rychlost 15 → 18–19 m/s. Události přicházejí po stejných časech, takže na let jich připadne o něco méně.
- Úrovně a cena / podmínka odemčení: 150 ◈, od 500 m (kdy lety začínají být dlouhé, `05 §0.1`).
- Proč je hra zábavnější: Je to kompromis mezi doletem a tempem, tedy mezi dvěma motivacemi hráče: „chci co nejdál“ proti „chci víc hodů za minutu“. Délka letu v reálném čase je skryté riziko vyšších úrovní (`01 §0`, `05 §0.1`: po 500 m ~60 s na hod). Je to horizontální odpověď místo globálního zrychlení. Plochý úhel dává šipce jiný pohyb ruky, tedy novou roli (`03 §2.4`, H). Navazuje na D11 (Střela) a E07 (Aerodynamika), ale bez nového modelu a bez větru.
- Pocit „chci a potřebuju“: „Šipka po 500 m letí skoro minutu a já se nudím.“ Karta ukáže dva údaje vedle sebe: „−9 m, ale let o 9 s kratší“.
- Rizika a etika: **Nikdy nezvyšovat `ideal` šipky** (tabulka C: +26–41 % zadarmo). Tady se `ideal` snižuje, což je bezpečné. Kratší lety zrychlují tempo hodů, a tím i příjem mincí za minutu. To je potřeba sledovat, ale není to retenční trik, protože počet hodů do cíle se nemění.
- Simulace: Jen parametr (`ideal`, `speed`, `cruise`, `model:'dart'`). Měřit **minuty** (ne hody) do cílů po 500 m a sekundy letu na hod. *Hypotéza:* hody do 914 m +0 až +2, minuty −10 až −20 %. Pokud hody vzrostou o víc než 3, zmírnit na `speed × 1,1`.
- Náročnost implementace: S

### B10 — Lamely (jen Kluzák): plachtění místo událostí
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Model)
- Mechanika: Platí jen pro Kluzák. `glide × 1,2`, `qte × 0,75`. Pevnější odtokové lamely: kluzák plachtí lépe sám, ale z poryvů a holubů vytěží o čtvrtinu méně. Sonda: raný stav +3 až +8 % (slabý nejvíc), střední +1 až +5 %, pozdní +1 až −4 % (s víc událostmi ztrácí).
- Úrovně a cena / podmínka odemčení: 120 ◈, od 100 m spolu s Kluzákem.
- Proč je hra zábavnější: Volba „pasivní let proti aktivní hře“ se mění s fází hry a s dovedností. To je přesně situační volba, kterou Pecorella doporučuje proti dominanci (`03 §2.2`, H) a Compton jako nezřejmou (`03 §2.5`, H). Pro hráče s horším časováním (latence, motorika, `README P15`) dává legitimní cestu, kde QTE tolik nerozhodují. Je to horizontální obdoba Albatrosa (D09) bez nového modelu.
- Pocit „chci a potřebuju“: „Události mi nejdou, ale kluzák mě baví.“ Karta ukáže dvě čísla: plachtění +X m, z událostí −Y m (odhad z hráčových dat).
- Rizika a etika: Snižuje podíl dovednosti (`03 N8`). Proto ji B21 ukazuje zvlášť a nesmí být nejlepší pro experta. Prodlužuje let (glide ×1,2).
- Simulace: Jen parametr. *Hypotéza:* Lamely jsou pro slabého hráče do 300 m nejlepší bonus kluzáku (lepší než Hedvábí), po 500 m je předstihne Hedvábí nebo Hrana. Volba se tedy během kampaně mění. Strategie „přehodnocovat výbavu každých 5 hodů“ bude o 1–2 hody rychlejší než „zvol jednou“ (B22). Pokud ne, Lamely nepřinášejí rozhodnutí a vypadnou.
- Náročnost implementace: S

### B11 — Klidný let / Rušná obloha (styl letu)
- Typ: Bonus (dvě varianty jedné karty)
- Kde: Bonusy (slot, kategorie Přehyb)
- Mechanika: Dvě protichůdné varianty, hráč vybaví nanejvýš jednu (stejná kategorie):
  - **Klidný let:** nejvýš 5 událostí za let (`TIMING.maxEvents` 10 → 5), mezery mezi nimi ×1,8, účinek každého zásahu ×1,4. Sonda: raný a střední stav +3 až +10 %, pozdní −2 až +3 %.
  - **Rušná obloha:** mezery ×0,55, účinek ×0,85. Víc akce, každá méně vydatná. Sonda: raný a střední stav 0 až +3 %, pozdní kluzák −2 až −8 %.
  - První událost zůstává v 1,5 s v obou variantách, protože poryv ve stoupání má největší účinek (tabulka C).
- Úrovně a cena / podmínka odemčení: Obě za 80 ◈, od 305 m. Před tím jsou vidět s náhledem.
- Proč je hra zábavnější: Jde o volbu podle vkusu, ne podle síly. Očekávaný přínos je blízko nuly, mění se rytmus letu. Hráč s typem Submission/„pohodový let“ a hráč s typem Challenge chtějí jiné věci (MDA, `01 N8`, H/N). Rozdílné potřeby nováčka a zkušeného (`README P14`, V). Variace rytmu brání habituaci (`08 N6`, H/N).
- Pocit „chci a potřebuju“: „Let je pořád přerušovaný“ nebo naopak „v klouzání se nic neděje“. Karta ukáže ve stejném letu značky událostí na časové ose pro obě varianty.
- Rizika a etika: Klidný let s účinkem ×1,7 v první sondě dával až +54 % a lety přes 2 minuty. Proto ×1,4 a strop 5 událostí. Rušná obloha s plujícím středem (DQ-01) může být pro slabého hráče stresující, ale je dobrovolná.
- Simulace: Nová logika (malá: `maxEvents`, násobek `gap` a `qte` z výbavy v `createEvents`/`resolve`). Měřit dolet, počet událostí na let, sekundy letu. *Hypotéza:* obě varianty do ±5 % od stavu bez bonusu v průměru kampaně. Pokud některá vyjde > +8 % pro všechny profily, přestává být „vkus“ a je potřeba ji ztlumit. Hlavní ověření je playtest (otázka „Který let tě bavil víc a proč?“).
- Náročnost implementace: S

### B12 — Vábnička (holubí zob / větrník)
- Typ: Bonus (dvě varianty)
- Kde: Bonusy (slot, kategorie Přehyb)
- Mechanika: Při `createEvents` se typ události losuje s pravděpodobností 75 % ve prospěch zvoleného typu (dnes 50 %). Pravidlo „nejvýš dvakrát po sobě stejný typ“ platí jen pro neupřednostněný typ. **Holubí zob** přitahuje holuby, **Větrník** poryvy. Sonda (bez rozdílu dovednosti mezi typy): kluzák s poryvy +3 až +6 %, kluzák s holuby −3 až −7 %, šipka ±2 %. Holub je cennější nízko, poryv vysoko (tabulka C).
- Úrovně a cena / podmínka odemčení: 60 ◈ každá, od 305 m.
- Proč je hra zábavnější: Hráči mají různou úspěšnost v poryvu (klepnutí v čase) a v holubovi (držení). Holub jde podle KB 06 odměřit naslepo s úspěšností ~96–99,9 % (`README P9`). Vábnička dovolí stavět na tom, co hráčovi jde, což je osobní volba (`03 §2.5`, H). Volba navíc souvisí s modelem (kluzák s poryvy), takže vzniká malá synergie bez nových čísel.
- Pocit „chci a potřebuju“: „Holubi mi jdou, poryvy ne.“ Karta ukáže hráčovu úspěšnost zvlášť pro poryv a holuba z posledních 20 událostí a odhad pro obě varianty.
- Rizika a etika: Pokud vznikne plující střed (DQ-01) jen pro poryv, Holubí zob se stane únikem z dovednosti. To je v pořádku jako volba, ale matice B22 to musí ukázat. Malý efekt může působit jako „zdánlivá volba“ (`01 N3`), proto nízká cena.
- Simulace: Nová logika (malá: váha typu v `createEvents`) a **rozšíření profilů** o oddělený šum pro poryv a holuba (`qteGust`, `qteBird`; dnes jeden `qte`). *Hypotéza:* u hráče s 2× horším šumem v poryvu dá Holubí zob +4–8 %, u symetrického hráče ±2 %. Pokud ani asymetrický hráč nezíská > 3 %, bonus vypadne nebo se sloučí s B11.
- Náročnost implementace: S

### B13 — Pokladnička (mince místo metrů)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Mince)
- Mechanika: `speed × 0,93` (pokladnička v trupu je těžká) a odměna `reward(f) × 1,25`, zaokrouhleno dolů. Sonda: dolet −7 až −12 %, mince za hod +12 až +19 % (odměna je 10 + dolet/10, takže kratší let část zisku sebere). Ve výsledku je řádek „Pokladnička +9 ◈“.
- Úrovně a cena / podmínka odemčení: 100 ◈, od 500 m a **jen pokud existuje využití mincí po 500 m** (E06, E07, E19, SV22). Bez něj karta odpadá (`02 N6`).
- Proč je hra zábavnější: Klasický kompromis „teď proti později“: hráč obětuje rekord pro rychlejší nákup. Rozhodnutí je časové („teď šetřím na Římsu, potom Pokladničku sundám“), takže se výbava mění během hry. Mince zůstávají deterministickým důsledkem výkonu (`02` kap. 1 bod 10, `README P12`).
- Pocit „chci a potřebuju“: „Chybí mi 60 ◈ na další úroveň.“ Karta ukáže pravdivě obě strany: „+7 ◈ za hod, −28 m za hod“ a „další nákup o 1 hod dřív“ (navazuje na E09).
- Rizika a etika: Riziko, že mince začnou být cílem místo prostředku (`01 N1`, `README P12`). Proto skromný efekt a žádné oslavné animace u řádku Pokladničky. Rozpočtová neutralita podle `05 §0.2`: pokud zvedne příjem průměrného hráče o víc než 10 % za *minutu*, snížit na ×1,2.
- Simulace: Jen parametr (násobek odměny v `campaign` už existuje jako `rewardMul`, k tomu `speed`). Strategie: „Pokladnička, dokud chybí na nákup > 1 hod, pak sundat“. *Hypotéza:* do 500 m neutrální (±1 hod), po 500 m se sinky zkrátí cesta k plnému nákupu o 5–10 %, ale ne cesta k místům. Pokud zkrátí cestu k místům, je dominantní a vypadne.
- Náročnost implementace: S

---

## 3. Struktura výbavy: kategorie, synergie, sestavy

### B14 — Kategorie a viditelné synergie
- Typ: Systém
- Kde: Bonusy
- Mechanika: Každý bonus má právě jednu kategorii: **Papír** (B03, B04, B18), **Přehyb** (B05, B06, B11, B12), **Výhoz** (B07, B08, B17), **Model** (B09, B10), **Mince** (B13, B16). Ve slotech smí být **nejvýš jeden bonus z kategorie**. Synergie se nepřidávají jako bonus navíc. Hra jen ukáže emergentní synergie, které plynou z fyziky, a to štítkem na kartě a v náhledu dvojice (B02 počítá obě najednou):
  - „Výška × klouzavost“: Římsa + Hedvábí (sonda +3,8 p.b. nad součet),
  - „Klouzavost × poryv“: Hedvábí + Ostrá hrana (+5,6 p.b.),
  - „Proti sobě“: Zátěž + Hedvábí se ruší (stejná kategorie, nelze), Římsa + Katapult se překrývají (stejná kategorie, nelze).
  - Varianta k simulaci: pojmenované sady se skutečným bonusem +3 % (např. „Plachtař“ = Hedvábí + Lamely). Výchozí doporučení je **bez** umělých sad.
- Úrovně a cena / podmínka odemčení: Bez ceny, součást B01.
- Proč je hra zábavnější: Pravidlo jedné kategorie brání tomu, aby se do slotů naskládaly tři varianty téhož čísla. Každý slot tak znamená jinou otázku (jak letí papír, jak se chová v událostech, jak hážu). Odpovídá to principu „každá větev mění jednu čitelnou věc“ (komentář v `config.js`, `README P8`). Emergentní synergie dávají hráči objev („když mám římsu, hedvábí najednou táhne“) bez dalších čísel. To je horizontální „chytré použití“ možností (`03 §2.4`, H). Bez umělých sad se nehromadí násobiče, které by zvětšily rozdíl mezi optimem a zbytkem (`03 §2.5`: LtF3 a dominantní strategie, H).
- Pocit „chci a potřebuju“: „Mám Hedvábí, co k němu?“ Karta Římsy u hráče s Hedvábím ukáže štítek „Synergie: výška × klouzavost“ a náhled dvojice, ne jen samotné Římsy.
- Rizika a etika: Synergie mohou vytvořit dominantní sestavu (Hedvábí + Hrana + Římsa u kluzáku). Matice B22 to musí hledat. Štítek se ukazuje jen tam, kde je synergie skutečně změřená (≥ 2 p.b.), jinak by byl klamavý.
- Simulace: Nová logika (výběr sestavy z kombinací, B22). Měřit pro všechny dvojice a trojice povolené pravidlem kategorie rozdíl „skutečnost − součet“. *Hypotéza:* jen 2–4 dvojice mají synergii ≥ 2 p.b. a žádná trojice není v top 1 ve víc než 40 % situací. Varianta s umělými sadami zvětší rozdíl nejlepší / mediánové sestavy o 3–5 p.b., proto ji nedoporučuji.
- Náročnost implementace: S

### B15 — Sestavy a volba při míření
- Typ: Systém
- Kde: Bonusy, Let (obrazovka míření)
- Mechanika: Hráč si na stránce Bonusy uloží až **3 sestavy** (sloty + model), např. „Šipka rychlá“, „Kluzák daleko“. Na obrazovce míření je pod tlačítkem hodu řádek čipů se sestavami. Klepnutí přepne model i výbavu. Úprava jednotlivých bonusů je jen na stránce Bonusy, aby míření zůstalo čisté. Pod čipem je jednořádková předpověď z B02: „Tvůj typický hod: ~340 m · ~38 s“. Save: `p.bonus.sets: [{name, model, slots}]`.
- Úrovně a cena / podmínka odemčení: Zdarma, od 2. slotu (dřív není co ukládat).
- Proč je hra zábavnější: Přesouvá volbu do okamžiku *před hodem*, kde má smysl (vítr B18, ohlášený cíl B16, zakázka B19). Kompromis je pak volba pro tento hod, ne past na celou hru. Snižuje tření, protože bez sestav by hráč musel před každým hodem chodit do jiné stránky (Compton: volba, která se volí téměř vždy stejně, je tření, `03 §2.5`, H).
- Pocit „chci a potřebuju“: „Chci zkusit šipku s hrotem, ale nechci pokaždé přeskládat kapsy.“ Jedno klepnutí a předpověď ukáže rozdíl hned.
- Rizika a etika: Obrazovka míření nesmí být přeplněná (`07`, mobil, texty v canvasu jsou dnes nečitelné, `README P15`). Proto jen čipy, žádné úpravy. Předpověď je odhad bez QTE, tak ji i označit. Pokud hráč nemá sestavy, řádek se nezobrazí.
- Simulace: Strategie „sestava podle situace“: před každým hodem bot zvolí z uložených sestav tu s nejlepší předpovědí (při větru podle větru). *Hypotéza:* oproti „jedna sestava celou hru“ ušetří 0–2 hody do 500 m. S větrem (B18) 2–4 hody za 500 m. Pokud bez větru ušetří < 1 hod, sestavy jsou jen pohodlí (to stačí, playtest).
- Náročnost implementace: M

---

## 4. Rozhodnutí před hodem a jednorázové bonusy

### B16 — Ohlášený cíl (výzva bez ztráty)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Mince), Let (míření)
- Mechanika: S vybaveným bonusem si hráč při míření může ohlásit jeden ze tří cílů, odvozených z mediánu `m` jeho posledních 5 hodů aktuálním modelem a výbavou:
  - **Jistota** ≥ 0,9 · m → +10 % mincí za hod,
  - **Výzva** ≥ 1,1 · m → +30 %,
  - **Odvaha** ≥ 1,25 · m → +60 %.
  - Cíl se ve scéně ukáže jako vlaječka. Splní-li ho hráč, dostane bonus mincí. Nesplní-li, dostane **běžnou odměnu bez srážky**. Bez ohlášení se hází normálně.
  - Hodnoty `m` a cílů se zaokrouhlí na 5 m a jsou vidět předem. Pokud cíl leží do 15 m od hranice místa, ukáže se hranice místo čísla („Zahrady na okraji“).
- Úrovně a cena / podmínka odemčení: 120 ◈, od 500 m, a jen pokud mince po 500 m mají využití (jako B13).
- Proč je hra zábavnější: Je to rozhodnutí před hodem, které má hráč v rukou: odhad vlastní formy. Odměna je deterministická a úměrná výkonu (`02` kap. 1 bod 10, V/N). Ambice se odměňuje, ale neúspěch nic nestojí, takže nejde o hrozbu ztráty (`02 §4.3` bod 5). Dává hodům po 500 m dílčí cíl, i když rekord je daleko (`README P6`, V). Navazuje na E12 (výzvy s omezením): tam jsou výzvy pevné, tady si je hráč volí sám podle své formy.
- Pocit „chci a potřebuju“: „Rekord je daleko, ale tenhle hod se mi cítí dobře.“ Vlaječka ve scéně ukazuje přesný cíl a odměnu dopředu.
- Rizika a etika: **Riziko podobnosti se sázkou.** Proto žádný vklad, žádná ztráta, žádné „double or nothing“, texty „Výzva“ a „Odvaha“, ne „sázka“. Cíle se počítají z mediánu, ne laděním k těsné prohře (`README P10`). Výsledek „chybělo 12 m“ jen jako pravdivá informace. U dětského publika zvážit, zda vůbec (otázka 7).
- Simulace: Nová logika (cíle z mediánu, výplata po `settle`). Bot volí úroveň s nejvyšší očekávanou výplatou podle vlastní historie úspěšnosti. *Hypotéza:* optimální volba se liší podle profilu (slabý s velkým rozptylem: Odvaha, protože neúspěch nic nestojí, expert s malým rozptylem: Výzva). Příjem +8–15 %. **Pokud je Odvaha optimální pro všechny, chybí cena za ambici a návrh selhal:** pak zavést cenu (např. Odvaha nedá běžný bonus Pokladničky), nebo bonus vyřadit. Zkontrolovat rozpočtovou neutralitu (`05 §0.2`).
- Náročnost implementace: M

### B17 — Rezervní arch (jednorázové zrušení hodu)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Výhoz), Let
- Mechanika: Do 0,6 s po vypuštění může hráč klepnout na „Chytit“: vlaštovka se vrátí do ruky a hod se nepočítá (`attempts` beze změny, žádné mince, žádné události). Bonus má **1 náboj**. Náboj se dobije po 3 započtených hodech (ne časem). Stav náboje je vidět na míření jako malý arch papíru.
- Úrovně a cena / podmínka odemčení: 80 ◈, od 305 m.
- Proč je hra zábavnější: Selhání má být levné (`04 N7`, Juul 2009, V/H). Dnes stojí nepovedený výhoz 15–40 s čekání (pozdní lety ~60 s, `05 §0.1`). Jednorázový náboj z toho dělá rozhodnutí: „je tenhle hod tak špatný, že ho stojí za to chytit, nebo si náboj nechám?“ Dobíjení hody místo času nevytváří „hraní podle schůzek“ (`02 §4.3` bod 4).
- Pocit „chci a potřebuju“: „Ujela mi ruka, vím to hned, a musím se dívat, jak to padá.“ Karta ukáže, kolik ze hráčových posledních 20 hodů bylo „slabých“ (síla < 0,5 nebo úhel o > 8° mimo) a kolik času na ně padlo.
- Rizika a etika: Může působit jako náprava, kterou by měla mít hra pro všechny. Pokud playtest ukáže, že ji chce každý, má být globální funkcí (otázka 9). Nesmí rušit QTE ani rekordy: chytit jde jen v prvních 0,6 s, kdy žádná událost neběží (první je v 1,5 s).
- Simulace: Nová logika (malá: v `campaign` opakovat hod, pokud bot zruší). Bot ruší, když síla < `mu − sigma` nebo chyba úhlu > 2σ a má náboj. *Hypotéza:* slabý −1 až −2 hody a −5 až −8 % minut do 500 m, expert ~0. Pokud zisk vyjde < 1 hod i u slabého, je to jen pohodlí a hodí se spíš jako globální funkce.
- Náročnost implementace: S

### B18 — Plachetka (citlivost na vítr)
- Typ: Bonus
- Kde: Bonusy (slot, kategorie Papír), Let (míření)
- Mechanika: **Jen pokud hra zavede vítr** (DQ-10 nebo D10). Plachetka násobí vodorovnou složku větru pro výpočet letu ×1,6 (`wind.x × 1,6` v `createFlight`, analogie `windK` z D11). Zadní vítr pomáhá víc, protivítr škodí víc. Sonda (střední stav, kluzák): vítr +1,5 m/s 354 → 382 m (+8 %), −1,5 m/s 265 → 240 m (−9 %). U šipky ±4 %. Vítr je vidět před hodem (rukáv, DQ-10), takže hráč volí *pro tento hod* přes sestavy (B15).
- Úrovně a cena / podmínka odemčení: 100 ◈, odemkne se první hod s větrem ≥ 1 m/s.
- Proč je hra zábavnější: Volba před hodem podle viditelné podmínky: „fouká do zad, beru plachetku“. Situační a předvídatelná podle Comptona (`03 §2.5`, H). Náročnost přes novou podmínku, ne užší okna (`04 N10`, V/N). Je to horizontální obdoba D10 (Stabilizátor): Stabilizátor tlumí škodu natrvalo, Plachetka zesiluje vítr a vyžaduje čtení.
- Pocit „chci a potřebuju“: „V zadním větru by to mohl být rekord.“ Při míření se u sestavy s Plachetkou ukáže předpověď s aktuálním větrem.
- Rizika a etika: Vítr nesmí být laděný podle blízkosti rekordu nebo místa (`02 §4.3` bod 3, D10). Rozpis (B21) musí ukázat „vítr ×1,6: +28 m“ zvlášť, aby hráč nepřipsal rekord jen sobě nebo jen štěstí (`README P7`). Pokud uživatel vítr nezavede, karta odpadá.
- Simulace: Parametr (`wind` v `createFlight`, dnes vždy 0) a strategie „sestava podle větru“ (B15). *Hypotéza:* s větrem U(−1,5; 1,5) dá Plachetka nasazovaná jen v zadním větru +3–5 % průměrného doletu a ~1 hod do 500 m. Nasazená vždy dá ±1 % (symetrie). Rozdíl potvrdí, že rozhodnutí před hodem má hodnotu.
- Náročnost implementace: S (s hotovým větrem)

### B19 — Dopis v kapse (zakázka zabírá slot)
- Typ: Bonus (systémové pravidlo pro zakázky)
- Kde: Bonusy, Let
- Mechanika: Pokud vzniknou zakázky (SV06, E13: „doruč dopis do zóny“), přijatá zakázka **zabere jeden slot** jako zvláštní předmět „Dopis“ s malou zátěží `glide × 0,95`. Dokud ho hráč nedoručí nebo neodloží (zdarma, kdykoli), má o slot méně. Doručení přidá odměnu ze SV06/E13 a uvolní slot.
- Úrovně a cena / podmínka odemčení: Podle zakázek (SV06 od 500 m).
- Proč je hra zábavnější: Dává zakázkám horizontální cenu: „vezmu dopis, nebo si nechám Ostrou hranu?“ Bez ní je zakázka jen další odměna navíc. Diegeticky dává smysl (vlaštovka nese dopis, `04` příběh pošty). Volba je dočasná a vratná.
- Pocit „chci a potřebuju“: „Chci doručit dopis do Zahrad, ale bez Hedvábí tam nedoletím.“ Karta zakázky ukáže náhled s výbavou bez jednoho slotu (B02).
- Rizika a etika: Nesmí vytvářet tlak „nedoručíš, přijdeš o…“. Dopis nepropadá, odložit ho jde bez ztráty (`02 §4.3` bod 5). Pokud hráč má jen 1 slot, zakázka slot nezabírá (jinak by blokovala nováčka).
- Simulace: Nová logika (závisí na SV06/E13). *Hypotéza:* doručení zakázky s jedním slotem méně trvá o 1–2 hody déle než bez pravidla. Pokud o víc než 4, zátěž zrušit nebo dopis přesunout mimo sloty.
- Náročnost implementace: S (nad hotovými zakázkami)

---

## 5. Odemykání, rozpis a vyvažování

### B20 — Katalog a odemykání bonusů (pořadí, ceny, první volba)
- Typ: Odemčení
- Kde: Bonusy
- Mechanika: Katalog **12–14 bonusů** přichází postupně („starting small“):

  | Okamžik | Nově viditelné / dostupné | Cena |
  |---|---|---|
  | 100 m (1. slot, Kluzák) | **volba zdarma** jednoho z dvojice Zátěž (B03) / Hedvábí (B04). Druhý zůstane v katalogu, Katapult (B07) a Lamely (B10) dostupné | druhý z dvojice 120 ◈, B07 100 ◈, B10 120 ◈ |
  | 305 m (2. slot) | Ocasní ploška (B05), Římsa (B08), Klidný let / Rušná obloha (B11), Vábnička (B12), Rezervní arch (B17) | 60–150 ◈ |
  | 2 minuté události v jednom letu | Ocasní ploška se nabídne v Dílně jednou větou (D16) | — |
  | 5 perfektních v jednom letu nebo 150 ◈ | Ostrá hrana (B06) | 150 ◈ / zkouška |
  | 500 m (3. slot) | Expresní hrot (B09), Pokladnička (B13) a Ohlášený cíl (B16), jen se sinky mincí | 100–150 ◈ |
  | vítr / zakázky | Plachetka (B18), Dopis (B19) | 100 ◈ / zdarma |

  - Ceny jsou **ploché** (bez škálování), protože bonus nemění měřítko, jen volbu. Celý katalog ~1 400–1 600 ◈. Před 500 m je k mání nejvýš ~900 ◈.
  - Alternativní cesty k odemčení (k simulaci): zkoušky (DQ-17) a razítka (E05).
- Úrovně a cena / podmínka odemčení: viz tabulka.
- Proč je hra zábavnější: Postupné odemykání drží první minuty jednoduché a přidává možnosti s rostoucí kompetencí (`README P14`, Raviv 2022 „starting small“, V). První volba zdarma okamžitě vytvoří osobní rozhodnutí (`01 N3`, V) a zároveň učí, co je kompromis. Bonusy po 500 m dávají mincím horizontální využití místo nekonečného vertikálního růstu (`03 N2`, H/N), ale konečné (`02 N6`).
- Pocit „chci a potřebuju“: Při 100 m hráč dostane konkrétní otázku „Komu dáš kapsu?“ se dvěma náhledy. Později každá nová položka katalogu přichází s problémem, který hráč zažil (minul události → Ploška, nudí ho dlouhý let → Expresní hrot).
- Rizika a etika: Bonusy soupeří s Dílnou o mince, takže zpomalí vertikální růst. Pokud by bonusy před 500 m zpomalily kampaň, jsou past, ne volba. Žádná náhodná nabídka, žádné „bonus dne“ (`02 §4.3` body 1 a 4). Katalog nesmí růst nekonečně (`03 §2.5`: LtF3).
- Simulace: Nová logika (nákup bonusů v `shop()` vedle úrovní, strategie „bonus nejdřív“, „Dílna nejdřív“, „podle náhledu“). Měřit hody do 500 m, mezery mezi nákupy (`02 N5`, práh 5 hodů), zůstatek mincí při 500 m. *Hypotéza:* „podle náhledu“ je do 5 % od nejrychlejší strategie. „Bonus nejdřív“ není o víc než 1,3× pomalejší než nejrychlejší (dnes přehyby napřed 1,64×). Nejdelší mezera mezi nákupy před 500 m ≤ 5 hodů.
- Náročnost implementace: M

### B21 — Rozpis bonusů ve výsledku
- Typ: Systém
- Kde: Výsledek
- Mechanika: Navazuje na D02 a DQ-16 (rozpis „tvůj hod / vlaštovka / události“) a přidá řádek za každý vybavený bonus. Výpočet: po dopadu se let deterministicky přehraje se stejným seedem, úhlem, silou a **zaznamenanými vstupy** (časy stisků relativně k událostem) bez daného bonusu. Rozdíl doletu je přínos bonusu. U bonusů s oběma stranami se ukážou obě: „Ostrá hrana: +38 m z účinku, 1 poryv minut kvůli užšímu oknu (−14 m) → celkem +24 m.“ Záporný výsledek se ukáže stejně věcně: „Zátěž ve špičce s kluzákem: −11 m.“
- Úrovně a cena / podmínka odemčení: Zdarma, od prvního letu s bonusem. Detail po klepnutí, v základu jedna řádka.
- Proč je hra zábavnější: Bez rozpisu hráč nepozná, co bonus udělal, a volba je zdánlivá (`01 N3`, V). Přičitatelnost: co udělal hráč, co výbava a co náhoda (`README P7`, N s nepřímou oporou). Pravdivá informativní zpětná vazba (`README P1`, V). Hráč se tak učí kompromisy z vlastních letů a výběr výbavy se zlepšuje, místo aby hádal.
- Pocit „chci a potřebuju“: „Stojí Lamely vůbec za to?“ Po pěti letech hráč ví, že mu přinášejí +20 m v klouzání a berou 15 m z holubů.
- Rizika a etika: Nesmí zahltit výsledek (`README R-N9`): jedna řádka, detail na klepnutí. Čísla musí být přepočtená, ne odhadnutá. Přehrání se zaznamenanými vstupy musí být deterministické (fyzika je deterministická podle seedu, `CLAUDE.md`). Pokud bonus mění události (B11, B12), přehrání bez bonusu má jiné události a vstupy na ně nejdou přenést. Pak ukázat jen odhad a označit ho jako odhad.
- Simulace: Monte Carlo může rozpis spočítat pro každý hod a hlásit průměrný podíl bonusů na doletu po profilech a fázích. *Hypotéza:* podíl bonusů na doletu průměrného hráče bude 5–15 %, nikdy přes 25 %. Pokud přes 25 %, bonusy přebíjejí Dílnu i dovednost (`03 N8`). Prožitek jen playtest: umí hráč říct, co mu bonus dal?
- Náročnost implementace: M

### B22 — Matice výhodnosti (kritérium proti dominanci)
- Typ: Systém (návrhové a simulační kritérium, ne funkce hry)
- Kde: Bonusy (podklad pro B02 a ladění)
- Mechanika: Pro každý bonus `b` a situaci `s` = profil (4) × model (2) × fáze (raná / střední / pozdní / po 500 m) × vítr (bez / zadní / protivítr, pokud vznikne) se spočítá Δ doletu (a Δ minut) proti prázdnému slotu. Pak pro každou kategorii a každou situaci pořadí bonusů. **Kritéria přijetí katalogu:**
  1. Každý bonus je v top 1 své kategorie aspoň v jedné situaci, která pokrývá ≥ 10 % populace (jinak vypadne nebo se přeladí).
  2. Žádný bonus není v top 1 své kategorie ve víc než 60 % situací (jinak je dominantní).
  3. Ve většině situací je Δ v pásmu −10 až +20 %. Výjimky (Katapult u slabého, Hrana u pozdního experta) musí být vědomé.
  4. Nejlepší povolená sestava (2 nebo 3 sloty) dá ≤ +35 % proti prázdným slotům.
  5. Poměr hodů do 500 m slabý / expert se proti dnešku nezvětší.
  6. Počet sestav do 5 % od optima je v typické situaci ≥ 3 (měřítko „nezřejmé volby“, převzato z E11).
  - Strategie bota pro výbavu: *nic*, *náhodně*, *náhled* (B02), *orákulum* (výběr podle skutečného průměru), *zvol jednou*, *přehodnocuj každých 5 hodů*.
- Úrovně a cena / podmínka odemčení: —
- Proč je hra zábavnější: Horizontální progrese je přínosná, jen když volba je nezřejmá (Compton, `03 §2.5`, H) a když je víc možností opravdu rovnocenných (LtF3: přes 100 dílů a přesto dominantní strategie, `03 §2.5`, H). Matice z toho dělá měřitelné kritérium, stejně jako `01` dělá z dominance nákupních strategií kritérium 15 %.
- Pocit „chci a potřebuju“: Nepřímý. Matice generuje věty „kdy se hodí / kdy škodí“ na kartách (B02), takže hráč dostane pravdivou radu z dat, ne z marketingu.
- Rizika a etika: Riziko, že matice „vyladí“ všechno do nuly a bonusy budou nudné. Proto kritérium 1 (každý musí někde vyhrát) a 3 (pásmo do +20 %). Situace s nízkou populací (expert s kluzákem ve větru) nesmí řídit ladění.
- Simulace: Nová logika. Funkce `bonusMatrix()` v simulátoru (stejná kopie `createFlight` jako sonda v 0.2, nebo háček v `src/`). 4 profily × 2 modely × 4 fáze × ~14 bonusů × 400 hodů ≈ 180 000 letů, tedy pod minutou na 15 vláknech. Kampaňově pak jen strategie „náhled“ a „přehodnocuj“. *Hypotéza:* s koeficienty z této karty vyhoví kritériím 1–3 aspoň 10 ze 14 bonusů napoprvé. Selžou nejspíš Vábnička (malý efekt) a Ostrá hrana (pozdní dominance u kluzáku). Strategie „přehodnocuj“ bude o 1–2 hody rychlejší než „zvol jednou“, což by potvrdilo, že se volba během hry mění.
- Náročnost implementace: M (jen simulátor)

---

## 6. Shrnutí a prioritizace

**Struktura stránky Bonusy (návrh):** nahoře vlaštovka se sloty (1–3) a uložené sestavy (B15), pod tím katalog po pěti kategoriích (Papír, Přehyb, Výhoz, Model, Mince). Každá karta bonusu má náhled, „kdy se hodí“ a jednu zkoušku (B02). Asistence (pevná síla 0,7, DQ-13, DQ-14, DQ-15) jsou oddělená sekce bez slotů. Atlas (SV01, E05) může být druhá záložka téže stránky, pokud se rozhodne, že `bonus.html` má obojí (otázka 10).

| Karta | Přínos | Náročnost | Simulovatelnost | Poznámka |
|---|---|---|---|---|
| **B01** Sloty a výbava | vysoký | M | nová logika | páteř, bez ní nic dalšího |
| **B02** Karta s náhledem a zkouškou | vysoký | M | nová logika + playtest | podmínka „vidět předem“ pro všechny bonusy |
| **B03 + B04** Zátěž / Hedvábí | vysoký | S | parametr | první volba při 100 m, dělí modely |
| **B05 + B06** Ploška / Ostrá hrana | vysoký | S | parametr | dělí dovednost, náhrada nejasných přehybů |
| B07 Katapult (+ asistence 0,7) | střední | S | parametr | rozhodnout hranici bonus × asistence |
| B08 Římsa | střední | S/M | parametr (`height`) | synergie s Hedvábím, hlídat délku letu |
| **B09** Expresní hrot | střední–vysoký | S | parametr | jediná karta, která zkracuje lety po 500 m |
| B10 Lamely | střední | S | parametr | volba se mění s fází, test pro „přehodnocuj“ |
| B11 Klidný let / Rušná obloha | střední | S | malá logika + playtest | volba podle vkusu |
| B12 Vábnička | nízký | S | malá logika + profily | možná vypadne |
| B13 Pokladnička | nízký–střední | S | parametr | jen se sinky mincí |
| B14 Kategorie a synergie | vysoký | S | nová logika | pravidlo, které drží katalog čitelný |
| B15 Sestavy při míření | střední | M | strategie | nutné pro B16, B18, B19 |
| B16 Ohlášený cíl | střední | M | nová logika | riziko podobnosti se sázkou, otázka 7 |
| B17 Rezervní arch | střední | S | malá logika | možná spíš globální funkce |
| B18 Plachetka | střední | S | parametr | jen s větrem |
| B19 Dopis v kapse | nízký–střední | S | nová logika | jen se zakázkami |
| B20 Katalog a odemykání | vysoký | M | nová logika | rozpočet mincí před 500 m |
| B21 Rozpis bonusů | vysoký | M | parametr + playtest | bez něj je volba zdánlivá |
| **B22** Matice výhodnosti | vysoký (pro návrh) | M | jen simulátor | kritérium přijetí katalogu |

**Doporučené pořadí pro simulačního agenta:**
1. **B22 s kartami B03–B10** (jen parametry, kopie `createFlight`, žádná kampaň): ověří, které bonusy splní kritéria 1–4, a doladí koeficienty.
2. **B01 + B20 + B14** v kampani (sloty, ceny, pravidlo kategorií, strategie „náhled“ a „přehodnocuj“): tempo do 500 m, mezery mezi nákupy, poměr slabý / expert.
3. **B11, B12, B17** (malá logika v událostech a hodu).
4. **B13, B16, B19** až po rozhodnutí o sincích mincí a zakázkách (`05`, `04`). **B18** až po rozhodnutí o větru.
5. B02, B15 a B21 se v simulaci projeví jen jako strategie. Hlavní ověření je playtest (`02 §4.4`, `README P4`: kombinace dotazníku, chování a rozhovoru).

**Hypotéza celku:** dva sloty před 500 m zkrátí kampaň průměrného hráče o 2–4 hody (23 → 19–21) a slabého o 3–6 (31 → 25–28). Rozdíl mezi nejlepší a mediánovou sestavou zůstane ≤ 15 %. Pokud kampaň zkrátí víc, přesunout 2. slot na 500 m nebo zdražit první úrovně Dílny. Po 500 m dá 3. slot a ~600 ◈ katalogu konečné horizontální využití mincí.

---

## Otevřené otázky pro uživatele

1. **Kdy sloty?** Návrh: 1. slot při 100 m, 2. při 305 m, 3. po 500 m. Alternativa: všechny bonusy až po 500 m jako obsah kapitoly 2 (kampaň do 500 m beze změny). Která varianta?
2. **Jak se bonusy odemykají?** Mince (plochá cena), razítka (E05), zkoušky (DQ-17), nebo kombinace? Má první bonus při 100 m být zdarma jako volba ze dvou?
3. **Výměna výbavy zdarma kdykoli mezi hody**, včetně rychlé volby sestavy při míření (B15)? Nebo jen na stránce Bonusy, aby volba měla větší váhu?
4. **Hranice bonus × asistence:** souhlasíš, že pevná síla 0,70 je asistence zdarma bez slotu a Katapult 0,85 je slotový bonus? Nebo má být jakákoli pomoc se silou jen asistence?
5. **Synergie:** jen emergentní z fyziky a označené štítkem (doporučení), nebo i pojmenované sady s malým bonusem navíc?
6. **Bonusy vázané na model (B09, B10), nebo výbava modelu v Dílně (D07)?** Obojí najednou by bylo zbytečné. Horizontální verze znamená volbu s cenou, vertikální verze znamená trvalé posílení.
7. **Ohlášený cíl (B16):** je výzva bez ztráty pro tebe přijatelná, nebo je jakákoli podobnost se sázkou pro hru s možným dětským publikem nežádoucí?
8. **Kategorie Mince (B13, B16)** má smysl jen tehdy, když mince po 500 m k něčemu jsou (`05` otázka 1). Bez sinků ji vyřadit?
9. **Rezervní arch (B17):** bonus do slotu, nebo běžná funkce hry pro všechny (zrušit hod do 0,6 s)?
10. **`bonus.html`:** sloty a katalog (tento soubor), Atlas (SV01, E05), nebo obojí jako dvě záložky jedné stránky?
11. **Délka letu:** Hedvábí, Římsa a Lamely prodlužují let. Je přijatelné, aby se tyto bonusy omezily stropem délky letu, nebo má hra raději přidat obecné zrychlení klouzání (otázka 4 v `01`)?
