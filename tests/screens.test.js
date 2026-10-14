import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialState,
  transition,
  back,
  cancelThrow,
  loopRuns,
  LOCK_MS,
  HOLD_MIN_MS,
} from '../src/screens.js';

const run = (s, ...evs) => evs.reduce(transition, s);
const ev = (type, o = {}) => ({ type, ...o });
const open = panel => ev('open', { panel });
const home = () => run(initialState(), ev('loaded'));
const homeNoTitle = () => run(home(), ev('press', { t: 0 }), ev('release', { heldMs: 10 }));
const flight = () => run(home(), ev('press', { t: 0 }), ev('release', { heldMs: 500 }));
const result = (chapter = false) => run(flight(), ev('landed', { t: 1000, chapter }));
const view = s => [s.screen, s.panels.join('>')];

test('1.2 řádek 1: Načítání → Domov s titulem (po načtení a po smazání postupu)', () => {
  const s0 = initialState();
  assert.equal(s0.screen, 'loading');
  assert.deepEqual(view(transition(s0, ev('loaded'))), ['home', '']);
  assert.equal(transition(s0, ev('loaded')).title, true);
  const afterReset = run(home(), open('settings'), open('confirm'), ev('resetProgress'));
  assert.deepEqual(view(afterReset), ['home', '']);
  assert.equal(afterReset.title, true);
  const noTitle = run(
    afterReset,
    ev('press', { t: 0 }),
    ev('release', { heldMs: 20 }),
    open('settings'),
    open('confirm'),
    ev('resetProgress'),
  );
  assert.equal(noTitle.title, true, 'smazání postupu vrací titul i po jeho skrytí');
});

test('1.2 řádek 2: Domov, podržet kdekoli → nabíjení → puštění → Let; titul zmizí při prvním stisku', () => {
  const h = home();
  const c = transition(h, ev('press', { t: 5 }));
  assert.equal(c.screen, 'home');
  assert.equal(c.charging, true);
  assert.equal(c.title, false);
  assert.equal(transition(c, ev('release', { heldMs: HOLD_MIN_MS })).screen, 'flight');
  assert.equal(
    transition(c, ev('release', { heldMs: HOLD_MIN_MS - 1 })).screen,
    'home',
    'ťuknutí nehází',
  );
  assert.equal(transition(c, ev('release', { heldMs: 10 })).title, false, 'titul se nevrátí');
});

test('1.2 řádek 3: Domov, ☰ / Esc / zpět → panel Menu', () => {
  assert.deepEqual(view(transition(home(), open('menu'))), ['home', 'menu']);
  assert.deepEqual(view(back(home())), ['home', 'menu']);
  assert.deepEqual(view(back(homeNoTitle())), ['home', 'menu']);
  assert.equal(loopRuns(back(home())), false);
});

test('1.2 řádek 4: titul, tlačítka Dílna / Atlas / Nastavení → panel nad Domovem', () => {
  for (const p of ['workshop', 'atlas', 'settings']) {
    const s = transition(home(), open(p));
    assert.deepEqual(view(s), ['home', p]);
    assert.deepEqual(view(transition(s, ev('close'))), ['home', ''], 'zavření vrátí Domov');
    assert.deepEqual(view(back(s)), ['home', '']);
  }
});

test('1.2 řádek 5: Let, ❚❚ / Esc / zpět / skrytí okna → panel Pauza', () => {
  assert.deepEqual(view(transition(flight(), open('pause'))), ['flight', 'pause']);
  assert.deepEqual(view(back(flight())), ['flight', 'pause']);
  assert.deepEqual(view(transition(flight(), ev('hidden'))), ['flight', 'pause']);
  assert.equal(loopRuns(back(flight())), false, 'fyzika stojí');
});

test('1.2 řádek 6: Pauza, Pokračovat → Let', () => {
  const p = back(flight());
  assert.deepEqual(view(transition(p, ev('close'))), ['flight', '']);
  assert.equal(loopRuns(transition(p, ev('close'))), true);
  assert.deepEqual(view(back(p)), ['flight', ''], 'zpět v Pauze také pokračuje');
});

test('1.2 řádek 7: Pauza, Zrušit hod → Domov + otevřený panel Menu; cancelThrow()', () => {
  const p = back(flight());
  assert.deepEqual(view(cancelThrow(p)), ['home', 'menu']);
  assert.deepEqual(view(transition(p, ev('cancelThrow'))), ['home', 'menu']);
  assert.equal(cancelThrow(p).title, false);
  const f = flight();
  assert.equal(cancelThrow(f), f);
});

test('1.2 řádek 8: Let, přistání → Výsledek', () => {
  assert.deepEqual(view(result()), ['result', '']);
  assert.equal(result().shownAt, 1000);
  const f = back(flight());
  assert.equal(transition(f, ev('landed', { t: 1 })), f, 'pod Pauzou se nepřistává');
});

