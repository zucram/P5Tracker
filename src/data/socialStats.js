export const CONFIDANT_STAT_GATES = {
  'Priestess': { 1: { stat: 'Knowledge', lvl: 3 }, 6: { stat: 'Charm', lvl: 5 } },
  'Empress': { 2: { stat: 'Proficiency', lvl: 5 } },
  'Emperor': { 6: { stat: 'Proficiency', lvl: 4 } },
  'Hierophant': { 7: { stat: 'Kindness', lvl: 5 } },
  'Lovers': { 2: { stat: 'Kindness', lvl: 2 } },
  'Hermit': { 2: { stat: 'Kindness', lvl: 4 } },
  'Hanged': { 1: { stat: 'Guts', lvl: 4 }, 8: { stat: 'Guts', lvl: 5 } },
  'Death': { 2: { stat: 'Guts', lvl: 2 }, 8: { stat: 'Charm', lvl: 4 } },
  'Temperance': { 1: { stat: 'Guts', lvl: 3 } },
  'Devil': {},
  'Tower': {},
  'Star': { 1: { stat: 'Charm', lvl: 3 }, 8: { stat: 'Knowledge', lvl: 5 } },
  'Justice': { 3: [{ stat: 'Knowledge', lvl: 3 }, { stat: 'Charm', lvl: 3 }], 7: { stat: 'Knowledge', lvl: 4 } },
  'Moon': {}, // Unlocked by mission
  'Sun': {}, // Unlocked by mission
  'Judgement': {}, // Automatic
  'Strength': {}, // Fusion based
  'Fool': {}, // Automatic
  'Magician': {}, // Automatic
  'Faith': {},
  'Councillor': {}
};

export function unmetConfidantStatGates(arcana, currentRank = 0, stats = {}) {
  const gate = CONFIDANT_STAT_GATES[arcana]?.[currentRank + 1];
  return (gate ? [gate].flat() : []).filter(requirement => (stats[requirement.stat] || 1) < requirement.lvl);
}

export const SOCIAL_STATS = [
  { id: 'Knowledge', color: 'bg-blue-600', icon: 'Book' },
  { id: 'Guts', color: 'bg-orange-600', icon: 'Sword' },
  { id: 'Proficiency', color: 'bg-purple-600', icon: 'Wrench' },
  { id: 'Kindness', color: 'bg-pink-600', icon: 'Heart' },
  { id: 'Charm', color: 'bg-cyan-600', icon: 'Sparkles' }
];
