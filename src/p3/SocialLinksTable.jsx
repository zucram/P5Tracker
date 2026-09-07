import { Fragment, useState } from 'react';
import { Bookmark, ChevronDown } from 'lucide-react';
import { MONTHS } from './data';
import { getMonthGuide } from './monthGuide';
import { dateLabel, FACT_BY_ID } from './planner';
import dailyLife from '../../knowledge/p3-reload/daily-life.json';
import SocialLinkDialogue from './SocialLinkDialogue';
import './social-links-table.css';

const OPENINGS = Object.fromEntries(MONTHS.flatMap(month => getMonthGuide(month.id).targets).map(task => [task.opensLinkId, task]));
const GIFTS = dailyLife.sections.find(section => section.id === 'gifts').entries;

export default function SocialLinksTable({ links, state, commit, setRank, selectTab }) {
  const [expanded, setExpanded] = useState({});
  const toggle = id => setExpanded(current => ({ ...current, [id]: !current[id] }));
  return <div className="social-links-list"><table className="social-links-table">
    <thead><tr><th scope="col">Social Link</th><th scope="col">Current rank</th><th scope="col">Schedule & requirements</th><th scope="col"><span className="sl-sr-only">Priority</span></th></tr></thead>
    <tbody>{links.map(link => {
      const rank = state.ranks[link.id];
      const priority = state.favorites.includes(link.id);
      const open = !!expanded[link.id];
      const gate = link.statGate;
      const ready = gate && state.stats[gate.stat] >= gate.rank;
      const opening = OPENINGS[link.id];
      const schedule = FACT_BY_ID[`sl-${link.id}`]?.value;
      const usualDays = schedule?.days?.map(day => day[0].toUpperCase() + day.slice(1)).join(', ');
      const gift = GIFTS.find(entry => entry.id === `gift-${link.id}`);
      const notes = <>{gate && <p className={`sl-gate ${ready ? 'ready' : ''}`}>{gate.stat} rank {gate.rank} {ready ? 'met' : 'needed'}</p>}{usualDays && <p className="sl-schedule">Usually {usualDays} · {schedule.timeSlot.replaceAll('-', ' ')}{link.id === 'hermit' ? ', plus some holidays' : ''}</p>}{link.kind === 'story' && <p className="sl-schedule">Story progression</p>}</>;
      return <Fragment key={link.id}>
        <tr className={`sl-summary ${open ? 'is-open' : ''} ${rank === 10 ? 'is-maxed' : ''}`} onClick={event => { if (!event.target.closest('button, a, input, select, label')) toggle(link.id); }}>
          <td className="sl-identity"><button className="sl-toggle" aria-expanded={open} aria-controls={`sl-detail-${link.id}`} aria-label={`${open ? 'Hide' : 'Show'} ${link.arcana} guide${!state.showNames ? ' · includes spoilers' : ''}`} onClick={() => toggle(link.id)}><ChevronDown size={18} /><span><strong>{link.arcana}</strong>{state.showNames && <small>{link.name}</small>}</span></button></td>
          <td className="sl-rank"><div className="sl-rank-control"><button aria-label={`Decrease ${link.arcana} rank`} disabled={rank === 0} onClick={() => setRank(link.id, rank - 1)}>−</button><label><span className="sl-sr-only">{link.arcana} rank</span><select value={rank} onChange={event => setRank(link.id, event.target.value)}>{Array.from({ length: 11 }, (_, index) => <option key={index} value={index}>{index === 10 ? '10 · MAX' : index}</option>)}</select></label><button aria-label={`Increase ${link.arcana} rank`} disabled={rank === 10} onClick={() => setRank(link.id, rank + 1)}>+</button></div></td>
          <td className="sl-notes">{notes}</td>
          <td className="sl-priority"><button aria-label={`${priority ? 'Remove' : 'Add'} ${link.arcana} ${priority ? 'from' : 'to'} priorities`} aria-pressed={priority} onClick={() => commit({ ...state, favorites: priority ? state.favorites.filter(id => id !== link.id) : [...state.favorites, link.id] })}><Bookmark size={18} fill={priority ? 'currentColor' : 'none'} /></button></td>
        </tr>
        <tr className="sl-details-row" hidden={!open}><td colSpan={4} id={`sl-detail-${link.id}`}>
          {open && <div className={`sl-details ${link.kind === 'story' ? 'sl-story' : ''}`}>
            <button className="sl-mobile-priority" aria-pressed={priority} onClick={() => commit({ ...state, favorites: priority ? state.favorites.filter(id => id !== link.id) : [...state.favorites, link.id] })}><Bookmark size={15} fill={priority ? 'currentColor' : 'none'} />{priority ? 'Remove from priorities' : 'Add to priorities'}</button>
            {link.kind !== 'story' && <SocialLinkDialogue link={link} state={state} commit={commit} />}
            <aside className="sl-resources" aria-label={`${link.arcana} planning`}>
              <h3>{link.kind === 'story' ? 'Story progression' : 'Planning this link'}</h3>
              {link.kind === 'story' ? <p>{link.note}</p> : <>
                {usualDays && <p>Usually {usualDays} · {schedule.timeSlot.replaceAll('-', ' ')}{link.id === 'hermit' ? ', plus some holidays' : ''}.</p>}
                {schedule?.start && <p>First opening: {dateLabel(schedule.start)}.</p>}
                {gate && <p className={`sl-gate ${ready ? 'ready' : ''}`}>{gate.stat} rank {gate.rank} {ready ? 'met' : 'needed'}.</p>}
                {opening && <section className="sl-opening"><h4>Introduction & requirements</h4><p>{opening.detail}</p><a href={opening.sourceUrl} target="_blank" rel="noopener noreferrer">Source guide</a></section>}
                {rank === 0 && <label className="sl-introduction"><input type="checkbox" checked={state.unlockedLinks.includes(link.id)} onChange={() => commit({ ...state, unlockedLinks: state.unlockedLinks.includes(link.id) ? state.unlockedLinks.filter(id => id !== link.id) : [...state.unlockedLinks, link.id] }, 'introduction_confirmed')} /> I completed this introduction in-game</label>}
                {gift && <div className="sl-gifts"><h3>Recommended gifts</h3><div className="sl-gift-tags">{gift.summary.split(', ').map(name => <span key={name}>{name}</span>)}</div><div className="sl-gift-help">{gift.steps.map(step => <p key={step}>{step}</p>)}{gift.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>)}</div><button onClick={() => selectTab('equipment')}>Find gift shops</button></div>}
              </>}
            </aside>
          </div>}
        </td></tr>
      </Fragment>;
    })}</tbody>
  </table></div>;
}
