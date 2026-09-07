import knowledge from '../../knowledge/p3-reload/facts.json' with { type: 'json' };
import tartarus from '../../knowledge/p3-reload/tartarus.json' with { type: 'json' };
import { ALL_GUIDE_TASK_IDS } from './monthGuide.js';
import school from '../../knowledge/p3-reload/school-answers.json' with { type: 'json' };
import { SOCIAL_LINKS, SOCIAL_STATS, MONTHS } from './data.js';
import saveCatalog from './saveCatalog.json' with { type: 'json' };
import { COLLECTION_IDS, DORM_ACTIVITY_IDS, ROMANCE_LINK_IDS } from './campaignData.js';

export const STORAGE_KEY = 'p3reload_state_v1';
export const BACKUP_KEY = 'p3reload_previous_v1';
export const MAX_BYTES = 1024 * 1024;
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor']);
const hasControls = value => [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
const linkIds = SOCIAL_LINKS.map(link => link.id);
const manualLinkIds = SOCIAL_LINKS.filter(link => link.kind !== 'story').map(link => link.id);
const eventIds = new Set([...knowledge.facts.map(fact => fact.id), ...saveCatalog.requestIds]);
const taskIds = new Set([...ALL_GUIDE_TASK_IDS, ...tartarus.blocks.map(block => `tartarus-${block.id}`), ...school.entries.map(entry => entry.id)]);
const monthNumbers = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1];
const monthIds = MONTHS.map(month => month.id);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function initialState() {
  return {
    schemaVersion: 2,
    game: 'persona-3-reload',
    month: 'april',
    date: '04-22',
    slot: 'daytime',
    completedEvents: [],
    checkedTasks: [],
    unlockedLinks: [],
    showEventNames: false,
    ranks: Object.fromEntries(linkIds.map(id => [id, 0])),
    stats: Object.fromEntries(SOCIAL_STATS.map(stat => [stat, 1])),
    goals: [],
    showNames: false,
    favorites: [],
    registeredPersonas: [],
    enabledDlcPersonas: [],
    collectionChecks: [],
    dormActivities: Object.fromEntries(DORM_ACTIVITY_IDS.map(id => [id, 0])),
    relationshipRoutes: Object.fromEntries(ROMANCE_LINK_IDS.map(id => [id, 'undecided'])),
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

function validateIds(value, allowed, limit, label) {
  if (!Array.isArray(value) || value.length > limit || new Set(value).size !== value.length || value.some(id => typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(id) || forbiddenKeys.has(id) || !allowed.has(id))) {
    throw new Error(`${label} contain an invalid or repeated ID.`);
  }
}

export function parseState(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) throw new Error('Choose a save smaller than 1 MB.');
  let state;
  try { state = JSON.parse(text); } catch { throw new Error('The save is not valid JSON.'); }
  if (!record(state) || ![1, 2].includes(state.schemaVersion) || state.game !== 'persona-3-reload') throw new Error('Choose a Persona 3 Reload tracker save, version 1 or 2.');
  if (Object.keys(state).some(key => forbiddenKeys.has(key))) throw new Error('The save contains an invalid field.');
  if (!monthIds.includes(state.month)) throw new Error('The selected month is invalid.');
  const legacy = state.schemaVersion === 1;
  const date = legacy ? `${String(monthNumbers[monthIds.indexOf(state.month)]).padStart(2, '0')}-01` : state.date;
  if (typeof date !== 'string' || !/^\d{2}-\d{2}$/.test(date)) throw new Error('The selected date is invalid.');
  const [month, day] = date.split('-').map(Number);
  const calendarDate = new Date(Date.UTC(month === 1 ? 2010 : 2009, month - 1, day));
  if (!monthNumbers.includes(month) || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) throw new Error('The selected date is invalid.');
  if (monthIds[monthNumbers.indexOf(month)] !== state.month) throw new Error('The selected month does not match the date.');
  const slot = legacy ? 'daytime' : state.slot;
  if (!['daytime', 'evening'].includes(slot)) throw new Error('The selected time slot is invalid.');
  const completedEvents = legacy ? [] : state.completedEvents;
  validateIds(completedEvents, eventIds, 300, 'Completed events');
  const checkedTasks = legacy || state.checkedTasks === undefined ? [] : state.checkedTasks;
  validateIds(checkedTasks, taskIds, 500, 'Checklist tasks');
  const unlockedLinks = legacy ? [] : state.unlockedLinks;
  validateIds(unlockedLinks, new Set(manualLinkIds), manualLinkIds.length, 'Confirmed introductions');
  const showEventNames = legacy ? false : state.showEventNames;
  if (typeof showEventNames !== 'boolean') throw new Error('The event name display setting is invalid.');
  const registeredPersonas = state.registeredPersonas === undefined ? [] : state.registeredPersonas;
  validateIds(registeredPersonas, new Set(saveCatalog.personaIds), saveCatalog.personaIds.length, 'Registered Personas');
  const enabledDlcPersonas = state.enabledDlcPersonas === undefined ? [] : state.enabledDlcPersonas;
  validateIds(enabledDlcPersonas, new Set(saveCatalog.dlcIds), saveCatalog.dlcIds.length, 'DLC Personas');
  const collectionChecks = state.collectionChecks === undefined ? [] : state.collectionChecks;
  validateIds(collectionChecks, new Set(COLLECTION_IDS), COLLECTION_IDS.length, 'Collections');
  const dormActivities = state.dormActivities === undefined ? Object.fromEntries(DORM_ACTIVITY_IDS.map(id => [id, 0])) : state.dormActivities;
  validateRanks(dormActivities, DORM_ACTIVITY_IDS, 0, 3, 'Dorm activities');
  const relationshipRoutes = state.relationshipRoutes === undefined ? Object.fromEntries(ROMANCE_LINK_IDS.map(id => [id, 'undecided'])) : state.relationshipRoutes;
  if (!record(relationshipRoutes) || Object.keys(relationshipRoutes).length !== ROMANCE_LINK_IDS.length || Object.entries(relationshipRoutes).some(([id, route]) => !ROMANCE_LINK_IDS.includes(id) || !['undecided', 'friendship', 'romance'].includes(route))) throw new Error('Relationship routes contain an invalid link or choice.');
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
    schemaVersion: 2,
    game: 'persona-3-reload',
    month: state.month,
    date,
    slot,
    completedEvents: [...completedEvents],
    checkedTasks: [...checkedTasks],
    unlockedLinks: [...unlockedLinks],
    showEventNames,
    ranks: { ...state.ranks },
    stats: { ...state.stats },
    goals,
    showNames: state.showNames,
    favorites: [...state.favorites],
    registeredPersonas: [...registeredPersonas],
    enabledDlcPersonas: [...enabledDlcPersonas],
    collectionChecks: [...collectionChecks],
    dormActivities: { ...dormActivities },
    relationshipRoutes: { ...relationshipRoutes },
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
