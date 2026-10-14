# Návrh systému progrese, 2. kolo

**Založeno 13. 10. 2026.** Jeden ucelený návrh, který ze 100 karet 1. kola (`01–05`), review (`07`) a rozhodnutí uživatele (`06`) skládá hotový systém. Je připravený na ověření Monte Carlem. Rozhodnutí v `06` mají přednost. Kde se návrh od karet odchyluje, je to řečeno a zdůvodněno.

**Jazyk:** dokument je česky, **všechny herní texty (názvy, hlášky, UI) jsou anglicky**, protože hra bude celá v angličtině.

**Podklady:** `06`, `07`, `00`, `CLAUDE.md`, karty `01–05` (hlavně ponechané a upravené), `src/config.js`, `core.js`, `events.js`, `throw.js`, `scenes.js`, `render.js`, `ui.js` (smyčka a kamera), `simulation/monte-carlo.mjs`, rejstřík zásad P1–P15 v `research/kb/README.md`.

**Sondy:** vlastní skripty ve scratchpadu (`probe1–5.mjs`, `sim3.mjs`, `final3.mjs`, `wind2.mjs`, `camp2.mjs`). Importují `src/` beze změn a nový model letu jen napodobují (přepisem `f.p` za letu). Kód hry ani `simulation/` jsem neměnil ani nespouštěl. Čísla ze sond jsou **orientační**: nové události, schopnosti do slotů a část bonusů Atlasu jsou v nich zjednodušené na přirážku k účinku událostí. Přesná čísla dodá Monte Carlo (§10).

---

## Obsah
0. Shrnutí na jednu stranu
1. Přehled systému: první hodina, střed, konec
2. Křivka progrese: dolet, délka letu, vzorce
3. Dílna (Workshop)
4. Atlas: 16 míst, 16 bonusů
5. Kapsy (sloty) a speciální bonusy
6. Vítr, plující QTE a kombo
7. Postavy a události podle čtvrtí
8. Mezery z review
9. Co se z 1. kola nepoužilo
10. Plán pro Monte Carlo
11. Otevřené otázky pro uživatele

---

## 0. Shrnutí na jednu stranu

**Hlavní myšlenka: dolet = rychlost × doba ve vzduchu.** Sondy ukázaly, že dnes všechna vylepšení prodlužují jen dobu letu. Průměrná rychlost vlaštovky je pořád asi 14 m/s (šipka) a 9 m/s (kluzák), ať je vylepšená jakkoli. Proto plně vylepšený kluzák letí 72 s a s událostmi přes 100 s. Návrh to obrací: doba letu roste jen na začátku (asi z 15 na 25–30 s) a potom už skoro ne. Další růst doletu nese **rychlost (tempo)**, která roste až desetinásobně. Z Dílny tak doletí vlaštovka na konci celou trasu ~4,9 km za **30–35 s skutečného času**.

**Tři vrstvy progrese, jedna měna (mince):**

| Vrstva | Co to je | Co hráč dělá | Podíl na doletu |
|---|---|---|---|
| **Workshop (Dílna)** | 3 větve: **Power** (3 úr.), **Paper** (12 úr. ve 4 druzích papíru, otvírají se po čtvrtích), **Folds** (3 úr.) | kupuje úrovně | páteř: Paper je žebřík rychlosti (×1 → ×10) |
| **Atlas** | 16 míst = 16 trvalých bonusů. Doletem na místo se bonus odemkne (úroveň 1 zdarma), mince zvedají úroveň 2–3 | objevuje, vylepšuje | koření: asi ×1,4 na konci, hlavně **nové chování** (události, odraz, kombo, přítel jeřábek) |
| **Pockets (Kapsy)** | 2 sloty pro 6 speciálních bonusů, z toho 4 aktivní schopnosti za letu (Dive, Cushion, Whistle, Paper Rocket). Nasazená smí být jen jedna aktivní | volí styl | ±5–10 %, hlavně jiný zážitek z letu |

**Odhad délky hry (sondy, střední hráč, vyvážený nákup):** asi **115 hodů a 60–70 minut** do konce trasy. Čtvrti: D1 ~29 hodů, D2 ~22, D3 ~27, D4 ~35. Slabý hráč asi 140 hodů / 80 min, šikovný 95 hodů / 60 min, takže šikovnost rozhoduje středně. Všichni dojdou do cíle.

**Co je nové proti kartám:** model tempa (§2.2), Paper jako žebřík rychlosti (W2), zrychlení klouzání zdarma (Z2), kombo jako základ hry s vylepšením v Atlasu (Z5 + A02), přítel **Paper Crane** (A14), vzácná **Shooting Star** (A12), aktivní schopnosti **Whistle** a **Paper Rocket** (S3, S4), koše proti nafouknutí čísel (§2.7).

---

## 1. Přehled systému: první hodina, střed, konec

### První čtvrthodina: Violet Suburbs (0–1 219 m)
Hráč hází z okna Dílny nad předměstím. První hod doletí ~200 m za 15 s a hned po něm si koupí **Power 1** (+20 % doletu) nebo **Paper 1** (+60 %). Ten skok je cítit, protože Paper zrychlí celou vlaštovku a město pod ní ubíhá rychleji. Po 3–5 hodech přeletí hranici **Market under the Antennas**. Atlas ukáže první pohlednici a odemkne **Crowd Chain**: dav na tržnici fandí zásahům v řadě. Na 100 m mezitím odemkl **Glider**. Každých 5–8 hodů přibude nové místo (Gardens: **Pinwheel**, Railway: **Steam Hop**, první nová událost). Kolem 25.–30. hodu má našetřeno na **první kapsu** (600 ◈) a nasadí do ní **Cushion** nebo **Sharp Edge**. Na hranici čtvrti se kamera oddálí a na obloze se rozsvítí **MOON DOCKS**.

**Co táhne:** blízké místo s názvem a vtipnou větou v HUD („Next: Gardens at the Edge · 86 m“), velké skoky Paperu, první kapsa jako cíl na mince, nové věci zhruba každých 5 hodů.

### Střed hry: Moon Docks a Red Horizon (1,2–3,7 km)
V docích se otevře druhý druh papíru (**Kraft Paper**) a v kapsách přibude **Dive**: první skutečné řízení letu. Vlaštovka teď letí 25–30 s a místo trvá přeletět jen pár sekund. Atlas přidává věci, které mění konec letu (**Stone Skip** odrazí vlaštovku od vody, **Packing Tape** zmírní minutí). V Red Horizon přijde **Washi**, **Thermal**, vzácná **Shooting Star** a druhá kapsa. Hráč skládá „svůj“ let: kluzák s Echem pro dlouhé klidné lety, nebo šipku s Dive pro rychlé nízké průlety.

**Co táhne:** rychlost, kterou hráč vidí (město ubíhá), nové události, volba v kapsách, postavy (jeřábnice Marge, astronomka Stella).

### Konec trasy: Neon Core (3,7–4,9 km)
**Neon Foil** papír a vlaštovka letí přes 100 m/s. **On Air**: když drží kombo, billboardy ve městě vysílají její let živě. **Ad Drone** se od ní odráží s reklamním „BOING“. Poslední hody jsou „průlet celou trasou“: 16 míst za ~30 s, každé místo bliká při průletu. Po přeletu 4 876 m přijde **finále** (oddálení na celé rozsvícené město, poslední věty postav) a odemkne se **Encore**: noční kolo trasy s rekordy úseků a volné létání.

**Co táhne:** blízký konec (zbývá málo míst), vlaštovka na vrcholu sil, finále, které je vidět předem jako tmavá silueta Rooftop Harbor.

---

## 2. Křivka progrese

### 2.1 Co ukázaly sondy dnes (verze 0.6.1)
Pasivní let bez událostí, síla 0,75, nejlepší úhel. „QTE 70 %“ = bot trefí 70 % událostí, polovinu z toho perfektně.

| Model, úrovně | Dolet | Doba | Průměrná rychlost | S QTE 70 % |
|---|---:|---:|---:|---|
| šipka 0/0/0 | 177 m | 12,7 s | 14,0 m/s | 221 m / 15,6 s |
| šipka 3/3/3 | 377 m | 25,6 s | 14,8 m/s | 506 m / 34 s |
| šipka 5/5/5 | 587 m | 40,6 s | 14,4 m/s | 845 m / 58 s |
| kluzák 0/0/0 | 177 m | 20,1 s | 8,8 m/s | 228 m / 24 s |
| kluzák 5/5/5 | 649 m | 71,8 s | 9,0 m/s | 1 068 m / **109 s** |

**Závěr 1:** vylepšení dnes zvyšují **jen dobu letu**, rychlost zůstává stejná. Lineárním zvětšováním dnešních větví se 4,9 km nedá dosáhnout v rozumném čase. Při 14 m/s by let trval 6 minut.

**Závěr 2:** události prodlužují let o 30–50 %. Poryv přidá vertikální rychlost (výšku), holub drží výšku 0,8–1,1 s. Delší let má víc událostí (až 10), a ty ho dál prodlužují.

**Závěr 3 (ověřeno):** když se vodorovné rychlosti (výhoz, `cruise`) a klouzavost vynásobí stejným číslem π, dolet vzroste přesně π×, ale **doba letu se nezmění** (šipka 5/5/5: π = 2, 4, 8 → 1 174 / 2 347 / 4 694 m, vždy 40,6 s). Klesání `vx/glide` zůstane stejné a výška taky. To je základ návrhu.

