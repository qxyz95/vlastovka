import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SETTINGS_KEY,
  DEFAULT_SETTINGS,
  settingsFrom,
  loadSettings,
  saveSettings,
  reducedMotion,
} from '../src/settings.js';

const memory = (init = {}) => {
  const m = { ...init };
  return { m, getItem: k => m[k] ?? null, setItem: (k, v) => (m[k] = String(v)) };
};
const throwing = () => {
  throw new Error('denied');
};
const D = { motion: 'system', timingBar: false, tapToggle: false };

test('defaults', () => {
  assert.equal(SETTINGS_KEY, 'just-throw-it-settings');
  assert.deepEqual({ ...DEFAULT_SETTINGS }, D);
  assert.deepEqual(settingsFrom(undefined), D);
  assert.deepEqual(settingsFrom(null), D);
});

test('settingsFrom drops unknown keys, fills missing, rejects wrong types', () => {
  assert.deepEqual(settingsFrom({ motion: 'reduce', extra: 1, lang: 'cs' }), {
    ...D,
    motion: 'reduce',
  });
  assert.deepEqual(settingsFrom({ timingBar: true }), { ...D, timingBar: true });
  assert.deepEqual(settingsFrom({ motion: 'wild', timingBar: 'yes', tapToggle: 1 }), D);
  for (const bad of [5, 'x', [], true]) assert.deepEqual(settingsFrom(bad), D);
});

test('settingsFrom returns a copy, defaults stay intact', () => {
  const s = settingsFrom({ motion: 'full' });
  s.motion = 'reduce';
  assert.equal(DEFAULT_SETTINGS.motion, 'system');
});

test('loadSettings: damaged JSON, missing key, throwing storage give defaults', () => {
  assert.deepEqual(loadSettings(memory()), D);
  assert.deepEqual(loadSettings(memory({ [SETTINGS_KEY]: '{oops' })), D);
  assert.deepEqual(loadSettings(memory({ [SETTINGS_KEY]: '[1,2]' })), D);
  assert.deepEqual(loadSettings({ getItem: throwing }), D);
  assert.deepEqual(loadSettings(null), D);
});

test('save then load round-trips and strips unknown keys', () => {
  const st = memory();
  assert.equal(
    saveSettings({ motion: 'reduce', timingBar: true, tapToggle: true, junk: 1 }, st),
    true,
  );
  assert.deepEqual(JSON.parse(st.m[SETTINGS_KEY]), {
    motion: 'reduce',
    timingBar: true,
    tapToggle: true,
  });
  assert.deepEqual(loadSettings(st), { motion: 'reduce', timingBar: true, tapToggle: true });
});

test('saveSettings never throws', () => {
  assert.equal(saveSettings(D, { setItem: throwing }), false);
  assert.equal(saveSettings(D, null), false);
});

test('reducedMotion: choice overrides the system', () => {
  assert.equal(reducedMotion({ motion: 'system' }, true), true);
  assert.equal(reducedMotion({ motion: 'system' }, false), false);
  assert.equal(reducedMotion({ motion: 'reduce' }, false), true);
  assert.equal(reducedMotion({ motion: 'full' }, true), false);
  assert.equal(reducedMotion(null, true), true);
});
