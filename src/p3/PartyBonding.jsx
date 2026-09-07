import { useId } from 'react';
import bonding from '../../knowledge/p3-reload/party-bonding.json' with { type: 'json' };
import { dateLabel, dateNumber } from './planner.js';
import './party-bonding.css';

export default function PartyBonding({ state, commit }) {
  const id = useId();
  const countFor = activity => Math.max(0, Math.min(3, state.dormActivities?.[activity.id] || 0));
  const showNames = state.showNames || state.showEventNames;

  function update(activity, count) {
    commit({ ...state, dormActivities: { ...state.dormActivities, [activity.id]: Math.max(0, Math.min(3, Number(count))) } }, 'dorm_activity');
  }

  return <section className="party-bonding" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Dorm hangouts & Characteristics</h2>
    <p className="bonding-rule">{bonding.rule}</p>
    <p>Record each activity separately. Three sessions of either activity unlock the first Characteristic; three sessions of both unlock its upgrade. These counts do not change Social Link ranks.</p>
    {!showNames && <p className="bonding-spoilers">Companion names and abilities appear when you open a card.</p>}
    <div className="bonding-grid">{bonding.members.map((member, memberIndex) => {
      const completedActivities = member.activities.filter(activity => countFor(activity) === 3).length;
      const stage = Math.min(completedActivities, 2);
      return <article key={member.id} className="bonding-member"><details>
        <summary><span className="bonding-name">{showNames ? member.name : `Companion ${memberIndex + 1}`}</span><span className="bonding-summary">{stage === 2 ? 'Characteristic upgraded' : stage === 1 ? 'First Characteristic recorded' : `${member.activities.reduce((total, activity) => total + countFor(activity), 0)} / 6 sessions recorded`}</span><span className="bonding-start">From {dateLabel(member.after)}{dateNumber(state.date) < dateNumber(member.after) ? ' · opens later' : ''}</span></summary>
        {!showNames && <h3>{member.name}</h3>}
        <div className="bonding-characteristics"><p><strong>{member.characteristics[0]}</strong> · {stage >= 1 ? 'Recorded unlocked' : 'Complete one activity three times'}</p><p><strong>{member.characteristics[1]}</strong> · {stage === 2 ? 'Recorded unlocked' : 'Complete both activities three times each'}</p><p>{member.effect}</p></div>
        {member.activities.map(activity => <div className="bonding-activity" key={activity.id}>
          <h4>{activity.title}</h4><p>Usual day: {activity.schedule} · Evening</p><p>{activity.reward}</p>
          <div className="bonding-counter"><button aria-label={`Decrease ${member.name} ${activity.title} sessions`} disabled={!commit || countFor(activity) === 0} onClick={() => update(activity, countFor(activity) - 1)}>−</button><label htmlFor={`${id}-${activity.id}`}>Sessions<select id={`${id}-${activity.id}`} value={countFor(activity)} disabled={!commit} onChange={event => update(activity, event.target.value)}>{[0, 1, 2, 3].map(count => <option key={count} value={count}>{count} / 3</option>)}</select></label><button aria-label={`Increase ${member.name} ${activity.title} sessions`} disabled={!commit || countFor(activity) === 3} onClick={() => update(activity, countFor(activity) + 1)}>+</button></div>
        </div>)}
        <details className="bonding-sources"><summary>Sources</summary>{member.sources.map((source, index) => <p key={`${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label || source.url}</a></p>)}</details>
      </details></article>;
    })}</div>
  </section>;
}