### 2.2 Princip: tempo (rychlost) a doba ve vzduchu
Dolet se dá číst jako **rychlost × doba ve vzduchu**. V Dílně to hráč uvidí jako dvě čísla: **Speed 18 m/s** a **Airtime ~16 s**.
- **Tempo π** násobí vodorovnou rychlost i klouzavost. Dolet roste, doba ne, výška ne. Kamera nemusí utíkat do nebe a město zůstává v záběru.
- **Doba ve vzduchu** vzniká z výšky (Power, start z jeřábu, svislá část událostí) a klesání. Je to **omezený rozpočet**: cíl je 15 s na začátku, ~25 s na konci D1 a nejvýš ~35 s (simulovaného) letu na konci.

### 2.3 Vzorce (výchozí návrh pro simulátor)
```
π      = 1 + Σ paperStep[i] pro i ≤ úroveň Paper
         paperStep = [.65,.65,.65 | .80,.80,.80 | .75,.75,.75 | .85,.85,.85]
         → π: 1 / 2,95 (konec D1) / 5,35 (D2) / 7,60 (D3) / 10,15 (D4)
β      = min(.50, Momentum·placesCrossed + OnAir)          // trvalé posílení za letu, strop +50 %
burst  = Starburst, Paper Rocket, Low Pass (Dive)          // krátké, samy doznívají (τ ≈ 2–4 s)
speed0 = model.speed · (1 + .14·Power) · (.7 + .4·steady) · steepPenalty   // jako dnes, Power .14 místo .12
launch: vx = speed0·cos θ·π,  vy = speed0·sin θ                             // výška nezávisí na π
cruise = model.cruise·π·(1+β),  glide = model.glide·π·(1+β)                 // klesání = (vx − vítr)/glide
y0     = 12 + 2·CraneLift   [m]
steady = power + (1 − power)·.25·Folds
okna   = TIMING·(1 + .15·Folds)·(Sharp Edge ? .75 : 1)
událost (zásah):  Δvy  = jako dnes (gust 2, holub výdrž .8/1.1 s) · model.qte   // NEškáluje se Folds ani bonusy
                  Δvx  = 1.5·π·(1 + E)·(perfekt ? 1.25 : 1)·S                   // vodorovný „push“, doznívá s drag .12
E      = min(1.5, .20·Folds + Combo + GullEscort(jen holub) + vlastní úroveň typu události)
S      = Sharp Edge 1.3 / Calm Sky 1.5 / jinak 1                              // slotové bonusy mimo strop E
vítr   = w·model.cruise·π·min(1, y/25),  w ∈ {−.12, −.08, −.04, 0, +.04, +.08, +.12}
odměna = 10 + floor(dolet/10)   (beze změny)
```
Proč tak: **Folds a bonusy událostí už nezvětšují svislý účinek.** Sonda: když účinek QTE zvětšuje i výšku, plná výbava letí o 6–11 s déle (Folds) a bonusy Atlasu přidají dalších ~11 s. Vodorovný push dá podobný dolet bez prodloužení letu.

### 2.4 Křivka: dolet a délka letu podle fáze
Sonda `final3.mjs`, šipka, úhel podle hráče, 50 letů na řádek. Profily: slabý (zásah 40 %, síla 0,6, úhel ±5°), střední (70 %, 0,75, ±3°), silný (90 %, 0,88, ±2°). „Skutečný čas“ = se zrychlením klouzání 1,4× (Z2).

| Fáze (výbava) | π | Slabý | Střední | Silný | Let střední (sim / skutečný) | Prům. rychlost |
|---|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1,0 | 170 m | 210 m | 247 m | 15 s / 13 s | 14 m/s |
| po Power 1 | 1,0 | 204 | 252 | 295 | 17 / 15 | 15 |
| po Paper 1 | 1,65 | 281 | 345 | 404 | 15 / 13 | 23 |
| střed D1 (Power 2, Paper 1, Folds 1) | 1,65 | 427 | 511 | 586 | 20 / 18 | 26 |
| **konec D1** (3 / Paper 3 / 3, Atlas D1) | 2,95 | 996 | 1 135 | 1 256 | 24 / 21 | 47 |
| **konec D2** (Paper 6, Atlas D2) | 5,35 | 2 040 | 2 267 | 2 462 | 28 / 25 | 81 |
| **konec D3** (Paper 9, Atlas D3) | 7,60 | 3 199 | 3 606 | 3 970 | 30 / 26 | 120 |
| střed D4 (Paper 10, Atlas plný) | 8,40 | 3 995 | 4 500 | 5 261 | 34 / 30 | 132 |
| **plná výbava** | 10,0* | 4 836 | 5 432 | 6 323 | 34 / 30 | 160 |
| plná výbava bez Atlasu | 10,0* | 3 371 | 3 836 | 4 241 | 24 / 21 | 160 |
| kluzák, plná výbava (střední) | 10,0* | – | 5 637 | – | 41 / ~35 | 137 |

\* Sonda běžela s krokem .80 ve 4. druhu papíru. Navržený krok .85 dá π = 10,15 a slabému hráči asi +5 %, tedy medián ~5,1 km a bezpečnou rezervu na cíl 4 876 m.

**Čtení tabulky:**
- Hranice čtvrtí (1 219 / 2 438 / 3 657 / 4 876 m) střední hráč přelétá zhruba ve chvíli, kdy dokoupí papír dané čtvrti a část jejího Atlasu. Tak má být.
- Doba letu roste z 15 na ~30 s v D1 a potom už jen o pár sekund. Poslední hody trvají **~30 s skutečného času**.
- Atlas dává na konci ×1,4 doletu (3,8 → 5,4 km). Je tedy znát, ale páteří zůstává Paper.
- Šikovnost: silný / slabý = 1,25–1,30× doletu. To je „středně“ (`06`).

### 2.5 Kamera, zoom a zrychlení
Při 160 m/s ubíhá scéna rychlostí ~340 px/s a jedno místo (305 m = šířka obrazovky) přeletí za ~2 s. Návrh:
- **Oddálení podle tempa:** `zoom = clamp(1 − .035·(π − 1), .70, 1)`. Na konci je vidět ~1,4× víc města dopředu a scéna ubíhá ~240 px/s. Vlaštovka zůstává na `px = 148`, posune se mírně doleva (`px = 120`), aby byl vidět prostor před ní.
- **Rychlostní čáry a stopa** sílí s π (juice už existuje, `juice.js`). Rychlost se má **vidět**, ne jen číst.
- **Zrychlení klouzání (Z2)** zdarma pro všechny, 1,4×, jen mezi událostmi.
- **Průlet hranicí místa:** krátké bliknutí názvu místa (0,6 s) u horního okraje. Hráč pozná, kolik míst za let přeletěl.
- **Reduced motion:** bez oddalování a rychlostních čar, zrychlení klouzání vypnuté (pomalejší, ale klidnější let).

### 2.6 Odhad hodů a minut na čtvrť
Hrubá kampaň (`camp2.mjs`, 8 běhů na řádek, ceny z §3–4, bez kapes, minuty = simulovaný let + 8 s UI na hod, bez zrychlení klouzání). Strategie „vyvážený“ kupuje to, co je nejlevnější vzhledem k přínosu, „Paper napřed“ kupuje papír vždy jako první.

| Profil | D1 | D2 | D3 | D4 | Celkem | Paper napřed |
|---|---|---|---|---|---|---|
| slabý | 46 hodů / 20 min | 31 / 15 | 29 / 21 | 34 / 23 | **140 / 79 min** | 125 / 68 |
| střední | 29 / 13 | 22 / 13 | 27 / 18 | 35 / 26 | **113 / 70 min** | 99 / 57 |
| silný | 23 / 11 | 21 / 14 | 26 / 18 | 25 / 19 | **95 / 62 min** | 80 / 48 |

**Varování ze sondy:** „Paper napřed“ je o 12 % rychlejší než vyvážený nákup. Papír je tedy na minci výhodnější než úrovně Atlasu. Návrh to zčásti brzdí tím, že druhy papíru otvírají čtvrti, takže mezi nimi hráč přirozeně kupuje Atlas. Monte Carlo musí rozdíl stáhnout pod 10 % (§10). D4 vychází nejdelší. Kandidát na úpravu jsou levnější ceny 4. druhu papíru.

### 2.7 Pravidla proti nafouknutí čísel (koše)
Účinky se nesmějí násobit libovolně. Každý účinek patří do jednoho koše:

| Koš | Co do něj patří | Uvnitř | Strop |
|---|---|---|---|
| **Tempo π** | jen Paper | sčítá se | daný počtem úrovní (10,15) |
| **Posílení za letu β** | Momentum, On Air | sčítá se | +50 % |
| **Krátké výtrysky** | Starburst, Paper Rocket, Low Pass | každý doznívá sám | žádné dva naráz: nový přepíše starý |
| **Push událostí E** | Folds, Combo, Gull Escort, úrovně typů událostí | sčítá se | +150 % |
| **Styl ze slotu S** | Sharp Edge, Calm Sky | jeden násobek | nenasazují se oba (stejná skupina) |
| **Doba ve vzduchu** | Power, Crane Lift, svislá část událostí, Stone Skip, Thermal | pevná čísla, neškálují se | MC: medián letu ≤ 35 s skutečného času |
| **Záchrany** | Packing Tape, Paper Crane, Cushion | nenásobí, jen zmírní konec | 1× za let (Crane, Cushion) |