test('1.2 řádek 9: Výsledek, Throw again / Enter → Domov bez titulu', () => {
  const s = transition(result(), ev('throwAgain'));
  assert.deepEqual(view(s), ['home', '']);
  assert.equal(s.title, false);
});

test('1.2 řádek 10: Výsledek, Dílna / Atlas → panel nad výsledkem, po zavření je karta vidět', () => {
  for (const p of ['workshop', 'atlas']) {
    const s = transition(result(), open(p));
    assert.deepEqual(view(s), ['result', p]);
    assert.deepEqual(view(transition(s, ev('close'))), ['result', '']);
  }
});

test('1.2 řádek 11: Výsledek, ☰ / Esc → panel Menu; Pokračovat vrátí kartu', () => {
  assert.deepEqual(view(back(result())), ['result', 'menu']);
  assert.deepEqual(view(transition(result(), open('menu'))), ['result', 'menu']);
  assert.deepEqual(view(transition(back(result()), ev('close'))), ['result', '']);
});

test('Zásobník panelů: menu nahradí Dílna/Atlas, settings a confirm se vrství', () => {
  const m = back(home());
  assert.deepEqual(view(transition(m, open('workshop'))), ['home', 'workshop']);
  assert.deepEqual(view(transition(m, open('atlas'))), ['home', 'atlas']);
  assert.deepEqual(view(transition(m, open('settings'))), ['home', 'menu>settings']);
  assert.deepEqual(view(transition(back(flight()), open('settings'))), [
    'flight',
    'pause>settings',
  ]);
  const c = run(home(), open('settings'), open('confirm'));
  assert.deepEqual(view(c), ['home', 'settings>confirm']);
  assert.deepEqual(view(back(c)), ['home', 'settings']);
});

test('Z Dílny vede cesta na Atlas (06, 15. 10.): Atlas nahradí Dílnu', () => {
  assert.deepEqual(view(run(home(), open('workshop'), open('atlas'))), ['home', 'atlas']);
  assert.deepEqual(view(run(result(), open('workshop'), open('atlas'))), ['result', 'atlas']);
});

test('Neplatné otevření panelu nemění stav', () => {
  const bad = [
    [initialState(), 'menu'],
    [flight(), 'menu'],
    [flight(), 'workshop'],
    [flight(), 'atlas'],
    [flight(), 'settings'],
    [home(), 'pause'],
    [result(), 'pause'],
    [result(), 'settings'],
    [home(), 'confirm'],
    [run(home(), open('workshop')), 'settings'],
    [run(home(), open('workshop')), 'menu'],
    [run(home(), open('atlas')), 'workshop'],
    [run(home(), open('menu')), 'pause'],
    [run(home(), open('menu')), 'menu'],
    [run(home(), open('settings')), 'workshop'],
    [run(home(), open('settings')), 'menu'],
    [back(flight()), 'workshop'],
    [back(flight()), 'menu'],
    [home(), 'nonsense'],
  ];
  for (const [s, p] of bad)
    assert.equal(transition(s, open(p)), s, `${s.screen}/${s.panels} + ${p}`);
});

test('Neplatné události nemění stav (identita objektu)', () => {
  const l = initialState();
  for (const e of [
    ev('press', { t: 0 }),
    ev('release', { heldMs: 999 }),
    ev('back'),
    ev('close'),
    ev('throwAgain'),
    ev('landed', { t: 1 }),
    ev('cancelThrow'),
    ev('hidden'),
    ev('resetProgress'),
    ev('holdCancel'),
    ev('xyz'),
  ])
    assert.equal(transition(l, e), l, e.type);
  const h = home();
  for (const e of [
    ev('close'),
    ev('cancelThrow'),
    ev('landed', { t: 1 }),
    ev('throwAgain'),
    ev('resetProgress'),
    ev('release', { heldMs: 999 }),
    ev('loaded'),
    ev('holdCancel'),
  ])
    assert.equal(transition(h, e), h, e.type);
  const f = flight();
  for (const e of [
    ev('press', { t: 5000 }),
    ev('release', { heldMs: 999 }),
    ev('throwAgain'),
    ev('close'),
    ev('loaded'),
    ev('resetProgress'),
  ])
    assert.equal(transition(f, e), f, e.type);
  const r = result();
  for (const e of [
    ev('release', { heldMs: 999 }),
    ev('cancelThrow'),
    ev('landed', { t: 1 }),
    ev('close'),
    ev('loaded'),
  ])
    assert.equal(transition(r, e), r, e.type);
  const m = back(home());
  for (const e of [
    ev('press', { t: 0 }),
    ev('throwAgain'),
    ev('cancelThrow'),
    ev('landed', { t: 1 }),
    ev('resetProgress'),
  ])
    assert.equal(transition(m, e), m, e.type);
  const p = back(flight());
  for (const e of [ev('press', { t: 0 }), ev('hidden'), ev('landed', { t: 1 })])
    assert.equal(transition(p, e), p, e.type);
});

