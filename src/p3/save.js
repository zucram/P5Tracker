import { SOCIAL_LINKS, SOCIAL_STATS, MONTHS } from './data.js';

export const STORAGE_KEY = 'p3reload_state_v1';
export const BACKUP_KEY = 'p3reload_previous_v1';
export const MAX_BYTES = 1024 * 1024;
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);
const hasControls = value => [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
const linkIds = SOCIAL_LINKS.map(link => link.id);
const monthIds = MONTHS.map(month => month.id);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function initialState() {
  return {
    schemaVersion: 1,
    game: 'persona-3-reload',
    month: 'april',
    ranks: Object.fromEntries(linkIds.map(id => [id, 0])),
    stats: Object.fromEntries(SOCIAL_STATS.map(stat => [stat, 1])),
    goals: [],
    showNames: false,
    favorites: [],
  };
}

function validateRanks(value, ids, min, max, label) {
  if (!record(value) || Object.keys(value).length !== ids.length) throw new Error(`${label} are missing or invalid.`);
  for (const [id, rank] of Object.entries(value)) {
    if (forbiddenKeys.has(id) || !ids.includes(id) || !Number.isInteger(rank) || rank < min || rank > max) {
      throw new Error(`${label} contain an invalid ID or rank.`);
    }
  }
}

export function parseState(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('Choose a save smaller than 1 MB.');
  let state;
  try { state = JSON.parse(text); } catch { throw new Error('The save is not valid JSON.'); }
  if (!record(state) || state.schemaVersion !== 1 || state.game !== 'persona-3-reload') throw new Error('Choose a Persona 3 Reload tracker save, version 1.');
  if (Object.keys(state).some(key => forbiddenKeys.has(key))) throw new Error('The save contains an invalid field.');
  if (!monthIds.includes(state.month)) throw new Error('The selected month is invalid.');
  validateRanks(state.ranks, linkIds, 0, 10, 'Social Link ranks');
  validateRanks(state.stats, SOCIAL_STATS, 1, 6, 'Social stats');
  if (typeof state.showNames !== 'boolean') throw new Error('The name display setting is invalid.');
  if (!Array.isArray(state.favorites) || state.favorites.length > linkIds.length || new Set(state.favorites).size !== state.favorites.length || state.favorites.some(id => !linkIds.includes(id))) throw new Error('Favorites contain an invalid or repeated Social Link.');
  if (!Array.isArray(state.goals) || state.goals.length > 100) throw new Error('A save can contain at most 100 goals.');
  const goalIds = new Set();
  const goals = state.goals.map(goal => {
    if (!record(goal) || Object.keys(goal).some(key => forbiddenKeys.has(key)) || typeof goal.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(goal.id) || forbiddenKeys.has(goal.id) || goalIds.has(goal.id) || typeof goal.text !== 'string' || goal.text.trim().length === 0 || goal.text.length > 200 || hasControls(goal.text) || !monthIds.includes(goal.month) || typeof goal.done !== 'boolean') {
      throw new Error('A goal has an invalid ID, text, month, or completion value.');
    }
    goalIds.add(goal.id);
    return { id: goal.id, text: goal.text, month: goal.month, done: goal.done };
  });
  // Keep only the defined schema fields; exports cannot introduce new settings.
  return {
    schemaVersion: 1,
    game: 'persona-3-reload',
    month: state.month,
    ranks: { ...state.ranks },
    stats: { ...state.stats },
    goals,
    showNames: state.showNames,
    favorites: [...state.favorites],
  };
}

export function loadState(storage) {
  let text;
  try { text = storage.getItem(STORAGE_KEY); }
  catch { return { state: initialState(), warning: 'Browser storage is unavailable. Download your progress before closing this page.' }; }
  if (text === null) return { state: initialState(), warning: null };
  try { return { state: parseState(text), warning: null }; }
  catch { return { state: initialState(), warning: 'The stored save could not be read. It has been kept unchanged. Download it for recovery or explicitly import a valid save to replace it.' }; }
}

export function persistState(storage, state) {
  const validated = parseState(JSON.stringify(state));
  storage.setItem(STORAGE_KEY, JSON.stringify(validated));
}

export function importState(storage, current, text) {
  const incoming = parseState(text);
  const backup = JSON.stringify(parseState(JSON.stringify(current)));
  const previous = [[BACKUP_KEY, storage.getItem(BACKUP_KEY)], [STORAGE_KEY, storage.getItem(STORAGE_KEY)]];
  try {
    storage.setItem(BACKUP_KEY, backup);
    storage.setItem(STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    for (const [key, value] of previous) {
      try {
        if (value === null) storage.removeItem(key);
        else storage.setItem(key, value);
      } catch { /* Try every key even when storage remains unavailable. */ }
    }
    throw new Error('The save could not be imported because browser storage is unavailable. Your current progress has not been changed.');
  }
  return incoming;
}
