// 2D UI vrstva nad 3D scénou (canvas #game, logické 640×360 přes setTransform). Čisté vůči kontextu: dostane ctx 2D, testy s falešným ctx.
// Vlastní R2. QTE kruh 1:1 z render.js, štítky, částice (sx = px + (wx − cam − px)·k), popupy, záblesk, rychlostní čáry, mířidla, uiScale pro mobil.
const todo=n=>{throw new Error('render3d: '+n+' zatím neimplementováno');};
export function drawUi(c,plan,visual){return todo('drawUi');}
export function drawQte(c,qte,view){return todo('drawQte');}
export function drawAim(c,aim,view){return todo('drawAim');}
export const uiScale=cssWidth=>todo('uiScale');
