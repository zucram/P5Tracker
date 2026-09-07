# Royal requirement review

Reviewed September 7, 2026 for release 2.6.8. These are targeted corrections, not a full Royal data audit or in-game playthrough verification.

| Entry | Current guidance | Evidence |
| --- | --- | --- |
| Briefing | Councillor rank 9 is the confidant requirement for the third semester. Later story choices still matter. | [RPG Site endings guide](https://www.rpgsite.net/feature/9612-persona-5-royal-endings-guide-interrogation-answers-how-to-get-the-true-ending), [Councillor guide](https://www.rpgsite.net/feature/9598-persona-5-royal-maruki-confidant-choices-guide-the-councillor). |
| Justice | Rank 8 is a goal for extra character content with additional dialogue conditions. | [RPG Site Justice guide](https://www.rpgsite.net/feature/9601-persona-5-royal-akechi-confidant-guide-justice-choices-unlocks). |
| Faith | Rank 5 permits later confidant progression. It does not unlock the semester. December 22 is the cutoff used by the tracker; December 18 is an early reminder. | [RPG Site Faith guide](https://www.rpgsite.net/feature/9599-persona-5-royal-kasumi-confidant-guide-faith-choices-romance-gifts), [Megami Tensei Wiki's deadline description](https://megamitensei.fandom.com/wiki/Confidant/Sumire_Yoshizawa). |
| Faith rank 10 | Requires a further meeting, rather than automatic story advancement. | The same Faith guide lists a rank-10 meeting and its branches. |

`src/data/gameData.js` owns the displayed targets and dates. `RoyalRequirements.jsx` separates them by purpose. `src/data/confidantData.js` owns the rank-guide note. The date task IDs `dec_faith` and `d2` remain stable so saved checkmarks remain associated with their original planning and deadline entries. The correction does not claim that enough meetings remain in any individual save.

## Palace calendar review for 2.6.10

`src/data/palaceDeadlines.js` owns route, calling-card and heist dates for the eight mission Palaces, with source URLs on each record. The monthly guide renders those records and the app creates its existing deadline tasks from them. The December 24 Mementos sequence is not an ordinary calling-card mission and is outside that table.

| Palace | Previous app guidance | Reviewed route / card / heist |
| --- | --- | --- |
| Kamoshida | Route April 20; suggested clearing April 18 | April 29 / April 30 / May 1 |
| Madarame | Route June 4; suggested clearing May 20 | June 2 / June 3 / June 4; reach courtyard barrier by May 31 |
| Kaneshiro | Route July 9 | July 6 / July 7 / July 8 |
| Futaba | Route August 20; card August 21 | August 19 / August 20 / August 20 |
| Okumura | Route October 10; card October 11 | October 8 / October 9 / October 10 |
| Niijima | Route November 17, without prior-visit requirement | November 17 / November 18 / November 19; begin by November 16 |
| Shido | Route December 16, without later steps | December 16 / December 17 / December 17 |
| Maruki | Route February 2, without Mementos prerequisite | February 2 / February 2 evening / February 3; required Mementos section by February 1 |

The [Royal calendar](https://megatenwiki.com/wiki/Calendar_in_Persona_5_Royal) and Altema's [April](https://altema.jp/persona5r/april), [July](https://altema.jp/persona5r/july) and [October](https://altema.jp/persona5r/october) calendars corroborate the first, third and fifth sequences. [Omoteura's Royal Madarame guide](https://omoteura.com/persona5/the-royal/madarame-palace-chart.html) describes the May 31 courtyard, June 2 route and June 3 card checks. The final Royal prerequisite is described in [Maruki's Palace](https://megamitensei.fandom.com/wiki/Maruki%27s_Palace).

The general calendar lists August 18 for Futaba's route, while [Neoseeker's Royal July walkthrough](https://www.neoseeker.com/persona-5-royal/July) and [Sharbit's Royal Pyramid guide](https://jusgameguide.wordpress.com/2020/04/12/futabas-pyramid-2/) specify August 19 and explain the same-day card/heist. Use August 19 for the last route date and advise earlier completion. The public guide records the discrepancy. Neoseeker's relevant search-index excerpts were accessible; direct page fetches returned 403. Do not describe those as a fresh full-page review.

Early-clear strategies no longer give impossible completion dates. Existing deadline IDs remain unchanged. The new `may_pal_start` task adds the missing prerequisite in May rather than leaving every Madarame deadline until the June view. Tests cover exact dates, preserved task IDs and prerequisite dates. These checks verify the implementation of reviewed guidance, not the game itself.

## Confidant introductions for 2.6.10

- Ann starts through the story; Kindness 2 applies to rank 2. [RPG Site Lovers guide](https://www.rpgsite.net/feature/9381-persona-5-royal-ann-confidant-guide-lovers-choices-romance-gifts).
- Futaba starts automatically on August 31; Kindness 4 applies to rank 2. Her August planning target is now rank 1. [RPG Site Hermit guide](https://www.rpgsite.net/feature/9382-persona-5-royal-futaba-confidant-guide-hermit-choices-romance-gifts).
- Haru can start October 30; Proficiency 5 applies to rank 2. [RPG Site Empress guide](https://www.rpgsite.net/feature/9379-persona-5-royal-haru-confidant-guide-empress-choices-romance-gifts) and the Royal calendar's October 30 availability row.
- Ohya's introduction at Crossroads does not require Charm 3. [RPG Site Devil guide](https://www.rpgsite.net/feature/9387-persona-5-royal-ohya-confidant-guide-devil-choices-romance-gifts).
- September 4 introduces the request leading to Shinya, rather than automatically unlocking his confidant. Kindness 3 was an incorrect gate. [RPG Site Tower guide](https://www.rpgsite.net/feature/5475-persona-5-royal-oda-confidant-guide-tower-choices-unlock-list).

This remains a targeted audit. Other legacy calendar activities, gift lists, combat notes and dialogue answers have not all been revalidated in this review.
