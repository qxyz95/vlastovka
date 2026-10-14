export const VERSION = '0.6.1';
export const DT = 1 / 60;
export const PRICES = [35, 105, 195, 300, 420];
export const GRAVITY = 1.8;
// Each branch changes one legible thing: launch speed, glide ratio, or forgiveness.
export const UPGRADE = {power:0.12, paper:0.2, steady:0.15, window:0.1, qte:0.12};
export const BRANCHES = [
// Names and effect texts live in src/locales (branch.<id>, branch.<id>.effect); the effect numbers come from UPGRADE.
  {id:'power', icon:'↗'},
  {id:'paper', icon:'▱'},
  {id:'fold', icon:'⌁'},
];
// Arcade flight: ballistic climb, then a glide limited by the glide ratio.
// Launching steeper than `ideal` (degrees) loses speed, so every model has its own best angle.
// `qte` scales how much the model gains from gusts and pigeons.
export const MODELS = {
  dart:{speed:20, glide:3.2, drag:0.12, cruise:11, ideal:18, qte:1},
  glider:{speed:13, glide:5.4, drag:0.12, cruise:8, ideal:28, qte:1.15},
};
export const STEEP_PENALTY = 0.0015;
// QTE events never start below this height (m), same as P.physics.eventMinY in the progression simulator.
export const EVENT_MIN_Y = 8;
export function parameters(model, levels) {
  const m = MODELS[model];
  return {...m, speed:m.speed*(1+UPGRADE.power*levels.power), glide:m.glide*(1+UPGRADE.paper*levels.paper),
    steady:UPGRADE.steady*levels.fold, window:1+UPGRADE.window*levels.fold, qte:m.qte*(1+UPGRADE.qte*levels.fold), gravity:GRAVITY};
}
