import { loopProgress } from '../utils/format'

interface LoopRingProps {
  day: number
  total: number
  size?: number
  /** Series name shown in the tooltip / aria label. */
  series: string
}

/**
 * Progress ring for a Loop post: shows where you are in the series,
 * e.g. Day 3 of 7. The LoopFeed twist on a plain feed post.
 */
export function LoopRing({ day, total, size = 44, series }: LoopRingProps) {
  const progress = loopProgress(day, total)
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - progress)
  return (
    <span
      className="loop-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${series}: day ${day} of ${total}`}
      title={`${series} — Day ${day} of ${total}`}
    >
      <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="#db2777"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 22 22)"
        />
        <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">
          {day}/{total}
        </text>
      </svg>
    </span>
  )
}
