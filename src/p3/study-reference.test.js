import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const school = JSON.parse(readFileSync(new URL('../../knowledge/p3-reload/school-answers.json', import.meta.url))).entries;
const activities = JSON.parse(readFileSync(new URL('../../knowledge/p3-reload/activities.json', import.meta.url))).activities;

test('Reload school coverage separates 36 classes, 17 manual answers and five automatic checks', () => {
  assert.equal(school.filter(row => row.kind === 'classroom').length, 36);
  assert.equal(school.filter(row => row.kind === 'exam').length, 17);
  assert.equal(school.filter(row => row.kind === 'exam-check').length, 5);
  assert.equal(new Set(school.map(row => row.date)).size, school.length);
  assert.equal(school.find(row => row.date === '05-18').kind, 'exam-check');
  assert.deepEqual(school.find(row => row.date === '05-19').answers, ['May Blues']);
  assert.equal(school.find(row => row.date === '12-22').kind, 'classroom');
  assert.deepEqual(school.find(row => row.date === '01-18').answers, ['Circe']);
  assert.ok(school.every(row => row.sources.every(source => source.url.startsWith('https://') && source.locator)));
});

test('Activity data preserves price, night-only menus and no-time nurse visit', () => {
  assert.equal(activities.find(row => row.id === 'arcade-academics').costYen, 3000);
  for (const id of ['seafood-course', 'special-ramen', 'weekend-wilduck']) {
    assert.deepEqual(activities.find(row => row.id === id).slots, ['evening']);
  }
  assert.equal(activities.find(row => row.id === 'nurse-medicine').consumesTime, false);
  assert.equal(new Set(activities.map(row => row.id)).size, activities.length);
  assert.ok(activities.every(row => row.sources.length && row.days.every(day => day >= 1 && day <= 7)));
});