test('Stav je neměnný (vstup se nezmění, výsledek je nový objekt)', () => {
  const h = home();
  const snap = JSON.stringify(h);
  const n = transition(h, open('menu'));
  assert.equal(JSON.stringify(h), snap);
  assert.notEqual(n, h);
  assert.deepEqual(h.panels, []);
});

test('loopRuns: jen prázdný zásobník na Domově nebo za letu', () => {
  assert.equal(loopRuns(initialState()), false);
  assert.equal(loopRuns(home()), true);
  assert.equal(loopRuns(flight()), true);
  assert.equal(loopRuns(result()), false);
  assert.equal(loopRuns(result(true)), false);
  assert.equal(loopRuns(back(home())), false);
  assert.equal(loopRuns(run(home(), open('settings'))), false);
  assert.equal(loopRuns(back(flight())), false);
});

test('06 (15. 10.) bod 11: z titulu podržet kdekoli = hod, bez obrazovky menu', () => {
  assert.ok(!(initialState().screen === 'menu'));
  const s = home();
  assert.equal(s.title, true);
  assert.equal(run(s, ev('press', { t: 0 }), ev('release', { heldMs: 300 })).screen, 'flight');
});

test('06 bod 15: titul se po „Throw again“ ani po návratu z panelu nevrací; po Dílně/Atlasu z Domova beze změny', () => {
  const s = run(result(), ev('throwAgain'));
  assert.equal(s.title, false);
  const w = run(homeNoTitle(), open('workshop'), ev('close'));
  assert.equal(w.title, false);
  assert.equal(
    run(home(), open('atlas'), ev('close')).title,
    true,
    'titul trvá, dokud hráč nepodrží',
  );
  assert.equal(
    run(
      s,
      ev('press', { t: 0 }),
      ev('release', { heldMs: 400 }),
      ev('landed', { t: 9 }),
      ev('throwAgain'),
    ).title,
    false,
  );
});

test('06 (15. 10.) bod 1: tlačítko na výsledku otevře Dílnu, z Dílny vede cesta na Atlas', () => {
  assert.deepEqual(view(run(result(), open('workshop'))), ['result', 'workshop']);
  assert.deepEqual(view(run(result(), open('workshop'), open('atlas'))), ['result', 'atlas']);
});

test('K1: zámek 400 ms po zobrazení karty (čas je vstup přechodu)', () => {
  const r = result(); // shownAt = 1000
  assert.equal(transition(r, ev('press', { t: 1000 })), r);
  assert.equal(transition(r, ev('press', { t: 1000 + LOCK_MS - 1 })), r, '399 ms ignoruje');
  const s = transition(r, ev('press', { t: 1000 + LOCK_MS }));
  assert.deepEqual(view(s), ['home', '']);
  assert.equal(s.charging, true);
  assert.equal(s.title, false);
  assert.equal(
    transition(s, ev('release', { heldMs: 200 })).screen,
    'flight',
    'z výsledku podržet kdekoli = další hod',
  );
  assert.equal(
    transition(s, ev('release', { heldMs: 50 })).screen,
    'home',
    'krátké ťuknutí zůstane v míření',
  );
});

test('K1: pod panelem (Menu nad výsledkem) držení nehází', () => {
  const m = back(result());
  assert.equal(transition(m, ev('press', { t: 99999 })), m);
});

test('Vstup: pointercancel/blur/visibilitychange ukončí držení bez hodu', () => {
  const c = transition(home(), ev('press', { t: 0 }));
  assert.equal(transition(c, ev('holdCancel')).charging, false);
  assert.equal(transition(c, ev('hidden')).charging, false);
  assert.equal(
    transition(transition(c, ev('holdCancel')), ev('release', { heldMs: 999 })).screen,
    'home',
  );
  assert.equal(transition(c, open('menu')).charging, false, 'otevření panelu ruší držení');
  assert.equal(transition(c, ev('back')).charging, false);
});

test('K9: konec kapitoly → hod dál (Keep throwing, nebo podržet) i Menu', () => {
  const c = result(true);
  assert.equal(c.screen, 'chapter');
  assert.deepEqual(view(transition(c, ev('throwAgain'))), ['home', '']);
  assert.equal(transition(c, ev('throwAgain')).title, false);
  assert.deepEqual(view(transition(c, open('menu'))), ['chapter', 'menu']);
  assert.deepEqual(view(back(c)), ['chapter', 'menu']);
  assert.deepEqual(view(transition(back(c), ev('close'))), ['chapter', '']);
  assert.equal(transition(c, ev('press', { t: 1100 })), c, 'zámek platí i na kartě kapitoly');
  assert.equal(transition(c, ev('press', { t: 1400 })).screen, 'home');
  assert.equal(transition(c, open('workshop')), c);
});