Sharp Edge a Calm Sky jsou mimo strop E záměrně. Sonda ukázala, že pod společným stropem by Sharp Edge v pozdní hře nic nepřidal (strop by byl už plný z Atlasu).

---

## 3. Dílna (Workshop)

Tři větve jako dnes, ale s novou rolí. **Méně a větší kroky:** Power a Folds mají 3 úrovně místo 5, takže každá koupě je cítit. Paper je dlouhý žebřík rychlosti, otvíraný po čtvrtích (E06).

### W1 — Power (síla hodu)
- Typ: Vylepšení · Kde: Dílna
- Mechanika: `speed ×(1 + .14·úr.)`. Vyšší oblouk, víc výšky, tedy **delší i delší let**. Jediná větev Dílny, která přidává dobu ve vzduchu.
- Úrovně a cena: 3 úrovně, **40 / 120 / 260 ◈**.
- Proč je hra zábavnější: první koupě je cítit hned (+20 % doletu, sonda), oblouk je ve scéně vidět (P1).
- Chci a potřebuju: náhled „Next level: ≈ +45 m · past Market under the Antennas“ (U1).
- Rizika: přidává dobu letu. Proto jen 3 úrovně.
- Simulace: parametr. Hypotéza: první koupě u 70 % hráčů.
- Náročnost: S · **Vychází z:** dnešní větev síly, D13 (ceny).

### W2 — Paper (druh papíru = rychlost)
- Typ: Vylepšení · Kde: Dílna
- Mechanika: každá úroveň zvedne tempo π (§2.3). Vlaštovka letí rychleji a dál, **doba letu se nemění**. Papír se dělí na 4 druhy po 3 úrovních. Další druh se otevře **prvním doletem do další čtvrti**:

| Druh | Úrovně | Otevře se | Krok π | Ceny | Korunka na 3. úrovni druhu |
|---|---|---|---|---|---|
| **Copy Paper** | 1–3 | od začátku | +.65 | 100 / 180 / 300 | rychlostní čáry za letu |
| **Kraft Paper** | 4–6 | Moon Docks | +.80 | 650 / 900 / 1 150 | stopa z mořské tříště |
| **Washi** | 7–9 | Red Horizon | +.75 | 1 900 / 2 400 / 2 900 | vlaštovka prosvítá jako lampion |
| **Neon Foil** | 10–12 | Neon Core | +.85 | 3 500 / 4 100 / 4 700 | neonová kometa, při průletu místem tiché „pop“ |

- Vlaštovka **změní vzhled** s každým druhem papíru (bílá → hnědá → vláknitá průsvitná → duhová fólie). To je zároveň velký moment na hranici čtvrti (§8).
- Proč je hra zábavnější: rychlost je nejsilněji cítit (město ubíhá), druh papíru je vidět na vlaštovce v každém hodu. Korunky jsou kvalitativní vrchol, ne další procenta (D12).
- Chci a potřebuju: zamčený druh v Dílně ukazuje siluetu a „Opens in Moon Docks“ (zvědavost P3, blízký cíl P6).
- Rizika: Paper je nejvýhodnější koupě na minci (§2.6). Brzdí ho otevírání po čtvrtích. Mění dnešní Paper (+20 % klouzavosti) na jiný druh účinku. To je otázka pro uživatele (§11, ot. 3).
- Simulace: parametr π + podmínka otevření. Hlídat podíl strategie „Paper napřed“.
- Náročnost: M (vzhled 4 papírů ve 4 stylech) · **Vychází z:** E06 + D18 (kapitolová Dílna), D12 (korunky), SV15 (stopa podle čtvrti, jen jako vzhled), review §4.3 (délka letu).

### W3 — Folds (přehyby)
- Typ: Vylepšení · Kde: Dílna
- Mechanika: za úroveň odpuštění slabého hodu +25 % chybějící síly, okna událostí +15 % (je vidět na kruhu), push událostí +20 % (E).
- Úrovně a cena: 3 úrovně, **40 / 120 / 260 ◈**.
- Proč je hra zábavnější: dělá událostem ruku. Slabší hráč cítí širší výseč, šikovný větší push.
- Chci a potřebuju: náhled ukáže širší zelenou výseč na kruhu přímo v Dílně.
- Rizika: dnešní past „přehyby napřed“ (P8). Ve sondě Folds 1 dává jen +3 % (střední) a +6 % (slabý). Tichá větev, proto jen 3 levné úrovně. Rozdělení na Vyvážení a Křidélka (D03 + D04) neprovádím: tři větve stačí a kroky jsou teď větší.
- Simulace: parametr. Ověřit, že „Folds napřed“ není pomalejší o víc než 15 %.
- Náročnost: S · **Vychází z:** D03, D04 (sloučeno zpět do jedné větve), DQ-13 (společný strop oken).

### Pravidla Dílny
- **Model:** Dart (od začátku) a Glider (Atlas, místo 1). Glider se přeladí, aby nepřetahoval dobu letu: `speed 14, glide 4.0, cruise 11, ideal 30, qte 1.15` (dnes 13 / 5,4 / 8 / 28). Sonda: Glider dolétá o ~4–8 % dál, ale let trvá o ~20 % déle a má víc událostí. **Dart = rychlé hody, Glider = delší lety s víc událostmi.**
- **Undo last purchase:** poslední koupi lze vrátit za plnou cenu až do dalšího hodu (D14 zmenšené).
- **Náhled (U1)** u každé úrovně: „≈ +X m · past <place>“, spočítaný přehráním posledního hodu s novou úrovní (D01 + E10). Stejný náhled má Atlas.
- **Cíl nákupu:** „Kraft Paper 4 · 210 ◈ to go“ (E09). Bez odhadu počtu hodů.
- **Celkem Dílna:** 18 úrovní, 23 620 ◈ (Power 420, Folds 420, Paper 22 780).

---

## 4. Atlas: 16 míst, 16 bonusů

### 4.1 Pravidla Atlasu
- Stránka **Atlas** (dnešní `bonus.html`) = 16 pohlednic ve 4 čtvrtích. Neobjevené místo je tmavá silueta s názvem a jednou větou (teaser, SV03).
- **Doletem na místo** (rekord ≥ začátek místa) se odemkne jeho bonus v **úrovni 1 zdarma**. Je to „nálezné“ (SV02) v podobě věci místo mincí.
- **Mince** zvyšují úroveň 2 a 3. Ceny podle čtvrti:

| Čtvrť | Úroveň 2 | Úroveň 3 |
|---|---:|---:|
| Violet Suburbs | 50 | 100 |
| Moon Docks | 200 | 400 |
| Red Horizon | 450 | 900 |
| Neon Core | 750 | 1 500 |

- Dvě karty nemají úrovně (Glider, Encore). **Odchylka od „16 × úrovně“:** Glider je model (volba, ne síla) a Encore se otevírá 305 m před cílem, kdy by „síla navíc“ už neměla čas zapůsobit. Celkem tedy 14 bonusů s úrovněmi (28 placených úrovní, 15 000 ◈).
- **Jedna novinka za hod (U3):** když se naráz odemknou dvě věci, druhá se ohlásí až po dalším hodu.
- Rozmanitost: 4 nové události, 3 úpravy událostí, 2 záchrany, 1 konec letu, 2 rychlost za letu, 1 start, 1 vítr, 1 model, 1 závěr hry. Jen tři bonusy jsou „čistá procenta“ (Crowd Chain, Gull Escort, Momentum), a i ty mají viditelný projev ve scéně.

### 4.2 Přehled

| # | Místo (od m) | Bonus | Druh | Jedním slovem |
|---|---|---|---|---|
| 1 | Workshop & First Roofs (0; odemkne 100 m) | **Glider** | model | kluzák |
| 2 | Market under the Antennas (305) | **Crowd Chain** | úprava událostí | kombo |
| 3 | Gardens at the Edge (610) | **Pinwheel** | vítr | větrník |
| 4 | Railway to the River (914) | **Steam Hop** | nová událost | pára |
| 5 | Warehouses by the Water (1 219) | **Packing Tape** | záchrana | páska |
| 6 | Crane Forest (1 524) | **Crane Lift** | start | jeřáb |
| 7 | Bridge over the Bay (1 829) | **Stone Skip** | konec letu | žabka |
| 8 | Lighthouse at the Pier's End (2 133) | **Gull Escort** | úprava událostí | racci |
| 9 | Fields beyond the Bay (2 438) | **Momentum** | rychlost za letu | rozjezd |
| 10 | Wind Ridge (2 743) | **Thermal** | nová událost | termika |
| 11 | Mountain Saddle (3 048) | **Echo** | úprava událostí | ozvěna |
| 12 | Observatory above the Valley (3 352) | **Shooting Star** | vzácná událost | hvězda |
| 13 | Gates of the Metropolis (3 657) | **Ad Drone** | nová událost | dron |
| 14 | Sky Terraces (3 962) | **Paper Crane** | záchrana, přítel | jeřábek |
| 15 | Broadcast Tower (4 267) | **On Air** | rychlost za letu | vysílání |
| 16 | Rooftop Harbor (4 571) | **Encore** | závěr hry | přídavek |

Anglické názvy míst jsou návrh překladu dnešních `ROUTE` v `scenes.js`.

### 4.3 Karty

