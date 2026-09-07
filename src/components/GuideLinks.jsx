import { trackEvent } from '../lib/analytics';

const GUIDES = [
  { id: 'directory', path: 'guides/', title: 'All guides and answer tools', description: 'Find a Royal or Reload guide by game or topic.' },
  { id: 'persona-3-reload', path: 'p3/', title: 'Persona 3 Reload tracker', description: 'Plan your month with Social Links and missable deadlines.' },
  { id: 'school-answers', path: 'guides/school-answers/', title: 'School and exam answers', description: 'Find Royal answers by date, month or exam.' },
  { id: 'persona-5-royal-crossword-answers', path: 'guides/persona-5-royal-crossword-answers/', title: 'Crossword answers', description: 'Search all 38 Leblanc puzzles by clue or number.' },
  { id: 'third-semester', path: 'guides/third-semester/', title: 'Maruki deadline check', description: 'Check the rank and deadline needed for the third semester.' },
  { id: 'monthly-checklist', path: 'guides/monthly-checklist/', title: 'Palace deadlines and planning', description: 'Check Palace route, calling-card and boss deadlines.' },
  { id: 'confidant-tracker', path: 'guides/confidant-tracker/', title: 'Confidant tracking guide', description: 'Record ranks, check stat requirements and back up progress.' },
  { id: 'games', path: '', title: 'All games', description: 'Choose the Persona 5 Royal or Persona 3 Reload tracker.' },
];

const CONTEXT_GUIDES = {
  cheatsheet: ['monthly-checklist', 'school-answers', 'third-semester'],
  months: ['school-answers', 'persona-5-royal-crossword-answers', 'monthly-checklist'],
  confidants: ['third-semester', 'confidant-tracker'],
};

export function GuideLinks({ view }) {
  const expanded = view === 'more' || view === 'library_view';
  const ids = CONTEXT_GUIDES[view];
  if (!expanded && !ids) return null;
  const guides = expanded ? GUIDES : GUIDES.filter(guide => ids.includes(guide.id));

  return (
    <nav aria-label="P5 Tracker guides" className="mb-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 md:p-5">
      <h2 className="mb-3 text-sm font-bold text-white">Guides and tools</h2>
      <div className={expanded ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-wrap gap-2'}>
        {guides.map(guide => (
          <a key={guide.id} href={`${import.meta.env.BASE_URL}${guide.path}`}
            onClick={() => trackEvent('guide_opened', { guide: guide.id, location: view })}
            className="rounded-xl border border-neutral-700 px-3 py-3 text-sm text-neutral-200 transition-colors hover:border-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
            <span className="font-semibold">{guide.title}<span aria-hidden="true"> →</span></span>
            {expanded && <span className="mt-1 block text-xs leading-relaxed text-neutral-400">{guide.description}</span>}
          </a>
        ))}
      </div>
    </nav>
  );
}
