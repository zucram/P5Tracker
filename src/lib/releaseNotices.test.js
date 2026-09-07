import test from 'node:test';
import assert from 'node:assert/strict';
import { isVersionNewer } from './releaseNotices.js';

test('release notices compare version numbers and tolerate old preference values', () => {
  assert.equal(isVersionNewer('2.6.6', '2.6.5'), true);
  assert.equal(isVersionNewer('2.6.6', '2.6.6'), false);
  assert.equal(isVersionNewer('2.6.6', '2.7.0'), false);
  assert.equal(isVersionNewer('2.10.0', '2.9.9'), true);
  assert.equal(isVersionNewer('2.6.6', 'unknown'), true);
  assert.equal(isVersionNewer('invalid', '2.6.6'), false);
});
