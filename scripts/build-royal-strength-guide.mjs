import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { ROYAL_STRENGTH_REQUESTS } from '../src/data/royalStrength.js';
import { PERSONA_DATA } from '../src/data/personaData.js';
import { shareImageMeta } from './share-cards.mjs';
import { escapeHtml as esc, lookupForm } from './guide-helpers.mjs';

const slug = 'persona-5-royal-strength-confidant';
const title = 'Persona 5 Royal Strength confidant: requests and skill cards';
const description = 'Find all 10 Royal Strength requests, the exact required skills, normal and alarm skill-card sources, and fixed group fusion ingredients for the twins.';
const canonical = `https://zucram.github.io/P5Tracker/guides/${slug}/`;
const calculator = 'https://chinhodado.github.io/persona5_calculator/indexRoyal.html';
const registry = new Map(PERSONA_DATA.registry.map(persona => [persona.name, persona]));
if (ROYAL_STRENGTH_REQUESTS.length !== 10 || ROYAL_STRENGTH_REQUESTS.some((r, i) => r.rank !== i + 1 || !registry.has(r.persona) || !registry.has(r.card) || r.ingredients?.some(name => !registry.has(name)))) throw new Error('Review Strength request coverage and Persona names.');
const cards = ROYAL_STRENGTH_REQUESTS.map(r => {
  const persona = registry.get(r.persona);
  return `<li class="request-card" id="rank-${r.rank}" data-lookup-item data-lookup-number="${r.rank}" data-lookup-category="${r.alarm ? 'alarm' : 'normal'}" data-lookup-text="${esc(`${r.rank} ${r.persona} ${r.skill} ${r.card} ${(r.ingredients || []).join(' ')}`)}"><a class="rank-label" href="#rank-${r.rank}">Rank ${r.rank}</a><h3>${esc(r.persona)}</h3><p class="required-skill">Required skill: <strong>${esc(r.skill)}</strong></p><p>${esc(persona.arcana)} · Base level ${persona.level}</p>
${r.ingredients ? `<p class="recipe"><strong>Group fusion:</strong> ${r.ingredients.map(esc).join(' + ')} → ${esc(r.persona)}</p>` : `<p>Obtain ${esc(r.persona)}, or find a recipe in the <a href="${calculator}">Royal fusion calculator</a> with your DLC settings.</p>`}
${r.preparation ? `<p>${esc(r.preparation)}</p>` : ''}
<p class="card-method"><span class="card-mode">${r.alarm ? 'During an alarm' : 'No alarm'}</span> Electric Chair: <strong>${esc(r.card)}</strong> → ${esc(r.skill)} skill card. Apply the card to <strong>${esc(r.persona)}</strong>.</p></li>`;
}).join('\n');
const schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical, inLanguage: 'en', about: { '@type': 'VideoGame', name: 'Persona 5 Royal' } };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | P5 Tracker</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="icon" href="../../favicon.svg"><link rel="stylesheet" href="../guide.css"><link rel="stylesheet" href="../lookup.css"><link rel="stylesheet" href="../strength.css">
${shareImageMeta(canonical)}
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><script type="application/ld+json">${JSON.stringify(schema)}</script><script defer src="https://cloud.umami.is/script.js" data-website-id="7fae2edd-7137-49ac-8ec6-714a18a48e3f" data-domains="zucram.github.io"></script><script type="module" src="../lookup-ui.js"></script></head>
<body><a class="skip" href="#requests">Skip to requests</a><main><nav aria-label="Main"><a href="../../">All games</a> · <a href="../../p5/#confidants">Royal confidant tracker</a> · <a href="../">All guides</a></nav><h1>Royal Strength requests and skill cards</h1><p>Caroline and Justine ask for ten specific Persona-and-skill combinations. Find your next rank below, check the exact skill name, and bring the finished Persona to the Velvet Room.</p>
<p class="notice">These are <strong>Persona 5 Royal</strong> requests. Several early ranks differ from the original Persona 5.</p>
<nav class="rank-links" aria-label="Jump to a Strength rank">${ROYAL_STRENGTH_REQUESTS.map(r => `<a href="#rank-${r.rank}">${r.rank}</a>`).join('')}</nav>
<section><h2>Choose a route that fits your progress</h2><p>Skills can come from leveling, inheritance or a skill card. The cards below are an alternative, not a requirement: you need the Electric Chair, a Blank Card and the listed donor Persona. Alarm results require an active fusion alarm. Check the execution preview before confirming; accidents can change the result.</p><p>For ordinary fusion recipes, set the <a href="${calculator}">calculator's Royal DLC options</a> to match your game. This page lists fixed group recipes; it does not assume a particular DLC setup for two-Persona recipes.</p></section>
${lookupForm({ guide: slug, label: 'Find a rank, Persona or skill', placeholder: '6, Neko Shogun, Dekaja or Ose', noun: 'requests', options: [['normal', 'No alarm needed for card'], ['alarm', 'Alarm needed for card']], categoryLabel: 'Skill-card method' })}
<section aria-labelledby="requests"><h2 id="requests">All 10 requests, in rank order</h2><ol class="request-list">${cards}</ol></section>
<section><h2>Record each completed rank</h2><p>After the twins accept a request, increase Strength by one in the Royal tracker's Confidants tab. Open its rank guide to see the next request. Progress saves in your browser; Sync downloads a backup.</p><p><a class="cta" href="../../p5/#confidants" data-umami-event="guide_open_tracker" data-umami-event-guide="${slug}">Track your Strength rank</a></p></section>
<section><h2>Why won't the twins accept my Persona?</h2><p>Check that it is in your current stock, has the exact requested skill and matches the next rank. High Counter, Counterstrike and Counter are different skills. Showing the Persona completes the request; simply fusing it does not update this tracker.</p><h2>Can I fuse above Joker's level?</h2><p>Royal's Strength rank 5 grants Special Treatment, which allows higher-level fusion for an extra fee. Base levels above identify the requested Personas; they are not a promise that every ingredient or unlock is available in your save.</p><h2>Do requests use a time slot?</h2><p>Showing a completed request does not advance time. Optional outings with the twins are separate activities and can award skill cards, but they do not replace the ten rank requests.</p></section>
<section><h2>Sources and scope</h2><p>Reviewed September 7, 2026. The ten requested pairs were checked against <a href="https://www.rpgsite.net/feature/5486-persona-5-royal-strength-confidant-fusion-solutions-guide">RPG Site's Royal Strength reference</a>. Card results and native skill levels were compared with <a href="https://github.com/chinhodado/persona5_calculator/blob/802422dad1f5b9eee441e594e738aceaeb9e5a85/data/PersonaDataRoyal.js">the Royal calculator's Persona data</a>, and group recipes with its <a href="https://github.com/chinhodado/persona5_calculator/blob/802422dad1f5b9eee441e594e738aceaeb9e5a85/data/Data5Royal.js">Royal fusion data</a>. <a href="https://p5rguide.neocities.org/strength">P5R Guide's card table</a> provides a second comparison for normal and alarm itemizations.</p><p>This is a source review, not a fresh in-game playthrough. It covers request targets and listed preparation methods, rather than a day-by-day route, every unlock condition or every possible recipe.</p></section>
<nav class="related" aria-label="Related guides"><a href="../confidant-tracker/">Confidant tracking</a><a href="../monthly-checklist/">Palace deadlines</a><a href="../persona-5-royal-crossword-answers/">Crossword answers</a></nav><footer><p>Unofficial fan tool. Not affiliated with ATLUS or SEGA. Umami measures visits and link/filter use. Search text stays on this page.</p><p><a href="https://ko-fi.com/K3K11RWTSL" data-umami-event="guide_support_click" data-umami-event-guide="${slug}">Support the free guides on Ko-fi</a> · <a href="https://github.com/zucram/P5Tracker/issues">Report a correction</a></p></footer></main></body></html>\n`;
const output = new URL(`../public/guides/${slug}/index.html`, import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8') !== html) throw new Error('Strength guide is stale. Run npm run build:guides.');
} else {
  await mkdir(new URL('.', output), { recursive: true });
  await writeFile(output, html);
}
console.log('Royal Strength guide: 10 requests and skill-card sources.');
