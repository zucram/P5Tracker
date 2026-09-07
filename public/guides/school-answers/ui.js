import { normalizeLookup as normalize, matchesLookup } from '../lookup.js';

(() => {
  const form = document.getElementById('answer-filters');
  const month = document.getElementById('answer-month');
  const type = document.getElementById('answer-type');
  const search = document.getElementById('answer-search');
  const count = document.getElementById('answer-count');
  const noAnswers = document.getElementById('no-answers');
  const sections = [...document.querySelectorAll('[data-month-section]')];

  const rows = [...document.querySelectorAll('[data-answer]')].map(row => ({
    element: row,
    text: normalize(`${row.textContent} ${row.dataset.date} ${row.dataset.date.replace('-', '/')}`),
  }));
  let trackedFilterUse = false;
  const applyFilters = (userChange = false) => {
    const terms = normalize(search.value).split(' ').filter(Boolean);
    let visible = 0;
    rows.forEach(({ element, text }) => {
      const matches = (!month.value || element.dataset.month === month.value) && (!type.value || element.dataset.type === type.value) && matchesLookup(text, search.value);
      element.hidden = !matches;
      if (matches) visible++;
    });
    sections.forEach(section => { section.hidden = !section.querySelector('[data-answer]:not([hidden])'); });
    count.textContent = `${visible} of ${rows.length} dates shown.`;
    noAnswers.hidden = visible > 0;
    if (userChange && !trackedFilterUse && visible > 0 && (month.value || type.value || terms.length)) {
      trackedFilterUse = true;
      try {
        const tracking = window.umami?.track('school_answers_filtered', { guide: 'school-answers' });
        tracking?.catch?.(() => {});
      } catch { /* Filtering works when analytics is unavailable. */ }
    }
  };
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  month.addEventListener('change', () => applyFilters(true));
  type.addEventListener('change', () => applyFilters(true));
  search.addEventListener('input', () => applyFilters(true));
  document.getElementById('clear-filters').addEventListener('click', () => {
    form.reset();
    applyFilters();
    search.focus();
  });
  // Month links remain useful after a previous filter hid their target section.
  document.querySelectorAll('.month-links a').forEach(link => link.addEventListener('click', () => {
    form.reset();
    applyFilters();
  }));
  applyFilters();
})();
