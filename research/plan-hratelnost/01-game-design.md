# Plán hratelnosti po hraní tvůrce: game design (QTE, události, tok novinek, revize obsahu)

**15. 10. 2026, game designer.** Odpověď na poznámky tvůrce (`research/playtest/2026-10-15-poznamky-tvurce.md`), výklad N1–N10 (`2026-10-15-vyhodnoceni.md`) a rozhodnutí 06 „Poznámky tvůrce z hraní“ body 1–6 (závazné; „kolo“ = skoro každý hod). Souběžně: product-designer (UI, celá obrazovka, menu), art-director (postavička, záběr, styl), balance-analyst (čísla). Jejich soubory tady neměním, jen na ně odkazuji.

**Konvence.** Návrh česky, herní texty EN / CS. Čísla jsou zástupná, ověřuje je balance-analyst v `simulation/progression/` (§6). Pracnost **S** do půl dne, **M** 1–2 dny, **L** 3–5 dní, rozpad data / logika / 3D / UI / texty. **Odhady délky, četnosti a pracnosti jsou NOT ASSESSED**, nic tady není změřené simulací.

**Podklady:** `06-rozhodnuti.md` (přednost), `08-navrh-kolo2.md` (model letu, Atlas, kapsy), `13-rippleloop.md` (3. kolo: strom malých uzlů, Boost taps), `research/obsah/01–05`, `research/atlas/01-navrh-atlasu.md`, KB P1–P15, kód `src/events.js`, `src/core.js`, `src/config.js`, `simulation/progression/model.mjs`, `params.mjs`.

---

## 0. Shrnutí

1. **Proč dnes QTE zachrání vlaštovku u země (N1):** ve hře (`src/events.js`) dává zásah **pevnou** pomoc nezávislou na stavu letu: poryv `vx += 1,5`, `vy += 2`, holub drží vlaštovku 0,8–1,1 s a nastaví `vx ≥ 10`, `vy ≥ 0,4` (stoupání). Události chodí každé 4–7 s až do 10 za let a **ve hře nemají výškový práh** (simulátor ho má, 8 m). Pomalá vlaštovka 2 m nad zemí tak dostane stejnou pomoc jako rychlá po výhozu a každé další QTE ji znovu zvedne.
2. **Návrh N1:** účinek zásahu násobí **síla letu Q**. Q je podíl „kolik by vlaštovka ještě uletěla sama“ (přebytek rychlosti + výška) vůči dobrému výhozu stejné výbavy. Rychlá a vysoko = Q až 1,25 (letí dál než dnes), pomalá u země = Q 0,15 (zásah skoro nic). Pod 8 m událost nezačne vůbec. Čistě rychlost (vx) jako měřítko nestačí: Glider, Kite a Sail startují skoro na cestovní rychlosti a měly by pak QTE vždy slabé (§2.2).
3. **Návrh N2:** každá událost má **jednu roli** s ikonou: **→ Rychlost, ↑ Výška, × Kombo, ◈ Mince**, plus jedna událost s volbou (prachový vír) a vzácná hvězda. Výskyt už není los 50/50, ale **skladba letu**: první slot vždy → (odmění dobrý výhoz), pak ↑, dál „sáček“ čtvrti bez opakování, nově odemčená událost zaručeně v dalším letu. Při míření je vidět **předpověď** (ikony prvních 3 událostí), volitelně **Plán letu** (hráč zvolí, které roli dá přednost).
4. **N3/N4:** pořadí **Dílna (Power, Paper, Folds) → Atlas po doletu na Market (305 m)** sedí s 06 B1, čísla zajistí, že na Market potřebuje hráč 3–5 základních nákupů. „Skoro každý hod něco“ unese jen **strom malých uzlů z 3. kola (13 §6.3)**: v D1 nákup po každém hodu, novinka (A) každý 2.–3. hod. Konkrétní tok prvních 20 hodů a šablona rytmu na místo jsou v §4.
5. **Kde hra dnes selhává:** ve hře je jen starý strom 3 × 5 úrovní (ceny 35–420 ◈), žádný Atlas, místa, kapsy, papíry ani nové události. Po ~8 nákupech stojí další úroveň 4–8 hodů příjmu a mezi nimi se nic nového nestane. Proto „házet pořád dokola“. Nový systém je hotový jen v simulátoru.
6. **N10 upřímně:** obsahu je na 90 min **skoro dost**, chybí hlavně **rozložení** a **jasné role událostí**. Navrhuji: ponechat jádro (fronta novinek, rekordy, Hejno, vír, zastávky, Mailbag, suvenýry, Hawk, Kite), **zjednodušit** varianty událostí (4 místo 5, varianta dědí roli), **povýšit** Lampiony a Předpověď, **odložit** kousky až po N1/N2 a nově změřit, **odložit** Skimmer (BLOCKED), **škrtnout** Rádio a papírového holuba (§5).
7. **Pořadí:** výškový práh hned i ve staré hře → síla letu Q a role v simulátoru → skladba letu a předpověď → nový systém progrese ve hře (strom malých uzlů, Atlas) → obsah 05 podle revize (§7).

---

## 1. Diagnóza: co dnes hra dělá a co simulátor

| Věc | Hra dnes (`src/`) | Simulátor (`simulation/progression/`) | Dopad na poznámky |
|---|---|---|---|
| Účinek poryvu | `vx += 1,5·q`, `vy += 2·q` (perfekt ×1,25) | `vy += 2·q`, `vx += 1,5·π·(1+E)·perfekt·S` | pevná pomoc, nezávislá na stavu letu (N1) |
| Účinek holuba | nese 0,8 / 1,1 s, `vx = max(10, vx)`, `vy = max(0,4, vy)` | totéž + push | holub u země = vlaštovka stoupá znovu (N1) |
| Výškový práh | **žádný** | události pod 8 m nezačnou (`eventMinY`) | ve hře QTE i 1 m nad zemí (N1) |
| Počet a rozestup | až 10, mezera 3 s (první 3), pak 4–7 s | až 12, stejné mezery | „pořád dokola“ (N1, N2) |
| Výběr typu | `rng < 0,5` poryv / holub, ne 3× totéž | váhy 2:2:1:1:1 (pára, termika, dron po odemčení) | náhoda bez role (N2) |
| Progrese | 3 větve × 5 úrovní, ceny 35/105/195/300/420, odměna `10 + dolet/10`, „dokončeno“ na 500 m | Dílna (Power 3, Folds 3, Paper 12), Atlas 16 míst, kapsy, Mailbag | ve hře nic mezi nákupy (N3) |

**Závěr:** N1 je z velké části chyba převodu (ve hře chybí výškový práh ze simulátoru) a z části chyba návrhu (pevný účinek nezávislý na stavu letu má i simulátor). N3 je hlavně tím, že nový systém ještě není ve hře.

