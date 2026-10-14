// Tabulka research/atlas/03-texty.md z content.js (EN + CS) s kontrolami. Bez Node API, aby šla spustit i v prohlížeči:
//   node prototype/atlas/gen-texty.mjs   (zapíše soubor)   ·   v prohlížeči: (await import('/prototype/atlas/texty.js')).buildTexty({bonusIds:[…]})
// Kontroly: stejné klíče a parametry v EN i CS, tvary plurálů, teasery ≤ 90 znaků, zakázané formulace (FORBIDDEN en/cs) ve všech textech,
// šablony účinku mají hodnotu pro každý token na každé úrovni (3 i 12 úrovní), všechny parametry se dosadí, ID bonusů = params.mjs.
import {
  TEXTS,
  FORBIDDEN,
  LANGS,
  PLACES,
  BONUSES,
  SPECIALS,
  NODES,
  setLang,
  getLang,
} from './content.js';
import { numbers } from './numbers.js';
import * as L from './logic.js';
// ID bonusů z params.mjs předává volající (gen-texty.mjs importuje P; server posílá .mjs jako octet-stream, prohlížeč ho jako modul nenačte)

const forms = v => (typeof v === 'string' ? [v] : Object.values(v));
const paramsOf = v =>
  [...new Set(forms(v).flatMap(s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1])))]
    .sort()
    .join(',');
const len = v => Math.max(...forms(v).map(s => [...s].length));
const DN = ['čtvrť 1', 'čtvrť 2', 'čtvrť 3', 'čtvrť 4'];
const UNIT_NOTE = {
  '+%': '+10 %',
  '%': '25 %',
  x: '×4',
  m: '1.5 m / 1,5 m',
  s: '0.6 s / 0,6 s',
  count: 'once / jednou, twice / dvakrát, 3 times / 3krát',
  times: '1 time / 1krát',
};

