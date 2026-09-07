import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SOCIAL_LINKS } from './data.js';
import { COLLECTION_IDS, DORM_ACTIVITY_IDS } from './campaignData.js';

const read = name => JSON.parse(readFileSync(new URL(`../../knowledge/p3-reload/${name}.json`, import.meta.url), 'utf8'));
const requests = read('requests').entries;
const campaign = read('campaign').sections;
const equipment = read('equipment');
const recipes = equipment.sections.find(section => section.id === 'antiques').entries;
const shops = equipment.sections.find(section => section.id === 'shops').entries;
const personas = read('reference/demon-data');
const enemies = read('reference/enemy-data');
const section = id => campaign.find(item => item.id === id);
const unique = entries => assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, 'IDs must not collapse saved progress');
function actionable(entries) {
  unique(entries);
  for (const entry of entries) {
    assert.ok(entry.title?.trim(), `${entry.id}: missing title`);
    assert.ok(entry.steps?.length && entry.steps.every(step => typeof step === 'string' && step.trim()), `${entry.id}: missing player actions`);
    assert.ok(entry.sources?.length, `${entry.id}: missing evidence`);
    for (const source of entry.sources) {
      assert.equal(new URL(source.url).protocol, 'https:', `${entry.id}: invalid source`);
      assert.ok(source.label?.trim(), `${entry.id}: unlabeled source`);
    }
  }
}

test('all 101 requests have instructions and a complete, acyclic prerequisite graph', () => {
  actionable(requests);
  assert.deepEqual(requests.map(entry => entry.number).sort((a, b) => a - b), Array.from({ length: 101 }, (_, index) => index + 1));
  const byNumber = new Map(requests.map(entry => [entry.number, entry]));
  for (const row of read('request-metadata').entries) {
    const request = byNumber.get(row.number);
    assert.equal(request?.id, row.id);
    assert.deepEqual(request.prerequisites, row.prerequisites, `${row.id}: prerequisite import drift`);
  }
  const visited = new Set();
  function visit(number, path = new Set()) {
    assert.ok(byNumber.has(number), `Missing prerequisite request ${number}`);
    assert.ok(!path.has(number), `Request cycle through ${[...path, number].join(' → ')}`);
    if (visited.has(number)) return;
    const next = new Set([...path, number]);
    for (const prerequisite of byNumber.get(number).prerequisites) visit(prerequisite, next);
    visited.add(number);
  }
  requests.forEach(entry => visit(entry.number));
  assert.deepEqual([...byNumber.get(101).prerequisites].sort((a, b) => a - b), [81, 99, 100]);
});

test('campaign reference retains story, ending, episode, boss and daily-life systems', () => {
  for (const id of ['operations', 'ending', 'episodes', 'optional-bosses', 'protagonist-theurgy', 'party-theurgy', 'new-game-plus', 'tartarus-mechanics']) {
    assert.ok(section(id)?.entries.length, `Missing campaign system: ${id}`);
    actionable(section(id).entries);
  }
  for (const id of ['awakening', 'nyx-avatar']) assert.ok(section('operations').entries.some(entry => entry.id === id));
  for (const id of ['spare-ryoji', 'epilogue']) assert.ok(section('ending').entries.some(entry => entry.id === id));
  const daily = read('daily-life').sections;
  for (const id of ['daily-life', 'computer', 'gardening', 'gifts']) {
    const entries = daily.find(item => item.id === id)?.entries;
    assert.ok(entries?.length, `Missing daily-life system: ${id}`);
    actionable(entries);
  }
  assert.ok(read('activities').activities.length);
  assert.ok(read('school-answers').entries.length);
  const blocks = read('tartarus').blocks;
  assert.equal(Math.min(...blocks.map(block => block.fromFloor)), 2);
  assert.equal(Math.max(...blocks.map(block => block.toFloor)), 264);
  for (let index = 1; index < blocks.length; index++) assert.equal(blocks[index].fromFloor, blocks[index - 1].toFloor + 1);
});

test('social roster, dialogue and party bonding remain connected to tracked IDs', () => {
  assert.equal(SOCIAL_LINKS.length, 22);
  const dialogue = read('social-link-dialogue').links;
  assert.equal(dialogue.length, 19);
  assert.equal(dialogue.reduce((count, link) => count + link.ranks.length, 0), 190);
  assert.deepEqual(new Set(dialogue.map(link => link.id)), new Set(SOCIAL_LINKS.filter(link => link.kind !== 'story').map(link => link.id)));
  const members = read('party-bonding').members;
  assert.equal(members.length, 9);
  unique(members);
  for (const member of members) {
    assert.equal(member.activities.length, 2, `${member.id}: both bonding activities required`);
    assert.ok(section('party-theurgy').entries.some(entry => entry.id === `charge-${member.id}`));
    for (const activity of member.activities) assert.ok(DORM_ACTIVITY_IDS.includes(activity.id));
  }
  assert.equal(new Set(DORM_ACTIVITY_IDS).size, 18);
});

