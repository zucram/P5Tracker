import { Planner, Deadlines } from './Planner';
import { TartarusProgress } from './TartarusProgress';
import { MonthCalendar } from './MonthCalendar';
import StudyReference from './StudyReference';
import SocialLinkDialogue from './SocialLinkDialogue';
import CampaignReference from './CampaignReference';
import { CombatReference } from './CombatReference';
import { PersonaReference } from './PersonaReference';
import Requests from './Requests';
import PartyBonding from './PartyBonding';
import { EquipmentReference } from './EquipmentReference';
import { COLLECTION_SECTIONS } from './campaignData';
import campaign from '../../knowledge/p3-reload/campaign.json' with { type: 'json' };
import dailyLife from '../../knowledge/p3-reload/daily-life.json';
import { getMonthGuide } from './monthGuide';
import { dateLabel, FACT_BY_ID, dateNumber, monthForDate, shiftDate } from './planner';
import { createElement, useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, Download, Heart, Upload, Users, CalendarDays, ShieldCheck, BookOpen, Sword, Menu } from 'lucide-react';
import { SOCIAL_LINKS, SOCIAL_STATS, MONTHS, SOURCES } from './data';
import { loadState, persistState, importState, BACKUP_KEY, STORAGE_KEY, MAX_BYTES } from './save';
import './styles.css';

const BASE = import.meta.env.BASE_URL;
const VALID_TABS = ['briefing', 'calendar', 'planner', 'deadlines', 'links', 'month', 'backup', 'more', 'requests', 'combat', 'personas', 'party', 'campaign', 'equipment', 'collections', 'daily-life'];
const TARTARUS_TABS = [['deadlines', 'Progress & rescues'], ['requests', 'Elizabeth requests'], ['combat', 'Enemies & bosses']];
const REFERENCE_TABS = [['campaign', 'Campaign guide'], ['party', 'Dorm activities'], ['personas', 'Personas & fusion'], ['equipment', 'Equipment & shops'], ['daily-life', 'Daily life'], ['collections', 'Collections & outings']];
const LINK_OPENINGS = Object.fromEntries(MONTHS.flatMap(month => getMonthGuide(month.id).targets).map(task => [task.opensLinkId, task]));

function track(event, data = {}) {
  try { window.umami?.track(event, { game: 'persona-3-reload', ...data })?.catch?.(() => {}); } catch { /* Keep the tracker usable when analytics is blocked. */ }
}

