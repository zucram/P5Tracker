import './home.css';
import { legacyDestination } from './lib/siteRoutes';
import { trackerShareUrl } from './lib/shareUrl';
function redirectLegacyLink() {
  const target = legacyDestination(window.location, import.meta.env.BASE_URL);
  if (target) window.location.replace(target);
}
redirectLegacyLink();
window.addEventListener('hashchange', redirectLegacyLink);

const shareButton = document.querySelector('#share-site');
const status = document.querySelector('#share-status');
const fallback = document.querySelector('#share-url');
shareButton?.addEventListener('click', async () => {
  const url = trackerShareUrl();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Persona Trackers', text: 'Free monthly guides and trackers for Persona 5 Royal and Persona 3 Reload.', url });
      status.textContent = 'Share dialog completed.';
    } else {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Link copied.';
    }
    try { window.umami?.track('hub_share_complete', { method: navigator.share ? 'native' : 'clipboard' })?.catch?.(() => {}); } catch { /* Sharing still works without analytics. */ }
  } catch (error) {
    if (error?.name === 'AbortError') return;
    fallback.hidden = false;
    fallback.value = url;
    fallback.focus(); fallback.select();
    status.textContent = 'Copy the link below.';
  }
});
