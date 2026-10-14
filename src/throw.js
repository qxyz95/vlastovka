export const AIM_MIN = 5;
export const AIM_MAX = 40;
export function chargeAt(seconds) { return (1 - Math.cos(Math.max(0, seconds) * Math.PI / 1.15)) / 2; }
export function throwSettings(angleDegrees, charge) {
  const angle = Math.max(AIM_MIN, Math.min(AIM_MAX, Number.isFinite(angleDegrees) ? angleDegrees : 15));
  const power = Math.max(0, Math.min(1, Number.isFinite(charge) ? charge : 0));
  return {angle:angle*Math.PI/180, multiplier:0.7+0.4*power, power, grade:power>=0.93?'perfect':power>=0.7?'strong':power>=0.35?'good':'weak'};
}
