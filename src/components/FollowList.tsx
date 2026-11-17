import type { AppState, User } from '../types'
import { UserRow } from './UserRow'

interface FollowListProps {
  title: string
  users: User[]
  state: AppState
  onClose: () => void
  onOpenProfile: (userId: string) => void
}

/** Overlay list of followers / following, with follow buttons. */
export function FollowList({ title, users, state, onClose, onOpenProfile }: FollowListProps) {
  const me = state.users.find((u) => u.id === state.currentUserId)
  return (
    <div className="modal-backdrop" role="dialog" aria-label={title} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="story-close" onClick={onClose} aria-label={`Close ${title}`}>
            ✕
          </button>
        </div>
        {users.length === 0 ? (
          <p className="search-hint">Nobody here yet.</p>
        ) : (
          users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              following={me?.following.includes(u.id) ?? false}
              isSelf={u.id === me?.id}
              onOpenProfile={(id) => {
                onClose()
                onOpenProfile(id)
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
