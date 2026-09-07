import { createElement, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Check, Download, Heart, Upload, Users, CalendarDays, ShieldCheck } from 'lucide-react';
import { SOCIAL_LINKS, SOCIAL_STATS, MONTHS, SOURCES } from './data';
import { loadState, persistState, importState, BACKUP_KEY, STORAGE_KEY, MAX_BYTES } from './save';
import './styles.css';

const BASE = import.meta.env.BASE_URL;
const PROMPTS = ['Choose the Social Links I want to prioritize this month', 'Check the social stats needed for my priority links', 'Review current Tartarus, rescue and request deadlines in-game'];

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
  const [tab, setTab] = useState('links');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState('');
  const [importText, setImportText] = useState('');
  const [shareFallback, setShareFallback] = useState(false);

  function commit(next, event) {
    if (savingEnabled) {
      try { persistState(window.localStorage, next); setSaveWarning(''); }
      catch { setSaveWarning('This browser could not save your latest change. Download a backup before closing this tab.'); }
    }
    setState(next);
    if (event) track('p3_progress_changed', { action: event });
  }

  function setRank(id, value) {
    const rank = Math.max(0, Math.min(10, Number(value)));
    commit({ ...state, ranks: { ...state.ranks, [id]: rank } }, 'link_rank');
  }

  function addGoal(text) {
    const clean = text.trim();
    if (!clean) return;
    if (state.goals.length >= 100) { setStatus('Your checklist has 100 goals. Remove a finished goal before adding another.'); return; }
    const id = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    commit({ ...state, goals: [...state.goals, { id, text: clean.slice(0, 200), month: state.month, done: false }] }, 'goal_added');
    setGoal('');
    setStatus('Goal added to this month.');
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

  function applyImport(text) {
    try {
      const next = importState(window.localStorage, state, text);
      setState(next); setSavingEnabled(true); setSaveWarning(''); setImportText('');
      setStatus('Save imported. Your previous progress can be restored below.');
    } catch (error) { setStatus(error.message || 'The save could not be imported. Your current progress is unchanged.'); }
  }

  async function importFile(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BYTES || !/\.(json|txt)$/i.test(file.name)) { setStatus('Choose a JSON or TXT backup smaller than 1 MB.'); return; }
    try { applyImport(await file.text()); }
    catch { setStatus('The file could not be read. Your progress is unchanged.'); }
  }

  function restore() {
    try {
      const text = window.localStorage.getItem(BACKUP_KEY);
      if (!text) { setStatus('There is no previous import to restore on this browser.'); return; }
      applyImport(text);
    } catch { setStatus('The previous save is not accessible in this browser.'); }
  }

  const shareUrl = `${window.location.origin}${BASE}games/persona-3-reload/?utm_source=app&utm_medium=share&utm_campaign=p3_player_referral`;
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: 'Persona 3 Reload tracker', text: 'Keep your Social Links, social stats and monthly goals in one place.', url: shareUrl });
      else await navigator.clipboard.writeText(shareUrl);
      setStatus(navigator.share ? 'Share dialog completed.' : 'Tracker link copied.');
      track('p3_share_complete');
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setShareFallback(true); setStatus('Copy the public link below. It contains no save data.');
    }
  }

  const completed = SOCIAL_LINKS.filter(link => state.ranks[link.id] === 10).length;
  const monthlyGoals = state.goals.filter(item => item.month === state.month);
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
        <a href={`${BASE}games/`} className="brand"><span className="brand-symbol">G</span> Game companions</a>
        <a href={BASE} className="royal-link">Royal tracker <ArrowRight size={15} /></a>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">PERSONA 3 RELOAD · FIRST RELEASE</p>
            <h1>Make time<br />for your <span>next link.</span></h1>
            <p className="intro">Your Social Links, social stats and monthly goals, together in one free tracker. Pick up where you left off.</p>
            <p className="scope">Main campaign. This first version tracks your plans; it does not provide a complete day-by-day route or dialogue answers.</p>
          </div>
          <div className="progress-card">
            <p className="eyebrow">YOUR PLAYTHROUGH</p>
            <div className="progress-number">{completed}<span> / {SOCIAL_LINKS.length}</span></div>
            <p>Social Links at rank 10</p>
            <progress aria-label="Social Links at rank 10" value={completed} max={SOCIAL_LINKS.length} />
            <label className="month-label" htmlFor="current-month">Planning month</label>
            <select id="current-month" value={state.month} onChange={event => commit({ ...state, month: event.target.value })}>
              {MONTHS.map(month => <option key={month.id} value={month.id}>{month.name}</option>)}
            </select>
          </div>
        </section>

        {saveWarning && <div className="warning" role="alert">{saveWarning} Your changes in this tab are still available to download. <button onClick={download}>Download current progress</button>{loaded.unreadableSave != null && <button onClick={downloadUnreadableSave}>Download unreadable save</button>}</div>}
        <div className="save-indicator"><ShieldCheck size={15} /> {saveWarning ? 'Check your backup before leaving' : 'Saved on this browser. No account needed.'} <button onClick={() => { setTab('backup'); setStatus(''); }}>Back up or move devices</button></div>

        <section className="stats-row" aria-label="Social stats">
          {SOCIAL_STATS.map(stat => <div className="stat-card" key={stat}>
            <label htmlFor={`stat-${stat}`}>{stat}</label>
            <div><select id={`stat-${stat}`} value={state.stats[stat]} onChange={event => commit({ ...state, stats: { ...state.stats, [stat]: Number(event.target.value) } }, 'social_stat')}>
              {[1, 2, 3, 4, 5, 6].map(rank => <option key={rank} value={rank}>Rank {rank}</option>)}
            </select><span className="stat-max">of 6</span></div>
            <div className="stat-dots" aria-hidden="true">{[1, 2, 3, 4, 5, 6].map(rank => <span key={rank} className={state.stats[stat] >= rank ? 'filled' : ''} />)}</div>
          </div>)}
        </section>

        <nav className="tabs" aria-label="Tracker sections">
          {[['links', Users, 'Social Links'], ['month', CalendarDays, 'Monthly goals'], ['backup', Download, 'Save & restore']].map(([id, Icon, title]) => <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => { setTab(id); setStatus(''); }}>{createElement(Icon, { size: 17 })}{title}</button>)}
        </nav>

        {tab === 'links' && <section aria-labelledby="links-title">
          <div className="section-heading"><div><h2 id="links-title">Every bond, at your pace.</h2><p>Update ranks from your game. Priorities help you choose what to focus on next.</p></div>
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
            const statReady = gate && state.stats[gate.stat] >= gate.rank;
            return <article className={`link-card ${rank === 10 ? 'is-maxed' : ''}`} key={link.id}>
              <div className="card-top"><span className="arcana-type">{link.kind === 'story' ? 'STORY PROGRESSION' : link.kind.toUpperCase()}</span><button className={`favorite ${priority ? 'selected' : ''}`} aria-label={`${priority ? 'Remove' : 'Add'} ${link.arcana} ${priority ? 'from' : 'to'} priorities`} aria-pressed={priority} onClick={() => commit({ ...state, favorites: priority ? state.favorites.filter(id => id !== link.id) : [...state.favorites, link.id] })}><Bookmark size={19} fill={priority ? 'currentColor' : 'none'} /></button></div>
              <h3>{link.arcana}</h3>
              {state.showNames && <p className="character-name">{link.name}</p>}
              <div className="rank-control"><button aria-label={`Decrease ${link.arcana} rank`} disabled={rank === 0} onClick={() => setRank(link.id, rank - 1)}>−</button><label htmlFor={`rank-${link.id}`}>Rank <select id={`rank-${link.id}`} value={rank} onChange={event => setRank(link.id, event.target.value)}>{Array.from({ length: 11 }, (_, index) => <option key={index} value={index}>{index === 10 ? '10 · MAX' : index}</option>)}</select></label><button aria-label={`Increase ${link.arcana} rank`} disabled={rank === 10} onClick={() => setRank(link.id, rank + 1)}>+</button></div>
              {gate && <p className={`gate ${statReady ? 'ready' : ''}`}>{statReady && <Check size={14} />}{gate.stat} rank {gate.rank} {statReady ? 'met' : 'needed'}</p>}
              {state.showNames && <p className="link-note">{link.note}</p>}
            </article>;
          })}</div>
          {!shownLinks.length && <p className="empty">No links match this view. Bookmark a link to add a priority, or change the filter.</p>}
        </section>}

        {tab === 'month' && <section aria-labelledby="month-title">
          <div className="section-heading"><div><h2 id="month-title">Your {MONTHS.find(month => month.id === state.month)?.name} plan</h2><p>A personal checklist for this month. Set goals that fit your playthrough.</p></div><span className="count-pill">{monthlyGoals.filter(item => item.done).length}/{monthlyGoals.length} done</span></div>
          <div className="planning-grid"><div className="goals-panel">
            <form onSubmit={event => { event.preventDefault(); addGoal(goal); }}><label htmlFor="new-goal">Add a goal</label><div className="goal-input"><input id="new-goal" value={goal} maxLength={200} onChange={event => setGoal(event.target.value)} placeholder="For example, reach Courage rank 4" required /><button type="submit">Add</button></div></form>
            <ul className="goal-list">{monthlyGoals.map(item => <li key={item.id}><label><input type="checkbox" checked={item.done} onChange={() => commit({ ...state, goals: state.goals.map(other => other.id === item.id ? { ...other, done: !other.done } : other) }, 'goal_checked')} /><span className={item.done ? 'done' : ''}>{item.text}</span></label><button aria-label={`Remove goal: ${item.text}`} onClick={() => { commit({ ...state, goals: state.goals.filter(other => other.id !== item.id) }); setStatus('Goal removed.'); }}>×</button></li>)}</ul>
            {!monthlyGoals.length && <p className="empty">Start with one goal, or add a planning prompt below. Nothing is assigned automatically.</p>}
            <details><summary>Planning prompts</summary><p>These are general planning reminders, not a verified monthly route.</p>{PROMPTS.map(text => <button className="prompt" key={text} onClick={() => addGoal(text)}>+ {text}</button>)}</details>
          </div><aside className="priority-panel"><h3>Your priority links</h3>{state.favorites.length ? SOCIAL_LINKS.filter(link => state.favorites.includes(link.id)).map(link => <div className="priority-item" key={link.id}><span>{link.arcana}</span><strong>{state.ranks[link.id]}/10</strong>{link.statGate && state.stats[link.statGate.stat] < link.statGate.rank && <small>{link.statGate.stat} needs rank {link.statGate.rank}</small>}</div>) : <p>Bookmark links in the Social Links view to keep your priorities here.</p>}<p className="small-note">Changing months keeps previous checklists. Unfinished goals stay in their original month.</p></aside></div>
        </section>}

        {tab === 'backup' && <section className="backup-panel" aria-labelledby="backup-title"><h2 id="backup-title">Keep a copy of your playthrough.</h2><p>Your progress lives in this browser. It does not sync automatically. Download a backup, move the file to your other device, and import it there.</p><button className="primary" onClick={download}><Download size={18} /> Download Reload save</button>
          <div className="import-box"><h3>Import a Reload save</h3><p>Import replaces this tracker’s progress and keeps one previous save for recovery. Royal, Portable, FES and Episode Aigis saves are not compatible.</p><label className="file-label"><Upload size={17} /> Choose a backup file<input type="file" accept=".json,.txt" onChange={importFile} /></label><details><summary>Or paste backup text</summary><textarea aria-label="Reload backup text" rows={5} maxLength={MAX_BYTES} value={importText} onChange={event => setImportText(event.target.value)} /><button disabled={!importText.trim()} onClick={() => applyImport(importText)}>Import pasted save</button></details><button className="restore" onClick={restore}>Restore previous import</button></div><p className="small-note">Local recovery is lost when browser data is cleared. Keep a downloaded backup too.</p></section>}
        <p className="status" role="status">{status}</p>

        <section className="support-panel"><div><Heart size={23} /><h2>Useful on your second screen?</h2><p>This tracker is free. Optional tips support fixes, content checks and updates.</p></div><div className="support-actions"><a className="primary" href="https://ko-fi.com/K3K11RWTSL" target="_blank" rel="noopener noreferrer" onClick={() => track('p3_support_click')}>Support on Ko-fi <ArrowRight size={17} /></a><button onClick={share}>Share the tracker</button></div></section>
        {shareFallback && <input aria-label="Public Reload tracker link" className="share-fallback" readOnly value={shareUrl} onFocus={event => event.target.select()} />}
        <footer><a href={`${BASE}games/`}><ArrowLeft size={15} /> All game companions</a><p>Unofficial Persona 3 Reload fan tool. Not affiliated with ATLUS or SEGA. Character names and source guides can contain spoilers.</p><details><summary>Sources and scope</summary><p>Ranks and stat requirements were checked against the guides below. This is a progress tracker, not a full availability calendar, dialogue guide, or perfect-run guarantee. Episode Aigis is not covered.</p><ul>{SOURCES.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></details><p>Umami measures visits and feature use. Save contents, goal text and character ranks are not sent in events. <a href="https://github.com/zucram/P5Tracker/issues">Report a correction or request a feature</a>.</p></footer>
      </main>
    </div>
  );
}
