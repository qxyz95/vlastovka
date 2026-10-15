# QA předání 15. 10. 2026 (HEAD 3292ccd, větev f3-3d-prototypy)

Prostředí: server PORT=4191 (vypnut), vlastní záložka (zavřena), okno skryté (document.hidden=true, vždy ?timer), velikosti přes iframe ve vlastní stránce, pointer/klávesové události skriptem. `npm test` 407/407. Snímky 2 (cesty v odpovědi). Konzole: jediné chyby byly artefakt syntetických pointerů (viz N-1).

## Body
| # | Výsledek | Důkaz |
|---|---|---|
| 1 | OK | prázdný save: home + titul, jen Settings, žádný čip mincí; ?dev=1 +1000 ×3 = 95→3095; poškozený save → varování + záloha `-corrupt`; nesmyslné hodnoty bez pádu |
| 2 | OK | ťuknutí 60 ms/dvojí ťuknutí/pointercancel nehodí; podržení 500-700 ms hodí; Space a šipky (5–40°); dotyk (touch, druhý prst ignorován) |
| 3 | OK (perfekt NOT ASSESSED) | gust i bird reagují, bird 1/1 trefen, miss 0/1, Space i tlačítko; let doběhne vždy |
| 4 | OK | karta: texty EN/CS, Again → home bez úvodu, Workshop otevře Dílnu bez změny mincí, zámek: stisk +80 ms i Space ignorován, po 500 ms funguje |
| 5 | OK | koupě 3095→3060, nedostatek mincí (tlačítko disabled, „25 coins short“), Dart/Glider, Atlas z Dílny (nahradí ji), zavření → Domov |
| 6 | OK | Pauza zastaví dolet (6 m→6 m, po pokračování 11 m), Cancel throw: attempts 6→6 + Menu, history.back zavře po jednom, 5× cyklus menu/nastavení bez růstu historie, Esc (cancel event) |
| 7 | OK | EN/CS bez syrových klíčů (jediný nález „menu.noscript“ je text uvnitř neviditelného `<noscript>`), motion reduce/full/system → `data-reduced` true/false/false, reset s potvrzením → titul, jazyk a nastavení zůstanou, fokus na „Keep“; dev tlačítko skryté bez ?dev=1 |
| 8 | OK s výhradami | Tab pořadí (×, EN, CS, radio, reset), fokus po zavření (Pokračovat → hold), cíle ≥ 44 px (radio samotné 20 px, ale label 328×44); N-2 |
| 9 | CHYBA (N-2) | scrollWidth = innerWidth ve všech 5 velikostech; písmo ≥ 13 px; v 932×430 karta kryje ☰ a čip mincí |
| 10 | OK | bonus.html?lang=cs → `/?lang=cs` + Atlas panel otevřen (hash spotřebován hrou) |

## Chyby
| ID | Závažnost | Popis |
|---|---|---|
| N-2 | VYSOKÁ | 932×430 (na šířku), karta výsledku: karta (x 500–920, y 28–434) překrývá ☰ (872–920 × 12–60) a čip mincí. ☰ na kartě nejde stisknout dotykem (menu jen přes Esc), mince nevidět. Karta se scrolluje (686/406), akční řádek je sticky. Postup: 932×430, ?lang=en, hodit, počkat na kartu, `document.elementFromPoint` ve středu `#menu-btn` = `#result`. Soubor: style.css (karta `#result`, @media landscape). |
| N-1 | NÍZKÁ | `#hold` (ui.js:527) a `#action` (ui.js:565) volají `setPointerCapture` bez try/catch (u `#game` je). Při neaktivním pointerId vyhodí NotFoundError a handler skončí před `begin`/`flightDown`. Reálně jen při zvláštním pořadí událostí, ve skriptovaných testech pokaždé. |
| N-3 | NÍZKÁ | Portrét 360×740: mapování úhlu z ukazatele skáče: (0.5, 0.45–0.6) = 40°, (0.5, 0.8) = 5°, (0.9, 0.5) = 34°. Většina plochy dává strop 40°. Zvážit s U6 (míření). |
| N-4 | NÍZKÁ | 932×430: Dílna a Nastavení se scrollují (688/406, 586/406), tlačítko Buy a Reset jsou pod okrajem. Bez překryvu, jen pohodlí. |
| N-5 | Kosmetika | U5 report uvádí 404 testů, `npm test` dává 407. |

## NOT ASSESSED
- Vzhled/animace a výkon (skryté okno). Slide-in panelů se v skrytém dokumentu zasekne na prvním snímku (`dialog-in`, posun 16 px), proto jsem ho nebral jako chybu (keyframes končí `transform:none`).
- Skutečný `prefers-reduced-motion` (nelze emulovat), jen volba v Nastavení a existence `@media` v style.css:1231.
- Skutečný stisk Esc (klávesa z prohlížeče do skrytého okna nedošla; použit `cancel` event dialogu a keydown skriptem).
- Auto-pauza při přepnutí záložky (s ?timer ji hra záměrně ignoruje).
- Perfektní QTE (★), reálný dotyk na zařízení, ☰ jako „zpět“ při otevřeném menu (modální dialog je inertní, ☰ nejde stisknout; zda to je záměr, nevím).
- Intro/úvodní animace po zavření Dílny (stav je interní, bez snímku).
- Atlas je zástupný (zná stav.md).
