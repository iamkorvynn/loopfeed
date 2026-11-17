import { useState } from 'react'
import type { AppState } from '../types'
import { markAllNotificationsRead } from '../store/store'
import { NotificationItem } from './NotificationItem'
import { EmptyState } from './EmptyState'

interface NotificationsViewProps {
  state: AppState
  onOpenPost: (postId: string) => void
}

export function NotificationsView({ state, onOpenPost }: NotificationsViewProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const unread = state.notifications.filter((n) => !n.read).length
  const sorted = [...state.notifications]
    .filter((n) => (filter === 'unread' ? !n.read : true))
    .sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="notifications">
      <div className="notif-head">
        <h1>Notifications</h1>
        {unread > 0 && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => markAllNotificationsRead()}>
            Mark all read ({unread})
          </button>
        )}
      </div>
      <div className="profile-tabs" role="tablist" aria-label="Notification filter">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          className={filter === 'all' ? 'profile-tab profile-tab--active' : 'profile-tab'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'unread'}
          className={filter === 'unread' ? 'profile-tab profile-tab--active' : 'profile-tab'}
          onClick={() => setFilter('unread')}
        >
          Unread ({unread})
        </button>
      </div>
      {sorted.length === 0 ? (
        <EmptyState title="All quiet" body="Likes, comments, follows and Loop updates will show up here." />
      ) : (
        <ul className="notif-list">
          {sorted.map((n) => {
            const actor = state.users.find((u) => u.id === n.actorId)
            if (!actor) return null
            return (
              <NotificationItem
                key={n.id}
                notification={n}
                actorUsername={actor.username}
                actorStyle={actor.artStyle}
                actorSeed={actor.artSeed}
                onOpenPost={onOpenPost}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
