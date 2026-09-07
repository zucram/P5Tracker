# Reload browser review

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
