import type { User } from '../types'
import { Avatar } from './Avatar'
import { FollowButton } from './FollowButton'

interface UserRowProps {
  user: User
  following: boolean
  isSelf: boolean
  onOpenProfile: (userId: string) => void
  /** Optional right-side note, e.g. "Suggested for you". */
  note?: string
}

export function UserRow({ user, following, isSelf, onOpenProfile, note }: UserRowProps) {
  return (
    <div className="user-row">
      <button
        type="button"
        className="user-row-main"
        onClick={() => onOpenProfile(user.id)}
        aria-label={`Open ${user.username}'s profile`}
      >
        <Avatar username={user.username} artStyle={user.artStyle} artSeed={user.artSeed} size={44} />
        <span className="user-row-text">
          <span className="user-row-name">
            {user.username}
            {user.verified && <span aria-label="Verified account"> ✓</span>}
          </span>
          <span className="user-row-sub">{note ?? user.displayName}</span>
        </span>
      </button>
      <FollowButton targetUserId={user.id} following={following} isSelf={isSelf} />
    </div>
  )
}
