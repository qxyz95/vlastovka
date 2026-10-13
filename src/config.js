export const VERSION = '0.4.0';
export const DT = 1 / 60;
export const PRICES = [10, 30, 55, 85, 120];
export const BRANCHES = [
  {id:'power', name:'Síla hodu', icon:'↗', effect:'Počáteční rychlost +10 % za úroveň.'},
  {id:'paper', name:'Kvalita papíru', icon:'▱', effect:'Odpor papíru −9 % za úroveň. Hmotnost se nemění.'},
  {id:'fold', name:'Přehyby a vyvážení', icon:'⌁', effect:'Odpor seřízení −8 % za úroveň; lepší klouzavost.'},
];
export const MODELS = {
  dart:{name:'Šipka', speed:18, angle:0.16, cl:0.24, cd:0.055, area:0.0003, mass:0.02},
  glider:{name:'Kluzák', speed:15.75, angle:0.22, cl:0.34, cd:0.052, area:0.00035, mass:0.02},
};
export function parameters(model, levels) {
  const m = MODELS[model];
  return {...m, speed:m.speed*(1+0.1*levels.power), cd:m.cd*(1-0.09*levels.paper)*(1-0.08*levels.fold), gravity:1.8, rho:1.225};
}