---

## 2. N1: účinek QTE podle síly letu

### Karta QS1 — Síla letu / Flight power (jádro)

- **Cíl:** zásah zesiluje to, co vlaštovka má. Dobrý výhoz a udržené tempo se vyplatí, pomalou vlaštovku u země QTE nezachrání.
- **Pravidlo:**
  1. **Zbývající dolet bez pomoci** (metry):
     `D = max(0, vx_air − cruise) / drag  +  max(0, y_eff − y_low) · glide`
     - první část = jak daleko ještě unese přebytek rychlosti (rychlost doznívá k `cruise` s `drag`),
     - druhá část = jak daleko doklouže z výšky, `y_eff = y + max(0, vy)² / 2g` (stoupající vlaštovka započte i výšku, kterou ještě nabere), `y_low` = 3 m,
     - `vx_air = vx − vítr` (vítr do zad sílu nezvedá, Sail se nezdvojí), `cruise`, `glide` jsou aktuální hodnoty výbavy včetně π a β.
  2. **Referenční dolet** `D_ref` = `D` ve chvíli výhozu pro **vzorový hod** téže výbavy (síla 0,75, ideální úhel, bezvětří). Spočítá se jednou na výbavu, deterministicky (jako `bestAngle`).
  3. **Síla letu** `e = D / D_ref`. **Účinnost** `Q = clamp(e / e_full, Q_min, Q_max)`, zástupně `e_full = 0,6`, `Q_min = 0,15`, `Q_max = 1,25`.
  4. **Q násobí celý účinek zásahu:** vodorovný push, svislou část (poryv, pára, termika, dron), dobu nesení holuba, výtrysky z událostí (pára úr. 3). Hodnotí se **ve chvíli vyhodnocení**, ne při varování. Kombo, perfekt, E, S, `perfectK`, `liftK` zůstávají a násobí se jako dnes.
  5. **Holub bez podlahy rychlosti:** `vx = max(10, vx)` se ruší (pevné číslo nepatří do světa s π). `vy = max(0,4·Q, vy)`, nesení `0,8·Q` s (perfekt `1,1·Q`). Pomalý holub tedy vlaštovku krátce přidrží, ale nevyzvedne.
  6. **Výškový práh (QS2 níže):** pod 8 m událost **nezačne**. Čekající události pak už nepřijdou (vlaštovka jen klesá), let končí čistě.
- **Ilustrace (Dart, π 1, hod 0,75, bez událostí; NOT ASSESSED, ruční výpočet):**

| Chvíle letu | y | vx | D | e | Q | Poryv dnes → s Q |
|---|---:|---:|---:|---:|---:|---|
| výhoz | 12 m | 19 m/s | ~130 m | 1,00 | 1,25 | – |
| 1. událost (1,5 s) | 19 m, stoupá | 17,7 | ~119 | 0,92 | **1,25** | +25 % proti dnešku |
| střed letu (6 s) | 16 m | 14,9 | ~74 | 0,57 | **0,95** | skoro jako dnes |
| konec letu (10 s) | 5,5 m | 13,4 | ~28 | 0,22 | – | **událost nezačne** (pod 8 m) |
| konec letu, 9 m | 9 m | 13,4 | ~39 | 0,30 | **0,50** | poloviční |

  Glider (`speed 14`, ideal 30°) má přebytek rychlosti malý, ale výšku velkou: `D_ref ≈ 99 m`, z toho ~90 m z výšky. Měřítko „zbývající dolet“ je proto férové pro všechny modely (§2.2).

- **Proč je to zábavné:**
  - **Hod je investice:** dobrý výhoz (síla u vrcholu, švih) → první poryv vlaštovku vystřelí → kamera se oddálí → další události jsou silné. Série zásahů drží tempo, minutí ho nechá doznít. Let dostane oblouk „rozjezd, vrchol, dosednutí“ místo „pořád stejná pomoc“ (P1: odezva podle výkonu).
  - **Konec letu je konec:** dosednutí nikdo neprodlužuje donekonečna. Pomalé klouzání nad střechami je chvíle na pohled na město (živý svět 60–70 % času, 13 §6.1), ne čekání na další záchranu.
  - **Je to vidět:** šířku záběru už řídí přebytek rychlosti nad cestovní rychlostí výbavy (06, kamera bod 3). Široký záběr = silné QTE. Hráč to pochopí bez čísla.
- **Vazba:** N1, 06 15. 10. bod 5; 06 „šikovnost středně“ (síla letu zvýhodní přesného hráče, hlídat poměr, §6); 06 kamera bod 3; 08 §2.3 (svislá část se neškáluje bonusy, tady ji škáluje stav letu, ne výbava); P1, P7 (hráč vidí, že rozhodl výhoz a jeho zásahy, ne los).
- **Zástupná čísla:** `y_low 3 m`, `e_full 0,6`, `Q_min 0,15`, `Q_max 1,25`, práh 8 m. Do `params.mjs` jako `events.power = {yLow, eFull, qMin, qMax}` (klíče navrhne game-dev).
- **Náhled (jak to hráč pozná předem):**
  - **Značka události** má tři stavy síly podle Q v okamžiku varování: plná (Q ≥ 0,9), poloviční (0,4–0,9), slabá (< 0,4). Rozlišené tvarem (tloušťka kruhu a 1–3 čárky), ne jen barvou (P15). Konkrétní podobu navrhne product-designer.
  - **Tutoriál (seed 1):** obě události přijdou brzy (1,5 s a ~4,5 s) při plné síle. Jedna věta po prvním letu, jen jednou: „Fast swallows ride events further.“ / „Rychlá vlaštovka z událostí vytěží víc.“
  - **Zásah se slabou silou** ukáže menší efekt (částice, hitstop, zvuk podle Q). Odezva roste se skutečným účinkem (P1, P2).
