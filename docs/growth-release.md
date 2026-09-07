# Growth and save-transfer release

P5 Tracker remains a free Persona 5 Royal browser companion. The game directory at `/P5Tracker/games/` presents Royal as available and other Persona editions and Metaphor as candidates. Suggestions do not imply a release commitment.

## Search pages

Vite copies `public/guides/` and `public/games/` into the production build. Each page has its own title, description, canonical URL and links to the app. `public/sitemap.xml` lists the four public entry pages. Keep that list aligned when adding or removing pages. The root HTML includes a brief description before React loads, plus metadata and WebApplication structured data without ratings or paid offers.

The deployment base remains `/P5Tracker/`. Moving to another origin requires a save migration plan because browser storage does not follow users across origins.

## Analytics

The existing Umami property measures production traffic. The script allows only `zucram.github.io`. New measurements use the existing integration and contain no save contents.

| Event | Meaning | Properties |
| --- | --- | --- |
| `task_checked` | A user checks an item in the tracker | None |
| `guide_open_tracker` | A guide's app link is clicked | `guide` |
| `guide_support_click` | A guide's Ko-fi link is clicked | `guide` |
| `game_open_tracker` | The game directory's Royal link is clicked | `game` |
| `hub_support_click` | The game directory's Ko-fi link is clicked | None |
| `share_complete` | The share API resolves or the link is copied | `method` |
| `next_game_interest` | A user submits a game suggestion | `game` |

Use unique visitors when comparing interest or engagement. Event counts can include repeat actions. A share completion does not prove that a recipient visited, and a support click does not prove payment. The share link uses `utm_source=app`, `utm_medium=share` and `utm_campaign=player_referral` to distinguish arrivals.

The next-game prompt remembers a submitted suggestion in the browser when storage is available. It is a directional interest signal, not an authenticated poll. When Umami is unavailable, users can use the existing feedback link.

## Release checks

Build with `npm run build`. Verify the app, both guide URLs and the game directory under the GitHub Pages base path. Check that the guides' app links select the intended tab. Test sharing with native sharing, clipboard-only support, and unavailable browser APIs. Keep production analytics stubbed during browser tests.

Validate save round trips and rejected imports with the save-data tests. A successful import must preserve a recoverable previous save. Verify downloaded backups separately from browser-local recovery.

The existing full-repository lint baseline contains errors in legacy components and hooks. New components must pass targeted ESLint without adding to that baseline.
