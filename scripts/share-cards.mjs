import { GUIDE_DIRECTORY } from '../src/data/guideDirectory.js';

export const SHARE_CARDS = [
  { path: '', key: 'home', game: 'both', title: 'Play at your own pace.', subtitle: 'Free trackers and guides for Royal and Reload' },
  { path: 'p5/', key: 'royal', game: 'royal', title: 'Your next month.\nYour own route.', subtitle: 'Monthly goals · Confidants · School answers' },
  { path: 'p3/', key: 'reload', game: 'reload', title: 'Plan the month.\nKeep playing.', subtitle: 'Social Links · Requests · Fusion · Deadlines' },
  { path: 'guides/', key: 'guides', game: 'both', title: 'Find your next answer.', subtitle: 'Search Royal and Reload guides by game or topic' },
  ...GUIDE_DIRECTORY.map(guide => ({ path: `guides/${guide.slug}/`, key: guide.slug, game: guide.game, title: guide.title, subtitle: guide.game === 'royal' ? 'Free Royal guide · Open it while you play' : 'Free Reload guide · Main campaign' })),
].map(card => ({ ...card, alt: `${card.game === 'both' ? 'Persona Trackers' : card.game === 'royal' ? 'Persona 5 Royal' : 'Persona 3 Reload'}: ${card.title.replaceAll('\n', ' ')} ${card.subtitle}` }));

export function shareImageMeta(canonical) {
  const card = SHARE_CARDS.find(card => canonical === `https://zucram.github.io/P5Tracker/${card.path}`);
  if (!card) throw new Error(`Missing share card for ${canonical}`);
  const image = `https://zucram.github.io/P5Tracker/social/${card.key}.png`;
  const alt = card.alt.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  return `<meta property="og:image" content="${image}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${alt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${alt}">`;
}
