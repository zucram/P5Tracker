import tartarus from '../../knowledge/p3-reload/tartarus.json' with { type: 'json' };
import knowledge from '../../knowledge/p3-reload/facts.json' with { type: 'json' };
import briefs from '../../knowledge/p3-reload/months.json' with { type: 'json' };
import rules from '../../knowledge/p3-reload/calendar-rules.json' with { type: 'json' };
import { SOCIAL_LINKS, MONTHS } from './data.js';

const DAY = 86400000;
export const FACTS = knowledge.facts;
export const FACT_BY_ID = Object.fromEntries(FACTS.map(f => [f.id, f]));
export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export function dateNumber(date) {
  if (!/^\d{2}-\d{2}$/.test(date || '')) return NaN;
  const [month, day] = date.split('-').map(Number);
  if (month !== 1 && (month < 4 || month > 12)) return NaN;
  const time = Date.UTC(month === 1 ? 2010 : 2009, month - 1, day);
  const d = new Date(time);
  return d.getUTCMonth() === month - 1 && d.getUTCDate() === day ? time / DAY : NaN;
}
export function dateLabel(date) {
  const number = dateNumber(date);
  return Number.isFinite(number) ? new Date(number * DAY).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'Not confirmed';
}
export function monthForDate(date) { return MONTHS[(Number(date.slice(0, 2)) + 8) % 12]?.id; }
export function shiftDate(date, offset) {
  const d = new Date((dateNumber(date) + offset) * DAY);
  const next = `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  return Number.isFinite(dateNumber(next)) && Math.abs(dateNumber(next) - dateNumber(date)) === Math.abs(offset) ? next : date;
}
const inWindow = (date, start, end) => dateNumber(date) >= dateNumber(start) && dateNumber(date) <= dateNumber(end);
const hasDate = f => Number.isFinite(dateNumber(f.value.start)) && Number.isFinite(dateNumber(f.value.end));
export const EVENTS = FACTS.filter(f => ['linked-episode', 'rescue', 'request'].includes(f.category) && hasDate(f));
export function eventTitle(fact, showNames = false) {
  if (fact.category === 'rescue') return showNames ? `${fact.subject} · floor ${fact.value.floor}` : `Missing person · floor ${fact.value.floor}`;
  if (fact.category === 'request') return `Request ${fact.value.request}${fact.value.item ? ` · ${fact.value.item.replaceAll('-', ' ')}` : ' · special opportunity'}`;
  if (showNames) return fact.subject;
  const part = fact.value.episode ? `part ${fact.value.episode}` : fact.value.dateMeaning === 'invitation' ? 'invitation' : 'preparation';
  return `Linked Episode · ${part}`;
}
export function eventState(fact, state) {
  const completed = state.completedEvents.includes(fact.id);
  if (completed) return { status: 'completed', label: 'Recorded complete', remaining: dateNumber(fact.value.end) - dateNumber(state.date) };
  if (fact.status === 'disputed') return { status: 'uncertain', label: 'Timing needs checking', remaining: null };
  const days = dateNumber(fact.value.end) - dateNumber(state.date);
  const missing = (fact.dependsOn || []).filter(id => !state.completedEvents.includes(id));
  const expiredPrerequisite = missing.some(id => {
    const dependency = FACT_BY_ID[id];
    return dependency && dependency.status !== 'disputed' && dependency.kind === 'constraint' && hasDate(dependency) && dateNumber(dependency.value.end) < dateNumber(state.date);
  });
  const uncertainPrerequisite = missing.some(id => !FACT_BY_ID[id] || FACT_BY_ID[id].status === 'disputed');
  const isOpportunity = fact.kind === 'route-choice' || ['purchase-opportunity', 'item-opportunity'].includes(fact.value.dateMeaning);
  if (days < 0) return { status: 'past', label: isOpportunity ? 'Opportunity date passed' : 'Past the recorded window', remaining: days, missing };
  if (dateNumber(state.date) < dateNumber(fact.value.start)) return { status: 'upcoming', label: 'Opens later', remaining: days, missing };
  if (expiredPrerequisite) return { status: 'blocked', label: 'Earlier event needs checking', remaining: days, missing };
  if (uncertainPrerequisite) return { status: 'uncertain', label: 'Prerequisite needs checking', remaining: days, missing };
  if (missing.length) return { status: 'prerequisite', label: 'Record earlier steps first', remaining: days, missing };
  return { status: 'open', label: isOpportunity ? 'Opportunity to check' : fact.category === 'linked-episode' ? 'Within episode window' : 'Within deadline window', remaining: days, missing };
}

export function linkOption(link, state) {
  const pattern = FACT_BY_ID[`sl-${link.id}`];
  if (link.kind === 'story') return { link, eligible: false, reason: 'Advances through the story, not ordinary meetings.' };
  if (state.ranks[link.id] === 10) return { link, eligible: false, reason: 'Rank 10 recorded.' };
  const unresolvedRescue = EVENTS.find(fact => fact.category === 'rescue' && fact.value.lostLinkIfMissed === link.id && dateNumber(state.date) >= dateNumber(fact.value.start) && !state.completedEvents.includes(fact.id));
  if (unresolvedRescue) return { link, eligible: false, reason: 'Missing-person rescue needs confirming. Record the rescue in Deadlines if already completed.' };
  if (!pattern || pattern.status === 'disputed') return { link, eligible: false, reason: 'Check the source guide for this schedule.' };
  const start = pattern.value.start;
  if (start && dateNumber(state.date) < dateNumber(start)) return { link, eligible: false, reason: `First opening: ${dateLabel(start)}.` };
  const wantedSlot = pattern.value.timeSlot === 'evening' ? 'evening' : 'daytime';
  if (wantedSlot !== state.slot) return { link, eligible: false, reason: `${wantedSlot === 'evening' ? 'Evening' : 'Daytime'} meetings.` };
  const absent = rules.linkExceptions.find(x => x.link === link.id && (x.maxCurrentRank === undefined || state.ranks[link.id] <= x.maxCurrentRank) && inWindow(state.date, x.start, x.end));
  if (absent) return { link, eligible: false, reason: absent.reason };
  if (link.kind === 'school') {
    const closure = rules.schoolClosures.find(x => inWindow(state.date, x.start, x.end));
    const prep = link.id !== 'empress' && rules.preExamClosures.find(x => inWindow(state.date, x.start, x.end));
    if (closure || prep) return { link, eligible: false, reason: (closure || prep).reason };
  }
  const extraDate = rules.extraLinkDates.some(x => x.link === link.id && x.dates.includes(state.date));
  if (!extraDate && !pattern.value.days.includes(DAYS[new Date(dateNumber(state.date) * DAY).getUTCDay()])) return { link, eligible: false, reason: 'Outside this link’s usual weekdays.' };
  const opened = state.ranks[link.id] > 0 || state.unlockedLinks.includes(link.id);
  if (!opened) {
    const gate = link.statGate;
    if (gate && state.stats[gate.stat] < gate.rank) return { link, eligible: false, reason: `${gate.stat} rank ${gate.rank} needed to start.`, preparation: true };
    const prerequisites = rules.openingRequirements[link.id]?.requiredLinks || {};
    const unmet = Object.entries(prerequisites).find(([id, rank]) => state.ranks[id] < rank);
    if (unmet) return { link, eligible: false, reason: `${SOCIAL_LINKS.find(x => x.id === unmet[0])?.arcana || unmet[0]} rank ${unmet[1]} needed for the introduction.`, preparation: true };
    return { link, eligible: false, reason: 'Complete the introduction in-game, then record rank 1 or confirm it under Social Links.', preparation: true };
  }
  return { link, eligible: true, reason: state.favorites.includes(link.id) ? 'One of your priorities; usual meeting day.' : 'Usual meeting day; check the in-game invitation.' };
}

export function buildPlan(state) {
  if (!Number.isFinite(dateNumber(state.date))) throw new Error('Choose a valid date from April through January.');
  const blocks = rules.slotBlocks.filter(x => x.slots.includes(state.slot) && inWindow(state.date, x.start, x.end));
  const conditional = (rules.conditionalSlotBlocks || []).filter(x => x.slots.includes(state.slot) && inWindow(state.date, x.start, x.end));
  const calendar = FACTS.filter(f => f.category === 'calendar' && f.status !== 'disputed' && hasDate(f) && inWindow(state.date, f.value.start, f.value.end));
  const events = EVENTS.map(f => ({ fact: f, ...eventState(f, state) }));
  const urgent = events.filter(e => ['open', 'prerequisite', 'blocked'].includes(e.status) && e.remaining <= 7).sort((a, b) => a.remaining - b.remaining);
  const active = events.filter(e => ['open', 'prerequisite', 'blocked'].includes(e.status)).sort((a, b) => a.remaining - b.remaining);
  const next = events.filter(e => e.status === 'upcoming' && dateNumber(e.fact.value.start) - dateNumber(state.date) <= 14).sort((a, b) => dateNumber(a.fact.value.start) - dateNumber(b.fact.value.start));
  const links = SOCIAL_LINKS.map(link => linkOption(link, state));
  const candidates = blocks.length ? [] : links.filter(x => x.eligible).sort((a, b) => Number(state.favorites.includes(b.link.id)) - Number(state.favorites.includes(a.link.id)) || Number(b.link.kind === 'school') - Number(a.link.kind === 'school'));
  const preparation = links.filter(x => x.preparation).slice(0, 4);
  const month = briefs.months.find(x => Number(x.id) === Number(state.date.slice(0, 2)));
  const statTargets = SOCIAL_LINKS.filter(x => x.statGate && state.ranks[x.id] === 0 && state.stats[x.statGate.stat] < x.statGate.rank).sort((a, b) => Number(state.favorites.includes(b.id)) - Number(state.favorites.includes(a.id)) || a.statGate.rank - b.statGate.rank);
  const tartarusClosed = tartarus.closures.some(row => inWindow(state.date, row.start, row.end));
  return { tartarusClosed, blocks, conditional, calendar, events, urgent, active, next, candidates, preparation, month, statTargets };
}
