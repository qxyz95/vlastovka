# Bonusy a vylepšení — zadání a formát karet

**Založeno 13. 10. 2026.** Cíl: dlouhý, podložený seznam vylepšení a bonusů, které hru udělají zábavnější a u hráče vyvolají pocit „tohle vylepšení chci a potřebuju“. Seznam následně převezme jiný agent a ověří ho Monte Carlo simulací; podle výsledků se rozhodne, co zůstane, změní se nebo vypadne.

## Výchozí stav (verze 0.6.1)
- Dílna: sdílený strom 3 větví × 5 úrovní (`src/config.js`): síla (+12 % rychlosti výhozu), papír (+20 % klouzavosti), přehyby (odpuštění síly +15 %, okna QTE +10 %, účinek QTE +12 %). Ceny 35/105/195/300/420, celý strom 3 165 mincí.
- Mince: 10 + dolet/10 za hod. Kluzák od 100 m, cíl 500 m, po něm nic nenavazuje a mince nemají využití.
- `bonus.html`: prázdná stránka „Bonusy“ v navigaci.
- Simulace: `simulation/monte-carlo.mjs` (botí hráči, profily dovednosti, nákupní strategie).

## Pracovní rozlišení (návrh, rozhodne uživatel)
- **Vylepšení** = trvalé úrovně v Dílně, mění čísla letu (vertikální progrese).
- **Bonusy** = odemykané schopnosti, volby a výbava se kompromisy, typicky omezený počet slotů (horizontální progrese), stránka Bonusy.

## Formát karty
```
### <ID> — <Název>
- Typ: Vylepšení | Bonus | Odemčení | Kosmetika | Událost | Systém
- Kde: Dílna | Bonusy | Let | Výsledek
- Mechanika: přesný efekt (pole z parameters(): speed, glide, steady, window, qte, drag, cruise, ideal, gravity — nebo popis nové logiky jako algoritmus)
- Úrovně a cena / podmínka odemčení:
- Proč je hra zábavnější: (odkaz na KB, štítky V/H/N)
- Pocit „chci a potřebuju“: jaký pociťovaný problém nebo touhu řeší, a jak hráč uvidí přínos PŘEDEM
- Rizika a etika: (KB 02 „čemu se vyhnout“)
- Simulace: co měřit, hypotéza, nároky na simulátor (jen parametr / nová logika / nesimulovatelné — jen playtest)
- Náročnost implementace: S / M / L
```
