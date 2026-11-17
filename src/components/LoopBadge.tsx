import type { LoopInfo } from '../types'

/** Small "⟳ 3/7" badge marking a Loop post in grids. */
export function LoopBadge({ loop }: { loop: LoopInfo }) {
  return (
    <span
      className="explore-loop-badge"
      role="img"
      aria-label={`Loop ${loop.series}, day ${loop.day} of ${loop.total}`}
      title={`${loop.series} — Day ${loop.day} of ${loop.total}`}
    >
      ⟳ {loop.day}/{loop.total}
    </span>
  )
}