- **Okrajové případy:**
  - **Začátečník:** první dvě události jsou vždy v prvních ~5 s (rozvrh), kdy je Q vysoké. Slabší výhoz (síla 0,5) dá `e` ~0,8, Q skoro plné. Riziko „dvojího trestu“ (horší výhoz i slabší QTE) je malé, ale měří se (§6).
  - **Dive:** střemhlav převádí výšku na rychlost, `D` se tím skoro nemění. Ale `accel` Dive přidává rychlost „z ničeho“ (arkáda), takže událost hned po vybrání může mít Q nad 1. Strop `Q_max` to omezí. Když simulace ukáže, že se Dive před každou událostí vyplatí víc než o 5 %, počítat `vx_air` bez zbytku rychlosti nabrané střemhlavem (v duchu 06, Dive oprava 1).
  - **Paper Rocket, padající hvězda:** výtrysk posouvá `x`, ne `vx`, takže sílu letu nezvedá. Rocket zůstává vědomá záchrana z kapsy (2 náboje), ne opakovaná náhoda. Hlídat jeho podíl na doletu pod 8 m (§6).
  - **Boost taps (06, RippleLoop):** jen vodorovný výtrysk bez výšky. U země tedy přidá málo, sám sebe neopakuje. Pravidlo: Boost tap také × Q (jinak by se z něj stala nová záchrana u země). Rozhodne 3. kolo.
  - **Cushion, Packing Tape, Stone Skip:** jednorázové a zvolené v kapse nebo Atlasu. Tape (částečný účinek při minutí) × Q jako ostatní.
  - **Hawk `missK`:** minutí ubere 6 % `vx`, tím i Q pro další události. Trest se zdvojí, `missK` možná snížit na ~0,04 (simulace).
  - **Needle** (`drag 0,09`): přebytek rychlosti doznívá pomaleji, Q drží déle. Je to v duchu modelu (rychlost), ale hlídat ◈/min (01 §2.6).
  - **Automatika QTE:** běžný zásah × Q, bez perfektu, beze změny pravidla 06.
  - **Echo:** opakuje podíl skutečného pushe (už × Q).
- **Zneužití:** žádná nová páka: Q nejde zvednout ničím jiným než výhozem, zásahy a výškou. Strop `Q_max` brání tomu, aby vlaštovka „odletěla“ při sérii perfektů s Echem a Gull Escort (strop E zůstává).
- **Pracnost:** simulátor: data S / logika **S–M** (`D`, `D_ref` s cache, Q v `effect()`, holub) / testy S. Hra: logika S (`events.js` po převodu nového modelu), UI **S–M** (tři stavy značky, efekty podle Q), texty S (1 věta EN + CS). **2–3 dny** včetně simulace. **Priorita: jádro.**
- **Rizika:** (1) kratší lety v pozdní fázi letu → kratší dolet → přeladit ceny (balance-analyst). (2) Větší rozptyl doletu (série zásahů se násobí). (3) Hráč nemusí pochopit, proč stejný zásah jednou dá hodně a jindy málo; proto stav značky a zvuk.

### Karta QS2 — Výškový práh i ve hře / Event floor (jádro, hned)

- **Cíl:** okamžitě odstranit „QTE metr nad zemí“, které tvůrce zažil.
- **Pravidlo:** jako v simulátoru: čekající událost se nespustí, když je vlaštovka pod 8 m (`P.physics.eventMinY`). Varování ani značka se neukážou.
- **Proč teď:** je to přenos pravidla, které simulace už měří (F3–F5), takže nemění balanc nového systému. Ve staré hře lety mírně zkrátí, to je žádoucí.
- **Okraje:** start je ve 12 m, první událost v 1,5 s je vždy nad prahem. Tutoriál (seed 1) beze změny. Skimmer (pokud zůstane) zažije méně událostí, to už 01 §2.4 počítá.
- **Pracnost:** logika S (`events.js` `updateEvents`, podmínka na `f.y`), test S. **0,5 dne. Priorita: jádro, první krok.** Kód mění game-dev, ne já.

### 2.2 Proč ne „násobek aktuální vx“ nebo pásma rychlosti

| Varianta | Jak | Proč ne (nebo proč jen částečně) |
|---|---|---|
| **A. Násobek vx** (`push = a · vx`) | push úměrný rychlosti | Ve hře se vx nikdy nedostane pod `cruise` (arkádový model, rychlost doznívá k cestovní). Pomalá vlaštovka u země má vx = `cruise`, tedy pořád plný push. Neřeší výšku, která je skutečný „zbytek letu“. Glider (vx 12 → 11) by měl push vždy stejný. |
| **B. Pásma podle `vx / cruise`** | pomalá / klouže / rychlá | Glider, Kite, Sail startují na 1,05–1,1 × `cruise`, byly by pořád „pomalé“. Trestá modely, které nesou výšku. |
| **C. Síla letu (QS1)** | zbývající dolet z rychlosti i výšky | Odpovídá tomu, co tvůrce popsal („ztrácím rychlost a jsem skoro u země“), funguje pro všechny modely, nezávisí na π (obě části rostou s π stejně). **Doporučeno.** |

Pásma z varianty B zůstávají jen jako **zobrazení** (tři stavy značky), počítají se z Q.

---

## 3. N2: role událostí a skladba letu

### 3.1 Role (jedna hlavní role na událost)

Pravidlo: každá událost má **jednu hlavní roli** (ikona) a vedlejší účinek nejvýš ~30 % hlavního. Místní varianty čtvrti (VA1) **dědí roli** základní události, mění jen rytmus a vzhled. Všechny účinky × Q (QS1), kromě ◈.

| Role | Ikona | Co dělá | Události (čtvrť, odkud) | Sloveso | Nejlepší chvíle | Model, který ji miluje |
|---|---|---|---|---|---|---|
| **Rychlost / Speed** | → | vodorovný push (přebytek rychlosti doznívá ~8 s), skoro bez výšky | **Poryv** (D1 základ), **Průvan** (D4 var.), **Ad Drone** (D4, místo 13, silný) | tap | brzy v letu, Q vysoké | **Needle** (`droneBurst`) |
| **Výška / Height** | ↑ | svislá část a nesení = delší let, malý push | **Holub** (D1 základ), **Racek** (D2 var.), **Skřivan** (D3 var.), **Termika** (D3, místo 10, silná), **Lampiony** (D4) | hold / tap in place | střed letu (výška se změní na dolet) | **Kite** (`liftK`) |
| **Kombo / Combo** | × | víc kroků komba (zesílí další push a mince, 06 kombo i mince), malý účinek sám | **Pára** (D1, místo 4, 2 obláčky = 2 kroky), **Hejno** (D2+, 3 ptáci) | tap-tap / hold ×3 | brzy, aby kombo pracovalo celý let | **Hawk** (`perfectK`) |
| **Mince / Coins** | ◈ | mince za tento hod, let nemění | **Spropitné / Tip** (nové, od Market, BLOCKED 1) | tap in place | kdykoli, Q se neuplatní | Mailbag (koš M) |
| **Volba / Choice** | ⇄ | hráč si vybere → nebo ↑ | **Prachový vír** (D3, EV2) | tap + tap na oblouku | podle cíle letu | Needle (→), Kite (↑) |
| **Vzácná / Rare** | ★ | výtrysk + kombo +2 | **Padající hvězda** (D3, místo 12) | tap | – | – |

