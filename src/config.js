export const VERSION = '0.6.0';
export const DT = 1 / 60;
export const PRICES = [25, 75, 140, 215, 300];
export const GRAVITY = 1.8;
// Each branch changes one legible thing: launch speed, glide ratio, or forgiveness.
export const UPGRADE = {power:0.12, paper:0.2, steady:0.1, window:0.1};
export const BRANCHES = [
  {id:'power', name:'Síla hodu', icon:'↗', effect:'Rychlost výhozu +12 % za úroveň. Výš a dál při každém hodu.'},
  {id:'paper', name:'Kvalita papíru', icon:'▱', effect:'Klouzavost +20 % za úroveň. Z každého metru výšky uletí víc.'},
  {id:'fold', name:'Přehyby a vyvážení', icon:'⌁', effect:'Odpouští nepřesný hod (+10 % chybějící síly za úroveň) a rozšiřuje okna událostí o 10 %.'},
];
// Arcade flight: ballistic climb, then a glide limited by the glide ratio.
// Launching steeper than `ideal` (degrees) loses speed, so every model has its own best angle.
// `qte` scales how much the model gains from gusts and pigeons.
export const MODELS = {
  dart:{name:'Šipka', speed:20, glide:3.2, drag:0.12, cruise:11, ideal:18, qte:1},
  glider:{name:'Kluzák', speed:13, glide:5.4, drag:0.12, cruise:8, ideal:28, qte:1.15},
};
export const STEEP_PENALTY = 0.0015;
export function parameters(model, levels) {
  const m = MODELS[model];
  return {...m, speed:m.speed*(1+UPGRADE.power*levels.power), glide:m.glide*(1+UPGRADE.paper*levels.paper),
    steady:UPGRADE.steady*levels.fold, window:1+UPGRADE.window*levels.fold, gravity:GRAVITY};
}
