const SITE = 'https://zucram.github.io/P5Tracker/';

export function trackerShareUrl(game = 'home') {
  const routes = { home: '', royal: 'p5/', reload: 'p3/' };
  if (!Object.hasOwn(routes, game)) throw new Error('Unknown tracker share destination');
  const url = new URL(routes[game], SITE);
  url.searchParams.set('utm_source', 'app');
  url.searchParams.set('utm_medium', 'share');
  url.searchParams.set('utm_campaign', 'player_referral');
  return url.href;
}
