import { useMemo, useState } from 'react';
import enemies from '../../knowledge/p3-reload/reference/enemy-data.json';
import { affinities, SKILLS, skillDescription, SOURCE_URL } from './fusion.js';
import './combat-reference.css';

const entries = Object.entries(enemies).map(([name, data]) => ({ name, ...data })).sort((a, b) => a.name.localeCompare(b.name));
const regions = ['Thebel', 'Arqa', 'Yabbashah', 'Tziah', 'Harabah', 'Adamah', 'Monorail', 'Tutorial', 'Ultimate Adversary', 'Unknown'];
const displayName = enemy => enemy.boss && / [A-Z]$/.test(enemy.name) ? `${enemy.name.slice(0, -2)} · variant ${enemy.name.at(-1)}` : enemy.name;
const floorRange = area => area.match(/\s(\d+)(?:-(\d+))?$/);

export function AffinityTable({ resists }) {
  return <div className="combat-affinities" role="region" aria-label="Element affinities" tabIndex={0}><table><thead><tr>{affinities(resists).map(item => <th key={item.element} scope="col">{item.element}</th>)}</tr></thead><tbody><tr>{affinities(resists).map(item => <td key={item.element} className={`affinity-${item.label.toLowerCase()}`}>{item.label}{['Normal', 'Weak', 'Resist'].includes(item.label) && item.multiplier !== 1 && <small>×{item.multiplier} damage</small>}</td>)}</tr></tbody></table></div>;
}

export function SkillList({ skills, learnLevels }) {
  return <ul className="combat-skills">{skills.map(name => <li key={name}><strong>{name}</strong>{learnLevels && <span className="skill-level">{learnLevels[name] < 2 ? 'Innate' : `Level ${learnLevels[name]}`}</span>}<p>{skillDescription(name)}</p>{SKILLS[name] && <small>{SKILLS[name].cost}{learnLevels && SKILLS[name].card ? ` · Skill card: ${SKILLS[name].card}` : ''}</small>}</li>)}</ul>;
}

function EnemyDetail({ enemy }) {
  const matchups = affinities(enemy.resists);
  const weak = matchups.filter(item => item.label === 'Weak').map(item => item.element);
  const blocked = matchups.filter(item => ['Null', 'Repel', 'Drain'].includes(item.label)).map(item => `${item.element} (${item.label.toLowerCase()})`);
  return <div className="combat-entry-body">
    <p>Level {enemy.lvl} · {enemy.area} · {enemy.race.replace(/ B$/, '')} · HP {enemy.stats[0]} · SP {enemy.stats[1]}</p>
    <AffinityTable resists={enemy.resists} />
    {!enemy.area.startsWith('Ultimate Adversary') && <p>{weak.length ? `Target ${weak.join(', ')} weaknesses.` : 'No elemental weakness is listed for this variant.'}{blocked.length ? ` Avoid ${blocked.join(', ')} attacks.` : ''}</p>}
    {enemy.area.startsWith('Ultimate Adversary') && <p>This optional encounter has special battle rules. Use its specialist strategy before choosing attacks or defenses; ordinary affinity advice is disabled.</p>}
    <p className="small-note">This matchup advice follows the listed affinities. Skills and battle conditions can change them. Base power is not the final damage number.</p>
    <h4>Skills to prepare for</h4><SkillList skills={enemy.skills} />
    {enemy.ailments && <p>Ailment responses: {['Charm', 'Poison', 'Distress', 'Confuse', 'Fear', 'Rage'].map((name, i) => `${name}: ${enemy.ailments[i] === 'n' ? 'null' : enemy.ailments[i] === 'v' ? 'susceptible' : 'not decoded'}`).join(' · ')}.</p>}
    {!!enemy.dodds && <section><h4>Possible drops</h4><ul>{Object.entries(enemy.dodds).map(([name, chance]) => <li key={name}>{name} · {chance}% listed drop chance</li>)}</ul></section>}
    <a href={`${SOURCE_URL}/enemy-data.json`} target="_blank" rel="noreferrer">Enemy data source</a>
  </div>;
}

export function CombatReference({ showSpoilers = false }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [kind, setKind] = useState('all');
  const [floor, setFloor] = useState('');
  const [page, setPage] = useState(0);
  const shown = useMemo(() => entries.filter(enemy => {
    const range = floorRange(enemy.area);
    const fixed = range && !range[2];
    return (!query || `${enemy.name} ${enemy.area} ${enemy.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
      && (region === 'all' || enemy.area.startsWith(region))
      && (kind === 'all' || (kind === 'boss' ? enemy.boss : kind === 'fixed' ? fixed && !enemy.boss : !fixed && !enemy.boss))
      && (!floor || range && Number(floor) >= Number(range[1]) && Number(floor) <= Number(range[2] || range[1]));
  }), [query, region, kind, floor]);
  const pages = Math.max(1, Math.ceil(shown.length / 20));
  if (!showSpoilers) return <section className="campaign-reference panel"><h2>Enemies & boss help</h2><p>Turn on reference spoilers to browse enemy names, encounters, affinities and skills through the final battle.</p></section>;
  return <section className="campaign-reference" aria-label="Enemies and boss help"><h2>Enemies & boss help</h2><p>Search by enemy, skill or area. Lettered entries are separate source variants; their order does not describe a boss's turn sequence.</p>
    <div className="reference-controls"><label>Search<input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Enemy, skill or area" /></label><label>Area<select value={region} onChange={event => { setRegion(event.target.value); setPage(0); }}><option value="all">All areas</option>{regions.map(name => <option key={name}>{name}</option>)}</select></label><label>Encounter<select value={kind} onChange={event => { setKind(event.target.value); setPage(0); }}><option value="all">All encounters</option><option value="boss">Story & optional bosses</option><option value="fixed">Fixed-floor encounters</option><option value="normal">Other enemies</option></select></label><label>Floor<input type="number" min="1" max="264" value={floor} onChange={event => { setFloor(event.target.value); setPage(0); }} placeholder="Any" /></label></div>
    <p className="small-note">{shown.length} matching source entries. Area labels P1–P4 and D1–D3 are retained from the source; this reference does not assign them a specific floor. A floor filter excludes entries without a numeric floor.</p>
    <div className="reference-results">{shown.slice(page * 20, (page + 1) * 20).map(enemy => <details key={enemy.name} className="combat-entry"><summary><strong>{displayName(enemy)}</strong><span>{enemy.area} · Lv {enemy.lvl}</span></summary><EnemyDetail enemy={enemy} /></details>)}</div>
    {!shown.length && <p>No entries match these filters.</p>}
    <div className="reference-pagination"><button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page + 1} of {pages}</span><button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
    <p className="small-note">Main-campaign data from <a href={SOURCE_URL} target="_blank" rel="noreferrer">aqiu384's fusion tool</a>, including variants omitted from its usual enemy list. Unknown locations and undocumented skill effects remain marked.</p>
  </section>;
}
