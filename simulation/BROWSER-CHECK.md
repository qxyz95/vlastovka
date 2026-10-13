# Kontrola prohlížeče — 11. 10. 2026

Prostředí: prohlížeč v aplikaci Codex, lokální server 127.0.0.1:4173, pravidla 0.1.0.

1. Nová hra zobrazila 0 mincí, zamčený kluzák a nedostupný nákup.
2. Hod bez QTE skončil po 7,8 s doletem 133 m; připsáno 23 mincí a odemčen kluzák.
3. Návrat do dílny zachoval mince a rekord; první nákup síly hodu byl dostupný.
4. Nákup první úrovně odečetl 10 mincí. Po obnovení stránky zůstalo 13 mincí, rekord 133 m a zakoupená první úroveň; druhá úroveň byla odemčená, ale chyběly mince.
5. Pořízen náhled `preview.png`. Grafika je pracovní.

Jde o krátkou kontrolu cyklu, nikoli celé dohrání. QTE na dotyku, skutečný telefon, skrytí záložky, potvrzovací dialog resetu a nedostupnost úložiště nebyly v prohlížeči ručně testovány. V otevřeném prohlížeči zůstává tento testovací postup pro další hraní.

## Dodatek 0.4

Kontrola v prohlížeči: načtení hry, úvodní držení a vypuštění, letový HUD, grafická reklama a výzva Kyberholub–kurýr. Na viewportu 360 × 780 bylo scrollWidth = innerWidth = 360, výška tlačítka 48 px; spodní okraj plátna 262 px, začátek ovládací sekce 278 px. Na 390 × 844 bylo scrollWidth = innerWidth = 390 a tlačítko 48 px. Tyto kontroly jsou simulace viewportu, nikoli test fyzického telefonu. Pokus o ruční načasování holuba nepotvrdil úspěšný zásah; přesná úspěšná okna jsou ověřena unit testy.
