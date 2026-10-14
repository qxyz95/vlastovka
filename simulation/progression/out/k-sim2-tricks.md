# Simulátor progrese: k-sim2-tricks

Spuštěno 2026-10-14T19:54:39.025Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 17 / 12.6 | 85 / 45.5 | 17.8 · 26.5 · 30.5 · 33.4 | 35.3 / 44.9 | 92 % |
| weak|realistic|auto|preview|i:overTheLine | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.2 | 22 / 15.3 | 98 / 52.9 | 17.8 · 26.5 · 30.9 · 34.6 | 37.1 / 54.4 | 92 % |
| weak|realistic|auto|preview|i:kiteTail | 100 % | 36 / 15.5 | 19 / 11.5 | 13 / 11.5 | 19 / 19.1 | 82 / 52.9 | 17.8 · 30.7 · 44.2 · 45.2 | 52.5 / 65.1 | 92 % |
| weak|realistic|auto|preview|i:sailStripes | 100 % | 36 / 15.5 | 24 / 13.8 | 36 / 21.6 | 14 / 9.0 | 110 / 59.4 | 17.8 · 26.5 · 27.9 · 30.3 | 32.8 / 75.1 | 92 % |
| average|realistic|auto|preview|i:pigeonExpress | 100 % | 28 / 12.9 | 25 / 13.7 | 16 / 9.8 | 8 / 5.6 | 70 / 37.7 | 18.3 · 24.3 · 29.0 · 35.3 | 33.1 / 48.6 | 97 % |
| average|realistic|auto|preview|i:dronePingPong | 100 % | 28 / 12.9 | 25 / 13.7 | 18 / 11.3 | 12 / 9.4 | 83 / 45.3 | 18.3 · 24.3 · 29.2 · 34.4 | 34.4 / 67.3 | 97 % |
| average|realistic|auto|preview|i:skimmerRipples | 100 % | 28 / 12.9 | 51 / 25.1 | 46 / 23.3 | 34 / 18.1 | 152 / 77.1 | 18.3 · 22.3 · 24.3 · 25.8 | 28.8 / 33.4 | 98 % |
| average|realistic|auto|preview|i:needleThread | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 29 / 15.8 | 96 / 49.4 | 18.3 · 24.3 · 29.1 · 23.8 | 29.9 / 77.0 | 96 % |
| expert|realistic|auto|preview|i:overTheLine | 100 % | 21 / 10.4 | 19 / 11.0 | 19 / 12.2 | 13 / 9.0 | 71 / 42.3 | 22.8 · 27.4 · 30.6 · 33.6 | 34.9 / 41.0 | 98 % |
| expert|realistic|auto|preview|i:hawkFeather | 100 % | 23 / 11.4 | 9 / 6.0 | 8 / 5.7 | 10 / 7.3 | 49 / 30.0 | 22.1 · 31.6 · 35.7 · 38.1 | 39.8 / 47.3 | 93 % |
| expert|realistic|auto|preview|i:sailStripes | 100 % | 21 / 10.4 | 19 / 11.0 | 34 / 19.2 | 7 / 4.6 | 77 / 44.6 | 22.8 · 27.4 · 28.0 · 30.8 | 33.2 / 44.8 | 92 % |
| weak|realistic|auto|preview|i:dronePingPong | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 10.0 | 15 / 10.5 | 90 / 49.1 | 17.8 · 26.5 · 31.1 · 33.4 | 36.6 / 45.8 | 92 % |
| weak|realistic|auto|preview|i:needleThread | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 62 / 30.9 | 126 / 63.9 | 17.8 · 26.5 · 30.5 · 22.4 | 30.2 / 42.7 | 92 % |
| average|realistic|auto|preview|i:hawkFeather | 100 % | 29 / 13.0 | 13 / 8.6 | 13 / 9.0 | 14 / 9.9 | 69 / 40.6 | 18.1 · 29.9 · 33.5 · 35.1 | 36.5 / 43.7 | 96 % |
| expert|realistic|auto|preview | 100 % | 21 / 10.4 | 19 / 11.0 | 18 / 11.5 | 5 / 3.9 | 63 / 36.2 | 22.8 · 27.4 · 29.5 · 37.3 | 35.7 / 45.5 | 94 % |
| expert|realistic|auto|preview|i:kiteTail | 100 % | 21 / 10.4 | 14 / 10.6 | 10 / 9.5 | 15 / 13.4 | 70 / 51.2 | 22.8 · 30.6 · 48.8 · 45.6 | 54.0 / 67.5 | 91 % |
| weak|realistic|auto|preview|i:pigeonExpress | 100 % | 36 / 15.5 | 24 / 13.8 | 11 / 7.9 | 19 / 12.9 | 85 / 49.4 | 17.8 · 26.5 · 32.3 · 33.5 | 36.0 / 45.5 | 92 % |
| weak|realistic|auto|preview|i:skimmerRipples | 100 % | 36 / 15.5 | 37 / 19.8 | 51 / 25.8 | 49 / 25.1 | 168 / 83.4 | 17.8 · 24.5 · 24.1 · 24.9 | 28.4 / 37.2 | 93 % |
| average|realistic|auto|preview|i:overTheLine | 100 % | 28 / 12.9 | 25 / 13.7 | 17 / 11.0 | 11 / 8.5 | 84 / 46.8 | 18.3 · 24.3 · 29.6 · 35.5 | 35.2 / 44.7 | 97 % |
| average|realistic|auto|preview|i:sailStripes | 100 % | 28 / 12.9 | 25 / 13.7 | 24 / 14.4 | 23 / 14.5 | 97 / 52.3 | 18.3 · 24.3 · 28.6 · 30.9 | 33.5 / 55.2 | 97 % |
| expert|realistic|auto|preview|i:dronePingPong | 100 % | 21 / 10.4 | 19 / 11.0 | 20 / 12.5 | 4 / 3.1 | 70 / 39.8 | 22.8 · 27.4 · 29.9 · 31.6 | 34.1 / 46.9 | 98 % |
| expert|realistic|auto|preview|i:needleThread | 100 % | 21 / 10.4 | 19 / 11.0 | 18 / 11.5 | 16 / 9.6 | 69 / 39.9 | 22.8 · 27.4 · 29.5 · 27.2 | 33.1 / 45.5 | 93 % |
| weak|realistic|auto|preview|i:hawkFeather | 100 % | 37 / 15.9 | 13 / 8.4 | 15 / 10.6 | 19 / 13.0 | 80 / 44.7 | 17.7 · 31.0 · 31.9 · 34.9 | 36.2 / 45.8 | 93 % |
| average|realistic|auto|preview | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 13 / 8.4 | 78 / 41.9 | 18.3 · 24.3 · 29.1 · 33.8 | 34.0 / 77.0 | 97 % |
| average|realistic|auto|preview|i:kiteTail | 100 % | 28 / 12.9 | 19 / 13.1 | 7 / 7.1 | 24 / 22.6 | 75 / 52.5 | 18.3 · 27.4 · 50.7 · 48.1 | 54.3 / 65.1 | 96 % |
| expert|realistic|auto|preview|i:pigeonExpress | 100 % | 21 / 10.4 | 19 / 11.0 | 10 / 6.6 | 17 / 11.6 | 70 / 41.6 | 22.8 · 27.4 · 32.0 · 32.2 | 34.6 / 40.3 | 98 % |
| expert|realistic|auto|preview|i:skimmerRipples | 100 % | 21 / 10.4 | 37 / 19.7 | 31 / 16.1 | 29 / 17.3 | 113 / 60.5 | 22.8 · 25.8 · 22.2 · 23.0 | 32.1 / 41.2 | 88 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 6 / 6 | 7 / 13 | 42 | 72 % | 47 % | 11 % | 0 % | – |
| weak|realistic|auto|preview|i:overTheLine | 2 / 5 / 5 | 7 / 14 | 42 | 78 % | 48 % | 14 % | 0 % | – |
| weak|realistic|auto|preview|i:kiteTail | 2 / 6 / 6 | 7 / 11 | 55 | 65 % | 39 % | 17 % | 0 % | – |
| weak|realistic|auto|preview|i:sailStripes | 2 / 8 / 8 | 8 / 16 | 42 | 74 % | 41 % | 12 % | 0 % | – |
| average|realistic|auto|preview|i:pigeonExpress | 1 / 5 / 5 | 6 / 11 | 41 | 63 % | 59 % | 11 % | 0 % | – |
| average|realistic|auto|preview|i:dronePingPong | 1 / 6 / 6 | 6 / 12 | 41 | 72 % | 61 % | 15 % | 0 % | – |
| average|realistic|auto|preview|i:skimmerRipples | 2 / 12 / 12 | 8 / 25 | 41 | 93 % | 22 % | 6 % | 0 % | – |
| average|realistic|auto|preview|i:needleThread | 2 / 8 / 8 | 6 / 12 | 41 | 76 % | 52 % | 11 % | 0 % | – |
| expert|realistic|auto|preview|i:overTheLine | 1 / 6 / 6 | 5 / 10 | 35 | 72 % | 84 % | 23 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:hawkFeather | 1 / 4 / 4 | 4 / 7 | 34 | 57 % | 34 % | 8 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:sailStripes | 1 / 4 / 4 | 5 / 12 | 35 | 67 % | 57 % | 14 % | 0 % | 0 % |
| weak|realistic|auto|preview|i:dronePingPong | 2 / 6 / 6 | 7 / 13 | 42 | 74 % | 45 % | 14 % | 0 % | – |
| weak|realistic|auto|preview|i:needleThread | 2 / 9 / 9 | 8 / 16 | 42 | 91 % | 31 % | 7 % | 0 % | – |
| average|realistic|auto|preview|i:hawkFeather | 1 / 5 / 5 | 5 / 10 | 42 | 67 % | 22 % | 15 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 4 / 4 | 5 / 9 | 35 | 63 % | 79 % | 12 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:kiteTail | 2 / 5 / 5 | 5 / 9 | 39 | 65 % | 40 % | 8 % | 0 % | 0 % |
| weak|realistic|auto|preview|i:pigeonExpress | 2 / 5 / 5 | 8 / 13 | 42 | 74 % | 44 % | 13 % | 0 % | – |
| weak|realistic|auto|preview|i:skimmerRipples | 2 / 13 / 13 | 9 / 31 | 42 | 96 % | 24 % | 5 % | 0 % | – |
| average|realistic|auto|preview|i:overTheLine | 2 / 6 / 6 | 6 / 12 | 41 | 74 % | 60 % | 15 % | 0 % | – |
| average|realistic|auto|preview|i:sailStripes | 2 / 7 / 7 | 7 / 14 | 41 | 72 % | 42 % | 15 % | 0 % | – |
| expert|realistic|auto|preview|i:dronePingPong | 1 / 5 / 5 | 5 / 10 | 35 | 63 % | 75 % | 23 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:needleThread | 1 / 5 / 5 | 5 / 9 | 35 | 63 % | 67 % | 11 % | 0 % | 0 % |
| weak|realistic|auto|preview|i:hawkFeather | 1 / 5 / 5 | 6 / 11 | 45 | 72 % | 28 % | 16 % | 0 % | – |
| average|realistic|auto|preview | 2 / 5 / 5 | 6 / 12 | 41 | 70 % | 62 % | 13 % | 0 % | – |
| average|realistic|auto|preview|i:kiteTail | 1 / 5 / 5 | 6 / 10 | 51 | 65 % | 32 % | 18 % | 0 % | – |
| expert|realistic|auto|preview|i:pigeonExpress | 1 / 6 / 6 | 5 / 9 | 35 | 72 % | 85 % | 23 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:skimmerRipples | 2 / 9 / 9 | 6 / 23 | 38 | 83 % | 29 % | 6 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2265 / 3980 / 4360 / 7588 | 1975 / 3675 / 4010 / 6320 | workshop 1120, paper 5753, atlas 6040, pocket 300, model 567, mailbag 2200 | 2340 |
| weak|realistic|auto|preview|i:overTheLine | 2265 / 3980 / 4233 / 10713 | 1975 / 3675 / 4088 / 9325 | workshop 1120, paper 5887, atlas 8707, pocket 300, mailbag 2200, model 850 | 1812 |
| weak|realistic|auto|preview|i:kiteTail | 2265 / 2788 / 3650 / 8431 | 1975 / 2558 / 3212 / 8387 | workshop 1120, paper 6353, atlas 5058, pocket 300, model 1100, mailbag 2200 | 852 |
| weak|realistic|auto|preview|i:sailStripes | 2265 / 3980 / 9490 / 7140 | 1975 / 3675 / 8603 / 6850 | workshop 1120, paper 6953, atlas 7347, pocket 300, mailbag 1900, model 3483 | 2024 |
| average|realistic|auto|preview|i:pigeonExpress | 1925 / 4368 / 4279 / 3082 | 1618 / 4160 / 3868 / 2448 | workshop 1120, paper 3887, atlas 4622, mailbag 1767, pocket 300, model 400 | 1222 |
| average|realistic|auto|preview|i:dronePingPong | 1925 / 4368 / 5853 / 4529 | 1618 / 4160 / 5143 / 4508 | workshop 1120, paper 5287, atlas 6040, pocket 300, mailbag 2050, model 633 | 1133 |
| average|realistic|auto|preview|i:skimmerRipples | 1925 / 7813 / 12914 / 14079 | 1618 / 6848 / 11437 / 15167 | workshop 1120, paper 14353, atlas 11597, mailbag 2200, model 5500, pocket 300 | 1597 |
| average|realistic|auto|preview|i:needleThread | 1925 / 4368 / 4991 / 9814 | 1618 / 4160 / 4297 / 9472 | workshop 1120, paper 6487, atlas 6790, pocket 300, mailbag 2200, model 2650 | 1351 |
| expert|realistic|auto|preview|i:overTheLine | 1600 / 3674 / 6069 / 5070 | 1328 / 3423 / 5547 / 4818 | paper 5287, workshop 1120, atlas 6177, pocket 300, mailbag 1900, model 333 | 1353 |
| expert|realistic|auto|preview|i:hawkFeather | 1749 / 1761 / 2452 / 4373 | 1415 / 1687 / 2245 / 3855 | workshop 1120, paper 3237, model 400, atlas 2828, pocket 300, mailbag 1317 | 811 |
| expert|realistic|auto|preview|i:sailStripes | 1600 / 3674 / 8916 / 4591 | 1328 / 3423 / 7848 / 4813 | paper 4953, workshop 1120, atlas 5207, pocket 300, mailbag 1900, model 3933 | 1355 |
| weak|realistic|auto|preview|i:dronePingPong | 2265 / 3980 / 5081 / 7733 | 1975 / 3675 / 4633 / 6480 | workshop 1120, paper 5287, atlas 7457, pocket 300, model 400, mailbag 2200 | 2103 |
| weak|realistic|auto|preview|i:needleThread | 2265 / 3980 / 4360 / 23466 | 1975 / 3675 / 4010 / 22633 | workshop 1120, paper 10553, atlas 12180, pocket 1140, model 5100, mailbag 2200 | 1264 |
| average|realistic|auto|preview|i:hawkFeather | 1982 / 2583 / 4335 / 6372 | 1642 / 2287 / 3967 / 5885 | workshop 1120, paper 4353, model 400, atlas 5407, mailbag 2200, pocket 300 | 1886 |
| expert|realistic|auto|preview | 1600 / 3674 / 4704 / 2263 | 1328 / 3423 / 4167 / 2022 | paper 3237, workshop 1120, atlas 4033, pocket 300, mailbag 1467, model 783 | 1200 |
| expert|realistic|auto|preview|i:kiteTail | 1600 / 2795 / 3558 / 6827 | 1328 / 2578 / 3123 / 6298 | paper 3887, workshop 1062, atlas 4513, model 1567, mailbag 2050, pocket 250 | 1418 |
| weak|realistic|auto|preview|i:pigeonExpress | 2265 / 3980 / 3601 / 8904 | 1975 / 3675 / 3327 / 8410 | workshop 1120, paper 6353, atlas 7013, pocket 300, model 400, mailbag 2200 | 1468 |
| weak|realistic|auto|preview|i:skimmerRipples | 2265 / 6229 / 15144 / 17529 | 1975 / 5807 / 14038 / 18250 | workshop 1120, paper 18687, atlas 12263, pocket 300, model 5500, mailbag 2200 | 924 |
| average|realistic|auto|preview|i:overTheLine | 1925 / 4368 / 5360 / 4619 | 1618 / 4160 / 4593 / 4592 | workshop 1120, paper 4820, atlas 6123, mailbag 2200, pocket 300, model 400 | 1068 |
| average|realistic|auto|preview|i:sailStripes | 1925 / 4368 / 6550 / 9243 | 1618 / 4160 / 5218 / 9217 | workshop 1120, paper 6820, atlas 6790, mailbag 2200, pocket 300, model 2983 | 1982 |
| expert|realistic|auto|preview|i:dronePingPong | 1600 / 3674 / 5170 / 4404 | 1328 / 3423 / 4375 / 3875 | paper 4353, workshop 1120, atlas 4645, pocket 300, mailbag 1917, model 667 | 2491 |
| expert|realistic|auto|preview|i:needleThread | 1600 / 3674 / 4704 / 5394 | 1328 / 3423 / 4167 / 4905 | paper 4303, workshop 1120, atlas 4567, pocket 300, mailbag 1750, model 1783 | 1425 |
| weak|realistic|auto|preview|i:hawkFeather | 2299 / 2375 / 4896 / 7917 | 1955 / 2305 / 4200 / 7357 | workshop 1120, paper 5287, atlas 6510, model 400, mailbag 2200, pocket 300 | 1507 |
| average|realistic|auto|preview | 1925 / 4368 / 4991 / 5119 | 1618 / 4160 / 4297 / 4458 | workshop 1120, paper 5287, atlas 5177, mailbag 2200, pocket 300, model 450 | 1756 |
| average|realistic|auto|preview|i:kiteTail | 1925 / 3477 / 2321 / 10359 | 1618 / 3245 / 1853 / 9077 | workshop 1120, paper 4820, atlas 6253, model 1100, mailbag 2200, pocket 300 | 2668 |
| expert|realistic|auto|preview|i:pigeonExpress | 1600 / 3674 / 3611 / 7482 | 1328 / 3423 / 3313 / 6698 | paper 5287, workshop 1120, atlas 5257, pocket 300, mailbag 2200, model 600 | 1363 |
| expert|realistic|auto|preview|i:skimmerRipples | 1600 / 5557 / 9183 / 11377 | 1328 / 5187 / 8742 / 10330 | paper 7553, workshop 1120, atlas 9847, model 4567, pocket 300, mailbag 2200 | 1612 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 18 % · 100 · 856 · 240; glider: 50 % · 127 · 1111 · 251; hawk: 32 % · 418 · 3300 · 620 · 100 % (67) |
| weak|realistic|auto|preview|i:overTheLine | dart: 17 % · 95 · 816 · 228; glider: 47 % · 130 · 1132 · 254; hawk: 35 % · 412 · 3218 · 599 · 100 % (70); kite: 2 % · 500 · 3753 · 610 · 17 % (93) |
| weak|realistic|auto|preview|i:kiteTail | dart: 15 % · 66 · 561 · 167; glider: 36 % · 83 · 724 · 176; kite: 49 % · 346 · 2784 · 395 · 100 % (43) |
| weak|realistic|auto|preview|i:sailStripes | dart: 15 % · 93 · 800 · 225; glider: 41 % · 128 · 1123 · 252; sail: 29 % · 344 · 2698 · 581 · 100 % (66); hawk: 13 % · 357 · 2889 · 556 · 100 % (67); kite: 2 % · 440 · 3344 · 543 · 50 % (87) |
| average|realistic|auto|preview|i:pigeonExpress | dart: 28 % · 110 · 952 · 247; glider: 55 % · 165 · 1451 · 307; hawk: 17 % · 410 · 3271 · 613 · 100 % (64) |
| average|realistic|auto|preview|i:dronePingPong | dart: 27 % · 121 · 1041 · 267; glider: 54 % · 177 · 1531 · 325; hawk: 17 % · 417 · 3282 · 621 · 100 % (67); kite: 2 % · 413 · 3179 · 518 · 33 % (75) |
| average|realistic|auto|preview|i:skimmerRipples | dart: 12 % · 87 · 758 · 201; glider: 21 % · 126 · 1135 · 245; skimmer: 67 % · 318 · 2509 · 625 · 100 % (50) |
| average|realistic|auto|preview|i:needleThread | dart: 24 % · 127 · 1086 · 278; glider: 46 % · 177 · 1528 · 327; hawk: 7 % · 372 · 3032 · 587 · 83 % (64); needle: 21 % · 426 · 3245 · 834 · 67 % (72); kite: 2 % · 387 · 3080 · 450 · 50 % (80) |
| expert|realistic|auto|preview|i:overTheLine | dart: 12 % · 142 · 1255 · 299; glider: 77 % · 223 · 1867 · 373; hawk: 11 % · 431 · 3479 · 640 · 83 % (68) |
| expert|realistic|auto|preview|i:hawkFeather | dart: 9 % · 67 · 577 · 154; glider: 30 % · 68 · 587 · 134; hawk: 61 % · 299 · 2634 · 436 · 100 % (18) |
| expert|realistic|auto|preview|i:sailStripes | dart: 10 % · 135 · 1192 · 286; glider: 49 % · 162 · 1437 · 284; sail: 31 % · 314 · 2511 · 532 · 100 % (50); hawk: 9 % · 408 · 3294 · 594 · 100 % (57); kite: 1 % · 356 · 2720 · 537 · 67 % (70) |
| weak|realistic|auto|preview|i:dronePingPong | dart: 17 % · 92 · 793 · 223; glider: 48 % · 125 · 1086 · 246; hawk: 35 % · 398 · 3121 · 587 · 100 % (67) |
| weak|realistic|auto|preview|i:needleThread | dart: 12 % · 100 · 856 · 240; glider: 34 % · 127 · 1111 · 251; hawk: 12 % · 340 · 2855 · 523 · 100 % (67); needle: 42 % · 413 · 3112 · 845 · 100 % (77) |
| average|realistic|auto|preview|i:hawkFeather | dart: 19 % · 60 · 505 · 144; hawk: 64 % · 315 · 2616 · 483 · 100 % (24); glider: 16 % · 60 · 510 · 133 |
| expert|realistic|auto|preview | dart: 14 % · 131 · 1153 · 280; glider: 73 % · 182 · 1581 · 313; hawk: 13 % · 410 · 3492 · 590 · 83 % (53); needle: 0 % · 647 · 4888 · 1021 · 17 % (64) |
| expert|realistic|auto|preview|i:kiteTail | dart: 7 % · 67 · 577 · 154; glider: 36 % · 96 · 862 · 177; kite: 57 % · 336 · 2812 · 384 · 100 % (28) |
| weak|realistic|auto|preview|i:pigeonExpress | dart: 16 % · 80 · 692 · 198; glider: 49 % · 128 · 1118 · 251; hawk: 34 % · 412 · 3238 · 602 · 100 % (67) |
| weak|realistic|auto|preview|i:skimmerRipples | dart: 8 % · 75 · 647 · 186; glider: 23 % · 113 · 986 · 225; hawk: 2 % · 215 · 1954 · 371 · 100 % (58); skimmer: 67 % · 315 · 2464 · 623 · 100 % (55) |
| average|realistic|auto|preview|i:overTheLine | dart: 27 % · 121 · 1042 · 264; glider: 52 % · 166 · 1462 · 308; hawk: 21 % · 427 · 3363 · 620 · 100 % (67) |
| average|realistic|auto|preview|i:sailStripes | dart: 23 % · 123 · 1060 · 271; glider: 41 % · 159 · 1399 · 299; sail: 24 % · 376 · 2921 · 611 · 100 % (62); hawk: 10 % · 428 · 3355 · 654 · 100 % (64); kite: 2 % · 462 · 3531 · 567 · 50 % (76) |
| expert|realistic|auto|preview|i:dronePingPong | dart: 15 % · 176 · 1490 · 358; glider: 72 % · 198 · 1693 · 336; needle: 3 % · 460 · 3451 · 859 · 17 % (60); hawk: 11 % · 427 · 3485 · 639 · 83 % (58) |
| expert|realistic|auto|preview|i:needleThread | dart: 12 % · 131 · 1153 · 280; glider: 64 % · 175 · 1537 · 303; hawk: 9 % · 380 · 3250 · 556 · 83 % (53); needle: 14 % · 460 · 3638 · 805 · 67 % (58) |
| weak|realistic|auto|preview|i:hawkFeather | dart: 14 % · 59 · 493 · 152; glider: 25 % · 56 · 463 · 128; hawk: 61 % · 328 · 2702 · 504 · 100 % (32) |
| average|realistic|auto|preview | dart: 28 % · 127 · 1086 · 278; glider: 54 % · 177 · 1528 · 327; kite: 2 % · 387 · 3080 · 450 · 17 % (60); hawk: 16 % · 462 · 3574 · 689 · 83 % (64) |
| average|realistic|auto|preview|i:kiteTail | dart: 19 % · 68 · 581 · 160; glider: 30 % · 99 · 897 · 198; kite: 52 % · 374 · 3007 · 416 · 100 % (37) |
| expert|realistic|auto|preview|i:pigeonExpress | dart: 10 % · 113 · 1019 · 246; glider: 80 % · 240 · 1995 · 397; needle: 1 % · 484 · 3634 · 888 · 17 % (61); hawk: 8 % · 418 · 3360 · 640 · 67 % (72) |
| expert|realistic|auto|preview|i:skimmerRipples | dart: 6 % · 107 · 969 · 235; glider: 29 % · 128 · 1154 · 229; skimmer: 64 % · 323 · 2565 · 600 · 100 % (39); hawk: 1 % · 255 · 2304 · 400 · 100 % (54) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 1.2 % / 17 % · weak|realistic|auto|preview|i:overTheLine 0.7 % / 25 % · weak|realistic|auto|preview|i:kiteTail 1.0 % / 20 % · weak|realistic|auto|preview|i:sailStripes 0.3 % / 0 % · average|realistic|auto|preview|i:dronePingPong 0.2 % / 0 % · average|realistic|auto|preview|i:skimmerRipples 0.8 % / 0 % · average|realistic|auto|preview|i:needleThread 0.6 % / 0 % · expert|realistic|auto|preview|i:hawkFeather 1.0 % / 0 % · expert|realistic|auto|preview|i:sailStripes 0.2 % / 0 % · weak|realistic|auto|preview|i:dronePingPong 0.6 % / 0 % · weak|realistic|auto|preview|i:needleThread 2.8 % / 0 % · average|realistic|auto|preview|i:hawkFeather 0.7 % / 0 % · expert|realistic|auto|preview|i:kiteTail 0.3 % / 0 % · weak|realistic|auto|preview|i:pigeonExpress 0.4 % / 0 % · weak|realistic|auto|preview|i:skimmerRipples 1.1 % / 0 % · average|realistic|auto|preview|i:sailStripes 0.2 % / 0 % · expert|realistic|auto|preview|i:dronePingPong 0.8 % / 0 % · expert|realistic|auto|preview|i:needleThread 0.2 % / 0 % · weak|realistic|auto|preview|i:hawkFeather 0.4 % / 0 % · average|realistic|auto|preview|i:kiteTail 0.9 % / 0 % · expert|realistic|auto|preview|i:pigeonExpress 1.0 % / 0 % · expert|realistic|auto|preview|i:skimmerRipples 0.9 % / 0 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2464 / 18193 | 1.156 | 3.1 / 1.4 / 1.2 / 1.6 | 100 % (44) · 29 · 100 % · 56 % — 100 % (64) · 30 · 50 % · ∞ — 100 % (75) · 27 · 0 % · ∞ |
| weak|realistic|auto|preview|i:overTheLine | 3156 / 21190 | 1.171 | 3.1 / 1.4 / 1.3 / 1.6 | 100 % (44) · 29 · 100 % · 50 % — 100 % (64) · 33 · 67 % · 100 % — 100 % (76) · 33 · 17 % · ∞ |
| weak|realistic|auto|preview|i:kiteTail | 2347 / 17134 | 1.156 | 3.1 / 2.3 / 1.1 / 1.2 | 100 % (50) · 25 · 100 % · 66 % — 100 % (58) · 25 · 33 % · ∞ — 100 % (69) · 23 · 17 % · ∞ |
| weak|realistic|auto|preview|i:sailStripes | 3241 / 22875 | 1.157 | 3.1 / 1.4 / 1.6 / 2.1 | 100 % (44) · 29 · 100 % · 44 % — 100 % (66) · 35 · 67 % · 94 % — 67 % (94) · 25 · 50 % · ∞ |
| average|realistic|auto|preview|i:pigeonExpress | 1405 / 13653 | 1.109 | 2.6 / 1.4 / 1.3 / 1.4 | 100 % (43) · 32 · 100 % · 88 % — 83 % (58) · 32 · 0 % · ∞ — 67 % (68) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:dronePingPong | 2007 / 16674 | 1.136 | 2.6 / 1.4 / 1.5 / 1.9 | 100 % (43) · 32 · 100 % · 57 % — 100 % (62) · 34 · 33 % · ∞ — 83 % (70) · 23 · 0 % · ∞ |
| average|realistic|auto|preview|i:skimmerRipples | 5783 / 36731 | 1.186 | 2.6 / 1.7 / 2.5 / 2.6 | 100 % (45) · 32 · 100 % · 28 % — 100 % (79) · 38 · 100 % · 50 % — 100 % (117) · 24 · 67 % · 100 % |
| average|realistic|auto|preview|i:needleThread | 3010 / 21098 | 1.158 | 2.6 / 1.4 / 1.4 / 2.0 | 100 % (43) · 32 · 100 % · 42 % — 100 % (60) · 31 · 67 % · 92 % — 100 % (75) · 28 · 33 % · ∞ |
| expert|realistic|auto|preview|i:overTheLine | 2064 / 16414 | 1.140 | 2.4 / 0.9 / 1.3 / 1.4 | 100 % (35) · 24 · 100 % · 56 % — 100 % (50) · 30 · 50 % · ∞ — 67 % (62) · 29 · 0 % · ∞ |
| expert|realistic|auto|preview|i:hawkFeather | 787 / 10336 | 1.078 | 2.4 / 0.8 / 1.0 / 1.1 | 100 % (34) · 19 · 50 % · ∞ — 83 % (42) · 19 · 0 % · ∞ — 17 % (51) · 25 · 0 % · ∞ |
| expert|realistic|auto|preview|i:sailStripes | 2326 / 18782 | 1.136 | 2.4 / 0.9 / 1.7 / 2.0 | 100 % (35) · 24 · 100 % · 53 % — 100 % (57) · 30 · 33 % · ∞ — 67 % (72) · 26 · 25 % · ∞ |
| weak|realistic|auto|preview|i:dronePingPong | 2708 / 19059 | 1.162 | 3.1 / 1.4 / 1.2 / 2.0 | 100 % (44) · 29 · 100 % · 58 % — 100 % (63) · 30 · 67 % · 100 % — 100 % (77) · 26 · 17 % · ∞ |
| weak|realistic|auto|preview|i:needleThread | 5969 / 34071 | 1.212 | 3.1 / 1.4 / 1.2 / 2.4 | 100 % (44) · 29 · 100 % · 27 % — 100 % (67) · 30 · 100 % · 44 % — 100 % (79) · 44 · 100 % · 65 % |
| average|realistic|auto|preview|i:hawkFeather | 1934 / 15271 | 1.144 | 2.6 / 2.0 / 1.2 / 1.0 | 100 % (42) · 23 · 100 % · 71 % — 100 % (50) · 27 · 17 % · ∞ — 100 % (58) · 28 · 0 % · ∞ |
| expert|realistic|auto|preview | 1097 / 12241 | 1.095 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 82 % — 83 % (50) · 24 · 0 % · ∞ — 33 % (62) · 20 · 0 % · ∞ |
| expert|realistic|auto|preview|i:kiteTail | 1662 / 14779 | 1.121 | 2.4 / 1.4 / 0.8 / 1.2 | 100 % (38) · 20 · 100 % · 78 % — 100 % (51) · 27 · 17 % · ∞ — 83 % (56) · 29 · 0 % · ∞ |
| weak|realistic|auto|preview|i:pigeonExpress | 2629 / 18750 | 1.162 | 3.1 / 1.4 / 1.2 / 1.6 | 100 % (44) · 29 · 100 % · 56 % — 100 % (63) · 31 · 67 % · 96 % — 100 % (73) · 29 · 0 % · ∞ |
| weak|realistic|auto|preview|i:skimmerRipples | 6814 / 41166 | 1.198 | 3.1 / 2.0 / 2.6 / 2.5 | 100 % (44) · 29 · 100 % · 25 % — 100 % (80) · 39 · 100 % · 41 % — 100 % (124) · 24 · 100 % · 78 % |
| average|realistic|auto|preview|i:overTheLine | 1899 / 16272 | 1.130 | 2.6 / 1.4 / 1.5 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (62) · 28 · 0 % · ∞ — 100 % (76) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:sailStripes | 3183 / 22086 | 1.165 | 2.6 / 1.4 / 1.5 / 1.7 | 100 % (43) · 32 · 100 % · 48 % — 100 % (61) · 31 · 83 % · 85 % — 100 % (77) · 24 · 17 % · ∞ |
| expert|realistic|auto|preview|i:dronePingPong | 1727 / 14849 | 1.127 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 65 % — 83 % (53) · 30 · 0 % · ∞ — 83 % (59) · 22 · 0 % · ∞ |
| expert|realistic|auto|preview|i:needleThread | 1690 / 15372 | 1.118 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 62 % — 100 % (55) · 31 · 33 % · ∞ — 50 % (64) · 25 · 0 % · ∞ |
| weak|realistic|auto|preview|i:hawkFeather | 2327 / 17488 | 1.153 | 3.2 / 1.4 / 0.9 / 1.2 | 100 % (46) · 21 · 100 % · 55 % — 100 % (55) · 27 · 33 % · ∞ — 100 % (67) · 26 · 0 % · ∞ |
| average|realistic|auto|preview | 2065 / 16402 | 1.141 | 2.6 / 1.4 / 1.4 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (60) · 31 · 33 % · ∞ — 100 % (68) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:kiteTail | 2547 / 18082 | 1.161 | 2.6 / 1.5 / 1.0 / 1.1 | 100 % (46) · 23 · 100 % · 66 % — 100 % (54) · 31 · 33 % · ∞ — 100 % (62) · 22 · 17 % · ∞ |
| expert|realistic|auto|preview|i:pigeonExpress | 2145 / 16367 | 1.146 | 2.4 / 0.9 / 1.2 / 1.2 | 100 % (35) · 24 · 100 % · 58 % — 100 % (47) · 22 · 50 % · ∞ — 100 % (57) · 27 · 0 % · ∞ |
| expert|realistic|auto|preview|i:skimmerRipples | 4104 / 27717 | 1.171 | 2.4 / 1.5 / 1.6 / 2.5 | 100 % (35) · 24 · 100 % · 38 % — 100 % (62) · 31 · 100 % · 65 % — 100 % (90) · 32 · 17 % · ∞ |

