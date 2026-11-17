import type { AppState } from '../types'
import { feedPosts, suggestedUsers } from '../store/selectors'
import { StoryTray } from './StoryTray'
import { PostCard } from './PostCard'
import { UserRow } from './UserRow'
import { EmptyState } from './EmptyState'

interface FeedViewProps {
  state: AppState
  onOpenProfile: (userId: string) => void
  onOpenStory: (userId: string) => void
  onGoExplore: () => void
}

export function FeedView({ state, onOpenProfile, onOpenStory, onGoExplore }: FeedViewProps) {
  const posts = feedPosts(state)
  const suggestions = suggestedUsers(state)
  const me = state.users.find((u) => u.id === state.currentUserId)

  return (
    <div className="feed-layout">
      <main className="feed-main">
        <StoryTray state={state} onOpenStory={onOpenStory} />
        {posts.length === 0 ? (
          <EmptyState
            title="Your feed is empty"
            body="Follow some people to fill it up — or explore what's out there."
            actionLabel="Explore posts"
            onAction={onGoExplore}
          />
        ) : (
          posts.map((p) => (
            <PostCard key={p.id} post={p} state={state} onOpenProfile={onOpenProfile} />
          ))
        )}
      </main>
      <aside className="feed-side">
        {me && (
          <div className="side-me">
            <button type="button" className="side-me-btn" onClick={() => onOpenProfile(me.id)}>
              <span className="side-me-name">{me.displayName}</span>
              <span className="side-me-sub">@{me.username}</span>
            </button>
          </div>
        )}
        <h2 className="side-heading">Suggested for you</h2>
        {suggestions.map((u) => (
          <UserRow
            key={u.id}
            user={u}
            following={me?.following.includes(u.id) ?? false}
            isSelf={false}
            onOpenProfile={onOpenProfile}
            note="Suggested for you"
          />
        ))}
      </aside>
    </div>
  )
}
