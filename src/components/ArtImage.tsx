import type { ArtStyle } from '../types'
import { artComposition, artGradientId, PALETTES } from '../data/art'

interface ArtImageProps {
  artStyle: ArtStyle
  artSeed: number
  /** Accessible label for the generated artwork. */
  label: string
  className?: string
  /** Optional uploaded image data URL — takes precedence over generated art. */
  imageDataUrl?: string
}

/**
 * Every "photo" in LoopFeed is generated SVG art: a gradient field plus
 * deterministic shapes from the post's seed. No copyrighted photos.
 */
export function ArtImage({ artStyle, artSeed, label, className, imageDataUrl }: ArtImageProps) {
  if (imageDataUrl) {
    return <img className={className} src={imageDataUrl} alt={label} />
  }
  const [c1, c2, c3] = PALETTES[artStyle]
  const gid = artGradientId(artStyle, artSeed)
  const shapes = artComposition(artStyle, artSeed)
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.55" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gid})`} />
      {shapes.map((s, i) => {
        const common = {
          key: i,
          fill: s.kind === 'ring' ? 'none' : s.color,
          stroke: s.kind === 'ring' ? s.color : 'none',
          strokeWidth: s.kind === 'ring' ? 2.5 : 0,
          opacity: s.opacity,
          transform: `rotate(${s.rotate} ${s.x} ${s.y})`,
        }
        if (s.kind === 'circle' || s.kind === 'ring') {
          return <circle {...common} cx={s.x} cy={s.y} r={s.size / 2} />
        }
        if (s.kind === 'triangle') {
          const h = s.size * 0.866
          return (
            <polygon
              {...common}
              points={`${s.x},${s.y - h / 2} ${s.x - s.size / 2},${s.y + h / 2} ${s.x + s.size / 2},${s.y + h / 2}`}
            />
          )
        }
        if (s.kind === 'bar') {
          return <rect {...common} x={s.x - s.size / 2} y={s.y - 3} width={s.size} height={6} rx={3} />
        }
        return <rect {...common} x={s.x - s.size / 2} y={s.y - s.size / 2} width={s.size} height={s.size} rx={3} />
      })}
    </svg>
  )
}
