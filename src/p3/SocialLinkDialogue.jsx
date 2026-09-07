import { useId, useState } from 'react';
import dialogue from '../../knowledge/p3-reload/social-link-dialogue.json';
import './social-link-dialogue.css';

function Sources({ sources = [] }) {
  return sources.length > 0 && <details className="dialogue-sources"><summary>Sources</summary>{sources.map((source, index) => <p key={`${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label || new URL(source.url).hostname}</a>{source.locator && <span> · {source.locator}</span>}</p>)}</details>;
}

function matchesRoute(value, filter) {
  if (filter === 'all' || !value || value === 'romance eligible') return true;
  if (filter === 'friendship') return ['friendship', 'fully platonic', 'friendship after confession'].includes(value);
  return value === 'romance';
}

export default function SocialLinkDialogue({ link, state, commit }) {
  const id = useId();
  const [browsedRank, setBrowsedRank] = useState(null);
  const [route, setRoute] = useState('all');
  const guide = dialogue.links.find(entry => entry.id === link.id);
  if (!guide) return null;
  const savedRank = state.ranks[link.id] || 0;
  const rank = browsedRank ?? Math.min(savedRank + 1, 10);
  const entry = guide.ranks.find(item => item.rank === rank);
  const steps = (entry?.steps || []).filter(step => matchesRoute(step.route, route));
  const canComplete = rank > savedRank;

  function completeRank() {
    commit({ ...state, ranks: { ...state.ranks, [link.id]: rank } }, 'link_rank');
    setBrowsedRank(null);
  }

  return <details className="social-link-dialogue">
    <summary>Rank dialogue guide · spoilers</summary>
    <p>Open the rank you are playing. Browsing this guide does not change your saved progress.</p>
    {guide.romance && <label className="dialogue-relationship" htmlFor={`${id}-relationship`}>My relationship in the game<select id={`${id}-relationship`} value={state.relationshipRoutes?.[link.id] || 'undecided'} disabled={!commit} onChange={event => commit({ ...state, relationshipRoutes: { ...state.relationshipRoutes, [link.id]: event.target.value } }, 'relationship_route')}><option value="undecided">Undecided</option><option value="friendship">Friendship</option><option value="romance">Romance</option></select><span>Saved with your progress. This does not change which answers you browse below.</span></label>}
    <div className="dialogue-filters">
      <label htmlFor={`${id}-rank`}>View rank<select id={`${id}-rank`} value={rank} onChange={event => setBrowsedRank(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>Rank {index + 1}{index + 1 === savedRank + 1 ? ' · next' : ''}</option>)}</select></label>
      {guide.romance && <label htmlFor={`${id}-route`}>Route guidance<select id={`${id}-route`} value={route} onChange={event => setRoute(event.target.value)}><option value="all">Both routes</option><option value="friendship">Friendship</option><option value="romance">Romance</option></select></label>}
    </div>
    {browsedRank !== null && <button className="dialogue-next" onClick={() => setBrowsedRank(null)}>Return to {savedRank === 10 ? 'rank 10' : `next rank (${savedRank + 1})`}</button>}
    <p className="dialogue-point-key">Base affinity points are hidden game values. Displayed musical notes are a different scale; notes below assume a matching Arcana Persona. A response can build affinity without earning a rank.</p>
    <details><summary>Affinity and link rules</summary><p>{dialogue.pointRules.summary}</p><p>{dialogue.pointRules.matchingArcana}</p><p>{dialogue.relationshipRules.note}</p><Sources sources={[...(dialogue.pointRules.sources || []), ...(dialogue.relationshipRules.sources || [])]} /></details>
    {guide.romance && <details className="dialogue-route-notes"><summary>Friendship and romance requirements</summary><p>Choosing a route here only filters this guide. Earlier choices in your game can affect which options appear.</p>{(Array.isArray(guide.romance.notes) ? guide.romance.notes : [guide.romance.notes]).filter(Boolean).map((note, index) => <p key={index}>{note}</p>)}{guide.romance.flags?.length > 0 && <ul>{guide.romance.flags.map((flag, index) => <li key={index}>Rank {flag.rank}: {flag.choiceCue}</li>)}</ul>}</details>}
    {entry ? <div className="dialogue-rank" key={rank}>
      <h4>Rank {rank}</h4>
      {entry.note && <p>{entry.note}</p>}
      {steps.length > 0 && <p>Listed decisions only; neutral prompts are omitted. Use the response cue to match your conversation.</p>}
      {steps.length > 0 && <ol className="dialogue-steps">{steps.map((step, index) => <li key={`${step.order}-${index}`}>
        <strong>{step.cue || `Conversation ${step.order || index + 1}`}</strong>
        {step.route && <span className="dialogue-route-label">{step.route === 'romance' ? 'Romance route' : step.route === 'friendship' ? 'Friendship route' : step.route}</span>}
        {step.note && <p>{step.note}</p>}
        <ul className="dialogue-choices">{(step.choices || []).filter(choice => matchesRoute(choice.route, route)).map((choice, choiceIndex) => <li key={choiceIndex}>
          <span>{choice.index != null && <b>Option {choice.index}: </b>}{choice.cue}</span>
          {choice.route && <span className="dialogue-route-label">{choice.route === 'romance' ? 'Romance' : choice.route === 'friendship' ? 'Friendship' : choice.route}</span>}
          {(choice.basePoints != null || choice.displayNotesWithMatching != null) && <span className="dialogue-points">{choice.basePoints != null && <span>{choice.basePoints > 0 ? '+' : ''}{choice.basePoints} base affinity points</span>}{choice.displayNotesWithMatching != null && <span>{choice.displayNotesWithMatching} displayed {choice.displayNotesWithMatching === 1 ? 'note' : 'notes'} · matching Arcana</span>}</span>}
          {choice.effect && <p>{choice.effect}</p>}
        </li>)}</ul>
      </li>)}</ol>}
      {steps.length === 0 && !entry.note && <p>No response choices are recorded for this rank.</p>}
      <Sources sources={entry.sources} />
      <div className="dialogue-completion"><p>Saved rank: {savedRank}. {canComplete ? 'Update this only after the rank increases in your game.' : 'This rank is already recorded.'}</p><button disabled={!canComplete || !commit} onClick={completeRank}>Record rank {rank} completed</button></div>
    </div> : <p>This rank has no dialogue entry yet. Check the linked source guide.</p>}
    {guide.warnings?.length > 0 && <details><summary>Other conditions</summary>{guide.warnings.map((warning, index) => <p key={index}>{warning}</p>)}</details>}
    {guide.recovery && <details><summary>Link recovery</summary><p>{guide.recovery.note}</p><Sources sources={guide.recovery.sources} /></details>}
    <Sources sources={guide.sources} />
  </details>;
}
