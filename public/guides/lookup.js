export function normalizeLookup(value) {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function matchesLookup(text, query, number) {
  if (number != null && /^\s*#?\d+\s*$/.test(query)) return Number(query.trim().replace('#', '')) === Number(number);
  const haystack = normalizeLookup(text);
  return normalizeLookup(query).split(' ').filter(Boolean).every(term => {
    // A request or puzzle number must not also match 11, 21, or 101.
    if (/^\d+$/.test(term)) return haystack.split(' ').some(word => /^\d+$/.test(word) && Number(word) === Number(term));
    return haystack.includes(term);
  });
}
