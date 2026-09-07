import { APP_DATA } from '../data/gameData';
import { trackEvent } from '../lib/analytics';

export function RoyalRequirements({ ranks }) {
  return <section aria-labelledby="royal-requirements" className="rounded-3xl border border-red-800 bg-neutral-900 p-4 md:p-6">
    <h2 id="royal-requirements" className="text-base font-bold text-white">Third-semester planning</h2>
    {[['Required confidant', ['Councillor']], ['Extra character content', ['Justice', 'Faith']]].map(([label, arcanas]) => <div key={label} className="mt-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-red-400">{label}</h3>
      <div className="space-y-4">{arcanas.map(arcana => {
        const confidant = APP_DATA.confidants.find(entry => entry.arcana === arcana);
        const rank = ranks[arcana] || 0;
        return <div key={arcana}>
          <div className="flex flex-wrap justify-between gap-2 text-sm text-white"><strong>{confidant.name}</strong><span>Rank {rank} · goal {confidant.target}</span></div>
          <progress className="mt-2 h-2 w-full accent-red-500" aria-label={`${confidant.name} rank goal`} max={confidant.target} value={Math.min(rank, confidant.target)} />
          <p className="mt-1 text-xs leading-relaxed text-neutral-300">By {confidant.deadline}. {confidant.notes}</p>
        </div>;
      })}</div>
    </div>)}
    <a className="mt-5 inline-block text-sm text-red-300 underline" href={`${import.meta.env.BASE_URL}guides/third-semester/`} onClick={() => trackEvent('guide_opened', { guide: 'third-semester', location: 'requirements' })}>Check Maruki's deadline and rank requirement</a>
  </section>;
}