#### A01 — Glider (Workshop & First Roofs)
- Typ: Odemčení (model) · Kde: Atlas, Dílna
- Mechanika: druhý model, přeladěný (viz Pravidla Dílny). Volba modelu v Dílně kdykoli mezi hody.
- Úrovně a cena: bez úrovní. Odemkne se na 100 m (jako dnes), tedy nad prvními střechami.
- Proč tady: první střechy jsou první překážka, kterou hráč přeletí. Glider je první odměna a učí pravidlo „místo dá věc“.
- Proč zábavnější: jiný let, ne větší číslo. Volba stylu (P14).
- Chci a potřebuju: silueta kluzáku v Atlasu s „Clear the first roofs (100 m)“.
- Rizika: dominance kluzáku (review §4.9). Přeladění ho drží na +4–8 % doletu za +20 % času.
- Simulace: podíl kluzáku u vyváženého hráče má být 30–70 %, ne 95 %.
- Náročnost: S · **Vychází z:** dnešní odemčení, D08 (model jako odměna místa), review §4.9.

#### A02 — Crowd Chain (Market under the Antennas)
- Typ: Bonus (úprava události) · Kde: Atlas, Let
- Mechanika: vylepšuje základní **kombo** (Z5). Úr. 1: +8 % push za každý krok komba, max 4 kroky (+32 %). Úr. 2: +10 %, max 4 (+40 %). Úr. 3: +12 %, max 5 (+60 %). Nad vlaštovkou „Combo ×3“ a dav na střechách tržnice jásá (pod Market jen text „The crowd goes wild“).
- Úrovně a cena: 3, ceny D1 (zdarma / 50 / 100).
- Proč tady: tržnice je jediné místo v předměstí s davem. Antény „vysílají“ fandění, což předznamená On Air (A15).
- Proč zábavnější: dlouhý let dostane napětí a každý další zásah něco znamená (review: nejlepší poměr zábavy a náročnosti). P1: odezva podle výkonu.
- Chci a potřebuju: hráč kombo vidí od začátku (Z5), bonus ho zesílí. Náhled: „Combo ×4 = +32 % push“.
- Rizika: násobení s Folds a Echo. Řeší strop koše E (+150 %).
- Simulace: nová logika (už v kartě DQ-03). Měřit průměrný krok komba podle profilu.
- Náročnost: S · **Vychází z:** DQ-03.

#### A03 — Pinwheel (Gardens at the Edge)
- Typ: Bonus (vítr) · Kde: Atlas, Míření
- Mechanika: při míření je vedle ukazatele větru větrník. Klepnutí na něj „roztočí vítr znovu“ (nový los ze stejné sady, animace 0,8 s). Úr. 1: 1× za hod. Úr. 2: 2× za hod. Úr. 3: nový los nikdy není protivítr.
- Úrovně a cena: 3, ceny D1.
- Proč tady: zahrady na kraji města jsou plné větrníků v záhonech.
- Proč zábavnější: malá chvilka „no tak, do zad!“ před hodem. Je to drobná sázka, která nic nestojí. Vítr je slabý (±5 %), takže to neláme balanc.
- Chci a potřebuju: protivítr hráč zná z předchozích hodů, Pinwheel je přímá odpověď.
- Rizika: může vést k přetáčení před každým hodem, tedy k administrativě. Proto max 2× a krátká animace. Bez Pinwheelu se vítr nesmí dát změnit.
- Simulace: parametr (bot přetočí, když w < 0). Hypotéza +1–2 % průměrného doletu.
- Náročnost: S · **Vychází z:** DQ-10 (korouhvička), SV07.

#### A04 — Steam Hop (Railway to the River)
- Typ: Událost · Kde: Atlas, Let
- Mechanika: nová událost `steam` přibude do směsi (váha 1 proti poryvu 2 a holubovi 2). Pod vlaštovkou vyfouknou dva obláčky páry 0,45–0,6 s po sobě (dva kroužky na časovacím kruhu, rytmus „chug–chug“). Hráč klepne na každý obláček. Jeden zásah = malý zdvih, oba = **Full Steam** (push ×1,5). Úr. 2: push +30 %. Úr. 3: dva perfektní zásahy dají 2 s výtrysk rychlosti +15 %.
- Úrovně a cena: 3, ceny D1. Mimo předměstí má pára jiný vzhled (§7).
- Proč tady: vlak u řeky, komíny lokomotivy.
- Proč zábavnější: nové sloveso (rytmus dvou klepnutí), ne další „+%“. Událost vázaná na místo je nejlepší obsah Atlasu (review §3.9).
- Chci a potřebuju: první setkání s krátkou ukázkou (U3) a v Atlasu smyčka 3 snímků.
- Rizika: dvě klepnutí musí pokrýt asistence (DQ-14 „automatické QTE“).
- Simulace: nová logika (dvě okna, rozestup podle seedu).
- Náročnost: M · **Vychází z:** DQ-08.

#### A05 — Packing Tape (Warehouses by the Water)
- Typ: Bonus (záchrana) · Kde: Atlas, Let
- Mechanika: minutá událost dá přesto 25 / 40 / 55 % účinku běžného zásahu. Na vlaštovce se objeví proužek pásky a text „Taped.“ Kombo se minutím pořád nuluje.
- Úrovně a cena: 3, ceny D2 (zdarma / 200 / 400).
- Proč tady: sklady, krabice, páska.
- Proč zábavnější: minutí přestane být „nic“ a dostane vtip (mezera „humor v neúspěchu“). Pomáhá slabšímu hráči dojít do cíle (`06`), a přitom zásah je pořád lepší.
- Chci a potřebuju: hráč, který minul třikrát za let, vidí v Atlasu „Misses still count 25 %“.
- Rizika: snižuje rozdíl mezi slabým a šikovným. Proto max 55 % a kombo se nuluje.
- Simulace: parametr. Hypotéza: slabý +8–12 %, silný +1 %.
- Náročnost: S · **Vychází z:** DQ-13 (pomoc bez trestu, tady jako odměna místa), review §5 (humor).

#### A06 — Crane Lift (Crane Forest)
- Typ: Bonus (start) · Kde: Atlas, Míření
- Mechanika: jeřábnice Marge vyzvedne dítě na hák nad střechu Dílny. Start +2 / +4 / +6 m (`y0`).
- Úrovně a cena: 3, ceny D2.
- Proč tady: les jeřábů v přístavu.
- Proč zábavnější: změna je vidět v každém hodu (review: zábava 4). Synergii „výška × rychlost“ hráč chápe bez čísel.
- Chci a potřebuju: náhled ukáže vyšší start a „≈ +X m“.
- Rizika: přidává dobu ve vzduchu (+1 až +2,5 s). Proto jen +6 m, ne +20 m jako D05 (99 s v sondě review).
- Simulace: parametr `y0`.
- Náročnost: S (hák a lano u Dílny) · **Vychází z:** D05, B08.

#### A07 — Stone Skip (Bridge over the Bay)
- Typ: Bonus (konec letu) · Kde: Atlas, Let
- Mechanika: když vlaštovka dopadne s vodorovnou rychlostí nad polovinou `cruise`, odrazí se jako žabka na vodě: `vy = 2,2`, vodorovná rychlost ×0,30 (úr. 1) / ×0,45 (úr. 2). Úr. 3: dva odrazy. Podle povrchu jiný zvuk a obrázek: šplouchnutí, „bonk“ o střechu, odraz od markýzy.
- Úrovně a cena: 3, ceny D2.
- Proč tady: most nad zálivem a hlavně voda. Házení žabek je okamžitě srozumitelné.
- Proč zábavnější: konec letu přestane být mrtvý okamžik. Malé překvapení, které je vtipné a nic nestojí (review: odraz na mostě je „nejlepší wow za nejmenší cenu“).
- Chci a potřebuju: rozpis výsledku „Stone Skip +84 m“ (U4).
- Rizika: přidává 2–5 s. Jen při dostatečné rychlosti, aby se vlaštovka „neposkakovala“ donekonečna.
- Simulace: nová logika (odraz při dopadu).
- Náročnost: M · **Vychází z:** SV09 (zobecněno na každý dopad), review §5.

#### A08 — Gull Escort (Lighthouse at the Pier's End)
- Typ: Bonus (úprava události) · Kde: Atlas, Let
- Mechanika: holubi a racci táhnou déle a rychleji: výdrž +20 / +35 / +50 %, push holuba +0,10 / +0,15 / +0,20 (E). Při úspěchu letí pták ještě chvíli vedle vlaštovky.
- Úrovně a cena: 3, ceny D2.
- Proč tady: u majáku hnízdí racci. V docích jsou holubi „Courier Gulls“ (§7).
- Proč zábavnější: zesiluje nejčastější událost a přidává jí malý obrázek (doprovod). Hráč, který má holuby rád, má svůj bonus.
- Rizika: „jen procenta“. Vyvažuje to viditelný doprovod.
- Simulace: parametr.
- Náročnost: S · **Vychází z:** SV18 (racek-kurýr), B12 (obráceně: neláká víc ptáků, posílí je).

#### A09 — Momentum (Fields beyond the Bay)
- Typ: Bonus (rychlost za letu) · Kde: Atlas, Let
- Mechanika: každá hranice místa přeletěná **v tomto letu** zvýší rychlost o +2 / +3 / +4 % (β, max +30 / +35 / +40 %, společný strop β +50 %). Rychlostní čáry houstnou s každým místem.
- Úrovně a cena: 3, ceny D3 (zdarma / 450 / 900).
- Proč tady: otevřená pole, nic nestojí v cestě, vlaštovka se rozjede.
- Proč zábavnější: dlouhý let **zrychluje ke konci** místo toho, aby vyhasínal. Pocit „město mě táhne“ v pozdní hře.
- Chci a potřebuju: při průletu hranicí místa se ukáže „+3 %“ a stopa zesílí.
- Rizika: pozitivní zpětná vazba (víc míst → rychleji → víc míst). Řeší strop β.
- Simulace: parametr podle `floor(x/305)`.
- Náročnost: S · **Vychází z:** nový nápad. Odpovídá na review §4.3 (rychlost místo času).

