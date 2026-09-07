const GUIDES = [
  { id: 'answers', path: 'guides/school-answers/', title: 'School and exam answers', description: 'Find Royal answers by date, month or exam.' },
  { id: 'deadline', path: 'guides/third-semester/', title: 'Maruki deadline check', description: 'Check the rank and deadline needed for the third semester.' },
  { id: 'monthly', path: 'guides/monthly-checklist/', title: 'Monthly planning guide', description: 'Use monthly goals to plan your own playthrough.' },
  { id: 'confidants', path: 'guides/confidant-tracker/', title: 'Confidant tracking guide', description: 'Record ranks, check stat requirements and back up progress.' },
  { id: 'games', path: 'games/', title: 'Game companions', description: 'See the available tracker and proposed next games.' },
];

const CONTEXT_GUIDES = {
  cheatsheet: ['monthly', 'answers', 'deadline'],
  months: ['answers', 'monthly'],
  confidants: ['deadline', 'confidants'],
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
            className="rounded-xl border border-neutral-700 px-3 py-3 text-sm text-neutral-200 transition-colors hover:border-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">
            <span className="font-semibold">{guide.title}<span aria-hidden="true"> →</span></span>
            {expanded && <span className="mt-1 block text-xs leading-relaxed text-neutral-400">{guide.description}</span>}
          </a>
        ))}
      </div>
    </nav>
  );
}
