import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compact } from './helpers/compact.js';
import { PAPIR, PAPER_TOKENS } from '../src/render3d/palette.js';

// Dávka G3 (U14–U16), po R0 a H0: živé prvky, místo odhodu a holub berou barvy jen z palette.js, žádné cyber větve. Moduly s three.js
// v Node nejdou importovat bez hooku, proto kontrola textu zdroje.
const src = n => compact(readFileSync(new URL('../src/render3d/' + n, import.meta.url), 'utf8'));
const FILES = ['life3d.js', 'workshop.js', 'companion3d.js'];

test('U14: life3d, workshop a companion3d bez hex literálů a bez cyber, barvy jen z palette.js', () => {
  for (const n of FILES) {
    const s = src(n);
    assert.deepEqual(s.match(/#[0-9a-f]{3,8}\b|0x[0-9a-f]{6}\b/gi) ?? [], [], n);
    assert.ok(!/CYBER|cyber/.test(s), n + ': R0 bez cyber');
  }
  assert.match(src('workshop.js'), /PAL=PAPIR\.workshop\b/);
  assert.match(src('life3d.js'), /K=OLD_LIFE\b/);
  assert.match(src('companion3d.js'), /K=palette\.companion\b/);
});

test('H0: life3d bez kouře, mraků, dronů, robota, reklamy a holuba; pára ventilace krémová, nejvýš 60 % svítivosti vlaštovky', () => {
  const s = src('life3d.js').replace(/^\s*\/\/.*$/gm, '');
  for (const w of [
    'smoke',
    'clouds',
    'drone',
    'robot',
    'pigeon',
    'ADS',
    'signTexture',
    'puff',
    'steam',
  ])
    assert.ok(!s.includes(w), w);
  // C2a (05-art-udalosti kap. 1.1): pára jako plochý krémový papír (osmiúhelníky a pruhy) s alfou ≤ 0,6, žádný toon ani ikosaedr.
  assert.match(src('companion3d.js'), /color:K\.steam,transparent:true,opacity:K\.steamAlpha\b/);
  assert.ok(!/IcosahedronGeometry/.test(src('companion3d.js')));
  assert.ok(PAPIR.companion.steamAlpha <= 0.6);
  assert.equal(PAPIR.companion.steam, PAPER_TOKENS.cream);
  assert.equal(PAPIR.plane.fill, PAPER_TOKENS.paper);
});

test('U16: vlaštovka v ruce s obrysem razítkem 2,6 px v grafitu jako letící vlaštovka', () => {
  const s = src('workshop.js');
  assert.match(s, /export const OUTLINE=\{plane:2\.6\};/);
  assert.match(
    s,
    /stampOutlineMaterial\(\{color:PAPIR\.plane\.outline,thickness:OUTLINE\.plane\}\)/,
  );
  assert.ok(
    !/outlineMaterial\(/.test(s.replace(/stampOutlineMaterial\(/g, '')),
    'žádný inverted hull',
  );
});
