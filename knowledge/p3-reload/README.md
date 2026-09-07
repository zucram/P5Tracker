# Persona 3 Reload knowledge base

Research dataset for the main campaign, reviewed 7 September 2026. This is the basis for a flexible monthly companion. A reviewed subset powers the beta planner. The complete collection is not a verified 100% route. Original, FES, Portable and Episode Aigis data must not enter this dataset.

## Files

- `sources.json`: guide catalog, authors, editions, route lineage and inspection limits.
- `facts.json`: factual constraints and supporting evidence. Contains spoilers.
- `months.json`: original monthly editorial briefs derived from fact IDs, with remaining research needs.
- `disputes.json`: conflicting source claims and the decision for each.
- `coverage.json`: measured coverage and release gaps.
- `calendar-rules.json`: reviewed subset of school closures, fixed slots, and opening requirements for the beta planner.

No full walkthrough prose, dialogue transcripts, screenshots or copied daily schedules are stored here. Source URLs and section locators let a reviewer check each claim in the author's own guide.

## Data contract

`facts.json` has `schemaVersion`, `game`, `reviewedAt`, `releaseReady` and `facts`.
Each fact has a unique `id`, `category`, `kind`, `status`, `subject`, `value`, `evidence`, `spoiler` and optional `notes`, `dependsOn` and `disputeIds`.

- Categories are `social-link`, `social-stat`, `linked-episode`, `rescue`, `request`, `calendar`, `tartarus` and `planning`.
- Kinds are `constraint`, `route-choice` and `recommendation`. A route choice is never a deadline.
- Status is `corroborated`, `single-source`, `disputed` or `editorial`. Corroborated means agreement between inspected published sources, not verification in the game. Source lineage can still be unknown; source count alone is not a confidence score.
- Evidence entries have `sourceId`, an exact `url`, a `locator` and `supports`, which names the supported fields. Do not imply that every source verifies every field.
- `value` holds category-specific facts such as `start`, `end`, `floor`, `rank`, `days`, `timeSlot` and `dateMeaning`. Dates use `MM-DD` in game-calendar order, April through January. January follows December. No real-world weekday is inferred from the current year.
- A window gives outer bounds. It does not promise an activity on every date in the interval. Start dates still require prerequisites. Null means unknown, never unrestricted.
- `dependsOn` contains fact IDs for required earlier events. It is not an exhaustive dependency list unless the record explicitly says so.
- Spoiler levels are `none`, `mechanic`, `character` and `story`. Names and consequences need separate display control in the eventual app.
- Disputed facts must not drive definitive availability or missed-deadline warnings. An explicitly labelled early reminder can use a conservative target while a dispute remains open.

## How the semi-guide should use it

For a selected month, show dated risks first, then available opportunities and flexible priorities. Let players choose their next activity. Check completed events and prerequisites before suggesting anything. Carry incomplete work forward only when its actual window permits it.

Keep suggested targets separate from hard requirements. Never claim that an arbitrary monthly Social Link rank is mandatory. Avoid a green “you can still finish everything” result until the remaining schedule has a tested feasibility model. Prefer “these opportunities remain” with the relevant caveats.

A complete availability or 100% guide needs the full school calendar, Social Link exceptions, prerequisite reconciliation, missed-episode behavior, and playthrough validation. The beta planner can use the reviewed subset in `calendar-rules.json` with explicit limits. It must label usual-schedule options, require player-confirmed introductions, suppress known closures, and avoid definitive conclusions from disputed facts. The broader dataset remains `releaseReady: false`.

## Review and validation

The [generated review](../../docs/p3-reload-knowledge-review.md) presents the coverage, disputes and monthly briefs. Run `node scripts/validate-p3-knowledge.mjs` before updating the report with `node scripts/build-p3-knowledge-report.mjs`. Structural validation does not verify gameplay facts.
