# Běh: Papírové město (art-director)

**Zadání:** nová bible stylu B `research/design/05-styl-papir.md`, spec první čtvrti `06-papir-ctvrt1.md`, technika měkkých stínů s měřením, názvy čtvrtí a míst EN/CS, prototyp `prototype/styly/` ve finální podobě B pro čtvrť 1 (Dílna + 4 místa), snímky `research/design/img/papir/`, BLOCKED otázky.

## Hotové kroky
- [x] 1. Soubor průběhu založen.

- [x] 2. Kontext přečten (04, 06, 02, prototyp, src/render3d: scene, geometry, life, pose, workshop, palette, mood, comic, frame).
- [x] 3. Prototyp B pro čtvrť 1: prototype/styly/papir-data.js (čistá data, karty z cityChunk + suburbLife, skyline stíny), papir.js (three.js + maketa stránky), papir.css; prototype-styly.html výchozí = papír, ?srovnani=1 = 5 směrů. Běží v Chrome bez chyb.
- [x] Měření (okno viditelné, notebook Chrome/Brave, DPR 1,25): obrys vlaštovky × okolí 6,4–9,6 ve všech záběrech a šířkách, výplň 1,29–1,71; délka vlaštovky desktop 59 px, telefon 21 px (< 24), Dílna telefon 10 px. QTE nejhorší: stopa 3,35, úspěch 4,28, perfekt 3,86, bod 13,5.
  Výkon let (celá scéna, ~2 místa): off 14–17 DC / 7,4–11k tris / GPU 5,48 ms desktop 1200×675; skyline 21–25 DC / 10–14k / 5,51–5,57; map-near 21–25 / 17–23k / 5,59–5,64; map-full 28–33 / 21,5–25,7k / 5,54–5,65. Telefonní rozlišení 433×243: GPU 1,07 / 1,14 / 1,18 / 1,36 ms (off / skyline / map-near / map-full). Telefon reálně NOT ASSESSED.
  Trojúhelníky na místo (karty + život + stíny): 4,9k / 8,6k / 3,4k / 3,9k; obloha 3,6k.

- [x] 4. Snímky v research/design/img/papir/ (13 jpg + paleta.png): desktop Dílna, let 1–4, událost, výsledek; telefon událost, Dílna CS; na šířku let; stíny žádné / siluety / shadow map. Pak drobná úprava CSS (text na stole tmavší #4a4038 5,9 : 1, tlačítko #c43f25 4,8 : 1), snímky jsou před ní.

- [x] 5. Bible research/design/05-styl-papir.md (NÁVRH): pilíře P1–P4 + varianty, paleta, materiál, světlo, stíny a výkon, hierarchie, efekty, UI, Dílna, Atlas, QTE, názvy (sady A/B/C + 16 míst), checklist, ano/ne, převzato/zrušeno z 02, otázky.

- [x] 6. Spec research/design/06-papir-ctvrt1.md (přepínač ?styl=papir, soubory, dávky P0–P4 bez překryvu, kritéria ověření).
- [x] 7. npm test prošel (src beze změny), srovnání ?srovnani=1 běží, v záložce nechán prototyp B (let, místo 1, animace).

## Rozpracovaný krok
- (žádný, hotovo; čeká na rozhodnutí uživatele: BLOCKED v reportu)

## Další kroky
- po schválení: orchestrátor zapíše do 06-rozhodnuti.md, game-dev dávky P0–P4 podle 06-papir-ctvrt1.md.

## Změněné soubory
- runs/2026-10-14-papirove-mesto.md, prototype-styly.html, prototype/styly/papir-data.js, papir.js, papir.css, research/design/img/papir/*, research/design/05-styl-papir.md, research/design/06-papir-ctvrt1.md
