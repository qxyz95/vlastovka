# Simulátor progrese: a1-after-set

Spuštěno 2026-10-15T01:01:41.447Z, 3 kampaní na skupinu, seed 1. Parametry přepsané: `{"events":{"gust":{"dvy":3}}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | expert dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 209 | 237 | 318 | 18.5 / 17.1 | 15 |
| po Power 1 | 1.00 | 244 | 289 | 389 | 20.9 / 19.3 | 15 |
| po Paper 1 | 1.62 | 339 | 384 | 515 | 18.5 / 17.1 | 24 |
| střed D1 | 1.62 | 522 | 610 | 774 | 24.9 / 22.9 | 27 |
| konec D1 | 2.86 | 1281 | 1451 | 1577 | 25.9 / 23.4 | 55 |
| konec D2 | 4.21 | 2102 | 2318 | 2516 | 29.2 / 27.0 | 81 |
| konec D3 | 6.31 | 3301 | 3914 | 4278 | 29.3 / 27.3 | 135 |
| střed D4 | 7.16 | 4080 | 4481 | 5571 | 28.7 / 25.4 | 164 |
| plná výbava | 8.86 | 5352 | 5887 | 6850 | 30.0 / 27.3 | 209 |
| plná bez Atlasu | 8.86 | 4217 | 4814 | 5118 | 32.3 / 29.6 | 162 |
| plná, kluzák | 8.86 | 6292 | 7004 | 7936 | 37.2 / 34.6 | 191 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|balanced|auto|better | 100 % | 31 / 13.1 | 18 / 10.7 | 24 / 14.2 | 28 / 17.0 | 95 / 51.8 | 17.7 · 26.6 · 27.0 · 27.9 | 32.6 / 40.8 | 92 % |
| average|balanced|auto|better | 100 % | 23 / 11.0 | 20 / 10.7 | 17 / 10.5 | 17 / 10.2 | 83 / 45.4 | 19.8 · 24.7 · 27.3 · 29.1 | 33.0 / 40.0 | 96 % |
| expert|balanced|auto|better | 100 % | 18 / 8.9 | 11 / 6.8 | 12 / 7.9 | 14 / 10.0 | 61 / 35.8 | 20.3 · 26.8 · 30.9 · 32.6 | 37.3 / 44.3 | 93 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|balanced|auto|better | 2 / 13 / 13 | 7 / 13 | 39 | 70 % | 52 % | 12 % | 0 % | – |
| average|balanced|auto|better | 2 / 11 / 11 | 6 / 12 | 39 | 70 % | 52 % | 10 % | 0 % | – |
| expert|balanced|auto|better | 2 / 8 / 8 | 5 / 8 | 26 | 63 % | 43 % | 14 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|balanced|auto|better | 2086 / 3300 / 7199 / 8337 | 1813 / 3200 / 5333 / 9137 | workshop 1120, paper 11287, atlas 5097, pocket 1980 | 887 |
| average|balanced|auto|better | 1650 / 3884 / 6420 / 6133 | 1423 / 3333 / 5683 / 6040 | paper 10087, workshop 1120, atlas 4973, pocket 300 | 702 |
| expert|balanced|auto|better | 1423 / 2361 / 4216 / 5095 | 1207 / 1723 / 4220 / 4560 | paper 5287, workshop 1120, atlas 5003, pocket 300 | 637 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|balanced|auto|better | dart: 45 % · 223 · 2138 · 441; glider: 55 % · 208 · 1987 · 369 |
| average|balanced|auto|better | dart: 46 % · 225 · 2155 · 431; glider: 54 % · 218 · 2090 · 378 |
| expert|balanced|auto|better | dart: 60 % · 205 · 1955 · 369; glider: 40 % · 238 · 2284 · 372 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3301 | 4.7 % | 5.9 % | -0.4 % | -8.2 % (22 %) | 8.1 % | 13.5 % | 2.3 % |
| average | 3914 | 4.5 % | -4.4 % | -3.9 % | -14.4 % (0 %) | 2.7 % | 8.9 % | -9.0 % |
| expert | 4278 | 5.8 % | 3.5 % | -4.1 % | 3.9 % (0 %) | 7.5 % | 7.5 % | -3.8 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 2.8 % · pinwheel 2.8 % · steam -10.0 % · tape 3.4 % · crane 3.1 % · skip 1.5 % (17 % letů) · gull 5.3 % · momentum 5.1 % · thermal -4.8 % · echo 4.4 % · star 0.0 % (0 % letů) · drone -9.9 % · paperCrane 0.0 % (0 % letů) · onAir 5.8 %

Shooting Star úr. 3 v letech s hvězdou: 4.4 % (6 letů, hvězda v rozvrhu 16 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|balanced|auto|better 1.7 % / 0 % · average|balanced|auto|better 0.4 % / 0 %

Slabý: chain 1.4 % · pinwheel 1.3 % · steam 1.2 % · tape 1.9 % · crane 1.7 % · skip 0.0 % (0 %) · gull 3.4 % · momentum 5.1 % · thermal 1.9 % · echo 2.6 % · star 0.0 % (0 %) · drone -1.4 % · paperCrane 0.0 % (0 %) · onAir 3.8 %

## Kousky (05 §4.6, skupina balanced|auto|better)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |
|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|
| Pigeon Express | dovednost | 245 · 100 % | 48 % | 0.0 % | 0.0 % | 0.0 % | 0 % / 0 % / 0 % / 0 % | – (–) | – (100 %) | – | 5.4 / 6.1 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv |
| Kettle Song | volba | 0 · 0 % | – | 7.1 % | – | – | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy |
| Over the Line | volba | 111 · 45 % | – | 2.8 % | 1.8 % | – | – / – / 0 % / 4 % | – (–) | 30 (33 %) | – | – | hraniční · NOT ASSESSED (neběželo) · hraniční · – · zdravý · NOT ASSESSED (neběželo) | CONCERNS / CONCERNS | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | dovednost | 174 · 71 % | – | 13.2 % | 6.3 % | 16.8 % | – / 5 % / 2 % / 15 % | – (–) | 4 (33 %) | 1.27× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · hraniční | HEALTHY (záměr NOT ASSESSED) / CONCERNS | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Whistle Stop | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí |
| Wish | dovednost | 88 · 36 % | 7 % | 2.2 % | 2.3 % | 0.0 % | – / – / 3 % / 2 % | – (–) | 7 (67 %) | 0.00× | – | zdravý · NOT ASSESSED (bez páky) · vzácný · zdravý · zdravý · náhoda | CRITICAL / CRITICAL | kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou |
| Drone Ping-Pong | dovednost | 5 · 2 % | 40 % | – | 0.0 % | – | – / – / – / – | – (–) | – (100 %) | – | 8.5 / 8.5 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · – · NOT ASSESSED | CRITICAL / CRITICAL | dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů |
| All the Verbs | pestrost | 101 · 41 % | – | 7.3 % | 8.9 % | 5.2 % | – / – / 11 % / 6 % | – (–) | 2 (0 %) | 0.71× | – | zdravý · NOT ASSESSED (bez páky) · hraniční · zdravý · zdravý · zdravý | CONCERNS / CONCERNS | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Skimmer: dvojitý odraz | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Sail: zadní vítr | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Needle: drony (needleDrones) | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |

Brána (8 kousků mimo modely, platí podle tříd): záměr u všech zdravých 0 (se záměrem NOT ASSESSED 1), podle tříd (dovednost: expert / slabý ≥ 1.3×) 0, z 8, potřeba 6. Čtvrť se počítá od 30 letů s přísadami.
**Postavit:** 05 §4.7, kousky mimo modely nestavět: Hawk: 3 perfekty za sebou, Kite: perfekt termiky nebo 40 m, Skimmer: dvojitý odraz, Sail: zadní vítr, Needle: drony (needleDrones).
Korelace φ nad 0.5: žádná.
Systém: 1. kousek mimo modely (medián průměrného) 29 hodů (cíl ≤ 15); nalezeno z 13 průměrný 23 % (cíl 40 %–75 %), slabý 31 % (cíl ≥ 25 %); nejvyšší korelace overTheLine × wish φ -0.02 (88 letů), nad 0.8: žádná. Kousky nic nedávají, délku nemění (test `progression-90`).

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 44.3 | ≤ 60 | OK |
| Dive pády (weak) | 22 % | ≤ 15 % | FAIL |
| Dive vysoké vybrání (průměrný) | -9.0 % | ±2 % | FAIL |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 2.8 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 2.8 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | -10.0 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 3.4 % | – | – |
| Atlas crane na úr. 3 | 3.1 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 1.5 % (v 17 % letů) | 3 %–15 % | FAIL |
| Atlas gull na úr. 3 | 5.3 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 5.1 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | -4.8 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 4.4 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas drone na úr. 3 | -9.9 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas onAir na úr. 3 | 5.8 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 0 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 4.4 % (6 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 1.9 % | 3 %–15 % | FAIL |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 17 % | 30 %–50 % | FAIL |
