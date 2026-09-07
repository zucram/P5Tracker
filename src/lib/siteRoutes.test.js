import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyDestination } from './siteRoutes.js';

test('existing Reload and directory URLs preserve query and fragments when moved', () => {
  assert.equal(legacyDestination({pathname:'/P5Tracker/games/persona-3-reload/',search:'?utm_source=reddit',hash:'#calendar'}),'/P5Tracker/p3/?utm_source=reddit#calendar');
  assert.equal(legacyDestination({pathname:'/P5Tracker/games/persona-3-reload/index.html',hash:'#backup'}),'/P5Tracker/p3/#backup');
  assert.equal(legacyDestination({pathname:'/P5Tracker/games/'}),'/P5Tracker/');
});

test('old Royal deep links still open Royal while the bare root and game routes stay put', () => {
  for (const hash of ['briefing','calendar','confidants','metaverse','more','registry','reference']) assert.equal(legacyDestination({pathname:'/P5Tracker/',hash:'#'+hash}),'/P5Tracker/p5/#'+hash);
  for (const pathname of ['/P5Tracker/','/P5Tracker/p5/','/P5Tracker/p3/']) assert.equal(legacyDestination({pathname}),null);
  assert.equal(legacyDestination({pathname:'/P5Tracker/',hash:'#games'}),null);
  assert.equal(legacyDestination({pathname:'/P5Tracker/',hash:'#https://example.com'}),null);
});
