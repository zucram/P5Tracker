import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SOCIAL_LINKS } from './data.js';

const data = JSON.parse(readFileSync(new URL('../../knowledge/p3-reload/social-link-dialogue.json', import.meta.url), 'utf8'));
const link = id => data.links.find(entry => entry.id === id);
const rank = (id, n) => link(id).ranks.find(entry => entry.rank === n);
const choices = entry => entry.steps.flatMap(step => step.choices);

test('dialogue covers each manual link and every rank with actionable content or a sourced free-choice note', () => {
  const manual = SOCIAL_LINKS.filter(entry => entry.kind !== 'story').map(entry => entry.id).sort();
  assert.deepEqual(data.links.map(entry => entry.id).sort(), manual);
  assert.equal(data.links.length, 19);
  assert.equal(data.links.reduce((sum, entry) => sum + entry.ranks.length, 0), 190);
  assert.deepEqual(data.coverage.missingRanks, []);
  for (const entry of data.links) {
    assert.deepEqual(entry.ranks.map(item => item.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const item of entry.ranks) {
      assert.ok(item.steps.length || item.note, `${entry.id} ${item.rank} is empty`);
      assert.ok(item.sources.length, `${entry.id} ${item.rank} lacks evidence`);
      for (const source of item.sources) {
        assert.equal(new URL(source.url).protocol, 'https:');
        assert.ok(source.locator);
      }
    }
  }
});

test('unverified points stay absent and raw points never become musical notes or negative flags', () => {
  for (const entry of data.links) for (const item of entry.ranks) for (const choice of choices(item)) {
    assert.ok(choice.cue);
    assert.ok(choice.index === null || (Number.isInteger(choice.index) && choice.index >= 1 && choice.index <= 4));
    if ('basePoints' in choice) assert.ok([0, 5, 10, 15].includes(choice.basePoints));
    if ('displayNotesWithMatching' in choice) assert.ok([1, 2, 3].includes(choice.displayNotesWithMatching));
  }
  assert.equal(choices(rank('magician', 3))[0].basePoints, 15);
  assert.equal(choices(rank('magician', 2))[0].displayNotesWithMatching, 1);
  const unknown = rank('priestess', 8).steps.find(step => step.route === 'fully platonic').choices[0];
  assert.equal(unknown.index, null);
  assert.equal(Object.hasOwn(unknown, 'basePoints'), false);
  assert.equal(Object.hasOwn(unknown, 'displayNotesWithMatching'), false);
});

test('all six romances have earlier eligibility, a rank-nine decision, and distinct fully platonic guidance', () => {
  const ids = ['priestess', 'empress', 'lovers', 'justice', 'strength', 'aeon'];
  assert.deepEqual(data.links.filter(entry => entry.romance).map(entry => entry.id).sort(), ids.sort());
  for (const id of ids) {
    assert.ok(link(id).romance.flags.length);
    for (const flag of link(id).romance.flags) {
      assert.ok(flag.rank < 9);
      assert.ok(choices(rank(id, flag.rank)).some(choice => choice.cue === flag.choiceCue && choice.effect === 'Romance eligibility'));
    }
    const commitment = rank(id, 9).steps.find(step => step.cue === 'Rank 9 commitment');
    assert.ok(commitment.choices.some(choice => choice.route === 'romance'));
    assert.ok(commitment.choices.some(choice => choice.route === 'friendship'));
    assert.ok(rank(id, 9).steps.some(step => step.route === 'fully platonic'));
  }
  assert.ok(rank('strength', 10).steps.some(step => step.route === 'fully platonic'));
  assert.ok(rank('strength', 10).steps.some(step => step.route === 'friendship after confession'));
});

test('Reload reversal warnings are separate from normal choices and scripted Moon reversal', () => {
  for (const id of ['lovers', 'justice']) {
    assert.ok(choices(rank(id, 5)).some(choice => choice.effect?.startsWith('REVERSES')));
    assert.match(link(id).recovery.note, /three available days/);
    assert.match(link(id).recovery.note, /do not consume a time slot/);
  }
  assert.match(rank('moon', 9).note, /resolves automatically/);
  assert.match(data.relationshipRules.note, /does not reverse links through neglect/);
  assert.match(data.relationshipRules.note, /no permanent Broken/);
});

test('otherwise omitted ranks still include their scene responses and introduction quiz choices', () => {
  for (const id of ['sun', 'devil']) for (let n = 2; n <= 9; n++) assert.ok(rank(id, n).steps.length);
  assert.ok(rank('emperor', 3).steps.length);
  assert.ok(rank('aeon', 8).steps.length);
  assert.deepEqual(choices(rank('tower', 1)).map(choice => choice.index), [4, 2, 2, 4]);
  assert.deepEqual(choices(rank('moon', 1)).map(choice => choice.index), [3, 3, 2]);
  assert.ok(choices(rank('chariot', 2)).some(choice => choice.effect?.includes('Strength')));
});
