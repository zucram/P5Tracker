import { useMemo, useState } from 'react';
import { PERSONAS, DLC_PERSONAS, availablePersonas, fusePersonas, recipesFor, getPersona, SOURCE_URL } from './fusion.js';
import { AffinityTable, SkillList } from './CombatReference.jsx';
import './combat-reference.css';

const EMPTY_DLC = Object.freeze([]);

function PersonaDetails({ persona, enabledDlc }) {
  const [showRecipes, setShowRecipes] = useState(false);
  const recipes = useMemo(() => showRecipes ? recipesFor(persona.id, enabledDlc) : [], [showRecipes, persona.id, enabledDlc]);
  return <div className="combat-entry-body"><AffinityTable resists={persona.resists} />
    <p>Strength {persona.stats[0]} · Magic {persona.stats[1]} · Endurance {persona.stats[2]} · Agility {persona.stats[3]} · Luck {persona.stats[4]}</p>
    {persona.unlock && <p><strong>Unlock requirement:</strong> {persona.unlock}</p>}
    {persona.dlc && <p>DLC required: {persona.dlc}</p>}
    {persona.heart && <p>Heart item: {persona.heart} · Level {persona.heartlvl}</p>}
    {persona.specialRecipe && <p><strong>Special fusion:</strong> {persona.specialRecipe.join(' + ')}</p>}
    <h4>Skills & learn levels</h4><SkillList skills={Object.keys(persona.skills)} learnLevels={persona.skills} />
    <button onClick={() => setShowRecipes(!showRecipes)} aria-expanded={showRecipes}>{showRecipes ? 'Hide' : 'Find'} fusion recipes</button>
    {showRecipes && <div><p>Recipes use the enabled DLC and base Persona levels. Fulfill the result's unlock requirement and check your protagonist's fusion level limit.</p>{recipes.length ? <ul>{recipes.map(recipe => <li key={recipe.ingredients.join('+')}>{recipe.ingredients.join(' + ')}{recipe.special ? ' · Special fusion' : ''}</li>)}</ul> : <p>No fusion recipe was found in the enabled pool.</p>}<p className="small-note">Up to eight ingredient combinations are shown. Skill inheritance and fusion accidents are not simulated.</p></div>}
    <p><a href={`${SOURCE_URL}/demon-data.json`} target="_blank" rel="noreferrer">Persona data source</a> · <a href="https://aqiu384.github.io/megaten-fusion-tool/p3r/personas" target="_blank" rel="noreferrer">Full fusion and skill calculator</a></p>
  </div>;
}

