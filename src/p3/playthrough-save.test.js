import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, parseState, persistState, importState, STORAGE_KEY, BACKUP_KEY } from './save.js';
import { COLLECTION_IDS, DORM_ACTIVITY_IDS } from './campaignData.js';
import { PERSONA_IDS, DLC_PERSONAS } from './fusion.js';
import requests from '../../knowledge/p3-reload/requests.json' with { type: 'json' };

const parse = state => parseState(JSON.stringify(state));
test('released saves gain companion fields without losing ranks or timed request progress', () => {
  const old = initialState();
  for (const field of ['registeredPersonas', 'enabledDlcPersonas', 'collectionChecks', 'dormActivities', 'relationshipRoutes']) delete old[field];
  old.ranks.priestess = 8;
  old.completedEvents = ['request-12', 'request-44-beach'];
  const result = parse(old);
  assert.equal(result.ranks.priestess, 8);
  assert.deepEqual(result.completedEvents, old.completedEvents);
  assert.deepEqual(result.registeredPersonas, []);
  assert.equal(result.dormActivities['yukari-cooking'], 0);
  assert.equal(result.relationshipRoutes.priestess, 'undecided');
  assert.equal(old.relationshipRoutes, undefined);
});
test('all systems survive a complete export/import and leave Royal keys unchanged', () => {
  const state = initialState();
  state.completedEvents = [...requests.entries.map(entry => entry.id), 'request-44-beach', 'request-96-kyoto'];
  state.registeredPersonas = [...PERSONA_IDS];
  state.enabledDlcPersonas = DLC_PERSONAS.map(persona => persona.id);
  state.collectionChecks = [...COLLECTION_IDS];
  state.dormActivities = Object.fromEntries(DORM_ACTIVITY_IDS.map(id => [id, 3]));
  state.relationshipRoutes.priestess = 'friendship';
  state.relationshipRoutes.lovers = 'romance';
  const map = new Map([['p5r_checkedItems', '["existing-royal-progress"]']]);
  const storage = { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) };
  persistState(storage, state);
  const imported = importState(storage, initialState(), map.get(STORAGE_KEY));
  assert.deepEqual(imported, state);
  assert.equal(map.get('p5r_checkedItems'), '["existing-royal-progress"]');
  assert.deepEqual(JSON.parse(map.get(BACKUP_KEY)), initialState());
});
test('invalid new progress cannot enter an imported save', () => {
  const invalid = [
    ['registeredPersonas', ['persona-from-royal']], ['registeredPersonas', ['orpheus', 'orpheus']],
    ['enabledDlcPersonas', ['orpheus']], ['collectionChecks', ['request-1']],
    ['dormActivities', { ...initialState().dormActivities, 'yukari-cooking': 4 }],
    ['relationshipRoutes', { ...initialState().relationshipRoutes, priestess: 'married' }],
    ['relationshipRoutes', { ...initialState().relationshipRoutes, magician: 'romance' }],
    ...['registeredPersonas', 'enabledDlcPersonas', 'collectionChecks', 'dormActivities', 'relationshipRoutes'].map(key => [key, null]),
  ];
  for (const [key, value] of invalid) assert.throws(() => parse({ ...initialState(), [key]: value }), undefined, key);
});
