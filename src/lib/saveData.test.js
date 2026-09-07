import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_SAVE_BYTES, PREVIOUS_SAVE_KEY, parseSave, persistImportedSave } from './saveData.js';

const sample = () => ({
  checkedItems: { april_cw_1: true, item_2: false },
  confidantRanks: { Fool: 10, Magician: 4 },
  socialStats: { Knowledge: 4, Guts: 3, Proficiency: 2, Kindness: 1, Charm: 5 },
  anchoredMonth: 'april',
});

test('existing export round trip preserves checklist, month, stats and ranks', () => {
  const result = parseSave(JSON.stringify(sample()));
  assert.deepEqual(result.checkedItems, sample().checkedItems);
  assert.deepEqual(result.socialStats, sample().socialStats);
  assert.equal(result.anchoredMonth, 'april');
  assert.equal(result.confidantRanks.Fool, 10);
  assert.equal(result.confidantRanks.Magician, 4);
  assert.equal(result.confidantRanks.Faith, 0);
  assert.deepEqual(parseSave(JSON.stringify(result)), result);
});

test('legacy checklist-only save remains supported without resetting omitted fields', () => {
  assert.deepEqual(parseSave('{"checkedItems":{"cw1":true}}'), { checkedItems: { cw1: true } });
});

test('rejects malformed structures, values and dangerous keys before changing state', () => {
  const invalid = [null, [], {}, { checkedItems: [] }, { checkedItems: null },
    { checkedItems: { task: 'true' } }, { ...sample(), confidantRanks: [] },
    { ...sample(), confidantRanks: { Fool: 11 } }, { ...sample(), confidantRanks: { Fool: 1.5 } },
    { ...sample(), confidantRanks: { Unknown: 1 } }, { ...sample(), socialStats: { Guts: 0 } },
    { ...sample(), socialStats: { Guts: 6 } }, { ...sample(), socialStats: { Guts: '2' } },
    { ...sample(), anchoredMonth: 'not-a-month' }];
  for (const value of invalid) assert.throws(() => parseSave(JSON.stringify(value)));
  assert.throws(() => parseSave('{"checkedItems":{"__proto__":true}}'));
  assert.throws(() => parseSave('{"checkedItems":{"constructor":true}}'));
  assert.throws(() => parseSave('{broken'));
  assert.throws(() => parseSave(' '.repeat(MAX_SAVE_BYTES + 1)));
  assert.throws(() => parseSave('é'.repeat(MAX_SAVE_BYTES / 2 + 1)));
});

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('persists the pre-import backup and existing browser save keys', () => {
  const storage = memoryStorage();
  const before = sample();
  const after = { ...sample(), anchoredMonth: 'may' };
  persistImportedSave(storage, before, after);
  assert.deepEqual(JSON.parse(storage.getItem(PREVIOUS_SAVE_KEY)), before);
  assert.equal(storage.getItem('p5r_anchoredMonth'), 'may');
  assert.deepEqual(JSON.parse(storage.getItem('p5r_checkedItems')), after.checkedItems);
  persistImportedSave(storage, after, parseSave(storage.getItem(PREVIOUS_SAVE_KEY)));
  assert.equal(storage.getItem('p5r_anchoredMonth'), 'april');
  assert.deepEqual(JSON.parse(storage.getItem(PREVIOUS_SAVE_KEY)), after);
});

test('storage failure rolls back changed values and preserves the previous backup', () => {
  const storage = memoryStorage();
  persistImportedSave(storage, sample(), sample());
  const oldBackup = storage.getItem(PREVIOUS_SAVE_KEY);
  const setItem = storage.setItem;
  let writes = 0;
  storage.setItem = (key, value) => {
    if (++writes === 3) throw new Error('Quota exceeded');
    setItem(key, value);
  };
  assert.throws(() => persistImportedSave(storage, sample(), { ...sample(), checkedItems: { changed: true } }), /could not save/);
  assert.equal(storage.getItem(PREVIOUS_SAVE_KEY), oldBackup);
  assert.deepEqual(JSON.parse(storage.getItem('p5r_checkedItems')), sample().checkedItems);
  assert.equal(storage.getItem('p5r_anchoredMonth'), 'april');
});
