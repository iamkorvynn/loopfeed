import { toggleFollow } from '../store/store'

interface FollowButtonProps {
  targetUserId: string
  following: boolean
  /** Hide the button entirely when viewing your own profile. */
  isSelf?: boolean
}

export function FollowButton({ targetUserId, following, isSelf = false }: FollowButtonProps) {
  if (isSelf) return null
  return (
    <button
      type="button"
      className={following ? 'btn btn--ghost' : 'btn btn--primary'}
      aria-pressed={following}
      onClick={() => toggleFollow(targetUserId)}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
