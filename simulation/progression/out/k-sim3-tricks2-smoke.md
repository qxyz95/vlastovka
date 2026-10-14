# Simulátor progrese: k-sim3-tricks2-smoke

Spuštěno 2026-10-14T21:10:08.819Z, 6 kampaní na skupinu, seed 1. Parametry přepsané: `{"models":{"hawk":{"speed":17,"glide":3,"drag":0.12,"cruise":11,"ideal":34,"qte":1,"perfectK":1.6,"missK":0.06,"unlockPlace":4,"price":400},"kite":{"speed":12,"glide":4.6,"drag":0.12,"cruise":8,"ideal":40,"qte":1.1,"liftK":1.6,"pushK":0.6,"unlockPlace":6,"price":700},"skimmer":{"speed":21,"glide":2.8,"drag":0.12,"cruise":12,"ideal":10,"qte":0.9,"ground":{"below":6,"glide":1.7},"skip":1,"unlockPlace":8,"price":1000},"sail":{"speed":15,"glide":4.2,"drag":0.12,"cruise":10,"ideal":26,"qte":0.9,"windK":2.5,"unlockPlace":10,"price":1400},"needle":{"speed":24,"glide":2.6,"drag":0.08,"cruise":14,"ideal":12,"qte":0.9,"windK":0.4,"droneBurst":1.5,"unlockPlace":14,"price":2000}},"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true},"economy":{"mailbag":{"on":true}},"tricks":{"pigeonWindow":99,"droneWindow":99,"wishCombo":3,"needleDrones":1}}`.

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|realistic|auto|preview | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 17 / 12.6 | 85 / 45.5 | 17.8 · 26.5 · 30.5 · 33.4 | 35.3 / 44.9 | 92 % |
| weak|realistic|auto|preview|i:kettleSong | 100 % | 34 / 14.8 | 26 / 14.9 | 15 / 9.5 | 15 / 11.3 | 87 / 46.2 | 17.7 · 25.6 · 30.6 · 36.1 | 38.1 / 63.6 | 91 % |
| weak|realistic|auto|preview|i:overTheLine | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.2 | 22 / 15.3 | 98 / 52.9 | 17.8 · 26.5 · 30.9 · 34.6 | 37.1 / 54.4 | 92 % |
| weak|realistic|auto|preview|i:whistleStop | 100 % | 36 / 15.5 | 24 / 13.8 | 14 / 8.9 | 14 / 11.6 | 85 / 46.3 | 17.8 · 26.5 · 32.6 · 37.0 | 38.0 / 64.7 | 92 % |
| weak|realistic|auto|preview|i:hawkFeather | 100 % | 37 / 15.9 | 13 / 8.4 | 15 / 10.6 | 19 / 13.0 | 80 / 44.7 | 17.7 · 31.0 · 31.9 · 34.9 | 36.2 / 45.8 | 93 % |
| weak|realistic|auto|preview|i:kiteTail | 100 % | 36 / 15.5 | 19 / 11.5 | 13 / 11.5 | 19 / 19.1 | 82 / 52.9 | 17.8 · 30.7 · 44.2 · 45.2 | 52.5 / 65.1 | 92 % |
| weak|realistic|auto|preview|i:skimmerRipples | 100 % | 36 / 15.5 | 37 / 19.8 | 51 / 25.8 | 49 / 25.1 | 168 / 83.4 | 17.8 · 24.5 · 24.1 · 24.9 | 28.4 / 37.2 | 93 % |
| weak|realistic|auto|preview|i:sailStripes | 100 % | 36 / 15.5 | 24 / 13.8 | 36 / 21.6 | 14 / 9.0 | 110 / 59.4 | 17.8 · 26.5 · 27.9 · 30.3 | 32.8 / 75.1 | 92 % |
| weak|realistic|auto|preview|i:needleThread | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 62 / 30.9 | 126 / 63.9 | 17.8 · 26.5 · 30.5 · 22.4 | 30.2 / 42.7 | 92 % |
| weak|realistic|auto|preview|i:overTheLine|base | 100 % | 36 / 15.5 | 24 / 13.8 | 15 / 9.0 | 17 / 12.6 | 85 / 45.5 | 17.8 · 26.5 · 30.5 · 33.4 | 35.3 / 44.9 | 92 % |
| weak|realistic|auto|preview|i:whistleStop|base | 100 % | 36 / 15.5 | 24 / 13.8 | 14 / 8.7 | 15 / 11.4 | 82 / 45.2 | 17.8 · 26.5 · 32.2 · 35.0 | 37.2 / 69.3 | 92 % |
| average|realistic|auto|preview | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 13 / 8.4 | 78 / 41.9 | 18.3 · 24.3 · 29.1 · 33.8 | 34.0 / 77.0 | 97 % |
| average|realistic|auto|preview|i:kettleSong | 100 % | 28 / 12.9 | 25 / 13.7 | 17 / 10.5 | 15 / 12.2 | 85 / 46.5 | 18.3 · 25.8 · 29.8 · 34.1 | 35.0 / 61.4 | 97 % |
| average|realistic|auto|preview|i:overTheLine | 100 % | 28 / 12.9 | 25 / 13.7 | 17 / 11.0 | 11 / 8.5 | 84 / 46.8 | 18.3 · 24.3 · 29.6 · 35.5 | 35.2 / 44.7 | 97 % |
| average|realistic|auto|preview|i:whistleStop | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.4 | 13 / 9.1 | 86 / 46.6 | 18.3 · 24.3 · 31.4 · 31.1 | 33.9 / 66.7 | 97 % |
| average|realistic|auto|preview|i:hawkFeather | 100 % | 29 / 13.0 | 13 / 8.6 | 13 / 9.0 | 14 / 9.9 | 69 / 40.6 | 18.1 · 29.9 · 33.5 · 35.1 | 36.5 / 43.7 | 96 % |
| average|realistic|auto|preview|i:kiteTail | 100 % | 28 / 12.9 | 19 / 13.1 | 7 / 7.1 | 24 / 22.6 | 75 / 52.5 | 18.3 · 27.4 · 50.7 · 48.1 | 54.3 / 65.1 | 96 % |
| average|realistic|auto|preview|i:skimmerRipples | 100 % | 28 / 12.9 | 51 / 25.1 | 46 / 23.3 | 34 / 18.1 | 152 / 77.1 | 18.3 · 22.3 · 24.3 · 25.8 | 28.8 / 33.4 | 98 % |
| average|realistic|auto|preview|i:sailStripes | 100 % | 28 / 12.9 | 25 / 13.7 | 24 / 14.4 | 23 / 14.5 | 97 / 52.3 | 18.3 · 24.3 · 28.6 · 30.9 | 33.5 / 55.2 | 97 % |
| average|realistic|auto|preview|i:needleThread | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 29 / 15.8 | 96 / 49.4 | 18.3 · 24.3 · 29.1 · 23.8 | 29.9 / 77.0 | 96 % |
| average|realistic|auto|preview|i:overTheLine|base | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.1 | 13 / 8.4 | 78 / 41.9 | 18.3 · 24.3 · 29.1 · 33.8 | 34.0 / 77.0 | 97 % |
| average|realistic|auto|preview|i:whistleStop|base | 100 % | 28 / 12.9 | 25 / 13.7 | 19 / 12.2 | 8 / 6.3 | 73 / 42.0 | 18.3 · 24.3 · 30.6 · 35.7 | 34.8 / 76.5 | 97 % |
| expert|realistic|auto|preview | 100 % | 21 / 10.4 | 19 / 11.0 | 18 / 11.5 | 5 / 3.9 | 63 / 36.2 | 22.8 · 27.4 · 29.5 · 37.3 | 35.7 / 45.5 | 94 % |
| expert|realistic|auto|preview|i:kettleSong | 100 % | 21 / 10.4 | 19 / 11.0 | 18 / 11.5 | 5 / 3.9 | 63 / 36.2 | 22.8 · 27.4 · 29.5 · 37.3 | 35.7 / 45.5 | 94 % |
| expert|realistic|auto|preview|i:overTheLine | 100 % | 21 / 10.4 | 19 / 11.0 | 19 / 12.2 | 13 / 9.0 | 71 / 42.3 | 22.8 · 27.4 · 30.6 · 33.6 | 34.9 / 41.0 | 98 % |
| expert|realistic|auto|preview|i:whistleStop | 100 % | 21 / 10.4 | 19 / 11.0 | 10 / 7.2 | 15 / 11.1 | 68 / 41.6 | 22.8 · 27.4 · 32.9 · 35.3 | 36.9 / 45.8 | 98 % |
| expert|realistic|auto|preview|i:hawkFeather | 100 % | 23 / 11.4 | 9 / 6.0 | 8 / 5.7 | 10 / 7.3 | 49 / 30.0 | 22.1 · 31.6 · 35.7 · 38.1 | 39.8 / 47.3 | 93 % |
| expert|realistic|auto|preview|i:kiteTail | 100 % | 21 / 10.4 | 14 / 10.6 | 10 / 9.5 | 15 / 13.4 | 70 / 51.2 | 22.8 · 30.6 · 48.8 · 45.6 | 54.0 / 67.5 | 91 % |
| expert|realistic|auto|preview|i:skimmerRipples | 100 % | 21 / 10.4 | 37 / 19.7 | 31 / 16.1 | 29 / 17.3 | 113 / 60.5 | 22.8 · 25.8 · 22.2 · 23.0 | 32.1 / 41.2 | 88 % |
| expert|realistic|auto|preview|i:sailStripes | 100 % | 21 / 10.4 | 19 / 11.0 | 34 / 19.2 | 7 / 4.6 | 77 / 44.6 | 22.8 · 27.4 · 28.0 · 30.8 | 33.2 / 44.8 | 92 % |
| expert|realistic|auto|preview|i:needleThread | 100 % | 21 / 10.4 | 19 / 11.0 | 18 / 11.5 | 16 / 9.6 | 69 / 39.9 | 22.8 · 27.4 · 29.5 · 27.2 | 33.1 / 45.5 | 93 % |
| expert|realistic|auto|preview|i:overTheLine|base | 100 % | 21 / 10.4 | 19 / 11.0 | 16 / 10.3 | 19 / 12.2 | 72 / 41.8 | 22.8 · 27.4 · 29.4 · 31.8 | 34.1 / 42.9 | 99 % |
| expert|realistic|auto|preview|i:whistleStop|base | 100 % | 21 / 10.4 | 19 / 11.0 | 10 / 7.2 | 15 / 11.1 | 68 / 41.6 | 22.8 · 27.4 · 32.9 · 35.3 | 36.9 / 45.8 | 98 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|realistic|auto|preview | 2 / 6 / 6 | 7 / 13 | 42 | 72 % | 47 % | 11 % | 0 % | – |
| weak|realistic|auto|preview|i:kettleSong | 2 / 6 / 6 | 7 / 14 | 46 | 72 % | 53 % | 10 % | 0 % | – |
| weak|realistic|auto|preview|i:overTheLine | 2 / 5 / 5 | 7 / 14 | 42 | 78 % | 48 % | 14 % | 0 % | – |
| weak|realistic|auto|preview|i:whistleStop | 2 / 5 / 5 | 7 / 13 | 42 | 72 % | 48 % | 13 % | 0 % | – |
| weak|realistic|auto|preview|i:hawkFeather | 1 / 5 / 5 | 6 / 11 | 45 | 72 % | 28 % | 16 % | 0 % | – |
| weak|realistic|auto|preview|i:kiteTail | 2 / 6 / 6 | 7 / 11 | 55 | 65 % | 39 % | 17 % | 0 % | – |
| weak|realistic|auto|preview|i:skimmerRipples | 2 / 13 / 13 | 9 / 31 | 42 | 96 % | 24 % | 5 % | 0 % | – |
| weak|realistic|auto|preview|i:sailStripes | 2 / 8 / 8 | 8 / 16 | 42 | 74 % | 41 % | 12 % | 0 % | – |
| weak|realistic|auto|preview|i:needleThread | 2 / 9 / 9 | 8 / 16 | 42 | 91 % | 31 % | 7 % | 0 % | – |
| weak|realistic|auto|preview|i:overTheLine|base | 2 / 6 / 6 | 7 / 13 | 42 | 72 % | 47 % | 11 % | 0 % | – |
| weak|realistic|auto|preview|i:whistleStop|base | 2 / 5 / 5 | 7 / 14 | 42 | 67 % | 48 % | 13 % | 0 % | – |
| average|realistic|auto|preview | 2 / 5 / 5 | 6 / 12 | 41 | 70 % | 62 % | 13 % | 0 % | – |
| average|realistic|auto|preview|i:kettleSong | 2 / 7 / 7 | 6 / 12 | 41 | 72 % | 62 % | 14 % | 0 % | – |
| average|realistic|auto|preview|i:overTheLine | 2 / 6 / 6 | 6 / 12 | 41 | 74 % | 60 % | 15 % | 0 % | – |
| average|realistic|auto|preview|i:whistleStop | 1 / 5 / 5 | 6 / 12 | 41 | 72 % | 70 % | 17 % | 0 % | – |
| average|realistic|auto|preview|i:hawkFeather | 1 / 5 / 5 | 5 / 10 | 42 | 67 % | 22 % | 15 % | 0 % | – |
| average|realistic|auto|preview|i:kiteTail | 1 / 5 / 5 | 6 / 10 | 51 | 65 % | 32 % | 18 % | 0 % | – |
| average|realistic|auto|preview|i:skimmerRipples | 2 / 12 / 12 | 8 / 25 | 41 | 93 % | 22 % | 6 % | 0 % | – |
| average|realistic|auto|preview|i:sailStripes | 2 / 7 / 7 | 7 / 14 | 41 | 72 % | 42 % | 15 % | 0 % | – |
| average|realistic|auto|preview|i:needleThread | 2 / 8 / 8 | 6 / 12 | 41 | 76 % | 52 % | 11 % | 0 % | – |
| average|realistic|auto|preview|i:overTheLine|base | 2 / 5 / 5 | 6 / 12 | 41 | 70 % | 62 % | 13 % | 0 % | – |
| average|realistic|auto|preview|i:whistleStop|base | 1 / 5 / 5 | 6 / 12 | 41 | 67 % | 64 % | 14 % | 0 % | – |
| expert|realistic|auto|preview | 1 / 4 / 4 | 5 / 9 | 35 | 63 % | 79 % | 12 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:kettleSong | 1 / 4 / 4 | 5 / 9 | 35 | 63 % | 79 % | 12 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:overTheLine | 1 / 6 / 6 | 5 / 10 | 35 | 72 % | 84 % | 23 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:whistleStop | 1 / 4 / 4 | 5 / 9 | 35 | 72 % | 88 % | 24 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:hawkFeather | 1 / 4 / 4 | 4 / 7 | 34 | 57 % | 34 % | 8 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:kiteTail | 2 / 5 / 5 | 5 / 9 | 39 | 65 % | 40 % | 8 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:skimmerRipples | 2 / 9 / 9 | 6 / 23 | 38 | 83 % | 29 % | 6 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:sailStripes | 1 / 4 / 4 | 5 / 12 | 35 | 67 % | 57 % | 14 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:needleThread | 1 / 5 / 5 | 5 / 9 | 35 | 63 % | 67 % | 11 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:overTheLine|base | 1 / 6 / 6 | 5 / 10 | 35 | 70 % | 81 % | 25 % | 0 % | 0 % |
| expert|realistic|auto|preview|i:whistleStop|base | 1 / 4 / 4 | 5 / 9 | 35 | 72 % | 88 % | 24 % | 0 % | 0 % |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|realistic|auto|preview | 2265 / 3980 / 4360 / 7588 | 1975 / 3675 / 4010 / 6320 | workshop 1120, paper 5753, atlas 6040, pocket 300, model 567, mailbag 2200 | 2340 |
| weak|realistic|auto|preview|i:kettleSong | 2191 / 4477 / 4051 / 8134 | 1935 / 4230 / 3698 / 7842 | paper 6820, workshop 1120, atlas 6648, mailbag 2200, pocket 300, model 617 | 1254 |
| weak|realistic|auto|preview|i:overTheLine | 2265 / 3980 / 4233 / 10713 | 1975 / 3675 / 4088 / 9325 | workshop 1120, paper 5887, atlas 8707, pocket 300, model 850, mailbag 2200 | 1812 |
| weak|realistic|auto|preview|i:whistleStop | 2265 / 3980 / 4296 / 6442 | 1975 / 3675 / 3787 / 5810 | paper 5287, workshop 1120, atlas 5707, mailbag 2200, pocket 300, model 633 | 2008 |
| weak|realistic|auto|preview|i:hawkFeather | 2299 / 2375 / 4896 / 7917 | 1955 / 2305 / 4200 / 7357 | workshop 1120, paper 5287, atlas 6510, model 400, mailbag 2200, pocket 300 | 1507 |
| weak|realistic|auto|preview|i:kiteTail | 2265 / 2788 / 3650 / 8431 | 1975 / 2558 / 3212 / 8387 | paper 6353, workshop 1120, atlas 5058, model 1100, mailbag 2200, pocket 300 | 852 |
| weak|realistic|auto|preview|i:skimmerRipples | 2265 / 6229 / 15144 / 17529 | 1975 / 5807 / 14038 / 18250 | workshop 1120, paper 18687, atlas 12263, pocket 300, model 5500, mailbag 2200 | 924 |
| weak|realistic|auto|preview|i:sailStripes | 2265 / 3980 / 9490 / 7140 | 1975 / 3675 / 8603 / 6850 | paper 6953, workshop 1120, atlas 7347, mailbag 1900, pocket 300, model 3483 | 2024 |
| weak|realistic|auto|preview|i:needleThread | 2265 / 3980 / 4360 / 23466 | 1975 / 3675 / 4010 / 22633 | workshop 1120, paper 10553, atlas 12180, pocket 1140, model 5100, mailbag 2200 | 1264 |
| weak|realistic|auto|preview|i:overTheLine|base | 2265 / 3980 / 4360 / 7588 | 1975 / 3675 / 4010 / 6320 | paper 5753, workshop 1120, atlas 6040, mailbag 2200, pocket 300, model 567 | 2340 |
| weak|realistic|auto|preview|i:whistleStop|base | 2265 / 3980 / 4274 / 5911 | 1975 / 3675 / 3827 / 4947 | workshop 1120, paper 4353, atlas 5483, pocket 300, model 967, mailbag 2200 | 2024 |
| average|realistic|auto|preview | 1925 / 4368 / 4991 / 5119 | 1618 / 4160 / 4297 / 4458 | workshop 1120, paper 5287, atlas 5177, mailbag 2200, pocket 300, model 450 | 1756 |
| average|realistic|auto|preview|i:kettleSong | 1925 / 4868 / 5283 / 6009 | 1618 / 4252 / 5038 / 5445 | workshop 1120, paper 5287, atlas 6930, mailbag 2200, pocket 300, model 517 | 1608 |
| average|realistic|auto|preview|i:overTheLine | 1925 / 4368 / 5360 / 4619 | 1618 / 4160 / 4593 / 4592 | workshop 1120, paper 4820, atlas 6123, mailbag 2200, pocket 300, model 400 | 1068 |
| average|realistic|auto|preview|i:whistleStop | 1925 / 4368 / 5619 / 4853 | 1618 / 4160 / 4793 / 4335 | workshop 1120, paper 4820, atlas 5817, mailbag 1900, pocket 300, model 950 | 1450 |
| average|realistic|auto|preview|i:hawkFeather | 1982 / 2583 / 4335 / 6372 | 1642 / 2287 / 3967 / 5885 | workshop 1120, paper 4353, model 400, atlas 5407, pocket 300, mailbag 2200 | 1886 |
| average|realistic|auto|preview|i:kiteTail | 1925 / 3477 / 2321 / 10359 | 1618 / 3245 / 1853 / 9077 | workshop 1120, paper 4820, atlas 6253, model 1100, mailbag 2200, pocket 300 | 2668 |
| average|realistic|auto|preview|i:skimmerRipples | 1925 / 7813 / 12914 / 14079 | 1618 / 6848 / 11437 / 15167 | workshop 1120, paper 14353, atlas 11597, mailbag 2200, pocket 300, model 5500 | 1597 |
| average|realistic|auto|preview|i:sailStripes | 1925 / 4368 / 6550 / 9243 | 1618 / 4160 / 5218 / 9217 | workshop 1120, paper 6820, atlas 6790, mailbag 2200, pocket 300, model 2983 | 1982 |
| average|realistic|auto|preview|i:needleThread | 1925 / 4368 / 4991 / 9814 | 1618 / 4160 / 4297 / 9472 | workshop 1120, paper 6487, atlas 6790, mailbag 2200, pocket 300, model 2650 | 1351 |
| average|realistic|auto|preview|i:overTheLine|base | 1925 / 4368 / 4991 / 5119 | 1618 / 4160 / 4297 / 4458 | workshop 1120, paper 5287, atlas 5177, mailbag 2200, pocket 300, model 450 | 1756 |
| average|realistic|auto|preview|i:whistleStop|base | 1925 / 4368 / 4966 / 3706 | 1618 / 4160 / 4313 / 3098 | workshop 1120, paper 3887, atlas 5150, mailbag 2050, pocket 300, model 683 | 1814 |
| expert|realistic|auto|preview | 1600 / 3674 / 4704 / 2263 | 1328 / 3423 / 4167 / 2022 | paper 3237, workshop 1120, atlas 4033, pocket 300, mailbag 1467, model 783 | 1200 |
| expert|realistic|auto|preview|i:kettleSong | 1600 / 3674 / 4704 / 2263 | 1328 / 3423 / 4167 / 2022 | workshop 1120, paper 3237, atlas 4033, mailbag 1467, pocket 300, model 783 | 1200 |
| expert|realistic|auto|preview|i:overTheLine | 1600 / 3674 / 6069 / 5070 | 1328 / 3423 / 5547 / 4818 | paper 5287, workshop 1120, atlas 6177, pocket 300, mailbag 1900, model 333 | 1353 |
| expert|realistic|auto|preview|i:whistleStop | 1600 / 3674 / 3626 / 7182 | 1328 / 3423 / 3223 / 6775 | workshop 1120, paper 5753, atlas 5393, mailbag 2050, pocket 300, model 133 | 1306 |
| expert|realistic|auto|preview|i:hawkFeather | 1749 / 1761 / 2452 / 4373 | 1415 / 1687 / 2245 / 3855 | paper 3237, workshop 1120, model 400, atlas 2828, mailbag 1317, pocket 300 | 811 |
| expert|realistic|auto|preview|i:kiteTail | 1600 / 2795 / 3558 / 6827 | 1328 / 2578 / 3123 / 6298 | workshop 1062, paper 3887, atlas 4513, model 1567, mailbag 2050, pocket 250 | 1418 |
| expert|realistic|auto|preview|i:skimmerRipples | 1600 / 5557 / 9183 / 11377 | 1328 / 5187 / 8742 / 10330 | paper 7553, workshop 1120, atlas 9847, model 4567, pocket 300, mailbag 2200 | 1612 |
| expert|realistic|auto|preview|i:sailStripes | 1600 / 3674 / 8916 / 4591 | 1328 / 3423 / 7848 / 4813 | workshop 1120, paper 4953, atlas 5207, mailbag 1900, model 3933, pocket 300 | 1355 |
| expert|realistic|auto|preview|i:needleThread | 1600 / 3674 / 4704 / 5394 | 1328 / 3423 / 4167 / 4905 | paper 4303, workshop 1120, atlas 4567, pocket 300, mailbag 1750, model 1783 | 1425 |
| expert|realistic|auto|preview|i:overTheLine|base | 1600 / 3674 / 5162 / 6756 | 1328 / 3423 / 4552 / 6372 | workshop 1120, paper 5753, atlas 5585, mailbag 2050, pocket 300, model 867 | 1291 |
| expert|realistic|auto|preview|i:whistleStop|base | 1600 / 3674 / 3626 / 7182 | 1328 / 3423 / 3223 / 6775 | paper 5753, workshop 1120, atlas 5393, pocket 300, mailbag 2050, model 133 | 1306 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|realistic|auto|preview | dart: 18 % · 100 · 856 · 240; glider: 50 % · 127 · 1111 · 251; hawk: 32 % · 418 · 3300 · 620 · 100 % (67) |
| weak|realistic|auto|preview|i:kettleSong | dart: 16 % · 79 · 673 · 197; glider: 54 % · 137 · 1192 · 270; hawk: 23 % · 434 · 3395 · 640 · 83 % (67); kite: 7 % · 416 · 3220 · 490 · 17 % (57) |
| weak|realistic|auto|preview|i:overTheLine | dart: 17 % · 95 · 816 · 228; glider: 47 % · 130 · 1132 · 254; hawk: 35 % · 412 · 3218 · 599 · 100 % (70); kite: 2 % · 500 · 3753 · 610 · 17 % (93) |
| weak|realistic|auto|preview|i:whistleStop | dart: 17 % · 78 · 670 · 192; glider: 52 % · 131 · 1141 · 256; hawk: 27 % · 398 · 3163 · 579 · 100 % (67); kite: 4 % · 445 · 3414 · 489 · 33 % (84) |
| weak|realistic|auto|preview|i:hawkFeather | dart: 14 % · 59 · 493 · 152; glider: 25 % · 56 · 463 · 128; hawk: 61 % · 328 · 2702 · 504 · 100 % (32) |
| weak|realistic|auto|preview|i:kiteTail | dart: 15 % · 66 · 561 · 167; glider: 36 % · 83 · 724 · 176; kite: 49 % · 346 · 2784 · 395 · 100 % (43) |
| weak|realistic|auto|preview|i:skimmerRipples | dart: 8 % · 75 · 647 · 186; glider: 23 % · 113 · 986 · 225; hawk: 2 % · 215 · 1954 · 371 · 100 % (58); skimmer: 67 % · 315 · 2464 · 623 · 100 % (55) |
| weak|realistic|auto|preview|i:sailStripes | dart: 15 % · 93 · 800 · 225; glider: 41 % · 128 · 1123 · 252; sail: 29 % · 344 · 2698 · 581 · 100 % (66); hawk: 13 % · 357 · 2889 · 556 · 100 % (67); kite: 2 % · 440 · 3344 · 543 · 50 % (87) |
| weak|realistic|auto|preview|i:needleThread | dart: 12 % · 100 · 856 · 240; glider: 34 % · 127 · 1111 · 251; hawk: 12 % · 340 · 2855 · 523 · 100 % (67); needle: 42 % · 413 · 3112 · 845 · 100 % (77) |
| weak|realistic|auto|preview|i:overTheLine|base | dart: 18 % · 100 · 856 · 240; glider: 50 % · 127 · 1111 · 251; hawk: 32 % · 418 · 3300 · 620 · 100 % (67) |
| weak|realistic|auto|preview|i:whistleStop|base | dart: 17 % · 78 · 670 · 192; glider: 53 % · 132 · 1146 · 257; hawk: 26 % · 389 · 3087 · 574 · 100 % (67); kite: 4 % · 437 · 3357 · 480 · 33 % (84) |
| average|realistic|auto|preview | dart: 28 % · 127 · 1086 · 278; glider: 54 % · 177 · 1528 · 327; hawk: 16 % · 462 · 3574 · 689 · 83 % (64); kite: 2 % · 387 · 3080 · 450 · 17 % (60) |
| average|realistic|auto|preview|i:kettleSong | dart: 22 % · 104 · 895 · 235; glider: 62 % · 206 · 1730 · 365; hawk: 13 % · 456 · 3564 · 691 · 100 % (70); kite: 3 % · 454 · 3545 · 508 · 17 % (68) |
| average|realistic|auto|preview|i:overTheLine | dart: 27 % · 121 · 1042 · 264; glider: 52 % · 166 · 1462 · 308; hawk: 21 % · 427 · 3363 · 620 · 100 % (67) |
| average|realistic|auto|preview|i:whistleStop | dart: 28 % · 136 · 1139 · 297; glider: 64 % · 221 · 1851 · 389; hawk: 6 % · 398 · 3190 · 613 · 83 % (81); kite: 1 % · 402 · 3000 · 493 · 17 % (81) |
| average|realistic|auto|preview|i:hawkFeather | dart: 19 % · 60 · 505 · 144; glider: 16 % · 60 · 510 · 133; hawk: 64 % · 315 · 2616 · 483 · 100 % (24) |
| average|realistic|auto|preview|i:kiteTail | dart: 19 % · 68 · 581 · 160; glider: 30 % · 99 · 897 · 198; kite: 52 % · 374 · 3007 · 416 · 100 % (37) |
| average|realistic|auto|preview|i:skimmerRipples | dart: 12 % · 87 · 758 · 201; glider: 21 % · 126 · 1135 · 245; skimmer: 67 % · 318 · 2509 · 625 · 100 % (50) |
| average|realistic|auto|preview|i:sailStripes | dart: 23 % · 123 · 1060 · 271; glider: 41 % · 159 · 1399 · 299; sail: 24 % · 376 · 2921 · 611 · 100 % (62); hawk: 10 % · 428 · 3355 · 654 · 100 % (64); kite: 2 % · 462 · 3531 · 567 · 50 % (76) |
| average|realistic|auto|preview|i:needleThread | dart: 24 % · 127 · 1086 · 278; glider: 46 % · 177 · 1528 · 327; hawk: 7 % · 372 · 3032 · 587 · 83 % (64); needle: 21 % · 426 · 3245 · 834 · 67 % (72); kite: 2 % · 387 · 3080 · 450 · 50 % (80) |
| average|realistic|auto|preview|i:overTheLine|base | dart: 28 % · 127 · 1086 · 278; glider: 54 % · 177 · 1528 · 327; kite: 2 % · 387 · 3080 · 450 · 17 % (60); hawk: 16 % · 462 · 3574 · 689 · 83 % (64) |
| average|realistic|auto|preview|i:whistleStop|base | dart: 27 % · 111 · 959 · 248; glider: 59 % · 186 · 1607 · 338; hawk: 12 % · 433 · 3409 · 640 · 100 % (63); kite: 2 % · 474 · 3663 · 499 · 17 % (64) |
| expert|realistic|auto|preview | dart: 14 % · 131 · 1153 · 280; glider: 73 % · 182 · 1581 · 313; hawk: 13 % · 410 · 3492 · 590 · 83 % (53); needle: 0 % · 647 · 4888 · 1021 · 17 % (64) |
| expert|realistic|auto|preview|i:kettleSong | dart: 14 % · 131 · 1153 · 280; glider: 73 % · 182 · 1581 · 313; needle: 0 % · 647 · 4888 · 1021 · 17 % (64); hawk: 13 % · 410 · 3492 · 590 · 83 % (53) |
| expert|realistic|auto|preview|i:overTheLine | dart: 12 % · 142 · 1255 · 299; glider: 77 % · 223 · 1867 · 373; hawk: 11 % · 431 · 3479 · 640 · 83 % (68) |
| expert|realistic|auto|preview|i:whistleStop | dart: 11 % · 118 · 1055 · 255; glider: 84 % · 256 · 2119 · 416; hawk: 5 % · 398 · 3419 · 606 · 33 % (70) |
| expert|realistic|auto|preview|i:hawkFeather | dart: 9 % · 67 · 577 · 154; glider: 30 % · 68 · 587 · 134; hawk: 61 % · 299 · 2634 · 436 · 100 % (18) |
| expert|realistic|auto|preview|i:kiteTail | dart: 7 % · 67 · 577 · 154; glider: 36 % · 96 · 862 · 177; kite: 57 % · 336 · 2812 · 384 · 100 % (28) |
| expert|realistic|auto|preview|i:skimmerRipples | dart: 6 % · 107 · 969 · 235; glider: 29 % · 128 · 1154 · 229; skimmer: 64 % · 323 · 2565 · 600 · 100 % (39); hawk: 1 % · 255 · 2304 · 400 · 100 % (54) |
| expert|realistic|auto|preview|i:sailStripes | dart: 10 % · 135 · 1192 · 286; glider: 49 % · 162 · 1437 · 284; sail: 31 % · 314 · 2511 · 532 · 100 % (50); hawk: 9 % · 408 · 3294 · 594 · 100 % (57); kite: 1 % · 356 · 2720 · 537 · 67 % (70) |
| expert|realistic|auto|preview|i:needleThread | dart: 12 % · 131 · 1153 · 280; glider: 64 % · 175 · 1537 · 303; hawk: 9 % · 380 · 3250 · 556 · 83 % (53); needle: 14 % · 460 · 3638 · 805 · 67 % (58) |
| expert|realistic|auto|preview|i:overTheLine|base | dart: 13 % · 162 · 1386 · 339; glider: 79 % · 241 · 2006 · 405; hawk: 7 % · 446 · 3592 · 683 · 50 % (66); needle: 2 % · 503 · 3777 · 906 · 33 % (74) |
| expert|realistic|auto|preview|i:whistleStop|base | dart: 11 % · 118 · 1055 · 255; glider: 84 % · 256 · 2119 · 416; hawk: 5 % · 398 · 3419 · 606 · 33 % (70) |

