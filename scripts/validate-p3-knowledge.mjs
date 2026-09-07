import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const categories = new Set(['social-link', 'social-stat', 'linked-episode', 'rescue', 'request', 'calendar', 'tartarus', 'planning']);
const kinds = new Set(['constraint', 'route-choice', 'recommendation']);
const statuses = new Set(['corroborated', 'single-source', 'disputed', 'editorial']);
const spoilers = new Set(['none', 'mechanic', 'character', 'story']);
const monthIds = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '01'];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

// Use a fixed non-leap calendar; never infer weekdays from the review year.
export function gameDateOrdinal(value) {
  if (typeof value !== 'string' || !/^\d{2}-\d{2}$/.test(value)) return null;
  const [month, day] = value.split('-').map(Number);
  if (!monthIds.includes(String(month).padStart(2, '0'))) return null;
  const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > lengths[month - 1]) return null;
  return lengths.slice(0, month - 1).reduce((sum, length) => sum + length, 0) + day + (month === 1 ? 365 : 0);
}

function reviewDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function validateKnowledge({ facts: document, sources: sourceDocument, months: monthDocument, disputes: disputeDocument }) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const list = (value, path) => { check(Array.isArray(value), `${path}: expected an array`); return Array.isArray(value) ? value : []; };
  const index = (items, path) => {
    const result = new Map();
    for (const [position, item] of items.entries()) {
      if (!object(item) || !nonempty(item.id)) { errors.push(`${path}[${position}]: missing string id`); continue; }
      check(!result.has(item.id), `${path}: duplicate id ${item.id}`);
      result.set(item.id, item);
    }
    return result;
  };
  for (const [name, doc] of [['facts', document], ['months', monthDocument], ['disputes', disputeDocument]]) {
    check(object(doc), `${name}: expected an object`);
    check(doc?.schemaVersion === 1, `${name}.schemaVersion: expected 1`);
    if (doc?.reviewedAt !== undefined) check(reviewDate(doc.reviewedAt), `${name}.reviewedAt: expected a valid YYYY-MM-DD date`);
  }
  check(document?.game === 'persona-3-reload', 'facts.game: expected persona-3-reload');
  check(reviewDate(document?.reviewedAt), 'facts.reviewedAt: expected a valid YYYY-MM-DD date');
  check(typeof document?.releaseReady === 'boolean', 'facts.releaseReady: expected a boolean');
  if (sourceDocument?.reviewedAt !== undefined) check(reviewDate(sourceDocument.reviewedAt), 'sources.reviewedAt: expected a valid YYYY-MM-DD date');
  const sources = index(list(Array.isArray(sourceDocument) ? sourceDocument : sourceDocument?.sources, 'sources'), 'sources');
  const facts = index(list(document?.facts, 'facts.facts'), 'facts');
  const months = index(list(monthDocument?.months, 'months.months'), 'months');
  const disputes = index(list(disputeDocument?.disputes, 'disputes.disputes'), 'disputes');

  const refs = (value, path, target) => {
    for (const id of list(value, path)) check(typeof id === 'string' && target.has(id), `${path}: unknown reference ${String(id)}`);
  };
  const validUrl = value => { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };
  const validateDates = (value, path) => {
    if (!object(value) && !Array.isArray(value)) return;
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === 'string' && /^\d{2}-\d{2}$/.test(child)) check(gameDateOrdinal(child) !== null, `${path}.${key}: invalid game date ${child}`);
      if (['start', 'end', 'date', 'deadline'].includes(key) && child !== null) check(gameDateOrdinal(child) !== null, `${path}.${key}: expected MM-DD or null`);
      validateDates(child, `${path}.${key}`);
    }
    if (gameDateOrdinal(value.start) !== null && gameDateOrdinal(value.end) !== null) check(gameDateOrdinal(value.start) <= gameDateOrdinal(value.end), `${path}: window starts after it ends`);
  };
  for (const [id, source] of sources) {
    check(validUrl(source.url), `source ${id}.url: expected an HTTP(S) URL`);
    if (source.reviewedAt !== undefined) check(reviewDate(source.reviewedAt), `source ${id}.reviewedAt: expected a valid YYYY-MM-DD date`);
  }
  for (const [id, fact] of facts) {
    const path = `fact ${id}`;
    check(categories.has(fact.category), `${path}: invalid category ${fact.category}`);
    check(kinds.has(fact.kind), `${path}: invalid kind ${fact.kind}`);
    check(statuses.has(fact.status), `${path}: invalid status ${fact.status}`);
    check(spoilers.has(fact.spoiler), `${path}: invalid spoiler ${fact.spoiler}`);
    check(nonempty(fact.subject), `${path}.subject: expected nonempty text`);
    check(object(fact.value), `${path}.value: expected an object`);
    validateDates(fact.value, `${path}.value`);
    if (fact.kind === 'route-choice') check(!/deadline/i.test(String(fact.value?.dateMeaning || '')), `${path}: a route choice cannot have a deadline dateMeaning`);
    const evidence = list(fact.evidence, `${path}.evidence`);
    if (fact.status !== 'editorial') check(evidence.length > 0, `${path}: factual claims need evidence`);
    for (const [position, entry] of evidence.entries()) {
      const evidencePath = `${path}.evidence[${position}]`;
      if (!object(entry)) { errors.push(`${evidencePath}: expected an object`); continue; }
      check(sources.has(entry.sourceId), `${evidencePath}: unknown source ${entry.sourceId}`);
      check(validUrl(entry.url), `${evidencePath}.url: expected an exact HTTP(S) URL`);
      const catalogUrl = sources.get(entry.sourceId)?.url;
      if (validUrl(entry.url) && validUrl(catalogUrl)) {
        const hostname = url => new URL(url).hostname.replace(/^www\./, '');
        check(hostname(entry.url) === hostname(catalogUrl), `${evidencePath}.url: host differs from catalog source ${entry.sourceId}; catalog this source separately`);
      }
      check(nonempty(entry.locator), `${evidencePath}.locator: expected nonempty text`);
      const supports = list(entry.supports, `${evidencePath}.supports`);
      check(supports.length > 0, `${evidencePath}.supports: cannot be empty`);
      for (const field of supports) {
        const parts = typeof field === 'string' ? field.split('.') : [];
        let current = fact;
        for (const part of parts) current = object(current) && Object.hasOwn(current, part) ? current[part] : undefined;
        check(parts.length > 0 && current !== undefined, `${evidencePath}.supports: unknown field ${String(field)}`);
      }
    }
    if (fact.dependsOn !== undefined) refs(fact.dependsOn, `${path}.dependsOn`, facts);
    if (fact.disputeIds !== undefined) refs(fact.disputeIds, `${path}.disputeIds`, disputes);
    const openDispute = (Array.isArray(fact.disputeIds) ? fact.disputeIds : []).some(ref => disputes.get(ref)?.status === 'open');
    if (fact.status === 'disputed' || openDispute) {
      check(document.releaseReady !== true, `${path}: disputed facts prevent a releaseReady dataset`);
      check(fact.releaseReady !== true && fact.definitive !== true && fact.value?.releaseReady !== true && fact.value?.definitive !== true, `${path}: disputed facts cannot be definitive or releaseReady`);
      check(!/deadline/i.test(String(fact.value?.dateMeaning || '')), `${path}: unresolved disputed dates cannot be definitive deadline warnings`);
    }
  }

  const visited = new Set();
  const active = new Set();
  function visit(id, trail = []) {
    if (active.has(id)) { errors.push(`facts.dependsOn: cycle ${[...trail, id].join(' -> ')}`); return; }
    if (visited.has(id) || !facts.has(id)) return;
    active.add(id);
    for (const dependency of Array.isArray(facts.get(id).dependsOn) ? facts.get(id).dependsOn : []) visit(dependency, [...trail, id]);
    active.delete(id); visited.add(id);
  }
  for (const id of facts.keys()) visit(id);
  for (const [id, month] of months) {
    check(monthIds.includes(id), `month ${id}: expected an April–January month ID`);
    check(nonempty(month.name), `month ${id}.name: expected text`);
    refs(month.factIds, `month ${id}.factIds`, facts);
    for (const key of ['priorities', 'gaps']) for (const entry of list(month[key], `month ${id}.${key}`)) check(nonempty(entry), `month ${id}.${key}: expected nonempty text`);
  }
  for (const [id, dispute] of disputes) {
    check(['open', 'resolved-for-planning'].includes(dispute.status), `dispute ${id}: invalid status ${dispute.status}`);
    check(nonempty(dispute.subject) && nonempty(dispute.decision), `dispute ${id}: subject and decision are required`);
    refs(dispute.affectedFactIds, `dispute ${id}.affectedFactIds`, facts);
    for (const claim of list(dispute.claims, `dispute ${id}.claims`)) {
      check(sources.has(claim?.sourceId), `dispute ${id}: unknown claim source ${claim?.sourceId}`);
      check(nonempty(claim?.claim), `dispute ${id}: claim text is required`);
    }
    if (dispute.status === 'open') for (const factId of Array.isArray(dispute.affectedFactIds) ? dispute.affectedFactIds : []) {
      const fact = facts.get(factId);
      if (fact) check(fact.status === 'disputed', `dispute ${id}: affected fact ${factId} must be marked disputed while open`);
    }
  }
  return errors;
}

export async function readKnowledge(directory) {
  const entries = await Promise.all(['facts', 'sources', 'months', 'disputes'].map(async name => [name, JSON.parse(await readFile(resolve(directory, `${name}.json`), 'utf8'))]));
  return Object.fromEntries(entries);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = resolve(process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), '../knowledge/p3-reload'));
  try {
    const errors = validateKnowledge(await readKnowledge(directory));
    if (errors.length) { console.error(errors.map(error => `- ${error}`).join('\n')); process.exitCode = 1; }
    else console.log('Persona 3 Reload knowledge validation passed. This checks data structure and safety, not factual accuracy or playthrough feasibility.');
  } catch (error) { console.error(`Knowledge validation failed: ${error.message}`); process.exitCode = 1; }
}
