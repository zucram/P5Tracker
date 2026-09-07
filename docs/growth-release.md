# Growth and save-transfer release

P5 Tracker provides free Royal and Reload browser companions. The shared chooser is `/P5Tracker/`, with Royal at `/p5/` and Reload at `/p3/` beneath that base. `/games/` is a compatibility redirect. Additional games remain candidates without release commitments. See the [Reload release](p3-reload-release.md) for current scope and the [agent follow-up guide](post-launch-agent-guide.md) for measurement and feedback.

## Search pages

Vite builds the shared and per-game entry points and copies `public/guides/` into the production build. Static guides have distinct titles, descriptions, canonical URLs, and links to relevant tracker sections. `public/sitemap.xml` lists the shared chooser, both trackers, the guide directory, five Royal guides, and six Reload guides. Keep it aligned when adding or removing pages. Tracker fallback HTML and metadata describe the correct game without invented ratings or paid offers.

The deployment base remains `/P5Tracker/`. Moving to another origin requires a save migration plan because browser storage does not follow users across origins.

## Initial growth-release events

This table records the original 2.4.0 additions. Use [current event definitions](analytics.md) for both games and reporting limits.

The existing Umami property measures production traffic. The script allows only `zucram.github.io`. New measurements use the existing integration and contain no save contents.

| Event | Meaning | Properties |
| --- | --- | --- |
| `task_checked` | A user checks an item in the tracker | None |
| `guide_check_used` | The third-semester checker is submitted | `guide` |
| `guide_open_tracker` | A guide's app link is clicked | `guide` |
| `guide_support_click` | A guide's Ko-fi link is clicked | `guide` |
| `game_open_tracker` | A game chooser tracker link is clicked | `game` |
| `hub_support_click` | The game directory's Ko-fi link is clicked | None |
| `share_complete` | The share API resolves or the link is copied | `method` |
| `next_game_interest` | A user submits a game suggestion | `game` |

Use unique visitors when comparing interest or engagement. Event counts can include repeat actions. A share completion does not prove that a recipient visited, and a support click does not prove payment. The share link uses `utm_source=app`, `utm_medium=share` and `utm_campaign=player_referral` to distinguish arrivals.

The next-game prompt remembers a submitted suggestion in the browser when storage is available. It is a directional interest signal, not an authenticated poll. When Umami is unavailable, users can use the existing feedback link.

## Release checks

Build with `npm run build`. Verify both trackers, the shared chooser, compatibility redirects, and every guide listed in the sitemap under the GitHub Pages base path. Check that guide links select the intended game and tab. Test sharing with native sharing, clipboard-only support, and unavailable browser APIs. Keep production analytics stubbed during browser tests.

Validate save round trips and rejected imports with the save-data tests. A successful import must preserve a recoverable previous save. Verify downloaded backups separately from browser-local recovery.

The existing full-repository lint baseline contains errors in legacy components and hooks. New components must pass targeted ESLint without adding to that baseline.

## Third-semester search page

`public/guides/third-semester/` answers the Maruki rank and deadline question and checks a visitor's chosen rank and date range. The answer is available as HTML without JavaScript. The interactive form is revealed only when its module loads. Inputs stay in memory and never update tracker saves or enter analytics. Its test cases run with `npm test`.

The page distinguishes the confidant requirement from later ending choices. It never estimates how many available afternoons remain. It cites GameSpot's Royal guide and RPG Site's Councillor and endings guides. November 17 is the last date used by the checker, with November 18 treated as after the deadline. The September rank cap uses September 20 as the boundary, consistent with the existing app calendar and RPG Site's statement that the cap ends after September 19. Guide verification is editorial source review, not a new full playthrough.

## School answers release

Version 2.4.1 adds `/guides/school-answers/`, a static answer table with month, type and text filters. The app and page share the reviewed Royal dataset, including corrected July answers and 28 additional dates. Existing dated task IDs remain stable. The undated July exam group and duplicate October exam summary are retired.

