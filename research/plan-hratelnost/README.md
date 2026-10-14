# Plán hratelnosti po poznámkách tvůrce (15. 10. 2026): souhrn a otevřené otázky

Podklad: poznámky tvůrce `research/playtest/2026-10-15-poznamky-tvurce.md`, výklad `2026-10-15-vyhodnoceni.md`, rozhodnutí na konci `research/bonusy/06-rozhodnuti.md` („Poznámky tvůrce z hraní“: jediný styl papír, celá obrazovka, výzva uprostřed, plastická papírová postavička, skoro každý hod novinka, QTE podle rychlosti a role událostí; balance-analyst až po schválení obsahu).

Návrhy rolí:
- `00-kreativni-smer.md`: kreativní ředitel (lákadlo hry, „novinky vidět ve vzduchu“, vystřihovánkové město, události s tváří, jednorázové scény, kdo vlaštovku našel, kritika obsahu).
- `01-game-design.md`: game designer (QTE podle síly letu, role a skladba událostí, prvních 20 hodů, revize obsahu).
- `02-ux.md`: product designer (celá obrazovka, výzva uprostřed, jeden styl, odemykání v UI, dávky U0–U9).
- `03-art.md`: art director (papírová loutka, úvodní záběr, zbytky starého stylu, jeden styl, dávky H0–H4). Obrázky `research/design/img/hratelnost/`.

## Na čem se role shodují (lze zadat hned po potvrzení uživatele)
1. **Jeden styl:** odstranit cyber a přepínač. Příčina „Neon City“: logo `index.html` má `href="./"` a zahodí `?styl=papir` (02 §3, 03 kap. 4.1). Dávky U0 (UI) a R0/H0 (render).
2. **Hra přes celou obrazovku** podle 02 §1 (mapa obrazovek, HUD jen dolet a mince), výzva „Throw it“ ve scéně (02 §2).
3. **Kouř a růžové mraky pryč, drony, robot a reklamy škrtnout** (03 kap. 3, P0/P1); příčina: `life.js`/`life3d.js` berou `CYBER.life` i v papíru.
4. **QTE: výškový práh 8 m i ve hře** (dnes holub zvedne vlaštovku i 2 m nad zemí; simulátor práh má) — malá oprava (01 BLOCKED 4a).
5. **Novinky musí být vidět ve vzduchu nebo ve výsledku, ne jen v menu** (00 i 01).
6. **Nový systém progrese (Atlas, strom malých uzlů) musí do hry**, jinak „každý hod něco“ nepůjde (01 §3).

## Otevřené otázky pro uživatele (doporučení v závorce)
**Kreativní směr (00)**
1. Hlavní lákadlo hry: město se pod vlaštovkou rozkládá jako vystřihovánka (doporučeno a).
2. Vystřihovánkové město: budovy za rekordem leží naplocho a vztyčí se při prvním průletu, nejlevnější verze po blocích ~50 m (a).
3. Kousky (triky): celý systém odložit po playtestu, Over the Line jako okamžik ve vzduchu (a). *Pozn.: game designer v 01 také doporučuje kousky odložit až po změně QTE; měření v2 dalo 4 zdravé z 8, `out/k-sim3-tricks2-smoke.md`.*
4. Škrtnout drobnosti, které hráč nevidí: razítka pryč, zastávky nahradit vztyčením dominanty, Předpověď trasy odložit (a). *Rozpor: game designer razítka a zastávky ponechává, předpověď povyšuje (01 §5) — rozhodne uživatel.*
5. Komu se vlaštovka na konci doručí: jinému dítěti na druhém konci města, beze slov (a).

**Game design (01)**
6. Síla zásahu podle letu (QS1, faktor Q 0,15–1,25) — navrženo, ověří simulace až po schválení obsahu.
7. Vlastní událost pro mince „Spropitné“ (a).
8. Předpověď událostí při míření zdarma od 2. hodu, Plán letu po playtestu (a).
9. Skimmer odložit, 4 nové vlaštovky (a).
10. Výškový práh 8 m hned do dnešní hry (a).

**UX (02)**
11. Házet rovnou z titulní obrazovky jedním krokem: podržet kdekoli = hod (B).
12. Ve výsledku jen řádek „na kolik vylepšení máš“, kupuje se v Dílně (A).

**Art (03)**
13. Postavička: skládaná papírová loutka z krabiček a ruliček, větší hlava, hází vzdálenou rukou (A), obrázky `postavicka-varianty.png`, `postavicka-pozy.png`.
14. Kouř z komínů úplně pryč (A).
15. První záběr na dům s dílnou, nápis v nebi nad hřebenem, po dotyku přiblížení 0,6 s a hod (A); úvod po spuštění a po Dílně/Atlasu, ne po „Hodit znovu“. Nápis nahoře v nebi místo přesně uprostřed — v pořádku?

## Doporučené pořadí po rozhodnutí
1. U0 + R0/H0: jeden styl a P0 (kouř, mraky) — rychlé zlepšení prvního dojmu.
2. QTE výškový práh 8 m (malá oprava).
3. U1–U7: celá obrazovka, výzva, karta výsledku (postupně, sdílí `ui.js`).
4. H1–H2: papírová loutka a úvodní záběr.
5. Nový systém progrese do hry + skladba událostí a QS1 (návrh je; simulace až po schválení obsahu).
6. Kreativní prvky podle volby (vystřihovánkové město, scény, kdo ji našel).
7. Balance-analyst až po schválení obsahu (pravidlo 06).
