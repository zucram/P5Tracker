function KeyboardCard({ children, className = '', onActivate, ...accessibility }) {
  return <div {...accessibility} tabIndex={0}
    className={`${className} min-h-11 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    onClick={onActivate}
    onKeyDown={event => {
      if (event.target !== event.currentTarget || (event.key !== ' ' && event.key !== 'Enter')) return;
      event.preventDefault();
      if (!event.repeat) onActivate();
    }}>
    {children}
  </div>;
}

export function CheckableCard({ label, checked, onChange, ...props }) {
  return <KeyboardCard {...props} role="checkbox" aria-label={label} aria-checked={Boolean(checked)} onActivate={onChange} />;
}

export function DisclosureCard({ label, expanded, onChange, ...props }) {
  return <KeyboardCard {...props} role="button" aria-label={label} aria-expanded={Boolean(expanded)} onActivate={onChange} />;
}
