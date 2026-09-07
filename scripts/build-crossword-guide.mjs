import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { CROSSWORD_DATA } from '../src/data/crosswordData.js';
import { escapeHtml as esc, lookupForm } from './guide-helpers.mjs';

if (CROSSWORD_DATA.length !== 38 || CROSSWORD_DATA.some((entry, index) => entry.id !== `cw_ans_${index + 1}` || !entry.q || !entry.a)) throw new Error('Review crossword coverage and stable save IDs before publishing.');

const slug = 'persona-5-royal-crossword-answers';
const title = 'Persona 5 Royal crossword answers: all 38 puzzles';
const description = 'Find all 38 Persona 5 Royal crossword answers by clue, answer or puzzle number. Search the Leblanc puzzles in order, including the final four answers.';
const canonical = `https://zucram.github.io/P5Tracker/guides/${slug}/`;
const tracker = `<a class="cta" href="../../p5/#reference" data-umami-event="guide_open_tracker" data-umami-event-guide="${slug}">Track your completed crosswords</a>`;
const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en', about: { '@type': 'VideoGame', name: 'Persona 5 Royal' } };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | P5 Tracker</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="../lookup.css">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify(schema)}</script><script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script><script type="module" src="../lookup-ui.js"></script>
<style>main{max-width:880px}.crossword-list{list-style:none;padding:0}.crossword-list li{display:grid;grid-template-columns:42px 1fr;gap:12px;padding:18px 0;border-bottom:1px solid #444}.puzzle-number{font-size:.9rem;color:#bbb}.crossword-list h3{font-size:1rem;font-weight:500;margin:0 0 6px;line-height:1.5}.crossword-list p{margin:0;font-size:1.3rem;font-weight:750;letter-spacing:.035em}.crossword-list small{font-size:.8rem;letter-spacing:0;font-weight:400;color:#bbb}.related{display:flex;flex-wrap:wrap;gap:12px 24px}.skip{position:absolute;top:-100px}.skip:focus{top:0;background:#111;padding:12px}.notice{padding:16px 20px;border-left:3px solid #ff8d8d;background:#ffffff06}li:target{outline:2px solid #ff8d8d;outline-offset:6px}@media(max-width:480px){main{padding:24px 16px}.crossword-list li{grid-template-columns:32px 1fr;gap:8px}}</style></head>
<body><a class="skip" href="#content">Skip to answers</a><main id="content"><nav aria-label="Main"><a href="../../">All games</a> · <a href="../../p5/">Royal tracker</a> · <a href="../school-answers/">School answers</a> · <a href="../">All guides</a></nav>
<h1>Persona 5 Royal crossword answers</h1><p>Search all 38 Leblanc puzzles by clue or number. Each numbered link goes straight to that answer.</p>
<p class="notice">Puzzles follow a fixed order. If you miss a night, your next puzzle stays the same.</p>
${lookupForm({ guide: slug, label: 'Find a clue, answer or puzzle number', placeholder: 'For example, school years, pollen or 36', noun: 'puzzles' })}
<section aria-labelledby="answers"><h2 id="answers">All 38 answers in order</h2><ol class="crossword-list">${CROSSWORD_DATA.map((entry, index) => `<li id="puzzle-${index + 1}" data-lookup-item data-lookup-number="${index + 1}" data-lookup-text="${esc(`${index + 1} ${entry.q} ${entry.a}`)}"><a class="puzzle-number" href="#puzzle-${index + 1}" aria-label="Link to puzzle ${index + 1}">#${index + 1}</a><div><h3>${esc(entry.q)}</h3><p>${esc(entry.a)} <small>${entry.a.length} letters</small></p></div></li>`).join('\n')}</ol></section>
<section><h2>Keep your place between visits</h2><p>The free Royal tracker has the same crossword list. Check off solved puzzles in Reference to update your calendar hints. Progress saves in your browser, and Sync lets you download a backup.</p><p>${tracker}</p></section>
<section><h2>Where are the crosswords?</h2><p>Look for the crossword magazine on the leftmost table in Cafe Leblanc on available evenings.</p><h2>Do crosswords take up the evening?</h2><p>In Royal, completing a crossword raises Knowledge without spending a time slot. You only need the highlighted main answer. This page lists those answers, not the optional words around them.</p><h2>Why doesn't my puzzle match a date guide?</h2><p>Puzzles follow a fixed sequence. Skipping an opportunity changes which puzzle you reach on a given date, so match the clue above.</p></section>
<section><h2>Sources and scope</h2><p>This guide uses the Royal tracker's existing English clue and answer dataset. The 38-answer order was checked against <a href="https://www.rpgsite.net/feature/9655-persona-5-royal-crossword-solutions">RPG Site's crossword reference</a> on September 7, 2026. <a href="https://www.pushsquare.com/guides/persona-5-royal-crossword-answers-all-crossword-puzzles-solved">Push Square's illustrated guide</a> also shows the earlier puzzles and explains the evening activity. This is a source review, not a new in-game playthrough.</p><p>For classroom and exam questions, use the separate <a href="../school-answers/">Royal school answers guide</a>.</p></section>
<nav class="related" aria-label="Related guides"><a href="../school-answers/">Classroom and exam answers</a><a href="../third-semester/">Third-semester requirements</a><a href="../monthly-checklist/">Monthly planning</a></nav>
<footer><p>Unofficial fan tool. Not affiliated with ATLUS or SEGA. Umami measures visits, successful filter use and link clicks. Search text stays on this page.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="${slug}">Help maintain the free guides on Ko-fi</a> · <a href="https://github.com/zucram/P5Tracker/issues">Report a correction</a></p></footer></main></body></html>\n`;
const output = new URL(`../public/guides/${slug}/index.html`, import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== html) throw new Error('Crossword guide is stale. Run npm run build:guides.');
} else {
  await mkdir(new URL('.', output), { recursive: true });
  await writeFile(output, html);
}
console.log(`Royal crossword guide: ${CROSSWORD_DATA.length} puzzles.`);
