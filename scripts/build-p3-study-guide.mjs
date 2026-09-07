import { shareImageMeta } from './share-cards.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { lookupForm } from './guide-helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [school, activities] = await Promise.all(['school-answers', 'activities'].map(async name =>
  JSON.parse(await readFile(path.join(root, `knowledge/p3-reload/${name}.json`), 'utf8'))));
const slug = 'persona-3-reload-school-answers';
const canonical = `https://zucram.github.io/P5Tracker/guides/${slug}/`;
const title = 'Persona 3 Reload school answers and exam requirements';
const description = 'Persona 3 Reload classroom and exam answers by month, final-day Academics requirements, and activities for Academics, Charm and Courage, with sources.';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const capitalize = value => String(value).replace(/^./, c => c.toUpperCase());
const months = [[4, 'April'], [5, 'May'], [6, 'June'], [7, 'July'], [8, 'August'], [9, 'September'], [10, 'October'], [11, 'November'], [12, 'December'], [1, 'January']];
const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const sourceNames = { 'www.rpgsite.net': 'RPG Site', 'www.gameskinny.com': 'GameSkinny', 'www.pushsquare.com': 'Push Square', 'aqiu384.github.io': 'Megaten database', 'gamefaqs.gamespot.com': 'GameFAQs' };
function sources(entry) {
  if (!entry.sources?.length) throw new Error(`Missing source for ${entry.id}`);
  return entry.sources.map(source => {
    const url = new URL(source.url);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Invalid source URL for ${entry.id}`);
    return `<a href="${esc(source.url)}" title="${esc(source.locator)}">${esc(sourceNames[url.hostname] || url.hostname.replace(/^www\./, ''))}</a>`;
  }).join(' · ');
}
function table(caption, headings, rows) {
  return `<div class="table-scroll" role="region" aria-label="${esc(caption)}" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${headings.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('\n')}</tbody></table></div>`;
}
const answerKind = { classroom: 'Classroom', exam: 'Exam', 'exam-check': 'Automatic exam day' };
const monthSections = months.map(([month, name]) => {
  const entries = school.entries.filter(entry => entry.month === month).sort((a, b) => a.date.localeCompare(b.date));
  const rows = entries.map(entry => {
    const answer = entry.kind === 'exam-check'
      ? `Automatic answer. ${entry.requiredAcademics ? `Top marks require Academics ${esc(entry.requiredAcademics)} and all exam answers correct.` : 'No choice to make.'} ${esc(entry.note || '')}`
      : entry.answers.map(esc).join('<br>');
    return `<tr id="${esc(entry.id)}" data-lookup-item data-lookup-category="${entry.kind === 'classroom' ? 'classroom' : 'exam'}" data-lookup-text="${esc(`${name} ${Number(entry.date.slice(3))} ${entry.date} ${entry.topic} ${entry.answers?.join(' ') || 'Automatic exam day'}`)}"><th scope="row">${esc(name)} ${esc(Number(entry.date.slice(3)))}</th><td>${esc(answerKind[entry.kind] || entry.kind)}<br>${esc(entry.topic)}</td><td>${answer}</td><td>${sources(entry)}</td></tr>`;
  });
  return `<section aria-labelledby="${name.toLowerCase()}" data-lookup-group><h2 id="${name.toLowerCase()}">${name} answers</h2>${entries.length ? table(`${name} classroom and exam answers`, ['Date', 'Question topic', 'Answer', 'Sources'], rows) : '<p>August has no classroom questions.</p>'}</section>`;
}).join('\n');
const activityRows = activities.activities.map(entry => {
  const days = entry.days.length === 7 ? 'Every day' : entry.days.map(day => weekdayNames[day - 1]).join(', ');
  const rewards = Object.entries(entry.rewards).map(([stat, points]) => `${esc(capitalize(stat))} +${esc(points)}`).join('<br>');
  const detail = [entry.requirements, entry.note].filter(Boolean).map(esc).join('<br>');
  return `<tr id="${esc(entry.id)}"><th scope="row">${esc(entry.title)}</th><td>${esc(entry.venue)}</td><td>${esc(days)}<br>${entry.slots.map(slot => esc(capitalize(slot))).join(', ')}${detail ? `<br>${detail}` : ''}</td><td>${entry.costYen === 0 ? 'Free' : `¥${esc(entry.costYen.toLocaleString('en-US'))}`}</td><td>${rewards}</td><td>${sources(entry)}</td></tr>`;
});
const activityTable = table('Repeatable social-stat activities', ['Activity', 'Location', 'Schedule and conditions', 'Cost', 'Stat points', 'Sources'], activityRows);
const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en', about: { '@type': 'VideoGame', name: 'Persona 3 Reload' } };
const tracker = `<a class="cta" href="../../p3/#calendar" data-umami-event="guide_open_tracker" data-umami-event-guide="${slug}">Open the Reload monthly calendar</a>`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | P5 Tracker</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="../p3-guide.css"><link rel="stylesheet" href="../lookup.css"><script type="module" src="../lookup-ui.js"></script>
${shareImageMeta(canonical)}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="P5 Tracker">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script></head>
<body class="reload-guide"><a class="skip" href="#content">Skip to content</a><main id="content"><nav aria-label="Main"><a href="../../">All games</a> · <a href="../../p3/">P3 Reload tracker</a> · <a href="../">All guides</a></nav>
<h1>${esc(title)}</h1><p>English classroom and exam answers for the Persona 3 Reload main campaign, arranged by date. Multiple answers in one row appear in the order they are asked. Episode Aigis is outside this guide's scope.</p>
<p>${tracker}</p><nav aria-label="Jump to month">${months.map(([, name]) => `<a href="#${name.toLowerCase()}">${name}</a>`).join(' · ')} · <a href="#activities">Social-stat activities</a></nav>
<p>Final exam days use an automatic answer. Their rows show the Academics rank needed for top marks alongside correct answers on the earlier exam days.</p>
${lookupForm({ guide: slug, label: 'Find a school date, topic or answer', placeholder: 'For example, July 14 or spiral', noun: 'dates', options: [['classroom', 'Classroom'], ['exam', 'Exams, including automatic final days']], categoryLabel: 'Question type' })}
${monthSections}
<section aria-labelledby="activities"><h2 id="activities">Academics, Charm and Courage activities</h2><p>These are repeatable activities with listed costs and usual schedules. Story events can override opening hours. Rewards are internal stat points, not the musical notes shown on screen.</p>${activityTable}</section>
<section aria-labelledby="sources"><h2 id="sources">Sources and coverage</h2><p>Each row links to its reference. Question topics are short lookup labels; answers use the English choices. These tables list school answers and selected activities, not a complete daily route.</p><p>Social Link openings have separate rank, introduction and stat requirements. The <a href="../persona-3-reload-social-links/">Social Link guide</a> lists those requirements. The <a href="../persona-3-reload-deadlines/">deadline guide</a> covers rescues, Elizabeth requests and Linked Episodes.</p></section>
<nav class="related" aria-label="Reload guides"><a href="../persona-3-reload-social-link-answers/">Social Link answers</a> · <a href="../persona-3-reload-elizabeth-requests/">All Elizabeth requests</a> · <a href="../persona-3-reload-fusion-guide/">Persona fusion guide</a> · <a href="../persona-3-reload-social-links/">Social Links and stat requirements</a> · <a href="../persona-3-reload-deadlines/">Rescue deadlines, requests and Linked Episodes</a></nav><p>${tracker}</p>
<footer><p>Unofficial fan tool. Not affiliated with ATLUS or SEGA. Umami measures page visits and link clicks; this guide does not collect game saves.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="${slug}">Support content checks and updates on Ko-fi</a></p></footer></main></body></html>
`;
const output = path.join(root, 'public/guides', slug, 'index.html');
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== html) throw new Error(`${slug} is stale. Run node scripts/build-p3-study-guide.mjs.`);
} else {
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
}
console.log(`Reload school guide ${process.argv.includes('--check') ? 'current' : 'generated'}: ${school.entries.length} school entries, ${activities.activities.length} activities.`);
