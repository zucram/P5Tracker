export const RESOURCE_DATA = [
  {
    id: 'tools',
    title: 'Computational Tools',
    icon: 'Cpu',
    color: 'text-blue-500',
    description: 'Calculators and databases for Fusion optimization and damage math.',
    items: [
      {
        title: 'Chinhodado Fusion Calculator',
        desc: 'Royal fusion recipes with settings for DLC Personas and Treasure Demon combinations.',
        format: 'tool',
        url: 'https://chinhodado.github.io/persona5_calculator/indexRoyal.html',
        isGold: true
      },
      {
        title: 'aqiu384 Database',
        desc: 'A detailed Royal walkthrough covering confidant events, activities and conditions.',
        format: 'tool',
        url: 'https://aqiu384.github.io/megaten-database/p5r/ace-walkthrough'
      },
      { 
        title: 'Technical Damage Mechanics', 
                    desc: 'Video guide explaining the massive damage multipliers of Technical hits in Royal.', 
                    format: 'video', 
                    url: 'https://www.youtube.com/watch?v=dAfWbk_YPcY' 
                  }    ]
  },
  {
    id: 'guides',
    title: '100% Completion Guides',
    icon: 'BookOpen',
    color: 'text-yellow-500',
    description: 'The "Bibles" of P5R completion. Use these for detailed day-by-day scripts.',
    items: [
      {
        title: 'The Ace Guide (Perfect Schedule)',
        desc: 'The definitive 100% schedule. Covers every single book, game, and award.',
        format: 'guide',
        url: 'https://gamefaqs.gamespot.com/ps4/260936-persona-5-royal/faqs/78212',
        isGold: true
      },
                  { 
                    title: 'Steam 100% Achievement Guide', 
                    desc: 'Excellent formatting for tracking trophies alongside a perfect run.', 
                    format: 'guide', 
                    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2877808380' 
                  },
                  { 
                    title: 'Confidant One-Sheet',                          desc: 'A high-resolution image for quick reference, derived from Hardcore Gamer data.', 
                          format: 'guide', 
                          url: 'https://www.reddit.com/r/Persona5/comments/v7bqg1/persona_5_royal_social_link_guide_one_sheet/' 
                        },
                  { 
                    title: 'Detailed Confidant Guide', 
                    desc: 'The original source data for the One-Sheet. Full text walkthroughs for every rank event.', 
                    format: 'guide', 
                    url: 'https://hardcoregamer.com/features/persona-5-royal-confidant-guide/370507/' 
                  }    ]
  },
  {
    id: 'tactical',
    title: 'Tactical & Combat',
    icon: 'Sword',
    color: 'text-red-500',
    description: 'Specific strategies for bosses, negotiation, and advanced systems.',
    items: [
      {
        title: 'Okumura "Merciless" Strategy',
        desc: 'The famous strategy for beating the game\'s most notorious difficulty spike.',
        format: 'guide',
        url: 'https://www.reddit.com/r/Persona5/comments/1837qde/revised_okumura_boss_strategy/',
        isGold: true
      },
      { 
        title: 'P5R Mechanics Playlist (Rozalin)', 
        desc: 'Deep dive video series covering everything from Jazz Jin stats to technical damage.', 
        format: 'video', 
        url: 'https://www.youtube.com/playlist?list=PLJxN5QVxCwGqgBcNsKMjycIpYzIWrcfN_' 
      },
      {
        title: 'Joyce Chen Negotiation Tool',
        desc: 'Interactive search for Shadow personalities and best recruitment answers.',
        format: 'tool',
        url: 'https://joyceychen.com/persona5-negotiation/royal.html'
      },
      {
        title: 'Jazz Jin Skill Schedule',
        desc: 'List of which Sunday cocktails grant specific skills to your teammates.',
        format: 'guide',
        url: 'https://www.reddit.com/r/Persona5/comments/lbuj89/for_beginners_the_jazz_club/'
      },
      {
        title: 'Technical Rank Progression',
        desc: 'Guide to improving Technical damage through billiards and reaching Rank 4.',
        format: 'video',
        url: 'https://www.youtube.com/watch?v=kfYC0aAliw4'
      }
    ]
  },
  {
    id: 'archive',
    title: 'Completionist Archives',
    icon: 'Trophy',
    color: 'text-purple-500',
    description: 'Visual guides and checklists for collectibles and accolades.',
    items: [
      {
        title: 'All Will Seed Locations',
        desc: 'Visual walkthrough for every seed, including grappling hook shortcuts.',
        format: 'video',
        url: 'https://www.youtube.com/watch?v=GafS4qA8m-c'
      },
      {
        title: 'Thieves Den Awards Checklist',
        desc: 'Spreadsheet for tracking progress across multiple save files.',
        format: 'guide',
        url: 'https://www.reddit.com/r/Persona5/comments/i9ycw0/a_guide_on_acquiring_every_thieves_den_award/'
      },
      {
        title: 'Room Decoration Guide',
        desc: 'How to unlock every cosmetic item for Joker\'s room at LeBlanc.',
        format: 'guide',
        url: 'https://steamcommunity.com/sharedfiles/filedetails/?l=swedish&id=3357898762'
      }
    ]
  },
  {
    id: 'lore',
    title: 'Lore & Analysis',
    icon: 'Sparkles',
    color: 'text-pink-500',
    description: 'Deep dives into character psychology and narrative themes.',
    items: [
      {
        title: 'The Psychology of Dr. Maruki',
        desc: 'Professional analysis of the Third Semester antagonist\'s messiah complex.',
        format: 'video',
        url: 'https://www.youtube.com/watch?v=8D7euqMTk-k'
      },
      {
        title: 'Goro Akechi in Sociocultural Context',
        desc: 'Analysis of Akechi\'s rage through the lens of the Japanese family registry.',
        format: 'video',
        url: 'https://www.youtube.com/watch?v=Ia8D664sof8'
      }
    ]
  },
  {
    id: 'community',
    title: 'Community Hubs',
    icon: 'Users',
    color: 'text-green-500',
    description: 'The main discussion forums and technical knowledge bases.',
    items: [
      {
        title: 'r/Persona5 Subreddit',
        desc: 'The primary hub for discussion, memes, and fan content.',
        format: 'community',
        url: 'https://www.reddit.com/r/Persona5/'
      },
      {
        title: 'Megami Tensei Wiki',
        desc: 'The technical database for all Persona and Shin Megami Tensei data.',
        format: 'community',
        url: 'https://megamitensei.fandom.com/wiki/Persona_5_Royal'
      },
      {
        title: 'r/Persona5 Subreddit FAQ',
        desc: 'Comprehensive collection of quick-start guides and basic resources.',
        format: 'community',
        url: 'https://www.reddit.com/r/Persona5/comments/1cjlilu/persona_5s_subreddit_faq/'
      }
    ]
  },
  {
    id: 'games',
    title: 'More trackers',
    icon: 'Zap',
    color: 'text-neutral-400',
    description: 'Free progress tracking for another Persona playthrough.',
    items: [
      {
        title: 'Persona 3 Reload Tracker',
        desc: 'Track the main campaign, Social Links, Tartarus and requests. Available in beta.',
        format: 'tool',
        url: 'https://zucram.github.io/P5Tracker/p3/'
      }
    ]
  }
];
