// Adapted from aqiu384/megaten-fusion-tool under the Unlicense.
// Pinned data, license and algorithm paths: knowledge/p3-reload/reference/provenance.json.
import demons from '../../knowledge/p3-reload/reference/demon-data.json' with { type: 'json' };
import unlockGroups from '../../knowledge/p3-reload/reference/demon-unlocks.json' with { type: 'json' };
import specials from '../../knowledge/p3-reload/reference/special-recipes.json' with { type: 'json' };
import chart from '../../knowledge/p3-reload/reference/fusion-chart.json' with { type: 'json' };
import config from '../../knowledge/p3-reload/reference/comp-config.json' with { type: 'json' };
import skillRows from '../../knowledge/p3-reload/reference/skill-data.json' with { type: 'json' };
import skillEffects from '../../knowledge/p3-reload/reference/skill-effects.json' with { type: 'json' };
import provenance from '../../knowledge/p3-reload/reference/provenance.json' with { type: 'json' };

export const SOURCE_URL = `${provenance.repository}/tree/${provenance.commit}/src/app/p3r/data`;
export const ELEMENTS = { sla: 'Slash', str: 'Strike', pie: 'Pierce', fir: 'Fire', ice: 'Ice', ele: 'Electric', win: 'Wind', lig: 'Light', dar: 'Dark', alm: 'Almighty', ail: 'Ailment', rec: 'Recovery', sup: 'Support', spe: 'Special', pas: 'Passive' };
const slug = name => name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dlc = unlockGroups.find(group => group.category === 'Downloadable Content').conditions;
const unlocks = Object.fromEntries(unlockGroups.filter(group => group.category !== 'Downloadable Content').flatMap(group => Object.entries(group.conditions)));
export const PERSONAS = Object.entries(demons).map(([name, data]) => ({ ...data, name, id: slug(name), dlc: dlc[name] || null, unlock: unlocks[name] || null, specialRecipe: specials[name] || null })).sort((a, b) => a.name.localeCompare(b.name));
export const PERSONA_IDS = PERSONAS.map(persona => persona.id);
export const DLC_PERSONAS = PERSONAS.filter(persona => persona.dlc);
const byName = Object.fromEntries(PERSONAS.map(persona => [persona.name, persona]));
const byId = Object.fromEntries(PERSONAS.map(persona => [persona.id, persona]));
export const getPersona = nameOrId => byName[nameOrId] || byId[nameOrId] || null;
export const availablePersonas = (enabledDlc = []) => PERSONAS.filter(persona => !persona.dlc || enabledDlc.includes(persona.id));

let cachedKey;
let cachedPool;
function fusionPool(enabledDlc) {
  const key = [...enabledDlc].sort().join(',');
  if (cachedKey !== key) {
    const list = availablePersonas(enabledDlc);
    const normal = list.filter(persona => !persona.specialRecipe);
    cachedPool = { ids: new Set(list.map(p => p.id)), races: Object.fromEntries(chart.races.map(race => [race, normal.filter(p => p.race === race).sort((a, b) => a.lvl - b.lvl)])) };
    cachedKey = key;
  }
  return cachedPool;
}

// Base levels, not the player's raised levels. Unlock conditions annotate results
// rather than changing the arcana pool, matching upstream default unlock settings.
export function fusePersonas(first, second, enabledDlc = []) {
  const a = getPersona(first), b = getPersona(second);
  const pool = fusionPool(enabledDlc);
  if (!a || !b || a.id === b.id || !pool.ids.has(a.id) || !pool.ids.has(b.id)) return null;
  const special = PERSONAS.find(persona => persona.specialRecipe?.length === 2 && persona.specialRecipe.includes(a.name) && persona.specialRecipe.includes(b.name) && pool.ids.has(persona.id));
  if (special) return special;
  if (a.race === b.race) {
    const threshold = (a.lvl + b.lvl) / 2 + 1;
    return pool.races[a.race].filter(p => p.id !== a.id && p.id !== b.id && p.lvl <= threshold).at(-1) || null;
  }
  const i = chart.races.indexOf(a.race), j = chart.races.indexOf(b.race);
  if (i < 0 || j < 0) return null;
  const race = chart.table[Math.max(i, j)][Math.min(i, j)];
  const candidates = pool.races[race] || [];
  const threshold = (a.lvl + b.lvl) / 2 + 0.5;
  return candidates.find(p => p.lvl >= threshold) || candidates.at(-1) || null;
}

export function recipesFor(target, enabledDlc = [], limit = 8) {
  const result = getPersona(target);
  if (!result || !availablePersonas(enabledDlc).some(p => p.id === result.id)) return [];
  if (result.specialRecipe) return [{ ingredients: result.specialRecipe, special: true }];
  const pool = availablePersonas(enabledDlc).sort((a, b) => a.lvl - b.lvl || a.name.localeCompare(b.name));
  const recipes = [];
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      if (fusePersonas(pool[i].id, pool[j].id, enabledDlc)?.id === result.id) {
        recipes.push({ ingredients: [pool[i].name, pool[j].name], special: false });
        if (recipes.length >= limit) return recipes;
      }
    }
  }
  return recipes;
}

export function affinities(resists = '') {
  const labels = { 1: 'Drain', 2: 'Repel', 3: 'Null', 4: 'Resist', 5: 'Normal', 6: 'Weak' };
  return config.resistElems.map((element, index) => {
    const code = config.resistCodes[resists[index]];
    const rank = Math.floor(code / 10000);
    return { element: ELEMENTS[element], label: labels[rank] || 'Unknown', multiplier: Number.isFinite(code) ? (code % 10000) / 100 : null };
  });
}

export const SKILLS = Object.fromEntries(Object.values(skillRows).map(row => {
  const [name, element, target] = row.a;
  const [, cost, power, minHits, maxHits, accuracy, critical, modifier] = row.b;
  const [effect, format, card] = row.c;
  const mod = modifier < 1000 ? modifier : (Math.trunc(modifier) - 1000) / 100;
  const template = format.startsWith('FMT') ? skillEffects[format.slice(3)] : format;
  const effectText = format === '-' ? '' : (template || 'Effect not documented').replace('$1', String(mod)).replace('$2', effect);
  const description = [power ? `Base power ${power}` : '', maxHits > 1 ? `${minHits === maxHits ? maxHits : `${minHits}–${maxHits}`} hits` : '', critical > 5 ? `${critical}% base critical` : '', effectText].filter(Boolean).join(' · ') || 'Effect not documented';
  return [name, { name, element: ELEMENTS[element] || element, target: target === '-' ? 'Self' : target, description, cost: !cost ? 'No cost' : cost > 2000 ? 'Theurgy gauge' : cost > 1000 ? `${cost - 1000} SP` : `${cost}% HP`, accuracy, card: card === '-' ? null : card }];
}));
export const skillDescription = name => SKILLS[name] ? `${SKILLS[name].element} · ${SKILLS[name].target} · ${SKILLS[name].description}` : 'Effect not documented in this reference.';
