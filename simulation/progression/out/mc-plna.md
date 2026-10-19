# Simulátor progrese: mc-plna

Spuštěno 2026-10-15T10:59:56.925Z, 300 kampaní na skupinu, seed 1. Parametry přepsané: `{"targets":{"throwsPerDistrict":[[34,46],[36,48],[37,49],[36,48]],"minutesPerDistrict":[[14,20],[18,24],[21,27],[23,29]],"totalMinutes":[82,98],"totalThrows":[150,185],"weakFinishWithin":250,"weakVsAverage":1.35,"weakVsAverageStat":"minutes","expertVsAverage":0.69,"droughtA":{"median":3,"p90":6,"maxP90":12},"droughtP90":5,"placeGapMedian":11,"placeGapP90":17,"repeat":[0.95,0.6,0.6,0.6],"buyGap":{"median":[1,2,2,2],"p90":4},"model":"preview","notAssessed":true}}`.

## Křivka (08 §2.4)

| Výbava | π | weak dolet | average dolet | good dolet | expert dolet | let average sim / skut. [s] | prům. rychlost [m/s] |
|---|---:|---:|---:|---:|---:|---|---:|
| 1. hod (nic) | 1.00 | 182 | 224 | 258 | 286 | 14.9 / 13.9 | 15 |
| po Power 1 | 1.00 | 219 | 272 | 312 | 344 | 17.6 / 16.4 | 16 |
| po Paper 1 | 1.62 | 295 | 362 | 419 | 464 | 14.9 / 13.9 | 24 |
| střed D1 | 1.62 | 478 | 565 | 630 | 682 | 20.6 / 18.9 | 28 |
| konec D1 | 2.86 | 1263 | 1370 | 1434 | 1492 | 24.2 / 22.2 | 57 |
| konec D2 | 4.21 | 2048 | 2215 | 2323 | 2414 | 26.8 / 24.4 | 85 |
| konec D3 | 6.31 | 3474 | 3806 | 4040 | 4212 | 26.6 / 24.4 | 145 |
| střed D4 | 7.16 | 4444 | 4946 | 5333 | 5622 | 29.6 / 27.8 | 168 |
| plná výbava | 8.86 | 5725 | 6458 | 6983 | 7385 | 29.2 / 27.0 | 221 |
| plná bez Atlasu | 8.86 | 3818 | 4146 | 4336 | 4493 | 25.5 / 23.2 | 165 |
| plná, kluzák | 8.86 | 6464 | 7126 | 7654 | 8090 | 34.0 / 31.3 | 205 |

## Kampaně (08 §2.6)

