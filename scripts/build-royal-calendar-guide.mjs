import { readFile, writeFile } from 'node:fs/promises';
import { PALACE_DEADLINES, PALACE_DATES_REVIEWED } from '../src/data/palaceDeadlines.js';
import { shareImageMeta } from './share-cards.mjs';
import { escapeHtml as esc, lookupForm } from './guide-helpers.mjs';

const canonical = 'https://zucram.github.io/P5Tracker/guides/monthly-checklist/';
const title = 'Persona 5 Royal Palace deadlines and monthly checklist';
const description = 'Check Royal Palace route, calling-card and boss deadlines from Kamoshida to the third semester. Plan your month with a free progress checklist.';
const longDate = date => {
  const [month, day] = date.split('/').map(Number);
  return `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1]} ${day}`;
};
const tracker = '<a class="cta" href="../../p5/#calendar" data-umami-event="guide_open_tracker" data-umami-event-guide="monthly-checklist">Open the Royal calendar</a>';
const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en', dateModified: PALACE_DATES_REVIEWED };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | P5 Tracker</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="../lookup.css"><link rel="stylesheet" href="dates.css">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}">${shareImageMeta(canonical)}
<script type="application/ld+json">${JSON.stringify(schema)}</script><script type="module" src="../lookup-ui.js"></script><script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script></head>
<body><a class="skip" href="#content">Skip to deadlines</a><main id="content"><nav aria-label="Main"><a href="../../">All games</a> · <a href="../../p5/">Royal tracker</a> · <a href="../">All guides</a></nav>
<h1>Persona 5 Royal Palace deadlines</h1><p>Keep the route, calling card and boss dates separate. The date shown for the story's consequences can be too late to finish a Palace.</p><p class="notice">Royal only. Names and dates below include later Palaces and the third semester. A deadline is the last opportunity for that step, not a suggested day to begin.</p>
${lookupForm({ guide: 'monthly-checklist', label: 'Find a Palace or date', placeholder: 'Kamoshida, July, 10/8', noun: 'Palaces' })}
<div class="palace-dates">${PALACE_DEADLINES.map(p => `<section id="${p.id}" data-lookup-item data-lookup-text="${esc([p.name, p.place, ...[p.route, p.card, p.heist].flatMap(date => [date, longDate(date)])].join(' '))}" aria-labelledby="${p.id}-title"><h2 id="${p.id}-title">${esc(p.name)} <span>${esc(p.place)}</span></h2><dl>${[['Route by', p.route], [p.fixed ? 'Card on' : 'Card by', p.card], [p.fixed ? 'Heist on' : 'Heist by', p.heist]].map(([label, date]) => `<div><dt>${label}</dt><dd>${esc(longDate(date))}</dd></div>`).join('')}</dl><p>${esc(p.note)}</p><details><summary>Sources for these dates</summary><ul>${p.sources.map((url, i) => `<li><a href="${esc(url)}">${esc(new URL(url).hostname.replace(/^www\./, ''))} · reference ${i + 1}</a></li>`).join('')}</ul></details></section>`).join('')}</div>
<section data-lookup-hide><h2>Give yourself time before the deadline</h2><p>Secure the route first, then leave the Palace and arrange the calling card. Most heists happen on a later day. Futaba and Shido combine the calling card and boss fight on one day; Niijima and the final Royal Palace use fixed story dates.</p><p>Madarame requires multiple visits, so reach the courtyard barrier by May 31. Begin Niijima by November 16. In the third semester, complete the required Mementos section by February 1 before finishing the Palace route.</p><p>These dates assume you can finish each remaining step in its allotted visit. Low resources or unfinished prerequisites can require more time. Finish earlier when possible and keep a separate in-game save before committing to the final days.</p></section>
<section data-lookup-hide><h2>Use the monthly checklist alongside your game</h2><ol><li>Open the tracker and select your current month.</li><li>Review Palace dates, relationship goals and dated activities.</li><li>Check off tasks you finish and update your ranks after playing.</li></ol><p>You choose your daily route. The tracker does not read your game save or guarantee a perfect run. Eligible unfinished tasks can carry forward; dated opportunities can expire. Use Sync to download a backup before changing devices or clearing browser data.</p><p>${tracker}</p></section>
<section data-lookup-hide><h2>Review and scope</h2><p>Palace dates reviewed <time datetime="${PALACE_DATES_REVIEWED}">${PALACE_DATES_REVIEWED}</time> against the linked player guides. The tracker and this page use the same date records. Futaba's route date is August 19 in the linked Royal walkthroughs; one general calendar lists August 18. Aim earlier and check the in-game mission calendar. This is a targeted reference review, not a new in-game validation run.</p></section>
<nav class="related" aria-label="Related guides"><a href="../school-answers/">School and exam answers</a><a href="../persona-5-royal-crossword-answers/">Crossword answers</a><a href="../third-semester/">Maruki's confidant requirement</a><a href="../confidant-tracker/">Confidant tracking</a></nav>
<footer><p>Free, ad-free and unofficial. Not affiliated with ATLUS or SEGA. Umami measures visits and guide use; search text and game progress are not sent in events.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="monthly-checklist">Support the free guides on Ko-fi</a> · <a href="https://github.com/zucram/P5Tracker/issues">Report a correction</a></p></footer></main></body></html>\n`;
const output = new URL('../public/guides/monthly-checklist/index.html', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== html) throw new Error('Royal calendar guide is stale. Run npm run build:guides.');
} else await writeFile(output, html);
console.log(`Royal calendar guide: ${PALACE_DEADLINES.length} Palace schedules.`);
