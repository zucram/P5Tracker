import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesLookup } from '../../public/guides/lookup.js';

test('guide search handles clue fragments, punctuation, accents and word order', () => {
  assert.ok(matchesLookup('Hanami: cherry (?) viewing Blossom', 'cherry viewing'));
  assert.ok(matchesLookup('Cafe Leblanc', 'Café'));
  assert.ok(matchesLookup('36 Ancient god of theater Dionysus', 'DIONYSUS 36'));
  assert.ok(matchesLookup('Any entry', ''));
  assert.equal(matchesLookup('Gold medal', 'gold silver'), false);
});

test('puzzle and request numbers match whole numbers, including leading zeros', () => {
  assert.ok(matchesLookup('#1 Bring a muscle drink', '01'));
  for (const text of ['#11 drink', '#21 drink', '#101 drink']) assert.equal(matchesLookup(text, '1'), false);
  assert.ok(matchesLookup('#101 request', '#101'));
  assert.equal(matchesLookup('2 Old Document 1', '1', '2'), false);
  assert.ok(matchesLookup('2 Old Document 1', 'document 1', '2'));
  assert.ok(matchesLookup('1 Muscle drink', '#01', '1'));
});
