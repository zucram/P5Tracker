import { useState } from 'react';
import { buildPlan, dateLabel, dateNumber, eventTitle, FACT_BY_ID } from './planner';

export function EventCard({ event, state, onToggle }) {
  const { fact, status, label, remaining, missing = [] } = event;
  const done = status === 'completed';
  const deadline = fact.value.dateMeaning === 'request-deadline' || fact.value.dateMeaning === 'rescue-deadline';
  return <article className={`event-card event-${status}`}>
    <div className="event-heading"><span className="event-category">{fact.category.replaceAll('-', ' ')}</span><span className="event-status">{label}</span></div>
    <h3>{eventTitle(fact, state.showEventNames)}</h3>
    <p className="event-dates">{status === 'uncertain' && 'Reported timing: '}{dateLabel(fact.value.start)}{fact.value.start !== fact.value.end && ` – ${dateLabel(fact.value.end)}`}
      {remaining !== null && remaining >= 0 && remaining <= 7 && !['upcoming', 'completed', 'uncertain'].includes(status) && <strong>{remaining === 0 ? ' · ends today' : ` · ${remaining} days to window end`}</strong>}</p>
    {deadline && <p>Complete by {dateLabel(fact.value.end)}. {fact.category === 'rescue' ? 'Plan a Tartarus visit before the deadline; you can group currently missing people into one trip.' : 'Accept the request and obtain the item before reporting back to Elizabeth.'}</p>}
    {fact.category === 'linked-episode' && <p>{fact.value.dateMeaning === 'invitation' ? 'Accept the invitation for the later event. The invitation and the meeting are separate steps.' : 'This is an outer window, not an appointment on every day. Check messages and meet early when offered.'}{fact.value.timeSlot && !['varies'].includes(fact.value.timeSlot) ? ` Time: ${fact.value.timeSlot}.` : ''}</p>}
    {fact.kind === 'route-choice' && <p>A useful route choice, not a required completion deadline. Other opportunities may exist.</p>}
    {status === 'past' && <p>This window passed without a completion recorded. If you already did it in-game, update the checkmark here.</p>}
    {missing.length > 0 && <div className="prerequisite-note"><p>Earlier steps to confirm, only if already completed in-game:</p>{missing.map(id => <label className="prerequisite-check" key={id}><input type="checkbox" checked={state.completedEvents.includes(id)} onChange={() => onToggle(id)} /> {FACT_BY_ID[id] ? eventTitle(FACT_BY_ID[id], state.showEventNames) : 'See source'}</label>)}</div>}
    {status === 'uncertain' && <p>Sources disagree on timing or a prerequisite. Use the source below before spending a time slot.</p>}
    <div className="event-actions"><label><input type="checkbox" checked={done} onChange={() => onToggle(fact.id)} /> Done in my game</label><a href={fact.evidence[0]?.url} target="_blank" rel="noopener noreferrer">Check source</a></div>
  </article>;
}

