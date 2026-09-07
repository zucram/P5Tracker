export function checkRequirement(rank, period) {
  if (!Number.isInteger(rank) || rank < 0 || rank > 10 || !['early', 'before', 'after'].includes(period)) {
    return { title: 'Choose your rank and date range', text: 'Use the Councillor rank shown in your game.' };
  }
  if (period === 'early' && rank > 5) {
    return { title: 'Check the date or rank', text: 'Maruki cannot progress past rank 5 before the September story gate. Check that you selected the Councillor confidant.' };
  }
  if (rank >= 9) {
    return { title: 'The confidant requirement is met', text: 'You have reached the required Councillor rank. Continue the story. This check does not evaluate later ending choices.' };
  }
  if (period === 'after') {
    return { title: 'The deadline has passed', text: 'If Maruki was below rank 9 when November 17 ended, this playthrough cannot unlock the third semester. An earlier game save may let you return before the deadline. Changing a tracker entry cannot change your game.' };
  }
  if (period === 'early' && rank === 5) {
    return { title: 'Rank 5 is the expected time gate', text: 'You have reached the early rank cap. Check his availability again from September 20, then work toward rank 9 by November 17.' };
  }
  return { title: 'The requirement is not met yet', text: `You need ${9 - rank} more Councillor ranks to reach rank 9. This is not an estimate of free afternoons or proof that enough time remains. Check Maruki's in-game availability and prioritize his remaining ranks before the deadline.` };
}
