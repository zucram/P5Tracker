# Reload main-campaign companion coverage

Reviewed 7 September 2026 for version 2.6.0. The initial audit found absent dialogue, requests, combat, fusion and party systems. This document now records the implemented companion and its remaining factual limits.

A full companion must explain the action, requirement, consequence and relevant timing for each main-campaign system. It need not force one daily route or guarantee every objective fits an arbitrary save. Beta allows individual corrections; it does not excuse a missing system. Episode Aigis, FES and Portable are outside this release.

## Implemented coverage

| Player need | Data and interface | Remaining limit |
| --- | --- | --- |
| Start and advance Social Links | All 22 links, opening requirements, stat gates, saved introductions and ranks; reviewed school calendar and usual weekdays. | Story and rank-specific availability can override usual days. |
| Choose rank responses and relationship branches | `social-link-dialogue.json`: all 190 manual ranks, next-rank help, earlier romance flags, friendship and rejection alternatives; saved relationship choice. | Short decision cues omit nonessential transcript lines. Undocumented point values remain unknown. |
| Recover affinity and choose gifts | Daily life has affinity recovery, shrine and computer options, gifts for eligible links and stat thresholds. | No exact hidden-affinity simulation or guaranteed rank-up prediction. |
| Complete Elizabeth requests | `requests.json`: all 101 numbers, steps, prerequisites, rewards, deadlines and item opportunities; search, filters and report checkmarks in Tartarus. | Story flags still matter. Some published outing-count and reward claims disagree with game tables. |
| Rescue missing people | All 20 rescue windows and floors, progress and request connections; endangered link suppression. | An unchecked box cannot establish that a rescue was missed in-game. |
| Finish Linked Episodes | Individual windows and dependency checklists, plus campaign instructions for chains, the extension form, Kyoto invitation and flower branch. | Some invitation windows are disputed. Conservative reminders remain qualified. |
| Develop party characteristics | Nine companions, 18 activities, saved 0–3 counters, first and upgraded characteristic conditions. | Listed weekdays are usual schedules and yield to story availability. |
| Finish the campaign and optional branches | Main story fights, December choice, January finale, March conclusion, optional scenes and New Game Plus in Campaign guide. | The planner's daily date selector ends in January; March is a story reference. |
| Explore Tartarus and fight | All floor sections through 264, access dates, rescues and documents; 370 enemy variants with affinities and skills; story and optional boss instructions; Shuffle Time, all 20 available Major Arcana effects, Monad, fragments and Great Clock guidance. | Ten upstream enemy area values and one skill description are undocumented. Enemy AI turn scripts are not a complete simulator. |
| Acquire and fuse Personas | 173 base Personas plus 21 optional DLC, searchable skills/affinities/unlocks, registry, normal and special recipes, persisted DLC pool. | Fusion unlocks and protagonist level must still be met in-game. |
| Find equipment and materials | 244 distinct antique recipes, 361 shop rows, decoded effects and acquisition routes for all 73 crafting materials. Requests link to this reference. | Conditional stock flags and repeatable chest drops are stated as conditions, not guaranteed availability. |
| Study and raise stats | 58 school/exam entries; 20 activity options including cinema schedules and jobs; stat thresholds, computer programs and gardening. | No optimal stat schedule or exact library gain is asserted where references disagree. |
| Find optional opportunities | 17 fixed town fragments, 32 TV offers, 88 outings/walks/film opportunities, gifts and gardening. Dated opportunities also appear in Calendar. | Conditional invitations require the associated in-game progress. |
| Track achievements and progress | All 48 main-campaign Steam achievements, plus PlayStation platinum explanation; registry, requests, collections, dorm and relationships survive backup. | No single percentage implies the player's entire game is complete. Episode Aigis achievements are excluded. |
| Find the information | Royal-style five-tab navigation, three Tartarus subsections, six More references, calendar shortcuts and six interlinked static search guides. | Search indexing and rankings depend on search engines. |

## Validation and evidence

`npm test` covers calendar rules, imports, old-save defaults, complete new-state round trips, dialogue inventory, request dependency integrity and the required companion datasets. The fusion engine was also compared against the pinned upstream implementation across 67,198 ordered pairs for the base and all-DLC pools. Prebuild rejects stale generated guides.

The local browser journey verified rank and friendship selection, request reporting, Persona registration, persisted DLC settings, both dorm counters, crafting materials, story disclosures and collection checkmarks. Export/import and full reload preserved the resulting state. Reviewed 390-pixel mobile and 1280-pixel desktop layouts had no horizontal overflow. Recorded analytics contained fixed categories only. Test-origin storage was restored after review.

The old `coverage.json` counts only the original facts collection. Use this matrix and the companion coverage tests for release scope. Keep that legacy collection's unverified-route flag intact.

Source-based checks and browser testing are not an actual in-game playthrough. The affected entries identify known uncertainty. Additional individual corrections may emerge during beta use. A whole missing system would fail this release's scope, regardless of the beta label.
