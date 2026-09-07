import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pageDir = path.join(root, 'public/guides/school-answers');
const data = JSON.parse(await readFile(path.join(root, 'src/data/schoolAnswers.json'), 'utf8'));
const months = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january'];
const monthNumbers = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '01'];
const titleCase = value => value[0].toUpperCase() + value.slice(1);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const safeUrl = value => {
  const url = new URL(value);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('Source URL must use HTTPS or HTTP.');
  return escape(url.href);
};
if (!Array.isArray(data.entries) || !data.entries.length) throw new Error('No reviewed school answers to render.');
const ids = new Set();
for (const entry of data.entries) {
  if (!entry || typeof entry.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(entry.id) || ids.has(entry.id) || !['classroom', 'exam'].includes(entry.type) || !months.includes(entry.month) || !/^\d{2}-\d{2}$/.test(entry.date) || entry.date.slice(0, 2) !== monthNumbers[months.indexOf(entry.month)] || Number(entry.date.slice(3)) < 1 || Number(entry.date.slice(3)) > new Date(2020, Number(entry.date.slice(0, 2)), 0).getDate() || !Array.isArray(entry.answers) || !entry.answers.length || entry.answers.some(answer => typeof answer !== 'string' || !answer.trim())) {
    throw new Error(`Invalid or duplicate answer entry: ${entry?.id}`);
  }
  ids.add(entry.id);
}
const entries = [...data.entries].sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month) || a.date.localeCompare(b.date) || a.type.localeCompare(b.type));
const includedMonths = months.filter(month => entries.some(entry => entry.month === month));
const monthOptions = includedMonths.map(month => `<option value="${month}">${titleCase(month)}</option>`).join('');
const monthLinks = includedMonths.map(month => `<a href="#${month}">${titleCase(month)}</a>`).join(' ');
const sections = includedMonths.map(month => {
  const rows = entries.filter(entry => entry.month === month).map(entry => {
    const date = `${titleCase(month)} ${Number(entry.date.slice(3))}`;
    const kind = entry.type === 'exam' ? 'Exam' : 'Classroom';
    const answers = entry.answers.length === 1 ? `<p>${escape(entry.answers[0])}</p>` : `<ol>${entry.answers.map(answer => `<li>${escape(answer)}</li>`).join('')}</ol>`;
    return `<tr id="${escape(entry.id)}" data-answer data-month="${month}" data-type="${entry.type}" data-date="${entry.date}"><th scope="row">${date}<span class="answer-type">${kind}</span></th><td>${answers}</td></tr>`;
  }).join('\n');
  return `<section data-month-section="${month}" aria-labelledby="${month}"><h2 id="${month}">${titleCase(month)} answers</h2><table><caption class="sr-only">${titleCase(month)} classroom and exam answers</caption><thead><tr><th scope="col">Date and type</th><th scope="col">Answer choices, in order</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}).join('\n');
const sources = Array.isArray(data.sources) ? data.sources : [];
const sourceLinks = sources.map(source => `<li><a href="${safeUrl(source.url)}">${escape(source.title || source.id)}</a></li>`).join('');
const coverage = typeof data.coverage?.summary === 'string' ? `<p>${escape(data.coverage.summary)}</p>` : '';
const coverageNotes = [
  ...(typeof data.coverage?.scope === 'string' ? [data.coverage.scope] : []),
  ...(Array.isArray(data.coverage?.omitted) ? data.coverage.omitted.map(item => `${item.date ? `${item.date}: ` : ''}${item.reason}`) : []),
  ...(Array.isArray(data.coverage?.limitations) ? data.coverage.limitations : []),
].filter(note => typeof note === 'string');
const coverageDetails = coverageNotes.length ? `<details><summary>Coverage and review notes</summary><ul>${coverageNotes.map(note => `<li>${escape(note)}</li>`).join('')}</ul></details>` : '';
const canonical = 'https://zucram.github.io/P5Tracker/guides/school-answers/';
const title = 'Persona 5 Royal classroom and exam answers | P5 Tracker';
const description = 'Look up Persona 5 Royal school answers by date. Browse classroom questions and exam answer choices, with optional month, type, and text filters.';
const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en' };
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${description}">
<link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="localpage.css">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="P5 Tracker">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
<script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script><script defer src="ui.js"></script>
</head>
<body><main>
<nav aria-label="Main"><a href="../../">P5 Tracker</a></nav>
<h1>Persona 5 Royal classroom and exam answers</h1>
<p>Find your in-game date below, then choose the listed answers in order. These school answers are for <strong>Persona 5 Royal</strong>; the original Persona 5 has different questions.</p>
${coverage}
<p><a class="cta" href="../../#calendar" data-umami-event="guide_open_tracker" data-umami-event-guide="school-answers">Plan the rest of your month</a></p>
<nav class="month-links" aria-label="Jump to a month">${monthLinks}</nav>
<form id="answer-filters" hidden role="search" aria-label="Filter school answers">
<div class="filter-grid"><label for="answer-month">Month<select id="answer-month"><option value="">All months</option>${monthOptions}</select></label><label for="answer-type">Type<select id="answer-type"><option value="">Classroom and exams</option><option value="classroom">Classroom</option><option value="exam">Exams</option></select></label></div>
<label for="answer-search">Search dates or answers<input id="answer-search" type="search" placeholder="For example, July 13 or gold" autocomplete="off"></label>
<button id="clear-filters" type="button">Clear filters</button>
</form>
<p id="answer-count" role="status" aria-live="polite" aria-atomic="true">${entries.length} dates listed.</p>
<p id="no-answers" hidden>No matching answers. Try another search or clear the filters.</p>
<noscript><p>All listed answers are available below. Use the month links or your browser's Find command to look up a date.</p></noscript>
${sections}
<section aria-labelledby="sources"><h2 id="sources">Sources and coverage</h2><p>Entries list the answer choices, without question text or story walkthroughs. Multiple choices on the same date appear in selection order.</p>${sourceLinks ? `<ul>${sourceLinks}</ul>` : ''}${coverageDetails}${data.reviewedAt ? `<p>Last reviewed: ${escape(data.reviewedAt)}.</p>` : ''}</section>
<nav class="related" aria-label="Related guides"><a href="../monthly-checklist/">Plan your month with the Royal checklist</a><a href="../third-semester/">Check the third-semester requirement</a></nav>
<footer><p>Unofficial fan tool for Persona 5 Royal. Not affiliated with ATLUS or SEGA.</p><p>We use Umami to measure page visits, filter use, and tracker link clicks. Search text stays on this page and is not sent to analytics.</p></footer>
</main></body></html>\n`;
if (process.argv.includes('--check')) {
  const existing = await readFile(path.join(pageDir, 'index.html'), 'utf8');
  if (existing !== html) throw new Error('School answer page is stale. Run node scripts/build-school-answers.mjs.');
  console.log(`School answer page is current: ${entries.length} dates.`);
} else {
  await writeFile(path.join(pageDir, 'index.html'), html);
  console.log(`Rendered ${entries.length} school-answer dates across ${includedMonths.length} months.`);
}
