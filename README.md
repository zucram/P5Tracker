# P5 Tracker

[Choose a tracker](https://zucram.github.io/P5Tracker/) · [Persona 5 Royal](https://zucram.github.io/P5Tracker/p5/) · [Persona 3 Reload](https://zucram.github.io/P5Tracker/p3/)

Free browser companions for planning a Persona playthrough. Follow monthly objectives, record progress, and look up answers while choosing your own daily schedule. Neither tracker guarantees a perfect 100% route.

The current release is **2.6.4**. Reload covers the main campaign and remains in beta because individual details may need correction. Episode Aigis, FES, and Portable are outside its scope.

## Trackers and guides

Royal includes monthly checklists, confidant ranks and dialogue, social stats, Palace and Mementos guidance, and a Persona registry. Its static guides cover [crossword answers](https://zucram.github.io/P5Tracker/guides/persona-5-royal-crossword-answers/), [school answers](https://zucram.github.io/P5Tracker/guides/school-answers/), [Maruki and third-semester requirements](https://zucram.github.io/P5Tracker/guides/third-semester/), [monthly planning](https://zucram.github.io/P5Tracker/guides/monthly-checklist/), and [confidant tracking](https://zucram.github.io/P5Tracker/guides/confidant-tracker/).

Reload includes April through January checklists, all 22 Social Links, 190 manual rank guides, all 101 Elizabeth requests, rescues, Linked Episodes, fusion, combat, equipment, dorm activities, and collections. Read [release scope and limits](docs/p3-reload-release.md) and the [coverage audit](docs/p3-reload-completion-audit.md).

Reload's six static guides cover [school answers](https://zucram.github.io/P5Tracker/guides/persona-3-reload-school-answers/), [Social Link requirements](https://zucram.github.io/P5Tracker/guides/persona-3-reload-social-links/), [deadlines](https://zucram.github.io/P5Tracker/guides/persona-3-reload-deadlines/), [rank answers](https://zucram.github.io/P5Tracker/guides/persona-3-reload-social-link-answers/), [Elizabeth requests](https://zucram.github.io/P5Tracker/guides/persona-3-reload-elizabeth-requests/), and [fusion](https://zucram.github.io/P5Tracker/guides/persona-3-reload-fusion-guide/).

Both trackers use the same navigation pattern with separate game themes. Reload Social Links use desktop rows with full-width guide details and compact mobile rows. Answers, relationship guidance, and sources have separate views inside each guide.

## Saves, support, and feedback

Progress stays in browser storage. Use **Sync** to export or import a backup. Imports validate data and retain one previous save in that browser. Keep a downloaded backup because clearing site data also removes browser-local recovery. Royal and Reload have separate saves. Neither tracker reads game save files or syncs automatically between devices.

The apps are free, with no ads or required account. [Optional Ko-fi support](https://ko-fi.com/K3K11RWTSL) helps with maintenance and content checks. Report bugs and factual corrections through [GitHub Issues](https://github.com/zucram/P5Tracker/issues).

## Development

The app uses React, Vite, Tailwind CSS, Lucide icons, and localStorage. Use a Node.js version supported by the installed Vite package. CI uses Node 20.

```sh
npm ci
npm run dev
```

For verification and a production preview:

```sh
npm test
npm run build
npm run preview
```

After changing generated guide data, run `npm run build:guides`. After changing Reload Persona or request IDs, run `npm run build:catalog`. Prebuild validates the Reload knowledge collection and checks generated-page freshness. See [Royal school-answer maintenance](docs/school-answers.md) and the [Reload data inventory](knowledge/p3-reload/README.md).

The full ESLint check has a known legacy Royal baseline. Record that baseline when changing affected code, and lint new modules separately. The [browser review](docs/p3-reload-ui-review.md) records the latest UX checks and their limits.

## Site entry points

The shared start page is `/P5Tracker/`. Royal lives at `/P5Tracker/p5/` and Reload at `/P5Tracker/p3/`. Both trackers link back to the chooser.

Compatibility pages for `/games/` and `/games/persona-3-reload/` redirect in the browser while preserving queries and fragments. Old Royal root fragments such as `/#calendar` redirect to `/p5/#calendar`. The bare root opens the chooser. GitHub Pages does not provide HTTP 301 redirects for these pages.

The origin and save keys are unchanged, so these route changes need no save migration. A future domain change requires a separate migration plan. Additional games and domains have no committed release dates.

## Maintenance documentation

For launch follow-up, analytics reviews, Reddit feedback, SEO, or support reporting, start with the [short agent guide](docs/post-launch-agent-guide.md).

- [Search pages and release operations](docs/growth-release.md)
- [Analytics events and reporting limits](docs/analytics.md)
- [Reload release scope and verification](docs/p3-reload-release.md)
- [Reload calendar evidence](docs/p3-reload-calendar-evidence.md)
- [Changelog](CHANGELOG.md)

## Royal gallery

These images show earlier Royal screens, not the current Reload layout.

<p float="left">
  <img src="docs/assets/mobile-home.png" width="30%" alt="Royal mobile home" />
  <img src="docs/assets/mobile-confidants.png" width="30%" alt="Royal confidant list" />
  <img src="docs/assets/mobile-tasks.png" width="30%" alt="Royal monthly tasks" />
</p>

![Earlier Royal desktop view](docs/assets/desktop-home.png)

## Sources and transparency

Development uses AI assistance. Game guidance combines linked community references with extracted game data where documented. Sources, reuse terms, disagreements, and verification limits belong with their datasets. Source review and browser tests do not establish a complete in-game playthrough. Corrections are welcome.

This is an unofficial fan project, unaffiliated with ATLUS or SEGA.