## Kousky (05 §4.6, skupina realistic|auto|preview)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | lety (prům.) | slabý | průměrný | expert | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S | verdikt | poznámka |
|---|---:|---:|---:|---:|---|---|---:|---|---|---|---|
| Pigeon Express | 464 | 0.0 % | 0.0 % | 0.0 % | 0.0 % (–) | – (100 %) | – | 5.4 / 6.0; záměr min 2.9 | vzácný · vzácný · vzácný · – | CRITICAL | interval puštění holuba → klepnutí dalšího poryvu je v rozvrhu 08 nejméně ~5 s (Whistle ~2,2 s), okno 1,5 s je nedosažitelné |
| Kettle Song | 331 | 20.4 % | 29.3 % | 49.0 % | – (–) | 5 (0 %) | 2.40× | – | samozřejmý · NOT ASSESSED (bez páky) · zdravý · zdravý | CRITICAL | záměr: simulátor nemá páku na perfektnost (šum časování je vlastnost profilu) |
| Over the Line | 152 | 0.6 % | 3.9 % | – | 10.9 % (2.76×) | 8 (33 %) | – | – | zdravý · zdravý · zdravý · – | HEALTHY | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | 294 | 9.7 % | 3.4 % | 25.3 % | – (–) | 8 (50 %) | 2.60× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Steam Organ | 86 | 19.4 % | 25.6 % | 44.3 % | – (–) | 6 (0 %) | 2.28× | – | samozřejmý · NOT ASSESSED (bez páky) · zdravý · zdravý | CRITICAL | pára má v simulátoru 2 obláčky (08), 05 píše 3; Echo je pasivní bonus Atlasu (ne kapsa), záměr „Echo v kapse“ nemá páku |
| Wish | 82 | 1.0 % | 1.2 % | 0.0 % | – (–) | 4 (83 %) | 0.00× | – | hraniční · NOT ASSESSED (bez páky) · vzácný · zdravý | CRITICAL | záměr: simulátor nemá páku |
| Drone Ping-Pong | 61 | 0.0 % | 0.0 % | 0.0 % | 0.0 % (–) | – (100 %) | – | 6.0 / 8.3; záměr min 2.8 | vzácný · vzácný · vzácný · – | CRITICAL | dvojice dronů (úr. 3) má mezi vyhodnoceními nejméně ~3,1 s (effectMin 1 + followGap 0,2 + 1,88), okno 2 s je nedosažitelné |
| All the Verbs | 118 | 12.2 % | 11.9 % | 5.9 % | – (–) | 7 (0 %) | 0.48× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | 74 | 17.4 % | 32.4 % | 48.9 % | 40.3 % (1.24×) | 4 / 7 | 2.81× | – | samozřejmý · hraniční · zdravý · zdravý | HEALTHY | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | 9 | – | 88.9 % | – | 94.5 % (1.06×) | 2 / 2 | – | – | samozřejmý · náhoda · zdravý · – | HEALTHY |  |
| Skimmer: dvojitý odraz | 0 | – | – | – | 57.8 % (∞) | 2 / 5 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – | HEALTHY |  |
| Sail: zadní vítr | 0 | – | – | – | 100.0 % (∞) | 1 / 1 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – | HEALTHY |  |
| Needle: 2 drony | 0 | – | – | 0.0 % | 2.6 % (∞) | 38 / ∞ (záměr) | – | – | NOT ASSESSED · vzácný · pomalý · – | CONCERNS |  |

