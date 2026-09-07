import { shareImageMeta } from './share-cards.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { GUIDE_DIRECTORY } from '../src/data/guideDirectory.js';
import { escapeHtml as esc, lookupForm } from './guide-helpers.mjs';

const canonical = 'https://zucram.github.io/P5Tracker/guides/';
const title = 'Persona 5 Royal and Persona 3 Reload guides and answers';
const description = 'Find free Persona 5 Royal and Persona 3 Reload guides for school answers, crosswords, Social Links, Elizabeth requests, fusion and missable deadlines.';
const games = [['royal', 'Persona 5 Royal', 'p5'], ['reload', 'Persona 3 Reload', 'p3']];
const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonical, inLanguage: 'en', hasPart: GUIDE_DIRECTORY.map(guide => ({ '@type': 'WebPage', name: guide.title, url: `${canonical}${guide.slug}/` })) };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | P5 Tracker</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../favicon.svg"><link rel="stylesheet" href="guide.css"><link rel="stylesheet" href="lookup.css"><link rel="stylesheet" href="directory.css">
${shareImageMeta(canonical)}
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}">
<script type="application/ld+json">${JSON.stringify(schema)}</script><script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script><script type="module" src="lookup-ui.js"></script></head>
<body><a class="skip" href="#content">Skip to guides</a><main id="content"><nav aria-label="Main"><a href="../">All games</a> · <a href="../p5/">Royal tracker</a> · <a href="../p3/">Reload tracker</a></nav>
<p class="eyebrow">FREE PERSONA REFERENCES</p><h1>Persona guides.<br>Find your next answer.</h1><p class="intro">Look up answers and deadlines for Royal or Reload, then keep playing at your own pace.</p>
${lookupForm({ guide: 'directory', label: 'Find a guide or topic', placeholder: 'Exams, fusion, Maruki', noun: 'guides', options: games.map(([id, name]) => [id, name]), categoryLabel: 'Game' })}
${games.map(([id, name, route]) => `<section class="game-section ${id}" data-lookup-group aria-labelledby="${id}"><div class="game-heading"><h2 id="${id}">${name}</h2><a href="../${route}/" data-umami-event="guide_open_tracker" data-umami-event-guide="directory-${id}">Open tracker →</a></div><div class="guide-grid">${GUIDE_DIRECTORY.filter(guide => guide.game === id).map(guide => `<article data-lookup-item data-lookup-category="${id}" data-lookup-text="${esc(`${name} ${id === 'royal' ? 'p5 p5r' : 'p3 p3r'} ${guide.title} ${guide.description} ${guide.terms}`)}"><a class="guide-card" href="${guide.slug}/" data-umami-event="directory_guide_opened" data-umami-event-guide="${guide.slug}" data-umami-event-game="${id}"><h3>${esc(guide.title)} <span aria-hidden="true">→</span></h3><p>${esc(guide.description)}</p></a></article>`).join('')}</div></section>`).join('')}
<section class="tracker-note"><h2>Keep the next step in one place</h2><p>The trackers save the progress you enter in this browser. Pick your month, record relationship ranks and check off completed tasks. Both are free, with no ads or required account. Use Sync to download a backup for another device.</p><p>Royal guides cover Persona 5 Royal. Reload guides cover the main campaign; Episode Aigis, FES and Portable are outside their scope. Names and future dates may reveal spoilers. Neither tracker guarantees a perfect run.</p></section>
<footer><p>Unofficial fan tools. Not affiliated with ATLUS or SEGA. Umami measures visits, guide opens and successful filter use. Search text stays on this page.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="directory">Support the free guides on Ko-fi</a> · <a href="https://github.com/zucram/P5Tracker/issues">Report a correction</a></p></footer></main></body></html>\n`;
const output = new URL('../public/guides/index.html', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== html) throw new Error('Guide directory is stale. Run npm run build:guides.');
} else await writeFile(output, html);
console.log(`Guide directory: ${GUIDE_DIRECTORY.length} guides.`);
