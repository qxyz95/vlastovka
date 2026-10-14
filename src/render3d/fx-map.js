// Převod stavu juice.js na pohled 3D/UI (čisté). Vlastní R2. fxMap(fx,view,{reduced}) → {shake:[dx,dy],flash,speedLines,particles,popups,trail};
// toScreen(wx,wy,view) → [sx,sy] podle smlouvy view(f) v ./index.js. Reduced motion → nulový otřes, záblesk a pohyb.
const todo=n=>{throw new Error('render3d: '+n+' zatím neimplementováno');};
export function fxMap(fx,view,opts={}){return todo('fxMap');}
export function toScreen(wx,wy,view){return todo('toScreen');}