Brána (8 kousků mimo modely): zdravých 1 (se záměrem NOT ASSESSED 3) z 8, potřeba 6.
Systém: 1. kousek mimo modely (medián průměrného) 27 hodů (cíl ≤ 15); nalezeno z 13 průměrný 38 % (cíl 40 %–75 %), slabý 38 % (cíl ≥ 25 %); nejvyšší korelace kettleSong × steamOrgan φ 1.00 (86 letů), nad 0.8: kettleSong × steamOrgan. Kousky nic nedávají, délku nemění (test `progression-90`).

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Hody D1 (průměrný) | 28 | 34–46 | FAIL |
| Hody D2 (průměrný) | 25 | 36–48 | FAIL |
| Hody D3 (průměrný) | 19 | 37–49 | FAIL |
| Hody D4 (průměrný) | 13 | 36–48 | FAIL |
| Minuty D1 (průměrný) | 12.9 | 14–20 | FAIL |
| Minuty D2 (průměrný) | 13.7 | 18–24 | FAIL |
| Minuty D3 (průměrný) | 12.1 | 21–27 | FAIL |
| Minuty D4 (průměrný) | 8.4 | 23–29 | FAIL |
| Minuty celkem (průměrný) | 41.9 | 82–98 | FAIL |
| Let medián D1 [s] | 18.3 | ≤ 22 | OK |
| Let medián D2 [s] | 24.3 | ≤ 27 | OK |
| Let medián D3 [s] | 29.1 | ≤ 30 | OK |
| Let medián D4 [s] | 33.8 | ≤ 35 | OK |
| Let P90 [s] | 34.0 | ≤ 45 | OK |
| Sucho medián / P90 max kampaní | 2 / 5 (max 5, P90 5) | ≤ 4 / ≤ 8 | OK |
| Mezi místy medián / P90 | 6 / 12 | ≤ 11 / ≤ 17 | OK |
| Paper Crane: tah v kampani (lety) / přes nové místo (tahy, info) | 0.0 % / – | – | – |
| Strop E zasažen (lety) | 13 % | ≤ 20 % | OK |
| Strop β zasažen (lety) | 0 % | ≤ 25 % | OK |
| Podíl kluzáku | 62 % | 30 %–70 % | OK |
| První kapsa (hod) | 41 | 20–40 | FAIL |
| Koupené úrovně v cíli | 70 % | 60 %–85 % | OK |
| Hody celkem (průměrný) | 78 | 150–185 | FAIL |
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 15 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
| Sucho bez nákupu ani novinky P90 | 4 | ≤ 5 | OK |
| Poryv + holub mezi QTE D1 (bez variant) | 94 % | ≤ 95 % | OK |
| Poryv + holub mezi QTE D2 (bez variant) | 79 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D3 (bez variant) | 71 % | ≤ 60 % | FAIL |
| Poryv + holub mezi QTE D4 (bez variant) | 53 % | ≤ 60 % | OK |
| Hody mezi nákupy medián D1–D4 / P90 | 3 / 2 / 2 / 2 / 5 | ≤ 1 / 2 / 2 / 2 / ≤ 4 | FAIL |
| Mezi zastávkami (zastávky v simulátoru nejsou) | – | 05 §7.2 | NOT ASSESSED |
| Fronta novinek (není v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Varianty událostí: přínos a první setkání (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Délka letu: varianty, vír a lampiony (nejsou v simulátoru) | – | 05 §7.2 | NOT ASSESSED |
| Žádný let > 60 s (skutečný) | 77.0 | ≤ 60 | FAIL |
| Slabý: cíl do 250 hodů | 100 % (max 96) | 100 % | OK |
| Slabý / průměrný (minuty) | 1.09 | ≤ 1.35 | OK |
| Expert / průměrný (hody) | 0.81 | ≥ 0.69 | OK |
| Expert / slabý (hody) | 0.74 | 0.6–0.75 | OK |
| Mailbag: příjem / příjem bez bonusu v téže kampani (weak) | 1.16 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (weak, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (average) | 1.14 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (average, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
| Mailbag: příjem / příjem bez bonusu v téže kampani (expert) | 1.10 | ≤ 1.2 | OK |
| Mailbag III: návratnost do finále, podíl zbývajících hodů (expert, medián; vráceno) | ∞ (0 %) | ≤ 70 % | FAIL |
