// Reviewed Royal request pairs, itemization results and fixed group fusions.
// Evidence and scope: docs/royal-content-review.md.
export const ROYAL_STRENGTH_REQUESTS = [
  { rank: 1, persona: 'Jack Frost', skill: 'Mabufu', card: 'Koropokkuru', alarm: true, preparation: 'Jack Frost learns Mabufu at level 12. Level it once from its base level and keep the skill; no card is needed for this route.' },
  { rank: 2, persona: 'Ame-no-Uzume', skill: 'Frei', card: 'Makami', alarm: false },
  { rank: 3, persona: 'Flauros', skill: 'Tarukaja', card: 'Eligor', alarm: false, ingredients: ['Berith', 'Eligor', 'Orobas'], preparation: 'Eligor has Tarukaja at its base level of 16. Select Tarukaja when choosing inherited skills for Flauros.' },
  { rank: 4, persona: 'Phoenix', skill: 'Counter', card: 'Naga', alarm: false },
  { rank: 5, persona: 'Setanta', skill: 'Rakukaja', card: 'Lamia', alarm: false },
  { rank: 6, persona: 'Neko Shogun', skill: 'Dekaja', card: 'Mokoi', alarm: true, ingredients: ['Kodama', 'Sudama', 'Anzu'], preparation: 'Raise Anzu to level 28 for Dekaja before the group fusion, then select Dekaja for inheritance.' },
  { rank: 7, persona: 'Lachesis', skill: 'Tetraja', card: 'Clotho', alarm: false },
  { rank: 8, persona: 'Hecatoncheires', skill: 'Masukunda', card: 'Mandrake', alarm: true },
  { rank: 9, persona: 'Bugs', skill: 'Samarecarm', card: 'Norn', alarm: true, ingredients: ['Pixie', 'Pisaca', 'Hariti'], preparation: 'Complete The Lovesick Cyberstalking Girl request to unlock Bugs. Raise Hariti to level 41 for Samarecarm, then inherit it in the group fusion.' },
  { rank: 10, persona: 'Seth', skill: 'High Counter', card: 'Ose', alarm: true, ingredients: ['Isis', 'Anubis', 'Thoth', 'Horus'], preparation: 'Rank 8 unlocks the larger group fusion. Fuse Seth, then use the High Counter card on it. Counter and Counterstrike do not satisfy this request.' },
];
