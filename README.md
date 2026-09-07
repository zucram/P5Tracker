# P5 Tracker

**[👉 Open the Live Tracker](https://zucram.github.io/P5Tracker/)**

A modern, mobile-first companion app for **Persona 5 Royal**. 

This interactive tracker helps you optimize your playthrough with a "Soft-Guide" approach. Instead of a rigid day-by-day checklist, it provides monthly strategic objectives, ensuring you never miss a deadline while giving you the freedom to play your way.

## Support & Feedback

The current release is **v2.4.0**.

If you find this tracker helpful for your heist, consider supporting the maintenance and future updates:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K11RWTSL)

Feedback, bug reports, and strategy corrections are welcome via [GitHub Issues](https://github.com/zucram/P5Tracker/issues).

## Planning and save transfer

Find [Royal school and exam answers by date](https://zucram.github.io/P5Tracker/guides/school-answers/) on the new searchable page.

Use the [third-semester requirement checker](https://zucram.github.io/P5Tracker/guides/third-semester/) to check Maruki's rank and deadline without changing your save.

Read the [monthly planning guide](https://zucram.github.io/P5Tracker/guides/monthly-checklist/) or [confidant tracking guide](https://zucram.github.io/P5Tracker/guides/confidant-tracker/).

Use **Sync Terminal** to download a backup or import a `.txt` or `.json` save file. Imports validate the data before applying it and keep one previous save in this browser for recovery. Browser-local recovery is lost if you clear site data, so keep a downloaded backup too. Saves do not synchronize automatically between devices.

The [game directory](https://zucram.github.io/P5Tracker/games/) lists Royal as available and other games as candidates. Suggest the next game using the prompt at the bottom of the app. No other tracker or release date is promised.

See [release implementation notes](docs/growth-release.md) for search pages, analytics and validation. Run save validation tests with `node --test src/lib/saveData.test.js`.

## Gallery

### Mobile Experience
<p float="left">
  <img src="docs/assets/mobile-home.png" width="30%" />
  <img src="docs/assets/mobile-confidants.png" width="30%" /> 
  <img src="docs/assets/mobile-tasks.png" width="30%" />
</p>

### Desktop Command Center
![Desktop Home](docs/assets/desktop-home.png)

## Features

### 📅 Phantom Calendar
*   **Smart Timeline:** Tracks your current position in the game.
*   **Intelligent Backlog:** Automatically carries over important tasks (Confidants, Mementos requests) if you miss them in previous months.
*   **Missable Filter:** Hides expired date-specific events (like classroom answers) to keep your dashboard clean.

### 🎭 Confidant Command Center
*   **Rank Roadmap:** Visualizes exactly what rank you need to be at for every month to stay on track for a 100% run.
*   **Interaction Guide:** Built-in cheat sheet for every Confidant. Tap to see the best dialogue choices and gifts for your current rank.
*   **Gate Awareness:** Automatically warns you if your Social Stats are too low to progress (e.g., "⚠️ Blocked: Requires Guts Lv.4").

### ⚔️ Palace & Mementos Intel
*   **Dynamic Filtering:** Automatically shows the Palace and Mementos path relevant to your current game month.
*   **Will Seed Locator:** Step-by-step guides to find every Will Seed.
*   **Boss Strategy:** Key tips and recommended Personas for every major boss.

### 📖 Persona Registry
*   **Complete Database:** A fully searchable compendium of all 232 Royal Personas.
*   **Smart Tracking:** Filter by Arcana and track your collection percentage directly from the new Registry view.
*   **Metaverse Sync:** Catching a Persona in a Palace guide automatically marks it as 'Registered'.

### 🧠 Social Stat Dashboard
*   Track your Knowledge, Guts, Proficiency, Kindness, and Charm.
*   See real-time feedback on which stats are bottlenecking your relationships.

## 🚀 Future Roadmap

*   **Resources & Reference Hub:** Centralized links to proven 100% walkthroughs and a searchable Classroom/Exam/Crossword cheat sheet.
*   **PWA Support:** Full offline access and installable app experience for iOS and Android.
*   **Fusion Calculator:** Integrated tool for checking fusion recipes and skill requirements.

## Tech Stack

*   **Frontend:** React 19 + Vite
*   **Styling:** Tailwind CSS (Glassmorphism UI)
*   **Icons:** Lucide React
*   **Persistence:** Local Storage (Privacy-first, no server required)

## Getting Started

### Prerequisites
*   Node.js (v18 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/zucram/P5Tracker.git
    cd P5Tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Build for production:
    ```bash
    npm run build
    npm run preview
    ```

## Project Structure

*   `src/App.jsx`: Main application logic and UI controller.
*   `src/data/gameData.js`: The "Brain" of the guide. Contains all monthly tasks, palace details, and mementos requests.
*   `src/data/confidantData.js`: Detailed interaction guides (Dialogue choices & Gifts).
*   `src/data/socialStats.js`: Stat requirements and gate logic.

## Credits

Based on the comprehensive strategic analysis of Persona 5 Royal's mechanics.
Data sourced from community experts (GameFAQs, Samurai Gamers, RPG Site) and cross-referenced for the "Royal" edition.

### Changelog
View the full history of updates in [CHANGELOG.md](CHANGELOG.md).

### Transparency
This project was built with the assistance of AI (Google Gemini) to handle architectural refactoring and data synthesis. The strategy content itself was compiled by browsing public guides and walkthroughs to curate the most "essential" optimization path for players.

---
*Take your time.*

School answer data lives in `src/data/schoolAnswers.json`, with source evidence for each date. After editing it, run `npm run build:guides` to update the static page. `npm run build` checks that the generated page is current. See [school answer maintenance](docs/school-answers.md).

## Persona 3 Reload companion

[Open the Reload companion](https://zucram.github.io/P5Tracker/p3/) for monthly planning, all 190 manual Social Link ranks, all 101 Elizabeth requests, combat, fusion, equipment, dorm activities and saved collections. Beta means individual details may need correction. The companion covers the main campaign; Episode Aigis is separate. Read [release scope and validation](docs/p3-reload-release.md) and [source evidence](docs/p3-reload-calendar-evidence.md) before extending calendar rules.


## Site entry points

The shared start page is https://zucram.github.io/P5Tracker/. Royal lives at `/P5Tracker/p5/` and Reload at `/P5Tracker/p3/`. Both trackers link back to the shared page. Internal guide links and per-game sharing use the short routes.

Vite builds all three entry points plus compatibility pages for `/games/` and `/games/persona-3-reload/`. The compatibility pages redirect in the browser while preserving query strings and view fragments; they include ordinary links for readers without JavaScript. Old Royal root fragments such as `/#calendar` redirect to `/p5/#calendar`. The bare root always opens the chooser. This static host does not provide HTTP 301 redirects.

No save migration is needed: the origin and per-game localStorage keys are unchanged. Canonicals and the sitemap use the new routes. Tests cover redirect targets and retained query/fragment values.
