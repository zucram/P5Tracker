export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function lookupForm({ guide, label, placeholder, noun = 'entries', options = [], categoryLabel = 'Show' }) {
  const esc = escapeHtml;
  return `<form class="lookup" data-lookup-form data-lookup-guide="${esc(guide)}" data-lookup-noun="${esc(noun)}" role="search" aria-label="${esc(label)}" hidden>
<label for="guide-search">${esc(label)}<input id="guide-search" type="search" placeholder="${esc(placeholder)}" autocomplete="off"></label>
${options.length ? `<label for="guide-category">${esc(categoryLabel)}<select id="guide-category"><option value="">All ${esc(noun)}</option>${options.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('')}</select></label>` : ''}
<button type="button" data-lookup-clear>Clear filters</button><p class="lookup-note">Search stays on this page. It does not change your tracker progress.</p></form>
<p data-lookup-count role="status" aria-live="polite" aria-atomic="true"></p><p data-lookup-empty hidden>No matches. Try a shorter search or clear the filters.</p>`;
}
