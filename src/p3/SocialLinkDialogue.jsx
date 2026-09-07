import { useId, useState } from 'react';
import dialogue from '../../knowledge/p3-reload/social-link-dialogue.json';
import './social-link-dialogue.css';

function Sources({ sources = [] }) {
  return sources.length > 0 && <div className="dialogue-sources">{sources.map((source, index) => <p key={`${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label || new URL(source.url).hostname}</a>{source.locator && <span> · {source.locator}</span>}</p>)}</div>;
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
  const [view, setView] = useState('answers');
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

  const sources = [...(entry?.sources || []), ...(guide.sources || []), ...(dialogue.pointRules.sources || []), ...(dialogue.relationshipRules.sources || []), ...(guide.recovery?.sources || [])];
  const uniqueSources = sources.filter((source, index) => sources.findIndex(item => item.url === source.url && item.locator === source.locator) === index);
  return <section className="social-link-dialogue" aria-label={`${link.arcana} rank guide`}>
    <nav className="dialogue-tabs" aria-label={`${link.arcana} guide sections`}>{[['answers', 'Answers'], ['relationship', 'Relationship & affinity'], ['sources', 'Sources']].map(([key, label]) => <button key={key} aria-pressed={view === key} onClick={() => setView(key)}>{label}</button>)}</nav>
    {view === 'answers' && <>
      <h3>Rank {rank} answers{rank === savedRank + 1 ? ' · next meeting' : ''}</h3>
    <div className="dialogue-filters">
      <label htmlFor={`${id}-rank`}>View rank<select aria-label="View rank" id={`${id}-rank`} value={rank} onChange={event => setBrowsedRank(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>Rank {index + 1}{index + 1 === savedRank + 1 ? ' · next' : ''}</option>)}</select></label>
      {guide.romance && <label htmlFor={`${id}-route`}>Route guidance<select aria-label="Route guidance" id={`${id}-route`} value={route} onChange={event => setRoute(event.target.value)}><option value="all">Both routes</option><option value="friendship">Friendship</option><option value="romance">Romance</option></select></label>}
    </div>
    {browsedRank !== null && <button className="dialogue-next" onClick={() => setBrowsedRank(null)}>Return to {savedRank === 10 ? 'rank 10' : `next rank (${savedRank + 1})`}</button>}
    {entry ? <div className="dialogue-rank" key={rank}>
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
      <div className="dialogue-completion"><p>Saved rank: {savedRank}. {canComplete ? 'Update this only after the rank increases in your game.' : 'This rank is already recorded.'}</p><button disabled={!canComplete || !commit} onClick={completeRank}>Record rank {rank} completed</button></div>
    </div> : <p>This rank has no dialogue entry yet. Check the linked source guide.</p>}
    </>}
    {view === 'relationship' && <div className="dialogue-background"><h3>Relationship & affinity</h3>
    {guide.romance && <label className="dialogue-relationship" htmlFor={`${id}-relationship`}>My relationship in the game<select aria-label="My relationship in the game" id={`${id}-relationship`} value={state.relationshipRoutes?.[link.id] || 'undecided'} disabled={!commit} onChange={event => commit({ ...state, relationshipRoutes: { ...state.relationshipRoutes, [link.id]: event.target.value } }, 'relationship_route')}><option value="undecided">Undecided</option><option value="friendship">Friendship</option><option value="romance">Romance</option></select><span>Saved with your progress. The Answers tab keeps its own route filter.</span></label>}
      {guide.romance && <section><h4>Friendship and romance requirements</h4><p>The route filter changes the guide you browse. Earlier choices in your game determine which options appear.</p>{(Array.isArray(guide.romance.notes) ? guide.romance.notes : [guide.romance.notes]).filter(Boolean).map((note, index) => <p key={index}>{note}</p>)}{guide.romance.flags?.length > 0 && <ul>{guide.romance.flags.map((flag, index) => <li key={index}>Rank {flag.rank}: {flag.choiceCue}</li>)}</ul>}</section>}
      <h4>Affinity points</h4><p>Base affinity points and displayed musical notes use different scales. Listed notes assume a matching Arcana Persona. A response can build affinity without earning a rank.</p><p>{dialogue.pointRules.summary}</p><p>{dialogue.pointRules.matchingArcana}</p><p>{dialogue.relationshipRules.note}</p>
      {guide.warnings?.length > 0 && <section><h4>Other conditions</h4>{guide.warnings.map((warning, index) => <p key={index}>{warning}</p>)}</section>}
      {guide.recovery && <section><h4>Link recovery</h4><p>{guide.recovery.note}</p></section>}
    </div>}
    {view === 'sources' && <section><h3>Sources for rank {rank} and link rules</h3><Sources sources={uniqueSources} /></section>}
  </section>;
}
