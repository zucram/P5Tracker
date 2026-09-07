import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, parseState, loadState, persistState, importState, STORAGE_KEY, BACKUP_KEY, MAX_BYTES } from '../p3/save.js';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key), values };
}

const sample = () => {
  const state = initialState();
  state.ranks[Object.keys(state.ranks)[0]] = 10;
  state.stats.Academics = 6;
  state.favorites = [Object.keys(state.ranks)[0]];
  state.goals = [{ id: 'goal-1', text: 'Spend time with a Social Link', month: 'april', done: false }];
  return state;
};

test('P3 state round trip and initial state isolation', () => {
  const state = sample();
  assert.deepEqual(parseState(JSON.stringify(state)), state);
  const first = initialState();
  first.stats.Charm = 6;
  first.goals.push({});
  assert.equal(initialState().stats.Charm, 1);
  assert.deepEqual(initialState().goals, []);
});

test('P3 rejects malformed, oversized, and cross-game saves', () => {
  for (const value of [null, [], {}, { checkedItems: {} }, { ...sample(), game: 'persona-5-royal' }, { ...sample(), schemaVersion: 2 }]) {
    assert.throws(() => parseState(JSON.stringify(value)));
  }
  assert.throws(() => parseState('{broken'));
  assert.throws(() => parseState(' '.repeat(MAX_BYTES + 1)));
  assert.throws(() => parseState('é'.repeat(MAX_BYTES / 2 + 1)));
  assert.throws(() => parseState(JSON.stringify(sample()).replace('"schemaVersion":1', '"__proto__":{},"schemaVersion":1')));
});

test('P3 rejects invalid ranges, IDs, and missing required state', () => {
  const id = Object.keys(sample().ranks)[0];
  for (const patch of [
    { month: 'march' }, { ranks: null }, { ranks: { unknown: 1 } },
    ...[-1, 11, 1.5, '1'].map(rank => ({ ranks: { ...sample().ranks, [id]: rank } })),
    ...[0, 7, 1.5, '1'].map(rank => ({ stats: { ...sample().stats, Courage: rank } })),
    { stats: { Charm: 1 } }, { showNames: 'false' }, { favorites: ['unknown'] },
    { favorites: [id, id] }, { goals: null },
  ]) assert.throws(() => parseState(JSON.stringify({ ...sample(), ...patch })));
  const state = sample();
  delete state.showNames;
  assert.throws(() => parseState(JSON.stringify(state)));
});

test('P3 validates goal text, IDs, months, counts, and completion', () => {
  const goal = sample().goals[0];
  for (const patch of [{ id: '' }, { id: 'x'.repeat(81) }, { id: '__proto__' }, { text: '' }, { text: '   ' }, { text: 'x'.repeat(201) }, { text: 'hello\nworld' }, { month: 'unknown' }, { done: 1 }]) {
    assert.throws(() => parseState(JSON.stringify({ ...sample(), goals: [{ ...goal, ...patch }] })));
  }
  assert.throws(() => parseState(JSON.stringify({ ...sample(), goals: [goal, goal] })));
  assert.throws(() => parseState(JSON.stringify({ ...sample(), goals: Array.from({ length: 101 }, (_, i) => ({ ...goal, id: `g-${i}` })) })));
  assert.equal(parseState(JSON.stringify({ ...sample(), goals: Array.from({ length: 100 }, (_, i) => ({ ...goal, id: `g-${i}` })) })).goals.length, 100);
});

test('P3 load handles missing, blocked, and corrupt storage without writes', () => {
  const storage = memoryStorage();
  assert.deepEqual(loadState(storage), { state: initialState(), warning: null });
  assert.equal(storage.values.size, 0);
  storage.setItem(STORAGE_KEY, '{broken');
  assert.ok(loadState(storage).warning);
  assert.equal(storage.getItem(STORAGE_KEY), '{broken');
  assert.ok(loadState({ getItem: () => { throw new Error('blocked'); } }).warning);
  assert.ok(loadState(undefined).warning);
});

test('P3 persist validates before writing and never changes Royal keys', () => {
  const storage = memoryStorage();
  storage.setItem('p5r_checkedItems', 'royal progress');
  storage.setItem('p5r_previousSave', 'royal backup');
  persistState(storage, sample());
  assert.deepEqual(loadState(storage), { state: sample(), warning: null });
  assert.throws(() => persistState(storage, { ...sample(), month: 'bad' }));
  assert.deepEqual(loadState(storage).state, sample());
  assert.equal(storage.getItem('p5r_checkedItems'), 'royal progress');
  assert.equal(storage.getItem('p5r_previousSave'), 'royal backup');
});

test('P3 import backs up current and rejects invalid data before writing', () => {
  const storage = memoryStorage();
  persistState(storage, initialState());
  assert.deepEqual(importState(storage, initialState(), JSON.stringify(sample())), sample());
  assert.deepEqual(JSON.parse(storage.getItem(BACKUP_KEY)), initialState());
  const before = [...storage.values.entries()];
  assert.throws(() => importState(storage, sample(), '{"checkedItems":{}}'));
  assert.deepEqual([...storage.values.entries()], before);
});

test('P3 failed import rolls back the save and previous backup', () => {
  const storage = memoryStorage();
  persistState(storage, initialState());
  storage.setItem(BACKUP_KEY, 'old backup');
  storage.setItem('p5r_checkedItems', 'royal progress');
  const before = [...storage.values.entries()];
  const write = storage.setItem;
  let writes = 0;
  storage.setItem = (key, value) => {
    if (++writes === 2) throw new Error('Quota exceeded');
    write(key, value);
  };
  assert.throws(() => importState(storage, initialState(), JSON.stringify(sample())), /could not be imported/);
  assert.deepEqual([...storage.values.entries()], before);
});