The page links to the monthly calendar, is linked from the app and existing guides, and appears in the sitemap. Its title targets Royal classroom and exam answers. The third-semester page now names Maruki’s deadline in its title without claiming to be a full confidant dialogue guide.

`school_answers_filtered` records the first successful nonempty filter use per page load. Its only property is the fixed guide name. It does not transmit search text, chosen dates, answers or saves. Existing `guide_open_tracker` records the calendar link click. These events are not proof of a successful game action or a payment.

Validation covers shared answer integration, stable task IDs, Royal July content, static generation freshness, mobile filtering and analytics payload limits. See [school answer maintenance](school-answers.md).


## Guide navigation

Version 2.4.2 makes published guides accessible above the app content. Briefing links to monthly planning, school answers and the Maruki deadline checker. Calendar links to school answers and monthly planning; Confidants links to the deadline checker and confidant tracking guide. More and the Reference Hub show all four guides and the game directory with descriptions. Footer links remain available in every view.

`src/components/GuideLinks.jsx` owns these contextual links. They use the configured Vite base path and ordinary same-tab anchors. When adding a published guide, update this list and verify navigation under `/P5Tracker/` at mobile and desktop widths.


## Usage events

Version 2.4.3 adds contextual guide-link events, manual progress and first-use events, save-transfer outcomes, and support-card impressions. Existing page views and event names remain intact. See [event definitions and reporting limits](analytics.md) before comparing counts. No new payload includes saves, ranks or text input. Analytics exceptions and rejected promises must not interrupt the app.


## Searchable guides in 2.6.3

`/guides/persona-5-royal-crossword-answers/` renders the existing Royal crossword dataset as 38 searchable entries. The generator preserves every `cw_ans_` save ID. Source review confirmed the answer order against RPG Site on September 7, 2026; it did not add calendar-date assignments or optional grid words. Regenerate it with `npm run build:guides`.

Four Reload pages use the same progressive lookup controls for school dates, Social Links, requests and Personas. Number-only request and crossword searches use the entry number, so request 1 does not match request 2's title, Old Document 1. General searches still match title words. Request 101 keeps its spoiler title hidden in search metadata.

Index and fragment links reveal their target and open answer disclosures. The controls never write saves or query parameters. Each page remains readable when JavaScript fails. `docs/analytics.md` defines the single lookup-use event.

`npm run build` now runs `scripts/check-site.mjs` after Vite. It checks every sitemap entry for unique titles and descriptions, matching canonicals, one HTML H1, valid JSON-LD, internal resource paths, guide fragments and incoming links. It validates the production directory under `/P5Tracker/`; it does not establish search indexing or rankings.

Browser review used isolated Chromium with Umami blocked and stubbed. All five lookup pages fit 320, 390 and 1280px widths. Tests covered exact numbers, clue search, zero results, reset, filtered index navigation, direct rank/request fragments and no-JavaScript crossword coverage. Shared authenticated browser access was unavailable, so post-launch analytics and receipts remain unverified.


## Reload loading in 2.6.4

Reload loads Social Links, requests, combat, Persona fusion, dorm activities and equipment with React lazy imports. The calendar, navigation and save state remain in the main app. Campaign entries stay in the initial bundle because the monthly calendar displays them too.

Save validation reads `src/p3/saveCatalog.json` for Persona, DLC and request IDs. Generate it from the full source datasets with `npm run build:catalog`. Prebuild rejects a stale catalog. The complete-system save round-trip test still imports every source Persona, DLC selection and request, and checks that Royal saves stay unchanged.

Compared with 2.6.3, Vite reports the Reload entry script at approximately 432 kB instead of 1,581 kB, or 73 kB instead of 194 kB using Vite's gzip estimate. React and shared dependencies are additional bytes in both builds. This is a bundle-size measurement, not a measured change to field loading times or search ranking. The equipment section remains large but is requested only when opened.

