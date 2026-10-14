# Art: postavička varianta C, papírový kouř (15. 10. 2026)

Zadání: podle rozhodnutí 06 body 13–15 přepsat `research/plan-hratelnost/03-art.md` kap. 1.3–1.8 pro variantu C (dávky H1–H2 implementovatelné), doplnit spec papírového kouře jako dávku a upravit bibli 05 (S-6, dítě).

## Hotové kroky
- [x] Načteno: 06 body 13–15, 03-art.md, bible kap. 4–9, katalog 11 (H1, chimney, G2b souhrn), kód kid.js, kid-rig.js, workshop.js (materiál dítěte), paper.js `paperMaterial`, life.js `puff`, life3d.js kouř.
- [x] Zjištění: náčrt C má 904 △ (lathe 16 stěn hlavy a pláštěnky, plná víčka). Hrací verze C-H ~650 △ beze ztráty tvaru (póly jako vějíře, bez skrytých víček). `paperMaterial` stínuje binárně (n.z > 0,5 = čelo), oblé tělo by zepředu vypadalo ploše → návrh `kidMaterial` s plynulou rampou po stěnách.

- [x] Náčrty: hratelnost.mjs rozšířen (konec souboru, staré listy se generují beze změny) → postavicka-c.png, postavicka-c-pozy.png, uvod-c.png, kour-papir.png. △: C náčrt 904, **C hra 630** (hlava 160, vlasy 40, oči 4, čepice 84, pláštěnka 126, ruka 32, dlaň 12, noha 32, bota 32; 2× u párových), **LOD 1 130**. Kouř: 3 kouřící komíny z 16 v místech 1–2 (x 341, 431, 524), 5 obláčků × 6 △ = 90 △.

- [x] 03-art.md: hlavička (rozhodnutí 13–15), kap. 0, kap. 1 přepsaná pro C (díly, kostra, technika, čitelnost, pózy, rozpočet), kap. 2 (rozhodnutí A, nápis), 2.4, 3.1–3.2, nová 3.3 papírový kouř (dávka H5), 5 (R-H3–R-H5), 6 (dávky H1, H2, H5 rozepsané), 7 (otázky uzavřené), 8.
- [x] Bible 05: hlavička, kap. 3 (výjimka materiálu dítěte), 6 bod 2, 7 (řádek kouře), 9.2 (řádek Úvod), S-6, S-7, 9.4 (varianta C), 13 bod 2, 14 (2 řádky ano/ne), 16.2.

## Rozpracovaný krok
- žádný (report)

## Otevřené
- Katalog 11 karta H1 a souhrn G2b (strop 1 400) mimo moji sadu souborů, předat orchestrátorovi / game-devovi v H2.
- Vzhled ve hře NOT ASSESSED (prohlížeč nepoužit, jen náčrty).

## Změněné soubory
- runs/2026-10-15-art-postavicka-c.md
- research/design/img/hratelnost/hratelnost.mjs (dopsán konec) + 4 nové PNG
