import test from 'node:test';
import assert from 'node:assert/strict';
import { APP_DATA } from '../data/gameData.js';
import { PERSONA_DATA } from '../data/personaData.js';
import { RESOURCE_DATA } from '../data/resourceData.js';

test('Royal Jazz reminders match the reviewed dates and retain saved task IDs', () => {
  const tasks = new Map(APP_DATA.months.flatMap(month => month.tasks).map(task => [task.id, task.text]));
  for (const [id, date, skill] of [
    ['a1', '8/14', 'Marakunda'], ['a2', '8/28', 'Masukunda'],
    ['s1', '9/4', 'Charge'], ['s2', '9/25', 'Concentrate'], ['d1', '12/11', 'Debilitate'],
    ['j2_jan', '1/15', 'Ali Dance'], ['j3_jan', '1/22', 'Arms Master'], ['jan_jazz_spell_master', '1/29', 'Spell Master'],
  ]) {
    assert.ok(tasks.get(id)?.includes(date) && tasks.get(id)?.includes(skill), `${id}: ${date} ${skill}`);
  }
});

test('the Treasure Demon reference covers every rare Persona in the Royal registry', () => {
  assert.equal(PERSONA_DATA.treasureDemons.length, 9);
  assert.deepEqual(new Set(PERSONA_DATA.treasureDemons.map(p => p.name)), new Set(PERSONA_DATA.registry.filter(p => p.rare).map(p => p.name)));
  const final = PERSONA_DATA.treasureDemons.find(p => p.name === 'Orichalcum');
  assert.equal(final.weakness, 'Bless');
  assert.equal(final.arcana, 'Faith');
  assert.equal(final.lvl, 60);
  const calculator = RESOURCE_DATA.flatMap(group => group.items).find(item => item.title === 'Chinhodado Fusion Calculator');
  assert.equal(new URL(calculator.url).pathname, '/persona5_calculator/indexRoyal.html');
});


test('all nine Treasure Demon affinities use the reviewed Royal weaknesses', () => {
  assert.deepEqual(PERSONA_DATA.treasureDemons.map(p => [p.name, p.weakness]), [
    ['Regent', 'Nuclear'], ["Queen's Necklace", 'Psy'], ['Stone of Scone', 'Fire'],
    ['Koh-i-Noor', 'Gun'], ['Orlov', 'Curse'], ["Emperor's Amulet", 'Elec'],
    ['Hope Diamond', 'Ice'], ['Crystal Skull', 'Wind'], ['Orichalcum', 'Bless'],
  ]);
});
