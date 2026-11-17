/** Recent searches, kept in localStorage (max 5, most recent first, deduped). */

const KEY = 'loopfeed-recent-searches'
const MAX = 5

export function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function saveRecentSearch(query: string): string[] {
  const q = query.trim()
  if (!q) return loadRecentSearches()
  const next = [q, ...loadRecentSearches().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  return next
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
