# Persona 3 Reload tracker data

`src/p3/data.js` describes the main campaign of Persona 3 Reload. It does not cover Persona 3, FES, Portable, or Episode Aigis. Initial roster review took place on 7 September 2026. The roster is used by the released beta semi-guide; see [release behavior and limits](p3-reload-release.md). See [the knowledge review](p3-reload-knowledge-review.md) for the broader research and release gaps.

The module exports 22 Social Links, three social stats, ten month labels from April through January, and the source list. Each link has `sourceIds` for its factual basis. Notes are original summaries, not dialogue or copied guide passages.

## Coverage

The roster and arcana match both [Neoseeker's Reload guide](https://www.neoseeker.com/persona-3-reload/guides/Social_Links) and [marendarade's Reload walkthrough](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81170/social-links). Both full pages were inspected in a browser. The GameFAQs walkthrough identifies version 1.0.0, updated 30 March 2024. Neoseeker's roster identifies an edit on 10 March 2024.

The `kind` field groups links by their usual activity context. It is not a daily availability calendar. School holidays, exams, story events, rescue events, and other conditions can prevent meetings.

Fool, Death, and Judgement are the three story-related links. Judgement advances with Tartarus progress after its story unlock. It does not advance solely because another day passes. Magician's initial rank is automatic, but later ranks need player time. Sun and Devil still require meetings even though the walkthrough lists no affinity-point requirement for their ranks.

Death uses the display name "Mysterious boy" and Judgement uses "Story progression" to avoid revealing story identities. Other names, including Aigis, remain in the data. This roster is not itself spoiler-free.

## Social-stat requirements

[Neoseeker's social-stat guide](https://www.neoseeker.com/persona-3-reload/guides/Social_Stats) confirms Academics, Charm, and Courage each have six ranks. The verified stat gates in this module are:

| Stat | Link and minimum rank |
| --- | --- |
| Academics | Temperance 2, Sun 4, Empress 6 |
| Charm | Moon 2, Devil 4, Lovers 6 |
| Courage | Tower 4, Star 4, Priestess 6 |

These gates describe only the social-stat condition. A met gate does not mean a link is available or unlocked. Notes point to additional introductions, story progress, items, or activities. Omitting `statGate` means this dataset has no social-stat gate recorded, not that the link can be started immediately.

## Source disagreements and limits

Neoseeker's overview and GameFAQs disagree on some prerequisite link ranks, including Devil and Sun. The module names the prerequisite relationship without encoding those disputed rank numbers.

Neoseeker's social-stat table lists Tower at Courage 2, but its [dedicated Tower guide](https://www.neoseeker.com/persona-3-reload/guides/Tower_Social_Link) requires Courage 4. The detailed GameFAQs walkthrough and [independent GameFAQs chart](https://gamefaqs.gamespot.com/pc/409941-persona-3-reload/faqs/81489) also specify 4. The module uses 4. Club entry and starting Mutatsu's link are separate conditions.

Both the detailed GameFAQs walkthrough and [Neoseeker's Empress guide](https://www.neoseeker.com/persona-3-reload/guides/Empress_Social_Link) list an exam result alongside max Academics. The tracker does not model exam results or enforce an exhaustive Empress unlock checklist. Its introduction details include the exam result and link to the source guide. No independent in-game save test was performed for this condition.

The month list is a set of planning buckets. It does not claim that the entire story ends in January. The roster module itself contains no daily schedules or deadlines. The separate planner combines it with the canonical knowledge facts and calendar rules; no required monthly rank targets or guarantee of completing every Social Link in one run are provided.

This review checks published original player walkthroughs against each other. It is not a fresh playthrough or verification against game code. The official ATLUS product page was attempted but could not be fetched through the web reader, and it is not cited as evidence for numerical requirements.

## Monthly reference datasets

Version 2.5.1 adds `knowledge/p3-reload/school-answers.json`, `activities.json` and `tartarus.json`. These retain source URLs and lookup locations per record and feed the tracker directly. The school-answer and activity tables also feed the static school-answer guide. They are supplemental datasets; the older facts/report counts do not include them.

The school dataset separates classroom questions, manual exam answers and automatic checks. May 18 is an automatic exam day, with the manual answers starting May 19. Stat rewards use internal points rather than displayed musical notes. Tartarus ranges distinguish a currently reachable barrier floor from the full block boundary. The January border is floor 256; floor 255 contains the preceding encounters.

`src/p3/monthGuide.js` turns canonical facts into original player instructions. It does not display internal research notes or claim a complete daily route. Source disagreements and conditional events are separate from single-source evidence coverage.
