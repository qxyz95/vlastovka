// The three music candidates for the blind comparison (research/hudba/03 F.6): B Paper Lo-fi, E Above the City and
// G Diorama (the recommended direction). Data and bar generators only, no Web Audio.
import B from './b-paper-lofi.js';
import E from './e-above-the-city.js';
import G from './diorama.js';
export const TRACKS = { B, E, G };
export const TRACK_IDS = Object.keys(TRACKS);
