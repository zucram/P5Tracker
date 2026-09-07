import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { readKnowledge, validateKnowledge } from './validate-p3-knowledge.mjs';

const directory = resolve('knowledge/p3-reload');
const data = await readKnowledge(directory);
const errors = validateKnowledge(data);
if (errors.length) throw new Error(errors.join('\n'));
const facts = data.facts.facts;
const sources = data.sources.sources;
const disputes = data.disputes.disputes;
const countBy = (items, key) => items.reduce((counts, item) => ({ ...counts, [item[key]]: (counts[item[key]] || 0) + 1 }), {});
const coverage = {
  schemaVersion: 1,
  game: data.facts.game,
  reviewedAt: data.facts.reviewedAt,
  releaseReady: false,
  sourceRecords: sources.length,
  factualAndPlanningRecords: facts.length,
  recordsByCategory: countBy(facts, 'category'),
  recordsByStatus: countBy(facts, 'status'),
  disputesByStatus: countBy(disputes, 'status'),
  months: data.months.months.map(month => ({ id: month.id, name: month.name, referencedRecords: month.factIds.length })),
  limits: [
    'Source discovery is broad, not an exhaustive census of every online guide.',
    'Catalog inclusion does not mean a complete guide audit or independent evidence.',
    'Record status is a summary; evidence.supports identifies which fields each source actually supports.',
    'A source agreement is not an in-game test. Unknown and disputed rules cannot justify a completion guarantee.',
    'The 19 baseline availability records cover manual Social Links. The prototype roster separately includes three story-related links.',
    'Document floors are recorded; Tartarus opening dates and all gatekeeper details are not yet modelled.',
    'Only dated or preparation-sensitive requests are extracted; this is not a complete 101-request solution database.',
  ],
  releaseGaps: [
    { id: 'school-calendar', required: 'Complete school closures, pre-exam exceptions, holidays, sports training and per-slot story blocks.', acceptance: 'April–January event calendar reconciled against two distinct routes; free slots never inferred from an omitted entry.' },
    { id: 'link-prerequisites', required: 'Resolve introductions, required ranks, items, exam conditions and rank-specific availability.', acceptance: 'Every suggested Social Link opening has a complete, cited eligibility rule and explicit unknown handling.' },
    { id: 'episode-days', required: 'Actual available meeting days inside Linked Episode windows, optional branches and missed-chain behavior.', acceptance: 'No outer-window endpoint is presented as a guaranteed available meeting; invitation and event dates are distinct.' },
    { id: 'tartarus', required: 'Unlock dates, forced/tutorial visits, rescue access and alternatives for players needing multiple visits.', acceptance: 'Recommendations distinguish dungeon access, document floors, rescue deadlines and author-chosen visit dates.' },
    { id: 'affinity-recovery', required: 'Point requirements, matching Arcana effects, platonic/romance differences and recovery activities.', acceptance: 'A rank-up suggestion can explain its assumptions and has a fallback if affinity is insufficient.' },
    { id: 'source-disputes', required: 'Resolve or safely omit remaining disputed advice.', acceptance: 'No unresolved claim drives a definitive warning or eligibility result.' },
    { id: 'playthrough-validation', required: 'Check the semi-guide against full campaign routes and representative in-game saves.', acceptance: 'Early, midgame and January scenarios tested, including missed rescues, missed episodes and optional events. No blanket 100% promise.' },
  ],
};
const lines = [
  '# Persona 3 Reload knowledge review', '',
  `Reviewed ${coverage.reviewedAt}. This research supports the Reload beta semi-daily companion. The complete knowledge base is not a verified perfect-run route; see p3-reload-release.md for the shipped subset and limits.`, '',
  `The catalog contains ${sources.length} source records. The knowledge base contains ${facts.length} factual and planning records, with original briefs for all ten months from April through January. The catalog includes mirrors and partial guides; these are labelled and are not counted as independent confirmation.`, '',
  '## What is collected', '',
  '| Category | Records |', '| --- | ---: |',
  ...Object.entries(coverage.recordsByCategory).map(([key, count]) => `| ${key} | ${count} |`), '',
  'Each record has a source URL, a section locator and the fields supported by that source. A date can mean a deadline, an opening, a story event, an item opportunity or a route choice. The dataset keeps those meanings separate.', '',
  'The source catalog covers GameFAQs, PowerPyx, PSNProfiles, Neoseeker, Steam, Game8 and RPG Site, with other candidates retained for review. See the [source research](p3-reload-research.md) and [machine-readable catalog](../knowledge/p3-reload/sources.json).', '',
  '## Disagreements', '',
  '| Question | State | Decision |', '| --- | --- | --- |',
  ...disputes.map(item => `| ${item.subject.replaceAll('|', '/')} | ${item.status} | ${item.decision.replaceAll('|', '/')} |`), '',
  '## Monthly direction', '',
  'These are editorial briefs, not a validated schedule. Their record links include relevant open windows and continuing opportunities, not a promise that every activity can be done each day. The player should see dated risks first, then choose among available priorities.', '',
  ...data.months.months.flatMap(month => [
    `### ${month.name}`, '', ...month.priorities.map(text => `- ${text}`), '',
    `Before release: ${month.gaps.join(' ')}`, '',
  ]),
  '## Release gaps', '',
  ...coverage.releaseGaps.map(gap => `- ${gap.required} ${gap.acceptance}`), '',
  'The initial tests check dates, references, dependencies and disputed-rule handling. They cannot establish game accuracy or that an altered playthrough can still complete every link.', '',
  '## Updating the dataset', '',
  'Edit the records and evidence in `knowledge/p3-reload/`, validate them with `node scripts/validate-p3-knowledge.mjs`, and regenerate this report with `node scripts/build-p3-knowledge-report.mjs`. Run `node --test scripts/validate-p3-knowledge.test.mjs` when changing validation behavior. Generated counts describe recorded coverage, not percentage completion of the research.', '',
];
const outputs = [
  [resolve(directory, 'coverage.json'), `${JSON.stringify(coverage, null, 2)}\n`],
  [resolve('docs/p3-reload-knowledge-review.md'), lines.join('\n')],
];
for (const [path, content] of outputs) {
  if (process.argv.includes('--check')) {
    if (await readFile(path, 'utf8') !== content) throw new Error(`Stale generated report: ${path}`);
  } else await writeFile(path, content);
}
console.log(`Knowledge report ${process.argv.includes('--check') ? 'checked' : 'generated'}: ${facts.length} records, ${sources.length} sources. Release readiness remains false.`);
