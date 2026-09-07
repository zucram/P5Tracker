# Changelog

## 2.6.12 — 2026-09-07

- Correct reviewed Royal Persona affinities, combat notes, Jazz Jin reminders and Speed Reader guidance.
- Open the Royal fusion calculator and current walkthrough URL.
- Replace obsolete coming-soon entries with the available Reload tracker.
- Preserve existing calendar task IDs and add January 29 Spell Master.


## 2.6.11 — 2026-09-07

- Correct confidant warning logic and check both of Akechi's rank-3 stat requirements.
- Show mobile stat warnings before expanding a card and label desktop rank controls.
- Display string-based rank guides, including Strength requests and automatic story ranks.
- Correct Strength ranks 6 and 7, Samarecarm's spelling, and the remaining Haru start-date note.


## 2.6.10 — 2026-09-07

- Correct Royal Palace route, calling-card and heist deadlines from reviewed date records shared by the app and monthly guide.
- Add prerequisite visit reminders, preserve existing task IDs and remove impossible early-clear suggestions.
- Expand the existing monthly guide with searchable schedules for all eight Palace missions and source notes.
- Correct confidant introduction stat gates and Futaba's August rank target.


## 2.6.9 — 2026-09-07

- Add original share-preview cards and complete image metadata to all 15 public pages.
- Check card sources, image hashes, dimensions and metadata during builds.
- Keep rendering dependencies outside the browser and deployment build.


## [2.6.8] - 2026-09-07

- Separate Maruki's third-semester requirement from Akechi and Kasumi's extra character content in Briefing and confidant notes.
- Align Faith's deadline with December 22, retain the December 18 task as an early reminder, and correct the claim that Faith rank 10 is automatic.
- Use whole-number matching in Royal's school-answer filters. Existing task IDs and analytics names remain stable.

## [2.6.7] - 2026-09-07

- Keep Royal usable when browser storage is blocked or rejects writes. Show a warning and offer a current-progress download.
- Validate stored fields without writing over unreadable data. Preserve valid fields, pause automatic writes and offer the original stored text as a recovery document.
- Retain the unreadable snapshot when an explicit valid import resumes saving. Roll back interrupted multi-field writes where storage permits.
- Add accessible rank/stat labels, larger stat targets and a fixed-category persistence-failure event with no save contents.

## [2.6.6] - 2026-09-07

- Replace Royal's automatic welcome and changelog dialogs with optional notices. Direct guide-to-tracker visits open the requested section.
- Correct help instructions to use Briefing, Calendar, Confidants, Metaverse and Sync.
- Label Royal dialogs, contain keyboard focus, restore focus on close and preserve body scrolling state. Mark the active navigation item for assistive technology.

## [2.6.5] - 2026-09-07

- Add a searchable directory for all eleven guides, linked from the chooser, trackers and individual guides.
- Restore fixed player-referral tags on Royal, Reload and chooser share links. Record native versus clipboard sharing for Reload and the chooser.
- Measure Reload support-panel visibility and click location. Ignore background-tab time for both games' support impressions.

## [2.6.4] - 2026-09-07

- Load six Reload reference sections on demand. The Reload entry bundle falls from about 1,581 kB to 432 kB before compression.
- Validate Persona and request saves against a generated ID catalog, so the calendar does not need the full fusion and request datasets.
- Keep other tabs and Sync available when a reference section fails to load.

## [2.6.3] - 2026-09-07

- Add a searchable Royal crossword guide with all 38 existing clues and answers.
- Add filters to Reload's school, Social Link, request and fusion guides. Numeric request searches select the request number.
- Open linked answer disclosures and restore filtered destinations when following guide index links.
- Validate sitemap pages, unique metadata, internal resources and guide fragments after every production build.


## [2.6.2] - 2026-09-07

- Matched Reload Social Links to Royal's row layout, with full-width desktop details and compact mobile rows.
- Replaced nested guide disclosures with Answers, Relationship & affinity, and Sources views. Simplified calendar instructions and reference sources.
- Added labelled Royal Guide and Close controls and fixed narrow-screen header/footer overflow.

## [2.6.1] - 2026-09-07

