# Počáteční kontrola balancu

Pravidla 0.1.0; 100 seedů na kombinaci; 3600 průchodů. Limit 100 pokusů. Seedy letu: seed průchodu × 1000 + počet dokončených pokusů.

Časy dokončivších obsahují simulovaný let + odhad 11 s na cyklus (včetně hodu) + 5 s na nákup. Nejde o hráčské měření. Strategie při shodě preferují sílu, papír, přehyby. Nejlevnější a vyvážená strategie při stejném ceníku splývají; síla šetří na další úroveň prioritní větve. Model glider znamená přepnutí po odemčení; alternate střídá modely po odemčení.

| QTE | Nákupy | Model | Nedokončeno | Pokusy medián | Minuty P10 / medián / P90 |
|---|---|---|---:|---:|---|
| 0% | cheapest | dart | 0 | 19 | 8.79 / 8.79 / 8.79 |
| 0% | cheapest | glider | 0 | 17 | 9.38 / 9.38 / 9.38 |
| 0% | cheapest | alternate | 0 | 18 | 9.25 / 9.25 / 9.25 |
| 0% | balanced | dart | 0 | 19 | 8.79 / 8.79 / 8.79 |
| 0% | balanced | glider | 0 | 17 | 9.38 / 9.38 / 9.38 |
| 0% | balanced | alternate | 0 | 18 | 9.25 / 9.25 / 9.25 |
| 0% | power | dart | 0 | 16 | 8.15 / 8.15 / 8.15 |
| 0% | power | glider | 0 | 12 | 6.64 / 6.64 / 6.64 |
| 0% | power | alternate | 0 | 12 | 6.21 / 6.21 / 6.21 |
| 25% | cheapest | dart | 0 | 14 | 4.89 / 7.04 / 9.36 |
| 25% | cheapest | glider | 0 | 9 | 3.23 / 4.87 / 7.67 |
| 25% | cheapest | alternate | 0 | 10 | 3.66 / 5.46 / 9.08 |
| 25% | balanced | dart | 0 | 14 | 4.89 / 7.04 / 9.36 |
| 25% | balanced | glider | 0 | 9 | 3.23 / 4.87 / 7.67 |
| 25% | balanced | alternate | 0 | 10 | 3.66 / 5.46 / 9.08 |
| 25% | power | dart | 0 | 11 | 3.41 / 5.38 / 7.99 |
| 25% | power | glider | 0 | 8 | 3.11 / 4.79 / 6.42 |
| 25% | power | alternate | 0 | 10 | 3.12 / 5.16 / 6.74 |
| 60% | cheapest | dart | 0 | 10 | 3.49 / 5.38 / 8.08 |
| 60% | cheapest | glider | 0 | 5 | 1.82 / 3.48 / 6 |
| 60% | cheapest | alternate | 0 | 6 | 1.82 / 3.9 / 6.38 |
| 60% | balanced | dart | 0 | 10 | 3.49 / 5.38 / 8.08 |
| 60% | balanced | glider | 0 | 5 | 1.82 / 3.48 / 6 |
| 60% | balanced | alternate | 0 | 6 | 1.82 / 3.9 / 6.38 |
| 60% | power | dart | 0 | 8 | 2.43 / 4.29 / 6.21 |
| 60% | power | glider | 0 | 5 | 1.59 / 3.19 / 5.37 |
| 60% | power | alternate | 0 | 6 | 1.56 / 3.32 / 6.12 |
| 90% | cheapest | dart | 0 | 6 | 2.3 / 3.76 / 6.4 |
| 90% | cheapest | glider | 0 | 3 | 1.55 / 2.18 / 3.23 |
| 90% | cheapest | alternate | 0 | 4 | 1.55 / 2.67 / 4.85 |
| 90% | balanced | dart | 0 | 6 | 2.3 / 3.76 / 6.4 |
| 90% | balanced | glider | 0 | 3 | 1.55 / 2.18 / 3.23 |
| 90% | balanced | alternate | 0 | 4 | 1.55 / 2.67 / 4.85 |
| 90% | power | dart | 0 | 6 | 1.86 / 3.25 / 5.4 |
| 90% | power | glider | 0 | 3 | 1.37 / 1.9 / 2.86 |
| 90% | power | alternate | 0 | 4 | 1.37 / 2.42 / 3.89 |

## Omezení
První lety jsou kratší než navržených 20–45 s a mohou skončit před třetí událostí. Počet příležitostí je zatím závislý na délce letu. Tempo 10–15 minut není potvrzeno. Tato první dávka není závěrečná Monte Carlo analýza ani důkaz zábavnosti. Podrobná data v initial-results.json obsahují délku letu a intervaly nákupů každého průchodu.