| Skupina | hotovo | D1 hody/min | D2 | D3 | D4 | celkem hody / min | let medián D1–D4 [s] | P90 / max | QTE zásah |
|---|---:|---|---|---|---|---|---|---|---:|
| weak|balanced|auto|better | 100 % | 34 / 13.8 | 22 / 12.3 | 23 / 13.3 | 22 / 13.0 | 102 / 53.3 | 16.8 · 25.2 · 26.5 · 27.2 | 30.8 / 45.7 | 90 % |
| weak|balanced|dive+sharp|better | 100 % | 34 / 13.8 | 26 / 13.2 | 32 / 17.6 | 24 / 13.5 | 116 / 58.9 | 16.8 · 23.0 · 24.4 · 25.5 | 29.6 / 42.4 | 91 % |
| weak|balanced|calm+cushion|better | 100 % | 34 / 13.8 | 25 / 13.1 | 26 / 14.3 | 22 / 12.5 | 109 / 55.0 | 16.8 · 23.6 · 25.0 · 25.6 | 28.7 / 41.4 | 90 % |
| weak|paper-first|auto|better | 100 % | 58 / 21.7 | 25 / 12.6 | 34 / 18.1 | 20 / 10.8 | 140 / 63.6 | 14.0 · 21.4 · 23.5 · 24.5 | 26.9 / 36.7 | 88 % |
| weak|paper-first|dive+sharp|better | 100 % | 58 / 21.7 | 27 / 13.4 | 38 / 19.4 | 21 / 11.3 | 144 / 65.8 | 14.0 · 20.8 · 22.8 · 24.0 | 26.5 / 38.1 | 88 % |
| weak|paper-first|calm+cushion|better | 100 % | 58 / 21.7 | 25 / 12.6 | 37 / 19.3 | 21 / 11.2 | 143 / 65.4 | 14.0 · 21.3 · 23.6 · 24.5 | 26.9 / 37.0 | 88 % |
| average|balanced|auto|better | 100 % | 28 / 12.0 | 21 / 11.3 | 19 / 11.6 | 17 / 10.5 | 86 / 45.8 | 17.5 · 24.0 · 27.6 · 28.6 | 31.5 / 45.4 | 97 % |
| average|balanced|dive+sharp|better | 100 % | 28 / 12.0 | 22 / 12.0 | 25 / 14.5 | 19 / 11.1 | 95 / 50.2 | 17.5 · 23.6 · 26.0 · 27.8 | 30.9 / 44.5 | 97 % |
| average|balanced|calm+cushion|better | 100 % | 28 / 12.0 | 21 / 11.3 | 22 / 12.8 | 18 / 10.5 | 90 / 46.7 | 17.5 · 24.0 · 25.5 · 26.6 | 29.2 / 40.0 | 97 % |
| average|paper-first|auto|better | 100 % | 52 / 20.2 | 24 / 12.1 | 34 / 18.4 | 19 / 10.7 | 130 / 61.8 | 15.5 · 21.7 · 24.3 · 25.2 | 27.3 / 36.9 | 96 % |
| average|paper-first|dive+sharp|better | 100 % | 52 / 20.2 | 26 / 13.3 | 36 / 19.0 | 20 / 10.7 | 134 / 63.4 | 15.5 · 21.4 · 23.1 · 24.1 | 26.6 / 37.5 | 96 % |
| average|paper-first|calm+cushion|better | 100 % | 52 / 20.2 | 24 / 12.1 | 35 / 18.5 | 20 / 11.0 | 130 / 62.1 | 15.5 · 21.7 · 24.2 · 25.1 | 27.3 / 37.6 | 96 % |
| good|balanced|auto|better | 100 % | 24 / 10.8 | 20 / 11.1 | 21 / 12.8 | 14 / 9.1 | 80 / 43.7 | 18.5 · 24.2 · 27.9 · 29.6 | 32.1 / 45.2 | 99 % |
| good|balanced|dive+sharp|better | 100 % | 24 / 10.8 | 20 / 11.1 | 21 / 12.8 | 14 / 9.1 | 80 / 43.7 | 18.5 · 24.2 · 27.9 · 29.6 | 32.1 / 45.2 | 99 % |
| good|balanced|calm+cushion|better | 100 % | 24 / 10.8 | 20 / 10.8 | 20 / 11.6 | 17 / 9.8 | 80 / 42.8 | 18.5 · 24.5 · 25.9 · 27.1 | 29.6 / 40.6 | 99 % |
| good|paper-first|auto|better | 100 % | 46 / 18.7 | 24 / 12.4 | 36 / 19.1 | 19 / 10.2 | 125 / 60.8 | 16.6 · 22.4 · 23.6 · 24.6 | 27.0 / 38.4 | 99 % |
| good|paper-first|dive+sharp|better | 100 % | 46 / 18.7 | 24 / 12.4 | 36 / 19.1 | 19 / 10.2 | 125 / 60.8 | 16.6 · 22.4 · 23.6 · 24.6 | 27.0 / 38.4 | 99 % |
| good|paper-first|calm+cushion|better | 100 % | 46 / 18.7 | 23 / 11.6 | 35 / 18.6 | 18 / 10.2 | 121 / 58.7 | 16.6 · 22.5 · 24.6 · 25.6 | 27.6 / 37.4 | 99 % |
| expert|balanced|auto|better | 100 % | 21 / 9.8 | 17 / 9.3 | 19 / 11.8 | 12 / 8.1 | 71 / 39.9 | 19.1 · 25.1 · 28.9 · 30.8 | 34.2 / 48.0 | 100 % |
| expert|balanced|dive+sharp|better | 100 % | 21 / 9.8 | 17 / 9.3 | 19 / 11.8 | 12 / 8.1 | 71 / 39.9 | 19.1 · 25.1 · 28.9 · 30.8 | 34.2 / 48.0 | 100 % |
| expert|balanced|calm+cushion|better | 100 % | 21 / 9.8 | 17 / 9.7 | 18 / 10.8 | 14 / 8.6 | 72 / 39.4 | 19.1 · 25.3 · 26.5 · 27.7 | 30.4 / 43.4 | 100 % |
| expert|paper-first|auto|better | 100 % | 36 / 15.1 | 26 / 13.5 | 36 / 19.6 | 19 / 10.1 | 121 / 59.7 | 17.2 · 22.4 · 24.4 · 24.9 | 27.5 / 40.4 | 100 % |
| expert|paper-first|dive+sharp|better | 100 % | 36 / 15.1 | 26 / 13.5 | 36 / 19.6 | 19 / 10.1 | 121 / 59.7 | 17.2 · 22.4 · 24.4 · 24.9 | 27.5 / 40.4 | 100 % |
| expert|paper-first|calm+cushion|better | 100 % | 36 / 15.1 | 26 / 13.2 | 35 / 19.2 | 18 / 10.1 | 119 / 59.3 | 17.2 · 22.6 · 24.9 · 25.6 | 27.9 / 40.4 | 100 % |

