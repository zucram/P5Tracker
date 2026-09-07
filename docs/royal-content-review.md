# Royal requirement review

Reviewed September 7, 2026 for release 2.6.8. These are targeted corrections, not a full Royal data audit or in-game playthrough verification.

| Entry | Current guidance | Evidence |
| --- | --- | --- |
| Briefing | Councillor rank 9 is the confidant requirement for the third semester. Later story choices still matter. | [RPG Site endings guide](https://www.rpgsite.net/feature/9612-persona-5-royal-endings-guide-interrogation-answers-how-to-get-the-true-ending), [Councillor guide](https://www.rpgsite.net/feature/9598-persona-5-royal-maruki-confidant-choices-guide-the-councillor). |
| Justice | Rank 8 is a goal for extra character content with additional dialogue conditions. | [RPG Site Justice guide](https://www.rpgsite.net/feature/9601-persona-5-royal-akechi-confidant-guide-justice-choices-unlocks). |
| Faith | Rank 5 permits later confidant progression. It does not unlock the semester. December 22 is the cutoff used by the tracker; December 18 is an early reminder. | [RPG Site Faith guide](https://www.rpgsite.net/feature/9599-persona-5-royal-kasumi-confidant-guide-faith-choices-romance-gifts), [Megami Tensei Wiki's deadline description](https://megamitensei.fandom.com/wiki/Confidant/Sumire_Yoshizawa). |
| Faith rank 10 | Requires a further meeting, rather than automatic story advancement. | The same Faith guide lists a rank-10 meeting and its branches. |

`src/data/gameData.js` owns the displayed targets and dates. `RoyalRequirements.jsx` separates them by purpose. `src/data/confidantData.js` owns the rank-guide note. The date task IDs `dec_faith` and `d2` remain stable so saved checkmarks remain associated with their original planning and deadline entries. The correction does not claim that enough meetings remain in any individual save.
