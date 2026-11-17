import { useEffect, useState } from 'react'
import type { AppState } from '../types'
import { markStoryViewed, sendMessage, votePoll } from '../store/store'
import { storiesByUser } from '../store/selectors'
import { ArtImage } from './ArtImage'
import { Avatar } from './Avatar'
import { PollCard } from './PollCard'
import { timeAgo } from '../utils/format'

interface StoryViewerProps {
  userId: string
  state: AppState
  onClose: () => void
  onOpenProfile: (userId: string) => void
}

const AUTO_ADVANCE_MS = 6000

/** Full-screen story viewer: progress bars, tap zones, poll voting, ←/→ keys. */
export function StoryViewer({ userId, state, onClose, onOpenProfile }: StoryViewerProps) {
  const stories = storiesByUser(state, userId)
  const [index, setIndex] = useState(0)
  const [reply, setReply] = useState('')
  const [replied, setReplied] = useState(false)
  const user = state.users.find((u) => u.id === userId)
  const story = stories[index]

  useEffect(() => {
    if (story) markStoryViewed(story.id)
  }, [story])

  useEffect(() => {
    if (!story) return
    const t = window.setTimeout(() => {
      if (index < stories.length - 1) setIndex(index + 1)
      else onClose()
    }, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(t)
  }, [story, index, stories.length, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, stories.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stories.length, onClose])

  if (!user || !story) return null

  return (
    <div className="story-viewer" role="dialog" aria-label={`${user.username}'s story`}>
      <div className="story-progress">
        {stories.map((s, i) => (
          <span
            key={s.id}
            className={`story-progress-seg${i < index ? ' story-progress-seg--done' : ''}${i === index ? ' story-progress-seg--active' : ''}`}
          />
        ))}
      </div>
      <header className="story-viewer-header">
        <button type="button" className="story-viewer-user" onClick={() => { onClose(); onOpenProfile(user.id) }}>
          <Avatar username={user.username} artStyle={user.artStyle} artSeed={user.artSeed} size={32} />
          <span>{user.username} · {timeAgo(story.createdAt)}</span>
        </button>
        <button type="button" className="story-close" onClick={onClose} aria-label="Close story">✕</button>
      </header>
      <div className="story-viewer-art">
        <ArtImage
          artStyle={story.artStyle}
          artSeed={story.artSeed}
          label={`Story artwork by ${user.username}`}
          className="story-art"
        />
        <p className="story-caption">{story.caption}</p>
      </div>
      {story.poll && (
        <PollCard
          poll={story.poll}
          storyId={story.id}
          currentUserId={state.currentUserId}
          onVote={(id, option) => votePoll(id, option)}
        />
      )}
      <form
        className="story-reply"
        onSubmit={(e) => {
          e.preventDefault()
          if (!reply.trim()) return
          sendMessage(user.id, `Re: your story — ${reply.trim()}`)
          setReply('')
          setReplied(true)
          window.setTimeout(() => setReplied(false), 2000)
        }}
      >
        <input
          type="text"
          value={reply}
          maxLength={500}
          placeholder={`Reply to ${user.username}…`}
          aria-label="Reply to this story"
          onChange={(e) => setReply(e.target.value)}
        />
        <button type="submit" className="btn btn--primary btn--sm" disabled={!reply.trim()}>
          {replied ? 'Sent ✓' : 'Send'}
        </button>
      </form>
      <div className="story-nav">
        <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} aria-label="Previous story">‹ Prev</button>
        <button
          type="button"
          onClick={() => {
            if (index < stories.length - 1) setIndex(index + 1)
            else onClose()
          }}
        >
          {index < stories.length - 1 ? 'Next ›' : 'Done ✓'}
        </button>
      </div>
    </div>
  )
}