| Skupina | sucho med / max / P90 max | mezi místy med/P90 | 1. kapsa | úrovně v cíli | kluzák | strop E | strop β | Dive pády |
|---|---|---|---:|---:|---:|---:|---:|---:|
| weak|balanced|auto|better | 2 / 17 / 12 | 8 / 13 | 41 | 70 % | 61 % | 10 % | 0 % | – |
| weak|balanced|dive+sharp|better | 3 / 18 / 14 | 9 / 17 | 46 | 70 % | 57 % | 5 % | 0 % | 4 % |
| weak|balanced|calm+cushion|better | 2 / 16 / 13 | 8 / 15 | 51 | 70 % | 60 % | 4 % | 0 % | – |
| weak|paper-first|auto|better | 5 / 23 / 18 | 9 / 21 | 112 | 43 % | 60 % | 0 % | 0 % | – |
| weak|paper-first|dive+sharp|better | 5 / 23 / 19 | 10 / 22 | 68 | 46 % | 59 % | 0 % | 0 % | 4 % |
| weak|paper-first|calm+cushion|better | 5 / 23 / 18 | 10 / 21 | 121 | 46 % | 60 % | 0 % | 0 % | – |
| average|balanced|auto|better | 2 / 14 / 10 | 6 / 11 | 43 | 67 % | 52 % | 14 % | 0 % | – |
| average|balanced|dive+sharp|better | 2 / 16 / 13 | 7 / 13 | 39 | 67 % | 48 % | 9 % | 0 % | 1 % |
| average|balanced|calm+cushion|better | 2 / 12 / 11 | 7 / 12 | 45 | 67 % | 53 % | 8 % | 0 % | – |
| average|paper-first|auto|better | 5 / 21 / 17 | 8 / 19 | 112 | 39 % | 55 % | 0 % | 0 % | – |
| average|paper-first|dive+sharp|better | 5 / 21 / 17 | 9 / 20 | 59 | 41 % | 53 % | 0 % | 0 % | 1 % |
| average|paper-first|calm+cushion|better | 5 / 21 / 17 | 8 / 19 | 127 | 41 % | 56 % | 0 % | 0 % | – |
| good|balanced|auto|better | 2 / 16 / 11 | 6 / 11 | 33 | 63 % | 46 % | 13 % | 0 % | 0 % |
| good|balanced|dive+sharp|better | 2 / 16 / 11 | 6 / 11 | 33 | 63 % | 46 % | 13 % | 0 % | 0 % |
| good|balanced|calm+cushion|better | 2 / 11 / 10 | 6 / 11 | 39 | 65 % | 47 % | 13 % | 0 % | – |
| good|paper-first|auto|better | 5 / 21 / 16 | 8 / 19 | 51 | 39 % | 51 % | 0 % | 0 % | 0 % |
| good|paper-first|dive+sharp|better | 5 / 21 / 16 | 8 / 19 | 51 | 39 % | 51 % | 0 % | 0 % | 0 % |
| good|paper-first|calm+cushion|better | 5 / 21 / 17 | 8 / 18 | 123 | 39 % | 54 % | 0 % | 0 % | – |
| expert|balanced|auto|better | 2 / 15 / 10 | 5 / 10 | 29 | 61 % | 47 % | 15 % | 0 % | 0 % |
| expert|balanced|dive+sharp|better | 2 / 15 / 10 | 5 / 10 | 29 | 61 % | 47 % | 15 % | 0 % | 0 % |
| expert|balanced|calm+cushion|better | 2 / 11 / 9 | 5 / 10 | 36 | 63 % | 47 % | 14 % | 0 % | – |
| expert|paper-first|auto|better | 5 / 20 / 16 | 8 / 17 | 91 | 37 % | 51 % | 0 % | 0 % | 0 % |
| expert|paper-first|dive+sharp|better | 5 / 20 / 16 | 8 / 17 | 91 | 37 % | 51 % | 0 % | 0 % | 0 % |
| expert|paper-first|calm+cushion|better | 5 / 20 / 16 | 8 / 17 | 121 | 37 % | 52 % | 0 % | 0 % | – |