#### A10 — Thermal (Wind Ridge)
- Typ: Událost · Kde: Atlas, Let
- Mechanika: nová událost `thermal`. 2 s předem se před vlaštovkou objeví mihotavý sloup teplého vzduchu (široký asi na 1,3 s letu) a v něm jasné jádro (0,35 s). **Klepnutí, když je vlaštovka v jádru**, dá spirálu vzhůru (`Δvy +3`) a push. Klepnutí mimo jádro, ale ve sloupu, dá polovinu. Úr. 2: push +30 %. Úr. 3: ve 40 % případů následuje druhý sloup.
- Úrovně a cena: 3, ceny D3.
- Proč tady: větrné elektrárny na hřebeni, termika nad poli.
- Proč zábavnější: první **prostorové** časování (čte se poloha ve scéně, ne kruh). Jiné sloveso než poryv a holub. Termika je vidět předem.
- Chci a potřebuju: na Wind Ridge se sloup ukáže už před odemčením jako kulisa („co to je?“).
- Rizika: karta DQ-06 měla držení, které se plete s holubem (review §4.6). Tady je to klepnutí. Přidává dobu ve vzduchu (pevně, ne přes E).
- Simulace: nová logika (okno podle polohy).
- Náročnost: M · **Vychází z:** DQ-06, SV08.

#### A11 — Echo (Mountain Saddle)
- Typ: Bonus (úprava události) · Kde: Atlas, Let
- Mechanika: každý **perfektní** zásah se po 0,6 s ozve: druhý push o síle 40 / 60 / 80 % prvního. Na obrazovce „★ … ★“, ve zvuku ozvěna (až bude zvuk).
- Úrovně a cena: 3, ceny D3.
- Proč tady: hory a ozvěna, srozumitelné bez vysvětlování.
- Proč zábavnější: dává smysl rozdílu mezi „Success“ a „Perfect“, který je dnes jen o 25 %. Odměna za kvalitu, kterou hráč uslyší a uvidí (P1).
- Rizika: posiluje šikovné. To je záměr („středně“), slabý hráč o nic nepřijde.
- Simulace: parametr podle podílu perfektních.
- Náročnost: S · **Vychází z:** D12 (vrchol mění chování), DQ-01 (perfekt zase něco znamená).

#### A12 — Shooting Star (Observatory above the Valley)
- Typ: Událost (vzácná) · Kde: Atlas, Let
- Mechanika: jednou za let s pravděpodobností 8 / 12 / 16 % přeletí přes oblohu zlatá hvězda (v `ambient.js` už padající hvězda je). Když protne časovací kruh, hráč klepne (okno jako perfekt poryvu ×2). Výsledek **Starburst**: výtrysk rychlosti +40 % doznívající 4 s a kombo +2. Dalekohled k tomu v Atlasu ukáže siluety dalších dvou míst (SV19).
- Úrovně a cena: 3, ceny D3.
- Proč tady: observatoř, dalekohled, padající hvězdy.
- Proč zábavnější: **vzácný moment**, o kterém hráč vypráví (mezera „překvapení“). Nejistota, kdy přijde, je motor zvědavosti (P3), ale nejde o loterii odměn: nic se nekupuje a nic se nesbírá.
- Rizika: náhoda v rekordu. Rozpis výsledku ji přizná („Shooting Star +210 m“, P7).
- Simulace: nová logika (pravděpodobnost a okno).
- Náročnost: M · **Vychází z:** SV19, review §5 (překvapení).

#### A13 — Ad Drone (Gates of the Metropolis)
- Typ: Událost · Kde: Atlas, Let
- Mechanika: nová událost `drone`. Reklamní dron vlétne do dráhy (výška vlaštovky −3 až +6 m) a kolem něj se zmenšuje kroužek. **Klepnutí těsně před dotykem** = odraz nahoru a dopředu (`Δvy +2,5`, push ×1,3) a na dronu blikne reklama („BOING! · BUY SOCKS“). Bez klepnutí vlaštovka dronem jen proletí. Úr. 2: širší okno +30 %. Úr. 3: drony občas ve dvojici (dvojitý odraz).
- Úrovně a cena: 3, ceny D4 (zdarma / 750 / 1 500).
- Proč tady: brány metropole hlídají drony.
- Proč zábavnější: srozumitelné „odraz se od něčeho“ a humor reklam (review zábava 4).
- Rizika: L náročnost (nový objekt ve scéně). Při vysoké rychlosti musí dron přiletět s předstihem 2 s jako ostatní události.
- Simulace: nová logika.
- Náročnost: L · **Vychází z:** DQ-07, SV17 (dron Leťka → Zippy).

#### A14 — Paper Crane (Sky Terraces)
- Typ: Bonus (záchrana, přítel) · Kde: Atlas, Let
- Mechanika: s vlaštovkou létá malý origami jeřábek. Když by vlaštovka dopadla **těsně před hranicí místa** (do 3 / 5 / 8 % doletu), jeřábek ji jednou za let přetáhne přes hranici na provázku. Výsledek: „Paper Crane tugged you 41 m.“
- Úrovně a cena: 3, ceny D4.
- Proč tady: zahrady v terasách ve výškách, origami jeřábci jako ozdoby.
- Proč zábavnější: řeší nejčastější frustraci pozdní hry („chybělo 20 m do dalšího místa“). Přidává **vztah k vlaštovce** (mezera z review): malý přítel, který pomáhá.
- Chci a potřebuju: výsledek dnes ukazuje pravdivou těsnost („37 m short of Broadcast Tower“, P10). Jeřábek je odpověď.
- Rizika: vyrobený near-miss nesmí vzniknout. Jeřábek pomáhá jen pravdivě a vždy to přizná. Pomáhá i u míst, která už hráč zná (Momentum).
- Simulace: nová logika (podmínka u dopadu).
- Náročnost: M · **Vychází z:** DQ-12 (záchrana na poslední chvíli), review §5 (vztah k vlaštovce), P10.

#### A15 — On Air (Broadcast Tower)
- Typ: Bonus (rychlost za letu) · Kde: Atlas, Let
- Mechanika: když kombo dosáhne 3, vlaštovka je „on air“: billboardy ve scéně ukazují její siluetu a rychlost vzroste o +8 / +12 / +16 % (β), dokud kombo drží. Minutí vysílání ukončí („Signal lost“).
- Úrovně a cena: 3, ceny D4.
- Proč tady: vysílací věž, nejvyšší bod cesty.
- Proč zábavnější: šikovná hra je vidět ve světě, ne jen v číslech. Neonové město reaguje na hráče (mezera „wow“).
- Rizika: posiluje šikovné. Strop β +50 %.
- Simulace: parametr podle komba.
- Náročnost: M (billboardy) · **Vychází z:** DQ-03 (kombo), SV17 (Zippy), review §5.

#### A16 — Encore (Rooftop Harbor)
- Typ: Odemčení (závěr hry) · Kde: Atlas
- Mechanika: dolet do Rooftop Harbor odemkne kartu „Encore · Finish the route to open“. Po přeletu 4 876 m: **finále** (§8.4) a potom **Night Route**: trasa pokračuje druhým kolem v noci (`routeAt` už kola počítá), s rekordy úseků a volným létáním.
- Úrovně a cena: bez úrovní.
- Proč tady: poslední místo. Síla navíc 305 m před cílem by neměla čas zapůsobit.
- Proč zábavnější: konec má tvar a po něm zůstane důvod si hodit (mistrovství, review §5).
- Rizika: nekonečný obsah nesmí tlačit k hraní (P13). Night Route je dobrovolná, bez denních odměn.
- Simulace: mimo MC (jen ověřit, že všechny dojdou).
- Náročnost: M · **Vychází z:** SV21 (odloženo na dobu po trase), SV04 a E14 (konec kapitoly).

---

## 5. Kapsy (Pockets) a speciální bonusy

### 5.1 Pravidla
- **2 kapsy.** Kapsa 1 stojí **600 ◈** a je vidět v Atlasu od začátku jako cíl („Pocket 1 · 600 ◈“). Bez podmínky metrů. Přijde typicky kolem 25.–30. hodu, po prvních úrovních Dílny. Kapsa 2 stojí **3 500 ◈** a ukáže se po příletu do Red Horizon.
- **Speciální bonusy nemají úrovně a nekupují se.** Odemyká je čtvrť (velký moment na hranici, §8.2). Cenou je kapsa.

| Kdy | Odemkne se |
|---|---|
| od začátku (s kapsou 1) | Cushion, Sharp Edge |
| Moon Docks | Dive, Calm Sky |
| Red Horizon | Whistle, Paper Rocket |

- **Nanejvýš jedna aktivní schopnost** (Dive, Cushion, Whistle, Paper Rocket). Druhá kapsa tedy nese buď pasivní bonus, nebo zůstane prázdná. Sharp Edge a Calm Sky se navzájem vylučují.
- **Výměna je zdarma** mezi hody. Zkouška nanečisto (D17) proto není potřeba: zkusit znamená nasadit.
- **Jedno tlačítko (Z6):** během varování, interakce a 0,3 s po vyhodnocení události patří tlačítko události. Jinak patří aktivní schopnosti. Když běží schopnost (držený Dive), další událost počká, nejvýš 2 s.