Paper Crane v kampani (tah v letech / přes nové místo): weak|realistic|auto|preview 1.2 % / 17 % · weak|realistic|auto|preview|i:kettleSong 0.4 % / 50 % · weak|realistic|auto|preview|i:overTheLine 0.7 % / 25 % · weak|realistic|auto|preview|i:whistleStop 0.4 % / 0 % · weak|realistic|auto|preview|i:hawkFeather 0.4 % / 0 % · weak|realistic|auto|preview|i:kiteTail 1.0 % / 20 % · weak|realistic|auto|preview|i:skimmerRipples 1.1 % / 0 % · weak|realistic|auto|preview|i:sailStripes 0.3 % / 0 % · weak|realistic|auto|preview|i:needleThread 2.8 % / 0 % · weak|realistic|auto|preview|i:overTheLine|base 1.2 % / 17 % · weak|realistic|auto|preview|i:whistleStop|base 0.8 % / 0 % · average|realistic|auto|preview|i:kettleSong 0.2 % / 0 % · average|realistic|auto|preview|i:whistleStop 0.2 % / 0 % · average|realistic|auto|preview|i:hawkFeather 0.7 % / 0 % · average|realistic|auto|preview|i:kiteTail 0.9 % / 0 % · average|realistic|auto|preview|i:skimmerRipples 0.8 % / 0 % · average|realistic|auto|preview|i:sailStripes 0.2 % / 0 % · average|realistic|auto|preview|i:needleThread 0.6 % / 0 % · expert|realistic|auto|preview|i:whistleStop 0.3 % / 0 % · expert|realistic|auto|preview|i:hawkFeather 1.0 % / 0 % · expert|realistic|auto|preview|i:kiteTail 0.3 % / 0 % · expert|realistic|auto|preview|i:skimmerRipples 0.9 % / 0 % · expert|realistic|auto|preview|i:sailStripes 0.2 % / 0 % · expert|realistic|auto|preview|i:needleThread 0.2 % / 0 % · expert|realistic|auto|preview|i:overTheLine|base 0.5 % / 0 % · expert|realistic|auto|preview|i:whistleStop|base 0.3 % / 0 %

