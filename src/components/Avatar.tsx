import type { ArtStyle } from '../types'
import { PALETTES } from '../data/art'

interface AvatarProps {
  username: string
  artStyle: ArtStyle
  artSeed: number
  size?: number
  ring?: boolean
}

/** Generated avatar: gradient disc with the user's initials. No photos. */
export function Avatar({ username, artStyle, artSeed, size = 40, ring = false }: AvatarProps) {
  const [c1, c2] = PALETTES[artStyle]
  const initials = username
    .replace(/[^a-zA-Z0-9._]/g, '')
    .split(/[._]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
  const gid = `av-${artStyle}-${artSeed}`
  return (
    <span
      className={ring ? 'avatar-ring' : 'avatar'}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${username} avatar`}
      title={username}
    >
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill={`url(#${gid})`} />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#fff"
          fontFamily="inherit"
        >
          {initials}
        </text>
      </svg>
    </span>
  )
}