export function Planner({ state, commit, selectTab }) {
  const plan = buildPlan(state);
  const toggle = id => commit({ ...state, completedEvents: state.completedEvents.includes(id) ? state.completedEvents.filter(x => x !== id) : [...state.completedEvents, id] }, 'event_checked');
  const near = plan.urgent.slice(0, 6);
  const episode = plan.active.find(e => e.status === 'open' && e.fact.category === 'linked-episode' && (e.fact.value.timeSlot === state.slot || e.fact.value.timeSlot === 'varies'));
  const rescue = plan.active.filter(e => e.status === 'open' && e.fact.category === 'rescue');
  const target = plan.statTargets[0];
  return <section aria-labelledby="planner-title" className="planner">
    <div className="section-heading"><div><p className="eyebrow">YOUR NEXT TIME SLOT</p><h2 id="planner-title">{dateLabel(state.date)} · {state.slot === 'daytime' ? 'Daytime' : 'Evening'}</h2><p>Choose what to do next. Checking something off never advances your date automatically.</p></div><label className="name-toggle"><input type="checkbox" checked={state.showEventNames} onChange={e => commit({ ...state, showEventNames: e.target.checked })} /> Reveal event names</label></div>
    {plan.blocks.length > 0 && <div className="calendar-notice"><h3>Your usual schedule changes here</h3>{plan.blocks.map(block => <p key={block.id}>{block.reason} <a href={block.evidence?.[0]?.url}>Source</a></p>)}<p>Follow the story or scheduled activity. Keep the reminders below for your next free slot.</p></div>}
    {plan.conditional.map(block => <div className="calendar-notice" key={block.id}><p>{block.reason} This depends on earlier choices; confirm the event in your game.</p></div>)}
    {near.length > 0 && <section className="planner-section"><div className="section-heading"><div><h3>Before the window closes</h3><p>Unfinished opportunities ending within seven days. Some need earlier steps or a different time slot.</p></div><button onClick={() => selectTab('deadlines')}>All deadlines</button></div><div className="event-grid">{near.map(event => <EventCard key={event.fact.id} event={event} state={state} onToggle={toggle} />)}</div>{plan.urgent.length > near.length && <button onClick={() => selectTab('deadlines')}>View {plan.urgent.length - near.length} more reminders</button>}</section>}
    {!plan.blocks.length && <section className="planner-section"><h3>Options to check {state.slot === 'daytime' ? 'today' : 'tonight'}</h3><p className="small-note">Based on usual weekdays, reviewed closures and your recorded introductions. Story interruptions, invitations and rank-up readiness still need checking in-game.</p>
      <div className="choice-grid">
        {episode && <article className="choice-card"><span className="event-category">Time-sensitive option</span><h4>{eventTitle(episode.fact, state.showEventNames)}</h4><p>Look for this episode’s invitation before using the slot elsewhere. Its window ends {dateLabel(episode.fact.value.end)}.</p><button onClick={() => selectTab('deadlines')}>Review episode steps</button></article>}
        {state.slot === 'evening' && rescue.length > 0 && <article className="choice-card"><span className="event-category">Tartarus</span><h4>{rescue.length} missing {rescue.length === 1 ? 'person' : 'people'} to rescue</h4><p>The earliest recorded deadline is {dateLabel(rescue[0].fact.value.end)}. Rescue those currently listed before waiting for later arrivals.</p><button onClick={() => selectTab('deadlines')}>Review rescue floors</button></article>}
        {plan.candidates.slice(0, 3).map(({ link, reason }) => <article className="choice-card" key={link.id}><span className="event-category">Social Link · rank {state.ranks[link.id]}</span><h4>{link.arcana}{state.showNames && ` · ${link.name}`}</h4><p>{reason} {link.kind === 'school' && 'School days are limited, so consider this before flexible stat activities.'}</p><button onClick={() => selectTab('links')}>Update link progress</button></article>)}
        <article className="choice-card"><span className="event-category">Flexible alternative</span><h4>{target ? `Build ${target.statGate.stat}` : 'Leave room for recovery'}</h4><p>{target ? `${target.arcana} needs ${target.statGate.stat} rank ${target.statGate.rank} to start; you have rank ${state.stats[target.statGate.stat]}. Choose an available study, work or leisure activity that improves it.` : 'Use a free slot for affinity, resources or another unfinished goal. The planner does not force a perfect-run route.'}</p><p className="small-note">Suggested priority, not a required activity.</p></article>
      </div>
      {plan.candidates.length === 0 && <p className="small-note">No confirmed Social Link matches this slot. Record existing ranks or introductions under Social Links; no introductions are assumed automatically.</p>}
      {plan.preparation.length > 0 && <details className="planner-details"><summary>Links you could prepare to start</summary><ul>{plan.preparation.map(x => <li key={x.link.id}><strong>{x.link.arcana}:</strong> {x.reason}</li>)}</ul></details>}
    </section>}
    <section className="planner-section"><h3>Your {plan.month?.name} priorities</h3><p className="small-note">Flexible guidance for the month, separate from hard deadlines.</p><ul className="monthly-priorities">{plan.month?.priorities.map(text => <li key={text}>{text}</li>)}</ul><button onClick={() => selectTab('month')}>Add your own monthly goals</button></section>
    <section className="planner-section"><div className="section-heading"><div><h3>Coming up</h3><p>Windows opening in the next two weeks. Earlier steps may still be required.</p></div><button onClick={() => selectTab('deadlines')}>Browse every window</button></div>{plan.next.length ? <ul className="upcoming-list">{plan.next.slice(0, 6).map(e => <li key={e.fact.id}><span>{dateLabel(e.fact.value.start)}</span>{eventTitle(e.fact, state.showEventNames)}</li>)}</ul> : <p className="small-note">No new recorded window starts in the next two weeks. Check unfinished opportunities in the deadline list.</p>}</section>
  </section>;
}

export function Deadlines({ state, commit }) {
  const [filter, setFilter] = useState('active');
  const [category, setCategory] = useState('all');
  const plan = buildPlan(state);
  const items = plan.events.filter(e => (category === 'all' || e.fact.category === category) && (filter === 'all' || (filter === 'active' ? (['open', 'prerequisite', 'blocked'].includes(e.status) || (e.status === 'uncertain' && dateNumber(e.fact.value.start) <= dateNumber(state.date))) : e.status === filter))).sort((a, b) => dateNumber(a.fact.value.end) - dateNumber(b.fact.value.end));
  const toggle = id => commit({ ...state, completedEvents: state.completedEvents.includes(id) ? state.completedEvents.filter(x => x !== id) : [...state.completedEvents, id] }, 'event_checked');
  return <section aria-labelledby="deadlines-title"><div className="section-heading"><div><h2 id="deadlines-title">Missable dates and episode windows</h2><p>Update the date above and check off what you actually completed. Missing checkmarks are not proof that you missed something in-game.</p></div><label className="name-toggle"><input type="checkbox" checked={state.showEventNames} onChange={e => commit({ ...state, showEventNames: e.target.checked })} /> Reveal event names</label></div><div className="filters"><select aria-label="Event status" value={filter} onChange={e => setFilter(e.target.value)}>{[['active', 'Current windows'], ['upcoming', 'Upcoming'], ['past', 'Past windows'], ['completed', 'Completed'], ['all', 'All dates, includes future events']].map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select><select aria-label="Event category" value={category} onChange={e => setCategory(e.target.value)}>{[['all', 'All types'], ['rescue', 'Missing people'], ['request', 'Elizabeth requests'], ['linked-episode', 'Linked Episodes']].map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select><span role="status">{items.length} {items.length === 1 ? 'entry' : 'entries'}</span></div><div className="event-grid">{items.map(event => <EventCard key={event.fact.id} event={event} state={state} onToggle={toggle} />)}</div>{!items.length && <p className="empty">No entries match these filters. Change the status or date to look ahead or record past completions.</p>}</section>;
}
