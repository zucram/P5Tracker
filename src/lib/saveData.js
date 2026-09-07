import { APP_DATA } from '../data/gameData.js';

export const MAX_SAVE_BYTES = 1024 * 1024;
export const PREVIOUS_SAVE_KEY = 'p5r_previousSave';
export const ORIGINAL_SAVE_KEY = 'p5r_unreadableSave';
const saveFields = ['checkedItems', 'confidantRanks', 'socialStats', 'anchoredMonth'];
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
export function persistImportedSave(storage, current, incoming, original = null) {
  const entries = [
    [PREVIOUS_SAVE_KEY, JSON.stringify(current)],
    ...(original ? [[ORIGINAL_SAVE_KEY, JSON.stringify(original)]] : []),
    ...saveEntries(incoming),
  ];
  try { persistEntries(storage, entries); } catch {
    throw new Error('Browser storage could not save the import. Your current progress has not been changed. Download a backup and free some storage before trying again.');
  }
}

function saveEntries(save) {
  return saveFields.map(key => [`p5r_${key}`, key === 'anchoredMonth' ? save[key] : JSON.stringify(save[key])]);
}

function persistEntries(storage, entries) {
  const previous = entries.map(([key]) => [key, storage.getItem(key)]);
  try {
    for (const [key, value] of entries) storage.setItem(key, value);
  } catch {
    for (const [key, value] of previous) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } catch { /* Keep attempting the remaining keys. */ }
    }
    throw new Error('Browser storage could not save every field.');
  }
}

export function persistProgress(storage, save) {
  persistEntries(storage, saveEntries(save));
}

export function loadStoredSave(storage) {
  const save = {
    checkedItems: {},
    confidantRanks: Object.fromEntries(APP_DATA.confidants.map(c => [c.arcana, 0])),
    socialStats: Object.fromEntries(stats.map(stat => [stat, 1])),
    anchoredMonth: 'april',
  };
  const raw = {};
  let unreadable = false;
  let inaccessible = false;
  for (const field of saveFields) {
    const key = `p5r_${field}`;
    try { raw[key] = storage.getItem(key); } catch { inaccessible = true; continue; }
    if (raw[key] === null) continue;
    try {
      const value = field === 'anchoredMonth' ? raw[key] : JSON.parse(raw[key]);
      const validated = parseSave(JSON.stringify({ checkedItems: {}, [field]: value }));
      save[field] = validated[field];
    } catch { unreadable = true; }
  }
  let original = unreadable ? raw : null;
  if (!original) {
    try {
      const recovered = JSON.parse(storage.getItem(ORIGINAL_SAVE_KEY));
      if (isRecord(recovered) && Object.entries(recovered).every(([key, value]) => saveFields.some(field => key === `p5r_${field}`) && (value === null || typeof value === 'string'))) original = recovered;
    } catch { /* An optional recovery copy does not affect the active save. */ }
  }
  return {
    save,
    original,
    canSave: !unreadable && !inaccessible,
    failure: unreadable ? 'unreadable' : inaccessible ? 'unavailable' : null,
    warning: unreadable
      ? 'Some saved progress could not be read. Automatic saving is paused to protect the original. Download the original data before importing a backup.'
      : inaccessible
        ? 'Browser storage is unavailable. You can use the tracker, but progress stays only in this tab. Download a backup before closing it.'
        : '',
  };
}
