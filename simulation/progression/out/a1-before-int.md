# Simulátor progrese: a1-before-int

Spuštěno 2026-10-15T00:56:51.069Z, 2 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}}}`.

## Křivka (08 §2.4)

| Výbava | π | average dolet | expert dolet | let expert sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 207 | 284 | 17.3 / 16.1 | 16 |
| po Power 1 | 1.00 | 256 | 339 | 19.8 / 18.3 | 17 |
| po Paper 1 | 1.62 | 336 | 460 | 17.3 / 16.1 | 26 |
| střed D1 | 1.62 | 539 | 706 | 25.2 / 23.1 | 29 |
| konec D1 | 2.86 | 1379 | 1478 | 28.1 / 25.0 | 57 |
| konec D2 | 4.21 | 2198 | 2349 | 29.7 / 27.4 | 83 |
| konec D3 | 6.31 | 3399 | 3655 | 27.9 / 25.3 | 143 |
| střed D4 | 7.16 | 4360 | 5724 | 32.9 / 30.6 | 170 |
| plná výbava | 8.86 | 5591 | 6685 | 31.7 / 30.3 | 224 |
| plná bez Atlasu | 8.86 | 4313 | 4637 | 28.5 / 25.6 | 170 |
| plná, kluzák | 8.86 | 6775 | 7301 | 37.1 / 35.1 | 207 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| average|balanced|auto|better | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 17.1 | 27 / 15.9 | 107 / 57.5 | 16.9 · 24.0 · 28.6 · 27.9 | 31.9 / 38.1 | 96 % |
| average|balanced|auto|better|i:overTheLine | 100 % | 28 / 12.2 | 24 / 13.3 | 30 / 17.9 | 31 / 19.5 | 112 / 61.9 | 16.9 · 24.0 · 28.0 · 30.6 | 32.5 / 39.6 | 96 % |
| average|balanced|auto|better|i:hawkFeather | 100 % | 31 / 12.9 | 12 / 8.0 | 10 / 6.8 | 11 / 8.0 | 63 / 35.3 | 16.9 · 31.5 · 32.7 · 37.7 | 37.3 / 42.8 | 96 % |
| average|balanced|auto|better|i:skimmerRipples | 100 % | 28 / 12.2 | 51 / 23.4 | 55 / 28.0 | 35 / 19.4 | 141 / 71.5 | 16.9 · 21.0 · 25.0 · 26.4 | 28.5 / 32.8 | 97 % |
| average|balanced|auto|better|i:needleThread | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 17.1 | 25 / 13.4 | 105 / 55.0 | 16.9 · 24.0 · 28.6 · 22.8 | 31.3 / 38.1 | 96 % |
| average|balanced|auto|better|i:whistleStop|base | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 21.0 | 12 / 7.8 | 98 / 53.2 | 16.9 · 24.0 · 29.3 · 31.4 | 32.7 / 70.7 | 96 % |
| average|balanced|dive+sharp|better|i:kettleSong | 100 % | 28 / 12.2 | 24 / 13.3 | 27 / 15.0 | 18 / 12.2 | 86 / 46.5 | 16.9 · 23.0 · 26.1 · 35.1 | 32.5 / 44.0 | 90 % |
| average|balanced|dive+sharp|better|i:whistleStop | 100 % | 28 / 12.2 | 24 / 13.3 | 22 / 13.5 | 26 / 17.1 | 94 / 50.4 | 16.9 · 23.0 · 30.0 · 28.6 | 32.3 / 68.6 | 95 % |
| average|balanced|dive+sharp|better|i:kiteTail | 100 % | 28 / 12.2 | 18 / 11.1 | 12 / 11.6 | 14 / 12.2 | 72 / 43.5 | 16.9 · 24.0 · 47.5 · 43.3 | 49.4 / 64.5 | 90 % |
| average|balanced|dive+sharp|better|i:sailStripes | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 15.7 | 42 / 25.7 | 110 / 60.0 | 16.9 · 23.0 · 25.5 · 27.7 | 31.1 / 40.7 | 87 % |
| average|balanced|dive+sharp|better|i:overTheLine|base | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 17.1 | 7 / 4.4 | 86 / 45.4 | 16.9 · 23.0 · 28.3 · 30.1 | 31.1 / 36.7 | 96 % |
| average|balanced|calm+cushion|better | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 20.2 | 5 / 3.2 | 89 / 46.4 | 16.9 · 24.0 · 26.6 · 30.1 | 28.7 / 36.9 | 97 % |
| average|balanced|calm+cushion|better|i:overTheLine | 100 % | 28 / 12.2 | 24 / 13.3 | 30 / 17.9 | 31 / 19.5 | 112 / 61.9 | 16.9 · 24.0 · 28.0 · 30.6 | 32.5 / 39.6 | 96 % |
| average|balanced|calm+cushion|better|i:hawkFeather | 100 % | 31 / 12.9 | 12 / 8.0 | 14 / 9.3 | 24 / 15.4 | 81 / 45.6 | 16.9 · 31.5 · 31.6 · 31.5 | 34.4 / 38.9 | 95 % |
| average|balanced|calm+cushion|better|i:skimmerRipples | 100 % | 28 / 12.2 | 51 / 23.4 | 36 / 15.7 | 54 / 26.3 | 141 / 66.5 | 16.9 · 21.0 · 17.7 · 23.7 | 27.6 / 31.8 | 97 % |
| average|balanced|calm+cushion|better|i:needleThread | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 20.2 | 25 / 12.1 | 111 / 56.8 | 16.9 · 24.0 · 26.6 · 22.3 | 28.6 / 34.7 | 96 % |
| average|balanced|calm+cushion|better|i:whistleStop|base | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 21.0 | 12 / 7.8 | 98 / 53.2 | 16.9 · 24.0 · 29.3 · 31.4 | 32.7 / 70.7 | 96 % |
| expert|balanced|auto|better|i:kettleSong | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 13 / 8.5 | 78 / 43.5 | 18.4 · 24.9 · 25.2 · 30.0 | 32.8 / 44.4 | 93 % |
| expert|balanced|auto|better|i:whistleStop | 100 % | 23 / 10.4 | 20 / 11.2 | 14 / 8.7 | 19 / 12.3 | 67 / 38.4 | 18.4 · 24.9 · 30.6 · 32.5 | 33.8 / 43.5 | 99 % |
| expert|balanced|auto|better|i:kiteTail | 100 % | 23 / 10.4 | 20 / 13.9 | 9 / 8.4 | 12 / 11.2 | 61 / 42.9 | 18.4 · 30.0 · 49.7 · 48.8 | 53.6 / 66.4 | 92 % |
| expert|balanced|auto|better|i:sailStripes | 100 % | 23 / 10.4 | 20 / 11.2 | 38 / 20.3 | 30 / 19.2 | 99 / 54.7 | 18.4 · 24.9 · 25.3 · 29.7 | 32.6 / 38.3 | 93 % |
| expert|balanced|auto|better|i:overTheLine|base | 100 % | 23 / 10.4 | 20 / 11.2 | 16 / 9.5 | 20 / 12.3 | 71 / 40.2 | 18.4 · 24.9 · 28.5 · 28.8 | 32.0 / 38.3 | 99 % |
| expert|balanced|dive+sharp|better | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 13 / 8.5 | 78 / 43.5 | 18.4 · 24.9 · 25.2 · 30.0 | 32.8 / 44.4 | 93 % |
| expert|balanced|dive+sharp|better|i:overTheLine | 100 % | 23 / 10.4 | 20 / 11.2 | 17 / 10.8 | 27 / 16.8 | 78 / 44.4 | 18.4 · 24.9 · 29.9 · 28.9 | 33.3 / 38.8 | 99 % |
| expert|balanced|dive+sharp|better|i:hawkFeather | 100 % | 23 / 10.3 | 11 / 6.7 | 8 / 5.7 | 8 / 5.9 | 49 / 28.5 | 18.1 · 29.5 · 35.1 · 37.6 | 37.1 / 43.5 | 91 % |
| expert|balanced|dive+sharp|better|i:skimmerRipples | 100 % | 23 / 10.4 | 29 / 14.9 | 47 / 23.9 | 33 / 19.2 | 113 / 59.2 | 18.4 · 23.9 · 21.1 · 27.6 | 29.8 / 36.3 | 89 % |
| expert|balanced|dive+sharp|better|i:needleThread | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 14 / 8.1 | 86 / 45.6 | 18.4 · 24.9 · 25.2 · 27.4 | 31.0 / 40.8 | 92 % |
| expert|balanced|dive+sharp|better|i:whistleStop|base | 100 % | 23 / 10.4 | 20 / 11.2 | 14 / 8.7 | 19 / 12.3 | 67 / 38.4 | 18.4 · 24.9 · 30.6 · 32.5 | 33.8 / 43.5 | 99 % |
| expert|balanced|calm+cushion|better|i:kettleSong | 100 % | 23 / 10.4 | 18 / 9.9 | 23 / 13.1 | 21 / 12.6 | 78 / 43.1 | 18.4 · 25.4 · 26.3 · 27.1 | 30.0 / 37.4 | 100 % |
| expert|balanced|calm+cushion|better|i:whistleStop | 100 % | 23 / 10.4 | 18 / 9.9 | 13 / 8.2 | 22 / 14.4 | 71 / 40.0 | 18.4 · 25.4 · 30.3 · 30.4 | 34.4 / 43.5 | 100 % |
| expert|balanced|calm+cushion|better|i:kiteTail | 100 % | 23 / 10.4 | 18 / 12.4 | 8 / 8.0 | 22 / 17.5 | 71 / 47.5 | 18.4 · 31.9 · 47.2 · 41.9 | 51.9 / 60.6 | 100 % |
| expert|balanced|calm+cushion|better|i:sailStripes | 100 % | 23 / 10.4 | 18 / 9.9 | 40 / 22.7 | 10 / 5.9 | 80 / 43.9 | 18.4 · 25.4 · 26.5 · 28.3 | 30.0 / 33.5 | 100 % |
| expert|balanced|calm+cushion|better|i:overTheLine|base | 100 % | 23 / 10.4 | 18 / 9.9 | 17 / 10.6 | 20 / 12.1 | 71 / 39.8 | 18.4 · 25.4 · 28.9 · 28.6 | 32.5 / 38.3 | 100 % |
| average|balanced|auto|better|i:kettleSong | 100 % | 28 / 12.2 | 24 / 13.2 | 15 / 8.9 | 43 / 24.4 | 109 / 57.7 | 16.9 · 25.3 · 28.9 · 27.1 | 30.8 / 40.5 | 95 % |
| average|balanced|auto|better|i:whistleStop | 100 % | 28 / 12.2 | 24 / 13.3 | 19 / 11.8 | 26 / 16.7 | 91 / 50.0 | 16.9 · 24.0 · 31.1 · 30.3 | 32.8 / 70.7 | 96 % |
| average|balanced|auto|better|i:kiteTail | 100 % | 28 / 12.2 | 18 / 11.4 | 8 / 7.9 | 9 / 8.6 | 62 / 38.7 | 16.9 · 26.7 · 52.1 · 49.1 | 51.6 / 70.2 | 96 % |
| average|balanced|auto|better|i:sailStripes | 100 % | 28 / 12.2 | 24 / 13.3 | 37 / 22.8 | 25 / 15.4 | 111 / 60.4 | 16.9 · 24.0 · 28.3 · 29.6 | 32.2 / 40.2 | 96 % |
| average|balanced|auto|better|i:overTheLine|base | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 17.1 | 27 / 15.9 | 107 / 57.5 | 16.9 · 24.0 · 28.6 · 27.9 | 31.9 / 38.1 | 96 % |
| average|balanced|dive+sharp|better | 100 % | 28 / 12.2 | 24 / 13.3 | 27 / 15.0 | 18 / 12.2 | 86 / 46.5 | 16.9 · 23.0 · 26.1 · 35.1 | 32.5 / 44.0 | 90 % |
| average|balanced|dive+sharp|better|i:overTheLine | 100 % | 28 / 12.2 | 24 / 13.3 | 30 / 17.9 | 27 / 16.9 | 103 / 56.7 | 16.9 · 23.0 · 28.1 · 30.7 | 32.9 / 40.1 | 96 % |
| average|balanced|dive+sharp|better|i:hawkFeather | 100 % | 31 / 12.9 | 12 / 7.7 | 10 / 6.8 | 16 / 11.2 | 62 / 34.2 | 16.9 · 30.8 · 31.6 · 33.4 | 36.6 / 44.8 | 92 % |
| average|balanced|dive+sharp|better|i:skimmerRipples | 100 % | 28 / 12.2 | 24 / 13.3 | 52 / 24.5 | 52 / 28.1 | 141 / 70.5 | 16.9 · 23.0 · 18.7 · 26.6 | 28.5 / 35.9 | 87 % |
| average|balanced|dive+sharp|better|i:needleThread | 100 % | 28 / 12.2 | 24 / 13.3 | 27 / 15.0 | 23 / 12.7 | 100 / 50.6 | 16.9 · 23.0 · 26.1 · 24.3 | 29.7 / 39.7 | 89 % |
| average|balanced|dive+sharp|better|i:whistleStop|base | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 21.0 | 13 / 7.8 | 98 / 53.2 | 16.9 · 23.0 · 29.5 · 29.8 | 32.1 / 39.1 | 95 % |
| average|balanced|calm+cushion|better|i:kettleSong | 100 % | 28 / 12.2 | 24 / 13.3 | 35 / 20.2 | 5 / 3.2 | 89 / 46.4 | 16.9 · 24.0 · 26.6 · 30.1 | 28.7 / 36.9 | 97 % |
| average|balanced|calm+cushion|better|i:whistleStop | 100 % | 28 / 12.2 | 24 / 13.3 | 19 / 11.8 | 26 / 16.7 | 91 / 50.0 | 16.9 · 24.0 · 31.1 · 30.3 | 32.8 / 70.7 | 96 % |
| average|balanced|calm+cushion|better|i:kiteTail | 100 % | 28 / 12.2 | 18 / 11.4 | 12 / 11.6 | 5 / 5.2 | 62 / 38.5 | 16.9 · 26.7 · 51.6 · 54.1 | 52.5 / 67.6 | 96 % |
| average|balanced|calm+cushion|better|i:sailStripes | 100 % | 28 / 12.2 | 24 / 13.3 | 41 / 22.9 | 26 / 15.1 | 112 / 60.0 | 16.9 · 24.0 · 26.4 · 27.5 | 30.2 / 35.6 | 96 % |
| average|balanced|calm+cushion|better|i:overTheLine|base | 100 % | 28 / 12.2 | 24 / 13.3 | 29 / 17.1 | 27 / 15.9 | 107 / 57.5 | 16.9 · 24.0 · 28.6 · 27.9 | 31.9 / 38.1 | 96 % |
| expert|balanced|auto|better | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 13 / 8.5 | 78 / 43.5 | 18.4 · 24.9 · 25.2 · 30.0 | 32.8 / 44.4 | 93 % |
| expert|balanced|auto|better|i:overTheLine | 100 % | 23 / 10.4 | 20 / 11.2 | 17 / 10.8 | 27 / 16.8 | 78 / 44.4 | 18.4 · 24.9 · 29.9 · 28.9 | 33.3 / 38.8 | 99 % |
| expert|balanced|auto|better|i:hawkFeather | 100 % | 23 / 10.3 | 11 / 6.7 | 8 / 5.7 | 8 / 5.9 | 49 / 28.5 | 18.1 · 29.5 · 35.1 · 37.6 | 37.1 / 43.5 | 91 % |
| expert|balanced|auto|better|i:skimmerRipples | 100 % | 23 / 10.4 | 29 / 14.9 | 47 / 23.9 | 33 / 19.2 | 113 / 59.2 | 18.4 · 23.9 · 21.1 · 27.6 | 29.8 / 36.3 | 89 % |
| expert|balanced|auto|better|i:needleThread | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 14 / 8.1 | 86 / 45.6 | 18.4 · 24.9 · 25.2 · 27.4 | 31.0 / 40.8 | 92 % |
| expert|balanced|auto|better|i:whistleStop|base | 100 % | 23 / 10.4 | 20 / 11.2 | 14 / 8.7 | 19 / 12.3 | 67 / 38.4 | 18.4 · 24.9 · 30.6 · 32.5 | 33.8 / 43.5 | 99 % |
| expert|balanced|dive+sharp|better|i:kettleSong | 100 % | 23 / 10.4 | 20 / 11.2 | 32 / 18.9 | 13 / 8.5 | 78 / 43.5 | 18.4 · 24.9 · 25.2 · 30.0 | 32.8 / 44.4 | 93 % |
| expert|balanced|dive+sharp|better|i:whistleStop | 100 % | 23 / 10.4 | 20 / 11.2 | 14 / 8.7 | 19 / 12.3 | 67 / 38.4 | 18.4 · 24.9 · 30.6 · 32.5 | 33.8 / 43.5 | 99 % |
| expert|balanced|dive+sharp|better|i:kiteTail | 100 % | 23 / 10.4 | 20 / 13.9 | 9 / 8.4 | 12 / 11.2 | 61 / 42.9 | 18.4 · 30.0 · 49.7 · 48.8 | 53.6 / 66.4 | 92 % |
| expert|balanced|dive+sharp|better|i:sailStripes | 100 % | 23 / 10.4 | 20 / 11.2 | 38 / 20.3 | 30 / 19.2 | 99 / 54.7 | 18.4 · 24.9 · 25.3 · 29.7 | 32.6 / 38.3 | 93 % |
| expert|balanced|dive+sharp|better|i:overTheLine|base | 100 % | 23 / 10.4 | 20 / 11.2 | 16 / 9.5 | 20 / 12.3 | 71 / 40.2 | 18.4 · 24.9 · 28.5 · 28.8 | 32.0 / 38.3 | 99 % |
| expert|balanced|calm+cushion|better | 100 % | 23 / 10.4 | 18 / 9.9 | 23 / 13.1 | 21 / 12.6 | 78 / 43.1 | 18.4 · 25.4 · 26.3 · 27.1 | 30.0 / 37.4 | 100 % |
| expert|balanced|calm+cushion|better|i:overTheLine | 100 % | 23 / 10.4 | 18 / 9.9 | 22 / 13.6 | 21 / 13.8 | 75 / 42.4 | 18.4 · 25.4 · 28.6 · 29.8 | 32.7 / 39.4 | 100 % |
| expert|balanced|calm+cushion|better|i:hawkFeather | 100 % | 23 / 10.3 | 11 / 7.0 | 15 / 10.3 | 6 / 4.4 | 49 / 28.9 | 18.1 · 31.3 · 32.3 · 35.3 | 36.8 / 40.9 | 100 % |
| expert|balanced|calm+cushion|better|i:skimmerRipples | 100 % | 23 / 10.4 | 39 / 18.3 | 37 / 18.3 | 34 / 18.6 | 122 / 62.8 | 18.4 · 22.1 · 24.3 · 25.4 | 28.2 / 31.7 | 100 % |
| expert|balanced|calm+cushion|better|i:needleThread | 100 % | 23 / 10.4 | 18 / 9.9 | 23 / 13.1 | 23 / 12.4 | 80 / 43.0 | 18.4 · 25.4 · 26.3 · 23.6 | 29.5 / 33.4 | 100 % |
| expert|balanced|calm+cushion|better|i:whistleStop|base | 100 % | 23 / 10.4 | 18 / 9.9 | 13 / 8.2 | 22 / 14.4 | 71 / 40.0 | 18.4 · 25.4 · 30.3 · 30.4 | 34.4 / 43.5 | 100 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| average|balanced|auto|better | 3 / 11 / 11 | 7 / 14 | 51 | 72 % | 51 % | 13 % | 0 % | – |
| average|balanced|auto|better|i:overTheLine | 3 / 12 / 12 | 7 / 14 | 74 | 70 % | 65 % | 17 % | 0 % | – |
| average|balanced|auto|better|i:hawkFeather | 2 / 6 / 6 | 4 / 8 | 44 | 59 % | 19 % | 15 % | 0 % | – |
| average|balanced|auto|better|i:skimmerRipples | 3 / 16 / 16 | 8 / 19 | 53 | 85 % | 20 % | 8 % | 0 % | – |
| average|balanced|auto|better|i:needleThread | 3 / 11 / 11 | 7 / 14 | 51 | 70 % | 44 % | 10 % | 0 % | – |
| average|balanced|auto|better|i:whistleStop|base | 3 / 10 / 10 | 7 / 11 | 51 | 70 % | 63 % | 15 % | 0 % | – |
| average|balanced|dive+sharp|better|i:kettleSong | 2 / 13 / 13 | 6 / 15 | 63 | 67 % | 47 % | 7 % | 0 % | 2 % |
| average|balanced|dive+sharp|better|i:whistleStop | 3 / 10 / 10 | 7 / 15 | 51 | 65 % | 62 % | 15 % | 0 % | 5 % |
| average|balanced|dive+sharp|better|i:kiteTail | 3 / 6 / 6 | 7 / 9 | 33 | 57 % | 27 % | 1 % | 0 % | 1 % |
| average|balanced|dive+sharp|better|i:sailStripes | 2 / 13 / 13 | 7 / 15 | 63 | 72 % | 37 % | 6 % | 0 % | 1 % |
| average|balanced|dive+sharp|better|i:overTheLine|base | 2 / 11 / 11 | 7 / 11 | 51 | 67 % | 53 % | 12 % | 0 % | 5 % |
| average|balanced|calm+cushion|better | 3 / 11 / 11 | 7 / 14 | 65 | 65 % | 65 % | 10 % | 0 % | – |
| average|balanced|calm+cushion|better|i:overTheLine | 3 / 12 / 12 | 7 / 14 | 74 | 70 % | 65 % | 17 % | 0 % | – |
| average|balanced|calm+cushion|better|i:hawkFeather | 2 / 8 / 8 | 4 / 9 | 48 | 72 % | 19 % | 13 % | 0 % | – |
| average|balanced|calm+cushion|better|i:skimmerRipples | 3 / 16 / 16 | 8 / 35 | 56 | 67 % | 20 % | 3 % | 0 % | – |
| average|balanced|calm+cushion|better|i:needleThread | 3 / 11 / 11 | 7 / 14 | 65 | 70 % | 50 % | 9 % | 0 % | – |
| average|balanced|calm+cushion|better|i:whistleStop|base | 3 / 10 / 10 | 7 / 11 | 51 | 70 % | 63 % | 15 % | 0 % | – |
| expert|balanced|auto|better|i:kettleSong | 2 / 11 / 11 | 6 / 15 | 41 | 63 % | 41 % | 12 % | 0 % | 0 % |
| expert|balanced|auto|better|i:whistleStop | 2 / 4 / 4 | 5 / 8 | 40 | 61 % | 57 % | 23 % | 0 % | 0 % |
| expert|balanced|auto|better|i:kiteTail | 2 / 7 / 7 | 4 / 9 | 27 | 50 % | 28 % | 5 % | 0 % | 0 % |
| expert|balanced|auto|better|i:sailStripes | 2 / 11 / 11 | 6 / 15 | 64 | 72 % | 32 % | 12 % | 0 % | 0 % |
| expert|balanced|auto|better|i:overTheLine|base | 2 / 8 / 8 | 5 / 8 | 33 | 63 % | 54 % | 22 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better | 2 / 11 / 11 | 6 / 15 | 41 | 63 % | 41 % | 12 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:overTheLine | 3 / 12 / 12 | 6 / 11 | 39 | 65 % | 59 % | 17 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:hawkFeather | 2 / 4 / 4 | 4 / 7 | 28 | 54 % | 25 % | 4 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:skimmerRipples | 2 / 16 / 16 | 5 / 29 | 46 | 67 % | 27 % | 3 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:needleThread | 2 / 11 / 11 | 6 / 15 | 41 | 65 % | 38 % | 10 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:whistleStop|base | 2 / 4 / 4 | 5 / 8 | 40 | 61 % | 57 % | 23 % | 0 % | 0 % |
| expert|balanced|calm+cushion|better|i:kettleSong | 2 / 9 / 9 | 5 / 9 | 40 | 67 % | 63 % | 14 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:whistleStop | 2 / 8 / 8 | 4 / 8 | 34 | 63 % | 62 % | 27 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:kiteTail | 2 / 8 / 8 | 4 / 9 | 32 | 59 % | 32 % | 20 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:sailStripes | 2 / 10 / 10 | 5 / 15 | 40 | 61 % | 39 % | 14 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:overTheLine|base | 2 / 7 / 7 | 5 / 9 | 34 | 61 % | 54 % | 22 % | 0 % | – |
| average|balanced|auto|better|i:kettleSong | 3 / 11 / 11 | 6 / 12 | 48 | 72 % | 55 % | 9 % | 0 % | – |
| average|balanced|auto|better|i:whistleStop | 3 / 10 / 10 | 7 / 11 | 51 | 70 % | 62 % | 16 % | 0 % | – |
| average|balanced|auto|better|i:kiteTail | 2 / 5 / 5 | 3 / 9 | 46 | 48 % | 27 % | 7 % | 0 % | – |
| average|balanced|auto|better|i:sailStripes | 3 / 11 / 11 | 8 / 23 | 51 | 70 % | 29 % | 18 % | 0 % | – |
| average|balanced|auto|better|i:overTheLine|base | 3 / 11 / 11 | 7 / 14 | 51 | 72 % | 51 % | 13 % | 0 % | – |
| average|balanced|dive+sharp|better | 2 / 13 / 13 | 6 / 15 | 63 | 67 % | 47 % | 7 % | 0 % | 2 % |
| average|balanced|dive+sharp|better|i:overTheLine | 2 / 12 / 12 | 7 / 14 | 74 | 70 % | 66 % | 17 % | 0 % | 5 % |
| average|balanced|dive+sharp|better|i:hawkFeather | 2 / 6 / 6 | 4 / 8 | 43 | 54 % | 19 % | 10 % | 0 % | 0 % |
| average|balanced|dive+sharp|better|i:skimmerRipples | 2 / 15 / 15 | 7 / 20 | 56 | 74 % | 20 % | 3 % | 0 % | 2 % |
| average|balanced|dive+sharp|better|i:needleThread | 2 / 13 / 13 | 6 / 15 | 63 | 67 % | 47 % | 5 % | 0 % | 5 % |
| average|balanced|dive+sharp|better|i:whistleStop|base | 2 / 10 / 10 | 7 / 11 | 51 | 70 % | 63 % | 15 % | 0 % | 5 % |
| average|balanced|calm+cushion|better|i:kettleSong | 3 / 11 / 11 | 7 / 14 | 65 | 65 % | 65 % | 10 % | 0 % | – |
| average|balanced|calm+cushion|better|i:whistleStop | 3 / 10 / 10 | 7 / 11 | 51 | 70 % | 62 % | 16 % | 0 % | – |
| average|balanced|calm+cushion|better|i:kiteTail | 2 / 6 / 6 | 6 / 9 | – | 50 % | 27 % | 3 % | 0 % | – |
| average|balanced|calm+cushion|better|i:sailStripes | 2 / 11 / 11 | 8 / 16 | 74 | 74 % | 44 % | 11 % | 0 % | – |
| average|balanced|calm+cushion|better|i:overTheLine|base | 3 / 11 / 11 | 7 / 14 | 51 | 72 % | 51 % | 13 % | 0 % | – |
| expert|balanced|auto|better | 2 / 11 / 11 | 6 / 15 | 41 | 63 % | 41 % | 12 % | 0 % | 0 % |
| expert|balanced|auto|better|i:overTheLine | 3 / 12 / 12 | 6 / 11 | 39 | 65 % | 59 % | 17 % | 0 % | 0 % |
| expert|balanced|auto|better|i:hawkFeather | 2 / 4 / 4 | 4 / 7 | 28 | 54 % | 25 % | 4 % | 0 % | 0 % |
| expert|balanced|auto|better|i:skimmerRipples | 2 / 16 / 16 | 5 / 29 | 46 | 67 % | 27 % | 3 % | 0 % | 0 % |
| expert|balanced|auto|better|i:needleThread | 2 / 11 / 11 | 6 / 15 | 41 | 65 % | 38 % | 10 % | 0 % | 0 % |
| expert|balanced|auto|better|i:whistleStop|base | 2 / 4 / 4 | 5 / 8 | 40 | 61 % | 57 % | 23 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:kettleSong | 2 / 11 / 11 | 6 / 15 | 41 | 63 % | 41 % | 12 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:whistleStop | 2 / 4 / 4 | 5 / 8 | 40 | 61 % | 57 % | 23 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:kiteTail | 2 / 7 / 7 | 4 / 9 | 27 | 50 % | 28 % | 5 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:sailStripes | 2 / 11 / 11 | 6 / 15 | 64 | 72 % | 32 % | 12 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better|i:overTheLine|base | 2 / 8 / 8 | 5 / 8 | 33 | 63 % | 54 % | 22 % | 0 % | 0 % |
| expert|balanced|calm+cushion|better | 2 / 9 / 9 | 5 / 9 | 40 | 67 % | 63 % | 14 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:overTheLine | 2 / 9 / 9 | 5 / 9 | 42 | 67 % | 53 % | 27 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:hawkFeather | 2 / 4 / 4 | 4 / 8 | 47 | 57 % | 22 % | 12 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:skimmerRipples | 2 / 13 / 13 | 7 / 19 | 49 | 70 % | 20 % | 4 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:needleThread | 2 / 8 / 8 | 5 / 9 | 40 | 61 % | 51 % | 13 % | 0 % | – |
| expert|balanced|calm+cushion|better|i:whistleStop|base | 2 / 8 / 8 | 4 / 8 | 34 | 63 % | 62 % | 27 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| average|balanced|auto|better | 1876 / 4059 / 8008 / 9496 | 1575 / 3930 / 6685 / 9205 | paper 12020, workshop 1120, atlas 5755, pocket 300, model 2200 | 2965 |
| average|balanced|auto|better|i:overTheLine | 1876 / 4059 / 8145 / 8964 | 1575 / 3930 / 7515 / 5995 | paper 9820, workshop 1120, atlas 5255, pocket 2820 | 4583 |
| average|balanced|auto|better|i:hawkFeather | 1987 / 2403 / 3002 / 3838 | 1700 / 2375 / 2735 / 2740 | paper 4820, workshop 1120, model 400, atlas 2910, pocket 300 | 2718 |
| average|balanced|auto|better|i:skimmerRipples | 1876 / 6516 / 9649 / 12940 | 1575 / 6115 / 8620 / 12355 | paper 17420, workshop 1120, atlas 6425, pocket 300, model 3400 | 2441 |
| average|balanced|auto|better|i:needleThread | 1876 / 4059 / 8008 / 9456 | 1575 / 3930 / 6685 / 8955 | paper 14220, workshop 1120, atlas 3505, pocket 300, model 2000 | 3326 |
| average|balanced|auto|better|i:whistleStop|base | 1876 / 4059 / 8012 / 3295 | 1575 / 3930 / 7810 / 2790 | paper 10220, workshop 1120, atlas 3415, pocket 300, model 1050 | 1242 |
| average|balanced|dive+sharp|better|i:kettleSong | 1876 / 4003 / 5418 / 3975 | 1575 / 3885 / 5165 / 2340 | paper 6220, workshop 1120, atlas 3925, pocket 300, model 1400 | 3769 |
| average|balanced|dive+sharp|better|i:whistleStop | 1876 / 4003 / 5284 / 8655 | 1575 / 3885 / 4530 / 6600 | paper 9820, workshop 1120, atlas 4000, pocket 300, model 1350 | 3898 |
| average|balanced|dive+sharp|better|i:kiteTail | 1876 / 2779 / 3555 / 3292 | 1575 / 2435 / 2565 / 3520 | paper 6220, workshop 1120, atlas 1905, pocket 150, model 700 | 2176 |
| average|balanced|dive+sharp|better|i:sailStripes | 1876 / 4003 / 5554 / 7244 | 1575 / 3885 / 5195 / 6865 | paper 8020, workshop 1120, atlas 4430, pocket 300, model 3650 | 1265 |
| average|balanced|dive+sharp|better|i:overTheLine|base | 1876 / 4003 / 7593 / 2490 | 1575 / 3885 / 6640 / 3220 | paper 9820, workshop 1120, atlas 4080, pocket 300 | 730 |
| average|balanced|calm+cushion|better | 1876 / 4059 / 7938 / 1653 | 1575 / 3930 / 7215 / 750 | paper 8020, workshop 1120, atlas 3830, pocket 300, model 200 | 2725 |
| average|balanced|calm+cushion|better|i:overTheLine | 1876 / 4059 / 8145 / 8964 | 1575 / 3930 / 7515 / 5995 | paper 9820, workshop 1120, atlas 5255, pocket 2820 | 4583 |
| average|balanced|calm+cushion|better|i:hawkFeather | 1987 / 2403 / 4419 / 5466 | 1700 / 2375 / 4070 / 4625 | paper 6620, workshop 1120, model 400, atlas 4330, pocket 300 | 2255 |
| average|balanced|calm+cushion|better|i:skimmerRipples | 1876 / 6516 / 6037 / 12966 | 1575 / 6115 / 6060 / 12510 | paper 17420, workshop 1120, atlas 3670, pocket 300, model 3750 | 1429 |
| average|balanced|calm+cushion|better|i:needleThread | 1876 / 4059 / 7938 / 6592 | 1575 / 3930 / 7215 / 6755 | paper 11820, workshop 1120, atlas 3835, pocket 300, model 2400 | 1099 |
| average|balanced|calm+cushion|better|i:whistleStop|base | 1876 / 4059 / 8012 / 3295 | 1575 / 3930 / 7810 / 2790 | paper 10220, workshop 1120, atlas 3415, pocket 300, model 1050 | 1242 |
| expert|balanced|auto|better|i:kettleSong | 1624 / 2774 / 8588 / 3602 | 1450 / 2620 / 7825 / 2775 | paper 6220, workshop 1120, atlas 3260, pocket 2820, model 1250 | 2987 |
| expert|balanced|auto|better|i:whistleStop | 1624 / 2774 / 3158 / 6231 | 1450 / 2620 / 2760 / 6190 | paper 8020, workshop 1120, atlas 3580, pocket 300 | 888 |
| expert|balanced|auto|better|i:kiteTail | 1624 / 2825 / 2546 / 4225 | 1450 / 2370 / 2585 / 3480 | paper 6220, workshop 1120, atlas 1695, model 700, pocket 150 | 2123 |
| expert|balanced|auto|better|i:sailStripes | 1624 / 2774 / 9249 / 9274 | 1450 / 2620 / 9040 / 7460 | paper 9820, workshop 1120, atlas 4680, model 4650, pocket 300 | 2591 |
| expert|balanced|auto|better|i:overTheLine|base | 1624 / 2774 / 3877 / 7444 | 1450 / 2620 / 3760 / 7070 | paper 9820, workshop 1120, atlas 3660, pocket 300 | 939 |
| expert|balanced|dive+sharp|better | 1624 / 2774 / 8588 / 3602 | 1450 / 2620 / 7825 / 2775 | paper 6220, workshop 1120, atlas 3260, pocket 2820, model 1250 | 2987 |
| expert|balanced|dive+sharp|better|i:overTheLine | 1624 / 2774 / 4446 / 8240 | 1450 / 2620 / 2830 / 7660 | paper 6620, workshop 1120, atlas 4000, pocket 2820 | 2631 |
| expert|balanced|dive+sharp|better|i:hawkFeather | 1624 / 1935 / 2389 / 2348 | 1355 / 1765 / 1840 / 2590 | paper 3420, workshop 945, model 400, atlas 2485, pocket 300 | 826 |
| expert|balanced|dive+sharp|better|i:skimmerRipples | 1624 / 3543 / 10099 / 6098 | 1450 / 3335 / 8470 / 7415 | paper 9820, workshop 1120, atlas 4010, model 2900, pocket 2820 | 742 |
| expert|balanced|dive+sharp|better|i:needleThread | 1624 / 2774 / 8588 / 5556 | 1450 / 2620 / 7825 / 5855 | paper 9820, workshop 1120, atlas 3260, pocket 300, model 3250 | 848 |
| expert|balanced|dive+sharp|better|i:whistleStop|base | 1624 / 2774 / 3158 / 6231 | 1450 / 2620 / 2760 / 6190 | paper 8020, workshop 1120, atlas 3580, pocket 300 | 888 |
| expert|balanced|calm+cushion|better|i:kettleSong | 1624 / 3049 / 5073 / 7324 | 1450 / 2855 / 3720 / 7110 | paper 8020, workshop 1120, atlas 4495, pocket 300, model 1200 | 2742 |
| expert|balanced|calm+cushion|better|i:whistleStop | 1624 / 3049 / 3147 / 7298 | 1450 / 2855 / 2865 / 6020 | paper 8020, workshop 1120, atlas 3750, pocket 300 | 2088 |
| expert|balanced|calm+cushion|better|i:kiteTail | 1624 / 2636 / 2396 / 6883 | 1450 / 2075 / 2630 / 6560 | paper 8020, workshop 945, atlas 2900, model 700, pocket 150 | 824 |
| expert|balanced|calm+cushion|better|i:sailStripes | 1624 / 3049 / 8994 / 2996 | 1450 / 2855 / 6925 / 4370 | paper 8020, workshop 1120, atlas 3410, pocket 300, model 2750 | 1181 |
| expert|balanced|calm+cushion|better|i:overTheLine|base | 1624 / 3049 / 3622 / 7543 | 1450 / 2855 / 3275 / 6270 | paper 8020, workshop 1120, atlas 3410, pocket 300, model 1000 | 3310 |
| average|balanced|auto|better|i:kettleSong | 1876 / 4112 / 3380 / 9789 | 1575 / 3950 / 2455 / 10220 | paper 11820, workshop 1120, atlas 3760, pocket 300, model 1200 | 1333 |
| average|balanced|auto|better|i:whistleStop | 1876 / 4059 / 4807 / 5204 | 1575 / 3930 / 4610 / 4590 | paper 8020, workshop 1120, atlas 3665, pocket 300, model 1600 | 1250 |
| average|balanced|auto|better|i:kiteTail | 1876 / 2985 / 2277 / 2304 | 1575 / 2925 / 1935 / 1735 | paper 4820, workshop 1120, atlas 1230, model 700, pocket 300 | 1779 |
| average|balanced|auto|better|i:sailStripes | 1876 / 4059 / 9920 / 6611 | 1575 / 3930 / 9505 / 6050 | paper 12020, workshop 1120, atlas 4670, pocket 300, model 2950 | 2201 |
| average|balanced|auto|better|i:overTheLine|base | 1876 / 4059 / 8008 / 9496 | 1575 / 3930 / 6685 / 9205 | paper 12020, workshop 1120, atlas 5755, pocket 300, model 2200 | 2965 |
| average|balanced|dive+sharp|better | 1876 / 4003 / 5418 / 3975 | 1575 / 3885 / 5165 / 2340 | paper 6220, workshop 1120, atlas 3925, pocket 300, model 1400 | 3769 |
| average|balanced|dive+sharp|better|i:overTheLine | 1876 / 4003 / 7073 / 9146 | 1575 / 3885 / 5510 / 8795 | paper 9820, workshop 1120, atlas 5005, pocket 2820, model 1000 | 3646 |
| average|balanced|dive+sharp|better|i:hawkFeather | 1993 / 2379 / 2030 / 4377 | 1780 / 2270 / 1690 / 3760 | paper 4820, workshop 1120, model 400, atlas 2860, pocket 300 | 1815 |
| average|balanced|dive+sharp|better|i:skimmerRipples | 1876 / 3999 / 9612 / 13099 | 1575 / 3585 / 9440 / 12970 | paper 15820, workshop 1120, atlas 5180, pocket 300, model 5150 | 1133 |
| average|balanced|dive+sharp|better|i:needleThread | 1876 / 4003 / 5418 / 7360 | 1575 / 3885 / 5165 / 4725 | paper 8020, workshop 1120, atlas 3510, pocket 300, model 2400 | 3414 |
| average|balanced|dive+sharp|better|i:whistleStop|base | 1876 / 4003 / 6523 / 4456 | 1575 / 3885 / 5575 / 4355 | paper 10220, workshop 1120, atlas 3750, pocket 300 | 1904 |
| average|balanced|calm+cushion|better|i:kettleSong | 1876 / 4059 / 7938 / 1653 | 1575 / 3930 / 7215 / 750 | paper 8020, workshop 1120, atlas 3830, pocket 300, model 200 | 2725 |
| average|balanced|calm+cushion|better|i:whistleStop | 1876 / 4059 / 4807 / 5204 | 1575 / 3930 / 4610 / 4590 | paper 8020, workshop 1120, atlas 3665, pocket 300, model 1600 | 1250 |
| average|balanced|calm+cushion|better|i:kiteTail | 1876 / 2985 / 2502 / 1771 | 1575 / 2925 / 1295 / 2495 | paper 4820, workshop 1120, atlas 1650, model 700 | 1050 |
| average|balanced|calm+cushion|better|i:sailStripes | 1876 / 4059 / 10202 / 6289 | 1575 / 3930 / 7505 / 8505 | paper 12020, workshop 1120, atlas 4925, pocket 300, model 3150 | 1198 |
| average|balanced|calm+cushion|better|i:overTheLine|base | 1876 / 4059 / 8008 / 9496 | 1575 / 3930 / 6685 / 9205 | paper 12020, workshop 1120, atlas 5755, pocket 300, model 2200 | 2965 |
| expert|balanced|auto|better | 1624 / 2774 / 8588 / 3602 | 1450 / 2620 / 7825 / 2775 | paper 6220, workshop 1120, atlas 3260, pocket 2820, model 1250 | 2987 |
| expert|balanced|auto|better|i:overTheLine | 1624 / 2774 / 4446 / 8240 | 1450 / 2620 / 2830 / 7660 | paper 6620, workshop 1120, atlas 4000, pocket 2820 | 2631 |
| expert|balanced|auto|better|i:hawkFeather | 1624 / 1935 / 2389 / 2348 | 1355 / 1765 / 1840 / 2590 | paper 3420, workshop 945, model 400, atlas 2485, pocket 300 | 826 |
| expert|balanced|auto|better|i:skimmerRipples | 1624 / 3543 / 10099 / 6098 | 1450 / 3335 / 8470 / 7415 | paper 9820, workshop 1120, atlas 4010, model 2900, pocket 2820 | 742 |
| expert|balanced|auto|better|i:needleThread | 1624 / 2774 / 8588 / 5556 | 1450 / 2620 / 7825 / 5855 | paper 9820, workshop 1120, atlas 3260, pocket 300, model 3250 | 848 |
| expert|balanced|auto|better|i:whistleStop|base | 1624 / 2774 / 3158 / 6231 | 1450 / 2620 / 2760 / 6190 | paper 8020, workshop 1120, atlas 3580, pocket 300 | 888 |
| expert|balanced|dive+sharp|better|i:kettleSong | 1624 / 2774 / 8588 / 3602 | 1450 / 2620 / 7825 / 2775 | paper 6220, workshop 1120, atlas 3260, pocket 2820, model 1250 | 2987 |
| expert|balanced|dive+sharp|better|i:whistleStop | 1624 / 2774 / 3158 / 6231 | 1450 / 2620 / 2760 / 6190 | paper 8020, workshop 1120, atlas 3580, pocket 300 | 888 |
| expert|balanced|dive+sharp|better|i:kiteTail | 1624 / 2825 / 2546 / 4225 | 1450 / 2370 / 2585 / 3480 | paper 6220, workshop 1120, atlas 1695, model 700, pocket 150 | 2123 |
| expert|balanced|dive+sharp|better|i:sailStripes | 1624 / 2774 / 9249 / 9274 | 1450 / 2620 / 9040 / 7460 | paper 9820, workshop 1120, atlas 4680, model 4650, pocket 300 | 2591 |
| expert|balanced|dive+sharp|better|i:overTheLine|base | 1624 / 2774 / 3877 / 7444 | 1450 / 2620 / 3760 / 7070 | paper 9820, workshop 1120, atlas 3660, pocket 300 | 939 |
| expert|balanced|calm+cushion|better | 1624 / 3049 / 5073 / 7324 | 1450 / 2855 / 3720 / 7110 | paper 8020, workshop 1120, atlas 4495, pocket 300, model 1200 | 2742 |
| expert|balanced|calm+cushion|better|i:overTheLine | 1624 / 3049 / 5040 / 6743 | 1450 / 2855 / 4025 / 7410 | paper 9820, workshop 1120, atlas 4500, pocket 300 | 788 |
| expert|balanced|calm+cushion|better|i:hawkFeather | 1624 / 1750 / 4189 / 2093 | 1355 / 1365 / 4185 / 1580 | paper 3420, workshop 1120, model 400, atlas 3245, pocket 300 | 1316 |
| expert|balanced|calm+cushion|better|i:skimmerRipples | 1624 / 6303 / 8583 / 6120 | 1450 / 6040 / 8420 / 5550 | paper 13620, workshop 1120, atlas 3670, pocket 300, model 2750 | 1678 |
| expert|balanced|calm+cushion|better|i:needleThread | 1624 / 3049 / 5073 / 7508 | 1450 / 2855 / 3720 / 6940 | paper 8020, workshop 1120, atlas 3325, pocket 300, model 2200 | 3022 |
| expert|balanced|calm+cushion|better|i:whistleStop|base | 1624 / 3049 / 3147 / 7298 | 1450 / 2855 / 2865 / 6020 | paper 8020, workshop 1120, atlas 3750, pocket 300 | 2088 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| average|balanced|auto|better | dart: 47 % · 214 · 2047 · 429; glider: 48 % · 241 · 2315 · 421; needle: 3 % · 450 · 4408 · 868 · 100 % (101); hawk: 2 % · 384 · 3743 · 727 · 50 % (96) |
| average|balanced|auto|better|i:overTheLine | dart: 39 % · 180 · 1703 · 379; glider: 61 % · 258 · 2482 · 440 |
| average|balanced|auto|better|i:hawkFeather | dart: 23 % · 56 · 463 · 142; glider: 17 % · 69 · 597 · 152; hawk: 60 % · 271 · 2615 · 413 · 100 % (27) |
| average|balanced|auto|better|i:skimmerRipples | dart: 19 % · 103 · 936 · 240; glider: 17 % · 131 · 1215 · 253; skimmer: 64 % · 286 · 2762 · 555 · 100 % (52) |
| average|balanced|auto|better|i:needleThread | dart: 37 % · 162 · 1522 · 339; glider: 42 % · 218 · 2086 · 386; needle: 21 % · 403 · 3932 · 798 · 100 % (86) |
| average|balanced|auto|better|i:whistleStop|base | dart: 41 % · 148 · 1381 · 318; glider: 55 % · 231 · 2215 · 404; kite: 3 % · 390 · 3801 · 454 · 50 % (61); hawk: 1 % · 276 · 2664 · 526 · 50 % (63); skimmer: 1 % · 318 · 3086 · 625 · 50 % (67) |
| average|balanced|dive+sharp|better|i:kettleSong | dart: 42 % · 131 · 1214 · 294; glider: 42 % · 169 · 1592 · 315; hawk: 14 % · 384 · 3746 · 560 · 100 % (69); needle: 1 % · 368 · 3583 · 664 · 50 % (77) |
| average|balanced|dive+sharp|better|i:whistleStop | dart: 42 % · 159 · 1498 · 342; glider: 51 % · 233 · 2236 · 403; needle: 4 % · 432 · 4229 · 822 · 50 % (85); kite: 3 % · 407 · 3979 · 514 · 50 % (85) |
| average|balanced|dive+sharp|better|i:kiteTail | dart: 34 % · 85 · 751 · 205; glider: 25 % · 98 · 886 · 201; kite: 42 % · 285 · 2755 · 341 · 100 % (41) |
| average|balanced|dive+sharp|better|i:sailStripes | dart: 36 % · 128 · 1189 · 289; glider: 37 % · 170 · 1608 · 318; hawk: 7 % · 375 · 3660 · 560 · 100 % (69); sail: 19 % · 286 · 2764 · 494 · 100 % (76); needle: 1 % · 343 · 3331 · 656 · 50 % (83); skimmer: 1 % · 282 · 2720 · 453 · 50 % (88); kite: 1 % · 316 · 3068 · 501 · 50 % (94) |
| average|balanced|dive+sharp|better|i:overTheLine|base | dart: 50 % · 170 · 1606 · 355; glider: 50 % · 217 · 2070 · 388 |
| average|balanced|calm+cushion|better | dart: 38 % · 131 · 1211 · 293; glider: 59 % · 215 · 2057 · 390; hawk: 3 % · 391 · 3818 · 652 · 50 % (69) |
| average|balanced|calm+cushion|better|i:overTheLine | dart: 39 % · 180 · 1703 · 379; glider: 61 % · 258 · 2482 · 440 |
| average|balanced|calm+cushion|better|i:hawkFeather | dart: 20 % · 56 · 463 · 142; glider: 14 % · 69 · 597 · 152; hawk: 65 % · 285 · 2749 · 453 · 100 % (27) |
| average|balanced|calm+cushion|better|i:skimmerRipples | dart: 19 % · 103 · 936 · 240; glider: 17 % · 131 · 1215 · 253; skimmer: 64 % · 245 · 2358 · 521 · 100 % (52) |
| average|balanced|calm+cushion|better|i:needleThread | dart: 33 % · 131 · 1211 · 293; glider: 50 % · 211 · 2017 · 384; hawk: 2 % · 346 · 3361 · 613 · 100 % (109); needle: 15 % · 388 · 3786 · 799 · 100 % (87) |
| average|balanced|calm+cushion|better|i:whistleStop|base | dart: 41 % · 148 · 1381 · 318; glider: 55 % · 231 · 2215 · 404; kite: 3 % · 390 · 3801 · 454 · 50 % (61); hawk: 1 % · 276 · 2664 · 526 · 50 % (63); skimmer: 1 % · 318 · 3086 · 625 · 50 % (67) |
| expert|balanced|auto|better|i:kettleSong | dart: 54 % · 212 · 2026 · 409; glider: 41 % · 208 · 1987 · 357; hawk: 3 % · 376 · 3660 · 611 · 100 % (62); kite: 2 % · 231 · 2210 · 380 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|auto|better|i:whistleStop | dart: 46 % · 197 · 1872 · 378; glider: 54 % · 235 · 2253 · 388 |
| expert|balanced|auto|better|i:kiteTail | dart: 28 % · 88 · 783 · 193; glider: 20 % · 100 · 903 · 198; kite: 51 % · 299 · 2893 · 336 · 100 % (30) |
| expert|balanced|auto|better|i:sailStripes | dart: 30 % · 157 · 1473 · 322; glider: 26 % · 172 · 1628 · 308; sail: 39 % · 324 · 3144 · 535 · 100 % (60); hawk: 2 % · 271 · 2618 · 560 · 100 % (62); kite: 1 % · 333 · 3230 · 459 · 50 % (70); needle: 2 % · 534 · 5246 · 891 · 100 % (93); skimmer: 1 % · 275 · 2659 · 493 · 50 % (66) |
| expert|balanced|auto|better|i:overTheLine|base | dart: 56 % · 225 · 2155 · 420; glider: 44 % · 228 · 2182 · 391 |
| expert|balanced|dive+sharp|better | dart: 54 % · 212 · 2026 · 409; glider: 41 % · 208 · 1987 · 357; hawk: 3 % · 376 · 3660 · 611 · 100 % (62); kite: 2 % · 231 · 2210 · 380 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|dive+sharp|better|i:overTheLine | dart: 50 % · 214 · 2050 · 405; glider: 50 % · 229 · 2198 · 381 |
| expert|balanced|dive+sharp|better|i:hawkFeather | dart: 24 % · 63 · 540 · 149; glider: 15 % · 71 · 613 · 149; hawk: 61 % · 249 · 2397 · 381 · 100 % (18) |
| expert|balanced|dive+sharp|better|i:skimmerRipples | dart: 20 % · 108 · 981 · 230; glider: 17 % · 138 · 1284 · 257; skimmer: 63 % · 262 · 2529 · 505 · 100 % (38) |
| expert|balanced|dive+sharp|better|i:needleThread | dart: 46 % · 198 · 1883 · 390; glider: 38 % · 199 · 1894 · 343; hawk: 2 % · 266 · 2567 · 521 · 100 % (62); needle: 13 % · 422 · 4126 · 724 · 100 % (75); kite: 1 % · 192 · 1822 · 381 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|dive+sharp|better|i:whistleStop|base | dart: 46 % · 197 · 1872 · 378; glider: 54 % · 235 · 2253 · 388 |
| expert|balanced|calm+cushion|better|i:kettleSong | dart: 47 % · 196 · 1860 · 386; glider: 47 % · 234 · 2249 · 411; needle: 3 % · 400 · 3901 · 782 · 50 % (65); hawk: 3 % · 443 · 4337 · 729 · 50 % (51) |
| expert|balanced|calm+cushion|better|i:whistleStop | dart: 53 % · 229 · 2200 · 431; glider: 47 % · 229 · 2191 · 379 |
| expert|balanced|calm+cushion|better|i:kiteTail | dart: 26 % · 88 · 783 · 193; glider: 19 % · 100 · 903 · 198; kite: 56 % · 318 · 3090 · 372 · 100 % (30) |
| expert|balanced|calm+cushion|better|i:sailStripes | dart: 37 % · 157 · 1479 · 321; glider: 32 % · 177 · 1674 · 317; sail: 30 % · 321 · 3118 · 543 · 100 % (49); needle: 1 % · 603 · 5931 · 1109 · 50 % (72); kite: 1 % · 126 · 1170 · 303 · 50 % (52) |
| expert|balanced|calm+cushion|better|i:overTheLine|base | dart: 50 % · 208 · 1986 · 393; glider: 45 % · 227 · 2177 · 391; needle: 6 % · 404 · 3949 · 781 · 50 % (63) |
| average|balanced|auto|better|i:kettleSong | dart: 46 % · 194 · 1841 · 401; glider: 51 % · 223 · 2134 · 397; hawk: 1 % · 392 · 3818 · 634 · 50 % (67); needle: 2 % · 399 · 3890 · 835 · 50 % (84) |
| average|balanced|auto|better|i:whistleStop | dart: 39 % · 134 · 1240 · 295; glider: 53 % · 217 · 2073 · 378; kite: 6 % · 396 · 3863 · 475 · 100 % (85); hawk: 2 % · 245 · 2356 · 529 · 100 % (88); skimmer: 1 % · 318 · 3086 · 625 · 50 % (67) |
| average|balanced|auto|better|i:kiteTail | dart: 38 % · 85 · 753 · 203; glider: 26 % · 93 · 837 · 191; kite: 37 % · 287 · 2780 · 323 · 100 % (37) |
| average|balanced|auto|better|i:sailStripes | dart: 29 % · 129 · 1200 · 287; glider: 29 % · 167 · 1570 · 307; sail: 40 % · 317 · 3070 · 520 · 100 % (57); hawk: 0 % · 251 · 2419 · 485 · 50 % (55); kite: 1 % · 253 · 2436 · 385 · 50 % (61); skimmer: 1 % · 245 · 2350 · 389 · 100 % (71) |
| average|balanced|auto|better|i:overTheLine|base | dart: 47 % · 214 · 2047 · 429; glider: 48 % · 241 · 2315 · 421; needle: 3 % · 450 · 4408 · 868 · 100 % (101); hawk: 2 % · 384 · 3743 · 727 · 50 % (96) |
| average|balanced|dive+sharp|better | dart: 42 % · 131 · 1214 · 294; glider: 42 % · 169 · 1592 · 315; hawk: 14 % · 384 · 3746 · 560 · 100 % (69); needle: 1 % · 368 · 3583 · 664 · 50 % (77) |
| average|balanced|dive+sharp|better|i:overTheLine | dart: 41 % · 168 · 1585 · 357; glider: 57 % · 251 · 2411 · 425; needle: 1 % · 394 · 3840 · 761 · 50 % (89) |
| average|balanced|dive+sharp|better|i:hawkFeather | dart: 24 % · 56 · 463 · 142; glider: 17 % · 69 · 597 · 152; hawk: 60 % · 262 · 2526 · 407 · 100 % (27) |
| average|balanced|dive+sharp|better|i:skimmerRipples | dart: 21 % · 114 · 1044 · 262; glider: 17 % · 129 · 1193 · 251; skimmer: 61 % · 267 · 2570 · 531 · 100 % (53) |
| average|balanced|dive+sharp|better|i:needleThread | dart: 38 % · 131 · 1213 · 294; glider: 38 % · 169 · 1592 · 315; hawk: 8 % · 364 · 3548 · 554 · 100 % (69); needle: 17 % · 351 · 3419 · 662 · 100 % (80) |
| average|balanced|dive+sharp|better|i:whistleStop|base | dart: 46 % · 158 · 1483 · 336; glider: 54 % · 233 · 2231 · 408 |
| average|balanced|calm+cushion|better|i:kettleSong | dart: 38 % · 131 · 1211 · 293; glider: 59 % · 215 · 2057 · 390; hawk: 3 % · 391 · 3818 · 652 · 50 % (69) |
| average|balanced|calm+cushion|better|i:whistleStop | dart: 39 % · 134 · 1240 · 295; glider: 53 % · 217 · 2073 · 378; kite: 6 % · 396 · 3863 · 475 · 100 % (85); hawk: 2 % · 245 · 2356 · 529 · 100 % (88); skimmer: 1 % · 318 · 3086 · 625 · 50 % (67) |
| average|balanced|calm+cushion|better|i:kiteTail | dart: 38 % · 85 · 753 · 203; glider: 26 % · 93 · 837 · 191; kite: 37 % · 273 · 2636 · 310 · 100 % (37) |
| average|balanced|calm+cushion|better|i:sailStripes | dart: 27 % · 114 · 1048 · 263; glider: 37 % · 194 · 1843 · 352; sail: 32 % · 307 · 2971 · 539 · 100 % (69); hawk: 3 % · 361 · 3512 · 631 · 100 % (98); kite: 0 % · 206 · 1964 · 341 · 50 % (62); needle: 1 % · 406 · 3963 · 810 · 50 % (97) |
| average|balanced|calm+cushion|better|i:overTheLine|base | dart: 47 % · 214 · 2047 · 429; glider: 48 % · 241 · 2315 · 421; needle: 3 % · 450 · 4408 · 868 · 100 % (101); hawk: 2 % · 384 · 3743 · 727 · 50 % (96) |
| expert|balanced|auto|better | dart: 54 % · 212 · 2026 · 409; glider: 41 % · 208 · 1987 · 357; hawk: 3 % · 376 · 3660 · 611 · 100 % (62); kite: 2 % · 231 · 2210 · 380 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|auto|better|i:overTheLine | dart: 50 % · 214 · 2050 · 405; glider: 50 % · 229 · 2198 · 381 |
| expert|balanced|auto|better|i:hawkFeather | dart: 24 % · 63 · 540 · 149; glider: 15 % · 71 · 613 · 149; hawk: 61 % · 249 · 2397 · 381 · 100 % (18) |
| expert|balanced|auto|better|i:skimmerRipples | dart: 20 % · 108 · 981 · 230; glider: 17 % · 138 · 1284 · 257; skimmer: 63 % · 262 · 2529 · 505 · 100 % (38) |
| expert|balanced|auto|better|i:needleThread | dart: 46 % · 198 · 1883 · 390; glider: 38 % · 199 · 1894 · 343; hawk: 2 % · 266 · 2567 · 521 · 100 % (62); needle: 13 % · 422 · 4126 · 724 · 100 % (75); kite: 1 % · 192 · 1822 · 381 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|auto|better|i:whistleStop|base | dart: 46 % · 197 · 1872 · 378; glider: 54 % · 235 · 2253 · 388 |
| expert|balanced|dive+sharp|better|i:kettleSong | dart: 54 % · 212 · 2026 · 409; glider: 41 % · 208 · 1987 · 357; hawk: 3 % · 376 · 3660 · 611 · 100 % (62); kite: 2 % · 231 · 2210 · 380 · 50 % (60); skimmer: 1 % · 260 · 2504 · 474 · 50 % (66) |
| expert|balanced|dive+sharp|better|i:whistleStop | dart: 46 % · 197 · 1872 · 378; glider: 54 % · 235 · 2253 · 388 |
| expert|balanced|dive+sharp|better|i:kiteTail | dart: 28 % · 88 · 783 · 193; glider: 20 % · 100 · 903 · 198; kite: 51 % · 299 · 2893 · 336 · 100 % (30) |
| expert|balanced|dive+sharp|better|i:sailStripes | dart: 30 % · 157 · 1473 · 322; glider: 26 % · 172 · 1628 · 308; sail: 39 % · 324 · 3144 · 535 · 100 % (60); hawk: 2 % · 271 · 2618 · 560 · 100 % (62); kite: 1 % · 333 · 3230 · 459 · 50 % (70); needle: 2 % · 534 · 5246 · 891 · 100 % (93); skimmer: 1 % · 275 · 2659 · 493 · 50 % (66) |
| expert|balanced|dive+sharp|better|i:overTheLine|base | dart: 56 % · 225 · 2155 · 420; glider: 44 % · 228 · 2182 · 391 |
| expert|balanced|calm+cushion|better | dart: 47 % · 196 · 1860 · 386; glider: 47 % · 234 · 2249 · 411; needle: 3 % · 400 · 3901 · 782 · 50 % (65); hawk: 3 % · 443 · 4337 · 729 · 50 % (51) |
| expert|balanced|calm+cushion|better|i:overTheLine | dart: 54 % · 221 · 2113 · 408; glider: 46 % · 228 · 2179 · 386 |
| expert|balanced|calm+cushion|better|i:hawkFeather | dart: 22 % · 63 · 540 · 149; glider: 14 % · 71 · 613 · 149; hawk: 63 % · 273 · 2635 · 417 · 100 % (18) |
| expert|balanced|calm+cushion|better|i:skimmerRipples | dart: 17 % · 101 · 911 · 217; glider: 16 % · 135 · 1250 · 249; skimmer: 68 % · 252 · 2426 · 509 · 100 % (36) |
| expert|balanced|calm+cushion|better|i:needleThread | dart: 39 % · 164 · 1542 · 331; glider: 41 % · 215 · 2051 · 378; needle: 19 % · 384 · 3741 · 747 · 100 % (66); hawk: 1 % · 209 · 1992 · 407 · 50 % (51) |
| expert|balanced|calm+cushion|better|i:whistleStop|base | dart: 53 % · 229 · 2200 · 431; glider: 47 % · 229 · 2191 · 379 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| average | 3399 | 4.8 % | 1.4 % | 2.6 % | -16.3 % (20 %) | 7.3 % | 9.4 % | 0.8 % |
| expert | 3655 | 4.9 % | 13.6 % | 6.5 % | 0.3 % (0 %) | 16.2 % | 17.5 % | -6.4 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 1.6 % · pinwheel 1.3 % · steam 1.4 % · tape 2.3 % · crane 3.3 % · skip 0.0 % (0 % letů) · gull 4.7 % · momentum 3.8 % · thermal -1.5 % · echo 3.4 % · star 0.0 % (0 % letů) · drone 2.6 % · paperCrane 0.0 % (0 % letů) · onAir 3.1 %

Shooting Star úr. 3 v letech s hvězdou: 6.5 % (4 letů, hvězda v rozvrhu 15 % klíčů, začala v 100 %).

Paper Crane v kampani (tah v letech / přes nové místo): average|balanced|auto|better|i:overTheLine 0.5 % / 0 % · average|balanced|auto|better|i:hawkFeather 0.8 % / 0 % · average|balanced|auto|better|i:skimmerRipples 0.7 % / 0 % · average|balanced|auto|better|i:needleThread 0.5 % / 100 % · average|balanced|auto|better|i:whistleStop|base 0.6 % / 0 % · average|balanced|dive+sharp|better|i:kettleSong 0.6 % / 100 % · average|balanced|dive+sharp|better|i:whistleStop 1.1 % / 0 % · average|balanced|dive+sharp|better|i:sailStripes 1.0 % / 0 % · average|balanced|calm+cushion|better|i:overTheLine 0.5 % / 0 % · average|balanced|calm+cushion|better|i:skimmerRipples 0.4 % / 0 % · average|balanced|calm+cushion|better|i:needleThread 0.5 % / 100 % · average|balanced|calm+cushion|better|i:whistleStop|base 0.6 % / 0 % · expert|balanced|auto|better|i:kiteTail 0.9 % / 0 % · expert|balanced|auto|better|i:sailStripes 0.5 % / 0 % · expert|balanced|dive+sharp|better|i:hawkFeather 1.1 % / 0 % · expert|balanced|calm+cushion|better|i:whistleStop 0.8 % / 0 % · expert|balanced|calm+cushion|better|i:kiteTail 1.6 % / 0 % · average|balanced|auto|better|i:whistleStop 1.8 % / 0 % · average|balanced|auto|better|i:kiteTail 0.9 % / 0 % · average|balanced|dive+sharp|better 0.6 % / 100 % · average|balanced|dive+sharp|better|i:overTheLine 0.5 % / 0 % · average|balanced|dive+sharp|better|i:skimmerRipples 0.7 % / 0 % · average|balanced|dive+sharp|better|i:needleThread 1.6 % / 33 % · average|balanced|calm+cushion|better|i:whistleStop 1.8 % / 0 % · expert|balanced|auto|better|i:hawkFeather 1.1 % / 0 % · expert|balanced|dive+sharp|better|i:kiteTail 0.9 % / 0 % · expert|balanced|dive+sharp|better|i:sailStripes 0.5 % / 0 % · expert|balanced|calm+cushion|better|i:needleThread 0.7 % / 0 % · expert|balanced|calm+cushion|better|i:whistleStop|base 0.8 % / 0 %

Slabý: chain 1.2 % · pinwheel 1.3 % · steam 5.6 % · tape 2.4 % · crane 3.7 % · skip 0.0 % (0 %) · gull 4.5 % · momentum 3.6 % · thermal 6.9 % · echo 2.4 % · star 0.0 % (0 %) · drone 6.9 % · paperCrane 0.0 % (0 %) · onAir 2.5 %

## Kousky (05 §4.6, skupina balanced|auto|better)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |
|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|
| Pigeon Express | dovednost | 198 · 100 % | 45 % | – | 0.0 % | 0.0 % | 0 % / 0 % / 0 % / 0 % | – (–) | – (100 %) | – | 5.4 / 6.0 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv |
| Kettle Song | volba | 12 · 7 % | – | – | 25.0 % | 0.0 % | – / – / – / – | 25.0 % (1.00×) | 4 (0 %) | – | – | hraniční · náhoda · zdravý · – · – · náhoda | CONCERNS / CONCERNS | výskyt bez záměru ze skupiny s kapsou ze záměru; pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy |
| Over the Line | volba | 98 · 49 % | – | – | 2.0 % | 0.0 % | – / – / 0 % / 4 % | 16.3 % (7.96×) | 28 (50 %) | – | – | zdravý · zdravý · hraniční · – · zdravý · zdravý | CONCERNS / CONCERNS | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | dovednost | 143 · 72 % | – | – | 6.3 % | 14.4 % | – / 2 % / 2 % / 15 % | – (–) | 47 (0 %) | – | – | zdravý · NOT ASSESSED (bez páky) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Whistle Stop | volba | 70 · 41 % | 100 % | – | 41.4 % | 100.0 % | – / – / 50 % / – | 47.6 % (1.15×) | 1 (0 %) | – | 0.0 / 0.0; záměr min 0.0 | samozřejmý · náhoda · samozřejmý · – · samozřejmý · náhoda | CRITICAL / CRITICAL | výskyt bez záměru ze skupiny s kapsou ze záměru; přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí |
| Wish | dovednost | 64 · 32 % | 9 % | – | 3.1 % | 0.0 % | – / – / – / 2 % | – (–) | 23 (0 %) | – | – | zdravý · NOT ASSESSED (bez páky) · zdravý · – · zdravý · NOT ASSESSED | HEALTHY (záměr NOT ASSESSED) / HEALTHY (záměr NOT ASSESSED) | kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou |
| Drone Ping-Pong | dovednost | 3 · 2 % | 33 % | – | 0.0 % | – | – / – / – / – | – (–) | – (100 %) | – | – | vzácný · NOT ASSESSED (neběželo) · vzácný · – · – · NOT ASSESSED | CRITICAL / CRITICAL | dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů |
| All the Verbs | pestrost | 94 · 47 % | – | – | 6.4 % | 3.5 % | – / – / 6 % / 7 % | – (–) | 17 (0 %) | – | – | zdravý · NOT ASSESSED (bez páky) · zdravý · – · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | volba | 3 · 2 % | – | – | 0.0 % | 75.0 % | – / – / – / – | 31.9 % (∞) | ∞ / ∞ | – | – | vzácný · zdravý · pomalý · – · – · 01 §6.1 b. 15 | CONCERNS / CONCERNS | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | volba | 0 · 0 % | – | – | – | 66.7 % | – / – / – / – | 93.0 % (∞) | 3 / 3 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Skimmer: dvojitý odraz | volba | 0 · 0 % | – | – | – | 100.0 % | – / – / – / – | 65.0 % (∞) | 2 / 2 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Sail: zadní vítr | volba | 0 · 0 % | – | – | – | – | – / – / – / – | 85.4 % (∞) | 2 / 2 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Needle: drony (needleDrones) | volba | 6 · 3 % | – | – | 0.0 % | – | – / – / – / – | 0.0 % (–) | ∞ / ∞ | – | – | vzácný · vzácný · pomalý · – · – · 01 §6.1 b. 15 | CONCERNS / CONCERNS |  |

Brána (8 kousků mimo modely, platí podle tříd): záměr u všech zdravých 0 (se záměrem NOT ASSESSED 2), podle tříd (dovednost: expert / slabý ≥ 1.3×) 1, z 8, potřeba 6. Čtvrť se počítá od 30 letů s přísadami.
**Postavit:** 05 §4.7, kousky mimo modely nestavět: Hawk: 3 perfekty za sebou, Kite: perfekt termiky nebo 40 m, Skimmer: dvojitý odraz, Sail: zadní vítr, Needle: drony (needleDrones).
Korelace φ nad 0.5: žádná.
Systém: 1. kousek mimo modely (medián průměrného) 59 hodů (cíl ≤ 15); nalezeno z 13 průměrný 31 % (cíl 40 %–75 %), slabý – (cíl ≥ 25 %); nejvyšší korelace wish × allTheVerbs φ 0.32 (64 letů), nad 0.8: žádná. Kousky nic nedávají, délku nemění (test `progression-90`).

## Cíle 08 §10.2

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 70.7 | ≤ 60 | FAIL |
| Dive vysoké vybrání (průměrný) | 0.8 % | ±2 % | OK |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 1.6 % | 3 %–15 % | FAIL |
| Atlas pinwheel na úr. 3 | 1.3 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 1.4 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 2.3 % | – | – |
| Atlas crane na úr. 3 | 3.3 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 0.0 % (v 0 % letů) | 3 %–15 % | FAIL |
| Atlas gull na úr. 3 | 4.7 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 3.8 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | -1.5 % | 3 %–15 % | FAIL |
| Atlas echo na úr. 3 | 3.4 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas drone na úr. 3 | 2.6 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 0 % letů) | – | – |
| Atlas onAir na úr. 3 | 3.1 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 0 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 6.5 % (4 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 2.4 % | 3 %–15 % | FAIL |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 0 % | 30 %–50 % | FAIL |
