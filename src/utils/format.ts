/** Small time helpers. Pure functions, unit-tested. */

export function timeAgo(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts)
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** Compact count: 1250 -> "1.3k", 2_400_000 -> "2.4M". */
export function compactCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

/** "Day 3 of 7" progress as a 0..1 fraction, clamped. */
export function loopProgress(day: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(1, Math.max(0, day / total))
}
