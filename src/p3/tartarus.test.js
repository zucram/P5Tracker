import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const { blocks } = JSON.parse(readFileSync(new URL('../../knowledge/p3-reload/tartarus.json', import.meta.url)));

test('Tartarus sections cover every floor from 2 through 264 without gaps', () => {
  assert.equal(blocks.length, 11);
  assert.equal(blocks[0].fromFloor, 2);
  assert.equal(blocks.at(-1).toFloor, 264);
  blocks.forEach((block, i) => {
    assert.ok(block.toFloor <= block.blockEndFloor);
    assert.ok(block.sources.length > 0);
    if (i) assert.equal(block.fromFloor, blocks[i - 1].toFloor + 1);
  });
});

test('January barrier cap is distinct from final tower boundary', () => {
  const january = blocks.find(block => block.id === 'adamah-lower');
  assert.equal(january.start, '01-01');
  assert.equal(january.toFloor, 256);
  assert.equal(january.blockEndFloor, 264);
  assert.equal(blocks.at(-1).start, '01-31');
  assert.equal(blocks.find(block => block.id === 'yabbashah-lower').start, '07-09');
  assert.equal(blocks.find(block => block.id === 'harabah-upper').start, '12-10');
});
