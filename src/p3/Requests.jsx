import { useId, useState } from 'react';
import requests from '../../knowledge/p3-reload/requests.json' with { type: 'json' };
import tartarus from '../../knowledge/p3-reload/tartarus.json' with { type: 'json' };
import { dateLabel, dateNumber } from './planner.js';
import './requests.css';

export default function Requests({ state, commit, selectTab }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const completed = new Set(state.completedEvents || []);
  const now = dateNumber(state.date);
  const floorCap = Math.max(0, ...tartarus.blocks.filter(block => dateNumber(block.start) <= now).map(block => block.toFloor));
  const reported = requests.entries.filter(entry => completed.has(entry.id)).length;
  const needle = query.trim().toLocaleLowerCase().replace(/^#/, '');

  function statusFor(entry) {
    const missing = (entry.prerequisites || []).filter(number => !completed.has(`request-${number}`));
    if (completed.has(entry.id)) return { label: 'Reported', kind: 'completed', missing };
    if (entry.deadline && dateNumber(entry.deadline) < now) return { label: 'Reporting deadline passed', kind: 'past', missing };
    if (dateNumber(entry.start || entry.date) > now) return { label: 'Opens later', kind: 'upcoming', missing };
    if (entry.floor > floorCap) return { label: 'Floor opens later', kind: 'upcoming', missing };
    if (missing.length) return { label: 'Prerequisites not marked', kind: 'prerequisites', missing };
    return { label: 'Available to check', kind: 'available', missing };
  }

  const entries = requests.entries.filter(entry => {
    const status = statusFor(entry);
    const searchable = entry.spoiler ? [entry.number] : [entry.number, entry.title, entry.persona, entry.skill, ...(entry.requirements || []), ...(entry.steps || []), ...(entry.rewards || [])];
    const matches = /^\d+$/.test(needle) ? entry.number === Number(needle) : searchable.join(' ').toLocaleLowerCase().includes(needle);
    return matches
      && (filter === 'all' || filter === 'available' && status.kind === 'available' || filter === 'missable' && Boolean(entry.deadline || entry.opportunity) || filter === 'incomplete' && !completed.has(entry.id) || filter === 'completed' && completed.has(entry.id));
  });

  function toggleReported(entry) {
    commit({ ...state, completedEvents: completed.has(entry.id) ? state.completedEvents.filter(value => value !== entry.id) : [...(state.completedEvents || []), entry.id] }, 'request_reported');
  }

  return <section className="reload-requests" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Elizabeth's requests</h2>
    <p className="requests-progress">{reported} / {requests.entries.length} reported</p>
    <p>Mark a request only after reporting it to Elizabeth. Collecting an item or fulfilling a condition does not complete the report.</p>
    <p className="requests-date">Your date: {dateLabel(state.date)} · Tartarus currently opens through floor {floorCap || '—'}.</p>
    {selectTab && <button className="request-persona-help" onClick={() => selectTab('deadlines')}>Change in-game date</button>}
    <p className="requests-help">Available means the start date and floor gates are reached and prerequisite requests are marked. Check the other requirements in-game. An unchecked prerequisite may already be complete in your game.</p>
    <div className="requests-filters"><label htmlFor={`${id}-search`}>Search requests<input type="search" id={`${id}-search`} value={query} onChange={event => setQuery(event.target.value)} placeholder="Number, item, Persona or skill" /></label><label htmlFor={`${id}-filter`}>Show<select id={`${id}-filter`} value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All requests</option><option value="available">Available to check</option><option value="missable">Missable dates</option><option value="incomplete">Not reported</option><option value="completed">Reported</option></select></label></div>
    <p role="status" className="requests-count">{entries.length} {entries.length === 1 ? 'request' : 'requests'} shown. Hidden spoiler text is excluded from search.</p>
    <div className="request-list">{entries.map(entry => {
      const status = statusFor(entry);
      const opening = entry.floor ? tartarus.blocks.find(block => block.toFloor >= entry.floor) : null;
      return <article key={entry.id} className={`request-entry request-${status.kind}`}>
        <details>
          <summary><span className="request-title">#{entry.number} · {entry.spoiler ? 'Spoiler request · open to reveal' : entry.title}</span><span className="request-status">{status.label}</span>{entry.deadline && <span className="request-date">Report by {dateLabel(entry.deadline)}</span>}{entry.opportunity && <span className="request-date">Item opportunity: {dateLabel(entry.opportunity)}</span>}</summary>
          {entry.spoiler && <h3>{entry.title}</h3>}
          <p>Earliest start: {dateLabel(entry.start || entry.date)}{!entry.deadline && ' · No fixed reporting deadline listed.'}</p>
          {entry.opportunity && <p className="request-opportunity">Item opportunity: {dateLabel(entry.opportunity)}. This is an acquisition date, not a reporting deadline.{dateNumber(entry.opportunity) < now && ' That date has passed; check whether you already obtained the item.'}</p>}
          {entry.floor && <p>Required floor: {entry.floor}.{opening && ` This section opens ${dateLabel(opening.start)}.`}</p>}
          {entry.prerequisites?.length > 0 && <p>Prerequisite reports: {entry.prerequisites.map(number => `#${number}${completed.has(`request-${number}`) ? ' ✓' : ' (not marked)'}`).join(', ')}.</p>}
          {entry.requirements?.length > 0 && <><h4>Requirements</h4><ul>{entry.requirements.map((text, index) => <li key={index}>{text}</li>)}</ul></>}
          {entry.persona && <p className="requests-help">Example recipes assume no DLC Personas. If you have DLC enabled, use the fusion reference with your saved DLC settings.</p>}<h4>What to do</h4><ol>{entry.steps.map((text, index) => <li key={index}>{text}</li>)}</ol>
          {entry.persona && selectTab && <button className="request-persona-help" onClick={() => selectTab('personas')}>Persona and fusion help · {entry.persona}</button>}
          {entry.equipment && selectTab && <button className="request-persona-help" onClick={() => selectTab('equipment')}>Crafting and material sources · {entry.equipment}</button>}
          {entry.rewards?.length > 0 && <><h4>Rewards</h4><ul>{entry.rewards.map((text, index) => <li key={index}>{text}</li>)}</ul></>}
          <div className="request-sources"><p className="source-label">Sources</p>{entry.sources.map((source, index) => <p key={`${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label || source.url}</a></p>)}{opening && <p>Tartarus opening: {opening.sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{index > 0 && ' · '}Floor reference {index + 1}</a>)}</p>}</div>
          <label className="request-reported"><input type="checkbox" checked={completed.has(entry.id)} onChange={() => toggleReported(entry)} disabled={!commit} />I reported request #{entry.number} to Elizabeth</label>
        </details>
      </article>;
    })}</div>
    {entries.length === 0 && <p>No requests match. Change the filter or try a shorter search.</p>}
  </section>;
}
