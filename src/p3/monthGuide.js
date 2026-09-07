import knowledge from '../../knowledge/p3-reload/facts.json' with { type: 'json' };
import rules from '../../knowledge/p3-reload/calendar-rules.json' with { type: 'json' };
import { MONTHS, SOCIAL_LINKS } from './data.js';

const facts = knowledge.facts;
const byId = Object.fromEntries(facts.map(f => [f.id, f]));
const links = Object.fromEntries(SOCIAL_LINKS.map(link => [link.id, link]));
const readable = value => value?.replaceAll('-', ' ') || '';
const providerName = value => ({ 'club-vendor': 'the club vendor', 'town-npcs': 'people around town', 'town-npc': 'the Eccentric Man' })[value] || (value ? readable(value).replace(/^./, c => c.toUpperCase()) : '');
const order = date => Number(date?.replace('-', '')) + (date?.startsWith('01') ? 1200 : 0);
const monthCode = monthId => String((MONTHS.findIndex(m => m.id === monthId) + 3) % 12 + 1).padStart(2, '0');
const overlaps = (start, end, code) => start && order(start) <= order(`${code}-31`) && order(end || start) >= order(`${code}-01`);
const evidence = item => ({ sourceUrl: item.evidence?.[0]?.url, sourceLabel: item.evidence?.[0]?.sourceId });
const factTask = (fact, title, detail) => ({ id: fact.id, factId: fact.id, title, detail, category: fact.category,
  date: fact.value.start, end: fact.value.end, uncertain: fact.status === 'disputed', evidenceStatus: fact.status, spoiler: fact.spoiler, ...evidence(fact) });

function eventTask(fact) {
  const v = fact.value;
  if (fact.category === 'rescue') return factTask(fact, `Rescue ${fact.subject} on floor ${v.floor}`,
    `Available ${v.start}; rescue by ${v.end}.${v.lostLinkIfMissed ? ` Missing this rescue ends the ${links[v.lostLinkIfMissed].arcana} link.` : ''}`);
  if (fact.category === 'request') {
    let detail = `Accept request ${v.request}${v.item ? `, then get ${readable(v.item)}${v.provider ? ` from ${providerName(v.provider)}` : ''}` : ''}.${v.end ? ` Report to Elizabeth by ${v.end}.` : ''}`;
    if (v.acceptBeforeTrip) detail = 'Accept request 44 before the Yakushima trip. Collect a beach souvenir on July 20. This is a pickup opportunity, not the report deadline.';
    if (v.buyDistinctDrinks) detail = 'Buy three different drinks from the Kyoto hotel vending machine. November 17 evening is a documented opportunity; the last purchase slot is unknown.';
    if (v.priceYen) detail = `Have ¥${v.priceYen.toLocaleString('en-US')} ready for this shopping opportunity. A later purchase alternative exists; you can still complete the request later.`;
    if (v.request === 97) detail += ' Bring the letter of thanks. Guides disagree about which rescued person provides it; check whether you already have it.';
    return factTask(fact, v.item ? `Request ${v.request}: ${readable(v.item)}` : fact.subject, detail);
  }
  if (fact.category === 'linked-episode') {
    const episodeActions = {
      'le-shinjiro-1': 'First speak to Mitsuru in the faculty hallway to arrange the introduction.',
      'le-shinjiro-4': 'Complete the separate form conversation with Mitsuru first.',
      'le-shinjiro-setup': 'Speak to Mitsuru and keep the form. This conversation uses no time slot.',
      'le-junpei-3': 'The November 11 cutoff is disputed. Check early, and keep looking afterward if unfinished.',
      'le-akihiko-4': 'The December 22 cutoff is disputed. Check early, and keep looking later in December if unfinished.',
      'le-junpei-flower': 'Optional flower branch. Its dates are disputed; check in game. This branch is separate from episode 4 and can reserve January 21.',
      'le-ryoji-3-invitation': "Accept Ryoji's invitation this evening for the November 19 event.",
      'le-ryoji-3': "The daytime event follows accepting Ryoji's invitation on November 18.",
    };
    const slot = ['daytime', 'evening'].includes(v.timeSlot) ? `${v.timeSlot} ` : '';
    const detail = [v.dateMeaning === 'outer-window' ? `Check for ${slot}meetings early in this window. Availability varies; the last date is not a guaranteed meeting.` : '',
      fact.dependsOn?.length ? `First complete ${fact.dependsOn.map(id => byId[id]?.subject || readable(id)).join(', ')}.` : '', episodeActions[fact.id]].filter(Boolean).join(' ');
    return factTask(fact, fact.subject, detail);
  }
  return factTask(fact, fact.subject, v.event === 'exam-period'
    ? `Exams run through the final morning. Final day after school: ${readable(v.finalDayAfterSchool)}; evening: ${readable(v.finalDayEvening)}.`
    : v.event === 'school-resumes' ? 'Ordinary school links return, subject to their usual days and prerequisites.'
      : v.event === 'story-operation' ? 'Reserve the day for the story operation. Finish earlier rescue and request deadlines before it.'
        : `${readable(v.event)}. Check the fixed calendar blocks for the occupied time slots.`);
}

