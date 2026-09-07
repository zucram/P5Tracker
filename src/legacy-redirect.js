import { legacyDestination } from './lib/siteRoutes';
const target = legacyDestination(window.location, import.meta.env.BASE_URL);
if (target) window.location.replace(target);
