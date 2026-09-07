# Usage measurement

P5 Tracker uses Umami page views and feature events to measure discovery, use and support interest. Events appear automatically when received; their names do not need registration in Umami. See [Umami event tracking](https://docs.umami.is/docs/track-events).

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

`tracker_used` counts active page loads, not lifetime activation or unique people. Hash-tab changes do not reset it; a full reload or return from a static guide does. Importing a save and restoring existing state do not trigger manual-use events. Rank/stat changes at their bounds do not count. Checklist events include registry and crossword checks; checking and unchecking both count as manual changes. A download-start event does not prove that a file was written to disk. A card-view event measures viewport intersection, not attention; background tabs, blocked analytics and unavailable IntersectionObserver limit the measurement.

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

Use the Umami Events properties view for `guide_opened`, grouped by destination and location. This shows which guide shortcuts people choose. Use visitor counts over the same dates when comparing support-card views and clicks, with the same location filter. Raw event totals are not a visitor conversion rate.

Two planned ordered funnels use a 60-minute maximum between consecutive steps:

1. School-answer page view → `guide_open_tracker` → `tracker_used`.
2. `support_card_view` → `support-card-click`.

The first tests whether a guide visit leads to manual tracker use. The second measures a support-card click after a recorded card impression; clicks made before the one-second impression threshold are intentionally excluded. Funnels require ordered actions, not just aggregate ratios. See [Umami funnels](https://docs.umami.is/docs/funnel). Exact saved-report configuration and IDs belong in the private execution ledger, not this public repository.

Actual revenue comes from Ko-fi receipts. A Ko-fi click is not a donation, and no payment or revenue event is fabricated. Compare matched 28-day periods after sufficient data accumulates. New events cannot reconstruct activity before this release.

## Verification

Run `npm test`, build the production bundle and lint new analytics modules. Test the preview with `window.umami.track` replaced by a local recorder before interaction. Verify a guide click, actual progress changes and rank/stat no-ops, successful/failed imports, backup restore, clipboard success and download start. Verify progress/import operations still work when analytics throws or rejects. Check support-card impression timing and deduplication across tab changes. Do not send fake usage or donation events to the production website to populate reports.