**Změny proti dnešním číslům** (zástupně, přeladí simulace; dnes má každá událost výšku i push, proto „všechno dělá totéž“):
- Poryv: `dvy` 2 → ~0,6, push ×1,2. Holub: push ×0,4, nesení beze změny. Pára: `lift` 1,6 → ~0,8, `pushFull` 2,4 → ~1,2, kombo +2 / +4 (perfekt). Termika: push 3,0 → ~1,2, `dvy` beze změny. Dron: `dvy` 3 → ~0,8, push beze změny.
- Pravidlo 06 F3 bod 4 dál platí: nová událost má pro každý profil očekávaný přínos ≥ základní. Přínos se teď měří **v její roli** (→ dolet, ◈ mince, × kombo a jeho přínos v dalších událostech), ne jen doletem.

**Proč role:** hráč pozná, k čemu událost je, a výbava se dá skládat (Kite + ↑, Needle + →, Hawk + ×). Je to přesně „rozdělit podle účinnosti, jak moc pomůžou získat mince, vzdálenost nebo rychlost“ z poznámek. Bez rolí se pára, termika a dron liší jen tlačítkem.

### Karta SK1 — Skladba letu / Flight set list (jádro)

- **Cíl:** místo losu 50/50 promyšlený sled, ve kterém hráč pozná, co přijde a proč.
- **Pravidlo:**
  1. **Seznam slotů** (nejvýš 6 za let, dnes 10–12) se vytvoří při míření, deterministicky ze seedu hodu (`attempts + 1`) a výbavy. Kolik slotů hráč stihne, rozhodne let (dobrý let = víc událostí, to je přirozená odměna).
  2. **Slot 1** (1,5 s, Q nejvyšší): vždy **→** (poryv nebo místní varianta). Dobrý výhoz se hned zúročí.
  3. **Slot 2:** **↑** (holub nebo varianta), výška ve chvíli, kdy z ní ještě vzejde dolet.
  4. **Sloty 3+: „sáček“ čtvrti.** Sáček je pevná sada rolí (D1 např. `→ → ↑ ↑ × ◈`), zamíchá se seedem a **vybírá se bez vracení**; nový sáček až po vyčerpání. Sáček běží přes hody (číslo sáčku = `floor(počet slotů od začátku / velikost sáčku)`, odvozené z `attempts`, **bez změny save**). Za ~3 lety tak hráč potká každou roli v daném poměru, bez dlouhých děr a bez řad stejného (Tetris „7-bag“).
  5. **Typ podle místa:** sáček určuje **roli**, konkrétní událost (poryv / průvan / dron) se vybere až při startu podle čtvrti, nad kterou vlaštovka letí, a podle odemčení v Atlasu. Varianty tak zůstanou místní (VA1).
  6. **Nově odemčená událost** (místo v Atlasu, první setkání) je **zaručeně ve slotu 2 nebo 3 dalšího letu** (s první pomocí U3: zpomalení, širší okno, jedna věta). Odemčení = vidíš ho hned v dalším hodu.
  7. **Limity:** × Hejno nejvýš 1 za let, ◈ nejvýš 1 za let a nikdy ve slotu 1, ⇄ vír nejvýš 1 za let.
  8. **Padající hvězda** jde do sáčku D3–D4 jako vzácný kus (1 na 2 sáčky), **navíc** k ostatním (06 oprava 4: nikoho nevytlačí). Místo dnešní šance 8–16 % každý let = žádné dlouhé sucho bez hvězdy.
  9. **Rozestupy:** jako dnes (první 3 po 3 s, pak 4–7 s), práh 8 m (QS2).
- **Proč je to zábavné:** rytmus letu má stavbu (otevírák, střed, dosednutí) jako píseň. Hráč se učí, že první poryv je „jeho“ a že po odemčení místa uvidí novou věc hned. Méně, ale silnějších událostí (6 místo 10–12) proti „pořád dokola“. Varianty a sáček dávají pestrost bez náhody (P3: nejistota má nést obsah, ne los efektů; P9).
- **Vazba:** N2, 06 15. 10. bod 5, 06 F5 bod 2 (události navíc), 06 oprava 4, 05 §1.4 (opakování), VA1, KB 08 N6.
- **Zástupná čísla:** max 6 slotů; sáček D1 `→→↑↑×◈`, D2 `→↑↑××◈`, D3 `→↑↑⇄×◈★?`, D4 `→→↑↑×◈★?` (★ jen každý 2. sáček). Rozestupy beze změny.
- **Náhled:** předpověď při míření (PL1).
- **Okraje:**
  - Zrušený hod z pauzy (06 B2) nezvýší `attempts` → stejný seznam slotů, sáček se neposune. Nejde „přehazovat“.
  - Whistle přivolá další slot ze seznamu (ne náhodný typ).
  - Calm Sky (mezery ×1,6) projde méně sloty, pořadí zůstává.
  - Hody, kdy hráč v D1 ještě nemá ◈ nebo ×, sáček vynechá (role se nahradí → / ↑).
- **Zneužití:** seed hodu je pevný, zkoušet nejde. Hráč smí sledovat sáček a plánovat (je to záměr, ne zneužití).
- **Pracnost:** data S (sáčky v `params.mjs`) / logika **M** (`createEvents` v simulátoru i hře, výběr typu při startu, zaručené první setkání) / testy S / UI – / texty –. **2–3 dny. Priorita: jádro.**
- **Rizika:** příliš předvídatelné → stereotyp. Proti tomu: sáček míchá pořadí, varianty mění vzhled, plující střed (P9) dál mění časování.

### Karta PL1 — Předpověď letu / Flight forecast (jádro, BLOCKED 2)

- **Cíl:** hráč tuší, co přijde, a může podle toho zvolit model, kapsu nebo sílu hodu.
- **Pravidlo:** při míření malý pás u vlaštovky: **ikony rolí prvních 3 slotů** (→ ↑ ×), pravdivě ze seznamu. Ne konkrétní typ, ne časy. Zobrazí se od 2. hodu (1. hod je tutoriál). Spojí se s ukazatelem větru a rychlou volbou Sail do jednoho pásu (méně prvků na celé obrazovce, N8).
- **Proč:** volba vlaštovky dostane důvod u každého hodu („↑↑, beru Kite“), bez přepínání v Dílně (rychlá volba modelu = product-designer).
- **Změna proti 05:** BN2 Předpověď trasy byla rozšíření a kupovaný uzel Atlasu. Navrhuji ji jako **základ zdarma** (BLOCKED 2).
- **Okraje:** reduced motion: ikony staticky. Bez textu, s popiskem pro čtečku. Nová, ještě neviděná událost se ukáže jako „?“ s ikonou role.
- **Pracnost:** logika S (čtení seznamu) / UI **M** / texty S. **1–2 dny.**

### Karta PL2 — Plán letu / Flight plan (rozšíření, BLOCKED 2)

