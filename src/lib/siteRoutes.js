const royalHashes = new Set(['briefing', 'calendar', 'confidants', 'metaverse', 'more', 'registry', 'reference']);

// Redirect only known legacy routes; never read or move either game's save data.
export function legacyDestination({ pathname, search = '', hash = '' }, base = '/P5Tracker/') {
  const path = pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const root = base.replace(/\/$/, '');
  let destination;
  if (path === `${root}/games/persona-3-reload`) destination = `${base}p3/`;
  else if (path === `${root}/games`) destination = base;
  else if (path === root && royalHashes.has(hash.slice(1))) destination = `${base}p5/`;
  return destination ? destination + search + hash : null;
}
