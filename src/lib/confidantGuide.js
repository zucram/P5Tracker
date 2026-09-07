import { CONFIDANT_INTERACTIONS } from '../data/confidantData.js';

export function confidantRankSteps(arcana, currentRank = 0) {
  if (currentRank >= 10) return ['You have recorded the maximum confidant rank.'];
  const entry = CONFIDANT_INTERACTIONS[arcana]?.ranks[currentRank + 1];
  if (Array.isArray(entry)) return entry;
  if (typeof entry === 'string' && entry.trim()) return [entry];
  return ['No rank guide is listed for this step. Check the introduction notes and in-game conditions.'];
}
