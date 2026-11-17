import { useEffect, useRef, useState } from 'react'
import type { AppState } from '../types'
import { markThreadRead, sendMessage } from '../store/store'
import { otherParticipant } from '../store/selectors'
import { ThreadList } from './ThreadList'
import { MessageBubble } from './MessageBubble'
import { Avatar } from './Avatar'
import { EmptyState } from './EmptyState'

interface MessagesViewProps {
  state: AppState
  activeThreadId?: string
  onSelectThread: (threadId: string) => void
  onOpenProfile: (userId: string) => void
  /** When set, open (or create) a thread with this user. */
  startWithUserId?: string
  onStarted: () => void
}

export function MessagesView({
  state,
  activeThreadId,
  onSelectThread,
  onOpenProfile,
  startWithUserId,
  onStarted,
}: MessagesViewProps) {
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeThread = state.threads.find((t) => t.id === activeThreadId)
  const other = activeThread ? otherParticipant(state, activeThread) : undefined

  // Starting a chat from a profile: create/send nothing yet — just pick the
  // existing thread, or remember the user until the first message is sent.
  const [pendingUserId, setPendingUserId] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (startWithUserId) {
      const existing = state.threads.find((t) =>
        t.participantIds.includes(startWithUserId) &&
        t.participantIds.includes(state.currentUserId) &&
        t.participantIds.length === 2,
      )
      if (existing) onSelectThread(existing.id)
      else setPendingUserId(startWithUserId)
      onStarted()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWithUserId])

  useEffect(() => {
    if (activeThreadId) markThreadRead(activeThreadId)
  }, [activeThreadId, state.threads])

  useEffect(() => {
    // jsdom (tests) has no scrollIntoView; guard so the component works there too.
    if (typeof bottomRef.current?.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeThread?.messages.length])

  const send = () => {
    if (!draft.trim()) return
    if (activeThread && other) {
      sendMessage(other.id, draft, activeThread.id)
    } else if (pendingUserId) {
      const msg = sendMessage(pendingUserId, draft)
      if (msg) {
        onSelectThread(msg.threadId)
        setPendingUserId(undefined)
      }
    }
    setDraft('')
  }

  const pendingUser = pendingUserId
    ? state.users.find((u) => u.id === pendingUserId)
    : undefined

  return (
    <div className="messages">
      <ThreadList
        state={state}
        activeThreadId={activeThreadId}
        onSelect={onSelectThread}
        onNewMessage={(userId) => {
          const existing = state.threads.find((t) =>
            t.participantIds.includes(userId) &&
            t.participantIds.includes(state.currentUserId),
          )
          if (existing) onSelectThread(existing.id)
          else setPendingUserId(userId)
        }}
      />
      <div className="chat-pane">
        {activeThread && other ? (
          <>
            <header className="chat-header">
              <button type="button" className="chat-user" onClick={() => onOpenProfile(other.id)}>
                <Avatar username={other.username} artStyle={other.artStyle} artSeed={other.artSeed} size={36} />
                <span>{other.username}</span>
              </button>
            </header>
            <div className="chat-log" aria-live="polite">
              {activeThread.messages.map((m) => (
                <MessageBubble key={m.id} message={m} isMine={m.senderId === state.currentUserId} />
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="chat-form">
              <input
                type="text"
                value={draft}
                maxLength={1000}
                placeholder={`Message ${other.username}…`}
                aria-label="Write a message"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
              />
              <button type="button" className="btn btn--primary btn--sm" disabled={!draft.trim()} onClick={send}>
                Send
              </button>
            </div>
          </>
        ) : pendingUser ? (
          <>
            <header className="chat-header">
              <button type="button" className="chat-user" onClick={() => onOpenProfile(pendingUser.id)}>
                <Avatar username={pendingUser.username} artStyle={pendingUser.artStyle} artSeed={pendingUser.artSeed} size={36} />
                <span>{pendingUser.username}</span>
              </button>
            </header>
            <div className="chat-log">
              <EmptyState title={`Say hi to ${pendingUser.username}`} body="No messages yet — send the first one below." />
            </div>
            <div className="chat-form">
              <input
                type="text"
                value={draft}
                maxLength={1000}
                placeholder={`Message ${pendingUser.username}…`}
                aria-label="Write a message"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send()
                }}
              />
              <button type="button" className="btn btn--primary btn--sm" disabled={!draft.trim()} onClick={send}>
                Send
              </button>
            </div>
          </>
        ) : (
          <EmptyState title="Pick a conversation" body="Choose a thread on the left, or start a new chat with anyone." />
        )}
      </div>
    </div>
  )
}