test('all seven protagonist Theurgies name real Persona pairs, including Helel and Satan', () => {
  const theurgies = section('protagonist-theurgy').entries;
  assert.equal(theurgies.length, 7);
  for (const entry of theurgies) {
    const pair = entry.steps.join(' ').match(/Register (.+?) \+ (.+?) in the Compendium/);
    assert.ok(pair, `${entry.id}: pair is missing from unlock instructions`);
    for (const name of pair.slice(1)) assert.ok(personas[name.replaceAll('’', "'")], `${entry.id}: unknown Persona ${name}`);
  }
  assert.match(theurgies.find(entry => entry.id === 'armageddon').steps.join(' '), /Helel \+ Satan/);
});

test('main-campaign collectibles and dated opportunities all reach collection tracking', () => {
  for (const [file, count] of [['twilight-fragments', 17], ['achievements', 48]]) {
    const entries = read(file).entries;
    assert.equal(entries.length, count);
    actionable(entries);
    for (const entry of entries) assert.ok(COLLECTION_IDS.includes(entry.id), `${entry.id}: not trackable`);
  }
  for (const file of ['tv-shopping', 'social-opportunities']) {
    const entries = read(file).entries;
    assert.ok(entries.length);
    actionable(entries);
    for (const entry of entries) {
      assert.match(entry.date, /^\d{2}-\d{2}$/);
      assert.ok(COLLECTION_IDS.includes(entry.id));
    }
  }
  const opportunities = read('social-opportunities').entries;
  for (const kind of ['film', 'walk', 'invite']) assert.ok(opportunities.some(entry => entry.id.startsWith(`${kind}-`)));
  assert.equal(new Set(COLLECTION_IDS).size, COLLECTION_IDS.length);
});

test('every crafting ingredient has acquisition evidence and valid cross-dataset joins', () => {
  assert.equal(recipes.length, 244);
  assert.equal(Object.keys(equipment.materials).length, 73);
  unique([...recipes, ...shops]);
  for (const recipe of recipes) {
    assert.ok(recipe.materials.length, `${recipe.id}: empty recipe`);
    for (const material of recipe.materials) {
      assert.ok(material.quantity > 0);
      assert.ok(equipment.materials[material.name]?.length, `${recipe.id}: cannot find ${material.name}`);
    }
  }
  for (const [name, locations] of Object.entries(equipment.materials)) {
    assert.ok(locations.length, `${name}: no acquisition method`);
    for (const location of locations) {
      assert.ok(location.location && location.detail, `${name}: empty acquisition instructions`);
      for (const id of location.sourceIds) assert.ok(equipment.sources[id], `${name}: missing source ${id}`);
      switch (location.kind) {
        case 'heart':
          assert.equal(personas[location.location]?.heart, name);
          assert.equal(personas[location.location].heartlvl, location.level);
          break;
        case 'enemy':
          assert.ok(enemies[location.name]?.dodds?.[name] > 0, `${name}: invalid enemy drop ${location.name}`);
          assert.equal(enemies[location.name].area, location.location);
          break;
        case 'request':
          assert.ok(requests.find(entry => entry.number === location.requestNumber)?.rewards.some(reward => reward.startsWith(`${name} ×`)), `${name}: invalid request reward`);
          break;
        case 'exchange': assert.equal(recipes.find(entry => entry.id === location.recipeId)?.title, name); break;
        case 'shop': assert.equal(shops.find(entry => entry.id === location.entryId)?.title, name); break;
        default:
          assert.ok(['chest', 'fixed'].includes(location.kind), `Unknown acquisition type ${location.kind}`);
          assert.ok(location.sourceIds.length);
      }
    }
  }
});

test('equipment requests resolve to craftable recipes with matching ingredient quantities', () => {
  for (const number of [51, 73, 91]) {
    const request = requests.find(entry => entry.number === number);
    const recipe = recipes.find(entry => entry.title === request.equipment);
    assert.ok(recipe, `Request ${number}: missing recipe`);
    for (const material of recipe.materials) assert.ok(request.steps.join(' ').includes(`${material.name} ×${material.quantity}`), `Request ${number}: wrong ${material.name} quantity`);
  }
});

test('derived equipment keeps pinned source provenance and the reference license', () => {
  const provenance = read('reference/provenance');
  assert.match(equipment.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(equipment.fusionSourceCommit, provenance.commit);
  assert.equal(provenance.license, 'Unlicense');
  assert.match(readFileSync(new URL('../../knowledge/p3-reload/reference/LICENSE.md', import.meta.url), 'utf8'), /public domain/i);
  for (const { url } of Object.values(equipment.sources)) {
    assert.equal(new URL(url).protocol, 'https:');
    assert.ok(url.includes(equipment.sourceCommit) || url.includes(provenance.commit), `Unpinned imported source: ${url}`);
  }
});
