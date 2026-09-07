import school from '../../knowledge/p3-reload/school-answers.json' with { type: 'json' };
import activities from '../../knowledge/p3-reload/activities.json';

const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Evidence({ sources }) {
  return <details className="reference-evidence"><summary>Sources</summary>{sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{new URL(source.url).hostname}</a> · {source.locator}</p>)}</details>;
}

export default function StudyReference({ month, section = 'all' }) {
  const entries = month ? school.entries.filter(entry => entry.month === Number(month)) : school.entries;
  return <section className="reload-reference">
    {section !== 'activities' && <details className="reference-school">
    <summary>School answers{month ? '' : ` · ${entries.length} dates`}</summary>
    <p>English answers for Reload. Final exam checks use Academics.</p>
    {entries.length === 0 && <p>No classroom questions this month.</p>}
    {entries.map(entry => <article className="reference-row" key={entry.id}>
      <div><strong>{entry.date.replace('-', '/')}</strong> · {entry.kind === 'classroom' ? entry.topic : entry.kind === 'exam' ? `Exam · ${entry.topic}` : entry.topic}</div>
      <p>{entry.answers.length ? entry.answers.join(' → ') : entry.requiredAcademics ? `Automatic check · Academics ${entry.requiredAcademics} for top marks` : 'Automatic exam day'}</p>
      {entry.note && <small>{entry.note}</small>}
      <Evidence sources={entry.sources} />
    </article>)}
    </details>}
    {section !== 'school' && <>
    <h2>Raise social stats</h2>
    <p>Rewards below are points. One musical note can represent more than one point. Story events can override opening hours.</p>
    {['academics', 'charm', 'courage'].map(stat => <details key={stat} className="reference-stat">
      <summary>{stat[0].toUpperCase() + stat.slice(1)}</summary>
      {activities.activities.filter(activity => activity.rewards[stat]).map(activity => <article className="reference-row" key={activity.id}>
        <strong>{activity.title} · +{activity.rewards[stat]} {stat}</strong>
        <p>{activity.venue}</p>
        <p>{activity.days.map(day => dayNames[day]).join(', ')} · {activity.slots.join(' / ')} · {activity.costYen ? `¥${activity.costYen.toLocaleString('en-US')}` : 'Free'}</p>
        {activity.requirements && <p>{activity.requirements}</p>}
        {activity.note && <small>{activity.note}</small>}
        <Evidence sources={activity.sources} />
      </article>)}
    </details>)}
    </>}
  </section>;
}