export function buildTexty({ bonusIds, date = new Date().toISOString().slice(0, 10) } = {}) {
  const errors = [],
    { en, cs } = TEXTS,
    lang0 = getLang();
  // 1. klíče, parametry, plurály
  for (const k of Object.keys(en)) if (!(k in cs)) errors.push(`CS chybí klíč ${k}`);
  for (const k of Object.keys(cs)) if (!(k in en)) errors.push(`EN chybí klíč ${k}`);
  for (const k of Object.keys(en))
    if (k in cs) {
      if (paramsOf(en[k]) !== paramsOf(cs[k]))
        errors.push(`${k}: parametry EN {${paramsOf(en[k])}} ≠ CS {${paramsOf(cs[k])}}`);
      if (typeof en[k] !== typeof cs[k]) errors.push(`${k}: plurál jen v jednom jazyce`);
      else if (typeof en[k] === 'object') {
        if (!en[k].one || !en[k].other) errors.push(`${k}: EN plurál potřebuje one, other`);
        for (const f of ['one', 'few', 'many', 'other'])
          if (!cs[k][f]) errors.push(`${k}: CS plurál chybí ${f}`);
        if (!paramsOf(en[k]).split(',').includes('count')) errors.push(`${k}: plurál bez {count}`);
      }
    }
  // 2. teasery
  const teaserLen = {};
  for (const pl of PLACES)
    for (const l of LANGS) {
      const n = len(TEXTS[l][`place.${pl.id}.teaser`]);
      teaserLen[l] = Math.max(teaserLen[l] ?? 0, n);
      if (n > 90) errors.push(`teaser ${pl.id} ${l}: ${n} znaků > 90`);
    }
  // 3. zakázané formulace (oba seznamy proti oběma jazykům)
  const banned = [...FORBIDDEN.en, ...FORBIDDEN.cs];
  for (const l of LANGS)
    for (const [k, v] of Object.entries(TEXTS[l]))
      for (const s of forms(v))
        for (const w of banned)
          if (s.toLowerCase().includes(w)) errors.push(`${l} ${k}: zakázané „${w}“`);
  // 4. šablony účinku na všech úrovních + dosazení všech parametrů
  let templates = 0;
  for (const l of LANGS) {
    setLang(l);
    for (const long of [false, true]) {
      const N = numbers({ long });
      for (const [id, b] of Object.entries(BONUSES)) {
        if (!b.effect) continue;
        for (let lv = 1; lv <= N.maxLevel(id); lv++) {
          const s = L.effectText(id, N.value(id, lv));
          templates++;
          if (!s || s.includes('?') || /\{\w+\}/.test(s))
            errors.push(`${l} ${id} úr. ${lv}${long ? ' (12)' : ''}: „${s}“`);
        }
      }
    }
    for (const k of Object.keys(TEXTS[l])) {
      const vars = Object.fromEntries(
        paramsOf(TEXTS[l][k])
          .split(',')
          .filter(Boolean)
          .map(p => [p, 'X']),
      );
      for (const n of [1, 2, 5])
        if (/\{\w+\}/.test(L.t(k, { ...vars, count: n })))
          errors.push(`${l} ${k}: nedosazený parametr`);
    }
  }
  setLang(lang0);
  // 5. ID bonusů = params.mjs
  if (!bonusIds?.length) errors.push('chybí bonusIds z params.mjs');
  const ids = Object.keys(BONUSES).join(','),
    pid = (bonusIds ?? []).join(',');
  if (ids !== pid) errors.push(`ID bonusů ${ids} ≠ params.mjs ${pid}`);
  if (PLACES.map(p => p.bonus).join(',') !== pid) errors.push('pořadí bonusů míst ≠ params.mjs');

  const note = k => {
    let m;
    if ((m = k.match(/^place\.(\w+)\.(\w+)$/))) {
      const pl = PLACES.find(p => p.id === m[1]);
      if (m[2] === 'name')
        return `${DN[pl.district]}, bonus \`${pl.bonus}\`${pl.opensPaper ? `, papír \`${pl.opensPaper}\`` : ''}`;
      if (m[2] === 'short') return 'krátké jméno do řádku cíle';
      if (m[2] === 'teaser') return `EN ${len(en[k])} / CS ${len(cs[k])} znaků`;
      if (m[2] === 'story') return 'příběh = `src/locales/*.js` `place.*.story`';
    }
    if ((m = k.match(/^district\.(\w+)\.(name|frame|bird|gust)$/)))
      return {
        name: 'CS = `cs.js` `district.*` (tam verzálkami pro HUD)',
        frame: 'stav `frame`, jediná věta nálady',
        bird: 'holub (hold)',
        gust: 'poryv (tap)',
      }[m[2]];
    if ((m = k.match(/^character\.\w+\.line(\d)$/)))
      return {
        1: '1 = první přílet do čtvrti (08 §7.1)',
        2: '2 = 3. místo čtvrti (08 §7.1)',
        3: '3 = přelet do další čtvrti / finále (08 §7.1)',
      }[m[1]];
    if ((m = k.match(/^character\.\w+\.name$/))) return 'jméno se nepřekládá';
    if ((m = k.match(/^bonus\.(\w+)\.(name|pitch|pitchDone)$/))) {
      const b = BONUSES[m[1]];
      return m[2] === 'name'
        ? `sloveso \`${b.verb}\`, štítky ${b.tags.length ? b.tags.map(x => `\`${x}\``).join(', ') : '–'}`
        : m[2] === 'pitch'
          ? 'teaser i karta, bez čísel'
          : 'po finále';
    }
    if ((m = k.match(/^bonus\.(\w+)\.effect\.(\d)$/))) {
      const b = BONUSES[m[1]],
        s = b.effect[+m[2]],
        u = Object.entries(b.units ?? {})
          .filter(([t]) => en[k].includes(`{${t}}`))
          .map(([t, f]) => `\`${t}\`: ${UNIT_NOTE[f]}`)
          .join('; ');
      return (s.if ? `jen když úroveň má \`${s.if}\`` : 'vždy') + (u ? ` · ${u}` : '');
    }
    if ((m = k.match(/^special\.(\w+)\.(\w+)$/))) {
      const sp = SPECIALS[m[1]];
      return m[2] === 'name'
        ? `${sp.active ? 'aktivní' : 'pasivní'}, sloveso \`${sp.verb}\`, odemyká ${DN[sp.district]}`
        : m[2] === 'tradeoff'
          ? 'kompromis jednou větou'
          : 'nápověda při prvním letu (08 §7.3), verzálky';
    }
    if ((m = k.match(/^node\.(\w+)\.name$/)) && NODES[m[1]]) {
      const n = NODES[m[1]];
      return `${DN[n.district]}, podmínka \`${n.requires}\``;
    }
    if (k.startsWith('verb.')) return 'zobrazuje se verzálkami (CSS)';
    if (k.startsWith('unit.')) return 'jednotka v šabloně účinku (`count`, `times`)';
    if (k.startsWith('button.')) return 'tlačítko';
    if (k.startsWith('toast.')) return 'toast (`aria-live`)';
    if (k.startsWith('empty.')) return 'prázdný stav';
    if (k.startsWith('proto.')) return 'jen prototyp, do hry nepřenášet';
    if (k === 'goal.label') return 'tučně před `goal.next` / `goal.finish`';
    if (k === 'wallet.aria') return 'aria-label peněženky a cen';
    if (k === 'delivered.gridAria') return 'aria-label mřížky pohlednic';
    if (k === 'pocket.passiveRule')
      return '`{a}`, `{b}` = jména vylučujících se speciálů (`EXCLUSIVE`)';
    if (k === 'preview.crane') return '`{last}` = počet hodů náhledu (`PREVIEW_THROWS`)';
    if (k === 'empty.atlas') return 'prázdný stav, `{m}` = `placeStart(0)`';
    return '';
  };
  const esc = s => s.replace(/\|/g, '\\|');
  const cell = v =>
    typeof v === 'string'
      ? esc(v)
      : Object.entries(v)
          .map(([f, s]) => `*${f}:* ${esc(s)}`)
          .join('<br>');
  const SECTIONS = [
    ['1. Místa: jména, teasery (≤ 90 znaků), příběhy', k => k.startsWith('place.')],
    [
      '2. Čtvrti: jméno, věta rámce, postava, hlášky, místní',
      k => /^(district\.(violet|docks|horizon|core)\.|character\.)/.test(k),
    ],
    ['3. Bonusy: jméno, věta „chci“ (bez čísel), šablona účinku', k => k.startsWith('bonus.')],
    ['4. Papíry (řádek „Also opens“)', k => k.startsWith('paper.')],
    ['5. Speciály do kapes', k => k.startsWith('special.')],
    [
      '6. Uzly (automatika QTE, Night Route)',
      k => /^node\.(autoBasic|autoSteam|autoThermal|autoStar|autoDrone|nightRoute)\./.test(k),
    ],
    ['7. Štítky: slovesa, „pro koho“, jednotky', k => /^(verb|tag|unit)\./.test(k)],
    [
      '8. UI: hlavička, tlačítka, štítky, náhledy, kapsy, prázdné stavy, toasty, výsledek, karta čtvrti, Delivered',
      () => true,
    ],
  ];
  const used = new Set();
  let body = '',
    rows = 0;
  for (const [title, f] of SECTIONS) {
    const keys = Object.keys(en).filter(k => !used.has(k) && f(k));
    keys.forEach(k => used.add(k));
    rows += keys.length;
    body +=
      `\n## ${title}\n\n| Klíč | EN | CS | Pozn. |\n|---|---|---|---|\n` +
      keys.map(k => `| \`${k}\` | ${cell(en[k])} | ${cell(cs[k])} | ${note(k)} |`).join('\n') +
      '\n';
  }
  // delší čeština v ovládacích prvcích (hlídat na 360 px)
  const ui = Object.keys(en)
    .filter(
      k =>
        /^(button|label|pocket|goal|atlas|verb|tag)\./.test(k) &&
        typeof en[k] === 'string' &&
        len(cs[k]) > len(en[k]) * 1.3 &&
        len(cs[k]) >= 8,
    )
    .sort((a, b) => len(cs[b]) / len(en[b]) - len(cs[a]) / len(en[a]));
  const longest = Object.keys(en)
    .filter(k => k.startsWith('button.'))
    .sort((a, b) => len(cs[b]) - len(cs[a]))
    .slice(0, 5);
  const head = `# Atlas: texty EN a CS (klíč → text)

**Stav ${date}, product-designer (A1, doplněna CS podle 06 „Atlas A1, čeština“).** Zdroj pravdy je \`prototype/atlas/content.js\`, tahle tabulka je z něj vygenerovaná (\`node prototype/atlas/gen-texty.mjs\`, logika v \`prototype/atlas/texty.js\`; ručně neupravovat). Vývojář klíče přenese do \`src/locales/en.js\` a \`cs.js\` (stejné klíče a parametry, plurály \`{one,other}\` / \`{one,few,many,other}\` přes \`count\`) a ID do \`src/atlas-content.js\`. ID bonusů = \`simulation/progression/params.mjs\` \`atlas.bonuses\`. Prototyp: \`prototype-atlas.html?lang=cs\` (výchozí EN, přepínač i v ovládání prototypu).

Pravidla:
- \`{token}\` = dosazení. Čísla jen přes formátovače podle jazyka (prototyp \`fmtCoins\` / \`fmtMeters\` / \`fmtPct\`, ve hře \`num\` / \`unit\` / \`pct\` ze \`src/i18n.js\`): EN \`1,240 m\`, \`+1.4 %\`, \`1.2M ◈\`; CS \`1 240 m\`, \`+1,4 %\`, \`1,2 mil. ◈\`. Před jednotkou nedělitelná mezera.
- Vzdálenosti, ceny, úrovně a časy nikdy v textu napevno (\`.claude/rules/atlas.md\`): práh prvního místa je \`{m}\` z \`placeStart(0)\`, zpoždění Echa \`{delay}\` z \`params.mjs\` \`echo.delay\`.
- Šablona účinku je pole vět. Věta s podmínkou se ukáže, jen když má daná úroveň hodnotu (\`{if:'push'}\`). Jednotky tokenů jsou v Pozn.
- Seznamy (\`{list}\`) skládá \`Intl.ListFormat\` podle jazyka („A and B“ / „A a B“), ne ručně psaná spojka.
- Čeština: oslovení „ty“ jako ve hře (\`cs.js\`). Bez rodu hráče (žádné „doletěl jsi“): podmětem je vlaštovka, nebo přítomný či budoucí čas („Vlaštovka doletěla až sem“, „až tam doletíš“). Jména čtvrtí a míst stojí v 1. pádě (za dvojtečkou, „dál než {place}“, „ve čtvrti {district}“), aby se nemusela skloňovat. Jména postav (Bolts, Marge, Stella, Zippy) se nepřekládají. Termíny podle \`cs.js\`: Dílna, vlaštovka, Kluzák, mince, rekord, hod, let, perfektní, poryv, holub, Termika, Padající hvězda; „kombo“, nikdy „série“.
- Tón: suchý, laskavý, nikdo nepřemlouvá k hraní (08 §7, KB 02 N10, P13).

Zkontrolováno skriptem: ${Object.keys(en).length} klíčů v EN i CS se stejnými parametry a plurály; 16 teaserů ≤ 90 znaků (nejdelší EN ${teaserLen.en}, CS ${teaserLen.cs}); žádná zakázaná formulace v žádném jazyce (EN: ${FORBIDDEN.en.map(w => `\`${w}\``).join(', ')}; CS: ${FORBIDDEN.cs.map(w => `\`${w}\``).join(', ')}); ${templates} šablon účinku (2 jazyky × 3 i 12 úrovní) má hodnotu pro každý token; všechny klíče dosadí všechny parametry; ID bonusů = \`params.mjs\`.

Delší čeština v ovládacích prvcích (CS > 1,3 × EN, ověřeno v prototypu na 360 px): ${ui.map(k => `\`${k}\` (${len(en[k])} → ${len(cs[k])})`).join(', ')}. Nejdelší tlačítka v CS: ${longest.map(k => `„${cs[k]}“`).join(', ')}.
`;
  return { errors, md: head + body, rows, templates, teaserLen };
}
