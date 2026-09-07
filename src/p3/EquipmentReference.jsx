import { useState } from 'react';
import equipment from '../../knowledge/p3-reload/equipment.json';
import './equipment-reference.css';

const sections = equipment.sections;
const allEntries = sections.flatMap(section => section.entries.map(entry => ({ ...entry, sectionId: section.id })));
const shopEntries = allEntries.filter(entry => entry.sectionId === 'shops');
const locationKinds = { heart: 'Persona heart items', enemy: 'Enemy drops', chest: 'Random Tartarus chests', fixed: 'Fixed items and rewards', request: 'Elizabeth request rewards', exchange: 'Other antique exchanges', shop: 'Shop stock' };
const dateLabel = date => date ? `${Number(date.slice(0, 2))}/${Number(date.slice(3))}` : 'Initial listed stock';
const cash = amount => Number.isFinite(amount) && amount > 0 ? `¥${amount.toLocaleString('en-US')}` : 'Price not listed';

function MaterialSources({ material, showSpoilers, onRecipe }) {
  const locations = equipment.materials[material.name] || [];
  return <details className="material-sources"><summary><strong>{material.name} ×{material.quantity}</strong> · Where to get it</summary>
    {!locations.length && <p>No acquisition location is recorded for this material.</p>}
    {Object.entries(locationKinds).map(([kind, title]) => {
      const entries = locations.filter(location => location.kind === kind);
      if (!entries.length) return null;
      const sources = [...new Set(entries.flatMap(entry => entry.sourceIds))].map(id => equipment.sources[id]).filter(Boolean);
      return <details key={kind} className="material-location-group"><summary>{title} · {entries.length} listed {entries.length === 1 ? 'location' : 'locations'}</summary><ul>{entries.map((location, index) => <li key={`${kind}-${index}`}>
        <strong>{kind === 'heart' && !showSpoilers ? 'Persona name hidden' : kind === 'fixed' && location.spoiler && !showSpoilers ? 'Event or character reward hidden' : location.location}</strong>
        {location.name && <span> · {showSpoilers ? location.name : 'Enemy name hidden'}</span>}
        <p>{location.detail}{location.date ? ` · From ${dateLabel(location.date)}` : ''}</p>
        {location.recipeId && <button type="button" onClick={() => onRecipe(location.recipeId)}>Show this exchange</button>}
        {location.requestNumber && <a href="#requests">Open Elizabeth requests</a>}
      </li>)}</ul>{sources.length > 0 && <p className="equipment-source-links">{sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}</p>}</details>;
    })}
    <p className="small-note">Drops and random chest appearances are not guaranteed. A listed area does not establish when your party can reach it.</p>
  </details>;
}

