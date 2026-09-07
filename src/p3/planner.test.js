import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, dateNumber, dateLabel, monthForDate, shiftDate, linkOption, eventState, eventTitle, EVENTS, FACT_BY_ID } from './planner.js';
import { initialState, parseState } from './save.js';
import { SOCIAL_LINKS } from './data.js';
import rules from '../../knowledge/p3-reload/calendar-rules.json' with { type: 'json' };

const stateOn = (date, patch = {}) => ({ ...initialState(), date, month: monthForDate(date), ...patch });
const option = (id, date, patch = {}) => linkOption(SOCIAL_LINKS.find(x => x.id === id), stateOn(date, patch));
const introduced = (...ids) => ({ unlockedLinks: ids });
const event = (id, date, completedEvents = []) => eventState(FACT_BY_ID[id], stateOn(date, { completedEvents }));

test('every campaign day traverses once, validates as a save and builds both slots', () => {
  let date = '04-01';
  let count = 0;
  const seen = new Set();
  while (!seen.has(date)) {
    seen.add(date);
    const expected = Date.UTC(2009, 3, 1) / 86400000 + count;
    assert.equal(dateNumber(date), expected);
    for (const slot of ['daytime', 'evening']) {
      const state = parseState(JSON.stringify(stateOn(date, { slot })));
      const plan = buildPlan(state);
      assert.equal(plan.month.name.toLowerCase(), state.month);
      assert.ok(plan.events.every(e => e.status === 'uncertain' || Number.isFinite(e.remaining)));
    }
    date = shiftDate(date, 1);
    count++;
  }
  assert.equal(count, 306);
  assert.equal(date, '01-31');
  assert.equal(shiftDate('04-01', -1), '04-01');
});

test('December rolls into January 2010 with stable weekday and boundary handling', () => {
  assert.equal(shiftDate('12-31', 1), '01-01');
  assert.equal(shiftDate('01-01', -1), '12-31');
  assert.equal(dateNumber('01-01') - dateNumber('12-31'), 1);
  assert.equal(new Date(dateNumber('04-22') * 86400000).getUTCDay(), 3);
  assert.equal(new Date(dateNumber('01-01') * 86400000).getUTCDay(), 5);
  assert.equal(dateLabel('01-31'), 'Jan 31');
  for (const date of ['02-01', '02-29', '03-31', '04-31', '06-31', '00-01', '13-01', '01-00', '04-1', '', null]) {
    assert.ok(Number.isNaN(dateNumber(date)), String(date));
    assert.throws(() => buildPlan({ ...initialState(), date }), /valid date/);
  }
});

test('a normal weekday requires an introduction or a recorded rank, and respects the slot', () => {
  assert.equal(option('magician', '04-23').eligible, false);
  assert.equal(option('magician', '04-23', introduced('magician')).eligible, true);
  assert.equal(option('magician', '04-23', { ranks: { ...initialState().ranks, magician: 1 } }).eligible, true);
  assert.equal(option('magician', '04-24', introduced('magician')).eligible, true);
  assert.equal(option('magician', '04-25', introduced('magician')).eligible, false);
  assert.equal(option('magician', '04-23', { ...introduced('magician'), slot: 'evening' }).eligible, false);
  assert.equal(option('magician', '04-23', { ranks: { ...initialState().ranks, magician: 10 } }).eligible, false);
  assert.equal(option('tower', '06-04', { ...introduced('tower'), slot: 'evening' }).eligible, true);
  assert.equal(option('tower', '06-04', introduced('tower')).eligible, false);
  assert.equal(option('fool', '06-04', introduced('fool')).eligible, false);
});

test('school closures and exam preparation suppress meetings while Empress retains her exception', () => {
  for (const date of ['05-05', '08-04', '12-29', '01-05']) assert.equal(option('magician', date, introduced('magician')).eligible, false, date);
  assert.equal(option('magician', '12-08', introduced('magician')).eligible, false);
  assert.equal(option('empress', '12-08', introduced('empress')).eligible, true);
  assert.equal(option('empress', '12-29', introduced('empress')).eligible, false);
  assert.equal(option('hierophant', '08-04', introduced('hierophant')).eligible, true);
  assert.equal(option('hermit', '04-29', introduced('hermit')).eligible, true);
  assert.equal(option('hermit', '04-30', introduced('hermit')).eligible, false);
  assert.equal(option('emperor', '11-02', introduced('emperor')).eligible, true);
  assert.equal(option('emperor', '11-04', introduced('emperor')).eligible, false);
  assert.equal(option('emperor', '11-30', introduced('emperor')).eligible, true);
});

test('opening gates remain preparations until the player confirms the introduction', () => {
  const academics = { stats: { Academics: 6, Courage: 6, Charm: 6 } };
  assert.match(option('priestess', '06-19').reason, /Courage rank 6/);
  assert.match(option('priestess', '06-19', academics).reason, /Fortune rank 1/);
  assert.match(option('priestess', '06-19', { ...academics, ranks: { ...initialState().ranks, fortune: 1 } }).reason, /introduction/);
  assert.equal(option('priestess', '06-19', introduced('priestess')).eligible, true);
  assert.equal(option('empress', '11-20', introduced('empress')).eligible, false);
  assert.equal(option('aeon', '01-08', introduced('aeon')).eligible, true);
  assert.equal(option('aeon', '01-25', introduced('aeon')).eligible, false);
});