Isolated Chromium network inspection confirmed that the calendar does not request the six deferred sections. Each section loaded on navigation at 390px, progress survived tab changes and reload, and blocking the equipment download left Calendar usable. A section error shows a reload action. If the app has a save warning, it instead directs the player to Sync before reloading. All 89 automated tests passed; generated-guide and site checks passed.


## Guide directory and referrals in 2.6.5

`/guides/` groups the eleven published guides by game and filters them by topic. `src/data/guideDirectory.js` owns the directory entries, and `npm run build:guides` generates its HTML. The build checks its sitemap entry and links. Each guide, the chooser and both apps link back to it. No account or JavaScript is needed to browse the guide links.

All three share controls use fixed public URLs with the existing player-referral campaign. This repairs a documentation-versus-source mismatch: the pre-2.6.5 controls used bare links. Support measurement now includes Reload panel visibility and header/footer click location. The existing support placement is unchanged. Browser checks used stubbed analytics, simulated clipboard writes and prevented Ko-fi navigation; no payments or production test events were sent.

The directory and filters fit 320, 390 and 1280px. Browser checks confirmed all eleven links without JavaScript, game/topic filtering, all three share destinations, background-tab impression suppression and one support impression per page load. See `docs/analytics.md` for event definitions and comparison limits.


## Royal first visits in 2.6.6

New Royal players can use the tracker immediately. An optional welcome card appears only in Briefing and links to Calendar or help. Direct Calendar and Confidant arrivals keep their selected section. Returning players see an inline update notice instead of an automatic release-notes dialog. Help and What's New remain available in the footer. Dismissing welcome or closing help uses the existing onboarding preference; no game progress changes.

Royal dialogs now have accessible labels, keep Tab focus inside the panel and close with Escape. Closing restores focus to the opener if it remains present, otherwise to the main content. Opening one dialog no longer lets the other inactive dialog effects undo the page's scroll lock.

Isolated Chromium covered fresh visits, direct Calendar entry, returning users with an older version, notice dismissal and optional help. Tests verified current tab names, 320px layout, keyboard focus containment and restoration, existing Royal ranks and an untouched Reload save. The changed modules pass targeted lint; the Royal file retains its existing seven-error/one-warning lint baseline. Source helpers tolerate unavailable preference storage, but this does not establish that all legacy Royal save paths tolerate blocked storage.


## Royal save recovery in 2.6.7

The earlier Royal startup could crash when localStorage was blocked. Invalid JSON could also be replaced by an empty checklist during the initial persistence effect. Isolated Chromium reproduced both defects before this change.

`loadStoredSave` now validates each stored field through the existing save parser, fills missing fields, and preserves other valid fields when one is unreadable. It performs no writes. Unreadable data pauses automatic persistence; inaccessible storage leaves the tracker usable in memory. The warning offers downloads of current progress and, when present, the original stored text. Ordinary persistence attempts to restore prior values if one field write fails. If the browser also refuses rollback writes, recovery depends on the in-memory export or an earlier downloaded backup.

A successful explicit import resumes saving. If the startup save was unreadable, the import transaction also stores its raw field map in `p5r_unreadableSave`. Sync can download that recovery document after a reload. It is separate from a normal tracker import and holds one original snapshot. Failed imports keep the existing import rollback behavior. Clearing site data removes all browser-local recovery copies.

Browser tests covered fully blocked storage, malformed checklist JSON, retained valid ranks, current and original downloads, a valid replacement import, recovery after reload, write quota failure and retry after storage becomes writable. Royal tests kept a seeded Reload save unchanged. All 97 automated tests passed. Targeted save-module lint passed; the Royal file now has three legacy lint errors and one warning, down from seven errors and one warning.


## Royal requirement corrections in 2.6.8