- **Cíl:** skutečná volba skladby: hráč dá jedné roli přednost.
- **Pravidlo:** od místa 3 (Gardens) při míření tři čipy podle odemčených rolí: **Fast / Rychlý (→)**, **High / Vysoký (↑)**, **Rich / Výdělečný (◈)**, od místa 4 i **Combo / Kombo (×)**. Zvolená role dostane v sáčku +2 kusy, ostatní po −1 (nejméně 1). Volba se pamatuje mezi hody (rychlý „Throw again“ ji nemění). Výchozí „Mixed“ (bez úpravy).
- **Proč je to zábavné:** spojuje roli s cílem: chybí 80 m k místu → Rychlý, šetřím na Kite → Výdělečný, mám Hawka → Kombo. To je odpověď na „hráč mohl volit“ a pomáhá N3 (hráč si sám zkrátí cestu k dalšímu nákupu nebo místu).
- **Vazba na 3. kolo:** nahrazuje větev „Courier“ (13 §6.3, holub častěji): místo kupovaného „víc holubů“ zdarma volba, žádná trvalá dominance.
- **Okraje:** změna plánu nemění seed hodu, jen sáček od dalšího sáčku (ne uprostřed), aby nešlo plán přepínat podle předpovědi a „vylovit“ si ideální sled. Předpověď ukazuje už sled podle aktuálního plánu.
- **Zneužití:** ◈ plán nesmí být výhodnější na mince než → plán (mince za dolet). Simulace: „vždy Rich“ a „vždy Fast“ nesmí být o víc než 5 % hodů rychlejší než „Mixed“.
- **Pracnost:** logika S / UI S–M / texty S. **1–2 dny. Priorita: rozšíření** (po playtestu PL1).

### Karta EM1 — Spropitné / Tip (jádro při BLOCKED 1 (a))

- **Cíl:** role ◈ dostane vlastní událost: šikovnost přímo v mincích, ne jen v doletu.
- **Pravidlo:** od místa 2 (Market). Obyvatel na střeše nebo balkoně vyhodí obálku se spropitným pro pošťáka, hráč ťukne, když je obálka v kruhu (tap in place, jako termika). Zásah = **+15 % odměny tohoto hodu** (perfekt +25 %), přičte se při dopadu a ve výsledku má vlastní řádek „+38 ◈ Tip“. Let nemění. Jen 1 za let. Místní tváře bez nového 3D: obálka je jeden model, mění se jen postavička z katalogu (soused, námořník, farmářka, prodavač lampionů).
- **Proč je to zábavné:** odměna za šikovnost vidět v penězích (P1, 06 „čísla mají být vidět“), drobná radost v každém 2. letu, a s Plánem letu volba „dolet, nebo mince“. Navazuje na téma pošty („Delivered.“).
- **Vazba:** N2 (role mince), 06 kombo zvyšuje mince, koš M (01 §2.11).
- **Proti inflaci:** spropitné se počítá **do koše M se stropem +50 %** (01 §2.11) a z odměny bez Mailbagu. Simulace: příjem kampaně se spropitným ≤ 1,08× bez něj (jinak menší podíl).
- **Etika:** žádná náhoda za mince (P12, P13): kdy přijde, říká skladba a předpověď, kolik dá, je pevné procento. Žádné „jackpoty“.
- **Okraje:** automatika: běžný zásah = +15 %. Hod s malým doletem dá málo (procento z malé odměny), takže nejde o spam krátkých hodů.
- **Pracnost:** data S / logika S–M / 3D S (obálka; postavičky z katalogu G2) / UI S / texty S. **2 dny.**

### 3.2 Vazba na bonusy Atlasu a vlaštovky

| Prvek | Role | Jak se mění |
|---|---|---|
| Crowd Chain (2) | × | kombo z × událostí, s Hejnem a párou nejsilnější |
| Steam Hop (4) | × | z „výška + velký push“ na kombo, úr. 2–3 delší výtrysk a + kombo |
| Gull Escort (8) | ↑ | nesení všech ↑ ptáků (holub, racek, skřivan) |
| Thermal (10) | ↑ | silné ↑, dvojitý sloup úr. 3 |
| Shooting Star (12) | ★ | v sáčku, ne los |
| Ad Drone (13) | → | silné →, dvojice úr. 3 |
| Echo (11) | všechny | opakuje push × Q |
| Packing Tape (5) | všechny | částečný účinek × Q |
| On Air (15) | × | β při kombu ≥ 3 |
| Hawk / Kite / Needle | × / ↑ / → | role = jejich specialita; „Loves:“ na kartě ukazuje ikonu role |
| Sail | vítr | bez role, volí se podle větru v tomtéž pásu jako předpověď |

---

## 4. N3, N4: skoro každý hod něco přinese

### 4.1 Pořadí odemykání (N4)
1. **Hlavní menu** jen Házet a Nastavení (06 B1).
2. **Po 1. hodu Dílna** jen se záložkou Vylepšení: **Power, Paper, Folds** (06 B1, 02 §3).
3. **Atlas po doletu na 2. místo Market (305 m).** Odpovídá 06 B1 („Atlas po prvním místě“) i poznámce N4 („musí splnit vzdálenost“). Podmínka pro čísla: první hod průměrného hráče ~210 m, expert ~250 m, **s 0 nákupy Market nikdo nedoletí** a průměrný potřebuje **3–5 základních nákupů** (simulace měří, §6). Doporučení: bez BLOCKED, je to už rozhodnuté B1, mění se jen čísla.
4. Dál podle 08 a 01: kapsa (~D1 konec), modely, Mailbag, papír další čtvrti na 3. místě čtvrti (06).

### 4.2 Co je „něco“ (definice z 05 §7.1, doplněná)
- **A novinka:** nové místo, zastávka, první setkání s událostí nebo variantou, nová role nebo funkce (Atlas, předpověď, plán), koupě vlaštovky, skin, první nasazení kapsy, finále.
- **B nákup:** uzel stromu, úroveň bonusu, Mailbag.
- **C drobnost:** osobní rekord (RK1), pravdivá těsnost („37 m short of Gardens“), razítko, hláška.
- **„Skoro každý hod“ = v každém hodu A nebo B, a k tomu cíl na další hod.** Výsledek hodu vždy ukáže **jeden nejbližší cíl** (nákup „Paper · 12 ◈ to go“, nebo místo „Gardens · 86 m“; product-designer rozhodne podobu, HUD za letu zůstává bez cíle podle 06 B3).

### 4.3 Prvních 20 hodů (průměrný hráč, zástupně, NOT ASSESSED)

