import test from 'node:test';
import assert from 'node:assert/strict';
import { ROYAL_STRENGTH_REQUESTS } from '../data/royalStrength.js';
import { PERSONA_DATA } from '../data/personaData.js';

test('Strength skill cards distinguish normal and alarm execution results', () => {
  assert.deepEqual(ROYAL_STRENGTH_REQUESTS.map(r => [r.card, r.skill, r.alarm]), [
    ['Koropokkuru', 'Mabufu', true], ['Makami', 'Frei', false], ['Eligor', 'Tarukaja', false],
    ['Naga', 'Counter', false], ['Lamia', 'Rakukaja', false], ['Mokoi', 'Dekaja', true],
    ['Clotho', 'Tetraja', false], ['Mandrake', 'Masukunda', true], ['Norn', 'Samarecarm', true], ['Ose', 'High Counter', true],
  ]);
});

test('all Strength targets, card donors and group ingredients exist in the Royal registry', () => {
  const names = new Set(PERSONA_DATA.registry.map(p => p.name));
  for (const r of ROYAL_STRENGTH_REQUESTS) for (const name of [r.persona, r.card, ...(r.ingredients || [])]) assert.ok(names.has(name), name);
  assert.deepEqual(ROYAL_STRENGTH_REQUESTS.filter(r => r.ingredients).map(r => [r.persona, ...r.ingredients]), [
    ['Flauros', 'Berith', 'Eligor', 'Orobas'], ['Neko Shogun', 'Kodama', 'Sudama', 'Anzu'],
    ['Bugs', 'Pixie', 'Pisaca', 'Hariti'], ['Seth', 'Isis', 'Anubis', 'Thoth', 'Horus'],
  ]);
});
