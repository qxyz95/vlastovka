// Zapíše research/atlas/03-texty.md z content.js (logika a kontroly v texty.js). Spuštění: node prototype/atlas/gen-texty.mjs
// Při chybě kontroly vypíše chyby, skončí s kódem 1 a soubor nezapíše.
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildTexty} from './texty.js';
import {P} from '../../simulation/progression/params.mjs';
const r=buildTexty({bonusIds:P.atlas.bonuses});
if(r.errors.length){console.error(r.errors.join('\n'));process.exit(1);}
writeFileSync(fileURLToPath(new URL('../../research/atlas/03-texty.md',import.meta.url)),r.md);
console.log(`03-texty.md: ${r.rows} klíčů, šablon ${r.templates}, teaser max EN ${r.teaserLen.en} / CS ${r.teaserLen.cs}`);
