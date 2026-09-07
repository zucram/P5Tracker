export const PALACE_DATES_REVIEWED = '2026-09-07';
const calendar = 'https://megatenwiki.com/wiki/Calendar_in_Persona_5_Royal';
export const PALACE_DEADLINES = [
  { id: 'kamoshida', name: 'Kamoshida', place: 'Castle', route: '4/29', card: '4/30', heist: '5/1', task: 'apr_pal_sec', note: 'Start well before the route deadline if you need several visits.', sources: [calendar, 'https://altema.jp/persona5r/april'] },
  { id: 'madarame', name: 'Madarame', place: 'Museum', route: '6/2', card: '6/3', heist: '6/4', task: 'may_pal_dead', firstVisit: '5/31', note: 'Reach the courtyard security barrier by May 31. The route requires separate visits.', sources: [calendar, 'https://omoteura.com/persona5/the-royal/madarame-palace-chart.html'] },
  { id: 'kaneshiro', name: 'Kaneshiro', place: 'Bank', route: '7/6', card: '7/7', heist: '7/8', task: 'jun_pal_dead', note: 'The July 9 story date is too late to finish the Palace.', sources: [calendar, 'https://altema.jp/persona5r/july'] },
  { id: 'futaba', name: 'Futaba', place: 'Pyramid', route: '8/19', card: '8/20', heist: '8/20', task: 'pal4_secure', cardTask: 'pal4_card', note: 'The calling card and boss fight take place on the same day. Aim to finish the route earlier.', sources: ['https://www.neoseeker.com/persona-5-royal/July', 'https://jusgameguide.wordpress.com/2020/04/12/futabas-pyramid-2/'] },
  { id: 'okumura', name: 'Okumura', place: 'Spaceport', route: '10/8', card: '10/9', heist: '10/10', task: 'pal5_secure', cardTask: 'pal5_dead', note: 'October 10 is the boss deadline, not the route deadline.', sources: [calendar, 'https://altema.jp/persona5r/october'] },
  { id: 'niijima', name: 'Niijima', place: 'Casino', route: '11/17', card: '11/18', heist: '11/19', task: 'pal6_dead', firstVisit: '11/16', fixed: true, note: 'Begin by November 16 to allow the required return visit. The card and heist have fixed story dates.', sources: [calendar, 'https://www.neoseeker.com/persona-5-royal/November'] },
  { id: 'shido', name: 'Shido', place: 'Cruiser', route: '12/16', card: '12/17', heist: '12/17', task: 'pal7_dead', note: 'The calling card and boss fight take place on the same day.', sources: ['https://www.neoseeker.com/persona-5-royal/November', 'https://jusgameguide.wordpress.com/2020/05/04/p5r-shidos-cruiser/'] },
  { id: 'maruki', name: 'Maruki', place: 'Laboratory · third semester', route: '2/2', card: '2/2', heist: '2/3', task: 'pal9_dead', mementos: '2/1', fixed: true, note: 'Clear the required Mementos section by February 1, then finish the Palace route by February 2 afternoon. The card is delivered that evening.', sources: ['https://megamitensei.fandom.com/wiki/Maruki%27s_Palace', calendar] },
];

// Keep the original task IDs: their checkmarks belong to existing player saves.
export function palaceDeadlineTask(id) {
  const palace = PALACE_DEADLINES.find(p => p.task === id || p.cardTask === id);
  if (!palace) throw new Error(`Unknown Palace deadline task: ${id}`);
  const text = palace.cardTask === id
    ? `DEADLINE: Calling Card (${palace.name}) by ${palace.card}; heist ${palace.heist}`
    : `DEADLINE: Secure Route (${palace.name}) by ${palace.route}${palace.firstVisit ? `; begin by ${palace.firstVisit}` : ''}${palace.mementos ? `; required Mementos visit by ${palace.mementos}` : ''}${palace.cardTask ? '' : `; Calling Card ${palace.card}, heist ${palace.heist}`}`;
  return { id, text, isMissable: true };
}
