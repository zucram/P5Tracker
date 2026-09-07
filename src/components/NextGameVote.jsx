import { useRef, useState } from 'react';

const GAMES = ['Persona 4 Golden', 'Persona 5', 'Metaphor: ReFantazio', 'Another Persona edition'];
const STORAGE_KEY = 'p5tracker-next-game-interest';

export function NextGameVote() {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const [selection, setSelection] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return GAMES.includes(saved) ? saved : '';
    } catch {
      return '';
    }
  });
  const sending = useRef(false);

  async function vote(game) {
    if (sending.current || selection) return;
    if (!window.umami?.track) {
      setStatus('Voting is unavailable. You can suggest a game through Support & Feedback below.');
      return;
    }
    sending.current = true;
    setPending(true);
    setStatus('Sending your suggestion…');
    try {
      await window.umami.track('next_game_interest', { game });
      setSelection(game);
      try {
        localStorage.setItem(STORAGE_KEY, game);
      } catch {
        // The suggestion still succeeds when browser storage is unavailable.
      }
      setStatus(`Thanks for suggesting ${game}. This helps us choose what to explore next.`);
    } catch {
      setStatus('Your suggestion could not be sent. Try Support & Feedback below.');
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  return (
    <section className="mt-12 rounded-2xl border border-neutral-800 p-5" aria-labelledby="next-game-title">
      <h2 id="next-game-title" className="text-lg font-bold text-white">Which game would you use a tracker for next?</h2>
      <p className="mt-2 text-sm text-neutral-400">We are exploring more Persona games and Metaphor. The games below do not have trackers yet. Suggestions use Umami analytics.</p>
      <p className="mt-2 text-sm text-neutral-300"><a className="text-sky-300 underline" href={`${import.meta.env.BASE_URL}games/persona-3-reload/#planner`}>Persona 3 Reload is available now. Open the planner.</a></p>
      <div className="mt-4 flex flex-wrap gap-2">
        {GAMES.map(game => <button type="button" key={game} disabled={pending || Boolean(selection)} aria-pressed={selection === game} onClick={() => vote(game)} className="rounded-lg border border-neutral-600 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:cursor-default disabled:opacity-60 aria-pressed:border-red-500 aria-pressed:bg-red-950">{game}</button>)}
      </div>
      <p role="status" className="mt-3 text-sm text-neutral-400">{status || (selection ? `Your suggestion on this browser: ${selection}. Thank you.` : '')}</p>
    </section>
  );
}
