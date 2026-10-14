# Průběh: plán obsahu na 2 hodiny → 90 minut (game designer, 14. 10. 2026)

**Zadání (kolo 1):** napsat `research/obsah/05-plan-dvou-hodin.md` — rozbor, mapa obsahu na 2 h, karty, pásma 08 §10.2, pracnost. Kód neměnit, necommitovat.
**Zadání (kolo 2, 14. 10.):** přepracovat na plán 90 min (06: cíl ~90 min bez natahování, noc se nestaví; kousky ANO v odlehčené verzi až po ověření simulací; proti opakování varianty událostí po čtvrtích). Nový soubor `research/obsah/05-plan-90-minut.md`, „Změny 14. 10.“, rozbor 90 min, kapitola o kouscích + zadání ověření, pásma 08 §10.2, pracnost a dávky bez noci, osa 90 min do `01-game-design.md` §5 a §6.1.

## Hotové kroky
1. (kolo 1) Načteny podklady, napsán `05-plan-dvou-hodin.md` (§0–9, 4× BLOCKED).
2. (kolo 2) Načteno: konec 06 (90 min, noc ne, kousky lite po ověření, varianty po čtvrtích), 05 celé, 01 §0–1, §2.7–2.8, §3.2–3.3, §5–§8, `src/events.js` (dnes jen gust/bird).
3. (kolo 2) Rozvaha: 90 min ≈ 165–170 hodů. Rozlišené „okamžiky novinky“ (hody, kdy přijde něco nového, ne položky) dnes + schválené ≈ 37–40 → jeden za ~4,3 hodu, ale shluky na místech a řídké D3–D4. Cíl 45–55. Minimum: varianty událostí po čtvrtích (+7 prvních setkání) a zastávky lite v D2–D4 (+12). Opakování: ~520 QTE za hru, poryv + holub ~420 (~210 každý) bez variant.

4. (kolo 2) Doplněk orchestrátora: kousky schválené v odlehčené verzi (06) → kapitola §4 jako schválená, zadání ověření §4.6 s prahy, bez BLOCKED o tom, zda je dělat.
5. (kolo 2) Napsán `research/obsah/05-plan-90-minut.md` (§0–9, 2× BLOCKED: zastávky, Mailbag III bez noci).
6. (kolo 2) `01-game-design.md`: Změny (osa 90 min), §0 bod 7, §2.7, §2.8 a §3.2 sloupce osy, §4.3, §5 osa 90 min, §6.1 body 1–3, 16, 17, C4, D, §7 BLOCKED 1 a 4 označené jako překonané.

**Zadání (kolo 3, 14. 10.):** podle běhu `simulation/progression/out/k-sim2-tricks.md` (n 6) upravit katalog kousků v 05 §4 (podmínky, vyřazení, náhrady), zadání nového běhu pro balance-analyst, upřímné hodnocení (případně varianta bez kousků §4.7) a rozhodnout vítr náhledu v 01 §2.10 (`same` / `next`).

7. (kolo 3) Načteno: k-sim2-tricks.md, tricks.mjs, README simulátoru, runs/2026-10-14-sim-90.md, params.mjs (tricks, události, kapsy, dive), model.mjs (záznam letu, whistle, sharp, pára 2 obláčky, Echo pasivní).
8. (kolo 3) Rozbor: Kettle Song = nejvyšší známka jedné události (ne kombinace) → přepis na „obě páry perfektně se Sharp Edge“ (páka = kapsa). Steam Organ ≡ Kettle Song při vlastněném Echu (φ 1,00) → vyřazen. Pigeon Express a Drone Ping-Pong → „hned další událost“. Wish kombo 5 → 3 (hvězda přichází po 1.–3. události, kombo 5 skoro nejde). Nový Whistle Stop místo Whistle Storm (Whistle 1×/let). Dive do události nejde (události začínají nad 8 m, nízký průlet 2–7 m). K10 Needle 2 drony → 1 perfektní dron. Třídy kousků (volba / dovednost / pestrost) a kritérium „záměr“ podle třídy → BLOCKED.

9. (kolo 3) 05: §4.1 příklady, §4.4 bod 5, §4.5 katalog v2 (třídy, změny s důvody, zamítnutí kandidáti, rezerva bez Whistle Storm), §4.6 kritéria podle tříd a po čtvrtích, brána (jedna úprava na kousek), §4.6.1 první měření, §4.6.2 zadání game-dev + balance-analyst (`90m-tricks2`, n 100, zametání), §4.6.3 upřímné hodnocení (čekám 5–7 z 8), §4.7 mezistupeň a varianta bez kousků, §9 2× BLOCKED (kousky 1, 2), staré BLOCKED označeny vyřešené, „Změny“.
10. (kolo 3) 01: §2.10 bod 7 (vítr `same` pro hlavní číslo, `next` pro dráhy a řádek „This throw“ u Sail/Needle, zadání simulace `wind:'both'`), K10 „první perfektní dron“, „Změny“.
11. (kolo 3) Kontrola: pískání nejde během účinku předchozí události (ACTIVE zahrnuje `effect`) → okno Whistle Stop měřeno od `doneAt`, ne od vyhodnocení.

## Rozpracováno
- nic

## Další kroky
- Starý `05-plan-dvou-hodin.md` nejde smazat (agent nemá shell) → orchestrátor `git rm research/obsah/05-plan-dvou-hodin.md`.
- Report orchestrátorovi.

## Změněné soubory
- `research/obsah/05-plan-90-minut.md` (nový, nahrazuje 05-plan-dvou-hodin)
- `research/obsah/01-game-design.md`
- `research/obsah/05-plan-dvou-hodin.md` (kolo 1, ke smazání)
- `runs/2026-10-14-plan-dvou-hodin.md` (tento)

## Měření
- Žádné vlastní. Simulace nespouštěna. Všechna čísla zástupná, NOT ASSESSED.
- Kolo 3 vychází z `simulation/progression/out/k-sim2-tricks.md` (game-dev, n 6, nestatistické, kampaň ~80 hodů / 42 min se starou ekonomikou).
