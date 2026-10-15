# Slepý poslech hudby: B, E a Diorama (15 minut)

Scénář podle `research/hudba/03-hudebni-zadani.md` kap. F.6, upravený na skutečné ovládání prototypu (15. 10. 2026). Projde ho uživatel sám, ideálně ještě 2 další lidé.

## Příprava (před začátkem, mimo 15 minut)
1. V kořeni projektu `npm start`, v Chromu otevři `http://127.0.0.1:4173/prototype-music.html`.
2. **Sluchátka.** Okno nech viditelné po celou dobu (ve skryté kartě se zvuk pozastaví).
3. Klepni do scény („Klepni pro zapnutí zvuku“).
4. Panel **Slepý režim**:
   - zaškrtni **Zapnout (X1–X3, vyrovnáno na −22 LUFS)**,
   - počkej, až se pod tlačítky objeví „vyrovnáno na −22 LUFS“ (prototyp vyrenderuje každého kandidáta v každé čtvrti 30 s offline; poprvé to trvá asi 1–3 minuty, potom se hodnoty pamatují v prohlížeči),
   - pro nové pořadí kandidátů použij **Nové zamíchání** (pořadí X1–X3 je náhodné podle seedu sezení).
5. Panel **Auto flight**: Fáze hry = Střed, QTE = „Hraju já (mezerník)“. Panel **Hudba**: čtvrť 1, místo 4, „Podle postupu“ vypnuto.

Názvy kandidátů se nikde neukazují (HUD píše jen X1–X3). Neotevírej tlačítko **Odhalit**, dokud neskončíš.

## Průběh

| Čas | Blok | Co děláš v prototypu | Co se zapisuje |
|---|---|---|---|
| 0:00–1:00 | Kalibrace | Vyber **X1**, spusť **▶ Auto flight** a nastav si příjemnou hlasitost systémem nebo posuvníkem **Master**. Dál ji neměň. | – |
| 1:00–7:00 | **1 Srovnání** (čtvrť 1, ráno) | Postupně X1, X2, X3, každý 2 minuty Auto flight. QTE mačkáš sám **mezerníkem**. Po každém kandidátovi vyplň a ulož (**Uložit hodnocení**) tři řádky: „Ladí k rannímu papírovému městu“, „Nechal bys ji zapnutou?“, „Neruší tě při QTE (5 = vůbec)“, každé 1–5. | pořadí kandidátů; podíl perfektů na kandidáta (panel „QTE s hudbou“, stejné seedy letů) |
| 7:00–10:00 | **2 Rozlišení čtvrtí** (jen Diorama) | Zastav Auto flight. Klepni **▶ Blok 2: rozlišení čtvrtí**. Scéna zmizí, hraje Diorama v náhodné čtvrti. Po 45 s (odpočet pod tlačítkem) vyber denní dobu: ráno / poledne u moře / zlaté odpoledne / večer s lampiony. Čtyřikrát. | kritérium: ≥ 3 ze 4 správně (uloží se samo) |
| 10:00–13:30 | **3 Únava** (jen Diorama, čtvrť 3, místo 4) | Vypni slepý režim, ve výběru Směr zvol **G · Diorama**. Klepni **▶ Blok 3: únava 3:30** (sám nastaví čtvrť 3 a místo 4 a spustí Auto flight). Hraj QTE mezerníkem. Na začátku a ve 3:30 odpověz „nechal bys ji zapnutou?“ 1–5. | pokles nejvýš o 1 bod |
| 13:30–14:30 | **4 Leitmotiv** | Klepni **▶ Blok 4: leitmotiv**. Pusť si Z1, Z2 a Z3 (každá jednou nebo dvakrát) a klepni **vybrat** u té, která je „melodie vlaštovky, kterou už znáš“. Všechny tři hraje stejný hrací strojek ve stejném tempu: téma ve čtvrti 3, téma pozpátku a cizí motiv stejné délky. | správně / špatně (náhoda 1/3); u 3 lidí aspoň 2 správně |
| 14:30–15:00 | **5 Telefon** | Otevři stejnou adresu na telefonu ve stejné síti (nebo pusť notebook přes reproduktor telefonu), Diorama, Auto flight 30 s. Odpověz ano / ne: „je slyšet téma a tik?“ Zapiš do pole **Poznámka** a ulož. | ano / ne |

Pozn. k bloku 5: server `npm start` poslouchá jen na `127.0.0.1`, telefon na něj přímo nedosáhne. Nejjednodušší je pustit zvuk z notebooku přes malý reproduktor (nebo reproduktor telefonu přes Bluetooth). Tohle prototyp neřeší.

## Na konci
1. Klepni **Odhalit**: v panelu se ukážou průměry podle kandidátů (B, E, G = Diorama), únava, výsledky bloků 2 a 4.
2. **Export JSON** stáhne `music-ratings.json` (hodnocení, únava, QTE, bloky 2 a 4, trimy hlasitosti). Pošli ho orchestrátorovi.

## Kritéria přijetí kroku 3 (03 F.6)
- Diorama vyhraje blok 1 průměrem „nechal bys ji zapnutou“, nebo je nejvýš o 0,5 bodu horší a má lepší „ladí k městu“.
- Blok 2 (≥ 3/4) a blok 4 splněny.
- Podíl perfektů s Dioramou není o víc než 5 procentních bodů nižší než bez hudby. **Mimo těchto 15 minut:** ≥ 20 letů s Dioramou a ≥ 20 letů se směrem „Bez hudby (jen efekty)“, QTE mezerníkem; prototyp počítá zásahy zvlášť pro „off“ a na stejných seedech.
- Měření hlasitosti a zátěže: `reports/hudba/diorama-mereni.md`.

Když Diorama blok 1 prohraje, nic se nemaže a výsledek jde orchestrátorovi k rozhodnutí uživatele.
