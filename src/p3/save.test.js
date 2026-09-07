import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, parseState, loadState, persistState, importState, STORAGE_KEY, BACKUP_KEY } from './save.js';

const parse = state => parseState(JSON.stringify(state));
function legacy(month = 'april') {
  const { date, slot, completedEvents, unlockedLinks, showEventNames, ...state } = initialState();
  void [date, slot, completedEvents, unlockedLinks, showEventNames];
  return { ...state, schemaVersion: 1, month };
}
function memoryStorage(entries = []) {
  const values = new Map(entries);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('v1 load migrates every month in memory and preserves original storage', () => {
  const months = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january'];
  for (const [index, month] of months.entries()) {
    const old = legacy(month);
    old.ranks.magician = 4;
    old.favorites = ['magician'];
    const text = JSON.stringify(old);
    const storage = memoryStorage([[STORAGE_KEY, text]]);
    const { state, warning } = loadState(storage);
    assert.equal(warning, null);
    assert.deepEqual(state, { ...initialState(), ...old, schemaVersion: 2, date: `${String(index === 9 ? 1 : index + 4).padStart(2, '0')}-01` });
    assert.equal(storage.getItem(STORAGE_KEY), text);
  }
});

test('v2 round trip retains dates, event completions and manual confirmations', () => {
  const state = { ...initialState(), month: 'january', date: '01-31', slot: 'evening', completedEvents: ['le-junpei-1'], unlockedLinks: ['magician', 'tower'], showEventNames: true };
  assert.deepEqual(parse(state), state);
  assert.equal(initialState().date, '04-22');
  assert.deepEqual(parse({ ...state, extra: 'discard', goals: [{ id: 'a', text: 'Visit', month: 'january', done: false, extra: true }] }), { ...state, goals: [{ id: 'a', text: 'Visit', month: 'january', done: false }] });
  const storage = memoryStorage();
  persistState(storage, state);
  assert.deepEqual(loadState(storage).state, state);
});

test('dates use real campaign calendar days and match their selected month', () => {
  for (const date of ['04-00', '04-31', '04-32', '02-01', '02-29', '03-31', '13-01', '00-01', '01-32', '4-22', '04-2', '2009-04-22', null, 422]) {
    assert.throws(() => parse({ ...initialState(), date }), /date/);
  }
  assert.throws(() => parse({ ...initialState(), month: 'may' }), /match/);
  for (const [month, date] of [['april', '04-01'], ['december', '12-31'], ['january', '01-01'], ['january', '01-31']]) {
    assert.equal(parse({ ...initialState(), month, date }).date, date);
  }
});

test('v2 completion IDs, introductions and settings are constrained', () => {
  for (const completedEvents of [null, ['le-junpei-1', 'le-junpei-1'], ['unknown-event'], ['__proto__'], ['x\ny'], [3], Array(301).fill('le-junpei-1')]) {
    assert.throws(() => parse({ ...initialState(), completedEvents }), /Completed events/);
  }
  for (const unlockedLinks of [null, ['fool'], ['death'], ['judgement'], ['unknown'], ['magician', 'magician'], [1]]) {
    assert.throws(() => parse({ ...initialState(), unlockedLinks }), /introductions/);
  }
  for (const patch of [{ slot: 'morning' }, { slot: null }, { showEventNames: 'false' }, { showEventNames: null }]) assert.throws(() => parse({ ...initialState(), ...patch }));
  for (const key of ['date', 'slot', 'completedEvents', 'unlockedLinks', 'showEventNames']) {
    const state = initialState();
    delete state[key];
    assert.throws(() => parse(state));
  }
});

test('v1 imports become v2 while preserving current backup and Royal saves', () => {
  const storage = memoryStorage([['p5r_checkedItems', 'royal'], ['p5r_previousSave', 'royal backup']]);
  const current = initialState();
  const incoming = importState(storage, current, JSON.stringify(legacy('january')));
  assert.equal(incoming.schemaVersion, 2);
  assert.equal(incoming.date, '01-01');
  assert.deepEqual(JSON.parse(storage.getItem(BACKUP_KEY)), current);
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), incoming);
  assert.equal(storage.getItem('p5r_checkedItems'), 'royal');
  assert.equal(storage.getItem('p5r_previousSave'), 'royal backup');
});

test('invalid v2 saves stay recoverable and storage failures do not claim success', () => {
  const corrupt = JSON.stringify({ ...initialState(), date: '04-31' });
  const storage = memoryStorage([[STORAGE_KEY, corrupt]]);
  assert.ok(loadState(storage).warning);
  assert.equal(storage.getItem(STORAGE_KEY), corrupt);
  assert.throws(() => importState(storage, initialState(), corrupt));
  assert.equal(storage.getItem(STORAGE_KEY), corrupt);
  const unavailable = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.ok(loadState(unavailable).warning);
  assert.throws(() => persistState(unavailable, initialState()));
  assert.throws(() => importState(unavailable, initialState(), JSON.stringify(initialState())));
});

test('failed v1 import removes a newly created backup and restores a corrupt original', () => {
  const storage = memoryStorage([[STORAGE_KEY, '{broken']]);
  const write = storage.setItem;
  let attempts = 0;
  storage.setItem = (key, value) => {
    if (++attempts === 2) throw new Error('quota');
    write(key, value);
  };
  assert.throws(() => importState(storage, initialState(), JSON.stringify(legacy())), /could not be imported/);
  assert.equal(storage.getItem(BACKUP_KEY), null);
  assert.equal(storage.getItem(STORAGE_KEY), '{broken');
});