## Mailbag (01 §2.11)

| Skupina | ◈ z Mailbagu / příjem | příjem / bez bonusu | hody na další koupi D1–D4 (med) | úr. I · II · III: koupilo (med. hod) · odhad návratnosti [hody] · vráceno do finále · podíl zbývajících hodů |
|---|---|---:|---|---|
| weak|realistic|auto|preview | 2464 / 18193 | 1.156 | 3.1 / 1.4 / 1.2 / 1.6 | 100 % (44) · 29 · 100 % · 56 % — 100 % (64) · 30 · 50 % · ∞ — 100 % (75) · 27 · 0 % · ∞ |
| weak|realistic|auto|preview|i:kettleSong | 2683 / 18853 | 1.165 | 3.6 / 1.2 / 1.4 / 1.7 | 100 % (45) · 32 · 100 % · 58 % — 100 % (64) · 33 · 50 % · ∞ — 100 % (76) · 24 · 17 % · ∞ |
| weak|realistic|auto|preview|i:overTheLine | 3156 / 21190 | 1.171 | 3.1 / 1.4 / 1.3 / 1.6 | 100 % (44) · 29 · 100 % · 50 % — 100 % (64) · 33 · 67 % · 100 % — 100 % (76) · 33 · 17 % · ∞ |
| weak|realistic|auto|preview|i:whistleStop | 2236 / 16983 | 1.151 | 3.1 / 1.4 / 1.2 / 1.3 | 100 % (44) · 29 · 100 % · 57 % — 100 % (62) · 31 · 50 % · ∞ — 100 % (74) · 24 · 0 % · ∞ |
| weak|realistic|auto|preview|i:hawkFeather | 2327 / 17488 | 1.153 | 3.2 / 1.4 / 0.9 / 1.2 | 100 % (46) · 21 · 100 % · 55 % — 100 % (55) · 27 · 33 % · ∞ — 100 % (67) · 26 · 0 % · ∞ |
| weak|realistic|auto|preview|i:kiteTail | 2347 / 17134 | 1.156 | 3.1 / 2.3 / 1.1 / 1.2 | 100 % (50) · 25 · 100 % · 66 % — 100 % (58) · 25 · 33 % · ∞ — 100 % (69) · 23 · 17 % · ∞ |
| weak|realistic|auto|preview|i:skimmerRipples | 6814 / 41166 | 1.198 | 3.1 / 2.0 / 2.6 / 2.5 | 100 % (44) · 29 · 100 % · 25 % — 100 % (80) · 39 · 100 % · 41 % — 100 % (124) · 24 · 100 % · 78 % |
| weak|realistic|auto|preview|i:sailStripes | 3241 / 22875 | 1.157 | 3.1 / 1.4 / 1.6 / 2.1 | 100 % (44) · 29 · 100 % · 44 % — 100 % (66) · 35 · 67 % · 94 % — 67 % (94) · 25 · 50 % · ∞ |
| weak|realistic|auto|preview|i:needleThread | 5969 / 34071 | 1.212 | 3.1 / 1.4 / 1.2 / 2.4 | 100 % (44) · 29 · 100 % · 27 % — 100 % (67) · 30 · 100 % · 44 % — 100 % (79) · 44 · 100 % · 65 % |
| weak|realistic|auto|preview|i:overTheLine|base | 2464 / 18193 | 1.156 | 3.1 / 1.4 / 1.2 / 1.6 | 100 % (44) · 29 · 100 % · 56 % — 100 % (64) · 30 · 50 % · ∞ — 100 % (75) · 27 · 0 % · ∞ |
| weak|realistic|auto|preview|i:whistleStop|base | 2145 / 16430 | 1.148 | 3.1 / 1.4 / 1.2 / 1.3 | 100 % (44) · 29 · 100 % · 60 % — 100 % (62) · 31 · 50 % · ∞ — 100 % (74) · 27 · 0 % · ∞ |
| average|realistic|auto|preview | 2065 / 16402 | 1.141 | 2.6 / 1.4 / 1.4 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (60) · 31 · 33 % · ∞ — 100 % (68) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:kettleSong | 2411 / 18084 | 1.153 | 2.6 / 1.2 / 1.4 / 1.6 | 100 % (40) · 32 · 100 % · 57 % — 100 % (60) · 30 · 67 % · 100 % — 100 % (72) · 22 · 0 % · ∞ |
| average|realistic|auto|preview|i:overTheLine | 1899 / 16272 | 1.130 | 2.6 / 1.4 / 1.5 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (62) · 28 · 0 % · ∞ — 100 % (76) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:whistleStop | 2098 / 16765 | 1.137 | 2.6 / 1.4 / 1.2 / 1.7 | 100 % (43) · 32 · 100 % · 54 % — 100 % (58) · 25 · 67 % · 100 % — 67 % (70) · 23 · 0 % · ∞ |
| average|realistic|auto|preview|i:hawkFeather | 1934 / 15271 | 1.144 | 2.6 / 2.0 / 1.2 / 1.0 | 100 % (42) · 23 · 100 % · 71 % — 100 % (50) · 27 · 17 % · ∞ — 100 % (58) · 28 · 0 % · ∞ |
| average|realistic|auto|preview|i:kiteTail | 2547 / 18082 | 1.161 | 2.6 / 1.5 / 1.0 / 1.1 | 100 % (46) · 23 · 100 % · 66 % — 100 % (54) · 31 · 33 % · ∞ — 100 % (62) · 22 · 17 % · ∞ |
| average|realistic|auto|preview|i:skimmerRipples | 5783 / 36731 | 1.186 | 2.6 / 1.7 / 2.5 / 2.6 | 100 % (45) · 32 · 100 % · 28 % — 100 % (79) · 38 · 100 % · 50 % — 100 % (117) · 24 · 67 % · 100 % |
| average|realistic|auto|preview|i:sailStripes | 3183 / 22086 | 1.165 | 2.6 / 1.4 / 1.5 / 1.7 | 100 % (43) · 32 · 100 % · 48 % — 100 % (61) · 31 · 83 % · 85 % — 100 % (77) · 24 · 17 % · ∞ |
| average|realistic|auto|preview|i:needleThread | 3010 / 21098 | 1.158 | 2.6 / 1.4 / 1.4 / 2.0 | 100 % (43) · 32 · 100 % · 42 % — 100 % (60) · 31 · 67 % · 92 % — 100 % (75) · 28 · 33 % · ∞ |
| average|realistic|auto|preview|i:overTheLine|base | 2065 / 16402 | 1.141 | 2.6 / 1.4 / 1.4 / 1.8 | 100 % (43) · 32 · 100 % · 69 % — 100 % (60) · 31 · 33 % · ∞ — 100 % (68) · 24 · 0 % · ∞ |
| average|realistic|auto|preview|i:whistleStop|base | 1701 / 14964 | 1.125 | 2.6 / 1.4 / 1.2 / 1.6 | 100 % (43) · 32 · 100 % · 67 % — 100 % (58) · 25 · 17 % · ∞ — 83 % (69) · 24 · 0 % · ∞ |
| expert|realistic|auto|preview | 1097 / 12241 | 1.095 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 82 % — 83 % (50) · 24 · 0 % · ∞ — 33 % (62) · 20 · 0 % · ∞ |
| expert|realistic|auto|preview|i:kettleSong | 1097 / 12241 | 1.095 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 82 % — 83 % (50) · 24 · 0 % · ∞ — 33 % (62) · 20 · 0 % · ∞ |
| expert|realistic|auto|preview|i:overTheLine | 2064 / 16414 | 1.140 | 2.4 / 0.9 / 1.3 / 1.4 | 100 % (35) · 24 · 100 % · 56 % — 100 % (50) · 30 · 50 % · ∞ — 67 % (62) · 29 · 0 % · ∞ |
| expert|realistic|auto|preview|i:whistleStop | 2076 / 16083 | 1.143 | 2.4 / 0.9 / 1.4 / 1.2 | 100 % (35) · 24 · 100 % · 56 % — 100 % (49) · 24 · 17 % · ∞ — 83 % (57) · 24 · 0 % · ∞ |
| expert|realistic|auto|preview|i:hawkFeather | 787 / 10336 | 1.078 | 2.4 / 0.8 / 1.0 / 1.1 | 100 % (34) · 19 · 50 % · ∞ — 83 % (42) · 19 · 0 % · ∞ — 17 % (51) · 25 · 0 % · ∞ |
| expert|realistic|auto|preview|i:kiteTail | 1662 / 14779 | 1.121 | 2.4 / 1.4 / 0.8 / 1.2 | 100 % (38) · 20 · 100 % · 78 % — 100 % (51) · 27 · 17 % · ∞ — 83 % (56) · 29 · 0 % · ∞ |
| expert|realistic|auto|preview|i:skimmerRipples | 4104 / 27717 | 1.171 | 2.4 / 1.5 / 1.6 / 2.5 | 100 % (35) · 24 · 100 % · 38 % — 100 % (62) · 31 · 100 % · 65 % — 100 % (90) · 32 · 17 % · ∞ |
| expert|realistic|auto|preview|i:sailStripes | 2326 / 18782 | 1.136 | 2.4 / 0.9 / 1.7 / 2.0 | 100 % (35) · 24 · 100 % · 53 % — 100 % (57) · 30 · 33 % · ∞ — 67 % (72) · 26 · 25 % · ∞ |
| expert|realistic|auto|preview|i:needleThread | 1690 / 15372 | 1.118 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 100 % · 62 % — 100 % (55) · 31 · 33 % · ∞ — 50 % (64) · 25 · 0 % · ∞ |
| expert|realistic|auto|preview|i:overTheLine|base | 2318 / 17192 | 1.149 | 2.4 / 0.9 / 1.3 / 1.7 | 100 % (35) · 24 · 83 % · 53 % — 100 % (49) · 29 · 50 % · ∞ — 83 % (58) · 23 · 0 % · ∞ |
| expert|realistic|auto|preview|i:whistleStop|base | 2076 / 16083 | 1.143 | 2.4 / 0.9 / 1.4 / 1.2 | 100 % (35) · 24 · 100 % · 56 % — 100 % (49) · 24 · 17 % · ∞ — 83 % (57) · 24 · 0 % · ∞ |