Předpoklad: strom malých uzlů z 3. kola (13 §6.3) **v D1 už od začátku**: Power, Folds a Paper (1. druh) rozdělené na malé uzly, **cena dalšího nejlevnějšího uzlu ≈ 0,7–1,2× příjmu posledního hodu** (D1). Odměna `10 + dolet/10`. Market 305 m, Gardens 610 m, Railway 914 m.

| Hod | Dolet | ◈ | Novinka (A) | Nákup (B) | Drobnost (C) / cíl ve výsledku |
|---:|---:|---:|---|---|---|
| 1 | ~210 | 31 | tutoriál (→ poryv, ↑ holub); **otevře se Dílna** (jen Vylepšení) | Power ·1 (25) | cíl: Folds ·1 (30) |
| 2 | ~220 | 32 | **Glider** (100 m padlo už v 1. hodu, fronta FN1 ho odloží) | Folds ·1 (30) | |
| 3 | ~235 | 33 | **předpověď** při míření (PL1) | Paper ·1 (35) | rekord |
| 4 | ~255 | 35 | – | Power ·2 (35) | „Market · 50 m“ |
| 5 | ~275 | 37 | – | Paper ·2 (40) | rekord |
| 6 | ~295 | 39 | – | Folds ·2 (40) | těsnost „10 m short of Market“ |
| 7 | ~320 | 42 | **Market → Atlas** (pohlednice, Crowd Chain) | – (šetří) | |
| 8 | ~330 | 43 | **první Spropitné** (◈, zaručeně ve slotu 2–3) | Crowd Chain úr. 2 (40) | +6 ◈ Tip |
| 9 | ~350 | 45 | – | Paper ·3 (45) | |
| 10 | ~370 | 47 | razítko Gust (první perfektní poryv, tiše) | Power ·3 | nejdelší kombo |
| 11 | ~395 | 50 | – | Folds ·3 | |
| 12 | ~420 | 52 | – | Paper ·4 | rekord |
| 13 | ~445 | 55 | **Vzhled** v Dílně (razítko jako první kosmetika) | Power ·4 | |
| 14 | ~470 | 57 | – | Folds ·4 | |
| 15 | ~500 | 60 | – | Paper ·5 | „Gardens · 110 m“ |
| 16 | ~540 | 64 | (PL2 Plán letu, pokud je) | Power ·5 | |
| 17 | ~580 | 68 | – | Paper ·6 | těsnost |
| 18 | ~615 | 72 | **Gardens** (Pinwheel) | – | |
| 19 | ~630 | 73 | **světlý Kraft** v Dílně (fronta) | Pinwheel úr. 2 | |
| 20 | ~660 | 76 | první přetočení větru (Pinwheel) | Kraft ·1 | „Railway · 250 m“ |

**Čtení:** A v hodech 1, 2, 3, 7, 8, (10), 13, (16), 18, 19, 20 = **~9–11 novinek ve 20 hodech**, B v 17 z 20. Žádný hod bez A ani B kromě hodu 7 (ten má velké A). Cíl 05 §7.2 (sucho A P90 ≤ 6, bez A i B P90 ≤ 5) by D1 splnila s rezervou.

**Proč takové pořadí:** prvních 6 hodů je čistě „vylepšuj vlaštovku“ (N4), jedna nová věc (předpověď) jen v hodu 3, aby nezahltila. Atlas přijde jako velký moment a hned v dalším hodu ukáže první novou událost (◈), takže hráč spojí „nové místo = nová věc v letu“.

### 4.4 Rytmus po čtvrtích (šablona na jedno místo, D2–D4, ~10 hodů)

| Hod od místa | Co přijde | Druh |
|---:|---|---|
| +0 | místo: pohlednice, bonus úr. 1 | A |
| +1 | z fronty: papír / model k prodeji / Mailbag / suvenýr (jedno na hod) | A |
| +1 až +2 | **první setkání** s novou událostí místa (zaručeně, SK1 bod 6) | A |
| +2 až +4 | úroveň 2 bonusu místa, uzly stromu | B |
| +5 | **zastávka** v půlce místa (ZB1, D2–D4) | A |
| +5 až +8 | uzly stromu, koupě vlaštovky (cíl, na který se šetří) | B / A |
| +6 až +9 | rekord, těsnost před dalším místem, podpisový skin | C / A |

**Nové role a události po čtvrtích** (první setkání = A, zaručeně v dalším letu):

| Čtvrť | Nové | Role |
|---|---|---|
| D1 Střechy za úsvitu | poryv, holub (1), spropitné (2), pára (4) | → ↑ ◈ × |
| D2 Slunný přístav | racek (var. holuba), Hejno (6), mořský vánek (var. poryvu) | ↑ × → |
| D3 Zlatá pole | prachový vír (9), skřivan (var.), termika (10), hvězda (12) | ⇄ ↑ ↑ ★ |
| D4 Město lampionů | průvan (var.), Ad Drone (13), lampiony (14) | → → ↑ |

### 4.5 Kde hra dnes selhává a co je potřeba

| Problém dnes ve hře | Proč | Co to řeší | Kdo |
|---|---|---|---|
| Po ~8 nákupech 4–8 hodů bez ničeho | strom 3 × 5 s rostoucí cenou, odměna roste pomalu | strom malých uzlů (13 §6.3), cena ≈ 1 hod příjmu v D1 | balance-analyst (čísla), game-dev (strom ve hře) |
| Místa nic nedávají | Atlas není ve hře | Atlas B1 (`atlas-ui.js`) s novým modelem letu | game-dev, product-designer |
| Pořád poryv a holub | 2 typy, los | role, skladba, nové události po místech | tento dokument |
| QTE zachrání u země | pevný účinek, bez prahu | QS1, QS2 | game-dev |
| Nevím, proč hodit znovu | výsledek neukazuje cíl | jeden nejbližší cíl ve výsledku, RK1, „Throw again“ | product-designer |

**Upřímně:** samotný obsah 05 N3 nevyřeší, dokud ve hře není **nový systém progrese**. Nejvíc „něčeho v každém hodu“ dá strom malých uzlů a Atlas. Proto je v pořadí (§7) hned za opravou QTE.

---

## 5. N10: kritická revize obsahu na 90 min

Měřítko: mění to, jak se hraje, nebo proč hráč hází znovu (zásada úkolu), a pomáhá to N1–N3? Rozhodnutí 06 platí, změny proti nim jsou návrh k odsouhlasení.

