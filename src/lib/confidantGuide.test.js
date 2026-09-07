import test from 'node:test';
import assert from 'node:assert/strict';
import { unmetConfidantStatGates } from '../data/socialStats.js';
import { confidantRankSteps } from './confidantGuide.js';
import { CONFIDANT_INTERACTIONS } from '../data/confidantData.js';

test('story introductions do not require stats but their second ranks do', () => {
  for (const [arcana, level] of [['Lovers', 2], ['Hermit', 4]]) {
    assert.deepEqual(unmetConfidantStatGates(arcana, 0), []);
    assert.deepEqual(unmetConfidantStatGates(arcana, 1), [{ stat: 'Kindness', lvl: level }]);
    assert.deepEqual(unmetConfidantStatGates(arcana, 1, { Kindness: level }), []);
  }
  assert.deepEqual(unmetConfidantStatGates('Devil', 0), []);
  assert.deepEqual(unmetConfidantStatGates('Tower', 0), []);
  assert.match(CONFIDANT_INTERACTIONS.Empress.tips, /10\/30/);
});

test('Justice rank 3 checks both Knowledge and Charm independently', () => {
  assert.deepEqual(unmetConfidantStatGates('Justice', 2), [{ stat: 'Knowledge', lvl: 3 }, { stat: 'Charm', lvl: 3 }]);
  assert.deepEqual(unmetConfidantStatGates('Justice', 2, { Knowledge: 3, Charm: 2 }), [{ stat: 'Charm', lvl: 3 }]);
  assert.deepEqual(unmetConfidantStatGates('Justice', 2, { Knowledge: 2, Charm: 3 }), [{ stat: 'Knowledge', lvl: 3 }]);
  assert.deepEqual(unmetConfidantStatGates('Justice', 2, { Knowledge: 3, Charm: 3 }), []);
  assert.deepEqual(unmetConfidantStatGates('Justice', 6, { Knowledge: 3 }), [{ stat: 'Knowledge', lvl: 4 }]);
});

test('Iwai needs Guts 5 after rank 7, and ordinary single-stat gates still work', () => {
  assert.deepEqual(unmetConfidantStatGates('Hanged', 6, { Guts: 4 }), []);
  assert.deepEqual(unmetConfidantStatGates('Hanged', 7, { Guts: 4 }), [{ stat: 'Guts', lvl: 5 }]);
  assert.deepEqual(unmetConfidantStatGates('Hanged', 7, { Guts: 5 }), []);
  assert.deepEqual(unmetConfidantStatGates('Empress', 1, { Proficiency: 4 }), [{ stat: 'Proficiency', lvl: 5 }]);
  assert.deepEqual(unmetConfidantStatGates('Fool'), []);
});

test('all ten Royal Strength requests remain visible as guide steps', () => {
  assert.deepEqual(Array.from({ length: 10 }, (_, rank) => confidantRankSteps('Strength', rank)[0]), [
    'Jack Frost with Mabufu', 'Ame-no-Uzume with Frei', 'Flauros with Tarukaja', 'Phoenix with Counter',
    'Setanta with Rakukaja', 'Neko Shogun with Dekaja', 'Lachesis with Tetraja',
    'Hecatoncheires with Masukunda', 'Bugs with Samarecarm', 'Seth with High Counter',
  ]);
});

test('rank guides handle automatic, dialogue, missing and completed steps', () => {
  assert.deepEqual(confidantRankSteps('Fool', 0), ['Automatic']);
  assert.equal(confidantRankSteps('Lovers', 1).length, 4);
  assert.match(confidantRankSteps('not-a-confidant', 0)[0], /No rank guide/);
  assert.match(confidantRankSteps('Strength', 10)[0], /maximum confidant rank/);
});