## Kousky (05 §4.6, skupina realistic|auto|preview)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |
|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|
| Pigeon Express | dovednost | 464 · 100 % | 49 % | 11.6 % | 18.3 % | 41.1 % | 21 % / 18 % / 21 % / 8 % | – (–) | 6 (0 %) | 3.55× | 5.4 / 6.0 | zdravý · NOT ASSESSED (neběželo) · zdravý · zdravý · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv |
| Kettle Song | volba | 72 · 15 % | – | 14.1 % | 18.1 % | – | – / 18 % / – / – | 18.1 % (1.00×) | 5 (0 %) | – | – | zdravý · náhoda · zdravý · – · zdravý · náhoda | CONCERNS / CONCERNS | výskyt bez záměru ze skupiny s kapsou ze záměru; pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy |
| Over the Line | volba | 152 · 33 % | – | 0.6 % | 3.9 % | 1.2 % | – / – / 7 % / 0 % | 10.9 % (2.76×) | 8 (33 %) | 2.04× | – | zdravý · zdravý · zdravý · zdravý · zdravý · zdravý | HEALTHY / HEALTHY | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | dovednost | 294 · 63 % | – | 9.7 % | 3.4 % | 25.3 % | – / 2 % / 1 % / 10 % | – (–) | 8 (50 %) | 2.60× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Whistle Stop | volba | 134 · 30 % | 100 % | 29.6 % | 50.0 % | 94.5 % | – / – / 53 % / 45 % | 56.4 % (1.13×) | 2 (0 %) | 3.19× | 0.0 / 0.0; záměr min 0.0 | samozřejmý · náhoda · hraniční · zdravý · samozřejmý · náhoda | CRITICAL / CRITICAL | výskyt bez záměru ze skupiny s kapsou ze záměru; přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí |
| Wish | dovednost | 82 · 18 % | 7 % | 2.9 % | 4.9 % | 4.1 % | – / – / – / 7 % | – (–) | 12 (67 %) | 1.43× | – | zdravý · NOT ASSESSED (bez páky) · vzácný · zdravý · zdravý · zdravý | CRITICAL / CRITICAL | kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou |
| Drone Ping-Pong | dovednost | 0 · 0 % | – | 11.5 % | – | – | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED | NOT ASSESSED / NOT ASSESSED | dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů |
| All the Verbs | pestrost | 118 · 25 % | – | 12.2 % | 11.9 % | 5.9 % | – / – / 11 % / 13 % | – (–) | 7 (0 %) | 0.48× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | volba | 74 · 16 % | – | 17.4 % | 32.4 % | 48.9 % | – / – / – / 33 % | 40.3 % (1.24×) | 4 / 7 | 2.81× | – | samozřejmý · hraniční · zdravý · zdravý · samozřejmý · 01 §6.1 b. 15 | HEALTHY / HEALTHY | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | volba | 9 · 2 % | – | – | 88.9 % | – | – / – / – / – | 94.5 % (1.06×) | 2 / 2 | – | – | samozřejmý · náhoda · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Skimmer: dvojitý odraz | volba | 0 · 0 % | – | – | – | – | – / – / – / – | 57.8 % (∞) | 2 / 5 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Sail: zadní vítr | volba | 0 · 0 % | – | – | – | – | – / – / – / – | 100.0 % (∞) | 1 / 1 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |
| Needle: drony (needleDrones) | volba | 0 · 0 % | – | – | – | 0.0 % | – / – / – / – | 27.8 % (∞) | 5 / 11 (záměr) | – | – | NOT ASSESSED · zdravý · zdravý · – · – · 01 §6.1 b. 15 | HEALTHY / HEALTHY |  |

Brána (8 kousků mimo modely, platí podle tříd): záměr u všech zdravých 1 (se záměrem NOT ASSESSED 4), podle tříd (dovednost: expert / slabý ≥ 1.3×) 4, z 8, potřeba 6. Čtvrť se počítá od 30 letů s přísadami.
**Postavit:** jen zdravé kousky + kousky modelů: Pigeon Express, Over the Line, Tape Save, All the Verbs, Hawk: 3 perfekty za sebou, Kite: perfekt termiky nebo 40 m, Skimmer: dvojitý odraz, Sail: zadní vítr, Needle: drony (needleDrones).
Korelace φ nad 0.5: žádná.
Systém: 1. kousek mimo modely (medián průměrného) 6 hodů (cíl ≤ 15); nalezeno z 13 průměrný 31 % (cíl 40 %–75 %), slabý 38 % (cíl ≥ 25 %); nejvyšší korelace pigeonExpress × hawkFeather φ 0.37 (74 letů), nad 0.8: žádná. Kousky nic nedávají, délku nemění (test `progression-90`).

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
| Sucho bez novinky A medián / P90 / P90 max kampaní (bez zastávek a variant) | 4 / 9 / 13 | ≤ 3 / ≤ 6 / ≤ 12 | FAIL |
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
