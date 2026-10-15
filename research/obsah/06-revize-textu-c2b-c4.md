# Revize textů C2b (vstupy událostí) a C4 (Dílna)

15. 10. 2026, narrative-writer. Zdroj: `src/locales/en.js` a `cs.js` (jen čteno, slovníky se nemění). Měřítko: tón podle bible 05 kap. 12 a kreativního směru (suchý laskavý humor, minutí není trest), `.claude/rules/atlas.md` (zakázané formulace, žádné FOMO), limity: `#banner` max ~42 znaků EN / ~40 CS, štítky QTE max ~14 znaků, stejné parametry v EN i CS.

Kontrola zakázaných formulací (last chance, hurry, don't lose, streak, daily, limited, only now, miss out, come back): ve všech revidovaných klíčích žádná. Parametry `{…}` jsou ve všech párech shodné.

## Přehled po klíčích

| klíč | současné EN / CS | stav | problém a návrh |
|---|---|---|---|
| `hint.steam` | Steam: tap twice, once per puff. / Pára: klepni dvakrát, na každý obláček. | OK | 33 / 39 znaků, změřeno 282–330 px. |
| `hint.thermal` | Thermal: tap once in the rising air. / Termika: klepni jednou ve stoupání. | OK | CS „ve stoupání“ je trochu vágní, ale delší „ve stoupavém proudu“ (43) se do 40 znaků nevejde. Ponechat. |
| `hint.drone` | Lantern: tap just before you touch. / Lampion: klepni těsně před dotykem. | změnit | „touch“ i „dotyk“ nemá předmět (čeho se dotknout?). Návrh: EN „Lantern: tap just before you reach it.“ (38) / CS „Lampion: klepni, než se ho dotkneš.“ (35). Varianty EN: „Lantern: tap as you close in.“ (29); „Lantern: tap right before you meet it.“ (38). Doporučení: první. NOT ASSESSED: přesný moment v kódu (zda je „reach“ věcně správně), ověří game-dev. |
| `hint.star` | Star: tap as it crosses the middle. / Hvězda: klepni, když projde středem. | OK | 35 / 36 znaků. |
| `event.riseTap` | ↑ TAP / ↑ KLEPNI | OK | 5 / 8 znaků. |
| `event.tapTwice` | ↓↓ TAP TAP / ↓↓ KLEPNI KLEPNI | změnit CS | CS má 17 znaků, limit 14. Návrh CS: „↓↓ KLEP KLEP“ (12). Varianty: „↓↓ 2× KLEPNI“ (12), „↓↓ KLEP, KLEP“ (13). Doporučení: „↓↓ KLEP KLEP“ (zní hravě jako EN „TAP TAP“). EN beze změny. |
| `event.again` | ↻ AGAIN! / ↻ ZNOVU! | OK | 8 znaků obojí, shoda. |
| `qte.combo` | Combo ×{n} / Kombo ×{n} | OK | |
| `qte.comboBroken` | Combo broken / Kombo přerušeno | změnit | „broken“ zní jako trest, hlášení čte i aria-live. Návrh EN „Combo ended“ / CS „Kombo skončilo“. Varianty: „Combo reset“ / „Kombo od nuly“; „Fresh start“ / „Nový začátek“ (příliš vtipné pro aria). Doporučení: „Combo ended“ / „Kombo skončilo“. |
| `feedback.half` | ½ Half bonus / ½ Poloviční bonus | OK | Jasné, shodné. |
| `feedback.partial` | ½ Half bonus / ½ Poloviční bonus | OK | Stejný text jako `half` je záměr (stejný efekt). Volitelně později „½ One puff“ / „½ Jeden obláček“, pokud půjde jen o páru; teď beze změny. |
| `popup.half` | ½ / ½ | OK | |
| `save.refund` | The Workshop was rebuilt: {coins} ◈ came back for your old upgrades. / Dílna je přestavěná: za stará vylepšení se ti vrátilo {coins} ◈. | OK | Vřelé, bez tlaku, parametr shodný. |
| `workshop.paperLater` | The next paper opens at {place}. / Další papír se otevře na místě {place}. | změnit CS | Nesoulad s `workshop.opensAt` („Otevře se u místa {place}“). Název místa je v 1. pádu, proto „u místa“. Návrh CS: „Další papír se otevře u místa {place}.“ EN beze změny. |
| `workshop.opensAt` | Opens at {place} / Otevře se u místa {place} | OK | |
| `workshop.toGo` | {count} ◈ to go / Ještě {count} ◈ | OK | Informace o ceně, ne odpočet. |
| `workshop.buyFirst` | Buy level {level} first / Nejdřív kup úroveň {level} | OK | |
| `workshop.kindDone` | ✓ All bought / ✓ Vše koupeno | OK | |
| `workshop.kindProgress` | {done} of {total} bought / {done} z {total} koupeno | OK | |
| `workshop.kindWaits` | After the paper before it / Až po předchozím papíru | změnit | EN neobratné („the paper before it“), obě verze nejsou celá věta. Návrh EN „Opens after the previous paper“ (30), CS „Otevře se po předchozím papíru“ (31). Varianta: „Waits for the previous paper“ / „Čeká na předchozí papír“. Doporučení: první. |
| `workshop.paperLadder` | Paper kinds / Druhy papíru | změnit EN | „Paper kinds“ je kostrbaté. Návrh EN „Kinds of paper“. Varianta „Papers“. Doporučení: „Kinds of paper“. CS beze změny. |
| `workshop.treeLabel` | Upgrade levels / Úrovně vylepšení | OK | |
| `workshop.modelsLabel` | Plane / Vlaštovka | OK | |
| `workshop.value.power` | Launch speed / Rychlost výhozu | OK | |
| `workshop.value.folds` | Timing window / Okno časování | OK | |
| `workshop.nowAfter`, `workshop.nowOnly` | {label}: {now} → {after} / {label}: {now} | OK | |
| `workshop.preview.replay` | ≈ +{gain} on your last throw ({now} → {after}) / ≈ +{gain} v tvém posledním hodu (…) | změnit CS | „v hodu“ je nepřirozené, v češtině „při hodu“. Návrh CS: „≈ +{gain} při tvém posledním hodu ({now} → {after})“. EN beze změny. |
| `workshop.preview.calm` | ≈ +{gain} on a calm throw (…) / ≈ +{gain} v klidném hodu (…) | změnit CS | Totéž. Návrh CS: „≈ +{gain} při klidném hodu ({now} → {after})“. EN beze změny. |
| `workshop.preview.same` | About the same on this throw. It can still help on other throws. / V tomhle hodu skoro beze změny. V jiných hodech může pomoct. | OK | Laskavé, bez tlaku. |
| `workshop.preview.noteReplay` | Your last throw replayed with the same wind and the same hits. / Tvůj poslední hod znovu, se stejným větrem a stejnými zásahy. | OK | |
| `workshop.preview.noteCalm` | A typical throw: three quarters power, best angle, no wind or events. / Typický hod: tři čtvrtiny síly, nejlepší úhel, bez větru a událostí. | OK | |
| `workshop.undo` | Undo: {branch}, level {level} · until your next throw / Vrátit: {branch}, úroveň {level} · do dalšího hodu | změnit CS | Samotné „Vrátit“ je nejasné (co?). Návrh CS: „Vrátit koupi: {branch}, úroveň {level} · do dalšího hodu“. EN beze změny. |
| `workshop.bought` | Bought: {branch}, level {level}. / Koupeno: {branch}, úroveň {level}. | OK | |
| `workshop.undone` | Undone. {price} ◈ back in your wallet. / Vráceno. {price} ◈ je zpátky. | změnit CS | „Vráceno“ splývá s vratkou ze `save.refund`. Návrh CS: „Koupě vrácena. {price} ◈ máš zpátky.“ EN beze změny. |
| `branch.paper.effectSpeed` | Flight speed ×{from} → ×{to}. The whole flight is faster, so it goes farther. / Rychlost letu ×{from} → ×{to}. Celý let je rychlejší, a proto doletí dál. | OK | Parametry shodné, odpovídá rozhodnutí 06 (rychlejší let je záměr). |

Nezměněno a mimo rozsah: `workshop.firstHint`, `workshop.levelOf`, `workshop.later`, `workshop.new` (starší, neprověřováno).

## Tabulka změněných klíčů (k převzetí)

Jen sloupce, které se mění; u klíčů, kde se mění jen jeden jazyk, je druhý sloupec současný text (vložit celý řádek).

| klíč | EN | CS |
|---|---|---|
| `hint.drone` | Lantern: tap just before you reach it. | Lampion: klepni, než se ho dotkneš. |
| `event.tapTwice` | ↓↓ TAP TAP | ↓↓ KLEP KLEP |
| `qte.comboBroken` | Combo ended | Kombo skončilo |
| `workshop.paperLater` | The next paper opens at {place}. | Další papír se otevře u místa {place}. |
| `workshop.kindWaits` | Opens after the previous paper | Otevře se po předchozím papíru |
| `workshop.paperLadder` | Kinds of paper | Druhy papíru |
| `workshop.preview.replay` | ≈ +{gain} on your last throw ({now} → {after}) | ≈ +{gain} při tvém posledním hodu ({now} → {after}) |
| `workshop.preview.calm` | ≈ +{gain} on a calm throw ({now} → {after}) | ≈ +{gain} při klidném hodu ({now} → {after}) |
| `workshop.undo` | Undo: {branch}, level {level} · until your next throw | Vrátit koupi: {branch}, úroveň {level} · do dalšího hodu |
| `workshop.undone` | Undone. {price} ◈ back in your wallet. | Koupě vrácena. {price} ◈ máš zpátky. |

Počet změn: 10 klíčů. Oba jazyky: `hint.drone`, `qte.comboBroken`, `workshop.kindWaits` (3). Jen EN: `workshop.paperLadder` (1). Jen CS: `event.tapTwice`, `workshop.paperLater`, `workshop.preview.replay`, `workshop.preview.calm`, `workshop.undo`, `workshop.undone` (6).
