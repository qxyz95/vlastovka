import { DT, parameters, PRICES, STEEP_PENALTY } from './config.js';
import { random } from './random.js';
import { AIM_MIN, AIM_MAX, throwSettings } from './throw.js';
export { random } from './random.js';
import { createEvents, updateEvents, eventInput } from './events.js';
export { activeEvent, eventInput } from './events.js';
export function fresh() {
  return {
    version: 4,
    coins: 0,
    levels: { power: 0, paper: 0, fold: 0 },
    model: 'dart',
    best: 0,
    completed: false,
    attempts: 0,
    atlas: {
      levels: {},
      seen: [],
      pending: [],
      lines: {},
      pockets: { owned: 0, slots: [null, null] },
      nodes: { nightRoute: false },
      finished: false,
      hintOpens: 0,
      undo: null,
    },
  };
}
// Upgrades are shared by both models; the glider only needs to be unlocked.
export function buy(p, branch, level) {
  const levels = p.levels;
  if (
    !Object.hasOwn(levels, branch) ||
    level !== levels[branch] + 1 ||
    level > 5 ||
    p.coins < PRICES[level - 1]
  )
    return false;
  p.coins -= PRICES[level - 1];
  levels[branch] = level;
  return true;
}
// launch: {angle (rad), power 0..1} from throwSettings; null means the model's ideal angle at 75 % power.
export function createFlight(
  model = 'dart',
  levels = fresh().levels,
  seed = 1,
  wind = { x: 0, y: 0 },
  launch = null,
) {
  const p = parameters(model, levels),
    angle = launch?.angle ?? (p.ideal * Math.PI) / 180,
    power = launch?.power ?? 0.75;
  const steady = power + (1 - power) * p.steady,
    over = Math.max(0, (angle * 180) / Math.PI - p.ideal);
  const speed = p.speed * (0.7 + 0.4 * steady) * Math.max(0.2, 1 - STEEP_PENALTY * over * over);
  return {
    x: 0,
    y: 12,
    startX: 0,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
    t: 0,
    p,
    model,
    wind,
    launch,
    landed: false,
    settled: false,
    carry: 0,
    seed,
    events: createEvents(seed, seed === 1),
    feedback: '',
  };
}
export function action(f) {
  return eventInput(f, 'down');
}
export function step(f, dt = DT) {
  if (f.landed) return;
  const old = { x: f.x, y: f.y, vx: f.vx, vy: f.vy };
  if (f.carry > 0) {
    const h = Math.min(dt, f.carry);
    f.x += f.vx * h;
    f.y += f.vy * h;
    f.carry -= h;
    if (dt - h > 1e-10) integrate(f, dt - h);
  } else integrate(f, dt);
  f.t += dt;
  if (f.y <= 0) {
    const alpha = old.y / (old.y - f.y);
    f.x = old.x + (f.x - old.x) * alpha;
    f.vx = old.vx + (f.vx - old.vx) * alpha;
    f.vy = old.vy + (f.vy - old.vy) * alpha;
    f.t -= dt * (1 - alpha);
    f.y = 0;
    f.landed = true;
  }
  updateEvents(f);
}
// Arcade glide: horizontal speed relaxes towards cruise speed, gravity pulls down,
// and the sink rate never exceeds speed / glide ratio. Wind shifts air-relative speed and lifts.
function integrate(f, dt) {
  const p = f.p,
    air = f.vx - f.wind.x;
  f.vx = f.wind.x + p.cruise + (air - p.cruise) * Math.exp(-p.drag * dt);
  f.vy -= p.gravity * dt;
  const sink = -Math.max(0, f.vx - f.wind.x) / p.glide;
  if (f.vy < sink) f.vy = sink;
  f.x += f.vx * dt;
  f.y += (f.vy + f.wind.y) * dt;
}
export function reward(f) {
  return 10 + Math.floor(Math.max(0, f.x - f.startX) / 10);
}
export function settle(p, f) {
  if (!f.landed || f.settled) return false;
  if (!Number.isFinite(f.x)) f.x = f.startX; // NaN would be saved as null and wipe the whole save
  f.settled = true;
  p.coins += reward(f);
  p.best = Math.max(p.best, f.x - f.startX);
  p.completed = p.completed || p.best >= 500;
  p.attempts++;
  return true;
}
// Bot player for tests and balance runs. profile = hit probability, options.perfectRate = share of perfect hits.
export function simulate(model, levels, seed = 1, profile = 0, dt = DT, options = {}) {
  const f = createFlight(model, levels, seed, { x: 0, y: 0 }, options.launch ?? null),
    rng = random((seed ^ 0x9e3779b9) >>> 0),
    perfectRate = options.perfectRate ?? profile * 0.5;
  const decisions = f.events.map(() => ({ hit: rng() < profile, perfect: rng() < perfectRate }));
  while (!f.landed && f.t < 180) {
    f.events.forEach((e, i) => {
      const d = decisions[i];
      if (!d.hit || e.result || (options.only && e.type !== options.only)) return;
      if (e.type === 'gust' && f.t >= e.at + (d.perfect ? 1.4 : 1.2)) eventInput(f, 'down', 'sim');
      if (e.type === 'bird') {
        if (e.heldAt === null && f.t >= e.at + 1) eventInput(f, 'down', 'sim');
        if (e.heldAt !== null && f.t >= e.heldAt + (d.perfect ? 0.75 : 0.55))
          eventInput(f, 'up', 'sim');
      }
    });
    step(f, dt);
  }
  if (!f.landed) throw Error('Flight exceeded 180 s');
  return f;
}
// Angle with the longest passive flight for this model, upgrades and throw power (1° grid).
export function bestAngle(model, levels, power) {
  let best = { angle: AIM_MIN, x: -1 };
  for (let a = AIM_MIN; a <= AIM_MAX; a++) {
    const f = createFlight(model, levels, 1, { x: 0, y: 0 }, throwSettings(a, power));
    f.events = [];
    while (!f.landed && f.t < 180) step(f);
    if (f.x > best.x) best = { angle: a, x: f.x };
  }
  return best.angle;
}
// Short advice after a throw: within 3° counts as right, otherwise point steeper or flatter. Returns an i18n key (t() in ui.js).
export function angleHint(angle, best) {
  const d = Math.round(angle) - best;
  return (
    'angle.' +
    (Math.abs(d) <= 3
      ? 'ok'
      : d > 0
        ? d > 8
          ? 'muchFlatter'
          : 'flatter'
        : d < -8
          ? 'muchSteeper'
          : 'steeper')
  );
}
