# Usage measurement

P5 Tracker uses Umami page views and feature events to measure discovery, use and support interest. Events appear automatically when received; their names do not need registration in Umami. See [Umami event tracking](https://docs.umami.is/docs/track-events).

Use the [post-launch agent guide](post-launch-agent-guide.md) for the review procedure. This document defines instrumentation. Actual account results and saved-report configuration stay in the private ledger.

## Optional Royal welcome in 2.6.6

Royal no longer opens onboarding or changelog dialogs automatically. The optional Briefing card emits `welcome_calendar_opened` when its calendar action is chosen, or `welcome_dismissed` when dismissed. Neither event carries properties or proves manual tracker use. Explicit help openings retain `help-open`; closing help retains the historical `onboarding-complete` acknowledgment event. It does not establish that a player read every instruction. Compare onboarding counts across this change with care.

## Discovery and support in 2.6.5

The guide directory uses `guide_lookup_used` with `guide: directory` and `directory_guide_opened` with the destination `guide` slug and `game: royal` or `reload`. Its tracker links use `guide_open_tracker` with `guide: directory-royal` or `directory-reload`. These events show navigation choices; they do not establish an ordered conversion funnel.

Reload now emits `p3_support_card_view` with `game: persona-3-reload` and `location: footer` after at least half the existing panel remains visible for one continuous second. `p3_support_click` retains its name and game property, adding `location: header` or `footer`. Existing Royal `support_card_view` names and properties stay unchanged. Both games pause impression timing while the document is hidden. Counts are once per location per page load, with no retries when analytics is blocked.

Royal, Reload and chooser share controls now use `src/lib/shareUrl.js` to emit public URLs with exactly `utm_source=app`, `utm_medium=share`, and `utm_campaign=player_referral`. No current-page query, fragment or save value is copied. `p3_share_complete` and `hub_share_complete` add `method: native` or `clipboard`; Royal already records the method. A canceled share or manual fallback does not emit completion.

The September 7 source review found that all three pre-2.6.5 share URLs were bare, despite earlier documentation describing referral tags. Do not infer that older direct arrivals were tracked referrals. The historical Reddit campaign links remain unchanged.

## Guide lookups in 2.6.3

`guide_lookup_used` fires once per page load after a nonempty search or category filter returns results. Its only property is `guide`, the fixed page slug. It covers Royal crossword answers and Reload school answers, Social Link answers, Elizabeth requests and fusion reference pages. It sends no query, selected category, request number, date or save data. Clearing filters, opening a fragment and unsuccessful searches do not emit it. These are lookup interactions, not proof of tracker use or payment.

The shared UI lives in `public/guides/lookup-ui.js`. All answers remain in the static HTML. Tests stub Umami and must not send production events.

## Reload events in 2.6.2

Reload's `src/p3/App.jsx` helper adds `game: persona-3-reload` to these events:

| Event | Trigger | Additional properties |
| --- | --- | --- |
| `p3_tracker_used` | First manual progress action after mounting | None |
| `p3_progress_changed` | A progress action commits in-memory state | `action`: fixed category such as `link_rank`, `social_stat`, or `collection_checked` |
| `p3_guide_opened` | An instrumented reference link in More is clicked | `guide`: fixed destination slug |
| `p3_support_click` | Header or support-panel Ko-fi link is clicked | None |
| `p3_backup_download` | Normal backup download is requested | None |
| `p3_save_imported` | Validated import persists successfully | `method`: fixed import method |
| `p3_save_import_failed` | Import validation, parsing, or persistence fails | `method`: fixed import method |
| `p3_share_complete` | Native share or clipboard copy succeeds | None |

Date browsing, reference reading, and looking ahead at dialogue do not establish manual use. `p3_tracker_used` counts active mounts, not lifetime activation. Progress events can fire even when storage fails, because in-memory progress still changes. They do not prove durable saves or successful game actions.

Before 2.6.5, Reload had no support-card impression event, click-location property or share-method property. Guide-open coverage still applies only to instrumented links, including More and the directory footer link. Report those limits when comparing historical windows.

Reload static guide CTAs use `guide_open_tracker`, and guide support links use `guide_support_click`, with full `persona-3-reload-...` guide slugs. These are shared event names with Royal, so filter by guide or path. The chooser uses `game_open_tracker` with a game label.

## Events added in 2.4.3

| Event | Trigger | Properties |
| --- | --- | --- |
| `guide_opened` | Click an app guide or game-directory link, including the footer | `guide`: fixed destination slug or `games`; `location`: internal view name or `footer` |
| `tracker_progress_changed` | Manually toggle a checklist item or change a confidant rank or social stat | `kind`: `checklist`, `confidant`, `social-stat` |
| `tracker_used` | First manual progress change after the app mounts | None |
| `save_copied` | Clipboard copy reports success | None |
| `save_download_started` | Browser download action requested | None |
| `save_imported` | Validated save successfully persisted and applied | `method`: `paste` or `file` |
| `save_restored` | Previous backup successfully persisted and applied | `method`: `backup` |
| `save_import_failed` | Save validation, file reading or persistence fails during an import | `method`: `paste`, `file` or `backup` |
| `support_card_view` | At least half of a support card intersects the viewport for one continuous second, once per location per page load | `location`: `briefing` or `calendar` |

`tracker_used` counts active page loads, not lifetime activation or unique people. Hash-tab changes do not reset it; a full reload or return from a static guide does. Importing a save and restoring existing state do not trigger manual-use events. Rank/stat changes at their bounds do not count. Checklist events include registry and crossword checks; checking and unchecking both count as manual changes. A download-start event does not prove that a file was written to disk. A card-view event measures viewport intersection, not attention; blocked analytics and unavailable IntersectionObserver limit the measurement. From 2.6.5, hidden-tab time does not count toward the one-second threshold.

No new event sends task IDs, character names, ranks, stat values, search text, save contents, filenames, error messages or persistent user identifiers. The app has no new event queue or retry loop. Blocked or unavailable analytics can undercount use. Existing event names remain unchanged for historical comparisons.

## Existing events to use alongside them

- Page views already include tracker hash tabs and static guide paths. Do not add duplicate tab-view events.
- `guide_open_tracker` identifies a guide's main tracker CTA using its `guide` property. Ordinary back links are page navigation, not this CTA event.
- `school_answers_filtered` fires once after a nonempty filter produces results; `guide_check_used` records deadline-check submissions.
- `task_checked` measures checking only. Do not add its count to `tracker_progress_changed`; the same action may produce both.
- `support-card-click` includes card location. `support-link-click` includes app header/footer location. `guide_support_click` and `hub_support_click` cover their respective Ko-fi links.
- `share_complete` distinguishes clipboard copy and completed native share interaction. It does not prove a friend received or opened the link.
- `next_game_interest` records a submitted game preference. It is not an authenticated poll.
- `sync-terminal-open` measures opening the transfer interface, separate from a completed transfer.

The legacy `useUserStats` and `useSmartSupport` hooks are not mounted by the current Royal app. Their milestone/session/toast event names in source code are not evidence of live instrumentation.

## Reports and interpretation

Group current entry paths under `/P5Tracker/p3/` and `/P5Tracker/p5/`. Historical Royal root fragments and old Reload `/games/persona-3-reload/` paths can appear before or during compatibility redirects. Inspect the actual URL values in Umami when building filters. Keep chooser visits separate from game use, and avoid counting a redirected arrival twice.

For Reddit acquisition, filter the observed UTM source, medium, and campaign, then split by game destination. Keep campaign arrivals separate from all Reddit-referrer visitors, since copied links and untagged visits can differ. Unique visitors overlap across games, channels, and days. Do not sum them into a site-wide unique total. Umami is not a persistent cross-device player identity, so cohort retention needs an explicitly supported report.

Use the Umami Events properties view for `guide_opened`, grouped by destination and location. This shows which guide shortcuts people choose. Use visitor counts over the same dates when comparing support-card views and clicks, with the same location filter. Raw event totals are not a visitor conversion rate.

Two planned Royal ordered funnels use a 60-minute maximum between consecutive steps:

1. School-answer page view → `guide_open_tracker` → `tracker_used`.
2. `support_card_view` → `support-card-click`.

The Reload guide funnel substitutes a Reload guide path and `p3_tracker_used`. A direct Reddit-to-Reload arrival does not need a guide-click step. Funnel definitions here are proposals, not proof that matching reports are saved in Umami. Allow real events to populate report options rather than generate test production activity.

The first tests whether a guide visit leads to manual tracker use. The second measures a support-card click after a recorded card impression; clicks made before the one-second impression threshold are intentionally excluded. Funnels require ordered actions, not just aggregate ratios. See [Umami funnels](https://docs.umami.is/docs/funnel). Exact saved-report configuration and IDs belong in the private execution ledger, not this public repository.

Actual revenue comes from Ko-fi receipts. A Ko-fi click is not a donation, and no payment or revenue event is fabricated. Compare matched 28-day periods after sufficient data accumulates. New events cannot reconstruct activity before this release.

Keep the original 30-day baseline labelled as 30 days. Obtain a separate 28-day prelaunch window before comparing it with 28 post-launch days. Record missing values as unknown rather than zero. Ko-fi receipts are site-wide unless the payer or a supported attribution field identifies a campaign or game.

## Verification

Run `npm test`, build the production bundle and lint new analytics modules. Test the preview with `window.umami.track` replaced by a local recorder before interaction. Verify a guide click, actual progress changes and rank/stat no-ops, successful/failed imports, backup restore, clipboard success and download start. Verify progress/import operations still work when analytics throws or rejects. Check support-card impression timing and deduplication across tab changes. Do not send fake usage or donation events to the production website to populate reports.
