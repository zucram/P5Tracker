export function WelcomeNotice({ onCalendar, onHelp, onDismiss }) {
  return <section aria-label="Getting started" className="mb-5 rounded-2xl border border-red-900 bg-neutral-900 p-4 md:p-5">
    <h2 className="text-base font-bold text-white">New to the tracker?</h2>
    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-300">Pick your month in Calendar and check off what you've done. Your progress stays in this browser. Use Sync to keep a backup.</p>
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button onClick={onCalendar} className="rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">Choose your month</button>
      <button onClick={onHelp} className="rounded-lg border border-neutral-600 px-4 py-3 text-sm text-white hover:border-white">How to use the tracker</button>
      <button onClick={onDismiss} className="px-3 py-3 text-sm text-neutral-300 underline hover:text-white">Dismiss</button>
    </div>
  </section>;
}
