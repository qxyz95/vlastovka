import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh,
  flightFor,
  advance,
  activeEvent,
  flightInput,
  feedbackOf,
  FINISH,
} from '../src/core.js';
import { helpLiveKey, bannerIsNews } from '../src/announce.js';
import { comboNews } from '../src/juice.js';
import { districtAt } from '../src/scenes.js';
import { t, setLang, setStrict } from '../src/i18n.js';

setStrict(true);
setLang('en');

test('N-D: helpLiveKey announces only warning and result, never filler', () => {
  const ev = (phase, result = null) => ({ phase, result });
  assert.equal(helpLiveKey(null, '', ''), '');
  assert.equal(helpLiveKey(ev('warning'), '', ''), 'help.ready');
  assert.equal(helpLiveKey(ev('warning'), 'Thermal: tap once', ''), '', 'first hint = banner');
  assert.equal(helpLiveKey(ev('interaction'), '', ''), '');
  assert.equal(helpLiveKey(ev('interaction'), 'hint', ''), '');
  assert.equal(helpLiveKey(null, '', 'feedback.perfect'), 'feedback.perfect');
  assert.equal(helpLiveKey(ev('done', 'hit'), '', 'feedback.hit'), 'feedback.hit');
});

test('N-D: banner is announced only as news (district, hint, new best milestone, goal)', () => {
  const m = value => ({ kind: 'milestone', value });
  assert.equal(bannerIsNews({ kind: 'district' }, '', 50, 9999, FINISH), true);
  assert.equal(bannerIsNews(null, 'Thermal: tap', 50, 9999, FINISH), true);
  assert.equal(bannerIsNews(m(250), '', 260, 9999, FINISH), false, 'repeat of an old milestone');
  assert.equal(bannerIsNews(m(250), '', 260, 100, FINISH), true, 'beyond the best so far');
  assert.equal(bannerIsNews(m(FINISH), '', FINISH, FINISH, FINISH), true);
});

// A whole typical flight with a perfect-timing bot: screen-reader announcements = event-help + banner + combo.
for (const [label, best, attempts] of [['veteran (best = whole route)', FINISH, 9]]) {
  test(`N-D: a typical flight makes at most 12 screen-reader announcements, ${label}`, () => {
    for (const seed of [10, 11, 12, 13]) {
      const p = {
        ...fresh(),
        best,
        attempts: attempts + seed - 10,
        levels: { power: 2, paper: 6, folds: 1 },
      };
      const f = flightFor(p, 24, 0.9),
        milestones = new Set();
      let acc = 0,
        helpText = '',
        said = 0,
        comboSay = { n: 0, at: -Infinity },
        lastDistrict = districtAt(f.x).index;
      while (!f.landed) {
        const e = activeEvent(f);
        if (e && !e.result && e.phase === 'interaction') {
          const c = e.type === 'steam' ? e.w.c[e.puff] : e.w.c;
          if (e.type !== 'bird' && f.t >= c) flightInput(f, 'down');
          if (e.type === 'bird' && e.heldAt === null) flightInput(f, 'down');
          if (e.type === 'bird' && e.heldAt !== null && f.t - e.heldAt >= e.w.c)
            flightInput(f, 'up');
        }
        ({ acc } = advance(f, acc, 1 / 60));
        const key = helpLiveKey(activeEvent(f), '', feedbackOf(f)),
          text = key && t(key);
        if (text && text !== helpText) said++;
        helpText = text;
        for (const v of [100, 250, 500, FINISH])
          if (f.x >= v && !milestones.has(v)) {
            milestones.add(v);
            if (bannerIsNews({ kind: 'milestone', value: v }, '', f.x, p.best, FINISH)) said++;
          }
        const d = districtAt(f.x).index;
        if (d !== lastDistrict) {
          lastDistrict = d;
          said++;
        }
        const c = comboNews(comboSay, f.combo, f.t);
        comboSay = c.s;
        if (c.say) said++;
      }
      assert.ok(said <= 12, `seed ${seed}: ${said} announcements`);
    }
  });
}
