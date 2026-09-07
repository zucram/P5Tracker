import test from 'node:test';
import assert from 'node:assert/strict';
import { getMonthGuide, ALL_GUIDE_TASK_IDS } from './monthGuide.js';
import { MONTHS } from './data.js';
import facts from '../../knowledge/p3-reload/facts.json' with { type: 'json' };

const task = (month, section, id) => getMonthGuide(month)[section].find(row => row.id === id);

test('request instructions preserve the item, provider and trip preparation', () => {
  assert.match(task('may', 'critical', 'request-12').detail, /pine resin from Yukari/);
  assert.match(task('july', 'timeline', 'request-44-beach').detail, /Accept request 44 before/);
  assert.match(task('november', 'timeline', 'request-96-kyoto').detail, /three different drinks/);
  assert.equal(task('july', 'critical', 'request-40-shopping'), undefined);
  assert.match(task('december', 'critical', 'request-97').detail, /Guides disagree/);
});

test('rescue rows carry floor, inclusive window and endangered social link', () => {
  const september = task('september', 'critical', 'rescue-bunkichi');
  assert.match(september.title, /floor 120/);
  assert.match(september.detail, /Hierophant/);
  assert.equal(september.date, '09-12');
  assert.equal(september.end, '10-03');
  assert.ok(task('october', 'critical', 'rescue-bunkichi'));
});

test('opening targets encode prerequisites rather than invented monthly ranks', () => {
  const moon = task('may', 'targets', 'guide-opening-moon');
  assert.equal(moon.linkId, 'magician');
  assert.equal(moon.rank, 3);
  assert.equal(moon.opensLinkId, 'moon');
  assert.match(moon.detail, /Odd Morsel/);
  const temperance = task('may', 'targets', 'guide-opening-temperance');
  assert.equal(temperance.linkId, 'hierophant');
  assert.equal(temperance.rank, 3);
  assert.equal(temperance.statRank, 2);
  assert.match(task('november', 'targets', 'guide-opening-empress').detail, /top exam result/);
  assert.match(task('june', 'targets', 'guide-opening-devil').detail, /disputed/);
});

test('episode windows and disputed dates never become hard deadlines', () => {
  const junpei = task('november', 'timeline', 'le-junpei-3');
  assert.ok(junpei.uncertain);
  assert.match(junpei.detail, /not a guaranteed meeting/);
  assert.match(junpei.detail, /cutoff is disputed/);
  assert.equal(task('november', 'critical', junpei.id), undefined);
  assert.ok(task('june', 'timeline', 'le-junpei-1'));
});

test('winter closures cross into January and final exam slots stay explicit', () => {
  assert.ok(task('january', 'timeline', 'guide-schoolClosures-winter-break'));
  assert.equal(task('april', 'timeline', 'guide-schoolClosures-winter-break'), undefined);
  assert.match(task('july', 'timeline', 'cal-exam-july').detail, /evening: free/);
  assert.ok(task('may', 'timeline', 'cal-full-moon-may'));
  assert.equal(task('may', 'timeline', 'guide-slotBlocks-operation-may'), undefined);
});

test('all rows are sourced and every generated completion id is registered', () => {
  const factIds = new Set(facts.facts.map(f => f.id));
  const registered = new Set(ALL_GUIDE_TASK_IDS);
  for (const month of MONTHS) {
    const guide = getMonthGuide(month.id);
    for (const rows of Object.values(guide)) {
      assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
      for (const row of rows) {
        assert.ok(row.title && row.detail && row.category && row.sourceUrl);
        assert.ok(row.factId ? factIds.has(row.factId) : registered.has(row.id));
      }
    }
  }
  assert.deepEqual(getMonthGuide('invalid'), { critical: [], timeline: [], targets: [], strategy: [] });
});


test('evidence coverage is distinct from disagreement and conditional events', () => {
  const singleSource = task('october', 'timeline', 'le-shinjiro-5');
  assert.equal(singleSource.evidenceStatus, 'single-source');
  assert.equal(singleSource.uncertain, false);
  const disputed = task('november', 'timeline', 'le-junpei-3');
  assert.equal(disputed.evidenceStatus, 'disputed');
  assert.equal(disputed.uncertain, true);
  const conditional = task('december', 'timeline', 'guide-conditionalSlotBlocks-christmas-date');
  assert.equal(conditional.conditional, true);
  assert.equal(conditional.uncertain, false);
});

test('player copy does not expose internal research instructions', () => {
  for (const month of MONTHS) {
    for (const row of Object.values(getMonthGuide(month.id)).flat()) {
      assert.doesNotMatch(row.detail, /Do not (?:declare|show|infer|treat)|No hard .* dependency|encoded|modelled|needs reconciliation|source routes|undefined|from \./);
    }
  }
});
