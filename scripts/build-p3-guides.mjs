import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SOCIAL_LINKS, SOURCES } from '../src/p3/data.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'knowledge/p3-reload/facts.json'), 'utf8'));
const facts = data.facts;
const accepted = fact => fact && ['corroborated', 'single-source'].includes(fact.status) && fact.kind === 'constraint';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const words = value => String(value ?? '').replaceAll('-', ' ').replace(/^./, c => c.toUpperCase());
const date = value => /^\d{2}-\d{2}$/.test(value ?? '') ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(value.slice(0, 2)) - 1]} ${Number(value.slice(3))}` : 'Not established';
const byId = new Map(facts.map(f => [f.id, f]));
function sourceLink(url, title) {
  if (!['https:', 'http:'].includes(new URL(url).protocol)) throw new Error('Invalid source protocol');
  return `<a href="${esc(url)}">${esc(title)}</a>`;
}
const evidence = fact => (fact?.evidence ?? []).map(e => sourceLink(e.url, `${new URL(e.url).hostname.replace(/^www\./, '')}: ${e.locator}`)).join('<br>');
const status = fact => fact.status === 'single-source' ? 'Single source' : 'Corroborated';
const prerequisites = fact => {
  const value = fact.value;
  const result = (fact.dependsOn ?? []).map(id => {
    const dep = byId.get(id);
    return accepted(dep) ? esc(dep.subject) : `${esc(dep?.subject ?? 'Additional prerequisite')}: details need checking in game`;
  });
  if (value.requiresConversation) result.push(`Speak with ${esc(value.requiresConversation)}`);
  if (value.requiresWithholdingForm) result.push('Keep the form until the required follow-up');
  if (value.requiresAcceptance) result.push('Accept the invitation');
  if (value.acceptBeforeTrip) result.push('Accept the request before the trip');
  if (value.requiredItem) result.push(`Required item: ${esc(words(value.requiredItem))}`);
  return result.join('; ') || 'Check story progress and availability in game';
};
const table = (caption, headings, rows) => `<div class="table-scroll" role="region" aria-label="${esc(caption)}" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${headings.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('\n')}</tbody></table></div>`;
const row = (id, cells) => `<tr id="${esc(id)}"><th scope="row">${cells[0]}</th>${cells.slice(1).map(c => `<td>${c}</td>`).join('')}</tr>`;
const slSlug = 'persona-3-reload-social-links';
const dlSlug = 'persona-3-reload-deadlines';
const tracker = slug => `<a class="cta" href="../../p3/#calendar" data-umami-event="guide_open_tracker" data-umami-event-guide="${slug}">Open the Reload calendar</a>`;
function page(slug, title, description, body) {
  const canonical = `https://zucram.github.io/P5Tracker/guides/${slug}/`;
  const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en', dateModified: data.reviewedAt };
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | P5 Tracker</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="../p3-guide.css">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="P5 Tracker"><meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script></head>
<body class="reload-guide"><a class="skip" href="#content">Skip to content</a><main id="content"><nav aria-label="Main"><a href="../../">All games</a> · <a href="../../p3/">P3 Reload tracker</a></nav>
<h1>${esc(title)}</h1><p class="notice">Spoilers: character identities, unlock requirements and dates through January. These tables cover the Persona 3 Reload main campaign, excluding Episode Aigis.</p>
${body}
<section aria-labelledby="coverage"><h2 id="coverage">Sources and coverage</h2><p>Last reviewed: <time datetime="${esc(data.reviewedAt)}">${esc(data.reviewedAt)}</time>. Each table links to the source sections used for its entries. Corroborated means multiple sources support the entry; a single-source label means it has one reviewed reference. Individual fields may have different source coverage.</p><p>The planner is in beta. These guides cover the listed mechanics and do not promise a complete daily route or every availability exception. Unresolved dates are omitted. Check the in-game invitation, request or notice before spending a time slot.</p></section>
<nav class="related" aria-label="Reload guides"><a href="../persona-3-reload-social-link-answers/">Social Link answers</a> · <a href="../persona-3-reload-elizabeth-requests/">All Elizabeth requests</a> · <a href="../persona-3-reload-fusion-guide/">Persona fusion guide</a> · <a href="../persona-3-reload-school-answers/">School answers and exam requirements</a> · <a href="../${slSlug}/">Social Links and stat requirements</a> · <a href="../${dlSlug}/">Rescue deadlines, requests and Linked Episodes</a></nav><p>${tracker(slug)}</p>
<footer><p>Unofficial fan tool. Not affiliated with ATLUS or SEGA. Umami measures page visits and link clicks; this guide does not collect game saves.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="${slug}">Support content checks and updates on Ko-fi</a></p></footer></main></body></html>\n`;
}
const slRows = SOCIAL_LINKS.map(link => {
  const schedule = facts.find(f => accepted(f) && f.category === 'social-link' && f.value.link === link.id);
  const gateFact = facts.find(f => accepted(f) && f.category === 'social-stat' && f.value.link === link.id);
  const gate = gateFact ? `${words(gateFact.value.stat)} rank ${gateFact.value.rank}` : link.statGate ? `${link.statGate.stat} rank ${link.statGate.rank}` : 'No listed stat gate';
  const scheduleText = link.kind === 'story' ? 'Story progression' : schedule ? `${esc((schedule.value.days ?? []).map(words).join(', '))}<br>${esc(words(schedule.value.timeSlot))}<br>First listed date: ${date(schedule.value.start)}<br>${status(schedule)}` : 'Schedule not established';
  const refs = (link.sourceIds ?? []).map(id => SOURCES.find(s => s.id === id)).filter(Boolean).map(s => sourceLink(s.url, s.title)).join('<br>');
  return row(link.id, [`${esc(link.arcana)}<br>${esc(link.name)}`, `${esc(gate)}<br>${esc(link.note)}`, scheduleText, `${refs}${schedule ? `<br>${evidence(schedule)}` : ''}${gateFact ? `<br>${evidence(gateFact)}` : ''}`]);
});
const socialBody = `<p>Compare all ${SOCIAL_LINKS.length} Social Links, their introductions and ${SOCIAL_LINKS.filter(l => l.statGate).length} social-stat gates. Use the usual weekly schedule to shortlist an activity, then check the character in game.</p><p>${tracker(slSlug)}</p><h2 id="requirements">Social Link unlock requirements and usual days</h2><p>Usual schedules are baseline patterns. Introductions, story progress, school closures and rank-specific exceptions apply. A first listed date may be an introduction rather than a rank-up. Reaching a stat requirement alone does not unlock a link. Hermit also has access on available holidays.</p>${table('Persona 3 Reload Social Links, requirements and usual schedules', ['Arcana and character', 'Stat gate and introduction', 'Usual schedule', 'Sources'], slRows)}<h2>How to use the list with the planner</h2><p>Record your current ranks and social stats in the Reload tracker. Check the introduction conditions for the link you want next. Leave room for dated events by reviewing the <a href="../${dlSlug}/">rescue, request and Linked Episode tables</a> before choosing a free-time activity.</p>`;
const rescues = facts.filter(f => accepted(f) && f.category === 'rescue');
const requests = facts.filter(f => accepted(f) && f.category === 'request' && f.value.start && f.value.end);
const episodes = facts.filter(f => accepted(f) && f.category === 'linked-episode' && f.value.start && f.value.end);
const meaning = { 'rescue-deadline': 'Rescue deadline', 'request-deadline': 'Request deadline', 'outer-window': 'Outer window', 'calendar-event': 'Event date', 'invitation': 'Invitation date', 'item-opportunity': 'Item opportunity, not a turn-in deadline', 'purchase-opportunity': 'Purchase opportunity, not a turn-in deadline' };
const rescueTable = table('Missing people: appearance dates and rescue deadlines', ['Person', 'Appears', 'Rescue by', 'Tartarus floor', 'Review and sources'], rescues.map(f => row(f.id, [esc(f.subject), date(f.value.start), date(f.value.end), esc(f.value.floor ?? 'Not established'), `${status(f)}<br>${evidence(f)}`])));
const datedTable = (entries, caption) => table(caption, ['Event', 'Start', 'End', 'What these dates mean', 'Requirements and details', 'Review and sources'], entries.map(f => {
  const v = f.value;
  const details = [prerequisites(f)];
  if (v.item) details.push(`Item: ${esc(words(v.item))}`);
  if (v.provider) details.push(`Provider: ${esc(words(v.provider))}`);
  if (v.location) details.push(`Location: ${esc(words(v.location))}`);
  if (v.buyDistinctDrinks) details.push(`Buy ${esc(v.buyDistinctDrinks)} distinct drinks`);
  if (v.timeSlot) details.push(`Time: ${esc(words(v.timeSlot))}`);
  if (v.consumesSlot === false) details.push('Does not consume a time slot');
  return row(f.id, [esc(f.subject), date(v.start), date(v.end), esc(meaning[v.dateMeaning] ?? 'Date type not established; consult source'), details.join('<br>'), `${status(f)}<br>${evidence(f)}`]);
}));
const deadlineBody = `<p>Check ${rescues.length} missing-person rescues, ${requests.length} dated Elizabeth request entries and ${episodes.length} Linked Episode entries, including setup and invitations. Start and end dates describe the type of event shown; they do not establish daily availability.</p><p>${tracker(dlSlug)}</p><nav aria-label="Jump to deadline type"><a href="#rescues">Missing people</a> · <a href="#requests">Elizabeth requests</a> · <a href="#episodes">Linked Episodes</a></nav><h2 id="rescues">Missing-person rescue deadlines</h2><p>Rescue each person in Tartarus by the listed closing date. The appearance date tells you when their rescue window begins. Plan with time to spare; the table does not assess your combat readiness or whether a particular evening is free.</p>${rescueTable}<h2 id="requests">Elizabeth request deadlines and dated opportunities</h2><p>Accept a request before collecting its item when required, then check Elizabeth's current request list. An item or purchase opportunity is a chance to acquire something, not necessarily the request's turn-in deadline. Dependencies appear in the requirements column.</p>${datedTable(requests, 'Dated Elizabeth requests and item opportunities')}<h2 id="episodes">Linked Episode windows and prerequisites</h2><p>An outer window is the earliest listed start through the last listed end, subject to prior episodes, conversations and story progress. The character is not necessarily available every day inside it. Complete the required earlier events and check invitations in game. Optional route choices are not hard deadlines.</p>${datedTable(episodes, 'Linked Episodes, setup and invitations')}<h2>Keep free-time planning separate from deadlines</h2><p>Use the <a href="../${slSlug}/">Social Link schedule and stat requirements</a> to choose between available activities. The tracker lets you record progress alongside dated obligations. These tables do not guarantee that every objective fits into one playthrough.</p>`;
for (const [slug, title, description, body] of [
  [slSlug, 'Persona 3 Reload Social Links: requirements and schedules', 'Find Persona 3 Reload Social Link characters, unlock conditions, Academics, Charm and Courage requirements, and usual weekly schedules with sources.', socialBody],
  [dlSlug, 'Persona 3 Reload deadlines: missing people, requests and Linked Episodes', 'Check Persona 3 Reload missing-person rescue deadlines, Elizabeth request dates and Linked Episode windows, with prerequisites and linked sources.', deadlineBody],
]) {
  const output = path.join(root, 'public/guides', slug, 'index.html');
  const html = page(slug, title, description, body);
  if (process.argv.includes('--check')) {
    if (await readFile(output, 'utf8') !== html) throw new Error(`${slug} is stale. Run node scripts/build-p3-guides.mjs.`);
  } else {
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, html);
  }
}
console.log(`Reload guides ${process.argv.includes('--check') ? 'current' : 'generated'}: ${SOCIAL_LINKS.length} links, ${rescues.length} rescues, ${requests.length} dated requests, ${episodes.length} Linked Episode entries.`);
