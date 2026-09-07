import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MONTHS, SOCIAL_LINKS } from './data';
import { getMonthGuide } from './monthGuide';
import { dateLabel, dateNumber } from './planner';
import tartarus from '../../knowledge/p3-reload/tartarus.json' with { type: 'json' };
import school from '../../knowledge/p3-reload/school-answers.json' with { type: 'json' };

function TaskRow({ task, state, toggle }) {
  const done = task.factId ? state.completedEvents.includes(task.factId) : (state.checkedTasks || []).includes(task.id);
  const hideName = !state.showEventNames && task.category === 'linked-episode';
  const title = hideName ? 'Linked Episode · check invitation' : !state.showEventNames && task.category === 'rescue' ? task.title.replace(/^Rescue .* on floor/, 'Rescue missing person on floor') : task.title;
  return <article className={`task-row ${done ? 'is-done' : ''}`}>
    <input id={`task-${task.id}`} type="checkbox" checked={done} onChange={() => toggle(task)} aria-label={`Complete: ${title}`} />
    <div className="task-body"><label htmlFor={`task-${task.id}`}><span className="task-date">{task.date && dateLabel(task.date)}{task.end && task.end !== task.date && ` to ${dateLabel(task.end)}`}</span>{title}</label>
      {['request', 'rescue'].includes(task.category) && <p>{task.detail}</p>}
      {task.uncertain && <span className="task-meta">Timing or requirement needs checking</span>}
      {task.detail && <details><summary>{hideName ? 'Reveal character and steps' : 'Details & source'}</summary>{hideName && <p><strong>{task.title}</strong></p>}<p>{task.detail}</p>{task.sourceUrl && <a href={task.sourceUrl} target="_blank" rel="noopener noreferrer">Source guide{task.evidenceStatus === 'single-source' ? ' · one source' : ''}</a>}</details>}
    </div>
  </article>;
}

