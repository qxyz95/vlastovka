// Atlas postcards (G2, bible 05 kap. 10). Pure descriptions, no DOM: atlas-ui.js turns them into SVG.
// District 1 places use 3D screenshots (assets/atlas/<placeId>.webp); districts 2-4 show a cut-paper silhouette of the landmark
// until their models exist (research/bonusy/06-rozhodnuti.md, 15. 10. bod 5). Silhouettes are viewBox 0 0 160 100, ground at y=80.
// tone: far (pale back layer) | main (district colour, dark) | accent (warm highlight) | light (paper white) | ground.
export const VIEWBOX = '0 0 160 100';
export const TONES = ['far', 'main', 'accent', 'light', 'ground'];
export const IMAGE_PLACES = ['roofs', 'market', 'gardens', 'railway'];
export const imageUrl = placeId =>
  IMAGE_PLACES.includes(placeId) ? `assets/atlas/${placeId}.webp` : null;
export const altKey = placeId => `atlas.postcard.${placeId}.alt`;

const S = (tag, tone, attrs) => ({ tag, tone, attrs });
const poly = (tone, pts) => S('path', tone, { d: `M${pts.join('L')}Z` });
const rect = (tone, x, y, width, height) => S('rect', tone, { x, y, width, height });
const circle = (tone, cx, cy, r) => S('circle', tone, { cx, cy, r });
const ground = [rect('ground', 0, 80, 160, 20)];
const hills = poly('far', [
  '0,80',
  '0,58',
  '30,46',
  '60,60',
  '100,42',
  '135,58',
  '160,50',
  '160,80',
]);

const turbine = (x, h) => [
  rect('main', x - 1.2, 80 - h, 2.4, h),
  poly('light', [`${x},${80 - h}`, `${x - 3},${80 - h - 20}`, `${x + 1},${80 - h - 20}`]),
  poly('light', [`${x},${80 - h}`, `${x + 17},${80 - h + 8}`, `${x + 15},${80 - h + 11}`]),
  poly('light', [`${x},${80 - h}`, `${x - 14},${80 - h + 11}`, `${x - 16},${80 - h + 8}`]),
  circle('accent', x, 80 - h, 2.6),
];

