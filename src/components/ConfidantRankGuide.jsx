import { confidantRankSteps } from '../lib/confidantGuide';

export function ConfidantRankGuide({ arcana, rank = 0 }) {
  return <section aria-label={`${arcana} next rank guide`}>
    <h5 className="mb-3 text-xs font-bold text-red-400">{rank >= 10 ? 'Confidant rank complete' : `${arcana === 'Strength' ? 'Fusion request' : 'Next rank guide'} · Rank ${rank + 1}`}</h5>
    <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      {confidantRankSteps(arcana, rank).map((step, index) => <p key={index} className="text-sm leading-relaxed text-neutral-300">{step}</p>)}
    </div>
  </section>;
}