## Ekonomika (průměr ◈ na kampaň)

| Skupina | příjem D1 / D2 / D3 / D4 | útrata D1 / D2 / D3 / D4 | útrata po druzích | zůstatek v cíli (med) |
|---|---|---|---|---:|
| weak|balanced|auto|better | 2164 / 4223 / 6540 / 8167 | 1880 / 3633 / 6032 / 7648 | paper 12293, workshop 1120, atlas 4992, pocket 787 | 1592 |
| weak|balanced|dive+sharp|better | 2163 / 4794 / 8165 / 7965 | 1879 / 4178 / 7497 / 7473 | paper 13937, workshop 1120, atlas 4797, pocket 1173 | 1879 |
| weak|balanced|calm+cushion|better | 2164 / 4673 / 6941 / 7643 | 1880 / 4010 / 6457 / 7214 | paper 13291, workshop 1120, atlas 4833, pocket 317 | 1567 |
| weak|paper-first|auto|better | 3724 / 5242 / 8971 / 7510 | 3429 / 4190 / 8814 / 7391 | paper 22271, workshop 1031, atlas 309, pocket 212 | 1069 |
| weak|paper-first|dive+sharp|better | 3724 / 5427 / 9431 / 7546 | 3430 / 4334 / 9260 / 7462 | paper 22649, workshop 1089, atlas 599, pocket 149 | 995 |
| weak|paper-first|calm+cushion|better | 3724 / 5170 / 9416 / 7709 | 3429 / 4107 / 9253 / 7628 | paper 22772, workshop 1090, atlas 456, pocket 99 | 1034 |
| average|balanced|auto|better | 1923 / 3966 / 5625 / 6801 | 1666 / 3563 / 5158 / 6093 | paper 10244, workshop 1120, atlas 4632, pocket 485 | 1369 |
| average|balanced|dive+sharp|better | 1920 / 4147 / 6844 / 6872 | 1666 / 3698 / 6186 / 6311 | paper 11370, workshop 1120, atlas 4501, pocket 870 | 1545 |
| average|balanced|calm+cushion|better | 1923 / 3966 / 6226 / 6737 | 1666 / 3563 / 5558 / 6189 | paper 10975, workshop 1120, atlas 4581, pocket 300 | 1653 |
| average|paper-first|auto|better | 3561 / 4943 / 9250 / 7513 | 3276 / 3900 / 9066 / 7338 | paper 22423, workshop 843, atlas 163, pocket 152 | 1103 |
| average|paper-first|dive+sharp|better | 3560 / 5286 / 9538 / 7543 | 3278 / 4268 / 9196 / 7504 | paper 22824, workshop 910, atlas 354, pocket 157 | 975 |
| average|paper-first|calm+cushion|better | 3561 / 4943 / 9311 / 7651 | 3276 / 3900 / 9102 / 7388 | paper 22445, workshop 907, atlas 240, pocket 75 | 1184 |
| good|balanced|auto|better | 1742 / 3695 / 5956 / 5512 | 1484 / 3402 / 5274 / 5025 | paper 9219, workshop 1120, atlas 4144, pocket 702 | 1325 |
| good|balanced|dive+sharp|better | 1742 / 3695 / 5956 / 5512 | 1484 / 3402 / 5274 / 5025 | paper 9219, workshop 1120, atlas 4144, pocket 702 | 1325 |
| good|balanced|calm+cushion|better | 1742 / 3643 / 5633 / 6354 | 1483 / 3338 / 5110 / 5671 | paper 9895, workshop 1120, atlas 4287, pocket 300 | 1393 |
| good|paper-first|auto|better | 3438 / 5016 / 9697 / 7096 | 3081 / 4107 / 9294 / 7233 | paper 22636, workshop 705, atlas 226, pocket 148 | 907 |
| good|paper-first|dive+sharp|better | 3438 / 5016 / 9697 / 7096 | 3081 / 4107 / 9294 / 7233 | paper 22636, workshop 705, atlas 226, pocket 148 | 907 |
| good|paper-first|calm+cushion|better | 3438 / 4697 / 9420 / 6957 | 3081 / 3807 / 9139 / 6823 | paper 21902, workshop 731, atlas 174, pocket 43 | 1118 |
| expert|balanced|auto|better | 1587 / 3172 / 5328 / 5062 | 1315 / 2905 / 4682 / 4574 | paper 8125, workshop 1118, atlas 3764, pocket 468 | 1295 |
| expert|balanced|dive+sharp|better | 1587 / 3172 / 5328 / 5062 | 1315 / 2905 / 4682 / 4574 | paper 8125, workshop 1118, atlas 3764, pocket 468 | 1295 |
| expert|balanced|calm+cushion|better | 1587 / 3261 / 5247 / 5636 | 1315 / 2986 / 4767 / 5101 | paper 8671, workshop 1119, atlas 4081, pocket 299 | 1158 |
| expert|paper-first|auto|better | 2894 / 5028 / 9990 / 7183 | 2419 / 4144 / 9915 / 7178 | paper 22867, workshop 506, atlas 165, pocket 118 | 827 |
| expert|paper-first|dive+sharp|better | 2894 / 5028 / 9990 / 7183 | 2419 / 4144 / 9915 / 7178 | paper 22867, workshop 506, atlas 165, pocket 118 | 827 |
| expert|paper-first|calm+cushion|better | 2894 / 4838 / 9683 / 7139 | 2419 / 3998 / 9526 / 7123 | paper 22357, workshop 540, atlas 137, pocket 31 | 829 |