// kind = key of ROUTE in scenes.js (place.<kind>)
export const SHAPES = {
  roofs: [
    hills,
    poly('main', ['14,80', '14,52', '34,34', '54,52', '54,80']),
    poly('accent', ['50,80', '50,46', '74,28', '98,46', '98,80']),
    poly('main', ['94,80', '94,56', '114,42', '134,56', '134,80']),
    rect('light', 28, 60, 8, 10),
    rect('light', 68, 54, 10, 12),
  ],
  market: [
    hills,
    rect('main', 12, 44, 30, 36),
    rect('far', 106, 40, 36, 40),
    poly('accent', ['34,80', '34,60', '80,60', '126,60', '126,80']),
    poly('light', ['38,60', '60,50', '80,60']),
    poly('accent', ['80,60', '100,50', '122,60']),
    S('path', 'light', {
      d: 'M12 36L50 40L88 36L126 40L150 36',
      fill: 'none',
      'stroke-width': 1.6,
    }),
  ],
  garden: [
    hills,
    rect('main', 98, 52, 40, 28),
    poly('accent', ['94,52', '118,36', '142,52']),
    circle('main', 30, 52, 16),
    rect('main', 28.5, 64, 3, 16),
    circle('light', 62, 58, 11),
    rect('main', 60.8, 66, 2.4, 14),
  ],
  rail: [
    hills,
    rect('main', 8, 62, 44, 14),
    rect('accent', 56, 62, 44, 14),
    rect('main', 104, 62, 44, 14),
    rect('light', 14, 66, 8, 5),
    rect('light', 62, 66, 8, 5),
    rect('light', 110, 66, 8, 5),
    rect('main', 0, 76, 160, 3),
  ],
  warehouse: [
    hills,
    poly('main', [
      '16,80',
      '16,48',
      '36,34',
      '36,48',
      '56,34',
      '56,48',
      '76,34',
      '76,48',
      '96,34',
      '96,80',
    ]),
    rect('accent', 108, 24, 12, 56),
    rect('main', 106, 22, 16, 5),
    rect('light', 26, 62, 14, 18),
  ],
  cranes: [
    hills,
    rect('main', 40, 14, 5, 66),
    rect('main', 10, 14, 90, 5),
    rect('accent', 100, 14, 18, 5),
    rect('light', 14, 19, 1.4, 24),
    rect('main', 12, 43, 6, 5),
    poly('far', ['110,80', '110,56', '150,56', '150,80']),
    rect('accent', 118, 44, 24, 12),
  ],
  bridge: [
    hills,
    rect('main', 10, 12, 5, 68),
    rect('main', 145, 12, 5, 68),
    S('path', 'main', { d: 'M12 14Q80 70 148 14', fill: 'none', 'stroke-width': 2 }),
    rect('accent', 0, 56, 160, 5),
    ...[34, 52, 70, 88, 106, 124].map(x => rect('light', x, 40 + Math.abs(x - 80) * 0.15, 1.2, 16)),
  ],
  lighthouse: [
    hills,
    poly('light', ['66,80', '72,30', '88,30', '94,80']),
    poly('accent', ['70,56', '90,56', '92,66', '68,66']),
    rect('main', 70, 22, 20, 8),
    poly('main', ['68,22', '80,10', '92,22']),
    poly('accent', ['92,24', '160,6', '160,40', '92,28']),
  ],
  // grain silo and barn above the field strips (F2 B12)
  fields: [
    hills,
    poly('accent', ['0,80', '0,70', '160,64', '160,80']),
    poly('ground', ['0,80', '0,75', '160,71', '160,80']),
    rect('main', 106, 30, 16, 40),
    S('path', 'main', { d: 'M106 30A8 8 0 0 1 122 30Z' }),
    poly('accent', ['56,72', '56,52', '74,40', '92,52', '92,72']),
    rect('far', 68, 58, 12, 14),
  ],
  turbines: [hills, ...turbine(34, 46), ...turbine(84, 56), ...turbine(130, 40)],
  peaks: [
    poly('far', ['0,80', '30,40', '60,80']),
    poly('main', ['30,80', '82,16', '134,80']),
    poly('light', ['82,16', '68,36', '78,32', '82,38', '88,32', '97,36']),
    poly('accent', ['110,80', '136,42', '160,80']),
  ],
  observatory: [
    hills,
    rect('main', 54, 52, 52, 28),
    S('path', 'main', { d: 'M54 52A26 26 0 0 1 106 52Z' }),
    poly('accent', ['78,26', '84,26', '98,6', '92,4']),
    rect('light', 76, 62, 8, 18),
    circle('light', 20, 20, 3),
    circle('light', 136, 14, 2),
  ],
  gate: [
    hills,
    rect('main', 24, 20, 14, 60),
    rect('main', 122, 20, 14, 60),
    S('path', 'main', { d: 'M24 34Q80 -6 136 34L136 44Q80 4 24 44Z' }),
    rect('accent', 70, 8, 20, 10),
    rect('far', 44, 62, 72, 18),
  ],
  terraces: [
    poly('far', ['0,80', '0,40', '160,30', '160,80']),
    rect('main', 8, 62, 144, 18),
    rect('accent', 24, 46, 112, 16),
    rect('main', 44, 30, 72, 16),
    rect('light', 62, 14, 36, 16),
    rect('accent', 76, 6, 8, 8),
    // round trees on the terrace edges and a railing on the top terrace (F2 B12)
    circle('accent', 16, 57, 5),
    circle('accent', 34, 41, 5),
    circle('accent', 126, 41, 5),
    ...['M62 14V10H76V14', 'M84 14V10H98V14'].map(d =>
      S('path', 'main', { d, fill: 'none', 'stroke-width': 1 }),
    ),
  ],
  tower: [
    hills,
    rect('main', 62, 36, 36, 44),
    rect('main', 68, 14, 24, 22),
    poly('accent', ['64,14', '80,-4', '96,14']),
    circle('light', 80, 26, 8),
    S('path', 'main', { d: 'M80 21V26H84', fill: 'none', 'stroke-width': 1.6 }),
    rect('far', 24, 56, 32, 24),
    rect('far', 104, 52, 32, 28),
  ],
  // Rooftop Harbor: roofs with a mooring mast and a lantern airship, a lantern string below (F2 B12)
  port: [
    hills,
    poly('main', ['0,80', '0,60', '20,48', '40,60', '40,80']),
    poly('main', ['36,80', '36,54', '62,40', '88,54', '88,80']),
    poly('main', ['84,80', '84,62', '104,50', '124,62', '124,80']),
    rect('main', 61, 18, 2.4, 24),
    S('path', 'accent', { d: 'M66 22A30 9 0 0 1 126 22A30 9 0 0 1 66 22Z' }),
    rect('main', 90, 31, 12, 4),
    S('path', 'main', { d: 'M63 20L70 22', fill: 'none', 'stroke-width': 1 }),
    ...[10, 26, 50, 74].map(x => circle('accent', x, 58, 2)),
  ],
};

// Shape description for a place kind; unknown kind falls back to the district-neutral skyline.
export const FALLBACK = [hills, rect('main', 40, 44, 30, 36), rect('accent', 76, 56, 36, 24)];
export const silhouette = kind => ({
  viewBox: VIEWBOX,
  shapes: [...(SHAPES[kind] ?? FALLBACK), ...ground],
});
