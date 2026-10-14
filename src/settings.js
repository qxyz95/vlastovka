// Device settings (not the game save): validation and storage with the storage passed in, no DOM.
// Language and audio have their own keys. Timing windows ("assist") are undecided (07-menu B4), so not here.
export const SETTINGS_KEY = 'just-throw-it-settings';
export const MOTION_MODES = ['system', 'reduce', 'full'];
export const DEFAULT_SETTINGS = Object.freeze({
  motion: 'system',
  timingBar: false,
  tapToggle: false,
});
// raw: parsed JSON of anything; unknown keys are dropped, missing or invalid ones fall back to defaults.
export function settingsFrom(raw) {
  const o = { ...DEFAULT_SETTINGS };
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    if (MOTION_MODES.includes(raw.motion)) o.motion = raw.motion;
    for (const k of ['timingBar', 'tapToggle']) if (typeof raw[k] === 'boolean') o[k] = raw[k];
  }
  return o;
}
// storage: anything with getItem/setItem (localStorage); a missing or throwing storage gives defaults.
export function loadSettings(storage) {
  try {
    return settingsFrom(JSON.parse(storage.getItem(SETTINGS_KEY) ?? 'null'));
  } catch {
    return settingsFrom(null);
  }
}
// Returns true when the write succeeded; a failing storage (private mode, quota) never throws.
export function saveSettings(settings, storage) {
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settingsFrom(settings)));
    return true;
  } catch {
    return false;
  }
}
// The player's choice overrides the system preference ('system' follows it).
export function reducedMotion(settings, systemReduce) {
  const m = settingsFrom(settings).motion;
  return m === 'reduce' || (m === 'system' && !!systemReduce);
}
