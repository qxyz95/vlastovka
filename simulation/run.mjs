import { writeFile } from 'node:fs/promises';
import { fresh, simulate, settle, buy } from '../src/core.js';
import { VERSION, PRICES, MODELS } from '../src/config.js';
const count = Number(process.argv[2] ?? 100);
if (!Number.isInteger(count) || count < 1) throw Error('Expected positive count');
const rows = [];
for (const profile of [0, 0.25, 0.6, 0.9])
  for (const purchase of ['cheapest', 'balanced', 'power'])
    for (const choice of ['dart', 'glider', 'alternate']) {
      const runs = [];
      for (let seed = 1; seed <= count; seed++) {
        const p = fresh();
        let time = 0,
          purchases = 0;
        const intervals = [];
        let lastBuy = 0;
        while (!p.completed && p.attempts < 100) {
          const model =
            p.best >= 100 && (choice === 'glider' || (choice === 'alternate' && p.attempts % 2))
              ? 'glider'
              : 'dart';
          p.model = model;
          const f = simulate(model, p.levels, seed * 1000 + p.attempts, profile);
          settle(p, f);
          time += f.t;
          while (true) {
            let branches = ['power', 'paper', 'fold'].filter(b => p.levels[b] < 5);
            if (purchase === 'cheapest')
              branches.sort((a, b) => PRICES[p.levels[a]] - PRICES[p.levels[b]]);
            if (purchase === 'balanced') branches.sort((a, b) => p.levels[a] - p.levels[b]);
            const branch = branches[0];
            if (!branch || !buy(p, branch, p.levels[branch] + 1)) break;
            intervals.push(p.attempts - lastBuy);
            lastBuy = p.attempts;
            purchases++;
          }
        }
        runs.push({
          seed,
          done: p.completed,
          attempts: p.attempts,
          flightSeconds: time,
          purchases,
          intervals,
        });
      }
      const completed = runs.filter(r => r.done),
        quant = (key, q) => {
          const values = completed.map(key).sort((a, b) => a - b);
          return values.length ? +values[Math.floor((values.length - 1) * q)].toFixed(2) : null;
        };
      rows.push({
        profile,
        purchase,
        model: choice,
        unfinished: runs.length - completed.length,
        attemptsP50: quant(r => r.attempts, 0.5),
        minutesP10: quant(r => (r.flightSeconds + r.attempts * 11 + r.purchases * 5) / 60, 0.1),
        minutesP50: quant(r => (r.flightSeconds + r.attempts * 11 + r.purchases * 5) / 60, 0.5),
        minutesP90: quant(r => (r.flightSeconds + r.attempts * 11 + r.purchases * 5) / 60, 0.9),
        runs,
      });
    }
await writeFile(
  new URL('./initial-results.json', import.meta.url),
  JSON.stringify(
    {
      version: VERSION,
      count,
      seedRange: [1, count],
      attemptLimit: 100,
      uiSecondsPerCycle: 11,
      secondsPerPurchase: 5,
      models: MODELS,
      rows,
    },
    null,
    2,
  ),
);
const lines = [
  '# Počáteční kontrola balancu',
  '',
  `Pravidla ${VERSION}; ${count} seedů na kombinaci; ${rows.length * count} průchodů. Limit 100 pokusů. Seedy letu: seed průchodu × 1000 + počet dokončených pokusů.`,
  '',
  'Časy dokončivších obsahují simulovaný let + odhad 11 s na cyklus (včetně hodu) + 5 s na nákup. Nejde o hráčské měření. Strategie při shodě preferují sílu, papír, přehyby. Nejlevnější a vyvážená strategie při stejném ceníku splývají; síla šetří na další úroveň prioritní větve. Model glider znamená přepnutí po odemčení; alternate střídá modely po odemčení.',
  '',
  '| QTE | Nákupy | Model | Nedokončeno | Pokusy medián | Minuty P10 / medián / P90 |',
  '|---|---|---|---:|---:|---|',
  ...rows.map(
    r =>
      `| ${r.profile * 100}% | ${r.purchase} | ${r.model} | ${r.unfinished} | ${r.attemptsP50} | ${r.minutesP10} / ${r.minutesP50} / ${r.minutesP90} |`,
  ),
  '',
  '## Omezení',
  'První lety jsou kratší než navržených 20–45 s a mohou skončit před třetí událostí. Počet příležitostí je zatím závislý na délce letu. Tempo 10–15 minut není potvrzeno. Tato první dávka není závěrečná Monte Carlo analýza ani důkaz zábavnosti. Podrobná data v initial-results.json obsahují délku letu a intervaly nákupů každého průchodu.',
];
await writeFile(new URL('./REPORT.md', import.meta.url), lines.join('\n'));
console.table(rows.map(({ runs, ...row }) => row));
