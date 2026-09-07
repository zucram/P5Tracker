import { ROYAL_MEMENTOS_PATHS } from './royalMementos.js';
import { palaceDeadlineTask } from './palaceDeadlines.js';
import { withSchoolAnswers } from './schoolAnswers.js';

const BASE_APP_DATA = {
  confidants: [
    { arcana: 'Fool', name: 'Igor', target: 10, notes: 'Automatic progression.', monthlyTargets: { july: 6 } },
    { arcana: 'Magician', name: 'Morgana', target: 10, notes: 'Automatic progression.', monthlyTargets: { july: 5 } },
    {
      arcana: 'Priestess',
      name: 'Makoto Niijima',
      target: 10,
      notes: 'Knowledge 3 to start; Charm 5 for Rank 6.',
      monthlyTargets: { july: 4, august: 10 }
    },
    {
      arcana: 'Empress',
      name: 'Haru Okumura',
      target: 10,
      notes: 'Available from 10/30. Proficiency 5 needed for Rank 2.',
      monthlyTargets: { december: 10 }
    },
    {
      arcana: 'Emperor',
      name: 'Yusuke Kitagawa',
      target: 10,
      notes: 'Proficiency 4 for Rank 6.',
      monthlyTargets: { july: 6, august: 10 }
    },
    {
      arcana: 'Hierophant',
      name: 'Sojiro Sakura',
      target: 10,
      notes: 'Gated at Rank 4 until 8/21. Kindness 5 for Rank 7.',
      monthlyTargets: { april: 2, august: 5 }
    },
    {
      arcana: 'Lovers',
      name: 'Ann Takamaki',
      target: 10,
      notes: 'Rank 1 starts through the story; Kindness 2 is needed for Rank 2.',
      monthlyTargets: { april: 2, june: 5, july: 8, august: 10 }
    },
    {
      arcana: 'Chariot',
      name: 'Ryuji Sakamoto',
      target: 10,
      notes: 'Rank 7 Insta-kill is the most important grinding skill.',
      monthlyTargets: { april: 3, may: 5, july: 7 }
    },
    {
      arcana: 'Justice',
      name: 'Goro Akechi',
      target: 8,
      deadline: '11/17',
      notes: 'Extra scenes also depend on dialogue choices. This is not the semester unlock.',
      monthlyTargets: { june: 2, july: 5, october: 6, november: 8 }
    },
    {
      arcana: 'Hermit',
      name: 'Futaba Sakura',
      target: 10,
      notes: 'Starts automatically on 8/31. Kindness 4 is needed for Rank 2.',
      monthlyTargets: { august: 1, september: 5, december: 10 }
    },
    {
      arcana: 'Fortune',
      name: 'Chihaya Mifune',
      target: 10,
      notes: 'Rank 5 (Affinity Reading) is vital for finishing others.',
      monthlyTargets: { june: 1, july: 5, august: 7 }
    },
    {
      arcana: 'Strength',
      name: 'Caroline & Justine',
      target: 10,
      notes: 'Fusion based. Does not consume time.',
      monthlyTargets: { july: 5 }
    },
    {
      arcana: 'Hanged',
      name: 'Munehisa Iwai',
      target: 10,
      notes: 'Guts 4 needed to start; Guts 5 for Rank 8.',
      monthlyTargets: { august: 5, november: 10 }
    },
    {
      arcana: 'Death',
      name: 'Tae Takemi',
      target: 10,
      notes: 'Rank 7 discount on SP Adhesives.',
      monthlyTargets: { april: 2, may: 5, july: 7 }
    },
    {
      arcana: 'Temperance',
      name: 'Sadayo Kawakami',
      target: 10,
      notes: 'Rank 10 (Massage) allows night actions after Palaces.',
      monthlyTargets: { june: 8, july: 10 }
    },
    {
      arcana: 'Devil',
      name: 'Ichiko Ohya',
      target: 10,
      notes: 'Speak to Ohya at Crossroads in Shinjuku; no Charm gate.',
      monthlyTargets: { august: 5, november: 10 }
    },
    {
      arcana: 'Tower',
      name: 'Shinya Oda',
      target: 10,
      notes: 'Follow the Winners Don’t Use Cheats request available from 9/4. No Kindness gate.',
      monthlyTargets: { september: 3 }
    },
    {
      arcana: 'Star',
      name: 'Hifumi Togo',
      target: 10,
      notes: 'Charm 3 to start; Knowledge 5 for Rank 8.',
      monthlyTargets: { october: 8 }
    },
    {
      arcana: 'Moon',
      name: 'Yuuki Mishima',
      target: 10,
      notes: 'Ranks up via Mementos requests.',
      monthlyTargets: { july: 7 }
    },
    {
      arcana: 'Sun',
      name: 'Toranosuke Yoshida',
      target: 10,
      deadline: '11/13',
      notes: 'Sunday nights only. Best money skill.',
      monthlyTargets: { may: 2, july: 5, august: 9, september: 10, november: 10 }
    },
    { arcana: 'Judgement', name: 'Sae Niijima', target: 10, notes: 'Automatic progression.', monthlyTargets: {} },
    {
      arcana: 'Faith',
      name: 'Kasumi Yoshizawa',
      target: 5,
      deadline: '12/22',
      notes: 'Rank 5 lets her confidant continue in the third semester.',
      monthlyTargets: { july: 4, november: 5, january: 10 }
    },
    {
      arcana: 'Councillor',
      name: 'Takuto Maruki',
      target: 9,
      deadline: '11/17',
      notes: 'This unlocks the third semester. Later story choices still matter.',
      monthlyTargets: { may: 2, july: 5, september: 7, october: 9 }
    }
  ],
  months: [
    {
      id: 'april',
      name: 'April',
      palace: 'Castle of Lust (Kamoshida)',
      tasks: [
        palaceDeadlineTask('apr_pal_sec'),
        { id: 'apr_pal_strat', text: 'Strategy: Begin Kamoshida early; allow separate days for the Calling Card and heist', isMissable: true },
        { id: 'cw_opp_1', text: '4/18 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_2', text: '4/27 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'apr_tip1', text: 'Optimization: Clean room early to unlock TV/Console', isMissable: true }
      ]
    },
    {
      id: 'may',
      name: 'May',
      palace: 'Museum of Vanity (Madarame)',
      tasks: [
        { id: 'may_pal_start', text: '5/31 DEADLINE: Reach Madarame courtyard security barrier; allow later visits to finish the route', isMissable: true },
        { id: 'may_pal_strat', text: 'Strategy: Begin Madarame early; the route requires multiple visits', isMissable: true },
        { id: 'may_unlock_maruki', text: '5/13: Councillor (Maruki) Unlocks (PRIORITY)' },
        { id: 'may_unlock_kawakami', text: '5/24: Operation Maidwatch (Starts Temperance)' },
        { id: 'may_unlock_kasumi', text: '5/30: Faith (Yoshizawa) Rank 1' },
        { id: 'may_exams', text: '5/11-5/14: Midterm exams; results also depend on Knowledge', isMissable: true },
        { id: 'cw_opp_3', text: '5/2 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_4', text: '5/10 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_5', text: '5/18 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_6', text: '5/26 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_7', text: '5/31 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'june',
      name: 'June',
      palace: 'Bank of Gluttony (Kaneshiro)',
      tasks: [
        palaceDeadlineTask('may_pal_dead'),
        { id: 'jun_pal_strat', text: 'Strategy: Secure Route (Kaneshiro) ASAP', isMissable: true },
        { id: 'jun_fortune', text: '6/21: Unlock Fortune (Chihaya) - Need 100k Yen (CRITICAL)' },
        { id: 'jun_justice', text: '6/10: Justice (Akechi) Rank 1 unlocks automatically through the story' },
        { id: 'jun_priestess', text: '6/24: Priestess (Makoto) Unlocks' },
        { id: 'jun_star', text: '6/25: Star (Hifumi) Unlocks' },
        { id: 'jun_darts', text: 'Activity: Play Darts to reach Baton Pass Rank 3', isMissable: true },
        { id: 'cw_opp_8', text: '6/3 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_9', text: '6/7 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_10', text: '6/16 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_11', text: '6/22 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_12', text: '6/30 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'july',
      name: 'July',
      palace: 'Pyramid (Futaba)',
      tasks: [
        palaceDeadlineTask('jun_pal_dead'),
        { id: 'july_exams', text: '7/13-7/16: Finals; results also depend on Knowledge', isMissable: true },
        { id: 'july_kawakami_10', text: 'Strategy: Aim for Kawakami Rank 10 before summer break for Special Massage', isMissable: true },
        { id: 'july_speed_reading', text: 'Strategy: Read Speed Reader from the Shujin library to read more chapters per session', isMissable: true },
        { id: 'pal4_start', text: 'Strategy: Begin Futaba Palace Infiltration', isMissable: true },
        { id: 'j1', text: '7/1: Borrow "Speed Reader" from Shujin Library', isMissable: true },
        { id: 'j2', text: '7/11: Trader Sakai: Trade Soothing Soba for Koedo Sword', isMissable: true },
        { id: 'j3', text: 'Before summer break: Borrow your next book from the Shujin library', isMissable: true },
        { id: 'j4', text: '7/26: Trader Sakai: Trade MRE Ration for Factorization Study Method', isMissable: true },
        { id: 'cw_opp_13', text: '7/7 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_14', text: '7/12 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_15', text: '7/19 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_16', text: '7/27 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'august',
      name: 'August',
      palace: 'Summer Break',
      tasks: [
        palaceDeadlineTask('pal4_secure'),
        palaceDeadlineTask('pal4_card'),
        { id: 'a1', text: '8/14 Jazz Jin: Marakunda (lower enemy Defense)', isMissable: true },
        { id: 'a2', text: '8/28 Jazz Jin: Masukunda (lower enemy Accuracy/Evasion)', isMissable: true },
        { id: 'a3', text: 'Strategy: Clear Palace early (Early Aug) to maximize free time', isMissable: true },
        { id: 'aug_stats', text: 'Strategy: Max out Social Stats using Chihaya Luck Reading', isMissable: true },
        { id: 'aug_mementos', text: 'Mementos: Clear piled-up requests (Batch 3-5 at once)' },
        { id: 'aug_unlock_futaba', text: '8/31: Hermit (Futaba) starts automatically; Kindness 4 is needed for Rank 2' },
        { id: 'cw_opp_17', text: '8/3 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_18', text: '8/8 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_19', text: '8/14 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_20', text: '8/17 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_21', text: '8/25 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_22', text: '8/30 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'september',
      name: 'September',
      palace: 'Spaceport (Okumura)',
      tasks: [
        { id: 'pal5_strat', text: 'Strategy: Secure Route (Okumura) ASAP', isMissable: true },
        { id: 'sep_okumura_fix', text: 'Boss Strategy: Build Baton Pass chains with weakness hits; changing difficulty is optional', isMissable: true },
        { id: 'j5', text: 'Sojiro: Complete The Money-grubbing Uncle after Hierophant Rank 8; talk to Futaba outside Leblanc' },
        { id: 'sep_maruki_5', text: '9/20: Maruki\'s rank lock lifts. Priority 1.' },
        { id: 'sep_unlock_tower', text: '9/4: Winners Don\'t Use Cheats request becomes available; follow it to meet Shinya' },
        { id: 's1', text: '9/4 Jazz Jin: Charge (Essential for Phys)', isMissable: true },
        { id: 's2', text: '9/25 Jazz Jin: Concentrate (Essential for Magic)', isMissable: true },
        { id: 's3', text: '9/10: Hawaii school-trip hangout', isMissable: true },
        { id: 's4', text: 'Unlock Shinya (Tower) via Mementos' },
        { id: 'cw_opp_23', text: '9/2 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_24', text: '9/19 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_25', text: '9/21 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_26', text: '9/28 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'october',
      name: 'October',
      palace: 'Casino (Sae)',
      tasks: [
        palaceDeadlineTask('pal5_secure'),
        palaceDeadlineTask('pal5_dead'),
        { id: 'oct_haru_prof', text: '10/30: Empress (Haru) can start; Proficiency 5 is needed for Rank 2' },
        { id: 'oct_exams', text: '10/17-10/20: Midterm exams; results also depend on Knowledge', isMissable: true },
        { id: 'o1', text: '10/2: Buy "Donut-Worry" from Home Shopping', isMissable: true },
        { id: 'o3', text: '10/26: Post-festival confidant hangout', isMissable: true },
        { id: 'cw_opp_27', text: '10/10 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_28', text: '10/31 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'november',
      name: 'November',
      palace: 'The Heist (Niijima)',
      tasks: [
        palaceDeadlineTask('pal6_dead'),
        { id: 'nov_pal_strat', text: 'Strategy: Secure Route (Sae) early to free up social time', isMissable: true },
        { id: 'nov_deadline_maruki', text: '11/17 DEADLINE: Maruki MUST be Rank 9', isMissable: true },
        { id: 'nov_deadline_akechi', text: '11/17 DEADLINE: Akechi Rank 8 for his extra scenes; dialogue choices also matter', isMissable: true },
        { id: 'nov_deadline_yoshida', text: '11/13 DEADLINE: Yoshida MUST be Rank 10', isMissable: true },
        { id: 'nov_interrogation', text: '11/20 TRAP: Do NOT sell out friends.', isMissable: true },
        { id: 'nov_akechi_choices', text: 'Akechi Choices: Rank 7: "You\'re my rival" | Rank 8: "I accept"', isMissable: true },
        { id: 'n1', text: '11/13: LAST DAY for Yoshida (Sun)', isMissable: true },
        { id: 'n4', text: '11/20: DO NOT sell out your friends', isMissable: true },
        { id: 'cw_opp_29', text: '11/4 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_30', text: '11/14 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_31', text: '11/28 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'december',
      name: 'December',
      palace: 'Cruiser (Shido)',
      tasks: [
        palaceDeadlineTask('pal7_dead'),
        { id: 'dec_pal_strat', text: 'Strategy: Secure Route (Shido) early to minimize late-game stress', isMissable: true },
        { id: 'dec_faith', text: '12/18: Aim for Kasumi Rank 5 before the 12/22 cutoff', isMissable: true },
        { id: 'dec_mementos', text: '12/24: Clear Mementos Depths entirely' },
        { id: 'dec_akechi', text: 'Post-Shido: Say "I want to keep our promise" to Akechi', isMissable: true },
        { id: 'd1', text: '12/11: Jazz Jin (Debilitate)', isMissable: true },
        { id: 'd2', text: '12/22 DEADLINE: Kasumi (Faith) Rank 5 to continue her confidant later', isMissable: true },
        { id: 'd3', text: '12/24: Christmas Eve Special Date', isMissable: true },
        { id: 'cw_opp_32', text: '12/2 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_33', text: '12/7 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_34', text: '12/12 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_35', text: '12/19 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    },
    {
      id: 'january',
      name: 'January',
      palace: 'Laboratory (Maruki)',
      tasks: [
        palaceDeadlineTask('pal9_dead'),
        { id: 'jan_pal_strat', text: 'Strategy: Secure Route (Maruki) ASAP to focus on Tier 3 Awakenings', isMissable: true },
        { id: 'jan_awakenings', text: 'Focus: Dedicate afternoons to Tier 3 Personas', isMissable: true },
        { id: 'j1_jan', text: 'Talk to friends for 3rd Tier Personas' },
        { id: 'j2_jan', text: '1/15 Jazz Jin: Ali Dance', isMissable: true },
        { id: 'j3_jan', text: '1/22 Jazz Jin: Arms Master', isMissable: true },
        { id: 'jan_jazz_spell_master', text: '1/29 Jazz Jin: Spell Master', isMissable: true },
        { id: 'cw_opp_36', text: '1/14 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_37', text: '1/19 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_38', text: '1/23 Crossword puzzle at LeBlanc', isMissable: true },
        { id: 'cw_opp_39', text: '1/27 Crossword puzzle at LeBlanc', isMissable: true }
      ]
    }
  ],
  mementos: ROYAL_MEMENTOS_PATHS,
  palaces: [
    {
      id: 'pal_kamo',
      name: 'Castle of Lust (Kamoshida)',
      lvl: '10-12',
      threat: 'Shadow Kamoshida (Physical attacks)',
      seeds: [
        { id: 'pks1', name: 'Red Lust Seed', text: 'East Building Annex. Mona will guide you.' },
        { id: 'pks2', name: 'Green Lust Seed', text: 'Castle Roof tower. Grapple through first window.' },
        { id: 'pks3', name: 'Blue Lust Seed', text: 'Secret room elevator. Pull lever behind painting.' }
      ],
      personas: [
        { id: 'p_Berith', name: 'Berith', text: 'Nullifies Gun and resists Fire; it does not resist Physical.' },
        { id: 'p_Agathion', name: 'Agathion', text: 'Early source of Elec for weaknesses.' }
      ],
      tips: 'Abuse cover to ambush. Use physical skills to save SP.',
      monthId: 'april'
    },
    {
      id: 'pal_mada',
      name: 'Museum of Vanity (Madarame)',
      lvl: '18-20',
      threat: 'Elemental Clones',
      seeds: [
        { id: 'pms1', name: 'Red Vanity Seed', text: 'Museum 2F. Grapple to central rafter walkway.' },
        { id: 'pms2', name: 'Green Vanity Seed', text: 'Treasure Hall Gallery. Grapple up to press button.' },
        { id: 'pms3', name: 'Blue Vanity Seed', text: 'Museum Main Hall. Enter vent in right hallway to reach balcony.' }
      ],
      personas: [
        { id: 'p_Jack Frost', name: 'Jack Frost', text: 'Mabufu for clones.' },
        { id: 'p_Matador', name: 'Matador', text: 'Innate Psy attacks; use a different Persona or inheritance for Wind.' }
      ],
      tips: 'Bring all 4 basic elements. The boss is an elemental DPS check.',
      monthId: 'may'
    },
    {
      id: 'pal_kane',
      name: 'Bank of Gluttony (Kaneshiro)',
      lvl: '25-28',
      threat: 'Piggytron (Phys/Gimmick)',
      deadlineMonth: 'july',
      seeds: [
        { id: 'pks1_k', name: 'Red Gluttony Seed', text: 'Bankers Passageway. Grapple point near vault.' },
        { id: 'pks2_k', name: 'Green Gluttony Seed', text: 'Laundering Office. Crawl space near money room.' },
        { id: 'pks3_k', name: 'Blue Gluttony Seed', text: 'Lock room puzzle. Mini-boss weak to Ice.' }
      ],
      personas: [
        { id: 'p_White Rider', name: 'White Rider', text: 'Triple Down is extremely powerful.' },
        { id: 'p_Take-Minakata', name: 'Take-Minakata', text: 'Resists Elec and Curse; weak to Psy. Physical damage is neutral.' }
      ],
      tips: 'Throw expensive items at Piggytron to stall its ultimate attack.',
      monthId: 'june'
    },
    {
      id: 'pal1',
      name: 'Pyramid (Futaba)',
      lvl: '34-36',
      threat: 'Anubis (Bless/Curse)',
      deadlineMonth: 'august',
      seeds: [
        { id: 'p1s1', name: 'Red Will Seed', text: 'Chamber of Rejection. Jump on sarcophagi near chest to find hidden path.' },
        { id: 'p1s2', name: 'Green Will Seed', text: 'Chamber of Guilt. After solving the hologram puzzle, go through the red door.' },
        { id: 'p1s3', name: 'Blue Will Seed', text: 'Chamber of Sanctuary. On floating platforms, grapple up to a statue.' }
      ],
      personas: [
        { id: 'p_Isis', name: 'Isis', text: 'Nullifies Bless, but Curse damage is neutral. Watch for Curse instant-kill attacks.' },
        { id: 'p_Thoth', name: 'Thoth', text: 'Early source of Nuclear damage.' }
      ],
      tips: 'Cure Despair immediately. If it lasts 3 turns, you die instantly.',
      monthId: 'july'
    },
    {
      id: 'pal2',
      name: 'Spaceport (Okumura)',
      lvl: '43-45',
      threat: 'Green Robots (DPS Race)',
      deadlineMonth: 'october',
      seeds: [
        { id: 'p2s1', name: 'Red Will Seed', text: 'Facility Area. Vent in circular hall near start.' },
        { id: 'p2s2', name: 'Green Will Seed', text: 'Export Line. Grapple to moving cargo tops.' },
        { id: 'p2s3', name: 'Blue Will Seed', text: 'Transfer Line. Guarded by mini-boss in airlock maze.' }
      ],
      personas: [
        { id: 'p_Girimehkala', name: 'Girimehkala', text: 'REPEL PHYSICAL. Makes the boss mobs much easier.' }
      ],
      tips: 'Use single-target weakness hits and items to build Baton Pass chains. Merciless is optional and increases weakness damage for both sides.',
      monthId: 'september'
    },
    {
      id: 'pal3',
      name: 'Casino (Sae)',
      lvl: '52-54',
      threat: 'Shadow Sae (Gimmicks)',
      deadlineMonth: 'november',
      seeds: [
        { id: 'p3s1', name: 'Red Will Seed', text: 'Staff Area. Near first security room behind crates.' },
        { id: 'p3s2', name: 'Green Will Seed', text: 'Slot Room. High grapple above giant slot machine.' },
        { id: 'p3s3', name: 'Blue Will Seed', text: 'High Limit Area. Behind column on far right of entrance stairs.' }
      ],
      personas: [
        { id: 'p_Rangda', name: 'Rangda', text: 'Repel Phys/Gun. Makes the arena matches trivial.' }
      ],
      tips: 'Do not attack during roulette spin. If you lose, she drains HP/SP.',
      monthId: 'october'
    },
    {
      id: 'pal4',
      name: 'Cruiser (Shido)',
      lvl: '63-65',
      threat: 'Gauntlet of Bosses',
      deadlineMonth: 'december',
      seeds: [
        { id: 'p4s1', name: 'Red Will Seed', text: 'Mid-Starboard Hallway. Grapple from chandelier to a vent.' },
        { id: 'p4s2', name: 'Green Will Seed', text: 'Lower Port Hallway. In the mouse puzzle room, use a small vent.' },
        { id: 'p4s3', name: 'Blue Will Seed', text: 'Side Deck. Climb up the side of the ship and grapple backward.' }
      ],
      personas: [
        { id: 'p_Trumpeter', name: 'Trumpeter', text: 'Learns Debilitate at level 65; a useful option for reducing boss stats.' }
      ],
      tips: 'Use attack debuffs and keep healing available. Trumpeter learns Debilitate at level 65; the Ring of Pride is an upgrade obtained after this Palace.',
      monthId: 'november'
    },
    {
      id: 'pal5',
      name: 'Laboratory (Maruki)',
      lvl: '90+',
      threat: 'Final Boss',
      seeds: [
        { id: 'p5s1', name: 'Red Will Seed', text: 'Monitoring. Stairs to bottom floor, then vent near chest.' },
        { id: 'p5s2', name: 'Green Will Seed', text: 'Research Lab. Spiral staircase -> Rafter grapple -> Break cracked window.' },
        { id: 'p5s3', name: 'Blue Will Seed', text: 'Twilight Corridor. Complex floating platform puzzle at end.' }
      ],
      personas: [
        { id: 'p_Yoshitsune', name: 'Yoshitsune', text: 'Hassou Tobi is the strongest physical move.' },
        { id: 'p_Maria', name: 'Maria', text: 'Best healer for endurance fight.' }
      ],
      tips: 'Build Baton Pass chains through tentacle weaknesses. Higher Baton Pass ranks help but are not an unlock requirement.',
      monthId: 'january'
    }
  ],
  tips: {
    daily: [
      { text: 'Feed Plant (Room)', note: 'Free Kindness. Use Bio Nutrients from Shibuya/Shinjuku.', icon: 'leaf' },
      { text: 'Crossword (Leblanc)', note: 'Evenings. Raises Knowledge without advancing time. Check the table near the stairs.', icon: 'book' },
      { text: 'Vending Machines', note: 'Buy SP drinks (Arginade/Water of Rebirth). Restock weekly.', icon: 'zap' },
      { text: 'Matching Persona', note: 'Carry a matching-Arcana Persona for most confidant hangouts. It does not need to be equipped.', icon: 'users' },
      { text: 'Chihaya Affinity', note: 'Use "Affinity Reading" to boost Confidant points without spending time.', icon: 'star' }
    ],
    weekly: [
      { text: 'Sunday Aojiru', note: 'Underground Walkway. Costs 5,000 yen and raises the stat associated with the current drink without advancing time.', icon: 'coffee' },
      { text: 'Yoshida (Sun)', note: 'Sunday nights ONLY. Station Square. Easy Charm/Money.', icon: 'sun' },
      { text: 'Home Shopping', note: 'Sundays on TV in Leblanc. Unique items/gifts.', icon: 'shopping-bag' },
      { text: 'Jazz Jin (Sun)', note: 'Kichijoji. Sunday evening drinks give specific skills to party members.', icon: 'music' }
    ],
    weather: [
      { text: 'Rainy Days', note: 'Study at Diner for extra Knowledge. Bathhouse for Charm/Guts.', icon: 'cloud-rain' },
      { text: 'Flu Season', note: 'Nov/Dec. Reaper is NOT affected in Royal. Do not farm him.', icon: 'skull' },
      { text: 'Heat Wave', note: 'Extra charm in Bathhouse.', icon: 'sun' }
    ],
    combat: [
      { text: 'Mementos Farming', note: 'Wait for multiple requests. Use Ryuji Rank 7 Insta-kill on green enemies.', icon: 'car' },
      { text: 'Technical Rank', note: 'Play Billiards in Kichijoji. Rank 4 guarantees knockdown on technicals.', icon: 'target' },
      { text: 'Baton Pass', note: 'Play Darts in Kichijoji. Rank 3 restores SP and boosts damage massively.', icon: 'arrow-up-right' },
      { text: 'SP Adhesives', note: 'SP Adhesive 3 restores 7 SP per turn in battle. Available at Death Rank 5, with a discount at Rank 7.', icon: 'battery-charging' }
    ]
  }
};

export const APP_DATA = {
  ...BASE_APP_DATA,
  months: withSchoolAnswers(BASE_APP_DATA.months),
};
