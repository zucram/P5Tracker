import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRequirement } from '../../public/guides/third-semester/check.js';
import { APP_DATA } from '../data/gameData.js';
import { CONFIDANT_INTERACTIONS } from '../data/confidantData.js';

test('rank 8 is incomplete before the deadline and missed after it', () => {
  assert.equal(checkRequirement(8, 'before').title, 'The requirement is not met yet');
  assert.equal(checkRequirement(8, 'after').title, 'The deadline has passed');
});

test('rank 9 and MAX meet the confidant requirement without promising an ending', () => {
  for (const rank of [9, 10]) {
    assert.equal(checkRequirement(rank, 'after').title, 'The confidant requirement is met');
    assert.match(checkRequirement(rank, 'before').text, /does not evaluate later ending choices/);
  }
});

test('early cap differs from missed deadline and rejects impossible early ranks', () => {
  assert.equal(checkRequirement(5, 'early').title, 'Rank 5 is the expected time gate');
  assert.equal(checkRequirement(9, 'early').title, 'Check the date or rank');
  assert.equal(checkRequirement(4, 'early').title, 'The requirement is not met yet');
});

test('invalid input never reports success', () => {
  for (const rank of [-1, 11, 1.5, NaN, '9']) assert.equal(checkRequirement(rank, 'before').title, 'Choose your rank and date range');
  assert.equal(checkRequirement(9, '').title, 'Choose your rank and date range');
});

test('Royal character milestones distinguish the semester unlock from optional content', () => {
  const byArcana = Object.fromEntries(APP_DATA.confidants.map(c => [c.arcana, c]));
  assert.equal(byArcana.Councillor.target, 9);
  assert.equal(byArcana.Councillor.deadline, '11/17');
  assert.equal(byArcana.Justice.target, 8);
  assert.match(byArcana.Justice.notes, /not the semester unlock/);
  assert.equal(byArcana.Faith.deadline, '12/22');
  assert.match(byArcana.Faith.notes, /her confidant continue/);
  const december = APP_DATA.months.find(month => month.id === 'december').tasks;
  assert.doesNotMatch(december.find(task => task.id === 'dec_faith').text, /12\/18 DEADLINE/);
  assert.match(december.find(task => task.id === 'd2').text, /12\/22 DEADLINE/);
  assert.notEqual(CONFIDANT_INTERACTIONS.Faith.ranks[10][0], 'Automatic in 3rd Semester.');
});