function EntryDetails({ entry, showSpoilers, onRecipe }) {
  const shops = shopEntries.filter(shop => shop.itemId === entry.itemId && shop.priceYen > 0);
  const lowest = shops.length ? Math.min(...shops.map(shop => shop.priceYen)) : null;
  const cheapest = shops.filter(shop => shop.priceYen === lowest);
  return <div className="equipment-entry-body">
    <p>{entry.summary}{entry.date ? ` · Stock from ${dateLabel(entry.date)}` : ' · Initial listed stock; shop opening and story progress still apply.'}</p>
    {entry.conditional && <p>This stock has an additional game condition. Check the shop after relevant story or request progress.</p>}
    {entry.summary.startsWith('Kyoto') && <p>The hotel machines are accessible during the Kyoto school trip.</p>}
    {entry.wearer && <p>Equippable by: {entry.wearerSpoiler && !showSpoilers ? 'Character name hidden' : entry.wearer}</p>}
    {!!Object.keys(entry.stats).length && <dl className="equipment-stats">{Object.entries(entry.stats).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>}
    {entry.effects.length > 0 && <div className="equipment-effects"><h4>Effect</h4>{entry.effects.map(effect => <p key={effect}>{effect}</p>)}{entry.effectDetails && <p>{entry.effectDetails}</p>}</div>}
    {entry.effectUnknown && <p>The effect is not decoded in this reference.</p>}
    {entry.materials?.length > 0 && <section aria-label="Crafting materials"><h4>Materials</h4>{entry.materials.map(material => <MaterialSources key={material.itemId} material={material} showSpoilers={showSpoilers} onRecipe={onRecipe} />)}</section>}
    {entry.fixedLocations?.length > 0 && <details className="equipment-buy-locations"><summary>Fixed locations & rewards</summary><ul>{entry.fixedLocations.map((location, index) => <li key={index}>{location.spoiler && !showSpoilers ? 'Event or character reward hidden. Turn on reference spoilers for the location.' : location.location} · {location.detail}</li>)}</ul></details>}
    {lowest !== null && <details className="equipment-buy-locations"><summary>Lowest listed shop price: {cash(lowest)}</summary><ul>{cheapest.map(shop => <li key={shop.id}>{shop.summary} · {dateLabel(shop.date)}{shop.conditional ? ' · Additional condition applies' : ''}</li>)}</ul><p>Compares the catalog's cash prices before discounts. Later stock and shop access still apply.</p></details>}
    {entry.sectionId === 'antiques' && lowest === null && <p>No cash purchase location is listed in this shop catalog.</p>}
    <details className="equipment-source-links"><summary>Sources</summary><ul>{entry.sources.map(source => <li key={`${source.url}-${source.label}`}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
  </div>;
}


function EquipmentEntry({ entry, showSpoilers, onRecipe }) {
  const [open, setOpen] = useState(false);
  return <details className="equipment-entry" onToggle={event => { if (event.target === event.currentTarget) setOpen(event.currentTarget.open); }}><summary><strong>{entry.title}</strong><span>{entry.category} · {entry.sectionId === 'antiques' ? 'Materials exchange' : cash(entry.priceYen)}{entry.date ? ` · From ${dateLabel(entry.date)}` : ''}</span></summary>{open && <EntryDetails entry={entry} showSpoilers={showSpoilers} onRecipe={onRecipe} />}</details>;
}

export function EquipmentReference({ showSpoilers = false }) {
  const [section, setSection] = useState('antiques');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [shop, setShop] = useState('all');
  const [page, setPage] = useState(0);
  const [focusedId, setFocusedId] = useState(null);
  const shown = allEntries.filter(entry => {
    if (focusedId) return entry.id === focusedId;
    const search = `${entry.title} ${entry.summary} ${entry.category} ${entry.requirements.join(' ')} ${entry.effects.join(' ')} ${showSpoilers ? entry.wearer || '' : ''}`.toLowerCase();
    return (section === 'all' || section === entry.sectionId) && (category === 'all' || category === entry.category) && (shop === 'all' || shop === entry.summary) && search.includes(query.toLowerCase());
  }).sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(shown.length / 20));
  const currentPage = Math.min(page, pageCount - 1);
  const change = (setter, value) => { setter(value); setPage(0); setFocusedId(null); };
  const lookupRecipe = id => { setFocusedId(id); setPage(0); };
  return <section className="equipment-reference" aria-label="Equipment crafting and shops"><h2>Equipment, crafting & shops</h2>
    <p>Find an item, compare its listed shop price, or expand a recipe to see where its materials come from. Mayoido Antiques opens July 18.</p>
    <div className="equipment-filters"><label>Search<input value={query} onChange={event => change(setQuery, event.target.value)} placeholder="Item, material, effect or shop" /></label><label>Section<select value={section} onChange={event => change(setSection, event.target.value)}><option value="all">All entries</option>{sections.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label>Item type<select value={category} onChange={event => change(setCategory, event.target.value)}><option value="all">All item types</option>{[...new Set(allEntries.map(entry => entry.category))].sort().map(name => <option key={name}>{name}</option>)}</select></label><label>Location<select value={shop} onChange={event => change(setShop, event.target.value)}><option value="all">All shops</option>{[...new Set(allEntries.map(entry => entry.summary))].sort().map(name => <option key={name}>{name}</option>)}</select></label></div>
    {focusedId && <p>Showing a linked exchange. <button onClick={() => setFocusedId(null)}>Return to filtered results</button></p>}
    <p className="equipment-count">{shown.length} matching entries. Alternative recipes remain separate. {showSpoilers ? '' : 'Character, Persona and enemy names are hidden in acquisition details.'}</p>
    <div className="equipment-results">{shown.slice(currentPage * 20, (currentPage + 1) * 20).map(entry => <EquipmentEntry key={entry.id} entry={entry} showSpoilers={showSpoilers} onRecipe={lookupRecipe} />)}</div>
    {!shown.length && <p>No entries match these filters.</p>}
    <div className="equipment-pagination"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage + 1} of {pageCount}</span><button disabled={currentPage + 1 >= pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></div>
    <p className="small-note">Stock dates come from game tables and do not override story closures or shop conditions. Initial-stock defaults are not opening dates. Material sources cover the listed recipes, without promising every possible acquisition method.</p>
  </section>;
}
