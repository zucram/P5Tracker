// Persona 3 Reload main campaign only. See docs/p3-reload-data.md.
export const SOURCES = [
  { id: 'reload-links', title: 'Persona 3 Reload social links, marendarade on GameFAQs', url: 'https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/social-links' },
  { id: 'reload-roster', title: 'Persona 3 Reload social link information, Neoseeker', url: 'https://www.neoseeker.com/persona-3-reload/guides/Social_Links' },
  { id: 'reload-stats', title: 'Persona 3 Reload social stats, Neoseeker', url: 'https://www.neoseeker.com/persona-3-reload/guides/Social_Stats' },
  { id: 'reload-chart', title: 'Persona 3 Reload social link chart, Weiner_johnson on GameFAQs', url: 'https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81489' },
  { id: 'reload-empress', title: 'Persona 3 Reload Empress social link, Neoseeker', url: 'https://www.neoseeker.com/persona-3-reload/guides/Empress_Social_Link' },
  { id: 'reload-tower', title: 'Persona 3 Reload Tower social link, Neoseeker', url: 'https://www.neoseeker.com/persona-3-reload/guides/Tower_Social_Link' },
];

export const SOCIAL_STATS = ['Academics', 'Charm', 'Courage'];

export const MONTHS = [
  { id: 'april', name: 'April' },
  { id: 'may', name: 'May' },
  { id: 'june', name: 'June' },
  { id: 'july', name: 'July' },
  { id: 'august', name: 'August' },
  { id: 'september', name: 'September' },
  { id: 'october', name: 'October' },
  { id: 'november', name: 'November' },
  { id: 'december', name: 'December' },
  { id: 'january', name: 'January' },
];

export const SOCIAL_LINKS = [
  { id: 'fool', arcana: 'Fool', name: 'SEES', kind: 'story', note: 'Ranks follow story events and choices.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'magician', arcana: 'Magician', name: 'Kenji Tomochika', kind: 'school', note: 'The first rank is automatic. Later ranks require time together.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'priestess', arcana: 'Priestess', name: 'Fuuka Yamagishi', kind: 'school', note: 'Also requires the Fortune link and story progress.', statGate: { stat: 'Courage', rank: 6 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'empress', arcana: 'Empress', name: 'Mitsuru Kirijo', kind: 'school', note: 'Opens late in the story. Check the linked guide for other conditions.', statGate: { stat: 'Academics', rank: 6 }, sourceIds: ['reload-links', 'reload-empress'] },
  { id: 'emperor', arcana: 'Emperor', name: 'Hidetoshi Odagiri', kind: 'school', note: 'Join the student council.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'hierophant', arcana: 'Hierophant', name: 'Bunkichi and Mitsuko', kind: 'daytime', note: 'Visit the bookstore and bring a persimmon leaf.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'lovers', arcana: 'Lovers', name: 'Yukari Takeba', kind: 'school', note: 'Story progress is required before this link opens.', statGate: { stat: 'Charm', rank: 6 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'chariot', arcana: 'Chariot', name: 'Kazushi Miyamoto', kind: 'school', note: 'Join the track team.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'justice', arcana: 'Justice', name: 'Chihiro Fushimi', kind: 'school', note: 'Start Emperor, then speak with Chihiro on several occasions.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'hermit', arcana: 'Hermit', name: 'Maya', kind: 'daytime', note: 'Play the online game on Sundays or available holidays.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'fortune', arcana: 'Fortune', name: 'Keisuke Hiraga', kind: 'school', note: 'Join the art club when it becomes available.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'strength', arcana: 'Strength', name: 'Yuko Nishiwaki', kind: 'school', note: 'Develop Chariot and invite Yuko to walk home.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'hanged-man', arcana: 'Hanged Man', name: 'Maiko Oohashi', kind: 'daytime', note: 'Bring Weird Takoyaki and Mad Bull to the shrine.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'death', arcana: 'Death', name: 'Mysterious boy', kind: 'story', note: 'Ranks advance through story events.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'temperance', arcana: 'Temperance', name: 'Bebe', kind: 'school', note: 'Meet Bebe through Hierophant before visiting the sewing club.', statGate: { stat: 'Academics', rank: 2 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'devil', arcana: 'Devil', name: 'President Tanaka', kind: 'evening', note: 'Requires Hermit progress and payments across several meetings.', statGate: { stat: 'Charm', rank: 4 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'tower', arcana: 'Tower', name: 'Mutatsu', kind: 'evening', note: 'Requires Strength progress and helping the Club Escapade bartender.', statGate: { stat: 'Courage', rank: 4 }, sourceIds: ['reload-links', 'reload-chart', 'reload-tower'] },
  { id: 'star', arcana: 'Star', name: 'Mamoru Hayase', kind: 'daytime', note: 'Meet him at the track competition first.', statGate: { stat: 'Courage', rank: 4 }, sourceIds: ['reload-links', 'reload-roster', 'reload-stats'] },
  { id: 'moon', arcana: 'Moon', name: 'Nozomi Suemitsu', kind: 'daytime', note: 'Requires Magician progress, a food quiz, and an Odd Morsel.', statGate: { stat: 'Charm', rank: 2 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'sun', arcana: 'Sun', name: 'Akinari Kamiki', kind: 'daytime', note: 'Requires Maiko progress and returning his pen. Meet on Sundays.', statGate: { stat: 'Academics', rank: 4 }, sourceIds: ['reload-links', 'reload-stats'] },
  { id: 'judgement', arcana: 'Judgement', name: 'Story progression', kind: 'story', note: 'After its story unlock, ranks follow Tartarus progress.', sourceIds: ['reload-links', 'reload-roster'] },
  { id: 'aeon', arcana: 'Aeon', name: 'Aigis', kind: 'school', note: 'Becomes available in January. Ranks require time together.', sourceIds: ['reload-links', 'reload-roster'] },
];
