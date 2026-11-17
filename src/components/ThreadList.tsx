import type { AppState } from '../types'
import { otherParticipant, sortedThreads } from '../store/selectors'
import { Avatar } from './Avatar'
import { timeAgo } from '../utils/format'

interface ThreadListProps {
  state: AppState
  activeThreadId?: string
  onSelect: (threadId: string) => void
  onNewMessage: (userId: string) => void
}

export function ThreadList({ state, activeThreadId, onSelect, onNewMessage }: ThreadListProps) {
  const threads = sortedThreads(state)
  return (
    <div className="thread-list">
      <h2>Messages</h2>
      {threads.length === 0 && <p className="thread-empty">No conversations yet.</p>}
      {threads.map((t) => {
        const other = otherParticipant(state, t)
        if (!other) return null
        const last = t.messages[t.messages.length - 1]
        const unread = t.messages.filter((m) => m.senderId !== state.currentUserId && !m.read).length
        return (
          <button
            key={t.id}
            type="button"
            className={`thread-item${t.id === activeThreadId ? ' thread-item--active' : ''}`}
            onClick={() => onSelect(t.id)}
            aria-label={`Conversation with ${other.username}${unread > 0 ? `, ${unread} unread` : ''}`}
          >
            <Avatar username={other.username} artStyle={other.artStyle} artSeed={other.artSeed} size={44} />
            <span className="thread-text">
              <span className="thread-name">{other.username}</span>
              <span className="thread-preview">
                {last ? `${last.senderId === state.currentUserId ? 'You: ' : ''}${last.text}` : 'Say hi 👋'}
                {last && ` · ${timeAgo(last.createdAt)}`}
              </span>
            </span>
            {unread > 0 && <span className="badge" aria-label={`${unread} unread messages`}>{unread}</span>}
          </button>
        )
      })}
      <div className="thread-new">
        <h3>Start a new chat</h3>
        {state.users
          .filter((u) => u.id !== state.currentUserId)
          .map((u) => (
            <button key={u.id} type="button" className="thread-new-btn" onClick={() => onNewMessage(u.id)}>
              💬 {u.username}
            </button>
          ))}
      </div>
    </div>
  )
}
