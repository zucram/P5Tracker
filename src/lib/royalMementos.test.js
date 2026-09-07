import test from 'node:test';
import assert from 'node:assert/strict';
import { APP_DATA } from '../data/gameData.js';
import { parseSave } from './saveData.js';

const requests = APP_DATA.mementos.flatMap(path => path.requests.map(request => ({ ...request, path: path.id })));
const byId = new Map(requests.map(request => [request.id, request]));

test('reviewed Mementos requests retain their existing IDs when corrected or moved', () => {
  for (const id of ['r0', 'ra1', 'ra2', 'ra3', 'rc1', 'rc2', 'rc3', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6']) assert.ok(byId.has(id), id);
  assert.equal(byId.size, requests.length);
  assert.equal(requests.length, 20);
  assert.equal(byId.get('r4').name, 'A Teacher Maid to Suffer');
  assert.equal(byId.get('r4').path, 'mem_c');
  assert.equal(byId.get('r4').reward, 'Envy Chain');
  assert.equal(byId.get('r2').path, 'mem_kaitul');
  assert.equal(byId.get('r3').path, 'mem1');
  assert.equal(byId.get('r6').path, 'mem1');
  assert.equal(byId.get('r6').reward, 'High Counter skill card');
  assert.equal(byId.get('r5').path, 'mem2');
  assert.match(byId.get('r5').tip, /Tower Rank 8/);
  assert.match(byId.get('r1').tip, /Sojiro/);
  assert.equal(byId.get('r1').path, 'mem_confidant_visit');
  assert.equal(byId.get('r0').reward, 'Attachment Pearl');
  assert.equal(byId.get('ra1').reward, 'Protein');
  assert.equal(byId.get('ra3').reward, 'Cat Brooch');
  assert.equal(byId.get('rc2').reward, 'Old Key');
});

test('a retired placeholder never completes newly added Royal requests', () => {
  assert.equal(byId.has('r7'), false);
  const parsed = parseSave(JSON.stringify({ checkedItems: { r7: true, r4: true, j5: true } }));
  assert.equal(parsed.checkedItems.r7, true);
  assert.equal(parsed.checkedItems.r4, true);
  for (const id of ['mem_small_cry_help', 'mem_young_sister', 'mem_idol_unicorn', 'mem_fake_man_show']) {
    assert.ok(byId.has(id));
    assert.equal(parsed.checkedItems[id], undefined);
  }
});

test('calendar activity corrections keep event IDs without fabricated deadlines', () => {
  const tasks = new Map(APP_DATA.months.flatMap(month => month.tasks.map(task => [task.id, { ...task, month: month.id }])));
  assert.match(tasks.get('jun_justice').text, /6\/10.*automatically/);
  assert.match(tasks.get('s3').text, /^9\/10:/);
  assert.match(tasks.get('o3').text, /^10\/26:/);
  assert.match(tasks.get('july_kawakami_10').text, /^Strategy:/);
  assert.doesNotMatch(tasks.get('july_kawakami_10').text, /CRITICAL|DEADLINE|7\/24/);
  assert.doesNotMatch(tasks.get('j3').text, /7\/24|Last day/);
  assert.equal(tasks.get('j5').month, 'september');
  assert.match(tasks.get('j5').text, /Sojiro.*Hierophant Rank 8/);
});
