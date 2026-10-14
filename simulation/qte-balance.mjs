import { writeFile } from 'node:fs/promises';
import { simulate } from '../src/core.js';
import { HELP } from '../src/events.js';
import { VERSION } from '../src/config.js';
const quant = (values, q) => {
  const a = [...values].sort((a, b) => a - b);
  return +a[Math.floor((a.length - 1) * q)].toFixed(2);
};
const rows = [],
  pooled = [];
for (const model of ['dart', 'glider'])
  for (const level of [0, 2, 5])
    for (const only of ['both', 'gust', 'bird']) {
      const gains = [];
      for (let seed = 1; seed <= 1000; seed++) {
        const levels = { power: level, paper: level, fold: level },
          base = simulate(model, levels, seed, 0),
          assisted = simulate(model, levels, seed, 0.6, 1 / 60, {
            only: only === 'both' ? null : only,
          });
        gains.push((assisted.x / base.x - 1) * 100);
      }
      if (only === 'both') pooled.push(...gains);
      rows.push({
        model,
        level,
        events: only,
        p10: quant(gains, 0.1),
        median: quant(gains, 0.5),
        p90: quant(gains, 0.9),
      });
    }
const report = {
  version: VERSION,
  seeds: [1, 1000],
  profile: 0.6,
  perfectAmongHits: 0.25,
  dt: 1 / 60,
  help: HELP,
  pooledMedian: quant(pooled, 0.5),
  rows,
};
await writeFile(new URL('qte-balance.json', import.meta.url), JSON.stringify(report, null, 2));
await writeFile(
  new URL('QTE-BALANCE.md', import.meta.url),
  `# Párové lety — živé město\n\nPravidla ${VERSION}. 1 000 seedů pro každý model, úroveň 0/2/5 a variantu pomoci. 18 000 párů; stejná konfigurace a seed v obou letech. Standardní úhel a rychlost konstrukce; dovednost úvodního hodu není v tomto měření měněna. Úspěšnost QTE 60 %, z úspěchů 25 % perfektních. Test jedné události ignoruje vstupy druhého typu, plánovač zůstává stejný.\n\nSouhrnný medián obou typů: **${report.pooledMedian} %**. Cíl 20–40 % je posuzován pro rovnoměrně zastoupenou sadu šesti konstrukcí, ne jako garance každého letu.\n\n| Model | Úrovně všech větví | Pomoc | P10 % | Medián % | P90 % |\n|---|---:|---|---:|---:|---:|\n${rows.map(r => `| ${r.model} | ${r.level} | ${r.events} | ${r.p10} | ${r.median} | ${r.p90} |`).join('\n')}\n\nVýrazné rozdíly v horním decilu jsou nelineární odezva fyziky na impuls a nesení. Nejde o důkaz zábavnosti ani potvrzení tempa celého průchodu. Skutečný telefon a hráčské hodnocení zůstávají neověřené.\n`,
);
console.log(JSON.stringify(report));