Briefing now separates the required Councillor milestone from optional Justice and Faith character goals. It reads ranks, targets, dates and notes from the existing app data and links to the deadline checker. The old shared mandatory label was incorrect. Faith's displayed deadline now matches the existing December 22 calendar cutoff, while its December 18 task remains an early reminder. The Faith rank-10 note now describes a manual meeting. Existing saved task IDs remain unchanged.

The source review is recorded in [Royal content review](royal-content-review.md). Browser checks verified the required/optional grouping and layouts at 320, 390 and 1280px. The Royal school guide also uses the shared whole-number search matcher, with its existing event name preserved. Browser tests covered July 1, 07/14, no results, reset and month navigation.

## Shared-link previews in 2.6.9

Every sitemap page now has a distinct 1200 × 630 PNG card, including the two trackers, start page, guide directory and eleven guides. Cards use original typography and checklist shapes. They include no player data or plot details. Open Graph image URLs are absolute public HTTPS URLs, with MIME type, dimensions and alt text. Twitter metadata requests a large-image card. Existing canonical URLs, descriptions and referral parameters remain in place.

`share-cards.mjs` defines cards from the guide directory and supplies metadata to guide generators. The six hand-maintained HTML pages include the same metadata. `npm run build:share-cards` uses Python 3, Pillow and DejaVu Sans to regenerate committed images. `SHARE_CARD_FONT_DIR` can point to the DejaVu font directory on another machine. These rendering dependencies are not needed in CI or the browser. The prebuild checks the renderer/data recipe and PNG hashes against the committed manifest; postbuild checks each page's metadata and image dimensions.

