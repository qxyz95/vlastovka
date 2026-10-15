// Vývojářské pomůcky jen za ?dev=1 (rozhodnutí 06, 15. 10.): tlačítko „+1000 mincí“ v Nastavení. Jen mince, rekord se nepřidává.
export const DEV_COINS = 1000;

export const devEnabled = search => new URLSearchParams(search).get('dev') === '1';

export function addDevCoins(p, amount = DEV_COINS) {
  p.coins = Math.min(Number.MAX_SAFE_INTEGER, p.coins + amount);
  return p;
}