### 5.2 Karty

#### S1 — Dive (aktivní)
- Typ: Bonus (slot, aktivní) · Kde: Pockets, Let
- Mechanika: **držení** = střemhlav: gravitace ×3, strop klesání vypnutý, `vx += 2,4·π·dt`. **Puštění** = vybrání: `vy = max(vy,0) + .45·(vx − cruise)/π`, `vx = cruise + .6·(vx − cruise)`. **Low Pass:** puštění ve výšce 2–5 m (svítící pás nad zemí) dá konverzi .60 a výtrysk +20 % na 3 s. Dotyk země při střemhlavu = dopad. Bez omezení počtu, jen mimo události. Když začne událost, vlaštovka se sama vybere.
- Kompromis: výměna výšky za rychlost. Dobře načasovaný nízký průlet přidá, pozdní puštění ukončí let.
- Proč zábavnější: jediné skutečné řízení letu a „wow“ nízký průlet (review: nejvyšší strop zábavy).
- Rizika: perpetuum mobile. MC musí ukázat, že vysoké vybrání je neutrální. Pád neoznačovat posměšně („Kissed the pavement.“ je hranice).
- Simulace: nová logika (bot z DQ-11). Cíl: slabý ±0 %, pády ≤ 15 %. Expert +6–10 %.
- Náročnost: L · **Vychází z:** DQ-11.

#### S2 — Cushion (aktivní)
- Typ: Bonus (slot, aktivní) · Kde: Pockets, Let
- Mechanika: jednou za let pod 6 m: klepnutí = vzduchový polštář. Do 1 m (perfektní) klesání 0 po 1,6 s, 1–2,5 m po 1,2 s, 2,5–6 m klouzavost ×1,4 po 1,5 s. Pod vlaštovkou svítí pásy. Události pod 8 m nezačínají, takže polštář s nimi nekoliduje.
- Kompromis: bezpečný a jednoduchý, ale malý (+2–5 %). Je to volba „záchrana na konci“ místo stylu celého letu.
- Proč zábavnější: konec letu je moment dovednosti („doklouzal jsem o 4 m“).
- Simulace: nová logika (bot z DQ-12).
- Náročnost: M · **Vychází z:** DQ-12.

#### S3 — Whistle (aktivní)
- Typ: Bonus (slot, aktivní) · Kde: Pockets, Let
- Mechanika: klepnutí mimo událost = písknutí. Další událost přijde hned (varování 0,8 s), ne za 3–7 s. Max 3× za let. Ve scéně se otočí holub na střeše.
- Kompromis: víc událostí znamená víc komba a pushe, ale každé minutí kombo nuluje. Pro šikovného zrychlení, pro slabého riziko.
- Proč zábavnější: hráč řídí **rytmus** letu. Prázdné klouzání se dá vyplnit akcí.
- Rizika: příliš mnoho QTE za sebou může unavit. Proto max 3 a varování zůstává.
- Simulace: nová logika (bot píská ihned po vyhodnocení, když má kombo ≥ 2).
- Náročnost: S · **Vychází z:** B11 (Rušná obloha), B12 (vábnička, tady s rozhodnutím hráče).

#### S4 — Paper Rocket (aktivní)
- Typ: Bonus (slot, aktivní) · Kde: Pockets, Let
- Mechanika: 2 náboje za let. Klepnutí = výtrysk `vx += cruise` doznívající s τ = 1,5 s (~+1,5 s letu „zdarma“ dopředu). HUD ukazuje zbývající náboje a vzdálenost k další hranici místa.
- Kompromis: jednoduchá síla bez dovednosti, ale **rozhodnutí kdy**: hned, nebo schovat na konec, když chybí 30 m do dalšího místa?
- Proč zábavnější: jasná micro-volba v každém letu a „poslední tah přes čáru“. Vyhovuje hráči, který QTE nemá rád.
- Rizika: může být dominantní pro slabé. MC hlídá, aby nebyl nejlepší pro všechny profily.
- Simulace: parametr + jednoduchá politika bota (použít, když dopad bez něj skončí do 8 % před hranicí, jinak na konci).
- Náročnost: S · **Vychází z:** nový nápad.

#### S5 — Sharp Edge (pasivní)
- Typ: Bonus (slot) · Kde: Pockets, Let
- Mechanika: okna událostí ×0,75, push ×1,3 (S, mimo strop E). Kruh má užší výseč s ostrým okrajem.
- Kompromis: risk za odměnu. Sonda: silný +7 %, slabý −1 %.
- Proč zábavnější: vzor slotového bonusu, který hráč cítí v ruce (review §3.15).
- Simulace: parametr. Měřit úspěšnost podle profilu.
- Náročnost: S · **Vychází z:** B06.

#### S6 — Calm Sky (pasivní)
- Typ: Bonus (slot) · Kde: Pockets, Let
- Mechanika: rozestupy mezi událostmi ×1,6, push ×1,5 (S). Méně událostí, každá silnější.
- Kompromis: méně klepání a klidnější let, ale méně šancí na kombo (On Air, Crowd Chain slábnou). Nevylučuje se s aktivní schopností, ale vylučuje se se Sharp Edge.
- Proč zábavnější: styl pro hráče, kterého unavuje hustota QTE (P14). Proti Whistle je to druhý konec stejné osy.
- Simulace: parametr. Hypotéza: slabý ±0 %, silný −5 %.
- Náročnost: S · **Vychází z:** B11 (Klidný let).

### 5.3 Proč žádná volba nemá dominovat
| Hráč | Pravděpodobně nejlepší | Proč ne vždy |
|---|---|---|
| slabý | Paper Rocket / Cushion | malý zisk, ale jistý |
| střední | Paper Rocket nebo Whistle + Calm Sky | podle chuti |
| šikovný | Dive + Sharp Edge | pády a užší okna |
| sběratel komba | Whistle + Sharp Edge | minutí nuluje |
MC cíl: rozdíl mezi nejlepší a druhou volbou ≤ 8 % v minutách do cíle pro každý profil (§10).

---

## 6. Vítr, plující QTE a kombo

#### Z1 — Tempo π a doba ve vzduchu (základ)
Viz §2.2–2.3. **Vychází z:** review §4.1–4.3, rozhodnutí `06` (varianta B, rychlost roste s bonusy). Náročnost M (`createFlight`, `integrate`, `resolve`).

#### Z2 — Zrychlení klouzání (zdarma)
- Mechanika: když neběží žádná událost, další nezačne do 1 s a vlaštovka klesá, běží simulace 1,4× rychleji (plynulý náběh 0,3 s). Časování událostí běží 1× (QTE se nemění). Ve scéně jemné rychlostní čáry.
- Účinek (sonda): střední let na konci 34 s → ~30 s skutečného času, v D1 24 → 21 s.
- Rizika: zrychlený pohyb může působit nervózně. Proto jen 1,4× a vypnout při reduced motion.
- **Vychází z:** review §4.3 a skupina 19 („zrychlení zdarma, ne karta“), E07 a B09 (placené varianty vyřazeny).

#### Z3 — Vítr (slabý, každý hod jiný, ukázaný před hodem)
- Mechanika: seed hodu vybere `w` ze sady {−.12, −.08, −.04, 0, +.04, +.08, +.12} (váhy 1-2-3-3-3-2-1). Vítr = `w · cruise · π`, plnou silou až od 25 m výšky, níž slábne (u země je klid). Účinek na dolet ±2–6 % (sonda).
- Před hodem: šipka u Dílny a text **Calm / Light tailwind / Tailwind / Light headwind / Headwind** a „≈ +4 %“. Ve výsledku řádek „Wind +3 %“.
- **Zjištění ze sondy:** vítr v tomto modelu **nemění nejlepší úhel** (25–26° při jakémkoli větru, i se střihem větru podle výšky). Úhel by se posunul jen umělým pravidlem (posun `ideal`), které ale mění dolet o ±20–30 %, tedy ne „slabý“ vítr. Návrh proto úhel neřeší. Vítr je malá proměnlivost a krátké vzrušení před hodem. Rozhodování k němu přidá Pinwheel (A03) a Paper Rocket.
- Lokální vítr v docích a padavý vítr v sedle (SV07, SV10) **ne**: slabý vítr všude stejně, čtvrti mají svou povahu v událostech (§7).
- **Vychází z:** DQ-10, SV07. Náročnost S.

#### Z4 — Plující střed QTE a odpuštění
- Mechanika: každá událost dostane ze seedu posun středu: poryv ±0,25 s v pruhu, holub cílová výdrž 0,6–0,95 s. Šířka oken se nemění. Náběh: první 3 hody bez posunu, potom posun roste lineárně do 15. hodu. Zóna je na kruhu vždy vidět, takže hráč reaguje na to, co vidí, a nepočítá naslepo.
- **Odpuštění předčasného stisku (DQ-18):** stisk do 0,12 s před oknem se počítá jako stisk na okraji okna.
- **Švih (DQ-04):** zóna ±90 ms na vrcholu nabití dá výhozu ×1,05. Od 4. hodu.
- **Asistence zdarma (DQ-13, DQ-14):** širší okna, automatické QTE. Bez trestu, vypnuté rekordy se neoznačují.
- **Vychází z:** DQ-01, DQ-18, DQ-04, DQ-13, DQ-14, DQ-15 (kalibrace, až s plujícím středem).