| Skupina | model: podíl hodů · ◈/hod · m/hod · ◈/min · koupilo (med. hod koupě) |
|---|---|
| weak|balanced|auto|better | dart: 40 % · 178 · 1690 · 386; glider: 60 % · 222 · 2121 · 401 |
| weak|balanced|dive+sharp|better | dart: 43 % · 185 · 1759 · 399; glider: 57 % · 209 · 1996 · 391 |
| weak|balanced|calm+cushion|better | dart: 41 % · 179 · 1692 · 392; glider: 59 % · 212 · 2025 · 399 |
| weak|paper-first|auto|better | dart: 41 % · 163 · 1534 · 398; glider: 59 % · 195 · 1852 · 401 |
| weak|paper-first|dive+sharp|better | dart: 42 % · 166 · 1566 · 404; glider: 58 % · 192 · 1822 · 399 |
| weak|paper-first|calm+cushion|better | dart: 40 % · 161 · 1514 · 394; glider: 60 % · 197 · 1879 · 405 |
| average|balanced|auto|better | dart: 47 % · 182 · 1729 · 379; glider: 53 % · 236 · 2268 · 414 |
| average|balanced|dive+sharp|better | dart: 51 % · 191 · 1819 · 392; glider: 49 % · 223 · 2135 · 397 |
| average|balanced|calm+cushion|better | dart: 48 % · 186 · 1765 · 389; glider: 52 % · 227 · 2178 · 412 |
| average|paper-first|auto|better | dart: 46 % · 173 · 1633 · 402; glider: 54 % · 212 · 2030 · 420 |
| average|paper-first|dive+sharp|better | dart: 47 % · 179 · 1696 · 415; glider: 53 % · 207 · 1972 · 416 |
| average|paper-first|calm+cushion|better | dart: 45 % · 172 · 1623 · 400; glider: 55 % · 214 · 2043 · 422 |
| good|balanced|auto|better | dart: 54 % · 198 · 1884 · 388; glider: 46 % · 225 · 2153 · 387 |
| good|balanced|dive+sharp|better | dart: 54 % · 198 · 1884 · 388; glider: 46 % · 225 · 2153 · 387 |
| good|balanced|calm+cushion|better | dart: 52 % · 202 · 1929 · 405; glider: 48 % · 230 · 2206 · 409 |
| good|paper-first|auto|better | dart: 48 % · 189 · 1794 · 421; glider: 52 % · 216 · 2068 · 423 |
| good|paper-first|dive+sharp|better | dart: 48 % · 189 · 1794 · 421; glider: 52 % · 216 · 2068 · 423 |
| good|paper-first|calm+cushion|better | dart: 46 % · 181 · 1715 · 406; glider: 54 % · 221 · 2113 · 425 |
| expert|balanced|auto|better | dart: 53 % · 197 · 1877 · 376; glider: 47 % · 238 · 2286 · 394 |
| expert|balanced|dive+sharp|better | dart: 53 % · 197 · 1877 · 376; glider: 47 % · 238 · 2286 · 394 |
| expert|balanced|calm+cushion|better | dart: 53 % · 206 · 1969 · 402; glider: 47 % · 237 · 2273 · 410 |
| expert|paper-first|auto|better | dart: 50 % · 199 · 1892 · 429; glider: 50 % · 228 · 2182 · 430 |
| expert|paper-first|dive+sharp|better | dart: 50 % · 199 · 1892 · 429; glider: 50 % · 228 · 2182 · 430 |
| expert|paper-first|calm+cushion|better | dart: 48 % · 192 · 1821 · 416; glider: 52 % · 232 · 2221 · 433 |

