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

## Warning logic and Strength requests in 2.6.11

The stat warnings had a separate data source from the displayed notes. `socialStats.js` now matches the reviewed Lovers/Hermit rank-2 gates and the absent Devil/Tower gates. Justice rank 3 requires both Knowledge 3 and Charm 3; rank 7 requires Knowledge 4. Iwai's Guts-5 check occurs at the rank-7 follow-up on the way to rank 8. Evidence: [RPG Site Justice guide](https://www.rpgsite.net/feature/9601-persona-5-royal-akechi-confidant-guide-justice-choices-unlocks), [aqiu384's Royal walkthrough](https://aqiu384.github.io/megaten-database/p5r/ace-walkthrough), specifically its Justice rank-3 and Hanged rank-7.1 entries. Requirements are advisory and do not prevent recording ranks from the player's game.

The [RPG Site Strength guide](https://www.rpgsite.net/feature/5486-persona-5-royal-strength-confidant-fusion-solutions-guide) identifies Neko Shogun with Dekaja at rank 6, Lachesis with Tetraja at rank 7 and Bugs with Samarecarm at rank 9. The previous Dakini and Pazuzu entries were incorrect. This change checks the ten requested Persona/skill pairs, without adopting or asserting specific fusion recipes. The UI now renders those existing string entries rather than incorrectly reporting missing data. Haru's second, separately written tip now also uses October 30.


## Reference notes in 2.6.12

The Royal registry's 232 normalized names, base levels and Arcana matched [Chinhodado's Royal data](https://github.com/chinhodado/persona5_calculator/blob/802422dad1f5b9eee441e594e738aceaeb9e5a85/data/PersonaDataRoyal.js) in a local comparison. Rare/special/DLC flags were compared where that source defines them. This is an independent-source comparison, not in-game validation of every field. The separate legacy Treasure Demon reference now includes Orichalcum (Faith, level 60, Bless weakness), matching all nine rare registry entries; that separate data table is not currently rendered in the app.

The same source corrects Berith's Gun immunity and Fire resistance, Take-Minakata's Elec/Curse resistance and Psy weakness, Isis's Bless immunity without Curse immunity, Matador's native Psy skills and Trumpeter learning Debilitate at 65. Captain Kidd is Ryuji's Persona, not Kamoshida's boss. The [Jose reference](https://megatenwiki.com/wiki/Jose) confirms that Crystal-to-Ring upgrades require the corresponding Palace's destruction, so Shido's strategy no longer asks for the Ring of Pride beforehand. Higher Baton Pass ranks and Merciless difficulty are presented as options rather than mandatory unlocks.

[Jazz Jin's schedule](https://megatenwiki.com/wiki/Jazz_Jin), [aqiu384's Royal walkthrough](https://aqiu384.github.io/megaten-database/p5r/ace-walkthrough) and [Omoteura's Royal cocktail list](https://omoteura.com/persona5/the-royal/jazz-club-cocktail.html) identify August 14 Marakunda, August 28 Masukunda, January 15 Ali Dance, January 22 Arms Master and January 29 Spell Master. Corrected entries retain their original task IDs; the missing Spell Master gets a new ID. The tests also cover the retained September Charge/Concentrate and December Debilitate dates.

The [Royal activities reference](https://aqiu384.github.io/megaten-database/p5r/overworld.html) identifies Speed Reader at the Shujin library from July 1 and Aojiru's rotating stock. Notes now distinguish carrying a matching-Arcana Persona from equipping it, and SP Adhesive 3's seven SP per battle turn from unlimited SP. The calculator link opens the Royal version and the walkthrough uses its current canonical route. These changes do not establish that every remaining external resource or legacy strategy is correct.


## Strength reference in 2.6.13

`royalStrength.js` owns the ten request pairs used by the app and new static guide. For each request it records an Electric Chair donor and whether the required result is the normal `item` or alarm `itemr` value in the pinned Royal calculator data. All ten were checked against that source and the separate [P5R Guide card table](https://p5rguide.neocities.org/strength). The latter contains an inconsistent late-December deadline and a Clotho level discrepancy; neither is adopted. The new guide does not publish a last-day recommendation.

Four fixed group ingredient lists come from [Data5Royal.js](https://github.com/chinhodado/persona5_calculator/blob/802422dad1f5b9eee441e594e738aceaeb9e5a85/data/Data5Royal.js). Jack Frost's Mabufu at 12, Eligor's native Tarukaja, Anzu's Dekaja at 28 and Hariti's Samarecarm at 41 come from the pinned Persona data. Bugs' request unlock and Strength rank-8 group-fusion expansion are also described by [RPG Site's Strength guide](https://www.rpgsite.net/feature/5486-persona-5-royal-strength-confidant-fusion-solutions-guide). The page deliberately links to a configured Royal calculator for ordinary recipes rather than asserting DLC-independent two-Persona results.

Card methods require the Electric Chair, a Blank Card and the donor; alarm methods can be affected by accidents. These requirements appear before the list. The guide is a searchable reference, not a complete early-game completion route or fresh in-game verification. Its tests guard card mode, registry identity, fixed ingredients and the shared app request sequence.


## Treasure Demon weaknesses in 2.6.15

The nine existing affinity entries match the Royal calculator's `wk` positions: Regent Nuclear, Queen's Necklace Psy, Stone of Scone Fire, Koh-i-Noor Gun, Orlov Curse, Emperor's Amulet Elec, Hope Diamond Ice, Crystal Skull Wind and Orichalcum Bless. The [Samurai Gamers comparison table](https://samurai-gamers.com/persona-5/treasure-persona-get-mechanics/) corroborates these Royal-specific weaknesses and base levels. Arcana are checked against the pinned calculator data. The internal label `Psi` becomes `Psy` for the damage type; no saved Persona names or IDs change.

The new public guide intentionally does not publish spawn locations. Legacy notes and community reports disagree about some late-game areas, and a table entry is not evidence of a guaranteed encounter. The separate legacy location/tip fields remain outside this guide and the registry UI. Recruitment notes distinguish Hold Up conversation from ordinary personality-answer negotiation. Calculator guidance identifies current level and enabled DLC as inputs rather than promising a fixed result from the base-level list.

The guide and registry both display weaknesses from `PERSONA_DATA.treasureDemons`. A regression check protects all nine reviewed values, and browser checks confirm the public table and saved registry handoff. This remains a source comparison, not a fresh in-game verification.