#### Z5 — Kombo (základ, za letu)
- Mechanika: úspěch +1, perfekt +2, minutí 0. Bez bonusu: +5 % push za krok, max 3 kroky. Crowd Chain (A02) zvedá krok a strop. Kombo končí s letem a mezi lety se **nepřenáší**. Není to denní série (P13).
- Anglicky „Combo ×3“, ne „streak“ (aby se to nepletlo se sériemi dní).
- **Vychází z:** DQ-03.

#### Z6 — Jedno tlačítko (pravidlo)
1. Během varování, interakce a 0,3 s po vyhodnocení patří tlačítko události (stisk ve varování se ignoruje, jako dnes).
2. Jinak patří aktivní schopnosti, pokud nějaká je.
3. Běží-li schopnost, další událost počká (max 2 s). Dive se při startu události sám vybere.
4. Pod 8 m události nezačínají (prostor pro Cushion a Low Pass).
5. Nové sloveso se zavádí vždy samo a s jednou větou (U3).
Slovesa ve hře: tap (poryv, hvězda), hold (holub), tap-tap (pára), tap in place (termika, dron), schopnost (hold / tap). **Vychází z:** review §4.6.

#### UX karty (krátce)
- **U1 Náhled:** „≈ +X m · past <place>“ u každé koupě, přehráním posledního hodu (D01, E10, D16 jako jedna věta „Your angle would give more than this upgrade“).
- **U2 Karta čtvrti:** po prvním příletu do čtvrti jedna obrazovka (pohlednice, postava, nový papír, nové kapsové bonusy). Dvě rovnocenná tlačítka „Keep flying“ / „Done for today“ (SV04, E14).
- **U3 První setkání:** u nové události zpomalení 0,5× během varování, jedna věta a širší okno při prvním výskytu. Max jedna novinka za hod.
- **U4 Výsledek:** max 3 řádky: dolet + rekord, **jedna řádka rozpisu** („You 62 % · Plane 31 % · Wind/Luck 7 %“, detail na klepnutí, DQ-16), teaser dalšího místa („Next: Wind Ridge · 214 m to go“, SV03). Hláška postavy nebo vtip o dopadu nahradí třetí řádek, pokud je nová.

---

## 7. Postavy a události podle čtvrtí

Tón: suchý, laskavý humor, neonové město, nikdo hráče nepřemlouvá k dalšímu hraní (P13, SV17 riziko). Každá hláška zazní ve výsledku jen jednou, pak je k přečtení v Atlasu.

### 7.1 Postavy (1 na čtvrť, 3 hlášky)
Hlášky se odemknou: 1 = první přílet do čtvrti, 2 = 3. místo čtvrti, 3 = první přelet do další čtvrti (u Zippyho finále).

**Bolts** (Violet Suburbs) — vysloužilý doručovací robot, zametá střechy tržnice. (dekorace `robot`)
1. "Oh. A paper plane. I used to deliver parcels. Then they invented you."
2. "I logged your flight as 'weather'. Nobody reads my logs anyway."
3. "Past the railway already? Send me a postcard. I'll pretend it's for me."

**Marge** (Moon Docks) — jeřábnice, čtyřicet let v kabině jeřábu, termoska čaje. (dekorace `cargo`, A06)
1. "Mind the hooks, love. They don't mind you."
2. "Forty years lifting containers. You're the first thing that ever lifted my mood."
3. "That's the lighthouse. Past it, the sea stops being my problem."

**Stella** (Red Horizon) — astronomka z observatoře. (A12)
1. "Statistically, you're a comet. Emotionally, you're a sheet of A4."
2. "I named a star after you. It's very small. You'll get along."
3. "From up here the city looks like spilled sugar. Go on, it's not far now."

**Zippy** (Neon Core) — reklamní dron, který by radši byl holub. (dekorace `drone`, A13, A15)
1. "BUY NOW! ...Sorry. Reflex. Hi."
2. "I'm contractually a billboard. In my heart, I'm a pigeon."
3. "Rooftop Harbor is right ahead. Fly well. Not for the sponsors. For you."

### 7.2 Holubi a poryvy podle čtvrti
Mechanika se nemění, mění se jméno ve varování, drobný vzhled a hláška po úspěchu / minutí.

| Čtvrť | Holub (hold) | Poryv (tap) |
|---|---|---|
| **Violet Suburbs** | **Cyber Pigeon** (s bagetou). Úspěch: "Coo. Carbs delivered." Minutí: "The pigeon kept the baguette." | **Market Vent**. Úspěch: "Smells like dumplings. Feels like lift." Minutí: "Just steam and regret." |
| **Moon Docks** | **Courier Gull** (s rybou). Úspěch: "Express delivery. Fish not included." Minutí: "The gull had other priorities." | **Funnel Draft** (komín lodi). Úspěch: "Full ahead!" Minutí: "The ship didn't notice." |
| **Red Horizon** | **Stargazer Pigeon** (s mapou hvězd). Úspěch: "It knows a shortcut." Minutí: "It was looking at Venus." | **Turbine Wake**. Úspěch: "Renewable boost." Minutí: "The turbine shrugged." |
| **Neon Core** | **Drone Pigeon** (s reklamním praporkem). Úspěch: "Sponsored lift!" Minutí: "Ad skipped." | **AC Exhaust** (z mrakodrapu). Úspěch: "Warm air, cool move." Minutí: "Climate control declined." |

### 7.3 Nové události podle čtvrti (vzhled)
| Událost | Suburbs | Docks | Horizon | Core | Nápověda při prvním setkání |
|---|---|---|---|---|---|
| Steam Hop | Kettle Chimney | Tugboat Puff | Freight Train | Noodle Bar Steam | "STEAM HOP · Tap on each puff" |
| Thermal | Rooftop Heat | Warm Silo | Ridge Thermal | Server Farm Heat | "THERMAL · Tap in the bright core" |
| Ad Drone | Delivery Drone | Survey Drone | Weather Drone | Ad Drone | "AD DRONE · Tap right before you hit it" |
| Shooting Star | – | – | Shooting Star | Falling Satellite (vtip) | "SHOOTING STAR · Tap when it crosses the ring" |

Nápovědy aktivních schopností: "DIVE · Hold to dive, let go to pull up", "CUSHION · Tap just above the ground", "WHISTLE · Tap to call the next bird", "PAPER ROCKET · Tap to boost (2 left)".

---

## 8. Mezery z review

### 8.1 Humor při pádu
Pád je nejčastější okamžik hry. Návrh:
- **Vtip o dopadu** (25 % dopadů, každý jen jednou, pak už jen v Atlasu u čtvrti). Podle čtvrti:
  - Suburbs: "Landed in a noodle bowl. The noodles were fine." · "Parked on a sleeping cat. The cat allowed it." · "Stuck in a satellite dish. Now receiving 400 channels."
  - Docks: "Landed on a seagull. Mutual surprise." · "Into a crate marked FRAGILE. Ironic." · "Caught by a fisherman. Released."
  - Horizon: "The cows were briefly impressed." · "Landed in a haystack. Still no needle." · "A wind turbine waved."
  - Core: "Landed on a taxi. The meter's running." · "A billboard ate you. You're on the menu now." · "Stuck to a hologram. It was mostly air."
- **Stone Skip** a **Packing Tape** dávají neúspěchu tvar (odraz, páska).
- **Pravdivá těsnost:** „37 m short of Wind Ridge.“ Jen pravda, žádný vyrobený near-miss (P10).

### 8.2 Velký moment na hranici čtvrti
1. **Za letu:** kamera se na 1,5 s oddálí, přes oblohu se rozsvítí název čtvrti neonem v barvě čtvrti, stopa vlaštovky změní barvu. Let pokračuje bez zastavení.
2. **Po dopadu (poprvé):** Karta čtvrti (U2): pohlednice, první hláška postavy, „**Kraft Paper** is in the Workshop“, nové bonusy v kapsách („New in your pockets: **Dive**“).
3. **V Dílně:** nový druh papíru změní vzhled vlaštovky už při prvním nákupu.

### 8.3 Překvapení bez odměny
Vzácné gagy ve scéně (asi 1 za 5–10 hodů, každý jinde), nic nedávají:
- kočka na střeše Dílny sleduje vlaštovku hlavou,
- z okna v předměstí vyletí cizí papírová vlaštovka a 2 s závodí vedle,
- nad observatoří jednou blikne UFO (Stella: "I didn't see that. Officially."),
- maják na chvíli posvítí za vlaštovkou,
- billboard ve Core po novém rekordu napíše "NICE THROW".
Shooting Star (A12) je jediné překvapení s odměnou a je přiznané v rozpisu.

### 8.4 Konec hry a co po něm
- **Finále:** po přeletu 4 876 m se let zpomalí, kamera se oddálí na celé město, 16 míst se postupně rozsvítí, čtyři postavy řeknou po jedné větě (např. Zippy: "No ad break. Just you."). Titulek: **"Delivered."** Pak **"The Workshop is yours."**
- **Po konci (Encore, A16):** Night Route (druhé kolo trasy v noci, mince dál platí na zbylé úrovně), rekordy úseků („Most places in one throw: 17“, „Best combo: ×9“), volné létání bez cílů. Nic denního, žádný žebříček (P13).

