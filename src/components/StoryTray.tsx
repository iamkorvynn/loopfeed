import type { AppState } from '../types'
import { liveStories } from '../store/selectors'
import { Avatar } from './Avatar'

interface StoryTrayProps {
  state: AppState
  onOpenStory: (userId: string) => void
}

/** Horizontal tray of live (unexpired) stories, newest first. */
export function StoryTray({ state, onOpenStory }: StoryTrayProps) {
  const stories = liveStories(state)
  // One circle per user, showing their latest live story.
  const latestByUser = new Map<string, (typeof stories)[number]>()
  for (const s of stories) {
    if (!latestByUser.has(s.userId)) latestByUser.set(s.userId, s)
  }
  const entries = [...latestByUser.values()]
  if (entries.length === 0) return null

  return (
    <div className="story-tray" role="list" aria-label="Stories">
      {entries.map((story) => {
        const user = state.users.find((u) => u.id === story.userId)
        if (!user) return null
        const seen = story.viewedBy.includes(state.currentUserId)
        return (
          <button
            key={story.userId}
            type="button"
            role="listitem"
            className="story-item"
            onClick={() => onOpenStory(story.userId)}
            aria-label={`${user.username}'s story${story.poll ? ', includes a poll' : ''}`}
          >
            <Avatar
              username={user.username}
              artStyle={user.artStyle}
              artSeed={user.artSeed}
              size={56}
              ring={!seen}
            />
            <span className="story-username">{user.username}</span>
            {story.poll && <span className="story-poll-badge" aria-hidden="true">📊</span>}
          </button>
        )
      })}
    </div>
  )
}