## Speciály na výbavě „konec D3“ (zisk doletu)

| Profil | dolet bez | cushion | sharp | calm | dive (pády) | whistle | rocket | dive vysoko |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| weak | 3474 | 4.6 % | 3.3 % | 2.5 % | -4.4 % (6 %) | 6.7 % | 9.2 % | -2.3 % |
| average | 3806 | 5.3 % | 6.7 % | 4.0 % | -3.6 % (2 %) | 8.3 % | 8.5 % | -2.8 % |
| good | 4040 | 5.8 % | 8.6 % | 4.8 % | -1.9 % (0 %) | 9.4 % | 8.1 % | -3.5 % |
| expert | 4212 | 6.1 % | 10.7 % | 5.1 % | -1.3 % (0 %) | 10.8 % | 7.8 % | -3.8 % |

## Atlas na úr. 3 (plná výbava s bonusem / bez něj, průměrný)

chain 3.5 % · pinwheel 2.5 % · steam 0.2 % · tape 1.1 % · crane 3.8 % · skip 5.7 % (47 % letů) · gull 3.4 % · momentum 5.6 % · thermal 3.4 % · echo 7.0 % · star 0.3 % (10 % letů) · drone 0.8 % · paperCrane 0.0 % (10 % letů) · onAir 5.2 %

Shooting Star úr. 3 v letech s hvězdou: 3.8 % (200 letů, hvězda v rozvrhu 16 % klíčů, začala v 96 %).

Paper Crane v kampani (tah v letech / přes nové místo): weak|balanced|auto|better 0.4 % / 5 % · weak|balanced|dive+sharp|better 0.5 % / 2 % · weak|balanced|calm+cushion|better 0.4 % / 7 % · weak|paper-first|auto|better 0.3 % / 9 % · weak|paper-first|dive+sharp|better 0.3 % / 8 % · weak|paper-first|calm+cushion|better 0.3 % / 9 % · average|balanced|auto|better 0.5 % / 5 % · average|balanced|dive+sharp|better 0.5 % / 3 % · average|balanced|calm+cushion|better 0.4 % / 5 % · average|paper-first|auto|better 0.3 % / 11 % · average|paper-first|dive+sharp|better 0.3 % / 11 % · average|paper-first|calm+cushion|better 0.3 % / 11 % · good|balanced|auto|better 0.4 % / 2 % · good|balanced|dive+sharp|better 0.4 % / 2 % · good|balanced|calm+cushion|better 0.5 % / 9 % · good|paper-first|auto|better 0.3 % / 8 % · good|paper-first|dive+sharp|better 0.3 % / 8 % · good|paper-first|calm+cushion|better 0.3 % / 4 % · expert|balanced|auto|better 0.4 % / 9 % · expert|balanced|dive+sharp|better 0.4 % / 9 % · expert|balanced|calm+cushion|better 0.4 % / 6 % · expert|paper-first|auto|better 0.4 % / 9 % · expert|paper-first|dive+sharp|better 0.4 % / 9 % · expert|paper-first|calm+cushion|better 0.3 % / 8 %

