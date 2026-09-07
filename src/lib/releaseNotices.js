export function isVersionNewer(current, previous) {
  if (!previous) return true;
  const numbers = value => /^\d+\.\d+\.\d+$/.test(value || '') ? value.split('.').map(Number) : null;
  const next = numbers(current);
  const last = numbers(previous);
  if (!next) return false;
  if (!last) return true;
  for (let i = 0; i < 3; i++) {
    if (next[i] !== last[i]) return next[i] > last[i];
  }
  return false;
}

export function readPreference(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

export function writePreference(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* Notices also work when browser storage is blocked. */ }
}
