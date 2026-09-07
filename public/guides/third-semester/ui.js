import { checkRequirement } from './check.js';

const form = document.querySelector('#requirement-check');
form.hidden = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(form);
  const result = checkRequirement(Number(values.get('rank')), values.get('period'));
  document.querySelector('#check-title').textContent = result.title;
  document.querySelector('#check-text').textContent = result.text;
  document.querySelector('#check-result').hidden = false;
  try {
    window.umami?.track('guide_check_used', { guide: 'third-semester' })?.catch?.(() => {});
  } catch { /* The answer remains available if analytics fails. */ }
});
