export const VERSION = '0.6.1';
export const DT = 1 / 60;
export const GRAVITY = 1.8;
// Arcade flight: ballistic climb, then a glide limited by the glide ratio.
// Launching steeper than `ideal` (degrees) loses speed, so every model has its own best angle.
// `qte` scales how much the model gains from gusts and pigeons. The flight itself is src/flight.js with the numbers
// of src/progression-numbers.js (Dart from here, Glider retuned there; the Glider here mirrors it for the texts and tests).
export const MODELS = {
  dart: { speed: 20, glide: 3.2, drag: 0.12, cruise: 11, ideal: 18, qte: 1 },
  glider: { speed: 14, glide: 4, drag: 0.12, cruise: 11, ideal: 30, qte: 1.15 },
};
export const STEEP_PENALTY = 0.0015;
// QTE events never start below this height (m), same as PROGRESSION.physics.eventMinY.
export const EVENT_MIN_Y = 8;
// Steam, thermal, lantern (drone) and shooting star stay out of the game until C2 gives them a look and inputs (M2).
export const NEW_EVENTS = false;
