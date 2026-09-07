# Growth and save-transfer release

P5 Tracker remains a free Persona 5 Royal browser companion. The game directory at `/P5Tracker/games/` presents Royal as available and other Persona editions and Metaphor as candidates. Suggestions do not imply a release commitment.

## Search pages

Vite copies `public/guides/` and `public/games/` into the production build. Each page has its own title, description, canonical URL and links to the app. `public/sitemap.xml` lists the five public entry pages. Keep that list aligned when adding or removing pages. The root HTML includes a brief description before React loads, plus metadata and WebApplication structured data without ratings or paid offers.

The deployment base remains `/P5Tracker/`. Moving to another origin requires a save migration plan because browser storage does not follow users across origins.

## Analytics

The existing Umami property measures production traffic. The script allows only `zucram.github.io`. New measurements use the existing integration and contain no save contents.

| Event | Meaning | Properties |
| --- | --- | --- |
| `task_checked` | A user checks an item in the tracker | None |
| `guide_check_used` | The third-semester checker is submitted | `guide` |
| `guide_open_tracker` | A guide's app link is clicked | `guide` |
| `guide_support_click` | A guide's Ko-fi link is clicked | `guide` |
| `game_open_tracker` | The game directory's Royal link is clicked | `game` |
| `hub_support_click` | The game directory's Ko-fi link is clicked | None |
| `share_complete` | The share API resolves or the link is copied | `method` |
| `next_game_interest` | A user submits a game suggestion | `game` |

Use unique visitors when comparing interest or engagement. Event counts can include repeat actions. A share completion does not prove that a recipient visited, and a support click does not prove payment. The share link uses `utm_source=app`, `utm_medium=share` and `utm_campaign=player_referral` to distinguish arrivals.

The next-game prompt remembers a submitted suggestion in the browser when storage is available. It is a directional interest signal, not an authenticated poll. When Umami is unavailable, users can use the existing feedback link.

## Release checks

Build with `npm run build`. Verify the app, all three guide URLs and the game directory under the GitHub Pages base path. Check that the guides' app links select the intended tab. Test sharing with native sharing, clipboard-only support, and unavailable browser APIs. Keep production analytics stubbed during browser tests.

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
