import { APP_DATA } from '../data/gameData.js';

export const MAX_SAVE_BYTES = 1024 * 1024;
export const PREVIOUS_SAVE_KEY = 'p5r_previousSave';
const stats = ['Knowledge', 'Guts', 'Proficiency', 'Kindness', 'Charm'];
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function validateMap(value, allowedKeys, min, max, label) {
  if (!isRecord(value)) throw new Error(`${label} must be an object.`);
  for (const [key, rank] of Object.entries(value)) {
    if (!allowedKeys.includes(key) || !Number.isInteger(rank) || rank < min || rank > max) {
      throw new Error(`${label} contains an invalid rank.`);
    }
  }
}

// Older exports can omit stats, ranks, or the selected month.
export function parseSave(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_SAVE_BYTES) {
    throw new Error('Save files must be smaller than 1 MB.');
  }
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('This is not valid save JSON. Paste the full export or choose a save file.'); }
  if (!isRecord(data) || !isRecord(data.checkedItems)) throw new Error('This is not a P5Tracker save. It must contain checkedItems.');
  const checkedItems = {};
  for (const [key, value] of Object.entries(data.checkedItems)) {
    if (unsafeKeys.has(key) || key.length > 200 || typeof value !== 'boolean') {
      throw new Error('The checklist contains an invalid entry.');
    }
    checkedItems[key] = value;
  }
  const result = { checkedItems };
  if (Object.hasOwn(data, 'confidantRanks')) {
    const arcanas = APP_DATA.confidants.map(c => c.arcana);
    validateMap(data.confidantRanks, arcanas, 0, 10, 'Confidant ranks');
    result.confidantRanks = Object.fromEntries(arcanas.map(key => [key, data.confidantRanks[key] ?? 0]));
  }
  if (Object.hasOwn(data, 'socialStats')) {
    validateMap(data.socialStats, stats, 1, 5, 'Social stats');
    result.socialStats = Object.fromEntries(stats.map(key => [key, data.socialStats[key] ?? 1]));
  }
  if (Object.hasOwn(data, 'anchoredMonth')) {
    if (!APP_DATA.months.some(month => month.id === data.anchoredMonth)) throw new Error('The selected month is invalid.');
    result.anchoredMonth = data.anchoredMonth;
  }
  return result;
}

// Persist before changing React state. Roll back if browser storage rejects a write.
export function persistImportedSave(storage, current, incoming) {
  const keys = ['checkedItems', 'confidantRanks', 'socialStats', 'anchoredMonth'];
  const entries = [
    [PREVIOUS_SAVE_KEY, JSON.stringify(current)],
    ...keys.map(key => [`p5r_${key}`, key === 'anchoredMonth' ? incoming[key] : JSON.stringify(incoming[key])]),
  ];
  const previous = entries.map(([key]) => [key, storage.getItem(key)]);
  try {
    for (const [key, value] of entries) storage.setItem(key, value);
  } catch {
    for (const [key, value] of previous) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } catch { /* Keep attempting the remaining keys. */ }
    }
    throw new Error('Browser storage could not save the import. Your current progress has not been changed. Download a backup and free some storage before trying again.');
  }
}
