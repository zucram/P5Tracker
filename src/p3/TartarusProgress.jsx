import data from '../../knowledge/p3-reload/tartarus.json' with { type: 'json' };
import { dateLabel, dateNumber } from './planner';

export function TartarusProgress({ state, commit }) {
  const blocks = data.blocks.filter(block => dateNumber(block.start) <= dateNumber(state.date));
  const closure = data.closures.find(row => dateNumber(row.start) <= dateNumber(state.date) && dateNumber(row.end) >= dateNumber(state.date));
  const current = blocks.at(-1);
  return <section className="panel tartarus-progress"><h3>Tartarus progression</h3>{closure && <p className="warning">{closure.reason}</p>}<p>{current ? `By ${dateLabel(state.date)}, the available climb reaches floor ${current.toFloor}.` : 'Free exploration begins April 21, after the April 20 tutorial.'} These are access dates, not deadlines to clear a block.</p>
    <div className="task-list">{blocks.map(block => {
      const id = `tartarus-${block.id}`;
      const done = (state.checkedTasks || []).includes(id);
      return <article className={`task-row ${done ? 'is-done' : ''}`} key={id}><input id={id} type="checkbox" checked={done} onChange={() => commit({ ...state, checkedTasks: done ? state.checkedTasks.filter(x => x !== id) : [...(state.checkedTasks || []), id] }, 'event_checked')} /><div className="task-body"><label htmlFor={id}>{block.name} · floors {block.fromFloor}–{block.toFloor}</label><p>From {dateLabel(block.start)}{block.notes ? ` · ${block.notes}` : ''}</p><details><summary>Source & floor boundary</summary><p>The whole {block.name.split(',')[0]} block ends at floor {block.blockEndFloor}. Later sections may remain locked.</p>{block.sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{new URL(source.url).hostname}</a> · {source.locator}</p>)}</details></div></article>;
    })}</div>
    <details><summary>All section access dates, including future months</summary><ul>{data.blocks.map(block => <li key={block.id}>{dateLabel(block.start)} · {block.name} · floors {block.fromFloor}–{block.toFloor}</li>)}</ul></details>
  </section>;
}
