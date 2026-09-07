# Persona 3 Reload companion release

Current release: 2.6.2, deployed on 7 September 2026. Version 2.6.0 expanded Reload from a calendar planner into a companion for the whole main campaign. Beta means individual details may need correction. Entire gameplay systems are part of the release scope. Episode Aigis, FES and Portable are separate campaigns or editions and are excluded.

The shared start page is `/P5Tracker/`. Royal lives at `/P5Tracker/p5/` and Reload at `/P5Tracker/p3/`. Existing `/games/persona-3-reload/` links preserve query strings and fragments when redirecting. Both trackers link back to the chooser.

## Player navigation

Reload follows Royal's layout with Briefing, Calendar, Social Links, Tartarus and More. Calendar opens by default. Its April through January checklists include school answers, openings, missables, Tartarus access, personal goals, relevant boss and story guidance, and optional outings and shopping. The campaign reference also explains the March conclusion and New Game Plus.

Social Links contains all 22 links. Each of the 19 manual links has guidance for ranks 1 through 10, next-rank selection, friendship and romance alternatives where applicable, and an explicit rank-completion action. Browsing a rank never changes progress. Version 2.6.2 replaces the card grid with Royal-style rows. Desktop expansion adds a full-width detail row with planning and gifts on the left and answers on the right. Mobile uses compact accordion rows with answers first. Native buttons expose expansion state and rank controls operate independently. Inside a guide, Answers, Relationship & affinity, and Sources buttons replace nested disclosures. The saved relationship choice describes the player's game; previewing another dialogue branch leaves that choice unchanged. Automatic links remain identified as story-driven.

Tartarus has three sections: progress and rescues, all 101 Elizabeth requests, and enemies and bosses. Requests include numbered solutions, prerequisites, rewards, timed item opportunities and links to fusion or equipment help. Collecting an item and reporting its request are separate actions.

More provides campaign guidance, dorm activities, Personas and fusion, equipment and shops, daily life, and collections and outings. These references include the following:

- Story and optional boss tactics, ending choices, Linked Episode branches, seven protagonist Theurgies, party charge conditions and New Game Plus.
- A searchable registry of 173 base-game Personas and 21 optional DLC Personas, fusion recipes, affinities, skills and unlock conditions. Players save their DLC selection because it changes fusion results.
- Tartarus exploration, Shuffle Time and all 20 available Major Arcana effects, Monad Doors and Passages, Twilight Fragment spending, the Great Clock and free skill-card duplication.
- Enemy affinities and skill data, including gatekeepers and encounter variants. Unknown source locations and effects are labelled.
- Two tracked dorm activities per companion, with initial and upgraded characteristics based on three completions of either or both activities.
- Antique crafting recipes, shop stock, equipment effects and material acquisition. Alternative exchanges remain separate recipes.
- Stat thresholds and activities, affinity recovery, computer software, gardening and gifts.
- All 17 fixed town Twilight Fragments, 48 main-campaign Steam achievements, TV offers, film invitations, walks and social outings. PlayStation's additional platinum is explained separately.

Calendar instructions and source citations in requests, dorm activities and study references are visible without a second expansion. Equipment material lookups use a source-type selector instead of nested location groups. Spoiler reveals and long catalog entries retain their meaningful expansion controls. Royal confidants use labelled Guide and Close buttons. Their compact headers allow long names to truncate, and footer links wrap on narrow phones.

Names and story details are hidden by default where marked. Players can reveal individual entries or enable reference names. Source links and explicitly opened entries can reveal spoilers. This is a flexible companion, without a guaranteed optimal daily route or an exact affinity simulator.

## Calendar rules

`src/p3/planner.js` combines the roster, canonical facts and `calendar-rules.json`. UTC 2009/2010 dates match the game's weekday anchors. Date browsing never completes an activity or consumes a slot.

Ordinary link suggestions respect reviewed school holidays, exam preparation, absences, fixed story slots, opening dates, stat requirements and recorded introductions. A rank above zero establishes an introduction; manual confirmation supports an introduction completed before rank 1. Endangered Social Links stay unavailable until the associated rescue is confirmed.