export function PersonaReference({ state = {}, commit, showSpoilers = false }) {
  const [query, setQuery] = useState('');
  const [arcana, setArcana] = useState('all');
  const [progress, setProgress] = useState('all');
  const enabledDlc = state.enabledDlcPersonas || EMPTY_DLC;
  const [page, setPage] = useState(0);
  const [ingredientA, setIngredientA] = useState('orpheus');
  const [ingredientB, setIngredientB] = useState('pixie');
  const pool = useMemo(() => availablePersonas(enabledDlc), [enabledDlc]);
  const registered = state.registeredPersonas || [];
  const result = fusePersonas(ingredientA, ingredientB, enabledDlc);
  const shown = pool.filter(persona => `${persona.name} ${persona.race} ${Object.keys(persona.skills).join(' ')}`.toLowerCase().includes(query.toLowerCase()) && (arcana === 'all' || persona.race === arcana) && (progress === 'all' || (progress === 'registered') === registered.includes(persona.id)));
  const pages = Math.max(1, Math.ceil(shown.length / 20));
  const currentPage = Math.min(page, pages - 1);
  function toggleDlc(id) { commit?.({ ...state, enabledDlcPersonas: enabledDlc.includes(id) ? enabledDlc.filter(item => item !== id) : [...enabledDlc, id] }, 'fusion_settings'); setPage(0); }
  function togglePersona(id) { commit?.({ ...state, registeredPersonas: registered.includes(id) ? registered.filter(item => item !== id) : [...registered, id] }, 'persona_registered'); }
  if (!showSpoilers) return <section className="campaign-reference panel"><h2>Persona registry & fusion</h2><p>Turn on reference spoilers to browse Persona names, unlock conditions, skills and recipes.</p></section>;
  return <section className="campaign-reference" aria-label="Persona registry and fusion"><h2>Persona registry & fusion</h2><p>{pool.filter(persona => registered.includes(persona.id)).length} of {pool.length} enabled Personas registered. Registration is your checklist, not an import of the game's compendium.</p>
    <details className="combat-entry"><summary>DLC settings · {enabledDlc.length} enabled</summary><div className="combat-entry-body"><p>Base game is selected by default. Enable the individual DLC Personas installed in your game; they change normal fusion results. These recipe settings are saved with your progress.</p><div className="dlc-options">{DLC_PERSONAS.map(persona => <label key={persona.id}><input type="checkbox" checked={enabledDlc.includes(persona.id)} onChange={() => toggleDlc(persona.id)} />{persona.name}<small>{persona.dlc}</small></label>)}</div></div></details>
    <details className="combat-entry"><summary>Two-Persona fusion calculator</summary><div className="combat-entry-body"><div className="reference-controls">{[[ingredientA, setIngredientA, 'First Persona'], [ingredientB, setIngredientB, 'Second Persona']].map(([value, setter, label]) => <label key={label}>{label}<select value={pool.some(persona => persona.id === value) ? value : ''} onChange={event => setter(event.target.value)}><option value="">Choose a Persona</option>{pool.map(persona => <option key={persona.id} value={persona.id}>{persona.name} · {persona.race} {persona.lvl}</option>)}</select></label>)}</div><p role="status">{result ? <><strong>{result.name}</strong> · {result.race} · Level {result.lvl}{result.unlock ? ` · Requires ${result.unlock}` : ''}</> : 'No result for this pair with the enabled DLC.'}</p><p className="small-note">Uses base levels from the registry. Raised ingredient levels do not change this calculation. Result unlocks and the protagonist's level still apply.</p></div></details>
    <div className="reference-controls"><label>Search<input value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} placeholder="Persona, arcana or skill" /></label><label>Arcana<select value={arcana} onChange={event => { setArcana(event.target.value); setPage(0); }}><option value="all">All arcana</option>{[...new Set(PERSONAS.map(persona => persona.race))].sort().map(name => <option key={name}>{name}</option>)}</select></label><label>Progress<select value={progress} onChange={event => { setProgress(event.target.value); setPage(0); }}><option value="all">All Personas</option><option value="registered">Registered</option><option value="missing">Not registered</option></select></label></div>
    <p>{shown.length} matches, sorted by name.</p><div className="reference-results">{shown.slice(currentPage * 20, (currentPage + 1) * 20).map(persona => <article className="persona-entry" key={persona.id}><label className="register-persona"><input type="checkbox" checked={registered.includes(persona.id)} onChange={() => togglePersona(persona.id)} disabled={!commit} aria-label={`Register ${persona.name}`} /></label><details className="combat-entry"><summary><strong>{persona.name}</strong><span>{persona.race} · Lv {persona.lvl}{persona.specialRecipe ? ' · Special' : ''}{persona.dlc ? ' · DLC' : ''}</span></summary><PersonaDetails persona={getPersona(persona.id)} enabledDlc={enabledDlc} /></details></article>)}</div>
    {!shown.length && <p>No Personas match these filters.</p>}
    <div className="reference-pagination"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage + 1} of {pages}</span><button disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>Next</button></div><p className="small-note">Main-campaign registry from <a href={SOURCE_URL} target="_blank" rel="noreferrer">aqiu384's public-domain fusion tool</a>. Story and link unlocks stay visible even when you have not completed them.</p>
  </section>;
}
