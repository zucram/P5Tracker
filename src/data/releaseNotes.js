export const RELEASE_NOTES = [
  {
    version: "2.5.2",
    date: "2026-09-07",
    title: "One start page for both trackers",
    description: "Choose Royal or Reload from the shared homepage and share a shorter game link.",
    sections: [{ title: "Navigation", items: [
      "Royal and Reload now have short /p5/ and /p3/ addresses, with All games links in both trackers.",
      "Existing tracker bookmarks still work. Saved progress stays in the same browser storage."
    ] }]
  },
  {
    version: "2.5.1",
    date: "2026-09-07",
    title: "Reload follows the Royal tracker layout",
    description: "Plan Reload month by month with familiar navigation, useful checklists and more game data.",
    sections: [{ title: "Reload calendar and reference", items: [
      "Use Briefing, Calendar, Social Links, Tartarus and More, with bottom navigation on mobile.",
      "Monthly checklists now include school answers, Social Link introductions and Tartarus floor goals alongside rescues and requests.",
      "Look up social-stat activities with locations, schedules, costs and rewards. Existing Reload saves remain compatible."
    ] }]
  },
  {
    version: "2.5.0",
    date: "2026-09-07",
    title: "Persona 3 Reload companion beta",
    description: "Plan your next day in Reload with Social Links, deadline reminders and your own monthly goals.",
    sections: [{ title: "Reload is available", items: [
      "Find the Reload planner through Game companions or the new Reload link in the tracker.",
      "Check missing-person deadlines, Elizabeth requests and Linked Episode windows, with sources and saved checkmarks.",
      "The beta uses usual link schedules and reviewed calendar blocks. It does not guarantee a perfect run."
    ] }]
  },
  {
    version: "2.4.3",
    date: "2026-09-07",
    title: "Better usage measurement",
    description: "Anonymous feature events help us see which guides and tracker tools are useful.",
    sections: [{ title: "Privacy", items: [
      "Guide links, manual progress changes and save transfers now report feature use to Umami.",
      "These events do not send save contents, character ranks, stat levels, filenames or typed text."
    ] }]
  },
  {
    version: "2.4.2",
    date: "2026-09-07",
    title: "Guides within reach",
    description: "Find answers and planning help directly from the tracker.",
    sections: [{ title: "Navigation", items: [
      "Calendar and Confidants now show links to relevant guides above their content.",
      "Find every published guide and the game directory at the top of More and the Reference Hub.",
      "Briefing includes shortcuts to monthly planning, school answers and the Maruki deadline check."
    ] }]
  },
  {
    version: "2.4.1",
    date: "2026-09-07",
    title: "Reviewed school and exam answers",
    description: "Look up 68 Royal classroom and exam dates in the tracker or the new searchable guide.",
    sections: [
      {
        title: "Answer corrections",
        items: [
          "Corrected July answers and replaced the old July exam group with Royal's dated exam choices.",
          "Added 28 missing answer dates. Existing dated answer checkmarks are preserved.",
          "The new school answers guide supports month, exam and text filters, and works without JavaScript."
        ]
      }
    ]
  },
  {
    version: "2.4.0",
    date: "2026-09-07",
    title: "Safer saves and your next game",
    description: "Move your progress between devices more safely and help choose the next companion.",
    sections: [
      {
        title: "Save transfer",
        items: [
          "Import a save file or paste your existing save text. Invalid saves leave your progress unchanged.",
          "Restore the previous local save after an import. Download backups to keep a copy outside your browser."
        ]
      },
      {
        title: "Find and share the tracker",
        items: [
          "Read the new monthly planning and confidant tracking guides.",
          "Share a public tracker link without including your save data.",
          "Visit Game companions and suggest the Persona or Metaphor tracker you would use next. Royal is the only available tracker today."
        ]
      }
    ]
  },
  {
    version: "2.3.0",
    date: "2026-01-16",
    title: "The Compendium Update",
    description: "The Persona Registry is finally here! Track your collection and sync your progress across the Metaverse.",
    sections: [
      {
        title: "📖 Persona Registry",
        items: [
          "**Complete Database:** A fully searchable compendium of all 232 Royal Personas.",
          "**Smart Tracking:** Filter by Arcana and track your collection percentage directly from the new Registry view.",
          "**Integrated Intel:** Includes data for Special Fusions, DLC content, and Treasure Demons."
        ]
      },
      {
        title: "🔄 Metaverse Sync",
        items: [
          "**Cross-Tracking:** Catching a Persona in a Palace guide automatically marks it as 'Registered' in your Compendium.",
          "**Unified Progress:** Your collection status is shared globally across the app."
        ]
      },
      {
        title: "📱 Mobile Polish",
        items: [
          "**Sticky Controls:** The Registry features a new sticky-header layout for effortless browsing on mobile.",
          "**Fluid Scrolling:** Optimized the list view to feel native and responsive on touchscreens."
        ]
      }
    ]
  },
  {
    version: "2.2.5",
    date: "2026-01-15",
    title: "The Navigation Overhaul",
    description: "Unified the Metaverse view and introduced the System Menu to streamline your tactical experience.",
    sections: [
      {
        title: "⚔️ Unified Metaverse",
        items: [
          "**Consolidated View:** Palaces and Mementos are now found under a single **Metaverse** tab.",
          "**Toggle Switch:** Easily switch between Palace intel and Mementos requests with the new top-bar toggle.",
          "**Backlog Sync:** Mementos history and Palace progress still auto-manage based on your anchored month."
        ]
      },
      {
        title: "📂 The 'More' Menu",
        items: [
          "**System Hub:** Created a dedicated 'More' menu to house utility features and future expansion content.",
          "**Registry Placeholder:** Added a new **Persona Registry** section (under construction) to eventually track your Compendium progress.",
          "**Reference Hub:** Moved external links and calculators into the System Hub for a cleaner primary navigation.",
          "**UX Polish:** Redesigned the System Hub to be extremely mobile-friendly with a compact list-style layout."
        ]
      },
      {
        title: "🛠️ System Improvements",
        items: [
          "**Browser Navigation:** Implemented hash-based routing (#calendar, #metaverse), enabling the use of browser Back/Forward buttons.",
          "**State Migration:** Existing users will be automatically redirected to the correct new views if they had legacy tabs saved.",
          "**Header Cleanup:** Restored the Sync Terminal to its original position for easier access while maintaining a clean UI."
        ]
      }
    ]
  },
  {
    version: "2.2.4",
    date: "2026-01-13",
    title: "The Intelligence Update",
    description: "Refined the data hierarchy and implemented sequential crossword tracking.",
    sections: [
      {
        title: "🧩 Crossword Mastery",
        items: [
          "**Sequential Tracking:** Crosswords are now tracked by their sequence (Q1-Q38) rather than just dates, matching the actual game logic.",
          "**Smart Calendar:** Calendar tasks now show the *next* answer you actually need based on your progress.",
          "**How to Sync:** If your count looks wrong after this update, just go to the **Briefing** tab (formerly Guide) and check/uncheck the puzzles to match your in-game state. Your Calendar will auto-sync!"
        ]
      },
      {
        title: "📂 Navigation & Hierarchy",
        items: [
          "**Roadmap → Calendar:** Renamed for better intuition.",
          "**Guide → Briefing:** Consolidated all core in-game knowledge (Social Stats, Answers, Routines).",
          "**Library → Reference:** Dedicated space for external tools and future tracker placeholders."
        ]
      }
    ]
  },
  {
    version: "2.2.3",
    date: "2026-01-13",
    title: "The Library Update",
    description: "Introduced the Reference Library and performed a massive readability overhaul across the entire app.",
    sections: [
      {
        title: "📚 Reference Library",
        items: [
          "**Curated Intel:** Added a new Library tab featuring community-standard tools, calculators, and detailed archives.",
          "**Future Operations:** Added placeholders for upcoming P3R, Metaphor, and P4R trackers.",
          "**Mobile Optimization:** Refined the layout to ensure external tools are easy to access on any device."
        ]
      },
      {
        title: "👁️ Readability Overhaul",
        items: [
          "**Typography Upgrade:** Increased global font sizes across all tabs for better accessibility and couch-play legibility.",
          "**Visual Hierarchy:** Shifted from all-caps to sentence case for body text, making instructions and notes significantly faster to scan.",
          "**Functional Colors:** Improved contrast by reserving pure white for key data and using muted greys for descriptions, reducing eye strain."
        ]
      }
    ]
  },
  {
    version: "2.2.2",
    date: "2026-01-12",
    title: "The Phantom Signal",
    description: "Implemented new background systems to better understand how Thieves use the app.",
    sections: [
      {
        title: "📡 Signal Analysis",
        items: [
          "**Engagement Tracking:** Added secure, private metrics to help us balance future features based on real usage.",
          "**Smart Notifications:** Implemented a new non-intrusive messaging system for important updates, community alerts, and support engagement.",
          "**System Optimization:** Refined the event handling for smoother performance on long playthroughs."
        ]
      }
    ]
  },
  {
    version: "2.2.1",
    date: "2026-01-12",
    title: "The Strategic Update",
    description: "Refined the Mission Critical system and introduced a dedicated Strategy Briefing.",
    sections: [
      {
        title: "🧠 Strategic Briefing",
        items: [
          "**New Section:** Non-actionable advice (like 'Clear Palace ASAP') is now separated into a dedicated blue 'Strategic Briefing' card.",
          "**Mission Critical:** The red warning section is now strictly for deadlines and game-over conditions.",
          "**Chronological Timeline:** Tasks in the standard timeline are now automatically sorted by date."
        ]
      },
      {
        title: "📅 Calendar Refinements",
        items: [
          "**Consistent Deadlines:** Every Palace month now clearly separates the 'Deadline' (Requirement) from the 'Strategy' (Recommendation).",
          "**Temporal Accuracy:** Deadlines now only appear in the month they occur (e.g., Madarame deadline moved to June).",
          "**Visual Polish:** Enhanced visibility for strategic tips."
        ]
      }
    ]
  },
  {
    version: "2.1.0",
    date: "2026-01-10",
    title: "The Phantom Refactor",
    description: "A massive Mobile UX overhaul to reduce scrolling and improve density.",
    sections: [
      {
        title: "📱 Mobile UX Redesign",
        items: [
          "**Compact Confidants:** Replaced large cards with a sleek accordion list.",
          "**Inline Controls:** Rank Up/Down buttons are now directly in the list view.",
          "**Aggressive Density:** Reduced font sizes and padding across all tabs.",
          "**Space-Saving Header:** Smaller header and navigation on mobile."
        ]
      },
      {
        title: "🗄️ History Management",
        items: [
          "**Archived Palaces:** Completed Palaces are now hidden by default (toggleable).",
          "**Previous Mementos:** Past paths are grouped into a collapsed accordion."
        ]
      },
      {
        title: "🛠️ Fixes & Improvements",
        items: [
          "**Dynamic Versioning:** App now shows the live version number.",
          "Fixed 'Path of Da'at' history bug.",
          "Fixed auto-expansion logic for multi-month Palaces.",
          "Added 'Support' button for Ko-fi."
        ]
      }
    ]
  }
];
