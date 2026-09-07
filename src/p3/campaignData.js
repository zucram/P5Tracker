import opportunities from '../../knowledge/p3-reload/social-opportunities.json' with { type: 'json' };
import fragments from '../../knowledge/p3-reload/twilight-fragments.json' with { type: 'json' };
import shopping from '../../knowledge/p3-reload/tv-shopping.json' with { type: 'json' };
import bonding from '../../knowledge/p3-reload/party-bonding.json' with { type: 'json' };
import achievements from '../../knowledge/p3-reload/achievements.json' with { type: 'json' };

export const DORM_ACTIVITY_IDS = bonding.members.flatMap(member => member.activities.map(activity => activity.id));
export const ROMANCE_LINK_IDS = ['priestess', 'empress', 'lovers', 'justice', 'strength', 'aeon'];
export const COLLECTION_SECTIONS = [
  { id: 'fragments', title: 'Twilight Fragments', description: 'The 17 fixed town locations for Eagle Eye. Mark each after collecting it. Random fragments and Elizabeth rewards are additional sources.', entries: fragments.entries },
  { id: 'social-opportunities', title: 'Invitations, films & walks', description: 'Optional opportunities depend on story and Social Link progress. These are alternatives for affinity or extra scenes; they are not extra free time alongside a scheduled rank meeting.', entries: opportunities.entries },
  { id: 'tv-shopping', title: 'TV shopping', description: 'Check the dorm television on the purchase date. A checkmark records the order, not delivery or an Elizabeth request turn-in.', entries: shopping.entries },
  { id: 'achievements', title: 'Achievements & trophies', description: '48 main-campaign achievements. PlayStation also awards a platinum for this set. Mark awards from your game; tracker checkmarks do not unlock achievements.', entries: achievements.entries },
];
export const COLLECTION_IDS = COLLECTION_SECTIONS.flatMap(section => section.entries.map(entry => entry.id));
