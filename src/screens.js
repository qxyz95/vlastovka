// Automat obrazovek (U3, research/plan-hratelnost/02-ux.md §1.2). Čisté funkce bez DOM, času a globálního stavu:
// čas vstupuje jen jako pole události (`t`, ms), stav je neměnný. Neplatná událost vrátí tentýž objekt stavu.
export const LOCK_MS = 400; // K1: zámek vstupu po zobrazení karty výsledku/kapitoly
export const HOLD_MIN_MS = 150; // K1/02-ux §9.2: kratší držení je ťuknutí, ne hod
export const SCREENS = ['loading', 'home', 'flight', 'result', 'chapter'];
export const PANELS = ['menu', 'pause', 'workshop', 'atlas', 'settings', 'confirm'];
const CARDS = ['result', 'chapter']; // karty po přistání (K9: chapter nahrazuje result na hranici čtvrti)

export const initialState = () => ({
  screen: 'loading',
  title: false,
  panels: [],
  charging: false,
  shownAt: null,
});

const top = s => s.panels[s.panels.length - 1];
const set = (s, patch) => ({ ...s, ...patch });
const withPanels = (s, panels) => set(s, { panels, charging: false });
const isCard = s => CARDS.includes(s.screen);

// Smí se panel otevřít nad stavem? Vrací nové pole panelů, nebo null (neplatné). Pravidla zásobníku: 02-ux §1.2.
function pushPanel(s, p) {
  const t = top(s),
    n = s.panels.length,
    sc = s.screen;
  const base = s.panels.slice(0, -1);
  switch (p) {
    case 'menu':
      return n === 0 && (sc === 'home' || isCard(s)) ? [p] : null;
    case 'pause':
      return n === 0 && sc === 'flight' ? [p] : null;
    case 'workshop':
      if (n === 0) return sc === 'home' || sc === 'result' ? [p] : null;
      return t === 'menu' ? [...base, p] : null; // z Menu Menu nahradí
    case 'atlas':
      if (n === 0) return sc === 'home' || sc === 'result' ? [p] : null;
      return t === 'menu' || t === 'workshop' ? [...base, p] : null; // z Dílny vede cesta na Atlas (06, 15. 10.)
    case 'settings':
      if (n === 0) return sc === 'home' ? [p] : null;
      return t === 'menu' || t === 'pause' ? [...s.panels, p] : null;
    case 'confirm':
      return t === 'settings' ? [...s.panels, p] : null;
    default:
      return null;
  }
}

// `charging`: držení běží (Domov). Stisk na kartě po zámku = rovnou Domov bez titulu + nabíjení (K1, přestřih na míření).
function press(s, e) {
  if (s.panels.length) return s;
  if (s.screen === 'home') return s.charging ? s : set(s, { title: false, charging: true });
  if (isCard(s))
    return e.t - s.shownAt >= LOCK_MS
      ? set(s, { screen: 'home', title: false, charging: true, shownAt: null })
      : s;
  return s;
}

function release(s, e) {
  if (!s.charging || s.screen !== 'home' || s.panels.length) return s;
  return e.heldMs >= HOLD_MIN_MS
    ? set(s, { screen: 'flight', charging: false })
    : set(s, { charging: false });
}

function closeTop(s) {
  if (!s.panels.length) return s;
  return set(s, { panels: s.panels.slice(0, -1) });
}

function goBack(s) {
  if (s.panels.length) return closeTop(s);
  if (s.screen === 'flight') return withPanels(s, ['pause']);
  if (s.screen === 'home' || isCard(s)) return withPanels(s, ['menu']);
  return s;
}

export function transition(s, e) {
  switch (e.type) {
    case 'loaded': // také po smazání postupu: titul se ukáže znovu
      return s.screen === 'loading' ? set(s, { screen: 'home', title: true }) : s;
    case 'press':
      return press(s, e);
    case 'release':
      return release(s, e);
    case 'holdCancel': // pointercancel, lostpointercapture, blur: žádné zaseknuté držení
      return s.charging ? set(s, { charging: false }) : s;
    case 'hidden': // visibilitychange: za letu pauza, jinak jen konec držení
      if (s.screen === 'flight' && !s.panels.length) return withPanels(s, ['pause']);
      return s.charging ? set(s, { charging: false }) : s;
    case 'open': {
      const p = pushPanel(s, e.panel);
      return p ? withPanels(s, p) : s;
    }
    case 'close': // Pokračovat / zavřít horní panel
      return closeTop(s);
    case 'back':
      return goBack(s);
    case 'cancelThrow': // Pauza → Zrušit hod: hod se nezapočítá, Domov s Menu (06 B2)
      return s.screen === 'flight' && top(s) === 'pause'
        ? set(s, { screen: 'home', title: false, panels: ['menu'], charging: false })
        : s;
    case 'landed': // přistání; `chapter: true` na hranici čtvrti (K9)
      return s.screen === 'flight' && !s.panels.length
        ? set(s, { screen: e.chapter ? 'chapter' : 'result', shownAt: e.t })
        : s;
    case 'throwAgain': // Throw again / Enter / Keep throwing: Domov bez titulu
      return isCard(s) && !s.panels.length
        ? set(s, { screen: 'home', title: false, shownAt: null })
        : s;
    case 'resetProgress': // potvrzené smazání postupu → úvodní stav s titulem
      return top(s) === 'confirm' ? set(initialState(), { screen: 'home', title: true }) : s;
    default:
      return s;
  }
}

export const back = s => transition(s, { type: 'back' });
export const cancelThrow = s => transition(s, { type: 'cancelThrow' });
// Běží fyzika/nabíjení? Jen s prázdným zásobníkem na Domově nebo za letu (02-ux §1.2).
export const loopRuns = s =>
  s.panels.length === 0 && (s.screen === 'home' || s.screen === 'flight');
