# Reload browser review

## Version 2.6.2

Reviewed 7 September 2026 in isolated Chromium contexts. The desktop Social Link grid now uses rows with full-width guide details. Mobile uses compact rows with answers first. Answers, Relationship & affinity, and Sources replace nested guide disclosures.

- At 1280, 820, 390, and 320 pixels, story, manual, romance, and final-link rows opened without horizontal page overflow.
- Rank controls operated independently of expansion. Browsing rank answers and sources left stored progress unchanged.
- Explicit rank completion and relationship choices survived reload. Previewing later ranks did not advance the saved rank.
- Requests, dorm activities, study references, combat, and equipment lookups rendered without page errors. Request 51 linked to its equipment help.
- Royal's labelled Guide and Close controls worked on desktop and mobile. Long headers and footer links fitted 320 pixels.
- All 87 automated tests, the production build, and changed Reload module lint passed. Royal lint retained its previous seven errors and one warning.

The shared preview client was unavailable during final UX verification, so the final pass used isolated headless Chromium. Tests did not modify the user's production saves or emit production analytics. Physical phones and a complete in-game playthrough remain unverified.

Pages workflow `34119639694` succeeded for commit `9104442`. Live JavaScript and CSS matched the reviewed assets by SHA-256. Launch screenshots later captured the live 2.6.2 calendar and Social Link guide.

## Earlier version 2.5.1 review

Reviewed 2026-09-07 for version 2.5.1 on the private Vite preview at port 4174. Independent browser review compared Royal and Reload at 1280 × 800 and 390 × 844. It checks the browser experience, not an in-game playthrough.

| Check | Observed result |
| --- | --- |
| Shared layout | Both trackers use a compact header, colored divider, five-tab navigation, month arrows, current-month marker and monthly checklist hierarchy. Reload has a blue theme. |
| Mobile | Fixed bottom navigation remained within the viewport. Neither reviewed size had horizontal page overflow. |
| Month browsing | Browsing May left the saved April 24 active state unchanged. |
| Checklist persistence | April 8 school-answer completion survived a page reload. |
| Rank persistence | Increasing Magician rank survived reload. |
| Navigation | Opening Social Links from an April target moved to the top after the scroll fix. |
| Source disclosure | Expanding an answer row showed its answer and RPG Site source link. |
| Save transfer | Downloaded JSON included ranks and checked tasks. Import accepted the previously released schema-2 save. |
| Data preservation | The reviewer restored both original Reload storage keys byte-for-byte. Royal storage was unchanged. |

Tests used the private preview origin. Production Umami domain filtering excludes it. Physical mobile browsers, file-upload import and an actual game playthrough were not tested in this review. Wider 100% route claims remain unsupported.
