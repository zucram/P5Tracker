# Reload beta calendar evidence

Reviewed 7 September 2026. This reference defines the subset that the beta planner can use. Source agreement is not an in-game test. The full research dataset remains `releaseReady: false`.

## Date and slot rules

The weekday calculation uses April 2009 through January 2010. April 22 is Wednesday, January 1 is Friday, and January 25 is Monday in the inspected [marendarade April route](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/april) and [HayateButler route](https://steamcommunity.com/sharedfiles/filedetails/?id=3152126765). Use UTC and inclusive `MM-DD` intervals. January sorts after December.

[calendar-rules.json](../knowledge/p3-reload/calendar-rules.json) contains separate school closures, exam preparation periods, link exceptions, extra meeting dates, fixed slots, conditional events, and opening requirements. A missing block does not prove that a slot is free.

The planner has two selectable slots. Its daytime slot covers ordinary daytime and after-school activity. A final morning exam does not consume that slot automatically.

| Period | Planner handling |
| --- | --- |
| May 18–22, July 14–17, October 13–16, December 14–18 | Suppress ordinary daytime and evening suggestions during exams. |
| May 23, October 17, December 19 | Final morning exam. Later slots remain candidates. |
| July 18 | Final morning exam and a story afternoon. Evening remains a candidate. |
| July 20–22 and November 17–19 | Trip schedule. Show dated trip tasks and invitations, without ordinary town suggestions. |
| July 23 and November 20 | Return-day afternoon is occupied. Evening candidates remain. |
| July 27–August 2 | Training and tournament occupy daytime. |
| August 10–14 | Summer-school and story schedule occupies both planning slots. |
| August 15 | Final summer-school day occupies daytime only. |
| September 18–20 | Story, storm, and illness occupy both slots. |
| November 24–26 | Career experience occupies both slots. |
| November 27 | Final career afternoon. Evening remains a candidate. |
| January 1 | New Year daytime event. Evening remains a candidate. |

The source locators for each block are in the JSON. [Lukaight's calendar](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81375/calendar) names fixed events, while the monthly marendarade and HayateButler routes distinguish return evenings and final exam afternoons. Lukaight's calendar is incomplete and sometimes conflicts with these routes. Omission from it is never proof of a free slot or unavailable episode.

## School links and openings

Ordinary school meetings stop during vacations and the week before exams, with Empress exempt from the pre-exam closure. Emperor has a separate November 3–29 absence. Hermit has dated holiday opportunities in addition to Sundays. These rules come from the [Social Links availability reference](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/social-links).

Apply closures to school links only. Summer phone invitations can grant affinity without a normal rank meeting. Moon already in progress is a town link, but its first meeting cannot begin in summer according to [Lukaight's introduction](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81375). Its summer exception therefore applies only at rank zero.

The reviewed opening dates added to the facts are Priestess June 19, Justice May 7, Strength April 24, and Temperance May 6. Each still requires its introductions and existing stat gates. A player-confirmed opening or rank above zero establishes that the introduction was completed. It does not establish a rank-up today.

Moon's introduction requires Magician 3. The [Steam May 8 entry](https://steamcommunity.com/sharedfiles/filedetails/?id=3152126765) obtains the introduction before reaching Magician 4 that afternoon, resolving the conflicting rank-four claim. Charm 2, the quiz, and an Odd Morsel remain separate requirements.

Empress needs Academics 6 and at least one top exam result, starting November 21. Both the [dedicated Empress guide](https://www.neoseeker.com/persona-3-reload/guides/Empress_Social_Link) and marendarade's requirement agree. Do not reduce this to the stat alone.

Devil and Sun numeric introduction ranks remain disputed. Their established weekday patterns are separate facts. Use player-confirmed introductions, not the disputed number, to show a usual-schedule candidate. Devil also needs its payments and Charm 4. Sun needs the returned pen and Academics 4. Sources disagree on an August introduction versus the first rank, so the Sun baseline contains no definitive opening date.

Aeon on January 25 is a conservative omission from suggestions. Other school links remain candidates. The availability calendar omits Aeon that day and player reports agree, but this project has not verified the absence in game. This exception carries `reported-exception` status.

## Episodes and conditional days

An outer episode window is a reminder range. It does not promise a meeting on its last date. Previous episodes and separate setup conversations still apply. An incomplete predecessor makes a later episode a checklist item, not a ready activity.

Shinjiro's first episode requires the separate `le-shinjiro-introduction` checkmark for the Mitsuru conversation. That preparation has no asserted date bounds because her available days can differ from his. His fourth needs another conversation after episode three and the correct handling of the form. The [Linked Episodes reference](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/linked-episodes) distinguishes that setup from the time-consuming episode. November 18's invitation and November 19's trip event remain separate records.

Two closing-date conflicts were found during this review:

- Akihiko 4 ends December 22 in reference tables, but marendarade's [December route](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/december) performs it December 26 and Lukaight lists that date too.
- Junpei 3 ends November 11 in the table, but Lukaight lists November 13 as well.

Both records are now disputed. Their early targets can appear as labelled reminders. They cannot produce definitive expired warnings or automatically mark later episodes impossible.

December 24's accepted date, January 21's optional event, and a delayed first Tartarus visit require player state beyond the selected date. Their blocks remain conditional. An unknown condition produces an advisory, never an assertion that the player's afternoon is lost.

## Remaining limits

Tartarus floors, rescue deadlines, and author-selected dungeon visits are different facts. Block unlock dates and all nights without dungeon access have not been reconciled, so this beta must not promise that Tartarus is accessible on an arbitrary evening.

The planner does not know exact affinity points, every rank-specific absence, all episode meeting dates, or every optional scene already triggered. It can suggest a usual-schedule link and explain preparation or upcoming risks. It cannot guarantee the next rank, an optimal route, or completion of every link.

Structural validation and scenario tests can check these rules. Only route comparison and representative game saves can establish wider gameplay accuracy. The release must retain these limits and invite corrections with the player's date and relevant progress.
