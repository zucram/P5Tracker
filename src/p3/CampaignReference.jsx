import { useId, useState } from 'react';
import './campaign-reference.css';

export default function CampaignReference({ sections = [], completedIds = [], onToggle, showSpoilers = false, initialSection = 'all' }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [sectionId, setSectionId] = useState(initialSection);
  const completed = new Set(completedIds);
  const needle = query.trim().toLocaleLowerCase();
  const visibleSections = sections.filter(section => sectionId === 'all' || section.id === sectionId).map(section => ({
    ...section,
    entries: section.entries.filter(entry => {
      const text = entry.spoiler && !showSpoilers ? [section.title, entry.date, entry.deadline] : [section.title, entry.title, entry.summary, ...(entry.steps || []), ...(entry.requirements || []), ...(entry.rewards || []), entry.date, entry.deadline];
      return text.filter(Boolean).join(' ').toLocaleLowerCase().includes(needle);
    }),
  }));
  const total = visibleSections.reduce((count, section) => count + section.entries.length, 0);

  return <div className="campaign-reference">
    <div className="campaign-reference-filters">
      <label htmlFor={`${id}-search`}>Search reference<input id={`${id}-search`} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, requirement or reward" /></label>
      <label htmlFor={`${id}-section`}>Section<select id={`${id}-section`} value={sectionId} onChange={event => setSectionId(event.target.value)}><option value="all">All sections</option>{sections.map(section => <option key={section.id} value={section.id}>{section.title}</option>)}</select></label>
    </div>
    <p className="campaign-result-count" role="status">{total} {total === 1 ? 'entry' : 'entries'}{!showSpoilers && ' · Hidden story details are excluded from search.'}</p>
    {visibleSections.filter(section => section.entries.length).map(section => <section key={section.id} aria-labelledby={`${id}-${section.id}`}>
      <h3 id={`${id}-${section.id}`}>{section.title}</h3>
      {section.description && <p>{section.description}</p>}
      {section.entries.map(entry => {
        const hidden = entry.spoiler && !showSpoilers;
        return <article className={`campaign-entry${completed.has(entry.id) ? ' campaign-entry-complete' : ''}`} key={entry.id}>
          {onToggle && entry.checkable !== false && <label className="campaign-entry-check"><input type="checkbox" checked={completed.has(entry.id)} onChange={() => onToggle(entry.id)} /><span>{completed.has(entry.id) ? 'Completed' : 'Mark complete'}<span className="campaign-visually-hidden">: {hidden ? 'Hidden story entry' : entry.title}</span></span></label>}
          <details key={`${entry.id}-${showSpoilers}`}>
            <summary>{hidden ? 'Story entry · open to reveal' : entry.title}{(entry.date || entry.deadline) && <span className="campaign-entry-dates">{entry.date && `Available: ${entry.date}`}{entry.date && entry.deadline && ' · '}{entry.deadline && `Deadline: ${entry.deadline}`}</span>}</summary>
            {hidden && <h4>{entry.title}</h4>}
            {entry.summary && <p>{entry.summary}</p>}
            {entry.requirements?.length > 0 && <><h4>Requirements</h4><ul>{entry.requirements.map((text, index) => <li key={index}>{text}</li>)}</ul></>}
            {entry.steps?.length > 0 && <><h4>What to do</h4><ol>{entry.steps.map((text, index) => <li key={index}>{text}</li>)}</ol></>}
            {entry.rewards?.length > 0 && <><h4>Rewards</h4><ul>{entry.rewards.map((text, index) => <li key={index}>{text}</li>)}</ul></>}
            {entry.sources?.length > 0 && <div className="campaign-entry-sources"><h4>Sources</h4>{entry.sources.map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noopener noreferrer">{source.label || source.url}</a>)}</div>}
          </details>
        </article>;
      })}
    </section>)}
    {total === 0 && <p>No matching entries. Try a shorter search or another section.</p>}
  </div>;
}
