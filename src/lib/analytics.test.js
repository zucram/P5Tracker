import test from 'node:test';
import assert from 'node:assert/strict';
import { trackEvent } from './analytics.js';

test('analytics failures never escape into progress or transfer actions', async () => {
  const original = globalThis.window;
  try {
    delete globalThis.window;
    assert.doesNotThrow(() => trackEvent('tracker_used'));
    globalThis.window = {};
    assert.doesNotThrow(() => trackEvent('tracker_used'));
    globalThis.window.umami = { track() { throw new Error('Blocked'); } };
    assert.doesNotThrow(() => trackEvent('tracker_used'));
    globalThis.window.umami.track = () => Promise.reject(new Error('Offline'));
    assert.doesNotThrow(() => trackEvent('tracker_used'));
    await new Promise(resolve => globalThis.setImmediate(resolve));
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});
