import test from 'node:test';
import assert from 'node:assert/strict';
import { APP_DATA } from '../data/gameData.js';
import data from '../data/schoolAnswers.json' with { type: 'json' };
import { withSchoolAnswers } from '../data/schoolAnswers.js';

test('reviewed answers appear once in the app and preserve the existing dated task IDs', () => {
  const tasks = APP_DATA.months.flatMap(month => month.tasks);
  assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
  for (const entry of data.entries) {
    const task = tasks.find(task => task.id === (entry.appTaskId || entry.id));
    assert.ok(task, entry.id);
    assert.ok(task.text.startsWith(`${Number(entry.date.slice(0, 2))}/${Number(entry.date.slice(3))} `));
    for (const answer of entry.answers) assert.ok(task.text.includes(answer), `${entry.id}: ${answer}`);
  }
  assert.equal(tasks.filter(task => /(?:Answer|Exam):/.test(task.text)).length, data.entries.length);
  assert.equal(tasks.some(task => task.id === 'july_exam_ans'), false);
});

test('Royal July answers replace the old game answers and include the full multipart choice', () => {
  const july = APP_DATA.months.find(month => month.id === 'july').tasks;
  assert.match(july.find(task => task.id === 'july_q6').text, /Thievery/);
  assert.match(july.find(task => task.id === 'july_q5').text, /Infinite.*Forever/);
  const exams = july.filter(task => task.text.includes('Exam:'));
  assert.equal(exams.length, 3);
  assert.equal(exams.some(task => /Nouveau riche|Gentleman-thief|Hideyoshi|Boiled alive/.test(task.text)), false);
});

test('answer integration leaves unrelated objectives and input records intact', () => {
  const objective = { id: 'rescue', text: 'Finish this objective', isMissable: true };
  const months = [{ id: 'april', tasks: [objective, { id: 'old', text: '4/12 Answer: wrong' }] }];
  const result = withSchoolAnswers(months, [data.entries[0]]);
  assert.equal(result[0].tasks[0], objective);
  assert.equal(months[0].tasks.length, 2);
  assert.equal(result[0].tasks.some(task => task.id === 'old'), false);
});