| Položka (zdroj) | Verdikt | Proč |
|---|---|---|
| **FN1 Fronta novinek** (05) | ponechat, jádro | bez ní přijde 5 věcí na jedné kartě čtvrti v jednom hodu; je to nejlevnější nástroj na N3 |
| **RK1 Řádek rekordů a těsnosti** (05) | ponechat, jádro | drobnost skoro v každém hodu, pravdivá (P10) |
| **Cíl ve výsledku** (nové, 4.2) | přidat, jádro | odpověď na „proč hodit znovu“; malé UI |
| **Strom malých uzlů** (13, 3. kolo) | **povýšit, jádro hned po QTE** | hlavní nástroj na „nákup každý hod“ (N3) |
| **VA1 Místní varianty** (05) | **změnit:** 4 místo 5 (racek, vánek, skřivan, průvan; vír zvlášť jako EV2), varianta **dědí roli** základu | role musí zůstat čitelná (N2); pestrost teď nese i skladba, takže pátá varianta nic nepřidá |
| Mořský vánek (VA1) | změnit: jen rytmus (delší pruh), role → | dnes míchá výšku a rychlost, proti N2 |
| Papírový holub (VA1, D4) | **škrtnout** | D4 už má průvan, dron a lampiony; další holub nic nového |
| **EV1 Hejno** (05) | ponechat, jádro | jediná × událost s rytmem 3 kroků, vrchol pro Crowd Chain |
| **EV2 Prachový vír** (05) | ponechat, jádro | jediná událost s volbou uvnitř (⇄) |
| **EV4 Lampiony** (05, rozšíření) | **povýšit** na jádro (místo papírového holuba) | identita Města lampionů, klidná ↑ v D4 |
| **ZB1 Zastávky D2–D4** (05) | ponechat | levné (existující budovy), novinka mezi místy |
| **Kousky TL0** (05, po ověření) | **odložit** až po QS1 a SK1, pak znovu změřit | mění se rozvrh i síla událostí, dnešní měření neplatí; skladba je navíc zpřehlední (hráč uvidí sled a může kousek plánovat), takže mají po změně větší šanci |
| **BN2 Předpověď trasy** (05, uzel Atlasu) | **změnit:** PL1 zdarma, jádro (BLOCKED 2) | bez předpovědi hráč roli nepozná předem |
| **CU4 Zahlédnutí** (05) | ponechat jako rozšíření, později | levné, zvědavost (P3), ale nic neřeší z N1–N3 |
| **Boost taps** (13, schváleno) | ponechat, s pravidlem × Q | bez Q by se stal novou záchranou u země |
| **M1 Hawk** (01) | ponechat | role × a perfekt, jasný styl; zvážit `missK` 0,04 (QS1) |
| **M2 Kite** (01) | ponechat | role ↑, jiný obraz letu |
| **M3 Skimmer** (01) | **odložit** (BLOCKED 3) | jeho situace je konec letu nízko nad zemí (Cushion, odrazy) a s prahem 8 m zažije méně událostí; je to přesně oblast, kterou N1 tlumí; ušetří 3D, skin K8, ladění |
| **M4 Sail** (01) | ponechat, zjednodušit UI | rychlou volbu Sail sloučit s pásem předpovědi a větru (jeden pás při míření, N8) |
| **M5 Needle** (01) | **změnit:** odemknout na místě 13 (začátek D4) místo 14 | dnes se kupuje ~hod 143–148, hraje se s ním ~20 hodů; role → a drony D4 ho potřebují dřív |
| **E1 Mailbag** (01) | ponechat | incrementalové „číslo roste“, koš M drží i spropitné |
| **Skiny K1–K5** (01) | ponechat | levné, památka na čtvrť a finále |
| **Podpisové skiny K6–K10** (01) | ponechat podle počtu modelů (bez K8 při odložení Skimmeru) | kousek modelu učí jeho styl |
| **Razítka R1–R7** (01) | ponechat | tichá drobnost, skoro zadarmo |
| **C1 Polička suvenýrů** (01) | ponechat, rozšíření | za hlavním menu je teď podkrovní dílna (06), polička je tam vidět bez UI |
| **C2 Rádio** (01) | **škrtnout** (do odvolání) | hudba ve hře není; nic nemění v hraní |
| Night Route, Night Owl, K11 (01, 05) | už odloženo (06) | – |

**Bilance:** 3D obsahu 05 zůstane zhruba stejné (papírový holub pryč, lampiony do jádra), Skimmer při BLOCKED 3 (a) ušetří ~3 dny. Přibudou role, skladba, předpověď a spropitné, které jsou hlavně logika a UI, ~10–15 dní (§7). Kousky se posunou za skladbu.

**Co tím hra získá na 90 min:** novinky v D2–D4 nese hlavně první setkání s rolemi a událostmi (zaručené skladbou), zastávky a modely. Kousky jsou bonus, ne nosná část.

---

## 6. Co má změřit simulace (zadání pro balance-analyst a game-dev)

Spouštět jen `node simulation/progression/run.mjs ... --out <jméno>` (výstup `out/`). Mechaniku v simulátoru doplní game-dev (`model.mjs`, `params.mjs` klíče `events.power`, `events.roles`, `events.bags`), balance-analyst jen běží a čte.

**A. Síla letu (QS1, QS2)**, profily slabý / průměrný / expert, SKILLS a „šum ×2“, realistický nákup:
1. **Záchrany u země:** podíl doletu získaný z událostí vyhodnocených pod 12 m; počet letů, kde událost po vrcholu letu přidala > 15 % doletu. Cíl: oboje výrazně pod dneškem (návrh: ≤ 1/3 dnešní hodnoty).
2. **Odměna za výhoz:** korelace síly výhozu (`charge`) a doletu, dnes vs. s Q. Cíl: vyšší.
3. **Šikovnost:** expert / průměrný ≥ 0,69 (06), slabý ≤ 1,35× minut průměrného (05 §7.2). Q nesmí rozevřít nůžky víc.
4. **Délka letu:** medián po čtvrtích (05 §7.2), P90 ≤ 45 s. Čekám kratší lety; když dolet klesne, nést to cenami, ne slabším Q.
5. **Citlivost:** `e_full` 0,4 / 0,6 / 0,8, `Q_min` 0,1 / 0,25, `Q_max` 1,1 / 1,25 / 1,4, práh 6 / 8 / 10 m.
6. **Dive:** zisk z Dive před událostí s Q a bez; když > +5 %, počítat `vx_air` bez zbytku střemhlavu. Rocket: podíl doletu z výtrysku pod 8 m.
7. **Hawk:** `missK` 0,06 / 0,04, poměr expert / slabý s Hawkem.

**B. Role a skladba (SK1, PL2, EM1):**
1. **Opakování:** podíl základního poryvu a holuba mezi QTE (05 §7.2: D1 ≤ 95 %, D2–D4 ≤ 60 %); nejdelší řada letů bez některé odemčené role (cíl ≤ 3).
2. **První setkání:** nová událost do 1. letu po odemčení ve 100 % případů.
3. **Role v roli:** očekávaný přínos každé události ve své roli ≥ základní (06 F3 bod 4).
4. **Spropitné:** příjem kampaně ≤ 1,08× bez něj, koš M ≤ +50 %.
5. **Plán letu:** „vždy Fast“, „vždy Rich“, „vždy Combo“ nejvýš o 5 % hodů rychlejší než „Mixed“; „podle cíle“ (Fast, když chybí < 100 m k místu, jinak Rich) o 3–8 % rychlejší (volba má mít smysl, ale nedominovat).
6. **QTE za let** po čtvrtích a medián letu (max 6 slotů).

