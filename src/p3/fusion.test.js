import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PERSONAS, PERSONA_IDS, DLC_PERSONAS, getPersona, availablePersonas, fusePersonas, recipesFor, affinities, SKILLS, skillDescription } from './fusion.js';
import enemies from '../../knowledge/p3-reload/reference/enemy-data.json' with { type: 'json' };
import provenance from '../../knowledge/p3-reload/reference/provenance.json' with { type: 'json' };

test('registry has stable unique IDs and base-game default excludes DLC', () => {
  assert.equal(PERSONAS.length, 194);
  assert.equal(PERSONA_IDS.length, new Set(PERSONA_IDS).size);
  assert.ok(PERSONA_IDS.every(id => /^[a-z0-9-]+$/.test(id)));
  assert.equal(availablePersonas().length, 173);
  assert.equal(DLC_PERSONAS.length, 21);
  assert.equal(getPersona('Jack Frost').id, 'jack-frost');
  assert.equal(getPersona('not-a-persona'), null);
});

test('request fusion recipes use base levels and the no-DLC pool', () => {
  const recipes = [
    ['Archangel', 'Silky', 'Oberon'], ['Oberon', 'Leanan Sidhe', 'Mithras'],
    ['Sati', 'Shiisaa', 'Mothman'], ['Shiki-Ouji', 'Kurama Tengu', 'Titania'],
    ['Titania', 'Thoth', 'Rangda'], ['Hecatoncheires', 'Shiki-Ouji', 'Siegfried'],
    ['Suzaku', 'Hecatoncheires', 'Daisoujou'], ['Mishaguji', 'Ganesha', 'Chernobog'],
    ['Koumokuten', 'Kurama Tengu', 'Raphael'], ['Suzaku', 'Pazuzu', 'Loki'],
    ['Setanta', "Jack-o'-Lantern", 'Jikokuten'],
  ];
  for (const [a, b, expected] of recipes) {
    assert.equal(fusePersonas(a, b).name, expected);
    assert.equal(fusePersonas(b, a).name, expected);
  }
  assert.equal(getPersona('Oberon').skills.Mazio, 17);
  assert.equal(getPersona('Shiki-Ouji').skills.Matarukaja, 47);
  assert.equal(getPersona('Hecatoncheires').skills.Endure, 48);
  assert.equal(getPersona('Suzaku').skills['Regenerate 3'], 56);
  assert.equal(getPersona('Raphael').skills['Auto Maraku'], 61);
  assert.equal(getPersona('Setanta').skills.Charge, 31);
});

test('same-arcana fusion steps down while different arcana step up', () => {
  assert.equal(fusePersonas('Orpheus', 'Pixie').name, 'Angel');
  assert.equal(fusePersonas('Slime', 'Legion').name, 'Orpheus');
  assert.equal(fusePersonas('Jack Frost', "Jack-o'-Lantern").name, 'Nekomata');
  assert.equal(fusePersonas('Pixie', 'Alp'), null);
  assert.equal(fusePersonas('Pixie', 'Pixie'), null);
  assert.equal(fusePersonas('missing', 'Pixie'), null);
});

test('special recipes override ordinary recipes and stay out of normal result pools', () => {
  assert.equal(fusePersonas('Rangda', 'Barong').name, 'Shiva');
  assert.equal(fusePersonas('Orpheus', 'Thanatos').name, 'Messiah');
  assert.deepEqual(recipesFor('Masakado'), [{ ingredients: ['Zouchouten', 'Jikokuten', 'Koumokuten', 'Bishamonten'], special: true }]);
  assert.ok(getPersona('Messiah').unlock.includes('Judgement'));
  assert.deepEqual(recipesFor('Satanael'), []);
});

test('DLC changes both usable ingredients and normal fusion results', () => {
  assert.equal(fusePersonas('Abaddon', 'Berith').name, 'Kikuri-Hime');
  assert.equal(fusePersonas('Abaddon', 'Berith', ['anat']).name, 'Anat');
  assert.equal(fusePersonas('Anat', 'Pixie'), null);
  assert.ok(fusePersonas('Anat', 'Pixie', ['anat']));
  assert.equal(availablePersonas(['anat']).length, 174);
});

test('reverse lookup recipes really produce the selected result', () => {
  for (const name of ['Jack Frost', 'Oberon', 'Mothman', 'Raphael', 'Shiva']) {
    const recipes = recipesFor(name);
    assert.ok(recipes.length);
    for (const recipe of recipes.filter(item => item.ingredients.length === 2)) assert.equal(fusePersonas(...recipe.ingredients).name, name);
  }
});

test('affinity decoding separates weak flags from increased normal damage', () => {
  const decoded = affinities('wvsnrdT_?-');
  assert.deepEqual(decoded.slice(0, 6).map(a => a.label), ['Weak', 'Normal', 'Resist', 'Null', 'Repel', 'Drain']);
  assert.equal(decoded[1].multiplier, 2);
  assert.equal(decoded[6].multiplier, 0.25);
  assert.equal(decoded[8].label, 'Unknown');
  assert.equal(decoded[8].multiplier, null);
});

test('skills decode effects, targets, costs and unknown attacks', () => {
  assert.match(SKILLS.Tarukaja.description, /attack x1.4 for 3 turns/);
  assert.match(SKILLS.Charge.description, /next phys attack x2.3/);
  assert.equal(SKILLS.Agi.cost, '3 SP');
  assert.equal(SKILLS['Best Friends'].cost, 'Theurgy gauge');
  assert.equal(SKILLS.Tarukaja.target, '1 ally');
  assert.match(skillDescription('Phys Attack'), /not documented/);
  const allSkills = new Set(Object.values(enemies).flatMap(enemy => enemy.skills));
  assert.deepEqual([...allSkills].filter(name => !SKILLS[name]), ['Phys Attack']);
});

test('combat source retains story/optional variants and unknown-location entries', () => {
  assert.equal(Object.keys(enemies).length, 370);
  assert.equal(Object.keys(enemies).filter(name => name.startsWith('Nyx Avatar ')).length, 14);
  assert.equal(Object.keys(enemies).filter(name => name.startsWith('Elizabeth ')).length, 10);
  assert.equal(enemies['Nyx Avatar N'].area, 'Adamah II 264');
  assert.equal(enemies['Feral Beast'].area, 'Unknown');
  assert.ok(enemies['The Reaper'].boss);
  assert.ok(!enemies['Nyx Avatar N'].skills.includes('Moonless Gown'));
});

test('vendored reference data matches its pinned provenance checksums', () => {
  assert.match(provenance.commit, /^[a-f0-9]{40}$/);
  assert.equal(provenance.license, 'Unlicense');
  for (const file of provenance.files) {
    const bytes = readFileSync(new URL(`../../knowledge/p3-reload/reference/${file.local}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, file.local);
  }
});
