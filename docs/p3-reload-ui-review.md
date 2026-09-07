# Reload browser review

Reviewed 2026-09-07 on the private Vite preview at port 4174, using a dedicated browser tab at 1280 × 800 and 390 × 844. This checks browser behavior and layout. It does not validate a playthrough in the game or establish that every route is achievable.

Umami was stubbed before interactions. Test saves stayed on the private preview origin. No Royal data was cleared. Preview tabs share browser storage, so the test used the current Reload save and preserved it during the import recovery check.

| Check | Observed result |
| --- | --- |
| Desktop layout | Hero, date controls and stat controls were readable without overlap. |
| Mobile layout | Planner, Social Links and deadline cards fit the viewport without page-level horizontal overflow. The long deadline status option truncates inside its native select. |
| Date controls | Selecting June 30 and clicking Next day changed the date to July 1. |
| Social Links | Increasing Magician to rank 1 worked. Adding it to priorities appeared in My goals. Confirming Emperor's introduction persisted and made its usual July 1 activity available to check. |
| Spoiler controls | Social Links hid character names and notes by default. Planner and deadline entries used anonymous episode chains and rescue floors with event names hidden. This was a sampled review, not an exhaustive spoiler audit. |
| Goals | Adding “Preview QA goal” created the monthly goal. |
| Deadlines | All dates plus Missing people showed 20 rescue entries. A completion check persisted without advancing the date. |
| Restore | Pasted a valid save changing Courage from 1 to 4. Restore previous import returned Courage to 1 and restored the exact pre-import save text. |
| Runtime | No uncaught errors or unhandled promise rejections appeared during the instrumented app interactions. |
| Guides | Social Links rendered 22 rows. Deadline tables rendered 20 rescues, 14 dated requests and 30 Linked Episode entries in the reviewed build. Both pages had the intended production canonical URL and row-level source links. Counts follow canonical data and can change after review. |
| Guide mobile layout | Both pages fit 390 pixels after styles loaded. Wide tables scroll inside their own focusable containers. |
| Hub navigation | Royal, Reload and all linked guide paths returned HTTP 200. Reload is listed as available in beta. |

The final preview bundle `reload-Mjwh9yL8.js` corrected both initial findings. Current windows in April showed zero entries instead of disputed future events, and the mounted app had the `planner` anchor. Disputed entries in All dates used “Reported timing”. Inline prerequisite completion controls were present. The revised mobile hero, compact completion count and date controls fit 390 pixels without page overflow. The H1 read “Persona 3 Reload calendar planner.” No new runtime errors appeared in this final pass.

File-upload import, physical mobile browser behavior and in-game outcomes were not tested.