Slabý: chain 3.1 % · pinwheel 2.6 % · steam 0.0 % · tape 2.0 % · crane 3.8 % · skip 4.7 % (34 %) · gull 2.9 % · momentum 5.0 % · thermal 3.4 % · echo 4.3 % · star 0.1 % (10 %) · drone -1.2 % · paperCrane 0.0 % (5 %) · onAir 3.8 %

## Kousky (05 §4.6, skupina balanced|auto|better)

Výskyt = podíl letů s přísadami. Záměr = bot se záměrem (průměrný). 1. provedení = hody od prvního letu s přísadami (medián kampaní s provedením; nikdy = podíl kampaní bez provedení), u kousků modelů lety s modelem (medián / P90). Interval = nejkratší / medián intervalu dvojice v letech, kde dvojice perfektů nastala.

| Kousek | třída | lety (prům.) · podíl letů | strop | slabý | průměrný | expert | D1 / D2 / D3 / D4 | se záměrem (×) | 1. provedení (nikdy) | expert / slabý | interval [s] | výskyt · záměr · 1. · E/S · čtvrti · třída | verdikt záměr / třída | poznámka |
|---|---|---|---:|---:|---:|---:|---|---|---|---:|---|---|---|---|
| Pigeon Express | dovednost | 26062 · 100 % | 44 % | 0.0 % | 0.0 % | 0.0 % | 0 % / 0 % / 0 % / 0 % | – (–) | – (100 %) | – | 5.1 / 6.0 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | holub a hned další běžná událost poryv, obě perfekt (hvězda se přeskočí); „hned další“ = tricks.pigeonWindow 99, jinak okno v s mezi vyhodnoceními; strop = dvojice holub → poryv |
| Kettle Song | volba | 0 · 0 % | – | 3.9 % | – | 39.4 % | – / – / – / – | – (–) | – (–) | 10.11× | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · jen perfektnost · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | pára perfektně se Sharp Edge v kapse; záměr = Sharp Edge místo výchozí druhé kapsy |
| Over the Line | volba | 11180 · 43 % | – | 2.7 % | 2.0 % | – | – / – / 3 % / 1 % | – (–) | 8 (52 %) | – | – | zdravý · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED (neběželo) | CRITICAL / CRITICAL | jen Paper Rocket (od D3); Boost tap v simulátoru není, část „od místa 1“ NOT ASSESSED; „poslední sekunda“ = do 1 s před dotykem země (i před odrazem Stone Skip), přes hranici se hodnotí konečný dolet |
| Tape Save | dovednost | 17662 · 68 % | – | 8.4 % | 3.2 % | 0.1 % | – / 2 % / 2 % / 7 % | – (–) | 27 (28 %) | 0.01× | – | zdravý · NOT ASSESSED (bez páky) · hraniční · zdravý · zdravý · náhoda | CONCERNS / CONCERNS | záměr: hráč si minutí nevybírá, simulátor nemá páku |
| Whistle Stop | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – (–) | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · NOT ASSESSED (neběželo) | NOT ASSESSED / NOT ASSESSED | přivolaná událost perfektně, předchozí běžná perfektně, pískání do tricks.whistleGap s od konce jejího účinku; bez záměru = bot Whistle (kombo ≥ 2), záměr = píská po každém perfektu běžné události; strop = let s přivolanou událostí |
| Wish | dovednost | 6614 · 25 % | 9 % | 0.9 % | 1.8 % | 2.7 % | – / – / 2 % / 2 % | – (–) | 11 (67 %) | 3.13× | – | hraniční · NOT ASSESSED (bez páky) · vzácný · zdravý · zdravý · zdravý | CRITICAL / CRITICAL | kombo ≥ tricks.wishCombo; strop = podíl letů s hvězdou |
| Drone Ping-Pong | dovednost | 108 · 0 % | 31 % | 0.0 % | 0.0 % | – | – / – / – / 0 % | – (–) | – (100 %) | – | 2.9 / 3.0 | vzácný · NOT ASSESSED (neběželo) · vzácný · – · zdravý · NOT ASSESSED | CRITICAL / CRITICAL | dron a hned další běžná událost dron, oba perfekt; přísada Gates úr. ≥ tricks.droneLevel; „hned další“ = droneWindow 99; strop = dvojice dronů |
| All the Verbs | pestrost | 9830 · 38 % | – | 4.7 % | 6.5 % | 2.9 % | – / – / 6 % / 7 % | – (–) | 9 (13 %) | 0.62× | – | zdravý · NOT ASSESSED (bez páky) · zdravý · zdravý · zdravý · zdravý | HEALTHY (záměr NOT ASSESSED) / HEALTHY | tap = poryv/hvězda, hold = holub, tap-tap = pára, tap in place = termika/dron (08 §8 slovesa); záměr: simulátor nemá páku |
| Hawk: 3 perfekty za sebou | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED | hvězda řadu nepřerušuje ani nepočítá |
| Kite: perfekt termiky nebo 40 m | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Skimmer: dvojitý odraz | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Sail: zadní vítr | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |
| Needle: drony (needleDrones) | volba | 0 · 0 % | – | – | – | – | – / – / – / – | – (–) | – / – | – | – | NOT ASSESSED · NOT ASSESSED (neběželo) · NOT ASSESSED · – · – · 01 §6.1 b. 15 | NOT ASSESSED / NOT ASSESSED |  |