**C. Tok novinek (§4):**
1. Market: kolikátý hod, kolik nákupů před ním (cíl 3–5, nikdo v 1. hodu).
2. Hody mezi nákupy D1 medián ≤ 1, P90 ≤ 2; sucho A P90 ≤ 6 (05 §7.2).
3. Prvních 20 hodů: počet A (cíl 8–12) a B (cíl ≥ 15).

**Co simulace neověří (playtest, P4):** jestli hráč pochopí, proč je QTE slabší; jestli předpověď čte; jestli skladba nepůsobí stereotypně. Otázky do playtestu: „Kdy se vyplatilo trefit událost a kdy ne?“, „Věděl jsi před hodem, co přijde?“

---

## 7. Souhrnná tabulka a doporučené pořadí

| # | Položka | Priorita | Pracnost (data / logika / 3D / UI / texty) | Odhad dní | Závisí na |
|---:|---|---|---|---:|---|
| 1 | **QS2 Výškový práh 8 m ve hře** | jádro, hned | – / S / – / – / – | 0,5 | – |
| 2 | **QS1 Síla letu** (simulátor, pak hra) | jádro | S / S–M / – / S–M / S | 2–3 | simulace §6 A |
| 3 | **Role událostí** (přeladění účinků, ikony) | jádro | S / S / – / S / S | 1–2 | 2, simulace §6 B |
| 4 | **SK1 Skladba letu** | jádro | S / M / – / – / – | 2–3 | 3 |
| 5 | **PL1 Předpověď letu** (zdarma) | jádro (BLOCKED 2) | – / S / – / M / S | 1–2 | 4 |
| 6 | **Nový systém progrese ve hře**: strom malých uzlů v D1, Atlas po Market, cíl ve výsledku | jádro | M / L / – / L / M | – (mimo tento dokument, 11-plan, 13) | 3. kolo čísel |
| 7 | **EM1 Spropitné** | jádro (BLOCKED 1) | S / S–M / S / S / S | 2 | 4, 6 |
| 8 | FN1 + RK1 (05) | jádro | S / S / – / S / S | 2 | 6 |
| 9 | EV1 Hejno, EV2 vír, VA1 (3 varianty), EV4 Lampiony | jádro | S / M / M / S / S | 8–11 | 4 |
| 10 | ZB1 Zastávky | jádro | S / S / S–M / S / S | 2–3 | Papírové město D2–D4 |
| 11 | PL2 Plán letu | rozšíření (BLOCKED 2) | S / S / – / S–M / S | 1–2 | 5, playtest |
| 12 | Kousky (nové měření, pak TL0) | rozšíření | – / M / S / S / S | 3–5 | 2, 4 |
| 13 | CU4 Zahlédnutí, C1 Polička | rozšíření | S / S / M / – / – | 3–4 | – |

**Celkem nová logika z tohoto dokumentu (1–5, 7, 11): ~10–15 dní**, NOT ASSESSED. Obsah 05 po revizi ~15–19 dní (bez kousků).

**Proč takhle:** 1 odstraní nejhorší pocit hned a levně. 2–5 mění jádro letu, proto simulace před kódem (06 bod 5). 6 je největší páka na N3 a stojí na číslech 3. kola. Obsah (8–10) staví na rolích a skladbě; kdyby šel dřív, ladil by se dvakrát.

---

## 8. Otevřené volby

BLOCKED 1: **Má mít role „mince“ vlastní událost?** Tvůrce chce dělit QTE i podle toho, kolik dají mincí. Příklad: soused z balkonu vyhodí obálku se spropitným, trefíš ji a dostaneš +15 % mincí za hod („+38 ◈ Tip“), let se nezmění. (a) **ano, nová událost Spropitné** od Market, jedna za let, procento z odměny se stropem; (b) ne, mince jen přes kombo (pára, Hejno; kombo už mince zvyšuje), žádná nová událost; (c) mince dává Ad Drone (reklama platí), jen v D4. **Doporučení: (a).** Dává roli „mince“ hned v D1, kde se nejvíc nakupuje, a s plánem letu skutečnou volbu „dolet, nebo mince“. (b) je levnější, ale roli mince by hráč neviděl; (c) přijde až v poslední čtvrti.

BLOCKED 2: **Jak má hráč vědět, které události ho v letu čekají?** Příklad: při míření vidí u vlaštovky tři ikony „→ ↑ ×“ (rychlost, výška, kombo). (a) **předpověď zdarma od 2. hodu**, volitelný Plán letu (Rychlý / Vysoký / Výdělečný) až po playtestu; (b) předpověď i Plán letu hned od Gardens; (c) jak je v plánu 05: předpověď jen jako kupovaný uzel Atlasu od 2. čtvrti. **Doporučení: (a).** Bez předpovědi role nedávají smysl před hodem a volba vlaštovky ztrácí důvod; Plán letu je další rozhodnutí v každém hodu, nejdřív ověřit, jestli hráčům nevadí.

BLOCKED 3: **Ponechat vlaštovku Skimmer (Žabka)?** Je to model pro nízký let a konec letu (pomaleji klesá u země, odráží se od vody). Po změně QTE (pod 8 m žádné události, slabé QTE u země) je právě konec letu méně zajímavý a Skimmer by stál 3D model, skin a ladění. (a) **odložit, hra má 4 nové vlaštovky** (Hawk, Kite, Sail, Needle); (b) ponechat podle 06; (c) přepracovat na vodní model (silnější jen nad vodou v D2). **Doporučení: (a).** Ušetří ~3 dny a každá ze 4 vlaštovek má jasnou roli (×, ↑, vítr, →). Vrátit se dá, když playtest ukáže, že konec letu chybí.

BLOCKED 4: **Opravit QTE hned i ve staré hře?** Dnes ve hře QTE funguje i metr nad zemí. Příklad: vlaštovka 2 m nad zemí, holub ji znovu zvedne. (a) **hned přenést výškový práh 8 m ze simulátoru** (půl dne, balanc nového systému se nemění), sílu letu až po simulaci; (b) nic neměnit, dokud nebude ve hře nový systém; (c) hned obojí, práh i sílu letu, bez simulace. **Doporučení: (a).** Tvůrce hru hraje teď a práh je ověřený simulátorem; síla letu mění dolet a potřebuje měření.
