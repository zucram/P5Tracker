export const CONFIDANT_INTERACTIONS = {
  'Fool': {
    bestGifts: [],
    tips: "Automatic progression. No action required.",
    ranks: { 1: "Automatic", 2: "Automatic", 3: "Automatic", 4: "Automatic", 5: "Automatic", 6: "Automatic", 7: "Automatic", 8: "Automatic", 9: "Automatic", 10: "Automatic" }
  },
  'Magician': {
    bestGifts: [],
    tips: "Automatic progression. No action required.",
    ranks: { 1: "Automatic", 2: "Automatic", 3: "Automatic", 4: "Automatic", 5: "Automatic", 6: "Automatic", 7: "Automatic", 8: "Automatic", 9: "Automatic", 10: "Automatic" }
  },
  'Priestess': {
    bestGifts: ["Book Cover (Shibuya)", "Classical Hits (Shibuya)", "Heart Ring (Shibuya)", "Motorbike Figure (Akihabara)"],
    tips: "Requires Knowledge 3 to start. Charm 5 needed for Rank 6.",
    ranks: {
      2: ["1: 'You're very well informed.'", "2: 'That was dangerous.'", "Phone: 'Say hello to her for me.'"],
      3: ["1: 'You have the wrong idea.'", "2: 'You can change.'", "Phone: 'You'll find it someday.'"],
      4: ["1: 'That's unlike you.'", "2: 'Why do you use it?'", "3: 'It's an amazing goal.'", "Phone: 'Wolfing it down, huh?'"],
      5: ["1: 'He sounds suspicious.'", "2: 'Call me next time.'", "Phone: 'Are you okay?'"],
      6: ["1: 'Love comes in many forms.'", "2: 'Tell him you're on a date.'", "3: 'It's the only way.'", "4: 'You can do it.'", "Phone: 'Can you keep a secret?'"],
      7: ["1: 'That's a horrible story.'", "2: 'That's admirable.'", "Phone: 'He's a cool guy.'"],
      8: ["1: 'He says that to all his girls.'", "2: 'Absolutely.'", "Phone: 'I'll be careful.'"],
      9: [
        "1: 'Get away from her!'",
        "2: 'I'm a regular here.' (FRIENDSHIP) OR 'I love you.' (ROMANCE)",
        "Phone: 'I'll always be with you.' (ROMANCE) OR 'No big deal.' (FRIENDSHIP)"
      ],
      10: ["Final event."]
    }
  },
  'Empress': {
    bestGifts: ["Flower Basket (Shinjuku)", "Glass Vase (Shibuya)", "Heart Muffler (Shibuya)"],
    tips: "Starts 10/31. Requires Proficiency 5 for Rank 2.",
    ranks: {
      2: ["1: 'Are you opening a café?'", "2: 'He sounds suspicious.'", "Phone: 'Moonlight Carrot.'"],
      3: ["1: 'They won't find out.'", "2: 'I don't want to go with you.'", "3: 'Not yet.'", "Phone: 'Smart response.'"],
      4: ["1: 'That's pricey.'", "2: 'I can't let you do that.'", "3: 'You mean… poop!?'", "4: 'Let's ask him.'", "Phone: 'Let's get coffee again sometime.'"],
      5: ["1: 'Trust no one.'", "2: 'There has to be another way.'", "Phone: 'Pinch yourself.'"],
      6: ["1: 'That's fascinating'", "2: 'I had no idea.'", "3: 'Be strong, Haru.'", "Phone: 'You can talk to me anytime.'"],
      7: ["1: 'What do you want to do?'", "2: 'What does Takakura-san think?'", "3: 'That's the spirit.'", "Phone: 'I'll always have your back.'"],
      8: ["1: 'The soil?'", "2: 'It'll help him understand you.'", "3: 'I'll be cheering for you.'", "Phone: 'It's in your nature to nurture.'"],
      9: [
        "1: 'I'm sure you'll do great.'",
        "2: 'Give it all you've got, Haru.'",
        "3: 'I like you too, Haru.' (ROMANCE)",
        "Phone: 'I wanted to hear your voice.' (ROMANCE) OR 'I will.' (FRIENDSHIP)"
      ],
      10: ["Final event."]
    }
  },
  'Emperor': {
    bestGifts: ["Silver Bangle (Shinjuku)", "Classical Hits (Shibuya)", "Uji Matcha (Shibuya)"],
    tips: "Proficiency 4 needed for Rank 6.",
    ranks: {
      2: ["1: 'It's novel.'", "2: 'I can't wait.'", "Phone: 'Glad you enjoyed it.'"],
      3: ["1: 'Don't let it bother you.'", "2: 'This isn't like you.'", "Phone: 'That's the spirit.'"],
      4: ["1: 'I should bring a girl here.'", "2: 'Love comes in all forms.'", "Phone: 'Don't get discouraged.'"],
      5: ["1: 'Do you want me to strip?'", "2: 'I'm sure you will.'", "Phone: 'There's still hope.'"],
      6: ["1: 'It feels nostalgic.'", "2: 'Maybe he was sympathetic.'", "Phone: 'He had a talent for it.'"],
      7: ["1: 'What do you mean?'", "2: 'The truth is within you.'", "Phone: 'It's not a problem.'"],
      8: ["1: 'It has to be Ann.'", "2: 'You've really grown, Yusuke.'", "Phone: 'No problem.'"],
      9: ["1: 'Her love for her son.'", "2: 'You've really changed, Yusuke.'", "Phone: 'I can't wait.'"],
      10: ["3: 'He was a good man deep down.'"]
    }
  },
  'Hierophant': {
    bestGifts: ["Fountain Pen (Shinjuku)", "Cigar Cutter (Shibuya)", "Electric Toothbrush (Akihabara)"],
    tips: "Gated at Rank 4 until 8/21. Kindness 5 for Rank 7.",
    ranks: {
      1: ["Phone: 'Got it.'"],
      2: ["1: 'Making coffee.'", "2: 'That guy seemed suspicious.'", "3: 'I want the ladies to love me.'", "Phone: 'Got it.'"],
      3: ["1: 'Medium-fine.'", "2: 'Is it trouble??'", "Phone: 'Thank you in advance.'"],
      4: ["1: 'Tell me more.'", "2: 'Call Sojiro's phone.'", "Phone: 'Understood.'"],
      5: ["1: 'I think I'm addicted!'", "2: 'She wasn't normal, huh?'", "Phone: 'She needs a balanced diet.'"],
      6: ["1: 'To each his own.'", "2: 'Shut your mouth.'", "3: 'Saving Futaba was no mistake.'", "Phone: 'If I can help somehow…'"],
      7: ["1: 'You might be right.'", "Phone: 'Feel like a real dad now?'"],
      8: ["1: 'Something with curry.'", "2: 'I was just protecting Futaba.'", "Phone: 'I will.'"],
      9: ["1: 'It's great.'", "2: 'You have a great daughter.'", "3: 'You did great.'", "Phone: 'Futaba did great.'"],
      10: ["Final event."]
    }
  },
  'Lovers': {
    bestGifts: ["Heart Muffler (Shibuya)", "Heart Ring (Shibuya)", "Uji Matcha (Shibuya)", "Rose Bouquet (Shibuya)"],
    tips: "Rank 1 starts through the story; Kindness 2 is needed for Rank 2.",
    ranks: {
      2: ["1: 'Are you feeling better now?'", "2: 'You might be right.'", "3: 'I couldn't just ignore you.'", "Phone: 'Leave it to me.'"],
      3: ["1: 'Can we stop yet?'", "2: 'Has that happened to you?'", "Phone: 'Could be.'"],
      4: ["1: 'I know what you mean.'", "2: 'That's hilarious.'", "3: 'Tell me.'", "4: 'Good idea.'", "Phone: 'I train everyday.'"],
      5: ["1: 'Give it up.'", "2: 'She's amazing, huh…'", "3: 'It had grace.'"],
      6: ["1: 'It seems that way.'", "2: 'Comfort her.'", "3: 'Show her your own strength.'", "Phone: 'Someone's motivated.'"],
      7: ["1: 'She admires you.'", "2: 'Go get 'em, tiger.'", "Phone: 'You got this.'"],
      8: ["1: 'You have some real guts.'", "2: 'There's no doubt in my mind.'", "3: 'She'll be happy to hear that.'", "Phone: 'You can ask her yourself.'"],
      9: [
        "1: 'Hang in there.'",
        "2: 'I believe in you, Ann.'",
        "3: 'You have me.' (ROMANCE)",
        "Phone: 'Of course.' (FRIENDSHIP) OR 'I'm yours forever.' (ROMANCE)"
      ],
      10: ["Final event."]
    }
  },
  'Chariot': {
    bestGifts: ["Protein Powder (Shibuya)", "Sporty Watch (Shibuya)", "Smartphone Case (Shibuya)"],
    tips: "Rank 7 Insta-kill is the most important grinding skill.",
    ranks: {
      2: ["1: 'I'm counting on you.'", "2: 'You seem pretty excited.'", "Phone: 'You're already fast enough.'"],
      3: ["1: 'Let's not fight.'", "2: 'Calm down, Ryuji.'", "Phone: 'I can't exactly blame you.'"],
      4: ["1: 'Are you worried about him?'", "2: 'But you're doing great.'", "Phone: 'I know how you feel.'"],
      5: ["1: 'Protein powder?'", "2: 'You seem conflicted.'", "3: 'So he's an asshole?'", "Phone: 'Don't worry. I gotcha.'"],
      6: ["1: 'We can train at my place.'", "2: 'You guys should trust Nakaoka.'", "3: 'Absolutely.'", "Phone: 'So he should've punched back?'"],
      7: ["1: 'Let's talk to Takeishi.'", "2: 'I think it's cool, Ryuji.'", "Phone: 'Never know until you try.'"],
      8: ["1: 'Things turned out for the best.'", "2: 'All I did was watch.'", "3: 'You weren't cool though.'", "Phone: 'So. Closed case?'"],
      9: ["1: 'Are you satisfied now?'", "2: 'Don't do it.'", "3: 'You're Right.'", "Phone: 'Congratulations.'"],
      10: ["1: 'I'm looking forward to it.'"]
    }
  },
  'Hermit': {
    bestGifts: ["Motorbike Figure (Akihabara)", "Local Mascot (Akihabara)", "Uji Matcha (Shibuya)"],
    tips: "Starts automatically on 8/31. Kindness 4 is needed for Rank 2.",
    ranks: {
      2: ["1: 'If we work together.'", "Phone: 'I bet it will.'"],
      3: ["1: 'I was about to come find you.'", "2: 'Good to see you again.'", "Phone: 'We'll both do our best.'"],
      4: ["1: 'Let's do this together.'", "2: 'I think it's cute.'", "Phone: 'I'll help you anytime.'"],
      5: ["1: 'I think you're right.'", "2: 'He's the protagonist.'", "Phone: 'You did great.'"],
      6: ["1: 'That must have been a shock.'", "2: 'You didn't know any better.'", "Phone: 'Are you running away again?'"],
      7: ["1: 'I'll do it, for you.'", "2: 'We'll show them the truth.'", "Phone: 'I will.'"],
      8: ["1: 'That's incredible.'", "2: 'You worked really hard too.'", "Phone: 'Want more pats?'"],
      9: [
        "1: 'You've really matured.'",
        "2: 'Are you OK, Futaba?'",
        "3: 'I love you.' (ROMANCE) OR 'We'll be teammates forever.' (FRIENDSHIP)",
        "Phone: 'Do I really have to say it?' (ROMANCE) OR 'I'll be there.' (FRIENDSHIP)"
      ],
      10: ["Final event."]
    }
  },
  'Hanged': {
    bestGifts: ["Cigar Cutter (Shibuya)", "Smartphone Case (Shibuya)", "Silver Bangle (Shinjuku)"],
    tips: "Guts 4 needed to start; Guts 5 for Rank 8.",
    ranks: {
      1: ["Phone: 'So what's my first job?'"],
      2: ["1: 'What should I do now?'", "Phone: 'I will.'"],
      3: ["1: 'I always knew you were a thug.'", "2: 'We made a deal, didn't we?'", "Phone: 'I will.'"],
      4: ["1: 'Where's my reward.'", "Phone: 'I agree.'"],
      5: ["1: 'You're pathetic.'", "2: 'I'll stick around for the guns.'", "Phone: 'You're right.'"],
      6: ["1: 'Girls.'", "2: 'You should buy us something.'", "Phone: 'All I did was listen to him.'"],
      7: ["1: 'Absolutely.'", "2: 'He's clever.'", "Phone: 'Bring it on.'"],
      8: ["1: 'I guess I could consider it.'", "2: 'If you pay me well.'", "Phone: 'Understood.'"],
      9: ["1: 'Are you sure he's alive?'", "2: 'Tell him the truth.'", "3: 'You need to trust your son.'", "Phone: 'Like father, like son.'"],
      10: ["1: 'It's up to you now, Iwai.'"]
    }
  },
  'Devil': {
    bestGifts: ["Black Mug (Shinjuku)", "Classical Hits (Shibuya)", "Fountain Pen (Shinjuku)"],
    tips: "Speak to Ohya at Crossroads in Shinjuku; no Charm gate. Reduces Palace security.",
    ranks: {
      2: ["1: 'Mishima might…'", "2: 'It's for the article.'"],
      3: ["1: 'You shouldn't make assumptions.'", "2: 'She was falsely accused?'"],
      4: ["1: 'Of course we are.' (ROMANCE implied)", "Phone: 'Leave it to me.'"],
      5: ["1: 'That's unforgivable.'", "Phone: 'I don't mind.'"],
      6: ["1: 'He must not like you.'", "2: 'You should trust in her.'", "3: 'That's the spirit.'", "Phone: 'I'll dig up some more for you.'"],
      7: ["1: 'Don't let him provoke you.'", "2: 'You're charming as you are.'", "Phone: 'That's the spirit.'"],
      8: ["1: 'That's not like you.'", "Phone: 'Good luck.'"],
      9: ["1: 'You're not giving up, are you?'", "2: 'I can't leave you alone.' (ROMANCE)", "Phone: 'I wanted to hear your voice.' (ROMANCE) OR 'I'll be there.' (FRIENDSHIP)"],
      10: ["Final event."]
    }
  },
  'Tower': {
    bestGifts: ["Local Mascot (Akihabara)", "Motorbike Figure (Akihabara)", "Smartphone Case (Shibuya)"],
    tips: "Follow the Winners Don’t Use Cheats request available from 9/4. No Kindness gate.",
    ranks: {
      1: ["Phone: 'Call me when it's game time.'"],
      2: ["1: 'Don't compare me to you.'", "2: 'So do I.'", "Phone: 'I'll work hard.'"],
      3: ["1: 'That's the spirit.'", "Phone: 'Sure.'"],
      4: ["1: 'Yeah, you tell him!'", "Phone: 'I will.'"],
      5: ["1: 'It was pretty weird.'", "2: 'He must've rigged it.'", "3: 'You need a new strategy.'", "Phone: 'I'll be cheering you on.'"],
      6: ["1: 'I believe in you.'", "2: 'Not at all.'", "Phone: 'Of course I won't.'"],
      7: ["1: 'I don't think so.'", "2: 'You just need to practice.'", "Phone: 'I will.'"],
      8: ["1: 'Believe in them.'", "2: 'That's admirable.'", "Phone: 'I will.'"],
      9: ["1: 'I'm glad to hear that.'", "2: 'It means you've matured.'", "Phone: 'You did a great job too.'"],
      10: ["Final event."]
    }
  },
  'Star': {
    bestGifts: ["Book Cover (Shibuya)", "Classical Hits (Shibuya)", "Uji Matcha (Shibuya)"],
    tips: "Charm 3 to start; Knowledge 5 for Rank 8.",
    ranks: {
      1: ["Phone: 'Lucky me.'"],
      2: ["1: 'That's interesting.'", "2: 'But you don't want to, right?'", "Phone: 'I'll keep that in mind.'"],
      3: ["1: 'Describes you perfectly.'", "2: 'Having a difficult time?'", "Phone: 'Bring it on.'"],
      4: ["1: 'I don't mind.'", "2: 'They're cool.'", "Phone: 'I'd love to.'"],
      5: ["1: 'She's scary.'", "2: 'You should stop then.'", "Phone: 'You've got a lot to deal with...'"],
      6: ["1: 'Is that frustrating?'", "2: 'Do what you love.'", "Phone: 'You're imagining things.'"],
      7: ["1: 'It may come down to luck.'", "2: 'I believe in you.'", "Phone: 'I will.'"],
      8: ["1: 'I'm glad her heart changed.'", "Phone: 'I support it.'"],
      9: ["1: 'Give it all you go.'", "2: 'A very queenly decision.'", "3: 'I want to stay by your side.' (ROMANCE)", "Phone: 'Anything for you.' (ROMANCE) OR 'I will.' (FRIENDSHIP)"],
      10: ["Final event."]
    }
  },
  'Moon': {
    bestGifts: [],
    tips: "Ranks up via Mementos requests. Just complete the missions he gives you.",
    ranks: { 
      1: "Automatic", 
      2: ["1: 'You've done good, kid.'", "2: 'Sounds cool.'", "Phone: 'Nice hustle, image manager.'"],
      3: ["1: 'Great idea.'", "2: 'It's not your fault.'", "Phone: 'Of course.'"], 
      4: ["1: 'Steak sounds good.'", "2: 'You're amazing.'", "Phone: 'Yup.'"],
      5: ["1: 'Is it for me?'", "2: 'That's a good idea.'", "Phone: 'All right.'"],
      6: ["1: 'You sure are fired up…'", "2: 'Absolutely. Nice job.'"],
      7: ["1: 'Maybe the Phan-Site?'", "Phone: 'It's your time to shine.'"],
      8: ["1: 'I'm not leaving.'", "2: 'You were super cool.'", "Phone: 'You've got this, man.'"],
      9: ["1: 'You showed some real courage.'", "Phone: 'The sparkle in your eye.'"],
      10: ["Final Request"] 
    }
  },
  'Sun': {
    bestGifts: ["Fountain Pen (Shinjuku)", "Electric Toothbrush (Akihabara)", "Smartphone Case (Shibuya)"],
    tips: "Sunday nights ONLY. Deadline 11/13. Best for early money grinding.",
    ranks: {
      1: ["Phone: 'Let me write this down.'"],
      2: ["1: 'I want to improve my speech.'", "2: 'One with conviction.'", "Phone: 'It was helpful.'"],
      3: ["1: 'His message.'", "2: 'His speaking skills.'", "Phone: 'It was helpful.'"],
      4: ["1: 'I couldn't help myself.'", "2: 'Yeah, you tell him!'", "Phone: 'I will.'"],
      5: ["1: 'The media doesn't matter.'", "2: 'I think so.'"],
      6: ["1: 'I'm for them.'", "2: 'I'd decline.'", "Phone: 'I'll keep this in mind.'"],
      7: ["1: 'You should decline.'", "2: 'That's a difficult decision.'"],
      8: ["1: 'That's a difficult decision.'", "2: 'Stick to your beliefs.'", "Phone: 'I'll never forget that.'"],
      9: ["1: 'Do your best.'", "2: 'You had a change of heart.'"],
      10: ["1: 'Your true self was revealed.'"]
    }
  },
  'Faith': {
    bestGifts: ["Heart Muffler (Shibuya)", "Glass Vase (Shibuya)", "Flower Basket (Shinjuku)", "Crimson Lipstick (Underground Mall)"],
    tips: "Reach Rank 5 by 12/22 to continue her confidant in the third semester. Maruki unlocks the semester itself.",
    ranks: {
      2: ["1: 'We're just getting started.'", "2: 'Next time, then.'", "Phone: 'Impressive.'"],
      3: ["1: 'Making bento?'", "2: 'I'm touched!'", "3: 'Is that all for you?'", "Phone: 'You could try again sometime?'"],
      4: ["1: 'You're looking to buy?'", "2: 'A pretty modern look.'", "3: 'Of course.'", "Phone: 'I'm glad to hear that.'"],
      5: ["1: 'It's a surprise, yea.'", "2: 'Go ahead. I'll watch.'", "3: 'Congratulations.'", "Phone: 'Gymnastics.'"],
      6: ["1: 'You have to face it.'"],
      7: ["1: 'You okay?'", "2: 'Of course.'", "Phone: 'I love a good challenge.'"],
      8: ["1: 'Walk up to Sumire.'", "2: 'I'm here for you.'", "3: 'Sounds like progress.'", "Phone: 'Online.'"],
      9: [
        "1: 'It's no problem.'",
        "2: 'Definitely.'",
        "3: 'Of course I do.'",
        "4: 'I love you too.' (ROMANCE) OR 'Let's stay friends.' (FRIENDSHIP)",
        "Phone: 'Get used to it.' (ROMANCE) OR 'Of course.' (FRIENDSHIP)"
      ],
      10: ["Rank 10 requires another meeting in the third semester. It does not advance automatically."]
    }
  },
  'Judgement': {
    bestGifts: [],
    tips: "Automatic progression. No action required.",
    ranks: { 1: "Automatic", 2: "Automatic", 3: "Automatic", 4: "Automatic", 5: "Automatic", 6: "Automatic", 7: "Automatic", 8: "Automatic", 9: "Automatic", 10: "Automatic" }
  },
  'Temperance': {
    bestGifts: ["Hand Wrap (Shibuya)", "Best Seller (Shibuya)", "Idol Poster (Shibuya)", "Star Mirror (Shinjuku)"],
    tips: "Always call her on Friday/Saturday nights. Rank 10 is school-locked (finish before 7/24).",
    ranks: {
      1: ["Phone: 'Yeah, I get it.'"],
      2: ["1: 'It does.'", "2: 'Absolutely not!'", "Phone: 'I'll keep that in mind.'"],
      3: ["1: 'Yeah, they do.'", "2: 'I'll request you more often.'", "Phone: 'Thanks.'"],
      4: ["1: 'How rude.'", "2: 'You need to love yourself.'", "Phone: 'That's the spirit.'"],
      5: ["1: 'It's fun.'", "2: 'I want to know more.'", "Phone: 'I will.'"],
      6: ["1: 'Want to rest a bit?'", "2: 'Are you all right?'", "3: 'You should go home.'", "Phone: 'I'm fine.'"],
      7: ["1: 'Don't pay them.'", "2: 'Think this through more.'", "Phone: 'I'll do it.'"],
      8: ["1: 'Is this really what you want?'", "2: 'If that's what you decided.'", "3: 'I want to protect you.'", "Phone: 'I'll do anything for you.'"],
      9: [
        "1: 'Nonsense.'",
        "2: 'Thank you for your service.'",
        "3: 'I love you.' (ROMANCE PATH) OR 'I mean as a teacher.' (FRIENDSHIP PATH)",
        "Phone: 'I'm serious.' (ROMANCE) OR 'I'm glad.' (FRIENDSHIP)"
      ],
      10: ["Automatic if request 'A Teacher Maid in Hell' is cleared."]
    }
  },
  'Fortune': {
    bestGifts: ["Flower Basket (Shinjuku)", "Star Mirror (Shinjuku)", "Local Mascot (Akihabara)"],
    tips: "Rank 5 (Affinity Reading) is the #1 run priority. Unlocks at Rank 5.",
    ranks: {
      2: ["1: 'Open your mind to change.'", "Phone: 'Of course I am.'"],
      3: ["1: 'Go for the money.'", "2: 'She'll be sad if you break it off.'"],
      4: ["1: 'Trust in yourself.'", "Phone: 'I didn't do much.'"],
      5: ["1: 'You're such a hard worker.'", "Phone: 'I'll be there.'"],
      6: ["1: 'You're just Chihaya to me.'", "Phone: 'Be honest with yourself.'"],
      7: ["1: 'I don't think so.'", "Phone: 'Be careful.'"],
      8: ["1: 'I know.'", "2: 'I'm glad to hear that.'", "Phone: 'It was all your own will.'"],
      9: [
        "1: 'Well, fate can be changed.'",
        "2: 'I want to be with you.' (ROMANCE) OR 'I like having my fortune read.' (FRIENDSHIP)",
        "Phone: 'I wanted to hear your voice too.' (ROMANCE) OR 'I will.' (FRIENDSHIP)"
      ],
      10: ["Automatic after Mementos mission."]
    }
  },
  'Councillor': {
    bestGifts: ["Mini Cactus (Shibuya)", "Donut-Worry (Home Shopping)", "Best Seller (Shibuya)"],
    tips: "MANDATORY Rank 9 by 11/17 for 3rd Semester. Capped at Rank 5 until 9/20.",
    ranks: {
      2: ["1: 'We made a deal.'", "2: 'But it sounds right.'", "Phone: 'Well, okay.'"],
      3: ["1: 'So they have, huh?'", "2: 'Of course.'", "3: 'That one seems necessary.'", "4: 'Did that help?'", "Phone: 'Good work over there.'"],
      4: ["1: 'I know, right...?'", "2: 'Is that what you're researching?'", "3: 'That's a grand plan.'", "4: 'That sounds fun.'", "Phone: 'I'm completely fine.'"],
      5: ["1: 'This looks great!'", "2: 'You know, you're right.'", "3: 'My senses lied to me!'", "4: 'I guess so.'", "Phone: 'I really don't mind.'"],
      6: ["1: 'Another cup?'", "2: 'I can do that.'", "3: 'So give up.'", "Phone: 'Calm down.'"],
      7: ["1: 'You really are dedicated.'", "2: 'No idea.'", "3: 'The change of heart...?'", "4: 'I have no clue.'"],
      8: ["1: 'What do you mean?'", "2: 'Ooh, really?'", "3: 'Thanks for the food!'", "4: 'We've made a deal.'", "5: 'Congratulations.'", "6: 'I sure do.'", "Phone: 'He's a good friend.'"],
      9: ["1: 'Kind of sad...'", "Phone: 'Take care of yourself.'"],
      10: ["Automatic on 11/18 if Rank 9 reached."]
    }
  },
  'Justice': {
    bestGifts: ["High-end Manicure (Shibuya)", "Smartphone Case (Shibuya)", "Silver Bangle (Shinjuku)"],
    tips: "Rank 8 by 11/17 for True Ending content. Ranks 7-8 time-gated to November.",
    ranks: {
      2: ["1: 'You always seem so busy.'", "2: 'I see a lot of things.'", "Phone: 'As rivals?'"],
      3: ["1: 'Should've figured.'", "Phone: 'Wasn't it fun?'"],
      4: ["1: 'Now this is my kind of club.'", "2: 'Any recommendations?'", "3: 'I can use a microwave.'", "Phone: 'I kinda get it.'"],
      5: ["1: 'Are you used to gunplay?'", "2: 'You wanted to be a hero?'", "Phone: 'You did fine.'"],
      6: ["1: 'A while, huh?'", "2: 'I'll stay until you're ready.'", "3: 'Same.'", "4: 'I think you're right.'", "Phone: 'My bad, I guess.'"],
      7: ["1: 'That's why it's so fun.'", "2: 'I couldn't let myself lose.'", "Phone: 'We're rivals, aren't we?'"],
      8: ["1: 'I definitely wouldn't lose.'", "2: 'Really hate losing, don't you.'", "Phone: 'I will.'"],
      9: ["Automatic progression."],
      10: ["Automatic progression."]
    }
  },
  'Death': {
    bestGifts: ["Mini Cactus (Shibuya)", "Black Mug (Shinjuku)", "Classical Hits (Shibuya)"],
    tips: "Rank 5/7 for SP Adhesives. Rank 7 gives 50% discount.",
    ranks: {
      1: ["Phone: 'Please go easy on me.'"],
      2: ["1: 'I have a bad heart.'", "2: 'I agree.'", "Phone: 'I'm totally fine.'"],
      3: ["1: 'I don't mind.'", "Phone: 'Of course not.'"],
      4: ["1: 'Dr. Takemi will help.'", "2: 'You seem happy.'", "Phone: 'I'll reflect on my mistakes.'"],
      5: ["1: 'That's good.'", "Phone: 'About Miwa-chan?'"],
      6: ["1: 'It suits you.'", "Phone: 'You can count on me.'"],
      7: ["1: 'This is harassment.'", "2: 'We all do sometimes.'", "Phone: 'I'm your ally.'"],
      8: ["1: 'It's for Miwa-chan'", "2: 'Let's get to work, doctor.'", "Phone: 'I'll be cheering you on.'"],
      9: [
        "1: 'It was rough.'",
        "2: 'It isn't a joke.' (ROMANCE) OR 'It was for my exams.' (FRIENDSHIP)",
        "Phone: 'So did you.' (ROMANCE) OR 'I'm glad.' (FRIENDSHIP)"
      ],
      10: ["Final event."]
    }
  },
  'Strength': {
    bestGifts: [],
    tips: "Fusion based. Does not consume time. Just bring the required Persona with the required skill.",
    ranks: {
      1: "Jack Frost with Mabufu",
      2: "Ame-no-Uzume with Frei",
      3: "Flauros with Tarukaja",
      4: "Phoenix with Counter",
      5: "Setanta with Rakukaja",
      6: "Dakini with High Counter",
      7: "Pazuzu with Tetraja",
      8: "Hecatoncheires with Masukunda",
      9: "Bugs with Samarearm",
      10: "Seth with High Counter"
    }
  }
};