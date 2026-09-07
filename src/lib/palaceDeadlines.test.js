import test from 'node:test';
import assert from 'node:assert/strict';
import { APP_DATA } from '../data/gameData.js';
import { CONFIDANT_INTERACTIONS } from '../data/confidantData.js';
import { PALACE_DEADLINES, palaceDeadlineTask } from '../data/palaceDeadlines.js';

test('Royal separates route, card and heist dates, including same-day exceptions', () => {
  assert.deepEqual(PALACE_DEADLINES.map(p => [p.id, p.route, p.card, p.heist]), [
    ['kamoshida', '4/29', '4/30', '5/1'], ['madarame', '6/2', '6/3', '6/4'],
    ['kaneshiro', '7/6', '7/7', '7/8'], ['futaba', '8/19', '8/20', '8/20'],
    ['okumura', '10/8', '10/9', '10/10'], ['niijima', '11/17', '11/18', '11/19'],
    ['shido', '12/16', '12/17', '12/17'], ['maruki', '2/2', '2/2', '2/3'],
  ]);
  assert.equal(PALACE_DEADLINES.find(p => p.id === 'madarame').firstVisit, '5/31');
  assert.equal(PALACE_DEADLINES.find(p => p.id === 'niijima').firstVisit, '11/16');
  assert.equal(PALACE_DEADLINES.find(p => p.id === 'maruki').mementos, '2/1');
});

test('existing calendar deadline IDs use reviewed dates without losing checkmark keys', () => {
  const tasks = APP_DATA.months.flatMap(m => m.tasks);
  for (const id of ['apr_pal_sec', 'may_pal_dead', 'jun_pal_dead', 'pal4_secure', 'pal4_card', 'pal5_secure', 'pal5_dead', 'pal6_dead', 'pal7_dead', 'pal9_dead']) {
    assert.equal(tasks.filter(t => t.id === id).length, 1);
    assert.deepEqual(tasks.find(t => t.id === id), palaceDeadlineTask(id));
  }
  assert.equal(new Set(tasks.map(t => t.id)).size, tasks.length);
  assert.match(APP_DATA.months.find(m => m.id === 'may').tasks.find(t => t.id === 'may_pal_start').text, /5\/31 DEADLINE/);
  assert.throws(() => palaceDeadlineTask('invented'), /Unknown Palace/);
});

test('Royal introductions distinguish story rank one from later social-stat gates', () => {
  for (const [arcana, text] of [['Lovers', /Kindness 2.*Rank 2/], ['Hermit', /Kindness 4.*Rank 2/], ['Devil', /no Charm gate/], ['Tower', /No Kindness gate/]]) {
    assert.match(APP_DATA.confidants.find(c => c.arcana === arcana).notes, text);
    assert.match(CONFIDANT_INTERACTIONS[arcana].tips, text);
  }
  assert.equal(APP_DATA.confidants.find(c => c.arcana === 'Hermit').monthlyTargets.august, 1);
  assert.match(APP_DATA.confidants.find(c => c.arcana === 'Empress').notes, /10\/30.*Rank 2/);
});