Episode windows are outer bounds, not promises of availability every day. Earlier checkmarks affect successor reminders. An unchecked past entry means the player should check their record. It does not prove failure in the game. Disputed windows do not create definitive expiry warnings. See [calendar evidence](p3-reload-calendar-evidence.md).

## Saves and analytics

Reload uses `p3reload_state_v1`, separately from Royal. Schema 2 remains compatible with released saves. New optional fields are `registeredPersonas`, `enabledDlcPersonas`, `collectionChecks`, `dormActivities` and `relationshipRoutes`. Missing fields receive defaults; malformed present values fail validation. All 101 request IDs join the existing event allowlist without replacing timed request or pickup IDs.

Imports validate before changing state and retain one previous save. Schema 1 migrates in memory. Unreadable stored data stays untouched until the player explicitly replaces it and can be downloaded for recovery. Storage failure leaves the current in-memory state available to download. Progress does not sync automatically between browsers.

`p3_progress_changed` sends a fixed action category. New actions cover request reporting, relationship choices, dorm activity counts, Persona registration, DLC settings and collection checkmarks. `p3_tracker_used` fires after the first manual progress action per mount. Guide, backup, share and import events use fixed labels. Save contents, dates, ranks, IDs and goal text are not sent. A download or share event confirms a browser action, not a donation or successful referral.

## Search and discovery

The tracker has crawlable fallback HTML, a canonical URL, social metadata and WebApplication structured data. Six generated reference pages answer distinct searches:

- School and exam answers with social-stat activities.
- Social Link opening requirements and schedules.
- Missing-person, request and Linked Episode deadlines.
- Social Link rank answers with relationship branches.
- All 101 Elizabeth request solutions.
- Fusion rules, request recipes, special fusions and the Persona catalog.

The shared start page and Reload's More view link to these pages. The pages link to each other and to the relevant tracker section. All six URLs are in the sitemap. Their reference content is available without JavaScript.

`npm run build:guides` regenerates these pages. Prebuild checks their freshness and validates the original knowledge collection. Deployment success does not establish Google indexing or rankings.

## Evidence and verification

The [completion audit](p3-reload-completion-audit.md) records system coverage. The old `facts.json` and `coverage.json` describe the original planner research collection; their `releaseReady: false` flags do not measure the newer companion datasets. They remain false because the collection is not a verified perfect-run route.

References contain source URLs and short original instructions. The fusion and combat dataset is vendored under the Unlicense, with a pinned revision and checksums. Equipment and request provenance identifies the extracted game-data revision. Source disagreements remain attached to the affected records. Examples include a late-November episode window and an optional boss's disputed timeout; the instructions avoid treating those disputed values as hard rules.

Automated checks cover Royal regressions, every campaign calendar day, save migration and import, all new progress fields, dialogue coverage, request prerequisites, fusion behavior and dataset completeness. Browser review covers mobile and desktop navigation, disclosures, rank and relationship actions, requests, DLC settings, dorm progress, materials, collections and an export/import/reload round trip. Local analytics recording checks fixed payloads without adding test events to production.

These checks do not replace a full in-game validation run. Individual source omissions and errors may remain, and should be reported against the affected entry. A new missing gameplay system is a scope defect and must be fixed.

Version 2.6.2 passed 87 automated tests, production build checks, and browser review at 1280, 820, 390, and 320 pixels. GitHub Pages workflow `34119639694` deployed commit `9104442`. Live Royal and Reload JavaScript and CSS matched the reviewed build by SHA-256. See the [browser evidence](p3-reload-ui-review.md).

The [Reload community launch](https://www.reddit.com/r/persona3reload/comments/1w9qhy2/i_made_a_free_reload_tracker_for_playing_without/) was published on 7 September 2026 with app screenshots and links. Publication establishes distribution, not traffic growth, moderator endorsement, or data accuracy. Follow the [agent guide](post-launch-agent-guide.md) for subsequent checks.