- Kept expanded Reload dialogue cards within their grid columns. The row layout in 2.6.2 supersedes this intermediate fix.

## [2.6.0] - 2026-09-07

- Expanded Reload to cover the main campaign: all manual Social Link rank answers, Elizabeth requests, fusion, combat, equipment, dorm activities, and collections.
- Added saved relationship choices, Persona and DLC settings, activity progress, and request reporting with backward-compatible saves.
- Added static Social Link answer, Elizabeth request, and fusion guides. Individual factual corrections remain possible during beta.

## [2.5.2] - 2026-09-07

- Added the shared start page and short `/p5/` and `/p3/` routes, with compatibility redirects that preserve queries and fragments.

## [2.5.1] - 2026-09-07

- Aligned Reload navigation and monthly planning with Royal. Added school-answer and activity references and retained date controls in Tartarus.

## [2.5.0] - 2026-09-07

- Released the Reload calendar planner beta with sourced Social Link and deadline guides, separate saves, and prerequisite-aware planning.

## [2.4.3] - 2026-09-07

- Added guide discovery, manual-use, save-transfer outcome, and support-exposure events with fixed, limited analytics payloads.

## [2.4.2] - 2026-09-07

- Added contextual navigation to published guides from the tracker.

## [2.4.1] - 2026-09-07

- Published searchable Royal school answers with reviewed shared data and search metadata. Added school-answer corrections and missing dates.

## [2.4.0] - 2026-09-07

- Added static discovery guides, the game directory, referral sharing, and next-game interest measurement.
- Improved save validation, downloadable backups, and recovery of the previous save.
- Added the source-cited Maruki and third-semester requirement checker.

## [2.2.0] - 2026-01-10
### Added
- **Priority Roadmap:** Redesigned the monthly checklist into "Mission Critical" and "Timeline" sections.
- **Visual Task Categorization:** Tasks now use distinct icons and colors (School, Calendar, Ops) for faster scanning.

## [2.1.5] - 2026-01-10
### Fixed
- Prevented double popups (Onboarding + Changelog) for first-time users.

## [2.1.4] - 2026-01-10
### Changed
- Refined **Mission Briefing** (Onboarding) to be more action-oriented, explaining how to use the timeline anchor and backlog systems.

## [2.1.3] - 2026-01-10
### Added
- **Onboarding Guide:** New high-impact welcome tutorial for first-time users.
- **Help Center:** Replay the onboarding guide via the new "Help" link in footer.

### Fixed
- Changed default starting month to April (was July).

## [2.1.2] - 2026-01-10
### Added
- Integrated **Umami Analytics** (GDPR compliant, privacy-first).
- Custom event tracking for Support, Sync, Roadmap, and History toggles.

## [2.1.1] - 2026-01-10
### Fixed
- Improved changelog trigger logic to only popup on Major/Minor version changes.
- Updated support links to point directly to GitHub and Ko-fi.

## [2.1.0] - 2026-01-10
### Added
- **Mobile UX Redesign:** Complete overhaul for vertical screen density.
- **Accordion Lists:** Confidants and Mementos now use space-saving expandable cards.
- **Inline Controls:** Update Confidant ranks directly from the list view.
- **History Management:** Completed Palaces and Mementos paths are now archived/collapsed by default.
- **In-App Changelog:** New "What's New" modal to track updates.
- **Feature Roadmap:** In-app view of upcoming features.
- **Dynamic Versioning:** App automatically reflects version from configuration.

### Fixed
- Corrected Will Seed descriptions for all Palaces.
- Fixed Shido Palace seed locations and colors.
- Corrected Mementos "Path of Da'at" history detection.
- Improved auto-expansion logic for Palaces spanning multiple months.

## [2.0.4] - 2026-01-10
### Added
- "Support" button in header linking to Ko-fi.

## [2.0.1] - 2026-01-10
### Fixed
- Initialization bug where the app would reset to July on refresh instead of staying anchored.

## [2.0.0] - 2026-01-08
### Changed
- Major refactor to pure static site with localStorage persistence.
- Extraction of game data into modular JS files.
- Implementation of "Timeline Anchor" navigation.
