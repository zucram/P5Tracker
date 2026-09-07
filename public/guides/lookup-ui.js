import { matchesLookup } from './lookup.js';

const form = document.querySelector('[data-lookup-form]');
const items = [...document.querySelectorAll('[data-lookup-item]')];
const groups = [...document.querySelectorAll('[data-lookup-group]')];
const search = form?.querySelector('input[type="search"]');
const category = form?.querySelector('select');
const count = document.querySelector('[data-lookup-count]');
const empty = document.querySelector('[data-lookup-empty]');
let measured = false;

function filter(userChange = false) {
  if (!form) return;
  const active = Boolean(search.value.trim() || category?.value);
  let visible = 0;
  for (const item of items) {
    item.hidden = !matchesLookup(item.dataset.lookupText || item.textContent, search.value, item.dataset.lookupNumber)
      || Boolean(category?.value && item.dataset.lookupCategory !== category.value);
    if (!item.hidden) visible++;
  }
  for (const group of groups) group.hidden = active && !group.querySelector('[data-lookup-item]:not([hidden])');
  for (const intro of document.querySelectorAll('[data-lookup-intro]')) intro.hidden = active;
  count.textContent = `${visible} of ${items.length} ${form.dataset.lookupNoun || 'entries'} shown.`;
  empty.hidden = visible > 0;
  if (userChange && !measured && visible && (search.value.trim() || category?.value)) {
    measured = true;
    try {
      window.umami?.track('guide_lookup_used', { guide: form.dataset.lookupGuide })?.catch?.(() => {});
    } catch { /* Lookups still work when analytics fails. */ }
  }
}

if (form && items.length) {
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  search.addEventListener('input', () => filter(true));
  category?.addEventListener('change', () => filter(true));
  form.querySelector('[data-lookup-clear]').addEventListener('click', () => {
    form.reset();
    filter();
    search.focus();
  });
  filter();
}

function revealFragment(hash = location.hash) {
  let id;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  // An index link must still work after a search has hidden its destination.
  if (form && (target.closest('[hidden]') || target.querySelector('[data-lookup-item][hidden]'))) {
    form.reset();
    filter();
  }
  for (let element = target; element; element = element.parentElement) {
    if (element.tagName === 'DETAILS') element.open = true;
  }
  target.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', () => revealFragment());
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  // A different fragment is handled by hashchange. Handle repeated links here
  // because clicking the current fragment does not emit another hashchange.
  if (link && link.getAttribute('href') === location.hash) revealFragment(location.hash);
});
revealFragment();