// These are months to prepare an opening, never claimed unlock dates or route rank targets.
const openingActions = {
  priestess: 'Start Fortune, then speak with Fuuka to finish her introduction.',
  justice: 'Join the student council, then speak to Chihiro on three separate occasions.',
  strength: 'Invite Yuko to walk home during the early Chariot meetings.',
  temperance: 'Meet Bebe through Hierophant, then visit the sewing club.',
  tower: 'Ask Yuko about the monk, then complete the Club Escapade bartender task.',
  moon: "Ask Kenji about the gourmet, pass Nozomi's food quiz, and give him an Odd Morsel.",
  empress: "Earn at least one top exam result before starting Mitsuru's link.",
  hierophant: 'Visit the bookstore, collect a persimmon leaf from the school tree, and return it.',
  'hanged-man': 'Give Maiko Weird Takoyaki and Mad Bull before the first meeting.',
  devil: 'Get the introduction through Hermit, then make three payments totaling ¥40,000. The required Hermit rank is disputed; confirm the introduction in game.',
  sun: 'Get the introduction through Maiko, then return the pen obtained from Koromaru. The required Hanged Man rank is disputed; confirm the introduction in game.',
};
const strategyCopy = {
  'plan-matching-arcana': 'Bring a Persona with the same Arcana when spending time with a Social Link that needs affinity. A meeting may build points without gaining a rank.',
  'plan-school-priority': 'Use available school days for school links. Save town links for holidays or days when school friends are unavailable.',
  'plan-rescue-batching': 'Combine rescues in one Tartarus visit when you can reach their floors. Leave time before the earliest deadline for another attempt.',
  'plan-nurse': 'On a school day after Tartarus or a full-moon operation, visit the nurse for Courage without using a time slot.',
  'plan-linked-window': 'Check episode invitations early and return if the character is unavailable. The end of a window does not guarantee a meeting.',
};
const preparationMonths = { moon: 'may', tower: 'may', devil: 'june', sun: 'august' };
function openingTasks(monthId) {
  return SOCIAL_LINKS.flatMap(link => {
    const fact = byId[`sl-${link.id}`];
    if (!fact || (fact.value.start ? fact.value.start.slice(0, 2) !== monthCode(monthId) : preparationMonths[link.id] !== monthId)) return [];
    const requirement = rules.openingRequirements[link.id];
    const requiredLinks = Object.entries(requirement?.requiredLinks || {});
    const [prerequisiteId, rank] = requiredLinks[0] || [];
    const prefix = [requiredLinks.map(([id, n]) => `${links[id].arcana} rank ${n}`).join(', '), link.statGate ? `${link.statGate.stat} ${link.statGate.rank}` : ''].filter(Boolean).join(' + ');
    const detail = [prefix ? `Prepare ${prefix}.` : '', openingActions[link.id] || link.note,
      fact.value.start ? `First listed opening ${fact.value.start}; introductions and in-game availability still apply.` : 'Preparation goal only; check the opening in game.'].filter(Boolean).join(' ');
    return [{ id: `guide-opening-${link.id}`, title: `Open ${link.arcana}: ${link.name}`, detail, reason: detail,
      category: 'social-link', date: fact.value.start || undefined, linkId: prerequisiteId || link.id,
      opensLinkId: link.id, ...(rank ? { rank } : {}), stat: link.statGate?.stat, statRank: link.statGate?.rank,
      uncertain: fact.status === 'disputed' || ['devil', 'sun'].includes(link.id), evidenceStatus: ['devil', 'sun'].includes(link.id) ? 'disputed' : fact.status, ...evidence(requirement || fact) }];
  });
}

function calendarTasks(code) {
  return ['schoolClosures', 'preExamClosures', 'slotBlocks', 'conditionalSlotBlocks'].flatMap(group => rules[group].filter(row => overlaps(row.start, row.end, code)).map(row => ({
    id: `guide-${group}-${row.id}`, title: row.reason, date: row.start, end: row.end, category: 'calendar',
    detail: group === 'schoolClosures' ? 'Ordinary school links are unavailable. Town links and holiday invitations have their own schedules.'
      : group === 'preExamClosures' ? 'Most school links prepare for exams. Check individual exceptions before planning a meeting.'
        : `${group === 'conditionalSlotBlocks' ? 'Conditional event. ' : ''}${row.slots.map(readable).join(' and ')} reserved. ${group === 'conditionalSlotBlocks' ? row.reason + '.' : ''}`.trim(),
    uncertain: false, conditional: group === 'conditionalSlotBlocks', evidenceStatus: row.evidence?.length > 1 ? 'corroborated' : 'single-source', ...evidence(row),
  })));
}

export function getMonthGuide(monthId) {
  if (!MONTHS.some(month => month.id === monthId)) return { critical: [], timeline: [], targets: [], strategy: [] };
  const code = monthCode(monthId);
  const datedFacts = facts.filter(f => ['rescue', 'request', 'linked-episode', 'calendar'].includes(f.category) && overlaps(f.value.start, f.value.end, code));
  const tasks = datedFacts.map(eventTask);
  const calendar = calendarTasks(code);
  // A canonical event may span several fixed slot blocks, which remain useful details.
  const timeline = [...tasks, ...calendar.filter(row => !datedFacts.some(f => f.category === 'calendar' && f.value.start === row.date && f.value.end === row.end && f.value.event === 'story-operation'))]
    .sort((a, b) => order(a.date) - order(b.date) || a.title.localeCompare(b.title));
  const strategyIds = ['plan-matching-arcana', 'plan-school-priority'];
  if (tasks.some(t => t.category === 'rescue')) strategyIds.push('plan-rescue-batching', 'plan-nurse');
  if (tasks.some(t => t.category === 'linked-episode')) strategyIds.push('plan-linked-window');
  return {
    critical: tasks.filter(t => ['rescue', 'request'].includes(t.category) && byId[t.factId].value.dateMeaning.endsWith('deadline')),
    timeline,
    targets: openingTasks(monthId),
    strategy: strategyIds.map(id => factTask(byId[id], byId[id].subject, strategyCopy[id])),
  };
}

export const ALL_GUIDE_TASK_IDS = [...new Set(MONTHS.flatMap(month => Object.values(getMonthGuide(month.id)).flat().filter(task => !task.factId).map(task => task.id)))];
