import test from 'node:test';
import assert from 'node:assert/strict';
import { gameDateOrdinal, validateKnowledge } from './validate-p3-knowledge.mjs';

function fixture() {
  return {
    sources: { sources: [{ id: 'guide', url: 'https://example.com/' }] },
    facts: { schemaVersion: 1, game: 'persona-3-reload', reviewedAt: '2026-09-07', releaseReady: false, facts: [
      { id: 'window', category: 'social-link', kind: 'constraint', status: 'single-source', subject: 'Window', value: { start: '12-20', end: '01-15', dateMeaning: 'outer-window' }, evidence: [{ sourceId: 'guide', url: 'https://example.com/guide', locator: 'January', supports: ['value.start', 'value.end'] }], spoiler: 'character' },
    ] },
    months: { schemaVersion: 1, months: [{ id: '01', name: 'January', factIds: ['window'], priorities: ['Check remaining prerequisites'], gaps: ['Availability exceptions need review'] }] },
    disputes: { schemaVersion: 1, disputes: [] },
  };
}

test('game dates use April–January chronology and reject impossible or out-of-campaign dates', () => {
  assert.ok(gameDateOrdinal('12-31') < gameDateOrdinal('01-01'));
  assert.ok(gameDateOrdinal('04-01') < gameDateOrdinal('12-31'));
  for (const invalid of ['04-31', '00-01', '01-00', '02-01', '03-31', '1-01', '2026-01-01']) assert.equal(gameDateOrdinal(invalid), null, invalid);
  assert.deepEqual(validateKnowledge(fixture()), []);
  const data = fixture();
  data.facts.facts[0].value = { start: '01-15', end: '12-20' };
  assert.ok(validateKnowledge(data).some(error => error.includes('window starts after')));
});

test('source, supported field, dependency, month and dispute references must resolve', () => {
  const data = fixture();
  data.facts.facts[0].evidence[0].sourceId = 'missing-source';
  data.facts.facts[0].evidence[0].supports = ['value.nonexistent'];
  data.facts.facts[0].dependsOn = ['missing-fact'];
  data.facts.facts[0].disputeIds = ['missing-dispute'];
  data.months.months[0].factIds = ['missing-month-fact'];
  const errors = validateKnowledge(data).join('\n');
  for (const missing of ['missing-source', 'value.nonexistent', 'missing-fact', 'missing-dispute', 'missing-month-fact']) assert.match(errors, new RegExp(missing));
  const arraySources = fixture();
  arraySources.sources = arraySources.sources.sources;
  assert.deepEqual(validateKnowledge(arraySources), []);
});

test('dependency graph rejects self and multi-fact cycles', () => {
  const data = fixture();
  data.facts.facts[0].dependsOn = ['window'];
  assert.match(validateKnowledge(data).join('\n'), /cycle window -> window/);
  data.facts.facts.push({ ...structuredClone(data.facts.facts[0]), id: 'other', dependsOn: ['window'] });
  data.facts.facts[0].dependsOn = ['other'];
  assert.match(validateKnowledge(data).join('\n'), /cycle window -> other -> window/);
});

test('route choices cannot become deadlines and unresolved claims cannot be release-ready', () => {
  const route = fixture();
  Object.assign(route.facts.facts[0], { kind: 'route-choice' });
  route.facts.facts[0].value.dateMeaning = 'hard-deadline';
  assert.match(validateKnowledge(route).join('\n'), /route choice cannot/);
  const disputed = fixture();
  disputed.facts.releaseReady = true;
  disputed.facts.facts[0].status = 'disputed';
  disputed.facts.facts[0].definitive = true;
  assert.match(validateKnowledge(disputed).join('\n'), /prevent a releaseReady/);
  assert.match(validateKnowledge(disputed).join('\n'), /cannot be definitive/);
  disputed.facts.releaseReady = false;
  delete disputed.facts.facts[0].definitive;
  disputed.facts.facts[0].value.dateMeaning = 'conservative-reminder';
  assert.deepEqual(validateKnowledge(disputed), []);
});

test('open disputes must mark affected facts disputed even without reverse references', () => {
  const data = fixture();
  data.disputes.disputes.push({ id: 'conflict', subject: 'End date', status: 'open', decision: 'Keep an early reminder', affectedFactIds: ['window'], claims: [{ sourceId: 'guide', claim: 'A conflicting date' }] });
  assert.match(validateKnowledge(data).join('\n'), /must be marked disputed/);
});

test('malformed dates, duplicate IDs and unsupported classifications fail validation', () => {
  const data = fixture();
  data.facts.reviewedAt = '2026-02-30';
  data.facts.facts[0].kind = 'deadline';
  data.facts.facts[0].status = 'verified';
  data.facts.facts.push(structuredClone(data.facts.facts[0]));
  const errors = validateKnowledge(data).join('\n');
  for (const pattern of [/reviewedAt/, /duplicate id/, /invalid kind/, /invalid status/]) assert.match(errors, pattern);
});
