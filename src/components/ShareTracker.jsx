import { useState } from 'react';

const SHARE_URL = 'https://zucram.github.io/P5Tracker/?utm_source=app&utm_medium=share&utm_campaign=player_referral';

function trackShare(method) {
  try {
    Promise.resolve(window.umami?.track('share_complete', { method })).catch(() => {});
  } catch {
    // Analytics failure must not turn a successful share into an error.
  }
}

export function ShareTracker() {
  const [status, setStatus] = useState('');
  const [manualCopy, setManualCopy] = useState(false);

  async function share() {
    setStatus('');
    setManualCopy(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'P5 Tracker', text: 'Monthly goals for Persona 5 Royal, without a rigid daily walkthrough.', url: SHARE_URL });
        setStatus('Share dialog completed.');
        trackShare('native');
      } else {
        await navigator.clipboard.writeText(SHARE_URL);
        setStatus('Link copied. Send it to a friend who plays Royal.');
        trackShare('clipboard');
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
      setManualCopy(true);
      setStatus('Copy the link below to share the tracker.');
    }
  }

  return (
    <div>
      <button type="button" onClick={share} className="rounded-xl border border-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-800">Share P5 Tracker with a friend</button>
      <p role="status" className="mt-2 text-sm text-neutral-400">{status}</p>
      {manualCopy && <input aria-label="Tracker sharing link" className="w-full max-w-xl bg-neutral-900 p-3 text-white" readOnly value={SHARE_URL} onFocus={event => event.target.select()} />}
    </div>
  );
}
