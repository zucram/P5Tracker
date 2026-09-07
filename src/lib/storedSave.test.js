import test from 'node:test';
import assert from 'node:assert/strict';
import { loadStoredSave, persistProgress, persistImportedSave, ORIGINAL_SAVE_KEY } from './saveData.js';

function memory(entries = []) {
  const values = new Map(entries);
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('stored Royal saves fill missing fields and preserve valid progress without writing', () => {
  const storage = memory([['p5r_checkedItems', '{"cw_ans_1":true}'], ['p5r_confidantRanks', '{"Fool":3}'], ['p5r_anchoredMonth', 'june']]);
  const before = [...storage.values];
  const loaded = loadStoredSave(storage);
  assert.equal(loaded.canSave, true);
  assert.equal(loaded.save.confidantRanks.Fool, 3);
  assert.equal(loaded.save.confidantRanks.Magician, 0);
  assert.equal(loaded.save.socialStats.Knowledge, 1);
  assert.equal(loaded.save.anchoredMonth, 'june');
  assert.deepEqual([...storage.values], before);
});

test('corrupt JSON and invalid shapes never overwrite originals or discard other valid fields', () => {
  for (const raw of ['{broken', 'null', '[]', '{"bad":"not a boolean"}', '{"__proto__":true}']) {
    const storage = memory([['p5r_checkedItems', raw], ['p5r_socialStats', '{"Knowledge":4}']]);
    const before = [...storage.values];
    const result = loadStoredSave(storage);
    assert.equal(result.canSave, false);
    assert.equal(result.original.p5r_checkedItems, raw);
    assert.equal(result.save.socialStats.Knowledge, 4);
    assert.deepEqual([...storage.values], before);
  }
});

test('invalid months or ranks pause writes and retain raw fields', () => {
  for (const [key, value] of [['p5r_anchoredMonth', 'never'], ['p5r_socialStats', '{"Knowledge":6}'], ['p5r_confidantRanks', '{"Fool":11}']]) {
    const loaded = loadStoredSave(memory([[key, value]]));
    assert.equal(loaded.canSave, false);
    assert.equal(loaded.original[key], value);
  }
});

test('unavailable storage yields a usable in-memory save and a warning', () => {
  for (const storage of [undefined, { getItem() { throw new Error('blocked'); } }]) {
    const result = loadStoredSave(storage);
    assert.equal(result.canSave, false);
    assert.match(result.warning, /only in this tab/);
    assert.equal(result.save.anchoredMonth, 'april');
  }
});

test('ordinary persistence rolls back an interrupted write and leaves Reload alone', () => {
  const storage = memory([['p5r_checkedItems', '{}'], ['p3reload_state_v1', 'reload']]);
  const before = [...storage.values];
  let writes = 0;
  const faulty = { ...storage, setItem(key, value) { if (++writes === 3) throw new Error('quota'); storage.setItem(key, value); } };
  assert.throws(() => persistProgress(faulty, loadStoredSave(storage).save));
  assert.deepEqual([...storage.values], before);
});

test('a successful import retains unreadable originals across reloads', () => {
  const storage = memory([['p5r_checkedItems', '{broken']]);
  const loaded = loadStoredSave(storage);
  const incoming = { ...loaded.save, checkedItems: { cw_ans_2: true } };
  persistImportedSave(storage, loaded.save, incoming, loaded.original);
  const restored = loadStoredSave(storage);
  assert.equal(restored.canSave, true);
  assert.deepEqual(restored.save.checkedItems, incoming.checkedItems);
  assert.equal(restored.original.p5r_checkedItems, '{broken');
  assert.ok(storage.getItem(ORIGINAL_SAVE_KEY));
});
