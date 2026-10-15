# Simulátor progrese: a1-after

Spuštěno 2026-10-15T01:04:56.849Z, 3 kampaní na skupinu, seed 1. Parametry přepsané: `{}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | expert dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 178 | 215 | 287 | 14.1 / 13.4 | 15 |
| po Power 1 | 1.00 | 221 | 268 | 342 | 18.5 / 17.3 | 16 |
| po Paper 1 | 1.62 | 288 | 348 | 465 | 14.1 / 13.4 | 24 |
| střed D1 | 1.62 | 477 | 559 | 702 | 21.5 / 19.9 | 28 |
| konec D1 | 2.86 | 1208 | 1338 | 1417 | 23.2 / 21.4 | 56 |
| konec D2 | 4.21 | 1947 | 2182 | 2289 | 27.2 / 25.2 | 81 |
| konec D3 | 6.31 | 3229 | 3506 | 3738 | 28.0 / 24.9 | 137 |
| střed D4 | 7.16 | 4103 | 4409 | 5459 | 29.1 / 26.3 | 160 |
| plná výbava | 8.86 | 5285 | 5694 | 6628 | 28.8 / 26.1 | 210 |
| plná bez Atlasu | 8.86 | 3906 | 4335 | 4596 | 27.6 / 24.6 | 166 |
| plná, kluzák | 8.86 | 5723 | 6490 | 7185 | 35.4 / 31.9 | 189 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|balanced|auto|better | 100 % | 34 / 14.6 | 21 / 11.8 | 28 / 16.0 | 16 / 9.7 | 103 / 53.6 | 17.4 · 25.2 · 26.0 · 27.6 | 30.8 / 38.5 | 92 % |
| average|balanced|auto|better | 100 % | 28 / 12.2 | 21 / 10.8 | 25 / 15.3 | 19 / 11.5 | 93 / 50.3 | 17.8 · 23.2 · 28.7 · 29.0 | 32.2 / 38.6 | 97 % |
| expert|balanced|auto|better | 100 % | 20 / 9.9 | 15 / 8.8 | 27 / 14.5 | 11 / 6.8 | 76 / 41.9 | 19.6 · 25.6 · 28.4 · 29.7 | 34.6 / 42.5 | 94 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|balanced|auto|better | 2 / 12 / 12 | 8 / 15 | 40 | 72 % | 64 % | 9 % | 0 % | – |
| average|balanced|auto|better | 3 / 11 / 11 | 7 / 14 | 38 | 65 % | 54 % | 13 % | 0 % | – |
| expert|balanced|auto|better | 2 / 11 / 11 | 5 / 9 | 39 | 63 % | 44 % | 15 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|balanced|auto|better | 2351 / 3531 / 8166 / 6550 | 1933 / 3603 / 7173 / 5473 | paper 9820, workshop 1120, atlas 5263, pocket 1980 | 3016 |
| average|balanced|auto|better | 1907 / 3968 / 7851 / 6657 | 1607 / 3833 / 5813 / 6423 | paper 11287, workshop 1120, atlas 4970, pocket 300 | 2636 |
| expert|balanced|auto|better | 1597 / 2715 / 7375 / 3855 | 1403 / 2497 / 5897 / 4593 | paper 7420, workshop 1120, atlas 3870, pocket 1980 | 1282 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|balanced|auto|better | dart: 36 % · 191 · 1820 · 406; glider: 64 % · 207 · 1974 · 379 |
| average|balanced|auto|better | dart: 47 % · 205 · 1958 · 414; glider: 53 % · 236 · 2263 · 413 |
| expert|balanced|auto|better | dart: 47 % · 214 · 2042 · 411; glider: 53 % · 218 · 2083 · 365 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3229 | 5.0 % | 5.7 % | -1.7 % | -7.1 % (25 %) | 1.5 % | 9.9 % | -5.0 % |
| average | 3506 | 5.8 % | 3.5 % | 2.6 % | -4.9 % (13 %) | 5.6 % | 9.1 % | -0.7 % |
| expert | 3738 | 5.9 % | 9.3 % | 5.6 % | 1.8 % (0 %) | 12.2 % | 14.3 % | -6.0 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 3.3 % · pinwheel 1.3 % · steam 0.9 % · tape 3.5 % · crane 3.1 % · skip 1.6 % (17 % letů) · gull 5.5 % · momentum 4.8 % · thermal -1.0 % · echo 5.1 % · star 0.0 % (0 % letů) · drone 0.3 % · paperCrane 0.0 % (0 % letů) · onAir 3.9 %

Shooting Star úr. 3 v letech s hvězdou: 5.8 % (6 letů, hvězda v rozvrhu 16 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|balanced|auto|better 0.3 % / 0 %

Slabý: chain 3.1 % · pinwheel 1.3 % · steam 3.5 % · tape 3.7 % · crane 3.5 % · skip 1.7 % (17 %) · gull 5.3 % · momentum 4.8 % · thermal 4.3 % · echo 4.3 % · star 0.0 % (0 %) · drone 1.6 % · paperCrane 0.1 % (17 %) · onAir 3.6 %

## Kousky (05 §4.6, skupina balanced|auto|better)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |
|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|
| Pigeon Express | dovednost | 276 · 100 % | 47 % | 0.0 % | 0.0 % | 0.0 % | 0 % / 0 % / 0 % / 0 % | – (–) | – (100 %) | – | 5.3 / 6.1 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv |
| Kettle Song | volba | 0 · 0 % | – | 0.0 % | – | 0.0 % | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy |
| Over the Line | volba | 127 · 46 % | – | 2.8 % | 1.6 % | – | – / – / 1 % / 2 % | – (–) | 28 (33 %) | – | – | hraniční · NOT ASSESSED (neběželo) · hraniční · – · zdravý · NOT ASSESSED (neběželo) | CONCERNS / CONCERNS | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | dovednost | 193 · 70 % | – | 10.4 % | 4.1 % | 13.7 % | – / 2 % / 1 % / 12 % | – (–) | 47 (33 %) | 1.31× | – | zdravý · NOT ASSESSED (bez páky) · vzácný · zdravý · zdravý · zdravý | CRITICAL / CRITICAL | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Whistle Stop | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí |
| Wish | dovednost | 77 · 28 % | 8 % | 2.6 % | 3.9 % | 0.0 % | – / – / – / 4 % | – (–) | 22 (33 %) | 0.00× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · náhoda | HEALTHY (záměr NOT ASSESSED) / CONCERNS | kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou |
| Drone Ping-Pong | dovednost | 15 · 5 % | 27 % | – | 0.0 % | – | – / – / – / – | – (–) | – (100 %) | – | 3.1 / 3.2 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · – · NOT ASSESSED | CRITICAL / CRITICAL | dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů |
| All the Verbs | pestrost | 119 · 43 % | – | 6.7 % | 8.4 % | 3.7 % | – / – / 7 % / 10 % | – (–) | 10 (0 %) | 0.54× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Skimmer: dvojitý odraz | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Sail: zadní vítr | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Needle: drony (needleDrones) | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |

Brána (8 kousků mimo modely, platí podle tříd): záměr u všech zdravých 0 (se záměrem NOT ASSESSED 2), podle tříd (dovednost: expert / slabý ≥ 1.3×) 1, z 8, potřeba 6. Čtvrť se počítá od 30 letů s přísadami.
**Postavit:** 05 §4.7, kousky mimo modely nestavět: Hawk: 3 perfekty za sebou, Kite: perfekt termiky nebo 40 m, Skimmer: dvojitý odraz, Sail: zadní vítr, Needle: drony (needleDrones).
Korelace φ nad 0.5: žádná.
Systém: 1. kousek mimo modely (medián průměrného) 51 hodů (cíl ≤ 15); nalezeno z 13 průměrný 23 % (cíl 40 %–75 %), slabý 23 % (cíl ≥ 25 %); nejvyšší korelace wish × allTheVerbs φ 0.17 (77 letů), nad 0.8: žádná. Kousky nic nedávají, délku nemění (test `progression-90`).

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 42.5 | ≤ 60 | OK |
| Dive pády (weak) | 25 % | ≤ 15 % | FAIL |
| Dive vysoké vybrání (průměrný) | -0.7 % | ±2 % | OK |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 3.3 % | 3 %–15 % | OK |
| Atlas pinwheel na úr. 3 | 1.3 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 0.9 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 3.5 % | – | – |
| Atlas crane na úr. 3 | 3.1 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 1.6 % (v 17 % letů) | 3 %–15 % | FAIL |
| Atlas gull na úr. 3 | 5.5 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 4.8 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | -1.0 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 5.1 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas drone na úr. 3 | 0.3 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas onAir na úr. 3 | 3.9 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 0 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 5.8 % (6 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 3.7 % | 3 %–15 % | OK |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 17 % | 30 %–50 % | FAIL |