export function MonthCalendar({ state, commit, month, setMonth, selectTab }) {
  const [goal, setGoal] = useState('');
  const [goalError, setGoalError] = useState('');
  const index = MONTHS.findIndex(item => item.id === month);
  const name = MONTHS[index].name;
  const guide = getMonthGuide(month);
  const schoolTasks = school.entries.filter(entry => entry.month === (index === 9 ? 1 : index + 4)).map(entry => ({
    id: entry.id, category: 'school', date: entry.date,
    title: entry.answers.length ? `${entry.kind === 'exam' ? 'Exam' : 'Class'} answer: ${entry.answers.join(' → ')}` : entry.topic,
    detail: entry.answers.length ? entry.answers.join(' → ') : entry.requiredAcademics ? `Academics rank ${entry.requiredAcademics} and correct answers for top marks. ${entry.note || ''}` : entry.note || 'Automatic exam day. No answer to choose.',
    sourceUrl: entry.sources[0].url,
  }));
  const floorTasks = tartarus.blocks.filter(block => Number(block.start.slice(0,2)) === (index === 9 ? 1 : index + 4)).map(block => ({ id: `tartarus-${block.id}`, category: 'tartarus', date: block.start, title: `Explore ${block.name} through floor ${block.toFloor}`, detail: `Floors ${block.fromFloor}–${block.toFloor} become accessible. Clear this section when it fits your schedule; this is an opening date, not a completion deadline. ${block.notes || ''}`, sourceUrl: block.sources[0].url }));
  const criticalIds = new Set(guide.critical.map(task => task.id));
  // Calendar restrictions explain the month; they are not chores to tick off.
  const calendar = guide.timeline.filter(task => task.category === 'calendar');
  const timeline = [...floorTasks, ...guide.targets.filter(task => task.date).map(task => ({ ...task, title: `Start ${SOCIAL_LINKS.find(link => link.id === task.opensLinkId).arcana}`, category: 'social-link' })), ...guide.timeline.filter(task => !criticalIds.has(task.id) && task.category !== 'calendar'), ...schoolTasks].sort((a,b) => dateNumber(a.date) - dateNumber(b.date));
  const goals = state.goals.filter(item => item.month === month);
  function toggle(task) {
    const key = task.factId ? 'completedEvents' : 'checkedTasks';
    const id = task.factId || task.id;
    const current = state[key] || [];
    commit({ ...state, [key]: current.includes(id) ? current.filter(x => x !== id) : [...current, id] }, 'event_checked');
  }
  function addGoal(event) {
    event.preventDefault();
    const text = goal.trim();
    if (!text) return;
    if (state.goals.length >= 100) { setGoalError('Remove a finished personal goal before adding another. The limit is 100.'); return; }
    commit({ ...state, goals: [...state.goals, { id: `goal-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, text, month, done: false }] }, 'goal_added');
    setGoal(''); setGoalError('');
  }
  return <section aria-label={`${name} calendar`}>
    <div className="month-switcher"><div className="month-navigation"><button disabled={index === 0} aria-label="Previous month" onClick={() => setMonth(MONTHS[index - 1].id)}><ArrowLeft size={22} /></button><div><h2>{name}</h2>{state.month === month ? <span className="active-month">Current month</span> : <button className="set-active" onClick={() => commit({ ...state, month, date: `${String(index === 9 ? 1 : index + 4).padStart(2,'0')}-01` })}>Set as active month</button>}</div><button disabled={index === 9} aria-label="Next month" onClick={() => setMonth(MONTHS[index + 1].id)}><ArrowRight size={22} /></button></div>
      <div className="month-tools"><select aria-label="Browse month" value={month} onChange={event => setMonth(event.target.value)}>{MONTHS.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button onClick={() => selectTab('planner')}>Plan a specific day</button></div>
    </div>
    <div className="calendar-sheet"><h2>{name} checklist</h2><p className="calendar-intro">Choose your own daily route. Check off what you finish in-game. Browsing months keeps your active month unchanged.</p>
      <label className="name-toggle"><input type="checkbox" checked={state.showEventNames} onChange={event => commit({ ...state, showEventNames: event.target.checked })} /> Show character names in events</label>
      {!!guide.critical.length && <section className="task-section critical"><h3>Don't miss</h3><div className="task-list">{guide.critical.map(task => <TaskRow key={task.id} task={task} state={state} toggle={toggle} />)}</div></section>}
      {!!timeline.length && <section className="task-section"><h3>Timeline</h3><div className="task-list">{timeline.map(task => <TaskRow key={task.id} task={task} state={state} toggle={toggle} />)}</div></section>}
      {!!guide.targets.length && <section className="target-section"><h3>Social Link goals</h3><p className="small-note">Opening requirements to work toward. These are not required end-of-month ranks.</p><div className="target-grid">{guide.targets.map(task => {
        const opened = state.ranks[task.opensLinkId] > 0;
        const link = SOCIAL_LINKS.find(item => item.id === task.linkId);
        const destination = SOCIAL_LINKS.find(item => item.id === task.opensLinkId);
        return <article className="target-card" key={task.id}><h4>{state.showNames ? task.title : `Open ${destination.arcana}`}</h4>{task.rank && <p><strong>{link.arcana} rank {task.rank}</strong> · Current: {state.ranks[task.linkId]}</p>}{task.stat && <p><strong>{task.stat} rank {task.statRank}</strong> · Current: {state.stats[task.stat]}</p>}<details><summary>{opened ? 'Started · view requirements' : 'How to start'}</summary><p>{task.detail}</p><a href={task.sourceUrl} target="_blank" rel="noopener noreferrer">Source guide</a></details><button onClick={() => selectTab('links')}>{opened ? 'Update rank' : 'Track link'}</button></article>;
      })}</div></section>}
      {!!calendar.length && <details className="strategy-panel"><summary>Story dates, holidays & exam restrictions</summary><ul>{calendar.map(task => <li key={task.id}><strong>{dateLabel(task.date)}{task.end !== task.date && ` to ${dateLabel(task.end)}`}</strong> · {task.title}<p>{task.detail} <a href={task.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></p></li>)}</ul></details>}
      <div className="strategy-panel"><h3>Monthly strategy</h3><ul>{guide.strategy.slice(0,3).map(task => <li key={task.id}>{task.detail}</li>)}</ul><button onClick={() => selectTab('briefing')}>Social stat activities</button></div>
      <section className="personal-goals"><h3>Your own goals</h3><form className="goal-input" onSubmit={addGoal}><input aria-label="New monthly goal" value={goal} onChange={e => setGoal(e.target.value)} maxLength={200} placeholder="Add a goal for this month" required /><button type="submit">Add</button></form>{goalError && <p role="alert">{goalError}</p>}<ul className="goal-list">{goals.map(item => <li key={item.id}><label><input type="checkbox" checked={item.done} onChange={() => commit({ ...state, goals: state.goals.map(other => other.id === item.id ? { ...other, done: !other.done } : other) }, 'goal_checked')} /><span className={item.done ? 'done' : ''}>{item.text}</span></label><button aria-label={`Remove goal: ${item.text}`} onClick={() => commit({ ...state, goals: state.goals.filter(other => other.id !== item.id) })}>×</button></li>)}</ul></section>
    </div>
  </section>;
}