test('full moon and story blocks mask ordinary suggestions in the affected slot', () => {
  const unlockedLinks = SOCIAL_LINKS.filter(x => x.kind !== 'story').map(x => x.id);
  for (const date of ['05-09', '06-08', '07-07', '08-06', '09-05', '10-04', '11-03', '01-31']) {
    for (const slot of ['daytime', 'evening']) {
      const plan = buildPlan(stateOn(date, { slot, unlockedLinks }));
      assert.ok(plan.blocks.length, `${date} ${slot}`);
      assert.deepEqual(plan.candidates, []);
    }
  }
  assert.ok(buildPlan(stateOn('12-03')).blocks.length);
  assert.equal(buildPlan(stateOn('12-03', { slot: 'evening' })).blocks.length, 0);
  for (const block of rules.slotBlocks) {
    assert.ok(block.evidence.some(e => e.url && e.locator), block.id);
    for (const slot of block.slots) assert.deepEqual(buildPlan(stateOn(block.start, { slot, unlockedLinks })).candidates, [], block.id);
  }
});

test('completion removes urgent reminders and prerequisite chains never open prematurely', () => {
  const plan = buildPlan(stateOn('07-03'));
  assert.ok(plan.urgent.some(e => e.fact.id === 'le-junpei-1'));
  const complete = buildPlan(stateOn('07-03', { completedEvents: ['le-junpei-1'] }));
  assert.ok(!complete.urgent.some(e => e.fact.id === 'le-junpei-1'));
  assert.equal(event('le-junpei-1', '07-04').status, 'past');
  assert.equal(event('le-junpei-2', '07-04').status, 'upcoming');
  assert.equal(event('le-junpei-2', '08-09').status, 'blocked');
  assert.equal(event('le-junpei-2', '08-09', ['le-junpei-1']).status, 'open');
  assert.equal(event('le-koromaru-2', '09-04').status, 'prerequisite');
  assert.equal(event('le-koromaru-2', '09-04', ['le-koromaru-1']).status, 'open');
  assert.equal(event('le-ryoji-3', '11-19', ['le-ryoji-2']).status, 'blocked');
  assert.equal(event('le-ryoji-3', '11-19', ['le-ryoji-2', 'le-ryoji-3-invitation']).status, 'open');
  assert.equal(event('le-junpei-4', '12-19').status, 'uncertain');
});

test('disputed windows do not become expired or urgent even after January', () => {
  for (const fact of EVENTS.filter(x => x.status === 'disputed')) {
    for (const date of ['04-01', fact.value.end, '01-31']) {
      const result = eventState(fact, stateOn(date));
      assert.equal(result.status, 'uncertain', fact.id);
      assert.equal(result.remaining, null);
      assert.ok(!buildPlan(stateOn(date)).urgent.some(e => e.fact.id === fact.id));
    }
  }
});

test('all twenty rescues retain valid inclusive windows, floors and source references', () => {
  const rescues = EVENTS.filter(x => x.category === 'rescue');
  assert.equal(rescues.length, 20);
  for (const fact of rescues) {
    assert.ok(dateNumber(fact.value.start) <= dateNumber(fact.value.end), fact.id);
    assert.ok(Number.isInteger(fact.value.floor) && fact.value.floor > 0);
    assert.ok(fact.evidence.some(e => e.url.startsWith('https://') && e.locator));
    assert.equal(eventState(fact, stateOn(shiftDate(fact.value.start, -1))).status, 'upcoming');
    assert.equal(eventState(fact, stateOn(fact.value.start)).status, 'open');
    assert.equal(eventState(fact, stateOn(fact.value.end)).status, 'open');
    assert.equal(eventState(fact, stateOn(shiftDate(fact.value.end, 1))).status, 'past');
    assert.equal(eventState(fact, stateOn(fact.value.end, { completedEvents: [fact.id] })).status, 'completed');
    assert.ok(!eventTitle(fact).includes(fact.subject));
    assert.ok(eventTitle(fact, true).includes(fact.subject));
  }
});

test('outer windows preserve unknown daily availability and conditional interruptions stay conditional', () => {
  const junpei = FACT_BY_ID['le-junpei-1'];
  assert.equal(junpei.value.dailyAvailabilityKnown, false);
  assert.equal(eventState(junpei, stateOn('06-01')).label, 'Within episode window');
  assert.ok(junpei.evidence.some(e => e.url && e.locator));
  const plan = buildPlan(stateOn('12-24'));
  assert.ok(plan.conditional.some(x => x.id === 'christmas-date'));
  assert.ok(!plan.blocks.some(x => x.id === 'christmas-date'));
  assert.ok(rules.notes.some(x => /in-game.*check|check.*in-game/.test(x)));
});

test('missing people suspend their Social Links until rescue is confirmed, without assuming permanent loss', () => {
  for (const [id, rescue, before, during, after] of [
    ['hierophant', 'rescue-bunkichi', '09-11', '09-12', '10-06'],
    ['hanged-man', 'rescue-maiko', '10-19', '10-21', '11-04'],
  ]) {
    assert.equal(option(id, before, introduced(id)).eligible, true);
    for (const date of [during, after]) {
      const pending = option(id, date, introduced(id));
      assert.equal(pending.eligible, false);
      assert.match(pending.reason, /rescue needs confirming/);
      assert.doesNotMatch(pending.reason, /lost|failed|missed/);
      assert.equal(option(id, date, { ...introduced(id), completedEvents: [rescue] }).eligible, true);
      assert.ok(!buildPlan(stateOn(date, introduced(id))).candidates.some(x => x.link.id === id));
    }
  }
});