The metadata follows the [Open Graph protocol](https://ogp.me/). Local checks establish that a crawler can read metadata and fetch the corresponding image without JavaScript. Social platforms control whether, when and how they display or cache cards; no social post or platform-cache refresh was submitted. This release does not establish a change in click-through rate.

## Royal calendar and deadline guide in 2.6.10

The legacy calendar mixed route and heist deadlines, including dates that were already too late to finish a Palace. `palaceDeadlines.js` now owns the eight mission schedules and prerequisite reminders. The app creates its original deadline tasks from those records, preserving existing checkmark IDs. A new May task makes Madarame's required first visit visible before the June deadline view. Early-clear suggestions no longer give impossible dates.

The existing `/guides/monthly-checklist/` URL now includes searchable Palace schedules, sources and planning instructions. It keeps its canonical URL and tracker/support event identifiers. The directory and Royal navigation describe its expanded coverage. The share card is regenerated from the directory title. All schedules remain readable without JavaScript. The new guide uses the existing `guide_lookup_used` event with the fixed `monthly-checklist` identifier.

Targeted confidant corrections distinguish initial story ranks from later stat gates and remove incorrect Ohya/Shinya stat requirements. The detailed source review and a Futaba date-source disagreement are recorded in [Royal content review](royal-content-review.md). This release does not claim a full revalidation of legacy Royal data.

All 101 automated tests passed, including reviewed date sequences, prerequisite dates, original task IDs and corrected introduction notes. Browser checks cover guide filters, fragments, no-JavaScript content, mobile/desktop layouts and retained Royal/Reload progress.

## Confidant warnings and rank guides in 2.6.11

The earlier note corrections exposed a separate outdated source in `socialStats.js`. Ann and Futaba warnings now apply to rank 2, Ohya/Shinya have no fabricated stat gate, Iwai's Guts-5 check applies after rank 7, and Akechi's rank-3 check includes both Knowledge and Charm. The pure requirement helper returns every missing stat, so Briefing highlights both when needed. Meeting a stat gate alone does not establish date, affinity or request eligibility.

Mobile cards display missing stats without expansion. Desktop rank buttons have accessible names. A shared rank-guide component handles both dialogue arrays and string entries. This restores Strength requests and automatic story-rank descriptions that previously displayed as missing data. It also shows an explicit completed state at rank 10. Strength's rank-6/rank-7 requests and rank-9 skill spelling are corrected.

All 106 automated tests passed. Isolated mobile and desktop Chromium checks verified the corrected warnings, live stat updates, Strength and automatic guides, rank persistence and unchanged Reload data. The changed modules pass targeted lint; Royal's remaining lint baseline is three legacy errors, with the prior memo dependency warning resolved.


## Royal reference and navigation corrections in 2.6.12

Reviewed combat notes now agree with the Royal Persona data source for the checked affinities and learned skills. Jazz Jin reminders correct two August skills and the January Sunday schedule; existing task IDs retain their checkmarks. Speed Reader and daily-activity notes remove original-game or overstated guidance. The source comparison and its limits are in [Royal content review](royal-content-review.md).

Resources open the Royal fusion calculator and current walkthrough. The Reload resource card now opens the available beta tracker; speculative future-product cards were removed. The crossword guide's tracker link now opens Briefing, where Crossword Answers actually lives, and its instructions match that location.

All 108 automated tests passed. The production build checks all 15 public pages. Isolated browser verification covers corrected reference destinations, the crossword-to-tracker path, visible combat notes and retained calendar progress. The separate Treasure Demon data list is complete but is not yet a displayed interface; no new page is claimed for it.


## Strength search guide in 2.6.13

`/guides/persona-5-royal-strength-confidant/` adds Royal's ten exact request targets, normal/alarm skill-card sources, four fixed group recipes and selected leveling/inheritance routes. The request pairs now share one data source with the app's Strength rank guide. The public page explains card prerequisites and directs ordinary fusion searches to Royal's DLC-aware calculator. Its source review is recorded in [Royal content review](royal-content-review.md).

Fragment navigation now handles new and repeated anchors once each, preventing a delayed hash event from clearing a newly selected filter. The guide supports rank, Persona, skill and donor lookup, filtering by card mode, direct rank links and readable content without JavaScript. It links to Confidants for saving ranks. The guide directory, Royal Confidants/Reference navigation, confidant guide and sitemap link the new page, which has its own share card. There are now 16 sitemap pages and 12 directory guides. The existing fixed-slug lookup, tracker and support events apply; search terms are not sent.

All 110 automated tests and generated-content/site checks passed. Browser checks cover exact rank/donor lookup, filter combinations, empty/reset states, fragment recovery, no-JavaScript access, 320/390/1280px layouts, the tracker handoff and unchanged seeded progress in both games. The new guide's indexability and usable content are verified locally; search rankings and incremental traffic remain unmeasured.


## Royal keyboard operation in 2.6.14

Royal's pointer-only checklist rows now use shared keyboard controls with checkbox roles, accessible names and checked state. This covers calendar tasks, crosswords, Will Seeds, Palace Personas, Mementos requests and the registry. Palace and Mementos headers expose expansion state. Tab reaches each control; Space and Enter activate it, held-key repeats do not toggle repeatedly, and pointer operation remains available. Focused cards have a visible outline and full opacity, with a minimum 44px height. Month arrows have names and the Metaverse mode buttons expose their selected state.

Briefing now links missing social stats to Confidants, where the specific next-rank requirements are shown. School answers use the same whole-number/date matcher as the static guides, including leading-zero dates, with a visible live result count. Registry search accepts combined name and Arcana terms and both search controls have explicit labels. Save keys, task IDs and the persistence format are unchanged.

All 110 automated tests passed. Isolated Chromium checks at 390 and 1280px verified tab order, Space/Enter, repeat suppression, pointer toggles, saved Persona registration, exact school dates and result counts, calendar/month controls, Palace seeds/Personas and Mementos requests. Seeded Reload state remained unchanged. Royal's changed modules now pass lint after removing a dead helper and resolving two unused-binding reports. Full-repository lint still reports eight pre-existing errors and one warning in other files; this release does not claim a clean repository-wide lint run.
