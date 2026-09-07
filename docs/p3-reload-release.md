# Persona 3 Reload beta release

The Reload companion adds a date-aware planner to the existing Royal site. Players set an in-game date and daytime/evening slot, record Social Link ranks and introductions, and get usual-schedule options plus upcoming deadline reminders. The beta covers April through January in the main campaign.

## Behavior

`src/p3/planner.js` combines the roster, canonical research facts and `knowledge/p3-reload/calendar-rules.json`. UTC 2009/2010 dates match the game weekday anchors. January follows December. Date browsing never marks an activity complete or consumes a game time slot.

Ordinary link suggestions respect reviewed school holidays, exam preparation, known link absences, fixed story slots, starting dates, stat requirements and recorded introductions. Rank above zero establishes that the introduction was completed; a separate confirmation supports an introduction completed before rank1. Blocked or unconfirmed links are not presented as ready meetings. Rescues associated with Social Links suppress their suggestions until rescue confirmation.

Deadline checklists cover the canonical missing people, dated requests and Linked Episodes. Prerequisite checkmarks affect later episode reminders. Past dates without checkmarks mean that the record needs checking, not proof of failure in the actual game. Disputed windows never generate definitive expired warnings or lock successors permanently. Route choices remain suggestions. Ordinary options are hidden during fixed story slots while relevant trip tasks and invitations remain accessible.

All22 Social Links and three six-rank stats remain editable. Monthly briefs supply flexible priorities and players can add their own goals. Names are hidden by default; arcana, dates and source links can still reveal information. Explicitly opening all future windows or the static reference tables can reveal spoilers.

## Release scope

This release uses a reviewed subset of the larger knowledge base. Its global `releaseReady:false` means the complete research collection is not a fully validated route. The beta does not claim exhaustive daily availability, affinity calculations, guaranteed rank-ups, a complete dialogue guide, optimal Tartarus routing or 100% completion. Episode Aigis, FES and Portable are excluded. Source review and automated scenario tests are not an in-game playthrough. See [calendar evidence](p3-reload-calendar-evidence.md) for resolved rules and remaining gaps.

The release gate is a working conservative planner: use only supported rules, show uncertainty accurately, avoid unsupported missed-deadline claims, preserve saves, provide useful full-calendar reminders, and pass scenario and browser checks. Wider calendar or perfect-run claims require additional evidence and in-game validation.

## Saves and analytics

Reload uses its own `p3reload_state_v1` key, separately from Royal. Schema2 adds date, slot, completed event IDs, manual introduction confirmations and event-name visibility. Old schema1 saves migrate in memory. An unreadable existing save remains untouched until the user explicitly replaces it and can be downloaded for recovery. Imports validate before applying and retain the preceding state; storage failure keeps an in-memory state available to download.

`p3_progress_changed` contains a fixed action category only. `p3_tracker_used` fires after the first manual progress action per app mount. Date navigation and imports do not emit manual-use events. Guide clicks use `p3_guide_opened`; imports and failures use fixed method labels. Support/share/backup events do not contain user text, dates, event IDs, ranks or save contents. Download and sharing events confirm a browser action, not a file on disk, a referral or a donation.

## Search and discovery

The main planner has a crawlable HTML description, canonical URL, metadata and WebApplication structured data. The two original reference pages answer distinct searches: Social Link schedules/stat requirements, and missing-person/request/episode deadlines. They share the canonical data and link to the planner and each other. The game directory, Royal’s More/footer and next-game section link directly to Reload. The sitemap includes the planner and both reference URLs.

`node scripts/build-p3-guides.mjs` regenerates the reference pages. `--check` detects stale output; prebuild runs the knowledge validator and both guide freshness checks. Do not publish keyword variants with substantially duplicate content or infer indexing/ranking from a successful deployment.

## Verification

`npm test` includes Royal regression tests, Reload save migration/import cases, planner scenarios across all306 dates in both slots, rescue and episode boundaries, calendar exceptions and knowledge-structure checks. `npm run build` builds both entries for `/P5Tracker/`. Lint the new/changed Reload modules and generators separately from the documented legacy Royal lint baseline.

Browser review checks desktop/mobile layout, date changes, link introductions and ranks, deadline checkmarks, goal persistence, restore, base-path links and fixed analytics payloads using a local recorder. Verify the deployed HTML/assets and guide URLs after Pages completes. Keep test events out of production analytics. Private Reddit draft, acquisition plans, dashboard observations and financial targets remain in `.local/growth/`.