export default function ReloadTracker() {
  const [loaded] = useState(() => {
    try {
      const result = loadState(window.localStorage);
      if (result.warning) {
        try { result.unreadableSave = window.localStorage.getItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
      }
      return result;
    }
    catch { return loadState(undefined); }
  });
  const [state, setState] = useState(loaded.state);
  const [saveWarning, setSaveWarning] = useState(loaded.warning || '');
  const [savingEnabled, setSavingEnabled] = useState(!loaded.warning);
  const [tab, setTab] = useState(() => VALID_TABS.includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'calendar');
  const usedTracker = useRef(false);
  const [viewMonth, setViewMonth] = useState(loaded.state.month);
  useEffect(() => {
    const changed = () => { const next = window.location.hash.slice(1); if (VALID_TABS.includes(next)) { setTab(next); setStatus(''); window.scrollTo(0, 0); } };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  function selectTab(next) { setTab(next); window.location.assign(`#${next}`); window.scrollTo(0, 0); setStatus(''); }
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [importText, setImportText] = useState('');
  const [shareFallback, setShareFallback] = useState(false);

  function commit(next, event) {
    if (savingEnabled) {
      try { persistState(window.localStorage, next); setSaveWarning(''); }
      catch { setSaveWarning('This browser could not save your latest change. Download a backup before closing this tab.'); }
    }
    setState(next);
    if (event) {
      track('p3_progress_changed', { action: event });
      if (!usedTracker.current) { usedTracker.current = true; track('p3_tracker_used'); }
    }
  }

  function setRank(id, value) {
    const rank = Math.max(0, Math.min(10, Number(value)));
    if (rank !== state.ranks[id]) commit({ ...state, ranks: { ...state.ranks, [id]: rank } }, 'link_rank');
  }

  function downloadUnreadableSave() {
    const url = URL.createObjectURL(new Blob([loaded.unreadableSave], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'p3-reload-unreadable-save.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Original stored save download started. Keep this file for recovery.');
  }

  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `p3-reload-${state.month}-save.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Backup download started. Keep it somewhere outside this browser.');
    track('p3_backup_download');
  }

  function applyImport(text, method = 'paste') {
    try {
      const next = importState(window.localStorage, state, text);
      setState(next); setViewMonth(next.month); setSavingEnabled(true); setSaveWarning(''); setImportText('');
      track('p3_save_imported', { method });
      setStatus('Save imported. Your previous progress can be restored below.');
    } catch (error) { track('p3_save_import_failed', { method }); setStatus(error.message || 'The save could not be imported. Your current progress is unchanged.'); }
  }

  async function importFile(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BYTES || !/\.(json|txt)$/i.test(file.name)) { setStatus('Choose a JSON or TXT backup smaller than 1 MB.'); return; }
    try { applyImport(await file.text(), 'file'); }
    catch { setStatus('The file could not be read. Your progress is unchanged.'); }
  }

  function restore() {
    try {
      const text = window.localStorage.getItem(BACKUP_KEY);
      if (!text) { setStatus('There is no previous import to restore on this browser.'); return; }
      applyImport(text, 'backup');
    } catch { setStatus('The previous save is not accessible in this browser.'); }
  }

  const shareUrl = `${window.location.origin}${BASE}p3/`;
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: 'Persona 3 Reload tracker', text: 'Plan your Reload playthrough with monthly checklists, Social Links and missable deadlines.', url: shareUrl });
      else await navigator.clipboard.writeText(shareUrl);
      setStatus(navigator.share ? 'Share dialog completed.' : 'Tracker link copied.');
      track('p3_share_complete');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setShareFallback(true); setStatus('Copy the public link below. It contains no save data.');
    }
  }

  const completed = SOCIAL_LINKS.filter(link => state.ranks[link.id] === 10).length;
  const shownLinks = SOCIAL_LINKS.filter(link => {
    const rank = state.ranks[link.id];
    if (filter === 'priority' && !state.favorites.includes(link.id)) return false;
    if (filter === 'progress' && (rank === 0 || rank === 10)) return false;
    if (filter === 'new' && rank !== 0) return false;
    if (filter === 'max' && rank !== 10) return false;
    return `${link.arcana} ${state.showNames ? link.name : ''}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="reload-app">
      <header className="site-header">
        <div><h1><span>P3</span> Tracker <small>RELOAD · BETA</small></h1><p className="header-caption">Persona 3 Reload monthly guide & Social Link tracker</p></div>
        <div className="header-actions"><a href={BASE}>All games</a><a href={`${BASE}p5/`}>P5 Royal</a><a className="support-button" href="https://ko-fi.com/K3K11RWTSL" target="_blank" rel="noopener noreferrer" onClick={() => track('p3_support_click')}>Support</a><button className="primary" onClick={() => selectTab('backup')}><Download size={15} /> Sync</button></div>
      </header>
      <nav className="tabs" aria-label="Tracker sections">
        {[['briefing', BookOpen, 'Briefing'], ['calendar', CalendarDays, 'Calendar'], ['links', Users, 'Social Links'], ['deadlines', Sword, 'Tartarus'], ['more', Menu, 'More']].map(([id, Icon, title]) => <button key={id} aria-current={(tab === id || (id === 'calendar' && ['planner', 'month'].includes(tab)) || (id === 'deadlines' && TARTARUS_TABS.some(([key]) => key === tab)) || (id === 'more' && (tab === 'backup' || REFERENCE_TABS.some(([key]) => key === tab)))) ? 'page' : undefined} onClick={() => selectTab(id)}>{createElement(Icon, { size: 19 })}<span>{title}</span></button>)}
      </nav>
      <main>
        {saveWarning && <div className="warning" role="alert">{saveWarning} <button onClick={download}>Download current progress</button>{loaded.unreadableSave != null && <button onClick={downloadUnreadableSave}>Download unreadable save</button>}</div>}
        {TARTARUS_TABS.some(([id]) => id === tab) && <nav className="reference-subnav" aria-label="Tartarus sections">{TARTARUS_TABS.map(([id, title]) => <button key={id} aria-current={id === tab ? 'page' : undefined} onClick={() => selectTab(id)}>{title}</button>)}</nav>}
        {REFERENCE_TABS.some(([id]) => id === tab) && <nav className="reference-subnav" aria-label="Reference sections"><button onClick={() => selectTab('more')}>More</button>{REFERENCE_TABS.map(([id, title]) => <button key={id} aria-current={id === tab ? 'page' : undefined} onClick={() => selectTab(id)}>{title}</button>)}</nav>}
        {(REFERENCE_TABS.some(([id]) => id === tab) || tab === 'combat') && <label className="name-toggle reference-spoilers"><input type="checkbox" checked={state.showEventNames} onChange={event => commit({ ...state, showEventNames: event.target.checked })} /> Show reference names and story spoilers</label>}
        {tab === 'requests' && <Requests state={state} commit={commit} selectTab={selectTab} />}
        {tab === 'combat' && <><button className="back-calendar" onClick={() => selectTab('campaign')}>Tartarus mechanics, boss tactics & story choices <ArrowRight size={15} /></button><CombatReference state={state} commit={commit} showSpoilers={state.showEventNames} /></>}
        {tab === 'personas' && <PersonaReference state={state} commit={commit} showSpoilers={state.showEventNames} />}
        {tab === 'party' && <PartyBonding state={state} commit={commit} />}
        {tab === 'daily-life' && <section><div className="section-heading"><div><h2>Daily life</h2><p>Affinity, gifts, gardening and computer upgrades.</p></div></div><CampaignReference sections={dailyLife.sections} initialSection="daily-life" showSpoilers={state.showEventNames} /></section>}
        {tab === 'equipment' && <EquipmentReference showSpoilers={state.showEventNames} />}
        {tab === 'campaign' && <section><div className="section-heading"><div><h2>Campaign guide</h2><p>Tartarus mechanics, boss preparation, story choices, Linked Episodes and Theurgy. Open a story entry when you reach it.</p></div></div><CampaignReference sections={campaign.sections} showSpoilers={state.showEventNames} /></section>}
        {tab === 'collections' && <section><div className="section-heading"><div><h2>Collections & outings</h2><p>Town fragments, dated invitations and TV offers. Each checkmark records the activity shown.</p></div></div><CampaignReference sections={COLLECTION_SECTIONS} initialSection="fragments" completedIds={state.collectionChecks} showSpoilers={state.showEventNames} onToggle={id => commit({ ...state, collectionChecks: state.collectionChecks.includes(id) ? state.collectionChecks.filter(value => value !== id) : [...state.collectionChecks, id] }, 'collection_checked')} /></section>}
        {(tab === 'calendar' || tab === 'month') && <MonthCalendar state={state} commit={commit} month={viewMonth} setMonth={setViewMonth} selectTab={selectTab} />}
        {(tab === 'planner' || tab === 'deadlines') && <>
        <section id="planner" className="date-bar" aria-label="In-game date and time">
          <div><label htmlFor="current-month">In-game month</label><select id="current-month" value={state.month} onChange={event => {
            const index = MONTHS.findIndex(m => m.id === event.target.value);
            const month = String((index + 3) % 12 + 1).padStart(2, '0');
            const requested = `${month}-${state.date.slice(3)}`;
            const date = Number.isFinite(dateNumber(requested)) ? requested : `${month}-01`;
            commit({ ...state, month: event.target.value, date });
          }}>{MONTHS.map(month => <option key={month.id} value={month.id}>{month.name}</option>)}</select></div>
          <div><label htmlFor="current-day">Day</label><select id="current-day" value={state.date.slice(3)} onChange={e => commit({ ...state, date: `${state.date.slice(0, 2)}-${e.target.value}` })}>{Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).filter(day => Number.isFinite(dateNumber(`${state.date.slice(0, 2)}-${day}`))).map(day => <option key={day} value={day}>{Number(day)}</option>)}</select></div>
          <div><label htmlFor="current-slot">Time slot</label><select id="current-slot" value={state.slot} onChange={e => commit({ ...state, slot: e.target.value })}><option value="daytime">Daytime</option><option value="evening">Evening</option></select></div>
          <div className="date-step"><button aria-label="Previous day" disabled={state.date === '04-01'} onClick={() => { const date = shiftDate(state.date, -1); commit({ ...state, date, month: monthForDate(date) }); }}><ArrowLeft size={16} /></button><span>{new Date(dateNumber(state.date) * 86400000).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}</span><button aria-label="Next day" disabled={state.date === '01-31'} onClick={() => { const date = shiftDate(state.date, 1); commit({ ...state, date, month: monthForDate(date) }); }}><ArrowRight size={16} /></button></div>
        </section>
        {tab === 'planner' && <><button className="back-calendar" onClick={() => selectTab('calendar')}><ArrowLeft size={15} /> Monthly calendar</button>
        <Planner state={state} commit={commit} selectTab={selectTab} /></>}
        </>}

        {tab === 'briefing' && <section>
        <div className="section-heading"><div><h2>Briefing</h2><p>Record your stats, then use the calendar to plan your month.</p></div><span className="count-pill">{completed}/{SOCIAL_LINKS.length} links maxed</span></div>
        <section className="stats-row" aria-label="Social stats">
          {SOCIAL_STATS.map(stat => <div className="stat-card" key={stat}>
            <label htmlFor={`stat-${stat}`}>{stat}</label>
            <div><select id={`stat-${stat}`} value={state.stats[stat]} onChange={event => commit({ ...state, stats: { ...state.stats, [stat]: Number(event.target.value) } }, 'social_stat')}>
              {[1, 2, 3, 4, 5, 6].map(rank => <option key={rank} value={rank}>Rank {rank}</option>)}
            </select><span className="stat-max">of 6</span></div>
            <div className="stat-dots" aria-hidden="true">{[1, 2, 3, 4, 5, 6].map(rank => <span key={rank} className={state.stats[stat] >= rank ? 'filled' : ''} />)}</div>
          </div>)}
        </section>

        <div className="briefing-notes panel"><h3>Make each free day count</h3><ul><li>Bring a Persona of the matching Arcana when meeting a Social Link.</li><li>Use school days for school links. Holidays and the week before exams restrict their availability.</li><li>Build social stats in the evening when possible. Check the activities below for where to go.</li><li>Check messages for Linked Episodes. Their windows are reminders, not appointments every day.</li></ul><button onClick={() => selectTab('calendar')}>Open monthly calendar <ArrowRight size={15} /></button></div>
        <StudyReference section="activities" />
        </section>}
        {tab === 'deadlines' && <><div className="section-heading"><div><h2>Tartarus & requests</h2><p>Rescue floors, Elizabeth's requests and Linked Episode reminders.</p></div></div><TartarusProgress state={state} commit={commit} /><Deadlines state={state} commit={commit} /></>}

        {tab === 'links' && <section aria-labelledby="links-title">
          <div className="section-heading"><div><h2 id="links-title">Social Links</h2><p>Update ranks from your game. Priorities help you choose what to focus on next.</p></div>
            <label className="name-toggle"><input type="checkbox" checked={state.showNames} onChange={event => commit({ ...state, showNames: event.target.checked })} /> Show character names and notes</label>
          </div>
          <div className="filters"><input aria-label="Search Social Links" placeholder={state.showNames ? 'Search arcana or character…' : 'Search arcana…'} value={query} onChange={event => setQuery(event.target.value)} />
            <select aria-label="Filter Social Links" value={filter} onChange={event => setFilter(event.target.value)}>{[['all', 'All links'], ['priority', 'My priorities'], ['progress', 'In progress'], ['new', 'Not started'], ['max', 'Maxed']].map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          </div>
          <p className="small-note">Stat requirements are only part of unlocking a link. Dates, introductions and other conditions can also apply. Story links do not need ordinary hangouts.</p>
          <div className="link-grid">{shownLinks.map(link => {
            const rank = state.ranks[link.id];
            const priority = state.favorites.includes(link.id);
            const gate = link.statGate;
            const schedule = FACT_BY_ID[`sl-${link.id}`]?.value;
            const opening = LINK_OPENINGS[link.id];
            const statReady = gate && state.stats[gate.stat] >= gate.rank;
            return <article className={`link-card ${rank === 10 ? 'is-maxed' : ''}`} key={link.id}>
              <div className="card-top"><span className="arcana-type">{link.kind === 'story' ? 'STORY PROGRESSION' : link.kind.toUpperCase()}</span><button className={`favorite ${priority ? 'selected' : ''}`} aria-label={`${priority ? 'Remove' : 'Add'} ${link.arcana} ${priority ? 'from' : 'to'} priorities`} aria-pressed={priority} onClick={() => commit({ ...state, favorites: priority ? state.favorites.filter(id => id !== link.id) : [...state.favorites, link.id] })}><Bookmark size={19} fill={priority ? 'currentColor' : 'none'} /></button></div>
              <h3>{link.arcana}</h3>
              {state.showNames && <p className="character-name">{link.name}</p>}
              <div className="rank-control"><button aria-label={`Decrease ${link.arcana} rank`} disabled={rank === 0} onClick={() => setRank(link.id, rank - 1)}>−</button><label htmlFor={`rank-${link.id}`}>Rank <select id={`rank-${link.id}`} value={rank} onChange={event => setRank(link.id, event.target.value)}>{Array.from({ length: 11 }, (_, index) => <option key={index} value={index}>{index === 10 ? '10 · MAX' : index}</option>)}</select></label><button aria-label={`Increase ${link.arcana} rank`} disabled={rank === 10} onClick={() => setRank(link.id, rank + 1)}>+</button></div>
              {gate && <p className={`gate ${statReady ? 'ready' : ''}`}>{statReady && <Check size={14} />}{gate.stat} rank {gate.rank} {statReady ? 'met' : 'needed'}</p>}
              {schedule?.days?.length > 0 && <p className="link-note">Usually {schedule.days.map(day => day[0].toUpperCase() + day.slice(1)).join(', ')} · {schedule.timeSlot.replaceAll('-', ' ')}{link.id === 'hermit' ? ', plus some holidays' : ''}{schedule.start && <><br />First opening: {dateLabel(schedule.start)}</>}</p>}
              {opening && <details><summary>Introduction & requirements{!state.showNames ? ' · includes names' : ''}</summary><p>{opening.detail}</p><a href={opening.sourceUrl} target="_blank" rel="noopener noreferrer">Source guide</a></details>}
              {link.kind === 'story' && <p className="link-note">{link.note}</p>}
              {link.kind !== 'story' && <SocialLinkDialogue link={link} state={state} commit={commit} />}
              {link.kind !== 'story' && rank === 0 && <label className="introduction-check"><input type="checkbox" checked={state.unlockedLinks.includes(link.id)} onChange={() => commit({ ...state, unlockedLinks: state.unlockedLinks.includes(link.id) ? state.unlockedLinks.filter(id => id !== link.id) : [...state.unlockedLinks, link.id] }, 'introduction_confirmed')} /> I completed this introduction in-game</label>}
            </article>;
          })}</div>
          {!shownLinks.length && <p className="empty">No links match this view. Bookmark a link to add a priority, or change the filter.</p>}
        </section>}

        {tab === 'more' && <section><div className="section-heading"><div><h2>More</h2><p>Reference guides, backups and tracker information.</p></div></div>
          <div className="more-grid">{REFERENCE_TABS.map(([id, title]) => <button className="panel" key={id} onClick={() => selectTab(id)}><h3>{title}</h3><p>{{ campaign: 'Story choices, boss mechanics, episode branches and Theurgy.', party: 'Track both activity chains for every companion.', personas: 'Search the compendium, check unlocks and find fusion recipes.', equipment: 'Find shop stock, crafting recipes and materials.', 'daily-life': 'Choose gifts, raise affinity, grow crops and use computer upgrades.', collections: 'Twilight Fragments, film invitations, walks and TV shopping.' }[id]}</p></button>)}</div>
          <div className="more-grid"><a className="panel" href={`${BASE}guides/persona-3-reload-school-answers/`} onClick={() => track('p3_guide_opened', { guide: 'school-answers' })}><h3>School & exam answers</h3><p>All dated answers, exam requirements and social-stat activities.</p></a><a className="panel" href={`${BASE}guides/persona-3-reload-social-links/`} onClick={() => track('p3_guide_opened', { guide: 'social-links' })}><h3>Social Link guide</h3><p>Opening requirements and weekly schedules.</p></a><a className="panel" href={`${BASE}guides/persona-3-reload-deadlines/`} onClick={() => track('p3_guide_opened', { guide: 'deadlines' })}><h3>Deadlines guide</h3><p>Missing people, requests and episode windows.</p></a><button className="panel" onClick={() => selectTab('backup')}><h3>Sync & backup</h3><p>Move your progress to another browser or device.</p></button><button className="panel" onClick={share}><h3>Share the tracker</h3><p>Send a link to another Reload player.</p></button></div>
          <div className="more-grid">{[
            ['social-link-answers', 'Social Link answers', 'Rank-by-rank choices, friendship and romance.'],
            ['elizabeth-requests', 'All 101 Elizabeth requests', 'Numbered solutions, rewards and requirements.'],
            ['fusion-guide', 'Fusion guide', 'Request recipes, special fusions and DLC settings.'],
          ].map(([slug, title, description]) => <a className="panel" key={slug} href={`${BASE}guides/persona-3-reload-${slug}/`} onClick={() => track('p3_guide_opened', { guide: slug })}><h3>{title}</h3><p>{description}</p></a>)}</div>
          <div className="panel scope-panel"><h3>About this beta</h3><p>A companion for the whole Reload main campaign, with monthly planning, rank dialogue, requests, combat, fusion and optional activities. Beta means individual details may need corrections. Episode Aigis is a separate campaign and is not included.</p><p>Your progress stays in this browser. Every feature is free.</p></div>
        </section>}

        {tab === 'backup' && <section className="backup-panel" aria-labelledby="backup-title"><h2 id="backup-title">Sync & backup</h2><p>Your progress lives in this browser. It does not sync automatically. Download a backup, move the file to your other device, and import it there.</p><button className="primary" onClick={download}><Download size={18} /> Download Reload save</button>
          <div className="import-box"><h3>Import a Reload save</h3><p>Import replaces this tracker’s progress and keeps one previous save for recovery. Royal, Portable, FES and Episode Aigis saves are not compatible.</p><label className="file-label"><Upload size={17} /> Choose a backup file<input type="file" accept=".json,.txt" onChange={importFile} /></label><details><summary>Or paste backup text</summary><textarea aria-label="Reload backup text" rows={5} maxLength={MAX_BYTES} value={importText} onChange={event => setImportText(event.target.value)} /><button disabled={!importText.trim()} onClick={() => applyImport(importText)}>Import pasted save</button></details><button className="restore" onClick={restore}>Restore previous import</button></div><p className="small-note">Local recovery is lost when browser data is cleared. Keep a downloaded backup too.</p></section>}
        <p className="status" role="status">{status}</p><div className="save-indicator"><ShieldCheck size={14} /> {saveWarning ? 'Download a backup before leaving' : 'Saved on this browser'} <button onClick={() => selectTab('backup')}>Back up progress</button></div>

        <section className="support-panel"><div><Heart size={23} /><h2>Useful on your second screen?</h2><p>This tracker is free. Optional tips support fixes, content checks and updates.</p></div><div className="support-actions"><a className="primary" href="https://ko-fi.com/K3K11RWTSL" target="_blank" rel="noopener noreferrer" onClick={() => track('p3_support_click')}>Support on Ko-fi <ArrowRight size={17} /></a><button onClick={share}>Share the tracker</button></div></section>
        {shareFallback && <input aria-label="Public Reload tracker link" className="share-fallback" readOnly value={shareUrl} onFocus={event => event.target.select()} />}
        <footer><a href={BASE}><ArrowLeft size={15} /> All games</a><p>Unofficial Persona 3 Reload fan tool. Not affiliated with ATLUS or SEGA. Character names and source guides can contain spoilers.</p><details><summary>Sources and scope</summary><p>Dates and requirements were compared across published player guides. The planner handles reviewed closures and usual weekdays, but story choices, rank-specific meetings and affinity can change what is possible. Episode windows are reminders to check invitations, not appointments. The companion includes every manual Social Link rank, all 101 Elizabeth requests and the main-campaign reference systems. Choices and dialogue cues are original summaries with sources. Automated and browser checks do not replace a full in-game validation run. Episode Aigis is not included.</p><ul>{SOURCES.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></details><p>Umami measures visits and feature use. Save contents, goal text and character ranks are not sent in events. <a href="https://github.com/zucram/P5Tracker/issues">Report a correction or request a feature</a>.</p></footer>
      </main>
    </div>
  );
}
