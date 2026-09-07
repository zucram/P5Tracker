import test from 'node:test';
import assert from 'node:assert/strict';
import { trackerShareUrl } from './shareUrl.js';

test('public share links use the correct game and contain only fixed campaign tags', () => {
  for (const [game, path] of [['home', ''], ['royal', 'p5/'], ['reload', 'p3/']]) {
    const url = new URL(trackerShareUrl(game));
    assert.equal(url.origin, 'https://zucram.github.io');
    assert.equal(url.pathname, `/P5Tracker/${path}`);
    assert.equal(url.hash, '');
    assert.deepEqual(Object.fromEntries(url.searchParams), { utm_source: 'app', utm_medium: 'share', utm_campaign: 'player_referral' });
  }
  assert.throws(() => trackerShareUrl('../secret'));
});