### 8.5 Představení nových věcí
- U3: zpomalení, jedna věta, širší okno při prvním setkání, max jedna novinka za hod.
- V Atlasu má každá karta smyčku 3 snímků „jak to vypadá“.
- Nová úroveň v Atlasu i v Dílně má náhled (U1).
- Kapsové bonusy: první nasazení ukáže při míření jednu větu nápovědy (§7.3).

### 8.6 Zvuk (samostatné téma)
Zvuk je podle P11 pravděpodobně největší mezera ve feelu. Návrh na něj počítá (tik časování, rytmus páry, ozvěna Echo, stoupající tón komba, vítr, znělky čtvrtí), ale **nesmí nést jedinou informaci**. Všechno musí jít i vidět. Řešit samostatně.

---

## 9. Co se z 1. kola nepoužilo a proč

**Vyřazeno už v review a zůstává vyřazeno:** D06, D07, D09, D10, D11, D15, B09, B10, B12 (jen jako inspirace S3), B13, B14, B15, B16, B18, B19, DQ-17, SV16, SV22, SV23, E07, E11, E16.

**Vyřazeno rozhodnutím uživatele (`06`):**
- SV05 a SV22 (startovní schránky): zvolena varianta B.
- SV12 (dopisy paní Vlasty), SV11 (známky ve vzduchu): bez příběhu a sbírek.
- SV06 + E13 (zakázky „doruč do zóny“), SV13 + E12 (výzvy): volitelné výzvy nejsou žádoucí, pokud nebaví samy. Při vysokém tempu je přesné přistání navíc spíš loterie.
- SV14 + E19 (vzory papíru za mince): sbírka. Vzhled vlaštovky nese druh papíru (W2).

**Nepoužito v tomto návrhu:**
- D08 Falcon (třetí model): Sharp Edge a Dive už obslouží šikovného hráče a dva modely stačí na ladění. Vrátit po MC.
- DQ-05 Second Breath: těžko se vysvětluje. Nejdřív ověřit Švih.
- B03, B04 (těžký / lehký papír): v modelu tempa by jen vyměňoval čas za dolet a to řeší zrychlení klouzání.
- B07 (pevná síla): jen jako asistence (DQ-14).
- B17 (rezervní arch): při letech kolem 30 s není potřeba.
- DQ-09 (bouřka), SV07, SV10 (místní vítr): překážka typu „méně špatně“. Déšť v docích zůstává kulisou.
- D03 + D04 (rozdělení přehybů): stačí 3 větve s většími kroky.
- E01, E02, E04, E15, SV02, E03 (další zdroje mincí): odměna zůstává `10 + dolet/10`, nálezné = úroveň 1 zdarma. Jeden zdroj a tři způsoby utrácení (review §4.4).
- E05, E08, E14, E17: sloučeno do Atlasu a karty čtvrti.
- B01, B02, B20, B21, B22, D02, D16, E10, SV20: přepsáno do kapes, náhledu a jedné řádky výsledku (B22 a D13 + E18 jako nástroje MC).

**Použito (pro kontrolu):** D01, D05, D12, D13, D14, D17 (nahrazeno výměnou zdarma), D18, B06, B08, B11, DQ-01, DQ-02 (tik zdarma), DQ-03, DQ-04, DQ-06, DQ-07, DQ-08, DQ-10, DQ-11, DQ-12, DQ-13, DQ-14, DQ-15, DQ-16, DQ-18, SV01, SV03, SV04, SV08, SV09, SV15, SV17, SV18, SV19, SV21, E06, E09, E10, E14.

---

## 10. Plán pro Monte Carlo

### 10.1 Co je potřeba doplnit do simulátoru
Do nového skriptu (např. `simulation/progression.mjs`), aby nepřepsal dnešní reporty. RNG streamy hráče, letu a událostí oddělit (známý problém z `CLAUDE.md`).
1. **Model letu 1.0:** π, β, výtrysky, push E se stropem, S ze slotu, `y0`, vítr se střihem, nové hodnoty Power / Folds a přeladěný Glider. Ideálně jako parametry v `config.js` a `core.js`, aby hra a simulace sdílely kód.
2. **Kampaň po místech:** odemčení bonusu při rekordu ≥ začátek místa, druhy papíru po čtvrtích, kapsy 600 / 3 500, odemčení speciálních po čtvrtích.
3. **Události:** směs s vahami (gust 2, bird 2, steam 1, thermal 1, drone 1), Shooting Star, plující střed, kombo, Packing Tape, Echo, Gull Escort, pravidlo „pod 8 m nic nezačíná“.
4. **Boti pro schopnosti:** Dive (DQ-11), Cushion (DQ-12), Whistle (píská při kombu ≥ 2), Paper Rocket (u hranice, jinak na konci). Chyba časování podle profilu.
5. **Nákupní strategie:** vyvážená (přínos na minci), Paper napřed, Atlas napřed, nejlevnější, náhodná. Volba kapsy: každý speciální bonus zvlášť pro každý profil (matice B22).
6. **Čas:** simulovaný let, skutečný čas se zrychlením klouzání 1,4×, 8 s UI na hod, +4 s za kartu čtvrti.
7. **Profily:** dnešní `SKILLS` (slabý, průměrný, dobrý, expert) + asistence (DQ-13, DQ-14) pro slabého.

### 10.2 Metriky a cílové hodnoty
| Metrika | Cíl |
|---|---|
| Hody na čtvrť (medián, průměrný hráč) | D1 25–35, D2 20–30, D3 20–30, D4 20–30 |
| Minuty na čtvrť (skutečný čas) | D1 12–18, D2 10–16, D3 12–18, D4 14–20; celkem 50–75 min |
| Slabý hráč | 100 % běhů dojde do cíle do 250 hodů; celkem ≤ 1,4× průměrného |
| Expert | ≥ 0,7× hodů průměrného (šikovnost středně: expert / slabý 0,6–0,75) |
| Délka letu (skutečná) | medián D1 ≤ 22 s, D2 ≤ 27 s, D3 ≤ 30 s, D4 ≤ 35 s; P90 ≤ 45 s; žádný let > 60 s |
| Sucho bez novinky | hodů bez nového místa ani koupě: medián ≤ 4, max ≤ 8 |
| Mezi místy | medián ≤ 8 hodů, P90 ≤ 14 |
| Kapsy | v každém profilu nejlepší vs. druhý speciální bonus ≤ 8 % v minutách do cíle; každý bonus je nejlepší aspoň v jednom profilu nebo situaci |
| Dive | pády slabý ≤ 15 %, expert ≤ 3 %; vysoké vybrání ±2 % |
| Strategie nákupu | Paper napřed ≤ 10 % rychlejší než vyvážená; Atlas napřed ≤ 20 % pomalejší |
| Atlas | každý bonus s úrovní na úr. 3 dává ≥ 3 % a ≤ 15 % doletu (je cítit, nedominuje) |
| Koše | strop E zasažen v ≤ 20 % letů, strop β v ≤ 25 % |
| Model | podíl kluzáku u vyváženého hráče 30–70 % |
| První kapsa | koupena mezi 20. a 40. hodem (medián) |
| Mince v cíli | 60–85 % všech úrovní koupeno |

### 10.3 Citlivost
Krok papíru ±10 %, zrychlení klouzání 1,0 / 1,4, ceny ×0,8 / ×1,25, pravděpodobnost Shooting Star, rozestup událostí. Výstup: tabulka křivky jako v §2.4 a kampaně jako v §2.6.

---

## 11. Otevřené otázky pro uživatele

1. **Jak rychlé mají být poslední hody?** Aby vlaštovka doletěla 4,9 km a let nebyl dlouhý, musí na konci letět opravdu rychle. Návrh: poslední hody trvají asi **30 s** a vlaštovka přeletí jedno místo za 2 s (město se míhá, kamera se oddálí). Druhá možnost: **45 s** a místo za 3 s, klidnější, ale celá hra o ~15 minut delší. Co je ti bližší?

2. **Smí se klidné klouzání zadarmo zrychlit?** Když se zrovna nic neděje (žádný holub ani poryv), let by běžel 1,4× rychleji. Události by běžely normálně. Ušetří to asi 10–15 % času u každého hodu. Nevýhoda: pohyb může působit uspěchaně. Ano, ne, nebo jen jako volba v nastavení?

3. **Smím předělat Dílnu?** Dnes je „Kvalita papíru“ jen o klouzavosti. Návrh z ní dělá **žebřík rychlosti s druhy papíru**: kancelářský → balicí (Kraft) → japonský (Washi) → neonová fólie. Každý nový druh se otevře v nové čtvrti a vlaštovka podle něj změní vzhled. Síla a Přehyby by místo 5 úrovní měly 3 větší. Je to největší změna proti dnešní hře.

4. **Co po přeletu celé trasy?** Návrh: finále (rozsvícené město, poslední věty postav, „Delivered.“) a potom **noční kolo** trasy s rekordy úseků („nejvíc míst jedním hodem“) a volné létání. Nebo stačí finále a hra je hotová?

5. **Je rozdíl mezi slabým a šikovným hráčem správně velký?** Podle sond dojde slabý hráč do cíle asi za **140 hodů**, průměrný za **115** a šikovný za **95**. Šikovnost tedy ušetří zhruba třetinu hodů. Pomáhá i „Packing Tape“: minutá událost dá aspoň část účinku. Chceš rozdíl takhle, víc (šikovnost víc odměnit), nebo méně (pohodovější hra)?
