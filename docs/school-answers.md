# Royal school answers

The app and `/guides/school-answers/` share `src/data/schoolAnswers.json`. The reviewed dataset contains 68 scheduled answer dates, comprising 56 classroom entries and 12 exam entries. It excludes the June 11 studio question and automatic exam days with no selectable answer. January entries require the third semester.

Each entry has a date, month, type, ordered answer choices and evidence with source URLs and locators. The source review compared marendarade's Royal walkthrough, Road_to_Dawn's answer guide and RPG Site. The dataset records disagreements rather than silently following a single publisher. No independent in-game playthrough was performed during this review.

## App integration and saved progress

`schoolAnswers.js` converts entries into monthly tasks. Forty previously dated tasks retain their IDs through `appTaskId`. Twenty-eight additional dates receive their new dataset IDs. The retired `july_exam_ans` task contained an undated group of original-game answers; its old checkmark is not transferred to the new Royal exam tasks. No save key or imported save is rewritten by this data update.

The shared data corrects July 12 to Thievery, completes the July 11 multipart answer, and replaces the July exam group with Royal's July 13–15 choices. It also corrects wording on April 25 and expands abbreviated choices. Reward amounts are not inferred from the answers. Some classroom interactions help Ann and do not grant the Knowledge reward previously stated for every row.

Exam summaries distinguish the overall exam period from selectable answer dates. July exams include July 16, and scores depend on Knowledge as well as answers. The conflicting duplicate October summary has been removed.

## Updating the page

1. Update the canonical JSON and its evidence after checking the Royal edition.
2. Keep `appTaskId` when an entry still represents the same dated event.
3. Run `npm run build:guides` to regenerate the static HTML.
4. Review the generated difference, then run `npm test` and `npm run build`.

`prebuild` checks the generated page against the data and fails if it is stale. The page shows every recorded row without JavaScript. Browser JavaScript only filters those rows; it does not fetch a second data copy.

The page's calendar link emits `guide_open_tracker`. Its first successful nonempty filter use emits `school_answers_filtered` with only a fixed guide name. Search text, answers, selected dates and saves are not sent in either payload.

## Search intent

The page targets the Royal school, classroom and exam answer intent with one URL. Month headings and date rows support specific lookups. It does not present itself as an original Persona 5 answer guide, a platinum walkthrough or a full confidant guide. The existing third-semester page retains its URL and now names Maruki's deadline in the title.