Brána (8 kousků mimo modely, platí podle tříd): záměr u všech zdravých 0 (se záměrem NOT ASSESSED 1), podle tříd (dovednost: expert / slabý ≥ 1.3×) 1, z 8, potřeba 6. Čtvrť se počítá od 30 letů s přísadami.
**Postavit:** 05 §4.7, kousky mimo modely nestavět: Hawk: 3 perfekty za sebou, Kite: perfekt termiky nebo 40 m, Skimmer: dvojitý odraz, Sail: zadní vítr, Needle: drony (needleDrones).
Korelace φ nad 0.5: žádná.
Systém: 1. kousek mimo modely (medián průměrného) 54 hodů (cíl ≤ 15); nalezeno z 13 průměrný 15 % (cíl 40 %–75 %), slabý 23 % (cíl ≥ 25 %); nejvyšší korelace wish × allTheVerbs φ 0.02 (6614 letů), nad 0.8: žádná. Kousky nic nedávají, délku nemění (test `progression-90`).

## Cíle (sada t90)

| Metrika | Hodnota | Cíl | |
|---|---|---|---|
| Žádný let > 60 s (skutečný) | 48.0 | ≤ 60 | OK |
| Dive pády (weak) | 6 % | ≤ 15 % | OK |
| Dive vysoké vybrání (průměrný) | -2.8 % | ±2 % | FAIL |
| Dive pády (expert) | 0 % | ≤ 3 % | OK |
| Atlas chain na úr. 3 | 3.5 % | 3 %–15 % | OK |
| Atlas pinwheel na úr. 3 | 2.5 % | 3 %–15 % | FAIL |
| Atlas steam na úr. 3 | 0.2 % | 3 %–15 % | FAIL |
| Atlas tape na úr. 3 (info) | 1.1 % | – | – |
| Atlas crane na úr. 3 | 3.8 % | 3 %–15 % | OK |
| Atlas skip na úr. 3 | 5.7 % (v 47 % letů) | 3 %–15 % | OK |
| Atlas gull na úr. 3 | 3.4 % | 3 %–15 % | OK |
| Atlas momentum na úr. 3 | 5.6 % | 3 %–15 % | OK |
| Atlas thermal na úr. 3 | 3.4 % | 3 %–15 % | OK |
| Atlas echo na úr. 3 | 7.0 % | 3 %–15 % | OK |
| Atlas star na úr. 3 (info) | 0.3 % (v 10 % letů) | – | – |
| Atlas drone na úr. 3 | 0.8 % | 3 %–15 % | FAIL |
| Atlas paperCrane na úr. 3 (info) | 0.0 % (v 10 % letů) | – | – |
| Atlas onAir na úr. 3 | 5.2 % | 3 %–15 % | OK |
| Paper Crane úr. 3: podíl letů s tahem (průměrný, plná, info) | 10 % | – | – |
| Shooting Star úr. 3: zisk v letu s hvězdou (průměrný, plná) | 3.8 % (200 letů) | ≥ 3 % | OK |
| Packing Tape úr. 3 (slabý, plná) | 2.0 % | 3 %–15 % | FAIL |
| Stone Skip úr. 3: podíl letů s odrazem (průměrný, plná) | 47 % | 30 %–50 % | OK |
